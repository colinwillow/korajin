// npm run sceneexport [zone] [take] [--still] [--tex=1024] [--out=exports] -- THE SCENE OUT TO A DCC (EXPORT.md; his, Nov 7: "get that export ready
// so I can bring it into Cinema 4D, relight it, re-texture it, do a little style frame"). Boots the SHIPPED page in the zone (entry off, the reel
// ended), installs a fake clock and steps the shipped `frameBody` at 30 fps while the TAKE drives him (desk keys + `swapGo` for the draw), and
// samples, every frame, the local TRS of every node under his rig (bones -- the cape, IK and springs ride those -- the weapons, a hidden node's
// scale 0) plus a truck CAMERA. Then the visible scene goes through the vendored GLTFExporter as ONE .glb: metre scale, Y-up, meshes with their
// materials (KTX2 textures decompressed through the renderer, capped at --tex px), instanced chunks expanded to plain glTF instancing (nodes
// SHARING one mesh -- C4D imports that; EXT_mesh_gpu_instancing it may not) unless an instancer is huge, the sun and point lights as
// KHR_lights_punctual, the camera `cam_main` (yfov = the take's lens), and the baked clip `take`. Then it RE-IMPORTS the file in a fresh three page
// and renders cam_main at the take's middle: <out>/<zone>_<take>_check.jpg.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const pos = process.argv.slice(2).filter(a => !a.startsWith('--')), ZONE = pos[0] || 'garden', TAKE = pos[1] || 'test', STILL = process.argv.includes('--still');
const OUT = path.resolve(ROOT, arg('out', 'exports')), TEX = +arg('tex', 1024), FPS = 30; fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.hdr': 'application/octet-stream', '.mp3': 'audio/mpeg' };
const HANDLE = 'window.__ex = { frameBody, player, cam, rig, keys, stick, swapGo, WEAP, GEAR, renderer, scene, camera, GARDEN, THREE, groundAt, reelEnd, REEL }; ';
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (u === '/__check.html') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end('<!doctype html><script type="importmap">{"imports":{"three":"./vendor/three.module.min.js"}}</script><script type="module">import * as THREE from "three"; import { GLTFLoader } from "./vendor/GLTFLoader.js"; window.THREE = THREE; window.GLTFLoader = GLTFLoader; window.ready = 1;</script>'); }
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', HANDLE + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
await page.addInitScript(() => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); } catch (e) {} });
page.on('pageerror', e => console.log('  pageerror', e.message.split('\n')[0]));
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=${ZONE}&entry=0&grant=1`, { timeout: 240000, waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__ex && window.mel, null, { timeout: 300000, polling: 1000 });
await page.evaluate(() => { try { if (__ex.REEL.on) __ex.reelEnd(); } catch (e) {} });
await page.waitForTimeout(+arg('settle', 12) * 1000);
await page.evaluate(() => { try { if (__ex.REEL.on) __ex.reelEnd(); } catch (e) {} });
console.log(`booted ${ZONE} ${el()}`);

// ---- THE TAKE: drive him, sample every node under his rig + the truck camera -------------------------------------------------------------
const TAKES = {
  // the prologue garden: Grumbo walks across the zen circle's sand past the obelisk (`GARDEN.zen`), draws the katana at `drawAt`, slow truck alongside
  test: { zone: 'garden', from: [1.2, 9.6], to: [12.4, .6], dur: 7, drawAt: 3.6, walk: .42, still: 4.4,
    truck: { side: 6.5, up: 1.6, lead: -.4, speed: .55, look: 1.0, fov: 34 } },
};
const T = TAKES[TAKE]; if (!T) { console.log('no take', TAKE, Object.keys(TAKES)); process.exit(1); }
const take = await page.evaluate(([T, FPS, STILL]) => {
  const S = window.__ex, p = S.player, THREE = S.THREE, GO = S.GARDEN.on && S.GARDEN.on.G, G = GO ? GO.position : { x: 0, y: 0, z: 0 }; if (GO) GO.updateMatrixWorld(true);
  window.__clock = { t: performance.now(), dt: 1000 / FPS }; performance.now = () => window.__clock.t; const R0 = S.renderer.render; S.renderer.render = () => {}; window.__R0 = R0;
  const W = (u, v) => { if (!GO) return [u, v]; const q = GO.localToWorld(new THREE.Vector3(u, 0, v)); return [q.x, q.z]; }, A = W(...T.from), B = W(...T.to), dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, h = Math.atan2(ux, uz);
  try { if (S.GARDEN.sleep) S.GARDEN.sleep.on = 0; p.sleep = null; } catch (e) {}     // the prologue opens with him asleep in the hammock
  const gy = (x, z) => S.groundAt(x, z, (S.GARDEN.top || 0) + 30, 80);
  p.pos.set(A[0], gy(A[0], A[1]) + .05, A[1]); p.vel.set(0, 0, 0); p.faceH = p.heading = h; S.cam.az = h;
  for (const k in S.keys) S.keys[k] = 0;
  { const kk = S.WEAP.slots.findIndex(q => q.melee === 'katana'); const key = kk >= 0 && S.WEAP.slots[kk].key; if (key) { try { mel.grant((mel.OWN.slot && mel.OWN.slot[key]) || key, 1); } catch (e) {} } }     // the katana on his back (the prologue starts him without it)
  const step = () => { window.__clock.t += window.__clock.dt; S.frameBody(); };
  for (let i = 0; i < 20; i++) step();
  const s0 = [+p.pos.x.toFixed(2), +p.pos.y.toFixed(2), +p.pos.z.toFixed(2)], G0 = [G.x, G.y, G.z];
  // every node under his rig: name it uniquely (the uuid is the track binding; the readable name is set on export)
  const nodes = []; S.rig.root.traverse(o => nodes.push(o)); S.rig.root.name = 'char_grumbo';
  const n = STILL ? 1 : Math.round(T.dur * FPS), tr = nodes.map(() => ({ p: new Float32Array(n * 3), q: new Float32Array(n * 4), s: new Float32Array(n * 3) }));
  const cp = new Float32Array(n * 3), cq = new Float32Array(n * 4), camO = new THREE.PerspectiveCamera(T.truck.fov, 16 / 9, .05, 2000), hip = new THREE.Vector3();
  const k = S.WEAP.slots.findIndex(q => q.melee === 'katana'); let drew = 0; const hp = [];
  const side = [uz, -ux];     // the truck rides on the open side of his line (the obelisk and the floaters are on the other)
  const fr0 = STILL ? Math.round(T.still * FPS) : 0;
  for (let f = 0; f < (STILL ? fr0 + 1 : n); f++) {
    const t = f / FPS; S.cam.az = h; const go = t < T.dur - .3 && Math.hypot(B[0] - p.pos.x, B[1] - p.pos.z) > .6; const L0 = S.stick.L; L0.down = go ? 1 : 0; L0.x = 0; L0.y = go ? -T.walk : 0; L0.far = go ? T.walk : 0;     // a WALK: the left stick part-way (keys are a full push, a run)
    if (!drew && t >= T.drawAt && k >= 0) { try { if (S.player.slot !== k) S.swapGo(k); } catch (e) {} drew = 1; }
    step();
    const j = STILL ? 0 : f; if (STILL && f < fr0) continue;
    nodes.forEach((o, i) => { const R = tr[i]; let vis = true; for (let a = o; a && a !== S.rig.root.parent; a = a.parent) if (!a.visible) { vis = false; break; }
      R.p.set([o.position.x, o.position.y, o.position.z], j * 3); R.q.set([o.quaternion.x, o.quaternion.y, o.quaternion.z, o.quaternion.w], j * 4); const sc = vis ? 1 : 0; R.s.set([o.scale.x * sc, o.scale.y * sc, o.scale.z * sc], j * 3); });
    hp.push([p.pos.x, p.pos.y, p.pos.z]);
  }
  // THE TRUCK (CINEMA house style: a slow slide alongside, he walks across it): candidates on both sides of his line, at several distances and
  // heights; each is checked by RAYCAST from the lens to his chest at 8 moments against every visible mesh but his own -- the clearest wins
  const rc = new THREE.Raycaster(), meshes = []; S.scene.traverseVisible(o => { if (o.isMesh && !o.isSkinnedMesh) { let a = o; while (a && a !== S.rig.root) a = a.parent; if (!a) meshes.push(o); } });
  const camAt = (C, j, out) => { const t = j / FPS, kk = Math.min(1, t / T.dur), bx = A[0] + dx * (kk * T.truck.speed + (1 - T.truck.speed) * .5), bz = A[1] + dz * (kk * T.truck.speed + (1 - T.truck.speed) * .5);
    out.position.set(bx + side[0] * C.s, hp[j][1] + C.u, bz + side[1] * C.s); out.lookAt(hp[j][0], hp[j][1] + T.truck.look, hp[j][2]); };
  const cands = []; for (const sd of [-1, 1]) for (const d of [4, 5.5, 7]) for (const u of [1.4, 2.4]) cands.push({ s: sd * d, u });
  const v = new THREE.Vector3(); let best = null;
  for (const C of cands) { let blocked = 0; for (let q = 0; q < 8; q++) { const j = Math.min(hp.length - 1, Math.round(q / 7 * (hp.length - 1))); camAt(C, j, camO); camO.updateMatrixWorld();
      v.set(hp[j][0], hp[j][1] + T.truck.look, hp[j][2]); const d0 = camO.position.distanceTo(v); rc.set(camO.position, v.clone().sub(camO.position).normalize()); rc.far = d0 - .3;
      if (rc.intersectObjects(meshes, false).length) blocked++; }
    C.blocked = blocked; if (!best || blocked < best.blocked || (blocked === best.blocked && Math.abs(C.s) < Math.abs(best.s))) best = C; }
  for (let j = 0; j < hp.length; j++) { camAt(best, j, camO); cp.set([camO.position.x, camO.position.y, camO.position.z], j * 3); cq.set([camO.quaternion.x, camO.quaternion.y, camO.quaternion.z, camO.quaternion.w], j * 4); }
  // keep only the nodes that MOVE (a static bone's track is dead weight) -- but always his root
  const keep = nodes.map((o, i) => { const R = tr[i]; let d = 0; for (let a = 3; a < R.p.length; a++) d = Math.max(d, Math.abs(R.p[a] - R.p[a % 3])); for (let a = 4; a < R.q.length; a++) d = Math.max(d, Math.abs(R.q[a] - R.q[a % 4])); for (let a = 3; a < R.s.length; a++) d = Math.max(d, Math.abs(R.s[a] - R.s[a % 3])); return o === S.rig.root || d > 1e-5 || n === 1; });
  window.__take = { nodes, tr, keep, n, cp, cq, fov: T.truck.fov, drew, katana: k };
  const kg = S.WEAP.worn && S.WEAP.worn.katana && S.WEAP.worn.katana.group; let under = 0; for (let a = kg; a; a = a.parent) if (a === S.rig.root) under = 1;
  return { slot: p.slot, katanaWorn: !!kg, katanaUnderRig: under, truck: [best.s, best.u, best.blocked + '/8 blocked'], s0, G0, A, B, frames: n, nodes: nodes.length, moving: keep.filter(Boolean).length, drew, katana: k, start: [A[0], A[1]], end: [+p.pos.x.toFixed(2), +p.pos.z.toFixed(2)] };
}, [T, FPS, STILL]);
console.log(`take ${TAKE}${STILL ? ' (still)' : ''}: ${take.frames} frames, ${take.nodes} rig nodes (${take.moving} animated), katana slot ${take.katana} drawn ${take.drew}, he ended at ${take.end} ${el()}`); console.log(JSON.stringify({ slot: take.slot, katanaWorn: take.katanaWorn, katanaUnderRig: take.katanaUnderRig, truck: take.truck, s0: take.s0, G: take.G0, A: take.A, B: take.B }));

// ---- THE EXPORT --------------------------------------------------------------------------------------------------------------------------
await page.evaluate(r => { window.__RR = r; }, +arg('r', 110));
const res = await page.evaluate(async ([FPS, TEX, STILL]) => {
  const S = window.__ex, THREE = S.THREE, X = window.__take, { GLTFExporter } = await import('./vendor/GLTFExporter.js'), R = S.renderer;
  R.render = window.__R0;
  // the clip: every moving rig node by UUID (names repeat across characters), the camera by its own uuid
  const cam = new THREE.PerspectiveCamera(X.fov, 16 / 9, .05, 2000); cam.name = 'cam_main'; S.scene.add(cam); cam.position.fromArray(X.cp, 0); cam.quaternion.fromArray(X.cq, 0);
  const times = new Float32Array(X.n).map((_, i) => i / FPS), tracks = [];
  X.nodes.forEach((o, i) => { if (!X.keep[i]) return; const T = X.tr[i]; tracks.push(new THREE.VectorKeyframeTrack(o.uuid + '.position', times, T.p), new THREE.QuaternionKeyframeTrack(o.uuid + '.quaternion', times, T.q), new THREE.VectorKeyframeTrack(o.uuid + '.scale', times, T.s)); });
  tracks.push(new THREE.VectorKeyframeTrack(cam.uuid + '.position', times, X.cp), new THREE.QuaternionKeyframeTrack(cam.uuid + '.quaternion', times, X.cq));
  const clip = new THREE.AnimationClip('take', X.n / FPS, tracks);
  // put the rig at frame 0 (the file's rest state = the first frame)
  X.nodes.forEach((o, i) => { const T = X.tr[i]; o.position.fromArray(T.p, 0); o.quaternion.fromArray(T.q, 0); o.scale.fromArray(T.s, 0); });
  // only what is near the take (`--r` m round its middle): far islands and backdrops out, unless a mesh is one huge piece that reaches in
  const mid = new THREE.Vector3().fromArray(X.cp, Math.floor(X.n / 2) * 3), Rr = window.__RR || 110, sph = new THREE.Sphere(); let culled = 0;
  S.scene.traverseVisible(o => { if (!o.isMesh || o === cam) return; const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere(); if (o.isInstancedMesh && !o.boundingSphere) o.computeBoundingSphere && o.computeBoundingSphere();
    sph.copy(o.isInstancedMesh && o.boundingSphere ? o.boundingSphere : g.boundingSphere).applyMatrix4(o.matrixWorld); if (sph.center.distanceTo(mid) - sph.radius > Rr) { o.visible = false; culled++; } });
  // instancers -> nodes sharing one mesh (plain glTF instancing; C4D-safe), unless huge
  const swaps = []; let expanded = 0, keptExt = 0;
  S.scene.traverseVisible(o => { if (o.isInstancedMesh) swaps.push(o); });
  for (const im of swaps) { if (im.count > 3000) { keptExt++; continue; } const g = new THREE.Group(); g.name = (im.name || 'inst') + '_set'; g.matrixAutoUpdate = false; g.matrix.copy(im.matrix); g.matrixWorldNeedsUpdate = true;
    const M = new THREE.Matrix4(); for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, M); const m = new THREE.Mesh(im.geometry, im.material); m.name = (im.name || 'inst') + '_' + i; M.decompose(m.position, m.quaternion, m.scale); g.add(m); expanded++; }
    im.parent.add(g); g.position.copy(im.position); g.quaternion.copy(im.quaternion); g.scale.copy(im.scale); g.matrixAutoUpdate = true; im.visible = false; }
  // readable names for anything nameless
  let nm = 0; S.scene.traverse(o => { if (!o.name) o.name = (o.isMesh ? 'mesh_' : o.isLight ? 'light_' : 'node_') + (nm++); });
  // compressed (KTX2) textures -> canvases, through the renderer
  const utils = { async decompress(tex, max) { const img = tex.image || {}, w0 = img.width || 1024, h0 = img.height || 1024, k = Math.min(1, (max || 4096) / Math.max(w0, h0)), w = Math.max(1, Math.round(w0 * k)), h = Math.max(1, Math.round(h0 * k));
    const rt = new THREE.WebGLRenderTarget(w, h), srgb = tex.colorSpace === THREE.SRGBColorSpace, mat = new THREE.ShaderMaterial({ uniforms: { t: { value: tex } }, vertexShader: 'varying vec2 v; void main(){ v = uv; gl_Position = vec4(position.xy, 0., 1.); }',
      fragmentShader: 'uniform sampler2D t; varying vec2 v; void main(){ vec4 c = texture2D(t, v); gl_FragColor = ' + (srgb ? 'sRGBTransferOETF(c)' : 'c') + '; }', depthTest: false, toneMapped: false });
    const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat), sc = new THREE.Scene(); sc.add(q); q.frustumCulled = false; const oc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    R.setRenderTarget(rt); R.render(sc, oc); const px = new Uint8Array(w * h * 4); R.readRenderTargetPixels(rt, 0, 0, w, h, px); R.setRenderTarget(null); rt.dispose(); mat.dispose();
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const id = new ImageData(new Uint8ClampedArray(px.buffer), w, h); cv.getContext('2d').putImageData(id, 0, 0);
    const out = new THREE.Texture(cv); for (const k2 of ['wrapS', 'wrapT', 'magFilter', 'minFilter', 'colorSpace', 'channel', 'name']) out[k2] = tex[k2]; out.flipY = false; out.offset.copy(tex.offset); out.repeat.copy(tex.repeat); out.needsUpdate = true; return out; } };
  // a ShaderMaterial / RawShader is not glTF: it would come out WHITE. Stand-in: a MeshStandardMaterial with its first colour uniform and first texture
  // see-through FX (light shafts, glows, auras: a shader that is transparent, additive or writes no depth) has no glTF form at all -- left out
  let fx = 0; S.scene.traverseVisible(o => { if (!o.isMesh) return; const m = [].concat(o.material)[0]; if (m && m.isShaderMaterial && (m.transparent || m.blending === THREE.AdditiveBlending || m.depthWrite === false)) { o.visible = false; fx++; } });
  let shm = 0; S.scene.traverseVisible(o => { if (!o.isMesh) return; const conv = m => { if (!m || !m.isShaderMaterial) return m; const U = m.uniforms || {}; let col = null, map = null;
      for (const k2 in U) { const v = U[k2] && U[k2].value; if (!col && v && v.isColor) col = v; if (!col && v && v.isVector3 && /col|tint|diff|base|albedo/i.test(k2)) col = new THREE.Color(v.x, v.y, v.z); if (!map && v && v.isTexture && v.image && !v.isDataTexture && !v.isRenderTargetTexture) map = v; }
      const n = new THREE.MeshStandardMaterial({ color: col || 0xbfb8a8, map, roughness: .85, transparent: m.transparent, opacity: m.opacity != null ? m.opacity : 1, side: m.side, vertexColors: !!m.vertexColors }); n.name = (m.name || 'shader') + '_standin'; shm++; return n; };
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material); });
  // JPEG for every texture of an opaque material (glTF allows it; PNG only where alpha matters) -- the file was 140 MB with all-PNG
  const seenT = new Set(); S.scene.traverseVisible(o => { if (!o.isMesh) return; for (const m of [].concat(o.material)) { if (!m) continue; const opaque = !m.transparent && !(m.alphaTest > 0);
    for (const k2 of ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap']) { const t = m[k2]; if (t && !seenT.has(t)) { seenT.add(t); if (opaque || k2 !== 'map') t.userData.mimeType = 'image/jpeg'; } } } });
  // only the attributes a DCC reads: position, normal, uv, colour, skin -- the game's own (`aFl`, `_chunk`, uv1..) are dead weight there
  const KEEPA = new Set(['position', 'normal', 'uv', 'color', 'skinIndex', 'skinWeight']); let dropped = 0; S.scene.traverseVisible(o => { if (!o.isMesh) return; const g = o.geometry; for (const k2 of Object.keys(g.attributes)) if (!KEEPA.has(k2)) { g.deleteAttribute(k2); dropped++; } g.morphAttributes = {}; });
  const ex = new GLTFExporter(); ex.setTextureUtils(utils);
  const warn = []; const cw = console.warn; console.warn = (...a) => { warn.push(String(a[0]).slice(0, 140)); };
  let glb; try { glb = await ex.parseAsync(S.scene, { binary: true, onlyVisible: true, animations: STILL ? [] : [clip], maxTextureSize: TEX, includeCustomExtensions: false }); } finally { console.warn = cw; }
  const u8 = new Uint8Array(glb); window.__glb = u8;
  const wc = {}; for (const w of warn) { const k2 = w.replace(/\d+/g, '#').slice(0, 90); wc[k2] = (wc[k2] || 0) + 1; }
  let meshes = 0, lights = 0; S.scene.traverseVisible(o => { if (o.isMesh) meshes++; if (o.isLight) lights++; });
  const js = JSON.parse(new TextDecoder().decode(u8.subarray(20, 20 + new DataView(u8.buffer).getUint32(12, true)))); let imgB = 0; for (const im of js.images || []) imgB += js.bufferViews[im.bufferView].byteLength;
  return { fx, shm, dropped, culled, imgs: (js.images || []).length, imgMB: +(imgB / 1048576).toFixed(1), bytes: u8.length, expanded, keptExt, meshes, lights, warn: Object.entries(wc).sort((a, b) => b[1] - a[1]).slice(0, 8) };
}, [FPS, TEX, STILL]);
console.log(`exported ${(res.bytes / 1048576).toFixed(1)} MB: ${res.meshes} visible meshes, ${res.lights} lights, ${res.expanded} instances expanded (${res.keptExt} instancers kept as EXT); ${res.culled} meshes past --r left out; ${res.dropped} game-only attributes dropped; ${res.shm} shader materials stood in; ${res.fx} see-through FX left out; ${res.imgs} images ${res.imgMB} MB ${el()}`);
for (const [w, c] of res.warn) console.log(`   warn x${c}: ${w}`);
// pull the bytes out in chunks
const file = path.join(OUT, `${ZONE}_${TAKE}${STILL ? '_still' : ''}.glb`), fd = fs.openSync(file, 'w');
for (let o = 0; o < res.bytes; o += 8 << 20) { const b64 = await page.evaluate(([o, n]) => { const a = window.__glb.subarray(o, o + n); let s = ''; for (let i = 0; i < a.length; i += 32768) s += String.fromCharCode.apply(null, a.subarray(i, i + 32768)); return btoa(s); }, [o, 8 << 20]); fs.writeSync(fd, Buffer.from(b64, 'base64')); }
fs.closeSync(fd); console.log(`wrote ${path.relative(ROOT, file)} ${(fs.statSync(file).size / 1048576).toFixed(1)} MB`);
await page.close();

// ---- THE CHECK: re-import in a fresh three page, render cam_main at the take's middle --------------------------------------------------
const pg = await browser.newPage({ viewport: { width: 960, height: 540 } });
pg.on('pageerror', e => console.log('  check pageerror', e.message.split('\n')[0]));
await pg.goto(`http://127.0.0.1:${port}/__check.html`); await pg.waitForFunction('window.ready');
const chk = await pg.evaluate(async (url) => { const THREE = window.THREE, g = await new window.GLTFLoader().loadAsync(url), sc = g.scene;
  const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R.setSize(960, 540); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.NeutralToneMapping; document.body.appendChild(R.domElement);
  const cam = g.cameras.find(c => c.name === 'cam_main') || g.cameras[0]; sc.add(new THREE.HemisphereLight(0xdfe8f0, 0x8a8070, 1.2)); sc.background = new THREE.Color(0xcfd8e2);
  let lights = 0; sc.traverse(o => { if (o.isLight) { lights++; if (o.isDirectionalLight) o.castShadow = false; } });
  const clip = g.animations[0]; let mid = 0; if (clip) { const m = new THREE.AnimationMixer(sc); m.clipAction(clip).play(); mid = clip.duration / 2; m.setTime(mid); }
  sc.updateMatrixWorld(true); cam.aspect = 960 / 540; cam.updateProjectionMatrix(); R.render(sc, cam);
  let meshes = 0, skins = 0; sc.traverse(o => { if (o.isMesh) meshes++; if (o.isSkinnedMesh) skins++; });
  return { img: R.domElement.toDataURL('image/jpeg', .88), meshes, skins, lights, cams: g.cameras.map(c => c.name), clip: clip ? [clip.name, +clip.duration.toFixed(2), clip.tracks.length] : null, mid, yfov: cam.fov }; }, `/${path.relative(ROOT, file)}`);
const jf = file.replace(/\.glb$/, '_check.jpg'); fs.writeFileSync(jf, Buffer.from(chk.img.split(',')[1], 'base64'));
console.log(`re-imported: ${chk.meshes} meshes (${chk.skins} skinned), ${chk.lights} lights, cameras ${chk.cams.join(',')} (yfov ${chk.yfov}), clip ${JSON.stringify(chk.clip)} -> ${path.relative(ROOT, jf)} at t=${chk.mid.toFixed(2)} ${el()}`);
await browser.close(); server.close();
