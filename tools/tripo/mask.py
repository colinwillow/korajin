import numpy as np, sys
from PIL import Image, ImageFilter
S=sys.argv[1]
im=np.asarray(Image.open(S+'/atlas4k.png').convert('RGB').resize((2048,2048),Image.LANCZOS)).astype(np.float32)/255
r,g,b=im[...,0],im[...,1],im[...,2]; mx=im.max(-1); mn=im.min(-1); sat=(mx-mn)/np.maximum(mx,1e-3)
h=np.zeros_like(mx); d=np.maximum(mx-mn,1e-6)
h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
gold=((h>24)&(h<58)&(sat>.3)&(mx>.45)).astype(np.float32)          # brass / gold / bronze trim, rivets, gear emblems
cyan=((h>165)&(h<215)&(sat>.35)&(mx>.45)).astype(np.float32)         # the gem / blue bits
hot=((h<24)|(h>345))&(sat>.55)&(mx>.5)                                 # the brightest red-orange: the runes, the painted lines
# runes sit on GREY steel: keep 'hot' only where the neighbourhood is mostly low-saturation
grey=Image.fromarray(((sat<.25)*255).astype(np.uint8)).filter(ImageFilter.BoxBlur(10))
grey=np.asarray(grey).astype(np.float32)/255
rune=(hot&(grey>.3)).astype(np.float32)
cream=((h>18)&(h<50)&(sat>.22)&(sat<.6)&(mx>.66)).astype(np.float32)   # the light carved / painted lines (the sheath's chevrons, the emblems)
edge=((sat<.16)&(mx>.70)).astype(np.float32)   # the bright steel rims (the blade's edge, spike tips)
m=np.clip(gold*.9+cyan+rune+cream*.8+edge*.7,0,1)
mi=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
mi=mi.point(lambda v: min(255,int(v*1.4)))
print('cover gold %.3f cyan %.3f rune %.4f all %.3f'%(gold.mean(),cyan.mean(),rune.mean(),(np.asarray(mi)>40).mean()))
mi.save(S+'/glowmask.png')
vis=(im*0.35*255).astype(np.uint8); v=np.asarray(mi)[...,None]/255.; vis=(vis*(1-v)+np.array([120,255,220])*v).astype(np.uint8)
Image.fromarray(vis).resize((1024,1024)).save(S+'/r/maskvis.png')
