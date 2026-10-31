# TEMPLE KIT -- how a Korajin temple level is designed (Colin, Oct 31 2026)

> *"Quantify the wall running level and dynamics, write those rules and dimensions and dynamics, and give those pieces to the other context window so I
> can build a temple with them in mind."* / *"The one we designed looks cool but dynamically is crap and doesn't use any of the concepts we've been
> working on, which I think are gonna be like 50% of the game."* / *"Design a top-down view first: the initiation into the temple, a puzzle, some
> guys pop up, a door, an acrobatic area with guys, a mini boss, another puzzle with acrobatics, more guys, the boss -- block all that out and write
> the blueprint before designing the actual temple."*

**Who reads this:** whoever builds a temple (the temple session first). Read it before placing a single block. It sits ON TOP of
`LEVELDESIGN.md` (the five layers, OMAKASE, the blueprint) and `LEVELGRID.md` (the MOVE TABLE, measured by `npm run moves`). Where this file
gives a number, the number came from the MOVE TABLE or the code, never from a guess.

**The order, always:** BLUEPRINT (top-down beats, on paper) -> BLOCKOUT (grey boxes sized from the table below, played on the phone) -> LOOK
(the concept art wrapped over a blockout that is already fun). The Sky Temple went straight to LOOK; that is the mistake this file exists to stop.

---

## 1. THE MOVE NUMBERS (size every gap, ledge and wall from these)

Measured on **m1375** (`npm run moves`, LEVELGRID.md). **Stale in places:** the wall run, the ladder and the air recovery have all changed
since, and the measuring tool itself no longer drives the current pads correctly (re-run at m1929: a 1.1 m/s sprint and a standing jump that
"never left the ground" -- nonsense, thrown away). Fixing `tools/moves.mjs` and re-measuring is its own build; until then use these, and
play-test every gap at its limit on the phone.

**Speeds:** walk 2.2 m/s, run 7.2, sprint 9, zoom launch 17.

| move | comfy height | comfy distance | max height | max distance |
|---|---|---|---|---|
| step (walked up, no jump) | .30 (stairs at .30) | -- | .38 | -- |
| run + jump | 2.2 | 5.9 | 2.7 | 7.4 |
| long jump (sprint, let go) | 2.1 | 11.0 | 2.7 | 13.7 |
| double jump | 4.0 | 10.0 (running) | 5.0 | 12.5 |
| high jump (backflip, full charge) | 5.3 | 5.3 (pushed) | 6.7 | 6.7 |
| + each air kick | holds height | about +3.5 to +4 m | | |
| run + double jump + 3 air kicks | 4.0 | 21.2 | 5.0 | 26.5 |
| zoom + double jump + 3 kicks | 4.0 | 29.5 | 5.0 | 36.8 |
| highest top reached from a face: jump / double | 3.6 / 4.7 | -- | 4.5 / 5.9 | -- |
| wall run UP (lip reached): run / sprint / zoom | 2.7 / 3.6 / 9.3 | -- | 3.3 / 4.5 / 11.6 | -- |
| wall run UP, jumping into the face: run / long jump | 4.2 / 8.5 | -- | 5.2 / 10.7 | -- |
| SIDE wall run along a face: run / sprint | -- | 5.5 / 6.5 | -- | 6.9 / 8.1 |
| side run + kick off | 2.0 | lands ~5.7 m out | 2.6 | 7.5 |
| chimney wall-jump (faces 4.6 m apart) | +1.7 a kick, unlimited | -- | +2.1 a kick | -- |
| HIGH BAR release for height / distance | 11.9 up / 4.9 | 0.7 / 19.1 | 14.8 / 6.2 | 0.9 / 23.9 |
| safe fall | any (no fall damage; over ~3 m = a hard landing, 1.15 s pinned) | | | |

**What the numbers mean for a layout:** a 7 m gap is NOT a plain jump (the long jump, a jump + a kick, or the double); a 4.5 m storey is NOT a
double jump (the high jump, a ledge off the double, a long-jump wall run, a chimney, or a bar); the kicks are the distance; falls cost time,
not health.

