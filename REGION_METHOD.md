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
