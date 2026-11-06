// npm run check:boot -- DOES THE MODULE ACTUALLY EVALUATE?
//
// `check:syntax` PARSES. It cannot see a `const` read above its own declaration, a throw at
// module top level, an undeclared assignment, or a `getElementById` that comes back null -- and
// every one of those is a BLANK PAGE: the boot card sits at the text it was born with, `init()`
// never runs, and there is nothing on screen or in a phone's console to say why.
//
// It runs the REAL module. `three` resolves to the VENDORED build through a shim that swaps
// WebGLRenderer, WebGLRenderTarget and PMREMGenerator for fakes, because a headless node has no
// GL context and those are the only things in the file that need one. The DOM, the canvases and
// localStorage are stubbed to the surface the file actually touches.
//
// AND IT EXITS HARD, because once the module is up `init()` waits on fetches that will never
// resolve, and a gate whose pass looks like a hang is a gate nobody runs.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';

// THE `three` SHIM IS WRITTEN HERE RATHER THAN ASSUMED. `vendor/GLTFLoader.js` imports the bare
// specifier 'three', which the page resolves through its <script type="importmap"> and node
// cannot resolve at all. Writing it here means an unrelated `npm i` -- which rewrites
// node_modules and would take a shim written by some other tool away -- cannot make this gate
// fail with a module-not-found that looks exactly like the blank page it exists to catch.
// A gate that cries wolf after an unrelated install is a gate nobody runs.
if (!fs.existsSync('node_modules/three/package.json')) {
  fs.mkdirSync('node_modules/three', { recursive: true });
  fs.writeFileSync('node_modules/three/package.json', JSON.stringify({
    name: 'three', version: '0.180.0-vendored', type: 'module', main: 'index.js',
    exports: { '.': './index.js' } }, null, 2));
  fs.writeFileSync('node_modules/three/index.js', "export * from '../../vendor/three.module.min.js';\n");
}

const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!m) { console.error('no module script in index.html'); process.exit(1); }

const TMP = path.join(os.tmpdir(), 'melee-boot');
fs.mkdirSync(TMP, { recursive: true });
const ROOT = pathToFileURL(process.cwd() + '/').href;

fs.writeFileSync(path.join(TMP, 'three-shim.mjs'), `
export * from '${ROOT}vendor/three.module.min.js';
import * as T from '${ROOT}vendor/three.module.min.js';
class FakeTarget { constructor(w, h, o) { this.width = w; this.height = h; this.texture = new T.Texture();
  this.depthTexture = (o && o.depthTexture) || null; } setSize() {} dispose() {} }
export { FakeTarget as WebGLRenderTarget };
class FakeRenderer {
  constructor() { this.domElement = globalThis.document.createElement('canvas');
    this.shadowMap = { enabled: false, type: 0 };
    this.info = { autoReset: true, render: { calls: 0, triangles: 0 }, reset() {} };
    this.capabilities = { isWebGL2: true, getMaxAnisotropy: () => 1, precision: 'highp' };
    // A REAL RENDERER HAS an extensions object, and without it KTX2Loader.detectSupport throws
    // AT MODULE SCOPE -- which is a blank page, and is the class this gate exists for. It
    // answers NO to every compressed format, which is what a headless node honestly has.
    // A stub that answers every question cannot catch a wrong one, so get() returns undefined
    // for a format has() just refused rather than inventing an object.
    // NO BACKTICKS IN HERE: this whole shim is a template literal and one in a comment closes
    // it, which is a syntax error pointing at a line that is fine.
    this.extensions = { has: () => false, get: () => undefined, init() {} };
    this.outputColorSpace = ''; this.toneMapping = 0; this.toneMappingExposure = 1; }
  setSize(w, h) { this.domElement.width = w; this.domElement.height = h; }
  setPixelRatio() {} setClearColor() {} setRenderTarget() {} clear() {} render() {} dispose() {}
  compile() {} initTexture() {} getContext() { return { getParameter: () => 0 }; }
  getDrawingBufferSize(v) { return v.set(1280, 720); }
}
export { FakeRenderer as WebGLRenderer };
class FakePMREM { constructor() {} fromEquirectangular() { return { texture: new T.Texture() }; }
  compileEquirectangularShader() {} dispose() {} }
export { FakePMREM as PMREMGenerator };
`);

// STUBS:START -- lifted verbatim by any harness that needs the same headless page with a REAL
// fetch. A second harness with its own copy of these is two things to keep in step, which is
// the oldest mistake in this account; markers mean there is one copy.
const CTX2D = ['clearRect','fillRect','beginPath','moveTo','lineTo','arc','arcTo','closePath','fill','stroke',
  'save','restore','translate','rotate','scale','drawImage','fillText','strokeText','setTransform','clip',
  'quadraticCurveTo','bezierCurveTo','putImageData','ellipse','rect','setLineDash'];
