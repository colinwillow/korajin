// THE HUSK SOLDIER rig: his Tripo body on the SAMURAI's skeleton frames (fingers and weapon bones too), so all of the samurai's clips drive it
// unchanged; his spear split off (its own mesh island) into a weapon file in the katana's convention.
import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { DRACOLoader } from '/vendor/DRACOLoader.js';
import { GLTFExporter } from '/vendor/GLTFExporter.js';
import { mergeVertices } from '/vendor/BufferGeometryUtils.js';
const A = window.ARG || {}, info = {}, V = (x, y, z) => new THREE.Vector3(x, y, z);
const CX = -0.05;     // the body's centre line in the file (the spear stands off to his left)
const JL = { Hips: V(0, .43, 0), Spine: V(0, .48, 0), Spine1: V(0, .54, 0), Spine2: V(0, .60, 0), Neck: V(0, .70, -.005), Head: V(0, .75, 0),
  LeftShoulder: V(.05, .645, -.01), LeftArm: V(.17, .635, -.02), LeftForeArm: V(.30, .630, -.02), LeftHand: V(.40, .625, -.015),
  LeftUpLeg: V(.071, .40, 0), LeftLeg: V(.075, .225, 0), LeftFoot: V(.08, .075, -.01), LeftToeBase: V(.09, .02, .06) };
const TIP = { Head: V(0, .87, 0), LeftHand: V(.45, .62, -.015), LeftToeBase: V(.09, .01, .10) };
const J = {}; for (const k in JL) { J[k] = JL[k]; if (k.startsWith('Left')) J['Right' + k.slice(4)] = V(-JL[k].x, JL[k].y, JL[k].z); }
for (const k in TIP) if (k.startsWith('Left')) TIP['Right' + k.slice(4)] = V(-TIP[k].x, TIP[k].y, TIP[k].z);
const PRIM = { Hips: 'Spine', Spine: 'Spine1', Spine1: 'Spine2', Spine2: 'Neck', Neck: 'Head', LeftShoulder: 'LeftArm', LeftArm: 'LeftForeArm', LeftForeArm: 'LeftHand', LeftUpLeg: 'LeftLeg', LeftLeg: 'LeftFoot', LeftFoot: 'LeftToeBase',
  LeftHandThumb1: 'LeftHandThumb2', LeftHandThumb2: 'LeftHandThumb3', LeftHandIndex1: 'LeftHandIndex2', LeftHandIndex2: 'LeftHandIndex3' };
for (const k in PRIM) if (k.startsWith('Left')) PRIM['Right' + k.slice(4)] = 'Right' + PRIM[k].slice(4);
const dl = new DRACOLoader(); dl.setDecoderPath('/vendor/draco/'); const gl = new GLTFLoader(); gl.setDRACOLoader(dl);
const gd = await gl.loadAsync('/models/characters/samurai_game.glb'); gd.scene.updateMatrixWorld(true);
const GB = {}; let rig = null, donorH = 0; gd.scene.traverse(o => { if (o.isBone) { GB[o.name.replace('mixamorig_', '')] = o; if (!o.parent.isBone) rig = o.parent; } if (o.isSkinnedMesh) { o.geometry.computeBoundingBox(); donorH = o.geometry.boundingBox.max.y; } });
const Qrig = rig.getWorldQuaternion(new THREE.Quaternion()), Srig = rig.getWorldScale(new THREE.Vector3()); info.rig = { name: rig.name, q: Qrig.toArray(), s: Srig.toArray(), donorH };
// the bone order: the donor's own traversal (parents first)
const order = []; GB.Hips.traverse(o => { if (o.isBone) order.push(o.name.replace('mixamorig_', '')); });
const PARENT = {}; for (const k of order) PARENT[k] = GB[k].parent.isBone ? GB[k].parent.name.replace('mixamorig_', '') : null;
const kH = .871 / donorH, gw = k => GB[k].getWorldPosition(new THREE.Vector3()), N = {}, swing = {};
for (const k of order) { const g = GB[k], Gq = g.getWorldQuaternion(new THREE.Quaternion());
  if (!J[k]) J[k] = J[PARENT[k]].clone().add(gw(k).sub(gw(PARENT[k])).multiplyScalar(kH).applyQuaternion(swing[PARENT[k]]));     // unmeasured (fingers, weapon bones): the donor's offset, scaled, turned with its parent
  let s = new THREE.Quaternion();
  if (PRIM[k] && k !== 'Hips' && J[PRIM[k]]) { const dg = gw(PRIM[k]).sub(gw(k)).normalize(), dn = J[PRIM[k]].clone().sub(J[k]).normalize(); s.setFromUnitVectors(dg, dn); }
  else if (PARENT[k] && k !== 'Head') s.copy(swing[PARENT[k]]);
  swing[k] = s; N[k] = s.clone().multiply(Gq); }
