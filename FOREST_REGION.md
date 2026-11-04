# FOREST REGION -- the land round the Forest Temple (Colin, Nov 4 2026)

> *"It's a good start but it's very local -- you jack in and you're right at the entrance. Temples will be in somewhat hidden parts of the
> broader map."*

Region 1 of WORLD_PLAN.md: **Forest / Grow, the GIANT realm** -- you feel small: huge mushrooms with glowing spots to bounce on, giant lily pads
that sink as you stand, vines to swing on, treehouse villages in giant trees. This doc covers the piece of it round the domed temple
(`?w=forge&zone=dometemple`, KORAJIN > The Forest Temple). The temple building (m2144, `DOMET`) and its interior (a separate zone, entered by
the door: `DOMET.door`, another worker's) are not this doc's.

## Vision
You arrive at the EDGE of the forest on a high knoll, through the purple portal. Far below and ahead, between giant trunks, something pale
shows in the haze -- a colonnade, a moss dome. Nothing leads straight there. A trail runs along the plateau to a cut in the ground: a narrow
gorge winding down between mossy cliffs, and at its foot the gorge opens into a HIDDEN VALLEY ringed by cliffs, where the temple sits in a
sunlit clearing. Later: the gorge passes behind a waterfall; the plateau is a giant's forest floor (mushrooms, ferns, roots taller than him);
a pond of lily pads; vines over a drop; a climb up giant roots to a high platform.

## Built to drop into a world map
- **One local origin**: the temple's centre (0, 0, 0). Everything is placed relative to it; the region moves as one.
- **Footprint**: a disc of radius `FREG.R` (222 m). Drawn terrain only inside it; the backdrop ring at 330 m.
- **The edge** (`FREG.edge`): the land climbs into a steep wall from r 174 to 192, EXCEPT where it meets the wider world (`edge.links`):
  - `trail_out` (south): the trail leaves the region past the arrival knoll; blocked by boulders (`trail_end`) until the world map joins it.
  - later: the river out (west), through its own gorge.
- **Budget** (headless, from `npm run foreststrip`): 63-96 draw calls, 385-450k tris on screen (was 55-67 / 330-360k for the clearing alone);
  terrain 53.8k tris (48.3k floor + 5.4k cliff), 78 plateau giants with cheap crowns. Dials: `FREG.cell` (2.5 m), `FREG.forest.n`.

## The map (top-down, +Z = south = the temple's front; not to scale)
```
                         N  (edge wall: steep, impassable)
             . . . . . . . . . . . . . . . . . . .
          .     plateau giants (y ~21-27, rolling)     .
        .          ______________________                .
       .         /   cliffs (rim 21 m)    \               .
      .         |      HIDDEN VALLEY        |               .
      .         |        (y 0)              |               .
      .         |      [ TEMPLE ]  o        |               .
       .         \______    |    _________/               .
        .               \   | gorge (winds, 0 -> 22 m)     .
         .               \__|__                           .
          .                    \ gorge head (16, 124)     .
            .     trail  ______/                         .
              .  _______/                              .
               [ARRIVAL knoll (-36, 170), y ~39]  . .
                    |  trail_out -> the wider world (S)
```

## The data (`FREG`, between `SC_FREG:START/END`; `frgH(x, z)` is the one height function)
| row | what |
|---|---|
| `valley` | flat floor to r0 ~47, cliffs to the rim (21 m) by r1 ~67; radii wobble with the angle |
| `plateau` | the forest floor above the rim: rolling (`roll`), climbing `rise` m toward the edge |
| `gorge` | the only way down: a polyline, floor ramping 0 -> the plateau (max ~15 deg), walls `wall` m per m |
| `trail` | the arrival to the gorge head; path stones are a ribbon laid on the terrain (`frgRibbon`) |
| `arrive` | the lookout knoll (+13 m bump) -- the ENTRY row lands him here, facing the temple |
| `edge` / `block` | the region wall and its open links; the boulder pile where the trail leaves |
| `forest` | the plateau giants: spaced `sp`, kept out of the gorge / trail / the SIGHTLINE lane (`frgKeepOut`) |
| `shots` | the render strip's cameras (`npm run foreststrip [ids] [--night=1]`) |

**Collision**: the terrain is the mesh collider (`COLL.zones.dometemple`, `force: 1` -- it has no BOXES fallback). The temple's and the
trunks' boxes are `collKeep` so the mesh never replaces them. Cliffs are steeper than `walk`: walls. Stair risers stay <= .32 m.

## DONE WHEN (each box ticked with evidence in a NOTES entry; the last one is his)
- [x] (m2433) region bones: one origin, the footprint, the edge with its link, the hidden valley + cliffs, the gorge, the trail, the arrival
      knoll moved OFF the door (ENTRY row), the dome glimpsed from the knoll, the terrain as the mesh collider, a render strip tool
- [ ] the FOREST KIT sandbox (WORLD_PLAN 1): ~6 plant species (giant glowing bounce mushrooms, giant ferns, vines, giant lily pads, ground
      cover, alien flowers), rocks S/M/L, ground (moss, roots, leaf litter, path stones), each with a day + NIGHT glow and a tri budget
- [ ] the region dressed with the kit (giant scale: he feels small), the plateau a forest floor (not lawn), the cliffs mossy rock
- [ ] water: a spring -> a pond on the plateau -> a WATERFALL over the gorge (the path passes behind it) -> a stream through the valley -> out west
- [ ] traversal toys: bounce mushrooms, sinking lily pads on the pond, swing vines over a drop, a climb up giant roots to a high platform;
      routes on four tiers (valley 0, gorge, plateau ~22, high above ~40)
- [ ] day / dusk / night all beautiful (NIGHT.md: a `dometemple` flora row, glowing mushrooms / veins, the region under the night sky)
- [ ] phone-fast: draws / tris reported per pass, held near ~100 calls / 450k tris
- [ ] the door's interact point handed to the interior zone (`DOMET.door.enter`)
- [ ] **his sign-off, on his phone**
