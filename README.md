# exports/ -- scenes for Cinema 4D (EXPORT.md)

Made by `npm run sceneexport garden test` (and `--still`). The .glb files are ~93 MB each and are gitignored (too big for git); the
`*_check.jpg` next to each is the file re-imported in three.js and rendered from its own camera.

## garden_test.glb -- the test take (7 s, 30 fps)
Grumbo walks across the prologue garden's raked sand past the rune obelisk and the floaters and draws his katana at 3.6 s.

## garden_test_still.glb -- one frame (4.4 s, mid-draw), no animation, for a style frame

## Importing into Cinema 4D (2024+)
- File > Open (or Merge) the .glb. glTF is **metres, Y-up**: C4D's glTF importer converts both; if the scene comes in 100x small or large,
  set the import scale to 100 (cm) -- Grumbo is about 1.25 m tall.
- **Camera:** `cam_main` (a 34 deg vertical field of view = about 37 mm on a 24 mm-high sensor). Set it as the render camera; the take's animation
  drives it.
- **Animation:** one clip, `take`, 0-6.97 s at 30 fps. Set the project to 30 fps and 0-209 frames. It moves `char_grumbo` (his root) and every bone
  that moves (cape, IK, springs and the draw are baked as they played in the game) plus the weapons; a weapon that is hidden is keyed at scale 0.
- **Lights:** the sun and the scene's point lights come in as glTF punctual lights -- a starting rig to relight from. The game's hemisphere /
  ambient fill and image light have no glTF form: add a sky / HDRI.
- **Materials:** PBR (base colour, roughness, metalness, emissive) with their textures (max 1024 px; JPEG where opaque). Materials named
  `*_standin` were game shaders with no glTF form -- a flat colour / texture placeholder to re-texture.
- **Instances:** repeated pieces (plants, lanterns, floaters) are separate nodes SHARING one mesh -- C4D keeps them linked.

## Not in the file
The sky dome, light shafts and glows (shader FX); grass / water / cloth that moves in a shader; any motion but Grumbo's and the camera's
(the floaters are frozen at the first frame); the pet friend.
