// node tools/saintshots.mjs -- SWORD_SAINT.md's frame strips, rendered by the SHIPPED game headless in his dojo (?w=forge&zone=saintdojo).
// A hook is injected at the module's `window.mel = {` (as `places` does) so the probe can call the game's own functions: it stands him
// a few metres off the Saint, sets a three-quarter camera, fires the real verbs (an arrow, a katana strike via ACT.strike, a charged blow
// for the clash) and grabs frames. Writes images/renders/saint/<name>.png (each a strip of N frames, left to right). Not a gate.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url); let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, 'images/renders/saint'); fs.mkdirSync(OUT, { recursive: true });
const HOOK = `window.__sa = {
  d: () => ARENA.live.find(o => o.K.arena === 'SAINT' && !o.ko),
  st: () => { const d = window.__sa.d(); return { up: !!d && d.st !== 'beamIn' && !d.entering, st: d && d.st, run: !!ENTRY.run, mode: SAINT.mode, stat: Object.assign({}, SAINT.stat), hp: d && d.hp }; },
  mode: m => { SAINT.mode = m; },
  place: (r, side) => { const d = window.__sa.d(), P = d.root.position, p = player, a = d.h; p.pos.set(P.x + Math.sin(a) * r, P.y, P.z + Math.cos(a) * r); p.vel.set(0, 0, 0);
    const h = Math.atan2(P.x - p.pos.x, P.z - p.pos.z); p.faceH = p.heading = h; cam.az = h + (side || .75); d.h = h + Math.PI; d.st = 'idle'; d.t = 0; d.cbRipo = 0; d.sTired = 0; d.cbOpen = 0; d.cool = 0; },
  hold: on => { const d = window.__sa.d(); if (d) { d.cb = d.cb || {}; d.cb.cd = on ? 99 : 0; } },
  arrow: () => { const d = window.__sa.d(), p = player, P = d.root.position, m = arrowMesh(), o = new THREE.Vector3(p.pos.x, p.pos.y + 1.2, p.pos.z); m.position.copy(o); scene.add(m);
    const dx = P.x - o.x, dz = P.z - o.z, L = Math.hypot(dx, dz), v = 30, T = L / v, g = MOVE.g * .55; ARROWS.push({ m, v: new THREE.Vector3(dx / T, (P.y + 1.1 - o.y) / T + .5 * g * T, dz / T), t: 0, stuck: 0, from: null, mine: 1, pl: 1, gk: .55, type: 'arrow' }); },
  strike: () => ACT.strike(0, -1),
  heavy: () => { const d = window.__sa.d(), p = player, h = Math.atan2(d.root.position.x - p.pos.x, d.root.position.z - p.pos.z); p.chargeGo = 1; try { dummyBlow(d, h, 1, 2); } finally { p.chargeGo = 0; } },
  react: k => { const d = window.__sa.d(), p = player; saintReact(d, Math.atan2(d.root.position.x - p.pos.x, d.root.position.z - p.pos.z), k); },
  cam: on => { const S = window.__sa; S.camOn = on; if (S.wrapped) return; S.wrapped = 1; const R0 = renderer.render.bind(renderer), m = new THREE.Vector3();     // the probe's own lens: side-on 3/4 on the midpoint of the two
    renderer.render = (sc, cm) => { const d = S.camOn && S.d(); if (d && cm === camera) { const p = player.pos, P = d.root.position, ux = P.x - p.x, uz = P.z - p.z, L = Math.hypot(ux, uz) || 1, nx = -uz / L, nz = ux / L, k = Math.max(4.5, L * 1.15 + 3);
        m.set((p.x + P.x) / 2, (p.y + P.y) / 2 + 1, (p.z + P.z) / 2); camera.position.set(m.x + nx * k - ux / L * k * .35, m.y + 1.4, m.z + nz * k - uz / L * k * .35); camera.lookAt(m); camera.updateMatrixWorld(); }
      return R0(sc, cm); }; },
  parried: () => { const d = window.__sa.d(), p = player; cbtTimedParry(d, Math.atan2(p.pos.x - d.root.position.x, p.pos.z - d.root.position.z)); },
};`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let b = fs.readFileSync(f); if (f.endsWith('index.html')) b = b.toString().replace('window.melee = window.mel = {', HOOK + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const W = +(process.env.W || 420), H = +(process.env.H || 380);
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); page.on('pageerror', e => console.log('pageerror', e.message.slice(0, 120)));
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=saintdojo`, { waitUntil: 'commit', timeout: 240000 });
const ev = (f, ...a) => page.evaluate(([f, a]) => window.__sa ? window.__sa[f](...a) : null, [f, a]);
const t0 = Date.now(); let s = null; while (Date.now() - t0 < 240000) { await page.waitForTimeout(1000); s = await ev('st').catch(() => null); if (s && s.up && !s.run) break; }
console.log('saint up', JSON.stringify(s)); if (!s || !s.up) { await browser.close(); server.close(); process.exit(1); }
await page.waitForTimeout(7000);     // the boot card fades out
await page.addStyleTag({ content: 'body *:not(canvas) { visibility: hidden !important; } canvas { visibility: visible !important; }' }).catch(() => {});     // every overlay off the picture: the game only
await page.waitForTimeout(800);
async function strip(name, mode, setup, act, n, gap, r, side) { await ev('mode', mode); await ev('place', r || 4, side); await ev('hold', 1); if (setup) await setup(); await page.waitForTimeout(700);
  await act(); const files = []; for (let i = 0; i < n; i++) { await page.waitForTimeout(gap); const f = path.join(OUT, `_${name}_${i}.png`); await page.screenshot({ path: f }); files.push(f); }
  await ev('hold', 0); execFileSync('python3', ['-I', '-c', `import sys\nfrom PIL import Image\nfs=sys.argv[2:]\nims=[Image.open(f) for f in fs]\nw,h=ims[0].size\no=Image.new('RGB',(w*len(ims),h))\nfor i,im in enumerate(ims): o.paste(im,(i*w,0))\no.save(sys.argv[1])`, path.join(OUT, name + '.png'), ...files]);
  for (const f of files) fs.unlinkSync(f); console.log(name, JSON.stringify((await ev('st')).stat)); }
await ev('cam', 1);     // ONLY=1,3,4 picks strips (the clash strip, 2, was taken with the game's own lens)
const ONLY = (process.env.ONLY || '1,2,3,4').split(',');
if (ONLY.includes('1')) await strip('1_arrow_deflect', 'IMPOSSIBLE', null, () => ev('arrow'), 6, 70, 6, .9);
if (ONLY.includes('2')) await strip('2_parry_clash', 'IMPOSSIBLE', null, async () => { await ev('strike'); await page.waitForTimeout(120); await ev('heavy'); }, 5, 110, 2.6, .8);
if (ONLY.includes('3')) await strip('3_dodge_counter', 'IMPOSSIBLE', null, async () => { await ev('strike'); await page.waitForTimeout(100); await ev('react', 'slip'); }, 5, 160, 2.6, .9);
if (ONLY.includes('4')) await strip('4_duel_opening', 'DUEL', null, async () => { await ev('parried'); await page.waitForTimeout(150); await ev('strike'); }, 5, 140, 2.6, .8);
await browser.close(); server.close();
