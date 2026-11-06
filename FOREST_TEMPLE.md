# THE FOREST TEMPLE -- the real temple, below (KORAJIN > Forest Temple Kit `?w=forge&zone=ftkit`; chamber 1 `?w=forge&zone=ftemple`)

## Vision (his words, Nov 4 2026, WORLD_PLAN.md section 2)
*"The above-ground part is the tip of the iceberg -- the door. The real temple is massive, inside, underground."*

The Forest Domed Temple (DOMET, `?w=forge&zone=dometemple`, m2144; its surroundings are another worker's) is only the DOOR. Through it, and down,
is a vast overgrown underground temple: giant tree roots driven through the cut stone from the forest above, glowing Jinra moss in every joint,
shafts of daylight falling from cracks far overhead, waterfalls pouring out of broken walls into black pools, carved guardians watching from
the walls -- and, at the bottom, the boss who holds the forest's JINRA STONE. Everything climbs: storeys, rims, galleries and drops (VERTICALITY).

## THE LOOK: ROCK-CUT (his direction, Nov 4 2026 -- the KAILASA temple at Ellora, Cave 16)
Carved top-down out of ONE living rock: nothing looks built. Inspiration, not a copy, and none of its real deities or sacred iconography -- our own
guardians and Jinra motifs. So: chambers read as CUT INTO the rock (cave halls with rock ceilings, light falling in through cut openings); massive
SQUARE carved pillars (a square foot, a deep-relief band, an octagonal middle, a fluted pot capital, a bracket capital into the ceiling) in
hypostyle rows; multi-storey rock-cut galleries (the rims); deep relief panels and friezes everywhere (normal-mapped from the carving itself, plus
modelled tiers at the foot and the cornice of every face); tool-marked weathered stone with NO masonry joints (`ft_rock`, `ft_rockfloor`); stairs
and bridges carved from the same rock. Kailasa's circulation for later chambers: a courtyard cut down into the rock with the shrine left standing
in it, ringed by multi-storey cloister galleries, joined by a rock bridge.

## SACRED GEOMETRY (his standing rule, WORLD_PLAN 11)
Every chamber and the sequence between them is laid on AXES with symmetry, processional avenues and concentric / radial patterns -- natural at
eye level, but a top-down render reveals the plan (`npm run ftstrip plan --set=in`: orthographic, cut above 25.5 m). The interior is ONE axis,
x = 0, north-south: the hall's avenue (eight pillars in mirrored pairs, paired braziers / panels / pots) -> the well (a circle; a rosette of
three rings and eight spokes at its foot) -> the corridor's avenue -> the arch -> the room's avenue (four mirrored pillars, the shaft and a
12-spoke rosette at its centre, the ruins mirrored) -> the door on the far wall. The acrobatic ROUTE climbs round that axis (east, north,
west, south): the plan is symmetric, the climb spirals. Later chambers keep to the axis or branch from it at right angles.

## HOW TO PLAY-TEST THE FOREST TEMPLE (DEV PLACES > THE FOREST, or the KORAJIN menu)
1. **Forest Temple: FULL RUN (from the knoll)** -- the real game, your real save: the knoll -> down to the domed temple -> the door ritual ->
   into the cella -> step on the round LIFT -> it sinks into the entry hall -> down the well's ledges.
2. **Forest Temple: the Well (hub)** -- you stand on the well floor: the six doors round you, the six SHARD SOCKETS, the chip up top.
3. **Room A -- Acrobatic Hall** (the old "Acrobatic Room": the same room): climb to the east rim under the archers, wall-run the 9 m gap to the gallery,
   win the scrap, the two blocks up to the 12 m rim, monkey bars, tightrope, shoot the arrow switch, ride the slab, high bar, the button at the
   top, zip down, the last fight -> the CHEST in the room behind the door (the KEY + shard I).
