# BUILDINGS -- the Building Forge queue (KORAJIN)

His brief (Oct 27 2026): *"Build retro-Japanese-inspired alien cyberpunk buildings. Each building gets 3 passes. I want them to be great.
Every time you complete the third pass on a building, add it to the inventory I can spawn into the Building Forge, so I can check it out,
run on it, swing on it, blow it up and repair it. Make various TYPES of buildings that are modular and will eventually fit together, with
different functions: bars and ramps, interior and exterior, turrets, ballistae, beams -- floating flying ship buildings, zeppelins, towers."*

## THE PROP LIBRARY (his, Oct 28 2026; PROPS.md)
*"Plants, pots and pans, tables, benches... rocks, water features, fountains, fences, ladders -- detailed passes on all of those tertiary items."* About ten passes each; each family gets a sandbox.
- [x] **plants pass 1 (m1425):** SPAWN > BUILDINGS > Plant Library: cherry, pine, saguaro, agave, bamboo, fern, Jin bulb, grass. Wind sway; a katana, a bolt or walking through bends them and they spring back
- [ ] plants pass 2: real silhouettes per type (PROPS.md has the ten-pass plan)
- [ ] rocks, water, courtyard, fences and blocks, household, climbing: each its own sandbox, pass 1 each

## THE GROUND (his, Oct 28 2026: *"the grass is very low quality... flat where it should be flat, a courtyard, but grassy knolls should have variation... paint the grass, add little alien plants, rocks, dirt"*)
- [x] **pass 1 (m1437):** knolls outside what is built (`floatIsland` `knoll`/`flatR`); the painted ground (`isl4Mat`); new grass tufts; flowers, alien fronds and stones; every dressed island in the dojo scattered from the plant library
- [x] **pass 2a (m1440):** the knolls' facets: the island tops are shaded SMOOTH (shared normals, `smoothTop`); the undersides keep their rock facets
- [x] **pass 3 (m1451):** the landmasses broken up: a dense blade carpet, tall seed grass, leafy shrubs (some in bloom), mossy boulders, fallen sticks, grassy mounds, the library's swaying cherry and pine, and a FRINGE round every rim (grass, fronds, rocks sunk in the lip)
- [ ] pass 2b: the knolls' FACETS (the icosphere top is coarse: a finer top grid, or a displaced disc), stronger worn dirt paths between built things, moss on the shade side of rocks
- [ ] pass 3: grass that thins near paths and thickens in hollows; puddles; fallen petals under the cherries
- [ ] pass 4: the same ground in Grumbo's home and the forge buildings (one shared ground kit)

## THE CREATURES, PASS BY PASS (his: *"individual passes on the animals themselves, a bunch of passes on each, because the first pass on anything is never good"*)
- [x] **sky whale pass 2 (m1491):** the profile was BACKWARDS (fat tail, thin head = a shark-blimp); now a blunt-headed humpback: a mouth line, barnacles, a violet-navy back over pale throat pleats, glowing Jinra spots along the flanks, long swept pectoral paddles, a dorsal hump, a broad fluke
- [ ] sky whale pass 3: the fins' knobbly leading edges and a real flipper outline (not a capsule), an eye with a lid, a breath plume of Jinra vapour from a blowhole
- [ ] sky manta (dojo, pass 1 at m1417): pass 2 -- a thicker body, a curled cephalic fin, a proper underside, wings that ripple, not fold
- [ ] serpent fish (the Ship, Worker A): its own passes in the Ship's list
- [x] **sky dragon pass 1 (m1481):** a 64-segment red-and-gold Jin serpent-dragon with a mint mane, gold horns and whiskers, weaving between the islands through the tiers (-30 to +60 m)
- [x] **sky dragon pass 2 (m1510):** a real eastern head (long snout, fat nose, an OPEN jaw with fangs and tongue, gold lips, brow ridges, mint eyes, branching antlers, a gold beard, whiskers, a frill of Jinra flames), four clawed legs that paddle, a Jinra tail tuft
- [x] **(m1515, his: *"I meant my blue dragon GLB and the three-headed dog"*)** HIS BLUE DRAGON rests on its own high crag off the dojo (the one you will tame it on); HIS THREE-HEADED DOG stands on its own ledge to the east; both his models and clips, cycling their idles. The procedural dragon's head went back to pass 1 (he liked it more)
- [ ] his beasts next: the dragon takes off and flies (it has no fly loop -- `attack_air` is the nearest; ask him for a fly cycle), the dog prowls its ledge; then TAMING (give it good Jinra) and RIDING
- [ ] sky dragon pass 3: the body rolls into its turns; scales (a texture or bands of plates); the jaw opens and closes; a roar; then the TAMING and RIDING (KORAJIN.md: the first mount)


## THE RE-PASS: EVERY FORGE BUILDING IN THE NEW STYLE AND THE NEW RULES (his, Oct 28 2026 -- Worker A)
> *"Redesign the buildings we already made -- embellish them, a detail pass to make them read in game with our new style, and follow the game rules
> of layer one, layer two, layer three. Towers: how do you get up? Is there a fun dynamic to each? Breakable buildings, or roofs with a skeleton
> that break. Can you hang on the rims? Bars at the bottom of some places where you can flip up to the second deck. Do the ladders make sense?
> Do the doors break or open?"*

**The rubric, every building, every pass** (tick in its row with the build number; Colin signs the last box on his phone):
1. **Style:** ARCHITECTURE.md (the hero kit for his places; classical for heritage; the enemy grammar for enemy places) and the shared kits: `triMat`, `kor*`, the plant library, coins, the Jin glow (mint ONLY for Jin).
2. **Verticality (CLAUDE.md, the planes rule):** tiers, not a single ground plane. Every building answers **"how do you get UP"**, and the answer is fun: bars to flip to the next deck, rims and ledges to hang on, wall runs, ladders that sit where a person would use them, ramps or stairs at his step (.32 m risers or less).
3. **Layers (LEVELDESIGN.md):** L1 the run (the parkour line through it, timed to the move table), L2 a puzzle or key (a lock, a lever, a door), L3 enemies with zones (who stands where, what they guard).
4. **Breakable and alive:** doors open or break; roofs have a SKELETON (rafters and beams) so a broken roof reads; something to smash; lanterns, cloth and smoke moving.
5. **Detail and embellishment:** silhouettes that read from the game camera, plants and rocks round the base, signs of use.
6. **Budget:** about 40 draws per building (merge per material), no new physics, `npm run check` clean.
7. **Two states, ONE set of pieces -- for HERO / TOWN buildings only (his, m1513):** FALLEN = pieces collapsed, slid, tipped, rust-grey; RESTORED = the pieces fly home and the colour, lamps and Jinra come back IN PLACE. Buildings do NOT fly on their own: a town's GROUND breaks off and rises as a whole (a later town-scale system; the Watchtower test rides its own chunk of earth to show it); only ships fly. ENEMY buildings are not restored. Kit: `restorePieces` / `restoreSkin` / `restoreRide` (the Watchtower is the reference).

**HERO / TOWN versus ENEMY (his pick, m1514):**
- **HERO / TOWN** (the hero kit; restored IN PLACE -- pieces home, colour, lamps and Jinra back, no lift): Dojo Hall, Shrine, Market Stalls, Bathhouse,
  Forge-Workshop, Teahouse Garden, Lantern Festival Street, Cliff Lodge, Jin Lighthouse, Jin Observatory, Sky Bridges, Floating Islands, Senbon
  Torii, The Courtyard, Pagoda, Great Red Pagoda; and the FLYERS (Airship Dock, Zeppelins, Flying Ship House), which may fly.
- **ENEMY** (no restoration; the CLASSICAL FORTRESS grammar -- stone-walled keeps, stacked roofs, black-and-white plaster, iron-studded gates, the
  stolen Jinra burning mint in their braziers): Watchtower, Gatehouse, Rampart Wall, Moated Keep, Robot Barracks, Spider-Bot Hangar, Siege Yard,
  Oni Gate, White Heron Castle, Mega Wall, Kneeling Colossus, Ninja Pillars, Octagonal Block Pagoda, Timber Siege Fort, Sky Wreck.
- **ENEMY RULES (his steer, after m1514):** enemy buildings are FOR DESTROYING -- never fallen/restored, never floating. Keep (or put back) their
  CLASSICAL Japanese base and EMBELLISH it -- not the hero kit (no domes, tent cones, red-and-cream diamonds). Make each one DESTRUCTIBLE TO THE
  GROUND (raising a sacred building, a Jinra power plant or shrine, in its place is a later system). Their PALETTE is open: he is generating enemy
  concept images (leaning black with a gold emblem, maybe green); restyle only once he has picked.

