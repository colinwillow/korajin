// npm run dvplan -- THE SUNWELL's plan (DESERT_VILLAGE.md). Lifts the SHIPPED `DVILLAGE` table (between its SC_DVILLAGE markers, never a copy),
// lays out the spiral, CHECKS EVERY LINK of the route against his body (riser <= .32 m, walk slope <= 30 deg, a hop's rise <= 1.6 m and its
// edge-to-edge gap <= 3 m -- his apex is 2.8 m and a comfy level gap 6.5 m), prints the table of links, and draws a TOP-DOWN plan and an
// unrolled SIDE SECTION of the climb to images/plan/desert_village_plan.png. Exits 1 on a BAD link.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), m = /\/\/ SC_DVILLAGE:START([\s\S]*?)\/\/ SC_DVILLAGE:END/.exec(src);
if (!m) { console.error('no SC_DVILLAGE markers'); process.exit(1); }
const V = new Function(m[1] + '\nreturn DVILLAGE;')();
const geo = new Function('V', 'return ' + (/\/\/ DVGEO:START([\s\S]*?)\/\/ DVGEO:END/.exec(src) || [, 'null'])[1].trim().replace(/^function dvGeo/, 'function'))();
if (!geo) { console.error('no DVGEO markers'); process.exit(1); }
const G = geo(V); let bad = 0;
const rows = G.links.map(L => { const ok = L.bad.length === 0; if (!ok) bad++; return (ok ? 'ok  ' : 'BAD ') + L.id.padEnd(3) + ' ' + L.k.padEnd(6) + ' ' + (L.a + '->' + L.b).padEnd(10) + ' gap ' + L.gap.toFixed(1).padStart(5) + ' m  rise ' + L.rise.toFixed(1).padStart(4) + ' m  ' + L.note + (ok ? '' : '  <- ' + L.bad.join('; ')); });
console.log(rows.join('\n'));
// --- the drawing (an SVG, rasterised in headless Chromium)
const S = 6, U0 = -62, U1 = 46, V0 = -42, V1 = 42, W = (U1 - U0) * S, H = (V1 - V0) * S, X = u => (u - U0) * S, Y = v => (v - V0) * S;
const yc = y => { const t = Math.max(0, Math.min(1, y / 30)); return `hsl(${38 - t * 200},${55 + t * 20}%,${72 - t * 25}%)`; };
let svg = `<rect width="${W}" height="${H}" fill="#efd9ae"/>`;
svg += `<line x1="${X(U0)}" y1="${Y(0)}" x2="${X(U1)}" y2="${Y(0)}" stroke="#b0603a" stroke-width="1" stroke-dasharray="6 4"/>`;     // the axis
for (let k = 0; k < 8; k++) { const a = (22.5 + k * 45) * Math.PI / 180; svg += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(Math.cos(a) * 40)}" y2="${Y(Math.sin(a) * 40)}" stroke="#c9a77a" stroke-width=".6"/>`; }
for (const r of [10, 26]) svg += `<circle cx="${X(0)}" cy="${Y(0)}" r="${r * S}" fill="none" stroke="#c9a77a" stroke-width=".8" stroke-dasharray="3 3"/>`;
{ let d = ''; G.isles.forEach((I, k) => { d += (k ? 'L' : 'M') + X(I.u).toFixed(1) + ' ' + Y(I.v).toFixed(1); }); svg += `<path d="${d}" fill="none" stroke="#d4a017" stroke-width="2" stroke-dasharray="8 4" opacity=".8"/>`; }     // the golden spiral it climbs
svg += `<rect x="${X(V.avenue.u0)}" y="${Y(-V.avenue.w / 2)}" width="${(V.avenue.u1 - V.avenue.u0) * S}" height="${V.avenue.w * S}" fill="#d8c3a0" stroke="#9a7a55"/>`;
svg += `<circle cx="${X(0)}" cy="${Y(0)}" r="${V.court.r * S}" fill="#d8c3a0" stroke="#9a7a55" stroke-width="1.5"/>`;
for (const b of G.beds) svg += `<rect x="${X(b.u) - 9}" y="${Y(b.v) - 6}" width="18" height="12" fill="#7a9a4a" transform="rotate(${b.th} ${X(b.u)} ${Y(b.v)})"/>`;
for (const p of G.palms) svg += `<circle cx="${X(p.u)}" cy="${Y(p.v)}" r="5" fill="#3f7a4a"/>`;
for (const l of G.lanterns) svg += `<circle cx="${X(l.u)}" cy="${Y(l.v)}" r="2.2" fill="#ffb347"/>`;
for (const s of G.stalls) svg += `<rect x="${X(s.u) - 9}" y="${Y(s.v) - 7}" width="18" height="14" fill="#a8483a" opacity=".85"/>`;
for (const I of G.isles) svg += I.R === 0 ? `<circle cx="${X(I.u)}" cy="${Y(I.v)}" r="${I.r * S}" fill="${yc(I.y)}" fill-opacity=".18" stroke="#2a3a8a" stroke-width="2" stroke-dasharray="5 3"/>` : `<circle cx="${X(I.u)}" cy="${Y(I.v)}" r="${I.r * S}" fill="${yc(I.y)}" stroke="#4a3a2a" stroke-width="1.5" opacity=".92"/>`;
for (const L of G.links) { const col = { stair: '#6b5a48', rope: '#8a5a2a', hop: '#2a6a8a', hstair: '#5a3a6a' }[L.k];
  if (L.k === 'hop') { for (const s of L.stones) svg += `<circle cx="${X(s.u)}" cy="${Y(s.v)}" r="${s.r * S}" fill="${yc(s.y)}" stroke="${col}" stroke-width="1.2"/>`; }
  else svg += `<line x1="${X(L.pa[0])}" y1="${Y(L.pa[1])}" x2="${X(L.pb[0])}" y2="${Y(L.pb[1])}" stroke="${col}" stroke-width="${(L.w || 2) * S}" stroke-linecap="butt" opacity=".85"/>`;
  if (L.bad.length) svg += `<circle cx="${X((L.pa[0] + L.pb[0]) / 2)}" cy="${Y((L.pa[1] + L.pb[1]) / 2)}" r="10" fill="none" stroke="red" stroke-width="3"/>`; }
