// npm run huskshot -- THE HUSK SOLDIER (his Tripo body on the samurai's rig, his spear in the katana's mount) on the SHIPPED index.html, headless.
// Combat Lab: the soldier, the crested swordsman and the flanker, front and side; then AI on, frames of them fighting. Forest temple (`zone=ftemple`):
// two husks dropped into the room. One PNG contact sheet. Only `window.__shot` is added to the served text.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const OUT = arg('out', path.join(ROOT, 'shots')), W = 400, H = 400;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const snapFn = ([who, d0, off, label, W, H]) => { const { renderer, scene, camera } = window.__shot, L = mel.ARENA.live, D = who === 'all' ? null : L[who];
  let cx = 0, cz = 0, yaw; if (D) { cx = D.root.position.x; cz = D.root.position.z; yaw = D.root.rotation.y; } else { for (const d of L) { cx += d.root.position.x / L.length; cz += d.root.position.z / L.length; } const p = mel.player.pos; yaw = Math.atan2(p.x - cx, p.z - cz); }
  const y0 = D ? D.root.position.y : (L[0] ? L[0].root.position.y : 0), c = camera.clone(); c.aspect = 1; c.fov = 40; c.updateProjectionMatrix(); const a = yaw + off;
  c.position.set(cx + Math.sin(a) * d0, y0 + 1.3, cz + Math.cos(a) * d0); c.lookAt(cx, y0 + .9, cz); renderer.render(scene, c);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height), g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H);
  g.font = '13px monospace'; g.fillStyle = '#fff'; g.fillText(label, 6, 16); return cv.toDataURL('image/jpeg', .88); };
async function boot(q) { const pg = await br.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
  pg.on('console', m => { const t = m.text(); if (/HUSK|KATANA|MOUNT|BONES|FTEMPLE/i.test(t)) console.log('  >', t.slice(0, 200)); });
  await pg.goto(`http://127.0.0.1:${port}/index.html${q}`, { timeout: 120000 });
  await pg.waitForFunction(() => window.__shot && window.mel && mel.arenaSpawn && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(4000); return pg; }
const spawn = async (pg, keys) => { for (const k of keys) { await pg.evaluate(k => mel.arenaSpawn(k), k); await pg.waitForFunction(n => mel.ARENA.live.length >= n && !mel.ARENA.busy, keys.indexOf(k) + 1, { timeout: 120000, polling: 500 }); } await pg.waitForFunction(() => mel.ARENA.live.every(d => d.root.visible && !/beam|emerge/i.test(d.st || '') && !d.emerge), null, { timeout: 90000, polling: 500 }).catch(() => console.log('  (still arriving)')); await pg.waitForTimeout(2500);
  console.log('  live', JSON.stringify(await pg.evaluate(() => mel.ARENA.live.map(d => [d.K.arena, d.st, d.root.visible, d.root.position.toArray().map(v => +v.toFixed(1))]))), 'player', JSON.stringify(await pg.evaluate(() => mel.player.pos.toArray().map(v => +v.toFixed(1))))); };
const rows = [];
{ const pg = await boot('?w=forge&zone=combatlab&entry=0');  await spawn(pg, ['HUSK_SOLDIER', 'HUSK_GUARD', 'HUSK_FLANKER']);
  console.log(JSON.stringify(await pg.evaluate(() => mel.ARENA.live.map(d => ({ k: d.K.arena, h: d.K.h, st: d.st, blade: !!d.wmount, tris: (() => { let n = 0; d.model.traverse(o => { if (o.isMesh && o.geometry.index) n += o.geometry.index.count / 3; }); return n; })() })))));
  const S = (w, d, o, l) => pg.evaluate(snapFn, [w, d, o, l, W, H]);
  rows.push([await S(0, 3.4, 0, 'husk soldier'), await S(1, 3.4, 0, 'husk swordsman (crest)'), await S(2, 3.4, 1.4, 'husk flanker, side')]);
  rows.push([await S(0, 2.2, .4, 'soldier, close'), await S(0, 2.6, Math.PI, 'soldier, back'), await S(1, 2.2, -1.2, 'the spear in his fist')]);
  await pg.waitForTimeout(5000); const f = []; for (let i = 0; i < 3; i++) { f.push(await S('all', 7, .5, 'fighting +' + (i * 2.5) + ' s')); await pg.waitForTimeout(2500); } rows.push(f); await pg.close(); }
{ const pg = await boot('?w=forge&zone=ftemple&entry=0'); await spawn(pg, ['HUSK_SOLDIER', 'HUSK_GUARD']); const S = (w, d, o, l) => pg.evaluate(snapFn, [w, d, o, l, W, H]);
  rows.push([await S('all', 7, 0, 'forest temple: two husks'), await S(0, 3.2, .6, 'in the room, close'), await (async () => { await pg.waitForTimeout(4000); return S('all', 6, -.8, 'in the room, fighting'); })()]); await pg.close(); }
const pg = await br.newPage(); const png = await pg.evaluate(async ([rows, W, H]) => { const cv = document.createElement('canvas'); cv.width = 3 * W; cv.height = rows.length * H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
  for (const [r, R] of rows.entries()) for (const [k, u] of R.entries()) { const im = new Image(); im.src = u; await im.decode(); c.drawImage(im, k * W, r * H); } return cv.toDataURL('image/png'); }, [rows, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'husk_sheet.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
