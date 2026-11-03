// THE MAMMOTH PIPELINE, step 4 (pack): resample the clips, drop the spring bones (cloth_*) channels, draco. Needs @gltf-transform/{core,extensions,functions} + draco3dgltf
// (npm i them in a scratch dir; this repo ships no node_modules).  node mammoth_pack.mjs in.glb out.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, prune, dedup, resample } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule() });
const doc = await io.read(process.argv[2]);
// the spring bones (cloth_*) are the runtime's: no clip keys them, so their sampled rest channels are dead weight
let cut = 0; for (const a of doc.getRoot().listAnimations()) for (const ch of a.listChannels()) { const n = ch.getTargetNode(); if (n && /^cloth_/.test(n.getName())) { const s = ch.getSampler(); ch.dispose(); if (s && !s.listParents().some(p => p !== doc.getRoot() && p.propertyType === 'AnimationChannel')) s.dispose(); cut++; } }
console.log('cloth channels cut', cut);
await doc.transform(resample({ tolerance: 2e-4 }), dedup(), prune({ keepLeaves: true }), draco({ method: 'edgebreaker', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12, quantizeGeneric: 12 }));
await io.write(process.argv[3], doc);
