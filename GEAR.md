# Gear — movement for every character

**Status: SPEC, waiting on his models (Oct 24 2026).** A sandbox under the WHOLE-PIECE RULE.

*"I have the whole rollerblade girl functionality... for the characters that can't transform into her, I want the ability for
everybody to have her functionality at some point -- like Zelda, you find somebody that gives you rollerblades or jet blades...
and she has the flying wingsuit; we're gonna have another version of that for every character, not the exact same."*

- **Rollerblades / jet blades:** a headless (character-less) pair of skates from him, worn on any rig's feet (the foot bones, the
  weapon-bone convention: a `gear_root_foot_l/r` pair in his file so they parent with identity). Her skate locomotion, borrowed
  by whoever wears them.
- **Wingsuit:** her glide, with a per-character variant (his art) -- the same glide code, a different suit.
- **The skateboard** already exists (`SK8`) and is the template: a ride state any body can enter.
- In the arena first (a pickup that gives you the gear), never in a level until signed off.

## DONE WHEN
- [ ] Any hero can put the skates on and skate (Zap, Zoar, the grey) with her controls.
- [ ] The wingsuit glides for any hero, in that hero's variant.
- [ ] Taking them off returns everything (no leftover state).
- [ ] **He played it on his phone and signed it off.**

**Waiting on:** the skate model(s) and the wingsuit variants.
