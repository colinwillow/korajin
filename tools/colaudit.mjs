// npm run colaudit [zone ...] [--mesh] -- WHAT IS DRAWN AGAINST WHAT COLLIDES (his: "whenever we make complex geometry, especially
// organic, the colliders are horrendous ... go fix it all"). Boots the SHIPPED index.html headless (the `shot`/`moves` pattern: a static
// server, swiftshader Chromium, a handle spliced in front of `mel`), waits for the zone to build, then in the page:
//   GROUND  a dense x/z grid. Down onto the RENDER triangles (solid materials only: no leaves, water, cards, glow) and down the COLLIDER
//           (the shipped `groundAt`, layer by layer). HOLE = a drawn walkable top with no collider within .15 m (he falls through);
//           GHOST = a collider top with nothing drawn within .6 m (he floats / stands on air); MISMATCH = the two disagree by .15-.6 m.
//   WALLS   from every standable cell, 8 horizontal rays at knee and chest. WALK-THROUGH = drawn within .7 m and no collider within .35
//           past it; INVISIBLE = collider within .7 m and nothing drawn within .35 past it.
//   LEDGES  every box the shipped `ledgeFind` would accept (its own filters, minus the hands band), sampled along its top edges: a GOOD
//           ledge has a drawn near-flat top at the lip and a drawn face under it; anything else is BAD (round rock, hill, trunk, air).
// Writes <zone>.png (top-down heat map) and <zone>.json (counts + ranked clusters) to COLAUDIT_DIR (default ./shots/colaudit, gitignored).
// `--mesh` runs it with the MESH collider on (`COLL.mode = 'mesh'`), for the before/after.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('colaudit: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.COLAUDIT_DIR || path.join(ROOT, 'shots', 'colaudit');
const ARGS = process.argv.slice(2), MESH = ARGS.includes('--mesh'), BOXM = ARGS.includes('--boxes');
// ZONES: the URL, what "built" means, the audited square (x0, x1, z0, z1) and the height window the walkable world lives in.
const ZONES = {
  garden: { url: '?w=forge&zone=garden', ready: '__ca.GARDEN.on && __ca.GARDEN.on.built && __ca.GARDEN.walls', rect: [-80, 80, -80, 80], y: [80, 200] },
  akatani: { url: '?w=forge&zone=akatani', ready: 'true', rect: [-120, 120, -120, 120], y: [-60, 200] },
  snow: { url: '?w=forge&zone=snow', ready: 'true', rect: [-120, 120, -120, 120], y: [-60, 200] },
  arena: { url: '?w=arena', ready: 'true', rect: [-70, 70, -70, 70], y: [-20, 80] },
};
const want = ARGS.filter(a => !a.startsWith('--')); if (!want.length) want.push('garden');
const HANDLE = 'window.__ca = { BOXES, boxesNear, boxNear, boxLocal, thinBox, groundAt, LEDGE, RIG, MOVE, TRI, SURF, scene, WORLD, player, GARDEN, COLL: typeof COLL !== "undefined" ? COLL : null, ledgeFind, resolveBoxes }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; if (!s.includes(k)) { console.error('colaudit: no mel handle'); process.exit(1); } body = s.replace(k, HANDLE + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body);
});
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

