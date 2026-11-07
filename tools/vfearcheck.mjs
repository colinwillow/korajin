// node tools/vfearcheck.mjs -- VILLAGER FEAR (m2809, VILLAGER_FEAR.md) in the shipped page: a Husk Soldier spawned beside the Sunwell's well; every villager must
// startle and reach cover or crouch; then it dies, and they must come out and someone must thank him. Renders the cowering and the thank-you to images/characters/. (preamble from petfollow:) THE PET FRIEND'S FOLLOW, IN THE SHIPPED PAGE (COMPANION.md). The player is CARRIED along the sandbox course (`?w=forge&zone=pet`)
// at a set pace, frame by frame (frameBody at 1/60 s) -- the pet is what is measured: where he is, his hops, his puffs, and how far behind he ends each leg.
// Prints one line per leg (exit 1 when he ends a leg more than 4 m off his spot). SHOTS=1 writes in-game frames to images/characters/.
// (was: npm run dvwalk -- WALK THE SUNWELL'S ROUTE IN THE SHIPPED PAGE (DESERT_VILLAGE.md). The `walktest` pattern: headless, a fake clock,
// `frameBody()` stepped by hand at 1/60 s, PointerEvents into the shipped pads. He starts on the well court and climbs every link of the spiral
// (L0 stair .. L6 hanging stair) at full stick; on a HOP he runs at the stone and taps the right pad (jump) a stride before the edge. A leg passes
// when he arrives within .8 m of its target standing at the target's height (+-.35 m); a FALL is any drop of more than 2 m below the leg's lower end.
// The thumb never lifts between legs: a lift from a pushed stick reads as a FLICK (the backflip dodge) and throws him off a stone.
// Prints one line per leg and exits 1 on a failed leg. MESH collision (the desert COLL row).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('petfollow: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HANDLE = 'window.__wt = { frameBody, player, cam, COLL, groundAt, renderer, rig, MOVE, CMP, PETZ, COMPANION, scene, camera }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', HANDLE + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(() => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', 'mesh'); } catch (e) {} });
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
let code = 0;
try {
  await page.exposeFunction('__saveShot', (n, b64) => { fs.writeFileSync(path.join(ROOT, 'images/characters', n), Buffer.from(b64, 'base64')); });
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=boulders&at=vg&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && window.mel && window.mel.VG && window.mel.VG.live.length && window.mel.DVIL.folk, null, { timeout: 300000, polling: 1000 });
  const R = await page.evaluate(async () => { window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; const S = window.__wt, M = window.mel, p = S.player, cam = S.camera; const r0 = S.renderer.render.bind(S.renderer); S.renderer.render = () => {};
    const f = n => { for (let k = 0; k < n / 2; k++) { window.__clock.t += 1000 / 30; S.frameBody(); } };
    const shot = async (n, q) => { const fov0 = cam.fov, z0 = cam.zoom; cam.fov = 50; cam.zoom = 1; cam.updateProjectionMatrix(); cam.position.set(q.x + 3.4, q.y + 2.2, q.z + 3.4); cam.lookAt(q.x, q.y + .7, q.z); cam.updateMatrixWorld(); r0(S.scene, cam); out.fov = [fov0, z0]; cam.fov = fov0; cam.zoom = z0; cam.updateProjectionMatrix(); await window.__saveShot(n, S.renderer.domElement.toDataURL('image/jpeg', .86).split(',')[1]); };
    const out = { log: [] }; const [ox, oz] = M.DVIL.o, y0 = M.DVIL.y0; p.pos.set(ox - 3, y0 + .1, oz - 3); f(30);
    const vill = () => [...M.DVIL.folk.map(t => ({ n: 'toad:' + t.R.role, f: t.d.fearV, q: t.d.root.position })), ...M.VG.live.map(P => ({ n: 'woman', f: P.fear, q: P.root.position }))];
    await M.arenaSpawn('HUSK_SOLDIER'); const H = M.ARENA.live[M.ARENA.live.length - 1]; out.husk = H ? H.root.position.toArray().map(v => +v.toFixed(1)) : null;
    if (H) { H.ai = 0; H.aggroOff = 1; }
    for (let s = 0; s < 8; s++) { f(60); out.log.push([s + 1, vill().map(v => v.n + '=' + (v.f ? v.f.st : '-')).join(' ')]); }
    const v8 = vill(); out.afraid = v8.map(v => [v.n, v.f && v.f.st, v.f && v.f.cover ? 'cover' : 'none', H ? +Math.hypot(v.q.x - H.root.position.x, v.q.z - H.root.position.z).toFixed(1) : null]);
    out.toadAct = M.DVIL.folk.map(t => [t.R.role, Object.keys(t.d.actions).length, !!t.d.actions.cover_idle, t.d.cur, t.d.st, Object.entries(t.d.cw || {}).filter(e => e[1] > .05).map(e => e[0] + ':' + e[1].toFixed(2)).join(',')]);
    const hid = v8.find(v => v.f && (v.f.st === 'hide' || v.f.st === 'none')) || v8[0]; await shot('villager_fear_cower.jpg', hid.q);
    if (H) { H.hp = 0; H.dead = 1; } for (let s = 0; s < 26; s++) { f(30); out.log.push(['k' + (s + 1), vill().map(v => v.n + '=' + (v.f ? v.f.st : '-')).join(' ')]); const t = vill().find(v => v.f && v.f.st === 'thank'); if (t && !out.shotT) { out.shotT = t.n; await shot('villager_fear_thanks.jpg', t.q); } }
    out.st = M.VF.st; out.after = vill().map(v => [v.n, v.f && v.f.st]); return out; });
  for (const l of R.log) console.log('  ', l[0], l[1]);
  console.log('husk', JSON.stringify(R.husk)); console.log('afraid', JSON.stringify(R.afraid)); console.log('after', JSON.stringify(R.after)); console.log('stats', JSON.stringify(R.st)); console.log('toadAct', JSON.stringify(R.toadAct)); console.log('thank shot of', R.shotT, 'game lens', JSON.stringify(R.fov));
  const ok = R.afraid.every(a => a[1] === 'hide' || a[1] === 'none' || a[1] === 'run' || (a[1] === 'calm' && a[3] > 20)) && R.after.every(a => a[1] === 'calm' || a[1] === 'thank' || a[1] === 'approach') && R.st.thanks >= 1;
  console.log(ok ? 'PASS: every villager hid, all came out, he was thanked' : 'FAIL'); code = ok ? 0 : 1;
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
