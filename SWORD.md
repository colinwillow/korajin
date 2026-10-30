# The sword — a melee sandbox

**Status: builds a-d in (m978-m984), the mirror AI (m985), e1 (m986); m990 his first-play corrections (charge on UP, guard on DOWN, katana strafes, in-place swings).** Earlier: build a in (m978): the katana + four directional swings, on the SAMURAI (`?hero=samurai`).** He owns this file. It is a sandbox under the WHOLE-PIECE RULE (`CLAUDE.md`): it
lives in the arena (`?w=arena`) against the things the arena already spawns (Warboss, Skullback, the dog, the dragons), and it is
not done until every DONE WHEN box is ticked with evidence and he has signed it off on his phone.

## Why this exists

*"I feel like I've gotten the shooting dynamic down a bit. One thing that I haven't got down as much is the melee -- like a sword
style attack, almost like Zelda... a more complex melee system... shooting on one axis is a little dumbed down, but a sword game
is still really fair for this, because you're still operating on just two axes. It's just distance."*

Shooting with one stick is aiming on one axis, which is easy. A sword is about DISTANCE and TIMING (when to step in, when to
guard, when to commit), and that is a skill a thumb on glass can have. So the sword is not "the hammer with a new mesh": it is a
second way to fight, built round reading the enemy at close range.

## Who holds it

**Zap**, with a sword and shield (Link). Every system in the game is wired to him already (the pads, the lock-on, the guard,
the strike sweep, the hitstop, the arena), and the Forge bakes clips onto him the way it did his pick-up and run
(`retarget-anims` profile `zap`). The library has a full one-hand **Sword and Shield** set: idle, walk/run/strafe, block,
crouch-block idle, slashes x5, attacks x4, kick, power-up, impact, jump, death; plus `One_Hand_Sword_Combo`,
`Stable_Sword_Inward_Slash` / `Outward_Slash`, `Thrust_Slash`, `Slash_Advance`. Colin, Zoar or the CEO can wear the same bake
later (it is one profile per body).
**The sword and shield models:** a stand-in blade and buckler built in code until he has art (the weapon-bone convention, so his
GLBs drop onto `weapon_root_right` / `weapon_root_left` with no code change).

## The controls (a proposal -- his call, change anything)

LEFT PAD is the BODY, RIGHT PAD is the VERB, as everywhere else in the game.

| right pad | does |
|---|---|
| **flick** left / right | a horizontal slash that way (inward / outward) -- chains into a 3-hit combo if flicked again in its window |
| **flick down** | an overhead chop (slow, heavy, breaks a guard) |
| **flick up** | a thrust (fast, long reach, low damage) |
| **pull down + HOLD** | **GUARD + LOCK-ON** (what is there now, kept): Link's crouched shield-forward guard, orbiting the target; the shield blocks from the front; a guard timed into a hit is a PARRY (`BLOCK.perfect`) and staggers him |
| **keep holding** | the blade CHARGES (a glow that builds, a hum that rises) |
| **release** (charged) | the **lunge**: a dash-thrust through him; full charge = a spin attack |
| **tap** | jump (unchanged) |

| left pad | does |
|---|---|
| flick | the roll (unchanged) -- i-frames, the answer to a swing you cannot guard |
| hold | move; while guarding, strafe round the lock |

**Later (named, not built):** a hold-up SUBMENU -- press and hold, two or three small options pop up above the thumb, swipe to one
(a special technique, an item). His idea; it is a slot, and the sword does not need it to be fun.

## The fight it makes (the rock-paper-scissors)

The DUEL triangle (`DUEL.md`) from the sword's side:

| | beats | loses to |
|---|---|---|
| **SLASH / combo** | a foe in his wind-up (a hit during a wind-up interrupts it) | a raised guard (it clangs off) |
| **CHOP** (down flick) | a raised guard (guard break: he staggers open) | anything fast: it is slow, he hits first |
| **GUARD / PARRY** | his swing (a parry staggers him, a block soaks it) | his guard break / a grab / a chop |
| **LUNGE** (charge + release) | distance (closes a gap, punishes a whiff) | a parry (overcommitted: you are open) |

And the creatures read differently: the dog lunges (guard it, then punish), the dragon breathes fire from range (close the gap
with the lunge), the mech swoops (roll the swoop, chop it when it lands).

## What it needs that is not here yet

- The Forge bake of the sword set onto Zap (one profile edit + a bake).
- A SWORD weapon slot: the stand-in blade + buckler, the swing table (which flick -> which clip, contact window, damage,
  knockback), combo windows, the charge, the lunge.
- Readability: a blade trail on every swing (one ribbon, one draw), a spark + clang on a block, a white flash on a parry, the
  charge glow.

## Later: SMEAR FRAMES (his idea, Oct 24 2026 -- not built)

*"Older arcade games... just have your rest pose, and when you push a button one frame that shows a smear of the guy as if he was
in motion, and then a rest pose like he just did the lunge. It creates a super cool stylized effect... why not do that in 3D...
the attacks are so fast."*
- **Pose to pose**: hold the anticipation pose, one or two SMEAR frames, then SNAP to the follow-through pose and hold it. The
  katana clips already contain both key poses; the swing samples them as held keys instead of playing smoothly.
