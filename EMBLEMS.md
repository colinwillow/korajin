# KORAJIN EMBLEMS (v1, Nov 6 2026 -- for his pick; no game code until he chooses)

*"We should settle on emblems for each element temple, emblems for the enemy, and emblems for the hero before we get too far, so everything is
really concrete and has a colour and an emblem... different villages might have different emblems."* And: *"I love the all-seeing eye -- Lord
of the Rings, the Egyptian eye (Horus), the illuminati eye. Work it into a temple or a boss: maybe the enemy is a swirling eyeball that
possesses different things. It could also be an emblem."*

**The sheet:** `images/emblems/sheet_v1.png`. Each emblem is a one-colour SVG (`images/emblems/<id>.svg`, `currentColor`, 100 x 100) shown in its
colour pair and as a 48 px stamp, dark-on-cream and cream-on-dark. Where there are letters (HERO, ENEMY EYE, FOREST), **he picks one**.

**The rules the set keeps:**
- **MINT IS ONLY JINRA** (BUILDINGS.md, JINRA_COLOUR.md). No temple or people uses the mint `#7affd8`; per-temple Jinra colours (WORLD_PLAN 7)
  are the temples' own pairs below.
- **PURPLE IS ONLY THE HOLLOW** (KORAJIN.md: "only his purple" in the prologue). Nothing friendly is purple.
- **Hero shapes are SQUARE AND ROUNDED** (the square spiral, nested diamonds, rings: the red-and-cream banner family); **enemy shapes are
  POINTED** (triangle, almond, spikes, spires) -- ENEMY_BRIEF's "sharp, angular crest, distinct from the heroes'".
- **One drawing style:** flat fills and ~5-7 % strokes on a 100 grid, no gradients, readable at 48 px, works as a single-colour stamp
  (a decal, a carved door, a banner print) and in its pair (a HUD chip, a loading card).

