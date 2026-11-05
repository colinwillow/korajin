// npm run entryhitch [query ...] -- the LOADING STUTTER hunt: boots the shipped page WITH the entrance (portal, flip, land) and logs every frame
// from boot to `SECS` s after the boot card goes: frame ms (JS + draw submit + any shader link the draw waited on), render ms, programs
// linked, textures uploaded (count / MB), and the entrance state. Prints every frame over LIM ms with what it did, and the worst frame
// inside the entrance. Swiftshader paces the GPU itself slowly, so read the LINK / UPLOAD columns and the JS ms, not the fps.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const IDX = process.env.IDX || path.join(ROOT, 'index.html');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = u === '/' || u === '/index.html' ? IDX : path.join(ROOT, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f === IDX) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {')
    .replace('function frame() {\n', 'function frame() { const G = window.__G, t0 = performance.now(); if (G) { G.c = { t: t0, ms: 0, r: 0, link: 0, linkMs: 0, tex: 0, texB: 0, st: "" }; } try { frame__(); } finally { if (G) { G.c.ms = performance.now() - t0; try { const D = mel.player.hdrop; G.c.st = (mel.ENTRY.run ? "E:" + (D ? D.st : "tail") : "") + (document.getElementById("boot").classList.contains("gone") ? "" : " card"); } catch (e) {} G.f.push(G.c); } } }\nfunction frame__() {\n');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const qs = process.argv.slice(2).filter(a => !a.startsWith('--')); if (!qs.length) qs.push('w=forge&zone=snow');
const SECS = +(process.env.SECS || 25), LIM = +(process.env.LIM || 60);
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const q of qs) {
  const page = await browser.newPage({ viewport: { width: 195, height: 422 } });
  page.on('pageerror', e => console.log('  pageerror', e.message));
  await page.addInitScript(() => { window.__G = { f: [], c: null }; const H = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (k, o) { const gl = H.call(this, k, o); if (gl && (k === 'webgl2' || k === 'webgl') && !gl.__w) { gl.__w = 1; const G = window.__G;
      const lp = gl.linkProgram.bind(gl), gp = gl.getProgramParameter.bind(gl); gl.linkProgram = p => { if (G.c) G.c.link++; return lp(p); }; gl.getProgramParameter = (p, n) => { const t = performance.now(), v = gp(p, n); if (G.c) G.c.linkMs += performance.now() - t; return v; };
      for (const n of ['texImage2D', 'texSubImage2D', 'compressedTexImage2D', 'texStorage2D']) { const o = gl[n].bind(gl); gl[n] = (...a) => { if (G.c && n !== 'texStorage2D') { G.c.tex++; const s = a.find(x => x && x.width); G.c.texB += s ? s.width * s.height * 4 : (n === 'texSubImage2D' ? a[4] * a[5] * 4 : a[3] * a[4] * 4) || 0; } return o(...a); }; } }
    return gl; }; });
  const cdp = await page.context().newCDPSession(page); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 1000 }); await cdp.send('Profiler.start');
  try {
    const t0 = Date.now(); await page.goto(`http://127.0.0.1:${port}/index.html?${q}`, { timeout: 120000 });
    await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.mel, null, { timeout: 300000, polling: 500 });
    const tCard = await page.evaluate(() => performance.now()); await page.waitForTimeout(SECS * 1000);
    if (process.env.DIVE) { await page.evaluate(new Function(process.env.DIVE)); await page.waitForTimeout(+(process.env.DIVET || 8) * 1000); if (process.env.PROBE) console.log('   probe:', await page.evaluate(new Function(process.env.PROBE))); }
    const { profile } = await cdp.send('Profiler.stop');
    // the long frames' owners: runs of samples under frame__, each with its game functions (deepest index.html frame per sample)
    const byId = new Map(profile.nodes.map(n => [n.id, n])), par = new Map(); for (const n of profile.nodes) for (const c of n.children || []) par.set(c, n.id);
    const runs = []; let cur = null, last = 0, tt = profile.startTime;
    for (let i = 0; i < profile.samples.length; i++) { tt += profile.timeDeltas[i]; const st = []; for (let x = profile.samples[i]; x != null; x = par.get(x)) st.push(byId.get(x));
      if (!st.some(n => n.callFrame.functionName === 'frame__')) continue; if (!cur || tt - last > 4000) runs.push(cur = { t: tt, n: 0, own: new Map() }); last = tt; cur.n++;
      const gf = st.find(n => /index\.html/.test(n.callFrame.url) && !/^frame/.test(n.callFrame.functionName)), leaf = st[0].callFrame.functionName || '(anon)';
      const k = gf ? gf.callFrame.functionName + ':' + (gf.callFrame.lineNumber + 1) + (gf !== st[0] ? ' > ' + leaf : '') : leaf; cur.own.set(k, (cur.own.get(k) || 0) + 1); }
    const longRuns = runs.filter(r => r.n > LIM).map(r => '   frame ' + r.n + ' ms: ' + [...r.own].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => k + ' ' + v).join(' | '));
    const F = await page.evaluate(() => window.__G.f), after = F.filter(f => f.t > tCard - 2000);
    const ent = after.filter(f => /E:/.test(f.st)), worst = a => a.reduce((m, f) => f.ms > m.ms ? f : m, { ms: 0 });
    const tot = k => after.reduce((s, f) => s + f[k], 0);
    console.log(`\n== ${q}: ${after.length} frames after the card | links ${tot('link')} (${tot('linkMs').toFixed(0)} ms waiting), uploads ${tot('tex')} (${(tot('texB') / 1048576).toFixed(0)} MB) | entrance ${ent.length} frames, worst ${worst(ent).ms.toFixed(0)} ms (${worst(ent).st}) | worst overall ${worst(after).ms.toFixed(0)} ms`);
    for (const f of after) if (f.ms > LIM || f.link > 2) console.log(`   t+${((f.t - tCard) / 1000).toFixed(2).padStart(6)}s ${f.ms.toFixed(0).padStart(5)} ms  link ${String(f.link).padStart(3)} (${f.linkMs.toFixed(0)} ms)  tex ${String(f.tex).padStart(3)} ${(f.texB / 1048576).toFixed(1)} MB  ${f.st}`);
    if (process.env.PROF !== '0') { console.log('   -- the long frames, by owner (ms sampled):'); for (const l of longRuns) console.log(l); }
  } catch (e) { console.log(`${q}: FAILED ${e.message.split('\n')[0]}`); }
  await page.close();
}
await browser.close(); server.close();
