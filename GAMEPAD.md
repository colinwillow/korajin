# GAMEPAD -- full controller support (Xbox layout, browser Gamepad API)

*His (Nov 5 2026): "map every action through one action table so the touch layout and a pad read the same bindings and stay in sync
automatically. On a pad the right stick is ONLY the camera; the buttons do what the right pad's gestures do."* (WORLD_PLAN.md section 6)

## How it is built
- **`ACT` is the action table.** Every verb a thumb can ask for is one function: `lTap`, `lFlick(dx, dy)`, `rTap`, `rFlick(dx, dy)`,
  `rRel`, `jump`, `interact`, `dodge(dx, dy)`, `strike(dx, dy)` (more join it pass by pass). The touch pads' gesture handlers call it; the
  gamepad's buttons call it. **No game logic is forked per device.** `(dx, dy)` is always pad space: +x right, +y DOWN the screen.
- **`GPMAP` is the ONE place a button is bound** (standard mapping indices), overridable as JSON in `localStorage['mel.gpMap']`.
- **The left stick is written into `stick.L`**, so every reader of the left pad (move, the katana release pick, the crank spin, ladders) sees
  it unchanged. A real thumb on the left pad outranks it.
- **A held X / RT is the right pad held UP** (`stick.R` written exactly as the desktop mouse button does, `deskUp`'s twin `gpRUp`), so the
  charge, its sounds, its top-out, the bow draw and `chargeRelease` run with no edit.
- **The right stick is the camera only**: yaw as a rate into `cam.az` and PITCH (`GP.pit`) into `cam.el`'s target -- both inside `stepCam`,
  the one writer. Touch keeps its fixed pitch.
- `gpPoll` runs at the top of `frame()`, before the pause check, so the menu key and menu navigation work while paused.
- Last device wins: a controller press hides the touch pads (`body.gpad`); a touch shows them again. TOOLS > CONTROLLER: TOUCH PADS.

## The mapping (his first draft)
| input | action | pass |
|---|---|---|
| left stick | move (`stick.L`) | 1 |
| right stick | camera: orbit + free pitch (OPTIONS invert / speed apply) | 1 |
| A | jump; again in the air = double jump (`ACT.jump`) | 1 |
| X tap | katana strike the way the LEFT stick points; neutral = ahead (`ACT.strike`) | 2 |
| X hold | charge (melee weapon out); release: the LEFT stick picks it (forward launch / neutral / back = high / left-right whirlwind) | 2 |
| B | dodge = the left flick the way the left stick points (side flip / backflip / ahead), PHASE blink when PHASE is on; neutral = backflip | 2 |
| Y | interact / talk / pick up / portal (`ACT.interact`) -- the half of the touch right tap that is not the jump | 2 |
| Menu | pause menu open / close; B closes | 2 |
| RB | next main weapon (the right ring's order) | 3 |
| LB | next sub-weapon (the left ring: arrow types, blade element) | 3 |
| RT hold | bow draw (draws the projectile if the sword is out), release = loose; aim with the right stick | 3 |
| LT hold | precision look: the right stick at 0.4x (for the bow) | 3 |
| D-pad down / View | backpack open / close (pauses); d-pad / stick nav, A toggle, B back | 4 |
| pause menu | d-pad / stick nav, A select, B back; TOOLS reachable in GOD | 4 |
| cues | button glyphs (A/B/X/Y/RB/LB/RT) instead of stick highlights; rumble through `haptic()` | 5 |

## Menus (pass 4)
One cursor, `GP.nav` (`pm` the pause menu, `bag` the backpack, `tools` GOD's TOOLS panel); the list is re-read every frame, the focused entry wears
`.gpfoc` (cyan). D-pad / left stick move (held = repeat), left / right move a slider, A presses, B goes back a page or closes. The backpack and
TOOLS PAUSE the game while the pad is in them (`GP.hold`). In the backpack d-pad DOWN / View close it, so left / right / up step its segments.
TOOLS: the pause menu shows a TOOLS button in GOD (in the arena / forge / home, where the TOOLS panel lives).

## HUD and rumble (pass 5)
`#gpHud` along the bottom while the pad is in use: RB + the weapon out, LB + the sub-weapon, X, RT, Y + what is in reach to use, the pack.
The touch pads AND the rings hide (`body.gpad`); the left ring shows only while the backpack is open on the pad. Every `haptic()` buzz also
rumbles the controller (`gpRumble`: `vibrationActuator.playEffect`, else `hapticActuators[0].pulse`), off with TOOLS > HAPTICS.

## Gap fixes (m2682)
- The HUD's Y label covers the right tap's older verbs too (TALK, PICK UP, RIDE, TRAVEL, SAMPLE), read off the classes the game already puts on
  `#padR`, not only the `INTERACT` registry.
- TOOLS > MOVE > CONTROLLER STICKS: SWAPPED (left-handed) -- the right stick moves, the left stick looks (`GP.swap`, `mel.gpSwap`).

## DONE WHEN
- [x] One action table (`ACT`) called by both touch and pad; one binding table (`GPMAP`)
- [x] Left stick moves; A jumps; right stick orbits AND pitches the camera
- [x] X tap = directional strike; X hold = charge, released by the left stick's pick; B = dodge / phase; Y = interact; Menu = pause
- [x] RB / LB cycle weapon / sub-weapon; RT draws and looses the bow with free aim (pass 3)
- [x] Backpack, pause menu and TOOLS navigable with d-pad / A / B (pass 4)
- [x] Glyph cues (`#gpHud`), rumble, touch UI hidden by default (rings too) with the TOOLS toggle (pass 5)
- [x] Connect / disconnect live, touch takes over when the pad goes (`gpPoll` every frame; a touch also takes over)
- [ ] **His sign-off, with the controller in his hands**
