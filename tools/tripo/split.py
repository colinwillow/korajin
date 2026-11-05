import sys; sys.path.insert(0, sys.argv[-1])
from common import *
import bmesh
o=load()
me=o.data
bm=bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
seen={}; parts=[]
for v in bm.verts:
    if v.index in seen: continue
    pid=len(parts); st=[v]; seen[v.index]=pid; vs=[]
    while st:
        x=st.pop(); vs.append(x)
        for e in x.link_edges:
            y=e.other_vert(x)
            if y.index not in seen: seen[y.index]=pid; st.append(y)
    parts.append(vs)
cls={}
for i,vs in enumerate(parts):
    ys=[v.co.y for v in vs]; cy=(min(ys)+max(ys))/2   # object at identity (checked)
    if cy<-0.25: c='glaive'
    elif cy<-0.13: c='sword'
    elif cy<0.06: c='sheath'
    elif i==77: c='string'
    elif i in (81,78,83,89,91,94): c='quiver'
    elif i in (82,116): c='arrow' if i==82 else 'arrowhead'
    else: c='bow'
    cls[i]=c
print({c:sum(1 for k in cls.values() if k==c) for c in set(cls.values())})
names=sorted(set(cls.values()))
for c in names:
    b2=bmesh.new(); b2.from_mesh(me); b2.verts.ensure_lookup_table()
    kill=[b2.verts[v.index] for i,vs in enumerate(parts) if cls[i]!=c for v in vs]
    bmesh.ops.delete(b2, geom=kill, context='VERTS')
    m2=bpy.data.meshes.new(c); b2.to_mesh(m2)
    m2.materials.append(me.materials[0])
    ob=bpy.data.objects.new(c,m2); bpy.context.scene.collection.objects.link(ob)
    print(c, 'tris', sum(len(p.vertices)-2 for p in m2.polygons))
bpy.data.objects.remove(o)
bpy.ops.wm.save_as_mainfile(filepath=sys.argv[-2]+'/split.blend')
