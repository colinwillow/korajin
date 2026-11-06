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
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; window.__sf = { guardSweep, ARROWS, arrowMesh, guardMid, GUARD, SHJIN, INFUSE, BFIRE }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: 480, height: 480 }, deviceScaleFactor: 1 }); const errs = []; pg.on('pageerror', e => { errs.push(e.message); console.log('  pageerror', e.message); });
let bad = 0; const fail = m => { console.log('STALL: ' + m); bad = 1; };
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__sf && window.mel && mel.shadeAdd && document.getElementById('boot').classList.contains('gone'), null, { timeout: 400000, polling: 1000 }); await pg.waitForTimeout(3000);
await pg.evaluate(() => { try { mel.ownAll(1); } catch (e) {} const i = mel.WEAP.slots.findIndex(s => s.key === 'katana'); if (i >= 0) mel.applySlot(i); mel.shadeAdd(); });
await pg.waitForFunction(() => mel.shadeList().length >= 2, null, { timeout: 120000, polling: 500 }); await pg.waitForTimeout(1000);
// the live one, held in place (so the blows aim), the player 2.5 m in front of it
const setup = await pg.evaluate(() => { const G = mel.shadeList().find(g => !g.statue); G.aggro = 0; window.__G = G; return { segs: G.sh.segs.length, braz: __sf.SHJIN.braz.length, hp: G.hp }; }); console.log('setup', JSON.stringify(setup));
// ONE SWORD SWING through his trunk at height frac `hf` (a blade segment, as the swing passes it to guardSweep); returns what moved
const swing = (hf, dmg = 1.08) => pg.evaluate(([hf, dmg]) => { const G = window.__G, { guardSweep, SHJIN } = __sf, R = G.root.position, h = G.Z.P.h, p = mel.player, T = THREE_V(); 
    function THREE_V() { return R.clone(); }
    const y = R.y + h * hf, a = R.clone().set(R.x - 1.2, y, R.z + 1.2), b = R.clone().set(R.x + 1.2, y, R.z - .2);
    p.pos.set(R.x, R.y, R.z + 2.6); G.hitCd = 0; const before = { broke: Object.keys(G.sh.broke).length, hp: G.hp, bare: G.bare };
    SHJIN.melee = 1; const n = guardSweep(a, b, .12, 1, dmg, Math.PI); SHJIN.melee = 0;
    return { n, broke: Object.keys(G.sh.broke).length, d: Object.keys(G.sh.broke).length - before.broke, hp: +G.hp.toFixed(2), dhp: +(before.hp - G.hp).toFixed(2), bare: G.bare, dead: G.dead || 0 }; }, [hf, dmg]);
// ONE REAL ARROW, loosed from 6 m at his height frac `hf`, stepped by the game; returns once it is gone
const arrow = hf => pg.evaluate(async hf => { const G = window.__G, { ARROWS, arrowMesh, SHJIN } = __sf, R = G.root.position, h = G.Z.P.h, m = arrowMesh(); window.__shot.scene.add(m);
    const o = R.clone(); o.z += 6; o.y = R.y + h * hf; m.position.copy(o); G.hitCd = 0; const before = { broke: Object.keys(G.sh.broke).length, hp: G.hp };
    const A = { m, v: R.clone().set(0, 0, -30), t: 0, stuck: 0, from: null, mine: 1, pl: 1, gk: 0, type: 'normal', full: 0, col: [.3, .9, 1], dmg: 3, pow: .7 }; ARROWS.push(A);
    for (let k = 0; k < 120 && ARROWS.includes(A) && !A.stuck; k++) await new Promise(r => setTimeout(r, 25));
    const i = ARROWS.indexOf(A); if (i >= 0) { A.m.removeFromParent(); ARROWS.splice(i, 1); }
    return { broke: Object.keys(G.sh.broke).length, d: Object.keys(G.sh.broke).length - before.broke, hp: +G.hp.toFixed(2), dhp: +(before.hp - G.hp).toFixed(2), thru: A.thru === G ? 1 : 0, bare: G.bare }; }, hf);
// PHASE 1: the armour, sword and arrows alternating, heights cycling feet -> head
const H = [.06, .3, .55, .75, .9, .45, .2, .65];
let blows = 0, sinceBreak = 0, lastBroke = 0;
while (true) { const r = blows % 3 === 2 ? await arrow(H[blows % H.length]) : await swing(H[blows % H.length]); blows++;
  if (r.broke > lastBroke) { lastBroke = r.broke; sinceBreak = 0; console.log(`  blow ${blows} (${blows % 3 === 0 ? 'arrow' : 'sword'}): ${r.broke}/${setup.segs} off`); } else sinceBreak++;
  if (r.bare) { console.log(`armour off in ${blows} blows`); break; }
  if (sinceBreak >= 10) { fail(`no piece broke in 10 blows at ${r.broke}/${setup.segs} -- ` + JSON.stringify(await pg.evaluate(() => { const G = window.__G, S = G.sh; return { left: S.segs.filter(s => !S.broke[s]).map(s => s + ':' + S.hp[s].toFixed(2)) }; }))); break; }
  if (blows > 150) { fail('150 blows'); break; } }
// PHASE 2: plain blows on the bare spirit must PASS THROUGH (no damage)
if (!bad) { const hp0 = await pg.evaluate(() => window.__G.hp); const a = await swing(.5), b = await arrow(.55); console.log('plain on the spirit', JSON.stringify({ sword: a.dhp, arrow: b.dhp, thru: b.thru }));
  if (a.dhp > 0 || b.dhp > 0) fail('a plain blow hurt the spirit with NEEDS JINRA on'); }
// PHASE 3: the dunk -- walk to the brazier with the sword out
if (!bad) { await pg.evaluate(() => { const r = __sf.SHJIN.braz[0], p = mel.player; p.pos.set(r.top.x + 1.0, r.top.y - 1, r.top.z); p.vel.set(0, 0, 0); });
  const ok = await pg.waitForFunction(() => __sf.INFUSE.t > 0, null, { timeout: 60000, polling: 100 }).then(() => 1).catch(() => 0);
  if (!ok) fail('no dunk at the brazier'); else console.log('dunked', JSON.stringify(await pg.evaluate(() => ({ t: +__sf.INFUSE.t.toFixed(1), n: __sf.INFUSE.n, bfire: __sf.BFIRE.on })))); }
// PHASE 4: Jinra blows to the kill
if (!bad) { let k = 0; for (; k < 30; k++) { await pg.evaluate(() => { __sf.BFIRE.on = 2; }); const r = await swing(.5); if (r.dead) break; if (k > 4 && r.dhp <= 0) { fail('Jinra blows do nothing: ' + JSON.stringify(r)); break; } }
  if (!bad) { const dead = await pg.evaluate(() => !!window.__G.dead); if (!dead) fail('30 Jinra blows and he lives'); else console.log(`killed with ${k + 1} Jinra blows`); } }
if (!bad) { const gone = await pg.waitForFunction(() => !mel.SHADEFX.dying.length, null, { timeout: 120000, polling: 250 }).then(() => 1).catch(() => 0); console.log(gone ? 'dissolved, Tama ' + JSON.stringify(await pg.evaluate(() => ({ live: mel.TAMA.w.length, n: mel.TAMA.n }))) : 'still dissolving'); }
if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '));
console.log(bad ? 'shadefight: FAIL' : 'shadefight: ok -- armour, pass-through, dunk, kill');
await br.close(); srv.close(); process.exit(bad);
