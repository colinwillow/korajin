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
- [x] 1. (m1899) THE ISLAND + SKY: the zone exists; a floating rock island (tapered underside, ragged stone), a sea of clouds below (layered soft
      planes), a warm sky, 4-6 distant floating islands with spires and teal light beams (cheap: billboards / low-poly), fall-off = respawn.
- [x] 2. (m1900) THE TEMPLE MASS: the stepped megalith core (battered walls, two side pylons, the central tower), the grand stair with a red carpet,
      the landing with braziers, the door (jade-ringed, sealed), rope rails along every edge. All of it climbable / walkable.
- [x] 3. (m1901) THE SUMMIT: the gold HALO ring with the jade core and a beam up into the sky; the pylons' banners (his diamond banner, swaying).
- [x] 4. (m1903) THE BRIDGES: side bridges off to two satellite pillars (one plank with rope rails, one sky bridge), braziers at the ends.
- [x] 5. (m1905) DETAIL: guardian statues flanking the door, palms in stone planters, vines, jade channels glowing down the walls, ledges to hang on.
- [x] 6. (m1907, shipped unverified -- the bar release onto the tower is the part to tune) THE ROUTE: a parkour route from the landing to the halo using the game's moves -- wall runs up the pylons, ledges, a high bar, a
      zipline back down; tuned so it is fun on the phone.
- [ ] 7. His pass: whatever he asks after playing it. His second set of concepts (`temple_02_front` .. `temple_05`, docs/concepts/README.md):
  - [x] 7a. (m1909) THE UNDERSIDE: a cluster of downward stone SPIKES under a ragged slab (not one rounded cone), a jade-core hanging PYLON (gold rings,
        jade cylinder, spiked gold tip) from the middle and smaller ones under the corners.
  - [x] 7b. (m1911) HANGING LANTERNS: gold-capped cages with jade glass and a spiked tip, on chains -- under the island, the bridges, the satellites. One draw.
  - [x] 7c. (m1912) SATELLITES at two levels: inverted-spire towers with a jade core and a small top with a palm; an UPPER bridge off each pylon; the
        rope rails go RED.
  - [x] 7d. (m1913) The halo's jade DISH and red chains down to the pylons; the jade porthole disc over the door; the BACK's gear disc and jade slit windows.
  - [x] 7e. (m1914) Jackal-headed jade-armoured guardians; gold studs in the stone; far islands as small temples with WATERFALLS.

## Where it is going (his, Oct 31 2026)
*"Eventually it'll be on the ground. You attack and beat a lot of the guards up in the watchtowers and the turrets, and you have to hit a bunch
of things on different towers and figure out how to open the temple; then you open the giant front doors and go inside, and it's a giant
UNDERGROUND temple -- the inside ten times larger. This could just be the part that sticks up above the ground, the tip of the iceberg. I like
the outside heavily guarded, very automated -- turrets that shoot at you, towers, enemies, floating pieces you've got to figure out how to get
to. Let's keep doing passes."* For now it stays floating (*"that's fine"*); the under-temple is its OWN sandbox (its own doc and DONE WHEN)
once he starts it -- the doors here only open onto it.
- [x] 8a. (m1922) THE DEFENCES: four watchtowers (40-75 m) with posted turrets and ledge columns, a floating stepping-stone chain to a seal island,
      SEALS on three towers and the island -- strike them all and the great door sinks.
- [~] 8b. GUARDS: trigger-zone AMBUSHES with the game's existing enemies, "just to play around with" (his go-ahead, m1922); the strategic plan is his, later.
- [~] 8e. THE GIANTS (his, m1927: "massive statues that come to life that you have to fight, instead of this tiny turret"): (pass 1) the three-headed dog in STONE at x6.5 on every watchtower deck, the turrets gone. Next: the WAKE -- striking that tower's seal wakes it (an event, STATUES.md), it comes down off the tower and fights at giant size; then a dragon / sphinx form for the back towers.
- [ ] 8c. More floating pieces round the outside, each with a reason to reach it; a better tell for which seals are left.
- [ ] 8d. On the ground: the temple as the tip of the iceberg (a ground variant of the island), the doors opening onto the way down.

## DONE WHEN
- [ ] it reads as his concept from the front, back, left and right (compare against the four-view sheet)
- [ ] the route from the stair to the halo is climbable end to end with the game's moves, and the zipline brings you back
- [ ] under ~60 draw calls on his phone, no hitch on load
- [ ] his sign-off on his phone
