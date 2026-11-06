// npm run escape <zone> [--h=6] [--d=11.4] -- THE ESCAPE AUDIT (COLL.md "Containment"; his: "I got outside the level ... it'll kill the illusion").
// Boots the SHIPPED page headless in the zone (`&entry=0`), then in the page, from the shipped `groundAt` on a 1 m grid round where he stands:
//   WALKABLE  every floor cell flooded from his spawn through neighbours he can walk or step onto (|dy| <= STEPUP.lip) -- where he goes on foot
//   REACH     from every walkable cell, any floor cell within `d` m across and up to `h` m above it whose straight path has nothing taller than
//             that in the way (his move set: jump apex 2.81 + double jump + the one wall climb, 11.4 m measured with a wall jump)
//   BAD       with a BOUNDS row for the zone: a reachable cell OUTSIDE its parts. Without one: a reachable cell he cannot walk to that stands more than
//             `--above` (2.5 m) over every walkable cell within 3 m of it -- a wall top, a roof, the shell's rim.
// Whip zips (14 m to an anchor, chained to 58 m) are not modelled: they go to anchors, and the anchors are the level's -- listed as open.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('escape: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const A = process.argv.slice(2), num = (k, d) => +((A.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1] || d);
const ZONES = { ftin: ['?w=forge&zone=ftemple', 60], forest: ['?w=forge&zone=dometemple', 110], garden: ['?w=forge&zone=garden', 70], temple: ['?w=forge&zone=temple', 90], wall: ['?w=forge&zone=wall', 60] };
const want = A.filter(a => !a.startsWith('--')); if (!want.length) want.push('ftin');
const HANDLE = 'window.__es = { player, groundAt, STEPUP, BOUNDS, boundsRow, boundsPart, rig, COLL }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, HANDLE + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body);
});
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now();
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

