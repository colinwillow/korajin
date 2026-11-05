// npm run ftplan -- the FOREST TEMPLE's design diagrams (FOREST_TEMPLE.md, "THE FLOW"): the KEY-LOCK GRAPH, the two SECTIONS (W-E and S-N
// through the well) and the top-down PLAN (a mandala: the well at the centre, four wings on the cardinal axes, the undercroft below), plus the
// PACING strip. The design is the table below (ROOMS / EDGES / PACE) -- edit it, re-run, and the pictures follow. Writes docs/forest_temple/*.png.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, 'docs/forest_temple'); fs.mkdirSync(OUT, { recursive: true });
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
// kinds -> colour (the pacing language: rest / traversal / combat / puzzle / teach-test-twist / boss)
const K = { rest: '#7fd1a8', trav: '#6fa8ff', combat: '#ff7a6a', puzzle: '#f2c14e', teach: '#c792ff', boss: '#ff3d6e', hub: '#9ad8ff', item: '#fff1a8' };
// THE ROOMS: id, name, kind, level (L3 24 m .. L0 -12 m), graph position [col,row], plan [x,z] (metres, the game's frame), what it gives
const ROOMS = [
  ['hall', '1 ENTRY HALL', 'rest', 'L3', [0, 0], [0, 63], 'arrive (the door ritual); map; checkpoint'],
  ['well', '2 THE WELL (HUB)', 'hub', 'L3-L0', [0, 1], [0, 36], 'the spine: ledges down, doors on every level, the waterfall'],
  ['acro', '3 ACROBATIC ROOM', 'trav', 'L1-L2', [-1, 2], [0, 0], 'wall run, bars, rope, slab, archers + scrap -> SMALL KEY 1'],
  ['root', '4 ROOT GALLERY', 'puzzle', 'L1-L2', [1, 2], [-42, 36], 'K1 door; root-bound blocks + arrow switches -> SMALL KEY 2; a floor crack down'],
  ['heart', '5 THE ROOT HEART', 'combat', 'L0', [1, 3], [-42, 36], 'MID-BOSS: the THORNBACK (burrower) -> THE ITEM: JINRA SEEDS'],
  ['nurs', '6 SEED NURSERY', 'teach', 'L0', [0, 3], [-22, 36], 'TEACH: safe; the only way out is a planted mushroom + a grown vine'],
  ['court', '7 THE SUNKEN COURT', 'trav', 'L1-L3', [-1, 4], [46, 36], 'K2 gate; open to the sky; a long water channel; the shrine standing in it'],
  ['thorn', '8 TERRACE OF THORNS', 'teach', 'L2', [-2, 5], [46, 14], 'TEST: archers on ledges only seeds reach; burrowers -> SMALL KEY 3'],
  ['fall', '9 THE FALL GALLERY', 'puzzle', 'L2', [0, 5], [-8, 36], 'K3 door; TWIST: seed the waterfall\'s lip -> vines choke it -> the pools drain'],
  ['shrine', '10 THE SHRINE', 'puzzle', 'L1-L3', [-1, 6], [46, 36], 'its door was under the channel; grow vines up its core -> THE CHALICE (boss key)'],
  ['gaunt', '11 STATUE GAUNTLET', 'combat', 'L3', [-1, 7], [46, 58], 'the chalice wakes the stone guardians; escape over the ROCK BRIDGE'],
  ['boss', '12 THE HOLLOW BANYAN', 'boss', 'L0', [0, 8], [0, 36], 'BOSS (with the seeds) under the well; the stolen one inside; the JINRA STONE'] ];
