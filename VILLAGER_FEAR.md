# VILLAGER FEAR -- pass 1 (Colin, Nov 7 2026)

*"When monsters spawn in -- through the debug menu or in a level -- the village people should run, or duck down and be scared, or go hide behind a rock
or a barrier, they could do the cover crouch thing. Then when you've defeated it, they could have things to say about it, like thank you."*

**Data:** `SC_VFEAR` (`VFEAR`) in index.html -- one table for every villager: the Sunwell's Toads (bodies, via `foeWander`'s `fearV` hook) and the
Korajin woman (`VG`), each with a clip row (`VFEAR.clips.toad` / `.korajin_female_01`).

**The loop:** a HOSTILE is any live, unbroken `ARENA.live` body that is not a `civ` kind (so a debug-menu spawn counts), or a live swarm crawler.
1. **Startle** (within `near` 20 m): a flinch clip and a gasp blip, staggered per villager.
2. **Cover:** the nearest standable spot on rings round him (`coverR` x `coverDirs`) that the zone's colliders hide from the threat at crouch height
   (`losClear`, the archers' own sight test) -- he RUNS there.
3. **Hide:** crouched (the Toad's own `cover_idle`, her forged `peek` crouch), facing the threat, PEEKING now and then (`cover_R` / `peek`), trembling.
   No cover within reach: crouch where he stands, back to the threat (the Toad), or `scared` (her `Terrified`).
4. **Clear:** no hostile near for `clearT` 2 s -> he stands, looks about, and comes a little toward Grumbo (`approach`).
5. **Thanks:** if the episode ended in a KILL, the villager nearest Grumbo thanks him -- usually a bow / clap / nod and a happy blip (no words);
   sometimes (`sayP`) one short line: "Thank you." / "Grumbo... thank you." / "It's gone?"

**Probe:** `node tools/vfearcheck.mjs` -- spawns a hostile (the husk) near the Sunwell in the shipped page, checks every villager reached cover or
crouched, kills it, checks they recover and someone thanks him; renders the cowering and the thank-you to images/characters/.

## DONE WHEN
- [x] (m2809) Every villager in the Sunwell startles, runs to cover (or crouches) when a hostile spawns within 20 m -- the probe, with numbers
- [x] (m2809) They come out when it is dead, and the nearest thanks him (short, sincere, mostly wordless) -- the probe
- [x] (m2809) Renders of the cowering and the thank-you (`images/characters/villager_fear_cower.jpg`, `villager_fear_thanks.jpg`)
- [ ] **Colin's sign-off on his phone**
