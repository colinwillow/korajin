# REGION_METHOD stage 2: the PICKED seed with every place named (the existing snow pieces re-placed onto it). python3 tools/regionpick.py
import sys, json; sys.argv = ['x']
exec(open('tools/regionmap.py').read().split("if __name__")[0])
SEED = 6
PLACES = {     # node -> name (map_6.json); the route spawn -> temple is the thick line
    5: 'SPAWN', 15: 'WILLOW SHRINE', 14: 'VILLAGE (gate)', 2: 'HOT SPRING', 0: 'MAMMOTH MEADOW', 9: 'BIG WALL', 13: 'PINE FOREST',
    7: 'STANDING STONES', 3: 'CABIN', 8: 'ICE CAVES (underpass)', 10: "DRAGON'S GATE", 6: 'LAKE', 12: 'GREAT WATERFALL', 4: 'TEMPLE STAIR',
    11: 'LOOKOUT', 1: 'ICE TEMPLE' }
M = make(SEED); M['wp'] = {v: k for k, v in PLACES.items()}
im = render(M, 960); im.save('images/concepts/region/region_pick.png')
json.dump({'seed': SEED, 'places': {v: {'node': k, 'at': M['nodes'][k].round(1).tolist(), 'floor': round(float(M['floor'][k]), 1)} for k, v in PLACES.items()}},
          open('images/concepts/region/region_pick.json', 'w'), indent=1)
print('ok')
# the GAME's copy: a 241 x 241 grid at 2 m (uint16 = metres x 400, little-endian), world x = px - 240, z = py - 240; and the places in world metres
import numpy as np
H = M['H']; n = 241; idx = np.clip((np.arange(n) * 2).astype(int), 0, RES - 1)
G = H[np.ix_(idx, idx)]; np.round(np.clip(G, 0, 163) * 400).astype('<u2').tofile('levels/region_6.bin')
json.dump({'seed': SEED, 'n': n, 'cell': 2, 'half': 240, 'scale': 400,
           'places': [{'id': v.lower().split(' (')[0].replace(' ', '_').replace("'", ''), 'name': v, 'x': round(float(M['nodes'][k][0]) - 240, 1), 'z': round(float(M['nodes'][k][1]) - 240, 1)} for k, v in PLACES.items()]},
          open('levels/region_6.json', 'w'), indent=1)
print('wrote levels/region_6.bin + .json')

# ---- THE HAMLET's site, hand-edited into the region (VILLAGE_BLUEPRINT pass 10 build order step 1) -------------------------------------------
# The blueprint is drawn in its own frame (metres, the pass 2-10 drawings); it is MIRRORED and turned so its gate faces west down the valley and its
# spring sits on the HOT SPRING place, the stable side toward the meadow. Writes the edited region grid again, plus a 0.5 m DETAIL grid for the hamlet
# (the terraces and the gorge, crisp) -- levels/hamlet_d1.bin (uint16 = m x 400, 0 = no detail here) -- and the hamlet block in region_6.json.
def _pip(x, z, poly):
    ins = False; n = len(poly)
    for i in range(n):
        (x1, z1), (x2, z2) = poly[i], poly[(i + 1) % n]
        if (z1 > z) != (z2 > z) and x < x1 + (z - z1) * (x2 - x1) / (z2 - z1): ins = not ins
    return ins
def _segd(px, pz, L):
    best = (1e9, 0); acc = 0
    for (ax, az), (bx, bz) in zip(L, L[1:]):
        dx, dz = bx - ax, bz - az; l2 = dx * dx + dz * dz; t = max(0, min(1, ((px - ax) * dx + (pz - az) * dz) / l2)); d = math.hypot(px - ax - t * dx, pz - az - t * dz)
        if d < best[0]: best = (d, acc + t * math.sqrt(l2))
        acc += math.sqrt(l2)
    return best
