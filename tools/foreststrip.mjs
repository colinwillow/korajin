// npm run foreststrip [shot ...] [--night=0|1] [--w=480] [--h=300] -- A CONTACT SHEET of the Forest Temple's REGION (FOREST_REGION.md).
// Boots the SHIPPED index.html headless (SwiftShader) at ?w=forge&zone=dometemple&entry=0, waits for the zone and its mesh collider, then
// renders every camera in FREG.shots (the rows between SC_FREG markers; eye / target heights are OVER THE GROUND there, frgH). One PNG:
// a tile per shot with its id and why, the draw calls and tris of each; plus where he was stood and the ground under him.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const req = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
if (!pw) { console.error('no playwright'); process.exit(1); }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const want = process.argv.slice(2).filter(x => !x.startsWith('--')), W = +arg('w', 480), H = +arg('h', 300), night = arg('night', '0');
const OUT = arg('out', path.join(ROOT, 'shots')); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f.endsWith('index.html')) { const s = body.toString(), k = 'window.melee = window.mel = {'; body = s.replace(k, 'window.__shot = { renderer, scene, camera }; ' + k); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(go => srv.listen(0, go)); const port = srv.address().port, t0 = Date.now();
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const pg = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); pg.on('pageerror', e => console.log('  pageerror', e.message));
let code = 0;
try {
  await pg.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=dometemple&entry=0&night=${night}`, { timeout: 120000 });
  await pg.waitForFunction(() => window.__shot && window.mel && mel.DOMET && mel.DOMET.on && mel.COLL && mel.COLL.built === 1, null, { timeout: 240000, polling: 1000 });
  await pg.waitForTimeout(6000);     // textures
  const res = await pg.evaluate(async ([want, W, H]) => { const { renderer, scene, camera } = window.__shot, F = mel.FREG, h = mel.frgH;
    const list = want.length ? F.shots.filter(s => want.includes(s.id)) : F.shots, cols = Math.min(3, list.length), rows = Math.ceil(list.length / cols);
    const out = document.createElement('canvas'); out.width = cols * W; out.height = rows * (H + 20) + 22; const c2 = out.getContext('2d'); c2.fillStyle = '#000'; c2.fillRect(0, 0, out.width, out.height); c2.font = '12px monospace';
    const fov0 = camera.fov, rep = []; renderer.info.autoReset = true;
    list.forEach((s, k) => { const [ex, ey, ez] = s.eye, [tx, ty, tz] = s.to; camera.position.set(ex, h(ex, ez) + ey, ez); camera.lookAt(tx, h(tx, tz) + ty, tz); camera.fov = s.fov || 55; camera.far = 1200; camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
      const fg = scene.fog; if (s.nofog) scene.fog = null; renderer.render(scene, camera); scene.fog = fg; const calls = renderer.info.render.calls, tris = renderer.info.render.triangles; rep.push({ id: s.id, calls, tris });
      const x = (k % cols) * W, y = 22 + Math.floor(k / cols) * (H + 20); c2.drawImage(renderer.domElement, 0, 0, renderer.domElement.width, renderer.domElement.height, x, y + 20, W, H);
      c2.fillStyle = '#9ff'; c2.fillText(s.id + ' -- ' + s.why + '  [' + calls + ' calls ' + (tris / 1000).toFixed(0) + 'k]', x + 4, y + 14); });
    camera.fov = fov0; camera.updateProjectionMatrix(); const p = mel.player.pos;
    c2.fillStyle = '#fff'; c2.fillText('FOREST REGION  him at ' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ',' + p.z.toFixed(1) + ' (ground ' + h(p.x, p.z).toFixed(1) + ')  COLL tris ' + mel.COLL.stat.tris + ' floors ' + mel.COLL.stat.floors + ' walls ' + mel.COLL.stat.walls + ' ' + mel.COLL.stat.ms + ' ms  terrain ' + JSON.stringify(mel.DOMET.terrain), 6, 15);
    return { png: out.toDataURL('image/png'), rep, him: [p.x, p.y, p.z], g: h(p.x, p.z), coll: mel.COLL.stat, terrain: mel.DOMET.terrain, parts: F.parts }; }, [want, W, H]);
  const file = path.join(OUT, 'forest_' + (want.join('_') || 'all') + (night === '1' ? '_night' : '') + '.png'); fs.writeFileSync(file, Buffer.from(res.png.split(',')[1], 'base64'));
  console.log(file, ((Date.now() - t0) / 1000).toFixed(0) + 's'); for (const r of res.rep) console.log('  ', r.id.padEnd(11), r.calls, 'calls', (r.tris / 1000).toFixed(0) + 'k tris');
  console.log('  him', res.him.map(v => v.toFixed(1)).join(','), 'ground', res.g.toFixed(2), 'coll', JSON.stringify(res.coll), 'terrain', JSON.stringify(res.terrain)); console.log('  parts', JSON.stringify(res.parts));
} catch (e) { console.log('FAIL', e.message.split('\n')[0]); code = 1; }
await br.close(); srv.close(); process.exit(code);
