import fs from 'node:fs'; import { createRequire } from 'node:module';
const pw = createRequire(import.meta.url)('playwright');
const FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Shippori+Mincho:wght@500;600;800&family=Yuji+Syuku&family=Cinzel:wght@500;700;800&family=Kaisei+Decol:wght@500;700&family=Zen+Antique&family=Dela+Gothic+One&family=Permanent+Marker&family=Patrick+Hand&family=Bangers&family=Comic+Neue:wght@700&family=Fredoka:wght@500;600;700&display=block';
const INK = '#0b0d12', CREAM = '#f4e9d8', RED = '#c8242c', MINT = '#7affd8', DEEP = '#1f8a74';
const MIN = `font-family:'Shippori Mincho';font-weight:600`;
const PROLOGUE_SH = '0 0 10px rgba(8,4,18,.9), 0 2px 3px rgba(0,0,0,.7)';
const jw = w => `<span style="color:#e8fff8;text-shadow:0 0 10px ${MINT},0 0 22px rgba(122,255,216,.55),0 2px 2px #0009">${w}</span>`;

/* the reference: the prologue's tale text exactly as REELFONT MINCHO draws it */
const ref = bg => ({ id: 'REF', tag: 'THE PROLOGUE TODAY', sub: 'TALE FONT: MINCHO (Shippori Mincho 600, ink reveal)', bg, dim: .55, ref: 1,
  html: `<div class="k" style="left:18px;right:18px;top:160px;text-align:center;${MIN};letter-spacing:.03em;color:#fbf3e2;text-shadow:${PROLOGUE_SH};font-size:21px;line-height:1.35">
  where rivers shimmered<br>with the light of ${jw('Jinra')}…</div>
  <div class="k" style="left:0;right:0;top:300px;text-align:center;${MIN};color:#fff8ea;text-shadow:${PROLOGUE_SH};font-size:52px;line-height:1;letter-spacing:.06em"><div style="font-size:.36em;margin-bottom:.15em">was</div>Grumbo.</div>` });

