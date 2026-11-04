// npm run hitch [query ...] -- the PERIODIC HITCH hunt (m-hitch): boots the SHIPPED index.html at each query (e.g. 'w=forge&zone=snow&time=night'),
// lets it settle, then records SECS of frames with the CDP sampling profiler running. Per frame it times the game's own JS (frame() minus
// renderer.render, which is swiftshader here and not the phone's cost) and lists every frame whose JS took > LIM ms, with the functions that
// owned its samples and the spacing between spikes (a hitch "every second or so" shows up as a period).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const req = createRequire(import.meta.url); let pw;
for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ktx2': 'image/ktx2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.hdr': 'application/octet-stream' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.join(ROOT, u === '/' ? 'index.html' : u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (f.endsWith('index.html')) body = body.toString().replace('window.melee = window.mel = {', 'window.__shot = { renderer, scene, camera }; window.melee = window.mel = {')
    .replace('function frame() {\n', 'function frame() { const __t0 = performance.now(); window.__rt = 0; try { frame__(); } finally { const t1 = performance.now(); (window.__ft ||= []).push([__t0, t1 - __t0 - window.__rt, window.__rt, performance.memory ? performance.memory.usedJSHeapSize : 0]); } }\nfunction frame__() {\n');
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(body); });
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const qs = process.argv.slice(2).filter(a => !a.startsWith('--')); if (!qs.length) qs.push('w=forge&zone=snow');
const SECS = +(process.env.SECS || 20), LIM = +(process.env.LIM || 25), SETTLE = +(process.env.SETTLE || 6);
const browser = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-precise-memory-info'] });
for (const q of qs) {
  const page = await browser.newPage({ viewport: { width: 480, height: 270 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.log('  pageerror', e.message));
  // headless swiftshader paces rAF off its GPU process (~1-2 fps here); once __nr is set, a 16 ms timer drives the loop at a phone's cadence instead
  if (process.env.NORENDER) await page.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = f => window.__nr ? setTimeout(() => f(performance.now()), 16) : raf(f); });
  try {
    await page.goto(`http://127.0.0.1:${port}/index.html?${q}${/entry=/.test(q) ? '' : '&entry=0'}`, { timeout: 120000 });
    await page.waitForFunction(() => document.getElementById('boot').classList.contains('gone') && window.__shot && window.mel, null, { timeout: 240000, polling: 1000 });
    await page.evaluate(() => { const R = window.__shot.renderer, r0 = R.render.bind(R); window.__nr = 0; R.render = (s, c) => { const t = performance.now(); try { if (!window.__nr) r0(s, c); } finally { window.__rt = (window.__rt || 0) + performance.now() - t; } }; });
    await page.waitForTimeout(SETTLE * 1000);
    if (process.env.NORENDER) await page.evaluate(() => { window.__nr = 1; });     // swiftshader caps this at ~1 fps in the GPU process; skip the draw so the game's own JS runs at a phone's cadence
    if (process.env.TICK) console.log('   timer ticks in 2 s:', await page.evaluate(() => new Promise(ok => { let n = 0; const t0 = performance.now(), d = []; let l = t0; const f = () => { const t = performance.now(); d.push(t - l); l = t; n++; if (t - t0 < 2000) setTimeout(f, 0); else ok(n + ' max gap ' + Math.max(...d).toFixed(0)); }; f(); })));
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
    await page.evaluate(() => { window.__ft = []; });
    if (process.env.ALLOC) {     // where the garbage comes from: the sampling heap profiler, allocations INCLUDING the ones already collected
      await cdp.send('HeapProfiler.enable'); await cdp.send('HeapProfiler.startSampling', { samplingInterval: 16384, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
      await page.waitForTimeout(+process.env.ALLOC * 1000); const { profile: hp } = await cdp.send('HeapProfiler.stopSampling'); const self = new Map(), walk = (n, path) => { const k = (n.callFrame.functionName || '(anon)') + ':' + (n.callFrame.lineNumber + 1) + (/index\.html/.test(n.callFrame.url) ? '' : ' ' + n.callFrame.url.split('/').pop());
        const gp = /index\.html/.test(n.callFrame.url) ? k : path; const sz = (n.selfSize || 0); if (sz) { const key = gp === k ? k : (gp || '?') + ' > ' + k; self.set(key, (self.get(key) || 0) + sz); } for (const c of n.children || []) walk(c, gp); }; walk(hp.head, '');
      const tot = [...self.values()].reduce((a, b) => a + b, 0); console.log(`   ALLOC ${(tot / 1048576 / +process.env.ALLOC).toFixed(1)} MB/s sampled; top sites (nearest game fn > callee):`);
      for (const [k, v] of [...self].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log(`     ${(v / 1048576 / +process.env.ALLOC).toFixed(2).padStart(6)} MB/s  ${k}`); }
    await cdp.send('Profiler.start'); await page.waitForTimeout(SECS * 1000); const { profile } = await cdp.send('Profiler.stop');
    const ft = await page.evaluate(() => window.__ft);
    if (process.env.HG) console.log('   HEROGLOW list', await page.evaluate(() => mel.HEROGLOW.list.length + ' pend ' + mel.HEROGLOW.pend.length + ' programs ' + window.__shot.renderer.info.programs.length));
    // the profile: per sample, the stack (leaf..root) as names
    const byId = new Map(profile.nodes.map(n => [n.id, n])), par = new Map(); for (const n of profile.nodes) for (const c of n.children || []) par.set(c, n.id);
    const nm = n => (n.callFrame.functionName || '(anon)') + ':' + (n.callFrame.lineNumber + 1);
    let t = profile.startTime; const S = []; for (let i = 0; i < profile.samples.length; i++) { t += profile.timeDeltas[i]; S.push([t, profile.samples[i]]); }
    // group samples into frame calls: a run of samples whose stack holds frame__
    const stackOf = id => { const a = []; for (let x = id; x != null; x = par.get(x)) a.push(byId.get(x)); return a; };
    const frames = []; let cur = null, lastT = 0;
    for (const [ts, id] of S) { const st = stackOf(id), inF = st.some(n => n.callFrame.functionName === 'frame__'), inR = st.some(n => n.callFrame.functionName === 'render' && /three/.test(n.callFrame.url));
      if (inF) { if (!cur || ts - lastT > 3000) { cur = { t0: ts, js: 0, own: new Map(), leaf: new Map(), gc: 0 }; frames.push(cur); } lastT = ts; const dt = 0.5; if (!inR) { cur.js += dt;
          // the deepest index.html function (game code) owns the sample; also tally each game fn on the stack (inclusive)
          { const lf = st.find(n => /index\.html/.test(n.callFrame.url)); if (lf) { const k = nm(lf) + (st[0] !== lf ? ' > ' + nm(st[0]).replace(/:\d+$/, '') : ''); cur.leaf.set(k, (cur.leaf.get(k) || 0) + dt); } } const seen = new Set(); for (const n of st) { if (!/index\.html/.test(n.callFrame.url)) continue; const k = nm(n); if (seen.has(k) || k.startsWith('frame')) continue; seen.add(k); cur.own.set(k, (cur.own.get(k) || 0) + dt); } } }
      else if (st[0] && st[0].callFrame.functionName === '(garbage collector)') { if (cur) cur.gc += .5; } }
    // the per-frame timing from the page (JS = frame minus render)
    const js = ft.map(f => f[1]).sort((a, b) => a - b), med = js[js.length >> 1] || 0, p95 = js[Math.floor(js.length * .95)] || 0;
    { let up = 0, gcs = 0; for (let i = 1; i < ft.length; i++) { const d = ft[i][3] - ft[i - 1][3]; if (d > 0) up += d; else if (d < -2e5) gcs++; } const sec = (ft[ft.length - 1][0] - ft[0][0]) / 1000; console.log(`   JS heap: ~${(up / 1048576 / sec).toFixed(1)} MB/s allocated (lower bound), ${(up / 1024 / ft.length).toFixed(0)} KB/frame, ${gcs} collections seen`); }
    const spikes = ft.filter(f => f[1] > Math.max(LIM, med * 3));
    const gaps = []; for (let i = 1; i < spikes.length; i++) gaps.push(spikes[i][0] - spikes[i - 1][0]);
    console.log(`\n== ${q}: ${ft.length} frames in ${SECS}s, game JS median ${med.toFixed(1)} ms, p95 ${p95.toFixed(1)}, max ${js[js.length - 1]?.toFixed(1)} | render median ${(ft.map(f => f[2]).sort((a, b) => a - b)[ft.length >> 1] || 0).toFixed(1)} ms`);
    console.log(`   spikes > ${Math.max(LIM, med * 3).toFixed(0)} ms: ${spikes.length}` + (gaps.length ? `, spacing ms: ${gaps.map(g => g.toFixed(0)).join(' ')}` : ''));
    // profile frames: the heavy ones, with what owned them
    const pjs = frames.map(f => f.js).sort((a, b) => a - b), pmed = pjs[pjs.length >> 1] || 0;
    const heavy = frames.filter(f => f.js > Math.max(LIM, pmed * 3));
    const tally = new Map(); for (const f of heavy) for (const [k, v] of f.own) { const e = tally.get(k) || { ms: 0, n: 0 }; e.ms += v; e.n++; tally.set(k, e); }
    // subtract the typical frame's share so what is listed is what the heavy frames do EXTRA
    const base = new Map(), light = frames.filter(f => f.js <= pmed * 1.5); for (const f of light) for (const [k, v] of f.own) base.set(k, (base.get(k) || 0) + v / Math.max(1, light.length));
    const extra = [...tally].map(([k, e]) => [k, e.ms / Math.max(1, heavy.length) - (base.get(k) || 0), e.n]).filter(x => x[1] > 2).sort((a, b) => b[1] - a[1]).slice(0, 14);
    console.log(`   profiler: ${frames.length} frames, JS median ${pmed.toFixed(1)} ms, heavy ${heavy.length}, heavy spacing ms: ${heavy.slice(1).map((f, i) => ((f.t0 - heavy[i].t0) / 1000).toFixed(0)).join(' ')}`);
    for (const [k, ms, n] of extra) console.log(`     +${ms.toFixed(1).padStart(6)} ms/heavy frame  in ${String(n).padStart(3)} of them  ${k}`);
    for (const f of heavy) console.log(`     frame @${((f.t0 - profile.startTime) / 1e6).toFixed(2)}s ${f.js.toFixed(1)} ms: ` + [...f.leaf].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => k + ' ' + v.toFixed(1)).join(' | '));
    console.log(`   gc in heavy frames: ${(heavy.reduce((a, f) => a + f.gc, 0) / Math.max(1, heavy.length)).toFixed(1)} ms avg`);
    if (process.env.DUMP) fs.writeFileSync(process.env.DUMP, JSON.stringify(profile));
  } catch (e) { console.log(`${q}: FAILED ${e.message.split('\n')[0]}`); }
  await page.close();
}
await browser.close(); server.close();
