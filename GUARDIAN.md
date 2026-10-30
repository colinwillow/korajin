# THE STONE GUARDIAN -- the four-armed temple boss (his drawings, Oct 29 2026)

> *"He's got four arms, so I don't know if the auto rigger is gonna have that under control... a boss, pretty big. We might have to elongate
> some of his arms, maybe make his head bigger. Maybe he throws boulders. Make him in pieces, so we can knock off his arms and pieces of his
> armour."*

## How he is made (re-run after any change to the source)
    blender-addons/pipeline:  tripo.py out/guardian_3d front left back right --faces 9000     (120 credits)
                              orient.py textured.fbx in.glb -90                                 (faces -Y, grounded)
                              guardian_rig.py in.glb rig.glb                                    (the SCRIPTED rig: Auto-Rig Pro has no second arm pair)
    m1793, the PARTS route (his: "Tripo has a cut-up and make-whole feature"): seg.py out/guardian_seg <the texture task id>   (segment ~40 + complete 50 credits)
                              blender -b --python guardian_parts.py -- out/guardian_seg/complete.glb out/guardian_3d/in.glb out/guardian_parts/rig.glb out/guardian_parts/atlas.jpg 2048
                              (Tripo's 117 AI-completed parts fitted onto in.glb's box, ONE 2048 atlas packed per part, each part rigid on its nearest bone,
                               a part straddling a limb joint blended across it; no split, no caps) -> webp -> draco -> stone_guardian.glb, then the Forge as below
    gltf-transform resize 2048 -> webp -> draco  ->  zap/models/creatures/stone_guardian.glb   (6.8 MB -> 0.9 MB; Tripo's map was 4K)
    zap: node tools/forge.cjs models/creatures/stone_guardian.glb tools/guardian_forge_prof.json models/characters/forged/stone_guardian.glb --lib ../retarget-anims/library/clips
- **The rig:** Mixamo names for hips, spine, neck, head, legs and the UPPER arms (so library clips drive him); a second chain per side for the
  LOWER arms (`mixamorig_LeftArm2` / `LeftForeArm2` / `LeftHand2`, off `Spine1`). No clip touches those: in the game they ECHO the upper pair a
  beat behind (`GUARD.echo`, `GUARD.lag`). Bone positions were MEASURED off the mesh (cross-sections of the arm bands, legs, torso).
- **The weights are RIGID** (each vertex to its nearest bone segment, a short blend only at elbows and knees): he is stone, and one owner per
  vertex is what lets an arm or the head lift out of the skin as a clean piece (`guardTris`, `limbBake`).
- **15 clips** (Mutant idle / walk / run / roar / swipe / punch / jump attack / flex / turns, Throw Object, Stomp, Smash, a hit, a death).

## DONE WHEN (the boss on a white floor, alone)
- [x] He exists as his stone twin first (STATUES.md): grey, still; a blow WAKES him (cracks, dust, a roar). (m1732)
- [x] Swipe (close), Smash (a ring: jump it), Throw (a boulder at your lead: roll it, or cut it out of the air). (m1732)
- [x] Four arms come off one by one, each to its own stone; all four gone or no hp and he bursts. A full katana charge takes an arm. (m1732)
- [ ] Armour plates as their own pieces (today the shoulder plates leave WITH their arm; a plate of its own needs the mesh split by part).
- [ ] The lower arms with moves of their own (a grab, a clap) -- hand-keyed or procedural, since no Mixamo clip has a second pair.
- [ ] A disarmed phase: with no arms he stomps and charges.
- [ ] His arena (a temple floor with height -- the VERTICALITY rule) and the chalice that wakes him.
- [x] HARD-SURFACE rig (m1733): every face to one bone, the mesh split where two bones meet -- no stretching (his: "the jaw is all stretching").
- [x] The X stance (m1733): all four arms out like a wrestler, the lower pair as big as the upper (`GUARD.X`, `arm2K` 1.3).
- [ ] BOSS LOGIC (his: "really, really easy to beat -- eventually they need some tic-tac-toe logic"): reads of what you do (guarding, rolling,
      keeping range) and answers to it, patterns that change with how many arms he has left, punishes for button-mashing.
- [ ] His sign-off on his phone.

## HOW YOU BEAT HIM -- the strategy layer (his, m1735; a proposal to build once the body is signed off)
> *"Eventually I want god-tier enemies as big as canyons -- like God of War, you can't really just hurt them: you find the vulnerability, shoot
> it, plant a bomb, blow off their arm. For now double his size, and sub-bosses that are just pretty big. Your sword just bounces off the stone
> arms; once we have the bomb, maybe three blows knocks an arm off -- but he picks it back up, so you knock it off and then blow the whole
> thing. There's gotta be strategy and intrigue."*

**Three tiers of big thing**
| tier | size | how it is fought |
|---|---|---|
| **sub-boss** (this guardian, today) | 2-5x you | on foot: dodge, read the attacks, work on the pieces |
| **boss** | 5-10x you (he is at 8.8 m) | the vulnerability loop below, one arena |
| **titan** (god tier) | canyon-sized | the arena IS the body: climb it, ride the arms, the weak points are places |

**The loop for a stone boss (one cycle per arm)**
1. **Stone is armour.** A sword on the stone CLANGS OFF (a spark, a recoil on you, no damage) -- the blade only bites where the stone is
   CRACKED or where the Jinra GLOWS (his chest core, the green seams at his joints, his eyes).
2. **Open it.** A weak point opens on a READ: after a SMASH his hands are stuck in the ground for a beat (the joints exposed); after a THROW the
   empty hand glows; an arrow in the EYE staggers him (the God of War shot).
3. **Break it.** Strikes on an open joint crack the arm (three, as he said); a BOMB stuck to a cracked joint (the lantern bomb, TOOLS_SANDBOX
   piece 5) blows it OFF.
4. **Deny it.** A fallen arm is not gone: he walks to it and PUTS IT BACK (a slow, readable reach -- the window). Blow it up or cut it to
   pieces on the ground (it is debris already: `debrisCut`) and it is gone for good.
5. **Each arm lost changes him**: fewer swipes, more throws with what he has left; at one arm, desperate (the charge); at none, the chest core
   is open and that is the kill.

**What exists to build it on**: the pieces (`guardCut`), debris you can cut, arrows and blast arrows, the statue wake. **What is missing**: the
clang-off rule, weak points as places on the body, the bomb, the re-attach walk, a camera for something 9 m tall.

## Dials (`GUARD`)
`h` 8.8 m tall (m1735: doubled) · `headK` 1.22 (his bigger head) · `arm2K` 1.1 · the LONG ARMS are in the model (`guardian_rig.py`: upper arm x1.4, forearm x1.5, hands x1.8) · `hp` 48 · `armHp` 7 · hit frames measured
(the right hand's fastest frame): swipe .48, smash .34, throw .50.

## THE TEMPLE DWELLER (m1737) -- the second kind on this code
A mini Olmec (his four views): 2.3 m, two arms, `OLMEC` in index.html. Same pipeline with `olmec_rig.py` and `tools/olmec_forge_prof.json`.
He wanders round where he stands until you come near (9 m) or hit him. Open: his own moves (a head-butt? a roll?), a voice, and where he lives.
