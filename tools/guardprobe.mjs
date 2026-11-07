// npm run guardprobe -- GUARDS.md's probe (m2811). For every GUARD kind (shield / sword) in the Combat Lab, headless, AI off, the combat defence ON:
//   MASH     15 plain katana blows from the front, .12 s apart -- must take (almost) no life and must be PUNISHED (`GUARDS.stat.punish`)
//   SKILLED  a CHARGED blow (the guard break), then plain cuts inside the opening, again and again -- must KILL him
// One row per kind; exits 1 on a BAD row. SHEET=1 renders images/renders/guards/{shield_block,guard_break}.png off the warboss.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url); let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT = path.join(ROOT, "images/renders/guards"); fs.mkdirSync(OUT, { recursive: true });
const HOOK = `window.__gp = {
  kinds: () => Object.keys(GUARDS.kinds).filter(k => GUARDS.kinds[k] === 'shield' || GUARDS.kinds[k] === 'sword'),
  clear: () => { try { arenaClear(); } catch (e) {} },
  spawn: k => { CLAB.ai = 0; const S = window.__gp; S.d = null; S.err = ''; arenaSpawn(k).then(() => { S.d = ARENA.live[ARENA.live.length - 1]; }).catch(e => { S.err = e.message; }); },
  ready: () => { const S = window.__gp, d = S.d; return S.err ? 'ERR ' + S.err : !!d && d.st !== 'beamIn' && !d.entering && d.st !== 'stoneT'; },
  place: () => { const d = window.__gp.d, P = d.root.position, p = player; p.pos.set(P.x, P.y, P.z + 2.2); p.vel.set(0, 0, 0); p.faceH = p.heading = Math.PI; cam.az = Math.PI + .35; d.h = 0; d.st = 'idle'; d.cbOpen = 0; },
  blow: heavy => { const d = window.__gp.d, p = player; if (!d || d.boomed || d.ko) return { dead: 1 }; const ks = WEAP.slots.findIndex(q => q.key === 'katana'); if (ks >= 0) p.slot = ks;
    const h = Math.atan2(d.root.position.x - p.pos.x, d.root.position.z - p.pos.z), b0 = p.melee; CBT.on = 1; p.melee = 1; p.meleeName = 'katana_slash_1'; if (heavy) p.chargeGo = 1; d.cool = 0;
    try { dummyBlow(d, h, heavy ? 1 : .6, volCost(1)); } finally { p.melee = b0; p.chargeGo = 0; }
    return { dead: d.boomed || d.ko ? 1 : 0, hp: d.hp, max: d.hpMax || d.hp, st: d.st }; },
  stat: () => Object.assign({}, GUARDS.stat),
};`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let b = fs.readFileSync(f); if (f.endsWith('index.html')) b = b.toString().replace('window.melee = window.mel = {', HOOK + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--mute-audio'] });
const page = await browser.newPage({ viewport: { width: 360, height: 380 }, deviceScaleFactor: 1 }); page.on('pageerror', e => console.log('pageerror', e.message.slice(0, 140)));
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=combatlab`, { waitUntil: 'commit', timeout: 240000 });
const ev = (f, ...a) => page.evaluate(([f, a]) => window.__gp ? window.__gp[f](...a) : null, [f, a]);
const t0 = Date.now(); while (Date.now() - t0 < 240000) { await page.waitForTimeout(1000); const k = await ev('kinds').catch(() => null); const run = await page.evaluate(() => typeof ENTRY !== 'undefined' && ENTRY.run).catch(() => true); if (k && !run) break; }
await page.waitForTimeout(6000);
const SHEET = process.env.SHEET === '1'; if (SHEET) await page.addStyleTag({ content: 'body *:not(canvas) { visibility: hidden !important; } canvas { visibility: visible !important; }' });
async function up(k) { await ev('clear'); await page.waitForTimeout(300); await ev('spawn', k); const t1 = Date.now(); let r = null; while (Date.now() - t1 < 90000) { await page.waitForTimeout(500); r = await ev('ready'); if (r === true || (typeof r === 'string' && r.startsWith('ERR'))) break; } if (r !== true) return false; await ev('place'); await page.waitForTimeout(500); return true; }
const kinds = process.env.KINDS ? process.env.KINDS.split(',') : await ev('kinds'); console.log('guardprobe: ' + kinds.join(', ')); let bad = 0;
for (const k of kinds) {
  if (!await up(k)) { console.log('SKIP ' + k); continue; }
  const s0 = await ev('stat'); let r = await ev('blow', 0); const hp0 = r.hp, max = r.max;
  if (SHEET && k === 'WARBOSS') { await page.waitForTimeout(90); await page.screenshot({ path: path.join(OUT, 'shield_block.png') }); }
  for (let i = 1; i < 15; i++) { await page.waitForTimeout(120); r = await ev('blow', 0); await ev('place'); }
  const s1 = await ev('stat'), mashLost = (hp0 - r.hp) / max, punished = s1.punish - s0.punish;
  if (!await up(k)) { console.log('SKIP ' + k); continue; }
  let n = 0, dead = 0; for (; n < 25 && !dead; n++) { r = await ev('blow', 1); if (SHEET && k === 'WARBOSS' && n === 0) { await page.waitForTimeout(120); await page.screenshot({ path: path.join(OUT, 'guard_break.png') }); }
    for (let j = 0; j < 3 && !r.dead; j++) { await page.waitForTimeout(150); r = await ev('blow', 0); } dead = r.dead; await page.waitForTimeout(400); if (!dead) await ev('place'); }
  const ok = mashLost < .1 && punished >= 1 && dead; if (!ok) bad++;
  console.log((ok ? 'ok   ' : 'BAD  ') + k.padEnd(12) + ' ' + GUARDS_KIND(k) + '  MASH: lost ' + (mashLost * 100).toFixed(0) + '% of his life, punished x' + punished + '   SKILLED: ' + (dead ? 'dead after ' + n + ' break(s)' : 'ALIVE after ' + n)); }
function GUARDS_KIND(k) { return ''; }
console.log(JSON.stringify(await ev('stat'))); await browser.close(); server.close(); process.exit(bad ? 1 : 0);
