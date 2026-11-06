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
- **Stone weights are RIGID** (each triangle to the one bone nearest its centroid, welded only within a bone): hard surface, nothing
  stretches, and a piece lifts out clean. The loincloth flaps ride the hips; the collar and chest plate stay on the chest.
- **Spirit weights are BLENDED** (a bone and its parent/child, by distance), so the glowing body bends.
- **Spirit decimated 10,808 -> 5,387 tris** (meshoptimizer, UV-aware, error .047). Stone kept whole at 10,417.
- Textures: stone 2048 WebP, spirit 1024 WebP (it is emissive). Draco. `doubleSided` off on both. **One file, 1.32 MB:**
  `models/creatures/stone_guardian_2layer.glb` -- one skeleton, two skinned meshes (`shade_stone`, `shade_spirit`), the clips.
- The scripts are in the m2777 NOTES entry's session scratch; the method is the paragraph above (FBX -> world-space geometry -> v
  flipped (FBX v runs up) -> measured joints -> swung frames -> weights -> GLTFExporter -> gltf-transform textures + draco).

## Cost on a phone (measured off the file)
| state | tris | draws |
|---|---|---|
| fully armoured | 10,417 | 1 (stone) |
| some armour broken | stone minus the pieces + the spirit's pieces under them | 2 |
| wisps, all guardians | -- | 1 (pooled `Points`) |
| Tama motes | -- | 1 (pooled `Points`) |
The spirit DRAWS ONLY WHERE THE ARMOUR IS BROKEN: each guardian has its own index over the shared vertices, rewritten on a break.

## How it fights (`SHADE`, a third kind on the guardian brain; `mel.SHADE` live)
- 3.4 m, swipe + smash (no boulders), the old guardian's states (statue, wake, walk, swipe, smash, stag).
- **15 segments**: head, chest, waist, and a side each of shoulder (upper arm + plate), forearm, hand, thigh, shin, foot.
  `segHp` per kind of piece (chest 3.6 ... hand / foot 1.2), in the game's own damage units (a sword hit ~1.3).
- **A blow lands on the segment nearest it.** Stone: it chips (sand sparks, dust, `st_chip`), `stoneK` (.15) reaches his hp, and at 0
  the piece BREAKS: the stone flies off as a rock (`limbBake` -> `ARENA.debris`, cuttable like every piece), rock burst + dust + green
  burst, `st_break` + `st_crack`, he staggers, and the spirit limb beneath is revealed. A full katana charge breaks a piece outright.
- **Exposed spirit takes the blow** (`spiritK` 1, `fullK` 2 on a full charge): mint sparks, wisps.
- **Green energy off every exposed area** (`wisp` per s per broken piece, rising and curling off the limb's real surface), and the chest
  core always breathes a few (`core`), twice as many once the chest plate is off.
- **Beaten:** every piece still on flies off, the spirit stands alone, pulses, and goes up in a PUFF of green smoke (`dieT` 1 s); 14
  TAMA motes (`tama`) burst from its surface, hang, then fly to Grumbo. Each one counts (`TAMA.n`, saved as `mel.tama`; a chip at the
  top of the screen for a moment; the BACKPACK lists it), and the last one home plays the `loot_small` jingle.
- **The statue twin** (STATUES.md): the same rig in the flex pose, `statueStone` (grey, no glow, the chest core dark); a blow wakes it.

## The sandbox
Combat Lab: SPAWN > BOSS > **Stone guardian (2-layer)**, or the arena SPAWN menu's STONE GUARDIAN (2-LAYER) -- a statue twin and a live one.
`mel.shadeAdd()`, `mel.shadeBreak('shoulderL')`, `mel.shadeKill()`. Contact sheet: `node tools/shadeshot.mjs` (armoured + statue, arm
and head broken, the dissolve).

## DONE WHEN
- [x] Both models rigged on ONE Mixamo-named skeleton, sharing every clip (idle, walk, run, swipe, smash/slam, hit, die ...). (m2777)
- [x] Phone budget: stone ~10k, spirit ~5k, textures 2048 / 1024, draco, single-sided; the spirit draws only where broken. (m2777)
- [x] Armour breaks per segment: the stone flies off as a rock, the spirit limb shows, green wisps rise off it. (m2777)
- [x] Beaten: a green puff, Tama motes fly to Grumbo and are counted, with the jingle. (m2777)
- [x] A statue twin (STATUES.md). (m2777)
- [ ] The weights at the joints on HIS phone (rigid stone: does any plate gap or poke through at a hard bend?).
- [ ] Hit reacts that differ by piece (a head blow snaps the head back) -- today every stagger is the one `hit` clip.
- [ ] A dedicated stagger and death on this rig (today the old guardian's `hit` and the puff; `die` is unused).
- [ ] The numbers tuned with the combat worker (segment hp, `stoneK`, spirit hp) -- COMBAT_DEPTH.md.
- [ ] His sign-off on his phone.
