// npm run lakestrip [shot ...] [--t=6] [--cruise=0] [--w=480] [--h=300] [--mirror=0] [--src=index.html] [--out=dir] -- A CONTACT SHEET of The Lake (WATER.md).
// Lifts the SHIPPED text between `// LAKELIB:START` and `// LAKELIB:END` (never a copy), builds it in headless Chromium with the lights its own
// table names (the game re-aims its sun and sky to the same numbers), stands a 1.75 m capsule on the spawn for scale, and renders every camera
// in `W.shots` (the rows between SC_LAKE markers) after `t` seconds of waves. One PNG: a tile per shot, its id and why, the draw calls and tris.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const src = fs.readFileSync(path.resolve(ROOT, arg('src', 'index.html')), 'utf8');
const m = /\/\/ LAKELIB:START[\s\S]*?\/\/ LAKELIB:END/.exec(src); if (!m) { console.error('no LAKELIB markers'); process.exit(1); }
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const opts = { shots: process.argv.slice(2).filter(x => !x.startsWith('--')), t: +arg('t', 6), W: +arg('w', 480), H: +arg('h', 300), mirror: +arg('mirror', 1), cols: +arg('cols', 3), cruise: +arg('cruise', 1) };
const page = `<!doctype html><html><head><script type="importmap">{ "imports": { "three": "./vendor/three.module.min.js" } }</script></head><body style="margin:0;background:#000">
<script type="module">import * as THREE from 'three'; window.THREE = THREE; window.ready = 1;</script></body></html>`;
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/' || u === '/lake.html') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(go => srv.listen(0, go)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await br.newPage(); pg.on('pageerror', e => console.error('PAGE', e.message)); pg.on('console', c => { if (c.type() === 'error' || c.type() === 'warning') console.error('CONSOLE', c.text().slice(0, 600)); });
await pg.goto(`http://localhost:${port}/lake.html`); await pg.waitForFunction('window.ready');
const res = await pg.evaluate(([code, o]) => { const THREE = window.THREE, t0 = performance.now();
  const W = o.W, H = o.H, R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.NeutralToneMapping;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, .1, 4000);
  const L = new Function('THREE', 'scene', 'O', code + '\nreturn lakeMake(THREE, scene, O);')(THREE, scene, { mirror: o.mirror }); const build = performance.now() - t0;
  const Li = L.light, hemi = new THREE.HemisphereLight(new THREE.Color(...Li.sky), new THREE.Color(...Li.gnd), Li.hI), sun = new THREE.DirectionalLight(new THREE.Color(...Li.col), Li.I);
  sun.position.copy(Li.dir).multiplyScalar(100); scene.add(hemi, sun); hemi.layers.enable(Li.layer); sun.layers.enable(Li.layer);     // the mirror sees layer `Li.layer` only, and three culls LIGHTS by layer too
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.32, 1.1, 6, 12), new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: .7 })); body.position.set(L.spawn[0], L.spawn[1] + .87, L.spawn[2]); scene.add(body);
  if (o.cruise && L.boat) L.boat.setMode('cruise');     // the wake needs a moving boat (pass 3)
  for (let i = 0; i < Math.round(o.t * 30); i++) L.step(1 / 30);
  const list = o.shots.length ? L.W.shots.filter(s => o.shots.includes(s.id)) : L.W.shots, cols = Math.min(o.cols, list.length), rows = Math.ceil(list.length / cols);
  const out = document.createElement('canvas'); out.width = cols * W; out.height = rows * (H + 20) + 22; const c2 = out.getContext('2d'); c2.fillStyle = '#000'; c2.fillRect(0, 0, out.width, out.height); c2.font = '12px monospace';
  let calls = 0, tris = 0, worst = 0;
  list.forEach((s, k) => { L.shotCam(s, cam); const r0 = performance.now(); R.render(scene, cam); worst = Math.max(worst, performance.now() - r0); calls = Math.max(calls, R.info.render.calls); tris = Math.max(tris, R.info.render.triangles);
    const x = (k % cols) * W, y = 22 + Math.floor(k / cols) * (H + 20); c2.drawImage(R.domElement, x, y + 20); c2.fillStyle = '#9ff'; c2.fillText(s.id + ' -- ' + s.why, x + 4, y + 14); });
  const n = L.count(); c2.fillStyle = '#fff'; c2.fillText('THE LAKE  t=' + o.t + 's  mirror ' + (o.mirror ? 'ON' : 'OFF') + '  calls<=' + calls + '  tris<=' + tris + '  terrain ' + n.terrainTris + '  stacks ' + n.stackTris + '  water ' + n.waterTris + '  build ' + build.toFixed(0) + ' ms', 6, 15);
  return { png: out.toDataURL('image/png'), calls, tris, build, n, spawn: L.spawn, mirrorN: L.mirrorN || 0 }; }, [m[0], opts]);
const file = path.join(OUT, 'lake_' + (opts.shots.join('_') || 'all') + (opts.mirror ? '' : '_nomirror') + '.png');
fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
console.log(file, 'calls', res.calls, 'tris', res.tris, 'build ms', res.build.toFixed(0), 'mirror renders', res.mirrorN, 'spawn', res.spawn.map(v => v.toFixed(1)).join(','), JSON.stringify(res.n));
await br.close(); srv.close();
