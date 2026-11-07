// node tools/vgcheck.mjs -- the Sunwell villagers in the shipped page (m2803): Toad heights, the woman on the ground, the bump, a swing hit, the bubble's size across the screen. (preamble from petfollow:) THE PET FRIEND'S FOLLOW, IN THE SHIPPED PAGE (COMPANION.md). The player is CARRIED along the sandbox course (`?w=forge&zone=pet`)
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
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=boulders&at=vg&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && window.mel && window.mel.VG && window.mel.VG.live.length && window.mel.DVIL.folk, null, { timeout: 300000, polling: 1000 });
  const R = await page.evaluate(async () => { window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; const S = window.__wt, M = window.mel, p = S.player, f = n => { for (let k = 0; k < n; k++) { window.__clock.t += 1000 / 60; S.frameBody(); } };
    const out = {}; const P = M.VG.live[0], q = P.root.position;
    out.toads = M.DVIL.folk.map(t => +(t.d.root.scale.x).toFixed(3));
    f(30); const gy = S.groundAt(q.x, q.z, q.y + 1.2, 1.6); out.ground = [+q.y.toFixed(3), +gy.toFixed(3)];
    // bump: put him inside her
    p.pos.set(q.x + .1, q.y + .02, q.z); p.vel.set(0, 0, 0); f(2); out.bump = +Math.hypot(p.pos.x - q.x, p.pos.z - q.z).toFixed(3);
    // a swing at her: stand 1.2 m off, face her, melFired for a few frames
    p.pos.set(q.x - 1.2, q.y + .02, q.z); p.faceH = p.heading = Math.PI / 2; f(1); p.melFired = 1; f(1); p.melFired = 1; f(1); p.melFired = 0; f(20); out.hit = [M.VG.st.hits || 0, P.role, P.st];
    // the bubble at five screen spots: its width and height must not change
    // the bubble: a long line, then the speaker moved across the screen -- its width and height must not change
    const cam = S.camera, line = 'If you find a bell up on the shrine, leave it. Or bring it to me. Mostly bring it to me.';
    out.bub = []; for (const sx of [-.9, -.4, 0, .4, .95]) { const fwd = cam.getWorldDirection(q.clone()), right = fwd.clone().cross(cam.up).normalize(), at = cam.position.clone().addScaledVector(fwd, 6).addScaledVector(right, sx * 3);
      window.mel.sayBub ? window.mel.sayBub(v => { v.copy(at); }, line, 3) : 0; f(2); const el = document.getElementById('dvbub'); const r = el ? el.getBoundingClientRect() : {}; out.bub.push([sx, el ? el.offsetWidth : -1, el ? el.offsetHeight : -1, Math.round(r.left), Math.round(r.right)]); }
    return out; });
  console.log(JSON.stringify(R));
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
