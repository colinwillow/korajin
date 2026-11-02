# CINEMA -- cutscenes in the game, not rendered (his question, Oct 29 2026)

> *"A cinematic intro for places -- when you enter an area (the ship, the arena, the Red Hollows) the camera does a subtle orbit over the landscape,
> says the name of the place, cuts, zooms to where you are. Should I render cinematic clips out in Blender and insert them, or do all of it in game
> -- cameras, cuts, close-ups, action cameras -- for dialogue, a new place, a prize, a chest, a boss beaten, a level transforming, the water starting
> to flow? Probably all in game. I don't really know."*

## The answer: IN GAME. Blender only for the rare thing the engine cannot draw.
- **The world changes and a video does not.** The Red Hollows fallen or restored, the water running or dry, which outfit and weapon he has, which
  enemies are still standing, the snow he just ploughed. A rendered clip shows one version and then cuts back to a different one. In game the
  cutscene IS the world.
- **A phone and two shapes.** He plays in portrait and landscape; a video is one aspect ratio, megabytes per clip, and a hitch to start. A camera
  path is a few numbers.
- **It is already started.** The statue wake (`statueCam`) is a cut-away: the lens leaves him, visits each statue as it cracks, comes back. Part
  aim's lens (`partCam`) leans back for a tall target. Both are the same thing a cutscene system does.
- **Blender for:** a one-off story painting or an opening title -- the "the sorceress turns the village to stone" prologue, maybe -- where the
  look is something the engine cannot do. Even those can be in-engine first and replaced later.

## The system: REELS (BUILT m2236 -- `REELS` in index.html, `SC_REELS`; the first one is the prologue intro)
A **reel** is a list of shots the lens plays while his control is held (a tap skips); one small player, every cutscene is data:
| shot | what the lens does |
|---|---|
| `orbit`  | circles a point at a radius and height, slowly (the landscape reveal) |
| `dolly`  | glides from one framing to another, eased |
| `cut`    | jumps (a hard cut between two framings) |
| `track`  | follows a moving thing (a falling chest lid, the dragon, the water front) |
| `close`  | a close-up on a face or a hand (dialogue, a prize) |
| `back`   | returns to the play camera, eased, and gives him back control |
Plus: letterbox bars, a TITLE CARD (the place's name in brush lettering, its subtitle), time-slow, sound cues.

## The first ones to build
1. **PLACE INTROS** (his first ask): the first time he enters the Arena, the Ship, the Red Hollows, the Snowfield -- an orbit over it with its
   name, two cuts on its landmarks, a dolly in to him, control back. ~8 s, skippable, once per place (remembered).
2. **The chest / prize**: a close-up as the lid opens, the item turns in the light, its name.
3. **A boss beaten**: slow-motion on the last blow, an orbit round the fall.
4. **A place transforms**: the Red Hollows' water starting to flow (`hwAgeLive` already animates it) -- track the water front down the canyon.
5. **Dialogue**: over-the-shoulder pairs and close-ups, cut on each line.

## THE HOUSE STYLE FOR EVERY REEL (Colin, Nov 2 2026 -- these are the rules)
1. **SHOTS ARE LINEAR MOVES, NOT RAMPS.** A shot is either a **TRUCK** (the camera slides in a straight line PERPENDICULAR to what it looks at --
   left to right past a temple) or a slow **DOLLY** along its own view axis, in or out. **Constant velocity**: no ease-in, no ease-out, no
   acceleration. (`move: 'truck' | 'dolly'`, `v` m/s; `eye` / `at` frame the shot at its MIDDLE.)
2. **NO ROTATION during a shot.** The lens's orientation is fixed for the whole shot: no orbit, no turning to follow.
3. **ALREADY MOVING AT THE CUT.** The motion starts before the shot is seen, so its first frame is mid-move (a linear move framed at its middle
   is this by construction).
4. **CROSSFADE between shots** (a dissolve, ~0.6-1 s; `xfade`), never a camera swing from one place to the next -- and the end is a crossfade
   into the play camera, not an ease back to it.
5. **FRAME THE SUBJECT CLEARLY**: whole, unoccluded, front-on or 3/4 (never edge-on or from the side), not so close it is unreadable. Render
   every shot at its middle and check what it shows before shipping. (His notes on take 2: some shots he could not tell what they showed --
   occluded, too zoomed in, or turned to show the side of the thing.)
