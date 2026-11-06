// tools/vrig/page.js -- run by tools/vrig/run.mjs in headless Chromium (see its header). window.ARG = the villager's JSON.
import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { DRACOLoader } from '/vendor/DRACOLoader.js';
import { GLTFExporter } from '/vendor/GLTFExporter.js';
import { mergeVertices } from '/vendor/BufferGeometryUtils.js';
const A = window.ARG, info = { name: A.name };
const V = (x, y, z) => new THREE.Vector3(x, y, z), vv = a => V(a[0], a[1], a[2]);
const H = A.height;                                   // metres to the top of the mesh (its hair): the FBX's own units are scaled by H / its height
// ---- the mesh (welded: Tripo writes every triangle's corners apart), scaled to H, standing on y 0
const fbx = await new FBXLoader().loadAsync('/src/' + A.fbx); fbx.updateMatrixWorld(true); let G0;
fbx.traverse(o => { if (o.isMesh && !G0) { G0 = o.geometry.clone(); G0.applyMatrix4(o.matrixWorld); } });
for (const k of Object.keys(G0.attributes)) if (!['position', 'uv'].includes(k)) G0.deleteAttribute(k);
// ---- the texture, read once (for `drop` and for the material below)
const img = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = '/src/' + A.tex; });
// ---- DROP: a generation error he wants gone (the Korajin woman's flat BLUE panel on her back: one loose 3-triangle quad). Whole SHELLS (islands
// welded by position) lying entirely inside `box` (the FBX's own units, Y up after its node) are deleted when they have at most `maxTris`
// triangles, or are mostly `colour` in the texture -- a loose shell lies OVER the body, so the body under it stays whole (checked: no hole).
// (Big triangles defeat the colour test -- its samples land off the colour -- which is why the panel is caught by its size.)
if (A.drop) { const D = A.drop, N0 = 1024, c0 = document.createElement('canvas'); c0.width = c0.height = N0; const cx = c0.getContext('2d'); cx.drawImage(img, 0, 0, N0, N0); const px = cx.getImageData(0, 0, N0, N0).data;
  const rule = D.colour === 'blue' ? (r, g, b) => b > r + 30 && b > g + 15 && b > 70 : () => false, P0 = G0.attributes.position, UV0 = G0.attributes.uv, nT = P0.count / 3;
  const hit = (u, v) => { const x = Math.min(N0 - 1, Math.max(0, u * N0 | 0)), y = Math.min(N0 - 1, Math.max(0, (1 - v) * N0 | 0)), i = (y * N0 + x) * 4; return rule(px[i], px[i + 1], px[i + 2]); };     /* FBX v runs UP */
  const q = new THREE.BufferGeometry(); q.setAttribute('position', P0.clone()); const Wq = mergeVertices(q, 1e-5), I0 = Wq.index.array, par = new Int32Array(Wq.attributes.position.count).map((_, i) => i);
  const f = a => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }; for (let t = 0; t < nT; t++) { const a = f(I0[t * 3]); par[f(I0[t * 3 + 1])] = a; par[f(I0[t * 3 + 2])] = f(a); }
  const box = D.box ? new THREE.Box3(vv(D.box.slice(0, 3)), vv(D.box.slice(3))) : null, st = new Map(), _p = V();
  for (let t = 0; t < nT; t++) { const r = f(I0[t * 3]), e = st.get(r) || st.set(r, { n: 0, c: 0, inBox: 1 }).get(r); e.n++; let k = 0; for (const w of [[1 / 3, 1 / 3, 1 / 3], [1, 0, 0], [0, 1, 0], [0, 0, 1]]) { let u = 0, v = 0; for (let j = 0; j < 3; j++) { u += UV0.getX(t * 3 + j) * w[j]; v += UV0.getY(t * 3 + j) * w[j]; } k += hit(u, v); } if (k >= 3) e.c++;
    if (box) { _p.fromBufferAttribute(P0, t * 3); if (!box.containsPoint(_p)) e.inBox = 0; } }
  if (D.debug) { const bb = new Map(); for (let t = 0; t < nT; t++) { const r = f(I0[t * 3]); _p.fromBufferAttribute(P0, t * 3); const b = bb.get(r) || bb.set(r, new THREE.Box3()).get(r); b.expandByPoint(_p); }
    info.dropDebug = [...st].filter(([r, e]) => e.c > 0).map(([r, e]) => [e.n, e.c, e.inBox, bb.get(r).min.toArray().map(v => +v.toFixed(3)), bb.get(r).max.toArray().map(v => +v.toFixed(3))]); }
  const kill = new Set([...st].filter(([r, e]) => e.inBox && ((D.maxTris && e.n <= D.maxTris) || (D.colour && e.c / e.n >= (D.frac || .6)))).map(([r]) => r)), keepIdx = [];     /* a SMALL loose shell in the box, or one mostly of the colour */
  for (let t = 0; t < nT; t++) if (!kill.has(f(I0[t * 3]))) keepIdx.push(t * 3, t * 3 + 1, t * 3 + 2);
  info.drop = { shells: kill.size, tris: nT - keepIdx.length / 3, which: [...kill].map(r => st.get(r).n + ' tris, ' + Math.round(st.get(r).c / st.get(r).n * 100) + '% ' + D.colour) };
  const g2 = new THREE.BufferGeometry(); for (const k of ['position', 'uv']) { const A2 = G0.attributes[k], out = new Float32Array(keepIdx.length * A2.itemSize); keepIdx.forEach((vi, j) => { for (let c = 0; c < A2.itemSize; c++) out[j * A2.itemSize + c] = A2.array[vi * A2.itemSize + c]; }); g2.setAttribute(k, new THREE.BufferAttribute(out, A2.itemSize)); }
  G0 = g2; }
