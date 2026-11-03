# THE MAMMOTH'S FEET (Korajin m2347). The cow clips roll the hoof up to ~70 deg (a slender cow hoof); on the mammoth's half-metre pad that swings
# the pad 30-40 cm under the ground. Per clip, per frame: keep the pad FLAT while the foot is planted (and only part of the roll in the swing),
# two-bone IK the thigh + shin so the pad's lowest point sits on y=0 (+ the swing lift the clip had), and raise the body only where a leg cannot
# reach. The hips' own bob is the cow's and is kept.
#   bpy has no draco: strip it first, plant, then draco it back (gltf-transform, resample + draco edgebreaker):
#     node undraco.mjs models/creatures/mammoth.glb raw.glb        (pip `bpy` 5.2 runs this headless -- no Blender binary needed)
#     python -I mammoth_plant.py -- raw.glb planted.glb            (prints, per clip: pad min before, residual after, body drop, stride m/s)
#   Skipped: Jump* / Fall / Death* / Lie* / Swim* (their feet are not meant to be on the ground).
import bpy, sys, math, numpy as np
from mathutils import Vector, Matrix, Quaternion
A = sys.argv[sys.argv.index('--') + 1:]; SRC, OUT = A[0], A[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
for o in list(bpy.data.objects):
    if o.name.startswith('Icosphere'): bpy.data.objects.remove(o, do_unlink=True)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
me = [o for o in bpy.data.objects if o.type == 'MESH' and o.parent == arm][0]
assert arm.matrix_world == Matrix(), 'armature not at identity'
PB = arm.pose.bones; BD = arm.data.bones; sc = bpy.context.scene; VL = bpy.context.view_layer
LEGS = {'fL': 'f_L', 'fR': 'f_R', 'bL': 'b_L', 'bR': 'b_R'}
co = np.array([me.matrix_world @ v.co for v in me.data.vertices])
low = co[:, 2] < co[:, 2].min() + .25
SG = {'fL': (1, -1), 'fR': (-1, -1), 'bL': (1, 1), 'bR': (-1, 1)}
PAD = {k: np.where(low & (np.abs(co[:, 0]) > .25) & (co[:, 1] > -1.0) & (np.sign(co[:, 0]) == sx) & (np.sign(co[:, 1]) == sy))[0] for k, (sx, sy) in SG.items()}
for o in PB: o.rotation_mode = 'QUATERNION'
SKIP = ('Jump', 'Fall', 'Death', 'Lie', 'Swim', 'CINEMA')
LIFT_ROLL = .45      # how much of the cow's hoof roll survives at full swing lift
ROLL_FULL = .10      # m of ankle lift at which that share is reached

def deformed():
    ev = me.evaluated_get(bpy.context.evaluated_depsgraph_get()); m = ev.to_mesh()
    c = np.empty(len(m.vertices) * 3); m.vertices.foreach_get('co', c); ev.to_mesh_clear(); return c.reshape(-1, 3)

def heading():     # body yaw from the spine: Spine_base -> Spine_01, horizontal
    d = PB['Spine_01'].head - PB['Spine_base'].head; return math.atan2(d.x, -d.y)
REST_H = math.atan2((BD['Spine_01'].head_local - BD['Spine_base'].head_local).x, -(BD['Spine_01'].head_local - BD['Spine_base'].head_local).y)

def setm(n, M): PB[n].matrix = M; VL.update()

def ik(leg, P):
    t, s = 'thigh_' + leg, 'shin_' + leg
    T = PB[t].head.copy(); K = PB[s].head.copy(); E = PB[s].tail.copy()
    a = (K - T).length; b = (E - K).length; TP = P - T; d0 = TP.length
    d = min(max(d0, abs(a - b) + 1e-4), a + b - 1e-4); u = TP.normalized()
    n = (K - T).cross(E - T)
    if n.length < 1e-6: n = Vector((1, 0, 0))
    n.normalize(); side = 1 if (K - T).dot(n.cross((E - T).normalized())) >= 0 else -1
    cA = max(-1, min(1, (a * a + d * d - b * b) / (2 * a * d))); sA = math.sqrt(1 - cA * cA)
    w = n.cross(u); w = w - u * w.dot(u); w.normalize()
    K2 = T + (u * cA + w * side * sA) * a
    q1 = (K - T).rotation_difference(K2 - T)
    setm(t, Matrix.Translation(T) @ q1.to_matrix().to_4x4() @ Matrix.Translation(-T) @ PB[t].matrix)
    K3 = PB[s].head.copy(); E3 = PB[s].tail.copy()
    q2 = (E3 - K3).rotation_difference(P - K3)
    setm(s, Matrix.Translation(K3) @ q2.to_matrix().to_4x4() @ Matrix.Translation(-K3) @ PB[s].matrix)
    return d0 - (a + b)     # > 0: out of reach by that much

def reach_drop(leg, P):     # how far the body must come DOWN (rigidly) so P is within reach
    T = PB['thigh_' + leg].head; K = PB['shin_' + leg].head; E = PB['shin_' + leg].tail
    R = ((K - T).length + (E - K).length) * .985; dx = Vector((P.x - T.x, P.y - T.y)).length; v = T.z - P.z
    if dx >= R: return 0.0
    return max(0.0, v - math.sqrt(R * R - dx * dx))

def smooth(x, cyc, sig=1.4):
    n = len(x); k = np.arange(-4, 5); g = np.exp(-k * k / (2 * sig * sig)); g /= g.sum(); out = np.zeros(n)
    for i in range(n):
        for j, w in zip(k, g):
            jj = (i + j) % n if cyc else min(max(i + j, 0), n - 1); out[i] += w * x[jj]
    return out

ad = arm.animation_data or arm.animation_data_create()
from bpy_extras import anim_utils
report = []
for act in list(bpy.data.actions):
    name = act.name
    if name.startswith(SKIP): continue
    ad.action = act; ad.action_slot = act.slots[0]
    f0, f1 = map(int, act.frame_range); F = list(range(f0, f1 + 1)); N = len(F)
    cyc = name.endswith('_IP') or 'loop' in name or name.startswith(('Idle', 'Walk', 'Trot', 'Run'))
    # ---- pass A: the original
    ank = {k: [] for k in LEGS}; hrot = {k: [] for k in LEGS}; tipq = {k: [] for k in LEGS}; yaw = []; padmin0 = {k: [] for k in LEGS}
    for f in F:
        sc.frame_set(f); c = deformed(); yaw.append(heading() - REST_H)
        for k, leg in LEGS.items():
            ank[k].append(PB['shin_' + leg].tail.copy()); hrot[k].append(PB['hoof_' + leg].matrix.to_quaternion()); tipq[k].append(PB['hoof_%s_tip' % leg].rotation_quaternion.copy())
            padmin0[k].append(c[PAD[k], 2].min())
    lift = {}
    for k, leg in LEGS.items():
        z = np.array([p.z for p in ank[k]]); zr = BD['shin_' + leg].tail_local.z
        zs = min(np.percentile(z, 30), zr + .02); lift[k] = np.maximum(0, z - zs)
    # ---- pass B: solve. B (body raise) first from reach, then IK + flat pads, two corrections off the measured pad
    restA = {k: BD['shin_' + leg].tail_local.z for k, leg in LEGS.items()}
    # the ankle height of a FLAT planted pad = rest ankle z minus the rest pad's lowest point
    padA = {k: restA[k] - co[PAD[k], 2].min() for k in LEGS}
    tgt = {k: [Vector((ank[k][i].x, ank[k][i].y, padA[k] + lift[k][i])) for i in range(N)] for k in LEGS}
    Braw = np.zeros(N)
    for i, f in enumerate(F):
        sc.frame_set(f); Braw[i] = max(reach_drop(LEGS[k], tgt[k][i]) for k in LEGS)
    Bs = np.maximum(smooth(np.array([max(Braw[max(0, i - 1):i + 2]) for i in range(N)]), cyc), Braw)
    out = {}; worst = 0; padlog = {k: [] for k in LEGS}
    for i, f in enumerate(F):
        sc.frame_set(f)
        if Bs[i] > 1e-5: setm('Spine_base', Matrix.Translation((0, 0, -Bs[i])) @ PB['Spine_base'].matrix)
        Rz = Quaternion((0, 0, 1), yaw[i])
        for k, leg in LEGS.items():
            r = LIFT_ROLL * min(1, lift[k][i] / ROLL_FULL)
            flat = Rz @ BD['hoof_' + leg].matrix_local.to_quaternion()
            want = flat.slerp(hrot[k][i], r); P = tgt[k][i].copy()
            for it in range(3):
                ik(leg, P)
                h = PB['hoof_' + leg]; setm('hoof_' + leg, Matrix.Translation(h.head.copy()) @ want.to_matrix().to_4x4())
                PB['hoof_%s_tip' % leg].rotation_quaternion = Quaternion().slerp(tipq[k][i], r); VL.update()
                if it < 2:
                    pm = deformed()[PAD[k], 2].min(); P.z += (lift[k][i] - pm)
            pm = deformed()[PAD[k], 2].min(); padlog[k].append(pm - lift[k][i]); worst = max(worst, abs(pm - lift[k][i]))
        snap = {}
        for n in ['Spine_base'] + [b % leg for leg in LEGS.values() for b in ('thigh_%s', 'shin_%s', 'hoof_%s', 'hoof_%s_tip')]:
            snap[n] = (PB[n].location.copy(), PB[n].rotation_quaternion.copy())
        out[f] = snap
    # ---- write: every frame keyed on the touched bones
    cb = anim_utils.action_ensure_channelbag_for_slot(act, act.slots[0])
    for n in out[F[0]]:
        prevq = None
        for path, idx_n in (('location', 3), ('rotation_quaternion', 4)):
            dp = 'pose.bones["%s"].%s' % (n, path)
            for ix in range(idx_n):
                fc = cb.fcurves.find(dp, index=ix) or cb.fcurves.new(dp, index=ix, group_name=n)
                fc.keyframe_points.clear(); fc.keyframe_points.add(N)
                vals = []
                pq = None
                for f in F:
                    L, Q = out[f][n]
                    if path == 'rotation_quaternion':
                        if pq is not None and Q.dot(pq) < 0: Q = -Q
                        pq = Q; vals.append(Q[ix])
                    else: vals.append(L[ix])
                for j, f in enumerate(F):
                    kp = fc.keyframe_points[j]; kp.co = (f, vals[j]); kp.interpolation = 'LINEAR'
                fc.update()
    # ---- the stride: the planted ankle's backward speed in authored m/s (24 fps)
    sp = []
    for k in LEGS:
        for i in range(1, N):
            if lift[k][i] < .01 and lift[k][i - 1] < .01: sp.append((ank[k][i].y - ank[k][i - 1].y) * 24)
    stride = float(np.median(sp)) if sp else 0
    pad0 = min(min(v) for v in padmin0.values())
    report.append((name, N, pad0, worst, float(Bs.max()), stride))
    print('[PLANT] %-18s n%3d  pad min before %+.3f  after err %.3f  body drop max %.3f  stride %.2f m/s' % report[-1], flush=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=True, export_animation_mode='ACTIONS', export_yup=True, export_skins=True,
                          export_image_format='WEBP', export_force_sampling=True, export_frame_step=1, export_optimize_animation_size=False)
print('[PLANT] wrote', OUT)