// THE EDGES: from, to, kind ('open' | 'key1'..'key3' | 'item' | 'boss' | 'short' (a shortcut / loop-back) | 'oneway'), label
const EDGES = [
  ['hall', 'well', 'open', 'walk to the lip'], ['well', 'acro', 'open', 'ledges down, the arch'], ['acro', 'well', 'short', 'zip down'],
  ['well', 'root', 'key1', 'K1'], ['root', 'heart', 'oneway', 'drop through the crack'], ['heart', 'nurs', 'item', 'SEEDS'],
  ['nurs', 'well', 'short', 'mushroom bounce L1 -> L3'], ['well', 'court', 'key2', 'K2'], ['court', 'thorn', 'item', 'seeds reach'],
  ['thorn', 'fall', 'key3', 'K3'], ['fall', 'court', 'item', 'the channel drains'], ['court', 'shrine', 'open', ''],
  ['shrine', 'gaunt', 'open', 'take the chalice'], ['gaunt', 'hall', 'short', 'the rock bridge (L3)'], ['well', 'boss', 'boss', 'CHALICE (the drained pool\'s stair)'] ];
const PACE = [['rest', 'hall', 2], ['trav', 'well', 3], ['trav', 'acro', 7], ['combat', 'scrap', 3], ['puzzle', 'root', 6], ['combat', 'mid-boss', 5], ['teach', 'teach', 3], ['rest', 'nursery', 1],
  ['trav', 'court', 3], ['teach', 'test', 6], ['puzzle', 'twist', 5], ['puzzle', 'shrine', 6], ['combat', 'gauntlet', 4], ['rest', 'bridge', 1], ['boss', 'BOSS', 8]];
