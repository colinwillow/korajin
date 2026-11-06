// npm run glowshot [--out=images/renders/glowkit] [--zone=glowkit] -- CLOSE + WIDE renders of the GLOW KIT (GLOWKIT.md). Boots the SHIPPED
// index.html headless in the Glow Garden (`?w=forge&zone=glowkit&entry=0`), waits for the room, then renders each view in `VIEWS` (eye, look-at)
// to its own JPEG plus one contact sheet. The only thing added to the served text is `window.__shot` (shot.mjs's splice).
// `--zone=foresttemple --views=ft` renders the forest temple's dressed rooms instead (the `FT` list).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d; };
const OUT = path.resolve(ROOT, arg('out', 'images/renders/glowkit')), ZONE = arg('zone', 'glowkit'), W = +arg('w', 720), H = +arg('h', 720), only = arg('only', '');
const VIEWS = {
  gg: [
    ['wide_south', [0, 6.5, 15], [0, 2.5, -6]],
    ['wide_high', [10, 11, 12], [-3, 1.5, -5]],
    ['shard_front', [0, 2.6, 2.1], [0, 2.2, -1]],
    ['shard_34', [2.1, 3.1, .9], [0, 2.25, -1]],
    ['shard_low', [-1.6, 1.4, 1.2], [0, 2.3, -1]],
    ['prisms', [-7, 3.2, 1], [-12.5, 1.6, -.5]],
    ['prism_close', [-10.6, 1.6, 6.6], [-12.5, 1.2, 5]],
    ['geode_wall', [-12.5, 2.4, 9], [-15.9, 1.6, 8.5]],
    ['geode_corner', [-12.2, 3.2, -8.2], [-15.6, 2.6, -11.6]],
    ['stal', [-8, 4.2, -3], [-10, 6.4, -9]],
    ['drape', [-8, 4.2, -1.5], [-9, 5.6, -6.2]],
    ['shrooms', [9.8, 1.0, 8.4], [11, .3, 6]],
    ['shroom_tall', [6, 1.2, 3.2], [8, .6, 1]],
    ['shelf', [13, 1.8, 4], [15.9, 1.6, 2.5]],
    ['vignette', [7, 4.5, -1], [13.5, 3.5, -10]],
    ['vignette_close', [11, 3.9, -5.6], [14, 3.6, -10]],
  ],
  ft: [
    ['ft_sockets', [4, 3.4, 27], [0, 1.4, 37]],
    ['ft_sock_close', [1.0, 2.1, 27.6], [0, 1.65, 29.5]],
    ['ft_sock_lit', [4.4, 2.3, 30.0], [5.63, 1.75, 32.75]],
    ['ft_sock_lit2', [3.6, 2.4, 41.6], [5.63, 1.75, 39.25]],
    ['ft_hub_wall', [0, 6, 38], [-3.75, 6.5, 45.3]],
    ['ft_hub_floor', [2, 2.4, 40], [-5.5, .5, 43.5]],
    ['ftA_ne', [9, 3, -12], [15.5, 1.5, -20.5]],
    ['ftA_hi', [-5, 18, -2], [-16, 21.5, -6]],
    ['ftB_far', { f: 'FTB', p: [-2, 3, 18] }, { f: 'FTB', p: [-8, 1.5, 25.5] }],
    ['ftB_stal', { f: 'FTB', p: [0, 4, 16] }, { f: 'FTB', p: [-5, 8, 23.5] }],
    ['ftC_far', { f: 'FTB', p: [-2, -15, 27] }, { f: 'FTB', p: [-8.5, -16, 35.5] }],
    ['ftD_far', { f: 'FTD', p: [-1.5, 15, 12] }, { f: 'FTD', p: [-7, 14, 20] }],
    ['ftF_corner', { f: 'FTF', p: [2, -10.5, 26] }, { f: 'FTF', p: [-12.5, -11.5, 26] }],
    ['ftF_up', { f: 'FTF', p: [0, -9, 26] }, { f: 'FTF', p: [-9, 15, 23] }],
    ['ftE_pit', { f: 'FTE', p: [0, -11, 16] }, { f: 'FTE', p: [-10.5, -13.5, 23] }],
    ['ftE_far', { f: 'FTE', p: [-2, -11, 45] }, { f: 'FTE', p: [-9.5, -13, 54.5] }],
    ['ft_hub_seal', [0, 6, 30], [0, 0, 37]],
    ['ftX_wall', [3.2, -17.5, 41.5], [7.3, -18.5, 48.6]],
    ['ftX_wall2', [-10.2, -16.8, 30.4], [-13, -17, 28.5]],
    ['ftX_hollow', [-8, -22, 26], [2, -15, 37]],
    ['ftX_wide', [9, -18.5, 26], [-6, -20, 44]],
  ],
};
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera, gk: () => ({ GLOWG, GLOWKIT, player, FTEMPLE, ftinSockets }) }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
pg.on('console', m => { const t = m.text(); if (/GLOW|THREW|error/i.test(t)) console.log('  console', t.slice(0, +(process.env.GKLOG || 200))); });
await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=${ZONE}&entry=0`, { timeout: 120000 });
await pg.waitForFunction(() => window.__shot && window.mel && document.getElementById('boot').classList.contains('gone') && window.__shot.gk().GLOWKIT.rooms.length, null, { timeout: 240000, polling: 1000 });
await pg.waitForTimeout(5000);
const info = await pg.evaluate(() => { const { GLOWKIT } = window.__shot.gk(); return GLOWKIT.rooms.map(B => ({ id: B.R.id, draws: B.meshes.length, tris: B.meshes.reduce((a, m) => a + (m.isPoints ? 0 : m.geometry.attributes.position.count / 3), 0), motes: B.mot ? B.mot.geometry.attributes.position.count : 0, hits: B.hits.length, hp: B.hits.map(h => h.id + '@' + [h.x, h.y, h.z].map(v => v.toFixed(1)).join(',')), vis: B.g.visible })); });
console.log('rooms', JSON.stringify(info));
await pg.evaluate(([z, wake]) => { const G = window.__shot.gk(), P = G.player; P.pos.set(0, 0, z); P.vel.set(0, 0, 0); if (wake && G.FTEMPLE.prog) { G.FTEMPLE.prog.shards = wake.split(''); G.ftinSockets(); } }, [+arg('hide', 26), arg('wake', '')]); await pg.waitForTimeout(1500);     // the hero out of frame (south of the court)
fs.mkdirSync(OUT, { recursive: true }); const sheet = [];
const list = (VIEWS[arg('views', 'gg')] || []).filter(v => !only || only.split(',').includes(v[0]));
for (const [name, eye, at] of list) {
  await pg.evaluate(([eye, at]) => { const G = window.__shot.gk(), P = G.player, FT = G.FTEMPLE, pt = v => Array.isArray(v) ? v : FT.L[v.f].P(...v.p), e = pt(eye), a = pt(at), d = Math.hypot(e[0] - a[0], e[2] - a[2]) || 1;
    P.pos.set(e[0] + (e[0] - a[0]) / d * 4, e[1] - 1.6, e[2] + (e[2] - a[2]) / d * 4); P.vel.set(0, 0, 0); }, [eye, at]); await pg.waitForTimeout(400);     // stand him behind the lens: rooms are culled by his distance
  const url = await pg.evaluate(([eye, at, W, H]) => { const { renderer, scene, camera } = window.__shot, P = window.__shot.gk().player, FT = window.__shot.gk().FTEMPLE;
    const pt = v => Array.isArray(v) ? v : FT.L[v.f].P(...v.p); eye = pt(eye); at = pt(at);
    const c = camera.clone(); c.aspect = W / H; c.fov = 50; c.near = .05; c.updateProjectionMatrix(); c.position.set(...eye); c.lookAt(...at);
    renderer.render(scene, c); window.__tris = renderer.info.render.triangles; window.__calls = renderer.info.render.calls; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const src = renderer.domElement;
    const s = Math.min(src.width / W, src.height / H), sw = W * s, sh = H * s; cv.getContext('2d').drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, 0, 0, W, H); return cv.toDataURL('image/jpeg', .9); }, [eye, at, W, H]);
  const f = path.join(OUT, name + '.jpg'); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); sheet.push({ name, url }); const ri = await pg.evaluate(() => [window.__calls, window.__tris]); console.log(path.relative(ROOT, f), 'draws', ri[0], 'tris', ri[1]); }
if (arg('eval', '')) console.log('eval', JSON.stringify(await pg.evaluate(arg('eval', ''))));
await br.close(); srv.close();
