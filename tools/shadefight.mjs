// npm run shadefight -- REGRESSION: fight the 2-layer stone guardian TO DEATH through the SHIPPED hit paths, headless, in the Combat Lab.
// Sword: `guardSweep` (what every katana swing calls, wrapped in SHJIN.melee exactly as the swing wraps it) with a real blade segment through
// his trunk at a spread of heights. Arrows: real arrow objects pushed into ARROWS and stepped by the game's own arrow code into him.
// Phases: plain blows through every armour tier -> the spirit phase -> plain blows must pass through -> walk him to the Jinra brazier and let
// the dunk happen -> Jinra blows to the kill. Exits 1 the moment a phase stalls (no piece broken in N blows, no damage, no dunk, no death).
// Only `window.__shot` + `window.__sf` (handles on guardSweep / ARROWS / arrowMesh / guardMid) are added to the served text.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; window.__sf = { guardSweep, ARROWS, arrowMesh, guardMid, GUARD, SHJIN, INFUSE, BFIRE, shadeSegPos, HEALTH }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 480, height: 480 }, deviceScaleFactor: 1 }); const errs = []; pg.on('pageerror', e => { errs.push(e.message); console.log('  pageerror', e.message); });
let bad = 0; const fail = m => { console.log('STALL: ' + m); bad = 1; };
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__sf && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(3000);
await pg.evaluate(() => { try { mel.ownAll(1); } catch (e) {} const i = mel.WEAP.slots.findIndex(s => s.key === 'katana'); if (i >= 0) mel.applySlot(i); mel.shadeAdd(); });
await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 }); await pg.waitForTimeout(1000);
const MASH = process.argv.includes('--mash');
const setup = await pg.evaluate(mash => { const G = mel.shadeList().find(g => !g.statue); G.aggro = mash ? 1 : 0; window.__G = G; return { lim: mel.shadeLimbs(mel.shadeList().indexOf(G)), braz: __sf.SHJIN.braz.length }; }, MASH); console.log((MASH ? 'MASH' : 'SKILLED') + ' setup', JSON.stringify(setup));
const limbs = () => pg.evaluate(() => mel.shadeLimbs(mel.shadeList().indexOf(window.__G)) || {});
// ONE SWORD SWING: the blade as the swing passes it to guardSweep -- `at` = a section to cut ACROSS (skilled), or null = straight across his FRONT at chest height (the masher)
const swing = (at, dmg = 1.08) => pg.evaluate(([at, dmg]) => { const G = window.__G, { guardSweep, SHJIN, shadeSegPos } = __sf, R = G.root.position, h = G.Z.P.h, p = mel.player, fx = Math.sin(G.root.rotation.y), fz = Math.cos(G.root.rotation.y);
    let a, b; if (at) { const c = shadeSegPos(G, at, R.clone()); a = c.clone().add(R.clone().set(fz * .5, 0, -fx * .5)).addScaledVector(R.clone().set(fx, 0, fz), .5); b = c.clone().add(R.clone().set(-fz * .5, 0, fx * .5)).addScaledVector(R.clone().set(fx, 0, fz), .5); }
    else { const y = R.y + h * .55; a = R.clone().set(R.x + fx * .9 + fz * .45, y, R.z + fz * .9 - fx * .45); b = R.clone().set(R.x + fx * .7 - fz * .45, y, R.z + fz * .7 + fx * .45); }
    G.hitCd = 0; const hp0 = p.hp; SHJIN.melee = 1; const n = guardSweep(a, b, .12, 1, dmg, G.root.rotation.y + Math.PI); SHJIN.melee = 0;
    return { n, dead: G.dead || 0, st: G.st, off: +Math.abs(Math.atan2(p.pos.x - G.root.position.x, p.pos.z - G.root.position.z) - G.root.rotation.y).toFixed(2), broke: Object.keys(G.sh.broke).length }; }, [at, dmg]);
// ONE REAL ARROW at a section (skilled) or his chest (masher), stepped by the game
const arrow = (at, k) => pg.evaluate(async at => { const G = window.__G, { ARROWS, arrowMesh, shadeSegPos } = __sf, R = G.root.position, h = G.Z.P.h, m = arrowMesh(); window.__shot.scene.add(m);
    const T = at ? shadeSegPos(G, at, R.clone()) : R.clone().set(R.x, R.y + h * .55, R.z), P = mel.player.pos, ax = P.x - R.x, az = P.z - R.z, al = Math.hypot(ax, az) || 1, o = T.clone().add(R.clone().set(ax / al * 6, 0, az / al * 6)); m.position.copy(o); G.hitCd = 0;
    const v = T.clone().sub(o).normalize().multiplyScalar(30), A = { m, v, t: 0, stuck: 0, from: null, mine: 1, pl: 1, gk: 0, type: 'normal', full: 0, col: [.3, .9, 1], dmg: 3, pow: .7 }; ARROWS.push(A);
    for (let k = 0; k < 120 && ARROWS.includes(A) && !A.stuck; k++) await new Promise(r => setTimeout(r, 25)); const i = ARROWS.indexOf(A); if (i >= 0) { A.m.removeFromParent(); ARROWS.splice(i, 1); } return 1; }, at);
