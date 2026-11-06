# COLL -- collision on the drawn triangles (the rules)

Colin, Nov 2-5 2026: *"whenever we make complex geometry, especially organic, the colliders are horrendous"*; *"the box collider seems very
primitive -- why isn't the mesh one on every level?"*; *"I want it to just work for every level I design."*
This page is what new geometry has to be so that it collides right **with no extra work**. Code: `COLL` in `index.html` (`// COLL:START`).

## What collides

- **Every arena/forge zone collides on its DRAWN triangles by default** (the MESH collider). A zone gets it through a row in `COLL.zones`:
  `ftemple` (forest temple interior), `garden`, `dometemple` (forest temple + its region), `desert`, and `auto` -- every other zone: the drawn
  scene round him (120 m, +-90 m), built once the zone has SETTLED, rebuilt when more of it loads, and a mesh seen to MOVE is dropped for good.
- **The exception is snow (with the ice temple): BOXES by default** -- 555k triangles even without its 888k-triangle terrain (budget).
- TOOLS > COLLIDER switches BOXES / MESH (saved as `mel.coll`; it wins everywhere). A row with `force: 1` is MESH regardless.
- **Boxes still exist** and are judged one by one when the store is built (`collMark`): a box the mesh already DRAWS (3 of 5 top points on a drawn
  floor, or 2 of 4 sides on drawn faces) is replaced (`meshRep`) and skipped; a box with nothing drawn on it is kept (an invisible guard is a
  choice). A box that belongs to something that MOVES (`_y0` rides, `door`, `kit`, `chunk`, `part`, `dyn`) is never replaced.
- **Never mark a level's boxes `collKeep` to keep them over the drawing** -- that is what made the forest temple's stairs a block (m2548).

## What counts as solid (`collSolid`)

A mesh is solid when it is drawn, opaque and not one of: foliage, grass, ferns, ivy, vines, flowers, petals, cards, water, falls, hammocks,
cloth, ropes, banners, pennants, fx, beams, glow, smoke, mist, fog, dust, halos, auras, shadows, the sky (name / material / material-key test,
`COLL_NS`); transparent (opacity < .95), `depthWrite: false`, `BackSide`, additive, or a fog-less `MeshBasicMaterial`.
Skinned and instanced meshes are left out (characters; props that break or move keep their own boxes).
**Overrides on the mesh:** `userData.coll = 1` forces it in; `userData.noColl = 1` (or `noSurf`) keeps it out; `userData.dyn = 1` marks it as moving.
**Name a material for what it is** -- `flag` once meant flagstone paving and the filter took it for a banner (m2415): the terrace was not a floor.

## Ground, walls, ledges -- the numbers

| | rule |
|---|---|
| floor | a triangle with n.y >= `COLL.walk` .707 (45 deg). Steeper is a WALL. |
| step | his `MOVE.step` .357 m: any rise up to it is walked up with no stop |
| lip | up to `STEPUP.lip` .55 m is STEPPED UP onto while grounded (`stepUpTry`), when his capsule fits on top; taller is a jump |
| wall | his capsule (r .24, from a step + .08 over his feet to his head) is pushed out of every steeper triangle, **two-sided** (winding is not trusted: the willow trunks were wound inside out) |
| sub-step | grounded he moves at most `MOVE.subGround` .12 m between collisions and his feet follow the treads -- stairs run flat at 20 fps (m2600) |
| ledge | a near-vertical face (\|n.y\| < .35) under a FLAT top (n.y > .85) at his hands, headroom over it, and neither face nor top organic (`COLL.noLedgeRx`: rock, cliff, basalt, bark, trunk, lawn, soil, sand, pebble, clay, boulder, moss, root) -- or `userData.noLedge` |
| trapped | inside a closed solid (parity / enclosed) or wedged: out to the nearest free spot, else back to a safe point (`collGuard`) |

## Building geometry that collides right by default

1. **Stairs: risers of .30 m or less IN THE WORLD** (after the placement scale -- a piece built at 1 m risers placed at `s: 2` is 2 m walls,
   m2562). A collider-only ramp (`colOnly`) must touch the step NOSES, not run under the treads.
