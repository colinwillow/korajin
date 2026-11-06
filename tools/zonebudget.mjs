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
    const calls0 = i.calls, tris0 = i.triangles; const se = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.info.reset(); renderer.render(scene, camera); const noSh = renderer.info.render.calls, noShT = renderer.info.render.triangles; renderer.shadowMap.enabled = se;
    let casters = 0; const big = []; scene.traverse(o => { if ((o.isMesh) && o.visible && o.castShadow) { casters++; } if ((o.isMesh || o.isPoints) && o.visible) { const g = o.geometry, n = g && g.attributes.position ? (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.count || 1) : 0; big.push([o.name || o.type, Math.round(n), o.castShadow ? 'S' : '']); } });
    big.sort((a, b) => b[1] - a[1]); const grp = {}; scene.traverse(o => { if (!(o.isMesh || o.isPoints || o.isLine || o.isSprite) || !o.visible) return; let q = o, vis = true; while (q) { if (!q.visible) vis = false; q = q.parent; } if (!vis) return; let anc = o.parent, an = ''; while (anc && !an) { an = anc.name || ''; anc = anc.parent; } const k = (o.name || (o.type + ':' + (o.geometry ? o.geometry.type : '') + ':' + (o.material && (o.material.name || o.material.type) || ''))) + ' <' + an.slice(0, 18); grp[k] = (grp[k] || 0) + 1; });
    window.__grp = Object.entries(grp).sort((a, b) => b[1] - a[1]).map(([k, n]) => n + ' ' + k).join(' | ');
    return { calls: calls0, tris: Math.round(tris0), noShadow: noSh + ' / ' + Math.round(noShT), casters, top: big.slice(0, 14).map(b => b.join(':')).join('  '), grp: window.__grp, meshes, sceneTris: Math.round(tris), at: [player.pos.x, player.pos.y, player.pos.z].map(v => +v.toFixed(1)) }; });
  console.log(z.padEnd(12), `on screen: ${r.calls} draws, ${r.tris} tris (incl. shadows); no shadows ${r.noShadow}; shadow casters ${r.casters}\n   biggest: ${r.top}\n   by name: ${r.grp}\n   in the scene: ${r.meshes} meshes, ${r.sceneTris} tris   he is at ${r.at}`); await pg.close(); }
await br.close(); srv.close();
