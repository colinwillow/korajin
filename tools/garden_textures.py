#!/usr/bin/env python3
# THE GARDEN's maps (PROLOGUE P1): image API, tiling ones made SEAMLESS, written to textures/garden_<name>.webp.
# Re-roll one:  python3 tools/garden_textures.py flag      (the proxy injects the key; any dummy works)
# Alpha cards (transparent): vine, fern.  Banners/hammock: single pictures laid on by UV.
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised hand-painted but detailed, like a lush high-end fantasy adventure game (Ghibli / Zelda palette).")
PROMPTS = {
  'flag': "Top-down garden path of large irregular pale warm-grey and cream FLAGSTONES, flat worn tops, thin joints filled with bright green moss and tiny grass, sunlit morning warmth.",
  'rock': "Cliff face of a floating sky island: weathered layered grey-beige stone with soft rounded ledges and cracks, patches of bright green moss and tiny ferns hanging off ledges, warm sunlit tones.",
  'lawn': "Top-down lush garden lawn: soft short bright green grass with clover, tiny white and pink flowers, moss patches, sunlit morning. Saturated fresh greens.",
  'roof': "Rows of curved glazed JADE-GREEN Chinese temple roof tiles seen straight on, the tiles in neat vertical ridges with round end caps, glossy teal-green glaze with gold trim highlights and a little moss.",
  'wood': "Weathered warm brown carved WOOD planks running vertically with soft grain, slightly worn, with faint red lacquer remains in the grain, temple timber.",
}
SINGLES = {
  'hammock': ("Flat front orthographic view of a woven fabric that fills the ENTIRE image edge to edge (no background): deep red cloth with cream-white woven stripes "
              "running along its length and a cream geometric diamond-and-key pattern border band, visible weave, hand-painted fantasy game style, even lighting, no folds, no text.", "1536x1024"),
  'banner_red': ("Flat front orthographic view of a long hanging temple BANNER filling the ENTIRE image edge to edge (no background, no pole): deep crimson red woven cloth, "
                 "a cream-gold embroidered border, and a large cream-white embroidered diamond emblem with a small tree glyph at its centre in the upper middle. Even lighting, no folds, no text.", "1024x1536"),
  'banner_teal': ("Flat front orthographic view of a long hanging temple BANNER filling the ENTIRE image edge to edge (no background, no pole): deep teal-green woven cloth, "
                  "a gold embroidered border, and a large gold embroidered stylised diamond and leaf emblem in the middle. Even lighting, no folds, no text.", "1024x1536"),
}
ALPHA = {
  'vine': ("A CURTAIN of six long hanging WEEPING WILLOW strands side by side filling the image width, each a trailing stem densely hung with small slender bright green leaves, a few glowing pale-mint tips, "
           "hanging straight down from the top edge, different lengths, dense at the top thinning toward the tips, stylised hand-painted fantasy game art, isolated on a fully transparent background, no shadow, no text.", "1024x1536", (512, 768)),
  'fern': ("A lush green FERN plant seen from the side, many arching fronds spreading from the base, bright and deep greens, stylised hand-painted fantasy game art, isolated on a fully transparent background, no pot, no shadow, no text.", "1024x1024", (512, 512)),
  'flowers': ("A small clump of wildflowers seen from the side: pink, white and lavender blossoms on green stems with leaves, stylised hand-painted fantasy game art, isolated on a fully transparent background, no shadow, no text.", "1024x1024", (512, 512)),
}
def req(body):
  r = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
  d = json.load(urllib.request.urlopen(r, timeout=400))['data'][0]
  return Image.open(io.BytesIO(base64.b64decode(d['b64_json']) if 'b64_json' in d else urllib.request.urlopen(d['url']).read()))
def gen(prompt, size="1024x1024"):
  for model in ("gpt-image-2", "gpt-image-1.5"):
    try: return req({"model": model, "prompt": prompt, "size": size, "n": 1})
    except Exception as e: print(model, 'failed', e, file=sys.stderr)
  raise SystemExit('no image')
def seamless(im, band=110):
  a = np.asarray(im.convert('RGB')).astype(np.float32); H, W, _ = a.shape; b = np.roll(np.roll(a, H // 2, 0), W // 2, 1)
  dy = np.minimum(np.arange(H), H - 1 - np.arange(H))[:, None]; dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
  m = 1 - np.clip(np.minimum(dx, dy) / band, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
  return Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8))
for n in (sys.argv[1:] or list(PROMPTS) + list(SINGLES) + list(ALPHA)):
  try:
    if n in ALPHA:
      p, sz, out = ALPHA[n]; im = req({"model": "gpt-image-1.5", "prompt": p, "size": sz, "n": 1, "background": "transparent", "output_format": "png"}).convert('RGBA').resize(out, Image.LANCZOS)
      im.save(f'textures/garden_{n}.webp', quality=88, method=6); print('wrote', n, flush=True); continue
    if n in SINGLES:
      p, sz = SINGLES[n]; im = gen(p, sz).convert('RGB'); im = im.resize((768, 512) if n == 'hammock' else (512, 768))
      im.save(f'textures/garden_{n}.webp', quality=86, method=6); print('wrote', n, flush=True); continue
    im = gen(COMMON + ' ' + PROMPTS[n]); seamless(im).resize((1024, 1024)).save(f'textures/garden_{n}.webp', quality=86, method=6); print('wrote', n, flush=True)
  except BaseException as e: print('FAILED', n, e, flush=True)