G0.computeBoundingBox(); const bb0 = G0.boundingBox, S = H / (bb0.max.y - bb0.min.y); G0.translate(0, -bb0.min.y, 0); G0.scale(S, S, S);
const G = mergeVertices(G0, 1e-5); G.computeVertexNormals(); G.computeBoundingBox();
info.mesh = { trisIn: G0.attributes.position.count / 3, verts: G.attributes.position.count, tris: G.index.count / 3, size: G.boundingBox.getSize(V()).toArray().map(v => +v.toFixed(3)), scale: +S.toFixed(4) };
// ---- her joints (measured on the mesh, in its own units -> metres); +X is HER LEFT (she faces +Z)
const J = {}, TIP = {}; for (const k in A.J) { J[k] = vv(A.J[k]).multiplyScalar(S); if (k.startsWith('Left')) J['Right' + k.slice(4)] = V(-J[k].x, J[k].y, J[k].z); }
for (const k in A.TIP) { TIP[k] = vv(A.TIP[k]).multiplyScalar(S); if (k.startsWith('Left')) TIP['Right' + k.slice(4)] = V(-TIP[k].x, TIP[k].y, TIP[k].z); }
const PRIM = { Hips: 'Spine', Spine: 'Spine1', Spine1: 'Spine2', Spine2: 'Neck', Neck: 'Head', LeftShoulder: 'LeftArm', LeftArm: 'LeftForeArm', LeftForeArm: 'LeftHand', LeftUpLeg: 'LeftLeg', LeftLeg: 'LeftFoot', LeftFoot: 'LeftToeBase' };
for (const k in PRIM) if (k.startsWith('Left')) PRIM['Right' + k.slice(4)] = 'Right' + PRIM[k].slice(4);
const CORE = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'];
// ---- the donor's skeleton: every bone (fingers and weapon mounts too), in its own order
const dl = new DRACOLoader(); dl.setDecoderPath('/vendor/draco/'); const gl = new GLTFLoader(); gl.setDRACOLoader(dl);
const gd = await gl.loadAsync('/' + A.donor); gd.scene.updateMatrixWorld(true); const GB = {}, ORDER = [];
gd.scene.traverse(o => { if (o.isBone) { const n = o.name.replace(/^mixamorig[_:]?/, ''); GB[n] = o; ORDER.push(n); } });
const PAR = {}; for (const k of ORDER) PAR[k] = GB[k].parent && GB[k].parent.isBone ? GB[k].parent.name.replace(/^mixamorig[_:]?/, '') : null;
const wp = k => GB[k].getWorldPosition(V()), wq = k => GB[k].getWorldQuaternion(new THREE.Quaternion());
// the donor's scale against hers, by the arm (shoulder -> hand), for the bones she has no measurement of (fingers, mounts)
const kArm = J.LeftArm.distanceTo(J.LeftHand) / wp('LeftArm').distanceTo(wp('LeftHand')); info.kArm = +kArm.toFixed(3);
const swing = {}, N = {}, JW = {};
for (const k of ORDER) { const Gq = wq(k); let s = new THREE.Quaternion();
  if (CORE.includes(k)) { JW[k] = J[k].clone();
    if (PRIM[k] && k !== 'Hips') { const dg = wp(PRIM[k]).sub(wp(k)).normalize(), dn = J[PRIM[k]].clone().sub(J[k]).normalize(); s.setFromUnitVectors(dg, dn); }
    else if (PAR[k] && k !== 'Head' && swing[PAR[k]]) s.copy(swing[PAR[k]]); }
  else { const p = PAR[k]; s.copy(swing[p] || s); JW[k] = JW[p].clone().add(wp(k).sub(wp(p)).applyQuaternion(swing[p]).multiplyScalar(kArm)); }     /* a finger rides its hand */
  swing[k] = s; N[k] = s.clone().multiply(Gq); }
