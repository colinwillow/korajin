# TEMPLE LAYOUT -- the interior generator (Colin, Nov 1 2026)

> *"The temples are mostly interior and underground -- the part you see is the tip of the iceberg. A parkour obstacle course whose logic is amazing,
> blocked out so it's fun to run; layer one, two, three, four; a giant statue on a mesa in the middle that you can tell will come alive; obstacle course in
> three dimensions round the edges; enemies at gates; puzzles; bridges over bridges. A 3D maze builder we can get a blueprint from."*

## Getting in
Seamless, not a loading screen: the temple door opens on a long DESCENT (stairwell / ice-lift shaft) -- the outside unloads and the chamber loads while
you walk. The descent sells the iceberg.

## The tool (v1 shipped: KORAJIN > Temple Layout, `?w=forge&zone=tlayout`, `TLAY` / `tlayGen` / `tlayStage`)
1. **Beats in** (`TLAY.beats`): entry, path, gate, puzzle, acro, miniboss, chalice ...
2. **Route graph out** (`tlayGen(seed)`): nodes = platforms (size by beat), edges = MOVES from TEMPLE_KIT's table, each gap and rise drawn inside the
   move's COMFY range -- walk bridge, stairs (.3 risers), run jump, double jump, drop, wall run (a real wall), chimney (two walls 4.6 m apart), high bar.
   The route spirals up an outer ring and CUTS ACROSS to an inner ring (bridges over bridges); a node too close to another is rejected.
3. **Centrepiece**: a mesa in the middle with the dormant giant; the route ends on a bridge to it (the boss arena after the chalice).
4. **Blockout** (`tlayStage`): grey boxes, colour by beat (orange posts = gates where enemies spawn, cyan = puzzle switch, gold = chalice), the route as
   a thin line, a dark cylindrical chamber. Real colliders, so it is playable at once. TOOLS > LAYOUT: NEW SEED rerolls.

## Next versions
- v2: the route CHECKER as a gate (simulate each edge with the real movement, flag any at the limit), branches (short side paths with rewards),
  loops back over earlier sections, per-beat set pieces (the gate arena's spawn ring, a puzzle with three switches on three routes)
- v3: hand edits -- pin a node, drag it, reroll the rest; export the graph as a placement table (SCENE_COMPANION) to dress with a kit (the ice temple's)
- v4: the statue wakes (STATUES.md) when the chalice is taken; the descent entrance

## HIS STRUCTURE IDEA (Nov 1 2026, "not 100% sold -- a brief concept to explore") -- `images/concepts/ice_temple/layout_hub.webp`
- The ENTRANCE is above ground and is a puzzle in itself: beat some guys, earn / find a key, shoot 4-6 buttons -- TBD.
- Inside: ONE CENTRAL CHAMBER ringed by SUB-CHAMBERS (six in the art; maybe three). Each sub-chamber has its own dynamic -- puzzle, acrobatics, enemies,
  or a mix (acrobatics under fire, a puzzle with guards, one mostly a fight). Completed in any order.
- A sub-chamber can award something -- a power-up / weapon / special ability -- that the boss needs.
- The CENTRAL chamber has all three (acrobatics, enemies, a little puzzle) and ends with the GIANT BOSS (the dormant statue on the mesa).
- The art's six: puzzle (logic / mechanism), combat, traversal (parkour / climbing), glide (aerial / wind), balance (weight / pressure), elemental
  (wind / flow / rotation). Section view: several vertical levels, a light shaft down the middle.
