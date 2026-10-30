# PARKOUR -- the momentum sandbox (piece 1 built m1085; the ramps, loops and grind poles next)

*"Hard-core parkour!"* -- Colin, Oct 26 2026. One sandbox: momentum you BUILD, then SPEND on walls that curve up out of the floor.
It sits on the wall run (m1064, `WRUN`) and the white-box arena. Nothing here is built yet.

## The pieces, in the order they get built

1. **The spin-up (Sonic's charge).** *"If you're completely still and you hold forward, he runs in place and speeds up and speeds up until
   he's at his max -- like the katana's charge: two circles, one grows to meet the other, a spark under him -- and you let go and he's
   running forward with momentum."*
   - Trigger to settle with him: standing still + the right pad held UP is taken by the katana charge and the blaster trigger, so the first
     try is **UNARMED, right pad held up while still** (the same gesture as the charge, so it reads the same), or the left stick held forward
     while still for a beat. His pick.
   - He runs in place (the run clip, sped up with the charge), feet scuffing; a ring under him grows to meet a fixed outer ring; at full,
     the spark and the clang the hammer uses (`HCHG`). Letting go = launched at `top` speed, which bleeds back to the ordinary sprint over a
     few seconds unless something spends it.
2. **Momentum as a number he carries.** `p.mom` (m/s over the sprint) -- a ramp DOWN adds to it, a ramp UP spends it, the floor bleeds it.
   It is what a curved wall asks for.
3. **The curved wall (the quarter-pipe).** Flat floor that curves up into a vertical wall. With enough `p.mom` he runs on up it (body
   following the surface normal -- the wall run's roll, but pitched), and either reaches a lip (the ledge takes him) or runs out and slides
   back down. Not enough = he falls back. SPAWN > QUARTER PIPE.
4. **The loop.** A full loop (skate-park). Enough momentum and he goes round; too little and he drops off the top into the pit under it.
   SPAWN > LOOP.
5. **The course.** A few of them in a row with pits between, downhill sections that GIVE momentum, so the line through it is the skill.

## DONE WHEN (each ticked with evidence in a NOTES entry; the last box is his, on his phone)
- [ ] Spin-up: still + the gesture runs him in place, the rings meet at full, the release launches him; measured: launch speed, bleed time.
      (m1085: UNARMED, right pad held UP from standing -- his pick of gesture, Oct 27. Full in 1.1 s, 17 m/s, .7 s held, back to a run
      ~3 s later, 27 m covered. Unsigned.)
- [ ] `p.mom`: measured gain down a ramp, loss up one, bleed on the flat.
- [ ] Quarter-pipe: with the full spin-up he reaches its lip; from a walk he does not (measured heights).
- [ ] Loop: full spin-up goes round; a walk-in falls off the top (measured).
- [ ] A short course of three, completed in the real loop by the harness with the inputs a thumb would give.
- [ ] **His sign-off on the phone.**

## Next (his, Oct 27): really tall, long half-pipe ramps you can only run up with the zoom (a ledge at the top to grab, or launch off
## them); grind poles on foot; loops; running on walls and buildings at speed -- all spending `p.zoomV`.

## Open questions for him
- The spin-up's gesture (see 1).
- Does the spin-up work armed (katana out) -- a different gesture, or only unarmed? (m1085: unarmed only, as he said.)
- Pits: a fall = respawn at the start of the piece, or just a long climb back?
