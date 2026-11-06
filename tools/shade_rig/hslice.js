import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
const g=await new FBXLoader().loadAsync('/sg/husk/tripo_convert_f6d5931d-686d-4718-bc0d-88c0b94d0f91.fbx'); g.updateMatrixWorld(true); let P; g.traverse(o=>{if(o.isMesh)P=o.geometry.attributes.position.clone().applyMatrix4(o.matrixWorld);});
const out={n:P.count/3}; const xs=[]; for(let i=0;i<P.count;i++) xs.push(P.getX(i)); xs.sort((a,b)=>a-b);
// gaps in x
const gaps=[]; for(let i=1;i<xs.length;i++) if(xs[i]-xs[i-1]>.01) gaps.push([xs[i-1].toFixed(3),xs[i].toFixed(3)]); out.xgaps=gaps; out.xr=[xs[0],xs[xs.length-1]];
const cut=+(window.ARG&&window.ARG.cut||9); const body=[],sp=[]; for(let t=0;t<P.count;t+=3){ const cx=(P.getX(t)+P.getX(t+1)+P.getX(t+2))/3; (cx>cut?sp:body).push(t);}
out.bodyTris=body.length; out.spearTris=sp.length;
const bb=(L)=>{const b=new THREE.Box3(); for(const t of L) for(let k=0;k<3;k++) b.expandByPoint(new THREE.Vector3().fromBufferAttribute(P,t+k)); return [b.min.toArray().map(v=>+v.toFixed(3)),b.max.toArray().map(v=>+v.toFixed(3))];};
out.bodyBB=bb(body); if(sp.length) out.spearBB=bb(sp);
// body slices in y (legs/torso), and in x (arms)
const pts=[]; for(const t of body) for(let k=0;k<3;k++) pts.push(new THREE.Vector3().fromBufferAttribute(P,t+k));
const rows=[]; const H=out.bodyBB[1][1]; for(let y=0.01;y<H;y+=H/40){ const s=pts.filter(p=>Math.abs(p.y-y)<H/80).map(p=>[p.x,p.z]).sort((a,b)=>a[0]-b[0]); const iv=[];let c=null; for(const [x,z] of s){ if(c&&x-c.b<.015){c.b=x;c.z0=Math.min(c.z0,z);c.z1=Math.max(c.z1,z);} else {c={a:x,b:x,z0:z,z1:z};iv.push(c);} } rows.push('y'+y.toFixed(3)+': '+iv.map(v=>`[${v.a.toFixed(3)},${v.b.toFixed(3)}]`).join(' ')); } out.yrows=rows;
const cols=[]; for(let x=0.0;x<out.bodyBB[1][0];x+=0.02){ const s=pts.filter(p=>Math.abs(p.x-x)<.01); if(!s.length) continue; let y0=9,y1=-9,z0=9,z1=-9; for(const p of s){ if(p.y>H*.5){y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z);} } cols.push('x'+x.toFixed(2)+': upper y '+y0.toFixed(3)+'..'+y1.toFixed(3)+' z '+z0.toFixed(3)+'..'+z1.toFixed(3)); } out.xcols=cols;
window.DONE=out;
