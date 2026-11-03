# THE MAMMOTH'S WEIGHTS, BY REGION (Korajin m2368). The heat weights `mammoth_cow.py` left put his side TUSKS on the cow's EAR bones (they flapped
# with the ear clips), the saddle on the static root, the flank drapes on the front thighs, the tail tassels on the hind shins. This throws
# them away and weights by geometry, in the rest pose:
#   HEAD (everything in front of the neck that is not trunk: tusks, horns, the head armour) -- 100% `head`, rigid
#   TRUNK -- the trunk chain, smooth (the game springs it)
#   BODY -- a 1D blend along the spine (Spine_05 .. Spine_01 .. neck_01 / neck_02 .. head) by y: saddle, drapes, plates ride the BODY
#   LEGS -- a vertical column round each MEASURED foot: thigh / shin by nearest segment, the PAD (below the ankle) 100% hoof -- an elephant
#           foot is rigid; the top of the column blends into the body
#   TAIL -- the tail chain by nearest segment, into Spine_05 at its root
#   LOOSE PARTS (rings, bells, tassels: 25 islands once the UV seams are welded) -- 100% to ONE bone, the one their top vertex hangs from
#   python -I mammoth_weights.py -- planted_raw.glb out.glb   (after mammoth_plant.py; draco stripped -- see its header)
import bpy, sys, math, numpy as np
from mathutils import Vector
from mathutils.geometry import intersect_point_line
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(bpy.data.objects):
    if o.name.startswith('Icosphere'): bpy.data.objects.remove(o, do_unlink=True)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
me = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm][0]
BD = arm.data.bones
co = np.array([me.matrix_world @ v.co for v in me.data.vertices]); NV = len(co); X, Y, Z = co[:, 0], co[:, 1], co[:, 2]
def seg(n): b = BD[n]; return np.array(b.head_local), np.array(b.tail_local)
def segd(P, n):     # distance of points P (k,3) to bone n's segment
    a, b = seg(n); ab = b - a; t = np.clip(((P - a) @ ab) / max(ab @ ab, 1e-9), 0, 1); return np.linalg.norm(P - (a + t[:, None] * ab), axis=1)
