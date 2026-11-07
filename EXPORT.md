# EXPORT -- the scene out to Cinema 4D for a test cutscene / style frame (his, Nov 7 2026)

> *"Let's get that export ready so I can mess with it -- a little test cutscene with some animation. I bring it into Cinema 4D, relight it,
> re-texture it, hook everything up, do a little style frame, see how it looks, see if it's worth it."*

A TEST of the DCC route for hero shots. CINEMA.md stands: cutscenes are in-game REELS; this asks whether a rendered hero shot is worth it.

## The tool: `npm run sceneexport [zone] [take] [--still] [--tex=1024] [--r=110]`
- Boots the SHIPPED page in the zone (entry off, the prologue reel ended, him out of the hammock), a fake clock, and steps the SHIPPED
  `frameBody` at 30 fps while the take drives him (the left stick part-way = a walk; `swapGo` = the katana draw).
- Samples every frame the local TRS of every node under his rig (`char_grumbo`): the bones -- so the cape, IK, springs and the draw ride along as
  they really played -- plus the weapons (a hidden node = scale 0). Only nodes that move get tracks.
- THE CAMERA `cam_main`: a slow truck alongside his line (CINEMA house style), the side / distance / height picked by RAYCAST (8 moments, lens to
  his chest, against every mesh) so nothing blocks him; yfov = the take's lens (34 deg).
- THE SCENE through the vendored GLTFExporter, one binary .glb: metre scale, Y-up; meshes within `--r` m of the take; KTX2 textures
  decompressed through the renderer, capped at `--tex` px, JPEG where the material is opaque; instanced sets expanded to nodes that SHARE one
  mesh (plain glTF instancing, which C4D imports); game-only vertex attributes dropped; a ShaderMaterial (not glTF) gets a MeshStandardMaterial
  stand-in with its colour / texture; see-through FX shaders (light shafts, glows, auras) left out; the sun + point lights as KHR_lights_punctual.
- THE CHECK: re-imports the file in a fresh three page (GLTFLoader, an AnimationMixer on the clip) and renders `cam_main` at the take's middle.

## The test take (`test`): the prologue garden
Grumbo walks the zen circle's raked sand (`GARDEN.zen`) past the rune obelisk (m2813) and the floaters, draws the katana at 3.6 s, 7 s at 30 fps.
`--still` = one frame at 4.4 s (mid-draw) for a style frame.

## DONE WHEN
- [x] `npm run sceneexport garden test` writes ONE .glb with the zone, Grumbo skinned + animated, the katana draw, `cam_main` animated, lights. (built)
- [x] Re-imported in three, cam_main rendered at the middle: Grumbo walking on the sand, the obelisk and floaters in frame. (exports/garden_test_check.jpg)
- [x] A still variant. (exports/garden_test_still.glb + _check.jpg)
- [x] README in exports/ (import, axis, scale, what is baked, what is not).
- [ ] The file reaches him: ~93 MB each, over GitHub's 50 MB warning and near its 100 MB wall -- NOT committed (exports/*.glb is gitignored);
      a host is his pick.
- [ ] It opens in Cinema 4D 2024+ with the camera, the clip and the lights. (his machine)
- [ ] **His style frame, and his call: worth it or not.**

## Not done (said plainly)
- The pet friend is not in the take (no pet in the garden scene to follow).
- The floaters' bob and every non-Grumbo motion are FROZEN at frame 0 (only his rig and the camera are baked).
- Cloth / vertex-shader motion (grass sway, water, the cape if it is a shader effect) is not baked -- only bones and node transforms.
- No FBX: C4D imports glTF natively, so the FBX inverse was not worth its cost.
- The sky is a shader dome and is left out: add an HDRI / sky in C4D.
