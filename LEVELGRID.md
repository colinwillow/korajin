# LEVELGRID -- plan a level as LOGIC first (m1356)

His direction, with two blueprint images (a 10 x 10 top-down grid, a coloured path, numbered beats, heights Y 0-3):

> *"This is usually where we go wrong: I build the kit and set you off to build a level, and the scope is too large and the logic isn't
> interesting. Start with the game logic of the level first: the path the player is supposed to take (maybe multiple paths), a general
> layout with a logic to it. You do some stuff on this plane, then get up to this plane, go around, go down, climb up here, kill these guys
> on the tower, hit this button and it opens a drawbridge; once it's open you go across, beat those guys, go up and light this candle and
> that allows this; then you zipline back across and finish, and that opens the boss of the level."*


## MOVE TABLE (layer 0: the numbers every gap and ledge is sized from -- LEVELDESIGN.md, STEER 000 step 1)

**Measured, never derived.** `npm run moves` boots the shipped `index.html` headless in the Building Forge as Grumbo (`agoblin`), steps
the real frame at 60 fps on a fake clock, and plays every move through the PADS: real pointer events into the shipped `bindStick` (tap,
flick, hold, release), so a row is whatever the game's own code does with that gesture. Test faces, bars and ledges are put on the empty
floor for each row. It writes `tools/moves.json` (the generator reads it: `moves.<key>.h / d / comfy_h / comfy_d`) and rewrites the table
below. **Re-run it after any change to movement, and commit both files.**

**The contract:** a generated gap is never wider than its move's **comfy d**, a ledge never higher than its move's **comfy h**. "max" is
the most the move can do, played perfectly. h is his FEET over the floor he left, or, for the wall runs and the ledge, the highest LIP he
gets his hands to or the top he gets onto. d is take-off to touch-down along the floor.

<!-- MOVE TABLE START (npm run moves writes this) -->
Measured on **m1375**'s physics, 2026-10-27, as agoblin. Comfortable = 80% of max.

