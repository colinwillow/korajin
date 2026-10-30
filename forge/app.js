// FORGE -- the app around forge/core.js. Load a body, pick library clips into his pack, preview them through the layers, save
// his profile, export. `window.forge` is the same thing for the command line (tools/forge.cjs).
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { DRACOLoader } from '../vendor/DRACOLoader.js';
import { FBXLoader } from '../vendor/FBXLoader.js';
import { GLTFExporter } from '../vendor/GLTFExporter.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { TransformControls } from '../vendor/TransformControls.js';
import { clone as skClone } from '../vendor/SkeletonUtils.js';
import * as F from './core.js';

const $ = id => document.getElementById(id);
const Q = new URLSearchParams(location.search);
const CHARS = [
  ['zap_02', 'Zap 2'], ['zap', 'Zap (old)'], ['hick_skinny', 'Hick'], ['hobo_01', 'Hobo'], ['clancy', 'Clancy'],
  ['alien_warrior', 'Warrior'], ['ceo_alien', 'CEO (alien)'], ['ceo_human', 'CEO (human)'], ['alien_rollerskate_blue', 'Roller girl'],
  ['alien_female_purple', 'Purple alien'], ['alien_grey_medium', 'Grey'], ['fat_biker_02', 'Biker'], ['contruction_worker', 'Construction worker'],
  ['dummy_officer', 'Officer'], ['firefighter', 'Firefighter'], ['jack', 'Jack'], ['moussa', 'Moussa'],
];

// ---------------------------------------------------------------- the stage
const view = $('view');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.outputColorSpace = THREE.SRGBColorSpace;
view.prepend(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x1a2029);
const cam = new THREE.PerspectiveCamera(40, 1, .05, 200); cam.position.set(2.2, 1.4, 3.4);
const orbit = new OrbitControls(cam, renderer.domElement); orbit.target.set(0, .8, 0); orbit.enableDamping = true;
scene.add(new THREE.HemisphereLight(0xdde8ff, 0x3a3328, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(3, 6, 4); scene.add(sun);
const grid = new THREE.GridHelper(20, 40, 0x3cd6ff, 0x2a323d); grid.material.opacity = .5; grid.material.transparent = true; scene.add(grid);
const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x0c0f13, transparent: true, opacity: .5 }));
floor.position.y = -.002; scene.add(floor);
function size() { const r = view.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); cam.aspect = r.width / Math.max(1, r.height); cam.updateProjectionMatrix(); }
new ResizeObserver(size).observe(view); size();

// ---------------------------------------------------------------- loaders
const draco = new DRACOLoader().setDecoderPath('./vendor/draco/');
const gl = new GLTFLoader().setDRACOLoader(draco);
const parseGLB = buf => new Promise((ok, no) => gl.parse(buf, '', ok, no));
async function loadCharBuf(buf, name) {
  if (/\.fbx$/i.test(name)) { const g = new FBXLoader().parse(buf, ''); return { scene: g, animations: g.animations || [] }; }
  return parseGLB(buf);
}

// ---------------------------------------------------------------- state
const ST = { tg: null, file: '', P: F.newProfile(), cur: null, act: null, ghost: null, ghostMix: null, playing: true, speed: 1, srcCache: new Map(), wraps: {} };
const busy = on => { $('busy').style.display = on ? 'flex' : 'none'; };
const chip = t => { $('chip').textContent = t; };
const profKey = f => 'forge.profile.' + f;

// fit a loaded body: stand it on the floor at the origin, metres. An FBX from Mixamo arrives in centimetres.
function normalise(model) {
  model.updateMatrixWorld(true);
  const b = new THREE.Box3(); const v = new THREE.Vector3();
  model.traverse(o => { if (o.isSkinnedMesh) { o.skeleton.update(); const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i += 7) { v.fromBufferAttribute(p, i); o.applyBoneTransform(i, v); v.applyMatrix4(o.matrixWorld); b.expandByPoint(v); } } });
  if (b.isEmpty()) return;
  const h = b.max.y - b.min.y; if (h > 20) model.scale.multiplyScalar(.01);
}

async function setCharacter(buf, name) {
  busy(true);
  try {
    const g = await loadCharBuf(buf, name);
    if (ST.tg) { scene.remove(ST.tg.model); ST.tg.mixer.stopAllAction(); }
    const model = g.scene; normalise(model);
    model.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { if (m) m.side = THREE.FrontSide; }); } });
    ST.file = name;
    const saved = localStorage.getItem(profKey(name));
    ST.P = saved ? JSON.parse(saved) : F.newProfile(name);
    ST.tg = F.prepTarget(model, { exclude: ST.P.exclude }); ST.sock = F.socketsOf(ST.tg, ST.P.sockets); sockAxes();
    ST.own = g.animations || [];
    scene.add(model);
    const H = ST.tg.hipH * 2.2; orbit.target.set(-H * .45, H * .45, 0); cam.position.set(H * .6, H * .6, H * 3.1);
    $('who').textContent = name.split('/').pop();
    $('lFeet').checked = !!ST.P.layers.feet; $('lGround').value = ST.P.layers.ground; $('lGroundV').textContent = (+ST.P.layers.ground).toFixed(2);
    $('lClear').value = ST.P.layers.clear ?? 1; $('lClearV').textContent = (+$('lClear').value).toFixed(2);
    const I = ST.tg.info, nb = Object.keys(ST.tg.rig.bones).length;
    $('charNote').innerHTML = `${nb} Mixamo bones · hips ${ST.tg.hipH.toFixed(2)} m above his soles · ${ST.tg.rig.skinned.length} skinned mesh${ST.tg.rig.skinned.length === 1 ? '' : 'es'}` + (I.kept ? '' : ' · <span class="bad">no skin found: ground contact is off</span>');
    $('exNote').textContent = I.excluded.length ? I.excluded.join(', ') + ` (${I.dropped} sampled vertices)` : 'nothing: every vertex belongs to the body';
    renderPack(); dotsBuild(); boneMenu();
    ST.handPoses = null; ST.wraps = {}; ST.wrapAx = {}; syncHands();
    syncSliders(); if (ST.P.clips.length) await previewEntry(ST.P.clips[0]); else chip('pick clips in LIBRARY');
  } catch (e) { console.error(e); chip('could not load ' + name + ': ' + e.message); }
  busy(false);
}

