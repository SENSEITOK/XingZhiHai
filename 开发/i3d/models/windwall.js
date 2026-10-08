/* 防风屏障（1994、2077 同名）：岛沿一道弧形干砌石挡风墙。墙在 −z 一侧（岛外，挡外沿来的风），墙内朝 +z（岛心）是一方避风小院。
   弧心 (0, .25)，墙中线半径 1.55，张角约 116°（−58°…58°，0° 正对 −z）；墙中间高、两头低，墙头顺着一道弧线往两端压下去。
   1994 Lv1：干砌石墙高 .9（两头 .6）：错缝风化灰石、深色泛绿的勒脚、一道鞍形压顶石；五座扶壁石墩（外侧斜撑，两端墩顶石球、中间三墩四坡石帽）；
             每开间一道透风口（穿墙的窄口、料石过梁、窗台石）；中间三墩上插三面三角旗随风摆；
             墙内两段贴墙石凳；脚下两圈石板地；右前一架石板瓦小顶的木风铃（五根木管、风帆随风摆）；几丛黄杨、薰衣草；
             两座墩子内侧铁臂挑一盏提灯；墙内外爬常春藤。
        Lv2：墙加高到 1.3（两头 .82），透风口跟着拉高；墙前三块符文立石（往石色混过的淡紫，e .32）；两头开间的墙头再插两面旗。
        Lv3：弧心（墙正中）起一座矮圆「镇风塔」：勒脚、石鼓身、腰线、尖拱铁钉木门和石阶、烛光小窗、十字箭缝；
             六角开敞钟室挂一口铜钟，托石檐口，石板瓦圆锥矮顶；顶上一架大铁风向标（方位十字、箭头上蹲一只弓背黑猫剪影）慢转；
             门前一条踏步石小路，门边一盏提灯；墙正中那座墩子让给塔。
   2077：同一道石墙。墩与墩之间的墙头嵌一排黄铜框玻璃百叶（玻璃斜片挡风往上导）；风铃换成黄铜风杯测速仪（慢转，杆上一只黄铜表盒）；
         立石戴旧黄铜帽；提灯、旗杆换黄铜；Lv1–2 中墩顶一只小飞艇风向标；左前一根黄铜细杆托一盏猫球灯；
         Lv3 钟室的尖拱嵌黄铜框玻璃，檐口一道黄铜箍，塔顶风向标换成一只慢转的黄铜小飞艇。不加霓虹、全息、罩子、信标。
   待修：旗杆歪倒、旗耷拉着不动；左外开间掉了一段压顶石，几块落在墙脚；风铃架歪斜、两根木管掉在地上（测速仪不转、杆子歪）；
         Lv2+ 一块立石倒伏；Lv3 风向标不转、歪着；2077 几片玻璃百叶碎了。前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, DEG = PI / 180;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45), FLOOR = mix3(C.stone, ST2, .55);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);          /* 烛光窗 */
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BRONZE = mix3(C.gold, C.wood, .38);
  const AGED = mix3(BRASS, [.32, .27, .21], .42);           /* 风吹日晒的旧黄铜 */
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35);
  const MULL = mix3(IRON, OAK, .3), ROPE = [.72, .65, .52];
  const TUBE = mix3(C.woodL, C.hay, .25), TUBED = mix3(C.woodL, C.wood, .5);   /* 风铃木管 */
  const RUNE = mix3(C.crystal2, C.stone, .58);             /* 符文：往石色混过的淡紫 */
  const GLASS = mix3(C.glass, C.tintB, .12);
  const LAV = [mix3([.55, .47, .7], C.stone, .35), mix3([.62, .54, .76], C.stone, .3)];   /* 薰衣草：低饱和 */
  const PEN = [C.banner, mix3(C.banner2, C.slate, .2), mix3(C.gold, C.woodD, .45)];   /* 三角旗：深红、深蓝、旧金 */
  const FACE = mix3(C.cream, C.stone, .15);

  /* 弧墙：弧心、中线半径、墙厚、两端角；墙高按级给 */
  const CX = 0, CZ = .25, RW = 1.55, TW = .24, RI = RW - TW / 2, RO = RW + TW / 2, A0 = 58 * DEG, Y0 = .1;
  let HM = .9, HE = .6, nR = 5, RH = .16;
  const H = a => HE + (HM - HE) * (1 - (a / A0) * (a / A0));
  const P = (a, r, y) => [CX + Math.sin(a) * r, y || 0, CZ - Math.cos(a) * r];   /* a 从 −z 量起，正的往 +x */
  const ON = a => [Math.sin(a), 0, -Math.cos(a)];          /* 墙外法线（朝岛外） */
  const TG = a => [Math.cos(a), 0, Math.sin(a)];           /* 沿墙切向（a 增大的方向） */
  /* 镇风塔 */
  const TXc = 0, TZc = CZ - RW, TR = .45, YD = 1.78, BR = .43, AP = BR * Math.cos(PI / 6), YB = 2.32;
  const AT = 12 * DEG;                                      /* Lv3 墙伸进塔身的角 */

  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 5003 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  function sc(y) {                                          /* 一块石头的颜色：深浅不一、冷暖不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .3 + r * .7);
    if (r2 < .28) c = mix3(c, [.62, .56, .47], .3); else if (r2 > .74) c = mix3(c, [.46, .5, .54], .3);
    if (r > .86) c = mix3(c, STD, .45); else if (r < .1) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.34, (.75 - y) * .36));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  const capC = () => mix3(mix3(DRESS2, C.stone, R() * .5), mix3(C.stoneD, [.6, .56, .5], .5), R() * .35);

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
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }
  function tube(b, a, c, r0, r1, col, o, seg) {             /* 两点之间一根圆管（r0→r1 收放） */
    const d = sub(c, a), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, a[0], a[1], a[2], 1]));
    b.cyl(0, 0, 0, r0, L, seg || 6, col, Object.assign({ nb: true, nt: true, r2: r1 }, o || {})); b.pop();
  }
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块（不画背面和顶面）：前、左、右、底 */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) { /* 扶壁一级：顶面往外斜收（当前坐标 z 朝外） */
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }

  /* ---------- 尖拱 ---------- */
  function archPts(w, p, n) {                               /* 尖拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff) {  /* 洞穿的尖拱洞上方：前后拱肩＋拱腹 */
    const pts = archPts(w, p, 4);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点） */
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

  /* ---------- 窗、门、灯、旗、藤 ---------- */
  function slit(b, x, y, z) {                               /* 十字箭缝 */
    b.panel(x, y - .03, z + .002, .075, .28, DRESS2);
    b.panel(x, y, z + .004, .028, .22, INNER);
    b.panel(x, y + .1, z + .005, .09, .026, INNER);
  }
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、滴水线 */
    o = o || {};
    const p = .7, fr = .04, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, WIN, { e });
    b.panel(0, 0, .028, .014, h + archY(w, p, 0) * .8, o.cy ? BRASS : MULL, o.cy ? GL : undefined);
    b.panel(0, h * .55, .029, w, .013, o.cy ? BRASS : MULL, o.cy ? GL : undefined);
    b.box(0, -fr - .03, 0, w + fr * 2 + .04, .03, .08, DRESS);
    const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .05, p, 3), zh = .035;
    for (let i = 0; i < ai.length - 1; i++) b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
    b.pop();
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    for (let i = 1; i < 4; i++) { const x = -w / 2 + i * w / 4; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, dark); }
    for (const y of [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .026, .012, IRON, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 3, y + .006, .0125, .015, .015, C.metal, M);
    }
    b.at(w * .22, h * .55, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .024, .006, 8, 3, IRON, M); b.pop();
  }
  function lantern(b, x, y, z, cy) {                        /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, C.lamp, { r2: .045, e: .7, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .042, y + .02, z + Math.sin(a) * .042], [x + Math.cos(a) * .05, y + .13, z + Math.sin(a) * .05], .009, fr, fo); }
    b.cyl(x, y + .13, z, .06, .016, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .146, z, .056, .07, 6, fr, Object.assign({ nb: true }, fo));
    b.pyramid(x, y + .214, z, .022, .022, .045, fr, fo);
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .04, .1, .02, fr, fo);
    b.beam([x, y + .1, z], [x, y + .1, z + .16], .018, fr, fo);
    b.beam([x, y + .02, z], [x, y + .1, z + .1], .012, fr, fo);
    b.beam([x, y + .1, z + .15], [x, y + .04, z + .15], .009, fr, fo);
    lantern(b, x, y - .2, z + .15, cy);
  }
  function ivyArc(b, s, ac, span, y0, h, n) {               /* 弧墙面上的常春藤：s=1 外面、−1 里面；下密上疏，不出墙头 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), t = ac + (R() - .5) * span * (1 - v * .6), py = Math.min(y0 + v * h, H(t) - .05), sz = .02 + R() * .022;
      const p = P(t, (s > 0 ? RO : RI) + s * (.01 + R() * .01));
      b.at(p[0], 0, p[2], -t + (s > 0 ? PI : 0));
      fan(b, [[-sz, py], [0, py - sz], [sz, py], [0, py + sz]], 0, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
      b.pop();
    }
  }
  function ivyR(b, cx, cz, r, a, y0, h, spread, n) {        /* 圆塔身上的常春藤 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), aa = a + (R() - .5) * spread * (1 - v * .6), py = y0 + v * h, sz = .026 + R() * .028;
      b.at(cx, 0, cz, aa); fan(b, [[-sz, py], [0, py - sz], [sz, py], [0, py + sz]], r + .012 + R() * .01, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function pennant(b, x, y, z, col, L, ry, bad, cy) {       /* 三角旗：插在墩顶的铁杆（2077 黄铜）、小金球、一面长三角旗随风摆；待修时杆歪、旗耷拉 */
    const pc = cy ? BRASS : IRON, po = cy ? GL : M, hP = .36;
    b.at(x, y, z, ry);
    if (bad) b.at(0, 0, 0, 0, 1, .42, .3);
    b.beam([0, -.06, 0], [0, hP, 0], .017, pc, po);
    b.sphere(0, hP + .02, 0, .022, 4, C.gold, M);
    b.at(0, hP - .025, 0, 0, 1, 0, bad ? -1.32 : 0);
    const Hh = .13, segs = 4, k = bad ? 0 : 1.5;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = .012 + L * t0, x1 = .012 + L * t1;
      const w0 = bad ? 0 : Math.sin(t0 * 5.2) * .028, w1 = bad ? 0 : Math.sin(t1 * 5.2) * .028;
      const top0 = -Hh * .5 * t0, top1 = -Hh * .5 * t1, bot0 = -Hh + Hh * .5 * t0, bot1 = -Hh + Hh * .5 * t1;
      const cc = i === 1 ? mix3(col, C.gold, .45) : col, oo = k ? { k } : undefined;
      if (i === segs - 1) { tri2(b, [x0, bot0, w0], [x1, top1, w1], [x0, top0, w0], cc, oo); continue; }
      b.quad([x0, bot0, w0], [x1, bot1, w1], [x1, top1, w1], [x0, top0, w0], cc, oo);
      b.quad([x1, bot1, w1], [x0, bot0, w0], [x0, top0, w0], [x1, top1, w1], cc, oo);
    }
    b.pop();
    if (bad) b.pop();
    b.pop();
  }

  /* ================= 弧墙 ================= */
  function setLevel(lv) {
    if (lv >= 2) { HM = 1.3; HE = .82; } else { HM = .9; HE = .6; }
    nR = Math.max(1, Math.round((HM - Y0) / .118)); RH = (HM - Y0) / nR;
  }
  function footRun(b, aL, aR) {                             /* 勒脚：两面一层深色泛绿的大块毛石，顶上斜收一道 */
    for (const [r, s] of [[RO, 1], [RI, -1]]) {
      let t = aL;
      while (t < aR - 1e-5) {
        let L = (.26 + R() * .16) / r; if (aR - (t + L) < .1 / r) L = aR - t;
        const ta = t, tb = t + L, tm = (ta + tb) / 2, n = ON(tm).map(v => v * s), rr = r + s * .035, c = mix3(mix3(ST2, STD, .3 + R() * .45), C.ivy, .1 + R() * .08);
        qf(b, P(ta, rr, -.14), P(tb, rr, -.14), P(tb, rr, Y0 - .025), P(ta, rr, Y0 - .025), c, n);
        qf(b, P(ta, rr, Y0 - .025), P(tb, rr, Y0 - .025), P(tb, r, Y0 + .012), P(ta, r, Y0 + .012), mix3(c, DRESS2, .3), [n[0], 1, n[2]]);
        t = tb;
      }
    }
  }
  function wallRun(b, aL, aR, vents) {                      /* 墙身两面：一层层错缝毛石（每块略往里仰，深浅不一），墙头顺着 H(a) 削下去；vents 是穿墙的透风口 */
    for (const [r, s] of [[RO, 1], [RI, -1]]) {
      for (let j = 0; j < nR; j++) {
        const ya = Y0 + j * RH, yb = ya + RH, vs = vents.filter(v => j >= v.j0 && j < v.j1);
        let E = [aL], t = aL + ((j + (s > 0 ? 0 : 1)) % 2 ? .07 : .14 + R() * .06) / r;
        while (t < aR - .07 / r) { E.push(t); t += (.12 + R() * .17) / r; }
        E.push(aR);
        for (const v of vs) { E = E.filter(c => c === aL || c === aR || c < v.a0 - .045 / r || c > v.a1 + .045 / r); E.push(v.a0, v.a1); }
        E.sort((p, q) => p - q);
        for (let k = 0; k < E.length - 1; k++) {
          const ta = E[k], tb = E[k + 1];
          if (tb - ta < 1e-5 || vs.some(v => ta >= v.a0 - 1e-6 && tb <= v.a1 + 1e-6)) continue;
          const hA = H(ta), hB = H(tb); if (ya >= hA - .005 && ya >= hB - .005) continue;
          const yA = Math.max(ya, Math.min(yb, hA)), yB = Math.max(ya, Math.min(yb, hB)), tm = (ta + tb) / 2, rt = r - s * R() * .016;
          qf(b, P(ta, r, ya), P(tb, r, ya), P(tb, rt, yB), P(ta, rt, yA), sc(ya), ON(tm).map(x => x * s));
        }
      }
      /* 几块穿墙的拉结石，头露在墙面外 */
      for (let i = 0, n = Math.round((aR - aL) * r / .5); i < n; i++) {
        const t = aL + (i + .3 + R() * .4) / n * (aR - aL), jj = 1 + Math.floor(R() * (nR - 2)), y = Y0 + jj * RH + .02;
        if (y > H(t) - .14 || vents.some(v => t > v.a0 - .1 && t < v.a1 + .1)) continue;
        const p = P(t, r); b.at(p[0], 0, p[2], -t + (s > 0 ? PI : 0)); cbox(b, 0, y, -.01, .1 + R() * .05, RH - .035, .035, mix3(sc(y), DRESS2, .35)); b.pop();
      }
    }
  }
  function capRun(b, aL, aR, gap) {                         /* 鞍形压顶石：一块块顺着墙头的弧，外沿、两坡、内沿、端面；gap 里那段掉了 */
    let t = aL;
    const ro = RO + .03, ri = RI - .03, sh = .045, rg = .1;
    while (t < aR - 1e-5) {
      let L = (.2 + R() * .13) / RW; if (aR - (t + L) < .09 / RW) L = aR - t;
      const ta = t, tb = t + L; t = tb;
      const j = R() * .012, c0 = capC(), c = R() < .14 ? mix3(c0, C.ivy, .35) : c0;
      if (gap && tb > gap[0] && ta < gap[1]) {               /* 掉了压顶石的地方：墙芯露出来 */
        const n = 2;
        for (let i = 0; i < n; i++) { const u0 = ta + (tb - ta) * i / n, u1 = ta + (tb - ta) * (i + 1) / n; qf(b, P(u0, RO, H(u0) - .01), P(u1, RO, H(u1) - .01), P(u1, RI, H(u1) - .01), P(u0, RI, H(u0) - .01), mix3(STD, INNER, .3), [0, 1, 0]); }
        continue;
      }
      const hA = H(ta) + j, hB = H(tb) + j, tm = (ta + tb) / 2, n = ON(tm);
      const Ao = P(ta, ro, hA), Bo = P(tb, ro, hB), Ao2 = P(ta, ro, hA + sh), Bo2 = P(tb, ro, hB + sh), Ar = P(ta, RW, hA + rg), Br = P(tb, RW, hB + rg);
      const Ai = P(ta, ri, hA), Bi = P(tb, ri, hB), Ai2 = P(ta, ri, hA + sh), Bi2 = P(tb, ri, hB + sh);
      qf(b, Ao, Bo, Bo2, Ao2, mix3(c, STD, .18), n);
      qf(b, Ao2, Bo2, Br, Ar, c, [n[0], 1.4, n[2]]);
      qf(b, Ai2, Bi2, Br, Ar, mix3(c, DRESS, .22), [-n[0], 1.4, -n[2]]);
      qf(b, Ai, Bi, Bi2, Ai2, mix3(c, STD, .1), [-n[0], 0, -n[2]]);
      qf(b, Ai, Bi, Bo, Ao, mix3(c, INNER, .5), [0, -1, 0]);
      for (const [tt, sg, Q] of [[ta, -1, [Ai, Ao, Ao2, Ar, Ai2]], [tb, 1, [Bi, Bo, Bo2, Br, Bi2]]]) {
        const tv = TG(tt).map(v => v * sg), ec = mix3(c, STD, .25);
        for (let i = 1; i < 4; i++) tf(b, Q[0], Q[i], Q[i + 1], ec, tv);
      }
    }
  }
  function vent(b, v, cy) {                                 /* 透风口：穿墙的窄口，两侧墙洞壁、料石窗台、上面一块通身的料石过梁 */
    const yb = Y0 + v.j0 * RH, yt = Y0 + v.j1 * RH, am = (v.a0 + v.a1) / 2, rev = mix3(ST2, STD, .5);
    qf(b, P(v.a0, RI, yb), P(v.a0, RO, yb), P(v.a0, RO, yt), P(v.a0, RI, yt), rev, TG(v.a0));
    qf(b, P(v.a1, RI, yb), P(v.a1, RO, yb), P(v.a1, RO, yt), P(v.a1, RI, yt), rev, TG(v.a1).map(x => -x));
    const p = P(am, RW), w = (v.a1 - v.a0) * RW;
    b.at(p[0], 0, p[2], -am);
    b.box(0, yb - .04, 0, w + .07, .04, TW + .05, DRESS2, { nb: true, top: mix3(DRESS2, rev, .3) });
    b.box(0, yt, 0, w + .13, .09, TW + .026, DRESS, { front: DRESS2, back: mix3(DRESS2, STD, .2) });
    for (let y = yb + .05; y < yt - .03; y += .085) b.at(0, y, 0, 0, 1, -.62).box(0, -.012, 0, w + .01, .024, TW * .62, mix3(DRESS2, STD, .35), { top: DRESS2 }).pop();   /* 往外压低的石百叶片 */
    b.pop();
  }
  function pier(b, a, end, cy) {                            /* 扶壁石墩：一层层料石（隅石深浅交替）、压顶石板；两端顶石球，中间四坡石帽；外侧（迎风）一道斜撑 */
    const p = P(a, RW), h = H(a) + (end ? .12 : .09), w = end ? .22 : .19, zi = TW / 2 + (end ? .05 : .04), zo = -TW / 2 - .05, d = zi - zo, zc = (zi + zo) / 2;
    b.at(p[0], 0, p[2], -a);
    const n = Math.max(3, Math.round((h + .14) / .15)), hh = (h + .14) / n;
    for (let k = 0; k < n; k++) {                            /* 隅石：一层整块（浅），一层两块（深浅各一），宽窄差一点点 */
      const y = -.14 + k * hh, q = k % 2, ww = w + (q ? -.006 : .006), dd = d + (q ? .006 : -.006);
      if (q) { const sp = (R() - .5) * .06; b.box(-ww / 4 + sp / 2, y, zc, ww / 2 + sp, hh, dd, sc(y), { nb: true }); b.box(ww / 4 + sp / 2, y, zc, ww / 2 - sp, hh, dd, sc(y), { nb: true }); }
      else b.box(0, y, zc, ww, hh, dd, mix3(sc(y), DRESS2, .4), { nb: true });
    }
    b.box(0, h, zc, w + .06, .045, d + .06, DRESS2, { nb: true, top: DRESS });
    let top = h + .045;
    if (end) {
      b.box(0, top, zc, .12, .045, .12, DRESS2, { nb: true, top: DRESS });
      b.sphere(0, top + .1, zc, .055, 6, mix3(DRESS, C.stone, .3)); top += .155;
    } else { b.pyramid(0, top, zc, w + .03, d + .03, .1, mix3(DRESS2, STD, .2)); top += .1; }
    b.at(0, 0, zo, PI);
    wedge(b, w - .04, -.12, -.01, .24, h * .58, .14, mix3(ST2, STD, .25 + R() * .2), DRESS2);
    b.pop();
    b.pop();
    return top;
  }

  /* ================= 院里 ================= */
  function seat(b, aL, aR) {                                /* 贴墙的弧形石凳：料石凳面、正面、两头，三只石墩脚 */
    const r0 = RI - .21, r1 = RI - .004, y = .21, n = 3;
    for (let i = 0; i < n; i++) {
      const ta = aL + (aR - aL) * i / n, tb = aL + (aR - aL) * (i + 1) / n, c = mix3(DRESS2, DRESS, R() * .7), tm = (ta + tb) / 2;
      qf(b, P(ta, r0, y), P(tb, r0, y), P(tb, r1, y), P(ta, r1, y), c, [0, 1, 0]);
      qf(b, P(ta, r0, y - .055), P(tb, r0, y - .055), P(tb, r0, y), P(ta, r0, y), mix3(c, STD, .25), ON(tm).map(x => -x));
      qf(b, P(ta, r0, y - .055), P(tb, r0, y - .055), P(tb, r1, y - .055), P(ta, r1, y - .055), INNER, [0, -1, 0]);
    }
    for (const [t, sg] of [[aL, -1], [aR, 1]]) qf(b, P(t, r0, y - .055), P(t, r1, y - .055), P(t, r1, y), P(t, r0, y), mix3(DRESS2, STD, .2), TG(t).map(x => x * sg));
    for (const t of [aL + .05, (aL + aR) / 2, aR - .05]) { const p = P(t, (r0 + r1) / 2 + .02); b.at(p[0], 0, p[2], -t); b.box(0, -.03, 0, .085, .185, .15, mix3(ST2, STD, R() * .4), { nb: true }); b.pop(); }
  }
  function paving(b, lv) {                                  /* 墙脚两圈石板地：一块块不规整的石板，缝里露草 */
    [[1.22, 1.41], [1.0, 1.2]].forEach(([r0, r1], ri) => {
      const rm = (r0 + r1) / 2, lim = 56 * DEG;
      let t = -lim + (ri ? .06 : 0);
      while (t < lim - .02) {
        const tb = Math.min(lim, t + (.19 + R() * .13) / rm), skip = lv >= 3 && Math.abs((t + tb) / 2) < (ri ? 25 : 18) * DEG;
        if (!skip) {
          const g = .013 / rm, y = .008 + R() * .008, c = mix3(mix3(C.stone, STD, .15 + R() * .5), C.ivy, R() < .2 ? .22 : 0), jr = (R() - .5) * .03;
          qf(b, P(t + g, r0 + .012 + jr, y), P(tb - g, r0 + .012, y), P(tb - g, r1 - .012, y), P(t + g, r1 - .012 + jr, y), c, [0, 1, 0]);
        }
        t = tb;
      }
    });
  }
  function shrub(b, x, z, s, lav) {                         /* 一丛黄杨（lav 是薰衣草：绿丛上冒一簇淡紫穗） */
    const g = mix3(C.leafD, C.ivy, R() * .6);
    b.sphere(x, .1 * s, z, .17 * s, 6, g, { sy: .78, k: 1.1 });
    b.sphere(x + .12 * s, .07 * s, z + .05 * s, .12 * s, 5, mix3(g, C.leaf, .28), { sy: .78, k: 1.1 });
    b.sphere(x - .11 * s, .065 * s, z - .04 * s, .11 * s, 5, mix3(g, C.leafD, .35), { sy: .82, k: 1.1 });
    if (lav) for (let i = 0; i < 7; i++) {
      const a = R() * TAU, r = R() * .13 * s, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
      b.beam([px, .12 * s, pz], [px + (R() - .5) * .03, .27 * s, pz + (R() - .5) * .03], .008, C.leafD, { k: 1.25 });
      b.cone(px, .22 * s, pz, .022, .09 * s, 4, LAV[i % 2], { k: 1.25 });
    }
  }
  function birdbath(b, x, z, cy) {                         /* 石鸟浴盆：八角石座、收腰石柱、浅石盆里一汪水，盆沿落着两片叶；2077 盆沿一道旧铜箍 */
    b.cyl(x, -.04, z, .13, .08, 8, mix3(ST2, STD, .3), { top: DRESS2, a0: PI / 8 });
    b.cyl(x, .04, z, .06, .2, 8, DRESS2, { r2: .04, nb: true, nt: true, a0: PI / 8 });
    b.cyl(x, .24, z, .04, .05, 8, DRESS, { r2: .17, nb: true, nt: true, a0: PI / 8 });
    b.cyl(x, .29, z, .17, .04, 10, DRESS, { nb: true, nt: true });
    b.cyl(x, .29, z, .15, .035, 10, mix3(DRESS2, STD, .3), { r2: .15, nb: true, top: mix3(C.water, C.stoneD, .45), mat: "water" });
    b.ring(x, .33, z, .15, .17, 10, mix3(DRESS, C.ivy, .12));
    if (cy) b.cyl(x, .305, z, .175, .02, 10, AGED, { nt: true, nb: true, mat: "gloss" });
    for (const [a, c] of [[.6, C.leaf], [2.4, C.leafD]]) { b.at(x + Math.cos(a) * .16, .332, z + Math.sin(a) * .16, a); fan(b, [[-.025, 0], [0, -.012], [.025, 0], [0, .012]].map(([u, v]) => [u, v]), 0, c); b.pop(); }
  }
  function tufts(b, aL, aR, r, n) {                         /* 墙脚的草簇：几片细叶 */
    for (let i = 0; i < n; i++) {
      const t = aL + (aR - aL) * (i + R() * .8) / n, p = P(t, r + (R() - .5) * .05), g = mix3(C.grass, C.leafD, .3 + R() * .5);
      for (let k = 0; k < 3; k++) { const a = R() * TAU; b.at(p[0], 0, p[2], a, 1, (R() - .5) * .5); b.tri([-.018, 0, 0], [.018, 0, 0], [0, .08 + R() * .07, 0], g, { k: 1.15 }); b.tri([.018, 0, 0], [-.018, 0, 0], [0, .08, 0], g, { k: 1.15 }); b.pop(); }
    }
  }
  function chime(b, x, z, bad) {                            /* 木风铃：石座上一根木柱，柱顶一只小圆木架戴石板瓦小尖帽，帽下一圈六根长短不一的木管，中间击锤和风帆随风摆 */
    b.at(x, 0, z);
    b.cyl(0, -.05, 0, .1, .1, 8, mix3(ST2, STD, .3), { top: DRESS2, a0: PI / 8 });
    if (bad) b.at(0, .05, 0, 0, 1, .1, .26);
    const ht = .74, rr = .1;
    b.cyl(0, .02, 0, .028, ht - .02, 6, OAK, { r2: .022, nb: true });
    b.beam([0, ht - .1, 0], [.07, ht - .02, 0], .016, OAK2); b.beam([0, ht - .1, 0], [-.07, ht - .02, 0], .016, OAK2);
    b.cyl(0, ht - .02, 0, rr + .02, .035, 10, OAK2, { top: mix3(OAK2, C.woodL, .3), bot: OAK });
    b.cyl(0, ht + .015, 0, rr + .045, .03, 10, SL2, { r2: rr + .03, nb: true, nt: true });
    b.cone(0, ht + .045, 0, rr + .03, .13, 10, SL, { nb: true });
    b.cyl(0, ht + .17, 0, .012, .05, 4, IRON, M); b.sphere(0, ht + .225, 0, .016, 4, BRONZE, M);
    const L = [.17, .22, .26, .2, .15, .24];
    for (let i = 0; i < 6; i++) {
      if (bad && (i === 1 || i === 4)) continue;
      const a = i / 6 * TAU + .3, xx = Math.cos(a) * rr * .72, zz = Math.sin(a) * rr * .72, yt = ht - .05;
      b.beam([xx, ht - .02, zz], [xx, yt, zz], .004, ROPE, { k: 1.15 });
      b.cyl(xx, yt - L[i], zz, .014, L[i], 5, i % 2 ? TUBE : mix3(TUBE, TUBED, .4), { k: 1.25, top: TUBED, bot: TUBED });
    }
    b.beam([0, ht - .02, 0], [0, ht - .34, 0], .004, ROPE, { k: 1.2 });
    b.cyl(0, ht - .25, 0, .04, .016, 7, OAK2, { k: 1.3 });
    b.box(0, ht - .45, 0, .08, .1, .01, mix3(OAK2, C.woodL, .4), { k: 1.5 });
    if (bad) b.pop();
    b.pop();
    if (bad) for (const [dx, dz, L, a] of [[.16, .1, .22, .4], [-.08, .18, .2, 1.9]]) { b.at(x + dx, .014, z + dz, a, 1, 0, PI / 2); b.cyl(0, -L / 2, 0, .014, L, 5, mix3(TUBE, TUBED, .3)); b.pop(); }
  }
  function runeStone(b, x, z, a, tx, tz, cy, down) {        /* 符文立石：略歪的粗石板、斜削的顶、一列淡紫符文（e .32）；2077 戴旧黄铜帽；down 倒伏 */
    const c = mix3(ST2, C.stone, .2 + R() * .4), top = mix3(c, DRESS, .3);
    if (down) b.at(x, .06, z, a + .4, 1, PI / 2 - .08, .12); else b.at(x, 0, z, a, 1, tx, tz);
    b.box(0, -.08, 0, .15, .64, .1, c, { nb: true, top });
    b.pyramid(0, .56, 0, .15, .1, .07, top);
    b.panel(.04, .02, .051, .05, .12, mix3(C.ivy, c, .45));
    b.panel(0, .1, .052, .016, .36, RUNE, { e: .32 });
    for (let k = 0; k < 4; k++) { const y = .15 + k * .08, s = k % 2 ? 1 : -1; b.panel(s * .02, y, .053, .032, .013, RUNE, { e: .32 }); }
    b.panel(0, .48, .053, .05, .013, RUNE, { e: .32 });
    if (cy) { b.box(0, .52, 0, .17, .035, .12, AGED, GL); b.pyramid(0, .555, 0, .17, .12, .06, AGED, GL); }
    b.pop();
    if (!down) { b.at(x, 0, z, a); b.box(0, -.04, .02, .26, .06, .2, mix3(C.stone, ST2, .45), { nb: true, top: FLOOR }); b.pop(); }
  }

  /* ---------- 2077 小件 ---------- */
  function louvres(b, aL, aR, bad) {                        /* 墙头的黄铜框玻璃百叶：旧铜立柱、上下横档，上下两排往外仰的玻璃叶片；待修时碎几片 */
    const n = Math.max(2, Math.round((aR - aL) * RW / .24)), y0 = .095, y1 = .43;
    const Q = (t, r, dy) => P(t, r, H(t) + dy);
    for (let i = 0; i <= n; i++) { const t = aL + (aR - aL) * i / n; b.beam(Q(t, RW, y0 - .02), Q(t, RW, y1 + .015), i === 0 || i === n ? .024 : .016, AGED, GL); }
    for (let i = 0; i < n; i++) {
      const ta = aL + (aR - aL) * i / n, tb = aL + (aR - aL) * (i + 1) / n;
      b.beam(Q(ta, RW, y1), Q(tb, RW, y1), .022, BRASS, GL);
      b.beam(Q(ta, RW, y0), Q(tb, RW, y0), .02, AGED, GL);
      b.beam(Q(ta, RW + .01, y0 + .17), Q(tb, RW + .01, y0 + .17), .012, AGED, GL);
      for (let k = 0; k < 2; k++) {
        if (bad && (i * 2 + k) % 5 === 2) continue;
        const ya = y0 + .012 + k * .165, yb = ya + .16;
        b.quad(Q(ta, RW - .028, ya), Q(tb, RW - .028, ya), Q(tb, RW + .03, yb), Q(ta, RW + .03, yb), GLASS, { mat: "glass" });
      }
    }
  }
  function anemometer(b, o, x, z, bad) {                    /* 黄铜风杯测速仪：石座、黄铜杆、表盒（奶白表盘）、顶上三只风杯慢转；待修时不转、杆子歪 */
    b.at(x, 0, z);
    b.cyl(0, -.05, 0, .12, .1, 8, DRESS2, { top: DRESS });
    if (bad) b.at(0, .05, 0, 0, 1, .1, -.18);
    b.cyl(0, .05, 0, .03, .95, 6, BRASS, { r2: .02, mat: "gloss", nb: true });
    for (const y of [.12, .78]) b.cyl(0, y, 0, .036, .02, 6, AGED, GL);
    b.box(0, .46, .035, .13, .15, .05, BRASS, GL);
    { const N = 10, ring = k => Array.from({ length: N }, (_, i) => [Math.cos(i / N * TAU) * k, Math.sin(i / N * TAU) * k]);
      b.at(0, .535, .061); fan(b, ring(.05), 0, FACE); fan(b, ring(.056), -.001, AGED, GL);
      b.quad([-.004, 0, .002], [.004, 0, .002], [.03, .03, .002], [.022, .034, .002], IRON); b.pop(); }
    b.box(0, .44, .061, .08, .012, .004, AGED, GL);
    const fn = sb => {
      sb.sphere(0, 0, 0, .032, 5, BRASS, GL);
      sb.cone(0, .02, 0, .03, .06, 6, AGED, GL);
      for (let k = 0; k < 3; k++) {
        const a = k / 3 * TAU + .3, ex = Math.cos(a) * .17, ez = Math.sin(a) * .17, tx = -Math.sin(a), tz = Math.cos(a);
        sb.beam([0, 0, 0], [ex, 0, ez], .011, BRASS, GL);
        tube(sb, [ex - tx * .035, 0, ez - tz * .035], [ex + tx * .03, 0, ez + tz * .03], .046, .012, BRASS, GL, 7);
      }
    };
    if (bad) { b.at(0, 1.0, 0, .8, 1, .25); fn(b); b.pop(); } else b.spin(0, 1.0, 0, "y", 1.1, fn);
    if (bad) b.pop();
    b.pop();
  }
  function airship(b, s) {                                  /* 黄铜小飞艇（艇身沿本地 x）：气囊、两道箍、吊舱、十字尾翼 */
    b.at(0, 0, 0, 0, s);
    b.at(0, 0, 0, 0, [1, .4, .4]); b.sphere(0, 0, 0, .13, 8, mix3(C.cream, C.stone, .3), GL); b.pop();
    for (const dx of [-.05, .05]) { b.at(dx, 0, 0, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .049, .006, 8, 3, BRASS, GL); b.pop(); }
    b.beam([.02, -.045, 0], [.02, -.06, 0], .008, BRASS, GL);
    b.box(.02, -.078, 0, .06, .022, .026, BRASS, GL);
    b.box(-.115, -.035, 0, .05, .07, .006, BRASS, GL); b.box(-.115, 0, 0, .05, .006, .08, BRASS, GL);
    b.pop();
  }
  function airshipVane(b, x, y, z, h, ry) {                 /* 墩顶的小飞艇风向标（静的）：铁杆、方位十字、一只黄铜小飞艇 */
    b.beam([x, y - .04, z], [x, y + h, z], .016, IRON, M);
    b.beam([x - .07, y + h * .45, z], [x + .07, y + h * .45, z], .01, IRON, M);
    b.beam([x, y + h * .45, z - .07], [x, y + h * .45, z + .07], .01, IRON, M);
    b.at(x, y + h + .045, z, ry); airship(b, 1); b.pop();
  }
  function catLamp(b, x, z, h, off) {                       /* 黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, -.05, z, .05, .09, 6, DRESS2);
    b.beam([x, 0, z], [x, h, z], .022, BRASS, M);
    b.beam([x, h, z], [x + .1, h + .06, z], .016, BRASS, M);
    b.beam([x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, M);
    b.sphere(x, h + .01, z, .025, 4, BRASS, M);
    if (!off) b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }

  /* ================= Lv3：镇风塔 ================= */
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆塔身：一圈圈石砌，层层错半块；里头一根深色芯 */
    const n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU;
        b.quad([cx + Math.sin(a) * r, ya, cz + Math.cos(a) * r], [cx + Math.sin(a2) * r, ya, cz + Math.cos(a2) * r], [cx + Math.sin(a2) * r, yb, cz + Math.cos(a2) * r], [cx + Math.sin(a) * r, yb, cz + Math.cos(a) * r], sc(ya));
      }
    }
    b.cyl(cx, y0, cz, r * Math.cos(PI / seg) - .006, y1 - y0, seg, STD, { nb: true, a0: PI / seg, top: FLOOR });
  }
  function slateCone(b, cx, y0, cz, r, h, seg) {            /* 石板瓦圆锥矮顶：一道道错开的瓦，每片深浅不一 */
    const nb = 5, Q = (a, rr, yy) => [cx + Math.sin(a) * rr, yy, cz + Math.cos(a) * rr];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * (1 - t0) + .008, rb = r * (1 - t1), ya = y0 + h * t0, yb = y0 + h * t1 + (i < nb - 1 ? .014 : 0), off = (i % 2) * .5;
      for (let k = 0; k < seg; k++) {
        const a0 = (k + off) / seg * TAU, a1 = (k + 1 + off) / seg * TAU, am = (a0 + a1) / 2, rr = R(), base = i % 2 ? SL : SL2;
        const col = rr < .2 ? mix3(base, SLD, .55) : rr > .86 ? mix3(base, [.5, .52, .56], .15) : mix3(base, SLD, rr * .25), hint = [Math.sin(am), .9, Math.cos(am)];
        if (i === nb - 1) tf(b, Q(a0, ra, ya), Q(a1, ra, ya), [cx, y0 + h, cz], col, hint);
        else qf(b, Q(a0, ra, ya), Q(a1, ra, ya), Q(a1, rb, yb), Q(a0, rb, yb), col, hint);
      }
    }
  }
  function catSil(b, col) {                                 /* 风向标上弓背的黑猫剪影（本地 x-y 平面，面朝 +x，坐在 y=0 上），两面都画 */
    const body = [[-.085, 0], [.035, 0], [.05, .035], [.045, .08], [.02, .108], [-.03, .112], [-.07, .088], [-.092, .045]];
    for (let i = 1; i < body.length - 1; i++) tri2(b, [body[0][0], body[0][1], 0], [body[i][0], body[i][1], 0], [body[i + 1][0], body[i + 1][1], 0], col, M);
    const hc = [.052, .14], hr = .036, hd = [];
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; hd.push([hc[0] + Math.cos(a) * hr, hc[1] + Math.sin(a) * hr]); }
    for (let i = 1; i < hd.length - 1; i++) tri2(b, [hd[0][0], hd[0][1], 0], [hd[i][0], hd[i][1], 0], [hd[i + 1][0], hd[i + 1][1], 0], col, M);
    tri2(b, [.03, .162, 0], [.034, .2, 0], [.05, .17, 0], col, M);
    tri2(b, [.058, .172, 0], [.074, .2, 0], [.082, .158, 0], col, M);
    const tl = [[-.085, .02], [-.13, .05], [-.14, .11], [-.115, .15]];
    for (let i = 0; i < tl.length - 1; i++) b.beam([tl[i][0], tl[i][1], 0], [tl[i + 1][0], tl[i + 1][1], 0], .016, col, M);
  }
  function towerVane(b, o, y) {                             /* 塔顶大风向标：铁杆、方位十字（四个小铁字头）、慢转的箭头（1994 蹲一只黑猫，2077 一只黄铜小飞艇）；待修不转、歪着 */
    const cy = o.cy;
    b.beam([0, y - .06, 0], [0, y + .36, 0], .022, IRON, M);
    b.sphere(0, y + .04, 0, .034, 5, cy ? BRASS : BRONZE, cy ? GL : M);
    for (let k = 0; k < 4; k++) { b.at(0, y + .17, 0, k * PI / 2); b.beam([0, 0, 0], [0, 0, .15], .011, IRON, M); b.pyramid(0, -.025, .15, .03, .012, .05, IRON, M); b.pop(); }
    const fn = sb => {
      sb.cyl(0, -.03, 0, .022, .06, 6, IRON, M);
      if (!cy) {
        sb.beam([-.3, 0, 0], [.22, 0, 0], .014, IRON, M);
        sb.at(.22, 0, 0, 0, 1, 0, -PI / 2); sb.cone(0, 0, 0, .04, .1, 4, IRON, M); sb.pop();
        for (const s of [-1, 1]) tri2(sb, [-.3, 0, 0], [-.38, s * .075, 0], [-.22, s * .01, 0], IRON, M);
        sb.at(-.05, .007, 0, 0, 1.15); catSil(sb, mix3(IRON, [.1, .1, .12], .4)); sb.pop();
      } else {
        sb.beam([-.24, 0, 0], [.18, 0, 0], .012, BRASS, GL);
        sb.at(.18, 0, 0, 0, 1, 0, -PI / 2); sb.cone(0, 0, 0, .032, .08, 4, BRASS, GL); sb.pop();
        for (const s of [-1, 1]) tri2(sb, [-.24, 0, 0], [-.3, s * .06, 0], [-.18, s * .01, 0], BRASS, GL);
        sb.beam([0, 0, 0], [0, .07, 0], .01, BRASS, GL);
        sb.at(-.01, .13, 0); airship(sb, 1.3); sb.pop();
      }
    };
    if (o.bad) { b.at(0, y + .28, 0, .7, 1, .3, .12); fn(b); b.pop(); } else b.spin(0, y + .28, 0, "y", .25, fn);
  }
  function tower(b, o) {                                    /* 镇风塔：勒脚、石鼓身、腰线、门、窗、箭缝、六角开敞钟室、铜钟、托石檐口、圆锥矮顶、风向标 */
    reseed(40);
    const cy = o.cy;
    b.cyl(TXc, -.14, TZc, TR + .08, .26, 14, mix3(ST2, STD, .45), { r2: TR + .04, nb: true, top: DRESS2, a0: PI / 14 });
    rwall(b, TXc, TZc, TR, .12, YD, 14, .165);
    b.cyl(TXc, 1.02, TZc, TR + .022, .05, 14, DRESS2, { a0: PI / 14, nb: true, top: DRESS });
    b.cyl(TXc, YD, TZc, TR + .035, .065, 14, DRESS2, { a0: PI / 14, top: mix3(FLOOR, INNER, .3) });
    b.at(TXc, 0, TZc);
    /* 正面：门、门券、石阶、门上烛光窗、门边提灯 */
    b.at(0, .12, TR - .015); archRing(b, .26, .4, .64, .065, -.05, .04); b.at(0, 0, .005); door(b, .26, .4, .64); b.pop(); b.pop();
    b.box(0, -.08, TR + .12, .46, .15, .24, mix3(ST2, STD, .3), { nb: true, top: DRESS2 });
    b.box(0, -.08, TR + .3, .38, .1, .14, mix3(ST2, STD, .4), { nb: true, top: DRESS });
    lancet(b, 0, 1.22, TR - .012, .12, .22, { cy });
    for (const a of [-.58, .58]) { b.at(0, 0, 0, a); wallLantern(b, 0, .74, TR - .01, cy); b.pop(); }
    for (const [a, y] of [[1.15, .72], [-1.15, .78], [1.6, 1.42], [-1.7, 1.38]]) { b.at(0, 0, 0, a); slit(b, 0, y, TR - .006); b.pop(); }
    /* 钟室：六面，每面两道料石边墩、尖拱开口（2077 嵌黄铜框玻璃）、低矮窗台；顶棚、横梁、铜钟 */
    const ow = .25, yS = YD + .27, pw = (BR - ow) / 2;
    for (let f = 0; f < 6; f++) {
      b.at(0, 0, 0, f * PI / 3);
      for (const s of [-1, 1]) {
        const xc = s * (ow / 2 + pw / 2);
        b.box(xc, YD + .065, AP - .05, pw, yS - YD - .065, .1, mix3(DRESS2, ST, R() * .4), { nb: true });
        b.box(xc, yS, AP - .05, pw, YB - yS, .1, sc(2), { nb: true });
      }
      archFill(b, ow, .68, yS, YB, AP, AP - .1, mix3(ST2, DRESS2, .25), INNER);
      b.box(0, YD + .065, AP - .05, ow, .09, .1, DRESS2, { nb: true, top: DRESS });
      if (cy) {
        b.at(0, YD + .155, AP - .05); fan(b, outline(ow, yS - YD - .155, 0, .68, 4), 0, GLASS, { mat: "glass" });
        b.panel(0, 0, .004, .014, yS - YD - .155 + archY(ow, .68, 0), BRASS, GL); b.panel(0, (yS - YD - .155) * .55, .005, ow, .012, BRASS, GL);
        b.pop();
      }
      for (let i = 0; i < 2; i++) cbox(b, (i - .5) * .2, YB - .07, AP - .02, .06, .08, AP + .05, DRESS2);
      b.pop();
    }
    b.cyl(0, YB - .005, 0, AP * 1.05, .01, 6, INNER, { a0: 0, nt: true });
    b.beam([-.17, YB - .06, 0], [.17, YB - .06, 0], .045, OAK);
    b.cyl(0, YB - .1, 0, .026, .045, 6, IRON, M);
    b.cyl(0, YB - .31, 0, .135, .21, 9, BRONZE, { r2: .07, mat: "metal", nt: true, bot: mix3(BRONZE, INNER, .6) });
    b.cyl(0, YB - .335, 0, .142, .03, 9, BRONZE, { r2: .135, mat: "metal", nt: true, nb: true });
    b.sphere(0, YB - .1, 0, .07, 6, BRONZE, { sy: .6, mat: "metal" });
    b.sphere(0, YB - .35, 0, .03, 4, IRON, M);
    /* 檐口、圆锥矮顶、风向标 */
    b.cyl(0, YB, 0, BR + .07, .075, 6, DRESS2, { top: SLD });
    b.cyl(0, YB + .075, 0, .6, .055, 14, SL2, { r2: .55, nt: true, bot: SLD, a0: PI / 14 });
    if (cy) b.cyl(0, YB + .06, 0, .605, .03, 14, BRASS, { mat: "gloss", nt: true, nb: true, a0: PI / 14 });
    slateCone(b, 0, YB + .125, 0, .55, .5, 14);
    towerVane(b, o, YB + .625);
    b.pop();
    b.at(TXc, 0, TZc); ivyR(b, 0, 0, TR, -.95, .12, 1.3, .9, 42); ivyR(b, 0, 0, TR, 2.2, .12, .9, .7, 22); b.pop();
  }
  function path(b) {                                        /* 门前一条踏步石小路 */
    for (let i = 0; i < 6; i++) {
      const z = TZc + TR + .5 + i * .23, x = (R() - .5) * .08 + (i % 2 ? .03 : -.03), w = .2 + R() * .06, d = .14 + R() * .03, c = mix3(C.stone, STD, R() * .5);
      b.at(x, .006, z, (R() - .5) * .4); fan(b, [[-w / 2, -d / 2], [w / 2 - .02, -d / 2], [w / 2, 0], [w / 2 - .03, d / 2], [-w / 2 + .02, d / 2], [-w / 2, .01]].map(([u, v]) => [u, -v]), 0, c); b.pop();
    }
  }

  /* ================= 拼起来 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad;
    setLevel(lv);
    reseed(lv);
    /* 墩、开间、透风口 */
    const PIERS = (lv >= 3 ? [-58, -29, 29, 58] : [-58, -29, 0, 29, 58]).map(d => d * DEG);
    const VA = (lv >= 3 ? [-43.5, -21, 21, 43.5] : [-43.5, -14.5, 14.5, 43.5]).map(d => d * DEG);
    const vents = VA.map(av => {
      const hw = .052 / RW, top = H(av) - .22;
      let j1 = 1; while (Y0 + (j1 + 1) * RH <= top + 1e-6) j1++;
      return { a0: av - hw, a1: av + hw, j0: 1, j1: Math.max(2, j1) };
    });
    const runs = lv >= 3 ? [[-A0, -AT], [AT, A0]] : [[-A0, A0]];
    const gap = bad ? [-41.5 * DEG, -35 * DEG] : null;
    for (const [aL, aR] of runs) {
      footRun(b, aL, aR);
      wallRun(b, aL, aR, vents.filter(v => v.a0 > aL && v.a1 < aR));
      capRun(b, aL, aR, gap);
    }
    vents.forEach(v => vent(b, v, cy));
    const pierTop = {};
    PIERS.forEach((a, i) => { pierTop[i] = pier(b, a, i === 0 || i === PIERS.length - 1, cy); });
    /* 常春藤：外面中段一片、里面左右各一片、墩上一点 */
    reseed(10 + lv);
    ivyArc(b, -1, -47 * DEG, .5, Y0, H(-47 * DEG) - .05, 34);
    ivyArc(b, -1, 36 * DEG, .32, Y0, H(36 * DEG) * .8, 22);
    ivyArc(b, 1, 8 * DEG, .6, Y0, HM * .85, 30);
    ivyArc(b, 1, -30 * DEG, .4, Y0, HM * .7, 18);
    /* 院里：石凳、石板地、灌木、风铃／测速仪、提灯 */
    reseed(20);
    seat(b, -54 * DEG, -36.5 * DEG); seat(b, 36.5 * DEG, 54 * DEG);
    paving(b, lv);
    shrub(b, -1.08, -.3, 1, false); shrub(b, 1.1, -.24, .95, true);
    shrub(b, -.36, -.62, .7, true);
    if (lv < 3) shrub(b, .13, -.86, .75, false); else shrub(b, .43, -.9, .7, false);
    shrub(b, .9, -.86, .62, false);
    if (lv >= 2) { shrub(b, -.86, -.18, .7, true); shrub(b, -.02, -.26, .55, true); }
    birdbath(b, -.34, -.3, cy);
    tufts(b, -56 * DEG, 56 * DEG, RI - .03, 12); tufts(b, -54 * DEG, 54 * DEG, RO + .06, 9);
    if (!cy) chime(b, .8, -.16, bad);
    else anemometer(b, o, .8, -.16, bad);
    if (lv < 3) for (const a of [-29 * DEG, 29 * DEG]) { const p = P(a, RW); b.at(p[0], 0, p[2], -a); wallLantern(b, 0, .66 + (lv >= 2 ? .12 : 0), .17, cy); b.pop(); }
    /* 三角旗、2077 小飞艇风向标 */
    reseed(30);
    const ptop = i => pierTop[i];
    const flags = [];                                        /* [角, 是否墩顶, 色] */
    if (lv < 3) { flags.push([-29, 1, 0], [29, 1, 1]); if (!cy) flags.push([0, 1, 2]); }
    else flags.push([-29, 1, 0], [29, 1, 1]);
    if (lv >= 2) flags.push([-43.5, 0, 1], [43.5, 0, 2]);
    flags.forEach(([d, onPier, ci], i) => {
      const a = d * DEG, idx = PIERS.findIndex(q => Math.abs(q - a) < 1e-6);
      const y = onPier ? ptop(idx) - .03 : H(a) + .09, p = P(a, onPier ? RW - .015 : RW);
      pennant(b, p[0], y, p[2], PEN[ci], .42 + (i % 2) * .06, (R() - .5) * .5, bad && i === 0, cy);
    });
    if (cy && lv < 3) { const p = P(0, RW - .015); airshipVane(b, p[0], ptop(2) - .03, p[2], .3, .4); }
    /* Lv2+：符文立石 */
    if (lv >= 2) {
      reseed(50);
      [[-40, 1.1], [-21, 1.08], [24, 1.1]].forEach(([d, r], i) => {
        const a = d * DEG, p = P(a, r);
        runeStone(b, p[0], p[2], -a, (R() - .5) * .12, (R() - .5) * .14, cy, bad && i === 2);
      });
    }
    /* Lv3：镇风塔、门前小路 */
    if (lv >= 3) { tower(b, { cy, bad }); reseed(60); path(b); }
    /* 2077：墙头玻璃百叶、猫球灯 */
    if (cy) {
      const dp = .135 / RW;                                  /* 墩子半宽：百叶从墩边起 */
      const bays = lv >= 3 ? [[-58, -29, 1, 1], [-29, -18, 1, 0], [18, 29, 0, 1], [29, 58, 1, 1]] : [[-58, -29, 1, 1], [-29, 0, 1, 1], [0, 29, 1, 1], [29, 58, 1, 1]];
      for (const [l, r, tl, tr] of bays) louvres(b, l * DEG + tl * dp, r * DEG - tr * dp, bad);
      catLamp(b, -.8, -.06, .8, bad);
    }
    /* 待修：掉下来的压顶石 */
    if (bad) {
      reseed(70);
      for (const [d, r, ry] of [[-38, 1.2, .5], [-40.5, 1.0, 1.4], [-36, .9, 2.3]]) {
        const p = P(d * DEG, r); b.at(p[0], .045, p[2], ry, 1, (R() - .5) * .5, (R() - .5) * .6);
        b.box(0, -.04, 0, .24, .07, .14, capC(), { top: DRESS2 }); b.pop();
      }
    }
  }
  build.h = o => { const lv = Math.max(1, Math.min(3, o.lv || 1)); return [0, 1.7, 2.1, 3.65][lv]; };
  Isle3D.FAC["防风屏障"] = build;
})();
