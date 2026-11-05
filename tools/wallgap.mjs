// npm run wallgap -- MEASURE a wall-run gap with the SHIPPED wall run (no table, no re-derivation). Boots index.html headless in the Forest Temple
// interior (`?w=forge&zone=ftemple&at=room`), stops the game's own loop, and steps the shipped `stepPlayer` by hand at 1/60 s: he leaves the end of
// A's east rim (rim 1, 6 m, ends at z -6) in a JUMP at a given speed, the LEFT STICK held along the wall (the shipped catch: `WRUN.stick`), and
// we watch where he comes down. Prints, per take-off: speed, the furthest z he reached at or above the gallery (6 m), where he landed (x, y, z),
// and whether that is ON the north gallery (z <= -15, y ~6). The gallery's lip is at z -15: the gap is 9 m (z -6 -> -15).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__ws = { stepPlayer, frameBody, renderer, player, WRUN, stick, cam, MOVE, groundAt }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok));
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), pg = await br.newPage({ viewport: { width: 400, height: 400 } });
pg.on('pageerror', e => console.log('  pageerror', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html?w=forge&zone=ftemple&at=room`, { timeout: 120000 });
await pg.waitForFunction(() => window.__ws && window.mel && window.mel.FTEMPLE && mel.FTEMPLE.on && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 });
await pg.waitForTimeout(4000);
const rows = await pg.evaluate(([CASES]) => { window.requestAnimationFrame = () => 0; window.setInterval = () => 0;
  const { frameBody, renderer, player: p, stick, cam } = window.__ws, out = []; renderer.render = () => {}; const t0 = performance.now(); window.__clock = { t: t0 }; performance.now = () => window.__clock.t;
  const stepPlayer = () => { window.__clock.t += 1000 / 60; frameBody(); };
  for (const [sprint, jz, lean] of CASES) {
    for (const k of ['wrun', 'wclimb', 'ledge', 'mantle', 'rope', 'zip', 'slide', 'aflip', 'cart', 'hook', 'vault', 'climb', 'bar', 'vine']) p[k] = null; for (const k of ['melee', 'roll', 'land', 'knock', 'slam', 'jump', 'wrunCool', 'airT']) p[k] = 0;
    p.pos.set(15.0, 6.05, 10); p.vel.set(0, 0, 0); p.grounded = true; p.jumps = 1; p.faceH = p.heading = Math.PI; cam.az = Math.PI;
    stick.L.down = 1; stick.L.x = 0; stick.L.y = -1; stick.R.down = sprint; stick.R.x = 0; stick.R.y = 0;
    let caught = 0, best = 9, t = 0, land = null, ledge = 0, jumped = 0, v0 = 0, tr = [];
    for (let w = 0; w < 30; w++) stepPlayer(); p.pos.set(15.0, 6.05, 10); p.vel.set(0, 0, 0);
    for (; t < 8; t += 1 / 60) { if (!jumped && p.pos.z <= jz) { jumped = 1; v0 = Math.hypot(p.vel.x, p.vel.z); p.jump = 1; stick.L.x = lean; stick.R.down = 0; }
      stepPlayer(1 / 60); if (jumped) { if (p.wrun) caught = 1; if (p.ledge || p.mantle) ledge = 1; if (p.pos.y >= 5.7) best = Math.min(best, p.pos.z);
        if (jumped % 6 === 1) tr.push((p.wrun ? (p.wrun.kind + ':' + (p.wrun.arc || '')) : p.grounded ? 'G' : 'air') + ' ' + p.pos.x.toFixed(1) + ',' + p.pos.y.toFixed(1) + ',' + p.pos.z.toFixed(1) + ' v' + p.vel.y.toFixed(1));
        if (p.grounded && jumped > 10) { land = [p.pos.x, p.pos.y, p.pos.z]; break; } jumped++; } }
    stick.L.down = 0; stick.L.x = 0; stick.L.y = 0; stick.R.down = 0;
    out.push({ v: +v0.toFixed(2), z0: jz, lean, sprint, caught, ledge, best: +best.toFixed(2), land: land && land.map(n => +n.toFixed(2)), on: !!(land && land[1] > 5.5 && land[2] <= -15), tr }); }
  return out; }, [JSON.parse(process.env.CASES || '[[0,-5.3,0.35],[0,-5.3,0.7],[1,-5.3,0.35]]')]);
for (const r of rows) { console.log(`${r.sprint ? 'SPRINT' : 'run   '} v ${String(r.v).padEnd(5)} jump at z ${String(r.z0).padEnd(5)} lean ${r.lean}  wallrun ${r.caught ? 'Y' : 'n'}  ledge ${r.ledge ? 'Y' : 'n'}  furthest z @>=5.7 m: ${r.best}  landed ${JSON.stringify(r.land)}  ${r.on ? 'ON THE GALLERY' : 'short'}`); if (process.env.TRACE) console.log('   ' + r.tr.join(' | ')); }
await br.close(); srv.close();
