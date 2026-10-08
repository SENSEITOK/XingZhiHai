/* 田圃：霍格沃茨城堡脚下那种石墙菜园。
   1994：干砌石矮墙围起一块田（错缝毛石、压顶石、转角石墩、门墩顶石球），田里后半是一片麦子、前半一垄垄卷心菜和南瓜，中间留一条踩出来的小路；
         旧木栅门半开，门墩上挂一盏铁提灯；麦地里立着戴尖顶巫师帽、围红金围巾的稻草人（小脑袋，横杆上落着一只乌鸦）；
         田边一口圆石井（石板瓦小顶、木辘轳、吊桶）、一垛干草和草捆、独轮车。
         Lv2 田后起一座石砌谷仓：毛石墙、石板瓦陡顶、两头山墙压顶石出头带尖顶饰、尖拱铁钉木门、吊货老虎窗和吊杆、扶壁、尖拱小窗、通风小塔和小旗、墙角常春藤；田后墙开口对着仓门；旁边一辆干草车。
         Lv3 右后起一座石砌塔式风车（收分圆塔、尖拱门窗、石板瓦圆锥顶和小旗、四片帆布风叶慢慢转），右前再围第二块田，种着海格那种大南瓜。
   2077：同一套石头底子；干草垛的位置换成一座黄铜框玻璃温室（矮石基、人字玻璃顶、里面两排花架和盆栽），田里几根黄铜细杆托着猫球灯；提灯框换黄铜。不加霓虹、不加全息。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLM = mix3(SL, SL2, .5);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .28);
  const OLDW = mix3(C.wood, [.55, .52, .48], .35), OLDWD = mix3(C.woodD, [.4, .38, .36], .25), ROPE = [.72, .63, .46];
  const SOIL = mix3(C.soil, [.3, .22, .16], .2), SOIL2 = mix3(C.soil, C.dirt, .3), STUB = mix3(C.soil, C.hay, .3);
  const HAY = mix3(C.hay, [.86, .62, .26], .22), HAYD = mix3(C.hay, C.wood, .3);
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };

  /* ---------- 石头颜色 ---------- */
  function sc(y) {                                          /* 城堡毛石：深浅不一，墙根泛潮发绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .42 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .94) c = mix3(c, STD, .35);
    return mix3(c, mix3(STD, C.ivy, .35), Math.max(0, Math.min(.3, (.7 - y) * .4)));
  }
  function fs() {                                           /* 田埂矮墙的毛石：跟岛沿石栏杆一个色系，深浅、冷暖、青苔各不一样 */
    const r = R(), r2 = R(); let c = mix3(C.stone, C.stoneD, .2 + r2 * .75);
    if (r < .25) c = mix3(c, [.6, .53, .44], .3); else if (r < .45) c = mix3(c, [.44, .47, .5], .3); else if (r > .88) c = mix3(c, mix3(STD, C.ivy, .5), .45);
    if (r2 > .9) c = mix3(c, STD, .4);
    return c;
  }
  const capC = () => mix3(C.stone, mix3(C.stoneD, [.6, .56, .5], .5), R() * .55);

  /* ---------- 小工具 ---------- */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function archPts(w, p, n) {
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向翻成朝外 */
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function leaf(b, x, y, z, a, len, wid, lift, col, o) {    /* 一片叶子：菱形，朝上 */
    const ca = Math.cos(a), sa = Math.sin(a), px = -sa, pz = ca;
    const B0 = [x, y, z], T = [x + ca * len, y + lift, z + sa * len], L = [x + ca * len * .45 + px * wid, y + lift * .7, z + sa * len * .45 + pz * wid], Rr = [x + ca * len * .45 - px * wid, y + lift * .7, z + sa * len * .45 - pz * wid];
    tf(b, B0, L, T, col, [0, 1, 0], o); tf(b, B0, T, Rr, col, [0, 1, 0], o);
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? (j % 2 ? .12 : .22) : 0, q1 = o.qr ? (j % 2 ? .22 : .12) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .24));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .19 + R() * .22; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        const col = isQ ? mix3(DRESS2, ST, R() * .35) : sc(ya);
        const a = [E[k][0], ya, z], c2 = [E[k + 1][0], ya, z], c3 = [E[k + 1][1], yb, z], d = [E[k][1], yb, z];
        if (o.back) b.quad(c2, a, d, c3, col); else b.quad(a, c2, c3, d, col);
      }
    }
  }
  function rwall(b, cx, cz, r0, r1, y0, y1, seg, rh) {      /* 收分圆塔身：一圈圈石砌，层层错半块 */
    const n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, P = (a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r];
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, ra = r0 + (r1 - r0) * j / n, rb = r0 + (r1 - r0) * (j + 1) / n, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU;
        b.quad(P(a, ra, ya), P(a2, ra, ya), P(a2, rb, yb), P(a, rb, yb), sc(ya));
      }
    }
    const k = Math.cos(PI / seg) - .02;
    b.cyl(cx, y0, cz, r0 * k, y1 - y0, seg, STD, { r2: r1 * k, nb: true, nt: true });
  }
  function tubeIn(b, cx, y0, cz, r, h, seg, col) {          /* 朝里的筒壁（井口里） */
    for (let i = 0; i < seg; i++) {
      const a = i / seg * TAU, c = (i + 1) / seg * TAU, p0 = [cx + Math.cos(a) * r, y0, cz + Math.sin(a) * r], p1 = [cx + Math.cos(c) * r, y0, cz + Math.sin(c) * r];
      b.quad(p0, p1, [p1[0], y0 + h, p1[2]], [p0[0], y0 + h, p0[2]], col);
    }
  }
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) { /* 扶壁一级：顶面往外斜收（当前坐标 z 朝外） */
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, x, z, ry, h) {
    b.at(x, 0, z, ry);
    wedge(b, .15, -.1, -.02, .25, h * .45 + .1, h * .3 + .1, mix3(ST2, STD, .3));
    wedge(b, .11, -.1, -.02, .15, h + .1, h * .84 + .1, sc(.6));
    b.pop();
  }

  /* ---------- 窗、门、灯、旗、藤 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱小窗（面朝 +z）：料石框、烛光、窗棂、窗台 */
    o = o || {};
    const p = .72, fr = .035;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), o.z0 != null ? o.z0 : -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, WIN, { e: o.e != null ? o.e : .55 });
    b.box(0, h * .55, .022, w, .014, .012, C.iron);
    b.box(0, -fr - .03, .0, w + fr * 2 + .04, .03, .08, DRESS2);
    b.pop();
  }
  function door(b, w, h, p, o) {                            /* 尖拱铁钉木门（面朝 +z，原点在门底中点） */
    o = o || {};
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .3);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    const n = o.planks || 6;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, i === n / 2 ? .02 : .009, h + archY(w, p, x) - .02, dark); }
    for (const y of o.straps || [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .028, .012, C.iron, M);
      for (let i = 0; i < 5; i++) b.panel(-w / 2 + .05 + i * (w - .1) / 4, y + .007, .0125, .015, .015, C.metal, M);
    }
    if (o.ring) for (const s of [-1, 1]) b.box(s * .045, h * .45, .012, .03, .03, .016, C.iron, M);
  }
  function lantern(b, x0, y0, z0, cy) {                     /* 铁提灯（四角，暖光） */
    const fr = cy ? BRASS : C.iron, x = 0, y = 0, z = 0;
    b.at(x0, y0, z0, 0, .85);
    b.cyl(x, y, z, .06, .025, 4, fr, { mat: "metal", a0: PI / 4 });
    b.cyl(x, y + .025, z, .042, .12, 4, C.lamp, { r2: .05, e: .7, a0: PI / 4 });
    for (let i = 0; i < 4; i++) { const a = PI / 4 + i * PI / 2; b.beam([x + Math.cos(a) * .046, y + .025, z + Math.sin(a) * .046], [x + Math.cos(a) * .055, y + .145, z + Math.sin(a) * .055], .012, fr, M); }
    b.cone(x, y + .145, z, .072, .09, 4, fr, { mat: "metal", a0: PI / 4 });
    b.box(x, y + .235, z, .02, .03, .02, fr, M);
    b.pop();
  }
  function flag(b, x, y, z, col, cy) {                      /* 小旗：铁杆、金球、随风摆的尖角旗 */
    b.beam([x, y - .1, z], [x, y + .52, z], .02, cy ? BRASS : C.iron, M);
    b.sphere(x, y + .54, z, .026, 4, C.gold, M);
    const L = .34, Hh = .15, top = y + .49, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .01 + L * t0, x1 = x + .01 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .55) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
    return y + .57;
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙一簇小叶，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, rAt, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .028;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], rAt(py) + .012 + R() * .01, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带 */
    b.cyl(cx, y, cz, r * 1.1, h * .05, seg, SL2, { r2: r * .96, nt: true, bot: STD });
    if (cy) b.cyl(cx, y + h * .05, cz, r * .975, .03, seg, BRASS, { mat: "metal", nt: true, nb: true });
    const y0 = y + h * .05, H = h * .95, nb = 6;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : SLM;
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true });
    }
    return y + h;
  }

  /* ---------- 田：干砌石矮墙、转角石墩、门墩、木栅门 ---------- */
  function dryWall(b, x0, z0, x1, z1, gaps) {               /* 一段矮墙：深色墙芯外贴两层错缝毛石（每块进出不一）＋一层压顶石；gaps 是沿墙的缺口 */
    const dx = x1 - x0, dz = z1 - z0, L = Math.hypot(dx, dz), t = .15;
    const cut = (a, c) => { let out = [[a, c]]; for (const g of gaps || []) { const n = []; for (const [p, q] of out) { if (q <= g[0] || p >= g[1]) n.push([p, q]); else { if (p < g[0]) n.push([p, g[0]]); if (q > g[1]) n.push([g[1], q]); } } out = n; } return out.filter(([p, q]) => q - p > .02); };
    b.at(x0, 0, z0, Math.atan2(-dz, dx));
    for (const [p, q] of cut(0, L)) b.box((p + q) / 2, -.14, 0, q - p, .3, t - .04, mix3(C.stoneD, STD, .5), { nb: true });
    const Y = [-.14, .085, .17];
    for (let j = 0; j < 2; j++) for (const sd of [1, -1]) {
      let x = 0, first = true;
      while (x < L - 1e-4) {
        let len = (first && j ? -.07 : 0) + .15 + R() * .14; first = false;
        if (L - (x + len) < .08) len = L - x;
        for (const [p, q] of cut(x, x + len)) {
          const z = sd * (t / 2 + (R() - .3) * .022), y1 = Y[j + 1] + (j ? (R() - .5) * .02 : 0), c = fs();
          if (sd > 0) b.quad([p, Y[j], z], [q, Y[j], z], [q, y1, z], [p, y1, z], c); else b.quad([q, Y[j], z], [p, Y[j], z], [p, y1, z], [q, y1, z], c);
        }
        x += len;
      }
    }
    let x = 0;
    while (x < L - 1e-4) {
      let len = .2 + R() * .12; if (L - (x + len) < .1) len = L - x;
      for (const [p, q] of cut(x, x + len)) { const c = R() < .12 ? mix3(capC(), C.ivy, .45) : capC(); b.box((p + q) / 2, .165, (R() - .5) * .012, q - p - .01, .04 + R() * .016, t + .03, mix3(c, C.stoneD, .25), { nb: true, top: c }); }
      x += len;
    }
    b.pop();
  }
  function pier(b, x, z, h, ball) {                         /* 石墩：转角的矮、门墩高一点顶个石球 */
    b.box(x, -.14, z, .2, h + .14, .2, mix3(fs(), C.stoneD, .3), { nb: true, top: DRESS2 });
    b.box(x, h, z, .24, .04, .24, DRESS2, { nb: true, top: DRESS });
    if (ball) { b.box(x, h + .04, z, .1, .035, .1, DRESS2, { nb: true }); b.sphere(x, h + .115, z, .052, 6, DRESS); }
    else b.pyramid(x, h + .04, z, .18, .18, .07, DRESS2);
  }
  function gateLeaf(b, x, z, ry, lw) {                      /* 一扇旧木栅门：两根门梃、上下横档、尖头栅条、斜撑、铁合页 */
    b.at(x, 0, z, ry);
    const h = .3;
    b.box(.025, .02, 0, .04, h, .04, OLDWD);
    b.box(lw - .02, .03, 0, .035, h - .02, .035, OLDW);
    b.box(lw / 2, .08, 0, lw, .035, .03, OLDW); b.box(lw / 2, .24, 0, lw, .035, .03, OLDW);
    for (const f of [.36, .64]) { const px = lw * f; b.box(px, .04, 0, .03, h - .06, .022, mix3(OLDW, C.woodL, .2)); b.pyramid(px, .04 + h - .06, 0, .03, .022, .04, mix3(OLDW, C.woodL, .2)); }
    b.beam([.04, .09, .022], [lw - .04, .24, .022], .024, OLDWD);
    for (const y of [.08, .24]) b.box(.06, y - .004, 0, .09, .043, .04, C.iron, M);
    b.pop();
  }
  function stoneWallsOf(b, F, cy) {                         /* 一块田的四面矮墙、转角石墩、前门、后口 */
    const { x0, x1, z0, z1 } = F, gw = .46;
    reseed(F.seed);
    dryWall(b, x0, z1, x1, z1, F.gate != null ? [[F.gate - x0 - gw / 2 - .1, F.gate - x0 + gw / 2 + .1]] : []);
    dryWall(b, x1, z1, x1, z0, []);
    dryWall(b, x1, z0, x0, z0, F.back != null ? [[x1 - F.back - gw / 2 - .1, x1 - F.back + gw / 2 + .1]] : []);
    dryWall(b, x0, z0, x0, z1, []);
    for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) pier(b, x, z, .24, false);
    if (F.gate != null) {
      const g = F.gate, lw = gw / 2 - .012;
      pier(b, g - gw / 2 - .1, z1, .32, true); pier(b, g + gw / 2 + .1, z1, .32, true);
      gateLeaf(b, g - gw / 2, z1, 0, lw);
      gateLeaf(b, g + gw / 2, z1, PI - 1.15, lw);
      if (F.lamp) {                                          /* 门墩上铁臂挑一盏提灯 */
        const px = g - gw / 2 - .1;
        b.beam([px, .36, z1], [px, .66, z1], .022, cy ? BRASS : C.iron, M);
        b.beam([px, .64, z1], [px, .64, z1 + .16], .02, cy ? BRASS : C.iron, M);
        b.beam([px, .64, z1 + .15], [px, .58, z1 + .15], .01, C.iron, M);
        lantern(b, px, .38, z1 + .15, cy);
      }
      for (let i = 0; i < 3; i++) b.box(g + (R() - .5) * .07, -.05, z1 + .22 + i * .17, .12 + R() * .04, .065, .09, mix3(C.stoneD, C.stone, R() * .5), { nb: true });   /* 门前踏脚石 */
    }
    if (F.back != null) { pier(b, F.back - gw / 2 - .1, z0, .3, true); pier(b, F.back + gw / 2 + .1, z0, .3, true); }
  }

  /* ---------- 作物 ---------- */
  function cabbage(b, x, y, z, r, purple) {
    const head = purple ? mix3([.5, .34, .55], [.42, .3, .5], R()) : mix3([.66, .82, .5], [.52, .73, .4], R());
    const outer = purple ? [.36, .3, .42] : mix3(C.leaf, C.leafD, R() * .6);
    for (let i = 0; i < 4; i++) leaf(b, x, y + .005, z, i * PI / 2 + R() * .8, r * 1.9, r * .75, .05, outer);
    b.sphere(x, y + r * .7, z, r, 5, head, { sy: .82 });
  }
  function pumpkin(b, x, y, z, r, seg, big) {
    const col = big ? mix3([.92, .5, .14], [.85, .4, .1], R()) : mix3([.93, .55, .17], [.97, .66, .25], R());
    b.sphere(x, y + r * .68, z, r, seg, col, { sy: .7 });
    b.at(x, y + r * 1.3, z, R() * TAU, 1, .3); b.cyl(0, 0, 0, r * .16, r * .42, 4, mix3(C.woodD, C.leafD, .45), { r2: r * .1, nb: true }); b.pop();
    leaf(b, x + (R() - .5) * r, y + .006, z + (R() - .5) * r, R() * TAU, r * 1.6, r * .7, .03, mix3(C.leaf, C.leaf2, R()));
  }
  function wheat(b, x, y, z) {
    const t = R(), col = t < .45 ? HAY : t < .75 ? mix3(HAY, C.gold, .35) : t < .93 ? mix3(HAY, C.crop, .3) : HAYD;
    b.at(x, y, z, R() * TAU, 1, (R() - .5) * .22, (R() - .5) * .22);
    b.cone(0, 0, 0, .03 + R() * .012, .17 + R() * .09, 3, col, { nb: true, k: 1.25 });
    b.pop();
  }

  /* 一块田的内容：A 后半麦地、前半一垄垄卷心菜和南瓜，中间一条小路；B 海格式大南瓜地 */
  function crops(b, F, cy) {
    reseed(F.seed + 3);
    const ix0 = F.x0 + .075, ix1 = F.x1 - .075, iz0 = F.z0 + .075, iz1 = F.z1 - .075, cx = (ix0 + ix1) / 2, cz = (iz0 + iz1) / 2;
    b.box(cx, -.12, cz, ix1 - ix0, .17, iz1 - iz0, SOIL, { nb: true });                       /* 田土，顶面 y=.05 */
    const path = F.gate != null ? F.gate : null, inPath = x => path != null && Math.abs(x - path) < .17;
    if (path != null) for (let z = iz0 + .1; z < iz1 - .02; z += .16) b.box(path + (R() - .5) * .05, .05, z, .13 + R() * .04, .012, .1, mix3(C.stone, C.dirt, .3 + R() * .4), { nb: true });   /* 小路上的踏石 */
    if (F.kind === "A") {
      const dW = Math.min(.82, (iz1 - iz0) * .42), wz1 = iz0 + dW;
      b.box(cx, .05, iz0 + dW / 2, ix1 - ix0 - .02, .015, dW, STUB, { nb: true });
      const sk = F.scare;
      for (let z = iz0 + .05; z < wz1 - .02; z += .068) for (let x = ix0 + .05; x < ix1 - .03; x += .068) {
        const px = x + (R() - .5) * .04, pz = z + (R() - .5) * .04;
        if (inPath(px) || (sk && Math.hypot(px - sk[0], pz - sk[1]) < .13)) continue;
        if (R() < .025) { b.box(px, .065, pz, .035, .1, .035, R() < .6 ? [.82, .22, .2] : [.35, .45, .85]); continue; }   /* 麦里几朵虞美人、矢车菊 */
        wheat(b, px, .065, pz);
      }
      const rows = Math.max(1, Math.floor((iz1 - .06 - (wz1 + .1)) / .27) + 1), kinds = F.rows || ["cab", "pump", "cab", "pump"];
      for (let i = 0; i < rows; i++) {
        const z = wz1 + .2 + i * .27, kind = kinds[i % kinds.length];
        if (z > iz1 - .08) break;
        const segs = path != null ? [[ix0 + .05, path - .17], [path + .17, ix1 - .05]] : [[ix0 + .05, ix1 - .05]];
        for (const [a, c] of segs) {
          if (c - a < .15) continue;
          b.box((a + c) / 2, .05, z, c - a, .055, .17, SOIL, { nb: true, top: SOIL2 });
          const step = kind === "pump" ? .3 : .19, n = Math.max(1, Math.floor((c - a) / step)), off = (c - a - (n - 1) * step) / 2;
          for (let k = 0; k < n; k++) {
            const x = a + off + k * step + (R() - .5) * .04;
            if (kind === "pump") pumpkin(b, x, .105, z + (R() - .5) * .04, .075 + R() * .03, 6);
            else cabbage(b, x, .105, z, .06 + R() * .015, kind === "pur" || R() < .12);
          }
          if (kind === "pump") b.beam([a + .03, .11, z + .05], [c - .03, .11, z - .03], .022, mix3(C.leafD, C.leaf, .4));   /* 南瓜藤 */
        }
      }
    } else {
      const big = F.big || [];
      for (const [x, z, r] of big) pumpkin(b, x, .05, z, r, 8, true);
      for (let i = 0; i < 7; i++) {
        const x = ix0 + .12 + R() * (ix1 - ix0 - .24), z = iz0 + .12 + R() * (iz1 - iz0 - .24);
        if (inPath(x) || big.some(p => Math.hypot(x - p[0], z - p[1]) < p[2] + .12)) continue;
        pumpkin(b, x, .05, z, .07 + R() * .03, 6);
      }
      for (let i = 0; i < 16; i++) {                         /* 南瓜叶铺地 */
        const x = ix0 + .06 + R() * (ix1 - ix0 - .12), z = iz0 + .06 + R() * (iz1 - iz0 - .12);
        if (inPath(x)) continue;
        leaf(b, x, .056, z, R() * TAU, .13 + R() * .07, .06, .035, mix3(C.leaf, C.leafD, R() * .7));
      }
      for (let i = 0; i < 3; i++) {
        const za = iz0 + .15 + R() * (iz1 - iz0 - .3), zb = iz0 + .15 + R() * (iz1 - iz0 - .3);
        b.beam([ix0 + .05, .065, za], [ix1 - .05, .065, zb], .02, mix3(C.leafD, C.leaf, .3));
      }
    }
  }

  /* 稻草人：木杆十字架、旧外套、红金围巾、麻袋小脑袋、尖顶巫师帽、袖口和衣摆露稻草、横杆上一只乌鸦 */
  function scarecrow(b, x, z, ry) {
    const coat = [.38, .32, .42], coat2 = mix3(coat, [.2, .18, .24], .4), sack = [.8, .69, .5], hat = [.26, .22, .3], sf = mix3(C.banner, [.8, .2, .2], .3);
    b.at(x, .05, z, ry);
    b.beam([0, -.15, 0], [0, .8, 0], .032, OLDWD);
    b.beam([-.27, .62, 0], [.27, .62, 0], .028, OLDWD);
    b.at(0, 0, 0, 0, [1, 1, .55]); b.cyl(0, .3, 0, .155, .34, 4, coat, { r2: .1, a0: PI / 4 }); b.pop();      /* 外套：下宽上窄 */
    b.box(0, .37, .052, .012, .25, .008, coat2);
    for (const s of [-1, 1]) {
      b.beam([s * .06, .62, 0], [s * .23, .6, 0], .065, coat);                                       /* 袖子 */
      b.box(s * .24, .57, 0, .02, .07, .07, coat2);
      b.at(s * .27, .6, 0, 0, 1, 0, -s * PI / 2); b.cone(0, 0, 0, .03, .07, 4, HAY, { k: 1.2 }); b.pop();
    }
    for (const dx of [-.06, 0, .06]) { b.at(dx, .3, 0, 0, 1, PI); b.cone(0, 0, 0, .022, .07, 3, HAY, { k: 1.2 }); b.pop(); }
    b.box(.04, .42, .052, .06, .07, .008, mix3(coat, C.hay, .35));                                  /* 补丁 */
    b.box(0, .63, 0, .12, .035, .085, sf); b.box(0, .64, 0, .123, .012, .088, C.gold);               /* 围巾 */
    b.box(.035, .5, .046, .036, .13, .012, sf, { k: 1.15 }); b.box(.035, .54, .047, .037, .014, .013, C.gold, { k: 1.15 });
    b.sphere(0, .7, 0, .052, 6, sack, { sy: 1.08 });                                                 /* 麻袋脑袋：小 */
    b.box(0, .66, 0, .05, .012, .05, ROPE);
    for (const s of [-1, 1]) b.panel(s * .018, .708, .051, .012, .012, [.15, .12, .1]);
    b.panel(0, .682, .05, .03, .006, [.2, .15, .1]);
    b.cyl(0, .748, 0, .095, .012, 8, hat);                                                           /* 巫师帽 */
    b.cyl(0, .76, 0, .052, .07, 6, hat, { r2: .036 });
    b.cyl(0, .76, 0, .054, .016, 6, mix3(C.gold, C.woodD, .4));
    b.at(0, .83, 0, 0, 1, 0, .35); b.cone(0, 0, 0, .036, .1, 6, hat); b.pop();
    b.at(.19, .644, 0, -.5);                                                                          /* 乌鸦 */
    const k = [.1, .1, .12];
    b.box(0, 0, 0, .07, .035, .03, k); b.box(.042, .02, 0, .028, .028, .026, k);
    b.at(.063, .033, 0, 0, 1, 0, -PI / 2); b.cone(0, 0, 0, .008, .02, 3, [.5, .42, .2]); b.pop();
    b.tri([-.035, .02, 0], [-.075, -.01, 0], [-.035, .0, 0], k); b.tri([-.035, .0, 0], [-.075, -.01, 0], [-.035, .02, 0], k);
    b.pop();
    b.pop();
  }

  /* 水井：圆石井栏、压顶、井里的水、两根木柱撑石板瓦小顶、辘轳和摇把、吊桶 */
  function well(b, x, z, ry, cy) {
    reseed(91);
    b.at(x, 0, z, ry);
    b.cyl(0, -.14, 0, .36, .17, 10, STD, { top: mix3(DRESS2, C.stone, .4), a0: PI / 10, nb: true });
    rwall(b, 0, 0, .27, .26, .03, .34, 10, .105);
    tubeIn(b, 0, .1, 0, .19, .27, 10, INNER);
    b.disc(0, .16, 0, .19, 10, [.16, .26, .34], { mat: "water", k: 3 });
    b.ring(0, .37, 0, .3, .185, 10, DRESS);
    b.cyl(0, .34, 0, .3, .03, 10, DRESS2, { nt: true, nb: true });
    for (const s of [-1, 1]) { b.box(s * .25, .37, 0, .06, .56, .06, OLDWD); b.box(s * .25, .37, 0, .09, .05, .09, OLDWD); }
    b.box(0, .9, 0, .58, .04, .06, OLDWD);
    b.gable(0, .93, 0, .7, .5, .2, SL, { end: OLDWD });
    b.beam([-.36, 1.135, 0], [.36, 1.135, 0], .035, SL2);
    b.at(0, .68, 0, 0, 1, 0, PI / 2); b.cyl(0, -.22, 0, .045, .44, 6, OLDW); b.pop();
    b.beam([.25, .68, 0], [.34, .68, 0], .025, C.iron, M); b.beam([.34, .68, 0], [.34, .6, .04], .02, C.iron, M); b.beam([.34, .6, .04], [.4, .6, .04], .02, OLDWD);
    b.beam([0, .66, 0], [0, .5, 0], .012, ROPE);
    b.cyl(0, .41, 0, .05, .085, 6, OLDW, { r2: .06, top: [.2, .3, .38] }); b.cyl(0, .44, 0, .062, .015, 6, C.iron, { mat: "metal", nt: true, nb: true });
    b.beam([-.055, .5, 0], [.055, .5, 0], .01, C.iron, M);
    b.cyl(-.2, .03, .34, .055, .09, 6, OLDW, { r2: .065, top: [.2, .3, .38] });
    b.pop();
  }

  /* 干草垛、草捆、草叉（1994 在温室那个位置） */
  function bale(b, x, y, z, ry) { b.at(x, y, z, ry); b.box(0, 0, 0, .24, .12, .14, mix3(HAY, HAYD, R() * .4), { top: mix3(HAY, C.white, .1) }); for (const dx of [-.06, .06]) b.box(dx, -.002, 0, .012, .124, .144, HAYD); b.pop(); }
  function haystack(b, x, z) {
    reseed(55);
    b.at(x, 0, z);
    b.cyl(0, -.05, 0, .25, .26, 8, HAYD, { r2: .27, nt: true });
    b.cone(0, .21, 0, .28, .36, 8, HAY, { nb: true });
    b.beam([0, .5, 0], [0, .64, 0], .025, OLDWD);
    bale(b, .26, 0, .3, .3); bale(b, .02, 0, .36, -.15); bale(b, .14, .12, .33, .1);
    b.at(-.28, 0, .16, .5, 1, 0, -.2); b.beam([0, 0, 0], [0, .62, 0], .022, OLDW);
    for (const dx of [-.03, 0, .03]) b.beam([dx, -.01, 0], [dx, .07, 0], .01, C.iron, M);
    b.box(0, .06, 0, .08, .015, .015, C.iron, M); b.pop();
    b.pop();
  }
  function cart(b, x, z, ry) {                               /* 干草车 */
    reseed(66);
    b.at(x, 0, z, ry);
    b.box(0, .2, 0, .4, .05, .62, OLDW);
    for (const s of [-1, 1]) { b.box(s * .2, .25, 0, .025, .1, .62, OLDWD); b.at(s * .24, .17, -.05, 0, 1, 0, PI / 2); b.cyl(0, -.025, 0, .17, .05, 8, OLDWD); b.pop(); b.beam([s * .16, .2, .3], [s * .13, .03, .75], .03, OLDW); }
    b.box(0, .25, 0, .38, .12, .58, HAY); b.sphere(0, .37, -.02, .2, 6, HAY, { sy: .45 });
    b.pop();
  }
  function wheelbarrow(b, x, z, ry, load) {
    b.at(x, 0, z, ry);
    b.at(0, .07, .22, 0, 1, 0, PI / 2); b.cyl(0, -.02, 0, .07, .04, 8, OLDWD); b.pop();
    b.cyl(0, .12, 0, .1, .1, 4, OLDW, { r2: .15, a0: PI / 4, top: load ? HAY : OLDWD });
    for (const s of [-1, 1]) { b.beam([s * .08, .12, .22], [s * .12, .2, -.3], .025, OLDWD); b.beam([s * .09, .12, -.08], [s * .09, 0, -.1], .025, OLDWD); }
    if (load === "pump") { pumpkin(b, .03, .2, .02, .06, 6); pumpkin(b, -.05, .2, -.05, .055, 6); }
    b.pop();
  }

  /* ---------- 石砌谷仓（Lv2+） ---------- */
  function barn(b, X, Z, cy) {
    reseed(31);
    const W = 1.5, D = .9, P0 = .1, Hw = .86, Hr = .64, sl = Hr / (D / 2), ov = .1, yR = Hw + Hr, zf = D / 2;
    b.at(X, 0, Z);
    b.box(0, -.14, 0, W + .1, P0 + .14, D + .1, STD, { top: DRESS2, nb: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, zf, { ql: true, qr: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, -zf, { back: true, ql: true, qr: true });
    const gab = y => { const h = Math.min(D / 2, (yR + .07 - y) / sl); return [-h, h]; };
    for (const s of [-1, 1]) {                               /* 两头山墙：下段带隅石，上段压顶石出头 */
      b.at(s * W / 2, 0, 0, s * PI / 2);
      mason(b, () => [-D / 2, D / 2], P0, Hw, 0, { ql: true, qr: true });
      mason(b, gab, Hw, yR + .07, 0, {});
      lancet(b, 0, .4, 0, .1, .2);
      b.at(0, Hw + .26, .006); fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * .085, Math.sin(i / 8 * TAU) * .085]), 0, DRESS); fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * .055, Math.sin(i / 8 * TAU) * .055]), .004, INNER); b.pop();   /* 猫头鹰洞 */
      b.pop();
      for (const f of [-1, 1]) {
        b.beam([s * W / 2, Hw + .04, f * (D / 2 + .07)], [s * W / 2, yR + .12, 0], .1, DRESS);
        b.box(s * W / 2, Hw - .1, f * (D / 2 + .03), .14, .17, .18, DRESS2, { nb: true });
      }
      b.box(s * W / 2, yR + .12, 0, .1, .07, .1, DRESS); b.pyramid(s * W / 2, yR + .19, 0, .1, .1, .17, DRESS2);
    }
    /* 屋顶：石板瓦一道道深浅；前坡给吊货老虎窗让出口子 */
    const dw = .25, yD = Hw + .3, yDA = yD + .2, zBack = (yR - yD) / sl, ze = D / 2 + ov, ye = Hw - ov * sl, tCut = 1 - zBack / ze;
    const ts = [0, tCut / 3, tCut * 2 / 3, tCut, tCut + (1 - tCut) / 2, 1];
    for (const s of [-1, 1]) {
      for (let i = 0; i < ts.length - 1; i++) {
        const za = s * ze * (1 - ts[i]), zb = s * ze * (1 - ts[i + 1]), ya = ye + (yR - ye) * ts[i], yb = ye + (yR - ye) * ts[i + 1], col = i % 2 ? SL : SLM;
        const xs = s === 1 && ts[i] < tCut - 1e-6 ? [[-W / 2, -dw], [dw, W / 2]] : [[-W / 2, W / 2]];
        for (const [xa, xb] of xs) qf(b, [xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb], col, [0, 1, s]);
      }
      const zw = s * D / 2, xs = s === 1 ? [[-W / 2, -dw], [dw, W / 2]] : [[-W / 2, W / 2]];
      for (const [xa, xb] of xs) {
        qf(b, [xa, ye, s * ze], [xb, ye, s * ze], [xb, Hw, zw], [xa, Hw, zw], OLDWD, [0, -1, 0]);
        b.beam([xa, ye - .015, s * ze], [xb, ye - .015, s * ze], .035, OLDWD);
      }
    }
    b.beam([-W / 2, yR + .005, 0], [W / 2, yR + .005, 0], .06, SL2);
    /* 吊货老虎窗：石砌山花、木板门、吊杆、滑轮、绳和麻袋 */
    mason(b, () => [-dw, dw], Hw, yD, zf, { ql: true, qr: true, rh: .15 });
    mason(b, y => { const h = Math.max(.001, dw * (yDA + .02 - y) / (yDA + .02 - yD)); return [-h, h]; }, yD, yDA + .02, zf, {});
    for (const s of [-1, 1]) tf(b, [s * dw, yD, zBack], [s * dw, Hw, zf], [s * dw, yD, zf], sc(1), [s, 0, 0]);
    for (const s of [-1, 1]) qf(b, [s * (dw + .06), yD - .05, zf + .08], [0, yDA + .03, zf + .08], [0, yDA + .03, .02], [s * (dw + .06), yD - .05, .02], s < 0 ? SL : SLM, [s, 1, 0]);
    b.beam([0, yDA + .035, zf + .08], [0, yDA + .035, .02], .04, SL2);
    b.panel(0, Hw + .03, zf + .006, .24, .22, mix3(C.woodD, C.wood, .3));
    for (const dx of [-.06, 0, .06]) b.panel(dx, Hw + .03, zf + .009, .008, .22, mix3(C.woodD, [0, 0, 0], .4));
    for (const y of [Hw + .07, Hw + .2]) b.box(-.05, y, zf + .012, .14, .02, .008, C.iron, M);
    b.box(0, Hw + .25, zf + .01, .32, .04, .04, DRESS);
    b.beam([0, yD + .1, zf - .08], [0, yD + .1, zf + .3], .045, OLDWD);
    b.at(0, yD + .07, zf + .27, 0, 1, 0, PI / 2); b.cyl(0, -.015, 0, .035, .03, 6, C.iron, M); b.pop();
    b.beam([0, yD + .06, zf + .27], [0, Hw - .04, zf + .27], .01, ROPE);
    b.sphere(0, Hw - .1, zf + .27, .055, 5, [.66, .56, .4], { sy: 1.3 });
    /* 正门：尖拱料石门框、双扇铁钉木门、门槛石 */
    b.at(0, P0, zf);
    prism(b, outline(.62, .4, 0, .72, 4), -.03, .03, DRESS);
    b.at(0, 0, .034); door(b, .5, .4, .72, { planks: 6, straps: [.08, .3], ring: true }); b.pop();
    b.pop();
    b.box(0, -.14, zf + .14, .72, .18, .22, DRESS2, { nb: true, top: mix3(DRESS2, C.stone, .4) });
    for (const s of [-1, 1]) lancet(b, s * .48, .4, zf, .1, .2);
    for (const s of [-1, 1]) { buttress(b, s * (W / 2 - .07), zf, 0, .62); buttress(b, s * (W / 2 - .07), -zf, PI, .62); }
    buttress(b, 0, -zf, PI, .55);
    b.at(0, 0, 0, PI); for (const s of [-1, 1]) { b.panel(s * .36, .37, zf + .004, .08, .28, DRESS2); b.panel(s * .36, .4, zf + .007, .026, .22, INNER); b.panel(s * .36, .5, zf + .008, .08, .024, INNER); } b.pop();   /* 后墙十字通风缝 */
    b.beam([-.37, .66, zf], [-.37, .66, zf + .14], .02, cy ? BRASS : C.iron, M);
    b.beam([-.37, .66, zf + .13], [-.37, .6, zf + .13], .01, C.iron, M);
    lantern(b, -.37, .42, zf + .13, cy);
    ivy(b, -.6, P0, zf, .2, .68, 22);
    b.at(W / 2, 0, 0, PI / 2); ivy(b, -.3, P0, 0, .3, .9, 18); b.pop();
    /* 通风小塔：石座、百叶、石板瓦小尖顶、小旗 */
    const vx = .38;
    b.box(vx, yR - .12, 0, .2, .34, .2, DRESS2, { nb: true });
    for (let i = 0; i < 4; i++) {
      b.at(vx, 0, 0, i * PI / 2);
      b.panel(0, yR + .03, .101, .12, .13, INNER);
      for (const y of [.05, .09, .13]) b.box(0, yR + y, .1, .12, .012, .02, OLDWD);
      b.pop();
    }
    b.box(vx, yR + .22, 0, .27, .035, .27, DRESS, { nb: true });
    b.pyramid(vx, yR + .255, 0, .25, .25, .26, SL);
    const top = flag(b, vx, yR + .5, 0, C.banner, cy);
    /* 门边草捆 */
    bale(b, .48, 0, zf + .24, .2); bale(b, .46, .12, zf + .23, .05); bale(b, .7, 0, zf + .2, -.3);
    b.pop();
    return top;
  }

  /* ---------- 塔式风车（Lv3） ---------- */
  function windmill(b, X, Z, cy) {
    reseed(57);
    const SEG = 12, y0 = .1, y1 = 2.05, r0 = .41, r1 = .3, rAt = y => r0 + (r1 - r0) * Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
    b.at(X, 0, Z);
    b.cyl(0, -.14, 0, .5, .24, SEG, STD, { top: DRESS2, a0: PI / SEG, nb: true });
    rwall(b, 0, 0, r0, r1, y0, y1, SEG, .195);
    b.cyl(0, 1.08, 0, rAt(1.08) + .03, .05, SEG, DRESS2, { r2: rAt(1.13) + .03, a0: PI / SEG });
    for (let i = 0; i < 14; i++) { b.at(0, 0, 0, (i + .5) / 14 * TAU); b.box(0, y1 - .13, r1 + .02, .06, .07, .06, DRESS2, { nb: true }); b.pop(); }   /* 一圈托石 */
    b.cyl(0, y1 - .06, 0, r1 + .07, .09, SEG, DRESS, { a0: PI / SEG });
    const tip = spire(b, 0, y1 + .03, 0, r1 + .1, .8, SEG, cy);
    const top = flag(b, 0, tip, 0, C.banner2, cy);
    const aD = .62;                                          /* 门朝右前 */
    b.at(0, 0, 0, aD);
    prism(b, outline(.3, .28, 0, .72, 4), r0 - .07, r0 + .03, DRESS);
    b.at(0, y0, r0 + .034); door(b, .22, .28 - y0 + .1, .72, { planks: 4, straps: [.08, .22] }); b.pop();
    b.box(0, -.14, r0 + .14, .38, .2, .2, DRESS2, { nb: true, top: mix3(DRESS2, C.stone, .4) });
    b.pop();
    for (const [a, y, h] of [[-.55, .7, .2], [2.3, 1.25, .2], [-2.4, .55, .18], [.1, 1.45, .2]]) { b.at(0, 0, 0, a); lancet(b, 0, y, rAt(y + .1) - .005, .09, h, { z0: -.06 }); b.pop(); }
    rivy(b, 0, 0, rAt, -1.4, 1.1, y0, 1.1, 22);
    b.at(0, 0, 0, aD + .42); b.beam([0, .62, r0 - .03], [0, .62, r0 + .13], .02, cy ? BRASS : C.iron, M); b.beam([0, .62, r0 + .12], [0, .56, r0 + .12], .01, C.iron, M); lantern(b, 0, .36, r0 + .12, cy); b.pop();
    /* 风轴、轮毂、四片帆布风叶（慢慢转） */
    const yh = y1 + .2, zh = r1 + .3;
    b.at(0, yh, 0, 0, 1, PI / 2); b.cyl(0, .1, 0, .055, zh - .1, 6, OLDWD); b.pop();
    const CAN = mix3(C.cream, C.hay, .22), CAN2 = mix3(CAN, C.dirt, .25), RIM = cy ? BRASS : C.iron;
    b.spin(0, yh, zh + .03, "z", .45, sb => {
      sb.at(0, 0, -.06, 0, 1, PI / 2); sb.cyl(0, 0, 0, .09, .12, 8, OLDWD, { top: RIM }); sb.pop();
      sb.box(0, -.02, .06, .04, .04, .03, RIM, M);
      for (let k = 0; k < 4; k++) {
        sb.at(0, 0, 0, 0, 1, 0, k * PI / 2 + .35);
        sb.beam([0, -.08, 0], [0, 1.02, 0], .05, OLDWD);
        sb.beam([.21, .2, -.012], [.21, 1.0, -.012], .022, OLDW);
        for (let y = .2; y < 1.02; y += .2) sb.beam([.015, y, -.012], [.21, y, -.012], .016, OLDW);
        sb.quad([.02, .21, -.024], [.205, .21, -.024], [.205, .99, -.024], [.02, .99, -.024], CAN);
        sb.quad([.205, .21, -.028], [.02, .21, -.028], [.02, .99, -.028], [.205, .99, -.028], CAN2);
        sb.pop();
      }
    });
    /* 门口面粉袋 */
    const p = [Math.sin(aD + .5) * (r0 + .2), Math.cos(aD + .5) * (r0 + .2)];
    for (const [dx, dz] of [[0, 0], [.1, .05], [.04, .12]]) { b.sphere(p[0] + dx, .09, p[1] + dz, .065, 5, mix3([.74, .66, .5], [.62, .53, .38], R()), { sy: 1.25 }); b.cone(p[0] + dx, .16, p[1] + dz, .03, .05, 4, [.56, .47, .33]); }
    b.pop();
    return top;
  }

  /* ---------- 黄铜框玻璃温室（2077） ---------- */
  function greenhouse(b, X, Z, ry) {
    reseed(77);
    const W = .62, D = .84, yb = .16, yw = .5, yr = .78, G = mix3(C.glass, C.white, .25), GL = { mat: "glass" }, t = .02;
    b.at(X, 0, Z, ry);
    b.box(0, -.14, D / 2 - .03, W, .3, .06, ST2, { top: DRESS, nb: true }); b.box(0, -.14, -D / 2 + .03, W, .3, .06, ST2, { top: DRESS, nb: true });
    for (const s of [-1, 1]) b.box(s * (W / 2 - .03), -.14, 0, .06, .3, D - .12, ST2, { top: DRESS, nb: true });
    b.box(0, -.1, 0, W - .1, .13, D - .1, mix3(C.stone, C.dirt, .25), { nb: true });
    /* 玻璃 */
    for (const s of [-1, 1]) {
      b.quad([-W / 2, yb, s * D / 2], [W / 2, yb, s * D / 2], [W / 2, yw, s * D / 2], [-W / 2, yw, s * D / 2], G, GL);
      b.tri([-W / 2, yw, s * D / 2], [W / 2, yw, s * D / 2], [0, yr, s * D / 2], G, GL);
      b.quad([s * W / 2, yb, -D / 2], [s * W / 2, yb, D / 2], [s * W / 2, yw, D / 2], [s * W / 2, yw, -D / 2], G, GL);
      b.quad([s * (W / 2 + .03), yw - .024, -D / 2 - .03], [s * (W / 2 + .03), yw - .024, D / 2 + .03], [0, yr, D / 2 + .03], [0, yr, -D / 2 - .03], G, GL);
    }
    /* 黄铜骨架 */
    const bm = (p, q, w) => b.beam(p, q, w || t, BRASS, M);
    for (const s of [-1, 1]) {
      for (let i = 0; i <= 3; i++) { const z = -D / 2 + i * D / 3; bm([s * W / 2, yb, z], [s * W / 2, yw, z]); if (i > 0 && i < 3) bm([s * W / 2, yw, z], [0, yr, z], .016); }
      bm([s * W / 2, yw, -D / 2 - .03], [s * W / 2, yw, D / 2 + .03], .026);
      bm([s * W / 2, yb, -D / 2], [s * W / 2, yb, D / 2], .024);
      bm([-W / 2, yb, s * D / 2], [W / 2, yb, s * D / 2], .024);
      bm([-W / 2, yw, s * D / 2], [W / 2, yw, s * D / 2], .022);
      for (const sx of [-1, 1]) bm([sx * W / 2, yw, s * (D / 2 + .03)], [0, yr, s * (D / 2 + .03)], .024);
      b.sphere(0, yr + .045, s * (D / 2 + .03), .03, 5, BRASS, M); b.cone(0, yr + .07, s * (D / 2 + .03), .012, .08, 4, BRASS, M);
    }
    bm([0, yr, -D / 2 - .03], [0, yr, D / 2 + .03], .03);
    for (const sx of [-1, 1]) bm([sx * .11, yb, D / 2], [sx * .11, yw, D / 2], .018);
    bm([-.11, .44, D / 2], [.11, .44, D / 2], .016);
    b.box(.07, .3, D / 2 + .012, .012, .03, .012, BRASS, M);
    /* 里面：两侧花架、盆栽 */
    for (const s of [-1, 1]) {
      b.box(s * .17, .02, 0, .15, .2, D - .2, OLDWD, { top: OLDW });
      for (let i = 0; i < 2; i++) {
        const z = s > 0 ? -.2 + i * .34 : -.08 + i * .3, pc = mix3([.72, .38, .25], [.6, .3, .2], R());
        b.cyl(s * .17, .22, z, .045, .06, 5, pc, { r2: .055, nb: true });
        const t2 = R(), lc = t2 < .55 ? mix3(C.leaf, C.leaf2, R()) : t2 < .8 ? C.leafD : mix3(C.bloom, C.leaf2, .2);
        b.sphere(s * .17, .34, z, .075 + R() * .025, 5, lc, { sy: .9 });
      }
    }
    b.cyl(0, .02, -.2, .02, .3, 5, C.woodD); b.sphere(0, .42, -.2, .13, 6, mix3(C.leaf, C.leafD, .4), { sy: .85 });   /* 中间一棵小橘树 */
    for (let i = 0; i < 4; i++) b.sphere(Math.cos(i * 1.6) * .1, .42 + Math.sin(i * 2.3) * .06, -.2 + Math.sin(i * 1.6) * .1, .022, 4, [.98, .62, .2]);
    b.pop();
  }
  function catLamp(b, x, z, h) {                             /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯 */
    b.cyl(x, -.05, z, .045, .08, 6, DRESS2);
    b.beam([x, 0, z], [x, h, z], .022, BRASS, M);
    b.beam([x, h, z], [x + .1, h + .06, z], .016, BRASS, M);
    b.beam([x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, M);
    b.sphere(x, h + .01, z, .025, 4, BRASS, M);
    b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }

  /* ---------- 各级布局 ---------- */
  const LAY = {
    1: {
      fields: [{ seed: 1, kind: "A", x0: -1.5, x1: .6, z0: -1.1, z1: 1.3, gate: -.45, lamp: true, scare: [.08, -.55], rows: ["cab", "pump", "cab", "pump", "cab"] }],
      well: [1.12, .32, -.4], g: [1.12, -.64], barrow: [1.12, 1.05, .6, "pump"], lamps: [[-.27, .55], [-1.05, -.45]]
    },
    2: {
      fields: [{ seed: 2, kind: "A", x0: -1.6, x1: .7, z0: -.3, z1: 1.4, gate: -.7, back: -.7, lamp: true, scare: [-.18, .08], rows: ["cab", "pump", "pur", "pump"] }],
      barn: [-.7, -1.0], well: [1.12, -.12, -.3], g: [.42, -.98], well77: [.42, -.78, .3], g77: [1.2, -.12, -PI / 2], cart: [1.17, -1.0, -.35], barrow: [1.18, .95, .9, "pump"], pile: [1.05, .62], lamps: [[-.52, .55], [.25, .5]]
    },
    3: {
      fields: [{ seed: 3, kind: "A", x0: -1.6, x1: .1, z0: -.3, z1: 1.4, gate: -.7, back: -.7, lamp: true, scare: [-1.12, .1], rows: ["cab", "pump", "pur", "pump"] },
        { seed: 4, kind: "B", x0: .38, x1: 1.6, z0: .42, z1: 1.4, gate: 1.0, big: [[.68, .72, .2], [1.32, .7, .17], [.62, 1.12, .15], [1.36, 1.13, .22]] }],
      barn: [-.7, -1.0], mill: [1.18, -.98], well: [.98, -.06, -.3], g: [.42, -.98], well77: [.42, -.78, .3], g77: [1.05, -.06, -PI / 2], lamps: [[-.52, .55], [.24, .5], [1.0, .9]]
    }
  };

  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, L = LAY[lv];
    for (const F of L.fields) { stoneWallsOf(b, F, cy); crops(b, F, cy); }
    for (const F of L.fields) if (F.scare) { reseed(F.seed + 9); scarecrow(b, F.scare[0], F.scare[1], .35); }
    const W9 = cy && L.well77 ? L.well77 : L.well, G9 = cy && L.g77 ? L.g77 : L.g;
    well(b, W9[0], W9[1], W9[2], cy);
    if (cy) greenhouse(b, G9[0], G9[1], G9[2] || 0); else haystack(b, G9[0], G9[1]);
    if (L.barn) barn(b, L.barn[0], L.barn[1], cy);
    if (L.mill) windmill(b, L.mill[0], L.mill[1], cy);
    if (L.cart) cart(b, L.cart[0], L.cart[1], L.cart[2]);
    if (L.barrow) { reseed(41); wheelbarrow(b, L.barrow[0], L.barrow[1], L.barrow[2], L.barrow[3]); }
    if (L.pile) { reseed(43); for (const [dx, dz, r] of [[0, 0, .1], [.17, .04, .085], [.08, .16, .09], [.08, .06, .075]]) pumpkin(b, L.pile[0] + dx, dz === .06 ? .12 : 0, L.pile[1] + dz, r, 6); }
    if (cy) for (const [x, z] of L.lamps) catLamp(b, x, z, .78);
    const F0 = L.fields[0];
    b.emit((F0.x0 + F0.x1) / 2, .35, F0.z0 + .4, "firefly", 4, 1);
  }
  build.h = o => [0, 1.37, 2.77, 3.65][Math.max(1, Math.min(3, o.lv || 1))];   /* 井顶／谷仓小旗／风车小旗顶＋0.2 */
  Isle3D.FAC["田圃"] = build;
})();
