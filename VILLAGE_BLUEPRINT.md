# THE SNOW VILLAGE -- blueprint (10 passes before a single piece is placed)

> *"We should do like 10 passes of logistic blueprint before we even start building it... it would be cool if it did have a lot of logical
> arrangement, verticality, things that are hard to get to. We have the kit now."* (Colin, Nov 1 2026)

**Why this file exists:** every area this repo has scaled up came out as a noise-scatter brush -- pieces with no reason to be where they are.
A real village is the opposite: every building is where it is BECAUSE of something (water, wind, the road, defence, who lives there, who they
trade with). So the village is designed on paper first, in ten passes, each answering one question, each signed off by him before the next.
**Nothing is built until pass 10 is approved.** The kit is done (`?w=forge&zone=snowkit`, `SVK` rows, `snowKitPiece`); this is only WHERE and WHY.

The pieces available (all `snowKitPiece`, 2 m grid, heights in .3 m risers):
- structure: walls (straight / corner / window / door), post + beam, hut base, roofs (round / gable), roof beams, chimney, stone stairs, platform, arch, pillar
- aqueduct: piers 6 / 9 / 12 m, arch span, deck + balustrade, shrine tower (2 sizes), end ramp 3 m, snapped sections
- buildings: hut (small / normal / big), longhouse, timber stairs, deck on posts, watchtower, gate, outpost
- accessories: fences + gate, banner post, flag pole, lantern post, jade lamp, fire pit, well, barrels, crates, pots, market stall, forge, sled, firewood, snowman

The moves it must be sized from (TEMPLE_KIT.md, measured): stairs .30; run + jump 2.2 high / 5.9 far; long jump 11.0; double jump 4.0 / 10.0;
high jump 5.3; wall run UP lip 2.7 (run) / 3.6 (sprint); side wall run 5.5-6.5 m; chimney faces 4.6 m apart; high bar 11.9 up.

## THE TEN PASSES

| # | question | output | status |
|---|---|---|---|
| 1 | **WHY is there a village here, and what does it DO?** | the settlement's reason, its people, its jobs, what it gives the player | **drafted -- below, waiting on him** |
| 2 | **THE SITE** -- the ground it sits on | a terrain section: the tiers (heights), the water, the wind side, the cliff; where in the Snowfield | |
| 3 | **ZONES** -- what goes where, and why | a zoning map: each district placed by its reason (water, road, defence, status) | |
| 4 | **CIRCULATION** -- how people move | the main road (stairs only, everyone), the lanes, the dead ends, the gate; how the mammoth gets through | |
| 5 | **LANDMARKS + SIGHTLINES** | what you see from the gate, from each tier; the one thing visible from everywhere; framed views | |
| 6 | **THE HIGH ROUTE** -- the parkour layer | the rooftop / aqueduct / tower route, each gap sized from the move table, a ladder (introduce -> combine); the hard-to-reach places and what is up there | |
| 7 | **THE BUILDINGS** -- one row each | a placement table: id, kit piece + options, tier, door facing, who lives there | |
| 8 | **LIFE** | who walks where, the market hours, smoke, lights at night, the animals, the mammoth stable | |
| 9 | **THE GAME** | the quest givers (THE STOLEN ONES), the shop, the healer, the way out to the valley / temple, the secrets | |
| 10 | **THE REVIEW** | one top-down plan + one side elevation drawn from passes 1-9, checked against every pass; his sign-off -> then the blockout, one district at a time | |

Each pass is short, specific, and gets his yes / change before the next. If a later pass breaks an earlier one, the earlier one is fixed on paper.

---

## PASS 1 -- WHY IS THERE A VILLAGE HERE? (drafted, for his notes)

