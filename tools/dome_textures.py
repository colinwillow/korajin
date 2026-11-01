#!/usr/bin/env python3
# The Forest Domed Temple's maps (m2144): generate with the image API, make the tiling ones SEAMLESS, write textures/dome_<name>.webp.
# Re-roll one:  python3 tools/dome_textures.py moss      (the proxy injects the key; any dummy works)
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised hand-painted but detailed, like a lush high-end fantasy adventure game (Ghibli / Zelda palette).")
PROMPTS = {
  'stone': "Ancient temple wall of smooth cream-white weathered limestone ashlar blocks, neat courses, soft rounded worn edges, faint hairline cracks, a little green moss and grime settled in the joints. Cream and warm ivory palette.",
  'cyclo': "Ancient cyclopean masonry: huge irregular rounded polygonal pale grey-cream stone blocks fitted tightly together, thick green moss growing over the tops and in the joints, weathered and old. Pale stone with lush green moss.",
  'moss': "Lush thick green moss and tiny leafy ground plants covering a surface seen straight on: dense soft cushion moss, small clover-like leaves, tiny ferns, variation from bright lime to deep forest green. Vibrant saturated greens.",
  'grass': "Top-down forest clearing floor: short lush green grass with clover, moss patches, a few tiny white flowers and fallen leaves, sunlit. Bright saturated greens.",
  'cobble': "Top-down old worn path of pale cream flagstones and rounded cobbles, irregular shapes, grass and moss growing in the gaps between stones. Pale warm stone with green joints.",
  'bark': "Old forest tree BARK close-up running vertically: deep vertical ridges and furrows, grey-brown with olive green moss and lichen patches, rich and detailed.",
  'leaves': "Dense canopy of bright green broad leaves seen close up, layered overlapping leaves in many shades of green with sunlight catching some, filling the whole square.",
  'relief': "A horizontal carved stone FRIEZE BAND in cream-white limestone: a continuous flowing scrolling acanthus leaf and vine relief deeply carved, running left to right, with a thin plain moulding along the top and bottom edges, some moss in the deep cuts. Must tile seamlessly left to right.",
  'gold': "Ancient ornate GOLD metal surface: polished gilded gold with raised swirling Art-Nouveau scrollwork and leaf filigree in relief, warm rich gold highlights, dark brown tarnish in the recesses. Warm yellow gold.",
}
SINGLES = {
  'door': ("Flat front orthographic view of a tall pair of ornate ancient GOLD temple doors with a round-arched top, filling the ENTIRE image edge to edge "
           "(no wall, no frame visible, no background): two leaves meeting in the middle, covered in raised swirling scrollwork, spirals and leaf filigree in polished gold "
           "with dark tarnish in the recesses, a vertical seam down the centre. Even diffuse lighting, no shadows, no text.", "1024x1536"),
  'banner': ("Flat front orthographic view of a long hanging temple BANNER that fills the ENTIRE image edge to edge (no background, no pole): deep cobalt blue woven cloth with "
             "visible weave, a gold embroidered border round all four edges, and a large gold embroidered stylised TREE emblem with spreading branches and roots in the middle. "
             "Even diffuse lighting, no folds, no shadows, no text.", "1024x1536"),
  'gem': ("A single big faceted cobalt-blue gemstone cabochon set in an almond-shaped (vesica / pointed oval) polished gold bezel, seen straight on, filling the whole image, "
          "the gold bezel with small engraved scroll details, glowing deep blue with a bright highlight. Plain dark background outside the bezel. No text.", "1024x1024"),
}
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
for n in (sys.argv[1:] or list(PROMPTS) + list(SINGLES)):
  if n in SINGLES:
    p, sz = SINGLES[n]; im = gen(p, sz).convert('RGB')
    if n != 'gem': im = im.resize((512, 768))
    else: im = im.resize((512, 512))
    im.save(f'textures/dome_{n}.webp', quality=86, method=6); print('wrote', n); continue
  im = gen(COMMON + ' ' + PROMPTS[n])
  (seamX(im) if n == 'relief' else seamless(im)).resize((768, 768) if n in ('leaves',) else (1024, 1024)).save(f'textures/dome_{n}.webp', quality=86, method=6); print('wrote', n)
