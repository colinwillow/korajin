# The duel — hand-to-hand, one on one

**Status: BUILT, being tuned (m896-m898).** Every mechanic below is in; none of the DONE WHEN boxes is ticked until he plays it. He owns this file. It is the spec for the first sandbox, and the sandbox is not done until
every box in **DONE WHEN** is ticked with evidence and he has signed it off on his phone (see the WHOLE-PIECE RULE in
`CLAUDE.md`).

## Why this exists

*"Right now I never really built out the man-to-man battle. It's just really slow-moving ogre guys and I just shoot them and
they barely get a chance to attack me. I skipped over this step, which is such a crucial step... A hand-to-hand duel needs to
be interesting. It needs to exist on its own in a white sandbox and be fun in its own right."*

What is wrong today (m893), measured off the code rather than felt:
- `foeAI` was written for a street brawl with a crowd: he walks at 1.0-2.6 m/s against a player who sprints at 7.2, so he
  cannot reach you, and the blaster kills him from range with no answer.
- He has **no defence against the blaster at all** (his block only answers melee arcs), so shooting is strictly best.
- His swing has **no readable wind-up**: the contact is at 37% of a 1.35 s clip, and nothing on screen says "now".
- There is no reason to ever get close, no reason to ever stop shooting, and nothing to read. That is not a fight.

## The triangle

Three verbs, each beats one and loses to one. Rock-paper-scissors ("tic-tac-toe", his word): you win by **reading him and
answering**, not by having the bigger number.

| | beats | because | loses to |
|---|---|---|---|
| **SHIELD** (block) | the SHOT | bolts spark off it; he walks through your fire behind it | MELEE |
| **MELEE** (strongest, close, slow) | the SHIELD | a heavy hit knocks the shield aside: a **guard break**, he staggers open | the SHOT |
| **SHOT** (medium, ranged) | MELEE | a shot that lands **during a wind-up** interrupts it: he staggers, the swing never lands | the SHIELD |

It works both ways round. Zap starts with SHOT + MELEE + the roll + his existing guard/parry (`BLOCK`); a real Zap shield
comes later (*"not initially, but later"*), and when it does it is the same table from his side.

## The loop, one exchange

1. **He advances behind his shield.** Your bolts plink off it (spark, clang, no damage, no armour). Shooting at a raised
   shield is the *wrong answer* and it has to look and sound wrong.
2. **You close in, or he does.** In reach he picks: **swing**, **shield bash** (short, fast, knocks you back -- punishes
   standing in front of the shield with a slow hammer), or **hold** (turtle).
3. **His swing has a WIND-UP** -- weapon raised, a glow on it, a grunt. That is the window: **shoot him now** and the swing
   is cancelled, he staggers, and his shield is DOWN, so the bolt hits the body and **an armour piece comes off**.
   Miss the window and you roll (i-frames) or guard/parry (`BLOCK.perfect` = he staggers).
4. **He holds the shield and turtles**: wind up the hammer (`padUp`) and **break the guard**. The shield flies wide, he
   staggers, and for a beat everything lands.
5. **Armour.** Pieces only come off from hits that LAND: interrupt shots, hits during a stagger, shots in the back or flank
   (the shield covers his front arc only). While he is armoured, about a third of the damage gets through.
6. **Exposed.** When enough armour is gone (or his health is low), he gets **desperate**: faster, combos, more bashes, but
   hits now go straight through. **Knock him down and finish him**: a charged hammer on a downed boss launches him, the
   slow-motion KO, the beam out (built at m893).

## Weapons as keys (his, m905)

*"Somebody will try to fight the boss with only the blaster. The blaster doesn't actually hurt the boss -- they try over and over
and never beat him, and it turns out they have to go on a mission to get the weapon that beats the boss. Maybe that's the
rocket launcher. A ton of this kind of tic-tac-toe, capability unlocked."*
- Every blow carries its SOURCE (`BLOW_SRC`: `shot`, `rocket`, melee when empty), and a kind's `resist` table scales the
  damage per source: `resist: { shot: 0 }` is a boss the blaster cannot hurt; `{ rocket: 2 }` one a rocket wrecks.
  Hooked in at m905, every boss at 1 for now -- which boss needs which weapon is a design call.
- The rule this needs: **a weapon that does nothing must LOOK like it does nothing** (sparks off, a clang, no flinch), so the
  player learns "not this" from the screen, never from a health bar that will not move.
- Already true: a raised shield stops the blaster and a ROCKET knocks it wide (m905).

## Size and weight

**m906: weight = (1.8 / height)^3.** People fly easily and wear no armour; a medium (~2 m) body flies when the blow is big;
the biggest (2.4 m+) are never thrown -- a launch is a big stagger, a KO drops him in place. Explosions blow armour off.


Lifted from the culture_war arena (`sizeK`, B227), and true in both directions:
- **Damage and knockback scale with the mass ratio.** A 2.4 m boss sends a 1.25 m Zap flying; Zap's swing barely rocks him
  unless it is a guard break or a full charge.
