# Slide, cover, vault -- a movement sandbox for the shooting

**Status: PART 1 BUILT (m1008): the pillars, the slide (tackle / into cover), crouched cover with the move along it and the exit. Next: the vault, the pop-up shot, bolts over a crouched body, enemies that use it.** It is a sandbox under the WHOLE-PIECE RULE (`CLAUDE.md`): a white
obstacle course of half-height blocks, done when every box below is ticked with evidence and he has signed it off on his phone.

## Why
*"I disabled the cover on walls because it was automatic and would trigger any time you go against a wall -- really annoying. But I
still want cover... the way we initiate it so it doesn't happen accidentally: you slide tackle into the curb and that initiates the
cover... people make Unreal motion packs, parkour, slide to cover, hurdle over -- I want to build all that on mobile."*

## The controls (his, as described)
| left pad flick | does |
|---|---|
| away from any wall | a **SLIDE TACKLE** (replaces the dive roll; maybe the roll stays on another case) |
| **toward** a half-height wall in range | **SLIDE INTO COVER**: back to the wall, crouched |
| in cover, toward the wall | **VAULT** over it |
| in cover, away | leave cover |

| right pad | in cover |
|---|---|
| hold UP (gun out) | **POP UP** and shoot over the wall; let go -> back down |

Cover is only ever entered on purpose (the flick toward the wall), never by walking into one.

## The rule that makes it fair (his)
The aim is a 2-D plane (no up/down). So bolts fly at a height that **passes OVER a half-height wall**: crouched behind it, they go
over your head; standing (popped up to shoot), they hit you. Cover protects by ducking, not by the wall eating shots -- so shooting
from cover costs exposure, and the cheap "stand behind it and shoot" does not exist.

## DONE WHEN
- [x] Half-height cinderblock pillars, in the arena (m1008; TOOLS > BLOCKS). Evidence: NOTES m1008.
- [x] Slide tackle on the left flick; slide-into-cover when flicked toward a wall in range; never automatic. (m1008, headless; his phone pending)
- [ ] Vault over from cover; leave cover away from it. (leave: m1008; vault: next)
- [x] Pop up and shoot (right pad up) and drop back on release. (m1010, headless)
- [ ] Bolts pass over a crouched body behind half cover and hit a standing one -- both ways (him and the enemies). (m1010: half blocks never stop a shot; a ducked body is missed by the hitscan enemy; the arena has no flat-shooting enemy yet)
- [ ] Enemies that use it too (at least one that ducks and pops).
- [ ] No words on screen explain any of it.
- [ ] **He played it on his phone and signed it off as fun.**

## His additions (Oct 25 2026, m1000)
*"Once we get all the guns worked out... the left-stick flick as a slide tackle, slide tackle into cover... a whole new set of animations.
We technically had cover on Zap, but he needs to be in a CROUCH cover, so go back through Mixamo for the crouch-cover directions... a few
half-height giant cinderblock horizontal pillars to test on... slide into cover, go left, go right, and press-and-hold the right stick
to pop up and start a shot, let go to shoot -- only with a gun equipped."*
- Order: after the guns are worked out. Clips to bake (library): crouch cover idle (left- and right-facing), crouch cover move left /
  right, cover pop-up-aim and the return, slide (into cover), vault. Test geometry: half-height cinderblock pillars in the arena.
- In cover: left stick = move along the cover left/right; right pad HOLD = pop up and wind the shot, RELEASE = fire and drop back
  (gun slots only; with no gun the right pad does what it does now).

## Needs
Clips (library / Forge): slide, slide-to-cover, cover idle crouched (both sides), cover pop-up shoot, vault. The old wall-cover code
(disabled) is the place to look first -- `grep -n` NOTES.md for the cover / wall entries before writing any of it.
