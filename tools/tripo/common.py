import bpy, mathutils, math
def load():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=__import__('os').path.join(__import__('os').path.dirname(__file__), '..', '..', 'models/source/weapons_01.fbx'))
    return [o for o in bpy.data.objects if o.type=='MESH'][0]
def cam_render(path, loc, look, ortho=None, res=(1200,800), lens=50, tex=True):
    sc=bpy.context.scene
    sc.render.engine='BLENDER_WORKBENCH'
    sc.display.shading.light='STUDIO'
    sc.display.shading.color_type='TEXTURE' if tex else sc.display.shading.color_type
    sc.display.shading.show_cavity=False
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.film_transparent=False
    w=sc.world or bpy.data.worlds.new('W'); sc.world=w
    cd=bpy.data.cameras.new('C'); c=bpy.data.objects.new('C',cd); sc.collection.objects.link(c)
    c.location=loc
    d=mathutils.Vector(look)-mathutils.Vector(loc)
    c.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
    if ortho: cd.type='ORTHO'; cd.ortho_scale=ortho
    else: cd.lens=lens
    cd.clip_start=0.001
    sc.camera=c
    sc.render.filepath=path
    bpy.ops.render.render(write_still=True)
    bpy.data.objects.remove(c)
def frame_views(objs, out, res=(400,500), dirs=((1,0,0),(0,1,0),(1,1,.4),(-1,0,0)), tex=True):
    vs=[ob.matrix_world@v.co for ob in objs for v in ob.data.vertices]
    mn=mathutils.Vector([min(v[i] for v in vs) for i in range(3)]); mx=mathutils.Vector([max(v[i] for v in vs) for i in range(3)])
    c=(mn+mx)/2; r=(mx-mn).length
    paths=[]
    for k,d in enumerate(dirs):
        d=mathutils.Vector(d).normalized()
        p=out+'_%d.png'%k; cam_render(p, c+d*r*3, c, ortho=r*1.05, res=res, tex=tex); paths.append(p)
    return paths
def sheet(paths, out, cols=4, w=300, h=375):
    from PIL import Image
    W=Image.new('RGB',(cols*w,((len(paths)+cols-1)//cols)*h),'white')
    for i,p in enumerate(paths): W.paste(Image.open(p).convert('RGB').resize((w,h)),((i%cols)*w,(i//cols)*h))
    W.save(out)