4. **Room B -- Root Gallery** (you have the key): open the B door (west, at the well's foot); watch the three reliefs' EYES light in an order; shoot
   the three switches with the bow in that order -> the chest (shard II) -> a few seconds later the floor CRACKS open.
5. **Room C -- Root Heart / Thornback**: you land in the arena under the crack; the THORNBACK -> the chest (THE VINE WHIP + shard III) -> the only
   way out: flick the whip at the lit KNOTS over the pit (swing, chain), then the ZIP knot up through the slot into B.
6. **Room D -- Fall Gallery** (on the D sill, 12 m up the north wall, with the whip): lash + pull the door's root seal -> the wave -> pull the ROOT DAM
   at the trough's head (the well's waterfall stops, its pool drains) -> turn the CRANK -> the alcove's chest (shard IV).
7. **Room E -- Sunken Court** (at the E door, east, with the whip): pull it open -> from the near perch swing the SIX KNOTS under the thorn canopy across
   the 46 m chasm (a jump hits the thorns; the walls will not take a wall run) -> the squad on the far perch -> lash + pull the two LEVERS high on
   the far wall, and drag the two CRATES onto the two glowing PLATES with the whip -> the iron gate rises -> the chest (shard V).
8. **Room F -- The Shrine** (east, 3 m up, with the whip): pull the gate open -> the corridor -> the rim over the core -> drop to the floor or jump to
   L2 -> each ledge is ~9 m over the last (no jump reaches it, the walls will not take a wall run): flick the whip at the ZIP knot over the lip ->
   the altar's chest (shard VI) -> the guardians wake.
9. **The Seal + the stair (all six shards)** -- you stand on the well floor with all six shards: walk onto the seal at the centre (the hexagram
   is fully lit) -> THE SEAL OPENS -> go down the spiral stair inside the trunk -> out of the doorway at its foot into the ROOT HALL (empty until the boss).
10. **The Hollow Banyan (boss)** -- you stand in the root hall: it SLAMS its root-hand where the ring is (step off it) -> the hand sticks: WHIP + PULL the
   lit knot -> the arm lies flat: RUN UP it to the shoulder -> pull a PLATE off the red heart (x3, it gets faster) -> STRIKE the bare heart (3 hits) -> it TEARS ITS HEART FREE: swing the
   knots under the ceiling and strike it in the air (3 hits; thorns rain on the floor) -> THE FLOOR FLOODS: stand on its stuck hand, pull the arm flat,
   strike the heart (3 hits) -> the Jinra Stone, the stolen one -> step into the trunk: the GEYSER carries you up. Hug the trunk and it sweeps you off.
