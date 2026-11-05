# UNDERWATER -- diving and the world under The Lake (sandbox)

His (Nov 5 2026): *"We're going to need the ability to swim down, because there's going to be a water temple underwater, so we have to
develop the underwater look: the shader, how that works. Pressing DOWN on the right stick makes you dive. We're in GOD mode so you have
infinite air, but eventually you'll have limited air, and to get deep enough you'll need some special ability or cloak. Developing a
beautiful, amazing underwater scene is going to be super cool."* WORLD_PLAN section 14.

**Where:** KORAJIN > The Lake (`?w=forge&zone=lake`). Jump off the boat, then hold the RIGHT stick DOWN.
**Code:** `UWATER` (the tuning table, between `SC_UWATER` markers) and the `uw*` functions, right after the Lake's own code. The Lake's
surface, boat and water material are the SURFACE worker's (`LAKELIB`); nothing here edits them -- the underwater look is a runtime patch
on every material (`uwPatch`, gated by one uniform, nothing changes above water) plus meshes of its own.

## Controls (in the water)
| | what |
|---|---|
| left stick | swim (in the camera's frame), at the surface and under it |
| right stick held DOWN | dive -- swim down, head first |
| right stick held UP (or a still hold) | swim up, faster than he floats |
| let go | he floats up slowly and breaks the surface by himself |
| tap right | beside the boat: climb aboard (unchanged) |
| keys | C = down, Space = up |

## Air and depth (the gate for later)
- **GOD mode: infinite air**, and no depth limit. The meter says so (AIR with the infinity mark).
- TOOLS > THE LAKE > AIR: LIMITED tries the real game's rule: `UWATER.air.max` s of air, refilled at the surface; at zero he is pushed up
  and cannot dive until he has breathed. Below `UWATER.air.deep.max` m the pressure stops him **unless** `uwDeepOk()` says he has the deep
  item -- the hook for the cloak/charm (WORLD_PLAN section 9's gating). Nothing grants it yet.

## Passes (one build each)
1. **DIVE** -- 3D swimming, the dive, natural surfacing, the air meter + the limited-air/depth hook, the camera under the surface, and a
   first underwater fog + the surface seen from below (so the first build does not look broken).
2. **THE LOOK** -- depth fog and colour falloff (turquoise -> deep blue -> black), caustics on the bed and on him, god-ray shafts from the
   surface, Snell's window (wavy, bright), drifting motes, bubbles from him.
3. **LIFE AND DEPTH** -- the floor (rocks, weed that sways, ruins), fish schools and drifting creatures, bioluminescence that glows more
   with depth, and a sunken structure hinting at the water temple below (spread over several depths: VERTICALITY).
4. **FEEL** -- the swim/dive animation fitted to Grumbo, muffled underwater audio, splashes in and out, the dive arc.

## DONE WHEN
- [ ] Right stick held DOWN dives him; letting go he floats up and surfaces by himself; up swims up. Works in portrait.
- [ ] Left stick swims him anywhere under the water; he cannot pass through the bed, the stacks or the hull.
- [ ] The camera follows him under the surface and never sits ON the waterline (above or below, never slicing it).
- [ ] AIR meter: infinite in GOD; LIMITED (TOOLS) runs out, pushes him up, refills at the surface; the deep-item hook stops him at depth.
- [ ] Under the surface: depth fog and colour falloff (turquoise -> deep blue -> black) -- deeper reads darker.
- [ ] Caustics on the bed and on him; light shafts from the surface; the surface from below is a bright wavy Snell's window.
- [ ] Motes drift; bubbles rise from him.
- [ ] The bed has rocks, swaying weed and ruins; fish schools and drifting creatures; bioluminescence that glows more as it gets darker.
- [ ] A sunken structure, spread vertically, hints at the water temple below.
- [ ] A swim/dive animation that fits Grumbo; muffled audio under water; a splash in and out; a dive arc.
- [ ] Phone budget: draws and triangles measured in the NOTES entry, no post chain.
- [ ] **His sign-off on his phone.**
