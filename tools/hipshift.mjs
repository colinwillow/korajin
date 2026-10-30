// THE FIX FOR `tools/hipfix.mjs` (m987, general m988): slide a skinned character so its Hips stand over the origin.
//   node tools/hipshift.mjs <in.glb> <out.glb> [--ref other.glb]
// Needs @gltf-transform/core, @gltf-transform/extensions, draco3dgltf (run a copy where they are installed).
// d = minus the Hips' world plan position; a Mixamo armature rotated and scaled 0.01 is handled like a plain one:
//   vertices      v' = v + e,  e = d in the skin's bind space                  -> the bind shape moves by d
//   inverse binds IBM' = IBM * T(-e)                                          -> every joint binds exactly as before
//   Hips          local t += P^-1 d, and every Hips translation key           -> the posed skeleton moves by d
// `--ref` takes d from ANOTHER file (a _ktx2 twin must move by its source's d, which is the same body).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
const a = process.argv.slice(2), ri = a.indexOf('--ref'), ref = ri >= 0 ? a.splice(ri, 2)[1] : null, [src, out] = a;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule() });
const inv3 = R => { const c = (i, j) => { const r = [0, 1, 2].filter(x => x !== i), q = [0, 1, 2].filter(x => x !== j); return ((i + j) % 2 ? -1 : 1) * (R[r[0]][q[0]] * R[r[1]][q[1]] - R[r[0]][q[1]] * R[r[1]][q[0]]); };
  const det = R[0][0] * c(0, 0) + R[0][1] * c(0, 1) + R[0][2] * c(0, 2); return [0, 1, 2].map(i => [0, 1, 2].map(j => c(j, i) / det)); };
const lin = m => [[m[0], m[4], m[8]], [m[1], m[5], m[9]], [m[2], m[6], m[10]]];
const mul = (R, v) => R.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const hipsOf = R => R.listNodes().find(n => /(^|:|_)Hips$/.test(n.getName()));
const hipsWorld = doc => { const m = hipsOf(doc.getRoot()).getWorldMatrix(); return [m[12], m[13], m[14]]; };     // the REST pose, through every parent
const doc = await io.read(src), R = doc.getRoot(), H = hipsOf(R);
const w = hipsWorld(ref ? await io.read(ref) : doc), d = [-w[0], 0, -w[2]];
console.log(src, '| Hips world', w.map(x => x.toFixed(4)).join(' '), '| moving', d[0].toFixed(4), d[2].toFixed(4));
// THE SKIN'S BIND SPACE is where the vertices and the inverse binds live: (Hips world) x (Hips IBM) maps it to the world, so d
// expressed in it is e = (Jw * IBM)^-1 d. (For a plain rig that product is identity and e = d; under a Mixamo armature turned
// 90 degrees and scaled 0.01 it is not -- m988's first pass used the mesh's world matrix here and blew three bodies up 40x.)
const sk0 = R.listSkins().find(s => s.listJoints().includes(H));
const Mh = sk0.getInverseBindMatrices().getElement(sk0.listJoints().indexOf(H), new Array(16)), Jw = H.getWorldMatrix();
const JI = [0, 1, 2].map(i => [0, 1, 2].map(j => Jw[i] * Mh[j * 4] + Jw[4 + i] * Mh[j * 4 + 1] + Jw[8 + i] * Mh[j * 4 + 2]));
const e = mul(inv3(JI), d);
const done = new Set(); let nv = 0;
for (const n of R.listNodes()) { const me = n.getMesh(); if (!me || !n.getSkin()) continue;
  for (const pr of me.listPrimitives()) { const A = pr.getAttribute('POSITION'); if (done.has(A)) continue; done.add(A);
    const v = [0, 0, 0]; for (let i = 0; i < A.getCount(); i++) { A.getElement(i, v); v[0] += e[0]; v[1] += e[1]; v[2] += e[2]; A.setElement(i, v); } nv += A.getCount(); } }
for (const s of R.listSkins()) { const A = s.getInverseBindMatrices(), m = new Array(16);     // IBM' = IBM * T(-e)
  for (let i = 0; i < A.getCount(); i++) { A.getElement(i, m); m[12] -= m[0] * e[0] + m[4] * e[1] + m[8] * e[2]; m[13] -= m[1] * e[0] + m[5] * e[1] + m[9] * e[2]; m[14] -= m[2] * e[0] + m[6] * e[1] + m[10] * e[2]; A.setElement(i, m); } }
const P = H.getParentNode(), el = P ? mul(inv3(lin(P.getWorldMatrix())), d) : d;
const t = H.getTranslation(); H.setTranslation([t[0] + el[0], t[1] + el[1], t[2] + el[2]]);
const seen = new Set(); let k = 0;
for (const an of R.listAnimations()) for (const c of an.listChannels()) { if (c.getTargetNode() !== H || c.getTargetPath() !== 'translation') continue;
  const o = c.getSampler().getOutput(); if (seen.has(o)) continue; seen.add(o); const v = [0, 0, 0];
  for (let i = 0; i < o.getCount(); i++) { o.getElement(i, v); v[0] += el[0]; v[1] += el[1]; v[2] += el[2]; o.setElement(i, v); k++; } }
console.log('  verts', nv, '| Hips local +', el.map(x => x.toFixed(3)).join(' '), '| keys', k, 'in', seen.size, 'tracks');
const dr = R.listExtensionsUsed().find(x => x.extensionName === 'KHR_draco_mesh_compression');
if (dr) dr.setRequired(true).setEncoderOptions({ method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5 });
await io.write(out, doc);