- **The smear**: a vertex-shader stretch of the body and blade along the motion for 1-2 frames, plus a ghost / arc of the blade.
- **The hit lands on the smear frame** (hitstop on the follow-through pose sells it).
- After builds b-d (guard, charge, combos) so it can be applied to all of them; a switch (smooth vs smear) so he can compare.

## Later: AERIAL ATTACKS (his idea, Oct 25 2026 -- not built)
*"Like in the Rollergirl game, when you jump and flick the left stick she does flips... there's a whole opportunity for aerial
acrobatics or attacks. Right now we just have the one flying kick on the right stick."*
- In the air: **right flick = an aerial attack** per direction (the acrobatic melee sets -- big, spinning, cinematic); **left flick =
  flips** (Rollergirl's, for now).
- Wants the directional ground swings sorted first (two of them read anticlimactic -- "a weird sword heel-butt thing" -- and get
  swapped for bigger, broader, faster ones once he names which).

## Feel: what the research says to do next (Oct 25 2026, m993) -- starting values, all to tune on the phone
Done in m993: magnetism (+-60 deg / 3.5 m, the travel spent in the first 30% of the swing), his parry punishing you (shove, .6 s
stun, instant riposte). Next, in order:
1. **Hitstop on BOTH bodies**: 70 ms per chain hit, 110 ms on a finisher, 150 ms on a charged release; the victim jitters +-3 cm and
   flashes white 60 ms. Inputs buffer through it. (Capcom: 8/12/16 frames light/medium/heavy; a 3D-action study: 0.1-0.2 s best.)
2. **Knockback along the swing**: light .4 m, finisher 1.5 m, charged 3 m; the attacker keeps ~30% of his lunge through contact.
3. **Your parry**: a guard pulled within ~250 ms before contact (mobile: wider than Sekiro's ~200) is a perfect parry: 800 ms
   stun on him, .6 m shove, your first cut inside it does 2x with extra hitstop; mashing the guard shrinks the window.
4. **Chains**: a 180 ms buffer, newest flick wins (now: up to 2 queued); cancel into the next swing from the end of the active
   frames (~45-55% of the clip); a 4th hit; play anticipation 1.2-1.4x faster so the hit comes sooner.
5. **Camera**: a 5-10 cm push along the hit, trauma shake decaying over ~150 ms, a 1-2 deg FOV punch on finishers.
6. **Smears (later)**: the blade-arc ribbon held 2-3 frames; then the lag-transform vertex stretch on blade and arm during the active
   frames only; optionally the mixer stepped at 12 fps during attacks ("on twos"), smears held at most 2 frames.

## HIS NOTES, Oct 28 2026 (playing the dojo) -- the open gesture slots and the reticle
> *"If you press and hold up on the right stick and then move it down to the bottom before releasing, he does the up-air attack where he goes up
> in the air. I don't like the reticle, how it shows the arc -- maybe he just bends his body like he's about to launch upward. In the reverse:
> press DOWN on the right stick and he goes into parry -- maybe you move it up and let go and he does a special move. The charge (hold up on the
> right): holding UP on the left and releasing does the launch-forward down slice; releasing at neutral does the spin; there's an opportunity to
> hold DOWN on the left while you charge and do a whole different attack."*
- [ ] **The up-air launcher's tell is his BODY, not a reticle arc:** a crouch-coil anticipation (knees bent, blade drawn low behind) while held
  up-then-down; drop the arc reticle (keep it on a TOOLS switch for comparison).
- [ ] **PARRY -> UP + release = a SPECIAL** (open: his pick). Proposals: a RISING COUNTER (the parry's stored force thrown back as an upward cut
  that launches the attacker); a RIPOSTE DASH (a lunge through the attacker, behind him); a GUARD BREAK (the hilt into his guard, it shatters
  shields -- ties to the boss armour below).
- [ ] **CHARGE + LEFT-STICK DOWN = a third release** (open: his pick). Proposals: a GROUND SLAM / shockwave (the blade driven into the floor, a
  ring that knocks everyone down); a BACKSTEP IAI (a retreating quick-draw that cuts the space he just left); a SWEEP (a low spinning cut that trips).

## DONE WHEN (the whole-piece gate -- every box needs evidence in the NOTES entry that ticks it)

- [ ] Four directional attacks that look and feel different (slash L, slash R, chop, thrust), and the slash chains a 3-hit combo.
- [ ] Guard + lock-on blocks from the front; a timed guard parries and opens the enemy.
- [ ] The charge reads (glow, sound) and the release lunge closes distance; full charge spins.
- [ ] The chop breaks a raised guard; a slash into a raised guard clangs off and does nothing.
- [ ] Every swing has hitstop, a blade trail and size-scaled knockback; a whiff is punishable.
- [ ] It works against every arena enemy (Warboss, Skullback, dog, blue dragon, mech) and each needs a different answer.
- [ ] Shooting and the sword are both worth using against the same enemy (neither is strictly better).
- [ ] No words on screen explain any of it.
- [ ] **He played it on his phone and signed it off as fun.**

## Builds, in order (each one build; split if too big)

a. The bake (sword set onto Zap) + the SWORD slot with the stand-in blade + buckler + the four directional attacks.
b. Guard / parry / lock-on with the shield and the crouched guard clip.
c. Charge + lunge + spin.
d. Combos and the chop's guard break; blade trail, sparks, flashes.
e. Tuning against each enemy; then his sign-off.
