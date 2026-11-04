// npm run walktest [--boxes] -- WALK THE GARDEN AND COUNT WHAT GOES WRONG (m2281; his: "stuck inside a tree", "instead of running over it he
// gets stuck to the plant", "one step up, he gets stuck, and if he gets over he just POPS up"). Boots the SHIPPED page headless in the Garden
// (the `moves` pattern: a fake clock, `frameBody()` stepped by hand at 1/60 s, PointerEvents into the shipped pads), wakes him, then runs at full
// stick along a route built from the garden's own placements: round and INTO each willow's trunk (roots, flare), up the shrine stair, across.
// Per frame, grounded and asked to run:
//   STALL   speed under 25% of what the stick asks, for .25 s or more (an event; and the seconds lost)
//   POP     the DRAWN height (pos.y + stepOff, what the picture shows) jumps more than 8 cm in one frame
//   STUCK   a waypoint not reached in its time (a leg that never arrived)
// and a TRAP test: dropped inside each trunk, how many frames until he is out (the guard), or never.
// Prints the counts and the worst spots. MESH unless --boxes.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('walktest: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BOXM = process.argv.includes('--boxes');
const HANDLE = 'window.__wt = { frameBody, player, cam, GARDEN, COLL, groundAt, godTo, renderer, rig, MOVE }; ';
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
const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(boxes => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', boxes ? 'boxes' : 'mesh'); } catch (e) {} }, BOXM);
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));

