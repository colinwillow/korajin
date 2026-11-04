// npm run smartcam [zone ...] -- THE SMART CAMERA's proof (m-smart, `SCAM`). Boots the SHIPPED index.html in each zone (entry off), stands him
// at sampled spots round the spawn at sampled lens bearings, steps the SHIPPED `stepCam` + `scamStep` to rest, and measures how much of his
// SILHOUETTE reaches the screen: his meshes drawn flat magenta over the real frame (depth tested), over the same meshes drawn alone.
// A sample whose view is BLOCKED with SMART CAM OFF (visible < `--blocked`, default .5) is re-run with it ON and must reach `--pass` (.5).
// Exits 1 on a blocked sample that stays blocked. `--n=` samples per zone (default 40), `--seed=`.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera, stepCam, cam, player, rig, groundAt, THREE }; window.melee = window.mel = {');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const zones = process.argv.slice(2).filter(a => !a.startsWith('--')); if (!zones.length) zones.push('boulders', 'garden', 'ftemple', 'temple', 'snow');
const N = +arg('n', 40), BLK = +arg('blocked', .5), PASS = +arg('pass', .5), SEED = +arg('seed', 7), RAD = +arg('r', 14), SHOT = arg('shots', '');
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let bad = 0;
for (const z of zones) {
  const page = await browser.newPage({ viewport: { width: 480, height: 270 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('  pageerror', e.message));
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html?w=forge&zone=${z}&entry=0`, { timeout: 240000, waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel, null, { timeout: 240000, polling: 1000 });
    await page.evaluate(() => { try { if (mel.REEL.on) mel.reelSkip(); } catch (e) {} });
    await page.waitForTimeout(+arg('settle', 8) * 1000);
    await page.evaluate(() => { try { if (mel.REEL.on) mel.reelSkip(); } catch (e) {} });
    const res = await page.evaluate(([N, BLK, SEED, RAD, SHOT]) => {
      const { renderer: R, scene, camera, stepCam, cam, player: p, rig, groundAt, THREE } = window.__shot, S = mel.SCAM, gl = R.getContext();
      let sd = SEED; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      const meshes = []; rig.root.traverse(o => { if (o.isMesh) { meshes.push(o); o.layers.enable(7); } });
      const flat = new THREE.MeshBasicMaterial({ color: 0xff00ff, toneMapped: false, fog: false }), sv = meshes.map(o => o.material);
      const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, px = new Uint8Array(W * H * 4);
      const count = () => { gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px); let n = 0; for (let i = 0; i < px.length; i += 4) if (px[i] > 200 && px[i + 1] < 70 && px[i + 2] > 200) n++; return n; };
      const vis = (keep) => { camera.updateMatrixWorld(); meshes.forEach(o => o.material = flat); R.render(scene, camera); const a = count(); let img = null; if (keep) img = R.domElement.toDataURL('image/jpeg', .8);
        const L = camera.layers.mask; camera.layers.set(7); R.render(scene, camera); const b = count(); camera.layers.mask = L; meshes.forEach((o, i) => o.material = sv[i]);
        let img2 = null; if (keep) { R.render(scene, camera); img2 = R.domElement.toDataURL('image/jpeg', .8); } return { f: b ? a / b : 1, tot: b, img: img2 }; };
      const settle = (on) => { S.on = on; S.lift = S.liftW = 0; S.cap = S.capW = 1e9; S.k = 0; S.clearT = 0; S.hits.fill(0); S.big.fill(0); cam.dist = 0; cam.pos.set(0, 0, 0);
        for (let i = 0; i < 70; i++) { stepCam(1 / 30); mel.scamStep(1 / 30); } };
      const x0 = p.pos.x, y0 = p.pos.y, z0 = p.pos.z, out = [], why = { ground: 0, tiny: 0 };
      for (let k = 0; k < N; k++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * RAD, x = x0 + Math.sin(a) * r, zz = z0 + Math.cos(a) * r, gy = groundAt(x, zz, y0 + 12, 30);
        if (!(gy > -1e8) || Math.abs(gy - y0) > 14) { why.ground++; continue; }
        p.pos.set(x, gy, zz); p.vel.set(0, 0, 0); rig.root.position.set(x, gy, zz); rig.root.updateMatrixWorld(true);
        const az = rnd() * Math.PI * 2; cam.az = az; settle(0); const off = vis(false);
        if (off.tot < 30) { why.tiny++; continue; }
        const row = { k, x: +x.toFixed(1), y: +gy.toFixed(1), z: +zz.toFixed(1), az: +az.toFixed(2), off: +off.f.toFixed(2) };
        if (off.f < BLK) { const offImg = SHOT ? vis(true).img : null; cam.az = az; settle(1); const on = vis(!!SHOT); row.on = +on.f.toFixed(2); row.lift = +S.lift.toFixed(2); row.cap = S.cap > 1e8 ? '-' : +S.cap.toFixed(1); row.d = +S.k.toFixed(2);
          if (SHOT) { row.imgOff = offImg; row.imgOn = on.img; } S.on = 1; }
        out.push(row); }
      p.pos.set(x0, y0, z0); S.on = 1;
      return { rows: out, why, at: [x0, y0, z0].map(v => +v.toFixed(1)), stat: Object.assign({}, S.stat, { ms: +S.stat.ms.toFixed(2) }) }; }, [N, BLK, SEED, RAD, SHOT]);
    const blocked = res.rows.filter(r => r.on != null), fail = blocked.filter(r => r.on < PASS);
    console.log(`== ${z}: ${res.rows.length} samples, ${blocked.length} blocked with SMART OFF, ${fail.length} still blocked with it ON | spawn ${res.at} skipped ${JSON.stringify(res.why)} | ${JSON.stringify(res.stat)}`);
    for (const r of blocked) { console.log(`   ${r.on >= PASS ? 'ok ' : 'BAD'} #${r.k} at ${r.x},${r.y},${r.z} az ${r.az}: visible ${r.off} -> ${r.on}  (lift ${r.lift} rad, boom cap ${r.cap}, dither ${r.d})`);
      if (SHOT && r.imgOff) { fs.mkdirSync(SHOT, { recursive: true }); for (const [t, u] of [['off', r.imgOff], ['on', r.imgOn]]) fs.writeFileSync(path.join(SHOT, `${z}_${r.k}_${t}.jpg`), Buffer.from(u.split(',')[1], 'base64')); } }
    if (fail.length) bad = 1;
  } catch (e) { console.log(z, 'FAILED', e.message.split('\n')[0]); bad = 1; }
  await page.close();
}
await browser.close(); server.close(); process.exit(bad);
