/* 酒馆（1994 委托酒馆 / 2077 冒险者酒馆）：一层带阁楼的长条石屋，前左一片石板院子，前右一块委托板，+x 侧一道地窖门。
   1994 Lv1：后边一座长条石屋（风化灰石错缝砌、转角隅石、石台基），陡峭的石板瓦顶压得很低，瓦色带一点青苔；
             两头是带压顶石、托脚石和尖顶饰的石山墙；−x 山墙外贴一根粗石烟囱（收分肩、越往上越熏黑、两只陶烟囱帽，冒烟）；
             前坡正中一扇大老虎窗（石砌窗墙、双联尖拱窗、小人字顶）。
             正面：左边一扇外凸的吧台凸窗（三面暖光玻璃、细木格、铅皮小斜顶），右边一扇尖拱铁钉木门，门楣上方钉一副魔兽头骨
             （扁圆颅骨、吻部、两只弯角、黑眼窝）；门右铁臂挑出一块木招牌，两面画金色的交叉扫帚和酒杯；一盏铁壁灯、两扇小尖拱窗、墙角常春藤。
             院子：石板地，一张长条支架桌和两条长凳，桶桌、小凳、木桶；前右委托板：两根木柱撑一块木板，顶上小石板瓦檐，钉着七张歪歪的奶油色纸条（不写字）；
             +x 侧地窖门：石砌斜框，一扇门板合着、一扇翻开，里头三级石阶往下走进黑里。
   1994 Lv2：院子上方加一座爬藤花架（四根木柱、梁、椽、几团叶子垂下来），前梁下拉一串 4 盏小暖灯（C.glow，e .5）；
             −x 山墙前加一间停扫帚的石板瓦披棚：木柱、横杆、四把扫帚斜靠着墙、一只水桶。
   1994 Lv3：+x 端后角起一座方形公会钟楼：石台基、两段石砌塔身（腰线、尖拱窗、箭孔、公会挂旗），上段两面钟面，
             开敞的尖拱钟室里挂一口铜钟，托石檐口，石板瓦四坡顶，顶上铁尖饰和一面小风向旗。
   2077（冒险者酒馆）：同一座石屋。吧台凸窗改黄铜框玻璃，窗里露出黄铜酒头柱；提灯、招牌铁臂、尖顶饰换黄铜；老虎窗顶立一只黄铜小飞艇风标（不转）；
             门口一根黄铜细杆托一盏浮着的猫球灯。
             Lv2：花架换成黄铜骨架的玻璃雨棚（还留几缕藤），委托板旁边立一块画架小黑板，粉笔画的下注赔率格。
             Lv3：不起钟楼，院角起一处地下城入口：半埋在草丘里的残破尖拱（缺了几块拱石，一块掉在地上），拱下石阶往下走进黑暗，
             一道半升的铁吊闸，两边墩子上各一支火把（ember 各 2 颗）。
   不加霓虹、不加全息、不加罩子、不画人。
   待修：渲染器统一压暗；模型里烟囱不冒烟、招牌只挂着一根链子歪下来、委托板歪斜、两张纸条掉在地上、一条长凳翻倒，猫球灯和火把熄灭。
   前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6), VOID = [.05, .045, .055];
  const MOSS = .15;                                                                                  /* 瓦色往青苔混 .15 */
  const SL = mix3(mix3(C.slate, [.2, .21, .23], .55), C.ivy, MOSS), SL2 = mix3(mix3(C.slate2, [.24, .25, .27], .55), C.ivy, MOSS);
  const SLD = mix3(SL, [.08, .08, .1], .4), SLM = mix3(SL, C.ivy, .45);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), IRON = mix3(C.iron, [.1, .1, .12], .2), BRONZE = mix3(C.gold, C.wood, .38);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4), TOPW = mix3(C.plank, C.woodL, .3);
  const DOORW = mix3(C.woodD, C.wood, .25), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const MULL = mix3(IRON, OAK, .3), LEAD = mix3(C.iron, [.52, .53, .55], .3);
  const POT = mix3(C.roofR, STD, .45), HAY = mix3(C.hay, C.woodL, .35);
  const BONE = mix3(C.cream, C.stone, .22), BONED = mix3(BONE, C.woodD, .3);
  const PAPER = mix3(C.cream, C.stone, .12), PAPER2 = mix3(C.cream, C.hay, .28);
  const GLASS = mix3(C.glass, [.78, .88, .84], .3);
  const FLAG = mix3(C.stone, ST2, .35), FLAGD = mix3(ST2, STD, .45);
  const SLATEB = [.15, .18, .17], CHALK = mix3(C.white, C.stone, .25);
  const TURF = mix3(C.grass, [.46, .52, .3], .3), TURFD = mix3(TURF, C.ivy, .5);
  const FACE = mix3(C.cream, C.stone, .2);
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
  function wedge(b, x, y, z, w, h, d, col, o) {             /* 斜顶小块：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col, o);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col, o);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col, o);
    b.quad([x0, y, z1], [x0, y, z0], [x1, y, z0], [x1, y, z1], col, o);
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
    if (!skip) { const kt = archY(w + fr * 2, p, 0); b.box(0, h + kt - .07, (z0 + z1) / 2 + .008, .07, .1, z1 - z0 + .016, DRESS, { nb: true }); }
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
    if (o.two) b.panel(0, 0, .027, .02, h + archY(w, p, 0) * .72, fc);
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
  function slit(b, x, y, z) {                               /* 箭孔：十字窄缝 */
    b.panel(x, y - .03, z + .002, .08, .3, DRESS2);
    b.panel(x, y, z + .004, .03, .24, INNER);
    b.panel(x, y + .1, z + .005, .1, .028, INNER);
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    fan(b, outline(w, h, 0, p, 4), 0, DOORW);
    const n = 5;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, DARK); }
    for (const y of [h * .2, h * .66]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .05 + i * (w - .1) / 3, y + .006, .0125, .016, .016, C.metal, M);
    }
    b.at(w * .24, h * .55, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .026, .007, 8, 3, IRON, M); b.pop();
  }
  function lantern(b, x, y, z, cy) {                        /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, C.lamp, { r2: .045, e: .62, nt: true, nb: true });
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
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, 0, z, .045, .07, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .02, BRASS, GL);
    b.beam([x, h, z], [x + .1, h + .05, z], .015, BRASS, GL);
    b.beam([x + .1, h + .05, z], [x + .15, h + .02, z], .013, BRASS, GL);
    b.sphere(x, h + .01, z, .024, 4, BRASS, GL);
    if (!off) b.emit(x + .15, h - .1, z, "cat", 1, .85);
  }
  function finial(b, x, y, z, cy) { b.beam([x, y - .06, z], [x, y + .2, z], .02, cy ? BRASS : IRON, cy ? GL : M); b.sphere(x, y + .06, z, .032, 4, cy ? BRASS : BRONZE, cy ? GL : M); }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function leafTuft(b, x, y, z, s, k) {                     /* 一团叶子（花架、草丘）：两片交叉的菱形 */
    const c = mix3(C.leaf, C.leafD, R() * .8), o = { k: k || 1.2 };
    b.quad([x - s, y, z], [x, y + .012, z + s], [x + s, y, z], [x, y - .012, z - s], c, o);
    b.quad([x, y + .03, z - s * .7], [x - s * .7, y + .02, z], [x, y + .03, z + s * .7], [x + s * .7, y + .02, z], mix3(c, C.leaf2, .3), o);
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
  function barrel(b, x, z, r, h, ry, tip) {                 /* 木桶：桶板、两道铁箍；tip 横倒 */
    b.at(x, tip ? r : 0, z, ry || 0, 1, tip ? PI / 2 : 0);
    if (tip) b.at(0, -h / 2, 0);
    b.cyl(0, 0, 0, r * .88, h * .5, 8, OAK2, { r2: r, nt: true, nb: true });
    b.cyl(0, h * .5, 0, r, h * .5, 8, mix3(OAK2, C.wood, .2), { r2: r * .88, nt: true, nb: true });
    for (const t of [.16, .82]) b.cyl(0, h * t - .012, 0, r * .96 + .008, .026, 8, IRON, { nt: true, nb: true, mat: "metal" });
    b.disc(0, h * .98, 0, r * .86, 8, mix3(OAK2, C.plank, .4));
    if (tip) b.pop();
    b.pop();
  }
  function crate(b, x, y, z, s, ry) {                       /* 木箱：板条 */
    b.at(x, y, z, ry || 0, s);
    b.box(0, 0, 0, .3, .26, .3, BOARD);
    for (const sz of [-1, 1]) { b.at(0, 0, 0, sz < 0 ? PI : 0); for (const sx of [-1, 1]) b.panel(sx * .135, 0, .152, .03, .26, OAK2); b.panel(0, .115, .153, .27, .03, OAK2); b.pop(); }
    b.pop();
  }
  function broom(b, x, yTop, z, len, lx, lz) {              /* 斜靠的扫帚：帚把在上，帚苗在下 */
    const bx = x + lx, bz = z + (lz || 0), by = yTop - len;
    b.beam([x, yTop, z], [bx, by, bz], .022, C.woodL);
    b.at(bx, by, bz, 0, 1, Math.atan2(lz || 0, len), -Math.atan2(lx, len) + PI);
    b.cyl(0, 0, 0, .028, .24, 6, HAY, { r2: .07, nb: true });
    b.cyl(0, .02, 0, .034, .03, 6, mix3(C.cloth, C.woodD, .3), { nb: true, nt: true });
    b.pop();
  }
  function flowerBox(b, x, y, z, w) {                       /* 窗台花箱（面朝 +z，贴在 z 的墙上）：木箱、一丛叶子、几朵低饱和的花 */
    const FL = [[.78, .36, .4], [.9, .74, .4], [.68, .52, .78], [.94, .9, .84]];
    b.box(x, y, z + .05, w, .07, .1, BOARD, { nb: true, front: mix3(BOARD, OAK, .25) });
    b.box(x, y + .07, z + .05, w - .03, .03, .075, mix3(C.leaf, C.leafD, .45), { nb: true, k: 1.2 });
    const k = Math.max(3, Math.round(w / .07));
    for (let i = 0; i < k; i++) b.pyramid(x - w / 2 + (i + .5) * w / k, y + .09 + R() * .02, z + .04 + R() * .04, .045, .045, .05, FL[(i + (R() * 2 | 0)) % FL.length], { k: 1.3 });
  }
  function woodpile(b, x0, x1, z) {                         /* 后墙根的柴垛：一层层原木 */
    const n = Math.round((x1 - x0) / .1);
    for (let j = 0; j < 3; j++) for (let i = 0; i < n - j; i++) {
      const xx = x0 + .05 + (i + j * .5) * .1;
      b.at(xx, .05 + j * .088, z, 0, 1, PI / 2); b.cyl(0, -.12, 0, .046, .24, 5, mix3(C.woodL, C.wood, R()), { top: mix3(C.woodL, C.hay, .4), bot: mix3(C.woodL, C.hay, .4) }); b.pop();
    }
  }
  function stool(b, x, z) { b.cyl(x, 0, z, .05, .16, 6, OAK2, { r2: .056, top: TOPW, nb: true }); }
  function mug(b, x, y, z, cy) { b.cyl(x, y, z, .022, .055, 5, cy ? BRASS : mix3(C.woodL, C.white, .25), Object.assign({ top: mix3(C.cream, C.hay, .3) }, cy ? GL : {})); }
  function bench(b, x, z, L, ry, fallen) {                  /* 长凳：座板、两只板腿；fallen 翻倒在地 */
    b.at(x, fallen ? .05 : 0, z, ry || 0, 1, fallen ? 1.45 : 0);
    b.box(0, .17, 0, L, .03, .1, OAK2, { top: TOPW });
    for (const s of [-1, 1]) { b.box(s * (L / 2 - .08), 0, 0, .03, .17, .085, OAK); }
    b.box(0, .07, 0, L - .16, .025, .02, OAK);
    b.pop();
  }
  function lampPost(b, x, z, cy) {                          /* 路边铁灯柱：石座、细柱、一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, 0, z, .12, .07, .12, DRESS2, { nb: true });
    b.cyl(x, .07, z, .026, .6, 6, fr, Object.assign({ r2: .02 }, fo));
    b.beam([x - .06, .6, z], [x + .06, .6, z], .014, fr, fo);
    b.cyl(x, .64, z, .03, .035, 6, fr, Object.assign({ nb: true }, fo));
    lantern(b, x, .67, z, cy);
  }
  function kegRack(b, x, z, cy) {                           /* 墙根的酒桶架：两根木托梁上横躺两只桶（桶头朝外），桶头上一只龙头 */
    for (const dz of [-.07, .07]) { b.box(x, 0, z + dz, .4, .05, .04, OAK); for (const dx of [-.19, 0, .19]) b.box(x + dx, .05, z + dz, .035, .025, .04, OAK); }
    for (const dx of [-.095, .095]) {
      const r = .082, cx = x + dx, cyy = .05 + r;
      b.at(cx, cyy, z, 0, 1, PI / 2);
      b.cyl(0, -.11, 0, r * .88, .11, 8, OAK2, { r2: r, nt: true, nb: true }); b.cyl(0, 0, 0, r, .11, 8, mix3(OAK2, C.wood, .2), { r2: r * .88, nt: true, nb: true });
      for (const t of [-.085, .065]) b.cyl(0, t, 0, r * .95, .02, 8, IRON, { nt: true, nb: true, mat: "metal" });
      b.disc(0, .11, 0, r * .86, 8, mix3(OAK2, C.plank, .4)); b.disc(0, -.11, 0, r * .86, 8, mix3(OAK2, C.plank, .4)); b.pop();
      b.box(cx, cyy - .04, z + .12, .016, .016, .04, cy ? BRASS : IRON, cy ? GL : M);
      b.box(cx, cyy - .04, z + .135, .012, .035, .012, cy ? BRASS : IRON, cy ? GL : M);
    }
  }
  function trestle(b, x, z, L, ry, cy) {                    /* 长条支架桌：桌板、两副交叉腿、拉杆，桌上几只酒杯、一支蜡烛 */
    b.at(x, 0, z, ry || 0);
    b.box(0, .3, 0, L, .035, .26, OAK2, { top: TOPW });
    for (const s of [-1, 1]) {
      const xx = s * (L / 2 - .1);
      b.beam([xx, 0, -.1], [xx, .3, .1], .03, OAK); b.beam([xx, 0, .1], [xx, .3, -.1], .03, OAK);
    }
    b.beam([-(L / 2 - .1), .13, 0], [L / 2 - .1, .13, 0], .025, OAK);
    mug(b, -L * .3, .335, .05, cy); mug(b, -L * .1, .335, -.06, cy); mug(b, L * .22, .335, .04, cy);
    b.cyl(L * .04, .335, 0, .02, .02, 5, IRON, M); b.cyl(L * .04, .355, 0, .01, .05, 4, mix3(C.cream, C.white, .5));
    b.pop();
  }
  function barrelTable(b, x, z, cy) {                       /* 桶桌：立着的大桶当桌子，桶面上一块圆板、两只杯子，两只小凳 */
    barrel(b, x, z, .13, .3, .3);
    b.cyl(x, .3, z, .17, .025, 8, OAK2, { top: TOPW });
    mug(b, x - .05, .325, z + .03, cy); mug(b, x + .06, .325, z - .02, cy);
    stool(b, x - .25, z + .05); stool(b, x + .22, z + .12);
  }

  /* ================= 尺寸 ================= */
  const P = .1, HX = 1.1, HZ0 = -1.15, HZ1 = -.05, HZC = (HZ0 + HZ1) / 2, HD = (HZ1 - HZ0) / 2;
  const YW = 1.1, YR = 1.95, RISE = YR - YW, K = RISE / HD, OV = .09, YE = YW - OV * K;
  const DX = .26, DW = .34, DH = .3, DP = .62;                     /* 门 */
  const BX = -.52, BW = .56;                                        /* 吧台凸窗 */
  const SX = .64;                                                   /* 招牌铁臂 */
  const slopeY = z => YE + (HZ1 + OV - z) * K;                      /* 前坡在 z 处的高 */

  /* ================= 石屋 ================= */
  function gableEnd(b, s, cy) {                             /* 石山墙：错缝砌的三角、沿坡压顶石、檐口托脚石、山尖石墩和尖顶饰 */
    b.at(s * HX, 0, HZC, s * PI / 2);
    mason(b, y => { const w = HD * Math.max(0, 1 - (y - YW) / RISE); return [-w, w]; }, YW, YR, 0, { rh: .17 });
    const L = HD + OV - .02, yl = YE + .02;
    for (const t of [-1, 1]) {
      b.beam([t * L, yl + .04, .0], [0, YR + .07, .0], .11, DRESS2, { tz: .1 });
      b.box(t * (L - .04), yl - .1, .0, .16, .16, .15, DRESS, { nb: true });
    }
    b.box(0, YR - .02, 0, .13, .14, .13, DRESS2, { nb: true });
    b.pyramid(0, YR + .12, 0, .14, .14, .12, DRESS);
    b.pop();
  }
  function chimney(b, o) {                                   /* −x 山墙外的粗石烟囱：下段宽、收分肩、上段熏黑、压顶石、两只陶烟囱帽 */
    reseed(7);
    const x0 = -HX - .3, x1 = -HX + .02, z0 = -.86, z1 = -.36, ys = 1.2, sz0 = -.73, sz1 = -.49, sx0 = -HX - .27, yt = YR + .05;
    const soot = y => mix3(mix3(sc(y), STD, .45), [.18, .17, .18], Math.max(.12, Math.min(.55, (y - 1.1) * .7)));
    stoneBox(b, x0, x1, 0, ys, z0, z1, { nr: true, rh: .15, q: false, col: y => mix3(sc(y), STD, .2) });
    for (const t of [-1, 1]) {                                /* 收分肩：两面斜的压顶石 */
      const za = t < 0 ? z0 - .02 : z1 + .02, zb = t < 0 ? sz0 : sz1;
      qf(b, [x0 - .02, ys, za], [x1, ys, za], [x1, ys + .2, zb], [x0 + .03, ys + .2, zb], DRESS2, [0, 1, t]);
      tf(b, [x0 - .02, ys, za], [x0 + .03, ys + .2, zb], [x0 - .02, ys, zb], DRESS2, [-1, 0, 0]);
    }
    b.quad([x0 - .02, ys, z1 + .02], [x0 - .02, ys, z0 - .02], [x0 - .02, ys - .04, z0 - .02], [x0 - .02, ys - .04, z1 + .02], DRESS2);
    stoneBox(b, sx0, x1, ys, yt, sz0, sz1, { nr: true, rh: .14, q: false, col: soot });
    b.box((sx0 + x1) / 2 - .01, yt, (sz0 + sz1) / 2, x1 - sx0 + .08, .05, sz1 - sz0 + .08, DRESS2, { top: mix3(DRESS2, [.2, .2, .2], .4) });
    const cx = (sx0 + x1) / 2 - .02, cz = (sz0 + sz1) / 2;
    for (const dz of [-.055, .055]) b.cyl(cx, yt + .05, cz + dz, .04, .12, 6, POT, { r2: .033, top: [.12, .1, .1] });
    if (!o.bad) b.emit(cx, yt + .45, cz + .055, "smoke", 8, 1);
    b.at(x0, 0, (z0 + z1) / 2, -PI / 2); ivy(b, .12, P, 0, .3, 1.0, 16); b.pop();
  }
  function dormer(b, cy) {                                   /* 前坡正中的大老虎窗：石砌窗墙、双联尖拱窗、小人字顶、尖顶饰（2077 顶上一只黄铜小飞艇风标） */
    const w = .58, yb = 1.22, hb = .42, zf = HZ1 + OV - (yb - YE) / K, dd = .62, zc = zf - dd / 2, gh = w * .58;
    b.box(0, yb - .2, zc, w, hb + .2, dd, mix3(ST, ST2, .5), { nb: true });
    reseed(3); mason(b, () => [-w / 2, w / 2], yb, yb + hb, zf + .002, { ql: 1, qr: 1, rh: .14 });
    for (const s of [-1, 1]) lancet(b, s * .085, yb + .07, zf, .12, .2, { fr: .03, nosill: true, p: .7, cy });
    b.box(0, yb + .035, zf + .02, w * .62, .03, .07, DRESS, { nb: true });
    b.at(0, yb + hb, zc + .03, PI / 2); b.gable(0, 0, 0, dd + .12, w + .1, gh, SL2, { end: DRESS2 }); b.pop();
    for (const s of [-1, 1]) b.beam([s * (w / 2 + .06), yb + hb - .03, zf + .07], [0, yb + hb + gh + .02, zf + .07], .05, DRESS2, { tz: .06 });
    const ty = yb + hb + gh;
    if (!cy) { b.beam([0, ty - .02, zf + .08], [0, ty + .15, zf + .08], .018, IRON, M); b.sphere(0, ty + .05, zf + .08, .03, 4, BRONZE, M); }
    else {                                                     /* 黄铜小飞艇风标（静止） */
      b.beam([0, ty - .02, zf + .08], [0, ty + .08, zf + .08], .014, BRASS, GL);
      b.at(0, ty + .1, zf + .08, .5);
      b.at(0, 0, 0, 0, [1, .4, .4]); b.sphere(0, 0, 0, .085, 6, mix3(C.cream, C.stone, .3), GL); b.pop();
      for (const dx of [-.035, .035]) { b.at(dx, 0, 0, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .034, .005, 8, 3, BRASS, GL); b.pop(); }
      b.box(.0, -.055, 0, .05, .016, .018, BRASS, GL);
      b.box(-.085, -.005, 0, .03, .045, .005, BRASS, GL);
      b.pop();
    }
  }
  function skull(b, x, y, z) {                               /* 门楣上方的魔兽头骨：扁圆颅骨、吻部、黑眼窝、鼻孔、两只往外弯的角，钉在一块小木盾上 */
    b.at(x, y, z);
    b.box(0, -.08, .01, .2, .17, .02, OAK2, { nb: true });
    b.sphere(0, .01, .06, .07, 6, BONE, { sy: .78 });
    b.box(0, -.065, .085, .065, .055, .085, BONE);
    b.box(0, -.083, .085, .056, .016, .075, BONED);
    for (const s of [-1, 1]) {
      b.panel(s * .028, -.005, .126, .026, .022, VOID);
      b.at(s * .05, .03, .06, 0, 1, 0, -s * 1.05); b.cyl(0, 0, 0, .019, .07, 5, BONED, { r2: .015, nb: true, nt: true }); b.pop();
      b.at(s * .11, .055, .06, 0, 1, .2, -s * .35); b.cone(0, 0, 0, .016, .08, 5, BONE, { nb: true }); b.pop();
    }
    b.panel(0, -.055, .129, .016, .012, VOID);
    b.pop();
  }
  function bayWin(b, cy) {                                   /* 吧台凸窗：石裙、窗台、三面玻璃、木格（2077 黄铜框玻璃，窗里黄铜酒头柱）、铅皮小斜顶 */
    const x = BX, w = BW, y0 = .32, h = .38, d = .15, z = HZ1, zf = z + d, x0 = x - w / 2, x1 = x + w / 2;
    reseed(9);
    b.box(x, P, z + d / 2, w + .02, y0 - P - .03, d, sc(.4), { nb: true, top: DRESS2 });
    b.box(x, y0 - .035, z + d / 2 + .01, w + .07, .035, d + .04, DRESS, { nb: true });
    if (!cy) {
      b.panel(x, y0, zf, w - .02, h, WIN, { e: .6 });
      qf(b, [x0 + .01, y0, z], [x0 + .01, y0, zf], [x0 + .01, y0 + h, zf], [x0 + .01, y0 + h, z], WIN, [-1, 0, 0], { e: .6 });
      qf(b, [x1 - .01, y0, z], [x1 - .01, y0, zf], [x1 - .01, y0 + h, zf], [x1 - .01, y0 + h, z], WIN, [1, 0, 0], { e: .6 });
      for (const s of [-1, 1]) b.box(x + s * (w / 2 - .01), y0, zf, .035, h, .035, OAK2);
      for (let i = 1; i < 4; i++) b.panel(x - w / 2 + i * w / 4, y0, zf + .004, .012, h, MULL);
      for (let j = 1; j < 3; j++) b.panel(x, y0 + j * h / 3, zf + .005, w - .03, .012, MULL);
    } else {
      b.panel(x, y0, z + .012, w - .03, h, WIN, { e: .5 });                         /* 里头一面暖光的酒架墙 */
      for (let i = 0; i < 2; i++) b.box(x, y0 + .14 + i * .12, z + .03, w - .08, .012, .04, OAK);
      for (let i = 0; i < 7; i++) b.cyl(x - w / 2 + .07 + i * (w - .14) / 6, y0 + .152 + (i % 2) * .12, z + .03, .012, .06, 4, i % 3 ? [.24, .36, .26] : [.42, .22, .18]);
      b.box(x, y0, z + .085, w - .06, .05, .06, OAK2, { top: OAK });                 /* 吧台面 */
      b.cyl(x, y0 + .05, z + .085, .022, .17, 6, BRASS, GL);                          /* 黄铜酒头柱：立柱、横梁、三只龙头、黑把手 */
      b.beam([x - .1, y0 + .2, z + .085], [x + .1, y0 + .2, z + .085], .03, BRASS, GL);
      for (const dx of [-.075, 0, .075]) { b.box(x + dx, y0 + .165, z + .1, .014, .035, .014, BRASS, GL); b.box(x + dx, y0 + .215, z + .09, .012, .06, .012, [.12, .1, .1]); }
      b.sphere(x, y0 + .235, z + .085, .025, 4, BRASS, GL);
      b.quad([x0, y0, zf], [x1, y0, zf], [x1, y0 + h, zf], [x0, y0 + h, zf], GLASS, GLS);
      qf(b, [x0, y0, z], [x0, y0, zf], [x0, y0 + h, zf], [x0, y0 + h, z], GLASS, [-1, 0, 0], GLS);
      qf(b, [x1, y0, z], [x1, y0, zf], [x1, y0 + h, zf], [x1, y0 + h, z], GLASS, [1, 0, 0], GLS);
      for (const s of [-1, 1]) b.box(x + s * (w / 2 - .01), y0, zf, .03, h, .03, BRASS, GL);
      for (const s of [-1, 1]) b.beam([x + s * w / 6, y0, zf + .004], [x + s * w / 6, y0 + h, zf + .004], .014, BRASS, GL);
      b.beam([x0, y0 + h * .7, zf + .004], [x1, y0 + h * .7, zf + .004], .012, BRASS, GL);
    }
    b.box(x, y0 + h, z + d / 2, w + .03, .045, d + .015, cy ? BRASS : OAK2, cy ? GL : undefined);
    wedge(b, x, y0 + h + .045, z + (d + .06) / 2 - .01, w + .09, .09, d + .06, cy ? mix3(BRASS, C.slate, .45) : LEAD, cy ? GL : undefined);
  }
  function hangSign(b, x, y, z, cy, bad) {                   /* 门右铁臂挑出的木招牌（牌面朝 ±x）：两面画金色的交叉扫帚和酒杯；待修时只挂着一根链子 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y - .12, z + .01, .05, .2, .02, fr, fo);
    b.beam([x, y, z], [x, y, z + .48], .02, fr, fo);
    b.beam([x, y - .15, z], [x, y, z + .24], .014, fr, fo);
    b.at(x, y - .04, z + .1, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .036, .007, 6, 3, fr, fo); b.pop();
    b.pyramid(x, y - .02, z + .49, .036, .036, .045, fr, fo);
    const bz = z + .3, bw = .3, bh = .27, z1 = bz - .14, z2 = bz + .14;
    b.beam([x, y, z1], [x, y - .07, z1], .008, fr, fo);
    if (!bad) b.beam([x, y, z2], [x, y - .07, z2], .008, fr, fo);
    b.at(x, y - .07, z1, 0, 1, bad ? -.55 : 0);
    b.at(0, 0, .14);
    b.box(0, -bh, 0, .03, bh, bw, BOARD);
    b.box(0, -.012, 0, .04, .02, bw + .02, OAK); b.box(0, -bh - .01, 0, .04, .02, bw + .02, OAK);
    for (const t of [-1, 1]) b.box(0, -bh, t * bw / 2, .04, bh, .02, OAK);
    for (const s of [-1, 1]) {
      b.at(s * .016, -bh / 2, 0, s * PI / 2);
      for (const t of [-1, 1]) {                            /* 交叉的两把扫帚：帚苗朝上两角，帚把在杯子后面交叉 */
        b.at(0, -.02, .002, 0, 1, 0, t * .7);
        b.panel(0, -.11, 0, .011, .19, mix3(C.gold, C.woodL, .25), M);
        fan(b, [[-.007, .08], [.007, .08], [.024, .135], [0, .145], [-.024, .135]], .0005, mix3(C.gold, C.hay, .35), M);
        b.panel(0, .07, .001, .022, .012, mix3(C.gold, C.woodD, .3), M);
        b.pop();
      }
      b.panel(0, -.115, .004, .1, .085, mix3(C.gold, C.woodL, .1), M);      /* 敦实的酒杯：杯身、两道箍、泡沫、侧把手 */
      for (const yy of [-.1, -.055]) b.panel(0, yy, .005, .1, .008, mix3(C.gold, C.woodD, .35), M);
      b.panel(0, -.03, .005, .112, .024, mix3(C.cream, C.white, .5));
      b.panel(-s * .066, -.1, .004, .014, .06, C.gold, M);
      b.panel(-s * .059, -.048, .004, .028, .012, C.gold, M); b.panel(-s * .059, -.1, .004, .028, .012, C.gold, M);
      b.pop();
    }
    b.pop(); b.pop();
  }
  function cellar(b, o) {                                    /* +x 侧地窖门：石砌斜框，一扇门板合着、一扇翻开，里头三级石阶往下走进黑里 */
    const W = .34, D = .4, hB = .4, hF = .14;
    b.at(HX, 0, -.21, PI / 2);                               /* 局部 +z 朝 +x，局部 x 朝 −z */
    const hy = z => hB + (hF - hB) * (z / D);
    const CH = mix3(DRESS2, ST2, .45);
    for (const s of [-1, 1]) {                                /* 两侧斜石框：矮矮的料石边墙，顶上压一条斜石 */
      const x = s * (W / 2 + .03);
      qf(b, [x - .03, 0, .0], [x - .03, 0, D], [x - .03, hF, D], [x - .03, hB, 0], CH, [-s, 0, 0]);
      qf(b, [x + .03, 0, .0], [x + .03, 0, D], [x + .03, hF, D], [x + .03, hB, 0], CH, [s, 0, 0]);
      qf(b, [x - .035, hB + .025, 0], [x + .035, hB + .025, 0], [x + .035, hF + .025, D], [x - .035, hF + .025, D], DRESS2, [0, 1, .3]);
      qf(b, [x - .035, hB, 0], [x - .035, hF, D], [x - .035, hF + .025, D], [x - .035, hB + .025, 0], DRESS2, [-s * 0 - 1, 0, 0]);
      qf(b, [x + .035, hB, 0], [x + .035, hF, D], [x + .035, hF + .025, D], [x + .035, hB + .025, 0], DRESS2, [1, 0, 0]);
      qf(b, [x - .035, 0, D], [x + .035, 0, D], [x + .035, hF + .025, D], [x - .035, hF + .025, D], DRESS2, [0, 0, 1]);
    }
    b.box(0, 0, D + .02, W + .12, .05, .05, DRESS, { nb: true });                     /* 门槛石 */
    b.quad([-W / 2, .004, 0], [W / 2, .004, 0], [W / 2, .004, D], [-W / 2, .004, D], VOID);
    for (let i = 0; i < 3; i++) { const zz = D - .07 - i * .1, yy = hF - .04 - i * .045; b.box(W / 4, yy - .03, zz, W / 2 - .01, .03, .09, mix3(DRESS2, VOID, i * .3), { nb: true }); }
    b.quad([0, .004, 0], [0, .004, D], [0, hF, D], [0, hB, 0], VOID);                 /* 门洞里一面黑 */
    const leaf = (x0, x1, open) => {                          /* 一扇门板：斜放（合）或翻到一边（开） */
      if (!open) {
        qf(b, [x0, hB + .005, .01], [x1, hB + .005, .01], [x1, hF + .005, D], [x0, hF + .005, D], DOORW, [0, 1, .4]);
        for (const t of [.25, .75]) { const zz = D * t, yy = hy(zz) + .012; b.beam([x0 + .01, yy, zz], [x1 - .01, yy, zz], .02, IRON, M); }
      } else {
        b.at(x1 + .03, hF, D / 2, 0, 1, 0, -1.9);
        b.box(-(x1 - x0) / 2, 0, 0, x1 - x0, .025, D + .02, DOORW);
        for (const t of [-.12, .12]) b.box(-(x1 - x0) / 2, .025, t, x1 - x0 - .02, .012, .02, IRON, M);
        b.pop();
      }
    };
    leaf(-W / 2, 0, false);
    leaf(0, W / 2, !o.bad);
    if (o.bad) leaf(0, W / 2, false);
    b.pop();
  }
  function house(b, o) {
    const cy = o.cy, lv = o.lv;
    reseed(1);
    stoneBox(b, -HX - .04, HX + .04, 0, P, HZ0 - .04, HZ1 + .04, { q: false, rh: .1, col: () => mix3(ST2, STD, .25 + R() * .45), top: DRESS2 });
    stoneBox(b, -HX, HX, P, YW, HZ0, HZ1, {});
    for (const s of [-1, 1]) gableEnd(b, s, cy);
    reseed(2);
    b.at(0, 0, 0, PI / 2);
    slope(b, [-(HZ1 + OV), YE], [-HZC, YR], -HX - .04, HX + .04);
    slope(b, [-(HZ0 - OV), YE], [-HZC, YR], -HX - .04, HX + .04);
    b.pop();
    b.beam([-HX, YR - .035, HZC], [HX, YR - .035, HZC], .075, SLD, { tz: .075 });       /* 脊瓦 */
    dormer(b, cy);
    chimney(b, o);
    /* 正面：门、门券、石阶、头骨、凸窗、窗、壁灯、招牌 */
    const z = HZ1;
    b.at(DX, P, z); archRing(b, DW, DH, DP, .06, -.03, .04); b.pop();
    b.at(DX, P, z + .008); door(b, DW, DH, DP); b.pop();
    b.box(DX, 0, z + .13, DW + .26, P, .18, mix3(DRESS2, STD, .2), { top: DRESS, nb: true });
    skull(b, DX, P + DH + archY(DW + .12, DP, 0) + .1, z);
    bayWin(b, cy);
    lancet(b, -.95, .4, z, .14, .26, { p: .68, hood: 1 });
    lancet(b, .88, .4, z, .14, .26, { p: .68, hood: 1 });
    reseed(5); flowerBox(b, -.95, .3, z, .26); flowerBox(b, .88, .3, z, .26);
    wallLantern(b, -.1, .66, z, cy);
    hangSign(b, SX, .82, z, cy, o.bad);
    /* 背面两扇窗；+x 山墙阁楼窗（Lv3 1994 被钟楼挡住就不画） */
    b.at(0, 0, HZ0, PI); lancet(b, -.5, .42, 0, .14, .26, { p: .68 }); lancet(b, .55, .42, 0, .14, .26, { p: .68 }); b.pop();
    if (!(lv >= 3 && !cy)) { b.at(HX, 0, HZC, PI / 2); lancet(b, 0, 1.2, 0, .14, .22, { p: .7, hood: 1 }); lancet(b, .3, .45, 0, .13, .22, { p: .68 }); b.pop(); }
    b.at(-HX, 0, HZC, -PI / 2); lancet(b, .38, 1.22, 0, .12, .2, { p: .7 }); b.pop();
    /* 常春藤 */
    reseed(4);
    ivy(b, -HX + .12, P, z, .28, .8, 20);
    ivy(b, .62, P, z, .14, .3, 6);
    b.at(HX, 0, HZC, PI / 2); ivy(b, -.42, P, 0, .18, .7, lv >= 3 && !cy ? 0 : 12); b.pop();
    cellar(b, o);
    reseed(6); woodpile(b, -.75, -.05, HZ0 - .14);
  }

  /* ================= 院子、委托板 ================= */
  const YX0 = -1.72, YX1 = -.16, YZ0 = .12, YZ1 = 1.32;
  function yard(b, o) {
    reseed(30);
    const nx = 6, nz = 5, gx = (YX1 - YX0) / nx, gz = (YZ1 - YZ0) / nz, jit = [];
    for (let i = 0; i <= nx; i++) { jit.push([]); for (let j = 0; j <= nz; j++) jit[i].push([(i > 0 && i < nx ? (R() - .5) * .07 : 0), (j > 0 && j < nz ? (R() - .5) * .07 : 0)]); }
    const P2 = (i, j) => [YX0 + i * gx + jit[i][j][0], YZ0 + j * gz + jit[i][j][1]];
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
      if ((i === 0 && j === nz - 1) || (i === nx - 1 && j === nz - 1 && R() < .5)) continue;
      const a = P2(i, j), c = P2(i + 1, j + 1), bq = P2(i + 1, j), d = P2(i, j + 1), g = .014, col = mix3(FLAG, FLAGD, R() * .7);
      const sh = (p, q) => [p[0] + (q[0] > p[0] ? g : -g), p[1] + (q[1] > p[1] ? g : -g)];
      const cc = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2], A = sh(a, cc), B = sh(bq, cc), Cc = sh(c, cc), D = sh(d, cc);
      b.quad([A[0], .014, A[1]], [D[0], .014, D[1]], [Cc[0], .014, Cc[1]], [B[0], .014, B[1]], col);
    }
    for (let k = 0; k < 6; k++) {                                /* 门前到岛心的一溜踏石 */
      const zz = .3 + k * .2, xx = DX + (R() - .5) * .06, s = .09 + R() * .03;
      b.quad([xx - s, .012, zz + s * .8], [xx + s, .012, zz + s * .7], [xx + s * .9, .012, zz - s * .8], [xx - s * .9, .012, zz - s * .7], mix3(FLAG, FLAGD, R() * .5));
    }
  }
  function furniture(b, o) {
    const cy = o.cy, bad = o.bad;
    reseed(31);
    trestle(b, -1.06, .38, .8, 0, cy);
    bench(b, -1.06, .2, .72, 0);
    bench(b, -1.06, .57, .72, 0, bad);
    trestle(b, -.4, .98, .62, PI / 2, cy);
    bench(b, -.6, .98, .56, PI / 2); bench(b, -.2, .98, .56, PI / 2);
    lampPost(b, -.02, 1.4, cy);
    kegRack(b, .74, .16, cy);
    if (!(cy && o.lv >= 3)) barrelTable(b, -1.46, 1.0, cy);
    barrel(b, -1.62, .3, .11, .3, .4); barrel(b, -.05, .1, .09, .24, 1.1);
    crate(b, 1.3, 0, .1, .5, .3); barrel(b, 1.66, -.5, .11, .3, .2); barrel(b, 1.56, -.32, .09, .24, .9);
    if (!(cy && o.lv >= 2)) { crate(b, 1.7, 0, -.04, .6, .5); crate(b, 1.7, .156, -.04, .45, .9); }
  }
  function questBoard(b, o) {                                /* 委托板：两根木柱、一块木板、顶上石板瓦小檐，钉七张歪歪的奶油色纸条（不写字）；待修时歪斜、掉两张 */
    reseed(40);
    const W = .48, y0 = .4, y1 = .78, yp = .9;
    b.at(1.5, 0, .4, .12, 1, 0, o.bad ? -.13 : 0);
    for (const s of [-1, 1]) { b.box(s * (W / 2 + .03), 0, 0, .06, yp, .06, OAK); b.box(s * (W / 2 + .03), 0, 0, .11, .05, .11, DRESS2, { nb: true }); }
    b.box(0, y0, -.012, W, y1 - y0, .028, BOARD, { front: mix3(BOARD, C.woodD, .15) });
    b.box(0, y1, 0, W + .04, .025, .045, OAK2); b.box(0, y0 - .025, 0, W + .04, .025, .045, OAK2);
    b.box(0, yp - .03, 0, W + .14, .03, .05, OAK);
    b.at(0, yp, 0); b.gable(0, 0, 0, W + .2, .24, .11, SL2, { end: OAK }); b.pop();
    b.beam([-(W / 2 + .12), yp + .005, .12], [W / 2 + .12, yp + .005, .12], .022, SLD);
    const notes = [[-.16, .66, .09, .1], [-.04, .68, .08, .085], [.08, .64, .1, .11], [.19, .67, .075, .09], [-.15, .49, .1, .1], [-.01, .47, .085, .1], [.14, .5, .1, .085]];
    notes.forEach(([nx, ny, w, h], i) => {
      if (o.bad && (i === 2 || i === 5)) return;
      b.at(nx, ny, .005, 0, 1, 0, (R() - .5) * .3);
      b.panel(0, -h / 2, 0, w, h, R() < .5 ? PAPER : PAPER2);
      b.panel(0, h / 2 - .02, .002, .012, .012, IRON, M);
      b.pop();
    });
    if (!o.cy) { b.beam([W / 2 + .03, yp - .06, .03], [W / 2 + .03, yp - .06, .1], .012, IRON, M); lantern(b, W / 2 + .03, yp - .29, .1, false); }
    if (o.bad) for (const [px, pz, a] of [[-.1, .22, .5], [.18, .3, -.3]]) { b.at(px, .008, pz, a); b.quad([-.045, 0, .05], [.045, 0, .05], [.045, 0, -.05], [-.045, 0, -.05], PAPER2); b.pop(); }
    b.pop();
  }
  function betBoard(b, o) {                                  /* 2077 Lv2：画架小黑板，粉笔画的下注赔率格 */
    b.at(1.72, 0, -.06, .85, 1, 0, o.bad ? .1 : 0);
    for (const s of [-1, 1]) b.beam([s * .2, 0, .06], [s * .14, .82, 0], .03, OAK2);
    b.beam([0, 0, -.2], [0, .78, -.02], .028, OAK2);
    b.box(0, .3, .045, .42, .025, .06, OAK2);
    b.at(0, .33, .03, 0, 1, -.1);
    b.box(0, 0, 0, .44, .36, .025, OAK);
    b.panel(0, .02, .0135, .4, .32, SLATEB);
    for (let j = 1; j < 4; j++) b.panel(0, .02 + j * .08, .015, .38, .006, CHALK);
    b.panel(-.07, .03, .015, .006, .3, CHALK);
    reseed(41);
    for (let j = 0; j < 4; j++) {
      b.panel(-.14, .045 + j * .08, .016, .1, .02, mix3(CHALK, SLATEB, .25));
      for (let k = 0; k < 3; k++) if (R() < .8) b.panel(-.01 + k * .065, .045 + j * .08, .016, .03 + R() * .02, .02, k === 1 ? mix3(CHALK, C.hay, .35) : CHALK);
    }
    b.pop(); b.pop();
  }

  /* ================= Lv2：花架（2077 玻璃雨棚）、扫帚披棚 ================= */
  const PX0 = -1.6, PX1 = -.3, PZ0 = .2, PZ1 = .58, PH = 1.1;
  function pergola(b, o) {
    const cy = o.cy;
    reseed(20);
    for (const x of [PX0, PX1]) for (const z of [PZ0, PZ1]) {
      b.box(x, 0, z, .11, .05, .11, DRESS2, { nb: true });
      if (cy) b.beam([x, .05, z], [x, PH + (z === PZ0 ? .12 : 0), z], .04, BRASS, GL);
      else b.box(x, .05, z, .065, PH - .05, .065, OAK2);
    }
    const lamps = [];
    if (!cy) {                                                   /* 1994：木梁、椽子、葡萄藤 */
      for (const z of [PZ0, PZ1]) b.box((PX0 + PX1) / 2, PH, z, PX1 - PX0 + .16, .055, .055, OAK);
      const n = 6;
      for (let i = 0; i <= n; i++) { const x = PX0 + .02 + i * (PX1 - PX0 - .04) / n; b.box(x, PH + .055, (PZ0 + PZ1) / 2 - .02, .035, .04, PZ1 - PZ0 + .08, OAK2); }
      for (let i = 0; i < 34; i++) { const x = PX0 + R() * (PX1 - PX0), z = PZ0 - .04 + R() * (PZ1 - PZ0 + .04); leafTuft(b, x, PH + .1 + R() * .03, z, .045 + R() * .03); }
      for (const x of [PX0, PX1]) for (const zz of [PZ0, PZ1]) for (let i = 0; i < 7; i++) {
        const y = .2 + R() * .85, s = .025 + R() * .02, px = x + (R() - .5) * .08, pz = zz + (R() < .5 ? -.04 : .04);
        b.quad([px - s, y, pz], [px, y - s, pz], [px + s, y, pz], [px, y + s, pz], mix3(C.ivy, C.leaf, R() * .5), { k: 1.15 });
        b.quad([px, y + s, pz], [px + s, y, pz], [px, y - s, pz], [px - s, y, pz], mix3(C.ivy, C.leaf, R() * .5), { k: 1.15 });
      }
      for (let i = 0; i < 4; i++) { const x = PX0 + .2 + i * .34, L = .14 + R() * .12; for (let k = 0; k < 3; k++) leafTuft(b, x + (R() - .5) * .05, PH - k * L / 3, PZ1 - .02, .03, 1.3); }
    } else {                                                     /* 2077：黄铜骨架玻璃雨棚，后高前低，还留几缕藤 */
      const yb = PH + .12, yf = PH;
      b.beam([PX0 - .06, yb, PZ0], [PX1 + .06, yb, PZ0], .04, BRASS, GL);
      b.beam([PX0 - .06, yf, PZ1], [PX1 + .06, yf, PZ1], .04, BRASS, GL);
      qf(b, [PX0 - .06, yb + .02, PZ0 - .04], [PX1 + .06, yb + .02, PZ0 - .04], [PX1 + .06, yf + .02, PZ1 + .02], [PX0 - .06, yf + .02, PZ1 + .02], mix3(GLASS, C.white, .2), [0, 1, .2], GLS);
      const n = 5;
      for (let i = 0; i <= n; i++) { const x = PX0 - .04 + i * (PX1 - PX0 + .08) / n; b.beam([x, yb + .03, PZ0 - .04], [x, yf + .03, PZ1 + .02], .022, BRASS, GL); }
      for (let i = 0; i < 12; i++) { const x = PX0 + R() * (PX1 - PX0), z = PZ0 + R() * .12; leafTuft(b, x, yb + .06, z, .04 + R() * .02); }
      for (const x of [PX0, PX1]) for (let i = 0; i < 6; i++) {
        const y = .2 + R() * .8, s = .025 + R() * .02, px = x + (R() - .5) * .07, pz = PZ0 + (R() < .5 ? -.04 : .04);
        b.quad([px - s, y, pz], [px, y - s, pz], [px + s, y, pz], [px, y + s, pz], mix3(C.ivy, C.leaf, R() * .5), { k: 1.15 });
        b.quad([px, y + s, pz], [px + s, y, pz], [px, y - s, pz], [px - s, y, pz], mix3(C.ivy, C.leaf, R() * .5), { k: 1.15 });
      }
    }
    /* 前梁下一串 4 盏小暖灯（C.glow e .5） */
    const yl = PH - .02, sag = .14, pts = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([PX0 + (PX1 - PX0) * t, yl - sag * 4 * t * (1 - t), PZ1 + .01]); }
    for (let i = 0; i < 10; i++) b.beam(pts[i], pts[i + 1], .007, [.12, .11, .1]);
    for (let i = 0; i < 4; i++) {
      const t = (i + 1) / 5, x = PX0 + (PX1 - PX0) * t, y = yl - sag * 4 * t * (1 - t);
      b.beam([x, y, PZ1 + .01], [x, y - .05, PZ1 + .01], .006, [.12, .11, .1]);
      b.cyl(x, y - .06, PZ1 + .01, .014, .012, 5, cy ? BRASS : IRON, cy ? GL : M);
      b.sphere(x, y - .085, PZ1 + .01, .024, 5, C.glow, { e: .5 });
    }
  }
  function leanTo(b, o) {                                     /* −x 山墙前的扫帚披棚：木柱、石板瓦单坡、横杆、四把扫帚斜靠着墙、一只水桶 */
    const cy = o.cy, x0 = -1.64, x1 = -HX, z0 = -.36, z1 = .12, yh = 1.0, yl = .7;
    reseed(21);
    b.quad([x0, .012, z1], [x1, .012, z1], [x1, .012, z0], [x0, .012, z0], mix3(BOARD, C.woodD, .3));
    for (const z of [z0 + .04, z1 - .03]) b.box(x0 + .04, 0, z, .06, yl, .06, OAK2);
    b.box(x0 + .04, yl, (z0 + z1) / 2, .07, .05, z1 - z0 + .02, OAK);
    b.beam([x0 + .04, yl - .22, z1 - .03], [x0 + .04, yl - .02, z1 - .2], .035, OAK);
    slope(b, [x0 - .07, yl - .03], [x1 + .02, yh], z0 - .06, z1 + .07, { nb: 4, cols: [SL2, SL, SLD] });
    b.quad([x0 - .07, yl - .03, z1 + .07], [x1, yh, z1 + .07], [x1, yl - .03, z1 + .07], [x0 - .07, yl - .03, z1 + .07], OAK);
    b.box(x1 - .03, .62, (z0 + z1) / 2, .03, .04, z1 - z0 - .06, OAK);                     /* 墙上的扫帚横杆 */
    const bz = [-.26, -.13, .0, .08];
    bz.forEach((zz, i) => broom(b, x1 - .04, .86 + (i % 2) * .05, zz, .58 + (i % 2) * .05, -.2 - i * .02, (i - 1.5) * .02));
    b.cyl(x0 + .2, 0, z1 - .12, .07, .13, 7, cy ? BRASS : OAK2, Object.assign({ r2: .08, top: [.2, .26, .3] }, cy ? GL : {}));
    b.torus(x0 + .2, .1, z1 - .12, .08, .006, 7, 3, IRON, M);
  }

  /* ================= 1994 Lv3：方形公会钟楼 ================= */
  const TX = 1.28, TZ = -.72, TS = .64, TY1 = 1.5, TY2 = 2.42, TB = 2.5, TBH = .56;
  function clock(b, y, z, r, cy) {                          /* 钟面（面朝 +z，z 是墙面）：料石圈、铜边、象牙白表盘、刻度、铁指针 */
    const N = 10, ring = k => Array.from({ length: N }, (_, i) => [Math.cos(i / N * TAU) * k, Math.sin(i / N * TAU) * k]);
    b.at(0, y, z);
    prism(b, ring(r + .045), -.02, .035, DRESS);
    fan(b, ring(r + .012), .037, cy ? BRASS : BRONZE, M);
    fan(b, ring(r), .04, FACE, { e: .15 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, s = k % 3 ? .011 : .022; b.panel(Math.sin(a) * (r - .03), Math.cos(a) * (r - .03) - s / 2, .042, s, s, IRON); }
    const hand = (a, L, w, zz) => { const ux = Math.sin(a), uy = Math.cos(a), nx = -uy * w, ny = ux * w; b.quad([-ux * .02 - nx, -uy * .02 - ny, zz], [ux * L - nx, uy * L - ny, zz], [ux * L + nx, uy * L + ny, zz], [-ux * .02 + nx, -uy * .02 + ny, zz], IRON); };
    hand(1.9, r * .52, .009, .046); hand(5.4, r * .8, .006, .048);
    b.panel(0, -.011, .05, .022, .022, BRONZE, M);
    b.pop();
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上公会挂旗：铁杆、燕尾布条、金边、一只金色酒杯徽 */
    b.beam([x - w / 2 - .03, yt + .01, z + .03], [x + w / 2 + .03, yt + .01, z + .03], .018, IRON, M);
    b.at(x, yt, z + .012);
    fan(b, [[-w / 2, -h], [0, -h + .08], [w / 2, -h], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .018, -h + .05, .003, .012, h - .09, C.gold, M);
    b.panel(w / 2 - .018, -h + .05, .003, .012, h - .09, C.gold, M);
    b.panel(0, -.06, .003, w - .02, .012, C.gold, M);
    const yc = -h * .48;
    b.panel(0, yc - .04, .004, .07, .08, C.gold, M);
    b.panel(.045, yc - .025, .004, .018, .05, C.gold, M);
    b.panel(0, yc + .04, .005, .08, .02, mix3(C.cream, C.white, .5));
    b.pop();
  }
  function tower(b, o) {
    reseed(50);
    const hs = TS / 2;
    b.box(TX, 0, TZ, TS + .08, P, TS + .08, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    stoneBox(b, TX - hs, TX + hs, P, TB, TZ - hs, TZ + hs, { nl: true });
    for (const y of [TY1, TY2]) b.box(TX, y, TZ, TS + .05, .06, TS + .05, DRESS2, { nb: true, top: DRESS });
    b.at(TX, 0, TZ);
    for (const a of [0, PI / 2]) { b.at(0, 0, 0, a); clock(b, 2.0, hs, .17, false); b.pop(); }
    lancet(b, 0, 1.62, hs, .12, .14, { hood: 1, p: .7 });
    lancet(b, -.1, .5, hs, .1, .2, { p: .7 });
    banner(b, .08, 1.36, hs, .2, .55, C.banner2);
    b.at(0, 0, 0, PI / 2); lancet(b, 0, .55, hs, .14, .26, { hood: 1 }); lancet(b, 0, 1.62, hs, .12, .14, { hood: 1 }); b.pop();
    b.at(0, 0, 0, PI); lancet(b, 0, 1.65, hs, .12, .2, {}); slit(b, 0, .7, hs); b.pop();
    /* 钟室：四角石墩、尖拱开口、铜钟 */
    const pw = .13, ow = TS - pw * 2, yS = TB + .12, yA = yS + archY(ow, .7, 0), yT = TB + TBH;
    b.box(0, TB - .04, 0, TS + .06, .07, TS + .06, DRESS2, { top: mix3(DRESS2, INNER, .4) });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(sx * (hs - pw / 2), TB + .03, sz * (hs - pw / 2), pw, yA - TB - .03, pw, mix3(DRESS2, ST, R() * .4), { nb: true });
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); archFill(b, ow, .7, yS, yT, hs, hs - pw, ST2, INNER, 3); b.box(0, TB + .03, hs - .03, ow, .07, .05, DRESS, { nb: true }); b.pop(); }
    b.box(0, yA, 0, TS, yT - yA, TS, mix3(ST2, DRESS2, .3), { nb: true });
    b.quad([-hs, yA, -hs], [hs, yA, -hs], [hs, yA, hs], [-hs, yA, hs], INNER);
    b.beam([-hs + pw, yA - .04, 0], [hs - pw, yA - .04, 0], .04, OAK);
    b.cyl(0, yA - .07, 0, .026, .05, 6, IRON, M);
    b.cyl(0, yA - .26, 0, .11, .19, 8, BRONZE, { r2: .06, mat: "metal" });
    b.cyl(0, yA - .28, 0, .115, .025, 8, BRONZE, { r2: .11, mat: "metal" });
    /* 托石檐口、四坡顶、尖饰、小风向旗 */
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); for (let i = 0; i < 4; i++) cbox(b, -hs + .1 + i * (TS - .2) / 3, yT - .1, hs - .02, .06, .1, hs + .05, DRESS2); b.pop(); }
    b.box(0, yT, 0, TS + .12, .08, TS + .12, DRESS2, { top: DRESS });
    const yr = yT + .08, rr = (TS / 2 + .1) * Math.SQRT2;
    b.cyl(0, yr, 0, rr, .08, 4, SL2, { r2: rr * .82, a0: PI / 4, nt: true, bot: SLD });
    b.cyl(0, yr + .08, 0, rr * .82, .16, 4, SL, { r2: rr * .45, a0: PI / 4, nt: true, nb: true });
    b.cyl(0, yr + .24, 0, rr * .45, .2, 4, mix3(SL, SL2, .5), { r2: 0, a0: PI / 4, nb: true });
    const top = yr + .44;
    b.beam([0, top - .05, 0], [0, top + .2, 0], .02, IRON, M);
    b.sphere(0, top + .05, 0, .03, 4, C.gold, M);
    b.at(0, top + .16, 0, -.4); b.panel(.08, -.03, 0, .14, .06, IRON, M); b.at(0, 0, 0, PI); b.panel(-.08, -.03, 0, .14, .06, IRON, M); b.pop(); b.pop();
    b.pop();
    b.at(TX + hs, 0, TZ, PI / 2); ivy(b, -.2, P, 0, .2, 1.1, 16); b.pop();
  }

  /* ================= 2077 Lv3：院角的地下城入口 ================= */
  function dungeon(b, o) {                                   /* 半埋在草丘里的残破尖拱、拱下石阶进黑暗、半升的铁吊闸、两支火把 */
    reseed(60);
    const w = .38, h = .26, p = .66, pw = .11, kt = archY(w + .12, p, 0);
    b.at(-1.45, 0, 1.32, .35);                                /* 局部 +z 朝前（略偏 +x） */
    /* 草丘：拱后一座、两边各一坨，把墩子埋到起拱处 */
    b.sphere(0, -.02, -.44, .32, 8, TURF, { sy: 1.42, grad: TURFD });
    for (const s of [-1, 1]) { b.sphere(s * .28, -.05, -.16, s < 0 ? .16 : .2, 7, mix3(TURF, TURFD, .4), { sy: s < 0 ? 1.6 : 1.3 }); b.sphere(s * .36, -.04, .0, .11, 6, TURFD, { sy: .9 }); }
    for (let i = 0; i < 12; i++) { const a = R() * TAU, r = .08 + R() * .24; leafTuft(b, Math.cos(a) * r, .22 + R() * .2, -.44 + Math.sin(a) * r * .6, .035, 1.1); }
    /* 门洞：拱里的黑、往下三级台阶、门前一块残破石台 */
    fan(b, outline(w, h, 0, p, 4), -.11, VOID);
    b.quad([-w / 2, .003, .06], [w / 2, .003, .06], [w / 2, .003, -.14], [-w / 2, .003, -.14], VOID);
    for (let i = 0; i < 3; i++) b.box(0, .045 - i * .02, .04 - i * .055, w - .02, .012, .055, mix3(DRESS2, VOID, .3 + i * .25), { nb: true });
    b.box(0, 0, .14, w + .1, .045, .14, mix3(ST2, STD, .35), { top: mix3(DRESS2, STD, .25), nb: true });
    /* 墩子、残拱（右边缺两块拱石）、拱肩 */
    for (const s of [-1, 1]) b.box(s * (w / 2 + pw / 2), 0, -.03, pw, h + .03, .18, sc(.3), { nb: true, top: DRESS2 });
    b.at(0, 0, .03); archRing(b, w, h, p, .06, -.12, .06, i => i === 5 || i === 6); b.pop();
    archFill(b, w + .12, p, h, h + kt + .05, -.12, -.24, mix3(ST2, STD, .3), INNER, 4);
    for (const [x, z, s, a] of [[.24, .34, 1, .6], [.36, .26, .7, 1.4], [-.3, .3, .6, .3]]) { b.at(x, 0, z, a, s, .25); b.box(0, 0, 0, .1, .065, .075, mix3(DRESS2, STD, R() * .4)); b.pop(); }
    /* 半升的铁吊闸：竖条、横条、底下一排尖 */
    const gy = .17;
    for (let i = 0; i < 5; i++) { const x = -w / 2 + .045 + i * (w - .09) / 4, yt = h + archY(w, p, x) - .02; b.beam([x, gy, -.06], [x, yt, -.06], .016, IRON, M); b.pyramid(x, gy - .04, -.06, .02, .02, .04, IRON, M); }
    for (const yy of [gy + .04, gy + .15, gy + .26]) b.beam([-w / 2 + .02, yy, -.06], [w / 2 - .02, yy, -.06], .014, IRON, M);
    /* 两边墩子上的火把（ember 各 2 颗） */
    for (const s of [-1, 1]) {
      const x = s * (w / 2 + pw / 2), y = .44;
      b.box(x, y - .06, .065, .03, .08, .02, IRON, M);
      b.beam([x, y - .04, .065], [x, y + .02, .12], .012, IRON, M);
      b.beam([x, y - .08, .12], [x, y + .1, .12], .026, OAK);
      b.cyl(x, y + .09, .12, .024, .03, 5, mix3(C.woodD, [0, 0, 0], .3));
      if (!o.bad) { b.cone(x, y + .12, .12, .028, .085, 5, C.lamp, { e: .6 }); b.emit(x, y + .22, .12, "ember", 2, .8); }
    }
    b.pop();
  }

  /* ================= 拼装 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { lv, cy, bad };
    house(b, oo);
    yard(b, oo);
    furniture(b, oo);
    questBoard(b, oo);
    if (lv >= 2) { pergola(b, oo); leanTo(b, oo); }
    if (cy) {
      catLamp(b, -.12, .34, .82, bad);
      if (lv >= 2) betBoard(b, oo);
      if (lv >= 3) dungeon(b, oo);
    } else if (lv >= 3) tower(b, oo);
  }
  /* label 高度 = 最高点 + .2（audit 实测） */
  build.h = o => (o.lv >= 3 && !o.cyber ? 3.9 : 2.3);
  Isle3D.FAC["酒馆"] = build;
})();