const root = new THREE.Group(); root.name = A.name + '_rig'; const bones = {}, list = [];
for (const k of ORDER) { const b = new THREE.Bone(); b.name = 'mixamorig_' + k; const p = PAR[k], pq = p ? N[p] : new THREE.Quaternion(), pp = p ? JW[p] : V(0, 0, 0), inv = pq.clone().invert();
  b.quaternion.copy(inv.clone().multiply(N[k])); b.position.copy(JW[k].clone().sub(pp).applyQuaternion(inv)); (p ? bones[p] : root).add(b); bones[k] = b; list.push(b); }
const scene = new THREE.Scene(); scene.add(root); scene.updateMatrixWorld(true);
info.fitErr = Math.max(...CORE.map(k => bones[k].getWorldPosition(V()).distanceTo(J[k]))).toExponential(1);
// ---- weights: the nearest CORE bone segment, blended into an adjacent one; side-locked; `rigid` boxes (hair -> Head, flaps -> Hips) win
const IDX = Object.fromEntries(list.map((b, i) => [b.name.replace('mixamorig_', ''), i]));
const SEG = CORE.map(k => [k, J[k], PRIM[k] ? J[PRIM[k]] : (TIP[k] || J[k].clone().add(V(0, .02, 0)))]);
const _c = V(), _l = new THREE.Line3(); const segD = (p, i) => { _l.set(SEG[i][1], SEG[i][2]); _l.closestPointToPoint(p, true, _c); return _c.distanceTo(p); };
const adj = (a, b) => PAR[a] === b || PAR[b] === a;
const RIG = (A.rigid || []).map(([bone, x0, x1, y0, y1, z0, z1, blend]) => ({ bone, b: new THREE.Box3(V(x0, y0, z0).multiplyScalar(S), V(x1, y1, z1).multiplyScalar(S)), blend }));
const P = G.attributes.position, n = P.count, si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), p = V(), cnt = {};
for (let v = 0; v < n; v++) { p.fromBufferAttribute(P, v); const side = p.x > .012 ? 'Right' : p.x < -.012 ? 'Left' : '';     /* a vertex on her LEFT (+x) never takes a Right bone */
  const R = RIG.find(r => r.b.containsPoint(p)); let w = [];
  if (R) { w = [[IDX[R.bone], 1]]; if (R.blend) w = [[IDX[R.bone], 1 - R.blend[1]], [IDX[R.blend[0]], R.blend[1]]]; }
  else { const d = SEG.map((s, i) => (side && s[0].startsWith(side)) ? 1e9 : segD(p, i)), ix = d.map((_, i) => i).sort((a, b) => d[a] - d[b]), i1 = ix[0], i2 = ix.find(i => i !== i1 && adj(SEG[i][0], SEG[i1][0]));
    let w1 = 1, w2 = 0; if (i2 != null && d[i2] < d[i1] * 2.2) { const a1 = 1 / Math.pow(d[i1] + 1e-3, 4), a2 = 1 / Math.pow(d[i2] + 1e-3, 4) * Math.max(0, 1 - (d[i2] / (d[i1] + 1e-4) - 1) / 1.2); w1 = a1 / (a1 + a2); w2 = 1 - w1; }
    w = [[IDX[SEG[i1][0]], w1]]; if (w2 > 1e-3) w.push([IDX[SEG[i2][0]], w2]); }
  w.forEach(([b, x], q) => { si[v * 4 + q] = b; sw[v * 4 + q] = x; }); const top = list[w[0][0]].name; cnt[top] = (cnt[top] || 0) + 1; }
