// node tools/petrig/layer.mjs <forged.glb> <out.glb> -- the pet friend's second arms + tail on every forged clip (see layer.js), then
// `node tools/petrig/pack.mjs` (webp + draco). The whole pipeline is in CHARACTERS.md (the pet friend).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const [src, out] = process.argv.slice(2);
// role -> off (a fraction of the clip: the lower arms swing HALF a beat behind the upper on the move), k (how much of it), tail [amp, lift, period s]
const roles = { walk: { off: .5, k: .8, tail: [.22, .12, 1e9] }, run: { off: .5, k: .9, tail: [.3, .3, 1e9] }, idle: { off: .31, k: .55, tail: [.18, .05, 2.6] },
  hop: { off: .06, k: .9, tail: [.12, .45, 1e9] }, jump: { off: .06, k: .9, tail: [.12, .45, 1e9] }, scratch: { off: .27, k: .5, tail: [.14, 0, 2.2] },
  look: { off: .33, k: .6, tail: [.2, .05, 3.0] }, cheer: { off: .18, k: 1, tail: [.35, .25, .8] }, _: { off: .3, k: .6, tail: [.15, .05, 2.5] } };
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const page = fs.readFileSync(path.join(ROOT, 'tools/petrig/layer.js'), 'utf8'), T = { '.js': 'text/javascript', '.wasm': 'application/wasm' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(`<body><script type="importmap">{"imports":{"three":"/vendor/three.module.min.js"}}</script><script>window.ARG=${JSON.stringify({ src: '__src.glb', out: 'out.glb', roles })}</script><script type="module" src="/__p.js"></script>`); }
  if (u === '/__p.js') { r.writeHead(200, { 'content-type': 'text/javascript' }); return r.end(page); }
  const f = u === '/__src.glb' ? path.resolve(src) : path.join(ROOT, u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(o => srv.listen(0, o));
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), pg = await br.newPage();
pg.on('pageerror', e => { console.log('PAGE', e.message); process.exit(1); });
await pg.exposeFunction('saveFile', (n, b64) => { fs.writeFileSync(path.resolve(out), Buffer.from(b64, 'base64')); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/`); await pg.waitForFunction('window.DONE', null, { timeout: 300000 });
console.log(JSON.stringify(await pg.evaluate('window.DONE'))); await br.close(); srv.close();
