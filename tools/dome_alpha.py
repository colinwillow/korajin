# The Forest Temple alpha foliage cards (m2144): gpt-image-1.5 with a transparent background -> textures/dome_ivy.webp, dome_clump.webp.  python3 tools/dome_alpha.py ivy
import json, sys, base64, urllib.request, io
from PIL import Image
P = {
 'ivy': ("A single long hanging strand of lush green IVY vine with many overlapping heart-shaped leaves in varied greens, hanging straight down from the top edge to near the bottom, "
         "dense at the top and thinning toward the tip, stylised hand-painted fantasy game art, isolated on a fully transparent background, no shadow, no text.", "1024x1536", (256, 768)),
 'clump': ("A dense round CLUMP of lush green leaves (a leafy bush crown seen from the side), many overlapping broad leaves in varied bright and deep greens, sunlit on top, "
           "with an irregular leafy silhouette edge, stylised hand-painted fantasy game art, isolated on a fully transparent background, no stem, no shadow, no text.", "1024x1024", (512, 512)),
}
n = sys.argv[1]; pr, sz, out = P[n]
req = urllib.request.Request('https://api.openai.com/v1/images/generations', data=json.dumps({"model": "gpt-image-1.5", "prompt": pr, "size": sz, "n": 1, "background": "transparent", "output_format": "png"}).encode(), headers={"Content-Type": "application/json", "Authorization": "Bearer sk-dummy"})
d = json.load(urllib.request.urlopen(req, timeout=400))['data'][0]
im = Image.open(io.BytesIO(base64.b64decode(d['b64_json']))).convert('RGBA').resize(out, Image.LANCZOS)
im.save(f'textures/dome_{n}.webp', quality=88, method=6, lossless=False); print('wrote', n, im.getextrema())
