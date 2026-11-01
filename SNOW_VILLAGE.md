# SNOW VILLAGE -- brief (Colin, Nov 1 2026)

> *"Set another worker up to build this building. It's gonna go in the snow world. We need to build a village -- probably should've built the village
> before the temple, but the temple can be moved."*

Concept: `images/concepts/snow_village/hut_sheet.webp` -- the SNOW VILLAGE HUT: a round stone base with a gold-trimmed meander band, a thick snow-laden
thatch roof with icicles, crossed timber gable beams with a glowing jade plaque, a stone chimney with smoke, warm glowing lattice windows, wooden door
posts with lanterns, a red banner with the Korajin emblem over the door, stone steps, barrels and pots, a jade crystal lamp post, a snowy fence with
banner posts. Palette: snow white, stone grey, timber brown, gold, banner red, jade.

## What to build
1. **The HUT as a code-built kit piece** (or Tripo-ready brief if that path is chosen): one function, a pure function of its options (size, door side,
   banner on/off, chimney on/off, a variant seed), merged per material (few draws), colliders as boxes (walls, the steps walkable at risers <= .30),
   a pushable snow patch on the roof (`patchAdd`) if it can be stood on. Warm window glow, chimney smoke (the existing puff pools), lanterns.
2. **The VILLAGE**: the Snowfield's ENTRY end becomes the village -- a cluster of 6-10 huts (variants), paths stamped into the snow, fences, banner
   posts, barrels, a well or fire pit, lamp posts -- placed by a TABLE with stable ids (SCENE_COMPANION.md). Spread it on several HEIGHTS (VERTICALITY:
   terraces, a raised longhouse, steps), not all on y 0.
3. Leave the temple where it is for now (the temple session owns it; it is ONE placement and can be moved). Coordinate positions, not code.

## The existing Snowfield (`?w=forge&zone=snow`, `snowStage` in index.html) -- do not build on top of
- spawn ~(0, 8); willow + shrine terrace at (-24, -22) r ~11; frozen pond at (27, 30) r ~11
- the climb + lair: x -26..40, z -98..-42 (cliffs to 9.5 m, lair dome at (4, 9.5, -86)); dragon lives there
- snow kit: grotto (60, -14), rock bridge (-46, 22), standing stones (-44, 52), crystal spire (56, 48)
- tame mammoth (16, 22); calf herd round (6, 52); field is 160 m square centred on 0; the ice temple is the temple session's
- free areas: the south / south-east of the field (z +20..+75, x -75..+0) is the most open -- a good village site near the spawn

## House tools to reuse
`snowTriMat(tex, scale, col, rough, vc)` painted triplanar (textures/snow_rock|snow|bark|needles|ice.webp), `snowKitIce()`, `patchAdd` (pushable
snow on tops), `rough()` in `snowCliffs` (rounded lumpy blocks), `plantBlob`, `puffPool`/SMOKE puffs, `texGet`. Painted textures can be made with the
image API (the session's proxy has an OpenAI key; model `gpt-image-1.5`) and made seamless by a half-offset blend (see NOTES m1995).

## Rules
Push to main, `npm run bump` (via the push script) + `npm run check` (4 "boot ok") before every push, NOTES entry at the top per build, label builds,
say "shipped unverified". Keep edits inside your own functions/tables (two other sessions edit index.html: the main snow session and the temple).
