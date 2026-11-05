import sys; sys.path.insert(0, sys.argv[-1])
from common import *
o=load(); img=[i for i in bpy.data.images if i.size[0]>0][0]
img.filepath_raw=sys.argv[-2]+'/atlas4k.png'; img.file_format='PNG'; img.save()
