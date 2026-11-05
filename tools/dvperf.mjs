// npm run dvperf -- THE SUNWELL'S BUDGET FROM THE REAL PLAY CAMERA (DESERT_VILLAGE.md). Boots the shipped page like `dvwalk` (fake clock,
// `frameBody()` stepped by hand), stands him at each spot, steps 90 frames (so every per-frame LOD -- the field's, the village's detail, the
// villagers', the shadow switches -- has run), then renders ONE frame through the game's own camera and reads renderer.info (calls / triangles,
// the shadow pass included). `aerial` lifts the camera after the steps. Prints one line per spot.
// (dvwalk's header follows, for the boot it shares:)
// npm run dvwalk -- WALK THE SUNWELL'S ROUTE IN THE SHIPPED PAGE (DESERT_VILLAGE.md). The `walktest` pattern: headless, a fake clock,
// `frameBody()` stepped by hand at 1/60 s, PointerEvents into the shipped pads. He starts on the well court and climbs every link of the spiral
// (L0 stair .. L6 hanging stair) at full stick; on a HOP he runs at the stone and taps the right pad (jump) a stride before the edge. A leg passes
// when he arrives within .8 m of its target standing at the target's height (+-.35 m); a FALL is any drop of more than 2 m below the leg's lower end.
// The thumb never lifts between legs: a lift from a pushed stick reads as a FLICK (the backflip dodge) and throws him off a stone.
// Prints one line per leg and exits 1 on a failed leg. MESH collision (the desert COLL row).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('dvwalk: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HANDLE = 'window.__wt = { frameBody, player, cam, COLL, groundAt, renderer, rig, MOVE, DVIL, DVILLAGE, camera, scene }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', HANDLE + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(() => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', 'mesh'); } catch (e) {} });
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
function measure() {
  const S = window.__wt, p = S.player, clk = window.__clock, D = S.DVIL, [ox, oz] = D.o, y0 = D.y0, G = D.R.geo, R = S.renderer, real = window.__real, out = [];
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  const spots = [['gate', [-44, 0, 0, Math.PI / 2]], ['avenue', [-30, 0, 0, Math.PI / 2]], ['court', [-8, 0, 0, Math.PI / 2]], ['court-back', [6, 0, 0, -Math.PI / 2]],
    ...G.isles.map(I => [I.id, [I.u - Math.cos(I.th * Math.PI / 180) * 2.5, I.y, I.v - Math.sin(I.th * Math.PI / 180) * 2.5, Math.atan2(-I.u, -I.v)]]), ['aerial', [-8, 0, 0, Math.PI / 2], 1], ['landing', null]];     /* the landing LAST: out there the villagers are let go */
  for (const [id, at, aer] of spots) {
    if (at) { p.pos.set(ox + at[0], y0 + at[1] + .1, oz + at[2]); p.faceH = p.heading = S.cam.az = at[3]; }
    else { const L = window.mel.BOULD.L, c = L.F.clear; p.pos.set(c[0], L.sandH(c[0], c[1]) + .1, c[1]); p.faceH = p.heading = S.cam.az = Math.PI; }
    p.vel.set(0, 0, 0); for (let i = 0; i < 90; i++) frame();
    const sc = window.__sc, cam = window.__cam; if (aer) { cam.position.set(ox - 75, y0 + 50, oz + 55); cam.lookAt(ox, y0 + 10, oz); cam.updateMatrixWorld(true); }
    R.info.autoReset = false; R.info.reset(); real(sc, cam); const o = { id, calls: R.info.render.calls, tris: R.info.render.triangles, folk: D.folk ? D.folk.filter(f => f.vis).length : 0, det: D.detOn ? 1 : 0, cam: [cam.position.x - ox, cam.position.y - y0, cam.position.z - oz].map(v => +v.toFixed(0)) };
    D.g.visible = false; const fv = (D.folk || []).map(f => f.d.root.visible); for (const f of D.folk || []) f.d.root.visible = false; R.info.reset(); real(sc, cam); o.base = [R.info.render.calls, R.info.render.triangles]; D.g.visible = true; (D.folk || []).forEach((f, i) => f.d.root.visible = fv[i]); R.info.autoReset = true; out.push(o); }
  return out; }
let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=boulders&at=village&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && document.getElementById('boot').classList.contains('gone') && window.__wt.rig.ready && window.__wt.DVIL.on, null, { timeout: 240000, polling: 1000 });
  await page.evaluate(() => { const S = window.__wt; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t;
    window.__real = S.renderer.render.bind(S.renderer); S.renderer.render = (sc, c) => { if (sc && sc.isScene && (!window.__sc || sc === window.__sc || sc.children.length >= window.__sc.children.length)) { window.__sc = sc; window.__cam = c; } }; });
  // the villagers load async (a GLB): step him onto the court on the real clock until they are in
  await page.evaluate(() => { const S = window.__wt, D = S.DVIL, p = S.player; p.pos.set(D.o[0] - 8, D.y0 + .1, D.o[1]); for (let i = 0; i < 30; i++) { window.__clock.t += window.__clock.dt; S.frameBody(); } });
  for (let k = 0; k < 60; k++) { const n = await page.evaluate(() => { const S = window.__wt; for (let i = 0; i < 4; i++) { window.__clock.t += window.__clock.dt; S.frameBody(); } return S.DVIL.folk ? S.DVIL.folk.length : 0; }); if (n) break; await page.waitForTimeout(500); }
  console.log('folk:', await page.evaluate(() => { const D = window.__wt.DVIL; return (D.folk ? D.folk.map(f => f.R.id + ' ' + [f.d.root.position.x - D.o[0], f.d.root.position.y - D.y0, f.d.root.position.z - D.o[1]].map(v => v.toFixed(1)).join(',') + ' vis' + f.vis + ' par ' + (f.d.root.parent && f.d.root.parent.type)).join(' ; ') : 'none') + ' busy ' + D.folkBusy + ' err ' + D.folkErr + ' | ' + (window.MISSING || []).filter(m => /DVILL|TOAD|ARENA/.test(m)).join(' / '); }));
  const res = await page.evaluate(src => (0, eval)('(' + src + ')')(), measure.toString());
  console.log('== dvperf (the real play camera after 90 stepped frames; the shadow pass included)');
  for (const r of res) console.log(r.id.padEnd(11) + ' ' + String(r.calls).padStart(3) + ' draws  ' + (r.tris / 1000).toFixed(0).padStart(4) + 'k tris  (without the village ' + r.base[0] + ' / ' + (r.base[1] / 1000).toFixed(0) + 'k)  villagers drawn ' + r.folk + '  detail ' + (r.det ? 'on' : 'off') + '  cam ' + r.cam.join(','));
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
