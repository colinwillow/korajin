import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, prune, dedup, textureCompress } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import fs from 'fs';
const [src, out] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.encoder': await draco3d.createEncoderModule(), 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read(src), root = doc.getRoot();
const SG = '/tmp/claude-0/sg/';
const img = async (f, w) => sharp(fs.readFileSync(SG + f)).resize(w, w).webp({ quality: 82 }).toBuffer();
const stoneT = doc.createTexture('shade_stone').setImage(await img('stone_guardian/tripo_convert_1cb2d7f7-0b32-4d9e-af9b-38bf0ebf7831.fbm/tripo_rgb_f0a549bb-ff91-427f-9cbd-4244236097c6.jpg', 2048)).setMimeType('image/webp');
const spT = doc.createTexture('shade_spirit').setImage(await img('stone_guardian_spirit/tripo_convert_a6ecb089-0a08-443a-953d-f62a85939441.fbm/tripo_rgb_175a5042-39d5-420f-a15e-ead802bc6946.jpg', 1024)).setMimeType('image/webp');
doc.createExtension(ALL_EXTENSIONS.find(e => e.EXTENSION_NAME === 'EXT_texture_webp')).setRequired(true);
for (const m of root.listMaterials()) { m.setDoubleSided(false).setMetallicFactor(0);
  if (m.getName() === 'shade_stone') { m.setBaseColorTexture(stoneT).setRoughnessFactor(.85); }
  if (m.getName() === 'shade_spirit') { m.setBaseColorTexture(spT).setEmissiveTexture(spT).setEmissiveFactor([1, 1, 1]).setRoughnessFactor(.6); } }
await doc.transform(dedup(), prune(), draco({ method: 'edgebreaker', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(out, doc);
const d2 = await io.read(out); for (const m of d2.getRoot().listMeshes()) for (const p of m.listPrimitives()) console.log(m.getName(), 'tris', p.getIndices().getCount() / 3, 'verts', p.getAttribute('POSITION').getCount(), Object.keys(p.listSemantics ? {} : {}), p.listSemantics().join(','));
console.log('anims', d2.getRoot().listAnimations().length, 'skins', d2.getRoot().listSkins().length, 'bytes', fs.statSync(out).size);
