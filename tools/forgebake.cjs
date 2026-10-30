// BAKE THE FORGE'S PROFILES INTO THE GAME (m933). Every profile in the library (or the stems named) -> models/characters/forged/
// <stem>.glb (his skeleton + the clips, named by role) and models/characters/forged/index.json, which the game reads at boot.
//   node tools/forgebake.cjs [stem ...] [--lib ../retarget-anims/library/clips]
// Profiles live in <lib>/../profiles/<stem>.json (the Forge's "Save profile to the library"). The character file is the profile's
// own `character`. Run `npm run bump` after, so his phone sees the new bytes.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const args = process.argv.slice(2), li = args.indexOf('--lib');
const LIB = path.resolve(li >= 0 ? args.splice(li, 2)[1] : path.join(__dirname, '..', '..', 'retarget-anims', 'library', 'clips'));
const PROF = path.join(LIB, '..', 'profiles'), OUT = path.join(__dirname, '..', 'models', 'characters', 'forged');
fs.mkdirSync(OUT, { recursive: true });
const stems = args.length ? args : (fs.existsSync(PROF) ? fs.readdirSync(PROF).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : []);
if (!stems.length) { console.error('forgebake: no profiles in ' + PROF); process.exit(1); }
let bad = 0;
for (const st of stems) {
  const pf = path.join(PROF, st + '.json'); if (!fs.existsSync(pf)) { console.error('forgebake: no ' + pf); bad++; continue; }
  const P = JSON.parse(fs.readFileSync(pf, 'utf8')), chr = P.character || 'models/characters/' + st + '.glb';
  try { execFileSync('node', [path.join(__dirname, 'forge.cjs'), chr, pf, path.join(OUT, st + '.glb'), '--lib', LIB], { stdio: 'inherit', cwd: path.join(__dirname, '..') }); }
  catch (e) { bad++; }
}
const have = fs.readdirSync(OUT).filter(f => f.endsWith('.glb')).map(f => f.slice(0, -4)).sort();
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ characters: have }, null, 1) + '\n');
console.log('forgebake: index lists ' + have.length + ' (' + have.join(', ') + ')');
process.exit(bad ? 1 : 0);