function audit(o) {
  const S = window.__es, p = S.player.pos, R = o.R, GS = 1, N = Math.round(2 * R / GS), X0 = p.x - R, Z0 = p.z - R, LIP = S.STEPUP.lip, L = 4;
  // floor layers per cell, top down (up to L), from the shipped groundAt
  const Y = new Float32Array(N * N * L).fill(NaN);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let y = p.y + 80; for (let k = 0; k < L; k++) { const g = S.groundAt(X0 + (i + .5) * GS, Z0 + (j + .5) * GS, y, 0); if (!(g > p.y - 60)) break; Y[(j * N + i) * L + k] = g; y = g - 1.5; } }
  const top = c => { const v = Y[c * L]; return isNaN(v) ? -1e9 : v; };
  // walk flood from his cell
  const W = new Uint8Array(N * N * L), si = Math.floor((p.x - X0) / GS), sj = Math.floor((p.z - Z0) / GS), st = [];
  { const c = sj * N + si; let best = -1, bd = 1e9; for (let k = 0; k < L; k++) { const y = Y[c * L + k]; if (!isNaN(y) && Math.abs(y - p.y) < bd) { bd = Math.abs(y - p.y); best = k; } } if (best >= 0) { W[c * L + best] = 1; st.push(c * L + best); } }
  while (st.length) { const q = st.pop(), c = (q / L) | 0, y = Y[q], i = c % N, j = (c / N) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii;
      for (let k = 0; k < L; k++) { const q2 = c2 * L + k, y2 = Y[q2]; if (isNaN(y2) || W[q2]) continue; if (y2 - y <= LIP && y - y2 <= 3) { W[q2] = 1; st.push(q2); } } } }
  let nW = 0; for (const v of W) nW += v;
  const row = S.boundsRow ? S.boundsRow() : null, BAD = [], seen = new Set(); let drops = 0;
  const outside = (x, y, z, c) => { if (row) return !S.boundsPart(row, x, y + .5, z, .4); const i = c % N, j = (c / N) | 0; let hi = -1e9;
    for (let dj = -3; dj <= 3; dj++) for (let di = -3; di <= 3; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii; for (let k = 0; k < L; k++) if (W[c2 * L + k]) hi = Math.max(hi, Y[c2 * L + k]); }
    return hi < -1e8 || y > hi + o.above; };
  const D = Math.ceil(o.d / GS);
  for (let j = 0; j < N; j += 2) for (let i = 0; i < N; i += 2) for (let k = 0; k < L; k++) { const q = (j * N + i) * L + k; if (!W[q]) continue; const y0 = Y[q], ceil = y0 + o.h;
    for (let dj = -D; dj <= D; dj++) for (let di = -D; di <= D; di++) { if (di * di + dj * dj > D * D) continue; const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii;
      for (let k2 = 0; k2 < L; k2++) { const q2 = c2 * L + k2, y2 = Y[q2]; if (isNaN(y2) || W[q2] || y2 > ceil || seen.has(q2)) continue;
        let clear = true; const n = Math.max(Math.abs(di), Math.abs(dj)); for (let s = 1; s < n && clear; s++) { const cc = Math.round(j + dj * s / n) * N + Math.round(i + di * s / n); if (top(cc) > ceil) clear = false; }
        if (!clear) continue; const x = X0 + (ii + .5) * GS, z = Z0 + (jj + .5) * GS; if (!outside(x, y2, z, c2)) continue; seen.add(q2);
        if (!row && y2 < y0 + 1) { drops++; continue; }     /* auto mode: a DROP to unwalkable floor (a pit, the valley under a cliff) is counted, not called an escape -- only a bounds row can say a fall leaves the level */
        BAD.push([+x.toFixed(0), +y2.toFixed(1), +z.toFixed(0), +(y2 - y0).toFixed(1), 'from ' + (X0 + (i + .5) * GS).toFixed(0) + ',' + y0.toFixed(1) + ',' + (Z0 + (j + .5) * GS).toFixed(0)]); } } }
  // cluster BAD cells into spots
  const spots = []; for (const b of BAD) { const s = spots.find(q => Math.hypot(q.x - b[0], q.z - b[2]) < 4 && Math.abs(q.y - b[1]) < 3); if (s) s.n++; else spots.push({ x: b[0], y: b[1], z: b[2], up: b[3], from: b[4], n: 1 }); }
  spots.sort((a, b) => b.n - a.n);
  return { mode: row ? 'BOUNDS row (' + row.parts.length + ' parts)' : 'no BOUNDS row: auto (unwalkable tops > ' + o.above + ' m over the walkable floor near them)', cells: N * N, walk: nW, bad: BAD.length, drops, spots: spots.slice(0, 20), at: [p.x, p.y, p.z].map(v => +v.toFixed(1)), coll: S.COLL.mode };
}
let code = 0;
for (const z of want) {
  const Z = ZONES[z]; if (!Z) { console.log('no zone', z, Object.keys(ZONES).join(' ')); continue; }
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  await page.addInitScript(() => { try { localStorage.setItem('mel.game', 'korajin'); localStorage.removeItem('mel.coll'); } catch (e) {} });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html${Z[0]}&entry=0`, { timeout: 120000 });
    await page.waitForFunction(() => window.__es && document.getElementById('boot').classList.contains('gone') && window.__es.rig.ready, null, { timeout: 240000, polling: 1000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { const C = window.__es.COLL; if (C && C.tick) for (let i = 0; i < 400 && C.built !== 1; i++) C.tick(); });
    const R = await page.evaluate(audit, { R: Z[1], h: num('h', 6), d: num('d', 11.4), above: num('above', 2.5) });
    console.log(`== escape ${z}  [${R.mode}]  collider ${R.coll}  ${((Date.now() - t0) / 1000).toFixed(0)}s  from ${R.at.join(',')}: ${R.cells} cells, ${R.walk} walkable, BAD ${R.bad} cells in ${R.spots.length}${R.spots.length >= 20 ? '+' : ''} spots` + (R.drops ? `  (+ ${R.drops} drop cells to unwalkable floor: only a bounds row can say whether a fall leaves the level)` : ''));
    for (const s of R.spots) console.log(`    BAD  (${s.x}, ${s.y}, ${s.z})  ${s.n} cells, +${s.up} m over where he jumps ${s.from}`);
    if (R.bad) code = 1;
  } catch (e) { console.log('FAIL', z, e.message.split('\n')[0]); code = 1; }
  await page.close();
}
await browser.close(); server.close(); process.exit(code);
