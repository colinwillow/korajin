# ONLINE -- co-op and versus (a sandbox, whole-piece rule)

His words (Oct 30 2026): *"Co-op or even versus. My first game, Robits, had a server -- a separate repository dedicated to it, and it worked
pretty well, even with the world made of bending geometry rendering in real time on all devices. It took a lot of back-and-forth to get the
players to have the same directions, same skins, same animations, and the world updating in real time. Start with one sandbox, a little arena:
another player on another device logs in, sees the same things, and you can fight -- knock each other around, no damage at first."*

## What Robits taught (read from `colinwillow/robits` + `colinwillow/robits-server`)
- **The server is a ~250-line room relay** (Node + `ws`, on Render's free tier: `wss://robits-server.onrender.com`). It owns rooms, relays
  JSON packets to the others in the room, picks a HOST (first in; re-picked when the host leaves), and knows nothing about the game. Free tier
  sleeps after 15 min idle: the first connect waits ~1 min while it wakes.
- **The client:** ~10-15 Hz state packets (a slim position packet between full ones), the remote drawn by DEAD RECKONING (velocity from the
  last two snapshots, decaying), one-shot FX events, host-authoritative enemies. Most of the back-and-forth was keeping the remote's skin,
  facing and animation in agreement with what the sender was doing -- the remote ran its own animation guesses from the state.

## The choice here: stream the FINISHED POSE, not the state
KORAJIN's body is a stack of procedural layers (ledge IK, wall-run tilt, flips about the hips, the katana's one-hand hang, springs). Rebuilding
those on the other phone from a "state" would be the Robits back-and-forth times ten. So each phone sends the DRAWN root (position + rotation)
and EVERY bone's rotation (int16, base64, ~1 KB a packet at 15 Hz), and the other phone sets a puppet's bones from it, interpolated between the
two snapshots that bracket ~130 ms ago. Whatever his phone draws, the other phone draws -- now and for every move added later.

## Stages
- [x] **1. See each other (m1843):** TOOLS > ONLINE: JOIN A ROOM (a code to share) or `?room=CODE`; the relay is his Robits server under `KJ-`
  room codes; the puppet is a clone of the hero model, posed from the stream, a P2 tag over it; hidden when the other is in a different zone.
  Chip: room, state, players, packets/s.
- [ ] 2. **Their gear and their FX:** the weapon in their hand (slot key in the packet), blade fire / trail, sounds, slam bursts as events.
- [ ] 3. **Knock each other around (no damage):** your strike's sweep tests their puppet; a HIT event goes to them and THEIR phone applies the
  knock to their own body (each phone owns its own body -- no host needed for two players).
- [ ] 4. **The arena:** a small duel sandbox both spawn into; versus with KO / respawn; then co-op against the arena's enemies (host-run).
- [ ] 5. **Its own server namespace:** a `game` field in `robits-server` (or a fork) so KORAJIN rooms never meet Robits rooms in quick match /
  the room list (needs push access to that repo).
- [ ] 6. Lag polish: clock offset instead of receive time, extrapolation on a dropped packet, a slim root-only packet between pose packets.

## DONE WHEN
- [ ] Two phones in one room see each other move, animate and use every move, smoothly, on mobile data.
- [ ] They can knock each other around, and both phones agree it happened.
- [ ] A versus duel and a co-op fight both play start to finish.
- [ ] **His sign-off, on two phones.**
