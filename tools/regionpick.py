# REGION_METHOD stage 2: the PICKED seed with every place named (the existing snow pieces re-placed onto it). python3 tools/regionpick.py
import sys, json; sys.argv = ['x']
exec(open('tools/regionmap.py').read().split("if __name__")[0])
SEED = 6
PLACES = {     # node -> name (map_6.json); the route spawn -> temple is the thick line
    5: 'SPAWN', 15: 'WILLOW SHRINE', 14: 'VILLAGE (gate)', 2: 'HOT SPRING', 0: 'MAMMOTH MEADOW', 9: 'BIG WALL', 13: 'PINE FOREST',
    7: 'STANDING STONES', 3: 'CABIN', 8: 'ICE CAVES (underpass)', 10: "DRAGON'S GATE", 6: 'LAKE', 12: 'GREAT WATERFALL', 4: 'TEMPLE STAIR',
    11: 'LOOKOUT', 1: 'ICE TEMPLE' }
M = make(SEED); M['wp'] = {v: k for k, v in PLACES.items()}
im = render(M, 960); im.save('images/concepts/region/region_pick.png')
json.dump({'seed': SEED, 'places': {v: {'node': k, 'at': M['nodes'][k].round(1).tolist(), 'floor': round(float(M['floor'][k]), 1)} for k, v in PLACES.items()}},
          open('images/concepts/region/region_pick.json', 'w'), indent=1)
print('ok')
