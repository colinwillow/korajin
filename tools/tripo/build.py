import sys; sys.path.insert(0, sys.argv[-1])
from common import *
import bmesh
from mathutils import Vector, Matrix
OUT=sys.argv[-2]
bpy.ops.wm.open_mainfile(filepath=OUT+'/split.blend')
O=bpy.data.objects
mat=bpy.data.materials[0]; mat.name='tripo_weapons'
mat.use_backface_culling=True
try: mat.surface_render_method='DITHERED'
except: pass
mat.blend_method='OPAQUE'
img=[i for i in bpy.data.images if i.size[0]>0][0]
img.scale(2048,2048); img.name='tripo_weapons_2k'
for n in mat.node_tree.nodes:
    if n.type=='BSDF_PRINCIPLED':
        n.inputs['Metallic'].default_value=0.0; n.inputs['Roughness'].default_value=0.75
        if 'Alpha' in n.inputs:
            for l in list(n.inputs['Alpha'].links): mat.node_tree.links.remove(l)
            n.inputs['Alpha'].default_value=1.0
C3B=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))   # three-local (x,y,z) -> blender (x,-z,y)
def basis(X,Y,Z,o,k):   # file -> three-local: rows are axes
    R=Matrix((tuple(X)+(0,),tuple(Y)+(0,),tuple(Z)+(0,),(0,0,0,1)))
    return Matrix.Scale(k,4)@R@Matrix.Translation(-o)
def bake(ob,M3): ob.data.transform(C3B@M3); ob.matrix_world=Matrix.Identity(4); ob.data.update()
def empty(name,parent,p3):
    e=bpy.data.objects.new(name,None); bpy.context.scene.collection.objects.link(e); e.empty_display_size=.02
    e.parent=parent; e.location=(C3B@Vector(tuple(p3)+(1,))).xyz if False else Vector((p3[0],-p3[2],p3[1])); return e
def V(n): return [v.co.copy() for v in O[n].data.vertices]
def loose(ob):
    bm=bmesh.new(); bm.from_mesh(ob.data); bm.verts.ensure_lookup_table(); seen={}; parts=[]
    for v in bm.verts:
        if v.index in seen: continue
        pid=len(parts); st=[v]; seen[v.index]=pid; vs=[]
        while st:
            x=st.pop(); vs.append(x.index)
            for e in x.link_edges:
                y=e.other_vert(x)
                if y.index not in seen: seen[y.index]=pid; st.append(y)
        parts.append(vs)
    return parts
