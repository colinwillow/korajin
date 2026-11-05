// npm run stepsweep [zone ...] [--boxes|--mesh] [--off] [--n=150] -- EVERY RISE HE SHOULD WALK UP, WALKED (m2436; his: "I don't want to go
// through 1,876 spots and send screenshots -- fix it in a GENERAL way so I never get stuck at the top of stairs, over a kerb").
// Boots the SHIPPED page headless per zone (the `moves`/`walktest` pattern: fake clock, `frameBody()` by hand, PointerEvents into the real pads).
// FINDS the rises from the collider itself: the shipped `groundAt` on a .5 m grid round where he spawned, every neighbour pair whose top
// floors differ by .05-.55 m with a flat run on BOTH sides (.5 m beyond each, within 5 cm) -- a kerb, a tread, a lip, a rim. Then for up to
// `--n` of them (spread evenly) it puts him .7 m short on the low side, runs him at full stick at the edge for 1.5 s, and asks one thing:
// did his feet reach the top (within 8 cm)? A STALL is a rise he could not walk up. `--off` turns `STEPUP.auto` off (the before).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('stepsweep: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const A = process.argv.slice(2), MODE = A.includes('--boxes') ? 'boxes' : A.includes('--mesh') ? 'mesh' : '', OFF = A.includes('--off');
const N = +((A.find(a => a.startsWith('--n=')) || '--n=150').slice(4));
const ZONES = { ftin: '?w=forge&zone=ftemple', forest: '?w=forge&zone=dometemple', boulders: '?w=forge&zone=boulders', wall: '?w=forge&zone=wall', garden: '?w=forge&zone=garden', snow: '?w=forge&zone=snow', temple: '?w=forge&zone=temple', lake: '?w=forge&zone=lake', arena: '?w=arena' };
const want = A.filter(a => !a.startsWith('--')); if (!want.length) want.push(...Object.keys(ZONES));
const HANDLE = 'window.__ss = { frameBody, player, cam, COLL, STEPUP, groundAt, godTo, renderer, rig, MOVE }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, HANDLE + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body);
});
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

