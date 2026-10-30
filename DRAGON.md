# THE DRAGON RIDE -- his blue dragon, a sandbox of its own

> *"I really wanna build the blue dragon: build some armor for it and a mount, and put it in a little zone where I can mount it and ride it,
> for the part in the game when I tame it, and then play with flying it and controlling it on the ground and making it shoot an attack and
> all that."* (Oct 28 2026)

KORAJIN > **The Dragon Ride** (`?w=forge&zone=dragon`, `DRAGZ` in `index.html`). The zone is a meadow island over a sea of cloud at sunset.
His dragon (`models/creatures/blue_dragon.glb`, x1.8 of its arena size, about 5.8 m) stands on a stone dais at the far end, facing you as you
arrive. Stepping stones climb to a high crag (the take-off perch). Six islands are spread out below, level, above and high above, and five
Jinra hoops hang through the tiers to fly through. Step off the edge and you are put back at the start.

Story: KORAJIN.md, THE BLUE DRAGON (the first mount). This is where the TAMING and the RIDING are built and tuned, before anything takes the
dragon into a level (the WHOLE-PIECE RULE).

## DONE WHEN

- [ ] **1. The zone, and the dragon armoured in it** (m1610): the island, the dais, the climb, the tiers. Pass 2 of the dressing: CAPTURED
      (red lacquer and gold: head plate, bridle, live reins, cantle and saddle lames, pauldrons, a chest plate with our crest, neck and
      tail plates, tail rings and a crescent blade) and EVIL (blackened iron: mask with horns, spiked plates, spiked collar and chain,
      shackles, stolen red Jinra, his hide darkened). TOOLS > DRAGON switches CAPTURED / EVIL / BARE live. *Open: his look at it.*
- [ ] **2. Mount / dismount** (m1614): a mint ring at his left flank; stand on it and tap the right pad: an arc up into the saddle
      (`in_air`), Grumbo seated in his `driving` clip (no riding clip in his file), the seat pinned to the dragon's Spine1; tap again to hop
      off onto the ring. CAPTURED only. The lens follows behind and pulls back. *Open: his look at it.*
- [ ] **3. Ground riding** (m1618): the left pad steers him camera-relative (turns at `turn`, on the spot when still), `idle` + `run` blended
      and sped by his speed (`runRef` 7 is a dial: his run is not measured), leans into turns, keeps in the rim, walks round the posts and low
      stones; the lens behind and above. *Open: his feel of it (speed, turn, the run's rate).*
- [ ] **4. Flying** (m1619): the LEFT TAP takes off (a leap and a beat) and beats the wings in the air; the left pad flies him like
      RollerGirl's wingsuit (sideways turns and banks, up climbs, down dives; a dive gains speed, a climb spends it; under `stall` his nose
      drops); run off any edge and he glides; he lands on whatever is under him (meadow, dais, crag, the six islands) and rides on from there.
      Get off only on the meadow. **No fly clip in his file**: `attack_air` is his base pose aloft and his wing fingers are fanned and beaten in
      code (TOOLS > DRAGON WINGS: CODE / CLIP). *Open: his feel of it, and his fly cycle.*
- [ ] **5. Attacks** (m1621): the RIGHT FLICK breathes a fireball (the m1096 look) from his head along his forward (`attack_ground` on the ground,
      the ball leaving partway in; aloft at once); the RIGHT PAD HELD UP fires Grumbo's blaster from the saddle toward the middle of the
      screen; 12 archery butts on posts and ropes over the meadow, the crag, four islands and by the hoops burst when hit and come back.
      *Open: his feel of it.*
- [ ] **6. Taming** (m1622): the first visit he is WILD (EVIL): he watches you, growls, shoves you off if you crowd him. The JINRA SPRING by
      the start gives Grumbo an orb to carry; tap the right pad near the dragon and it floats into his mouth: `dizzy` (stolen red Jinra
      bursting out, the iron falling off piece by piece, his hide clearing), `wake_up`, CAPTURED, and the ring lets you on. TOOLS > DRAGON:
      EVIL makes him wild again to replay it. (No kneel clip.) *Open: his look at it.*
- [ ] **He played it on his phone and signed it off.**

## THE CONTROLS IN THE SADDLE (his, after m1624)

LEFT PAD: walk / run on the ground; in flight the wingsuit stick (sideways banks and turns, up climbs, down dives). LEFT DOUBLE TAP (on the
meadow): get off. RIGHT TAP: jump. RIGHT DOUBLE TAP (a tap while up from a jump or a hover): take off and fly; in flight a tap is a wing beat.
RIGHT HOLD (in place): hover up while held, then sink slowly back down. RIGHT DRAG: the camera. RIGHT FLICK: fireball. RIGHT HELD UP: the gun.

## Needs from him

- A **fly cycle** for the dragon (a flap and a glide) -- the GLB has `attack_air, attack_ground, casual, death, dizzy, entrance, hit, idle,
  run, wake_up` and nothing that flies.
- Any **riding clips** for Grumbo (seated, holding the reins, leaning into a turn).

## Facts (measured off his file)

- 1 skinned mesh, 1 material (`blue_dragon_texture`), Bip001 biped rig. He faces **+Z** (head z +0.024 against pelvis -0.007 in the bind
  pose), `+X` is his left, like everything else here.
- The wings hang off the forearms: `bone22..bone27` (the leading edge) and the finger chains `Bone001..`, `Bone008..`, `Bone013..`,
  `Bone020..`, `Bone025..`, `Bone030..`. The tail is `bone01..bone06` off the pelvis; `bone08` / `bone10` are on the head (the jaw).
