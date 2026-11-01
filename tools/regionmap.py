# REGION_METHOD.md stage 1: a whole-region heightmap whose VALLEYS ARE THE PATHS -- a maze over a coarse grid (a random spanning tree plus a
# few loops) carved into noisy mountains; some links are passes over a ridge, some narrow gorges, some tunnels (underpasses); waypoints are
# suggested from what the terrain offers. One PNG per seed + a contact sheet.  python3 tools/regionmap.py [seeds...]   (default 1..6)
# Writes images/concepts/region/map_<seed>.png, map_<seed>.json (the graph + heights, for the game later) and maps_sheet.png.
import sys, json, math, os, numpy as np
from PIL import Image, ImageDraw, ImageFont

SIZE = 480          # metres a side
RES = 480           # pixels (1 px = 1 m)
NODES = 16          # places (graph nodes)
MINSP = 82          # metres between places at least
MAXL = 170          # longest link considered
LOOPS = 3           # extra links beyond the tree (so it is not one corridor)
OUT = 'images/concepts/region'

def noise(rng, res, octaves=5):
    out = np.zeros((res, res))
    for o in range(octaves):
        n = 3 * 2 ** o
        g = rng.random((n + 1, n + 1))
        xs = np.linspace(0, n, res, endpoint=False)
        i = xs.astype(int); f = xs - i; f = f * f * (3 - 2 * f)
        a = g[np.ix_(i, i)]; b = g[np.ix_(i, i + 1)]; c = g[np.ix_(i + 1, i)]; d = g[np.ix_(i + 1, i + 1)]
        fx = f[None, :]; fy = f[:, None]
        out += ((a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy) / 2 ** o
    return out / out.max()

def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy + 1e-9
    t = np.clip(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1)
    return np.hypot(px - (ax + t * dx), py - (ay + t * dy)), t

def make(seed):
    rng = np.random.default_rng(seed)
    cell = 70.0
    # nodes: ~16 places by Poisson-disc sampling (min spacing), so the paths are a sparse network with MOUNTAIN MASSES between them
    nodes = []
    for _ in range(4000):
        P = rng.uniform(34, SIZE - 34, 2)
        if all(np.hypot(*(P - Q)) > MINSP for Q in nodes): nodes.append(P)
        if len(nodes) >= NODES: break
    nodes = np.array(nodes)
    # candidate links: near neighbours; a random spanning tree (Kruskal, random weights that favour short links) + a few non-crossing loops
    cand = sorted({(i, j) for i in range(len(nodes)) for j in range(i + 1, len(nodes)) if np.hypot(*(nodes[i] - nodes[j])) < MAXL})
    def cross(e, f):
        if len(set(e) | set(f)) < 4: return False
        A, B, C, D = nodes[e[0]], nodes[e[1]], nodes[f[0]], nodes[f[1]]
        o = lambda p, q, r: np.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]))
        return o(A, B, C) != o(A, B, D) and o(C, D, A) != o(C, D, B)
    par = list(range(len(nodes)))
    def root(k):
        while par[k] != k: par[k] = par[par[k]]; k = par[k]
        return k
    edges = []
    for e in sorted(cand, key=lambda e: np.hypot(*(nodes[e[0]] - nodes[e[1]])) * rng.uniform(.6, 1.6)):
        ra, rb = root(e[0]), root(e[1])
        if ra != rb and not any(cross(e, f) for f in edges): par[ra] = rb; edges.append(e)
    extra = [e for e in sorted(cand, key=lambda e: np.hypot(*(nodes[e[0]] - nodes[e[1]]))) if e not in edges]
    n = 0
    for e in extra:
        if n >= LOOPS: break
        if not any(cross(e, f) for f in edges): edges.append(e); n += 1
    deg = np.zeros(len(nodes), int)
    for a, b in edges: deg[a] += 1; deg[b] += 1
    # SPAWN: a low corner-ish leaf; TEMPLE: the node farthest along the graph from it (reached last), raised high
    adj = {k: [] for k in range(len(nodes))}
    for a, b in edges: adj[a].append(b); adj[b].append(a)
    spawn = min(range(len(nodes)), key=lambda k: nodes[k][0] + nodes[k][1] + 40 * (deg[k] > 2))     # the north-west-most place
    dist = {spawn: 0}; q = [spawn]
    while q:
        k = q.pop(0)
        for n in adj[k]:
            if n not in dist: dist[n] = dist[k] + 1; q.append(n)
    far = max(dist.values())
    temple = max(dist, key=lambda k: (dist[k], -deg[k]))
    # floors rise with graph distance from the spawn (the region climbs toward the temple), with noise; a few basins dip
    floor = np.array([4 + 46 * (dist[k] / far) ** 1.1 + rng.uniform(-6, 6) for k in range(len(nodes))])
    floor[spawn] = 2; floor[temple] += 22
    basins = [k for k in rng.permutation(len(nodes)) if k not in (spawn, temple) and deg[k] >= 2][:2]
    for k in basins: floor[k] = max(0, floor[k] - 14)
    # edge kinds: a few PASSES (raised middle), GORGES (narrow and deep), TUNNELS (not carved: an underpass through a ridge)
    kinds = []
    for e in edges:
        r = rng.random()
        kinds.append('tunnel' if r < .08 else 'pass' if r < .26 else 'gorge' if r < .40 else 'valley')
    # terrain
    yy, xx = np.mgrid[0:RES, 0:RES] * (SIZE / RES)
    mount = 40 + 70 * noise(rng, RES) + 25 * noise(rng, RES, 3) ** 2
    H = mount.copy()
    T = nodes[temple]; dT = np.hypot(xx - T[0], yy - T[1]); H = np.where(dT < 110, np.maximum(H, floor[temple] + 70 * np.clip(1 - dT / 110, 0, 1) ** 1.2), H)     # the TEMPLE MOUNTAIN: a massif round it (before the carving, so the valleys still cut in)
    bends = []
    for (a, b), kd in zip(edges, kinds):
        A, B = nodes[a], nodes[b]; mid = (A + B) / 2 + rng.uniform(-.22, .22, 2) * cell     # a bend so no valley is a ruler line
        bends.append(mid.tolist())
        if kd == 'tunnel': continue
        w = {'valley': 15, 'pass': 11, 'gorge': 6}[kd] * rng.uniform(.8, 1.3)
        # m2091 (his: "extremely narrow -- more like a crevice; how are you gonna put a village in a 5 foot wide crevice"): WIDE floors, GENTLE banks
        F = {'valley': .9, 'pass': .8, 'gorge': 1.0}[kd] * w     # flat floor HALF-width: valley ~27 m across, pass ~18, gorge ~12
        for (P, Q, fa, fb) in ((A, mid, floor[a], (floor[a] + floor[b]) / 2), (mid, B, (floor[a] + floor[b]) / 2, floor[b])):
            d, t = seg_dist(xx, yy, P[0], P[1], Q[0], Q[1])
            f = fa + (fb - fa) * t
            if kd == 'pass': f = f + 16 * np.sin(np.pi * (t * .5 + (0 if P is A else .5)))     # up over the ridge and down
            bank = (np.clip(d - F, 0, 10) * .3) if kd != 'gorge' else 0     # a walkable bank (~17 deg) for 10 m, then the mountain
            prof = f + bank + np.clip(d - F - (10 if kd != 'gorge' else 0), 0, None) * (1.1 if kd != 'gorge' else 2.6)
            H = np.minimum(H, prof)
    for k, P in enumerate(nodes):     # each node a small widening (a basin is a wide bowl: the lake)
        r = 30 if k in basins else 16 + 4 * deg[k]     # m2091: every PLACE a real basin (20-32 m round, flat), the lake's wider
        d = np.hypot(xx - P[0], yy - P[1]); H = np.minimum(H, floor[k] + np.clip(d - r, 0, 10) * .3 + np.clip(d - r - 10, 0, None) * 1.1)
    # waypoints from what the terrain offers
    used = {spawn, temple}
    def pick(cond, key):
        c = [k for k in range(len(nodes)) if k not in used and cond(k)]
        if not c: return None
        k = min(c, key=key); used.add(k); return k
    village = pick(lambda k: deg[k] >= 3 and dist[k] <= max(2, far * .35), lambda k: dist[k])
    lake = basins[0] if basins else None; used.add(lake)
    cabin = pick(lambda k: deg[k] == 1 and dist[k] > far * .3, lambda k: -floor[k])
    wall = pick(lambda k: deg[k] >= 2 and far * .45 < dist[k] < far * .8, lambda k: abs(dist[k] - far * .6))
    forest = pick(lambda k: True, lambda k: abs(floor[k] - 25) + rng.random() * 5)
    lookout = pick(lambda k: True, lambda k: -floor[k])
    wp = {'SPAWN': spawn, 'VILLAGE': village, 'LAKE': lake, 'FOREST': forest, 'BIG WALL': wall, 'CABIN': cabin, 'LOOKOUT': lookout, 'TEMPLE MTN': temple}
    # numbers: the tree path spawn -> temple
    prev = {spawn: None}; q = [spawn]
    while q:
        k = q.pop(0)
        for n in adj[k]:
            if n not in prev: prev[n] = k; q.append(n)
    path = [temple]
    while prev[path[-1]] is not None: path.append(prev[path[-1]])
    plen = sum(np.hypot(*(nodes[path[i]] - nodes[path[i + 1]])) for i in range(len(path) - 1))
    stats = {'seed': seed, 'links': len(edges), 'places': len(nodes), 'route_m': round(float(plen)), 'route_climb_m': round(float(floor[temple] - floor[spawn])),
             'peak_m': round(float(H.max())), 'tunnels': kinds.count('tunnel'), 'passes': kinds.count('pass'), 'gorges': kinds.count('gorge')}
    return dict(H=H, nodes=nodes, edges=edges, kinds=kinds, bends=bends, floor=floor, wp=wp, stats=stats, path=path)

