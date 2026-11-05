// npm run templesheet [temple ...] -- THE TEMPLE PLANNING SHEET (TEMPLE_TEMPLATE.md): one image per temple, in the style of his reference
// sheets (images/reference/temples/): an exploded ISOMETRIC view of the rooms, a TOP-DOWN plan on a grid with the chambers lettered, an
// unrolled SIDE SECTION with the levels, and the TABLE (chamber, type, teach / test / twist, reward, enemies, interactions, whip-only rule).
// The temple is a data file, `tools/temples/<id>.mjs` -- edit it, re-run, the sheet follows. Writes docs/temples/<id>_sheet.png.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, 'docs/temples'); fs.mkdirSync(OUT, { recursive: true });
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
// the chamber TYPES (his tags) -> colour; the LINK kinds -> colour / dash
const TY = { puzzle: ['PUZZLE', '#e8b93a'], battle: ['BATTLE', '#d9534a'], acro: ['ACROBATIC', '#4f8fd9'], rest: ['REST', '#6cc08b'], secret: ['SECRET', '#9a6cd0'],
  treasure: ['TREASURE', '#d8a640'], hub: ['HUB', '#7fc6d8'], boss: ['BOSS', '#a3243f'] };
const LK = { open: ['#7d7462', ''], key: ['#c9971f', ''], whip: ['#2f8a3a', ''], oneway: ['#d9772a', '6 4'], short: ['#3a9a9a', '3 5'], seal: ['#a3243f', ''] };
const LKN = { open: 'open', key: 'SMALL KEY door', whip: 'needs the WHIP', oneway: 'one-way drop', short: 'shortcut / loop-back', seal: 'the SHARD SEAL' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function poly(sh) { const [k, cx, cz] = sh; if (k === 'rect') { const w = sh[3] / 2, d = sh[4] / 2; return [[cx - w, cz - d], [cx + w, cz - d], [cx + w, cz + d], [cx - w, cz + d]]; }
  const r = sh[3], n = k === 'circle' ? 28 : k === 'hex' ? 6 : 12, out = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (k === 'hex' ? Math.PI / 6 : 0), rr = k === 'star' && i % 2 ? r * .55 : r; out.push([cx + Math.sin(a) * rr, cz + Math.cos(a) * rr]); } return out.reverse(); }     /* counter-clockwise in x/z, like the rect (the wall test needs it) */
