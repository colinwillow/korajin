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

## THE WHIP-ONLY RULE (his, after trying it, Nov 5 2026: "What does the whip do that I can't already do with acrobatics?")
He can wall-run, double-jump, long-jump and chain air kicks/flips anywhere. So **every whip space must be provably impossible without the whip**.
A whip gap is sized against his **MAXIMUM** acrobatic reach (not the comfy 80%) plus a 10% margin, from the MOVE TABLE (`tools/moves.json`):

| his best without the whip | distance | height | row |
|---|---|---|---|
| zoom + double jump + 3 air kicks (needs ~30 m of runway for the zoom) | **36.8 m** | 5.0 m | `zoom_dbl_k3` (m1375) |
| run + double jump + 3 air kicks (no zoom; run 9 m/s on m2606) | **33.6 m** | 5.0 m | `dbl_k3` (re-read m2606) |
| high jump + 3 air kicks, FROM A STANDING START (no runway at all) | **22.6 m** | 6.7 m | `high_k3` (both) |
| high jump (backflip), full charge, no wall | -- | **6.7 m** | `high` |
| wall run UP, zoom-jumping into the face (hands on the lip) | -- | **13.4 m** | `wall_up_zoomjump` (m1375) |
| high bar launch (only where there is a bar) | 23.9 m | 14.8 m | `bar_far` / `bar_high` |

**So a whip space is one of these, and the doc of the room says which:**
1. **SPAN**: a gap of **>= 41 m** (36.8 + 10%) with nothing to land on in between -- crossed by a CHAIN of 3+ anchors (reach 14 m each).
   Under 41 m it must ALSO deny the run-up: a perch shorter than ~4 m on the near side (no zoom, no long run) makes the cap the standing
   **22.6 m**, so a short-perch span is whip-only from **>= 25 m**.
2. **HEIGHT**: a ledge **> 7.4 m** up with NO wall face under it (an overhang, a pillar top, an undercut lip) -- or **> 14.7 m** with a wall --
   reached by a ZIP anchor. (The sandbox's 10 m ledge with a wall under it is NOT whip-only: his wall run reaches ~10-13 m.)
3. **NO WALLS ALONG THE SPAN**: nothing he can side-run or wall-kick off within 5 m of the line (a side wall run carries 8 m and kicks 7.5 m).
4. **CEILINGS OF KNOTS OVER PITS**: knots hanging from a ceiling/gantry over a pit too wide for rule 1; a fall drops into the pit (a reset, not death).
5. **PULLS NO MOVE REPLACES**: a shield off an enemy, a lever out of reach (rule 2 heights), a crate dragged onto a plate, an enemy yanked off a ledge.

**The table is OLD and its harness has drifted** (re-run on m2606: half the rows fail or mislabel -- the gestures moved under it; the
speeds read run 9, sprint 1.1). Until `npm run moves` is fixed, size against the LARGER of the two readings above. Fixing the harness is DOCKET.

**Audit of the sandbox against the rule (m2607):** A lash lane, D pull yard, F combat -- fine (pulls / strikes). **B swing pit: FAILS** -- a 20 m
gap at 8 m (his run + double jump + kicks crosses 26-34 m). **E chain course: FAILS** -- 25 m, with a 12 m pillar to land on halfway. **C: half** --
the 16 m ledge is whip-only, the 10 m one is reachable by wall run. NEXT BUILD re-lays B and E to the rule (a >= 41 m pit under a knot gantry; the
chain course on short perches with no pillar and no walls) and gives C's 10 m ledge an overhang.

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
