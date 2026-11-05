# THE VINE WHIP -- a sandbox (the Forest Temple's item; KORAJIN > Vine Whip `?w=forge&zone=whip`)

## Vision (his pick, Nov 5 2026: "the vine whip -- only if it's done well")
A living Jinra vine he carries coiled at his hip. It LASHES out fast and readable, a real rope that curls through the air and SNAPS taut; it
latches onto glowing anchors (knots in roots, Jinra flowers, bronze rings) to SWING with momentum, to ZIP himself across a gap, and to PULL the
world toward him: crates, levers, shields off enemies, small enemies into his reach. In a fight it is a lash and a grab-and-throw.
Under the WHOLE-PIECE RULE it is finished HERE, in a white box, before the Forest Temple depends on it. If it cannot be made to feel good, we fall
back to the seed arrow (FOREST_TEMPLE.md keeps it as a later upgrade / another temple's item).

## What "done well" means (his list, via main)
1. **The lash**: fast (out in ~0.12 s), readable from the phone's distance; a VERLET vine (16-24 points) that leaves his hand with a curl,
   whips out along an arc, SNAPS straight at the hit (a crack, a spark of Jinra), and falls slack / recoils when released. Leaf buds along it.
2. **The lock**: the target a flick will take glows BEFORE the flick (the grapple's `ropeHint` idiom): anchors pulse, objects get a ring.
3. **SWING** from anchors: a pendulum with momentum (gravity, the vine only pulls), the left stick pumps; release (tap) into a FLIP with the boost;
   flick again mid-swing at the next anchor to CHAIN swings without touching ground.
4. **ZIP / pull-to**: a flick at a ZIP anchor (or UP at any anchor while grounded) reels him to it fast, landing on the ledge beside it.
5. **PULL objects**: crates slide toward him (onto plates), levers flip, a shield is ripped off a shielded enemy, a light enemy is yanked into reach.
6. **Combat**: with no anchor in the cone, the flick is a LASH strike (6 m, fast, a chain with the sword); a yanked small enemy can be THROWN
   (the next flick sends it the way you flick).

## THE WHIP-ONLY RULE (his, Nov 5 2026: "What does the whip do that I can't already do with acrobatics?" -- and, measuring it: "I can jump,
## dash after the jump, double jump, dash, wall run, jump off the wall run and dash dash again, so it's usually about DOUBLE what you think")
**Every whip space must be provably impossible without the whip, against his FULL AIR CHAINS** -- measured with the shipped frame by
`npm run reach` (m-reach: `frameBody` on a fake clock; the jump / double jump are the jump request, the AIR DASH is the flying kick in the air
(`meleeGo`, up to `AIRK.max` 3 an airtime), the wall run the shipped catch, the wall jump the jump request on the wall). Run speed 9 m/s.

| chain (each step as soon as it can) | across | up | air |
|---|---|---|---|
| run + jump | 14.0 m | 2.7 m | 1.0 s |
| run + jump + double jump | 23.0 m | 5.0 m | 1.7 s |
| run + jump + dash + double jump + dash | 29.8 m | 3.3 m | 2.6 s |
| **run + jump + dash + double jump + dash + dash -- the best WITHOUT a wall** | **33.7 m** | 3.3 m | 2.9 s |
| run + jump + wall run (0.5 s) + wall jump + double + dash x3 | 40.7 m | 8.4 m | 4.1 s |
| the same, riding the wall 1.5 s | 51.1 m | 9.3 m | 5.2 s |
| **the same, riding the wall 2.5 s (a 48 m wall)** | **58.2 m** | 6.0 m | 5.8 s |
| run straight into a tall face: the run UP + the wall jump | -- | **11.4 m** (feet) | -- |
| high jump (backflip, full charge; spends the double) | -- | **6.7 m** | -- |
(The ZOOM start is retired (`ZOOM.on` 0, m1813), so it is not a start here. A wall roughly DOUBLES what he can cross -- his word.)

**THE LINE = the measured max + 25%.** And distance alone is not trusted -- he finds chains -- so **every whip space is STRUCTURAL**:
1. **SPAN with NOTHING to run, kick or land on**: no wall within 5 m of the line, no pillar, no ledge, AND longer than **42 m** (33.7 + 25%).
   Off a perch too short to reach run speed (<= 4 m) the start is a standing one -- but still size it at 42 m (he can bring speed from behind).
2. **A CEILING or a HAZARD over the gap** that kills the high arc: thorns or a rot cloud from ~3 m above the take-off, so the double jump and the
   dashes have no room -- only a knot swing UNDER it works.
3. **HEIGHT with no wall under it**: a ledge **> 8.4 m** up (6.7 + 25%) on an overhang, a pillar top or an undercut lip -> a ZIP anchor. With a wall
   under it, **> 17 m** (his hands on an 11.4 m run-up + a wall jump and a double jump, + 25%) -- or better, an overhang.
4. **ANCHORS OVER A PIT whose far side is a SHEER WALL too tall for the vertical chain** (> 17 m) -- the swing lands on its top.
5. **PULLS NO MOVE REPLACES**: a lever behind a grate, a dam to drag down, a shield off an enemy, crates onto plates, an enemy yanked off a ledge.
Every room that needs the whip states which of these makes it whip-only.

**Audit of the sandbox (m-reach):** A lash lane, D pull yard, F combat -- fine (pulls / strikes). **B swing pit: FAILS** (a 20 m gap). **E chain
course: FAILS** (25 m with a pillar). **C: FAILS both ledges now** (10 m and 16 m both have a wall under them: under 17 m). The re-lay is a build.
**A's 9 m wall-run gap in the temple is far inside his reach -- kept as a skill gap (m2637).**

## Controls (on the existing map: LEFT pad = the body, RIGHT pad = the verb)
| | left | right (whip out) |
|---|---|---|
| hold | move / pump the swing | (free: later a CHARGED lash) |
| flick | dodges, as now | **LASH** in the flicked direction: latch the lit target in the cone (anchor -> swing / zip, object -> pull, enemy -> strike or yank); nothing lit -> a lash strike |
| tap | jump | jump; **while swinging: let go** (boost + flip) |
| flick while swinging | -- | at the next lit anchor: **chain** (the vine lets go and lashes there) |
The weapon SLOT and its ring segment come from the combat worker's ring layout (the QUICK DRAW rings, UI_RINGS.md); coordinated, not forked.

## How it is built (SCENE_COMPANION.md: data-first)
- `WHIP` (between `SC_WHIP` markers): the tuning (reach 14 m, cone, lash time, verlet points / stiffness, swing pump / boost, zip speed, pull
  force per object mass), and the anchor KINDS (knot, flower, ring, zip). A PURE `whipVine` (verlet + its draw) and `whipStep` glue.
- Anchors and pullables are ROWS (`whipAnchorAdd({ id, at, kind })`, `whipPullAdd({ id, mesh, mass, kind })`) that any zone can place -- the
  temple places its own; the sandbox is a table of stations.
- The swing reuses the grapple's pendulum (GRING / `ropeThrow`'s physics), fed by the vine instead of a rope throw.

## THE SANDBOX (white box, stations in a ring round a centre pad -- sacred geometry: one axis, mirrored stations)
A **LASH LANE** (dummies + targets at 3 / 6 / 9 m) | B **SWING PIT** (three knots over an 8 m-deep pit, chain them) | C **ZIP WALL** (anchors on
10 m and 16 m ledges) | D **PULL YARD** (crates to pull onto plates, a lever 6 m up, a shielded dummy) | E **CHAIN COURSE** (swing -> zip -> swing
over a 30 m gap, a fall lands back at the start) | F **COMBAT** (`combatDrop` small enemies: yank + throw, shields off).

## Passes (one build each)
1. The doc + the sandbox room + anchors / pullables as rows (white box).
2. THE LASH: the verlet vine, the flick, the lock glow, the snap (sound + spark), the strike.
3. SWING + CHAIN + the release flip (on the grapple's pendulum).
4. ZIP / pull-to.
5. PULL: crates, levers, shields; YANK + THROW small enemies.
6. Feel pass: timing, camera, sounds, the GOOP / Jinra FX on the lash, night glow on the vine.

## DONE WHEN
- [ ] **Every whip space passes THE WHIP-ONLY RULE** (sized against the move table's max + 10%; the room's doc says which rule it uses).
- [ ] The lash reads on the phone: fast, curls, snaps; a lock glow before every flick (pass 2).
- [ ] Swinging feels great: momentum, pump, a flip on release, chains of 3+ anchors without touching ground (pass 3).
- [ ] Zip lands him cleanly on a ledge every time (pass 4).
- [ ] Pulls: crates onto plates, levers, shields off, small enemies yanked and thrown (pass 5).
- [ ] It works in a fight next to the sword without fighting it for the right pad (pass 5-6).
- [ ] Phone-fast: the vine is one draw call; no hitch on the first lash.
- [ ] **His sign-off, on his phone.** Only then does the Forest Temple's flow build on it.
