# FBX animation on his rig -> GLB the game loads (models/characters/anims). blender -b --python tools/fbx2glb.py -- in.fbx out.glb
import bpy, sys
src, dst = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=src)
bpy.context.scene.render.fps = 30
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_animations=True, export_skins=True, export_apply=False, export_yup=True, export_force_sampling=True, export_animation_mode='ACTIONS')
