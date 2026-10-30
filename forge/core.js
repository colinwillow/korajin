// FORGE CORE -- the character-profile engine: carry a library clip onto a body, then the layers on top.
// Used by forge.html (the app) and tools/forge.cjs (the command line, headless). No DOM in here.
// `bindPose` and `retargetW` are the GAME's own text, lifted verbatim between the SHIPPED markers by `node tools/forgesync.mjs
// --write` (and `npm run check` fails if they drift): a tool must run the shipped text, never a copy of the rule.
import * as THREE from 'three';

export const MHIPS = 'mixamorig_Hips';
export const RTW = { fps: 30, feet: 1 };

// SHIPPED:bindPose
function bindPose(bones, model) {
  const h = bones && bones[MHIPS];
  if (!h || !h.parent) return null;
  const rest = {};
  for (const n in bones) { const q = bones[n].quaternion; rest[n] = [q.x, q.y, q.z, q.w]; }
  // THE HIPS' PARENT's rotation, which is the frame BOTH its local rotation and its local
  // translation are expressed in -- see `mphBorrow`.
  // **COMPOSED UP TO THE MODEL, NOT TO THE SCENE.** `getWorldQuaternion` folds in whatever the
  // model happens to be parented to, and the two sides of this are not parented alike: zap's is
  // already under `rig.root`, whose yaw is written every frame, while a freshly cloned skin is
  // under nothing at all. Measuring the two in different frames is exactly the fault this delta
  // exists to remove, and it would have been silent -- today `rig.root` is at yaw 0 when this
  // runs and it is only true by accident of ordering.
  const pq = new THREE.Quaternion();
  for (let o = h.parent; o && o !== model; o = o.parent) pq.premultiply(o.quaternion);
  // m924: what `retargetW` needs -- each bone's PARENT bone, its rest local POSITION, and its rest WORLD rotation (composed up to
  // the model), in parent-first ORDER. Positions are in the rig's own units (the armature's scale sits above and cancels in ratios).
  const par = {}, pos = {}, wq = {}, order = Object.keys(bones).sort((a, b) => depth(bones[a]) - depth(bones[b]));
  function depth(o) { let d = 0; for (let x = o.parent; x && x.isBone; x = x.parent) d++; return d; }
  for (const n of order) { const b = bones[n]; par[n] = b.parent && b.parent.isBone && bones[b.parent.name] ? b.parent.name : null; pos[n] = b.position.clone();
    const top = new THREE.Quaternion(); if (!par[n]) for (let o = b.parent; o && o !== model; o = o.parent) top.premultiply(o.quaternion);
    wq[n] = (par[n] ? wq[par[n]].clone() : top).multiply(b.quaternion); }
  return { pq, t: h.position.clone(), rest, par, pos, wq, order };
}
// /SHIPPED:bindPose

// SHIPPED:retargetW
function retargetW(S, T, srcClips, bones) {
  if (!S || !T || !S.order || !T.order) return null;
  const Q = () => new THREE.Quaternion(), V = () => new THREE.Vector3();
  const has = n => !!T.wq[n] && !!bones[n];
  const top = (B, n) => B.wq[n].clone().multiply(Q().fromArray(B.rest[n]).invert());     // the rotation above a top bone
  const restP = B => { const P = {}; for (const n of B.order) { const p = B.pos[n].clone(); P[n] = B.par[n] ? p.applyQuaternion(B.wq[B.par[n]]).add(P[B.par[n]]) : p.applyQuaternion(top(B, n)); } return P; };
  const LEG = ['Left', 'Right'].map(sd => ({ up: 'mixamorig_' + sd + 'UpLeg', kn: 'mixamorig_' + sd + 'Leg', ft: 'mixamorig_' + sd + 'Foot' }));
  const legsOK = LEG.every(L => [L.up, L.kn, L.ft].every(n => S.wq[n] && has(n)));
  let hr = 1, lr = 1, Ls = new THREE.Vector3(1, 0, 0);
  if (legsOK) { const SP = restP(S), TP = restP(T);
    const hw = P => P[LEG[0].up].distanceTo(P[LEG[1].up]), ll = P => P[LEG[0].up].distanceTo(P[LEG[0].kn]) + P[LEG[0].kn].distanceTo(P[LEG[0].ft]);
    hr = hw(TP) / (hw(SP) || 1); lr = ll(TP) / (ll(SP) || 1); Ls = SP[LEG[0].up].clone().sub(SP[LEG[1].up]).normalize();
    // m942: each leg's own hip, sideways from the hips' centre at rest -- a foot's sideways place RELATIVE TO ITS OWN HIP scales with
    // LEG LENGTH, and only the hips themselves sit at hip width. Scaling the whole sideways offset by hip width made a short-legged,
    // wide-hipped body (the CEO: x2.84 for his legs) swing every step out sideways (*"the weird outward bend"*).
    const Cr = SP[LEG[0].up].clone().add(SP[LEG[1].up]).multiplyScalar(.5); for (const L of LEG) L.hs = SP[L.up].clone().sub(Cr).dot(Ls); }
  const D0 = T.pq.clone().invert().multiply(S.pq), k0 = T.t.length() / (S.t.length() || 1);
  const topS = {}, topT = {}; for (const n of S.order) if (!S.par[n]) topS[n] = top(S, n); for (const n of T.order) if (!T.par[n]) topT[n] = top(T, n);
  const iS = {}; for (const n of S.order) iS[n] = S.wq[n].clone().invert();
  const restQS = {}, restQT = {}; for (const n of S.order) restQS[n] = Q().fromArray(S.rest[n]); for (const n of T.order) restQT[n] = Q().fromArray(T.rest[n]);
  const clips = {}; let shared = 0; for (const n of T.order) if (S.wq[n]) shared++;
  const t0 = performance.now();
  for (const nm in srcClips) {
    const c = srcClips[nm], tq = {}; let hp = null;
    for (const tr of c.tracks) { const dot = tr.name.lastIndexOf('.'), bn = tr.name.slice(0, dot), pr = tr.name.slice(dot + 1);
      if (!tr.times || !tr.times.length) continue;
      if (pr === 'quaternion' && S.wq[bn]) tq[bn] = tr.createInterpolant(); else if (pr === 'position' && bn === MHIPS) hp = tr.createInterpolant(); }
    const keyed = Object.keys(tq).filter(has);
    if (!keyed.length && !hp) continue;
    const feet = RTW.feet && legsOK && LEG.some(L => tq[L.up] || tq[L.kn]);
    const outN = new Set(keyed); if (feet) for (const L of LEG) for (const n of [L.up, L.kn, L.ft]) outN.add(n);
    const nf = Math.max(2, Math.round(c.duration * RTW.fps) + 1), times = new Float32Array(nf), oq = {}, op = hp && has(MHIPS) ? new Float32Array(nf * 3) : null;
    for (const n of outN) oq[n] = new Float32Array(nf * 4);
    const SW = {}, SP = {}, TW = {}, TL = {}, TP = {};
    for (let f = 0; f < nf; f++) {
      const t = Math.min(c.duration, f / RTW.fps); times[f] = t;
      for (const n of S.order) { const pn = S.par[n], q = tq[n] ? Q().fromArray(tq[n].evaluate(t)) : restQS[n];
        SW[n] = (pn ? SW[pn].clone() : topS[n].clone()).multiply(q);
        const lp = n === MHIPS && hp ? V().fromArray(hp.evaluate(t)) : S.pos[n].clone();
        SP[n] = pn ? lp.applyQuaternion(SW[pn]).add(SP[pn]) : lp.applyQuaternion(topS[n]); }
      let hl = T.pos[MHIPS] ? T.pos[MHIPS].clone() : V();
      if (hp) hl = V().fromArray(hp.evaluate(t)).sub(S.t).applyQuaternion(D0).multiplyScalar(k0).add(T.t);
      for (const n of T.order) { const pn = T.par[n], Pq = pn ? TW[pn] : topT[n];
        TW[n] = tq[n] ? SW[n].clone().multiply(iS[n]).multiply(T.wq[n]) : Pq.clone().multiply(restQT[n]);
        TL[n] = Pq.clone().invert().multiply(TW[n]);
        const lp = n === MHIPS ? hl.clone() : T.pos[n].clone();
        TP[n] = pn ? lp.applyQuaternion(TW[pn]).add(TP[pn]) : lp.applyQuaternion(topT[n]); }
      if (feet) {
        const Dq = SW[MHIPS].clone().multiply(iS[MHIPS]), Di = Dq.clone().invert();
        const Cs = SP[LEG[0].up].clone().add(SP[LEG[1].up]).multiplyScalar(.5), Ct = TP[LEG[0].up].clone().add(TP[LEG[1].up]).multiplyScalar(.5);
        const map = (p, hs) => { const q = p.clone().sub(Cs).applyQuaternion(Di), l = q.dot(Ls); q.addScaledVector(Ls, -l); return q.multiplyScalar(lr).addScaledVector(Ls, l * lr + hs * (hr - lr)).applyQuaternion(Dq).add(Ct); };
        for (const L of LEG) {
          const H = TP[L.up], Tg = map(SP[L.ft], L.hs), K0 = map(SP[L.kn], L.hs), a = T.pos[L.kn].length(), b = T.pos[L.ft].length();
          const d = Tg.clone().sub(H), dl = Math.max(1e-6, Math.min(d.length(), (a + b) * .999)), nn = d.normalize();
          const x = (a * a - b * b + dl * dl) / (2 * dl), h = Math.sqrt(Math.max(0, a * a - x * x));
          let pole = K0.clone().sub(H); pole.addScaledVector(nn, -pole.dot(nn));
          if (pole.lengthSq() < 1e-10) { pole = V().set(0, 0, 1).applyQuaternion(Dq); pole.addScaledVector(nn, -pole.dot(nn)); }
          const K = H.clone().addScaledVector(nn, x).addScaledVector(pole.normalize(), h), Tf = H.clone().addScaledVector(nn, dl);
          const footW = TW[L.ft].clone(), Pup = T.par[L.up] ? TW[T.par[L.up]] : topT[L.up];
          TW[L.up] = Q().setFromUnitVectors(TP[L.kn].clone().sub(H).normalize(), K.clone().sub(H).normalize()).multiply(TW[L.up]);
          TL[L.up] = Pup.clone().invert().multiply(TW[L.up]);
          const Kp = T.pos[L.kn].clone().applyQuaternion(TW[L.up]).add(H), legW = TW[L.up].clone().multiply(TL[L.kn]);
          TW[L.kn] = Q().setFromUnitVectors(T.pos[L.ft].clone().applyQuaternion(legW).normalize(), Tf.clone().sub(Kp).normalize()).multiply(legW);
          TL[L.kn] = TW[L.up].clone().invert().multiply(TW[L.kn]);
          TL[L.ft] = TW[L.kn].clone().invert().multiply(footW); TW[L.ft] = footW;
        }
      }
      for (const n of outN) { const q = TL[n]; oq[n].set([q.x, q.y, q.z, q.w], f * 4); }
      if (op) op.set([hl.x, hl.y, hl.z], f * 3);
    }
    const tracks = [];
    for (const n of outN) tracks.push(new THREE.QuaternionKeyframeTrack(n + '.quaternion', times, oq[n]));
    if (op) tracks.push(new THREE.VectorKeyframeTrack(MHIPS + '.position', times, op));
    clips[nm] = new THREE.AnimationClip(nm, c.duration, tracks);
  }
  RTW.ms = Math.round(performance.now() - t0); RTW.hr = hr; RTW.lr = lr;
  return { clips, shared, k: k0, worst: 0, worstN: '', hips: 2 * Math.acos(Math.min(1, Math.abs(D0.w))) * 180 / Math.PI };
}
// /SHIPPED:retargetW

// SHIPPED:ZAP_MOUNT
const ZAP_MOUNT = {
  weapon_root_right: { side: 'Right', q: [.1361, .98742, -.04709, .06534], o: [1.12363, -.13667, -.37014], tip: 'weapon_tip_2', dir: [-1, 0, 0], k: 1.8955 },
  weapon_root_left: { side: 'Left', q: [-.04708, -.06533, .13611, -.98741], o: [.98914, -.30095, .27493], tip: 'weapon_tip', dir: [1, 0, 0], k: 2.5069 } };
