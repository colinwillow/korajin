# LAKE_REGION.md's map: the lake region from straight above (north = -z, up), drawn from the SAME canyon formulas the game uses
# (cx(z), hw(z), lakeEnd) and the SC_LAKE placements, with the planned sub-regions, the axis, the routes, the channels out and the entries.
#   python3 tools/lakeplan.py      -> images/plan/lake_region_plan.png
import math
from PIL import Image, ImageDraw, ImageFont

F = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'
f1, f2, f3, fT = [ImageFont.truetype(F % s, n) for s, n in (('-Bold', 22), ('', 15), ('-Bold', 15), ('-Bold', 20))]
K = .8                                   # px per metre
X0, X1, Z0, Z1 = -560, 560, -1000, 1000  # world extent drawn
W, H = int((X1 - X0) * K), int((Z1 - Z0) * K) + 150
im = Image.new('RGB', (W, H), (236, 226, 200)); d = ImageDraw.Draw(im, 'RGBA')
P = lambda x, z: ((x - X0) * K, (z - Z0) * K + 60)

def S(a, b, x):
    t = min(1, max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t)
cx = lambda z: 55 * math.sin(z * .0042) + 22 * math.sin(z * .011 + 1.3)
hw = lambda z: (98 + 34 * math.sin(z * .0035 + 2)) * (1 - S(640, 830, abs(z)))
BAY = (0, 400, 175)                      # PLANNED: the village bay (u, z, R) -- the canyon widened into a round harbour

def poly(fu, z0, z1, step=6):
    L = [P(cx(z) - fu(z), z) for z in range(z0, z1 + 1, step)]; R = [P(cx(z) + fu(z), z) for z in range(z1, z0 - 1, -step)]; return L + R
# the plateau (green), the bluff tiers (stepped bands), the water
d.rectangle((0, 60, W, H - 60), fill=(166, 178, 128))
for k, col in enumerate([(196, 150, 112), (208, 166, 124), (220, 184, 140), (230, 204, 160)]):
    d.polygon(poly(lambda z, k=k: hw(z) + 150 - k * 34 if abs(z) < 900 else 0, -900, 900), fill=col)
d.polygon(poly(lambda z: hw(z) + 10, -830, 830), fill=(232, 218, 176))                       # the beaches
d.polygon(poly(hw, -830, 830), fill=(96, 170, 186))
# the channels out (rivers): north to the FOREST, south to the DESERT; east (later) to the OCEAN
for pts, lab, dash in (([(cx(-640), -640), (cx(-760) - 30, -760), (-80, -1000)], 'RIVER -> FOREST (north channel)', 0),
                       ([(cx(640), 640), (cx(780) + 40, 780), (90, 1000)], 'RIVER -> DESERT (south channel)', 0),
                       ([(cx(150) + 120, 150), (330, 120), (560, 60)], 'sea-arch channel -> OCEAN (later)', 1)):
    q = [P(*a) for a in pts]
    for i in range(len(q) - 1):
        if dash:
            for t in range(0, 20, 2): a, b = q[i], q[i + 1]; d.line([(a[0] + (b[0] - a[0]) * t / 20, a[1] + (b[1] - a[1]) * t / 20), (a[0] + (b[0] - a[0]) * (t + 1) / 20, a[1] + (b[1] - a[1]) * (t + 1) / 20)], fill=(70, 140, 170), width=10)
        else: d.line([q[i], q[i + 1]], fill=(96, 170, 186), width=26)
    d.text((q[-1][0] + (-250 if q[-1][0] > W / 2 else 8), q[-1][1] - (24 if q[-1][1] > H / 2 else -8)), lab, font=f3, fill=(20, 60, 90))
# the sub-regions
def zone(z0, z1, col, name, sub):
    d.polygon(poly(lambda z: hw(z) + 150, z0, z1), fill=col)
    x, y = P(cx((z0 + z1) / 2) + 250, (z0 + z1) / 2); d.text((x - 20, y - 40), name, font=f1, fill=(40, 30, 20)); d.multiline_text((x - 20, y - 8), sub, font=f2, fill=(40, 30, 20))
