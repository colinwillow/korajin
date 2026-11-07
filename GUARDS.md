# GUARDS -- every enemy blocks by a RULE, never a coin

His (Nov 7 2026, after the Sword Saint and the Shadow): *"Those were fun because they parry you and they can block you. Let's implement a
little of that with other enemies: guys with shields block you half the time, guys with swords or staffs block you, so there's some skill
element. It shouldn't just be random chance. Maybe one enemy you can only beat by hitting from behind... Other enemies, like swordsmen: they
basically block you every time unless you CHARGE them; then they stumble back and are vulnerable for a second."*

Code: `GUARDS` (SC_GUARDS -- the per-kind table and the numbers, live on the page), `cbtGuardRule` (the rule), run first in `cbtDefend`.

## The guard kinds

| guard | what it does | the counters (the READ) |
|---|---|---|
| **shield** | every blow from the front arc (1.25 rad) lands ON THE SHIELD -- gold sparks, a clang, you are shoved back. Arrows too. | from **behind** (a dodge-roll round him; later TELEPORT) -- a **charged** blow, a slam, a kick or the overhead chop **knocks the shield aside**: he staggers, open **1.0 s** -- his own recovery after a swing |
| **sword** (swords and staffs) | every plain swing from the front is **PARRIED** -- your blade knocked aside (the recoil), his counter-cut a beat later. Arrows from the front: cut aside. | the **CHARGED release** (or the chop / a kick / a slam) **breaks the guard**: he stumbles **0.8 s**, open -- **parry HIS counter** (the timed parry) or perfect-dodge it -- his recovery, a monk's cast (interrupt it), behind |
| **none** | fodder: no guard at all -- the cut lands (volume: 3-4 hits) | -- |
| **own** | a kind with its own technique keeps it | the jackal: bait the pounce into a wall; the skullback / CEO beast: armour that wants the charge; the Saint / the Shadow: SWORD_SAINT.md |

**What breaks a guard is the MOVE, never the power** -- the combo's third link lands at power 1.0, and mashing must not break a guard.
**MASHING is punished**: 3 blocked / parried blows inside .65 s and his answer comes NOW (the shield bash-cut, the counter-cut).
No kind in this table rolls dice in its defence (the fodder rows' block / parry / dodge chances went to 0).

## Who is what (his list -- change a word in `GUARDS.kinds` to change a kind)

- **shield:** WARBOSS, BULWARK
- **sword / staff:** SAMURAI, HUSK_GUARD (the Husk Swordsman, tier 2), HOLLOW_MONK (the staff; his cast is the opening)
- **none (fodder):** HUSK_SOLDIER (the spear husk), HUSK_FLANKER, HUSK_ARCHER, ARCHER, OSARI_BOW
- **own technique:** JACKAL, SKULLBACK, CEOALIEN, SAINT, SHADOW
- (creatures -- the dog, the calf, the mammoth, the dragons -- have their own beast brains and are not in this table)

## TELEPORT -- a future EARNED ability

His idea: an enemy you can only beat from behind -- *"maybe that's what TELEPORT is for: you lose the power at the start and have to earn it
back."* The prologue's "you lose your power" beat (PROLOGUE.md) takes it from him; earning it back is a reward. The **behind** counter in this
table is position-based (`|dirH - his facing| > arc`), so it works TODAY with a dodge-roll round him, and teleport will use it with no change.

## DONE WHEN
- [x] (m2811, shipped unverified) The table: every arena enemy kind has a guard kind (above).
- [x] (m2811) Shield: front-arc block, charged / kick / chop knocks it aside 1.0 s, behind lands, arrows blocked. Sword: parry + recoil + counter,
      the charge breaks it .8 s, his recovery / a cast open. Mashing punished.
- [x] (m2811) `npm run guardprobe`: for every shield / sword kind, a MASH script (15 plain front blows) takes 0% of his life and is punished,
      and a SKILLED script (a break, then cuts in the opening) kills him. All five ok.
- [x] (m2811) Renders: images/renders/guards/shield_block.png, guard_break.png.
- [ ] A one-way "only from behind" enemy (the teleport tutor) -- waits on TELEPORT.
- [ ] **His sign-off on his phone.**