// ---------------------------------------------------------------- the library: a GitHub repo (token), a local folder, or a URL
const LIB = { kind: '', base: '', files: null, gh: null, index: null };
async function libGet(name, as = 'buf') {
  let r;
  if (LIB.kind === 'url') r = await fetch(LIB.base + name);
  else if (LIB.kind === 'dir') { const f = LIB.files.get(name); if (!f) throw new Error(name + ' is not in that folder'); return as === 'json' ? JSON.parse(await f.text()) : f.arrayBuffer(); }
  else if (LIB.kind === 'gh') {
    const url = `https://api.github.com/repos/${LIB.gh.repo}/contents/${LIB.gh.path}/${encodeURIComponent(name)}`;
    let c = null; try { c = await caches.open('forge-lib'); const hit = await c.match(url); if (hit) return as === 'json' ? hit.json() : hit.arrayBuffer(); } catch (e) { c = null; }
    r = await fetch(url, { headers: { Authorization: 'Bearer ' + LIB.gh.tok, Accept: 'application/vnd.github.raw' } });
    if (r.ok && c) try { await c.put(url, r.clone()); } catch (e) {}
  } else throw new Error('no library');
  if (!r.ok) throw new Error(r.status + ' for ' + name);
  return as === 'json' ? r.json() : r.arrayBuffer();
}
// the repo itself, for what lives beside the clips: library/mine (his own animation files) and library/packs. Writing needs the
// token to have Contents: Read AND write on this one repo.
const ghRoot = () => LIB.gh.path.replace(/\/[^/]*$/, '');
async function ghReq(method, path, body, raw) {
  const r = await fetch(`https://api.github.com/repos/${LIB.gh.repo}/contents/${path}`, { method, headers: { Authorization: 'Bearer ' + LIB.gh.tok, Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json' }, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) { const t = await r.text(); throw new Error(r.status === 403 || r.status === 404 && method === 'PUT' ? 'the token cannot write: give it Contents "Read and write" on ' + LIB.gh.repo : r.status + ' ' + t.slice(0, 120)); }
  return raw ? r.arrayBuffer() : r.json();
}
async function ghList(dir) { if (LIB.kind !== 'gh') return []; try { const j = await ghReq('GET', ghRoot() + '/' + dir); return Array.isArray(j) ? j.filter(x => x.type === 'file').map(x => x.name) : []; } catch (e) { return []; } }
const b64 = buf => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); };
async function ghPut(path, buf, msg) {
  let sha; try { const j = await ghReq('GET', path); sha = j.sha; } catch (e) {}
  return ghReq('PUT', path, { message: msg, content: b64(buf), sha });
}
async function libConnect(kind, opt) {
  LIB.kind = kind; Object.assign(LIB, opt);
  $('libNote').textContent = 'connecting…';
  try {
    const I = await libGet('_index.json', 'json'); LIB.index = I.motions || I;
    $('libNote').innerHTML = `<span class="ok">${LIB.index.length} motions</span> · ` + (kind === 'gh' ? LIB.gh.repo + '/' + LIB.gh.path : kind === 'dir' ? 'local folder' : LIB.base);
    $('libSetup').hidden = true; $('libBrowse').hidden = false; buildTags(); search();
    if (kind === 'gh') localStorage.setItem('forge.gh', JSON.stringify(LIB.gh));
    donorMenu(); packMenu();
    return true;
  } catch (e) { $('libNote').innerHTML = '<span class="bad">' + e.message + '</span>'; LIB.kind = ''; return false; }
}
let tagOn = '';
function buildTags() {
  const n = {}; for (const m of LIB.index) for (const t of m.tags || []) n[t] = (n[t] || 0) + 1;
  const top = Object.keys(n).sort((a, b) => n[b] - n[a]).slice(0, 24);
  $('tagRow').innerHTML = top.map(t => `<button class="tag" data-t="${t}">${t} ${n[t]}</button>`).join('');
  $('tagRow').onclick = e => { const t = e.target.dataset.t; if (t === undefined) return; tagOn = tagOn === t ? '' : t; [...$('tagRow').children].forEach(b => b.classList.toggle('on', b.dataset.t === tagOn)); search(); };
}
function search() {
  const q = $('q').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = LIB.index.filter(m => (!tagOn || (m.tags || []).includes(tagOn)) && q.every(w => (m.name + ' ' + (m.description || '') + ' ' + (m.tags || []).join(' ') + ' ' + (m.props || []).join(' ')).toLowerCase().includes(w)));
  $('hits').textContent = hits.length + ' match' + (hits.length === 1 ? '' : 'es') + (hits.length > 150 ? ' (first 150)' : '');
  // a shared name ("Idle" x18) is told apart by Mixamo's own description and the length: that is what is on the row
  $('libList').innerHTML = hits.slice(0, 150).map(m => `<div class="item" data-s="${m.stem}"><div class="nm">${m.name} <small>${m.description || ''} · ${(+m.duration).toFixed(1)} s${m.loopDiff < 15 ? ' · loops' : ''}</small></div><button class="btn" data-add="${m.stem}">+</button></div>`).join('');
}
$('q').oninput = () => search();
$('libList').onclick = async e => {
  const add = e.target.dataset.add, row = e.target.closest('.item'); if (!row || !ST.tg) return;
  const st = add || row.dataset.s, m = LIB.index.find(x => x.stem === st);
  if (add) { let role = st.toLowerCase(); while (ST.P.clips.some(c => c.role === role)) role += '_2';
    const en = { role, stem: st, name: m.name }; ST.P.clips.push(en); saveProf(); renderPack(); e.target.textContent = '✓';
    [...$('libList').children].forEach(r => r.classList.toggle('on', r === row)); return previewEntry(en); }
  [...$('libList').children].forEach(r => r.classList.toggle('on', r === row));
  await previewStem(st, st);
};
$('ghGo').onclick = () => libConnect('gh', { gh: { repo: $('ghRepo').value.trim(), path: $('ghPath').value.trim().replace(/^\/|\/$/g, ''), tok: $('ghTok').value.trim() } });
$('dirBtn').onclick = () => $('dirIn').click();
$('dirIn').onchange = () => { const m = new Map(); for (const f of $('dirIn').files) m.set(f.name, f); libConnect('dir', { files: m }); };
$('libReset').onclick = () => { $('libSetup').hidden = false; $('libBrowse').hidden = true; localStorage.removeItem('forge.gh'); };

// ---------------------------------------------------------------- donors: any character's own clips (the cast, or an upload)
const DON = { cur: '', list: new Map() };   // name -> [src per clip]
const idb = () => new Promise((ok, no) => { const r = indexedDB.open('forge', 1); r.onupgradeneeded = () => r.result.createObjectStore('files'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const idbPut = async (k, v) => { const db = await idb(); return new Promise(ok => { const t = db.transaction('files', 'readwrite'); t.objectStore('files').put(v, k); t.oncomplete = ok; t.onerror = ok; }); };
const idbGet = async k => { const db = await idb(); return new Promise(ok => { const q = db.transaction('files').objectStore('files').get(k); q.onsuccess = () => ok(q.result); q.onerror = () => ok(null); }); };
const idbKeys = async () => { try { const db = await idb(); return await new Promise(ok => { const q = db.transaction('files').objectStore('files').getAllKeys(); q.onsuccess = () => ok(q.result); q.onerror = () => ok([]); }); } catch (e) { return []; } };
async function donor(name) {
  if (DON.list.has(name)) return DON.list.get(name);
  let buf, file = name;
  if (name.startsWith('idb:')) { buf = await idbGet(name); file = name.slice(4); if (!buf) throw new Error(file + ' is no longer in this browser'); }
  else if (name.startsWith('gh:')) { file = name.slice(3);
    if (LIB.kind === 'url') buf = await (await fetch(new URL('../' + file, location.origin + LIB.base))).arrayBuffer();
    else if (LIB.kind === 'gh') buf = await ghReq('GET', ghRoot() + '/' + file, null, true);
    else throw new Error('connect the library to use ' + file); }
  else buf = await (await fetch(name)).arrayBuffer();
  const g = await loadCharBuf(buf, file);
  const clips = (g.animations || []).filter(c => c.tracks.length && !/CINEMA_4D|^Take 001$|mixamo\.com$/.test(c.name) || (g.animations || []).length === 1);
  if (!clips.length) throw new Error('no animations in ' + file);
  normalise(g.scene);
  const srcs = F.prepDonor(g.scene, clips); srcs.forEach(s => { s.donor = name; });
  DON.list.set(name, srcs); return srcs;
}
async function donorMenu() {
  const up = (await idbKeys()).filter(k => String(k).startsWith('idb:') && !String(k).startsWith('idb:prop:')), mine = (await ghList('mine')).filter(n => /\.(glb|gltf|fbx)$/i.test(n));
  $('donSel').innerHTML = '<option value="">— pick a character to take clips from —</option>' + CHARS.map(([f, n]) => `<option value="models/characters/${f}.glb">${n}</option>`).join('') + up.map(k => `<option value="${k}">${k.slice(4)} (this browser)</option>`).join('') + mine.map(n => `<option value="gh:mine/${n}">${n} (library)</option>`).join('');
  if (DON.cur) $('donSel').value = DON.cur;
}
async function showDonor(name) {
  DON.cur = name; $('donNote').textContent = 'loading…'; $('donList').innerHTML = ''; $('donAll').hidden = true;
  try { const srcs = await donor(name);
    $('donNote').textContent = srcs.length + ' clips';
    $('donList').innerHTML = srcs.map((s, i) => `<div class="item" data-i="${i}"><div class="nm">${s.clip.name} <small>${s.clip.duration.toFixed(2)} s</small></div><button class="btn" data-add="${i}">+</button></div>`).join('');
    $('donAll').hidden = false; $('donPush').hidden = !(name.startsWith('idb:') && LIB.kind === 'gh');
  } catch (e) { $('donNote').innerHTML = '<span class="bad">' + e.message + '</span>'; }
}
function addEntry(en) { let r = en.role; while (ST.P.clips.some(c => c.role === r)) r += '_2'; en.role = r; ST.P.clips.push(en); }
$('donPush').onclick = async () => {
  const k = DON.cur; if (!k.startsWith('idb:')) return; const f = k.slice(4); $('donNote').textContent = 'sending ' + f + ' to the library…';
  try { await ghPut(ghRoot() + '/mine/' + f, await idbGet(k), 'forge: add ' + f + ' to the library');
    const g = 'gh:mine/' + f; for (const c of ST.P.clips) if (c.donor === k) c.donor = g; saveProf(); DON.list.set(g, DON.list.get(k)); DON.cur = g; await donorMenu(); $('donSel').value = g;
    $('donNote').innerHTML = '<span class="ok">' + f + ' is in the library: every device sees it</span>'; $('donPush').hidden = true;
  } catch (e) { $('donNote').innerHTML = '<span class="bad">' + e.message + '</span>'; } };
$('donSel').onchange = () => { if ($('donSel').value) showDonor($('donSel').value); };
$('donFileBtn').onclick = () => $('donFile').click();
$('donFile').onchange = async () => { const f = $('donFile').files[0]; if (!f) return; const k = 'idb:' + f.name; await idbPut(k, await f.arrayBuffer()); DON.list.delete(k); await donorMenu(); $('donSel').value = k; showDonor(k); };
$('donList').onclick = async e => {
  const row = e.target.closest('.item'); if (!row || !ST.tg) return; const srcs = DON.list.get(DON.cur), i = +(e.target.dataset.add ?? row.dataset.i), s = srcs[i];
  const en = { role: s.clip.name, donor: DON.cur, clip: s.clip.name, name: stemOf(DON.cur) + ': ' + s.clip.name };
  if (e.target.dataset.add !== undefined) { addEntry(en); saveProf(); renderPack(); e.target.textContent = '✓'; }
  [...$('donList').children].forEach(r => r.classList.toggle('on', r === row));
  await previewEntry(en);
};
$('donAll').onclick = () => { const srcs = DON.list.get(DON.cur); let n = 0;
  for (const s of srcs) if (!ST.P.clips.some(c => c.donor === DON.cur && c.clip === s.clip.name)) { addEntry({ role: s.clip.name, donor: DON.cur, clip: s.clip.name, name: stemOf(DON.cur) + ': ' + s.clip.name }); n++; }
  saveProf(); renderPack(); $('donNote').textContent = n + ' added to his pack -- flip through them with ◀ ▶'; };
$('srcSw').onclick = e => { const k = e.target.dataset.s; if (!k) return; [...$('srcSw').children].forEach(b => b.classList.toggle('ac', b === e.target)); $('donPane').hidden = k !== 'don'; $('libPane').hidden = k === 'don'; };

// ---------------------------------------------------------------- carrying and previewing
async function source(en) {
  if (en.donor) { const s = (await donor(en.donor)).find(x => x.clip.name === en.clip); if (!s) throw new Error(en.clip + ' is not in ' + en.donor); return s; }
  const stem = en.stem;
  if (ST.srcCache.has(stem)) return ST.srcCache.get(stem);
  const g = await parseGLB(await libGet(stem + '.glb'));
  const s = F.prepSource(g.scene, g.animations[0]); s.stem = stem;
  ST.srcCache.set(stem, s); if (ST.srcCache.size > 40) ST.srcCache.delete(ST.srcCache.keys().next().value);
  return s;
}
async function bake(en) {
  const hands = await handsOf(en);
  let upper = null;
  if (en.upper && en.upper.role) { const ue = ST.P.clips.find(c => c.role === en.upper.role && c !== en); if (ue) upper = { src: await source(ue), trim: ue.edit && ue.edit.trim, from: en.upper.from || 'Spine1' }; }
  // m948: with a wrapped hand, what reaches his mouth is the held thing's TIP (`wrap.tip` radii up its axis -- the straw), not the socket
  let reach = en.reach; const W = en.wrap || ST.P.wrap, wr = reach && ST.wraps[reach.side || 'Right'];
  if (reach && wr && W && W.tip && hands && hands.H[reach.side || 'Right'] && hands.H[reach.side || 'Right'].pose === 'wrap') {
    const hb = ST.tg.rig.bones['mixamorig_' + (reach.side || 'Right') + 'Hand'], A = F.socketAuto(hb, reach.side || 'Right');
    if (A) reach = Object.assign({}, reach, { p: (wr.q ? new THREE.Vector3(0, 1, 0).applyQuaternion(new THREE.Quaternion().fromArray(wr.q)) : new THREE.Vector3(0, 0, 1).applyQuaternion(A.q)).multiplyScalar(W.tip * wr.r).add(new THREE.Vector3().fromArray(wr.c)).toArray() }); }
  const src = await source(en), r = F.carry(ST.tg, src, en.role, ST.P, { fk: en.fk, grip: gripOf(en), hands, upper, reach, weap: en.weap });
  // m959: a clip whose hips travel (root motion) is stripped in place by the edit -- but that travel IS its true speed, so it is
  // kept first, per hip height, and the export writes it beside the clip (`forge_ref_<role>`): the game sizes the playback by it
  if (en.edit && en.edit.inPlace) { const pre = F.editLayer(r.clip, Object.assign({}, en.edit, { inPlace: false })), tr = pre.tracks.find(t => t.name === 'mixamorig_Hips.position');
    if (tr && tr.times.length > 1) { const v = tr.values, L = (tr.times.length - 1) * 3, hp = ST.tg.rig.bones.mixamorig_Hips, ws = hp && hp.parent ? hp.parent.getWorldScale(new THREE.Vector3()).x : 1;
      const dist = Math.hypot(v[L] - v[0], v[L + 2] - v[2]) * ws, dur = tr.times[tr.times.length - 1] - tr.times[0];
      ST.refs = ST.refs || {}; if (dur > 0) ST.refs[en.role] = dist / dur / ST.tg.hipH; } }
  return { src, rep: r.rep, clip: F.editLayer(r.clip, en.edit) };
}
async function previewEntry(en, keepT) {
  if (!ST.tg) return; busy(true);
  try {
    const { src, clip, rep } = await bake(en);
    play(clip, src, en.edit); if (keepT !== undefined) { ST.act.time = Math.min(keepT, clip.duration); ST.tg.mixer.update(0); }
    const from = en.donor ? stemOf(en.donor) + ': ' + en.clip : ((LIB.index && LIB.index.find(x => x.stem === en.stem)) || {}).name || en.stem;
    chip(`${en.role}  ←  ${from}  ${clip.duration.toFixed(2)} s\n` +
      `stance ×${(rep.hipW / rep.leg).toFixed(2)} of the source's, for his leg length` + (rep.groundMax !== undefined ? ` · ground moved him up to ${(rep.groundMax * 100).toFixed(0)} cm (mean ${(rep.groundMean * 100).toFixed(0)})` : ' · ground off'));
    ST.cur = en; ST.curSrcDur = src.clip.duration; renderPack(); showEdit(); showPose(); await propShow(en);
  } catch (e) { console.error(e); chip('could not carry ' + (en.clip || en.stem) + ': ' + e.message); }
  busy(false);
}
const previewStem = (role, stem) => previewEntry({ role, stem });
function play(clip, src, edit) {
  const mx = ST.tg.mixer; mx.stopAllAction(); if (ST.act) mx.uncacheAction(ST.act.getClip());
  ST.act = mx.clipAction(clip); ST.act.play(); ST.act.time = 0;
  if (ST.ghost) { scene.remove(ST.ghost.root); scene.remove(ST.ghost.help); ST.ghost = null; }
  if ($('ghost').checked && src) {
    // the source body, at his hip height, a body-width to his right: what he is being asked to do
    const root = new THREE.Group(), copy = skClone(src.scene); root.add(copy); copy.traverse(o => { if (/^mixamorig_/.test(o.name)) o.isBone = true; });
    const k = ST.tg.hipH / (src.hipH || 1); root.scale.multiplyScalar(k); root.position.set(-ST.tg.hipH * 2.1, -src.restLow * k, 0);
    // a skin speaks for itself; a bare skeleton (the library's Y Bot) gets its lines. The helper goes in the SCENE: it already
    // draws in its object's world space, and parented under `root` it would be scaled twice
    let skinned = false; copy.traverse(o => { if (o.isSkinnedMesh) skinned = true; });
    const help = new THREE.SkeletonHelper(copy); help.visible = !skinned; scene.add(help);
    const mix = new THREE.AnimationMixer(copy); mix.clipAction(src.clip).play();
    scene.add(root); ST.ghost = { root, mix, help, a: (edit && edit.trim && +edit.trim[0]) || 0, sp: (edit && +edit.speed) || 1 };
  }
}

// ---------------------------------------------------------------- HANDS: clean poses from the library, per side, plus noise
const HPOSES = ['relaxed', 'fist', 'grip', 'cup', 'flat', 'open', 'point', 'wrap'];   // wrap: round his `wrap` cylinder (m948)
let HANDS_DEF = null;
async function handsDef() { if (!HANDS_DEF) HANDS_DEF = await (await fetch('forge/hands.json')).json(); return HANDS_DEF; }
// what this clip's hands are: his default (`ST.P.hands`) with the clip's own choice over it
function handsFor(en) {
  const D = ST.P.hands || {}, E = (en && en.hands) || {}, H = { noise: D.noise };
  for (const sd of ['Right', 'Left']) { const pose = E[sd] !== undefined ? E[sd] : D[sd] && D[sd].pose; H[sd] = { pose: pose || '', amt: D.amt === undefined ? 1 : D.amt }; }
  return H;
}
// m954: `wrap.up` = { role, u } -- the cup's axis is straight UP in that clip at that moment (his carry), said in his hand's frame.
// Every clip that wraps that hand uses the same axis, so the cup does not turn in his fingers between the pick-up and the carry.
async function wrapAxis(W, sd) {
  if (!W.up || !W.up.role) return null; const key = sd + JSON.stringify(W.up); ST.wrapAx = ST.wrapAx || {}; if (ST.wrapAx[key]) return ST.wrapAx[key];
  const en = ST.P.clips.find(c => c.role === W.up.role); if (!en) return null;
  const src = await source(en), r = F.carry(ST.tg, src, en.role, ST.P, { fk: en.fk }), clip = F.editLayer(r.clip, en.edit);
  const tg = ST.tg; tg.mixer.stopAllAction(); const a = tg.mixer.clipAction(clip); a.play(); a.time = clip.duration * (+W.up.u || 0); tg.mixer.update(0); tg.model.updateMatrixWorld(true);
  const hb = tg.rig.bones['mixamorig_' + sd + 'Hand'], v = new THREE.Vector3(0, 1, 0).applyQuaternion(hb.getWorldQuaternion(new THREE.Quaternion()).invert());
  a.stop(); tg.mixer.uncacheClip(clip); return (ST.wrapAx[key] = v.normalize().toArray());
}
async function handsOf(en) {
  const H = handsFor(en), need = new Set();
  for (const sd of ['Right', 'Left']) if (H[sd].pose) need.add(H[sd].pose);
  if (!need.size && !(H.noise && +H.noise.amt > 0)) return null;
  if (!LIB.index) { chip('hand poses need the library connected'); return null; }
  need.add('fist');                                             // the curl axis for the noise
  const def = await handsDef(); ST.handPoses = ST.handPoses || {};
  for (const nm of need) { if (ST.handPoses[nm] || nm === 'wrap') continue; const P = {};
    for (const sd of ['Right', 'Left']) { const d = def[nm] && def[nm][sd]; if (!d) continue; const src = await source({ stem: d.stem }); P[sd] = F.poseCapture(ST.tg, src, d.t, sd) || {}; }
    ST.handPoses[nm] = P; }
  // m948: a WRAP is solved on his own hand round the clip's cylinder (`en.wrap`, or his `P.wrap`), not captured -- so it is per clip
  let poses = ST.handPoses;
  if (need.has('wrap')) { const W0 = (en && en.wrap) || ST.P.wrap || { r: .6 }, P = {};
    for (const sd of ['Right', 'Left']) if (H[sd].pose === 'wrap') { const W = Object.assign({}, W0), ax = await wrapAxis(W0, sd); if (ax) W.axis = ax;
      const w = F.wrapPose(ST.tg, sd, W, ST.handPoses.fist && ST.handPoses.fist[sd]); if (w) { P[sd] = w.pose; ST.wraps[sd] = { c: w.c, r: w.r, q: w.q }; } }
    poses = Object.assign({}, ST.handPoses, { wrap: P }); }
  return { H, poses };
}
$('hR').innerHTML = '<option value="">right: as the source</option>' + HPOSES.map(p => `<option value="${p}">right: ${p}</option>`).join('');
$('hL').innerHTML = '<option value="">left: as the source</option>' + HPOSES.map(p => `<option value="${p}">left: ${p}</option>`).join('');
$('ehR').innerHTML = '<option value="*">right: his default</option><option value="">right: as the source</option>' + HPOSES.map(p => `<option value="${p}">right: ${p}</option>`).join('');
$('ehL').innerHTML = '<option value="*">left: his default</option><option value="">left: as the source</option>' + HPOSES.map(p => `<option value="${p}">left: ${p}</option>`).join('');
function syncHands() { const D = ST.P.hands || {}; $('hR').value = (D.Right && D.Right.pose) || ''; $('hL').value = (D.Left && D.Left.pose) || '';
  $('hAmt').value = D.amt === undefined ? 1 : D.amt; $('hNz').value = (D.noise && D.noise.amt) || 0; $('hHz').value = (D.noise && D.noise.hz) || .6;
  for (const id of ['hAmt', 'hNz', 'hHz']) $(id + 'V').textContent = (+$(id).value).toFixed(id === 'hNz' ? 1 : 2); }
function setHands() { const D = ST.P.hands = ST.P.hands || {}; D.Right = { pose: $('hR').value }; D.Left = { pose: $('hL').value }; D.amt = +$('hAmt').value; D.noise = { amt: +$('hNz').value, hz: +$('hHz').value }; relayer(); }
for (const id of ['hR', 'hL']) $(id).onchange = setHands;
for (const id of ['hAmt', 'hNz', 'hHz']) { $(id).oninput = () => { $(id + 'V').textContent = (+$(id).value).toFixed(id === 'hNz' ? 1 : 2); }; $(id).onchange = setHands; }
for (const id of ['eUp', 'eUpFrom']) $(id).onchange = () => { const en = ST.cur; if (!inPack()) return; if ($('eUp').value) en.upper = { role: $('eUp').value, from: $('eUpFrom').value }; else delete en.upper; saveProf(); previewEntry(en); };
for (const [id, sd] of [['ehR', 'Right'], ['ehL', 'Left']]) $(id).onchange = () => { const en = ST.cur; if (!inPack()) return; en.hands = en.hands || {};
  if ($(id).value === '*') delete en.hands[sd]; else en.hands[sd] = $(id).value; if (!Object.keys(en.hands).length) delete en.hands; saveProf(); previewEntry(en, ST.act ? ST.act.time : 0); };

// ---------------------------------------------------------------- the pack
function saveProf() { if (ST.file) localStorage.setItem(profKey(ST.file), JSON.stringify(ST.P)); }
function renderPack() {
  $('packList').innerHTML = ST.P.clips.length ? ST.P.clips.map((c, i) => `<div class="item${ST.cur === c ? ' on' : ''}" data-i="${i}"><input type="text" value="${c.role}" data-role="${i}" style="width:42%;flex:none"><div class="nm"><small>${c.name || c.stem}${c.edit ? ' · edited' : ''}</small></div><button class="btn" data-del="${i}">✕</button></div>`).join('')
    : '<div class="item"><div class="nm"><small>empty -- add clips from LIBRARY with +</small></div></div>';
}
$('packList').onclick = e => {
  const d = e.target.dataset.del; if (d !== undefined) { ST.P.clips.splice(+d, 1); saveProf(); renderPack(); return; }
  if (e.target.dataset.role !== undefined) return;
  const row = e.target.closest('.item'); if (!row || row.dataset.i === undefined) return;
  previewEntry(ST.P.clips[+row.dataset.i]);
};
$('packList').onchange = e => { const i = e.target.dataset.role; if (i === undefined) return; ST.P.clips[+i].role = e.target.value.trim() || ST.P.clips[+i].role; saveProf(); };
const step = d => { const L = ST.P.clips; if (!L.length) return; const i = L.indexOf(ST.cur); previewEntry(L[((i < 0 ? -1 : i) + d + L.length) % L.length]); };
$('prev').onclick = () => step(-1); $('next').onclick = () => step(1);
// this clip's trim and speed -- only for a clip that is IN the pack (a library row being browsed has nowhere to keep them)
function showEdit() {
  const en = ST.cur, inPack = en && ST.P.clips.includes(en); $('edit').hidden = !inPack; if (!inPack) return;
  const d = ST.curSrcDur || 1, E = en.edit || {};
  $('editH').textContent = 'This clip: ' + en.role;
  for (const id of ['eA', 'eB']) $(id).max = d.toFixed(2);
  $('eA').value = (E.trim && E.trim[0]) || 0; $('eB').value = (E.trim && E.trim[1]) || d; $('eS').value = E.speed || 1;
  $('eUp').innerHTML = '<option value="">torso + arms: this clip</option>' + ST.P.clips.filter(c => c !== en).map(c => `<option value="${c.role}">torso + arms: ${c.role}</option>`).join('');
  $('eUp').value = (en.upper && en.upper.role) || ''; $('eUpFrom').value = (en.upper && en.upper.from) || 'Spine1';
  const EH = en.hands || {}; $('ehR').value = EH.Right !== undefined ? EH.Right : '*'; $('ehL').value = EH.Left !== undefined ? EH.Left : '*';
  $('eAV').textContent = (+$('eA').value).toFixed(2); $('eBV').textContent = (+$('eB').value).toFixed(2); $('eSV').textContent = (+$('eS').value).toFixed(2);
}
for (const id of ['eA', 'eB', 'eS']) {
  $(id).oninput = () => { $(id + 'V').textContent = (+$(id).value).toFixed(2); };
  $(id).onchange = () => { const en = ST.cur; if (!en) return; const d = ST.curSrcDur || 1, a = +$('eA').value, b = Math.max(a + .05, +$('eB').value), sp = +$('eS').value;
    en.edit = (a > 0.001 || b < d - .001 || sp !== 1) ? { trim: [a, b], speed: sp } : undefined; saveProf(); previewEntry(en); };
}
const dl = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
const stemOf = f => f.split('/').pop().replace(/\.(glb|gltf|fbx)$/i, '');
$('profSave').onclick = () => dl(new Blob([JSON.stringify(ST.P, null, 1)], { type: 'application/json' }), stemOf(ST.file) + '.profile.json');
$('profLoadBtn').onclick = () => $('profLoad').click();
// THE GAME'S ROUTE (step 6): the profile goes to library/profiles/<his file>.json; `node tools/forgebake.cjs` (Claude) bakes it
// into models/characters/forged/ in zap, and when Zap is worn as this body the game plays those clips.
$('profPush').onclick = async () => {
  if (LIB.kind !== 'gh') { $('profNote').textContent = 'connect the library (LIBRARY tab) first'; return; }
  const local = ST.P.clips.filter(c => c.donor && c.donor.startsWith('idb:'));
  if (local.length) { $('profNote').innerHTML = '<span class="bad">' + local.length + ' clips come from a file only this browser has -- add it to the library first (LIBRARY tab)</span>'; return; }
  try { ST.P.character = ST.file; await ghPut(ghRoot() + '/profiles/' + stemOf(ST.file) + '.json', new TextEncoder().encode(JSON.stringify(ST.P, null, 1)), 'forge: profile ' + stemOf(ST.file));
    $('profNote').innerHTML = '<span class="ok">saved to the library as profiles/' + stemOf(ST.file) + '.json</span> -- tell Claude "bake ' + stemOf(ST.file) + '" and it goes into the game';
  } catch (e) { $('profNote').innerHTML = '<span class="bad">' + e.message + '</span>'; } };
$('profLoad').onchange = async () => { const f = $('profLoad').files[0]; if (!f) return; ST.P = JSON.parse(await f.text()); saveProf(); await reprep(); renderPack(); };
async function reprep() { if (!ST.tg) return; const m = ST.tg.model; ST.tg.restore(); ST.tg = F.prepTarget(m, { exclude: ST.P.exclude }); ST.sock = F.socketsOf(ST.tg, ST.P.sockets); sockAxes(); ST.handPoses = null; ST.wraps = {}; ST.wrapAx = {}; syncHands(); syncSliders(); dotsBuild(); }

// ---------------------------------------------------------------- packs: roles and where each comes from, nothing about a body
const packKey = 'forge.packs';
async function packMenu() {
  let built = []; try { built = (await (await fetch('forge/packs/index.json')).json()).packs; } catch (e) {}
  const repo = (await ghList('packs')).filter(n => n.endsWith('.json')), here = Object.keys(JSON.parse(localStorage.getItem(packKey) || '{}'));
  $('packSel').innerHTML = '<option value="">— pick a pack —</option>' + built.map(p => `<option value="b:${p.file}">${p.name}</option>`).join('') +
    repo.map(n => `<option value="g:${n}">${n.replace(/\.json$/, '')} (library)</option>`).join('') + here.map(n => `<option value="l:${n}">${n} (this browser)</option>`).join('');
}
async function packGet(v) {
  if (v.startsWith('b:')) return (await fetch('forge/packs/' + v.slice(2))).json();
  if (v.startsWith('g:')) return JSON.parse(new TextDecoder().decode(await ghReq('GET', ghRoot() + '/packs/' + v.slice(2), null, true)));
  return JSON.parse(localStorage.getItem(packKey) || '{}')[v.slice(2)];
}
$('packLoad').onclick = async () => { const v = $('packSel').value; if (!v || !ST.tg) return;
  try { const pk = await packGet(v); let n = 0;
    const rep = $('packRep').checked;
    for (const c of pk.clips) { const en = Object.assign({ name: c.donor ? stemOf(c.donor) + ': ' + c.clip : c.stem }, c), i = ST.P.clips.findIndex(x => x.role === c.role);
      if (i < 0) { ST.P.clips.push(en); n++; } else if (rep) { ST.P.clips[i] = en; n++; } }
    saveProf(); renderPack(); $('packNote').innerHTML = `<span class="ok">${pk.name}: ${n} added</span>` + (pk.clips.length > n ? ` (${pk.clips.length - n} roles he already had were left as they are)` : rep ? ' (replacing what he had)' : '') + ' -- flip through them with ◀ ▶';
  } catch (e) { $('packNote').innerHTML = '<span class="bad">' + e.message + '</span>'; } };
$('packSave').onclick = async () => { const name = $('packName').value.trim(); if (!name || !ST.P.clips.length) { $('packNote').textContent = 'give it a name, and put clips in his pack first'; return; }
  const pk = { name, clips: ST.P.clips.map(c => c.donor ? { role: c.role, donor: c.donor, clip: c.clip } : { role: c.role, stem: c.stem }) };
  const all = JSON.parse(localStorage.getItem(packKey) || '{}'); all[name] = pk; localStorage.setItem(packKey, JSON.stringify(all));
  let where = 'this browser';
  if (LIB.kind === 'gh') try { await ghPut(ghRoot() + '/packs/' + name.replace(/[^\w\- ]+/g, '').replace(/ +/g, '_') + '.json', new TextEncoder().encode(JSON.stringify(pk, null, 1)), 'forge: pack ' + name); where = 'the library (every device)'; } catch (e) { where += ' only -- ' + e.message; }
  if (pk.clips.some(c => c.donor && c.donor.startsWith('idb:'))) where += '. Some clips come from a file only this browser has: add it to the library (LIBRARY tab) so other devices can use the pack';
  $('packNote').innerHTML = `<span class="ok">saved "${name}"</span> to ${where}`; packMenu(); };

// ---------------------------------------------------------------- layers and his sliders
const relayer = () => { saveProf(); if (ST.cur) previewEntry(ST.cur); };
$('lFeet').onchange = () => { ST.P.layers.feet = $('lFeet').checked ? 1 : 0; relayer(); };
$('lGround').oninput = () => { $('lGroundV').textContent = (+$('lGround').value).toFixed(2); };
$('lGround').onchange = () => { ST.P.layers.ground = +$('lGround').value; relayer(); };
$('lToes').oninput = () => { $('lToesV').textContent = (+$('lToes').value).toFixed(2); };
$('lToes').onchange = () => { ST.P.layers.toes = +$('lToes').value; relayer(); };
$('lClear').oninput = () => { $('lClearV').textContent = (+$('lClear').value).toFixed(2); };
$('lClear').onchange = () => { ST.P.layers.clear = +$('lClear').value; relayer(); };
$('ghost').onchange = () => relayer();
const SL = { aStance: ['stance', 2], aArms: ['arms', 0], aElb: ['elbows', 0], aLean: ['lean', 0], aToeIn: ['toeIn', 0], aKnee: ['knees', 0], aWrist: ['wrists', 0] };
function syncSliders() { ST.P.adjust = Object.assign({ stance: 1, arms: 0, elbows: 0, lean: 0, toeIn: 0, knees: 0, wrists: 0 }, ST.P.adjust || {});
  $('lToes').value = ST.P.layers.toes ?? 1; $('lToesV').textContent = (+$('lToes').value).toFixed(2);
  for (const id in SL) { $(id).value = ST.P.adjust[SL[id][0]]; $(id + 'V').textContent = (+$(id).value).toFixed(SL[id][1]); } }
for (const id in SL) {
  $(id).oninput = () => { $(id + 'V').textContent = (+$(id).value).toFixed(SL[id][1]); };
  $(id).onchange = () => { ST.P.adjust = ST.P.adjust || {}; ST.P.adjust[SL[id][0]] = +$(id).value; relayer(); };
}

// ---------------------------------------------------------------- POSE: the FK layer, by hand
// Dots on his joints; tap one (or pick from the list), turn the rings. On release the change is KEYED at the playhead as a
// rotation in the bone's parent frame on top of everything else (`fkLayer`), and the clip re-bakes so ground contact still holds.
const POSE = { on: false, bone: '', drag: false, q0: null, t0: 0, space: 'local', mode: 'bone' };
const gizmo = new TransformControls(cam, renderer.domElement); gizmo.setMode('rotate'); gizmo.setSpace('local'); gizmo.setSize(1.1);
const gizmoH = gizmo.getHelper(); scene.add(gizmoH);
const dotGeo = new THREE.SphereGeometry(1, 10, 8), dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true, opacity: .85 });
let dots = null, dotBones = [];
function dotsBuild() {
  if (dots) { scene.remove(dots); dots.dispose(); dots = null; }
  if (!ST.tg) return;
  dotBones = Object.keys(ST.tg.rig.bones).filter(n => !/(Thumb|Index|Middle|Ring|Pinky)[2-4]|_End$|HeadTop|ToeBase_End/.test(n)).map(n => ST.tg.rig.bones[n]);
  dots = new THREE.InstancedMesh(dotGeo, dotMat, dotBones.length); dots.renderOrder = 10; dots.frustumCulled = false; dots.visible = POSE.on; scene.add(dots);
}
const _m4 = new THREE.Matrix4(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _qq = new THREE.Quaternion();
function dotsUpdate() {
  if (!dots) return; const r = ST.tg.hipH * .022;
  dotBones.forEach((b, i) => { b.getWorldPosition(_p); const sel = b.name === POSE.bone; _m4.compose(_p, _qq.identity(), _s.setScalar(sel ? r * 1.6 : r)); dots.setMatrixAt(i, _m4); dots.setColorAt(i, new THREE.Color(sel ? 0xffd04a : 0x3cd6ff)); });
  dots.instanceMatrix.needsUpdate = true; if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
}
const pretty = n => n.replace(/^mixamorig_/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
function boneMenu() {
  const B = ST.tg ? Object.keys(ST.tg.rig.bones).filter(n => !/_End$|HeadTop/.test(n)) : [];
  $('boneSel').innerHTML = '<option value="">— pick a bone —</option>' + B.map(n => `<option value="${n}">${pretty(n)}</option>`).join('');
  $('boneSel').value = POSE.bone;
}
function selectBone(n) {
  POSE.bone = n || ''; $('boneSel').value = POSE.bone;
  if (POSE.bone) { POSE.mode = 'bone'; [...$('gzMode').children].forEach(b => b.classList.toggle('ac', b.dataset.m === 'bone')); }
  if (POSE.bone && POSE.on && inPack()) { gizmo.attach(ST.tg.rig.bones[POSE.bone]); ST.playing = false; $('play').textContent = '▶'; } else gizmo.detach();
  renderKeys();
}
// the clip's SOURCE time for what is on screen: keys live before trim/speed, so a re-trim does not move them
const srcT = () => { const E = (ST.cur && ST.cur.edit) || {}; return ((E.trim && +E.trim[0]) || 0) + (ST.act ? ST.act.time : 0) * (+E.speed || 1); };
gizmo.addEventListener('dragging-changed', e => {
  orbit.enabled = !e.value;
  if (POSE.mode !== 'bone') { POSE.drag = e.value; if (!e.value) propCommit(); return; }
  const b = ST.tg && ST.tg.rig.bones[POSE.bone]; if (!b) return;
  if (e.value) { POSE.drag = true; POSE.q0 = b.quaternion.clone(); POSE.t0 = srcT(); return; }
  POSE.drag = false;
  const en = ST.cur; if (!en || !ST.P.clips.includes(en)) return;
  // what the clip gave this bone BEFORE any key (the old key undone), and what he wants now: the new key is the difference
  const old = F.fkAt(en.fk && en.fk[POSE.bone], POSE.t0), base = old.clone().invert().multiply(POSE.q0);
  const D = b.quaternion.clone().multiply(base.invert());
  en.fk = en.fk || {}; const keys = en.fk[POSE.bone] = en.fk[POSE.bone] || [], tol = 1 / 60;
  const k = keys.find(x => Math.abs(x.t - POSE.t0) < tol), q = [D.x, D.y, D.z, D.w].map(v => +v.toFixed(5));
  if (k) k.q = q; else { keys.push({ t: +POSE.t0.toFixed(3), q }); keys.sort((a, b) => a.t - b.t); }
  saveProf(); previewEntry(en, ST.act ? ST.act.time : 0).then(() => selectBone(POSE.bone));
});
function showPose() {
  const en = ST.cur, ok = en && ST.P.clips.includes(en);
  $('poseH').textContent = ok ? 'Pose: ' + en.role : 'Pose';
  $('poseNote').textContent = ok ? (Object.keys(en.fk || {}).length ? 'Keys show in the list. Tap a key to jump to it.' : 'No keys yet.') : 'Pick a clip in his PACK first (a library row being browsed has nowhere to keep keys).';
  if (!ok || !POSE.on) gizmo.detach(); else gizmoTarget();
  renderKeys();
}
function renderKeys() {
  const en = ST.cur, fk = (en && en.fk) || {}, rows = [];
  for (const bn in fk) for (const [i, k] of fk[bn].entries()) { const a = 2 * Math.acos(Math.min(1, Math.abs(k.q[3]))) * 180 / Math.PI;
    rows.push(`<div class="item${bn === POSE.bone ? ' on' : ''}" data-b="${bn}" data-t="${k.t}"><div class="nm">${pretty(bn)} <small>at ${k.t.toFixed(2)} s · ${a.toFixed(0)}°</small></div><button class="btn" data-kb="${bn}" data-ki="${i}">✕</button></div>`); }
  $('keyList').innerHTML = rows.join('') || '<div class="item"><div class="nm"><small>none</small></div></div>';
}
$('keyList').onclick = e => {
  const en = ST.cur; if (!en || !en.fk) return;
  if (e.target.dataset.kb) { const bn = e.target.dataset.kb; en.fk[bn].splice(+e.target.dataset.ki, 1); if (!en.fk[bn].length) delete en.fk[bn]; saveProf(); previewEntry(en, ST.act.time); return; }
  const row = e.target.closest('.item'); if (!row || !row.dataset.b) return;
  const E = en.edit || {}, t = (+row.dataset.t - ((E.trim && +E.trim[0]) || 0)) / (+E.speed || 1);
  if (ST.act) { ST.act.time = Math.max(0, t); ST.tg.mixer.update(0); } selectBone(row.dataset.b);
};
$('keyBoneClr').onclick = () => { const en = ST.cur; if (!en || !en.fk || !POSE.bone) return; delete en.fk[POSE.bone]; saveProf(); previewEntry(en, ST.act.time); };
$('keyAllClr').onclick = () => { const en = ST.cur; if (!en || !en.fk) return; delete en.fk; saveProf(); previewEntry(en, ST.act.time); };
$('boneSel').onchange = () => selectBone($('boneSel').value);
for (const id of ['spL', 'spW']) $(id).onclick = () => { POSE.space = $(id).dataset.sp; gizmo.setSpace(POSE.space); $('spL').classList.toggle('ac', POSE.space === 'local'); $('spW').classList.toggle('ac', POSE.space === 'world'); };
// a TAP on a dot picks it (a drag is the camera)
const ray = new THREE.Raycaster(); let downAt = null;
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY, performance.now()]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!POSE.on || !dots || !downAt || POSE.drag) return; const [x, y, t] = downAt; downAt = null;
  if (Math.hypot(e.clientX - x, e.clientY - y) > 8 || performance.now() - t > 400) return;
  const r = renderer.domElement.getBoundingClientRect(), v = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
  ray.setFromCamera(v, cam);
  // nearest dot to the ray, in screen terms -- a fingertip is wider than a dot
  let best = -1, bd = Infinity; const pr = new THREE.Vector3();
  dotBones.forEach((b, i) => { b.getWorldPosition(pr); pr.project(cam); const d = Math.hypot((pr.x - v.x) * r.width / 2, (pr.y - v.y) * r.height / 2); if (d < bd) { bd = d; best = i; } });
  if (best >= 0 && bd < 28) selectBone(dotBones[best].name);
});
function poseMode(on) { POSE.on = on; if (dots) dots.visible = on; sockAxes(); if (on) { boneMenu(); showPose(); } else gizmo.detach(); }
for (const id of ['spL', 'spW']) $(id).addEventListener('click', () => { if (POSE.mode === 'bone') gizmo.setSpace(POSE.space); });

