// npm run escape <zone> [--h=6] [--d=11.4] -- THE ESCAPE AUDIT (COLL.md "Containment"; his: "I got outside the level ... it'll kill the illusion").
// Boots the SHIPPED page headless in the zone (`&entry=0`), then in the page, from the shipped `groundAt` on a 1 m grid round where he stands:
//   WALKABLE  every floor cell flooded from his spawn through neighbours he can walk or step onto (|dy| <= STEPUP.lip) -- where he goes on foot
//   REACH     from every walkable cell, any floor cell within `d` m across and up to `h` m above it whose straight path has nothing taller than
//             that in the way (his move set: jump apex 2.81 + double jump + the one wall climb, 11.4 m measured with a wall jump)
//   (m2752)   every flood step is rayed for a mesh wall between the two cell centres (knee, chest); every jump path is sampled every .25 m and
//             rayed at the ceiling; a target must be floor at 3 of 4 points .3 m round it and open from above. --walk=x,z prints the flood's route
//             to a cell (--full: every cell), --why=x,z every clear jump into one, --nofloodwalls the old flood (for comparison).
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
const HANDLE = 'window.__es = { player, groundAt, STEPUP, BOUNDS, boundsRow, boundsPart, rig, COLL, collRay }; ';
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
  const PAR = new Int32Array(N * N * L).fill(-1), useRay = S.collRay && S.COLL.on && !o.noflood; let wallStops = 0;
  // a step to the next cell is refused when a mesh wall stands between the two centres at his knee or chest (.6 / 1.0 m over the higher floor) --
  // without it the flood walked through walls onto a roof (the forest temple's (11, 22.2, 52), m2752)
  const wallBetween = (x, z, dx, dz, y) => { if (!useRay) return false; for (const h of [.6, 1.0]) if (S.collRay(x, y + h, z, dx, dz, GS) < GS) return true; return false; };
  const W = new Uint8Array(N * N * L), si = Math.floor((p.x - X0) / GS), sj = Math.floor((p.z - Z0) / GS), st = [];
  { const c = sj * N + si; let best = -1, bd = 1e9; for (let k = 0; k < L; k++) { const y = Y[c * L + k]; if (!isNaN(y) && Math.abs(y - p.y) < bd) { bd = Math.abs(y - p.y); best = k; } } if (best >= 0) { W[c * L + best] = 1; st.push(c * L + best); } }
  while (st.length) { const q = st.pop(), c = (q / L) | 0, y = Y[q], i = c % N, j = (c / N) | 0;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii;
      for (let k = 0; k < L; k++) { const q2 = c2 * L + k, y2 = Y[q2]; if (isNaN(y2) || W[q2]) continue; if (y2 - y <= LIP && y - y2 <= 3) { if (wallBetween(X0 + (i + .5) * GS, Z0 + (j + .5) * GS, di, dj, Math.max(y, y2))) { wallStops++; continue; } W[q2] = 1; PAR[q2] = q; st.push(q2); } } } }
  let nW = 0; for (const v of W) nW += v;
  const row = S.boundsRow ? S.boundsRow() : null, BAD = [], seen = new Set(); let drops = 0;
  const outside = (x, y, z, c) => { if (row) return !S.boundsPart(row, x, y + .5, z, .4); const i = c % N, j = (c / N) | 0; let hi = -1e9;
    for (let dj = -3; dj <= 3; dj++) for (let di = -3; di <= 3; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii; for (let k = 0; k < L; k++) if (W[c2 * L + k]) hi = Math.max(hi, Y[c2 * L + k]); }
    return hi < -1e8 || y > hi + o.above; };
  const D = Math.ceil(o.d / GS); let slivers = 0;
  // coarse: the top layer of the 1 m cells on the line (cheap reject).  path: the FINE test -- every .25 m, the shipped groundAt from just over the
  // ceiling (a top over it blocks), and the mesh walls rayed level at the ceiling and 1 m under it (a wall face reaching that high blocks even with
  // no floor on top of it -- a 1.5 m-thick wall was skipped by the 1 m centre samples).  Returns the blocker's description, or '' when clear.
  const coarse = (i, j, di, dj, ceil) => { const n = Math.max(Math.abs(di), Math.abs(dj)); for (let s = 1; s < n; s++) { const cc = Math.round(j + dj * s / n) * N + Math.round(i + di * s / n); if (top(cc) > ceil) return false; } return true; };
  const path = (ax, az, bx, bz, ceil, prof) => { const L = Math.hypot(bx - ax, bz - az); if (L < .01) return ''; const dx = (bx - ax) / L, dz = (bz - az) / L;
    for (let s = .25; s < L - .3; s += .25) { const x = ax + dx * s, z = az + dz * s, g = S.groundAt(x, z, ceil + .3, 0); if (prof) prof.push([+x.toFixed(2), +z.toFixed(2), isNaN(g) ? null : +g.toFixed(2)]); if (g > ceil) return 'top ' + g.toFixed(1) + ' at ' + x.toFixed(1) + ',' + z.toFixed(1); }
    if (S.collRay && S.COLL.on) for (const h of [ceil, ceil - 1]) { const t = S.collRay(ax, h, az, dx, dz, L - .3); if (t < L - .3) return 'wall at ' + (ax + dx * t).toFixed(1) + ',' + h.toFixed(1) + ',' + (az + dz * t).toFixed(1); }
    return ''; };
  // stand: a target he can actually land on -- floor within .3 m of it at 3 of the 4 points .3 m round it (a 1 m cell sampled in a 14 cm slot is not a floor)
  // and OPEN FROM ABOVE: the first floor down from the ceiling there is that floor (a layer under the floor he stands on is not a landing -- the
  // forest temple's (5, 0, 48), the ground 24 m under his own floor, m2752)
  const stand = (x, y, z, ceil) => { let k = 0; for (const [a, b] of [[.3, 0], [-.3, 0], [0, .3], [0, -.3]]) { const g = S.groundAt(x + a, z + b, ceil + .3, 0); if (Math.abs(g - y) < .3) k++; } return k >= 3; };
  for (let j = 0; j < N; j += 2) for (let i = 0; i < N; i += 2) for (let k = 0; k < L; k++) { const q = (j * N + i) * L + k; if (!W[q]) continue; const y0 = Y[q], ceil = y0 + o.h;
    for (let dj = -D; dj <= D; dj++) for (let di = -D; di <= D; di++) { if (di * di + dj * dj > D * D) continue; const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= N || jj >= N) continue; const c2 = jj * N + ii;
      for (let k2 = 0; k2 < L; k2++) { const q2 = c2 * L + k2, y2 = Y[q2]; if (isNaN(y2) || W[q2] || y2 > ceil || seen.has(q2)) continue;
        if (!coarse(i, j, di, dj, ceil)) continue; const x = X0 + (ii + .5) * GS, z = Z0 + (jj + .5) * GS; if (!outside(x, y2, z, c2)) continue;
        const ox = X0 + (i + .5) * GS, oz = Z0 + (j + .5) * GS; if (path(ox, oz, x, z, ceil)) continue; if (!stand(x, y2, z, ceil)) { slivers++; continue; } seen.add(q2);
        if (!row && y2 < y0 + 1) { drops++; continue; }     /* auto mode: a DROP to unwalkable floor (a pit, the valley under a cliff) is counted, not called an escape -- only a bounds row can say a fall leaves the level */
        BAD.push([+x.toFixed(0), +y2.toFixed(1), +z.toFixed(0), +(y2 - y0).toFixed(1), 'from ' + (X0 + (i + .5) * GS).toFixed(0) + ',' + y0.toFixed(1) + ',' + (Z0 + (j + .5) * GS).toFixed(0)]); } } }
  // cluster BAD cells into spots
  const spots = []; for (const b of BAD) { const s = spots.find(q => Math.hypot(q.x - b[0], q.z - b[2]) < 4 && Math.abs(q.y - b[1]) < 3); if (s) s.n++; else spots.push({ x: b[0], y: b[1], z: b[2], up: b[3], from: b[4], n: 1 }); }
  spots.sort((a, b) => b.n - a.n);
  let why = null; if (o.why) { const [wx, wz] = o.why; why = [];
    for (let j = 0; j < N && why.length < 6; j += 2) for (let i = 0; i < N && why.length < 6; i += 2) for (let k = 0; k < L; k++) { const q = (j * N + i) * L + k; if (!W[q]) continue; const ox = X0 + (i + .5) * GS, oz = Z0 + (j + .5) * GS, y0 = Y[q];
      if (Math.hypot(wx - ox, wz - oz) > o.d) continue; const prof = [], b = path(ox, oz, wx, wz, y0 + o.h, prof); if (!b) why.push({ from: [ox, +y0.toFixed(1), oz], prof }); } }
  // --walk=x,z: the flood's own route to the walkable cell there (parent chain, spawn first)
  let walk = null; if (o.walk) { const i = Math.floor((o.walk[0] - X0) / GS), j = Math.floor((o.walk[1] - Z0) / GS), c = j * N + i; walk = [];
    for (let k = 0; k < L; k++) if (W[c * L + k]) { let q = c * L + k; const ch = []; while (q >= 0 && ch.length < 2000) { const cc = (q / L) | 0; ch.push([+(X0 + (cc % N + .5) * GS).toFixed(1), +Y[q].toFixed(1), +(Z0 + (((cc / N) | 0) + .5) * GS).toFixed(1)]); q = PAR[q]; } walk.push(ch.reverse()); } }
  return { why, route: walk, wallStops, slivers, mode: row ? 'BOUNDS row (' + row.parts.length + ' parts)' : 'no BOUNDS row: auto (unwalkable tops > ' + o.above + ' m over the walkable floor near them)', cells: N * N, walk: nW, bad: BAD.length, drops, spots: spots.slice(0, 20), at: [p.x, p.y, p.z].map(v => +v.toFixed(1)), coll: S.COLL.mode };
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
    const W = (A.find(a => a.startsWith('--why=')) || '').split('=')[1], WK = (A.find(a => a.startsWith('--walk=')) || '').split('=')[1]; const R = await page.evaluate(audit, { R: Z[1], h: num('h', 6), d: num('d', 11.4), above: num('above', 2.5), why: W ? W.split(',').map(Number) : null, walk: WK ? WK.split(',').map(Number) : null, noflood: A.includes('--nofloodwalls') });
    console.log(`== escape ${z}  [${R.mode}]  collider ${R.coll}  ${((Date.now() - t0) / 1000).toFixed(0)}s  from ${R.at.join(',')}: ${R.cells} cells, ${R.walk} walkable, BAD ${R.bad} cells in ${R.spots.length}${R.spots.length >= 20 ? '+' : ''} spots` + (R.drops ? `  (+ ${R.drops} drop cells to unwalkable floor: only a bounds row can say whether a fall leaves the level)` : ''));
    if (R.slivers) console.log(`    (${R.slivers} cells dropped as slivers: no floor at 3 of 4 points .3 m round the cell centre)`);
    for (const s of R.spots) console.log(`    BAD  (${s.x}, ${s.y}, ${s.z})  ${s.n} cells, +${s.up} m over where he jumps ${s.from} -> ${s.x},${s.y},${s.z}`);
    console.log(`    (${R.wallStops} flood steps refused by a mesh wall between cells)`);
    if (R.route) { console.log(`  --walk: ${R.route.length} walkable layers there`); for (const w of R.route) { const keep = w.filter((p, k) => k === 0 || k === w.length - 1 || Math.abs(p[1] - w[k - 1][1]) > .3); console.log('    ' + w.length + ' cells; height changes: ' + keep.map(p => p.join(',')).join(' > ')); if (A.includes('--full')) console.log('    ' + w.map(p => p.join(',')).join(' > ')); } }
    if (R.why) { console.log(`  --why: ${R.why.length} clear jumps into it` + (R.why.length ? ' (path every .25 m: x, z, top under the ceiling)' : '')); for (const w of R.why) console.log(`    from ${w.from.join(',')}: ` + w.prof.map(p => `(${p[0]},${p[1]} ${p[2]})`).join(' ')); }
    if (R.bad) code = 1;
  } catch (e) { console.log('FAIL', z, e.message.split('\n')[0]); code = 1; }
  await page.close();
}
await browser.close(); server.close(); process.exit(code);
