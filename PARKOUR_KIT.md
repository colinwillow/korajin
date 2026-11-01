# PARKOUR KIT -- inventory (LEVEL_METHOD.md step 1, Nov 1 2026)

What exists in index.html today, what it is called, how it collides, and what is missing. "Collider" matters: `BOXES` supports TURNED boxes
(`b.cs / b.sn / b.hx / b.hz`, used by the kit city) -- a piece placed at any angle must use them, never an axis box round its turned shape (the
m2030 generator did, which is why angled pieces could not be wall-run).

## EXISTS (level builder `LB.KINDS`, quarter-turn yaw, snaps by ports, saved as levels/*.json -- LEVELBUILDER.md)
| piece | LB kind | technique | collider | note |
|---|---|---|---|---|
| tall tower / run-up face | `tower` | wall run UP, ledge | axis box (yaw x90 -> exact) | |
| wall (run wall) | `wall` | side wall run | axis box (exact at x90) | arrows via GYM |
| chimney pair | `chimney` | chimney wall-jump | axis boxes | 4.6 m gap |
| curved wall | `lwall` | curved side wall run | padded chord boxes | the "tube section" seed |
| quarter bowl | `qbowl` | speed in / wall run up | boxes | |
| loop | `loop` | speed | boxes | |
| monkey bars | `monkey` | hang traverse (`MBAR`) | bars | rungs .95 m |
| rope swing | `swing` | swing (`vineMake`) | rope | |
| launch pad | `pad` | launch (trampoline-ish) | box + impulse | |
| platform / block / stairs | `platform` / `block` | step, ledge, landing | axis boxes | risers .30 |
| sign (breakable) | `sign` | tutorial letters | breakable | |
| spawn | `spawn` | -- | -- | |

## EXISTS elsewhere (systems, not yet LB kinds)
| piece | system | technique |
|---|---|---|
| high bar (single / long) | `HBAR`, `hbarMake` | bar swing, release for height / distance |
| zip line | `ZIPS`, `ZIP` | ride down / across, katana grind |
| tightrope | `GROPE` | balance walk |
| rope bridge | `rbridge` (`LB.rbs`) | sway walk (rails do not collide) |
| moving platform | `LVG.movers` (m1359) | timed ride, carries him |
| gate / seal marks | `LVG` (`lvgDone`), the m1705 statue wake | shoot / touch to open |
| turret | the turret enemy (samurai goblin) | shoot to proceed |
| ledge hang / shimmy | `ledgeFind` on any box top edge | climb |
| ice slide | `POND` grip (m1997) | slide |
| shield reflect | `SHIELD` + `ICEB` (m2009) | reflect a beam |
| wings / glide | `WING` | glide, updraft (no updraft volume yet) |

## MISSING (to build as kit pieces, one at a time, each in a white sandbox first)
1. **LB kinds for the systems above** -- high bar, zip line, tightrope, moving platform, gate, seal, turret -- so every piece places the same way.
2. **Turned-box colliders for any non-quarter yaw** (use the existing `cs/sn/hx/hz` fields).
3. **Tube section** -- a full curved wall segment (inside of a cylinder) you can wall-run round and climb in a spiral; floor rings at heights.
4. **Updraft column** (for the wings), **trampoline** (bounce, distinct from the launch pad), **beam turret + target** (shield reflection puzzle).
5. **Rope-bridge rails that collide.**
6. **A gap CHECKER** -- for a hand-placed pair of pieces, is the gap inside the intended move's comfy range (the move table) -- shown in the builder.