// ---------------------------------------------------------------- PROPS: a weapon in his hand, the other hand on it
// A prop built around a `weapon_root*` joint (every Zap weapon) hangs from the matching joint on him with identity -- his
// `weapon_root_right` if he has one, else the bare hand, and then Move / Turn / Size fit it. The yellow ball is the grip point.
const PROPS = [['alien_launcher', 'Rocket launcher'], ['alien_antenna_blaster_game', 'Blaster'], ['alien_antenna_hammer_game', 'Antenna hammer'], ['hammer', 'Hammer'],
  ['spikey_mace', 'Spiked mace'], ['w_brute_cleaver', 'Cleaver'], ['w_rept_maul', 'Maul'], ['shield_brute', 'Shield']];
const propCache = new Map();
async function propScene(file) {
  if (propCache.has(file)) return propCache.get(file);
  const buf = file.startsWith('idb:') ? await idbGet(file) : await (await fetch(file)).arrayBuffer();
  const g = await parseGLB(buf); propCache.set(file, g.scene); return g.scene;
}
async function propMenu() {
  const up = (await idbKeys()).filter(k => String(k).startsWith('idb:prop:'));
  $('propSel').innerHTML = '<option value="">— no prop —</option>' + PROPS.map(([f, n]) => `<option value="models/weapons/${f}.glb">${n}</option>`).join('') + up.map(k => `<option value="${k}">${k.slice(9)} (uploaded)</option>`).join('');
}
const mountName = side => { const m = ST.tg.model, w = 'weapon_root_' + side.toLowerCase(); return m.getObjectByName(w) ? w : 'mixamorig_' + side + 'Hand'; };
function gripOf(en) {
  const P = en && en.prop, G = en && en.grip; if (!P || !G || !G.on || !(+G.reach > 0)) return null;
  const M = new THREE.Matrix4().compose(new THREE.Vector3().fromArray(P.pos), new THREE.Quaternion().fromArray(P.quat), new THREE.Vector3().setScalar(P.unit * (P.size || 1)));
  return { bone: P.bone, M: M.toArray(), off: G.off, side: P.hand === 'Right' ? 'Left' : 'Right', reach: +G.reach };
}
const PR = { holder: null, marker: null };
const ZAP_HAND = .0755;   // old Zap's hand (wrist -> middle knuckle) in his file, metres: a Zap weapon is sized to THAT hand
// where a prop hangs, by what the prop is built around:
//   a `socket` node      -> his socket, identity (the prop's socket frame ON his)
//   a `weapon_root*`     -> his own joint of that name if he has one (identity, as in the game), else where old Zap held it in a
//                           hand like his (`mountPlace`), moved by however far his socket has been adjusted
//   nothing              -> his socket, sized by the file's units
function propMount(en, sc) {
  const P = en.prop, sd = P.hand, S = ST.sock && ST.sock[sd]; if (!S) return null;
  let root = null, sock = null; sc.traverse(o => { if (!root && /^weapon_root/.test(o.name)) root = o; if (!sock && /^socket/.test(o.name)) sock = o; });
  const hlen = S.hand.getWorldPosition(new THREE.Vector3()).distanceTo(S.hand.children.find(c => c.isBone && /Middle1$/.test(c.name)) ? S.hand.children.find(c => c.isBone && /Middle1$/.test(c.name)).getWorldPosition(new THREE.Vector3()) : S.hand.getWorldPosition(new THREE.Vector3()));
  if (sock) { const ws = sock.getWorldScale(new THREE.Vector3()).x; return { mount: S.node, ref: sock, worldUnit: ws, kind: 'socket' }; }
  if (root) {
    const own = ST.tg.model.getObjectByName(root.name);
    if (own && !own.userData.forgeMade) return { mount: own, ref: root, worldUnit: root.getWorldScale(new THREE.Vector3()).x, kind: 'own ' + root.name };
    const nm = 'forge_' + root.name.replace(/_(right|left)$/, '') + '_' + sd.toLowerCase();
    let m = ST.tg.model.getObjectByName(nm); if (!m) { m = new THREE.Object3D(); m.name = nm; m.userData.forgeMade = 1; S.hand.add(m); }
    if (!F.mountPlace(S.hand, 'weapon_root_' + sd.toLowerCase(), m)) return null;
    m.children.filter(c => /^weapon_tip/.test(c.name)).forEach(c => m.remove(c));
    if (S.auto && S.node.userData.forged) { const D = S.node.matrix.clone(), A = new THREE.Matrix4().compose(S.auto.p, S.auto.q, new THREE.Vector3(1, 1, 1));
      S.node.updateMatrix(); D.copy(S.node.matrix).multiply(A.invert()); m.updateMatrix(); m.matrix.premultiply(D); m.matrix.decompose(m.position, m.quaternion, m.scale); }
    return { mount: m, ref: root, worldUnit: .01 * hlen / ZAP_HAND, kind: 'old Zap\'s grip' };
  }
  const b = new THREE.Box3().setFromObject(sc), d = b.getSize(new THREE.Vector3());
  return { mount: S.node, ref: null, worldUnit: Math.max(d.x, d.y, d.z) > 5 ? .01 : 1, kind: 'socket (no joint in the prop)' };
}
async function propShow(en) {
  if (PR.holder) { PR.holder.removeFromParent(); PR.holder = PR.marker = null; }
  syncProp(en); if (!en || !en.prop || !ST.tg) return;
  const P = en.prop; let sc;
  try { sc = await propScene(P.file); } catch (e) { chip('could not load the prop: ' + e.message); return; }
  sc.updateMatrixWorld(true);
  const M = propMount(en, sc); if (!M) return;
  const content = sc.clone(true);
  // the prop's own reference frame (its socket / weapon_root) becomes the holder's origin: content placed by the inverse of it
  if (M.ref) { content.matrixAutoUpdate = false; content.matrix.copy(M.ref.matrixWorld).invert(); }     // the frame in the ref's own units
  content.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
  const holder = new THREE.Group(); holder.name = 'forge_prop'; holder.add(content); M.mount.add(holder);
  const mws = M.mount.getWorldScale(new THREE.Vector3()).x;
  P.unit = M.worldUnit / (mws || 1); P.bone = M.mount.name;
  if (!P.pos) { P.pos = [0, 0, 0]; P.quat = [0, 0, 0, 1]; P.size = 1; }
  if (!en.grip) {     // the default grip point: the prop's weapon tip, else a fifth of the way along its long axis
    let tip = null; content.traverse(o => { if (!tip && /^weapon_tip|^grip/.test(o.name)) tip = o; });
    holder.updateMatrixWorld(true); let off;
    if (tip) off = holder.worldToLocal(tip.getWorldPosition(new THREE.Vector3()));
    else { const b = new THREE.Box3().setFromObject(content), c = b.getCenter(new THREE.Vector3()), d = b.getSize(new THREE.Vector3()); const ax = d.x > d.y ? (d.x > d.z ? 'x' : 'z') : (d.y > d.z ? 'y' : 'z'); c[ax] = b.min[ax] + d[ax] * .2; off = holder.worldToLocal(content.localToWorld(c)); }
    en.grip = { on: false, reach: 1, off: off.toArray().map(v => +v.toFixed(4)) };
  }
  saveProf();
  holder.position.fromArray(P.pos); holder.quaternion.fromArray(P.quat); holder.scale.setScalar(P.unit * (P.size || 1));
  holder.updateMatrixWorld(true);
  const hws = holder.getWorldScale(new THREE.Vector3()).x, r = ST.tg.hipH * .035 / (hws || 1);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd04a, depthTest: false, transparent: true, opacity: .9 }));
  marker.renderOrder = 11; marker.position.fromArray(en.grip.off); holder.add(marker);
  PR.holder = holder; PR.marker = marker; $('sockNote').textContent = 'prop on ' + M.kind + ' (' + P.hand + ' hand)';
  if (POSE.on) gizmoTarget();
}
// the sockets drawn: a small axis triad on each (red X, green Y = fingers, blue Z = along the handle)
function sockAxes() {
  if (!ST.sock) return;
  for (const sd in ST.sock) { const n = ST.sock[sd].node; let ax = n.children.find(c => c.name === 'forge_axes');
    if (!ax) { ax = new THREE.AxesHelper(1); ax.name = 'forge_axes'; ax.material.depthTest = false; ax.renderOrder = 12; n.add(ax); }
    n.updateMatrixWorld(true); ax.scale.setScalar(ST.tg.hipH * .22 / (n.getWorldScale(new THREE.Vector3()).x || 1)); ax.visible = POSE.on; }
}
function syncProp(en) {
  const P = en && en.prop, G = en && en.grip;
  $('propSel').value = P ? P.file : ''; $('propHand').value = P ? P.hand : 'Right';
  $('pSize').value = (P && P.size) || 1; $('pSizeV').textContent = (+$('pSize').value).toFixed(2);
  $('gripOn').checked = !!(G && G.on); $('gReach').value = (G && G.reach) ?? 1; $('gReachV').textContent = (+$('gReach').value).toFixed(2);
}
const inPack = () => ST.cur && ST.P.clips.includes(ST.cur);
$('propSel').onchange = async () => { if (!inPack()) return; const f = $('propSel').value, en = ST.cur;
  if (!f) { delete en.prop; delete en.grip; } else { const hand = $('propHand').value; en.prop = { file: f, hand }; delete en.grip; }
  saveProf(); await propShow(en); if (en.grip && en.grip.on) previewEntry(en, ST.act.time); };