zone(-640, -230, (80, 150, 70, 60), 'WILD REACH', 'NATURE (north)\nfalls + grotto, reeds,\nthe great-tree isle,\nstacks, lily coves,\nrope bridge +70')
zone(230, 640, (200, 120, 60, 60), 'LOTUS HARBOUR', 'VILLAGE (south)\nthe water folk: stilts,\nfloating houses, docks,\ncliff dwellings +20..+60')
# the village bay (planned): a round harbour, the mandala village -- ring boardwalks r 60 / r 110, 8 radial piers, the round
# market-shrine platform at the centre, floating houses on the outer ring, cliff dwellings in the bay wall
bx, bz, bR = cx(BAY[1]) + BAY[0], BAY[1], BAY[2]
c = P(bx, bz); d.ellipse((c[0] - bR * K, c[1] - bR * K, c[0] + bR * K, c[1] + bR * K), fill=(96, 170, 186), outline=(90, 60, 40), width=2)
for r in (60, 110): d.ellipse((c[0] - r * K, c[1] - r * K, c[0] + r * K, c[1] + r * K), outline=(120, 80, 50), width=4)
for i in range(8):
    a = i * math.pi / 4 + math.pi / 8; d.line([(c[0] + 18 * K * math.cos(a), c[1] + 18 * K * math.sin(a)), (c[0] + 150 * K * math.cos(a), c[1] + 150 * K * math.sin(a))], fill=(120, 80, 50), width=4)
    for r in (85, 135): hx, hy = c[0] + r * K * math.cos(a + .2), c[1] + r * K * math.sin(a + .2); d.rectangle((hx - 6, hy - 6, hx + 6, hy + 6), fill=(150, 60, 40))
d.ellipse((c[0] - 18 * K, c[1] - 18 * K, c[0] + 18 * K, c[1] + 18 * K), fill=(190, 70, 50))
# the SKY HARBOUR (third sub-region): stacked OVER the centre, +60..+220 m -- the existing islets plus floating mesas, sky docks,
# flying houseboats; the ascent climbs to it from the village's lantern tower
sk0 = P(cx(0) - 150, -280); sk1 = P(cx(0) + 150, 260); d.rounded_rectangle((sk0[0], sk0[1], sk1[0], sk1[1]), 40, fill=(120, 160, 230, 70), outline=(50, 80, 170), width=3)
x, y = P(cx(0) - 520, -230); d.text((x, y), 'SKY HARBOUR', font=f1, fill=(30, 50, 130)); d.multiline_text((x, y + 30), 'the floating one, OVER\nthe centre: +60..+220 m\nfloating mesas, sky docks,\nflying houseboats', font=f2, fill=(30, 50, 130))
for u, z, y2, r in ((-45, -40, 92, 14), (62, 40, 142, 9), (8, -380, 118, 19), (-72, 250, 74, 7), (34, 410, 168, 12), (-10, 140, 205, 10)):
    q = P(cx(z) + u, z); d.ellipse((q[0] - r * K - 3, q[1] - r * K - 3, q[0] + r * K + 3, q[1] + r * K + 3), outline=(50, 80, 170), width=3); d.text((q[0] + r * K + 5, q[1] - 8), '+%d' % y2, font=f2, fill=(30, 50, 130))
# the ascent (planned): village lantern tower -> sky docks, six stages
asc = [(bx + 40, bz - 90, 35), (cx(300) + 40, 300, 60), (cx(230) + 60, 230, 90), (cx(150) + 30, 150, 120), (cx(90) - 20, 90, 150), (cx(30) - 30, 30, 185), (cx(-40) - 10, -40, 220)]
for i, (x, z, y2) in enumerate(asc):
    q = P(x, z); d.ellipse((q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7), fill=(40, 70, 200))
    if i: d.line([P(*asc[i - 1][:2]), q], fill=(40, 70, 200), width=4)
    d.text((q[0] + 9, q[1] - 6), '+%d' % y2, font=f2, fill=(30, 50, 130))
