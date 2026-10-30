# KORAJIN

コラジン · Korajin Grumbo

Colin's new game, growing out of this repo (Oct 27 2026). It lives here, beside Zap & Clancy, behind the title picker
(build m1104) while it still borrows this engine. It will become its own repo; that move is a copy, the way zap was copied
out of weirdport. Do it when Korajin stops needing Zap's code, or the day he asks.

## The pitch (his words, kept)

- **Title:** KORAJIN. **Protagonist:** Korajin Grumbo. "Grumbo" is easier for an American audience than "Gurambo".
- **Genre:** mythic science-fantasy action adventure.
- **World:** an ancient alien civilization with retro-futuristic technology and supernatural folklore. Japanese-style buildings
  fused with flying things, like the anime zeppelin: robotic, cyberpunk-ish, futuristic and retro at once. Floating islands
  with waterfalls, red ceremonial banners, bronze machinery, weathered stone.
- **Visual identity:** stylized 3D, expressive characters, weathered stone, bronze machinery, ceremonial fabrics, mysterious
  energy. The two title posters show Grumbo (the purple-spotted alien goblin with the orange crest, the bronze armour and the
  red chevron cloth) on a rock in front of a bronze-and-stone town with floating islands behind.
- **Tone:** adventurous, strange, occasionally humorous, with an ancient mystery underneath. **Not too serious or mystical**:
  weird merchants, grumpy villagers, absurd creatures, peculiar customs and comedy, alongside the mysteries. Grumbo's name and his
  exaggerated design carry that personality, and it has to be kept.

## The mythology so far

- **Technology so old it has become tradition.** Floating lanterns, gates that open to a palm, mechanical creatures in the
  streets, a spacecraft in the mountain that everyone calls a temple. Nobody calls any of it futuristic.
- **The Jin:** an invented force (not a real Japanese definition) that connects living consciousness with matter. It is not
  quite electricity and not quite magic, and it is older than both. Jin-forged blades cut energy fields and wake dormant
  machines. Jin constructs are machines animated by fragments of consciousness. Jin spirits have no stable body.
- **"Jin" has many readings, deliberately:** 人 person, 仁 benevolence (a bushidō virtue), 神 spirit/deity, and the Arabic
  jinn (smokeless fire). The game can lean on all of them without claiming any is the meaning.
- **Factions (a start):** the Red Order (discipline and ritual; Grumbo's origins may tie to them), the Hollowed (bodies
  replaced with ancient machinery), the Veilborn (half outside reality), the Dustwalkers (scavengers and traders).
- **Grumbo:** a wandering warrior who doesn't fully understand his own ancestry. Tough, stubborn, a bit mischievous,
  unexpectedly kind. He enjoys fighting a little too much and keeps waking ancient tech he doesn't understand. Not a chosen one.
  His attitude: *something is causing trouble in this village, I'm going to deal with it.* The touchstone is Usagi Yojimbo.
- **The central mystery:** structures older than any history, some temples, some machines, some alive. All of them answer
  to the Jin, and Grumbo can wake them. Was the Korajin made to guard them, are they descended from their builders, or did the
  structures make the Korajin? Don't answer it early.

