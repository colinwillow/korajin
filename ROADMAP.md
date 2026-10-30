# ZAP — roadmap

Fresh start (Oct 22 2026), stripped down from `colinwillow/weirdport` (which stays untouched as the archive).
**The model is LEVELS, not a continuous world** (Mario Sunshine style: each level a finished, polished mix of
acrobatics, a little puzzle and fighting). The story (Zap & Clancy, Earth act -> alien worlds act) threads through the
levels later. **Each sandbox is tuned until it feels great on its own before anything is combined** (several can be open at once).

## STEER
- Two worlds only: **WEIRDPORT** (`tkit`, PLAIN: the breakable kit city, the hydrant, the repair crew -- no story) and
  **WHITE BOX** (`test`). `?story=1` still builds the old story layer for reference until it is cut.
- Style: big heads, big hands, stubby, LOUD. Shots kick the shooter back; armour flies off; chunks off everything; never gory.
- Characters and armour come from the pipeline in `colinwillow/blender-addons` (armoured model -> Tripo segment ->
  bare body -> rig + weapon bones -> `armorfit.py`). The arena in `colinwillow/culture_war` (`duel.html`) is the fight lab.

## SANDBOX (several may be open at once; see the WHOLE-PIECE RULE in CLAUDE.md)
- [ ] **SWORD -- OPEN (spec only).** `SWORD.md`: Zap with sword + shield (the library's Sword and Shield set via the Forge),
      four directional attacks on the right flick, guard + parry + lock-on on the pull-down hold, charge -> lunge -> spin.
      Builds a-e in the spec.
  - [x] a. **m978** the KATANA slot (built in code) + four directional swings on the samurai (measured clip -> direction).
  - [x] b. **m979** the crouched katana guard (pull-down hold, lock-on) + the PARRY that staggers him.
  - [x] c. **m982** charge in the guard -> release lunge (thrust) / full charge spin (the hammer's charge, re-triggered).
  - [x] d. **m984** the 3-hit combo (finisher), the chop/finisher/charge break a guard (slashes clang), the blade trail.
  - [x] m985 the mirror: the AI samurai guards, parries, breaks your guard, rolls your lunge (EASY/MEDIUM/HARD).
  - [x] e1. **m986** probed the katana on every arena enemy: a sword no longer reaches a hovering mech (shoot it down, then cut
        it); the blade has its own damage dial `KATANA.dmgK` 1.6 (a slash was .6 on a beast: 27 cuts for the dog).
  - [x] **m990** his first-play corrections: swings play in place (code carries him), the katana run was a BACKWARD run, the guard
        was a 0.4 s transition looping (now the held block idle), charge on the right pad UP (a held frame: blade straight back,
        3 picks on TOOLS > CHARGE POSE), guard on DOWN, both strafe on katana walks.
  - [ ] his pick of the two anticlimactic directional swings to swap for bigger ones (which flick directions?).
  - [ ] aerial attacks (right flick in the air) and flips (left flick in the air) -- `SWORD.md` "Later".
  - [ ] e2. his play-through per enemy (what feels wrong is the next tuning); the charge hum; then his sign-off.
- [ ] **COVER -- PART 1 SHIPPED m1008 (pillars, slide, crouched cover). Next: vault, pop-up shot, bolts over the crouch, AI.** `COVER.md`: slide tackle on the left flick, slide INTO cover only when flicked toward a half
      wall, vault, pop up to shoot; bolts pass over a crouched body. His idea (Oct 25).
- [ ] **COURSES -- ON THE DOCKET (not immediate).** `COURSES.md`: a menu in the arena that spawns a test ground ("how you learn to
      play"): COVER (slide / cover / shoot, `COVER.md`) and GYM (ladders, ledges, monkey bars, the gymnastics HIGH BAR with giant swings
      and a release into a flip). His idea (Oct 25).
- [ ] **TESTING GROUND -- SPEC (Oct 26, his).** `COURSES.md` THE TESTING GROUND: the arena is the hub; doors boot MODULES (ACROBATICS
      first: gap, hurdle, wall run, wall jump, high bar, beam, a new GRIND RAIL, back to the floor), then FIGHT (dummies, ricochet,
      cover, SPIDER BOTS). Weapon model (katana + one pick-up slot?) is his call. m1077 restyled the turret and the rocket.
- [ ] **HORDE -- OPEN (his, Oct 27).** `HORDE.md`: 100 fighters on a phone, red vs blue, hits that launch men. m1084 the probe (SPAWN >
      HORDE); next: his phone's FPS at 25 / 50 / 100, then the cheap crowd and vertex-animation instancing.
- [ ] **GEAR -- OPEN (spec only).** `GEAR.md`: rollerblades / jet blades and a wingsuit any hero can wear. Waiting on his models.
- [x] **m893 ARENA** (`?w=arena`): the stadium, SPAWN > WARBOSS > Brute Warboss / Skullback beams down, chest thump, armour
      flies off, KO slow-mo, beam out, CLEAR. This is the STAGE for the duel, not the duel.
- [ ] **DUEL -- OPEN.** Spec and DONE WHEN: `DUEL.md` (the triangle: shield beats shot, melee breaks shield, a shot
      interrupts a wind-up). Builds, in order:
  - [x] a. **m896** his SHIELD (stand-in mesh on `weapon_root_left` until his GLB) + shield state: blocks frontal bolts (spark, clang,
        no damage), raised at a shot after a difficulty-set reaction time; armour only from hits that land.
  - [x] b. **m898** the WIND-UP: a held, glowing, grunting raise before every swing; a bolt during it interrupts (stagger, shield
        down, armour off). He closes the distance fast enough to be a threat (a lunge / charge, not a 1 m/s walk).
  - [x] c. **m896/m898** the GUARD BREAK: Zap's charged hammer on a raised shield knocks it wide; a stagger window. His SHIELD BASH.
  - [x] d. **m898** size: `sizeK` damage + knockback both ways, hitstop on every blow, kickback on the attacker.
  - [x] e. **m898** EXPOSED / desperate phase + the finisher; EASY / MEDIUM / HARD on the arena menu.
  - [ ] f. tune on his phone until he signs it off.
- [ ] **WHITE BOX HUB**: the arena is the one sandbox world; a MODE switch on its menu (DUEL / TRANSFORM / ...), so
      every sandbox lives in one place. (Small; can ride with the DUEL's first build.)
- [ ] **THE DRAGON RIDE -- OPEN (his, Oct 28):** `DRAGON.md` -- his blue dragon in a zone of its own (KORAJIN > The Dragon Ride): armour,
      mount, ground riding, flying, fireballs, taming. m1610: the zone and armour pass 2 (CAPTURED / EVIL / BARE). All six boxes built by m1622 (zone/armour, mount, ground riding, flying, attacks, taming) -- each waits on his play and sign-off.
- [ ] **TRANSFORMATION -- OPEN** (m910: the wrapped proxies + the MORPH test in the arena, hick <-> Zap, BLEND / GROW) : `TRANSFORM.md` -- a civilian turns into his alien region by
      region from the wound (veins, bulge, green, armour bursts out, the cry); triggers: drink, alien syringe/beacon, Zap's
      stab/dart, debug toggle; a speed slider.
- [ ] **STUN ZAP -- OPEN** (m901: STUN toggle, x-ray strobe + daze, fitted skeleton on any rig; next: the DNA CLAW): `STUN.md` -- Zap's stun shot strobes the victim between his body and an x-ray
      SKELETON (one skeleton on the universal Mixamo rig, driven by the victim's pose), then he is stunned; the DNA CLAW
      clips a sample from a stunned body.
- [ ] WEAPON FEEL: big kickback that shoves the shooter, dramatic blaster sound, exaggerated impacts.
- [ ] DESTRUCTION: buses and cars whose shell panels come off (buildings already break).
- [ ] SCALE: grunts against a big guy.

## ASSETS (may run beside the open sandbox)
- [x] **m897** a procedural brute SHIELD (`blender-addons/pipeline/shield.py` -> `models/weapons/shield_brute.glb`, his
      convention: `weapon_root_left` -> `weapon_tip`). A generated one replaces it later.
- [x] **m899** the x-ray SKELETON for the stun zap (`models/characters/xray_skeleton.glb`): his image -> Tripo -> ARP rig ->
      Mixamo names + root. NO FINGER BONES (the finger AI found none: rigid hands). Not used in the game yet (STUN sandbox).
- [ ] a SKELETON PER SPECIES for the stun zap (his: "the Brutes will have a very distinctive skeleton, the Greys, the
      lizards"): Brute, Reptilian, Grey -- each into `ARENA.stun.files` (brute / reptile / grey). Human done (m899).
- [ ] ONE GEAR KIT PER FACTION (Brutes first: canisters, utility belt, shoulder pads, kneepads, boots) -- generated once,
      fitted to any body by bone (TRANSFORM.md "Future layers").
- [ ] the CEO boss (super transform test): human, alien armoured, alien bare -- Tripo, rig, armorfit, wraps, proxies (m911+).
- [ ] generated shields + weapons, **batched**: stack 3-4 weapon images in one picture and generate them in ONE Tripo task
      (he: "you can change the polygon slider so you can generate like four weapons at once"), then split the pieces
      apart in Blender (loose parts) and give each its mount bones. Saves credits.

- [ ] **THE UNIVERSAL MOTION TRANSFER TOOL** (his, m915: *"the universal Mixamo FK motion transfer tool -- basically we just
      had a library of animations to pull from. That would be so freaking amazing."*). One clip library, played on ANY
      Mixamo-named rig with its own proportions: per-bone FK rotation transfer in each rig's own bind frame (rest-to-rest
      delta, never a raw local copy -- Blender and ARP re-orient bones), hips height scaled by leg length, feet planted by
      a two-bone IK pass after. The game already does a narrow version of this (`mphBorrow` puts zap's 121 clips on the
      hick's 56 shared bones); the tool is that, general, offline in `blender-addons/pipeline` + a runtime path. Until then:
      his own Mixamo exports with each character's own clips (the CEO's "penguin" idle is the borrowed set on his body).
- [ ] a HAND-HELD shield model of his (board in front of the fist, a grip piece down into the hand) on `weapon_root_left` /
      `weapon_tip` / `gun_tip_left` -- m915 fits the procedural one there, so his drops in by file.

## CUT (dead code from the story, one system per pass, `npm run check` + a tkit boot after each)
- [ ] the POLICE / heat / stars system (`HEAT`, `COPS`, `copAI`, `heatHit`): switched OFF at m895 (`COPS.on = 0`), delete it.
- [ ] remove the PLAIN-skipped builders and their data (farm, islands, gorge, waterfront, ferry, factory, underneath,
      Pearl, ship, camp, carts, site...) and the quest/chapter/save system; then the toon/kit/alien/plaza/weirdport
      world branches; then their notes.