### The reason it exists: WARM WATER
A village in deep snow exists where people can survive the winter. The strongest reason, and the one that gives every other pass something to
hang on: **a hot spring** rises at the foot of a cliff. Everything follows from it:
- **The aqueduct** carries the warm water from the spring (high, at the cliff) down through the village -- that is why the village has an aqueduct
  at all (the kit's biggest piece now has a JOB). Its deck is a walkway; its piers are landmarks; its line is the village's spine.
- **The bathhouse** sits where the water arrives -- the social centre (gossip, quest givers, a place to heal = the HEALER).
- **The wash-off pool / ice-free channel** at the bottom is where the water leaves -- the only open water in the valley (fish, birds, the herd drinks).
- **Steam** rises off the channel all day: the village is visible from far away as a plume (pass 5 gets its landmark for free).

### Why HERE and not on the open field: SHELTER and DEFENCE
- **The cliff at its back** breaks the wind (the wind comes down the valley; the village is in the cliff's lee). Snow piles on the windward side
  of everything; the lee side is cleared -- the drifts tell you which way the wind blows (pass 2).
- **Built UP the slope, not across it**: houses step up in TERRACES, each on a stone retaining wall (the kit's walls and stairs). Old mountain
  villages do this so every roof gets the low winter sun and the flat ground is kept for the herd. **This is the verticality, with a reason.**
- **One gate on the low side** (the kit's gate), facing the open field and the road to the valley. The high side is the cliff -- no wall needed.
- **The watchtower** on a spur over the gate, where you can see the whole field: the dragon's flight path, travellers, the herd.

### Who lives here (each one a reason for a building, and later a quest)
| who | what they do | what they need (-> a building, a place) | their STOLEN ONE (KORAJIN.md, a quest seed) |
|---|---|---|---|
| the HERDERS | keep the mammoth calves; ride the big mammoth | the STABLE (longhouse) outside the gate by the channel, the paddock fence, hay / firewood | the herd's bull mammoth, taken to the ice temple |
| the SMITH | forges, mends, sells | the FORGE (forge station) near the water (quenching) and the gate (travellers) | his apprentice |
| the BATHKEEPER / healer | runs the bathhouse, heals | the BATHHOUSE where the aqueduct arrives | -- |
| the MERCHANT (a Tall White? LORE.md) | trades; the shop | the MARKET on the first terrace inside the gate (stalls, crates) | -- |
| the ELDER / shrine keeper | keeps the Jinra shrine, knows the temple | the SHRINE at the top terrace by the spring, under the cliff | her daughter? |
| families | live | huts on the middle terraces, chimneys smoking, washing lines, snowmen | a little brother |
| the WATCH | guards | the watchtower, the gate | -- |

### What the village does for the PLAYER
- **A hub, not a level:** the safe place between the field and the valley / temple. Shop (merchant), healing (bath), upgrades (smith), quests
  (the stolen ones), the mammoth (stable).
- **A playground for the high route:** roofs, the aqueduct deck, the watchtower, the cliff above the spring -- places that are hard to get to,
  each with a reason to go (pass 6): a coin stash on the watchtower roof, the shrine bell at the top, a view of the temple from the cliff.
- **The way onward:** the valley road leaves from the top of the village past the spring (you go THROUGH the village, upward, to reach the temple).

### The rules this pass sets for the next ones
1. Everything is downhill of the spring; water flows spring -> aqueduct -> bath -> channel -> out the low side.
2. Status rises with height: gate / market / stable low, homes middle, shrine / elder high.
3. The wind side is buried in drifts; the lee side is where the doors are.
4. One gate, low. One road up through the middle. Lanes branch off it to the terraces.
5. Every building answers "who lives / works here, and why here".

### Questions for him (pass 1)
- Is **a hot spring + aqueduct** the right reason (it puts the aqueduct to work and gives the steam plume)? Or something else: a mine, a monastery, a trade crossing?
- How **big**: a hamlet (8-10 buildings, ~60 m across) or a town (20+, ~120 m)? Small is easier to make beautiful; the field has room for ~100 m.
- **Where**: the field's open south end near the spawn (SNOW_VILLAGE.md), or tucked against the cliffs by the lair climb (better shelter story,
  but crowded)? Pass 2 assumes the south end with a NEW cliff / slope built for it unless he says otherwise.
- Are the **Tall Whites** the merchants here, or is the village all one people?
