# THE SNOW VILLAGE -- blueprint (10 passes before a single piece is placed)

> *"We should do like 10 passes of logistic blueprint before we even start building it... it would be cool if it did have a lot of logical
> arrangement, verticality, things that are hard to get to. We have the kit now."* (Colin, Nov 1 2026)

**Why this file exists:** every area this repo has scaled up came out as a noise-scatter brush -- pieces with no reason to be where they are.
A real village is the opposite: every building is where it is BECAUSE of something (water, wind, the road, defence, who lives there, who they
trade with). So the village is designed on paper first, in ten passes, each answering one question, each signed off by him before the next.
**Nothing is built until pass 10 is approved.** The kit is done (`?w=forge&zone=snowkit`, `SVK` rows, `snowKitPiece`); this is only WHERE and WHY.

The pieces available (all `snowKitPiece`, 2 m grid, heights in .3 m risers):
- structure: walls (straight / corner / window / door), post + beam, hut base, roofs (round / gable), roof beams, chimney, stone stairs, platform, arch, pillar
- aqueduct: piers 6 / 9 / 12 m, arch span, deck + balustrade, shrine tower (2 sizes), end ramp 3 m, snapped sections
- buildings: hut (small / normal / big), longhouse, timber stairs, deck on posts, watchtower, gate, outpost
- accessories: fences + gate, banner post, flag pole, lantern post, jade lamp, fire pit, well, barrels, crates, pots, market stall, forge, sled, firewood, snowman

The moves it must be sized from (TEMPLE_KIT.md, measured): stairs .30; run + jump 2.2 high / 5.9 far; long jump 11.0; double jump 4.0 / 10.0;
high jump 5.3; wall run UP lip 2.7 (run) / 3.6 (sprint); side wall run 5.5-6.5 m; chimney faces 4.6 m apart; high bar 11.9 up.

## THE TEN PASSES

| # | question | output | status |
|---|---|---|---|
| 1 | **WHY is there a village here, and what does it DO?** | the settlement's reason, its people, its jobs, what it gives the player | **approved** (hot spring + aqueduct; a HAMLET; near the spawn) |
| 2 | **THE SITE** -- the ground it sits on | a terrain section: the tiers (heights), the water, the wind side, the cliff; where in the Snowfield | **approved** (gorge, horseshoe cliff, ~12 buildings) -- its PLACE on the region map waits on REGION_METHOD stage 1-2 |
| 3 | **ZONES** -- what goes where, and why | a zoning map: each district placed by its reason (water, road, defence, status) | **drafted** (blueprint_pass3.png) |
| 4 | **CIRCULATION** -- how people move | the main road (stairs only, everyone), the lanes, the dead ends, the gate; how the mammoth gets through | **drafted** |
| 5 | **LANDMARKS + SIGHTLINES** | what you see from the gate, from each tier; the one thing visible from everywhere; framed views | **drafted** (measured) |
| 6 | **THE HIGH ROUTE** -- the parkour layer | the rooftop / aqueduct / tower route, each gap sized from the move table, a ladder (introduce -> combine); the hard-to-reach places and what is up there | **drafted** |
| 7 | **THE BUILDINGS** -- one row each | a placement table: id, kit piece + options, tier, door facing, who lives there | **drafted** |
| 8 | **LIFE** | who walks where, the market hours, smoke, lights at night, the animals, the mammoth stable | **drafted** |
| 9 | **THE GAME** | the quest givers (THE STOLEN ONES), the shop, the healer, the way out to the valley / temple, the secrets | |
| 10 | **THE REVIEW** | one top-down plan + one side elevation drawn from passes 1-9, checked against every pass; his sign-off -> then the blockout, one district at a time | |

Each pass is short, specific, and gets his yes / change before the next. If a later pass breaks an earlier one, the earlier one is fixed on paper.

---

## PASS 1 -- WHY IS THERE A VILLAGE HERE? (drafted, for his notes)

