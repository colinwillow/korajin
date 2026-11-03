# THE MAMMOTH'S CLOTH (Korajin m2393). Spring bones the game drives (`trunkStep` springs every `cloth_<k>_<j>` chain, verlet like his cape):
#   DRAPES -- four panels (front / rear, each flank), found by the cloth's own red in the texture (+ one ring of neighbours for the hems): a
#             3-bone chain hangs down each from its spine bone; the top quarter stays on the body (it is sewn to the saddle), below that the
#             cloth goes to the chain by height.
#   HANGING PARTS -- every loose island (rings, bells, tassels) that hangs: ONE pendulum bone from its top vertex to its bottom, the part 100%
#             on it, parented to the bone it hung from.
#   cloth_body -- an empty under Spine_03 whose scale IS the body ellipsoid: the runtime keeps every cloth tip outside it.
#   python -I mammoth_cloth.py -- weighted_raw.glb out.glb       (after mammoth_weights.py)
import bpy, sys, math, numpy as np
from mathutils import Vector, Matrix
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(bpy.data.objects):
    if o.name.startswith('Icosphere'): bpy.data.objects.remove(o, do_unlink=True)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
me = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm][0]
m = me.data; co = np.array([v.co[:] for v in m.vertices]); NV = len(co); X, Y, Z = co.T
def smoothstep(e0, e1, x): t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)
# ---- current weights as a matrix
gn = [g.name for g in me.vertex_groups]; Wt = np.zeros((NV, len(gn)))
for v in m.vertices:
    for g in v.groups: Wt[v.index, g.group] = g.weight
def col(n):
    global Wt
    if n not in gn: gn.append(n); Wt = np.concatenate([Wt, np.zeros((NV, 1))], 1)
    return gn.index(n)
# ---- texture colour per vertex
uv = np.zeros((NV, 2))
for lp in m.loops: uv[lp.vertex_index] = m.uv_layers[0].data[lp.index].uv
im = [i for i in bpy.data.images if i.size[0] > 0][0]; W, H = im.size; px = np.empty(W * H * 4, np.float32); im.pixels.foreach_get(px); px = px.reshape(H, W, 4)
c = px[np.clip((uv[:, 1] % 1 * H).astype(int), 0, H - 1), np.clip((uv[:, 0] % 1 * W).astype(int), 0, W - 1), :3]
clothc = (c[:, 0] > .25) & (c[:, 0] > 1.45 * c[:, 1]) & (c[:, 0] > 1.3 * c[:, 2])
# welded neighbours (UV seams split the verts)
key = {}; wid = np.array([key.setdefault(tuple(p), len(key)) for p in np.round(co / 1e-4).astype(np.int64)])
nb = [set() for _ in range(len(key))]
for p in m.polygons:
    ws = [wid[v] for v in p.vertices]
    for a in ws:
        nb[a].update(ws)
wc = np.zeros(len(key), bool); wc[wid[clothc]] = True
wd = wc.copy()
for a in np.where(wc)[0]:
    for b in nb[a]: wd[b] = True
cloth = wd[wid]
# ---- loose islands (as in mammoth_weights.py)
par = list(range(len(key)))
def find(a):
    while par[a] != a: par[a] = par[par[a]]; a = par[a]
    return a
for a in range(len(key)):
    for b in nb[a]:
        ra, rb = find(a), find(b)
        if ra != rb: par[ra] = rb
isl = {}
for i in range(NV): isl.setdefault(find(wid[i]), []).append(i)
big = max(isl.values(), key=len)
loose = [np.array(v) for v in isl.values() if v is not big]
# ---- the panels
PAN = []
for sx in (1, -1):
    for nm, y0, y1 in (('front', -0.62, -0.24), ('rear', -0.22, 0.30)):
        msk = cloth & (np.sign(X) == sx) & (np.abs(X) > .45) & (Y > y0) & (Y < y1) & (Z > .28) & (Z < 1.36)
        for ids in loose: msk[ids] = False
        legw = sum(Wt[:, gn.index(n)] for n in gn if any(n.startswith(p) for p in ('hip_2_', 'thigh_', 'shin_', 'hoof_')))
        msk &= legw < .15     # a leg's wraps share the cloth's orange-red: anything a leg bone carries is not drape
        if msk.sum() < 30: continue
        PAN.append((('L' if sx > 0 else 'R') + nm, msk))
print('[CLOTH] panels', [(n, int(k.sum())) for n, k in PAN])
bpy.context.view_layer.objects.active = arm; arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT'); E = arm.data.edit_bones
def chosen_parent(ids):
    s = Wt[ids].sum(0); j = int(np.argmax(s)); return gn[j]
