# THE PET FRIEND -- the companion (Colin, Nov 6 2026)

*"This guy has four arms. He's like a little creature... maybe he's there in the prologue and then he gets lost from you and part of one of
the beginning things is you have to find him. He's got four arms, two legs. He's kinda like a little monkey guy, so you should rig him up
and make sure it's done well, and then we can have him follow you around, and he's got some noises."*

**Story (NOT built yet, on purpose -- the whole-piece rule):** he is with you in the prologue, gets lost, and finding him is an early objective.
That is a level built ON this piece, so it waits for the sign-off below.

## The piece
- **Model** `models/characters/companions/korajin_petfriend_01.glb` -- his Tripo FBX (`character_model_zips/korajin_petfriend_01.fbx`, texture
  embedded), rigged by `tools/vrig` on the Toad Wanderer's Mixamo skeleton plus his own chains: **`mixamorig_{Left,Right}{Arm2,ForeArm2,Hand2}`**
  off Spine1 (the second pair of arms) and **`mixamorig_Tail`..`Tail3`** off the hips. 0.80 m to the tips of his hair spikes, 10,390 tris, one
  2048 WebP, draco, single-sided, opaque, 1.2 MB. Joints MEASURED off ortho renders (`images/characters/korajin_petfriend_01_grid.jpg`).
- **Clips** (the Forge, `tools/petfriend_forge_prof.json`): idle (Happy_Idle), walk (Mutant_Walking), run (Mutant_Run), hop (Mutant_Jumping),
  jump (Joyful_Jump -- the happy one), scratch (Zombie_Scratch_Idle), look (Look_Around), cheer (Excited).
- **The second arms are NOT a copy** (`tools/petrig/layer.js`): each takes the first pair's motion as a delta from rest, half a beat later on the
  move (k .8-.9) and a third of a clip off at rest (k .5-.6). The **tail** sways in a wave down its four bones, lifted on the run and the hop.
- **Rebuild everything**: `tools/petrig/build.sh` (vrig -> Forge -> layer -> webp + draco).
- **Voice**: Plutopia's own creature noises (`SFX.creature`, byte-identical to `colinwillow/plutopia/audio/creature_noise_01..07`), pitched to
  his size (`voxSize`'s curve): idle chatter on Plutopia's 3.4-8.5 s clock, fond when he's beside you, a HAPPY chirp when he puffs in or you
  come back to him from far away, a little one on some hops.

## The follow (pass 1) -- `SC_COMPANION` / `cmpStep`
His spot is 1.5 m behind you and .8 off your right shoulder, ON YOUR LEVEL (else straight behind, else nearer). He walks / runs / sprints by
how far off it he is; walks up .36 steps; HOPS (a ballistic arc + the hop clip) up a ledge to 2.4 m or over a gap to 4.2 m; steps off a drop
to 3.2 m; and when he cannot get to you (stuck 2.2 s, 24 m behind, or you on a level he can't reach for 1.2 s) he goes in a PUFF and comes out
of one beside you (smoke ring + sparkle + a grow-in + the cheer and a happy chirp) -- never a pop. Standing: he faces you and fidgets.

## DONE WHEN
- [x] Rigged with all four arms and the tail on their own bones; no candy-wrapper, no stretched rings / jaw (m-build renders: `_fsb`, `_poses`, `_weights`)
- [x] Idle, walk, run, hop, scratch, look on him; the second arms on their own beat
- [x] Follows in the white sandbox (`?w=forge&zone=pet`): trails, catches up, hops both gaps and both ledges, steps down, puffs up the 7 m pillar
      (`npm run petfollow`: every leg ends with him on his spot)
- [x] Plutopia's creature noises, no synth
- [ ] **Colin's sign-off on his phone** (the feel: his pace, the hop, the puff, the chatter)