function sweep(o) {
  const S = window.__ss, p = S.player, clk = window.__clock, DT = 1 / 60; S.STEPUP.auto = o.off ? 0 : 1;
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  let pid = 100; const el = document.getElementById('padL'); let id = null;
  const at = (x, y) => { const r = el.getBoundingClientRect(), Rr = Math.max(8, r.width * 52 / 132); return { clientX: r.left + r.width / 2 + x * Rr, clientY: r.top + r.height / 2 + y * Rr }; };
  const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: id, bubbles: true, cancelable: true, pointerType: 'touch', isPrimary: true }, at(x, y))));
  const down = () => { if (id === null) { id = ++pid; ev('pointerdown', 0, 0); } }, up = () => { if (id !== null) { ev('pointerup', 0, 0); id = null; } };
  const steer = (wx, wz) => { const az = isFinite(S.cam.az) ? S.cam.az : 0, sa = Math.sin(az), ca = Math.cos(az); down(); ev('pointermove', wz * sa - wx * ca, -(wx * sa + wz * ca)); };
  try { window.mel.reelEnd(); } catch (e) {} for (let i = 0; i < 240; i++) { if (i < 150 && p.sleep) steer(1, 0); frame(); } up(); if (p.sleep) p.sleep = null; for (let i = 0; i < 60; i++) frame();
  const cx = p.pos.x, cz = p.pos.z, cy = p.pos.y, R = o.R, GS = .5, n = Math.round(2 * R / GS), H = new Float32Array(n * n);
  const top = (x, z) => S.groundAt(x, z, cy + 25, 0), Q2 = v => Math.abs(v);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) H[j * n + i] = top(cx - R + i * GS, cz - R + j * GS);
  { let lo = 1e9, hi = -1e9; const set = new Set(); for (const h of H) { if (h > cy - 40) { lo = Math.min(lo, h); hi = Math.max(hi, h); set.add(Math.round(h * 20)); } } window.__hstat = [+lo.toFixed(2), +hi.toFixed(2), set.size]; }
  const rises = []; let tiny = 0;
  for (let j = 1; j < n - 2; j++) for (let i = 1; i < n - 2; i++) for (const [di, dj] of [[1, 0], [0, 1]]) {
    const a = H[j * n + i], b = H[(j + dj) * n + i + di], d = b - a; if (!(Math.abs(d) >= .05 && Math.abs(d) <= .55) || a < cy - 40 || b < cy - 40) continue;
    const lo = d > 0 ? [i, j] : [i + di, j + dj], hi = d > 0 ? [i + di, j + dj] : [i, j], sx = Math.sign(hi[0] - lo[0]), sz = Math.sign(hi[1] - lo[1]);
    const gl = H[lo[1] * n + lo[0]], gh = H[hi[1] * n + hi[0]], gl2 = H[(lo[1] - sz) * n + lo[0] - sx], gh2 = H[(hi[1] + sz) * n + hi[0] + sx];
    if (!(Math.abs(gl2 - gl) < .05 && Math.abs(gh2 - gh) < .05)) continue;     /* a flat run on both sides: a step, not a slope or a spike */
    const ex = cx - R + (lo[0] + hi[0]) / 2 * GS, ez = cz - R + (lo[1] + hi[1]) / 2 * GS, r0 = p.r + .05;
    let small = false; for (const k of [-1, 1]) for (const f of [.3]) { const y = top(ex + Q2(sz) * k * (p.r + .05) + sx * f, ez + Q2(sx) * k * (p.r + .05) + sz * f); if (Math.abs(y - gh) > .06) small = true; }
    if (small) { tiny++; continue; }     /* a top narrower than his body (a pot, a post cap): not a step to stand on */
    let beside = false; for (const k of [-1, 1]) for (const f of [-.3, 0, .3]) { const y = top(ex + Q2(sz) * k * r0 + sx * f, ez + Q2(sx) * k * r0 + sz * f); if (y > gh + S.STEPUP.lip) beside = true; }     /* a post or wall within his radius of the path: not the rise's fault */
    for (let f = 0; f <= p.r + .6 && !beside; f += .1) { const x = ex + sx * f, z = ez + sz * f; if (top(x, z) > gh + S.STEPUP.lip) beside = true; }     /* a wall straight ahead, too tall to step */
    if (!beside && S.COLL.on && S.COLL.ray(ex - sx * .2, gh + 1.0, ez - sz * .2, sx, sz, p.r + .8, 0) < p.r + .8) beside = true;     /* ... or a drawn face at his chest (a rock) */
    rises.push({ ex, ez, sx, sz, gl, gh, rise: gh - gl, beside }); }
  if (o.stair) { const [x0, z0, x1, z1, yq] = o.stair, L = Math.hypot(x1 - x0, z1 - z0), ux = (x1 - x0) / L, uz = (z1 - z0) / L, g0 = S.groundAt(x0, z0, yq != null && !isNaN(yq) ? yq : cy + 40, 0);
    S.godTo(x0, g0, z0, Math.atan2(ux, uz)); p.vel.set(0, 0, 0); for (let f = 0; f < 20; f++) frame(); const prof = []; let top = p.pos.y, stuckF = 0, lastP = 0;
    for (let f = 0; f < 240; f++) { steer(ux, uz); frame(); const along = (p.pos.x - x0) * ux + (p.pos.z - z0) * uz; if (along - lastP < .005) stuckF++; lastP = along; top = Math.max(top, p.pos.y); if (f % 10 === 0) prof.push(along.toFixed(1) + '@' + p.pos.y.toFixed(2)); if (along >= L) break; }
    up(); const gEnd = S.groundAt(x1, z1, top + 1, 1); return { stair: { from: +g0.toFixed(2), topWant: +gEnd.toFixed(2), reached: +top.toFixed(2), endAlong: +lastP.toFixed(2), len: +L.toFixed(2), stuckFrames: stuckF, ups: S.STEPUP.ups, prof: prof.join(' ') }, rises: 0, probed: 0, ok: 0, stall: [], bins: {}, tiny: 0, mode: S.COLL.mode, coll: '', at: [0, 0, 0], hstat: [] }; }
  if (o.only) { rises.length = 0; rises.push(o.only); }
  const pick = []; const step = Math.max(1, rises.length / o.N); for (let k = 0; k < rises.length && pick.length < o.N; k += step) pick.push(rises[Math.floor(k)]);
  const out = { tiny, rises: rises.length, probed: 0, ok: 0, stall: [], bins: {} };
  for (const Q of pick) { const sx0 = Q.ex - Q.sx * .7, sz0 = Q.ez - Q.sz * .7, g0 = S.groundAt(sx0, sz0, Q.gl + .1, .1); if (Math.abs(g0 - Q.gl) > .06) continue;
    S.godTo(sx0, g0, sz0, Math.atan2(Q.sx, Q.sz)); p.vel.set(0, 0, 0); for (let f = 0; f < 30 && !(f > 3 && p.grounded); f++) frame(); if (!p.grounded || Math.abs(p.pos.y - Q.gl) > .1) { out.unsettled = (out.unsettled || 0) + 1; continue; }
    out.probed++; let made = false; if (o.only) S.STEPUP.dbg = []; for (let f = 0; f < 90; f++) { steer(Q.sx, Q.sz); frame(); if (o.only) out.trace = (out.trace || []).concat([[f, +p.pos.x.toFixed(2), +p.pos.y.toFixed(2), +p.pos.z.toFixed(2), (S.STEPUP.dbg || []).splice(0).join(';')]]); if (p.pos.y >= Q.gh - .08) { made = true; break; } } up();
    const bin = Q.rise <= S.MOVE.step ? 'under step' : 'step..lip'; out.bins[bin] = out.bins[bin] || [0, 0]; out.bins[bin][0]++;
    const still = Math.abs(top(Q.ex + Q.sx * .5, Q.ez + Q.sz * .5) - Q.gh) < .06;     /* a pot he broke, a thing that moved: the rise is gone */
    if (made) { out.ok++; out.bins[bin][1]++; } else if (!still && !o.only) out.changed = (out.changed || 0) + 1; else if (Q.beside) out.beside = (out.beside || 0) + 1; else out.stall.push([+Q.ex.toFixed(1), +Q.gl.toFixed(2), +Q.ez.toFixed(1), 'rise ' + Q.rise.toFixed(2), 'got to y ' + p.pos.y.toFixed(2)]); }
  out.mode = S.COLL.mode + (S.COLL.on ? '' : (S.COLL.zone ? ' (not built)' : ' (no mesh row)')) + ' row ' + (S.COLL.zone || '-'); const st = S.COLL.stat; out.coll = S.COLL.on ? st.tris + ' tris (' + st.floors + ' floor / ' + st.walls + ' wall), built ' + st.ms + ' ms x' + (st.builds || 1) + ', boxes replaced ' + st.rep + ' kept ' + st.kept + (st.movedOut ? ', moved out ' + st.movedOut : '') + (st.big ? ', big meshes left out ' + st.big : '') + (st.capped ? ', CAPPED ' + st.capped : '') : 'no store'; out.ups = S.STEPUP.ups; out.at = [+cx.toFixed(1), +cy.toFixed(1), +cz.toFixed(1)]; out.hstat = window.__hstat;
  return out;
}

