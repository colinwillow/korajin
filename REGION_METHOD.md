# REGION METHOD -- terrain and paths first, then places, then polish (Colin, Nov 1 2026)

> *"We are eventually gonna need to re-organize everything -- right now it's very thrown together: the waterfall, the original snow area, the
> long, long corridor to the temple entrance. My vision for the temple entrance was a huge mountain somewhere. I wish there was a procedural way
> to generate a maze carved into mountainsides and valleys: you build the terrain first, make it really interesting, make a bunch of paths; then you
> set waypoints for the areas -- the village, the distant area, the forest, the underpass, the lake, the mountains, the range, the valley with the
> cabin, the sky, the temple, the big wall -- placed strategically on terrain that already has interesting paths. Then you go one by one and spend
> a bunch of time on each region, a bunch of passes each, till each one is dope. Then you develop the in-between areas."*

This is the order big open-world teams work in (macro layout -> points of interest -> region passes -> connective tissue). It replaces the way the
snow region grew (one thing dropped next to the last). **Nothing existing is deleted by it; existing pieces get re-placed onto the new map.**

## The five stages
1. **THE MACRO MAP (terrain + path network).** A whole-region heightmap whose valleys ARE the paths: a maze-like network carved into mountains --
   main valleys, side valleys, dead ends, loops, passes, a few high routes over ridges, one or two big vertical drops. Generated (seeds), judged as
   top-down maps, the best seed hand-edited. Sized from the move table and the phone (draw distance, fog).
2. **WAYPOINTS (the places).** On that map, pick a spot for each region by what the terrain already offers: the village where a valley widens by
   water, the temple on the biggest mountain (seen from far, reached last), the lake in a basin, the forest on a slope, the big wall across a
   valley mouth, the cabin up a side valley, the underpass where a path crosses under another, the sky/high places on peaks. Sightlines between
   them (you see the temple mountain from the village).
3. **BLOCKOUT the macro.** The terrain and the path network built in the Snowfield (or a new larger zone) as grey/snow ground, the waypoints as
   markers, playable end to end: walk from the spawn to the temple mountain.
4. **REGIONS, one at a time, many passes each.** The village first (VILLAGE_BLUEPRINT.md, its ten passes), then the next. A region is done when he says so.
5. **THE IN-BETWEEN.** The connective paths: dressing, small encounters, rests, views, shortcuts that open later.

## The generator (stage 1), proposed
- A coarse grid (e.g. 12 x 12 cells of ~40 m): a MAZE over it (a random spanning tree) plus a few extra links (loops, so it is not one corridor),
  a few cells marked as basins / peaks.
- Carve: start from noisy mountains; along every maze edge lower a valley (width and depth varied, floors that rise and fall); at chosen edges a
  pass over a ridge, a gorge, a tunnel/underpass; peaks left between.
- Output, per seed: a top-down shaded map with the path graph drawn on it and its numbers (path length, climb, the highest point). Many seeds;
  he picks one; it gets hand-edited.
- Then the same heightmap drives the game's terrain, so what he picked is what he walks.

## Where the village stands
The village blueprint keeps going, but its SITE (pass 2) depends on the macro map: **stage 1-2 come before village pass 3**, so the hamlet lands
where the map gives it a reason (a widening valley by the spring) instead of in the field's corner. Pass 1 (why) carries over unchanged.

## Stage 1, first run (Nov 1 2026): `python3 tools/regionmap.py [seeds]`
Writes `images/concepts/region/map_<seed>.png` + `.json` (nodes, floors, links, kinds, waypoints -- what the game will read) and `maps_sheet.png`.
16 places by Poisson-disc spacing (82 m apart), a random spanning tree over near neighbours + 3 non-crossing loops, carved into noisy mountains:
valleys (red), passes over a ridge (purple), gorges (blue), tunnels (dashed, not carved); valley floors rise with distance from the spawn (the
region climbs toward the temple); the temple node sits on a massif. Waypoints are SUGGESTED (village = a junction near the spawn, lake = a basin,
cabin = a high dead end, big wall = mid-route, lookout = the highest place). Knobs at the top of the file: NODES, MINSP, MAXL, LOOPS, SIZE.

## Stage 2: THE PICK -- seed 6 (Nov 1 2026, his: "I trust your judgment")
Map: `images/concepts/region/region_pick.png` (+ `region_pick.json`: each place's node, position and floor height). `tools/regionpick.py` redraws it.
Why seed 6: a short entry (spawn -> a gorge -> a pass -> the village), the village at a junction with its own loop (gate <-> hot spring <->
meadow), one clear spine south to a big junction (the BIG WALL), side branches that are worth a detour (forest / caves loop with a tunnel, the
lake and the waterfall up a dead end, the cabin, the standing stones), and the temple on its own mountain at the far corner, reached last,
through the DRAGON'S GATE -- so the shield comes before the dragon, and the dragon before the temple (his order).

| place | node | floor | what goes there (existing piece re-placed, or new) |
|---|---|---|---|
| SPAWN | 5 | 2 m | the start; a gorge leads out |
| WILLOW SHRINE | 15 | 5 m | the willow + shrine terrace (exists) |
| VILLAGE (gate) / HOT SPRING | 14 / 2 | 14 / 18 m | the hamlet (VILLAGE_BLUEPRINT.md): the gate at 14, the spring + shrine at 18; the loop between them is the hamlet's gorge |
| MAMMOTH MEADOW | 0 | 20 m | the tame mammoth + the calf herd (exist); the widest valley |
| BIG WALL | 9 | 27 m | a great wall across the valley junction (new) |
| PINE FOREST | 13 | 25 m | the pines (exist, moved), a forest crossroads |
| STANDING STONES / CABIN | 7 / 3 | 41 / 44 m | the standing stones (exist); a hunter's cabin up a dead end (new) |
| ICE CAVES (underpass) | 8 | 31 m | the grotto (exists) grown into caves; the tunnel from the big wall comes out here |
| LAKE / GREAT WATERFALL | 6 / 12 | 28 / 55 m | the frozen pond (exists) as the lake; the waterfall session's GREAT WATERFALL falls from 55 m into it |
| DRAGON'S GATE | 10 | 37 m | the dragon's lair and climb (exist, moved): the junction you must pass |
| TEMPLE STAIR / LOOKOUT | 4 / 11 | 43 / 55 m | the climb to the temple; an outpost on the lookout (the kit's outpost) |
| ICE TEMPLE | 1 | 74 m | the temple's entrance on the mountain (the temple session's interior goes under it) |

**Scale:** the map is 480 m square -- three times the Snowfield's 160 m. The route spawn -> temple is ~670 m and climbs ~72 m.
**Next (stage 3):** this heightmap built in the game as its own zone (snow ground over the carved valleys, walls of the mountains impassable,
markers at each place), walkable from the spawn to the temple, nothing dressed yet. Then the village, region 1.
