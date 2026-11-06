import * as THREE from 'three';
import { FBXLoader } from '/vendor/FBXLoader.js';
const R=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true}); R.setSize(900,900); document.body.appendChild(R.domElement);
const S=new THREE.Scene(); S.background=new THREE.Color(0x777777); S.add(new THREE.HemisphereLight(0xffffff,0x444444,2.5)); const dl=new THREE.DirectionalLight(0xffffff,2); dl.position.set(1,2,3); S.add(dl);
const fbx=new FBXLoader(), TL=new THREE.TextureLoader();
const files=[['/sg/stone_guardian/tripo_convert_1cb2d7f7-0b32-4d9e-af9b-38bf0ebf7831.fbx','/sg/stone_guardian/tripo_convert_1cb2d7f7-0b32-4d9e-af9b-38bf0ebf7831.fbm/tripo_rgb_f0a549bb-ff91-427f-9cbd-4244236097c6.jpg'],['/sg/stone_guardian_spirit/tripo_convert_a6ecb089-0a08-443a-953d-f62a85939441.fbx','/sg/stone_guardian_spirit/tripo_convert_a6ecb089-0a08-443a-953d-f62a85939441.fbm/tripo_rgb_175a5042-39d5-420f-a15e-ead802bc6946.jpg']];
let i=0; for(const [f,t] of files){ const g=await fbx.loadAsync(f); const tex=await TL.loadAsync(t); tex.colorSpace='srgb';
 g.traverse(o=>{if(o.isMesh)o.material=new THREE.MeshStandardMaterial({map:tex,roughness:.8});}); g.position.x=i++*1.0-.5; S.add(g);}
const C=new THREE.PerspectiveCamera(30,1,.1,50);
for(const [n,p] of [['front',[0,.5,4]],['side',[4,.5,0]],['back',[0,.5,-4]]]){C.position.set(...p);C.lookAt(0,.5,0);R.render(S,C);await saveFile('view_'+n+'.png',R.domElement.toDataURL().split(',')[1]);}
window.DONE=1;
