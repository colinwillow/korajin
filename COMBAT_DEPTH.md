# COMBAT DEPTH -- past "swipe swipe swipe"

His words (Nov 6 2026): *"Combat is just swiping."* COMBAT.md built the triangle (block / parry / dodge, guard points, poise, red
unblockables, tokens) and VOL made most bodies die in 3-4 hits. What is still missing is a reason to do anything BUT mash: a mashed
combo still lands, nothing rewards timing, and every kill is the same kill. This doc is the next sandbox, built and proved in the
**Combat Lab** (`?w=forge&zone=combatlab`) and only then rolled into the temple squads (whole-piece rule).

## The design, short

1. **THEY DEFEND A MASH (the combo guard).** A body with a `cg` in its `CBT.def` row lets `cg` blows in a row land, and the next
   one meets a raised guard (gold sparks, clang, your blade bounced). He HOLDS that guard (`CBT.cgT`) and comes out of it with a
   riposte. Three ways through: **break it** (the katana CHARGE, a slam, a KICK, the WHIP yank -- a big white burst and a long
   stagger you earned), **go round it** (a blow from behind always lands), or **wait for his attack** (his recovery is open).
   Rank-and-file (the husk soldier) have no `cg` -- they are the volume you carve; mid and elite bodies turtle.
2. **TIMING IS REWARDED.** A dodge (side flip / backflip) that starts inside `perfect` s of a blow arriving is a PERFECT DODGE:
   slow motion, a ring, and the dodger is wide open. A guard raised inside `win` s of impact is a TIMED PARRY: he staggers and the
   next blow is a FINISHER (double damage, a camera punch). Late guards still block, but only that.
3. **THE ROOM IS A WEAPON (pass 2).** Knockback carries bodies INTO bodies (bowling chains), off ledges and into walls, hazards
   and explosive barrels / bomb spiders. The arrow deflect AIMS (the left stick picks the target). Chain kills get slow motion and
   a camera punch.
4. **ROLES MIXED (pass 3).** Shields (flank / whip), archers (deflect back), armoured brutes (charge), fast flankers (dodge-counter
   them), casters (interrupt). One 15-body arena wave that asks for all of it.

## THE JACKAL IS AN ELITE (his: "too easy -- harder than the rank-and-file")

12 combo hits of life (`VOL.hits.JACKAL`), a guarded approach (frontal blows are blocked while he walks in), every swing of his
under SUPER-ARMOUR (you cannot trade with him), a combo guard after 2 hits, the **POUNCE** (`katana_jump_attack`) that closes a
4.5-11 m gap -- a red glint, unblockable, dodge it -- and a long recovery after it (the window you earn). Under half life he guards
more.

## DONE WHEN

- [ ] Pass 1a: the combo guard -- a mid / elite body blocks the `cg`+1th blow of a mash; charge / slam / kick / whip break it with
      a long stagger; behind always lands; he ripostes out of it. Lab readout counts cg blocks and breaks.
- [ ] The jackal is an elite: 12 hits, guarded approach, super-armoured swings, pounce + recovery window, more guard under half life.
- [ ] Pass 1b: PERFECT DODGE (slow motion) and TIMED PARRY (stagger + finisher) against arena bodies.
- [ ] Pass 2: knockback chains (bodies into bodies), ledge / wall kills, explosive barrels, the aimed deflect, chain-kill slow-mo +
      camera punch.
- [ ] Pass 3: roles -- a 15-body mixed arena wave in the lab (TEMPLE SET button), each role answered by a different tool.
- [ ] Rolled into the forest temple squads (COMBATSET rows), nothing temple-only.
- [ ] **His sign-off, on his phone, in the Combat Lab.**
