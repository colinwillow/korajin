// npm-less probe (m2759 STABILISE): boots EVERY forest-temple entry in a real (swiftshader) browser, wakes every room zone, waits WAIT ms (default 30 s)
// and prints per entry: where he stands vs the ground, BOUNDS stats / gaps, live bodies outside every part, the Thornback, COLL unsticks, page errors and
// FTEMPLE / BOUNDS GAP notes. ENTRIES=hub,roomC to narrow. Not a gate: run it after a temple build that moves rooms, bounds or foes.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = '/home/user/korajin', req = createRequire(ROOT + '/tools/x.mjs'); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__rc = { ARENA, ftinWake: typeof ftinWake !== "undefined" ? ftinWake : null, THORN, BOUNDS, boundsRow, boundsPart, collRay: typeof collRay !== "undefined" ? collRay : null, groundAt, COLL, ledgeGo, MBAR, stick, cam, stickWorld, IKIT, BOXES, frameBody, renderer, scene, camera, player, FTEMPLE, ftinBossFlat, ftinBossPlate, ftinBossP2, ftinBossP3 }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok));
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const entries = (process.env.ENTRIES || 'hub,roomA,roomB,roomC,roomD,roomE,roomF,roomX,boss').split(',');
for (const at of entries) { const pg = await br.newPage({ viewport: { width: 480, height: 300 } }); const errs = [], notes = [];
  pg.on('pageerror', e => errs.push(e.message.slice(0, 160))); pg.on('console', m => { const t = m.text(); if (/BOUNDS GAP|FTEMPLE [A-Z]+ |THREW|Error/i.test(t)) notes.push(t.slice(0, 160)); });
  try { await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html?w=forge&zone=ftemple&at=${at}${at === 'hub' ? '' : '&grant=1'}`, { timeout: 120000 });
    await pg.waitForFunction(() => window.__rc && window.__rc.FTEMPLE.on && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 });
    await pg.waitForTimeout(4000);
    const r0 = await pg.evaluate(() => { const S = window.__rc, p = S.player.pos, Z = S.FTEMPLE.L.S.zones || {}; const at = p.toArray(); const g = S.groundAt(p.x, p.z, p.y + .5, 1);
      for (const k of Object.keys(Z)) { try { S.FTEMPLE.room && (S.FTEMPLE.room.woke[k] = S.FTEMPLE.room.woke[k]); } catch (e) {} }
      return { at: at.map(v => +v.toFixed(1)), ground: +(+g).toFixed(2) }; });
    // wake every zone's foes (as walking in would) and wait
    await pg.evaluate(() => { const Z = window.__rc.FTEMPLE.L.S.zones || {}; window.__woke = Object.keys(Z); try { for (const k of Object.keys(Z)) window.__rc.ftinWake && window.__rc.ftinWake(k); } catch (e) {} });
    await pg.waitForTimeout(+(process.env.WAIT || 30000));
    const r1 = await pg.evaluate(() => { const S = window.__rc, B = S.BOUNDS, R = S.boundsRow(), p = S.player.pos; const out = []; let n = 0;
      for (const d of S.ARENA.live) { if (!d.root || d.dead) continue; n++; const q = d.root.position; if (!R || !S.boundsPart(R, q.x, q.y + .5, q.z, .8)) out.push(q.toArray().map(v => +v.toFixed(1)).join(',')); }
      return { p: p.toArray().map(v => +v.toFixed(1)), grounded: S.player.grounded, bstat: B.stat, gaps: B.gaps, bodies: n, bodiesOut: out, thorn: S.THORN.list.map(T => [T.x, T.y, T.z].map(v => +v.toFixed(1)).join(',')), coll: { un: S.COLL.stat.unstick, sb: S.COLL.stat.safeBack } }; });
    console.log(at, JSON.stringify({ r0, r1, errs: errs.slice(0, 4), notes: notes.slice(0, 6) }));
  } catch (e) { console.log(at, 'FAIL', e.message.slice(0, 200), errs.slice(0, 3)); }
  await pg.close(); }
await br.close(); srv.close();
