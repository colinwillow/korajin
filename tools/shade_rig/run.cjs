// node run.cjs <module.js> [argjson]  -- serves the repo at / and /tmp/claude-0/sg at /sg/, runs the module in headless chromium
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const ROOT='/home/user/korajin', SG='/tmp/claude-0/sg';
const [mod,arg]=process.argv.slice(2);
const T={'.html':'text/html','.js':'text/javascript','.json':'application/json','.wasm':'application/wasm'};
const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);
 if(u==='/__h.html'){r.writeHead(200,{'Content-Type':'text/html'});return r.end(`<!doctype html><html><body style="margin:0;background:#888"><script type="importmap">{"imports":{"three":"/vendor/three.module.min.js"}}</script><script type="module" src="/sg/work/${mod}"></script></body></html>`);}
 const f=u.startsWith('/sg/')?path.join(SG,u.slice(4)):path.join(ROOT,u);
 fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream'});r.end(b);});
}).listen(0,async()=>{const port=srv.address().port;
 const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:900,height:900}});
 p.on('pageerror',x=>console.error('PAGEERR',x.message));p.on('console',m=>console.log('>',m.text()));
 await p.exposeFunction('saveFile',(name,b64)=>{fs.writeFileSync(path.join(SG,'out',name),Buffer.from(b64,'base64'));return 1;});
 fs.mkdirSync(path.join(SG,'out'),{recursive:true});
 await p.addInitScript(a=>{window.ARG=a;},arg?JSON.parse(arg):null);
 await p.goto(`http://localhost:${port}/__h.html`);
 try{await p.waitForFunction(()=>window.DONE!==undefined,null,{timeout:600000});
 console.log(JSON.stringify(await p.evaluate(()=>window.DONE),null,1));}catch(e){console.error('ERR',e.message);}
 await b.close();srv.close();});