G.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4)); G.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
info.byBone = Object.fromEntries(Object.entries(cnt).map(([k, c]) => [k.replace('mixamorig_', ''), c]));
// ---- the texture, resized to `texSize`, sRGB; the material opaque, single-sided (Tripo writes doubleSided)
const T = A.texSize || 2048, cv = document.createElement('canvas'); cv.width = cv.height = T; cv.getContext('2d').drawImage(img, 0, 0, T, T); info.texIn = img.width + 'x' + img.height;
const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.flipY = false; tex.userData.mimeType = 'image/jpeg';
const mat = new THREE.MeshStandardMaterial({ name: A.name, map: tex, roughness: .82, metalness: 0, side: THREE.FrontSide });
// glTF UVs: FBXLoader gives three's flipY=true convention; the exported texture is flipY=false, so flip v
{ const uv = G.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i)); }
const sm = new THREE.SkinnedMesh(G, mat); sm.name = A.name; root.add(sm); sm.bind(new THREE.Skeleton(list), new THREE.Matrix4());
// ---- a LOOK: the weights as colours and the bones, front and side, plus the textured body
if (A.look) { const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(1200, 800); R.outputColorSpace = THREE.SRGBColorSpace; document.body.appendChild(R.domElement);
  const L = new THREE.Scene(); L.background = new THREE.Color(0x777777); L.add(new THREE.HemisphereLight(0xffffff, 0x555555, 2.2)); const dlt = new THREE.DirectionalLight(0xffffff, 1.6); dlt.position.set(1, 2, 3); L.add(dlt);
  const pal = list.map((_, i) => new THREE.Color().setHSL((i * .618) % 1, .75, .55)), col = new Float32Array(n * 3);
  for (let v = 0; v < n; v++) { const c = new THREE.Color(0, 0, 0); for (let q = 0; q < 4; q++) { const x = sw[v * 4 + q]; if (x) c.add(pal[si[v * 4 + q]].clone().multiplyScalar(x)); } col.set([c.r, c.g, c.b], v * 3); }
  const G2 = G.clone(); G2.setAttribute('color', new THREE.BufferAttribute(col, 3)); const wm = new THREE.SkinnedMesh(G2, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .8 }));
  root.add(wm); wm.bind(sm.skeleton, new THREE.Matrix4()); L.add(scene); const hp = new THREE.SkeletonHelper(root); hp.material.depthTest = false; L.add(hp);
  const C = new THREE.PerspectiveCamera(28, .75, .05, 50); R.setScissorTest(true); const h = H * .5, d = H * 3.1;
  [[0, h, d, 1], [d, h, 0, 1], [0, h, d, 0], [d, h, 0, 0]].forEach(([x, y, z, w], k) => { wm.visible = !!w; sm.visible = !w; hp.visible = !!w; R.setViewport(k * 300, 0, 300, 800); R.setScissor(k * 300, 0, 300, 800); C.position.set(x, y, z); C.lookAt(0, h, 0); R.render(L, C); });
  await saveFile(A.name + '_look.png', R.domElement.toDataURL().split(',')[1]); L.remove(scene); scene.add(root); wm.removeFromParent(); hp.removeFromParent(); sm.visible = true; }
// ---- the GLB (clips come from the Forge)
const buf = await new GLTFExporter().parseAsync(scene, { binary: true, onlyVisible: false });
const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
await saveFile(A.out, btoa(s)); info.bytes = b.length; info.bones = list.length;
window.DONE = info;
