// tools/petrig/layer.js -- run by tools/petrig/layer.mjs in headless Chromium. The PET FRIEND's own motion, laid onto the FORGED clips:
//  * the SECOND ARM PAIR (mixamorig_*Arm2/ForeArm2/Hand2) takes the first pair's motion as a DELTA from rest in its own frame (the two pairs share
//    the donor's arm frames, see tools/vrig X.like), sampled at a PHASE OFFSET and SCALED -- so they swing on their own beat, not as a copy;
//  * the TAIL (mixamorig_Tail..Tail3) sways side to side, a wave travelling down it, a whole number of times per clip so every loop closes.
import * as THREE from 'three';
import { GLTFLoader } from '/vendor/GLTFLoader.js';
import { DRACOLoader } from '/vendor/DRACOLoader.js';
import { GLTFExporter } from '/vendor/GLTFExporter.js';
const A = window.ARG, info = { clips: {} };
const dl = new DRACOLoader(); dl.setDecoderPath('/vendor/draco/'); const gl = new GLTFLoader(); gl.setDRACOLoader(dl);
const G = await gl.loadAsync('/' + A.src); const B = {}; G.scene.traverse(o => { if (o.isBone) B[o.name] = o; });
const rest = n => B['mixamorig_' + n].quaternion.clone();
const ARM = { Arm: 'Arm2', ForeArm: 'ForeArm2', Hand: 'Hand2' };
const ROLE = A.roles;     // role -> { off: fraction of the clip, k: how much of the first pair's motion, tail: [amp rad, lift rad, waves per clip min period s] }
const Q = new THREE.Quaternion(), I = new THREE.Quaternion();
const qAt = (tr, t) => { const it = tr.createInterpolant(); const v = it.evaluate(t); return new THREE.Quaternion(v[0], v[1], v[2], v[3]); };
for (const clip of G.animations) { const R = ROLE[clip.name] || ROLE._; const dur = clip.duration, N = Math.max(2, Math.round(dur * 30) + 1), times = new Float32Array(N); for (let i = 0; i < N; i++) times[i] = dur * i / (N - 1);
  const add = [];
  for (const side of ['Left', 'Right']) for (const k in ARM) { const src = clip.tracks.find(t => t.name === 'mixamorig_' + side + k + '.quaternion'); const r1 = rest(side + k), r1i = r1.clone().invert(), r2 = rest(side + ARM[k]);
    const v = new Float32Array(N * 4); for (let i = 0; i < N; i++) { let d = new THREE.Quaternion(); if (src) { let t = times[i] + R.off * dur * (side === 'Right' ? 1 : 1); t = ((t % dur) + dur) % dur; d = r1i.clone().multiply(qAt(src, t)); }
      d = I.clone().slerp(d, R.k); const q = r2.clone().multiply(d); q.toArray(v, i * 4); }
    add.push(new THREE.QuaternionKeyframeTrack('mixamorig_' + side + ARM[k] + '.quaternion', times, v)); }
  const [amp, lift, per] = R.tail, w = Math.max(1, Math.round(dur / per)) * Math.PI * 2 / dur;
  ['Tail', 'Tail1', 'Tail2', 'Tail3'].forEach((n, j) => { const r = rest(n), v = new Float32Array(N * 4); for (let i = 0; i < N; i++) { const t = times[i];
      const sway = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), amp * (.55 + .2 * j) * Math.sin(w * t - j * .7)), up = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), lift * (j ? .5 : 1));
      r.clone().multiply(up).multiply(sway).toArray(v, i * 4); }
    add.push(new THREE.QuaternionKeyframeTrack('mixamorig_' + n + '.quaternion', times, v)); });
  clip.tracks = clip.tracks.filter(t => !add.some(a => a.name === t.name)).concat(add); info.clips[clip.name] = +dur.toFixed(2); }
G.scene.updateMatrixWorld(true);
const buf = await new GLTFExporter().parseAsync(G.scene, { binary: true, animations: G.animations, onlyVisible: false });
const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
await saveFile(A.out, btoa(s)); info.bytes = b.length; window.DONE = info;