// ---- THE AUDIT, run in the page. Everything it calls is the shipped function off the handle.
function audit(Z) {
  const A = window.__ca, T = window.THREE || null, [X0, X1, Z0, Z1] = Z.rect, [YLO, YHI] = Z.y, t0 = performance.now();
  // (1) THE RENDER TRIANGLES -- solid things only. Foliage, water, cards, glow, sky and fx are drawn but are not things to stand on or bump into.
  const NONSOLID = /leaf|leaves|fern|grass|tuft|ivy|blossom|card|water|fall|flag|hammock|cloud|sky|glow|vein|heart|straw|flower|petal|moss|fx|beam|spark|smoke|mist|fog|dust|shadow|halo|aura|rope|cloth|sill|paddy|grain|reed|vine|weed|lotus/i;
  const mkey = new Map(); const MATS = Z.zone === 'garden' && A.GARDEN ? A.GARDEN.M : null; if (MATS) { for (const [k, m] of Object.entries(MATS)) if (m && m.isMaterial) mkey.set(m, k); }
  const tris = [], names = []; let nMesh = 0, nSkip = 0;
  const V = { x: 0, y: 0, z: 0 }, el = new Float32Array(16);
  const xf = (e, x, y, z) => { V.x = e[0] * x + e[4] * y + e[8] * z + e[12]; V.y = e[1] * x + e[5] * y + e[9] * z + e[13]; V.z = e[2] * x + e[6] * y + e[10] * z + e[14]; };
  const addMesh = (o, e, nm) => { const g = o.geometry, P = g.attributes.position, I = g.index, n = (I ? I.count : P.count) / 3, id = names.length; names.push(nm);
    for (let t = 0; t < n; t++) for (let k = 0; k < 3; k++) { const i = I ? I.getX(t * 3 + k) : t * 3 + k; xf(e, P.getX(i), P.getY(i), P.getZ(i)); tris.push(V.x, V.y, V.z); if (k === 2) tris.push(id); } };
  A.scene.updateMatrixWorld(true);
  A.scene.traverse(o => { if (!o.isMesh || o.isSkinnedMesh || !o.geometry || !o.geometry.attributes.position) return;
    for (let q = o; q; q = q.parent) if (q.visible === false) return;
    const m = Array.isArray(o.material) ? o.material[0] : o.material; if (!m) return; const key = mkey.get(m) || '';
    const nm = (o.name || '') + '|' + (m.name || '') + '|' + key + '|' + ((o.parent && o.parent.name) || '');
    if (A.COLL && A.COLL.solid ? !A.COLL.solid(o, key) : (o.userData.noSurf || m.transparent && m.opacity < .95 || m.depthWrite === false || m.side === 1 || m.blending === 2 || NONSOLID.test(nm) || (m.isMeshBasicMaterial && m.fog === false))) { nSkip++; return; }     /* the game's own test when it has one */
    const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere();
    const insts = o.isInstancedMesh ? Math.min(o.count, 4000) : 1; nMesh++;
    for (let ii = 0; ii < insts; ii++) { let e = o.matrixWorld.elements;
      if (o.isInstancedMesh) { const M = new o.matrixWorld.constructor(); o.getMatrixAt(ii, M); M.premultiply(o.matrixWorld); e = M.elements; }
      const s = g.boundingSphere, cx = e[0] * s.center.x + e[4] * s.center.y + e[8] * s.center.z + e[12], cy = e[1] * s.center.x + e[5] * s.center.y + e[9] * s.center.z + e[13], cz = e[2] * s.center.x + e[6] * s.center.y + e[10] * s.center.z + e[14];
      const r = s.radius * Math.hypot(e[0], e[1], e[2]); if (cx + r < X0 || cx - r > X1 || cz + r < Z0 || cz - r > Z1 || cy + r < YLO || cy - r > YHI || r > 400) continue;
      addMesh(o, e, nm); } });
  const TR = new Float32Array(tris), NT = TR.length / 10, CS = 1, GX = Math.ceil((X1 - X0) / CS), GZ = Math.ceil((Z1 - Z0) / CS), bins = new Array(GX * GZ);
  for (let t = 0; t < NT; t++) { const o = t * 10, i0 = Math.max(0, Math.floor((Math.min(TR[o], TR[o + 3], TR[o + 6]) - X0) / CS)), i1 = Math.min(GX - 1, Math.floor((Math.max(TR[o], TR[o + 3], TR[o + 6]) - X0) / CS)),
    k0 = Math.max(0, Math.floor((Math.min(TR[o + 2], TR[o + 5], TR[o + 8]) - Z0) / CS)), k1 = Math.min(GZ - 1, Math.floor((Math.max(TR[o + 2], TR[o + 5], TR[o + 8]) - Z0) / CS));
    if ((i1 - i0 + 1) * (k1 - k0 + 1) > 2500) continue; for (let i = i0; i <= i1; i++) for (let k = k0; k <= k1; k++) (bins[i * GZ + k] || (bins[i * GZ + k] = [])).push(o); }
  const binAt = (x, z) => { const i = Math.floor((x - X0) / CS), k = Math.floor((z - Z0) / CS); return i < 0 || k < 0 || i >= GX || k >= GZ ? null : bins[i * GZ + k]; };
  // every render surface crossing the vertical at (x, z): [y, ny(unit normal y, abs), tri] sorted top down
  const downAll = (x, z) => { const L = binAt(x, z), out = []; if (!L) return out;
    for (const o of L) { const ax = TR[o], ay = TR[o + 1], az = TR[o + 2], bx = TR[o + 3], by = TR[o + 4], bz = TR[o + 5], cx = TR[o + 6], cy = TR[o + 7], cz = TR[o + 8];
      const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz); if (Math.abs(d) < 1e-10) continue; const l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d; if (l1 < 0 || l1 > 1) continue;
      const l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d; if (l2 < 0 || l1 + l2 > 1) continue; const y = l1 * ay + l2 * by + (1 - l1 - l2) * cy;
      const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az, nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, nl = Math.hypot(nx, ny, nz) || 1;
      out.push([y, ny / nl, o]); }
    out.sort((a, b) => b[0] - a[0]); return out; };
  // a horizontal ray (x, y, z) along (dx, dz), first hit distance <= L against the render tris (Moller-Trumbore), or 1e9
  const rayH = (x, y, z, dx, dz, L, wall) => { let best = 1e9; const seen = new Set();
    for (let s = 0; s <= L + CS; s += CS * .5) { const B = binAt(x + dx * Math.min(s, L), z + dz * Math.min(s, L)); if (!B) continue;
      for (const o of B) { if (seen.has(o)) continue; seen.add(o); const ax = TR[o], ay = TR[o + 1], az = TR[o + 2], e1x = TR[o + 3] - ax, e1y = TR[o + 4] - ay, e1z = TR[o + 5] - az, e2x = TR[o + 6] - ax, e2y = TR[o + 7] - ay, e2z = TR[o + 8] - az;
        const px = -dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y, det = e1x * px + e1y * py + e1z * pz; if (Math.abs(det) < 1e-9) continue; const inv = 1 / det, tx = x - ax, ty = y - ay, tz = z - az, u = (tx * px + ty * py + tz * pz) * inv; if (u < 0 || u > 1) continue;
        const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x, v = (dx * qx + dz * qz) * inv; if (v < 0 || u + v > 1) continue; const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
        if (wall && t >= 0 && t < best) { const ny = e1z * e2x - e1x * e2z, nl = Math.hypot(e1y * e2z - e1z * e2y, ny, e1x * e2y - e1y * e2x) || 1; if (Math.abs(ny / nl) > .707) continue; }     /* walkable ground rising ahead (or a ceiling) is not a wall */
        if (t >= 0 && t < best && t <= L) { best = t; seen.hit = o; } } }
    rayH.hit = seen.hit; return best; };
  // the collider along the same ray: the first box (miny < y < maxy, top above his step) the segment enters, analytically per box (turned in its own frame)
  const NB = [], step = A.MOVE.step;
  const rayC = (x, y, z, dx, dz, L, g) => { let best = 1e9; const ex = x + dx * L, ez = z + dz * L;
    for (const b of A.boxesNear(Math.min(x, ex) - .1, Math.max(x, ex) + .1, Math.min(z, ez) - .1, Math.max(z, ez) + .1, NB)) { if ((A.COLL && A.COLL.on && b.meshRep) || y <= b.miny || y >= b.maxy || b.maxy <= g + step) continue;
      let ox = x, oz = z, ux = dx, uz = dz, hx, hz;
      if (b.cs !== undefined) { const rx = x - b.cx, rz = z - b.cz; ox = rx * b.cs + rz * b.sn; oz = -rx * b.sn + rz * b.cs; ux = dx * b.cs + dz * b.sn; uz = -dx * b.sn + dz * b.cs; hx = b.hx; hz = b.hz; }
      else { const cx = (b.minx + b.maxx) / 2, cz = (b.minz + b.maxz) / 2; ox = x - cx; oz = z - cz; hx = (b.maxx - b.minx) / 2; hz = (b.maxz - b.minz) / 2; }
      let t0 = -1e9, t1 = 1e9; for (const [o, u, h] of [[ox, ux, hx], [oz, uz, hz]]) { if (Math.abs(u) < 1e-9) { if (o < -h || o > h) { t0 = 1e9; break; } continue; } let a = (-h - o) / u, c = (h - o) / u; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); }
      if (t0 > t1 || t1 < 0) continue; const t = Math.max(0, t0); if (t <= L && t < best) best = t; }
    if (A.COLL && A.COLL.mode === 'mesh' && A.COLL.rayWall) { const t = A.COLL.rayWall(x, y, z, dx, dz, L, g); if (t < best) best = t; }
    return best; };
  // (2) GROUND, every .5 m
  const WALK = (A.COLL && A.COLL.walk) || .707, GS = .5, NX = Math.round((X1 - X0) / GS), NZ = Math.round((Z1 - Z0) / GS), code = new Uint8Array(NX * NZ), hgt = new Float32Array(NX * NZ).fill(NaN), stand = new Float32Array(NX * NZ).fill(NaN);
  // codes: 1 hole, 2 ghost, 3 mismatch, 4 walk-through wall, 5 invisible wall, 6 bad ledge
  const C = { high: 0, hole: 0, ghost: 0, mismatch: 0, walk: 0, invis: 0, ledgeBad: 0, ledgeGood: 0, cells: 0, walkable: 0 }, who = new Map(), tag = (c, o) => { if (o == null) return; const n = names[TR[o + 9]] || '?'; const k = c + ' ' + n; who.set(k, (who.get(k) || 0) + 1); };
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const x = X0 + (i + .5) * GS, z = Z0 + (j + .5) * GS, c = j * NX + i;
    const R = downAll(x, z).filter(h => h[0] > YLO && h[0] < YHI); if (R.length) hgt[c] = R[0][0];
    // walkable drawn tops: up-facing, under the game's own slope limit (`COLL.walk`, 45 deg), with 1.2 m of drawn headroom over them
    const tops = []; for (let q = 0; q < R.length; q++) if (R[q][1] > WALK && (q === 0 || R[q - 1][0] - R[q][0] > 1.2)) tops.push(R[q]);
    let flag = 0;
    for (const h of tops) { C.walkable++; const g = A.groundAt(x, z, h[0] + .3, 0), d = h[0] - g;
      if (Math.abs(d) <= .15) { if (isNaN(stand[c])) stand[c] = g; continue; }
      if (g > h[0] + .15 && g < h[0] + .6) { flag = flag || 3; C.mismatch++; tag('mismatch', h[2]); continue; }
      if (d > .15 && d < .6) { flag = flag || 3; C.mismatch++; tag('mismatch', h[2]); if (isNaN(stand[c])) stand[c] = g; continue; }
      if (d >= .6 && (d < 3.2 || g <= YLO)) { flag = 1; C.hole++; tag('hole', h[2]); } else if (d >= .6) C.high++; }     /* a top he cannot jump to from the collider under it (a mast, an envelope) is counted apart */
    // collider floors, layer by layer from the top: is anything drawn there?
    let y = YHI; for (let L = 0; L < 8; L++) { const g = A.groundAt(x, z, y, 0); if (!(g > YLO)) break; y = g - .05;
      let near = 1e9; for (const h of R) near = Math.min(near, Math.abs(h[0] - g)); if (near > .6) { if (!flag) flag = 2; C.ghost++; } }
    if (R.length || flag) C.cells++; if (flag) code[c] = flag; }
  // (3) WALLS, every 1 m from a standable spot
  const DIRS = []; for (let a = 0; a < 8; a++) DIRS.push([Math.sin(a * Math.PI / 4), Math.cos(a * Math.PI / 4)]);
  for (let j = 1; j < NZ; j += 2) for (let i = 1; i < NX; i += 2) { const c = j * NX + i, g = stand[c]; if (isNaN(g)) continue; const x = X0 + (i + .5) * GS, z = Z0 + (j + .5) * GS;
    if (rayC(x, g + .45, z, 1, 0, 0, g) === 0) continue;     /* he cannot stand here: inside a box already */
    let w = 0, v = 0; for (const yy of [.45, 1.1]) for (const [dx, dz] of DIRS) { const tr = rayH(x, g + yy, z, dx, dz, 1.05, 1), tc = rayC(x, g + yy, z, dx, dz, 1.05, g);
      if (tr <= .7 && tc > tr + .35) { w = 1; tag('walk', rayH.hit); } if (tc <= .7 && tr > tc + .35) v = 1; }
    if (w) { C.walk++; if (!code[c]) code[c] = 4; } if (v) { C.invis++; if (!code[c]) code[c] = 5; } }
  // (4) LEDGES -- the shipped `ledgeFind` from every standable cell (every 1 m) at five heights over the ground: every ledge he would actually be
  // offered. Each is checked against the drawing: GOOD = a drawn near-flat top at the lip and a drawn steep face under it, on nothing round or organic.
  const LBAD = [], LSEEN = new Set(), ORG = (A.COLL && A.COLL.noLedgeRx) || /rock|cliff|basalt|bark|trunk|lawn|soil|sand|pebble|clay|boulder/i, R0 = (A.player.r || .24) + A.LEDGE.reach;
  for (let j = 1; j < NZ; j += 2) for (let i = 1; i < NX; i += 2) { const c = j * NX + i, g = stand[c]; if (isNaN(g)) continue; const x = X0 + (i + .5) * GS, z = Z0 + (j + .5) * GS;
    for (const up of [0, .6, 1.2, 1.8, 2.4]) { const L = A.ledgeFind(x, g + up, z, R0); if (!L) continue; const key = Math.round(L.cx * 2) + ',' + Math.round(L.cz * 2) + ',' + Math.round(L.y * 2); if (LSEEN.has(key)) continue; LSEEN.add(key);
      const top = downAll(L.cx - L.nx * .25, L.cz - L.nz * .25).find(h => Math.abs(h[0] - L.y) < .6), flat = top && top[1] > .85 && Math.abs(top[0] - L.y) < .2;
      const face = rayH(L.cx + L.nx * .8, L.y - .35, L.cz + L.nz * .8, -L.nx, -L.nz, 1.2), fo = rayH.hit; let bad = !(flat && face > .45 && face < 1.15);
      if (!bad && fo != null) { const o = fo, ux = TR[o + 3] - TR[o], uy = TR[o + 4] - TR[o + 1], uz = TR[o + 5] - TR[o + 2], vx = TR[o + 6] - TR[o], vy = TR[o + 7] - TR[o + 1], vz = TR[o + 8] - TR[o + 2], fny = (uz * vx - ux * vz) / (Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) || 1); if (Math.abs(fny) > .5) bad = true; if (ORG.test(names[TR[o + 9]] || '')) bad = true; }
      if (!bad && top && ORG.test(names[TR[top[2] + 9]] || '')) bad = true;
      if (bad) { C.ledgeBad++; tag('ledge', top ? top[2] : fo); LBAD.push([+L.cx.toFixed(1), +L.y.toFixed(1), +L.cz.toFixed(1), L.mesh ? 'mesh' : 'box']); const ii = Math.floor((L.cx - X0) / GS), jj = Math.floor((L.cz - Z0) / GS); if (ii >= 0 && jj >= 0 && ii < NX && jj < NZ) code[jj * NX + ii] = 6; }
      else C.ledgeGood++; } }
  // (4b) THE COST, per call, on the standable cells: groundAt, the player's resolveBoxes (walls), ledgeFind
  const bench = {}; { const P = []; for (let c = 0; c < NX * NZ && P.length < 3000; c += 7) if (!isNaN(stand[c])) P.push([X0 + (c % NX + .5) * GS, stand[c], Z0 + (((c / NX) | 0) + .5) * GS]);
    const q = { x: 0, y: 0, z: 0 }, r = A.player.r || .24, hh = A.player.hh || 1.14, T = (f) => { const t = performance.now(); for (let k = 0; k < 3; k++) for (const p of P) f(p); return +((performance.now() - t) * 1000 / (3 * P.length)).toFixed(2); };
    bench.n = P.length; bench.groundUs = T(p => A.groundAt(p[0], p[2], p[1] + .3, A.MOVE.step)); bench.wallsUs = T(p => { q.x = p[0]; q.y = p[1]; q.z = p[2]; A.resolveBoxes(q, r, hh, 1); }); bench.ledgeUs = T(p => A.ledgeFind(p[0], p[1] + 1, p[2], r + A.LEDGE.reach)); }
  // (5) CLUSTERS -- connected flagged cells of one code, ranked by size
  const seen = new Uint8Array(NX * NZ), CL = [], NAME = ['', 'hole', 'ghost', 'mismatch', 'walk-through wall', 'invisible wall', 'bad ledge'];
  for (let c0 = 0; c0 < NX * NZ; c0++) { if (!code[c0] || seen[c0]) continue; const k = code[c0], st = [c0]; seen[c0] = 1; let n = 0, sx = 0, sz = 0, sy = 0, ny = 0;
    while (st.length) { const c = st.pop(), i = c % NX, j = (c / NX) | 0; n++; sx += X0 + (i + .5) * GS; sz += Z0 + (j + .5) * GS; if (!isNaN(hgt[c])) { sy += hgt[c]; ny++; }
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [2, 0], [-2, 0], [0, 2], [0, -2]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NX || jj >= NZ) continue; const q = jj * NX + ii; if (!seen[q] && code[q] === k) { seen[q] = 1; st.push(q); } } }
    CL.push({ kind: NAME[k], cells: n, at: [+(sx / n).toFixed(1), ny ? +(sy / ny).toFixed(1) : null, +(sz / n).toFixed(1)] }); }
  CL.sort((a, b) => b.cells - a.cells);
  // (6) THE PICTURE -- the drawn ground in grey (higher is lighter), the errors on top
  const cv = document.createElement('canvas'); cv.width = NX; cv.height = NZ; const cx2 = cv.getContext('2d'), im = cx2.createImageData(NX, NZ);
  let hlo = 1e9, hhi = -1e9; for (const h of hgt) if (!isNaN(h)) { hlo = Math.min(hlo, h); hhi = Math.max(hhi, h); }
  const COL = [null, [255, 30, 30], [230, 40, 230], [255, 220, 0], [255, 130, 0], [0, 220, 255], [60, 90, 255]];
  for (let c = 0; c < NX * NZ; c++) { const o = c * 4; let r = 18, g = 22, bl = 30; if (!isNaN(hgt[c])) { const t = (hgt[c] - hlo) / Math.max(1, hhi - hlo); r = g = bl = 70 + 120 * t; }
    if (code[c]) [r, g, bl] = COL[code[c]]; im.data[o] = r; im.data[o + 1] = g; im.data[o + 2] = bl; im.data[o + 3] = 255; }
  cx2.putImageData(im, 0, 0); const big = document.createElement('canvas'), K = Math.max(1, Math.floor(1000 / Math.max(NX, NZ))); big.width = NX * K; big.height = NZ * K + 28;
  const bx2 = big.getContext('2d'); bx2.imageSmoothingEnabled = false; bx2.fillStyle = '#111'; bx2.fillRect(0, 0, big.width, big.height); bx2.drawImage(cv, 0, 0, NX * K, NZ * K);
  bx2.font = '13px sans-serif'; let lx = 6; for (let k = 1; k < 7; k++) { bx2.fillStyle = 'rgb(' + COL[k] + ')'; bx2.fillRect(lx, NZ * K + 8, 12, 12); bx2.fillStyle = '#ddd'; bx2.fillText(NAME[k], lx + 16, NZ * K + 19); lx += 30 + bx2.measureText(NAME[k]).width; }
  const top = [...who.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  return { png: big.toDataURL('image/png'), counts: C, meshes: nMesh, skipped: nSkip, tris: NT, clusters: CL.slice(0, 60), nClusters: CL.length, culprits: top, ledges: LBAD.slice(0, 80), bench, coll: A.COLL ? A.COLL.stat : null, grid: [NX, NZ, GS], rect: Z.rect, ms: Math.round(performance.now() - t0), mode: A.COLL ? A.COLL.mode : 'boxes' };
}

