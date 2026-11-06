// THE HOLLOW SHADE rig: both Tripo meshes on ONE Mixamo skeleton whose frames are the old guardian's, so his forged clips drive it unchanged.
import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { DRACOLoader } from '/vendor/DRACOLoader.js';
import { GLTFExporter } from '/vendor/GLTFExporter.js';
import { mergeVertices } from '/vendor/BufferGeometryUtils.js';
import { MeshoptSimplifier as MS } from '/sg/nm/node_modules/meshoptimizer/meshopt_simplifier.js';
const A = window.ARG || {}, info = {};
const V = (x, y, z) => new THREE.Vector3(x, y, z);
// measured joints (cross-sections of the spirit body, which sits inside the armour); +X is HIS LEFT
const JL = { Hips: V(0, .43, -.01), Spine: V(0, .49, -.01), Spine1: V(0, .56, -.01), Spine2: V(0, .63, -.01), Neck: V(0, .78, -.02), Head: V(0, .85, -.01),
  LeftShoulder: V(.06, .71, -.02), LeftArm: V(.20, .69, -.03), LeftForeArm: V(.30, .565, -.04), LeftHand: V(.37, .425, -.02),
  LeftUpLeg: V(.10, .41, -.01), LeftLeg: V(.135, .22, 0), LeftFoot: V(.155, .075, -.01), LeftToeBase: V(.16, .025, .09) };
const TIP = { Head: V(0, .99, -.01), LeftHand: V(.41, .32, -.01), LeftToeBase: V(.165, .015, .16) };
Object.assign(JL, A.J || {});
const J = {}; for (const k in JL) { J[k] = JL[k]; if (k.startsWith('Left')) J['Right' + k.slice(4)] = V(-JL[k].x, JL[k].y, JL[k].z); }
for (const k in TIP) if (k.startsWith('Left')) TIP['Right' + k.slice(4)] = V(-TIP[k].x, TIP[k].y, TIP[k].z);
const PRIM = { Hips: 'Spine', Spine: 'Spine1', Spine1: 'Spine2', Spine2: 'Neck', Neck: 'Head', LeftShoulder: 'LeftArm', LeftArm: 'LeftForeArm', LeftForeArm: 'LeftHand', LeftUpLeg: 'LeftLeg', LeftLeg: 'LeftFoot', LeftFoot: 'LeftToeBase' };
for (const k in PRIM) if (k.startsWith('Left')) PRIM['Right' + k.slice(4)] = 'Right' + PRIM[k].slice(4);
// the donor: the old guardian's skeleton (its rest frames are what his forged clips are relative to)
const dl = new DRACOLoader(); dl.setDecoderPath('/vendor/draco/'); const gl = new GLTFLoader(); gl.setDRACOLoader(dl);
const gd = await gl.loadAsync('/models/creatures/stone_guardian.glb'), gc = await gl.loadAsync('/models/characters/forged/stone_guardian.glb');
gd.scene.updateMatrixWorld(true); const GB = {}; let rig = null; gd.scene.traverse(o => { if (o.isBone) { GB[o.name.replace('mixamorig_', '')] = o; if (!o.parent.isBone) rig = o.parent; } });
const Qrig = rig.getWorldQuaternion(new THREE.Quaternion()), Srig = rig.getWorldScale(new THREE.Vector3()), Trig = rig.getWorldPosition(new THREE.Vector3());
info.rig = { name: rig.name, q: Qrig.toArray(), s: Srig.toArray(), t: Trig.toArray() };
const names = Object.keys(J), N = {}, swing = {};
const order = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'];
const PARENT = {}; for (const k of order) PARENT[k] = GB[k].parent.isBone ? GB[k].parent.name.replace('mixamorig_', '') : null;
for (const k of order) { const g = GB[k], Gq = g.getWorldQuaternion(new THREE.Quaternion()); let s = new THREE.Quaternion();
  if (PRIM[k] && k !== 'Hips') { const dg = GB[PRIM[k]].getWorldPosition(new THREE.Vector3()).sub(g.getWorldPosition(new THREE.Vector3())).normalize(), dn = J[PRIM[k]].clone().sub(J[k]).normalize(); s.setFromUnitVectors(dg, dn); }
  else if (PARENT[k] && k !== 'Head') s.copy(swing[PARENT[k]]);
  swing[k] = s; N[k] = s.clone().multiply(Gq); }
const root = new THREE.Group(); root.name = 'shade_rig'; root.quaternion.copy(Qrig); const bones = {}, list = [];
for (const k of order) { const b = new THREE.Bone(); b.name = 'mixamorig_' + k; const pq = PARENT[k] ? N[PARENT[k]] : Qrig, pp = PARENT[k] ? J[PARENT[k]] : V(0, 0, 0), inv = pq.clone().invert();
  b.quaternion.copy(inv.clone().multiply(N[k])); b.position.copy(J[k].clone().sub(pp).applyQuaternion(inv)); (PARENT[k] ? bones[PARENT[k]] : root).add(b); bones[k] = b; list.push(b); }
