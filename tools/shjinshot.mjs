// npm run shjinshot -- THE SPIRIT ONLY BOWS TO JINRA (STONE_GUARDIAN.md, m2784) on the SHIPPED index.html, headless, in the Combat Lab: a plain hit
// passing through the bare spirit, the dunk at the Jinra brazier, the glowing blade, an infused strike, the last blow's flash. One PNG.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const OUT = arg('out', path.join(ROOT, 'shots')), W = 420, H = 420;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__shot && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(4000);
await pg.evaluate(() => { try { mel.ownAll(1); } catch (e) {} const i = mel.WEAP.slots.findIndex(s => s.key === 'katana'); if (i >= 0) mel.applySlot(i); }); await pg.waitForTimeout(1500);
await pg.evaluate(() => mel.shadeAdd()); await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 }); await pg.waitForTimeout(1500);
console.log(JSON.stringify(await pg.evaluate(() => ({ braz: mel.SHJIN.braz.length, at: mel.SHJIN.braz[0] && mel.SHJIN.braz[0].top.toArray().map(v => +v.toFixed(1)), slot: mel.WEAP.slots[mel.player.slot].key, blade: !!mel.WEAP.slots[mel.player.slot].blade }))));
// the live one: armour off, the spirit phase; hold it still for the camera
await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue); mel.shadeBare(i); L[i].aggro = 0; }); await pg.waitForTimeout(2500);
const snap = (who, d0, off, label, hy = .5) => pg.evaluate(([who, d0, off, label, hy, W, H]) => { const { renderer, scene, camera } = window.__shot, p = mel.player.pos, L = mel.shadeList(), G = L.find(g => !g.statue) || window.__G; if (G) window.__G = G;
    let c0; if (who === 'player') c0 = p.clone(); else if (who === 'braz') c0 = mel.SHJIN.braz[0].top.clone().setY(p.y); else c0 = G.root.position.clone(); const yaw = who === 'shade' ? G.root.rotation.y : mel.player.faceH;
    const c = camera.clone(); c.aspect = 1; c.fov = 42; c.updateProjectionMatrix(); const a = yaw + off, hh = who === 'shade' ? 3.4 : 1.6;
    c.position.set(c0.x + Math.sin(a) * d0, c0.y + hh * .62, c0.z + Math.cos(a) * d0); c.lookAt(c0.x, c0.y + hh * hy, c0.z); renderer.render(scene, c);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height), g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H);
    g.font = '13px monospace'; g.fillStyle = '#fff'; g.fillText(label, 6, 16); return cv.toDataURL('image/jpeg', .88); }, [who, d0, off, label, hy, W, H]);
const rows = [];
// 1. a plain hit passes through
const r1 = await pg.evaluate(() => mel.shadeHit(mel.shadeList().findIndex(g => !g.statue))); console.log('plain hit', JSON.stringify(r1));
const pass = []; for (const w of [80, 350, 900]) { await pg.waitForTimeout(w === 80 ? 80 : w - 80); pass.push(await snap('shade', 6, .4, 'plain blade: passes through +' + w + 'ms')); }
rows.push(pass);
// 2. the dunk: Grumbo walked up to the brazier, katana out
await pg.evaluate(() => { const r = mel.SHJIN.braz[0], p = mel.player; p.pos.set(r.top.x + 1.1, r.top.y - 1, r.top.z); p.vel.set(0, 0, 0); });
await pg.waitForFunction(() => mel.INFUSE.dipT > 0 || mel.INFUSE.t > 0, null, { timeout: 30000, polling: 50 }).catch(() => console.log('  no dunk?'));
const dunk = [await snap('braz', 3.2, 1.2, 'the Jinra brazier: the dunk', .4)]; await pg.waitForFunction(() => mel.INFUSE.t > 0, null, { timeout: 30000, polling: 50 }).catch(() => {});
console.log('infused', JSON.stringify(await pg.evaluate(() => ({ t: mel.INFUSE.t, n: mel.INFUSE.n, bfire: mel.BFIRE ? mel.BFIRE.on : '?' }))));
await pg.waitForTimeout(400); dunk.push(await snap('player', 2.4, 1.0, 'infused: the blade burns Jinra', .55), await snap('player', 1.4, 2.2, 'the blade, close', .6)); rows.push(dunk);
// 3. an infused strike, then strike to the end
await pg.evaluate(() => { const r = mel.SHJIN.braz[0], p = mel.player, G = mel.shadeList().find(g => !g.statue); p.pos.set(G.root.position.x, G.root.position.y, G.root.position.z + 3); });
const r2 = await pg.evaluate(() => mel.shadeHit(mel.shadeList().findIndex(g => !g.statue))); console.log('jin hit', JSON.stringify(r2)); await pg.waitForTimeout(120);
const st = [await snap('shade', 6, .4, 'infused strike: it lands')];
for (let k = 0; k < 8; k++) { const r = await pg.evaluate(() => { const i = mel.shadeList().findIndex(g => !g.statue); return i < 0 ? null : mel.shadeHit(i); }); if (!r || r.hp <= 0) { console.log('final', JSON.stringify(r)); break; } await pg.waitForTimeout(150); }
await pg.waitForTimeout(120); st.push(await snap('shade', 6.5, .4, 'the last blow: Jinra flash')); await pg.waitForTimeout(2500); st.push(await snap('shade', 7, .4, 'then the dissolve')); rows.push(st);
console.log('stat', JSON.stringify(await pg.evaluate(() => mel.SHJIN.stat)));
const png = await pg.evaluate(async ([rows, W, H]) => { const cv = document.createElement('canvas'); cv.width = 3 * W; cv.height = rows.length * H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
  for (const [r, R] of rows.entries()) for (const [k, u] of R.entries()) { const im = new Image(); im.src = u; await im.decode(); c.drawImage(im, k * W, r * H); } return cv.toDataURL('image/png'); }, [rows, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'shjin_sheet.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
