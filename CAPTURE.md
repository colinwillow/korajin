# CAPTURE -- dual capture, wide 16:9 AND tall 9:16 of the same play (his sandbox, Nov 6 2026)

> *"Record the wide 16:9 view and the tall 9:16 view of the same gameplay at the same time, each framed for its own shape -- no cropping."*
> He records on a computer, playing with his Xbox controller in desktop Chrome.

## How he uses it
1. Desktop Chrome, controller in. **F9** (or **View + Menu** together on the pad, or TOOLS > CAPTURE > START) starts it; a red REC badge
   (time, game fps, frames, drops, MB) sits top-centre and the TALL take previews bottom-right.
2. Play. The footage has no HUD (the HUD is DOM, not in the scene); his screen is the normal play view.
3. **F9 / View + Menu** again: two files download, `korajin_wide_<ts>.mp4` and `korajin_tall_<ts>.mp4`.
   TOOLS > CAPTURE SIZE switches 1080 <-> 4K (1920x1080 + 1080x1920, or 3840x2160 + 2160x3840) before a take.

## STAGE 1 -- live dual capture (BUILT, `CAPT` in index.html)
- Every frame, after the play render: WIDE (the play camera, at a 16:9 lens; on a portrait screen the landscape lens `CAM.landFov`) and TALL
  (its own camera off the same smart-cam state: `tall.dist` .8 of the boom, `tall.el` +.12 rad higher, `tall.fov` 64, the look point lifted
  `tall.lift` .42 x his height so he sits on the lower third with headroom, pulled in by `camFree` so it never ends behind a wall; in a reel /
  the entrance / a statue cut-away it takes the cinematic camera's pose with a taller lens) each render into a HalfFloat MSAA target, one blit
  tone-maps + sRGBs + flips into an 8-bit target (a render target gets neither from three), and `readRenderTargetPixelsAsync` reads it back
  without stalling. Read-backs are encoded strictly in order (`v.q`).
- Shadows are drawn once by the play render and REUSED by both takes (`shadowMap.autoUpdate` off for the two extra passes).
- Encoding: WebCodecs H.264 High (`avc1.64002A` 1080p60 / `avc1.640034` 4K60; VP9 if the browser has no H.264 encoder), `mbps` 24 / 60,
  a keyframe every 2 s, timestamps on the 60 fps grid of the wall clock (one frame per 1/60 s slot at most; a slow frame holds the last one, so
  playback is real-time). Muxed by vendored `vendor/mp4-muxer/mp4-muxer-5.2.2.mjs` (MIT, pinned) as FRAGMENTED MP4 (append-only, streamed
  into Blob parts, no single giant buffer).
- Audio: every WebAudio node that connects to the destination is remembered from load (`AudioNode.prototype.connect` watched) and tapped into
  a MediaStreamDestination -> MediaStreamTrackProcessor -> AudioEncoder (AAC 192k, else Opus) -> a track in BOTH files.
- Back-pressure: at most `inflight` 3 read-backs per take and an encoder queue under 6, else the frame is DROPPED for that take (counted in
  the badge). Measure on his machine: the badge's fps with capture on vs off.
- Headless check (`node tools/captest.mjs <outdir>`, SwiftShader, test world, a 640x360 take): both files decode with ffprobe (h264, 640x360 and
  360x640), the frames show the scene with tone mapping, the tall one framed for its shape. SwiftShader runs the game at ~1-2 fps, so it says
  nothing about speed.

## STAGE 2 -- the REPLAY route (NOT BUILT; the audit comes first, as asked)
Record the input stream per fixed tick on the phone (+ zone, seed, build) and re-render it offline at a fixed dt at any size. What breaks
determinism today, measured in index.html:
- **Variable dt.** `frameBody` steps everything on `dtRaw = min(.05, now - last)` and many systems keep their OWN clocks off
  `performance.now()` (238 calls, 67 of them as seconds -- e.g. the smart camera's `movedAt`, the gamepad poll, hitch timers). Replay needs ONE
  game clock advanced by the fixed dt, and every `performance.now()` read inside the sim routed to it.
- **Random.** `Math.random()` is called 2,013 times. `npm run play` already shows the fix works: a seeded mulberry32 installed BEFORE boot makes a
  run repeatable. Replay must install the same seed AND consume it in the same order -- anything that draws a random number per RENDERED frame
  (fx, particles) shifts every later draw, so fx would need their own stream.
- **Timers.** 144 `setTimeout`s (spawns, puts, delayed placements) run on wall time, not sim time.
- **Asset arrival.** zones and bodies finish loading asynchronously; a replay has to start from "loaded" (wait, then start the tick clock).
- **Input.** touch pads, the controller (`gpPoll`) and the desk keys all write `stick` / `keys` at event time; the recorder belongs at one
  point per tick (after `gpPoll`), and the replay writes the same fields there.
Verdict: doable, but it is a pass across the whole sim (one clock, timers on it, fx on their own random stream) before the render page. Plan it
as its own build series.

## Later -- free cinematic cameras for capture (orbit, dolly, locked shot): not built (Stage 1 first, as asked).

## DONE WHEN
- [x] One press (F9 / View+Menu / TOOLS) starts and stops; two MP4s download, wide 16:9 and tall 9:16, same take, same moment. (built; headless: both decode)
- [x] The tall is FRAMED for tall (own camera: closer, higher, taller lens, hero low with headroom), not a crop of the wide. (built; headless frame looked at)
- [x] No HUD in the footage. (by construction: the HUD is DOM)
- [x] The game's sound is in both files. (built; not proven headless -- no audio context without a gesture there)
- [ ] 1080 capture holds his desktop's frame rate acceptably (badge fps on vs off -- HIS numbers, a real GPU; SwiftShader cannot say).
- [ ] 4K works on his machine (encoder support + speed).
- [ ] The files open and edit in his editor (fragmented MP4).
- [ ] Stage 2: the replay route (after the determinism pass above).
- [ ] **His sign-off on a real take.**
