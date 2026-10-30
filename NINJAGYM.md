# THE NINJA GYM -- a sandbox (whole-piece rule)

`?w=forge&zone=wall` (KORAJIN > the wall course). A ninja jungle gym: wall runs, towers, a tightrope, a rope swing, monkey bars, all
in one white sandbox and fun on its own before any of it goes in a level. Built data-first (`GYM` between `SC_GYM` markers).

His words (Oct 30 2026): *"Extend the wall running course: bigger, taller, longer and more spaced out walls -- the parallel ones much farther
apart, the horizontal wall longer, the high one taller, ones that lead from one style to another, ones with gaps where you run along one
wall, jump across to a parallel wall, run along that, jump back. Two really tall towers -- almost Eiffel Tower looking -- one with a ladder,
and at the top a rope to the other tower: the high walk, the tightrope. Like the balance beam, but he moves a bit faster, and it bends and
wobbles like the rope bridge while you balance. A rope swing: climb up and down a rope, swing, pump, move yourself around. Arrows on the
walls you're supposed to run on. Monkey bars too. Like 10 passes to make an incredible ninja jungle gym."*

## Passes
- [x] **1. The walls (m1841):** A long wall 50 m; B tall faces 8 / 14 / 22 m; C chimney 5.5 m apart, 20 m; D zigzag with gaps (8 m across,
  4 m gaps); E a wall that runs into an 18 m tower face; F corners. Chevron arrows on the faces show the line. Edge-drop blend + eased hang IK.
- [ ] 2. **The twin towers:** two lattice towers (~30 m, Eiffel-ish, tapering), one with a long ladder (the climb system), decks at the top.
- [ ] 3. **The tightrope:** a rope between the tower tops -- the beam system, a faster walk, and the rope sags / wobbles under him (ROPEB's verlet).
- [ ] 4. **The rope swing:** a hanging rope: catch it, climb up / down, swing, PUMP to build the arc, let go at the top of the swing.
- [ ] 5. **Monkey bars:** hand over hand along a row of bars (the high-bar hang), swing to skip a bar, drop.
- [ ] 6. **Linking:** routes that flow piece to piece (wall run -> rope swing -> monkey bars -> tower), with height tiers (VERTICALITY rule).
- [ ] 7. **Route markers:** arrows / rings for each route, a start and a finish, a timer.
- [ ] 8. **Look:** a ninja-training-ground skin (wood, rope, paper, lanterns) instead of flat colour boxes.
- [ ] 9. **Variants and hazards:** moving pieces, crumbling holds, wind on the rope.
- [ ] 10. **His tuning pass.**

## DONE WHEN
- [ ] Every piece above exists and plays.
- [ ] A full route from the ground to the top of a tower and down another way flows without a stop.
- [ ] The tightrope and the rope swing feel physical (sway, pump) -- his words, not a measurement.
- [ ] **His sign-off on his phone.**
