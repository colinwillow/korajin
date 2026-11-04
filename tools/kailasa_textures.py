#!/usr/bin/env python3
# The FOREST TEMPLE's rock-cut complex (his, Nov 4 2026: Kailasa at Ellora as INSPIRATION -- "cut out of the mountain; none of it looks built or
# placed, it's literally carved"). Our own motifs only: invented forest guardians / beasts and Jinra scrolls, no real deities or sacred iconography.
# One stone for everything (no masonry joints). Writes textures/kail_<name>.webp.  Re-roll one: python3 tools/kailasa_textures.py rock
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
# the image call and the seam blends, as in tools/dome_textures.py (that file generates on import)
def gen(prompt, size="1024x1024"):
  for model in ("gpt-image-2", "gpt-image-1.5"):
    try:
      req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps({"model": model, "prompt": prompt, "size": size, "n": 1}).encode(),
                                   headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
      d = json.load(urllib.request.urlopen(req, timeout=400))['data'][0]
      return Image.open(io.BytesIO(base64.b64decode(d['b64_json']) if 'b64_json' in d else urllib.request.urlopen(d['url']).read()))
    except Exception as e: print(model, 'failed', e, file=sys.stderr)
  raise SystemExit('no image')
def seamless(im, band=110):
  a = np.asarray(im.convert('RGB')).astype(np.float32); H, W, _ = a.shape; b = np.roll(np.roll(a, H // 2, 0), W // 2, 1)
  dy = np.minimum(np.arange(H), H - 1 - np.arange(H))[:, None]; dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
  m = 1 - np.clip(np.minimum(dx, dy) / band, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
  return Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8))
def seamX(im, band=110):     # the frieze tiles left-right only: blend the side seam, leave the mouldings top and bottom alone
  a = np.asarray(im.convert('RGB')).astype(np.float32); H, W, _ = a.shape; b = np.roll(a, W // 2, 1)
  dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]; m = 1 - np.clip(dx / band, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
  return Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8))
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised hand-painted but detailed, like a lush high-end fantasy adventure game.")
ROCK = "warm dark grey-brown volcanic basalt"
PROMPTS = {
  'rock': f"A sheer QUARRIED cliff face of one continuous {ROCK}, cut by hand: fine parallel chisel and pick marks, shallow tool-cut steps, weathered rounded edges, "
          "streaks of water staining, a few thin cracks, green moss and tiny ferns in the cracks. NO bricks, NO blocks, NO masonry joints: one living rock.",
  'floor': f"Top-down view of a courtyard floor hewn out of solid {ROCK}: a flat tool-dressed rock surface with chisel marks, worn smooth patches, shallow puddle stains, "
           "moss and small plants creeping along hairline cracks. NO paving stones, NO joints.",
  'frieze': f"A horizontal carved stone FRIEZE BAND in {ROCK}, deep high relief: a procession of life-size invented forest guardian BEASTS seen side-on, shoulder to shoulder, "
            "as if carrying the temple on their backs -- great moss-backed tusked forest beasts, antlered stag-like guardians, broad-shouldered bear-like creatures, "
            "carved in one rock, weathered, moss in the recesses. Original fantasy creatures, not real animals, no humans, no gods, no religious symbols.",
  'panel': f"Densely carved relief wall panel in {ROCK}: a grid of tall niches between carved pilasters, each niche holding an invented robed forest-spirit guardian figure "
           "with leaf crowns and long staves, the borders filled with flowing vine scrolls and spiral seed motifs, weathered, moss in the deep recesses. "
           "Original fantasy motifs only, no real deities, no religious iconography.",
}
for n in (sys.argv[1:] or list(PROMPTS)):
  im = gen(COMMON + ' ' + PROMPTS[n])
  (seamX(im) if n in ('frieze',) else seamless(im)).resize((1024, 1024)).save(f'textures/kail_{n}.webp', quality=86, method=6); print('wrote', n)
