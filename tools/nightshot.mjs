// npm run nightshot [zone ...] -- NIGHT.md's contact sheet: boots the SHIPPED index.html once per zone per time (`?zone=<z>&time=day|dusk|night`),
// lets it settle, renders one frame THROUGH the night overlay (mel.nightPre / nightPost, as ctxRender does) from the game's own camera, and
// tiles DAY | DUSK | NIGHT per zone into one JPEG (SHOT_DIR or ./shots/night_sheet.jpg). Also prints draws / tris per frame.
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
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const zones = process.argv.slice(2).filter(a => !a.startsWith('--')); if (!zones.length) zones.push('forge');
const times = (process.env.TIMES || 'day,dusk,night').split(',');
const settle = +(process.env.SETTLE || 8);
fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const tiles = [];
for (const z of zones) for (const t of times) {
  const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('  pageerror', z, t, e.message));
  const q = (z === 'forge' ? '' : 'zone=' + z + '&') + 'time=' + t + '&entry=0';
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html?${q}`, { timeout: 120000 });
    await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel, null, { timeout: 240000, polling: 1000 });
    await page.waitForTimeout(settle * 1000);
    const r = await page.evaluate(() => { const { renderer, scene, camera } = window.__shot; mel.nightPre(); renderer.render(scene, camera); const url = renderer.domElement.toDataURL('image/jpeg', .85);
      const i = renderer.info.render; mel.nightPost(); return { url, calls: i.calls, tris: i.triangles, f: mel.NIGHT.f, mode: mel.NIGHT.mode }; });
    const f = path.join(OUT, `night_${z}_${t}.jpg`); fs.writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64')); tiles.push({ z, t, url: r.url });
    console.log(`${z} ${t}: f ${r.f.toFixed(2)} (${r.mode}) | ${r.calls} draws, ${(r.tris / 1000).toFixed(0)}k tris -> ${f}`);
  } catch (e) { console.log(`${z} ${t}: FAILED ${e.message.split('\n')[0]}`); }
  await page.close();
}
// the sheet: one row per zone, one column per time
const page = await browser.newPage({ viewport: { width: 640 * times.length, height: 360 * zones.length } });
await page.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${times.length},640px)">` + tiles.map(x => `<div style="position:relative;width:640px;height:360px"><img src="${x.url}" style="width:640px;height:360px;display:block"><b style="position:absolute;left:8px;top:6px;font:700 16px sans-serif;color:#fff;text-shadow:0 0 4px #000">${x.z.toUpperCase()} · ${x.t.toUpperCase()}</b></div>`).join('') + '</body>');
const sheet = path.join(OUT, 'night_sheet.jpg'); await page.screenshot({ path: sheet, type: 'jpeg', quality: 85, fullPage: true }); console.log('sheet ->', sheet);
await browser.close(); server.close();
