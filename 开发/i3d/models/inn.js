/* 民宿：霍格莫德村式的老旅店。
   1994：两层小楼——风化灰石砌的底层（错缝石块、转角隅石、石台基），尖拱铁钉木门、门前石阶，两扇外凸的小格子凸窗（铅皮小顶）；
         上层是挑出来的半木结构（挑檐下一排梁头和斜撑、深色橡木框、斜撑、抹灰墙、木框烛光窗、绿百叶），窗台挂花箱；
         陡峭的深蓝灰石板瓦顶，正中一座更陡的山墙（半木山墙、封檐板、尖针），两侧各一扇老虎窗，屋脊一排铁花，
         屋脊上两根石烟囱（一根有点歪）冒烟；左角铁臂挑出一块木招牌（金色啤酒杯），门两边两盏铁提灯，门前长椅、木桶、木箱，墙角常春藤。
         Lv2 左边加一座侧翼：石砌底层、正面半木山墙、双联尖拱窗和花箱、更陡的石板瓦顶和小烟囱，侧墙一排扫帚停放架。
         Lv3 右后加一座三层圆塔楼（三道腰线、尖拱窗、塔门、托石挑檐、高石板瓦尖顶、老虎窗、小旗、挂旗、常春藤），
             右前加一座石砌露台（石栏杆、石阶、两张小圆桌和凳子、爬满藤的木花架、一盏铁灯柱）。
   2077：同一座老旅店，右前多一间黄铜骨架的玻璃餐厅（玻璃山墙、黄铜椽子和屋脊花饰，里头小圆桌、吊灯），
         招牌换黄铜挑臂、臂端一盏黄铜招牌灯，提灯换黄铜，门前和露台浮着猫球灯；Lv3 的玻璃餐厅搬到露台上，前面留一条露天座。
         不加霓虹、不加全息。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.1, .1, .12], .35);
  const LEAD = mix3(C.iron, [.52, .53, .55], .3);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .32);
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4);
  const DAUB = mix3(C.plaster, [.76, .71, .62], .4), MULL = mix3(IRON, OAK, .3);
  const POT = mix3(C.roofR, STD, .45), HAY = mix3(C.hay, C.woodL, .35), SHUT = mix3(C.roofG, OAK, .45);
  const FLW = [[.86, .32, .38], [.95, .74, .32], [.74, .5, .86], [.96, .92, .86], [.92, .52, .62]];
  const GLASS = mix3(C.glass, [.78, .88, .84], .3);
  let R = Math.random;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .58 + r * .42);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .3); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .3);
    if (r > .9) c = mix3(c, STD, .45); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.32, (.9 - y) * .32));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }

  /* ---------- 平面多边形、尖拱 ---------- */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function archPts(w, p, n) {                               /* 尖拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、券底、拱心石 */
    const n = 4, ai = archPts(w, p, n), ao = archPts(w + fr * 2, p, n), rev = mix3(DRESS2, STD, .35);
    for (const s of [-1, 1]) {
      const xi = s * w / 2, nq = 3;
      for (let j = 0; j < nq; j++) {
        const ya = h * j / nq, yb = h * (j + 1) / nq, xq = s * (w / 2 + fr * (j % 2 ? .78 : 1.12));
        qf(b, [xi, ya, z1], [xq, ya, z1], [xq, yb, z1], [xi, yb, z1], j % 2 ? DRESS : DRESS2, [0, 0, 1]);
        qf(b, [xq, ya, z0], [xq, ya, z1], [xq, yb, z1], [xq, yb, z0], DRESS2, [s, 0, 0]);
      }
      qf(b, [xi, 0, z0], [xi, 0, z1], [xi, h, z1], [xi, h, z0], rev, [-s, 0, 0]);
    }
    for (let i = 0; i < ai.length - 1; i++) {
      const c = i % 2 ? DRESS : DRESS2, A = ai[i], B = ai[i + 1], Ao = ao[i], Bo = ao[i + 1];
      qf(b, [A[0], h + A[1], z1], [Ao[0], h + Ao[1], z1], [Bo[0], h + Bo[1], z1], [B[0], h + B[1], z1], c, [0, 0, 1]);
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      qf(b, [A[0], h + A[1], z0], [B[0], h + B[1], z0], [B[0], h + B[1], z1], [A[0], h + A[1], z1], rev, [-mx, -my - .05, 0]);
      qf(b, [Ao[0], h + Ao[1], z0], [Bo[0], h + Bo[1], z0], [Bo[0], h + Bo[1], z1], [Ao[0], h + Ao[1], z1], DRESS2, [mx, my + .05, 0]);
    }
    const kt = archY(w + fr * 2, p, 0);
    b.box(0, h + kt - .07, (z0 + z1) / 2 + .008, .07, .1, z1 - z0 + .016, DRESS, { nb: true });
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .12 : .22) : 0, q1 = o.qr ? ((j + ph) % 2 ? .22 : .12) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .18 + R() * .22; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        const col = isQ ? mix3(DRESS2, ST, R() * .35) : (o.col ? o.col(ya) : sc(ya));
        b.quad([E[k][0], ya, z], [E[k + 1][0], ya, z], [E[k + 1][1], yb, z], [E[k][1], yb, z], col);
      }
    }
  }
  function stoneBox(b, x0, x1, y0, y1, z0, z1, o) {          /* 一块石砌体：四面错缝砌石（o.nf/nb/nl/nr 不画哪面），转角隅石 */
    o = o || {};
    const xc = (x0 + x1) / 2, zc = (z0 + z1) / 2, hx = (x1 - x0) / 2, hz = (z1 - z0) / 2, q = o.q !== false, rh = o.rh, col = o.col;
    if (!o.nf) mason(b, () => [x0, x1], y0, y1, z1, { ql: q, qr: q, rh, col });
    if (!o.nb) { b.at(xc, 0, z0, PI); mason(b, () => [-hx, hx], y0, y1, 0, { ql: q, qr: q, rh, col }); b.pop(); }
    if (!o.nr) { b.at(x1, 0, zc, PI / 2); mason(b, () => [-hz, hz], y0, y1, 0, { ql: q, qr: q, qph: 1, rh, col }); b.pop(); }
    if (!o.nl) { b.at(x0, 0, zc, -PI / 2); mason(b, () => [-hz, hz], y0, y1, 0, { ql: q, qr: q, qph: 1, rh, col }); b.pop(); }
    if (o.top) b.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], o.top);
  }
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆塔身：一圈圈石砌，层层错半块 */
    const n = Math.max(1, Math.round((y1 - y0) / (rh || .18))), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU, px = cx + Math.sin(a) * r, pz = cz + Math.cos(a) * r, qx = cx + Math.sin(a2) * r, qz = cz + Math.cos(a2) * r;
        b.quad([px, ya, pz], [qx, ya, qz], [qx, yb, qz], [px, yb, pz], sc(ya));
      }
    }
  }
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块：前、左、右、底 */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function wedge(b, x, y, z, w, h, d, col, o) {             /* 斜顶小块：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col, o);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col, o);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col, o);
    b.quad([x0, y, z1], [x0, y, z0], [x1, y, z0], [x1, y, z1], col, o);
  }
  function corbel(b, x, y, z) { cbox(b, x, y - .12, z - .02, .055, .065, z + .04, DRESS2); cbox(b, x, y - .055, z - .02, .07, .055, z + .07, DRESS2); }

  /* ---------- 窗、门 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.02, .025, o.frame || DRESS);
    fan(b, outline(w, h, 0, p), .029, WIN, { e });
    b.panel(0, 0, .032, .016, h + archY(w, p, 0) * .8, MULL);
    b.panel(0, h * .55, .033, w, .014, MULL);
    if (!o.nosill) b.box(0, -fr - .03, .01, w + fr * 2 + .05, .03, .07, DRESS2, { nb: true });
    b.pop();
  }
  function door(b, w, h, p, o) {                            /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    o = o || {};
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    const n = o.planks || 5;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, dark); }
    for (const y of o.straps || [h * .2, h * .62]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 5; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 4, y + .006, .0125, .016, .016, C.metal, M);
    }
    b.at(w * .22, h * .52, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .026, .007, 8, 3, IRON, M); b.pop();
  }
  function lantern(b, x, y, z, cy) {                        /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .055, .022, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .022, z, .04, .12, 6, C.lamp, { r2: .05, e: .7, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .046, y + .022, z + Math.sin(a) * .046], [x + Math.cos(a) * .055, y + .142, z + Math.sin(a) * .055], .01, fr, fo); }
    b.cyl(x, y + .142, z, .066, .018, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .16, z, .062, .08, 6, fr, Object.assign({ nb: true }, fo));
    b.pyramid(x, y + .235, z, .025, .025, .05, fr, fo);
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .045, .11, .02, fr, fo);
    b.beam([x, y + .1, z], [x, y + .1, z + .18], .02, fr, fo);
    b.beam([x, y + .02, z], [x, y + .1, z + .11], .013, fr, fo);
    b.beam([x, y + .1, z + .17], [x, y + .03, z + .17], .01, fr, fo);
    lantern(b, x, y - .24, z + .17, cy);
  }
  function lampPost(b, x, y, z, cy, h) {                    /* 铁灯柱：石座、细铁柱、顶上一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    h = h || .78;
    b.box(x, y, z, .12, .08, .12, DRESS2, { nb: true });
    b.beam([x, y + .08, z], [x, y + h, z], .035, fr, fo);
    b.cyl(x, y + h - .04, z, .04, .04, 6, fr, Object.assign({ nb: true }, fo));
    lantern(b, x, y + h, z, cy);
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), px = x + (R() - .5) * w * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .03, zz = z + .01 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, r, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .03;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], r + .012 + R() * .014, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function flag(b, x, y, z, col, h) {                       /* 小旗：铁杆、金球、随风摆的尖角旗 */
    h = h || .6;
    b.beam([x, y - .1, z], [x, y + h, z], .02, IRON, M);
    b.sphere(x, y + h + .02, z, .028, 4, C.gold, M);
    const L = .36, Hh = .16, top = y + h - .04, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .012 + L * t0, x1 = x + .012 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .5) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、尖底布条、金边、菱形徽 */
    b.beam([x - w / 2 - .03, yt + .012, z + .03], [x + w / 2 + .03, yt + .012, z + .03], .018, IRON, M);
    b.at(x, yt, z + .015);
    fan(b, [[-w / 2, -h + .08], [0, -h], [w / 2, -h + .08], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .02, -h + .09, .003, .012, h - .12, C.gold, M);
    b.panel(w / 2 - .02, -h + .09, .003, .012, h - .12, C.gold, M);
    const yc = -h * .46;
    fan(b, [[0, yc - .055], [.042, yc], [0, yc + .055], [-.042, yc]], .004, C.gold, M);
    b.pop();
  }

  /* ---------- 半木结构 ---------- */
  function strip(b, x1, y1, x2, y2, w, z, d, col) {         /* 贴在墙面（z，面朝 +z）上的一根木条：正面＋两侧 */
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2, zf = z + d;
    const A = [x1 + nx, y1 + ny], B = [x2 + nx, y2 + ny], Cc = [x2 - nx, y2 - ny], D = [x1 - nx, y1 - ny];
    qf(b, [A[0], A[1], zf], [B[0], B[1], zf], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [0, 0, 1]);
    if (d < .019) return;
    qf(b, [A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], zf], [A[0], A[1], zf], col, [nx, ny, 0]);
    qf(b, [D[0], D[1], z], [Cc[0], Cc[1], z], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [-nx, -ny, 0]);
  }
  function tWin(b, xc, yb, w, h, z, o) {                    /* 木框窗：烛光玻璃、竖棂、横棂、窗台板；o.sh 两扇敞开的木百叶 */
    o = o || {};
    b.panel(xc, yb, z + .003, w, h, WIN, { e: o.e || .55 });
    const t = .038, d = .03;
    strip(b, xc - w / 2 - t / 2, yb, xc - w / 2 - t / 2, yb + h, t, z, d, OAK);
    strip(b, xc + w / 2 + t / 2, yb, xc + w / 2 + t / 2, yb + h, t, z, d, OAK);
    strip(b, xc - w / 2 - t, yb + h + t / 2, xc + w / 2 + t, yb + h + t / 2, t, z, d + .006, OAK);
    b.box(xc, yb - .03, z + .02, w + .1, .03, .065, OAK2, { nb: true });
    b.panel(xc, yb, z + .006, .016, h, MULL);
    if (w > .2) for (const f of [-.25, .25]) b.panel(xc + w * f, yb, z + .006, .01, h, MULL);
    b.panel(xc, yb + h * .6, z + .007, w, .014, MULL);
    if (o.sh) for (const s of [-1, 1]) {
      b.at(xc + s * (w / 2 + t), yb, z + .03, s * -1.15);
      b.box(s * w * .27, 0, 0, w * .52, h, .018, o.sh, { nb: true });
      for (const yy of [.2, .75]) b.box(s * w * .27, h * yy, .011, w * .52, .02, .01, mix3(o.sh, [0, 0, 0], .3));
      b.pop();
    }
  }
  function flowerBox(b, x, y, z, w, n) {                    /* 窗台花箱（面朝 +z，贴在 z 的墙上）：木箱、一丛叶子、一朵朵花 */
    b.box(x, y, z + .05, w, .075, .1, BOARD, { nb: true, front: mix3(BOARD, OAK, .25) });
    b.box(x, y + .075, z + .05, w - .03, .035, .075, mix3(C.leaf, C.leafD, .45), { nb: true, k: 1.2 });
    const k = n || Math.max(3, Math.round(w / .075));
    for (let i = 0; i < k; i++) {
      const px = x - w / 2 + (i + .5) * w / k, pz = z + .04 + R() * .04;
      b.pyramid(px + (R() - .5) * .02, y + .1 + R() * .02, pz, .05, .05, .055, FLW[(i + (R() * 2 | 0)) % FLW.length], { k: 1.3 });
    }
  }
  /* 半木墙（面朝 +z，墙面在 z）：抹灰底、立柱、地梁、顶梁、腰枋、斜撑；bays 每格一个字母：w 窗、W 带百叶的窗、x 交叉撑、l/r 单斜撑、v 人字撑、s 密立柱、- 不画 */
  function htWall(b, x0, x1, y0, y1, z, bays, o) {
    o = o || {};
    const n = bays.length, bw = (x1 - x0) / n, h = y1 - y0, ym = y0 + h * .46, T = .05, d = .022, wins = [];
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * bw, xb = xa + bw, c = mix3(DAUB, R() < .5 ? [.82, .78, .7] : [.88, .86, .8], .2 + R() * .3);
      b.quad([xa, y0, z], [xb, y0, z], [xb, y1, z], [xa, y1, z], c);
    }
    strip(b, x0, y0 + T * .6, x1, y0 + T * .6, T * 1.3, z, d + .006, OAK);
    strip(b, x0, y1 - T * .6, x1, y1 - T * .6, T * 1.3, z, d + .006, OAK);
    for (let i = 0; i <= n; i++) { const x = x0 + i * bw; if ((i === 0 && o.noL) || (i === n && o.noR)) continue; strip(b, x, y0 + T * 1.2, x, y1 - T * 1.2, i === 0 || i === n ? T * 1.25 : T, z, d, OAK); }
    for (let i = 0; i < n; i++) {
      const k = bays[i], xa = x0 + i * bw + T / 2, xb = x0 + (i + 1) * bw - T / 2, xm = (xa + xb) / 2, yl = y0 + T * 1.2, yh = y1 - T * 1.2;
      if (k === "-") continue;
      if (k === "w" || k === "W") {
        const ww = Math.min(bw - .12, o.ww || .3), wh = Math.min(h - .26, o.wh || .3), yb = y0 + (h - wh) * .55;
        tWin(b, xm, yb, ww, wh, z, { sh: k === "W" ? SHUT : null });
        wins.push([xm, yb, ww]);
        continue;
      }
      strip(b, xa, ym, xb, ym, T * .85, z, d * .9, OAK);
      if (k === "x") { strip(b, xa, yl, xb, ym, T * .8, z, d * .8, OAK); strip(b, xb, yl, xa, ym, T * .8, z, d * .8, OAK); strip(b, xa, ym, xb, yh, T * .8, z, d * .8, OAK); strip(b, xb, ym, xa, yh, T * .8, z, d * .8, OAK); }
      else if (k === "l") { strip(b, xa, yl, xb, ym, T * .85, z, d * .8, OAK); strip(b, xa, yh, xb, ym, T * .85, z, d * .8, OAK); }
      else if (k === "r") { strip(b, xb, yl, xa, ym, T * .85, z, d * .8, OAK); strip(b, xb, yh, xa, ym, T * .85, z, d * .8, OAK); }
      else if (k === "v") { strip(b, xa, ym, xm, yh, T * .8, z, d * .8, OAK); strip(b, xb, ym, xm, yh, T * .8, z, d * .8, OAK); strip(b, xm, yl, xm, ym, T * .7, z, d * .8, OAK); }
      else if (k === "s") { for (const f of [1 / 3, 2 / 3]) strip(b, xa + (xb - xa) * f, yl, xa + (xb - xa) * f, yh, T * .75, z, d * .8, OAK); }
    }
    if (o.boxes) for (const [xm, yb, ww] of wins) flowerBox(b, xm, yb - .115, z, ww + .06);
    return wins;
  }
  function htGable(b, hw, y0, H, z, o) {                    /* 半木山墙（三角，面朝 +z）：领梁、中柱、斜撑、一扇木框窗、顶上一扇小尖窗 */
    o = o || {};
    tf(b, [-hw, y0, z], [hw, y0, z], [0, y0 + H, z], mix3(DAUB, [.84, .8, .72], .25), [0, 0, 1]);
    const T = .05, d = .022, yc = y0 + H * (o.yc || .5), wc = hw * (1 - (yc - y0) / H);
    strip(b, -wc - .02, yc, wc + .02, yc, T * 1.1, z, d, OAK);
    strip(b, 0, yc, 0, y0 + H - .06, T, z, d, OAK);
    for (const s of [-1, 1]) {
      strip(b, s * hw * .66, y0 + T, s * hw * .66, y0 + (yc - y0) * (1 - .66) - .01, T, z, d, OAK);
      strip(b, s * hw * .8, y0 + T, s * wc * .4, yc - .02, T * .85, z, d * .8, OAK);
      strip(b, s * .03, yc + .03, s * wc * .5, yc + (y0 + H - yc) * .42, T * .8, z, d * .8, OAK);
    }
    strip(b, -hw, y0 + T * .6, hw, y0 + T * .6, T * 1.3, z, d + .006, OAK);
    const wh = o.wh || Math.min(.26, (yc - y0) - .2);
    if (!o.nowin) tWin(b, 0, y0 + .1, o.ww || .3, wh, z, {});
    if (o.box) flowerBox(b, 0, y0 + .1 - .115, z, (o.ww || .3) + .06);
    const sy = yc + .08, sh = Math.min(.12, (y0 + H - yc) * .32);       /* 领梁上一扇小尖窗 */
    b.panel(0, sy, z + .003, .07, sh, WIN, { e: .5 });
    b.tri([-.035, sy + sh, z + .003], [.035, sy + sh, z + .003], [0, sy + sh + .045, z + .003], WIN, { e: .5 });
    strip(b, -.05, sy - .015, .05, sy - .015, .03, z, d, OAK);
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，下缘翘起一点 */
    o = o || {};
    const dx = B[0] - A[0], dy = B[1] - A[1], nb = o.nb || Math.max(2, Math.round(Math.hypot(dx, dy) / .15)), cw = o.cw || .26;
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .02, cols = o.cols || [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + (i < nb - 1 ? .035 / Math.hypot(dx, dy) : 0), xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;   /* 每道瓦往上多压一点，盖住接缝 */
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .06; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
      for (let k = 0; k < edges.length - 1; k++) {
        const base = i % 2 ? cols[0] : cols[1], r = R(), c = r < .2 ? mix3(base, cols[2], .55) : r > .85 ? mix3(base, [.5, .52, .56], .18) : mix3(base, cols[2], r * .25);
        qf(b, [xa2, ya2, edges[k]], [xa2, ya2, edges[k + 1]], [xb, yb, edges[k + 1]], [xb, yb, edges[k]], c, [N[0], N[1], 0]);
      }
      if (!o.nolip) qf(b, [xa, ya, z0], [xa, ya, z1], [xa2, ya2, z1], [xa2, ya2, z0], cols[2], dn);
    }
    if (!o.nounder) qf(b, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], o.under || mix3(OAK, [0, 0, 0], .2), [-N[0], -N[1], 0]);
    if (!o.nofascia) b.beam([A[0] + N[0] * .005, A[1] - .03, z0], [A[0] + N[0] * .005, A[1] - .03, z1], .035, OAK);
  }
  function barge(b, A, B, z, t) {                           /* 封檐板：沿坡一条厚木板 */
    b.beam([A[0], A[1] - .02, z], [B[0], B[1] - .02, z], t || .045, OAK2, { tz: .035 });
  }
  function cresting(b, x0, x1, y, z, cy) {                  /* 屋脊：脊瓦、一排铁花（2077 黄铜） */
    b.beam([x0, y - .03, z], [x1, y - .03, z], .075, SLD, { tz: .075 });
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M, n = Math.max(2, Math.round((x1 - x0) / .22));
    for (let i = 0; i <= n; i++) { const x = x0 + .04 + i * (x1 - x0 - .08) / n; b.beam([x, y + .02, z], [x, y + .1, z], .014, fr, fo); b.pyramid(x, y + .1, z, .035, .012, .05, fr, fo); }
    b.beam([x0 + .04, y + .07, z], [x1 - .04, y + .07, z], .01, fr, fo);
  }
  function spire(b, cx, y, cz, r, h, seg) {                 /* 石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带 */
    b.cyl(cx, y, cz, r * 1.1, h * .05, seg, SL2, { r2: r * .96, nt: true, bot: STD });
    const y0 = y + h * .05, H = h * .95, nb = 6;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true });
    }
    return y + h;
  }
  function lucarne(b, cx, cz, a, y, rr) {                   /* 尖顶上的小老虎窗 */
    b.at(cx, 0, cz, a);
    b.box(0, y, rr - .06, .14, .16, .2, mix3(SL, STD, .4));
    b.panel(0, y + .03, rr + .041, .075, .09, WIN, { e: .55 });
    b.at(0, y + .16, rr - .06, PI / 2); b.gable(0, 0, 0, .22, .2, .11, SL2, { end: mix3(SL, STD, .4) }); b.pop();
    b.pop();
  }
  function soot(y0, y1) { return y => mix3(mix3(sc(y0 + y), STD, .5), [.2, .19, .2], Math.max(0, Math.min(.45, y / (y1 - y0) * .5))); }
  function chimney(b, x, z, y0, y1, lean, smoke) {          /* 石烟囱：错缝砌石、越往上越熏黑、压顶石、两只陶烟囱帽，冒烟 */
    b.at(x, y0, z, 0, 1, 0, lean || 0);
    const h = y1 - y0;
    stoneBox(b, -.14, .14, 0, h, -.11, .11, { rh: .14, col: soot(y0, y1) });
    b.box(0, h - .16, 0, .34, .04, .28, DRESS2, { top: mix3(DRESS2, STD, .3) });                 /* 腰线 */
    b.box(0, h, 0, .34, .05, .28, DRESS2, { top: mix3(DRESS2, [.2, .2, .2], .35) });
    for (const dx of [-.065, .065]) b.cyl(dx, h + .05, 0, .045, .14, 6, POT, { r2: .037, top: [.12, .1, .1] });
    if (smoke) b.emit(.065, h + .4, 0, "smoke", 8, 1);
    b.pop();
  }

  /* ---------- 门前杂物 ---------- */
  function barrel(b, x, z, r, h, ry) {                      /* 木桶：桶板、三道铁箍 */
    b.at(x, 0, z, ry || 0);
    b.cyl(0, 0, 0, r * .88, h * .5, 8, OAK2, { r2: r, nt: true, nb: true });
    b.cyl(0, h * .5, 0, r, h * .5, 8, mix3(OAK2, C.wood, .2), { r2: r * .88, nt: true, nb: true });
    for (const t of [.16, .82]) b.cyl(0, h * t - .012, 0, r * .96 + .008, .026, 8, IRON, { nt: true, nb: true, mat: "metal" });
    b.disc(0, h * .98, 0, r * .86, 8, mix3(OAK2, C.plank, .4));
    b.pop();
  }
  function crate(b, x, y, z, s, ry) {                       /* 木箱：板条 */
    b.at(x, y, z, ry || 0, s);
    b.box(0, 0, 0, .3, .26, .3, BOARD);
    for (const f of [0, 1]) {
      b.at(0, 0, 0, f * PI / 2);
      for (const sz of [-1, 1]) { b.at(0, 0, 0, sz < 0 ? PI : 0); for (const sx of [-1, 1]) b.panel(sx * .135, 0, .152, .03, .26, OAK2); b.panel(0, .115, .153, .27, .03, OAK2); b.pop(); }
      b.pop();
    }
    b.pop();
  }
  function bench(b, x, z, L) {                              /* 门前长椅：座板、靠背、腿 */
    b.box(x, .2, z, L, .035, .15, OAK2, { top: mix3(OAK2, C.woodL, .2) });
    for (const s of [-1, 1]) { b.box(x + s * (L / 2 - .07), 0, z + .02, .04, .2, .1, OAK, { nb: true }); b.beam([x + s * (L / 2 - .07), .2, z - .065], [x + s * (L / 2 - .07), .46, z - .085], .035, OAK); }
    b.box(x, .3, z - .075, L - .04, .05, .022, OAK2);
    b.box(x, .39, z - .08, L - .04, .05, .022, OAK2);
  }
  function table(b, x, y, z, cy) {                          /* 小圆桌：一根柱、桌面、桌上一只杯子 */
    b.cyl(x, y, z, .07, .02, 6, OAK, { nb: true });
    b.cyl(x, y + .02, z, .022, .24, 5, cy ? BRASS : OAK, Object.assign({ nb: true, nt: true }, cy ? GL : {}));
    b.cyl(x, y + .26, z, .14, .025, 8, OAK2, { top: mix3(BOARD, C.woodL, .25) });
    b.cyl(x + .04, y + .285, z + .02, .02, .05, 5, cy ? BRASS : mix3(C.woodL, C.white, .3), cy ? GL : {});
    b.cyl(x - .05, y + .285, z - .02, .018, .045, 5, mix3(C.woodL, C.white, .3));
  }
  function stool(b, x, y, z) { b.cyl(x, y, z, .05, .16, 6, OAK2, { r2: .056, top: BOARD, nb: true }); }
  function broom(b, x, yTop, z, len, lean) {                /* 靠墙的扫帚：帚把斜靠，帚苗在下 */
    const bx = x + lean, by = yTop - len;
    b.beam([x, yTop, z], [bx, by, z + .06], .024, C.woodL);
    b.at(bx, by, z + .06, 0, 1, 0, Math.atan2(lean, len) * -1 + PI);
    b.cyl(0, 0, 0, .03, .25, 6, HAY, { r2: .075, nb: true });
    b.cyl(0, .02, 0, .036, .03, 6, mix3(C.cloth, C.woodD, .3), { nb: true, nt: true });
    b.pop();
  }
  function hangSign(b, x, y, z, cy) {                       /* 墙上挑出的木招牌（牌面朝 ±x）：铁臂、卷花、链子、木牌，牌上一只金色啤酒杯；2077 黄铜臂、臂端一盏黄铜招牌灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y - .12, z + .01, .05, .22, .02, fr, fo);
    b.beam([x, y, z], [x, y, z + .52], .022, fr, fo);
    b.beam([x, y - .16, z], [x, y, z + .26], .015, fr, fo);
    b.at(x, y - .045, z + .1, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .04, .007, 6, 3, fr, fo); b.pop();
    b.pyramid(x, y - .02, z + .53, .04, .04, .05, fr, fo);
    for (const dz of [.17, .45]) b.beam([x, y, z + dz], [x, y - .07, z + dz], .009, fr, fo);
    const by = y - .38, bz = z + .31;
    b.box(x, by, bz, .032, .31, .34, BOARD);
    b.box(x, by + .31, bz, .042, .022, .36, OAK); b.box(x, by - .02, bz, .042, .022, .36, OAK);
    for (const s of [-1, 1]) b.box(x, by, bz + s * .17, .042, .31, .022, OAK);
    for (const s of [-1, 1]) {                               /* 牌面两边：金色啤酒杯、泡沫、把手，下面两把交叉的扫帚 */
      b.at(x + s * .0165, 0, bz, s * PI / 2);
      b.panel(0, by + .12, .002, .1, .12, C.gold, M);
      b.panel(0, by + .23, .003, .12, .035, mix3(C.cream, C.white, .5));
      b.panel(-.03, by + .262, .003, .05, .02, mix3(C.cream, C.white, .5));
      b.panel(s * .072, by + .14, .002, .03, .075, C.gold, M);
      b.panel(0, by + .1, .003, .11, .016, mix3(C.gold, OAK, .3), M);
      b.panel(0, by + .05, .003, .2, .014, C.gold, M);
      b.pop();
    }
    if (cy) {                                                /* 黄铜招牌灯：臂端一只小灯罩，朝下照牌子 */
      b.beam([x, y + .005, z + .5], [x, y + .09, z + .5], .012, BRASS, GL);
      b.cone(x, y + .02, z + .5, .055, .07, 6, BRASS, Object.assign({ bot: C.lamp }, GL));
      b.cyl(x, y - .015, z + .5, .028, .035, 6, C.lamp, { e: .7 });
    }
  }
  function woodpile(b, x0, z0, z1, h) {                     /* 靠墙的柴垛：一层层原木，上面一道石板瓦小披檐（贴在 x0 的墙，朝 +x） */
    const L = z1 - z0, rows = 3;
    for (let j = 0; j < rows; j++) for (let i = 0; i < 4 - (j > 1 ? 1 : 0); i++) {
      const zz = z0 + .06 + (i + (j % 2) * .5) * (L - .12) / 3.5, yy = .055 + j * .1, xx = x0 + .12;
      b.at(xx, yy, zz, 0, 1, 0, PI / 2); b.cyl(0, -.12, 0, .05, .24, 5, mix3(C.woodL, C.wood, R()), { top: mix3(C.woodL, C.hay, .4), bot: mix3(C.woodL, C.hay, .4) }); b.pop();
    }
    for (const z of [z0, z1]) b.box(x0 + .23, 0, z, .04, h, .04, OAK);
    b.at(x0, 0, (z0 + z1) / 2, PI / 2); wedge(b, 0, h, .15, L + .1, .14, .32, SL2); b.pop();
  }

  /* ================= 主楼 ================= */
  const P = .1, Y1 = 1.04, Y2 = 1.8, ZF = .66, ZB = -.66, ZJ = .78, XW = 1.0;
  const ZC = (ZJ + ZB) / 2, HD = (ZJ - ZB) / 2, RISE = 1.0, YR = Y2 + RISE, K = RISE / HD, OV = .14, XO = XW + .12;
  const CW = .42, K2 = 1.85, YRC = Y2 + CW * K2, ZV = ZJ - (YRC - Y2) / K;      /* 正中山墙：半宽、坡度、屋脊高；ZV 是它屋脊插进主坡的地方 */

  function bayWin(b, x, w, y0, h, d) {                      /* 底层外凸的小格子凸窗：石裙、窗台、三面烛光玻璃、细木格、铅皮小斜顶 */
    const z = ZF, zf = z + d, x0 = x - w / 2, x1 = x + w / 2;
    b.box(x, P, z + d / 2, w + .02, y0 - P - .03, d, sc(.4), { nb: true, top: DRESS2 });
    b.box(x, y0 - .035, z + d / 2 + .01, w + .07, .035, d + .04, DRESS, { nb: true });
    b.panel(x, y0, zf, w - .02, h, WIN, { e: .5 });
    qf(b, [x0 + .01, y0, z], [x0 + .01, y0, zf], [x0 + .01, y0 + h, zf], [x0 + .01, y0 + h, z], WIN, [-1, 0, 0], { e: .5 });
    qf(b, [x1 - .01, y0, z], [x1 - .01, y0, zf], [x1 - .01, y0 + h, zf], [x1 - .01, y0 + h, z], WIN, [1, 0, 0], { e: .5 });
    for (const s of [-1, 1]) b.box(x + s * (w / 2 - .01), y0, zf, .035, h, .035, OAK2);
    for (let i = 1; i < 4; i++) b.panel(x - w / 2 + i * w / 4, y0, zf + .004, .012, h, MULL);
    for (let j = 1; j < 3; j++) b.panel(x, y0 + j * h / 3, zf + .005, w - .03, .012, MULL);
    b.box(x, y0 + h, z + d / 2, w + .03, .05, d + .015, OAK2);
    wedge(b, x, y0 + h + .05, z + (d + .06) / 2 - .01, w + .09, .1, d + .06, LEAD);
  }
  function dormer(b, x, cy) {                               /* 主坡上的老虎窗：抹灰小墙、木框窗、小人字顶、尖针 */
    const zf = ZJ - .1, yb = Y2 + (ZJ - zf) * K - .04, w = .32, top = yb + .3, zb = ZJ - (top + .1 - Y2) / K - .05;
    b.box(x, yb, (zf + zb) / 2, w, top - yb, zf - zb, mix3(DAUB, [.8, .76, .68], .3), { nb: true });
    tWin(b, x, yb + .06, .18, .17, zf, { e: .55 });
    for (const s of [-1, 1]) strip(b, x + s * (w / 2 - .02), yb, x + s * (w / 2 - .02), top, .04, zf, .02, OAK);
    b.at(x, top, (zf + .05 + zb) / 2, PI / 2);
    b.gable(0, 0, 0, zf + .05 - zb, w + .1, .2, SL2, { end: mix3(DAUB, [.8, .76, .68], .3) });
    b.pop();
    b.beam([x - w / 2 - .05, top - .015, zf + .055], [x, top + .19, zf + .055], .035, OAK2, { tz: .03 });
    b.beam([x + w / 2 + .05, top - .015, zf + .055], [x, top + .19, zf + .055], .035, OAK2, { tz: .03 });
    b.beam([x, top + .17, zf + .05], [x, top + .34, zf + .05], .016, cy ? BRASS : IRON, cy ? GL : M);
  }
  function mainHouse(b, o) {
    const cy = o.cyber, lv = o.lv;
    /* 台基、底层石墙 */
    stoneBox(b, -XW - .04, XW + .04, 0, P, ZB - .04, ZF + .04, { q: false, rh: .1, col: () => mix3(ST2, STD, .25 + R() * .45), top: DRESS2 });
    stoneBox(b, -XW, XW, P, Y1, ZB, ZF, {});
    /* 挑檐：楼板、一排梁头、转角斜撑 */
    b.box(0, Y1, ZC - .0, XW * 2 + .04, .065, ZJ - ZB + .03, OAK);
    for (let i = 0; i < 11; i++) { const x = -XW + .05 + i * (XW * 2 - .1) / 10; b.box(x, Y1 - .055, (ZF + ZJ) / 2 + .01, .05, .055, ZJ - ZF + .02, OAK2); }
    for (const s of [-1, 1]) b.beam([s * (XW - .04), Y1 - .34, ZF], [s * (XW - .04), Y1 - .02, ZJ - .02], .05, OAK);
    /* 正面：门、门洞料石券、石阶、两扇凸窗、两盏壁灯 */
    b.at(0, P, ZF); archRing(b, .38, .46, .62, .06, -.03, .04); b.pop();
    b.at(0, P, ZF + .008); door(b, .38, .46, .62); b.pop();
    b.box(0, 0, ZF + .14, .62, P, .2, mix3(DRESS2, STD, .2), { top: DRESS, nb: true });
    b.box(0, 0, ZF + .29, .48, P * .5, .12, mix3(DRESS2, STD, .3), { top: DRESS2, nb: true });
    for (const s of [-1, 1]) bayWin(b, s * .66, .42, .34, .42, .13);
    for (const s of [-1, 1]) wallLantern(b, s * .33, .84, ZF, cy);
    /* 侧面、背面底层的窗、后门 */
    for (const s of [-1, 1]) { if (s < 0 && lv >= 2) continue; b.at(s * XW, 0, .32 - (s > 0 && lv >= 3 ? 0 : .32), s * PI / 2); lancet(b, 0, .42, 0, .18, .28, { p: .66 }); b.pop(); }
    b.at(0, 0, ZB, PI);
    lancet(b, -.55, .42, 0, .18, .28, { p: .66 }); lancet(b, .6, .42, 0, .18, .28, { p: .66 });
    b.box(0, P, .015, .34, .6, .03, mix3(C.woodD, C.wood, .25)); for (let i = 1; i < 4; i++) b.panel(-.17 + i * .085, P, .032, .01, .6, OAK);
    b.box(0, P + .6, .02, .42, .05, .05, DRESS2); b.box(0, 0, .1, .44, P * .6, .16, DRESS2, { nb: true });
    b.pop();
    /* 上层半木墙（正面带花箱） */
    const y0 = Y1 + .065;
    htWall(b, -XW, XW, y0, Y2, ZJ, ["W", "l", "w", "r", "W"], { ww: .26, wh: .32, boxes: true });
    b.at(0, 0, ZB, PI); htWall(b, -XW, XW, y0, Y2, 0, ["x", "w", "s", "w", "x"], { ww: .24, wh: .3 }); b.pop();
    b.at(XW, 0, ZC, PI / 2); htWall(b, -HD, HD, y0, Y2, 0, ["l", "w", "r"], { ww: .26, wh: .3 }); b.pop();
    b.at(-XW, 0, ZC, -PI / 2); htWall(b, -HD, HD, y0, Y2, 0, ["l", "w", "r"], { ww: .26, wh: .3 }); b.pop();
    /* 两头的半木山墙、封檐板 */
    for (const s of [-1, 1]) { b.at(s * XW, 0, ZC, s * PI / 2); htGable(b, HD, Y2, RISE, 0, { ww: .28 }); b.pop(); }
    b.at(0, 0, 0, PI / 2);
    for (const s of [-1, 1]) { barge(b, [-(ZJ + OV), Y2 - OV * K], [-ZC, YR + .01], s * (XO - .01)); barge(b, [-(ZB - OV), Y2 - OV * K], [-ZC, YR + .01], s * (XO - .01)); }
    /* 主坡：后坡一整片，前坡左右两片＋正中山墙后面一片，再补两块斜沟三角 */
    slope(b, [-(ZB - OV), Y2 - OV * K], [-ZC, YR], -XO, XO);
    slope(b, [-(ZJ + OV), Y2 - OV * K], [-ZC, YR], -XO, -CW);
    slope(b, [-(ZJ + OV), Y2 - OV * K], [-ZC, YR], CW, XO);
    slope(b, [-ZV, YRC], [-ZC, YR], -CW, CW, { nofascia: true, nounder: true, nolip: true });
    b.pop();
    for (const s of [-1, 1]) tf(b, [0, YRC + .02, ZV], [s * CW, YRC + .02, ZV], [s * CW, Y2 + .02, ZJ], SL, [0, 1, .5]);
    cresting(b, -XO + .04, XO - .04, YR + .02, ZC, cy);
    for (const s of [-1, 1]) b.beam([s * (XO - .02), YR - .05, ZC], [s * (XO - .02), YR + .3, ZC], .02, cy ? BRASS : IRON, cy ? GL : M);
    /* 正中山墙：半木三角、坡、封檐板、尖针 */
    htGable(b, CW, Y2, YRC - Y2, ZJ, { ww: .26, wh: .2, yc: .45 });
    for (const s of [-1, 1]) {
      slope(b, [s * (CW + .09), Y2 - .09 * K2], [0, YRC], ZV - .06, ZJ + .1);
      barge(b, [s * (CW + .1), Y2 - .1 * K2], [0, YRC + .01], ZJ + .09);
    }
    b.beam([0, YRC - .04, ZJ + .1], [0, YRC - .04, ZV], .07, SLD, { tz: .07 });
    b.beam([0, YRC - .05, ZJ + .1], [0, YRC + .3, ZJ + .1], .02, cy ? BRASS : IRON, cy ? GL : M);
    b.sphere(0, YRC + .2, ZJ + .1, .025, 4, cy ? BRASS : C.gold, cy ? GL : M);
    /* 老虎窗、烟囱 */
    for (const s of [-1, 1]) dormer(b, s * .74, cy);
    chimney(b, -.62, ZC - .05, YR - .3, YR + .42, .05, true);
    chimney(b, .66, ZC - .1, YR - .3, YR + .34, -.02, lv >= 2);
    /* 招牌、长椅、木桶、木箱、常春藤 */
    if (lv < 2) hangSign(b, -XW + .06, Y1 + .26, ZJ, cy);
    bench(b, -.66, ZF + .32, .56);
    barrel(b, .9, ZF + .34, .11, .3, .4); barrel(b, .7, ZF + .36, .09, .24, 1.1);
    crate(b, .93, .3, ZF + .32, .55, .3);
    ivy(b, -XW + .1, P, ZF, .3, .75, 22);
    b.at(-XW, 0, ZC, -PI / 2); ivy(b, .55, P, 0, .3, .8, lv >= 2 ? 0 : 18); b.pop();
    if (lv < 3) { b.at(XW, 0, 0); woodpile(b, 0, -.6, -.05, .42); b.pop(); }
  }

  /* ================= Lv2 侧翼 ================= */
  const WX0 = -1.72, WX1 = -XW, WZ0 = -.5, WZ1 = .98, WC = (WX0 + WX1) / 2, WH = (WX1 - WX0) / 2, YW = 1.12, KW = 2.0, YRW = YW + WH * KW;
  function wing(b, o) {                                     /* 往前伸出来的侧翼：石砌底层、正面半木山墙，和主楼围出一个小前院 */
    const cy = o.cyber, pc = () => mix3(ST2, STD, .25 + R() * .45), zm = (WZ0 + WZ1) / 2;
    stoneBox(b, WX0 - .04, WX1, 0, P, WZ0 - .04, WZ1 + .04, { q: false, rh: .1, nr: true, col: pc, top: DRESS2 });
    stoneBox(b, WX0, WX1, P, YW, WZ0, WZ1, { nr: true });
    const Lr = WZ1 - ZF;                                      /* 主楼前面露出来的一截右墙 */
    b.at(WX1, 0, (ZF + WZ1) / 2 + .02, PI / 2); mason(b, () => [-Lr / 2 - .02, Lr / 2 - .02], 0, P, .04, { rh: .1, col: pc }); mason(b, () => [-Lr / 2 + .02, Lr / 2 - .02], P, YW, 0, { ql: true });
    banner(b, .02, YW - .06, 0, .16, .5, C.banner); b.pop();
    /* 正面：双联尖拱窗、花箱；半木山墙 */
    b.at(WC, 0, WZ1);
    for (const s of [-1, 1]) lancet(b, s * .1, .4, 0, .15, .34, { p: .68, nosill: true });
    b.box(0, .34, .01, .44, .035, .08, DRESS2, { nb: true });
    flowerBox(b, 0, .26, 0, .44, 6);
    b.box(0, YW, .0, WH * 2 + .02, .05, .06, OAK);
    htGable(b, WH, YW + .05, YRW - YW - .05, 0, { ww: .22, wh: .2 });
    b.pop();
    b.at(WC, 0, WZ0, PI); htGable(b, WH, YW, YRW - YW, 0, { nowin: true }); b.pop();
    slope(b, [WX0 - .1, YW - .1 * KW], [WC, YRW], WZ0 - .1, WZ1 + .1);
    slope(b, [WX1 + .08, YW - .08 * KW], [WC, YRW], ZF - .25, WZ1 + .1);
    slope(b, [WX1 - .02, YW + .02 * KW], [WC, YRW], WZ0 - .1, ZF - .25, { nofascia: true, nolip: true });
    barge(b, [WX0 - .1, YW - .1 * KW], [WC, YRW + .01], WZ1 + .09); barge(b, [WX1 + .08, YW - .08 * KW], [WC, YRW + .01], WZ1 + .09);
    barge(b, [WX0 - .1, YW - .1 * KW], [WC, YRW + .01], WZ0 - .09);
    b.at(WC, 0, 0, PI / 2); cresting(b, -WZ1 - .08, -WZ0 + .08, YRW + .02, 0, cy); b.pop();
    b.beam([WC, YRW - .05, WZ1 + .1], [WC, YRW + .28, WZ1 + .1], .02, cy ? BRASS : IRON, cy ? GL : M);
    /* 侧墙：两扇小窗、扫帚架（三把扫帚靠墙）、常春藤 */
    b.at(WX0, 0, zm, -PI / 2);
    lancet(b, -.5, .45, 0, .14, .26, { p: .66 }); lancet(b, .42, .45, 0, .14, .26, { p: .66 });
    b.box(-.05, .66, .02, .44, .04, .05, OAK2);
    for (let i = 0; i < 3; i++) { const xx = -.2 + i * .14; b.box(xx, .7, .05, .02, .05, .04, IRON, M); broom(b, xx, .78, .03, .58, .05 + i * .02); }
    ivy(b, .62, P, 0, .2, .8, 16);
    b.pop();
    b.at(WX0, 0, WZ1, 0); ivy(b, .12, P, 0, .22, .7, 10); b.pop();
    chimney(b, WC, WZ0 + .16, YRW - .45, YRW + .3, .03, true);
  }

  /* ================= Lv3 塔楼、露台 ================= */
  const TX = 1.3, TZ = -.3, TRD = .44, TSEG = 10, TH = 3.05;
  function tower(b, o) {
    const cy = o.cyber;
    b.cyl(TX, 0, TZ, TRD + .05, P, TSEG, mix3(ST2, STD, .4), { top: DRESS2, nb: true });
    rwall(b, TX, TZ, TRD, P, TH, TSEG, .17);
    for (const y of [1.06, 2.06]) b.cyl(TX, y, TZ, TRD + .03, .05, TSEG, DRESS2, { top: DRESS, bot: DRESS2 });
    const win = (a, y, w, h) => { b.at(TX, 0, TZ, a); lancet(b, 0, y, TRD - .01, w, h, { p: .7 }); b.pop(); };
    /* 底层：朝露台的塔门；二三层：尖拱窗 */
    b.at(TX, 0, TZ, .15);
    b.at(0, P, TRD - .02); archRing(b, .26, .4, .62, .05, -.03, .05); b.pop();
    b.at(0, P, TRD); door(b, .26, .4, .62, { planks: 4, straps: [.1, .3] }); b.pop();
    b.pop();
    win(1.35, .45, .14, .26);
    win(.25, 1.36, .16, .3); win(1.35, 1.36, .16, .3); win(2.6, 1.36, .14, .28);
    win(.6, 2.36, .16, .3); win(1.8, 2.36, .14, .28); win(-.45, 2.36, .14, .28);
    /* 托石挑檐、尖顶、老虎窗、小旗、挂旗 */
    for (let i = 0; i < 10; i++) { b.at(TX, 0, TZ, (i + .5) / 10 * TAU); cbox(b, 0, TH - .12, TRD - .05, .07, .12, TRD + .07, DRESS2); b.pop(); }
    b.cyl(TX, TH, TZ, TRD + .08, .1, TSEG, DRESS2, { top: DRESS });
    const top = spire(b, TX, TH + .1, TZ, TRD + .1, 1.55, TSEG);
    lucarne(b, TX, TZ, .4, TH + .42, (TRD + .1) * .78);
    b.cyl(TX, top - .06, TZ, .03, .08, 6, cy ? BRASS : IRON, cy ? GL : M);
    flag(b, TX, top, TZ, C.banner, .5);
    b.at(TX, 0, TZ, -.55); banner(b, 0, 1.9, TRD + .005, .2, .62, C.banner2); b.pop();
    rivy(b, TX, TZ, TRD, 1.0, 1.1, P, 1.5, 34);
  }
  const RX0 = XW, RX1 = 1.86, RZ0 = .14, RZ1 = 1.1, RH = .24, GZ1 = .74;
  function terrace(b, o) {                                  /* 石砌露台：挡土石墙、压顶、石栏杆、前面两级石阶 */
    const cy = o.cyber, sx0 = 1.26, sx1 = 1.62;
    stoneBox(b, RX0, RX1, 0, RH, RZ0, RZ1, { nb: true, rh: .12, q: true });
    b.quad([RX0, RH, RZ1], [RX1, RH, RZ1], [RX1, RH, RZ0], [RX0, RH, RZ0], mix3(C.stone, ST2, .4));
    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { const x = RX0 + .1 + j * .28 + (i % 2) * .1, z = RZ0 + .08 + i * .16; if (x < RX1 - .12) b.quad([x, RH + .004, z + .07], [x + .24, RH + .004, z + .07], [x + .24, RH + .004, z - .07], [x, RH + .004, z - .07], mix3(C.stone, ST2, R() * .7)); }
    for (let i = 0; i < 2; i++) b.box((sx0 + sx1) / 2, 0, RZ1 + .07 + i * .12, sx1 - sx0, RH * (2 - i) / 3, .12 + (1 - i) * .02, mix3(ST2, STD, .25), { top: i ? DRESS2 : DRESS, nb: true });
    /* 石栏杆 */
    const rail = (a, c) => {
      const L = Math.hypot(c[0] - a[0], c[1] - a[1]), n = Math.max(2, Math.round(L / .075));
      b.beam([a[0], RH + .3, a[1]], [c[0], RH + .3, c[1]], .06, DRESS, { tz: .07 });
      b.beam([a[0], RH + .02, a[1]], [c[0], RH + .02, c[1]], .055, DRESS2, { tz: .065 });
      for (let i = 1; i < n; i++) { const t = i / n, x = a[0] + (c[0] - a[0]) * t, z = a[1] + (c[1] - a[1]) * t; b.cyl(x, RH + .045, z, .017, .26, 4, mix3(DRESS2, ST2, .3), { r2: .022, nt: true, nb: true }); }
    };
    const post = (x, z) => { b.box(x, RH, z, .085, .34, .085, DRESS2, { top: DRESS, nb: true }); b.pyramid(x, RH + .34, z, .09, .09, .05, DRESS); };
    const fz = RZ1 - .05, rx = RX1 - .05, zr = cy ? GZ1 + .06 : RZ0 + .3;
    rail([RX0 + .05, fz], [sx0 - .04, fz]); rail([sx1 + .04, fz], [rx, fz]); rail([rx, fz], [rx, zr]);
    post(RX0 + .05, fz); post(sx0 - .04, fz); post(sx1 + .04, fz); post(rx, zr);
    b.box(rx, RH, fz, .1, .36, .1, DRESS2, { nb: true }); lampPost(b, rx, RH + .36, fz, cy, .5);
    if (!cy) {                                               /* 1994：两张小圆桌、凳子、爬满藤的木花架 */
      table(b, 1.32, RH, .52); stool(b, 1.15, RH, .5); stool(b, 1.48, RH, .58);
      table(b, 1.56, RH, .86); stool(b, 1.4, RH, .9); stool(b, 1.7, RH, .78);
      const ph = RH + 1.02, px = [RX0 + .12, rx - .17], pz = fz - .12;
      for (const x of px) { b.box(x, RH, pz, .06, ph - RH, .06, OAK2); }
      for (const x of px) b.beam([x, ph, pz + .08], [x, ph, RZ0 - .02], .06, OAK);
      for (let i = 0; i < 5; i++) { const z = pz + .02 - i * (pz - RZ0) / 4.2; b.beam([px[0] - .08, ph + .06, z], [px[1] + .08, ph + .06, z], .04, OAK2); }
      for (let i = 0; i < 40; i++) {                         /* 葡萄藤叶：搭在花架顶上，几串垂下来 */
        const x = px[0] + R() * (px[1] - px[0]), z = RZ0 + R() * (pz - RZ0), s = .05 + R() * .04, y = ph + .1 + R() * .03;
        b.quad([x - s, y, z], [x, y + .01, z + s], [x + s, y, z], [x, y - .01, z - s], mix3(C.leaf, C.leafD, R() * .8), { k: 1.25 });
      }
      for (const x of px) for (let i = 0; i < 9; i++) { const y = RH + .1 + R() * .9, z = pz + (R() - .5) * .06, s = .03 + R() * .02, xx = x + (R() - .5) * .1; fan(b, [[xx - s, y], [xx, y - s], [xx + s, y], [xx, y + s]], z + .035, mix3(C.ivy, C.leaf, R() * .5)); }
    } else {                                                 /* 2077：玻璃餐厅占了露台后半，前面一条露天座 */
      table(b, 1.12, RH, .96, true); stool(b, .98, RH, .92);
      b.emit(1.5, RH + 1.05, .98, "cat", 1, 1);
    }
  }
  function glassRoom(b, y0, z0, z1, o) {                    /* 2077 玻璃餐厅：石窗台墙、黄铜框玻璃、玻璃山墙顶、黄铜椽子和屋脊花饰；里头小圆桌、吊灯 */
    const x0 = XW, x1 = 1.84, xc = (x0 + x1) / 2, hw = (x1 - x0) / 2, ys = y0 + .13, yt = ys + .6, yr = yt + .42, back = true;
    if (y0 > .02) stoneBox(b, x0, x1, 0, y0, z0, z1, { q: false, rh: .1, nl: true, nb: !back, col: () => mix3(ST2, STD, .25 + R() * .45) });
    b.quad([x0, y0 + .002, z1], [x1, y0 + .002, z1], [x1, y0 + .002, z0], [x0, y0 + .002, z0], mix3(C.stone, C.white, .25));
    stoneBox(b, x0, x1, y0, ys, z0, z1, { q: false, rh: .13, nl: true, nb: !back, top: DRESS });
    const G = { mat: "glass" };
    b.quad([x0, ys, z1], [x1, ys, z1], [x1, yt, z1], [x0, yt, z1], GLASS, G);
    b.quad([x1, ys, z1], [x1, ys, z0], [x1, yt, z0], [x1, yt, z1], GLASS, G);
    if (back) b.quad([x1, ys, z0], [x0, ys, z0], [x0, yt, z0], [x1, yt, z0], GLASS, G);
    b.tri([x0, yt, z1], [x1, yt, z1], [xc, yr, z1], GLASS, G);
    for (const s of [-1, 1]) b.quad([xc + s * (hw + .05), yt - .035, z1 + .05], [xc + s * (hw + .05), yt - .035, z0 - .02], [xc, yr, z0 - .02], [xc, yr, z1 + .05], GLASS, G);
    /* 黄铜骨架 */
    const BR = Object.assign({}, GL), t = .028;
    for (const x of [x0 + .015, x0 + (x1 - x0) / 3, x0 + (x1 - x0) * 2 / 3, x1 - .015]) b.beam([x, ys, z1 - .01], [x, yt, z1 - .01], t, BRASS, BR);
    for (let i = 1; i <= 3; i++) { const z = z1 - (z1 - z0) * i / 3; if (!back && i === 3) continue; b.beam([x1 - .01, ys, z], [x1 - .01, yt, z], t, BRASS, BR); }
    if (back) for (const x of [x0 + (x1 - x0) / 3, x0 + (x1 - x0) * 2 / 3]) b.beam([x, ys, z0 + .01], [x, yt, z0 + .01], t, BRASS, BR);
    b.beam([x0, yt, z1 - .01], [x1, yt, z1 - .01], .035, BRASS, BR); b.beam([x1 - .01, yt, z1], [x1 - .01, yt, z0], .035, BRASS, BR);
    if (back) b.beam([x0, yt, z0 + .01], [x1, yt, z0 + .01], .035, BRASS, BR);
    b.beam([x0, ys + .42, z1 - .01], [x1, ys + .42, z1 - .01], .016, BRASS, BR); b.beam([x1 - .01, ys + .42, z1], [x1 - .01, ys + .42, z0], .016, BRASS, BR);
    for (const s of [-1, 1]) b.beam([xc + s * (hw + .05), yt - .035, z1 + .05], [xc, yr, z1 + .05], .03, BRASS, BR);
    const nr = 3;
    for (let i = 0; i <= nr; i++) { const z = z1 + .04 - (z1 + .02 - z0) * i / nr; for (const s of [-1, 1]) b.beam([xc + s * (hw + .04), yt - .03, z], [xc, yr, z], .02, BRASS, BR); }
    b.beam([xc, yr, z1 + .06], [xc, yr, z0 - .03], .03, BRASS, BR);
    for (let i = 0; i <= 4; i++) { const z = z1 + .02 - (z1 - z0) * i / 4; b.beam([xc, yr, z], [xc, yr + .06, z], .01, BRASS, BR); b.pyramid(xc, yr + .05, z, .03, .03, .05, BRASS, BR); }
    b.at(xc, yt + .17, z1 + .006, 0, 1, PI / 2); b.torus(0, 0, 0, .075, .012, 10, 3, BRASS, BR); b.pop();
    b.beam([xc, yr + .02, z1 + .06], [xc, yr + .2, z1 + .06], .014, BRASS, BR); b.pyramid(xc, yr + .18, z1 + .06, .04, .04, .07, BRASS, BR);
    /* 里头：两张小圆桌、凳子、一盆绿植、吊灯 */
    table(b, xc - .14, y0, z1 - .22, true); stool(b, xc - .3, y0, z1 - .2); stool(b, xc + .02, y0, z1 - .26);
    table(b, xc + .14, y0, (z0 + z1) / 2 - .12, true); stool(b, xc + .3, y0, (z0 + z1) / 2 - .1);
    b.cyl(x1 - .1, y0, z0 + .12, .06, .1, 6, POT); b.sphere(x1 - .1, y0 + .2, z0 + .12, .1, 5, mix3(C.leaf, C.leafD, .4), { sy: 1.2 });
    b.beam([xc, yr, (z0 + z1) / 2], [xc, yt - .02, (z0 + z1) / 2], .008, BRASS, BR);
    b.cone(xc, yt - .06, (z0 + z1) / 2, .07, .06, 6, BRASS, Object.assign({ bot: C.lamp }, BR));
    b.sphere(xc, yt - .07, (z0 + z1) / 2, .03, 4, C.lamp, { e: .65 });
  }

  function build(b, o) {
    R = o.rnd || Math.random;
    const lv = o.lv || 1, cy = !!o.cyber;
    mainHouse(b, o);
    if (lv >= 2) { wing(b, o); hangSign(b, WX1 - .07, YW + .14, WZ1, cy); }
    if (lv >= 3) { tower(b, o); terrace(b, o); }
    if (cy) {
      if (lv >= 3) glassRoom(b, RH, RZ0, GZ1, { tower: true });
      else glassRoom(b, .1, .02, .78, {});
      b.emit(-.42, 1.18, ZF + .62, "cat", 1, 1);
    }
  }
  build.h = o => (o.lv >= 3 ? TH + .1 + 1.55 + .45 : YR + .62);
  Isle3D.FAC["民宿"] = build;
})();