for (const B of G.buildings) if (B.on !== 'sky') svg += `<rect x="${X(B.u) - B.s[0] * S / 2}" y="${Y(B.v) - B.s[1] * S / 2}" width="${B.s[0] * S}" height="${B.s[1] * S}" fill="#c98a5a" stroke="#5a3a2a" transform="rotate(${-B.yaw * 180 / Math.PI} ${X(B.u)} ${Y(B.v)})"/>`;
svg += `<circle cx="${X(0)}" cy="${Y(0)}" r="${1.4 * S}" fill="#3a7a9a" stroke="#2a4a5a" stroke-width="2"/>`;     // the well
for (const I of G.isles) svg += `<text x="${X(I.u)}" y="${Y(I.v) + 4}" font-size="12" text-anchor="middle" font-family="monospace" fill="#1a1208">${I.id} +${I.y}</text>`;
svg += `<text x="${X(V.avenue.u0) + 4}" y="${Y(-V.avenue.w / 2) - 6}" font-size="12" font-family="monospace" fill="#5a2a1a">gate / market avenue -> well -> hall (the axis; the landing is west)</text>`;
svg += `<text x="8" y="16" font-size="14" font-family="monospace" font-weight="bold" fill="#2a1a0a">THE SUNWELL -- top-down (u east, v south; 1 px = ${(1 / S).toFixed(2)} m)</text>`;
svg += `<text x="8" y="${H - 8}" font-size="11" font-family="monospace" fill="#2a1a0a">links: stair (brown) rope bridge (tan) hops (blue stones) hanging stair (violet); isles coloured by height; red ring = BAD link</text>`;
// the unrolled section: the route's path length along x, height up
const SH = 260, SX = (W - 40) / (V.court.r + G.links.reduce((a, L) => a + L.gap + 2 * G.node(L.b).r, 0)); let sec = `<rect width="${W}" height="${SH}" fill="#f6ead2"/>`; let x = 20; const sy = y => SH - 30 - y * 6.4;
sec += `<line x1="0" y1="${sy(0)}" x2="${W}" y2="${sy(0)}" stroke="#9a7a55"/>`;
const node = id => id === 'court' ? { id: 'court', y: 0, r: V.court.r } : G.isles.find(i => i.id === id);
let prev = node('court'); sec += `<rect x="${x}" y="${sy(0)}" width="${prev.r * SX}" height="4" fill="#9a7a55"/>`; x += prev.r * SX;
for (const L of G.links) { const b = node(L.b), x1 = x + L.gap * SX, col = { stair: '#6b5a48', rope: '#8a5a2a', hop: '#2a6a8a', hstair: '#5a3a6a' }[L.k];
  if (L.k === 'hop') { let xx = x; const seg = L.gap / (L.n + 1); L.stones.forEach((s, k) => { const cx = x + (k + 1) * (L.gap / (L.n + 1)) * SX; sec += `<rect x="${cx - s.r * SX}" y="${sy(s.y)}" width="${s.r * 2 * SX}" height="5" fill="${col}"/>`; }); }
  else if (L.k === 'rope') { let d = ''; for (let t = 0; t <= 1.001; t += .05) d += (t ? 'L' : 'M') + (x + t * L.gap * SX).toFixed(1) + ' ' + sy(prev.y + L.rise * t - 4 * L.sag * t * (1 - t)).toFixed(1); sec += `<path d="${d}" stroke="${col}" stroke-width="3" fill="none"/>`; }
  else { const n = L.steps; let d = 'M' + x + ' ' + sy(prev.y); for (let k = 0; k < n; k++) { const xa = x + (k + 1) * L.gap / n * SX, ya = prev.y + (k + 1) * L.rise / n; d += 'V' + sy(ya).toFixed(1) + 'H' + xa.toFixed(1); } sec += `<path d="${d}" stroke="${col}" stroke-width="2.5" fill="none"/>`; }
  sec += `<text x="${(x + x1) / 2}" y="${sy(Math.max(prev.y, b.y)) - 10}" font-size="11" text-anchor="middle" font-family="monospace" fill="${L.bad.length ? 'red' : '#2a1a0a'}">${L.id} ${L.k}</text>`;
  x = x1; sec += `<rect x="${x}" y="${sy(b.y)}" width="${b.r * 2 * SX}" height="6" fill="${yc(b.y)}" stroke="#4a3a2a"/><text x="${x + b.r * SX}" y="${sy(b.y) + 20}" font-size="11" text-anchor="middle" font-family="monospace">${b.id} +${b.y}</text>`;
  sec += `<path d="M${x + b.r * .3 * SX} ${sy(b.y) + 6} L${x + b.r * SX} ${sy(b.y - b.root)} L${x + b.r * 1.7 * SX} ${sy(b.y) + 6}" fill="#b07050" opacity=".5"/>`;
  x += b.r * 2 * SX; prev = b; }
for (const h of [0, 10, 20, 30]) sec += `<text x="2" y="${sy(h) + 4}" font-size="10" font-family="monospace">+${h}</text>`;
sec += `<text x="8" y="16" font-size="14" font-family="monospace" font-weight="bold" fill="#2a1a0a">SIDE SECTION -- the climb unrolled (court -> i1 ... i6 -> sky shrine over the well), 6.4 px per metre up</text>`;
const html = `<!doctype html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + SH}"><g>${svg}</g><g transform="translate(0 ${H})">${sec}</g></svg></body>`;
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (pw && !process.argv.includes('--no-png')) { const br = await pw.chromium.launch(), pg = await br.newPage({ viewport: { width: W, height: H + SH } }); await pg.setContent(html);
  const out = path.join(ROOT, 'images/plan/desert_village_plan.png'); await pg.screenshot({ path: out }); await br.close(); console.log('->', path.relative(ROOT, out)); }
console.log(bad ? bad + ' BAD link(s)' : 'every link walkable or jumpable');
process.exit(bad ? 1 : 0);
