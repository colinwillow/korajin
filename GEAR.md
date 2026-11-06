# HOW TO PLACE THE GEAR IN BLENDER (sheath + sword, quiver)

The game looks in Grumbo's file (`models/characters/alien_goblin_game.glb`) for two **empties**. When it finds one, it puts the gear
**exactly on it**: same spot, same turn and same size, with nothing added by code. This is the same trick his weapon mounts use. If an
empty is missing, the game falls back to its own table. The game's message line says which one it used: `GEAR: MOUNT sheath_mount / MOUNT
quiver_mount` or `GEAR: TABLE / ...`.

| empty name | what rides it | when |
|---|---|---|
| `sheath_mount` | the sheath with the sword in it | SHEATH: X (default) |
| `quiver_mount` | the quiver | SHEATH: X |
| `sheath_mount_h` / `quiver_mount_h` | same | SHEATH: HORIZONTAL (optional) |
| `quiver_mount_solo` | the quiver | SWORD CARRY: HIP (optional) |

## Steps (about 10 minutes)

1. Open Grumbo's .blend (the source of `alien_goblin_game.glb`) and go to the **rest pose**: Armature > Pose Mode > Pose > Clear Transform > All.
2. **File > Import > glTF** `models/weapons/tripo_weapons_01.glb`. Four pieces arrive stacked at the world origin, sized in the file's own units
   (huge):
   - `tripo_sheath`
   - `weapon_root_right` (the sword)
   - `tripo_quiver`
   - the bow
   **Do not move the pieces themselves.**
3. **Add > Empty > Plain Axes** and name it `sheath_mount`. Select `tripo_sheath` and `weapon_root_right`, then the empty, and parent them:
   **Ctrl+P > Object (Without Inverse)**. With the two pieces selected, press **Alt+G, Alt+R, Alt+S** to clear their transforms. They must
   sit at the empty with zero offset, because that is exactly how the game hangs them.
4. Repeat with a second empty, `quiver_mount`, and `tripo_quiver`.
5. Now move, rotate and **scale only the EMPTIES** until the gear sits on his back the way you want: snug, crossed, the hilt over his right
   shoulder, the fletching by his left. Scale matters: the empty's scale **is** the gear's size in the game (SWORD SIZE / BOW SIZE in TOOLS
   still multiply it, with 85% meaning "as you placed it").
6. Parent each empty to the bone, keeping where it is: select the empty, Shift-select the armature, go to Pose Mode, click
   **mixamorig_Spine2**, then **Ctrl+P > Bone** (it keeps the transform). The gear then rides his upper back through every animation.
7. **Delete the reference gear** (`tripo_*` and `weapon_root_right`) and keep the empties. The gear must not be exported into Grumbo's file.
8. Export as usual: **glTF Binary**, same settings as always (+Y Up on, the armature, skinning, his animations). The empties export as plain
   nodes; nothing to tick. Save over `models/characters/alien_goblin_game.glb` and push.

Optional: make `sheath_mount_h` and `quiver_mount_h` the same way for the HORIZONTAL sheath.

## Why it lands exactly

In `tripo_weapons_01.glb` the sheath, the sword and the quiver each have their origin at the file origin. The sword's grip is at that origin,
and the sheath's mouth sits 13.18 units up its +Y. The game clones each piece with its node transform cleared, then parents it to the mount
with an identity transform. So whatever the empty looks like in Blender, after clearing the children's transforms in step 3, is what the
game draws. The same export round-trip applies to both files, so the Y-up / Z-up conversion cancels out.

## Until then

The default is the original X he liked before m2763, now in a frame that is the same on every boot (see NOTES `m2773`). **TOOLS > GEAR >
GEAR EDIT** sliders still work on that table: SAVE keeps the result on the phone, and COPY gives the numbers.
