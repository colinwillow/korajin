# CAPACITOR -- notes for when Korajin is wrapped as the native iPhone app

Korajin will ship on iPhone through **Capacitor**. This repo stays a no-build web page: nothing here installs or imports Capacitor. The page checks
for it at RUNTIME and uses it when it is there, so these things light up by themselves once the app is wrapped.

## Plugins to add at packaging time
| plugin | what uses it | how the page finds it |
|---|---|---|
| `@capacitor/haptics` | `haptic(kind)` in `index.html` (INTERACT.md, "ONE HAPTICS LAYER") -- every kit piece's rumble, the chest's GET, ratchet clicks; combat hits and landings as they adopt it | `window.Capacitor.Plugins.Haptics` |

`npm install @capacitor/haptics && npx cap sync` in the APP project (not this repo).

## The haptic kinds and their native calls
| kind | native (Capacitor) | browser fallback | shake / thump |
|---|---|---|---|
| tick | `selectionStart` + `selectionChanged` + `selectionEnd` | 1 iOS switch tick / vibrate 8 ms | none |
| light | `impact({ style: 'LIGHT' })` | 1 tick / 15 ms | small |
| medium | `impact({ style: 'MEDIUM' })` | 1 tick / 26 ms | medium |
| heavy | `impact({ style: 'HEAVY' })` | 2 ticks / 45 ms | big |
| thud | `impact({ style: 'HEAVY' })` | 2 ticks / 60 ms | biggest |
| success | `notification({ type: 'SUCCESS' })` | 2 ticks / [20, 60, 30] | none |
| warning | `notification({ type: 'WARNING' })` | 2 ticks / [40, 80, 40] | small |
| error | `notification({ type: 'ERROR' })` | 3 ticks / [50, 60, 50, 60, 50] | small |

TOOLS > LOOK > HAPTICS switches the touch half off in both (the shake + thump stay). Verified with a stand-in `window.Capacitor` (m2635 in NOTES):
the right calls go out per kind, and with it absent the browser path takes over.