**The buildings** (SPAWN > BUILDINGS), at least 3 passes each:
| building | p1 | p2 | p3 | his OK |
|---|---|---|---|---|
| Dojo Hall |  |  |  |  |
| Watchtower | m1487 hero kit: tent-cone crown, box lanterns, bunting, wheel winch, plants, a low bar; ~180 -> 87 draws | m1489 the crown breaks panel by panel to a rafter skeleton; doors swing open and break | m1490 layers: a rope-ladder SHORTCUT that drops from deck 2, doubloons on the perch tips, a guarded Jinra canister on the lookout; m1512 restorable test; **m1521 ENEMY: classical again, and DESTRUCTIBLE -- cut three corner posts and it collapses round its ground floor**; m1528 the ENEMY LOOK (black lacquer, gold, mint Jinra lanterns and brazier, black emblem banners) |  |
| Gatehouse | m1529 ENEMY look: black lacquer and gold, emblem on the towers and torii, black emblem banners, two SPHINX guardians (`enemySphinx`), mint Jinra glow, merged | m1534 DESTRUCTIBLE TO THE GROUND: cut 3 of a tower's 4 upper posts and its upper storey falls outward; both down drops the deck (ballista, archers, oil dead); a cut torii pillar drops the torii; sandstone-block ground storeys (`enemyWallTex`) | m1535 classical YAGURA over each tower (black-tile two-tier hip roofs, gold finials and tips, mint lanterns; they fall with their tower); four tippable mint BRAZIERS (`enemyBrazier`); the alarm bell swings after the deck falls |  |
| Pagoda | m1494 classical heritage in painted maps (roof tiles, timber, sandstone), Jinra core, bunting, plants; ~270 -> 85 draws | m1497 the belfry cap breaks panel by panel to a rafter skeleton; doors open and break (shared `bldDoors`) | m1500 layers: a launch bar at the foot, doubloons up the gutter climb, the bell unfurls a climbable RAIN CHAIN shortcut; **m1518 RESTORES IN PLACE (one set of pieces: storeys fly home, colour back)** |  |
| Great Red Pagoda | m1507 painted floors, roof tiles and sandstone (the lacquer kept bright), Jinra core, plants, fallen/restored | m1524 RESTORES IN PLACE: storeys and spire fly home over the surviving ground storey, colour back | m1526 storeys paired (158 draws), a doubloon on every upper balcony |  |
| Shrine | m1539 HERO look: stone-block terrace and steps, plaster honden under a tiled roof with bronze finials, Jinra-mint core, the alien tree now a CHERRY, bamboo, pine, ground plants, red-and-cream bunting; merged (114 meshes) | m1540 **RESTORES IN PLACE**: the terrace stays; the honden, torii and five stone lanterns are pieces (wrecked when fallen), bunting, cables and drone only when whole, the core dark in its basin and not healing until restored; mint plate by the east wall | m1542 LAYERS: a launch bar by the west wall (L1 to L2), doubloons along the stone beam and on its lantern, a walkable honden RIDGE off the eave rings with three doubloons (L3, only when restored), barrels and pots to smash at the foot, cherry petals drifting |  |
| Market Stalls | m1544 HERO look: kit timber, warm planks, stone-block paving; TIMBER SIGNBOARDS with red brush glyphs and side lanterns instead of neon; shared goods materials; bunting on the roof rail and to the nobori; bamboo, cherry, pine, potted ferns and flowers; merged (147 meshes) | m1548 **RESTORES IN PLACE**: the paving, walls, ramp and fireworks booth stay; roof, front posts, four stalls, ring poles and nobori are pieces (the roof down across the stalls when fallen, not walkable); lantern strings, laundry, bars and drone only when whole; mint plate off the west end | m1552 LAYERS: a FIRE-WATCH LOOKOUT on the roof's east end (L3: posts, railed platform 3.4 m up, tiled roof, ladder, a bronze alarm bell that rings when struck), doubloons up there and along the roof (only when restored), straw rice bales to smash at the west end |  |
| Rampart Wall | m1554 ENEMY look: pale sandstone block masonry, black lacquer timber and jambs, gold coping strips and bastion bands, gold emblems on the bastions, black emblem banners on both faces, iron braziers of mint Jinra, the oni masks in black/gold/mint, two SPHINXES at the outer gate; merged (139 meshes) | m1558 DESTRUCTIBLE TO THE GROUND: each run is four segments with a glowing Jinra SEAM at the outer foot (6 blows: it slumps into rubble outward, Jinra spills); a bastion falls to its seam or its brazier and takes its turret; both gate-side segments down drops the gate (lintel, masks, horn) | m1561 a roofed GATE GALLERY over the gateway (lacquer posts, gold bands, two-tier black-tile hip roof, gold finial and tips, emblem plaques, mint lanterns, grapple rings under its eaves; falls with the gate); the robot sentries topple off a fallen segment and stay down |  |
| Airship Dock | m1564 HERO look: kit timber, warm planks, stone footing, bronze, warm plaster shaft; a cream balloon in bronze bands with red fins, a plank gondola; Jinra-mint kite eyes; bunting from the mast to the deck corners, lanterns on the arm, plants round the foot; tower and ship statics merged (112 meshes) | m1565 **RESTORES IN PLACE**: the hall, shaft and lift rails stay; the top deck and the landing arm are pieces; fallen, the AIRSHIP lies deflated in the grass and does not fly, the lift stays down, cables gone; restored, deck and arm fly home and the airship is moored and flying; mint plate west of the foot | m1568 THE CLIMB: three ladders up the shaft's west face with railed balconies at 7.6 and 13.6 m (a lantern and a doubloon each), the last to the deck only when restored; a doubloon on the mast head by its ring; tiled pent roofs over the hall |  |
| Zeppelins | m1571 HERO look: warm plank gondolas in the kit red, timber, bronze; cream envelopes with red lacquer flank bands (no neon); tiled pagoda roofs with a bronze finial; bunting rigged roof-to-hull; Jinra-mint bomb bands; statics merged into each ship (86 meshes for both) | m1572 **RESTORABLE** (flyers): fallen, each lies grounded at its rest spot, the envelope slumped over the gondola, drained, its trapeze, rings, gun, drops and bombs dead; restored, the envelope fills, it rises to cruise and glides back onto its loop; mint plate by the first wreck | m1575 L3 and alive: doubloons that ride under each gondola by its rings and below its trapeze (to be had on the swing), a bronze exhaust stack puffing smoke, red-and-cream tail streamers waving off the fins; **doubloons now step outside the dojo** (they never bobbed or could be collected in the forge) | (his: more detail passes, an invisible collider, no way up) m1586 pass 4: the INVISIBLE COLLIDER fixed (the hull is solid, not a chest-high slab); a BOARDING PIER on each loop where it slows and comes down to deck height (stairs, bollards, a lantern); the gondola is a BOAT (tapered sheer hull, bronze gunwale, rail on posts, curved upturned pagoda roof, bronze prow) m1589 pass 5: the envelope -- gore seams nose to tail, a red equator band that follows the curve, a bronze nose cap with a mooring ring and a tail cone; a rippling red pennant at the stern m1591 pass 6: a worked deck (bronze helm on a binnacle, benches, cargo crates and a barrel, a chart table, a ship's bell); tall red banners and bunting on the piers so they read from afar m1594 pass 7: THE ENVELOPE WALK -- a rope ladder from the deck up through a hatch to a railed catwalk on the envelope's spine (it rides the ship), lanterns at its ends, three doubloons up there m1596 pass 8: lights and cloth that move -- red chochin swinging from the roof corners (leaning out on the turns), a rippling noren at the bow m1597 pass 9: a mint JINRA LIFT-CORE turning in a bronze cage on the deck (sheds motes in flight, a dim ember when fallen); the piers grounded with plants, a bench, crates and a barrel m1598 pass 10: COLLIDER AUDIT -- the deck is three turned boxes that follow the hull's taper (the one box overhung the bow and stern corners by .26 m and fell short midships by .2) |
| Flying Ship House | m1599 HERO look: kit timber, warm planks, a dark planked hull, the kit red and bronze, warm plaster; Jinra-mint engines; lanterns at the gangplank foot, bunting down the stays, plants beneath; merged; COLLIDER AUDIT: the hull box was full depth bow to stern under an upswept keel (1.2 m invisible) -- three boxes now | m1606 **RESTORABLE** (a flyer: restored means afloat): fallen she rests on her keel in the grass, engines dark, sails gone, cannons and bow gun silent, climbs dead, drained; restored she rises 3.2 m onto her engines; every collider rides the rise; mint plate by the gangplank | m1607 ALIVE and L3: the junk sails BILLOW (a breathing belly), a galley chimney on the deckhouse smokes, doubloons at the bowsprit tip, the crow's nest, the deckhouse ridge and the high bar (they ride her, afloat only) |  |
| Bathhouse | m1611 HERO look: kit timber, warm planks, stone block, bronze-hooped cold tub, a planted side garden, a cherry and bamboo, lanterns on posts at the engawa, bunting on the front eave; merged; COLLIDER AUDIT: the round tub and boiler had square boxes (.26-.31 m of corner solid air), trimmed; the tub no longer flips the shared plank material double-sided | m1617 **RESTORES IN PLACE**: the floor, walls, pool, tub, boiler and engawa stay; the roof, front posts, chimney, fence and stone lantern are pieces (the roof sagged into the hall, the chimney in the yard, the fence flat); the pool is cold while fallen (no steam, no healing, no geyser); mint plate before the engawa | m1620 UP: a MONOHOSHI (rooftop drying deck) over the side eave at 6.3 m with a ladder from the yard, railings, laundry flapping and doubloons; a doubloon hung over the pool that only the geyser reaches (all with the roof: gone while fallen) |  |
| Forge-Workshop | m1623 HERO look: kit timber, stone block, bronze and iron, lanterns on posts at the open front, bunting on the front beam, plants; merged (79 meshes); COLLIDER AUDIT: the round furnace, its plinth and the crane were full-square boxes (up to .9 m of solid air) -- crossed box pairs now (`roundBox`) | m1626 **RESTORES IN PLACE**: the walls, furnace, anvil, trip-hammer, gears, stairs and crane stay; the roof (bronze ridge cap), the flue, the front posts and the loft are pieces; the furnace is cold while fallen (no glow, no smoke, the bellows dead); mint plate before the front | m1630 **UP ON THE ROOF**: an outside ladder up the back wall, a plank gangway over the roof, the bronze ridge walkable, an iron platform round the flue with rails; doubloons along the ridge and on the platform (with the roof piece: gone while fallen) |  |
| Spider-Bot Hangar | m1635 ENEMY look, the CLASSICAL grammar where the concrete vault was: a sandstone-block hall (the walls ARE the colliders), a black frieze with gold studs, a curved black-tile hip roof (walkable, sampled off the drawn surface) under a walkable gold ridge, an emblem gate on lacquer jambs, two SPHINXES on the approach, nobori, emblem banners, mint braziers; mint pods, beacon and spider eyes/cores (terracotta and lacquer constructs); merged (137 meshes); COLLIDER AUDIT: the vault's side boxes stood .7 m proud of its curve, the crown box .7 m over it at its edges | m1636 DESTRUCTIBLE TO THE GROUND: a Jinra SEAM in a gold frame at the foot of each long wall and the back (6 blows: the wall slumps outward into rubble, Jinra spills); either long wall down drops the roof (beacon and mirror with it) into the hall, and the gate after it; all three down RAZES it: the pods crack, the spiders burst and none hatch again; the front panels stay breakable | m1640 THE CLIMB: a sandstone stair up the east flank (14 risers of .286, every step its own box) to a landing at the eave with a mint lantern post; the roof is the walk from there up to the gold ridge, doubloons on the ridge (gone with the roof) and on the landing; the east seam moved forward of the stair |  |
| Sky Bridges | m1642 HERO look: painted warm planks, kit timber, bronze; each span gets a small GATE 1.2 m in from each end (posts with bronze caps, a red lacquer kasagi with upturned bronze tips, a tie beam, a lantern hung on the axis); the prayer flags are the kit red-and-cream bunting, all of a span's flags ONE mesh fluttering in the vertex shader; the zips bronze; merged (287 meshes -> 9 for three spans) | m1643 **RESTORES IN PLACE**: each span is two pieces (its halves, with their gates); fallen it is snapped in the middle and each half HANGS from its own end like a cut rope bridge, rails, flag line and bunting gone, no walk, the zips dead; restored the halves swing home, colour and lamps back, the zips live; mint plate under the first span |  |  |
| Cliff Lodge | m1648 HERO look: kit timber, warm plaster, a tiled roof, kit lamps; bunting under the lodge's front eave, kit lanterns on posts at the foot of the path, 34 plants round the crag (off the path and the pool); merged (53 meshes, 45 children); COLLIDER AUDIT: the crag's jitter was inward-only to .45 m, so its box stood up to .45 proud of the drawn rock -- now +-.15 about the face | m1649 **RESTORES IN PLACE**: the crag, path and pines stay; the lodge walls, the roof, the perch, the boulder cradle and the foot lanterns are pieces (fallen: the lodge leans, its roof slid onto the summit, the perch hangs off the face, cradle and lanterns tipped); fallen the waterfall is DRY, no boulder rolls, the lever is dead, cables and drone gone; mint plate by the path's foot | m1652 THE SHORTCUT: a 12 m ROPE LADDER from the ground straight up to the perch's tip (outside the path's lane; it rides the perch, gone while fallen), a doubloon on the perch tip, one on each of the three landings |  |
| Moated Keep | m1653 ENEMY look, classical: sandstone-block curb, island and steps, white plaster keep over a BLACK lacquer skirt with a gold band, black corner posts (now solid: they are drawn) with gold caps, a black-tile turret roof with a gold finial and eave tips, the oni mask in black/gold/mint, emblem banners on three faces and the roof poles, two mint braziers on the curb, two SPHINXES at the curb steps, a gold gong; merged (164 meshes) | m1654 DESTRUCTIBLE TO THE GROUND: a Jinra SEAM low on the north, south and east faces (6 blows: that wall slumps outward off the island); two walls down drops the roof into the keep with the sentry gun; all three cut and the door wall follows -- RAZED, Jinra spills; the curb, island, stair, sphinxes, gong, drawbridge and eel stay | m1657 THE EAVE BELT: a black-tile PENT ROOF round the keep at the skirt top (a 2.0 m jump from the island's rim), split over the door, walkable all round; gold tips and band; a doubloon on each corner; GRAPPLE RINGS over the north and south runs swing you onto the merlons; each run, ring and coin goes with its wall. (Fixed in the shared kit: a ride's walk tris wiped the rest of the walk store, and a downward-wound set was dropped whole -- the Hangar's roof walk had 0 tris since m1636) |  |
| Robot Barracks | m1659 ENEMY look (ENEMY_STYLE "BARRACKS"): sandstone-block walls, a black-tile roof with a gold ridge, curled finials and eave tips, a VERANDA of black pillars with gold bands along the front (solid: drawn posts), mint lanterns hung along the eave, the robots now terracotta constructs in black lacquer and gold, black emblem nobori, a black taiko with gold hoops, two mint braziers at the yard's far corners; merged (109 meshes) | m1663 DESTRUCTIBLE TO THE GROUND: the six veranda PILLARS are the keystones (3 blows: a cut pillar topples into the yard); four cut and the ROOF comes down into the hall (lanterns and door lintel with it), the last pillars topple, and every standing chunk and stone end post of the hall's walls goes, staggered -- razed to its bunks; yard, dais, dummies and robots stay | m1664 THE YAGURA: a black watch tower off the yard's north-west corner -- a railed plank platform at 5 m (each deck and rail its box), a ladder up the yard face, a black-tile hip roof with a gold finial and a mint lantern; an ARCHER posted on it over the yard, a doubloon on the deck; it topples outward with the barracks' roof (the ladder and coin go, the archer falls) |  |
| Jin Lighthouse | m1666 HERO look: painted timber, warm stone block, kit bronze, the kit red cloth on the nobori, kit lamps, the Jin in true mint (crystal, beam, runes; it was cyan); red-and-cream bunting from the roof's corners up to the shaft, 28 plants round the foot (ramp kept clear); merged (68 meshes); COLLIDER AUDIT: the round shaft, lantern drum and crank drum had full-square boxes (to .52 m of air at the shaft's top corners) -- crossed pairs now; the gallery rail boxes .5 -> .3 |  |  |  |
| Floating Islands |  |  |  |  |
| Ninja Pillars |  |  |  |  |
| Senbon Torii |  |  |  |  |
| Siege Yard |  |  |  |  |
| Teahouse Garden |  |  |  |  |
| Kneeling Colossus |  |  |  |  |
| Oni Gate |  |  |  |  |
| Jin Observatory |  |  |  |  |
| Lantern Festival Street |  |  |  |  |
| White Heron Castle |  |  |  |  |
| The Courtyard |  |  |  |  |
| Mega Wall |  |  |  |  |
| Sky Wreck |  |  |  |  |
| Octagonal Block Pagoda |  |  |  |  |
| Timber Siege Fort |  |  |  |  |

## THE DRAGON RIDE (his, Oct 28 2026; KORAJIN.md THE BLUE DRAGON) -- a test zone, then the dojo
- [ ] a sandbox: the blue dragon, tame (a Jinra offering), mount, ride on the ground, take off, fly (RollerGirl's wingsuit model), land
- [ ] fireballs from the saddle; Grumbo's gun while riding
- [x] **dressing pass 1 (m1519):** on HIS bones, measured by raycasts on his skinned mesh: a saddle (seat, pommel, cantle, red blanket with a gold edge, stirrups), a gold collar with a glowing Jinra ring and tag, gold bands on the forearms and calves, our red cape with the nested-diamond crest. TOOLS > DRAGON: CAPTURED / WILD
- [x] **dressing pass 2 (m1610, DRAGON.md):** in its own zone (KORAJIN > The Dragon Ride): head plate, bridle and live reins, cantle and saddle lames, pauldrons, crest chest plate, neck and tail plates, tail rings and blade; an EVIL set in blackened iron with stolen red Jinra; CAPTURED / EVIL / BARE live on TOOLS > DRAGON. The sandbox's checklist is DRAGON.md now
- [ ] needs from him: a fly cycle (and any riding clips)

## THE DOJO (his, after m1390) -- the arena becomes the floating samurai dojo; many passes

> *"Start making the arena the dojo, more in line with the game aesthetic: our texture maps, our architecture -- take reference from his home and the
> flying ship. More Japanese, more samurai, more flying: flags, hovering platforms, without obstructing. Clear the space entirely (stuff available to
> spawn in); little altars on the sides up high -- the triple-sword altars -- flags on the other corners, 90 degrees round the circle; instead of a
> stadium, big decorative architecture, the Japanese roofs with that layering."*

- **Where:** KORAJIN > The Arena (`?w=arena`). `?arena=lab` brings the old stadium back.
- [x] **pass 1 (m1394):**
  - a floating timber disc ringed in red lacquer on a stone dais, with a red-post rail and a rock root below
  - a sea of cloud under the Ship's sunrise sky
  - TWO SWORD ALTARS hovering high (N/S: three katanas on a rack under a two-tier roof, lanterns) and TWO BANNER MASTS (E/W: waving red chevron cloth)
  - FOUR PAGODAS on floating rocks on the diagonals (three tiers, upturned eaves, red fascias)
  - seven drifting stone platforms
  - the middle CLEARED (no cover walls); everything still spawns from SPAWN
  - a boss enters by the beam
- [x] **pass 2 (m1400):**
  - four red TORII on the diagonals at the rim, framing the pagodas (curved black kasagi, nuki, gold plaque, stone feet)
  - LANTERN STRINGS sagging from each banner mast to the torii beside it
  - SOFFITS under every roof, and lanterns at the pagodas' lower eave corners
  - a MITSUDOMOE crest (red, in a gold ring) inlaid at the centre
  - PINK PETALS drifting on the wind
  - the vending machine no longer stands in the dojo at the start (VEND still places one)
- [x] **pass 3 (m1402):**
  - OFF THE EDGE: fall off the platform and you're put back at your pad
  - the altars REACHABLE: three floating stones from an opening in the rim up to each altar, and the altar disc is a floor
  - the seven drifting platforms are STANDABLE and carry you
  - `npm run check` now boots the arena and forge too (`check:worlds`)
- [x] **pass 4 (m1407): NO MORE CONES.** Every floating rock is a `floatIsland` (shared, see NOTES):
  - an irregular, notched outline
  - a grass/dirt top
  - a cliff band, then lobed undersides cracked and banded in strata, with moss at the rim
  - dressed with cherry and pine trees, boulders, shrubs and hanging roots
  - the platform's own island, the altars', the stepping stones', the pagodas' and the drifting platforms', plus twelve art-directed scenery masses (two great ones, a chain of medium, small rocks)
- [x] **pass 5 (m1410): HIS VOCABULARY, not borrowed Japanese** (ARCHITECTURE.md):
  - the pagodas become HERO HALLS: sandstone domes, the red-and-cream tent cone, bronze stacks, a brass wheel, a scaffold front with an awning and box lanterns, bunting, a banner, portholes, the crane and orb
  - the torii become timber-and-iron GATES with wheels, banners and lanterns
  - the paper-lantern strings become BUNTING
  - the altars get tent canopies
  - the floor crest is the ship's SQUARE SPIRAL
- [x] **pass 6 (m1413):** three hero-kit sky junks circling (red-banded hulls, square-spiral sails, bronze thrusters, lanterns) and the first SKY WHALE (lathed, undulating, under the disc). Still open from this line: his ship, the manta, the serpent-dragon, waterfalls
- [x] **pass 7 (m1417):** the weave: a five-tier HERITAGE PAGODA on the great west island (his: classical and the hero kit both exist), WATERFALLS off both great islands, and the second creature, a SKY MANTA that flaps and banks between the islands. Still open: his ship, the serpent-dragon
- [x] **pass 8 (m1419, his: atmosphere):** big fluffy cumulus banks, god rays down the sun's line, ~70 rising paper sky-lanterns, gold and cyan fairy flecks over the floor, a sun glow, and broken-up glowing fog (noise-eaten cards, peach toward the sun, lavender away). One draw per layer
- [x] **pass 9 (m1422, his: THE JIN GLOW):** the mint Jin essence (KORAJIN.md): 30 floating JIN CANDLES round the rim, the pagoda island's spring pours Jin, and the katana's trail is Jin and sheds motes (TOOLS > TRAIL)
- [x] **pass 13 (m1455, his: *"my flying ship slowly traversing the islands, and reach it"*):** THE FLAGSHIP route: a wide cruise round the islands, in to the north altar, parked broadside 25 s with its deck level with the altar's disc (jump across), then out, carrying you; a 4th escort junk, and the escorts get bowsprits, masthead pennants, bunting and stern lanterns. **Stand-in hull (a junk x3) until Worker A's `shipModel()` lands**
- [x] **pass 15 (m1462, his: VERTICALITY, now a standing rule in CLAUDE.md):** the four halls at four heights (-12, +9, -3, +17); five escort junks from 35 m below to 85 m above, each climbing and diving; the flagship's cruise far out (r 170-250, y 16-68), and it docks at a stone PIER 60 m north and 19 m UP, reached by a SKY STAIR of ten floating stones that curves up from the north altar
- [x] **pass 17 (m1473):** HIS SHIP flies the dojo route -- Worker A's `shipModel()`: his textured ship, all 165 solid boxes riding with it as turned dynamic boxes (walk its decks and castles while it flies), its banners' cloth alive; docks at the high pier. (The junk stand-in remains only as the fallback.)
- [x] **pass 18 (m1502, his: THE ENEMY):** JINRA WISPS in the fight: a cut limb SEEPS Jinra from the break, a knock-out or a death BURSTS it from the chest; the wisps rise, hang, then home to you and are collected (`JINRA.n`, saved)
- [ ] pass 6b (his, after m1403):
  - the scene: his SHIP in the background, smaller flying ships, AIR CREATURES (one at a time: an alien whale, a manta, a serpent-dragon), and waterfalls off the big islands
- [x] **pass 10 (m1430):** the gates are ENTRANCES. A floating stone landing outside each gate, a timber bridge, and the rail open there. A boss arrives on a landing in a burst of Jin, crosses, walks in through the gate, taunts and leaps in (TOOLS > ENTRY: DOORS; BEAM is the old drop-in)
- [ ] pass 8 (rest):
  - ~~the gates as ENTRANCES~~: bosses walk in through a torii (a DOORS entry for the dojo)
  - ~~something AT the altars~~ -> **pass 11 (m1434):** step onto an altar and it ANSWERS: the bronze wind-chime swings and rings, a Jin ring rises off the disc, a glint runs the top blade, the katana comes out, and the blade is Jin-blessed for 20 s (4x the motes). It re-arms when you step off
  - (was) something AT the altars: take a katana from the rack, a chime, a glint on the blade
  - lit lanterns at dusk
- [x] **pass 12 (m1440):** TRAINING MARKS painted on the floor: stance footprints in a ring, chalk drill rings, dark scuff swirls, four numbered start marks (一 to 四) by the gates
- [x] **pass 14 (m1460):** BIRDS: a flock of 30 swallows darting between the islands (banking into turns), and a V of 7 red-crowned cranes gliding a slow wide circle
- [x] **pass 16 (m1465):** the cloud cards no longer read as cotton balls: shaded by HEIGHT IN THE BANK (a flat dark base to lit tops), twice the puffs and smaller, soft overlapping edges
- [x] **pass 21 (m1545): THE CLOUDS MOVE UNDER YOU.** 46 loose wisps 8-34 m under the floor blown along the wind (+x, 2.4 m/s) and wrapped where they have faded, so the dojo's rock root cuts through moving mist; the cumulus banks turn slowly round the dojo (low ones fastest); the cloud sea drifts ~1 m/s (was .33)
- [x] **pass 19 (m1531): THE TRAINING DOJO, part 1.** Two WEAPON RACKS on the dais (E: the SWORD, W: the GUN, a practice staff below): walk up and you take it, the pegs empty; walk back holding it and you put it back. Four STRAW TARGETS rise from bronze hatches: three blows and one sinks in straw, pops back up after 3 s; drop all four together and a gold doubloon rises at the centre; they all SINK while a fight is on
- [x] **pass 20 (m1537):** SHOTS HIT THE TARGETS: a bolt stops in the straw (one blow, knocked the way it flew), a rocket drops one outright (`dojoShot` in `stepBolts`)
- [ ] later: a sparring master, the music

## THE ELEMENTS (his, after m1382) -- sandboxes for water, snow and air

> *"Half of a video game is the visual. One thing that would be super fun is a convincingly good snow simulation: you're trudging through the snow, the
> tracks, the snow piles up, but there's also snow in the air, bouncing off your character, fluttering -- super elegant, beautiful... We're gonna have a
> few water simulations, a lot of air -- floating buildings, floating zeppelins. I want to get these different elements going."*

- **WATER:** THE SHIP's sea (Worker A's track above).
- **SNOW: KORAJIN > The Snowfield** (`?w=forge&zone=snow`).
  - [x] **pass 1 (m1384):** the deformable pack, the flakes, and the drag:
    - knee-deep snow on a 640² depth map, displaced in the shader
    - feet carve tracks, the body ploughs, rolls and landings dig craters, rims pile up, and snow falls back in
    - hollows tint blue, and sparkles twinkle as you move
    - deep snow drags at you
    - 5000 flakes flutter in a gusting wind and BOUNCE off his body
    - footsteps and landings kick up puffs
  - **HIS (Oct 28 2026, first time in it): *"that might be my favorite thing of all time. I love the snow. Expand on that, expand on that, expand on
    that -- maybe that's where you find the dragon. A snow dragon."*** It is a REGION now, not a test patch: the passes below, then a snow world
    with height (VERTICALITY: ice shelves, a frozen waterfall, a cliff cave) where the SNOW DRAGON's lair is.
  - [x] **the katana vanished (really fixed m1650):** a shader PROGRAM-CACHE collision -- the snow ground's displacing shader, unkeyed,
    was handed to the blade and grip and squashed them into the snow (m1628/m1634/m1640's guesses superseded). Weapon snow-cutting removed.
  - [x] **pass 2a (m1632):** WIND-SHAPED DRIFTS and banks (the pack's resting depth is a field stretched along the wind, up to ~1 m; the refill
    returns to it; deeper drags harder), SNOWY PINES in seven stands (46, 3 draws) that DROP their snow when struck or slammed into (powder, a thud;
    the caps grow back over half a minute), and his BREATH fogging every ~1.6 s (quicker as he runs)
  - [x] **THE JIN WILLOW, garden pass 1 (m1743)** -- his: *"a cool alien weeping willow with vines you can brush through, like actual chains;
    a big magical Japanese garden; in the snow level for now."* At (-24, -22): a stone terrace (22 m, 1.2 m up four .3 m steps), raked-snow
    rings, two stone lanterns with glowing fireboxes, and a 14 m twisted willow whose ~310 vines are VERLET CHAINS -- wind, gusts, and he
    parts them as he walks through (one draw for all of them, Jinra-mint tips). `WILLOW`.
    - [ ] garden pass 2: a koi pond under the curtain (ice at the rim), an arched bridge, stepping stones, a stone basin, moss on the walls
    - [ ] the vines: the katana CUTS them (the cut end falls and fades; they grow back), and he can CLIMB / swing on a vine
    - [ ] drifting Jinra motes round the canopy at night; a second smaller willow; snow sliding off the boughs when the tree is struck
  - [ ] pass 2 (rest):
    - snow that SETTLES on him (his shoulders and head whiten while he stands, shaken off when he moves)
    - his breath fogs
    - drifts and banks with varied depth (wind-shaped), a frozen pond to slide on, and pines that drop their snow when you hit them
    - the sound of crunching
  - [ ] pass 3:
    - wind-blown spindrift sheets along the ground
    - a blizzard that comes and goes
    - deep powder you sink into (to the waist) and dive through
    - footprints that read as real prints (heel and toe)
- **AIR:** (later) floating islands, zeppelins and wind currents to ride.

## GRUMBO'S HOME, PROCEDURAL (his, after m1376) -- its own track, many passes
**HIS RULE (after m1429): every element gets a MINIMUM OF THREE PASSES** (*"we'll do a few passes on everything we do. Minimum 3 passes, max a million"*). The tally so far: the house 1-17 (many), the rocks 18, 22 (2 of 3), the pier and canoe 19, 21, 24 (3 of 3), the plants and ground 20, 23 (2 of 3), the paths 25 (1 of 3).

> *"These are the images I used to make the Tripo model of his home, but building it procedurally is going to be better, so we can go inside and add
> stuff and it's all in the same game style. Dedicate one of the context windows to it; a ton of passes to make it really cool, as true to the design
> as we can be."*

- **References:** `images/korajin/ref/grumbo_home_1..4.jpg` (four views).
  - **The shape:** a cluster of rounded cream sandstone domes and towers with purple spots and round windows, on a boulder mound with cacti and succulents.
  - **On top:** a red-and-cream tent cone on a timber frame with brass ship's wheels; a bronze stack/chimney on either side; a balcony tower with a red canopy (one side); a timber crane with a hanging brass orb and red tassel (the other side).
  - **Round the base:** timber scaffold frames with red chevron/diamond banners and torn awnings; lantern-lit market stalls of pots and crates; wooden steps up to an open shop front and a round door; a ladder; a ramp.
- **Where:** it replaces the GLB hut in THE RED HOLLOWS (`HOME.hut`, `models/buildings/korajin_bld_01.glb`, at [0, -7]), with a switch to compare against the GLB.
- **Passes:** the massing and walkable shell first, with an INSIDE (a room with the shop front and his quarters, stairs up to the balcony); then the timber frame, awnings and banners; then the crane, tent, wheels and stacks; then the dressing (pots, lanterns, cacti); then the look (materials, and textures when the texture maps exist).
- **Textures:** OpenAI image generation is reachable (the key is the environment's), but the account is OUT OF CREDITS (`credit_balance_exhausted`, m1376). When he tops it up: tileable wood, sandstone, stone, marble, metal and red cloth.
- **Built in code: `GHOME` / `ghomeBuild` (WORKER B).** It replaces the GLB in the Red Hollows. `?hut=glb` brings the Tripo model back to compare.
  - [x] **pass 1 (m1380):** the massing and the walkable shell, with an inside:
    - the boulder mound and its steps (.30 risers);
    - the HALL: the shop front, the round back door, a screen wall between the shop and his quarters, a counter, a bed, a table;
    - the balcony TOWER: a spiral stair inside (.30 risers) up to a railed balcony on a mushroom ledge;
    - the STORE wing;
    - round windows; the sandstone's cream, speckle and purple spots as vertex colour.
  - [x] **pass 2 (m1383):** the timber scaffold (iron-banded posts, beams, braces), two stall decks under sagging torn awnings (walkable), the big V-hemmed chevron banner and four post banners, a ladder up the store to its dome, the long ramp off the right deck
  - [x] **pass 3 (m1385):** the tent cone (eight panels on a banded drum, poles crossing past the apex, a stacked finial), four brass ship's wheels, two bronze stacks, the crane with its brass orb, red tassel and weights, the balcony canopy, the tower's flag
  - [x] **pass 4 (m1387):** the dressing -- pot-heaped stall racks and crates, rows of glowing lanterns and brass bells under the beams, the shop's lit shelves and a warm light, saguaros, prickly pears and agaves round the mound, more boulders
  - [x] **pass 5 (m1388):** the look -- main's tileable sandstone (triplanar) on every shell and boulder, timber and planks, the walls lathed to BULGE, timber floors inside, the flag turned to the front
  - [x] **pass 6 (m1390):** life -- the banners, flag and awnings flutter in the wind (vertex shader, most at the hem), the crane's orb swings on its chain
  - [x] **pass 7 (m1392):** the shapes -- the tower steps in to a turret at the balcony (a walkable shoulder), a squatter hall under the cone, timber bands at the domes, red tassels
  - [x] **pass 8 (m1395):** his quarters lived in -- a bed with a red blanket, a woven rug, a brazier of glowing coals with its own light, his katana on a rack, a chest, a table and stools; the store stacked with barrels, sacks and crates; the screen wall moved forward to give the quarters room
  - [x] **pass 9 (m1396):** the refs' two smaller blob domes (front-right, back-left) with round windows; the round back door's real leaves (`bgateMake`: open as he comes near, shut behind); lanterns at the back door and on the balcony
  - [x] **pass 10 (m1397):** the rigging -- sagging ropes from the cone's poles to the frame, the stacks, the tower and the crane; a red-and-cream pennant line from the tower's flagpole to the cone; iron-strapped timber cladding over the shop front
  - [x] **pass 11 (m1398):** the windows -- every round window sunk in a lavender surround, and more of them round the hall, the store, the tower and the turret; the turret's LOOKOUT (a brass telescope at its window, cushions)
  - [x] **pass 12 (m1401):** smoke from both stacks (one point cloud, puffs rising, drifting, dying), the shop and brazier lights flicker
  - [x] **pass 13 (m1405):** one shared bronze / glow / red across the passes (33 -> 26 draws); the iron GEARBOX under the big wheel with a brass cog above it; the low SIGNBOARD on two posts at the front-left (ref 1)
  - [x] **pass 14 (m1406):** blows reach the home (main's m1403 hook): the back door breaks and mends, the orb is knocked swinging (a real pendulum now -- its sway had been inside a comment since pass 9), each stall bell rings
  - [x] **pass 15 (m1408):** THE BACK (ref 2): an iron-studded timber belt round the hall's back half with two brass wheels and two plaques on it, the big chevron banner and a narrow one, red tassels, the back door framed in timber under a round arch
  - [x] **pass 16 (m1412):** BREAK UP THE STONE (his note on the back view): a torn red hood and a timber sill on every round window, a timber cage of ribs on the tower's drum, the turret and the store, studded timber straps over all three domes, plank eaves where the hall and the store meet their domes
  - [x] **pass 17 (m1415):** RAISE / LOWER: strike the crane's winch and the orb is paid out on a cable down to head height (1.7 m/s, a thud as it arrives, the pendulum lengthens with it); strike it again and it winds back up
  - [x] **pass 18 (m1421):** ROCKS, NOT EGGS (his note): every boulder round the mound and the valley's red boulders and hoodoos rebuilt by `ghRockGeo` -- noise-pushed, flat-topped, sunk, cut with strata, leaning; the home's in clusters (a big stone, smaller ones leaning on it, pebbles)
  - [x] **pass 19 (m1424):** THE FISHING PIER (his ask): straight out from the shop steps, planks following the bank down then level over the stream, posts to the bed, a rail, a T-head mid-stream with lantern posts, a stool, a bait barrel, rope coils and a rod with its line and float; his ALIEN CANOE moored alongside (upswept prow and stern, brass gunwales, swept fins and a tail fin, lavender runes, two glowing hover discs), riding the waves
  - [x] **pass 20 (m1429):** PLANTS AND GROUND (his ask): low sandstone shelves half-buried round the home (flat ground only), and a planting thinning out from the mound -- sagebrush, golden grass, yuccas with cream flower spikes, lavender alien bulbs on curling stalks -- with reeds and cattails along the waterline
  - [x] **pass 21 (m1432):** THE PIER AND CANOE, second pass: weathered planks (mixed timber, each a little off, one missing), X-braces and bracing under the deck, bollards, a ladder into the water, a fish drying rack and a crate of fish, a BELL at the pier's foot that rings, a fish that leaps off the T-head now and then; the canoe gets a brass engine pod with a glowing exhaust, a prow lantern, a furled wing-sail on a mast, a basket and a rug, breathing runes, and it ROCKS when struck
  - [x] **pass 22 (m1436):** THE ROCKS, second pass: their own desert-sandstone colour (`ghStrata`, per vertex) instead of the house's stone -- rust / ochre / cream strata bands that stay level across neighbours, dark varnish streaks down the steep faces, sun-bleached tops, speckle; the valley's boulders and hoodoos take it too
  - [x] **pass 23 (m1442):** THE PLANTS, second pass: the grass and reeds SWAY in the wind (a per-blade height attribute drives the shader), fuller drifts of golden grass, gravel patches of sandstone chips, and a TUMBLEWEED that rolls and hops along the beach every so often
  - [x] **pass 24 (m1443):** THE PIER AND CANOE, third pass: the hung catch slimmed into fish (tails, eyes), a red cloth canopy over the T-head's shore half, a fishing net draped over the rail with floats; every 18-38 s the CANOE LIFTS half a metre on its discs, hangs dripping with its runes blazing, and settles with a splash. **Also fixes m1442, which threw on every frame in the home** (see NOTES)
  - [x] **pass 25 (next tick):** PATHS AND TRAILS (his ask): worn tracks of trodden sand with footprints and pebbled edges -- shop steps to the pier and along the strip under the stalls, round both sides of the mound to the back door, out to the two cave mouths, and up and down the bank; every rock, cactus, shelf and plant keeps off them
  - [x] **pass 28 (m1543):** the stall SHUTTERS (his queue): a roll-up tin curtain on each stall's front, from a drum under the outer beam down to the deck, between iron guides; strike one and it rolls up or down (solid while down). FALLEN they are down and stuck (a blow only rattles them), RESTORED up, and the show rolls them up as it ends. They fall with their stall
  - [x] **pass 29 (m1547):** the ROPE LIFT (his queue): a railed plank cage on two ropes from a timber gantry out of the turret with a brass pulley, outside the balcony's east edge (a gap in its rail); stand on it and it rides to the other end, walk up to it at either end and it comes to you; it carries him. FALLEN it lies tilted at the foot, ropes gone
  - [x] **pass 30 (m1550):** BREAKABLE POTS (his queue): all 145 pots (the stall shelves, the decks, the shop's shelves and counter, the planters) break at a blow -- a clay burst and a crack, the big ones lose their collider -- and are back 25 s later unless he stands on the spot. No new draws: each pot is a vertex range of its merged bucket
  - [x] **pass 31 (m1553):** THE ROCKS, third pass: some big stones are SPLIT (two halves leaning apart along a crack), some carry a flat CAP slab, the big ones are finer, and every cluster sits in a soft DRIFT of blown sand (the paths' look, one draw)
  - [x] **pass 32 (m1557):** THE PLANTS, third pass: 134 SHRUBS CLINGING TO THE CANYON WALLS from 3 to 34 m over the floor, 57 of them trailing leafy VINES down the rock, the odd lavender bulb hanging off a ledge; and 50 clumps of DESERT FLOWERS (cream and orange) through the grass round the mound
  - [ ] then more passes, each one closer to the four views
  - **Still open on the home** (agreed after m1459): ~~the shop SHUTTERS~~ (pass 28), ~~the rope LIFT~~ (pass 29), ~~BREAKABLE pots~~ (pass 30), ~~the rocks' 3rd pass~~ (pass 31), ~~the plants' 3rd pass with
    cliff shrubs~~ (pass 32), the rope LIFT to the balcony, BREAKABLE pots, the back ladder and stall rack (ref 2) -- then his sign-off.

## THE RED HOLLOWS: POLISH FIRST (his, after m1760) -- detail passes, weight, and getting around; THEN the sky castle
*"There's a lot of stuff that needs to be done... a detail pass... it was chugging, maybe 20 fps... optimization... I want to keep building
too, but it seems like it's getting heavy."* And (after m1765): *"after we're done with the detail passes and optimization and the logistical
-- walking, connecting towers and bridges and stairs -- start building [the sky castle]."* So this track goes FIRST, in this order:
- [x] **collision from the side (m1763):** no walking into cliffs or rocks (`hwTerrainOut`), the ledge grab ignores terrain columns, rocks solid
- [x] **cave chest + crystals (m1763):** turned to face the mouth, detail pass; crystals instead of cones
- [x] **floating lanterns (m1765):** paper lanterns, halo, fairy dust
- [x] **the cave BEAST's detail pass (m1768):** an armoured cave salamander -- segments, plates, back crystals, legs and claws, a curled tail, a head with horns and a jaw that opens
- [ ] the cave plants' second pass (mushrooms, moss, glow worms)
- [ ] the LADDERS' top-out (he fell getting off the top of one); every stair he can sink into
- [ ] WEIGHT: a measured budget for the Hollows (spawn view 0.88M tris / 239 calls at m1763) -- the home's timber, shared materials, 171
      shader programs, shadow casters, distance culling of the far places; measured every build after
- [ ] GETTING AROUND: every tower, bridge, stair and ladder leads somewhere and joins up; a walk from the spawn to every place, tested headless

## THE SKY CASTLE (his, after m1765) -- the next HERO building, high over the Red Hollows, on its own big landmass
His sheet: `images/korajin/ref/sky_castle_sheet.jpg` (front / right / back / left / top-down / bottom / architecture / bridge / rock
details) and `sky_castle_front|under|left|right.jpg`. A cream-stone castle of round towers with red tiled cone roofs and gold finials, a
tall central keep, red banners with the white diamond, sail awnings, bonsai trees, a wooden water-wheel, railed walkways and arched bridges
out to satellite towers; on a huge island of chunky cream rock in hanging lobes, ivy and moss over its lip, TWO big waterfalls pouring off
the front, iron-and-brass lantern spires and chains hanging under it, and small satellite islets (each with a little pagoda shrine and
greenery) drifting round it on chains and lanterns. *"It's gonna need its own pretty large landmass... a few passes on the landmass...
then start building the building, kinda like you built his home -- a ton of passes."*
- [x] **landmass pass 1 (m1769):** main lobe r30 + 7 bastions + 20 pendants, cream rock map, green caps, the paved plaza, two 70 m waterfalls; GOD > GO: SKY CASTLE
- [x] **landmass pass 2a (m1774):** lip rocks and moss over every rim, ivy curtains, the falls moved into the gaps between bastions
- [x] **landmass pass 3 (m1775):** seven iron-and-brass lantern spires and twelve chained lanterns hanging from the real underside
- [ ] landmass pass 2: the rock's face (its own cream rock map), ivy and moss over the lip, hanging chains and lantern spires, the bottom
- [x] **pass 3 (m1778):** nine bobbing satellite islets, seven octagonal pagoda shrines, chains to the rim
- [ ] (rest of) landmass pass 3: the satellite islets with their pagoda shrines, chained and drifting; how he GETS UP there
- [x] **castle pass 1 (m1781):** the hall (door, windows, crenellations, roof terrace) and the keep (windows, balcony, red tiled bell roof, gold spire, his banner)
- [x] **castle pass 2 (m1783):** seven bastion towers at different heights with red tiled roofs, crenellated curtain walls between them
- [x] **castle pass 3 (m1785):** banners on the towers, sail awnings from the keep, bonsai trees, two arched bridges over the runnels
- [x] **style pass 1 (m1786):** the home's materials (pocked sandstone, timber, bronze, ragged cloth), timber frames on every round body, bronze wheels, home-style awnings
- [x] style pass 2 (m1787): ROOFS the home's way on some towers (his red/cream cloth cone with timber poles poking out, iron bands), brass CHIMNEYS on the hall
- [x] style pass 3 (m1788): CLUTTER and life -- pots on shelves under the awnings, crates, barrels, lantern posts, stone lanterns, bells, cacti and agaves
- [x] style pass 4 (m1789): the home's CRANE with its hanging brass ball and banner, BUNTING strung between the towers, flags on poles
- [x] style pass 5 (m1790): the home's SHAPES -- walls that bulge (lathe bellies, not straight cylinders), round boulders round the bases
- [x] style pass 6 (m1791): timber SCAFFOLDING, galleries and plank walkways off the towers (the key art)
- [x] style pass 7 (m1792): the shrines in the home's language, chimney smoke, the keep ladder climbable to a walkable balcony
- [x] **FALLEN (m1795):** crashed on the plateau, weathered; the live turn raises it; colliders follow
- [x] (m1796) the crane's orb swings; FALLEN rubble ring
- [x] (m1797) broken towers in the FALLEN pose
- [x] (m1799) the hall's interior: a throne room through open doors
- [x] (m1801) the keep's interior: a spiral stair from the throne room to the balcony
- [x] (m1803) the rubble solid; the brazier's fire
- [x] (m1804) two satellite shrines reachable by rope bridges; islets ride their bob
- [x] (m1807) the gallery towers hollow, spiral stairs out onto their galleries
- [x] (m1808) a ring of rope bridges to every islet
- [x] (m1814) eight calm samurai guards: doors, throne, rounds, lift, balcony
- [x] (m1819) every tower has a room: armoury, library, storeroom, bunk room
- [ ] townsfolk (non-fighters) on the lawns
- [x] **the way UP (m1794):** the Jinra lift -- bridge, gantry, a bronze cage on rails from the plateau; plaza steps, interiors, the FALLEN state, wide sails, colliders that follow the live turn
- [ ] castle pass 1..N: the keep, the round towers and roofs, the walls and walkways, the bridges to the satellites, banners, awnings,
      the water-wheel, trees, interiors -- as many passes as the home had; FALLEN / RESTORED like every Red Hollows piece

## THE RED HOLLOWS' SKY AND WATER (his, after m1557: "work on the water shader, and apply the HDR from the other window")
The "HDR" is the dojo's PANO (`textures/sky_sunset_02.webp`, 8-bit, 1774 x 887 -- no .hdr/.exr is in the repo; a real one would give the IBL a sun).
- [x] **pass 1 (next build):** the PANO is the valley's sky dome, the water's reflection (soft), the fog's horizon, the image light and the lights' tint; turned so its sun sits on the valley's sun; TOOLS > HOLLOWS SKY cycles PANO / FIRE / PAINTED. The stream FLOWS (its ripples drift downstream, +z) with foam streaks along the flow in the shallows
- **DONE WHEN:**
  - [ ] the water reads as a river from the home, the pier and the mill (flow, depth colour, foam at rocks, the pier's legs, the mill's pour)
  - [ ] the sky is his pick on the phone (PANO / FIRE / PAINTED), and a real .hdr if he wants the sun in the bounce light
  - [ ] his sign-off on the phone

## FALLEN / RESTORED (his, after m1495; KORAJIN.md "THE RESTORATION") -- every Red Hollows piece has two states, default FALLEN
*"Everything's gonna be fallen."* One build, one switch, and it is **main's `AGE` (m1501)**: **SPAWN > BUILDINGS > STATE** (in the Red Hollows it reloads), saved as `mel.age`, **FALLEN unless RESTORED was chosen**; `?hs=restored|fallen` for a look.
- [x] **pass 1 (m1508):** the state (`hsF()` reads `AGE.st`), and `hsFallen(g)` (main's `bldAge`) weathering every material of the home, the merchant, the mill,
  the peak and the refinery (desaturated to dust, metal to rust, every glow out, glass emptied); FALLEN: the home's fires and lights out and
  no smoke, the mill's wheel and sails still, no water poured; the lookout's brazier cold; the Jinra refinery NOT afloat: sunk on the
  mountain's flank (40 m), no Jinra fall, no motes, no floating stones. RESTORED is everything as built.
- **His clarification (after m1508):** restoration is NOT every building flying. Most REVIVE in place (pieces fly back, colour floods back,
  glow and machines come on); whole CHUNKS OF EARTH break off and float with what stands on them; ship-like buildings fly. So: the home, the
  mill and the merchant revive; the Jinra refinery's piece of mountain is the earth chunk that lifts.
- [x] **the home, live (m1509):** ONE set of pieces, animated by main's RESTORE kit -- nine chunks (hall, crown, tower, turret, store,
  both stalls, the front frame, the crane) slumped, tilted and toppled when FALLEN; step on the MINT PLATE by the steps and they fly home
  one after another, the colour comes back, the lanterns light and the smoke starts (step again: it falls). Still one draw per look.
- [x] **the home, pass 2 (m1527):** FALLEN drains the paint in the shader (desaturated, dusted, darkened, the pier and plants with it) and the show FLOODS it back; a mint Jinra burst and a thud as each piece lands; mint motes swirling up round him while it plays; the plate breathes while it is ready
- [x] **the mill, live (m1530):** the same method, now SHARED (`rsTag` / `rsChunkRig` / `rsChunkSync`): seven chunks (the base, the tower's two halves, the top, both balconies, the stair) plus the WHEEL and the ROTOR on their own holders. FALLEN: the upper tower snapped and leaning, the top and its sails crashed down beside the base, the balconies hanging, the wheel tilted and dry, no water; a mint plate on the island at the stepping stones. The show rebuilds it from the bottom up, the wheel and the sails start once it is whole, and the water pours MINT (it runs on Jinra)
- [x] **the merchant, live (m1533):** eight chunks on the shared rig -- FALLEN: the deck sagging and tilted, the ground floor slumped, the upper storey slid off sideways, both BONE ARCHES toppled, the red SAIL collapsed over the shop, the banner pole down, the palm fans drooped; a mint plate on the deck by the back steps plays the show. (The merchant waking into a Jin needs a merchant first.)
- [x] **the refinery, live (m1536):** its CHUNK OF MOUNTAIN is the piece that moves (his: the ground breaks off and goes up, the building does not fly on jets): FALLEN it sits on the peak's flank at ~41 m, rusted and drained; a mint plate at its door plays the show and the whole island tears loose and rises over 10 s to 124 m, colour flooding back, and the ring of stepping stones from the lookout only appears once it is up. Its colliders swap between the grounded set and the sky set (the kit cannot carry colliders on a lift yet)
- [ ] pass 2: real ruin in FALLEN (broken and missing boards, torn cloth, rust streaks, collapsed bits, dust) and the RESTORED extras
  (the stream glowing mint, the mill turning on Jinra, the floating pieces bobbing, warm lanterns)
- [ ] pass 3: the TURN between them as a moment (the restoration happening, not a reload), when he says how it is earned

## VERTICALITY (his rule, after m1459) -- for every building and level from here
*"I'm constantly fighting with you about verticality... you build everything on the same plane, and when I ask for something up in the
air it's 10 or 20 feet up when I'm talking 50 or 100."* So: **heights are tens of metres** (a lookout, a shop on a cliff: 40-100 m),
places are **framed together in one wide-lens shot** for the cinematic view, and they are **HARD TO GET TO** -- the route is the game:
stairs cut in rock, ladders, rope bridges, floating platforms, lifts, flying ships. Measure every gap against his numbers (jump apex
2.81 m, a double jump, step .357 m) rather than eyeballing it. His layout ref: the canyon city image he sent after m1459 (cliff shops,
spires, bridges strung high across the gap).

## THE WATER-MILL TOWER (his, after m1459) -- the spire in the stream
Ref: `images/korajin/ref/water_mill_1.jpg` (his, after m1468: front / back / left / right / waterwheel / interior / top platform / signage).
What it is: on a sandy island in the stream, a square cream BASE with an arched opening and a WATERWHEEL in it, water pouring over the
wheel from a chute; a tall tapering cream TOWER painted with the red sun-spiral; a ring GALLERY and a red-capped timber LANTERN at the top
with big red SAILS on spars round it; timber BALCONIES clinging at two heights under red awnings, crates and lanterns on them; outside
STAIRS; ROPE BRIDGES with red banners from the tower to both canyon walls; lanterns hanging off it; an interior round room with a central
shaft. Placement: the layout test's spot, in the stream 66 m below the home (z 62), in a POND carved round it.
- **Passes:**
  - [x] **pass 1 (m1472):** the pond, the island and three stepping stones from the west bank; the cream base (stone quoins) with
    the race through it and the WATERWHEEL facing out of its front arch, turning, water pouring over it from a timber chute into a pool;
    the tapering tower (40 m to the gallery) with two painted sun-spirals and small windows; the gallery, the lantern with its red cap and
    finial, and the ROTOR of six big red sails turning round it; two balconies with red awnings, the outside stair from the base's roof,
    ladders from the island to the roof, between the balconies and up to the gallery; ROPE BRIDGES from the lower balcony to both walls
    (21.9 m west, 11.4 m east) with banners and landings
  - [x] **pass 2 (m1475):** the WEST STAIR (48 steps of .3 beside the long bridge, from its landing on the wall down to the shore by the stepping stones, railed, on posts) so the bank walks to the mill; strike the WHEEL and it jams to a stop (strike again, it turns); spray where the water lands; crates, barrels and sacks on the balconies, lanterns hung on ropes off the gallery, a tall red banner down the upper tower, a rope coil and red pots by the base
  - [x] **pass 3 (m1480):** BRIDGES ANCHORED TO BUILDINGS (his): a stone GATE TURRET stands out of each canyon wall where the mill's bridges land (doorway the bridge runs into, a floor, battlements, a flag, a ladder up its side to the roof); the EAST bridge's last 4 m is a DRAWBRIDGE, raised and lowered on chains by the winch wheel at the turret's door; the EAST STAIR down to the shore like the west one
- **DONE WHEN:**
  - [ ] the four views match the ref in silhouette (tower proportions, sails, balconies, base)
  - [ ] the waterwheel and the sails turn, the water reads as water (pour, foam, the pond)
  - [ ] the interior: the round room and its central shaft, reached from the base
  - [ ] the route is fun: the bridges connect to the canyon's own routes (and the old first-pass bridges are redone)
  - [ ] machines you work (stop the wheel, turn the sails, a lift up the tower) and things that break (the DOORS / CHAOS rule)
  - [ ] his sign-off on the phone

## THE PEAK (his, after m1475) -- another element of height: a mountain on the east plateau, a lookout at the very top
*"We're gonna wanna get another element of height, so maybe put a hill, a mountain, on the top up there... a plateau or an actual
mountain. Maybe there's a lookout tower at the very top... anchoring those drawbridges to buildings, building dedicated pads, paths."*
- **Passes:**
  - [x] **pass 1 (m1486):** the MOUNTAIN raised out of the east plateau (`gpeakLift` in `hwHeight`: 38 m over the plateau, top at
    64 m, radius 58, so its slopes are ground and a hike); a stratified PINNACLE on its top (24 m, sheer, cell-box collider) climbed by
    two ladders and a ledge to its PAD at 88 m; the timber LOOKOUT on the pad (deck at 96 m, railed, a hatch and a ladder, a red roof,
    a flag), its signal BELL (rings when struck) and a BRAZIER (sparks); a 134 m ZIPLINE from the lookout down to a post beside the
    home; a marked TRAIL (cairns and red-capped posts) from the rim above the mill's east turret up to the pinnacle's foot; a plank and
    a ladder from the east turret's roof up to where the wall eases off to the rim
  - [x] **pass 2 (m1541):** RIDGES -- six spurs down from the top with gullies between (`gpeakRidge`, in the height itself, so they are ground you walk); 26 OUTCROPS on the spurs, each a ledge of two or three stacked stratified slabs stepping back up the slope (the big ones solid); SCREE fanned below each down the gully; the trail is a WORN PATH now (the home's trodden-sand look, shared as `ghPathMat`) with 41 log STEPS where it climbs steeply
- **DONE WHEN:**
  - [ ] the mountain reads as a mountain (ridges, outcrops, scree, not a smooth bump) from the home and the mill
  - [ ] the trail is a real path (the worn ribbon, switchbacks, steps where it is steep) and the climb is fun
  - [ ] the lookout is dressed (telescope, flags, a roof you can see from far) and the zipline ride lands well at the home
  - [ ] his sign-off on the phone

## THE JINRA REFINERY-SHOP (his sheet `images/korajin/ref/jinra_sheet.jpg`; placement his, after m1486) -- a floating island over the peak
*"High up in a mountain... it might be floating, because that's the whole idea, it's magical power stuff... its own floating island above a
mountain."* What it does: *"you can buy Jinra, also refined Jinra, powers; it gives you special weapons and stuff -- I don't know yet, to be
fully fleshed out."* So **`GJINRA.goods` (name, vessel kind, price: null) and `gjinraBuy(item)` are the hook** and take nothing yet.
Mint is ONLY Jinra. The bottles, canisters, globe and crystals are the shared **JINRA VESSELS** kit (`jvesMats` / `jvesPut`, PROPS.md).
- **Passes:**
  - [x] **pass 1 (m1495):** the FLOATING ISLAND (stratified inverted rock, a grass cap, hanging crags, a falling sheet of Jinra off
    one edge with motes) at 124 m, east of and above the lookout; the deck on stilts with front steps and a rail; the sandstone DOME
    with a mint-lit doorway and a counter of vessels; the GLASS GLOBE of glowing Jinra on its crown in a copper cage, copper PIPES, a
    stack on top and a CHIMNEY breathing mint; teal Jinra AWNINGS and the BANNER; mint lanterns; the vessels along the front; and the
    way up: 14 FLOATING STONES spiralling from the lookout's deck (96 m) up to the island, each about a 2 m jump
- **DONE WHEN:**
  - [ ] the exterior reads as the sheet's hero (dome, globe, pipes, deck, awnings, banners) from the lookout and from the valley
  - [ ] the interior: shelves of bottles, the PROCESSING STATION (the dripping vat fed by pipes), the LARGE STORAGE gallery
  - [ ] the floating stones are a fun climb (bobbing, measured jumps) and the island is framed with the peak and the valley
  - [ ] what it sells and what it does with Jinra (his call), wired to `COIN` / the Jinra he carries
  - [ ] his sign-off on the phone

## THE MERCHANT SHOP (his, after m1459) -- high on a cliff, hard to reach, many passes (minimum 3 for every element)
Ref: `images/korajin/ref/merchant_shop_1.jpg` (front / back / left / right / entry / interior / second floor / sign / prop sheet). What
it is: a two-storey timber-and-stone shop on a wide plank DECK on stilts, under two huge curved BONE ARCHES that hold up a sail-like red
CANOPY roof; teal and pink awnings over a shopfront crammed with potions, pots and glowing purple CRYSTALS; a round TARGET SIGN in a
wheel frame; a tall pole with the red target BANNER; rope rails on posts with lanterns; steps up to the deck; a second-floor balcony;
teal palm-fan leaves; charms and lanterns hanging everywhere. **Placement:** NOT in the stream (that is the mill's). On a BUTTE that
rises out of the canyon's east rim upstream of the home, its deck jutting over the drop toward the home -- about 50 m up, framed with
the home in a wide shot from the valley floor.
- **Passes:**
  - [x] **pass 1 (m1468):** the BUTTE (a stratified sandstone lathe on the west rim, 29 m, its cap at 51.7) with the shop on top: the plank deck run out past the lip on struts, rope rails, lantern posts; the stone ground floor (open front, counter, shelves of pots and crystals), the timber upper storey and its balcony; the two BONE ARCHES and the red SAIL; the target SIGN in its wheel, teal and pink awnings, the BANNER pole, two palm fans, charms. **The way up (first cut):** a scaffold of four ~6 m ladders and landings up the canyon's west wall, then a 19 m ladder up the butte's back. Framed with the home from across the stream.
  - [x] **pass 2 (m1536):** its REVIVAL, live (see FALLEN / RESTORED); a ZIPLINE off the deck's front corner over the west wall down to behind the home (the climb's fast way down)
- **DONE WHEN:**
  - [ ] the butte stands on the rim, the shop on top reads as ref 1 from the valley floor and from the deck (massing, arches, canopy)
  - [ ] the four views match ref 1 (front, back, left, right) in silhouette and dressing
  - [ ] the ground floor is a shop you walk into (counter, shelves of potions, crystals, the interior detail view)
  - [ ] the second floor and balcony are up and walkable (2.2 m clear)
  - [ ] the route up is HARD and fun: measured gaps, at least four different moves (stair, ladder, bridge, floating platform / lift)
  - [ ] it is SHOPPABLE (something to buy) -- with main, who owns the economy
  - [ ] its doors open and break; its props smash (the DOORS / CHAOS rule)
  - [ ] his sign-off on the phone

## THE SHIP (his, after m1372) -- its own track, alongside the blueprint work

### STEER (his, Oct 28 2026, playing it on the phone) -- given to Worker A (the ship's builder)
> *"There is weird collider all over it. I try to climb it, I get stuck in this pose... stuck to walls, weird artifacting. There's tightrope walking
> at the top of the mast, you should be able to climb certain things, we should be able to swing. We need some more dynamics test grounds: a rope
> climb, a rope swing, a mast swing."*
- [~] the colliders audited against the visible ship (m1592, part 1): an AUDIT (every box face sampled, rays from 0.6 m outside, a face is invisible where no visible surface is within .3 m) found 73 of 165 boxes with invisible faces. Fixed: the quarterdeck pagoda's roof tiers were decor-only over a house box whose top sat .56 m UNDER them -- a hidden lip inside the eave he caught and hung from mid-wall (his screenshot); the tiers are solid now (stepped eaves to hang on and climb). The bulwark guards were one box per 2.9 m strip along a curved hull (stair-step corners); now thirds, each as wide as the hull there, with a visible timber CAP RAIL at the collider's exact top. Open: the rest of the list (hold walls, castle sides), and his notes on where else he sticks
- [ ] the dynamics test grounds, each a sandbox of its own first: ROPE CLIMB, ROPE SWING, MAST SWING
- [ ] then onto the ship: tightrope along the mast and yards, the rigging climbable, a swing
- **THE TARGET (his, same day): A JUNGLE GYM.** *"I want the ship to be super climbable: climb everything, hang on the ledges, climb up the mast, tiptoe
  tightrope across the beam up high between the masts, swing on a rope, climb the ladders up into the perch, ropes hanging down. A little jungle gym."*
  Every rail and ledge a hang/shimmy edge; the masts climbable; the yard between the masts a tightrope; rope ladders to the crow's nests; ropes
  hanging from the yards, climbable and swingable.


> *"A classic retro pirate, samurai, alien water vessel just floating in an ocean scene... the island could just be there... interior, exterior,
> sails you can climb up on. I'm going to make it transform into an airship -- floating in the water and in the air -- but start it as a literal
> classic Viking alien pirate ship floating in the water, with sunrise and really beautiful water shaders."*

- **Where:** KORAJIN > **The Ship** (`?w=forge&zone=ship`): the forge as a SEA, an ocean shader to the horizon, a sunrise dome, and the ship.
- **Passes** (the forge's 1-2-3 and then more; he will want many):
  - [x] **pass 1 (m1373):** the sea and sunrise, plus the ship standing and playable:
    - a lofted hull, the deck and bulwarks
    - the stern castle with its cabin inside and a pagoda house on top
    - the forecastle and the ramps
    - three masts with junk sails, crow's nests and rope ladders
    - the dragon prow, lanterns and bronze guns
  - [x] **pass 2 (m1374, WORKER A):** the ship RIDES the swell (pitch, roll, heave, with the decks carrying him); the hold below deck (an interior you drop into); sails you can CLIMB (the battens as rungs) and run along the yards; a rope swing between the masts
  - [x] **pass 3 (m1375, WORKER A):** the water's foam round the hull and a wake; spray off the bow; the sun on the water; gulls; the island on the horizon
  - [x] **pass 4 (m1377, WORKER A):** his looks notes -- the stair-stepped shadow bands and the z-fighting fixed; REAL SURFACES (authored tileable textures: deck planks, hull timber, brass, red lacquer, slate roof tiles, the sail's canvas and key crest)
  - [x] **pass 5 (m1378, WORKER A):** the ALIEN-SAMURAI AIRSHIP look (his reference sheet): anti-grav turbines with blue cores along the hull and astern, a horned dragon figurehead, the stern castle as a tiered pagoda, banners and hanging lanterns, rigging, brass fittings
  - [x] **pass 6 (m1386, WORKER A):** onto the SHARED painted texture library (`triMat`); a detail pass -- helm, capstan, bell, balustrade, gun ports, lantern strings, pennants, sheets, sea chests, rope coils, the dragon's whiskers
  - [x] **pass 7 (m1391, WORKER A):** another detail pass -- the ANTI-GRAV CORE ROOM in the hold, the captain's cabin dressed, ratlines, crow's-nest and stern lanterns, a bronze cornice, core and turbine sparks, flying fish
  - [x] **pass 8 (m1393, WORKER A):** his reference's SKY -- floating islands with pagodas and waterfalls, a ringed planet, drifting clouds; a smoking galley chimney
  - [x] **pass 9 (m1399, WORKER A):** flags that FLOW -- every banner and pennant is cloth (a travelling wave from the hoist, a shared gust); real pennants on masthead staffs with swallow-tails
  - [x] **pass 10 (m1404, WORKER A):** the SCENERY REBUILT (his: *"a cone flipped upside down... so goddamn geometric... the island is just a circle"*) -- `shipIsle`: eroded outlines with coves, painted ground, strata undersides that drip into lobes, floating chunks, vines, mixed trees with cherry blossom; the sea island with a mountain, beaches, surf on its real coast, sea stacks, and a HARBOUR (pier, houses, torii); eight floating islands; the haze pushed out
  - [x] **pass 11 (m1409):** more FOAM on the sea (whitecaps, streaks) and the first BIG SEA CREATURE: a giant alien whale that surfaces, blows and dives (his: *"one big sea creature at a time"*)
  - [x] **pass 12 (m1416):** a long serpent-fish that arcs up and down through the swell
  - [x] **pass 12b (m1433):** the serpent REBUILT -- one continuous scaled skin, a membrane fin with spines and a tail fan, flapping pectorals, a lofted head (brow, hinged jaw, teeth, sunken eyes, frills, horns, whiskers)
  - [x] **pass 12c (m1439):** the serpent in PAINTED textures -- skin (spine scutes, iridescent scales, belly plates), glowing lateral line, spined fin membrane, slit-pupil eye
  - [x] **pass 12d (m1448):** the SEA DRAGON from his reference sheet -- textures generated from the sheet (mosaic scales, cream belly, torn red-orange fins, gold eye), a horned fanged head with a red mouth, and the REAR: the neck rises straight out of the sea, head level on top
  - [x] **pass 12e (m1457):** the dragon made INVITING -- a big round Chinese-dragon head (bulbous nose, big gentle blinking eyes, glowing antlers, flowing whiskers, mane, beard, brows), silky koi fins, bigger, and it turns to look at you when it rears
  - [x] **pass 12f (m1464):** the body stops being a tube -- swells and pinches, fuller hips, dark saddles across the back, five pairs of silky flank tufts that flutter down its length
  - [x] **pass 14 (m1479):** the AIRSHIP FORM for `shipModel` (the dojo's flying ship): two great battened junk-sail wings that ripple, a walkable spar out along each, lantern tips, tail fins
  - [ ] pass 13: manta rays that swim AND fly (for the airship sky too)
  - [ ] later: other ships about (junks under sail), a bigger land harbour; air creatures for the airship (his: flying fish, serpent-dragons, pterodactyls)
  - [ ] later: swimming here; the AIRSHIP transform (his)

## STEER 000 (his, after m1372) -- BLUEPRINTS FIRST, GENERATED BLOCKOUTS, NOT A TRANSCRIBED IMAGE

> *"Primary markers, secondary between them, tertiary between those -- little dynamics inside medium inside big... figure out how to generate
> a good grid blockout of these in three dimensions... You built my level very literally from a test image. We need to design really interesting
> blueprints that we can scaffold and build around."*

- **The method:** LEVELDESIGN.md, "THE BLUEPRINT". Three scales (stations, runs, texture), a planned height profile, a measured MOVE TABLE, a parametric CHUNK LIBRARY, a seeded SOLVER, a reachability CHECK, and a PREVIEW page for him to pick from.
- **OMAKASE (LEVELDESIGN.md):** a level serves a VERB BUDGET (one new verb per level, taught and then kept), one way in, dead ends on purpose, the illusion of choice by branches that rejoin and vistas, and no info dumps. The blueprint gains `verbs:` and `serves:`.
- **The loop STOPS adding passes to the transcribed Level 1.** Its work, in order:
  1. the move table
  2. the chunk library
  3. the blueprint format, solver and check
  4. the preview
  5. Level 1 v2 from a blueprint
- **Progress:**
  - step 1, the move table: DONE (m1376, Worker B)
  - step 2, the chunk library: pass 1 DONE (m1389, SPAWN > Chunk Library: walk them)
- **Level 1 (the sketch) stays on the menu** to compare against.

## STEER 00 (his, after m1369) -- BUILD A LEVEL IN LAYERS, AND EACH LAYER HAS TO HOLD UP ON ITS OWN

> *"I spawn in and I'm just getting hammered with cannonballs before I've even moved. I need to be able to walk the level first and foremost.
> We need to sit and plan how a level layers together."*

The method (written up in LEVELGRID.md, "THE FIVE LAYERS"):
1. **THE RUN:** a ninja parkour centre. No weapons, no enemies, no puzzle: running, jumping, flipping, swinging, climbing, wall runs, (swimming). It has to be a FUN LEVEL by itself.
2. **THE PUZZLE:** which pieces of the cookie open the cookie jar. This opens that, that opens the next, and the final one opens the boss gate. Designed, not literal.
3. **THE ENEMIES:** placed to GUARD the key areas of layer 2 (buttons, doors, abilities, the boss approach). **Each enemy has a ZONE**, a circle round what it guards, and its reach stays inside it. Nothing fires at you from across the map, and nothing hits you at the spawn.
4. **THE THEME:** what sets this level apart (air world, puzzle world, enemy-heavy, water world, vehicles, co-op...).
5. **THE BOSS:** the final arena, a big open dojo, and the boss of the level.

**Each layer is built in turn, and each must still play with every layer under it.**

- **In the game (m1371):** KORAJIN > **Level 1 -- The Grid** on the title menu opens it on its own. A LAYERS bar sits at the top: L1 RUN is always on, and L2 PUZZLE, L3 ENEMIES, L4 THEME and L5 BOSS toggle (saved). Each tap rebuilds the level from S. SPAWN > BUILDINGS still spawns everything else round it.
- **The rubric is LEVELDESIGN.md** (his layers checked against Nintendo's four steps, Boss Keys locks and keys, Dark Souls loop-backs and MMO leashes). It adds a LAYER 0 (measure the moves first) and lists the next layer-1 passes: measure, teach then test, rests and checkpoints, the keep as landmark.
- **The loop works on LAYER 1 of Level 1 until he signs it off.** No new enemies, gates or bosses until then.
- **Already known about layer 3:** the catapults (55 m reach), the perch archers and the guns have no zones. They get zones before layer 3 is his to judge.

## STEER 0 (his, after m1356) -- THE GRID LEVEL FIRST, AND AS MANY PASSES AS IT TAKES

> *"We do as many freaking passes on this as we need to. Build one level at a time, scoped fairly moderately, and keep iterating over and over
> until the game logic feels amazing -- then we embellish with the stuff we've built. And we want a lot of verticality. A LOT of verticality."*

- **The loop works on GRID LEVEL 1 (LEVELGRID.md, `LVG1`) every pass, until he says it plays amazingly.** S2 (rescaling) and S3 (breakable skins) wait behind it.
- **Logic before art:** each pass makes the ROUTE better (the order of beats, the reasons to go up and down, the reveals, the shortcuts, the risk), not the looks. No kit pieces, no dressing, until he signs off the logic.
- **VERTICALITY:**
  - heights to Y 6 (27 m)
  - the path crosses OVER and UNDER itself (pads on pillars, open beneath)
  - climbs of every kind: ramps, ladders, wall-run faces, grapple rings, bars
  - drops and ziplines down
  - a view from the top of where you have been and where you are going
- **Each pass: one clear change to the level, a NOTES entry saying what it changes and why, and LEVELGRID.md kept as the plan.** His notes become the next pass.
- **The pass log** (tick here):
  - L1 pass 1 (m1356): the greybox system and his blueprint's path
  - L1 pass 2 (m1357): verticality
  - L1 pass 3 (m1358): wall runs (vertical, three-part horizontal over a pit), high bars
  - L1 pass 4 (m1359): moving platforms (carry) up to a rope
  - L1 pass 5 (m1360): archer/gun perches across the gaps
  - L1 pass 6 (m1361): the boss keep on stilts -- break its four legs and it falls
  - L1 pass 7 (m1362): three catapults on the ground lobbing up at the high moves
  - L1 pass 8 (m1363): a long bar to shimmy across a pit (monkey-bar greybox)
  - L1 pass 9 (m1364): a zeppelin deck from the roof across the level to a high pad
  - L1 pass 10 (m1365): a 75 m zip from the zeppelin pad to the boss door
  - (m1368: FIX -- Grid Level 1 threw on spawn since m1359; passes 4-10 reach him only now)
  - L1 pass 11 (m1369): the keep wakes (3 guards) and drops one per broken leg
  - ...

## STEER (his, after walking X4, Oct 27 2026) -- OUTRANKS THE QUEUE BELOW

> *"We need to increase the scale yet again -- maybe start with 1.5. The stairs on the ground floor are so steep I couldn't climb; I had
> to jump from one stair to the next... I would make everything bigger. We need room to play. It needs to feel good. Think God of War:
> everything's huge and you're small but powerful -- the enemies are like 100 times your size. You're a Jin, a powerful deity-spirit-alien.
> We're gonna go for SIZE."*

- **SCALE x1.5, everything, from now on.** Storeys 6 m+, towers 25-40 m, rooms 9 x 9 m+, walkways 3.3 m+, doors 2.4 m+. ROOM TO FIGHT's
  numbers below are now MINIMUMS x1.5. Size is the point: he is small and powerful in a huge world.
- **BUT HIS BODY DOES NOT SCALE: STAIRS STAY CLIMBABLE.** His step is .357 m (CLAUDE.md, m368). Every stair riser is **0.30 m or less**:
  a taller storey means MORE steps (or a ramp, or a ladder), never taller ones. Prove a flight by its riser number in the NOTES entry.
- **LADDERS (shipped m1316):**
  - one side only: the side away from the exit mark
  - he steps up and over at the top
  - slower hands
  - every new ladder carries a `mark` on the floor it leads to, so its front is decided.
- **THE QUEUE, FIRST:**
  - **S1 -- X4 the Octagonal Block Pagoda: x1.5 and climbable stairs** -- DONE m1324 (Worker A): storeys 6 m, apothem 9 m (rooms 9.9 m at the top), walks 3.3 m+, doors 2.7 m+, the hall stair two flights of ten at .30 risers / .40 treads
  - **S2 -- the other done buildings, x1.5, one per build:** X1 pagoda (DONE m1323), C1 courtyard (DONE m1330), X2 castle (DONE m1321, Worker B), R1 Mega Wall (DONE m1332), and the older forge rows: hall (DONE m1336), wtower (DONE m1342), gate (DONE m1343), pagoda (DONE m1346), market (DONE m1349), shrine (DONE m1351), rampart (DONE m1355), adock, zep, fship, bath, fwork, sphang, skyb, cliff, keep, barr, lhouse, fisl, npil, storii, siege, teag, colo, oni, obs, fest, swrk -- in that order.
    One build each, with stairs re-cut to .30 risers.
  - **then** the queue below (R2 Four Fires on), built at the new scale.
- **S3 -- BREAKABLE SKINS ON A STANDING FRAME (his, after m1352):** *"A lot of stuff I wish was breakable -- balusters, gates, railings, parts of
  roofs. Like Weirdport: the frame of the building was always there, but every wall, every door could be destroyed. Build the frame of the roof,
  but the pieces that make up the roof are destructible -- if rockets are shooting at you or you're fighting up there, they're shooting pieces of
  the roof off; maybe you have to go back up and rebuild it. I like the idea of exposed rafters -- parts of the wall go away but there's
  scaffolding left."*
  - **THE RULE from here:**
    - every roof is a permanent RAFTER FRAME (beams you can stand and run on) under breakable PANELS. A panel is walkable until it is shot or struck away, then the rafters show.
    - every wall is the same: a timber frame (posts, rails) that stays, with breakable infill (the `cwallBuild` chunks already are this).
    - railings, balusters and gates are breakable pieces.
    - panels come back on a slow timer (or a worker rebuilds them).
  - **S3a (DONE m1353, the Dojo Hall):** a shared helper (`bldSkinRoof`): a hip/gable roof cut into panels between rafters, each panel its own walkable triangles plus a merged-range mesh. Hits (`bldHit`, rockets, strikes) knock panels out with debris and a tile clatter. The rafters stay walkable beams. First on the Dojo Hall's roof.
  - **S3b (DONE m1354, the Courtyard):** railings, balusters and gates as breakable pieces (a shared `bldRail` helper), first on the Courtyard's balconies and bridges.
  - **S3c:** retrofit the rest, roof by roof, as each building's S2 pass comes up.
- **GIANTS:** *"Enemies like 100 times your size."* A design note for R7 (the sky dragon) and R8 (boss armour): build the bosses
  building-sized, things you climb and fight ON.

## The rules of the loop

- **ONE pass per build.** Pull, read this file, take the first building whose pass count is under 3, do its NEXT pass, `npm run bump`,
  `npm run check`, push to main, tick the pass here with the build number, NOTES.md entry, end the turn. **Shipped unverified** -- no
  headless runs (his rule: he tests, the loop does not).
- **A building is DONE at pass 3**: set its `pass: 3` in `BLDG.list` (index.html) and it shows as done in SPAWN > BUILDINGS.
- **The style** (KORAJIN.md, the Red Hollows): ancient, organic, a little primitive, with mysterious technology embedded -- weathered
  sandstone and plaster, dark timber, red banners with the white diamond spiral, bronze machinery (gears, pipes, lamps), curved roofs with
  upturned eaves, lanterns, cyber accents (a few neon lines, glowing panels), and the turret's goblin-samurai-cyber look.
- **HIS STYLE NOTE (after m1119):** *"Take reference from this dojo white scene and these floating drone things. Wires mixed with future
  drones mixed with ancient shrines mixed with alien tech mixed with off-world gizmos mixed with a zen mountain samurai lodge."* So: the
  arena's clean white-and-grey surfaces and soft light; FLOATING DRONE ORBS (a white egg with a dark ring round it, hovering, bobbing);
  CABLES and WIRES strung between things (sagging, with little lamps or tags on them); shrine pieces (ropes, paper streamers, stone);
  alien gizmos (glowing cores, antennas, dishes); and the zen lodge: dark timber, deep eaves, stone, calm. Ref:
  `images/korajin/ref/forge_style_dojo_drones.webp`. Every building from here gets some of each.
- **AND (his, during m1120):** *"Sentry guns and snowy white-capped mountains with robotic turrets and spider robots and robotic samurai
  guards with bow and arrow on the watchtowers."* So: buildings are MANNED where it fits -- the red ARCHERS (m1103) posted on lookouts and
  walls, the TURRET (m1011) as sentry guns on decks and gates; SPIDER ROBOTS (to build: a six-legged bot that patrols and climbs); and the
  forge's horizon gets a ring of SNOWY WHITE-CAPPED MOUNTAINS (the Refuge's low-poly peaks, whiter). Watchtower pass 2 posts an archer on
  the lookout and a sentry gun on the second deck.
- **AND (his, after m1120):** *"Big fire pits, guard towers and katana masks. And large scale -- everything is big, lots of things that
  are climbable, lots of drawbridges and cross beams, Japanese architecture, perches and different levels, a lot of VERTICALITY."* So from
  here: BUILD BIG (storeys 4 m+, towers 15-25 m, halls you can lose yourself in); every building has MORE THAN ONE LEVEL and more than one
  way up (ramps, ladders, ledges you can climb, bars, beams to run along); CROSS BEAMS and PERCHES jutting out (things to stand on high);
  DRAWBRIDGES (a span that lowers and rises -- the Gatehouse's, the Rampart's); FIRE PITS (big bronze braziers with real flames and
  smoke); KATANA MASKS (giant samurai mask-faces (mempo/oni) on walls and gates, crossed katanas). Later buildings are linked to each other
  by bridges and beams at height, so the courtyard reads as one climbable whole.
- **Every building is PLAYABLE**: breakable walls (`cwallBuild`, they repair), things to swing on (`hbarMake`), things to climb or run up
  (ramps: walkable `triAdd` surfaces, rise <= .32 m a step), an inside and an outside, and where it fits a function (a turret, a ballista,
  a balance beam, a lookout). Code-built and merged per material (draw calls matter on his phone).
- **MODULAR**: each building stands in its own spot in the forge (`at`), on a grid of 4 m units, its doors on its sides' centres, so
  later they can be set side by side into a courtyard.
- **WHEN THE QUEUE RUNS OUT (his, after m1123):** *"If you run out of things to make tonight do another brainstorm pass of another set, and
  then again later if you run out again after that, etc."* So: when every row below is done, spend ONE pass brainstorming the NEXT SET
  (8-12 new buildings / props / moves in his style notes, each with a function and a spot in the forge), append it as a new table here,
  and carry on building. Repeat every time a set runs out. The loop never stops for lack of a queue.
- **AND EXTRA PASSES (his, after m1124):** *"You can also continue with detail passes -- you can do an additional 3 passes on things
  already completed."* So a DONE building may get passes 4-6 (more detail, more function, more delight) -- mark them in its row as
  `4 (mNNNN)` etc. Order of work: new buildings in the queue first; when the queue is out, alternate between brainstorming a new set and
  giving the done buildings their extra passes (oldest first), so the forge gets both new things and better old ones.
- **EVERYTHING THAT SHOOTS CAN BE KILLED (his, during m1128):** *"Don't forget to make the turrets and stuff destroyable -- I could kill
  it."* Every turret, ballista, cannon, spider bot or gizmo that attacks takes katana hits, his shots and its own shots parried back
  (`bldHit` is the hook: add the new weapon there), breaks visibly (sparks, smoke, slumps), stops, and is REPAIRED after a while.
- **Pass meaning**: 1 = the building stands, playable (shell, roof, doors, the main feature). 2 = the details and the function (interior,
  the moving parts, lights, the special feature working). 3 = the polish (proportions, colour, silhouette, one more delight).

## ROOM TO FIGHT (his, after m1275, a hard rule for EVERY building from here, and for the workers)

*"The walkways should be less narrow so they're more fun and you can do battles on them -- write this to pretty much everything. I don't want
the quarters to feel so narrow, in buildings, on walkways."* So:
- **Balconies, walkways and wall-walks are at least 2.2 m clear** between the wall and the rail (two bodies and a sword swing).
- **Bridges and beams that are FOR crossing are at least 1.6 m.** A deliberately narrow balance beam is the exception, and it is named
  as one.
- **Rooms are at least 6 x 6 m inside** where a fight can happen, and doors are at least 1.6 m wide.
- **The eave above any walkway clears it.** Put the roof's edge beyond the walkway's rail. A lip or beam hanging over a walkway at
  head height crowds it and shoves the camera in.
- **Anything thin near a walkway is `noCam: 1`** (rails, posts, lips, lattice), so it never pulls the lens into his back. Only real
  walls stop the camera.

## DOORS, GATES, BRIDGES -- AND CHAOS (his, after m1296, a hard rule for every building and both workers)

*"There are doors I can't break down or go through -- the guys are behind them and can't get out and I have to jump over the wall. We need
functionality with drawbridges and opening doors, or at least breaking the doors down. I kind of like the idea of everything being
destructible -- it's just chaos."* So, from here:
- **Doors and gates OPEN** for whoever comes near (him from either side, a guard on his way out), and close behind. No door is ever a dead
  wall.
- **Every door and gate BREAKS.** A few blows (blade, rocket, whirlwind) splinter it in a burst of sparks and smoke, the way stands open,
  and it is REHUNG later. The Great Red Pagoda's gate (`gpagGateHit`) is the pattern, and `bgateMake` / `bgateStep` / `bgateHit` (m1298) is the reusable helper: use it.
- **Drawbridges, portcullises and lifts are MACHINES you work.** A lever, a gong or a bell raises or lowers them, and a big enough blow
  can drop them.
- **Lean destructible.** Walls breakable (`cwallBuild`), props smashable (`smashAdd`), timber that splinters, plus anything else that
  can break in the frame budget. Make it chaos you can fight through.

## PARALLEL WORKERS (his, after m1270: *"spin up one or two extra context windows... one on one building, one on another"*)

Three sessions build at once, each OWNING its rows; nobody touches a row (or its code) it does not own:

| owner | rows |
|---|---|
| the MAIN loop (this file's original session) | X1 Great Red Pagoda, then C1 the Courtyard, then the R rows |
| WORKER A | X4 Octagonal Block Pagoda (passes 1-10, DONE m1298), then one X4 follow-up (gate leaves via `bgateMake`), then X3 Timber Siege Fort (passes 1-10) -- its code just ABOVE `// m1247: THE SKY WRECK` as before, its BLDG.list entry right after its X4 entry |
| WORKER B | X2 White Heron Castle (passes 1-10) |

**The push protocol (everyone, every pass) -- the build number and NOTES/BUILDINGS tops are shared, so:**
1. Make the pass. Commit it WITHOUT bumping: `git add -A && git commit -m "..."`.
2. `git pull --rebase origin main`. A conflict in NOTES.md or BUILDINGS.md is two entries at the same spot: keep BOTH (delete the markers,
   keep both blocks, newest first). A conflict in index.html: keep both sides unless they truly edit the same line, then re-apply yours.
3. `npm run bump && npm run check` (gate on exit), then commit the bump on its own (`git commit -am "mNNNN bump"`) and `git push origin
   main`.
4. Push REJECTED? `git reset --hard HEAD~1` (drops ONLY the bump commit), then back to 2.
5. Tick your row with the build number the bump printed; that tick goes in your NEXT pass's commit (or a follow-up).

**Where your code goes (so the three never edit the same lines):**
- WORKER A: building code just ABOVE the line `// m1247: THE SKY WRECK`; its `BLDG.list` entry on the line right AFTER `{ key: 'swrk'`;
  its `bldHit` hook just ABOVE `if (zepLever(`.
- WORKER B: building code just ABOVE the line `// m1254: THE ZOOM RAMP TOWER`; its `BLDG.list` entry right AFTER `{ key: 'fest'`; its
  `bldHit` hook just ABOVE `if (smashHit(`.
- MAIN: everything else.

Never run `npm run sim/glsl/clips/...` (CLAUDE.md). Never force-push. Shipped unverified.

## THE 10-PASS EXPERIMENT (his, after m1260)

*"I'm curious to see what 10 passes makes a building look like... go back through what we already have and refine them. A lot of the stuff
-- the spiral blocky stairs -- they're fine, but functionally they're not that functional. I'm looking for much more visually interesting and
much more functional."* He is sending a reference image of a tower. When it lands, it becomes the first 10-pass building (a pass per build,
each pass a real step up in silhouette, material, detail and things to DO), and that result decides whether the rest get the same.

**The image landed (m1262): `images/korajin/ref/red_pagoda_tower.webp`** -- a slender five-storey red pagoda, a railed balcony round
every storey, deep flared roofs with gold edges stepping in as it rises, a spire of rings, a roofed pavilion at its foot, a red fence with
gold flame finials. **The loop takes X rows FIRST, before the R rows, a pass per build, to 10. ORDER (his, after m1268): X1, then X4 (the octagonal block pagoda), then C1 (the courtyard), then X2, then X3.**

**THE BLOCK STYLE (his, after m1267, five Minecraft-style references in `images/korajin/ref/block_*.jpg`):** *"It's very Lego or Minecraft,
and it shows we can create stuff with blocks while still getting detail, low poly, destructibility and climbing out of these. I like the one
that's kind of hexagonal."* What they teach, and every X building from here borrows:
- **Detail out of STEPS, not curves.** Eaves are stacked slabs, each one stepping out further (four or five courses), with the corner
  courses kicked up a block. The flare reads from a distance, every slab is a box (cheap, mergeable), and every slab is a ledge you can
  stand on or catch. Railings, brackets and window frames are single blocks in a rhythm.
- **Colour bands do the work.** Red posts, cream panels, a teal/green bracket band, dark grey tiles, a light stone base: each band is one
  material, so a storey is about four draws however busy it looks.
- **Every block can BREAK.** Walls, panels and even eave courses built from chunk boxes (the `cwallBuild` idea, generalised to any height:
  a block grid you can cut holes in and that repairs).
- **Silhouettes worth stealing:**
  - an OCTAGONAL/HEXAGONAL plan with seven tight roofs and a long spire (block_pagoda_octagonal)
  - a heavy stone base under a slim timber tower (block_tower_stone_base)
  - a tall plain shaft with a balconied clock-crown and vines (block_clock_tower)
  - a pagoda on a walled cliff terrace with stairs up (block_pagoda_cliff)
  - a dark tower hung with long banners (block_dark_tower_banners)

| # | building | the plan, pass by pass | spot | passes |
|---|---|---|---|---|
| X1 | **Great Red Pagoda** | 1 the stack: 5 hollow storeys, a room each, ladders up through hatches (corners turning), a door onto every balcony, deep flared roofs, the spire · 2 the reference's detail: bracket clusters under every eave, lattice panels and railings in the right rhythm, the upturned corner tips, tile ribs · 3 the PAVILION at its foot (the side hall with its own roof) and the red FENCE with gold flame finials round the court · 4 function: the climb OUTSIDE -- eave tips you can catch, bars between balconies, a rope from the spire · 5 the rooms: a different room every storey (shrine, armoury, library, bell room, the lookout) · 6 guardians: archers on the balconies, a sentry in the bell room, killable · 7 the light: lanterns that glow at dusk, a beacon in the spire, the windows lit · 8 motion: wind chimes, streamers, the bell, birds off the roofs · 9 a set piece: ring the bell at the top and the whole tower answers (lanterns run up, the spire flares, a gate opens) · 10 the polish: proportions against the reference, colour, silhouette, draw calls | (90, 0) | 1 (m1262) · 2 (m1266) · 3 (m1267) · 4 (m1269) · 5 (m1270) · 6 (m1271) · 7 (m1272) · 8 (m1273) · 9 (m1275) · 10 (m1287) DONE |
| X3 | **Timber Siege Fort** -- **WORKER A** (his third reference, `images/korajin/ref/timber_siege_fort.webp`: a scaffold fortress on a cyclopean stone base) | 1 the mass: a big battered base of ROUGH fitted boulders (irregular stones, not courses) with a dark tunnel GATE through it; on top a tall open TIMBER LATTICE fortress -- three tiers of posts and X-braced frames stepping back, decks at every tier, a small pagoda-roofed watch house crowning it · 2 the lattice detail: every bay X-braced, rails, ladders lashed between tiers, rough-cut timber colour, the white war banners with the black crest (the hwBanner family) on poles at the corners and on the roof · 3 CLIMBING: the X-braces are bars and footholds -- the whole lattice is a jungle gym (bars along the tier edges, ladders, braces you can run up), the base is runnable stone (wall run-up) · 4 the gate tunnel: a portcullis, a passage under the fort into a courtyard behind, a ramp up inside · 5 the work site: leaning poles and scaffolding against the stone (ramps!), timber stacks, a crane, the half-built bay · 6 defenders: archers on every tier, a sentry gun in the watch house, a rock-drop from the top deck, all killable · 7 BREAKABLE timber: cut the braces and bays sag and fall (the kit-style collapse) · 8 the camp round it: palisade, tents, weapon racks, banners down the approach (the dressing kit) · 9 the set piece: fire the watch house and the lattice burns tier by tier, or hold it · 10 the polish against the reference | (-70, 100), measured at pass 1 (`TFORT`): the base is 36 x 28 m at the STEER's x1.5, with room for the pass-8 camp to 30 m out -- 14 m clear of the Courtyard's x -28 edge, ~30 m clear of the moved White Heron Castle (-125, 50), 70 m+ from the Lighthouse and everything south | 1 (m1328) · 2 (m1329) · 3 (m1331) · 4 (m1333) · 5 (m1334) · 6 (m1335) · 7 (m1337) · 8 (m1338) · 9 (m1339) · 10 (m1340) -- all ten passes in; waiting on his look |
| X2 | **White Heron Castle** -- **WORKER B** (his second reference, `images/korajin/ref/white_castle_keep.jpg`: a Himeji-style castle) | 1 the mass: a battered (sloped, inward-leaning) dressed-stone BASE 6-8 m tall, the MAIN KEEP on it -- five white-plaster storeys under layered grey roofs, the storeys stepping in, a smaller connected tower and a long white gallery wing on the left, all on the stone · 2 the roofs: chidori-hafu triangular gables and curved kara-hafu gables breaking every roof line, ridge ornaments (shachi fish) at the peaks, the roof edges' rhythm · 3 the walls: small square windows in rows, dark timber window frames, the white plaster with the faint stone shadow, gun/arrow ports · 4 the stone base CLIMBABLE: the battered wall is a giant ramp you can run up (no-tap run-up, m1251) to the first roof, handholds in the stone courses · 5 inside the keep: stacked halls joined by steep stairs (walkable ramps), the great pillar, a lookout at the top · 6 the gallery wing: a long corridor you can run, its roof a path, the corner tower · 7 defenders: archers at the windows, a ballista on the gallery roof, a sentry gate in the stone, all killable · 8 the approach: a winding walled ramp up to a gate in the base (the castle's maze), a drawbridge · 9 the light and life: pines round it (the dressing kit), lanterns, the white catching the sun, flags · 10 the polish: proportions against the reference, silhouette, colour, draw calls | (-108, 45) -- re-measured at pass 1: x -121..-87, z 28..62 (base, toe, stair, storehouse); ONI (-72, 0) ~40 m off, the mill spot (-72, 40) 15 m clear | 1 (m1277) · 2 (m1280) · 3 (m1283) · 4 (m1285) · 5 (m1288) · 6 (m1291) · 7 (m1294) · 8 (m1299) · 9 (m1302) · 10 (m1303) · 11 (m1313: room, gates, gongs) · S2 x1.5 (m1321) DONE |
| X4 | **Octagonal Block Pagoda** (his favourite of the block refs, `block_pagoda_octagonal.jpg`) -- **WORKER A** (`OPAG`, `opagBuild`) | 1 the stack: seven EIGHT-sided storeys of blocks (apothem 6 m stepping in .4 a storey, 3.4 m each -- ROOM TO FIGHT: rooms 6.4 m at the top, walks 2.2 m, doors 1.8+ m), red corner posts, cream block panels that BREAK (one InstancedMesh, turned colliders, the blocks above fall), a red band and a teal bracket band under four STEPPED slab eave courses round all eight sides (corners kicked up two blocks; every course walkable, .3 m risers; the outer one a lip to catch), a ladder up through a hatch on every floor, a door onto every roof, a wide porch eave on red posts at the ground, a red octagonal fence with a gate, a stepped spire · 2 the block detail: bracket clusters in a rhythm under every eave (teal and red stepped blocks), light edge blocks on every course, tile ribs as block rows, lattice windows, a red balustrade of blocks round each roof walk, gold corner caps · 3 everything breaks: the porch posts, the bands and the eave courses themselves as block grids, and they REPAIR (blocks fly back in, bottom first) · 4 the climb outside: bars between storeys, handholds up the corner posts, a zipline off the spire to the gate, a ring at the top · 5 the rooms and the inside way up: a block stair winding up the ground hall, a different room every storey (shrine, armoury, scroll room, tea room, bell room, lookout) · 6 guardians, killable: archers on the roof walks, two stone lion guardians at the gate that wake when you come in, a monk in the shrine · 7 the light: lanterns at every kicked-up corner, the windows lit at dusk, a beacon in the spire · 8 motion: wind bells swinging at the corners, banners on the fence, birds off the roofs, the spire collars turning · 9 the set piece: ring the spire bell at the top and the tower lights storey by storey, the lions bow, the gate opens on a reward · 10 the polish: proportions against the reference, colour, silhouette, draw calls | (70, 72): clear of every building in the forge -- nearest the Festival (72, 30) at 42 m and the pillars (27, 46) at 50 m; its fence is 19 m out (20.6 at the corners) since S1's x1.5 -- still 7 m clear of the Festival's z 44 | 1 (m1274) · 2 (m1276) · 3 (m1279) · 4 (m1282) · 5 (m1286) · 6 (m1289) · 7 (m1290) · 8 (m1293) · 9 (m1295) · 10 (m1298) -- all ten passes in · S1 x1.5 + stairs (m1324) · gates (m1326) |
| C1 | **The Courtyard** (his, after m1264, ref `images/korajin/ref/timber_lane_watchtower.jpg`) -- **the plan is COURTYARD.md** | a small organised court (56 x 64 m) that puts the buildings to work: a stone lane between two Timber Lane Halls to a two-roofed Watchtower Gate, a koi pond with a moon bridge, the Great Red Pagoda in a corner, a bell house, a wall-walk all round, rope bridges at height, guards in the towers and on the ground, creatures, fairy dust, sunlight. 10 passes, listed in COURTYARD.md | (0, 150) | 1 (m1292) · 2 (m1300) · 3 (m1305) · 4 (m1307) · 5 (m1308) · 6 (m1309) · 7 (m1310) · 8 (m1311) · 9 (m1312) · 10 (m1315) |

## HIS REQUESTS (m1251) -- these go FIRST, ahead of the rest of Set 3

**The loop takes these rows first, in order, three passes each, and does NOT alternate with extra passes while any R row is open** (his, after m1256: *"start the loop again with this new stuff"*). A kit row (R3, R4, R9) is a set of pieces plus a showcase; its pass 1 is the pieces and the showcase.

| # | building | function | spot | passes |
|---|---|---|---|---|
| R1 | **Zoom Ramp Tower** | his: *"a tower shaped like a really tall ramp -- you do the speed run and it's just tall enough that your whole run gets you to the top, and you hit it perfectly; the very top is a rim of high bars or a ledge you just barely grab, then pull yourself up into a guard tower."* A long run-in, a ramp curving up into a sheer face (the ZOOM at full hold meets the face head-on and the no-tap run-up (m1251) carries him up it -- tuned so a FULL zoom just reaches the lip and anything less falls short), a ledge / ring of bars at the top, a guard tower on the summit. A CHALLENGE: a timer, a mark of how close he got | (-60, -56) | 1 (m1254) · 2 (m1257) · 3 (m1258) DONE |
| R2 | **The Four Fires** | his: *"maybe four of these, and you extinguish the fire in each of them, and every time some wheel turns, and eventually it opens the drawbridge to the indoor something."* Four ramp towers (R1 again, each a different line up) round a sealed keep; a brazier burns on each summit -- strike it out and a great gear on the keep turns a quarter; all four and the drawbridge falls and the way INTO the chamber (R3) opens | around R1 | · · |
| R3 | **INTERIOR KIT -- the chamber** | his: *"interior pieces -- modular, so we can build levels where you go inside a giant chamber, like the start of Aladdin, down in the Cave of Wonders, the classic video game underground chamber you move forward through."* A KIT, not one building: a set of interior pieces that snap on the 4 m grid -- corridor (straight, corner, T), a great hall bay (tall, pillared), stairs/ramps down a level, an arch and a door, a pit with a bar across, a ledge run along a wall, a collapsing floor tile, a treasure dais, torches and glowing Jin crystals, a ceiling (the x-ray (m1250) lets the camera see in). Pass 1 = the pieces and one small chamber assembled from them below the forge floor (an entrance going down); pass 2 = the traps and function; pass 3 = the lighting and polish | under the forge | · · |
| R4 | **Floating platforms** | his (after m1251): *"general stuff like floating platforms."* A KIT of hovering stone-and-bronze slabs on Jin orbs (bobbing; some drift on a path, some tilt under his weight, some sink while he stands on them and rise when he leaves, some blink out on a beat) -- to string across gaps and up between the towers | anywhere (a test run near R1) | · · |
| R5 | **Drone sentries** | his: *"floating drone sentry guard enemies."* The forge's drone orbs (`bldDrone`) as ENEMIES: they patrol a beat, spot him (a red eye-beam), and strafe with bolts; killable (`bldHit`), they fall smoking and are rebuilt. Some fly in pairs. Hangs off every building that has a drone today | patrols round the forge | · · |
| R6 | **Crawling spider bots, loose** | his: *"crawling spider robots."* The Spider Hangar's bots (m1161) let OUT: they crawl up walls and over roofs anywhere in the forge, hunt him, pounce, and can be cut apart leg by leg | from the Spider Hangar | · · |
| R7 | **Robot sky dragon** | his: *"maybe a robot Chinese dragon."* A long segmented bronze-and-red dragon that FLIES -- snaking between the towers and zeppelins on a long loop, breathing a fire stream down at him; land on its back and ride it, cut its segments, take the head (the festival dragon (m1243) grown up and set loose) | over the forge | · · |
| R8 | **BOSS ARMOUR -- the beasts and warlords, bigger and modular** | his (after m1252): *"build armour for the guys we have -- the two warlords (not the CEO), the blue dragon, the lightning dragon, the three-headed dog. The dog needs to be WAY bigger, the dragon too, probably everything bigger. Armour pieces that can come OFF them; bulk up the dragons; give the warlords masks and helmets -- so when you meet them at new levels they're more stylised and harder to beat because there are more pieces. Big rock monsters, big machine goblin Jin, armoured warlords; maybe projectile weapons, minions crawling on them, sending out streams of spider attackers and flying drones."* The cast: `WARBOSS` (Brute Warboss) and `SKULLBACK` (Reptilian heavy); `DOG` (h 2.3 -- too small), `DRAGON` (Blue Dragon, h 3.2), `MECH` (Mech Lightning Dragon, h 2.2). **Plan:** (1) SIZE -- a per-kind boss scale (dog ~3x, dragons ~2x), with reach, hit radii and the camera following the size, put on a TOOLS switch so the size is his call; (2) a code-built ARMOUR KIT parented to their bones by name (helm, kabuto with crest, mempo mask, shoulder plates, chest plate, bracers, dragon spine plates and chin guards, a rock carapace) -- each piece has its own hp, takes a cut, CLANGS, and FLIES OFF (the dismember's debris), and the body under it only takes full damage once its plate is gone; an armour TIER per level (0 = bare, 1 = helm and shoulders, 2 = full, 3 = full + rock/machine growths); (3) their EXTRAS: a projectile per warlord, minions riding them (little spider bots on the dragon's back that drop off and crawl at him), and a DEN that spits a stream of spider bots and drones (R5, R6) while the boss lives | the arena's beasts / any level | · · |
| R9 | **DRESSING KIT -- vegetation and filler** | his (after m1255): *"filler things in line with this level: shrubbery, vegetation -- Japanese alien desert vegetation? -- variations that are subtly moving or subtly reactive, stylised and cool; and filler: pots, tables, benches, overhangs, things you stick on buildings; the flag design extrapolated into more, so the worlds feel stylised and cohesive; pergolas, whatever."* A KIT of small code-built pieces, each one draw call per material (instanced when repeated), placed by a `dress(kind, x, z, yaw, s)` call any building or level can use. **Plants** (the Red Hollows palette -- rust, sage, bone, a little Jin cyan): bonsai-pine clumps, red-leaf maple shrubs, spiky aloe-like agaves with glowing tips, barrel cacti with bronze bands, tall swaying reed/pampas tufts, hanging moss and wisteria (purple) off eaves, lantern-fruit bushes whose fruit glows, a crystal-thorn bush, bamboo clumps; all SWAY in the wind (a vertex shader, no per-frame CPU), and REACT -- they bend away as he runs through, shiver when hit, the lantern-fruit pops sparks, and they can be cut down (`bldHit`). **Filler**: pots and urns (smashable), low tables, benches, sake barrels, crates stacked, tea sets, paper lantern stands, stone lanterns (toro), shrine boxes, weapon racks, drums, wind chimes and bells that ring when brushed. **Things to stick on buildings**: awnings and overhangs (cloth and timber), noren door curtains, hanging banners in the white-diamond-spiral family (new variants: vertical nobori flags, a long streamer, a round crest, kanji panels, a torn war banner), rope-and-paper shimenawa, cable runs with tags, AC-like bronze boxes and pipes, neon signs, satellite dishes. **Structures**: a pergola with wisteria, a covered bench, a well, a gate arch, a fence run, steps. Pass 1 = 20 pieces and a showcase garden in the forge; pass 2 = the sway and reactions; pass 3 = dress every building already standing with them | a showcase garden at (60, -60) + every building | · · |

| R10 | **Monkey bars** | his (after m1292): *"we never really made the monkey bars -- the horizontal ladder."* A MOVE first, then pieces: hang from a rung (the bar catch) and travel hand over hand along a run of rungs with the left stick, swing-release off the end; then horizontal ladders spanning gaps between buildings, under bridges, across the courtyard's lane | wherever they connect things | · · |
## The queue

| # | building | function | spot | passes |
|---|---|---|---|---|
| 1 | **Dojo Hall** | breakable walls, door, curved hipped roof, bars out front | (0, -7.5) | 1 (m1116) · 2 (m1118) · 3 (m1119) DONE · 4 (m1167) · 5 (m1206) · 6 (m1230) |
| 2 | **Watchtower** | 3 storeys, ladders/ramps inside, a lookout deck, a bar off the top to swing from, a pagoda cap | (-16, -8) | 1 (m1120) · 2 (m1121) · 3 (m1123) DONE · 4 (m1169) · 5 (m1208) · 6 (m1232) |
| 3 | **Gatehouse** | a torii-cyber gate over a passage, walk along its top, a BALLISTA on the roof that fires bolts | (16, -8) | 1 (m1126) · 2 (m1127) · 3 (m1128) DONE · 4 (m1171) · 5 (m1210) · 6 (m1234) |
| 4 | **Pagoda** | five stacked roofs, a stair-ramp spiralling up inside, a bell at the top | (-16, 12) | 1 (m1133) · 2 (m1134) · 3 (m1135) DONE · 4 (m1173) · 5 (m1212) · 6 (m1236) |
| 5 | **Market Stall row** | open-front stalls under awnings, crates to break, lanterns, a noodle-bar counter, bars in the frame | (16, 12) | 1 (m1136) · 2 (m1137) · 3 (m1138) DONE · 4 (m1175) · 5 (m1214) · 6 (m1238) |
| 6 | **Shrine** | a raised platform up stone steps, a glowing core (the Jin), stone lanterns, a balance beam | (0, 24) | 1 (m1139) · 2 (m1141) · 3 (m1142) DONE · 4 (m1177) · 5 (m1216) · 6 (m1240) |
| 7 | **Rampart Wall** | a long walkable wall with crenels, a turret at each end, ramps up | (0, -24) | 1 (m1143) · 2 (m1144) · 3 (m1145) DONE · 4 (m1179) · 5 (m1218) · 6 (m1242) |
| 8 | **Airship Dock Tower** | a tall tower with a landing arm and a docked airship you can walk onto | (-30, 0) | 1 (m1146) · 2 (m1147) · 3 (m1148) DONE · 4 (m1181) · 5 (m1220) · 6 (m1244) |
| 9 | **Zeppelin** | floating zeppelins drifting over the forge, each with a GONDOLA you can JUMP ONTO (low enough to reach from the towers' lookouts and the rampart), a deck that carries you as it drifts, ropes/bars hanging to grab | (30, 0) floating | 1 (m1149) · 2 (m1150) · 3 (m1151) DONE · 4 (m1183) · 5 (m1222) · 6 (m1246) |
| 10 | **Flying Ship House** | a junk-ship hull with a house on deck, floating and bobbing, a gangplank ramp | (0, -40) floating | 1 (m1152) · 2 (m1153) · 3 (m1154) DONE · 4 (m1185) · 5 (m1224) · 6 (m1248) |
| 11 | **Bathhouse** | a steaming pool inside, a chimney, sliding screens | (-30, 24) | 1 (m1155) · 2 (m1156) · 3 (m1157) DONE · 4 (m1187) |
| 12 | **Forge-Workshop** | a bronze furnace glowing, gears turning, a crane arm (a bar) | (30, 24) | 1 (m1158) · 2 (m1159) · 3 (m1160) DONE · 4 (m1189) |
| 13 | **Spider-Bot Hangar** | a low bunker the six-legged spider robots come out of; the SPIDER BOTS CLIMB THE WALLS of every building (his: "spider robots climbing the walls") -- up the faces, across the roofs, over the beams | (-30, -24) | 1 (m1162) · 2 (m1163) · 3 (m1164) DONE · 4 (m1191) |
| -- | **NINJA GRAPPLING HOOK** (his: "ninja grappling hooks to swing between buildings") | a player move, not a building: bronze GRAPPLE RINGS on every building's eaves, beams and lookouts; a gesture (in the air, the right pad flicked UP toward a ring in reach -- the air flick up is free) throws the hook, he swings on the rope like the high bar and lets go to fly; slotted in after the Gatehouse so there are three buildings to swing between | -- | 1 (m1129) · 2 (m1130) · 3 (m1131) DONE |
| -- | **The forge's horizon** | snowy white-capped mountains round the forge (one pass, slotted in after the Gatehouse) | -- | 1 (m1132) DONE |

## Set 2 (brainstormed m1165, after the first set finished)

His style notes still rule: big, vertical, climbable, linked at height, manned and killable, Japanese-alien-cyber. The loop now ALTERNATES:
a pass on the next Set 2 item, then an extra pass (4-6) on a done building, oldest first (Hall, Watchtower, Gatehouse, ...).

| # | building | function | spot | passes |
|---|---|---|---|---|
| 14 | **Sky Bridges** | the first set LINKED AT HEIGHT: a rope bridge Watchtower lookout -> Pagoda storey 3, a timber cross-beam Pagoda -> Airship Dock arm, a swaying plank bridge Gatehouse deck -> Market roof; each with lanterns and rings (spawns only the spans whose two ends are standing) | between | 1 (m1166) · 2 (m1168) · 3 (m1170) DONE · 4 (m1193) |
| 15 | **Cliff Lodge** | the zen mountain samurai lodge: a 12 m rock crag with a switchback path cut up it, a timber lodge on top with deep eaves, a waterfall pouring off the crag into a pool, a lookout perch | (0, 46) | 1 (m1172) · 2 (m1174) · 3 (m1176) DONE · 4 (m1195) |
| 16 | **Moated Keep** | a square keep in a raised stone moat ring; a DRAWBRIDGE you lower by striking the gong at the gate (raise it from inside); murder-holes, a roof turret | (46, 0) | 1 (m1178) · 2 (m1180) · 3 (m1182) DONE · 4 (m1197) |
| 17 | **Robot Samurai Barracks** | a drill yard with training dummies, a long barracks hall, robotic guards drilling in step, a weapon store, an archery butt | (30, -42) | 1 (m1184) · 2 (m1186) · 3 (m1188) DONE · 4 (m1199) |
| 18 | **Jin Lighthouse** | a tall slim tower with a spiral stair outside, a lantern room whose Jin beam sweeps the whole forge, a gallery to walk round, a ring at the top | (-46, 30) | 1 (m1190) · 2 (m1192) · 3 (m1194) DONE · 4 (m1201) |
| 19 | **Floating Islands** | three rock islands hanging in the air on chains, waterfalls off their edges, rope bridges between them, a shrine on the highest; reach them by grapple or a zeppelin | (44, 32) | 1 (m1196) · 2 (m1198) · 3 (m1200) DONE · 4 (m1203) |
| 20 | **Ninja Pillars** | a field of narrow stone pillars at stepped heights (1-8 m) to leap between, bars strung between the tallest, a bell on top of the last | (30, 46) | 1 (m1202) · 2 (m1204) · 3 (m1205) DONE |
| 21 | **Senbon Torii** | a corridor of twenty vermilion torii up a long gentle slope to a small fox shrine; lanterns along it; at night-ish the gates glow | (-30, 46) | 1 (m1207) · 2 (m1209) · 3 (m1211) DONE |
| 22 | **Siege Yard** | a TREBUCHET that winds and lobs boulders across the forge on a cycle (they smash, knock bodies down; parry? no -- dodge), a ballista battery, a palisade | (-46, -36) | 1 (m1213) · 2 (m1215) · 3 (m1217) DONE |
| 23 | **Teahouse Garden** | a teahouse on stilts over a pond, a MOON BRIDGE (high arched, walkable) across it, stepping stones, a raked-gravel garden, a stone basin | (-47, 8) | 1 (m1219) · 2 (m1221) · 3 (m1223) DONE |
| 24 | **Kneeling Colossus** | a giant ruined robot samurai statue kneeling, CLIMBABLE: up its thigh, a ramp along its forearm to the shoulder, a lookout in its open head, its sword planted as a bar-strung tower | (50, -26) (moved: (38, -44) is the Barracks) | 1 (m1225) · 2 (m1226) · 3 (m1227) DONE |

## Set 3 (brainstormed m1228, after Set 2 finished)

Set 2 filled the forge's middle, so Set 3 rings it further out, about 60 to 75 m from the centre. His style notes still rule: big,
vertical, climbable, linked at height, manned and killable, Japanese-alien-cyber, with an inside and an outside. The loop
ALTERNATES as before: a pass on the next Set 3 item, then an extra pass (6) on a done building, oldest first.

| # | building | function | spot | passes |
|---|---|---|---|---|
| 25 | **Oni Gate** | a fortress gate carved as a giant demon face: you go in through its mouth (a portcullis of teeth), its two eyes are turrets that track and fire (killable), horns you can climb to a lookout, a guard room inside each cheek | (-72, 0) | 1 (m1229) · 2 (m1231) · 3 (m1233) DONE |
| 26 | **Jin Observatory** | a tall clockwork tower crowned by a rotating dome with a great telescope; gears and a spiral stair inside, a balcony ring, the dome turns to track whoever is in the open (a beam that marks him for the archers) | (72, -18) | 1 (m1235) · 2 (m1237) · 3 (m1239) DONE |
| 27 | **Lantern Festival Street** | a street of stalls under hundreds of hanging lanterns, a robot DRAGON DANCE parading up and down it (it knocks you aside, it can be cut apart segment by segment), firework launchers you can set off | (72, 30) | 1 (m1241) · 2 (m1243) · 3 (m1245) DONE |
| 28 | **Sky Wreck** | the broken hull of a great flying junk impaled on rock spires, decks tilted, holds to explore, loose cargo to smash, a Jin engine still sparking that blasts you up when struck | (30, -72) | 1 (m1247) · 2 · 3 |
| 29 | **Bamboo Maze** | tall living bamboo walls in a maze (breakable stalks), ninja that drop from the canopy, a moon-gate shrine at the heart with a prize | (-30, -72) | · · |
| 30 | **Waterwheel Mill** | a river channel with a giant waterwheel you can ride round (its paddles are platforms), a mill house with grinding gears inside, an aqueduct on arches walkable at height | (-72, 40) | · · |
| 31 | **Mech Hangar** | a giant bipedal mech under repair in a gantry; climb the gantry levels, the mech wakes and stomps a short patrol (a boss: armour plates to cut off, a core to strike) | (60, 62) | · · |
| 32 | **Sumo Dohyo** | a raised clay ring under a hanging roof, a sumo robot that charges and shoves (ring-out matters: off the edge is a fall), drums and banners round it | (-60, 68) | · · |
| 33 | **Dragon Bell Tower** | a great bronze bell in a tall open tower; ring it and a Jin DRAGON flies a pass over the forge, scattering bodies where its shadow falls | (0, -74) | · · |
| 34 | **Jin Tram Line** | an elevated rail looping the outer ring on pillars with two stations; a tram car runs it you can ride (and jump off anywhere), ladders up to each station | (0, 72) station | · · |
| 35 | **Onsen Terraces** | stepped hot-spring pools down a hillside, each a terrace you jump between, steam geysers that launch you up a level, a bathhouse at the top | (-72, -40) | · · |