function drive() {
  const S = window.__wt, p = S.player, clk = window.__clock, DT = 1 / 60;
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  let pid = 100;
  const pad = side => { const el = document.getElementById(side === 'L' ? 'padL' : 'padR'); let id = null;
    const at = (x, y) => { const r = el.getBoundingClientRect(), Rr = Math.max(8, r.width * 52 / 132); return { clientX: r.left + r.width / 2 + x * Rr, clientY: r.top + r.height / 2 + y * Rr }; };
    const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: id, bubbles: true, cancelable: true, pointerType: 'touch', isPrimary: true }, at(x, y))));
    return { down(x = 0, y = 0) { if (id !== null) this.up(); id = ++pid; ev('pointerdown', x, y); }, move(x, y) { if (id !== null) ev('pointermove', x, y); }, up() { if (id !== null) { ev('pointerup', 0, 0); id = null; } }, get held() { return id !== null; } }; };
  const L = pad('L');
  const steer = (wx, wz, m) => { const l = Math.hypot(wx, wz) || 1; wx /= l; wz /= l; const az = isFinite(S.cam.az) ? S.cam.az : 0, sa = Math.sin(az), ca = Math.cos(az); if (!L.held) L.down(0, 0); L.move((wz * sa - wx * ca) * m, -(wx * sa + wz * ca) * m); };
  const Y = () => p.pos.y, drawn = () => p.pos.y + (p.stepOff || 0);
  const out = { sidesteps: 0, stalls: 0, stallSec: 0, pops: 0, stuck: 0, legs: 0, frames: 0, worst: [], trap: [], unstick0: S.COLL.stat.unstick || 0, safe0: S.COLL.stat.safeBack || 0 };
  // the intro reel and the hammock own him at the start: end the reel, wake him
  try { window.mel.reelEnd(); } catch (e) {} for (let i = 0; i < 10; i++) frame();
  out.start = { sleep: !!p.sleep, reel: !!(window.mel.REEL && window.mel.REEL.on), at: [+p.pos.x.toFixed(1), +p.pos.z.toFixed(1)] };
  for (let i = 0; i < 150; i++) { steer(1, 0, 1); frame(); } L.up(); for (let i = 0; i < 30; i++) frame(); if (p.sleep) { p.sleep = null; } out.woke = { sleep: !!p.sleep, at: [+p.pos.x.toFixed(1), +p.pos.z.toFixed(1)], grounded: p.grounded };
  const Z = S.GARDEN, trees = (Z.trees || []).map(t => ({ id: t.id, x: t.at[0], z: t.at[1] }));
  const st = (Z.parts || []).find(q => (/stair/.test(q.id || '') || q.kind === 'stair') && isFinite(q.x) && isFinite(q.z));
  const sh = Z.shrine ? Z.shrine.at : [0, -17.2], ter = Z.terrace ? Z.terrace.at : [0, -16];
  const route = [];
  // each tree from the side AWAY from the hammock (the bed hangs at 1.1 m between the two willows and the garden walls it off -- a real wall)
  const Hm = Z.pieces && Z.pieces.hammock ? [Z.pieces.hammock.position.x, Z.pieces.hammock.position.z] : [-13.8, 4.2];
  for (const T of trees) { let ax = T.x - Hm[0], az = T.z - Hm[1]; const al = Math.hypot(ax, az) || 1; ax /= al; az /= al; const px = -az, pz = ax;
    route.push({ x: T.x + ax * 3 + px * 2, z: T.z + az * 3 + pz * 2, t: 10, why: T.id + ' approach' }, { x: T.x, z: T.z, t: 2.5, into: 1, why: T.id + ' INTO the trunk' },
      { x: T.x + ax * 3 - px * 2, z: T.z + az * 3 - pz * 2, t: 6, why: T.id + ' round the trunk' }, { x: T.x + ax * 1.4 + px * 2.2, z: T.z + az * 1.4 + pz * 2.2, t: 6, why: T.id + ' across the roots' });
    if (T.id === 'willow_a') route.push({ x: -8, z: 2.5, t: 10, why: 'round the hammock' }); if (T.id === 'willow_b') route.push({ x: -6, z: 9, t: 10, why: 'away from the hammock' }, { x: 0, z: 2, t: 12, why: 'across the lawn' }); }
  // the shrine: from 12 m out along its stair's line (or +z) up onto the knoll's top
  const sx = st ? st.x : ter[0], sz = st ? st.z : ter[1] + (Z.terrace ? Z.terrace.r : 8.5) + 2, ux = sx - ter[0], uz = sz - ter[1], ul = Math.hypot(ux, uz) || 1;
  route.push({ x: ter[0] + 10, z: ter[1] + 12, t: 12, why: 'round the terrace' }, { x: ter[0] + ux / ul * 14, z: ter[1] + uz / ul * 14, t: 14, why: 'shrine stair foot' }, { x: ter[0] + ux / ul * (Z.terrace ? Z.terrace.r - 1.2 : 7), z: ter[1] + uz / ul * (Z.terrace ? Z.terrace.r - 1.2 : 7), t: 10, why: 'up the shrine stair, OVER ITS TOP' }, { x: sh[0], z: sh[1] + 1.5, t: 8, why: 'across the terrace to the shrine' }, { x: ter[0] + ux / ul * 14, z: ter[1] + uz / ul * 14, t: 10, why: 'down the shrine stair' });
    const Bm = Z.beam; if (Bm && Bm.at) { const [bx, bz] = Bm.at, r0 = (Bm.r || 1.15); route.push({ x: bx + r0 + 2.5, z: bz, t: 18, why: 'to the Jinra basin' }, { x: bx + r0 * .7, z: bz + .2, t: 5, why: 'OVER the basin rim (in)' }, { x: bx + r0 + 2.5, z: bz + 1.2, t: 5, why: 'OVER the basin rim (out)' }); }
  for (const W of route) { out.legs++; let tt = 0, slow = 0, lastD = drawn(), reached = false, side = 0, sideS = 1;
    for (; tt < W.t; tt += DT) { const dx = W.x - p.pos.x, dz = W.z - p.pos.z, d = Math.hypot(dx, dz); if (d < .7) { reached = true; break; } if (side > 0) { side -= DT; steer(-dz * sideS + dx * .3, dx * sideS + dz * .3, 1); } else steer(dx, dz, 1); frame(); out.frames++;
      if (!W.into && slow > .5 && side <= 0) { side = .6; sideS = -sideS; out.sidesteps++; }     /* a player steps round a thing in the way */
      if (window.__wtTrace && W.into && out.legs === 2 && S.COLL.fab > .2) out.dbg = (out.dbg || []).concat([[p.pos.x.toFixed(2), p.pos.z.toFixed(2)], ...(S.COLL.dbg || []).slice(0, 30)]);
      if (window.__wtTrace) S.COLL.dbg = [];
      if (window.__wtTrace && W.into && out.legs === 2) out.trace = (out.trace || []).concat([[+p.pos.x.toFixed(2), +p.pos.y.toFixed(2), +p.pos.z.toFixed(2), +S.COLL.fab.toFixed(3), p.grounded ? 'g' : 'a']]);
      const sp = Math.hypot(p.vel.x, p.vel.z), dn = drawn(); if (p.grounded && Math.abs(dn - lastD) > .08 && Math.abs(dn - lastD) < 1) { out.pops++; out.worst.push(['pop', W.why, +p.pos.x.toFixed(1), +p.pos.y.toFixed(2), +p.pos.z.toFixed(1), +(dn - lastD).toFixed(2)]); } lastD = dn;
      if (!W.into && p.grounded && sp < S.MOVE.max * .25) { slow += DT; if (Math.abs(slow - .25) < DT / 2) { out.stalls++; out.worst.push(['stall', W.why, +p.pos.x.toFixed(1), +p.pos.y.toFixed(2), +p.pos.z.toFixed(1)]); } } else { if (slow >= .25) out.stallSec += slow; slow = 0; } }
    if (slow >= .25) out.stallSec += slow;
    if (!reached && !W.into) { out.stuck++; out.worst.push(['STUCK', W.why, +p.pos.x.toFixed(1), +p.pos.y.toFixed(2), +p.pos.z.toFixed(1), 'still ' + Math.hypot(W.x - p.pos.x, W.z - p.pos.z).toFixed(1) + ' m off']); } }
  L.up();
  // THE TRAP: dropped at each trunk's centre, at the ground beside it
  for (const T of trees) { const g = S.groundAt(T.x + 2, T.z + 2, 300, 0); S.godTo(T.x, g, T.z, 0); p.vel.set(0, 0, 0); let f = 0, freed = -1;
    for (; f < 180; f++) { const ox = p.pos.x - T.x, oz = p.pos.z - T.z; if (Math.hypot(ox, oz) > .05) steer(ox, oz, 1); else steer(1, 1, 1); frame();     /* out, away from the axis */ if (Math.hypot(p.pos.x - T.x, p.pos.z - T.z) > 1.2 && !(S.COLL.inside && S.COLL.on && S.COLL.inside(p.pos.x, p.pos.y + p.hh * .5, p.pos.z))) { freed = f; break; } }     /* out = 1.2 m from the trunk's axis and not inside anything */
    out.trapAt = (out.trapAt || []).concat([[T.id, +p.pos.x.toFixed(2), +p.pos.y.toFixed(2), +p.pos.z.toFixed(2), 'inside' + +(S.COLL.inside ? S.COLL.inside(p.pos.x, p.pos.y + p.hh * .5, p.pos.z) : -1), 'stall' + (S.COLL.guard ? S.COLL.guard.stallT.toFixed(2) : '-')]]);
    L.up(); out.trap.push([T.id, freed < 0 ? 'NEVER' : freed + ' frames', +p.pos.x.toFixed(1), +p.pos.z.toFixed(1)]); }
  out.unstick = (S.COLL.stat.unstick || 0) - out.unstick0; out.safeBack = (S.COLL.stat.safeBack || 0) - out.safe0; out.stallSec = +out.stallSec.toFixed(2); out.mode = S.COLL.mode + (S.COLL.on ? '' : ' (off)');
  out.route = route.map(w => w.why + ' (' + w.x.toFixed(1) + ', ' + w.z.toFixed(1) + ')'); out.stair = st || null;
  return out;
}

