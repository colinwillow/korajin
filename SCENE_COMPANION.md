# Building KORAJIN so Scene Companion can open it

Colin is building **Scene Companion** (`colinwillow/scene-companion`), a visual editor for his Three.js games, and
KORAJIN is going to be opened in it. The KORAJIN repo (when it leaves zap) will run on its runtime. The plan for the
port, with what exists and in what order it moves, is `scene-companion/docs/korajin.md`.

**Nothing here asks you to rewrite what works or to stop building.** Keep shipping KORAJIN the way this repo ships
(push to main, bump, the phone). The rules below only change the SHAPE new work is written in, so that it exports
mechanically instead of by hand. Apply them to new work and to code you are already touching. Don't go back and convert
old code on your own.

## What Scene Companion reads (so you know what "data-first" is aiming at)

- **A scene** is a list of entities: `{ id, prefab | asset | character, position, rotation, scale, children, behaviors: [{ type, params }] }`
  plus settings (sky, fog, look, camera).
- **A prefab** is a reusable entity (a samurai with its brain, a coin, a ladder).
- **A character** is `<name>.character.json` beside its GLB: `{ glb, height, roles: { idle, walk, run, jump, fall, land, hit, death, attack, … } }`
  (role → clip name). Forged clips come in through `clips`.
- **A behavior** is a JS class with a `schema` (every tunable number with default/min/max), `start` / `update(dt)` /
  `lateUpdate` / `destroy`, that reads its own entity and talks through world events.

## The rules

### 1. Every placed thing goes in a placement list, never an inline call
In a place's builder, don't write `coinDrop(12.4, 3, -8)` or `hbarMake(...)` or `turretMake(...)` mid-geometry. Put
the things you place in the place's table, each with a **stable id**, and have the builder walk the list:

```js
GMERCH = { at: [..], yaw: .., /* …the place's own numbers… */
  place: [
    { id: 'merch_coin_01', kind: 'coin',    at: [12.4, 3, -8] },
    { id: 'merch_ladder',  kind: 'ladder',  at: [..], yaw: .., p: { top: 4.5 } },
    { id: 'merch_osari_1', kind: 'OSARI_BOW', at: [..], yaw: .., p: { aggro: 14 } },
  ] }
```

Kinds are the names you already use (`coin`, `ladder`, `bar`, `zip`, `ring`, `gate`, `smash`, `turret`, `plate`,
chest, any `ARENA.kinds` key, `GUARD`, `SPIDER`). `p` holds what differs from the kind's defaults. Ids are
`<place>_<thing>_<nn>` and are never renamed: the editor keys everything on them. This also covers spawns
(`HOME.spawn` → `{ id: 'spawn_home', kind: 'spawn', at }`).

### 2. A builder is a pure function of its table
`fooBuild(T)` takes its table and returns `{ meshes, boxes, tris }`. It reads no other globals for placement, takes
its random from a `seed` in `T` (seeded scatters stay seeded), and repeats nothing a second place could reuse. The
existing `BLDG.list` entries, `HALL`, `PAGODA`, `GHOME` and so on are already close: keep `at` / `yaw` in the table, and
let a caller override them (COURTYARD.md's `at` overrides are the pattern). That is what lets a headless bake turn
any builder into a GLB plus a collision file for the editor's Library.

### 3. Mark every table an export reads
Put the tables a tool will lift between markers, in this repo's own convention (`tools/bld.mjs` lifts `// COLS:START` …
`// COLS:END`):

```js
// SC_GMERCH:START
const GMERCH = { … };
// SC_GMERCH:END
```

