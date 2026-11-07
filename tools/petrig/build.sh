#!/bin/bash
# A FOUR-ARMED KORAJIN CHARACTER, end to end (CHARACTERS.md): rig (tools/vrig) -> clips (the Forge) -> extra-bone motion (layer) -> webp + draco (pack).
#   tools/petrig/build.sh                                   the pet friend (korajin_petfriend_01)
#   tools/petrig/build.sh korajin_holy_creature_01 holy     the holy creature (tools/holy_forge_prof.json, tools/petrig/holy_roles.json)
# needs /home/user/retarget-anims (the clip library) and a node_modules with @gltf-transform + draco3dgltf + sharp at $NM (tools/shade_rig/README).
set -e; cd "$(dirname "$0")/../.."; NM=${NM:-/tmp/claude-0/sg/nm}; T=$(mktemp -d); N=${1:-korajin_petfriend_01}; K=${2:-petfriend}
ROLES=""; [ -f tools/petrig/${K}_roles.json ] && ROLES=tools/petrig/${K}_roles.json
node tools/vrig/run.mjs models/characters/companions/$N.json ${LOOK:+--look} | tail -c 400
node tools/forge.cjs models/characters/companions/${N}_rig.glb tools/${K}_forge_prof.json $T/forged.glb --lib ${LIB:-/home/user/retarget-anims/library/clips} --mesh
node tools/petrig/layer.mjs $T/forged.glb $T/layered.glb $ROLES
FBX=$(python3 -I -c "import json,sys;print(json.load(open(sys.argv[1]))['fbxPath'])" models/characters/companions/$N.json)
python3 -I -c "import sys;d=open(sys.argv[1],'rb').read();i=d.find(b'\xff\xd8\xff');j=d.rfind(b'\xff\xd9');open(sys.argv[2],'wb').write(d[i:j+2])" $FBX $T/tex.jpg
cp tools/petrig/pack.mjs $NM/__ppack.mjs && (cd $NM && node __ppack.mjs $T/layered.glb "$OLDPWD/models/characters/companions/$N.glb" $T/tex.jpg 2048)
