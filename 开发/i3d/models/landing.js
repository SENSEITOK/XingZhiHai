/* 停鸡坪（1994、2077 同名）：霍格沃茨式的狮鹫车起降坪。起降台在 (0, .25)，r 1.05，台面低平；候车亭在左后 (−1.3, −.9)；正面朝 +z（岛心）。
   1994 Lv1：圆形石鼓座（两层错缝石砌、外撇勒脚），台面三圈石板（C.stone、C.stoneD 相间，中间隔着深色石缝圈），正中两色石嵌一朵八瓣风玫瑰；
             一圈矮护墙（料石压顶），前后各开一个口，口外一级石阶；前口两座矮墩上各立一根铁灯柱，后口两墩顶一只石球。
             左后一座小哥特候车亭：石基、错缝石墙、浅色隅石、前角斜扶壁、尖拱铁钉木门（料石门券、石阶）、门边铁臂提灯和一块班次牌、
             两侧和背面尖拱烛光窗；近似四角攒尖的石板瓦顶，前坡一座小山墙老虎窗嵌一只钟面，顶上铁尖顶饰；墙根常春藤，侧墙一张长椅。
             台上停一辆单狮鹫小车：压暗的酒红漆木车厢、描金线、筒形圆顶、两只辐条大轮、两盏车灯、两根车辕套着一只狮鹫
             （鹰头、耳羽、鹰翼、鹰爪前腿；狮身、狮后腿、带尾穗的狮尾，颈上一道挽具）。
             台边一只木草料槽和几个草捆，右侧铁杆上一只红白风向袋随风摆。
        Lv2：候车亭右边加一间售票小房（尖拱售票窗、小木台、铁格栅、挑出来的小木招牌、人字石板瓦顶）；
             左侧加一座开敞的四柱尖拱凉廊（94:37836 平台上的吸烟室：石板瓦四坡顶、廊下长椅和铁烟灰架、梁下一盏提灯）；
             台上再停一辆双狮鹫大马车（深蓝漆、四轮、车窗、车夫座、车顶行李栏和箱子），亭前一辆行李推车。
             规格书写凉廊在右后；那块地方要留给 Lv3 的起飞跑道，所以挪到左侧。
        Lv3：右后起「起飞跑道」（94:28808–28810）：三座细圆塔排成三角（错缝石砌、腰线、箭缝、托石挑檐、锥形石板瓦顶带三角小旗），
             三塔之间一根石芯柱，一道石阶绕着它盘旋上去（从前面两塔之间的口子看得见），接到三塔托着的小圆台（铁栏杆、两面小旗）。
   2077：同一套石头。第二辆车换成一艘猫球小艇（奶油色扁球身、两只尖耳、黄铜龙骨和尾舵），系在台上一根黄铜系泊桩上；狮鹫照旧。
         候车亭前加一道黄铜框玻璃雨棚，亭顶换黄铜小飞艇风向标，亭门口一根黄铜细杆托一盏猫球灯；灯柱、提灯、栏杆换黄铜；
         Lv3 顶台换黄铜栏杆、加一盏琥珀小灯。不加霓虹、全息、罩子，不放桅杆，不用 beacon。动件 0，粒子只有 2077 的 cat 1 处。
   待修：渲染器统一压暗；模型里风向袋耷拉、一根灯柱歪着不亮、小车掉了一只轮子歪在台上、狮鹫卸了套卧在一边、台面翘起两块石板；
         Lv3 石阶缺了几级、塔顶小旗歪倒、栏杆断一截；2077 猫球灯灭、小艇瘪下来斜落。前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45), FLOOR = mix3(C.stone, ST2, .55);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLM = mix3(SL, SL2, .5), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);          /* 烛光窗（与 castle.js 同色） */
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BRONZE = mix3(C.gold, C.wood, .38), AGED = mix3(BRASS, [.32, .27, .21], .42);
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" }, GS = { mat: "glass" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4);
  const MULL = mix3(IRON, OAK, .3), ROPE = [.72, .63, .46];
  const HAY = mix3(C.hay, [.86, .62, .26], .22), HAYD = mix3(C.hay, C.wood, .3);
  const PAVE = C.stone, PAVED = C.stoneD;                 /* 台面两色石板 */
  const ROSE1 = mix3(C.stone, C.cream, .35), ROSE2 = mix3(STD, [.22, .22, .25], .35);   /* 风玫瑰：浅、深两色石 */
  const CAB = mix3(C.banner, [.1, .07, .07], .35), CABD = mix3(CAB, [0, 0, 0], .45);    /* 单狮鹫小车：压暗的酒红漆 */
  const COACH = mix3(C.banner2, [.08, .08, .1], .35), COACHD = mix3(COACH, [0, 0, 0], .45);
  const TRIM = mix3(C.gold, [.5, .4, .25], .35);           /* 车身描金线：哑一点的金 */
  const GLASS = mix3(C.glass, C.white, .2), CWIN = mix3(C.glass, STD, .6);
  const SOCK1 = mix3(C.banner, C.cloth, .35), SOCK2 = mix3(C.cream, C.stone, .25);
  const LEATH = mix3(C.wood, [.3, .18, .12], .4), LEATH2 = mix3(C.banner2, C.woodD, .5);
  const CLOCK = mix3(C.lamp, C.cream, .8);                  /* 钟面：往奶白混过的暖色，夜里微亮 */
  const CATC = mix3(C.cream, [.66, .58, .47], .42);         /* 猫球小艇：哑光的旧奶油色，不刺眼 */

  /* 布局 */
  const PX = 0, PZ = .25, PR = 1.05, PH = .22;              /* 起降台 */
  const VX = -1.3, VZ = -.9, VRY = .5, VW = .66, VD = .6, V0 = .1, VH = .92;   /* 候车亭 */
  const LX = -1.55, LZ = .22;                               /* 凉廊 */
  const KX = .7, KZ = -1.28, KD = .42, TR = .15, TT = 2.86, PLY = 2.56, PLR = .45;   /* 起飞跑道：三塔中心、塔距、塔半径、塔高、顶台 */
  const TA = [PI, PI / 3, -PI / 3];                         /* 三塔方位：后、右前、左前（0 朝 +z） */
  const NST = 20, SR0 = .07, SR1 = .255, DA = .84;          /* 盘旋石阶：级数、内外半径、每级转角 */
  const OPEN = [[0, .3], [PI, .26]];                        /* 护墙开口：中心角、半宽 */

  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 4001 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const angD = (a, b) => { let d = (a - b) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; };
  const PP = (a, r, y) => [PX + Math.sin(a) * r, y, PZ + Math.cos(a) * r];   /* 角度 a：0 朝 +z，PI/2 朝 +x */
  const KP = (a, r, y) => [KX + Math.sin(a) * r, y, KZ + Math.cos(a) * r];
  const inOpen = a => OPEN.some(([c, w]) => Math.abs(angD(a, c)) < w);

  function sc(y) {                                          /* 一块石头的颜色：深浅不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .45 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .92) c = mix3(c, STD, .4);
    return mix3(c, mix3(STD, C.ivy, .35), Math.max(0, Math.min(.3, (1.0 - y) * .25)));
  }

  /* ---------- 基本形 ---------- */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }   /* 两面都看得见的薄片（翅膀、旗） */
  function along(b, p, q) {                                 /* 以 p 为原点、p→q 为 y 轴推一层变换，返回长度 */
    const d = sub(q, p), L = Math.hypot(d[0], d[1], d[2]);
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    return L;
  }
  function limb(b, p, q, r0, r1, seg, col, o) {              /* 两点之间一段收分圆柱（腿、脖子、尾巴、车辕）；不封口 */
    const L = along(b, p, q);
    if (L > 1e-6) b.cyl(0, 0, 0, r0, L, seg, col, Object.assign({ r2: r1, nt: true, nb: true }, o || {}));
    b.pop();
  }
  const rod = (b, p, q, t, col, o) => limb(b, p, q, t * .62, t * .62, 4, col, Object.assign({ a0: PI / 4 }, o || {}));   /* 细杆：四面、8 个三角形 */
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) {  /* 扶壁的一级：外低内高的斜顶块 */
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, x, z, ry, h) {                       /* 两级扶壁 */
    b.at(x, 0, z, ry);
    wedge(b, .12, -.1, -.02, .2, h * .45 + .1, h * .3 + .1, mix3(ST2, STD, .3));
    wedge(b, .09, -.1, -.02, .12, h + .1, h * .84 + .1, sc(.6));
    b.pop();
  }

  /* ---------- 尖拱、砌石 ---------- */
  function archPts(w, p, n) {                               /* 尖拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff) {  /* 洞穿的尖拱上方：前后拱肩＋拱腹 */
    const pts = archPts(w, p, 3);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、拱心石 */
    const n = 3, ai = archPts(w, p, n), ao = archPts(w + fr * 2, p, n), rev = mix3(DRESS2, STD, .35);
    for (const s of [-1, 1]) {
      const xi = s * w / 2;
      for (let j = 0; j < 2; j++) {
        const ya = h * j / 2, yb = h * (j + 1) / 2, xq = s * (w / 2 + fr * (j % 2 ? .8 : 1.1));
        qf(b, [xi, ya, z1], [xq, ya, z1], [xq, yb, z1], [xi, yb, z1], j % 2 ? DRESS : DRESS2, [0, 0, 1]);
        qf(b, [xq, ya, z0], [xq, ya, z1], [xq, yb, z1], [xq, yb, z0], DRESS2, [s, 0, 0]);
      }
    }
    for (let i = 0; i < ai.length - 1; i++) {
      const A = ai[i], B = ai[i + 1], Ao = ao[i], Bo = ao[i + 1];
      qf(b, [A[0], h + A[1], z1], [Ao[0], h + Ao[1], z1], [Bo[0], h + Bo[1], z1], [B[0], h + B[1], z1], i % 2 ? DRESS : DRESS2, [0, 0, 1]);
      const mx = (Ao[0] + Bo[0]) / 2, my = (Ao[1] + Bo[1]) / 2;
      qf(b, [Ao[0], h + Ao[1], z0], [Bo[0], h + Bo[1], z0], [Bo[0], h + Bo[1], z1], [Ao[0], h + Ao[1], z1], rev, [mx, my + .05, 0]);
    }
    b.box(0, h + archY(w + fr * 2, p, 0) - .06, (z0 + z1) / 2 + .006, .06, .085, z1 - z0 + .012, DRESS, { nb: true });
  }
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）一层层错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .1 : .19) : 0, q1 = o.qr ? ((j + ph) % 2 ? .19 : .1) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .2));
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
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆塔身：一圈圈石砌，层层错半块 */
    const n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU, px = cx + Math.sin(a) * r, pz = cz + Math.cos(a) * r, qx = cx + Math.sin(a2) * r, qz = cz + Math.cos(a2) * r;
        b.quad([px, ya, pz], [qx, ya, qz], [qx, yb, qz], [px, yb, pz], sc(ya));
      }
    }
  }

  /* ---------- 窗、门、灯、旗、藤 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .035, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, o.glass || WIN, { e });
    b.panel(0, 0, .028, .014, h + archY(w, p, 0) * .8, o.mull || MULL, o.mo);
    b.panel(0, h * .55, .029, w, .012, o.mull || MULL, o.mo);
    b.box(0, -fr - .03, .02, w + fr * 2 + .04, .03, .05, DRESS, { nb: true });
    if (o.hood) {
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .05, p, 3), zh = .035;
      for (let i = 0; i < ai.length - 1; i++) b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
    }
    b.pop();
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 3), 0, wd);
    for (let i = 1; i < 4; i++) { const x = -w / 2 + i * w / 4; b.panel(x, 0, .004, .009, h + archY(w, p, x) - .02, dark); }
    for (const y of [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .024, .012, IRON, Object.assign({ nb: true }, M));
      for (let i = 0; i < 3; i++) b.panel(-w / 2 + .05 + i * (w - .1) / 2, y + .006, .0125, .013, .013, C.metal, M);
    }
    b.box(w * .22, h * .5, .012, .03, .03, .012, IRON, Object.assign({ nb: true }, M));
  }
  function lantern(b, x, y, z, cy, lit) {                   /* 方提灯（暖光）：1994 铁，2077 黄铜；lit=false 不亮。约 40 个三角形 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .045, .022, 4, fr, Object.assign({ nt: true, a0: PI / 4 }, fo));
    b.cyl(x, y + .022, z, .033, .1, 4, lit === false ? mix3(C.glass, STD, .5) : C.lamp, { r2: .041, e: lit === false ? 0 : .66, nt: true, nb: true, a0: PI / 4 });
    b.cyl(x, y + .122, z, .056, .016, 4, fr, Object.assign({ a0: PI / 4, nt: true }, fo));
    b.pyramid(x, y + .138, z, .078, .078, .07, fr, fo);
    b.cone(x, y + .2, z, .012, .045, 3, fr, Object.assign({ nb: true }, fo));
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .04, .1, .02, fr, Object.assign({ nb: true }, fo));
    rod(b, [x, y + .1, z], [x, y + .1, z + .16], .018, fr, fo);
    rod(b, [x, y + .03, z], [x, y + .1, z + .1], .012, fr, fo);
    rod(b, [x, y + .1, z + .15], [x, y + .02, z + .15], .009, fr, fo);
    lantern(b, x, y - .2, z + .15, cy);
  }
  function lampPost(b, x, y, z, cy, h, lean, lit) {          /* 铁灯柱：石座、细柱、卷花托、顶上一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.at(x, y, z, 0, 1, lean ? lean[0] : 0, lean ? lean[1] : 0);
    b.cyl(0, 0, 0, .04, .1, 6, fr, Object.assign({ r2: .022, nb: true }, fo));
    limb(b, [0, .1, 0], [0, h, 0], .018, .016, 5, fr, fo);
    for (const s of [-1, 1]) rod(b, [0, h - .12, 0], [s * .05, h - .02, 0], .01, fr, fo);
    b.cyl(0, h - .03, 0, .032, .03, 5, fr, Object.assign({ nb: true }, fo));
    lantern(b, 0, h, 0, cy, lit);
    b.pop();
  }
  function flag(b, x, y, z, col, h, droop) {                /* 小旗：铁杆、金球、随风摆的尖角旗；droop 杆子歪倒 */
    h = h || .5;
    b.at(x, y, z, 0, 1, droop || 0, (droop || 0) * .8);
    rod(b, [0, -.04, 0], [0, h, 0], .018, IRON, M);
    b.cone(0, h, 0, .018, .03, 4, C.gold, M);
    const L = .28, Hh = .12, top = h - .04, segs = 2;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = .01 + L * t0, x1 = .01 + L * t1, w0 = Math.sin(t0 * 5.5) * .025, w1 = Math.sin(t1 * 5.5) * .025, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, w0], B = [x1, top - h1, w1], Cc = [x1, top, w1], D = [x0, top, w0], cc = i === 1 ? mix3(col, C.gold, .4) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
    b.pop();
    return y + h + .03;
  }
  function pennant(b, x, y, z, col, ry, droop) {            /* 塔尖上的三角小旗 */
    b.at(x, y, z, ry || 0, 1, droop || 0);
    rod(b, [0, -.05, 0], [0, .3, 0], .014, IRON, M);
    b.cone(0, .3, 0, .016, .03, 4, C.gold, M);
    tri2(b, [0, .28, 0], [0, .17, 0], [.24, .23, .01], col, { k: 1.3 });
    b.pop();
    return y + .33;
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, r, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .028;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], r + .012 + R() * .012, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }

  /* ---------- 屋顶 ---------- */
  function hipRoof(b, cx, cz, HX, HZ, r, ye, yr, nR) {      /* 陡四坡石板瓦顶（r 很小就是四角攒尖）：屋脊沿 x，檐口一道微翘；一道道深浅瓦层 */
    nR = nR || 4;
    const S = [0, .1], Y = [ye, ye + .05];
    for (let i = 1; i <= nR; i++) { S.push(.1 + .9 * i / nR); Y.push(ye + .05 + (yr - ye - .05) * i / nR); }
    const yOf = s => { for (let i = 0; i < S.length - 1; i++) if (s <= S[i + 1] + 1e-9) return Y[i] + (Y[i + 1] - Y[i]) * (s - S[i]) / (S[i + 1] - S[i]); return yr; };
    for (let f = 0; f < 4; f++) {
      const w0 = f % 2 ? HZ : HX, d0 = f % 2 ? HX : HZ, rw = f % 2 ? 0 : r, rd = f % 2 ? r : 0;
      const P = (s, u) => { const hw = w0 + (rw - w0) * s, z = d0 + (rd - d0) * s; return [-hw + 2 * hw * u, yOf(s), z]; };
      b.at(cx, 0, cz, f * PI / 2);
      for (let i = 0; i < S.length - 1; i++) {
        const s0 = S[i], s1 = Math.min(1, S[i + 1] + (i < S.length - 2 ? .02 : 0));
        const dzh = (d0 - rd) * (s1 - s0), dy = yOf(s1) - yOf(s0), L = Math.hypot(dzh, dy), lift = i ? .012 : 0, nY = dzh / L * lift, nZ = dy / L * lift;
        const hw0 = w0 + (rw - w0) * s0, n = Math.max(1, Math.round(2 * hw0 / .19));
        let u0 = 0;
        for (let k = 0; k < n; k++) {
          const u1 = k === n - 1 ? 1 : (k + 1 + (R() - .5) * .5 * (i % 2 ? 1 : -1)) / n;
          const A = P(s0, u0), B = P(s0, u1), Cc = P(s1, u1), D = P(s1, u0);
          A[1] += nY; A[2] += nZ; B[1] += nY; B[2] += nZ;
          const base = i % 2 ? SL : SL2, rr = R(), col = rr < .2 ? mix3(base, SLD, .55) : rr > .86 ? mix3(base, [.5, .52, .56], .15) : rr > .78 ? mix3(base, C.ivy, .25) : mix3(base, SLD, rr * .25);
          if (Cc[0] - D[0] > 1e-4 || B[0] - A[0] > 1e-4) b.quad(A, B, Cc, D, col);
          u0 = u1;
        }
      }
      rod(b, P(0, 1), P(1, 1), .04, SLD);
      rod(b, [-w0, ye - .022, d0 + .004], [w0, ye - .022, d0 + .004], .035, OAK);
      b.pop();
    }
    if (r > .01) rod(b, [cx - r - .02, yr, cz], [cx + r + .02, yr, cz], .06, SLD);
    b.quad([cx - HX, ye, cz - HZ], [cx + HX, ye, cz - HZ], [cx + HX, ye, cz + HZ], [cx - HX, ye, cz + HZ], INNER);
    return yr;
  }
  function slateRoof(b, W, Hw, D, Hr, ov, o) {               /* 人字石板瓦顶（屋脊沿 x）：一道道瓦层、瓦口、封檐板 */
    o = o || {};
    const sl = Hr / (D / 2), ze = D / 2 + ov, ye = Hw - ov * sl, yR = Hw + Hr, nb = o.bands || 4, xa = -W / 2, xb = W / 2, lip = .014;
    for (const s of [-1, 1]) {
      const nn = Math.hypot(ze, yR - ye), nY = ze / nn, nZ = s * (yR - ye) / nn, dn = [0, -(yR - ye), s * ze];
      for (let i = 0; i < nb; i++) {
        const t0 = i / nb, t1 = (i + 1) / nb, zr = s * ze * (1 - t0), yr = ye + (yR - ye) * t0, za = zr + nZ * lip, ya = yr + nY * lip, zb = s * ze * (1 - t1), yb = ye + (yR - ye) * t1;
        qf(b, [xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb], i % 2 ? SL : SLM, [0, 1, s]);
        qf(b, [xa, yr, zr], [xb, yr, zr], [xb, ya, za], [xa, ya, za], SLD, dn);
      }
      qf(b, [xa, ye, s * ze], [xb, ye, s * ze], [xb, Hw, s * D / 2], [xa, Hw, s * D / 2], OAK, [0, -1, 0]);
      rod(b, [xa, ye - .014, s * ze], [xb, ye - .014, s * ze], .028, OAK);
    }
    b.at(0, yR + .01, 0, 0, 1, PI / 4); b.box(0, -.025, 0, W + .02, .05, .05, SL2, { nb: true }); b.pop();
    return yR;
  }
  function coping(b, x, Hw, D, Hr, ov) {                     /* 山墙压顶石、墙肩托石、山尖小尖顶饰 */
    const sl = Hr / (D / 2), yR = Hw + Hr, o2 = ov + .02;
    for (const f of [-1, 1]) {
      b.beam([x, Hw - o2 * sl + .04, f * (D / 2 + o2)], [x, yR + .06, 0], .07, DRESS);
      b.box(x, Hw - .11, f * (D / 2 + .025), .1, .12, .12, DRESS2, { nb: true });
    }
    b.pyramid(x, yR + .07, 0, .07, .07, .11, DRESS2);
  }
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 锥形石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带 */
    b.cyl(cx, y, cz, r * 1.12, h * .06, seg, SL2, { r2: r * .96, nt: true, bot: STD });
    if (cy) b.cyl(cx, y + h * .06, cz, r * .975, .025, seg, BRASS, { mat: "gloss", nt: true, nb: true });
    const y0 = y + h * .06, H = h * .94, nb = 4;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true });
    }
    return y + h;
  }

  /* ---------- 小件 ---------- */
  function bench(b, x, z, ry, L) {                          /* 长椅：座板、靠背、腿（背朝本地 −z） */
    b.at(x, 0, z, ry);
    b.box(0, .17, 0, L, .03, .13, OAK2, { top: mix3(OAK2, C.woodL, .2) });
    for (const s of [-1, 1]) { b.box(s * (L / 2 - .06), 0, .01, .035, .17, .1, OAK, { nb: true }); rod(b, [s * (L / 2 - .06), .17, -.055], [s * (L / 2 - .06), .4, -.075], .03, OAK); }
    b.box(0, .26, -.065, L - .04, .045, .02, OAK2, { nb: true });
    b.box(0, .34, -.07, L - .04, .045, .02, OAK2, { nb: true });
    b.pop();
  }
  function bale(b, x, y, z, ry) {                           /* 草捆：两道捆绳 */
    b.at(x, y, z, ry); b.box(0, 0, 0, .24, .12, .14, mix3(HAY, HAYD, R() * .4), { top: mix3(HAY, C.white, .1), nb: true });
    for (const dx of [-.06, .06]) { b.quad([dx - .006, .1205, .0705], [dx + .006, .1205, .0705], [dx + .006, .1205, -.0705], [dx - .006, .1205, -.0705], HAYD); b.panel(dx, 0, .0705, .012, .12, HAYD); }
    b.pop();
  }
  function manger(b, x, z, ry) {                            /* 木草料槽：四条腿、斜板槽、堆着的草 */
    b.at(x, 0, z, ry);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(sx * .22, 0, sz * .07, .035, .2, .035, OAK, { nb: true });
    b.box(0, .12, 0, .5, .03, .1, OAK2, { nb: true });
    for (const s of [-1, 1]) { b.at(0, .13, s * .05, 0, 1, s * -.45); b.box(0, 0, 0, .5, .11, .018, OAK2, { nb: true }); b.pop(); }
    for (const s of [-1, 1]) b.box(s * .25, .12, 0, .02, .12, .19, OAK, { nb: true });
    b.at(0, .21, 0, 0, [1, .4, .32]); b.sphere(0, 0, 0, .25, 6, HAY, { grad: HAYD }); b.pop();
    for (let i = 0; i < 4; i++) b.at(-.15 + i * .1, .25, (R() - .5) * .06, R(), 1, (R() - .5) * .6).cone(0, 0, 0, .025, .07, 3, HAY, { k: 1.15, nb: true }).pop();
    b.pop();
  }
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, -.05, z, .045, .08, 6, DRESS2, { nb: true });
    limb(b, [x, 0, z], [x, h, z], .016, .013, 5, BRASS, GL);
    rod(b, [x, h, z], [x + .1, h + .06, z], .016, BRASS, GL);
    rod(b, [x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, GL);
    b.cone(x, h, z, .02, .04, 4, BRASS, GL);
    if (!off) b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }
  function amberLamp(b, x, y, z) {                          /* 琥珀小灯：黄铜座、玻璃罩里一点暖光、黄铜顶 */
    b.cyl(x, y, z, .045, .03, 6, BRASS, Object.assign({ nb: true }, GL));
    limb(b, [x, y + .03, z], [x, y + .15, z], .014, .012, 4, BRASS, GL);
    b.cyl(x, y + .15, z, .036, .08, 6, C.glow, { r2: .042, e: .55, nt: true, nb: true });
    b.cyl(x, y + .23, z, .054, .016, 6, BRASS, Object.assign({ nt: true }, GL));
    b.cone(x, y + .246, z, .05, .05, 6, BRASS, Object.assign({ nb: true }, GL));
  }
  function airshipVane(b, x, y, z, h, ry) {                 /* 小飞艇风向标：杆、方位十字、一只黄铜小飞艇 */
    rod(b, [x, y - .04, z], [x, y + h, z], .016, AGED, GL);
    rod(b, [x - .07, y + h * .45, z], [x + .07, y + h * .45, z], .01, AGED, GL);
    rod(b, [x, y + h * .45, z - .07], [x, y + h * .45, z + .07], .01, AGED, GL);
    b.at(x, y + h + .045, z, ry);
    b.at(0, 0, 0, 0, [.38, .38, 1]); b.sphere(0, 0, 0, .1, 6, CATC, GL); b.pop();
    b.box(0, -.065, .015, .022, .02, .05, BRASS, GL);
    b.box(0, .028, -.085, .006, .04, .04, BRASS, GL); b.box(0, 0, -.085, .07, .006, .034, BRASS, GL);
    b.pop();
  }

  /* ================= 起降台 ================= */
  function padBase(b, o) {
    const N = 20;
    reseed(1);
    b.cyl(PX, -.14, PZ, PR + .08, .15, N, mix3(ST2, STD, .45), { r2: PR + .05, nt: true, nb: true });   /* 外撇勒脚 */
    for (let i = 0; i < N; i++) { const a = i / N * TAU, a2 = (i + 1) / N * TAU; qf(b, PP(a, PR, .01), PP(a2, PR, .01), PP(a2, PR + .05, .01), PP(a, PR + .05, .01), mix3(DRESS2, ST2, R() * .5), [0, 1, 0]); }
    for (let j = 0; j < 2; j++) {                            /* 鼓座：两层错缝石砌 */
      const ya = .01 + j * (PH - .01) / 2, yb = ya + (PH - .01) / 2, off = j * .5;
      for (let i = 0; i < N; i++) {
        const a = (i + off) / N * TAU, a2 = (i + 1 + off) / N * TAU;
        b.quad(PP(a, PR, ya), PP(a2, PR, ya), PP(a2, PR, yb), PP(a, PR, yb), sc(.1 + j * .3));
      }
    }
    /* 台面：三圈石板，中间隔着深色石缝圈；外圈压在护墙下 */
    const band = (r0, r1, n, colf) => { for (let i = 0; i < n; i++) { const a = i / n * TAU, a2 = (i + 1) / n * TAU; qf(b, PP(a, r0, PH), PP(a2, r0, PH), PP(a2, r1, PH), PP(a, r1, PH), colf(i), [0, 1, 0]); } };
    const v = (c, i) => mix3(c, i % 2 ? mix3(c, STD, .25) : mix3(c, C.cream, .08), .5 + R() * .5);
    band(.48, .52, 16, () => ROSE2);
    band(.52, .74, 14, i => v(PAVE, i));
    band(.74, .77, 20, () => mix3(PAVED, ROSE2, .5));
    band(.77, .95, 18, i => v(PAVED, i));
    /* 正中：风玫瑰（四长四短八个尖，每个尖一半浅一半深） */
    b.disc(PX, PH, PZ, .48, 16, mix3(PAVE, PAVED, .45));
    const y = PH + .004;
    for (let k = 0; k < 8; k++) {
      const a = k * PI / 4 + PI, L = k % 2 ? .27 : .44, ri = .075;
      const T = PP(a, L, y), Lf = PP(a - PI / 8, ri, y), Rt = PP(a + PI / 8, ri, y), O = [PX, y, PZ];
      tf(b, O, Lf, T, ROSE1, [0, 1, 0]); tf(b, O, T, Rt, ROSE2, [0, 1, 0]);
    }
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, a2 = (i + 1) / 16 * TAU; qf(b, PP(a, .44, y - .001), PP(a2, .44, y - .001), PP(a2, .46, y - .001), PP(a, .46, y - .001), ROSE1, [0, 1, 0]); }
    b.cyl(PX, PH, PZ, .045, .012, 8, o.cy ? BRASS : ROSE2, Object.assign({ nb: true }, o.cy ? GL : {}));
    /* 鼓座根上几簇苔藓 */
    for (let i = 0; i < 18; i++) { const a = R() * TAU, s = .04 + R() * .04, p = PP(a, PR + .07, 0); b.at(p[0], -.01, p[2], a); b.pyramid(0, 0, 0, s * 2.4, s * 1.6, s * (.45 + R() * .4), mix3(C.ivy, C.leafD, R() * .6)); b.pop(); }
  }
  function parapet(b, o) {                                  /* 矮护墙：两面砌石、料石压顶、开口两边矮墩、口外一级石阶 */
    const r0 = .95, r1 = PR, y0 = PH, y1 = PH + .1, N = 32, cy = o.cy;
    reseed(2);
    for (let i = 0; i < N; i++) {
      const a = i / N * TAU, a2 = (i + 1) / N * TAU;
      if (inOpen(a) || inOpen(a2)) continue;
      b.quad(PP(a, r1, y0), PP(a2, r1, y0), PP(a2, r1, y1), PP(a, r1, y1), sc(.4));
      b.quad(PP(a2, r0, y0), PP(a, r0, y0), PP(a, r0, y1), PP(a2, r0, y1), mix3(ST2, ST, R() * .6));
      const c = mix3(DRESS, DRESS2, R());
      qf(b, PP(a, r0 - .015, y1 + .035), PP(a2, r0 - .015, y1 + .035), PP(a2, r1 + .015, y1 + .035), PP(a, r1 + .015, y1 + .035), c, [0, 1, 0]);
      b.quad(PP(a, r1 + .015, y1), PP(a2, r1 + .015, y1), PP(a2, r1 + .015, y1 + .035), PP(a, r1 + .015, y1 + .035), mix3(c, ST2, .3));
      b.quad(PP(a2, r0 - .015, y1), PP(a, r0 - .015, y1), PP(a, r0 - .015, y1 + .035), PP(a2, r0 - .015, y1 + .035), mix3(c, ST2, .3));
    }
    for (const [c, w] of OPEN) {
      for (const s of [-1, 1]) {                             /* 开口两边的矮墩（高 ≤ .4） */
        const a = c + s * (w + .02), p = PP(a, (r0 + r1) / 2, 0);
        b.at(p[0], 0, p[2], a);
        b.box(0, PH, 0, .14, .14, .14, mix3(ST2, ST, .3 + R() * .3), { nb: true });
        b.box(0, PH + .14, 0, .17, .03, .17, DRESS, { nb: true });
        if (c !== 0) b.pyramid(0, PH + .17, 0, .1, .1, .07, DRESS2);
        b.pop();
      }
      const p = PP(c, PR + .09, 0);                          /* 口外一级石阶 */
      b.at(p[0], 0, p[2], c); b.box(0, -.04, 0, .52, .15, .16, mix3(ST2, STD, .3), { top: DRESS, nb: true }); b.pop();
    }
    /* 前口两根灯柱（立在矮墩上） */
    const bad = o.bad;
    for (const s of [-1, 1]) {
      const a = s * (OPEN[0][1] + .02), p = PP(a, (r0 + r1) / 2, 0), off = bad && s > 0;
      lampPost(b, p[0], PH + .17, p[2], cy, .5, off ? [.18, -.25] : null, !off);
    }
  }

  /* ================= 狮鹫 ================= */
  /* 狮鹫：鹰的前半身（白头、耳羽、弯喙、收拢的翅膀、鹰爪前腿），狮的后半身（狮臀、粗后腿、肉垫、带尾穗的长尾）。不动（动件 0）。约 400 个三角形 */
  const GP = {
    gold: { coat: [.7, .54, .33], coat2: [.58, .43, .26], fea: [.5, .37, .24], fea2: [.9, .86, .76], prim: [.28, .2, .14], head: [.92, .9, .85], beak: [.88, .72, .3], claw: [.2, .17, .14], tuft: [.3, .21, .13] },
    dun: { coat: [.6, .52, .41], coat2: [.49, .42, .33], fea: [.38, .3, .23], fea2: [.82, .76, .64], prim: [.22, .17, .13], head: [.55, .42, .28], beak: [.85, .7, .32], claw: [.2, .16, .13], tuft: [.24, .17, .12] }
  };
  function gHead(b, P) {
    b.at(0, 0, 0, 0, [1, 1, 1.25]); b.sphere(0, 0, 0, .046, 5, P.head); b.pop();
    b.at(0, -.006, .05, 0, 1, PI / 2 + .3); b.cone(0, 0, 0, .022, .066, 4, P.beak, { nb: true }); b.pop();
    b.at(0, -.023, .108, 0, 1, PI * .82); b.cone(0, 0, 0, .009, .022, 3, mix3(P.beak, [.2, .18, .15], .4), { nb: true }); b.pop();
    for (const s of [-1, 1]) {
      b.at(s * .045, .01, .024, s * PI / 2); b.panel(0, -.007, 0, .015, .013, [.82, .5, .12]); b.panel(.002, -.004, .001, .006, .007, [.08, .06, .05]); b.pop();
      b.at(s * .028, .035, -.02, 0, 1, -.55, s * .45); b.cone(0, 0, 0, .014, .06, 3, mix3(P.head, P.fea, .55), { nb: true }); b.pop();   /* 耳羽 */
    }
  }
  function gWing(b, P, s) {                                 /* 收拢的一边翅膀：覆羽、次级飞羽、带锯齿的初级飞羽；两面都画 */
    const v = (x, y, z) => [s * x, y, z];
    const A = v(0, 0, .03), B = v(-.012, .025, -.14), Mi = v(.012, -.085, -.2), E = v(.022, -.165, -.04);
    const T1 = v(-.02, -.02, -.47), N1 = v(-.012, -.065, -.41), T2 = v(-.014, -.1, -.45), N2 = v(-.002, -.13, -.37), D = v(.01, -.17, -.31);
    tri2(b, A, B, Mi, P.fea); tri2(b, A, Mi, E, mix3(P.fea, P.fea2, .2));
    tri2(b, Mi, D, E, mix3(P.fea, P.prim, .45));
    const pr = mix3(P.prim, P.fea, .25);
    tri2(b, B, T1, N1, pr); tri2(b, B, N1, Mi, pr); tri2(b, Mi, N1, T2, P.prim); tri2(b, Mi, T2, N2, P.prim); tri2(b, Mi, N2, D, mix3(P.prim, P.fea, .45));
  }
  function griffin(b, x, y, z, ry, P, pose, harness) {
    const rest = pose === "rest", dy = rest ? -.22 : 0;
    b.at(x, y, z, ry);
    if (!rest) {
      for (const s of [-1, 1]) {                             /* 狮后腿：粗大腿、飞节、管骨、肉垫 */
        const hx = s * .066;
        limb(b, [hx, .41, -.18], [hx, .19, -.25], .064, .036, 5, P.coat);
        limb(b, [hx, .19, -.25], [hx, .035, -.215], .03, .024, 4, P.coat2);
        b.at(hx, 0, -.2); b.box(0, 0, 0, .06, .035, .075, P.coat2, { nb: true }); b.pop();
      }
      for (const s of [-1, 1]) {                             /* 鹰爪前腿：羽毛"裤子"、黄鳞小腿、三趾 */
        const fx = s * .06;
        limb(b, [fx, .37, .12], [fx, .17, .2], .052, .03, 5, mix3(P.fea, P.fea2, .45));
        limb(b, [fx, .18, .2], [fx, .02, .19], .018, .015, 3, P.beak);
        for (const a of [-.45, 0, .45]) { b.at(fx, .008, .19, a, 1, PI / 2); b.pyramid(0, 0, 0, .016, .016, .07, P.beak); b.pop(); }
      }
    } else {
      for (const s of [-1, 1]) {                             /* 卧着：后腿折在身下、前爪往前伸 */
        b.sphere(s * .078, .14, -.2, .072, 5, P.coat);
        limb(b, [s * .06, .16, .14], [s * .055, .03, .25], .04, .026, 5, mix3(P.fea, P.fea2, .45));
        b.box(s * .055, 0, .29, .04, .02, .07, P.beak, { nb: true });
      }
    }
    b.at(0, .385 + dy, -.05, 0, [1.05, 1.05, 2.3]); b.sphere(0, 0, 0, .11, 6, P.coat, { grad: P.coat2 }); b.pop();
    b.sphere(0, .4 + dy, -.21, .105, 5, P.coat);
    b.at(0, .42 + dy, .15, 0, [1, 1.08, 1]); b.sphere(0, 0, 0, .12, 6, P.fea2, { grad: mix3(P.fea2, P.fea, .5) }); b.pop();
    /* 狮尾：垂下再往后挑，末端一撮深色尾穗 */
    const t0 = [0, .43 + dy, -.3], t1 = [0, .24 + dy * .6, -.4], t2 = [0, .2 + dy * .5, -.52];
    limb(b, t0, t1, .016, .012, 3, P.coat, { k: 1.15 }); limb(b, t1, t2, .012, .011, 3, P.coat, { k: 1.25 });
    b.at(t2[0], t2[1], t2[2] - .025, 0, [1, 1, 1.5]); b.sphere(0, 0, 0, .026, 4, P.tuft, { k: 1.3 }); b.pop();
    /* 脖子和头 */
    const N = rest ? [0, .4, .3] : [0, .6, .3], H = rest ? [0, .43, .33] : [0, .635, .33], pitch = rest ? .3 : .15;
    limb(b, [0, .45 + dy, .19], N, .074, .05, 6, P.fea2);
    b.at(H[0], H[1], H[2], 0, 1, pitch); gHead(b, P); b.pop();
    for (const s of [-1, 1]) { b.at(s * .1, .52 + dy, .13, 0, [1, .78, .76]); gWing(b, P, s); b.pop(); }
    if (harness) {                                           /* 挽具：颈圈、胸带、背垫、两颗扣 */
      const hc = harness === "brass" ? BRASS : TRIM;
      b.at(0, .5, .26, 0, 1, -.95); b.cyl(0, -.012, 0, .086, .024, 8, LEATH, { nt: true, nb: true }); b.pop();
      b.at(0, .43, .2, 0, 1, .35 + PI / 2); b.cyl(0, -.012, 0, .12, .024, 8, LEATH2, { nt: true, nb: true }); b.pop();
      b.box(0, .48, -.08, .2, .03, .1, LEATH2, { nb: true });
      for (const s of [-1, 1]) b.box(s * .1, .46, -.08, .02, .03, .03, hc, Object.assign({ nb: true }, M));
    }
    b.pop();
  }

  /* ================= 车 ================= */
  function wheel(b, x, y, z, r, col, hub, seg) {            /* 辐条车轮（轮面朝 ±x） */
    b.at(x, y, z, 0, 1, 0, PI / 2);
    b.torus(0, 0, 0, r, .017, seg || 10, 3, col);
    b.cyl(0, -.03, 0, .026, .06, 6, hub || col, { nb: true, nt: true });
    for (let k = 0; k < 3; k++) { const a = k / 3 * PI; rod(b, [Math.cos(a) * -r, 0, Math.sin(a) * -r], [Math.cos(a) * r, 0, Math.sin(a) * r], .014, col); }
    b.pop();
  }
  function vault(b, hw, y0, rise, z0, z1, col, end) {        /* 筒形圆顶：半椭圆截面沿 z 拉伸，两头封 */
    const n = 5, pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n * PI; pts.push([-Math.cos(t) * hw, y0 + Math.sin(t) * rise]); }
    for (let i = 0; i < n; i++) { const [xa, ya] = pts[i], [xb, yb] = pts[i + 1]; qf(b, [xa, ya, z0], [xb, yb, z0], [xb, yb, z1], [xa, ya, z1], col, [(xa + xb) / 2, (ya + yb) / 2 - y0, 0], GL); }
    for (const [z, s] of [[z1, 1], [z0, -1]]) for (let i = 1; i < n; i++) tf(b, [0, y0, z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], end || col, [0, 0, s], GL);
  }
  function cabWin(b, x, y, z, w, h, s, lit) {               /* 车窗（贴在 ±x 侧板上）：圆头窗、描金框 */
    b.at(x, y, z, s * PI / 2);
    fan(b, outline(w + .02, h, -.01, .5, 2), .003, TRIM, M);
    fan(b, outline(w, h, 0, .5, 2), .006, lit ? WIN : CWIN, lit ? { e: .35 } : GL);
    b.pop();
  }
  function minilamp(b, x, y, z, cy, lit) {                  /* 车灯：小方灯（约 18 个三角形） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .022, .05, 4, lit ? C.lamp : mix3(C.glass, STD, .5), { r2: .026, e: lit ? .6 : 0, nt: true, a0: PI / 4 });
    b.pyramid(x, y + .05, z, .05, .05, .035, fr, fo);
    rod(b, [x, y + .02, z], [x - Math.sign(x) * .03, y + .03, z - .01], .008, fr, fo);
  }
  /* 单狮鹫小车：两轮、酒红漆木车厢、筒形圆顶、车灯、两根车辕，前面套一只狮鹫（本地朝 +z） */
  function gig(b, o, x, z, ry) {
    const bad = o.bad, cy = o.cy, hubc = cy ? BRASS : IRON;
    reseed(31);
    b.at(x, 0, z, ry);
    if (bad) b.at(-.23, 0, 0, 0, 1, 0, .2).at(.23, 0, 0);    /* 待修：左轮掉了，车身往左歪 */
    const Rw = .15, zw = -.06, hw = .16, y0 = .16, y1 = .42, zb = -.22, zf = .14;
    b.box(0, y0, (zb + zf) / 2, hw * 2, y1 - y0, zf - zb, CAB, { mat: "gloss", top: CABD });
    b.box(0, y0 - .025, (zb + zf) / 2, hw * 2 + .02, .03, zf - zb + .02, CABD, { mat: "gloss", nb: true });
    for (const s of [-1, 1]) {
      b.at(s * (hw + .002), 0, (zb + zf) / 2, s * PI / 2);
      b.panel(0, .26, 0, zf - zb - .04, .012, TRIM, M); b.panel(0, .36, 0, zf - zb - .04, .01, TRIM, M);   /* 描金线 */
      b.panel(-.06, .2, .001, .012, .17, CABD, GL);                                                        /* 车门缝 */
      b.pop();
      cabWin(b, s * (hw + .004), .28, -.06, .1, .06, s, false);
    }
    b.at(0, 0, zf); cabWin(b, 0, .3, .002, .14, .05, 0, !bad); b.pop();
    vault(b, hw + .02, y1, .11, zb - .02, zf + .03, CABD, CAB);
    b.box(0, y1 - .01, (zb + zf) / 2, hw * 2 + .05, .02, zf - zb + .06, TRIM, { mat: "metal", nb: true });
    b.cone(0, y1 + .11, (zb + zf) / 2, .02, .05, 4, TRIM, M);
    /* 前面的踏板、挡泥板、两盏车灯 */
    b.box(0, y0, zf + .07, hw * 2 - .02, .03, .14, CABD, { mat: "gloss", nb: true });
    b.at(0, y0 + .03, zf + .14, 0, 1, -.35); b.box(0, 0, 0, hw * 2 - .04, .1, .012, CAB, { mat: "gloss", nb: true }); b.pop();
    for (const s of [-1, 1]) minilamp(b, s * (hw + .035), .34, zf + .01, cy, !bad);
    /* 底盘、弹簧、车轴、车轮 */
    b.box(0, y0 - .06, zw, hw * 2, .03, .06, OAK, { nb: true });
    for (const s of [-1, 1]) b.box(s * .1, y0 - .05, zw, .04, .05, .14, IRON, { mat: "metal", nb: true });
    rod(b, [-.25, Rw, zw], [.25, Rw, zw], .022, IRON, M);
    wheel(b, .23, Rw, zw, Rw, OAK2, hubc);
    if (!bad) wheel(b, -.23, Rw, zw, Rw, OAK2, hubc);
    /* 车辕：从车底往前伸到狮鹫肩侧 */
    for (const s of [-1, 1]) limb(b, [s * .13, y0 - .02, zf - .05], [s * .13, .36, zf + .5], .014, .011, 4, OAK2);
    rod(b, [-.13, .2, zf + .12], [.13, .2, zf + .12], .02, OAK);
    b.at(0, 0, zb - .02); b.box(0, y0 + .02, -.05, hw * 2 - .04, .1, .09, mix3(LEATH, OAK, .3), { nb: true }); b.box(0, y0 + .11, -.05, hw * 2 - .02, .016, .1, hubc, Object.assign({ nb: true }, M)); b.pop();   /* 车尾行李箱 */
    if (bad) b.pop().pop();
    if (bad) {                                               /* 掉下来的轮子平躺在台上 */
      b.at(-.42, .02, zw + .2, 0, 1, PI / 2 - .05); wheel(b, 0, 0, 0, Rw, OAK2, hubc); b.pop();
    } else griffin(b, 0, 0, .66, 0, GP.gold, "stand", cy ? "brass" : 1);
    b.pop();
  }
  /* 双狮鹫大马车：四轮、深蓝漆车厢、车窗、车夫座、车顶行李栏和箱子、中间一根车辕，前面两只狮鹫（本地朝 +z） */
  function coach(b, o, x, z, ry) {
    const cy = o.cy, bad = o.bad, rc = cy ? BRASS : IRON;
    reseed(37);
    b.at(x, 0, z, ry);
    const hw = .2, y0 = .2, y1 = .54, zb = -.3, zf = .2, Rr = .16, Rf = .11, zr = -.18, zfw = .32;
    b.box(0, y0, (zb + zf) / 2, hw * 2, y1 - y0, zf - zb, COACH, { mat: "gloss", top: COACHD });
    b.box(0, y0 - .025, (zb + zf) / 2, hw * 2 + .02, .03, zf - zb + .02, COACHD, { mat: "gloss", nb: true });
    for (const s of [-1, 1]) {
      b.at(s * (hw + .002), 0, (zb + zf) / 2, s * PI / 2);
      for (const yy of [.29, .47]) b.panel(0, yy, 0, zf - zb - .04, .012, TRIM, M);
      b.panel(s * .0, .22, .001, .012, .26, COACHD, GL);
      b.pop();
      for (const zz of [-.17, .07]) cabWin(b, s * (hw + .004), .33, zz, .11, .07, s, false);
      b.box(s * (hw + .06), .1, -.05, .1, .015, .08, OAK, { nb: true });            /* 脚踏 */
    }
    vault(b, hw + .02, y1, .1, zb - .02, zf + .02, COACHD, COACH);
    b.box(0, y1 - .01, (zb + zf) / 2, hw * 2 + .05, .02, zf - zb + .06, TRIM, { mat: "metal", nb: true });
    /* 车顶行李栏、两只箱子 */
    const rt = y1 + .1;
    for (const s of [-1, 1]) rod(b, [s * .15, rt + .04, zb + .04], [s * .15, rt + .04, zf - .02], .01, rc, M);
    for (const zz of [zb + .04, zf - .02]) rod(b, [-.15, rt + .04, zz], [.15, rt + .04, zz], .01, rc, M);
    b.at(-.03, rt - .02, -.13, .1); b.box(0, 0, 0, .22, .1, .14, LEATH, { nb: true, top: mix3(LEATH, C.woodL, .2) }); for (const dx of [-.06, .06]) b.box(dx, 0, 0, .016, .102, .142, rc, { mat: "metal", nb: true }); b.pop();
    b.at(.04, rt - .02, .06, -.15); b.box(0, 0, 0, .16, .08, .12, LEATH2, { nb: true }); b.pop();
    /* 车夫座、踏板、两盏车灯 */
    b.box(0, y0 + .08, zf + .1, hw * 2 - .04, .16, .2, COACHD, { mat: "gloss", nb: true });
    b.box(0, y0 + .24, zf + .07, hw * 2 - .02, .03, .14, LEATH, { nb: true });
    b.box(0, y0 + .24, zf + .005, hw * 2 - .02, .1, .02, LEATH, { nb: true });
    b.at(0, y0 + .08, zf + .2, 0, 1, -.4); b.box(0, 0, 0, hw * 2 - .06, .12, .012, COACH, { mat: "gloss", nb: true }); b.pop();
    for (const s of [-1, 1]) minilamp(b, s * (hw + .035), .47, zf + .01, cy, !bad);
    /* 底盘、四轮 */
    b.box(0, y0 - .07, -.05, .14, .04, .6, OAK, { nb: true });
    rod(b, [-.27, Rr, zr], [.27, Rr, zr], .022, IRON, M); rod(b, [-.25, Rf, zfw], [.25, Rf, zfw], .02, IRON, M);
    for (const s of [-1, 1]) { wheel(b, s * .25, Rr, zr, Rr, OAK2, rc); wheel(b, s * .23, Rf, zfw, Rf, OAK2, rc, 8); }
    /* 车辕、横担、两只狮鹫 */
    limb(b, [0, .14, zfw], [0, .3, zfw + .72], .016, .012, 4, OAK2);
    rod(b, [-.2, .3, zfw + .4], [.2, .3, zfw + .4], .02, OAK);
    for (const s of [-1, 1]) {
      rod(b, [s * .18, .3, zfw + .4], [s * .17, .44, zfw + .6], .008, LEATH);
      if (!bad) griffin(b, s * .165, 0, zfw + .5, 0, s < 0 ? GP.dun : GP.gold, "stand", cy ? "brass" : 1);
    }
    b.pop();
  }
  function trolley(b, x, z, ry) {                           /* 行李推车：四只小轮、木板车台、推把，上面码着箱子和帽盒 */
    reseed(41);
    b.at(x, 0, z, ry);
    b.box(0, .08, 0, .26, .025, .4, BOARD, { top: mix3(BOARD, C.woodL, .2) });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { b.at(sx * .12, .045, sz * .15, 0, 1, 0, PI / 2); b.cyl(0, -.012, 0, .045, .024, 6, IRON, M); b.pop(); }
    for (const s of [-1, 1]) rod(b, [s * .12, .1, -.2], [s * .12, .48, -.26], .018, OAK);
    rod(b, [-.13, .48, -.26], [.13, .48, -.26], .02, OAK2);
    b.box(0, .105, -.04, .24, .13, .22, LEATH, { top: mix3(LEATH, C.woodL, .15), nb: true });
    for (const dz of [-.1, .02]) b.box(0, .105, dz, .242, .132, .016, BRASS, { mat: "metal", nb: true });
    b.box(.02, .235, -.05, .18, .1, .15, LEATH2, { top: mix3(LEATH2, C.white, .1), nb: true });
    b.cyl(-.02, .105, .14, .07, .1, 8, mix3(C.cream, C.stone, .3), { top: mix3(C.banner, C.cream, .3), nb: true });
    b.pop();
  }

  /* ================= 候车亭（本地：门朝 +z） ================= */
  function pavilion(b, o) {
    const cy = o.cy, hw = VW / 2, hd = VD / 2;
    reseed(11);
    b.at(VX, 0, VZ, VRY);
    b.box(0, -.12, 0, VW + .12, V0 + .12, VD + .12, mix3(ST2, STD, .4), { top: DRESS2, nb: true });
    for (let f = 0; f < 4; f++) {
      const w = f % 2 ? hd : hw, d = f % 2 ? hw : hd;
      b.at(0, 0, 0, f * PI / 2); mason(b, () => [-w, w], V0, VH, d, { ql: 1, qr: 1, qph: f, rh: .165 }); b.pop();
    }
    b.box(0, VH - .055, 0, VW + .035, .055, VD + .035, DRESS2, { nb: true });
    b.box(0, .5, 0, VW + .025, .035, VD + .025, DRESS2, { nb: true });                       /* 腰线 */
    for (const s of [-1, 1]) buttress(b, s * hw, hd, s * PI / 4, .5);
    /* 正面：尖拱木门、石阶、提灯、班次牌 */
    b.at(0, V0, hd); archRing(b, .22, .28, .62, .05, 0, .04); b.at(0, 0, .006); door(b, .22, .28, .62); b.pop(); b.pop();
    b.box(0, -.08, hd + .13, .38, V0 + .07, .18, mix3(ST2, STD, .3), { top: DRESS, nb: true });
    wallLantern(b, -.21, .56, hd, cy);
    b.at(.22, .3, hd + .006);                                /* 班次牌：橡木框、深色板、几道奶白字行、顶上小檐 */
    b.box(0, 0, 0, .13, .17, .016, OAK, { nb: true }); b.panel(0, .015, .009, .1, .14, mix3(C.woodD, [0, 0, 0], .5));
    for (let i = 0; i < 4; i++) b.panel(-.01 + (i % 2) * .01, .04 + i * .028, .0095, .06 - (i % 2) * .02, .008, mix3(C.cream, C.stone, .25));
    b.box(0, .17, .01, .16, .02, .04, SL2, { nb: true });
    b.pop();
    /* 两侧、背面尖拱烛光窗 */
    for (const f of [1, 3]) { b.at(0, 0, 0, f * PI / 2); lancet(b, 0, .38, hd + (hw - hd), .12, .2, { hood: 1 }); b.pop(); }
    b.at(0, 0, 0, PI); lancet(b, .06, .38, hd, .1, .18, { hood: 1 }); ivy(b, -.1, V0, hd, .5, .7, 26); b.pop();
    b.at(0, 0, 0, PI / 2); ivy(b, -.2, V0, hw, .26, .55, 14); b.pop();
    ivy(b, -.3, V0, hd + .01, .12, .4, 8);
    /* 侧墙一张长椅 */
    bench(b, -hw - .1, -.02, -PI / 2, .38);
    /* 屋顶：近似四角攒尖；前坡一座小山墙老虎窗嵌一只钟面 */
    const HX = hw + .09, HZ = hd + .09, ye = VH + .02, yr = VH + .62;
    hipRoof(b, 0, 0, HX, HZ, HX - HZ, ye, yr, 4);
    const s0 = .2, zs = HZ * (1 - s0) - .02, ys = ye + .05 + (yr - ye - .05) * (s0 - .1) / .9;
    b.box(0, ys - .04, zs - .07, .26, .22, .16, mix3(DRESS2, ST, .3), { nb: true, front: DRESS2 });
    b.at(0, ys + .18, zs - .07, PI / 2); b.gable(0, 0, 0, .22, .32, .14, SL2, { end: DRESS2 }); b.pop();
    b.beam([-.15, ys + .17, zs + .045], [0, ys + .32, zs + .045], .03, DRESS); b.beam([.15, ys + .17, zs + .045], [0, ys + .32, zs + .045], .03, DRESS);
    b.at(0, ys + .07, zs + .012);                            /* 钟面 */
    { const N = 10;
      for (let i = 0; i < N; i++) {
        const a = i / N * TAU, a2 = (i + 1) / N * TAU;
        b.tri([0, 0, 0], [Math.cos(a) * .072, Math.sin(a) * .072, 0], [Math.cos(a2) * .072, Math.sin(a2) * .072, 0], CLOCK, { e: .22 });
        b.quad([Math.cos(a) * .086, Math.sin(a) * .086, .004], [Math.cos(a) * .072, Math.sin(a) * .072, .004], [Math.cos(a2) * .072, Math.sin(a2) * .072, .004], [Math.cos(a2) * .086, Math.sin(a2) * .086, .004], cy ? BRASS : IRON, M);
      }
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; b.panel(Math.cos(a) * .058, Math.sin(a) * .058 - .007, .004, .014, .014, IRON, M); }
      rod(b, [0, 0, .007], [.03, .03, .007], .009, IRON, M); rod(b, [0, 0, .008], [-.008, -.052, .008], .007, IRON, M);
    }
    b.pop();
    /* 顶饰：1994 铁尖顶饰；2077 黄铜小飞艇风向标 */
    b.cyl(0, yr - .03, 0, .035, .06, 6, cy ? AGED : IRON, Object.assign({ nb: true }, cy ? GL : M));
    if (cy) airshipVane(b, 0, yr + .03, 0, .16, .7);
    else { rod(b, [0, yr, 0], [0, yr + .28, 0], .02, IRON, M); b.sphere(0, yr + .1, 0, .032, 4, BRONZE, M); rod(b, [-.05, yr + .19, 0], [.05, yr + .19, 0], .01, IRON, M); b.cone(0, yr + .26, 0, .014, .06, 4, IRON, Object.assign({ nb: true }, M)); }
    /* 2077：亭前黄铜框玻璃雨棚、门口猫球灯 */
    if (cy) {
      const x0 = -.28, x1 = .28, zw = hd + .01, zf = hd + .36, yw = .78, yf = .68;
      for (const x of [x0, x1]) { b.box(x, V0 - .02, zf, .05, .03, .05, DRESS2, { nb: true }); rod(b, [x, V0, zf], [x, yf, zf], .024, BRASS, GL); rod(b, [x, yf - .12, zf], [x, yf, zf - .1], .012, BRASS, GL); }
      b.quad([x0, yf, zf], [x1, yf, zf], [x1, yw, zw], [x0, yw, zw], GLASS, GS);
      for (let i = 0; i <= 3; i++) { const x = x0 + (x1 - x0) * i / 3; rod(b, [x, yf, zf], [x, yw, zw], .016, BRASS, GL); }
      rod(b, [x0 - .02, yf, zf], [x1 + .02, yf, zf], .024, BRASS, GL); rod(b, [x0, yw, zw], [x1, yw, zw], .018, BRASS, GL);
      for (let i = 0; i < 5; i++) b.cone(x0 + (x1 - x0) * (i + .5) / 5, yf - .03, zf, .012, .03, 4, BRASS, Object.assign({ nb: true }, GL));
      catLamp(b, .48, hd + .3, .78, o.bad);
    }
    b.pop();
  }
  /* 售票小房（Lv2，在候车亭右边；本地坐标跟着亭子转） */
  function booth(b, o) {
    const cy = o.cy, W = .36, D = .32, P0 = .08, Hw = .6, Hr = .22, sl = Hr / (D / 2), yR = Hw + Hr;
    reseed(12);
    b.at(VX, 0, VZ, VRY); b.at(.66, 0, -.04);
    b.box(0, -.12, 0, W + .08, P0 + .12, D + .08, mix3(ST2, STD, .4), { top: DRESS2, nb: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, D / 2, { ql: 1, qr: 1, rh: .15 });
    mason(b, () => [-W / 2, W / 2], P0, Hw, -D / 2, { back: 1, ql: 1, qr: 1, rh: .15 });
    const gab = y => { const h = Math.min(D / 2, (yR + .01 - y) / sl); return [-h, h]; };
    for (const s of [-1, 1]) { b.at(s * W / 2, 0, 0, s * PI / 2); mason(b, () => [-D / 2, D / 2], P0, Hw, 0, { ql: 1, qr: 1, rh: .15 }); mason(b, gab, Hw, yR + .01, 0, { rh: .11 }); b.pop(); coping(b, s * W / 2, Hw, D, Hr, .05); }
    slateRoof(b, W, Hw, D, Hr, .06, { bands: 3 });
    /* 售票窗：尖拱、铁格栅、小木台；上面挑出一块小木招牌 */
    lancet(b, 0, .3, D / 2, .15, .14, { hood: 1, e: .5, mull: cy ? BRASS : MULL, mo: cy ? GL : undefined });
    for (const dx of [-.04, .04]) b.box(dx, .3, D / 2 + .03, .008, .2, .008, cy ? BRASS : IRON, { mat: cy ? "gloss" : "metal", nb: true });
    b.box(0, .27, D / 2 + .05, .24, .025, .1, OAK2, { top: mix3(OAK2, C.woodL, .25) });
    for (const s of [-1, 1]) rod(b, [s * .09, .27, D / 2 + .09], [s * .09, .19, D / 2 + .005], .014, OAK);
    rod(b, [W / 2 - .02, .62, D / 2 - .04], [W / 2 + .14, .62, D / 2 - .04], .016, cy ? BRASS : IRON, M);
    b.at(W / 2 + .1, .47, D / 2 - .04, PI / 2);
    b.box(0, 0, 0, .14, .11, .018, OAK, { front: mix3(C.banner2, OAK, .3), back: mix3(C.banner2, OAK, .3), nb: true });
    for (const z of [.01, -.01]) { b.at(0, .055, z, z > 0 ? 0 : PI); fan(b, [[0, -.03], [.025, 0], [0, .03], [-.025, 0]], 0, TRIM, M); b.pop(); }
    for (const dx of [-.05, .05]) rod(b, [dx, .11, 0], [dx * .4, .15, 0], .006, IRON, M);
    b.pop();
    ivy(b, -.12, P0, D / 2, .12, .35, 8);
    b.pop(); b.pop();
  }

  /* ================= 凉廊（Lv2，左侧，开口朝台面） ================= */
  function loggia(b, o) {
    const cy = o.cy, W = .58, D = .46, P0 = .09, cw = .075, ys = .36, CH = .66, hw = W / 2, hd = D / 2;
    reseed(13);
    b.at(LX, 0, LZ, PI / 2);
    b.box(0, -.12, 0, W + .12, P0 + .12, D + .12, mix3(ST2, STD, .4), { top: FLOOR, nb: true });
    b.box(0, -.05, hd + .1, .3, P0 + .02, .12, mix3(ST2, STD, .3), { top: DRESS, nb: true });
    const cols = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => [sx * (hw - cw / 2), sz * (hd - cw / 2)]);
    for (const [x, z] of cols) {
      b.box(x, P0, z, cw + .03, .05, cw + .03, DRESS2, { nb: true });
      b.cyl(x, P0 + .05, z, cw * .42, ys - P0 - .09, 6, mix3(DRESS2, ST, .35), { nb: true, nt: true });
      b.box(x, ys - .04, z, cw + .025, .04, cw + .025, DRESS, { nb: true });
      b.box(x, ys, z, cw, CH - ys, cw, mix3(DRESS2, ST, .4), { nb: true });
    }
    for (let f = 0; f < 4; f++) {                            /* 四面尖拱 */
      const span = f % 2 ? D : W, dep = f % 2 ? W : D;
      b.at(0, 0, 0, f * PI / 2);
      archFill(b, span - 2 * cw, .62, ys, CH, dep / 2, dep / 2 - cw, mix3(DRESS2, ST, .25), mix3(DRESS2, STD, .3));
      b.pop();
    }
    b.box(0, CH, 0, W + .03, .05, D + .03, DRESS2, { nb: true });
    if (!cy) hipRoof(b, 0, 0, hw + .08, hd + .08, hw - hd, CH + .05, CH + .46, 3);
    else {                                                   /* 2077：改成小玻璃暖房——黄铜骨架的玻璃四坡顶、三面尖拱里镶玻璃 */
      const HX = hw + .06, HZ = hd + .06, rr = hw - hd, ye = CH + .05, yr = CH + .44;
      const E = [[-HX, ye, HZ], [HX, ye, HZ], [HX, ye, -HZ], [-HX, ye, -HZ]], Rg = [[-rr, yr, 0], [rr, yr, 0]];
      b.quad(E[0], E[1], Rg[1], Rg[0], GLASS, GS); b.quad(E[2], E[3], Rg[0], Rg[1], GLASS, GS);
      b.tri(E[1], E[2], Rg[1], GLASS, GS); b.tri(E[3], E[0], Rg[0], GLASS, GS);
      for (let k = 0; k < 4; k++) { rod(b, E[k], E[(k + 1) % 4], .022, BRASS, GL); rod(b, E[k], Rg[k === 0 || k === 3 ? 0 : 1], .02, BRASS, GL); }
      rod(b, Rg[0], Rg[1], .024, BRASS, GL);
      for (const s of [-1, 1]) for (const t of [-.5, .5]) { const x = t * HX, xr = t * rr; rod(b, [x, ye, s * HZ], [xr, yr, 0], .012, BRASS, GL); }
      for (let f = 1; f < 4; f++) {
        const span = f % 2 ? D : W, dep = f % 2 ? W : D, w = span - 2 * cw;
        b.at(0, 0, 0, f * PI / 2);
        fan(b, outline(w, ys, P0, .62, 3), dep / 2 - cw / 2, GLASS, GS);
        rod(b, [0, P0, dep / 2 - cw / 2 + .01], [0, ys + archY(w, .62, 0), dep / 2 - cw / 2 + .01], .012, BRASS, GL);
        rod(b, [-w / 2, ys - .04, dep / 2 - cw / 2 + .01], [w / 2, ys - .04, dep / 2 - cw / 2 + .01], .01, BRASS, GL);
        b.pop();
      }
    }
    b.cyl(0, CH + .43, 0, .03, .05, 6, cy ? AGED : IRON, Object.assign({ nb: true }, cy ? GL : M)); rod(b, [0, CH + .46, 0], [0, CH + .64, 0], .016, cy ? AGED : IRON, cy ? GL : M); b.sphere(0, CH + .56, 0, .024, 4, cy ? BRASS : BRONZE, M);
    /* 里面：靠后长椅、铁烟灰架、梁下吊一盏提灯 */
    bench(b, 0, -hd + .14, 0, .4);
    b.cyl(.2, P0, .02, .04, .02, 6, IRON, Object.assign({ nb: true }, M)); rod(b, [.2, P0, .02], [.2, P0 + .26, .02], .014, IRON, M); b.cyl(.2, P0 + .26, .02, .045, .02, 6, IRON, { mat: "metal", r2: .035, nb: true });
    rod(b, [0, CH, 0], [0, CH - .1, 0], .01, cy ? BRASS : IRON, M);
    lantern(b, 0, CH - .3, 0, cy);
    rivy(b, cols[0][0], cols[0][1], .03, -PI * .75, 1.2, P0, .5, 12);
    b.pop();
  }

  /* ================= 2077：猫球小艇、黄铜系泊桩 ================= */
  function catBall(b, x, y, z, ry, s, col, glow) {          /* 猫球：扁圆身子、两只尖耳、两只眼缝（约 70 三角形） */
    b.at(x, y, z, ry, s);
    b.sphere(0, 0, 0, 1, 7, col, Object.assign({ sy: .7 }, glow ? { e: glow } : {}));
    for (const sx of [-1, 1]) { b.at(sx * .48, .52, .1, 0, 1, -.15, sx * -.4); b.cone(0, 0, 0, .26, .5, 3, col, { a0: PI / 6, nb: true }); b.pop(); }
    for (const sx of [-1, 1]) { b.at(sx * .32, .1, .92, sx * .35); b.panel(0, 0, 0, .2, .07, [.2, .17, .16]); b.pop(); }
    b.pop();
  }
  function catBoat(b, o, x, z, ry) {                        /* 猫球小艇（本地 +x 是船头）：扁球身、黄铜龙骨、侧舷黄铜护条、尾舵 */
    const bad = o.bad, y = bad ? .4 : .58;
    b.at(x, 0, z, ry);
    if (bad) b.at(0, 0, 0, 0, 1, .15, .22);
    b.at(0, y, 0, PI / 2); catBall(b, 0, 0, 0, 0, .24, CATC, 0); b.pop();
    /* 黄铜龙骨：腹下一道弧、船头船尾翘起 */
    const kp = [[-.28, .06], [-.21, -.11], [-.08, -.175], [.08, -.175], [.21, -.11], [.27, .04]];
    for (let i = 0; i < kp.length - 1; i++) rod(b, [kp[i][0], y + kp[i][1], 0], [kp[i + 1][0], y + kp[i + 1][1], 0], .03, BRASS, GL);
    /* 侧舷一道黄铜护条、尾舵、船头系缆环 */
    b.at(0, y - .02, 0); b.cyl(0, 0, 0, .245, .024, 12, AGED, { mat: "gloss", nt: true, nb: true }); b.pop();
    b.at(-.27, y + .02, 0); tri2(b, [0, 0, 0], [-.12, .1, 0], [-.09, -.03, 0], BRASS, GL); tri2(b, [0, 0, 0], [-.1, 0, .08], [-.1, 0, -.08], BRASS, GL); b.pop();
    b.torus(.27, y + .04, 0, .028, .007, 6, 3, BRASS, GL);
    /* 两舷各两只黄铜圆舷窗；尾部一只小三叶桨（不转） */
    for (const s of [-1, 1]) for (const px of [-.08, .07]) {
      b.at(px, y + .03, s * .222, s > 0 ? 0 : PI);
      const ring = [], inner = [];
      for (let k = 0; k < 6; k++) { const t = k / 6 * TAU; ring.push([Math.cos(t) * .036, Math.sin(t) * .036]); inner.push([Math.cos(t) * .025, Math.sin(t) * .025]); }
      fan(b, ring, 0, BRASS, GL); fan(b, inner, .004, CWIN, GL);
      b.pop();
    }
    b.at(-.31, y + .05, 0, 0, 1, 0, PI / 2); b.cone(0, 0, 0, .025, .05, 4, AGED, GL);
    for (let k = 0; k < 3; k++) { const t = k / 3 * TAU + .3; tri2(b, [0, .02, 0], [Math.cos(t) * .09, .025, Math.sin(t) * .09], [Math.cos(t + .45) * .07, .02, Math.sin(t + .45) * .07], BRASS, GL); }
    b.pop();
    if (bad) b.pop();
    b.pop();
  }
  function bollard(b, x, z) {                               /* 黄铜系泊桩：石座、矮铜柱、上下两道箍、蘑菇顶 */
    b.box(x, PH - .01, z, .12, .03, .12, DRESS2, { nb: true });
    b.cyl(x, PH + .02, z, .035, .18, 8, BRASS, { mat: "gloss", r2: .03, nb: true, nt: true });
    for (const y of [.06, .15]) b.cyl(x, PH + y, z, .04, .015, 8, AGED, { mat: "gloss", nt: true, nb: true });
    b.sphere(x, PH + .21, z, .045, 6, BRASS, { mat: "gloss", sy: .55 });
  }

  /* ================= 台边：风向袋、草料 ================= */
  function windsock(b, x, z, ry, cy, bad) {
    const h = 1.2, pc = cy ? BRASS : IRON, po = cy ? GL : M;
    b.box(x, -.06, z, .16, .14, .16, mix3(ST2, STD, .3), { nb: true, top: DRESS2 });
    limb(b, [x, .08, z], [x, h + .04, z], .022, .016, 5, pc, po);
    for (let i = 0; i < 3; i++) { const a = i * TAU / 3; rod(b, [x + Math.sin(a) * .1, .08, z + Math.cos(a) * .1], [x, .4, z], .012, pc, po); }
    b.cone(x, h + .04, z, .026, .05, 4, C.gold, M);
    b.at(x, h - .04, z, ry);
    rod(b, [0, 0, 0], [0, 0, .07], .012, pc, po);
    b.at(0, 0, .07, 0, 1, bad ? PI * .47 : PI / 2 - .2);    /* 袋口铁环；袋身沿本地 +y 伸出 */
    b.torus(0, 0, 0, .065, .008, 8, 3, pc, po);
    const segs = 4, L = .46;
    for (let i = 0; i < segs; i++) {
      const r0 = .062 - i * .01, r1 = .062 - (i + 1) * .01, k = bad ? 0 : 1.2 + i * .06;
      b.cyl(0, i * L / segs, 0, r0, L / segs, 7, i % 2 ? SOCK2 : SOCK1, Object.assign({ r2: r1, nt: true, nb: true }, k ? { k } : {}));
      if (i === 0) { b.at(0, 0, 0, 0, 1, PI); b.cyl(0, -L / segs, 0, r1, L / segs, 7, mix3(SOCK1, [0, 0, 0], .35), { r2: r0, nt: true, nb: true }); b.pop(); }
    }
    b.pop();
    b.pop();
  }

  function trough(b, x, z, ry, cy) {                         /* 石水槽：凿出来的长石槽、深色水面、一只木桶 */
    b.at(x, 0, z, ry);
    b.box(0, 0, 0, .16, .15, .42, mix3(ST2, STD, .25), { top: DRESS2, nb: true });
    b.quad([-.055, .145, .17], [.055, .145, .17], [.055, .145, -.17], [-.055, .145, -.17], mix3(C.water, [.15, .2, .22], .6), { mat: "gloss" });
    b.cyl(.0, 0, .32, .06, .12, 7, OAK2, { r2: .07, top: mix3(C.water, [.15, .2, .22], .55) });
    b.cyl(.0, .03, .32, .062, .015, 7, cy ? BRASS : IRON, { nt: true, nb: true, mat: cy ? "gloss" : "metal" });
    b.cyl(.0, .09, .32, .072, .015, 7, cy ? BRASS : IRON, { nt: true, nb: true, mat: cy ? "gloss" : "metal" });
    b.pop();
  }
  function fingerpost(b, x, z, ry, cy) {                    /* 路牌：木杆、两块箭头牌（奶白字行）、顶上小铁帽 */
    b.at(x, 0, z, ry);
    b.box(0, -.04, 0, .1, .06, .1, DRESS2, { nb: true });
    b.box(0, 0, 0, .04, .66, .04, OAK, { nb: true });
    b.pyramid(0, .66, 0, .06, .06, .05, cy ? BRASS : IRON, cy ? GL : M);
    for (const [y, dir, a] of [[.54, 1, .25], [.42, -1, -.35]]) {
      b.at(0, y, 0, a);
      const pts = [[0, -.035], [dir * .22, -.035], [dir * .26, 0], [dir * .22, .035], [0, .035]];
      prism(b, pts.map(([u, v]) => [u, v]), -.01, .01, OAK2);
      b.at(0, 0, 0, PI); prism(b, pts.map(([u, v]) => [-u, v]), -.01, .01, OAK2); b.pop();
      for (const sd of [1, -1]) { b.at(0, 0, 0, sd > 0 ? 0 : PI); b.panel(dir * sd * .12, -.008, .0115, .14, .012, mix3(C.cream, C.stone, .3)); b.pop(); }
      b.pop();
    }
    b.pop();
  }

  /* ================= Lv3：起飞跑道（三座细圆塔、石芯柱、盘旋石阶、小圆台） ================= */
  function rtower(b, o, i) {
    const a = TA[i], [tx, , tz] = KP(a, KD, 0), cy = o.cy, a0 = PI / 8;
    reseed(50 + i);
    b.cyl(tx, -.1, tz, TR + .06, .26, 8, mix3(ST2, STD, .4), { r2: TR + .025, top: DRESS2, nb: true, a0 });
    rwall(b, tx, tz, TR, .16, TT - .12, 8, .22);
    b.cyl(tx, 1.32, tz, TR + .015, .035, 8, DRESS2, { nb: true, nt: true, a0 });                 /* 腰线 */
    b.cyl(tx, TT - .12, tz, TR, .12, 8, DRESS2, { r2: TR + .045, nb: true, nt: true, a0 });      /* 托石挑檐 */
    b.cyl(tx, TT, tz, TR + .045, .09, 8, mix3(ST2, ST, .5), { nb: true, nt: true, a0 });
    const top = spire(b, tx, TT + .09, tz, TR + .055, .44, 8, cy);
    /* 朝外：两道箭缝、一扇小烛光窗 */
    for (const [da, y] of [[0, .62], [.5, 1.7], [-.4, 2.3]]) {
      b.at(tx, 0, tz, a + da);
      if (y > 2) { b.panel(0, y - .02, TR + .004, .085, .17, DRESS2); b.panel(0, y, TR + .008, .05, .12, WIN, { e: .5 }); b.tri([-.025, y + .12, TR + .008], [.025, y + .12, TR + .008], [0, y + .15, TR + .008], WIN, { e: .5 }); }
      else { b.panel(0, y - .02, TR + .004, .06, .24, DRESS2); b.panel(0, y, TR + .007, .022, .2, INNER); b.panel(0, y + .09, TR + .008, .07, .02, INNER); }
      b.pop();
    }
    if (i === 0) rivy(b, tx, tz, TR, a + .5, 1.6, .16, 1.3, 22);
    return pennant(b, tx, top - .02, tz, [C.banner, C.banner2, mix3(C.ivy, [.1, .42, .3], .5)][i], .4 + i, o.bad && i === 2 ? .7 : 0);
  }
  function stairs(b, o) {                                   /* 石芯柱、绕柱盘旋的悬挑石踏步、外沿扶手；待修缺几级 */
    const cy = o.cy, rail = cy ? BRASS : IRON, ro = cy ? GL : M, rise = PLY / NST, rm = (SR0 + SR1) / 2, tw = SR1 * DA + .03;
    reseed(60);
    b.cyl(KX, 0, KZ, SR0 + .05, .1, 8, DRESS2, { nb: true });
    b.cyl(KX, .1, KZ, SR0, PLY - .1, 8, mix3(ST2, ST, .4), { nt: true, nb: true });
    let prev = null;
    for (let i = 0; i < NST; i++) {
      const a = i * DA, yT = rise * (i + 1), gone = o.bad && (i === 7 || i === 8 || i === 13);
      if (!gone) {
        const sh = yT < .3 ? yT : .065, c = mix3(ST2, STD, .15 + R() * .35);
        b.at(KX, 0, KZ, a);
        b.box(0, yT - sh, rm, tw, sh, SR1 - SR0, c, { top: mix3(DRESS2, FLOOR, R() * .6), nb: yT < .3 });
        b.pop();
      }
      if (i % 2 === 1 && i < NST - 1) {
        const p = KP(a, SR1 - .02, yT), q = [p[0], yT + .24, p[2]];
        if (!gone) rod(b, p, q, .014, rail, ro);
        if (prev) rod(b, prev, q, .014, rail, ro);
        prev = gone ? null : q;
      }
    }
    /* 起步：一根石柱头 */
    const p0 = KP(-.3, SR1 + .03, 0);
    b.box(p0[0], 0, p0[2], .08, .32, .08, DRESS2, { nb: true }); b.pyramid(p0[0], .32, p0[2], .1, .1, .07, DRESS);
  }
  function platform(b, o) {                                 /* 三塔托着的小圆台：石台、楼梯口、三段栏杆、两面小旗 */
    const cy = o.cy, rail = cy ? BRASS : IRON, ro = cy ? GL : M;
    reseed(70);
    b.cyl(KX, PLY - .11, KZ, PLR - .04, .03, 16, mix3(ST2, STD, .35), { r2: PLR, nt: true });
    b.cyl(KX, PLY - .08, KZ, PLR, .08, 16, DRESS2, { top: FLOOR, nb: true });
    b.ring(KX, PLY + .003, KZ, .3, .33, 12, mix3(FLOOR, STD, .45));
    /* 楼梯口：石阶从芯柱旁冒上来的地方压一块深色口子，两边短栏杆 */
    const aT = (NST - 1) * DA, hatch = [aT - DA * 1.5, aT + DA * .5];
    for (let k = 0; k < 3; k++) {
      const u0 = hatch[0] + (hatch[1] - hatch[0]) * k / 3, u1 = hatch[0] + (hatch[1] - hatch[0]) * (k + 1) / 3;
      qf(b, KP(u0, SR0 + .02, PLY + .004), KP(u1, SR0 + .02, PLY + .004), KP(u1, SR1, PLY + .004), KP(u0, SR1, PLY + .004), INNER, [0, 1, 0]);
    }
    for (const u of hatch) { const p = KP(u, SR1 + .01, PLY), q = KP(u, SR0 + .03, PLY); rod(b, [p[0], PLY + .2, p[2]], [q[0], PLY + .2, q[2]], .012, rail, ro); rod(b, p, [p[0], PLY + .2, p[2]], .012, rail, ro); }
    /* 栏杆：三段，避开三座塔 */
    const rr = PLR - .03, TS = [PI / 3, PI, PI * 5 / 3];     /* 三塔方位从小到大：栏杆段 = 相邻两塔之间 */
    for (let s = 0; s < 3; s++) {
      const A0 = TS[s] + .5, A1 = (s < 2 ? TS[s + 1] : TS[0] + TAU) - .5;
      const n = 3, pts = [];
      for (let k = 0; k <= n; k++) pts.push(KP(A0 + (A1 - A0) * k / n, rr, PLY));
      for (let k = 0; k <= n; k++) { const p = pts[k]; rod(b, p, [p[0], PLY + .24, p[2]], .016, rail, ro); }
      for (let k = 0; k < n; k++) {
        const p = pts[k], q = pts[k + 1];
        if (!(o.bad && s === 1 && k === 1)) rod(b, [p[0], PLY + .24, p[2]], [q[0], PLY + .24, q[2]], .016, rail, ro);
        rod(b, [p[0], PLY + .12, p[2]], [q[0], PLY + .12, q[2]], .01, rail, ro);
      }
    }
    let top = PLY + .3;
    for (const [a, col] of [[PI * .14, C.banner], [-PI * .14, C.banner2]]) { const p = KP(a, rr, PLY); top = Math.max(top, flag(b, p[0], PLY + .02, p[2], col, .4, o.bad && a < 0 ? .5 : 0)); }
    if (cy) { const p = KP(0, rr - .01, PLY); amberLamp(b, p[0], PLY, p[2]); }
    return top;
  }

  /* ================= 拼起来 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { cy, bad, lv };
    padBase(b, oo);
    parapet(b, oo);
    pavilion(b, oo);
    /* 台上的车 */
    if (lv >= 2) {
      if (cy) { bollard(b, -.55, -.3); catBoat(b, oo, .1, -.2, .15); rod(b, [-.55, PH + .19, -.3], [-.21, (bad ? .4 : .58) + .03, -.25], .008, ROPE); }
      else coach(b, oo, .5, -.2, -PI / 2);
    }
    gig(b, oo, -.36, .66, PI / 2);
    if (bad) { reseed(90); griffin(b, .62, PH, .5, -.9, GP.gold, "rest", 0); }
    /* 台边 */
    reseed(80);
    manger(b, 1.3, 1.0, -.55);
    bale(b, 1.62, 0, .62, .4); bale(b, 1.52, 0, 1.28, -.3); bale(b, 1.56, .12, .66, .2);
    windsock(b, 1.48, -.2, .55, cy, bad);
    trough(b, .62, 1.52, PI / 2 - .35, cy);
    fingerpost(b, -.52, 1.5, -.3, cy);
    if (bad) { for (const [x, z, ry, t] of [[.32, .02, .4, .25], [-.18, -.46, 1.2, -.3]]) { b.at(x, PH, z, ry, 1, t, .1); b.box(0, -.02, 0, .2, .04, .14, mix3(PAVED, STD, .3), { top: PAVE }); b.pop(); } }
    if (lv >= 2) { booth(b, oo); loggia(b, oo); trolley(b, -.98, -.42, .6); }
    if (lv >= 3) { for (let i = 0; i < 3; i++) rtower(b, oo, i); stairs(b, oo); platform(b, oo); }
  }
  build.h = o => [0, 2.05, 2.05, 3.9][Math.max(1, Math.min(3, o.lv || 1))];
  Isle3D.FAC["停鸡坪"] = build;
})();
