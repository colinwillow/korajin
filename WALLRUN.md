# WALL RUN -- rebuild plan (Oct 29 2026)

His words: *"It feels like we're trying to solve too many problems at once and none of them feel smooth. I want damping... hit the
wall and have very good control. I don't want to just launch launch launch... I'm picturing doing this with just a circle on a wall."*

## What the good ones do (research)
- **Prince of Persia (Sands of Time):** a wall run is a fixed, READABLE arc -- the same distance every time, symmetrical, so the
  player learns the shape and plans with it. Control is "commit, then ride it", not continuous thrust.
- **Titanfall / Titanfall 2:** contact keeps your speed; a short GRIP phase (~.5 s) with no gravity, then gravity ramps back in over
  ~1 s, so you sink in a curve rather than drop. Speed is capped, and the run is time-capped (~1.75 s). Jumping off is the release.
- Common thread: **the wall soaks energy (damping) and the curve is smooth**; nothing adds a second kick while you are on it.

Sources: mana-character.carrd.co (PoP movement notes), giantbomb.com "Wall Run" concept page, the UCSD cse125 Titanfall-style
constants write-up, EA's Titanfall 2 tech-test patch notes, Unreal Engine forum wall-run thread.

## Steps (one thing at a time; the ball first, animation last)
- [x] **1. Bugs + damping + the lab (m1833).** Stick read in SCREEN terms on the wall (the wall cam turned the camera, so "up"
  became "along" -- that was the straight-up-goes-sideways). Auto-sprint's ninja pose only on the ground (the in-air ninja pose).
  Grip `gripT` .35 s with no gravity, gravity ramps in over `rampT` .9 s, wall speed eased to `capV` 8, off the top clipped to a
  `topV` 3.5 hop. TOOLS > WALL PROXY: a ball and a trail stand in for him on the wall.
- [ ] 2. Smooth ENTRY: blend the contact velocity into the wall plane over ~.15 s instead of snapping it.
- [ ] 3. Tune the steering + exit with the ball, on his phone, until the curve feels right. Numbers on `mel.WRUN`.
- [ ] 4. Only then: the pose/animation, driven by the ball's measured velocity and angle.
