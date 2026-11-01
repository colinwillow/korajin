# LEVEL METHOD -- how a Korajin level gets designed (Colin, Nov 1 2026)

> *"Every time I focus a lot of attention on one small thing it turns out really good; as soon as we expand it feels chaotic, messy, unrefined -- the
> aesthetic suffers, the logic suffers, it feels random and boring. The Red Hollows' first part is crafted and refined. Build a blueprint top down, a
> grid -- hexagonal, more organic, big areas as several hexes -- zoom into ONE cell and focus on it until it feels good, only then move on. The temple
> generator was random, easy, no abilities, no wall running, box colliders on angled things. The whole point of the wall-run course: build TECHNIQUES,
> then design challenges that USE them -- a horizontal wall run bridges an abnormally long ravine; a 100-foot wall run up a tower; then a zip line or a
> high walk or moving platforms to the next area; a progressive climb, spiralling round the walls of a tube. Fit the pieces together like a skate park.
> It needs to feel like a game designer designed the level."*

This file outranks "just build more". The WHOLE-PIECE rule (CLAUDE.md) applied to levels.

## 1. The HEX BLUEPRINT (one per region / temple)
- A top-down map of HEX CELLS (flat-top, ~24 m across). A big space (an arena, a hub, the boss chamber) is several hexes merged.
- Every cell has one row in a table (`<LEVEL>_HEX.md`, and the same data in the game): `id`, `hexes`, `role` (entry / traversal / combat / puzzle /
  reward / boss / rest), the ONE technique it is about and its STEP (below), its HEIGHT band (in / out), its EXITS (which edges open, at what height),
  and its STATUS: blank -> sketched -> blockout -> played -> REFINED -> SIGNED (his sign-off on the phone).
- The map is drawn as a page coloured by status, so "what is finished" is always visible.
- **Only one cell is ever being built.** The rest stay blank or sketched. A cell that is not SIGNED is not built on.

## 2. TECHNIQUE-FIRST (the move set is the vocabulary)
For each technique, a ladder of four steps (introduce -> develop -> twist -> combine), each a known challenge pattern sized from the MOVE TABLE:
| technique | INTRODUCE (safe, obvious) | DEVELOP (longer, higher) | TWIST (a new condition) | COMBINE (with another) |
|---|---|---|---|---|
| side wall run | a 5 m gap with a wall beside it, a floor below | a ravine 8 m wide; the wall ends on a deck | walls alternate sides; archers on the far deck | wall run -> high bar -> drop |
| wall run UP | a 3 m lip from a run | a sprint lane into a 4.5 m lip | a zoom pad into an 11 m tower face | up a tower -> zip line off the top |
| chimney | two faces 4.6 m apart, 6 m tall | 15 m tall | the faces end at different heights | chimney -> ledge shimmy -> wall run |
| high bar | one bar over a short drop | bar to bar to bar | a release for HEIGHT to a ledge | bar -> rope -> wall run |
| rope / swing | one rope over a gap | two ropes | a rope whose landing is guarded | rope -> wall run |
| zip line | a ride down | a ride across a void | a jump off mid-line onto a ledge | climb -> zip -> fight on landing |
| moving platform | a slow one | a sequence | timed with a hazard | platform -> wall run off it |
| trampoline / pad | up to a ledge | into a wall run up | across a gap mid-air turn | pad -> glide (wings) |
| shoot to proceed | shoot a seal to drop a bridge | shoot a guard tower before crossing | a moving target | shoot mid-wall-run |
| ice slide / shield / glide | per the snow abilities | | | |
A cell is designed as ONE step of ONE technique (plus at most one supporting move). A region is a SEQUENCE of steps: you learn a move, it gets
harder, it gets twisted, it gets combined -- that is what reads as "designed".

## 3. THE PARKOUR KIT (the skate park pieces)
Every challenge is built from real pieces whose colliders are exact (oriented boxes / real triangles, never an axis box round an angled thing),
each sized from the move table and with snap PORTS -- not generated boxes:
wall-run wall (straight / curved, 3 lengths), tall run-up face (3 heights), chimney pair, ledge row, high bar (single / row), rope, zip line, moving
platform (path), trampoline / launch pad, tightrope, rope bridge, guard tower (shootable), seal / switch, gate (enemy spawn), stairs (.30 risers),
landing deck, tube section (a curved wall segment to spiral round). The wall-run gym already holds most of these -- inventory first, then fill gaps.

## 4. THE LOOP PER CELL
1. Brief: role, technique + step, height, exits (one paragraph, in the HEX table).
2. Blockout from KIT pieces only (grey), in a white sandbox first if the technique is new.
3. He plays it on the phone -> notes -> refine (spacing, timing, readability, camera).
4. Dress it in the region's look ONLY after it plays well.
5. SIGNED -> the next cell. Nothing else in flight.

## 5. What happens to the generator
`tlayGen` (m2030) is RETIRED as a level maker -- random placement is the opposite of this method. What survives: the move-table ranges (as a CHECKER
that a hand-placed gap is inside a move's comfy limit) and the hub/sub-chamber idea as a HEX BLUEPRINT to be designed by hand, cell by cell.
