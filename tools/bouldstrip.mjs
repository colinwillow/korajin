// npm run bouldstrip [shot ...] [--t=4] [--w=480] [--h=300] [--cols=2] [--out=dir] -- A CONTACT SHEET of Floating Boulders (BOULDERS.md).
// Lifts the SHIPPED text between `// BOULDLIB:START` and `// BOULDLIB:END` (never a copy), builds it in headless Chromium under a plain sun and
// sky, stands a 1.75 m capsule on his landing for scale, steps `t` seconds of the field's motion and renders every camera in `F.shots`.
// `--frames=N --dt=.5` renders ONE shot N times, dt apart (a motion strip). One PNG; the draws, tris and rock counts are on it.
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
const m = /\/\/ BOULDLIB:START[\s\S]*?\/\/ BOULDLIB:END/.exec(src); if (!m) { console.error('no BOULDLIB markers'); process.exit(1); }
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const opts = { shots: process.argv.slice(2).filter(x => !x.startsWith('--')), t: +arg('t', 4), W: +arg('w', 480), H: +arg('h', 300), cols: +arg('cols', 2), frames: +arg('frames', 0), dt: +arg('dt', .5), night: +arg('night', 0), push: arg('push', ''), walkOn: +arg('walk', 0), list: +arg('list', 0), smash: arg('smash', ''), slice: arg('slice', ''), shock: arg('shock', ''), eye: arg('eye', ''), crack: arg('crack', ''), aura: +arg('aura', 0), follow: +arg('follow', 0) };
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
  const scene = new THREE.Scene(); scene.background = new THREE.Color(o.night ? 0x0b0e1a : 0xcfd8e2); scene.fog = new THREE.Fog(scene.background, 40, 110); const cam = new THREE.PerspectiveCamera(55, W / H, .1, 400);
  const B = new Function('THREE', 'scene', 'O', code + '\nreturn bouldMake(THREE, scene, O);')(THREE, scene, { tex: p => './' + p, pal: { glow: 0x5effd0 }, sun: new THREE.Vector3(20, 30, 14) }); const build = performance.now() - t0;
  const hemi = new THREE.HemisphereLight(o.night ? 0x334466 : 0xdfe8f0, o.night ? 0x111118 : 0x9a8f80, o.night ? .5 : 1.3), sun = new THREE.DirectionalLight(o.night ? 0x8090c0 : 0xfff2e0, o.night ? .5 : 2.4);
  sun.position.set(20, 30, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, far: 120 }); sun.target.position.set(0, 0, -6); scene.add(hemi, sun, sun.target);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(.32, 1.1, 6, 12), new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: .7 })); body.castShadow = true; body.position.set(B.F.clear[0], .87, B.F.clear[1]); scene.add(body);
  await new Promise(go => setTimeout(go, 1500));     // the textures
  if (B.sky && !o.night) { const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromEquirectangular(B.sky).texture; scene.environmentIntensity = B.F.sky.envK; scene.background = B.sky; scene.fog = null; hemi.intensity *= .5; }     // m2458: the painted desert sky as the light and the backdrop
  if (o.smash) for (const id of o.smash.split(',')) { const r = B.rows.find(q => q.id === id); if (r) { B.knock(r, 1, .3, -1, 3); B.smash(r, 1, -1); } }
  if (o.slice) for (const id of o.slice.split(',')) { const r = B.rows.find(q => q.id === id); if (r) B.slice(r, new THREE.Vector3(1, .35, 0).normalize()); }
  if (o.crack) for (const id of (o.crack === 'all' ? B.rows.map(q => q.id) : o.crack.split(','))) { const r = B.rows.find(q => q.id === id); if (r) { B.damage(r, r.hp0 * .85, 'heavy'); } }
  const P = o.push ? o.push.split(',').map(Number) : null;     // --push=x0,z0,x1,z1: walk the capsule between two points during t (pass 2)
  const n0 = Math.round(o.t * 30); for (let i = 0; i < n0; i++) { if (P && B.player) { const k = i / Math.max(1, n0 - 1); body.position.set(P[0] + (P[2] - P[0]) * k, .87, P[1] + (P[3] - P[1]) * k); B.player(body.position.x, 0, body.position.z, (P[2] - P[0]) / o.t, (P[3] - P[1]) / o.t, 1 / 30); body.position.x += B.fix.x; body.position.z += B.fix.z; if (B.plough) { const vx = (P[2] - P[0]) / o.t, vz = (P[3] - P[1]) / o.t; B.plough(body.position.x + Math.cos(i * 1.6) * .12, body.position.z, .15, .09, vx, vz, 2.4); B.plough(body.position.x, body.position.z, .25, .075, vx, vz, 2.7, .8); B.relax(body.position.x, body.position.z, 1 / 30); B.patchAt(body.position.x, body.position.z); } if (B.kick && i % 8 === 0) B.kick(body.position.x, 0, body.position.z, 5, { spread: 1, up: .6, k: 1 }); } if (o.aura) B.aura(1, body.position.x, 0, body.position.z); B.step(1 / 30); }
  let list = o.shots.length ? B.F.shots.filter(s => o.shots.includes(s.id)) : B.F.shots;
  if (o.frames) list = Array.from({ length: o.frames }, (_, k) => Object.assign({}, list[0], { why: 't+' + (k * o.dt).toFixed(1) + 's', k }));
  const cols = Math.min(o.cols, list.length), rows = Math.ceil(list.length / cols);
  const out = document.createElement('canvas'); out.width = cols * W; out.height = rows * (H + 20) + 22; const c2 = out.getContext('2d'); c2.fillStyle = '#000'; c2.fillRect(0, 0, out.width, out.height); c2.font = '12px monospace';
  let calls = 0, tris = 0;
  list.forEach((s, k) => { if (k === 0 && o.shock) { const [x, z, kk] = o.shock.split(',').map(Number); B.follow(x, z); B.patchAt(x, z); B.shock(x, z, kk || 1); } if (o.frames && k) for (let i = 0; i < Math.round(o.dt * 30); i++) { if (P && o.walkOn) { body.position.z -= 4 / 30; B.player(body.position.x, 0, body.position.z, 0, -4, 1 / 30); body.position.x += B.fix.x; body.position.z += B.fix.z; if (B.plough) { B.plough(body.position.x + Math.cos(i * 1.6) * .12, body.position.z, .15, .09, 0, -4, 2.4); B.plough(body.position.x, body.position.z, .25, .075, 0, -4, 2.7, .8); B.relax(body.position.x, body.position.z, 1 / 30); B.patchAt(body.position.x, body.position.z); } B.stamp && B.stamp(body.position.x + Math.cos(i * 1.6) * .14, body.position.z, .13, .03); if (B.kick && i % 8 === 0) B.kick(body.position.x, 0, body.position.z, 5, { spread: 1, up: .6, k: 1 }); } if (P && !o.walkOn) B.player(body.position.x, 0, body.position.z, 0, 0, 1 / 30); if (o.aura) B.aura(1, body.position.x, 0, body.position.z); B.step(1 / 30); } if (o.shock) { const [x, z] = o.shock.split(',').map(Number); (window.__dbg = window.__dbg || []).push(s.why + ' ' + B.waves() + ' ' + [0, .5, 1, 1.5, 2, 2.5, 3, 4, 5, 6].map(r => B.heightAt(x + r, z).toFixed(3)).join(' ')); } B.shotCam(s, cam); if (o.eye) { const e = o.eye.split(',').map(Number); cam.position.set(e[0], e[1], e[2]); cam.lookAt(e[3], e[4], e[5]); cam.updateMatrixWorld(); } if (o.follow) { cam.position.set(body.position.x + 3.5, 3.2, body.position.z + 6.5); cam.lookAt(body.position.x, 1, body.position.z); } B.px(cam, H); R.render(scene, cam); calls = Math.max(calls, R.info.render.calls); tris = Math.max(tris, R.info.render.triangles);
    const x = (k % cols) * W, y = 22 + Math.floor(k / cols) * (H + 20); c2.drawImage(R.domElement, x, y + 20); c2.fillStyle = '#9ff'; c2.fillText(s.id + ' -- ' + s.why, x + 4, y + 14); });
  const n = Object.assign(B.count(), { maxO: +Math.max(...B.rows.map(r => Math.hypot(r.o.x, r.o.z))).toFixed(2), moved: B.rows.filter(r => Math.hypot(r.o.x, r.o.z) > .1).length, slow: +B.slow().toFixed(2) }); c2.fillStyle = '#fff'; c2.fillText('FLOATING BOULDERS  t=' + o.t + 's  calls<=' + calls + ' (incl. shadow pass)  tris<=' + tris + '  ' + JSON.stringify(n), 6, 15);
  return { png: out.toDataURL('image/png'), calls, tris, build, n, dbg: window.__dbg, rows: B.rows.slice(0, +(o.list || 0)).map(r => r.id + ' ' + r.sp + ' x' + r.x.toFixed(1) + ' z' + r.z.toFixed(1) + ' s' + r.s.toFixed(2) + ' y' + r.p.y.toFixed(2) + ' v' + r.v + ' cr' + (r.cr || 0).toFixed(2) + ' hp0 ' + (+r.hp0).toFixed(1) + ' ' + (r.m && r.m.name) + (r.rest ? ' REST' : '')) }; }, [m[0], opts]);
const file = path.join(OUT, 'boulders_' + (opts.shots.join('_') || 'all') + (opts.frames ? '_f' + opts.frames : '') + (opts.night ? '_night' : '') + '.png');
fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
if (res.rows.length) console.log(res.rows.join('\n'));
if (res.dbg) console.log(res.dbg.join("\n"));
console.log(file, 'calls', res.calls, 'tris', res.tris, 'build ms', res.build.toFixed(0), JSON.stringify(res.n));
await br.close(); srv.close();
