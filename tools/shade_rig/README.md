# The procedural Tripo rig (m2777, the 2-layer stone guardian) -- no Blender needed

Built because this container had no Blender / Auto-Rig Pro. Headless chromium (playwright) + three's FBXLoader / GLTFExporter, then node
gltf-transform for textures + draco. **The scripts are as used for the guardian: paths and joints are hard-coded -- copy and edit.**

Setup (scratch, not the repo):
    unzip models/characters/character_model_zips/<x>.zip -d /tmp/claude-0/sg/<x>      # run.cjs serves /tmp/claude-0/sg at /sg/
    mkdir /tmp/claude-0/sg/nm && cd /tmp/claude-0/sg/nm && npm init -y && npm i @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 draco3dgltf sharp meshoptimizer
    cp tools/shade_rig/*.js tools/shade_rig/*.cjs /tmp/claude-0/sg/work/ ; cp tools/shade_rig/pack.mjs /tmp/claude-0/sg/nm/

Steps:
1. `node run.cjs view.js` -- renders the FBX (front/side/back) to /tmp/claude-0/sg/out. Check facing (+Z wanted) and pose.
2. `node run.cjs slice.js` -- horizontal cross-sections (x intervals per height): read the joints off them (+X is HIS LEFT).
3. Edit `JL` / `TIP` in rig.js (left side; mirrored), and the donor: rig.js takes its BONE FRAMES from a donor GLB
   (`models/creatures/stone_guardian.glb`) and its CLIPS from the donor's forged file. Each new bone = donor rest frame swung onto the
   measured limb, so the donor clips' LOCAL rotations apply unchanged; only the hips' position track is scaled. Use any donor whose clips
   you want (a villager: a villager GLB + its clip file) -- the donor's bone names are what the new rig gets.
4. `node run.cjs rig.js '{"look":1}'` -- weights as colours + bones, front/side; `'{"look":[["walk","walk",0.4]]}'` poses a clip.
5. `node run.cjs rig.js '{"export":1}'` -> out/shade_raw.glb; then `node pack.mjs ../out/shade_raw.glb <repo>/models/...glb`
   (pack.mjs attaches the jpgs as WebP at 2048 / 1024 by material NAME, doubleSided off, draco).
Gotchas: FBX v runs UP, glTF's runs down -- rig.js flips v at load (else the texture is a patchwork). Tripo FBX nodes carry a -90 X
rotation: rig.js bakes matrixWorld into the geometry. Stone = rigid per-triangle weights; spirit = blended between a bone and its
neighbour (`adj`). Cloth / a skirt / hair: give it to the hips or a blend, or add bones -- nothing here does secondary motion.

## The husk soldier (m2781): `hrig.js` + `hpack.mjs`
Same method on the SAMURAI donor (`models/characters/samurai_game.glb`: its bones incl. thumb / index / weapon_root_* / weapon_tip*, and all 123
clips). Bones not measured (fingers, weapon markers) take the donor's offset, scaled to the body, turned with their parent. His spear is split
off by mesh ISLANDS (any island reaching x > .41 in the file; the fingers stop at .40) and written as `models/weapons/husk_spear.glb` in the
KATANA's convention: `weapon_root_right` at the grip (.36 of the shaft from the butt), shaft along +Y head up, `weapon_tip` at (-14.3102, 0, 0),
file units = metres / WEAP.unit (.01321). `node hpack.mjs raw.glb out.glb <size> <material>` resamples the clips, keeps leaf nodes
(`prune({ keepLeaves: true })` -- a plain prune DELETES the empty `weapon_tip` marker and the mount silently falls back), WebP, draco.
A spirit layer later: rig it with the same script (same donor) and add it to the GLB as a second SkinnedMesh on the same bones (the
stone guardian's `shadeInit` / `shadeRebuild` are the pattern).
