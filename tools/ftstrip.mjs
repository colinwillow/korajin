// npm run ftstrip [shot ...] [--w=480] [--h=300] [--cols=2] [--night=1] [--src=index.html] -- A CONTACT SHEET of the FOREST TEMPLE (FOREST_TEMPLE.md).
// Lifts the SHIPPED text between `// FTKLIB:START` and `// FTKLIB:END` (never a copy), builds it in headless Chromium under the zone's own
// underground light (`F.env`: a dim teal fill, the daylight from the cracks above), stands a 1.75 m capsule at the spawn for scale and renders
// every camera in `F.shots` (or the ones named). One PNG; draws, tris, boxes on it. `--set=chamber` builds another placement set when there is one.
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
const m = /\/\/ FTKLIB:START[\s\S]*?\/\/ FTKLIB:END/.exec(src); if (!m) { console.error('no FTKLIB markers'); process.exit(1); }
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const opts = { shots: process.argv.slice(2).filter(x => !x.startsWith('--')), W: +arg('w', 480), H: +arg('h', 300), cols: +arg('cols', 2), night: +arg('night', 0), set: arg('set', ''), t: +arg('t', 1) };
const page = `<!doctype html><html><head><script type="importmap">{ "imports": { "three": "./vendor/three.module.min.js" } }</script></head><body style="margin:0;background:#000">
<script type="module">import * as THREE from 'three'; window.THREE = THREE; window.ready = 1;</script></body></html>`;
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/' || u === '/b.html') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(go => srv.listen(0, go)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await br.newPage(); pg.on('pageerror', e => console.error('PAGE', e.message)); pg.on('console', c => { if (c.type() === 'error' || c.type() === 'warning') console.error('CONSOLE', c.text().slice(0, 600)); });
await pg.goto(`http://localhost:${port}/b.html`); await pg.waitForFunction('window.ready');
const res = await pg.evaluate(async ([code, o]) => { const THREE = window.THREE, t0 = performance.now();
  const W = o.W, H = o.H, R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.NeutralToneMapping; R.shadowMap.enabled = true;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, .1, 400);
  const L = new Function('THREE', 'O', code + '\nreturn ftkMake(THREE, O);')(THREE, { tex: p => './' + p, pal: { glow: 0x7affd8, core: 0xe6fff8, deep: 0x1f8a74, spark: 0xb6ffe8 }, set: o.set }); const build = performance.now() - t0;
  scene.add(L.group); const E = L.F.env, N = o.night ? E.night : E;
  scene.background = new THREE.Color(N.bg); scene.fog = new THREE.Fog(N.bg, N.fog[0], N.fog[1]);
  const hemi = new THREE.HemisphereLight(N.sky, N.ground, N.hemi), sun = new THREE.DirectionalLight(N.sunC, N.sun); sun.position.set(...E.sunDir.map(v => v * 40)); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, far: 140 }); scene.add(hemi, sun, sun.target);
  const sp = L.F.spawn, body = new THREE.Mesh(new THREE.CapsuleGeometry(.32, 1.1, 6, 12), new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: .7 })); body.castShadow = true; body.position.set(sp.at[0], sp.at[1] + .87, sp.at[2]); scene.add(body);
  await new Promise(go => setTimeout(go, 2500));     // the textures
  for (let i = 0; i < 30 * o.t; i++) L.step(1 / 30);
  const list = o.shots.length ? L.F.shots.filter(s => o.shots.includes(s.id)) : L.F.shots;
  const cols = Math.min(o.cols, list.length), rows = Math.ceil(list.length / cols);
  const out = document.createElement('canvas'); out.width = cols * W; out.height = rows * (H + 20) + 22; const c2 = out.getContext('2d'); c2.fillStyle = '#000'; c2.fillRect(0, 0, out.width, out.height); c2.font = '12px monospace';
  let calls = 0, tris = 0;
  list.forEach((s, k) => { cam.position.set(...s.eye); cam.lookAt(...s.at); cam.updateMatrixWorld(); L.px(cam, H); R.render(scene, cam); calls = Math.max(calls, R.info.render.calls); tris = Math.max(tris, R.info.render.triangles);
    const x = (k % cols) * W, y = 22 + Math.floor(k / cols) * (H + 20); c2.drawImage(R.domElement, x, y + 20); c2.fillStyle = '#9ff'; c2.fillText(s.id + ' -- ' + s.why, x + 4, y + 14); });
  const n = L.count(); c2.fillStyle = '#fff'; c2.fillText('FOREST TEMPLE' + (o.set ? ' [' + o.set + ']' : ' [kit]') + '  calls<=' + calls + ' (incl. shadow pass)  tris<=' + tris + '  ' + JSON.stringify(n), 6, 15);
  return { png: out.toDataURL('image/png'), calls, tris, build, n }; }, [m[0], opts]);
const file = path.join(OUT, 'ftemple_' + (opts.set || 'kit') + '_' + (opts.shots.join('_') || 'all') + (opts.night ? '_night' : '') + '.png');
fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
console.log(file, 'calls', res.calls, 'tris', res.tris, 'build ms', res.build.toFixed(0), JSON.stringify(res.n));
await br.close(); srv.close();
