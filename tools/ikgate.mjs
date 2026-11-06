// npm run check (m2691) -- THE POSE CALLS ARE LIVE. m2647 dropped a `// comment` mid-line in the frame, and every call after it on that line --
// the katana smear, the lotus, the sleep pose, `ikitPose` (every kit hand IK) and `getPose` (the GET) -- was dead for fifteen builds with nothing
// to say so. This reads the SHIPPED index.html, strips each line's comments the way the parser does (strings respected), and fails if a call
// the frame depends on is no longer live code anywhere. A headless film of every station is `npm run ikhands` (slow; run on a kit change).
import fs from 'fs';
const src = fs.readFileSync('index.html', 'utf8').split('\n');
const MUST = ['ikitPose(dt)', 'getPose(dt)', 'ikitStep(dt)', 'katDrawIK(dt)', 'gdnLotus(dt)', 'interactStep(dt)'];
function code(line, st) {     // the live code of one line; `st.c` carries an open /* */ across lines
  let out = '', q = null;
  for (let i = 0; i < line.length; i++) { const c = line[i], d = line[i + 1];
    if (st.c) { if (c === '*' && d === '/') { st.c = 0; i++; } continue; }
    if (q) { out += c; if (c === '\\') { out += d || ''; i++; } else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; continue; }
    if (c === '/' && d === '*') { st.c = 1; i++; continue; }
    if (c === '/' && d === '/') break;
    out += c; }
  return out; }
const st = { c: 0 }, live = src.map(l => code(l, st)).join('\n');
const bad = MUST.filter(m => !live.includes(m) || !new RegExp('(^|[^\\w.])' + m.replace(/[()]/g, '\\$&')).test(live.replace(/function\s+\w+\(dt\)/g, '')));
// m2731 (his: "pots make a METAL clang and don't shatter"): every pot source must smash in CLAY (`pot_smash`, never the metal `clink`) and
// throw shards. A node gate cannot swing a sword in the temple, so this asserts the shipped wiring: the SFX row, the temple's `ftinPot`
// (the smash + `propShatter`), and every `propKind` pot ('pot', 'ikpot') carrying `snd: 'pot_smash'`.
{ const all = live; const fp = all.slice(all.indexOf('function ftinPot('), all.indexOf('function ftinMelee('));
  if (!/pot_smash:\s*\[/.test(all)) bad.push("SFX.pot_smash");
  if (!fp.includes("'pot_smash'") || fp.includes("'clink'") || !fp.includes('propShatter(')) bad.push('ftinPot: clay smash + shards');
  for (const k of ['pot', 'ikpot']) { const i = all.indexOf("propKind('" + k + "'"), seg = i < 0 ? '' : all.slice(i, all.indexOf('\n', i)); if (!seg.includes("snd: 'pot_smash'")) bad.push("propKind('" + k + "') snd: 'pot_smash'"); } }
if (bad.length) { console.error('IKGATE FAIL -- not live code any more (commented out?):', bad.join(', ')); process.exit(1); }
console.log('ikgate ok -- ' + MUST.length + ' per-frame pose calls are live code; every pot smashes in clay');