let code = 0;
for (const z of want) {
  const url = ZONES[z]; if (!url) { console.log('no zone', z, Object.keys(ZONES).join(' ')); continue; }
  const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true });
  await page.addInitScript(m => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    try { localStorage.setItem('mel.game', 'korajin'); if (m) localStorage.setItem('mel.coll', m); else localStorage.removeItem('mel.coll'); } catch (e) {} }, MODE);
  const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html${url}&entry=0`, { timeout: 120000 });
    await page.waitForFunction(() => window.__ss && document.getElementById('boot').classList.contains('gone') && window.__ss.rig.ready, null, { timeout: 240000, polling: 1000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => { const S = window.__ss; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; S.renderer.render = () => {}; });
    const ONLY = process.env.SS_ONLY ? JSON.parse(process.env.SS_ONLY) : null, STAIR = process.env.SS_STAIR ? process.env.SS_STAIR.split(',').map(Number) : null;
    const R = await page.evaluate(sweep, { stair: STAIR, only: ONLY, off: OFF, N, R: z === 'temple' || z === 'lake' || z === 'forest' ? 90 : 45 });
    if (R.stair) { console.log(`== ${z} STAIR [${R.mode}] ` + JSON.stringify(R.stair)); await page.close(); continue; }
    console.log(`== ${z} [${R.mode}] collider: ${R.coll}\n   step-up ${OFF ? 'OFF' : 'on'}  ${el()}  rises found ${R.rises} (+${R.tiny} narrower than him, skipped), probed ${R.probed}: walked up ${R.ok}, STALLED ${R.stall.length}, blocked by a wall beside/ahead (too tall to step) ${R.beside || 0}, gone (broken/moved) ${R.changed || 0}   (${Object.entries(R.bins).map(([k, v]) => k + ' ' + v[1] + '/' + v[0]).join(', ')})  step-ups ${R.ups}  unsettled ${R.unsettled || 0}  spawn ${R.at.join(',')}  heights ${R.hstat.join(' / ')}`);
    for (const s of R.stall.slice(0, 12)) console.log('    stall ' + s.join('  '));
    if (R.trace) for (const t of R.trace.filter((t, i) => i < 40 || t[4])) console.log('     ', t.join(' '));
  } catch (e) { console.log('FAIL', z, el(), e.message.split('\n')[0]); code = 1; }
  if (errs.length) console.log('  page errors:', [...new Set(errs)].slice(0, 3).join(' || '));
  await page.close();
}
await browser.close(); server.close(); process.exit(code);