const LINE = 'I heard there were once six keys that kept this temple safe.';
const tail = (col, x = 30, rim = INK, rw = 0) => `<svg width="34" height="22" style="position:absolute;left:${x}px;bottom:-19px;overflow:visible"><path d="M2,-2 L6,20 L26,-2" fill="${col}" stroke="${rim}" stroke-width="${rw}" stroke-linejoin="round"/>${rw ? `<path d="M0,-${rw} L30,-${rw}" stroke="${col}" stroke-width="${rw * 2 + 1}"/>` : ''}</svg>`;
const SPEECH = { title: 'SPEECH', sub: 'someone in the world talking -- by the speaker, types on, tap to go on. The line: a cryptic temple hint.', bg: 'ftB_far.jpg', pos: 'left center', panels: [
  ref('ftX_wide.jpg'),
  { id: 'S1', tag: 'COMIC', pairs: '@today\'s in-game balloon (#talk.comic)', sub: 'Patrick Hand + Bangers name, white balloon, printed ink shadow', html: `
   <div class="k bub" style="left:62px;top:132px;width:184px;box-sizing:border-box;background:#fff;color:${INK};border:3.5px solid ${INK};border-radius:26px/22px;box-shadow:4px 5px 0 ${INK};padding:9px 14px 16px">
   <div style="font-family:Bangers;font-size:15px;letter-spacing:.08em;color:#ff4d6d">STONE WARDEN</div>
   <div style="font-family:'Patrick Hand';font-size:20px;line-height:1.1">${LINE}</div>
   <svg width="30" height="26" style="position:absolute;left:14px;bottom:-24px;overflow:visible"><path d="M4,-3 L-2,22 L22,-3" fill="#fff" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" transform="skewX(10)"/><rect x="2" y="-7" width="20" height="6" fill="#fff"/></svg></div>` },
  { id: 'S2', tag: 'PLAYFUL', pairs: '@new -- no prologue twin', sub: 'Fredoka, a soft round bubble in the title cream, red name tab, bounces in', html: `
   <div class="k" style="left:60px;top:140px;width:186px;box-sizing:border-box;background:${CREAM};color:#2a1a14;border-radius:22px;box-shadow:0 4px 0 #b9a68a,0 8px 18px #0008;padding:16px 14px 13px">
   <div style="position:absolute;left:12px;top:-11px;font-family:Fredoka;font-weight:700;font-size:12px;letter-spacing:.06em;color:#fff;background:${RED};padding:3px 10px;border-radius:10px">Stone Warden</div>
   <div style="font-family:Fredoka;font-weight:500;font-size:17px;line-height:1.22">${LINE}</div>
   <svg width="30" height="20" style="position:absolute;left:10px;bottom:-15px"><path d="M4,0 Q2,14 0,19 Q14,10 22,0 Z" fill="${CREAM}"/></svg></div>` },
  { id: 'S3', tag: 'STORYBOOK', pairs: 'STORY', sub: 'Kaisei Decol on parchment, a deckled edge, ink-red name', html: `
   <div class="k" style="left:60px;top:132px;width:188px;box-sizing:border-box;color:#3a2516;padding:14px 16px 14px;background:radial-gradient(ellipse at 40% 30%,#fbf1dc,#eedcb8 70%,#d9c094);border-radius:6px 14px 8px 12px/12px 6px 14px 8px;box-shadow:0 0 0 1.5px #8a6a40,0 6px 16px #000a;filter:url(#rough)">
   <div style="font-family:'Kaisei Decol';font-weight:700;font-size:12px;letter-spacing:.14em;color:${RED};margin-bottom:3px">~ STONE WARDEN ~</div>
   <div style="font-family:'Kaisei Decol';font-weight:500;font-size:16.5px;line-height:1.3">${LINE}</div>
   <svg width="26" height="18" style="position:absolute;left:12px;bottom:-15px"><path d="M2,0 L4,17 L20,0 Z" fill="#e6d2aa" stroke="#8a6a40" stroke-width="1.5"/><rect x="1" y="-2" width="21" height="3" fill="#e6d2aa"/></svg></div>` },
  { id: 'S4', tag: 'INK', pairs: 'MINCHO', sub: 'Shippori Mincho floating, no box -- the tale\'s own lettering, a red name seal, ink reveal', html: `
   <div class="k" style="left:66px;top:140px;width:180px">
   <div style="display:inline-block;font-family:'Barlow Condensed';font-weight:700;font-size:11px;letter-spacing:.22em;color:#fff6e6;background:${RED};padding:2px 7px 1px;border-radius:2px;transform:rotate(-2deg)">STONE WARDEN</div>
   <div style="${MIN};font-size:18px;line-height:1.28;letter-spacing:.03em;color:#fbf3e2;text-shadow:${PROLOGUE_SH},0 0 2px #000;margin-top:5px">${LINE.replace('six keys', 'six ' + jw('keys'))}</div>
   <svg width="40" height="22" style="margin:4px 0 0 2px"><path d="M30,2 Q12,6 2,20" fill="none" stroke="#fbf3e2" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></svg></div>` },
  { id: 'S5', tag: 'ELEGANT', pairs: 'ANTIQUE', sub: 'Zen Antique on the HUD\'s ink glass, cream hairline rim, a thin pointer', html: `
   <div class="k" style="left:60px;top:136px;width:188px;box-sizing:border-box;background:rgba(7,8,12,.72);backdrop-filter:blur(3px);border:1px solid rgba(244,233,216,.55);border-radius:3px;padding:12px 14px 13px;box-shadow:0 8px 22px #000a">
   <div style="font-family:'Zen Antique';font-size:11px;letter-spacing:.32em;color:#e6c98f">STONE WARDEN</div>
   <div style="width:34px;height:1px;background:#e6c98f;margin:5px 0 7px;opacity:.8"></div>
   <div style="font-family:'Zen Antique';font-size:16.5px;line-height:1.36;letter-spacing:.02em;color:${CREAM}">${LINE}</div>
   <svg width="40" height="26" style="position:absolute;left:-1px;bottom:-25px"><path d="M14,0 L2,24" stroke="rgba(244,233,216,.7)" stroke-width="1"/><circle cx="2" cy="24" r="2" fill="#e6c98f"/></svg></div>` },
] };

