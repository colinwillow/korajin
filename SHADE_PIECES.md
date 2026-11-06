# STONE GUARDIAN -- AUTHORED ARMOUR PIECES (one page for Colin)

If you split the stone armour yourself (Tripo's split on a TRIANGULATED export, or by hand in Cinema 4D), the game uses YOUR pieces as the
break pieces, each one whole and rigid to its bone. No auto split.

## Name each armour object exactly like this
L / R are HIS left and right (his left is the side on YOUR right when he faces you).

| object name | breaks as | rides the bone |
|---|---|---|
| `armor_head` | the head (helm, face, antlers) | `mixamorig_Head` |
| `armor_chest` | the chest plate + collar + core ring | `mixamorig_Spine2` |
| `armor_waist` | belt, loincloth flaps, skirt plates | `mixamorig_Hips` |
| `armor_L_shoulder` / `armor_R_shoulder` | shoulder plate + upper arm | `mixamorig_LeftArm` / `RightArm` |
| `armor_L_forearm` / `armor_R_forearm` | the gauntlet | `mixamorig_LeftForeArm` / `RightForeArm` |
| `armor_L_hand` / `armor_R_hand` | the stone hand | `mixamorig_LeftHand` / `RightHand` |
| `armor_L_thigh` / `armor_R_thigh` | thigh plate (a side skirt plate can go here too) | `mixamorig_LeftUpLeg` / `RightUpLeg` |
| `armor_L_shin` / `armor_R_shin` | knee + shin guard | `mixamorig_LeftLeg` / `RightLeg` |
| `armor_L_foot` / `armor_R_foot` | the stone foot | `mixamorig_LeftFoot` / `RightFoot` |

- **Keep the pivot anywhere -- we bind by NAME, not by pivot.** Moving the axis does nothing.
- Case does not matter (`Armor_L_Forearm` is fine). Anything after the piece name is ignored (`armor_L_forearm.001` is fine).
- **Leave the pieces where they are** -- same pose (A-pose), same place as the spirit model. Do not move or scale any one of them.
- Anything NOT named `armor_*` (an inner body, a strap) is still split automatically.
- You may put several objects under one name family, e.g. two objects both called `armor_chest...` -- they break together.
- Keep the total around 10k triangles. One material + one texture for all of them is best (one draw call).

## Export
- **FBX** (or GLB), triangulated is fine, Y-up or Tripo's own Z-up (we bake the transform), meters or Tripo's unit (we normalise to the
  spirit's height), **no animation, no skeleton** (we rig it), textures embedded or beside it.
- Drop it in `models/characters/character_model_zips/` as a zip like the first one and say so.

## What happens to it
`tools/shade_rig/rig.js` (README there) reads the object names: an `armor_*` object goes WHOLE to its bone; the rest is split by mesh islands
(a plate goes whole to the bone most of it is nearest; an island across a joint is cut on a plane square to the limb). Then the game breaks
pieces in an order (hands / feet first, the chest last), one per solid hit -- STONE_GUARDIAN.md.