INFO={}
# ---------------- SWORD (weapon units, the katana frame: +Y blade, +Z edge, thin X) ----------------
# the pommel's TASSELS (two bead chains and two ribbons, all small loose parts under the pommel) are cut: the game hangs dynamic ones (m2647)
_sp=loose(O['sword']); _sv=[v.co.copy() for v in O['sword'].data.vertices]
_kill=[i for pp in _sp if len(pp)<60 and max(_sv[j].z for j in pp)<-0.18 for i in pp]
_bm=bmesh.new(); _bm.from_mesh(O['sword'].data); _bm.verts.ensure_lookup_table(); bmesh.ops.delete(_bm, geom=[_bm.verts[i] for i in _kill], context='VERTS'); _bm.to_mesh(O['sword'].data)
INFO['tassel_verts_cut']=len(_kill)
KS=180.0; R=Vector((-0.0046,-0.1997,-0.105-5/KS))
MS=basis((1,0,0),(0,0,1),(0,-1,0),R,KS)
bake(O['sword'],MS); O['sword'].name='tripo_sword'
root=bpy.data.objects.new('weapon_root_right',None); bpy.context.scene.collection.objects.link(root)
O['tripo_sword'].parent=root; empty('weapon_tip',root,(-14.3102,0,0))
sw=[v.co for v in O['tripo_sword'].data.vertices]
INFO['sword_units_y']=(min(v.z for v in sw),max(v.z for v in sw))   # blender z = three y
# ---------------- SHEATH: fitted to the blade, in the SAME frame (sword at identity = sheathed) ----------------
bladeBase=( -0.054 - R.z)*KS; bladeTip=(0.2834-R.z)*KS; bladeLen=bladeTip-bladeBase
sv=V('sheath'); s_top=max(v.z for v in sv); s_bot=min(v.z for v in sv); s_len=s_top-s_bot
ky=(bladeLen*1.04)/(s_len*KS)     # sheath length = blade x1.04
cy=(min(v.y for v in sv)+max(v.y for v in sv))/2; cx=(min(v.x for v in sv)+max(v.x for v in sv))/2
o=Vector((cx,cy,s_top))           # the mouth
MSh=Matrix.Translation(Vector((0,bladeBase-1.0,0)))@basis((1,0,0),(0,0,-1),(0,1,0),o,KS*ky)
bake(O['sheath'],MSh); O['sheath'].name='tripo_sheath'
empty('sheath_mouth',O['tripo_sheath'],(0,bladeBase-1.0,0))
INFO['sheath_scale_vs_file']=ky; INFO['blade']=(bladeBase,bladeTip)
# ---------------- BOW (metres; grip at origin, +Y chord up, +Z the shot, tips behind) ----------------
st=V('string'); T=max(st,key=lambda v:v.z); B=min(st,key=lambda v:v.z)
L=(T-B).length; d=(T-B)/L
bv=V('bow')
def tp(v): w=v-B; t=w.dot(d); p=w-d*t; return t/L,p
tstar=0.5   # the grip at the middle of the chord (the deepest point sat at .39 and the bow towered over his fist)
near=[v for v in bv if abs(tp(v)[0]-tstar)<.03]
G=sum(near,Vector())/len(near)
n=tp(G)[1]; n.x=0; n=n.normalized()
Y=d.copy(); Z=n-Y*n.dot(Y); Z.normalize(); X=Y.cross(Z)
kb=1.24/L
MB=basis(X,Y,Z,G,kb)
bake(O['bow'],MB); O['bow'].name='tripo_bow'
tT=MB@T; tB=MB@B
empty('bow_tip_top',O['tripo_bow'],tuple(tT)); empty('bow_tip_bottom',O['tripo_bow'],tuple(tB))
INFO['bow']=dict(top=tuple(round(a,4) for a in tT),bot=tuple(round(a,4) for a in tB),scale=kb)
bpy.data.objects.remove(O['string'])
# ---------------- ARROW (metres; origin at the NOCK, +Z to the head) ----------------
av=V('arrow')+V('arrowhead'); lo=min(av,key=lambda v:v.z); hi=max(av,key=lambda v:v.z)
Za=(hi-lo).normalized(); Xa=Vector((1,0,0)); Xa=(Xa-Za*Xa.dot(Za)).normalized(); Ya=Za.cross(Xa)
ka=0.92/(hi-lo).length
MA=basis(Xa,Ya,Za,lo,ka)
for nme in ('arrow','arrowhead'): bake(O[nme],MA)
# split the head off (the last 16% of the shaft + the barb part) so the game can tint it
bm=bmesh.new(); bm.from_mesh(O['arrow'].data)
head=[f for f in bm.faces if f.calc_center_median().y < -0.92*0.84]   # blender -y = three z
ret=bmesh.ops.split(bm, geom=head)
bm.to_mesh(O['arrow'].data)
bpy.context.view_layer.objects.active=O['arrow']
for ob in bpy.data.objects: ob.select_set(False)
O['arrow'].select_set(True)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='DESELECT'); bpy.ops.object.mode_set(mode='OBJECT')
for p in O['arrow'].data.polygons: p.select = sum((O['arrow'].data.vertices[i].co for i in p.vertices),Vector()).y/len(p.vertices) < -0.92*0.84
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.separate(type='SELECTED'); bpy.ops.object.mode_set(mode='OBJECT')
hd=[o2 for o2 in bpy.data.objects if o2.name.startswith('arrow.')][0]
# join the barb part into the head
for ob in bpy.data.objects: ob.select_set(False)
hd.select_set(True); O['arrowhead'].select_set(True); bpy.context.view_layer.objects.active=hd; bpy.ops.object.join()
hd.name='tripo_arrow_head'; O['arrow'].name='tripo_arrow'
hm=mat.copy(); hm.name='tripo_arrow_head'; hd.data.materials.clear(); hd.data.materials.append(hm)
hd.parent=O['tripo_arrow']
# ---------------- QUIVER (metres; origin at the body's middle, +Y up the quiver, +Z the emblem face) ----------------
q=O['quiver']; parts=loose(q); qv=[v.co.copy() for v in q.data.vertices]
body=max(parts,key=len); bpts=[qv[i] for i in body]
c=sum(bpts,Vector())/len(bpts)
import numpy as np
A=np.array([[p.y-c.y,p.z-c.z] for p in bpts]); w,U=np.linalg.eigh(A.T@A); ax=U[:,1]
u=Vector((0,ax[0],ax[1])).normalized()
if u.z<0: u=-u
fl=[qv[i] for pp in parts if len(pp) in (50,100) for i in pp]
fmax=max((p-c).dot(u) for p in fl); bmin=min((p-c).dot(u) for p in bpts); bmax=max((p-c).dot(u) for p in bpts)
# the shafts (one part, 183 verts): keep only what stands above the mouth -- inside the body nothing shows, and one runs out of its side
bm=bmesh.new(); bm.from_mesh(q.data); bm.verts.ensure_lookup_table()
sv=set(i for pp in parts if len(pp)==183 for i in pp)
bm.edges.ensure_lookup_table(); bm.faces.ensure_lookup_table()
gv=[bm.verts[i] for i in sv]; ge=list({e for v in gv for e in v.link_edges}); gf=list({f for v in gv for f in v.link_faces})
bmesh.ops.bisect_plane(bm, geom=gv+ge+gf, plane_co=c+u*(bmax-.025), plane_no=u, clear_inner=True)
bm.to_mesh(q.data); qv=[v.co.copy() for v in q.data.vertices]
# cut the shafts Tripo ran up to the bow string and out of the bottom
bm=bmesh.new(); bm.from_mesh(q.data)
for co,no in (((c+u*(fmax+.004)),u),((c+u*(bmin-.002)),-u)):
    r=bmesh.ops.bisect_plane(bm, geom=bm.verts[:]+bm.edges[:]+bm.faces[:], plane_co=co, plane_no=no, clear_outer=True)
