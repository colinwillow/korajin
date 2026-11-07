import fs from 'node:fs'; import { createRequire } from 'node:module';
const pw = createRequire(import.meta.url)('playwright');
const tag = t => `<i class="tg">${t}</i>`;
const row = (t, sub, tags = [], on) => `<div class="r${on ? ' on' : ''}"><b>${t}</b>${sub ? `<small>${sub}</small>` : ''}<span>${tags.map(tag).join('')}</span></div>`;
const fold = (t, n, open, inner = '') => `<div class="f${open ? ' open' : ''}"><div class="fh"><em>${open ? '▾' : '▸'}</em>${t}<u>${n}</u></div>${open ? `<div class="fb">${inner}</div>` : ''}</div>`;
const sub = t => `<div class="sh">${t}</div>`;
const chips = (L, cur) => `<div class="chips">${L.map(c => `<i class="${c === cur ? 'cur' : ''}">${c}</i>`).join('')}</div>`;
const spawn = `<div class="ph"><div class="hd">SPAWN<span>CLEAR ALL</span></div>
${chips(['ALL', 'PROLOGUE', 'FOREST TEMPLE', 'DESERT', 'HOLLOWS', 'SKY'], 'ALL')}
<div class="rec"><div class="sh">RECENT</div><div class="rr"><i>Husk Swordsman</i><i>Sword Saint</i><i>Stone Guardian</i><i>Mammoth</i><i>Turret</i></div></div>
${fold('COMPANIONS', 2)}${fold('VILLAGERS', 1)}
${fold('ENEMIES', 12, 1, sub('FODDER') + row('Husk Soldier', 'basic melee', ['FOREST TEMPLE']) + row('Husk Archer', 'ranged', ['FOREST TEMPLE']) + sub('TIER 2') + row('Husk Swordsman', 'crested -- turtles a mash', ['FOREST TEMPLE'], 1) + row('Husk Flanker', 'circles, strikes fast', ['FOREST TEMPLE']) + sub('TIER 3') + row('Bulwark', 'the shield wall', ['FOREST TEMPLE']) + row('Hollow Monk', 'caster', ['HOLLOWS']) + row('…5 more', '') + sub('SWARM') + row('Horde', '+6 a tap', ['ANY']))}
${fold('BOSSES & GUARDIANS', 8)}${fold('CREATURES & MOUNTS', 5)}${fold('TRAINING', 7)}${fold('LEGACY (Zap / Weirdport)', 8)}
</div>`;
const places = `<div class="ph"><div class="hd">DEV PLACES<span>GOD</span></div>
<div class="rec"><div class="sh">RECENT</div><div class="rr"><i>Room C — Thornback</i><i>The Garden</i><i>Combat Lab</i></div></div>
${fold('HERE', 3)}
<div class="grp">KORAJIN</div>
${fold('PROLOGUE', 1)}${fold('TRAINING', 4)}
${fold('FOREST TEMPLE', 9, 1, row('FULL RUN', 'from the knoll') + row('The Well', 'hub') + row('A  Acrobatic Hall', '', [], 0) + row('B  Root Gallery', '') + row('C  Root Heart', 'Thornback', [], 1) + row('D  Fall Gallery', '') + row('E  Sunken Court', '') + row('F  The Shrine', '') + row('The Seal + the stair', 'all six shards'))}
${fold('WORLD', 13)}
<div class="grp">ELSEWHERE</div>
${fold('SANDBOXES', 14)}${fold('LEGACY', 3)}
<div class="gd"><i>FLY: OFF</i><i class="w">PLAY MODE</i></div></div>`;
const html = `<html><head><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Bungee&display=block" rel="stylesheet"><style>
body{margin:0;background:#16130f;color:#f4e9d8;font-family:'Barlow Condensed';padding:20px 24px;display:inline-block}
h1{font-family:Bungee;font-size:26px;margin:0;color:#46e0ff}h2{font-size:16px;font-weight:500;opacity:.75;margin:2px 0 14px}
.row{display:flex;gap:26px}.scr{position:relative;width:390px;height:844px;border-radius:26px;overflow:hidden;background:url(bg.jpg) center/cover}
.scr:before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.35)}
.ph{position:absolute;left:14px;right:14px;top:46px;bottom:150px;background:#0b0d12ee;border:2px solid #46e0ff;border-radius:14px;padding:10px;overflow:hidden}
.hd{font-family:Bungee;font-size:18px;color:#46e0ff;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.hd span{font-family:'Barlow Condensed';font-weight:700;font-size:13px;letter-spacing:.1em;border:1px solid #ff4d6d;color:#ff4d6d;padding:4px 10px;border-radius:8px}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}.chips i{font-style:normal;font-size:12px;font-weight:700;letter-spacing:.08em;padding:4px 9px;border-radius:12px;border:1px solid #46e0ff66;color:#9fd8ea}.chips i.cur{background:#46e0ff;color:#0b0d12}
.rec{margin-bottom:6px}.rr{display:flex;gap:6px;overflow:hidden}.rr i{font-style:normal;white-space:nowrap;font-size:13px;font-weight:600;padding:6px 10px;border-radius:8px;background:#1b2330;border:1px solid #46e0ff44}
.sh{font-size:11px;font-weight:700;letter-spacing:.2em;color:#9fb4cc;margin:6px 2px 4px}
.grp{font-family:Bungee;font-size:12px;color:#ffc247;margin:10px 2px 4px;letter-spacing:.06em}
.f{border-top:1px solid #46e0ff22}.fh{display:flex;align-items:center;gap:8px;font-weight:700;font-size:17px;letter-spacing:.05em;padding:10px 4px;min-height:24px}.fh em{font-style:normal;color:#46e0ff;width:12px}.fh u{text-decoration:none;margin-left:auto;font-size:12px;opacity:.6}
.f.open>.fh{color:#46e0ff}.fb{padding:0 0 6px 18px}
.r{display:flex;align-items:center;gap:8px;padding:8px 8px;margin:3px 0;border-radius:8px;background:#141a24;border:1px solid #46e0ff33}.r b{font-size:15px;font-weight:700}.r small{font-size:12px;color:#9fb4cc}.r span{margin-left:auto;display:flex;gap:4px}
.r.on{background:#46e0ff26;border-color:#46e0ff}.tg{font-style:normal;font-size:10px;font-weight:700;letter-spacing:.08em;color:#7affd8;border:1px solid #7affd866;border-radius:6px;padding:1px 5px}
.gd{position:absolute;left:0;right:0;bottom:0;padding:10px;background:#0b0d12;box-shadow:0 -10px 14px #0b0d12;display:flex;gap:8px}.gd i{flex:1;text-align:center;font-style:normal;font-weight:700;padding:9px;border-radius:8px;border:1px solid #46e0ff66}.gd i.w{border-color:#ff4d6d;color:#ff4d6d}
.pads{position:absolute;bottom:22px;width:110px;height:110px;border-radius:50%;border:2px solid #f4e9d855}.pads.pl{left:22px}.pads.pr{right:22px}
.cap{width:390px;font-size:14px;opacity:.8;margin-top:8px;line-height:1.3}
</style></head><body><h1>DEBUG MENUS -- MOCK</h1><h2>one SPAWN menu and one DEV PLACES menu, both folders built from one table; every row declares a category and a home tag</h2>
<div class="row"><div><div class="scr">${spawn}<div class="pads pl"></div><div class="pads pr"></div></div><div class="cap">SPAWN: tag chips filter by where a thing belongs (the "by temple" view). RECENT = last 5 used. ENEMIES opened: grouped by tier. A live spawn is lit (tap again removes it).</div></div>
<div><div class="scr">${places}<div class="pads pl"></div><div class="pads pr"></div></div><div class="cap">DEV PLACES: RECENT, then HERE (this zone's spots), KORAJIN by story order, then SANDBOXES and LEGACY. The current place is lit. Folders remember open/closed.</div></div></div></body></html>`;
fs.writeFileSync('dm.html', html);
const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 900 } });
await p.goto('file://' + process.cwd() + '/dm.html'); await p.waitForTimeout(2500); await p.evaluate(() => document.fonts.ready);
await (await p.$('body')).screenshot({ path: '/home/user/korajin/images/plan/debug_menu_mock.png' }); await b.close();