Mark: each place's table, `ARENA.kinds`, `ARENA.beast`, `GUARD`, `OLMEC`, `SPIDER`, `TOADK`, `HERO`, `CLIPS`, `LVG1`,
`BEACON`, `CHUNKS`, `COURSE`, `RESTORE` pose tables, `DRAGZ`. **A tool must run the shipped text, not a copy of it**
(this repo's own landmine). Markers make that reliable.

### 4. Characters: one table per character, in role words
- Every NEW character (enemy, NPC, beast, boss, mount) gets one kind table with its GLB, `h` (height), `walkRef` /
  `runRef`, and `clips` keyed by ROLE. Use these role names where they fit: `idle`, `walk`, `run`, `jump`, `fall`,
  `land`, `hit`, `death`, `attack` (or `swings: [...]`), `block`, `blockHit`, `taunt`, `downF` / `upF`, `roar`,
  `fire`, `rest`. Add new words when a role is new, but don't reuse a word for a different thing.
- Grumbo's role names are spread over `CLIPS` and ~12 feature tables (KATANA, NINJA, VAULT, WRUN, BOW, KSET…). When
  you add a NEW feature, put its clip names in its own table under a `clips:` key, not as string literals in the step
  code (`dragAnim`'s `'ride_seat'` literals are the counter-example).
- Forge profiles (`tools/*_forge_prof.json`) are already the right shape. Keep making one per character.
- **Never commit raw Mixamo clips** (the library stays in retarget-anims). Forged bakes are fine.

### 5. Systems: tuning in one object, state on the entity, the player through one door
- One ALL_CAPS tuning object per system (this repo already does this) holding EVERY number, including the ones you
  think are fixed. These become the behavior's schema defaults.
- **State lives on the thing it belongs to** (`d.st`, `R.t`), never in a module-level variable, so a second dragon or
  a second guardian just works. `DRAGZ.on.B` (one dragon) is the counter-example. New mounts and bosses should
  be lists of instances.
- **Reach the player through one function** (`target(d)` / `heroPos()`), not `player.pos` scattered through the
  brain. Then the same brain can chase a different target (a decoy, a villager) and becomes an editor behavior
  with no rewrite.
- **Announce what happened as events** for anything another system or the story might care about: a small `emit(name,
  data)` with names like `kill`, `limb`, `jinra`, `coin`, `restore`, `tame`, `parry`, `deflect`, `beacon`. Scene
  Companion's Reactions (when X → do Y) and its quest logic are built on events. Even an emit nobody listens to yet is
  worth it.

### 6. FALLEN / RESTORED: both poses are data
Keep the RESTORE grammar: name every piece, keep the restored pose as the authored transform, and the fallen pose as a
table `{ piece: { p, r, hop, at } }` (as GMILL / GMERCH already do). Name the trigger (`plate`) as a placement with an
id. The editor will show both states with one switch, and the bake writes both.

### 7. Story and quests: as data, keyed by ids
The uncle, the merchant, Betsy and the artifacts aren't code yet. When they are, write them as data, not as branches
in `frameBody`:
- quests: `{ id, give: npcId, need: [itemIds], reward, then }`
- dialogue: `{ npcId: [{ when, lines }] }`
- the save: one `KSAVE` object with `coins`, `jinra`, `age`, flags, quests

That is exactly what Scene Companion's quest and variable system reads, so they port as data.

### 8. Assets: stable paths, measured not typed
Keep GLBs at stable paths under `models/`. Re-export in place, never renamed: the editor and the Library reference
them by path. Heights and facing are measured at load (as RIG does). A new folder still goes into `bump.mjs`'s `DIRS`.

## Checklist for any new KORAJIN feature
- [ ] Its numbers are in one tuning object, between `SC_<NAME>:START` / `:END` markers
- [ ] Things it places are in a placement list with stable ids, not inline calls
- [ ] Its state lives on the entity / instance, and the player is reached through one function
- [ ] It emits an event when something story-worthy happens
- [ ] Its clips are in a `clips:` table in role words
- [ ] A one-line note in this file's log, below, if it adds a new kind, role word or event name

## Vocabulary log (add new kinds, role words and event names here)
- kinds: coin, ladder, bar, zip, ring, gate, smash, turret, plate, chest, spawn, and every `ARENA.kinds` key, plus GUARD, OLMEC, SPIDER, TOAD
- events: kill, limb, jinra, coin, restore, tame, parry, deflect, beacon (proposed; none emitted yet)