bm.verts.ensure_lookup_table()
shafts=[pp for pp in parts if len(pp)==183]   # p91: every shaft in ONE part, some running diagonally out of the body
sv=set(i for pp in shafts for i in pp)
kill=[f for f in bm.faces if all(v.index in sv for v in f.verts) and (f.calc_center_median()-c).dot(u) < bmax-.03] if False else []
bm.to_mesh(q.data)
# (vertex indices shift after bisect; redo by position: shaft faces = thin faces below the mouth outside nothing else -> use a fresh loose pass)
Yq=u; Zq=Vector((1,0,0)); Xq=Yq.cross(Zq)
kq=0.5/(bmax-bmin)
mid=c+u*((bmin+bmax)/2)
bake(q,basis(Xq,Yq,Zq,mid,kq)); q.name='tripo_quiver'
INFO['quiver']=dict(scale=kq, body=round(bmax-bmin,4), top=round((fmax-(bmin+bmax)/2)*kq,3))
bpy.data.objects.remove(O['glaive'])
for ob in bpy.data.objects:
    if ob.type=='MESH':
        INFO['tris_'+ob.name]=sum(len(p.vertices)-2 for p in ob.data.polygons)
        vs=[v.co for v in ob.data.vertices]
        INFO['bb3_'+ob.name]=[tuple(round(f(v[i] for v in vs),3) for i in (0,2,1)) for f in (min,max)]   # three (x,y,z) = blender (x,z,-y)... y,z shown as blender z,y
print('INFO',INFO)
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/built.blend')
bpy.ops.export_scene.gltf(filepath=OUT+'/raw.glb', export_format='GLB',
    export_image_format='WEBP', export_image_quality=88, export_draco_mesh_compression_enable=False, export_draco_mesh_compression_level=7,
    export_apply=True, export_yup=True, export_animations=False, export_materials='EXPORT')