# THE CENTRE: the deep basin, the WATER TEMPLE below (the underwater worker's), the ring of eight lantern buoys on r 64
c2 = P(cx(-20) + 30, -20); d.ellipse((c2[0] - 64 * K, c2[1] - 64 * K, c2[0] + 64 * K, c2[1] + 64 * K), fill=(30, 70, 120)); d.ellipse((c2[0] - 24 * K, c2[1] - 24 * K, c2[0] + 24 * K, c2[1] + 24 * K), fill=(14, 36, 70))
for i in range(8): a = i * math.pi / 4; d.ellipse((c2[0] + 64 * K * math.cos(a) - 5, c2[1] + 64 * K * math.sin(a) - 5, c2[0] + 64 * K * math.cos(a) + 5, c2[1] + 64 * K * math.sin(a) + 5), fill=(255, 200, 90))
d.text((c2[0] + 58, c2[1] - 10), 'THE DEEP BASIN -46 m\n(water temple below)', font=f3, fill=(255, 255, 255))
# THE AXIS: the canyon's centreline, north <-> south; the phi points z = +-396 and +-244
ax = [P(cx(z), z) for z in range(-900, 901, 10)]; d.line(ax, fill=(200, 50, 40), width=3)
for z, lab in ((-396, 'z -396 (640/phi): WILD REACH centre'), (396, ''), (-20, 'centre: the basin')):
    q = P(cx(z), z); d.ellipse((q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6), fill=(200, 50, 40)); d.text((q[0] - 330, q[1] - 8), lab, font=f2, fill=(150, 30, 20))
# what already stands: stacks, obelisks, arches, falls, torii, great tree, spawn
for u, z, r in ((-34, -560, 15), (-18, -250, 15), (52, -470, 10), (-52, 140, 19)):
    q = P(cx(z) + u, z); d.ellipse((q[0] - r * K, q[1] - r * K, q[0] + r * K, q[1] + r * K), fill=(150, 100, 70), outline=(70, 40, 20))
for u, z in ((-36, -112), (-50, -93), (46, 96), (-14, -330), (12, -205)):
    q = P(cx(z) + u, z); d.rectangle((q[0] - 4, q[1] - 4, q[0] + 4, q[1] + 4), fill=(240, 240, 225), outline=(150, 110, 30), width=2)
for A, B in (((2, -150), (46, -150)), ((-48, 362), (-44, 414))):
    d.line([P(cx(A[1]) + A[0], A[1]), P(cx(B[1]) + B[0], B[1])], fill=(110, 70, 50), width=8)
for u, z, lab in ((-118, -330, 'falls + GROTTO'), (-34, -560, 'great tree'), (135, -105, 'torii (east rim)'), (-108, 40, 'boat start')):
    q = P(cx(z) + u, z); d.text((q[0] - 4, q[1] - 22), lab, font=f2, fill=(30, 30, 30)); d.ellipse((q[0] - 4, q[1] - 4, q[0] + 4, q[1] + 4), fill=(30, 30, 30))
# entries (stars): the sky portal over the harbour plaza (the ENTRY slam), the river boat from the south, the cliff stair from the west rim
def star(x, z, lab, left=0):
    q = P(x, z); pts = [(q[0] + (14 if i % 2 == 0 else 6) * math.cos(i * math.pi / 5 - math.pi / 2), q[1] + (14 if i % 2 == 0 else 6) * math.sin(i * math.pi / 5 - math.pi / 2)) for i in range(10)]
    d.polygon(pts, fill=(170, 60, 200)); tw = d.textlength(lab, font=f3); tx = q[0] + 16 if (q[0] + 16 + tw < W - 8 and not left) else q[0] - 16 - tw; d.rectangle((tx - 3, q[1] - 10, tx + tw + 3, q[1] + 10), fill=(250, 245, 235, 200)); d.text((tx, q[1] - 9), lab, font=f3, fill=(110, 30, 140))
star(bx, bz + 4, 'ENTRY: portal slam, the plaza', 1); star(cx(700), 700, 'ENTRY: by boat (south river)'); star(cx(470) - 230, 470, 'ENTRY: cliff stair (west rim)')
d.rectangle((0, 0, W, 56), fill=(236, 226, 200)); d.text((14, 14), 'THE LAKE REGION -- PLAN (top-down, north = -z up, 1 px = %.2f m)' % (1 / K), font=fT, fill=(40, 25, 15))
d.rectangle((0, H - 90, W, H), fill=(236, 226, 200))
for i, t in enumerate(('heights: basin floor -46 | water 0 | boardwalks +2 | stilt houses +4..+10 | beaches +1..+3',
                       'bluff tiers +20..+140 | cliff dwellings +20..+60 | sky harbour +60..+220 | rope bridge +70',
                       'red line = the axis | blue dots = the ascent | squares = obelisks | stars = entries | rings = islets (height)')):
    d.text((14, H - 84 + i * 24), t, font=f2, fill=(40, 25, 15))
im.save('images/plan/lake_region_plan.png', optimize=True); print(W, H)
