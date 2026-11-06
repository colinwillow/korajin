// npm run lakeperf -- THE LAKE'S BUDGET FROM THE REAL PLAY CAMERA (LAKE_REGION.md step 0). Boots the shipped page (fake clock, `frameBody()` stepped
// by hand), stands him at each spot, steps 90 frames, renders ONE frame through the game's own camera and reads renderer.info with autoReset off,
// so the SHADOW PASS is counted. Budget: any play view <= 70 draws / 280k tris; aerial <= 85 / 310k. (The dvperf pattern.)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
let pw = null; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('lakeperf: no playwright'); process.exit(2); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const HANDLE = 'window.__wt = { frameBody, player, cam, COLL, groundAt, renderer, rig, MOVE, LAKEZ, camera, scene }; ';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', HANDLE + 'window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok));
const port = server.address().port, t0 = Date.now(), el = () => ((Date.now() - t0) / 1000).toFixed(0) + 's';
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
await page.addInitScript(() => { let a = 7; Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { localStorage.setItem('mel.game', 'korajin'); localStorage.setItem('mel.coll', 'mesh'); } catch (e) {} });
const errs = []; page.on('pageerror', e => errs.push(e.message.split('\n')[0]));
function measure() {
  const S = window.__wt, p = S.player, clk = window.__clock, Z = S.LAKEZ, L = Z.L, B = L.boat, R = S.renderer, real = window.__real, out = [];
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  const spots = [['deck', null], ['beach_w', [L.cx(40) - 104, 40, Math.PI / 2]], ['reach', [L.cx(-112) - 10, -100, Math.PI]], ['south', [L.cx(150) + 60, 150, 0]], ['aerial', null, 1]];
  for (const [id, at, aer] of spots) {
    if (at) { const y = L.groundAt(at[0], at[1]); p.pos.set(at[0], Math.max(y, 0) + .3, at[1]); p.faceH = p.heading = S.cam.az = at[2]; p.vel.set(0, 0, 0); }
    for (let i = 0; i < 90; i++) frame();
    const sc = window.__sc, cam = window.__cam; if (aer) { cam.position.set(B.x + 60, 70, B.z + 90); cam.lookAt(B.x, 0, B.z - 60); cam.updateMatrixWorld(true); }
    let tally = null; if (window.__brk && id === (window.__brkAt || 'deck')) { tally = new Map(); const rb = R.renderBufferDirect; R.__rb = rb; R.renderBufferDirect = function (c, sc2, g2, m2, o2, gr) { const n = g2.index ? (gr ? gr.count : g2.index.count) / 3 : g2.attributes.position.count / 3, k = o2.isInstancedMesh ? o2.count : 1, sh = c.isOrthographicCamera ? 'SHADOW' : (c === cam ? 'main' : 'other');
      const key = sh + ' ' + (o2.name || (o2.parent && o2.parent.name) || '?') + ' ' + m2.type + (m2.color ? ':' + m2.color.getHexString() : ''); const t = tally.get(key) || [0, 0]; t[0]++; t[1] += n * k; tally.set(key, t); return rb.apply(this, arguments); }; }
    R.info.autoReset = false; R.info.reset(); real(sc, cam); if (tally) { R.renderBufferDirect = R.__rb; out.push({ brk: [...tally].sort((a, b) => b[1][1] - a[1][1]).slice(0, 40).map(([k, v]) => [k, v[0], Math.round(v[1])]) }); }
    out.push({ id, calls: R.info.render.calls, tris: R.info.render.triangles, sh: R.shadowMap.enabled ? 1 : 0, at: [p.pos.x, p.pos.y, p.pos.z].map(v => +v.toFixed(1)) }); R.info.autoReset = true; }
  if (window.__brk) { const rows = []; window.__sc.traverse(o => { if (!o.isMesh && !o.isPoints) return; let v = o.visible, q = o.parent; while (v && q) { v = q.visible; q = q.parent; } if (!v) return; const g = o.geometry, n = g.index ? g.index.count / 3 : g.attributes.position.count / 3, k = o.isInstancedMesh ? o.count : 1;
    rows.push([(o.name || o.parent && o.parent.name || '?') + (o.isInstancedMesh ? '[inst ' + o.count + ']' : '') + ' ' + o.material.type + (o.material.color ? ':' + o.material.color.getHexString() : '') + (o.material.vertexColors ? ':vc' : '') + (o.material.map ? ':map' : '') + ' L' + o.layers.mask, Math.round(n * k), o.castShadow ? 'S' : '-', o.layers.isEnabled(3) ? 'M' : '-']); }); rows.sort((a, b) => b[1] - a[1]); out.push({ brk: rows.slice(0, 30) }); }
  return out; }
let code = 0;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=lake&entry=0`, { timeout: 120000 });
  await page.waitForFunction(() => window.__wt && document.getElementById('boot').classList.contains('gone') && window.__wt.rig.ready && window.__wt.LAKEZ.on, null, { timeout: 240000, polling: 1000 });
  await page.evaluate(() => { const S = window.__wt; window.__clock = { t: performance.now(), dt: 1000 / 60 }; performance.now = () => window.__clock.t;
    window.__real = S.renderer.render.bind(S.renderer); S.renderer.render = (sc, c) => { if (sc && sc.isScene && (!window.__sc || sc === window.__sc || sc.children.length >= window.__sc.children.length)) { window.__sc = sc; window.__cam = c; } }; });
  if (process.argv.includes('--brk')) await page.evaluate(() => { window.__brk = 1; });
  const res = await page.evaluate(src => (0, eval)('(' + src + ')')(), measure.toString());
  console.log('== lakeperf (the real play camera after 90 stepped frames; the shadow pass included)');
  for (const r of res) if (r.brk) console.log(r.brk.map(x => x.join(' ')).join('\n')); else console.log(r.id.padEnd(9) + ' ' + String(r.calls).padStart(3) + ' draws  ' + (r.tris / 1000).toFixed(0).padStart(4) + 'k tris  shadows ' + (r.sh ? 'on' : 'off') + '  at ' + r.at.join(','));
} catch (e) { console.log('FAIL', el(), e.message.split('\n')[0]); code = 1; }
if (errs.length) console.log('page errors:', [...new Set(errs)].slice(0, 6).join(' || '));
await browser.close(); server.close(); process.exit(code);