$('propHand').onchange = () => { if (!inPack() || !ST.cur.prop) return; $('propSel').onchange(); };
$('propFileBtn').onclick = () => $('propFile').click();
$('propFile').onchange = async () => { const f = $('propFile').files[0]; if (!f) return; const k = 'idb:prop:' + f.name; await idbPut(k, await f.arrayBuffer()); propCache.delete(k); await propMenu(); $('propSel').value = k; $('propSel').onchange(); };
$('pSize').oninput = () => { $('pSizeV').textContent = (+$('pSize').value).toFixed(2); if (PR.holder && ST.cur.prop) PR.holder.scale.setScalar(ST.cur.prop.unit * +$('pSize').value); };
$('pSize').onchange = () => { const en = ST.cur; if (!inPack() || !en.prop) return; en.prop.size = +$('pSize').value; saveProf(); if (en.grip && en.grip.on) previewEntry(en, ST.act.time); };
$('gripOn').onchange = () => { const en = ST.cur; if (!inPack() || !en.grip) return; en.grip.on = $('gripOn').checked; saveProf(); previewEntry(en, ST.act.time); };
$('gReach').oninput = () => { $('gReachV').textContent = (+$('gReach').value).toFixed(2); };
$('gReach').onchange = () => { const en = ST.cur; if (!inPack() || !en.grip) return; en.grip.reach = +$('gReach').value; saveProf(); if (en.grip.on) previewEntry(en, ST.act.time); };
$('propAll').onclick = () => { const en = ST.cur; if (!inPack() || !en.prop) return; for (const c of ST.P.clips) if (c !== en) { c.prop = JSON.parse(JSON.stringify(en.prop)); c.grip = en.grip ? JSON.parse(JSON.stringify(en.grip)) : undefined; } saveProf(); chip('prop + grip on all ' + ST.P.clips.length + ' clips'); };
function gizmoTarget() {
  const m = POSE.mode;
  if (m === 'bone') { gizmo.setMode('rotate'); gizmo.setSpace(POSE.space); if (POSE.bone && inPack()) gizmo.attach(ST.tg.rig.bones[POSE.bone]); else gizmo.detach(); return; }
  if (m === 'smove' || m === 'sturn') { const S = ST.sock && ST.sock[$('propHand').value]; if (!S) { gizmo.detach(); return; } gizmo.setMode(m === 'smove' ? 'translate' : 'rotate'); gizmo.setSpace('local'); gizmo.attach(S.node); return; }
  if (!PR.holder) { gizmo.detach(); return; }
  if (m === 'move') { gizmo.setMode('translate'); gizmo.setSpace('local'); gizmo.attach(PR.holder); }
  else if (m === 'turn') { gizmo.setMode('rotate'); gizmo.setSpace('local'); gizmo.attach(PR.holder); }
  else if (m === 'grip') { gizmo.setMode('translate'); gizmo.setSpace('world'); gizmo.attach(PR.marker); }
}
const gzPick = e => { const m = e.target.dataset.m; if (!m) return; POSE.mode = m; [...$('gzMode').children, ...$('gzMode2').children].forEach(b => b.classList.toggle('ac', b === e.target)); gizmoTarget(); };
$('gzMode').onclick = gzPick; $('gzMode2').onclick = gzPick;
$('sockReset').onclick = () => { const sd = $('propHand').value; if (!ST.sock || !ST.sock[sd]) return; if (ST.P.sockets) delete ST.P.sockets[sd]; const S = ST.sock[sd];
  if (S.auto) { S.node.position.copy(S.auto.p); S.node.quaternion.copy(S.auto.q); } S.node.userData.forged = 0; saveProf(); if (ST.cur) propShow(ST.cur).then(() => { if (ST.cur.grip && ST.cur.grip.on) previewEntry(ST.cur, ST.act.time); }); };
