// node tools/captest.mjs <outdir> -- CAPTURE.md's headless check: boots the test world, captures a 640x360 + 360x640 take for ~12 s, saves both MP4s (ffprobe them).
import { createRequire } from 'node:module'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), OUT=process.argv[2]; const req=createRequire(import.meta.url); let pw; for (const p of ['playwright', '/opt/node22/lib/node_modules/playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = req(p); break; } catch (e) {} }
const MIME={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(new URL(q.url,'http://x').pathname),f=path.join(ROOT,u==='/'?'index.html':u); if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();} r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r);});
await new Promise(o=>srv.listen(0,o)); const br=await pw.chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
const ctx=await br.newContext({acceptDownloads:true, viewport:{width:640,height:360}}); const pg=await ctx.newPage(); pg.on('pageerror',e=>console.log('pageerror',e.message)); pg.on('console',m=>{ if(/CAPTURE|Shader|ERROR|error/.test(m.text())) console.log('console',m.text().slice(0,600)); });
await pg.goto(`http://127.0.0.1:${srv.address().port}/index.html?w=test&entry=0`,{timeout:180000,waitUntil:'domcontentloaded'});
await pg.waitForFunction(()=>document.getElementById('boot').classList.contains('gone')&&window.mel,null,{timeout:240000,polling:1000});
console.log(await pg.evaluate(async()=>{ const e=[]; for (const c of ['avc1.64002A','avc1.42001f','vp09.00.41.08']) { try { e.push(c+':'+(await VideoEncoder.isConfigSupported({codec:c,width:640,height:360,bitrate:4e6,framerate:60})).supported); } catch(x){ e.push(c+':ERR'); } } return e.join(' '); }));
console.log('DEBUG', await pg.evaluate(()=>JSON.stringify(mel.capDebug())));
await pg.evaluate(async()=>{ mel.CAPT.res=360; await mel.capStart(); });
const dls=[]; pg.on('download', d=>dls.push(d));
await pg.waitForTimeout(12000);
console.log(await pg.evaluate(()=>JSON.stringify({on:mel.CAPT.on,n:mel.CAPT.n,drops:mel.CAPT.drops,views:mel.CAPT.views.map(v=>[v.name,v.W,v.H,v.codec,v.n,v.drop,v.bytes,v.err])})));
await pg.evaluate(()=>mel.capStop()); await pg.waitForTimeout(6000);
for (const d of dls) { const f=path.join(OUT,d.suggestedFilename()); await d.saveAs(f); console.log('saved',f,fs.statSync(f).size); }
console.log(await pg.evaluate(()=>JSON.stringify(mel.CAPT.stat)));
await br.close(); srv.close();
