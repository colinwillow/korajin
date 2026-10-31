(() => { const Z = mel.TEMPLEZ.on, g = Z.g, skip = /sky|cloud|beam|falls|vine|frond|flame|rope|halo/i, T = []; const names = [];
  g.updateMatrixWorld(true);
  g.traverse(o => { if (!o.isMesh || skip.test(o.name)) return; names.push(o.name); const P = o.geometry.attributes.position, I = o.geometry.index, M = o.matrixWorld, v = [0,1,2].map(() => ({x:0,y:0,z:0}));
    const W = i => { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), e = M.elements; return [e[0]*x+e[4]*y+e[8]*z+e[12], e[1]*x+e[5]*y+e[9]*z+e[13], e[2]*x+e[6]*y+e[10]*z+e[14]]; };
    const n = I ? I.count : P.count; for (let t = 0; t < n; t += 3) { const a = W(I ? I.getX(t) : t), b = W(I ? I.getX(t+1) : t+1), c = W(I ? I.getX(t+2) : t+2); T.push(a, b, c); } });
  const C = 4, bins = new Map(), key = (i, j) => i * 100003 + j;
  for (let t = 0; t < T.length; t += 3) { const a = T[t], b = T[t+1], c = T[t+2], x0 = Math.floor(Math.min(a[0],b[0],c[0]) / C), x1 = Math.floor(Math.max(a[0],b[0],c[0]) / C), z0 = Math.floor(Math.min(a[2],b[2],c[2]) / C), z1 = Math.floor(Math.max(a[2],b[2],c[2]) / C);
    if ((x1 - x0 + 1) * (z1 - z0 + 1) > 400) continue; for (let i = x0; i <= x1; i++) for (let j = z0; j <= z1; j++) { const k = key(i, j); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(t); } }
  const hitY = (x, z, top) => { let best = -1e9; for (const t of bins.get(key(Math.floor(x / C), Math.floor(z / C))) || []) { const a = T[t], b = T[t+1], c = T[t+2];
      const d = (b[2]-c[2])*(a[0]-c[0]) + (c[0]-b[0])*(a[2]-c[2]); if (Math.abs(d) < 1e-9) continue; const l1 = ((b[2]-c[2])*(x-c[0]) + (c[0]-b[0])*(z-c[2])) / d, l2 = ((c[2]-a[2])*(x-c[0]) + (a[0]-c[0])*(z-c[2])) / d, l3 = 1 - l1 - l2;
      if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue; const y = l1*a[1] + l2*b[1] + l3*c[1]; if (y <= top + .6 && y > best) best = y; } return best; };
  const out = []; for (const B of Z.O.boxes) { const turned = B.cs != null; const hx = turned ? B.hx : (B.maxx - B.minx) / 2, hz = turned ? B.hz : (B.maxz - B.minz) / 2; if (hx * hz < .05) continue;
    const cx = turned ? B.cx : (B.minx + B.maxx) / 2, cz = turned ? B.cz : (B.minz + B.maxz) / 2, cs = turned ? B.cs : 1, sn = turned ? B.sn : 0, n = 7; let bad = 0, cnt = 0, worst = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const u = (-1 + 2 * (i + .5) / n) * hx * .97, w = (-1 + 2 * (j + .5) / n) * hz * .97, x = cx + u * cs - w * sn, z = cz + u * sn + w * cs; cnt++;
      if (Z.O.boxes.some(Q => Q !== B && Q.miny <= B.maxy + .15 && Q.maxy > B.maxy + .05 && (Q.cs != null ? Math.abs((x - Q.cx) * Q.cs + (z - Q.cz) * Q.sn) <= Q.hx && Math.abs(-(x - Q.cx) * Q.sn + (z - Q.cz) * Q.cs) <= Q.hz : x >= Q.minx && x <= Q.maxx && z >= Q.minz && z <= Q.maxz))) { cnt--; continue; }
      const y = hitY(x, z, B.maxy), gap = B.maxy - y; if (gap > .3) { bad++; worst = Math.max(worst, Math.min(gap, 99)); } }
    if (bad && cnt > 0) out.push({ id: B.id, bad: +(bad / Math.max(1, cnt)).toFixed(2), n: cnt, worst: +worst.toFixed(2), top: +(B.maxy - mel.TEMPLE.top).toFixed(1), at: [+cx.toFixed(1), +cz.toFixed(1)], size: [+(2*hx).toFixed(1), +(2*hz).toFixed(1)] }); }
  out.sort((a, b) => b.bad * b.worst - a.bad * a.worst); window.__res = JSON.stringify({ meshes: names.length, tris: T.length / 3, boxes: Z.O.boxes.length, flagged: out.length, list: out.filter(o => !/_rail/.test(o.id)).slice(0, 70), rails: out.filter(o => /_rail/.test(o.id)).length }); })()
