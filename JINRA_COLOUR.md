# JINRA COLOUR -- one palette for the Jinra glow (Colin, Nov 3 2026)

> *"Find where the colour of the JINRA is, and standardise it so we can swap it and try different looks... I'm picturing a purple-blue jade.
> I like the greenish-blue too... if one variable changes everything glowing that way, we can easily change fire particles, glowing veins, etc."*

## The table
`index.html`, the head script `<script id="jinpal">`, between `SC_JINRA:START` / `:END`: `window.JINRA_PRESETS`.

| preset | core (hot centre) | glow (main) | deep (rim / shadow) | spark (highlight) | ui (HUD / text) |
|---|---|---|---|---|---|
| MINT (today, default) | e6fff8 | 7affd8 | 1f8a74 | b6ffe8 | 7affd8 |
| VIOLET (VIOLET-BLUE) | e2c8ff | 7a7cff | 3324a8 | b8d8ff | a6a8ff |
| JADE (JADE-TEAL) | dcfffa | 3fe6d2 | 0e7480 | a8fff6 | 5ff2e2 |

Add a preset = one row in `JINRA_PRESETS` + its key in `JINRA_ORDER`. Nothing else.

## How code reads it
- **JS (module):** `JPAL` (= `window.JPAL`; the module's own `JINRA` is the collected-wisp counter, a different thing).
  `JPAL.glow` / `.core` / `.deep` / `.spark` / `.ui` are hex numbers; `JPAL.glowRgb` etc. are `[r, g, b]` 0..1; `JPAL.glowCss` etc. are `'#rrggbb'`.
  `JIN.hex`, `JIN.col` and `JINHEX` are now `JPAL.glow` / `JPAL.glowRgb`, so every old token user follows the pick.
- **A hand-picked mint SHADE** (a dark jade water, a pale mote): wrap it, don't retype it -- `JPAL.shift(0x2de0b0)`, `JPAL.rgb([.3, .9, .7])`,
  `JPAL.rgba(0x7affd8, .8)`, `JPAL.css(0x...)`. Under MINT these return the literal unchanged (today's look byte for byte); under another
  preset the hue rides deep -> glow -> core by the shade's LIGHTNESS, keeping half its own hue offset from mint.
- **CSS:** `--jin-core` `--jin-glow` `--jin-deep` `--jin-spark` `--jin-ui` and `--jin-<role>-rgb` (`rgba(var(--jin-glow-rgb), .5)`), set on
  `:root` by the head script before first paint. `--rk-jade` is `var(--jin-glow)`.
- **Tools that run the module headless** (`boot`, `placecheck`, `sim`) prepend the `jinpal` script, as the page runs it first.

## The switch
TOOLS > LOOK > `JINRA COLOUR: <name> (reloads)` cycles MINT -> VIOLET-BLUE -> JADE-TEAL, saved as `mel.jin`. `?jin=mint|violet|jade` also sets
(and saves) it. Takes effect on reload.

## The audit (m2307 routed the EXACT mint; the shade tail is being routed system by system)
**Routed in m2307** (every exact `0x7affd8`, `'#7affd8'`, `[.48, 1, .85]`, `rgba(122,255,216,..)`, CSS `#7affd8`): 69 JS sites + the CSS --
the shrine plates (`emissive` on every pressure plate), the dojo's mane/eyes/rings/hoops/orbs, the snow kit's `glow`, the garden plant
motes (`plantPart` jin share), the sword shed/bless sparks, arena beams, the checkpoint lamps, the bolt/rune lock colours, the stolen-Jin
cone and glint, the chalice liquid + `glowSprite`, the Jin glint texture's gradient, crystals, monitors, lamps, the menu's TAP TO ENTER and
selected-entry border, the right-pad mount pulse, the rings' `.seg.jin` (fill now `--jin-deep`, text `--jin-core`).

**Routed in m2308 (the shade tail, ~160 more sites, via `JPAL.shift` / `JPAL.rgb` / `JPAL.v3`):**
- **hex shades:** the snow village (`vilMats` band glyphs, jade paint, jade glass; the lamp/hut light pools `SVKP`/`svkHalo`/`svkShrines`/
  `svkPoolRim`/`svkShrine`), the forge's crystals, the waterfall shrine's crystal (`wfrsBuild`), the GARDEN (`willowMats` temple jade, the
  glowing film, the pool, the circuit glyphs, `willowLeafPads`, `gdnMats` emissives and `jinLeaves`, `gdnHeart` core), the hall's `jin`, the
  watchtower, pagoda (cores, the Jin chain), shrine (plate, crystal, veil), the rope course (`jin`, ofuda, knots), `TTEX.jade`, `TEMPLE_SKINS`,
  the temple seal, the ice door, the ships' eyes / whale / serpent glow, the guardian pagoda, the wings' eye and glow, the level builder's
  crystal / brazier / glow, the restore rigs, the Jinra vessels, the refinery swirl / lamps / beads, the cave crystals and lamp, the floating
  island's Jin column, the colossus core and veins, the title loop's `LOOPBG.jinra` pair.
- **rgb arrays (sparks, motes, beams):** village rise motes, `WFALL.glowA`, `RSHRINE.jade`/`rune`, `bldJinraMotes`, dragon orb + taming,
  `gdnGlow` (all garden glow points), debris jinra, `gfireStep`'s TURQUOISE fire and `TURQ`, `killBlast`, statue wake, the spider / guard cuts,
  bow + arrow blast, `BARC.col`, the braziers (watchtower, ghouse, ramp, keep, barracks), arena beams, fisl, teahouse, opag, temple,
  court, `arrowIgnite`, sign break, the peak's age, the restore syncs, `hwFallMat` (THE GARDEN / HOME FALLS: deep + light), lifts, refinery
  mist, caves, the Jinra shop.
- **shaders** (`JPAL.v3([...])` spliced into the GLSL string): the forge's crystal flow, the willow's emissive, the dojo's tear, the garden
  `veinGlow` and stream, `gdnBeamFx` beam + points, `templeBeamMat`, the refinery swirl, the title loop recolour.

**Routed in m2309 (canvas textures, `JPAL.css` / `JPAL.rgba`):** `vilTex`, the garden glyph strip, `dojoGlintTex`, `_rbC` (ofuda), `shipSerpentTex`,
`lbTechTex`, `lbSignMat`, `gjinraTex` (refinery banners), `LOOPBG.mint`. Leaf textures (`willowLeafTex`, `willowLeafPadTex`) stay green.

**LEFT ALONE, ON PURPOSE (not Jinra):**
| what | where |
|---|---|
| zap's `--sky` UI cyan `46e0ff`, hover meter, map border, debug keys `#b6ffd8`/`#39ff88` | CSS, HUD |
| ice / frost / shield `1a6a80` `d6f2ff` `cfeeff`, ice beam | `shieldBuild`, `iceFreeze`, `snowCliffs`, `snowKitIce`, `cellRoomStage` |
| plain water `3f9cc4`, hot spring water, sea `ISLE`, bath/court/opag water, mill falls | village, baths, `gmillBuild` |
| the aurora's emerald `1ef06a` | `NIGHTSKY` |
| grass / leaves / moss / awnings `3ad08a` `5ad1a0` `38c890` | `chunkBuild`, `txMats`, `TDPROPS`, `kgMats` |
| tech neon cyan (courses, zoom rings, turrets, drones, robots' eyes, ramps) `39f0ff` `3fe8ff` `5ff2ff` eyes | course/zoom/turret/zramp/swrk |
| the green fire palette and OSARI neon green (a different fire), DNA gun greens, the jackal's beam | `gfireStep` (non-tq), `OSARI`, `DNABALL`, `stepBolts` |
| UI colour coding (level builder roles, gym boxes, layout beats, mantle/hurdle arrows) | `LB`, `GYM`, `TLAY`, arrows |
| inherited Zap/Weirdport/hoth/alien world | `WP`, `hoth*`, `wf*`, `ROSTER` |

If one of these turns out to be Jinra on the phone, wrap it: `JPAL.shift(0x..)` / `JPAL.rgb([..])`.
