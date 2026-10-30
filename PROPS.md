# THE PROP LIBRARY -- the shared tertiary assets (his, Oct 28 2026)

> *"Another thing we should develop for the library of assets is plants. Plants are really great. Pots and pans, plants, tables, benches -- a shared
> library -- but definitely a nice mix of plants of various sizes and styles that are dynamic, move, flow in the wind, but you can also kinda hit
> them. Trees, cactuses, Japanese, alien plants, ivy... rocks, water features, a nice courtyard, fountains, fences, blocks, ladders. Detailed passes
> on all of those tertiary items would really bring this all together."*
>
> *"The first pass on anything is never good; what makes it good is like 10 passes."*

**The rule:** every prop is built ONCE, in a shared kit that any builder calls (the dojo, the forge buildings, Grumbo's home, the Ship, the
levels). Each family has its own SANDBOX under SPAWN > BUILDINGS, where every item stands on a plain floor in three sizes plus a mixed scene. It
gets about TEN passes there before it is called finished.

**The budget:** one InstancedMesh per type, so a whole garden of one plant is ONE draw. Vertex colours on a shared material, so nothing needs a
texture.

## Families (in the order they get built)

| family | items | sandbox | status |
|---|---|---|---|
| **PLANTS** | cherry, pine, saguaro, agave, bamboo, fern, Jin bulb, grass. Next: ivy (climbing walls), maple, bonsai, moss, reeds, lilies, alien bulbs and fronds, flowers, hanging vines, potted plants | Plant Library | pass 1 (m1425) |
| **JINRA VESSELS** (his sheet: `images/korajin/ref/jinra_sheet.jpg`) | glowing bottles and flasks (corked, spiral-bellied, gourd), canisters (iron-banded barrels with glass windows, globe tanks on legs, tube columns), crystals and crystal clusters, a dripping basin, a Jinra lantern, an amulet, the teal Jinra banner; the liquid is translucent mint with motes | Jinra Refinery (Red Hollows, Worker B) | pass 1 (m, Worker B): `jvesMats()` / `jvesPut(put, M, kind, x, y, z, s, ry)` -- kinds round, gourd, tall, spiral, canister, globe, crystal; drops into any builder's own `put`, merging per material |
| **ROCKS** | boulders in the sandstone of the Red Hollows, river stones, stepping stones, scree, standing stones, moss-capped rocks | -- | |
| **WATER** | fountains, basins, spouts (bamboo shishi-odoshi), ponds with lilies, streams, small falls; JIN springs (KORAJIN.md) | -- | |
| **COURTYARD** | stone lanterns, benches, tables, gravel beds, paths, planters, gates, wells | -- | |
| **FENCES + BLOCKS** | bamboo fences, timber rails, stone walls, crates, barrels, sacks | -- | |
| **HOUSEHOLD** | pots, pans, kettles, bowls, a stove, shelves, mats | -- | |
| **CLIMBING** | ladders, rope ladders, scaffold poles (the hero kit's scaffold, shared) | -- | |

## How plants work (pass 1)

- **Building:** `plantKind(name)` builds a type's geometry once from `PLANTK[name].make()`. `plantPlant(rec, kind, x, y, z, s, yaw)` + `plantFlush(g, rec)` put them down, one InstancedMesh per kind.
- **The wind:** applied in WORLD space in the vertex shader, as a gusting field that rolls across the ground, so neighbours sway together. Weighted per vertex by `aSw` (0 at the root, 1 at the tips). Leaves flutter (`aFl`). Jin parts glow (`aGl`).
- **Being hit:** every instance has a SPRING (`iB`): the katana's sweep and anything through `bldHit` (bolts, rockets) push it away from him, and walking through a plant brushes it aside. It whips back and wobbles. A blow never stops the shot.
- **Per-type numbers:** `PLANTK.<kind>.stiff` (how far the wind moves it), `.bend` (how far a blow does), `.h` and `.r` (its size for hits). `PLANT.wind`, `.k`, `.damp`, `.hitK` and `.brushK` are live on `mel.PLANT`.

## Pass plan for the plants (one pass = one build)

1. ~~eight types, the wind, the hit springs, the sandbox~~ (m1425)
2. shapes: real silhouettes per type (the cherry's canopy in clouds of blossom, not blobs; the pine's layered skirts; agave leaves with a spine)
3. ivy: a climbing kit that grows over a box or a wall face
4. variety: a seed per instance changes colour, lean and proportions, so no two match
5. hit feel: petals and leaves knocked off (particles in the type's colour), a cut flower or bamboo top falls
6. more types: maple (red), bonsai, reeds, lilies, flowers
7. alien: Jin-touched variants that glow mint where they are hit
8. placement: `plantScatter(area, mix)` to dress any lot or island with a mix
9. LOD: far plants as cards (a draw-call budget for a whole valley)
10. into the world: the dojo islands, Grumbo's home and the forge buildings dressed from the library