// /SHIPPED:ZAP_MOUNT

// SHIPPED:handFrame
function handFrame(hand, side) {
  const ch = nm => hand.children.find(c => c.isBone && c.name.endsWith(side + 'Hand' + nm));
  const m = ch('Middle1'), i = ch('Index1') || (ch('Pinky1') ? m : null), p = ch('Pinky1');     // m1058: no index finger (thumb, middle, pinky -- the alien goblin): the knuckle line is pinky -> middle
  // m978: A MITT (the samurai: one Index chain for all four fingers, and a thumb). Along the fingers is wrist -> mitt; across the
  // knuckles (pinky -> index) is, in the bind T-pose with palms down, the way the body faces (+Z for every rig here).
  // m997: AT BIND, ONCE. +Z was taken through the hand's CURRENT world turn, which is only right in the T-pose: animated, the frame
  // turned with the world instead of with the hand, the weapon's turn changed as he moved, and the Forge's arm solve chased it -- the
  // samurai's launcher pose came out 58-70 deg apart frame to frame ("perpetually spinning"), his blaster idle 154. So it is read off
  // the BIND (the skin's inverse bind for this bone), cached on the bone.
  // m1002: THE CACHE IS A WEAKMAP, NOT `userData`. three copies userData through JSON on every clone, so a cloned rig's hand
  // carried a plain {x,y,z} and `.clone()` threw -- picking a drink up with the katana out crashed the frame. And the search is
  // his own model (never the whole scene), passing over any skin without a usable inverse for this hand.
  const MC = handFrame._mitt || (handFrame._mitt = new WeakMap());
  const mittFwd = () => { if (MC.has(hand)) return MC.get(hand); let r = hand; while (r.parent && !r.parent.isScene) r = r.parent; let bq = null;
    r.traverse(o => { if (bq || !o.isSkinnedMesh || !o.skeleton || !o.skeleton.bones) return; const k = o.skeleton.bones.indexOf(hand), I = k >= 0 && o.skeleton.boneInverses && o.skeleton.boneInverses[k]; if (!I || !I.elements) return;
      bq = new THREE.Quaternion(); new THREE.Matrix4().copy(I).invert().decompose(new THREE.Vector3(), bq, new THREE.Vector3()); });
    if (!bq) { hand.updateWorldMatrix(true, false); bq = hand.getWorldQuaternion(new THREE.Quaternion()); }
    const v = new THREE.Vector3(0, 0, 1).applyQuaternion(bq.invert()); MC.set(hand, v); return v; };
  if (!m && i && !p) { const f = i.position.clone().normalize(), t = mittFwd().clone();
    t.addScaledVector(f, -t.dot(f)).normalize(); return { q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, t, new THREE.Vector3().crossVectors(f, t))), len: i.position.length() }; }
  if (!m || !i || !p) return null;
  const len = m.position.length(), f = m.position.clone().normalize(), t = i.position.clone().sub(p.position);
  t.addScaledVector(f, -t.dot(f)).normalize();
  return { q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, t, new THREE.Vector3().crossVectors(f, t))), len };
}
// /SHIPPED:handFrame

// SHIPPED:mountPlace
function mountPlace(hand, name, m) {
  const Z = ZAP_MOUNT[name], F = Z && hand && handFrame(hand, Z.side); if (!F) return false;
  m.quaternion.copy(F.q).multiply(new THREE.Quaternion(...Z.q)); m.position.set(...Z.o).multiplyScalar(F.len).applyQuaternion(F.q); m.scale.set(1, 1, 1);
  let tip = m.children.find(c => c.name === Z.tip); if (!tip) { tip = new THREE.Object3D(); tip.name = Z.tip; m.add(tip); }
  tip.position.set(...Z.dir).multiplyScalar(Z.k * F.len); tip.quaternion.identity(); m.userData.zapConf = 1;
  return true;
}
// /SHIPPED:mountPlace

// SHIPPED:SOCKET_BASIS
const SOCKET_BASIS = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)));
// /SHIPPED:SOCKET_BASIS

// SHIPPED:socketAuto
function socketAuto(hand, side) {
  const F = hand && handFrame(hand, side), Z = ZAP_MOUNT['weapon_root_' + side.toLowerCase()]; if (!F || !Z) return null;
  return { p: new THREE.Vector3(...Z.o).multiplyScalar(F.len).applyQuaternion(F.q), q: F.q.clone().multiply(SOCKET_BASIS), len: F.len };
}
// /SHIPPED:socketAuto

export { bindPose, retargetW, ZAP_MOUNT, handFrame, mountPlace, SOCKET_BASIS, socketAuto };

// ---- names: one spelling for every Mixamo rig. FBX gives `mixamorig:Hips`, GLTFLoader's sanitiser `mixamorigHips`, Blender's
// glTF `mixamorig_Hips`; a second rig in a scene can be `mixamorig1:`. All become `mixamorig_Hips`, written ON the node, so the
// clips this makes name the same bones the game asks for.
export function canonName(n) { const m = /^mixamorig\d*[:_]?([A-Z].*)$/.exec(n || ''); return m ? 'mixamorig_' + m[1] : n; }
export function rigOf(root) {
  const bones = {}, skinned = [];
  root.traverse(o => { if (o.isSkinnedMesh) skinned.push(o); const c = canonName(o.name); if (c !== o.name) o.name = c;
    if (/^mixamorig_/.test(o.name)) { o.isBone = true; bones[o.name] = o; } });
  return { root, bones, skinned };
}

// ---- THE BODY, read off the skin. Every sampled vertex knows its strongest bone; a vertex whose strongest bone is not part of
// the Mixamo body (a tail, a weapon marker) or is in the profile's `exclude` list never counts as "his lowest point" -- that is
// the whole fix for "lands on his back five feet up because his tail is considered his back".
export function skinInfo(rig, opts = {}) {
  const ex = new Set(opts.exclude || []), step = opts.step || 3, meshes = [];
  let kept = 0, dropped = 0; const exNames = new Set();
  for (const m of rig.skinned) {
    const g = m.geometry, sw = g.attributes.skinWeight, si = g.attributes.skinIndex, n = g.attributes.position.count, idx = [];
    for (let i = 0; i < n; i += step) { let bw = -1, bi = 0;
      for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bi = si.getComponent(i, k); } }
      const b = m.skeleton.bones[bi], nm = b ? b.name : '';
      if (!/^mixamorig_/.test(nm) || ex.has(nm)) { dropped++; exNames.add(nm); continue; }
      idx.push(i); kept++; }
    meshes.push({ m, idx });
  }
  return { meshes, kept, dropped, excluded: [...exNames].filter(Boolean).sort() };
}
const _v = new THREE.Vector3();
export function lowestY(info) {
  let lo = Infinity;
  for (const { m, idx } of info.meshes) { m.skeleton.update();
    for (const i of idx) { _v.fromBufferAttribute(m.geometry.attributes.position, i); m.applyBoneTransform(i, _v); _v.applyMatrix4(m.matrixWorld); if (_v.y < lo) lo = _v.y; } }
  return lo;
}
// the lowest JOINT of a skeleton in world space (the library's Y Bot has no skin, only joints)
export function lowestJoint(bones) { let lo = Infinity; for (const n in bones) { bones[n].getWorldPosition(_v); if (_v.y < lo) lo = _v.y; } return lo; }
// the library body's lowest point: his soles while they are under him, his joints when he is lying on them (a back, a hand)
const _sq = new THREE.Quaternion();
export function lowestSource(src) {
  let lo = lowestJoint(src.rig.bones) - src.restLow;
  for (const s of src.soles || []) { s.b.getWorldPosition(_v); const y = _v.y + s.v.clone().applyQuaternion(s.b.getWorldQuaternion(_sq)).y - src.restLow; if (y < lo) lo = y; }
  return lo;
}

// ---- a target: the model as loaded, measured BEFORE any mixer touches it (a mixer overwrites the bind pose for good)
export function prepTarget(model, opts = {}) {
  model.updateMatrixWorld(true);
  const rig = rigOf(model); model.updateMatrixWorld(true);
  const T = bindPose(rig.bones, model);
  if (!T) throw new Error('no mixamorig_Hips on this character');
  const info = skinInfo(rig, opts);
  const toes = toeAngles(rig.bones, model);
  const hips = rig.bones[MHIPS], hp = hips.getWorldPosition(new THREE.Vector3());
  const restLow = info.kept ? lowestY(info) : 0;
  // one world metre up, said in the hips' parent's space (its scale and turn): how a world lift becomes a hips-track value
  const par = hips.parent, o = par.getWorldPosition(new THREE.Vector3());
  const up = par.worldToLocal(o.clone().add(new THREE.Vector3(0, 1, 0))).sub(par.worldToLocal(o.clone()));
  const mixer = new THREE.AnimationMixer(model);
  // his rest pose, every node, as LOCAL transforms -- `skeleton.pose()` cannot give it back: it treats a root bone's world matrix
  // as its local one, which collapses any rig whose armature carries a scale (the 0.01 most of the cast has)
  // (not what the Forge hangs on him itself -- sockets, mounts, a prop: those keep whatever they were last set to)
  const mine = o => { for (let x = o; x; x = x.parent) if (x.userData.forgeMade || /^forge_/.test(x.name)) return true; return false; };
  const snap = []; model.traverse(o => { if (!mine(o)) snap.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]); });
  const restore = () => { mixer.stopAllAction(); for (const [o, p, q, sc] of snap) { o.position.copy(p); o.quaternion.copy(q); o.scale.copy(sc); } model.updateMatrixWorld(true); };
  return { model, rig, T, info, hipH: hp.y - restLow, restLow, up, mixer, restore, snap, toes };
}
// ---- SOCKETS on his hands (`socket_hand_r` / `_l`, the game's convention -- see `socketAuto`). A rig that already carries one
// keeps it; otherwise it is placed by his hand's own frame, or where his profile says (an adjusted one is marked `forged`, which
// is what the game reads back out of a bake). Made AFTER the rest snapshot, so `restore` never moves them.
export const SOCKETS = { Right: 'socket_hand_r', Left: 'socket_hand_l' };
export function socketsOf(tg, saved) {
  const out = {};
  for (const sd of ['Right', 'Left']) {
    const hand = tg.rig.bones['mixamorig_' + sd + 'Hand']; if (!hand) continue;
    let s = tg.model.getObjectByName(SOCKETS[sd]); const own = !!s && !s.userData.forgeMade;
    if (!s) { s = new THREE.Object3D(); s.name = SOCKETS[sd]; s.userData.forgeMade = 1; hand.add(s); }
    const A = socketAuto(hand, sd), sv = saved && saved[sd];
    if (sv) { s.position.fromArray(sv.p); s.quaternion.fromArray(sv.q); s.userData.forged = 1; }
    else if (!own && A) { s.position.copy(A.p); s.quaternion.copy(A.q); s.userData.forged = 0; }
    out[sd] = { node: s, hand, auto: A, own };
  }
  return out;
}

// ---- a source: one library clip (skeleton only), or a DONOR -- any character with clips of his own (old Zap, an FBX of takes).
// A donor's bind pose is read ONCE, at load, before any mixer has touched him; every clip of his then shares it.
export function prepSource(scene, clip) { return prepDonor(scene, [clip])[0]; }
export function prepDonor(scene, clips) {
  scene.updateMatrixWorld(true);
  const rig = rigOf(scene); scene.updateMatrixWorld(true);
  const S = bindPose(rig.bones, scene);
  if (!S) throw new Error('no mixamorig_Hips in that file');
  const hp = rig.bones[MHIPS].getWorldPosition(new THREE.Vector3()), restLow = lowestJoint(rig.bones);
  const mixer = new THREE.AnimationMixer(scene), toes = toeAngles(rig.bones, scene);
  // HIS SOLES (m939). The library body is a skeleton with no heel: when his heel strikes, his lowest JOINT is the ankle, 8 cm up,
  // and a ground pass that trusted joints lifted the body we carry onto -- *"his feet don't touch the ground"*. So each foot gets
  // three sole points at rest -- the floor under the ankle (heel), the ball and the toe -- held in that bone's own frame, which
  // ride the foot as it rolls.
  const soles = [];
  for (const sd of ['Left', 'Right']) for (const nm of ['Foot', 'ToeBase', 'Toe_End']) { const b = rig.bones['mixamorig_' + sd + nm]; if (!b) continue;
    const p = b.getWorldPosition(new THREE.Vector3()), q = b.getWorldQuaternion(new THREE.Quaternion());
    soles.push({ b, v: new THREE.Vector3(p.x, restLow, p.z).sub(p).applyQuaternion(q.invert()) }); }
  for (const c of clips) for (const t of c.tracks) { const d = t.name.lastIndexOf('.'), c2 = canonName(t.name.slice(0, d)); t.name = c2 + t.name.slice(d); }
  return clips.map(clip => ({ scene, rig, S, clip, hipH: hp.y - restLow, restLow, mixer, soles, toes }));
}

