#!/usr/bin/env python3
# UNDERWATER (his Nov 5: "a sea flora texture might help, some bed rock and stuff"): generate the seabed / ruin / flora maps with the image API,
# make them SEAMLESS, write textures/uw_<name>.webp (768 px: they tile at metres-scale and are sampled triplanar, so 768 is plenty on a phone).
# Re-roll one:  python3 tools/uw_textures.py bed      (the proxy injects the key; any dummy works)
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
COMMON = ("Seamless tileable game texture, perfectly flat orthographic top-down view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised painterly but richly detailed, like a lush high-end fantasy adventure game.")
PROMPTS = {
  'bed':   "Deep alien SEABED floor: dark blue-grey volcanic rock and rounded pebbles half buried in fine pale sand, patches of tiny purple and teal coral polyps, "
           "small anemone tufts and crusty encrusting algae in violet, magenta and turquoise, a few tiny glowing cyan dots. Cool blue-violet palette, mid-dark value.",
  'rock':  "Underwater ROCK surface close-up: dark slate blue-grey stone with cracks and pits, encrusted with purple coralline algae, teal sponge patches, tiny barnacles "
           "and soft violet moss. Cool blue-violet palette.",
  'glyph': "Ancient sunken temple wall of dark teal-grey carved stone blocks, square ornamental GLYPH carvings in each block (geometric spiral and key patterns, like "
           "Mayan/Japanese seals), worn edges, purple coralline algae and teal moss in the joints. Dark cool palette, the carvings as deeper grooves.",
  'coral': "Alien SEA FLORA skin close-up: translucent fleshy coral / kelp tissue with a network of branching VEINS, small round pores and spots, gradients of violet, "
           "magenta and teal, slightly iridescent. Organic, no straight lines.",
}
def gen(prompt, size="1024x1024"):
  for model in ("gpt-image-2", "gpt-image-1.5", "gpt-image-1"):
    try:
      req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps({"model": model, "prompt": prompt, "size": size, "n": 1}).encode(),
                                   headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
      d = json.load(urllib.request.urlopen(req, timeout=400))['data'][0]
      return Image.open(io.BytesIO(base64.b64decode(d['b64_json']) if 'b64_json' in d else urllib.request.urlopen(d['url']).read()))
    except Exception as e: print(model, 'failed', e, file=sys.stderr)
  raise SystemExit('no image')
def seamless(im, band=120):
  a = np.asarray(im.convert('RGB')).astype(np.float32); H, W, _ = a.shape; b = np.roll(np.roll(a, H // 2, 0), W // 2, 1)
  dy = np.minimum(np.arange(H), H - 1 - np.arange(H))[:, None]; dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
  m = 1 - np.clip(np.minimum(dx, dy) / band, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
  return Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8))
for n in (sys.argv[1:] or list(PROMPTS)):
  im = gen(COMMON + ' ' + PROMPTS[n]); seamless(im).resize((768, 768), Image.LANCZOS).save(f'textures/uw_{n}.webp', quality=84, method=6); print('wrote', n)
