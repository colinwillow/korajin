// npm run entryprobe [zone ...] -- THE ENTRANCE, per zone, headless (m2674). Boots the SHIPPED page in each zone, lets the entrance run, and prints one
// row: the landing (and how far the run-time search moved it, `ENTRY.land`), the portal, whether the drop column is clear, the entrance lens'
// look-down onto the portal, and where he really ended up. BAD = no clear landing, he ended > .6 m from the landing (a roof, a spawn put), or the
// look-down is under 12 deg. Slow (software GL): ~1-4 min a zone, 3 at a time. Not in `npm run check` (that is 4 s); run it when a zone or its
// spawn changes. Zones: the args, or every ENTRY zone in ZONES below.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url); let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('entryprobe: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ZONES = { arena: '?w=arena', home: '?w=home', test: '?w=test', forge: '?w=forge', snow: '?w=forge&zone=snow', region: '?w=forge&zone=region', village: '?w=forge&zone=region&at=village',
  wall: '?w=forge&zone=wall', duel: '?w=forge&zone=duel', prove: '?w=forge&zone=prove', rope: '?w=forge&zone=rope', temple: '?w=forge&zone=temple', dometemple: '?w=forge&zone=dometemple',
  ship: '?w=forge&zone=ship', dragon: '?w=forge&zone=dragon', tlayout: '?w=forge&zone=tlayout', cellRF: '?w=forge&zone=cell&cell=RF', cellC1: '?w=forge&zone=cell&cell=C1',
  lake: '?w=forge&zone=lake', boulders: '?w=forge&zone=boulders', ftkit: '?w=forge&zone=ftkit', ftemple: '?w=forge&zone=ftemple', ftroom: '?w=forge&zone=ftemple&at=room',
  gathering: '?w=forge&zone=gathering', interact: '?w=forge&zone=interact', whip: '?w=forge&zone=whip', combatlab: '?w=forge&zone=combatlab', fxlab: '?w=forge&zone=fxlab',
  blockout: '?w=forge&zone=blockout', lvl1: '?w=forge&lvl=1', beacon: '?w=forge&lvl=beacon' };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4' };
const HOOK = 'window.__ep = () => { const r = ENTRY.run, p = player; return { key: entryKey(), done: ENTRY.done, run: r ? { x: r.x, y: r.y, z: r.z, P: r.P ? [r.P.x, r.P.y, r.P.z] : null, sel: r.camSel || null, st: p.hdrop && p.hdrop.st } : null, land: ENTRY.land || null, pos: [p.pos.x, p.pos.y, p.pos.z], g: p.grounded, why: ENTRY.why || "" }; }; ';
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let b = fs.readFileSync(f); if (f.endsWith('index.html')) b = b.toString().replace('window.melee = window.mel = {', HOOK + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ZONES);
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const f1 = v => v == null ? '-' : (+v).toFixed(1);
async function one(z) { const page = await browser.newPage({ viewport: { width: 390, height: 720 } }); const t0 = Date.now(); let a = null, b = null, err = '';
  try { await page.goto(`http://127.0.0.1:${port}/index.html${ZONES[z]}`, { timeout: 120000 });
    await page.waitForFunction(() => window.__ep && (window.__ep().run || window.__ep().done), null, { timeout: 300000, polling: 500 }); a = await page.evaluate(() => window.__ep());
    if (a.run) { await page.waitForFunction(() => { const e = window.__ep(); return !e.run || !e.run.st; }, null, { timeout: 240000, polling: 500 }).catch(() => {}); await page.waitForTimeout(800); }
    b = await page.evaluate(() => window.__ep()); } catch (e) { err = e.message.split('\n')[0].slice(0, 60); }
  await page.close(); const s = ((Date.now() - t0) / 1000).toFixed(0) + 's';
  if (!a) return `${z.padEnd(11)} BAD  no entrance (${err})  ${s}`;
  if (!a.run) return `${z.padEnd(11)} --   no entrance here (done=${a.done})  ${s}`;
  const R = a.run, L = a.land || [], look = R.sel && R.sel.look != null ? R.sel.look * 57.3 : null, end = b ? b.pos : null, dEnd = end ? Math.hypot(end[0] - R.x, end[2] - R.z) : null, dY = end ? end[1] - R.y : null;
  const bad = []; if (L[3] === -1) bad.push('no clear landing'); if (dEnd == null || dEnd > .6 || Math.abs(dY) > .6) bad.push('ended ' + f1(dEnd) + 'm/' + f1(dY) + 'm off'); if (look != null && look < 12) bad.push('look ' + f1(look) + 'deg');
  return `${z.padEnd(11)} ${bad.length ? 'BAD ' : 'ok  '} land ${f1(R.x)},${f1(R.y)},${f1(R.z)} (moved ${L[3] > 0 ? f1(L[3]) + 'm' : L[3] === 0 ? '0' : 'NO'})  portal ${R.P ? f1(R.P[1]) : '-'}m  lens ${R.sel ? f1(R.sel.d) + 'm @' + f1(R.sel.el * 57.3) + 'deg' : '-'} look ${f1(look)}deg  end ${end ? f1(end[0]) + ',' + f1(end[1]) + ',' + f1(end[2]) : '-'}  ${bad.join('; ')}  ${s}`; }
const q = [...want], out = []; let bad = 0;
await Promise.all([0, 1, 2].map(async () => { while (q.length) { const z = q.shift(); if (!ZONES[z]) { out.push(`${z} unknown`); continue; } const row = await one(z); console.log(row); out.push(row); if (/ BAD /.test(row)) bad++; } }));
await browser.close(); server.close(); console.log(`\n${out.length} zones, ${bad} BAD`); process.exit(bad ? 1 : 0);
