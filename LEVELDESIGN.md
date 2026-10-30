# LEVEL DESIGN -- the rubric (his five layers, checked against what designers say)

His method (after m1369) is the spine. The research did not replace it: every serious source describes the same order, with **traversal
first, then the gating, then the enemies placed around the gates, then a theme, then a boss that tests what the level taught.** What
the research adds is **a layer zero (the numbers), a shape inside each layer, and a few things it is easy to forget.**

## THE PLANES RULE (his, standing: *"different planes, different heights, and spreading things out"*)
Every level is built in TIERS, never on one ground plane: a low tier (pits, sunken courts, the underside), the main tier, raised tiers (roofs,
ledges, platforms), and a high tier (spires, airships, the boss's perch). Routes move BETWEEN tiers. Key things are spread out with room
round them. A blueprint that puts everything at one y is wrong before it is built.

## Layer 0: THE NUMBERS (before any geometry)
- **Fix the character's metrics first:**
  - jump height and distance
  - run speed
  - wall-run length and height
  - bar reach
  - the step (.357 m)
  - safe fall height
  - how far the camera sees

  Every gap and ledge is then sized FROM them, never eyeballed. Glowtide already did this (route checker: jump apex 2.81 m, sprint gap 7.6 m).
- **For us, measure the COMBOS, not just the single moves (his note):** the distance comes from chaining. The rows to measure, each as height and as distance:
  - the jump, then the double jump
  - the high jump (backflip)
  - jump + swipe-swipe-swipe (the air dashes)
  - double jump + swipes
  - high jump + swipes
  - the HIGH BAR launch (super high and far)
  - the zoom, then zoom + jump
  - the wall run up (by run-up speed)
  - the side wall run, then wall run + kick
  - the WALL SLIDE + wall jump chain between two walls (m1372: per wall, how much height a jump gains)

  The level is built from that table. A gap that needs "double jump + two swipes" is a different beat from one that needs a plain jump, and the table is what lets a gap be built on purpose.
- **For us:** measure Grumbo's jump, double jump, wall run, zoom and hover once. Write them into LEVELGRID.md, and size the grid cells (7 m, 4.5 m levels) against them.

## Layer 1: THE RUN (ninja parkour centre)
- **One mechanic at a time, in four beats (Nintendo's *kishōtenketsu*):**
  1. INTRODUCE it where failing costs nothing
  2. DEVELOP it (longer, higher, chained)
  3. TWIST it (combine it with another, or flip the rules)
  4. CONCLUDE (a final test, then drop it)

  A mechanic is never TESTED before it is TAUGHT.
- **A rhythm, not a ramp:** difficulty goes up in a SAWTOOTH, with hard stretches followed by REST (a safe pad, a view, a pickup). Checkpoints sit at the rests, spaced so a fall costs a little and never the whole run.
- **Readable:**
  - **the critical path:** the intended route is the MOST LEGIBLE one, but not the only one
  - **landmarks in three tiers:**
    - a GLOBAL one seen from almost anywhere (the boss keep / tower, Disney's "weenie")
    - LOCAL ones per area
    - MICRO cues at the next move (paint, light, a ledge colour)
- **Verticality that is SEEN:** from high points, show where you have been and where you are going.
- **Fail forward:** a fall drops you somewhere you can climb back from fast (our ladders back up from every pit), never to the start.
- **Optional is a reward:** side branches are harder and pay out (a ring, a cache, a shortcut). The golden path stays clear.

## Layer 2: THE PUZZLE (locks and keys)
- **Draw it as a graph before building it (Mark Brown's *Boss Keys* diagrams):** the locks (gates, bridges, the boss door), the keys (buttons, candles, abilities, items), and which areas each key opens. Then check it: is there ever a CHOICE of which lock to open? Does each key send you somewhere new?
- **Keys don't have to be things.** An ability is a key (Metroid's morph ball), so are a switch state or a raised water level. "Many keys, one lock" and "one key, many locks" are both good shapes.
- **LOOP BACK (Dark Souls):**
  - a key should often open a SHORTCUT back to somewhere you have been: a door opened from the far side, a ladder kicked down, a lift
  - the level folds back on itself, so you never re-walk a stretch you have mastered
  - the moment you realise where you are is the reward
- **Widen the space:** each key makes the reachable world bigger. It doesn't just move you along a corridor.

## Layer 3: THE ENEMIES (guards with ZONES)
- **Only where a layer-2 piece is:** a button, a door, a key, the boss approach. An enemy guards something.
- **ZONES:**
  - each enemy has a circle round what it guards (a "leash" in MMO terms)
  - its sight, its shots and its chase stay inside it; past the edge it gives up and walks back
  - ranged enemies may have a bigger zone than melee, but still one you can see the edge of
- **Line of sight is the aggro.** Cover breaks it, and a zone edge is somewhere you can stand and plan.
- **Never unavoidable:** nothing fires at the spawn, the rest pads or the open run. You must always be able to see a threat before it can hurt you.
- **Use the layer-1 shapes:** choke points, a wall run under archer fire (only once you know the wall run), an open flat floor where the melee happens.

## Layer 4: THE THEME (what sets the level apart)
- **One idea the level is ABOUT:** air, water, puzzle, enemies, vehicles, co-op. It TWISTS the run (beat 3 of kishōtenketsu at the level's scale).
- **The test:** would you know which level this is from one screenshot?

## Layer 5: THE BOSS (the final arena)
**(his, Oct 28 2026) Every level's finale is the enemy's TORCH TOWER: climb it, beat its keeper, pour your Jinra into the brazier, and it turns mint and beams to the central tower (KORAJIN.md, THE JINRA BEACONS).**

- **The boss is the level's CONCLUSION:** it tests the mechanics the level taught, in a big open space (a dojo). It is not a new rule.
- **Telegraphed attacks,** a rest between phases, and a spectacle at the end (the keep falling).

## What his list did not have (the additions)
- **Layer 0:** the metrics.
- **Teach, then test:** kishōtenketsu per mechanic.
- **The rhythm:** a sawtooth with rests and checkpoints.
- **Wayfinding:** landmarks in tiers, and a legible critical path.
- **Loop-back shortcuts:** they make the puzzle layer pay for itself.
- **Zones:** leash, line of sight, never unavoidable.

## OMAKASE: you experience only what we serve, and it feels like free will (his, after m1379)

> *"[A guy on a podcast] builds dead-end things on purpose -- you can only get here from here -- because he's driving a narrative. I have a tendency to
> make it so you can do everything all at once: every game I add that, add that, and now I have the exact same video game. I need to think the
> opposite. There is an art to only allowing you to experience what I want you to experience at that given time -- that's what all these great games
> are like. Omakase: only experience what I allow you to experience, while feeling like you have the illusion of free will and free choice."*

This is the strongest note on the list, because it names the habit that made Weirdport: every system everywhere at once. The research agrees on all four points below.

- **Omakase in software:** DHH's "Rails is omakase". The chef picks the ingredients and the ORDER. Opinionated design trades à-la-carte choice for a curated path: faster to learn, less fatigue, and a vision instead of a jumble.
- **Games:**
  - **Uncharted:** cues steer you so the space feels bigger and less linear than it is.
  - **Half-Life:** linear spaces that read like a film.
  - **BioShock:** turns the illusion of choice into the story itself.
  - **Jim Brown (Epic, GDC):** make choice illusory while keeping the player's autonomy.
- **Restrict, then give back:** strip the game to its barest verbs, then add one mechanic at a time. Each level is a chain of verb/challenge pairs. Breath of the Wild's opening plateau teaches by what you CAN'T do yet (a cliff you can't climb). Celeste starts with jump and climb, then gives you ONE dash. And a constraint has to feel purposeful, never arbitrary.

### What it means for Korajin (the rules we build by from now on)
1. **A VERB BUDGET PER LEVEL.** Grumbo can do everything in the arena and the forge; those are dev rooms. In a LEVEL he has only the verbs the level serves.
   - Level 1 might be: run, jump, double jump, the wall slide. Nothing else, no weapon.
   - Each later level adds ONE verb (the bar, the zoom, the katana...) as its featured dish. It is taught (kishōtenketsu), mastered, then KEPT for the levels after.
   - The level's theme (layer 4) is usually its new verb.
2. **ONE WAY IN, the dead ends on purpose.** A station is reached from where WE choose: a door that is shut until a key, a drop you can't climb back up, a bridge that falls behind you. Shortcuts open BACKWARDS (Dark Souls), after you have earned the place, never forwards past it.
3. **THE ILLUSION OF CHOICE.**
   - Branches that rejoin (the string of pearls).
   - Side pockets that pay out and come back.
   - Two routes to the same station.
   - VISTAS of places you can't reach yet: the boss keep seen from the start, the summit across the canyon.
   - Light, paint and motion that lead the eye, so the right way feels like your idea.
4. **SERVE IN ORDER.** A level's beats are a menu written in advance: the first taste (safe), the build, the surprise, the finale. Never two new things at once. Never a weapon before the moment it is for.
5. **NO INFO DUMPS.** The game says nothing it can show instead. A verb is introduced by a space that needs it (CLAUDE.md for Culture Wars: "show, don't label"), not by a card.
6. **THE MENU OF THE GAME ITSELF IS OMAKASE.** The player sees a level select that opens one level at a time. GOD, SPAWN and TOOLS are the kitchen: they stay for development and are hidden from the guest.

### The blueprint gets two new fields
```
verbs:   [run, jump, double, wallslide]        <- all he can do in this level; the rest are locked here
serves:  wallslide                              <- the ONE new verb, taught -> developed -> twisted -> concluded
```
The solver only uses chunks whose moves are in `verbs`, and the move table (`tools/moves.json`) sizes them from those verbs alone. A level without the double jump never asks for 5 m.

Sources: [Rails is omakase via Opinionated Software](https://concepts.dsebastien.net/concept/opinionated-software/), [best products are opinionated](https://summify.io/discover/best-products-are-opinionated/), [Jim Brown: The Illusion of Choice (Game Developer)](https://gamedeveloper.com/design/jim-brown-s-level-design-workshop-the-illusion-of-choice), [GMTK: Why Nathan Drake Doesn't Need a Compass](https://amara.org/subtitles/xwcncEJkgSYU/en/2/download/Why%20Nathan%20Drake%20Doesnt%20Need%20a%20Compass%20%20Game%20Makers%20Toolkit.en.txt), [BioShock and the Illusion of Choice](https://the-artifice.com/bioshock-and-the-illusion-of-choice-in-gaming/), [Cornell CS3152: restrict then add mechanics](https://www.cs.cornell.edu/courses/cs3152/2026sp/lectures/lecture2/slides-2.pdf), [Automaton on Breath of the Wild's opening](https://automaton-media.com/en/?p=50929), [Less is More: limiting player abilities](https://www.wayline.io/blog/less-is-more-limiting-player-abilities)

## THE BLUEPRINT: three scales of dynamics, designed and then GENERATED (his, after m1372)

> *"Primary markers in the level, secondary between them, and tertiary between those -- little dynamics inside medium dynamics inside big
> dynamics -- weaving a web of tension, motion, movement and logic. We need to figure out how to generate a good grid blockout of these in
> three dimensions. You built my level very literally, the colours and the heights from a test image I had generated. We need to design really
> interesting blueprints that we can then scaffold and build around."*

**He is right about Level 1:** its path, heights and colours were transcribed from a generated test image, so nothing in it was DESIGNED. From here, a level starts as a blueprint at three scales, and the geometry is GENERATED from the blueprint, never typed cell by cell.

### The three scales
| scale | what it is | size | what it carries |
|---|---|---|---|
| **PRIMARY** (the spine) | 4-6 STATIONS: the start, the key places of the puzzle, the boss arena | a station is a room or plateau, 15-30 m | the layer-2 locks and keys, the landmark views, the rest and checkpoint, the height profile (see below) |
| **SECONDARY** (the runs) | the route between two stations: 3-6 MOVES in kishōtenketsu order (teach, develop, twist, conclude) | a run is 40-120 m and 30-90 s | ONE featured move per run (wall jumps, bars, zips...), its rest at the end, and its risk-reward side pocket |
| **TERTIARY** (the texture) | inside each move: small hops, a kerb, a lip to mantle, a duck, a coin line tracing the jump's arc, a moving platform's timing | 1-8 m | the moment-to-moment rhythm: something to do every 2-3 s |

**The web:**
- **The spine CROSSES ITSELF in 3D** (over and under), so a run passes beneath a station you will stand on later.
- **Stations SEE each other,** so from every rest you can see where you have been and where you are going.
- **Keys open LOOP-BACK shortcuts** between stations, so the level folds.

### The height profile (the verticality is planned, like a rollercoaster)
- Each level gets a profile before anything else: the station heights in order. For example: start 0 → climb to 12 → drop to 4 → the big climb to 30 → a ride down → the finale at 10.
- Big climbs are where the featured verticality moves live (wall-jump chimneys, bar chains, wall runs up). Drops are rides (zips, slides, falls into water).

### How the blockout is generated
1. **The MOVE TABLE** (layer 0): each move and COMBO, measured from the shipped physics, as how far and how high it can go (minimum, comfortable, maximum). The table is the contract: a generated gap is never longer than its move's "comfortable".
2. **The CHUNK LIBRARY:** each move is a parametric piece of geometry with an IN port and an OUT port (position, height, heading). The pieces:
   - gap jump, double-jump gap, swipe gap
   - wall-jump chimney
   - bar chain, the long bar
   - wall run up / along
   - ladder, ramp, stairs
   - movers, a rope, a zip, a ride (the zeppelin)
   - a rest pad
   - a station room

   Its size comes from the move table, never from feel.
3. **The SOLVER:** it lays the stations on a coarse 3D grid (their x, z and profile height). Then, for each run, it chains chunks whose in/out deltas add up to the gap between the stations. It keeps them out of each other's space (1 m voxels, with over/under allowed and clearance kept), and puts tertiary texture inside each one. It is seeded, so one blueprint gives many candidate blockouts.
4. **THE CHECK:** every chunk is walked by the route checker against the move table. Is every gap makeable, every climb climbable, every drop survivable or caught? A blockout that fails is discarded, not shipped.
5. **THE PREVIEW:** before building, a page with the plan from above, the side elevation (the height profile with every chunk on it), and the station-to-station graph. He picks a candidate on his phone, and only then is it built and played as layer 1.

### What a blueprint looks like (the authored part: everything else is generated)
```
LEVEL 1  "The Climb"      theme: (layer 4, later)
profile: S 0 | A 9 | B 4 | C 27 | D 31 | BOSS 12
stations:  S start yard | A lantern tower (key: drop the bridge) | B sunken court (rest, sees C) | C the cliff face (key: the candle)
           D the summit (sees everything; zip to BOSS) | BOSS the dojo (open, flat, 30 m)
runs:      S->A  teach: jump, double jump, a low wall run          (featured: double jump + swipe gaps)
           A->B  ride: zip down, then a slide                       (rest at B)
           B->C  THE BIG CLIMB: wall-jump chimney x3, a bar chain  (side pocket: a ring + cache off the chimney)
           C->D  twist: wall runs over a pit, timed movers
           D->BOSS  the long zip over the whole level
loops:     the key at A drops a bridge B->S (a shortcut home); the candle at C opens a lift C->B
```

### The build order for this (it replaces adding passes to the transcribed Level 1)
1. **The MOVE TABLE:** measure every move and combo from the shipped physics, headless, scripted inputs. Output: a table in LEVELGRID.md, and a JSON the generator reads.
2. **The CHUNK LIBRARY:** the parametric pieces with ports, each viewable on its own in the forge.
3. **The BLUEPRINT format + SOLVER + CHECK.**
4. **The PREVIEW page:** plan, elevation and graph, with candidates to pick from.
5. **Level 1 v2:** the blueprint above (or his), generated and picked, then played as layer 1. The transcribed Level 1 stays on the menu as "Level 1 (sketch)" for comparison until v2 replaces it.

## Grid Level 1 against the rubric (now)
| | state |
|---|---|
| **0 numbers** | NOT measured for Grumbo. Cells and gaps were sized by feel. |
| **1 run** | **Has:** variety (ramps, ladders, a wall run up, a three-part wall run, bars, the long bar, movers and a rope, the zeppelin, two zips) and ladders back from pits. **Has not:** any INTRODUCE beat (the three-part wall run is the first wall run you meet over a pit), REST pads, checkpoints, or a global landmark from the start. |
| **2 puzzle** | A straight chain (guards → tower → button → candle → gate → zip → door). No choice, no loop-back shortcut, keys are all switches. |
| **3 enemies** | **No zones.** The catapults reach 55 m and hit the spawn. Fix before he judges layer 3. |
| **4 theme** | None yet. |
| **5 boss** | The keep: a shape you fell, telegraphed by shields, with guards. It does not test the run. |

**Next layer-1 passes, from this:**
1. Measure the numbers.
2. Re-order the run into teach → develop → twist → conclude per mechanic (a safe wall run before the pit one, a low bar before the high ones).
3. Add rest pads and checkpoints.
4. Make the keep the landmark seen from S.

## Sources
- Nintendo's four steps / kishōtenketsu: [MCV/Develop](https://www.mcvuk.com/development/video-nintendos-level-design-secrets-in-four-steps), [MCV on GMTK](https://mcvuk.com/?p=70645), [Koichi Hayashida](https://en.wikipedia.org/wiki/Koichi_Hayashida), [Nintendo Life](https://www.nintendolife.com/news/2016/02/video_learning_how_mario_teaches_us_the_basics)
- Metrics, critical path, landmarks, sawtooth: [The Level Design Book](https://https-book_leveldesignbook_com.proxy.bugsmash.io/process/blockout/massing/composition), [level-design skill notes](https://claudeskills.info/skills/gamedev-skills/awesome-gamedev-agent-skills/level-design/)
- Locks and keys: [Boris the Brave](https://www.boristhebrave.com/2021/02/27/lock-and-key-dungeons), [Zelda Universe on Boss Keys](https://zeldauniverse.net/2017/01/26/explore-zelda-dungeon-design-in-mark-browns-youtube-series-boss-keys/), [Boss Keys: Link's Awakening transcript](https://amara.org/videos/sA8tGCZJvrxP/en-gb/3101254), [Level Design Diagram Generator](https://mimicrymedia.itch.io/lddgenerator)
- Loop-backs: [TheGamer on Dark Souls](https://www.thegamer.com/dark-souls-1-fromsoftwares-magnum-opus-of-interconnected-level-design/), [Game Wisdom](https://game-wisdom.com/?p=8698)
- Enemies, leashes, arenas: [Warcraft wiki: Leash](https://warcraft.wiki.gg/wiki/Leash), [UESP: Leashing](https://app.uesp.net/wiki/Online:Leashing), [Game Developer: level design for melee combat](https://www.gamedeveloper.com/design/level-design-for-melee-combat-systems), [SRB2: enemy placement](https://wiki.srb2.org/wiki/Level_Design_101/Enemy_placement)
- Platformer pacing and rests: [Game Design Skills: 3D platformer level design](https://gamedesignskills.com/game-design/3d-platformer-level-design/), [RetroStyle: platformer tips](https://retrostylegames.com/blog/platformer-level-design-tips/)
