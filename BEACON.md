# THE FIRST BEACON -- Level 1 v2 (his, Oct 28 2026)

KORAJIN > **Level 1 v2 -- The First Beacon** (`?w=forge&lvl=beacon`). The canyon floor of the Red Hollows up to the enemy's torch tower.
**References:** `images/korajin/ref/beacon_grid.jpg` (his THIRD sheet, the first with a metre grid: the layout is read off it), `beacon_sheet.jpg` and `beacon_plan.jpg` (the first two, mood), the blueprint draft
artifact, LEVELDESIGN.md (the five layers, omakase, THE BLUEPRINT), LEVELGRID.md (the MOVE TABLE). He will block it out in Cinema 4D later; until
then the level is GENERATED from `BEACON.plan` in index.html.

## How it is built
- `BEACON.plan` is the blueprint: STATIONS (`st`, a mesa solid to the floor, a ladder up its side, a sign) and RUNS (`aim` + a list of chunks).
- The chunks are the library's (`CHUNKS`, sized from the move table at 92% of comfy) plus `BCH`: `hop` (3.5 m), `walk:L`, `chim:H` (a chimney of any height).
- `beaconBuild` chains them: each piece starts at the last one's out port, heading along the axis that points best at the run's aim, with a corner
  pad where it turns. **So every gap and climb is makeable by construction, and a station lands wherever its run arrives.**
- Verbs on this level: run, jump, double jump, ledge catch, and (served) the WALL JUMP. No weapon.

## DONE WHEN (layer 1, THE RUN) -- each ticked with evidence in a NOTES entry; the last box is his sign-off on the phone
- [x] the route exists end to end from the blueprint (m1549)
- [x] **on his sheet's layout and heights (m1559):** stations at the grid sheet's (x, z) x1.5 (its metres are ~2/3 of what the moves need), runs FITTED between them, heights exactly the sheet's: S 0 | A 9 | B 4 | C 24 | D 28 | Z 14 | brazier 39.6. No run SHORT
- [x] every piece CHECKED against the move table off the built boxes (m1576): 63 consecutive surface pairs, gap and rise each matched to a move -- walk 36, run jump 10, double 2, ledge 4, ledge (double) 2, drop 2, chimney 6, zip 1 -- 0 BAD. Proven to fail: a hop widened to 11 m gives 9 BAD
- [ ] ~~every piece WALKED by scripted inputs~~ **PARKED (m1582):** a bot driving the pads through every chimney, ledge and zip is a large, fragile rig, and CLAUDE.md's verification budget says HE tests the game. Built only if he asks; his walk on the phone is the test
- [x] the spine crosses itself (m1555): the rooftops run C -> D back WEST over the lantern ruin A (23-27 m over its 10.9 top), and the zips pass the sunken court B (`go:E/W/N/S` steering in the plan). m1580: every station sees the NEXT one (a ray from its eye to the next station's banner top): S>A A>B B>C C>D D>Z yes; Z>T is the foot of the finale climb's face, hidden by it on purpose
- [x] the tower seen from every station (m1566): a ray from each station's eye to the beacon, against every box -- S A B C D yes; Z (the zip landing) is the foot of the finale climb, which hides it on purpose. The beacon burns MINT with a 16 m column of light (ENEMY_STYLE), mesas stay under every station's sight line
- [x] verticality and spread (m1576): stations on seven heights 0 / 4 / 9 / 14 / 24 / 28 / 39.6 over a 190 x 150 m canyon, the route crossing itself; from OUTSIDE the canyon walls hide the route (a wide render shows only walls and the beacon), which is the point of a canyon
- [x] a canyon to stand in (m1555, part 1; m1566: STRATA, below): 222 stepped sandstone mesas on an 8 m lattice, never within 8 m of the route or under a zip; near ones are shoulders below the route's height, the outer ring (wider than the lattice) closes into canyon WALLS 26-50 m. m1566: the rock is a strata shader (`beaconRock`: banded reds wobbling with the plan, dark seams, water streaks, no texture so no sponge), and the route's climbing faces are a pale cream rock, a cue you can read from across the canyon. m1578: CARVED -- every mesa tier is a rounded, chamfered, 8%-tapered rock (`beaconCarve`), so the canyon reads as hoodoos, not crates. Colliders are still the full boxes (the taper means a mesa's top edge holds him up to ~.4 m past the visible lip -- the mesas sit below and beside the route, so nothing on the route stands there)
- [~] the wall jump in four beats, BUILT (m1573), each with a sign: 1 TEACH a 3 m chimney with a floor (one kick); 2 DEVELOP 6 m with a floor (2 kicks); 3 TWIST `chimjump` -- no floor, jump 4 m INTO the chimney and catch it in the air (a run jump's first catch is 2.82 m, measured); 4 CONCLUDE 7 m (3 kicks) onto the shrine. +20 exactly. **Feel: his to judge on the phone**
- [x] fail forward (m1562): every walkway over 2 m has a ladder from the floor within 16 m (`ladderR`); 12 added by the audit, 18 in all
- [x] headroom (m1562): the audit checks the 2.2 m over every walking surface -- found the drop into the court and the wall-jump climb sharing one line north of B, and the finale chimney's wall on the zip landing's edge; both re-routed, now 0
- [x] rests and checkpoints (m1569): every station but the brazier has a stone bench and a lantern on a post; standing on it lights the lantern mint (chime, burst) and makes it the checkpoint; leaving the canyon (past its walls, or under the floor) returns him to the last one lit. Measured headless: S lit at spawn, the rest unlit, cp = S. Not yet exercised by walking out
- [ ] **his sign-off on his phone** -- LAYER 1 IS READY FOR IT (m1582). The loop stopped here on purpose: nothing more is built on layer 1 until he has walked it

## Layers 2-5 (not before layer 1 is signed)
2 the lever at A (a bridge home), the candle at C (a lift down to B) · 3 three dormant terracotta sentries with 6 m zones · 4 the canyon's look ·
5 the tower's guardian sweeps, pour the Jinra, the beacon turns mint.
