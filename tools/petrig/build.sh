#!/bin/bash
# THE PET FRIEND, end to end (CHARACTERS.md): rig (tools/vrig) -> clips (the Forge) -> second arms + tail (layer) -> webp + draco (pack).
# needs /home/user/retarget-anims (the clip library) and a node_modules with @gltf-transform + draco3dgltf + sharp at $NM (tools/shade_rig/README).
set -e; cd "$(dirname "$0")/../.."; NM=${NM:-/tmp/claude-0/sg/nm}; T=$(mktemp -d)
node tools/vrig/run.mjs models/characters/companions/korajin_petfriend_01.json ${LOOK:+--look} | tail -c 400
node tools/forge.cjs models/characters/companions/korajin_petfriend_01_rig.glb tools/petfriend_forge_prof.json $T/forged.glb --lib ${LIB:-/home/user/retarget-anims/library/clips} --mesh
node tools/petrig/layer.mjs $T/forged.glb $T/layered.glb
python3 -I -c "import sys;d=open(sys.argv[1],'rb').read();i=d.find(b'\xff\xd8\xff');j=d.rfind(b'\xff\xd9');open(sys.argv[2],'wb').write(d[i:j+2])" models/characters/character_model_zips/korajin_petfriend_01.fbx $T/tex.jpg
cp tools/petrig/pack.mjs $NM/__ppack.mjs && (cd $NM && node __ppack.mjs $T/layered.glb "$OLDPWD/models/characters/companions/korajin_petfriend_01.glb" $T/tex.jpg 2048)
