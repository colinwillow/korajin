# HORDE -- the hundred-man battle (sandbox, his idea Oct 27 2026)

*"Really push the limits... many many characters in one battle... can the phone handle 100 fully rigged, skinned enemies that are all acting
on their own to try to fight me... a battlefield where there are two sides, red versus blue, you choose a side or you're neutral... I like
the idea of hitting guys and they fly up in the air -- the old Chinese / Japanese battlefield games."* (Dynasty Warriors, LotR: Return of the
King, Ninja Gaiden's crowds.) Under the WHOLE-PIECE RULE: its own DONE WHEN, his sign-off last.

## The problem, honestly
Today every body is a full skinned clone (`bodySpawn`: its own skeleton, its own mixer, its own material uniforms): about one draw call
and one mixer update per body, ~11k skinned triangles each. A hundred of those is 100+ draws and 100 mixers on the CPU every frame. Nobody
knows yet what his phone does with that -- so the first build MEASURES, and every build after is judged against that number.

## The plan (one stage per build, his look between)
1. **PROBE** (m1084): SPAWN > HORDE adds 25 samurai per tap (to 150) on the existing fighter brain (`foeAI`: chase, swing, get knocked
   flying). He reads the chip (FPS, DC draw calls, kT triangles, B bodies) at 25 / 50 / 100 on his phone. That is the baseline.
2. **CHEAP CROWD, SAME LOOK** (in order of payoff, each measured on the chip):
   - animate by distance: near bodies every frame, mid every 2nd, far every 4th (`mixer.update` with the summed dt); off-screen ones
     not at all (the frustum);
   - one material per kind (the hit flash moves to a per-instance tint), so bodies batch;
   - a decimated LOD mesh past ~15 m.
3. **THE BIG ONE: VERTEX-ANIMATION INSTANCING.** Bake each crowd clip (idle / run / swing / hit / fly) into a texture at load (the mixer
   sampled per frame, the skinned positions written out); draw a whole kind as ONE `InstancedMesh` whose shader reads its frame from the
   texture -- 100 bodies, 1 draw call, zero CPU skinning. Only the few nearest (8-12) are real skinned bodies with real reactions; they
   swap seamlessly as they come close. Being sent flying is a rigid spin of the instance (that IS the musou look).
4. **THE BATTLE:** RED vs BLUE armies with banners and team hue (`rivalHue`), fighting each other in lines and knots; you pick a side or
   none. Crowd brain: slots round each target (no more than ~4 attack at once, the rest circle and wait -- the movie-crowd trick),
   separation, flocking to the front. Your hits LAUNCH them high and far (the knock-flight `bodyFly` already does).

## DONE WHEN
- [x] The probe's numbers from his phone are in NOTES (m1086: 21 to 50-something FPS, "not too bogged down").
- [ ] 100 fighters at 30 fps or better on his phone, all moving and fighting.
- [ ] Red vs blue fighting each other, and him in it; hits that send men flying.
- [ ] **He played it on his phone and signed it off.**

## HIS NOTES, Oct 28 2026 -- the war bosses, and the spider bots
> *"I spawned both war bosses and against the katana they never really block my shots. They both have shields -- still a little glitchy, and they
> don't block anything, so they die really fast. Make the bosses quite a bit harder and smarter, block a lot of my attacks, and find a special way
> -- some sequence -- that's the only way to get under their armour. And the robotic spider bad guys, if we haven't already."*
- [ ] the war bosses' SHIELDS actually block (a blocked hit is a clang, sparks, no damage), and the shield pose stops glitching
- [ ] smarter bosses: block most frontal attacks, punish spam, pick openings
- [ ] the ARMOUR KEY: one sequence opens them up (e.g. a guard break / parry-counter staggers them, then a window of real damage) -- his to pick
- [ ] the SPIDER BOTS as enemies (the Hangar's `spiderMake` crawlers, m1161, are scenery today)