const scene = new THREE.Scene(); scene.add(root); scene.updateMatrixWorld(true);
info.check = order.map(k => k + ' ' + bones[k].getWorldPosition(new THREE.Vector3()).distanceTo(J[k]).toFixed(5)).filter(s => +s.split(' ')[1] > 1e-4);
// bone segments for the weights
const SEG = order.map(k => [J[k], PRIM[k] ? J[PRIM[k]] : TIP[k] || J[k].clone().add(V(0, .02, 0))]);
SEG[0] = [V(0, .40, -.01), V(0, .49, -.01)];
const _c = new THREE.Vector3(), _l = new THREE.Line3();
function segD(p, i) { _l.set(SEG[i][0], SEG[i][1]); _l.closestPointToPoint(p, true, _c); return _c.distanceTo(p); }
function nearest(p, stone) { if (stone && Math.abs(p.x) < .07 && p.y > .22 && p.y < .46) return 0;     // the loincloth flaps front and back ride the hips
  let bi = 0, bd = 1e9; for (let i = 0; i < SEG.length; i++) { const d = segD(p, i); if (d < bd) { bd = d; bi = i; } }
  if (/Shoulder/.test(order[bi]) && Math.abs(p.x) < .15) bi = order.indexOf('Spine2');     // the collar and the chest plate stay on the chest
  return bi; }
// the meshes
const fbx = new FBXLoader();
async function raw(f) { const g = await fbx.loadAsync(f); g.updateMatrixWorld(true); let G; g.traverse(o => { if (o.isMesh) { G = o.geometry.clone(); G.applyMatrix4(o.matrixWorld); } }); for (const k of Object.keys(G.attributes)) if (!['position', 'normal', 'uv'].includes(k)) G.deleteAttribute(k);
  const U = G.attributes.uv; for (let i = 0; i < U.count; i++) U.setY(i, 1 - U.getY(i));     // FBX v runs up; glTF's runs down (the loader does not flip the image)
  return G; }
const sG = await raw('/sg/stone_guardian/tripo_convert_1cb2d7f7-0b32-4d9e-af9b-38bf0ebf7831.fbx'), pG = await raw('/sg/stone_guardian_spirit/tripo_convert_a6ecb089-0a08-443a-953d-f62a85939441.fbx');
// STONE: hard surface -- every triangle to ONE bone (by its centroid), welded only within a bone, so a piece lifts out clean and nothing stretches
{ const P = sG.attributes.position, n = P.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), a = V(), b = V(), c = V();
  for (let t = 0; t < n; t += 3) { a.fromBufferAttribute(P, t); b.fromBufferAttribute(P, t + 1); c.fromBufferAttribute(P, t + 2); const bi = nearest(a.add(b).add(c).multiplyScalar(1 / 3), 1);
    for (let k = 0; k < 3; k++) { si[(t + k) * 4] = bi; sw[(t + k) * 4] = 1; } }
  sG.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); sG.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); }
const stoneG = mergeVertices(sG, 1e-5); info.stone = { tris: stoneG.index.count / 3, verts: stoneG.attributes.position.count };
// SPIRIT: welded, simplified to ~target tris, smooth normals, weights blended between a bone and its neighbour
await MS.ready;
let spiritG; { const g0 = pG.clone(); g0.deleteAttribute('normal'); const g = mergeVertices(g0, 1e-5), P = g.attributes.position.array, UV = g.attributes.uv.array, idx = new Uint32Array(g.index.array);
  const tgt = (A.spiritTris || 5000) * 3; const [ni, err] = MS.simplifyWithAttributes(idx, P, 3, UV, 2, [.5, .5], null, tgt, .05, []);
  info.spiritSimplify = { from: idx.length / 3, to: ni.length / 3, err };
  const [remap, nu] = MS.compactMesh(ni); const np = new Float32Array(nu * 3), nuv = new Float32Array(nu * 2); for (let i = 0; i < remap.length; i++) if (remap[i] !== 0xffffffff) { const j = remap[i]; np.set(P.subarray(i * 3, i * 3 + 3), j * 3); nuv.set(UV.subarray(i * 2, i * 2 + 2), j * 2); }
  spiritG = new THREE.BufferGeometry(); spiritG.setAttribute('position', new THREE.BufferAttribute(np, 3)); spiritG.setAttribute('uv', new THREE.BufferAttribute(nuv, 2)); spiritG.setIndex(new THREE.BufferAttribute(ni, 1)); spiritG.computeVertexNormals();
  const n = nu, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), p = V(); const adj = (i, j) => PARENT[order[i]] === order[j] || PARENT[order[j]] === order[i];
  for (let v = 0; v < n; v++) { p.fromArray(np, v * 3); const d = SEG.map((_, i) => segD(p, i)); const ix = d.map((x, i) => i).sort((x, y) => d[x] - d[y]); const i1 = ix[0], i2 = ix.find(i => i !== i1 && adj(i, i1));
    let w1 = 1, w2 = 0; if (i2 != null && d[i2] < d[i1] * 2.2) { const a1 = 1 / Math.pow(d[i1] + 1e-3, 4), a2 = 1 / Math.pow(d[i2] + 1e-3, 4) * Math.max(0, 1 - (d[i2] / (d[i1] + 1e-4) - 1) / 1.2); w1 = a1 / (a1 + a2); w2 = 1 - w1; }
    si[v * 4] = i1; sw[v * 4] = w1; if (w2 > 1e-3) { si[v * 4 + 1] = i2; sw[v * 4 + 1] = w2; } else sw[v * 4] = 1; }
  spiritG.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); spiritG.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  info.spirit = { tris: spiritG.index.count / 3, verts: n }; }
