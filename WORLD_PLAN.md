# WORLD PLAN -- how every region, temple and area is built (Colin, Nov 4 2026)

His brain-dump of Nov 4, organised. Nothing here is built yet; it is the standard to build TO. Lore lines are his ideas
("open") and sit beside KORAJIN.md, not over it.

## 1. THE KIT BEFORE THE PLACE (his workflow rule)
Every new area starts as its own **KIT SANDBOX** (white floor, everything laid out in rows), finished BEFORE the area is
sculpted. Then the area is sculpted and art-directed by placing finished pieces. Each kit has a look sheet (palette, day
AND night look, the Jinra glow it carries) and a triangle budget per item.

The kit list (his, plus brainstorm -- trim per region):
- **Plants**: ~6 species, each with several passes: shape, texture, sway/interaction (push aside, rustle), break/cut,
  a night glow (veins, tips, spores). Small (ground cover, flowers) / medium (ferns, bushes) / large (trees, giant flora).
- **Rocks**: several species x small / medium / large / cliff pieces; textured; breakable small ones; kickable pebbles;
  moss and snow caps; glowing cracks at night; FLOATING variants (see 5).
- **Ground**: grass, moss, dirt, sand, path stones, puddles, ground-cover scatter, fallen leaves/petals, decals (cracks,
  runes, stains); surface sounds for each (footsteps already have the system).
- **Water**: pools, streams, falls, a lily or reed set; Jinra streams.
- **Props**: pots, crates, barrels, benches, lanterns, gazebos, torii, shrines, fences/rails, bridges, banners, chests,
  doors -- breakables marked; every interactable gets the standard marker (see UI).
- **Architecture**: the region's building style as modular pieces (walls, roofs, stairs at <= .32 m risers, columns,
  arches, balconies, ladders), with a ruined/Hollowed variant of each.
- **Life**: ambient creatures (birds, fish, insects, fireflies), NPC villagers, the region's enemy set (see 3).
- **Atmosphere**: sky, fog, weather, particles (petals, snow, embers, spores), ambient sound bed, the region's music.

## 2. THE REGION TEMPLATE (every region has)
- A **VILLAGE / town centre** (NPCs, a shop, a shrine checkpoint, a quest-giver, a rest spot).
- A **TEMPLE** (outside is the tip of the iceberg; the real temple is inside / underground), guarded, holding a
  **JINRA STONE** (see 4) and a boss.
- **ONE UNIQUE THING** only that region has (snow: a mountain you climb to a master at the top who grants a power;
  another: a great wall; another: a giant ruin, a colossus, a bridge to nowhere...).
- A **traversal toy** (snow: sledding / ice slides; forest: giant mushrooms and lily pads; water: the boat).
- A **NEW POWER or WEAPON** earned there, presented with the **GET moment** (a "hold it up" animation, like collecting a
  star: for every crystal, weapon and power -- standardise it once).
- Connections: beaches, water channels, bridges, gates to neighbouring regions (open world later -- seamless loading).

**Regions (draft order, elements):** start with 4, stretch to 6, then the final boss region.
1. Forest / Grow (the GIANT realm: you feel small -- huge mushrooms with glowing spots to bounce on, giant lily pads that
   sink as you stand, vines to swing on, treehouse villages built into giant trees)
2. Snow (the Snowfield: mountain climb, frozen falls, aurora nights)
3. Water (the Lake and beyond: the longboat, islands, temples in the water, a sea colossus)
4. Fire / Stone (the Red Hollows: rock, lava, forges)
5. Sand (optional)
6. AIR -- last before the boss: the floating realm. Tame the dragon on the ground, fly up; beating it earns the
   glider/wingsuit (late on purpose: the game leans on NOT flying everywhere).
Final: the Hollow Emperor's region.

## 3. THE TEMPLE ROSTER (standard per temple: 6 enemy types + 1 boss)
- **Melee small** (fast sword/claw grunt)   - **Melee big** (heavy brute, armour, guard-breaks)
- **Ranged A** (archer: arrows you can block / parry / return)   - **Ranged B** (caster/thrower: arcing or area shots)
- **Creature A** (beast / swarm)   - **Creature B** (flyer or burrower -- forces you to look up/down)
- **BOSS** (a big set-piece; see 6) who gives back the temple's Jinra stone.
Every enemy also has its STONE TWIN (statue form, see CLAUDE.md) and a night glow pattern (pieces, never a full wash).
This is the bake list he can work from for the first temple.

## 4. LORE IDEAS (his, Nov 4, open)
- **JINRA STONES**: Jinra crystallises into giant stones. Stones in places round the kingdom hold the whole floating realm
  up, tied to the RESONANCE of the BELLS. The Hollow disrupted/stole them; they're kept in the temples. The game is
  retrieving the stones and putting them back so the floating world runs again.
- **GUARDIANS**: giant statues linked by Jinra streams, shown at the start; toppled and co-opted by the Hollow (its power
  turns Jinra another colour -- red? open). You fight them, then restore them. Temples become fallen / evil temples.
- **GRUMBO'S RISE**: a JINRA METER. As it fills he glows more; things near him begin to float (pebbles lift as he walks,
  rocks drift aside, a swirl of debris round him). Spend it: a force push that blows through boulder-sealed canyon gates,
  a super sword attack, a float/lift. Late game he barely walks -- he hovers in a swirling force field.