function propCommit() {
  if (POSE.mode === 'smove' || POSE.mode === 'sturn') { const sd = $('propHand').value, S = ST.sock[sd];
    ST.P.sockets = ST.P.sockets || {}; ST.P.sockets[sd] = { p: S.node.position.toArray().map(v => +v.toFixed(5)), q: S.node.quaternion.toArray().map(v => +v.toFixed(5)) }; S.node.userData.forged = 1; saveProf();
    if (ST.cur && ST.cur.prop) propShow(ST.cur).then(() => { if (ST.cur.grip && ST.cur.grip.on) previewEntry(ST.cur, ST.act.time); }); return; }
  const en = ST.cur; if (!inPack() || !en.prop || !PR.holder) return;
  if (POSE.mode === 'grip') { en.grip.off = PR.marker.position.toArray().map(v => +v.toFixed(4)); saveProf(); if (en.grip.on) previewEntry(en, ST.act.time); return; }
  en.prop.pos = PR.holder.position.toArray().map(v => +v.toFixed(5)); en.prop.quat = PR.holder.quaternion.toArray().map(v => +v.toFixed(5));
  saveProf(); if (en.grip && en.grip.on) previewEntry(en, ST.act.time);
}

// ---------------------------------------------------------------- export
// m981: WEAPON JOINTS IN HIS FILE. *"The Forge is supposed to give him weapon joints... for both hands and their tips... so we can
// place them for animation"* -- instead of every game working out a mount from his hand on load, slightly differently each time.
// For each hand without one: `weapon_root_<side>` placed where the game's convention puts it (`mountPlace`: old Zap's mount in the
// hand's own frame, mitts included), with its tip (`weapon_tip_2` right, `weapon_tip` left, the weapon files' own names). Both are
// BONES appended to every skin's skeleton (no weights; bind inverse from the bind pose), so a DCC tool and the game see joints that
// can be keyed, and a weapon file parents to them with identity. The sockets (`socket_hand_*`) are already on him (`socketsOf`).
function weaponJoints(m) {
  const add = [];
  for (const sd of ['Right', 'Left']) {
    const name = 'weapon_root_' + sd.toLowerCase(), hand = ST.tg.rig.bones['mixamorig_' + sd + 'Hand'];
    if (!hand || m.getObjectByName(name)) continue;
    const b = new THREE.Bone(); b.name = name; hand.add(b);
    if (!F.mountPlace(hand, name, b)) { hand.remove(b); continue; }
    const t0 = b.children.find(c => /^weapon_tip/.test(c.name)), tip = new THREE.Bone(); tip.name = t0.name; tip.position.copy(t0.position); b.remove(t0); b.add(tip);
    add.push(b, tip);
  }
  if (!add.length) return 0;
  m.updateMatrixWorld(true);
  // the bind inverses in the SAME space as the file's own (they came from the file, not from this scene): the offset M is read
  // off an existing joint at bind (its world x its inverse), and a new joint's inverse is (its world)^-1 x M
  m.traverse(o => { if (!o.isSkinnedMesh) return; const S = o.skeleton, M = S.bones[0].matrixWorld.clone().multiply(S.boneInverses[0]);
    o.skeleton = new THREE.Skeleton(S.bones.concat(add), S.boneInverses.concat(add.map(b => b.matrixWorld.clone().invert().multiply(M)))); });
  return add.length;
}
async function bakeAll(onStep) {
  const clips = [];
  for (const [i, c] of ST.P.clips.entries()) { onStep && onStep(i, c); try { const { clip } = await bake(c); clip.name = c.role; clips.push(clip); } catch (e) { console.warn('skipped ' + c.role + ': ' + e.message); } }
  return clips;
}
async function exportGLB(withMesh) {
  if (!ST.tg || !ST.P.clips.length) return null;
  ST.tg.mixer.stopAllAction();
  const clips = await bakeAll((i, c) => { $('expNote').textContent = `baking ${i + 1}/${ST.P.clips.length}: ${c.role}`; });
  const m = ST.tg.model, hid = [];
  m.traverse(o => { o.updateMatrix(); });
  ST.tg.restore();
  // m948: where each wrapped hand's cylinder sits (hand-local, his own units) and its radius -- the game puts the cup THERE
  const holds = []; for (const sd in ST.wraps) { const hb = ST.tg.rig.bones['mixamorig_' + sd + 'Hand']; if (!hb) continue;
    const o = new THREE.Object3D(); o.name = 'hold_hand_' + sd[0].toLowerCase(); o.position.fromArray(ST.wraps[sd].c); if (ST.wraps[sd].q) o.quaternion.fromArray(ST.wraps[sd].q); o.userData = { hold: 1, r: ST.wraps[sd].r, ax: ST.wraps[sd].q ? 1 : 0 }; hb.add(o); holds.push(o); }
  weaponJoints(m);     // m981: real weapon joints on both hands, in the file
  for (const role in (ST.refs || {})) { const o = new THREE.Object3D(); o.name = 'forge_ref_' + role; o.userData = { ref: ST.refs[role] }; m.add(o); holds.push(o); }
  m.traverse(o => { if ((o.name === 'forge_axes' || o.name === 'forge_prop' || o.isLine) && o.visible) { o.visible = false; hid.push(o); } });
  if (!withMesh) m.traverse(o => { if (o.isMesh && o.visible) { o.visible = false; hid.push(o); } });
  const out = await new GLTFExporter().parseAsync(m, { binary: true, animations: clips, onlyVisible: true });
  hid.forEach(o => { o.visible = true; }); holds.forEach(o => o.parent.remove(o));
  if (ST.act) ST.act.play();
  $('expNote').textContent = `${clips.length} clips · ${(out.byteLength / 1e6).toFixed(2)} MB`;
  return out;
}
$('expClips').onclick = async () => { busy(true); const b = await exportGLB(false); busy(false); if (b) dl(new Blob([b]), stemOf(ST.file) + '_clips.glb'); };
$('expFull').onclick = async () => { busy(true); const b = await exportGLB(true); busy(false); if (b) dl(new Blob([b]), stemOf(ST.file) + '_forged.glb'); };

