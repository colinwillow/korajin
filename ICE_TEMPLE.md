# ICE TEMPLE + THE SNOW REGION -- plan (Colin, Nov 1 2026)

> *"Here's some images of the potential for a temple... my vision is that every region will have a big open explorable area with stuff to do, like
> the ice village -- so the ice temple isn't two feet in; you have to look for it. You could build it in the snow world since it isn't super developed,
> in a way such that it could be moved later. Probably the bigger version. Take the background as an example too -- mountainous areas, a valley.
> Develop one area at a time and focus on detail. I don't know if it's time yet."*

Concept art: `images/concepts/ice_temple/` -- `big_*` (the ENEMY VARIANT: horns, ring arches, banners, waterfalls, crystal braziers -- his pick) and
`small_*` (VARIANT A: the glowing door, the arch with a hanging crystal). Each: a sheet + front / right / back / left.

**BLUEPRINT DRAFTED (Nov 1): `ICE_TEMPLE_BLUEPRINT.md`** -- the beats, the height profile, the top-down, the placement row; open questions at its end.

## The order (TEMPLE_KIT.md, always)
1. **BLUEPRINT** -- the temple's beats on paper (approach, initiation, guards, door, acrobatic hall, mini boss, puzzle, more guys, chalice, boss).
   Sized from TEMPLE_KIT's move table. The look does NOT come first.
2. **BLOCKOUT** -- grey boxes, played on the phone.
3. **LOOK** -- this concept art wrapped over a blockout that is already fun.

## Where it goes: the SNOW REGION, the temple at the far end
- The Snowfield grows into a REGION: the current field is the **village / entry** end; beyond it a **valley** between mountain walls (the concept's
  background: aqueduct arches on the cliffs, frozen waterfalls, pines, terraces) that you travel up -- with the dragon's lair on its flank -- and the
  temple at the **head of the valley**, seen from far off but reached only after exploring.
- **Movable by construction**: the temple is ONE placement (`{ id, at, yaw }`) whose builder is a pure function of its table (SCENE_COMPANION.md), all
  its parts in its own local frame. Moving it later is changing one row.

## The kit (read off the concept)
| piece | from the art | notes |
|---|---|---|
| stone block walls | grey bricks, gold-trimmed edges | rounded (LOOK.md bevel), snow pillows + icicles on every lip |
| gold trim bands + glyph plates | the gold "rune" frames | one material, merged |
| pillars / towers | stacked tiers with crystal finials | a tower piece in 3 heights |
| arches + aqueduct spans | side arches, background aqueducts | walkable tops (routes climb) |
| the grand stair | front steps (risers .30) | `bldTris` stairs |
| crystal braziers | gold bowls with a glowing jade crystal | light + glow |
| banners | black / gold, the Korajin emblem | cloth sway (the willow's verlet, a few links) |
| the emblem roundel | the compass-star disc over the door | a glowing gate that OPENS (the temple's "door" beat) |
| horn arches + ring arches | the crown | the silhouette from afar |
| frozen waterfalls | from the arches into the moat | the m2000 falls, reused |
| frozen moat | ice at the foot | the pond's ice (sliding) |

## Not now
His call: other items first. This file exists so the temple can be built later -- here or in its own session -- without losing the brief.