## 5. SANDBOXES HE WANTS
- **FLOATING BOULDERS**: boulders of many sizes floating just off the ground, bobbing gracefully; walking through pushes
  them aside with a slight heaviness; you can bump, slash and break them. Later reused for the Jinra-meter float effect.
- **ACROBATIC TEMPLE ROOM** (from the Wall Park lessons): one room, three storeys. Get up to the first rim, fight
  archers across the gap, wall-run to the next ledge, a melee scrap, climb on; at the top a button opens a door back on
  the ground floor -- go back down, last fight, room cleared. Uses everything: wall runs, moving platforms, tightrope,
  monkey bars, high bar; buttons, arrow-triggered switches, a success chime (Zelda-style).
- **COLOSSUS BOSS ARENA**: a boss ~100x his size in a cavern with a rim to run round. Hits bounce off until you find the
  weak point; it slams a hand that sticks -> attack the hand -> it drops its head -> attack the head; repeat 3-4 times,
  harder each cycle; final blow; it gives up a Jinra stone (GET moment).
- **LEVEL IDEAS**: an Ezekiel wheel (a giant spinning multi-ring wheel level); a giant bridge to nowhere.

## 6. CONTROLS
- **GAMEPAD**: map every action through one action table so the touch layout and a pad read the same bindings and stay in
  sync automatically. On a pad the right stick is ONLY the camera; the buttons do what the right pad's gestures do.

## 7. JINRA COLOURS, CRYSTALS, SHARDS AND TEMPLE DOORS (his, Nov 4, open)
- **Jinra comes in colours**, each a power type (e.g. yellow / purple / green / red / blue -- fewer is fine), likely ONE COLOUR PER TEMPLE.
  The colours BALANCE each other (lore: the world's powers held in balance). (Tech: JPAL is one palette today; a per-power palette row
  per colour later -- keep every glow routed through JPAL so a colour can be swapped per region/power.)
- **The power crystals** harness each colour. Sky temples form a GRID round the world and beam energy between them -- a protective
  shield that also keeps everything floating. The crystals were stolen at the start; the game is getting them back.
- **SHARDS** of the greater crystals are collected; **a shard opens a temple door**.
- **THE DOOR RITUAL (standard for every temple)**: walk up -> the interact chevron -> tap -> a short automatic sequence (camera eases a
  little closer, he walks up, takes the shard from his bag, sets it into its socket) -> the door lights up (runes, its temple's Jinra
  colour) -> the giant stone door / blocking rock FLOATS up and out of the way -> the special "you opened something" sound -> walk in.
  **BUILT (m2446): `DOORR`, one row per door** -- first on the Forest Temple. NOTES.md m2446.
- **Puzzles** for smaller doors inside temples -- designed when we reach them.

## 8. THE GATHERING -- charging the crystal after a boss (his idea, Nov 4, "not 100% sold", open)
After a temple's boss: the arena is ringed by 6-8 big torches burning with that temple's Jinra. In the centre he holds up the
crystal (a press or a pedestal), the Jinra is drawn out of every torch in streams into it, and the nearly clear crystal fills with the
temple's colour and glows -- that charged crystal is what opens the way onward. The world answers: the Jinra glow drains out of
the room, the torches drop to ordinary warm fire; and when he steps outside the REGION has changed -- night lifts to day, a blizzard
clears to sun (the RESTORATION shown as weather). **REVISED (his, same day): keep the day/dusk/night CYCLE -- it may itself be lore: the
world's instability, time sped up as the stability is drained. So the signifier is NOT weather/time: it is the FALLEN -> REJUVENATED look
(as the Red Hollows' fallen/unfallen states already do): fallen = dusty, eerie red, withered, murky water; rejuvenated = plants grow back,
colour returns, clear water, the glow is healthy. TWO MOMENTS: (1) the Gathering in the temple rejuvenates the REGION; (2) returning the
charged crystal to its sky temple restores the FALLEN CITIES -- they float again, rebuilt, not destroyed.** Tech: NIGHT.f and the weather tables can already be driven by a script, the streams
are FX goop ribbons, the torches are nightGlow/JPAL rows; the "hold it up" pose is the standard GET moment.

## 9. OPEN WORLD + PROGRESSION (his question, Nov 4; recommendation, open)
Regions connected by land and by WATER CHANNELS (sail between them; fly later). Recommended shape: **open, but GATED BY ABILITIES**
(the Metroid/Zelda way) -- you can walk to almost everything early, but:
- **Temples** need their crystal SHARDS to open (the door ritual) -- you can reach every temple's door, not enter it.
- **Traversal gates**, each lifted by a power/tool earned in a temple:
  - the BOAT (early) opens the water channels;
  - a JINRA FORCE PUSH breaks the boulders sealing certain canyons;
  - DIVE / underwater breath opens sunken ruins;
  - wall-run upgrades / grapple reach high ledges;
  - the DRAGON, then the GLIDER/WINGSUIT (late, from the AIR region) open the sky islands -- late on purpose.
- **Soft gates**: tougher enemies and hazards (cold, heat, storms) warn you off before you're ready, without walls.
- **Shape**: a short linear start (prologue garden -> the first region + temple as the tutorial), then the next 2-3 regions in
  the player's chosen order (each temple's power opens part of another), then AIR, then the final region.
- The world map's first job is a rough BLOCKOUT (shapes only) to set scale, the channels, and where each gate sits.