PL = json.load(open('levels/region_6.json'))['places']; PP = {q['id']: (q['x'], q['z']) for q in PL}
SH = np.array([-30, 68.]); SW = np.array(PP['hot_spring']); DH = np.array([-18, 46.]); DH /= np.linalg.norm(DH); DM = np.array([-DH[0], DH[1]])
ROT = np.array([[DM[0], DM[1]], [-DM[1], DM[0]]])
def h2w(p): v = np.array(p, float) - SH; v = np.array([-v[0], v[1]]); return SW + ROT @ v
def w2h(q): v = ROT.T @ (np.array(q, float) - SW); return SH + np.array([-v[0], v[1]])
TERR = [('E1 GATE +1.2', 1.2, [(-22,24),(-12,20),(-6,26),(-8,34),(-20,36)]), ('W1 MARKET +2.4', 2.4, [(-58,40),(-52,30),(-40,28),(-30,33),(-29,41),(-40,45)]),
        ('W2 HOMES +5.4', 5.4, [(-70,48),(-64,38),(-58,40),(-40,45),(-33,49),(-38,56),(-56,57)]), ('W3 STORES +8.4', 8.4, [(-72,58),(-70,48),(-56,57),(-38,56),(-40,63),(-56,66)]),
        ('WATCH KNOLL +8', 8.0, [(-66,30),(-58,22),(-50,23),(-52,30),(-58,40),(-64,38)]), ('E2 BATH +4.2', 4.2, [(-24,40),(-20,36),(-8,34),(-4,42),(-12,48),(-22,47)]),
        ('E3 HOMES +7.2', 7.2, [(-26,52),(-22,47),(-12,48),(-6,54),(-10,62),(-24,62)]), ('E4 SHRINE +10.8', 10.8, [(-36,66),(-30,62),(-10,62),(-14,70),(-30,71)])]
CLIFF = [(-82,20),(-82,26),(-76,38),(-74,50),(-70,60),(-60,68),(-50,72),(-40,70),(-30,74),(-20,72),(-12,76),(-4,74),(4,64)]
SITE = CLIFF + [(10,50),(14,30),(12,12),(-30,10),(-70,12)]
CREEK = [(-30,67),(-31,60),(-33,54),(-31,48),(-28,43),(-27,37),(-24,30),(-26,24),(-20,18),(-6,16),(10,20)]
FALLS = [(0, 9.6)]     # creek floor by distance from the spring: three ~3 m falls
cl = [0]; [cl.append(cl[-1] + math.hypot(b[0] - a[0], b[1] - a[1])) for a, b in zip(CREEK, CREEK[1:])]
def creek_floor_z(hz): return 6.0 if hz > 60 else 3.0 if hz > 46 else 0.6 if hz > 33 else 0.0     # district 2 fix: the gorge floor is always BELOW the lower bank beside it (E4/W3, E3/W2, E2/W1, then out)
gx = lambda x: (x + 240) / 2
Hg = H.copy()
def Hs(x, z): return float(Hg[min(240, max(0, int(round((z + 240) / 2)))), min(240, max(0, int(round((x + 240) / 2))))])
BASE = round(Hs(*h2w((-12, 22.5))), 1)
# the region grid, edited: flatten the site to BASE - .3 (the detail grid sits on it), raise a cliff band behind the horseshoe to BASE + 18, cut the ridge notch
G2 = np.round(np.clip(G, 0, 163) * 400).astype(float) / 400
for j in range(n):
    for i in range(n):
        wx, wz = i * 2 - 240, j * 2 - 240; hx, hz = w2h((wx, wz))
        if abs(hx + 35) > 70 or abs(hz - 45) > 55: continue
        if _pip(hx, hz, SITE): G2[j, i] = BASE - .3
        else:
            d = _segd(hx, hz, CLIFF)[0]
            if d < 16: G2[j, i] = max(G2[j, i], BASE + 18 - max(0, d - 8) * .6)
for j in range(n):
    for i in range(n):
        wx, wz = i * 2 - 240, j * 2 - 240; d = math.hypot(wx - 22, wz + 118)
        if d < 12: G2[j, i] -= 11 * (1 - d / 12) ** .7     # the NOTCH: the temple's crown from the watchtower (pass 5)
