# UI RINGS -- the pad buttons, what he owns, and real play (Colin, Nov 2 2026)

*"I don't want to change the SHAPE -- I like the circular sections of a ring -- but if there's only ONE option it should span the whole
space, and the THICKNESS stays the same. Two buttons: the same space, divided in two. When a third needs to go above the other two, that's
a second ring. Why is the backpack floating up there? It should be down where the first button that spans the fan would go."*

*"When you start the game you're not going to have pretty much anything -- no backpack, no sword, no bow -- you're just the guy. If god
mode is off you have what you'd have in the prologue and level one."*

*"We already have the god mode switch at the top. If it's NOT on, he's taking damage. He has life and LIVES, which eventually end in a
GAME OVER, and the game over basically puts you back at the beginning of the level."*

## 1. WHAT HE OWNS (`OWN`, m2263)
- One table in the save: `SAVE.own` (key -> 1), in `mel.prog` beside the chapter and the flags. Keys: `sword bow gun shield wings boots
  backpack fireblade jinblade firearrow blastarrow` (`OWN.keys`; a new thing is a new key).
- Written ONLY by `grant(k)` / `revoke(k)` -- the story's hooks (the prologue's rusty sword on its peg = `grant('sword')`). A grant
  shows a FOUND card. `ownAll(1/0)` for testing.
- **GOD on = everything owned. GOD off = what the save has earned.** A fresh save owns nothing: bare hands.
- `gearHas` asks `ownHas` first, so the old weapon wheel, `kitPick` and the quick-draw all refuse a weapon he does not own; a held
  one he loses is put away; the shield and the wing suit come off (`ownSync`).

## 2. THE RINGS (`RINGS`, `ringPut`, `ringsStep`, m2263)
- One layout for every button round either pad. A pad's buttons are GROUPS (a choice that belongs together).
- **Rings fill from the inside out**: the PRIMARY ring hugs the stick; a group that does not fit (`cap` 2 a ring, the blade's three
  elements are one ring of 3) goes on the next; a group starts on the next free ring. Never an empty ring under a button.
- **Within a ring the buttons divide its fixed arc equally**: one button = the whole arc; n = n equal segments, `seg` px apart.
- **Same thickness on every ring** (`w`). Outer rings keep the inner ring's ARC LENGTH and are clamped so their tips stay on screen.
- **A change re-flows, animated** (`tween` .18 s): a new button grows out of its centre, a lost one shrinks into its own.
- RIGHT pad: `SWORD | BOW-or-GUN` (only what he owns), and `HANDS` a ring up only when there are two weapons to choose between.
- LEFT pad: the `BACKPACK` (owned) on the primary ring (`bagFirst`: it stays put while the weapon changes -- his pick, `RINGS.bagFirst`
  0 puts the weapon's choices inside it), and the drawn weapon's own choices: `BOW | GUN` (both owned), the arrow type (owned arrows),
  `STEEL | FIRE | JIN` (owned blade elements).
- **Tap the weapon that is out again = put it away** (m2057's rule, kept). HANDS stays for now.
- **ONE PALETTE (the title's)**: ink glass + cream rim = there; title RED filled = selected / out; dashed and faded = there but not
  usable now (the BACKPACK with nothing in it); MINT only for Jinra (the JIN blade). Both pads the same.
- The old rows (`qdRow`, `qdTop`, `wepRow` as sub-menu, `formRow`) stay for QUICK DRAW off and `RINGS.on = 0` (`mel.rings` '0') -- A/B.

## 3. REAL PLAY: LIFE, LIVES, GAME OVER (build 2)
- One table: hp, lives, respawn invulnerability. GOD on = today (no damage). GOD off: hp depletes; at zero a life is lost and he
  respawns at the level's start (the last checkpoint, once JINRA_POWER.md's shrines exist); at zero lives a GAME OVER card, then the
  level restarts with full lives.
- A minimal HUD in the game's style. **Hook only, not built:** JINRA_POWER.md turns health into Jinra later -- the hp table is the
  one place that would read a different pool.

## DONE WHEN
- [ ] `OWN` table in the save, `grant` / `revoke` / `ownHas`, GOD = all (m2263)
- [ ] a fresh save (GOD off) has no weapon, no backpack: no pad buttons at all (m2263 render)
- [ ] one sword granted: ONE button spanning the primary arc, no HANDS (m2263 render)
- [ ] sword + bow: two halves, HANDS a ring up (m2263 render)
- [ ] the backpack alone sits on the PRIMARY ring (m2263 render)
- [ ] every pad button set goes through `ringPut` (quick-draw, projectile / arrow / blade sub-menus, the backpack) (m2263)
- [ ] re-flow animates when the set changes (m2263)
- [ ] one palette; selected / unselected / disabled obvious (m2263 render)
- [ ] tap the drawn weapon again = holstered (kept from m2057)
- [ ] GOD off: damage, lives, respawn at the level start, GAME OVER -> restart the level; the numbers in one table
- [ ] the prologue grants the rusty sword on its peg (story hook)
- [ ] **his sign-off on his phone**
