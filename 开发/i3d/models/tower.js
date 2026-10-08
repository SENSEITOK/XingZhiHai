/* 魔女塔：霍格沃茨式哥特石塔。
   1994：风化灰石圆塔，塔身两段收分、一圈圈错缝石砌；塔腰托石挑出带垛口的观景廊，廊下挂两面旗；外挂一道绕塔而上的石阶（铁扶手）；
         尖拱窗透暖烛光，尖锥石板瓦顶带小老虎窗、尖针小旗；门口铁提灯、扫帚、坩埚，墙根爬常春藤。
         Lv2 加一座副塔和一条有顶的石廊桥；Lv3 主塔顶改成带垛口的观星台（中央小鼓座托尖顶，台上黄铜天文仪慢转、望远镜），前左再起第三座小尖塔，以矮城墙相连。
   2077：同一套石头底子，观景廊左前一段罩上黄铜框玻璃窗廊，廊上（Lv3 在观星台）立黄铜天文仪，几盏猫球灯浮在门前和廊边。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const pt = (cx, cz, a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r];   /* 角度 a：0 朝 +z（正面），PI/2 朝 +x */
  const lerp = (a, b, t) => a + (b - a) * t;
  const MET = { mat: "metal" };
  const TRIM = mix3(C.stone, C.castle, .35), TRIM2 = mix3(C.castle2, C.stoneD, .5), DARK = mix3(C.castleD, [.08, .08, .1], .6);
  const FLOOR = mix3(C.stone, C.castle2, .5), MUL = mix3(C.iron, C.woodD, .4);
  const SL = C.slate, SL2 = C.slate2, SLD = dim3(C.slate, .8);
  const GLOW = mix3(C.glow, [.85, .55, .3], .25), BRASS = mix3(C.gold, C.wood, .22);

  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  const WARM = [.6, .53, .44], DAMP = mix3(C.castleD, C.ivy, .3);
  function blockCol(rnd, y) {                               /* 风化石块：深浅不一、略带暖色；墙根潮、发暗泛绿 */
    const t = rnd();
    let c = t < .12 ? mix3(C.castle2, C.castleD, .55) : t > .9 ? mix3(C.castle, C.stone, .4) : mix3(C.castle, C.castle2, .15 + rnd() * .85);
    c = mix3(c, WARM, .14);
    return y < .75 ? mix3(c, DAMP, (.75 - y) * .55) : c;
  }

  /* 塔身：一圈圈石砌，每块石头深浅不一，上下层错缝；r0→r1 收分 */
  function shaft(b, cx, cz, r0, r1, y0, y1, seg, rnd, ch) {
    const n = Math.max(1, Math.round((y1 - y0) / (ch || .25))), hh = (y1 - y0) / n;
    for (let i = 0; i < n; i++) {
      const ya = y0 + i * hh, yb = ya + hh, ra = lerp(r0, r1, i / n), rb = lerp(r0, r1, (i + 1) / n), a0 = (i % 2) * PI / seg;
      for (let k = 0; k < seg; k++) {
        const a = a0 + k / seg * TAU, c = a0 + (k + 1) / seg * TAU;
        b.quad(pt(cx, cz, a, ra, ya), pt(cx, cz, c, ra, ya), pt(cx, cz, c, rb, yb), pt(cx, cz, a, rb, yb), blockCol(rnd, ya));
      }
    }
  }
  /* 尖拱窗（当前坐标系里面朝 +z，墙面在 z0–zf 之间）：浅石窗框带尖顶、暖烛光窗心、铁窗棂、窗台；lit=false 是黑洞洞的箭窗 */
  function lancetAt(b, dx, y, z0, zf, w, h, o) {
    o = o || {};
    const fd = zf - z0, zc = (z0 + zf) / 2, fw = w + .09;
    b.box(dx, y - .045, zc, fw, h + .045, fd, TRIM, { nb: true });
    b.at(dx, y + h, zc, PI / 2); b.gable(0, 0, 0, fd, fw, fw * .62, TRIM, { end: TRIM }); b.pop();
    const lit = o.lit !== false, gc = lit ? GLOW : DARK, ge = lit ? (o.e || .6) : 0, z = zf + .004;
    b.panel(dx, y, z, w, h, gc, { e: ge });
    b.tri([dx - w / 2, y + h, z], [dx + w / 2, y + h, z], [dx, y + h + w * .55, z], gc, { e: ge });
    if (lit) {
      if (w > .11) b.panel(dx, y, z + .004, .016, h + w * .3, MUL);
      b.panel(dx, y + h * .58, z + .004, w, .016, MUL);
    }
    if (!o.nosill) b.box(dx, y - .075, zc + .015, fw + .04, .035, fd + .03, TRIM2);
  }
  function lancet(b, cx, cz, R, a, y, w, h, o) {
    o = o || {};
    const seg = o.seg || 16, dx = o.dx || 0;
    b.at(cx, 0, cz, a); lancetAt(b, dx, y, R * Math.cos(PI / seg) - .03 - dx * dx / (2 * R), R + .035, w, h, o); b.pop();
  }
  /* 尖拱木门：石门框、木门板、铁箍、门钉、门环；门前两级石阶 */
  function door(b, cx, cz, R, a, y, w, h, o) {
    o = o || {};
    const seg = o.seg || 16, z0 = R * Math.cos(PI / seg) - .04, zf = R + .07, fd = zf - z0, zc = (z0 + zf) / 2, fw = w + .13;
    b.at(cx, 0, cz, a);
    b.box(0, y, zc, fw, h, fd, TRIM, { nb: true });
    b.at(0, y + h, zc, PI / 2); b.gable(0, 0, 0, fd, fw, fw * .58, TRIM, { end: TRIM }); b.pop();
    const z = zf + .004, wd = mix3(C.woodD, C.wood, .25);
    b.panel(0, y, z, w, h, wd); b.tri([-w / 2, y + h, z], [w / 2, y + h, z], [0, y + h + w * .5, z], wd);
    for (const px of [-w / 4, w / 4]) b.panel(px, y, z + .003, .012, h + w * .22, dim3(C.woodD, .7));
    b.panel(0, y, z + .003, .014, h + w * .46, dim3(C.woodD, .6));
    for (const yy of [y + h * .2, y + h * .72]) {
      b.box(0, yy, z + .006, w * .94, .03, .014, C.iron, MET);
      for (const px of [-w * .36, -w * .12, w * .12, w * .36]) b.box(px, yy + .005, z + .016, .02, .02, .01, C.iron, MET);
    }
    b.box(w * .2, y + h * .48, z + .012, .035, .035, .016, C.gold, MET);
    if (o.steps) {
      const sd = o.steps;
      b.box(0, 0, zf + sd * .5, fw + .12, y * .5, sd, TRIM2, { top: FLOOR });
      b.box(0, y * .5, zf + sd * .25, fw + .06, y * .5, sd * .5, TRIM2, { top: FLOOR });
    }
    b.pop();
  }
  /* 一圈托石（两级外挑），上面压一道线脚 */
  function corbels(b, cx, cz, R, y, n, out, a0) {
    for (let k = 0; k < n; k++) {
      const a = (a0 || 0) + (k + .5) / n * TAU;
      b.at(cx, 0, cz, a);
      b.box(0, y - .2, R + out * .22 - .03, .08, .1, out * .44 + .06, TRIM2);
      b.box(0, y - .1, R + out * .45 - .03, .1, .1, out * .9 + .06, C.castle2, { nb: true, top: TRIM2 });
      b.pop();
    }
  }
  /* 城堞矮墙：一段段石墙，隔一段起一个垛口；skip(a) 留缺口 */
  function parapet(b, cx, cz, R, y, n, h, skip, noMerlon) {
    const ch = 2 * R * Math.sin(PI / n) + .014;
    for (let k = 0; k < n; k++) {
      const a = (k + .5) / n * TAU;
      if (skip && skip(a)) continue;
      b.at(cx, 0, cz, a);
      b.box(0, y, R - .04, ch, h, .075, k % 3 ? mix3(C.castle, WARM, .12) : C.castle2, { top: TRIM, nb: true });
      if (k % 2 === 0 && !(noMerlon && noMerlon(a))) b.box(0, y + h, R - .04, ch * .7, h * .75, .085, mix3(C.castle2, WARM, .1), { top: TRIM, nb: true });
      b.pop();
    }
  }
  /* 环形石板地（一块块拼，skip 留口子） */
  function deck(b, cx, cz, r0, r1, y, n, skip) {
    const ch = 2 * r1 * Math.sin(PI / n) + .01;
    for (let k = 0; k < n; k++) {
      const a = (k + .5) / n * TAU;
      if (skip && skip(a)) continue;
      b.at(cx, 0, cz, a); b.box(0, y - .09, (r0 + r1) / 2, ch, .09, r1 - r0, C.castle2, { top: k % 2 ? FLOOR : mix3(FLOOR, C.castle2, .3) }); b.pop();
    }
  }
  /* 石板瓦尖顶：外翻檐口、两色瓦带、小老虎窗、铁尖针＋小旗；返回尖顶高度 */
  function spire(b, cx, cz, r, y, h, seg, o) {
    o = o || {};
    const a0 = PI / seg;
    b.cyl(cx, y, cz, r + .08, .09, seg, SL2, { r2: r, a0, bot: TRIM2 });
    const fr = [0, .3, .34, .62, .66, 1], cols = [SL, SLD, SL, SLD, SL];
    for (let i = 0; i < 5; i++) {
      const ya = y + .09 + h * fr[i], yb = y + .09 + h * fr[i + 1];
      b.cyl(cx, ya, cz, r * (1 - fr[i]), yb - ya, seg, cols[i], { r2: r * (1 - fr[i + 1]), a0, nb: true, nt: true });
    }
    for (const da of o.dormers || []) {                      /* 小老虎窗 */
      const f = .17, yd = y + .09 + h * f, rd = r * (1 - f);
      b.at(cx, 0, cz, da);
      b.box(0, yd, rd - .08, .15, .17, .28, C.castle2, { nb: true });
      b.panel(0, yd + .03, rd + .062, .08, .1, GLOW, { e: .55 });
      b.tri([-.04, yd + .13, rd + .062], [.04, yd + .13, rd + .062], [0, yd + .16, rd + .062], GLOW, { e: .55 });
      b.at(0, yd + .17, rd - .08, PI / 2); b.gable(0, 0, 0, .32, .2, .13, SL2, { end: C.castle2 }); b.pop();
      b.pop();
    }
    const tip = y + .09 + h;
    b.beam([cx, tip - .12, cz], [cx, tip + .36, cz], .022, C.iron, MET);
    b.sphere(cx, tip + .06, cz, .04, 5, C.gold, MET);
    if (o.flag) {
      const fc = o.flag, yt = tip + .35;
      b.tri([cx, yt, cz], [cx, yt - .13, cz], [cx + .26, yt - .065, cz + .01], fc, { k: 1.25 });
      b.tri([cx, yt, cz], [cx + .26, yt - .065, cz + .01], [cx, yt - .13, cz], fc, { k: 1.25 });
    }
    return tip + .36;
  }
  /* 外挂石阶：一级级石踏步从塔身挑出，绕塔而上；铁扶手 */
  function spiralStair(b, cx, cz, rAt, y0, y1, a0, da, rnd) {
    const n = Math.max(3, Math.round((y1 - y0) / .145)), rise = (y1 - y0) / n, dep = .3;
    let prev = null;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i + .5) * da, yT = y0 + rise * (i + 1), r = rAt(yT) - .02, rm = r + dep / 2, tw = 2 * (r + dep) * Math.sin(Math.abs(da) / 2) + .02;
      const sh = yT < .5 ? yT : .17, c = mix3(C.castleD, C.castle2, .25 + rnd() * .4);
      b.at(cx, 0, cz, a);
      b.box(0, yT - sh, rm, tw, sh, dep, c, { top: mix3(TRIM2, FLOOR, rnd() * .6), nb: yT < .5 });
      if (i % 2 === 1 && yT > .7) b.box(0, yT - .36, r + .07, .09, .19, .16, C.castle2, { top: TRIM2 });
      b.pop();
      if (i % 2 === 0 || i === n - 1) {
        const p = pt(cx, cz, a, r + dep - .035, yT), q = [p[0], yT + .3, p[2]];
        b.beam(p, q, .022, C.iron, MET);
        if (prev) b.beam(prev, q, .022, C.iron, MET);
        prev = q;
      }
    }
    return { n, end: a0 + n * da, rise };
  }
  /* 常春藤：一簇簇小叶块贴墙往上爬 */
  function ivy(b, cx, cz, rAt, a, y0, y1, spread, n, rnd) {
    for (let i = 0; i < n; i++) {
      const t = Math.pow(rnd(), 1.5), y = y0 + t * (y1 - y0), aa = a + (rnd() - .5) * spread * (1 - t * .55), r = rAt(y), s = .06 + rnd() * .07;
      b.at(cx, 0, cz, aa); b.box(0, y, r + .005, s * 1.4, s, .05, mix3(C.ivy, C.leafD, rnd() * .7), { nb: true }); b.pop();
    }
  }
  /* 挂旗：铁横杆、竖条布、燕尾 */
  function banner(b, cx, cz, R, a, y, w, h, col) {
    b.at(cx, 0, cz, a);
    b.beam([-w / 2 - .04, y, R], [w / 2 + .04, y, R], .025, C.iron, MET);
    b.box(-w / 2 - .05, y - .015, R, .03, .03, .03, C.gold, MET); b.box(w / 2 + .05, y - .015, R, .03, .03, .03, C.gold, MET);
    b.panel(0, y - h, R + .005, w, h, col);
    b.tri([-w / 2, y - h, R + .005], [0, y - h + .02, R + .005], [-w / 2, y - h - .1, R + .005], col);
    b.tri([0, y - h + .02, R + .005], [w / 2, y - h, R + .005], [w / 2, y - h - .1, R + .005], col);
    b.panel(0, y - h * .45, R + .009, w * .45, w * .45, C.gold);   /* 纹章 */
    b.panel(0, y - .05, R + .008, w, .025, C.gold);
    b.pop();
  }
  /* 铁提灯：墙上铁臂挑出 */
  function wallLamp(b, cx, cz, R, a, y, brass) {
    const fc = brass ? C.gold : C.iron;
    b.at(cx, 0, cz, a);
    b.beam([0, y + .08, R - .02], [0, y + .08, R + .15], .025, C.iron, MET);
    b.box(0, y - .06, R + .15, .08, .015, .08, fc, MET);
    b.box(0, y - .045, R + .15, .065, .1, .065, C.lamp, { e: .7 });
    b.pyramid(0, y + .055, R + .15, .1, .1, .07, fc, MET);
    b.pop();
  }
  /* 黄铜天文仪：石座上，几道铜环绕轴慢转 */
  function armillary(b, x, y, z, R, speed) {
    b.cyl(x, y, z, R * .55, .06, 8, TRIM2, { top: TRIM });
    b.cyl(x, y + .06, z, R * .22, R * .9, 6, TRIM, { r2: R * .16 });
    b.cyl(x, y + .06 + R * .9, z, R * .32, .03, 8, BRASS, MET);
    const yc = y + .09 + R * 2.1;
    b.beam([x - R * 1.08, y + .09 + R * .9, z], [x - R * 1.08, yc, z], .02, BRASS, MET);
    b.beam([x - R * 1.08, y + .09 + R * .9, z], [x, y + .09 + R * .9, z], .02, BRASS, MET);
    b.spin(x, yc, z, "y", speed, sb => {
      sb.at(0, 0, 0, 0, 1, .4);
      sb.beam([0, -R * 1.3, 0], [0, R * 1.3, 0], .018, BRASS, MET);
      sb.torus(0, 0, 0, R, .014, 18, 3, BRASS, MET);
      sb.at(0, 0, 0, 0, 1, PI / 2); sb.torus(0, 0, 0, R, .014, 18, 3, BRASS, MET); sb.pop();
      sb.at(0, 0, 0, PI / 2, 1, PI / 2); sb.torus(0, 0, 0, R * .98, .012, 18, 3, BRASS, MET); sb.pop();
      sb.at(0, 0, 0, 0, 1, .41); sb.torus(0, 0, 0, R * .93, .022, 18, 3, mix3(BRASS, C.banner, .25), MET); sb.pop();
      sb.sphere(0, 0, 0, R * .2, 6, mix3(BRASS, C.banner2, .35), MET);
      sb.pop();
    });
  }
  /* 黄铜望远镜：三脚木架 */
  function telescope(b, x, y, z, ry) {
    b.at(x, y, z, ry);
    for (const a of [0, 2.1, 4.2]) b.beam([0, .34, 0], [Math.sin(a) * .15, 0, Math.cos(a) * .15], .022, C.woodD);
    b.at(0, .36, 0, 0, 1, -.85); b.cyl(0, -.16, 0, .035, .5, 8, BRASS, { r2: .05, mat: "metal" }); b.cyl(0, .34, 0, .055, .035, 8, C.iron, MET); b.cyl(0, -.22, 0, .022, .06, 6, C.iron, MET); b.pop();
    b.pop();
  }
  /* 玻璃窗廊（2077）：观景廊一段罩上黄铜框玻璃，坡顶靠在塔身上 */
  function glassGallery(b, cx, cz, rIn, rOut, y, aFrom, aTo) {
    const n = Math.max(2, Math.round((aTo - aFrom) / .26)), da = (aTo - aFrom) / n, yP = y + .17, yW = y + .66, yR = y + .86, rG = rOut - .05, G = mix3(C.glass, C.white, .2), GL = { mat: "glass" };
    for (let i = 0; i < n; i++) {
      const a = aFrom + i * da, c = a + da, m = a + da / 2, out = [Math.sin(m), 0, Math.cos(m)];
      qf(b, pt(cx, cz, a, rG, yP), pt(cx, cz, c, rG, yP), pt(cx, cz, c, rG, yW), pt(cx, cz, a, rG, yW), G, out, GL);
      qf(b, pt(cx, cz, a, rG, yW), pt(cx, cz, c, rG, yW), pt(cx, cz, c, rIn, yR), pt(cx, cz, a, rIn, yR), G, [out[0], 2, out[2]], GL);
      b.beam(pt(cx, cz, a, rG, yW), pt(cx, cz, c, rG, yW), .03, C.gold, MET);
      b.beam(pt(cx, cz, a, rG + .01, y + .42), pt(cx, cz, c, rG + .01, y + .42), .014, C.gold, MET);
    }
    for (let i = 0; i <= n; i++) {
      const a = aFrom + i * da;
      b.beam(pt(cx, cz, a, rG, yP - .02), pt(cx, cz, a, rG, yW + .01), .03, C.gold, MET);
      b.beam(pt(cx, cz, a, rG, yW), pt(cx, cz, a, rIn, yR), .024, C.gold, MET);
    }
    for (const a of [aFrom, aTo]) {                          /* 两头的玻璃端墙 */
      const s = a === aFrom ? -1 : 1, side = [Math.cos(a) * s, 0, -Math.sin(a) * s];
      qf(b, pt(cx, cz, a, rIn, y), pt(cx, cz, a, rG, y), pt(cx, cz, a, rG, yW), pt(cx, cz, a, rIn, yR), G, side, GL);
    }
    b.cyl(...pt(cx, cz, (aFrom + aTo) / 2, (rIn + rG) / 2, yR + .03), .035, .1, 6, C.gold, { r2: 0, mat: "metal" });
  }
  /* 扶壁：两级，顶面斜收（当前坐标系 z 朝外，墙面在 R） */
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) {
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || TRIM2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, cx, cz, R, a, h, rnd) {
    b.at(cx, 0, cz, a);
    wedge(b, .2, 0, R - .06, R + .34, h * .42, h * .3, mix3(C.castle2, C.castleD, .3));
    wedge(b, .15, 0, R - .06, R + .2, h, h * .86, mix3(C.castle, C.castle2, .5 + rnd() * .3));
    b.pop();
  }
  /* 门口：扫帚、坩埚 */
  function stoop(b, x, z, ry, rnd) {
    b.at(x, 0, z, ry);
    b.at(-.18, 0, 0, 0, 1, .18); b.beam([0, 0, 0], [0, .62, 0], .025, C.woodL); b.cyl(0, -.02, 0, .07, .2, 6, C.hay, { r2: .025 }); b.pop();
    b.cyl(.12, 0, .02, .1, .08, 6, C.iron, { r2: .14, mat: "metal" }); b.cyl(.12, .08, .02, .14, .07, 6, C.iron, { r2: .12, mat: "metal", top: mix3(C.leaf, C.crop, .4) });
    b.pop();
  }

  function build(b, o) {
    const lv = o.lv || 1, rnd = o.rnd, cy = !!o.cyber;
    const cx = lv === 1 ? 0 : -.22, cz = lv === 1 ? 0 : .1, SEG = 16;
    const yS = .28, yG = [0, 1.95, 2.0, 2.15][lv], yT = [0, 3.0, 3.75, 4.0][lv];
    const rA0 = .6, rA1 = .57, rB0 = .48, rB1 = .46, yA = yG - .09;
    const rAt = y => y < yA ? lerp(rA0, rA1, Math.max(0, (y - yS) / (yA - yS))) : lerp(rB0, rB1, (y - yA) / (yT - yA));

    /* 塔基：石座＋斜收的勒脚 */
    b.cyl(cx, 0, cz, .86, .08, SEG, C.castleD, { top: mix3(FLOOR, C.castle2, .4), a0: PI / SEG });
    b.cyl(cx, .08, cz, .74, .2, SEG, C.castle2, { r2: rA0 + .01, top: TRIM2, a0: 0 });
    /* 塔身两段 */
    shaft(b, cx, cz, rA0, rA1, yS, yA, SEG, rnd, .2);
    b.cyl(cx, yA - .05, cz, rA1 + .03, .05, SEG, TRIM2, { nb: true });
    shaft(b, cx, cz, rB0, rB1, yA, yT, SEG, rnd, .2);
    for (let i = 0; i < 10; i++) { const a = rnd() * TAU, y = yS + .15 + rnd() * (yT - yS - .4); b.at(cx, 0, cz, a); b.box(0, y, rAt(y) - .01, .12 + rnd() * .08, .08, .05, mix3(C.castle2, C.castleD, rnd() * .6), { nb: true }); b.pop(); }   /* 凸出的毛石 */
    /* 外挂石阶：从右前绕到左后，接上观景廊 */
    const st = spiralStair(b, cx, cz, rAt, .08, yG, .55, .33, rnd);
    const aEnd = st.end, inStair = a => { let d = ((a - (aEnd - .5)) % TAU + TAU) % TAU; return d < .62; };
    /* 观景廊：托石、石板地、城堞；石阶上来的地方开口 */
    const rG = rA1 + .32, NG = 20;
    const gGlass = cy ? [.28, 1.5] : null, inGlass = a => { if (!gGlass) return false; let d = ((a - gGlass[0]) % TAU + TAU) % TAU; return d < gGlass[1] - gGlass[0]; };
    for (let k = 0; k < 16; k++) { const a = (k + .5) / 16 * TAU; if (!inStair(a)) { b.at(cx, 0, cz, a); b.box(0, yA - .2, rA1 + .32 * .22 - .03, .08, .1, .32 * .44 + .06, TRIM2); b.box(0, yA - .1, rA1 + .32 * .45 - .03, .1, .1, .32 * .9 + .06, C.castle2, { nb: true, top: TRIM2 }); b.pop(); } }
    deck(b, cx, cz, rB0 - .06, rG, yG, NG, inStair);
    const bridgeA = lv >= 2 ? 2.05 : null, nearBridge = a => bridgeA != null && Math.abs(((a - bridgeA + PI) % TAU + TAU) % TAU - PI) < .2;
    parapet(b, cx, cz, rG, yG, NG, .16, a => inStair(a) || nearBridge(a), inGlass);
    /* 廊下两面挂旗 */
    banner(b, cx, cz, rG + .02, -.5, yG - .04, .2, .62, C.banner);
    banner(b, cx, cz, rG + .02, .5, yG - .04, .2, .62, C.banner2);
    /* 正门、门灯、门口杂物 */
    door(b, cx, cz, rA0, 0, yS, .36, .56, { steps: .3 });
    wallLamp(b, cx, cz, rA0, -.48, .95, cy); wallLamp(b, cx, cz, rA0, .48, .95, cy);
    if (!cy) { const sa = lv < 3 ? -.66 : -1.5, p = pt(cx, cz, sa, .98, 0); stoop(b, p[0], p[2], sa, rnd); }
    if (lv < 3) buttress(b, cx, cz, rA0, -1.12, 1.25, rnd);
    buttress(b, cx, cz, rA0, 3.75, .95, rnd);
    /* 下段的窗与箭窗（避开石阶） */
    lancet(b, cx, cz, rAt(1.2), PI / 2, 1.15, .14, .3);
    lancet(b, cx, cz, rAt(.6), PI, .55, .14, .28);
    lancet(b, cx, cz, rAt(1.0), -PI / 2, .95, .14, .3);
    lancet(b, cx, cz, rAt(1.25), 0, 1.22, .12, .2);
    lancet(b, cx, cz, rAt(1.4), 2.35, 1.45, .05, .2, { lit: false, nosill: true });
    lancet(b, cx, cz, rAt(.5), 3.9, .55, .05, .2, { lit: false, nosill: true });
    /* 上段：成对尖拱窗、廊门 */
    const yW = yG + .38, hW = Math.min(.42, (yT - yW) * .45);
    lancet(b, cx, cz, rAt(yW), 0, yW, .1, hW, { dx: -.08 }); lancet(b, cx, cz, rAt(yW), 0, yW, .1, hW, { dx: .08 });
    lancet(b, cx, cz, rAt(yW), -PI / 2, yW, .13, hW);
    if (bridgeA == null) lancet(b, cx, cz, rAt(yW), PI / 2 + .3, yW, .13, hW);
    lancet(b, cx, cz, rAt(yW), PI, yW, .13, hW);
    door(b, cx, cz, rAt(yG + .3), aEnd + .45, yG, .2, .32);
    if (lv >= 2) {                                          /* 更高的上段再开一层窗 */
      const y2 = yT - .72;
      for (const a of [-.9, .9, PI - .3, PI + .9]) lancet(b, cx, cz, rAt(y2), a, y2, .1, .3);
    }
    /* 常春藤 */
    ivy(b, cx, cz, rAt, -1.55, yS, 1.5, .8, 26, rnd);
    ivy(b, cx, cz, rAt, 2.9, yS, .9, .7, 14, rnd);

    /* 塔顶 */
    let top;
    if (lv < 3) {
      corbels(b, cx, cz, rB1, yT, 16, .1, 0);
      b.cyl(cx, yT - .02, cz, rB1 + .1, .08, SEG, TRIM, { a0: PI / SEG });
      top = spire(b, cx, cz, rB1 + .03, yT + .06, lv === 1 ? 1.7 : 1.85, SEG, { dormers: [.35, .35 + TAU / 3, .35 - TAU / 3], flag: C.banner });
    } else {
      /* 观星台：大托石挑出、石板台、城堞；中央鼓座托尖顶；天文仪、望远镜 */
      const rO = .8;
      corbels(b, cx, cz, rB1, yT, 18, .34, 0);
      deck(b, cx, cz, 0, rO, yT + .1, 18);
      parapet(b, cx, cz, rO, yT + .1, 20, .17);
      const rD = .27;
      shaft(b, cx, cz, rD, rD - .01, yT + .1, yT + .72, 10, rnd, .2);
      for (const a of [PI / 2, -PI / 2, PI]) lancet(b, cx, cz, rD, a, yT + .26, .08, .2, { seg: 10 });
      door(b, cx, cz, rD, .0, yT + .1, .16, .3, { seg: 10 });
      b.cyl(cx, yT + .7, cz, rD + .06, .06, 10, TRIM, { a0: PI / 10 });
      top = spire(b, cx, cz, rD + .04, yT + .76, 1.4, 10, { flag: C.banner });
      armillary(b, ...pt(cx, cz, .78, .52, yT + .1), .19, .18);
      telescope(b, ...pt(cx, cz, -.95, .5, yT + .1), -.95);
    }

    /* Lv2+：副塔＋有顶石廊桥 */
    if (lv >= 2) {
      const dS = 1.38, [sx, , sz] = pt(cx, cz, bridgeA, dS, 0), sr0 = .33, sr1 = .3, syT = lv === 2 ? 3.2 : 3.35, srAt = y => lerp(sr0, sr1, y / syT);
      b.cyl(sx, 0, sz, .44, .08, 10, C.castleD, { top: TRIM2, a0: PI / 10 });
      b.cyl(sx, .08, sz, .4, .12, 10, C.castle2, { r2: sr0 + .01, top: TRIM2 });
      shaft(b, sx, sz, sr0, sr1, .2, syT, 10, rnd, .25);
      door(b, sx, sz, sr0, 0, .2, .2, .36, { seg: 10, steps: .18 });
      lancet(b, sx, sz, srAt(1.1), .1, 1.1, .1, .26, { seg: 10 });
      lancet(b, sx, sz, srAt(1.6), PI / 2 + .2, 1.6, .1, .26, { seg: 10 });
      lancet(b, sx, sz, srAt(.8), PI, .8, .04, .18, { seg: 10, lit: false, nosill: true });
      lancet(b, sx, sz, srAt(2.75), .3, 2.75, .1, .22, { seg: 10 });
      corbels(b, sx, sz, sr1, syT, 12, .09, 0);
      b.cyl(sx, syT - .02, sz, sr1 + .09, .07, 10, TRIM, { a0: PI / 10 });
      spire(b, sx, sz, sr1 + .05, syT + .05, 1.3, 10, { flag: C.banner2, dormers: [.4] });
      ivy(b, sx, sz, srAt, PI * .75, .2, 1.3, 1.0, 16, rnd);
      /* 廊桥：拱底、石板地、两侧墙开小尖窗、石板瓦人字顶 */
      const yb = yG + .62, z0 = rAt(yb) - .06, z1 = dS - srAt(yb) + .06, L = z1 - z0, zm = (z0 + z1) / 2, hw = .2;
      b.at(cx, 0, cz, bridgeA);
      const nA = 8;
      for (let i = 0; i < nA; i++) {
        const t0 = i / nA, t1 = (i + 1) / nA, za = z0 + L * t0, zb = z0 + L * t1, yu = t => yb - .1 - .4 * Math.pow(Math.abs(2 * t - 1), 1.7);
        const ya = yu(t0), yc = yu(t1), cc = i % 2 ? C.castle2 : C.castle;
        for (const s of [-1, 1]) qf(b, [s * hw, ya, za], [s * hw, yc, zb], [s * hw, yb, zb], [s * hw, yb, za], cc, [s, 0, 0]);
        qf(b, [-hw, ya, za], [hw, ya, za], [hw, yc, zb], [-hw, yc, zb], TRIM2, [0, -1, 0]);
      }
      b.box(0, yb - .1, zm, hw * 2 + .06, .1, L, TRIM2, { top: FLOOR });
      for (const s of [-1, 1]) {
        b.box(s * (hw - .03), yb, zm, .07, .44, L, C.castle, { nb: true });
        b.at(s * (hw + .005), 0, zm, s * PI / 2);
        for (const dz of [-L * .22, L * .22]) lancetAt(b, dz, yb + .1, -.02, .02, .08, .17, { nosill: true });
        b.pop();
      }
      b.box(0, yb + .44, zm, hw * 2 + .06, .04, L, TRIM2);
      b.at(0, yb + .48, zm, PI / 2); b.gable(0, 0, 0, L + .02, hw * 2 + .2, .26, SL, { end: C.castle2 }); b.pop();
      b.beam([0, yb + .74, z0], [0, yb + .74, z1], .035, SLD);
      b.pop();
    }

    /* Lv3：第三座小尖塔（左前），矮城墙连到主塔 */
    if (lv >= 3) {
      const aT = -.95, dT = 1.05, [tx, , tz] = pt(cx, cz, aT, dT, 0), tr = .23, tyT = 1.95;
      b.cyl(tx, 0, tz, .32, .1, 8, C.castleD, { top: TRIM2, a0: PI / 8 });
      shaft(b, tx, tz, tr, tr - .02, .1, tyT, 8, rnd, .25);
      lancet(b, tx, tz, tr, aT + PI * .1, 1.15, .08, .22, { seg: 8 });
      lancet(b, tx, tz, tr, -PI / 2, .7, .04, .16, { seg: 8, lit: false, nosill: true });
      corbels(b, tx, tz, tr - .02, tyT, 8, .08, 0);
      b.cyl(tx, tyT - .02, tz, tr + .06, .06, 8, TRIM, { a0: PI / 8 });
      spire(b, tx, tz, tr + .03, tyT + .04, 1.05, 8, { flag: C.banner2 });
      /* 矮城墙 */
      const w0 = rA0 - .05, w1 = dT - tr + .03;
      b.at(cx, 0, cz, aT);
      b.box(0, 0, (w0 + w1) / 2, .2, .62, w1 - w0, C.castle2, { top: TRIM });
      for (let k = 0; k < 2; k++) b.box(0, .62, w0 + (w1 - w0) * (.3 + k * .42), .22, .13, .12, C.castle, { top: TRIM });
      b.pop();
    }

    /* 2077：玻璃窗廊、黄铜天文仪、猫球灯 */
    if (cy) {
      glassGallery(b, cx, cz, rB0 - .02, rG, yG, gGlass[0], gGlass[1]);
      if (lv < 3) armillary(b, ...pt(cx, cz, -.62, rG - .2, yG), .14, .2);
      b.emit(...pt(cx, cz, -.42, rA0 + .55, .95), "cat", 1, 1);                 /* 门口一盏；Lv2 起廊桥下再一盏，别处不飘 */
      if (lv >= 2) b.emit(...pt(cx, cz, bridgeA + .5, 1.05, .95), "cat", 1, 1);
    }
  }
  build.h = o => [0, 5.21, 6.11, 6.61][o.lv || 1] + .2;   /* 尖针小旗顶＋0.2 */
  Isle3D.FAC["魔女塔"] = build;
})();