let code = 0;
for (const id of want) {
  const Z = ZONES[id]; if (!Z) { console.log('no zone', id, '--', Object.keys(ZONES).join(' ')); code = 1; continue; }
  const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
  await page.addInitScript(([mesh, boxes]) => { try { localStorage.setItem('mel.game', 'korajin'); if (mesh) localStorage.setItem('mel.coll', 'mesh'); else if (boxes) localStorage.setItem('mel.coll', 'boxes'); else localStorage.removeItem('mel.coll'); } catch (e) {} }, [MESH, BOXM]);
  const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html${Z.url}`, { timeout: 120000 });
    await page.waitForFunction(r => window.__ca && document.getElementById('boot').classList.contains('gone') && eval(r), Z.ready, { timeout: 240000, polling: 1000 });
    await page.waitForTimeout(1500);
    if (process.env.COLAUDIT_EVAL) { console.log(await page.evaluate(process.env.COLAUDIT_EVAL)); if (process.env.COLAUDIT_EVAL_ONLY) { await page.close(); continue; } }
    const R = await page.evaluate(audit, { rect: Z.rect, y: Z.y, mats: null, zone: id });
    const tagN = MESH ? '_mesh' : BOXM ? '_boxes' : '';
    fs.writeFileSync(path.join(OUT, id + tagN + '.png'), Buffer.from(R.png.split(',')[1], 'base64')); delete R.png;
    fs.writeFileSync(path.join(OUT, id + tagN + '.json'), JSON.stringify(R, null, 1));
    const c = R.counts;
    console.log(`${id} [${R.mode}] ${el()}  ${R.meshes} meshes (${R.skipped} skipped as not solid), ${R.tris} tris, audit ${R.ms} ms`);
    console.log(`  walkable drawn tops ${c.walkable}: HOLES ${c.hole}  MISMATCH ${c.mismatch}  (out of reach above the collider: ${c.high})   collider floors with nothing drawn (GHOST) ${c.ghost}`);
    console.log(`  walls: WALK-THROUGH ${c.walk}  INVISIBLE ${c.invis}   ledges offered: BAD ${c.ledgeBad} / good ${c.ledgeGood}   clusters ${R.nClusters}`);
    console.log(`  cost per call (us): groundAt ${R.bench.groundUs}  walls ${R.bench.wallsUs}  ledgeFind ${R.bench.ledgeUs}  (n ${R.bench.n})` + (R.coll && R.mode === 'mesh' ? `   store: ${R.coll.tris} tris (${R.coll.floors} floor / ${R.coll.walls} wall), built in ${R.coll.ms} ms, boxes replaced ${R.coll.rep} kept ${R.coll.kept}` : ''));
    for (const k of R.clusters.slice(0, 15)) console.log(`    ${k.kind.padEnd(18)} ${String(k.cells).padStart(4)} cells at (${k.at.join(', ')})`);
    console.log('  culprits:'); for (const [k, n] of R.culprits.slice(0, 12)) console.log(`    ${String(n).padStart(5)}  ${k}`);
    if (errs.length) console.log('  pageerrors:', errs.slice(0, 3).join(' | '));
  } catch (e) { console.log('FAIL', id, el(), e.message.split('\n')[0], errs.slice(0, 3).join(' | ')); code = 1; }
  await page.close();
}
await browser.close(); server.close(); process.exit(code);