np.round(np.clip(G2, 0, 163) * 400).astype('<u2').tofile('levels/region_6.bin')
# the DETAIL grid (0.5 m) over the site's world bounds
corners = np.array([h2w(p) for p in SITE]); x0, z0 = np.floor(corners.min(0)) - 2; x1, z1 = np.ceil(corners.max(0)) + 2
R = .5; nx, nz = int((x1 - x0) / R) + 1, int((z1 - z0) / R) + 1; D = np.zeros((nz, nx))
for j in range(nz):
    for i in range(nx):
        hx, hz = w2h((x0 + i * R, z0 + j * R))
        if not _pip(hx, hz, SITE): continue
        y = None
        for nm, lv, poly in TERR:
            if _pip(hx, hz, poly): y = lv; break
        if y is None:
            d, s = _segd(hx, hz, CREEK)
            if d < 6.5: y = creek_floor_z(hz)
            elif hz > 50:     # the slivers at the cliff foot take the nearest terrace's height (no pits behind the houses)
                best = (1e9, 0)
                for nm, lv, poly in TERR:
                    dd = _segd(hx, hz, poly + [poly[0]])[0]
                    if dd < best[0]: best = (dd, lv)
                y = best[1] if best[0] < 8 else 0.0
            else: y = 0.0
        D[j, i] = BASE + y
# ---- DISTRICT 2 (VILLAGE_BLUEPRINT pass 4 + 10 build step 2): the ramps and stairs are slopes IN the grid; the bridges are boxes (over the gorge
# path, which passes under them); the road and the lanes are painted. Heights are the blueprint's levels above BASE.
RAMPS = [  # id, A, B (hamlet frame), width, h0 -> h1, kind
    ('r_gate', (-16, 20), (-15, 24.5), 4.5, 0.0, 1.2, 'road'),       # outside -> E1 at the gate
    ('r_market', (-50, 35.5), (-57, 46.5), 4.5, 2.4, 5.4, 'road'),   # the MAMMOTH RAMP, market -> W2 (13 m, 1 : 4.3)
    ('s_w2w3', (-65, 47.5), (-68, 54.5), 2.2, 5.4, 8.4, 'lane'),     # timber stair W2 -> W3
    ('s_e2e3', (-15, 44.5), (-15, 52.0), 2.2, 4.2, 7.2, 'lane'),     # stairs beside the bathhouse, E2 -> E3
    ('s_tunnel', (-21, 57.5), (-21, 66.0), 2.0, 7.2, 10.8, 'lane'),  # U2: the tunnel stair, E3 -> E4 (roofed where it runs inside E4)
    ('s_gorge', (-19, 32.5), (-23.5, 32.5), 2.0, 1.2, 0.0, 'lane'),  # E1 -> down to the gorge path by the wheel
]
for rid, A, B, w, h0, h1, kd in RAMPS:
    A, B = np.array(A, float), np.array(B, float); L = np.linalg.norm(B - A); u = (B - A) / L; nrm = np.array([-u[1], u[0]])
    for j in range(nz):
        for i in range(nx):
            hx, hz = w2h((x0 + i * R, z0 + j * R)); q = np.array([hx, hz]) - A; t = q @ u; s2 = abs(q @ nrm)
            if -0.5 <= t <= L + 0.5 and s2 <= w / 2: D[j, i] = BASE + h0 + (h1 - h0) * min(1, max(0, t / L))
np.round(np.clip(D, 0, 163) * 400).astype('<u2').tofile('levels/hamlet_d1.bin')
def seg_box(A, B, w, top, th=.45, ext=1.0):     # a flat deck box from A to B (hamlet), in WORLD: centre, half sizes, yaw
    A, B = np.array(A, float), np.array(B, float); u = (B - A) / np.linalg.norm(B - A); A2, B2 = A - u * ext, B + u * ext
    wa, wb = h2w(A2), h2w(B2); c = (wa + wb) / 2; d = wb - wa; L = np.linalg.norm(d)
    return {'cx': round(float(c[0]), 2), 'cz': round(float(c[1]), 2), 'hx': round(float(L / 2), 2), 'hz': round(w / 2, 2), 'yaw': round(float(math.atan2(d[1], d[0])), 4), 'y0': round(BASE + top - th, 2), 'y1': round(BASE + top, 2)}
def stepped(A, B, w, h0, h1, kind, ext=1.0):     # a bridge that climbs in .3 m flat steps (each a walkable riser)
    n = max(1, int(round(abs(h1 - h0) / .3))); A, B = np.array(A, float), np.array(B, float); out = []
    for k in range(n + 1):
        a = A + (B - A) * k / (n + 1); b = A + (B - A) * (k + 1) / (n + 1); top = h0 + (h1 - h0) * k / n if n else h0
        bx = seg_box(a, b, w, top, ext=ext if k in (0, n) else .02); bx['kind'] = kind; out.append(bx)
    return out
