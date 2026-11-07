# THE SWORD SAINT -- a showcase of the combat system's reactions

His words (Nov 6 2026): *"A samurai-style enemy that we make initially almost impossible to beat, just for fun. If you shoot an arrow
at him, he's so quick he deflects it with his sword. If you swing at him, he dodges out of the way and then hits you, or he blocks every
single attack... making the combat system look really, really cool, dynamic, reactive, perfect blocks, cinematic -- and it proves we can
make something that's hard. If you make something impossible by having swings just not hurt him, that's stupid; but a guy who VISIBLY
blocks everything you give him is cool. Then we take that principle and tone it down: he's not impossible, just harder."*

This is the template for "every enemy has its own tactic": one body, one readable personality, built and proved in a white sandbox first.

## Where

**The Sword Saint's dojo** -- DEV PLACES > SANDBOXES > The Sword Saint (`?w=forge&zone=saintdojo`). The Combat Lab's floor in white (a
white dojo), the same panel, and the Saint beams in once you land. SPAWN > MELEE SMALL > Sword Saint brings another. Body: the samurai rig
(`samurai_game.glb`) -- a model of his own replaces it later with no code change (`ARENA.kinds.SAINT.file`).

## The two stages (TOOLS > SAINT, or the SAINT button in the dojo's bar; remembered as `mel.saint`)

**IMPOSSIBLE.** Nothing passes through, and nothing is "absorbed" either -- every action of yours gets a distinct, visible answer:
- **an arrow** is cut out of the air (a fast slash, a spark and a ring, a camera punch-in) and sent straight BACK at you. Parry it back
  and he cuts it again.
- **a swing** is met, picked from a mix that never repeats twice running: a BLOCK (blade contact: a gold spark, the clang, hitstop, a swept
  trail), a PARRY (your blade knocked aside -- your recoil -- and his counter), a SIDESTEP (a strafe out of the way, a swoosh and an after-
  image), or a SLIP-AND-COUNTER (the sidestep, then the cut). He snaps round to meet a blow from behind.
- **a heavy** (the charge release, a slam) is a CLASH: both thrown apart, a big white burst, slow motion, the camera in close.
- **shots and blasts** he simply is not standing in (the sidestep).
- **he reads you:** a charge being held or the bow being drawn puts him in his guard stance, facing you (up to 1.5 s, then he comes).
- now and then, at a distance, he TAUNTS (resets his stance with the draw).

**DUEL.** The same look and the same answers -- but real windows, and every one is a READ:
- **parry HIS strike** (your timed parry): he staggers .5 s and the next blow is the finisher -- a slice, or a quick arrow;
- **perfect-dodge HIS strike**: he is open 1.6 s;
- **after his own swing** (his recovery) a blow lands;
- **his guard tires**: every 6 blocks / parries / clashes he is winded 2.2 s -- breath puffs, a slow guard -- and everything lands;
- **from behind** a blow lands;
- **mashing is punished**: 3 blows inside .6 s of each other and the third is PARRIED (your recoil, his counter).
- arrows are deflected aside (not back at you) unless he is open; an open Saint takes the arrow.

Life in DUEL: 10 katana-combo hits (`VOL.hits.SAINT`). Numbers live in `SAINT` (SC_SAINT) and are live on `mel.SAINT`.

## DONE WHEN
- [x] (m2797) The dojo: a DEV PLACES row, an ENTRY landing, the Saint beams in. `npm run places saintdojo`: `ok  The Sword Saint (dojo)  at 0.0,0.0,9.0  standing`.
- [ ] IMPOSSIBLE: every arrow deflected back with a slash; every swing a visible block / parry / sidestep / slip-counter from a mix; a
      heavy is a clash with slow-mo + punch-in; he reads a charge / a drawn bow; an occasional taunt. No blow ever just disappears.
- [ ] DUEL: the timed parry opens .5 s (finisher), the perfect dodge opens him, his recovery is open, his guard tires after 6, behind lands,
      mashing is parried.
- [~] (m2797) Renders (`node tools/saintshots.mjs`, images/renders/saint/): the CLASH strip reads (burst on his blade, your recoil); the arrow strip is too far to read the slash; the dodge-counter and DUEL strips lose him off-frame (the camera follows Grumbo). Wanted: a frame strip of the arrow deflect, the parry clash, the dodge-counter and the stage-2 opening, committed.
- [ ] **His sign-off on his phone: IMPOSSIBLE looks cool; DUEL is hard and fair.**
