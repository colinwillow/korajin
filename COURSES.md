# Courses -- a menu of test grounds that spawn in the arena (and double as "learn to play")

**Status: on the docket (Oct 25 2026, his idea). Not built, not immediate.** Each course is a sandbox under the WHOLE-PIECE RULE
(`CLAUDE.md`): its own DONE WHEN, ticked with evidence, his sign-off last.

## The idea (his)
*"The little testing ground... maybe there's a little menu, and when you click the menu it shows a sub menu, and you click them and it
spawns in the certain test ground... this could honestly be how you learn to play."*
- A **COURSES** button in the arena menu -> a sub-menu of modules -> picking one clears the floor and builds that course in the arena.
  One course at a time; picking another (or NONE) takes the last one away.
- Each course teaches ONE verb set by being the place you practise it. No words on screen explain it (show, don't label).
- The pieces are the GAME's pieces (the same colliders, ledges, ladders, cover the levels will use), so a course proves a piece is done.

## The modules (first two, his)
1. **COVER** -- the slide, slide-into-cover, move along it, vault, pop up and shoot. Built as `COVER.md` (part 1 is m1008; its three
   cinderblock pillars move into this course when the menu exists).
2. **GYM** -- ladders, ledges, monkey bars, and a gymnastics **HIGH BAR** (the horizontal bar): jump to it, catch it, swing, a full
   360 **giant swing** around it, and let go at the top of the swing into a flip (the **release** / **dismount**). The ledge grab and
   ladders exist from Weirdport (`LEDGE`, `KCLIMB`) and are the place to start; the monkey bars (hand over hand along a bar) and the
   high bar are new. Needs: the library's hang / shimmy / monkey-bar / swing clips through the Forge, a pendulum for the swing (the
   body's angle about the bar as the state, gravity and a pump on the stick), the release carrying the swing's speed off the bar.

## GYM part 1 -- the HIGH BAR (m1034, scaffold)
SPAWN > HIGH BAR puts a bar (2.55 m, 2.6 m wide) between you and the spawn. Jump into it: the hands catch it. **Hold the right pad** and he
pumps -- each swing bigger -- until he goes over the top into giant swings; **let go** and he flies off along the swing at its speed, turning
until he is upright for the landing. The left stick pushed along his facing pumps too; a tap drops him. The swing is a pendulum (`HBAR`);
the pose is the library's "Hanging Idle (gently swaying)" turned about the bar. **The pump motion itself is procedural / absent -- his own
pump clip goes in `HBAR.clips.pump`.** Later in the GYM: monkey bars (the upside-down ladder), the balance beam (his: there is a beam-walk
clip in the library), ledges and ladders.

### DONE WHEN (high bar)
- [ ] Catch the bar from a jump, every hero.
- [ ] Hold = pump, pump, over the top, giant swings; let go = fly off the way the swing goes, land upright.
- [ ] His pump clip in.
- [ ] The flight: launched big, continuous tucked flips (her tuck), opening to land upright; circling the stick spins him further (m1038).
- [ ] **He played it on his phone and signed it off.**

## GYM part 2 -- the BALANCE BEAM (m1037)
SPAWN > BALANCE BEAM: a 10 cm beam, 7 m long, 1 m up, a platform at each end. Walk (or jump) onto it: he walks only along it, arms out, and
**balances** -- the lean grows by itself and wobbles more the faster he goes; push the left stick AGAINST the lean (across the beam) to bring
it back. Too far and he slips off that side; a tap jumps off; the ends step onto the platforms. Clips: the library's "Catwalk Walk Forward --
Legs Crossing", "Teeter", "Wobbling" (and "Edge Slip" baked for the fall).

### DONE WHEN (beam)
- [ ] On from a platform or a jump, along it, off the end / jump off / slip off a side -- every hero.
- [ ] The balance is fun: readable lean, a correction that feels like his, a fall that is fair.
- [ ] **He played it on his phone and signed it off.**

## THE TESTING GROUND (Oct 26 2026, his) -- the arena is where you boot in and learn the game
*"This is the testing ground... you can boot different programs from here... we already have opening doors... this is where you learn to
play... you go through the doors and there's a whole course... you end up back where you are."*
- **The arena IS the hub.** You beam in on the floor. Each DOOR (the tunnels the rivals already walk out of, m973) boots a MODULE: the
  door lights, opens, and the module's course is built through it. You run it and it brings you back onto the arena floor. No words:
  a lit door is the invitation, a gate lighting as you pass is the tick.
- **A module is a short course of STATIONS, built one station per build**, each made of pieces that already exist and are signed off
  (or are being signed off) as their own sandboxes -- the WHOLE-PIECE RULE still holds: a station cannot use a piece that is not done.
- **Modules (his):** ACROBATICS (locomotion, wall running, flips), FIGHT (swing, guard, ricochet the turret's rockets, break cover, the
  spider bots), later PARKOUR momentum (`PARKOUR.md`), COVER, GYM.

### ACROBATICS -- REDONE AS BLOCKS (Oct 27, his correction: *"the scale is tiny... the gaps are not far apart at all... it should be
progressive... use the full length and height of their jump... like Minecraft, just blocks, modular... one piece, then check in"*)
m1078-81's stations (gaps of 2.5-4 m inside a 7.5 m jump, squeezed through the arena door) are deleted. The course is now a WAREHOUSE far
off the arena (`COURSE.at`), one long hall per BLOCK, platforms floating 10 m over its floor; a fall to the floor = the last checkpoint.
Each block teaches ONE ability and asks for nearly ALL of it; the next block assumes the last. One block per build, his look between.

**His reach, measured in the real loop (m1082) -- every block is sized from these, never by eye:**
| ability | number |
|---|---|
| run | 7.2 m/s, reached 4.7 m from standing; a landing drops him to ~2.5 m/s for .3 s -> 9-10 m of runway before a hard jump |
| jump | apex 2.81 m; 7.5 m on the flat at full speed; ~9.1 m dropping 2.5 m; a 2.2 m rise lands up to ~5.7 m out |
| double jump | apex 5.19 m, ~12.5 m gap at a sprint (m451) |
| long jump (let go of the sprint hold) | ~14 m (13.5 m/s along, 10.5 up) |
| wall run | 8.6 m along, sinks 1.1 m; a wall kick +1.7 m |

**The blocks (in order):**
1. **JUMP** (m1082, built): gaps 5.5 / 6.5 / 7.0, a step up, a 4.5 m gap rising 2.2, an 8.5 m gap dropping 2.5, a MOVING platform you time.
2. **DOUBLE JUMP**: gaps 9-12, ledges 4-5 m up, the double used to correct a short jump.
3. **LONG JUMP**: sprint runways into 12-14 m gaps.
4. **MOVERS**: lifts, sliders, a platform that carries you past a wall -- timing with everything above.
5. **WALL RUN**: gaps only a wall run crosses (9+ m), wall run -> double jump chains.
6. **WALL JUMP**: a chimney 8-10 m up.
7. **BEAM**: tightrope over the void, then a moving one.
8. **HIGH BAR**: a swing and release across a 15+ m gap.
9. **SPEED** (needs building first, `PARKOUR.md`): the charge-up run, a quarter pipe, the loop.
Finishing a block will open the next one's door (from block 2 on); for now block 1's exit beams you home.

### FIGHT -- the second module (sketch)
Swing at a dummy -> guard a dummy's swing -> ricochet a turret's rocket back into it -> break a half wall -> a pack of SPIDER BOTS.

### SPIDER BOTS (new, his) -- small six-legged cyber spiders that pour out of a hatch; you beat them up
Procedural (no rig needed): a body and six two-segment legs placed by IK on the floor with an alternating tripod gait, so they scuttle
over anything. A swarm of 4-8: they surround, leap at you, latch, and pop apart in pieces when hit. Same style as the m1077 turret
(lacquer, gold, a cyan eye). Its own spec + DONE WHEN.

### WEAPONS -- what you carry -- **DECIDED (Oct 26): A, the katana + one pick-up slot.**
The three ways it could go:
- **A. The katana is always yours; ONE pick-up slot on top** (the rocket launcher, later others) with limited ammo -- it goes away when
  empty. Pick-ups sit in the courses and the arena. *Proposed: it is what he described ("you pick it up... a certain amount, then it goes
  away"), it keeps the sword the heart of the game, and it teaches itself.*
- **B. Two fixed slots, one melee + one ballistic**, swap any time.
- **C. Anything in your hands**, a pick-up replaces what you hold.
Under A the blaster, the club and the old slots leave the weapon wheel (kept on TOOLS for testing); the rocket launcher is the first
pick-up.

### DONE WHEN (the testing ground)
- [ ] A door on the arena floor boots ACROBATICS; the course builds through it; finishing returns you to the floor. (m1078: the boot pad
      in front of door 1 (+X) / SPAWN > ACROBATICS; station 1 the gap jump; gates, fall-back, exit home -- measured, unsigned.)
- [ ] Each ACROBATICS station in, one per build, every piece in it already signed off.
- [ ] The grind rail, the spider bots and the weapon model each have their own spec, built and signed off before they go in a course.
- [ ] **He ran the whole ACROBATICS course on his phone and signed it off.**

## Later candidates (not asked for yet)
Parkour (vault, wall run, wall jump), the sword's dummies, shooting range, the skate park.

## DONE WHEN (the menu itself)
- [ ] COURSES in the arena menu, a sub-menu, picking one builds it and takes the last one away; NONE clears it.
- [ ] COVER and GYM each have their own spec with their own DONE WHEN.
- [ ] **He played it on his phone and signed it off.**
