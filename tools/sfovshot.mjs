// npm run sfovshot [at ...] -- SMART FOV's before/after (his m2729: the temple interior pushed the boom in). Boots the forest temple at each `at`
// (roomA, roomF, boss...), sweeps the lens bearing for the TIGHTEST pull-in (wanted boom / actual), steps the SHIPPED stepCam to rest with SMART FOV
// OFF and ON, and saves a portrait phone-shaped frame of each side by side: <out>/sfov_<at>.png, with the numbers on it.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera, stepCam, cam, player }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const ats = process.argv.slice(2).filter(a => !a.startsWith('--')); if (!ats.length) ats.push('roomA', 'roomF', 'boss');
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const at of ats) {
  const page = await browser.newPage({ viewport: { width: 300, height: 650 }, deviceScaleFactor: 1 }); page.on('pageerror', e => console.log('  pageerror', e.message));
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=ftemple&at=${at}&grant=1&entry=0`, { timeout: 240000, waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel, null, { timeout: 240000, polling: 1000 });
    await page.waitForTimeout(+arg('settle', 10) * 1000);
    const res = await page.evaluate(() => { const { renderer: R, scene, camera, stepCam, cam } = window.__shot, F = mel.SFOV;
      const run = (az, on, n) => { F.on = on; cam.az = az; cam.sfovR = 1; for (let i = 0; i < n; i++) stepCam(1 / 30); return { want: mel.SCAM.wantD || 0, dist: cam.dist, fov: camera.fov, el: cam.el }; };
      let best = null; for (let k = 0; k < 16; k++) { const az = k / 16 * Math.PI * 2, q = run(az, 0, 25); const r = q.want / Math.max(.3, q.dist); if (!best || r > best.r) best = { az, r }; }
      const shot = (on) => { const q = run(best.az, on, 90); camera.updateMatrixWorld(); R.render(scene, camera); return Object.assign(q, { img: R.domElement.toDataURL('image/jpeg', .85) }); };
      const off = shot(0), on = shot(1); F.on = 1; return { az: best.az, r: best.r, off, on }; });
    const html = `<body style="margin:0;background:#000;display:flex;gap:6px;font:12px monospace;color:#9ff">${[['SMART FOV OFF', res.off], ['SMART FOV ON', res.on]].map(([t, q]) => `<div><div>${t}: fov ${q.fov.toFixed(1)} boom ${q.dist.toFixed(2)}/${q.want.toFixed(2)} el ${q.el.toFixed(2)}</div><img src="${q.img}"></div>`).join('')}</body>`;
    const p2 = await browser.newPage({ viewport: { width: 620, height: 680 } }); await p2.setContent(html); await p2.waitForTimeout(300); const f = path.join(OUT, 'sfov_' + at + '.png'); await p2.screenshot({ path: f, fullPage: true }); await p2.close();
    console.log(`${at}: tightest bearing ${res.az.toFixed(2)} pull x${res.r.toFixed(2)} | OFF fov ${res.off.fov.toFixed(1)} boom ${res.off.dist.toFixed(2)} | ON fov ${res.on.fov.toFixed(1)} el ${res.off.el.toFixed(2)}->${res.on.el.toFixed(2)} boom ${res.on.dist.toFixed(2)} -> ${f}`);
  } catch (e) { console.log(at, 'FAILED', e.message.split('\n')[0]); }
  await page.close();
}
await browser.close(); server.close();