BRIDGES = [('B1', stepped((-10, 15), (-18, 21), 4.5, 0.3, 0.3, 'timber')), ('B2', stepped((-19.5, 31.5), (-30.5, 32.5), 4.5, 1.2, 2.4, 'stone')),
           ('B3', stepped((-33.5, 48.5), (-22, 45.5), 4.5, 5.4, 4.2, 'stone')), ('U3', stepped((-66, 50), (-62, 39), 2.2, 8.4, 8.2, 'timber'))]
# the tunnel's ROOF: E4 continues over the stair where it runs inside the terrace (from the E3/E4 wall at hz 62 to 65.5), at E4's top
ROOF = [dict(seg_box((-21, 62.2), (-21, 65.2), 2.6, 10.8, th=1.2, ext=0), kind='stone')]
# ---- DISTRICT 3 (pass 6 + 10 build step 3): the AQUEDUCT and the HIGH ROUTE's standable surfaces, as grey stand-in blocks at the blueprint's heights
# (the buildings replace them in district 4 with the same tops). Heights are above BASE; the route numbers are pass 6's.
HX = h2w((1, 0)) - h2w((0, 0)); HYAW = math.atan2(HX[1], HX[0])     # the hamlet's +x axis in the world (for blocks squared to the hamlet)
def hbox(c, w, d, y0, y1, kind, yaw=0.0):
    wc = h2w(c); return {'cx': round(float(wc[0]), 2), 'cz': round(float(wc[1]), 2), 'hx': round(w / 2, 2), 'hz': round(d / 2, 2), 'yaw': round(float(HYAW + yaw), 4), 'y0': round(BASE + y0, 2), 'y1': round(BASE + y1, 2), 'kind': kind}
BLOCKS = [
    ('h1_crates', hbox((-20.5, 29.5), 1.4, 1.4, 1.2, 2.1, 'wood')),                 # 1: crates (E1 +0.9)
    ('h2_watch', hbox((-18, 26.5), 4, 4, 3.8, 4.2, 'wood')),                         # 1-2: the watch platform deck (E1 + 3.0)
    ('h2_watch_post', hbox((-18, 26.5), 1.2, 1.2, 1.2, 3.8, 'wood')),
    ('h2_gate_l', hbox((-14.6, 22.0), .9, 1.2, 1.2, 6.3, 'wood')), ('h2_gate_r', hbox((-9.4, 23.4), .9, 1.2, 1.2, 6.3, 'wood')),
    ('h2_gate_top', dict(seg_box((-14.6, 22.0), (-9.4, 23.4), 1.4, 6.3, th=.6, ext=.45), kind='wood')),     # 2: the gate top (E1 + 5.1), pillar to pillar
    ('h3_smithy', hbox((-10, 30), 6, 5, 1.2, 4.3, 'block')), ('h3_smithy_ridge', hbox((-10, 30), 6, 1.2, 4.3, 5.2, 'block')),     # 3: the smithy ridge (E1 + 4.0)
    ('h4_wheel', hbox((-24.6, 32), 1.0, 5.0, 0.6, 5.0, 'wood')), ('h5_wheel_top', hbox((-24.6, 32), 1.6, 1.6, 5.0, 5.6, 'wood')),     # 4-5: the WHEEL (static stand-in; it turns in district 5)
    ('h6_bath', hbox((-15, 41.5), 9, 5, 4.2, 6.6, 'block')), ('h6_bath_ridge', hbox((-15, 41.5), 9, 1.6, 6.6, 8.6, 'block')),     # 6: the bathhouse eave (+6.6) and ridge (+8.6)
    ('h8_store', hbox((-44, 60), 5, 4, 8.4, 11.4, 'block')),                         # 8: the storehouse's flat roof (W3 + 3.0)
    ('h10_tower', hbox((-57, 28), 4.4, 4.4, 8.0, 16.0, 'block')),                    # 10: the watchtower (knoll + 8 = +16)
    ('h10_chimney_rock', hbox((-57, 22.4), 5, 1.4, 8.0, 15.0, 'rock')),              # 10: the rock face 4.6 m off the tower's face: the CHIMNEY
]
# the aqueduct: deck +11 on piers, spring -> the bath ridge; piers stand on whatever is under them
AQ = [(-30, 68), (-44, 62), (-42, 52), (-34, 46), (-17, 41.8)]
AQB = []
for a, b in zip(AQ, AQ[1:]):
    bx = seg_box(a, b, 3.4, 11.0, th=.6, ext=.9); bx['kind'] = 'aq'; AQB.append(bx)