info.order = order.join(',');
const root = new THREE.Group(); root.name = 'root'; root.quaternion.copy(Qrig); const bones = {}, list = [];
for (const k of order) { const b = new THREE.Bone(); b.name = GB[k].name; const pq = PARENT[k] ? N[PARENT[k]] : Qrig, pp = PARENT[k] ? J[PARENT[k]] : V(0, 0, 0), inv = pq.clone().invert();
  b.quaternion.copy(inv.clone().multiply(N[k])); b.position.copy(J[k].clone().sub(pp).applyQuaternion(inv)); (PARENT[k] ? bones[PARENT[k]] : root).add(b); bones[k] = b; list.push(b); }
const scene = new THREE.Scene(); scene.add(root); scene.updateMatrixWorld(true);
// weight segments: the skinning bones (not the weapon markers)
const SK = order.map((k, i) => i).filter(i => !/^weapon|^gun/.test(order[i]));
const SEG = order.map(k => [J[k], PRIM[k] && J[PRIM[k]] ? J[PRIM[k]] : TIP[k] || J[k].clone().add(J[k].clone().sub(J[PARENT[k]] || V(0, 0, 0)).setLength(.02))]);
SEG[order.indexOf('Hips')] = [V(0, .40, 0), V(0, .48, 0)];
const _c = V(), _l = new THREE.Line3(); const segD = (p, i) => { _l.set(SEG[i][0], SEG[i][1]); _l.closestPointToPoint(p, true, _c); return _c.distanceTo(p); };
const adj = (i, j) => PARENT[order[i]] === order[j] || PARENT[order[j]] === order[i];
// the mesh: split the spear off by islands, centre the body
const g0 = await new FBXLoader().loadAsync('/sg/husk/tripo_convert_f6d5931d-686d-4718-bc0d-88c0b94d0f91.fbx'); g0.updateMatrixWorld(true); let RG;
g0.traverse(o => { if (o.isMesh) { RG = o.geometry.clone(); RG.applyMatrix4(o.matrixWorld); } }); for (const k of Object.keys(RG.attributes)) if (!['position', 'normal', 'uv'].includes(k)) RG.deleteAttribute(k);
{ const U = RG.attributes.uv; for (let i = 0; i < U.count; i++) U.setY(i, 1 - U.getY(i)); }
const P = RG.attributes.position, nt = P.count / 3, key = i => Math.round(P.getX(i) * 1e4) + ',' + Math.round(P.getY(i) * 1e4) + ',' + Math.round(P.getZ(i) * 1e4);
const par = new Int32Array(P.count).map((_, i) => i), find = i => { while (par[i] !== i) i = par[i] = par[par[i]]; return i; }, uni = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
{ const first = new Map(); for (let i = 0; i < P.count; i++) { const k = key(i); if (first.has(k)) uni(i, first.get(k)); else first.set(k, i); if (i % 3) uni(i, i - 1); } }
const isl = new Map(); for (let t = 0; t < nt; t++) { const r = find(t * 3); let I = isl.get(r); if (!I) isl.set(r, I = { tris: [], x0: 9, x1: -9 }); I.tris.push(t); for (let k = 0; k < 3; k++) { const x = P.getX(t * 3 + k); I.x0 = Math.min(I.x0, x); I.x1 = Math.max(I.x1, x); } }
const spearT = [], bodyT = []; for (const I of isl.values()) (I.x1 > .41 ? spearT : bodyT).push(...I.tris);
info.islands = isl.size; info.spearIslands = [...isl.values()].filter(I => I.x1 > .41).length; info.spearTris = spearT.length; info.bodyTris = bodyT.length;
const pick = (T, dx) => { const g = new THREE.BufferGeometry(); for (const nm of ['position', 'normal', 'uv']) { const s = RG.attributes[nm], a = new Float32Array(T.length * 3 * s.itemSize); let o = 0; for (const t of T) for (let k = 0; k < 3; k++) for (let c = 0; c < s.itemSize; c++) a[o++] = s.array[(t * 3 + k) * s.itemSize + c]; g.setAttribute(nm, new THREE.BufferAttribute(a, s.itemSize)); } if (dx) g.translate(dx, 0, 0); return g; };
const bodyG = pick(bodyT, -CX), spearG = pick(spearT, 0);
// body weights: blended between a bone and its neighbour; the skirt rides half hips, half thigh
{ const Pb = bodyG.attributes.position, n = Pb.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), p = V(), iH = order.indexOf('Hips');
  for (let v = 0; v < n; v++) { p.fromBufferAttribute(Pb, v); const d = SK.map(i => [i, segD(p, i)]).sort((a, b) => a[1] - b[1]); const [i1, d1] = d[0], e2 = d.find(([i]) => i !== i1 && adj(i, i1));
    let w1 = 1, i2 = -1, w2 = 0; if (e2 && e2[1] < d1 * 2.2) { const a1 = 1 / Math.pow(d1 + 1e-3, 4), a2 = 1 / Math.pow(e2[1] + 1e-3, 4) * Math.max(0, 1 - (e2[1] / (d1 + 1e-4) - 1) / 1.2); w1 = a1 / (a1 + a2); i2 = e2[0]; w2 = 1 - w1; }
    if (p.y > .27 && p.y < .44 && /UpLeg/.test(order[i1]) && (Math.abs(p.z) > .055 || Math.abs(p.x) > .11)) { i2 = iH; w1 = .5; w2 = .5; }     // the tassets
    si[v * 4] = i1; sw[v * 4] = w1; if (w2 > 1e-3) { si[v * 4 + 1] = i2; sw[v * 4 + 1] = w2; } else sw[v * 4] = 1; }
  bodyG.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); bodyG.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4)); }
