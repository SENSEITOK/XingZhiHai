  /* ---- 岛：坐标换算、地形、崖底、垂瀑、树 ---- */
  const FAC = {}, PROP = {};                              /* FAC[型号](b, o) 拼设施；PROP.home/port/garden/slot/fall 可覆盖内建的几样 */
  function islandOf(desc) {
    const seed = hashS(desc.name || "空岛") % 1000003, rnd = prng(seed + 11), nz = mkNoise(seed), nz2 = mkNoise(seed + 5);
    const s = { "小岛": .25, "中岛": .3, "大岛": .35 }[desc.size] || .3, R40 = 40 * s;
    const W = (x, y) => [(x - 50) * s, (y - 52) * s];        /* 岛图坐标（0–100）→ 世界 */
    const edge = a => (41 + (nz(Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4 + 7, 3) - .5) * 12) * s;
    const pads = [], D = R40 * (.95 + rnd() * .35), cyber = desc.era === "y2077";
    const base = (x, z) => { const r = Math.hypot(x, z), a = Math.atan2(z, x), e = edge(a), u = Math.min(1, r / e); return (nz(x * .16 + 9, z * .16 - 4, 4) - .5) * 1.5 + .55 * (1 - u * u) - .25 * Math.pow(u, 6); };
    const H = (x, z) => {
      let h = base(x, z);
      for (const p of pads) { const d = Math.hypot(x - p.x, z - p.z); if (d < p.r + .9) { const w = d <= p.r ? 1 : 1 - (d - p.r) / .9, ws = w * w * (3 - 2 * w); h = h + (p.h - h) * ws; } }
      return h;
    };
    return { seed, rnd, nz, nz2, s, R40, W, edge, pads, D, base, H, cyber };
  }
  function distSeg(x, z, sg) { const [a, b] = sg, dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz || 1, t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / L2, 0, 1); return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t); }
  function buildTerrain(I, b) {
    const NR = 22, NS = 120, nz = I.nz, top = [];
    for (let j = 0; j <= NR; j++) {
      top.push([]);
      for (let i = 0; i < NS; i++) { const a = i / NS * Math.PI * 2, e = I.edge(a), r = e * Math.pow(j / NR, .85), x = Math.cos(a) * r, z = Math.sin(a) * r; top[j].push([x, I.H(x, z), z]); }
    }
    const gcol = (x, z, j) => {
      const n = nz(x * .5 + 40, z * .5 - 20, 2), n2 = I.nz2(x * .12, z * .12, 2);
      let c = mix3(C.grass, C.grass2, n);
      if (n2 > .62) c = mix3(c, [.62, .68, .36], (n2 - .62) * 2.2);
      if (j >= NR - 1) c = mix3(c, [.36, .5, .26], .35);
      for (const p of I.pads) { const d = Math.hypot(x - p.x, z - p.z); if (p.wear && d < p.r) c = mix3(c, p.wear, (1 - d / p.r) * .55); }
      return c;
    };
    for (let j = 0; j < NR; j++) for (let i = 0; i < NS; i++) {
      const i2 = (i + 1) % NS, a = top[j][i], b2 = top[j][i2], c = top[j + 1][i2], d = top[j + 1][i], cl = gcol((a[0] + c[0]) / 2, (a[2] + c[2]) / 2, j);
      if (j === 0) b.tri(a, c, d, cl); else b.quad(a, b2, c, d, cl);
    }
    /* 岛沿 + 崖底：一圈圈往下收；2077 的岛上半截包着合金龙骨 */
    const K = 12, rings = [top[NR]], depthA = a => I.D * (.82 + nz(Math.cos(a) * 2 + 20, Math.sin(a) * 2 + 4, 3) * .45);
    for (let k = 1; k <= K; k++) {
      const ring = [];
      for (let i = 0; i < NS; i++) {
        const a = i / NS * Math.PI * 2, e = I.edge(a), y = k === 1 ? -.45 : -.45 - Math.pow((k - 1) / (K - 1), 1.15) * depthA(a);
        const f = k === 1 ? 1.0 : Math.pow(1 - (k - 1) / K, .75) * (1 + (nz(a * 3 + k * .7, k * .9, 2) - .5) * .32);
        ring.push([Math.cos(a) * e * f, y, Math.sin(a) * e * f]);
      }
      rings.push(ring);
    }
    const tip = [0, -I.D * 1.12, 0];
    const rcol = (y, a, k) => {
      if (y > -.5) return mix3(C.soil, C.dirt, .2);
      const band = Math.sin(y * 2.6 + nz(a * 2, y * .4, 2) * 5);
      let c = band > .35 ? C.rock2 : band < -.45 ? C.rockD : C.rock;
      if (y > -1.6) c = mix3(c, C.soil, .45);
      return mix3(c, [.25, .23, .26], clamp(-y / (I.D * 1.15), 0, 1) * .55);
    };
    for (let k = 0; k < K; k++) for (let i = 0; i < NS; i++) {
      const i2 = (i + 1) % NS, a = rings[k][i], b2 = rings[k][i2], c = rings[k + 1][i2], d = rings[k + 1][i];
      b.quad(b2, a, d, c, rcol((a[1] + d[1]) / 2, i / NS * 6.28, k));
    }
    for (let i = 0; i < NS; i++) { const i2 = (i + 1) % NS; b.tri(rings[K][i2], rings[K][i], tip, rcol(tip[1], i, K)); }
    I.rings = rings; I.NS = NS;
    const rnd = I.rnd;
    for (let k = 0; k < 9; k++) {                            /* 垂刺 */
      const a = rnd() * 6.28, rr = I.edge(a) * (.25 + rnd() * .5), y = -1.2 - rnd() * I.D * .5, L = 1.2 + rnd() * 3.2, w = .35 + rnd() * .6;
      b.push(trs(Math.cos(a) * rr, y, Math.sin(a) * rr, rnd() * 6.28, 1, Math.PI)); b.cone(0, 0, 0, w, L, 5, rcol(y - L / 2, a, 9)); b.pop();
    }
    for (let k = 0; k < 14; k++) {                           /* 根须、藤 */
      const a = rnd() * 6.28, e = I.edge(a) * (.85 + rnd() * .12), x = Math.cos(a) * e, z = Math.sin(a) * e, L = .8 + rnd() * 2.4, p = [x, -.4 - rnd() * .5, z];
      b.beam(p, [x * (1 + rnd() * .03), p[1] - L, z * (1 + rnd() * .03)], .05 + rnd() * .04, rnd() < .6 ? [.32, .5, .24] : [.36, .26, .18], { k: 1.6 });
    }
    for (let k = 0; k < 6; k++) {                            /* 岛底晶簇：淡淡的魔光 */
      const a = rnd() * 6.28, rr = I.edge(a) * (.45 + rnd() * .35), y = -1.6 - rnd() * I.D * .45, x = Math.cos(a) * rr, z = Math.sin(a) * rr, cc = rnd() < .55 ? C.crystal : C.crystal2;
      for (let q = 0; q < 3; q++) { b.push(trs(x + (rnd() - .5) * .5, y, z + (rnd() - .5) * .5, rnd() * 6.28, 1, Math.PI + (rnd() - .5) * .9, (rnd() - .5) * .9)); b.cone(0, 0, 0, .14 + rnd() * .14, .7 + rnd() * .9, 5, cc, { e: .45, mat: "gloss" }); b.pop(); }
      b.emit(x, y - .6, z, "spark", 4, 1);
    }
    /* 岛沿石栏杆（霍格沃茨式城堞矮墙）：一段段石墙、墙头压顶石、每隔几段一根石柱顶着铁提灯；码头、垂瀑口留缺口 */
    const NSr = 72;
    for (let i = 0; i < NSr; i++) {
      if (i % 9 === 8) continue;                               /* 断几处，像旧城墙 */
      const a = i / NSr * Math.PI * 2, a2 = (i + .86) / NSr * Math.PI * 2, e = I.edge(a) - .16, e2 = I.edge(a2) - .16;
      const p = [Math.cos(a) * e, 0, Math.sin(a) * e], q = [Math.cos(a2) * e2, 0, Math.sin(a2) * e2]; p[1] = I.H(p[0], p[2]) - .04; q[1] = I.H(q[0], q[2]) - .04;
      if (I.pads.some(pd => pd.gate && Math.hypot(p[0] - pd.x, p[2] - pd.z) < pd.r + .5)) continue;
      const sc = mix3(C.stone, C.stoneD, rnd() * .5), h = .26 + (i % 3 === 0 ? .06 : 0);
      b.quad([p[0], p[1], p[2]], [q[0], q[1], q[2]], [q[0], q[1] + h, q[2]], [p[0], p[1] + h, p[2]], sc);
      b.beam([p[0], p[1] + h, p[2]], [q[0], q[1] + h, q[2]], .11, mix3(C.stone, C.white, .15), { tz: .14 });
      if (i % 6 === 0) {
        b.box(p[0], p[1], p[2], .16, .5, .16, C.stoneD, { top: C.stone });
        b.beam([p[0], p[1] + .5, p[2]], [p[0], p[1] + .78, p[2]], .025, C.iron, { mat: "metal" });
        b.box(p[0], p[1] + .78, p[2], .1, .13, .1, C.lamp, { e: .55 }); b.pyramid(p[0], p[1] + .91, p[2], .14, .14, .08, C.iron, { mat: "metal" });
      }
    }
  }
  function groundTex(I, b) {                                 /* 岛面上的树、草、花、石头（2077 少一点、修剪得齐整） */
    const rnd = I.rnd, occ = (x, z, m) => I.pads.some(p => Math.hypot(x - p.x, z - p.z) < p.r + (m || 0)) || (I.paths || []).some(sg => distSeg(x, z, sg) < .45) || (I.lamps || []).some(l => Math.hypot(x - l[0], z - l[1]) < .55);
    const inIsle = (x, z, m) => Math.hypot(x, z) < I.edge(Math.atan2(z, x)) - (m || .6);
    const trees = [], nT = Math.round(I.R40 * I.R40 * .26);
    for (let k = 0, tries = 0; k < nT && tries < nT * 12; tries++) {
      const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * 1.02, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!inIsle(x, z, .9) || occ(x, z, .5) || trees.some(t => Math.hypot(t[0] - x, t[1] - z) < .9)) continue;
      if (I.nz2(x * .2 + 3, z * .2, 2) < .42 && rnd() < .65) continue;
      trees.push([x, z]); k++;
      const y = I.H(x, z) - .05, s = .75 + rnd() * .55, kind = rnd();
      b.at(x, y, z, rnd() * 6.28, s);
      if (kind < .5) { b.cyl(0, 0, 0, .1, .7, 5, C.woodD); b.sphere(0, 1.05, 0, .55, 7, mix3(C.leaf, C.leaf2, rnd()), { k: 1.35, sy: .9 }); b.sphere(.22, 1.4, .1, .36, 6, C.leaf2, { k: 1.5 }); }
      else if (kind < .85) { b.cyl(0, 0, 0, .09, .5, 5, C.woodD); b.cone(0, .35, 0, .55, .9, 6, C.pine, { k: 1.25 }); b.cone(0, .85, 0, .42, .8, 6, mix3(C.pine, C.leaf, .25), { k: 1.4 }); b.cone(0, 1.3, 0, .28, .7, 6, mix3(C.pine, C.leaf2, .3), { k: 1.55 }); }
      else { b.cyl(0, 0, 0, .09, .65, 5, C.woodD); b.sphere(0, 1.0, 0, .5, 7, C.bloom, { k: 1.35, sy: .85 }); b.sphere(-.2, 1.3, -.1, .3, 6, mix3(C.bloom, C.white, .3), { k: 1.5 }); }
      b.pop();
    }
    const nG = Math.round(I.R40 * I.R40 * 2.2);
    for (let k = 0; k < nG; k++) {
      const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * 1.05, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!inIsle(x, z, .25) || occ(x, z, .1)) continue;
      const y = I.H(x, z), f = rnd();
      if (f < .7) { const c = mix3(C.grass2, [.62, .78, .38], rnd()), h = .12 + rnd() * .14; b.at(x, y, z, rnd() * 6.28); b.tri([-.07, 0, 0], [.07, 0, 0], [0, h, .02], c, { k: 1.2 }); b.tri([0, 0, -.07], [0, 0, .07], [.02, h * .8, 0], c, { k: 1.2 }); b.pop(); }
      else if (f < .9) { const c = [[.96, .9, .5], [.95, .55, .62], [.7, .62, .95], [.98, .98, .95]][Math.floor(rnd() * 4)]; b.box(x, y, z, .07, .1, .07, c, { e: .08 }); }
      else { const s = .12 + rnd() * .22; b.sphere(x, y + s * .3, z, s, 5, mix3(C.stone, C.rock, rnd()), { sy: .65 }); }
    }
  }
  function buildPaths(I, b, nodes) {                       /* 小径：最小生成树；1994 是土路，2077 是带灯边的铺装步道 */
    I.paths = []; I.lamps = [];
    if (nodes.length < 2) return;
    const inT = [0], rest = nodes.map((_, i) => i).slice(1), edges = [];
    while (rest.length) { let best = null; for (const a of inT) for (const c of rest) { const d = Math.hypot(nodes[a][0] - nodes[c][0], nodes[a][1] - nodes[c][1]); if (!best || d < best.d) best = { a, c, d }; } edges.push([best.a, best.c]); inT.push(best.c); rest.splice(rest.indexOf(best.c), 1); }
    for (const [ia, ic] of edges) {
      const A = nodes[ia], B = nodes[ic], L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(2, Math.ceil(L / .35));
      const nx = -(B[1] - A[1]) / (L || 1), nz = (B[0] - A[0]) / (L || 1), bend = (I.rnd() - .5) * L * .14, pts = [];
      for (let i = 0; i <= n; i++) { const t = i / n, w = Math.sin(t * Math.PI) * bend; pts.push([A[0] + (B[0] - A[0]) * t + nx * w, A[1] + (B[1] - A[1]) * t + nz * w]); }
      for (let i = 0; i < pts.length - 1; i++) I.paths.push([pts[i], pts[i + 1]]);
      const wd = .22;
      for (let i = 3; i < pts.length - 2; i += 6) { const p = pts[i], q = pts[i + 1], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1, sg = (i / 6 | 0) % 2 ? 1 : -1; I.lamps.push([p[0] - dz / l * (wd + .3) * sg, p[1] + dx / l * (wd + .3) * sg]); }
      for (let i = 0; i < pts.length - 1; i++) {                /* 石子路：一块块石板颜色错开，两边压路缘石 */
        const p = pts[i], q = pts[i + 1], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1, ox = -dz / l * wd, oz = dx / l * wd;
        const y1 = I.H(p[0], p[1]) + .03, y2 = I.H(q[0], q[1]) + .03;
        const c = mix3(C.stone, [.55, .52, .47], (I.nz(p[0] * 3, p[1] * 3, 1) + (i % 2) * .3) * .6);
        b.quad([p[0] - ox, y1, p[1] - oz], [q[0] - ox, y2, q[1] - oz], [q[0] + ox, y2, q[1] + oz], [p[0] + ox, y1, p[1] + oz], c);
        for (const sgn of [-1, 1]) b.beam([p[0] + ox * sgn * 1.08, y1 - .01, p[1] + oz * sgn * 1.08], [q[0] + ox * sgn * 1.08, y2 - .01, q[1] + oz * sgn * 1.08], .045, C.stoneD);
      }
    }
  }
  /* ---- 内建的几样（1994 / 2077 两套） ---- */
  function bHome(b, o) {
        const rnd = o.rnd, wall = C.plaster, roof = [C.roofP, C.roofB, C.roofR, C.roofG][Math.floor(rnd() * 4)];
    b.box(0, 0, 0, 2.4, .35, 2.0, C.stoneD, { top: C.stone });
    b.box(0, .35, 0, 2.2, 1.35, 1.8, wall);
    for (let i = -1; i <= 1; i += 2) { b.beam([i * 1.1, .35, .92], [i * 1.1, 1.7, .92], .1, C.woodD); b.beam([i * 1.1, .35, -.92], [i * 1.1, 1.7, -.92], .1, C.woodD); }
    b.beam([-1.1, 1.05, .92], [1.1, 1.05, .92], .07, C.woodD);
    b.gable(0, 1.7, 0, 2.6, 2.3, 1.15, roof, { end: wall });
    b.box(-.65, 1.7, 0, .5, .35, .4, wall); b.gable(-.65, 2.05, 0, .55, .5, .3, roof, { end: wall });
    b.box(.65, 1.5, -.55, .32, 1.6, .32, C.stoneD, { top: C.rockD }); b.emit(.65, 3.2, -.55, "smoke", 9);
    b.box(0, .35, .91, .48, .85, .06, C.woodD); b.box(.13, .7, .95, .06, .06, .03, C.gold, { e: .4, mat: "metal" });
    for (const x of [-.65, .65]) { b.box(x, .9, .91, .38, .42, .04, C.glow, { e: .6 }); b.box(x, .88, .94, .46, .06, .06, C.woodL); }
    b.box(-1.12, .95, .2, .04, .4, .36, C.glow, { e: .6 }); b.box(1.12, .95, .2, .04, .4, .36, C.glow, { e: .6 });
    b.at(1.25, .1, .7, -.4); b.beam([0, 0, 0], [0, 1.2, 0], .05, C.woodL); b.cone(0, -.05, 0, .14, .38, 6, C.hay); b.pop();
    b.cone(0, 2.85, 0, .06, .4, 4, C.gold, { e: .5, mat: "metal" });
    b.box(0, .35, 1.32, 2.0, .06, .5, C.plank);
    b.at(-1.0, .41, 1.35); b.cyl(0, 0, 0, .14, .24, 6, C.woodD); b.sphere(0, .36, 0, .2, 6, [.95, .55, .6], { k: 1.3 }); b.pop();
    b.at(.85, .41, 1.4); b.beam([0, 0, 0], [0, .7, 0], .04, C.iron, { mat: "metal" }); b.box(0, .7, 0, .16, .2, .16, C.lamp, { e: .9 }); b.pop();
  }
  bHome.h = o => 3.2;
  function bPort(b, o) {                                    /* 码头：1994 木栈道泊扫帚；2077 悬挑停机坪＋信标 */
    const L = 2.6 + (o.ext || 0);
        b.box(0, -.12, 0, 1.0, .14, .9, C.plank);
    for (let i = 0; i < Math.ceil(L / .32); i++) b.box(0, -.12, .6 + i * .32, .95 - (i % 2) * .06, .1, .28, mix3(C.plank, C.woodL, (i % 3) * .2));
    for (const s of [-1, 1]) { for (let i = 0; i <= Math.ceil(L / .9); i++) { const z = .5 + i * .9; b.beam([s * .5, -.42, z], [s * .5, .45, z], .1, C.woodD); } b.beam([s * .5, .45, .5], [s * .5, .45, .5 + L], .06, C.woodL); b.beam([s * .5, -.42, .5 + L * .55], [s * .5, -.6, -.1], .07, C.woodD); }
    b.at(.5, .45, .5 + L * .55); b.beam([0, 0, 0], [0, .9, 0], .07, C.iron, { mat: "metal" }); b.box(0, .9, 0, .2, .26, .2, C.lamp, { e: .9 }); b.pyramid(0, 1.16, 0, .28, .28, .16, C.iron, { mat: "metal" }); b.pop();
    for (const [x, z, ry] of [[-.25, .5 + L - .35, .2], [.2, .5 + L - .9, -.15]]) b.bob(x, .55, z, .05, 1.3 + ry, sb => { sb.at(0, 0, 0, ry); sb.beam([0, 0, -.55], [0, 0, .55], .05, C.woodL); sb.cone(0, 0, -.55, .13, .32, 6, C.hay, { r2: .04 }); sb.pop(); });
  }
  function bFallSpring(b, o) {
        b.disc(0, .04, 0, .75, 14, C.water, { k: 3, mat: "water" });
    for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + o.rnd() * .3; b.sphere(Math.cos(a) * .85, .06, Math.sin(a) * .85, .15 + o.rnd() * .08, 5, C.stone, { sy: .7 }); }
  }
  function bGarden(b, o) {
        b.box(0, 0, 0, 1.8, .06, 1.4, C.soil);
    for (let r = 0; r < 3; r++) { const z = -.45 + r * .45; b.box(0, .06, z, 1.6, .08, .2, mix3(C.soil, C.dirt, .3)); for (let i = 0; i < 6; i++) b.sphere(-.65 + i * .26, .2, z, .09, 5, r === 1 ? [.85, .4, .3] : C.crop, { k: 1.25 }); }
    b.at(.95, 0, .55); b.beam([0, 0, 0], [0, .9, 0], .05, C.woodD); b.beam([-.3, .65, 0], [.3, .65, 0], .04, C.woodD); b.box(0, .5, 0, .26, .3, .14, C.cloth); b.sphere(0, .92, 0, .1, 6, C.hay); b.cone(0, .98, 0, .18, .24, 6, C.hay); b.pop();
  }
  function bSlot(b, o) {
        b.box(0, 0, 0, 1.9, .05, 1.9, mix3(C.soil, C.dirt, .5));
    const P9 = [[-.9, -.9], [.9, -.9], [.9, .9], [-.9, .9]];
    for (const [x, z] of P9) b.box(x, 0, z, .07, .42, .07, C.woodL);
    for (let i = 0; i < 4; i++) { const [x1, z1] = P9[i], [x2, z2] = P9[(i + 1) % 4]; b.beam([x1, .36, z1], [x2, .36, z2], .025, [.9, .85, .7]); }
    b.at(0, 0, .95); b.beam([0, 0, 0], [0, .6, 0], .05, C.woodD); b.box(0, .5, 0, .5, .3, .04, C.woodL); b.pop();
    b.bob(0, 1.1, 0, .08, 1.6, sb => { sb.box(-.04, -.16, -.04, .08, .32, .08, C.gold, { e: .8 }); sb.box(-.16, -.04, -.04, .32, .08, .08, C.gold, { e: .8 }); });
  }
  function bGeneric(b, o) {
        b.box(0, 0, 0, 1.6, 1.0, 1.3, C.plaster); b.gable(0, 1.0, 0, 1.9, 1.6, .7, C.roofT, { end: C.plaster }); b.box(0, 0, .66, .4, .7, .04, C.woodD);
  }
  function badMark(b, o) {                                   /* 待修：交叉的木板（2077 是黄黑警示带）、歪倒的桶 */
        b.at(.9, 0, .9, .3); b.beam([-.3, .1, 0], [.3, .7, 0], .08, C.woodL); b.beam([.3, .1, 0], [-.3, .7, 0], .08, C.woodL); b.pop();
    b.at(-.95, .18, .95, 0, 1, 0, 1.4); b.cyl(0, -.2, 0, .18, .4, 7, C.woodD); b.pop();
  }
  function darken(b, n0s) { for (const key of Object.keys(b.b)) { const v = b.b[key], n0 = n0s[key] || 0; for (let q = n0; q < v.length; q += 12) { v[q + 6] *= .58; v[q + 7] *= .56; v[q + 8] *= .58; v[q + 9] *= .15; } } }
  const lens = b => { const o = {}; for (const k of Object.keys(b.b)) o[k] = b.b[k].length; return o; };
  /* ---- 拼一座岛 ---- */
  function showroom(desc) {                                /* 样品间：平台上一字排开（建模与检查用） */
    const items = desc.showroom, n = items.length, st = new MB(), rnd = prng(7), gap = desc.gap || 3.6, W9 = (n - 1) * gap / 2 + 2.4, cyber = desc.era === "y2077";
    const ctx = { rnd, era: desc.era || "y1994", cyber, night: (SKY[desc.part] || SKY["午"]).night, C, mix3, dim3 };
    st.box(0, -.3, 0, W9 * 2 + .6, .3, 5.4, C.stoneD, { top: C.grass });
    const labs = [];
    items.forEach((it, i) => {
      const x = -((n - 1) * gap) / 2 + i * gap; st.pick = i + 1;
      const o9 = Object.assign({}, ctx, { lv: it.lv || 1, bad: !!it.bad, type: it.type, rnd: prng(31 + i), ext: it.ext || 0 });
      const fn = it.kind === "home" ? (PROP.home || bHome) : it.kind === "slot" ? (PROP.slot || bSlot) : it.kind === "garden" ? (PROP.garden || bGarden) : it.kind === "port" ? (PROP.port || bPort) : it.kind === "fall" ? (PROP.fall || bFallSpring) : (FAC[it.type] || bGeneric);
      st.at(x, 0, 0, it.ry || 0);
      const n0 = lens(st);
      fn(st, o9);
      if (it.bad) { darken(st, n0); badMark(st, o9); }
      st.pop(); st.pick = 0;
      labs.push({ i, n: (it.label || it.type || it.kind) + (it.lv ? " Lv" + it.lv : "") + (it.bad ? " 待修" : ""), p: [x, (fn.h ? fn.h(o9) : 2.6) + .4, 0], k: "fac" });
    });
    const I = { seed: 7, R40: Math.max(4, W9), D: 3, rnd, cyber };
    return { I, st, labs };
  }
  function compose(desc) {
    if (desc.showroom) return showroom(desc);
    const I = islandOf(desc), st = new MB();
    const kindR = { home: 2.3, fac: 1.5, slot: 1.2, port: .95, fall: 1.0, garden: 1.05, misc: .8 };   /* 主屋是城堡，地盘大一圈 */
    const wearC = mix3(C.dirt, C.stone, .35);
    const wear = { home: wearC, fac: mix3(C.dirt, C.grass, .4), slot: null, port: wearC, garden: null, fall: null };
    const pois = (desc.pois || []).map(p => {
      let [x, z] = I.W(p.x, p.y);
      if (p.kind === "port") { const a = Math.atan2(z, x), e = I.edge(a) - .35; x = Math.cos(a) * e; z = Math.sin(a) * e; }
      return Object.assign({}, p, { X: x, Z: z });
    });
    /* 城堡和设施的模型不随岛缩放：岛小或两处挨得近时，把设施／营建位／自留畦往外推开，免得互相穿插（只挪立体里的落点，岛图坐标不动） */
    const RAD = { home: 2.95, fac: 1.85, slot: 1.2, garden: 1.1, fall: 1.0, port: 1.0 }, MOV = { fac: 1, slot: 1, garden: 1 };
    for (let it = 0; it < 40; it++) {
      let moved = 0;
      for (let i = 0; i < pois.length; i++) for (let j = i + 1; j < pois.length; j++) {
        const A = pois[i], B = pois[j], mA = MOV[A.kind] ? 1 : 0, mB = MOV[B.kind] ? 1 : 0;
        if (!mA && !mB) continue;
        const dx = B.X - A.X, dz = B.Z - A.Z, d = Math.hypot(dx, dz) || 1e-3, need = (RAD[A.kind] || .9) + (RAD[B.kind] || .9);
        if (d >= need - .01) continue;
        const ps = (need - d) / (mA + mB), ux = d > 1e-3 ? dx / d : 1, uz = d > 1e-3 ? dz / d : 0;
        if (mA) { A.X -= ux * ps; A.Z -= uz * ps; }
        if (mB) { B.X += ux * ps; B.Z += uz * ps; }
        moved = 1;
      }
      for (const p of pois) if (MOV[p.kind]) { const a = Math.atan2(p.Z, p.X), lim = I.edge(a) - (RAD[p.kind] || .9) - .35, r = Math.hypot(p.X, p.Z); if (r > lim) { p.X *= lim / r; p.Z *= lim / r; } }
      if (!moved) break;
    }
    for (const p of pois) { I.pads.push({ x: p.X, z: p.Z, r: kindR[p.kind] || 1, h: I.base(p.X, p.Z), wear: wear[p.kind] || null, gate: p.kind === "port" || (p.kind === "fac" && p.type === "港桥") }); }
    const fp0 = pois.find(p => p.kind === "fall");
    if (fp0) { const a = Math.atan2(fp0.Z, fp0.X), e = I.edge(a); I.pads.push({ x: Math.cos(a) * e, z: Math.sin(a) * e, r: .6, h: I.base(fp0.X, fp0.Z) - .1, gate: 1 }); }
    buildPaths(I, st, pois.filter(p => p.kind !== "slot").map(p => [p.X, p.Z]));
    buildTerrain(I, st);
    groundTex(I, st);
    for (const [x, z] of I.lamps || []) {                    /* 猫球灯（原著）：1994 木杆上挂一盏，2077 细合金杆托着浮在半空 */
      if (Math.hypot(x, z) > I.edge(Math.atan2(z, x)) - .5 || I.pads.some(p => Math.hypot(x - p.x, z - p.z) < p.r)) continue;
      const y = I.H(x, z);
      st.beam([x, y, z], [x, y + .98, z], .045, C.iron, { mat: "metal" }); st.cyl(x, y, z, .08, .12, 6, C.stoneD);   /* 铁灯柱，弯钩上挂一盏猫球灯 */
      st.beam([x, y + .95, z], [x + .22, y + .95, z], .03, C.iron, { mat: "metal" }); st.emit(x + .22, y + .76, z, "cat", 1, 1);
    }
    const rnd = I.rnd, ctx = { rnd, era: desc.era || "y1994", cyber: I.cyber, night: (SKY[desc.part] || SKY["午"]).night, C, I, mix3, dim3 };
    const labs = [];
    for (const p of pois) {
      const y = I.H(p.X, p.Z), face = Math.atan2(-p.X, -p.Z) + (rnd() - .5) * .3;
      st.pick = p.i + 1;
      let topH = 1.2;
      if (p.kind === "port") {
        const a = Math.atan2(p.Z, p.X);
        st.at(p.X, y, p.Z, Math.atan2(Math.cos(a), Math.sin(a))); (PROP.port || bPort)(st, Object.assign({}, ctx, { ext: 0 })); st.pop();
        labs.push({ i: p.i, n: p.n, p: [p.X, y + 1.5, p.Z], k: p.kind }); st.pick = 0; continue;
      }
      st.at(p.X, y, p.Z, face);
      const n0 = lens(st);
      if (p.kind === "home") { const fn = PROP.home || bHome; fn(st, ctx); topH = fn.h ? fn.h(ctx) : 3.3; }
      else if (p.kind === "fall") { (PROP.fall || bFallSpring)(st, ctx); topH = .9; }
      else if (p.kind === "garden") { (PROP.garden || bGarden)(st, ctx); topH = 1.3; }
      else if (p.kind === "slot") { (PROP.slot || bSlot)(st, ctx); topH = 1.5; }
      else if (p.kind === "fac") {
        const fn = FAC[p.type], o9 = Object.assign({}, ctx, { lv: clamp(p.lv || 1, 1, 3), bad: !!p.bad, type: p.type });
        try { (fn || bGeneric)(st, o9); } catch (e) { for (const k of Object.keys(st.b)) st.b[k].length = n0[k] || 0; bGeneric(st, o9); }
        if (p.bad) { darken(st, n0); badMark(st, o9); }
        topH = fn && fn.h ? fn.h(o9) : 2.6;
      } else bGeneric(st, ctx);
      st.pop();
      labs.push({ i: p.i, n: p.n, p: [p.X, y + topH + .35, p.Z], k: p.kind });
      if (p.kind === "fac" && p.type === "港桥") {             /* 港桥：再从最近的岛沿伸一段长栈桥／停机臂 */
        const a = Math.atan2(p.Z, p.X), e = I.edge(a) - .3, ex = Math.cos(a) * e, ez = Math.sin(a) * e;
        st.at(ex, I.H(ex, ez), ez, Math.atan2(Math.cos(a), Math.sin(a))); (PROP.port || bPort)(st, Object.assign({}, ctx, { ext: 1.5 + (p.lv || 1) * 1.2, lv: p.lv || 1 })); st.pop();
      }
      st.pick = 0;
    }
    const fp = pois.find(p => p.kind === "fall");             /* 垂瀑：溪到崖边，再挂下去 */
    if (fp) {
      const a = Math.atan2(fp.Z, fp.X), e = I.edge(a), ex = Math.cos(a) * (e - .05), ez = Math.sin(a) * (e - .05), y0 = I.H(ex * .97, ez * .97);
      const sx = fp.X, sz = fp.Z, n = 8, px = -Math.sin(a), pz = Math.cos(a);
      for (let i = 0; i < n; i++) {
        const t = i / n, t2 = (i + 1) / n, x1 = sx + (ex - sx) * t, z1 = sz + (ez - sz) * t, x2 = sx + (ex - sx) * t2, z2 = sz + (ez - sz) * t2, w = .22;
        st.quad([x1 - px * w, I.H(x1, z1) + .06, z1 - pz * w], [x2 - px * w, I.H(x2, z2) + .06, z2 - pz * w], [x2 + px * w, I.H(x2, z2) + .06, z2 + pz * w], [x1 + px * w, I.H(x1, z1) + .06, z1 + pz * w], C.water, { k: 3, mat: "water" });
      }
      const L = I.D * 1.35, segs = 14, ux = Math.cos(a), uz = Math.sin(a);
      for (let i = 0; i < segs; i++) {
        const t = i / segs, t2 = (i + 1) / segs, o1 = .3 * Math.sqrt(t) + .05, o2 = .3 * Math.sqrt(t2) + .05, w1 = .3 + t * .5, w2 = .3 + t2 * .5, ya = y0 + .02 - t * L, yb = y0 + .02 - t2 * L;
        st.quad([ex + ux * o1 - px * w1, ya, ez + uz * o1 - pz * w1], [ex + ux * o2 - px * w2, yb, ez + uz * o2 - pz * w2], [ex + ux * o2 + px * w2, yb, ez + uz * o2 + pz * w2], [ex + ux * o1 + px * w1, ya, ez + uz * o1 + pz * w1], [.62, .8, .96], { k: 2, mat: "water", e: 0 });
      }
      st.emit(ex + ux * .5, y0 - L * .98, ez + uz * .5, "mist", 26, 1.4);
      st.emit(ex + ux * .3, y0 - .3, ez + uz * .3, "mist", 6, .7);
    }
    for (let k = 0; k < 10; k++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * .9, x = Math.cos(a) * r, z = Math.sin(a) * r; st.emit(x, I.H(x, z) + .2, z, "firefly", 3, 1); }
    return { I, st, labs };
  }
