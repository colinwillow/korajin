// npm run ikstrip --id=<row id> [--at=...] [--cam=[ex,ey,ez,tx,ty,tz]] -- A FRAME STRIP of an INTERACTIONS KIT piece (INTERACT.md), on Grumbo.
// (Grown from gathstrip.) Boots the SHIPPED index.html in
// `?w=forge&zone=interact&entry=0&hero=agoblin`, lets it settle, fires the moment (`mel.gathGo`, or `--go=` another mel function), waits on the zone's OWN
// clock (`mel.GATHER.on.t` since the tap, so a slow software frame cannot smear the beats) and renders each frame from the game's own play camera through the night
// overlay; `--wide=1` adds a fixed wide tile per beat. One JPEG strip (SHOT_DIR or ./shots/gather_strip.jpg); draws and tris on every tile.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = process.env.SHOT_DIR || path.join(ROOT, 'shots');
const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const ats = arg('at', '0.8,2,2.6,3.1,3.8,4.8,5.6,7,8.2').split(',').map(Number), wide = +arg('wide', '1'), go = arg('id', 'chest_dais'), W = +arg('w', 480), H = +arg('h', 300);
const extra = arg('q', ''), settle = +arg('settle', 6), pre = arg('pre', '');
fs.mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('  pageerror', e.message));
page.on('console', m => { const t = m.text(); if (/IKIT|IKPOSE|GETPOSE|THREW/.test(t)) console.log('  console', t); });
await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=interact&entry=0${arg('hero', 'agoblin') === 'none' ? '' : '&hero=' + arg('hero', 'agoblin')}${extra ? '&' + extra : ''}`, { timeout: 120000 });
await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel && mel.IKIT && mel.IKIT.on && mel.IKIT.rows.length, null, { timeout: 240000, polling: 1000 });
await page.waitForTimeout(settle * 1000);
if (pre) await page.evaluate(pre);
const tiles = [];
const shoot = async (lab, wideCam) => page.evaluate(([lab, wideCam]) => { const { renderer, scene, camera } = window.__shot, Z = mel.IKIT, R = Z.run;
  let saved = null; if (wideCam) { saved = [camera.position.clone(), camera.quaternion.clone()]; let c = wideCam;
    if (c === 'side') { const P = mel.player.pos, h = mel.player.faceH, lx = Math.cos(h), lz = -Math.sin(h), fx = Math.sin(h), fz = Math.cos(h); c = [P.x + lx * 2.6 + fx * .35, P.y + 1.0, P.z + lz * 2.6 + fz * .35, P.x + fx * .35, P.y + .75, P.z + fz * .35]; }     /* --cam=side: a SIDE PROFILE off his left */ camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]); camera.updateMatrixWorld(true); }
  mel.nightPre(); renderer.render(scene, camera); const url = renderer.domElement.toDataURL('image/jpeg', .85); const i = renderer.info.render; mel.nightPost();
  if (saved) { camera.position.copy(saved[0]); camera.quaternion.copy(saved[1]); camera.updateMatrixWorld(true); }
  const Pp = Z.pose, hb = mel.rig && mel.rig.bones && mel.rig.bones.mixamorig_LeftHand, hd = hb && Pp.L ? hb.getWorldPosition(Pp.L.clone()).distanceTo(Pp.L).toFixed(2) : '-';
  return { url, lab: lab + ' · ' + (R ? R.st + '/' + (R.b || '-') : 'idle') + ' w' + (Pp.w || 0).toFixed(2) + ' ln' + ((Pp.lean || 0) + (Pp.auto || 0)).toFixed(0) + ' hd' + hd + (window.__lab ? ' ' + window.__lab() : '') + ' · ' + i.calls + ' DC ' + Math.round(i.triangles / 1000) + 'k' }; }, [lab, wideCam]);
const wideCam = arg('cam', '') === 'side' ? 'side' : JSON.parse(arg('cam', '[-6.2,2.6,-3.6,-9,1.1,-7.4]'));
for (const [k, c] of JSON.parse(arg('cams', '[]')).entries()) tiles.push(await shoot('still ' + k, c));     /* --cams=[[cam],...]: still lifes before the tap (the look passes) */
tiles.push(await shoot('before', null)); if (wide) tiles.push(await shoot('before wide', wideCam));
await page.evaluate(id => { mel.IKIT.t0 = mel.IKIT.on.t; if (id !== 'none') mel.ikitGo(mel.IKIT.rows.find(r => r.id === id)); }, go);     /* --id=none: no tap (a plate, a pot: --pre does the deed) */
for (const t of ats) {
  try { await page.waitForFunction(t => mel.IKIT.on.t - mel.IKIT.t0 >= t, t, { timeout: 120000, polling: 16 }); } catch (e) { console.log('timeout at', t); }
  tiles.push(await shoot('t ' + t, null)); if (wide) tiles.push(await shoot('t ' + t + ' wide', wideCam));
}
const pose = await page.evaluate(() => JSON.stringify({ getpose: mel.GETPOSE.ok, run: !!mel.IKIT.run, p: mel.player.pos.toArray().map(v => +v.toFixed(2)), open: mel.IKIT.rows.map(r => r.id + ':' + (r.open || r.done || 0)) }));
console.log('pose', pose); if (arg('post', '')) console.log('post', await page.evaluate(arg('post', '')));
const cols = wide ? 2 : 3, sheet = await browser.newPage({ viewport: { width: W * cols, height: H } });
await sheet.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${W}px)">` + tiles.map(x => `<div style="position:relative;width:${W}px;height:${H}px"><img src="${x.url}" style="width:${W}px;height:${H}px;display:block"><b style="position:absolute;left:6px;top:4px;font:700 12px sans-serif;color:#fff;text-shadow:0 0 3px #000">${x.lab}</b></div>`).join('') + '</body>');
const f = path.join(OUT, arg('out', 'ik_strip') + '.jpg'); await sheet.screenshot({ path: f, type: 'jpeg', quality: 82, fullPage: true }); console.log('strip ->', f);
await browser.close(); server.close();