const byId = Object.fromEntries(ROOMS.map(r => [r[0], r]));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// --- 1. THE GRAPH
function graph() { const W = 1500, H = 1290, cx = c => 750 + c * 300, cy = r => 110 + r * 128, bw = 250, bh = 78; let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif"><rect width="100%" height="100%" fill="#0e1716"/>`;
  s += `<text x="24" y="38" fill="#fff" font-size="26" font-weight="700">THE FOREST TEMPLE -- KEY / LOCK GRAPH</text><text x="24" y="62" fill="#9fb" font-size="15">one locked door open at a time; shortcuts loop back to the hub; the item opens the second half; the boss needs it</text>`;
  const ec = { open: '#8aa', key1: '#f2c14e', key2: '#f2c14e', key3: '#f2c14e', item: '#c792ff', boss: '#ff3d6e', short: '#7fd1a8', oneway: '#ff9a4a' };
  s += `<defs>${Object.entries(ec).map(([k, c]) => `<marker id="a${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="${c}"/></marker>`).join('')}</defs>`;
  for (const [a, b, k, lab] of EDGES) { const A = byId[a], B = byId[b]; let x1 = cx(A[4][0]), y1 = cy(A[4][1]) + 30, x2 = cx(B[4][0]), y2 = cy(B[4][1]) + 30; const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const sh = k === 'short' ? 1 : 0, mx = (x1 + x2) / 2 + (sh ? -dy / L * 90 : 0), my = (y1 + y2) / 2 + (sh ? dx / L * 90 : 0);
    const cut = (x, y, tx, ty) => { const ux = tx - x, uy = ty - y, l = Math.hypot(ux, uy) || 1, t = Math.min(bw / 2 / Math.abs(ux / l || 1e-6), bh / 2 / Math.abs(uy / l || 1e-6)); return [x + ux / l * t, y + uy / l * t]; };
    [x1, y1] = cut(x1, y1, mx, my); [x2, y2] = cut(x2, y2, mx, my);
    s += `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" fill="none" stroke="${ec[k]}" stroke-width="${k === 'open' ? 2 : 3.2}" ${sh ? 'stroke-dasharray="9 6"' : ''} marker-end="url(#a${k})"/>`;
    s += `<text x="${(x1 + x2) / 2 * .5 + mx * .5 + 6}" y="${(y1 + y2) / 2 * .5 + my * .5 - 6}" fill="${ec[k]}" font-size="13" font-weight="600">${esc(lab)}</text>`; }
  for (const R of ROOMS) { const x = cx(R[4][0]) - bw / 2, y = cy(R[4][1]) - 9; s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="#152523" stroke="${K[R[2]]}" stroke-width="3"/>`;
    s += `<text x="${x + 12}" y="${y + 24}" fill="${K[R[2]]}" font-size="16" font-weight="700">${esc(R[1])}</text><text x="${x + bw - 12}" y="${y + 24}" fill="#cde" font-size="12" text-anchor="end">${R[3]}</text>`;
    const words = R[6].split(' '); let line = '', ly = y + 43; for (const w of words) { if ((line + ' ' + w).length > 34) { s += `<text x="${x + 12}" y="${ly}" fill="#dfe" font-size="12">${esc(line)}</text>`; ly += 15; line = w; } else line = line ? line + ' ' + w : w; } s += `<text x="${x + 12}" y="${ly}" fill="#dfe" font-size="12">${esc(line)}</text>`; }
  const leg = [['open', 'open way'], ['key1', 'SMALL KEY door'], ['item', 'needs THE ITEM (seeds)'], ['boss', 'BOSS door (the chalice)'], ['short', 'SHORTCUT / loop-back'], ['oneway', 'one-way drop']];
  leg.forEach(([k, t], i) => { s += `<line x1="${30 + i * 245}" y1="${H - 30}" x2="${70 + i * 245}" y2="${H - 30}" stroke="${ec[k]}" stroke-width="4" ${k === 'short' ? 'stroke-dasharray="9 6"' : ''}/><text x="${78 + i * 245}" y="${H - 25}" fill="#dfe" font-size="14">${t}</text>`; });
  return s + '</svg>'; }
// --- 2. THE SECTIONS (W-E and S-N through the well; the four levels)
function section() { const W = 1500, H = 1090; let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif"><rect width="100%" height="100%" fill="#0e1716"/>`;
  s += `<text x="24" y="38" fill="#fff" font-size="26" font-weight="700">THE FOREST TEMPLE -- SECTIONS (four levels; it is DEEP, not wide)</text>`;
  const lv = { L3: 24, L2: 12, L1: 0, L0: -12 };
  const one = (oy, title, rooms, axis) => { const sx = x => 750 + x * 9.2, sy = y => oy + 62 + (34 - y) * 7.0; s += `<text x="24" y="${oy + 10}" fill="#9fb" font-size="18" font-weight="700">${title}</text>`;
    for (const [n, y] of Object.entries(lv)) { s += `<line x1="40" y1="${sy(y)}" x2="${W - 40}" y2="${sy(y)}" stroke="#2b4a46" stroke-dasharray="4 6"/><text x="44" y="${sy(y) - 5}" fill="#6c9" font-size="14">${n} (${y} m)</text>`; }
    s += `<rect x="${sx(-10)}" y="${sy(30)}" width="${sx(10) - sx(-10)}" height="${sy(-24) - sy(30)}" fill="none" stroke="${K.hub}" stroke-width="2.5"/><text x="${sx(0)}" y="${sy(31)}" fill="${K.hub}" font-size="15" text-anchor="middle" font-weight="700">THE WELL (hub)</text>`;
    for (let k = 0; k < 7; k++) { const y = 21 - 3 * k, x = (k % 2 ? 1 : -1) * 7; s += `<rect x="${sx(x) - 14}" y="${sy(y)}" width="28" height="4" fill="${K.trav}"/>`; }
    for (const [lab, x0, x1, y0, y1, k] of rooms) { s += `<rect x="${sx(x0)}" y="${sy(y1)}" width="${sx(x1) - sx(x0)}" height="${sy(y0) - sy(y1)}" rx="6" fill="${K[k]}22" stroke="${K[k]}" stroke-width="2.5"/>`;
      s += `<text x="${(sx(x0) + sx(x1)) / 2}" y="${(sy(y0) + sy(y1)) / 2 + 5}" fill="${K[k]}" font-size="14" text-anchor="middle" font-weight="700">${esc(lab)}</text>`; }
    s += `<text x="60" y="${oy + 480}" fill="#9ab" font-size="13">${axis[0]}</text><text x="${W - 60}" y="${oy + 480}" fill="#9ab" font-size="13" text-anchor="end">${axis[1]}</text>`; };
  one(70, 'W -- E (the cross axis): the root wing and the mid-boss below it, the well, the sunken court with its shrine', [
    ['4 ROOT GALLERY', -60, -24, 0, 14, 'puzzle'], ['5 ROOT HEART (mid-boss)', -60, -28, -15, -3, 'combat'], ['6 NURSERY', -26, -12, -12, -3, 'teach'],
    ['9 FALL GALLERY', -12, -3, 11, 16, 'puzzle'], ['12 BOSS: the undercroft', -22, 22, -24, -13, 'boss'], ['7 THE SUNKEN COURT (cut down, open to the sky)', 24, 70, 0, 33, 'trav'],
    ['10 SHRINE', 38, 54, 0, 22, 'puzzle'], ['ROCK BRIDGE', 24, 38, 23, 25, 'rest'], ['8 THORN TERRACE', 58, 70, 10, 15, 'teach'] ], ['WEST (-x)', 'EAST (+x)']);
  one(590, 'S -- N (the processional axis): the entry hall above, the well, the acrobatic room at the bottom of the climb', [
    ['1 ENTRY HALL', 30, 60, 24, 33, 'rest'], ['3 ACROBATIC ROOM (3 storeys)', -58, -14, 0, 26, 'trav'], ['ante (the last fight)', -66, -58, 0, 7, 'combat'],
    ['corridor', -14, -10, 0, 6, 'trav'], ['12 BOSS', -22, 22, -24, -13, 'boss'] ], ['NORTH (-z)  <- the acrobatic room', 'SOUTH (+z): the hall, the door out ->']);
  return s + '</svg>'; }
// --- 3. THE PLAN (a mandala: the well at the centre, four wings on the cardinal axes; the undercroft drawn dashed)
function plan() { const W = 1300, H = 1300, sx = x => 650 + x * 6.4, sz = z => 650 + (z - 30) * 6.4; let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif"><rect width="100%" height="100%" fill="#0e1716"/>`;
  s += `<text x="24" y="38" fill="#fff" font-size="26" font-weight="700">THE FOREST TEMPLE -- PLAN (the mandala)</text><text x="24" y="62" fill="#9fb" font-size="15">the well at the centre; the processional axis S-N, the cross axis W-E; concentric rings round the hub</text>`;
  for (const r of [14, 30, 52]) s += `<circle cx="${sx(0)}" cy="${sz(36)}" r="${r * 6.4}" fill="none" stroke="#244340" stroke-dasharray="3 7"/>`;
  s += `<line x1="${sx(0)}" y1="${sz(-30)}" x2="${sx(0)}" y2="${sz(85)}" stroke="#3d6b66" stroke-width="2"/><line x1="${sx(-75)}" y1="${sz(36)}" x2="${sx(80)}" y2="${sz(36)}" stroke="#3d6b66" stroke-width="2"/>`;
  const box = (lab, x0, x1, z0, z1, k, dash, pos) => { s += `<rect x="${sx(x0)}" y="${sz(z0)}" width="${sx(x1) - sx(x0)}" height="${sz(z1) - sz(z0)}" rx="5" fill="${K[k]}1c" stroke="${K[k]}" stroke-width="2.5" ${dash ? 'stroke-dasharray="8 6"' : ''}/>`;
    const ty = pos === 'top' ? sz(z0) + 20 : pos === 'bot' ? sz(z1) - 10 : pos === 'above' ? sz(z0) - 8 : pos === 'below' ? sz(z1) + 18 : (sz(z0) + sz(z1)) / 2 + 5;
    s += `<text x="${(sx(x0) + sx(x1)) / 2}" y="${ty}" fill="${K[k]}" font-size="14" text-anchor="middle" font-weight="700">${esc(lab)}</text>`; };
  box('1 ENTRY HALL (L3)', -8.75, 8.75, 46.5, 81.5, 'rest', 0, 'bot'); box('3 ACROBATIC ROOM (L1-2)', -16, 16, -21, 21, 'trav'); box('ante', -3.5, 3.5, -28.5, -22.5, 'combat');
  box('4 ROOT GALLERY (L1-2)', -62, -22, 22, 50, 'puzzle', 0, 'above'); box('5 ROOT HEART (L0, mid-boss)', -58, -30, 26, 46, 'combat', 1); box('6 NURSERY (L0)', -24, -13, 31, 41, 'teach', 1, 'below');
  box('7 SUNKEN COURT (L1, open sky)', 24, 72, 14, 58, 'trav', 0, 'bot'); box('10 SHRINE', 40, 52, 30, 42, 'puzzle', 0, 'below'); box('8 THORN TERRACE (L2)', 24, 72, 8, 14, 'teach'); box('11 GAUNTLET / BRIDGE (L3)', 24, 72, 58, 64, 'combat');
  s += `<rect x="${sx(47)}" y="${sz(16)}" width="${sx(49) - sx(47)}" height="${sz(56) - sz(16)}" fill="#3fa0ff55"/><text x="${sx(50.5)}" y="${sz(20)}" fill="#7cf" font-size="12">the channel</text>`;
  s += `<circle cx="${sx(0)}" cy="${sz(36)}" r="${10 * 6.4}" fill="${K.hub}22" stroke="${K.hub}" stroke-width="3"/><text x="${sx(3)}" y="${sz(40)}" fill="${K.hub}" font-size="15" text-anchor="middle" font-weight="700">2 THE WELL</text>`;
  s += `<circle cx="${sx(0)}" cy="${sz(36)}" r="${20 * 6.4}" fill="none" stroke="${K.boss}" stroke-width="2.5" stroke-dasharray="8 6"/><text x="${sx(0)}" y="${sz(36) + 20 * 6.4 + 18}" fill="${K.boss}" font-size="14" text-anchor="middle" font-weight="700">12 BOSS: the undercroft (L0, under the well)</text>`;
  box('9 FALL GALLERY (L2)', -12, -4, 32, 40, 'puzzle', 0, 'above'); s += `<text x="${sx(0)}" y="${sz(-27)}" fill="#cde" font-size="13" text-anchor="middle">N</text><text x="${sx(0)}" y="${sz(84)}" fill="#cde" font-size="13" text-anchor="middle">S: the door out (the dome above)</text>`;
  return s + '</svg>'; }
// --- 4. PACING
function pacing() { const W = 1500, H = 220, tot = PACE.reduce((a, p) => a + p[2], 0); let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="system-ui,sans-serif"><rect width="100%" height="100%" fill="#0e1716"/>`;
  s += `<text x="24" y="36" fill="#fff" font-size="22" font-weight="700">PACING (first play, ~${tot} min): rest / traversal / combat / puzzle / teach-test-twist / boss</text>`; let x = 30;
  for (const [k, lab, m] of PACE) { const w = (W - 60) * m / tot; s += `<rect x="${x}" y="70" width="${w - 3}" height="60" rx="6" fill="${K[k]}"/><text x="${x + w / 2}" y="105" fill="#0e1716" font-size="12" text-anchor="middle" font-weight="700">${esc(lab)}</text><text x="${x + w / 2}" y="150" fill="#9ab" font-size="11" text-anchor="middle">${m}m</text>`; x += w; }
  [['rest', 'rest'], ['trav', 'traversal'], ['combat', 'combat'], ['puzzle', 'puzzle'], ['teach', 'teach / test'], ['boss', 'boss']].forEach(([k, t], i) => { s += `<rect x="${30 + i * 200}" y="180" width="18" height="18" fill="${K[k]}"/><text x="${54 + i * 200}" y="194" fill="#dfe" font-size="14">${t}</text>`; });
  return s + '</svg>'; }
const br = await pw.chromium.launch(), pg = await br.newPage();
for (const [n, svg] of [['graph', graph()], ['section', section()], ['plan', plan()], ['pacing', pacing()]]) { const m = /width="(\d+)" height="(\d+)"/.exec(svg); await pg.setViewportSize({ width: +m[1], height: +m[2] });
  await pg.setContent(`<html><body style="margin:0">${svg}</body></html>`); await pg.screenshot({ path: path.join(OUT, 'ftemple_' + n + '.png') }); console.log('wrote', path.join(OUT, 'ftemple_' + n + '.png')); }
await br.close();
