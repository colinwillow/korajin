// npm run collcourse [--fps=30] [--boxes] -- THE COLLIDER'S EDGE-CASE COURSE (COLL.md). Boots the SHIPPED page headless on the empty forge floor
// (`?w=forge&entry=0`), builds a row of test pieces out of plain drawn meshes far from the spawn (so the mesh collider -- the `auto` row -- takes
// them like any level geometry), rebuilds the store round them, then drives him through each with the real pads on a fake clock and scores it:
//   stairs     12 risers of .30 / treads .42: reaches the top, speed flat (no frame under 75% of the median after the start)
//   lip50      a .50 m block: stepped onto (feet reach .5)          lip70   a .70 m block: NOT stepped (a wall: a jump)
//   seam       two .20 slabs 1 cm apart, 1 cm out of level: crossed at full speed, no stall
//   thinwall   a 5 cm wall, run into at full speed: never passed      slope30 walked up    slope50 not walked up (too steep)
//   corner     a 60-degree V, run into its apex for 1.5 s then out: not trapped
//   ceil100    a slab at 1.00 m (under his 1.14): stops him, never pushes him through the floor      ceil130 at 1.30: walked under
//   door       a wall with a .9 m gap: walked through
// Every piece is ITS OWN lane (z), and he starts 3 m short of it on the floor at y 0. Exit 1 if any row fails.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('collcourse: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const A = process.argv.slice(2), FPS = +((A.find(a => a.startsWith('--fps=')) || '--fps=30').slice(6)), BOXM = A.includes('--boxes');
const HANDLE = 'window.__cc = { frameBody, player, cam, COLL, STEPUP, groundAt, godTo, renderer, rig, MOVE, scene, THREE, BOXES, boxGrid }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, HANDLE + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body);
});
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now();
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(m => { try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', m); } catch (e) {} }, BOXM ? 'boxes' : 'mesh');
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));

