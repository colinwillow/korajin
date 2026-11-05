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
| LT | proposal: precision aim / zoom while drawn | 3 |
| D-pad down / View | backpack open / close (pauses); d-pad / stick nav, A toggle, B back | 4 |
| pause menu | d-pad / stick nav, A select, B back; TOOLS reachable in GOD | 4 |
| cues | button glyphs (A/B/X/Y/RB/LB/RT) instead of stick highlights; rumble through `haptic()` | 5 |

## DONE WHEN
- [x] One action table (`ACT`) called by both touch and pad; one binding table (`GPMAP`)
- [x] Left stick moves; A jumps; right stick orbits AND pitches the camera
- [x] X tap = directional strike; X hold = charge, released by the left stick's pick; B = dodge / phase; Y = interact; Menu = pause
- [ ] RB / LB cycle weapon / sub-weapon; RT draws and looses the bow with free aim
- [ ] Backpack, pause menu and TOOLS navigable with d-pad / A / B
- [ ] Glyph cues, rumble, touch UI hidden by default (rings too) with the TOOLS toggle
- [ ] Connect / disconnect live, touch takes over when the pad goes
- [ ] **His sign-off, with the controller in his hands**
