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
  'glyph': "Dark ancient-technology basalt wall panel: near-black blue-grey stone blocks inlaid with thin glowing jade-green carved geometric glyph circuits and spirals, gold metal seams between blocks. Mysterious alien temple.",
}
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
for n in (sys.argv[1:] or PROMPTS):
  seamless(gen(n)).save(f'textures/temple_{n}.webp', quality=86, method=6); print('wrote textures/temple_%s.webp' % n)
