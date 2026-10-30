// THE FORGE, HEADLESS: the same forge.html, driven from the command line, so a pack can be baked onto a body without anyone
// opening the app.  node tools/forge.cjs <character.glb> <profile.json> <out.glb> --lib <folder with _index.json> [--mesh]
// It serves this repo and the library folder on a local port, opens forge.html in headless chromium, loads the profile, and
// writes what EXPORT would download. Clips only unless --mesh.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || '/opt/node-tools/node_modules/playwright');
const args = process.argv.slice(2), flag = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const lib = flag('--lib'), mesh = args.includes('--mesh'); if (mesh) args.splice(args.indexOf('--mesh'), 1);
const [chr, prof, out] = args;
if (!chr || !prof || !out || !lib) { console.error('usage: node tools/forge.cjs <character.glb> <profile.json> <out.glb> --lib <folder> [--mesh]'); process.exit(1); }
const ROOT = path.resolve(__dirname, '..'), LIB = path.resolve(lib);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  const MINE = path.join(LIB, '..', 'mine');
  const f = u.startsWith('/lib/') ? path.join(LIB, u.slice(5)) : u.startsWith('/mine/') ? path.join(MINE, u.slice(6)) : path.join(ROOT, u);
  if (!f.startsWith(ROOT) && !f.startsWith(LIB) && !f.startsWith(MINE)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
}).listen(0, async () => {
  const port = srv.address().port, b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage(), errs = []; p.on('pageerror', x => errs.push(x.message));
  try {
    await p.goto(`http://localhost:${port}/forge.html?lib=/lib/&char=${encodeURIComponent(chr)}`, { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => window.forge && forge.ST.tg, null, { timeout: 180000 });
    const P = JSON.parse(fs.readFileSync(prof, 'utf8'));
    await p.evaluate(P => forge.profile(P), P);
    const b64 = await p.evaluate(m => forge.export(m), mesh);
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    console.log(`forge: ${P.clips.length} clips onto ${chr} -> ${out} (${(fs.statSync(out).size / 1e6).toFixed(2)} MB)`);
  } catch (e) { console.error('forge: ' + e.message); process.exitCode = 1; }
  if (errs.length) { console.error('page errors:', errs.slice(0, 5)); process.exitCode = 1; }
  await b.close(); srv.close();
});