const L0 = { armL: 'L', armR: 'R' };
if (!MASH) {
  // THE SKILLED FIGHT: each limb in turn -- cut its sections off from the SIDE (sword, every third an arrow), then hit the bare limb inside its window
  const order = ['armL', 'armR', 'head', 'chest'], SEGS = { armL: ['handL', 'forearmL', 'shoulderL'], armR: ['handR', 'forearmR', 'shoulderR'], head: ['head'], chest: ['waist', 'chest'] };
  let total = 0;
  const side = k => pg.evaluate(k => { const G = window.__G, R = G.root.position, fx = Math.sin(G.root.rotation.y), fz = Math.cos(G.root.rotation.y), p = mel.player, d = 2.6;     // his left is +X: (fz, -fx)
      const [sx, sz] = k === 'armL' ? [fz, -fx] : k === 'armR' ? [-fz, fx] : [-fx, -fz]; p.pos.set(R.x + sx * d, R.y, R.z + sz * d); }, k);
  for (const k of order) { let n = 0, st;
    while ((st = (await limbs())[k]) && st.startsWith('armour')) { const left = await pg.evaluate(segs => segs.filter(s => !window.__G.sh.broke[s]), SEGS[k]); const at = left[0] || SEGS[k][0];
      await side(k); const rr = n % 3 === 2 ? await arrow(at, k) : await swing(at); if (process.env.SFV) console.log('   blow', k, at, JSON.stringify(rr)); n++; total++; if (n > 12) { fail(`${k}: still armoured after 12 blows -- ` + JSON.stringify(await limbs())); break; } }
    if (bad) break; console.log(`  ${k}: bared in ${n} blows -> ${(await limbs())[k]}`);
    if (k === 'chest') { await side(k); const r = await swing(SEGS.chest[1]); const st2 = (await limbs()).chest; console.log('  plain blow on the bare chest:', st2); if (!st2 || !st2.startsWith('exposed')) { fail('a plain blow ended the chest (it needs Jinra)'); break; }
      await pg.evaluate(() => { const r = __sf.SHJIN.braz[0], p = mel.player; p.pos.set(r.top.x + 1.0, r.top.y - 1, r.top.z); p.vel.set(0, 0, 0); });
      const ok = await pg.waitForFunction(() => __sf.INFUSE.t > 0, null, { timeout: 60000, polling: 50 }).then(() => 1).catch(() => 0); if (!ok) { fail('no dunk at the brazier'); break; } console.log('  dunked: Jinra blade');
      const st3 = (await limbs()).chest; if (!st3 || !st3.startsWith('exposed')) { console.log('  (the chest regrew while he dunked -- strip it again)'); let m = 0; while (((await limbs()).chest || '').startsWith('armour') && m++ < 10) { await side('chest'); const left = await pg.evaluate(segs => segs.filter(s => !window.__G.sh.broke[s]), SEGS.chest); await swing(left[0] || 'chest'); } }
      await side('chest'); await swing('chest'); const dead = await pg.evaluate(() => !!window.__G.dead); if (!dead) { fail('the Jinra blow on the bare chest did not end him'); break; } console.log(`  chest: the Jinra blow -- dead (${total} blows)`); break; }
    await side(k); const r = await swing(SEGS[k][SEGS[k].length > 1 ? 1 : 0]); const st2 = (await limbs())[k]; if (st2 !== 'dead') { fail(`${k}: the blow on the bare limb did not extinguish it -> ${st2}`); break; } console.log(`  ${k}: extinguished`); }
  if (!bad) { const gone = await pg.waitForFunction(() => !mel.SHADEFX.dying.length, null, { timeout: 120000, polling: 250 }).then(() => 1).catch(() => 0); console.log(gone ? 'dissolved, Tama ' + JSON.stringify(await pg.evaluate(() => ({ live: mel.TAMA.w.length }))) : 'still dissolving'); }
} else {
  // THE MASHER: in front of him, sweeping across his front at chest height and loosing plain arrows at his chest, for 90 s of GAME time
  const hp0 = await pg.evaluate(() => mel.player.hp); let blows = 0, hurt = 0, last = hp0; const T0 = await pg.evaluate(() => performance.now());
  const gt0 = await pg.evaluate(() => mel.TIME ? mel.TIME.t : 0);
  for (let k = 0; k < 450; k++) { await pg.evaluate(() => { const G = window.__G, R = G.root.position, p = mel.player; p.pos.set(R.x + Math.sin(G.root.rotation.y) * 2.4, R.y, R.z + Math.cos(G.root.rotation.y) * 2.4); });
    if (k % 3 === 2) await arrow(null); else await swing(null); blows++; const h = await pg.evaluate(() => mel.player.hp); if (h < last - .01) hurt++; last = h;
    if (await pg.evaluate(() => !!window.__G.dead)) { fail(`the masher KILLED him in ${blows} blows`); break; } await pg.waitForTimeout(200); }
  console.log(`masher: ${blows} blows, limbs ${JSON.stringify(await limbs())}, he hurt the masher ${hurt} times; his blows ` + JSON.stringify(await pg.evaluate(() => ({ stat: __sf.GUARD.stat, hp0: mel.player.hp, st: window.__G.st, aggro: window.__G.aggro, health: __sf.HEALTH.on }))));
  if (!bad && (await limbs()).chest === 'dead') fail('the chest died to a mash'); }
if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
console.log(bad ? 'shadefight: FAIL' : MASH ? 'shademash: ok -- mashing his front did not kill him' : 'shadefight: ok -- limb by limb, the Jinra finish');
await br.close(); srv.close(); process.exit(bad);