2. **Every walkable top is a real up-facing triangle** with nothing drawn within ~1.2 m over it that is not a ceiling you mean.
3. **A slope you should walk is under 45 degrees; a slope you should not is over it** -- nothing in between by accident.
4. **Lips:** under .357 is a step, .357-.55 is an eased step-up, over .55 is a jump. Pick on purpose (a basin rim at .46 is a step-up).
5. **Doors and gaps at least .9 m wide; ceilings at least 1.3 m** (he is 1.14 m and .24 m round).
6. **Walls can be one quad thick** (a 5 cm wall holds at a sprint and at 20 fps), but must be OPAQUE solid materials.
7. **Organic shapes (rock, bark, cliff, roots) need no tag for "no ledge"** if their material or mesh name says what they are; otherwise set
   `userData.noLedge`.
8. **Anything that moves** (a platform, a door leaf, a lid) is `userData.dyn = 1` with its own box -- or it is dropped from the store the first
   time it moves.
9. **Keep a single walkable mesh under ~150k triangles** and a zone under ~700k (`COLL.maxMesh`, `maxTris`): over that it is left out.

## Measuring (all headless, the shipped page, the real pads)

- `npm run collcourse [--fps=20] [--boxes]` -- the edge-case course: stairs, lips (.5 / .7), a seam, a 5 cm wall, slopes (30 / 50 deg), a V corner,
  ceilings (1.0 / 1.3), a doorway. Every row must PASS on MESH (11/11 at 30 and 20 fps, m2683).
- `npm run colaudit <zone> [--mesh|--boxes]` -- drawn vs collider: holes, ghost floors, mismatches, walk-through / invisible walls, bad ledges;
  a heat map and the meshes to blame.
- `npm run stepsweep <zone> [--boxes|--mesh] [--off]` -- every 5-55 cm rise round the spawn, walked; `SS_STAIR=x0,z0,x1,z1[,y]` runs one
  staircase and prints his speed per frame (`SS_FPS=30` / `20` -- a phone's frame rate is where stair snags live).
- `npm run walktest [--boxes]` -- the garden route: trunks, roots, the shrine stair, the basin rim; dropped inside each trunk.

## Containment -- he must never get OUTSIDE a level (m2733)

His (the forest temple): *"I got outside the level ... it'll kill the illusion."* His move set reaches far: double jump, wall runs, wall jumps (11.4 m
measured with one), whip zips (14 m, chained to 58 m). Every level needs its play bounds.

- **A `BOUNDS` row per zone** (`SC_BOUNDS` markers): `{ live: () => ..., parts: [{ id, box: [x0, x1, y0, y1, z0, z1], cap?: 1, secret?: 1 }] }` --
  boxes of where he MAY be, pushed onto `BOUNDS.rows` by the zone's builder. Data only; nothing in the system knows a level.
- **Soft response:** no ledge-grab within `BOUNDS.edge` .6 m of a part's top (the outer walls' tops are not ledges); no wall run that starts within
  `runClear` 2.5 m of it; a part with `cap: 1` is a ceiling over an open-topped room (he is clamped under it).
- **Hard response:** outside every part (by `margin` .4) for `outT` .25 s -> a fade, and back to the newest SAFE point -- a ring of grounded
  in-bounds positions (`BOUNDS.ring`). `BOUNDS.stat` counts returns / refused ledges / refused runs / caps.
- **Secrets:** a part with `secret: 1` is an Easter-egg space INSIDE the bounds by design (the far side of a false wall -- a mesh with
  `userData.noColl` -- or a hidden crawlway). Nothing refuses it.
- **Tunnelling:** a sub-step longer than ~.8 of his radius (a zip, a dash, a wall jump, a slow phone) is RAYED against the mesh walls at three heights
  first and stopped a radius short (`COLL.stat.swept`). Before m2733 a 40 m/s launch went clean through a 5 cm wall at 30 fps (`collcourse` `thinfast`).
- **Measure:** `npm run escape <zone>` -- the walkable floor flooded from his spawn, and every floor cell he can reach from it with his move set
  (`--h` 6 m up, `--d` 11.4 m across, nothing taller in the straight path). With a bounds row: any reachable cell outside it is BAD. Without one:
  a reachable unwalkable top more than 2.5 m over the walkable floor near it (a wall top, a roof) is BAD, and drops are only counted. Whip-zip
  anchors are not modelled yet.
