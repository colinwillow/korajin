#!/usr/bin/env python3
# The Snow Village kit's painted maps (m2054): generated with the image API, made SEAMLESS by the half-offset blend (tools/temple_textures.py's
# method), written to textures/svk_<name>.webp. Re-roll one:  python3 tools/snowvil_textures.py thatch
# The proxy injects the key (any dummy works). Model: gpt-image-2.
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Hand-painted stylised fantasy game art (chunky, readable shapes, painterly highlights on edges), "
          "like a high-end stylised action RPG.")
PROMPTS = {
  'stone': "Dry-laid stone wall of a snowy mountain village hut: chunky rounded cool grey-violet stones of varied sizes in loose irregular courses, bevelled "
           "painterly edges with pale highlights on top edges, deep dark-violet mortar gaps, a few small chips and cracks, faint frost in the joints. Palette cool grey, lavender, slate.",
  'ashlar': "Dressed ashlar masonry of an ancient snowy aqueduct: large rectangular grey-violet stone blocks in neat running-bond courses, softly bevelled painterly "
            "edges catching light, thin dark joints, a few chisel marks, chipped corners, faint frost. Cool grey-lavender palette.",
  'thatch': "Thick straw THATCH roof seen front-on: dense overlapping layered bundles of golden-tan straw running vertically down the image, each layer's ragged "
            "fringe overhanging the next in horizontal rows, darker brown shadowed straw between layers, warm golden highlights. Warm tan, ochre and brown palette.",
  'timber': "Rough hewn timber beam surface: warm reddish-brown wood with strong vertical grain running top to bottom, a few knots, cracks along the grain, "
            "painterly highlights on the grain ridges, weathered. Rich warm brown palette.",
  'planks': "Old wooden door planks: vertical dark brown boards with deep grain, dark gaps between the planks, worn edges, a few iron nail heads, weathered. Dark warm brown palette.",
  'paving': "Top-down worn flagstone paving of a snowy village: irregular flat grey-violet stone slabs with dark joints, a little snow and frost packed in the joints, chipped edges.",
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
def one(n):
  try: seamless(gen(n)).save(f'textures/svk_{n}.webp', quality=86, method=6); return 'wrote textures/svk_%s.webp' % n
  except Exception as e: return 'FAILED %s: %s' % (n, e)
with ThreadPoolExecutor(6) as ex:
  for r in ex.map(one, sys.argv[1:] or list(PROMPTS)): print(r, flush=True)