const SIGNS = { title: 'LORE / SIGNS', sub: 'words carved INTO the world (a wall, a plinth, a door) -- read by walking up to them, they light as he nears', bg: 'ftX_wall2.jpg', pos: 'center', panels: [
  ref('ftX_wide.jpg'),
  { id: 'G1', tag: 'JINRA-LIT CUT', pairs: 'MINCHO', sub: 'Shippori Mincho cut into the stone, mint Jinra in the grooves', html: `
   <div class="k plate" style="left:34px;top:150px;width:200px;height:170px;transform:perspective(520px) rotateY(16deg) rotateX(3deg)">
   <div style="${MIN};font-weight:800;font-size:23px;line-height:1.2;letter-spacing:.05em;text-align:center;color:#d8fff3;text-shadow:0 0 6px ${MINT},0 0 16px ${DEEP},0 -1px 0 #000,0 1px 0 #ffffff30">Six keys<br>kept the door.<br>Five sleep.</div>
   <div style="font-family:'Barlow Condensed';font-weight:600;font-size:10px;letter-spacing:.34em;color:#b9c9bf;opacity:.65;margin-top:8px;text-align:center">THE FOREST TEMPLE</div></div>` },
  { id: 'G2', tag: 'CHISELLED CAPITALS', pairs: 'CARVED', sub: 'Cinzel, cut deep: dark inner shadow, light lower lip -- no glow until lit', html: `
   <div class="k plate" style="left:34px;top:150px;width:200px;height:170px;transform:perspective(520px) rotateY(16deg) rotateX(3deg)">
   <div style="font-family:Cinzel;font-weight:700;font-size:20px;line-height:1.28;letter-spacing:.12em;text-align:center;color:#57534a;text-shadow:0 1.5px 0 #c9c3b2,0 -1px 0 #050404,0 -2px 3px #000">SIX KEYS<br>KEPT THE DOOR<br>FIVE SLEEP</div>
   <div style="width:110px;height:2px;margin:10px auto 0;background:#2b2925;box-shadow:0 1px 0 #8f8a7d"></div></div>` },
  { id: 'G3', tag: 'WOODEN PLAQUE', pairs: 'ANTIQUE', sub: 'Zen Antique burned into an old board under a glyph band, pegged to the wall', html: `
   <div class="k" style="left:40px;top:160px;width:196px;padding:12px 12px 14px;transform:perspective(520px) rotateY(12deg) rotate(-2deg);background:repeating-linear-gradient(176deg,#7a4e2c 0 5px,#6c4326 5px 9px,#835532 9px 15px);border-radius:5px;box-shadow:inset 0 0 0 2px #3b2312,inset 0 0 16px #0007,0 8px 16px #000b">
   <div style="position:absolute;left:8px;top:8px;width:7px;height:7px;border-radius:50%;background:#2a170c;box-shadow:0 1px 0 #a87a50"></div><div style="position:absolute;right:8px;top:8px;width:7px;height:7px;border-radius:50%;background:#2a170c;box-shadow:0 1px 0 #a87a50"></div>
   <div style="text-align:center;font-family:'Zen Antique';font-size:13px;letter-spacing:.5em;color:#2a160a;opacity:.75;text-shadow:0 1px 0 #a87a5080">✦ ◈ ✦ ◈ ✦</div>
   <div style="font-family:'Zen Antique';font-size:16px;line-height:1.35;text-align:center;color:#26130a;text-shadow:0 1px 0 #b08458,0 0 2px #1a0c04">Six keys kept the door.<br>Five sleep.<br>One wakes for the light.</div></div>` },
  { id: 'G4', tag: 'PAINTED TALISMAN', pairs: 'BRUSH', sub: 'Yuji Syuku brushed on a paper charm, a red seal -- reads as left by someone', html: `
   <div class="k" style="left:78px;top:118px;width:112px;padding:14px 10px 18px;transform:perspective(520px) rotateY(10deg) rotate(3deg);background:linear-gradient(180deg,#f3ead2,#e7dab8);box-shadow:0 6px 14px #000c;clip-path:polygon(0 0,100% 0,100% 92%,88% 100%,72% 94%,52% 100%,32% 93%,14% 100%,0 94%)">
   <div style="position:absolute;left:50%;top:-2px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#555;box-shadow:inset 0 1px 1px #aaa"></div>
   <div style="font-family:'Yuji Syuku';font-size:21px;line-height:1.32;text-align:center;color:#1a1210">Six keys<br>kept<br>the door.<br>Five<br>sleep.</div>
   <div style="width:30px;height:30px;margin:8px auto 0;border:2.5px solid ${RED};border-radius:4px;color:${RED};font-family:'Yuji Syuku';font-size:17px;line-height:26px;text-align:center;transform:rotate(-6deg)">鍵</div></div>` },
] };

