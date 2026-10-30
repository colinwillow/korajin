# LEVEL BUILDER -- build levels on the phone, in 3D, that become real places

His ask (Oct 30 2026): *"more than just top down -- this is 3-D, I've got to be able to navigate both perspective and orthographic and swap around
... build a tower with four ports, click the ports and choose what they are -- two balconies, one closed, one the end of a rope ladder; two
towers, port A to port B, a rope bridge ... the levels are going to be extremely vertical."*

Data-first (SCENE_COMPANION.md): a level is `{ id, world, pieces: [{ id, kind, at: [x, y, z], yaw: 0-3 (quarter turns), p: {...}, ports: {N,E,S,W} }] }`;
`lvlPiece(P)` is a pure function of one entry (its meshes and its colliders), so Scene Companion can read the same list.

## Steps
- [x] 1. The editor (m1880): TOOLS > LEVEL BUILDER. Frozen game; PERSP / ORTHO views + TOP / FRONT / SIDE snaps; one finger orbits, two pan +
      pinch. Palette TOWER / WALL / PLATFORM / BLOCK; a new piece is selected (the ghost) with a move handle (0.5 m snap), TURN 90, SIZE +/-,
      HEIGHT +/-, COPY, DELETE, OK. A tower's four PORTS (N E S W) cycle CLOSED / OPEN / BALCONY on a tap. PLAY = colliders in, game on.
      Saved on the phone as you go (per world + zone); SAVE FILE downloads the JSON (and COPY).
- [x] 2. LINKS between ports (m1881): LINK ROPE / PLANK / ZIP, tap port A, tap port B. ROPE = the gym tightrope (sways, at the decks' mean height); PLANK = a flat walkway (a turned box when diagonal) or, between decks of different heights, a RAMP of two walkable triangles; ZIP = high port to low, cable + posts. A closed port is opened. Tap a link line to change its kind or delete it.
- [x] 3a. FUNCTIONAL PIECES (m1882) -- his correction: *"a LEVEL builder, not a gym builder: every piece has a function -- a wall run, a tower with a high
      bar, monkey bars across, a tightrope, a sky bridge, a rope bridge, a back-and-forth chimney ... scaffold first, the buildings redesigned around
      the function later (swappable)."* RUN WALL (16 x 8), CHIMNEY (two facing walls, gap 3.2, capped), MONKEY BARS (posts + rungs, either axis);
      tower ports + BAR (a high bar on that edge) and LADDER (down that face, step-off onto the deck).
- [x] 3b. (m1884) SKY BRIDGE link (covered: floor, roof, walls with window gaps; a covered ramp between decks of different heights), ROPE BRIDGE link (a sagging walkable deck, slats, rope rails -- any number of them; it does not sway yet), SWING ROPE piece (gantry + the gym's swing), BOUNCE PAD piece (SIZE sets the launch speed).
- [x] 3c. (m1886) L-WALL: two legs + a curved quarter of ~15-deg turned segments; the wall run TURNS with the face from segment to segment (`wrunNext`, the hand-off finder) -- caught on one leg it carries round the bend and on along the other.
- [x] 3d. (m1887) QUARTER BOWL: walkable curve to 50 deg, then the BOWL THROW (`BOWL`: his speed sent up the tangent, boosted to clear the bowl -- the Sonic cheat) into the wall above, where the wall run catches him. A true surface-following run is the LOOP's job.
- [x] 3e. (m1889) THE LOOP: a ride on its track (`p.loop`) -- in at speed with the stick held, round it upside down, out the offset lane running; let go and he slows and falls off; a tap jumps off; the lens side-on.
- [~] 3f. LOOK pass 1 (m1886): stone masonry (tinted per piece, tiled per metre), red lacquer + cyan glow trims, Sonic chevrons on run surfaces. Still to come: Japanese roof forms, retro-futurist detail, alien accents; then a `look` per piece (scaffold now, his art later, no change to the function); breakable walls as a wall with `breakable: 1`.
- [ ] 4. Saved levels in `levels/` load as real places (his uploads become permanent).

## DONE WHEN
- [ ] he builds a two-tower level on the phone, plays it, saves the file, and it loads back as a place
- [ ] his sign-off on his phone
