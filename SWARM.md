# SWARM -- little critters by the dozen (his ask, Nov 6 2026)

> *"We should have little scuttling enemies that can go up on walls: tiny four-legged things, spiders or scorpion-type things (different per
> temple). You have to shoot them with the bow, and then they drop down on you. Things crawling all over the walls, coming down from the rafters,
> or in the sand temple burrowing up from under the sand. And flying enemies buzzing through the air. A LOT going at once, so even if it's mostly
> a swipe-swipe volume game, there's a lot of it and it's still rewarding: you feel like you're doing a lot even though it's simple."*

Under the WHOLE-PIECE RULE this is a sandbox first: **The Nest** (`?w=forge&zone=nest`, KORAJIN > The Nest), with its own ENTRY row.

## How it is built (index.html, `SC_SWARM`)
- **One draw call per KIND** (`swarmMesh`): an `InstancedMesh` pooled to `max`. Legs skitter (diagonal pairs) and wings beat in the VERTEX SHADER
  off a per-instance phase (`aX` = phase, stone, flash, moving). No skinned mesh, no mixer. A `file:` on the kind row is the hook for his model.
- **The shared surface-crawl solver** (`crawlSurfBuild` / `crawlRay` / `crawlMove`): a critter is a point on a triangle soup with a normal and a
  heading; each step probes AHEAD (a wall: climb onto it), DOWN its own normal (stay on, take the tilt), and back UNDER an edge (wrap round).
  The same rule walks floors, walls, ceilings, rafters and stairs. `crawlSurfFromColl()` hands it any zone's COLL triangles.
- **Hits are 3D contact (m2714):** `swarmSeg` (an arrow's frame, a blade's sweep -- the sweep CLEAVES; a blade reaches down to the floor's
  critters, never another level), `swarmArea` (slam, whirl, the blast arrow), `swarmShot` (bolts). Bites need his body within reach on his level.
- **One hit kills** with a pop: chitin + a splash of its glow + a flash, a crack, a tiny hitstop (`SWARM.stop`), sound rate-limited.
- **The stone twin (STATUES.md):** the same instance with the stone flag -- stone colour, no glow, legs still, wings folded; a blow only chips it.
  `swarmWake()` is the EVENT (staggered: dust, a mint flash, then they hunt).
- **Volume, not a blender:** `SWARM.biteGap` -- the whole swarm lands at most one bite per .45 s; at most 2 flyers dive at once.

## Kinds
1. **CRAWLER** -- four-legged skitterer on walls / ceiling / rafters; bursts and freezes; gathers about its home until he is near, then hunts
   (comes DOWN the wall at him). Over him on a wall or ceiling it lets go and DROPS onto him. An ARROW on one on a wall SHOOTS IT OFF
   (`SWARM.arrow` 'knock', his line; the panel switches it to KILL): it tumbles down, lands and comes at him on the floor.
2. **FLYER** -- boids (apart, alongside, together) orbiting him at 3-6 m, 2-4 m up, buzzing; one darts in, bites, peels away up and out.
3. **CEILING DROPPER** (pass 2) -- hangs on a thread in the rafters, drops in on a room event with a skitter-land.
4. **BURROWER** (pass 2) -- a moving mound first (the tell), then it erupts with a dirt / sand burst.

## The Nest
A closed stone chamber 26 x 30 m, 12 m to the ceiling: a north gallery 3.5 m up with a stair, a west nest-ledge 6.5 m up, three rafters at 8.6 m,
a pillar to the ceiling, blocks at 1.2 and 2.2 m. Eight stone crawlers on the walls / pillar / ceiling and four stone flyers hanging off the
rafters (`NEST.place`). Panel: CRAWLERS +10, FLYERS +10, SWARM 40, STATUES, WAKE, ARROW: SHOOT OFF / KILL, CLEAR; the readout counts them,
kills, shot off, the best cleave, bites, the swarm's ms and the frame's draws.

## DONE WHEN
- [x] Pass 1: crawlers walk walls, ceilings and rafters on the shared solver; flyers flock and dive; one-hit pops; a sweep cleaves; arrows shoot
      a wall crawler off and it comes at him; stone twins wake on WAKE. Two draws for the whole swarm. (m2755, shipped unverified)
- [ ] The wake is a cut-away (STATUES.md: the lens visits them), not just a button.
- [ ] Pass 2: CEILING DROPPERS (thread, drop on a room event) and BURROWERS (the mound tell, the burst) -- still <= 4 swarm draws.
- [ ] Pass 3: per-temple skins (forest: bark beetles / thorn spiders / moths; desert: scorpions / sand burrowers; lake: crabs; snow: ice mites),
      the forest set handed to the forest temple and placed in rooms on its COLL surface.
- [ ] 40 critters at a steady frame on his phone (the readout's ms and draws).
- [ ] **He played it on his phone and signed it off.**
