// npm run limbshot -- THE STONE GUARDIAN, LIMB BY LIMB (STONE_GUARDIAN.md, m2815) on the SHIPPED index.html, headless, in the Combat Lab:
// a left arm stripped section by section (real `guardSweep` blades across each section), the bare arm glowing while the stone creeps back
// (the regrow window), the JUMP SLAM's arc (its own travel re-applied as root motion), and the hammer in his FIST, close. Game-time frames.
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
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; window.__sf = { guardSweep, shadeSegPos, SHJIN }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__shot && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(3000);
await pg.evaluate(() => mel.shadeAdd()); await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 }); await pg.waitForTimeout(1500);
const li = await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue), G = L[i]; G.aggro = 1; window.__G = G; window.__li = i; const R = G.root.position; mel.player.pos.set(R.x + Math.sin(G.root.rotation.y) * 30, R.y, R.z + Math.cos(G.root.rotation.y) * 30); return i; });
// a camera: on him, `off` round from his front, `d0` out, looking at `hy` of his height -- or at a bone (`bone`)
const snap = (o, label) => pg.evaluate(([o, label, W, H]) => { const { renderer, scene, camera } = window.__shot, G = window.__G, R = G.root.position, h = 3.4, yaw = G.root.rotation.y + (o.off || 0);
    const c = camera.clone(); c.aspect = 1; c.fov = o.fov || 44; c.updateProjectionMatrix(); let T = R.clone().setY(R.y + h * (o.hy || .5)); if (o.bone) G.bn[o.bone].getWorldPosition(T);
    c.position.set(T.x + Math.sin(yaw) * o.d, T.y + (o.up || .4), T.z + Math.cos(yaw) * o.d); c.lookAt(T); renderer.render(scene, c);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height), g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H);
    g.font = '13px monospace'; g.fillStyle = '#fff'; g.fillText(label, 6, 16); return cv.toDataURL('image/jpeg', .88); }, [o, label, W, H]);
const cut = seg => pg.evaluate(seg => { const G = window.__G, { guardSweep, SHJIN, shadeSegPos } = __sf, R = G.root.position, fx = Math.sin(G.root.rotation.y), fz = Math.cos(G.root.rotation.y), c = shadeSegPos(G, seg, R.clone());
    const a = c.clone().add(R.clone().set(fz * .5, 0, -fx * .5)).addScaledVector(R.clone().set(fx, 0, fz), .5), b = c.clone().add(R.clone().set(-fz * .5, 0, fx * .5)).addScaledVector(R.clone().set(fx, 0, fz), .5);
    mel.player.pos.set(R.x + fz * 2.6, R.y, R.z - fx * 2.6);     /* from his LEFT side: the front is his guard */
    G.hitCd = 0; SHJIN.melee = 1; guardSweep(a, b, .12, 1, 1.08, 0); SHJIN.melee = 0; const L = mel.shadeLimbs(window.__li); mel.player.pos.set(R.x + fx * 30, R.y, R.z + fz * 30); return L; }, seg);
const lim = () => pg.evaluate(() => mel.shadeLimbs(window.__li)), rows = [];
const armL = { off: .9, d: 3.2, hy: .55, up: .3 };     // his left (+X) side, from the front-left
rows.push([await snap(armL, 'left arm: armoured')]); let snapped = 1;
for (let k = 0; k < 14; k++) { const st = await pg.evaluate(() => ({ lim: window.__G.lim.armL.st, n: ['handL', 'forearmL', 'shoulderL'].filter(q => window.__G.sh.broke[q]).length, next: ['handL', 'forearmL', 'shoulderL'].find(q => !window.__G.sh.broke[q]) }));
  if (st.lim !== 'armour') break; if (st.n >= snapped && snapped < 3) { rows[0].push(await snap(armL, `mid-strip: ${st.n} of 3 sections off`)); snapped++; continue; } await cut(st.next); await pg.waitForTimeout(120); }
console.log('after the strip', JSON.stringify(await lim()));
const rg = []; for (const T of [.3, 2.3, 4.2]) { await pg.waitForFunction(T => { const L = window.__G.lim.armL; return L.st !== 'exposed' || L.t >= T; }, T, { timeout: 180000, polling: 30 }).catch(() => {}); rg.push(await snap(armL, 'EXPOSED: ' + (await lim()).armL + ' s (stone creeping back)')); } rows.push(rg);
console.log('after the window', JSON.stringify(await lim()));
// the jump slam: from the side, three frames of the arc; the root's travel measured
await pg.evaluate(() => { const G = window.__G, R = G.root.position; mel.player.pos.set(R.x + Math.sin(G.root.rotation.y) * 8, R.y, R.z + Math.cos(G.root.rotation.y) * 8); window.__r0 = R.clone(); mel.shadeAttack(window.__li, 'over'); });
const js = []; for (const T of [.75, 1.25, 1.75]) { await pg.waitForFunction(T => window.__G.st !== 'over' || window.__G.stT >= T, T, { timeout: 180000, polling: 20 }).catch(() => {});
  const tr = await pg.evaluate(() => +window.__G.root.position.distanceTo(window.__r0).toFixed(2)); js.push(await snap({ off: Math.PI / 2, d: 11, hy: .5, up: 1 }, `JUMP SLAM ${(await pg.evaluate(() => window.__G.st + ' ' + window.__G.stT.toFixed(2)))} travelled ${tr} m`)); }
rows.push(js);
// the hammer in his fist, close: idle, a swing, the slam's impact (the right hand)
await pg.waitForFunction(() => window.__G.st === 'walk', null, { timeout: 180000, polling: 50 }).catch(() => {});
await pg.evaluate(() => { const G = window.__G, R = G.root.position; mel.player.pos.set(R.x + Math.sin(G.root.rotation.y) * 30, R.y, R.z + Math.cos(G.root.rotation.y) * 30); G.aggro = 0; });
const grip = { bone: 'RightHand', off: -.7, d: 1.6, up: .3, fov: 40 }, gr = [await snap(grip, 'the grip: idle')];
await pg.evaluate(() => { window.__G.aggro = 1; mel.shadeAttack(window.__li, 'swipe'); }); await pg.waitForFunction(() => window.__G.st !== 'swipe' || window.__G.stT > 1.3, null, { timeout: 120000, polling: 20 }).catch(() => {}); gr.push(await snap(Object.assign({}, grip, { d: 2.4 }), 'the grip: mid-swing'));
await pg.waitForFunction(() => window.__G.st === 'walk', null, { timeout: 120000, polling: 50 }).catch(() => {}); await pg.evaluate(() => { mel.shadeAttack(window.__li, 'over'); }); await pg.waitForFunction(() => window.__G.st === 'stuck', null, { timeout: 180000, polling: 20 }).catch(() => {}); gr.push(await snap(Object.assign({}, grip, { d: 3, off: -1.2 }), 'the grip: the head in the ground'));
rows.push(gr);
const png = await pg.evaluate(async ([rows, W, H]) => { const cv = document.createElement('canvas'); cv.width = 3 * W; cv.height = rows.length * H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
  for (const [r, R] of rows.entries()) for (const [k, u] of R.entries()) { const im = new Image(); im.src = u; await im.decode(); c.drawImage(im, k * W, r * H); } return cv.toDataURL('image/png'); }, [rows, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'limb_sheet.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
