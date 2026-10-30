# STATUES -- every enemy has a stone twin (Colin, Oct 28 2026)

> *"Every time we make a new enemy -- humanoid, a spider, a big sphinx-like dog or cat, alien probably -- we should first make the STATUE
> version. Not a separate model: pose the rigged one in a statue pose. Texture it so it has no green glowing parts, then the one that does.
> In the level they stand guarding the evil lairs, and maybe they don't come to life while you go through it: you do the acrobatic part
> first, at the end you take a CHALICE with the stuff in it, and a cinematic shows all of them coming to life -- turning into the animated
> version with the green glowing parts."*

## The rule
- **Every enemy ships with two looks of ONE rig:** STONE (dormant: posed, no glow) and LIVE (its own texture with the stolen-Jinra glow).
  A new enemy is not finished until its statue form exists (posed, stone material, wakes on cue).
- **The stone look is a material swap, not a model.** It is made in code (`statueStone`): the map read as luminance only, over
  `STATUE.stone`, no emissive, rough. This holds unless he paints a dedicated stone texture, in which case that texture wins.
  Statues are sandstone and terracotta per ENEMY_STYLE.md.
- **Waking is an EVENT the level owns** (the chalice, a gate, a bell), never a proximity trigger. The acrobatic route comes first and the
  fight comes after, so statues stand in the level as decoration and as a promise.
- **The wake is a cut-away:** the lens visits each statue in turn (dust, chips, a crack, the mint flash, green fire). The woken ones REAR
  in place until the lens is back, then all come down at once. Nobody attacks while the lens is away.
- **Verticality:** statues stand on plinths of different heights, spread out, guarding the lair.
- **The sphinx is ours:** an alien guardian (wolf- or cat-headed, alien first), and it is a candidate for the first statue-native enemy.

- **What is inside the stone (KORAJIN.md, THE STOLEN ONES):** the guardians are villagers and village animals the Kūkyo petrified. A boss
  that crumbles leaves the stolen one standing there (his example: the bull-headed god is the farmer's lost bull, Betsy).

## The sandbox: SPAWN > STATUES (forge)
Four Osari spiders in stone on plinths of 1.2 / 2.6 / 1.8 / 3.4 m in a wide arc 12 m ahead, with a gold chalice of mint Jinra on a
black pedestal 6 m ahead. Walk into the chalice and they wake.

## DONE WHEN
- [x] The spider has a stone form (pose: rearing guard or crouch), and a blow on stone only chips it. (m1705)
- [x] A chalice wakes them through a cut-away: one at a time, rearing until the lens is back. (m1705)
- [ ] The Osari bowman has a stone form (a horde body: mixer frozen on a pose, stone materials, the brain held until the wake).
- [ ] The Osari swordsman, and every enemy after, ships with its stone form.
- [ ] The sphinx guardian (his design) exists in both forms.
- [ ] Statues placed in a real lair (the barracks' dormant rows, the shrine's flanks), woken by that level's chalice.
- [ ] His sign-off on his phone.