const bodyW = mergeVertices(bodyG, 1e-5); info.body = { tris: bodyW.index.count / 3, verts: bodyW.attributes.position.count };
const sm = new THREE.SkinnedMesh(bodyW, new THREE.MeshStandardMaterial({ name: 'husk_body', roughness: .8 })); sm.name = 'husk_body'; root.add(sm); sm.bind(new THREE.Skeleton(list), new THREE.Matrix4());
// clips: every samurai clip, tracks kept for this rig's bones, the hips' travel scaled
const hipsY = gw('Hips').y, kHip = J.Hips.y / hipsY * Srig.y, have = new Set(list.map(b => b.name)), clips = []; info.hipsK = kHip;
for (const a of gd.animations) { const tr = []; for (const t of a.tracks) { const nm = t.name.split('.')[0]; if (!have.has(nm)) continue; const c = t.clone(); if (/Hips\.position$/.test(t.name)) for (let i = 0; i < c.values.length; i++) c.values[i] *= kHip; tr.push(c); }
  if (tr.length) clips.push(new THREE.AnimationClip(a.name, a.duration, tr)); }
info.clips = clips.length;
// THE SPEAR in the katana's convention: `weapon_root_right` at the grip, the shaft along +Y (head up), `weapon_tip` at (-14.3102, 0, 0); file units = metres / WEAP.unit
const UNIT = .01321, gameH = 1.75, ms = gameH / .871;     // metres per model unit at his game height
spearG.computeBoundingBox(); const sb = spearG.boundingBox.clone(), gripY = sb.min.y + (sb.max.y - sb.min.y) * (A.grip || .36), sx = (sb.min.x + sb.max.x) / 2, sz = (sb.min.z + sb.max.z) / 2;
spearG.translate(-sx, -gripY, -sz); spearG.scale(ms / UNIT, ms / UNIT, ms / UNIT); info.spear = { lenM: +((sb.max.y - sb.min.y) * ms).toFixed(3), gripFromButtM: +((gripY - sb.min.y) * ms).toFixed(3), tris: spearT.length };
const spearW = mergeVertices(spearG, 1e-4); const wroot = new THREE.Group(); wroot.name = 'weapon_root_right'; const wtip = new THREE.Object3D(); wtip.name = 'weapon_tip'; wtip.position.set(-14.3102, 0, 0); wroot.add(wtip);
const wm = new THREE.Mesh(spearW, new THREE.MeshStandardMaterial({ name: 'husk_spear', roughness: .6, metalness: .2 })); wm.name = 'husk_spear'; wroot.add(wm); const wscene = new THREE.Scene(); wscene.add(wroot);
window.HUSK = { scene, root, sm, bones, clips, wscene };
const glb = async (S, opt, name) => { const buf = await new GLTFExporter().parseAsync(S, Object.assign({ binary: true, onlyVisible: false }, opt)); const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); await saveFile(name, btoa(s)); return b.length; };
if (A.export) { info.bytes = await glb(scene, { animations: clips }, 'husk_raw.glb'); info.wbytes = await glb(wscene, {}, 'husk_spear_raw.glb'); }
if (A.look) { const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(1200, 800); document.body.appendChild(R.domElement);
  const S = scene; S.background = new THREE.Color(0x777777); S.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2.5)); const L = new THREE.DirectionalLight(0xffffff, 2); L.position.set(1, 2, 3); S.add(L);
  const pal = list.map((_, i) => new THREE.Color().setHSL((i * 0.618) % 1, .75, .55)); { const g = sm.geometry, n = g.attributes.position.count, col = new Float32Array(n * 3), SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
    for (let v = 0; v < n; v++) { const c = new THREE.Color(0, 0, 0); for (let q = 0; q < 4; q++) { const w = SW.getComponent(v, q); if (w) c.add(pal[SI.getComponent(v, q)].clone().multiplyScalar(w)); } col.set([c.r, c.g, c.b], v * 3); } g.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  sm.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8 }); const hp = new THREE.SkeletonHelper(root); hp.material.depthTest = false; S.add(hp);
  // the spear in his hand, as the game mounts it (katana rule: the file's tip axis onto the hand mount's weapon_tip axis, sized by UNIT)
  const m = bones.weapon_root_right, wt = m && m.children.find(c => /^weapon_tip/.test(c.name)); if (m && wt) { const gg = new THREE.Group(); gg.quaternion.setFromUnitVectors(wtip.position.clone().normalize(), wt.position.clone().normalize()); m.add(gg); m.updateMatrixWorld(true);
    gg.scale.setScalar(UNIT / ms / m.getWorldScale(V()).x); const sp = wm.clone(); sp.material = new THREE.MeshStandardMaterial({ color: 0x8899aa }); gg.add(sp); } else info.noMount = 1;
  const C = new THREE.PerspectiveCamera(30, 1.5, .05, 50), mixer = new THREE.AnimationMixer(root);
  for (const [nm, clip, t] of (A.look === 1 ? [['rest', null, 0]] : A.look)) { mixer.stopAllAction(); if (clip) { const c = clips.find(c => c.name === clip); if (!c) { info['noclip_' + clip] = 1; continue; } mixer.clipAction(c).play(); mixer.setTime(t); } scene.updateMatrixWorld(true);
    for (const [vn, p, x0] of [['front', [0, .45, 3.2], 0], ['side', [3.2, .45, 0], 600]]) { C.position.set(...p); C.lookAt(0, .45, 0); C.aspect = .75; C.updateProjectionMatrix(); R.setViewport(x0, 0, 600, 800); R.setScissor(x0, 0, 600, 800); R.setScissorTest(true); R.render(S, C); }
    await saveFile(`hlook_${nm}.png`, R.domElement.toDataURL().split(',')[1]); } }
window.DONE = info;
