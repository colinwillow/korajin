// npm run deathkit -- THE DEATH-KIT PROBE (m2806). Every humanoid enemy kind (not a creature, not a civilian, not the Saint / Shadow -- they answer
// every blow) is spawned in the Combat Lab headless with its AI off and killed with PLAIN katana blows (an armoured kind -- `pierce: 'charge'` -- with the charge, its tool) (`dummyBlow` while a melee swing is up, the
// combat defence off): it must lose at least one limb (`limbCut`) and BURST (`limbBoom`). One row per kind; exits 1 on a BAD row. SHEET=1 also grabs
// frames of four kinds coming apart into images/renders/deathkit/sheet.png (a row per kind). Not in `npm run check` -- every kind loads (minutes).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url); let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, "images/renders/deathkit"); fs.mkdirSync(OUT, { recursive: true });
const HOOK = `window.__dk = {
  kinds: () => Object.keys(ARENA.kinds).filter(k => { const A = ARENA.kinds[k]; return !A.creature && !A.civ && A.death !== 'none' && k !== 'SAINT' && k !== 'SHADOW'; }),
  clear: () => { try { arenaClear(); } catch (e) {} },
  spawn: k => { CLAB.ai = 0; window.__dk.k = k; window.__dk.d = null; window.__dk.err = ''; arenaSpawn(k).then(() => { window.__dk.d = ARENA.live[ARENA.live.length - 1]; }).catch(e => { window.__dk.err = e.message; }); },
  ready: () => { const d = window.__dk.d; return window.__dk.err ? 'ERR ' + window.__dk.err : !!d && d.st !== 'beamIn' && !d.entering && d.st !== 'stoneT'; },
  place: () => { const d = window.__dk.d, P = d.root.position, p = player; p.pos.set(P.x, P.y, P.z + 2.2); p.vel.set(0, 0, 0); p.faceH = p.heading = Math.PI; cam.az = Math.PI + .3; d.h = 0; },
  hit: () => { const S = window.__dk, d = S.d, p = player; if (!d || d.boomed) return { boomed: 1 }; const h = Math.atan2(d.root.position.x - p.pos.x, d.root.position.z - p.pos.z), c0 = CBT.on, b0 = p.melee;
    const ks = WEAP.slots.findIndex(q => q.key === 'katana'); if (ks >= 0) p.slot = ks;     // the katana in hand (a headless lab boots empty-handed)
    S.n = (S.n || 0) + 1; const arm = (CBT.def[d.K.arena] || {}).pierce === 'charge'; CBT.on = 0; p.melee = 1; if (arm) p.chargeGo = 1;     /* an ARMOURED kind is killed with the tool it asks for -- the katana charge */ p.meleeName = 'katana_slash_1'; d.cool = 0; d.cb = null;
    try { dummyBlow(d, h, .6, volCost(S.n % 3)); } finally { p.melee = b0; CBT.on = c0; p.chargeGo = 0; }
    return { cuts: d.cut ? Object.keys(d.cut).length : 0, boomed: d.boomed ? 1 : 0, hp: +(d.hp || 0).toFixed(2), st: d.st }; },
  blade: () => { const ks = WEAP.slots.findIndex(q => q.key === 'katana'); if (ks >= 0) player.slot = ks; return !!(slotNow() && slotNow().blade); },
  stat: () => ({ cuts: LIMB.stat.cuts, booms: LIMB.stat.booms, drops: LIMB.stat.drops || 0 }),
  cam: () => { const S = window.__dk; if (S.wrapped) return; S.wrapped = 1; const R0 = renderer.render.bind(renderer), m = new THREE.Vector3();
    renderer.render = (sc, cm) => { const d = S.d; if (d && cm === camera) { const p = player.pos, P = d.root.position; m.set((p.x + P.x) / 2, P.y + .9, (p.z + P.z) / 2); camera.position.set(m.x + 4.2, m.y + 1.4, m.z + 1.2); camera.lookAt(m); camera.updateMatrixWorld(); } return R0(sc, cm); }; },
};`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let b = fs.readFileSync(f); if (f.endsWith('index.html')) b = b.toString().replace('window.melee = window.mel = {', HOOK + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const page = await browser.newPage({ viewport: { width: 300, height: 340 }, deviceScaleFactor: 1 }); page.on('pageerror', e => console.log('pageerror', e.message.slice(0, 140)));
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab`, { waitUntil: 'commit', timeout: 240000 });
const ev = (f, ...a) => page.evaluate(([f, a]) => window.__dk ? window.__dk[f](...a) : null, [f, a]);
const t0 = Date.now(); while (Date.now() - t0 < 240000) { await page.waitForTimeout(1000); const k = await ev('kinds').catch(() => null); const run = await page.evaluate(() => typeof ENTRY !== 'undefined' && ENTRY.run).catch(() => true); if (k && !run) break; }
await page.waitForTimeout(6000);
const SHEET = process.env.SHEET === '1', PICK = ['HUSK_SOLDIER', 'HUSK_GUARD', 'JACKAL', 'HUSK_ARCHER'], rows = [];
if (SHEET) await page.addStyleTag({ content: 'body *:not(canvas) { visibility: hidden !important; } canvas { visibility: visible !important; }' });     // the game's own lens: behind him, the body ahead
const kinds = process.env.KINDS ? process.env.KINDS.split(',') : await ev('kinds'); console.log('deathkit: ' + kinds.length + ' kinds; blade ' + await ev('blade')); let bad = 0;
for (const k of kinds) { await ev('clear'); await page.waitForTimeout(300); await ev('spawn', k); let r = null; const t1 = Date.now();
  while (Date.now() - t1 < 90000) { await page.waitForTimeout(500); r = await ev('ready'); if (r === true || (typeof r === 'string' && r.startsWith('ERR'))) break; }
  if (r !== true) { console.log('SKIP ' + k.padEnd(14) + ' ' + (r || 'did not spawn')); continue; }
  await ev('place'); await page.waitForTimeout(400); const frames = []; let s = null, n = 0, maxCuts = 0;
  for (; n < 60; n++) { s = await ev('hit'); maxCuts = Math.max(maxCuts, s.cuts || 0); if (SHEET && PICK.includes(k) && frames.length < 4) { await page.waitForTimeout(140); const f = path.join(OUT, `_${k}_${frames.length}.png`); await page.screenshot({ path: f }); frames.push(f); } else await page.waitForTimeout(60); if (s.boomed) break; }
  if (SHEET && PICK.includes(k)) { await page.waitForTimeout(200); const f = path.join(OUT, `_${k}_${frames.length}.png`); await page.screenshot({ path: f }); frames.push(f); rows.push(frames); }
  const ok = s && s.boomed && maxCuts >= 1; if (!ok) bad++;
  console.log((ok ? 'ok   ' : 'BAD  ') + k.padEnd(14) + ' blows ' + String(n + 1).padStart(2) + '  limbs cut ' + maxCuts + '  ' + (s && s.boomed ? 'BURST' : 'no burst (hp ' + (s && s.hp) + ', ' + (s && s.st) + ')')); }
console.log(JSON.stringify(await ev('stat')));
if (SHEET && rows.length) { const out = path.join(OUT, 'sheet.png'); execFileSync('python3', ['-I', '-c', `import sys, json\nfrom PIL import Image\nrows=json.loads(sys.argv[2])\nims=[[Image.open(f) for f in r] for r in rows]\nw,h=ims[0][0].size\nn=max(len(r) for r in ims)\no=Image.new('RGB',(w*n,h*len(ims)),(255,255,255))\nfor j,r in enumerate(ims):\n  for i,im in enumerate(r): o.paste(im,(i*w,j*h))\no.save(sys.argv[1])`, out, JSON.stringify(rows)]); for (const r of rows) for (const f of r) fs.unlinkSync(f); console.log('sheet ' + out); }
await browser.close(); server.close(); process.exit(bad ? 1 : 0);
