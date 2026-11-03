# NIGHT -- every scene has a second life after dark (Colin, Nov 3 2026)

> *"Tons of stars, like if you're out in the middle of nowhere -- hundreds of millions of stars, shooting stars, galaxy, Milky Way, maybe a big
> planet. Things come alive at night. Every scene, when it goes to night, things start to glow: Japanese-looking alien symbols on stuff that you
> don't see in the day -- on the wood of the boat, in the sand, on the rocks, in the crevices and cracks between rocks. Plants that are plain in
> the day have parts that glow at night... His sword will have ancient symbol writing on it that glows at night, maybe even the cloth on his arm.
> Lanterns glow at night. Think of Avatar."*

## Vision
Day is the readable, sunlit game. Night is a DIFFERENT AESTHETIC of the same place: a deep sky packed with stars, the Milky Way and a big ringed
planet; the world dimmed to cold moonlight; and everything that was plain by day showing a hidden layer of glow -- an invented alien script (not
real kanji) in the wood, the stone, the sand; light in the cracks between rocks; veins and tips on plants; lanterns lit; runes along his blade.
**Glow is invisible by day** (scaled by the night factor to exactly 0). Colours come only from the Jinra palette (`JPAL`, JINRA_COLOUR.md) plus
one optional second accent (purple) -- a switch for ONE or BOTH.

## The API (index.html)
- **`NIGHT`** (between `SC_NIGHT:START` / `:END`): `mode` (DAY / DUSK / NIGHT / CYCLE), `f` the night factor 0..1, `dusk` the warm
  in-between weight, `cycle` seconds per full day, the night palette (`pal`), the per-zone rows (`zones`).
  **ONE WRITER: `nightStep` writes `NIGHT.f`.** Everything else reads it.
- **The switch:** TOOLS > TIME (cycles DAY -> DUSK -> NIGHT -> CYCLE, saved as `mel.time`); `?night=1` / `?night=0`, `?time=day|dusk|night|cycle`.
  The snow's old `?time=night` and `mel.snowtime` still work (they ARE this now).
- **The overlay:** `nightPre()` / `nightPost()` wrap the frame's render: the global sun, hemi, fog, background and exposure are blended toward the
  night palette for the draw and handed back after it. So no zone code is fought (every zone keeps writing its own day lighting) and the blend is
  free to animate (CYCLE). A zone that builds its own night (the snow) says `own` in its row and the overlay stands aside.
- **The sky:** one dome round the camera (`nightSkyBuild`, the snow's m2298 sky: stars, Milky Way, ringed moon, aurora), faded in by `f`.
- **The glow layer (next):** `nightGlow(material, { mask, role, strength, pulse })` -- an emissive term x `NIGHT.f` spliced in `onBeforeCompile`;
  the rune atlas (`NIGHT.runes`), crack glow on rock, veins on plants, lanterns.

## Per-zone plan
| zone | night |
|---|---|
| snow (Snowfield) | already the seed (m2298): moves onto the shared sky + factor; runes in the rocks, the torches |
| garden (prologue) | glowing plant veins and tips, runes on the temple stone, lanterns -- AFTER messaging the garden worker |
| lake (water) | the Lake worker's zone: it gets the sky + `nightGlow` API by message; its code is not touched here |
| forge, arena, dojo, temple, others | the overlay + sky first, then a rune / crack pass each |
| hero | runes along the katana blade, on the arm cloth (masks on the existing materials; by day unchanged) |

## DONE WHEN
- [x] (m2317) one `NIGHT` factor every zone reads, one writer; TOOLS > TIME DAY / DUSK / NIGHT / CYCLE, saved, `?night=1`
- [ ] lighting / fog / sky blend with it in every zone (no zone goes black, none stays day)
- [x] (m2321) the shared night sky: dense layered stars that twinkle, the Milky Way, shooting stars, the big planet; the snow uses it
- [x] (m2323) `nightGlow` + the alien rune atlas; zero glow by day (checked in a DAY render: the snow sheet)
- [ ] crack glow on rocks, bioluminescent plant parts, lanterns that light at dusk; ONE / BOTH accent switch
- [ ] the sword's runes (m2324: the katana's blade carries one line of the script, close render checked) and the arm cloth (open: the hero is one material, it needs a mask from his texture) glow at night
- [ ] the snow pushed; the garden; then the other zones, each with a DAY / NIGHT contact sheet
- [ ] phone-fast: draw calls and tris reported per zone, the night adds a handful of draws at most
- [ ] **his sign-off, on his phone**