def smoothstep(e0, e1, x): t = np.clip((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t)
W = {}     # bone -> (NV,) weights
def add(n, w):
    W[n] = W.get(n, np.zeros(NV)) + w

# ---- the regions
low = Z < Z.min() + .25
FEET = {}
for k, (sx, sy) in {'f_L': (1, -1), 'f_R': (-1, -1), 'b_L': (1, 1), 'b_R': (-1, 1)}.items():
    m = low & (np.abs(X) > .25) & (Y > -1.0) & (np.sign(X) == sx) & (np.sign(Y) == sy); FEET[k] = co[m].mean(0)
TOP = {'f': .86, 'b': .72}     # where a leg column meets the body (z), measured off the side render
trunk = (Y < -0.95) & (Z < 1.22) & (np.abs(X) < .36)
hornK = ((~trunk) & (Z > 1.15) & (np.abs(X) > .28)) * (1 - smoothstep(-0.88, -0.72, Y))     # the side TUSKS: rigid past their root, blended into the neck over 16 cm
headR = (~trunk) & (Y < -0.88) & (Z > 1.05)     # above the chest blend (yEff), so the two never meet with a step     # the body chain is already 100% head here, so the seam is continuous
tail = (Y > 0.80) & (Z > 0.42) & (np.abs(X) < .42) & (~headR)
tailK = smoothstep(.80, 1.05, Y) * (1 - (1 - smoothstep(1.25, 1.50, Y)) * smoothstep(1.10, 1.30, Z))     # spikes high over the tail ROOT stay on the body     # the tail fades in over 20 cm; the high back spikes stay on the body
legm = {}
for k, f in FEET.items():
    r = np.hypot(X - f[0], Y - f[1]); top = TOP[k[0]]
    legm[k] = (1 - smoothstep(.27, .38, r)) * (1 - smoothstep(top - .12, top + .08, Z))
# everything low (pads, toes, claws, ankle cuffs) is wholly its quadrant's leg, whatever its distance from the column's centre
for k, f in FEET.items():
    sx, sy = (1 if k.endswith('L') else -1), (-1 if k[0] == 'f' else 1)
    q = (np.sign(X) == sx) & ((Y < 0.15) if sy < 0 else (Y >= 0.15)) & (Z < .34) & (np.abs(X) > .15) & (np.hypot(X - f[0], Y - f[1]) < .46)     # near ITS foot: a drape's hem hangs this low too
    legm[k] = np.maximum(legm[k], q * (1 - smoothstep(.30, .40, Z)) + q * 0)
    legm[k] = np.where(q & (Z < .30), 1.0, legm[k])
legsum = np.clip(sum(legm.values()), 0, 1)
# BODY: the 1D chain along y
CH = [('Spine_05', .69), ('Spine_04', .44), ('Spine_03', .17), ('Spine_02', -.10), ('Spine_01', -.33), ('neck_01', -.52), ('neck_02', -.70), ('head', -.88)]     # the neck bends over half a metre, not ten cm
def chain1d(y):
    out = {n: np.zeros(NV) for n, _ in CH}
    for i, (n, c) in enumerate(CH):
        if i == 0: w = np.where(y >= c, 1.0, 0.0)
        else: w = np.zeros(NV)
        if i > 0:
            pn, pc = CH[i - 1]; t = np.clip((pc - y) / (pc - c), 0, 1); m = (y <= pc) & (y >= c); w = np.where(m, t, w)
        if i + 1 < len(CH):
            nn, nc = CH[i + 1]; t = np.clip((y - nc) / (c - nc), 0, 1); m = (y < c) & (y >= nc); w = np.where(m, t, w)
        else: w = np.where(y < c, 1.0, w)
        out[n] = w
    return out
yEff = Y + (1 - smoothstep(.80, 1.05, Z)) * np.maximum(0, -0.33 - Y)     # the low CHEST is body (Spine_01), only the neck above it bends with the head
body = chain1d(yEff)
bodyW = (1 - legsum) * (~trunk) * (~headR) * (1 - tail * tailK) * (1 - hornK)
add('head', (1 - legsum) * (~headR) * hornK)
for n, w in body.items(): add(n, w * bodyW)
# HEAD: rigid
add('head', headR.astype(float))
# TRUNK: nearest segment among trunk_1..4, power falloff
def axis_blend(mask, mids, coord, wt=None):     # a 1D chain along one axis (the tail runs back in y, the trunk down in z): hat weights round each bone's middle
    idx = np.where(mask)[0]
    if not len(idx): return
    c = coord[idx]; ms = [m for _, m in mids]; up = ms[-1] > ms[0]
    for j, (n, m) in enumerate(mids):
        w = np.zeros(len(idx))
        if j > 0: p = ms[j - 1]; t = (c - p) / (m - p); w = np.where((t >= 0) & (t <= 1), t, w)
        if j + 1 < len(mids): q = ms[j + 1]; t = (q - c) / (q - m); w = np.where((t >= 0) & (t <= 1), np.maximum(w, t), w)
        if j == 0: w = np.where(((c <= m) if up else (c >= m)), 1, w)
        if j == len(mids) - 1: w = np.where(((c >= m) if up else (c <= m)), 1, w)
        ww = np.zeros(NV); ww[idx] = w * (1 if wt is None else wt[idx]); add(n, ww)
def chain_blend(mask, names, wt=None):
    idx = np.where(mask)[0]
    if not len(idx): return
    P = co[idx]; pts = [np.array(BD[names[0]].head_local)] + [np.array(BD[n].tail_local) for n in names]
    best = np.full(len(idx), 1e9); s_ = np.zeros(len(idx))
    for j in range(len(names)):
        a, b = pts[j], pts[j + 1]; ab = b - a; t = np.clip(((P - a) @ ab) / max(ab @ ab, 1e-9), 0, 1); d = np.linalg.norm(P - (a + t[:, None] * ab), axis=1)
        m = d < best; best[m] = d[m]; s_[m] = j + t[m]
    # hat weights round each bone's middle (j + .5)
    for j, n in enumerate(names):
        w = np.clip(1 - np.abs(s_ - (j + .5)), 0, 1)
        if j == 0: w = np.where(s_ < .5, 1, w)
        if j == len(names) - 1: w = np.where(s_ > j + .5, 1, w)
        ww = np.zeros(NV); ww[idx] = w * (1 if wt is None else wt[idx]); add(n, ww)
def nearest_blend(mask, names, pw=6, wt=None):
    idx = np.where(mask)[0]
    if not len(idx): return
    P = co[idx]; D = np.stack([segd(P, n) for n in names], 1) + 1e-3; inv = D ** -pw; inv /= inv.sum(1, keepdims=True)
    for j, n in enumerate(names):
        w = np.zeros(NV); w[idx] = inv[:, j] * (1 if wt is None else wt[idx]); add(n, w)
axis_blend(trunk, [('head', 1.30), ('trunk_1', 1.28), ('trunk_2', 1.12), ('trunk_3', .77), ('trunk_4', .40)], Z)
axis_blend(tail, [('Spine_05', .69), ('tail_1', .87), ('tail_2', 1.04), ('tail_3', 1.24), ('tail_4', 1.46), ('tail_5', 1.60)], Y, wt=(1 - legsum) * tailK)
# LEGS: the HEAT weights inside each leg column, but only onto THAT leg's own chain (+ its shoulder / hip): the cow's leg bones sit
# 20-40 cm behind his leg columns (the fit slid each chain so the hoof TIP lands on his foot), so a rigid split by height swings his legs
# round the wrong pivot; heat spreads it and reads right. What goes is the smear -- the front thigh on the back knee, a leg on the drapes.
gidx = {g.index: g.name for g in me.vertex_groups}; H = {}
for v in me.data.vertices:
    for g in v.groups:
        n = gidx[g.group]; H.setdefault(n, np.zeros(NV))[v.index] = g.weight
for k, m in legm.items():
    own = [n for n in H if n.endswith('_' + k) or n.endswith('_' + k + '_tip')] + (['hip_1_' + k] if k[0] == 'f' else [])
    share = m * (~trunk) * (~headR) / np.maximum(legsum, 1e-6) * np.minimum(legsum, 1)
    Hs = sum(H[n] for n in own if n in H); ok = Hs > 1e-4
    for n in own:
        if n in H: add(n, np.where(ok, H[n] / np.maximum(Hs, 1e-6), 0) * share)
    # a column vertex the heat gave none of its own leg: its thigh
    add('thigh_' + k, np.where(ok, 0, 1) * share)
# anything that fell through every region: the body chain
tot = sum(W.values()); miss = tot < 1e-4
for n, w in body.items(): add(n, w * miss)
print('[WTS] regions: head %d trunk %d tail %d leg %d fallthrough %d' % (headR.sum(), trunk.sum(), tail.sum(), (legsum > .5).sum(), miss.sum()))

# ---- LOOSE PARTS: weld the UV seams, find the islands, every small one rigid to the bone its TOP vertex hangs from
key = {}; wid = np.zeros(NV, int)
for i, p in enumerate(np.round(co / 1e-4).astype(np.int64)):
    wid[i] = key.setdefault(tuple(p), len(key))
par = list(range(len(key)))
def find(a):
    while par[a] != a: par[a] = par[par[a]]; a = par[a]
    return a
for poly in me.data.polygons:
    vs = [wid[v] for v in poly.vertices]
    for v in vs[1:]:
        ra, rb = find(vs[0]), find(v)
        if ra != rb: par[ra] = rb
root = np.array([find(wid[i]) for i in range(NV)]); isl = {}
for i, r in enumerate(root): isl.setdefault(r, []).append(i)
names = list(W.keys()); M = np.stack([W[n] for n in names], 1)
big = max(isl.values(), key=len); nloose = 0
for r, ids in isl.items():
    if ids is big: continue
    ids = np.array(ids); topi = ids[np.argmax(Z[ids])]
    if Y[topi] > 1.0:     # the tail tassels: the tail bone above them
        cand = ['tail_2', 'tail_3', 'tail_4', 'tail_5']; d = [np.hypot(*(co[topi][:2] - (np.array(BD[n].head_local)[:2] + np.array(BD[n].tail_local)[:2]) / 2)) for n in cand]; b = cand[int(np.argmin(d))]
    else: b = names[int(np.argmax(M[topi]))]
    M[ids] = 0; M[ids, names.index(b)] = 1; nloose += 1
print('[WTS] loose parts made rigid:', nloose)
# ---- top 4, normalised, written
order = np.argsort(-M, 1)[:, :4]; keep = np.zeros_like(M); rows = np.arange(NV)[:, None]; keep[rows, order] = M[rows, order]
keep[keep < .02] = 0; keep /= keep.sum(1, keepdims=True)
for g in list(me.vertex_groups): me.vertex_groups.remove(g)
for j, n in enumerate(names):
    g = me.vertex_groups.new(name=n); col = keep[:, j]
    for wv in np.unique(np.round(col[col > 0], 4)):
        g.add([int(i) for i in np.where(np.round(col, 4) == wv)[0]], float(wv), 'REPLACE')
print('[WTS] groups', len(names), 'max infl', int((keep > 0).sum(1).max()))
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='ACTIONS', export_yup=True, export_skins=True,
                          export_image_format='WEBP', export_force_sampling=True, export_frame_step=1, export_optimize_animation_size=False)
print('[WTS] wrote', OUT)
