// npm run check (m2690) -- THE POSE CALLS ARE LIVE. m2647 dropped a `// comment` mid-line in the frame, and every call after it on that line --
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
if (bad.length) { console.error('IKGATE FAIL -- not live code any more (commented out?):', bad.join(', ')); process.exit(1); }
console.log('ikgate ok -- ' + MUST.length + ' per-frame pose calls are live code');
