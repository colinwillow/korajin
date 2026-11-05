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
const HANDLE = 'window.__wt = { frameBody, player, cam, COLL, groundAt, renderer, rig, MOVE, DVIL, DVILLAGE }; ';
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
function drive() {
  const S = window.__wt, p = S.player, clk = window.__clock, DT = 1 / 60, D = S.DVIL, G = D.R.geo, [ox, oz] = D.o, y0 = D.y0;
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  let pid = 100; const pad = side => { const el = document.getElementById(side === 'L' ? 'padL' : 'padR'); let id = null;
    const at = (x, y) => { const r = el.getBoundingClientRect(), Rr = Math.max(8, r.width * 52 / 132); return { clientX: r.left + r.width / 2 + x * Rr, clientY: r.top + r.height / 2 + y * Rr }; };
    const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: id, bubbles: true, cancelable: true, pointerType: 'touch', isPrimary: true }, at(x, y))));
    return { down(x = 0, y = 0) { if (id !== null) this.up(); id = ++pid; ev('pointerdown', x, y); }, move(x, y) { if (id !== null) ev('pointermove', x, y); }, up() { if (id !== null) { ev('pointerup', 0, 0); id = null; } }, get held() { return id !== null; } }; };
  const L = pad('L'), R = pad('R');
  const steer = (wx, wz, m) => { const l = Math.hypot(wx, wz) || 1; wx /= l; wz /= l; const az = isFinite(S.cam.az) ? S.cam.az : 0, sa = Math.sin(az), ca = Math.cos(az); if (!L.held) L.down(0, 0); L.move((wz * sa - wx * ca) * m, -(wx * sa + wz * ca) * m); };
  let tapT = -1; const W = (u, v) => [ox + u, oz + v];
  const out = { legs: [], fails: 0 };
  for (let i = 0; i < 60; i++) frame();
  // start on the court, at the foot of L0
  const L0 = G.links[0], st0 = W(L0.pa[0] - L0.dir[0] * 2.5, L0.pa[1] - L0.dir[1] * 2.5); p.pos.set(st0[0], y0 + .2, st0[1]); p.vel.set(0, 0, 0); for (let i = 0; i < 40; i++) frame();
  out.start = [+p.pos.x.toFixed(2), +p.pos.y.toFixed(2), +p.pos.z.toFixed(2), p.grounded];
  const go = (tu, tv, ty, why, T = 14, hop = null) => {     /* hop: [u, v, r] of the surface he takes off from -- he jumps .45 m before its edge */ const [tx, tz] = W(tu, tv); let tt = 0, ok = false, low = 1e9, jumped = 0, minY = 1e9;
    for (; tt < T; tt += DT) { const dx = tx - p.pos.x, dz = tz - p.pos.z, d = Math.hypot(dx, dz); minY = Math.min(minY, p.pos.y);
      if (d < .8 && p.grounded && Math.abs(p.pos.y - (y0 + ty)) < .35) { ok = true; break; }
      if (hop && !jumped && p.grounded && Math.hypot(p.pos.x - ox - hop[0], p.pos.z - oz - hop[1]) > hop[2] - .45) { R.down(0, 0); tapT = 3; jumped = 1; }
      if (tapT >= 0 && --tapT < 0) R.up();
      steer(dx, dz, d < 1.2 ? .5 : 1); frame(); if (window.__tr && hop) (out.tr || (out.tr = [])).push([why.slice(0, 6), +tt.toFixed(2), +(p.pos.x - ox).toFixed(2), +(p.pos.y - y0).toFixed(2), +(p.pos.z - oz).toFixed(2), p.grounded ? 'G' : 'a', jumped, +Math.hypot(p.vel.x, p.vel.z).toFixed(2), +p.vel.y.toFixed(2)]); }
    for (let i = 0; i < 8; i++) { steer(tx - p.pos.x, tz - p.pos.z, .02); frame(); if (window.__tr && hop) (out.tr || (out.tr = [])).push(['settle', i, +(p.pos.x - ox).toFixed(2), +(p.pos.y - y0).toFixed(2), +(p.pos.z - oz).toFixed(2), p.grounded ? 'G' : 'a', +Math.hypot(p.vel.x, p.vel.z).toFixed(2), +p.vel.y.toFixed(2), JSON.stringify(S.COLL.stat), p.wrun ? 'WRUN' : '', p.hang ? 'HANG' : '', p.ledge ? 'LEDGE' : '']); }
    const row = { why, ok, t: +tt.toFixed(1), at: [+(p.pos.x - ox).toFixed(1), +(p.pos.y - y0).toFixed(2), +(p.pos.z - oz).toFixed(1)], want: [+tu.toFixed(1), ty, +tv.toFixed(1)], minY: +(minY - y0).toFixed(2) };
    out.legs.push(row); if (!ok) out.fails++; return ok; };
  for (const Lk of G.links) { const a = G.node(Lk.a), b = G.node(Lk.b), [ux, vx] = Lk.dir;
    // to the near end of the link (on a), then along it onto b
    if (!go(Lk.pa[0] - ux * 1.2, Lk.pa[1] - vx * 1.2, a.y, Lk.id + ' to the start on ' + a.id)) break;
    if (Lk.k === 'hop') { let okAll = true, from = [a.u, a.v, a.r]; for (const s of Lk.stones) { if (!go(s.u, s.v, s.y, Lk.id + ' HOP onto a stone', 6, from)) { okAll = false; break; } from = [s.u, s.v, s.r]; } if (!okAll) break;
      if (!go(Lk.pb[0] + ux * 1.5, Lk.pb[1] + vx * 1.5, b.y, Lk.id + ' HOP onto ' + b.id, 6, from)) break; }
    else if (!go(Lk.pb[0] + ux * 1.5, Lk.pb[1] + vx * 1.5, b.y, Lk.id + ' ' + Lk.k + ' onto ' + b.id, 20)) break; }
  out.coll = S.COLL.mode + ' ' + S.COLL.zone + ' on' + S.COLL.on + ' tris ' + S.COLL.stat.tris; return out; }
let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=boulders&at=village&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && document.getElementById('boot').classList.contains('gone') && window.__wt.rig.ready && window.__wt.DVIL.on, null, { timeout: 240000, polling: 1000 });
  await page.evaluate(() => { const S = window.__wt; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; S.renderer.render = () => {}; });
  if (process.env.TR) await page.evaluate(() => { window.__tr = 1; });
  const R = await page.evaluate(drive);
  if (R.tr) for (const t of R.tr.slice(0, +process.env.TR)) console.log('  ', t.join(' '));
  console.log(`== dvwalk ${R.coll}  ${el()}  start ${JSON.stringify(R.start)}`);
  for (const l of R.legs) console.log((l.ok ? 'ok   ' : 'FAIL ') + l.why.padEnd(28) + ' ' + l.t + ' s  at ' + JSON.stringify(l.at) + '  want ' + JSON.stringify(l.want) + '  lowest y ' + l.minY);
  console.log(R.fails ? R.fails + ' FAILED' : 'the whole route climbed'); code = R.fails ? 1 : 0;
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