// ---- LAYER 1c, HANDS BY ANATOMY (m957). The carry hands each bone the source's change FROM ITS OWN REST, so two rigs whose hands
// rest differently come out differently in every pose -- old Zap's rest palms face FORWARD, a Mixamo T-pose's face DOWN, and Zoar
// held every gun rolled a quarter turn (*"the rocket launcher spun 90 degrees... as if he's holding it sideways like a gangster"*).
// So per frame the target hand is turned until its ANATOMY matches the source's: the frame read off the knuckles (fingers = wrist ->
// middle knuckle, across = pinky knuckle -> index knuckle, `handFrame`'s own definition) in the world. The twist about the forearm
// is shared -- `HANDALIGN.fore` of it turns the forearm (a pronation), the rest the wrist -- so the wrist does not look broken.
export const HANDALIGN = { fore: .5 };
function anatFrame(B, sd, out = new THREE.Quaternion()) {
  const M = 'mixamorig_' + sd + 'Hand', h = B[M], m = B[M + 'Middle1'], i = B[M + 'Index1'] || B[M + 'Middle1'], p = B[M + 'Pinky1']; if (!h || !m || !i || !p) return null;     // m1058: no index -> pinky -> middle
  const H = h.getWorldPosition(new THREE.Vector3()), f = m.getWorldPosition(new THREE.Vector3()).sub(H).normalize();
  const t = i.getWorldPosition(new THREE.Vector3()).sub(p.getWorldPosition(new THREE.Vector3())); t.addScaledVector(f, -t.dot(f)).normalize();
  return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, t, new THREE.Vector3().crossVectors(f, t)));
}
export function handAlignLayer(tg, src, clip, amt = 1) {
  if (!(amt > 0)) return clip;
  const B = tg.rig.bones, S = src.rig.bones; if (!anatFrame(B, 'Right') || !anatFrame(S, 'Right')) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const names = []; for (const sd of ['Right', 'Left']) names.push('mixamorig_' + sd + 'ForeArm', 'mixamorig_' + sd + 'Hand');
  const out = {}; for (const nm of names) out[nm] = new Float32Array(n * 4);
  src.mixer.stopAllAction(); tg.mixer.stopAllAction(); const sa = src.mixer.clipAction(src.clip); sa.play(); const ta = tg.mixer.clipAction(clip); ta.play();
  const Fs = new THREE.Quaternion(), Ft = new THREE.Quaternion(), C = new THREE.Quaternion(), I = new THREE.Quaternion(), W = new THREE.Quaternion(), tw = new THREE.Quaternion(), a = new THREE.Vector3();
  for (let f = 0; f < n; f++) {
    sa.time = Math.min(src.clip.duration, times[f]); src.mixer.update(0); src.scene.updateMatrixWorld(true);
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    for (const sd of ['Right', 'Left']) {
      const fa = B['mixamorig_' + sd + 'ForeArm'], hd = B['mixamorig_' + sd + 'Hand'];
      if (fa && hd && anatFrame(S, sd, Fs) && anatFrame(B, sd, Ft)) {
        C.copy(Fs).multiply(Ft.invert()); if (amt < 1) C.copy(I).slerp(C, amt);
        const Hw = hd.getWorldQuaternion(new THREE.Quaternion()), want = C.clone().multiply(Hw);
        // the twist of C about the forearm, a share of it on the forearm
        a.copy(hd.getWorldPosition(new THREE.Vector3())).sub(fa.getWorldPosition(new THREE.Vector3())).normalize();
        const d = C.x * a.x + C.y * a.y + C.z * a.z; tw.set(a.x * d, a.y * d, a.z * d, C.w).normalize();
        fa.getWorldQuaternion(W); setWorldQ(fa, I.clone().slerp(tw, HANDALIGN.fore).multiply(W));
        setWorldQ(hd, want);
      }
      for (const nm of ['mixamorig_' + sd + 'ForeArm', 'mixamorig_' + sd + 'Hand']) { const q = B[nm] ? B[nm].quaternion : I; out[nm].set([q.x, q.y, q.z, q.w], f * 4); }
    }
  }
  sa.stop(); ta.stop(); src.mixer.uncacheClip(src.clip); tg.mixer.uncacheClip(clip);
  const nmSet = new Set(Object.keys(out).filter(k => B[k]).map(k => k + '.quaternion'));
  return new THREE.AnimationClip(clip.name, clip.duration, clip.tracks.filter(t => !nmSet.has(t.name)).concat(Object.keys(out).filter(k => B[k]).map(k => new THREE.QuaternionKeyframeTrack(k + '.quaternion', times, out[k]))));
}

// ---- LAYER 1b, COMPOSE: the torso and arms from ANOTHER clip (`up`), the hips and legs from this one. `up` = { src, trim:[a,b],
// from: 'Spine' | 'Spine1' | 'Spine2' | 'Neck' } -- every bone from `from` upward (shoulders, arms, hands, fingers, neck, head)
// comes from the second clip's trimmed piece, carried onto him the same way; the clip lasts as long as that piece, and the legs
// loop under it. A sip from a seated drink over a standing idle; a wave over a walk.
export function composeUpper(tg, clip, up) {
  if (!up || !up.src) return clip;
  const r = retargetW(up.src.S, tg.T, { u: up.src.clip }, tg.rig.bones); if (!r || !r.clips.u) return clip;
  const uc = r.clips.u, a = Math.max(0, +(up.trim && up.trim[0]) || 0), b = Math.min(uc.duration, up.trim && +up.trim[1] > a ? +up.trim[1] : uc.duration), L = Math.max(.05, b - a);
  const top = tg.rig.bones['mixamorig_' + (up.from || 'Spine1')] || tg.rig.bones.mixamorig_Spine1; const upper = new Set();
  if (top) top.traverse(o => { if (o.name) upper.add(o.name); });
  const n = Math.max(2, Math.round(L * 30) + 1), times = new Float32Array(n); for (let f = 0; f < n; f++) times[f] = Math.min(L, f / 30);
  const md = clip.duration || 1, tracks = [], seen = new Set();
  const resample = (tr, t0, loopD) => { const I = tr.createInterpolant(), sz = tr.getValueSize(), v = new Float32Array(n * sz);
    for (let f = 0; f < n; f++) { let t = t0 + times[f]; if (loopD) t = t % loopD; v.set(I.evaluate(Math.min(t, tr.times[tr.times.length - 1])).slice(0, sz), f * sz); }
    return new tr.constructor(tr.name, times.slice(), v); };
  for (const tr of uc.tracks) { const bn = tr.name.slice(0, tr.name.lastIndexOf('.')); if (upper.has(bn) && tr.name.endsWith('.quaternion')) { tracks.push(resample(tr, a, 0)); seen.add(tr.name); } }
  for (const tr of clip.tracks) if (!seen.has(tr.name)) tracks.push(resample(tr, 0, md));
  return new THREE.AnimationClip(clip.name, L, tracks);
}

