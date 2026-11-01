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
  'crystal': "Close-up of faceted glowing PURPLE amethyst crystal surface: violet and magenta facets with bright lavender highlights, inner glow, fine internal fractures and sparkle, magical.",
  'sand': "Top-down fine pale cream ZEN GARDEN SAND, soft warm ivory with tiny grains and a few minute pebbles, very subtle, smooth and clean, sunlit.",
  'water': "Top-down shallow glowing magical JINRA water: luminous mint and turquoise water with bright caustic light ripples, soft swirls and sparkles, a few pale pebbles visible below, stylised hand-painted.",
  'blossom': "Dense canopy of PINK CHERRY BLOSSOMS seen close up, countless small five-petal sakura flowers in soft pink, rose and white with a few tiny green leaves and dark twig hints, sunlit, filling the whole square.",
  'jinra_crystal': "Close-up of a luminous magical BLUE power crystal surface: sharp faceted planes in deep sapphire, electric cyan and pale ice-white, glowing from within, fine light veins and inner sparkles, mystical energy.",
  'wood': "Weathered warm brown carved WOOD planks running vertically with soft grain, slightly worn, with faint red lacquer remains in the grain, temple timber.",
}
SINGLES = {
  'hammock': ("Flat front orthographic view of a woven fabric that fills the ENTIRE image edge to edge (no background): deep red cloth with cream-white woven stripes "
              "running along its length and a cream geometric diamond-and-key pattern border band, visible weave, hand-painted fantasy game style, even lighting, no folds, no text.", "1536x1024"),
  'awning': ("Flat front orthographic view of a woven fabric filling the ENTIRE image edge to edge (no background): soft dusty-pink and cream cloth with wide pale stripes and a scalloped "
             "dark-red trim band along the bottom edge, visible weave, hand-painted fantasy game style, even lighting, no folds, no text.", "1536x1024"),
  'banner_red': ("Flat front orthographic view of a long hanging temple BANNER filling the ENTIRE image edge to edge (no background, no pole): deep crimson red woven cloth, "
                 "a cream-gold embroidered border, and a large cream-white embroidered diamond emblem with a small tree glyph at its centre in the upper middle. Even lighting, no folds, no text.", "1024x1536"),
  'banner_teal': ("Flat front orthographic view of a long hanging temple BANNER filling the ENTIRE image edge to edge (no background, no pole): deep teal-green woven cloth, "
                  "a gold embroidered border, and a large gold embroidered stylised diamond and leaf emblem in the middle. Even lighting, no folds, no text.", "1024x1536"),
}
PANO = {
  'sky': ("A seamless 360 degree EQUIRECTANGULAR panorama sky for a fantasy game, viewed from a floating island HIGH in the sky: the upper half a luminous mystical morning sky, "
          "deep azure at the top fading to soft gold and pale turquoise near the horizon, wisps of glowing cirrus, a warm radiant sun glow with soft god rays on one side, a few faint "
          "distant floating islands with tiny waterfalls on the horizon; the lower half a vast endless sea of big soft billowing white and peach cumulus clouds FAR BELOW, sunlit tops, "
          "blue-violet shadows, layered into the hazy distance. Ethereal, magical, Ghibli / Zelda palette, no ground, no mountains touching the ground, no text.", "1536x1024"),
}
ALPHA = {
  'cloud': ("A single big soft fluffy billowing white CUMULUS cloud, sunlit warm white top, soft blue-violet shadowed underside, painterly stylised fantasy game art, "
            "isolated on a fully transparent background, soft edges, no text.", "1536x1024", (768, 512)),
  'vine': ("A CURTAIN of six long hanging WEEPING WILLOW strands side by side filling the image width, each a trailing stem densely hung with small slender bright green leaves, a few glowing pale-mint tips, "
           "hanging straight down from the top edge, different lengths, dense at the top thinning toward the tips, stylised hand-painted fantasy game art, isolated on a fully transparent background, no shadow, no text.", "1024x1536", (512, 768)),
  'cloud_tower': ("A single huge towering CUMULONIMBUS cloud, tall billowing column of sunlit warm-white puffs with peach highlights, soft blue-violet shadows on its sides and base, "
                  "painterly stylised fantasy game art, isolated on a fully transparent background, soft edges, no text.", "1024x1536", (512, 768)),
  'cloud_bank': ("A long low flat BANK of soft cloud, a wide horizontal band of overlapping sunlit cream-white puffs with a flat blue-violet shadowed underside, "
                 "painterly stylised fantasy game art, isolated on a fully transparent background, soft edges, no text.", "1536x1024", (768, 512)),
  'cloud_wisp': ("Wispy streaky high CIRRUS-like cloud streamers, thin soft feathery white and pale peach strands drifting sideways, delicate and airy, "
                 "painterly stylised fantasy game art, isolated on a fully transparent background, no text.", "1536x1024", (768, 512)),
  'blossom_card': ("A round fluffy CLUMP of pink cherry blossoms (a sakura branch-end cluster seen from the side), many small pink and white five-petal flowers, irregular airy silhouette, "
                   "stylised hand-painted fantasy game art, isolated on a fully transparent background, no stem, no shadow, no text.", "1024x1024", (512, 512)),
  'jinra_swirl': ("A glowing magical energy VORTEX seen straight on from above: luminous electric-blue and cyan spiral arms swirling into a bright white-blue core, wispy streaks and sparkles, "
                  "on a fully transparent background, circular, centred, no text.", "1024x1024", (512, 512)),
  'jinra_flame': ("A single tall stylised magical BLUE FLAME, wispy licking tongues of cyan, sapphire and white fire rising from the bottom edge, painterly fantasy game VFX, "
                  "isolated on a fully transparent background, no text.", "1024x1536", (256, 512)),
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
    if n in PANO:     # 2:1 equirect; the side seam blended so it wraps
      p, sz = PANO[n]; im = gen(p, sz).convert('RGB').resize((2048, 1024), Image.LANCZOS)
      a = np.asarray(im).astype(np.float32); W = a.shape[1]; b = np.roll(a, W // 2, 1); dx = np.minimum(np.arange(W), W - 1 - np.arange(W))[None, :]
      m = 1 - np.clip(dx / 160, 0, 1); m = (m * m * (3 - 2 * m))[..., None]
      Image.fromarray((a * (1 - m) + b * m).clip(0, 255).astype(np.uint8)).save(f'textures/garden_{n}.webp', quality=88, method=6); print('wrote', n, flush=True); continue
    if n in ALPHA:
      p, sz, out = ALPHA[n]; im = req({"model": "gpt-image-1.5", "prompt": p, "size": sz, "n": 1, "background": "transparent", "output_format": "png"}).convert('RGBA').resize(out, Image.LANCZOS)
      im.save(f'textures/garden_{n}.webp', quality=88, method=6); print('wrote', n, flush=True); continue
    if n in SINGLES:
      p, sz = SINGLES[n]; im = gen(p, sz).convert('RGB'); im = im.resize((768, 512) if n in ('hammock', 'awning') else (512, 768))
      im.save(f'textures/garden_{n}.webp', quality=86, method=6); print('wrote', n, flush=True); continue
    im = gen(COMMON + ' ' + PROMPTS[n]); seamless(im).resize((1024, 1024)).save(f'textures/garden_{n}.webp', quality=86, method=6); print('wrote', n, flush=True)
  except BaseException as e: print('FAILED', n, e, flush=True)
