/* 牧栏：霍格沃茨城堡脚下的放牧场（海格小屋那一带的味道）。
   1994：一圈旧木栅栏围起一片草场（歪歪的方木桩、两道横杆、五横档的木栅门半开，门柱上挑一盏铁提灯）；
         后面一座石砌牲棚：毛石墙、转角隅石、扶壁、深蓝灰石板瓦陡顶（一道道瓦层）、山墙压顶石和尖顶饰、尖拱门洞配半截马厩门、尖拱烛光小窗、
         侧墙挂着草料架、墙角常春藤、屋脊上一只铁风向标（慢慢转）和一条蹲着的小威尔士绿龙；
         右后一座草料垛：蘑菇石墩架起木台，方垛上盖草顶、压着吊石的草绳，靠着梯子、插着草叉；
         草场里一只风暴灰的鹰马（鹰头、鹰翼、鹰爪的前腿，马身马尾），几只黑脸绵羊在吃草，一口带铁手摇泵的石砌饮水槽。
         Lv2 加大棚：一座三开间的石砌敞棚，正面一排尖拱券廊（料石拱券、拱肩、腰线），里头木桁架、通长草料架、堆着草捆，
             一只栗色鹰马卧在干草上，屋脊正中一座百叶通风小塔；草料垛挪到右侧。
         Lv3 加鹰马栖架和第二个围场：右侧一座矮圆石塔，塔顶城堞围着木平台，栗色鹰马半张着翅膀站在上面，侧面挑出一根栖木、靠一架木梯、插一面小旗；
             右前再围一圈圆形羊圈，中间一个铁箍草料架。
   2077：同一套石头底子；木栅栏换成石墩之间的黑铁矛头栏杆（矮石基、上下横杆），门换成双扇铁门；
         加一座小玻璃孵化房（八角石座、黄铜骨架的玻璃墙和玻璃穹顶，里面草窝里三枚龙蛋、一盏小暖灯、一只刚孵出的小龙）；
         提灯框、水泵、风向标换黄铜，几根黄铜细杆托着浮着的猫球灯。不加霓虹、不加全息。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45), INWALL = mix3(ST2, STD, .45);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLM = mix3(SL, SL2, .5), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), IRON = mix3(C.iron, [.1, .1, .12], .3);
  const OLDW = mix3(C.wood, [.55, .52, .48], .35), OLDWD = mix3(C.woodD, [.4, .38, .36], .25), ROPE = [.72, .63, .46];
  const DOORW = mix3(C.woodD, C.wood, .3), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const HAY = mix3(C.hay, [.86, .62, .26], .22), HAYD = mix3(C.hay, C.wood, .3), STRAW = mix3(C.hay, C.dirt, .35);
  const TURF = mix3(C.grass, [.5, .56, .3], .25), MUD = mix3(C.dirt, C.soil, .5);
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  /* ---------- 石头颜色 ---------- */
  function sc(y) {
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .42 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .94) c = mix3(c, STD, .35);
    return mix3(c, mix3(STD, C.ivy, .35), Math.max(0, Math.min(.3, (.6 - y) * .45)));
  }

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
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function qf(b, A, B, Cc, D, col, hint, o) {
    const n = cross([B[0] - A[0], B[1] - A[1], B[2] - A[2]], [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]]);
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross([B[0] - A[0], B[1] - A[1], B[2] - A[2]], [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]]);
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }      /* 两面都看得见的薄片（翅膀、旗） */
  function along(b, p, q) {                                 /* 以 p 为原点、p→q 为 y 轴推一层变换，返回长度 */
    const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]);
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    return L;
  }
  function bar(b, p, q, t, col, o) {                        /* 细方条，不封两头（栏杆、横杆、骨架） */
    const L = along(b, p, q), h = t / 2;
    if (L > 1e-6) {
      b.quad([-h, 0, h], [h, 0, h], [h, L, h], [-h, L, h], col, o); b.quad([h, 0, -h], [-h, 0, -h], [-h, L, -h], [h, L, -h], col, o);
      b.quad([h, 0, h], [h, 0, -h], [h, L, -h], [h, L, h], col, o); b.quad([-h, 0, -h], [-h, 0, h], [-h, L, h], [-h, L, -h], col, o);
    }
    b.pop();
  }
  function limb(b, p, q, r0, r1, seg, col, o) {              /* 两点之间一段收分圆柱（腿、脖子、尾巴、圆木） */
    const L = along(b, p, q);
    if (L > 1e-6) b.cyl(0, 0, 0, r0, L, seg, col, Object.assign({ r2: r1, nt: true, nb: true }, o || {}));
    b.pop();
  }
  const bobOr = (b, o, x, y, z, amp, spd, fn) => { if (o.bad) { b.at(x, y, z); fn(b); b.pop(); } else b.bob(x, y, z, amp, spd, fn); };
  const spinOr = (b, o, x, y, z, ax, spd, fn) => { if (o.bad) { b.at(x, y, z); fn(b); b.pop(); } else b.spin(x, y, z, ax, spd, fn); };

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .16, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? (j % 2 ? .11 : .2) : 0, q1 = o.qr ? (j % 2 ? .2 : .11) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
      while (x < Rr - (q1 ? q1 + .07 : .07)) { cuts.push(x); x += .17 + R() * .2; }
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
  }
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) {
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, x, z, ry, h) {                       /* 两级扶壁 */
    b.at(x, 0, z, ry);
    wedge(b, .14, -.1, -.02, .22, h * .45 + .1, h * .3 + .1, mix3(ST2, STD, .3));
    wedge(b, .1, -.1, -.02, .13, h + .1, h * .84 + .1, sc(.6));
    b.pop();
  }

  /* ---------- 屋顶、窗、门、灯、旗、藤 ---------- */
  function slateRoof(b, W, Hw, D, Hr, ov, o) {               /* 石板瓦人字顶：一道道瓦层（每层下沿翘起一点、露出暗色瓦口），檐下封檐板；o.under 给敞棚画屋里那面 */
    o = o || {};
    const sl = Hr / (D / 2), ze = D / 2 + ov, ye = Hw - ov * sl, yR = Hw + Hr, nb = o.bands || 5, xa = -W / 2, xb = W / 2, lip = .016;
    for (const s of [-1, 1]) {
      const nn = Math.hypot(ze, yR - ye), nY = ze / nn, nZ = s * (yR - ye) / nn, dn = [0, -(yR - ye), s * ze];
      for (let i = 0; i < nb; i++) {
        const t0 = i / nb, t1 = (i + 1) / nb, zr = s * ze * (1 - t0), yr = ye + (yR - ye) * t0, za = zr + nZ * lip, ya = yr + nY * lip, zb = s * ze * (1 - t1), yb = ye + (yR - ye) * t1;
        qf(b, [xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb], i % 2 ? SL : SLM, [0, 1, s]);
        qf(b, [xa, yr, zr], [xb, yr, zr], [xb, ya, za], [xa, ya, za], SLD, dn);
      }
      for (let k = 0; k < (o.patches || 5); k++) {                 /* 换过的几片新瓦、长了苔的旧瓦：贴在瓦层上的小块 */
        const i = Math.floor(R() * nb), t0 = i / nb, t1 = (i + 1) / nb, w = .08 + R() * .14, x0 = xa + .06 + R() * (xb - xa - .12 - w);
        const lo = [s * ze * (1 - t0) + nZ * lip, ye + (yR - ye) * t0 + nY * lip], hi = [s * ze * (1 - t1), ye + (yR - ye) * t1], u0 = .12, u1 = .5 + R() * .4;
        const P = u => [lo[1] + (hi[1] - lo[1]) * u + nY * .004, lo[0] + (hi[0] - lo[0]) * u + nZ * .004];
        const A = P(u0), Bq = P(u1), c = R() < .35 ? mix3(SLM, C.ivy, .3) : R() < .5 ? mix3(SL, SL2, .75) : mix3(SL, SLD, .6);
        qf(b, [x0, A[0], A[1]], [x0 + w, A[0], A[1]], [x0 + w, Bq[0], Bq[1]], [x0, Bq[0], Bq[1]], c, [0, 1, s]);
      }
      qf(b, [xa, ye, s * ze], [xb, ye, s * ze], [xb, Hw, s * D / 2], [xa, Hw, s * D / 2], OLDWD, [0, -1, 0]);
      b.beam([xa, ye - .016, s * ze], [xb, ye - .016, s * ze], .032, OLDWD);
      if (o.under) qf(b, [xa, Hw, s * (D / 2 - .02)], [xb, Hw, s * (D / 2 - .02)], [xb, yR - .03, 0], [xa, yR - .03, 0], o.under, [0, -1, -s]);
    }
    b.at(0, yR + .012, 0, 0, 1, PI / 4); b.box(0, -.03, 0, W + .02, .06, .06, SL2); b.pop();   /* 屋脊瓦：转 45° 的方条 */
    return yR;
  }
  function coping(b, x, Hw, D, Hr, ov) {                     /* 山墙压顶石、墙肩托石、山尖尖顶饰 */
    const sl = Hr / (D / 2), yR = Hw + Hr, o2 = ov + .02;
    for (const f of [-1, 1]) {
      b.beam([x, Hw - o2 * sl + .05, f * (D / 2 + o2)], [x, yR + .07, 0], .1, DRESS);
      b.box(x, Hw - .14, f * (D / 2 + .03), .14, .16, .17, DRESS2, { nb: true });
    }
    b.box(x, yR + .09, 0, .1, .07, .1, DRESS); b.pyramid(x, yR + .16, 0, .1, .1, .16, DRESS2);
  }
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱小窗：料石框、烛光、窗棂、窗台 */
    o = o || {};
    const p = .72, fr = .032;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), o.z0 != null ? o.z0 : -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, WIN, { e: o.e != null ? o.e : .55 });
    b.box(0, h * .55, .022, w, .012, .012, C.iron);
    b.box(0, -.002, .022, .012, h + .06, .012, C.iron);
    b.box(0, -fr - .03, .0, w + fr * 2 + .04, .03, .08, DRESS2);
    b.pop();
  }
  function owlHole(b, x, y, z, r) {
    b.at(x, y, z);
    fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * r, Math.sin(i / 8 * TAU) * r]), 0, DRESS);
    fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * r * .62, Math.sin(i / 8 * TAU) * r * .62]), .004, INNER);
    b.pop();
  }
  function lantern(b, x0, y0, z0, cy) {                     /* 铁提灯（四角，暖光）；2077 黄铜框 */
    const fr = cy ? BRASS : C.iron;
    b.at(x0, y0, z0, 0, .72);
    b.cyl(0, 0, 0, .06, .025, 4, fr, { mat: "metal", a0: PI / 4, nb: true });
    b.cyl(0, .025, 0, .042, .12, 4, C.lamp, { r2: .05, e: .68, a0: PI / 4, nt: true, nb: true });
    for (let i = 0; i < 4; i++) { const a = PI / 4 + i * PI / 2; bar(b, [Math.cos(a) * .046, .025, Math.sin(a) * .046], [Math.cos(a) * .055, .145, Math.sin(a) * .055], .012, fr, M); }
    b.cone(0, .145, 0, .072, .09, 4, fr, { mat: "metal", a0: PI / 4 });
    b.pyramid(0, .23, 0, .025, .025, .04, fr, M);
    b.pop();
  }
  function flag(b, x, y, z, col, cy) {                      /* 小旗：铁杆、金球、随风摆的尖角旗 */
    b.beam([x, y - .1, z], [x, y + .5, z], .02, cy ? BRASS : C.iron, M);
    b.sphere(x, y + .52, z, .026, 4, C.gold, M);
    const L = .32, Hh = .14, top = y + .47, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .01 + L * t0, x1 = x + .01 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .55) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
    return y + .55;
  }
  function ivy(b, x, y0, z, w, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .024 + R() * .026, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, rAt, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .024 + R() * .026;
      b.at(0, 0, 0, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], rAt(py) + .012 + R() * .01, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function door(b, w, h, p, o) {                            /* 尖拱铁钉木门（面朝 +z，原点在门底中点） */
    o = o || {};
    fan(b, outline(w, h, 0, p, 4), 0, DOORW);
    const n = o.planks || 4;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .008, h + .02, DARK); }
    for (const y of o.straps || [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .024, .012, C.iron, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .04 + i * (w - .08) / 3, y + .006, .0125, .013, .013, C.metal, M);
    }
  }
  function catLamp(b, x, z, h) {                             /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯 */
    b.cyl(x, -.05, z, .045, .08, 6, DRESS2);
    b.beam([x, 0, z], [x, h, z], .022, BRASS, M);
    b.beam([x, h, z], [x + .1, h + .06, z], .016, BRASS, M);
    b.beam([x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, M);
    b.sphere(x, h + .01, z, .025, 4, BRASS, M);
    b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }
  function bale(b, x, y, z, ry) {                           /* 草捆：两道捆绳 */
    b.at(x, y, z, ry); b.box(0, 0, 0, .24, .12, .14, mix3(HAY, HAYD, R() * .4), { top: mix3(HAY, C.white, .1), nb: true });
    for (const dx of [-.06, .06]) { b.quad([dx - .006, .1205, .0705], [dx + .006, .1205, .0705], [dx + .006, .1205, -.0705], [dx - .006, .1205, -.0705], HAYD); b.panel(dx, 0, .0705, .012, .12, HAYD); }
    b.pop();
  }

  /* ================= 生物 ================= */
  /* 绵羊：一团毛的身子、细黑腿、小小的黑脸（头长只有身长的三分之一） */
  const WOOL = [.84, .81, .74], WOOL2 = [.74, .7, .63], FACE = [.17, .15, .15], FACE2 = [.78, .7, .58];
  function sheepHead(b, F, W) {                             /* 面朝 +z：长脸、方口鼻、两只横着的耳朵、头顶一撮毛 */
    b.box(0, -.026, -.01, .046, .05, .07, F, { nb: true });
    b.box(0, -.03, .035, .034, .036, .03, F, { nb: true });
    b.sphere(0, .02, -.028, .03, 4, W);
    for (const s of [-1, 1]) { tri2(b, [s * .02, .012, -.03], [s * .065, .0, -.02], [s * .02, .0, -.005], F); b.panel(s * .0235, -.002, .012, .006, .007, [.04, .04, .04]); }
  }
  function sheep(b, o, x, z, ry, k) {
    k = k || {};
    const F = k.cream ? FACE2 : FACE, L = k.cream ? mix3(FACE2, [.3, .26, .22], .55) : FACE, W = mix3(WOOL, WOOL2, R() * .8), lie = !!k.lie, yb = lie ? .1 : .2;
    b.at(x, 0, z, ry, k.s || 1);
    if (!lie) for (const sx of [-.046, .046]) for (const sz of [.085, -.09]) b.box(sx, 0, sz, .02, .13, .024, L, { nb: true });
    else for (const sx of [-.05, .05]) b.box(sx, 0, .1, .022, .022, .07, L, { nb: true });
    b.at(0, yb, -.005, 0, [1, .84, 1.35]); b.sphere(0, 0, 0, .112, 7, W, { grad: mix3(W, WOOL2, .7) }); b.pop();
    b.sphere(0, yb + .065, .045, .062, 5, mix3(W, C.white, .12));
    b.sphere(.012, yb + .06, -.075, .066, 4, mix3(W, WOOL2, .4));
    b.box(0, yb - .02, -.165, .036, .05, .03, W);
    if (k.graze) {
      limb(b, [0, yb - .01, .1], [0, .085, .175], .052, .036, 5, W);
      bobOr(b, o, 0, .06, .2, .012, 1.2 + R(), sb => { sb.at(0, 0, 0, 0, 1, 1.15); sheepHead(sb, F, W); sb.pop(); });
    } else {
      b.sphere(0, yb + .04, .13, .055, 5, W);
      b.at(0, yb + .09, .175, 0, 1, .35); sheepHead(b, F, W); b.pop();
    }
    b.pop();
  }

  /* 鹰马：马的后半身（马臀、马后腿、马尾），鹰的前半身（白羽胸、鹰爪前腿、鹰头弯喙、收拢的翅膀）。肩高约半个门高，头小。 */
  const HP = {
    grey: { coat: [.5, .5, .52], coat2: [.4, .4, .43], fea: [.64, .64, .65], fea2: [.86, .86, .84], prim: [.33, .34, .39], head: [.8, .8, .79], beak: [.8, .7, .44], hoof: [.2, .18, .18], tail: [.3, .3, .33] },
    bay: { coat: [.52, .34, .21], coat2: [.4, .26, .16], fea: [.58, .43, .28], fea2: [.82, .74, .6], prim: [.3, .22, .16], head: [.93, .91, .87], beak: [.88, .72, .34], hoof: [.18, .15, .13], tail: [.24, .17, .12] }
  };
  function hipHead(b, P) {
    b.at(0, 0, 0, 0, [1, 1, 1.25]); b.sphere(0, 0, 0, .048, 6, P.head); b.pop();
    b.at(0, -.006, .05, 0, 1, PI / 2 + .3); b.cone(0, 0, 0, .023, .068, 5, P.beak); b.pop();
    b.at(0, -.023, .11, 0, 1, PI * .82); b.cone(0, 0, 0, .009, .022, 3, mix3(P.beak, [.2, .18, .15], .4)); b.pop();
    for (const s of [-1, 1]) { b.at(s * .047, .01, .024, s * PI / 2); b.panel(0, -.007, 0, .016, .014, [.82, .5, .12]); b.panel(.002, -.004, .001, .006, .007, [.08, .06, .05]); b.pop(); }
    for (const [dx, dy] of [[0, .03], [-.018, .02], [.018, .02]]) { b.at(dx, dy, -.045, 0, 1, -1.05); b.cone(0, 0, 0, .012, .05, 3, mix3(P.head, P.fea, .5), { nb: true }); b.pop(); }
  }
  function hipWing(b, P, s) {                               /* 一边翅膀：覆羽、次级飞羽、带锯齿的初级飞羽；两面都画 */
    const v = (x, y, z) => [s * x, y, z];
    const A = v(0, 0, .03), B = v(-.012, .025, -.14), Mi = v(.012, -.085, -.2), E = v(.022, -.165, -.04);
    const T1 = v(-.02, -.02, -.47), N1 = v(-.012, -.065, -.41), T2 = v(-.014, -.1, -.45), N2 = v(-.002, -.13, -.37), D = v(.01, -.17, -.31);
    tri2(b, A, B, Mi, P.fea); tri2(b, A, Mi, E, mix3(P.fea, P.fea2, .25));
    tri2(b, Mi, D, E, mix3(P.fea, P.prim, .45));
    const pr = mix3(P.prim, P.fea, .25);
    tri2(b, B, T1, N1, pr); tri2(b, B, N1, Mi, pr); tri2(b, Mi, N1, T2, P.prim); tri2(b, Mi, T2, N2, P.prim); tri2(b, Mi, N2, D, mix3(P.prim, P.fea, .45));
  }
  function hippogriff(b, o, x, y, z, ry, P, pose) {
    const rest = pose === "rest", dy = rest ? -.22 : 0;
    b.at(x, y, z, ry);
    if (!rest) {
      for (const s of [-1, 1]) {                             /* 马后腿：大腿、飞节往后、管骨、蹄 */
        const hx = s * .062;
        limb(b, [hx, .41, -.19], [hx, .18, -.26], .058, .033, 5, P.coat);
        b.sphere(hx, .18, -.26, .033, 4, P.coat2);
        limb(b, [hx, .18, -.26], [hx, .04, -.235], .024, .02, 4, P.coat2);
        b.cyl(hx, 0, -.235, .028, .045, 5, P.hoof, { r2: .022, nb: true });
      }
      for (const s of [-1, 1]) {                             /* 鹰爪前腿：羽毛"裤子"、黄鳞小腿、三趾 */
        const fx = s * .06;
        limb(b, [fx, .37, .12], [fx, .17, .2], .052, .03, 5, mix3(P.fea, P.fea2, .3), { nt: false });
        limb(b, [fx, .18, .2], [fx, .02, .19], .018, .015, 4, P.beak);
        for (const a of [-.45, 0, .45]) { b.at(fx, .008, .19, a, 1, PI / 2); b.pyramid(0, 0, 0, .016, .016, .065, P.beak); b.pyramid(0, .055, 0, .008, .008, .022, P.hoof); b.pop(); }
      }
    } else {
      for (const s of [-1, 1]) {                             /* 卧着：后腿折在身下、前爪往前伸 */
        b.sphere(s * .075, .14, -.2, .07, 5, P.coat);
        b.box(s * .09, 0, -.08, .04, .035, .18, P.coat2);
        limb(b, [s * .06, .16, .14], [s * .055, .03, .25], .04, .026, 5, P.fea);
        b.box(s * .055, 0, .29, .04, .02, .07, P.beak);
      }
    }
    b.at(0, .385 + dy, -.04, 0, [1, 1.12, 2.4]); b.sphere(0, 0, 0, .11, 7, P.coat, { grad: P.coat2 }); b.pop();
    b.sphere(0, .41 + dy, -.2, .106, 6, P.coat);
    b.at(0, .42 + dy, .15, 0, [1, 1.08, 1]); b.sphere(0, 0, 0, .12, 6, P.fea, { grad: P.fea2 }); b.pop();
    limb(b, [0, .45 + dy, -.29], [0, .19 + dy * .4, -.36], .022, .046, 4, P.tail, { k: 1.25, nb: false });
    /* 脖子和头 */
    let N, H, pitch;
    if (pose === "peck") { N = [0, .3, .34]; H = [0, .23, .37]; pitch = 1.1; }
    else if (pose === "perch") { N = [0, .62, .28]; H = [0, .655, .31]; pitch = -.1; }
    else { N = [0, .6 + dy, .3]; H = [0, .635 + dy, .33]; pitch = .15; }
    limb(b, [0, .45 + dy, .19], N, .074, .05, 6, P.fea);
    bobOr(b, o, H[0], H[1], H[2], .008, 1 + R() * .5, sb => { sb.at(0, 0, 0, 0, 1, pitch); hipHead(sb, P); sb.pop(); });
    /* 翅膀：收拢贴在身侧；栖架上的半张开、一扇一扇 */
    const wings = (bb, sp) => { for (const s of [-1, 1]) { bb.at(s * .1, .52 + dy, .13, 0, sp ? 1 : [1, .78, .76], sp ? .25 : 0, sp ? s * 1.25 : 0); hipWing(bb, P, s); bb.pop(); } };
    if (pose === "perch") bobOr(b, o, 0, 0, 0, .025, 1.3, sb => wings(sb, true)); else wings(b, false);
    b.pop();
  }

  /* 小龙：蹲坐的威尔士绿龙，小脑袋、两只后弯的角、收起的膜翅、卷在脚边的尾巴 */
  const DG = [.3, .47, .3], DG2 = [.22, .35, .24], DBELLY = [.7, .67, .45], DWING = [.27, .4, .31], DHORN = [.86, .8, .66];
  function dragon(b, x, y, z, ry, s, puff, lo) {
    b.at(x, y, z, ry, s);
    for (const sx of [-1, 1]) { b.sphere(sx * .048, .045, -.03, .042, 5, DG2); b.box(sx * .055, 0, .005, .03, .016, .06, DG2); }
    b.at(0, .105, 0, 0, 1, -.55); b.at(0, 0, 0, 0, [1, 1, 1.45]); b.sphere(0, 0, 0, .058, 6, DG, { grad: DBELLY }); b.pop(); b.pop();
    for (const sx of [-1, 1]) limb(b, [sx * .034, .1, .06], [sx * .03, 0, .085], .016, .011, 4, DG2);
    limb(b, [0, .14, .05], [0, .25, .095], .03, .02, 5, DG);
    b.at(0, .27, .105, 0, 1, .2);
    b.at(0, 0, .01, 0, [1, .85, 1.7]); b.sphere(0, 0, 0, .027, 5, DG); b.pop();
    b.box(0, -.02, .03, .028, .014, .04, DG2);
    for (const sx of [-1, 1]) { b.at(sx * .014, .016, -.02, 0, 1, -2.3); b.cone(0, 0, 0, .007, .048, 3, DHORN); b.pop(); b.box(sx * .02, .007, .014, .007, .007, .007, [.95, .72, .2]); }
    b.pop();
    if (!lo) for (let i = 0; i < 4; i++) { const t = i / 3; b.at(0, .21 - t * .15, .03 - t * .1, 0, 1, -.7); b.cone(0, 0, 0, .01, .03, 3, DG2, { nb: true }); b.pop(); }
    for (const sx of [-1, 1]) {
      const sh = [sx * .042, .15, .0], el = [sx * .075, .26, -.07], t1 = [sx * .105, .11, -.16], t2 = [sx * .085, .05, -.1], t3 = [sx * .06, .07, -.03];
      bar(b, sh, el, .012, DG2); bar(b, el, t1, .008, DG2); bar(b, el, t2, .006, DG2);
      tri2(b, sh, el, t3, DWING); tri2(b, el, t2, t3, DWING); tri2(b, el, t1, t2, mix3(DWING, DG2, .4));
    }
    const tp = [[0, .045, -.07], [.06, .025, -.15], [.13, .018, -.13], [.16, .018, -.04], [.15, .018, .05]];
    for (let i = 0; i < tp.length - 1; i += lo ? 2 : 1) { const j = Math.min(tp.length - 1, i + (lo ? 2 : 1)); limb(b, tp[i], tp[j], .024 * (1 - i / 4) + .006, .024 * (1 - j / 4) + .006, 4, DG); }
    tri2(b, [.15, .018, .05], [.12, .02, .1], [.18, .02, .1], DG2);
    if (puff) b.emit(0, .3, .18, "smoke", 3, .35);
    b.pop();
  }

  /* ================= 围栏 ================= */
  function postsAndRuns(pts, closed, gaps, sp) {            /* 沿折线排桩：返回 [段起点, 段终点] 的一串段，缺口处断开 */
    const runs = [], n = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < n; i++) {
      const P = pts[i], Q = pts[(i + 1) % pts.length], dx = Q[0] - P[0], dz = Q[1] - P[1], L = Math.hypot(dx, dz);
      let segs = [[0, L]];
      for (const g of gaps.filter(g => g.i === i)) { const nx = []; for (const [a, c] of segs) { if (c <= g.a || a >= g.c) nx.push([a, c]); else { if (a < g.a) nx.push([a, g.a]); if (c > g.c) nx.push([g.c, c]); } } segs = nx; }
      for (const [a, c] of segs) {
        const m = Math.max(1, Math.round((c - a) / sp)), ps = [];
        for (let k = 0; k <= m; k++) { const d = a + (c - a) * k / m; ps.push([P[0] + dx / L * d, P[1] + dz / L * d]); }
        runs.push(ps);
      }
    }
    return runs;
  }
  function woodFence(b, pts, closed, gaps) {                /* 旧木栅栏：歪一点的方木桩、两道横杆 */
    const runs = postsAndRuns(pts, closed, gaps, .36), done = new Set();
    for (const ps of runs) {
      ps.forEach(([x, z], k) => {
        const key = Math.round(x * 50) + "," + Math.round(z * 50);
        if (!done.has(key)) {
          done.add(key);
          const h = .39 + R() * .05, c = mix3(OLDWD, OLDW, R() * .7);
          b.at(x, 0, z, R() * .6, 1, (R() - .5) * .07, (R() - .5) * .07);
          b.box(0, -.05, 0, .046, h + .05, .046, c, { nb: true, top: mix3(c, C.woodL, .3) });
          b.pop();
        }
        if (k < ps.length - 1) {
          const [x2, z2] = ps[k + 1];
          for (const yy of [.15, .31]) { const j1 = (R() - .5) * .025, j2 = (R() - .5) * .025; bar(b, [x, yy + j1, z], [x2, yy + j2, z2], .03, mix3(OLDW, C.plank, R() * .5)); }
        }
      });
    }
  }
  function ironFence(b, pts, closed, gaps, cy, light) {     /* 2077：石墩之间的黑铁矛头栏杆，下面压一道矮石基；light＝转角只立铁柱（圆羊圈） */
    const runs = postsAndRuns(pts, closed, gaps, .9), done = new Set(), H = .4;
    for (const ps of runs) {
      ps.forEach(([x, z], k) => {
        const key = Math.round(x * 50) + "," + Math.round(z * 50);
        if (!done.has(key)) {
          done.add(key);
          if (light) { b.box(x, 0, z, .032, H + .01, .032, IRON, { nb: true, mat: "metal" }); b.pyramid(x, H + .01, z, .045, .045, .06, cy ? BRASS : IRON, M); }
          else {
            b.box(x, -.05, z, .1, H + .03, .1, mix3(ST, ST2, .3 + R() * .5), { nb: true });
            b.box(x, H - .02, z, .13, .03, .13, DRESS2, { nb: true }); b.pyramid(x, H + .01, z, .1, .1, .07, mix3(DRESS2, ST2, .3));
          }
        }
        if (k < ps.length - 1) {
          const [x2, z2] = ps[k + 1], dx = x2 - x, dz = z2 - z, L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L;
          b.at((x + x2) / 2, 0, (z + z2) / 2, Math.atan2(-dz, dx)); b.box(0, -.05, 0, L - (light ? -.02 : .1), .11, .09, mix3(DRESS2, ST2, .3), { nb: true, top: DRESS }); b.pop();
          const e0 = light ? .02 : .06, a = [x + ux * e0, z + uz * e0], c = [x2 - ux * e0, z2 - uz * e0], n = Math.max(2, Math.round((L - 2 * e0) / .115));
          for (const yy of [.12, H - .07]) bar(b, [a[0], yy, a[1]], [c[0], yy, c[1]], .016, IRON, M);
          for (let i = 1; i < n; i++) {
            const t = i / n, px = a[0] + (c[0] - a[0]) * t, pz = a[1] + (c[1] - a[1]) * t;
            b.cyl(px, .06, pz, .008, H - .08, 3, IRON, { nt: true, nb: true, mat: "metal" });
            b.cone(px, H - .02, pz, .017, .045, 3, IRON, { nb: true, mat: "metal" });
          }
        }
      });
    }
  }
  function woodGate(b, x, z, ry, gw, cy, lamp) {            /* 五横档木栅门（半开）、两根高门柱、门柱上挑一盏提灯 */
    b.at(x, 0, z, ry);
    for (const s of [-1, 1]) { b.box(s * (gw / 2 + .035), -.05, 0, .07, .57, .07, OLDWD, { nb: true, top: OLDW }); b.pyramid(s * (gw / 2 + .035), .52, 0, .085, .085, .06, OLDWD); }
    const lw = gw - .02;
    b.at(-gw / 2, 0, 0, .95);
    b.box(.02, .03, 0, .035, .4, .035, OLDW); b.box(lw - .02, .03, 0, .03, .36, .03, OLDW);
    for (const y of [.07, .16, .25, .34]) b.box(lw / 2, y, 0, lw, .03, .022, mix3(OLDW, C.woodL, .2));
    bar(b, [.04, .08, .015], [lw - .04, .35, .015], .025, OLDWD);
    for (const y of [.08, .33]) b.box(.03, y - .005, 0, .07, .04, .045, C.iron, M);
    b.pop();
    if (lamp) {
      const px = gw / 2 + .035;
      b.beam([px, .5, 0], [px, .5, .17], .022, cy ? BRASS : C.iron, M);
      b.beam([px, .5, .16], [px, .44, .16], .01, C.iron, M);
      lantern(b, px, .24, .16, cy);
    }
    b.pop();
  }
  function ironGate(b, x, z, ry, gw, cy, lamp) {            /* 2077：两根高石墩、双扇铁门（一扇半开），门头一道铁拱 */
    b.at(x, 0, z, ry);
    for (const s of [-1, 1]) {
      const px = s * (gw / 2 + .065);
      b.box(px, -.05, 0, .13, .57, .13, mix3(ST, ST2, .45), { nb: true });
      b.box(px, .5, 0, .16, .035, .16, DRESS2, { nb: true }); b.box(px, .535, 0, .08, .03, .08, DRESS2, { nb: true }); b.sphere(px, .6, 0, .045, 5, DRESS2);
    }
    const lw = gw / 2 - .01;
    const leaf = (sx, ang) => {
      b.at(sx * gw / 2, 0, 0, ang);
      const xs = k => -sx * k;
      for (const yy of [.06, .2, .38]) bar(b, [xs(.0), yy, 0], [xs(lw), yy, 0], .016, IRON, M);
      for (let i = 0; i <= 3; i++) { const xx = xs(i * lw / 3), top = .42 + Math.sin((1 - i / 3) * PI / 2) * .07; b.cyl(xx, .04, 0, .009, top - .04, 3, IRON, { nt: true, nb: true, mat: "metal" }); b.cone(xx, top, 0, .018, .045, 3, IRON, { nb: true, mat: "metal" }); }
      bar(b, [xs(.02), .3, 0], [xs(lw - .02), .3, 0], .03, cy ? BRASS : IRON, M);
      b.pop();
    };
    leaf(-1, -1.0); leaf(1, 0);
    if (lamp) lantern(b, gw / 2 + .065, .565, 0, cy);
    b.pop();
  }

  /* ================= 地面 ================= */
  function turfRect(b, F) {
    reseed(F.seed + 1);
    const cx = (F.x0 + F.x1) / 2, cz = (F.z0 + F.z1) / 2, w = F.x1 - F.x0, d = F.z1 - F.z0;
    b.box(cx, -.08, cz, w - .03, .092, d - .03, TURF, { nb: true });
    if (F.gate != null) blob(b, F.gate, F.z1 - .22, .2, .16, MUD);
    for (const m of F.mud || []) blob(b, m[0], m[1], m[2], m[3], MUD);
    tufts(b, F.x0 + .06, F.x1 - .06, F.z0 + .06, F.z1 - .06, 26, (x, z) => Math.min(x - F.x0, F.x1 - x, z - F.z0, F.z1 - z) < .16);
  }
  function blob(b, x, z, rx, rz, col) {
    const n = 7, pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU, f = .7 + R() * .35; pts.push([x + Math.cos(a) * rx * f, z + Math.sin(a) * rz * f]); }
    for (let i = 1; i < n - 1; i++) tf(b, [pts[0][0], .016, pts[0][1]], [pts[i][0], .016, pts[i][1]], [pts[i + 1][0], .016, pts[i + 1][1]], mix3(col, TURF, R() * .3), [0, 1, 0]);
  }
  function tufts(b, x0, x1, z0, z1, n, ok) {                /* 栅栏根下的一丛丛长草、几朵小花 */
    for (let i = 0, tries = 0; i < n && tries < n * 8; tries++) {
      const x = x0 + R() * (x1 - x0), z = z0 + R() * (z1 - z0);
      if (ok && !ok(x, z)) continue;
      i++;
      const h = .09 + R() * .1, c = mix3(C.grass2, [.6, .72, .36], R());
      b.at(x, .01, z, R() * TAU);
      b.tri([-.05, 0, 0], [.05, 0, 0], [.01, h, .02], c, { k: 1.2 }); b.tri([0, 0, -.05], [0, 0, .05], [.02, h * .8, 0], mix3(c, C.leafD, .25), { k: 1.2 });
      b.pop();
      if (R() < .25) b.box(x + .04, .01, z, .035, .05, .035, [[.96, .9, .5], [.95, .6, .68], [.72, .64, .95], [.98, .98, .95]][Math.floor(R() * 4)]);
    }
  }

  /* ================= 建筑 ================= */
  /* 石砌牲棚：毛石墙、扶壁、石板瓦顶、尖拱门洞配半截马厩门、尖拱烛光窗、侧墙草料架、屋脊风向标 */
  function manger(b) {                                      /* 墙上挂的木草料架（面朝 +z） */
    b.box(0, .14, .07, .42, .06, .12, OLDWD, { top: HAY });
    b.box(0, .2, .07, .4, .03, .1, HAY);
    for (let i = 0; i <= 5; i++) { const x = -.2 + i * .4 / 5; bar(b, [x, .19, .12], [x, .42, .02], .018, OLDW); }
    bar(b, [-.22, .42, .02], [.22, .42, .02], .03, OLDWD);
    for (let i = 0; i < 4; i++) b.at(-.15 + i * .1, .24, .06, 0, 1, -.4).cone(0, 0, 0, .03, .09, 3, HAY, { k: 1.15, nb: true }).pop();
  }
  function vane(b, o, x, y, z, cy) {                        /* 屋脊上的风向标：方位横杆、慢慢转的箭头和一只鹰马剪影 */
    const col = cy ? BRASS : IRON;
    b.box(x, y - .02, z, .06, .05, .06, DRESS2);
    b.at(x, y, z, 0, .72); x = 0; y = 0; z = 0;
    b.beam([x, y + .03, z], [x, y + .44, z], .014, col, M);
    for (const a of [0, PI / 2]) { b.at(x, y + .28, z, a); b.beam([-.075, 0, 0], [.075, 0, 0], .009, col, M); b.pop(); }
    b.sphere(x, y + .28, z, .016, 4, C.gold, M);
    spinOr(b, o, x, y + .38, z, "y", .22, sb => {
      sb.beam([-.13, 0, 0], [.12, 0, 0], .01, col, M);
      sb.at(.12, 0, 0, 0, 1, 0, -PI / 2); sb.cone(0, 0, 0, .02, .045, 4, col, M); sb.pop();
      tri2(sb, [-.13, -.005, 0], [-.17, .04, 0], [-.09, .005, 0], col, M); tri2(sb, [-.13, .005, 0], [-.17, -.04, 0], [-.09, -.005, 0], col, M);
      const S = [[-.06, .015], [.05, .015], [.05, .05], [-.06, .05]];   /* 鹰马剪影：身子、脖子头、扬起的翅膀、腿 */
      tri2(sb, [S[0][0], S[0][1], 0], [S[1][0], S[1][1], 0], [S[2][0], S[2][1], 0], col, M); tri2(sb, [S[0][0], S[0][1], 0], [S[2][0], S[2][1], 0], [S[3][0], S[3][1], 0], col, M);
      tri2(sb, [.03, .045, 0], [.09, .095, 0], [.05, .06, 0], col, M); tri2(sb, [.08, .1, 0], [.11, .085, 0], [.085, .08, 0], col, M);
      tri2(sb, [-.03, .05, 0], [.03, .05, 0], [-.07, .12, 0], col, M);
      tri2(sb, [-.06, .045, 0], [-.07, .045, 0], [-.1, .0, 0], col, M);
    });
    b.pop();
  }
  function byre(b, o, X, Z, cy, extra) {
    reseed(21);
    const W = 1.15, D = .7, P0 = .08, Hw = .66, Hr = .42, sl = Hr / (D / 2), yR = Hw + Hr, zf = D / 2;
    b.at(X, 0, Z);
    b.box(0, -.14, 0, W + .1, P0 + .14, D + .1, STD, { top: DRESS2, nb: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, zf, { ql: true, qr: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, -zf, { back: true, ql: true, qr: true });
    const gab = y => { const h = Math.min(D / 2, (yR + .02 - y) / sl); return [-h, h]; };
    for (const s of [-1, 1]) {
      b.at(s * W / 2, 0, 0, s * PI / 2);
      mason(b, () => [-D / 2, D / 2], P0, Hw, 0, { ql: true, qr: true });
      mason(b, gab, Hw, yR + .02, 0, {});
      if (s > 0) { lancet(b, 0, Hw + .04, 0, .07, .13); b.at(0, 0, 0); manger(b); b.pop(); }
      else owlHole(b, 0, Hw + .18, .006, .065);
      b.pop();
      coping(b, s * W / 2, Hw, D, Hr, .08);
    }
    slateRoof(b, W, Hw, D, Hr, .08);
    /* 正面：尖拱门洞＋半截马厩门（上半扇开着），尖拱烛光窗，铁提灯 */
    b.at(-.17, P0, zf);
    prism(b, outline(.44, .22, 0, .66, 4), -.03, .035, DRESS);
    fan(b, outline(.33, .2, 0, .66, 4), .037, INNER);
    b.box(0, 0, .05, .32, .19, .022, DOORW);
    for (const dx of [-.08, 0, .08]) b.panel(dx, .0, .0615, .008, .19, DARK);
    for (const y of [.035, .14]) b.box(-.06, y, .06, .2, .022, .008, C.iron, M);
    b.box(0, .18, .055, .34, .022, .035, OLDW);
    b.at(-.165, 0, .045, -PI / 2); b.at(.165, 0, 0); prism(b, outline(.33, .2, .2, .66, 4), -.011, .011, DOORW); b.pop(); b.pop();
    b.pop();
    b.box(-.17, -.1, zf + .1, .5, .13, .16, DRESS2, { nb: true, top: mix3(DRESS2, C.stone, .4) });
    lancet(b, .3, .3, zf, .1, .18);
    b.beam([.1, .52, zf], [.1, .52, zf + .13], .02, cy ? BRASS : C.iron, M); b.beam([.1, .52, zf + .12], [.1, .47, zf + .12], .01, C.iron, M);
    lantern(b, .1, .27, zf + .12, cy);
    for (const s of [-1, 1]) { buttress(b, s * (W / 2 - .06), zf, 0, .5); buttress(b, s * (W / 2 - .06), -zf, PI, .5); }
    ivy(b, -.45, P0, zf, .2, .52, 20);
    b.at(-W / 2, 0, 0, -PI / 2); ivy(b, .2, P0, 0, .26, .7, 16); b.pop();
    vane(b, o, -.3, yR + .02, 0, cy);
    if (extra) extra(b, yR);
    b.pop();
    return yR;
  }

  /* 大棚：三开间石砌敞棚。背墙和两头山墙毛石砌，正面一排尖拱券廊（料石拱券、拱肩、腰线），里面木桁架、通长草料架、草捆 */
  function cupola(b, x, yR, cy) {
    b.box(x, yR - .14, 0, .24, .22, .24, DRESS2, { nb: true });
    b.box(x, yR + .08, 0, .19, .17, .19, INNER, { nb: true });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(x + sx * .1, yR + .08, sz * .1, .035, .17, .035, OLDWD);
    for (let i = 0; i < 4; i++) for (const y of [.11, .16, .21]) { b.at(x, yR + y, 0, i * PI / 2); b.at(0, 0, .1, 0, 1, -.6); b.panel(0, -.018, 0, .16, .036, OLDWD); b.pop(); b.pop(); }
    b.box(x, yR + .25, 0, .29, .03, .29, DRESS, { nb: true });
    b.pyramid(x, yR + .28, 0, .27, .27, .27, SL);
    b.beam([x, yR + .5, 0], [x, yR + .64, 0], .015, cy ? BRASS : IRON, M); b.sphere(x, yR + .64, 0, .022, 4, C.gold, M);
    return yR + .66;
  }
  function shed(b, o, X, Z, cy, inside) {
    reseed(33);
    const W = 1.9, D = .9, P0 = .06, Hw = 1.0, Hr = .52, yR = Hw + Hr, sl = Hr / (D / 2), zf = D / 2, dep = .15, pw = .14, ys = .45, p = .72, t = .055;
    const PX = [0, 1, 2, 3].map(k => -W / 2 + pw / 2 + k * (W - pw) / 3), w = (W - pw) / 3 - pw;
    const R0 = p * w, cx = w / 2 - R0, apI = Math.sqrt(R0 * R0 - cx * cx), R1 = R0 + t, apO = Math.sqrt(R1 * R1 - cx * cx), yT = ys + apO + .05;
    b.at(X, 0, Z);
    b.box(0, -.14, 0, W + .08, P0 + .14, D + .08, STD, { top: DRESS2, nb: true });
    b.box(0, P0, -.04, W - .2, .012, D - .2, STRAW, { nb: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, -zf, { back: true, ql: true, qr: true });
    b.panel(0, P0, -zf + .1, W - .2, Hw - P0, INWALL);
    const gab = y => { const h = Math.min(D / 2, (yR + .02 - y) / sl); return [-h, h]; };
    for (const s of [-1, 1]) {
      b.at(s * W / 2, 0, 0, s * PI / 2);
      mason(b, () => [-D / 2, D / 2], P0, Hw, 0, { ql: true, qr: true });
      mason(b, gab, Hw, yR + .02, 0, {});
      lancet(b, 0, .4, 0, .09, .2);
      owlHole(b, 0, Hw + .24, .006, .07);
      b.pop();
      b.at(s * (W / 2 - .1), 0, 0, -s * PI / 2); fan(b, [[-D / 2 + .1, P0], [D / 2 - .1, P0], [D / 2 - .1, Hw], [0, yR - .05], [-D / 2 + .1, Hw]], 0, INWALL); b.pop();
      coping(b, s * W / 2, Hw, D, Hr, .1);
    }
    /* 券廊：墩子、柱础、拱墩石；拱券、拱肩、拱腹 */
    PX.forEach((x, k) => {
      const corner = k === 0 || k === 3, top = corner ? Hw : ys, xx = corner ? x - Math.sign(x) * .006 : x, ww = corner ? pw + .012 : pw;
      b.box(xx, P0, zf - dep / 2, ww, top - P0, dep, mix3(DRESS2, ST, .25 + R() * .3), { nb: true });
      b.box(xx, P0, zf - dep / 2, ww + .04, .06, dep + .04, DRESS2, { nb: true });
      b.box(xx, ys - .035, zf - dep / 2, ww + .035, .04, dep + .03, DRESS, { nb: true });
    });
    for (let j = 0; j < 3; j++) {
      const xc = (PX[j] + PX[j + 1]) / 2, xL = (j === 0 ? PX[0] + pw / 2 : PX[j]) - xc, xR = (j === 2 ? PX[3] - pw / 2 : PX[j + 1]) - xc;
      const I = archPts(w, p, 4), O = archPts(w + 2 * t, R1 / (w + 2 * t), 4), m = (O.length - 1) / 2, yt = yT - ys, spc = mix3(sc(.8), ST, .3);
      b.at(xc, ys, zf);
      for (let i = 0; i < I.length - 1; i++) qf(b, [I[i][0], I[i][1], .006], [I[i + 1][0], I[i + 1][1], .006], [O[i + 1][0], O[i + 1][1], .006], [O[i][0], O[i][1], .006], i === m - 1 || i === m ? DRESS : i % 2 ? DRESS2 : mix3(DRESS, DRESS2, .5), [0, 0, 1]);
      const TL = [xL, yt, .003], TR = [xR, yt, .003], V = q => [q[0], q[1], .003];
      if (O[0][0] > xL + .005) tf(b, TL, [xL, 0, .003], V(O[0]), spc, [0, 0, 1]);
      for (let i = 0; i < m; i++) tf(b, TL, V(O[i]), V(O[i + 1]), spc, [0, 0, 1]);
      tf(b, TL, V(O[m]), TR, spc, [0, 0, 1]);
      for (let i = m; i < O.length - 1; i++) tf(b, TR, V(O[i]), V(O[i + 1]), spc, [0, 0, 1]);
      if (O[O.length - 1][0] < xR - .005) tf(b, TR, V(O[O.length - 1]), [xR, 0, .003], spc, [0, 0, 1]);
      for (let i = 0; i < I.length - 1; i++) { const a = I[i], c = I[i + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2; qf(b, [a[0], a[1], .006], [c[0], c[1], .006], [c[0], c[1], -dep], [a[0], a[1], -dep], DRESS2, [-mx, apI * .3 - my, 0]); }
      b.pop();
    }
    b.box(0, yT, zf - .02, W + .02, .04, .07, DRESS, { nb: true });
    if (Hw - yT - .04 > .04) mason(b, () => [-W / 2, W / 2], yT + .04, Hw, zf, { rh: .12 });
    slateRoof(b, W, Hw, D, Hr, .1, { under: mix3(OLDWD, [.1, .08, .07], .3), bands: 6 });
    for (const x of [-.32, .32]) { b.beam([x, Hw - .05, -zf + .08], [x, Hw - .05, zf - .1], .05, OLDWD); b.beam([x, Hw - .03, 0], [x, yR - .05, 0], .04, OLDWD); for (const f of [-1, 1]) bar(b, [x, Hw - .02, 0], [x, Hw + .18, f * .2], .03, OLDWD); }
    /* 里面：通长草料架、草捆 */
    b.box(-.18, P0, -zf + .2, 1.2, .2, .14, OLDWD, { top: HAY });
    b.beam([-.78, .62, -zf + .11], [.42, .62, -zf + .11], .035, OLDWD);
    for (let i = 0; i <= 7; i++) { const x = -.76 + i * 1.16 / 7; bar(b, [x, .26, -zf + .27], [x, .62, -zf + .12], .016, OLDW); }
    for (let i = 0; i < 6; i++) b.at(-.7 + i * .2, .28, -zf + .2, 0, 1, -.3).cone(0, 0, 0, .045, .1, 3, HAY, { k: 1.1, nb: true }).pop();
    bale(b, .62, P0, -.2, .1); bale(b, .66, P0, -.04, -.05); bale(b, .64, P0 + .12, -.12, .02);
    b.sphere(-.6, P0, .1, .14, 5, mix3(HAY, STRAW, .4), { sy: .35 });
    if (inside) inside(b, P0);
    /* 外面：墩子上挑一盏提灯、常春藤、屋脊通风小塔 */
    b.beam([PX[1], .62, zf], [PX[1], .62, zf + .14], .02, cy ? BRASS : C.iron, M); b.beam([PX[1], .62, zf + .13], [PX[1], .56, zf + .13], .01, C.iron, M);
    lantern(b, PX[1], .36, zf + .13, cy);
    ivy(b, PX[0] + .02, P0, zf + .005, .16, .7, 22);
    b.at(W / 2, 0, 0, PI / 2); ivy(b, -.25, P0, 0, .3, .9, 20); b.pop();
    const top = cupola(b, 0, yR, cy);
    b.pop();
    return top;
  }

  /* 鹰马栖架：矮圆石塔、托石一圈、塔顶木平台围着城堞、一根挑出去的栖木、木梯、小旗 */
  function perch(b, o, X, Z, cy, rider) {
    reseed(61);
    const SEG = 10, r0 = .3, r1 = .27, y0 = .06, y1 = .9, rAt = y => r0 + (r1 - r0) * Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
    b.at(X, 0, Z);
    b.cyl(0, -.14, 0, .37, .2, SEG, STD, { top: DRESS2, a0: PI / SEG, nb: true });
    rwall(b, 0, 0, r0, r1, y0, y1, SEG, .17);
    for (let i = 0; i < 10; i++) { b.at(0, 0, 0, (i + .5) / 10 * TAU); b.box(0, y1 - .09, r1 + .015, .055, .07, .055, DRESS2, { nb: true }); b.pop(); }
    const yd = y1 + .05;
    b.cyl(0, y1 - .03, 0, r1 + .07, .08, SEG, DRESS, { a0: PI / SEG, top: mix3(OLDW, C.plank, .4) });
    for (let i = 0; i < 5; i++) { const hw = .26 - Math.abs(i - 2) * .05, z = -.24 + i * .12; b.quad([-hw, yd + .002, z + .004], [hw, yd + .002, z + .004], [hw, yd + .002, z - .004], [-hw, yd + .002, z - .004], OLDWD); }
    for (let i = 0; i < 12; i++) {
      const a = (i + .5) / 12 * TAU; if (i % 2 || Math.cos(a) > .55) continue;
      b.at(0, 0, 0, a); b.box(0, yd, r1 + .035, .1, .11, .065, sc(1), { nb: true, top: DRESS2 }); b.pop();
    }
    /* 尖拱小门、射箭缝、提灯 */
    b.at(0, 0, 0, .45);
    prism(b, outline(.25, .22, 0, .72, 4), r0 - .07, r0 + .025, DRESS);
    b.at(0, y0, r0 + .028); door(b, .18, .2, .72, { planks: 3, straps: [.05, .17] }); b.pop();
    b.box(0, -.12, r0 + .12, .32, .14, .16, DRESS2, { nb: true });
    b.pop();
    for (const [a, y] of [[-.35, .5], [1.6, .62], [-1.7, .45]]) { b.at(0, 0, 0, a); b.box(0, y, rAt(y) - .01, .07, .2, .03, DRESS2, { nb: true }); b.panel(0, y + .03, rAt(y) + .006, .022, .14, INNER); b.pop(); }
    b.at(0, 0, 0, .95); b.beam([0, .58, r0 - .03], [0, .58, r0 + .12], .02, cy ? BRASS : C.iron, M); b.beam([0, .58, r0 + .11], [0, .53, r0 + .11], .01, C.iron, M); lantern(b, 0, .33, r0 + .11, cy); b.pop();
    /* 挑出去的栖木（落脚用）和斜撑、木梯 */
    b.at(0, 0, 0, PI / 2 + .35);
    limb(b, [0, yd + .04, r1 - .1], [0, yd + .06, r1 + .5], .035, .03, 6, OLDW);
    bar(b, [0, yd - .34, r1 - .01], [0, yd + .03, r1 + .32], .04, OLDWD);
    b.box(0, yd - .38, r1 + .01, .08, .06, .04, C.iron, M);
    b.pop();
    b.at(0, 0, 0, -.75);
    for (const s of [-1, 1]) bar(b, [s * .1, 0, r0 + .32], [s * .1, yd + .12, r1 + .03], .03, OLDW);
    for (let i = 1; i < 8; i++) { const t = i / 8; bar(b, [-.1, t * (yd + .12), r0 + .32 - t * (r0 + .29 - r1)], [.1, t * (yd + .12), r0 + .32 - t * (r0 + .29 - r1)], .022, OLDWD); }
    b.pop();
    rivy(b, rAt, -2.4, 1.2, y0, .75, 22);
    b.at(0, 0, 0, PI - .5); const ft = flag(b, 0, yd + .13, r1 + .035, C.banner2, cy); b.pop();
    b.cyl(-.1, yd, -.12, .045, .07, 6, OLDW, { r2: .05, top: [.2, .3, .38] });
    if (rider) rider(b, yd);
    b.pop();
    return Math.max(ft, yd + .95);
  }

  /* 草料垛：一圈蘑菇石墩（防鼠）架起圆木台，圆垛上压草顶，草绳压着吊石，斜靠一架梯子、插一把草叉，垛脚两个草捆 */
  const THATCH = mix3(C.hay, [.6, .46, .26], .45), THATCH2 = mix3(THATCH, [.4, .3, .18], .3);
  function rick(b, X, Z, ry) {
    reseed(55);
    const r = .27, yP = .15, yE = .5, seg = 9;
    b.at(X, 0, Z, ry);
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU + .3, x = Math.cos(a) * .2, z = Math.sin(a) * .2;
      b.cyl(x, 0, z, .042, .11, 5, mix3(C.stone, C.stoneD, R() * .5), { r2: .026, nb: true });
      b.cyl(x, .11, z, .07, .035, 6, DRESS2, { r2: .056, top: DRESS });
    }
    b.cyl(0, yP, 0, .31, .035, seg, OLDWD, { nb: true, top: OLDW });
    b.cyl(0, yP + .035, 0, r, yE - yP - .035, seg, HAY, { r2: r + .03, nb: true, nt: true });
    for (let i = 0; i < seg; i++) { const a = (i + .5) / seg * TAU; b.at(0, 0, 0, a); b.panel(0, yP + .12 + (i % 3) * .05, r + .012, .1, .012, HAYD); b.pop(); }
    b.cyl(0, yE, 0, r + .09, .04, seg, THATCH2, { r2: r + .08, nb: true, nt: true, a0: .2 });
    b.cone(0, yE + .04, 0, r + .08, .36, seg, THATCH, { nb: true, a0: .2 });
    b.cyl(0, yE + .34, 0, .05, .08, 5, THATCH2, { r2: .025 }); b.cone(0, yE + .42, 0, .022, .1, 4, HAYD);
    for (let i = 0; i < 4; i++) {                             /* 草绳从顶上垂到檐口，下面吊着压石 */
      const a = i / 4 * TAU + .55, ca = Math.cos(a), sa = Math.sin(a), re = r + .1;
      bar(b, [ca * .05, yE + .37, sa * .05], [ca * re, yE + .03, sa * re], .012, ROPE);
      b.beam([ca * re, yE + .03, sa * re], [ca * re, yE - .1, sa * re], .009, ROPE);
      b.sphere(ca * re, yE - .13, sa * re, .034, 4, mix3(C.stone, C.stoneD, R()));
    }
    b.at(0, 0, 0, -.5);                                      /* 梯子 */
    for (const s of [-1, 1]) bar(b, [s * .08, 0, .58], [s * .08, yE + .12, r + .08], .022, OLDW);
    for (let i = 1; i < 5; i++) { const t = i / 5, z = .58 - (.58 - r - .08) * t; bar(b, [-.08, t * (yE + .12), z], [.08, t * (yE + .12), z], .016, OLDWD); }
    b.pop();
    b.sphere(-.3, 0, .28, .13, 5, mix3(HAY, HAYD, .3), { sy: .5 });
    b.at(-.3, .02, .28, 0, 1, -.25, .1); b.beam([0, 0, 0], [0, .5, 0], .018, OLDW); b.box(0, .02, 0, .07, .012, .012, C.iron, M); for (const dx of [-.03, 0, .03]) b.beam([dx, -.06, 0], [dx, .025, 0], .008, C.iron, M); b.pop();
    bale(b, .08, 0, .4, .15); bale(b, .3, 0, .3, -.6);
    b.pop();
  }

  /* 饮水槽：料石槽、一汪水、长了青苔的槽沿；一头立着铁手摇泵（2077 黄铜），旁边一只木桶 */
  function trough(b, X, Z, ry, cy) {
    reseed(71);
    const L = .62, Wd = .2, H = .17, t = .035, c1 = mix3(DRESS2, ST2, .35), top = mix3(DRESS, DRESS2, .5), pm = cy ? BRASS : IRON;
    b.at(X, 0, Z, ry);
    b.box(0, -.04, 0, L, .08, Wd, c1, { nb: true });
    for (const s of [-1, 1]) { b.box(0, 0, s * (Wd / 2 - t / 2), L, H, t, c1, { nb: true, top }); b.box(s * (L / 2 - t / 2), 0, 0, t, H, Wd - 2 * t, c1, { nb: true, top }); }
    b.quad([-L / 2 + t, H - .03, Wd / 2 - t], [L / 2 - t, H - .03, Wd / 2 - t], [L / 2 - t, H - .03, -Wd / 2 + t], [-L / 2 + t, H - .03, -Wd / 2 + t], [.3, .46, .54], { mat: "water", k: 3 });
    for (let i = 0; i < 6; i++) { const x = -L / 2 + .05 + R() * (L - .1), s = R() < .5 ? 1 : -1; b.box(x, H, s * (Wd / 2 - t / 2), .05 + R() * .05, .006, t + .004, mix3(C.ivy, C.leaf, R() * .5)); }
    for (const s of [-1, 1]) b.box(s * (L / 2 - .08), -.04, 0, .06, .05, Wd + .04, STD, { nb: true });
    const px = L / 2 + .07;
    b.box(px, -.04, 0, .11, .08, .11, DRESS2, { nb: true });
    b.cyl(px, .04, 0, .032, .3, 6, pm, { mat: "metal" });
    b.cyl(px, .32, 0, .042, .03, 6, pm, { mat: "metal" }); b.cone(px, .35, 0, .03, .05, 6, pm, { mat: "metal" });
    b.beam([px, .26, 0], [px - .1, .25, 0], .022, pm, M); b.beam([px - .1, .25, 0], [px - .11, .21, 0], .018, pm, M);
    b.beam([px, .33, 0], [px + .16, .42, 0], .016, pm, M); b.sphere(px + .16, .42, 0, .018, 4, OLDW);
    b.cyl(-L / 2 - .03, 0, .17, .05, .09, 6, OLDW, { r2: .056, top: [.24, .34, .4] }); b.cyl(-L / 2 - .03, .055, .17, .055, .012, 6, C.iron, { mat: "metal", nt: true, nb: true });
    b.pop();
  }

  /* 圆羊圈中间的铁箍草料架（1994 Lv3） */
  function feeder(b, X, Z) {
    reseed(81);
    b.at(X, 0, Z);
    b.cyl(0, 0, 0, .15, .16, 7, HAY, { r2: .16 });
    b.sphere(0, .16, 0, .16, 7, mix3(HAY, C.hay, .4), { sy: .45 });
    for (const y of [.05, .2]) b.torus(0, y, 0, .175, .01, 9, 3, IRON, M);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; bar(b, [Math.cos(a) * .175, 0, Math.sin(a) * .175], [Math.cos(a) * .175, .22, Math.sin(a) * .175], .014, IRON, M); }
    for (let i = 0; i < 6; i++) { const a = R() * TAU; b.at(Math.cos(a) * .2, .0, Math.sin(a) * .2, R() * TAU); b.tri([-.05, .01, 0], [.05, .01, 0], [0, .015, .07], HAYD); b.pop(); }
    b.pop();
  }

  /* 2077：玻璃孵化房——八角石座、黄铜骨架的玻璃墙和玻璃穹顶；里面草窝里三枚龙蛋、一盏小暖灯、一只刚孵出的小龙 */
  function hatchery(b, o, X, Z, ry) {
    reseed(88);
    const N = 8, Rr = .27, yb = .14, yw = .44, Hd = .22, a0 = PI / N, G = mix3(C.glass, C.white, .25), GL = { mat: "glass" };
    const P = (i, r, y) => [Math.cos(a0 + i / N * TAU) * r, y, Math.sin(a0 + i / N * TAU) * r];
    b.at(X, 0, Z, ry);
    b.cyl(0, -.14, 0, Rr + .07, .28, N, ST2, { top: DRESS, a0, nb: true });
    b.cyl(0, -.06, 0, Rr + .12, .1, N, DRESS2, { top: mix3(DRESS2, ST, .3), a0, nb: true });
    b.box(0, -.06, Rr + .1, .2, .14, .14, DRESS2, { nb: true });
    for (let i = 0; i < N; i++) {
      const A = P(i, Rr, yb), B2 = P(i + 1, Rr, yb), C2 = P(i + 1, Rr, yw), D2 = P(i, Rr, yw);
      b.quad(A, B2, C2, D2, G, GL);
      bar(b, A, D2, .022, BRASS, M);
      const mx = (A[0] + B2[0]) / 2, mz = (A[2] + B2[2]) / 2;
      if (i === 1) { for (const f of [.3, .7]) bar(b, [A[0] + (B2[0] - A[0]) * f, yb, A[2] + (B2[2] - A[2]) * f], [A[0] + (B2[0] - A[0]) * f, yw, A[2] + (B2[2] - A[2]) * f], .016, BRASS, M); b.sphere(mx + .03, .28, mz + .015, .014, 4, BRASS, M); }
    }
    for (const [y, h] of [[yb - .005, .025], [yw - .012, .024], [(yb + yw) / 2, .012]]) b.cyl(0, y, 0, Rr + .006, h, N, BRASS, { a0, nt: true, nb: true, mat: "metal" });
    for (let j = 0; j < 3; j++) {
      const f0 = [0, .5, 1.05][j], f1 = [.5, 1.05, PI / 2][j], r0 = Rr * Math.cos(f0), r1 = Rr * Math.cos(f1), y0 = yw + Hd * Math.sin(f0), y1 = yw + Hd * Math.sin(f1);
      for (let i = 0; i < N; i++) {
        if (j === 2) b.tri(P(i, r0, y0), P(i + 1, r0, y0), [0, y1, 0], G, GL); else b.quad(P(i, r0, y0), P(i + 1, r0, y0), P(i + 1, r1, y1), P(i, r1, y1), G, GL);
        if (j !== 1) bar(b, P(i, r0, y0), j === 2 ? [0, y1, 0] : P(i, Rr * Math.cos(1.05), yw + Hd * Math.sin(1.05)), .016, BRASS, M);
      }
    }
    b.cyl(0, yw + Hd - .01, 0, .04, .035, 6, BRASS, M); b.sphere(0, yw + Hd + .06, 0, .03, 5, BRASS, M); b.cone(0, yw + Hd + .08, 0, .012, .08, 4, BRASS, M);
    b.torus(0, yb + .025, -.02, .09, .03, 8, 3, HAY);
    for (const [x, z, c] of [[-.03, -.04, [.36, .55, .42]], [.04, -.02, [.62, .44, .28]], [0, .03, [.42, .48, .62]]]) b.sphere(x, yb + .065, z - .02, .036, 5, c, { sy: 1.35 });
    b.beam([0, yw + Hd - .02, 0], [0, yw - .02, 0], .008, BRASS, M); b.cone(0, yw - .06, 0, .05, .045, 6, BRASS, { mat: "metal", nb: true }); b.sphere(0, yw - .065, 0, .02, 4, C.lamp, { e: .6 });
    dragon(b, .14, yb, .09, -.7, .5, false, true);
    b.pop();
  }

  /* ================= 各级布局 ================= */
  /* A：方围场（x0..x1, z0..z1），gate 前门 x，back 后栅缺口（x 段）；B：圆羊圈 */
  const LAY = {
    1: {
      A: { seed: 1, x0: -1.5, x1: .85, z0: -.42, z1: 1.3, gate: -.3, back: [[-.92, -.42]], mud: [[.6, .1, .22, .18], [-.67, -.3, .25, .12]] },
      byre: [-.5, -1.0], rick: [1.05, -.9, -.3], hatch: [1.08, -.9], bales77: [[.38, -.8, .3], [.46, -.92, -.2]],
      trough: [.6, .45, PI / 2],
      herd: [["hip", -.62, .5, -1.0, "grey", "stand"], ["sheep", .12, .98, -2.3, { graze: 1 }], ["sheep", -1.12, .08, 1.2, {}], ["sheep", .3, .02, 2.2, { graze: 1, cream: 1 }], ["sheep", -1.0, .95, .4, { graze: 1 }]],
      lamps77: [[-1.62, 1.42], [1.2, .3]]
    },
    2: {
      A: { seed: 2, x0: -1.5, x1: .85, z0: -.42, z1: 1.3, gate: -.3, back: [[-1.32, -.92], [.42, .8]], mud: [[.6, .1, .22, .18], [.6, -.3, .2, .1], [-1.1, -.3, .22, .12]] },
      byre: [-1.0, -1.0], shed: [.6, -1.0], rick: [1.3, .32, PI / 2], hatch: [1.3, .3], bales77: [[1.3, .78, 1.2], [1.24, .92, 1.5]],
      trough: [.6, .5, PI / 2],
      herd: [["hip", -.55, .5, -1.0, "grey", "stand"], ["sheep", .1, 1.0, -2.3, { graze: 1 }], ["sheep", -1.15, .2, 1.2, {}], ["sheep", .28, .05, 2.2, { graze: 1, cream: 1 }], ["sheep", -1.05, 1.0, .4, { graze: 1 }]],
      inside: [["hip", 0, .02, -.6, "bay", "rest"], ["sheep", -.62, .1, .5, { lie: 1 }]],
      lamps77: [[-1.62, 1.42], [1.0, 1.25]]
    },
    3: {
      A: { seed: 3, x0: -1.5, x1: .4, z0: -.42, z1: 1.3, gate: -.45, back: [[-1.32, -.92], [-.02, .38]], mud: [[.15, .3, .2, .16], [-1.1, -.3, .22, .12]] },
      B: { seed: 4, cx: 1.08, cz: .92, r: .5 },
      byre: [-1.0, -1.0], shed: [.6, -1.0], perch: [1.28, -.08],
      trough: [.17, .5, PI / 2],
      herd: [["hip", -.6, .45, 2.2, "grey", "peck"], ["sheep", -.05, 1.0, -2.3, { graze: 1 }], ["sheep", -1.15, .2, 1.2, {}], ["sheep", -1.05, 1.0, .4, { graze: 1, cream: 1 }]],
      herdB: [["sheep", .82, .78, 1.9, { graze: 1 }], ["sheep", 1.33, 1.07, -1.2, { graze: 1, cream: 1 }], ["sheep", 1.0, 1.22, 3.0, {}]],
      herdB77: [["sheep", .82, 1.18, 2.4, { graze: 1 }]],
      inside: [["sheep", -.5, .1, .5, { lie: 1 }]],
      lamps77: [[-1.62, 1.42], [.5, 1.45], [1.62, .45]]
    }
  };

  function herd(b, o, list) {
    reseed(17);
    for (const h of list) {
      if (h[0] === "sheep") sheep(b, o, h[1], h[2], h[3], h[4]);
      else hippogriff(b, o, h[1], 0, h[2], h[3], HP[h[4]], h[5]);
    }
  }
  function pen(b, F, cy) {                                  /* 方围场：草皮、栅栏（后面留口对着棚门）、前门 */
    turfRect(b, F);
    const { x0, x1, z0, z1 } = F, gw = .44, gp = cy ? .15 : .07;
    const pts = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]], gaps = [{ i: 0, a: F.gate - x0 - gw / 2 - gp / 2, c: F.gate - x0 + gw / 2 + gp / 2 }];
    for (const [a, c] of F.back || []) gaps.push({ i: 2, a: x1 - c, c: x1 - a });
    reseed(F.seed + 5);
    if (cy) { ironFence(b, pts, true, gaps, cy); ironGate(b, F.gate, z1, 0, gw, cy, true); }
    else { woodFence(b, pts, true, gaps); woodGate(b, F.gate, z1, 0, gw, cy, true); }
  }
  function roundPen(b, F, cy) {                             /* 圆羊圈：十边形栅栏，正前方开门 */
    reseed(F.seed + 1);
    const n = 10, pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU; pts.push([F.cx + Math.cos(a) * F.r, F.cz + Math.sin(a) * F.r]); }
    b.cyl(F.cx, -.08, F.cz, F.r - .02, .092, n, TURF, { nb: true });
    blob(b, F.cx, F.cz + .32, .14, .1, MUD);
    tufts(b, F.cx - F.r, F.cx + F.r, F.cz - F.r, F.cz + F.r, 12, (x, z) => { const d = Math.hypot(x - F.cx, z - F.cz); return d < F.r - .05 && d > F.r - .18; });
    const side = Math.hypot(pts[3][0] - pts[2][0], pts[3][1] - pts[2][1]), gw = .26;
    reseed(F.seed + 5);
    if (cy) { ironFence(b, pts, true, [{ i: 2, a: (side - gw) / 2 - .075, c: (side + gw) / 2 + .075 }], cy, true); ironGate(b, F.cx, F.cz + F.r * Math.cos(PI / n), 0, gw, cy, false); }
    else { woodFence(b, pts, true, [{ i: 2, a: (side - gw) / 2 - .035, c: (side + gw) / 2 + .035 }]); woodGate(b, F.cx, F.cz + F.r * Math.cos(PI / n), 0, gw, cy, false); }
  }

  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, L = LAY[lv];
    pen(b, L.A, cy);
    if (L.B) roundPen(b, L.B, cy);
    byre(b, o, L.byre[0], L.byre[1], cy, (bb, yR) => dragon(bb, .28, yR - .01, 0, .5, 1, true));
    if (L.shed) shed(b, o, L.shed[0], L.shed[1], cy, L.inside ? (bb, P0) => { reseed(18); for (const h of L.inside) { if (h[0] === "sheep") sheep(bb, o, h[1], h[2], h[3], h[4]); else hippogriff(bb, o, h[1], P0, h[2], h[3], HP[h[4]], h[5]); } } : null);
    if (L.perch) perch(b, o, L.perch[0], L.perch[1], cy, (bb, yd) => { reseed(19); hippogriff(bb, o, 0, yd, .03, .5, HP.bay, "perch"); });
    trough(b, L.trough[0], L.trough[1], L.trough[2], cy);
    if (cy) {
      if (L.B) hatchery(b, o, L.B.cx + .04, L.B.cz - .05, 0); else hatchery(b, o, L.hatch[0], L.hatch[1], 0);
      reseed(43); for (const [x, z, r] of L.bales77 || []) bale(b, x, 0, z, r);
      for (const [x, z] of L.lamps77) catLamp(b, x, z, .8);
    } else {
      if (L.rick) rick(b, L.rick[0], L.rick[1], L.rick[2]);
      if (L.B) feeder(b, L.B.cx, L.B.cz - .04);
    }
    herd(b, o, L.herd);
    if (L.B) herd(b, o, cy ? L.herdB77 : L.herdB);
    b.emit((L.A.x0 + L.A.x1) / 2, .35, (L.A.z0 + L.A.z1) / 2, "firefly", 4, 1);
  }
  build.h = o => [0, 1.75, 2.4, 2.4][Math.max(1, Math.min(3, o.lv || 1))];
  Isle3D.FAC["牧栏"] = build;
})();
