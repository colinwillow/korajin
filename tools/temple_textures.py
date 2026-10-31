#!/usr/bin/env python3
# The Sky Temple's stone maps (m1949): generate with the image API, make each SEAMLESS (blend the edges with a half-offset copy, which
# wraps by construction), write textures/temple_<name>.webp. Re-roll one:  python3 tools/temple_textures.py wall
# The proxy injects the key (any dummy works). Model: gpt-image-2 (gpt-image-1 is listed but refused here).
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised but detailed, like a high-end fantasy action game.")
PROMPTS = {
  'wall': "Ancient megalithic temple wall: huge precisely fitted pale pinkish-beige sandstone ashlar blocks of varied sizes (three to four courses tall), weathered edges, chisel marks, fine cracks, subtle lichen, faint worn carved lines. Warm sandstone palette.",
  'paving': "Top-down ancient temple floor: large worn pale sandstone paving slabs, irregular rectangles, chipped corners, thin dark joints with a little dirt and moss, worn smooth by centuries. Warm pale beige palette.",
  'rock': "Eroded natural sandstone cliff face of a floating sky island: layered strata, vertical weathering streaks, rough fractured faces, small cracks and pits, a few roots and moss tufts. Warm pinkish-tan palette.",
  'carpet': "An ornate ancient temple CARPET RUNNER seen from above, running vertically: deep crimson red woven wool, a gold-yellow woven border band down BOTH the left and right edges, and a row of stacked gold diamond/lozenge motifs down the centre. Visible wool weave and slight wear, faded in places. Must tile seamlessly top to bottom.",
  'weave': "Plain neutral light grey woven fabric close-up: coarse canvas / burlap-like weave with visible over-under threads, subtle fibres, slight unevenness. Neutral, almost no colour, mid-to-light grey, for tinting.",
  'glyph': "Dark ancient-technology basalt wall panel: near-black blue-grey stone blocks inlaid with thin glowing jade-green carved geometric glyph circuits and spirals, gold metal seams between blocks. Mysterious alien temple.",
}
BANNER = ("Flat front orthographic view of a hanging ancient temple BANNER that fills the ENTIRE image edge to edge (no background visible, no pole, no rope): "
  "deep crimson woven wool cloth with visible weave and slight wear, a gold embroidered border running round all four edges, a large gold diamond-within-a-diamond "
  "lozenge motif with ornate embroidered detail in the upper-middle, and two thin gold embroidered bars across the lower third. Even diffuse lighting, no shadows, no folds, no text.")
def gen(name):
  req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps({"model": "gpt-image-2", "prompt": COMMON + ' ' + PROMPTS[name], "size": "1024x1024", "n": 1}).encode(),
                               headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
  d = json.load(urllib.request.urlopen(req, timeout=400))['data'][0]
  return Image.open(io.BytesIO(base64.b64decode(d['b64_json']) if 'b64_json' in d else urllib.request.urlopen(d['url']).read()))
def seamless(im, band=110):
  a = np.asarray(im.convert('RGB')).astype(np.float32); H, W, _ = a.shape; b = np.roll(np.roll(a, H // 2, 0), W // 2, 1)
  dy = np.minimum(np.arange(H), H - 1 - np.arange(H))[:, None]; dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
  m = 1 - np.clip(np.minimum(dx, dy) / band, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
  return Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8))
# the carpet tiles top to bottom only (pass it through seamless anyway: the side seam is never seen); the banner is a single picture, 1024x1536,
# written at 512x1536 un-tiled -- `templeBannerMat` cuts it with the kit banner's tattered hem:  python3 tools/temple_textures.py banner
for n in (sys.argv[1:] or PROMPTS):
  if n == 'banner':
    PROMPTS['banner'] = BANNER; COMMON_SAVE = COMMON; globals()['COMMON'] = ''
    req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps({"model": "gpt-image-2", "prompt": BANNER, "size": "1024x1536", "n": 1}).encode(), headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
    d = json.load(urllib.request.urlopen(req, timeout=400))['data'][0]; Image.open(io.BytesIO(base64.b64decode(d['b64_json']))).convert('RGB').resize((512, 1536)).save('textures/temple_banner.webp', quality=86, method=6); print('wrote textures/temple_banner.webp'); continue
  seamless(gen(n)).save(f'textures/temple_{n}.webp', quality=86, method=6); print('wrote textures/temple_%s.webp' % n)