| move | max h (m) | max d (m) | air (s) | comfy h | comfy d | notes |
|---|---|---|---|---|---|---|
| jump (standing, left tap) | 2.72 | 0 | 1.03 | 2.18 | 0 |  |
| walk + jump | 2.72 | 4.85 | 1.03 | 2.18 | 3.88 | at 2.22 m/s.  |
| run + jump | 2.72 | 7.44 | 1.03 | 2.18 | 5.95 | at 7.2 m/s.  |
| sprint, let go = the LONG JUMP | 2.67 | 13.73 | 1.02 | 2.14 | 10.98 | at 9 m/s. right pad held still while running; letting go jumps. Spends the double. |
| double jump (standing) | 5.01 | 0 | 1.72 | 4.01 | 0 |  |
| run + double jump (second tap at the top) | 5.01 | 12.48 | 1.72 | 4.01 | 9.98 | at 7.2 m/s.  |
| high jump (backflip), bare charge | 4.69 | 0 | 1.35 | 3.75 | 0 |  |
| high jump (backflip), full charge | 6.66 | 0 | 1.62 | 5.33 | 0 | right pad held still at rest 0.85 s. Spends the double. |
| high jump + push forward in the air | 6.66 | 6.67 | 1.62 | 5.33 | 5.34 |  |
| run jump + 1 air kick | 2.72 | 11.74 | 1.28 | 2.18 | 9.39 | at 7.2 m/s.  |
| long jump + 1 air kick | 2.67 | 15.89 | 1.28 | 2.14 | 12.71 | at 9 m/s.  |
| run + double jump + 1 air kick | 5.01 | 17.02 | 2 | 4.01 | 13.62 | at 7.2 m/s.  |
| high jump + 1 air kick | 6.66 | 12.52 | 1.92 | 5.33 | 10.02 |  |
| run jump + 2 air kicks | 2.72 | 15.54 | 1.53 | 2.18 | 12.43 | at 7.2 m/s.  |
| long jump + 2 air kicks | 2.67 | 18.53 | 1.5 | 2.14 | 14.82 | at 9 m/s.  |
| run + double jump + 2 air kicks | 5.01 | 21.85 | 2.37 | 4.01 | 17.48 | at 7.2 m/s.  |
| high jump + 2 air kicks | 6.66 | 17.46 | 2.3 | 5.33 | 13.97 |  |
| run jump + 3 air kicks | 2.72 | 15.65 | 1.52 | 2.18 | 12.52 | at 7.2 m/s.  |
| long jump + 3 air kicks | 2.67 | 18.81 | 1.5 | 2.14 | 15.05 | at 9 m/s.  |
| run + double jump + 3 air kicks | 5.01 | 26.49 | 2.7 | 4.01 | 21.19 | at 7.2 m/s.  |
| high jump + 3 air kicks | 6.66 | 22.59 | 2.7 | 5.33 | 18.07 |  |
| zoom + jump | 2.72 | 17.13 | 1.03 | 2.18 | 13.7 | at 17 m/s.  |
| zoom + double jump | 5.01 | 27.07 | 1.72 | 4.01 | 21.66 | at 17 m/s.  |
| zoom + double jump + 3 air kicks | 5.01 | 36.81 | 2.7 | 4.01 | 29.45 | at 17 m/s.  |
| HIGH BAR launch, released for height | 14.82 | 0.87 | 2.35 | 11.86 | 0.7 | full pump, let go at 1.4 rad past the bottom; h over the floor, d from the bar |
| HIGH BAR launch, released for distance | 6.18 | 23.92 | 1.5 | 4.94 | 19.14 | full pump, let go at 0.2 rad past the bottom; h over the floor, d from the bar |
| wall run UP, from a run (right tap at the face) | 3.31 |  |  | 2.65 |  | at 7.2 m/s. feet reach 2.1 m; h = the highest lip his hands reach |
| wall run UP, from a sprint (no tap needed) | 4.51 |  |  | 3.61 |  | at 9 m/s. feet reach 3.3 m; h = the highest lip his hands reach |
| wall run UP, from a zoom (no tap) | 11.58 |  |  | 9.26 |  | at 15.99 m/s. feet reach 10.38 m; h = the highest lip his hands reach |
| wall run UP, jumping into the face at a run | 5.2 |  |  | 4.16 |  | at 7.2 m/s. feet reach 3.99 m; h = the highest lip his hands reach |
| wall run UP, long-jumping into the face | 10.65 |  |  | 8.52 |  | at 9 m/s. feet reach 9.44 m; h = the highest lip his hands reach |
| wall run UP, zoom-jumping into the face | 13.37 |  |  | 10.7 |  | at 16.63 m/s. feet reach 12.17 m; h = the highest lip his hands reach |
| SIDE wall run, from a run (right tap beside the face) | 0.95 | 6.88 |  | 0.76 | 5.5 | at 7.07 m/s. d = metres along the face |
| SIDE wall run, from a sprint | 0.95 | 8.11 |  | 0.76 | 6.49 | at 8.8 m/s. d = metres along the face |
| SIDE wall run + KICK off it (tap again) | 2.55 | 7.48 | 0.9 | 2.04 | 5.98 | kicked off 0.4 s into the run; lands 5.65 m out from the face |
| WALL SLIDE + wall jump chain (faces 4.6 m apart), per kick | 2.07 |  |  | 1.66 |  | first catch at 2.82 m off a run jump, then +2.07 m every kick, no limit met in 7 kicks (top 17.32 m) |
| highest TOP reached from the face: jump | 4.47 |  |  | 3.58 |  | the highest top he gets onto (a ledge caught, or landed on), jumping from .9 m back from the face with the left tap and pushing into it in the air; bisected to 2 cm |
| highest TOP reached from the face: double jump | 5.86 |  |  | 4.69 |  | the highest top he gets onto (a ledge caught, or landed on), jumping from .9 m back from the face with the left tap and pushing into it in the air; bisected to 2 cm |
| the STEP (walked up with no jump) | 0.38 |  |  | 0.3 |  | MOVE.step 0.4; stairs are cut at .30 risers (STEER) |
| SAFE FALL | 24 |  |  |  |  | NO fall damage at any height tried (to 24 m); the HARD landing from 4 m (impact over 11 m/s) pins him 1.15 s, a soft one 0.63 s |

