# THE STONE GUARDIAN, TWO LAYERS -- break the stone, cut the spirit (his models, Nov 6 2026)

> His two Tripo models: the guardian in carved sandstone armour, and the SAME guardian, same pose, as pure glowing green spirit.
> Two layers of one enemy.

**Lore (proposed, rename freely -- the names are only in comments, this doc and `TAMA`):** the green is STOLEN JINRA animating the
stone, a **Hollow Shade**. Beaten, it lets go of **Tama** -- motes of the stolen life -- that fly to Grumbo and are counted.

## How it is made (re-run after any change to the source)
No Blender in the session that built it (m2777), so the rig is made in a headless browser + node, not Auto-Rig Pro:
- **Source:** `models/characters/character_model_zips/stone_guardian.zip` (FBX, 10,417 tris, 4K jpg) and
  `stone_guardian_spirit.zip` (FBX, 10,808 tris, jpg). Both A-pose, facing +Z, 1.0 tall, soles at y 0.
- **The skeleton is the OLD guardian's frames** (`models/creatures/stone_guardian.glb`, two arms of it -- no `Arm2` chain), with each
  bone's position MEASURED off the spirit body (cross-sections; the spirit sits inside the armour) and each bone's bind frame the old
  frame swung onto the new limb. Then a clip's LOCAL rotations mean the same pose on both rigs, so **his 15 forged guardian clips
  (`models/characters/forged/stone_guardian.glb`) are copied in unchanged** -- only the hips' travel is scaled (x1.59, hips .43 vs .27).
  Clips: idle, walk, run, roar, swipe, punch, slam, throw, stomp, smash, hit, die, flex, turnL, turnR.
- **Stone weights are RIGID** (one bone per triangle, welded only within a bone). m2783 split: an AUTHORED piece (`armor_*`, SHADE_PIECES.md)
  goes whole to its bone; else each mesh ISLAND (41 of them) goes whole to the bone most of it is nearest; an island across a joint (8: the
  torso block, the limb gauntlets) is cut on a PLANE square to the limb at the joint, then majority-filtered -- no ragged teeth.
- **Spirit weights are BLENDED** (a bone and its parent/child, by distance), so the glowing body bends.
- **Spirit decimated 10,808 -> 5,387 tris** (meshoptimizer, UV-aware, error .047). Stone kept whole at 10,417.
- Textures: stone 2048 WebP, spirit 1024 WebP (it is emissive). Draco. `doubleSided` off on both. **One file, 1.32 MB:**
  `models/creatures/stone_guardian_2layer.glb` -- one skeleton, two skinned meshes (`shade_stone`, `shade_spirit`), the clips.
- The scripts are in the m2777 NOTES entry's session scratch; the method is the paragraph above (FBX -> world-space geometry -> v
  flipped (FBX v runs up) -> measured joints -> swung frames -> weights -> GLTFExporter -> gltf-transform textures + draco).

## Cost on a phone (m2783 re-split: same tris) (measured off the file)
| state | tris | draws |
|---|---|---|
| fully armoured | 10,417 | 1 (stone) |
| some armour broken | stone minus the pieces + the spirit's pieces under them | 2 |
| wisps, all guardians | -- | 1 (pooled `Points`) |
| Tama motes | -- | 1 (pooled `Points`) |
The spirit DRAWS ONLY WHERE THE ARMOUR IS BROKEN: each guardian has its own index over the shared vertices, rewritten on a break.