### The reason it exists: WARM WATER
A village in deep snow exists where people can survive the winter. The strongest reason, and the one that gives every other pass something to
hang on: **a hot spring** rises at the foot of a cliff. Everything follows from it:
- **The aqueduct** carries the warm water from the spring (high, at the cliff) down through the village -- that is why the village has an aqueduct
  at all (the kit's biggest piece now has a JOB). Its deck is a walkway; its piers are landmarks; its line is the village's spine.
- **The bathhouse** sits where the water arrives -- the social centre (gossip, quest givers, a place to heal = the HEALER).
- **The wash-off pool / ice-free channel** at the bottom is where the water leaves -- the only open water in the valley (fish, birds, the herd drinks).
- **Steam** rises off the channel all day: the village is visible from far away as a plume (pass 5 gets its landmark for free).

### Why HERE and not on the open field: SHELTER and DEFENCE
- **The cliff at its back** breaks the wind (the wind comes down the valley; the village is in the cliff's lee). Snow piles on the windward side
  of everything; the lee side is cleared -- the drifts tell you which way the wind blows (pass 2).
- **Built UP the slope, not across it**: houses step up in TERRACES, each on a stone retaining wall (the kit's walls and stairs). Old mountain
  villages do this so every roof gets the low winter sun and the flat ground is kept for the herd. **This is the verticality, with a reason.**
- **One gate on the low side** (the kit's gate), facing the open field and the road to the valley. The high side is the cliff -- no wall needed.
- **The watchtower** on a spur over the gate, where you can see the whole field: the dragon's flight path, travellers, the herd.

### Who lives here (each one a reason for a building, and later a quest)
| who | what they do | what they need (-> a building, a place) | their STOLEN ONE (KORAJIN.md, a quest seed) |
|---|---|---|---|
| the HERDERS | keep the mammoth calves; ride the big mammoth | the STABLE (longhouse) outside the gate by the channel, the paddock fence, hay / firewood | the herd's bull mammoth, taken to the ice temple |
| the SMITH | forges, mends, sells | the FORGE (forge station) near the water (quenching) and the gate (travellers) | his apprentice |
| the BATHKEEPER / healer | runs the bathhouse, heals | the BATHHOUSE where the aqueduct arrives | -- |
| the MERCHANT | trades; the shop | the MARKET on the first terrace inside the gate (stalls, crates) | -- |
| the ELDER / shrine keeper | keeps the Jinra shrine, knows the temple | the SHRINE at the top terrace by the spring, under the cliff | her daughter? |
| families | live | huts on the middle terraces, chimneys smoking, washing lines, snowmen | a little brother |
| the WATCH | guards | the watchtower, the gate | -- |

### What the village does for the PLAYER
- **A hub, not a level:** the safe place between the field and the valley / temple. Shop (merchant), healing (bath), upgrades (smith), quests
  (the stolen ones), the mammoth (stable).
- **A playground for the high route:** roofs, the aqueduct deck, the watchtower, the cliff above the spring -- places that are hard to get to,
  each with a reason to go (pass 6): a coin stash on the watchtower roof, the shrine bell at the top, a view of the temple from the cliff.
- **The way onward:** the valley road leaves from the top of the village past the spring (you go THROUGH the village, upward, to reach the temple).

### The rules this pass sets for the next ones
1. Everything is downhill of the spring; water flows spring -> aqueduct -> bath -> channel -> out the low side.
2. Status rises with height: gate / market / stable low, homes middle, shrine / elder high.
3. The wind side is buried in drifts; the lee side is where the doors are.
4. One gate, low. One road up through the middle. Lanes branch off it to the terraces.
5. Every building answers "who lives / works here, and why here".

### His answers (pass 1)
- *"The hot spring and duct is fine."* A **hamlet**, near the spawn. A mythical game: no aliens, nothing from Zap.
- *"I want the terrain to be really interesting... the path people take obvious and interesting, lots of ups and downs and winding; bridges over
  creeks; underpasses and overpasses in the walls; high-rise, low-rise, moving things."*

### (old) Questions for him (pass 1)
- Is **a hot spring + aqueduct** the right reason (it puts the aqueduct to work and gives the steam plume)? Or something else: a mine, a monastery, a trade crossing?
- How **big**: a hamlet (8-10 buildings, ~60 m across) or a town (20+, ~120 m)? Small is easier to make beautiful; the field has room for ~100 m.
- **Where**: the field's open south end near the spawn (SNOW_VILLAGE.md), or tucked against the cliffs by the lair climb (better shelter story,
  but crowded)? Pass 2 assumes the south end with a NEW cliff / slope built for it unless he says otherwise.

---

## PASS 2 -- THE SITE (drafted, for his notes)

Drawing: `images/concepts/snow_village/blueprint_pass2.png` (top-down, north = up = toward the lair; grid 10 m).

### Where
The open south-west of the Snowfield, between the spawn (0, 8) and the field's south edge: **x -72..-4, z 18..72** (~68 x 54 m, a hamlet). The
frozen pond (27, 30), the mammoth (16, 22) and the herd stay where they are -- they become the hamlet's OUTSKIRTS (the stable by the creek mouth).
Moves out of the way: the rock bridge (-46, 22) and the standing stones (-44, 52) (showroom pieces, they can go elsewhere).

### The ground: a HORSESHOE CLIFF with a GORGE down the middle
- **A new cliff** (+18 m) wraps the site on the west and south like a horseshoe, open to the north-east (toward the spawn). It is the wind break:
  the wind comes down the field from the NW, so the cliff's top and every north face carries the drifts; the hamlet's doors face east and south.
- **The hot spring** rises at the cliff foot at the head of the horseshoe (-30, 68).
- **The warm creek cuts a GORGE straight down through the middle of the hamlet** (spring -> NE -> out past the gate -> into the pond, which gets
  a steaming unfrozen inlet). The gorge splits the hamlet into two BANKS that do not line up -- so every crossing is a bridge, and the heights on
  the two sides are offset, never one flat band:

| WEST bank | height | | EAST bank | height |
|---|---|---|---|---|
| | | | E1 GATE + SMITH | +1.2 |
| W1 MARKET | +2.4 | | | |
| | | | E2 BATHHOUSE (the aqueduct arrives) | +4.2 |
| W2 HOMES | +5.4 | | | |
| | | | E3 HOMES | +7.2 |
| W3 UPPER HOMES | +8.4 | | | |
| WATCH KNOLL (a rock spur, the watchtower to +16) | +8 | | E4 SPRING LEDGE (the shrine) | +10.8 |

  Each step is ~3 m, but the two banks are offset by ~1.5 m: looking across the gorge you always see the other side a half-storey up or down.
- **The gorge floor** steps down the same way in three small FALLS (~3 m each), so the creek is a staircase of pools and falls, with a low PATH
  along the floor (the underpass layer: it runs under the bridges).

### The verticality this gives (his list, each with a reason)
- **Bridges over the creek**: B1 at the creek mouth (the way in from the spawn), B2 low (gorge 1.2 m deep), B3 high (gorge 4 m deep). The road
  crosses the gorge back and forth as it climbs -- winding, never straight.
- **Overpass**: the AQUEDUCT leaves the spring along the west bank's top and crosses the gorge HIGH to the bathhouse -- it is itself a bridge (its
  deck walkable, the high route), and the road passes under it on W2 (U1).
- **Underpasses**: the gorge path under B2 and B3; a TUNNEL stair through the E3/E4 retaining wall (U2) -- the road goes INTO the wall and comes
  out a storey up.
- **High-rise / low-rise**: the watchtower on its knoll (+16 at the top) against the low gate houses (+1.2); W3 houses under the cliff vs. the
  smithy by the water.
- **A high bridge** (U3) from W3 out to the watchtower, over the market lanes.
- **Moving things**: a WATER WHEEL at a fall (drives the smith's bellows -- a turning platform he can ride), a WINCH BASKET (counterweight lift)
  between the market and W3 hauling goods (a moving platform), the spring's GEYSER puff on a timer (a launch), the steam.

### The main road (the walking route: stairs only, risers .30, everyone)
SPAWN -> **B1** over the creek mouth -> the **GATE** (E1) -> **B2** across the gorge -> the MARKET (W1) -> stairs -> switchback onto W2 -> under
the AQUEDUCT (U1) -> **B3** high across the gorge -> E3 -> stairs -> the TUNNEL (U2) up through the wall -> the SPRING LEDGE and the SHRINE (E4) ->
the CLEFT in the cliff: the road on to the valley and the temple. Three gorge crossings, one underpass, one tunnel, ~120 m of road for a ~60 m
climb... it winds.

### Built how (so the terrain is real, not painted)
The snow plane is a heightfield over y 0, so nothing is dug below it: the banks are RAISED terrace bodies sitting on the field (rough rock under
kit stone retaining walls, snow-pillowed tops, `patchAdd` on every top), and the gorge is the gap left between them (its floor stepped with low
rock sills under the falls). Each terrace wall is ~3 m: the stairs climb it in 10 risers; a sprint wall-run (lip 3.6) climbs it directly -- the
road is the long way round, the wall is the shortcut (pass 6).

### His answers (pass 2)
- *"Yes, yes and yes -- that's fine, that's good."* The gorge through the middle, the horseshoe cliff, the size.

### (old) Questions for him (pass 2)
- The GORGE through the middle (two offset banks, bridges back and forth) -- yes? Or the creek round the outside (one hill, one moat)?
- The HORSESHOE CLIFF: a new cliff on the field's south-west corner, ~18 m. OK to move the rock bridge and standing stones?
- Too big / too small? (~68 x 54 m, 4 storeys of terraces, ~12 buildings.)

---

## WHERE IT SITS NOW (REGION_METHOD.md, m2070)
The hamlet moves off the field's corner onto the REGION map: its GATE is the VILLAGE place (world -16, -154, floor 14 m) and its SPRING is the HOT
SPRING place (74, -155, floor 18 m) -- the valley between them is the hamlet's gorge, and the loop on to MAMMOTH MEADOW (16, -65) is the road out to
the stable and the herd. Pass 2's layout is kept whole (the horseshoe cliff, the gorge, the offset banks); at blockout it is turned so its gorge runs
up that valley, and the region heightmap is hand-edited there (the spring raised ~11 m over the gate, the horseshoe cut into the valley head).

## PASS 3 -- ZONES (drafted; his go: "start the village")
Drawing: `images/concepts/snow_village/blueprint_pass3.png` (same frame as pass 2).

| zone | where | what is in it | WHY there |
|---|---|---|---|
| GATE + TRADE | E1, +1.2, inside the creek mouth | the GATE, a watch house, the SMITHY with its WATER WHEEL on the first fall | travellers arrive here; the smith needs running water (quench + the wheel drives the bellows) and sells to whoever comes in |
| MARKET | W1, +2.4, across B2 | the MARKET SQUARE (3 stalls, the well), the merchant's house | the first flat ground inside, on the road, reachable with a cart; the well where the square is |
| BATH + HEALING | E2, +4.2 | the BATHHOUSE (longhouse) and the hot pool | the aqueduct ends here -- the warm water arrives at the bath; the healer is the bathkeeper |
| HOMES | W2, +5.4 | 3 huts | above the noise of the market, in the sun, off the road on lanes |
| HOMES + ELDER | E3, +7.2 | 2 huts, the ELDER'S HOUSE (the big hut) | across from the homes; the elder lives nearest the shrine |
| UPPER HOMES + STORES | W3, +8.4, under the cliff | 2 huts, the STOREHOUSE, the top of the WINCH LIFT | goods are hauled up from the market by the winch and stored dry and high, under the cliff's lee |
| WATCH | the knoll, +8 | the WATCHTOWER | sees the gate, the field and the sky (the dragon) |
| SACRED | E4, +10.8 | the SHRINE (the kit's shrine tower), the SPRING and its GEYSER | the source of the water is holy; highest, hardest to reach, last |
| OUTSIDE | by the creek mouth, toward the meadow | the STABLE + paddock (the mammoth), the herd beyond | big animals stay outside the walls, by water, on the road to the meadow |

**12 buildings** (gate, smithy, watch house, merchant's house, 3 + 2 + 2 huts, bathhouse, elder's house, storehouse, watchtower, shrine, stable --
some small) **+ 3 moving things** (water wheel, winch lift, geyser). Every one has a WHY; none is filler.

**Next: pass 4 -- CIRCULATION**: the lanes off the road to every door, the dead ends, where the mammoth fits (outside only, or through the gate to
the market?), the gorge path, and which walls are climbable shortcuts.

## PASS 3 -- his note
- The MAMMOTH may come in (*"I don't really mind being able to have the mammoth come in, why not"*; Zelda keeps the horse between areas). And he
  should be FAST (*"riding it is way slower than running"*) -- m2071: top speed 15.5 m/s (he runs 7.2, sprints 9).

## PASS 4 -- CIRCULATION (drafted)
Three networks, each with its own rule, so the village reads at a glance: **the ROAD** (everyone, the mammoth too, low), **the LANES** (on foot,
to the doors), **the HIGH ROUTE** (parkour, pass 6). Plus the gorge path under everything.

### The ROAD -- wide, the mammoth's (4.5 m wide; ramps, not stairs, where the mammoth goes)
- SPAWN side -> **B1** (a wide timber bridge over the creek mouth) -> the **GATE** (a 4 m opening: the mammoth fits under) -> E1 -> **B2** (stone,
  4.5 m wide) -> the **MARKET** square -> a **ramp** (1 : 6, along the market's south wall) up to W2 -> under the **AQUEDUCT** (6 m clear, the
  mammoth fits) -> **B3** across the gorge to E2's BATHHOUSE yard.
- **The mammoth's reach ends at the bath yard**: gate, smithy, market, the lower homes' lane mouth, the bath. Above that the way up is STAIRS
  (E3, the tunnel U2, E4) -- foot only. So riding in, you can reach the market and the hot pool; the homes, the stores, the watch and the shrine
  are on foot. The STABLE outside the gate is where he waits otherwise.
- Every road turn is at a landmark (the gate, the well, the aqueduct pier, the bath door), so the way on is always in view.

### The LANES -- on foot, 2 m, stairs at .30
| from | to | how |
|---|---|---|
| the market | W2's 3 huts | a lane off the ramp's top, stepping along the terrace, ending at the cliff (a dead end with a view) |
| W2 | W3 (upper homes + storehouse) | a timber stair up the W2/W3 wall at its west end, and the WINCH LIFT from the market (ride the basket) |
| W3 | the WATCHTOWER | U3, the high timber bridge from W3 to the knoll (on foot, the only way except climbing) |
| the bath yard | E3 (huts, elder) | stairs up beside the bathhouse |
| E3 | E4 (the shrine) | U2, the tunnel stair inside the E3/E4 wall -- the only foot way up to the shrine |
| E1 | the gorge path | steps down beside the smithy's water wheel to the gorge floor |

### The GORGE PATH -- the underpass layer
Along the creek's floor from the smithy's wheel to the first fall, under B2 and B3, past the bath's outfall, ending at the foot of the third fall
under the spring ledge: a dead end that is a secret (behind the fall -- pass 6 decides what is there). Stepping stones over the creek; the falls
are climbable at the sides (3 m = a sprint wall-up).

### Dead ends on purpose (each one pays off)
- the W2 lane's end at the cliff: a view down the gorge to the gate
- the gorge path behind the third fall: a secret
- the watchtower top: the whole region in view (the temple mountain on the skyline)
- the storehouse roof: the winch's top, a coin stash (pass 6)

### Shortcuts (walls you can climb instead of walking round)
Every terrace wall is ~3 m: the road and the lanes go round, a SPRINT wall-up (lip 3.6) goes straight over. The two banks are offset ~1.5 m, so
across the gorge a RUN + JUMP (2.2 high, 5.9 far) reaches the lower side from the higher one, never the other way: down-and-across is free, up
is the long way. Pass 6 sizes every one of these against the move table.

## PASS 5 -- LANDMARKS + SIGHTLINES (drafted; measured on the region heightmap, not guessed)
**The landmarks, by rank:** (1) the AQUEDUCT -- the spine, seen from everywhere inside the hamlet; (2) the STEAM plumes (bath, spring) and the
WATCHTOWER -- what you see from outside; (3) the small ones you steer by: the well, the water wheel, the bath door, the shrine's jade glow (a night beacon).

**The six views inside the hamlet:** 1 the GATE frames the aqueduct crossing high over the gorge; 2 from the MARKET, the bath steam across the gorge
and the shrine above it; 3 UNDER THE AQUEDUCT the road turns and the three falls stack up to the shrine; 4 from B3, mid-gorge, down to the gate and
up to the spring; 5 the WATCHTOWER top; 6 the SHRINE, the reward view: every roof below, the field beyond.

**Measured on `levels/region_6.bin` (line of sight, eye 1.7 m):**
- **The REVEAL is the top of the pass** from the willow shrine (26 m up, at -62, -163): the gate and a 25 m steam plume come into view 47 m away,
  below you. Before that you see nothing of the village -- the valleys wind. That is the arrival moment.
- **The temple cannot be seen from the village as the map stands.** Even from the watchtower (16 m) a 60 m crown on the temple is hidden by one
  ridge point (22, -118, ground 54 m). So at blockout **a NOTCH is cut in that ridge (~10 m)**: from the watchtower top the temple's crown sits in the
  notch -- the first sight of where the game is going. (From the TEMPLE STAIR it is in plain view.)
Drawing: `images/concepts/snow_village/blueprint_pass5.png` (the six views as arrows).

## PASS 6 -- THE HIGH ROUTE (drafted; every gap from the MOVE TABLE in TEMPLE_KIT.md, at COMFY, never max)
Drawing: `images/concepts/snow_village/blueprint_pass6.png` (purple, numbered as below).

One continuous line over the hamlet from the gate to the watchtower, built as a LADDER (introduce -> develop -> twist -> combine), ending in a
ride down. Heights: roofs = their terrace + the building (huts eave ~2.4, gable ridges ~4); the aqueduct deck +11; the watchtower top +16.

| # | from -> to | rise / gap | move | comfy limit | ladder step |
|---|---|---|---|---|---|
| 1 | crates (0.9) -> the watch house eave (2.4) | +1.5 / 1 m | jump | 2.2 / 5.9 | INTRODUCE: up onto a roof |
| 2 | eave -> the GATE top (4.5) | +2.1 / 2.5 m | run + jump | 2.2 / 5.9 | introduce: roof to wall |
| 3 | gate top -> the SMITHY ridge (5.2) | +0.7 / 4.5 m gap | run + jump | 5.9 | DEVELOP: a real gap, over the road |
| 4 | smithy -> the WATER WHEEL's paddle | -2 / 3 m | drop + jump | -- | develop: onto something MOVING |
| 5 | ride the wheel: 2 m -> 6 m | (it lifts you) | stand, time the jump | -- | TWIST: timing |
| 6 | wheel top (6.0) -> the BATHHOUSE roof (6.6, ridge 8.6) | +0.6 / 3.5 m | run + jump | 5.9 | develop |
| 7 | bathhouse ridge (8.6) -> the AQUEDUCT deck (11) up a pier face | +2.4 | wall-run UP, run | lip 2.7 | DEVELOP: the first wall-up |
| 8 | the deck across the gorge (11, over the road) -> the STOREHOUSE roof (11.4) | 6 m along the cliff | SIDE wall-run on the cliff | 5.5 (run) / 6.5 (sprint) | TWIST: a sprint, and the drop is 11 m |
| 9 | storehouse -> U3 the high bridge (10) -> the watchtower foot | -1.4 / walk | -- | -- | a breather, the view |
| 10 | up the WATCHTOWER (+6 to 16): the tower face and the knoll rock 4.6 m apart | +6 | CHIMNEY wall-jumps (4 kicks) | +1.7 a kick | COMBINE: everything learned, up high |
| -> | the top: a ZIP LINE down to the market square | -10 | zip | -- | the reward ride, back to the start of the loop |

**What is up there (each dead end pays):** R1 the gate top -- the gate banner, and the first look down the gorge; R2 the storehouse roof -- a coin
stash by the winch head; R3 the watchtower top -- the temple's crown in the ridge notch (pass 5) + the zip; R4 behind the third fall (the gorge
path, not the high route) -- a hidden alcove for something better (a piece of gear, his call).

**Shortcuts off the road (the same moves, used to save time):** every terrace wall ~3 m = a SPRINT wall-up (lip 3.6), not a run (2.7) -- so a
shortcut needs speed; the gorge, higher bank to lower: run + jump 5.9 (the banks are ~4-6 m apart at the bridges); the third fall's side, 3 m, a
sprint wall-up = the back way to the shrine instead of the tunnel stair.

**Rules checked:** no gap over its comfy distance; no ledge over its comfy height; the one hard move (8, the side run with an 11 m drop) has a soft
fail -- you land on the W2 roofs, not in a pit (there is no fall damage; a hard landing costs 1.15 s).

**Next: pass 7 -- the buildings, one row each** (kit piece + options, terrace, door facing, who lives there) -- the table the blockout is built from.

## PASS 7 -- THE BUILDINGS, one row each (drafted)
Coordinates are the hamlet's own frame (the pass 2/3 drawings, metres; turned onto the region valley at blockout). Kit names and options are the
real ones (`snowKitPiece(kind, opts)`; hut defaults R 2.7, wallH 2.3, roofH 2.8). Doors face the road or their lane. Ids are stable (SCENE_COMPANION).

| id | building | at (x, z) | terrace | kit + options | door faces | who / what |
|---|---|---|---|---|---|---|
| v_gate | the GATE | -12, 22.5 | E1 +1.2 | `gate` { w 4.4 } (5.1 tall) | NE, to the spawn | the watch; the mammoth passes under (CHECK his height at blockout -- widen if he does not fit) |
| v_watch | the watch platform | -18, 26.5 | E1 | `deck_posts` { h 3, w 4, d 4 } + `crates` at its foot | the gate | the gate guard; high route 1-2 |
| v_smithy | the SMITHY (open forge shed) | -10, 30 | E1 | 4 x `post_beam` + `roof_gable` (ridge +4) + `forge_station` + `firewood` | the road | the SMITH; high route 3 (the ridge) |
| v_wheel | the WATER WHEEL | -24.6, 32 | the first fall | **NEW piece** (a turning wheel, paddles you can ride) | -- | drives the smith's bellows; high route 4-5 |
| v_merch | the merchant's house | -53, 32.5 | W1 +2.4 | `hut` { banner 1, porch 1, seed 2 } | E, onto the square | the MERCHANT |
| v_market | the MARKET SQUARE | -43, 36 | W1 | 3 x `market_stall`, `well`, `fire_pit`, 4 x `lantern_post`, `barrels`, `crates` | -- | the shop, the well, the square |
| v_hut_w1 | hut | -62, 44 | W2 +5.4 | `hut` { seed 3 } | S, the lane | a family |
| v_hut_w2 | hut | -50, 48 | W2 | `hut` { R 2.4, seed 5 } | S | a family |
| v_hut_w3 | hut | -36, 53.5 | W2 | `hut` { R 2.2, porch 0, seed 9 } | W | a family (under the aqueduct) |
| v_store | the STOREHOUSE (flat stone roof) | -44, 60 | W3 +8.4 | `wall_straight` / `wall_corner` ring + `platform` roof (top +11.4) | the lane | goods from the winch; high route 8 lands here; R2 coins |
| v_winch | the WINCH LIFT | -46, 40 -> 58 | W1 -> W3 | **NEW piece** (a basket on a counterweight, a timber gantry on the storehouse) | -- | hauls goods; a moving platform |
| v_hut_w4 | hut | -64, 55 | W3 +8.4 | `hut` { R 2.6, seed 11 } | E | herders (they keep the stable) |
| v_hut_w5 | hut | -52, 61 | W3 | `hut` { R 2.4, chimney 1, seed 13 } | N | a family |
| v_tower | the WATCHTOWER | -57, 28 | the knoll +8 | `watchtower` { h 6.5 } (top ~+16) | the high bridge | the lookout; R3 the temple notch view; the zip starts here |
| v_hbridge | U3 the high bridge | W3 -> knoll | +10 | `aq_deck` spans on `deck_posts`, or the rope bridge (`RSPAN`) | -- | high route 9 |
| v_bath | the BATHHOUSE (timber hall) | -15, 41.5 | E2 +4.2 | `wall_straight` / `wall_window` ring 9 x 5 + `roof_gable` (ridge +8.6) | W, the road / B3 | the BATHKEEPER (healer); the aqueduct ends on its roof |
| v_pool | the HOT POOL | -9, 45.5 | E2 | **NEW piece** (a stone-rimmed steaming pool; heals) | -- | healing |
| v_hut_e1 | hut | -20, 55 | E3 +7.2 | `hut` { seed 4 } | S, the stairs | a family |
| v_hut_e2 | hut | -12, 52 | E3 | `hut` { R 2.2, seed 6 } | W | the smith's family |
| v_elder | the ELDER'S HOUSE | -7, 61 | E3 | `hut` { R 3, roofH 3.4, wallH 2.6, banner 1, seed 7 } | W | the ELDER (the temple's lore, the first quest) |
| v_shrine | the SHRINE | -22, 66 | E4 +10.8 | `aq_shrine` { s 1.4 } + `jade_lamp` x2 + `banner_post` x2 | NE, over the hamlet | the shrine keeper |
| v_spring | the SPRING + GEYSER | -30, 68 | E4 | **NEW piece** (a steaming spring pool; a geyser on a timer that launches you) | -- | the source |
| v_stable | the STABLE + paddock | 6, 26 | outside (field) | `longhouse` { R 3.4, sx 2, chimney 0, banner 0 } + `fence_straight` x 8 + `fence_gate` | the road | the MAMMOTH's home; the herders' work |

### The works (not buildings, but built)
| id | what | kit | notes |
|---|---|---|---|
| v_aq | the AQUEDUCT, spring -> bath roof | `aq_section` (piers 6 / 9 / 12 by the ground under them), deck +11 | the spine; walkable; high route 6-8 |
| v_b1 | B1, the creek mouth | **NEW**: a timber road bridge 4.5 m wide | the mammoth crosses |
| v_b2 / v_b3 | B2 (low) / B3 (high) over the gorge | `arch` + `aq_deck` (4.5 m) | stone; the gorge path passes under both |
| v_terr | the TERRACES (8 bodies) | **NEW**: a terrace body = rough rock + `wall_straight` retaining walls (~3 m) + snow top (`patchAdd`) | built as RAISED bodies on the ground |
| v_stairs | the stairs + the mammoth ramp | `stairs` { n 10 } (risers .30), `aq_ramp` { rise 3 } for the ramp | the ramp is the mammoth's |
| v_tunnel | U2, the tunnel stair inside the E3/E4 wall | **NEW**: an `arch` opening + an inside stair | the only foot way to the shrine |
| v_zip | the zip line tower -> market | the existing `ZIPS` | the reward ride |

**A correction from this pass:** the kit's gate is 5.1 m tall, not 4.5, so high route 1-2 changes: crates (0.9) -> the WATCH PLATFORM (3.0, +2.1)
-> the gate top (5.1, +2.1). Both still inside run + jump's comfy 2.2.

**NEW pieces the kit still needs (6):** the water wheel, the winch lift, the hot pool, the spring + geyser, the timber road bridge, the terrace body
(+ the tunnel stair). These go to the kit session as one list before the blockout.

**Count:** 18 buildings / structures (12 lived-in) + 7 works. Next: **pass 8 -- LIFE** (who walks where, smoke, lights at night, the animals).

## PASS 8 -- LIFE (drafted)
What makes it a place and not a set: people on routes with reasons, things that move, smoke, light. Budget for a phone: **~8 bodies** in the hamlet
at once (each is a skinned draw), the rest is particles and emissive (nearly free).

### The people (8), each with a beat -- a loop between two or three spots, not a random wander
| who | body (what exists) | the loop | where you find them |
|---|---|---|---|
| the SMITH | the toad wanderer (`TOADK`, his village NPC) | forge -> the water wheel (checks it) -> forge; hammering clip at the anvil | E1, the smithy |
| the MERCHANT | toad wanderer (tint) | behind the middle stall; to the storehouse by the WINCH and back | W1, the market |
| the BATHKEEPER (healer) | toad wanderer (tint) | the bath door -> the hot pool -> the bath door | E2 |
| the ELDER | toad wanderer (slow, a stick) | her porch -> the shrine stairs (the tunnel) -> the shrine -> back; she is at the shrine at NIGHT | E3 / E4 |
| a HERDER | toad wanderer | the stable -> the paddock gate -> out to the meadow herd and back (a long loop, outside) | outside |
| the GATE GUARD | the samurai body (calm, spear/katana sheathed) | the watch platform <-> the gate | E1 |
| 2 CHILDREN | toad wanderer, small (scale .7) | chase each other round the market well, the snowman, the W2 lane; scatter when you run at them | W1 / W2 |

- They are the **quest givers** (pass 9): the elder, the smith, the herder, a child. Each one's beat passes the road at least once, so you meet them.
- The **mammoth** waits at the stable (he is the herder's charge); the **calf herd** grazes the meadow beyond, inside sight of the stable.

### Things that move (and are played with)
the WATER WHEEL (always turning; you can ride it), the WINCH basket (up and down on a slow loop; ride it), the GEYSER (puffs every ~12 s, a launch),
the creek (flowing, steaming), banners and washing lines (the willow's verlet, a few links), smoke from every chimney, the zip line.

### Smoke, steam, light
- **Chimneys:** every hut and the smithy smoke (the existing `puffPool` / `SMOKE`), thicker at the smithy; the smoke leans with the wind (NW).
- **Steam:** the creek all the way down, the bath roof, the hot pool, the spring -- the steam is the hamlet's silhouette from the pass (pass 5).
- **Day:** warm window glow faint; the square busy.
- **Night (`SNOWNIGHT`):** every window and lantern warm (the kit's light pools), the shrine's jade lamps the brightest thing (the beacon from the
  market and B3), the forge glowing orange in its open shed, the children gone, the elder at the shrine, the guard with a lantern on the gate.

### Sound (later, his recordings)
the forge hammer (a rhythm you hear from the gate), the creek and the falls (louder in the gorge), the wheel creak, the market murmur, the wind
on the high route (louder up there -- height you can hear).

Next: **pass 9 -- THE GAME** (the quests from THE STOLEN ONES, the shop, the healer, the secrets, the way on to the temple).
