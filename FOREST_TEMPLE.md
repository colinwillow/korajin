# THE FOREST TEMPLE -- the real temple, below (KORAJIN > Forest Temple Kit `?w=forge&zone=ftkit`; the interior `?w=forge&zone=ftemple` from pass 3)

## Vision (his words, Nov 4 2026, WORLD_PLAN.md section 2)
*"The above-ground part is the tip of the iceberg -- the door. The real temple is massive, inside, underground."*

The Forest Domed Temple (DOMET, `?w=forge&zone=dometemple`, m2144; its surroundings are another worker's) is only the DOOR. Through it, and down,
is a vast overgrown underground temple: giant tree roots driven through the cut stone from the forest above, glowing Jinra moss in every joint,
shafts of daylight falling from cracks far overhead, waterfalls pouring out of broken walls into black pools, carved guardians watching from
the walls -- and, at the bottom, the boss who holds the forest's JINRA STONE. Everything climbs: storeys, rims, galleries and drops (VERTICALITY).

## Map of the chambers (top to bottom)
```
  [THE DOOR]  the dome temple's cella (DOMET) -- the chevron on its floor seal: ENTER
      |
  1 ENTRY HALL      (-6 m)  a long colonnaded hall, roots hanging from the vault, the first shaft of light; the way DOWN is a broken floor
      |  THE DESCENT  a spiral of stairs and ledges round a root-choked well, a waterfall out of the wall into the dark (-6 -> -24 m)
  2 THE ACROBATIC ROOM (chamber 1, WORLD_PLAN 5) -- three storeys, -24 .. -6 m
      |     ground floor: the locked door (opened from the top), the last fight
      |     rim 1: archers across the gap; rim 2 by the wall run; the melee scrap; monkey bars / high bar / tightrope; the BUTTON at the top
  3 THE FLOODED GALLERY (later)  pools and a waterfall, lily stones that sink, an arrow switch over the water
  4 THE ROOT HEART (later)        the giant root mass, climbing it, creature A (swarm) and creature B (burrower)
  5 THE GUARDIANS' HALL (later)   the stone-twin statues that wake on the chalice (STATUES.md)
  6 THE BOSS ARENA (later)        the boss (WORLD_PLAN 6); the JINRA STONE with the GET moment
```

## How it is built (SCENE_COMPANION.md: data-first)
- `ftkMake(THREE, O)` between `// FTKLIB:START` / `:END` is a PURE builder of its table (`SC_FTEMPLE` markers): materials (`mats`), the
  placement rows (`kit`; the chambers get their own sets), the underground light (`env`), the spawn and the headless cameras (`shots`).
  Every placed thing is a ROW with a stable id. A row's `k` names a PIECE function; pieces write into ONE sink per material, so the whole set
  merges to about a dozen draws, and give colliders in the `obox` shape.
- Glue (`FTEMPLE`, `ftinStage`, `ftinStep`, `ftinMelee`, `ftinArrow`): the stage replaces the forge's floor and sky with the cavern's dark and
  its own light, pushes the colliders into BOXES, and lights the carved script at night (`nightGlow` on `stone` (runes), `carve` (cracks),
  `root` (veins); NIGHT.md). The moss, the guardians' eyes, the lanterns and the braziers' Jin flame glow ALWAYS (it is underground).
- `npm run ftstrip [shot ...] [--night=1] [--set=...]` lifts the SHIPPED text and renders its cameras headless (draws, tris on the sheet).
- Textures: `tools/ftemple_textures.py` (gpt-image, seamless): `ft_wall`, `ft_floor`, `ft_carve` (a frieze, tiles in X), `ft_root`, `ft_moss`,
  `ft_cobble`, and the singles `ft_door`, `ft_guardian`, `ft_pot`.
- Stairs: every riser .30 (his step is .357, m368). Colours: only `JPAL` for the Jinra (JINRA_COLOUR.md).

## THE KIT (pass 1) -- the pieces
| piece | what | collider |
|---|---|---|
| `wall` | ashlar courses, a base course, a carved frieze band, a cornice; `seg` = bays with pilasters; `ruin` = broken stepped top, rubble, moss | body |
| `floor` | a flagstone slab; tall `t` = a terrace mass with a lip and a frieze on its face | body |
| `stair` | `n` risers of .30 on a SOLID mass, cheek walls both sides (climbs toward -Z) | each step, the cheeks |
| `ledge` | a balcony on three stepped corbels, a lit rune under each, vines dripping off its edge (the acrobatic room's rim) | the deck |
| `column` | lathed with entasis, a base, a capital; a moss collar; `roots` = two roots spiral it top to floor | the shaft |
| `ruin` | a toppled column: the stump, two drums on the floor, rubble | stump, drums |
| `rootwall` | a wall split by a crack: the trunk root out of it, roots flowing down the face and over the floor, rootlets, vines | the two halves |
| `panel` | a carved GUARDIAN relief in a frame, eyes lit | the block |
| `arch` | two piers, eleven voussoirs, a keystone rune | piers, top |
| `door` | a heavy frame, a frieze lintel, two carved stone leaves on hinges (separate meshes for the swing) | jambs, lintel, the leaves |
| `lantern` | a stone post with an iron arm, a chain, a hanging stone lantern with a lit heart | the post |
| `brazier` | a bronze bowl on three curved legs on a stone footing, a Jinra flame (shader), embers | the bowl |
| `pots` | clay pots of three shapes (instanced); BREAK to a swing, an area blow or an arrow; come back 18 s later | -- |
| `moss` | a glowing moss carpet, glowing caps, spores | -- |
| `vines` | a lintel on posts with vines in catenaries and drops, each its own length | posts, lintel |
| `shaft` | daylight down from a crack (an additive cone, dust in it), a lit pool on the floor | -- |
| `guardian` | a carved guardian on a plinth, a mask head with lit eyes, a spear (a stand-in for his sculpt) | plinth, body |

## Passes
1. **THE KIT** -- every piece above in rows on a flagstone floor, then put together on a 3 m terrace (row C). Strip + numbers.
2. **CHAMBER 1: THE ACROBATIC ROOM** (WORLD_PLAN 5) -- three storeys (ground, rim 1 at ~6 m, rim 2 at ~12 m, the top at ~18 m). Get up to the
   first rim (stairs + a ledge climb); ARCHERS on the far rim across the gap (the existing archer, `ARCHER` / `archerAI`); a WALL RUN to the next
   ledge; a melee scrap on rim 2; on up by MONKEY BARS / the HIGH BAR / a TIGHTROPE / a MOVING PLATFORM; an ARROW SWITCH on the far wall that
   moves the platform; the BUTTON at the top opens the ground-floor door; back down; the last fight; ROOM CLEARED (a chime). Mesh collider row
   (`COLL.zones`) on its real triangles.
3. **THE ENTRY HALL + THE DESCENT** -- the door from the dome temple (an interact chevron there -> `?w=forge&zone=ftemple`; the exit back out),
   the hall, the spiral down round the root well with its waterfall, into chamber 1's ground floor. Its own ENTRY row (normal play camera,
   flat portal, minimal).
4. **THE ROSTER SLOTS** (WORLD_PLAN 3): melee small, melee big, ranged A (archer), ranged B (thrower), creature A (swarm), creature B (burrower /
   flyer) -- stand-ins where his models do not exist yet; each with its stone twin and a night glow in pieces.
5. **THE FLOODED GALLERY, THE ROOT HEART, THE GUARDIANS' HALL** -- one chamber a pass, each with a new verb.
6. **THE BOSS ARENA + THE JINRA STONE** -- the boss, the stone, the GET moment (standardised once, WORLD_PLAN 2).

## DONE WHEN
- [ ] The kit: every piece reads as what it is, close (2-4 m) and wide; CRAFT.md checked (roots taper and flow, vines droop, the chain hangs from
      a hook, stairs stand on a mass, nothing floats); numbers reported (pass 1).
- [ ] Phone-fast: the kit under ~25 draws; each chamber under ~60 draws and ~150k tris in its worst view; no hitch on entry.
- [ ] Night: the carved script, the cracks in the frieze and the veins in the roots glow in PIECES; the moss and lanterns glow always.
- [ ] Chamber 1 plays start to finish: up three storeys by every verb, archers, the wall run, the scrap, the switch, the button, the door, the last
      fight, ROOM CLEARED.
- [ ] Collisions on the real triangles in the chambers; no rim snags (the basin-edge / stair-top report).
- [ ] The door: in from the dome temple, out again; the ENTRY row lands him facing the hall.
- [ ] The roster slots filled (stand-ins named), the boss arena and the Jinra stone GET moment.
- [ ] **His sign-off, on his phone.**
