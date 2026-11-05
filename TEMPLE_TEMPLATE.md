# THE TEMPLE PLANNING SHEET -- how every temple is planned (his, Nov 5 2026)

**His structure** (from his six reference sheets, `images/reference/temples/`; it is ZELDA_STRUCTURE.md Part 2):
- A big **MAIN ROOM / HUB** you enter first (down a hall, you land in it). **Lettered SUB-CHAMBERS (A, B, C, D, E, F)** branch off it.
- **Beating each sub-chamber earns a SHARD or a KEY**; enough of them power or unlock the main room, where the **BOSS** is (or the way down
  to it). It builds up to that.
- **Every chamber is tagged PUZZLE / BATTLE / ACROBATIC** (or a mix), plus **REST, SECRET or TREASURE**.
- **PLAN IT ALL AHEAD, ON ONE SHEET** -- before a single room is built.

## The sheet (`npm run templesheet <id>` -> `docs/temples/<id>_sheet.png`)
One image per temple, in the style of his references, generated from ONE data file, `tools/temples/<id>.mjs` (edit it, re-run, the sheet follows):
1. **ISOMETRIC** -- every room as a floor slab with its back walls, coloured by its type (a second type is a dashed rim), EXPLODED by level so
   stacked floors read apart, the links between them as coloured dashed lines, the chambers lettered, secrets as stars.
2. **TOP-DOWN PLAN** -- on a grid (`grid` m a square), lettered, lighter = higher, a compass; the boss under the hub dashed.
3. **SIDE SECTION** -- unrolled round the hub (`section` order), the levels as lines with their heights, drops dotted.
4. **THE TABLE** -- chamber, type, what it TEACHES / TESTS / TWISTS, REWARD (shard / key / item), ENEMIES, INTERACTIONS used (chests, key
   doors, levers, the wheel crank, plates, switches, whip anchors -- the Interactions Kit's names once it lands), and the WHIP-ONLY RULE
   (VINEWHIP.md) for any chamber that needs the item.
Plus the ITEM, the GOAL (what the shards/keys open), the FLOW in one line, and the legend.

## The data file (one row per room, one row per link)
```js
export default { id, title, accent, paper, grid /* m a square */, idea, item, goal, flow, explode /* the iso's level spread, default 4.4 */,
  levels: [['L3', 24], ['L2', 12], ...],                 // name, metres
  rooms: [{ id: 'A', name, types: ['acro', 'battle'],    // puzzle | battle | acro | rest | secret | treasure | hub | boss
            shape: ['rect', cx, cz, w, d] | ['circle'|'hex'|'star', cx, cz, r], y /* floor m */, h /* wall m */,
            tt /* teaches/tests/twists */, reward, enemies, act /* interactions */, rule /* whip-only rule */, pool, seal, built }],
  secrets: [['S1', 'where', x, z, y]],
  links: [['H', 'B', 'key', 'SMALL KEY']],               // open | key | whip | oneway | short | seal
  section: ['B', 'C', 'A', 'H', '0', 'D', 'E', 'F'] }    // the unrolled section's order (the boss draws under 'H')
```
Ids: `0` the entry hall, `H` the hub, `A`..`F` the chambers, `X` the boss. Plan metres in the game's frame (+z north).

## The rules a sheet must pass before anything is built
- **One hub, entered first; lettered chambers off it; every chamber pays ONE thing** (a shard, a key or the item); the shards/keys open the
  boss. Exactly one locked door available at a time in the first half (ZELDA_STRUCTURE Part 2).
- **Every chamber has a type tag** and the pacing never puts two BATTLE chambers back to back; a REST after the mid-boss and before the boss.
- **The item comes from a mid-boss chamber and the second half needs it** -- by THE WHIP-ONLY RULE (or the item's own rule): the table says
  which rule makes each such chamber impossible without it.
- **Verticality** (CLAUDE.md): levels spread over at least three heights; the section shows it.
- **Sacred geometry**: the hub on the axis, chambers on a regular figure round it, mirrored pairs.
- **Every gap from the move table** (`tools/moves.json`, TEMPLE_ROUTES.md): no ladders on a route; every fall lands somewhere climbable.

## Temples on the sheet
| temple | file | sheet |
|---|---|---|
| Forest Temple | `tools/temples/forest.mjs` | `docs/temples/forest_sheet.png` |