def render(M, px=480):
    H = M['H']; s = px / RES
    gy, gx = np.gradient(H)
    shade = np.clip(.85 + (-gx * .6 - gy * .45) * .5, .35, 1.25)
    t = np.clip(H / 150, 0, 1)[..., None]
    low = np.array([238, 244, 236]); mid = np.array([160, 170, 188]); high = np.array([92, 96, 112])     # valley floors pale, mountains darker with height
    col = np.where(t < .35, low + (mid - low) * (t / .35), mid + (high - mid) * ((t - .35) / .65))
    img = np.clip(col * shade[..., None], 0, 255).astype(np.uint8)
    im = Image.fromarray(img).resize((px, px), Image.BILINEAR); d = ImageDraw.Draw(im)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 12); big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
    except Exception: font = big = ImageFont.load_default()
    C = {'valley': (192, 57, 43), 'pass': (142, 68, 173), 'gorge': (22, 120, 160), 'tunnel': (40, 40, 40)}
    onpath = set(zip(M['path'], M['path'][1:])) | set(zip(M['path'][1:], M['path']))
    for (a, b), kd, mid in zip(M['edges'], M['kinds'], M['bends']):
        P = [tuple(M['nodes'][a] * s), tuple(np.array(mid) * s), tuple(M['nodes'][b] * s)]
        wdt = 4 if (a, b) in onpath else 2
        if kd == 'tunnel':
            for i in range(2):
                (x0, y0), (x1, y1) = P[i], P[i + 1]
                for u in np.arange(0, 1, .12): d.line([(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u), (x0 + (x1 - x0) * (u + .06), y0 + (y1 - y0) * (u + .06))], fill=C[kd], width=wdt)
        else: d.line(P, fill=C[kd], width=wdt, joint='curve')
    for nm, k in M['wp'].items():
        if k is None: continue
        x, y = M['nodes'][k] * s; r = 7 if nm in ('SPAWN', 'TEMPLE MTN') else 5
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255), outline=(20, 20, 20), width=2)
        d.text((x + 9, y - 7), f"{nm} {M['floor'][k]:.0f}m", fill=(10, 10, 10), font=font, stroke_width=3, stroke_fill=(255, 255, 255))
    S = M['stats']
    d.rectangle([0, 0, px, 22], fill=(255, 255, 255))
    d.text((6, 3), f"seed {S['seed']}: route {S['route_m']} m, climb {S['route_climb_m']} m, peak {S['peak_m']} m, {S['passes']} passes, {S['gorges']} gorges, {S['tunnels']} tunnels", fill=(0, 0, 0), font=font)
    return im

