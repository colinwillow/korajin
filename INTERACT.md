# THE INTERACTIONS KIT -- the icing on the cake (a sandbox under the WHOLE-PIECE RULE)

**His ask (Nov 5 2026, through the parent session):** the polished, reusable pieces every temple uses over and over -- chests, heavy doors, a wheel
crank, buttons, pressure plates, levers, drawers, pots, and rumble -- built and perfected in a sandbox first, then dropped into temples as ROWS.

Where it lives: **KORAJIN > Interactions (sandbox)** (`?w=forge&zone=interact`, `IKIT` in `index.html`, between `SC_IKIT:START` / `:END`).

## ONE SHAPE FOR EVERY PIECE (data-first, SCENE_COMPANION.md)
A piece is a ROW with a stable id: `{ id, kind, at: [x, y, z], face: deg | 'auto', from: [x, z] (the approach, for 'auto'), ...its own fields }`.
`ikitAdd(row, parent)` builds it (a pure function of the row), registers its interact chevron (`interactAdd`, the right stick glows) and its
colliders; the kind's sequence plays when it is tapped. State lives on the row (`open`, `u`, `done`). A temple places pieces by adding rows.

**Shared by every kind:**
- **The walk-up**: he walks to the piece's stand point on his own legs (the left stick is handed the steer, as the door ritual does), turns to it.
- **The lens** eases a little closer while a piece plays (the door ritual's `cam.doorK`, no wild moves), and back after.
- **The pose layer** (`ikitPose`, after the mixer like `getPose`): two-bone IK hands on any world targets (`ltArm`), a lean, the feet can tread in
  place (a push). Grumbo has no push / kick / lever clips: the poses are IK, and a clip slots in by name when one exists.
- **Rumble** (`ikRumble(k)`): a camera shake and a low thump, and on iPhone the iOS 18 switch-checkbox haptic tick behind TOOLS > HAPTICS (pass 5).
- **Facing**: `face: 'auto'` turns the piece toward its approach (`from`), so a chest is never found from behind.

## THE PIECES (one build each)
1. **CHEST** -- walk up, the chevron glows (OPEN), tap: the lens eases in, he gets his hands under the lid's front edge and heaves (the chest
   JOLTS: a shake, a thump, a rumble), the lid swings up past open and settles, warm light spills out of it, and the ITEM rises out turning. Then the
   GET moment: it flies to his hand, he holds it up (one arm, `GETPOSE`), the lens on his front, a chime -- and it goes to the backpack (a swoop to
   his back, a toast). Row: `{ kind: 'chest', item: { name, col }, coins }`.
2. **HEAVY DOOR** -- his hand on the stone, he PUSHES (leans in, feet treading and slipping, strain), a stone rumble, dust from the seams, the door
   grinds open by degrees; the lens eases in.
3. **WHEEL CRANK** -- a horizontal ship's-helm wheel on a post. Tap, the lens closes in, he takes the spokes; SPIN THE STICK in circles to turn it
   (his hands over the spokes by IK). The wheel winds a ROPE / chain that visibly coils on its drum and raises a GATE (or a door, or a bridge).
   Spin faster and it moves faster; let go and it slips back slowly.
4. **BUTTONS and PRESSURE PLATES** (a big push, a clunk, the plate sinks), **LEVERS** (pulled through a ratchet, click by click), **DRAWERS** (slide
   out, a find inside) and **POTS** (break, a find).
5. **RUMBLE** -- no Vibration API on iPhone Safari. The iOS 18 trick: a hidden `<input type="checkbox" switch>` toggled through its `<label>` makes
   Safari give a system haptic tick. TOOLS > HAPTICS (ON / OFF); always backed by the shake + thump. Whether it works on his phone is HIS answer.

