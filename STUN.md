# The stun zap — the x-ray electrocution

**Status: BUILT (m901): the fit, the strobe and the daze, on a STUN toggle in the arena. The DNA claw is not built.** A sandbox of its own, open now beside the duel. He owns this file.

*"One of the weapons in Zap's arsenal will be his stun blaster -- his name is Zap. When he zaps someone we flash the mesh
between the NPC and a skeleton and back, so it looks like he's being electrocuted, with effects on top. Then he's stunned
afterwards. You zap them, run up, and if you want to turn into them, a DNA claw melee thing clips their DNA, you stick it in
your own machine, and you turn into whatever."*

## The asset: ONE human skeleton on the universal Mixamo rig

- He draws / picks the skeleton image -> Tripo -> rig it on the **same Mixamo skeleton every human NPC uses** (the pipeline's
  `run_rig.sh`). Because the bones match by name, the skeleton can be driven by ANY human's pose: one file serves every
  civilian, scaled to each one's height.
- `models/characters/xray_skeleton.glb`, no clips needed (it copies the victim's bones every frame).

## The method: a RIGID, SEGMENTED skeleton that fits ANY Mixamo rig (his idea, m900)

*"If we broke the skeleton into its bone segments -- forearm, upper arm, head, neck, torso, leg up, leg down -- and aligned them
rigidly to any Mixamo skeleton, scaled from the root of one bone to the next... it would work for everybody, from the aliens to
the NPCs, and you don't have to generate more skeletons."*
- **Split once, offline**: `xray_skeleton.glb`'s faces are cut by their dominant bone weight into ~20 rigid pieces, each with
  its bone's head and tail on its own rest (bones are separate lumps in the art, so the cuts fall in the joints).
- **Fit per victim KIND, once, at load**: for each piece, the victim's rest bone (head -> child joint) gives a rotation (align
  the axis, plus a twist reference from the rig's own frame), a STRETCH along the bone (length ratio) and a girth scale (the
  victim's overall size). The fitted vertices are written into a geometry with **every vertex 100% on that one bone** and bound
  to the **victim's own skeleton** -- so it is a SkinnedMesh with rigid weights: no per-frame CPU work, one draw call, and it
  is in his exact pose by construction (no retarget, no rest correction).
- Cached per kind (the hick's fit, the blonde's fit, a Brute's...). A bone a rig does not have is simply left out (a Grey's
  extra arms, a tail), and an extra bone has no piece -- it degrades instead of breaking.


1. **The shot**: Zap's STUN mode (a slot beside CHARGE / AUTO on the blaster's wheel, or its own weapon): a crackling arc
   rather than a ball.
2. **The flash**: on a hit, the victim strobes between his own mesh and the skeleton (driven by his skeleton, so it is in his
   exact pose), cartoon x-ray style: a few hard cuts, 8-12 a second, white-blue arcs crawling over him (`spkCling`), a buzz.
3. **Stunned**: then he stands twitching / dazed for a few seconds (`daze`), arms out, sparks dripping. He cannot run or
   fight.
4. **The DNA claw**: walk up to a stunned body and the melee becomes the DNA CLAW: a clip of his DNA (a vial fills on Zap's
   HUD). Later, the machine turns the DNA into a form (the story's real way to get a form; the DNA gun stays debug only).

## DONE WHEN

- [ ] (asset made at m899: `models/characters/xray_skeleton.glb`, 52->22 bones, no fingers) The skeleton GLB on the universal rig, following any human's pose with nothing popping (every civilian checked).
- [ ] A zap strobes him between body and skeleton, with arcs and a buzz, and it reads as electrocution with no words.
- [ ] Stunned for a beat afterwards, visibly.
- [ ] The DNA claw takes a sample from a stunned body (the form use comes with the transformation work).
- [ ] **He played it and signed it off.**
