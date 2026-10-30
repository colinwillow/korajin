// THE PIVOT GOES UNDER HIS HIPS (m987). A character with a backpack comes out of the pipeline with its origin at the back of
// the pack: orient/ARP centre the WHOLE shell, pack included, so the body stands forward of (0,0,0) and the game turns him
// about a point behind him ("he rotates like a boat"). The samurai: body z .005..332, Hips at z .183, origin at the pack.
//   node tools/hipfix.mjs <file.glb> [...]          report: where the Hips sit in plan, per file. (forged/*.glb carry CLIPS
//   for another body and their own copy of its skeleton: a flag on one is not a fact -- play the clip on the body, m988.)
// The FIX is `tools/hipshift.mjs <in.glb> <out.glb>`: vertices, inverse binds, the Hips node and every Hips key, together, so the
// bind pose (the x-ray, the transform, the Forge all read it) and the drawn body agree. Moving only the Hips node would move
// the drawn body and leave the bind matrices 0.18 m behind it. It needs gltf-transform + draco (run it where those are
// installed: `npm i @gltf-transform/core @gltf-transform/extensions draco3dgltf` in a scratch folder, then node that copy).
// Re-run after any Forge re-bake of a character with a pack.
import fs from 'fs';
const files = process.argv.slice(2);
const TOL = .03;     // metres (authored units) off centre that counts as fine
for (const f of files) {
  const b = fs.readFileSync(f); const jl = b.readUInt32LE(12); const J = JSON.parse(b.slice(20, 20 + jl).toString());
  const binOff = 20 + jl + 8;
  const hi = J.nodes.findIndex(n => /(^|:|_)Hips$/.test(n.name || ''));
  if (hi < 0) { console.log(f, 'no Hips'); continue; }
  const H = J.nodes[hi], t = H.translation || [0, 0, 0], dx = t[0], dz = t[2];
  // WHERE THE GAME DRAWS IT: down the node chain (a Mixamo rig sits under a turned armature at 0.01), with the Hips' local
  // position taken from its first clip's first key when it has clips -- the bind can disagree (m988: the purple female's
  // bind puts her Hips 48% off, and every clip of hers puts them back over the origin).
  const q2m = (q, sc) => { const [x, y, z, w] = q || [0, 0, 0, 1], S = sc || [1, 1, 1]; return [[(1 - 2 * (y * y + z * z)) * S[0], (2 * (x * y - z * w)) * S[1], (2 * (x * z + y * w)) * S[2]], [(2 * (x * y + z * w)) * S[0], (1 - 2 * (x * x + z * z)) * S[1], (2 * (y * z - x * w)) * S[2]], [(2 * (x * z - y * w)) * S[0], (2 * (y * z + x * w)) * S[1], (1 - 2 * (x * x + y * y)) * S[2]]]; };
  const chain = []; for (let n = hi; n >= 0; n = J.nodes.findIndex(x => (x.children || []).includes(n))) chain.unshift(n);
  let key0 = null;
  for (const a of J.animations || []) { const c = a.channels.find(c => c.target.node === hi && c.target.path === 'translation'); if (!c) continue;
    const A = J.accessors[a.samplers[c.sampler].output], V = J.bufferViews[A.bufferView], o = binOff + (V.byteOffset || 0) + (A.byteOffset || 0); key0 = [0, 1, 2].map(k => b.readFloatLE(o + k * 4)); break; }
  let w = [0, 0, 0], Rm = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (const n of chain) { const N = J.nodes[n], t = n === hi && key0 ? key0 : (N.translation || [0, 0, 0]);
    w = [0, 1, 2].map(i => w[i] + Rm[i][0] * t[0] + Rm[i][1] * t[1] + Rm[i][2] * t[2]); const L = q2m(N.rotation, N.scale); Rm = Rm.map(r => [0, 1, 2].map(j => r[0] * L[0][j] + r[1] * L[1][j] + r[2] * L[2][j])); }
  const hgt = w[1];
  const off = hgt > 0 ? Math.hypot(w[0], w[2]) / Math.max(.01, hgt) : 0;     // as a fraction of the hip height, so any authored size reads alike
  console.log(f.padEnd(52), w ? (key0 ? 'Hips (clip) ' : 'Hips (rest) ') + w.map(v => v.toFixed(3)).join(' ') + '  off ' + (off * 100).toFixed(0) + '% of hip height' : 'no bind', off > TOL * 4 ? '<- OFF CENTRE' : 'ok');
}
