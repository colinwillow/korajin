# THE GATHERING -- charging the crystal after a temple boss (a sandbox under the WHOLE-PIECE RULE)

**His idea (Nov 4 2026, WORLD_PLAN.md section 8, "not 100% sold", revised the same day):** after a temple's boss, the arena is ringed by big
torches burning with that temple's Jinra. In the centre he holds up a nearly clear crystal, the Jinra is DRAWN out of every torch in streams into
it, the crystal fills with the temple's colour and glows, and the torches drop to ordinary warm fire. **The world answers -- but NOT with the time
of day or the weather** (the day / dusk / night cycle stays; it may itself be lore: the world's instability). The signifier is **FALLEN ->
REJUVENATED**: past the open arena the land goes from dusty, eerie red, withered, murky and dark to green, coloured, clear and softly glowing, as a
WAVE that spreads out from the crystal. **MOMENT 2:** setting the charged crystal back into its SKY-TEMPLE socket restores a FALLEN CITY piece --
ruined buildings lift, reassemble and float (the RESTORATION KIT), and the Jinra beam re-lights between temples.

Where it lives: **KORAJIN > The Gathering** (`?w=forge&zone=gathering`, `GATHER` in `index.html`, between `SC_GATHER:START` / `:END`).

## THE PLACE (verticality: four tiers)
| tier | y | what |
|---|---|---|
| below | 0 | THE VALLEY: the region the Gathering heals -- a ring of land round the mesa: trees, grass, shrubs, a winding stream, rocks, stone lanterns; and on its far side the FALLEN CITY piece (four ruined buildings) |
| level | 12 | THE ARENA: a hexagonal sandstone floor (r 14) on top of a sheer mesa, open to the sky; six tall torch pillars at the hex corners; a low parapet with six gaps so you see out and down; the PEDESTAL in the centre (three .3 m steps) with the crystal resting on it |
| above | 15 | THE SOCKET DAIS: a raised stone terrace on the arena's north rim, up eight .3 m risers, with the sky-temple SOCKET (a ring of carved stone round an empty cradle) |
| high above | 70 | THE SKY TEMPLE: a floating temple silhouette far off over the valley, where the Jinra beam lands |

## THE BEATS (MOMENT 1 -- THE GATHERING; seconds from the tap)
| t | beat |
|---|---|
| 0.0 | Tap the chevron at the pedestal (`LIFT THE CRYSTAL`). His control is held; he turns to the pedestal. |
| 0.0 - 1.0 | The crystal rises off the pedestal into his hands; the **GET pose** eases in: ONE arm straight up holding the crystal, the other down at his side, chin up (his: like Mario holding up a star). |
| 1.0 | A soft ring pulses off the crystal; a chime. |
| 1.3 - 6.8 | **THE DRAIN.** One torch after another (staggered round the ring) gives up its Jinra: goop streams arc out of each flame, up and over, into the crystal; the flame's Jinra colour drains to ordinary warm orange and it shrinks a little. The crystal **fills from the bottom** with the temple's colour as the streams land. |
| 7.05 | **FULL** (= drain0 + 5 x stagger + drainEach + travel; the beats after it are offsets from it, `gathBeats`). The crystal flashes, a shockwave ring rolls across the floor, a low boom, a small camera shake. |
| 7.55 - 15 | **THE WAVE** (out to 175 m in 7.5 s). A front of Jinra light runs out from the crystal across the valley: behind it the dust lifts, the red haze clears, the grass and the trees grow back and green, the water turns from murky brown to clear, the lanterns light. |
| 8.4 - 9.4 | He lowers his arms; the charged crystal floats up off his hands and hangs over his shoulder (it follows him). Control is back. |

## THE BEATS (MOMENT 2 -- THE SKY TEMPLE; seconds from the tap at the socket)
| t | beat |
|---|---|
| 0.0 | Tap the socket's chevron (`SET THE CRYSTAL`): the crystal flies from his shoulder into the cradle (0.8 s). |
| 0.8 | The socket's runes light in the temple's colour; a chime. |
| 1.2 | **THE BEAM**: a Jinra column fires out of the socket, arcs over the valley and lands on the sky temple, which lights. |
| 2.0 - 9.0 | **THE CITY RISES**: the four fallen buildings in the valley heave free, their pieces fly back into place (staggered arcs and a snap), the colour floods back, the jets light and they lift and float (`restoreRig` / `restorePlay`). |

## THE SWITCHES (top of the screen)
`GATHER` (do Moment 1 from anywhere: he is put at the pedestal) - `SKY TEMPLE` (Moment 2; it gathers first if the crystal is empty) - `RESET`
(everything back to the start: torches Jinra, crystal clear on its pedestal, the land fallen, the city fallen) - `TEMPLE: <colour>` (cycles the
`JINRA_PRESETS` rows: torches, streams, crystal and wave all follow; a temple's colour is a row there, never a table here).

## HOW IT IS BUILT (reuse, not rebuild)
- **The streams** are the FX library (FX.md): `FX.trail` ribbons whose heads fly a curved path torch -> crystal, shedding real goop blobs, with
  `FX.blob` splashes into the crystal and `FX.ring` on the full flash. `FX.pal` is set to the temple's row.
- **The torch fire** is a small pool of its own on the green fire's flame atlas (`gfireTex`), one draw: each tongue is coloured at birth by its
  torch's Jinra amount (temple colour -> warm orange).
- **The GET pose** is a reusable moment: `getPose(dt)` (two-bone IK through `ltArm`, after the mixer like the lotus), `GETPOSE.want` 0/1, and
  `GETPOSE.at` reads back where the hands meet (the held thing sits there). Any prize can use it.
- **The wave** is one uniform pair (`uGC` centre, `uGR` front radius) spliced into every region material's shader: outside the front the colour
  drains to dust-red (the AGE recipe), inside it is its own colour; a thin Jinra band glows at the front. Plants grow by instance scale on the CPU.
- **The city** is `restoreRig` / `restorePiece` / `restoreSet` / `restorePlay` (the RESTORATION KIT) -- the same kit as SPAWN > BUILDINGS >
  Restoration Demo and the Red Hollows' live turn.
- **The interact chevrons** are `interactAdd` rows (`gath.lift`, `gath.socket`).
- **No change** to `NIGHT`, the cycle or the weather.

## DONE WHEN
- [x] GATHERING.md written: the vision, the place, the beats with timings, this list.
- [x] Pass 1 (m2443): the arena, the six torches burning Jinra, the pedestal and the crystal, the GET pose, the drain streams, the crystal filling, the torches going warm -- strip in NOTES m2443.
- [x] Pass 2 (m2448): the valley FALLEN by default and the REJUVENATED wave spreading from the crystal (haze, grass, trees, water, lanterns) -- strip in NOTES m2448.
- [x] Pass 3 (m2449): Moment 2 -- the socket, the beam to the sky temple, the fallen city rising and floating -- strip in NOTES m2449.
- [x] Pass 4 (m2450): sound -- a swelling pad, a harp on full, bell chimes, a wave and a rise cue; CC0, `audio/gathering/CREDITS.txt`; lazy-loaded (NOTES m2450). His ear picks.
- [x] RESET replays it all (m2450: torches, crystal, wave, city via `restoreSet(R, 0)`, comets ended, FX cleared, voices hushed -- measured 0 live voices after a reset mid-drain; `Z.rang` replay bug fixed).
- [ ] Phone-fast: reported on the strips (67-144 DC, 17-65k tris, the wide shot included); the drain adds no draws (the FX library is a constant 8, the flames one Points). Wants HIS phone's frame rate.
- [x] Normal play camera throughout -- the moments never touch `cam` except to face him to the lens / out from the dais (m2443, m2449).
- [ ] **His sign-off, on his phone.**

## OPEN
- One crystal, one temple colour at a time; a real temple would carry its own row (yellow / purple / green / red / blue in WORLD_PLAN section 7).
- He does not walk to the pedestal (the tap is in reach); the door ritual's walk-up can be shared later.
- The Gathering in a real temple wants the boss's arena; this is its white-box twin.
