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
- **THE MEGALITH HAMMER** (m2791, his: "the reach is kinda far -- he punches you even though he doesn't touch you... give him a massive
  sledgehammer"): a rough stone post (bowed, tapered, uneven) and a carved monolith head with a Jinra band, on his right hand (the haft along
  the hand's +Z, measured off the slam's impact frame). Its stone twin is the statue's. **Every blow lands where the HEAD really is:**
  - **SWING** (close, `swipe` clip): hurts only within `reach` 1.25 m of the head or .8x of the haft's middle.
  - **SHOCKWAVE** (`slam` x1.25, the head's Jinra band kindles first): three rings of dust and stone run out from the impact at 7 m/s, .5 s
    apart, 14 m out. Only a man ON THE GROUND is hit -- JUMP each one. A cracked-ground decal stays 6 s.
  - **OVERHEAD** (`slam` x.78, a rumble at the start: a long readable wind-up): 24 at the head, 60% at the edge of 2.1 m. The head stays STUCK
    in the ground 1.7 s (`G.cbOpen` set: the punish window), then comes up.
  - No more punch ring (`smash` is null for this kind). `mel.shadeAttack(i, 'swipe' | 'wave' | 'over')`. Sheet: `npm run hammershot`.
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

## HIS TACTIC -- THE PLAN (not built; his verdict Nov 6: "I annihilated him just by swiping a ton... there's no skill to it")
> *"We need every guy to be difficult in its own right -- not in the same way -- there's gotta be some tact to each enemy."*

**The idea in one line: he is a WALL from the front; you open him with HIS OWN hammer.** Every way in is a read of one of his three blows.

1. **THE GUARD (the front is closed).** Out of his attacks he holds the hammer across his body. A blow landing inside his front arc
   (`guard.arc` ~100 deg either side of his facing) **TINKS** -- pale spark, `st_ring`, a small recoil on you, no armour damage
   (`shadeBlow` returns 'block'). He turns to face you at his walk turn rate, so circling alone does not beat him for long.
2. **THREE OPENINGS, each one a read** (`G.crack` = seconds the armour is open; blows in it break a piece as now, and a full charge two):
   - **STUCK** (the overhead): the head in the ground 1.7 s -- already built; it becomes the main window (`crack` = `over.stuck`).
   - **BEHIND** after a PERFECT DODGE of the swing (the combat worker's `cbtPerfectDodge`): you are past his shoulder, `crack` 1.2 s,
     and only from behind (the back arc).
   - **COUNTER** after a JUMPED shockwave: clear a ring in the air and land within reach -> `crack` 1.0 s (the "you read it" reward).
   The open armour SHOWS it: the stone's seams glow hot amber for the window (an emissive pulse on the stone material), so the player
   learns the window by seeing it, no text.
3. **HE PUNISHES CAMPING.** Stay inside 2.5 m of him for more than `crowd.T` 1.6 s and he answers with a quick SHOVE (a short `stomp`,
   a knock-back ring of 3 m, light damage, no wind-up long enough to block-spam through). Mashing at his front feeds this.
4. **THE SPIRIT PHASE IS A CHASE, NOT A FREE KILL.** Bare, he stops guarding but DRIFTS: every 2-3 s he phases (dissolve-shimmer, a
   short blink 3-5 m to a side) and is untouchable (`G.phaseT`) while he flickers; Jinra blows land only while he is SOLID, and each one
   that lands knocks him back and starts the next drift sooner. Jinra arrows are the tool for the drift (they ignore the phase if they
   arrive just as he re-solidifies -- timing, not spam). Spirit hp stays ~5 Jinra hits.
5. **THE NUMBERS** stay on `SHADE` (`guard`, `crack`, `crowd`, `drift`) and on mel, and TOOLS > SHADE gets a third setting: TACTIC ON / OFF.

**Proving it (two scripts, both through the shipped hit paths):**
- `npm run shadefight` becomes the SKILLED fight: waits for each opening (the stuck head, a perfect dodge of the swing, a jumped ring),
  strikes in the window, dunks, chases the drifting spirit -- must KILL him (exit 0) inside a time budget.
- `npm run shademash` is the MASHER: stands in front and swings + looses plain arrows every .2 s for 90 s of game time -- must NOT kill him
  (exit 1 if he dies), and must report how often the shove punished it.

**What it changes in code:** `shadeBlow` (the guard arc + `G.crack`), `shadeAct` (the crowd shove, opening the window on stuck / dodge /
jumped ring), the spirit drift in `shadeFxStep`'s live loop, the stone emissive pulse. No new assets.

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
- [ ] HIS TACTIC (the plan above): the guarded front, three openings, the shove, the drifting spirit; a skilled fight passes, a mash fails.
- [ ] His sign-off on his phone.
