// npm run whipshot [lash throw pull swing] -- a CONTACT SHEET of the VINE WHIP's CAST on the real hero (VINEWHIP.md). Boots the SHIPPED index.html
// headless in the whip sandbox (`?w=forge&zone=whip&entry=0`), equips the whip, stands him at a setup per cast, fires `mel.whipGo` and films him
// from the side, a frame every `--dt` ms (wall clock: the game runs in real time under SwiftShader, so frames are as dense as it can draw).
// One PNG: a row per cast, the frame times on each. The only thing added to the served text is `window.__shot` (shot.mjs's splice).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const OUT = arg('out', path.join(ROOT, 'shots')), N = +arg('n', 10), DT = +arg('dt', 60), W = 300, H = 300;
const want = process.argv.slice(2).filter(x => !x.startsWith('--')); const ROWS = want.length ? want : ['lash', 'throw', 'pull', 'swing'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=whip&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__shot && window.mel && mel.whipGo && mel.WHIPZ && mel.WHIPZ.on && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 });
await pg.waitForTimeout(6000); await pg.evaluate(k => { window.__slow = k; }, +arg('slow', .125)); await pg.evaluate(() => mel.whipPick()); await pg.waitForTimeout(2500);
// the setups: where he stands and what the flick takes (in the page; `A` = the sandbox's anchors, `Q` = its pullables)
const SET = { lash: `(() => { const p = mel.whipP; p.rope = null; p.whipCast = null; mel.WHIPZ.slow = +(window.__slow || 1); (() => {})(); const _ = p; p.pos.set(0, .3, 4); p.vel.set(0, 0, 0); return Math.PI; })()`,
  throw: `(() => { const p = mel.whipP; p.rope = null; p.whipCast = null; mel.WHIPZ.slow = +(window.__slow || 1); (() => {})(); const __ = 0, k = mel.WHIP.anchors.find(a => a.id === 'B_knot1'); p.pos.set(32.04, 8, -18.5); p.vel.set(0, 0, 0); return Math.atan2(k.x - p.pos.x, k.z - p.pos.z); })()`,
  pull: `(() => { const p = mel.whipP; p.rope = null; p.whipCast = null; mel.WHIPZ.slow = +(window.__slow || 1); (() => {})(); const __ = 0, c = mel.WHIPZ.L.pulls.find(q => q.kind === 'crate'); p.pos.set(c.x + Math.sin(c.yaw) * 7, 0, c.z + Math.cos(c.yaw) * 7); p.vel.set(0, 0, 0); return Math.atan2(c.x - p.pos.x, c.z - p.pos.z); })()`,
  swing: `(() => { const p = mel.whipP; p.rope = null; p.whipCast = null; mel.WHIPZ.slow = +(window.__slow || 1); (() => {})(); const __ = 0, k = mel.WHIP.anchors.find(a => a.id === 'B_knot1'); p.pos.set(32.04, 8, -18.5); p.vel.set(0, 0, 0); return Math.atan2(k.x - p.pos.x, k.z - p.pos.z); })()` };
const sheet = [];
for (const row of ROWS) { const h = await pg.evaluate(SET[row]); await pg.waitForTimeout(1200); const h2 = await pg.evaluate(SET[row]);
  await pg.evaluate(hh => { const p = mel.whipP; p.faceH = p.heading = hh; }, h2); await pg.waitForTimeout(400);
  const t0 = Date.now(); await pg.evaluate(hh => mel.whipGo(hh), h2); if (row === 'swing') await pg.waitForTimeout(700);
  const frames = []; for (let k = 0; k < N; k++) {
    frames.push(await pg.evaluate(([hh, W, H]) => { const { renderer, scene, camera } = window.__shot, p = mel.whipP.pos, fx = Math.sin(hh), fz = Math.cos(hh);
      const c = camera.clone(); c.aspect = 1; c.fov = 45; c.updateProjectionMatrix(); c.position.set(p.x - fz * 4.6 - fx * 1.2, p.y + 1.6, p.z + fx * 4.6 - fz * 1.2); c.lookAt(p.x + fx * 1.2, p.y + 1.15, p.z + fz * 1.2);
      renderer.render(scene, c); const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const src = renderer.domElement, s = Math.min(src.width, src.height); cv.getContext('2d').drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H); return cv.toDataURL('image/jpeg', .85); }, [h2, W, H]));
    frames[frames.length - 1] = { url: frames[frames.length - 1], t: Date.now() - t0 }; await pg.waitForTimeout(DT); }
  sheet.push({ row, frames }); console.log(row, 'frames at', frames.map(f => f.t).join(' '), 'ms'); }
const png = await pg.evaluate(async ([sheet, W, H]) => { const cols = Math.max(...sheet.map(r => r.frames.length)), cv = document.createElement('canvas'); cv.width = cols * W; cv.height = sheet.length * (H + 18) + 20; const c = cv.getContext('2d');
  c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); c.font = '13px monospace'; c.fillStyle = '#fff'; c.fillText('THE VINE WHIP -- the cast, frame by frame (wall-clock ms after the flick)', 6, 14);
  for (const [r, R] of sheet.entries()) for (const [k, F] of R.frames.entries()) { const im = new Image(); im.src = F.url; await im.decode(); const x = k * W, y = 20 + r * (H + 18); c.drawImage(im, x, y + 18); c.fillStyle = '#9ff'; c.fillText(R.row + ' +' + F.t + 'ms', x + 4, y + 13); }
  return cv.toDataURL('image/png'); }, [sheet, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'whipcast_' + ROWS.join('_') + '.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