// ---------------------------------------------------------------- characters
$('charSel').innerHTML = '<option value="">— pick a character —</option>' + CHARS.map(([f, n]) => `<option value="models/characters/${f}.glb">${n}</option>`).join('');
$('charSel').onchange = async () => { const f = $('charSel').value; if (!f) return; busy(true); const r = await fetch(f); await setCharacter(await r.arrayBuffer(), f); };
$('charFileBtn').onclick = () => $('charFile').click();
$('charFile').onchange = async () => { const f = $('charFile').files[0]; if (f) await setCharacter(await f.arrayBuffer(), f.name); };

// ---------------------------------------------------------------- tabs, time, loop
$('tabs').onclick = e => { const p = e.target.dataset.p; if (!p) return; [...$('tabs').children].forEach(b => b.classList.toggle('on', b === e.target)); document.querySelectorAll('.pane').forEach(x => x.classList.toggle('on', x.id === 'p-' + p)); poseMode(p === 'pose'); };
$('play').onclick = () => { ST.playing = !ST.playing; $('play').textContent = ST.playing ? '❚❚' : '▶'; };
$('speed').onchange = () => { ST.speed = +$('speed').value; };
let scrubbing = false;
$('scrub').oninput = () => { scrubbing = true; if (!ST.act) return; const d = ST.act.getClip().duration; ST.act.time = d * $('scrub').value / 1000; };
$('scrub').onchange = () => { scrubbing = false; };
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(.05, clock.getDelta()) * (ST.playing && !scrubbing ? ST.speed : 0);
  if (ST.tg && ST.act) {
    if (!POSE.drag) ST.tg.mixer.update(dt);
    if (POSE.on) dotsUpdate();
    const d = ST.act.getClip().duration, t = ST.act.time % d;
    if (ST.ghost) { const ga = ST.ghost.mix._actions[0]; if (ga) { ga.time = ST.ghost.a + t * ST.ghost.sp; ST.ghost.mix.update(0); } }
    if (!scrubbing) $('scrub').value = Math.round(t / d * 1000);
    $('tlab').textContent = t.toFixed(2) + ' / ' + d.toFixed(2);
  }
  orbit.update(); renderer.render(scene, cam);
});