const brush = col => `<svg viewBox="0 0 400 60" preserveAspectRatio="none" style="position:absolute;left:-7%;top:4%;width:114%;height:92%;z-index:-1"><path d="M6,38 C40,14 110,10 200,16 C290,22 350,12 394,26 C380,44 300,52 200,48 C110,44 50,54 10,48 Z" fill="${col}" opacity=".93"/><path d="M30,47 C120,40 260,44 380,34" stroke="${col}" stroke-width="3" fill="none" opacity=".5"/></svg>`;
const TITLES = { title: 'BIG MOMENT', sub: 'the title card: a boss walks in, a seal opens, a temple is cleared -- big, centred, ~2 s, never over the pads', bg: 'ft_hub_seal.jpg', pos: 'center', minis: 1, panels: [
  ref('ftX_wide.jpg'),
  { id: 'T1', tag: 'RED STROKE', pairs: 'MINCHO', sub: 'Shippori Mincho on a red brush swipe, cream subtitle', main: ['THE SEAL OPENS', 'THE FOREST TEMPLE'],
    css: (a, b, big) => `<div style="position:relative;display:inline-block;padding:${big ? '12px 12px 14px' : '3px 12px 4px'}">${brush(RED)}<div style="${MIN};font-weight:800;font-size:${big ? 29 : 14}px;letter-spacing:.04em;color:#fff6e6;line-height:1;white-space:${big ? 'normal' : 'nowrap'}">${big ? a.replace('SEAL ', 'SEAL<br>') : a}</div></div><div style="font-family:'Barlow Condensed';font-weight:600;font-size:${big ? 12 : 8}px;letter-spacing:.34em;color:${CREAM};margin-top:${big ? 10 : 4}px;text-shadow:0 1px 3px #000">${b}</div>` },
  { id: 'T2', tag: 'GILDED CAPITALS', pairs: 'CARVED', sub: 'Cinzel in warm gold, wide tracking, hairline rules -- stately, rises in', main: ['THE SEAL OPENS', 'THE FOREST TEMPLE'],
    css: (a, b, big) => `<div style="width:${big ? 150 : 70}px;height:1px;margin:0 auto ${big ? 10 : 4}px;background:linear-gradient(90deg,transparent,#ffe2a0,transparent)"></div><div style="font-family:Cinzel;font-weight:700;font-size:${big ? 27 : 12.5}px;letter-spacing:.12em;line-height:1.05;white-space:${big ? 'normal' : 'nowrap'};color:#ffe6b0;text-shadow:0 1px 0 #6b4a1a,0 2px 0 #3a250c,0 0 18px rgba(0,0,0,.8),0 0 30px rgba(255,200,120,.25)">${a}</div><div style="font-family:Cinzel;font-weight:500;font-size:${big ? 11 : 7}px;letter-spacing:.42em;color:#f3e1bb;margin-top:${big ? 8 : 3}px;text-shadow:0 1px 3px #000">${b}</div><div style="width:${big ? 150 : 70}px;height:1px;margin:${big ? 10 : 4}px auto 0;background:linear-gradient(90deg,transparent,#ffe2a0,transparent)"></div>` },
  { id: 'T3', tag: 'BRUSH + SEAL', pairs: 'BRUSH', sub: 'Yuji Syuku, huge and wet, ink flecks, a red hanko stamped beside it', main: ['The Seal Opens', 'THE FOREST TEMPLE'],
    css: (a, b, big) => `<div style="position:relative;display:inline-block"><div style="font-family:'Yuji Syuku';font-size:${big ? 40 : 17}px;line-height:1.05;white-space:${big ? 'normal' : 'nowrap'};color:#fffaf0;text-shadow:0 0 14px rgba(10,4,16,.95),0 3px 2px #000c">${a}</div><div style="position:absolute;right:${big ? 0 : -9}px;top:${big ? -28 : -7}px;width:${big ? 28 : 13}px;height:${big ? 28 : 13}px;border:${big ? 2.5 : 1.2}px solid ${RED};background:rgba(200,36,44,.12);border-radius:3px;color:${RED};font-family:'Yuji Syuku';font-size:${big ? 17 : 8}px;line-height:${big ? 24 : 11}px;transform:rotate(8deg);text-shadow:none">開</div></div><div style="font-family:'Barlow Condensed';font-weight:600;font-size:${big ? 12 : 8}px;letter-spacing:.34em;color:${CREAM};margin-top:${big ? 8 : 3}px;text-shadow:0 1px 3px #000">${b}</div>` },
  { id: 'T4', tag: 'POSTER', pairs: 'POSTER', sub: 'Dela Gothic One, heavy and loud, a hard offset shadow, pops in -- the arcade read', main: ['THE SEAL OPENS', 'THE FOREST TEMPLE'],
    css: (a, b, big) => `<div style="font-family:'Dela Gothic One';font-size:${big ? 32 : 13.5}px;line-height:1;letter-spacing:.01em;white-space:${big ? 'normal' : 'nowrap'};color:#fff;text-shadow:${big ? '3px 3px 0 ' + RED + ',6px 6px 0 #2a1030,0 0 16px rgba(20,8,30,.7)' : '1.5px 1.5px 0 ' + RED + ',3px 3px 0 #2a1030'};transform:rotate(-3deg)">${a}</div><div style="display:inline-block;margin-top:${big ? 10 : 4}px;font-family:'Barlow Condensed';font-weight:700;font-size:${big ? 12 : 7.5}px;letter-spacing:.3em;color:${INK};background:${CREAM};padding:${big ? '2px 8px' : '1px 4px'};transform:rotate(-3deg)">${b}</div>` },
] };
TITLES.minisText = [['THE WATCHER BELOW', 'GUARDIAN OF THE DEEP', 'The Watcher Below'], ['TEMPLE CLEARED', 'SIX OF SIX KEYS', 'Temple Cleared']];