function course(o) {
  const S = window.__cc, T = S.THREE, p = S.player, clk = window.__clock;
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  let pid = 100; const el = document.getElementById('padL'); let id = null;
  const at = (x, y) => { const r = el.getBoundingClientRect(), Rr = Math.max(8, r.width * 52 / 132); return { clientX: r.left + r.width / 2 + x * Rr, clientY: r.top + r.height / 2 + y * Rr }; };
  const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: id, bubbles: true, cancelable: true, pointerType: 'touch', isPrimary: true }, at(x, y))));
  const down = () => { if (id === null) { id = ++pid; ev('pointerdown', 0, 0); } }, up = () => { if (id !== null) { ev('pointerup', 0, 0); id = null; } };
  const steer = (wx, wz) => { const az = isFinite(S.cam.az) ? S.cam.az : 0, sa = Math.sin(az), ca = Math.cos(az); down(); ev('pointermove', wz * sa - wx * ca, -(wx * sa + wz * ca)); };
  // ---- the pieces: lanes along z, each starts at x = X0 and runs +x
  const X0 = 300, G = new T.Group(); G.name = 'collcourse'; S.scene.add(G); const M = new T.MeshStandardMaterial({ color: 0x8899aa, roughness: .8 }), lanes = {};
  const box = (x0, x1, y0, y1, z0, z1, rot) => { const m = new T.Mesh(new T.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), M); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); if (rot) m.rotation.y = rot; G.add(m); return m; };
  const ramp = (x0, len, deg, z0, z1) => { const h = Math.tan(deg * Math.PI / 180) * len, g = new T.BufferGeometry(), P = [x0, 0, z0, x0 + len, h, z0, x0 + len, h, z1, x0, 0, z1, x0 + len, 0, z0, x0 + len, 0, z1];
    g.setAttribute('position', new T.Float32BufferAttribute(P, 3)); g.setIndex([0, 2, 1, 0, 3, 2, 1, 2, 5, 1, 5, 4, 0, 1, 4, 3, 5, 2]); g.computeVertexNormals(); G.add(new T.Mesh(g, M)); return h; };
  let z = 0; const lane = (k, f) => { lanes[k] = { z, ...f(z) }; z += 8; };
  lane('stairs', z => { for (let i = 0; i < 12; i++) box(X0 + i * .42, X0 + 12 * .42 + 2, 0, (i + 1) * .3, z - 1.5, z + 1.5); return { to: X0 + 12 * .42 + 1.2, want: 3.6 }; });
  lane('lip50', z => { box(X0, X0 + 3, 0, .5, z - 1.5, z + 1.5); return { to: X0 + 1.5, want: .5 }; });
  lane('lip70', z => { box(X0, X0 + 3, 0, .7, z - 1.5, z + 1.5); return { to: X0 + 1.5, want: 0 }; });
  lane('seam', z => { box(X0, X0 + 2, 0, .2, z - 1.5, z + 1.5); box(X0 + 2.01, X0 + 4, 0, .21, z - 1.5, z + 1.5); return { to: X0 + 3.5, want: .21 }; });
  lane('thinwall', z => { box(X0, X0 + .05, 0, 2, z - 2, z + 2); return { to: X0 + 2, want: 0, wall: X0 }; });
  lane('slope30', z => ({ to: X0 + 5.5, want: ramp(X0, 6, 30, z - 1.5, z + 1.5) * .85 }));
  lane('slope50', z => ({ to: X0 + 5.5, want: 0, cap: ramp(X0, 6, 50, z - 1.5, z + 1.5) * .5 }));
  lane('corner', z => { const a = box(X0, X0 + 3, 0, 2, z - .05, z + .05, Math.PI / 6); a.position.set(X0 + 1.3, 1, z + .75); const b = box(X0, X0 + 3, 0, 2, z - .05, z + .05, -Math.PI / 6); b.position.set(X0 + 1.3, 1, z - .75); return { to: X0 + 3, want: 0 }; });
  lane('ceil100', z => { box(X0 + 1, X0 + 4, 1.0, 1.3, z - 1.5, z + 1.5); return { to: X0 + 3, want: 0 }; });
  lane('ceil130', z => { box(X0 + 1, X0 + 4, 1.3, 1.6, z - 1.5, z + 1.5); return { to: X0 + 4.5, want: 0 }; });
  lane('door', z => { box(X0, X0 + .3, 0, 2.4, z - 3, z - .45); box(X0, X0 + .3, 0, 2.4, z + .45, z + 3); box(X0, X0 + .3, 2.1, 2.4, z - .45, z + .45); return { to: X0 + 2, want: 0 }; });
  G.updateMatrixWorld(true);
  // ---- put him at the course and rebuild the store round it (the auto row builds round where he stands)
  S.godTo(X0 - 3, 0, 20, Math.PI / 2); p.vel.set(0, 0, 0); for (let i = 0; i < 20; i++) frame();
  if (S.COLL.zone) { S.COLL.built = 0; S.COLL.autoS = null; for (let i = 0; i < 600 && S.COLL.built !== 1; i++) S.COLL.tick(); }
  const out = { mode: S.COLL.mode + (S.COLL.on ? ' on' : ' off'), tris: S.COLL.stat.tris, rows: [] };
  const run = (k, sec, dir) => { const L = lanes[k]; S.godTo(X0 - 3, 0, L.z, Math.PI / 2); p.vel.set(0, 0, 0); for (let i = 0; i < 10; i++) frame(); const sp = [], tr = { maxY: 0, minY: 9, maxX: -1e9 };
    for (let i = 0, n = Math.round(sec * o.fps); i < n; i++) { const d = typeof dir === 'function' ? dir(i / o.fps) : [1, 0]; steer(d[0], d[1]); frame(); sp.push(Math.hypot(p.vel.x, p.vel.z)); tr.maxY = Math.max(tr.maxY, p.pos.y); tr.minY = Math.min(tr.minY, p.pos.y); tr.maxX = Math.max(tr.maxX, p.pos.x); if (!(typeof dir === 'function') && p.pos.x >= L.to) break; }
    up(); tr.x = p.pos.x; tr.y = p.pos.y; tr.z = p.pos.z; const run2 = sp.slice(Math.round(o.fps * .6)).slice().sort((a, b) => a - b), med = run2[run2.length >> 1] || 0; tr.med = med; tr.slow = sp.slice(Math.round(o.fps * .6)).filter(v => v < med * .75).length; return tr; };
  const row = (k, ok, why) => out.rows.push([k, ok ? 'PASS' : 'FAIL', why]);
  { const r = run('stairs', 4); row('stairs', r.maxY >= 3.5 && r.slow === 0, `top ${r.maxY.toFixed(2)} of 3.6, median ${r.med.toFixed(1)} m/s, slow frames ${r.slow}`); }
  { const r = run('lip50', 3); row('lip50', r.maxY >= .48, `feet reached ${r.maxY.toFixed(2)}`); }
  { const r = run('lip70', 2.5); row('lip70', r.maxY < .1 && r.maxX < X0, `feet ${r.maxY.toFixed(2)}, x ${r.maxX.toFixed(2)} (block at ${X0})`); }
  { const r = run('seam', 3); row('seam', r.maxY >= .2 && r.x >= lanes.seam.to - .1 && r.slow === 0, `crossed to x ${r.x.toFixed(2)}, slow frames ${r.slow}`); }
  { const r = run('thinwall', 2.5); row('thinwall', r.maxX < X0, `furthest x ${r.maxX.toFixed(3)} (wall face ${X0})`); }
  { const r = run('slope30', 4); row('slope30', r.maxY >= lanes.slope30.want, `reached ${r.maxY.toFixed(2)} (want ${lanes.slope30.want.toFixed(2)})`); }
  { const r = run('slope50', 3); row('slope50', r.maxY <= lanes.slope50.cap, `reached ${r.maxY.toFixed(2)} (a wall: must stay under ${lanes.slope50.cap.toFixed(2)})`); }
  { const r = run('corner', 2.5, t => t < 1.5 ? [1, 0] : [-1, 0]); row('corner', r.x < X0 - .5, `after 1 s backing out he is at x ${r.x.toFixed(2)} (free if < ${X0 - .5})`); }
  { const r = run('ceil100', 2.5); row('ceil100', r.maxX < X0 + 1 && r.minY > -.05, `furthest x ${r.maxX.toFixed(2)} (slab at ${X0 + 1}), lowest feet ${r.minY.toFixed(2)}`); }
  { const r = run('ceil130', 3); row('ceil130', r.x >= lanes.ceil130.to - .1 && r.minY > -.05, `walked to x ${r.x.toFixed(2)}`); }
  { const L = lanes.thinwall; let worst = -1e9; for (const v of [20, 40]) { S.godTo(X0 - 2, 1.2, L.z, Math.PI / 2); for (let i = 0; i < 3; i++) frame(); p.grounded = false; p.pos.set(X0 - 2, 1.2, L.z); p.vel.set(v, 0, 0);
      for (let i = 0; i < Math.round(o.fps * .4); i++) { frame(); worst = Math.max(worst, p.pos.x); } }
    row('thinfast', worst < X0, `launched at 20 and 40 m/s (a zip, a dash) into the 5 cm wall: furthest x ${worst.toFixed(3)} (face ${X0}), swept ${S.COLL.stat.swept || 0}`); }
  { const r = run('door', 2.5); row('door', r.x >= lanes.door.to - .1, `walked to x ${r.x.toFixed(2)}`); }
  return out;
}
let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__cc && document.getElementById('boot').classList.contains('gone') && window.__cc.rig.ready, null, { timeout: 240000, polling: 1000 });
  await page.waitForTimeout(3000);
  await page.evaluate(f => { const S = window.__cc; window.__clock = { t: performance.now(), dt: 1000 / f }; performance.now = () => window.__clock.t; S.renderer.render = () => {}; }, FPS);
  const R = await page.evaluate(course, { fps: FPS });
  console.log(`== collcourse  ${FPS} fps  collider ${R.mode} (${R.tris} tris)  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  for (const r of R.rows) { console.log(`  ${r[1]}  ${r[0].padEnd(9)} ${r[2]}`); if (r[1] !== 'PASS') code = 1; }
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 4).join(' || '));
await browser.close(); server.close(); process.exit(code);
