# DEBUG MENUS -- one SPAWN menu, one DEV PLACES menu, both built from a table (plan, Nov 7 2026)

*"We really need to re-organise that debug menu. There's stuff from the old game, which is fine -- I don't need it gone, sometimes it's fun
to spawn some of that stuff, more bosses -- but the menu itself, I don't know where anything is. There's a menu for people, but then there
are people tagged onto the main menu at the bottom, new bosses... it's just not organised well."* (Colin)

Mock: `images/plan/debug_menu_mock.png`.

## WHAT IS WRONG TODAY (read off the code)
- **SPAWN's top level is 5 folders and then 15 loose buttons** (`arenaUi`, `m === 'top'`): turret, high bar, beam, wall run, acrobatics,
  slice dummy, horde, hall, archers, Osari spider, two stone guardians, temple dweller, statues, and two dead `soon` buttons (GRUNTS, GREYS).
  Every new boss was added as one more button on the end.
- **The folders are sorted by FLAGS, not by what a thing is.** WARBOSS = every `ARENA.kinds` row that is not `civ`, `creature` or `rival`, so
  the husk soldiers, the Sword Saint, the Shadow, the Bulwark, the Hollow Monk, the Jackal, the archers, Skullback and the old Brute Warboss
  all land in one list. PEOPLE mixes Zap-era bodies (Hick, Hobo, Zap, Zap 2, CEO) with Korajin's one villager (Toad).
- **No row says where it belongs** (which temple, which region), so "by temple" is impossible.
- DEV PLACES (`KPLACES`) is already Korajin-only and grouped by region, but not by story order, and the temple rooms sit in a 10-row flat list.

## THE SHAPE
**SPAWN** (the arena/forge SPAWN key, same place on screen):
- **CLEAR ALL** at the top, then **tag chips** (ALL · PROLOGUE · FOREST TEMPLE · DESERT · HOLLOWS · SKY ...) -- the "by temple" view is a
  FILTER on one list, not a second menu. Chips come from the tags in use, so a new region adds its own chip.
- **RECENT**: the last 5 things spawned, one tap each (saved per device).
- Folders, collapsed by default, open state remembered:
  | folder | what goes in (today's rows) |
  |---|---|
  | COMPANIONS | the pet friend, the holy creature (today they are zones; until they spawn, the row jumps to their sandbox) |
  | VILLAGERS | Toad Wanderer (more as they come) |
  | ENEMIES -- FODDER / TIER 2 / TIER 3 / SWARM | Husk Soldier, Husk Archer / Husk Swordsman, Husk Flanker / Bulwark, Hollow Monk, Sphinx Hound, Hollow Moth, Jackal Guardian, Osari Bowman / HORDE (+n), ARCHERS (+n) |
  | BOSSES & GUARDIANS | Stone Guardian, Stone Guardian (2-layer), Sword Saint, The Shadow, Temple Dweller, Osari Spider, Skullback, Statues (the chalice); the eye boss when it exists |
  | CREATURES & MOUNTS | Mammoth, Mammoth Calf, Three-Headed Dog, Blue Dragon, Mech Lightning Dragon |
  | TRAINING | Turret, High Bar, Balance Beam, Wall Run, Acrobatics, Slice Dummy, Samurai (you, played by the computer) |
  | BUILDINGS | the forge's building list, unchanged (forge only) |
  | LEGACY (Zap / Weirdport) | Hick, Hobo, Zap, Zap 2, The CEO, The CEO unleashed, Brute Warboss, red Archer, Hall -- kept, tucked away |
- The dead GRUNTS / GREYS buttons go. A spawned thing's row is lit and a second tap removes it (today's rule, kept for every row).

**DEV PLACES** (the GOD menu):
- **RECENT** (last 5 visited), then **HERE** (this zone's spots, as today).
- **KORAJIN**, in story order: **PROLOGUE** (the Garden) · **TRAINING** (Combat Lab, Sword Saint dojo, Proving Ground, Duel Pit) ·
  **FOREST TEMPLE** (full run, the Well, rooms A-F, the Seal) · **WORLD** (sub-folders DESERT / WATER / SNOW / SKY).
- **SANDBOXES**: one per character or system (Glow Garden, Vine Whip, Rope Course, Wall Park, Pet Friend, Holy Creature, Interactions,
  Dark Hall, Temple Layout, Climb Tower, Cell C1, Reflection, Blockout).
- **LEGACY**: the inherited worlds, only the ones that still boot.
- FLY / PLAY MODE stay pinned at the bottom.

## HOW IT IS BUILT (data-first, SCENE_COMPANION.md)
- **One table each**, between `SC_SPAWNS:START`/`:END` and `SC_PLACES:START`/`:END`:
  `{ id, t, sub, cat, tier?, tag: ['FOREST TEMPLE'], kind?: 'HUSK_SOLDIER' | act?: 'guard' }` and
  `{ id, t, sub, cat, sub2?, tag, q: '?w=forge&zone=...' }`. The menus are a pure function of the table; the existing spawn functions
  (`arenaSpawn`, `guardAdd`, `turretSpawn` ...) are what `kind` / `act` point at -- **no spawn code changes**.
- **`npm run check` fails** (a new `check:menus`, under a second) when: a row has no `cat` or a `cat` that is not a folder; a row has no
  `tag`; an `ARENA.kinds` key has no SPAWNS row (so a new enemy cannot be added without a home); or anything is appended to the menu outside
  the table.
- **Touch-sized**: rows 44 px, folder headers 48 px; the panel scrolls by drag as the GOD menu does now.
- **Search: not in the first build.** On a phone the keyboard covers half the panel; the chips plus RECENT do the same job. Cheap to add later.

## BUILDS
1. **SPAWN**: the table, the folder renderer, chips, RECENT, the `check:menus` gate. Every row from today kept (legacy included).
2. **DEV PLACES**: the same renderer over `SC_PLACES`, story order, RECENT.
3. (Later, if he wants it) the TOOLS panel -- it is the next mess (one long column of toggles), same treatment: folders by system.

## FOR HIM TO DECIDE (the rest are defaults)
- The tier of the "TIER 3" enemies and each one's home tag (Bulwark, Hollow Monk, Sphinx Hound, Hollow Moth, Jackal) -- first pass is a guess.
- Whether TRAINING props belong in SPAWN at all or only in the training places.

## DONE WHEN
- [x] SPAWN is folders + chips + RECENT, nothing loose at the top level; every old row still spawns (legacy included) (m2801)
- [ ] the "FOREST TEMPLE" chip shows only Forest Temple things
- [ ] DEV PLACES in story order, temple rooms in one folder, RECENT
- [x] `npm run check` fails on a row without a category, and on an `ARENA.kinds` key without a row (proved by breaking one on purpose) (m2801)
- [ ] **his sign-off on his phone**