// ---------------------------------------------------------------- start
(async () => {
  donorMenu(); propMenu(); packMenu();
  if (Q.get('lib')) await libConnect('url', { base: Q.get('lib').replace(/\/?$/, '/') });
  else { const g = localStorage.getItem('forge.gh'); if (g) { const o = JSON.parse(g); $('ghRepo').value = o.repo; $('ghPath').value = o.path; $('ghTok').value = o.tok; await libConnect('gh', { gh: o }); } }
  const c = Q.get('char'); if (c) { $('charSel').value = c; const r = await fetch(c); await setCharacter(await r.arrayBuffer(), c); }
  else chip('pick a character in BODY, connect the library in LIBRARY');
})();

// the command line drives exactly this
window.forge = {
  THREE, F, ST, LIB, cam, orbit,
  async character(path) { const r = await fetch(path); await setCharacter(await r.arrayBuffer(), path); return { hipH: ST.tg.hipH, excluded: ST.tg.info.excluded }; },
  library: (base) => libConnect('url', { base: base.replace(/\/?$/, '/') }),
  profile(P) { ST.P = P; return reprep(); },
  preview: (role, stem) => previewStem(role, stem || role),
  previewEntry: en => previewEntry(en),
  POSE: () => POSE, gizmo: () => gizmo, selectBone: n => selectBone(n), poseMode: on => poseMode(on),
  donor: async name => (await donor(name)).map(s => s.clip.name),
  adjust(a) { ST.P.adjust = Object.assign(ST.P.adjust || {}, a); syncSliders(); },
  async export(withMesh) { const b = await exportGLB(withMesh); let s = ''; const u = new Uint8Array(b); for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); },
  chip: () => $('chip').textContent,
  // ---- the agent's verbs (tools/../retarget-anims/mcp drives these): each one is what a button does, said as a call
  state() {
    return { character: ST.file, hipH: ST.tg && +ST.tg.hipH.toFixed(3), excluded: ST.tg && ST.tg.info.excluded, layers: ST.P.layers, adjust: ST.P.adjust,
      current: ST.cur && ST.cur.role, library: LIB.index ? LIB.index.length : 0, sockets: ST.sock ? Object.fromEntries(Object.entries(ST.sock).map(([k, v]) => [k, v.own ? 'his own' : v.node.userData.forged ? 'adjusted' : v.auto ? 'auto' : 'none'])) : {},
      clips: ST.P.clips.map(c => ({ role: c.role, from: c.donor ? stemOf(c.donor) + ': ' + c.clip : c.stem, keys: c.fk ? Object.values(c.fk).reduce((n, k) => n + k.length, 0) : 0, prop: c.prop ? stemOf(c.prop.file) : null, grip: !!(c.grip && c.grip.on), edit: c.edit || null })) };
  },
  characters: () => CHARS.map(([f, n]) => ({ path: 'models/characters/' + f + '.glb', name: n })),
  props: () => PROPS.map(([f, n]) => ({ path: 'models/weapons/' + f + '.glb', name: n })),
  search(q, tag, limit = 30) {
    if (!LIB.index) return [];
    const w = String(q || '').toLowerCase().split(/\s+/).filter(Boolean);
    return LIB.index.filter(m => (!tag || (m.tags || []).includes(tag)) && w.every(x => (m.name + ' ' + (m.description || '') + ' ' + (m.tags || []).join(' ') + ' ' + (m.props || []).join(' ')).toLowerCase().includes(x)))
      .slice(0, limit).map(m => ({ stem: m.stem, name: m.name, description: m.description, seconds: +(+m.duration).toFixed(2), loops: m.loopDiff < 15, tags: m.tags }));
  },
  async packs() { await packMenu(); return [...$('packSel').options].filter(o => o.value).map(o => ({ id: o.value, name: o.textContent })); },
  async applyPack(id, replace) { $('packSel').value = id; $('packRep').checked = !!replace; await $('packLoad').onclick(); return $('packNote').textContent; },
  addClip(en) { const e = Object.assign({}, en); if (!e.role) e.role = e.clip || e.stem; e.name = e.donor ? stemOf(e.donor) + ': ' + e.clip : e.stem; addEntry(e); saveProf(); renderPack(); return e.role; },
  removeClip(role) { const i = ST.P.clips.findIndex(c => c.role === role); if (i >= 0) { ST.P.clips.splice(i, 1); saveProf(); renderPack(); } return i >= 0; },
  async play(role) { const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '" in his pack'); await previewEntry(en); return { chip: $('chip').textContent, seconds: ST.act ? +ST.act.getClip().duration.toFixed(3) : 0 }; },
  setLayers(l) { Object.assign(ST.P.layers, l); $('lFeet').checked = !!ST.P.layers.feet; $('lGround').value = ST.P.layers.ground; saveProf(); },
  // turn a bone about an axis said in HIS frame (+X his left, +Y up, +Z the way he faces), at a clip time (source seconds);
  // added on top of any key already there. Returns the key list for that bone.
  async keyBone(role, bone, t, axis, deg) {
    const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '"');
    const bn = /^mixamorig_/.test(bone) ? bone : 'mixamorig_' + bone; if (!ST.tg.rig.bones[bn]) throw new Error('no bone ' + bn);
    if (ST.cur !== en) await previewEntry(en);
    const E = en.edit || {}, disp = Math.max(0, (t - ((E.trim && +E.trim[0]) || 0)) / (+E.speed || 1));
    ST.playing = false; ST.act.time = Math.min(disp, ST.act.getClip().duration); ST.tg.mixer.update(0); ST.tg.model.updateMatrixWorld(true);
    const A = { left: [1, 0, 0], right: [-1, 0, 0], up: [0, 1, 0], down: [0, -1, 0], forward: [0, 0, 1], back: [0, 0, -1] }[axis] || axis;
    const ax = new THREE.Vector3().fromArray(A).normalize().applyQuaternion(ST.tg.model.getWorldQuaternion(new THREE.Quaternion()));
    const P = ST.tg.rig.bones[bn].parent.getWorldQuaternion(new THREE.Quaternion()), R = new THREE.Quaternion().setFromAxisAngle(ax, deg * Math.PI / 180);
    en.fk = en.fk || {}; const keys = en.fk[bn] = en.fk[bn] || [];
    const D = P.clone().invert().multiply(R).multiply(P).multiply(F.fkAt(keys, t));
    const k = keys.find(x => Math.abs(x.t - t) < 1 / 60), q = [D.x, D.y, D.z, D.w].map(v => +v.toFixed(5));
    if (k) k.q = q; else { keys.push({ t: +(+t).toFixed(3), q }); keys.sort((a, b) => a.t - b.t); }
    saveProf(); await previewEntry(en, disp); return keys;
  },
  clearKeys(role, bone) { const en = ST.P.clips.find(c => c.role === role); if (!en || !en.fk) return; if (bone) delete en.fk[/^mixamorig_/.test(bone) ? bone : 'mixamorig_' + bone]; else delete en.fk; saveProf(); return previewEntry(en, ST.act ? ST.act.time : 0); },
  // a prop on one clip (role) or all ('*'): { prop: path or '' to remove, hand, size, move: [x,y,z] metres in his frame, turn: [x,y,z] degrees }
  async setProp(role, o) {
    const list = role === '*' ? ST.P.clips : ST.P.clips.filter(c => c.role === role); if (!list.length) throw new Error('no clip "' + role + '"');
    const first = list[0]; await previewEntry(first);
    if (o.prop !== undefined) { if (!o.prop) { delete first.prop; delete first.grip; } else { const hand = o.hand || 'Right'; first.prop = { file: o.prop, hand }; delete first.grip; } await propShow(first); }
    if (first.prop && PR.holder) {
      if (o.size) { first.prop.size = +o.size; PR.holder.scale.setScalar(first.prop.unit * first.prop.size); }
      if (o.move || o.turn) { const par = PR.holder.parent, wq = par.getWorldQuaternion(new THREE.Quaternion()), ws = par.getWorldScale(new THREE.Vector3()).x;
        if (o.move) PR.holder.position.add(new THREE.Vector3().fromArray(o.move).applyQuaternion(wq.clone().invert()).multiplyScalar(1 / ws));
        if (o.turn) { const e = new THREE.Euler(...o.turn.map(d => d * Math.PI / 180)), Rw = new THREE.Quaternion().setFromEuler(e); PR.holder.quaternion.premultiply(wq.clone().invert().multiply(Rw).multiply(wq)); }
        first.prop.pos = PR.holder.position.toArray(); first.prop.quat = PR.holder.quaternion.toArray(); }
    }
    for (const c of list) if (c !== first) { c.prop = first.prop ? JSON.parse(JSON.stringify(first.prop)) : undefined; c.grip = first.grip ? JSON.parse(JSON.stringify(first.grip)) : undefined; }
    saveProf(); await previewEntry(first); return first.prop || null;
  },
  async setGrip(role, o) {
    const list = role === '*' ? ST.P.clips : ST.P.clips.filter(c => c.role === role); if (!list.length) throw new Error('no clip "' + role + '"');
    for (const c of list) { if (!c.prop) continue; c.grip = c.grip || { on: false, reach: 1, off: [0, 0, 0] }; if (o.on !== undefined) c.grip.on = !!o.on; if (o.reach !== undefined) c.grip.reach = +o.reach; if (o.offset) c.grip.off = o.offset; }
    saveProf(); await previewEntry(list[0]); return list[0].grip || null;
  },
  // where the lens is: 'front' (his face), 'back', 'left' / 'right' (HIS sides), 'three' (three-quarter), 'top'; ghost off for a clean look
  view(name, ghost) {
    const hd = ST.tg.rig.bones.mixamorig_Head, H = hd ? (hd.getWorldPosition(new THREE.Vector3()).y * 1.12) : ST.tg.hipH * 2.2, V = { front: [0, .5, 1.7], back: [0, .5, -1.7], left: [1.7, .5, 0], right: [-1.7, .5, 0], three: [1.1, .6, 1.3], top: [0, 2.2, .01] }[name] || [1.7, .7, 2];
    orbit.target.set(0, H * .45, 0); cam.position.set(V[0] * H, V[1] * H, V[2] * H); orbit.update();
    if (ST.ghost) { ST.ghost.root.visible = !!ghost; if (!ghost) ST.ghost.help.visible = false; }
  },
  setTime(t) { if (!ST.act) return; const E = (ST.cur && ST.cur.edit) || {}; ST.playing = false; ST.act.time = Math.max(0, Math.min(ST.act.getClip().duration, (t - ((E.trim && +E.trim[0]) || 0)) / (+E.speed || 1))); ST.tg.mixer.update(0); if (ST.ghost) { const ga = ST.ghost.mix._actions[0]; if (ga) { ga.time = ST.ghost.a + ST.act.time * ST.ghost.sp; ST.ghost.mix.update(0); } } },
  profile_get: () => JSON.parse(JSON.stringify(ST.P)),
  // a socket: { move: [x,y,z] metres in his frame, turn: [x,y,z] degrees about his axes, reset: true }
  // hands: { role (omit = his default), right, left (a pose name, '' = as the source, '*' = his default -- clip only), amount, noise, speed }
  async setHands(o) {
    if (o.role) { const en = ST.P.clips.find(c => c.role === o.role); if (!en) throw new Error('no clip "' + o.role + '"'); en.hands = en.hands || {};
      for (const [k, sd] of [['right', 'Right'], ['left', 'Left']]) if (o[k] !== undefined) { if (o[k] === '*') delete en.hands[sd]; else en.hands[sd] = o[k]; }
      saveProf(); await previewEntry(en); return en.hands; }
    const D = ST.P.hands = ST.P.hands || {};
    if (o.right !== undefined) D.Right = { pose: o.right }; if (o.left !== undefined) D.Left = { pose: o.left };
    if (o.amount !== undefined) D.amt = +o.amount; if (o.noise !== undefined || o.speed !== undefined) D.noise = { amt: o.noise ?? (D.noise && D.noise.amt) ?? 0, hz: o.speed ?? (D.noise && D.noise.hz) ?? .6 };
    syncHands(); saveProf(); if (ST.cur) await previewEntry(ST.cur); return D;
  },
  handPoses: () => HPOSES,
  async setWrap(role, W) { const en = role ? ST.P.clips.find(c => c.role === role) : null; if (role && !en) throw new Error('no clip "' + role + '"');
    const tgt = en || ST.P; ST.wrapAx = {}; if (W && +W.r > 0) tgt.wrap = Object.assign({ r: +W.r }, W.tip ? { tip: +W.tip } : {}, W.up ? { up: W.up } : {}); else delete tgt.wrap; saveProf(); if (en) await previewEntry(en); return { wrap: tgt.wrap || null, at: ST.wraps }; },
  async setReach(role, R) { const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '"'); if (R && R.t) en.reach = R; else delete en.reach; saveProf(); await previewEntry(en); return en.reach || null; },
  mouthGap(role, t) { const en = ST.P.clips.find(c => c.role === role); const S = F.socketAuto(ST.tg.rig.bones.mixamorig_RightHand, 'Right'); ST.act.time = t; ST.tg.mixer.update(0); ST.tg.model.updateMatrixWorld(true); const m = F.mouthPoint(ST.tg), s = S.p.clone().applyMatrix4(ST.tg.rig.bones.mixamorig_RightHand.matrixWorld); return +(m.distanceTo(s) / ST.tg.hipH).toFixed(3); },
  async compose(role, upperRole, from) { const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '"'); if (upperRole) en.upper = { role: upperRole, from: from || 'Spine1' }; else delete en.upper; saveProf(); await previewEntry(en); return { chip: $('chip').textContent, seconds: +ST.act.getClip().duration.toFixed(2) }; },
  async edit(role, e) { const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '"'); en.edit = e && (e.trim || e.speed || e.inPlace) ? Object.assign({ trim: e.trim, speed: e.speed || 1 }, e.inPlace ? { inPlace: true } : {}) : undefined; saveProf(); await previewEntry(en); return en.edit || null; },
  // the measured reference speed of a locomotion clip on THIS body, the game's way: the planted (slower) foot's speed against the
  // hips, at its plateau, in the file's metres per second -- times the game's scale for him is his `walkRef` / `runRef`
  async gait(role) {
    const en = ST.P.clips.find(c => c.role === role); if (!en) throw new Error('no clip "' + role + '"'); await previewEntry(en);
    const c = ST.act.getClip(), B = ST.tg.rig.bones, n = Math.max(24, Math.round(c.duration * 60)), sp = [], V = () => new THREE.Vector3();
    let prev = null;
    for (let f = 0; f <= n; f++) { ST.act.time = c.duration * f / n; ST.tg.mixer.update(0); ST.tg.model.updateMatrixWorld(true);
      const h = B.mixamorig_Hips.getWorldPosition(V()), L = B.mixamorig_LeftFoot.getWorldPosition(V()).sub(h), R = B.mixamorig_RightFoot.getWorldPosition(V()).sub(h); L.y = R.y = 0;
      if (prev) { const dt = c.duration / n; sp.push(Math.min(L.distanceTo(prev[0]), R.distanceTo(prev[1])) / dt); } prev = [L, R]; }
    sp.sort((a, b) => a - b); const plateau = sp.slice(Math.floor(sp.length * .3), Math.floor(sp.length * .7)), v = plateau.reduce((a, b) => a + b, 0) / plateau.length;
    let lo = Infinity, hi = -Infinity; ST.tg.restore(); ST.tg.model.traverse(o => { if (o.isSkinnedMesh) { o.skeleton.update(); const p = o.geometry.attributes.position; for (let i = 0; i < p.count; i += 5) { const w = V().fromBufferAttribute(p, i); o.applyBoneTransform(i, w); w.applyMatrix4(o.matrixWorld); lo = Math.min(lo, w.y); hi = Math.max(hi, w.y); } } });
    await previewEntry(en); return { role, mps: +v.toFixed(4), authoredHeight: +(hi - lo).toFixed(4) };
  },
  async setSocket(side, o) {
    const S = ST.sock && ST.sock[side]; if (!S) throw new Error('no ' + side + ' hand socket');
    if (o.reset) { if (ST.P.sockets) delete ST.P.sockets[side]; if (S.auto) { S.node.position.copy(S.auto.p); S.node.quaternion.copy(S.auto.q); } S.node.userData.forged = 0; }
    else { const par = S.node.parent, wq = par.getWorldQuaternion(new THREE.Quaternion()), ws = par.getWorldScale(new THREE.Vector3()).x;
      if (o.move) S.node.position.add(new THREE.Vector3().fromArray(o.move).applyQuaternion(wq.clone().invert()).multiplyScalar(1 / ws));
      if (o.turn) { const Rw = new THREE.Quaternion().setFromEuler(new THREE.Euler(...o.turn.map(d => d * Math.PI / 180))); S.node.quaternion.premultiply(wq.clone().invert().multiply(Rw).multiply(wq)); }
      ST.P.sockets = ST.P.sockets || {}; ST.P.sockets[side] = { p: S.node.position.toArray(), q: S.node.quaternion.toArray() }; S.node.userData.forged = 1; }
    saveProf(); if (ST.cur && ST.cur.prop) { await propShow(ST.cur); if (ST.cur.grip && ST.cur.grip.on) await previewEntry(ST.cur, ST.act.time); }
    return ST.P.sockets ? ST.P.sockets[side] || 'auto' : 'auto';
  },
  seek(t) { ST.playing = false; if (ST.act) { ST.act.time = t; ST.tg.mixer.update(0); } },
  set(k, v) { ST.P.layers[k] = v; },
};