const HINTS = { title: 'HINT', sub: 'rare -- only when he is stuck. Small, low in the safe area, fades in, gone in 4 s. A nudge, not an instruction.', bg: 'ft_sock_lit.jpg', pos: 'center', panels: [
  ref('ftX_wide.jpg'),
  { id: 'H1', tag: 'WHISPER LINE', pairs: 'MINCHO', sub: 'Shippori Mincho, the tale\'s own face, small, hairlines either side, ink reveal', html: `
   <div class="k" style="left:0;right:0;top:368px;text-align:center"><div style="display:inline-flex;align-items:center;gap:9px;${MIN};font-weight:500;font-size:15px;letter-spacing:.04em;color:#fbf3e2;text-shadow:${PROLOGUE_SH},0 0 14px #000">
   <span style="width:20px;height:1px;background:#fbf3e2;opacity:.6"></span>The light wants a home<span style="width:20px;height:1px;background:#fbf3e2;opacity:.6"></span></div></div>` },
  { id: 'H2', tag: 'JINRA MOTE', pairs: '@the HUD\'s own face', sub: 'Barlow Condensed (the HUD\'s face) beside a small breathing mint mote -- Jinra nudging', html: `
   <div class="k" style="left:0;right:0;top:368px;text-align:center"><div style="display:inline-flex;align-items:center;gap:8px;font-family:'Barlow Condensed';font-weight:600;font-size:15px;letter-spacing:.14em;color:${CREAM};background:rgba(7,8,12,.5);padding:5px 14px 5px 10px;border-radius:20px;text-shadow:0 1px 3px #000">
   <span style="width:9px;height:9px;border-radius:50%;background:#e8fff8;box-shadow:0 0 6px ${MINT},0 0 14px ${MINT},0 0 24px ${DEEP}"></span>THE LIGHT WANTS A HOME</div></div>` },
  { id: 'H3', tag: 'STORYBOOK ASIDE', pairs: 'STORY', sub: 'Kaisei Decol, softer and smaller, like the narrator leaning in', html: `
   <div class="k" style="left:0;right:0;top:362px;text-align:center"><div style="font-family:'Kaisei Decol';font-weight:500;font-size:15px;letter-spacing:.02em;color:#fff6e8;text-shadow:0 0 10px rgba(12,6,24,.95),0 2px 2px rgba(0,0,0,.7)">…the light wants a home.</div>
   <div style="font-family:'Kaisei Decol';font-size:11px;color:#fff6e8;opacity:.55;margin-top:3px;text-shadow:0 1px 2px #000">~</div></div>` },
] };