const ext = sh => sh[0] === 'rect' ? [sh[3], sh[4]] : [sh[3] * 2, sh[3] * 2];
function sheet(T) { const W = 1600, byId = Object.fromEntries(T.rooms.map(r => [r.id, r])), col = r => (TY[r.types[0]] || TY.hub)[1];
  // --- 1. THE ISOMETRIC VIEW (exploded: each level lifted apart, as his sheets do; the camera at the south-east)
  const IW = 1010, IH = 1010, EX = T.explode || 4.4, c30 = .866, raw = (x, y, z) => [(x + z) * c30, (x - z) * .5 - y * EX * .5];
  let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9; for (const r of T.rooms) for (const [x, z] of poly(r.shape)) for (const yy of [r.y - 3, r.y + 4]) { const [u, v] = raw(x, yy, z); bx0 = Math.min(bx0, u); bx1 = Math.max(bx1, u); by0 = Math.min(by0, v); by1 = Math.max(by1, v); }
  const KS = Math.min((IW - 60) / (bx1 - bx0), (IH - 70) / (by1 - by0)), iso = (x, y, z) => { const [u, v] = raw(x, y, z); return [30 + (u - bx0) * KS + ((IW - 60) - (bx1 - bx0) * KS) / 2, 30 + (v - by0) * KS]; };     /* fitted to the frame */
  let I = `<svg width="${IW}" height="${IH}" viewBox="0 0 ${IW} ${IH}"><defs>`; const rooms = [...T.rooms].sort((a, b) => (a.y - b.y) || ((a.shape[1] - a.shape[2]) - (b.shape[1] - b.shape[2])));
  rooms.forEach((r, k) => { const P = poly(r.shape); I += `<clipPath id="c${k}"><polygon points="${P.map(([x, z]) => iso(x, r.y, z).join(',')).join(' ')}"/></clipPath>`; }); I += `</defs>`;
  // the links first (dashed ropes of light between the rooms' floors)
  const ctr = r => [r.shape[1], r.shape[2]];
  for (const [a, b, k, lab] of T.links) { const A = byId[a], B = byId[b]; if (!A || !B) continue; const [ax, az] = ctr(A), [bx, bz] = ctr(B), p = iso(ax, A.y + .5, az), q = iso(bx, B.y + .5, bz), [c, d] = LK[k] || LK.open;
    I += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${c}" stroke-width="4" stroke-dasharray="${d || '10 5'}" opacity=".55"/>`; }
  rooms.forEach((r, k) => { const P = poly(r.shape), n = P.length, hv = Math.min(r.h, 7) * 1.7 / EX, y = r.y;     /* walls and slabs are drawn at true-ish height, not exploded */ let walls = '', slab = '';
    for (let i = 0; i < n; i++) { const [x0, z0] = P[i], [x1, z1] = P[(i + 1) % n], ex = x1 - x0, ez = z1 - z0, nx = ez, nz = -ex;     // outward normal (counter-clockwise polygon in x/z -> (ez, -ex))
      const far = (-nx + nz) > 0, q = (x, yy, z) => iso(x, yy, z).join(',');
      if (far) walls += `<polygon points="${q(x0, y, z0)} ${q(x1, y, z1)} ${q(x1, y + hv, z1)} ${q(x0, y + hv, z0)}" fill="#d8d0b8" stroke="#4a4234" stroke-width="1.6"/><line x1="${iso(x0, y + hv, z0)[0]}" y1="${iso(x0, y + hv, z0)[1]}" x2="${iso(x1, y + hv, z1)[0]}" y2="${iso(x1, y + hv, z1)[1]}" stroke="#f4efdf" stroke-width="3"/>`;
      else slab += `<polygon points="${q(x0, y, z0)} ${q(x1, y, z1)} ${q(x1, y - 2.6 / EX, z1)} ${q(x0, y - 2.6 / EX, z0)}" fill="#5c4b39" stroke="#3a2f24" stroke-width="1.4"/>`; }
    const fl = P.map(([x, z]) => iso(x, y, z).join(',')).join(' '); let grid = ''; const xs = P.map(p => p[0]), zs = P.map(p => p[1]), g = T.grid || 4;
    for (let gx = Math.floor(Math.min(...xs) / g) * g; gx <= Math.max(...xs); gx += g) { const a = iso(gx, y, Math.min(...zs)), b = iso(gx, y, Math.max(...zs)); grid += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
    for (let gz = Math.floor(Math.min(...zs) / g) * g; gz <= Math.max(...zs); gz += g) { const a = iso(Math.min(...xs), y, gz), b = iso(Math.max(...xs), y, gz); grid += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
    I += slab + `<polygon points="${fl}" fill="${col(r)}" stroke="#3a2f24" stroke-width="2"/><g clip-path="url(#c${k})" stroke="#000" stroke-opacity=".13" stroke-width="1">${grid}</g>`;
    if (r.types[1]) I += `<polygon points="${fl}" fill="none" stroke="${(TY[r.types[1]] || TY.hub)[1]}" stroke-width="5" stroke-dasharray="14 8" opacity=".9"/>`;
    if (r.pool) { const [cx, cz] = ctr(r), pp = poly(['circle', cx, cz, r.shape[3] * .55]).map(([x, z]) => iso(x, y + .05, z).join(',')).join(' '); I += `<polygon points="${pp}" fill="#3f7fae" stroke="#24506f" stroke-width="2"/>`; }
    if (r.seal) { const [cx, cz] = ctr(r); for (let s = 0; s < 6; s++) { const a = s / 6 * Math.PI * 2, p = iso(cx + Math.sin(a) * 4, y + .1, cz + Math.cos(a) * 4); I += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#bff7e6" stroke="#1f8a74" stroke-width="2"/>`; } }
    I += walls; });
  for (const [id, , x, z, y] of T.secrets || []) { const p = iso(x, y, z); I += `<text x="${p[0]}" y="${p[1]}" font-size="20" text-anchor="middle" fill="${TY.secret[1]}" font-weight="800">&#9733;</text>`; }
  rooms.forEach(r => { const [cx, cz] = ctr(r), p = iso(cx, r.y + 2, cz); I += `<circle cx="${p[0]}" cy="${p[1] - 6}" r="17" fill="#1d1a14" stroke="#fff" stroke-width="2"/><text x="${p[0]}" y="${p[1]}" font-size="19" font-weight="800" fill="#fff" text-anchor="middle">${esc(r.id)}</text>
    <text x="${p[0]}" y="${p[1] + 28}" font-size="13" font-weight="700" fill="#1d1a14" text-anchor="middle" paint-order="stroke" stroke="#f3f0e2" stroke-width="4">${esc(r.name)}</text>`; });
  // dotted drops between stacked levels (the hub over the boss, the crack)
  for (const [a, b, k] of T.links) { if (k !== 'seal' && k !== 'oneway') continue; const A = byId[a], B = byId[b], p = iso(B.shape[1], A.y, B.shape[2]), q = iso(B.shape[1], B.y + 2, B.shape[2]); I += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#3a2f24" stroke-width="2" stroke-dasharray="3 5"/>`; }
  I += `</svg>`;
  // --- 2. THE TOP-DOWN PLAN (a grid square = T.grid m; lettered; lower levels darker)
  const PW = 560, PS = 4.2, px = x => PW / 2 + x * PS, pz = z => PW / 2 - z * PS, lv = y => y >= 20 ? '#ece8dc' : y >= 10 ? '#dcd7c8' : y >= -2 ? '#c6c0af' : y >= -14 ? '#aaa392' : '#8a8372';
  let Pl = `<svg width="${PW}" height="${PW}"><defs><pattern id="gr" width="${(T.grid || 4) * PS}" height="${(T.grid || 4) * PS}" patternUnits="userSpaceOnUse" x="${PW / 2}" y="${PW / 2}"><path d="M ${(T.grid || 4) * PS} 0 L 0 0 0 ${(T.grid || 4) * PS}" fill="none" stroke="#000" stroke-opacity=".18"/></pattern></defs>`;
  for (const [a, b, k] of T.links) { const A = byId[a], B = byId[b]; if (!A || !B || k === 'seal') continue; Pl += `<line x1="${px(A.shape[1])}" y1="${pz(A.shape[2])}" x2="${px(B.shape[1])}" y2="${pz(B.shape[2])}" stroke="#b8b1a0" stroke-width="10"/><line x1="${px(A.shape[1])}" y1="${pz(A.shape[2])}" x2="${px(B.shape[1])}" y2="${pz(B.shape[2])}" stroke="${LK[k][0]}" stroke-width="2.5" stroke-dasharray="${LK[k][1]}"/>`; }
  for (const r of [...T.rooms].sort((a, b) => b.y - a.y).reverse()) { const pts = poly(r.shape).map(([x, z]) => px(x) + ',' + pz(z)).join(' '), dash = r.id === 'X' ? ' stroke-dasharray="8 6"' : '';
    Pl += `<polygon points="${pts}" fill="${r.id === 'X' ? 'none' : lv(r.y)}" stroke="#2a251c" stroke-width="2.2"${dash}/>` + (r.id === 'X' ? '' : `<polygon points="${pts}" fill="url(#gr)"/>`); }
  for (const r of T.rooms) { const x = px(r.shape[1]), z = pz(r.shape[2]) + (r.id === 'X' ? 30 : r.id === 'H' ? -8 : 0); Pl += `<text x="${x}" y="${z + 9}" font-size="${r.id === 'X' ? 16 : 26}" font-weight="800" text-anchor="middle" fill="#1d1a14">${r.id === 'X' ? 'X (below)' : esc(r.id)}</text>`; }
  Pl += `<g transform="translate(${PW - 62},62)"><circle r="40" fill="#f3f0e2" stroke="#5a4a3a" stroke-width="2"/><path d="M0,-36 L7,0 L0,36 L-7,0 Z" fill="#5a4a3a"/><path d="M-36,0 L0,-7 L36,0 L0,7 Z" fill="#8a7a64"/><text y="-44" font-size="14" font-weight="800" text-anchor="middle">N</text></g>`;
  Pl += `<text x="10" y="${PW - 10}" font-size="15" font-weight="700">1 square = ${T.grid || 4} m &#183; lighter = higher</text></svg>`;
  // --- 3. THE SIDE SECTION (unrolled round the hub: west wing, the N-S axis, east wing; the levels as lines)
  const order = (T.section || ['B', 'C', 'A', 'H', '0', 'D', 'E', 'F']).map(id => byId[id]).filter(Boolean), SW = 1560, SH = 360, ys = T.levels.map(l => l[1]), y0 = Math.max(...ys) + 14, y1 = Math.min(...ys) - 6, sy = y => 20 + (y0 - y) / (y0 - y1) * (SH - 40);
  const tw = order.reduce((s, r) => s + ext(r.shape)[0], 0) + 18 * order.length, sx = (SW - 150) / tw; let Se = `<svg width="${SW}" height="${SH}">`, cx0 = 120, at = {};
  for (const [nm, y] of T.levels) Se += `<line x1="100" x2="${SW}" y1="${sy(y)}" y2="${sy(y)}" stroke="#000" stroke-opacity=".18" stroke-dasharray="6 6"/><text x="8" y="${sy(y) + 5}" font-size="15" font-weight="800">${nm}  ${y > 0 ? '+' : ''}${y} m</text>`;
  for (const r of order) { const w = ext(r.shape)[0] * sx; at[r.id] = cx0 + w / 2; const x = cx0; cx0 += w + 18 * sx;
    const sub = r.id === 'H' ? byId.X : null; if (sub) { const ww = ext(sub.shape)[0] * sx; Se += `<rect x="${at.H - ww / 2}" y="${sy(sub.y + sub.h)}" width="${ww}" height="${sy(sub.y) - sy(sub.y + sub.h)}" fill="${col(sub)}" fill-opacity=".25" stroke="#2a251c" stroke-width="2"/><rect x="${at.H - ww / 2}" y="${sy(sub.y) - 3}" width="${ww}" height="7" fill="${col(sub)}"/><text x="${at.H}" y="${sy(sub.y + sub.h / 2) + 6}" font-size="20" font-weight="800" text-anchor="middle">X</text>`; }
    Se += `<rect x="${x}" y="${sy(r.y + r.h)}" width="${w}" height="${sy(r.y) - sy(r.y + r.h)}" fill="${col(r)}" fill-opacity=".22" stroke="#2a251c" stroke-width="2"/><rect x="${x}" y="${sy(r.y) - 3}" width="${w}" height="7" fill="${col(r)}"/>
      <rect x="${x}" y="${sy(r.y)}" width="${w}" height="10" fill="#5c4b39"/><text x="${x + w / 2}" y="${sy(r.y + r.h / 2) + 6}" font-size="20" font-weight="800" text-anchor="middle">${esc(r.id)}</text>
      <text x="${x + w / 2}" y="${sy(r.y) + 26}" font-size="11.5" font-weight="700" text-anchor="middle">${esc(r.name)}</text>`;
    if (r.pool) Se += `<rect x="${x + w * .22}" y="${sy(r.y) - 10}" width="${w * .56}" height="8" fill="#3f7fae"/><line x1="${x + w * .5}" x2="${x + w * .5}" y1="${sy(r.y)}" y2="${sy(byId.X ? byId.X.y + byId.X.h : r.y)}" stroke="#a3243f" stroke-width="3" stroke-dasharray="4 4"/>`; }
  if (at.B != null && at.C != null) Se += `<path d="M${at.B} ${sy(byId.B.y)} C ${at.B} ${sy(byId.B.y) + 40}, ${at.C} ${sy(byId.C.y) - 40}, ${at.C} ${sy(byId.C.y)}" stroke="#d9772a" stroke-width="3" fill="none" stroke-dasharray="6 4"/>`;
  Se += `</svg>`;
  // --- the legend and the table
  const sw = (c, t) => `<span class="sw"><i style="background:${c}"></i>${t}</span>`, lks = Object.entries(LK).map(([k, [c, d]]) => `<span class="sw"><svg width="34" height="10"><line x1="0" y1="5" x2="34" y2="5" stroke="${c}" stroke-width="4" stroke-dasharray="${d}"/></svg>${LKN[k]}</span>`).join('');
  const rows = T.rooms.map(r => `<tr><td class="L" style="background:${col(r)}">${esc(r.id)}</td><td><b>${esc(r.name)}</b>${r.built ? ' <small>(built)</small>' : ''}<br><small>${T.levels.find(l => l[1] === r.y) ? T.levels.find(l => l[1] === r.y)[0] : r.y + ' m'}</small></td><td>${r.types.map(t => `<span class="tg" style="background:${TY[t][1]}">${TY[t][0]}</span>`).join(' ')}</td><td>${esc(r.tt)}</td><td><b>${esc(r.reward)}</b></td><td>${esc(r.enemies)}</td><td>${esc(r.act)}</td><td>${esc(r.rule)}</td></tr>`).join('');
  const sec = (T.secrets || []).map(s => `<b>&#9733; ${s[0]}</b> ${esc(s[1])}`).join(' &nbsp; ');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:${T.paper};font-family:Georgia,'Times New Roman',serif;color:#1d1a14;width:${W}px}
  .pg{position:relative;width:${W}px;padding:0 0 24px} h1{font:900 64px/1 Georgia,serif;margin:0;color:${T.accent};letter-spacing:2px;text-shadow:2px 2px 0 #1d1a14}
  .top{display:flex;gap:10px;padding:18px 20px 0} .lft{width:1010px} .rgt{width:560px} .idea{font-size:15.5px;line-height:1.35;margin:8px 0 0}
  .box{border:2px solid #5a4a3a;border-radius:6px;background:rgba(255,255,255,.35);padding:10px 12px;margin-top:10px;font-size:14px;line-height:1.4}
  .sw{display:inline-flex;align-items:center;gap:6px;margin:3px 12px 3px 0;font:700 12.5px system-ui,sans-serif} .sw i{display:inline-block;width:18px;height:14px;border:1px solid #333}
  .hd{font:800 13px system-ui,sans-serif;letter-spacing:1.5px;color:#5a4a3a;margin:14px 20px 4px} .sec{padding:0 20px}
  table{border-collapse:collapse;margin:0 20px;width:1560px;font:13px/1.32 system-ui,sans-serif} td,th{border:1.5px solid #5a4a3a;padding:6px 7px;vertical-align:top;background:rgba(255,255,255,.45)}
  th{background:#5a4a3a;color:#f3f0e2;font-size:12px;letter-spacing:1px;text-align:left} td.L{font:900 24px Georgia,serif;text-align:center;color:#1d1a14;width:34px}
  .tg{display:inline-block;color:#fff;font:800 10.5px system-ui;padding:2px 5px;border-radius:3px;margin:1px 0;text-shadow:0 1px 1px #0006}
  </style></head><body><div class="pg"><div class="top"><div class="lft"><h1>${esc(T.title)}</h1><div class="idea">${esc(T.idea)}</div><div class="hd">ISOMETRIC (exploded by level, from the south-east)</div>${I}</div>
  <div class="rgt"><div class="hd" style="margin-left:0">TOP-DOWN PLAN</div>${Pl}
  <div class="box"><b>THE ITEM:</b> ${esc(T.item)}<br><b>THE GOAL:</b> ${esc(T.goal)}<br><b>THE FLOW:</b> ${esc(T.flow)}</div>
  <div class="box">${Object.values(TY).map(([n, c]) => sw(c, n)).join('')}<br><small>a second type is the dashed rim in the iso view</small><br>${lks}</div>
  <div class="box" style="font-size:13px">${sec}</div></div></div>
  <div class="hd">SIDE SECTION (unrolled round the hub: west wing | the north-south axis | east wing; X lies under the hub)</div><div class="sec">${Se}</div>
  <div class="hd">THE CHAMBERS</div><table><tr><th></th><th>CHAMBER</th><th>TYPE</th><th>TEACHES / TESTS / TWISTS</th><th>REWARD</th><th>ENEMIES</th><th>INTERACTIONS</th><th>WHIP-ONLY RULE</th></tr>${rows}</table></div></body></html>`; }
const ids = process.argv.slice(2).filter(x => !x.startsWith('--')); const list = ids.length ? ids : fs.readdirSync(path.join(ROOT, 'tools/temples')).filter(f => f.endsWith('.mjs')).map(f => f.replace('.mjs', ''));
const br = await pw.chromium.launch(), pg = await br.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
for (const id of list) { const T = (await import(pathToFileURL(path.join(ROOT, 'tools/temples', id + '.mjs')).href)).default; const html = sheet(T);
  await pg.setContent(html); const file = path.join(OUT, id + '_sheet.png'); await pg.screenshot({ path: file, fullPage: true }); console.log(file); }
await br.close();
