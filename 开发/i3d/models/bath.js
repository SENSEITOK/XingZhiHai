/* 浴场（1994 浴场 / 2077 温泉）：中前一汪乳白的热泉，后边一道三开间尖拱石廊，Lv2 右后起一座八角热汤房、左前一口寒泉，Lv3 热泉改成梯台、修边换大理石、左后起一根排汽石烟囱兼钟楼。
   布局：主泉在 (0, .36)；石廊贴后边，z −1.52…−.74，x −1.06….56；八角汤房在 (1.17, −.74)；寒泉在 (−1.24, .3)；Lv3 烟囱钟楼在 (−1.36, −1.12)。
   1994 Lv1：热泉——一圈不规则的泉池（十个顶点），乳白的温泉水（C.water 往 C.cream 混 .25，粼粼的水材质），粗石泉沿压一圈圆卵石；
             泉后一座假山石堆，长着蕨，石堆里伸出一只料石出水嘴，一缕水往下淌进泉里；泉上两处蒸汽。
             泉外一圈不规则的石板铺地。后面三开间尖拱石廊：料石台基、方墩柱带柱头、尖拱料石券（楔石、拱心石），拱肩到檐口一道托石檐，
             两头石山墙（错缝砌、顶上小尖饰），后墙两扇尖拱小窗；单坡石板瓦顶，屋顶后沿一道压顶脊。
             廊下：后墙前一条石长凳、毛巾架（木架上搭着几条毛巾）、一摞木浴桶，两盏吊着的铁提灯；墙根常春藤。泉右一根铁灯柱，泉前左一条木长凳。
   1994 Lv2：右后一座八角热汤房：石台基、八面错缝砌的石鼓身（墙高 1.1）、转角扶壁、尖拱烛光窗、尖拱铁钉门和壁灯、托石檐口；
             顶上带肋的石板瓦尖穹顶（料石肋），顶上一座开敞的小灯亭和尖顶饰，灯亭冒一缕蒸汽。
             左前加一口寒泉：水色更浅更蓝（C.seaB 往 C.white 混 .4），没有蒸汽，背后几块长苔的石头和蕨；一道石渠把寒泉的水往下引进热泉（水材质 k=2，往下淌）。
   1994 Lv3：热泉改成三层梯台：后上两座抬高的小泉台，前沿各一段跌水（k=2 的竖水面），最上一层由一块大理石碑上的出水嘴供水；
             泉边修边全换浅色大理石（C.white 往 C.stone 混 .3），主泉前沿两级大理石台阶没进水里。
             左后起一根细高的排汽石烟囱兼钟楼：方石塔身、两道腰线、尖拱小窗，上段四面开小钟洞挂一口铜钟，托石檐口上一截八角烟囱、两只陶烟囱帽，冒蒸汽。
   2077（温泉）：同一套石头底子。石廊顶换黄铜框玻璃，成了冬园廊（廊下添两盆棕榈、两只吊蕨篮）；出水嘴换黄铜猫头（猫球的头，小小的）；
             泉边一根黄铜细杆托一盏浮着的猫球灯，假山石上再蹲一只微亮的小猫球灯；石廊后墙顶立一只黄铜小飞艇风标（不转）。
             Lv2：穹顶的肋、灯亭换黄铜，灯亭顶上换成黄铜小飞艇风标。Lv3：钟楼铜钟换黄铜，烟囱帽换黄铜风帽。
   不画人、不放任何人形；不加霓虹、全息、罩子。
   待修：渲染器统一压暗；模型里泉水发浑、漂着落叶，不冒蒸汽，木桶散倒一地，毛巾架歪倒、毛巾掉在地上，灯柱歪斜，石廊一块拱心石掉在地上，猫球灯熄灭，钟歪挂着。
   前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6), VOID = [.05, .045, .055];
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55);
  const SLD = mix3(SL, [.08, .08, .1], .4), SLM = mix3(SL, C.ivy, .45);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), IRON = mix3(C.iron, [.1, .1, .12], .2), BRONZE = mix3(C.gold, C.wood, .38);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4), TOPW = mix3(C.plank, C.woodL, .3);
  const DOORW = mix3(C.woodD, C.wood, .25), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const MULL = mix3(IRON, OAK, .3);
  const MARB = mix3(C.white, C.stone, .3), MARB2 = mix3(mix3(MARB, C.stone, .6), [.7, .66, .6], .2), MARBD = mix3(MARB, STD, .5);   /* 浅色大理石（顶面），立面压暗一档 */
  const HOTW = mix3(mix3(C.water, C.cream, .45), [.45, .78, .74], .3), COLDW = mix3(C.seaB, C.white, .4);   /* 乳白泛青的热泉、浅蓝的寒泉 */
  const MURK = mix3(HOTW, [.34, .38, .26], .55), MURKC = mix3(COLDW, [.34, .4, .3], .5);                 /* 待修：泉水发浑 */
  const BED = mix3(C.rockD, [.16, .22, .24], .5), BEDC = mix3(C.rockD, [.2, .3, .36], .45);              /* 泉底 */
  const ROCK = mix3(C.rock, ST2, .4), ROCK2 = mix3(C.rock2, ST, .35), ROCKD = mix3(C.rockD, STD, .3), MOSS = mix3(C.ivy, C.leafD, .4);
  const GLASS = mix3(C.glass, [.78, .88, .84], .3);
  const FLAG = mix3(C.stone, ST2, .35), FLAGD = mix3(ST2, STD, .45);
  const TOWEL = [mix3(C.cream, C.white, .4), mix3(C.cloth2, C.stone, .5), mix3(C.cream, C.hay, .25), mix3(C.banner, C.stone, .45)];
  const TERRA = [.66, .4, .29], SOIL = mix3(C.soil, [.24, .17, .12], .35);
  const POT = mix3(C.roofR, STD, .45);
  const CATC = mix3(C.cream, C.stone, .15), CATG = mix3(C.cream, C.glow, .3);
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

  /* ---------- 基本面片 ---------- */
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
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
  function rod(b, a, c, t, col, o) {                        /* 细杆：只有四个侧面（肋、框、绳，省掉两头端面） */
    const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const y = [d[0] / L, d[1] / L, d[2] / L], r = Math.abs(y[1]) < .95 ? [-y[2], 0, y[0]] : [0, y[2], -y[1]], rl = Math.hypot(r[0], r[1], r[2]);
    const x = [r[0] / rl, r[1] / rl, r[2] / rl], z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    b.push(new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1]));
    const h = t / 2, Q = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (let i = 0; i < 4; i++) { const p = Q[i], q = Q[(i + 1) % 4]; b.quad([q[0], 0, q[1]], [p[0], 0, p[1]], [p[0], L, p[1]], [q[0], L, q[1]], col, o); }
    b.pop();
  }
  function leaf(b, x, y, z, a, len, wid, lift, col, o) {    /* 一片叶子：菱形 */
    const ca = Math.cos(a), sa = Math.sin(a), px = -sa, pz = ca;
    const B0 = [x, y, z], T = [x + ca * len, y + lift, z + sa * len], L = [x + ca * len * .45 + px * wid, y + Math.max(lift * .7, len * .25), z + sa * len * .45 + pz * wid], Rr = [x + ca * len * .45 - px * wid, y + Math.max(lift * .7, len * .25), z + sa * len * .45 - pz * wid];
    tf(b, B0, L, T, col, [0, 1, 0], o); tf(b, B0, T, Rr, col, [0, 1, 0], o);
  }

  /* ---------- 砌石 ---------- */
  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .58 + r * .42);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .3); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .3);
    if (r > .9) c = mix3(c, STD, .45); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.32, (.9 - y) * .32));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .12 : .22) : 0, q1 = o.qr ? ((j + ph) % 2 ? .22 : .12) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .2 + R() * .24; }
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
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块：前、左、右、底 */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function archRing(b, w, h, p, fr, z0, z1, skip) {         /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、券底、拱心石；skip(i) 缺哪几块拱石 */
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
      if (skip && skip(i)) continue;
      const c = i % 2 ? DRESS : DRESS2, A = ai[i], B = ai[i + 1], Ao = ao[i], Bo = ao[i + 1];
      qf(b, [A[0], h + A[1], z1], [Ao[0], h + Ao[1], z1], [Bo[0], h + Bo[1], z1], [B[0], h + B[1], z1], c, [0, 0, 1]);
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      qf(b, [A[0], h + A[1], z0], [B[0], h + B[1], z0], [B[0], h + B[1], z1], [A[0], h + A[1], z1], rev, [-mx, -my - .05, 0]);
      qf(b, [Ao[0], h + Ao[1], z0], [Bo[0], h + Bo[1], z0], [Bo[0], h + Bo[1], z1], [Ao[0], h + Ao[1], z1], DRESS2, [mx, my + .05, 0]);
    }
    if (!skip || !skip(-1)) { const kt = archY(w + fr * 2, p, 0); b.box(0, h + kt - .07, (z0 + z1) / 2 + .008, .07, .1, z1 - z0 + .016, DRESS, { nb: true }); }
  }
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff, n) {   /* 尖拱洞上方的拱肩（前后两面＋拱腹），x 以拱心为 0 */
    const pts = archPts(w, p, n || 4);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }

  /* ---------- 窗、门、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .55, fc = o.frame || DRESS, n = w > .17 ? 3 : 2;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p, n), -.03, .02, fc);
    if (o.dark) fan(b, outline(w, h, 0, p, n), .024, INNER);
    else fan(b, outline(w, h, 0, p, n), .024, WIN, { e });
    if (!o.dark) b.panel(0, h * .55, .027, w, .016, o.cy ? BRASS : MULL, o.cy ? GL : undefined);
    if (!o.nosill) b.box(0, -fr - .03, 0, w + fr * 2 + .04, .03, .08, DRESS, { nb: true });
    if (o.hood) {                                            /* 滴水线 */
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .05, p, 3), zh = .035;
      for (let i = 0; i < ai.length - 1; i++) {
        b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
        b.quad([ao[i + 1][0], h + ao[i + 1][1], -.01], [ao[i][0], h + ao[i][1], -.01], [ao[i][0], h + ao[i][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS2);
      }
    }
    b.pop();
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    fan(b, outline(w, h, 0, p, 4), 0, DOORW);
    const n = 4;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, DARK); }
    for (const y of [h * .2, h * .66]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 3; i++) b.panel(-w / 2 + .05 + i * (w - .1) / 2, y + .006, .0125, .016, .016, C.metal, M);
    }
    b.at(w * .24, h * .55, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .024, .007, 8, 3, IRON, M); b.pop();
  }
  function lantern(b, x, y, z, cy, off) {                   /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, off ? mix3(C.lamp, DARK, .6) : C.lamp, off ? { r2: .045, nt: true, nb: true } : { r2: .045, e: .62, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .042, y + .02, z + Math.sin(a) * .042], [x + Math.cos(a) * .05, y + .13, z + Math.sin(a) * .05], .009, fr, fo); }
    b.cyl(x, y + .13, z, .06, .016, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .146, z, .056, .07, 6, fr, Object.assign({ nb: true }, fo));
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .04, .1, .02, fr, fo);
    b.beam([x, y + .1, z], [x, y + .1, z + .16], .018, fr, fo);
    b.beam([x, y + .02, z], [x, y + .1, z + .1], .012, fr, fo);
    b.beam([x, y + .1, z + .15], [x, y + .04, z + .15], .009, fr, fo);
    lantern(b, x, y - .2, z + .15, cy);
  }
  function lampPost(b, x, z, cy, bad) {                     /* 泉边铁灯柱：石座、细柱、横担、一盏提灯；待修时歪斜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, 0, z, .13, .07, .13, DRESS2, { nb: true });
    b.at(x, .07, z, 0, 1, bad ? .22 : 0, bad ? -.12 : 0);
    b.cyl(0, 0, 0, .028, .62, 6, fr, Object.assign({ r2: .02 }, fo));
    b.cyl(0, .05, 0, .04, .05, 6, fr, Object.assign({ r2: .03 }, fo));
    b.beam([-.07, .62, 0], [.07, .62, 0], .014, fr, fo);
    b.cyl(0, .64, 0, .03, .035, 6, fr, Object.assign({ nb: true }, fo));
    lantern(b, 0, .67, 0, cy, bad);
    b.pop();
  }
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, 0, z, .045, .07, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .02, BRASS, GL);
    b.beam([x, h, z], [x + .1, h + .05, z], .015, BRASS, GL);
    b.beam([x + .1, h + .05, z], [x + .15, h + .02, z], .013, BRASS, GL);
    b.sphere(x, h + .01, z, .024, 4, BRASS, GL);
    if (!off) b.emit(x + .15, h - .1, z, "cat", 1, .85);
  }
  function catBall(b, x, y, z, ry, s, col, o) {             /* 猫球：扁圆身子、两只尖耳、两只眼缝（约 70 三角形）；o 给材质或微亮 */
    b.at(x, y, z, ry, s);
    b.sphere(0, 0, 0, 1, 7, col, Object.assign({ sy: .7 }, o || {}));
    for (const sx of [-1, 1]) { b.at(sx * .48, .52, .1, 0, 1, -.15, sx * -.4); b.cone(0, 0, 0, .26, .5, 3, col, Object.assign({ a0: PI / 6, nb: true }, o || {})); b.pop(); }
    for (const sx of [-1, 1]) { b.at(sx * .32, .1, .92, sx * .35); b.panel(0, 0, 0, .2, .07, [.2, .17, .16]); b.pop(); }
    b.pop();
  }
  function airship(b, x, y, z, ry) {                         /* 2077：黄铜细杆上一只小飞艇风标（静止）：奶白气囊、黄铜环箍、吊舱、尾鳍 */
    rod(b, [x, y - .03, z], [x, y + .1, z], .014, BRASS, GL);
    b.at(x, y + .14, z, ry);
    b.at(0, 0, 0, 0, [1, .4, .4]); b.sphere(0, 0, 0, .1, 6, mix3(C.cream, C.stone, .3), GL); b.pop();
    for (const dx of [-.04, .04]) { b.at(dx, 0, 0, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .04, .005, 8, 3, BRASS, GL); b.pop(); }
    b.box(0, -.062, 0, .06, .018, .02, BRASS, GL);
    b.box(-.1, -.006, 0, .035, .05, .005, BRASS, GL);
    b.box(-.1, -.006, 0, .035, .005, .05, BRASS, GL);
    b.pop();
  }
  function pinnacle(b, x, y, z, w, h) {                      /* 小尖塔：方墩、四面小山花、尖顶、顶上一颗石球 */
    const hb = h * .42, c = mix3(DRESS2, ST, .3);
    b.box(x, y, z, w, hb, w, c, { nb: true, top: DRESS2 });
    for (let k = 0; k < 4; k++) { b.at(x, y + hb, z, k * PI / 2); b.tri([-w / 2, 0, w / 2 + .003], [w / 2, 0, w / 2 + .003], [0, w * .55, w / 2 + .003], DRESS); b.pop(); }
    b.pyramid(x, y + hb, z, w * .82, w * .82, h - hb, DRESS2);
    b.sphere(x, y + h, z, w * .16, 4, DRESS);
  }
  function finial(b, x, y, z, cy) { rod(b, [x, y - .06, z], [x, y + .2, z], .02, cy ? BRASS : IRON, cy ? GL : M); b.sphere(x, y + .06, z, .032, 4, cy ? BRASS : BRONZE, cy ? GL : M); }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function fern(b, x, y, z, s) {                             /* 一丛蕨：六七片拱起的长叶 */
    const n = 6 + (R() < .5 ? 1 : 0), a0 = R() * TAU, col = mix3(C.leaf, C.leafD, .3 + R() * .4);
    for (let i = 0; i < n; i++) leaf(b, x, y, z, a0 + i / n * TAU + (R() - .5) * .4, s * (.8 + R() * .4), s * .2, s * .3, mix3(col, C.leaf2, R() * .35), { k: 1.15 });
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，零星几片长青苔 */
    o = o || {};
    const dx = B[0] - A[0], dy = B[1] - A[1], nb = o.nb || Math.max(2, Math.round(Math.hypot(dx, dy) / .15)), cw = o.cw || .26;
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .02, cols = o.cols || [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + (i < nb - 1 ? .035 / Math.hypot(dx, dy) : 0), xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .06; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
      for (let k = 0; k < edges.length - 1; k++) {
        const base = i % 2 ? cols[0] : cols[1], r = R();
        const c = r < .18 ? mix3(base, cols[2], .55) : r > .93 ? mix3(base, SLM, .7) : r > .84 ? mix3(base, [.5, .52, .56], .16) : mix3(base, cols[2], r * .25);
        qf(b, [xa2, ya2, edges[k]], [xa2, ya2, edges[k + 1]], [xb, yb, edges[k + 1]], [xb, yb, edges[k]], c, [N[0], N[1], 0]);
      }
      if (!o.nolip) qf(b, [xa, ya, z0], [xa, ya, z1], [xa2, ya2, z1], [xa2, ya2, z0], cols[2], dn);
    }
    if (!o.nounder) qf(b, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], o.under || mix3(OAK, [0, 0, 0], .2), [-N[0], -N[1], 0]);
    if (!o.nofascia) b.beam([A[0] + N[0] * .005, A[1] - .03, z0], [A[0] + N[0] * .005, A[1] - .03, z1], .035, OAK);
  }

  /* ---------- 杂物 ---------- */
  function tub(b, x, y, z, r, h, ry, tip) {                  /* 木浴桶：外撇的桶身、一道铁箍、桶里一圈暗；tip 横倒 */
    b.at(x, tip ? y + r : y, z, ry || 0, 1, 0, tip ? PI / 2 : 0);
    if (tip) b.at(0, -h / 2, 0);
    b.cyl(0, 0, 0, r * .86, h, 8, OAK2, { r2: r, nt: true, bot: OAK });
    b.cyl(0, h * .62, 0, r * .96 + .006, .018, 8, IRON, { r2: r * .98 + .006, nt: true, nb: true, mat: "metal" });
    b.disc(0, h - .012, 0, r * .9, 8, mix3(OAK, [0, 0, 0], .35));
    if (tip) b.pop();
    b.pop();
  }
  function bench(b, x, z, L, ry, col, legc) {               /* 长凳：座板、两只板腿 */
    b.at(x, 0, z, ry || 0);
    b.box(0, .17, 0, L, .03, .11, col || OAK2, { top: col ? mix3(col, C.white, .15) : TOPW });
    for (const s of [-1, 1]) b.box(s * (L / 2 - .08), 0, 0, .035, .17, .09, legc || OAK);
    b.pop();
  }
  function towelRack(b, x, y, z, ry, bad) {                  /* 毛巾架：两副 A 字腿、两根横杆，搭着几条毛巾；待修时歪倒、毛巾掉在地上 */
    reseed(17);
    b.at(x, y, z, ry, 1, bad ? .95 : 0);
    const W = .42, H = .5;
    for (const s of [-1, 1]) { b.beam([s * W / 2, 0, -.08], [s * W / 2, H, 0], .022, OAK2); b.beam([s * W / 2, 0, .08], [s * W / 2, H, 0], .022, OAK2); }
    b.beam([-W / 2 - .02, H, 0], [W / 2 + .02, H, 0], .022, OAK);
    b.beam([-W / 2, .2, 0], [W / 2, .2, 0], .016, OAK);
    const xs = [-.13, .01, .14];
    xs.forEach((tx, i) => {
      if (bad && i === 1) return;
      const c = TOWEL[i % TOWEL.length], d = .23 + R() * .06;
      b.box(tx, H - d, .018, .11, d, .008, c, { nb: true });
      b.box(tx, H - d * .8, -.018, .11, d * .8, .008, c, { nb: true });
      b.box(tx, H, 0, .11, .012, .045, mix3(c, C.white, .15));
      if (i === 1) for (let k = 0; k < 3; k++) b.panel(tx, H - d + .03 + k * .05, .0225, .11, .012, mix3(c, C.white, .4));
    });
    b.pop();
    if (bad) { b.at(x + .18, y + .006, z + .22, .6); b.box(0, 0, 0, .14, .01, .24, TOWEL[1]); b.pop(); }
  }
  function rock(b, x, y, z, s, sy, ry, col) {                /* 一块石头：顶上长一点苔，往下渐暗 */
    b.at(x, y, z, ry || 0, [s, s * sy, s * (.82 + R() * .3)]);
    b.sphere(0, 0, 0, 1, 6, mix3(col, MOSS, .35 + R() * .2), { grad: mix3(col, ROCKD, .4) });
    b.pop();
  }
  function pottedPalm(b, x, y, z, s) {                       /* 2077 冬园廊：陶盆里一棵小棕榈 */
    b.cyl(x, y, z, .06 * s, .1 * s, 6, TERRA, { r2: .075 * s, top: SOIL });
    b.beam([x, y + .1 * s, z], [x + .02 * s, y + .45 * s, z], .022 * s, mix3(C.wood, C.woodD, .4));
    for (let k = 0; k < 7; k++) leaf(b, x + .02 * s, y + .45 * s, z, k / 7 * TAU + .3, .22 * s, .05 * s, -.07 * s, mix3(C.leaf2, C.leafD, R() * .5), { k: 1.12 });
  }
  function fernBasket(b, x, y, z, L) {                       /* 2077 冬园廊：玻璃顶下吊着的一只蕨篮 */
    rod(b, [x, y, z], [x, y - L, z], .008, IRON, M);
    b.cyl(x, y - L - .07, z, .03, .07, 6, OAK2, { r2: .065, top: SOIL });
    for (let k = 0; k < 7; k++) leaf(b, x, y - L - .005, z, k / 7 * TAU, .13, .03, -.1, mix3(C.leaf, C.leafD, R() * .6), { k: 1.15 });
  }

  /* ================= 尺寸 ================= */
  const PX = 0, PZ = .36, PRX = .74, PRZ = .56;                          /* 主泉 */
  const PJ = [1, .93, 1.04, .96, 1.03, .92, 1.05, .97, .94, 1.03];
  const LX0 = -1.06, LX1 = .56, LZB = -1.52, LZW = -1.42, LZF = -.81, LZP = -.95, LY0 = .08;   /* 石廊：后墙外皮、后墙内皮、廊前沿、墩柱后沿、台基高 */
  const EZ = -.84, EY = 1.05, RZ = -1.58, RY = 1.45, RK = (RY - EY) / (EZ - RZ);               /* 单坡：檐口（藏在小山花后面）、屋脊 */
  const roofY = z => EY + (EZ - z) * RK;
  const BAYS = [-.75, -.25, .25], BS = .38, SPRING = .6, AP = .7, ATOP = 1.0;
  const OX = 1.17, OZ = -.74, OR = .58, ORY = -.5;                         /* 八角汤房 */
  const CX = -1.24, CZ = .3;                                              /* 寒泉 */
  const TWX = -1.36, TWZ = -1.12, TWS = .38;                              /* 烟囱钟楼 */

  /* ---------- 泉池：不规则泉沿（内壁、沿顶、外壁）、泉底、水面 ---------- */
  function ring(cx, cz, rx, rz, jit, a0) { return jit.map((j, i) => { const a = a0 + i / jit.length * TAU; return [cx + Math.cos(a) * rx * j, cz + Math.sin(a) * rz * j]; }); }
  function basin(b, pts, cx, cz, o) {                        /* o: yW 水面、yR 沿顶、yF 泉底、yB 外壁脚、rw 沿宽、w 水色、bed 泉底色、rim(i) 沿色、out(i) 外壁色 */
    const n = pts.length, out = pts.map(([x, z]) => { const dx = x - cx, dz = z - cz, l = Math.hypot(dx, dz) || 1; return [x + dx / l * o.rw, z + dz / l * o.rw]; });
    const W = { mat: "water", k: 3 };
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = pts[i], B = pts[j], Ao = out[i], Bo = out[j], mx = (A[0] + B[0]) / 2 - cx, mz = (A[1] + B[1]) / 2 - cz;
      tf(b, [cx, o.yW, cz], [A[0], o.yW, A[1]], [B[0], o.yW, B[1]], o.w, [0, 1, 0], W);
      tf(b, [cx, o.yF, cz], [A[0], o.yF, A[1]], [B[0], o.yF, B[1]], o.bed, [0, 1, 0]);
      qf(b, [A[0], o.yF, A[1]], [B[0], o.yF, B[1]], [B[0], o.yR, B[1]], [A[0], o.yR, A[1]], o.inner || mix3(o.bed, STD, .4), [-mx, 0, -mz]);
      qf(b, [A[0], o.yR, A[1]], [B[0], o.yR, B[1]], [Bo[0], o.yR, Bo[1]], [Ao[0], o.yR, Ao[1]], o.rim(i), [0, 1, 0]);
      qf(b, [Ao[0], o.yB, Ao[1]], [Bo[0], o.yB, Bo[1]], [Bo[0], o.yR, Bo[1]], [Ao[0], o.yR, Ao[1]], o.out ? o.out(i) : o.rim(i), [mx, 0, mz]);
    }
    return out;
  }
  function rockyBasin(b, pts, cx, cz, o) {                   /* 天然泉：泉沿是一块块高低不一的粗石（沿顶带一道外倒角），石块之间露出侧面 */
    const n = pts.length, out = pts.map(([x, z]) => { const dx = x - cx, dz = z - cz, l = Math.hypot(dx, dz) || 1; return [x + dx / l * o.rw, z + dz / l * o.rw]; });
    const mid = pts.map(([x, z]) => { const dx = x - cx, dz = z - cz, l = Math.hypot(dx, dz) || 1; return [x + dx / l * o.rw * .55, z + dz / l * o.rw * .55]; });
    const hs = pts.map(() => o.yR + (R() - .35) * .05), W = { mat: "water", k: 3 }, cols = pts.map((p, i) => o.rim(i));
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, A = pts[i], B = pts[j], Ao = out[i], Bo = out[j], Am = mid[i], Bm = mid[j], h = hs[i], c = cols[i];
      const mx = (A[0] + B[0]) / 2 - cx, mz = (A[1] + B[1]) / 2 - cz;
      tf(b, [cx, o.yW, cz], [A[0], o.yW, A[1]], [B[0], o.yW, B[1]], o.w, [0, 1, 0], W);
      tf(b, [cx, o.yF, cz], [A[0], o.yF, A[1]], [B[0], o.yF, B[1]], o.bed, [0, 1, 0]);
      qf(b, [A[0], o.yF, A[1]], [B[0], o.yF, B[1]], [B[0], h, B[1]], [A[0], h, A[1]], mix3(c, o.bed, .45), [-mx, 0, -mz]);
      qf(b, [A[0], h, A[1]], [B[0], h, B[1]], [Bm[0], h, Bm[1]], [Am[0], h, Am[1]], c, [0, 1, 0]);
      qf(b, [Am[0], h, Am[1]], [Bm[0], h, Bm[1]], [Bo[0], h - .035, Bo[1]], [Ao[0], h - .035, Ao[1]], mix3(c, ROCKD, .15), [mx, 1, mz]);
      qf(b, [Ao[0], 0, Ao[1]], [Bo[0], 0, Bo[1]], [Bo[0], h - .035, Bo[1]], [Ao[0], h - .035, Ao[1]], mix3(c, ROCKD, .35), [mx, 0, mz]);
      const h2 = hs[j];                                          /* 和下一块石头的高差：露出的侧面 */
      if (Math.abs(h2 - h) > .004) {
        const hi = h > h2 ? i : j, lo = h > h2 ? h2 : h, top = Math.max(h, h2), tx = B[0] - A[0], tz = B[1] - A[1], s = h > h2 ? 1 : -1;
        qf(b, [B[0], lo, B[1]], [Bm[0], lo, Bm[1]], [Bm[0], top, Bm[1]], [B[0], top, B[1]], mix3(cols[hi], ROCKD, .25), [tx * s, 0, tz * s]);
        qf(b, [Bm[0], lo - .035, Bm[1]], [Bo[0], lo - .035, Bo[1]], [Bo[0], top - .035, Bo[1]], [Bm[0], top, Bm[1]], mix3(cols[hi], ROCKD, .3), [tx * s, 0, tz * s]);
      }
    }
    return { out, hs };
  }
  function cascade(b, A, B, cx, cz, yTop, yBot, off, col) {  /* 泉台前沿的一段跌水：沿顶漫过去，贴着外壁往下淌 */
    const n = d => { const dx = d[0] - cx, dz = d[1] - cz, l = Math.hypot(dx, dz) || 1; return [dx / l, dz / l]; }, na = n(A), nb = n(B);
    const W2 = { mat: "water", k: 2 };
    const A1 = [A[0] + na[0] * off, A[1] + na[1] * off], B1 = [B[0] + nb[0] * off, B[1] + nb[1] * off];
    qf(b, [A[0], yTop + .008, A[1]], [B[0], yTop + .008, B[1]], [B1[0], yTop + .004, B1[1]], [A1[0], yTop + .004, A1[1]], col, [0, 1, 0], W2);
    qf(b, [A1[0], yBot, A1[1]], [B1[0], yBot, B1[1]], [B1[0], yTop + .004, B1[1]], [A1[0], yTop + .004, A1[1]], col, [(na[0] + nb[0]), .2, (na[1] + nb[1])], W2);
  }
  function leaves(b, cx, y, cz, rx, rz, n) {                  /* 待修：水面漂着的落叶 */
    for (let i = 0; i < n; i++) {
      const a = R() * TAU, r = Math.sqrt(R()) * .8, x = cx + Math.cos(a) * rx * r, z = cz + Math.sin(a) * rz * r, s = .025 + R() * .02;
      b.at(x, y + .006, z, R() * TAU); b.quad([-s, 0, 0], [0, 0, s * .6], [s, 0, 0], [0, 0, -s * .6], mix3([.5, .36, .18], [.36, .3, .16], R())); b.pop();
    }
  }

  /* ================= 主泉 ================= */
  function poolPts(n) {                                      /* 主泉的不规则轮廓：两道低频起伏加一点抖动 */
    reseed(9);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = .15 + i / n * TAU, f = 1 + .09 * Math.sin(2 * a + .7) + .06 * Math.sin(3 * a + 2.1) + (R() - .5) * .07;
      pts.push([PX + Math.cos(a) * PRX * f, PZ + Math.sin(a) * PRZ * f]);
    }
    return pts;
  }
  function mainPool(b, o) {
    const lv = o.lv, bad = o.bad, marble = lv >= 3;
    const yW = .075, yR = marble ? .14 : .12, w = bad ? MURK : HOTW;
    let out;
    if (!marble) {
      const pts = poolPts(14);
      reseed(10);
      const r = rockyBasin(b, pts, PX, PZ, { yW, yR, yF: .012, rw: .1, w, bed: BED, rim: () => mix3(mix3(sc(.6), ROCK, .35 + R() * .3), R() < .25 ? MOSS : ROCK2, R() * .25) });
      out = r.out;
      /* 沿上、沿外压一圈圆卵石 */
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length, t = .2 + R() * .6, x = out[i][0] + (out[j][0] - out[i][0]) * t, z = out[i][1] + (out[j][1] - out[i][1]) * t;
        if (z < PZ - .32 && Math.abs(x) < .5) continue;                   /* 后面是假山石，不压卵石 */
        const dx = x - PX, dz = z - PZ, l = Math.hypot(dx, dz), rr = .04 + R() * .035;
        b.sphere(x + dx / l * .02, r.hs[i] - .01, z + dz / l * .02, rr, 5, mix3(ROCK2, R() < .3 ? MOSS : ROCKD, R() * .4), { sy: .62 });
        if (R() < .45) b.sphere(x + dx / l * .09, .02, z + dz / l * .09, rr * .8, 5, mix3(ROCK, ROCKD, R() * .5), { sy: .6 });
      }
    } else {                                                     /* 大理石沿：外沿一道线脚、接缝，前沿两级台阶没进水里 */
      const pts = poolPts(16);
      reseed(10);
      out = basin(b, pts, PX, PZ, { yW, yR, yF: .012, yB: 0, rw: .1, w, bed: BED, rim: i => i % 2 ? MARB : mix3(MARB, MARB2, .45), out: i => i % 2 ? MARB2 : mix3(MARB2, C.stone, .25) });
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        rod(b, [out[i][0], yR - .012, out[i][1]], [out[j][0], yR - .012, out[j][1]], .026, mix3(MARB, MARB2, .5));
        rod(b, [out[i][0], .015, out[i][1]], [out[j][0], .015, out[j][1]], .03, MARBD);
        if (i % 2) rod(b, [pts[i][0], yR + .002, pts[i][1]], [out[i][0], yR + .002, out[i][1]], .01, MARBD);
      }
      for (let k = 0; k < 2; k++) {
        const zz = PZ + PRZ - .1 - k * .1;
        b.box(0, .012, zz, .46 - k * .08, (k ? .03 : .052), .1, mix3(MARB, BED, .2 + k * .15), { nb: true });
      }
    }
    if (bad) leaves(b, PX, yW, PZ, PRX, PRZ, 7);
    else { b.emit(-.22, yW + .08, PZ + .05, "steam", 7, 1.1); if (lv < 3) b.emit(.24, yW + .08, PZ + .14, "steam", 6, 1); }
    /* 泉外散铺的不规则石板（后边不铺） */
    reseed(11);
    const ns = 26;
    for (let k = 0; k < ns; k++) {
      const a = -.55 + k / ns * (PI + 1.1) + (R() - .5) * .12, ca = Math.cos(a), sa = Math.sin(a);
      const rr = Math.hypot(PRX * ca, PRZ * sa) + .2 + R() * .14 + (k % 2) * .1, x = PX + ca * rr * 1.02, z = PZ + sa * rr;
      const s = .07 + R() * .05, s2 = s * (.7 + R() * .4), ry = a + (R() - .5) * .6;
      const col = marble ? mix3(MARB2, FLAG, .35 + R() * .3) : mix3(FLAG, FLAGD, R() * .7);
      b.at(x, .012, z, ry);
      qf(b, [-s, 0, -s2], [s * .9, 0, -s2 * 1.1], [s * 1.05, 0, s2 * .9], [-s * .95, 0, s2], col, [0, 1, 0]);
      b.pop();
    }
  }

  /* ================= Lv1–2：泉后的假山石、出水嘴 ================= */
  function rockery(b, o) {
    reseed(12);
    const cy = o.cy;
    rock(b, -.3, .02, -.28, .2, .9, .4, ROCK);
    rock(b, .26, .02, -.3, .22, 1.05, 1.2, ROCK2);
    rock(b, -.02, .06, -.4, .2, 1.6, .2, ROCK);
    rock(b, .52, .0, -.2, .13, .8, 2.1, ROCKD);
    rock(b, -.56, .0, -.16, .12, .9, .7, ROCK2);
    rock(b, .1, .02, -.2, .1, .8, 1.5, ROCKD);
    for (const [x, z, s] of [[-.46, -.36, .2], [.44, -.38, .22], [-.68, -.05, .16], [.7, .02, .15], [.16, -.5, .16]]) fern(b, x, .02, z, s);
    /* 出水嘴（1994 料石嘴，2077 黄铜猫头），一缕水往下淌进泉里 */
    const sy = .3, sz = -.24;
    if (!cy) {
      b.box(0, sy - .03, sz, .1, .06, .14, DRESS, { top: DRESS2 });
      b.box(0, sy + .025, sz + .02, .04, .012, .12, mix3(DRESS, INNER, .3));
    } else {
      catBall(b, 0, sy + .02, sz + .02, 0, .08, BRASS, GL);
      b.cyl(0, sy - .05, sz + .06, .012, .05, 5, BRASS, Object.assign({ nb: true }, GL));
    }
    const W2 = { mat: "water", k: 2 }, wc = o.bad ? MURK : mix3(HOTW, C.white, .25), z0 = sz + .08;
    if (!o.bad) qf(b, [-.025, sy - .02, z0], [.025, sy - .02, z0], [.035, .08, z0 + .07], [-.035, .08, z0 + .07], wc, [0, .3, 1], W2);
    if (cy) catBall(b, -.32, .24, -.27, .5, .075, CATG, o.bad ? {} : { e: .4 });        /* 假山石上蹲一只微亮的小猫球灯 */
  }

  /* ================= 石廊（1994 石板瓦单坡 / 2077 黄铜框玻璃冬园廊） ================= */
  function loggia(b, o) {
    const cy = o.cy, bad = o.bad;
    reseed(20);
    /* 台基、前沿一级踏步 */
    b.box((LX0 + LX1) / 2, 0, (LZB + LZF) / 2 - .02, LX1 - LX0 + .1, LY0, LZF - LZB + .2, mix3(ST2, STD, .25), { top: mix3(DRESS2, FLAG, .4), nb: true });
    b.box((LX0 + LX1) / 2 - .05, 0, LZF + .14, LX1 - LX0 - .2, .04, .1, DRESS2, { top: DRESS, nb: true });
    /* 后墙（里外两面错缝砌） */
    stoneBox(b, LX0 + .12, LX1 - .12, LY0, roofY(LZW) - .02, LZB, LZW, { nl: true, nr: true, q: false });
    /* 两头山墙：错缝砌，顶随单坡斜下 */
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? LX0 : LX1 - .12, x1 = x0 + .12, zc = (LZB + LZF) / 2, hd = (LZF - LZB) / 2;
      const zFront = y => Math.min(LZF, EZ - (y - EY) / RK);
      /* 外面 */
      b.at(s < 0 ? x0 : x1, 0, zc, s * PI / 2);
      mason(b, y => s < 0 ? [LZB - zc, zFront(y) - zc] : [-(zFront(y) - zc), -(LZB - zc)], LY0, roofY(LZB) - .02, 0, { ql: s > 0, qr: s < 0, rh: .16 });
      b.pop();
      /* 里面 */
      b.at(s < 0 ? x1 : x0, 0, zc, -s * PI / 2);
      mason(b, y => s < 0 ? [-(zFront(y) - zc), -(LZB - zc)] : [LZB - zc, zFront(y) - zc], LY0, roofY(LZB) - .02, 0, { rh: .16 });
      b.pop();
      /* 前端面 */
      qf(b, [x0, LY0, LZF], [x1, LY0, LZF], [x1, roofY(LZF), LZF], [x0, roofY(LZF), LZF], DRESS2, [0, 0, 1]);
      /* 山墙顶压顶石、前角小尖塔 */
      b.beam([(x0 + x1) / 2, roofY(LZF) + .03, LZF + .02], [(x0 + x1) / 2, roofY(LZB - .06) + .03, LZB - .06], .15, mix3(DRESS2, ST2, .35), { tz: .07 });
      pinnacle(b, (x0 + x1) / 2, ATOP + .045, LZF - .05, .13, .42);
    }
    /* 前廊：方墩柱、柱头柱础、尖拱料石券、拱肩、托石檐 */
    const zf = LZF, zb = LZP, zm = (zf + zb) / 2;
    for (const x of [-.5, 0]) {
      b.box(x, LY0, zm, .12, ATOP - LY0, zb - zf < 0 ? zf - zb : zb - zf, mix3(ST, ST2, .45), { front: mix3(ST, DRESS2, .35), nb: true });
      b.box(x, SPRING - .04, zm, .16, .045, .17, DRESS, { nb: true });
      b.box(x, LY0, zm, .16, .06, .17, DRESS2, { nb: true });
    }
    BAYS.forEach((bx, i) => {
      b.at(bx, LY0, 0); archRing(b, BS, SPRING - LY0, AP, .05, zb, zf + .025, bad && i === 1 ? k => k === -1 : null); b.pop();
      b.at(bx, 0, 0); archFill(b, BS, AP, SPRING, ATOP, zf, zb, mix3(ST, ST2, .45), mix3(DRESS2, STD, .35), 4); b.pop();
    });
    if (bad) { b.at(-.18, 0, -.5, .7, 1, 0, .3); b.box(0, 0, 0, .08, .1, .12, DRESS); b.pop(); }     /* 掉下来的拱心石 */
    b.box((LX0 + LX1) / 2, ATOP, zm + .01, LX1 - LX0, .045, .2, DRESS2, { nb: true, top: DRESS });
    for (let i = 0; i < 12; i++) cbox(b, LX0 + .13 + i * (LX1 - LX0 - .26) / 11, ATOP - .07, zf - .01, .045, .07, zf + .04, DRESS2);
    /* 三开间上各起一座小山花：错缝砌的三角墙、沿坡压顶、圆窗、顶上尖饰；背后一道小人字顶插进单坡顶里（2077 玻璃、黄铜） */
    const GY = ATOP + .045, GH = .3, GW = .5, gz = zf + .01, zMeet = EZ - (GY + GH - .02 - EY) / RK;
    BAYS.forEach((bx, i) => {
      reseed(24 + i);
      b.at(bx, 0, gz); mason(b, y => { const hw = GW / 2 * Math.max(0, 1 - (y - GY) / GH); return [-hw, hw]; }, GY, GY + GH, 0, { rh: .1 }); b.pop();
      tf(b, [bx - GW / 2, GY, gz - .08], [bx + GW / 2, GY, gz - .08], [bx, GY + GH, gz - .08], mix3(ST2, STD, .2), [0, 0, -1]);
      for (const s of [-1, 1]) b.beam([bx + s * (GW / 2 + .03), GY - .02, gz - .035], [bx, GY + GH + .03, gz - .035], .05, mix3(DRESS2, ST2, .2), { tz: .1 });
      b.at(bx, GY + GH * .4, gz);
      const rg = (r, n) => Array.from({ length: n }, (_, k) => [Math.cos(k / n * TAU) * r, Math.sin(k / n * TAU) * r]);
      prism(b, rg(.065, 8), -.01, .012, DRESS); fan(b, rg(.045, 8), .014, INNER);
      b.panel(0, -.045, .016, .012, .09, DRESS); b.panel(0, -.006, .016, .09, .012, DRESS);
      b.pop();
      b.pyramid(bx, GY + GH + .02, gz - .035, .06, .06, .12, DRESS2);
      b.sphere(bx, GY + GH + .15, gz - .035, .018, 4, DRESS);
      if (!cy) {
        for (const s of [-1, 1]) slope(b, [bx + s * (GW / 2 + .02), GY - .01], [bx, GY + GH - .02], zMeet, gz - .07, { nb: 3, cw: .13, nounder: true, nofascia: true, nolip: true });
        b.beam([bx, GY + GH - .015, zMeet], [bx, GY + GH - .015, gz - .07], .032, mix3(SL2, SLD, .4));
      } else {
        for (const s of [-1, 1]) {
          qf(b, [bx + s * (GW / 2 + .02), GY, zMeet], [bx + s * (GW / 2 + .02), GY, gz - .07], [bx, GY + GH - .01, gz - .07], [bx, GY + GH - .01, zMeet], mix3(GLASS, C.white, .15), [s, 1, 0], GLS);
          rod(b, [bx + s * (GW / 2 + .02), GY + .01, gz - .08], [bx, GY + GH, gz - .08], .022, BRASS, GL);
          rod(b, [bx + s * (GW / 4 + .01), GY + GH / 2 + .01, gz - .08], [bx + s * (GW / 4 + .01), GY + GH / 2 + .01, zMeet], .016, BRASS, GL);
        }
        rod(b, [bx, GY + GH + .005, zMeet], [bx, GY + GH + .005, gz - .07], .028, BRASS, GL);
      }
    });
    for (const x of [-.5, 0]) pinnacle(b, x, GY, gz - .05, .1, .36);
    /* 后墙外面：两道扶壁（对着前廊墩柱）、两扇尖拱小窗、常春藤 */
    for (const x of [-.5, 0]) {
      b.at(x, 0, LZB, PI);
      b.box(0, LY0, .05, .1, .62, .1, mix3(ST, ST2, .4 + R() * .3), { nb: true, top: DRESS2 });
      qf(b, [-.05, LY0 + .62, .1], [.05, LY0 + .62, .1], [.05, LY0 + .76, 0], [-.05, LY0 + .76, 0], DRESS2, [0, 1, 1]);
      tf(b, [.05, LY0 + .62, .1], [.05, LY0 + .62, 0], [.05, LY0 + .76, 0], mix3(ST, ST2, .5), [1, 0, 0]); tf(b, [-.05, LY0 + .62, .1], [-.05, LY0 + .62, 0], [-.05, LY0 + .76, 0], mix3(ST, ST2, .5), [-1, 0, 0]);
      b.box(0, 0, .06, .16, LY0, .14, mix3(ST2, STD, .3), { nb: true });
      b.pop();
    }
    b.at((LX0 + LX1) / 2, 0, LZB, PI);
    lancet(b, -.4, .48, 0, .12, .24, { hood: 1 }); lancet(b, .4, .48, 0, .12, .24, { hood: 1 });
    reseed(21); ivy(b, .1, LY0, 0, .5, .9, 22); ivy(b, -.68, LY0, 0, .2, .5, 8);
    b.pop();
    b.at(LX0, 0, -1.0, -PI / 2); ivy(b, .1, LY0, 0, .26, .85, 14); b.pop();
    /* 屋顶 */
    if (!cy) {
      reseed(22);
      b.at(0, 0, 0, PI / 2);
      slope(b, [-EZ, EY], [-RZ, RY], LX0 - .07, LX1 + .07, { under: mix3(OAK, [0, 0, 0], .1) });
      b.pop();
      b.beam([LX0 - .07, RY + .005, RZ + .03], [LX1 + .07, RY + .005, RZ + .03], .045, mix3(SLD, SL2, .4), { tz: .06 });
    } else {                                                     /* 黄铜框玻璃冬园廊顶：玻璃坡面、椽、檩、檐沟、脊 */
      const x0 = LX0 - .05, x1 = LX1 + .05, gl = .02;
      qf(b, [x0, EY + gl, EZ], [x1, EY + gl, EZ], [x1, RY + gl, RZ], [x0, RY + gl, RZ], mix3(GLASS, C.white, .15), [0, 1, .5], GLS);
      const n = 7;
      for (let i = 0; i <= n; i++) { const x = x0 + i * (x1 - x0) / n; rod(b, [x, EY + .035, EZ - .01], [x, RY + .035, RZ], i % n ? .026 : .036, BRASS, GL); }
      for (const t of [.5]) rod(b, [x0, EY + (RY - EY) * t + .035, EZ + (RZ - EZ) * t], [x1, EY + (RY - EY) * t + .035, EZ + (RZ - EZ) * t], .018, BRASS, GL);
      b.beam([x0, EY - .02, EZ], [x1, EY - .02, EZ], .05, BRASS, GL);
      b.beam([x0, RY + .01, RZ + .02], [x1, RY + .01, RZ + .02], .05, mix3(BRASS, C.slate, .3), GL);
      if (o.lv < 2) airship(b, -.25, RY + .05, RZ + .04, .3);
    }
    /* 廊下：石长凳、毛巾架、一摞木浴桶、两盏吊提灯（2077 加两盆棕榈、两只吊蕨篮） */
    reseed(23);
    const zin = LZW + .1;
    b.box(-.3, LY0, zin, .7, .17, .14, DRESS2, { top: DRESS, nb: true });
    for (const s of [-1, 1]) b.box(-.3 + s * .28, LY0, zin, .06, .17, .16, mix3(DRESS2, STD, .2), { nb: true });
    towelRack(b, -.74, LY0, -1.18, .1, bad);
    if (!bad) {
      tub(b, .3, LY0, -1.22, .085, .1, 0); tub(b, .45, LY0, -1.25, .085, .1, .4); tub(b, .36, LY0, -1.08, .085, .1, .9);
      tub(b, .37, LY0 + .1, -1.19, .08, .1, .3); tub(b, .4, LY0 + .2, -1.17, .075, .1, .5);
    } else {
      tub(b, .3, LY0, -1.22, .085, .1, 0); tub(b, .42, LY0, -1.06, .085, .1, .9, true); tub(b, .14, LY0, -.62, .08, .1, 2.2, true); tub(b, .52, 0, -.55, .075, .1, 1.1, true);
    }
    for (let k = 0; k < 4; k++) b.box(-.3 + (k - 1.5) * .09, LY0 + .17, zin + .01, .08, .025 + (k % 2) * .025, .1, TOWEL[(k + 2) % TOWEL.length]);   /* 凳上叠好的毛巾 */
    const yApex = SPRING + archY(BS, AP, 0) - .02;                /* 三个拱心下各吊一盏提灯 */
    BAYS.forEach(bx => { rod(b, [bx, yApex, zm], [bx, yApex - .06, zm], .01, cy ? BRASS : IRON, cy ? GL : M); lantern(b, bx, yApex - .25, zm, cy, bad); });
    if (cy) {
      pottedPalm(b, -.05, LY0, -1.25, 1.1); pottedPalm(b, -.95, LY0, -1.3, .9);
      fernBasket(b, -.25, roofY(-1.0) + .02, -1.0, .2); fernBasket(b, .1, roofY(-1.05) + .02, -1.05, .26);
    }
  }

  /* ================= Lv2：八角热汤房 ================= */
  function bathHouse(b, o) {
    const cy = o.cy, N = 8, ap = OR * Math.cos(PI / 8), fw = 2 * OR * Math.sin(PI / 8), y0 = .1, yW = 1.1;
    reseed(70);
    b.at(OX, 0, OZ, ORY);
    b.cyl(0, 0, 0, OR + .08, y0, N, mix3(ST2, STD, .3), { a0: PI / 8, top: DRESS2, nb: true });
    for (let k = 0; k < N; k++) {
      const th = k * PI / 4;
      b.at(Math.sin(th) * ap, 0, Math.cos(th) * ap, th);
      mason(b, () => [-fw / 2, fw / 2], y0, yW, 0, { rh: .16 });
      if (k === 0) {                                             /* 门：料石券、铁钉门、门前石阶、壁灯 */
        b.at(0, y0, 0); archRing(b, .24, .36, .65, .05, -.02, .04); b.pop();
        b.at(0, y0, .008); door(b, .24, .36, .65); b.pop();
        b.box(0, 0, .12, .38, y0, .16, DRESS2, { top: DRESS, nb: true });
        wallLantern(b, .19, .62, 0, cy);
      } else if (k !== 4) lancet(b, 0, .44, 0, .12, .28, { hood: 1, p: .72 });
      else lancet(b, 0, .5, 0, .1, .2, { p: .72, dark: true });
      for (let i = 0; i < 3; i++) cbox(b, -fw / 2 + .09 + i * (fw - .18) / 2, yW - .08, -.01, .05, .08, .05, DRESS2);
      b.pop();
      /* 转角扶壁：两段、斜压顶 */
      const pc = th + PI / 8;
      b.at(Math.sin(pc) * OR, 0, Math.cos(pc) * OR, pc);
      b.box(0, y0, .04, .085, .5, .13, mix3(ST, ST2, .4 + R() * .3), { nb: true, top: DRESS2 });
      b.box(0, y0 + .5, .02, .075, .3, .09, mix3(ST, ST2, .4 + R() * .3), { nb: true, top: DRESS2 });
      qf(b, [-.0425, y0 + .5, .105], [.0425, y0 + .5, .105], [.0425, y0 + .58, .065], [-.0425, y0 + .58, .065], DRESS, [0, 1, 1]);
      b.pyramid(0, y0 + .8, .02, .075, .09, .1, DRESS);
      b.pop();
    }
    if (o.lv >= 2) { b.at(Math.sin(5 * PI / 4) * ap, 0, Math.cos(5 * PI / 4) * ap, 5 * PI / 4); reseed(71); ivy(b, 0, y0, 0, .3, .8, 16); b.pop(); }
    /* 檐口 */
    b.cyl(0, yW, 0, OR + .06, .06, N, DRESS2, { a0: PI / 8, top: DRESS, bot: DRESS2 });
    /* 带肋的石板瓦尖穹顶 */
    const yD = yW + .06, rb = OR + .03, rTop = .1, rho = 1.25, Rr = rho * rb, cxp = rb - Rr, th1 = Math.acos((rTop - cxp) / Rr), K = 6, prof = [];
    for (let k = 0; k <= K; k++) { const t = th1 * k / K; prof.push([cxp + Rr * Math.cos(t), yD + Rr * Math.sin(t)]); }
    const P = (i, r, y) => { const f = PI / 8 + i * PI / 4; return [Math.sin(f) * r, y, Math.cos(f) * r]; };
    reseed(72);
    for (let i = 0; i < N; i++) for (let k = 0; k < K; k++) {
      const [ra, ya] = prof[k], [rb2, yb] = prof[k + 1], A = P(i, ra, ya), B = P(i + 1, ra, ya), Cc = P(i + 1, rb2, yb), D = P(i, rb2, yb);
      const mA = [(A[0] + B[0]) / 2, ya, (A[2] + B[2]) / 2], mD = [(D[0] + Cc[0]) / 2, yb, (D[2] + Cc[2]) / 2], f = PI / 8 + (i + .5) * PI / 4, hint = [Math.sin(f), .6, Math.cos(f)];
      for (const [p0, p1, p2, p3] of [[A, mA, mD, D], [mA, B, Cc, mD]]) {
        const base = k % 2 ? SL : SL2, r = R();
        const c = r < .2 ? mix3(base, SLD, .5) : r > .92 ? mix3(base, SLM, .6) : mix3(base, SLD, r * .25);
        qf(b, p0, p1, p2, p3, c, hint);
      }
    }
    const rib = cy ? BRASS : DRESS2, ribo = cy ? GL : undefined;
    for (let i = 0; i < N; i++) for (let k = 0; k < K; k++) rod(b, P(i, prof[k][0] + .015, prof[k][1] + .01), P(i, prof[k + 1][0] + .015, prof[k + 1][1] + .01), k < 2 ? .045 : .035, rib, ribo);
    b.cyl(0, yD - .01, 0, rb + .02, .035, N, cy ? BRASS : DRESS, Object.assign({ a0: PI / 8, nt: true }, cy ? GL : {}));
    /* 顶上开敞的小灯亭、尖顶饰（2077 黄铜、玻璃，顶上一只小飞艇风标） */
    const yl = prof[K][1], fr = cy ? BRASS : DRESS2, fo = cy ? GL : undefined;
    b.cyl(0, yl - .01, 0, .14, .035, N, fr, Object.assign({ a0: PI / 8 }, fo || {}));
    b.cyl(0, yl + .025, 0, .07, .12, 6, o.bad ? INNER : mix3(WIN, INNER, .3), o.bad ? {} : { e: .35 });
    for (let k = 0; k < 4; k++) { const a = PI / 4 + k * PI / 2; rod(b, [Math.sin(a) * .11, yl + .025, Math.cos(a) * .11], [Math.sin(a) * .11, yl + .15, Math.cos(a) * .11], .028, fr, fo); }
    if (cy) b.cyl(0, yl + .025, 0, .1, .125, 8, GLASS, { nt: true, nb: true, mat: "glass" });
    b.cyl(0, yl + .15, 0, .155, .025, N, fr, Object.assign({ a0: PI / 8 }, fo || {}));
    b.cyl(0, yl + .175, 0, .15, .16, N, cy ? mix3(BRASS, C.slate, .45) : SL2, Object.assign({ a0: PI / 8, r2: 0, nb: true }, fo || {}));
    if (cy) airship(b, 0, yl + .34, 0, 1.1);
    else finial(b, 0, yl + .36, 0, false);
    if (!o.bad && o.lv === 2) b.emit(0, yl + .45, 0, "steam", 6, .9);
    b.pop();
  }

  /* ================= Lv2：寒泉、石渠 ================= */
  function coldSpring(b, o) {
    const marble = o.lv >= 3, bad = o.bad;
    reseed(30);
    const pts = ring(CX, CZ, .27, .22, [1, .9, 1.08, .94, 1.02, .9, 1.06, .97, 1.03, .92], .5), yW = .2, yR = .24;
    let out;
    if (!marble) {
      const r = rockyBasin(b, pts, CX, CZ, { yW, yR, yF: .1, rw: .09, w: bad ? MURKC : COLDW, bed: BEDC, rim: () => mix3(mix3(sc(.3), ROCK2, .4 + R() * .3), MOSS, R() * .3) });
      out = r.out;
      for (let i = 0; i < out.length; i++) {
        const j = (i + 1) % out.length, x = (out[i][0] + out[j][0]) / 2, z = (out[i][1] + out[j][1]) / 2;
        if (x > CX + .12 || R() < .3) continue;
        b.sphere(x, r.hs[i] - .01, z, .04 + R() * .03, 5, mix3(ROCK2, MOSS, R() * .45), { sy: .62 });
      }
    } else {
      out = basin(b, pts, CX, CZ, { yW, yR, yF: .1, yB: 0, rw: .07, w: bad ? MURKC : COLDW, bed: BEDC, rim: i => i % 2 ? MARB : MARB2, out: i => i % 2 ? MARB2 : mix3(MARB2, C.stone, .25) });
      for (let i = 0; i < out.length; i++) { const j = (i + 1) % out.length; rod(b, [out[i][0], yR - .012, out[i][1]], [out[j][0], yR - .012, out[j][1]], .024, MARB); }
    }
    rock(b, CX - .26, .0, CZ - .22, .17, 1.1, .5, mix3(ROCK, MOSS, .2));
    rock(b, CX - .05, .0, CZ - .3, .12, .9, 1.7, ROCK2);
    rock(b, CX - .38, .0, CZ + .02, .1, .8, .3, ROCKD);
    fern(b, CX - .2, .02, CZ - .38, .2); fern(b, CX + .14, .02, CZ - .3, .16); fern(b, CX - .42, .02, CZ + .2, .15);
    if (bad) leaves(b, CX, yW, CZ, .26, .2, 3);
    /* 石渠：从寒泉东沿架过去，搭在热泉西沿上，水从渠口跌进热泉 */
    const xa = CX + .25, xb = -.66, za = CZ + .02, zb = PZ - .04, ya = yW - .01, yb = .155, w = .045, wc = bad ? MURKC : mix3(COLDW, HOTW, .35);
    const W2 = { mat: "water", k: 2 }, cs = marble ? MARB2 : DRESS2, ct = marble ? MARB : DRESS;
    const dx = xb - xa, dz = zb - za, L = Math.hypot(dx, dz), px = -dz / L, pz = dx / L;
    for (const s of [-1, 1]) {                                   /* 渠帮：两道料石 */
      const ox = px * s * (w + .022), oz = pz * s * (w + .022);
      b.beam([xa + ox, ya - .03, za + oz], [xb + ox, yb - .03, zb + oz], .044, cs, { tz: .1 });
      b.beam([xa + ox, ya + .016, za + oz], [xb + ox, yb + .016, zb + oz], .05, ct, { tz: .026 });
    }
    qf(b, [xa - px * w, ya - .06, za - pz * w], [xb - px * w, yb - .05, zb - pz * w], [xb + px * w, yb - .05, zb + pz * w], [xa + px * w, ya - .06, za + pz * w], cs, [0, -1, 0]);
    qf(b, [xa - px * w, ya, za - pz * w], [xb - px * w, yb, zb - pz * w], [xb + px * w, yb, zb + pz * w], [xa + px * w, ya, za + pz * w], wc, [0, 1, 0], W2);
    for (const k of [.3, .7]) { const x = xa + dx * k, z = za + dz * k, y = ya + (yb - ya) * k - .06; b.box(x, 0, z, .06, y, .06, cs, { nb: true }); }
    if (!bad) qf(b, [xb - px * w, yb, zb - pz * w], [xb + px * w, yb, zb + pz * w], [xb + px * w + .04, .075, zb + pz * w + .02], [xb - px * w + .04, .075, zb - pz * w + .02], wc, [1, .3, 0], W2);
  }

  /* ================= Lv3：泉台（后上两座抬高的小泉台、跌水）、大理石碑出水嘴 ================= */
  function terraces(b, o) {
    const bad = o.bad, cy = o.cy;
    reseed(40);
    const tiers = [
      { cx: .06, cz: -.34, rx: .5, rz: .21, yR: .27, yLow: .075 },
      { cx: -.2, cz: -.6, rx: .32, rz: .15, yR: .44, yLow: .245 }
    ];
    tiers.forEach((t, ti) => {
      const n = 12, jit = [1, .97, 1.02, .98, 1.01, .96, 1.03, .99, 1.0, .97, 1.02, .98];
      const pts = ring(t.cx, t.cz, t.rx, t.rz, jit, PI / n);
      const out = basin(b, pts, t.cx, t.cz, {
        yW: t.yR - .03, yR: t.yR, yF: t.yR - .1, yB: 0, rw: .06, w: bad ? MURK : HOTW, bed: BED,
        rim: i => i % 2 ? MARB : mix3(MARB, MARB2, .4), out: i => i % 3 ? MARB2 : mix3(MARB2, C.stone, .3)
      });
      for (let i = 0; i < n; i++) {                               /* 沿顶外线脚、勒脚线脚 */
        const j = (i + 1) % n, ox = (p, d) => { const dx = p[0] - t.cx, dz = p[1] - t.cz, l = Math.hypot(dx, dz); return [p[0] + dx / l * d, p[1] + dz / l * d]; };
        const A = ox(out[i], .006), B = ox(out[j], .006), A2 = ox(out[i], .01), B2 = ox(out[j], .01);
        rod(b, [A[0], t.yR - .014, A[1]], [B[0], t.yR - .014, B[1]], .026, mix3(MARB, MARB2, .5));
        rod(b, [A2[0], .02, A2[1]], [B2[0], .02, B2[1]], .04, MARBD);
      }
      /* 前沿三条边漫出跌水 */
      if (!bad) for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, mz = (out[i][1] + out[j][1]) / 2 - t.cz, mx = (out[i][0] + out[j][0]) / 2 - t.cx;
        if (mz / Math.hypot(mx / t.rx * t.rz, mz) > .8) cascade(b, out[i], out[j], t.cx, t.cz, t.yR, t.yLow, .022, mix3(HOTW, C.white, .3));
      }
      if (!bad && ti === 1) b.emit(t.cx, t.yR + .05, t.cz, "steam", 6, .9);
    });
    /* 大理石碑上的出水嘴（1994 料石扇贝嘴，2077 黄铜猫头） */
    const sx = -.2, sz = -.79, sy = .62;
    b.box(sx, 0, sz, .3, .78, .08, MARB2, { top: MARB, front: MARB });
    b.box(sx, .78, sz, .34, .04, .1, MARB, { nb: true });
    b.pyramid(sx, .82, sz, .3, .08, .1, MARB2);
    b.at(sx, .5, sz + .041); fan(b, outline(.14, .08, 0, .6, 3), .002, mix3(MARB2, INNER, .25)); b.pop();
    if (!cy) {
      b.at(sx, sy - .06, sz + .05);
      for (let k = 0; k < 5; k++) { const a = -PI / 2 + (k - 2) * .35; b.beam([0, 0, 0], [Math.sin(a) * -.07, Math.cos(a) * -.07 + .07, .01], .022, k % 2 ? MARB : DRESS); }
      b.box(0, -.02, .02, .06, .03, .06, DRESS);
      b.pop();
    } else catBall(b, sx, sy - .02, sz + .07, 0, .075, BRASS, GL);
    if (!bad) qf(b, [sx - .022, sy - .07, sz + .1], [sx + .022, sy - .07, sz + .1], [sx + .03, .41, sz + .16], [sx - .03, .41, sz + .16], mix3(HOTW, C.white, .3), [0, .3, 1], { mat: "water", k: 2 });
    fern(b, sx - .28, .02, sz + .02, .2); fern(b, sx + .3, .02, sz + .05, .18);
    urn(b, .66, -.5, bad || cy); urn(b, -.66, -.42, bad);
    if (cy) catBall(b, .66, .43, -.5, -.4, .07, CATG, bad ? {} : { e: .4 });
  }
  function urn(b, x, z, bad) {                                /* 大理石花瓮：方座、瓮身、瓮口，种一丛蕨（2077 瓮口上蹲猫球灯，不种蕨） */
    b.box(x, 0, z, .16, .08, .16, MARBD, { top: MARB2 });
    b.cyl(x, .08, z, .035, .06, 8, MARB2, { r2: .03, nb: true, nt: true });
    b.cyl(x, .14, z, .04, .1, 8, MARB, { r2: .095, nb: true, nt: true });
    b.cyl(x, .24, z, .095, .07, 8, MARB, { r2: .075, nb: true, nt: true });
    b.cyl(x, .31, z, .075, .03, 8, MARB2, { r2: .09, nb: true, top: SOIL });
    if (!bad) fern(b, x, .33, z, .16);
  }

  /* ================= Lv3：排汽石烟囱兼钟楼 ================= */
  function tower(b, o) {
    const cy = o.cy, bad = o.bad;
    reseed(80);
    const hs = TWS / 2, y0 = .12, yB = 2.3, pw = .09, ow = TWS - pw * 2;
    b.box(TWX, 0, TWZ, TWS + .1, y0, TWS + .1, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    stoneBox(b, TWX - hs, TWX + hs, y0, yB, TWZ - hs, TWZ + hs, { rh: .16 });
    for (const y of [1.05, 1.75]) b.box(TWX, y, TWZ, TWS + .045, .05, TWS + .045, DRESS2, { nb: true, top: DRESS });
    b.at(TWX, 0, TWZ);
    lancet(b, 0, 1.25, hs, .1, .24, { hood: 1, p: .7 });
    lancet(b, 0, .5, hs, .1, .2, { p: .7 });
    b.at(0, 0, 0, PI / 2); lancet(b, 0, 1.3, hs, .09, .2, { p: .7 }); b.pop();
    b.at(0, 0, 0, -PI / 2); lancet(b, 0, 1.3, hs, .09, .2, { p: .7, dark: true }); b.pop();
    /* 钟洞：四角石墩、尖拱开口、铜钟 */
    const yS = yB + .1, yA = yS + archY(ow, .7, 0), yT = yA + .1;
    b.box(0, yB - .03, 0, TWS + .06, .06, TWS + .06, DRESS2, { top: mix3(DRESS2, INNER, .4) });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(sx * (hs - pw / 2), yB + .03, sz * (hs - pw / 2), pw, yA - yB - .03, pw, mix3(DRESS2, ST, R() * .4), { nb: true });
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); archFill(b, ow, .7, yS, yT, hs, hs - pw, ST2, INNER, 3); b.pop(); }
    b.box(0, yA, 0, TWS, yT - yA, TWS, mix3(ST2, DRESS2, .3), { nb: true });
    b.quad([-hs, yA, -hs], [hs, yA, -hs], [hs, yA, hs], [-hs, yA, hs], INNER);
    b.at(0, yA - .06, 0, 0, 1, bad ? .35 : 0);
    b.cyl(0, -.0, 0, .018, .05, 5, IRON, M);
    b.cyl(0, -.17, 0, .085, .15, 8, cy ? BRASS : BRONZE, { r2: .045, mat: "metal" });
    b.cyl(0, -.19, 0, .09, .02, 8, cy ? BRASS : BRONZE, { r2: .085, mat: "metal" });
    b.pop();
    /* 托石檐口、压顶、八角烟囱、烟囱帽（2077 黄铜风帽） */
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); for (let i = 0; i < 3; i++) cbox(b, -hs + .07 + i * (TWS - .14) / 2, yT - .07, hs - .02, .05, .07, hs + .05, DRESS2); b.pop(); }
    b.box(0, yT, 0, TWS + .1, .06, TWS + .1, DRESS2, { top: mix3(DRESS2, [.2, .2, .2], .3) });
    const ys = yT + .06, soot = mix3(ST2, [.2, .19, .2], .45);
    b.cyl(0, ys, 0, .15, .3, 8, mix3(ST2, soot, .3), { r2: .12, a0: PI / 8, nt: true });
    b.cyl(0, ys + .1, 0, .145, .02, 8, DRESS2, { r2: .14, a0: PI / 8, nt: true, nb: true });
    b.cyl(0, ys + .3, 0, .15, .05, 8, DRESS2, { a0: PI / 8, top: mix3(soot, [0, 0, 0], .4) });
    const yp = ys + .35;
    if (!cy) for (const dx of [-.05, .05]) b.cyl(dx, yp, 0, .038, .12, 6, POT, { r2: .03, top: [.12, .1, .1] });
    else {
      b.cyl(0, yp, 0, .045, .08, 6, BRASS, Object.assign({ r2: .04, nt: true }, GL));
      b.cyl(0, yp + .08, 0, .075, .02, 8, BRASS, Object.assign({ nb: true }, GL));
      b.cone(0, yp + .1, 0, .08, .07, 8, mix3(BRASS, C.slate, .35), Object.assign({ nb: true }, GL));
    }
    if (!bad) b.emit(0, yp + .25, 0, "steam", 8, 1.1);
    b.pop();
    b.at(TWX, 0, TWZ + hs, 0); reseed(81); ivy(b, -.08, y0, 0, .2, 1.0, 16); b.pop();
  }

  /* ================= 泉边杂物：灯柱、长凳、木踏板、猫、猫球灯 ================= */
  function sleepyCat(b, x, y, z, ry, col) {                  /* 蜷在暖石头上睡觉的猫：圆身子、埋着的头、两只耳朵、绕过来的尾巴 */
    const belly = mix3(C.cream, col, .3), dk = mix3(col, C.woodD, .45);
    b.at(x, y, z, ry);
    b.at(0, .04, 0, 0, [1.25, .62, 1]); b.sphere(0, 0, 0, .075, 7, col, { grad: belly }); b.pop();
    b.sphere(.07, .055, .035, .042, 6, col, { sy: .85 });
    for (const s of [-1, 1]) { b.at(.08 + s * .012, .09, .035 + s * .024, 0, 1, s * .3, -.25); b.cone(0, 0, 0, .016, .03, 3, dk, { nb: true }); b.pop(); }
    b.at(-.01, .062, 0, 0, [1.05, .4, .8]); b.sphere(0, 0, 0, .06, 6, mix3(col, dk, .45), { nb: true }); b.pop();   /* 背上一块深色虎斑 */
    const tp = [[-.08, .03, -.02], [-.07, .02, .06], [-.01, .02, .085], [.06, .02, .075]];
    for (let k = 0; k < tp.length - 1; k++) rod(b, tp[k], tp[k + 1], .022, k === tp.length - 2 ? dk : col);
    b.pop();
  }
  function duckboard(b, x, z, ry, bad) {                     /* 泉边一块木踏板，上面一只小木桶、一叠毛巾 */
    b.at(x, 0, z, ry);
    for (const s of [-1, 1]) b.box(s * .16, 0, 0, .03, .02, .3, OAK);
    for (let k = 0; k < 6; k++) b.box(0, .02, -.125 + k * .05, .4, .016, .036, mix3(BOARD, C.woodL, (k % 2) * .25), { nb: true });
    if (!bad) { tub(b, .1, .036, .02, .06, .07, .4); b.box(-.08, .036, -.02, .12, .03, .1, TOWEL[0]); b.box(-.08, .066, -.02, .11, .025, .09, TOWEL[1]); }
    b.pop();
  }
  function props(b, o) {
    const cy = o.cy, bad = o.bad;
    reseed(50);
    lampPost(b, .96, .12, cy, bad);
    bench(b, -.62, 1.16, .5, -.35);
    duckboard(b, .52, 1.0, -.55, bad);
    if (o.lv < 2) { tub(b, -.98, 0, .22, .085, .1, .3); tub(b, -1.1, 0, .38, .075, .09, 1.2, bad); }
    if (!bad) { if (o.lv < 3) sleepyCat(b, .27, .24, -.29, .5, mix3(C.hay, C.wood, .45)); else sleepyCat(b, .86, .14, .44, 1.75, mix3(C.hay, C.wood, .45)); }
    if (cy) catLamp(b, -.4, 1.16, .78, bad);
  }

  /* ================= 拼装 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { lv, cy, bad };
    loggia(b, oo);
    if (lv >= 3) terraces(b, oo); else rockery(b, oo);
    mainPool(b, oo);
    if (lv >= 2) { bathHouse(b, oo); coldSpring(b, oo); }
    if (lv >= 3) tower(b, oo);
    props(b, oo);
  }
  /* label 高度 = 最高点 + .2（audit 实测） */
  build.h = o => (o.lv >= 3 ? 3.4 : o.lv >= 2 ? 2.62 : o.cyber ? 1.88 : 1.71);
  Isle3D.FAC["浴场"] = build;
})();
