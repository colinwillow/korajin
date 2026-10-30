// THE MOVE TABLE (LEVELDESIGN.md layer 0, STEER 000 step 1). `npm run moves [row ...] [--json-only]`
// Boots the SHIPPED index.html headless (the `tools/play.mjs` pattern: a fake clock, `frameBody()` stepped by hand at 1/60 s, the
// raster a no-op) in the BUILDING FORGE as KORAJIN's hero (`agoblin`, Grumbo), and measures every move and combo by DRIVING THE PADS:
// real PointerEvents into the shipped `bindStick` handlers (tap, flick, hold, release -- the same gesture code a thumb reaches), so a
// row is what the game does, never a re-derivation of its physics. Test geometry (walls, bars, ledges, steps) is pushed into the
// shipped `BOXES` on the empty floor, far from the middle. Every row: max height (feet over take-off), max horizontal distance
// (take-off to touch-down), air time, and COMFORTABLE (80% of max) -- what a level may ask for. Writes tools/moves.json; the table
// in LEVELGRID.md (between its MOVE TABLE markers) is rewritten with the build number. `npm run moves jump bar` runs only those rows (raw).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('moves: playwright is not installed'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ARGS = process.argv.slice(2), ONLY = ARGS.filter(a => !a.startsWith('--'));
const HANDLE = 'window.__mv = { frameBody, player, stick, PADS, STICK, MOVE, AIR, WRUN, HBAR, hbarMake, BOXES, boxGrid, ZOOM, NINJA, CROUCH, LHOLD, renderer, rig, godTo, cam, HERO, WORLD, FLICK, RIG, LEDGE, AIRK, HEALTH, bodyK }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; if (!s.includes(k)) { console.error('moves: no mel handle'); process.exit(1); } body = s.replace(k, HANDLE + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body);
});
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(() => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.hero2', 'agoblin'); localStorage.setItem('mel.game', 'korajin'); } catch (e) {} });
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
if (process.env.MOVELOG) page.on('console', m => console.log('  [page] ' + m.text().slice(0, 200)));
// ---- THE SUMMARY: the rows the level generator reads. h = metres up (his feet over the floor he left, or the height he reaches), d = metres
// across (take-off to touch-down), air = seconds; comfy = COMFY of the max, what a level may ask for (a gap never longer than its move's comfy)
const COMFY = .8, r2 = v => v == null ? null : +(+v).toFixed(2);
function summarise(R, head) {
  const M = {}, add = (key, label, o, how) => { if (!o || o.fail) { M[key] = { label, fail: o ? o.fail : 'not measured' }; return; }
    const e = { label }; for (const k of ['h', 'd', 'air', 'v']) if (o[k] != null) e[k] = r2(o[k]); if (e.h != null) e.comfy_h = r2(e.h * COMFY); if (e.d != null) e.comfy_d = r2(e.d * COMFY); if (how) e.how = how; M[key] = e; };
  const S = R.speed || {};
  add('jump', 'jump (standing, left tap)', R.jump_stand);
  add('jump_walk', 'walk + jump', R.jump_walk); add('jump_run', 'run + jump', R.jump_run);
  add('long_jump', 'sprint, let go = the LONG JUMP', R.jump_sprint, 'right pad held still while running; letting go jumps. Spends the double.');
  add('dbl', 'double jump (standing)', R.dbl_stand); add('dbl_run', 'run + double jump (second tap at the top)', R.dbl_run);
  add('high_min', 'high jump (backflip), bare charge', R.high_jump_min); add('high', 'high jump (backflip), full charge', R.high_jump, 'right pad held still at rest ' + (R.high_jump && R.high_jump.hold) + ' s. Spends the double.');
  add('high_fwd', 'high jump + push forward in the air', R.high_jump_fwd);
  for (const n of [1, 2, 3]) { add('run_k' + n, 'run jump + ' + n + ' air kick' + (n > 1 ? 's' : ''), R['jump_run_kick' + n]); add('long_k' + n, 'long jump + ' + n + ' air kick' + (n > 1 ? 's' : ''), R['jump_sprint_kick' + n]);
    add('dbl_k' + n, 'run + double jump + ' + n + ' air kick' + (n > 1 ? 's' : ''), R['dbl_run_kick' + n]); add('high_k' + n, 'high jump + ' + n + ' air kick' + (n > 1 ? 's' : ''), R['high_kick' + n]); }
  add('zoom_jump', 'zoom + jump', R.zoom_jump); add('zoom_dbl', 'zoom + double jump', R.zoom_dbl); add('zoom_dbl_k3', 'zoom + double jump + 3 air kicks', R.zoom_dbl_kick3);
  const B = R.bar || {}; add('bar_high', 'HIGH BAR launch, released for height', B.high && { h: B.high.h, d: B.high.d, air: B.high.air }, B.high && 'full pump, let go at ' + B.high.th + ' rad past the bottom; h over the floor, d from the bar');
  add('bar_far', 'HIGH BAR launch, released for distance', B.far && { h: B.far.h, d: B.far.d, air: B.far.air }, B.far && 'full pump, let go at ' + B.far.th + ' rad past the bottom; h over the floor, d from the bar');
  const W = R.wall_up || {}, WJ = R.wall_up_jump || {}, wu = (k, label, o) => add(k, label, o && { h: o.hands, v: o.v }, o && ('feet reach ' + o.feet + ' m; h = the highest lip his hands reach'));
  wu('wall_up_run', 'wall run UP, from a run (right tap at the face)', W.run_tap); wu('wall_up_sprint', 'wall run UP, from a sprint (no tap needed)', W.sprint);
  wu('wall_up_zoom', 'wall run UP, from a zoom (no tap)', W.zoom); wu('wall_up_runjump', 'wall run UP, jumping into the face at a run', WJ.run);
  wu('wall_up_longjump', 'wall run UP, long-jumping into the face', WJ.sprint); wu('wall_up_zoomjump', 'wall run UP, zoom-jumping into the face', WJ.zoom);
  const SD = R.wall_side || {};
  add('wall_side_run', 'SIDE wall run, from a run (right tap beside the face)', SD.run && { d: SD.run.along, h: SD.run.h, v: SD.run.v }, 'd = metres along the face');
  add('wall_side_sprint', 'SIDE wall run, from a sprint', SD.sprint && { d: SD.sprint.along, h: SD.sprint.h, v: SD.sprint.v }, 'd = metres along the face');
  add('wall_kick', 'SIDE wall run + KICK off it (tap again)', SD.run_kick && { d: SD.run_kick.kick_d, h: SD.run_kick.kick_h, air: SD.run_kick.kick_air }, SD.run_kick && ('kicked off ' + SD.run_kick.kick_at + ' s into the run; lands ' + SD.run_kick.kick_out + ' m out from the face'));
  const C = R.wall_chain || {}; const g = (C.gain_per_kick || []), gm = g.length ? g.reduce((a, b) => a + b, 0) / g.length : null;
  add('wall_chain', 'WALL SLIDE + wall jump chain (faces ' + (C.gap || 4.6) + ' m apart), per kick', gm != null && { h: gm }, C.catches && ('first catch at ' + C.catches[0] + ' m off a run jump, then +' + r2(gm) + ' m every kick, no limit met in ' + g.length + ' kicks (top ' + C.top + ' m)'));
  const LD = R.ledge || {}; add('ledge_jump', 'highest TOP reached from the face: jump', LD.jump != null && { h: LD.jump }, LD.how); add('ledge_dbl', 'highest TOP reached from the face: double jump', LD.dbl != null && { h: LD.dbl }, LD.how);
  const ST = R.step || {}; M.step = { label: 'the STEP (walked up with no jump)', h: ST.max, comfy_h: r2(Math.min(ST.max || 0, .3)), how: 'MOVE.step ' + ST.MOVE_step + '; stairs are cut at .30 risers (STEER)' };
  const F = R.fall || [], hard = F.find(q => q.hard), lost = F.filter(q => q.hp_lost > 0);
  M.fall = { label: 'SAFE FALL', h: F.length ? Math.max(...F.map(q => q.h)) : null, how: (lost.length ? 'damage from ' + lost[0].h + ' m' : 'NO fall damage at any height tried (to ' + (F.length ? Math.max(...F.map(q => q.h)) : '?') + ' m)') + '; the HARD landing from ' + (hard ? hard.h : '-') + ' m (impact over ' + 11 + ' m/s) pins him ' + (hard ? hard.landing_s : '-') + ' s, a soft one ' + (F[0] ? F[0].landing_s : '-') + ' s', drops: F };
  return { build: head.build, measured: new Date().toISOString().slice(0, 10), hero: head.hero, world: head.world, fps: 60, comfy: COMFY,
    speeds: { walk: S.walk, run: S.run, sprint: S.sprint, zoom: R.zoom && R.zoom.v_launch, zoom_2s_m: R.zoom && R.zoom.d_2s }, moves: M, raw: R };
}
function table(o) {
  const f = v => v == null ? '' : (+v).toFixed(2).replace(/\.?0+$/, '');
  let s = `| move | max h (m) | max d (m) | air (s) | comfy h | comfy d | notes |\n|---|---|---|---|---|---|---|\n`;
  for (const [k, e] of Object.entries(o.moves)) s += e.fail ? `| ${e.label} | -- | -- | -- | -- | -- | NOT MEASURED: ${e.fail} |\n` : `| ${e.label} | ${f(e.h)} | ${f(e.d)} | ${f(e.air)} | ${f(e.comfy_h)} | ${f(e.comfy_d)} | ${e.v != null ? 'at ' + f(e.v) + ' m/s. ' : ''}${e.how || ''} |\n`;
  const sp = o.speeds; s += `\nSpeeds (m/s): walk ${f(sp.walk)}, run ${f(sp.run)}, sprint ${f(sp.sprint)}, zoom launch ${f(sp.zoom)} (${f(sp.zoom_2s_m)} m in its first 2 s).`;
  return s;
}
let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge`, { timeout: 120000 });
  await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__mv && window.__mv.rig.ready, null, { timeout: 240000, polling: 1000 });
  const head = await page.evaluate(() => { const S = window.__mv; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t; S.renderer.render = () => {};
    return { world: S.WORLD.now, hero: S.HERO.pick, h: S.RIG.height, build: typeof BUILD !== 'undefined' ? BUILD : null }; });
  head.build = head.build || (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/BUILD = '(m\d+)'/) || [])[1];
  console.log(`== moves  booted ${el()}  world ${head.world}  hero ${head.hero} (${head.h} m)  build ${head.build}`);
  await page.addScriptTag({ path: path.join(ROOT, 'tools/moves.page.js') });
  const raw = await page.evaluate(only => window.__moves(only), ONLY);
  if (ONLY.length) { console.log(JSON.stringify(raw, null, 1)); }
  else {
    const out = summarise(raw, head);
    fs.writeFileSync(path.join(ROOT, 'tools/moves.json'), JSON.stringify(out, null, 1) + '\n');
    console.log(table(out)); console.log(`wrote tools/moves.json  (${Object.keys(out.moves).length} moves)  ${el()}`);
    // and the table in LEVELGRID.md, between its markers (the prose round it is written by hand)
    const LG = path.join(ROOT, 'LEVELGRID.md'), A = '<!-- MOVE TABLE START (npm run moves writes this) -->', Bm = '<!-- MOVE TABLE END -->';
    if (fs.existsSync(LG)) { const s = fs.readFileSync(LG, 'utf8'), i = s.indexOf(A), j = s.indexOf(Bm);
      if (i >= 0 && j > i) { fs.writeFileSync(LG, s.slice(0, i + A.length) + `\nMeasured on **${out.build}**'s physics, ${out.measured}, as ${out.hero}. Comfortable = ${out.comfy * 100}% of max.\n\n` + table(out) + '\n' + s.slice(j)); console.log('wrote LEVELGRID.md MOVE TABLE'); }
      else console.log('LEVELGRID.md has no MOVE TABLE markers: the table is printed above, not written'); }
    const bad = Object.entries(raw).filter(([k, v]) => v && v.fail); if (bad.length) { console.log('FAILED ROWS: ' + bad.map(([k, v]) => k + ' (' + v.fail + ')').join(', ')); code = 1; }
  }
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) { console.log('page errors:', [...new Set(errs)].slice(0, 8).join(' || ')); }
await browser.close(); server.close(); process.exit(code);