**The contract (LEVELGRID.md):** a gap is never wider than its move's COMFY distance, a ledge never higher than its move's COMFY height. Max is
the move played perfectly; comfy is 80% of it. A gap at max is a skill check -- use one on purpose, never by accident.

## 2. THE PIECES (each one is a verb; a level is a sentence of them)

Every piece below already exists in the game as a system. Use the system -- never a look-alike that does nothing.

| piece | system to wire | sizing rule (from section 1) |
|---|---|---|
| **run wall** (side wall run) | any solid box face; arrows (`GYM.arrows`) say "run here" | length = side-run comfy d (or longer and end it on a deck); height >= 3 m so the run reads; a deck or the next wall waiting at the end |
| **wall-up face** (run UP a wall) | any solid face | lip height <= the wall-run-UP comfy h for the speed you GIVE him there (a run, a sprint lane, a zoom pad) |
| **chimney** (wall-jump between two faces) | two parallel faces | 4.6 m apart (measured: +2.07 m a kick, no limit); any height |
| **ledge** (hang, shimmy, climb up) | any box top edge (`ledgeFind`) | lip within the reach in section 1; ledges in a column every <= 2.5 m make a climbable face |
| **gap** | empty space | plain run jump <= 5.9 m; double jump <= 10 m; long jump <= 11 m; with air kicks see the table |
| **step / stair** | boxes or `bldTris` | risers <= .30 m (his step is .38; anything taller is a WALL to jump) |
| **high bar** | `hbarMake` / `HBAR.list` | swings up ~11.9 m for height, ~19 m for distance at comfy -- the big vertical move |
| **monkey bars** | `MBAR.list` | rungs every .95 m, 1.1 m wide; the drop under them is the threat |
| **swing rope** | `vineMake` | 9 m ropes from a 14 m gantry worked; ropes ~7 m apart |
| **tightrope** | `GROPE` / the gym rope | deck to deck at deck height; railings OPEN where it leaves (m1929) |
| **rope bridge** | the level builder's `rbridge` (`LB.rbs`) | sways under him; rails do not collide yet |
| **zipline** | `ZIPS` | the way DOWN after a climb (a reward, a shortcut back) |
| **ladder** | `kitClimbAdd` | **use rarely** (his: "ladders are kind of stupid for this game"); when used: the ladder stands AGAINST the lip it tops out over -- never mid-hatch (m1929's bug) |
| **launch pad / bowl / loop** | the level builder's `pad` / `qbowl` / `loop` | speed in, so the next face can be a wall-run UP from a zoom (11.6 m of lip) |
| **sign / breakable** | the level builder's `sign` (`lbSignBreak`) | break-through letters, the tutorial's vocabulary |

**Spacing rule:** pieces chain. The END of one move is the START of the next -- a wall run ends on a deck that faces the next wall; a bar's
release lands on a ledge. Lay them out so the player is always reading the next piece while finishing this one.

## 3. THE RULES (his, standing)

- **Planes:** every placement gets a HEIGHT decision. Below, level, above, high above. Routes climb. Spread things out.
- **OMAKASE** (LEVELDESIGN.md): there is one served route; it should feel like free will. Side paths are short and rewarded.
- **50% of the game is the movement.** A temple that can be walked through is not done. Every section of the blueprint names the MOVES it
  is built to make necessary.
- **Ladders rarely; ropes, walls and bars instead.** If a climb could be a wall-jump chimney or a rope, make it that.
- **The fight comes after the climb** (STATUES.md): statues stand along the acrobatic route as a promise; the level wakes them on an EVENT.

## 4. THE BLUEPRINT TEMPLATE -- Temple 1 (top-down, beats first)

Draw it top-down before building. Each beat = a room / area with: its MOVES, its PUZZLE (or none), its ENEMIES, its HEIGHT (floor y and the
highest point), and how it HANDS OFF to the next beat. His outline, as a template to fill:

| # | beat | what happens | moves it teaches / tests | height |
|---|---|---|---|---|
| 0 | **Approach** | see the temple from far off; the route up to the entry is visible | the run, a first wall run | ground -> a terrace |
| 1 | **Initiation** | the entry: a small puzzle opens the outer gate (hit seals, move a block, light braziers) | ledges, a short chimney | terrace |
| 2 | **First guards** | a few guys pop up (an ambush zone) | the sword; using height against them | one level |
| 3 | **The door** | a gate you open from above (a seal on a ledge only reachable by the moves of beat 1-2) | combining two moves | up then down |
| 4 | **Acrobatic hall** | the big movement room: run walls, bars, ropes, gaps over a drop -- with archers taking shots | side runs, high bar, swing, chimney | the tallest room |
| 5 | **Mini boss** | a guardian wakes (a statue from the hall), a small arena with height to use | fighting + movement | an arena with tiers |
| 6 | **Second puzzle** | a puzzle WITH acrobatics (reach three switches by three different routes) | everything so far, chained | spread high |
| 7 | **More guys** | a harder group on varied heights (archers above, swordsmen below) | the bow down (m1929), the air recovery | tiers |
| 8 | **The chalice** | take the treasure -> the statues of the temple wake (the cut-away) -> fight out | the full kit | the summit or the deep |
| 9 | **The boss** | the final arena | -- | -- |

**Deliverable per temple:** this table filled in + a top-down sketch (his drawing, or an ASCII/SVG one) + the height profile (a side-on line of
floor height through beats 0-9, like a rollercoaster) -> only then the blockout.

## 5. THE GUARDIANS (who stands in a temple)

**Already in the game, already with stone forms -- use them now:**
- **Osari spiders** -- stone statues on plinths, wake on the chalice (SPAWN > STATUES, m1705).
- **Stone archers** (the Osari bowmen, `ARCH`) -- archers in stone.
- **The temple dweller** (`OLMEC`, a mini Olmec) -- walks his temple until he notices you; the first of three spawns as his statue (m1737).
- **The stone guardian** (`GUARD`, the four-armed boss, GUARDIAN.md) -- 8.8 m, a blow wakes his statue.
- **The three-headed dog** -- next: his model, in stone via `statueStone` (no new art needed: the stone look is a material swap in code).

**Any of his rigged, animated models can become a stone guardian** with no re-texture (`statueStone`: the map as luminance over sandstone, no
glow, rough). Drop the model in `models/creatures/`; it gets a plinth in SPAWN > STATUES to judge. A hand-painted stone texture (Tripo /
ChatGPT) only for a hero statue that should look better than the code's tint.

**To make (Tripo, then the rig pipeline):** a SIX-ARMED guardian, a FOUR-LEGGED sphinx (wolf- or cat-headed, alien first -- STATUES.md),
GIANT statues for the towers and plinths (some never wake: scale and promise). Each ships with both looks (STATUES.md's rule).

**Placement:** on plinths of different heights, spread out, flanking the route; they wake on the level's EVENT (the chalice, a gate, a bell),
never on proximity. Some never wake -- that is what makes the ones that do a surprise.

## 6. THE WORKFLOW (his question: build it in Cinema 4D and hand back a schematic?)

Three ways in, all ending in the same level data:
1. **The in-game level builder** (`LEVELBUILDER.md`, TOOLS on the phone): pieces with ports, snapped, saved as JSON (`levels/*.json`), loaded as a
   real place (m1902). Best for blockouts he wants to PLAY immediately.
2. **Cinema 4D blockout -> GLB -> the game.** Model plain boxes in C4D, NAMED by role, export GLB; the game reads the names (it already does this for
   collision files: `col_`, `nav_`, `ladder_` markers):
   `wall_<id>` (solid, runnable), `ledge_<id>`, `bar_<id>` (a high bar along the box's long axis), `rope_<a>_<b>`, `zip_<a>_<b>` (two empties),
   `ladder_<id>` (+ its front as the box's local +Z), `spawn`, `seal_<id>`, `statue_<kind>_<id>` (an empty with the kind in the name), `beat_<n>`
   (an empty per beat, for the blueprint). One build adds the reader; after that every C4D blockout drops straight in.
3. **The blueprint table -> the generator** (LEVELDESIGN.md's three scales): the route is authored as beats and moves, and the blockout generated.

**Recommendation:** draw Temple 1's top-down beats first (section 4). Block it out in whichever of 1 or 2 is faster for him -- C4D if he wants to
sculpt the spaces, the level builder if he wants to play each piece as he places it. The look comes last, from the concept art.
