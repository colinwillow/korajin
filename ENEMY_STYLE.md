# THE ENEMY STYLE GUIDE: the building guide for enemy places (his sheets, Oct 28 2026)

**References:** `images/korajin/ref/enemy_style_1.jpg` and `enemy_style_2.jpg`. These are his generated style sheets, made from `ENEMY_BRIEF.md`. Read them first.
**Story:** KORAJIN.md, THE ENEMY. Ancient constructs of stone and terracotta, powered by STOLEN Jinra. They guard the drained essence and keep the people asleep. The architecture is **heavy, angular, monumental**.

**The rule that comes first:** enemy places are for DESTROYING. They are never FALLEN or RESTORED and they never float (KORAJIN.md, OURS vs THEIRS). Every enemy building is **destructible**, and its keystones (the torch tower's brazier, the shrine's core) are the payoff. Torn down, they make way for our SACRED buildings.

## Palette: BLACK AND GOLD (A), his pick, Oct 28 2026
**DECIDED: black lacquer and aged gold** (*"Black and gold"*). B and C are retired. The palette still lives in ONE place in code, `ENEMY.pal`.

| role | colour | used for |
|---|---|---|
| lacquer | `#1b1916` near-black, a little warm | timber, roof tiles, banners, frames, pillars |
| gold | `#c99a3e` dull aged gold, metallic | the emblem, roof ridge ends and finials, trim bands, studs, lantern caps |
| stone | `#cdb48c` pale sandstone | battered bases, walls, stairs, statues |
| terracotta | `#b07a52` | constructs, statues, accents |
| iron | `#2a2724` | chains, brackets, lantern cages, braziers |
| stolen Jinra | `#7affd8` mint, emissive | brazier fire, lantern glass, core chambers, cracks and seams. The ONE glowing colour |

**Never use our colours:** no red cloth, no cream-diamond banners, no domes, no striped tent cones, no ship wheels.

## The emblem
A sharp **gold crest**: a vertical spear-blade diamond with two swept wing-blades and a hollow diamond at its heart, pointing down like a fang. It goes on banners, gate lintels, roof crests and statues. `enemyEmblemTex()` draws it.

## The kit (his sheets' "architecture kit")
- **ROOFS:** classical Japanese curved hip and gable roofs in BLACK tile, the eaves upturned, GOLD ridge ends and finials. Stacked tiers on keeps.
- **WALLS and BASES:** battered (sloping) SANDSTONE block bases, very heavy. Upper walls in black lacquer timber framing with gold studs.
- **GATES:** tall black timber gateways on stone piers, a deep lintel carrying the emblem, banners hanging in the opening, flanked by SPHINX guardians.
- **WALKWAYS:** black timber bridges on stone piers, linking towers. These are routes for the climb (verticality).
- **BRAZIERS and LANTERNS:** black iron, Jinra-mint glass, gold caps; standing lanterns on posts, hanging lanterns on chains.
- **STATUES and DECOR:** sphinx-like stone guardians (lion bodies, masked faces), terracotta soldier statues, carved masks on pillars.
- **BANNERS:** tall, black, a gold border, the gold emblem, ragged and pointed hems, hung from black crossbars with gold finials.

## The five buildings (each a level's set piece)
1. **TORCH TOWER:** the landmark of every base and the level's FINALE (KORAJIN.md, THE JINRA BEACONS). A square, tapering black-and-stone tower on a battered base. Banners on every face, a giant bronze-and-iron brazier crowning it with MINT Jinra fire and chains to the corners, small pavilions at its feet. The climb to the brazier is the finale; lighting it flips the fire.
2. **FORTRESS KEEP:** the command centre and the highest point; many levels. Stacked roof tiers on a massive stone base, walkways and balconies (rims to hang on, bars to swing up), sphinx guardians at the door.
3. **FORTIFIED GATE:** the heavily defended entrance. Twin stone piers with sphinx statues, a black gate tower with the emblem lintel, banners, lanterns; a gallery on top to climb to.
4. **BARRACKS:** a long hall where constructs stand DORMANT in rows behind black pillars, under a black roof with gold trim and lanterns along the eave. A fight waking up.
5. **JINRA SHRINE:** where the essence is drained and stored. A stepped stone stair to a core chamber where the mint column or tank glows, pipes running out, sphinx statues and obelisks flanking, banners.

## The constructs (for the character pipeline)
- **FOOT SOLDIER:** terracotta, a spear, a mint core in the chest. The basic enemy.
- **ARCHER:** terracotta, a bow with a mint arrow. Ranged; takes the high ground.
- **SPHINX BEAST:** stone, four-legged, a masked face. Fast and powerful.
- **GIANT:** massive stone and terracotta construct. The boss enemy.

The glow is always mint, showing through the chest core, the eyes and the joints. Breaking them makes Jinra seep out (built: `jinraEmit`).

## How to build them in code
- **Materials:** `enemyMats()` (index.html, beside `korMats`). It gives `lacquer`, `gold`, `stone` (triplanar sandstone), `terra`, `iron`, `roof` (triplanar black tiles), `jin` (the mint glow, unlit), `glass` (mint lantern glass) and `banner` (black cloth with the gold emblem). The palette lives in `ENEMY.pal`.
- **Banners:** `enemyBanner(put, M, x, y, z, ry, w, h)`.
- **Our rules still hold:**
  - VERTICALITY (CLAUDE.md): tiers, and routes that climb
  - the layers (LEVELDESIGN.md)
  - about 40 draws a building
  - breakable parts kept as separate meshes or ranges
  - stairs at .32 m risers or less
