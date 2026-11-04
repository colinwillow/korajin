// npm run gathstrip [--at=0.6,1.2,...] [--wide=1] [--q=extra&query] -- A FRAME STRIP of THE GATHERING (GATHERING.md). Boots the SHIPPED index.html in
// `?w=forge&zone=gathering&entry=0`, lets it settle, fires the moment (`mel.gathGo`, or `--go=` another mel function), waits on the moment's OWN
// clock (`mel.GATHER.T`, so a slow software frame cannot smear the beats) and renders each frame from the game's own play camera through the night
// overlay; `--wide=1` adds a fixed wide tile per beat. One JPEG strip (SHOT_DIR or ./shots/gather_strip.jpg); draws and tris on every tile.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.SHOT_DIR || path.join(ROOT, 'shots');
const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const ats = arg('at', '0.4,1.1,2.4,3.6,4.8,6.2,7.3,8.6,10').split(',').map(Number), wide = +arg('wide', '1'), go = arg('go', 'gathGo'), W = +arg('w', 480), H = +arg('h', 300);
const extra = arg('q', ''), settle = +arg('settle', 6), pre = arg('pre', '');
fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('  pageerror', e.message));
page.on('console', m => { const t = m.text(); if (/GATHER|GETPOSE|THREW/.test(t)) console.log('  console', t); });
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=gathering&entry=0${extra ? '&' + extra : ''}`, { timeout: 120000 });
await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel && mel.GATHER && mel.GATHER.on, null, { timeout: 240000, polling: 1000 });
await page.waitForTimeout(settle * 1000);
if (pre) await page.evaluate(pre);
const tiles = [];
const shoot = async (lab, wideCam) => page.evaluate(([lab, wideCam]) => { const { renderer, scene, camera } = window.__shot, Z = mel.GATHER;
  let saved = null; if (wideCam) { saved = [camera.position.clone(), camera.quaternion.clone()]; const c = wideCam; camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(true); }
  mel.nightPre(); renderer.render(scene, camera); const url = renderer.domElement.toDataURL('image/jpeg', .85); const i = renderer.info.render; mel.nightPost();
  if (saved) { camera.position.copy(saved[0]); camera.quaternion.copy(saved[1]); camera.updateMatrixWorld(true); }
  return { url, lab: lab + ' · ' + Z.st + ' T' + Z.T.toFixed(1) + ' fill ' + Math.round(Z.fill * 100) + '% · ' + i.calls + ' DC ' + Math.round(i.triangles / 1000) + 'k', }; }, [lab, wideCam]);
const wideCam = JSON.parse(arg('cam', '[0,22,26,0,13,0]'));
tiles.push(await shoot('before', null)); if (wide) tiles.push(await shoot('before wide', wideCam));
await page.evaluate(g => mel[g](), go);
for (const t of ats) {
  try { await page.waitForFunction(t => mel.GATHER.T >= t || mel.GATHER.st !== 'gather', t, { timeout: 120000, polling: 16 }); } catch (e) { console.log('timeout at', t); }
  tiles.push(await shoot('t ' + t, null)); if (wide) tiles.push(await shoot('t ' + t + ' wide', wideCam));
}
const pose = await page.evaluate(() => JSON.stringify({ ok: mel.GETPOSE.ok, w: +mel.GETPOSE.w.toFixed(2), at: mel.GETPOSE.at.toArray().map(v => +v.toFixed(2)), p: mel.player.pos.toArray().map(v => +v.toFixed(2)), st: mel.GATHER.st }));
console.log('pose', pose);
const cols = wide ? 2 : 3, sheet = await browser.newPage({ viewport: { width: W * cols, height: H } });
await sheet.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${W}px)">` + tiles.map(x => `<div style="position:relative;width:${W}px;height:${H}px"><img src="${x.url}" style="width:${W}px;height:${H}px;display:block"><b style="position:absolute;left:6px;top:4px;font:700 12px sans-serif;color:#fff;text-shadow:0 0 3px #000">${x.lab}</b></div>`).join('') + '</body>');
const f = path.join(OUT, arg('out', 'gather_strip') + '.jpg'); await sheet.screenshot({ path: f, type: 'jpeg', quality: 82, fullPage: true }); console.log('strip ->', f);
await browser.close(); server.close();
