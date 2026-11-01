# ICE TEMPLE -- THE BLUEPRINT (step 1 of 3: blueprint -> grey blockout -> look)

> **RESCOPED (his, Nov 1, after the m2017 blockout):** *"The inside of the temple will be UNDERGROUND -- massive. We're building the ENTRANCE to the
> temple, not the temple itself: the tip of the iceberg. And it's two feet from the rest of the ice world -- I pictured it five times farther away,
> if not more."* So: what stands above ground is the ENTRANCE only (the concept art: moat, braziers, forecourt, towers, the stair, the emblem door,
> the crown and horns as silhouette), 1.5 km out at the head of a ~1.4 km valley; behind the emblem door a grand stair DESCENDS to a sealed LOWER
> DOOR. Beats 4-9 below (the hall, the ring, the three crystals, the crown, the chalice, the boss) belong to the UNDERGROUND temple -- a blueprint of
> their own when that comes; nothing of them is built above ground any more.

His brief: `ICE_TEMPLE.md`. The rules and the move table: `TEMPLE_KIT.md` (comfy = 80% of the measured max; a gap is never wider than its move's
COMFY distance, a ledge never higher than its COMFY height, unless it is a skill check on purpose and marked **SKILL**). Concept: `images/concepts/
ice_temple/big_*` (his pick). **Nothing here is built yet. Mark it up; the blockout follows his changes.**

## 0. Where it is: the Snow REGION

```
          N (-z)
            ^                                     THE TEMPLE  (head of the valley)
            |                                  [ at (80, 24, -300), faces +z ]
            |                                         .-----.
   x -26..40, z -98..-42                              |  T  |
   THE CLIFFS + the dragon's lair (4, 9.5, -86)       '--+--'      valley floor climbs 0 -> +24 m
   = the valley's WEST wall                              |         in three terraces (beat 0)
                      ______________                ___|___
                     /  cliffs/lair \   ||  VALLEY  |  terrace 3 (+18..24)  z -250
                    /________________\  ||  x 45..120|  terrace 2 (+12)       z -190
                                        ||  aqueduct |  terrace 1 (+6)        z -130
   +---------------------------------+  ||  on the   |  the frozen river      z -60
   |   THE SNOWFIELD (160 m, centre 0)|==++  E wall  |
   |   = the VILLAGE / ENTRY end      |  valley mouth at (75, 0, -45): the temple is SEEN from here, 255 m away
   |   willow, pond, mammoth, kit     |
   +---------------------------------+
```

- **Placement:** ONE row `{ id: 'ice_temple', at: [80, 24, -300], yaw: 0 }` (temple-local +z = the front, down the valley). Every part below is in the
  temple's LOCAL frame (origin = the foot of the grand stair, on the forecourt floor); moving it is changing that row. The valley is its own table
  (`ICE_VALLEY`), built around the placement so it moves with it.
- **Why there:** it is the far end from where he arrives, the lair on the flank is on the way (optional detour), and the valley mouth gives the
  long sight line the concept's background promises.

## 1. The beats (TEMPLE_KIT section 4, filled)

Heights are WORLD metres above the snowfield (forecourt = +24). Every move is a row in TEMPLE_KIT section 1.

