// node pack.mjs <layered.glb> <out.glb> <tex.jpg> [size] -- run from a folder with @gltf-transform + draco3dgltf + sharp (tools/shade_rig/README):
// the texture as WebP at `size` (2048), every material single-sided and opaque (Tripo writes doubleSided; alphaMode OPAQUE), clips resampled, draco.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, prune, dedup, resample } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'fs';
const [src, out, jpg, size = 2048] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read(src), root = doc.getRoot();
for (const t of root.listTextures()) t.dispose();
const T = doc.createTexture('petfriend').setImage(await sharp(fs.readFileSync(jpg)).resize(+size, +size).webp({ quality: 82 }).toBuffer()).setMimeType('image/webp');
doc.createExtension(ALL_EXTENSIONS.find(e => e.EXTENSION_NAME === 'EXT_texture_webp')).setRequired(true);
for (const m of root.listMaterials()) m.setDoubleSided(false).setAlphaMode('OPAQUE').setMetallicFactor(0).setRoughnessFactor(.82).setBaseColorTexture(T);
await doc.transform(resample({ tolerance: 1e-4 }), dedup(), prune({ keepLeaves: true }), draco({ method: 'edgebreaker', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(out, doc);
const d2 = await io.read(out); for (const m of d2.getRoot().listMeshes()) for (const p of m.listPrimitives()) console.log('tris', p.getIndices().getCount() / 3, 'verts', p.getAttribute('POSITION').getCount());
for (const m of d2.getRoot().listMaterials()) console.log('material', m.getName(), 'doubleSided', m.getDoubleSided(), 'alphaMode', m.getAlphaMode());
console.log('anims', d2.getRoot().listAnimations().map(a => a.getName()).join(' '), 'bytes', fs.statSync(out).size);
