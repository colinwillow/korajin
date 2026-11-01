# BLOCKOUT IMPORT -- your Cinema 4D rooms, playable (Nov 1 2026)

Open: KORAJIN > Blockout (C4D import) -- the sample. Yours: put the GLB in `levels/` and open `?w=forge&zone=blockout&file=levels/<yours>.glb`.

## Export
glTF Binary (.glb), metres, Y up (C4D's glTF exporter does this), no Draco needed. Plain cubes are best -- any mesh works, each becomes ONE
solid box from its own bounds, turned by its Y rotation (keep pieces upright; tilt is ignored).

## Names (the prefix decides what it is)
| name | becomes |
|---|---|
| anything (e.g. `wall_1`, `ledge_a`, `floor`, `block_3`, `tower_2`, `stair_1`) | a SOLID you can stand on, wall-run, ledge-grab; tinted by prefix |
| `bar_<id>` | a HIGH BAR along the object's long axis, at its height |
| `zip_<id>_a` + `zip_<id>_b` (nulls or tiny cubes) | a ZIP LINE between them (from the higher end down) |
| `spawn` | where you start |
| `seal_<id>` / `gate_<id>` / `statue_<kind>_<id>` / `beat_<n>` | a glowing marker (behaviour comes later) |

## Sizes that matter (TEMPLE_KIT move table, comfy)
run up a wall 2.7 m (sprint 3.6) - side wall run across 5.5 m - run jump 5.9 m gap / 2.2 m up - double jump 4 m up / 10 m - chimney walls 4.6 m
apart - stairs .30 m risers - a side-wall-run face must be longer than 1.2 m.