| id | faction | motif (one sentence) | colour pair (motif / ground) | shape language | where it shows |
|---|---|---|---|---|---|
| `hero_a` / `_b` / `_c` | **THE HERO -- the Korajin lineage** | A: the square spiral inside the diamond (the sky people's old sign); B: nested diamonds with a spark at the heart; C: the sword standing in a rayed sun. | `#c8242c` red / `#f4e9d8` cream (the title's) | square, rounded, nested | the title and loading card, banners (the white-diamond-spiral family), Grumbo's armour plate, the HUD, save slots, friendly doors and shrines |
| `jinra` | **JINRA** -- the living essence | A drop of Jinra with a hollow heart, three motes rising off it. | `#7affd8` mint / `#0f3d34` deep jade | a soft drop, round motes | the Jinra meter and pickups, crystal sockets, shard icons, shrine checkpoints, the GET card |
| `eye_a` / `_b` / `_c` | **THE ENEMY -- Vorakai and the Hollow** | **The all-seeing eye** with a slit pupil -- A: in the pointed triangle; B: a VORTEX iris (the Hollow's swirl) under a crown of spikes; C: a hollowed Horus eye with its brow and tail. | `#a46bff` Hollow purple / `#120a1f` void | pointed: triangle, almond, spikes | Hollow banners (black lacquer + gold print on his fortresses, ENEMY_STYLE), torch-tower crests, the eye that opens on a POSSESSED statue or object, enemy HUD tags, the boss arena floor of every Hollow-held temple |
| `citadel` | **THE FINALE -- Vorakai's citadel** | The eye set in three black spires. | `#d4a83a` gold / `#0b0a0e` black lacquer | spires, gold on black | the citadel's gates and floor, the final loading card, the last boss's arena |
| `forest_a` / `_b` / `_c` | **FOREST TEMPLE** (Grow, the giant realm) | A: three leaves turning round a ring; B: the seed, its sprout and its spiralling root; C: the giant spotted mushroom. | `#9ccc4a` leaf / `#1f2e12` loam | organic, three-fold | the temple door (the door ritual's socket glows in it), its shard, the region's loading card, the Gathering's torches, the boss arena floor |
| `fire` | **DESERT / FIRE TEMPLE** (the Sunwell's sands) | The sun over the pyramid, its inner chamber cut out. | `#f2a63a` amber / `#5a200c` ember | triangle under a disc | door, shard, pyramid halos (WORLD_PLAN 10), loading card, arena floor |
| `water` | **LAKE / WATER TEMPLE** | Three wave crests stacked in a ring (seigaiha). | `#5ab4f0` water / `#0c2a46` depth | arcs | door, shard, the boat's pennant, loading card, arena floor |
| `ice` | **SNOW / ICE TEMPLE** | The six-armed crystal. | `#d6efff` ice / `#22384c` slate | six-fold, sharp but even | door, shard, loading card, arena floor |
| `sky` | **SKY TEMPLE** (Air, last before the finale) | The winged bell -- the bells whose resonance holds the realm up (WORLD_PLAN 4). | `#ffe9a8` pale gold / `#3b5b96` sky | a bell, two wings | door, shard, sky-temple grid beacons, loading card, arena floor |
| `deep` | **THE DEEP** (the underground temple) | Three chevrons stepping down to a crystal. | `#e0904a` lamp-ochre / `#1b1714` basalt | descending chevrons | door, shard, loading card, arena floor -- **the EYE BOSS's temple (below)** |
| `akatani` | **AKATANI** -- Grumbo's people, the red valley | The red canyon with its ember above. | `#ff6a3d` ember / `#2a100c` canyon | mountains, a flame | the home village's banners, the uncle's door, the prologue's waking statue plinth |
| `forestfolk` | **FOREST FOLK** -- the moss-and-bark weavers | A woven knot: two rounded squares through each other. | `#c2d97a` moss / `#2e2a18` bark | woven, rounded | treehouse village banners, shop signs, weavers' cloth |
| `sunwell` | **THE SUNWELL** -- the desert toads (built) | The sun rising over the well. | `#ffd36b` sun / `#6e3a14` clay | a ring, rays | the Sunwell's plinth, awnings, shop signs (DESERT_VILLAGE.md) |
| `waterfolk` | **WATER FOLK** -- stilt and houseboat people | The stilt house standing in the waves. | `#8fe0ea` shallows / `#163848` deep | a roof, stilts, a wave line | boat sails, stilt-house doors, the ferry |
| `snowfolk` | **SNOW FOLK** -- the fur-clad herders | The mammoth's face: its ears, trunk and tusks. | `#eef3f8` snow / `#4a3a30` fur | rounded, heavy | the snow village (SNOW_VILLAGE.md), mammoth saddle cloth, hut doors |
| `skyfolk` | **SKY FOLK** -- the kite riders | The kite and the bows on its tail. | `#ffb9cf` blossom / `#2b3a6c` dusk | a diamond and a tail | kites, sky-island banners, gliders |

## THE ALL-SEEING EYE -- the enemy's sign, and its boss
- **Vorakai's sigil IS the eye.** The Hollow does not walk into a place; it LOOKS into it. Where the Hollow takes something -- a statue, a
  guardian, a gate, a lantern, a stone twin (STATUES.md) -- a slit-pupil eye OPENS on it in Hollow purple, and the thing wakes. That ties the
  emblem to a mechanic: the eye on a statue is the "it is about to wake" tell, and the stone twins waking on an EVENT (CLAUDE.md) become the eye
  arriving. Breaking a possessed thing closes its eye (the purple drains out, the Jinra returns to mint -- the guardians "restored").
- **The eye is the HUD tag for possessed things,** the crest on every Hollow fortress (gold print on black lacquer), and the floor of every
  Hollow-held boss arena (a huge inlaid eye whose pupil follows Grumbo).

### THE EYE BOSS -- "THE WATCHER BELOW", in THE DEEP (the underground temple) -- with his take (Nov 6)
Pick: **the Deep**, because darkness is where an eye is scariest and the temple is full of things to possess. A dark round vault ringed with
dormant stone statues, hanging lanterns and a great bronze bell; Grumbo's light and the Jinra glow are the only light.
- **IT BLOCKS BY CLOSING ITS EYE (his).** A floating purple eyeball whose lid is armour: arrows and slashes GLANCE OFF the shut lid (a spark, a
  clang, no damage). **Shooting at it makes it close** -- so brute force teaches you it is the wrong answer.
- **IT ATTACKS BY THROWING THINGS (his):** summoned **BIG HANDS** (stone / shadow hands rising out of the floor and walls that grab, slam and
  swipe -- jump the swipe, roll the slam, break a grab), and **possessed objects**: it HOPS into a statue, a lantern cluster or the bell and that
  thing attacks in its own way (a statue swings, the lanterns rain fire, the bell's toll is a shockwave to jump).
- **THE CORE VERB: HOLD THE EYE OPEN WITH LIGHT (his).** Catch a shaft of light and SHINE it into the eye -- **reflected off a shield or the
  temple's Jinra mirror** -- and while it is DAZZLED (or staring at a distraction) **it cannot close**: now arrows and the sword land. The room
  feeds the verb: beams through cracks in the ceiling, lanterns you can light, crystals that split a beam; the eye learns to hide in the dark
  (it possesses the far statues), so later phases need two bounces, or to light a lantern first.
- **PHASES:** 1 -- one beam, one possessed thing at a time; 2 -- two at once and the hands join in; 3 -- the vault darkens as statues fall, the
  light must be bounced off two mirrors. **FINISH (kept):** dazzled and wounded, it flees into the great bell; one Jinra-charged strike rings it,
  the eye shatters, the purple drains out of every statue and they kneel. It gives up the Deep's crystal (the GET moment).
- **IT NEEDS A REFLECT / SHINE TOOL.** The ICE SHIELD already reflects beams (the Reflection sandbox, `zone=cell&cell=RF`: raise the shield in a
  beam, bounce it into a crystal). **Flag (his call): make the Deep's ITEM a JINRA MIRROR / lantern-shield** -- the way the VINE WHIP is the
  forest's -- earned in the Deep's first rooms (teach: bounce a beam to open a door; test: light a dark room; twist: dazzle the Watcher). Or
  reuse the ice shield and give the Deep a different item; the mirror is the cleaner "this temple's verb".

## OPEN (his picks)
- HERO A / B / C, ENEMY EYE A / B / C, FOREST A / B / C.
- The enemy's built-world palette is still ENEMY_BRIEF's A / B / C; this sheet uses Hollow purple for the eye and black + gold for the citadel.
- Which element each per-temple Jinra colour is (WORLD_PLAN 7) -- these pairs are a first proposal, one per temple, none mint, none purple.
