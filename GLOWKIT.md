# GLOWKIT -- the glow dressing kit (crystals, glowing ivy, moss, mushrooms)

KORAJIN > The Glow Garden (`?w=forge&zone=glowkit`). Code: `GLOWKIT` / `GLOWG` between `SC_GLOWKIT:START` / `:END`, builders `GKF.*`,
`glowBuild` / `glowAdd` / `glowSet` / `glowHit` / `glowStep`. Renders: `npm run glowshot` -> `images/renders/glowkit/`.

## His ask (Nov 6 2026, looking at the forest temple's flat green diamond over a plain pedestal)
*"Spend some time in a sandbox and then obviously implement it... making them look super fucking cool, because whether they're relevant or not,
anything that's untextured and without much detail, especially things like crystals... I love the idea of different glowing crystals, even if
they're not the main JINRA crystals: throughout different temples, weird crystals growing out of corners of walls, and glowing ivy, glowing moss,
glowing mushrooms. Those kinds of things really spruce up the level."*

## How it is built (SCENE_COMPANION.md)
- A ROOM is a table `{ id, seed, place: [rows] }`. Every row: a stable `id` (`<room>_<thing>`), a `kind`, `at`, and its own params
  (`n` the surface normal, `n2` a second wall for a corner, `pal`, `size`, `count`, `seed`, `r`, `len`, `strands`, `w`, `form`).
- `glowBuild(R)` is a pure function of the table: seeded per row, it returns `{ g, cry, org, mot, hits, ids }`. `glowAdd(R, parent)` puts it in
  the world. `glowSet(B, id, glow, pal)` re-lights one piece (a socket that gets its shard) by rewriting only that piece's vertex range.
- **THREE DRAWS PER ROOM, whatever is in it**: every crystal goes in the CRYSTAL sink, every plant / moss / mushroom / geode crust in the ORGANIC
  sink, every sparkle / spore / halo in one Points cloud. The three materials are shared by every room (compiled once). **No shadows** cast.
- **Nothing moves on the CPU.** Sway, the brush shiver (the player's position and speed), the hit ring (four slots), the hero shard's float and
  spin, the satellites' orbit, the pulse, the spores' rise -- all in the shaders off `GLOWKIT.U`. `glowStep` writes four uniforms a frame.

## The kinds
| kind | what | params |
|---|---|---|
| `prism` | a cluster of faceted crystals with BEVELLED tips (an irregular 5-7-gon body, a second ring of facets under an off-centre point), one leader, the rest leaning out, a grit fringe at the foot | `n`, `size`, `count` |
| `geode` | a burst out of a wall (`n`) or a CORNER (`n` + `n2`): a broken rock crust with a glowing lip round a crater of crystals fanned over the hemisphere | `n`, `n2`, `size`, `count` |
| `shard` | THE HERO SHARD (the temple sockets'): 10-sided, double-bevelled, a hot layered core, growth crystals off its flank, six real satellites trailing comets of motes; floats and turns; `seat` adds the aged-bronze SETTING (4th draw) | `size`, `spin`, `seat`, `sats` |
| `stal` | crystals hanging from a ceiling, long and thin, pointing down, with rubble at the root | `size`, `count` |
| `grit` | tiny crystals over a floor disc, sparkles over some | `r`, `count` |
| `ivy` | strands CRAWLING up a wall (a smoothed random walk in its plane, 2-4 cm off it), leaves alternating, glowing buds | `n`, `len`, `strands` |
| `drape` | strands over an EDGE: along the top face, over the lip, hanging in a sag that sways more toward the tip | `n` (out of the edge), `w`, `len`, `strands` |
| `moss` | a lumpy irregular patch hugging any surface; its glow spotted by a 3D noise; spores drift off | `n`, `r` |
| `shroom` | a clump: dome / bell / flat caps on bent tapering stems, or `form: 'shelf'` half-caps out of a wall; glowing GILLS and SPOTS, rising spores | `n`, `size`, `count`, `form` |

## The look
- **Crystal**: a glossy lit faceted body (flat shading) + an INNER CORE seen through it: three samples marched INTO the crystal along the view ray,
  each its distance to the crystal's own axis, banded along the axis -- so the core shifts with parallax as he walks round (faked refraction) --
  + a fresnel rim, brighter toward the tip, a slow pulse; a hit flashes it.
- **Colour per temple** (`GLOWKIT.pal`): forest TEAL with a green-gold core (mint is Jinra's only, BUILDINGS.md), desert amber, lake blue, snow
  white-violet. Metals never black (CRAFT.md 4): the sockets' bronze carries a warm emissive floor.
- **Motes**: sparkles (twinkle), spores (rise and fade), soft HALOS (a big faint additive disc on each cluster: the bloom this game has no post
  chain for).

## The reactions
- **Brush past**: within `look.shiverR` of a piece, moving, it shivers (scaled by his speed).
- **Hit a crystal** (a sword, an arrow, a blast -- `glowHit` from the melee sweep and `bldHit`): it RINGS (a synthesized glass chime, pitched by
  its size), flashes and shakes in a 2.2 m radius, and sparks in its colours.

## Budget
- A room's dressing: **3 draws** (target <= 6). The whole Glow Garden (the showcase): 4 draws (the setting), 186k triangles, 585 motes (m2708).
- Temple rooms stay under **70 draws / 280k tris with shadows**; the glow pieces cast none.

## The Glow Garden (the sandbox)
A dim stone court (forest temple stone), 32 x 26 m, walls 9 m, open to the south where he lands. VERTICALITY: the prism stair climbs .6 -> 2.4 m,
geodes burst out of the west wall at 1.4 and 4.2 m and its NW corner, stalactites hang from a gallery 7 m up (NW), the dressed corner (NE) is a
terrace 3 m up (a .30 m stair), the hero shard floats at head height over a bronze-ringed pedestal.
- A. PRISMS: the four temple colours on four plinths (west). B. GEODES: west wall + NW corner. C. HERO SHARD (+ an amber one). D. STALACTITES.
  E. GRIT. F. IVY (north wall) + DRAPE (off the gallery). G. MOSS. H. MUSHROOMS (floor clump, tall bells, wall shelves). I. THE DRESSED CORNER.

## DONE WHEN
- [x] All four families (crystals x5 kinds, ivy, moss, mushrooms) laid out in the sandbox with a dressed corner vignette; close renders (m2704).
- [x] Polished from the renders (m2705): bright FACET EDGES (barycentrics, quad diagonals hidden), a tight parallax core + inclusions over a dark glassy body, facet glints; moss with tufts and crisp spots; mushroom rims/gills glow; geode crust lit stone. ("Genuinely great" is his call on the phone.)
- [x] CRAFT.md on the close renders (m2705): ivy/drapes are Catmull-Rom curves, tapered, sagging, swaying; crystals sunk into their host; the geode crust sits on the wall; bronze warm; nothing black.
- [ ] Brush shiver and hit ring/chime/sparks felt on his phone.
- [x] The forest temple (m2711): the Well's six sockets carry the hero shard in its bronze setting (dormant -- dim, still, no motes -- until
      earned, then lit in the Jinra colour, floating and turning; `ftinSockets` -> `glowWake`); the hub, A, B, C and D dressed (`SC_FTGLOW`), 3 draws
      a room, culled with it. Measured on the shipped text (`npm run glowshot -- --zone='ftemple&at=hub' --views=ft`): worst view the hub,
      46-54 draws / 254-258k tris with shadows (<= 70 / 280k). E is not dressed (its walls must stay bare); F and the boss room do not exist yet.
- [ ] **His sign-off on his phone.**