## MONEY: GOLD DOUBLOONS -- and the Jin is for POWERS (his lean, Oct 28 2026; "I don't really know yet")
> *"Coins, just like gold doubloons -- a cool looking gold coin. We'll have the Jin, the green glowing stuff, for my powers."*
- **Two currencies that never look alike:** GOLD (doubloons) buys things (the merchant, gear). MINT Jin powers Grumbo (and the ship's flight).
- **The doubloon (`COIN`, `coinGeo`, m1470):** hand-struck gold with a DIAMOND hole and the banners' nested crosshair diamond round it (his, m1475), a rim, in two tones. A pickup spins and bobs; walking through it collects it (a leap, a ring, a sparkle), and `COIN.n` counts (saved).
- **Not decided:** where coins come from beyond pickups (enemies? chests? the merchant buying from you?), prices, and a counter on screen.

## JINRA (ジンラ) -- the name of the green (his pick, Oct 28 2026)
> *"I like Jinra."* (From the suggestions: Jinra, Jinki, Jinmori, Kōra, Numa.)
- **The Jin is the force; JINRA is its visible substance:** the luminous, semi-living essence that flows through everything (biology, machinery, weapons, spirituality, and the ship's flight). It is an invented word.
- **How it looks:** translucent, slightly viscous MINT with suspended luminous motes. Sometimes liquid, sometimes vapour, sometimes CRYSTAL. It can be harvested, bottled, refined, corrupted, and used to power ancient machines.
- **Visual reference:** `images/korajin/ref/jinra_sheet.jpg`. A Jinra refinery-shop (a sandstone dome with a giant glass globe tank, copper pipes, teal banners, a timber deck), bottles and containers, canisters and storage, esoteric items (crystals, a gyroscope orb, a dripping basin, amulets), environment props, an interior shop, a processing station and large storage.
- **In code:** the colour token is `JIN` / `JINHEX` (mint), and the rule stands: mint is the Jinra's alone. Gold doubloons are money (MONEY, above).

## THE RESTORATION -- the arc of the whole game (his, Oct 28 2026)
> *"The Korajin are an ancient people whose powers were stolen. They've forgotten they were magical, like Jin, and they're just regular people now --
> you're liberating them. You bring townspeople artifacts, and the guy who's a regular merchant becomes a mystical Jin. You're trying to restore the
> flying, magical world in the sky that fell to the ground. It's rusty, old, ancient -- like a Western mixed with broken-down old samurai. When you
> restore it, the boats start to fly, the buildings start to float and glow, the windmill that didn't run now runs on Jinra, the stream glows
> green, the central plaza tower shoots up into the sky, and things slowly start to float. You're rebuilding the floating sky people."*

**THE FALL (the start of every place):** rust, dust and dead wood. A Western frontier town grown over broken samurai ruins. Grounded boats, a
dry windmill, a dull stream, a stunted central tower. The people are ordinary and have FORGOTTEN; nothing glows.

**THE RESTORATION (what the player does):**
1. **Gather Jinra** (from creatures, springs and wrecks), and win back the stolen power: light the enemy's torch towers (THE JINRA BEACONS).
2. **Bring the townspeople their ARTIFACTS.** Each one REMEMBERS and AWAKENS. The plain merchant becomes a mystical Jin, the smith a Jin smith.
   People are the reward you see.
3. **Restore each PLACE, stage by stage:** the stream glows mint; the windmill turns on Jinra; buildings lift off their foundations and FLOAT
   and glow; the boats fly; the central plaza tower SHOOTS UP into the sky.

**THE PROGRESSION (regions):**
- **The whole-game skeleton (acts, regions, temples, items, collectibles) is proposed in ZELDA_STRUCTURE.md** -- the classic Zeldas picked apart, and a
  Link's Awakening-scale plan (8 great temples over three acts: the ground, the below, the sky). His to cut.
- **Region 1, the fallen ground** (the Red Hollows): its levels' Jinra powers YOUR SHIP until it can FLY (the ship's sea-to-air form, built).
- **Region 2+:** pouring Jinra into a region's heart UNLOCKS A FLOATING SECTION, a whole new world above, and you fly up to explore it. The
  restored sky world (the dojo's islands are its look) is the destination, rebuilt region by region.

**THE TRANSFORMATION IS THE SHOW (his, emphatic):** *"Fallen is not just decrepit -- the opposite of fallen is literally lifted into the air,
floating on jets. It can't be one or the other: it has to be made of the SAME PIECES so we can animate it going up into the air, lighting,
illuminating, pieces moving in and fixing themselves -- very cinematic. The transformation is going to be huge."*
- **One set of pieces, two poses per piece.** FALLEN: on the ground, collapsed, tilted, slid off, cracked, rust-dull. RESTORED: assembled,
  glowing, the whole thing LIFTED and hovering on Jinra jets.
- **The transition is choreographed:** the base heaves free; the jets ignite; pieces fly back into place one by one (staggered, with arcs
  and a snap); the colours flood from rust to life; the glow comes on; it rises; the dust and Jinra pour off it.
- **The shared kit is `RESTORE`** (`restoreRig` / `restorePiece` / `restoreSet` / `restorePlay`). The reference is SPAWN > BUILDINGS >
  Restoration Demo. Every restorable place is built through it.

**What it means for building now:**
- Every place should be designed with TWO STATES, FALLEN and RESTORED, as one build with a switch: the same layout, rust versus Jinra glow,
  grounded versus floating.
- **The look of the fallen world:** a Western frontier over ancient samurai ruins. Weathered timber, rusted iron, dry stone, dull colour.
  **The look of the restored world:** the hero kit, floating islands, mint Jinra, warm lanterns (the dojo).

## THE STORY'S FIRST THREAD: THE UNCLE, THE DRAGON, THE ONE FLOATING BUILDING (his, Oct 28 2026; a sketch)
> *"The three-headed dog and the dragon were going to be enemies, but maybe they're animals you unlock. You fight the dragon, tame it by giving it
> the good Jinra, and then you can ride it and control it -- one of the ways you fly up. There's only ONE floating place in the sky: the refinery,
> run by a crazy old man. You can't get up there, it's too high, so you find the dragon, give it the Jinra, and fly it up. He's your long-lost
> uncle... Or in the beginning your crazy uncle tells you about these things and you don't believe him, then the man at the shop tells you more and
> you start to believe it's true. People send you off on quests and you slowly realise who you are and where you came from."*
- **Beasts are MOUNTS, not just enemies:** the sky dragon (built, flying the dojo) and the three-headed dog. You fight one, TAME it with
  refined, "good" Jinra, then RIDE and steer it. The dragon is a way UP.
- **The one floating building at the start is the JINRA REFINERY** (Worker B's, over the peak in the Red Hollows), run by a CRAZY OLD MAN,
  maybe your long-lost UNCLE. It is unreachable until you have the dragon.
- **The thread:** an uncle's stories you don't believe, then the shopkeeper who tells you more, then quests from the townspeople, then the
  slow realisation of who you are (the Korajin's question: born one, or made one?).

## OURS vs THEIRS: WHAT IS RESTORED AND WHAT IS TORN DOWN (his, Oct 28 2026)
- **OUR places** (the Korajin's towns, his home) start FALLEN and are RESTORED: rebuilt and lifted into the sky on Jinra jets (RESTORE kit).
- **ENEMY places are for DESTROYING.** They never float. You tear them down (fully destructible), and in their place you raise SACRED
  buildings: Jinra power plants, shrines, which feed the restoration. *"Why would we put the enemy buildings up into the sky? That's the opposite."*
- **The enemy has its OWN LOOK, our opposite:** classical Japanese (the forge's original style, embellished) in an ENEMY palette. DECIDED:
  **BLACK AND GOLD** (his pick, Oct 28 2026). The guide is `ENEMY_STYLE.md`.

## THE BLUE DRAGON, THE FIRST MOUNT (his, Oct 28 2026)
*"Embellish the blue dragon GLB. When he becomes yours I want to control him, really fun: shoot fireballs, the same feel as RollerGirl with her
wingsuit (borrow from that), shoot the gun while riding, ride him on the ground too."*
- **Riding:** on the ground (the run clip) and in the air (a flight model borrowed from RollerGirl's wingsuit). Fireballs (he already has
  `attack_air`) and Grumbo's own gun while riding.
- **Dressing:** a SADDLE; a glowing Jinra COLLAR; wrist and ankle jewellery or armour; tail ornaments; once captured, a red CAPE or banner
  with OUR emblem. Two texture looks: EVIL (wild, the enemy's) and CAPTURED (ours).
- **A test zone of its own** for riding and its animations (BUILDINGS.md, THE DRAGON RIDE).
- **Needs from him:** a FLY cycle (the GLB has none; `attack_air` is the nearest), and any riding clips for Grumbo.

## THE ENEMY: ANCIENT CONSTRUCTS FEEDING ON STOLEN JINRA (his, Oct 28 2026; open)
> *"The enemy feeds off the power -- an ancient robotic thing. Stone, almost Egyptian, like the Sphinx made of rock, or the buried Chinese
> terracotta army -- so when you break them they're robotic, held together by this magical power. They've been feeding off the ancient Jinra. The
> master might be a giant thing, a living race or a mechanical presence. Every time you destroy one, a little of the green stuff leaves them.
> Their chests or heads glow with it, and when you kill one or break pieces off, the green seeps out and rises into the air, or you collect it."*
- **The look:** carved STONE and fired TERRACOTTA soldiers (the Sphinx, the buried army), weathered, cracked and chipped, jointed like machines.
  They are not alive; the stolen Jinra holds them together.
- **The tell:** the Jinra glows mint INSIDE them, through the cracks: a core in the chest, eyes, seams at the joints. The brighter the glow,
  the stronger the construct.
- **Breaking them:** knock off a piece (they already DISMEMBER, as the robot samurai does) and Jinra SEEPS from the break. Destroy one and its core
  releases a burst that RISES as wisps, which you collect. So fighting is GATHERING; it feeds the restoration (THE RESTORATION) and the
  beacons (THE JINRA BEACONS).
- **The master:** open. A colossal construct (a kneeling colossus already stands in the forge), or a living power behind them. His call.
- **Ties to:** the enemy torch towers are THEIR architecture (ARCHITECTURE.md's enemy grammar: carved stone, terracotta, bronze, with Jinra
  burning in the braziers they stole). The colour rule holds: their glow is the Jinra's mint because it IS the stolen Jinra. Everything else
  about them is stone, clay, bronze and rust.


### THE NAME: KŪKYO, THE HOLLOW (his, Oct 28 2026; PROPOSED, his pick)
> *"Kūkyo, I think it's how you say empty or hollow in Japanese -- maybe a cool way to refer to our evil empire, that's their name, or a play
> on that. Then variations: hollow warrior, hollow ninja, hollow giant, hollow spider, hollow monster things."*
- **The empire:** the **Kūkyo** (空虚, "emptiness, hollowness"): the hollow that drains the Jinra out of the world. This ties to what already
  exists: "the Osari of the Hollow" (his bowman's name) and "the Hollowed" (the faction list above). One reading: the **Osari** are
  the constructs, and the **Kūkyo** is the empire they serve.
- **The units: `Utsuro` (虚ろ, "hollow, vacant -- a body with no soul in it") + what it is.** A suggested set:

| in game | Japanese | meaning |
|---|---|---|
| Utsuro Musha | 虚ろ武者 | hollow warrior (the swordsman) |
| Utsuro Yumitori | 虚ろ弓取 | hollow archer (the bowman) |
| Utsuro Shinobi | 虚ろ忍 | hollow ninja |
| Utsurogumo | 虚ろ蜘蛛 | hollow spider (*kumo* becomes *-gumo* in a compound, as in *tsuchigumo*) |
| Utsuro Kyojin | 虚ろ巨人 | hollow giant (the stone giants, 5-10x his size) |
| Utsuro Komainu | 虚ろ狛犬 | hollow guardian: the **komainu** is Japan's own lion-dog shrine guardian, the natural name for our sphinx (STATUES.md) |
| Utsuro Oni | 虚ろ鬼 | hollow ogre / monster |

- **Open (his):** "Kūkyo" for the empire or a play on it, whether "Osari" stays as the people's name, and whether names show in game at
  all (the SPAWN menu still says OSARI SPIDER / Osari bowmen; nothing has been renamed yet).

## THE STOLEN ONES -- what is inside every guardian (his, Oct 28 2026; open)
> *"The evil sorceress / evil force takes village people or village animals and freezes them in stone, turning them into the guardians of the
> places that keep the power source in these ancient temples. When you slay a boss the rock formation crumbles, the power is released, and
> what's left is what it was -- a bull (an alien bull), or a village person. A farmer: 'I'm missing Betsy.' Help me find Betsy -- you slay the
> thing at the very end, you get the bull back and give it to the farmer, because the cow had been turned into the watcher of this temple.
> Or somebody loses their little brother, and he's one of these."*
- **Every temple guardian (boss) is a STOLEN ONE:** a villager or a village animal the Kūkyo turned to stone and set to guard the stolen Jinra.
  His bull-headed stone god is Betsy.
- **The boss fight breaks the stone; the crumble is the reward.** The rock falls away, the Jinra pours out, and the creature or person is
  standing there, dazed. It is the restoration's own grammar (FALLEN -> RESTORED) on a body.
- **The quest comes FIRST, in the village:** a farmer missing a bull, a mother missing a son, a smith missing his apprentice. You do not know
  it's the boss until the stone cracks. **Returning them is the temple's real ending** (the token is the formality): the farmer and Betsy, the
  brother home. The townsperson you returned them to AWAKENS (THE RESTORATION, step 2), so a temple restores a person as well as a place.
- **Who they were shapes the guardian:** a bull becomes a bull-headed stone god; a fisherman becomes something of the water temple; a child
  becomes something small and fast. The temple's look follows from what was stolen.
- **The small statues are the same thing at a smaller scale:** the stone guardians that wake on the chalice (STATUES.md) can be stolen
  villagers' animals too. A broken one leaves a chicken, a goat, a dog behind, to be walked home for a reward (the side-quest layer).
- **Zelda's version:** Ocarina of Time's sages are trapped in its temples and freed when the boss falls. This makes it personal and
  visible: the one freed is someone the village asked you to find.
- **Open:** who the "sorceress" is (a Kūkyo figure, the one draining the world), and whether a freed guardian keeps a trace of its stone form
  (a stone horn, a glowing scar) as a mark of where it was.

## THE JINRA BEACONS -- a spine for the campaign (his idea, Oct 28 2026; open, "we'll figure it out")
> *"The evil army has giant torch towers. When you defeat a tower you shoot the Jinra into it, and it lights up green and shoots off -- the levels
> are arranged around a central place, and you're aligning all the Jinra to the central tower, so it becomes one giant powerful thing that powers
> the whole world, or your planet, or the ship."*
- **Each level ends at the enemy's TORCH TOWER** (its boss, layer 5). Beat it, then pour your gathered Jinra into the brazier. It turns from the
  enemy's colour to MINT and fires a beam across the sky to the CENTRAL TOWER.
- **The world map is a ring of levels round the central place.** Every lit beacon is visible from everywhere (a beam in the sky), so progress
  is something you SEE from the hub and from inside every level.
- **When all the beacons are aligned,** the central tower wakes and powers something huge: the world, the planet, or the ship's true flight.
  Open, his call.
- **Ties together:** gathering Jinra (THE LOOP), the enemy factions' architecture (ARCHITECTURE.md: their towers in their colours), the boss layer
  (LEVELDESIGN.md, layer 5), and VERTICALITY (the towers are the tallest things in each level, so the climb to the brazier is the finale).

## THE JIN GLOW -- the essence you can SEE (now named JINRA, above) (his, Oct 28 2026, off the serpent fish's spots)

> *"I really like this green glowing stuff... floating candles with this green glowing fire-liquid, things that should be spewing water but it's
> this green, weapons that shoot it, his katana makes it as it cuts the air. Maybe this is the stuff he collects -- the ship is in the water and you
> collect a bunch of it, store it, and then your ship can fly; eventually you get powers. It's the essence of the Jin, the Korajin."*

- **What it is:** the Jin made visible -- a liquid light, MINT (`JIN.hex` 0x7affd8, first drawn as `shipSerpentMake`'s glow spots). It is
  always the same colour, so the player learns one rule: **mint = Jin = power.** Nothing else in the palette may use that hue.
- **Where it shows (built so far, m1422):** the katana's trail, and the motes it sheds as it cuts (TOOLS > TRAIL: JIN / BLUE); the dojo's
  floating JIN CANDLES; the JIN SPRING pouring off the pagoda island.
- **Where it can show (to build):** Jin springs and fountains in the world in place of water; Jin-fed lanterns; creatures that carry it (the
  serpent fish, the manta and whale spots -- living sources); Jin weapons that fire it; a beaten enemy releasing it.
- **THE LOOP (his idea, the game's spine if he wants it):** Grumbo's ship sails the sea and GATHERS Jin -- from the serpents and great
  creatures, from springs, from wrecks. It is STORED in the ship's core (the tank you can see filling). Enough Jin and **the ship can FLY**
  (the sea-to-airship transformation he already wants). More Jin unlocks Grumbo's POWERS. So collecting is the progression, and flight is
  the first big payoff.
- **Open (his calls):** a name for the stored stuff (Jin / essence / a word of its own); whether you take it by fighting, by fishing or
  by drinking from springs; whether enemies want it too (a reason for the Hollowed to raid the ship).

## HIS NEXT BIG IDEA (open)

**What if Korajin isn't a species at all, but what happens when an ordinary living creature becomes bonded with Jin?** It would be
an ancient transformation that can happen to beings of many different species. That explains why Korajin warriors have
wildly different anatomies, why some look organic and others mechanical, and why some seem almost supernatural. And it gives
Grumbo his question: **was he born a Korajin, or did something turn him into one?**

For the game this is a gift. Every body in the cast (the samurai robot, the goblins, the orc, the lizards, the creatures)
can be a Korajin without being the same thing.

## What is already built (in the arena) that belongs to Korajin

The katana and its chains, the swing lurches (m1101), the guard and its strikes, the air legs (m1098), the juggle, the
dismembering robot samurai (m1090), the slicing horde with real life (m1102), the red archers (m1103), the directional
knock-downs on everybody (m1099), the rival, the beasts, the dragon fireball (m1096), the tornado, the zoom.

## THE RED HOLLOWS -- Grumbo's homeland (his direction, Oct 27 2026)

*"Grumbo's home territory should be the place that establishes the entire identity of KORAJIN. Not a generic samurai village, and not a
futuristic alien city. Something that looks ancient, organic, slightly primitive, but has mysterious technology embedded throughout it."*

A secluded settlement built into the remains of an ancient civilization: a sprawling canyon of enormous rounded sandstone formations, natural
caves, suspended wooden bridges, weathered red banners, and strange bronze machinery that nobody remembers how to manufacture. A place where
generations of unusual alien creatures have lived, traded, fought, and developed their own customs.

References: `images/korajin/ref/red_hollows_home.webp` (Grumbo lounging at his door: rounded sandstone, red diamond-spiral banners, bronze
lamps and a ship's-wheel gear, floating islands and waterfalls behind) and `images/korajin/ref/red_hollows_canyon.webp` (a deep canyon,
rope bridges, painted walls, hanging pennants, misty light from above).

In the game: world `home` (KORAJIN > The Red Hollows), first pass m1113 -- see NOTES.md.

## Not built yet

A bow for Grumbo; the sword-and-bow enemy who switches; a Korajin place (the bronze town, the floating islands); a Korajin
splash (drop the poster PNG in the repo and it goes on the title card).