def ground_at_h(hx, hz):
    for nm, lv, poly in TERR:
        if _pip(hx, hz, poly): return lv
    return 0.0
for a, b in zip(AQ, AQ[1:]):
    L = math.hypot(b[0] - a[0], b[1] - a[1]); n = max(1, int(L // 8))
    for k in range(n + 1):
        if k == n and b != AQ[-1]: continue
        t = k / n; c = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
        AQB.append(hbox(c, 1.8, 1.8, ground_at_h(*c), 10.4, 'aq'))
ZIP = [[round(float(h2w((-57, 28))[0]), 2), round(BASE + 17.2, 2), round(float(h2w((-57, 28))[1]), 2)], [round(float(h2w((-43, 36))[0]), 2), round(BASE + 3.4, 2), round(float(h2w((-43, 36))[1]), 2)]]
ROAD = [(6, 15), (-8, 14), (-16, 19), (-15, 24), (-10, 28), (-16, 33), (-24, 30), (-34, 31), (-44, 33), (-52, 37), (-56, 44), (-48, 50), (-36, 49), (-25, 47), (-16, 44)]
LANES = [[(-56, 44), (-66, 46)], [(-48, 50), (-50, 48)], [(-36, 49), (-36, 53.5)], [(-66, 47), (-68, 54), (-60, 58), (-44, 60), (-52, 61)], [(-16, 44), (-15, 52), (-12, 57), (-21, 58), (-21, 66), (-24, 66)],
         [(-12, 57), (-7, 61)], [(-15, 52), (-20, 55)], [(-19, 32.5), (-24, 32.5), (-26, 24), (-24, 30), (-27, 37), (-28, 43), (-31, 48), (-33, 54)]]
meta = json.load(open('levels/region_6.json'))
meta['hamlet'] = {'base': BASE, 'x0': float(x0), 'z0': float(z0), 'nx': nx, 'nz': nz, 'res': R, 'file': 'levels/hamlet_d1.bin',
    'labels': [{'name': nm, 'x': round(float(h2w(np.mean(p, 0))[0]), 1), 'z': round(float(h2w(np.mean(p, 0))[1]), 1), 'y': round(BASE + lv, 1)} for nm, lv, p in TERR],
    'creek': [[round(float(h2w(p)[0]), 1), round(float(h2w(p)[1]), 1), round(BASE + creek_floor_z(p[1]) + .05, 2)] for p in CREEK],
    'gate': [round(float(v), 1) for v in h2w((-12, 18))],
    'boxes': [dict(b, id=bid) for bid, L in BRIDGES for b in L] + [dict(b, id='U2roof') for b in ROOF] + [dict(b, id=bid) for bid, b in BLOCKS] + [dict(b, id='aq') for b in AQB],
    'zips': [ZIP],
    'paint': [{'w': 4.5, 'col': 'road', 'pts': [[round(float(h2w(p)[0]), 2), round(float(h2w(p)[1]), 2)] for p in ROAD]}] + [{'w': 2.0, 'col': 'lane', 'pts': [[round(float(h2w(p)[0]), 2), round(float(h2w(p)[1]), 2)] for p in L]} for L in LANES],
    'bridgeLabels': [{'name': bid, 'x': L[len(L) // 2]['cx'], 'z': L[len(L) // 2]['cz'], 'y': L[len(L) // 2]['y1']} for bid, L in BRIDGES]}
for q in meta['places']:
    if q['id'] == 'village': q['x'], q['z'] = meta['hamlet']['gate']
json.dump(meta, open('levels/region_6.json', 'w'), indent=1)
print('hamlet: base', BASE, 'detail', nx, 'x', nz, 'at', x0, z0)
