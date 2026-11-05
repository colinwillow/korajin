// npm run reach -- HIS FULL AIR CHAINS, measured with the SHIPPED frame (VINEWHIP.md's whip-only line). His correction (Nov 5 2026): "I can jump,
// dash after the jump, double jump, dash, wall run, jump off the wall run and dash dash again -- it's usually about DOUBLE what you think."
// Boots index.html headless on the forge's empty floor, stops the game's loop and steps `frameBody` on a fake clock (the `npm run play` pattern).
// Every action is the shipped one: the jump and the double jump are the jump request (`p.jump`, what a tap sets), the AIR DASH is the flying kick
// (`meleeGo` in the air -- the right-pad flick; up to `AIRK.max` an airtime, each needing `minH` of air), the wall run is the shipped catch (the
// left stick held into a wall in the air), the wall jump is the jump request on the wall. Each chain runs its steps IN ORDER, each as soon as it
// can (a dash at the top of a climb, the double jump once the dash is spent). Prints the horizontal distance take-off -> landing, the top height.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__rc = { frameBody, renderer, player, stick, cam, meleeGo, godTo, BOXES, boxGrid, AIRK }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok));
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), pg = await br.newPage({ viewport: { width: 400, height: 400 } });
pg.on('pageerror', e => console.log('  pageerror', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html?w=forge`, { timeout: 120000 });
await pg.waitForFunction(() => window.__rc && window.mel && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 });
await pg.waitForTimeout(4000);
const CH = { jump: ['J'], jump_dbl: ['J', 'D'], jump_k_dbl_k: ['J', 'K', 'D', 'K'], jump_k_dbl_kk: ['J', 'K', 'D', 'K', 'K'], jump_kkk_dbl: ['J', 'K', 'K', 'K', 'D'],
  wall_full: ['J', 'K', 'W', 'WJ', 'D', 'K', 'K'], wall_first: ['J', 'W', 'WJ', 'K', 'D', 'K', 'K'], wall_ride: ['J', 'W', 'WJ', 'D', 'K', 'K', 'K'], wall_ride15: ['J', 'W', 'WJ15', 'D', 'K', 'K', 'K'], wall_ride25: ['J', 'W', 'WJ25', 'D', 'K', 'K', 'K'],
  UP_wall: ['J', 'U', 'WJ', 'D', 'K', 'K', 'K'] };
const rows = await pg.evaluate(([CH]) => { window.requestAnimationFrame = () => 0; window.setInterval = () => 0;
  const S = window.__rc, p = S.player, stick = S.stick; S.renderer.render = () => {}; const t0 = performance.now(); window.__clock = { t: t0 }; performance.now = () => window.__clock.t;
  const frame = () => { window.__clock.t += 1000 / 60; S.frameBody(); }; const out = {}; let spot = 0, made = [];
  for (const [name, steps] of Object.entries(CH)) {
    for (const b of made) { const i = S.BOXES.indexOf(b); if (i >= 0) S.BOXES.splice(i, 1); } made = [];
    const X = (spot++ % 6) * 40 - 100, Z = -170; S.godTo(X, 0, Z, 0); p.vel.set(0, 0, 0); for (let i = 0; i < 60; i++) frame();
    if (steps.includes('U')) { const b = { minx: X - 6, maxx: X + 6, miny: 0, maxy: 60, minz: Z + 16, maxz: Z + 17 }; S.BOXES.push(b); made.push(b); S.boxGrid(); }     // a 60 m face across his path (the run UP)
    if (steps.some(q => q === 'W')) { const b = { minx: X + .9, maxx: X + 1.9, miny: 0, maxy: 14, minz: Z + 12, maxz: Z + 60 }; S.BOXES.push(b); made.push(b); S.boxGrid(); }     // a 24 m wall, 14 m tall, on his LEFT (+x), starting 12 m on, 48 m long
    stick.L.down = 1; stick.L.x = 0; stick.L.y = -1; for (let i = 0; i < 100; i++) { S.cam.az = 0; frame(); }     // up to his run speed along +z
    const v0 = Math.hypot(p.vel.x, p.vel.z); let k = 0, t = 0, x0 = p.pos.x, z0 = p.pos.z, y0 = p.pos.y, top = y0, off = 0, land = null, log = [], wait = 0;
    for (; t < 12; t += 1 / 60) { const s = steps[k], air = !p.grounded;
      if (wait > 0) wait -= 1 / 60;
      else if (s === 'J' && p.grounded) { p.jump = 1; k++; log.push('J@' + t.toFixed(2)); wait = .1; }
      else if (s === 'K' && air && !p.melee && p.vel.y <= .5 && !p.wrun) { S.meleeGo(0); if (p.melee) { k++; log.push('K@' + t.toFixed(2)); wait = .05; } }
      else if (s === 'D' && air && !p.melee && p.vel.y <= .2 && !p.wrun) { p.jump = 1; k++; log.push('D@' + t.toFixed(2)); wait = .1; }
      else if (s === 'W') { stick.L.x = -.45; if (p.wrun) { k++; log.push('W@' + t.toFixed(2)); } }
      else if (s === 'U') { stick.L.x = 0; if (p.wrun) { k++; log.push('U@' + t.toFixed(2)); } }
      else if (/^WJ/.test(s) && p.wrun && p.wrun.t > (s === 'WJ15' ? 1.5 : s === 'WJ25' ? 2.5 : .5) && (s !== 'WJ' || !steps.includes('U') || p.vel.y <= .5)) { p.jump = 1; stick.L.x = .2; k++; log.push('WJ@' + t.toFixed(2)); wait = .15; }
      S.cam.az = 0; frame(); if (!off && !p.grounded) off = 1; top = Math.max(top, p.pos.y);
      if (off && p.grounded && t > .3) { land = [p.pos.x, p.pos.z]; break; } }
    stick.L.down = 0; stick.L.x = 0; stick.L.y = 0;
    out[name] = { v0: +v0.toFixed(2), d: land ? +Math.hypot(land[0] - x0, land[1] - z0).toFixed(2) : null, h: +(top - y0).toFixed(2), air: +t.toFixed(2), done: k + '/' + steps.length, log: log.join(' ') }; }
  return out; }, [CH]);
for (const [n, r] of Object.entries(rows)) console.log(`${n.padEnd(16)} run ${r.v0} m/s  ->  ${r.d} m across, ${r.h} m up, ${r.air} s air  steps ${r.done}  [${r.log}]`);
await br.close(); srv.close();