chains = []; k = 0
for name, msk in PAN:
    ids = np.where(msk)[0]; P = co[ids]; zt = min(P[:, 2].max(), 1.25); zb = P[:, 2].min()
    # the hanging line: the panel's mean x / y in four height bands
    zs = np.linspace(zt, zb, 4); pts = []
    for z in zs:
        band = np.abs(P[:, 2] - z) < max(.08, (zt - zb) / 6); q = P[band] if band.sum() > 3 else P
        pts.append(Vector((q[:, 0].mean(), q[:, 1].mean(), z)))
    parent = 'Spine_01' if 'front' in name else 'Spine_02'
    prev = E[parent]
    for j in range(4):
        b = E.new('cloth_%d_%d' % (k, j)); b.head = pts[j] if j < 3 else pts[3]
        b.tail = (pts[j + 1] if j < 3 else pts[3] + (pts[3] - pts[2]).normalized() * .05); b.parent = prev; b.use_connect = False; b.use_deform = j < 3; prev = b
    chains.append((k, name, ids, zt, zb)); k += 1
pend = []
for ids in loose:
    P = co[ids]; zt, zb = P[:, 2].max(), P[:, 2].min()
    if zt - zb < .06: continue
    top = P[np.argmax(P[:, 2])]; bot = P[P[:, 2] < zb + .25 * (zt - zb)].mean(0)
    parent = chosen_parent(ids)
    b0 = E.new('cloth_%d_0' % k); b0.head = Vector(top); b0.tail = Vector(bot); b0.parent = E[parent]; b0.use_connect = False
    b1 = E.new('cloth_%d_1' % k); b1.head = Vector(bot); b1.tail = Vector(bot) + (Vector(bot) - Vector(top)).normalized() * .04; b1.parent = b0; b1.use_connect = False; b1.use_deform = False
    pend.append((k, ids, parent)); k += 1
bpy.ops.object.mode_set(mode='OBJECT')
print('[CLOTH] drape chains %d, pendulums %d' % (len(chains), len(pend)))
# ---- weights
for kk, name, ids, zt, zb in chains:
    u = np.clip((zt - Z[ids]) / max(zt - zb, 1e-3), 0, 1)
    keepBody = 1 - smoothstep(.12, .32, u)     # the top: sewn on
    # the chain by height: bone j covers u in thirds, hat-blended
    s = u * 3
    ws = [np.clip(1 - np.abs(s - (j + .5)), 0, 1) for j in range(3)]; ws[0] = np.where(s < .5, 1, ws[0]); ws[2] = np.where(s > 2.5, 1, ws[2])
    tot = sum(ws)
    old = Wt[ids].copy(); Wt[ids] = old * keepBody[:, None]
    for j in range(3): cj = col('cloth_%d_%d' % (kk, j)); Wt[ids, cj] += (1 - keepBody) * ws[j] / tot
for kk, ids, parent in pend:
    cj = col('cloth_%d_0' % kk); Wt[ids] = 0; Wt[ids, cj] = 1
# top 4, normalised, written
order = np.argsort(-Wt, 1)[:, :4]; keep = np.zeros_like(Wt); rows = np.arange(NV)[:, None]; keep[rows, order] = Wt[rows, order]
keep[keep < .02] = 0; keep /= keep.sum(1, keepdims=True)
for g in list(me.vertex_groups): me.vertex_groups.remove(g)
for j, n in enumerate(gn):
    cj = keep[:, j]
    if not (cj > 0).any(): continue
    g = me.vertex_groups.new(name=n)
    for wv in np.unique(np.round(cj[cj > 0], 4)):
        g.add([int(i) for i in np.where(np.round(cj, 4) == wv)[0]], float(wv), 'REPLACE')
# ---- the body ellipsoid: the torso's skin (not cloth, not loose, between the legs and the saddle), its extent per axis, a touch inside
tor = (~cloth) & (Z > .55) & (Z < 1.5) & (Y > -0.55) & (Y < 0.75)
for ids in loose: tor[ids] = False
P = co[tor]; cen = Vector((0.0, (np.percentile(P[:, 1], 98) + np.percentile(P[:, 1], 2)) / 2, (np.percentile(P[:, 2], 98) + np.percentile(P[:, 2], 2)) / 2))
rad = Vector((np.percentile(np.abs(P[:, 0]), 95) * .97, (np.percentile(P[:, 1], 98) - np.percentile(P[:, 1], 2)) / 2 * .97, (np.percentile(P[:, 2], 98) - np.percentile(P[:, 2], 2)) / 2 * .97))
arm.data.pose_position = 'REST'; bpy.context.view_layer.update()
e = bpy.data.objects.new('cloth_body', None); bpy.context.scene.collection.objects.link(e); e.empty_display_type = 'SPHERE'
e.parent = arm; e.parent_type = 'BONE'; e.parent_bone = 'Spine_03'
bpy.context.view_layer.update()
e.matrix_world = Matrix.Translation(cen) @ Matrix.Diagonal((rad.x, rad.y, rad.z, 1))
arm.data.pose_position = 'POSE'
print('[CLOTH] body ellipsoid centre', tuple(round(v, 3) for v in cen), 'radii', tuple(round(v, 3) for v in rad))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='ACTIONS', export_yup=True, export_skins=True,
                          export_image_format='WEBP', export_force_sampling=True, export_frame_step=1, export_optimize_animation_size=False)
print('[CLOTH] wrote', OUT)