if __name__ == '__main__':
    seeds = [int(a) for a in sys.argv[1:]] or [1, 2, 3, 4, 5, 6]
    os.makedirs(OUT, exist_ok=True); ims = []
    for sd in seeds:
        M = make(sd); im = render(M); im.save(f'{OUT}/map_{sd}.png'); ims.append(im)
        json.dump({'size': SIZE, 'stats': M['stats'], 'nodes': M['nodes'].round(1).tolist(), 'floor': M['floor'].round(1).tolist(), 'edges': M['edges'], 'kinds': M['kinds'],
                   'bends': M['bends'], 'waypoints': M['wp']}, open(f'{OUT}/map_{sd}.json', 'w'), default=int)
        print(M['stats'], M['wp'])
    cols = 3; rows = math.ceil(len(ims) / cols); W = 480
    sheet = Image.new('RGB', (cols * W + (cols + 1) * 8, rows * W + (rows + 1) * 8 + 40), (255, 255, 255)); d = ImageDraw.Draw(sheet)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    except Exception: f = ImageFont.load_default()
    d.text((10, 10), 'REGION MAPS (480 m square). red = valley path (thick = the route spawn -> temple), purple = pass over a ridge, blue = gorge, dashed = tunnel', fill=(0, 0, 0), font=f)
    for i, im in enumerate(ims): sheet.paste(im, (8 + (i % cols) * (W + 8), 48 + (i // cols) * (W + 8)))
    sheet.save(f'{OUT}/maps_sheet.png'); print('wrote', f'{OUT}/maps_sheet.png')
