// node tools/vrig/run.mjs <villager.json> [--look] -- RIG A TRIPO VILLAGER (CHARACTERS.md, `VILLAGERS`). Headless Blender is not available
// here, so this is the stone guardian worker's method (m27xx, "the Hollow Shade") made general: in headless Chromium, the static Tripo FBX is
// welded, the DONOR's Mixamo skeleton (default: the Toad Wanderer's 56 joints, `mixamorig_*`) is re-fitted to the joints MEASURED on this mesh
// (each donor bone swung onto the new limb direction, so its frames are the donor's), every vertex is weighted to its nearest bone segment (with
// a blend into the adjacent one; no cross-body bleed: a vertex on his left never takes a right-side bone), the texture is resized, and a GLB
// is written. The CLIPS come after, from the Forge (`node tools/forge.cjs <rig.glb> <profile.json> <out.glb> --lib .../library/clips --mesh`).
// <villager.json>: { fbx, tex, donor, height, J: {joint: [x,y,z] in the FBX's own units}, TIP, rigid: [[bone, box...]], out }
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
import os from 'node:os'; import { execFileSync } from 'node:child_process';
const cfgPath = path.resolve(process.argv[2]), CFG = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
let SRC = path.resolve(path.dirname(cfgPath), CFG.dir || '.');
if (CFG.zip) { SRC = fs.mkdtempSync(path.join(os.tmpdir(), 'vrig-')); execFileSync('unzip', ['-q', '-o', path.resolve(ROOT, CFG.zip), '-d', SRC]);     /* his Tripo zip: the FBX and its .fbm texture folder */
  const all = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? all(path.join(d, e.name)).map(f => path.join(e.name, f)) : [e.name]), files = all(SRC);
  CFG.fbx = CFG.fbx || files.find(f => /\.fbx$/i.test(f)); CFG.tex = CFG.tex || files.find(f => /\.(jpe?g|png)$/i.test(f)); console.log('zip ->', CFG.fbx, '+', CFG.tex); }
const OUT = path.resolve(ROOT, CFG.outDir || 'models/characters/villagers'); fs.mkdirSync(OUT, { recursive: true });
CFG.look = process.argv.includes('--look') ? 1 : 0;
const req = createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const page = fs.readFileSync(path.join(ROOT, 'tools/vrig/page.js'), 'utf8');
const T = { '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.wasm': 'application/wasm' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { r.writeHead(200, { 'content-type': 'text/html' }); return r.end(`<body style="margin:0"><script type="importmap">{"imports":{"three":"/vendor/three.module.min.js"}}</script><script>window.ARG=${JSON.stringify(CFG)}</script><script type="module" src="/__page.js"></script>`); }
  if (u === '/__page.js') { r.writeHead(200, { 'content-type': 'text/javascript' }); return r.end(page); }
  const f = u.startsWith('/src/') ? path.join(SRC, u.slice(5)) : path.join(ROOT, u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise(o => srv.listen(0, o));
const br = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), pg = await br.newPage({ viewport: { width: 1200, height: 800 } });
pg.on('pageerror', e => console.log('PAGE', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 300)); });
await pg.exposeFunction('saveFile', (n, b64) => { fs.writeFileSync(path.join(OUT, n), Buffer.from(b64, 'base64')); console.log('wrote', path.relative(ROOT, path.join(OUT, n))); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/`); await pg.waitForFunction('window.DONE', null, { timeout: 300000 });
console.log(JSON.stringify(await pg.evaluate('window.DONE'), null, 1)); await br.close(); srv.close();
