// npm run fxstrip [move ...] [--slow=.25] [--pal=MINT|VIOLET|JADE] [--src=index.html] [--out=dir] -- FRAME STRIPS of the FX library (FX.md).
// Lifts the SHIPPED text between `// FXLIB:START` and `// FXLIB:END` (never a copy), runs it in headless Chromium on a dark floor with a
// stand-in body (a 1.25 m capsule, his height) and the lab's dummy post, fires each move at fixed 60 Hz steps and grabs frames at set
// moments. One PNG per run: a row per move, a column per moment, plus the draw calls and the worst FX frame time it measured.
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
const m = /\/\/ FXLIB:START[\s\S]*?\/\/ FXLIB:END/.exec(src); if (!m) { console.error('no FXLIB markers'); process.exit(1); }
const jm = /\/\* SC_JINRA:START \*\/[\s\S]*?\/\* SC_JINRA:END \*\//.exec(src); if (!jm) { console.error('no SC_JINRA markers'); process.exit(1); }     // THE JINRA PALETTE, also shipped text
const moves = process.argv.slice(2).filter(x => !x.startsWith('--'));
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const opts = { slow: +arg('slow', 1), pal: arg('pal', 'MINT').toUpperCase(), tone: arg('tone', 'SUBTLE').toUpperCase(), moves, times: (arg('t', '') || '').split(',').filter(Boolean).map(Number), W: +arg('w', 360), H: +arg('h', 270) };
const page = `<!doctype html><html><head><script type="importmap">{ "imports": { "three": "./vendor/three.module.min.js" } }</script></head><body style="margin:0;background:#000">
<script type="module">import * as THREE from 'three'; window.THREE = THREE; window.ready = 1;</script></body></html>`;
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/' || u === '/fx.html') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(go => srv.listen(0, go)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await br.newPage(); pg.on('pageerror', e => console.error('PAGE', e.message)); pg.on('console', c => { if (c.type() === 'error') console.error('CONSOLE', c.text()); });
await pg.goto(`http://localhost:${port}/fx.html`); await pg.waitForFunction('window.ready');
const res = await pg.evaluate(([code, jin, o]) => { const THREE = window.THREE; new Function(jin)();
  const make = new Function('THREE', 'scene', 'camera', code + '\nreturn fxLibMake(THREE, scene, camera);');
  const W = o.W, H = o.H, R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x07080c); const cam = new THREE.PerspectiveCamera(55, W / H, .1, 200);
  scene.add(new THREE.HemisphereLight(0x8090b0, 0x101014, .9)); const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(3, 6, 2); scene.add(sun);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x15171d, roughness: .9 })); scene.add(floor);
  const grid = new THREE.GridHelper(40, 40, 0x262a33, 0x1c1f26); grid.position.y = .002; scene.add(grid);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .65, 6, 12), new THREE.MeshStandardMaterial({ color: 0x5a5f6a, roughness: .7 })); body.position.y = .62; scene.add(body);
  const dummy = new THREE.Mesh(new THREE.CylinderGeometry(.3, .38, 1.9, 16), new THREE.MeshStandardMaterial({ color: 0x3a3e48, roughness: .8 })); dummy.position.set(0, .95, 9); scene.add(dummy);
  const FX = make(THREE, scene, cam); FX.pal(o.pal); FX.tone(o.tone);
  const VIEW = { slash: [3.2, 2.0, 2.6, 0, 1.2, .6], punch: [2.6, 1.7, 2.4, 0, 1.25, .8], kick: [2.8, 1.5, 2.2, 0, 1, .7], slam: [5.5, 3.6, 5.5, 0, .3, 0], spin: [4.2, 2.6, 3.6, 0, 1, 0],
    teleport: [6.5, 2.8, 2.5, 0, 1, 2.5], handspring: [5.5, 2.2, 1.6, 0, .8, 1.6], arrow: [5.5, 2.4, 3.5, 0, 1.2, 5.5] };
  const TIMES = { slash: [.04, .1, .16, .22, .3, .42, .6, .85], punch: [.05, .09, .12, .17, .25, .36, .5, .7], kick: [.06, .12, .16, .2, .28, .4, .55, .75], slam: [.02, .06, .12, .2, .3, .45, .65, .9],
    spin: [.1, .2, .32, .45, .58, .72, .85, 1.05], teleport: [.06, .14, .22, .27, .34, .4, .55, .8], handspring: [.08, .16, .24, .34, .46, .6, .7, .9], arrow: [.08, .16, .24, .3, .34, .42, .6, .85] };
  const list = o.moves.length ? o.moves : FX.names, cols = o.times.length || 8, out = document.createElement('canvas'); out.width = cols * W; out.height = list.length * (H + 18) + 22;
  const c2 = out.getContext('2d'); c2.fillStyle = '#000'; c2.fillRect(0, 0, out.width, out.height); c2.font = '13px monospace'; let worst = 0, peak = { blobs: 0, sparks: 0 }, calls = 0;
  list.forEach((name, row) => { FX.clear(); FX.S.k = 1; const V = VIEW[name] || VIEW.slash; cam.position.set(V[0], V[1], V[2]); cam.lookAt(V[3], V[4], V[5]); cam.updateMatrixWorld();
    const O = new THREE.Vector3(0, 0, 0), ts = (o.times.length ? o.times : TIMES[name] || TIMES.slash).map(t => t / o.slow);
    FX.fire(name, O, 0, { at: new THREE.Vector3(0, 1.3, 8.7) }); FX.S.k = o.slow; let t = 0, k = 0; const dt = 1 / 60;
    while (k < ts.length) { const t0 = performance.now(); FX.step(dt); worst = Math.max(worst, performance.now() - t0); t += dt; const c = FX.count(); peak.blobs = Math.max(peak.blobs, c.blobs); peak.sparks = Math.max(peak.sparks, c.sparks);
      if (t >= ts[k] - 1e-6) { R.render(scene, cam); calls = Math.max(calls, R.info.render.calls); c2.drawImage(R.domElement, k * W, 22 + row * (H + 18) + 18);
        c2.fillStyle = '#9ff'; c2.fillText((k ? '' : name.toUpperCase() + '  ') + (ts[k] * o.slow).toFixed(2) + 's', k * W + 6, 22 + row * (H + 18) + 13); k++; } } });
  c2.fillStyle = '#fff'; c2.fillText('FX STRIP  palette ' + o.pal + '  tone ' + o.tone + '  slow x' + o.slow + '  calls<=' + calls + '  peak blobs ' + peak.blobs + ' sparks ' + peak.sparks + '  worst sim+upload ' + worst.toFixed(2) + ' ms (swiftshader)', 6, 15);
  return { png: out.toDataURL('image/png'), calls, worst, peak }; }, [m[0], jm[0], opts]);
const file = path.join(OUT, 'fx_' + (moves.join('_') || 'all') + '_' + opts.pal.toLowerCase() + (opts.slow !== 1 ? '_slow' : '') + '_' + opts.tone.toLowerCase() + '.png');
fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
console.log(file, 'calls', res.calls, 'worst ms', res.worst.toFixed(2), 'peak', JSON.stringify(res.peak));
await br.close(); srv.close();
