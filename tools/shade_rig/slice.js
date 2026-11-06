import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
const fbx=new FBXLoader(); const out={};
for (const [k,f] of [['stone','/sg/stone_guardian/tripo_convert_1cb2d7f7-0b32-4d9e-af9b-38bf0ebf7831.fbx'],['spirit','/sg/stone_guardian_spirit/tripo_convert_a6ecb089-0a08-443a-953d-f62a85939441.fbx']]) {
 const g=await fbx.loadAsync(f); g.updateMatrixWorld(true); let P; g.traverse(o=>{if(o.isMesh){P=o.geometry.attributes.position.clone().applyMatrix4(o.matrixWorld);}});
 const rows=[]; for(let y=0.01;y<1;y+=0.025){ const xs=[]; for(let i=0;i<P.count;i++){const py=P.getY(i); if(Math.abs(py-y)<0.0125) xs.push([P.getX(i),P.getZ(i)]);}
  xs.sort((a,b)=>a[0]-b[0]); const iv=[]; let cur=null; for(const [x,z] of xs){ if(cur&&x-cur.b<0.025){cur.b=x;cur.z0=Math.min(cur.z0,z);cur.z1=Math.max(cur.z1,z);} else {cur={a:x,b:x,z0:z,z1:z};iv.push(cur);} }
  rows.push(y.toFixed(3)+': '+iv.map(v=>`[${v.a.toFixed(2)},${v.b.toFixed(2)} z${v.z0.toFixed(2)}..${v.z1.toFixed(2)}]`).join(' ')); }
 out[k]=rows; }
window.DONE=out;
