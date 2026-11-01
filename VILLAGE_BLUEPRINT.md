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
| 5 | **LANDMARKS + SIGHTLINES** | what you see from the gate, from each tier; the one thing visible from everywhere; framed views | |
| 6 | **THE HIGH ROUTE** -- the parkour layer | the rooftop / aqueduct / tower route, each gap sized from the move table, a ladder (introduce -> combine); the hard-to-reach places and what is up there | |
| 7 | **THE BUILDINGS** -- one row each | a placement table: id, kit piece + options, tier, door facing, who lives there | |
| 8 | **LIFE** | who walks where, the market hours, smoke, lights at night, the animals, the mammoth stable | |
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
