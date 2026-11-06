# THE TORCH + THE DARK — sandbox design doc

**His words (Nov 6 2026):** *"Cooler than a lantern would be a TORCH: you hold it up in the air and it has really, highly realistic fire,
and maybe you fight with it, and it lights things on fire. Going through a dark, dark temple where you can barely see except where you
shine the light... scurrying things coming out of the dark."*

The sandbox is **The Dark Hall** (`?w=forge&zone=dark`, KORAJIN menu, `ENTRY.rows.dark`). The torch is a held item of its own. It sits
beside the m2544 LANTERN STAFF (ARSENAL.md), and both stay. Under the WHOLE-PIECE RULE, nothing builds on the torch until every box below
is ticked with evidence and he has signed it off on his phone.

## The pieces (all rows / tables, data-first: SCENE_COMPANION.md)

| table | what it is |
|---|---|
| `TORCH` | the held torch: `len`, `flame {h,w}`, `lean` (how far the flame streams off the head's velocity), the ONE light (`col, I, dist, distUp, decay, shadow, map`), `emb` / `smoke` pool sizes, `up` (the hold-up pose) |
| `DARK` (`SC_DARK`) | the zone: `env` (near-black bg, fog 6-21 m, hemi .07), `hall` (13 m wide, 42 m deep, 7.5 m walls, six column pairs, a 1.2 m dais up four .24 m risers), `braziers` (8 rows with stable ids, on four height tiers: floor, a .6 plinth, a 1.4 plinth with a stair, the dais), `lightR` |

**The fire is one shader (`flameMat`)** on an axis-billboarded quad, so it is one draw. A HEAT field is hottest on the axis at the base and
falls off to the sides and with height. Two fbm fields scrolling upward at different speeds tear it into tongues. The colour ramp follows
the heat: deep red edges and tips, then orange, then yellow, then a white core. A faint shimmer band sits above the tips; this is the
heat haze, faked in the shader because there is no post chain. Embers (additive) and smoke (alpha, warm grey) are two `puffPool`s. **The
whole torch is 6 draws:** haft, collar, rag head, flame, embers, smoke. Its PointLight is the only shadow-casting light in the zone.

## DONE WHEN

**Pass 1 — the fire, the hall, the braziers**
- [x] A torch is held in his left fist, with the haft along the knuckle line and the burning head up. (`torchStep`)
- [x] HOLD TORCH UP: the left arm is IK'd over his head and the light reaches further (`distUp` 13 against 9). It is a button on the zone bar.
- [x] Layered shader flame: licking tongues, a white-yellow core going to orange and then to red tips, and heat shimmer above. CLOSE renders: `images/renders/torch/`.
- [x] Embers rise and fan out, going from bright to red as they die. Smoke wisps rise and grow.
- [x] It reacts to motion: the flame leans away from the head's velocity (it streams behind when running) and gutters on a roll, flip or cartwheel.
- [x] ONE flickering warm point light, and it casts the shadows. The sun is off, the IBL is off, and the hemi is .07.
- [x] The Dark Hall: near-black, columns, a dais with steps, and braziers on four height tiers. Touch the flame to a brazier and it lights, then stays lit with its own (non-shadow) light.
- [ ] **His look on the phone: does the fire hold up close?**

**Pass 2 — fight with it**
- [ ] Torch swings are melee, and each swing leaves a fire trail.
- [ ] A hit sets things alight: cobwebs, vines, wooden barricades, and enemies briefly. These are a `flammable` row kind.
- [ ] Fire spreads along a flammable row (web to web, vine to vine).
- [ ] A lit brazier makes a LIT ZONE (safe ground for pass 3).

**Pass 3 — the dark has things in it**
- [ ] Faint silhouettes at the edge of the light.
- [ ] SCURRIERS swarm in the dark. They freeze and flee from the light, and rush in when the torch gutters or is lowered.
- [ ] A bigger watcher's eyes glint at the edge (the Hollow's eye, EMBLEMS.md / WORLD_PLAN 17).
- [ ] Water douses the torch, and it is relit from a brazier.

- [ ] **HIS SIGN-OFF ON HIS PHONE.**

## Probes
`mel.TORCH` / `mel.DARK` are live. `mel.brazierLight(mel.DARK.on.br[i])` lights one, and `mel.TORCH.up = 1` holds the torch up.
