# KORAJIN -- ONE SHAPE = ONE MEANING (his rule, Nov 7 2026; m2808)

*"You see this weird diamond thing? ... it looks really low poly... what the hell is it? ... in one area it was used to do something and in
another area it doesn't do anything. This needs to be standardised -- you either have something or not."* (images/feedback/m2802/)

**An interactive marker looks the SAME everywhere and DOES the same thing everywhere; nothing that looks interactive is decor; a lone, flat,
low-poly floating diamond is banned.** Interactive kinds are JINRA-lit (mint, `pal: 'jinra'`); decor crystals wear the temple's own palette
(forest teal / desert amber / lake blue / snow white-violet) and are always a seated or hanging CLUSTER. All are GLOWKIT rows (GLOWKIT.md).
Close-ups: `images/renders/markers/marker_kinds.jpg`; in the Glow Garden's south row (`?w=forge&zone=glowkit`).

| Kind | What it means | The look (GLOWKIT `kind`) | The tell |
|---|---|---|---|
| **TARGET** | shoot it (arrow / bolt / beam) and something happens | `target`: a carved bronze DISC facing you, a glowing RING inset, a faceted crystal EYE at its heart. (The forest temple's stone `K.target` -- disc + ring + eye -- is the same language) | the eye pulses; waiting = `glowWake(B, id, .35)`, hit = 1 (lit) |
| **ANCHOR** | lash / zip / grapple to it | `anchor`: a crystal KNOT turning inside two crossed bronze rings (a gyroscope), a glowing ring under it, motes orbiting. (The whip's root knot + glow ring is the same language) | turning knot, orbiting motes |
| **SHARD** | collect it / it is the reward | `shard`: the hero shard -- a floating 10-sided crystal with satellites, in its bronze `seat` setting | floats and turns when lit; dormant = dim and still |
| **DECOR** | nothing -- it is the place | `prism` / `geode` / `stal` / `grit` clusters, seated on rock or hanging from it, never alone, never floating free | none (sway, shiver, rings when struck) |

**THE GATE:** `npm run check` runs `tools/markgate.mjs`: a NEW glowing `OctahedronGeometry` (a line naming JPAL / glow / jin / core / gem /
crys / toneMapped:false) in any function beyond its audited baseline (`tools/markgate.json`) FAILS the check. Use a kind above. Converting a
legacy one lowers its count (`node tools/markgate.mjs --write` after a conversion, never to let a new one in).

## The audit (m2808): every glowing gem in index.html

Verdicts: **OK** = it is one of the kinds (or a seated inlay / a lamp's light inside a fitting); **CONVERTED** = done in m2808; **TO DO** = a
lone or ill-fitting gem left for its zone's owner (coordinate through this table).

| Where (function) | Zone | What it was | What it does | Verdict |
|---|---|---|---|---|
| `dvMake` isle / dome / tower / shrine | desert, the Sunwell | a mint OCTAHEDRON floating under every isle's root, over a dome, in the lantern room, over the shrine block | nothing | **CONVERTED** to decor: amber `stal` clusters hanging FROM the root tips, `prism` clusters SEATED on the dome / lantern floor / shrine block (`DVIL.glow`, 1 draw, no motes) -- his screenshots 1-3 |
| `dkMake` ipyramid (the floating inverted pyramid) | desert | "a drop of Jinra light" -- a big octahedron under the root tip; octahedra at the hanging shards' tips | nothing | **CONVERTED**: a faceted hanging CLUSTER (`gkClusterGeo`) at the tip, bevelled crystals at the shard tips |
| `dkMake` (the other 14) | desert kit | flattened gems inlaid in walls, braziers, obelisks, gates; finials | nothing (decor, seated) | **OK** -- and every `core` gem now has facets, a rim and a shimmer (`gkGemLook`) instead of a flat glow |
| `cellRoomStage` targets | temple cell (Reflection) | a grey octahedron on a post | a beam target (lights, opens the gate) | **CONVERTED** to the standard TARGET (waiting .35, lit 1) |
| `ftinHub` sockets | forest temple | a flat octahedron per socket | holds an earned shard | **CONVERTED** (m2711) to SHARD (dormant / lit) |
| `ftkMake` K.target, the whip knots / zips | forest temple | stone disc + ring + eye; root knot + glow ring | shoot / lash | **OK** -- they ARE the language |
| `ftinBossReward` | forest temple, the Banyan | a JPAL octahedron gem | the boss's reward | **TO DO** (temple worker): a `shard` row |
| `doorShard` | forest temple seal | a thin octahedron in the door's socket | the ritual's shard | OK (in a hand / a socket, animated) -- could become a small `shard` |
| `ikItem` / `ikSides` | Interactions kit (chests) | the item held up from a chest; gems inlaid on a chest's sides | the GET; decor | OK (inlay) / **TO DO**: the GET gem -> a `shard` |
| `iceBuild` smash crystals | ice temple | jade octahedra you SMASH | smashable | **TO DO** (ice owner): a smashable is not a marker kind -- make them `geode`/`prism` clusters that break, or a 5th kind |
| `iceDress` / `iceArch` / `svk*` / `vilHut` | snow village, ice temple | octahedra on finials, lanterns, arches, gables, shrines | nothing (decor) | **TO DO** (snow owner): seated mostly; the free ones -> `prism` clusters |
| `blockStage` | Blockout import | seal / statue / beat / gate debug markers | editor markers | OK (dev only, not shipped in a level) |
| `whipScene`, `loopBgBuild`, `templeMassMake`, `shrineBuild`, `gmerchBuild`, `lhouseBuild`, `zepMake`, `dragDress2`, `dojoDragonDress`, `jvesPut`, `bouldAscent`, `shieldBuild`, `svkHalo`, `uwFloraGeo` | title loop, sky temple, garden, dojo, lake, ice shield | gems on props, finials, lanterns, the title's backdrop, flora | mostly decor; the lantern house's crystal and the shield's are parts of a thing | **TO DO** per owner: check each against the kinds; nothing here is a lone floating marker that DOES something |


---

# Weirdport — markers

**You place, the game behaves.** Nothing appears in the world unless it has an authored place: a
named marker in your Blender export, or an entry in an authored table in `index.html` with a named
spot and a reason. This file is the vocabulary the game reads.

## How a marker works

- A marker is an **Empty** (Plain Axes is fine; use a **Cube** empty for areas) in any of the kit city
  exports: `toon_city_visual.glb`, `toon_city_collision.glb` or `toon_city_kit_buildings.glb`.
- The game recognises it two ways, and either works:
  1. **by name**: the empty's name starts with the type and an underscore: `portal_bridge`,
     `gate_fire_alley`, `npc_hobo_camp_01`. The rest of the name is its **id**.
  2. **by custom property**: any object with a custom property `marker` set to the type
     (`marker = portal`). Then `id` (a custom property) or the object's name is its id.
- **Custom properties** (Object Properties → Custom Properties) ride along as glTF extras. Turn on
  **Include → Custom Properties** in the glTF exporter.
- **Facing**: the empty's own facing is its **−Y axis in Blender** (toward you in Front view,
  numpad 1). A custom property `yaw_deg` overrides it: 0 faces Blender −Y, 90 faces Blender +X.
- **Size**: a Cube empty's size is its **scale** (Display Size 1 means a half-width of 1 m × scale).
- Re-export, then `npm run bump`, and the markers arrive on the phone. The chip shows `MK<n>`, the
  number of markers read; `mel.marks()` lists them, and any marked `(unused)` did nothing.

## The new markers (m293)

| Type | Name pattern | Custom properties | What the game does | Status |
|---|---|---|---|---|
| **portal** | `portal_<id>` | `name` (shown in the travel picker), `hub` (true = active from the start; also `portal_ship` / `portal_hub`) | a portal pad; step on it to activate it for good, then travel between active pads | **live** |
| **gate** | `gate_<type>_<id>`, e.g. `gate_fire_alley`, `gate_cordon_bridge` | `gate` (cordon, fire, barricade, bridge, gap; defaults to the first word after `gate_`), `width` (m; else the empty's X scale × 2, else 4.5) | an obstacle across the empty's facing that only the right form passes (cop, firefighter, activist, worker mends it, glider). The empty faces the way you walk **through** it | **live** |
| **npc** | `npc_<kind>_<nn>`, e.g. `npc_hobo_01`, `npc_farmer_01` | `kind` (a file stem like `hobo_01`, or a word: farmer, cop, hobo, worker, firefighter, activist, biker, hippie, hipster, warrior), `name` (shown in the speech bubble), `talk` (a script id from `TALKS` in index.html), or `lines` (`First line\|Second line\|Third`) ; `rumour` (an id from `RUMOURS`: told as the last line); `group` (country, street, law, worker, city, biker, crew), `talks` (comma list of groups he talks to properly; default his own group), `alien` (`flee`, the default, or `brush`) (m332) | one more body of that kind, standing and ambling at the marker, facing its way; with `talk` or `lines` it gets a `!` and says them | **live** |
| **spawn** | `spawn_start` (or any `spawn_*` with `start = true`) | — | where a new game begins (before you have walked into town once). Overrides the crash-site start | **live** |
| **region** | `region_<id>`, a **Cube** empty | `name` (shown on the map) | a named area on the map, fogged until you walk in. Any region marker replaces the placeholder quadrants for that world | **live** |
| **goal** | `goal_<id>` | — | a point a quest can send you to (`{ type: 'goto', mark: '<id>' }`) | **live** |
| **crowd** | `crowd_<id>`, Cube empty | `kinds` (comma list), `count` | where a crowd gathers | read and counted, **not acted on yet** (C1) |
| **protest** | `protest_<id>`, Cube empty | `side` (activists / rally), `count` | where a protest forms | read and counted, **not acted on yet** (C1) |
| **ambient** | `ambient_<what>_<nn>` | anything | ambient life: birds, smoke, a busker | read and counted, **not acted on yet** |

## The markers already in your files (read where they always were)

Counts are from `toon_city_kit_buildings.glb` as it is today.

| `marker` value | In your file | What the game does with it |
|---|---|---|
| `room` | 916 | a room a fire can start in (`KROOMS`) |
| `repair` (+ `wall_piece`) | 1,326 | where the construction worker stands to mend that wall (`KREPAIR`) |
| `fire_truck_park`, `fire_hose_stand` | 60 each | where the fire truck parks and the hose stands, per building |
| `ladder_top` | 120 | the top of a ladder, paired with its climb volume |
| any name with `truck` / `depot` (not fire) | — | the construction truck's yard (`KDEPOT`) |
| `fx_<what>_<name>` (by name, in the breakables) | — | an effect spot, e.g. `fx_hydrant_water_spout` |
| `door_in`, `door_out` | 118 each | **in your file, not read yet** |
| `ladder_bottom` | 120 | **in your file, not read yet** |
| `police_stand` | 60 | **in your file, not read yet** (a cop's post per building: the obvious place for patrols) |
| `police_spawn`, `police_car_park` | 1, 2 | **in your file, not read yet** |
| `firemen_spawn`, `fire_truck_home` | 1, 2 | **in your file, not read yet** |

## What is dormant until you place it (STEER 2)

- **Talk speakers**: no more one-random-person-per-kind with a `!`. Use `npc_*` markers with `talk`
  or `lines`.
- **The WEIRDPORT 101 stand-in quest**: off. `mel.questOn('q0')` runs it for testing.
- **Demo gates and portals**: off since m292. `mel.gateDemo()` / `mel.portalDemo()` place them round
  you on purpose.
