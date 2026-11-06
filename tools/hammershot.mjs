// npm run hammershot -- THE STONE GUARDIAN'S MEGALITH HAMMER (STONE_GUARDIAN.md, m2791) on the SHIPPED index.html, headless, in the Combat Lab:
// the hammer in his hand beside the statue twin's stone one; the SHOCKWAVE (the head kindling, the slam, the rings running out); the OVERHEAD
// (the wind-up, the impact, the head stuck in the ground). Frames by GAME time. One PNG.
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
await pg.waitForFunction(() => window.__shot && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(3000);
await pg.evaluate(() => mel.shadeAdd()); await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 }); await pg.waitForTimeout(1500);
const li = await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue), G = L[i]; G.aggro = 0; window.__G = G; return i; });
const snap = (d0, off, label, hy = .45) => pg.evaluate(([d0, off, label, hy, W, H]) => { const { renderer, scene, camera } = window.__shot, G = window.__G, R = G.root.position, yaw = G.root.rotation.y + off, h = 3.4;
    const c = camera.clone(); c.aspect = 1; c.fov = 46; c.updateProjectionMatrix(); const fx = Math.sin(G.root.rotation.y) * 2, fz = Math.cos(G.root.rotation.y) * 2;
    c.position.set(R.x + fx + Math.sin(yaw) * d0, R.y + h * .7, R.z + fz + Math.cos(yaw) * d0); c.lookAt(R.x + fx, R.y + h * hy, R.z + fz); renderer.render(scene, c);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height), g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H);
    g.font = '13px monospace'; g.fillStyle = '#fff'; g.fillText(label, 6, 16); return cv.toDataURL('image/jpeg', .88); }, [d0, off, label, hy, W, H]);
// keep Grumbo out of the way, behind the camera
const away = () => pg.evaluate(() => { const G = window.__G, R = G.root.position, p = mel.player; p.pos.set(R.x + Math.sin(G.root.rotation.y) * 15, R.y, R.z + Math.cos(G.root.rotation.y) * 15); });
const rows = []; await away();
rows.push([await snap(9, .6, 'the megalith hammer'), await snap(7, 2.6, 'from behind'), await pg.evaluate(([W, H]) => { const { renderer, scene, camera } = window.__shot, G = mel.shadeList().find(g => g.statue), R = G.root.position, c = camera.clone(); c.aspect = 1; c.fov = 46; c.updateProjectionMatrix();
  c.position.set(R.x + Math.sin(G.root.rotation.y + .5) * 8, R.y + 2.4, R.z + Math.cos(G.root.rotation.y + .5) * 8); c.lookAt(R.x, R.y + 1.4, R.z); renderer.render(scene, c); const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height), g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H); g.font = '13px monospace'; g.fillStyle = '#fff'; g.fillText('the statue twin: a stone hammer', 6, 16); return cv.toDataURL('image/jpeg', .88); }, [W, H])]);
// game-time frames of an attack
// a frame as each STATE reaches its time (state, seconds in it): the attack runs on game time, the waits poll it
async function attack(k, ts, label) { await away(); await pg.evaluate(([i, k]) => { mel.shadeAttack(i, k); window.__G.aggro = 1; }, [li, k]); const fr = [];
  for (const [S, T] of ts) { await pg.waitForFunction(([S, T]) => window.__G.st === S && window.__G.stT >= T, [S, T], { timeout: 180000, polling: 20 }).catch(() => console.log('  missed', S, T)); const st = await pg.evaluate(() => window.__G.st + ' ' + window.__G.stT.toFixed(2));
    fr.push(await snap(k === 'wave' ? 13 : 9, .9, label + ': ' + st, .3)); } await pg.waitForFunction(() => window.__G.st === 'walk' && !mel.SHWAVE.list.length, null, { timeout: 180000, polling: 100 }).catch(() => {}); return fr; }
const wv = await attack('wave', [['wave', .9], ['wave', 1.6], ['wave', 1.85], ['wave', 2.2], ['wave', 2.6], ['wave', 2.9]], 'SHOCKWAVE'); rows.push(wv.slice(0, 3), wv.slice(3, 6));
const ov = await attack('over', [['over', 1.2], ['over', 2.3], ['stuck', 0], ['stuck', .9], ['over2', .2], ['over2', .9]], 'OVERHEAD'); rows.push(ov.slice(0, 3), ov.slice(3, 6));
const png = await pg.evaluate(async ([rows, W, H]) => { const cv = document.createElement('canvas'); cv.width = 3 * W; cv.height = rows.length * H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
  for (const [r, R] of rows.entries()) for (const [k, u] of R.entries()) { const im = new Image(); im.src = u; await im.decode(); c.drawImage(im, k * W, r * H); } return cv.toDataURL('image/png'); }, [rows, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'hammer_sheet.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
