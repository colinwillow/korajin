// npm run snowtris -- the SNOW zone at five fixed spots (spawn, village, temple, falls, pond), day and night: main-pass and shadow-pass
// triangles and draws through a fixed camera 7 m behind him. IDX=<file> serves another index.html (an A/B against an older build).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const pw = createRequire(import.meta.url)('playwright'); const IDX = process.env.IDX || path.join(ROOT, 'index.html');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = u === '/' || u === '/index.html' ? IDX : path.join(ROOT, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f); if (f === IDX) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok));
const b = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const spots = [['spawn', null], ['village', [-7, 30, 0]], ['temple', [40, -60, 0]], ['falls', [-110, -40, 1.6]], ['pond', [30, 20, 3]]];
for (const t of ['day', 'night']) { const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html?w=forge&zone=snow&time=${t}&entry=0`);
  await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot, null, { timeout: 240000, polling: 1000 });
  await page.waitForTimeout(15000);
  for (const [nm, at] of spots) {
    if (at) await page.evaluate(at => { const p = mel.player; p.pos.x = at[0]; p.pos.z = at[1]; p.pos.y = 3; p.vel.set(0, 0, 0); p.heading = p.faceH = at[2]; }, at);
    await page.waitForTimeout(4000);
    const r = await page.evaluate(() => { const { renderer: R, scene, camera } = window.__shot; let m = 0, s = 0, dm = 0, ds = 0, cm = 0, cs = 0; const rbd = R.renderBufferDirect.bind(R);
      R.renderBufferDirect = (cam, scn, geo, mat, obj, grp) => { const ic = geo.index ? geo.index.count : geo.attributes.position ? geo.attributes.position.count : 0; let n = (grp ? grp.count : Math.min(ic, geo.drawRange.count)) / 3; if (obj.isInstancedMesh) n *= obj.count; if (obj.isPoints || obj.isLine) n = 0;
        if (mat.isMeshDepthMaterial || mat.isMeshDistanceMaterial) { s += n; ds++; if (obj.name === 'shadowCell') cs += n; } else { m += n; dm++; if (obj.name === 'shadowCell') cm += n; } return rbd(cam, scn, geo, mat, obj, grp); };
      const P = mel.player.pos, h = mel.player.heading || 0, fx = Math.sin(h), fz = Math.cos(h); camera.position.set(P.x - fx * 7, P.y + 3.2, P.z - fz * 7); camera.lookAt(P.x + fx * 12, P.y + 3.5, P.z + fz * 12); camera.updateMatrixWorld(true); mel.nightPre(); R.render(scene, camera); mel.nightPost(); R.renderBufferDirect = rbd; return { m, s, dm, ds, cm, cs, p: mel.player.pos.toArray().map(v => v.toFixed(0)).join(',') }; });
    console.log(`${t.padEnd(5)} ${nm.padEnd(8)} @${r.p.padEnd(12)} main ${(r.m / 1000).toFixed(0).padStart(5)}k/${r.dm}  shadow ${(r.s / 1000).toFixed(0).padStart(4)}k/${r.ds}  total ${((r.m + r.s) / 1000).toFixed(0)}k, ${r.dm + r.ds} draws` + (r.cm + r.cs ? `  [cells: main ${(r.cm / 1000).toFixed(0)}k shadow ${(r.cs / 1000).toFixed(0)}k]` : '')); }
  await page.close(); }
await b.close(); server.close();