// ---- LAYER 4, HIS SLIDERS -- whole character, every clip, before the ground (so contact is still right after them).
//   stance  x hip width: each foot moved sideways from the hips' centre line, the leg re-solved (two bones, knee kept in its plane)
//   arms    degrees: both upper arms opened out about his forward axis -- the penguin fix
//   lean    degrees: the spine tipped forward (+) or back about his left axis
//   knees   degrees: each thigh turned about its own hip-to-foot line so the knee swings OUT (+) -- the knock-knee fix (m992,
//           the samurai's run_std knees pointed 8-13 deg inward where Zoar's point 0-5 out); the foot stays where it was and keeps
//           its own turn, so only the knee moves
// Done on the POSED body frame by frame, so it is the same adjustment whatever the clip is doing. +X is his left: forward is
// left x up.
const _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _a = new THREE.Vector3(), _b = new THREE.Vector3();
function setWorldQ(bone, wq) { bone.parent.getWorldQuaternion(_q2); bone.quaternion.copy(_q2.invert().multiply(wq)); bone.updateMatrixWorld(true); }
function legTo(B, up, kn, ft, target, keepEnd = true) {
  const H = B[up].getWorldPosition(new THREE.Vector3()), K = B[kn].getWorldPosition(new THREE.Vector3()), F = B[ft].getWorldPosition(new THREE.Vector3());
  const footW = B[ft].getWorldQuaternion(new THREE.Quaternion());
  const a = K.distanceTo(H), b = F.distanceTo(K), d = target.clone().sub(H), dl = Math.max(1e-6, Math.min(d.length(), (a + b) * .999)), n = d.normalize();
  const x = (a * a - b * b + dl * dl) / (2 * dl), h = Math.sqrt(Math.max(0, a * a - x * x));
  const pole = K.clone().sub(H); pole.addScaledVector(n, -pole.dot(n)); if (pole.lengthSq() < 1e-12) return;
  const K2 = H.clone().addScaledVector(n, x).addScaledVector(pole.normalize(), h), F2 = H.clone().addScaledVector(n, dl);
  const uw = B[up].getWorldQuaternion(new THREE.Quaternion());
  setWorldQ(B[up], _q.setFromUnitVectors(K.clone().sub(H).normalize(), K2.clone().sub(H).normalize()).multiply(uw));
  const Kn = B[kn].getWorldPosition(new THREE.Vector3()), Fn = B[ft].getWorldPosition(new THREE.Vector3()), kw = B[kn].getWorldQuaternion(new THREE.Quaternion());
  setWorldQ(B[kn], _q.setFromUnitVectors(Fn.sub(Kn).normalize(), F2.clone().sub(Kn).normalize()).multiply(kw));
  if (keepEnd) setWorldQ(B[ft], footW);
}
export function adjustLayer(tg, clip, A) {
  const st = +A.stance || 1, arms = (+A.arms || 0) * Math.PI / 180, lean = (+A.lean || 0) * Math.PI / 180, elb = (+A.elbows || 0) * Math.PI / 180, kn = (+A.knees || 0) * Math.PI / 180;
  if (st === 1 && !arms && !lean && !elb && !kn) return clip;
  const B = tg.rig.bones, M = 'mixamorig_', has = n => !!B[M + n];
  const touched = [];
  if (st !== 1 && ['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot'].every(has)) touched.push('LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot');
  if (kn && ['LeftUpLeg', 'LeftFoot', 'RightUpLeg', 'RightFoot'].every(has)) touched.push('LeftUpLeg', 'LeftFoot', 'RightUpLeg', 'RightFoot');
  if (arms && has('LeftArm') && has('RightArm')) touched.push('LeftArm', 'RightArm');
  if (elb && has('LeftForeArm') && has('RightForeArm')) touched.push('LeftForeArm', 'RightForeArm');
  const spine = has('Spine') ? 'Spine' : null; if (lean && spine) touched.push(spine);
  if (!touched.length) return clip;
  const hipTr = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = hipTr.times, n = times.length;
  const out = {}; for (const b of new Set(touched)) out[b] = new Float32Array(n * 4);
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play();
  const UP = new THREE.Vector3(0, 1, 0);
  for (let f = 0; f < n; f++) {
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const lh = B[M + 'LeftUpLeg'].getWorldPosition(new THREE.Vector3()), rh = B[M + 'RightUpLeg'].getWorldPosition(new THREE.Vector3());
    const L = lh.clone().sub(rh); L.y = 0; const hw = L.length(); L.normalize(); const fwd = L.clone().cross(UP).normalize();
    if (lean && spine) { const w = B[M + spine].getWorldQuaternion(new THREE.Quaternion()); setWorldQ(B[M + spine], _q.setFromAxisAngle(L, lean).multiply(w)); }
    if (arms) for (const [side, sg] of [['Left', 1], ['Right', -1]]) { const bn = B[M + side + 'Arm'], w = bn.getWorldQuaternion(new THREE.Quaternion()); setWorldQ(bn, _q.setFromAxisAngle(fwd, sg * arms).multiply(w)); }
    // elbows IN: the forearm turned back toward the body about the same axis -- out at the shoulder, in at the elbow
    if (elb) for (const [side, sg] of [['Left', 1], ['Right', -1]]) { const bn = B[M + side + 'ForeArm'], w = bn.getWorldQuaternion(new THREE.Quaternion()); setWorldQ(bn, _q.setFromAxisAngle(fwd, -sg * elb).multiply(w)); }
    if (st !== 1 && out.LeftUpLeg) {
      const d = (st - 1) * hw / 2;
      for (const [side, sg] of [['Left', 1], ['Right', -1]]) {
        const F = B[M + side + 'Foot'].getWorldPosition(new THREE.Vector3()).addScaledVector(L, sg * d);
        legTo(B, M + side + 'UpLeg', M + side + 'Leg', M + side + 'Foot', F);
      }
    }
    if (kn && out.LeftUpLeg) for (const [side, sg] of [['Left', 1], ['Right', -1]]) {
      const up = B[M + side + 'UpLeg'], kb = B[M + side + 'Leg'], ft = B[M + side + 'Foot'];
      const H = up.getWorldPosition(new THREE.Vector3()), F = ft.getWorldPosition(new THREE.Vector3()), K0 = kb.getWorldPosition(new THREE.Vector3());
      const ax = F.clone().sub(H); if (ax.lengthSq() < 1e-10) continue; ax.normalize();
      const uw = up.getWorldQuaternion(new THREE.Quaternion()), fw = ft.getWorldQuaternion(new THREE.Quaternion()), out0 = L.clone().multiplyScalar(sg);
      setWorldQ(up, _q.setFromAxisAngle(ax, kn).multiply(uw));
      if (kb.getWorldPosition(new THREE.Vector3()).sub(K0).dot(out0) < 0) setWorldQ(up, _q.setFromAxisAngle(ax, -kn).multiply(uw));     // whichever way swings it OUT
      setWorldQ(ft, fw);
    }
    for (const b in out) { const q = B[M + b].quaternion; out[b].set([q.x, q.y, q.z, q.w], f * 4); }
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  const names = new Set(Object.keys(out).map(b => M + b + '.quaternion'));
  const tracks = clip.tracks.filter(t => !names.has(t.name)).concat(Object.keys(out).map(b => new THREE.QuaternionKeyframeTrack(M + b + '.quaternion', times, out[b])));
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- LAYER 5b, HAND POSES -- his fingers from a small set of good hands (relaxed / fist / grip / cup / flat / open / point),
// each taken from a frame of the motion library where that hand is clean (forge/hands.json, chosen by measured finger curl),
// carried onto THIS body like any clip -- so a donor's odd fingers (old Zap's palm-forward hands) never reach him.
// `H` = { Right: { pose, amt }, Left: { pose, amt }, noise: { amt: degrees, hz } }; `poses` = { name: { Right: { bone: q } } }.
// Noise curls each finger in and out about the axis it closes a fist on, every finger on its own phase.
export const FINGERS = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
export function fingerBones(tg, side) { const out = []; for (const f of FINGERS) for (let k = 1; k <= 3; k++) { const n = 'mixamorig_' + side + 'Hand' + f + k; if (tg.rig.bones[n]) out.push(n); } return out; }
export function poseCapture(tg, src, t, side) {
  const r = retargetW(src.S, tg.T, { p: src.clip }, tg.rig.bones); if (!r || !r.clips.p) return null;
  const c = r.clips.p, out = {};
  for (const bn of fingerBones(tg, side)) { const tr = c.tracks.find(x => x.name === bn + '.quaternion'); if (tr) out[bn] = Array.from(tr.createInterpolant().evaluate(Math.min(t, c.duration))); }
  return out;
}
export function handsLayer(tg, clip, H, poses) {
  if (!H || !poses) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times;
  const nz = H.noise || {}, namp = (+nz.amt || 0) * Math.PI / 180, hz = +nz.hz || .6;
  let tracks = clip.tracks.slice(); const A = new THREE.Quaternion(), B = new THREE.Quaternion(), N = new THREE.Quaternion(), ax = new THREE.Vector3();
  for (const sd of ['Right', 'Left']) {
    const h = H[sd] || {}, pose = h.pose && poses[h.pose] && poses[h.pose][sd], amt = h.amt === undefined ? 1 : +h.amt;
    if (!(pose && amt > 0) && !(namp > 0)) continue;
    const fist = poses.fist && poses.fist[sd];
    fingerBones(tg, sd).forEach((bn, i) => {
      const nm = bn + '.quaternion', old = tracks.find(t => t.name === nm), rest = tg.T.rest[bn] || [0, 0, 0, 1];
      const tt = old ? old.times : times, vals = new Float32Array(tt.length * 4);
      // the curl axis, in the bone's parent frame: rest -> fist
      if (fist && fist[bn]) { const D = new THREE.Quaternion().fromArray(fist[bn]).multiply(new THREE.Quaternion().fromArray(rest).invert());
        const sn = Math.sqrt(1 - Math.min(1, D.w * D.w)); ax.set(D.x, D.y, D.z); if (sn > 1e-4) ax.divideScalar(sn); else ax.set(1, 0, 0); if (D.w < 0) ax.negate(); } else ax.set(1, 0, 0);
      const ph = i * 1.7 + (sd === 'Left' ? 2.1 : 0);
      for (let f = 0; f < tt.length; f++) {
        if (old) A.fromArray(old.values, f * 4); else A.fromArray(rest);
        if (pose && pose[bn] && amt > 0) A.slerp(B.fromArray(pose[bn]), Math.min(1, amt));
        if (namp > 0) { const w = Math.sin(6.2832 * hz * tt[f] + ph) * .7 + Math.sin(6.2832 * hz * 2.3 * tt[f] + ph * 1.3) * .3; A.premultiply(N.setFromAxisAngle(ax, namp * w)); }
        vals.set([A.x, A.y, A.z, A.w], f * 4);
      }
      tracks = tracks.filter(t => t !== old); tracks.push(new THREE.QuaternionKeyframeTrack(nm, tt, vals));
    });
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- LAYER 5b', A WRAP (m948): the fingers closed round a CYLINDER the size of the thing held, instead of a captured hand.
// *"His closed fist... his fingers intersect it, and you can see the cup. Open his fist quite a bit so it goes around the cup."*
// `W` = { r } -- the cylinder's radius in HAND LENGTHS (wrist -> middle knuckle, `handFrame`'s len); its axis is the socket's +Z
// (along a handle, out of the thumb side). Where it sits is measured, not typed: on the PALM side of the hand (the side the fist
// closes to), its near surface `palm` hand lengths off the palm (the hand bone and the four knuckles), at the socket's height
// along the fingers. Then finger by finger, joint by joint from the knuckle out, each joint curls along the axis it closes a fist
// on (rest -> `fist`) until ITS segment would touch the cylinder's skin (`fr` hand lengths, a finger's own half-thickness), or
// until it is as curled as the fist. Returns { pose: {bone: q}, c: [x,y,z] the cylinder's centre in the HAND's local space, r }.
export const WRAP = { palm: .14, back: .15, fr: .1, step: 1.5 };
export function wrapPose(tg, side, W, fist) {
  const B = tg.rig.bones, M = 'mixamorig_' + side + 'Hand', hand = B['mixamorig_' + side + 'Hand']; if (!hand || !fist) return null;
  const S = socketAuto(hand, side); if (!S) return null;
  // m954: `W.axis` (hand-local) -- the cup's axis, chosen by the app as straight UP in his carry pose -- instead of the socket's Z
  const Zs = new THREE.Vector3(0, 0, 1).applyQuaternion(S.q), axis = W.axis ? new THREE.Vector3().fromArray(W.axis).normalize() : Zs;
  const Sq = W.axis ? new THREE.Quaternion().setFromUnitVectors(Zs, axis).multiply(S.q) : S.q.clone();
  const len = S.len, R = (+W.r || .5) * len, fr = WRAP.fr * len, Si = Sq.clone().invert();
  const toS = v => v.clone().sub(S.p).applyQuaternion(Si);                                    // hand-local -> socket-local
  const rq = bn => new THREE.Quaternion().fromArray(tg.T.rest[bn] || B[bn].quaternion.toArray());
  // the palm side: the middle finger curled to its fist -- where its tip goes, in the socket's X/Y plane, across the fingers
  const chainPts = (f, Q) => { const pts = [new THREE.Vector3()]; let m = new THREE.Matrix4();
    for (let k = 1; k <= 4; k++) { const bn = M + f + k, b = B[bn]; if (!b) break;
      m = m.clone().multiply(new THREE.Matrix4().compose(b.position, k < 4 ? (Q[bn] || rq(bn)) : new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)));
      pts.push(new THREE.Vector3().setFromMatrixPosition(m)); }
    if (!B[M + f + 4] && pts.length >= 3) { const a = pts[pts.length - 2], b = pts[pts.length - 1]; pts.push(b.clone().add(b.clone().sub(a).multiplyScalar(.8))); }
    return pts.slice(1); };                                                                      // [joint1, joint2, joint3, tip], hand-local
  // the palm normal is the socket's X (Y runs along the fingers, Z along the handle); its SIGN is the way the curled tip went
  // (axis x finger: a positive turn about the knuckle's curl axis carries the finger that way -- measured on the knuckle, not on a tip)
  const mb = M + 'Middle1', mD = fist[mb] && new THREE.Quaternion().fromArray(fist[mb]).multiply(rq(mb).invert()); if (!mD) return null; if (mD.w < 0) mD.set(-mD.x, -mD.y, -mD.z, -mD.w);
  const into = new THREE.Vector3(mD.x, mD.y, mD.z).normalize().cross(B[mb].position.clone().normalize());
  const iS = into.clone().applyQuaternion(Si); iS.z = 0;
  const n = W.axis ? (iS.lengthSq() > 1e-8 ? iS.normalize() : new THREE.Vector3(1, 0, 0)) : new THREE.Vector3(Math.sign(iS.x) || 1, 0, 0);
  const knu = ['Index', 'Middle', 'Ring', 'Pinky'].map(f => chainPts(f, {})[0]).filter(Boolean).map(toS);
  const wr = toS(new THREE.Vector3()), kc = knu.reduce((a, k) => a.add(k), new THREE.Vector3()).multiplyScalar(1 / knu.length);
  let s0 = wr.dot(n); for (const k of knu) s0 = Math.max(s0, k.dot(n));
  // the centre, in the cup's frame (Z = its axis): off the palm by its radius and `palm`, level with the knuckle line less `back`
  // toward the wrist, z 0. (Socket mode: n = +-X, and "along the fingers" is Y -- the m948 arithmetic exactly.)
  const m = new THREE.Vector3(-n.y, n.x, 0), toWr = Math.sign(wr.clone().sub(kc).dot(m)) || -1;
  const cS = n.clone().multiplyScalar(s0 + WRAP.palm * len + R).addScaledVector(m, kc.dot(m) + toWr * WRAP.back * len);
  const pose = {};
  for (const f of FINGERS) {
    const Q = {};
    for (let k = 1; k <= 3; k++) {
      const bn = M + f + k; if (!B[bn]) break;
      const r0 = rq(bn), D = fist[bn] ? new THREE.Quaternion().fromArray(fist[bn]).multiply(r0.clone().invert()) : null; if (!D) break;
      if (D.w < 0) D.set(-D.x, -D.y, -D.z, -D.w);
      const amax = 2 * Math.acos(Math.min(1, D.w)), ax = new THREE.Vector3(D.x, D.y, D.z); if (ax.lengthSq() < 1e-10) break; ax.normalize();
      const gap = a => { Q[bn] = new THREE.Quaternion().setFromAxisAngle(ax, a).multiply(r0); const P = chainPts(f, Q), A = toS(P[k - 1]), Bp = toS(P[k]);
        let g = Infinity; for (let u = .25; u <= 1.001; u += .25) { const x = A.x + (Bp.x - A.x) * u - cS.x, y = A.y + (Bp.y - A.y) * u - cS.y; g = Math.min(g, Math.hypot(x, y) - R - fr); } return g; };
      let a = 0; const st = WRAP.step * Math.PI / 180;
      if (gap(0) > 0) { while (a + st <= amax && gap(a + st) > 0) a += st; }
      gap(a);
    }
    for (const bn in Q) pose[bn] = Q[bn].toArray();
  }
  const c = cS.clone().applyQuaternion(Sq).add(S.p);
  return { pose, c: c.toArray(), r: R, q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis).toArray() };     // q: the cup's +Y onto its axis, hand-local
}

// ---- LAYER 6, THE FK LAYER -- his hand on a bone. `fk` is { boneName: [{ t, q:[x,y,z,w] }, ...] }: at each key, a rotation ADDED
// on top of the clip, in the bone's PARENT frame (so "lift the arm" stays a lift whatever the shoulder is doing). Between keys it
// eases (smoothstep + slerp); before the first and after the last it holds. One key is the whole clip.
export function fkAt(keys, t, out = new THREE.Quaternion()) {
  if (!keys || !keys.length) return out.identity();
  const k = keys; if (t <= k[0].t) return out.fromArray(k[0].q); if (t >= k[k.length - 1].t) return out.fromArray(k[k.length - 1].q);
  let i = 0; while (k[i + 1].t < t) i++;
  const a = k[i], b = k[i + 1], u = (t - a.t) / Math.max(1e-6, b.t - a.t), e = u * u * (3 - 2 * u);
  return out.fromArray(a.q).slerp(_q2.fromArray(b.q), e);
}
export function fkLayer(tg, clip, fk) {
  if (!fk || !Object.keys(fk).length) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, D = new THREE.Quaternion(), L = new THREE.Quaternion();
  let tracks = clip.tracks.slice();
  for (const bn in fk) { const keys = (fk[bn] || []).slice().sort((a, b) => a.t - b.t); if (!keys.length || !tg.rig.bones[bn]) continue;
    const nm = bn + '.quaternion', old = tracks.find(t => t.name === nm), rest = tg.T.rest[bn] || [0, 0, 0, 1];
    const tt = old ? old.times : times, vals = new Float32Array(tt.length * 4);
    for (let f = 0; f < tt.length; f++) {
      if (old) L.fromArray(old.values, f * 4); else L.fromArray(rest);
      fkAt(keys, tt[f], D); L.premultiply(D); vals.set([L.x, L.y, L.z, L.w], f * 4); }
    tracks = tracks.filter(t => t !== old); tracks.push(new THREE.QuaternionKeyframeTrack(nm, tt, vals)); }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- LAYER 5, THE OTHER HAND ON THE PROP. `grip` = { bone: the mount the prop hangs from (weapon_root_right, or the hand),
// M: the prop's placement under it (16 numbers), off: the grip point in the prop's own space, side: 'Left'|'Right', reach 0..1 }.
// Per frame the grip point is found in the world -- it rides the carrying hand, FK and all -- and the other arm is re-solved onto
// it (two bones, the elbow kept in its plane, the hand following its forearm). Reach 0.5 is halfway there.
export function gripLayer(tg, clip, grip) {
  if (!grip || !(+grip.reach > 0)) return clip;
  const mount = tg.model.getObjectByName(grip.bone), sd = grip.side || 'Left', B = tg.rig.bones, M = 'mixamorig_';
  const up = M + sd + 'Arm', kn = M + sd + 'ForeArm', ft = M + sd + 'Hand';
  if (!mount || !B[up] || !B[kn] || !B[ft]) return clip;
  const PM = new THREE.Matrix4().fromArray(grip.M), off = new THREE.Vector3().fromArray(grip.off), reach = Math.min(1, +grip.reach);
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const out = { [up]: new Float32Array(n * 4), [kn]: new Float32Array(n * 4), [ft]: new Float32Array(n * 4) };
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play();
  const W = new THREE.Matrix4(), tgt = new THREE.Vector3(), cur = new THREE.Vector3();
  for (let f = 0; f < n; f++) {
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    tgt.copy(off).applyMatrix4(W.multiplyMatrices(mount.matrixWorld, PM));
    B[ft].getWorldPosition(cur); tgt.lerp(cur, 1 - reach);
    legTo(B, up, kn, ft, tgt, false);
    for (const b in out) { const q = B[b].quaternion; out[b].set([q.x, q.y, q.z, q.w], f * 4); }
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  const tracks = clip.tracks.filter(t => !out[t.name.slice(0, t.name.lastIndexOf('.'))] || !t.name.endsWith('.quaternion')).concat(Object.keys(out).map(b => new THREE.QuaternionKeyframeTrack(b + '.quaternion', times, out[b])));
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- LAYER 1c, TOES STRAIGHT (m941). A generated character is modelled with his feet turned out (the CEO 9 deg, the biker 24),
// the carry keeps HIS rest and the clip turns the feet out again on top -- *"45 degrees on top of 45 degrees, super bowlegged"*.
// Colin fixed it by hand in the mesh before rigging; this does it to the clips: each foot turned back about the vertical by how
// much more his rest toes point out than the library body's do (x `amt`), as a constant in the foot's own frame.
export function toeAngles(bones, model) {
  const out = {}, up = new THREE.Vector3();
  for (const sd of ['Left', 'Right']) { const f = bones['mixamorig_' + sd + 'Foot'], t = bones['mixamorig_' + sd + 'ToeBase']; if (!f || !t) continue;
    const d = t.getWorldPosition(new THREE.Vector3()).sub(f.getWorldPosition(up)); d.y = 0; out[sd] = Math.atan2(d.x, d.z); }
  return out;
}
// `inDeg`: and then both feet turned IN by that many degrees more (a waddling clip -- Dwarf_Walk turns the Y Bot's own feet 28 out)
export function toesLayer(tg, src, clip, amt = 1, inDeg = 0) {
  if ((!(amt > 0) && !inDeg) || !tg.toes || !src.toes) return clip;
  let tracks = clip.tracks.slice();
  for (const sd of ['Left', 'Right']) {
    const bn = 'mixamorig_' + sd + 'Foot', a = tg.toes[sd], b = src.toes[sd]; if (a === undefined || b === undefined || !tg.T.wq[bn]) continue;
    let dA = a - b; dA = Math.atan2(Math.sin(dA), Math.cos(dA));
    const ang = -dA * (amt || 0) - (sd === 'Left' ? 1 : -1) * inDeg * Math.PI / 180; if (Math.abs(ang) < .002) continue;
    const W = tg.T.wq[bn], C = W.clone().invert().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang)).multiply(W);
    const old = tracks.find(t => t.name === bn + '.quaternion'); if (!old) continue;
    const v = old.values.slice(), q = new THREE.Quaternion();
    for (let i = 0; i < v.length; i += 4) { q.fromArray(v, i).multiply(C); v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w; }
    tracks = tracks.map(t => t === old ? new THREE.QuaternionKeyframeTrack(old.name, old.times, v) : t);
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- LAYER 4b, FOOT CLEARANCE (m939). The foot pass keeps the library body's stance in HIP WIDTHS -- and the Y Bot's walk brings
// his feet within 0.28 hip widths of each other, which is fine on thin legs and is crossing feet on a man with thick legs and big
// shoes (*"his feet are too close together, they intersect"*). So THIS body's inner leg and shoe widths are measured off his
// skin at rest (`legWidths`), and whenever the two ankles come closer sideways than the two inner halves plus a margin, both
// feet are eased apart (a smooth max, so it never pops) and the legs re-solved. `amt` 0..1; 0 is the A/B.
export function legWidths(tg) {
  if (tg._legW !== undefined) return tg._legW;
  const B = tg.rig.bones, lu = B.mixamorig_LeftUpLeg, ru = B.mixamorig_RightUpLeg, la = B.mixamorig_LeftFoot, ra = B.mixamorig_RightFoot;
  if (!lu || !ru || !la || !ra || !tg.info.kept) return (tg._legW = null);
  tg.restore(); const L = lu.getWorldPosition(new THREE.Vector3()).sub(ru.getWorldPosition(new THREE.Vector3())); L.y = 0; const hw = L.length(); L.normalize();
  const ax = { Left: la.getWorldPosition(new THREE.Vector3()).dot(L), Right: ra.getWorldPosition(new THREE.Vector3()).dot(L) };
  const inner = { Left: 0, Right: 0 }, re = { Left: /Left(Leg|Foot|ToeBase|Toe_End)$/, Right: /Right(Leg|Foot|ToeBase|Toe_End)$/ }, v = new THREE.Vector3();
  for (const { m, idx } of tg.info.meshes) { m.skeleton.update(); const sw = m.geometry.attributes.skinWeight, si = m.geometry.attributes.skinIndex;
    for (const i of idx) { let bw = -1, bi = 0; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bi = si.getComponent(i, k); } }
      const nm = (m.skeleton.bones[bi] || {}).name || ''; const sd = re.Left.test(nm) ? 'Left' : re.Right.test(nm) ? 'Right' : null; if (!sd) continue;
      v.fromBufferAttribute(m.geometry.attributes.position, i); m.applyBoneTransform(i, v); v.applyMatrix4(m.matrixWorld);
      const lat = v.dot(L), d = sd === 'Left' ? ax.Left - lat : lat - ax.Right; if (d > inner[sd]) inner[sd] = d; } }
  return (tg._legW = { hw, inner, min: inner.Left + inner.Right + hw * .08 });
}
const smax = (x, m, k) => (x + m + Math.sqrt((x - m) * (x - m) + k * k)) / 2;
export function clearLayer(tg, clip, amt = 1) {
  const W = amt > 0 && legWidths(tg); if (!W) return clip;
  const B = tg.rig.bones, M = 'mixamorig_', names = ['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot'];
  if (!names.every(n => B[M + n])) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const out = {}; for (const b of names) out[b] = new Float32Array(n * 4);
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play(); let pushed = 0;
  for (let f = 0; f < n; f++) {
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const L = B[M + 'LeftUpLeg'].getWorldPosition(new THREE.Vector3()).sub(B[M + 'RightUpLeg'].getWorldPosition(new THREE.Vector3())); L.y = 0; L.normalize();
    const lf = B[M + 'LeftFoot'].getWorldPosition(new THREE.Vector3()), rf = B[M + 'RightFoot'].getWorldPosition(new THREE.Vector3()), sep = lf.clone().sub(rf).dot(L);
    const want = sep + (smax(sep, W.min, W.hw * .15) - sep) * amt;
    if (want - sep > 1e-4) { const d = (want - sep) / 2; pushed++;
      legTo(B, M + 'LeftUpLeg', M + 'LeftLeg', M + 'LeftFoot', lf.addScaledVector(L, d)); legTo(B, M + 'RightUpLeg', M + 'RightLeg', M + 'RightFoot', rf.addScaledVector(L, -d)); }
    for (const b of names) { const q = B[M + b].quaternion; out[b].set([q.x, q.y, q.z, q.w], f * 4); }
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  if (!pushed) return clip;
  const nm = new Set(names.map(b => M + b + '.quaternion'));
  return new THREE.AnimationClip(clip.name, clip.duration, clip.tracks.filter(t => !nm.has(t.name)).concat(names.map(b => new THREE.QuaternionKeyframeTrack(M + b + '.quaternion', times, out[b]))));
}

// ---- LAYER 5c, REACH (m947): the hand brings what it holds TO A PLACE ON HIM for a window of the clip -- a drink to his mouth.
// `R` = { side: 'Right', to: 'mouth', t: [a, b] (clip seconds), ease, p? (the hand-local point that lands; default the socket) }. The mouth is measured off his head bone: forward of it and a
// little down, scaled by his head's own size (Head -> HeadTop_End); his SOCKET (where the cup sits) is what lands there, so the arm
// is re-solved for the hand at mouth - (socket - hand). Weight eases in and out over `ease` seconds at the window's edges.
// *"when he goes to drink it, his hand comes up and misses where his lips would be"* -- the clip's sip was a seated Y Bot's.
export function mouthPoint(tg, out = new THREE.Vector3()) {
  const B = tg.rig.bones, hd = B.mixamorig_Head, top = B.mixamorig_HeadTop_End, nk = B.mixamorig_Neck; if (!hd) return null;
  const h = hd.getWorldPosition(new THREE.Vector3()), len = top ? top.getWorldPosition(new THREE.Vector3()).distanceTo(h) : (nk ? h.distanceTo(nk.getWorldPosition(new THREE.Vector3())) * 1.6 : .2);
  const q = hd.getWorldQuaternion(new THREE.Quaternion()), fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(tg.model.getWorldQuaternion(new THREE.Quaternion()));
  // forward = the way HE faces (model +Z), turned by how much the head has turned from rest
  const hr = q.clone().multiply(new THREE.Quaternion().fromArray(tg.T.wq.mixamorig_Head ? tg.T.wq.mixamorig_Head.toArray() : [0, 0, 0, 1]).invert());
  fwd.applyQuaternion(hr); const up = new THREE.Vector3(0, 1, 0).applyQuaternion(hr);
  return out.copy(h).addScaledVector(fwd, len * .55).addScaledVector(up, len * .12);
}
export function reachLayer(tg, clip, R) {
  if (!R || !R.t) return clip;
  const sd = R.side || 'Right', B = tg.rig.bones, M = 'mixamorig_', up = M + sd + 'Arm', kn = M + sd + 'ForeArm', ft = M + sd + 'Hand';
  if (!B[up] || !B[kn] || !B[ft]) return clip;
  const S = socketAuto(B[ft], sd), a = +R.t[0], b = +R.t[1], E = +R.ease || .3;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const out = { [up]: new Float32Array(n * 4), [kn]: new Float32Array(n * 4), [ft]: new Float32Array(n * 4) };
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play();
  const mp = new THREE.Vector3(), hw = new THREE.Vector3(), sw = new THREE.Vector3();
  for (let f = 0; f < n; f++) {
    const t = times[f]; ta.time = t; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const w = t <= a || t >= b ? 0 : Math.min(1, (t - a) / E, (b - t) / E);
    if (w > 0 && mouthPoint(tg, mp)) {
      B[ft].getWorldPosition(hw); sw.copy(R.p ? new THREE.Vector3().fromArray(R.p) : S ? S.p : new THREE.Vector3()).applyMatrix4(B[ft].matrixWorld);
      const want = mp.clone().sub(sw.clone().sub(hw));
      legTo(B, up, kn, ft, hw.clone().lerp(want, w * w * (3 - 2 * w)), false);
    }
    for (const bn in out) { const q = B[bn].quaternion; out[bn].set([q.x, q.y, q.z, q.w], f * 4); }
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  const nm = new Set(Object.keys(out).map(b => b + '.quaternion'));
  return new THREE.AnimationClip(clip.name, clip.duration, clip.tracks.filter(t => !nm.has(t.name)).concat(Object.keys(out).map(b => new THREE.QuaternionKeyframeTrack(b + '.quaternion', times, out[b]))));
}

// ---- LAYER 5d, THE WEAPON DRIVES THE HANDS (m958). *"When transferring animations from one rig to another... the hand would be the
// determining position."* Rotations carry the POSE (so a short-armed man still moves like himself); wherever a hand TOUCHES
// something it must be driven by POSITION. For a weapon clip the thing touched is the weapon, so per frame:
//   1. the DONOR's weapon (its right-hand mount, `ZAP_MOUNT` on his `handFrame`) is read in his CHEST frame -- anatomical: origin
//      between the shoulders, X across them to his left, Y up the spine (hips -> neck), Z forward -- so no bone axis is trusted;
//   2. it is put in the same place in THIS body's chest frame, offsets scaled by his shoulder width (across) and spine (up, fore);
//   3. his right arm is solved (two bones, the elbow kept in its plane) so his right hand holds that mount, hand turned exactly;
//   4. his left hand goes where the donor's left hand is ON THE WEAPON (in the weapon's frame, scaled by the weapon's size on each,
//      which follows hand length -- m794), with a weight that lets go when the donor's left hand leaves it (`WEAPIK.near/far`).
// `W` = { two: 1 } (left hand too) | { two: 0 }. Needs fingers on both rigs (the mount and the frames are measured off them).
// the OTHER way round from q0 to q1 (three's slerp always takes the short one)
function slerpLong(q0, q1, t) {
  const rel = q0.clone().invert().multiply(q1); if (rel.w > 0) { rel.x = -rel.x; rel.y = -rel.y; rel.z = -rel.z; rel.w = -rel.w; }
  const ang = 2 * Math.acos(Math.max(-1, Math.min(1, rel.w))), sn = Math.sqrt(Math.max(1e-12, 1 - rel.w * rel.w));
  const ax = new THREE.Vector3(rel.x / sn, rel.y / sn, rel.z / sn);
  return q0.clone().multiply(new THREE.Quaternion().setFromAxisAngle(ax, ang * t));
}
// m1013: EVERY LAYER POSES THE TARGET FROM THE CLIP, FRESH. three's PropertyMixer only calls `setValue` when a bone's sampled value CHANGED since
// the last update -- so anything a layer wrote onto a bone (an IK, a turn) SURVIVED into the next frame's read wherever the clip held still,
// and the layer then worked on its own previous answer: key 1 of every hand 45 deg off (the wrist layer, m1012), the left hand flipping
// 150-166 deg on the weapon (the weapon layer). After the update, every binding is written again from the value just computed.
function mixNow(mx) {
  mx.update(0); const k = mx._accuIndex;
  for (const b of mx._bindings || []) if (b && b.binding) b.binding.setValue(b.buffer, k * b.valueSize + b.valueSize);
}
// ---- m998: WRISTS OUT. *"His hands have this weird T-Rex thing... they should rotate outward 45 degrees so they're just neutral."* Each
// RELAXED hand (its pose 'relaxed' or none -- never a grip, never a weapon clip) turned about its own forearm-to-hand line, the way
// that brings the thumb FORWARD (palms toward the thighs), frame by frame, `deg` degrees. Profile `adjust.wrists`, "Wrists out".
export function wristLayer(tg, clip, deg, H) {
  const B = tg.rig.bones, M = 'mixamorig_', a = deg * Math.PI / 180;
  const sides = ['Left', 'Right'].filter(sd => B[M + sd + 'Hand'] && B[M + sd + 'ForeArm'] && (!H || !H[sd] || !H[sd].pose || H[sd].pose === 'relaxed'));
  if (!sides.length || !a) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const out = {}; for (const sd of sides) out[sd] = new Float32Array(n * 4);
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play();
  const _f = new THREE.Vector3(), _h = new THREE.Vector3(), _ax = new THREE.Vector3(), _w = new THREE.Quaternion(), _r = new THREE.Quaternion(), fwd = new THREE.Vector3();
  // m1012: THE TURN'S DIRECTION IS DECIDED ONCE PER CLIP, NOT PER FRAME. Per frame, a hand whose two turns bring the thumb about equally
  // forward (a crouch: the cover clips) flipped between them -- the hand jumped 45 deg in one frame, mid-loop, and a launcher on it
  // twitched every cycle (*"every round of the animation the rocket launcher twitches"*). Pass 1 sums the preference over the clip.
  const pref = {}; for (const sd of sides) pref[sd] = 0;
  for (let pass = 0; pass < 2; pass++) for (let f = 0; f < n; f++) {
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const lh = B[M + 'LeftUpLeg'] || B[M + 'LeftArm'], rh = B[M + 'RightUpLeg'] || B[M + 'RightArm'];
    const L = lh.getWorldPosition(new THREE.Vector3()).sub(rh.getWorldPosition(new THREE.Vector3())); L.y = 0; L.normalize(); fwd.crossVectors(L, new THREE.Vector3(0, 1, 0)).normalize();
    for (const sd of sides) {
      const hand = B[M + sd + 'Hand'], fa = B[M + sd + 'ForeArm']; fa.getWorldPosition(_f); hand.getWorldPosition(_h); _ax.subVectors(_h, _f).normalize();
      const th = hand.children.find(c => c.isBone && /Thumb1$/.test(c.name)) || hand.children.find(c => c.isBone && /Index1$/.test(c.name));
      hand.getWorldQuaternion(_w);
      const tip = s => { _r.setFromAxisAngle(_ax, s * a); const q = _r.clone().multiply(_w); return th ? th.position.clone().applyQuaternion(q).dot(fwd) : 0; };
      if (pass === 0) { pref[sd] += tip(1) - tip(-1); continue; }
      const sg = pref[sd] >= 0 ? 1 : -1;     // whichever turn brings the thumb more FORWARD, over the whole clip
      // m1012: AND PUT THE BONE BACK. The mixer does not rewrite a bone whose sampled value is unchanged from the last frame (a clip that
      // holds its first frames still), so the turn written here stayed on it and the next frame turned it AGAIN: key 1 of every clip
      // came out 45 deg off keys 0 and 2 (a twitch on every loop, his launcher in cover).
      const q0 = hand.quaternion.clone();
      setWorldQ(hand, _r.setFromAxisAngle(_ax, sg * a).multiply(_w));
      out[sd].set([hand.quaternion.x, hand.quaternion.y, hand.quaternion.z, hand.quaternion.w], f * 4);
      hand.quaternion.copy(q0);
    }
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  const nm = new Set(sides.map(sd => M + sd + 'Hand.quaternion'));
  return new THREE.AnimationClip(clip.name, clip.duration, clip.tracks.filter(t => !nm.has(t.name)).concat(sides.map(sd => new THREE.QuaternionKeyframeTrack(M + sd + 'Hand.quaternion', times, out[sd]))));
}
export const WEAPIK = { near: 2.5, far: 4, ramp: .2 };     // donor left hand to his weapon, in his hand lengths: on it / off it
// m993: WHERE THE WEAPON IS ANCHORED. `chest` (m794): offsets from between the shoulders, across x shoulder width, up/forward x
// spine -- which carries the DONOR's proportions: Zap's short spine under a big head pushed the launcher a forearm out in front of
// the samurai's face, and Zoar needed a hand-typed `x: .6`. `shoulder` (the default now): offsets from the HOLDING shoulder's
// joint, every axis x ARM LENGTH (upper arm + forearm) -- what decides where a hand can reach is the arm, on any body. `W.anchor`
// picks per clip; `W.x/y/z` still multiply on top.
export const WEAPANCHOR = { def: 'shoulder' };
function armLen(B, side) { const a = B['mixamorig_' + side + 'Arm'], f = B['mixamorig_' + side + 'ForeArm'], h = B['mixamorig_' + side + 'Hand']; if (!a || !f || !h) return 0;
  return a.getWorldPosition(new THREE.Vector3()).distanceTo(f.getWorldPosition(new THREE.Vector3())) + f.getWorldPosition(new THREE.Vector3()).distanceTo(h.getWorldPosition(new THREE.Vector3())); }
function chestFrame(B, outP, outQ) {
  const L = B.mixamorig_LeftArm, R = B.mixamorig_RightArm, H = B.mixamorig_Hips, N = B.mixamorig_Neck; if (!L || !R || !H || !N) return null;
  const l = L.getWorldPosition(new THREE.Vector3()), r = R.getWorldPosition(new THREE.Vector3()), x = l.clone().sub(r), w = x.length(); x.normalize();
  const y = N.getWorldPosition(new THREE.Vector3()).sub(H.getWorldPosition(new THREE.Vector3())), sp = y.length(); y.addScaledVector(x, -y.dot(x)).normalize();
  outP.copy(l).add(r).multiplyScalar(.5); outQ.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, new THREE.Vector3().crossVectors(x, y)));
  return { w, sp };
}
function mountWorld(hand, side, outP, outQ) {     // the weapon mount on this hand, in the world (position, turn); and the hand length
  const F = handFrame(hand, side), Z = ZAP_MOUNT['weapon_root_' + side.toLowerCase()]; if (!F || !Z) return 0;
  const hq = hand.getWorldQuaternion(new THREE.Quaternion()), hs = hand.getWorldScale(new THREE.Vector3()).x;
  const lp = new THREE.Vector3(...Z.o).multiplyScalar(F.len).applyQuaternion(F.q), lq = F.q.clone().multiply(new THREE.Quaternion(...Z.q));
  outP.copy(lp).multiplyScalar(hs).applyQuaternion(hq).add(hand.getWorldPosition(new THREE.Vector3())); outQ.copy(hq).multiply(lq);
  return F.len * hs;
}
export function weapLayer(tg, src, clip, W) {
  if (!W) return clip;
  let lhPrev = null, wPrev = 0;     // m1013: the left hand's last answer and weight, for continuity
  const B = tg.rig.bones, S = src.rig.bones, M = 'mixamorig_';
  if (!B[M + 'RightHand'] || !S[M + 'RightHand'] || !handFrame(B[M + 'RightHand'], 'Right') || !handFrame(S[M + 'RightHand'], 'Right')) return clip;
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  const bones = []; for (const sd of ['Right', 'Left']) for (const b of ['Arm', 'ForeArm', 'Hand']) bones.push(M + sd + b);
  const out = {}; for (const b of bones) out[b] = new Float32Array(n * 4);
  src.mixer.stopAllAction(); tg.mixer.stopAllAction(); const sa = src.mixer.clipAction(src.clip); sa.play(); const ta = tg.mixer.clipAction(clip); ta.play();
  const cdP = new THREE.Vector3(), cdQ = new THREE.Quaternion(), ctP = new THREE.Vector3(), ctQ = new THREE.Quaternion(), wdP = new THREE.Vector3(), wdQ = new THREE.Quaternion();
  const mtP = new THREE.Vector3(), mtQ = new THREE.Quaternion(), I = new THREE.Quaternion();
  for (let f = 0; f < n; f++) {
    sa.time = Math.min(src.clip.duration, times[f]); src.mixer.update(0); src.scene.updateMatrixWorld(true);
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const cd = chestFrame(S, cdP, cdQ), ct = chestFrame(B, ctP, ctQ), hd = mountWorld(S[M + 'RightHand'], 'Right', wdP, wdQ);
    if (cd && ct && hd) {
      // 1-2: the donor's weapon in his chest frame -> this body's chest frame
      const sh = (W.anchor || WEAPANCHOR.def) === 'shoulder', aS = sh ? armLen(S, 'Right') : 0, aT = sh ? armLen(B, 'Right') : 0, useSh = sh && aS > 0 && aT > 0;
      const oS = useSh ? S[M + 'RightArm'].getWorldPosition(new THREE.Vector3()) : cdP, oT = useSh ? B[M + 'RightArm'].getWorldPosition(new THREE.Vector3()) : ctP;
      const cdi = cdQ.clone().invert(), lp = wdP.clone().sub(oS).applyQuaternion(cdi), lq = cdi.clone().multiply(wdQ);
      // m962: `W.x/y/z` multiply the offsets on top of the proportions (*"the space between Zoar's head and his rocket launcher":
      // the across offset follows shoulder WIDTH, and Zap's are narrow under a big head -- on a man with normal shoulders and a small
      // head that put the launcher a head-width out)
      if (useSh) { const k = aT / aS; lp.x *= k * (W.x ?? 1); lp.y *= k * (W.y ?? 1); lp.z *= k * (W.z ?? 1); }
      else { lp.x *= ct.w / cd.w * (W.x ?? 1); lp.y *= ct.sp / cd.sp * (W.y ?? 1); lp.z *= ct.sp / cd.sp * (W.z ?? 1); }
      const wtP = lp.applyQuaternion(ctQ).add(oT), wtQ = ctQ.clone().multiply(lq);
      // the donor's left hand on his weapon (before this body's pose moves), in the weapon's frame
      const lh = S[M + 'LeftHand'], lhP = lh ? lh.getWorldPosition(new THREE.Vector3()) : null, lhQ = lh ? lh.getWorldQuaternion(new THREE.Quaternion()) : null;
      // 3: his right hand: where its mount IS now, and the turn that puts it on the weapon
      const RH = B[M + 'RightHand'], ht = mountWorld(RH, 'Right', mtP, mtQ);
      if (ht) {
        // m997: TURN, REACH, AND TURN AGAIN -- solving the arm swings the hand with it, so the turn set before `legTo` was undone by it:
        // frame 0 (arm far from the answer) came out 70 deg off, frame 1 (arm already there) nearly right, and the samurai's two-key
        // launcher pose flickered between them every frame ("perpetually spinning"). Each pass re-takes the hand's turn and re-solves
        // the reach from where it now is; three passes settle both, and the frames come out the same.
        for (let it = 0; it < 3; it++) {
          mountWorld(RH, 'Right', mtP, mtQ);
          const dq = wtQ.clone().multiply(mtQ.clone().invert()), hq = dq.multiply(RH.getWorldQuaternion(new THREE.Quaternion()));
          setWorldQ(RH, hq); RH.updateMatrixWorld(true); mountWorld(RH, 'Right', mtP, mtQ);
          const want = RH.getWorldPosition(new THREE.Vector3()).add(wtP.clone().sub(mtP));
          legTo(B, M + 'RightArm', M + 'RightForeArm', M + 'RightHand', want, true);
          setWorldQ(RH, hq); RH.updateMatrixWorld(true);
        }
        // 4: the left hand onto the weapon, as the donor's is
        if (W.two && lhP && B[M + 'LeftHand']) {
          const k = ht / hd, wdi = wdQ.clone().invert(), rel = lhP.clone().sub(wdP).applyQuaternion(wdi), relQ = wdi.clone().multiply(lhQ);
          const dist = rel.length() / hd, w0 = 1 - smooth01((dist - WEAPIK.near) / (WEAPIK.far - WEAPIK.near));
          // m1013: THE WEIGHT MAY ONLY MOVE SO FAST. The donor's hand reached the weapon across the whole near/far band in ONE frame
          // (Zap's `weapon_swap` frame 27: w 0 -> .965), and his left hand snapped 167 deg onto it. Now it takes `WEAPIK.ramp` s on / off.
          const dtk = f ? Math.max(1e-3, times[f] - times[f - 1]) : 1, dw = dtk / WEAPIK.ramp, w = f ? Math.max(wPrev - dw, Math.min(wPrev + dw, w0)) : w0; wPrev = w;
          if (w > 0) {
            const tP = rel.multiplyScalar(k).applyQuaternion(wtQ).add(wtP), tQ = wtQ.clone().multiply(relQ), LH = B[M + 'LeftHand'];
            const here = LH.getWorldPosition(new THREE.Vector3()), hq0 = LH.getWorldQuaternion(new THREE.Quaternion());
            legTo(B, M + 'LeftArm', M + 'LeftForeArm', M + 'LeftHand', here.lerp(tP, w), false);
            // m1013: NEAR 180 DEG APART THE SHORT WAY ROUND CHANGES SIDES between two frames and the hand flipped (166 deg in one frame on
            // `weapon_swap`, 150 on `weapon_melee_01`). Kept continuous: if the short arc lands far from last frame's hand, the long arc.
            let rq = hq0.clone().slerp(tQ, w);
            if (lhPrev && rq.angleTo(lhPrev) > 1.2) { const lq = slerpLong(hq0, tQ, w); if (lq.angleTo(lhPrev) < rq.angleTo(lhPrev)) rq = lq; }
            setWorldQ(LH, rq); lhPrev = rq.clone();
          }
        }
      }
    }
    for (const b of bones) { const q = B[b] ? B[b].quaternion : I; out[b].set([q.x, q.y, q.z, q.w], f * 4); }
  }
  sa.stop(); ta.stop(); src.mixer.uncacheClip(src.clip); tg.mixer.uncacheClip(clip);
  const have = bones.filter(b => B[b]), nm = new Set(have.map(b => b + '.quaternion'));
  return new THREE.AnimationClip(clip.name, clip.duration, clip.tracks.filter(t => !nm.has(t.name)).concat(have.map(b => new THREE.QuaternionKeyframeTrack(b + '.quaternion', times, out[b]))));
}
const smooth01 = x => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };

// ---- LAYER 7, CLIP EDITS: trim (seconds in the source) and speed
export function editLayer(clip, E) {
  if (!E) return loopSeam(clip);
  let c = clip;
  // m959: IN PLACE -- a locomotion clip whose hips TRAVEL (the library's `Sprint`: 127 units forward a cycle) runs forward and
  // snaps back every loop in a game that moves the root itself. The hips' straight-line drift from first frame to last is taken
  // out; the bob and the sway stay.
  if (E.inPlace) { const tr = c.tracks.find(t => t.name === MHIPS + '.position');
    if (tr && tr.times.length > 1) { const v = tr.values.slice(), n = tr.times.length, t0 = tr.times[0], T = tr.times[n - 1] - t0 || 1, L = (n - 1) * 3;
      const d = [v[L] - v[0], v[L + 1] - v[1], v[L + 2] - v[2]];
      for (let i = 0; i < n; i++) { const u = (tr.times[i] - t0) / T; for (let k = 0; k < 3; k++) v[i * 3 + k] -= d[k] * u; }
      c = new THREE.AnimationClip(c.name, c.duration, c.tracks.map(t => t === tr ? new THREE.VectorKeyframeTrack(tr.name, tr.times, v) : t)); } } const a = Math.max(0, +(E.trim && E.trim[0]) || 0), b = Math.min(c.duration, E.trim && E.trim[1] > 0 ? +E.trim[1] : c.duration);
  if (a > 0 || b < c.duration) {
    const tracks = c.tracks.map(t => { const ts = t.times, sz = t.getValueSize(), keep = [];
      for (let i = 0; i < ts.length; i++) if (ts[i] >= a - 1e-4 && ts[i] <= b + 1e-4) keep.push(i);
      if (!keep.length) keep.push(0);
      const nt = new Float32Array(keep.length), nv = new Float32Array(keep.length * sz);
      keep.forEach((i, j) => { nt[j] = ts[i] - a; for (let k = 0; k < sz; k++) nv[j * sz + k] = t.values[i * sz + k]; });
      return new t.constructor(t.name, nt, nv); });
    c = new THREE.AnimationClip(c.name, b - a, tracks);
  }
  const sp = +E.speed || 1;
  if (sp !== 1) c = new THREE.AnimationClip(c.name, c.duration / sp, c.tracks.map(t => new t.constructor(t.name, t.times.map(x => x / sp), t.values)));
  return loopSeam(c);
}
// m960: THE DUPLICATE SEAM FRAME. *"Is there a duplicate clip at the end of the run, where the last frame is the same as the first?"*
// There was: a Mixamo loop ends on its first pose again (`run_std` 0.02 deg, `sprint_std` 0.03, against 18 for the frame before),
// so a looping clip holds that pose for two frames every cycle -- a hitch. When EVERY rotation's last key is within `SEAM.deg` of
// its first, the last key goes and the clip is one frame shorter. (A one-shot that ends where it began just loses 1/30 s.)
// m992: WRONG, AND OFF. three.js wraps a loop's TIME: with that closing key the wrap lands on the same pose (seamless); cut, the
// last-to-first step happens in zero time -- a skipped frame every cycle, the pop he saw on the samurai's run. `on` 0 keeps the key;
// the game now CLOSES any loop that lacks it (`clipSeam`).
export const SEAM = { deg: .5, on: 0 };
export function loopSeam(c) {
  if (!SEAM.on) return c;
  // the BODY decides (fingers carry the hand layer's noise, which is not periodic, so they never close the loop); every track is cut
  const rot = c.tracks.filter(t => t.name.endsWith('.quaternion') && t.times.length > 2 && !/Hand(Thumb|Index|Middle|Ring|Pinky)/.test(t.name)); if (!rot.length) return c;
  const n = rot[0].times.length; if (rot.some(t => t.times.length !== n)) return c;
  const lim = Math.cos(SEAM.deg * Math.PI / 360);
  for (const t of rot) { const v = t.values, L = (n - 1) * 4; if (Math.abs(v[0] * v[L] + v[1] * v[L + 1] + v[2] * v[L + 2] + v[3] * v[L + 3]) < lim) return c; }
  const T = rot[0].times, end = T[n - 2];
  return new THREE.AnimationClip(c.name, end, c.tracks.map(t => { if (t.times.length !== n) return t; const sz = t.getValueSize();
    return new t.constructor(t.name, t.times.slice(0, n - 1), t.values.slice(0, (n - 1) * sz)); }));
}

// ---- LAYER 3, GROUND CONTACT. Per frame: how far the library body's lowest joint is above where it is standing at rest, scaled
// by hip height, is how far THIS body's lowest skin point should be above the floor. The difference lifts or drops the hips.
// It catches a stride that floats, a back that lies on a tail, a crouch that sinks -- and leaves a jump a jump, because the
// library body is off the ground too. `amt` 0..1 is the A/B.
export const GROUND = { stand: .6 };
export function lowestFeetSource(src) {
  let lo = Infinity;
  for (const s of src.soles || []) { s.b.getWorldPosition(_v); const y = _v.y + s.v.clone().applyQuaternion(s.b.getWorldQuaternion(_sq)).y - src.restLow; if (y < lo) lo = y; }
  for (const sd of ['Left', 'Right']) for (const nm of ['Foot', 'ToeBase', 'Toe_End']) { const b = src.rig.bones['mixamorig_' + sd + nm]; if (b) { const y = b.getWorldPosition(_v).y - src.restLow; if (y < lo) lo = y; } }
  return lo === Infinity ? lowestSource(src) : lo;
}
export function groundLayer(tg, src, clip, amt = 1) {
  if (tg.info.kept) footVerts(tg);
  const hipTr = clip.tracks.find(t => t.name === MHIPS + '.position');
  if (!hipTr || !tg.info.kept || amt <= 0) return { clip, max: 0, mean: 0 };
  const k = tg.hipH / (src.hipH || 1), times = hipTr.times, n = times.length, off = new Float32Array(n);
  src.mixer.stopAllAction(); tg.mixer.stopAllAction();     // nothing else may blend into what is measured
  const sa = src.mixer.clipAction(src.clip); sa.play();
  const ta = tg.mixer.clipAction(clip); ta.play();
  for (let f = 0; f < n; f++) {
    sa.time = Math.min(src.clip.duration, times[f]); src.mixer.update(0); src.scene.updateMatrixWorld(true);
    // m954: STANDING, ONLY HIS FEET COUNT. *"When he bends down to get it his feet lift off the ground for a second."* Bending to
    // the floor, his HAND was his lowest point -- below his soles -- and this lifted his whole body to put the hand on the floor.
    // So while the source's hips are above `GROUND.stand` of its hip height, both bodies are measured by their feet alone (the
    // library body's sole points and foot joints, his feet's skin); lying down, falling, getting up: the whole body as before.
    const up = src.rig.bones[MHIPS].getWorldPosition(_v).y - src.restLow > GROUND.stand * src.hipH && tg.feetIdx;
    const want = tg.restLow + Math.max(0, up ? lowestFeetSource(src) : lowestSource(src)) * k;
    ta.time = times[f]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
    const fl = up ? Math.min(lowestOf(tg.feetIdx.Left || []), lowestOf(tg.feetIdx.Right || [])) : Infinity;
    off[f] = (want - (isFinite(fl) ? fl : lowestY(tg.info))) * amt;
  }
  sa.stop(); ta.stop(); src.mixer.uncacheClip(src.clip); tg.mixer.uncacheClip(clip);
  // a 3-tap smooth: the lowest point can hop between two vertices from one frame to the next
  const sm = off.map((v, f) => (off[Math.max(0, f - 1)] + 2 * v + off[Math.min(n - 1, f + 1)]) / 4);
  const vals = hipTr.values.slice(); let max = 0, sum = 0;
  for (let f = 0; f < n; f++) { vals[f * 3] += tg.up.x * sm[f]; vals[f * 3 + 1] += tg.up.y * sm[f]; vals[f * 3 + 2] += tg.up.z * sm[f]; max = Math.max(max, Math.abs(sm[f])); sum += Math.abs(sm[f]); }
  const tracks = clip.tracks.map(t => t === hipTr ? new THREE.VectorKeyframeTrack(t.name, times, vals) : t);
  return { clip: new THREE.AnimationClip(clip.name, clip.duration, tracks), max, mean: sum / n };
}

// ---- LAYER 4c, THE SOLE (m949): a stiff shoe does not dig into the floor. *"Heel, and then when it goes to toe, it lifts his heel up
// to the height of his toe... then drops that down again."* Measured from the side (ankle / ball height per frame, % of hip height):
// in the library walk the toes BEND at toe-off and the tip stays down; the CEO's long shoe is stiff, so the same foot pitch drove
// its tip up to 15% of his hip height through the floor, and the GROUND layer lifted his whole body out of it -- the planted foot
// with it. So per frame, a foot pitched further forward than at rest whose own skin is below his rest floor is turned back toward
// flat about the ankle, just far enough (bisection) that it is not. 3-tap smoothed. `amt` 0..1; 0 is the A/B.
export function soleLayer(tg, clip, amt = 1) {
  if (!(amt > 0) || !tg.info.kept) return clip;
  const B = tg.rig.bones, M = 'mixamorig_'; footVerts(tg);
  const v = new THREE.Vector3(), low = L => lowestOf(L, v);
  const ref = clip.tracks.find(t => t.name === MHIPS + '.position') || clip.tracks[0], times = ref.times, n = times.length;
  return soleRun(tg, clip, amt, B, M, low, times, n);
}
// his FEET's skin (each vertex's strongest bone a Foot / ToeBase / Toe_End), per side, measured once
export function footVerts(tg) {
  const M = 'mixamorig_';
  if (!tg.feetIdx) { tg.feetIdx = {};
    for (const sd of ['Left', 'Right']) { const want = new Set([M + sd + 'Foot', M + sd + 'ToeBase', M + sd + 'Toe_End']), L = [];
      for (const { m, idx } of tg.info.meshes) { const sw = m.geometry.attributes.skinWeight, si = m.geometry.attributes.skinIndex, ids = [];
        for (const i of idx) { let bw = -1, bi = 0; for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bi = si.getComponent(i, k); } }
          const b = m.skeleton.bones[bi]; if (b && want.has(b.name)) ids.push(i); }
        if (ids.length) L.push({ m, ids }); }
      tg.feetIdx[sd] = L; } }
  return tg.feetIdx;
}
export function lowestOf(L, v = new THREE.Vector3()) { let lo = Infinity; for (const { m, ids } of L) { m.skeleton.update(); for (const i of ids) { v.fromBufferAttribute(m.geometry.attributes.position, i); m.applyBoneTransform(i, v); v.applyMatrix4(m.matrixWorld); if (v.y < lo) lo = v.y; } } return lo; }
function soleRun(tg, clip, amt, B, M, low, times, n) {
  tg.mixer.stopAllAction(); const ta = tg.mixer.clipAction(clip); ta.play();
  const tracks = clip.tracks.slice(), a = new THREE.Vector3(), b = new THREE.Vector3(), f = new THREE.Vector3(), g = new THREE.Vector3(), I = new THREE.Quaternion(), qt = new THREE.Quaternion();
  for (const sd of ['Left', 'Right']) {
    const ft = B[M + sd + 'Foot'], tb = B[M + sd + 'ToeBase'], L = tg.feetIdx[sd], nm = M + sd + 'Foot.quaternion', old = tracks.find(t => t.name === nm);
    if (!ft || !tb || !L.length || !tg.T.wq[ft.name] || !old || old.times.length !== n) continue;
    const rs = tb.position.clone().applyQuaternion(tg.T.wq[ft.name]).normalize().y, hz = Math.sqrt(Math.max(0, 1 - rs * rs));     // his foot's slope at rest
    const fix = new Float32Array(n), W = [], Pi = [], QF = [];
    for (let k = 0; k < n; k++) {
      ta.time = times[k]; mixNow(tg.mixer); tg.model.updateMatrixWorld(true);
      ft.getWorldPosition(a); tb.getWorldPosition(b); f.copy(b).sub(a).normalize();
      const h = Math.hypot(f.x, f.z) || 1; g.set(f.x / h * hz, rs, f.z / h * hz);
      W[k] = ft.getWorldQuaternion(new THREE.Quaternion()); Pi[k] = ft.parent.getWorldQuaternion(new THREE.Quaternion()).invert(); QF[k] = new THREE.Quaternion().setFromUnitVectors(f, g);
      if (f.y >= rs - .02 || low(L) >= tg.restLow - 1e-4) continue;                 // not pitched forward, or not under the floor
      const ok = t => { qt.copy(I).slerp(QF[k], t).multiply(W[k]); ft.quaternion.copy(Pi[k]).multiply(qt); ft.updateMatrixWorld(true); return low(L) >= tg.restLow - 1e-4; };
      let lo = 0, hi = 1; if (ok(1)) { for (let it = 0; it < 9; it++) { const m = (lo + hi) / 2; if (ok(m)) hi = m; else lo = m; } } fix[k] = hi;
    }
    const vals = old.values.slice();
    for (let k = 0; k < n; k++) { const t = Math.max(fix[k], (fix[Math.max(0, k - 1)] + 2 * fix[k] + fix[Math.min(n - 1, k + 1)]) / 4) * amt; if (!(t > 0)) continue;
      qt.copy(I).slerp(QF[k], Math.min(1, t)).multiply(W[k]); const ql = Pi[k].clone().multiply(qt); vals.set([ql.x, ql.y, ql.z, ql.w], k * 4); }
    tracks[tracks.indexOf(old)] = new THREE.QuaternionKeyframeTrack(nm, old.times, vals);
  }
  ta.stop(); tg.mixer.uncacheClip(clip);
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// ---- one clip through every layer. `P` is the profile (see forge.html); returns the clip and what each layer did.
export function carry(tg, src, role, P, opt) {
  RTW.feet = P.layers.feet ? 1 : 0;
  const r = retargetW(src.S, tg.T, { [role]: src.clip }, tg.rig.bones);
  if (!r || !r.clips[role]) throw new Error('nothing carried for ' + role);
  let clip = r.clips[role]; const rep = { hipW: RTW.hr, leg: RTW.lr, ms: RTW.ms };
  if (P.layers.handAlign) clip = handAlignLayer(tg, src, clip, +P.layers.handAlign);
  if (opt && opt.upper) clip = composeUpper(tg, clip, opt.upper);
  clip = toesLayer(tg, src, clip, P.layers.toes === undefined ? 1 : +P.layers.toes, (P.adjust && +P.adjust.toeIn) || 0);
  if (P.adjust) clip = adjustLayer(tg, clip, P.adjust);
  if (P.adjust && +P.adjust.wrists && !(opt && opt.weap)) clip = wristLayer(tg, clip, +P.adjust.wrists, opt && opt.hands && opt.hands.H);
  if (P.layers.clear !== 0) clip = clearLayer(tg, clip, P.layers.clear === undefined ? 1 : +P.layers.clear);
  if (opt && opt.weap) clip = weapLayer(tg, src, clip, opt.weap);
  if (opt && opt.hands) clip = handsLayer(tg, clip, opt.hands.H, opt.hands.poses);
  if (opt && opt.fk) clip = fkLayer(tg, clip, opt.fk);
  if (opt && opt.grip) clip = gripLayer(tg, clip, opt.grip);
  if (opt && opt.reach) clip = reachLayer(tg, clip, opt.reach);
  if (P.layers.sole !== 0) clip = soleLayer(tg, clip, P.layers.sole === undefined ? 1 : +P.layers.sole);
  if (P.layers.ground) { const g = groundLayer(tg, src, clip, P.layers.ground); clip = g.clip; rep.groundMax = g.max; rep.groundMean = g.mean; }
  return { clip, rep };
}

// ---- a profile, empty
export function newProfile(file) {
  return { v: 1, character: file || '', exclude: [], layers: { feet: 1, ground: 1 }, adjust: { stance: 1, arms: 0, lean: 0 }, clips: [] };
}
