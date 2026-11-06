// npm run places [filter ...] -- THE KORAJIN PLACE CHECKER (m2707; it replaced the Weirdport kit-city checker, which died at `turfAreas` -- cut code).
// Every DEV PLACES row (`KPLACES`, read from the SHIPPED index.html, so the list cannot drift from the menu) is booted headless, 4 at a time; once
// the zone has loaded and its entrance has run, he must be STANDING: grounded on real ground (`groundAt` within .3 m under his feet) near the
// entrance's landing (`ENTRY.land`, 1.5 m), or asleep in the hammock / riding (the prologue, the dragon). One row per place:
//   ok    standing where the place puts him            BAD   loaded, but falling / floating / far from the landing  -> exit 1
//   SKIP  did not finish loading inside `CAP` s (a heavy zone under software GL) -- not a failure; run it alone with a filter to give it time
// Args filter rows by substring of the label or URL (`npm run places forest`, `npm run places zone=lake`). CAP=<s> overrides the per-row cap.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url); let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('places: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const k0 = HTML.indexOf('const KPLACES = ['); if (k0 < 0) { console.error('places: no KPLACES in index.html'); process.exit(2); }
const blk = HTML.slice(k0, HTML.indexOf('\n];', k0) + 3), ROWS = [...blk.matchAll(/\['([^']+)', '(\?[^']+)'/g)].map(m => ({ label: m[1], url: m[2] }));
const F = process.argv.slice(2), rows = F.length ? ROWS.filter(r => F.some(f => r.label.toLowerCase().includes(f.toLowerCase()) || r.url.includes(f))) : ROWS;
const CAP = +(process.env.CAP || (F.length ? 240 : 120)), PAR = +(process.env.PAR || 4);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.bin': 'application/octet-stream' };
const HOOK = 'window.__pc = () => { const p = player, x = p.pos.x, y = p.pos.y, z = p.pos.z, g = groundAt(x, z, y + .3, .4), k = entryKey(); return { k, done: ENTRY.done, run: !!ENTRY.run, pend: !!ENTRY.pend, land: ENTRY.land || null, pos: [x, y, z], gr: !!p.grounded, gy: isFinite(g) ? g : null, sleep: !!p.sleep, ride: !!(p.dragon || p.riding || p.mamRide), card: document.getElementById("boot").classList.contains("gone") }; }; ';
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let b = fs.readFileSync(f); if (f.endsWith('index.html')) b = b.toString().replace('window.melee = window.mel = {', HOOK + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port, T0 = Date.now();
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const f1 = v => v == null ? '-' : (+v).toFixed(1);
async function one(R) { const page = await browser.newPage({ viewport: { width: 180, height: 320 }, deviceScaleFactor: 1 })     /* small: software GL's cost is per pixel */; const t0 = Date.now(); let s = null, stable = 0, verdict = null, err = '';
  page.on('pageerror', e => { if (!err) err = e.message.slice(0, 50); });
  try { await page.goto(`http://127.0.0.1:${port}/index.html${R.url}`, { timeout: CAP * 1000, waitUntil: 'commit' });
    while ((Date.now() - t0) / 1000 < CAP) { await page.waitForTimeout(500); s = await page.evaluate(() => window.__pc ? window.__pc() : null).catch(() => null); if (!s || !s.card || s.run || s.pend) { stable = 0; continue; }
      const onGround = s.gr && s.gy != null && Math.abs(s.pos[1] - s.gy) < .3, okBody = onGround || s.sleep || s.ride; stable = okBody ? stable + .5 : 0; if (stable >= 1.5) { verdict = 'ok'; break; }
      if (s.pos[1] < -60) { verdict = 'BAD'; break; } } } catch (e) { err = err || e.message.split('\n')[0].slice(0, 50); }
  if (!verdict && s && s.card && !s.run && !s.pend && (Date.now() - t0) / 1000 >= CAP) verdict = 'BAD';     // loaded and settled, and never stood
  const L = s && s.land, far = s && L && s.done === s.k && L[3] !== -1 ? Math.hypot(s.pos[0] - L[0], s.pos[2] - L[2]) : null;
  if (verdict === 'ok' && far != null && far > 1.5 && !s.sleep && !s.ride) verdict = 'BAD';
  await page.close().catch(() => {}); const sec = ((Date.now() - t0) / 1000).toFixed(0) + 's';
  const why = !s ? (err || 'never booted') : !s.card ? 'still loading' : s.run || s.pend ? 'entrance not finished' : !verdict ? '' : s.sleep ? 'asleep (prologue)' : s.ride ? 'riding' : !s.gr ? 'not grounded' : s.gy == null ? 'no ground under him' : Math.abs(s.pos[1] - s.gy) >= .3 ? 'floating ' + f1(s.pos[1] - s.gy) + ' m' : far != null && far > 1.5 ? f1(far) + ' m off the landing' : 'standing';
  return { R, v: verdict || 'SKIP', line: `${(verdict || 'SKIP').padEnd(4)} ${R.label.slice(0, 44).padEnd(44)} at ${s ? f1(s.pos[0]) + ',' + f1(s.pos[1]) + ',' + f1(s.pos[2]) : '-'}  ${why}${L && L[3] > 0 ? ' (landing moved ' + f1(L[3]) + ' m)' : ''}  ${sec}` }; }
const q = [...rows], out = []; console.log(`places: ${rows.length} of ${ROWS.length} DEV PLACES rows, ${PAR} at a time, ${CAP} s cap each`);
await Promise.all(Array.from({ length: PAR }, async () => { while (q.length) { const r = await one(q.shift()); console.log(r.line); out.push(r); } }));
await browser.close(); server.close();
const n = v => out.filter(r => r.v === v).length; console.log(`\n${n('ok')} ok, ${n('BAD')} BAD, ${n('SKIP')} SKIP  (${((Date.now() - T0) / 1000).toFixed(0)} s)`); process.exit(n('BAD') ? 1 : 0);
