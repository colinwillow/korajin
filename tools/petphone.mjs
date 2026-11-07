// node tools/petphone.mjs [URL='?w=forge&zone=pet' TAG=x] -- HIS PATH (m2800): the DEV PLACES row's URL, the entrance, real time, a 390x844 phone; prints the pet's state each 1.5 s and screenshots /tmp/claude-0/pet/phone<TAG>.png 15 s after the boot card clears. (preamble from petfollow:) THE PET FRIEND'S FOLLOW, IN THE SHIPPED PAGE (COMPANION.md). The player is CARRIED along the sandbox course (`?w=forge&zone=pet`)
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
await page.addInitScript(() => { let a = 7; window.__noop = 0; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', 'mesh'); } catch (e) {} });
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
let code = 0;
const URL0 = process.env.URL || '?w=forge&zone=pet';
try {
  await page.goto(`http://127.0.0.1:${port}/index.html${URL0}`, { timeout: 120000 });
  let waitB = 0; for (let k = 0; k < 80; k++) { await new Promise(r => setTimeout(r, 1500));
    const st = await page.evaluate(() => { const m = window.mel || {}, p = window.__wt && window.__wt.player; return { boot: document.getElementById('boot').classList.contains('gone'), pet: !!(m.PETZ && m.PETZ.on), cmp: m.CMP ? { P: !!m.CMP.P, busy: m.CMP.busy, err: m.CMP.err, want: m.CMP.want } : null, holy: m.HOLYR ? m.HOLYR.live.length : -1,
      p: p ? [+p.pos.x.toFixed(1), +p.pos.y.toFixed(1), +p.pos.z.toFixed(1), p.grounded] : null, url: location.search, chip: (document.getElementById('chip') || {}).textContent }; });
    console.log(k, JSON.stringify(st).slice(0, 400)); if (st.boot) waitB = (waitB || 0) + 1; if (st.cmp && st.cmp.P && waitB > 10) { await page.screenshot({ path: '/tmp/claude-0/pet/phone' + (process.env.TAG || '') + '.png' }); const q = await page.evaluate(() => { const P = window.mel.CMP.P, c = window.__wt.camera; return { pet: P.root.position.toArray().map(v => +v.toFixed(2)), scale: P.root.scale.x, vis: P.vis, cam: c.position.toArray().map(v => +v.toFixed(2)), role: P.role }; }); console.log(JSON.stringify(q)); break; } }
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