## ONE HAPTICS LAYER (for the native app too)
Everything that wants a buzz calls **`haptic(kind)`** and nothing else: `tick`, `light`, `medium`, `heavy`, `thud`, `success`, `warning`, `error`.
Each kind is three halves: the camera SHAKE and the low THUMP (always -- `{ shake: false }` / `{ thud: false }` to skip one), and the TOUCH:
in the native app (Capacitor, `window.Capacitor.Plugins.Haptics`) the real Taptic Engine (`impact` / `notification` / `selection*`); in the
browser, Android `navigator.vibrate`, iPhone Safari the iOS 18 switch-checkbox tick. No Capacitor dependency here: a runtime check. The table and
the plugin to add at packaging time: CAPACITOR.md. The kit uses: chest heave heavy, the GET success; door pulses medium, its last shove heavy;
crank pawl tick, its catch heavy; lever teeth tick, its clunk heavy; button heavy; plate medium.

## THE GALLERY -- one station per piece, approved station by station (his, after m2633)
The sandbox is a **white-box gallery**: a white hall, an aisle down the middle, four bays a side, each a STATION with a label plinth (the piece's
name and how to work it). Walk the aisle, try each one, and approve its INTERACTION and its LOOK separately. Each object then gets its own
DESIGN pass (one per build): a detailed Korajin look, real mechanical ARTICULATION (its parts move in sequence with Grumbo's action), CRAFT.md,
the night glow, and 1-3 draws.

| station | where | interaction | look (design pass) | his sign-off |
|---|---|---|---|---|
| THE HEAVY DOOR | north bay 1 | [x] m2627 | [x] m2638: carved stone / bronze, ornate frame, studs, glyph bands, glowing Jinra inlays; bolts that slide, a lock that turns, hinges that move | [ ] |
| THE TREASURE CHEST | north bay 2 | [x] m2623 | [x] m2640: carved lid, bronze corners and bands, a clasp that unlatches, a gem lock, lining and glow, working hinges | [ ] |
| THE WHEEL CRANK (+ gate) | north bay 3 | [x] m2630 | [ ] spokes, hub, rope drum, a ratchet pawl that clicks | [ ] |
| THE DRAWERS | north bay 4 | [x] m2631 | [ ] | [ ] |
| THE BUTTON | south bay 1 | [x] m2631 | [ ] | [ ] |
| THE PRESSURE PLATE | south bay 2 | [x] m2631 | [ ] | [ ] |
| THE LEVER | south bay 3 | [x] m2631 | [ ] a weighted handle, a gear quadrant | [ ] |
| THE POTS | south bay 4 | [x] m2631 | [ ] | [ ] |

## THE SANDBOX ROOM (superseded by THE GALLERY)
A sunlit stone court open to the sky, one of each piece, spread over three heights (VERTICALITY): the floor, a dais up three .30 risers (the chest),
a balcony up a stair (the crank) over the gate it raises, the heavy door in the back wall, the buttons / plates / lever / drawers / pots round the
floor. RESET puts every piece back.

## DONE WHEN
- [x] INTERACT.md written: one row shape, the shared walk-up / lens / pose / rumble, each piece's beats, this list.
- [x] 1. CHEST (m2623): the full ritual + GET + backpack, strip in NOTES; the desert village's backwards chests fixed (`face: 'auto'`).
- [x] 2. HEAVY DOOR (m2627): push, strain, treading feet, pulses of rumble / dust / grind, it finishes on its weight; strip in NOTES.
- [x] 3. WHEEL CRANK (m2630): spin the stick, hand-over-hand IK, the rope winds on its drum, the portcullis rises; faster = faster; let go = slips back; caught at the top; strip in NOTES.
- [x] 4. BUTTONS / PLATES / LEVERS / DRAWERS / POTS (m2631): each a row with its own signal lamp; pots are the game's breakables; strips + a probe in NOTES.
- [x] 5. RUMBLE (m2633): TOOLS > LOOK > HAPTICS + the sandbox's HAPTIC TEST; the shake + thump always. (His plain answer on whether the iPhone tick works: OPEN.)
- [x] Every piece is a row a temple can place (`ikitAdd(row, parent)`, `IKIND[kind]`), with a stable id; RESET replays all of it (chests, door, crank + gate, button, plate, lever, drawers, pots mended).
- [ ] **His sign-off, on his phone.**
