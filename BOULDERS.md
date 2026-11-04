# FLOATING BOULDERS -- a sandbox (KORAJIN > Floating Boulders, `?w=forge&zone=boulders`)

## Vision (his words, Nov 4 2026)
*"Boulders that are floating -- different sizes -- just gracefully, melodically floating right off the ground, and interactive: you can walk
through them and it pushes them aside, a slight heaviness to them, but mostly just walking through. I also want to bump them around, slash and
maybe break them."*

Later this is **his Jinra power** (WORLD_PLAN.md section 4, GRUMBO'S RISE): as the meter fills, pebbles lift as he walks, rocks drift aside, a
swirl of debris goes round him. This sandbox is where the float, the push and the knock are made to feel right on their own first.

## How it is built (SCENE_COMPANION.md: data-first)
- `bouldMake(THREE, scene, O)` between `// BOULDLIB:START` / `:END` is a PURE builder of its table (`SC_BOULDERS` markers): the species, the
  scatter rule (seeded, so the ids `b01..` are stable), the tiers, the shots. No game state is read inside it.
- The game glue (`BOULD`, `bouldBuild`, `bouldStep`) adds the tiers to `BOXES`, stands him on the clear pad and steps the field.
- `npm run bouldstrip [shot] [--frames=N --dt=.5] [--night=1]` lifts the SHIPPED text and renders its cameras headless (draws, tris on the sheet).
- Rocks: three species (banded sandstone slab `hollows_rock`, chiselled red rock `hollows_cliff`, mossy lump `garden_rock`), two shapes each;
  textures TRIPLANAR in the rock's own space x its size, so the grain rides the rock and holds its metre scale.

## Passes
1. **THE FIELD** -- the floor, the tiers, 48 rocks pebble to car-size hovering 0.1-1.5 m (bigger = lower), bob on two incommensurate sines,
   small ones tumble, big ones sway and drift; contact shadows; faint Jinra wisps under the big ones. Instanced.
2. **PUSH THROUGH** -- a spring-damper per rock (offset + spin, mass from size): he shoves them aside (small skitter, big lean), they drift home;
   rock-rock separation; he is never trapped (heavy only slows him a touch).
3. **BUMP / HIT** -- melee, kicks, arrows, the goop slam knock them (impulse by attack); a heavy hit / charge release BREAKS small and medium
   rocks into chunks that float a moment and fade; the rock regrows later.
4. **NIGHT** -- cracks and rune patches glow in PIECES (`nightGlow`, object space so they never slide).
5. **THE JINRA AURA PREVIEW** -- TOOLS > BOULDERS > JINRA AURA (off by default): pebbles near him lift and drift round him as he walks.

## DONE WHEN
- [ ] The field reads as a natural rock garden of FLOATING rocks, many sizes, never one plane, never a metronome (pass 1; strip in NOTES).
- [ ] Phone-cheap: draws and tris reported, no hitch on entry (pass 1 numbers, then each pass).
- [ ] The ENTRY row lands him on the clear pad facing the field (normal play camera, flat portal, minimal).
- [ ] Walking through pushes them aside with weight; they drift home; they never interpenetrate; he is never trapped (pass 2).
- [ ] Every attack knocks them by its strength; arrows too; heavy hits break small / medium ones; chunks float and fade; rocks regrow (pass 3).
- [ ] Night: the rocks glow in pieces, stuck to the rock as it turns (pass 4).
- [ ] JINRA AURA (off by default) lifts the pebbles near him into a drift round him (pass 5).
- [ ] **His sign-off on his phone.**
