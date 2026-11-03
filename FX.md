# FX -- the goop (a sandbox under the WHOLE-PIECE RULE)

**His ask (Nov 3 2026):** *"Right now the sword has flames of two kinds, but I want the particles to be less like flames: a mix of oily, BLOBBY,
ELECTRIC GOOP that is also somewhat FLUID and flame-like. I want to really perfect it, because when he punches, slams, spins, spirals,
teleports, kicks, handsprings, swings the sword or shoots arrows, it should be the same amazing, refined particle stuff."*

Where it lives: **KORAJIN > The FX Lab** (`?w=forge&zone=fxlab`, `FXLAB`), and one shared library, `fxLibMake` / `FXPAL`, between the
`FXLIB:START` / `FXLIB:END` markers in `index.html`. `npm run fxstrip [move ...] [--slow=.25] [--pal=PURPLE]` renders frame strips off that
shipped text (headless, a stand-in capsule his height).

## THE LOOK (in words)
- **Oily**: a dark, almost black rim on every blob and ribbon edge, with an **iridescent band** sliding round it (three sheen colours per
  palette, like petrol on water) and a hard **wet highlight** up and to the left.
- **Blobby**: soft round shapes whose outline **wobbles** slowly (2nd/3rd/5th harmonics), **stretch** along their velocity, **merge** when they
  overlap (additive hearts add up, oily bodies read as one mass), and **drip and split** as they die (two smaller children, falling drops).
- **Electric**: a **hot white-mint core** that flickers, short jittered **arcs** re-rolled 30 times a second that crackle out of impacts and
  **crawl between nearby blobs on their own**, tiny bright **sparks** that streak along their own motion.
- **Fluid / flame-like**: trails are **ribbons of flowing noise**: the head is solid and bright, the tail **tears into holes** and **sheds
  real blobs** that fall away. Nothing is a straight line or a clean edge (CRAFT.md).
- **One language**: every move is built from the SAME five blocks with the same shaders and the same palette, so a punch, a slash and an
  arrow obviously belong together.

## THE BUILDING BLOCKS (one library, pooled; 8 draw calls in all however much is on screen)
| block | draws | what |
|---|---|---|
| GOOP BLOBS | 2 | instanced quads; body (normal blend: oily rim, sheen band, highlight) + core (additive: hot heart, flicker, per-sprite fake glow). Stretch, wobble, split, drip, ground bounce |
| FLUID RIBBONS | 2 | camera-facing strips (fist, foot, arrow) or SHEETS (blade: inner edge to tip); same body/core split; scrolling noise, the tail tears, the tail sheds blobs |
| ELECTRIC ARCS | 1 | jittered camera-facing strips, re-rolled at 30 Hz, flickering; spawned by moves and crawling between live blobs |
| SPARKS + MOTES | 1 | additive streaks stretched along screen velocity; motes are slow sparks that twinkle |
| RINGS | 2 | shockwaves on the ground or facing the camera, wobbled, torn by noise, with goop splashing out |

**No post-processing chain** (there is none in this game and it costs fill on a phone): every glow is faked inside its own sprite.
**Palette**: every colour is in `FXPAL`; its first row, `JINRA`, is BUILT from THE JINRA PALETTE (`JPAL`, JINRA_COLOUR.md) so one Jinra pick drives the goop too, and the lab defaults to it. The FX-only rows -- `MINT` (Jinra today), `PURPLE` (Jinra may become purple), `SOLAR` (a third option). Switching re-tints
everything already in the air.

## PHONE BUDGET
- **8 draw calls** for the whole library, constant.
- Pools: 420 blobs, 220 sparks, 24 rings, 2400 ribbon verts, 900 arc verts. A full move peaks ~150 blobs.
- CPU sim + upload: measured on the strip (SwiftShader, so the CPU number is the honest one): **~2.4 ms worst frame with every move firing**.
- Fill is the real cost: blob quads are 1.25x (body) / 1.9x (core) their radius. If a phone drops frames, the first dial is the core quad size.

## THE MOVES IT DRESSES
slash (sword) · punch · kick · slam (and landings) · spin / spiral · teleport · handspring · arrow (trail + hit). In the lab each is a scripted
stand-in path (a blade arc, a fist line, a foot arc, a helix, a projectile) -- the real moves are wired only after the look is signed.

## DONE WHEN
- [x] FX.md written (m2308).
- [x] The lab exists with its ENTRY row (portal, hero drop, goop slam), buttons for every move, HIM / DUMMY, SLOW, PALETTE, LOOP (m2308).
- [x] All five blocks built, pooled, 8 draw calls (m2308: strips in NOTES).
- [ ] Every move iterated in strips (normal and slow) until they read as ONE language -- several passes, each in NOTES with the strip.
- [ ] Measured on HIS phone: the lab's stat line (FX ms, DC) with LOOP on, no visible frame drop.
- [ ] His pick of palette (MINT / PURPLE / SOLAR) -- or "keep all three".
- [ ] **His sign-off on the look, on his phone.**
- [ ] THEN, one at a time and asking first: replace the sword's two flame effects; then punch, kick, slam/landing, spin, teleport, handspring,
      arrows -- each its own build.

## OPEN
- The lab's moves are stand-in paths; the entrance's slow-mo is not built (the game has no global time scale -- the FX clock alone slows).
- `S.gy` (the ground under a blob) is flat 0 in the lab; in a real zone it wants a cheap ground lookup, not `groundAt` per blob per frame.
