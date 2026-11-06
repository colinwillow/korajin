import * as THREE from 'three';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { DRACOLoader } from '/vendor/DRACOLoader.js';
const A = window.ARG || {}; const d = new DRACOLoader(); d.setDecoderPath('/vendor/draco/'); const gl = new GLTFLoader(); gl.setDRACOLoader(d);
const SHSEG = { Hips: 'waist', Spine: 'waist', Spine1: 'chest', Spine2: 'chest', Neck: 'head', Head: 'head', Shoulder: 'shoulder', Arm: 'shoulder', ForeArm: 'forearm', Hand: 'hand', UpLeg: 'thigh', Leg: 'shin', Foot: 'foot', ToeBase: 'foot' };
const segOf = name => { const n = name.replace(/^mixamorig[_:]?/, ''), m = /^(Left|Right)(.*)$/.exec(n); return m ? (SHSEG[m[2]] || 'chest') + (m[1] === 'Left' ? 'L' : 'R') : SHSEG[n] || 'chest'; };
function tris(M) { const G = M.geometry, SI = G.attributes.skinIndex, SW = G.attributes.skinWeight, n = SI.count, seg = M.skeleton.bones.map(b => segOf(b.name)), vs = [];
  for (let v = 0; v < n; v++) { let bw = -1, bi = 0; for (let c = 0; c < 4; c++) { const w = SW.getComponent(v, c); if (w > bw) { bw = w; bi = SI.getComponent(v, c); } } vs[v] = seg[bi]; }
  const idx = G.index.array, T = {}; for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], c = idx[t + 2], s = vs[b] === vs[c] ? vs[b] : vs[a]; (T[s] = T[s] || []).push(a, b, c); } return T; }
const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); const W = 1200, H = 900; R.setSize(W, H); document.body.appendChild(R.domElement); R.setScissorTest(true);
const files = A.files, broke = new Set(A.broke), cams = A.cams, out = {};
const S = new THREE.Scene(); S.background = new THREE.Color(0x5a5f66); S.add(new THREE.HemisphereLight(0xffffff, 0x445544, 2.2)); const L = new THREE.DirectionalLight(0xffffff, 2.2); L.position.set(2, 3, 4); S.add(L);
const roots = []; for (const f of files) { const g = await gl.loadAsync(f); const r = g.scene; let st, sp; r.traverse(o => { if (o.isSkinnedMesh) { if (/spirit/.test(o.name)) sp = o; else st = o; o.frustumCulled = false; } });
  const Ts = tris(st), Tp = tris(sp); const ia = [], ib = []; for (const s in Ts) if (!broke.has(s)) ia.push(...Ts[s]); for (const s in Tp) if (broke.has(s)) ib.push(...Tp[s]);
  st.geometry = st.geometry.clone(); st.geometry.setIndex(ia); sp.geometry = sp.geometry.clone(); sp.geometry.setIndex(ib); sp.material = sp.material.clone(); sp.material.emissiveIntensity = 1.4;
  const mixer = new THREE.AnimationMixer(r); if (A.clip) { const c = g.animations.find(a => a.name === A.clip[0]); mixer.clipAction(c).play(); mixer.setTime(A.clip[1]); }
  roots.push(r); out[f] = Object.keys(Ts).map(s => s + ':' + Ts[s].length / 3).join(' '); }
const C = new THREE.PerspectiveCamera(30, 1, .01, 20); const cw = W / files.length, ch = H / cams.length;
for (const [ci, cam] of cams.entries()) for (const [fi, r] of roots.entries()) { for (const q of roots) S.remove(q); S.add(r); r.updateMatrixWorld(true);
  C.aspect = cw / ch; C.updateProjectionMatrix(); C.position.set(...cam[0]); C.lookAt(...cam[1]); const x = fi * cw, y = H - (ci + 1) * ch; R.setViewport(x, y, cw, ch); R.setScissor(x, y, cw, ch); R.render(S, C); }
await saveFile(A.name, R.domElement.toDataURL().split(',')[1]); window.DONE = out;
