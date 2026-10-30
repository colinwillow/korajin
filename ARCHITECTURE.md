# KORAJIN ARCHITECTURE: our own vocabulary (his, after m1407)

> *"All the buildings we've already made, we're gonna do a full new set of passes and make them more in THIS game style. We're starting to develop a
> vocabulary of what these buildings look like, rather than the originals (the guard tower and the rest), which were built from other games'
> representations of Japanese architecture -- a great starting place, but now we have an architecture of our own. Enemy bases probably shouldn't
> be in this style: this is the HERO style, my dojo, my home. The enemy would have different architecture, definitely different colours, but a
> similar general style."*

**The references:**
- `images/korajin/ref/vocab_1..4.jpg`: Worker B's procedural build of his home (Red Hollows), and Worker A's ship.
- `grumbo_home_1..4.jpg`: his source art for the home.

**The rule:** new buildings, and the re-passes of the old ones, are made from THIS kit, not from generic pagodas, torii and paper lanterns.

## The hero kit (Grumbo, the dojo, his home, his ship)

| element | what it is | made from |
|---|---|---|
| **DOMES** | rounded, slightly squashed cream sandstone masses, clustered (a big one, a middle one, small blobs), banded with dark timber rings | `sandstone` (cream, lavender spots), `wood_timber` rings |
| **TENT CONE** | the crown: a tall cone of alternating RED and CREAM panels, a diamond motif on the red, dark timber ribs down every seam, a timber-and-iron finial with spokes | `red_cloth`, sandstone cream, `wood_timber` |
| **BRONZE STACKS** | chimneys: a stack of bronze cylinders with dark rings and a cap; smoke | `bronze`, dark iron |
| **SHIP'S WHEELS** | brass wheels mounted on facades and frames (spokes, a hub, a rim) | `bronze` |
| **TIMBER SCAFFOLD** | dark timber posts and beams, lashed at the joints with dark iron bands; frames round the domes, stalls, balconies | `wood_timber`, dark iron |
| **AWNINGS** | red cloth with a CREAM ZIGZAG band and diamonds, sagging between posts, a scalloped edge | `red_cloth` |
| **BANNERS** | hanging red banners with cream DIAMOND / CHEVRON motifs, on poles with a crossbar | `red_cloth` |
| **BUNTING** | strings of small red and cream triangle pennants between posts and the cone | red / cream |
| **LANTERNS** | warm yellow-orange BOX lanterns in dark frames, hanging from beams; grey STONE lanterns on the ground | emissive, stone |
| **CRANE + ORB** | a timber crane arm with a hanging brass ORB and a red tassel (knockable) | `wood_timber`, `bronze`, red |
| **PORTHOLES** | round windows with a lavender rim | sandstone, lavender |
| **SHIP PARTS** | dark lacquered wood with RED bands and gold lines; red sails with battens and the cream SQUARE-SPIRAL emblem; rope ladders; crow's nests; bronze spiked cannons; stepped dark-blue tile roofs on a cabin | `wood_planks`, red, `bronze`, `roof_tiles` |
| **GROUND** | boulders of the same sandstone, cacti and agaves (the Red Hollows); cherry trees and pines in the sky | `floatIsland` / `islandDress` |

**Palette:**
- cream sandstone, with lavender in the spots and the window rims
- red (cloth and lacquer), with cream patterns
- dark timber and dark iron
- warm bronze/brass
- dark blue-slate roofs
- warm lamp light

**Motifs:** the DIAMOND, the CHEVRON / zigzag, and the SQUARE SPIRAL (the ship's sail emblem). The dojo's floor crest should be the square spiral, not a borrowed mitsudomoe.

## Enemy architecture: the same grammar, a different voice (to design with him)

Same general style (rounded masses, a crown, stacks, scaffold, cloth, machinery) so the world is one world, but the materials, colours and silhouette say THEY are not us.

The factions in KORAJIN.md are a natural split. **These are proposals; the taste call is his.**

| faction | proposal |
|---|---|
| **The Hollowed** (machinery bodies) | black iron and verdigris copper instead of timber and bronze; the domes riveted metal shells; cold teal light; pipes and gears exposed; spiked crowns instead of tent cones |
| **The Veilborn** (half outside reality) | pale bone and violet; translucent/glowing membranes for the cloth; floating, unsupported pieces; no ground contact |
| **The Dustwalkers** (scavengers, traders) | patched, mismatched: sun-bleached canvas, rust, salvaged ship parts bolted on; ochre and olive |
| **The Red Order** (discipline, ritual; Grumbo's origin) | the HERO kit made severe: lacquered black and deep red, symmetry, fewer domes and more terraces, gold trim |

## ENEMY BUILDINGS: CLASSICAL JAPANESE, EMBELLISHED, IN THE ENEMY'S PALETTE -- AND BREAKABLE (his, Oct 28 2026)
**THE GUIDE IS `ENEMY_STYLE.md`** (his style sheets, the palette, the emblem, the kit, the five buildings; code `enemyMats()` / `enemyBanner()` / `ENEMY.pal`).
The forge's ORIGINAL classical Japanese buildings are the enemy's base look (*"probably almost better, we should've just embellished it"*), NOT
the hero kit. They get the enemy palette: **BLACK AND GOLD** (his pick), stolen Jinra burning in their braziers,
and they are DESTRUCTIBLE. No FALLEN/RESTORED, no floating. Torn down, they make way for our SACRED buildings.

## THE ENEMY IS STONE AND CLAY (his, Oct 28 2026; KORAJIN.md, THE ENEMY)
Their places are carved STONE and fired TERRACOTTA, Sphinx-like and buried-army-like, with stolen Jinra burning mint in their braziers, core
chambers and torch towers. That is a strong candidate for the enemy grammar above (closest to "The Hollowed": ancient machinery), and still his to settle.

## Classical Japanese stays in the world (his, after m1410)

> *"I think we can still use the more classical Japanese architecture -- we just have to weave it together; they can both exist. Or maybe make the enemy
> stuff classical Japanese fortress architecture. I don't mind using it; I did like the stuff you were building."*

- **Both are in the vocabulary.** Classical pieces (pagoda roofs with layered upturned eaves, torii, paper lanterns, stone lanterns) can stand beside the hero kit as the older, shared culture of the world. The hero kit is Grumbo's own: domes, the tent cone, stacks, scaffold and the ship.
- **An option for the enemy:** CLASSICAL FORTRESS architecture as an enemy grammar: stone-walled keeps, stacked roofs, black and white plaster, iron-studded gates. This is an alternative to the faction palettes above, and the choice is his.
- **The dojo can show the weave:** one classical pagoda or torii kept among the hero halls reads as heritage, not borrowing.

## The plan

1. **The dojo is re-made in the hero kit first** (it is his). Its pagodas, torii and paper lanterns give way to domes, tent cones, scaffold gates, stacks, wheels, bunting and box lanterns.
2. **Then, one building per pass, every forge building gets a re-pass in the right kit:**
   - the hero kit for his places
   - an enemy kit for enemy bases, once he has picked the palettes above
3. **A shared code kit, so every builder speaks the same words:** `korDome`, `korTent`, `korStack`, `korWheel`, `korLantern`, `korBunting`, `korBanner`. These start in the dojo and are lifted out to be shared.
