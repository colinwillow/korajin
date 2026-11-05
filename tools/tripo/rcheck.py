import sys; sys.path.insert(0, sys.argv[-1])
from common import *
bpy.ops.wm.open_mainfile(filepath=sys.argv[-2]+'/built.blend')
O=bpy.data.objects; P=[]
def only(names):
    for ob in O: ob.hide_render = ob.type=='MESH' and ob.name not in names
    return [O[n] for n in names]
# sheathed: from the face (+X), the edge side, and an x-ray slice via sheath hidden
P+=frame_views(only(['tripo_sword','tripo_sheath']), sys.argv[-2]+'/r/sh', dirs=((1,0,0),(0,1,0),(1,.6,.3)))
# a cross-check: blade inside? use workbench xray
sc=bpy.context.scene; sc.display.shading.show_xray=True; sc.display.shading.xray_alpha=.35
P+=frame_views(only(['tripo_sword','tripo_sheath']), sys.argv[-2]+'/r/shx', dirs=((1,0,0),(0,1,0)))
sc.display.shading.show_xray=False
# markers for the bow nocks
import bmesh
for e in ('bow_tip_top','bow_tip_bottom'):
    m=bpy.data.meshes.new('m'); bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=8,v_segments=6,radius=.03); bm.to_mesh(m)
    s=bpy.data.objects.new('mk_'+e,m); sc.collection.objects.link(s); s.location=O[e].matrix_world.translation
P+=frame_views(only(['tripo_bow','mk_bow_tip_top','mk_bow_tip_bottom']), sys.argv[-2]+'/r/bw', dirs=((1,0,0),(0,1,0)))
P+=frame_views(only(['tripo_quiver']), sys.argv[-2]+'/r/qv', dirs=((0,1,0),(1,0,0)))
P+=frame_views(only(['tripo_arrow','tripo_arrow_head']), sys.argv[-2]+'/r/ar', dirs=((1,0,0),))
sheet(P, sys.argv[-2]+'/r/check.png', cols=6, w=250, h=330)
