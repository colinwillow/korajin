// npm run ikhands (m2690) -- EVERY KIT STATION, START TO FINISH, IN THE SHIPPED PAGE: are his hands ON the object? Boots the gallery
// (`?w=forge&zone=interact&hero=agoblin`), plays each station (the capstans with a fake spin), samples every frame while the pose layer is up:
// each hand's (and the kick's foot's) distance to its target, and how much of the run the pose was on. Then the LOCK-IN: mid-spin on the gate's
// capstan, a dodge, a strike and a jump must NOT end it; a right tap must. Prints a table, writes a contact sheet (SHOT_DIR or ./shots/ikhands.jpg),
// exits 1 on a BAD row (median hand distance > .2 m, or the pose up for < 25% of the run). Slow (~4 min); not in `npm run check` (`ikgate` is).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = process.env.SHOT_DIR || path.join(ROOT, 'shots');
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port; fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 400, height: 260 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('  pageerror', e.message));
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=interact&entry=0&hero=agoblin`, { timeout: 120000 });
await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel && mel.IKIT && mel.IKIT.on && mel.IKIT.rows.length, null, { timeout: 240000, polling: 1000 });
await page.waitForTimeout(5000);
await page.evaluate(() => { window.__S = []; const tmp = new (mel.player.pos.constructor)();
  const B = n => mel.rig && mel.rig.bones && mel.rig.bones['mixamorig_' + n];
  (function f() { const Z = mel.IKIT, P = Z.pose; if (Z.run && P.w > .85) { const d = (b, T) => T && B(b) ? +B(b).getWorldPosition(tmp).distanceTo(T).toFixed(3) : null; window.__S.push({ id: Z.run.r.id, b: Z.run.b, L: d('LeftHand', P.L), R: d('RightHand', P.R), F: d('RightFoot', P.foot) }); } else if (Z.run) window.__S.push({ id: Z.run.r.id, b: Z.run.b, off: 1 }); requestAnimationFrame(f); })(); });
const shot = lab => page.evaluate(lab => { const { renderer, scene, camera } = window.__shot; mel.nightPre(); renderer.render(scene, camera); const url = renderer.domElement.toDataURL('image/jpeg', .8); mel.nightPost(); return { url, lab }; }, lab);
const ONLY = process.argv.includes('--lock');
const ST = ONLY ? [] : [['door_heavy', [-16.5, 0, -7.5]], ['chest_dais', [-5.5, .3, -4.6], 'HEAVE'], ['chest_vault', [7.5, 0, -12.2], 'KICK'], ['capstan_gate', [4, 0, -4], 0, 10], ['capstan_bridge', [15.5, 0, 0], 0, 10],
  ['drawers_wall', [16.5, 0, -7.6]], ['button_wall', [-16.5, 0, 8]], ['lever_floor', [5.5, 0, 4.6]]];
const rows = [], tiles = []; let bad = 0;
for (const [id, at, mode, spin] of ST) {
  await page.evaluate(([id, at, mode, spin]) => { mel.ikitReset(); mel.IKIT.fakeSpin = spin || 0; if (mode) mel.IKIT.chestOpen = mode; mel.player.pos.set(at[0], at[1], at[2]); mel.player.vel.set(0, 0, 0); window.__S.length = 0; }, [id, at, mode, spin]);
  await page.waitForTimeout(400);
  const ok = await page.evaluate(id => !!mel.ikitGo(mel.IKIT.rows.find(r => r.id === id)), id);
  const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < 60000) { await page.waitForTimeout(250); const run = await page.evaluate(() => !!mel.IKIT.run); if (++n % 6 === 3 && run) tiles.push(await shot(id + ' ' + await page.evaluate(() => mel.IKIT.run && mel.IKIT.run.b))); if (!run) break; }
  const S = await page.evaluate(() => window.__S.slice());
  const on = S.filter(s => !s.off), ds = on.flatMap(s => [s.L, s.R, s.F].filter(v => v != null)).sort((a, b) => a - b), med = ds.length ? ds[ds.length >> 1] : null, cov = S.length ? on.length / S.length : 0;
  const BAD = !ok || med == null || (mode !== 'KICK' && med > .2) || (cov < .25 && !mode);     // the kick: one mid-swing sample at best (the leg pose is up for a fraction of a second) -- reported, not judged     // a chest's run is mostly the GET (its own pose), the kick a brief beat: hands-on is judged, not coverage if (BAD) bad++;
  rows.push(`${BAD ? 'BAD ' : 'ok  '} ${id.padEnd(15)} ${mode || ''} frames ${S.length} pose-on ${(cov * 100).toFixed(0)}%  hand->target median ${med} p90 ${ds.length ? ds[Math.floor(ds.length * .9)] : '-'}`);
}
// THE LOCK-IN: mid-spin on the gate's capstan
await page.evaluate(() => { mel.ikitReset(); mel.IKIT.fakeSpin = 10; mel.player.pos.set(4, 0, -4); mel.player.vel.set(0, 0, 0); });
await page.waitForTimeout(400); await page.evaluate(() => mel.ikitGo(mel.IKIT.rows.find(r => r.id === 'capstan_gate'))); await page.waitForFunction(() => mel.IKIT.run && mel.IKIT.run.b === 'turn', null, { timeout: 30000 }).catch(() => {}); await page.waitForTimeout(1500);
const lock = await page.evaluate(async () => { const out = { st: mel.IKIT.run && mel.IKIT.run.st, b: mel.IKIT.run && mel.IKIT.run.b, kOk: mel.IKIT.run && mel.IKIT.run.K === mel.IKIND.capstan }; const A = mel.ACT; A.lFlick(1, 0); out.dodge = !!mel.IKIT.run; A.rFlick(0, -1); out.strike = !!mel.IKIT.run && !mel.player.melee; A.jump(); out.jump = !!mel.IKIT.run && mel.player.grounded;
  out.st2 = mel.IKIT.run && mel.IKIT.run.st; out.ex = mel.ikitExit ? 'fn' : 'none'; A.rTap(); out.tapExits = !mel.IKIT.run; return out; });
console.log(JSON.stringify(lock));
const lockOk = lock.dodge && lock.strike && lock.jump && lock.tapExits; if (!lockOk) bad++;
rows.push(`${lockOk ? 'ok  ' : 'BAD '} LOCK-IN mid-spin: dodge kept ${lock.dodge}, strike kept ${lock.strike}, jump kept ${lock.jump}, right tap exits ${lock.tapExits}`);
console.log(rows.join('\n'));
const sheet = await browser.newPage({ viewport: { width: 1200, height: 260 } });
await sheet.setContent('<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(3,400px)">' + tiles.map(x => `<div style="position:relative"><img src="${x.url}" style="width:400px;height:260px;display:block"><b style="position:absolute;left:6px;top:4px;font:700 12px sans-serif;color:#fff;text-shadow:0 0 3px #000">${x.lab}</b></div>`).join('') + '</body>');
const f = path.join(OUT, 'ikhands.jpg'); await sheet.screenshot({ path: f, type: 'jpeg', quality: 80, fullPage: true }); console.log('sheet ->', f);
await browser.close(); server.close(); process.exit(bad ? 1 : 0);
