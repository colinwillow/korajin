# tools/tripo -- his Tripo weapon set, FBX -> the game's GLB (m2605)

`models/source/weapons_01.fbx` (one mesh, 118 loose parts, one 4K atlas) -> `models/weapons/tripo_weapons_01.glb`.
Blender as a python module (no Blender install here): `python3.13 -m venv v && v/bin/pip install bpy==5.2.3 pillow numpy`;
renders need `apt-get install libegl1 libgl1-mesa-dri` and `EGL_PLATFORM=surfaceless`. The scripts take `<scratch dir> <this dir>` LAST.

    v/bin/python -I tools/tripo/split.py  $SCR tools/tripo   # -> $SCR/split.blend: glaive, sword, sheath, bow, string, quiver, arrow(+head)
    v/bin/python -I tools/tripo/build.py  $SCR tools/tripo   # -> $SCR/built.blend + $SCR/raw.glb (frames, fits, cuts; prints INFO)
    v/bin/python -I tools/tripo/rcheck.py $SCR tools/tripo   # -> $SCR/r/check.png: sheathed, x-ray, the bow + its nocks, quiver, arrow
    npx @gltf-transform/cli@4 draco $SCR/raw.glb models/weapons/tripo_weapons_01.glb   # the bpy wheel's exporter has no draco bridge

The part ids in split.py (77 = his string, 81/78/83/89/91/94 = the quiver, 82/116 = the arrow) are the loose-part walk's order on THIS file;
a re-export from Tripo renumbers them -- re-run the part plot first.

The GLOW MASK (m2610): `atlas.py` writes the 4K atlas out of the FBX, `mask.py <scratch>` classes it (brass / gold, the light carved lines, the
blade's red runes on grey steel, bright steel rims, the cyan gem) into `<scratch>/glowmask.png`; save it as `models/weapons/tripo_weapons_01_glow.webp`
(greyscale, 2048). `rmask.py` renders each piece with the mask painted on, to look at before shipping.
