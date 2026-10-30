// THE MOVE TABLE's driver, run INSIDE the page (tools/moves.mjs adds it after boot, on the fake clock). Every row acts through the PADS:
// PointerEvents into the shipped `bindStick` (tap, flick, hold, release), so the gestures are read by the game's own code. Test geometry
// (walls, bars, ledges, steps, drops) is pushed into the shipped `BOXES` for the row and taken out after it. Runs go along world +z.
(() => {
  const S = window.__mv, P = () => S.player, clk = window.__clock, DT = 1 / 60;
  const frame = () => { clk.t += clk.dt; S.frameBody(); };
  const run = (sec, each) => { for (let i = 0, n = Math.round(sec * 60); i < n; i++) { if (each) each(i * DT); frame(); } };
  // ---- THE PADS (x right, y down, 1 = the rim) ----
  let pid = 100;
  const pad = side => { const el = document.getElementById(side === 'L' ? 'padL' : 'padR'); let id = null;
    const at = (x, y) => { const r = el.getBoundingClientRect(), Rr = Math.max(8, r.width * 52 / 132); return { clientX: r.left + r.width / 2 + x * Rr, clientY: r.top + r.height / 2 + y * Rr }; };
    const ev = (type, x, y) => el.dispatchEvent(new PointerEvent(type, Object.assign({ pointerId: id, bubbles: true, cancelable: true, pointerType: 'touch', isPrimary: true }, at(x, y))));
    return { down(x = 0, y = 0) { if (id !== null) this.up(); id = ++pid; ev('pointerdown', x, y); }, move(x, y) { if (id !== null) ev('pointermove', x, y); },
      up(x, y) { if (id !== null) { ev('pointerup', x == null ? 0 : x, y == null ? 0 : y); id = null; } }, get held() { return id !== null; } }; };
  const L = pad('L'), R = pad('R');
  const tapR = () => { R.down(0, 0); frame(); R.up(0, 0); };
  const tapL = () => { L.down(0, 0); frame(); L.up(0, 0); };
  const flickR = () => { R.down(0, 0); frame(); R.move(0, -1); frame(); R.up(0, -1); };     // straight up the pad: forward
  // the LEFT PAD pushed toward a WORLD direction (the inverse of the shipped `stickWorld`, as tools/play.mjs does it), m = deflection
  const steer = (wx, wz, m) => { const sa = Math.sin(S.cam.az), ca = Math.cos(S.cam.az); if (!L.held) L.down(0, 0); L.move((wz * sa - wx * ca) * m, -(wx * sa + wz * ca) * m); };
  const still = () => { if (L.held) L.move(0, 0); };
  // ---- GEOMETRY for a row ----
  let made = [];
  const boxAdd = (x0, x1, y0, y1, z0, z1) => { const b = { minx: x0, maxx: x1, miny: y0, maxy: y1, minz: z0, maxz: z1 }; S.BOXES.push(b); made.push(b); S.boxGrid(); return b; };
  const clean = () => { for (const b of made) { const i = S.BOXES.indexOf(b); if (i >= 0) S.BOXES.splice(i, 1); } made = []; S.boxGrid(); };
  // ---- A TRIAL: a clean spot on the empty floor, settled, facing +z ----
  let spot = 0, X = 0, Z = 0;
  const reset = () => { clean(); L.up(); R.up(); const p = P(); if (p.bar) p.bar = null; X = (spot++ % 8) * 30 - 105; Z = -150; S.godTo(X, 0, Z, 0); p.vel.set(0, 0, 0); run(1.2); };
  const hands = () => S.RIG.height * S.LEDGE.hang * S.bodyK();
  // record until he is back on the floor (or `maxT`); `each(t, ta)` is called before every frame, ta = time since take-off (null before).
  // h = the highest his FEET got over the floor he left, d = take-off to touch-down along the floor, air = seconds off the ground
  const fly = (each, maxT = 8, base) => { const p = P(), g0 = base != null ? base : p.pos.y; let t0 = null, x0, z0, top = -1e9, t = 0, land = null;
    for (; t < maxT; t += DT) { if (each) each(t, t0 === null ? null : t - t0); frame();
      if (t0 === null) { if (!p.grounded) { t0 = t; x0 = p.pos.x; z0 = p.pos.z; } continue; }
      top = Math.max(top, p.pos.y);
      if (p.grounded && t - t0 > .1) { land = { x: p.pos.x, y: p.pos.y, z: p.pos.z, t: t - t0 }; break; } }
    if (t0 === null) return { fail: 'never left the ground' };
    if (!land) return { fail: 'still in the air after ' + maxT + ' s', h: +(top - g0).toFixed(2) };
    return { h: +(top - g0).toFixed(2), d: +Math.hypot(land.x - x0, land.z - z0).toFixed(2), air: +land.t.toFixed(2) }; };
  const speed = () => +Math.hypot(P().vel.x, P().vel.z).toFixed(2);
  // up to speed along +z: walk (half the pad), run (the rim), sprint (the rim + the right pad held still: the shipped SPRINT)
  const speedUp = (gait, sec = 1.6) => { steer(0, 1, gait === 'walk' ? .5 : 1); if (gait === 'sprint') { run(.3, () => steer(0, 1, 1)); R.down(0, 0); } run(sec, () => steer(0, 1, gait === 'walk' ? .5 : 1)); return speed(); };
  // the air kicks: n right-pad flicks, the first at the TOP of the climb (a kick holds his height while it dashes, so one thrown on the
  // way up throws the rest of the climb away), each next as soon as the last has finished
  const kicks = (n, after) => { let k = 0, wait = 0; return (t, ta) => { if (after && !after()) return; if (ta === null || k >= n) return; if (wait > 0) { wait -= DT; return; }
    const p = P(); if (p.vel.y <= .5 && !p.melee) { flickR(); k++; wait = .05; } }; };
  const fwdHold = each => (t, ta) => { steer(0, 1, 1); if (each) each(t, ta); };
  // the double jump at the top of the first
  const dblAt = () => { let done = 0, n = 0; return () => { if (!done && P().vel.y <= 0 && !P().grounded) { tapR(); done = 1; } else if (done) n++; return n > 9; }; };     // true once the second jump has taken
  const ROWS = {};
  // ---- THE GAITS ----
  ROWS.speed = () => { const o = {}; for (const g of ['walk', 'run', 'sprint']) { reset(); o[g] = speedUp(g); } reset(); return o; };
  // ---- THE JUMPS ----
  ROWS.jump_stand = () => { reset(); tapL(); return fly(); };
  ROWS.jump_walk = () => { reset(); const v = speedUp('walk'); tapR(); return Object.assign({ v }, fly(fwdHold())); };
  ROWS.jump_run = () => { reset(); const v = speedUp('run'); tapR(); return Object.assign({ v }, fly(fwdHold())); };
  ROWS.jump_sprint = () => { reset(); const v = speedUp('sprint'); R.up(0, 0); return Object.assign({ v, how: 'letting go of the sprint IS the long jump; it spends the double' }, fly(fwdHold())); };
  ROWS.dbl_stand = () => { reset(); tapL(); let done = 0; return fly(() => { if (!done && P().vel.y <= 0 && !P().grounded) { tapL(); done = 1; } }); };
  ROWS.dbl_run = () => { reset(); const v = speedUp('run'); tapR(); const d = dblAt(); return Object.assign({ v }, fly(fwdHold(() => d()))); };
  ROWS.high_jump_min = () => { reset(); R.down(0, 0); run(S.MOVE.tapT + .05); R.up(0, 0); return Object.assign({ hold: +(S.MOVE.tapT + .05).toFixed(2) }, fly()); };
  ROWS.high_jump = () => { reset(); R.down(0, 0); run(S.AIR.hold + .1); R.up(0, 0); return Object.assign({ hold: S.AIR.hold, how: 'the backflip: a full charge at rest; it spends the double' }, fly()); };
  ROWS.high_jump_fwd = () => { reset(); R.down(0, 0); run(S.AIR.hold + .1); R.up(0, 0); return Object.assign({ how: 'full charge, then the left pad pushed forward in the air' }, fly(fwdHold())); };
  // ---- THE AIR KICKS ("swipes") ----
  for (const n of [1, 2, 3]) {
    ROWS['jump_run_kick' + n] = () => { reset(); const v = speedUp('run'); tapR(); return Object.assign({ v }, fly(fwdHold(kicks(n)))); };
    ROWS['jump_sprint_kick' + n] = () => { reset(); const v = speedUp('sprint'); R.up(0, 0); return Object.assign({ v }, fly(fwdHold(kicks(n)))); };
    ROWS['dbl_run_kick' + n] = () => { reset(); const v = speedUp('run'); tapR(); const d = dblAt(); return Object.assign({ v }, fly(fwdHold(kicks(n, d)))); };
    ROWS['high_kick' + n] = () => { reset(); R.down(0, 0); run(S.AIR.hold + .1); R.up(0, 0); return fly(fwdHold(kicks(n))); };
  }
  // ---- THE ZOOM: the left pad held still, charged full, let go; then on the stick he runs at the zoom's speed ----
  const zoomUp = () => { L.down(0, 0); run(S.ZOOM.T + S.MOVE.tapT + .1); L.up(0, 0); frame(); const v = speed(); return v; };
  ROWS.zoom = () => { reset(); const v0 = speedUp('run', .4); L.up(); run(.8); const z0 = P().pos.z; const v = zoomUp(); let top = v;
    run(2, () => { steer(0, 1, 1); top = Math.max(top, speed()); }); return { v_launch: v, v_top: +top.toFixed(2), d_2s: +(P().pos.z - z0).toFixed(1), how: 'stand still, hold the left pad still ' + (S.ZOOM.T + S.MOVE.tapT).toFixed(2) + ' s, let go, then run' }; };
  ROWS.zoom_jump = () => { reset(); zoomUp(); run(.12, () => steer(0, 1, 1)); const v = speed(); tapR(); return Object.assign({ v }, fly(fwdHold())); };
  ROWS.zoom_dbl = () => { reset(); zoomUp(); run(.12, () => steer(0, 1, 1)); const v = speed(); tapR(); const d = dblAt(); return Object.assign({ v }, fly(fwdHold(() => d()))); };
  ROWS.zoom_dbl_kick3 = () => { reset(); zoomUp(); run(.12, () => steer(0, 1, 1)); const v = speed(); tapR(); const d = dblAt(); return Object.assign({ v }, fly(fwdHold(kicks(3, d)))); };
  // ---- THE HIGH BAR: jump to it from under it, pump it (the right pad held still + the left pad pushed forward) until the swing is full,
  // then let go at a swing angle `th` (0 = hanging straight down, + = forward); the best angle for height and for distance are both found ----
  const barTrial = (th, pumpT = 4) => { reset(); const B = S.hbarMake(X, Z + .1, 0, 0, 1); S.HBAR.list.push(B); run(.3); tapL(); let got = 0; run(1, () => { if (P().bar) got = 1; });
    const out = (o) => { B.g.removeFromParent(); for (const b of B.boxes) { const i = S.BOXES.indexOf(b); if (i >= 0) S.BOXES.splice(i, 1); } S.HBAR.list.splice(S.HBAR.list.indexOf(B), 1); S.boxGrid(); return o; };
    if (!P().bar) return out({ fail: 'never caught the bar' });
    R.down(0, 0); let wmax = 0; run(pumpT, () => { steer(0, 1, 1); const s = P().bar; if (s) wmax = Math.max(wmax, Math.abs(s.w)); });
    // let go on the next forward pass through `th`
    // the angle is measured along the way he is swinging (a full pump goes right over the bar: giant circles)
    let gone = 0; for (let i = 0; i < 600 && !gone; i++) { const s = P().bar; if (!s) break; const sg = Math.sign(s.w) || 1, a = ((s.th * sg + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      if (Math.abs(a - th) < Math.abs(s.w) * DT) { R.up(0, 0); gone = 1; } steer(0, 1, 1); frame(); }
    if (!gone) return out({ fail: 'no release' });
    const bx = X, bz = Z + .1; let top = -1e9, t = 0; const p = P();
    for (; t < 8; t += DT) { still(); frame(); top = Math.max(top, p.pos.y); if (p.grounded) break; }
    return out({ th, w: +wmax.toFixed(1), h: +top.toFixed(2), d: +Math.hypot(p.pos.x - bx, p.pos.z - bz).toFixed(2), air: +t.toFixed(2) }); };
  ROWS.bar = () => { const tr = []; for (let th = -.4; th <= 3.0; th += .2) tr.push(barTrial(+th.toFixed(1))); const ok = tr.filter(q => !q.fail);
    if (!ok.length) return { fail: tr[0] && tr[0].fail, tries: tr };
    const hi = ok.reduce((a, b) => b.h > a.h ? b : a), far = ok.reduce((a, b) => b.d > a.d ? b : a);
    return { bar_top: S.HBAR.h, high: hi, far, how: 'hang, the right pad held still + the left pad forward for 4 s, let go at swing angle th (rad, 0 = straight down)', sweep: ok.map(q => [q.th, q.h, q.d]) }; };
  // ---- THE WALL RUN UP: a 40 m face 6 m ahead, met head-on at each run-up; `tap` = the right tap at the face (else the no-tap run-up) ----
  const FACE = 18;     // the face is this far ahead, so every gait is up to speed when it gets there
  const wallUp = (gait, tap) => { reset(); boxAdd(X - 6, X + 6, 0, 40, Z + FACE, Z + FACE + 2);
    if (gait === 'zoom') zoomUp(); else speedUp(gait, .2);
    let top = -1e9, started = 0, tapped = 0, v = 0; const p = P();
    for (let t = 0; t < 8; t += DT) { steer(0, 1, 1); const gapz = Z + FACE - p.pos.z; if (gapz > p.r + .8) v = speed();
      if (tap && !tapped && gapz < p.r + .7) { if (gait === 'sprint') R.up(0, 0); tapR(); tapped = 1; } frame(); if (p.wrun && p.wrun.kind === 'up') started = 1; top = Math.max(top, p.pos.y); if (started && p.grounded) break; }
    R.up(); return { v, ran: !!started, feet: +top.toFixed(2), hands: +(top + hands()).toFixed(2) }; };
  ROWS.wall_up = () => ({ run_tap: wallUp('run', 1), sprint_tap: wallUp('sprint', 1), sprint: wallUp('sprint', 0), zoom: wallUp('zoom', 0), how: 'feet = the highest his feet got on the face; hands = what he can catch from there (a lip at or under it is reached)' });
  // the wall run up off a JUMP into the face (the no-tap run-up in the air, `autoAir`)
  ROWS.wall_up_jump = () => { const o = {}; for (const g of ['run', 'sprint', 'zoom']) { reset(); boxAdd(X - 6, X + 6, 0, 40, Z + FACE, Z + FACE + 2); if (g === 'zoom') zoomUp(); else speedUp(g, .2);
      const p = P(); let jumped = 0, started = 0, top = -1e9, v = 0;
      for (let t = 0; t < 8; t += DT) { steer(0, 1, 1); const gapz = Z + FACE - p.pos.z; if (!jumped) v = speed(); if (!jumped && gapz < (g === 'zoom' ? 4.5 : g === 'sprint' ? 4 : 2.6)) { if (g === 'sprint') R.up(0, 0); else tapR(); jumped = 1; } frame(); if (p.wrun && p.wrun.kind === 'up') started = 1; top = Math.max(top, p.pos.y); if (started && p.grounded) break; }
      o[g] = { v, ran: !!started, feet: +top.toFixed(2), hands: +(top + hands()).toFixed(2) }; } return o; };
  // ---- THE SIDE WALL RUN: a long face along his run, .6 m to his left; the right tap beside it at a run / sprint; then the kick off it ----
  const sideRun = (gait, kickAt) => { reset(); const fx = X + .35 + P().r + .25; boxAdd(fx, fx + 1, 0, 12, Z - 5, Z + 60); const v = speedUp(gait, .9);
    const p = P(); tapR(); let on = 0, z0 = p.pos.z, top = -1e9, zEnd = null, t = 0, kicked = 0, kz = 0, ky = 0;
    for (; t < 3; t += DT) { if (kickAt != null && on && !kicked && p.wrun && p.wrun.t >= kickAt) { tapR(); kicked = 1; kz = p.pos.z; ky = p.pos.y; break; }
      frame(); if (p.wrun && p.wrun.kind === 'side') on = 1; top = Math.max(top, p.pos.y); if (on && !p.wrun && zEnd === null) zEnd = p.pos.z; if (on && p.grounded) break; }
    if (!on) return { v, fail: 'no side run' };
    const runO = { v, along: +((zEnd != null ? zEnd : p.pos.z) - z0).toFixed(2), h: +top.toFixed(2) };
    if (kickAt == null) return runO;
    // after the kick: how far and how high he goes, from the wall to the landing
    let top2 = ky, t2 = 0; for (; t2 < 6; t2 += DT) { still(); frame(); top2 = Math.max(top2, p.pos.y); if (p.grounded) break; }
    return Object.assign(runO, { kick_at: kickAt, kick_y: +ky.toFixed(2), kick_h: +top2.toFixed(2), kick_d: +Math.hypot(p.pos.x - fx, p.pos.z - kz).toFixed(2), kick_out: +(fx - p.pos.x).toFixed(2), kick_air: +t2.toFixed(2) }); };
  ROWS.wall_side = () => ({ run: sideRun('run'), sprint: sideRun('sprint'), run_kick: sideRun('run', .4), sprint_kick: sideRun('sprint', .4) });
  // ---- THE WALL SLIDE + WALL JUMP CHAIN: two 40 m faces 4.6 m apart; jump at one, the stick let go, catch, tap, catch the other... ----
  ROWS.wall_chain = () => { reset(); const gap = 4.6; boxAdd(X - gap / 2 - 1, X - gap / 2, 0, 40, Z - 6, Z + 6); boxAdd(X + gap / 2, X + gap / 2 + 1, 0, 40, Z - 6, Z + 6);
    const p = P(); S.godTo(X - gap / 2 + .8, 0, Z, Math.PI / 2); run(.8);
    run(.25, () => steer(1, 0, 1)); tapR(); run(.12, () => steer(1, 0, 1)); L.up(); const catches = []; let last = null, kicks = 0;
    for (let t = 0; t < 14 && kicks < 10; t += DT) { frame();
      if (p.wrun && p.wrun.kind === 'slide') { if (last !== p.wrun) { last = p.wrun; catches.push(+p.pos.y.toFixed(2)); }
        if (p.wrun.t > .07) { tapL(); kicks++; } }
      if (p.grounded && t > .5) break; }
    const gain = catches.slice(1).map((y, i) => +(y - catches[i]).toFixed(2));
    return { gap, catches, gain_per_kick: gain, top: catches.length ? Math.max(...catches) : 0, how: 'the first catch off a run-jump, then a tap the moment each slide holds (left stick at rest)' }; };
  // ---- THE LEDGE: the highest lip he catches and climbs, a face .3 m ahead, the left pad held gently into it ----
  const lipTry = (hgt, dbl) => { reset(); boxAdd(X - 3, X + 3, 0, hgt, Z + .9, Z + 4); tapL(); const p = P(); let done = 0, grab = 0, top = 0;
    for (let t = 0; t < 4; t += DT) { if (dbl && !done && p.vel.y <= 0 && !p.grounded) { L.up(); tapL(); done = 1; } else steer(0, 1, .6); frame(); if (p.ledge) grab = 1;
      if (p.grounded && p.pos.z > Z + .9 && p.pos.y > hgt - .1) top = 1; }
    return grab || top; };
    const lipMax = dbl => { let lo = 1, hi = 9; for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2, ok = lipTry(m, dbl); if (ok) lo = m; else hi = m; } return +lo.toFixed(2); };
    ROWS.ledge = () => ({ jump: lipMax(0), dbl: lipMax(1), hands_over_feet: +hands().toFixed(2), how: 'the highest top he gets onto (a ledge caught, or landed on), jumping from .9 m back from the face with the left tap and pushing into it in the air; bisected to 2 cm' });
  // ---- THE STEP: the tallest riser he walks up without a jump ----
  ROWS.step = () => { const ok = []; for (const h of [.2, .3, .33, .35, .357, .36, .38, .4, .42, .45, .5]) { reset(); boxAdd(X - 3, X + 3, 0, h, Z + 2, Z + 6); run(2, () => steer(0, 1, .6)); if (P().pos.y > h - .03) ok.push(h); }
    return { max: ok.length ? Math.max(...ok) : 0, MOVE_step: +S.MOVE.step.toFixed(3), walked: ok }; };
  // ---- THE FALL: walk off a ledge of each height; what it costs him (health, and how long the landing pins him) ----
  ROWS.fall = () => { const o = []; for (const h of [2, 3, 4, 6, 8, 12, 16, 24]) { reset(); boxAdd(X - 3, X + 3, 0, h, Z - 3, Z + 1); const p = P(); S.godTo(X, h, Z - 1, 0); run(.6); p.hp = S.HEALTH.max; const hp0 = p.hp;
      let air = 0, pin = 0, vmax = 0, top0 = p.pos.y; for (let t = 0; t < 3 && p.grounded; t += DT) { steer(0, 1, .6); frame(); } L.up(); for (let t = 0; t < 6; t += DT) { frame(); if (!p.grounded) { air += DT; vmax = Math.max(vmax, -p.vel.y); } else if (air > 0) break; }
      for (let t = 0; t < 3 && p.land; t += DT) { frame(); pin += DT; }
      o.push({ h, from: +top0.toFixed(2), impact: +vmax.toFixed(1), hard: vmax > S.MOVE.hardLand, hp_lost: +(hp0 - p.hp).toFixed(1), landing_s: +pin.toFixed(2), knocked: !!p.knock }); } return o; };
  window.__moves = only => { const out = {}; for (const k of Object.keys(ROWS)) { if (only.length && !only.some(o => k === o || k.startsWith(o + '_') || k.startsWith(o))) continue;
    try { out[k] = ROWS[k](); } catch (e) { out[k] = { fail: 'threw: ' + e.message + ' @ ' + (e.stack || '').split('\n')[1] }; } } clean(); return out; };
})();
