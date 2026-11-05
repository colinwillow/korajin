import sys; sys.path.insert(0, sys.argv[-1])
from common import *
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2]+'/built.blend')
im=bpy.data.images.load(sys.argv[-2]+'/maskvis_full.png')
for m in bpy.data.materials:
    if m.node_tree:
        for n in m.node_tree.nodes:
            if n.type=='TEX_IMAGE': n.image=im
O=bpy.data.objects; P=[]
def only(names):
    for ob in O: ob.hide_render = ob.type=='MESH' and ob.name not in names
    return [O[n] for n in names]
for grp in (['tripo_sword'],['tripo_sheath'],['tripo_bow'],['tripo_quiver'],['tripo_arrow','tripo_arrow_head']):
    P+=frame_views(only(grp), sys.argv[-2]+'/r/mk_'+grp[0], dirs=((1,0,0),(-1,0,0)) if grp[0] not in ('tripo_bow','tripo_quiver') else ((1,0,0),(0,1,0)) if grp[0]=='tripo_bow' else ((0,1,0),(0,-1,0)))
sheet(P, sys.argv[-2]+'/r/maskcheck.png', cols=5, w=280, h=360)
