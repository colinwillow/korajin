// npm run shadeshot -- the 2-LAYER STONE GUARDIAN (STONE_GUARDIAN.md) on the SHIPPED index.html, headless, in the Combat Lab
// (`?w=forge&zone=combatlab&entry=0`): SPAWN > STONE GUARDIAN (2-layer) puts a statue twin and a live one in front of him. Frames:
// the armoured guardian beside his statue; the same with the left arm and the head broken off (the spirit showing, the wisps); and the
// death, a frame every `--dt` ms (the green puff, the Tama). One PNG contact sheet. Only `window.__shot` is added to the served text.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const OUT = arg('out', path.join(ROOT, 'shots')), DT = +arg('dt', 220), W = 420, H = 420;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 640, height: 640 }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
pg.on('console', m => { const t = m.text(); if (/SHADE|guardian|GUARDIAN/i.test(t)) console.log('  >', t.slice(0, 200)); });
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__shot && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 });
await pg.waitForTimeout(4000);
await pg.evaluate(() => mel.shadeAdd()); await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 });
// hold them still for the camera: no aggro, both where they were put
const info = await pg.evaluate(() => { const L = mel.shadeList(); for (const G of L) { G.aggro = 0; } const p = mel.player.pos;
  return L.map(G => ({ statue: G.statue, x: +G.root.position.x.toFixed(2), z: +G.root.position.z.toFixed(2), h: +G.Z.P.h.toFixed(2), segs: G.sh.segs.length, draws: [G.sh.st.visible, G.sh.sp.visible].filter(Boolean).length })).concat([{ player: [p.x.toFixed(1), p.z.toFixed(1)] }]); });
console.log(JSON.stringify(info));
const snap = (who, k, label) => pg.evaluate(([who, k, W, H, label]) => { const { renderer, scene, camera } = window.__shot, L = mel.shadeList(), G = who === 'both' ? null : (L.find(g => !g.statue) || mel.SHADEFX.dying[0] && mel.SHADEFX.dying[0].G);
    let cx, cz, h = 3.4, yaw; if (G) { const R = G.root.position; cx = R.x; cz = R.z; yaw = G.root.rotation.y; } else { cx = 0; cz = 0; for (const g of L) { cx += g.root.position.x / L.length; cz += g.root.position.z / L.length; } yaw = L[0].root.rotation.y; }
    const c = camera.clone(); c.aspect = 1; c.fov = 42; c.updateProjectionMatrix(); const d = (who === 'both' ? 11 : 6.2) * k, a = yaw + (window.__off || 0);
    c.position.set(cx + Math.sin(a) * d, h * .62, cz + Math.cos(a) * d); c.lookAt(cx, h * .48, cz); renderer.render(scene, c);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement, s = Math.min(src.width, src.height); const g = cv.getContext('2d'); g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, W, H);
    g.font = '14px monospace'; g.fillStyle = '#fff'; g.fillText(label, 8, 18); return cv.toDataURL('image/jpeg', .88); }, [who, k, W, H, label]);
const rows = [];
await pg.evaluate(() => { window.__off = .35; }); rows.push(['statue twin + armoured', [await snap('both', 1, 'armoured (left) / statue twin (right)'), await snap('live', 1, 'armoured, front'), await (async () => { await pg.evaluate(() => { window.__off = 2.4; }); const u = await snap('live', 1, 'armoured, back 3/4'); await pg.evaluate(() => { window.__off = .35; }); return u; })()]]);
// m2782: the ORDER -- hands / feet, then forearms / head; then everything off and the SPIRIT phase; then the death, frame by frame in GAME time
const br1 = await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue); for (const s of ['handL', 'footR', 'forearmL', 'head']) mel.shadeBreak(s, i); const G = L[i]; return { broke: Object.keys(G.sh.broke), st: G.sh.st.geometry.drawRange.count / 3, sp: G.sh.sp.geometry.drawRange.count / 3 }; });
console.log('broken', JSON.stringify(br1)); await pg.waitForTimeout(1800);
rows.push(['4 pieces off', [await snap('live', 1, 'hand, foot, forearm, head off'), await (async () => { await pg.evaluate(() => { window.__off = -.9; }); const u = await snap('live', .8, 'the arm, close'); await pg.evaluate(() => { window.__off = .35; }); return u; })(), await snap('live', .6, 'the head, close')]]);
await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue); mel.shadeBare(i); }); await pg.waitForTimeout(2500);
const bare = await pg.evaluate(() => { const G = mel.shadeList().find(g => !g.statue); return { bare: G.bare, hp: G.hp, spdK: G.spdK, st: G.st }; }); console.log('bare', JSON.stringify(bare));
rows.push(['the spirit phase', [await snap('live', 1, 'all armour off: the spirit fights on'), await (async () => { await pg.waitForTimeout(2500); return snap('live', 1.1, 'spirit, +2.5 s'); })(), await snap('live', .7, 'spirit, close')]]);
await pg.evaluate(() => { const L = mel.shadeList(), i = L.findIndex(g => !g.statue); mel.shadeKill(i); });
const dz = []; for (const T of [.15, .4, .8, 1.2, 1.6, 2.0, 2.3, 2.6, 3.0]) { const ok = await pg.waitForFunction(T => { const D = mel.SHADEFX.dying[0]; return !D || D.t >= T; }, T, { timeout: 120000, polling: 50 }).then(() => 1).catch(() => 0);
  const t = await pg.evaluate(() => mel.SHADEFX.dying[0] ? +mel.SHADEFX.dying[0].t.toFixed(2) : 'gone'); dz.push(await snap('live', 1.35, 'death t=' + t + ' s (game)')); }
const tama = await pg.evaluate(() => ({ live: mel.TAMA.w.length, n: mel.TAMA.n })); console.log('tama', JSON.stringify(tama));
rows.push(['death', dz.slice(0, 3)], ['', dz.slice(3, 6)], ['', dz.slice(6, 9)]);
const png = await pg.evaluate(async ([rows, W, H]) => { const cv = document.createElement('canvas'); cv.width = 3 * W; cv.height = rows.length * H; const c = cv.getContext('2d'); c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
  for (const [r, R] of rows.entries()) for (const [k, u] of R[1].entries()) { const im = new Image(); im.src = u; await im.decode(); c.drawImage(im, k * W, r * H); } return cv.toDataURL('image/png'); }, [rows, W, H]);
fs.mkdirSync(OUT, { recursive: true }); const file = path.join(OUT, 'shade_sheet.png'); fs.writeFileSync(file, Buffer.from(png.split(',')[1], 'base64')); console.log(file);
await br.close(); srv.close();
