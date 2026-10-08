/* 货仓：霍格沃茨式的石砌大仓（像老修道院的什一税谷仓）。
   1994：风化灰石错缝砌的长仓，山墙朝前；正面一道料石券的尖拱大车门（一扇关着：竖板、铁箍、铁钉，一扇敞着露出里头的货箱和暖光），
         门前石坡道、石板路；山墙上压料石压顶、两端托石、山尖一座小尖塔；山墙上开阁楼货门，头顶挑出一根吊货木梁（铁滑轮、绳子吊着一捆货），
         大门两边两面长挂旗；两侧墙各一排两级扶壁、扶壁间高窄尖拱窗（烛光），侧墙铁提灯，墙角常春藤；
         深蓝灰石板瓦陡顶，屋脊中间一座木百叶通风小塔（四坡石板瓦尖帽、铁风向标）。
         院里：右前一架立式木吊臂（石墩、斜撑、绞盘、铁滑轮，绳子吊着一只木箱正往手推车上放），
         一辆两轮木手推车（辐条轮、车厢里麻袋），左前一堆木箱、一排立着的木桶、躺在木架上的木桶垛、麻袋。
         Lv2 左边加一座圆筒石仓：石砌圆身、腰线、尖拱小铁钉门、箭孔窗、托石挑檐、石板瓦锥顶和小旗，顶上开一扇带披檐的上货口和木滑槽。
         Lv3 右后加第二座小石仓（长边朝前，两扇尖拱货门开在站台上），门前一条石砌装货站台（木板台面、护舷木、系货桩、石阶、斜坡道），
             台上堆货，吊臂转过来从站台上吊货。
   2077：同一套石头底子，吊臂换成黄铜桁架（黄铜立柱、桁架臂、拉杆、齿轮绞盘、钢索），提灯、风向标换黄铜，通风小塔换黄铜框玻璃灯笼；
         左后立一根黄铜系泊桅杆，系着一艘小货运飞艇（帆布气囊、黄铜箍、蓝色尾翼、木吊舱里装着货箱、尾部螺旋桨在转，吊舱下兜着一网货），
         门口、站台边浮着猫球灯。不加霓虹、不加全息。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6);
  const COP = mix3(DRESS2, ST2, .5), COP2 = mix3(DRESS2, ST2, .25);                                   /* 山墙压顶：比墙面略浅的旧料石 */
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.1, .1, .12], .35);
  const WIN = mix3(C.glow, [.46, .33, .21], .34), FIRE = mix3(C.lamp, [.85, .34, .14], .45);
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), STEEL = mix3(C.metal, C.iron, .35);
  const IRON = C.iron, M = { mat: "metal" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4);
  const HAY = mix3(C.hay, C.woodL, .35), ROPE = mix3(C.hay, OAK2, .45);
  const SACK = mix3([.74, .64, .46], C.plank, .25), SACK2 = mix3([.62, .54, .4], OAK2, .25);
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
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆身：一圈圈石砌，层层错半块 */
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
    b.box(x, 0, z + .11, .17, h * .55, .22, sc(.3), { nb: true, top: DRESS2 });
    wedge(b, x, h * .55, z + .11, .17, .1, .22, DRESS2);
    b.box(x, h * .55, z + .06, .14, h * .45, .12, sc(.8), { nb: true });
    wedge(b, x, h, z + .06, .14, .1, .12, DRESS2);
  }

  /* ---------- 窗、灯、旗、藤 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.02, .025, o.frame || DRESS);
    fan(b, outline(w, h, 0, p), .029, o.glass || WIN, { e });
    b.panel(0, 0, .032, .016, h + archY(w, p, 0) * .8, mix3(IRON, OAK, .3));
    b.panel(0, h * .55, .033, w, .014, mix3(IRON, OAK, .3));
    b.box(0, -fr - .03, .01, w + fr * 2 + .05, .03, .07, DRESS2, { nb: true });
    b.pop();
  }
  function lantern(b, x, y, z, cy) {                        /* 铁提灯（六角，暖光）；2077 黄铜 */
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
  function banner(b, x, yTop, z, w, h, col) {               /* 墙上的长挂旗（面朝 +z）：铁横杆、布面、燕尾下摆、金边、中间一枚金色钥匙徽 */
    const fr = IRON, edge = mix3(col, C.gold, .55);
    b.beam([x - w / 2 - .03, yTop + .01, z + .03], [x + w / 2 + .03, yTop + .01, z + .03], .016, fr, M);
    for (const s of [-1, 1]) b.beam([x + s * (w / 2 + .01), yTop + .01, z], [x + s * (w / 2 + .01), yTop + .01, z + .04], .014, fr, M);
    const zf = z + .022, yb = yTop - h;
    b.quad([x - w / 2, yb + .07, zf], [x + w / 2, yb + .07, zf], [x + w / 2, yTop, zf], [x - w / 2, yTop, zf], col, { k: 1.08 });
    b.tri([x - w / 2, yb, zf], [x, yb + .07, zf], [x - w / 2, yb + .07, zf], col, { k: 1.1 });
    b.tri([x, yb + .07, zf], [x + w / 2, yb, zf], [x + w / 2, yb + .07, zf], col, { k: 1.1 });
    b.panel(x, yTop - .045, zf + .002, w, .025, edge);
    const kx = x, ky = yTop - h * .42, g = mix3(C.gold, col, .15);   /* 钥匙徽 */
    b.at(0, 0, zf + .003);
    b.quad([kx - .028, ky + .04, 0], [kx, ky + .012, 0], [kx + .028, ky + .04, 0], [kx, ky + .068, 0], g);
    b.panel(kx, ky - .1, 0, .016, .115, g);
    b.panel(kx + .018, ky - .095, 0, .024, .014, g); b.panel(kx + .016, ky - .07, 0, .018, .014, g);
    b.pop();
  }
  function flagstones(b, x0, x1, z0, z1, n) {               /* 门前铺的石板 */
    for (let i = 0; i < n; i++) {
      const x = x0 + R() * (x1 - x0), z = z0 + R() * (z1 - z0), w = .14 + R() * .12, d = .12 + R() * .1;
      const y = .012 + R() * .01, a = R() * .5, c = Math.cos(a), sn = Math.sin(a), P = (u, v) => [x + u * c + v * sn, y, z - u * sn + v * c];
      b.quad(P(-w / 2, d / 2), P(w / 2, d / 2), P(w / 2, -d / 2), P(-w / 2, -d / 2), mix3(C.stone, ST2, R() * .7));
    }
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
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 石板瓦锥顶：翘一点的檐口、一圈圈深浅瓦带，略往里收 */
    b.cyl(cx, y, cz, r * 1.1, h * .06, seg, SL2, { r2: r * .96, nt: true, bot: STD, a0: PI / seg });
    if (cy) b.cyl(cx, y + h * .06, cz, r * .975, .03, seg, BRASS, { mat: "metal", nt: true, nb: true, a0: PI / seg });
    const y0 = y + h * .06, H = h * .94, nb = 5;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true, a0: PI / seg });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true, a0: PI / seg });
    }
    return y + h;
  }

  /* ---------- 门 ---------- */
  /* 尖拱大车门（面朝 +z，原点在门洞底中点）：料石券、里头暗处的货箱和暖光；左扇关着（竖板、铁箍、铁钉、门环），右扇敞开（o.shut 两扇都关） */
  function cartDoor(b, dw, dh, dp, o) {
    o = o || {};
    const rise = archY(dw, dp, 0), fr = o.fr || .085;
    archRing(b, dw, dh, dp, fr, .002, .08, {});
    fan(b, outline(dw, dh, 0, dp, 4), .004, INNER);
    const ap = archPts(dw, dp, 4), n = 4, wd = mix3(C.woodD, C.wood, .25), dark = mix3(C.woodD, [0, 0, 0], .45);
    const leaf = (L, xs) => {                                /* 一扇门板：竖板缝、三道铁箍带铁钉 */
      fan(b, L, .03, wd);
      for (const x of xs) b.panel(x, 0, .033, .01, dh + archY(dw, dp, x) - .02, dark);
      for (const y of [dh * .18, dh * .62, dh + rise * .3]) {
        const half = y > dh ? Math.sqrt(Math.max(0, 1 - Math.pow((y - dh) / rise, 2))) * dw / 2 * .86 : dw / 2 - .015;
        const xa = L === null ? 0 : Math.max(-half, Math.min(...L.map(p => p[0]))), xb = Math.min(half, Math.max(...L.map(p => p[0])));
        if (xb - xa < .04) continue;
        b.panel((xa + xb) / 2, y, .036, xb - xa - .01, .028, IRON, M);
        for (let i = 0; i < 3; i++) b.panel(xa + .025 + i * (xb - xa - .05) / 2, y + .007, .038, .014, .014, C.metal, M);
      }
    };
    const Lp = [[-dw / 2, 0], [0, 0]].concat(ap.slice(0, n + 1).reverse().map(([x, y]) => [x, y + dh]));
    if (!o.shut) {                                            /* 敞开的那半边：门里暖光、一摞货箱的剪影 */
      b.panel(dw * .25, 0, .006, dw * .46, .14, mix3(INNER, FIRE, .3), { e: .24 });
      b.panel(dw * .2, .02, .007, dw * .22, .2, mix3(INNER, OAK2, .5));
      b.panel(dw * .3, .22, .008, dw * .16, .14, mix3(INNER, OAK2, .4));
      b.panel(dw * .2, .02 + .09, .008, dw * .22, .012, mix3(INNER, [0, 0, 0], .4));
    }
    leaf(Lp, [-dw * .375, -dw * .25, -dw * .125, -.003]);
    b.at(-.05, dh * .5, .05, 0, 1, PI / 2); b.torus(0, 0, 0, .025, .006, 8, 3, IRON, M); b.pop();
    const Rp = [[0, 0], [dw / 2, 0]].concat(ap.slice(n).map(([x, y]) => [x, y + dh]));
    if (o.shut) {
      leaf(Rp, [dw * .375, dw * .25, dw * .125]);
      b.at(.05, dh * .5, .05, 0, 1, PI / 2); b.torus(0, 0, 0, .025, .006, 8, 3, IRON, M); b.pop();
    } else {
      const Rr = Rp.map(([x, y]) => [x - dw / 2, y]);
      b.at(dw / 2, 0, .03, 1.95);                             /* 右扇：敞开，背面看得见横档和斜撑 */
      fan(b, Rr, 0, wd); fanB(b, Rr, -.03, mix3(wd, C.wood, .2));
      for (let i = 1; i < Rr.length; i++) { const p = Rr[i], q = Rr[(i + 1) % Rr.length]; qf(b, [p[0], p[1], -.03], [q[0], q[1], -.03], [q[0], q[1], 0], [p[0], p[1], 0], dark, [q[1] - p[1], p[0] - q[0], 0]); }
      for (const y of [dh * .15, dh * .78]) b.box(-dw / 4, y, -.045, dw / 2 - .03, .04, .015, dark, { nb: true });
      b.beam([-dw / 2 + .04, dh * .15 + .04, -.045], [-.04, dh * .78, -.045], .03, dark, { tz: .015 });
      for (const y of [dh * .2, dh * .62]) b.panel(-dw / 4 + .01, y, .003, dw / 2 - .04, .028, IRON, M);
      b.pop();
    }
  }

  /* ---------- 石仓 ---------- */
  /* 长仓（当前坐标系：屋脊沿 z，前山墙在 F 朝 +z，后山墙在 BK）：
     P.door 前山墙大车门；P.loft 阁楼货门＋吊货梁；P.banners；P.louvre 通风小塔；P.rb/lb 右／左侧扶壁的 z；P.rw/lw 侧墙窗的 z；P.sd 右墙货门的 z；P.bw 后墙窗 */
  function hall(b, P) {
    const hw = P.hw, F = P.F, BK = P.BK, WH = P.WH, K = P.K, PL = .08, cy = P.cy;
    const GH = hw * K, YR = WH + GH, ov = .13, HX = hw + ov, YE = WH - ov * K, RF = F + .03, RB = BK - .03;
    b.box(0, 0, (F + BK) / 2, hw * 2 + .1, PL, F - BK + .1, mix3(ST2, STD, .45), { top: DRESS2 });
    stoneBox(b, -hw, hw, PL, WH, BK, F, {});
    const gw = y => { const t = Math.max(0, 1 - (y - WH) / GH); return [-hw * t, hw * t]; };
    mason(b, gw, WH, YR - .03, F, {});
    b.at(0, 0, BK, PI); mason(b, gw, WH, YR - .03, 0, {}); b.pop();
    /* 山墙压顶、托石、山尖小尖塔 */
    for (const [z, rot] of [[F, 0], [BK, PI]]) {
      b.at(0, 0, z, rot);
      for (const s of [-1, 1]) {
        b.beam([s * (hw + .05), WH - .02, 0], [0, YR + .07, 0], .15, COP, { tz: .075 });
        b.box(s * (hw - .01), WH - .13, .0, .15, .12, .16, COP, { top: COP2 });
      }
      b.box(0, YR + .03, 0, .1, .12, .1, COP);
      b.box(0, YR + .15, 0, .13, .025, .13, COP2);
      b.pyramid(0, YR + .175, 0, .1, .1, .16, COP);
      b.sphere(0, YR + .34, 0, .022, 4, COP2);
      b.pop();
    }
    /* 石板瓦顶、屋脊 */
    slope(b, [HX, YE], [0, YR + .02], RB, RF, { nb: 8 });
    slope(b, [-HX, YE], [0, YR + .02], RB, RF, { nb: 8 });
    b.box(0, YR - .015, (RF + RB) / 2, .11, .07, RF - RB, SLD, { top: mix3(SLD, SL2, .4) });
    /* 正面 */
    if (P.door) {
      const d = P.door;
      b.at(0, PL, F); cartDoor(b, d.w, d.h, d.p, {}); b.pop();
      const rw = d.w / 2 + .1;                                /* 门前石坡道 */
      qf(b, [-rw, PL + .004, F], [rw, PL + .004, F], [rw, .004, F + .34], [-rw, .004, F + .34], DRESS2, [0, 1, .2]);
      for (const s of [-1, 1]) tf(b, [s * rw, 0, F], [s * rw, PL + .004, F], [s * rw, 0, F + .34], mix3(DRESS2, STD, .3), [s, 0, 0]);
      for (let i = 1; i < 4; i++) { const t = i / 4; b.beam([-rw + .02, PL * (1 - t) + .006, F + .34 * t], [rw - .02, PL * (1 - t) + .006, F + .34 * t], .012, mix3(DRESS2, STD, .4), { tz: .006 }); }
    }
    if (P.banners) for (const s of [-1, 1]) banner(b, s * P.banners[0], P.banners[1], F, .15, P.banners[2], s < 0 ? C.banner : C.banner2);
    if (P.loft) {                                             /* 阁楼货门、吊货梁 */
      const ly = WH + .03, lw = .3, lh = .34;
      prism(b, [[-lw / 2 - .05, ly - .05], [lw / 2 + .05, ly - .05], [lw / 2 + .05, ly + lh + .05], [-lw / 2 - .05, ly + lh + .05]], -.01, .03, DRESS);
      b.box(0, ly - .07, F + .03, lw + .16, .035, .08, DRESS2, { nb: true });
      const dk = mix3(C.woodD, C.wood, .2);
      for (let i = 0; i < 4; i++) b.panel(-lw / 2 + lw * (i + .5) / 4, ly, F + .034, lw / 4 - .008, lh, i % 2 ? dk : mix3(dk, OAK, .3));
      for (const y of [ly + .06, ly + lh - .1]) { b.panel(0, y, F + .037, lw - .02, .026, IRON, M); for (const x of [-.1, 0, .1]) b.panel(x, y + .006, F + .039, .014, .014, C.metal, M); }
      const hy = YR - .3, hz = F + .5, fit = cy ? BRASS : IRON;
      b.box(0, hy - .03, F + .2, .08, .08, .48, OAK2);
      b.beam([0, hy - .32, F + .02], [0, hy - .04, F + .24], .045, OAK);
      for (const z of [F + .1, F + .38]) b.box(0, hy - .04, z, .1, .1, .03, fit, M);
      b.box(0, hy - .12, hz - .04, .03, .09, .1, fit, M);
      b.at(0, hy - .1, hz - .04, 0, 1, 0, PI / 2); b.cyl(0, -.035, 0, .05, .07, 8, fit, M); b.pop();
      const ly2 = WH + .12;                                  /* 正吊上去的一捆麻袋 */
      b.beam([0, hy - .14, hz - .04 + .05], [0, ly2 + .25, hz - .02], .012, ROPE);
      b.box(0, ly2 + .22, hz - .02, .05, .04, .04, IRON, M);
      for (const s of [-1, 1]) b.beam([0, ly2 + .23, hz - .02], [s * .09, ly2 + .12, hz - .02], .01, ROPE);
      b.sphere(-.04, ly2 + .06, hz - .02, .085, 6, SACK, { sy: .95 });
      b.sphere(.05, ly2 + .07, hz - .03, .075, 6, SACK2, { sy: 1 });
    }
    /* 两侧：扶壁、窗、货门 */
    for (const s of [1, -1]) {
      const zs = s > 0 ? P.rb : P.lb, ws = s > 0 ? P.rw : P.lw;
      b.at(s * hw, 0, 0, s * PI / 2);
      for (const z of zs || []) buttress(b, -s * z, 0, WH - .12);
      for (const z of ws || []) lancet(b, -s * z, .52, 0, .12, .28, { p: .72 });
      if (s > 0 && P.sd) for (const z of P.sd) { b.at(-z, P.sdY || PL, 0); cartDoor(b, P.sdW || .4, P.sdH || .36, .62, { fr: .065, shut: P.sdShut && P.sdShut(z) }); b.pop(); }
      b.pop();
    }
    if (P.bw) { b.at(0, 0, BK, PI); lancet(b, 0, .55, 0, .13, .3, { p: .72 }); for (const x of P.bbt || []) buttress(b, x, 0, WH - .12); b.pop(); }
    if (P.oc) {                                               /* 山尖一扇小圆窗（四叶） */
      b.at(0, WH + GH * .42, F);
      const rr = .1, pts = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; pts.push([Math.cos(a) * (rr + .035), Math.sin(a) * (rr + .035)]); }
      prism(b, pts, -.01, .025, DRESS);
      const g = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      fan(b, g, .028, WIN, { e: .5 });
      b.panel(0, -rr, .031, .014, rr * 2, mix3(IRON, OAK, .3)); b.at(0, 0, .031); b.quad([-rr, -.007, 0], [rr, -.007, 0], [rr, .007, 0], [-rr, .007, 0], mix3(IRON, OAK, .3)); b.pop();
      b.pop();
    }
    if (P.louvre) louvre(b, 0, YR + .04, P.louvre, cy);
    if (P.sky) skylight(b, [HX, YE], [0, YR], P.sky[0], P.sky[1], .25, .75);
    return { YR, WH, PL };
  }
  function skylight(b, A, B, za, zb, t0, t1) {              /* 2077：坡上一溜黄铜框玻璃天窗（A 檐、B 脊，t0–t1 沿坡范围） */
    const dx = B[0] - A[0], dy = B[1] - A[1];
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const P = (t, l) => [A[0] + dx * t + N[0] * l, A[1] + dy * t + N[1] * l];
    const [xa, ya] = P(t0, .03), [xb, yb] = P(t1, .03), [xa1, ya1] = P(t0, .062), [xb1, yb1] = P(t1, .062);
    qf(b, [xa, ya, za], [xa, ya, zb], [xb, yb, zb], [xb, yb, za], mix3(INNER, C.glow, .3), [N[0], N[1], 0], { e: .25 });
    qf(b, [xa1, ya1, za], [xa1, ya1, zb], [xb1, yb1, zb], [xb1, yb1, za], mix3(C.glass, C.white, .15), [N[0], N[1], 0], { mat: "glass" });
    for (let i = 0; i <= 3; i++) { const z = za + (zb - za) * i / 3; b.beam([xa1, ya1, z], [xb1, yb1, z], .028, BRASS, { mat: "metal", nb: true }); }
    for (const t of [t0, t1]) { const [x, y] = P(t, .064); b.beam([x, y, za - .015], [x, y, zb + .015], .03, BRASS, { mat: "metal", nb: true }); }
    for (const [t, z] of [[t0, za], [t0, zb], [t1, za], [t1, zb]]) { const [x, y] = P(t, .03); b.beam([x, y - .04, z], [x, y + .03, z], .04, mix3(BRASS, OAK, .3), { mat: "metal", nb: true }); }
  }
  function louvre(b, x, y, z, cy) {                         /* 屋脊上的通风小塔：木百叶四面、石板瓦四坡尖帽、风向标；2077 黄铜框玻璃灯笼 */
    const w = .3, h = .26, fit = cy ? BRASS : IRON;
    b.box(x, y - .1, z, w + .06, .12, w + .06, SLD, { top: SL2 });
    if (!cy) {
      b.box(x, y + .02, z, w - .05, h - .02, w - .05, INNER);
      for (let k = 0; k < 4; k++) {
        b.at(x, 0, z, k * PI / 2);
        for (let i = 0; i < 3; i++) { b.at(0, y + .05 + i * .07, w / 2 - .035, 0, 1, -.6); b.box(0, -.012, 0, w - .06, .024, .05, i % 2 ? OAK2 : mix3(OAK2, C.wood, .3), { nb: true }); b.pop(); }
        b.pop();
      }
    } else {
      b.box(x, y + .02, z, w - .05, h - .02, w - .05, mix3(C.glass, C.white, .2), { mat: "glass" });
      b.box(x, y + .03, z, w - .14, h - .06, w - .14, mix3(C.lamp, C.glow, .5), { e: .45 });
    }
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) b.box(x + sx * (w / 2 - .02), y, z + sz * (w / 2 - .02), .045, h + .02, .045, cy ? BRASS : OAK, cy ? M : undefined);
    b.box(x, y + h, z, w + .06, .03, w + .06, cy ? BRASS : OAK2, cy ? M : undefined);
    b.pyramid(x, y + h + .03, z, w + .14, w + .14, .3, SL2);
    const t = y + h + .3;                                     /* 风向标：竖杆、金球、箭头、方位横杆 */
    b.beam([x, t - .04, z], [x, t + .32, z], .016, fit, M);
    b.sphere(x, t + .02, z, .03, 4, C.gold, M);
    b.beam([x - .07, t + .14, z], [x + .07, t + .14, z], .01, fit, M); b.beam([x, t + .14, z - .07], [x, t + .14, z + .07], .01, fit, M);
    b.at(x, t + .24, z, .5);
    b.beam([-.15, 0, 0], [.13, 0, 0], .014, fit, M);
    b.tri([.2, 0, 0], [.12, .045, 0], [.12, -.045, 0], fit, M); b.tri([.2, 0, 0], [.12, -.045, 0], [.12, .045, 0], fit, M);
    b.quad([-.15, -.005, 0], [-.09, -.005, 0], [-.11, .06, 0], [-.17, .06, 0], fit, M); b.quad([-.09, -.005, 0], [-.15, -.005, 0], [-.17, .06, 0], [-.11, .06, 0], fit, M);
    b.pop();
  }

  /* ---------- 圆筒石仓（Lv2） ---------- */
  function silo(b, x, z, r, top, fa, cy) {
    const seg = 12;
    b.cyl(x, 0, z, r + .08, .1, seg, mix3(ST2, STD, .35), { r2: r + .02, top: DRESS2, a0: PI / seg });
    rwall(b, x, z, r, .1, top, seg, .2);
    for (const y of [top * .38, top * .72]) b.cyl(x, y, z, r + .025, .045, seg, DRESS2, { a0: PI / seg, nb: true });
    /* 铁钉小门 */
    b.at(x, 0, z, fa);
    const zw = r - .03, dw = .26, dh = .3;
    archRing(b, dw, dh, .62, .055, zw, zw + .08, { n: 3 });
    b.at(0, .1, zw + .05); fan(b, outline(dw, dh - .1, 0, .62, 3), 0, mix3(C.woodD, C.wood, .25));
    for (const xx of [-.065, 0, .065]) b.panel(xx, 0, .003, .008, dh - .1 + archY(dw, .62, xx) - .02, mix3(C.woodD, [0, 0, 0], .45));
    for (const y of [.05, .2]) { b.panel(0, y, .005, dw - .02, .024, IRON, M); for (const xx of [-.08, 0, .08]) b.panel(xx, y + .006, .007, .013, .013, C.metal, M); }
    b.pop();
    b.box(0, 0, zw + .16, .42, .1, .18, mix3(ST2, STD, .3), { top: DRESS2 });
    b.pop();
    /* 箭孔窗、尖拱小窗 */
    for (const [a, y] of [[fa + 1.0, .95], [fa - 1.1, 1.25], [fa + 2.4, .7]]) { b.at(x, 0, z, a); b.panel(0, y - .02, r + .002, .07, .26, DRESS2); b.panel(0, y, r + .006, .028, .22, INNER); b.panel(0, y + .1, r + .007, .09, .026, INNER); b.pop(); }
    b.at(x, 0, z, fa - .35); lancet(b, 0, top * .76 + .08, r - .004, .11, .2, { p: .72 }); b.pop();
    /* 托石挑檐、锥顶、小旗 */
    for (let i = 0; i < 12; i++) { b.at(x, 0, z, (i + .5) / 12 * TAU); cbox(b, 0, top - .1, r - .02, .075, .09, r + .07, mix3(DRESS2, ST2, .45)); b.pop(); }
    b.cyl(x, top - .02, z, r + .09, .1, seg, DRESS2, { a0: PI / seg });
    const apex = spire(b, x, top + .08, z, r + .08, 1.05, seg, cy);
    /* 锥顶上的上货口：小木门、披檐、吊钩 */
    { const f = .16, yd = top + .08 + 1.05 * f, rd = (r + .08) * .96 * Math.pow(1 - f, 1.1);
      b.at(x, 0, z, fa + .9);
      b.box(0, yd, rd - .1, .17, .2, .22, mix3(SL, STD, .4));
      b.panel(0, yd + .02, rd + .012, .11, .15, mix3(C.woodD, C.wood, .25));
      b.panel(0, yd + .08, rd + .015, .11, .02, IRON, M);
      b.at(0, yd + .2, rd - .1, PI / 2); b.gable(0, 0, 0, .25, .24, .12, SL2, { end: mix3(SL, STD, .4) }); b.pop();
      b.beam([0, yd + .27, rd + .02], [0, yd + .27, rd + .2], .035, OAK2);
      b.beam([0, yd + .25, rd + .18], [0, yd + .02, rd + .18], .01, ROPE);
      b.box(0, yd - .02, rd + .18, .03, .04, .03, IRON, M);
      b.pop(); }
    flag(b, x, apex - .05, z, C.banner2, .5);
    return apex;
  }
  function chute(b, x0, y0, z0, x1, y1, z1) {                /* 木滑槽：从石仓的出料口斜下来，底下接一只麻袋 */
    const d = [x1 - x0, 0, z1 - z0], L = Math.hypot(d[0], d[2]), ux = d[0] / L, uz = d[2] / L, px = -uz * .07, pz = ux * .07;
    qf(b, [x0 - px, y0, z0 - pz], [x0 + px, y0, z0 + pz], [x1 + px, y1, z1 + pz], [x1 - px, y1, z1 - pz], BOARD, [0, 1, 0]);
    for (const s of [-1, 1]) qf(b, [x0 + s * px, y0, z0 + s * pz], [x1 + s * px, y1, z1 + s * pz], [x1 + s * px, y1 + .06, z1 + s * pz], [x0 + s * px, y0 + .06, z0 + s * pz], OAK2, [s * px, 0, s * pz]);
    b.beam([x1 - ux * .1, 0, z1 - uz * .1], [x1 - ux * .1, y1, z1 - uz * .1], .035, OAK);
  }

  /* ---------- 货：木箱、木桶、麻袋 ---------- */
  function crate(b, x, y, z, s, ry, iron) {                 /* 木箱：板条包边；iron 是铁皮包角 */
    b.at(x, y, z, ry || 0, s);
    b.box(0, 0, 0, .3, .26, .3, BOARD, { top: mix3(BOARD, C.woodL, .25) });
    for (let f = 0; f < 4; f++) {
      b.at(0, 0, 0, f * PI / 2);
      const sc2 = iron ? IRON : OAK2, so = iron ? M : undefined;
      for (const sx of [-1, 1]) b.panel(sx * .135, 0, .152, .03, .26, sc2, so);
      b.panel(0, .115, .153, .27, .03, sc2, so);
      b.pop();
    }
    b.pop();
  }
  function barrel(b, x, z, r, h, ry, o) {                   /* 木桶：桶板、铁箍、桶盖 */
    o = o || {};
    b.at(x, o.y || 0, z, ry || 0, 1, o.lie ? PI / 2 : 0);
    if (o.lie) b.push(Isle3D.trs(0, -h / 2, 0));
    const wd = o.col || OAK2;
    b.cyl(0, 0, 0, r * .86, h * .5, 8, wd, { r2: r, nt: true });
    b.cyl(0, h * .5, 0, r, h * .5, 8, mix3(wd, C.wood, .2), { r2: r * .86, nt: true, nb: true });
    for (const t of [.14, .86]) { const rr = r * (.86 + .14 * (t < .5 ? t / .5 : (1 - t) / .5)); b.cyl(0, h * t - .014, 0, rr + .008, .028, 8, IRON, { nt: true, nb: true, mat: "metal" }); }
    b.disc(0, h * .995, 0, r * .86, 8, mix3(wd, C.plank, .45));
    if (o.lie) b.pop();
    b.pop();
  }
  function sack(b, x, y, z, s, ry, col) {                   /* 麻袋：鼓鼓的袋身、扎口 */
    b.at(x, y, z, ry || 0, s);
    const c = col || SACK;
    b.sphere(0, .1, 0, .11, 6, c, { sy: .9 });
    b.cyl(0, .17, 0, .045, .05, 5, mix3(c, OAK2, .2), { r2: .028, nb: true });
    b.cyl(0, .215, 0, .03, .035, 5, c, { r2: .05, nb: true });
    b.pop();
  }
  function barrelRack(b, x, z, ry) {                        /* 木架上横躺着的木桶垛：底下两只、上头一只 */
    b.at(x, 0, z, ry);
    for (const zz of [-.12, .12]) { b.box(0, 0, zz, .46, .05, .06, OAK); for (const s of [-1, 1]) b.box(s * .115, .05, zz, .04, .03, .06, OAK2); }
    barrel(b, -.115, 0, .11, .33, PI / 2, { lie: 1, y: .17 });
    barrel(b, .115, 0, .11, .33, PI / 2, { lie: 1, y: .17, col: mix3(OAK2, C.wood, .25) });
    barrel(b, 0, 0, .11, .33, PI / 2, { lie: 1, y: .35 });
    b.pop();
  }

  /* ---------- 手推车 ---------- */
  function cart(b, x, z, ry, load) {                        /* 两轮木手推车：车厢、辐条轮、铁轴、长车把、支脚；load 车上的货 */
    b.at(x, 0, z, ry);
    const Rw = .15, zw = -.06;
    b.box(0, .19, 0, .36, .03, .52, BOARD);
    for (const s of [-1, 1]) { b.box(s * .17, .22, 0, .025, .1, .52, OAK2); b.box(s * .17, .32, 0, .035, .02, .54, OAK); }
    b.box(0, .22, -.25, .32, .1, .025, OAK2); b.box(0, .22, .25, .32, .06, .025, OAK2);
    for (const s of [-1, 1]) {
      b.beam([s * .15, .17, -.26], [s * .15, .2, .62], .035, OAK, { nb: true });
      b.box(s * .15, .185, .66, .03, .03, .1, mix3(OAK, [0, 0, 0], .2), { nb: true });
      b.beam([s * .15, .18, .2], [s * .15, 0, .24], .03, OAK, { nb: true });
    }
    b.beam([-.15, .18, .26], [.15, .18, .26], .025, OAK2);
    b.beam([-.25, Rw, zw], [.25, Rw, zw], .025, IRON, M);
    for (const s of [-1, 1]) {
      b.at(s * .225, Rw, zw, 0, 1, 0, PI / 2);
      b.torus(0, 0, 0, Rw, .02, 10, 3, OAK2);
      b.cyl(0, -.03, 0, .035, .06, 5, OAK, { nb: true });
      for (let k = 0; k < 3; k++) { const a = k / 3 * PI; b.beam([Math.cos(a) * -Rw, 0, Math.sin(a) * -Rw], [Math.cos(a) * Rw, 0, Math.sin(a) * Rw], .018, OAK2, { nb: true }); }
      b.pop();
    }
    if (load === "sacks") { sack(b, -.06, .2, -.1, .9, .3); sack(b, .05, .2, .12, .85, 1.2, SACK2); }
    else if (load === "barrel") { barrel(b, 0, -.05, .12, .32, .4, { y: .21 }); sack(b, .02, .2, .15, .75, .4, SACK2); }
    b.pop();
  }

  /* ---------- 吊臂 ---------- */
  /* 立式吊臂（当前点为底座中心，臂朝 ja 方向伸 reach）：1994 木立柱、斜撑、横臂、铁箍、绞盘、铁滑轮；2077 黄铜桁架、拉杆、齿轮绞盘、钢索 */
  function crane(b, x, y0, z, ja, H, reach, hangW, cy) {
    const hang = hangW - y0;
    b.at(x, y0, z, ja);
    b.box(0, 0, 0, .38, .14, .38, mix3(ST2, STD, .35), { top: DRESS2 });
    b.box(0, .14, 0, .3, .04, .3, DRESS2);
    const fit = cy ? BRASS : IRON, rope = cy ? STEEL : ROPE, rm = cy ? M : undefined;
    if (!cy) {
      b.beam([0, .18, 0], [0, H + .1, 0], .1, OAK);
      for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) b.beam([sx * .15, .18, sz * .15], [sx * .03, .78, sz * .03], .05, OAK2);
      for (const y of [.75, H * .62, H - .12]) b.box(0, y, 0, .12, .04, .12, IRON, M);
      b.beam([0, H - .02, -.2], [0, H - .02, reach + .06], .08, OAK2);
      b.beam([0, H * .52, .04], [0, H - .06, reach * .58], .055, OAK);
      b.box(0, H - .07, reach * .58, .1, .03, .1, IRON, M);
      b.beam([0, H + .1, 0], [0, H + .02, -.2], .04, OAK);
      b.box(0, H - .08, -.2, .14, .14, .14, mix3(ST2, STD, .2));              /* 臂尾压重石 */
      for (let i = 0; i < 2; i++) { b.box(0, H + .05 + i * .07, 0, .13, .02, .13, OAK2); }
      b.cone(0, H + .11, 0, .07, .1, 4, OAK2, { a0: PI / 4 });
    } else {
      tube(b, [0, .18, 0], [0, H + .26, 0], .045, BRASS, M, 8);
      for (const a of [0, 1, 2, 3]) { const ca = Math.cos(a * PI / 2 + PI / 4), sa = Math.sin(a * PI / 2 + PI / 4); tube(b, [ca * .18, .18, sa * .18], [ca * .03, .8, sa * .03], .02, BRASS, M, 5); }
      for (const y of [.8, H * .62, H - .14]) b.cyl(0, y, 0, .06, .04, 8, mix3(BRASS, IRON, .25), M);
      const yT = H + .02, yB = H - .16, n = 5;              /* 桁架臂：上下两根弦、之字腹杆 */
      tube(b, [0, yT, -.24], [0, yT, reach + .06], .022, BRASS, M, 5);
      tube(b, [-.04, yB, .02], [-.025, yT - .02, reach], .018, BRASS, M, 5); tube(b, [.04, yB, .02], [.025, yT - .02, reach], .018, BRASS, M, 5);
      for (let i = 0; i < n; i++) {
        const t0 = i / n, t1 = (i + 1) / n, zb = .02 + (reach - .02) * t0, zb2 = .02 + (reach - .02) * t1, yb0 = yB + (yT - .02 - yB) * t0, yb1 = yB + (yT - .02 - yB) * t1;
        const s = i % 2 ? 1 : -1;
        b.beam([s * .035 * (1 - t0 * .4), yb0, zb], [0, yT, (zb + zb2) / 2], .012, mix3(BRASS, C.metal, .3), { mat: "metal", nb: true });
        b.beam([0, yT, (zb + zb2) / 2], [-s * .035 * (1 - t1 * .4), yb1, zb2], .012, mix3(BRASS, C.metal, .3), { mat: "metal", nb: true });
      }
      b.beam([0, H + .26, 0], [0, yT + .01, reach * .92], .014, STEEL, M);   /* 拉杆 */
      b.beam([0, H + .26, 0], [0, yT + .01, -.22], .014, STEEL, M);
      b.box(0, yT - .14, -.22, .13, .14, .13, mix3(BRASS, IRON, .45), M);     /* 配重 */
      b.sphere(0, H + .3, 0, .035, 5, BRASS, M);
    }
    /* 臂端滑轮 */
    b.box(0, H - .14, reach, .035, .12, .12, fit, M);
    b.at(0, H - .12, reach, 0, 1, 0, PI / 2); b.cyl(0, -.03, 0, .055, .06, 8, fit, M); b.pop();
    /* 绞盘：卷筒、摇把（2077 齿轮） */
    b.at(0, .5, .1, 0, 1, 0, PI / 2);
    b.cyl(0, -.13, 0, .055, .26, 7, cy ? mix3(BRASS, IRON, .3) : OAK2, rm);
    for (const s of [-1, 1]) b.cyl(0, s * .13 - .01, 0, .085, .02, 7, fit, M);
    if (cy) { b.cyl(0, .15, 0, .1, .025, 10, BRASS, M); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; b.box(Math.cos(a) * .105, .15, Math.sin(a) * .105, .025, .025, .025, BRASS, { mat: "metal", nb: true }); } }
    b.pop();
    for (const s of [-1, 1]) b.beam([s * .15, .5, .02], [s * .15, .5, .2], .04, cy ? BRASS : OAK, rm);
    b.beam([.17, .5, .1], [.17, .62, .2], .018, fit, M); b.beam([.17, .62, .2], [.24, .62, .2], .02, cy ? BRASS : OAK2, rm);
    /* 绳／钢索：卷筒→柱顶→臂端→吊钩 */
    b.beam([0, .55, .15], [0, H - .1, .07], .011, rope, rm);
    b.beam([0, H + .045, .06], [0, H + .045, reach - .02], .011, rope, rm);
    const yh = hang + .3;
    b.beam([0, H - .17, reach + .05], [0, yh + .05, reach + .05], .013, rope, rm);
    b.box(0, yh, reach + .05, .04, .05, .03, fit, M);
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) b.beam([0, yh + .01, reach + .05], [dx * .1, hang + .23, reach + .05 + dz * .1], .008, rope, rm);
    crate(b, 0, hang - .02, reach + .05, .85, .3, cy);
    b.pop();
  }

  /* ---------- 装货站台（Lv3） ---------- */
  function dock(b, x0, x1, z0, z1, h, cy) {                 /* 石砌站台：前、两侧砌石，木板台面、护舷木、系货桩、右头石阶、左前斜坡道 */
    stoneBox(b, x0, x1, 0, h, z0, z1, { nb: true, rh: .14, q: false });
    const n = Math.round((x1 - x0) / .12);
    for (let i = 0; i < n; i++) { const xa = x0 + (x1 - x0) * i / n, w = (x1 - x0) / n; b.box(xa + w / 2, h, (z0 + z1) / 2, w - .008, .025, z1 - z0 + .03, mix3(BOARD, i % 3 ? C.plank : OAK2, .2 + (i % 2) * .15), { nb: true }); }
    b.beam([x0 - .01, h - .02, z1 + .035], [x1 + .01, h - .02, z1 + .035], .07, OAK, { tz: .07 });
    for (let x = x0 + .2; x < x1 - .1; x += .42) b.box(x, h - .2, z1 + .045, .07, .2, .03, OAK2);
    for (const x of [x0 + .12, x1 - .12]) { b.cyl(x, h + .025, z1 - .06, .04, .1, 6, IRON, M); b.cyl(x, h + .12, z1 - .06, .055, .025, 6, IRON, M); }
    const rx0 = x0 + .04, rx1 = x0 + .4, rz = z1 + .42;          /* 斜坡道：木板铺的 */
    qf(b, [rx0, h + .02, z1], [rx1, h + .02, z1], [rx1, .01, rz], [rx0, .01, rz], BOARD, [0, 1, .4]);
    for (let i = 1; i < 5; i++) { const t = i / 5; b.beam([rx0 + .01, (h + .02) * (1 - t) + .01, z1 + (rz - z1) * t], [rx1 - .01, (h + .02) * (1 - t) + .01, z1 + (rz - z1) * t], .015, OAK2, { tz: .01 }); }
    for (const x of [rx0, rx1]) { tf(b, [x, 0, z1], [x, h + .02, z1], [x, 0, rz], mix3(OAK2, BOARD, .3), [x === rx0 ? -1 : 1, 0, 0]); }
  }

  /* ---------- 2077：系泊桅杆、小货运飞艇 ---------- */
  function mast(b, mx, mz, yt) {                             /* 黄铜系泊桅杆：三腿桁架、系泊锥 */
    b.box(mx, 0, mz, .36, .12, .36, DRESS2, { top: DRESS });
    const b0 = .15, b1 = .05, lv = 4, cor = (y, s) => [0, 1, 2].map(k => { const a = k / 3 * TAU + .3; return [mx + Math.cos(a) * s, y, mz + Math.sin(a) * s]; });
    const ys = []; for (let i = 0; i <= lv; i++) ys.push(.12 + (yt - .12) * i / lv);
    const sAt = y => b0 + (b1 - b0) * (y - .12) / (yt - .12);
    for (let k = 0; k < 3; k++) tube(b, cor(.12, b0)[k], cor(yt, b1)[k], .022, BRASS, M, 5);
    for (let i = 1; i <= lv; i++) {
      const A = cor(ys[i], sAt(ys[i])), Bq = cor(ys[i - 1], sAt(ys[i - 1]));
      for (let k = 0; k < 3; k++) { b.beam(A[k], A[(k + 1) % 3], .013, BRASS, { mat: "metal", nb: true }); b.beam(Bq[k], A[(k + 1) % 3], .009, mix3(BRASS, C.metal, .4), { mat: "metal", nb: true }); }
    }
    b.cyl(mx, yt, mz, .13, .035, 8, BRASS, M);
    b.torus(mx, yt + .12, mz, .12, .01, 8, 3, BRASS, M);
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; b.beam([mx + Math.cos(a) * .12, yt + .035, mz + Math.sin(a) * .12], [mx + Math.cos(a) * .12, yt + .12, mz + Math.sin(a) * .12], .01, BRASS, M); }
    b.cyl(mx, yt + .035, mz, .04, .16, 6, BRASS, { r2: .028, mat: "metal" });
  }
  function airship(sb, cy, o) {                              /* 小货运飞艇（局部：艇身沿 x，艇头朝 +x）：帆布气囊、黄铜箍、尾翼、吊舱里装货、尾桨、吊舱下兜一网货 */
    const Lh = .78, r = .28, env = mix3([.78, .73, .63], C.stone, .3), env2 = mix3(env, [.58, .53, .45], .6);
    sb.at(0, 0, 0, 0, [Lh / r, 1, 1]); sb.sphere(0, 0, 0, r, 12, env, { grad: env2 }); sb.pop();
    for (const xp of [-.36, .36]) { const rr = r * Math.sqrt(Math.max(0, 1 - Math.pow(xp / Lh, 2))); sb.at(xp, 0, 0, 0, 1, 0, PI / 2); sb.torus(0, 0, 0, rr + .004, .011, 12, 3, BRASS, M); sb.pop(); }
    sb.at(Lh - .02, 0, 0, 0, 1, 0, -PI / 2); sb.cone(0, 0, 0, .07, .09, 8, BRASS, M); sb.pop();
    for (let k = 0; k < 4; k++) {                            /* 十字尾翼：深蓝帆布、黄铜边 */
      sb.at(-Lh * .72, 0, 0, 0, 1, k * PI / 2 + PI / 4);
      const fin = [[0, r * .5], [-.3, r * .62], [-.36, r * 1.25], [-.1, r * .98]];
      sb.quad([fin[0][0], fin[0][1], 0], [fin[1][0], fin[1][1], 0], [fin[2][0], fin[2][1], 0], [fin[3][0], fin[3][1], 0], C.banner2);
      sb.quad([fin[3][0], fin[3][1], 0], [fin[2][0], fin[2][1], 0], [fin[1][0], fin[1][1], 0], [fin[0][0], fin[0][1], 0], C.banner2);
      sb.beam([fin[2][0], fin[2][1], 0], [fin[3][0], fin[3][1], 0], .012, BRASS, M);
      sb.pop();
    }
    /* 吊舱：船形木舱、黄铜栏杆、圆窗、货箱 */
    const gy = -r - .16, gl = .52, gw = .17;
    sb.box(0, gy, 0, gl, .1, gw, mix3(C.woodD, C.wood, .3), { top: BOARD, mat: "gloss" });
    for (const s of [-1, 1]) {                               /* 船头船尾收尖 */
      sb.at(s * gl / 2, gy, 0, s > 0 ? 0 : PI);
      const hc = mix3(C.woodD, C.wood, .3), T = [.1, .1, 0], B0 = [0, 0, -gw / 2], B1 = [0, 0, gw / 2], U0 = [0, .1, -gw / 2], U1 = [0, .1, gw / 2];
      tf(sb, B0, B1, T, hc, [.3, -1, 0]); tf(sb, U1, B1, T, mix3(hc, C.woodD, .3), [.2, 0, 1]); tf(sb, B0, U0, T, mix3(hc, C.woodD, .3), [.2, 0, -1]); tf(sb, U0, U1, T, BOARD, [0, 1, 0]);
      sb.pop();
    }
    sb.box(.12, gy + .1, 0, .2, .1, gw - .02, mix3(C.banner, C.woodD, .35), { top: mix3(BRASS, C.woodD, .3) });
    for (const s of [-1, 1]) for (const xx of [.07, .17]) { sb.at(xx, gy + .155, s * (gw / 2 - .01), s > 0 ? 0 : PI); sb.panel(0, -.022, .002, .04, .04, WIN, { e: .5 }); sb.pop(); }
    crate(sb, -.08, gy + .1, -.02, .42, .3, true); crate(sb, -.17, gy + .1, .03, .36, -.2);
    for (const s of [-1, 1]) { sb.beam([-gl / 2 + .02, gy + .17, s * gw / 2], [.02, gy + .17, s * gw / 2], .01, BRASS, { mat: "metal", nb: true }); for (const xx of [-gl / 2 + .02, -.12]) sb.beam([xx, gy + .1, s * gw / 2], [xx, gy + .17, s * gw / 2], .009, BRASS, { mat: "metal", nb: true }); }
    for (const [xx, s] of [[-.2, -1], [-.2, 1], [.18, -1], [.18, 1]]) sb.beam([xx, gy + .1, s * (gw / 2 - .01)], [xx * 1.2, -r * .82, s * r * .5], .008, STEEL, M);
    /* 尾桨 */
    sb.beam([-gl / 2 - .02, gy + .05, 0], [-gl / 2 - .12, gy + .05, 0], .02, BRASS, M);
    sb.spin(-gl / 2 - .13, gy + .05, 0, "x", o.bad ? 0 : 5, pb => { pb.box(-.006, -.11, -.012, .012, .22, .024, C.woodD); pb.box(-.006, -.012, -.11, .012, .024, .22, C.woodD); pb.sphere(0, 0, 0, .02, 4, BRASS, M); });
    /* 吊舱下兜着的一网货 */
    const ny = gy - .26;
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) sb.beam([dx * .04, gy, dz * .04], [dx * .1, ny + .12, dz * .1], .007, STEEL, M);
    sb.sphere(0, ny + .04, 0, .11, 6, mix3(SACK, C.woodD, .25), { sy: .85 });
    sb.torus(0, ny + .04, 0, .112, .007, 8, 3, ROPE);
  }

  function build(b, o) {
    R = o.rnd || Math.random;
    const lv = o.lv || 1, cy = !!o.cyber;
    const X0 = [0, .02, .18, .0][lv], Z0 = [0, .02, .06, .1][lv];
    b.at(X0, 0, Z0);
    /* 大仓 */
    const ax = -.2, hw = .74, F = .55, BK = -1.15;
    b.at(ax, 0, 0);
    hall(b, {
      hw, F, BK, WH: 1.15, K: 1.25, cy, door: { w: .72, h: .5, p: .62 }, loft: true, banners: [.6, 1.1, .44], louvre: -.3,
      rb: lv >= 3 ? [.18, -.45] : [.18, -.45, -1.05], lb: lv >= 2 ? [.18] : [.18, -.45, -1.05], rw: [-.14, -.76], lw: [-.14, -.76], bw: true, bbt: [-.42, .42]
    });
    b.at(hw, 0, 0, PI / 2); wallLantern(b, -.42, .82, 0, cy); ivy(b, .62, .08, 0, .45, .9, 24); b.pop();
    b.at(-hw, 0, 0, -PI / 2); ivy(b, lv >= 2 ? .45 : -.25, .08, 0, .45, .8, 16); b.pop();
    ivy(b, -.62, .08, F, .22, .7, 14);
    wallLantern(b, .6, .47, F, cy);
    flagstones(b, -.3, .3, F + .42, F + .9, 8);
    b.pop();

    /* 左前的货堆：木箱、立着的木桶、躺着的木桶垛、麻袋 */
    crate(b, -1.22, 0, .92, 1, .15); crate(b, -.94, 0, 1.0, 1, -.1, true); crate(b, -1.08, .26, .95, .95, .3);
    if (lv < 3) crate(b, -1.38, 0, 1.2, .85, .5);
    barrel(b, -.72, 1.12, .12, .34, .3); barrel(b, -.62, 1.36, .11, .32, 1.1);
    sack(b, -.95, 0, 1.36, 1, .4); sack(b, -.8, 0, 1.52, .9, 1.4, SACK2);
    barrelRack(b, -1.28, 1.48, .5);

    /* 吊臂、手推车 */
    if (lv < 3) {
      crane(b, 1.15, 0, .05, Math.atan2(-.42, .86), 1.85, .96, .5, cy);
      cart(b, .74, .96, .85, "sacks");
      barrel(b, 1.42, .5, .11, .32, .7); sack(b, 1.5, 0, .72, .85, .2, SACK2);
    }
    /* Lv2：圆筒石仓 */
    if (lv >= 2) {
      const sx = -1.42, sz = -.6, sr = .4;
      silo(b, sx, sz, sr, 1.55, .35, cy);
      rivy(b, sx, sz, sr, -1.0, 1.3, .1, 1.1, 30);
      chute(b, sx + .27, .78, sz + .3, sx + .55, .3, sz + .78);
      sack(b, sx + .58, 0, sz + .93, .9, .2); sack(b, sx + .76, 0, sz + .84, .85, 1.0, SACK2);
    }
    /* Lv3：第二座仓、装货站台、站台上的吊臂 */
    if (lv >= 3) {
      const bx = 1.3, bz = -.95, bhw = .4, bl = .5, dh = .28, z0 = bz + bhw, z1 = z0 + .46;
      b.at(bx, 0, bz, -PI / 2);
      hall(b, {
        hw: bhw, F: bl, BK: -bl, WH: 1.12, K: 1.25, cy, oc: true,
        rb: [], lb: [-.35, .35], lw: [0], sd: [-.24, .24], sdY: dh, sdW: .32, sdH: .34, sdShut: z => z < 0, bw: true, bbt: [], sky: cy ? [-.36, .36] : null
      });
      b.at(-bhw, 0, 0, -PI / 2); ivy(b, .3, .08, 0, .4, .8, 14); b.pop();
      b.pop();
      dock(b, bx - bl, bx + bl, z0, z1, dh, cy);
      const dz = (z0 + z1) / 2;
      crate(b, bx + .3, dh + .025, dz + .02, .85, .2); crate(b, bx + .42, dh + .025, dz + .05, .7, -.3, true); crate(b, bx + .34, dh + .245, dz + .03, .7, -.2);
      sack(b, bx - .3, dh + .02, dz + .1, .85, .5); barrel(b, bx - .42, dz - .02, .1, .3, .2, { y: dh + .025 });
      crane(b, bx + .02, dh + .025, dz + .02, 0, 1.6, .74, .5, cy);
      cart(b, bx - .02, z1 + .62, -1.45, "barrel");
    }

    /* 2077：系泊桅杆、小货运飞艇、猫球灯 */
    if (cy) {
      const mx = -1.45, mz = -1.48, yt = 2.6;
      mast(b, mx, mz, yt);
      const fn = sb => {
        sb.at(0, 0, 0, PI);
        airship(sb, cy, o);
        sb.pop();
        sb.beam([-.84, 0, 0], [-1.06, -.12, 0], .01, STEEL, M);
      };
      const sx = mx + 1.08, sy = yt + .22;
      if (o.bad) { b.at(sx, sy, mz); fn(b); b.pop(); } else b.bob(sx, sy, mz, .045, .7, fn);
      b.emit(ax - .66, 1.05, F + .5, "cat", 1, 1);
      if (lv >= 2) b.emit(-1.42 + .62, 1.2, -.6 + .5, "cat", 1, 1);
    }
    b.pop();
  }
  build.h = o => o.cyber ? 3.4 : ((o.lv || 1) >= 2 ? 3.35 : 3.0);
  Isle3D.FAC["货仓"] = build;
})();
