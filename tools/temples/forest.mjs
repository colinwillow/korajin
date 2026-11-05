// THE FOREST TEMPLE on the TEMPLE PLANNING SHEET (TEMPLE_TEMPLATE.md). `npm run templesheet forest` renders docs/temples/forest_sheet.png.
// Plan metres, the game's frame (the hub at 0,0; +z = north, toward the entry hall; +x = east on the sheet). One row per room; one row per link.
// shape: ['rect', cx, cz, w, d] | ['circle', cx, cz, r] | ['hex', cx, cz, r] | ['star', cx, cz, r]. y = the floor (m), h = the wall.
export default {
  id: 'forest', title: 'FOREST TEMPLE', accent: '#2f6b22', paper: '#f3f0e2', grid: 4,
  idea: 'A mandala you spiral DOWN into: THE WELL is the hub. Six chambers (A-F) on a hexagon round it, mirrored W/E, on the N-S axis. Each chamber pays ONE JINRA SHARD; six shards light the seal on the well floor and open the stair to the boss beneath it.',
  item: 'THE VINE WHIP (from C, the mid-boss) -- D, E, F need it, and each is WHIP-ONLY by a stated rule (VINEWHIP.md)',
  goal: '6 JINRA SHARDS -> the SEAL on the well floor -> the stair down -> THE HOLLOW BANYAN',
  flow: 'Hall -> HUB -> A (key) -> B -> crack -> C (WHIP + teach) -> zip home -> D | E | F in any order -> 6 shards -> SEAL -> X (boss)',
  levels: [['L3', 24], ['L2', 12], ['L1', 0], ['L0', -12], ['B1', -26]],
  rooms: [
    { id: '0', name: 'ENTRY HALL', types: ['rest'], shape: ['rect', 0, 31, 12, 16], y: 24, h: 6,
      tt: 'arrive: the door ritual drops him in; the first sight of the well and its six doors', reward: 'checkpoint, the map', enemies: '--', act: 'door ritual, map pillar, pots', rule: '--' },
    { id: 'H', name: 'THE WELL (HUB)', types: ['hub'], shape: ['circle', 0, 0, 15], y: 0, h: 24, pool: 1, seal: 1,
      tt: 'the spine: ledges spiral L3 -> L0; a door to every chamber; the waterfall from the north lip; the SEAL (6 sockets) under its pool', reward: '--', enemies: '--', act: '6 shard sockets, door x6 (heavy), the waterfall, zip anchors (shortcuts)', rule: '--' },
    { id: 'A', name: 'ACROBATIC HALL', types: ['acro', 'battle'], shape: ['rect', 0, -42, 22, 30], y: 0, h: 14, built: 1,
      tt: 'TEST what he walked in with: wall runs, bars, the rope, the slab; archers on the gallery, a scrap at the top', reward: 'SMALL KEY + SHARD I', enemies: 'archers, samurai x2', act: 'button, chest (the key), door, high bars, rope', rule: '-- (pre-whip)' },
    { id: 'B', name: 'ROOT GALLERY', types: ['puzzle'], shape: ['rect', -46, -20, 24, 18], y: 0, h: 10,
      tt: 'root-bound blocks onto plates; arrow switches high up; reliefs whose eyes give the order; ends at a floor CRACK', reward: 'SHARD II + the crack down', enemies: 'jackals (light)', act: 'door (key), push blocks, plate x3, button (arrow switches), pots, chest', rule: '-- (pre-whip)' },
    { id: 'C', name: 'ROOT HEART + NURSERY', types: ['battle', 'rest'], shape: ['star', -50, 30, 14], y: -12, h: 10,
      tt: 'MID-BOSS the Thornback (it surfaces under you); then the walled nursery TEACHES the whip: no way out but swinging', reward: 'THE VINE WHIP + SHARD III', enemies: 'THORNBACK (mid-boss)', act: 'chest (THE WHIP), knots, zip anchor home, drawer (the nursery)', rule: '4: knots over a pit, sheer walls > 17 m' },
    { id: 'D', name: 'FALL GALLERY', types: ['puzzle'], shape: ['rect', 0, 50, 22, 12], y: 12, h: 8,
      tt: 'TWIST: behind the waterfall a ROOT DAM holds back the channel -- lash it and PULL it down: the fall diverts and the well pool drains (the seal shows)', reward: 'SHARD IV + the pool drains', enemies: 'osari bows on the lip', act: 'the dam (a whip pull), crank (the sluice), chest', rule: '5: a pull no move replaces' },
    { id: 'E', name: 'SUNKEN COURT', types: ['acro', 'battle'], shape: ['rect', 46, 22, 24, 46], y: 0, h: 24,
      tt: 'TEST under fire: a Kailasa court cut into the rock; shield lines (rip them), archers yanked off ledges; cross the 46 m court on a knot gantry under a thorn canopy', reward: 'SHARD V', enemies: 'shield bearers, archers, dogs', act: 'knot gantry, lever x2 (9 m up: whip), crates onto plate x3, chest', rule: '1 + 2: a 46 m span, no walls, thorn canopy' },
    { id: 'F', name: 'THE SHRINE', types: ['puzzle', 'acro', 'battle'], shape: ['hex', 44, -26, 12], y: 0, h: 22,
      tt: 'a hollow core with smooth undercut walls: zip up its anchors, pull the counterweights to raise the floors; taking the shard wakes the STATUES (gauntlet out)', reward: 'SHARD VI', enemies: 'stone guardians (statues wake)', act: 'zip anchors, counterweights (whip pull), crank (the floors), chest', rule: '3: 18 m ledges on overhangs' },
    { id: 'X', name: 'THE HOLLOW BANYAN', types: ['boss'], shape: ['circle', 0, 0, 13], y: -26, h: 12,
      tt: 'BOSS with the whip: pull its root-hands flat, run up the arm, lash the armour off its heart; phase 2 swing the hanging knots; phase 3 the flood', reward: 'THE JINRA STONE + the stolen one', enemies: 'the Hollow Banyan', act: 'door (the 6-shard seal), knots, geyser out', rule: '4 + 5 in the fight' },
  ],
  secrets: [
    ['S1', 'behind the waterfall, before D chokes it', 2, 38, 12], ['S2', 'atop A\'s cut opening (a long jump off the balcony)', -8, -56, 14], ['S3', 'the bottom of E\'s channel once drained', 50, 6, -2] ],
  links: [
    ['0', 'H', 'open', 'the lip'], ['H', 'A', 'open', ''], ['A', 'H', 'short', 'zip down'], ['H', 'B', 'key', 'SMALL KEY'], ['B', 'C', 'oneway', 'the crack'],
    ['C', 'H', 'short', 'zip: foot -> L3'], ['H', 'D', 'whip', 'whip gate'], ['H', 'E', 'whip', 'whip gate'], ['H', 'F', 'whip', 'whip gate'],
    ['F', '0', 'short', 'rock bridge'], ['H', 'X', 'seal', '6 SHARDS'] ],
};
