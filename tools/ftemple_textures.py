#!/usr/bin/env python3
# The FOREST TEMPLE INTERIOR's maps (FOREST_TEMPLE.md): generate with the image API, make the tiling ones SEAMLESS, write textures/ft_<name>.webp.
# Re-roll one:  python3 tools/ftemple_textures.py wall      (the proxy injects the key; any dummy works)
import json, sys, base64, urllib.request, io
import numpy as np
from PIL import Image
COMMON = ("Seamless tileable game texture, perfectly flat orthographic front view filling the whole square, even diffuse lighting, no perspective, "
          "no cast shadows, no vignette, no border, no text. Stylised hand-painted but detailed, like a high-end fantasy adventure game (Zelda / Ghibli palette), an ANCIENT UNDERGROUND jungle temple.")
PROMPTS = {
  'wall': "Ancient underground temple wall of large weathered blue-grey and green-grey stone ashlar blocks in neat courses, rounded worn edges, chipped corners, dark damp patches, thick dark green moss and tiny ferns growing in the joints. Cool grey-green palette, mid value (not black).",
  'floor': "Top-down worn ancient temple floor of big irregular slate-grey and green-grey flagstones, cracked, with dark moss and small plants in the gaps, a few fallen leaves, damp. Cool grey-green palette, mid value.",
  'carve': "A horizontal carved stone FRIEZE BAND of ancient grey-green temple stone: a continuous row of deeply carved stylised spirals, interlocking key patterns and small guardian masks with round eyes, running left to right, a plain moulding along the top and bottom edges, moss in the deep cuts. Must tile seamlessly left to right.",
  'root': "Giant ancient tree ROOT bark close-up running vertically: twisting gnarled fibres and deep furrows, dark brown and grey-brown with olive moss and pale lichen, rich and detailed.",
  'moss': "Thick dark blue-green moss carpet seen straight on, dense cushion moss with tiny leafy sprigs, scattered with small round glowing pale cyan-mint bioluminescent spots and tiny glowing mushroom caps. Deep teal and forest green, the spots bright.",
  'cobble': "Top-down rough dark grey-green river cobbles and broken stone rubble set in damp earth, moss between the stones. Cool grey palette, mid value.",
}
SINGLES = {
  'door': ("Flat front orthographic view of a massive ancient STONE temple door filling the ENTIRE image edge to edge (no wall, no frame, no background): two heavy grey-green stone leaves meeting "
           "in the middle, deeply carved with a large stylised guardian face with round eyes across both leaves, spirals and key patterns, moss in the cuts, a vertical seam down the centre. "
           "Even diffuse lighting, no shadows, no text.", "1024x1536"),
  'guardian': ("Flat front orthographic view of a tall carved stone relief PANEL filling the ENTIRE image edge to edge: an ancient grey-green stone GUARDIAN warrior figure carved in high relief, "
               "standing, holding a long spear, a stylised mask-like face with round eyes, spirals and key patterns in the border, moss in the deep cuts. Even diffuse lighting, no shadows, no text.", "1024x1536"),
  'pot': ("Flat orthographic unwrapped surface of an ancient clay temple POT, filling the whole image: warm terracotta with a dark painted band of spirals and key patterns round the middle, "
          "chipped glaze, a little moss near the bottom. Even lighting, no shadows, no text. Tiles left to right.", "1536x1024"),
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
    im = im.resize((768, 512)) if n == 'pot' else im.resize((512, 768))
    im.save(f'textures/ft_{n}.webp', quality=86, method=6); print('wrote', n); continue
  im = gen(COMMON + ' ' + PROMPTS[n])
  (seamX(im) if n == 'carve' else seamless(im)).resize((768, 768) if n in ('cobble',) else (1024, 1024)).save(f'textures/ft_{n}.webp', quality=86, method=6); print('wrote', n)
