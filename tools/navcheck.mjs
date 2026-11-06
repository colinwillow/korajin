// npm run check runs this (m-stale 2): every write to the page's URL must go through `navGo` / `bUrl`, which stamp `b=<BUILD>`. A bare
// location.replace / reload / assign / href= / search= or a history.replaceState / pushState without bUrl() means a reload can land on an
// older build's cache (his iPhone: "it opens the newest build, then it reverts to M2761"). Exits 1 and prints each line.
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8').split('\n'), bad = [];
const pats = [/location\.(replace|assign|reload)\s*\(/, /location\.(href|search|hash)\s*=[^=]/, /\blocation\s*=[^=]/, /history\.(replaceState|pushState)\s*\(/];
src.forEach((l, i) => { const code = l.replace(/\/\/.*$/, ''); for (const re of pats) { const m = re.exec(code); if (!m) continue;
  if (/^function (navGo|bUrl)\b/.test(l.trim())) continue;                                           // the two helpers themselves
  if (/staleCheck|U\.searchParams\.set\('b', j\.build\)/.test(l)) continue;                          // the boot's one update (stamps the NEW build)
  if (/history\.(replaceState|pushState)\([^)]*bUrl\(/.test(code)) continue;
  bad.push((i + 1) + ': ' + l.trim().slice(0, 160)); } });
if (bad.length) { console.error('NAVCHECK FAIL -- a URL write that bypasses navGo / bUrl (it can reload into an OLD build):\n  ' + bad.join('\n  ')); process.exit(1); }
console.log('navcheck ok -- every location / history write stamps b=<BUILD>');