11. **Temple kit (pieces)** -- every building piece laid out, for looking at.
Each Room entry lands you at that room's door with everything before it done (`&grant=1`: in memory only -- your real save is never touched;
the chip says TEST). The chip: `FT: shards n/6 · whip ✓ · rooms A B C D E F` (a lit letter = that room's shard is yours).

## OUTSIDE <-> INSIDE: THE TEMPLE LIFT (his, Nov 5 2026: "a loading screen ... one-way ... the door's inside built twice and they don't match")
**Measured (`npm run zonebudget`, the game camera, shadows included):** outside (`dometemple`, at the arrival) **92 draws / 526k tris**; inside
(`ftemple`) **96 / 154k**; one merged scene would hold ~565k tris -- twice the phone's 280k -- and every interior system (boxes, traversal, foes,
the triangle collider's rect) is written in the interior's own coordinates. **So: two zones, one HONEST seam -- the LIFT.** (Both zones are
also over 70 draws on their own: a budget pass for each is owed.)
- **One builder, both sides** (`ftLiftMake`, SC_FTLIFT): a round platform (carved stone, a bronze rim, the weighted plate with its glyph ring),
  six carved posts and a lintel ring, and its SHAFT (below the floor outside, up to the ceiling inside).
- **Outside:** the door ritual OPENS the door (no load); he walks into the cella; the lift stands where the pedestal was (the orb floats over it).
  Step on -> the glyphs light, a rumble, the platform SINKS (the lens following); in the dark of the shaft the screen fades and the inside loads.
- **Inside:** he arrives STILL SINKING -- the same lift, at the entry hall's end, coming down its shaft out of the dark -- and lands at 24 m.
  The old inner door (`h_door`, a second mismatched copy of the outside's) and the ASCEND chevron are gone; the wall closes.
- **Back:** step on the hall's lift -> it RISES, fades, and he arrives in the cella rising up out of the floor, on the same platform. Two-way.

## THE PLANNING SHEET (his structure, Nov 5 2026 -- TEMPLE_TEMPLATE.md) -- `docs/temples/forest_sheet.png`, `npm run templesheet forest`
**THE WELL is the hub you land in; six lettered chambers A-F on a hexagon round it (mirrored W / E, on the N-S axis); each pays ONE JINRA SHARD;
six shards light the SEAL on the well floor and open the stair to the boss beneath it.** The 12 rooms of THE FLOW below are kept, folded into it:
| sheet | was (THE FLOW) | type | pays |
|---|---|---|---|
| 0 ENTRY HALL | 1 | rest | checkpoint |
| H THE WELL | 2 (+ the seal: 6 sockets under the pool) | hub | -- |
| A ACROBATIC HALL (built) | 3 | acrobatic + battle | SMALL KEY + SHARD I |
| B ROOT GALLERY | 4 | puzzle | SHARD II + the crack down |
| C ROOT HEART + NURSERY | 5 + 6 (mid-boss, then the teach) | battle + rest | THE VINE WHIP + SHARD III |
| D FALL GALLERY | 9 (the twist: pull the dam, the pool drains) | puzzle | SHARD IV |
| E SUNKEN COURT | 7 + 8 (the court + the terrace test) | acrobatic + battle | SHARD V |
| F THE SHRINE | 10 + 11 (the climb + the statue gauntlet out) | puzzle + acrobatic + battle | SHARD VI |
| X THE HOLLOW BANYAN | 12 | boss | the JINRA STONE |
**BUILD ORDER ON THE SHEET (his go, Nov 5: "start building the forest temple"; one build per room, each finished before the next):**
1. [x] **THE HUB** (m-hub): the well's doorways (B, E, F at the floor; D on a 12 m sill under the hall), six SHARD SOCKETS on the well floor,
   the shard counter on the HUD, A's clear pays SHARD I + the SMALL KEY; D / E / F are WHIP GATES (lash + pull), B the key door -- placeholders
   until each chamber's build and the Interactions Kit's heavy door.
2. [x] A: the LADDER -> two step blocks (1.5, 3.0 m) under the upper rim's lip; the 9 m wall-run gap KEPT (measured in reach, m2637); a CHEST
   (IKIT `chest`, `onDone`) in the antechamber pays the SMALL KEY + SHARD I.
3. [x] B: the ROOT GALLERY (the key door opens; the reliefs' eyes give the ORDER, three arrow switches; the chest pays SHARD II). Still open in B:
   the floor CRACK down to C (with C's build), push-blocks onto plates (no push mechanic yet), its own enemy roster (the forest wave stands in). 4. [x] C (see NOTES). 5. [x] D: the FALL GALLERY (the whip gate opens on a pull; pull the ROOT DAM -> the trough runs dry, the waterfall stops, the well's pool drains;
   the crank raises the alcove gate -> the chest: SHARD IV). 6. [x] E: the SUNKEN COURT, part 1 (the whip gate; a 46 m chasm, thorn walls that refuse a wall run, a thorn canopy over it, six knots;
   the far perch: the squad, the chest = SHARD V). [x] Part 2: the chest's niche behind an iron gate -- two levers 9 m up (whip pulls) + two crates dragged onto plates (whip). Open: the cloister detail. 7. [x] F: the SHRINE (the whip gate; a hexagonal core whose walls refuse a wall run; ledges 8.8 / 9.0 / 9.2 m apart (his best 8.6), a zip anchor over each; the altar chest = SHARD VI, then the guardians wake). Open: the counterweights, the stone guardians. 8. [x] the SEAL (six shards: the petals slide away) + the spiral STAIR (82 treads at .317, down inside the Banyan's trunk) + THE ROOT HALL's shell (r 15, floor -26). 9. [x] THE HOLLOW BANYAN: phase 1 (slam, the stuck hand pulled flat, up the arm, three plates, the bare heart), phase 2 (the heart in the roots: swing eight knots to it), phase 3 (the flood: the hand an island, the arm the way up); the Jinra Stone, the stolen one, the geyser out.
What changed: the CHALICE is gone (the six shards are the boss key; the shrine pays a shard); D, E and F are open in ANY order once he has the
whip (each behind a whip gate at the well), and each states its WHIP-ONLY rule (C: a knot ceiling over a pit; D: a pull no move replaces;
E: a 44 m span off 3 m perches; F: 18 m ledges with no wall under them). Plan metres are the sheet's (hub at 0,0), not yet the zone's.

## THE FLOW -- the design pass (his ask via main, Nov 5: "this is the meat of the game; make the temple FUN")
Built on ZELDA_STRUCTURE.md Part 2 (hub; first half on what you walked in with; the mini-boss guards the ITEM; the item TAUGHT / TESTED / TWISTED;
the loop-back; the boss key; the boss beaten WITH the item) and TEMPLE_ROUTES.md (**no ladders on a route**; every gap sized from `tools/moves.json`
at 80% "comfy"; a rest and a checkpoint after every stage; every fall lands somewhere he can climb back from). Layout guides, not copies: Mark Brown's
*Boss Keys* graphs (one locked door open at a time; hubs that make a line feel like a web), the concentric MANDALA plans of Borobudur / Angkor
(the centre is the holiest and the deepest; you circle it as you descend), and Kailasa (a court cut DOWN into the rock with the shrine left standing).
Diagrams (`npm run ftplan` writes them from its table): `docs/forest_temple/ftemple_graph.png` (key / lock), `ftemple_section.png` (W-E and S-N
sections, four levels), `ftemple_plan.png` (the mandala), `ftemple_pacing.png`.

### The idea in one line
**The temple is a mandala you spiral DOWN into: the WELL is the hub at its centre, four wings sit on the cardinal axes, and the forest's power --
the VINE WHIP -- is what pulls down the dam, drains the water and opens the floor to the boss beneath the well.**

### The new ability: THE VINE WHIP (his pick, Nov 5: "only if it's done well" -- built FIRST as its own sandbox, VINEWHIP.md)
A living Jinra vine: it LASHES (a fast verlet vine that curls and snaps), latches glowing ANCHORS (root knots, Jinra flowers, bronze rings) to
SWING and chain, ZIPS him to a ledge, and PULLS the world: crates, levers, shields off enemies, small enemies into reach (then thrown). The
temple builds on it only after his sign-off on the sandbox (WHOLE-PIECE RULE).
*Kept for later (another temple, or an upgrade): the SEED ARROW -- a seed shot into living soil grows a bounce mushroom / a vine / a heaving root.*

### The rooms (12) and the keys
| # | room | level | kind | what happens | gives |
|---|---|---|---|---|---|
| 1 | ENTRY HALL (built) | L3 24 m | rest | the door ritual drops him in; the map on a pillar; the first sight of the well | checkpoint |
| 2 | THE WELL (built, grows) | L3 -> L0 | hub | the spine: ledges spiral down; a door on every level and axis (one locked at a time); the waterfall; its floor is a POOL with a sealed stair under it | -- |
| 3 | ACROBATIC ROOM (built) | L1-L2 | traversal + combat | the climb under archer fire, the gallery scrap, the button, the last fight | SMALL KEY 1 |
| 4 | ROOT GALLERY | L1-L2 west | puzzle | K1 door. Root-bound stone blocks to push onto plates, arrow switches high up, a gallery of guardian reliefs whose eyes give the order; ends at a floor CRACK | SMALL KEY 2 |
| 5 | THE ROOT HEART | L0 west | combat | drop through the crack (one-way): MID-BOSS, the THORNBACK (a burrower: it surfaces under you; hit it as it breaches) | THE VINE WHIP |
| 6 | THE NURSERY | L0 | TEACH | a safe walled garden under the well, no way out but SWINGING: knots over a pit (swing, then chain two), then a ZIP anchor on the rim lifts him into the well at L1. A zip anchor at the well's foot STAYS: **the loop-back** (well foot -> L3 in one pull) | shortcut |
| 7 | THE SUNKEN COURT | L1-L3 east | traversal | K2 gate. Kailasa: a court cut 33 m down into the rock, open to the sky, three storeys of cloister galleries, a long WATER CHANNEL on its axis, the SHRINE standing in the middle -- its door is under the channel's water | -- |
| 8 | TERRACE OF THORNS | L2 east | TEST | the court's upper cloister, PULLS under fire: rip the shields off a shield line, yank the archers off their ledges, pull crates onto the plates while they shoot, swing between the cloister's anchors to reach the key | SMALL KEY 3 |
| 9 | THE FALL GALLERY | L2, in the well | TWIST | K3 door, behind the waterfall. A ROOT DAM holds back a second channel at the lip: lash it and PULL it down -> the fall DIVERTS away from the well -> the well's pool and the court's channel DRAIN (one water system: the twist pulls on the WORLD, not on a box) | the way down |
| 10 | THE SHRINE | L1-L3 east | puzzle-traversal | its door was under the channel; inside, a hollow core: swing and zip up its anchors, pull its stone counterweights to raise the floors | THE CHALICE (boss key) |
| 11 | STATUE GAUNTLET | L3 east | combat | taking the chalice wakes the stone guardians in the cloisters (STATUES.md: an event, never proximity); run the ROCK BRIDGE (L3) back to the hall level -- a shortcut home | checkpoint |
| 12 | THE HOLLOW BANYAN | L0 under the well | BOSS | the drained pool shows the stair; the chalice opens the boss door. A root colossus in a round undercroft with a rim: it slams a root-hand that STICKS; WHIP the hand's knot and PULL it down flat -> run up the arm -> lash the armour plates off its heart -> strike the corrupted Jinra heart; 3 cycles, faster; phase 2 swings it up into the roots (swing between hanging knots to reach it), phase 3 the floor floods. Inside it: a STOLEN ONE (a villager turned to stone) | the JINRA STONE (GET moment) + the stolen one |

**Keys:** 3 small keys + the chalice; exactly one locked door is ever available. **Shortcuts:** the acrobatic zip (built), the nursery's zip
anchor (well foot -> L3), the root gallery's crack (one-way down), the rock bridge (court -> hall), and after the boss a GEYSER up the well to the hall.
**Hidden (3):** behind the waterfall before it is choked; atop the acrobatic room's cut opening (a long-jump off the top balcony); at the bottom of
the court's channel once drained.

### Pacing (first play ~63 min; see ftemple_pacing.png)
rest -> traversal -> traversal + combat -> puzzle -> combat (mid-boss) -> TEACH -> rest -> traversal -> TEST -> TWIST -> puzzle -> combat (gauntlet)
-> rest -> BOSS. Never two combat rooms back to back; a rest after the mid-boss and before the boss.

### Fixes this plan makes to what is built
- The acrobatic room's LADDER goes (TEMPLE_ROUTES: no ladders) -> a CHIMNEY of two faces 4.6 m apart, or a side wall run + kick to the upper rim.
- ~~The 9 m wall-run gap shortened to 6 m~~ -- **KEPT (his: "I bet I could do it")**: MEASURED with the shipped frame (`npm run wallgap`): from a
  9 m/s run he lands on the gallery by the side wall run (jumping at z -4.6 or -3.5) AND by a plain running jump. What stopped it was the wall's
  PILASTERS (solid on the triangle collider, every 7 m) -- now drawn but not solid. A miss lands on the ground floor by the stair (a short way back).
- Its button becomes the gate to SMALL KEY 1 (a chest after the last fight), not the end of the temple.

### Build order (track B: one room a build, each refined until it is fun; track A, the detail / paint / plant passes, interleaves)
1. the acrobatic room's fixes above + SMALL KEY 1 + the key / lock / chest system (`FTEMPLE.keys`, a door row that eats a key);
2. the well as hub (doors on its levels and axes, the pool and its sealed stair);
3. the root gallery (K1 -> K2); 4. the root heart + the Thornback stand-in + the WHIP pickup (the whip itself is VINEWHIP.md's sandbox, signed off FIRST);
5. the nursery (teach + the loop-back); 6. the sunken court + the shrine shell; 7. the terrace of thorns (test, K3);
8. the fall gallery + the drain (twist); 9. the shrine climb + the chalice; 10. the statue gauntlet + the bridge;
11. the boss: the Hollow Banyan (COMBAT.md boss knobs; `combatBoss` if a set boss fits, else its own); 12. the GET moment + the geyser out.


**THE WHIP-ONLY RULE (his, Nov 5 2026 -- VINEWHIP.md, re-measured on his FULL AIR CHAINS with `npm run reach`):** without a wall he crosses
33.7 m (jump, dash, double jump, dash, dash); WITH a wall 40-58 m; up 6.7 m without a wall, ~17 m with one. The line is the max + 25%, and every
whip room is STRUCTURAL, not just long: spans >= 42 m with NOTHING to run, kick or land on (no walls within 5 m of the line); thorn / rot
ceilings over gaps that kill the high arc; ledges > 8.4 m with no wall under them (overhangs, pillar tops); pits whose far side is a sheer wall
> 17 m; pulls no move replaces. The sheet's whip rooms: **C** a knot ceiling over a pit, its walls sheer and > 17 m (rule 4); **D** the dam (rule 5);
**E** a 46 m court crossing on a knot gantry, the cloister set back > 5 m from the line, a thorn canopy 3 m over the perches (rules 1 + 2);
**F** 18 m ledges on overhangs inside the shrine's undercut core (rule 3).
## How it is built (SCENE_COMPANION.md: data-first)
- `ftkMake(THREE, O)` between `// FTKLIB:START` / `:END` is a PURE builder of its table (`SC_FTEMPLE` markers): materials (`mats`), the
  placement rows (`kit`; the chambers get their own sets), the underground light (`env`), the spawn and the headless cameras (`shots`).
  Every placed thing is a ROW with a stable id. A row's `k` names a PIECE function; pieces write into ONE sink per material, so the whole set
  merges to about a dozen draws, and give colliders in the `obox` shape.
- Glue (`FTEMPLE`, `ftinStage`, `ftinStep`, `ftinMelee`, `ftinArrow`): the stage replaces the forge's floor and sky with the cavern's dark and
  its own light, pushes the colliders into BOXES, and lights the carved script at night (`nightGlow` on `stone` (runes), `carve` (cracks),
  `root` (veins); NIGHT.md). The moss, the guardians' eyes, the lanterns and the braziers' Jin flame glow ALWAYS (it is underground).
- `npm run ftstrip [shot ...] [--night=1] [--set=...]` lifts the SHIPPED text and renders its cameras headless (draws, tris on the sheet).
- Textures: `tools/ftemple_textures.py` (gpt-image, seamless): `ft_wall`, `ft_floor`, `ft_carve` (a frieze, tiles in X), `ft_root`, `ft_moss`,
  `ft_cobble`, and the singles `ft_door`, `ft_guardian`, `ft_pot`.
- Stairs: every riser .30 (his step is .357, m368). Colours: only `JPAL` for the Jinra (JINRA_COLOUR.md).

## THE KIT (pass 1) -- the pieces
| piece | what | collider |
|---|---|---|
| `wall` | ashlar courses, a base course, a carved frieze band, a cornice; `seg` = bays with pilasters; `ruin` = broken stepped top, rubble, moss | body |
| `floor` | a flagstone slab; tall `t` = a terrace mass with a lip and a frieze on its face | body |
| `stair` | `n` risers of .30 on a SOLID mass, cheek walls both sides (climbs toward -Z) | each step, the cheeks |
| `ledge` | a balcony on three stepped corbels, a lit rune under each, vines dripping off its edge (the acrobatic room's rim) | the deck |
| `column` | lathed with entasis, a base, a capital; a moss collar; `roots` = two roots spiral it top to floor | the shaft |
| `ruin` | a toppled column: the stump, two drums on the floor, rubble | stump, drums |
| `rootwall` | a wall split by a crack: the trunk root out of it, roots flowing down the face and over the floor, rootlets, vines | the two halves |
| `panel` | a carved GUARDIAN relief in a frame, eyes lit | the block |
| `arch` | two piers, eleven voussoirs, a keystone rune | piers, top |
| `door` | a heavy frame, a frieze lintel, two carved stone leaves on hinges (separate meshes for the swing) | jambs, lintel, the leaves |
| `lantern` | a stone post with an iron arm, a chain, a hanging stone lantern with a lit heart | the post |
| `brazier` | a bronze bowl on three curved legs on a stone footing, a Jinra flame (shader), embers | the bowl |
| `pots` | clay pots of three shapes (instanced); BREAK to a swing, an area blow or an arrow; come back 18 s later | -- |
| `moss` | a glowing moss carpet, glowing caps, spores | -- |
| `vines` | a lintel on posts with vines in catenaries and drops, each its own length | posts, lintel |
| `shaft` | daylight down from a crack (an additive cone, dust in it), a lit pool on the floor | -- |
| `guardian` | a carved guardian on a plinth, a mask head with lit eyes, a spear (a stand-in for his sculpt) | plinth, body |

## Passes (the original six; superseded in ORDER by THE FLOW's build order above)
1. **THE KIT** (built) -- every piece above in rows on a flagstone floor, then put together on a 3 m terrace (row C). Strip + numbers.
2. **CHAMBER 1: THE ACROBATIC ROOM** (WORLD_PLAN 5; built -- the route is in NOTES) -- three storeys (ground, rim 1 at ~6 m, rim 2 at ~12 m, the top at ~18 m). Get up to the
   first rim (stairs + a ledge climb); ARCHERS on the far rim across the gap (the existing archer, `ARCHER` / `archerAI`); a WALL RUN to the next
   ledge; a melee scrap on rim 2; on up by MONKEY BARS / the HIGH BAR / a TIGHTROPE / a MOVING PLATFORM; an ARROW SWITCH on the far wall that
   moves the platform; the BUTTON at the top opens the ground-floor door; back down; the last fight; ROOM CLEARED (a chime). Mesh collider row
   (`COLL.zones`) on its real triangles.
3. **THE ENTRY HALL + THE DESCENT** (built: DESCEND on the cella floor, the hall at 24 m, the well of seven ledges, the waterfall, the corridor) -- the door from the dome temple (an interact chevron there -> `?w=forge&zone=ftemple`; the exit back out),
   the hall, the spiral down round the root well with its waterfall, into chamber 1's ground floor. Its own ENTRY row (normal play camera,
   flat portal, minimal).
4. **THE ROSTER SLOTS** (WORLD_PLAN 3): melee small, melee big, ranged A (archer), ranged B (thrower), creature A (swarm), creature B (burrower /
   flyer) -- stand-ins where his models do not exist yet; each with its stone twin and a night glow in pieces.
5. **THE FLOODED GALLERY, THE ROOT HEART, THE GUARDIANS' HALL** -- one chamber a pass, each with a new verb. Leave room for a PUZZLE DOOR or two
   (smaller inner doors, puzzles designed later); any inner door that needs a shard uses the same RITUAL system as the dome door.
6. **THE BOSS ARENA + THE JINRA STONE** -- the boss, the stone, the GET moment (standardised once, WORLD_PLAN 2).

## DONE WHEN
- [ ] ROCK-CUT: every chamber reads as carved out of one rock, no joints, reliefs everywhere, light from cut openings (pass 3b, pending his look).
- [ ] The kit: every piece reads as what it is, close (2-4 m) and wide; CRAFT.md checked (roots taper and flow, vines droop, the chain hangs from
      a hook, stairs stand on a mass, nothing floats); numbers reported (pass 1).
- [ ] Phone-fast: the kit under ~25 draws; each chamber under ~60 draws and ~150k tris in its worst view; no hitch on entry.
- [ ] Night: the carved script, the cracks in the frieze and the veins in the roots glow in PIECES; the moss and lanterns glow always.
- [ ] Chamber 1 plays start to finish: up three storeys by every verb, archers, the wall run, the scrap, the switch, the button, the door, the last
      fight, ROOM CLEARED.
- [ ] Collisions on the real triangles in the chambers; no rim snags (the basin-edge / stair-top report).
- [ ] The door: in from the dome temple (DESCEND), out again (ASCEND); the ENTRY row lands him facing the hall (pass 3, pending his look).
- [ ] The roster slots filled (stand-ins named), the boss arena and the Jinra stone GET moment.
- [ ] **His sign-off, on his phone.**