function page(K) {
  const P = K.panels.map(o => {
    const bg = o.bg || K.bg, dim = o.dim ?? .12, pos = o.ref ? 'center' : K.pos;
    let inner = o.html || '';
    if (o.css) inner = `<div class="k" style="left:22px;right:22px;top:140px;text-align:center">${o.css(o.main[0], o.main[1], 1)}</div>`;
    const badge = o.ref ? '' : o.pairs === 'MINCHO' ? `<div class="mt">● MATCHES THE PROLOGUE</div>` : o.pairs && o.pairs[0] === '@' ? `<div class="pr">${o.pairs.slice(1)}</div>` : o.pairs ? `<div class="pr">pairs with TALE FONT: ${({ STORY: 'STORYBOOK' })[o.pairs] || o.pairs}</div>` : `<div class="pr">the HUD's own face</div>`;
    const minis = (K.minisText && o.css) ? `<div class="minis">${K.minisText.map(m => `<div class="mini" style="background-image:url(${m[0] === 'TEMPLE CLEARED' ? 'ft_sockets.jpg' : 'ftX_hollow.jpg'})"><div style="position:relative;z-index:2;text-align:center">${o.css(o.id === 'T3' ? m[2] : m[0], m[1], 0)}</div></div>`).join('')}</div>` : '';
    return `<div class="p${o.ref ? ' ref' : ''}"><div class="lab">${o.ref ? '' : o.id + '&nbsp; '}${o.tag}</div><div class="sb">${o.sub}</div>
      <div class="scr" style="background-image:url(${bg});background-position:${pos}"><div class="dim" style="background:rgba(0,0,0,${dim})"></div>${inner}${o.ref ? '<div class="reflab">REEL · INTRO</div>' : ''}</div>${badge}${minis}</div>`;
  }).join('');
  return `<html><head><link href="${FONTS}" rel="stylesheet"><style>
  body{margin:0;background:#16130f;color:${CREAM};font-family:'Barlow Condensed';padding:22px 24px 26px;display:inline-block}
  h1{${MIN};font-weight:800;font-size:34px;margin:0;letter-spacing:.04em} h1 b{color:${RED};font-weight:800} h2{font-size:17px;font-weight:500;opacity:.75;margin:2px 0 16px;letter-spacing:.02em}
  .row{display:flex;gap:14px;align-items:flex-start}.p{width:270px}.p.ref{width:250px;margin-right:12px;padding-right:22px;border-right:1px dashed #f4e9d840}
  .lab{white-space:nowrap;font-weight:700;font-size:15px;letter-spacing:.1em;margin:0 0 1px}.sb{font-size:12.5px;opacity:.7;height:32px;line-height:1.2;margin-bottom:6px}
  .scr{position:relative;width:100%;height:480px;background-size:cover;border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px #f4e9d820}
  .dim{position:absolute;inset:0;z-index:1}.k{position:absolute;z-index:2}
  .plate{display:flex;flex-direction:column;align-items:center;justify-content:center}
  .mt{margin-top:8px;display:inline-block;background:${RED};color:#fff6e6;font-weight:700;font-size:13px;letter-spacing:.14em;padding:3px 9px;border-radius:3px}
  .pr{margin-top:8px;font-size:13px;letter-spacing:.08em;opacity:.7;padding:3px 0}
  .reflab{position:absolute;z-index:2;left:12px;bottom:10px;font-size:11px;letter-spacing:.2em;opacity:.6}
  .minis{display:flex;flex-direction:column;gap:8px;margin-top:8px}.mini{position:relative;height:96px;border-radius:10px;overflow:hidden;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center}
  .mini:before{content:'';position:absolute;inset:0;background:rgba(0,0,0,.2);z-index:1}
  </style></head><body><svg width="0" height="0" style="position:absolute"><filter id="rough"><feTurbulence baseFrequency=".04" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter></svg>
  <h1>TEXT, ROUND 2 &middot; <b>${K.title}</b></h1><h2>${K.sub} &nbsp;|&nbsp; left: the prologue's lettering as it is now, so each option can be judged as one family with it. Backgrounds are in-game Forest Temple renders.</h2>
  <div class="row">${P}</div></body></html>`;
}
const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 700 } });
for (const [k, K] of Object.entries({ speech: SPEECH, signs: SIGNS, title: TITLES, hint: HINTS })) {
  fs.writeFileSync(`r2_${k}.html`, page(K)); await p.goto('file://' + process.cwd() + `/r2_${k}.html`); await p.waitForTimeout(3000); await p.evaluate(() => document.fonts.ready);
  const el = await p.$('body'); await el.screenshot({ path: `/home/user/korajin/images/text/round2_${k}.png` }); console.log(k);
}
await b.close();
