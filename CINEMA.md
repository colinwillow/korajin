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

## The system (proposal): REELS
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
