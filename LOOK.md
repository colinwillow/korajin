# LOOK -- the soft stylized look, weather and atmosphere (Colin, Oct 31 2026)

> *"This rendering style is low poly but very stylized, very organic -- they blend the textures of the ground, the plants are interesting and soft and
> round... an interesting mix between a toon, flatter look and a stylized accent with a stylized shadow and fall-off. It's very satisfying to the eye. Our
> game is a lot of straight lines and jagged corners... I wish a shader could round off all the edges, bevelled edges, without adding compute or geometry."*
> / *"Being able to change the weather -- rain, drops on the ground, water and puddles, misty little cloud things that drift through. I'm loving their
> little plants, rock-looking plants, the roundness of everything -- they modelled everything out of round things, it's very approachable."*

His references: a small round planet, a blue axolotl-ish character, soft blob foliage, a glowing fountain, rain streaks, ring ripples on the ground.

## The pieces (each cheap on a phone: shader work on existing materials, pooled particles, no post chain)
1. **SOFT LIGHT** -- a material patch (`onBeforeCompile`) on the scene's standard materials: 2-3 soft light BANDS (toon, soft-edged), shadows TINTED
   toward blue / purple instead of grey, a RIM light on the edges facing away from the sun. No extra draws.
2. **SHADER BEVEL** -- on box geometry, the normal is bent near each edge (object-space distance to the edge) so light rolls round the corner as if
   it were rounded. Zero geometry; the silhouette stays straight. (NOT vertex displacement -- that is what made the Red Hollows edges look broken.)
3. **ROUND SHAPES** -- `RoundedBoxGeometry` (three's addon) for the big blockout boxes whose silhouettes show (temple, Wall Park, level builder):
   more triangles, no more draws (they are merged). Rocks as soft lumps; foliage as sphere CLUSTERS with blob normals (one soft mass).
4. **GROUND BLEND** -- noise-blended ground: grass into dirt into stone, colour patches, no hard material seams.
5. **WEATHER** -- CLEAR / RAIN / MIST, per scene (TOOLS and a level's own setting): rain streaks (one pooled draw), RIPPLE rings where drops land,
   PUDDLES (flat patches with a sky-colour sheen + ripples), drifting MIST sprites (large soft billboards, distance-faded).

## Rules
- Every piece on a switch (TOOLS > LOOK: CURRENT / SOFT; TOOLS > WEATHER) -- a taste decision is his.
- Phone budget first: measure draw calls before / after; nothing that needs a render target.
- Try it on ONE place first (the Wall Park), then the temple.

## DONE WHEN
- [x] SOFT LIGHT on a switch, rendered side by side with CURRENT (m1967)
- [x] SHADER BEVEL on the level boxes (m1975)
- [ ] ROUNDED boxes on the Wall Park's blockout
- [ ] RAIN with ripples and puddles, and MIST, on a weather switch
- [ ] soft rocks and blob foliage (one kit, used in one place)
- [ ] draw calls measured, no regression
- [ ] **His sign-off on his phone.**
