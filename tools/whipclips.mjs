// npm run whipclips -- MEASURE the hero's candidate clips for the whip CAST (VINEWHIP.md): loads Grumbo's GLB in headless Chromium, plays each
// clip on the bare skeleton (bones only: no skin needed) and samples the RIGHT HAND's world position, its height over the hips and its speed.
// The snap is the peak hand speed; the wind-up is the stretch before it where the hand rises / draws back. Prints, per clip: duration, the
// peak-speed time (and as a fraction), the hand's highest point before the peak, and a suggested window [a, b] + snap fraction for WHIPCAST.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const CLIPS = process.argv.slice(2).filter(x => !x.startsWith('--')), ALL = process.argv.includes('--all'); const LIST = CLIPS.length ? CLIPS : ['katana_down', 'katana_slash_1', 'katana_horiz', 'weapon_melee_01', 'weapon_melee_02', 'weapon_melee_03', 'throw_item', 'katana_draw', 'climbing_Ladder', 'pick_up', 'melee_05'];
const page = `<!doctype html><html><head><script type="importmap">{ "imports": { "three": "./vendor/three.module.min.js", "three/addons/": "./vendor/" } }</script></head><body>
<script type="module">import * as THREE from 'three'; import { GLTFLoader } from './vendor/GLTFLoader.js'; import { DRACOLoader } from './vendor/DRACOLoader.js'; window.THREE = THREE; window.GLTFLoader = GLTFLoader; window.DRACOLoader = DRACOLoader; window.ready = 1;</script></body></html>`;
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/' || u === '/c.html') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(page); }
  const f = path.join(ROOT, u); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(go => srv.listen(0, go));
const br = await pw.chromium.launch(), pg = await br.newPage(); pg.on('pageerror', e => console.error('PAGE', e.message));
await pg.goto(`http://localhost:${srv.address().port}/c.html`); await pg.waitForFunction('window.ready');
const out = await pg.evaluate(async list => { const THREE = window.THREE, L = new window.GLTFLoader(), D = new window.DRACOLoader(); D.setDecoderPath('./vendor/draco/'); L.setDRACOLoader(D);
  const g = await L.loadAsync('./models/characters/alien_goblin_game.glb'), root = g.scene, hand = root.getObjectByName('mixamorig_RightHand'), hips = root.getObjectByName('mixamorig_Hips'), head = root.getObjectByName('mixamorig_Head'), mx = new THREE.AnimationMixer(root), res = [];
  if (!list) list = g.animations.map(a => a.name);
  for (const nm of list) { const clip = g.animations.find(a => a.name === nm); if (!clip) { res.push({ nm, miss: 1 }); continue; } mx.stopAllAction(); const a = mx.clipAction(clip); a.reset().play(); const N = 60, S = [];
    for (let i = 0; i <= N; i++) { const t = clip.duration * i / N; a.time = t; mx.update(0); root.updateMatrixWorld(true); const H = hand.getWorldPosition(new THREE.Vector3()), P = hips.getWorldPosition(new THREE.Vector3()), Hd = head.getWorldPosition(new THREE.Vector3()); S.push({ t, h: H.y - P.y, hh: H.y - Hd.y, f: H.z - P.z, x: H.x - P.x, P: H }); }
    let pk = 0, pki = 0; for (let i = 1; i <= N; i++) { const v = S[i].P.distanceTo(S[i - 1].P) / (clip.duration / N); S[i].v = v; if (v > pk) { pk = v; pki = i; } }
    let hi = 0; for (let i = 0; i < pki; i++) if (S[i].h > S[hi].h) hi = i;
    let top = 0; for (let i = 0; i <= N; i++) if (S[i].hh > S[top].hh) top = i; let dn = 0, dni = top; for (let i = top + 1; i <= N; i++) { const vd = (S[i - 1].P.y - S[i].P.y) / (clip.duration / N); if (vd > dn) { dn = vd; dni = i; } }
    const a0 = Math.max(0, hi - 6), b0 = Math.min(N, pki + 8);
    res.push({ nm, topHead: +S[top].hh.toFixed(2), topT: +S[top].t.toFixed(2), topF: +(top / N).toFixed(2), topBack: +S[top].f.toFixed(2), down: +dn.toFixed(2), downF: +(dni / N).toFixed(2), dur: +clip.duration.toFixed(2), peakT: +(S[pki].t).toFixed(2), peakF: +(pki / N).toFixed(2), peakV: +pk.toFixed(2), hiT: +S[hi].t.toFixed(2), hiF: +(hi / N).toFixed(2), hiH: +S[hi].h.toFixed(2),
      win: [+(a0 / N).toFixed(2), +(b0 / N).toFixed(2)], snap: +((pki - a0) / Math.max(1, b0 - a0)).toFixed(2), path: S.filter((_, i) => i % 6 === 0).map(s => s.h.toFixed(2) + '/' + s.f.toFixed(2)).join(' ') }); }
  return res; }, ALL ? null : LIST);
if (ALL) { out.filter(r => !r.miss).sort((a, b) => (b.topHead * 2 + b.down * .15) - (a.topHead * 2 + a.down * .15)).slice(0, 25).forEach(r => console.log(`${r.nm.padEnd(26)} hand over head ${r.topHead} m at ${r.topT}s (${r.topF}) behind ${r.topBack}  then DOWN ${r.down} m/s at ${r.downF}  dur ${r.dur}`)); } else for (const r of out) console.log(r.miss ? r.nm + ' MISSING' : `${r.nm.padEnd(18)} dur ${r.dur}s  peak ${r.peakT}s (${r.peakF}) v ${r.peakV}  high ${r.hiT}s (${r.hiF}) h ${r.hiH}  -> win [${r.win}] snap ${r.snap}\n    hand h/fwd: ${r.path}`);
await br.close(); srv.close();
