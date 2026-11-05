// npm run zonebudget [zone ...] -- what a zone COSTS on screen: boots the shipped page headless in each zone (`?w=forge&zone=<z>`), lets it
// settle, then renders the game's own camera and reads `renderer.info` (draw calls and triangles, the shadow pass included). Also counts the
// scene's meshes and triangles in total (what would be drawn with no culling at all). For the forest temple's outside <-> inside decision.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__zb = { renderer, scene, camera, player }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => srv.listen(0, ok));
const zones = process.argv.slice(2).filter(x => !x.startsWith('--')); const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const z of zones.length ? zones : ['dometemple', 'ftemple']) { const pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html?w=forge&zone=${z}`, { timeout: 120000 });
  await pg.waitForFunction(() => window.__zb && document.getElementById('boot').classList.contains('gone'), null, { timeout: 240000, polling: 1000 }); await pg.waitForTimeout(9000);
  const r = await pg.evaluate(() => { const { renderer, scene, camera, player } = window.__zb; renderer.info.autoReset = false; renderer.info.reset(); renderer.render(scene, camera); const i = renderer.info.render;
    let meshes = 0, tris = 0; scene.traverse(o => { if ((o.isMesh || o.isPoints) && o.visible) { meshes++; const g = o.geometry; if (g) { const n = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0); tris += n * (o.count || 1); } } });
    return { calls: i.calls, tris: Math.round(i.triangles), meshes, sceneTris: Math.round(tris), at: [player.pos.x, player.pos.y, player.pos.z].map(v => +v.toFixed(1)) }; });
  console.log(z.padEnd(12), `on screen: ${r.calls} draws, ${r.tris} tris (incl. shadows)   in the scene: ${r.meshes} meshes, ${r.sceneTris} tris   he is at ${r.at}`); await pg.close(); }
await br.close(); srv.close();
