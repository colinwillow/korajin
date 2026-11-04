#!/usr/bin/env python3
# FOREST_TEMPLE.md (rock-cut pass): a NORMAL MAP for each carved map, from its own picture -- luminance as height (the carving's hollows read darker),
# a broad blur for the deep relief plus a fine one for the tool marks, Sobel slopes -> tangent-space RGB, wrapped at the edges so a tiling map stays
# seamless. Writes textures/ft_<name>_n.webp.   python3 tools/ftnormals.py [name ...] [--k=strength]
import sys, numpy as np
from PIL import Image, ImageFilter
names = [a for a in sys.argv[1:] if not a.startswith('--')] or ['rock', 'rockfloor', 'frieze', 'pillarband', 'guardian', 'door']
K = float(next((a.split('=')[1] for a in sys.argv if a.startswith('--k=')), 3.0))
for n in names:
  im = Image.open(f'textures/ft_{n}.webp').convert('L'); W, H = im.size
  big = np.asarray(im.filter(ImageFilter.GaussianBlur(W / 160))).astype(np.float32) / 255; fine = np.asarray(im.filter(ImageFilter.GaussianBlur(1))).astype(np.float32) / 255
  h = big * .75 + fine * .25
  dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * K * W / 512; dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * K * H / 512
  nz = 1 / np.sqrt(dx * dx + dy * dy + 1); nx = -dx * nz; ny = dy * nz     # +Y up in the image = +V (three.js flips Y on upload; GL convention)
  rgb = np.stack([nx, ny, nz], -1) * .5 + .5
  Image.fromarray((rgb * 255).clip(0, 255).astype(np.uint8)).save(f'textures/ft_{n}_n.webp', quality=90, method=6); print('wrote', n)