function ctx2d() {
  const g = {};
  for (const k of CTX2D) g[k] = () => {};
  g.createLinearGradient = g.createRadialGradient = () => ({ addColorStop() {} });
  g.createImageData = g.getImageData = () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 });
  g.measureText = () => ({ width: 10 });
  return g;
}
const NODES = new Map();
function mkEl(tag = 'div', id = '') {
  return {
    tagName: (tag || 'div').toUpperCase(), id, nodeType: 1, children: [], childNodes: [], parentNode: null,
    style: new Proxy({}, { get: (t, k) => (k === 'setProperty' || k === 'removeProperty' ? () => {} : t[k] || ''),
                           set: (t, k, v) => (t[k] = v, true) }),
    dataset: {}, hidden: false, textContent: '', innerHTML: '', value: '', width: 1280, height: 720,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    appendChild(c) { this.children.push(c); this.childNodes.push(c); c.parentNode = this; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) { this.children.splice(i, 1); this.childNodes.splice(i, 1); } return c; },
    insertBefore(c) { return this.appendChild(c); },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    setAttribute() {}, getAttribute: () => null, removeAttribute() {},
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}, blur() {}, click() {}, remove() {},
    // A PAD LOOKS UP ITS OWN KNOB. Returning null here would be a TypeError at bind time, which
    // is the very class this gate exists for -- so the query answers for the one selector the
    // page actually uses and null for anything else.
    querySelector(sel) { return sel === '.knob' ? mkEl('div') : null; },
    querySelectorAll: () => [], contains: () => false, closest: () => null,
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 132, bottom: 132, width: 132, height: 132, x: 0, y: 0 }),
    getContext: () => ctx2d(), toDataURL: () => 'data:,',
  };
}
// A STUB THAT INVENTS AN ELEMENT FOR EVERY ID CAN NEVER CATCH A MISSING ONE. Returning a fresh
// div for whatever it is asked for means `getElementById('somethingDeleted')` succeeds here and
// returns NULL in the browser -- a TypeError at module scope, `init()` never running, and the
// boot card stuck for ever. That is exactly the failure this gate is for, and a stub that
// answers every question cannot catch a wrong one. The id set is parsed out of the page itself:
// markup attributes AND `el.id = '...'` assignments, so anything built at runtime still
// resolves, and an id that is genuinely not there returns null exactly as the browser does.
const DOMSRC = process.getBuiltinModule('fs').readFileSync('index.html', 'utf8');
const DOMIDS = new Set();
for (const mm of DOMSRC.matchAll(/\bid\s*=\s*["']([A-Za-z0-9_-]+)["']/g)) DOMIDS.add(mm[1]);
for (const mm of DOMSRC.matchAll(/\.id\s*=\s*["'`]([A-Za-z0-9_-]+)["'`]/g)) DOMIDS.add(mm[1]);
const doc = {
  body: mkEl('body'), documentElement: mkEl('html'), head: mkEl('head'),
  createElement: t => mkEl(t), createElementNS: (n, t) => mkEl(t), createTextNode: () => mkEl('text'),
  getElementById: id => {
    if (!DOMIDS.has(id)) return null;
    if (!NODES.has(id)) NODES.set(id, mkEl('div', id));
    return NODES.get(id);
  },
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {}, hidden: false, visibilityState: 'visible',
  fonts: { ready: Promise.resolve(), load: () => Promise.resolve() },
};
globalThis.document = doc;
globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.innerWidth = 1280; globalThis.innerHeight = 720; globalThis.devicePixelRatio = 2;
// node 22 defines `navigator` as a getter-only global, so it has to be REDEFINED rather than
// assigned -- and so does anything else the runtime already owns.
Object.defineProperty(globalThis, 'navigator', { configurable: true, writable: true,
  value: { userAgent: 'node', maxTouchPoints: 0 } });
// **AND THE GATE CAN BE POINTED AT EITHER WORLD (m124).** `MEL_WORLD=weirdport npm run
// check:boot` takes the Weirdport branch, which is otherwise a path no gate has ever evaluated
// -- and a `const` read above its own declaration in there is a blank page exactly as it is
// anywhere else. Empty is the game's own default, which is KIT CITY since m244.
const _w = process.env.MEL_WORLD || '';
globalThis.location = { href: 'http://x/' + (_w ? '?w=' + _w : ''), pathname: '/',
  search: _w ? '?w=' + _w : '', hash: '', reload() {}, replace() {} };
globalThis.localStorage = { _m: new Map(), getItem(k) { return this._m.has(k) ? this._m.get(k) : null; },
  setItem(k, v) { this._m.set(k, String(v)); }, removeItem(k) { this._m.delete(k); } };
// the world pick lives here since m244
globalThis.sessionStorage = { _m: new Map(), getItem(k) { return this._m.has(k) ? this._m.get(k) : null; },
  setItem(k, v) { this._m.set(k, String(v)); }, removeItem(k) { this._m.delete(k); } };
globalThis.addEventListener = () => {}; globalThis.removeEventListener = () => {};
globalThis.requestAnimationFrame = () => 0; globalThis.cancelAnimationFrame = () => {};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
globalThis.fetch = () => Promise.reject(new Error('offline'));
globalThis.Image = class { set src(v) {} addEventListener() {} };
// STUBS:END

let src = m[1].replace(/(from\s*)['"]three['"]/g, `$1'${pathToFileURL(path.join(TMP, 'three-shim.mjs')).href}'`);
src = src.replace(/(from\s*)['"]\.\/vendor\//g, `$1'${ROOT}vendor/`);
src = (html.match(/<script id="jinpal">([\s\S]*?)<\/script>/) || [0, ''])[1] + '\n' + src;     // the JINRA palette (head script) runs ahead of the module, as on the page
// AND THE WORLD BUILDERS ARE CALLED DIRECTLY (m1427). `init()` awaits asset loads that never resolve here, so a world's builder past
// those awaits was never evaluated by this gate at all -- Grumbo's home threw for builds while it said boot ok. MEL_WORLD=home calls
// `buildHome()` itself, after the module has run; its catch logs "HOME BUILD THREW", which fails the gate (below).
// AND IT STEPS FRAMES (Worker B, m1442: homeStep threw a ReferenceError on EVERY frame and the gate, which built but never stepped, passed it).
// m2714: MEL_WORLD='test&gate=reach' -- spawned enemies stand on ground near him, and one 5 m below him cannot hit him (`spawnGate`)
if (/gate=reach/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { console.log("[gate] spawn/reach " + spawnGate()); };';
if (_w === 'home') src += '\nglobalThis.__bootWorld = async () => { await buildHome(); ctxRender = () => {}; for (let i = 0; i < 8; i++) { last = performance.now() - 16; frameBody(); if (HOME.live) homeStep(1 / 60); } };     /* homeStep sits behind rig.ready, which never comes here */\n';
// m2309: MEL_WORLD='forge&zone=fxlab' builds THE FX LAB and steps it with every move fired (FX.md)
if (/zone=fxlab/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { fxlabBuild(); for (const n of FX.names) fxlabFire(n); goopHit(0, 1, 2, 1); goopDodge(); for (let i = 0; i < 40; i++) { fxlabStep(1 / 60); goopStep(1 / 60); } };';
// m2418: MEL_WORLD='forge&zone=boulders' builds FLOATING BOULDERS (BOULDERS.md) and steps the field
if (/zone=boulders/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { bouldBuild(); for (let i = 0; i < 30; i++) bouldStep(1 / 60); if (!BOULD.on) throw new Error("BOULDERS did not build"); const r = BOULD.L.rows[20]; bouldMelee(r.p.x, r.p.y, r.p.z, .5, 0); const r2 = BOULD.L.rows.filter(q => isFinite(q.hp0) && q.hp0 < 3).sort((a, b) => a.hp0 - b.hp0)[0]; /* m2498: a SMALL rock (by hp, not by row index -- the mandala turn reorders the rows, and a big rock only cracks from one blast) */ rockArea(r2.p.x, r2.p.y, r2.p.z, 3, 3); bouldArrow(BOULD.L.rows[5].p.clone(), new THREE.Vector3(0, 0, -30), 1); for (let i = 0; i < 60; i++) bouldStep(1 / 30); if (!BOULD.st.breaks) throw new Error("BOULDERS: a power-3 blast broke nothing"); BOULD.aura = 1; for (let i = 0; i < 20; i++) bouldStep(1 / 30); BOULD.aura = 0; bouldStep(1 / 30); /* m2430: his crash -- a long barrage of arrows (normal + blast) into the field, through breaks and regrowth, the bow drawn (the arc flies every frame) */ const p = player; p.slot = Math.max(0, WEAP.slots.findIndex(s => s.bow)); p.aim = 1; for (let k = 0; k < 900; k++) { if (k % 6 === 0) { const rs = BOULD.L.rows.filter(r => !r.gone), r = rs[(k * 7) % rs.length]; if (r) { const o = p.pos.clone(); o.y += 1.4; const d = r.p.clone().sub(o), T = Math.max(.15, d.length() / 40), m = arrowMesh(); m.position.copy(o); scene.add(m); ARROWS.push({ m, v: d.divideScalar(T), t: 0, stuck: 0, from: null, mine: 1, pl: 1, gk: 1, type: k % 18 ? "normal" : "blast", full: 1, col: [1, .3, .1], dmg: 2, pow: 1 }); } } p.bowT = BOW.full; arrowStep(1 / 30); bowArc(1); bouldStep(1 / 30); } if (BOULD.st.breaks < 3) throw new Error("BOULDERS: the barrage broke " + BOULD.st.breaks); /* m2480: the kit row, an urn shatters */ if (!BOULD.kit || !BOULD.urns || !BOULD.urns.length) throw new Error("DESERT KIT: no kit row / urns"); const U0 = BOULD.urns[0].g.getWorldPosition(new THREE.Vector3()); if (!bouldUrnHit(U0.x, U0.y + .5, U0.z, .5)) throw new Error("DESERT KIT: an urn did not break"); for (let i = 0; i < 10; i++) bouldStep(1 / 30); /* m2489: the field follows him -- a 60 m walk out from the landing, a trough under him at every metre */ { const L = BOULD.L, [x0, z0] = L.F.clear; for (let k = 0; k <= 60; k++) { const z = z0 - k; L.follow(x0, z); L.plough(x0, z, .22, .06, 0, -1, 2.7, .8); L.patchAt(x0, z); if (!(L.heightAt(x0, z) < -.01)) throw new Error("SAND: no deformation " + k + " m from the landing"); } } /* m2494: the slam shockwave ripples the sand: a crest out at 1.5-3 m, then gone (the sand kept) */ { const L = BOULD.L, [x0, z0] = L.F.clear, hs = []; L.follow(x0, z0); L.shock(x0, z0, 1.2); for (let i = 0; i < 90; i++) { L.step(1 / 60); hs.push(L.heightAt(x0 + 2.5, z0)); } const hEnd = hs[hs.length - 1], pk = Math.max(...hs.map(h => Math.abs(h - hEnd))); /* against what the sand is LEFT at (the streaks stay), so only the passing wave counts */ if (pk < .02) throw new Error("SHOCK: no wave passed 2.5 m out (" + pk + ")"); if (L.waves()) throw new Error("SHOCK: the wave never ended"); } /* m2496: the giants are placed and every vertex is a number (an `h: undefined` once NaN-ed them all, drawing nothing) */ { const G = BOULD.giants || {}, ids = Object.keys(G); if (ids.length < DPLACE.giants.length) throw new Error("GIANTS: placed " + ids.length + " of " + DPLACE.giants.length); for (const id of ids) G[id].traverse(o => { if (o.isMesh) { const a = o.geometry.attributes.position.array; for (let i = 0; i < a.length; i++) if (!isFinite(a[i])) throw new Error("GIANTS: NaN in " + id + " " + o.name); } }); if (!BOULD.anim || !BOULD.anim.length) throw new Error("GIANTS: nothing turns"); } /* m2499: the floaters he can ride have boxes, and the course climbs */ { const L = BOULD.L, cs = L.rows.filter(r => r.course); if (!BOULD.ride || BOULD.ride.length < 8) throw new Error("RIDE: rideable " + (BOULD.ride ? BOULD.ride.length : 0)); if (cs.length !== 4) throw new Error("COURSE: " + cs.length + " steps"); for (let k = 1; k < 4; k++) if (!(L.rideTop(cs[k]) > L.rideTop(cs[k - 1]) + .5)) throw new Error("COURSE: step " + (k + 1) + " does not climb"); const r = cs[1], y0 = r.o.y; L.land(r, 0, -6, 0, r.p.x, r.p.z); for (let i = 0; i < 6; i++) L.step(1 / 60); if (!(r.o.y < y0 - .02)) throw new Error("RIDE: a landing did not push the stone down"); } /* m2543: sand everywhere -- the region ring exists, his feet find sand far out, and the east dune sea has crests */ { const L = BOULD.L; let rg = 0; L.group.traverse(o => { if (o.name === "boulders:region") rg = o; }); if (!rg) throw new Error("REGION: no region sand"); const g = BOULD.gH(400, -20); if (!(isFinite(g) && g > -1)) throw new Error("REGION: no ground at 400 m (" + g + ")"); let hi = 0; for (let k = 0; k < 60; k++) hi = Math.max(hi, L.sandH(300 + k * 8, -6)); if (hi < 6) throw new Error("REGION: the east dune sea has no crests (" + hi.toFixed(1) + " m)"); } /* m2554: the region floaters -- over a hundred, on several tiers, every one a number, the low tier solid */ { const K = BOULD.skyRocks; if (!K || K.rows.length < 100) throw new Error("FLOATERS: " + (K ? K.rows.length : 0)); const tiers = new Set(K.rows.map(r => r.ti)); if (tiers.size < 4) throw new Error("FLOATERS: only " + tiers.size + " height tiers"); for (const r of K.rows) if (!isFinite(r.hy + r.x + r.z + r.s) || r.hy < r.g + 2) throw new Error("FLOATERS: bad row " + r.id); let col = 0; BOULD.colG.traverse(o => { if (o.name === "col:desert:floaters") col = 1; }); if (!col) throw new Error("FLOATERS: the low tier has no collider"); } /* m2567: the Sky Ascent -- six stages to +140, and no stone-to-stone rise past his jump (2.81 m apex) */ { const A = BOULD.ascent; if (!A || A.tops.length !== 6) throw new Error("ASCENT: " + (A ? A.tops.length : 0) + " stages"); if (!(A.tops[5][1] - A.c[1] > 139)) throw new Error("ASCENT: the top is not at +140"); for (let i = 1; i < A.path.length; i++) { const d = A.path[i][1] - A.path[i - 1][1]; if (d > 2.5 && d < 4) throw new Error("ASCENT: stone " + i + " rises " + d.toFixed(2)); } } /* m2687: the giant flora is placed, coloured and in budget */ { const F2 = BOULD.flora; if (!F2 || F2.n < 60) throw new Error("FLORA: " + (F2 ? F2.n : 0) + " plants"); if (F2.tris > 90000) throw new Error("FLORA: " + F2.tris + " tris"); let col = 0; BOULD.place.traverse(o => { if (o.isMesh && o.material && /dk_bigflora/.test(o.material.name) && o.geometry.attributes.color) col++; }); if (!col) throw new Error("FLORA: merged without its colours"); } };';
// FOREST_TEMPLE.md: MEL_WORLD='forge&zone=ftemple' builds CHAMBER 1, registers its pieces, wakes the archers, shoots the switch, rides the slab,
// presses the button and steps until the door is open and the last fight is called
if (/zone=ftemple/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { if (!FTEMPLE.on) throw new Error("FTEMPLE did not build"); for (let i = 0; i < 60; i++) ftinStep(1 / 30); const L = FTEMPLE.L; if (!FTEMPLE.on.reg) throw new Error("FTEMPLE: nothing registered"); ftinArrow(new THREE.Vector3(...L.targets.find(t => t.id === "r1_target").p)); if (!FTEMPLE.B) throw new Error("FTEMPLE: no B puzzle"); ftinArrow(new THREE.Vector3(...FTEMPLE.B.ts[0].p)); if (FTEMPLE.B.k !== 0) throw new Error("FTEMPLE B: a wrong switch did not reset"); for (const i of FT_B.order) ftinArrow(new THREE.Vector3(...FTEMPLE.B.ts[i].p)); if (FTEMPLE.B.k !== 3) throw new Error("FTEMPLE B: the order did not solve it (" + FTEMPLE.B.k + ")"); if (!L.movers[0].on) throw new Error("FTEMPLE: the switch did not wake the slab"); ftinPress(L.plates[0]); for (let i = 0; i < 150; i++) ftinStep(1 / 30); if (FTEMPLE.room.door !== 2) throw new Error("FTEMPLE: the door did not open"); ftinMelee(L.pots[0].x, L.pots[0].y + .3, L.pots[0].z, .5); if (!FTEMPLE.st.pots) throw new Error("FTEMPLE: a swing broke no pot"); { const LL = LIFT.on; if (!LL || LL.side !== "in") throw new Error("FTEMPLE: no lift"); player.pos.set(LL.x, LL.y + FTLIFT.step, LL.z); player.grounded = true; LL.armed = 1; ftLiftStep(1 / 30); if (LL.st !== "ride" || !player.lift) throw new Error("FTEMPLE: the lift did not start (" + LL.st + ")"); for (let i = 0; i < 20; i++) ftLiftStep(1 / 30); if (!(LL.plat.position.y > 0)) throw new Error("FTEMPLE: the lift did not rise"); LL.st = "idle"; player.lift = 0; LL.plat.position.y = 0; } if (!FTEMPLE.hub) throw new Error("FTEMPLE: no hub (sockets)"); const nG = WHIP.pulls.filter(q => /ftemple.gate/.test(q.id)).length; if (nG !== 3) throw new Error("FTEMPLE: whip gates " + nG); whipPull(WHIP.pulls.find(q => /ftemple.gate/.test(q.id)), 0); ftinShard("A"); if (!ftinHas("A") || !document.getElementById("ftHud")) throw new Error("FTEMPLE: the shard / the HUD"); { const C = FTEMPLE.C; if (!C) throw new Error("FTEMPLE: no C"); const an = WHIP.anchors.filter(q => /^ftC_/.test(q.id)); if (an.length !== 3) throw new Error("FTEMPLE C: anchors " + an.length); const E = L.FTB.P(0, -16.5, 12.8), d = (p, q) => Math.hypot(p[0] - q.x, p[1] - q.y, p[2] - q.z), hops = [d(E, an[0]), Math.hypot(an[0].x - an[1].x, an[0].y - an[1].y, an[0].z - an[1].z), d([an[1].x, an[1].y - 6, an[1].z], an[2])]; if (hops.some(h => h > WHIP.reach)) throw new Error("FTEMPLE C: a hop past the whip reach " + hops.map(h => h.toFixed(1))); for (let i = 0; i < 180; i++) ftinStep(1 / 30); if (!C.crack.open) throw new Error("FTEMPLE C: the crack did not open"); console.log("[melee] FTEMPLE C hops (arena->knot1, knot1->knot2, hanging->zip): " + hops.map(h => h.toFixed(1)).join(", ") + " m (reach " + WHIP.reach + ")"); } { FTEMPLE.prog.whip = 1; const G = WHIP.pulls.find(q => q.id === "ftemple.gate.D"); whipPull(G, 0); if (!G.done) throw new Error("FTEMPLE D: the whip did not open its gate"); const dam = WHIP.pulls.find(q => q.id === "ftD_dam"); if (!dam || !dam.live()) throw new Error("FTEMPLE D: no live dam"); whipPull(dam, 0); for (let i = 0; i < 200; i++) ftinStep(1 / 30); if (!FTEMPLE.prog.dDry || (FTEMPLE.D.falls && FTEMPLE.D.falls.visible)) throw new Error("FTEMPLE D: the dam did not drain the well"); console.log("[melee] FTEMPLE D: gate pulled open, dam pulled, the fall stopped"); } { const G = WHIP.pulls.find(q => q.id === "ftemple.gate.E"); whipPull(G, 0); if (!G.done) throw new Error("FTEMPLE E: the gate did not open"); const K = WHIP.anchors.filter(q => /^ftE_knot/.test(q.id)); if (K.length !== 6) throw new Error("FTEMPLE E: knots " + K.length); const N = L.FTE.P(0, 1.5, 2.6), Fp = L.FTE.P(0, 1.5, 49.5), d3 = (a, b) => Math.hypot(a[0] - b.x, a[1] - b.y, a[2] - b.z); const hops = [d3(N, K[0])]; for (let i = 1; i < 6; i++) hops.push(Math.hypot(K[i].x - K[i - 1].x, K[i].y - K[i - 1].y, K[i].z - K[i - 1].z)); hops.push(d3(Fp, K[5])); if (hops.some(h => h > WHIP.reach)) throw new Error("FTEMPLE E: a hop past reach " + hops.map(h => h.toFixed(1))); const wl = L.FTE.P(-11, 0, 25), mid = L.FTE.P(0, 0, 25); if (!WRUN.refuse({}, wl[0], wl[2]) || WRUN.refuse({}, mid[0], mid[2])) throw new Error("FTEMPLE E: the thorn walls are not refusing"); console.log("[melee] FTEMPLE E: gate pulled; knots " + hops.map(h => h.toFixed(1)).join(" / ") + " m; side walls refuse a wall run"); } { const E2 = FTEMPLE.E2; if (!E2) throw new Error("FTEMPLE E2: none"); for (let i = 0; i < 2; i++) whipPull(WHIP.pulls.find(q => q.id === "ftE_lever" + i), 0); let pulls = 0; for (let i = 0; i < 2; i++) { const pl = E2.plates[i], c = E2.crates[i], Bq = L.FTE, back = Bq.P(FT_E2.plates[i][0], 0, 49.6); for (let n = 0; n < 8 && Math.hypot(c.x - pl.x, c.z - pl.z) > FT_E2.plateR * .6; n++) { player.pos.set(back[0], 0, back[2]); whipPull(WHIP.pulls.find(q => q.id === "ftE_crate" + i), 0); pulls++; for (let k = 0; k < 45; k++) ftinE2Step(1 / 30); } } for (let k = 0; k < 90; k++) ftinE2Step(1 / 30); if (!E2.open || E2.u < 1) throw new Error("FTEMPLE E2: the gate did not rise (levers " + E2.levers.map(q => q.on) + ", plates " + E2.plates.map(q => q.on) + ")"); console.log("[melee] FTEMPLE E2: both levers, both crates on their plates in " + pulls + " pulls, the gate up"); } { const B = L.FTF, G = WHIP.pulls.find(q => q.id === "ftemple.gate.F"); whipPull(G, 0); if (!G.done) throw new Error("FTEMPLE F: the gate did not open"); const A = WHIP.anchors.filter(q => /^ftF_zip/.test(q.id)); if (A.length !== 3) throw new Error("FTEMPLE F: anchors " + A.length); const stand = [B.HP(B.H(2), 7.5, -12.7), B.HP(B.H(2), 9.5, -3.9), B.HP(B.H(1), 9.5, 5.1)], hops = stand.map((p, i) => Math.hypot(p[0] - A[i].x, p[1] - A[i].y, p[2] - A[i].z)), ys = [-14.2, ...FT_F.anchors.map(q => q[1])], rises = ys.slice(1).map((y, i) => y - ys[i]); if (hops.some(h => h > WHIP.reach)) throw new Error("FTEMPLE F: a zip past reach " + hops.map(h => h.toFixed(1))); if (rises.some(r => r <= 8.6)) throw new Error("FTEMPLE F: a ledge within his reach " + rises); const c = B.P(0, 0, B.C); if (!WRUN.refuse({}, c[0] + 11, c[2])) throw new Error("FTEMPLE F: the core wall takes a wall run"); console.log("[melee] FTEMPLE F: gate pulled; zips " + hops.map(h => h.toFixed(1)).join(" / ") + " m; ledges " + rises.map(r => r.toFixed(1)).join(" / ") + " m up (his best 8.6); the core refuses a wall run"); } { const X = L.FTX, S = FTEMPLE.seal; if (!S || S.st !== "shut") throw new Error("FTEMPLE SEAL: none / not shut"); FTEMPLE.prog.shards = ["A", "B", "C", "D", "E", "F"]; ftinSealLight(); player.pos.set(X.c[0], .05, X.c[1] + 1); for (let i = 0; i < 150; i++) ftinStep(1 / 30); if (S.st !== "open" || BOXES.includes(S.box)) throw new Error("FTEMPLE SEAL: did not open (" + S.st + ")"); { const T = X.tread(40); player.pos.set(T.x, T.y + .05, T.z); player.vel.set(0, 0, 0); for (let i = 0; i < 40; i++) stepPlayer(1 / 60); if (Math.abs(player.pos.y - T.y) > .1) throw new Error("FTEMPLE SEAL: he does not stand on tread 40 (" + T.y.toFixed(2) + " -> " + player.pos.y.toFixed(2) + ")"); const Q = L.FTB.P(0, -18.3, 20); player.pos.set(Q[0], Q[1] + .05, Q[2]); for (let i = 0; i < 40; i++) stepPlayer(1 / 60); if (Math.abs(player.pos.y - (-18)) > .5) throw new Error("FTEMPLE C: he does not stand on the arena floor (" + player.pos.y.toFixed(2) + ")"); } let worst = 0, prev = 0, miss = []; for (let i = 0; i < X.n; i++) { const T = X.tread(i), g = groundAt(T.x, T.z, T.y + .9, 2); if (Math.abs(g - T.y) > .05) miss.push(i + ":" + (+g).toFixed(2) + "/" + T.y.toFixed(2)); worst = Math.max(worst, prev - T.y); prev = T.y; } if (miss.length) throw new Error("FTEMPLE SEAL: treads not underfoot " + miss.slice(0, 6)); if (worst > .32) throw new Error("FTEMPLE SEAL: a riser " + worst); const a = (X.door + .5) * Math.PI / 6, D = [X.c[0] + Math.cos(a) * 4.2, X.c[1] + Math.sin(a) * 4.2], gd = groundAt(D[0], D[1], X.bot + 1.5, 2); if (Math.abs(gd - X.bot) > .05) throw new Error("FTEMPLE SEAL: no floor in the trunk doorway " + gd); const ga = groundAt(X.c[0] + 10, X.c[1], X.bot + 1.5, 2); if (Math.abs(ga - X.bot) > .05) throw new Error("FTEMPLE SEAL: no root-hall floor " + ga); console.log("[melee] FTEMPLE SEAL: opened at six shards; " + X.n + " treads all underfoot, riser " + worst.toFixed(3) + " m; the trunk doorway and the root hall floor at " + X.bot); } console.log("[melee] FTEMPLE in: " + JSON.stringify(L.count()) + " slab at x " + L.movers[0].g.position.x.toFixed(2)); };';
// VINEWHIP.md: MEL_WORLD='forge&zone=whip' builds the whip sandbox's stations and checks its rows (anchors into the grapple's list)
if (/zone=whip/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { whipBuild(); for (let i = 0; i < 10; i++) whipZoneStep(1 / 30); const L = WHIPZ.L; if (!WHIPZ.on || !L.anchors.length || !L.pulls.length) throw new Error("WHIP did not build"); if (!WHIP.anchors.length) throw new Error("WHIP: no anchors"); const ix = WEAP.slots.findIndex(q => q.whip); if (ix < 0) throw new Error("WHIP: no slot"); player.slot = ix; const k = WHIP.anchors.find(a => a.id === "B_knot1"); player.pos.set(32.04, 8, -18.5); player.vel.set(0, 0, 0); player.grounded = true; whipGo(Math.atan2(k.x - player.pos.x, k.z - player.pos.z)); if (!player.rope || !player.rope.whip) throw new Error("WHIP: the lash at the knot did not hang him on it"); for (let i = 0; i < 40; i++) { whipStep(1 / 30); if (player.rope) stepRope(1 / 30); } const k2 = WHIP.anchors.find(a => a.id === "B_knot2"); if (player.rope) { whipGo(Math.atan2(k2.x - player.pos.x, k2.z - player.pos.z)); if (!WHIP.stat.chain) throw new Error("WHIP: no chain to knot 2 (dist " + Math.hypot(k2.x - player.pos.x, k2.y - player.pos.y, k2.z - player.pos.z).toFixed(1) + ")"); for (let i = 0; i < 10; i++) { whipStep(1 / 30); if (player.rope) stepRope(1 / 30); } if (player.rope) { player.vel.x += 4; player.jump = 1; stepRope(1 / 30); } } player.rope = null; const z = WHIP.anchors.find(a => a.id === "C_zip10"); player.pos.set(z.x + Math.sin(.3) * 6, 0, z.z + 6); player.vel.set(0, 0, 0); player.grounded = true; whipGo(Math.atan2(z.x - player.pos.x, z.z - player.pos.z)); if (!player.rope || !player.rope.zip) throw new Error("WHIP: the zip anchor did not take"); for (let i = 0; i < 90 && player.rope; i++) { whipStep(1 / 30); stepRope(1 / 30); } if (player.rope) throw new Error("WHIP: the zip never arrived"); player.rope = null; const cr = L.pulls.find(q => q.kind === "crate"), lv = L.pulls.find(q => q.kind === "lever"), shp = L.pulls.find(q => q.kind === "shield"); player.pos.set(cr.x + 9, 0, cr.z); const cx0 = cr.x; whipPull(cr, 0); whipPull(lv, 0); whipPull(shp, 0); for (let i = 0; i < 60; i++) whipStep(1 / 30); if (Math.abs(cr.x - cx0) < .5) throw new Error("WHIP: a pulled crate did not slide"); if (!lv.on || !shp.ripped) throw new Error("WHIP: the lever / shield did not answer"); player.rope = null; whipGo(0); for (let i = 0; i < 20; i++) whipStep(1 / 30); console.log("[melee] WHIP: " + JSON.stringify(L.count()) + " " + JSON.stringify(WHIP.stat)); };';
// m2318: MEL_WORLD='forge&zone=lake' builds THE LAKE (WATER.md), stands him on the beach and runs the waves
if (/zone=lake/.test(_w)) src += '\nglobalThis.__bootWorld = async () => { lakeBuild(); for (let i = 0; i < 30; i++) lakeStep(1 / 60); if (!LAKEZ.on) throw new Error("THE LAKE did not build"); const B = LAKEZ.L.boat; B.setMode(\"cruise\"); B.yaw = 0; for (let i = 0; i < 90; i++) LAKEZ.L.step(1 / 30); if (B.v < 1) throw new Error(\"THE LAKE: the boat did not cruise\"); if (Math.abs(B.w) > .02 && !(B.bankDot > 0)) throw new Error(\"THE LAKE: the boat leans OUT of its turn (up . inside \" + B.bankDot + \")\"); console.log(\"[melee] the lake: cruising \" + B.v.toFixed(2) + \" m/s, turn \" + B.w.toFixed(3) + \" rad/s, bank up.inside \" + (B.bankDot || 0).toFixed(3)); B.setMode(\"helm\"); B.ctl.thr = 1; B.ctl.turn = 1; const y0 = B.yaw; for (let i = 0; i < 60; i++) LAKEZ.L.step(1 / 30); B.ctl.thr = 0; B.ctl.turn = 0; if (!(B.vT > 4)) throw new Error(\"THE LAKE: the throttle does not hold (vT \" + B.vT + \")\"); if (!(B.yaw < y0)) throw new Error(\"THE LAKE: stick right did not turn it right\"); console.log(\"[melee] the lake helm: throttle \" + B.vT.toFixed(1) + \" m/s, v \" + B.v.toFixed(2) + \", stick right turned \" + (B.yaw - y0).toFixed(2) + \" rad, hits \" + (B.hit || 0)); const w = LAKEZ.L.waveAt(0, 0, 1); console.log("[melee] the lake: spawn " + LAKEZ.L.spawn.map(v => v.toFixed(1)).join(",") + ", ground there " + groundAt(LAKEZ.L.spawn[0], LAKEZ.L.spawn[2], 50, 99).toFixed(2) + ", wave at 0,0 " + w.y.toFixed(3) + ", " + JSON.stringify(LAKEZ.L.count())); };';
const f = path.join(TMP, 'boot.mjs');
fs.writeFileSync(f, src);

// THE ASSET FAILURES ARE THE ENVIRONMENT, NOT THE CODE. node has no relative-URL base, so every
// load rejects before it reaches the network; failing on those would make the gate cry wolf on
// every run and nobody would read it twice. Anything ELSE that rejects is a real fault -- which
// is how a throw inside `init()` reaches the boot card in the real game.
const ENVY = /Invalid URL|Failed to parse URL|ERR_INVALID_URL|ENOTFOUND|fetch failed|offline|THREE\.GLTFLoader/i;
let failed = null;
const note = e => { const t = (e && (e.stack || e.message)) || String(e); if (!ENVY.test(t)) failed = failed || e; };
process.on('unhandledRejection', note);
process.on('uncaughtException', note);
const quiet = console.error, quietW = console.warn;
// A BUILD THAT THROWS INSIDE ITS OWN try/catch IS STILL A BROKEN PAGE (Worker B, m1424: `buildHome` caught ghomeBuild's throw and logged
// "HOME BUILD THREW", and this printed boot ok). Any logged line saying THREW fails the gate.
const threw = t => { if (/THREW/.test(t)) failed = failed || new Error('logged: ' + t); };
console.error = (...a) => { const t = a.map(String).join(' '); threw(t); if (!ENVY.test(t)) quiet(...a); };
console.warn = (...a) => { const t = a.map(String).join(' '); threw(t); if (!ENVY.test(t)) quietW(...a); };
try {
  await import(pathToFileURL(f).href + '?t=' + Date.now());
  await new Promise(r => setTimeout(r, 500));
  if (globalThis.__bootWorld) await Promise.race([globalThis.__bootWorld(), new Promise(r => setTimeout(r, 4000))]);
} catch (e) { note(e); }
console.error = quiet; console.warn = quietW;

if (failed) {
  console.error('\nBOOT FAIL -- the module threw, which is a blank page and a boot card stuck on\n' +
                'the text it was born with. Nothing on screen or in a phone console says why.\n');
  console.error(failed && failed.stack ? failed.stack : failed);
  process.exit(1);
}
console.log('boot ok -- the module evaluates and init() runs');
process.exit(0);
