# COMBAT -- the triangle, every enemy, every boss (his, Nov 4 2026)

*"We need a sandbox that is purely combat, to test every single enemy. I really need to develop a more fun combat -- I can destroy every boss in a
few seconds. It's so easy: they have no defence, they can't really block, and if I'm ever in parry/block they just never attack -- I want them to
attack so I can block. We need a much more sophisticated tic-tac-toe: they need ways to block my attacks, bigger enemies maybe better weapons,
differences between enemies, different ways to kill them. Every time we make a temple we need all its combat developed ahead of time so we just
drop them in and it works."*

The lab: **KORAJIN > The Combat Lab** (`?w=forge&zone=combatlab`). Under the WHOLE-PIECE RULE every enemy below is its own piece with its own
DONE WHEN; the last box is always **his sign-off on his phone**. DUEL.md (the shield/shot/melee triangle, m896-m1076) is the ancestor: everything
in it stays true, this file widens it to the katana game and the temple roster.

## 1. THE TRIANGLE (who beats what)

Six verbs, on both sides. Each one has an answer, and each answer loses to something else.

| verb | beats | loses to | the window |
|---|---|---|---|
| **ATTACK** (light: slash / stab / combo) | a body that is OPEN (recovering, winding up, circling) | a GUARD (clangs off), a PARRY (you are thrown back) | -- |
| **GUARD** (held: right stick DOWN, the katana's held charge, a shield) | light attacks (most damage and shove cut) | a GUARD-BREAK (heavy / charged / the chop), a GRAB / UNBLOCKABLE, being FLANKED | holding it costs nothing but tempo; the turtle is the weakness |
| **PARRY** (the guard raised just before contact) | any blockable attack: the attacker STAGGERS, a free punish | a FEINT (a wind-up he holds), a DELAYED swing, the unblockable | player: `BLOCK.perfect` arc + the m2414 timed up-release; enemy: a parry roll on a guard he raised `parryLead` s early |
| **GUARD-BREAK** (the chop, a charged release, a heavy brute's slam) | a GUARD (knocked wide, a long stagger, then everything lands) | being INTERRUPTED during its long wind-up (a quick hit or a shot staggers it), a DODGE | its wind-up is the longest of all: that is the price |
| **DODGE** (roll / flip / cartwheel, i-frames) | the GUARD-BREAK and the UNBLOCKABLE; anything with a long telegraph | a TRACKING follow-up, an area attack, a ranged volley timed to the landing | i-frames ~.3 s; recovery after it is the punish window |
| **UNBLOCKABLE / GRAB** (red glint; a grab, a stomp, a sweep, a pounce) | GUARD and PARRY (it goes through both) | DODGE (always), an INTERRUPT before it lands | the red telegraph is long (>= .6 s on MEDIUM): you must READ it and move |

Plus two modifiers that run on top of the triangle:
- **POISE** (a hidden meter per enemy): every landed hit chips it; at zero he STAGGERS (a punish window). Heavy and charged hits chip more.
  Super-armour moves (brutes) ignore flinch while the meter holds -- you take the hit or dodge. Big things have big poise.
- **ARMOUR / WEAK POINTS**: armour plates soak most damage until knocked off; bosses only take full damage on WEAK POINTS (PART AIM, m1738).

**Timing windows (MEDIUM; EASY x1.4, HARD x.65):** enemy wind-up (the parry/interrupt window) .55 s; the glint at wind-up start; parry window
.18 s before contact; recovery after a whiff .8 s (the punish); recovery after his combo-ender 1.1 s; stagger after a guard-break 1.5 s; after a
parry .9 s.

**Readability rule (show, don't label):** every enemy attack has (1) a wind-up pose, (2) a glint on the weapon -- WHITE = blockable/parryable,
RED = unblockable (dodge), (3) a sound -- a grunt or a ring. A blocked hit is sparks + a clang; a parried hit a white flash + a ring + a hitstop; a
guard-break a heavy clang + the guard flung wide + a camera kick.

## 2. THE GROUP RULE (no one stands idle, no one swarms)

- **Attack tokens:** at most N enemies may be in a wind-up/swing at him at once (EASY 1, MEDIUM 2, HARD 3); the rest CIRCLE at their spacing,
  feint, reposition to flank, or shoot. A token is handed back after the swing and the recovery.
- **A guarding player is a TARGET, not a wall.** A held guard is *read* (after `react`): the enemy steps in and attacks -- light strikes into it
  (so he gets to block and parry), and every few seconds of turtling, a GUARD-BREAK or an UNBLOCKABLE. Nobody waits for him to drop it.
- **Spacing:** melee hold at reach + a foot; ranged hold 8-14 m and kite back when he closes; casters stay behind the melee line.
- **Mix-ups:** strings of 1-3 swings with different timings; a held wind-up (feint) on MEDIUM/HARD; a delayed last hit.

## 3. THE ROSTER (WORLD_PLAN section 3 + what exists)

| slot | kind(s) in the game | attacks | defends | weakness / how to kill it |
|---|---|---|---|---|
| **MELEE SMALL** | SAMURAI (rival, mirror brain), the horde samurai | fast slashes, 2-3 strings, the chop vs a turtle | guards your slashes, PARRIES on a raised-early guard, rolls from a charge | guard-break (chop / charge) or a parry, then a string; low poise |
| **MELEE BIG** | WARBOSS (shield), SKULLBACK (maul), JACKAL GUARDIAN (2.6 m), CEO unleashed | slow heavy swings with SUPER-ARMOUR, the shield RUSH + bash, a red-glint slam (unblockable) | the shield blocks the front arc (shots too); big poise | FLANK the shield, or break it with a charged blow; dodge the slam and punish its long recovery; armour off first |
| **RANGED A** | ARCHER, OSARI BOWMAN (+ the ARCHERS volley) | arrows (block / parry / timed-up return, m2414), keeps distance | KITES back when you close; weak in melee | close the gap behind cover, return an arrow, one or two hits kill |
| **RANGED B** | *not built* -- the caster / thrower | arcing / area shots (a ring on the ground = the telegraph) | stays behind the melee line, blinks away | interrupt the cast; reflect the bolt |
| **CREATURE A** | DOG (three heads), SPIDER-BOT, MAMMOTH calf | lunges, POUNCES (red), bites, stampede | none (dodges instead of blocks) | dodge the pounce, punish the landing; legs are parts (PART AIM) |
| **CREATURE B** | MECH dragon (flies, lightning), BLUE DRAGON (fireballs) | from the air: a dive, a breath, a lightning ring | out of reach in the air | the bow / a returned shot downs it, then melee while it is grounded |
| **BOSS** | STONE GUARDIAN (four arms), THE DWELLER (olmec), WARBOSS as a boss, MAMMOTH | see section 4 | ARMOUR everywhere but the weak point | phases; weak points only in vulnerability windows |

Every enemy also has its STONE TWIN (STATUES.md) and a night glow pattern (pieces, never a full wash).

## 4. THE BOSS PATTERN

Every boss is built from the same four parts, so a temple can drop one in:
1. **PHASES by health** (100-66 / 66-33 / 33-0): each phase adds a move and shortens the wind-ups; a phase change is a roar + a stagger-proof
   beat + an arena change (something falls, a ring of fire) -- never a free hit.
2. **ARMOUR**: outside a vulnerability window his body takes x.15 (a clang and sparks: *a weapon that does nothing must LOOK like it does
   nothing*); the WEAK POINT (PART AIM picks it: the hand, the head, the core) takes x1 -- x2 during a window.
3. **VULNERABILITY WINDOWS** after his big moves: the slam sticks (the colossus idea: the hand stays down, attack the hand until it pulls back,
   then he is open -- run up the arm, hit the head), a whiffed charge leaves him stuck, a parried combo staggers him.
4. **ESCALATION**: patterns repeat with a twist each cycle; no boss dies in seconds -- target 60-120 s on MEDIUM for a good player.

## 5. DIFFICULTY KNOBS (DUEL.md's rule: difficulty is TIMING, not abilities)

| knob | EASY | MEDIUM | HARD |
|---|---|---|---|
| react (how late he sees you) | .45-.6 s | .25-.35 s | .12-.15 s |
| wind-up (the parry/interrupt window) | .85 s | .6 s | .38 s |
| recovery (the punish window) | 1.3 s | .9 s | .55 s |
| attack tokens | 1 | 2 | 3 |
| enemy block chance (x the archetype's) | x.5 | x1 | x1.4 |
| feints | none | some | often |
| damage | x1 (same) | x1 | x1 |

## 6. TEMPLE-READY (how a temple worker drops an enemy set in)

Each enemy is one data row (`SC_COMBAT` table in index.html, next to `ARENA.kinds`): `{ kind, slot, block, parry, dodge, poise, armour,
superArmour, unblockable, tokens, ranged, weak }`. A temple lists the kinds it uses and their counts; the lab spawns the same rows. An enemy row
is temple-ready when all of its boxes below are ticked.

## DONE WHEN (per enemy; the last box his)

For EACH of: SAMURAI, JACKAL, WARBOSS, SKULLBACK, ARCHER / OSARI BOWMAN, DOG, SPIDER, MECH, DRAGON, STONE GUARDIAN, DWELLER (and the caster
when built):
- [ ] It ATTACKS a guarding player (no idle stand-off) and its telegraphs read (white / red glint + a sound) on the phone.
- [ ] It DEFENDS in its archetype's way (block / parry / dodge / kite / fly) and that defence has a counter he can find.
- [ ] Its weakness works and is the fastest way to kill it.
- [ ] It works in a group (tokens: never a swarm, never a statue).
- [ ] Its row is in `SC_COMBAT` and the lab spawns it with counts and difficulty.
- [ ] Bosses: phases, armour + weak point, vulnerability windows; a good player needs 60 s+ on MEDIUM.
- [ ] **He fought it in the lab on his phone and signed it off.**

## THE PASSES (each check-gated, one build each)
1. **THE LAB** -- the arena, the spawn panel (every type, counts, difficulty), AI on/off, slow-mo, reset, the readout.
2. **AI THAT FIGHTS** -- attacks into a guard, glints, strings and mix-ups, spacing, tokens.
3. **ENEMY DEFENCE** -- block / parry / dodge per archetype, block FX + sound, poise + guard-break, punish windows.
4. **ARCHETYPES** -- shields to flank, brutes' super-armour + unblockables, archers that kite, creatures that pounce.
5. **BOSSES** -- phases, armour vs weak points, windows, escalation.
6. **TUNING** -- presets and the `SC_COMBAT` rows a temple drops in.