| # | beat | what happens | moves it teaches / tests (sized) | height |
|---|---|---|---|---|
| 0 | **Approach: the valley** | 255 m up a frozen river between cliffs; pines; the aqueduct on the east wall; the temple at the end, always in view | **terrace faces** 6 m: a wall-run UP from a SPRINT lane (lip 3.6 comfy -> a 3 m face + a 3 m ledge step) or the slow way, a switchback path; **first run wall**: a 6 m icy wall at the river bend (side run comfy 5.5-6.5), a 2 m-high deck at its end; **the river ice** slides (the pond's ice) | 0 -> 6 -> 12 -> 18 -> 24 |
| 1 | **Initiation: the moat** | the frozen moat (30 m wide) round the forecourt; the outer gate is shut. **Puzzle:** light the three crystal BRAZIERS (strike each) -> the outer gate rises | **ice floes** across the moat: gaps 5.0 m (run jump comfy 5.9); **brazier 3** sits on a balcony 12 m up, reached by a **short chimney** (two walls 4.6 m apart, ~7 kicks at +1.7); braziers 1-2 on plinths 2 m (jump 2.2) | 24 (moat) -> 26 -> 36 |
| 2 | **First guards** | the forecourt, 40 x 30 m, plinths of 1 / 2 / 4 m; two stone ARCHERS wake on the side towers (+12 over it), three swordsmen / the temple dweller (OLMEC) pour out of the side arches | **using height**: plinths at jump (2.2) and double (4.0) so he can get above them; the 4 m plinth is a **wall-up face** from a run (2.7) + ledge | 27 (+1/+2/+4) |
| 3 | **The door: the emblem gate** | the compass-star ROUNDEL over the door is sealed by two SEALS on the horn arch's shoulders, 22 m over the forecourt; break both -> the roundel rolls aside | **left shoulder**: a CHIMNEY between the side tower and the banner pillar (4.6 m apart, 22 m = 13 kicks, a rest ledge at 11); **right shoulder**: the side-tower roof (+12, reached by a wall-up from a sprint 3.6 + a ledge) then a **HIGH BAR** for height (11.9 comfy up) onto the shoulder; drop to the door (any fall is safe) | 27 -> 49 -> 27 |
| 4 | **Acrobatic hall** | the tallest room: 30 m wide, 70 m long, 40 m tall, an ice CHASM down its middle (a fall drops 15 m to the hall's undercroft, a chimney back up); archers on the galleries | **side wall runs** along the chasm's ice walls, 6 m runs with 3 m decks between (run 5.5 comfy); **swing ropes** from the icicle chandeliers (9 m ropes, 7 m apart); a **high bar** for height onto the first gallery (+11); **monkey bars** under the frozen ceiling ring to the second gallery (rungs .95, the drop under them is the threat); gaps between deck islands 5.5 m (run jump 5.9) | floor 27, galleries 38 / 50, undercroft 12 |
| 5 | **Mini boss: the ring chamber** | the ring arch's round chamber, 30 m across; the **JACKAL GUARDIAN** (m1986) wakes off its plinth when he steps through (an EVENT: the hall's exit gate closes behind him) | fighting + movement: **tiers** 2 m and 4 m round the rim (jump / double), **four ice pillars** to wall-run UP (3 m lips from a run) and drop strikes from | 50 (+2/+4) |
| 6 | **Second puzzle: three crystals, three routes** | three switch-crystals light the crown bridge; each is reached a DIFFERENT way | **(a) the horn**: an 18 m chimney inside the horn arch's foot (4.6 m), out onto the horn's curve; **(b) the aqueduct**: outside along the aqueduct span -- three side runs with kicks between (6 m runs, 5.7 m out), one gap of 7 m with ONE air kick (**SKILL**, a net below); **(c) the frozen waterfall**: down into the fall's cave, a ledge column (ledges every 2.5 m) up its back wall | 50 -> 68 (a), 56 (b), 40 -> 52 (c) |
| 7 | **More guys: the crown terrace** | the terrace under the crown crystal: archers on the horn tips (+12 above), stone samurai and swordsmen below; the BOW (m1929, the bow down) earns its keep here | tiers of 2 m between the terrace's three levels; the archers' perches reachable only by a **long-jump wall-run** (8.5 comfy) -- or shot down | 62 / 64 / 66 |
| 8 | **The chalice** | inside the crown crystal; take it -> EVERY statue in the temple wakes (the Jackals lining the hall, the Osari spiders, the stone archers, STATUES.md) -> fight OUT: back down the hall, now with the statues awake; a **zipline** from the crown to the forecourt is the shortcut that opens | the full kit, reversed: the hall's ropes and runs DOWNHILL with company; the zip (ZIPS) down 38 m | 62 -> 27 |
| 9 | **The boss: the frozen moat** | the FOUR-ARMED STONE GUARDIAN (GUARD, 8.8 m) rises through the moat ice; the arena is the moat (sliding ice) with the floes as islands and the forecourt as high ground | the floes (5 m gaps), the forecourt edge as a **wall-up face** (3 m from the ice), the braziers' plinths as cover | 24 / 27 |

## 2. The height profile (side-on, the route in order)

```
 m
 68 |                                              (a)*
 66 |                                                  .--crown--.
 62 |                                               .-'  7    8   \
 56 |                                          (b)*                \     <- the zip (8) back down
 50 |                        door seals*   .--ring--.(c)*            \
 49 |                          3 .------.  |   5    |                 \
 38 |                       ____/ hall gallery 4 /  '                 \
 36 |               brazier3*|                /                         \
 27 |        moat 1 ___forecourt 2___/ hall floor 4                      '--forecourt-- 9 (boss, moat 24)
 24 |  .------'
 18 |  terrace 3
 12 |  terrace 2
  6 |  terrace 1
  0 |__valley mouth 0__________________________________________________________________________________
       0          1-2        3          4           5        6           7-8          (back down)  9
```

A rollercoaster: up the valley (24 m), a dip into the forecourt fight, UP the door (+22), the hall (up to +23), the ring, the three spread
switches (to +41), the crown, the chalice, then everything reversed at speed, and the boss at the bottom where it began.

## 3. The building, top-down (temple-local metres; +z = the front)

```
                         z -110  .---------------------------.
                                 |   CROWN terrace (7,8)     |   crown crystal + chalice, y 62
                                 |  horn L .  ring  . horn R |   horn arches rise to ~+85 (the silhouette)
                         z  -80  '-------.  RING (5) .-------'   30 m round chamber, y 50
                                         |    30 m   |
                         z  -65  .-------'-----------'-------.
                                 |      ACROBATIC HALL (4)   |   30 x 70 m, ceiling y 67
                                 |   gallery  CHASM  gallery |   galleries y 38 / 50, chasm floor y 12
           aqueduct (6b) ======  |   |        ~~~~~~      |  |  ====== frozen waterfall (6c) off the east side
                         z    5  '------.  EMBLEM GATE  .----'   the roundel door (3), seals on the shoulders y 49
                                  tower L | grand stair | tower R      side towers, roofs y 39 (+12)
                         z   10   [b1]    |  .30 risers |    [b2]      braziers 1, 2 on 2 m plinths
                         z   40  ======== FORECOURT (2) 40 x 30, y 27 ======   plinths 1 / 2 / 4 m
                         z   55  ~~~~~ FROZEN MOAT (1, 9) 30 m wide, y 24; floes 5 m apart ~~~~~
                         z   85  -> the valley
                               x -45 ............................ x +45
```

Footprint about 90 m wide, 200 m deep including the moat; crown at +62 (38 m over the forecourt), horns to about +85. That is the Sky Temple's
scale (x2.5), not a bungalow.

## 4. The guardians (TEMPLE_KIT section 5) -- where they stand, how they wake
- **Stone forms on plinths, at several heights, flanking the route** (STATUES.md): Jackal Guardians lining the hall's galleries, Osari spiders on the
  aqueduct, stone archers on the side towers and the horn tips. **Some never wake** (scale and promise: the two giants beside the gate).
- **Wakes are EVENTS, never proximity:** beat 2's archers on the outer gate rising; beat 5's Jackal on the ring chamber's gate closing; everything
  else on the CHALICE (beat 8).

## 5. What the blockout (step 2) will be
Grey boxes only, at these numbers: the valley terraces, the moat + floes, the forecourt, the stair, the towers, the door shoulders + seals, the hall
(walls, chasm, galleries, rope/bar/monkey-bar systems), the ring chamber, the three switch routes, the crown, the zip. Wired to the real systems
(`kitClimbAdd` never; chimneys, `HBAR`, `MBAR`, ropes, `ZIPS`, `smashAdd` for the braziers and seals). No enemies until the spaces play. **One
placement row, a pure builder, its own `ICE_TEMPLE:START/END` block**; the snowfield's own code untouched (the valley joins it at the mouth).

## His answers (Nov 1)
1. **The valley north-east: fine.** Build it so anything can be rearranged later -- every piece is a ROW in the temple's local frame (`ICET.parts`),
   the whole temple one placement (`ICET.at` / `yaw`).
2. **Enemies are not final.** Place them anywhere as MARKERS whose `kind` is one field to swap; the real temples get a strategised layout later.
3. **Story:** the temples are the EVIL force's strongholds (it drained the good world into ruin), so the temple is built INTACT, not fallen. Keep a
   state hook (`ICET.state`) for what it becomes after you beat it -- "transformed into a different zone", to be determined.

## Built
- (m2017) the GREY BLOCKOUT of every beat above, wired to the real systems (chimneys are plain faces, `HBAR`, `MBAR`, `ZIPS`, `smashAdd` for the
  braziers, seals, crystals and chalice; the gates open when their group is broken). Enemy markers only. The ICE TEMPLE key (top centre in the snow
  zone) warps VALLEY > MOAT > FORECOURT > HALL > RING > CROWN. `?ice=0` leaves it out. Unplayed.
## (Asked, answered above)
1. **The valley's direction**: north-east past the cliffs (this sheet) -- or does he want it off another side?
2. **The boss**: the four-armed Guardian rising from the moat -- or the lair DRAGON (it is already in the region) coming down to the temple?
3. **Fallen / restored** (his Nov 1 theme): should the Ice Temple start FALLEN (half-collapsed, the hall's chasm a ruin) and restore when the chalice
   is returned -- the RESTORE kit (m1505)? That changes beat 8.