- **Small is fast.** Zap's recovery and roll beat the boss's; a grunt (later) swings quicker, hits softer, has no shield.
- Every blow has **hitstop** (a few frames' freeze, longer for bigger blows) and **kickback** on the attacker.

## Readability (*show, don't label*)

Every state reads from the animation and effects alone, no words: shield up (the shield mesh is raised and the bolts
spark), wind-up (weapon glow + grunt + slow raise), stagger (a big reaction clip + sparks + a ring), guard break (the shield
flung wide + a heavy clang + a camera kick), exposed (armour gone, he breathes hard, red flashes).

## Difficulty

One switch on the arena menu: **EASY / MEDIUM / HARD.** It changes how readable and how punishing he is, never what the
triangle is:

| | easy | medium | hard |
|---|---|---|---|
| wind-up (the shoot-now window) | 0.8 s | 0.55 s | 0.35 s |
| how fast his shield comes up at a shot | 0.6 s | 0.35 s | 0.15 s |
| recovery after a whiff | 1.2 s | 0.8 s | 0.5 s |
| combos / feints | none | some | feints (a wind-up he holds) |
| his damage | x0.6 | x1 | x1.4 |

## What he needs to supply (assets)

- **A shield** for the Warboss (and Skullback): a GLB built on his `weapon_root_left` -> `weapon_tip` pair, the same
  convention as the weapon bones, so it parents with identity on the left hand.
- **Clips** (the warrior's set already has most): shield-up idle / walk, shield-hit react, guard-break stagger, a shield
  bash, a big stagger, a wind-up that can be held. Until a clip exists the state still runs on the nearest clip, and the
  chip says `NO CLIP`.


## THE PILOT -- the rival as a full player (planned Oct 26 2026)

*"I want the AI system to be complex. EASY / MEDIUM / HARD should be about TIMING -- did he swing, did he block, delayed or sped up -- not his
abilities. He should be a fully functioning player: everything I can do. All my covers, flips, picking things up, wall runs, bars. I want it
fun and moderately challenging -- not something people whiz through."*

Today's rival (`K.mirror`, m985) is an NPC with its own state machine: it only REACTS to your moves by dice (guard / parry / roll), circles when
idle, and difficulty scales its chances. It has none of the player's body: no cover, flips, cartwheels, guard sides, the charge's aim, bars,
wall runs. Patching it can make it less stupid; it can never make it a player.

**The pilot:** the rival is a second PLAYER BODY, stepped by the same code as yours (`stepPlayer`, the anim chooser, every pose pass), driven by
a brain that only ever moves VIRTUAL THUMBS (the same `stick.L` / `stick.R` gestures you use: flicks, holds, taps). So anything you can do he
can do, now and with every move added later, and the difficulty is ONLY his perception and his hands: reaction time, read accuracy, thumb
error, patience. The stages, one or more builds each:
1. **Two bodies.** `player` / `rig` / `stick` / `RIG` become swappable (module `let`s swapped around a second step), the per-body systems keyed
   on them (weapon mounts, springs, the guard side, the duck, the knock) made per body; a second rig built from the hero file; he stands and
   walks on scripted thumbs. Proof: both bodies independent in the real loop, nothing of his leaks into yours (camera, HUD, sounds).
2. **Two-way combat.** Your strikes, charges, slams and shots reach him through the same sweep they reach a dummy by; his reach you through
   `playerHurt` -- with your guard, your parry, your knock-down. The rocket turret and the walls treat him as a player.
3. **The brain.** Perception (what you are doing, with a reaction delay and a misread chance by difficulty), a utility choice each beat
   (pressure, bait, punish your recovery, break a turtle, guard and counter, cover against a gun, dodge a charge, use the arena), and hands
   (the gestures, with timing error by difficulty).
4. **The arena.** Cover, the high bar, wall runs, vaults, pick-ups -- he uses what is spawned, because his body already can.
Difficulty: EASY .45 s reaction, 30% misread; MEDIUM .25 s, 15%; HARD .12 s, 5% -- tuned on the phone. The DONE WHEN box *"He can beat you"*
is the bar.

## DONE WHEN (the whole-piece gate -- every box needs evidence in the NOTES entry that ticks it)

- [ ] Every verb has a counter and is countered, both ways (the table above holds on the phone, not just in code).
- [ ] Shooting a raised shield does nothing and reads as wrong; shooting a wind-up always interrupts it.
- [ ] A guard break exists and is the only melee answer to a turtle.
- [ ] Armour only comes off from hits that land; exposed is visibly different and dangerous.
- [ ] He can beat you: on MEDIUM, standing still and holding fire loses.
- [ ] You can beat him without taking a hit, by reading him (a perfect run is possible on every difficulty).
- [ ] EASY / MEDIUM / HARD on the arena menu, and the difference is felt.
- [ ] Hitstop, kickback, size-scaled knockback on every blow.
- [ ] Every state readable with no words on screen.
- [ ] **He played it on his phone and signed it off as fun.** (The only box nobody else can tick.)
