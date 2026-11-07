// npm run petfollow -- THE PET FRIEND'S FOLLOW, IN THE SHIPPED PAGE (COMPANION.md). The player is CARRIED along the sandbox course (`?w=forge&zone=pet`)
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
async function drive(shots) {
  const S = window.__wt, p = S.player, clk = window.__clock, frame = () => { clk.t += clk.dt; S.frameBody(); };
  const out = { legs: [], fails: 0, shots: [] }; let at = [0, 0, -1];
  const legs = [['stair foot', [0, 0, 5], 3], ['up the stair', [0, 1.5, 11], 3], ['over the 2 m gap', [0, 1.5, 18], 4.5], ['over the 3.4 m gap', [0, 1.5, 26], 4.5], ['up .9', [0, 2.4, 30], 3], ['up 2.1', [0, 4.5, 34], 4],
    ['down 1.5', [4.25, 3, 34], 3], ['down 1.5', [6.75, 1.5, 34], 3], ['down 1.5', [9.25, 0, 34], 3], ['run far', [-6, 0, 10], 7], ['onto the 7 m pillar', [-11, 7, 19], 5], ['stand', [-11, 7, 19], 4], ['back down, sprint', [8, 0, -4], 9], ['stand still', [8, 0, -4], 16]];
  const run = async (why, to, spd) => { const st = { hops: S.CMP.st.hops || 0, tele: S.CMP.st.tele || 0 }; const d0 = Math.hypot(to[0] - at[0], to[2] - at[2]); const T = d0 < .1 ? spd : Math.max(1, d0 / spd); let worst = 0, roles = new Set();
    for (let t = 0; t < T + 3.5; t += 1 / 60) { const u = Math.min(1, t / T), x = at[0] + (to[0] - at[0]) * u, z = at[2] + (to[2] - at[2]) * u, y = at[1] + (to[1] - at[1]) * u + (u > 0 && u < 1 && to[1] !== at[1] ? .4 * Math.sin(u * Math.PI) : 0);
      if (d0 > .1 && u < 1) p.heading = p.faceH = Math.atan2(to[0] - at[0], to[2] - at[2]);
      frame(); p.pos.set(x, y + .02, z); if (u < 1 && d0 > .1) p.vel.set((to[0] - at[0]) / T, 0, (to[2] - at[2]) / T); else p.vel.set(0, 0, 0); p.grounded = true;
      const P = S.CMP.P; if (P) { roles.add(P.role); worst = Math.max(worst, Math.hypot(P.root.position.x - x, P.root.position.z - z)); }
      if (shots && shots[why] && !shots[why].done) { const Sh = shots[why], P2 = S.CMP.P; if (P2 && (Sh[0] === 'hop' ? P2.hop && P2.hop.t > P2.hop.T * .45 : Sh[0] === 'run' ? P2.role === 'run' && t > 1.2 : t > Sh[0])) { Sh.done = 1; await window.__shot(Sh[1], typeof Sh[0] === 'number'); } } }
    at = to; const P = S.CMP.P, q = P ? P.root.position : null, dP = q ? Math.hypot(q.x - p.pos.x, q.z - p.pos.z) : 99;
    const row = { why, pet: q ? [+q.x.toFixed(2), +q.y.toFixed(2), +q.z.toFixed(2)] : null, dP: +dP.toFixed(2), dy: q ? +(q.y - p.pos.y).toFixed(2) : 0, hops: (S.CMP.st.hops || 0) - st.hops, puffs: (S.CMP.st.tele || 0) - st.tele, worst: +worst.toFixed(1), roles: [...roles].join('/'), st: P ? P.role : '-' };
    row.ok = dP < 4 && Math.abs(row.dy) < .6; if (!row.ok) out.fails++; out.legs.push(row); };
  for (let i = 0; i < 120 && !S.CMP.P; i++) { frame(); await new Promise(r => setTimeout(r, 30)); }
  p.pos.set(...at); for (let i = 0; i < 60; i++) { frame(); p.pos.set(...at); }
  for (const [w, to, sp] of legs) await run(w, to, sp);
  return out; }
let code = 0;
try {
  await page.exposeFunction('__saveShot', (n, b64) => { fs.writeFileSync(path.join(ROOT, 'images/characters', n), Buffer.from(b64, 'base64')); });
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=pet&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && document.getElementById('boot').classList.contains('gone') && window.__wt.rig.ready && window.__wt.PETZ.on, null, { timeout: 240000, polling: 1000 });
  await page.evaluate(() => { const S = window.__wt; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; const r0 = S.renderer.render.bind(S.renderer); S.renderer.render = () => {};
    window.__shot = async (n, both) => { const P = S.CMP.P, q = P.root.position, c = S.camera, p = S.player, h = P.h; if (both) { c.position.set(q.x + (p.pos.x - q.x) * .5 + 3.2, q.y + 1.6, q.z + (p.pos.z - q.z) * .5 - 2.6); c.lookAt((q.x + p.pos.x) / 2, (q.y + p.pos.y) / 2 + .5, (q.z + p.pos.z) / 2); } else { c.position.set(q.x + Math.cos(h) * 2.6 + Math.sin(h) * .8, q.y + .9, q.z - Math.sin(h) * 2.6 + Math.cos(h) * .8); c.lookAt(q.x, q.y + .4, q.z); } c.updateMatrixWorld(); r0(S.scene, c); await window.__saveShot(n, S.renderer.domElement.toDataURL('image/jpeg', .88).split(',')[1]); }; });
  const shots = process.env.SHOTS ? { 'over the 3.4 m gap': ['hop', 'korajin_petfriend_01_hop.jpg'], 'run far': ['run', 'korajin_petfriend_01_run.jpg'], 'stand still': [8, 'korajin_petfriend_01_idle.jpg'] } : null;
  const R = await page.evaluate(drive, shots);
  console.log(`== petfollow  ${el()}`);
  for (const l of R.legs) console.log((l.ok ? 'ok   ' : 'FAR  ') + l.why.padEnd(22) + ' pet ' + JSON.stringify(l.pet) + '  off you ' + l.dP + ' m (dy ' + l.dy + ')  hops ' + l.hops + '  puffs ' + l.puffs + '  worst ' + l.worst + ' m  ' + l.roles + ' -> ' + l.st);
  console.log(R.fails ? R.fails + ' legs ended with him off his spot' : 'he kept up on every leg'); code = R.fails ? 1 : 0;
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
