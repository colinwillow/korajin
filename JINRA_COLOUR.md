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

**Still literal (the shade tail -- to route with `JPAL.shift`)** -- teal/mint hexes by count, as of m2307, with the call on each:

| hex | n | what | call |
|---|---|---|---|
| 46e0ff | 21 | zap's `--sky` UI cyan, hover meter, map border, some FX | **LEAVE** (UI cyan, not Jinra) unless a site is Jinra |
| 39f0ff / 5ff2ff / 7ff0ff / 3fe8ff | ~36 | electric cyan: bolts, ice, shield, tech screens | per site: ice/shield LEAVE, Jinra beams ROUTE |
| 5ee8ff | 8 | (13713-13837) | per site |
| 60ffc0 / 6dffc0 / 5affe0 / 3ff0d8 / 2de0b0 / 30d0a0 / 9affd8 / b6ffd8 ... | ~60 | Jinra jade shades: streams, water, veins, crystals, motes | ROUTE |
| 3ad08a / 38c890 / 18b45f / 4dff9a | few | grass / leaf greens | LEAVE |
| `#b6ffd8` / `#39ff88` in the CSS | 6 | debug-key "on" state | LEAVE (debug UI) |

**Never Jinra (leave):** grass, leaves, moss, the aurora's emerald, ice, water that is just water, the zap-inherited `--sky` UI cyan, debug UI.