Speeds (m/s): walk 2.22, run 7.2, sprint 9, zoom launch 17 (31.4 m in its first 2 s).
<!-- MOVE TABLE END -->

**What the numbers say about the grid (7 m cells, 4.5 m levels):**
- **A 7 m gap is not a plain jump.** A run jump's comfy reach is 5.95 m. A cell-wide gap is the LONG JUMP (comfy 11), a run jump plus
  a kick (9.4), or a double jump (10).
- **A 4.5 m level is not a double jump.** The double jump's comfy height is 4.0 m. A level is the HIGH JUMP (5.3), a ledge caught off
  the double (4.7), a long-jump wall run (8.5 of lip), the wall-jump chain (+2.07 m a kick, any height between two faces 4.6 m apart),
  or the bar (11.9 up).
- **The kicks are the distance.** Each air kick holds his height while it dashes, about +4 m each. The third one only comes off a
  double or a high jump: a kick needs 1.1 m of air under him.
- **Nothing hurts to fall from.** A drop over about 3 m is the hard landing, which pins him 1.15 s. A fall is a time cost, not damage,
  until the game gives it one.
- **His step is .38 m** (`MOVE.step` is .40 for his height; .357 is Zap's). Stairs stay at .30.

## THE FIVE LAYERS (his method, after m1369 -- every grid level is built this way)

| layer | what | the test it has to pass alone |
|---|---|---|
| **1 RUN** | the traversal: ramps, ladders, wall runs (up and along), bars, the long bar, ropes, rings, movers, flyers, zips, drops; swimming when it exists | with nothing else in it, is it a fun level to move through? a ninja parkour centre |
| **2 PUZZLE** | the beats that open things: this opens that, that opens the next, the last opens the boss gate | do the dependencies make you use the WHOLE run, and send you back over it a new way? |
| **3 ENEMIES** | guards for the layer-2 pieces only, each with a ZONE (a circle round what it guards) that its sight, its shots and its chase stay inside | can you always stand outside every zone and plan? nothing reaches the spawn or the open run |
| **4 THEME** | the level's one distinctive thing: air, puzzle, enemies, water, vehicles, co-op | would you know which level this is from one screenshot? |
| **5 BOSS** | the final arena: a big open dojo and the boss | is it the biggest moment in the level, and does it use what the level taught? |

- **In the game:** KORAJIN > Level 1 -- The Grid, with the LAYERS bar at the top (m1371).
- **In code:** `lvgBuild(spec, lay)` builds layers 1..lay, or a set `{2: 1, 3: 0, ...}`. Below 2, every gate stands open and the boss door is gone. Below 3, the guard beats count as done. The keep is layer 5.
- **Which layer each thing is in:**
  - **layer 1:** the path, branches, climbs, bars, movers, flyers, zips and rings
  - **layer 2:** the button, candle, cache, drawbridge, gate and boss door
  - **layer 3:** the guards, the tower's archers and gun, the posts and the catapults
  - **layer 5:** the keep
- **Order of work:** finish layer 1 to his sign-off, then layer 2, and so on. A pass adds to ONE layer and is checked against every layer below.


## The system

A level is a SPEC: an ordered path of grid cells plus beats. `lvgBuild(spec)` turns it into a playable GREYBOX. There is no art: the logic gets proven first, and the art and the kit go on top only after it plays.

- **The grid:** 10 x 10 cells of `LVG.cell` 7 m, at `LVG.at` (-45, -185) in the forge, 70 m square. Heights Y 0-3 at `LVG.lev` 4.5 m per level.
- **The path:** `[col, row, Y, tag?]` in order. Each cell is a pad at its height, coloured along the path (S green to E magenta, like his images).
  - **One level up or down between neighbours:** the later cell is a RAMP (about 33°, walkable).
  - **Two or more up:** a LADDER on its face.
  - **Two or more down:** you drop.
- **Branches:** optional side routes, listed the same way, starting from a cell already on the path.
- **Tags:**
  - `'S'`: start, a ramp up from the ground
  - `'E'`: the end
  - `'gap'`: no pad, spanned by the DRAWBRIDGE
  - a number: a beat, with a floating marker
- **Beats** (`spec.beats[n]`):

  | beat | what it is | done when |
  |---|---|---|
  | `guards` | samurai on the cell | all of them are down |
  | `tower` | a block with two archers and a sentry gun | they are dead |
  | `button` | a red button | struck; it lowers the drawbridge |
  | `candle` | a brazier | struck; it lights and opens the GATE (beat 10) |
  | `zip` | a zipline from the cell before it down to E | ridden |
  | `ring` | a grapple ring | optional |
  | `cache` | gold crates | optional |

- **`spec.need`:** the beats that open the BOSS DOOR at E (the boss itself comes later).
- A finished beat's marker turns green.

## Grid Level 1 (`LVG1`, SPAWN > BUILDINGS > Grid Level 1)

His first image's path, read in order, given heights:

1. S (1,1) ramps up to Y1 and runs east to **beat 1** (4,1): two guards.
2. South to (4,3), then up to Y2 at **beat 2** (5,3), east, then up to Y3 at **beat 3** (7,4): the tower (2 archers and a gun).
3. East along Y3. *Optional:* the purple branch north round (10,4) to (8,1), **beat 4**, a ring.
4. Down to Y2 at **beat 5** (9,5): the BUTTON. The **gap** at (9,6) is crossed by the drawbridge it drops.
5. **Beat 6** (8,7), Y1: three guards. West through (7,7), (7,6) and (6,6) to **beat 7** (5,6), up to Y2.
6. **Beat 8** (4,4): the CANDLE.
7. Down west to (2,4) and (2,5), down to the ground at (2,6). *Optional:* the cache, beat 9, round (1,6) to (1,8).
8. (3,6), then the GATE (it opens only when the candle burns) up into **beat 10** (3,7), Y1.
9. East along row 8, up to Y2 along row 9, to **beat 11** (9,10): the ZIP from (9,9) down to **E** (10,10). The boss door opens when 3, 6 and 8 are done.

## How to iterate

Change the path, the heights or the beats in `LVG1` (or tell me in words: "make 6 a tower", "put a ladder here", "the gap should be two cells") and the greybox rebuilds from it. When the logic plays well, the art goes on top: the kit pieces, the towers, the streams.

## L1 pass 2 (m1357): VERTICALITY

- **Heights go to Y6 (27 m).** Raised pads are slabs on four PILLARS, open beneath, so the route can pass UNDER itself. Ramps are thin wedges on pillars too.
- **The route now:**
  1. A ground run to the guards (1).
  2. Ramps up east to Y2, then a LADDER (2) up to the Y4 walkway along row 3.
  3. The TOWER (3) at Y5 overlooks everything.
  4. *Spur:* climb to the level's roof at Y6 (4), with the whole map below.
  5. Down to the BUTTON (5); the drawbridge over the gap at (3,6).
  6. The guards (6) at Y3, then down the east side to the GATE (10), which is shut.
  7. *The gate sends you back:* a spur runs UNDER the Y4 walkway at Y1 to the CANDLE (8). It comes out beside the opening ramp, a shortcut loop to the start.
  8. With the candle lit, through the gate and up the east climb to Y6 (11), then a 56 m ZIP across the bottom of the map to E.
- **What to look at:**
  - does the gate-sends-you-back loop read
  - is the under-walkway passage a good reveal
  - the zip

## L1 pass 3 (m1358): THE MOVES WE'VE BUILT, MADE NECESSARY

His list: wall running horizontally and vertically, a three-part wall run with a pit (fall and you do it again), high bars to launch up to a ledge, archers across, destructible buildings and a boss building you bring down, catapults, rockets, turrets, moving platforms to a rope, monkey bars, ropes, swinging, flying zeppelin platforms, swimming.

This pass adds three new cell kinds to the spec:

- **`'vw'`, a VERTICAL WALL:** instead of a ramp, a 4.5 m face to run up. Its top is the ledge you catch.
  - First used right after the guards (5,1): sprint and jump into it.
- **`'wr'`, a WALL-RUN cell:** a pit with a tall wall down ONE side. Consecutive `wr` cells put their walls on alternating sides: run, kick across, run, kick, run.
  - The east climb is now three of them at Y2, (9,7) to (9,9). The land is at (9,10).
  - A LADDER from the ground leads back up to the start of every pit run, so a fall means doing it again.
- **`'bars'`, a HIGH-BAR cell:** a pit with three bars, each 2.6 m higher than the last, rising to the ledge of the next cell 9 m up.
  - At (8,10): from the landing up to (7,10), Y4, where the zip to E leaves.

## The backlog (one or two per pass, from his list)

- moving platforms, one to the next, up to a ROPE
- monkey bars (R10), rope climbing and swinging, the experiments
- archers posted ACROSS gaps (shooting while you wall-run)
- catapults, rocket turrets on the route
- a FULLY DESTRUCTIBLE building: knock out its legs and it crumbles (the boss building, after the boss)
- flying zeppelin platforms
- swimming (a new mechanic: its own sandbox first, per the whole-piece rule)

## L1 pass 10 (m1365): THE LONG ZIP

- **`zips: [[a, b]]`:** an extra zipline from a post on cell a down to cell b.
- **Level 1's:** the zeppelin's high pad (9,3,Y6) to (2,9) beside the boss door, about 75 m.

## L1 pass 9 (m1364): THE ZEPPELIN

- **`flyers: [[a, b]]`:** a deck under a zeppelin, shuttling between two docks and carrying you.
- **Level 1's ride:** the roof (2,2,Y7) to a high pad at (9,3,Y6), across the whole level. From the high pad, drop to the gate side.

## L1 pass 8 (m1363): THE LONG BAR

- **`'mbar'`:** a pit crossed by one long bar along the way. Jump to catch it, then push the left stick sideways to shimmy across.
- **Where:** (5,7), after the second guards.

## L1 pass 7 (m1362): CATAPULTS

- **`cats: [[c, r], ...]`:** a catapult on the ground at that cell.
- **Level 1 has three:** (5,5), (8,8) and (2,8).
- **How they work:** each lobs a stone at where you'll be, with a red ring where it will land. Smash a catapult (8 hp) on the ground to stop it.

## L1 pass 6 (m1361): THE BOSS KEEP

- **Behind the door at E** stands a fortress on four stilts, with a rocket gun on its roof.
- **The legs are shielded** until the door opens. After that, break all four (10 hp each) and the keep tilts, falls and crumbles. That ends the level.

## L1 pass 5 (m1360): ARCHERS AND GUNS ACROSS THE GAPS

- **`posts: [[c, r, y, 'archer'|'gun'], ...]`:** a perch (a pillar with a deck on top) at an OFF-path cell, at level y.
- **The Level 1 posts:**
  - archers across the wall run (10,8)/(10,9), across the drawbridge gap (2,6), and over the roof spur (10,2)
  - rocket guns over the movers (1,3) and near the gate (7,8)
- **Line of sight:** archers need it (roofs and pillars are cover). A rocket you return homes to the gun that fired it.

## L1 pass 4 (m1359): MOVING PLATFORMS UP TO A ROPE

- **New cell kind `'movers'`:** a pit with four platforms, each 0.9 m higher than the last, sliding back and forth across it (2.2 m either way, each at its own speed). A platform CARRIES him while he stands on it.
- **A cell entered from `'movers'` going up** hangs a climbable ROPE from its ledge down to the top platform.
- **The roof spur (beat 4) is now this:** from the tower walkway at Y5, hop the four moving platforms over the pit at (2,3), catch the rope, and climb to the roof at Y7 (31.5 m). The ring is up there, with the whole level below.
