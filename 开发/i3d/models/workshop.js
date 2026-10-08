/* 工坊：霍格沃茨式的石墙木梁作坊。
   1994：风化灰石砌的底层（错缝石块、转角隅石、尖拱窗、扶壁、常春藤），上层是挑出来的半木结构（深色橡木框、斜撑、抹灰墙、
         木框烛光窗和百叶），正面山墙再挑一次，封檐板、尖针；深蓝灰石板瓦陡顶（一道道瓦层、屋脊铁花、老虎窗）；
         左侧一根熏黑的大石烟囱（肩部收分、腰线、两只陶烟囱帽）冒烟；正面尖拱大门一扇敞着、门楣钉马蹄铁；
         门前树桩铁砧、淬火桶、小水桶，墙上工具架（锤、火钳、锯、锉），门右一排挂着的扫帚，铁提灯、铁艺招牌、石板路。
         Lv2 右侧加上射式水车（会转；石砌水坑、木人字架托轴、木水槽从高脚蓄水桶引水、落水和水雾），
             左侧加一座靠墙披棚（木瓦坡顶、劈柴垛、炭袋、磨刀石、木箱）。
         Lv3 左后起一座圆形锻炉塔：石砌塔身、炉口透炭火冒火星、门口一架风箱，背后贴一根熏黑的方石烟道（防火星铁帽），
             托石挑檐上是石板瓦尖顶、老虎窗、小旗；塔身装一架木吊臂（立柱、斜撑、绞盘、滑轮）吊着一箱铁料。
   2077：同一套石头底子，只加一点现代魔法：右墙和烟囱上走黄铜管道（压力表、阀轮），右坡开一面黄铜框玻璃天窗，
         屋顶一根黄铜排汽管冒白汽，提灯、招牌、屋脊铁花、塔顶铁帽换黄铜；门口两只木马架上架着一把改装中的竞速扫帚
         （亮漆细柄、黄铜箍、踏镫、尾部稳定环），旁边开着的黄铜工具箱；门前（Lv2 水车边、Lv3 吊臂边）各浮一盏猫球灯。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.1, .1, .12], .35);
  const WIN = mix3(C.glow, [.46, .33, .21], .34), FIRE = mix3(C.lamp, [.85, .34, .14], .45);
  const BRASS = mix3(C.gold, [.46, .34, .2], .32);
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4);
  const DAUB = mix3(C.plaster, [.76, .71, .62], .4), MULL = mix3(IRON, OAK, .3);
  const POT = mix3(C.roofR, STD, .45), HAY = mix3(C.hay, C.woodL, .35);
  let R = Math.random;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  function sc(y) {                                          /* 一块石头的颜色：深浅不一、偏暖的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .62 + r * .38);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .3); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .3);
    if (r > .9) c = mix3(c, STD, .45); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.32, (1.0 - y) * .32));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  function soot(y) { const c = sc(y); return mix3(c, [.22, .21, .22], Math.max(0, Math.min(.5, (y - 1.6) * .3))); }   /* 烟囱：越往上越熏黑 */
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function tube(b, a, c, r, col, o, seg) {                  /* 两点之间一根圆管 */
    const d = sub(c, a), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, a[0], a[1], a[2], 1]));
    b.cyl(0, 0, 0, r, L, seg || 6, col, Object.assign({ nb: true, nt: true }, o || {})); b.pop();
  }

  /* ---------- 平面多边形、尖拱 ---------- */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function fanB(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i + 1][0], pts[i + 1][1], z], [pts[i][0], pts[i][1], z], col, o); }
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
  function archRing(b, w, h, p, fr, z0, z1, o) {            /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、一圈深浅相间的楔石、券底 */
    o = o || {};
    const n = o.n || 4, ai = archPts(w, p, n), ao = archPts(w + fr * 2, p, n), rev = mix3(DRESS2, STD, .35);
    for (const s of [-1, 1]) {
      const xi = s * w / 2, xo = s * (w / 2 + fr), nq = 3;
      for (let j = 0; j < nq; j++) {                          /* 门框：一块块料石，宽窄相间 */
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
    const kt = archY(w + fr * 2, p, 0);                      /* 拱心石 */
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
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块（不画背面和顶面）：前、左、右、底 */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function wedge(b, x, y, z, w, h, d, col) {                /* 扶壁的斜顶：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col);
  }
  function buttress(b, x, z, h) {                           /* 两级扶壁（当前坐标系面朝 +z，墙面在 z） */
    b.box(x, 0, z + .1, .17, h * .55, .2, sc(.3), { nb: true, top: DRESS2 });
    wedge(b, x, h * .55, z + .1, .17, .1, .2, DRESS2);
    b.box(x, h * .55, z + .055, .14, h * .45, .11, sc(.8), { nb: true });
    wedge(b, x, h, z + .055, .14, .1, .11, DRESS2);
  }

  /* ---------- 窗、门 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.02, .025, o.frame || DRESS);
    fan(b, outline(w, h, 0, p), .029, o.glass || WIN, { e });
    b.panel(0, 0, .032, .016, h + archY(w, p, 0) * .8, MULL);
    b.panel(0, h * .55, .033, w, .014, MULL);
    b.box(0, -fr - .03, .01, w + fr * 2 + .05, .03, .07, DRESS2, { nb: true });
    b.pop();
  }
  function lantern(b, x, y, z, cy) {                        /* 铁提灯（六角，暖光） */
    const fr = cy ? BRASS : IRON;
    b.cyl(x, y, z, .06, .025, 6, fr, M);
    b.cyl(x, y + .025, z, .044, .13, 6, C.lamp, { r2: .054, e: .7 });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .05, y + .025, z + Math.sin(a) * .05], [x + Math.cos(a) * .059, y + .155, z + Math.sin(a) * .059], .011, fr, M); }
    b.cyl(x, y + .155, z, .072, .02, 6, fr, M);
    b.cone(x, y + .175, z, .068, .09, 6, fr, M);
    b.sphere(x, y + .28, z, .018, 4, fr, M);
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON;
    b.box(x, y + .02, z + .005, .05, .12, .02, fr, M);
    b.beam([x, y + .1, z], [x, y + .1, z + .2], .022, fr, M);
    b.beam([x, y + .02, z], [x, y + .1, z + .12], .014, fr, M);
    b.beam([x, y + .1, z + .19], [x, y + .02, z + .19], .01, fr, M);
    lantern(b, x, y - .27, z + .19, cy);
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
    const L = .38, Hh = .17, top = y + h - .04, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .012 + L * t0, x1 = x + .012 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .5) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
  }

  /* ---------- 半木结构 ---------- */
  function strip(b, x1, y1, x2, y2, w, z, d, col) {         /* 贴在墙面（z，面朝 +z）上的一根木条：正面＋两侧 */
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2, zf = z + d;
    const A = [x1 + nx, y1 + ny], B = [x2 + nx, y2 + ny], Cc = [x2 - nx, y2 - ny], D = [x1 - nx, y1 - ny];
    qf(b, [A[0], A[1], zf], [B[0], B[1], zf], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [0, 0, 1]);
    if (d < .019) return;                                    /* 细斜撑只画正面 */
    qf(b, [A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], zf], [A[0], A[1], zf], col, [nx, ny, 0]);
    qf(b, [D[0], D[1], z], [Cc[0], Cc[1], z], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [-nx, -ny, 0]);
  }
  function tWin(b, xc, yb, w, h, z, o) {                    /* 木框窗：烛光玻璃、竖棂、横棂、窗台板；o.sh 两扇敞开的木百叶 */
    o = o || {};
    b.panel(xc, yb, z + .003, w, h, WIN, { e: o.e || .55 });
    const t = .04, d = .032;
    strip(b, xc - w / 2 - t / 2, yb, xc - w / 2 - t / 2, yb + h, t, z, d, OAK);
    strip(b, xc + w / 2 + t / 2, yb, xc + w / 2 + t / 2, yb + h, t, z, d, OAK);
    strip(b, xc - w / 2 - t, yb + h + t / 2, xc + w / 2 + t, yb + h + t / 2, t, z, d + .006, OAK);
    b.box(xc, yb - .03, z + .02, w + .11, .03, .07, OAK2);
    b.box(xc, yb, z + .006, .016, h, .008, MULL);
    if (w > .2) for (const f of [-.25, .25]) b.box(xc + w * f, yb, z + .006, .01, h, .006, MULL);
    b.box(xc, yb + h * .62, z + .006, w, .014, .008, MULL);
    if (o.sh) for (const s of [-1, 1]) {                     /* 敞开的木百叶 */
      b.at(xc + s * (w / 2 + t), yb, z + .03, s * -1.1);
      b.box(s * w * .27, 0, 0, w * .52, h, .02, o.sh, { nb: true });
      for (const yy of [.2, .75]) b.box(s * w * .27, h * yy, .012, w * .52, .02, .01, mix3(o.sh, [0, 0, 0], .3));
      b.pop();
    }
  }
  /* 半木墙（面朝 +z，墙面在 z）：抹灰底、立柱、地梁、顶梁、腰枋、斜撑；bays 每格一个字母：w 窗、x 交叉撑、l/r 单斜撑、v 人字撑、s 密立柱、p 只有腰枋、- 什么都不画（被挡住） */
  function htWall(b, x0, x1, y0, y1, z, bays, o) {
    o = o || {};
    const n = bays.length, bw = (x1 - x0) / n, h = y1 - y0, ym = y0 + h * .46, T = .05, d = .022;
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
      if (k === "w" || k === "W") { const ww = Math.min(bw - .12, o.ww || .3), wh = Math.min(h - .26, o.wh || .3); tWin(b, xm, y0 + (h - wh) * .52, ww, wh, z, { sh: k === "W" ? o.shutter : null }); continue; }
      strip(b, xa, ym, xb, ym, T * .85, z, d * .9, OAK);
      if (k === "x") { strip(b, xa, yl, xb, ym, T * .8, z, d * .8, OAK); strip(b, xb, yl, xa, ym, T * .8, z, d * .8, OAK); strip(b, xa, ym, xb, yh, T * .8, z, d * .8, OAK); strip(b, xb, ym, xa, yh, T * .8, z, d * .8, OAK); }
      else if (k === "l") { strip(b, xa, yl, xb, ym, T * .85, z, d * .8, OAK); strip(b, xa, yh, xb, ym, T * .85, z, d * .8, OAK); }
      else if (k === "r") { strip(b, xb, yl, xa, ym, T * .85, z, d * .8, OAK); strip(b, xb, yh, xa, ym, T * .85, z, d * .8, OAK); }
      else if (k === "v") { strip(b, xa, ym, xm, yh, T * .8, z, d * .8, OAK); strip(b, xb, ym, xm, yh, T * .8, z, d * .8, OAK); strip(b, xm, yl, xm, ym, T * .7, z, d * .8, OAK); }
      else if (k === "s") { for (const f of [1 / 3, 2 / 3]) strip(b, xa + (xb - xa) * f, yl, xa + (xb - xa) * f, yh, T * .75, z, d * .8, OAK); }
    }
  }
  function htGable(b, hw, y0, H, z, o) {                    /* 半木山墙（三角，面朝 +z）：中柱、领梁、斜撑、一扇双开小窗、顶上一扇小尖窗 */
    o = o || {};
    tf(b, [-hw, y0, z], [hw, y0, z], [0, y0 + H, z], mix3(DAUB, [.84, .8, .72], .25), [0, 0, 1]);
    const T = .05, d = .022, yc = y0 + H * .5, wc = hw * (1 - .5);
    strip(b, -wc - .02, yc, wc + .02, yc, T * 1.1, z, d, OAK);                     /* 领梁 */
    strip(b, 0, yc, 0, y0 + H - .06, T, z, d, OAK);                              /* 中柱（上段） */
    for (const s of [-1, 1]) {
      strip(b, s * hw * .62, y0 + T, s * hw * .62, y0 + H * .38 - .02, T, z, d, OAK);
      strip(b, s * hw * .78, y0 + T, s * wc * .35, yc - .02, T * .85, z, d * .8, OAK);
      strip(b, s * .02, yc + .02, s * wc * .55, yc + (H - H * .5) * .45, T * .8, z, d * .8, OAK);
    }
    strip(b, -hw, y0 + T * .6, hw, y0 + T * .6, T * 1.3, z, d + .006, OAK);
    tWin(b, 0, y0 + .1, o.ww || .3, Math.min(.26, H * .5 - .18), z, {});
    /* 领梁上一扇小尖窗 */
    b.panel(0, yc + .09, z + .003, .07, .11, WIN, { e: .5 });
    b.tri([-.035, yc + .2, z + .003], [.035, yc + .2, z + .003], [0, yc + .25, z + .003], WIN, { e: .5 });
    strip(b, -.05, yc + .07, .05, yc + .07, .03, z, d, OAK);
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，下缘翘起一点 */
    o = o || {};
    const nb = o.nb || 7, cw = o.cw || .3, dx = B[0] - A[0], dy = B[1] - A[1];
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .022, cols = o.cols || [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .06; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
      for (let k = 0; k < edges.length - 1; k++) {
        const base = i % 2 ? cols[0] : cols[1], r = R(), c = r < .2 ? mix3(base, cols[2], .55) : r > .85 ? mix3(base, [.5, .52, .56], .18) : mix3(base, cols[2], r * .25);
        qf(b, [xa2, ya2, edges[k]], [xa2, ya2, edges[k + 1]], [xb, yb, edges[k + 1]], [xb, yb, edges[k]], c, [N[0], N[1], 0], o.mo);
      }
      qf(b, [xa, ya, z0], [xa, ya, z1], [xa2, ya2, z1], [xa2, ya2, z0], cols[2], dn, o.mo);
    }
    qf(b, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], o.under || mix3(OAK, [0, 0, 0], .2), [-N[0], -N[1], 0]);
    if (!o.nofascia) b.beam([A[0] + N[0] * .005, A[1] - .035, z0], [A[0] + N[0] * .005, A[1] - .035, z1], .04, o.fascia || OAK);
  }
  function barge(b, A, B, z, t) {                           /* 封檐板：沿坡一条厚木板，下缘一排小齿 */
    b.beam([A[0], A[1] - .02, z], [B[0], B[1] - .02, z], t || .05, OAK2, { tz: .04 });
  }

  /* ---------- 门前杂物 ---------- */
  function anvil(b, x, z, ry, cy) {                         /* 树桩上的铁砧，上面搁一把锤 */
    b.at(x, 0, z, ry);
    b.cyl(0, 0, 0, .13, .26, 7, mix3(C.woodD, C.wood, .2), { r2: .115, top: mix3(C.woodL, C.plank, .5) });
    const A = mix3(IRON, [.2, .2, .23], .3), y = .26;
    b.box(0, y, 0, .2, .04, .13, A, M);
    b.box(0, y + .04, 0, .1, .07, .08, A, M);
    b.box(-.02, y + .11, 0, .26, .065, .11, A, Object.assign({ top: mix3(IRON, C.metal, .5) }, M));
    b.at(.11, y + .145, 0, 0, 1, 0, -PI / 2); b.cone(0, 0, 0, .05, .16, 6, A, M); b.pop();
    b.box(-.17, y + .12, 0, .06, .045, .08, A, M);
    b.at(-.02, y + .175, .0, .6); b.beam([-.12, 0, 0], [.08, 0, 0], .02, C.woodL); b.box(.1, -.01, 0, .035, .05, .07, IRON, M); b.pop();
    b.pop();
  }
  function barrel(b, x, z, r, h, water, ry) {               /* 木桶：桶板、三道铁箍、桶里的水 */
    b.at(x, 0, z, ry || 0);
    b.cyl(0, 0, 0, r * .88, h * .5, 8, OAK2, { r2: r, nt: true });
    b.cyl(0, h * .5, 0, r, h * .5, 8, mix3(OAK2, C.wood, .2), { r2: r * .88, nt: true, nb: true });
    for (const t of [.12, .5, .86]) { const rr = t === .5 ? r : r * (.88 + .12 * (t < .5 ? t / .5 : (1 - t) / .5)); b.cyl(0, h * t - .012, 0, rr + .008, .028, 8, IRON, { nt: true, nb: true, mat: "metal" }); }
    if (water) b.disc(0, h * .86, 0, r * .86, 8, C.water, { mat: "water", k: 3 });
    else b.disc(0, h * .98, 0, r * .86, 8, mix3(OAK2, C.plank, .4));
    b.pop();
  }
  function bucket(b, x, z, ry) {                            /* 小水桶：木板、铁箍、提梁 */
    b.at(x, 0, z, ry);
    b.cyl(0, 0, 0, .065, .13, 7, OAK2, { r2: .08, nt: true });
    b.cyl(0, .1, 0, .081, .02, 7, IRON, { nt: true, nb: true, mat: "metal" });
    b.disc(0, .11, 0, .072, 7, C.water, { mat: "water", k: 3 });
    b.beam([-.08, .13, 0], [-.05, .22, 0], .012, IRON, M); b.beam([-.05, .22, 0], [.05, .22, 0], .012, IRON, M); b.beam([.05, .22, 0], [.08, .13, 0], .012, IRON, M);
    b.pop();
  }
  function broom(b, x, yTop, z, len) {                      /* 挂着的扫帚：y 是挂钩，帚苗朝下 */
    b.beam([x, yTop, z], [x, yTop - len, z], .024, C.woodL);
    b.cyl(x, yTop - len - .24, z, .075, .26, 6, HAY, { r2: .028 });
    b.cyl(x, yTop - len - .05, z, .034, .035, 6, mix3(C.cloth, C.woodD, .3), { nb: true });
    b.cyl(x, yTop - len - .16, z, .052, .02, 6, mix3(C.cloth, C.woodD, .3), { nt: true, nb: true });
  }
  function toolRack(b, x, z) {                              /* 工具架（贴墙，面朝 +z）：背板、挂钩、锤、火钳、锯、锉，上面一层搁板 */
    b.at(x, 0, z);
    b.box(0, .3, .012, .4, .38, .02, BOARD, { nb: true });
    for (const s of [-1, 1]) b.box(s * .19, .02, .03, .035, .7, .03, OAK2);
    b.box(0, .68, .06, .44, .025, .12, OAK2);
    for (const s of [-1, 1]) b.beam([s * .17, .58, .03], [s * .17, .68, .11], .02, OAK2);
    b.box(-.12, .705, .06, .07, .09, .07, mix3(C.cloth2, C.stone, .4));                    /* 搁板上：陶罐、小木盒 */
    b.cyl(.04, .705, .06, .04, .1, 6, mix3(C.roofR, C.woodD, .3), { r2: .03 });
    b.box(.14, .705, .06, .1, .05, .07, BOARD);
    /* 锤 */
    b.beam([-.14, .6, .05], [-.14, .36, .05], .022, C.woodL); b.box(-.14, .56, .05, .1, .035, .035, IRON, M);
    /* 火钳 */
    b.beam([-.03, .6, .05], [-.05, .3, .05], .012, IRON, M); b.beam([-.03, .6, .05], [-.005, .3, .05], .012, IRON, M);
    /* 锯 */
    b.panel(.08, .47, .045, .03, .12, C.woodL);
    b.at(.08, .47, .05); b.quad([-.012, 0, 0], [.012, 0, 0], [.035, -.2, 0], [-.02, -.2, 0], C.metal, M); b.pop();
    /* 锉、小锤 */
    b.beam([.16, .6, .05], [.16, .4, .05], .016, mix3(IRON, C.metal, .5), M);
    b.box(0, .12, .05, .36, .025, .08, OAK2);
    b.cyl(-.1, .145, .05, .04, .07, 6, IRON, M); b.box(.09, .145, .05, .12, .03, .05, C.metal, Object.assign({ nb: true }, M));
    b.pop();
  }
  function horseshoe(b, x, y, z) {                          /* 门楣上钉一只马蹄铁（开口朝上） */
    const r = .06, n = 5;
    for (let i = 0; i < n; i++) {
      const a0 = -.25 + i / n * (PI + .5), a1 = -.25 + (i + 1) / n * (PI + .5);
      b.beam([x + Math.cos(a0 + PI) * r, y + Math.sin(a0 + PI) * r, z], [x + Math.cos(a1 + PI) * r, y + Math.sin(a1 + PI) * r, z], .022, mix3(IRON, C.metal, .3), Object.assign({ tz: .012 }, M));
    }
  }
  function sign(b, x, y, z, cy) {                           /* 铁艺挑出的招牌：铁臂、卷花、挂着一块木牌，牌上一只铁砧、一把锤 */
    const fr = cy ? BRASS : IRON;
    b.box(x, y - .06, z + .005, .06, .18, .02, fr, M);
    b.beam([x, y + .02, z], [x, y + .02, z + .46], .022, fr, M);
    b.beam([x, y - .12, z], [x, y + .02, z + .22], .016, fr, M);
    b.at(x, y + .02, z + .14, 0, 1, 0, PI / 2); b.torus(0, 0, -.045, .045, .008, 8, 3, fr, M); b.pop();
    for (const dz of [.2, .4]) b.beam([x, y + .01, z + dz], [x, y - .06, z + dz], .01, fr, M);
    b.box(x, y - .3, z + .3, .03, .24, .3, BOARD);
    b.box(x, y - .3, z + .3, .036, .02, .32, OAK, {});
    b.box(x, y - .08, z + .3, .036, .02, .32, OAK, {});
    for (const s of [-1, 1]) {                               /* 牌面两边：金色铁砧剪影 */
      b.at(x + s * .0165, 0, z + .3, s * PI / 2);
      b.panel(0, y - .25, 0, .1, .03, C.gold, M); b.panel(0, y - .22, 0, .05, .035, C.gold, M);
      b.panel(-s * .01, y - .19, 0, .16, .035, C.gold, M); b.panel(s * .075, y - .175, 0, .03, .02, C.gold, M);
      b.panel(-s * .02, y - .14, 0, .02, .035, C.gold, M); b.panel(-s * .03, y - .12, 0, .07, .022, C.gold, M);
      b.pop();
    }
  }
  function flagstones(b, x0, x1, z0, z1, n) {               /* 门前铺的石板 */
    for (let i = 0; i < n; i++) {
      const x = x0 + R() * (x1 - x0), z = z0 + R() * (z1 - z0), w = .14 + R() * .12, d = .12 + R() * .1;
      const y = .012 + R() * .01, a = R() * .5, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => [x + u * c + v * sn, y, z - u * sn + v * c];
      b.quad(P(-w / 2, d / 2), P(w / 2, d / 2), P(w / 2, -d / 2), P(-w / 2, -d / 2), mix3(C.stone, ST2, R() * .7));
    }
  }
  function crate(b, x, y, z, s, ry, iron) {                 /* 木箱：板条、对角撑；iron 是铁皮包角 */
    b.at(x, y, z, ry || 0, s);
    b.box(0, 0, 0, .3, .26, .3, BOARD);
    for (const f of [0, 1, 2, 3]) {
      b.at(0, 0, 0, f * PI / 2);
      const sc2 = iron ? IRON : OAK2, so = iron ? M : undefined;
      for (const sx of [-1, 1]) b.panel(sx * .135, 0, .152, .03, .26, sc2, so);
      b.panel(0, .115, .153, .27, .03, sc2, so);
      b.pop();
    }
    b.pop();
  }

  /* ---------- Lv2：水车、水槽、蓄水桶、披棚 ---------- */
  function waterWheel(sb, Rw, wd) {                         /* 上射式水车：轴沿 x，在 yz 平面里转 */
    for (const dx of [-wd / 2, wd / 2]) {
      sb.at(dx, 0, 0, 0, 1, 0, PI / 2); sb.torus(0, 0, 0, Rw, .032, 12, 3, OAK2); sb.pop();
      for (let q = 0; q < 3; q++) { const a = q / 3 * PI + (dx > 0 ? PI / 6 : 0), c = Math.cos(a) * Rw, s = Math.sin(a) * Rw; sb.beam([dx, -c, -s], [dx, c, s], .035, OAK); }
    }
    for (let q = 0; q < 12; q++) {
      const a = q / 12 * TAU;
      sb.at(0, Math.cos(a) * Rw, Math.sin(a) * Rw, 0, 1, a);
      sb.box(0, -.03, 0, wd + .03, .15, .024, q % 2 ? BOARD : mix3(BOARD, C.woodL, .3));
      sb.pop();
    }
    sb.at(0, 0, 0, 0, 1, 0, PI / 2); sb.cyl(0, -wd / 2 - .3, 0, .045, wd + .48, 6, IRON, M); sb.cyl(0, -wd / 2 - .02, 0, .09, wd + .04, 7, OAK); sb.pop();
  }
  function wheelWorks(b, wx, wy, wz, Rw, wd) {              /* 水车坑、轴座、水槽、蓄水桶、落水 */
    const xi = .76, xo = wx + wd / 2 + .12, zf = wz + Rw + .2, zb = wz - Rw - .2;
    /* 石砌水坑：三面矮石墙、水面 */
    stoneBox(b, xi, xo + .1, 0, .16, zf, zf + .1, { nb: true, q: false, rh: .16, top: DRESS2 });
    stoneBox(b, xi, xo + .1, 0, .16, zb - .1, zb, { nf: true, q: false, rh: .16, top: DRESS2 });
    stoneBox(b, xo, xo + .1, 0, .16, zb, zf, { nl: true, nf: true, nb: true, q: false, rh: .16, top: DRESS2 });
    b.quad([xi, .05, zf], [xo, .05, zf], [xo, .05, zb], [xi, .05, zb], mix3(C.water, [.2, .3, .35], .25), { mat: "water", k: 3 });
    /* 外侧木人字架托轴；墙上一块轴座 */
    for (const s of [-1, 1]) b.beam([xo + .05, .14, wz + s * .3], [xo + .05, wy - .02, wz + s * .04], .055, OAK);
    b.beam([xo + .05, .3, wz - .22], [xo + .05, .3, wz + .22], .04, OAK);
    b.box(xo + .05, wy - .07, wz, .1, .08, .16, OAK2, { top: IRON });
    b.box(.79, wy - .1, wz, .08, .2, .22, OAK);
    /* 木水槽：从后面的蓄水桶引过来，越过轮顶 */
    const yT = wy + Rw + .14, zs = zb - .55, ze = wz + .14;
    b.at(wx, 0, 0);
    b.box(0, yT, (zs + ze) / 2, .22, .03, ze - zs, OAK2);
    for (const s of [-1, 1]) b.box(s * .1, yT, (zs + ze) / 2, .025, .1, ze - zs, mix3(OAK2, BOARD, .4));
    b.quad([-.088, yT + .06, ze], [.088, yT + .06, ze], [.088, yT + .07, zs], [-.088, yT + .07, zs], C.water, { mat: "water", k: 2 });
    for (let i = 0; i < 4; i++) { const z = zs + (ze - zs) * (i + .5) / 4; b.box(0, yT - .015, z, .26, .02, .04, OAK); }
    for (const z of [zb - .06, zs + .12]) {                   /* 槽下木架 */
      for (const s of [-1, 1]) b.beam([s * .13, 0, z], [s * .1, yT, z], .045, OAK);
      b.beam([-.12, yT * .45, z], [.12, yT * .75, z], .03, OAK); b.box(0, yT - .05, z, .3, .05, .06, OAK);
    }
    /* 落水：从槽口翻下来淋在轮叶上 */
    const P0 = [0, yT + .06, ze], pts = [P0, [0, yT - .04, ze + .07], [0, yT - .2, ze + .12], [0, wy + Rw * .55, ze + .16]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], c = pts[i + 1], w0 = .08 + i * .01, w1 = .09 + i * .01;
      qf(b, [-w0, a[1], a[2]], [w0, a[1], a[2]], [w1, c[1], c[2]], [-w1, c[1], c[2]], mix3(C.water, C.white, .35), [0, .3, 1], { mat: "water", k: 2 });
    }
    b.pop();
    b.emit(wx, .12, wz + Rw * .7, "mist", 5, .5);
    /* 高脚蓄水桶 */
    const cz = zs - .18, cr = .27, yb = yT - .06;
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) b.beam([wx + dx * .2, 0, cz + dz * .2], [wx + dx * .17, yb, cz + dz * .17], .05, OAK);
    b.beam([wx - .19, .3, cz - .19], [wx + .18, yb * .7, cz - .18], .03, OAK); b.beam([wx - .19, .3, cz + .19], [wx - .18, yb * .7, cz - .18], .03, OAK);
    b.box(wx, yb - .04, cz, .5, .04, .5, OAK2);
    b.at(0, yb, 0); barrel(b, wx, cz, cr, .42, true); b.pop();
  }
  function shed(b, x0, x1, z0, z1, yHi, yLo, o) {           /* 靠墙披棚（墙在 x1，往 -x 披下来）：木柱、檐檩、木瓦坡顶、后板墙；劈柴垛、炭袋、磨刀石 */
    o = o || {};
    const xp = x0 + .08, yp = yLo + (yHi - yLo) * (xp - x0) / (x1 - x0) - .02;
    for (const z of [z0 + .05, (z0 + z1) / 2 + .1, z1 - .05]) {
      b.box(xp, 0, z, .14, .06, .14, DRESS2, { nb: true });
      b.beam([xp, .06, z], [xp, yp, z], .06, OAK);
      b.beam([xp, yp - .2, z], [xp + .18, yp, z], .035, OAK);
    }
    b.beam([xp, yp + .03, z0 - .02], [xp, yp + .03, z1 + .02], .07, OAK);
    for (let i = 0; i < 5; i++) { const z = z0 + (z1 - z0) * (i + .5) / 5; b.beam([x0 - .02, yLo + .02, z], [x1, yHi, z], .04, OAK2); }
    slope(b, [x0 - .1, yLo - .03], [x1, yHi + .04], z0 - .1, z1 + .1, { nb: 5, cw: .2, cols: [mix3(OAK2, C.wood, .3), mix3(OAK2, BOARD, .5), mix3(OAK, OAK2, .5)], lift: .018 });
    /* 后板墙 */
    for (let i = 0; i < 7; i++) {
      const xa = x0 + .05 + (x1 - x0 - .05) * i / 7, xb = x0 + .05 + (x1 - x0 - .05) * (i + 1) / 7, ya = yLo + (yHi - yLo) * (xa - x0) / (x1 - x0), yb = yLo + (yHi - yLo) * (xb - x0) / (x1 - x0);
      qf(b, [xa, 0, z0], [xb, 0, z0], [xb, yb, z0], [xa, ya, z0], i % 2 ? BOARD : mix3(BOARD, OAK2, .4), [0, 0, 1]);
      qf(b, [xa, 0, z0 - .005], [xb, 0, z0 - .005], [xb, yb, z0 - .005], [xa, ya, z0 - .005], mix3(BOARD, OAK2, .3), [0, 0, -1]);
    }
    /* 劈柴垛：一根根原木端头朝外 */
    const lx0 = x0 + .14, lx1 = x1 - .3;
    for (let r = 0; r < 3; r++) for (let i = 0; i < 3 - (r === 2 ? 1 : 0); i++) {
      const x = lx0 + (i + r * .5) * .1 + .08, y = .06 + r * .085;
      if (x > lx1 + .1) continue;
      b.at(x, y, z0 + .03, R() * 1.5, 1, PI / 2); b.cyl(0, 0, 0, .045, .32, 5, mix3(C.woodD, C.wood, R() * .5), { top: mix3(C.woodL, C.hay, .3) }); b.pop();
    }
    /* 炭袋、磨刀石 */
    for (const [dx, dz, s] of [[.16, .3, 1], [.3, .38, .85]]) { b.sphere(x0 + dx, .13 * s, z0 + dz, .13 * s, 5, mix3([.62, .54, .4], OAK2, .2), { sy: .9 }); b.cyl(x0 + dx, .22 * s, z0 + dz, .05, .06, 6, mix3([.62, .54, .4], OAK2, .3)); }
    const gx = x0 + .34, gz = z1 - .3;
    for (const s of [-1, 1]) b.beam([gx, 0, gz + s * .1], [gx, .36, gz + s * .08], .035, OAK);
    b.beam([gx, .3, gz - .12], [gx, .3, gz + .12], .03, IRON, M);
    b.at(gx, .3, gz, 0, 1, 0, PI / 2); b.cyl(0, -.04, 0, .2, .08, 10, mix3(C.stone, [.7, .62, .5], .35)); b.pop();
    b.at(gx, 0, gz - .02); b.box(0, 0, .02, .26, .08, .18, OAK2); b.pop();
  }

  /* ---------- Lv3：锻炉塔、吊臂 ---------- */
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带，略往里收 */
    b.cyl(cx, y, cz, r * 1.1, h * .05, seg, SL2, { r2: r * .96, nt: true, bot: STD, a0: PI / seg });
    if (cy) b.cyl(cx, y + h * .05, cz, r * .975, .03, seg, BRASS, { mat: "metal", nt: true, nb: true, a0: PI / seg });
    const y0 = y + h * .05, H = h * .95, nb = 6;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true, a0: PI / seg });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true, a0: PI / seg });
    }
    return y + h;
  }
  /* 锻炉塔：圆石塔，腰线、尖拱窗、箭孔；左面炉口透炭火、门口一架风箱；后左贴一根方石烟道冒烟带火星；顶上托石挑檐、石板瓦尖顶、老虎窗、小旗 */
  function forgeTower(b, tx, tz, r, top, fa, cy) {
    const seg = 12;
    b.cyl(tx, 0, tz, r + .08, .12, seg, mix3(ST2, STD, .35), { r2: r + .02, top: DRESS2, a0: PI / seg });
    rwall(b, tx, tz, r, .12, top, seg, .22);
    b.cyl(tx, top * .5, tz, r + .025, .05, seg, DRESS2, { a0: PI / seg, nb: true });
    /* 炉口 */
    b.at(tx, 0, tz, fa);
    const zw = r - .035;
    archRing(b, .36, .18, .62, .07, zw, zw + .09, { n: 3 });
    fan(b, outline(.36, .18, 0, .62, 3), zw + .002, INNER);
    b.box(0, .12, zw + .01, .3, .08, .05, mix3(STD, [0, 0, 0], .3), { nb: true });
    b.box(0, .2, zw + .012, .24, .045, .04, FIRE, { e: .62, nb: true });
    b.panel(0, .245, zw + .006, .22, .1, mix3(INNER, FIRE, .3), { e: .28 });
    b.box(0, .58, zw + .06, .5, .05, .13, DRESS2, { top: DRESS });
    b.emit(0, .3, zw + .12, "ember", 3, .7);
    b.at(.42, 0, zw + .3, -2.25);                           /* 风箱：木架上一只大风箱，皮囊带褶，铁嘴对着炉口，后头一根压杆 */
    for (const z of [-.16, .12]) for (const s of [-1, 1]) b.beam([s * .11, 0, z], [s * .08, .2, z], .03, OAK);
    b.box(0, .2, -.02, .22, .025, .36, OAK);
    { const y0 = .225, y1 = .33, Pp = [[-.14, -.24], [.14, -.24], [.06, .2], [-.06, .2]], LE = mix3([.42, .29, .2], OAK, .15);
      for (let i = 0; i < 4; i++) { const [ax, az] = Pp[i], [bx, bz] = Pp[(i + 1) % 4], hint = [(az + bz) / 2 === -.24 ? 0 : (ax + bx), 0, (az + bz) / 2 === -.24 ? -1 : (az + bz) / 2 + .1]; qf(b, [ax, y0, az], [bx, y0, bz], [bx, y1 + (bz < 0 ? .03 : 0), bz], [ax, y1 + (az < 0 ? .03 : 0), az], LE, hint);
        qf(b, [ax * 1.06, y0 + .045, az], [bx * 1.06, y0 + .045, bz], [bx * 1.06, y0 + .06, bz], [ax * 1.06, y0 + .06, az], mix3(LE, [0, 0, 0], .35), hint); }
      qf(b, [-.15, y1 + .03, -.25], [.15, y1 + .03, -.25], [.07, y1, .21], [-.07, y1, .21], OAK2, [0, 1, 0]);
      b.beam([0, y1 + .04, -.24], [0, y1 + .13, -.46], .03, OAK2);
      b.at(0, (y0 + y1) / 2, .2, 0, 1, PI / 2); b.cone(0, 0, 0, .03, .17, 5, IRON, M); b.pop(); }
    b.pop();
    b.pop();
    /* 窗、箭孔 */
    for (const [a, y, w, h] of [[.45, 1.85, .13, .28], [-.55, 2.2, .12, .24], [1.35, 1.05, .12, .24], [-.2, .85, .11, .22]]) { b.at(tx, 0, tz, a); lancet(b, 0, y, r - .004, w, h, { p: .72 }); b.pop(); }
    for (const [a, y] of [[1.0, 2.35], [-1.1, 1.55]]) { b.at(tx, 0, tz, a); b.panel(0, y - .02, r + .002, .07, .26, DRESS2); b.panel(0, y, r + .006, .028, .22, INNER); b.panel(0, y + .1, r + .007, .09, .026, INNER); b.pop(); }
    /* 托石挑檐、尖顶、老虎窗、小旗 */
    for (let i = 0; i < 12; i++) { b.at(tx, 0, tz, (i + .5) / 12 * TAU); cbox(b, 0, top - .1, r - .02, .075, .09, r + .07, mix3(DRESS2, ST2, .45)); b.pop(); }
    b.cyl(tx, top - .02, tz, r + .09, .1, seg, DRESS2, { a0: PI / seg });
    const apex = spire(b, tx, top + .08, tz, r + .07, 1.45, seg, cy);
    { const a = .6, f = .2, yd = top + .08 + 1.45 * f, rd = (r + .07) * .96 * Math.pow(1 - f, 1.1);
      b.at(tx, 0, tz, a);
      b.box(0, yd, rd - .1, .15, .17, .22, mix3(SL, STD, .4));
      b.panel(0, yd + .03, rd + .012, .08, .1, WIN, { e: .5 });
      b.at(0, yd + .17, rd - .1, PI / 2); b.gable(0, 0, 0, .24, .21, .12, SL2, { end: mix3(SL, STD, .4) }); b.pop();
      b.pop(); }
    flag(b, tx, apex - .05, tz, C.banner, .5);
    return apex;
  }
  function flue(b, fx, fz, a, top, cy) {                    /* 贴着塔的方石烟道：熏黑的石砌、腰线、压顶、防火星的铁帽 */
    b.at(fx, 0, fz, a);
    const hw = .17;
    stoneBox(b, -hw, hw, 0, top, -hw, hw, { rh: .25, q: false, col: y => soot(y + .5) });
    for (const y of [1.3, 2.4]) b.box(0, y, 0, hw * 2 + .05, .045, hw * 2 + .05, mix3(DRESS2, STD, .3));
    b.box(0, top - .02, 0, hw * 2 + .1, .07, hw * 2 + .1, mix3(DRESS, STD, .3), { top: mix3(INNER, STD, .3) });
    const fit = cy ? BRASS : IRON;
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) b.beam([dx * .1, top + .05, dz * .1], [dx * .1, top + .2, dz * .1], .02, fit, M);
    b.cyl(0, top + .18, 0, .2, .03, 8, fit, Object.assign({ a0: PI / 8 }, M));
    b.cone(0, top + .21, 0, .19, .1, 8, fit, Object.assign({ a0: PI / 8, nb: true }, M));
    b.pop();
    b.emit(fx, top + .3, fz, "smoke", 12, 1.15);
    b.emit(fx, top + .15, fz, "ember", 3, .6);
  }
  function crane(b, tx, tz, r, ca, y0, y1, reach, cy) {       /* 塔身上的木吊臂：托石上立柱、横臂、斜撑、铁箍、滑轮、绞盘，绳索吊着一箱铁料 */
    const fit = cy ? BRASS : IRON, rp = r + .07;
    b.at(tx, 0, tz, ca);
    b.box(0, y0 - .12, r + .02, .14, .12, .14, DRESS2, { nb: true });
    b.beam([0, y0, rp], [0, y1 + .06, rp], .07, OAK);
    for (const y of [y0 + .2, y1 - .1]) b.box(0, y, rp - .045, .1, .04, .1, fit, M);
    b.beam([0, y1, rp - .05], [0, y1, rp + reach + .05], .065, OAK2);
    b.beam([0, y0 + .12, rp + .03], [0, y1 - .03, rp + reach * .62], .045, OAK);
    b.beam([0, y1 + .05, rp], [0, y1 + .02, rp + reach - .02], .012, mix3(HAY, OAK, .4));
    for (const z of [rp + reach * .62, rp + reach - .02]) b.box(0, y1 - .04, z, .085, .08, .03, fit, M);
    b.at(0, y1 - .07, rp + reach - .02, 0, 1, 0, PI / 2); b.cyl(0, -.025, 0, .05, .05, 8, fit, M); b.pop();
    b.at(0, y0 + .3, rp + .02, 0, 1, 0, PI / 2); b.cyl(0, -.1, 0, .06, .2, 6, OAK2); b.cyl(0, .1, 0, .08, .02, 6, fit, Object.assign({ nb: true }, M)); b.pop();
    b.beam([.12, y0 + .3, rp + .02], [.12, y0 + .42, rp + .09], .02, fit, M);
    b.beam([0, y0 + .32, rp + .07], [0, y1 - .02, rp + .02], .012, mix3(HAY, OAK, .4));
    const yl = y1 - 2.0, zl = rp + reach - .02;
    b.beam([0, y1 - .1, zl], [0, yl + .42, zl], .014, mix3(HAY, OAK, .4));
    b.box(0, yl + .38, zl, .05, .05, .02, IRON, M);
    for (const s of [-1, 1]) b.beam([0, yl + .39, zl], [s * .13, yl + .27, zl], .01, IRON, M);
    crate(b, 0, yl, zl, .9, .2, true);
    for (let i = 0; i < 3; i++) b.box(-.06 + i * .06, yl + .235, zl, .035, .035, .34, mix3(IRON, C.metal, .4), Object.assign({ nb: true }, M));
    b.pop();
  }

  /* ---------- 2077：竞速扫帚、黄铜管、天窗 ---------- */
  function trestle(b, x, z, ry) {
    b.at(x, 0, z, ry);
    b.box(0, .33, 0, .05, .045, .3, OAK2);
    for (const s of [-1, 1]) for (const t of [-1, 1]) tube(b, [0, .34, t * .1], [s * .11, 0, t * .13], .016, OAK2, {}, 4);
    b.beam([-.06, .12, -.1], [-.06, .12, .1], .022, OAK);
    b.pop();
  }
  function racingBroom(b, x, y, z, ry) {                    /* 改装中的竞速扫帚：沿 x 平放；深色亮漆细柄、黄铜箍、踏镫、尾部稳定环、修剪齐整的帚尾 */
    b.at(x, y, z, ry);
    b.at(0, 0, 0, 0, 1, 0, -PI / 2);
    b.cyl(0, -.55, 0, .022, 1.0, 6, mix3(C.woodD, [.25, .1, .06], .3), { r2: .016, mat: "gloss" });
    b.cone(0, .45, 0, .016, .06, 6, BRASS, M);
    for (const t of [-.42, -.2, .1, .3]) b.cyl(0, t, 0, .026, .02, 6, BRASS, { mat: "metal", nt: true, nb: true });
    b.cyl(0, -.62, 0, .07, .1, 8, HAY, { r2: .03 });
    b.cyl(0, -.9, 0, .11, .28, 8, mix3(HAY, C.woodL, .3), { r2: .07 });
    b.cyl(0, -.58, 0, .04, .05, 8, BRASS, M);
    b.torus(0, -.72, 0, .14, .012, 10, 3, BRASS, M);
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; b.beam([Math.cos(a) * .03, -.56, Math.sin(a) * .03], [Math.cos(a) * .14, -.72, Math.sin(a) * .14], .012, BRASS, M); }
    b.pop();
    for (const s of [-1, 1]) { b.beam([-.3, 0, 0], [-.36, -.12, s * .07], .012, BRASS, M); b.box(-.36, -.13, s * .07, .07, .012, .04, BRASS, M); }
    b.pop();
  }
  function toolbox(b, x, z, ry) {
    b.at(x, 0, z, ry);
    b.box(0, 0, 0, .22, .1, .12, mix3(C.banner, C.woodD, .35));
    b.box(0, .1, 0, .23, .012, .13, BRASS, M);
    b.beam([-.08, .11, 0], [-.06, .17, 0], .012, BRASS, M); b.beam([.08, .11, 0], [.06, .17, 0], .012, BRASS, M); b.beam([-.06, .17, 0], [.06, .17, 0], .012, BRASS, M);
    b.box(-.05, .11, .02, .08, .03, .03, C.metal, M); b.box(.05, .11, -.02, .06, .02, .04, BRASS, M);
    b.pop();
  }
  function valve(b, x, y, z) { b.at(x, y, z, 0, 1, PI / 2); b.torus(0, 0, 0, .045, .008, 8, 3, C.banner, M); b.beam([-.045, 0, 0], [.045, 0, 0], .008, C.banner, M); b.pop(); }
  function gauge(b, x, y, z) {                              /* 压力表（面朝 +z） */
    b.at(x, y, z, 0, 1, PI / 2); b.cyl(0, 0, 0, .05, .025, 8, BRASS, M); b.pop();
    b.panel(x, y - .035, z + .027, .06, .07, mix3(C.cream, C.white, .4));
    b.beam([x, y, z + .03], [x + .02, y + .025, z + .03], .006, IRON);
  }
  function skylight(b, A, B, za, zb, t0, t1) {              /* 坡上的黄铜框玻璃天窗：A 檐、B 脊（xy），t0–t1 是沿坡的范围 */
    const dx = B[0] - A[0], dy = B[1] - A[1];
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const P = (t, l) => [A[0] + dx * t + N[0] * l, A[1] + dy * t + N[1] * l];
    const [xa, ya] = P(t0, .03), [xb, yb] = P(t1, .03), [xa1, ya1] = P(t0, .062), [xb1, yb1] = P(t1, .062);
    qf(b, [xa, ya, za], [xa, ya, zb], [xb, yb, zb], [xb, yb, za], mix3(INNER, C.glow, .3), [N[0], N[1], 0], { e: .25 });
    qf(b, [xa1, ya1, za], [xa1, ya1, zb], [xb1, yb1, zb], [xb1, yb1, za], mix3(C.glass, C.white, .15), [N[0], N[1], 0], { mat: "glass" });
    for (const z of [za, (za + zb) / 2, zb]) b.beam([xa1, ya1, z], [xb1, yb1, z], .03, BRASS, M);
    for (const t of [t0, (t0 + t1) / 2, t1]) { const [x, y] = P(t, .064); b.beam([x, y, za - .015], [x, y, zb + .015], .03, BRASS, M); }
    for (const [t, z] of [[t0, za], [t0, zb], [t1, za], [t1, zb]]) { const [x, y] = P(t, .03); b.beam([x, y - .04, z], [x, y + .03, z], .04, mix3(BRASS, OAK, .3), M); }
  }

  function build(b, o) {
    R = o.rnd || Math.random;
    const lv = o.lv || 1, cy = !!o.cyber;
    const X0 = [0, .06, .14, .37][lv], Z0 = [0, -.16, .14, .27][lv];
    /* 主屋尺寸 */
    const W2 = .75, F = .6, BK = -.9, P = .1, G1 = .98, UW = .79, UF = F + .1, U0 = G1, U1 = 1.68, GZ = UF + .05, K = 1.25;
    const YR = U1 + UW * K, HX = UW + .15, YE = U1 - (HX - UW) * K, RF = GZ + .11, RB = BK - .12;
    const rY = x => U1 + (UW - Math.abs(x)) * K;
    b.at(X0, 0, Z0);

    /* 台基、底层石墙 */
    b.box(0, 0, (F + BK) / 2, W2 * 2 + .12, P, F - BK + .12, mix3(ST2, STD, .45), { top: DRESS2 });
    stoneBox(b, -W2, W2, P, G1, BK, F, {});
    /* 正面：尖拱大门（一扇敞着）、门楣马蹄铁、门前台阶石板 */
    const dw = .5, dh = .4, dp = .64, rise = archY(dw, dp, 0);
    b.at(0, P, F);
    archRing(b, dw, dh, dp, .085, .002, .075, {});
    fan(b, outline(dw, dh, 0, dp, 4), .004, INNER);
    b.panel(0, 0, .006, dw * .9, .12, mix3(INNER, FIRE, .3), { e: .28 });
    b.panel(-.06, .02, .007, .16, .22, mix3(INNER, FIRE, .18), { e: .2 });
    { const ap = archPts(dw, dp, 4), n = 4, wd = mix3(C.woodD, C.wood, .25), dark = mix3(C.woodD, [0, 0, 0], .45);
      const L = [[-dw / 2, 0], [0, 0]].concat(ap.slice(0, n + 1).reverse().map(([x, y]) => [x, y + dh]));
      fan(b, L, .03, wd);                                     /* 左扇：关着，竖板、铁箍、铁钉、门环 */
      for (const x of [-dw * .375, -dw * .25, -dw * .125]) b.panel(x, 0, .033, .01, dh + archY(dw, dp, x) - .02, dark);
      b.panel(-.003, 0, .033, .014, dh + rise - .02, dark);
      for (const y of [dh * .2, dh * .62, dh + rise * .35]) {
        const xr = -Math.min(dw / 2 - .01, y > dh ? Math.sqrt(Math.max(0, 1 - Math.pow((y - dh) / rise, 2))) * dw / 2 * .9 : dw / 2 - .01);
        b.panel((xr - .01) / 2, y, .036, -xr - .02, .028, IRON, M);
        for (let i = 0; i < 3; i++) b.panel(xr + .03 + i * (-xr - .06) / 2, y + .007, .038, .014, .014, C.metal, M);
      }
      b.at(-.05, dh * .5, .05, 0, 1, PI / 2); b.torus(0, 0, 0, .025, .006, 8, 3, IRON, M); b.pop();
      const Rr = [[0, 0], [dw / 2, 0]].concat(ap.slice(n).map(([x, y]) => [x, y + dh])).map(([x, y]) => [x - dw / 2, y]);
      b.at(dw / 2, 0, .03, 1.95);                             /* 右扇：敞开，背面看得见横档和斜撑 */
      fan(b, Rr, 0, wd); fanB(b, Rr, -.03, mix3(wd, C.wood, .2));
      for (let i = 0; i < Rr.length; i++) { const p = Rr[i], q = Rr[(i + 1) % Rr.length]; if (i === 0) continue; qf(b, [p[0], p[1], -.03], [q[0], q[1], -.03], [q[0], q[1], 0], [p[0], p[1], 0], dark, [q[1] - p[1], p[0] - q[0], 0]); }
      for (const y of [dh * .15, dh * .78]) b.box(-dw / 4, y, -.045, dw / 2 - .03, .04, .015, dark, { nb: true });
      strip(b, -dw / 2 + .03, dh * .15 + .04, -.03, dh * .78, .035, -.05, .02, dark);
      for (const y of [dh * .2, dh * .62]) b.panel(-dw / 4 + .01, y, .003, dw / 2 - .04, .028, IRON, M);
      b.pop(); }
    horseshoe(b, -.11, dh + .14, .04);                       /* 关着的那扇门上钉一只马蹄铁 */
    b.pop();
    b.box(0, 0, F + .12, dw + .3, P * .55, .22, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    flagstones(b, -.45, .45, F + .3, F + .8, 9);
    /* 正面：左边工具架、右边挂扫帚、门边铁提灯、招牌 */
    toolRack(b, -.5, F);
    b.box(.52, .76, F + .02, .38, .035, .035, OAK2);
    for (const [dx, l] of [[.4, .4], [.52, .44], [.64, .38]]) { b.box(dx, .74, F + .045, .02, .02, .04, OAK); broom(b, dx, .75, F + .07, l); }
    wallLantern(b, -.3, .68, F, cy);
    sign(b, .58, U0 + .3, UF + .03, cy);
    /* 底层侧面、后面：尖拱窗、扶壁 */
    b.at(W2, 0, (F + BK) / 2, PI / 2);
    lancet(b, -.42, .4, 0, .15, .26, {});
    if (lv < 2) { lancet(b, .4, .4, 0, .15, .26, {}); buttress(b, .05, 0, .82); }
    ivy(b, -.55, P, 0, .5, .8, 26);
    b.pop();
    b.at(-W2, 0, (F + BK) / 2, -PI / 2);
    lancet(b, .5, .4, 0, .15, .26, {});
    if (lv < 2) ivy(b, .62, P, 0, .3, .7, 16);
    b.pop();
    b.at(0, 0, BK, PI);
    lancet(b, 0, .45, 0, .14, .24, {});
    for (const x of [-.45, .45]) buttress(b, x, 0, .8);
    b.pop();
    ivy(b, -.68, P, F, .3, .75, 20);

    /* 挑出的上层：地梁、楼板托梁头、斜托 */
    b.box(0, U0, (UF + BK) / 2, UW * 2, .07, UF - BK, OAK);
    for (let i = 0; i <= 10; i++) { const x = -UW + .06 + i * (UW * 2 - .12) / 10; cbox(b, x, U0 - .055, F - .01, .045, .055, UF + .025, OAK2); }
    for (const x of [-.55, .55]) b.beam([x, U0 - .34, F + .005], [x, U0 - .01, UF - .015], .045, OAK);
    /* 上层半木墙 */
    htWall(b, -UW, UW, U0 + .07, U1, UF, ["l", "W", "v", "W", "r"], { ww: .22, wh: .28, shutter: mix3([.27, .36, .35], OAK, .3) });
    b.at(UW, 0, (UF + BK) / 2, PI / 2); htWall(b, -(UF - BK) / 2, (UF - BK) / 2, U0 + .07, U1, 0, ["x", "p", "w", "s", "x"], { ww: .22, wh: .28 }); b.pop();
    b.at(-UW, 0, (UF + BK) / 2, -PI / 2); htWall(b, -(UF - BK) / 2, (UF - BK) / 2, U0 + .07, U1, 0, ["l", "w", "-", "-", "r"], { ww: .22, wh: .28 }); b.pop();
    b.at(0, 0, BK, PI); htWall(b, -UW, UW, U0 + .07, U1, 0, ["r", "w", "p", "w", "l"], { ww: .22, wh: .26 }); b.pop();
    /* 山墙：正面再挑一次；后山墙 */
    b.box(0, U1 - .01, (GZ + UF) / 2 - .01, UW * 2 + .06, .06, GZ - UF + .04, OAK);
    for (let i = 0; i <= 6; i++) { const x = -UW + .1 + i * (UW * 2 - .2) / 6; cbox(b, x, U1 - .05, UF, .04, .045, GZ + .02, OAK2); }
    htGable(b, UW, U1 + .05, YR - U1 - .05, GZ, { ww: .32 });
    b.at(0, 0, BK, PI); htGable(b, UW, U1, YR - U1, 0, { ww: .22 }); b.pop();
    /* 石板瓦顶、封檐板、屋脊、尖针 */
    slope(b, [HX, YE], [0, YR + .02], RB, RF, { nb: 7 });
    slope(b, [-HX, YE], [0, YR + .02], RB, RF, { nb: 7 });
    for (const z of [RF - .02, RB + .02]) for (const s of [-1, 1]) barge(b, [s * (HX + .01), YE - .01], [0, YR + .03], z, .06);
    b.box(0, YR - .015, (RF + RB) / 2, .11, .07, RF - RB + .02, SLD, { top: mix3(SLD, SL2, .4) });
    for (let z = RB + .25; z < RF - .1; z += .28) b.cone(0, YR + .055, z, .018, .08, 4, cy ? BRASS : IRON, { nb: true, mat: "metal" });
    for (const z of [RF + .005, RB - .005]) { b.beam([0, YR - .2, z], [0, YR + .3, z], .035, OAK); b.cone(0, YR - .26, z, .03, .08, 4, OAK, { nb: true }); }
    b.beam([0, YR + .28, RF + .005], [0, YR + .52, RF + .005], .016, cy ? BRASS : IRON, M);
    b.sphere(0, YR + .34, RF + .005, .028, 4, C.gold, M);
    /* 右坡老虎窗 */
    { const dz = -.45, xf = .44, y0 = rY(xf) - .02, w = .34, h = .3;
      b.at(0, 0, dz, PI / 2);
      b.box(0, y0 - .25, (xf + .1) / 2, w, h + .25, xf - .1, DAUB, { nb: true });
      for (const s of [-1, 1]) strip(b, s * (w / 2 - .02), y0, s * (w / 2 - .02), y0 + h, .04, xf, .02, OAK);
      strip(b, -w / 2, y0 + .02, w / 2, y0 + .02, .045, xf, .022, OAK);
      tWin(b, 0, y0 + .07, .17, .17, xf, {});
      b.at(0, y0 + h, (xf + .12) / 2 + .03, PI / 2); b.gable(0, 0, 0, xf - .02, w + .12, .22, SL2, { end: DAUB }); b.pop();
      for (const s of [-1, 1]) b.beam([s * (w / 2 + .06), y0 + h - .02, xf + .03], [0, y0 + h + .23, xf + .03], .035, OAK2);
      b.pop(); }

    /* 左侧大烟囱：石砌、肩部收分、两道腰线、往上越熏越黑、两级挑出的压顶、两只陶烟囱帽 */
    { const cz0 = -.62, cz1 = 0, cxo = -W2 - .44, ys = 1.12, yt = 3.02, cm = (cz0 + cz1) / 2;
      stoneBox(b, cxo, -W2, 0, ys, cz0, cz1, { nr: true, col: soot });
      b.box((cxo - W2) / 2, 0, cm, -W2 - cxo + .08, .14, cz1 - cz0 + .08, mix3(ST2, STD, .4), { top: DRESS2, nb: true });
      const cxo2 = cxo + .1, cz02 = cz0 + .07, cz12 = cz1 - .07, ys2 = ys + .17;
      qf(b, [cxo, ys, cz0], [cxo, ys, cz1], [cxo2, ys2, cz12], [cxo2, ys2, cz02], DRESS2, [-1, 1, 0]);
      qf(b, [cxo, ys, cz1], [-W2, ys, cz1], [-W2, ys2, cz12], [cxo2, ys2, cz12], DRESS2, [0, 1, 1]);
      qf(b, [cxo, ys, cz0], [-W2, ys, cz0], [-W2, ys2, cz02], [cxo2, ys2, cz02], DRESS2, [0, 1, -1]);
      stoneBox(b, cxo2, -W2 + .03, ys2, yt, cz02, cz12, { rh: .17, q: false, col: soot });
      const sx = (cxo2 - W2 + .03) / 2, sw = -W2 + .03 - cxo2, sd = cz12 - cz02;
      for (const y of [1.98, 2.62]) b.box(sx, y, cm, sw + .05, .045, sd + .05, mix3(DRESS2, STD, .3));
      b.box(sx, yt - .02, cm, sw + .07, .06, sd + .07, mix3(DRESS2, STD, .35));
      b.box(sx, yt + .04, cm, sw + .12, .07, sd + .12, mix3(DRESS, STD, .3), { top: mix3(INNER, STD, .3) });
      for (const dz of [-.12, .12]) { const pz = cm + dz; b.cyl(sx, yt + .11, pz, .07, .2, 7, POT, { r2: .055, top: INNER, nb: true }); b.cyl(sx, yt + .27, pz, .066, .035, 7, mix3(POT, [0, 0, 0], .25), { nb: true }); b.emit(sx, yt + .36, pz, "smoke", 8, 1.05); }
      if (lv < 2) { b.at(cxo, 0, cm, -PI / 2); ivy(b, -.05, P, 0, .5, .9, 22); b.pop(); }
    }

    /* 门前：铁砧、淬火桶、小水桶 */
    if (!cy) anvil(b, .42, F + .55, -.35, cy); else anvil(b, .6, F + .48, -.6, cy);
    barrel(b, .93, F + .3, .15, .34, true, .3);
    bucket(b, .74, F + .5, .4);
    if (!cy) { b.at(-.86, 0, F + .35, .5); b.beam([0, 0, 0], [.04, .7, -.12], .024, C.woodL); b.at(0, 0, 0, 0, 1, -.17); b.cyl(0, -.02, 0, .085, .26, 6, HAY, { r2: .03 }); b.pop(); b.pop(); }

    /* Lv2：右侧水车、左侧披棚 */
    if (lv >= 2) {
      const wx = 1.0, wy = .5, wz = -.36, Rw = .46, wd = .2;
      b.spin(wx, wy, wz, "x", .7, sb => waterWheel(sb, Rw, wd));
      wheelWorks(b, wx, wy, wz, Rw, wd);
      shed(b, -1.5, -W2, -.82, .42, .96, .6, {});
      crate(b, -1.2, 0, .62, .9, .3);
      crate(b, -1.32, 0, .3, .8, -.2);
      b.at(-W2, 0, (F + BK) / 2, -PI / 2); ivy(b, .7, P, .002, .25, .55, 10); b.pop();
    }
    /* Lv3：左后锻炉塔、贴塔的石烟道、塔身吊臂 */
    if (lv >= 3) {
      const tx = -1.22, tz = -1.32, tr = .42, ttop = 2.75;
      forgeTower(b, tx, tz, tr, ttop, -1.45, cy);
      flue(b, tx + Math.sin(-2.3) * (tr + .1), tz + Math.cos(-2.3) * (tr + .1), -2.3, 3.6, cy);
      crane(b, tx, tz, tr, -.55, 1.55, 2.5, .8, cy);
      rivy(b, tx, tz, tr, 1.7, 1.2, .12, 1.3, 24);
      flagstones(b, -1.95, -1.55, -1.45, -.95, 4);
    }

    /* 2077：黄铜管道、玻璃天窗、排汽管、竞速扫帚、猫球灯 */
    if (cy) {
      const px = W2 + .05;
      for (const [y, r] of [[.84, .028], [.93, .022]]) {        /* 右墙两根黄铜管：沿墙往前，拐到正面往上进上层 */
        tube(b, [px, y, BK + .05], [px, y, F + .05], r, BRASS, M);
        tube(b, [px, y, F + .05], [px - .08, y, F + .05], r, BRASS, M);
        for (const z of [BK + .25, .3]) b.box(px, y - .03, z, r * 2 + .024, .06, .05, mix3(BRASS, IRON, .3), Object.assign({ nb: true }, M));
      }
      tube(b, [px, .84, F + .05], [px, .2, F + .05], .028, BRASS, M);
      tube(b, [px, .2, F + .05], [.93, .2, F + .3], .028, BRASS, M);
      tube(b, [.93, .2, F + .3], [.93, .4, F + .3], .028, BRASS, M);
      b.cyl(px, .5, F + .05, .042, .05, 6, BRASS, M);
      b.at(px, 0, .35, PI / 2); gauge(b, 0, .6, .02); b.pop();
      b.at(px + .05, .72, F - .1, PI / 2); valve(b, 0, 0, 0); b.pop();
      /* 烟囱正面一根黄铜管直上 */
      tube(b, [-W2 - .4, .3, -.29], [-W2 - .32, 1.3, -.29], .03, BRASS, M);
      tube(b, [-W2 - .32, 1.3, -.29], [-W2 - .32, 2.9, -.29], .03, BRASS, M);
      for (const y of [.6, 1.6, 2.2, 2.7]) b.box(-W2 - .32, y, -.29, .05, .03, .1, mix3(BRASS, IRON, .3), M);
      b.cyl(-W2 - .32, 2.9, -.29, .045, .12, 6, BRASS, M);
      /* 右坡：玻璃天窗；排汽管 */
      skylight(b, [HX, YE], [0, YR], .05, .55, .22, .72);
      const vx = .3, vz = -.05, vy = rY(vx);
      b.cyl(vx, vy - .1, vz, .045, .5, 8, BRASS, M); b.cyl(vx, vy + .2, vz, .06, .04, 8, mix3(BRASS, IRON, .2), M);
      b.cone(vx, vy + .4, vz, .09, .08, 8, BRASS, M); for (const s of [-1, 1]) b.beam([vx + s * .05, vy + .32, vz], [vx + s * .05, vy + .41, vz], .012, BRASS, M);
      b.emit(vx, vy + .48, vz, "steam", 7, .8);
      /* 门口的竞速扫帚 */
      trestle(b, -.55, F + .62, 0); trestle(b, .02, F + .62, 0);
      racingBroom(b, -.24, .4, F + .62, 0);
      toolbox(b, -.3, F + .95, .3);
      b.emit(-.62, 1.05, F + .4, "cat", 1, 1);
      if (lv >= 3) b.emit(1.38, 1.25, .2, "cat", 1, 1);
    }
    b.pop();
  }
  build.h = o => (o.lv || 1) >= 3 ? 4.95 : 3.6;            /* Lv3 是锻炉塔尖顶小旗，其余是烟囱帽 */
  Isle3D.FAC["工坊"] = build;
})();