let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=garden`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && document.getElementById('boot').classList.contains('gone') && window.__wt.rig.ready && window.__wt.GARDEN.on && window.__wt.GARDEN.on.built && window.__wt.GARDEN.walls, null, { timeout: 240000, polling: 1000 });
  await page.evaluate(() => { const S = window.__wt; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; S.renderer.render = () => {}; });
  if (process.env.WT_TRACE) await page.evaluate(() => { window.__wtTrace = 1; });
  const R = await page.evaluate(drive);
  console.log(`== walktest ${R.mode}  ${el()}  ${R.legs} legs, ${R.frames} frames`);
  console.log(`  sidesteps ${R.sidesteps}   STALLS ${R.stalls} (${R.stallSec} s lost)   POPS ${R.pops}   STUCK legs ${R.stuck}   guard: unstuck ${R.unstick}, back to a safe spot ${R.safeBack}`);
  console.log(`  start ${JSON.stringify(R.start)} woke ${JSON.stringify(R.woke)}`);
  console.log(`  trap (dropped inside each trunk): ${R.trap.map(t => t[0] + ' ' + t[1]).join(' | ')}`);
  for (const w of R.worst.filter(w => w[0] === 'STUCK' || /rim|stair|terrace|basin/.test(w[1])).slice(0, 40)) console.log('    ' + w.join('  '));
  const per = {}; for (const w of R.worst) if (w[0] !== 'pop') per[w[1]] = (per[w[1]] || 0) + 1; console.log('  stalls per leg: ' + Object.entries(per).map(([k, n]) => k + ' ' + n).join(' | '));
  if (process.env.WT_ROUTE) console.log(R.route.join('\n'), R.stair);
  if (R.dbg) for (const d of R.dbg.slice(0, 40)) console.log('  D', JSON.stringify(d));
  if (R.trapAt) console.log(JSON.stringify(R.trapAt));
  if (R.trace) for (let i = 0; i < R.trace.length; i += 1) console.log('   ', R.trace[i].join(' '));
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