const skel = new THREE.Skeleton(list);
const sm = new THREE.SkinnedMesh(stoneG, new THREE.MeshStandardMaterial({ name: 'shade_stone', color: 0xffffff, roughness: .85 })); sm.name = 'shade_stone';
const pm = new THREE.SkinnedMesh(spiritG, new THREE.MeshStandardMaterial({ name: 'shade_spirit', color: 0xffffff, emissive: 0xffffff, roughness: .6 })); pm.name = 'shade_spirit';
root.add(sm, pm); sm.bind(skel, new THREE.Matrix4()); pm.bind(skel, new THREE.Matrix4());
// the clips: his forged guardian set, tracks kept for the bones this rig has, the hips' travel scaled to this body
const hipsY = GB.Hips.getWorldPosition(new THREE.Vector3()).y, k = J.Hips.y / hipsY * Srig.y; info.hipsK = k; info.hipsYguard = hipsY;
const have = new Set(list.map(b => b.name)), clips = [];
for (const a of gc.animations) { const tr = []; for (const t of a.tracks) { const nm = t.name.split('.')[0]; if (!have.has(nm)) continue; const c = t.clone(); if (/Hips\.position$/.test(t.name)) for (let i = 0; i < c.values.length; i++) c.values[i] *= k; tr.push(c); }
  clips.push(new THREE.AnimationClip(a.name, a.duration, tr)); }
info.clips = clips.map(c => c.name + ':' + c.tracks.length);
window.SHADE = { scene, root, sm, pm, bones, clips, J, order };
if (A.export) { const ex = new GLTFExporter(); const buf = await ex.parseAsync(scene, { binary: true, animations: clips, onlyVisible: false });
  const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); await saveFile('shade_raw.glb', btoa(s)); info.bytes = b.length; }
// a look: weights as colours, bones drawn, A-pose and a frame of a clip
if (A.look) { const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(1200, 800); document.body.appendChild(R.domElement);
  const S = scene; S.background = new THREE.Color(0x777777); S.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2.5)); const L = new THREE.DirectionalLight(0xffffff, 2); L.position.set(1, 2, 3); S.add(L);
  const pal = list.map((_, i) => new THREE.Color().setHSL((i * 0.618) % 1, .75, .55));
  for (const M of [sm, pm]) { const g = M.geometry, n = g.attributes.position.count, col = new Float32Array(n * 3), SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
    for (let v = 0; v < n; v++) { const c = new THREE.Color(0, 0, 0); for (let q = 0; q < 4; q++) { const w = SW.getComponent(v, q); if (w) c.add(pal[SI.getComponent(v, q)].clone().multiplyScalar(w)); } col.set([c.r, c.g, c.b], v * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); M.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8 }); }
  const helper = new THREE.SkeletonHelper(root); helper.material.depthTest = false; S.add(helper);
  const C = new THREE.PerspectiveCamera(30, 1.5, .05, 50); const mixer = new THREE.AnimationMixer(root);
  const shots = A.look === 1 ? [['rest', null, 0]] : A.look;
  for (const [nm, clip, t] of shots) { mixer.stopAllAction(); if (clip) { const ac = mixer.clipAction(clips.find(c => c.name === clip)); ac.play(); mixer.setTime(t); } scene.updateMatrixWorld(true);
    pm.position.x = 0; sm.visible = true; pm.visible = true;
    // stone left, spirit right: two cameras into one picture by moving the spirit
    root.position.set(0, 0, 0); for (const [vn, p] of [['front', [0, .5, 3.6]], ['side', [3.6, .5, 0]]]) { C.position.set(...p); C.lookAt(0, .5, 0);
      sm.visible = true; pm.visible = false; R.setViewport(0, 0, 600, 800); R.setScissor(0, 0, 600, 800); R.setScissorTest(true); C.aspect = .75; C.updateProjectionMatrix(); R.render(S, C);
      sm.visible = false; pm.visible = true; R.setViewport(600, 0, 600, 800); R.setScissor(600, 0, 600, 800); R.render(S, C);
      await saveFile(`look_${nm}_${vn}.png`, R.domElement.toDataURL().split(',')[1]); } } }
window.DONE = info;
