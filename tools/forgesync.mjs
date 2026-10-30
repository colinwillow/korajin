// forge/core.js carries the GAME's bindPose and retargetW verbatim. This says whether they still match index.html, and with
// --write lifts them again. Part of `npm run check`: a forge that carries clips differently from the game is a different game.
import fs from 'fs';
const G = fs.readFileSync('index.html', 'utf8'), C = 'forge/core.js';
// a function, or a `const NAME = ...;` (a table or one expression) -- the whole statement, brace-balanced
const fn = (s, name) => {
  let a = s.indexOf('\nfunction ' + name + '('), isConst = false;
  if (a < 0) { a = s.indexOf('\nconst ' + name + ' = '); isConst = a >= 0; } if (a < 0) return null;
  let i = a + 1, d = 0;
  if (!isConst) { i = s.indexOf('{', a); for (; i < s.length; i++) { if (s[i] === '{') d++; else if (s[i] === '}' && --d === 0) break; } }
  else for (; i < s.length; i++) { const c = s[i]; if (c === '{' || c === '(' || c === '[') d++; else if (c === '}' || c === ')' || c === ']') d--; else if (c === ';' && d === 0) break; }
  return s.slice(a + 1, i + 1); };
let core = fs.readFileSync(C, 'utf8'), bad = 0;
for (const name of ['bindPose', 'retargetW', 'ZAP_MOUNT', 'handFrame', 'mountPlace', 'SOCKET_BASIS', 'socketAuto']) {
  const g = fn(G, name), re = new RegExp('// SHIPPED:' + name + '\\n([\\s\\S]*?)// /SHIPPED:' + name);
  const m = core.match(re);
  if (!g || !m) { console.error('forgesync: cannot find ' + name + (g ? ' in ' + C : ' in index.html')); process.exit(1); }
  const st = m[1].search(new RegExp('(function|const) ' + name + '\\b')), have = m[1].slice(st).trim();
  if (have !== g.trim()) { if (process.argv.includes('--write')) { core = core.replace(re, '// SHIPPED:' + name + '\n' + g + '\n// /SHIPPED:' + name); console.log('forgesync: ' + name + ' re-lifted'); } else { console.error('forgesync: ' + name + ' in ' + C + ' differs from the game -- node tools/forgesync.mjs --write'); bad = 1; } }
}
if (process.argv.includes('--write')) fs.writeFileSync(C, core);
if (bad) process.exit(1);
console.log('forgesync ok -- forge carries clips with the game\'s own text');
