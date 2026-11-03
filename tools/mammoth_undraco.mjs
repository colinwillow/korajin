// THE MAMMOTH PIPELINE, step 0: strip draco so pip bpy (no draco bridge) can import it. Same deps as mammoth_pack.mjs.  node mammoth_undraco.mjs in.glb out.glb
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'draco3d.decoder': await draco3d.createDecoderModule() });
const doc = await io.read(process.argv[2]);
doc.getRoot().listExtensionsUsed().filter(e => e.extensionName === 'KHR_draco_mesh_compression').forEach(e => e.dispose());
await io.write(process.argv[3], doc);
