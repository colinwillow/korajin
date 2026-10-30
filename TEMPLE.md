# THE SKY TEMPLE -- a zone built to his concept art

**Concept:** `docs/concepts/temple_01.png` (his, Oct 31 2026; more images will land in `docs/concepts/` -- read them all before each step).
A warm sandstone MEGALITHIC temple on a FLOATING island above the clouds -- Zelda Divine-Beast / Egyptian / Mesoamerican stone, mixed with
ancient-futurist tech: gold/bronze trim, JADE-TEAL glowing channels, braziers with jade flames, a gold HALO ring over the summit with a jade core,
tall red banners with a gold double DIAMOND and tattered tails, rope rails on posts along every edge and bridge, red carpets up the stairs,
vines and palms, guardian statues flanking the door, more floating islands in the distance with teal light beams, clouds BELOW.
His words: *"ancient and futurist at the same time"*, *"Zelda Divine Beast temple vibe, megalithic, Egyptian pyramids, mixed with cyberpunk --
rope rails, ledges, futuristic, floating"*. It starts as ONE piece (his: *"like the beach -- a piece we can use for one of the temples"*).

**Where:** KORAJIN > The Sky Temple, `?w=forge&zone=temple` (a forge zone like the Wall Park / Duel Pit: `TEMPLEZ.want` from the URL, built by
`templeBuild()` from the frame's zone line next to `wparkBuild()` / `duelBuild()`, a menu button beside "The Duel Pit (online)").

## Rules for whoever builds it (read CLAUDE.md first -- every rule there applies)
- **Its own block.** All temple code lives in ONE contiguous block in index.html between `// TEMPLE:START` and `// TEMPLE:END`, data in
  `SC_TEMPLE:START/END` (SCENE_COMPANION.md: a placement list with stable ids, the builder a pure function of its table). The only lines
  outside it: the `zone=temple` want flag, the one call on the frame's zone line, the menu button. Another session is editing index.html at
  the same time -- keep the footprint small and `git pull --rebase origin main` before EVERY push.
- **Reuse, don't fork:** the LEVEL BUILDER's look kit is shared -- `lbMegaTex`, `lbTechTex`, `lbMat(c, ghost, 'mega'|'tech'|'stone')`,
  `lbBoxGeo` (per-metre UVs), `lbGoldMat`, `lbGlowMat` (jade), `lbBanner2Mat` (his diamond banner), `lbBrazier`, `lbVineMat`, `lbCrystalMat`,
  `lbFlutter` (sway / bob / flicker). Colliders are AABBs pushed to `BOXES` then `boxGrid()`; walkable slopes via `bldTris(owner, tris)`.
  Movement systems to wire in: ladders `kitClimbAdd`, high bars `hbarMake`, monkey bars `MBAR.list`, ziplines `ZIPS`, swing ropes `vineMake`.
- **Verticality** (CLAUDE.md): routes climb. Every placement gets a height decision. The temple is a climbing level first and a picture second.
- **Phone budget:** merge static geometry per material (`mergeGeometries`) -- aim under ~60 draw calls for the zone, triangles modest.
- Each step = ONE build: `npm run bump`, `npm run check` (4 "boot ok"), push to `main`, a NOTES.md entry at the top, tick the step here
  with the build number. Render it headless and LOOK at it against the concept before ticking.

## Steps
- [ ] 1. THE ISLAND + SKY: the zone exists; a floating rock island (tapered underside, ragged stone), a sea of clouds below (layered soft
      planes), a warm sky, 4-6 distant floating islands with spires and teal light beams (cheap: billboards / low-poly), fall-off = respawn.
- [ ] 2. THE TEMPLE MASS: the stepped megalith core (battered walls, two side pylons, the central tower), the grand stair with a red carpet,
      the landing with braziers, the door (jade-ringed, sealed), rope rails along every edge. All of it climbable / walkable.
- [ ] 3. THE SUMMIT: the gold HALO ring with the jade core and a beam up into the sky; the pylons' banners (his diamond banner, swaying).
- [ ] 4. THE BRIDGES: side bridges off to two satellite pillars (one plank with rope rails, one sky bridge), braziers at the ends.
- [ ] 5. DETAIL: guardian statues flanking the door, palms in stone planters, vines, jade channels glowing down the walls, ledges to hang on.
- [ ] 6. THE ROUTE: a parkour route from the landing to the halo using the game's moves -- wall runs up the pylons, ledges, a high bar, a
      zipline back down; tuned so it is fun on the phone.
- [ ] 7. His pass: whatever he asks after playing it.

## DONE WHEN
- [ ] it reads as his concept from the front, back, left and right (compare against the four-view sheet)
- [ ] the route from the stair to the halo is climbable end to end with the game's moves, and the zipline brings you back
- [ ] under ~60 draw calls on his phone, no hitch on load
- [ ] his sign-off on his phone
