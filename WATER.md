# WATER -- The Lake (a sandbox under the WHOLE-PIECE RULE)

**His ask (Nov 3 2026):** *"I want to make an extraordinarily beautiful water scene. I want to spend a lot of time on the water shader. I want the
water deforming around a boat... maybe four or five times the size of the hero, kind of a long boat, futuristic but also Japanese style, maybe
some jets, maybe not. Water, floating mist, god rays, cherry blossom petals, really beautiful and harmonious. Eventually crazy stuff will go on (a
giant water monster, a boss coming up), but first and foremost the aesthetics. The river or lake could be in a canyon -- giant rock bluffs on
either side, then a beach. A model of what it would look like if you were just sailing on the water. I just want it to look absolutely gorgeous."*

Where it lives: **KORAJIN > The Lake** (`?w=forge&zone=lake`, `LAKEZ`). The whole place is ONE library, `lakeMake`, between the
`LAKELIB:START` / `LAKELIB:END` markers in `index.html`, so `npm run lakestrip` renders the SHIPPED text headless (never a copy) and the game
and the strip can never disagree. Its placements (stacks, the shrine, the falls, the boat's start) are rows between `SC_LAKE:START` / `:END`.

**No combat, no monster.** This sandbox is the LOOK. The monster is a later piece that will be BUILT ON this one only once it is signed.

## THE VISION (in words)
- **A long lake in a canyon**, golden soft morning, sun low down the canyon so the water carries a glitter path toward the lens.
- **Bluffs** of layered sandstone on both sides (warm ochre, rose, cream bands), stepped in tiers with green ledges, 60-140 m tall, the rims
  catching the sun; **beaches** of pale sand at their feet; **sea stacks** standing in the water with foam rings at their feet.
- **The water**: deep teal-blue in the middle, turquoise over sand in the shallows, clear enough to see the bed (with caustics) at the edges,
  a mirror of the lit cliffs and the sky at a grazing angle (Fresnel), sun glitter, a soft foam line where it meets sand and rock.
- **Later**: floating mist banks, god rays (billboard shafts, no post chain), cherry trees and their petals drifting and LANDING on the water,
  riding the waves; a waterfall that comes FROM a source and arcs (CRAFT.md 2); a torii / shrine on a bluff; floating islets above (VERTICALITY).
- **The boat**: a longboat 7-9 m (4-5x Grumbo's 1.75 m), Japanese-futuristic -- lacquered wood + brushed metal (never black, CRAFT.md 4), an
  upswept prow, a small roofed shelter / lantern, Jinra lines (JPAL only). Floats on the SAME wave function the shader uses. Jets on a switch.

## THE WATER SHADER (pass 1)
- **One wave function, two readers.** A sum of Gerstner waves (`W.waves`: direction, wavelength, steepness) evaluated in the vertex shader AND
  in JS (`L.waveAt`), so the boat (pass 2) floats on exactly what is drawn.
- **A camera-following POLAR grid**: rings that grow geometrically (`grid.r0`, `grid.N`), so cells are square and ~5 cm under the lens and
  tens of metres at the horizon; each wave FADES OUT where the grid can no longer carry it (spacing > wavelength / 4), so nothing shimmers.
- **The bed does the transparency.** The terrain shader knows the water level: under it, it absorbs toward the water's colour by the PATH
  LENGTH through water (depth over the view's slope) and gets animated caustics. The water surface on top is premultiplied: it adds the
  reflection by Fresnel, the sun glitter, the crest scatter and the foam. So the shallows show sand and the depths read teal with no second pass.
- **Reflection** (`W.mirror`): a planar mirror of the canyon and sky at a reduced resolution (`W.rtK` of the screen), distorted by the wave
  normal. It is the one render-to-texture, and it earns it: a canyon lake IS its reflection. TOOLS > LAKE MIRROR: OFF falls back to the analytic
  sky (no second pass) for a slow phone.
- **Shore foam** from a depth texture (`L.hTex`, the bed height in half floats, the same table the terrain is built from): a soft broken band
  where the water is shallow, pulsing with the waves.

## PASS PLAN (one build each; render + LOOK at every one; a contact sheet to him)
1. **Water shader + first canyon** -- sky, bluffs, beaches, stacks, the shader, the strip tool. *(m2318)*
2. **The boat** -- hull, deck, prow, shelter / lantern, Jinra lines; buoyancy at 4+ hull points (heave, pitch, roll) off `L.waveAt`;
   TOOLS > BOAT JETS (default OFF); the floating ship as a second hull on a switch. *(m2330: the longboat, buoyancy, jets switch, he stands on the deck; the floating-ship hull NOT done)*
3. **Water around the boat** -- bow wave, hull displacement, a Kelvin wake from a trail of past positions, foam where hull meets water, spray. *(m2335; the boat CRUISES a lane to show it -- stick steering is pass 5)*
4. **The place** *(m2340 4a: cherries, petals, mist, rays; 4b m2343: falls, torii + shrine, islets)* -- the waterfall (source, arc, spray, mist), the torii / shrine on a bluff, floating islets, cherry trees; mist banks, god
   rays, petals drifting and landing on the water.
5. **Sailing** *(m2354: the helm -- take it, steer, leave it and walk the deck; swimming waits on Mixamo swim clips)* -- left stick steers / throttles, camera in the CINEMA.md house style, walking on the deck when stopped; the ENTRY row lands him
   on the deck.

## NIGHT *(m2359: first pass in)* (his, relayed Nov 3 2026 -- AFTER the day look is strong, not instead of it)
*"Tons of stars, like out in the middle of nowhere -- shooting stars, the Milky Way, maybe a big planet. Things come alive at night: Japanese-looking
alien symbols you don't see in the day glow on the boat's wood, in the sand, on the rocks, in the cracks between rocks; plants glow (Jinra
palette); lanterns glow. Like Avatar at night."* Water at night: the stars / moon / planet in the mirror, bioluminescence in the wake and wherever
the hull, petals or oars disturb the water.
- **Not ours to build: the sky and the switch.** The game-wide night core (`NIGHT.f` 0..1, `nightPre`/`nightPost`, the shared star dome,
  TOOLS > TIME, NIGHT.md; m2317) owns them; `nightGlow(material, { mask, role, strength, pulse })` + a rune atlas are coming from that worker.
- **Ours:** the lake's own sky dome and water shader must READ `NIGHT.f` (the dome fades to the shared sky; the mirror then carries the stars), the
  water's bioluminescence (wake, hull contact, petals -- pass 3's disturbance buffer drives it, scaled by `NIGHT.f`, colour from JPAL), and the
  glow surfaces tagged in `SC_LAKE` (`glow:` on the boat wood, the stacks' cracks, the sand, plants, lanterns) so `nightGlow` can be pointed at them.
- **The API (m2323):** `nightGlow(mat, { mask: 'runes'|'cracks'|'veins'|'tips'|'all', role: 'glow'|'core'|'deep'|'spark'|'accent'|'mix', strength 2-2.8, scale, density })`,
  spliced after `#include <emissivemap_fragment>` (keep that line in our splices), applied only when `NIGHT.mode !== 'DAY'` (as `snowNightGlow`). Boat wood:
  `{ mask: 'runes', role: 'mix', density: .25, scale: 3 }`; sand `{ mask: 'runes', role: 'glow', density: .06, scale: .9, strength: 1.3 }`; stacks `'cracks'`.
  Our own shaders (sky, water) read `NGLOW.U.uNgF` (eased) / `NIGHT.f`.
- Lands as its own pass after pass 4; until then every new placement row carries its `glow` tag.

## HIS WISHLIST (his playtest of m2354, Nov 3 2026 -- later detail passes, whole-piece rule: perfect THIS sandbox first)
- floating water plants; lily pads you PUSH THROUGH (in: m2355); sea foam; rocks and natural ARCHES you sail UNDER; islands with big GLOWING trees;
  huge Greek / ancient temples, monuments and statues standing in the water; TEXTURES on the rock, sand, wood and water (albedo + normal, triplanar);
  glowing plants on the shore and the islets (the NIGHT worker's flora API).
- Longer term: water channels joining the ground-world areas through beaches and islands; things falling out of the sky into the water making big waves
  (a cinematic); a massive sea creature or a ~600 ft statue rising out of the sea (the boss moment).

## DONE WHEN (tick only WITH EVIDENCE in a NOTES entry)
- [ ] The water reads as WATER at every distance: no shimmer at the horizon, no visible grid, no seams where the grid follows the lens.
- [ ] Depth reads: turquoise over sand at the edges, the bed visible with caustics, deep teal in the middle; a foam line at every shore.
- [ ] The canyon is mirrored in the water at a grazing angle; the sun lays a glitter path.
- [ ] The boat floats on the drawn waves (heave, pitch, roll agree with the surface under it), lacquer and metal never black.
- [ ] The water deforms round the boat: bow wave, wake wedge, foam at the hull, spray at speed.
- [ ] The place: bluffs in tiers, beach, stacks, a waterfall from a source, shrine on a bluff, islets above, cherry trees, mist, god rays, petals
      that land and ride the waves -- every one checked close against CRAFT.md.
- [ ] He can sail it (stick steers the boat, the lens follows), and he arrives by the entrance (portal, flip, landing on the deck).
- [ ] NIGHT: the shared sky in the mirror, the tagged surfaces glowing through `nightGlow`, bioluminescence where the water is disturbed.
- [ ] Runs well on his iPhone (draw calls and triangles in the NOTES entry, the mirror on and off).
- [ ] **His sign-off on his phone.**
