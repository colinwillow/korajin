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
def creek_floor(s): return 9.6 if s < 9 else 6.6 if s < 24 else 3.6 if s < 38 else 0.6 if s < 46 else 0.0
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
            if d < 6.5: y = creek_floor(s)
            elif hz > 50:     # the slivers at the cliff foot take the nearest terrace's height (no pits behind the houses)
                best = (1e9, 0)
                for nm, lv, poly in TERR:
                    dd = _segd(hx, hz, poly + [poly[0]])[0]
                    if dd < best[0]: best = (dd, lv)
                y = best[1] if best[0] < 8 else 0.0
            else: y = 0.0
        D[j, i] = BASE + y
np.round(np.clip(D, 0, 163) * 400).astype('<u2').tofile('levels/hamlet_d1.bin')
meta = json.load(open('levels/region_6.json'))
meta['hamlet'] = {'base': BASE, 'x0': float(x0), 'z0': float(z0), 'nx': nx, 'nz': nz, 'res': R, 'file': 'levels/hamlet_d1.bin',
    'labels': [{'name': nm, 'x': round(float(h2w(np.mean(p, 0))[0]), 1), 'z': round(float(h2w(np.mean(p, 0))[1]), 1), 'y': round(BASE + lv, 1)} for nm, lv, p in TERR],
    'creek': [[round(float(h2w(p)[0]), 1), round(float(h2w(p)[1]), 1), round(BASE + creek_floor(s) + .05, 2)] for p, s in zip(CREEK, cl)],
    'gate': [round(float(v), 1) for v in h2w((-12, 18))]}
for q in meta['places']:
    if q['id'] == 'village': q['x'], q['z'] = meta['hamlet']['gate']
json.dump(meta, open('levels/region_6.json', 'w'), indent=1)
print('hamlet: base', BASE, 'detail', nx, 'x', nz, 'at', x0, z0)
