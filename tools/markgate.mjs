// npm run check (markgate) -- ONE SHAPE = ONE MEANING (his rule, Nov 7 2026; MARKERS.md). A GLOWING octahedron (the "mint diamond": a lone,
// flat, low-poly gem) is no longer a way to mark anything. Interactive markers are GLOWKIT rows of the standard kinds -- `target` (shoot it),
// `anchor` (lash / zip / grapple to it), `shard` (collect it) -- and decor crystals are GLOWKIT clusters (`prism` / `geode` / `stal` / `grit`).
// This gate reads the SHIPPED index.html, finds every `OctahedronGeometry` on a line that also names a glow (JPAL / glow / jin / core / gem /
// crys / toneMapped: false), keys it by its top-level function, and fails if any function has MORE of them than the audited baseline in
// tools/markgate.json (the MARKERS.md audit, m2803). Lowering a count is always fine; `--write` re-baselines (only after a conversion).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), BASE = path.join(ROOT, 'tools/markgate.json');
const L = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').split('\n'), glowy = /JPAL|glow|\bjin\b|['"]core['"]|\bgem\b|crys|toneMapped:\s*false|lbGlowMat|M\.jin|mt\.jin/i;
const got = {}, where = {}; let fn = '(top)';
L.forEach((l, i) => { const m = /^(?:async )?function (\w+)/.exec(l); if (m) fn = m[1];
  const n = (l.match(/OctahedronGeometry\(/g) || []).length; if (!n || !glowy.test(l)) return; got[fn] = (got[fn] || 0) + n; (where[fn] = where[fn] || []).push(i + 1); });
if (process.argv.includes('--write')) { fs.writeFileSync(BASE, JSON.stringify(Object.fromEntries(Object.entries(got).sort()), null, 1) + '\n'); console.log('markgate: baseline written', Object.values(got).reduce((a, b) => a + b, 0), 'glowing octahedra in', Object.keys(got).length, 'functions'); process.exit(0); }
const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : {}, bad = [];
for (const k of Object.keys(got)) if (got[k] > (base[k] || 0)) bad.push(`  ${k}: ${got[k]} (baseline ${base[k] || 0}) at index.html:${where[k].join(', ')}`);
if (bad.length) { console.log('markgate FAIL -- a new glowing octahedron (the banned lone "mint diamond", MARKERS.md):\n' + bad.join('\n') +
  '\n  Use a GLOWKIT row instead: kind target / anchor / shard (interactive) or prism / geode / stal / grit (decor). If it is genuinely not a marker, say why in MARKERS.md and re-baseline with `node tools/markgate.mjs --write`.'); process.exit(1); }
console.log('markgate ok --', Object.values(got).reduce((a, b) => a + b, 0), 'legacy glowing octahedra, none new (MARKERS.md)');
