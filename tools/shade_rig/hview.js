import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
const R=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); R.setSize(900,900); document.body.appendChild(R.domElement);
const S=new THREE.Scene(); S.background=new THREE.Color(0x777777); S.add(new THREE.HemisphereLight(0xffffff,0x444444,2.5)); const dl=new THREE.DirectionalLight(0xffffff,2); dl.position.set(1,2,3); S.add(dl);
const fbx=new FBXLoader(), TL=new THREE.TextureLoader();
const files=[['/sg/husk/tripo_convert_f6d5931d-686d-4718-bc0d-88c0b94d0f91.fbx','/sg/husk/tripo_convert_f6d5931d-686d-4718-bc0d-88c0b94d0f91.fbm/tripo_rgb_ab464df6-d238-4948-91c7-ddabaaa2086e.jpg']];
let i=0; for(const [f,t] of files){ const g=await fbx.loadAsync(f); const tex=await TL.loadAsync(t); tex.colorSpace='srgb';
 g.traverse(o=>{if(o.isMesh)o.material=new THREE.MeshStandardMaterial({map:tex,roughness:.8});}); i++; S.add(g);}
const C=new THREE.PerspectiveCamera(30,1,.1,50);
for(const [n,p] of [['front',[0,.5,4]],['side',[4,.5,0]],['back',[0,.5,-4]]]){C.position.set(...p);C.lookAt(0,.5,0);R.render(S,C);await saveFile('husk_'+n+'.png',R.domElement.toDataURL().split(',')[1]);}
window.DONE=1;