## How it fights (`SHADE`, a third kind on the guardian brain; `mel.SHADE` live) -- m2783, after he played it
- 3.4 m, swipe + smash (no boulders); perfect dodge / timed parry open him (the combat worker's guardian path, m2779).
- **15 pieces**: head, chest, waist, and a side each of shoulder (upper arm + plate), forearm, hand, thigh, shin, foot.
- **THE ARMOUR PHASE: one piece per solid hit, in ORDER.** A blow works on the nearest piece among the lowest tier still on and the tier above
  (`SHTIER`: hands / feet -> forearms / shins / head -> shoulders / thighs -> waist -> chest). `segHp` .9 (chest 1.6, waist 1.2) = one solid
  hit, two combo pokes. Stone blows LOOK like little (dull grey chips, `st_knock`). **He cannot die in his armour.** A break: the stone flies
  off as a rock (cuttable debris), dust, a green burst, he staggers, the spirit limb shows and sheds wisps.
- **THE SPIRIT PHASE**: the last piece off -> a roar and a green burst, then he fights on as the pure spirit: `spiritHp` 5 (~5 hits),
  `spiritSpd` x1.6 walk, brighter and faster-pulsing glow. Full charge x2, inside an opened window x`CBT.depth.openK`.
- **ONLY JINRA FINISHES THE SPIRIT** (m2784, his puzzle beat): a plain blade or arrow PASSES THROUGH the bare spirit -- wisps stream along
  the cut and close behind it, the body thins for .4 s, a ghostly whoosh, no hitstop; an arrow flies on. A **JINRA BRAZIER** (the Dark Hall's
  bronze brazier, mint coals, Jinra fire, a mint light) is placed by every Shade fight. Walk up to it with the sword out and he DUNKS it: the
  JIN blade state (`BFIRE.on` 2, the wheel's own turquoise fire) for 20 s or 14 spirit hits, guttering for its last 3 s; with the bow out,
  3 Jinra arrows. Infused blows land with a Jinra burst; the last one a big Jinra flash before the dissolve. `SHJIN` / `INFUSE` live on mel;
  TOOLS > SHADE: NEEDS JINRA (default) / ANY HIT. Owning the JIN BLADE (the wheel's JIN, `jinblade`) is the permanent version of the dunk.
- **THE DEATH**: he staggers and glows HOT (`stagT` .45 s), then VAPORISES from the feet up (`dieT` 1.8 s): a dissolve on the spirit's own
  shader with a hot noisy edge, green smoke and wisps leaving the edge and rising into a cloud over his head; the cloud condenses into 14
  TAMA motes that fly to Grumbo, are counted (`TAMA.n`), and the last home plays `loot_small`.
- **The statue twin** (STATUES.md): the same rig in the flex pose, `statueStone`; a blow wakes it.

## The regression
`npm run shadefight` fights one to death through the shipped hit paths (sword sweeps + real arrows -> spirit pass-through -> the dunk ->
Jinra kill) and exits 1 on a stall (m2789: the stone hands were unhittable, a leaf bone).

## The sandbox
Combat Lab: SPAWN > BOSS > **Stone guardian (2-layer)**, or the arena SPAWN menu's STONE GUARDIAN (2-LAYER) -- a statue twin and a live one.
`mel.shadeAdd()`, `mel.shadeBreak('shoulderL')`, `mel.shadeBare()`, `mel.shadeKill()`. Authored pieces: SHADE_PIECES.md. Contact sheet: `node tools/shadeshot.mjs` (armoured + statue, arm
and head broken, the dissolve).

## DONE WHEN
- [x] Both models rigged on ONE Mixamo-named skeleton, sharing every clip (idle, walk, run, swipe, smash/slam, hit, die ...). (m2777)
- [x] Phone budget: stone ~10k, spirit ~5k, textures 2048 / 1024, draco, single-sided; the spirit draws only where broken. (m2777)
- [x] Armour breaks per segment: the stone flies off as a rock, the spirit limb shows, green wisps rise off it. (m2777)
- [x] Beaten: a green puff, Tama motes fly to Grumbo and are counted, with the jingle. (m2777)
- [x] A statue twin (STATUES.md). (m2777)
- [x] Pieces break one at a time in an order; a spirit phase; a vaporise death into Tama (his first play, fixed m2783).
- [ ] The armour split on HIS phone (m2783's island / plane split), or his own authored pieces (SHADE_PIECES.md).
- [ ] The cryptic hint NPC near a Shade fight ("stone breaks to steel; spirit only bows to the light it was stolen from").
- [ ] Hit reacts that differ by piece (a head blow snaps the head back) -- today every stagger is the one `hit` clip.
- [ ] A dedicated stagger and death on this rig (today the old guardian's `hit` and the puff; `die` is unused).
- [ ] The numbers tuned with the combat worker (segment hp, `stoneK`, spirit hp) -- COMBAT_DEPTH.md.
- [ ] His sign-off on his phone.
