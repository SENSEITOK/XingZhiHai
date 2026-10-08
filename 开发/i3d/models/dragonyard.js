/* 龙场（1994 养龙场 / 2077 龙类养殖场）：霍格沃茨式的龙舍加一片圆沙场。正面朝 +z（岛心），高大的部分在 −z。
   布局：龙舍在后，x −1…1、z −1.6…−.3（山墙朝前，屋脊沿 z）；沙场是圆盘，r .95，中心 (0, .5)，平的；Lv2 栖塔在 (1.34, −.4)；Lv3 孵化房在 (−1.43, −.3)。
   1994 Lv1：龙舍——料石勒脚、错缝毛石墙（墙高 1.4）、两侧各两根两级扶壁、陡石板瓦两坡顶（屋脊 2.6），前后两道山墙女儿墙（料石压顶、墙肩托石），
             前山尖蹲一只石雕龙头，后山尖一座小尖塔；屋脊一道铁花脊饰，脊上一座石板瓦小排烟楼冒一缕烟。
             正面一个巨大的尖拱门洞（宽 .9、拱顶约 1.3）：料石门券、拱心石、滴水线，门洞里是暗的；门洞四周的石块被熏黑（往 C.castleD×.7 混）；
             右边挂着半扇铁箍木门（开着、往外歪）；门洞两侧铁臂提灯，山墙上一扇圆窗（铁十字棂、烛光）；两侧墙各一对尖拱烛光窗带滴水线；墙角常春藤。
             门里地上铺干草，一堆草垛露在门口。门前一块磨平的石门槛。
             沙场：沙色圆盘（C.hay 和 C.dirt 混），一圈料石沿；8 根粗木桩（铁箍、顶上铁环），桩间挂铁链，正前方留口；
             沙上几块烧焦的黑斑、几道爪痕、两根啃过的大骨头。
             场上一条绿龙蜷着睡：身子趴着、前爪交叠、头枕在前爪上闭着眼，尾巴从右边绕到身前，翅膀收拢贴在背上，背脊一排小骨刺；鼻孔冒一缕烟。
             场外左前一座挂肉架（木 A 字架、铁钩挂着低饱和暗红的肉块），右前一口料石饮水槽。
   1994 Lv2：右侧加一座圆石栖塔：错缝石砌塔身（收分）、箭缝、塔脚尖拱小门和提灯，塔顶一圈托石挑出一个宽平台（r .55，熏黑的石面、铁栏杆），
             一架长木梯靠上去；平台上站第二条龙（铜褐色，低面数），翅膀半张、慢慢扇，俯看沙场。
   1994 Lv3：左侧加一座孵化房：八角料石座、铁骨玻璃墙、铁骨尖玻璃穹顶加尖顶饰，前面一扇玻璃小门；里面暖沙上卧着四枚龙蛋（奶白到暖金，微亮 e .3），
             穹顶下吊一盏小暖灯。
   2077（龙类养殖场）：同一套石头。两条龙都换成贝壳龙（雾青、浅玫瑰灰的身子），背上一排粉彩色的扇贝甲片（C.bloom、C.cream、C.seaB 往石色混，低饱和）；
             铁链换成石墩之间的黄铜栏杆（三角形持平），木桩换成料石墩加黄铜球帽；沙场右边加一架黄铜喂食吊臂，吊着肉钩和一块肉；
             屋顶两坡各开一溜黄铜框玻璃天窗，排烟楼换黄铜风帽，前山尖龙头上立一只黄铜小飞艇风标（不转）；
             孵化房的骨架换黄铜；龙舍门口一根黄铜细杆托一盏浮着的猫球灯。不加霓虹、全息、罩子、beacon。
   动件：Lv2 起栖塔上那条龙的翅膀一组（bob）。粒子：龙鼻烟 1、排烟楼烟 1、2077 猫球灯 1。
   待修：渲染器统一压暗；模型里那半扇门掉下来平躺在门前，屋顶塌了一块露出黑洞，一段铁链（黄铜栏杆）断了耷拉到地上，一根木桩歪斜，提灯和窗不亮，
         不冒烟，栖塔木梯缺了几级、歪到一边，孵化房掉了几块玻璃、蛋不亮，猫球灯灭。
   前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西（桩都躲开，链子、栏杆都压在 .4 以下）。不画人形。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6), VOID = [.05, .045, .055];
  const SOOT = dim3(C.castleD, .7);                                                                    /* 熏黑的石头 */
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55);
  const SLD = mix3(SL, [.08, .08, .1], .4), SLM = mix3(SL, C.ivy, .45);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), IRON = mix3(C.iron, [.1, .1, .12], .2), BRONZE = mix3(C.gold, C.wood, .38);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35);
  const DOORW = mix3(C.woodD, C.wood, .25), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const MULL = mix3(IRON, OAK, .3);
  const OLDW = mix3(C.wood, [.55, .52, .48], .35), OLDWD = mix3(C.woodD, [.4, .38, .36], .25);
  const SAND = mix3(mix3(C.hay, C.dirt, .55), C.stone, .22), SAND2 = mix3(SAND, C.dirt, .45), SANDL = mix3(SAND, C.cream, .25);
  const SCORCH = mix3(SAND, [.13, .12, .11], .62), SCORCH2 = mix3(SAND, [.2, .17, .14], .38);
  const HAY = mix3(C.hay, [.86, .62, .26], .22), HAYD = mix3(C.hay, C.wood, .3), STRAW = mix3(C.hay, C.dirt, .35);
  const MEAT = [.46, .25, .22], MEAT2 = [.37, .2, .18], FAT = mix3(C.cream, C.dirt, .3);
  const BONE = mix3(C.cream, C.stone, .45), BONED = mix3(BONE, C.dirt, .35);
  const GLASS = mix3(C.glass, [.78, .88, .84], .3), WATER = [.3, .46, .54];
  const EGG = [mix3(C.cream, C.glow, .25), mix3(C.cream, C.glow, .55), mix3(C.cream, C.glow, .4), mix3(C.cream, C.glow, .7)];
  const SHELL = [mix3(mix3(C.bloom, C.cream, .45), C.stone, .22), mix3(mix3(C.seaB, C.cream, .55), C.stone, .22), mix3(C.cream, C.stone, .14), mix3(mix3(C.bloom, C.hay, .4), C.stone, .3)];
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- 基本面片 ---------- */
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }      /* 两面都看得见的薄片（翅膜、甲片） */
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
  function archX(w, p, dy) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, v = R0 * R0 - dy * dy; return v <= 0 ? -1 : cx + Math.sqrt(v); }   /* 起拱以上 dy 处拱的半宽（≤0 表示过了拱顶） */
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function along(b, p, q) {                                 /* 以 p 为原点、p→q 为 y 轴推一层变换，返回长度 */
    const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]);
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    return L;
  }
  function rod(b, a, c, t, col, o) {                        /* 细杆：只有四个侧面（肋、框、链环、栏杆） */
    const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const y = [d[0] / L, d[1] / L, d[2] / L], r = Math.abs(y[1]) < .95 ? [-y[2], 0, y[0]] : [0, y[2], -y[1]], rl = Math.hypot(r[0], r[1], r[2]);
    const x = [r[0] / rl, r[1] / rl, r[2] / rl], z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    b.push(new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1]));
    const h = t / 2, Q = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (let i = 0; i < 4; i++) { const p = Q[i], q = Q[(i + 1) % 4]; b.quad([q[0], 0, q[1]], [p[0], 0, p[1]], [p[0], L, p[1]], [q[0], L, q[1]], col, o); }
    b.pop();
  }
  function limb(b, p, q, r0, r1, seg, col, o) {              /* 两点之间一段收分圆柱（身子、尾巴、腿、圆木） */
    const L = along(b, p, q);
    if (L > 1e-6) b.cyl(0, 0, 0, r0, L, seg, col, Object.assign({ r2: r1, nt: true, nb: true }, o || {}));
    b.pop();
  }
  function ell(b, x, y, z, rx, ry, rz, seg, col, o, yaw, pitch, roll) { b.at(x, y, z, yaw || 0, [rx, ry, rz], pitch || 0, roll || 0); b.sphere(0, 0, 0, 1, seg, col, o); b.pop(); }
  const bobOr = (b, o, x, y, z, amp, spd, fn) => { if (o.bad) { b.at(x, y, z); fn(b); b.pop(); } else b.bob(x, y, z, amp, spd, fn); };

  /* ---------- 砌石 ---------- */
  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .58 + r * .42);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .3); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .3);
    if (r > .9) c = mix3(c, STD, .45); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.32, (.9 - y) * .32));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  /* 一面墙（面朝 +z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石；o.hole(ya) 给这一层要掏空的 [x0,x1]（门洞）；o.col(y, x) 自定石色 */
  function mason(b, hw, y0, y1, z, o) {
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .12 : .22) : 0, q1 = o.qr ? ((j + ph) % 2 ? .22 : .12) : 0;
      let cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .2 + R() * .24; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const hole = o.hole ? o.hole(ya) : null;
      if (hole) { cuts = cuts.filter(c => c < hole[0] - .04 || c > hole[1] + .04).concat(hole).sort((a, c) => a - c); }
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const xm = (E[k][0] + E[k + 1][0]) / 2;
        if (hole && xm > hole[0] && xm < hole[1]) continue;
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        const col = isQ ? mix3(DRESS2, ST, R() * .35) : sc(ya);
        b.quad([E[k][0], ya, z], [E[k + 1][0], ya, z], [E[k + 1][1], yb, z], [E[k][1], yb, z], o.col ? o.col(col, ya, xm) : col);
      }
    }
  }
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) {
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, x, z, ry, h) {                       /* 两级扶壁（局部 +z 往外） */
    b.at(x, 0, z, ry);
    wedge(b, .17, -.1, -.02, .28, h * .5 + .1, h * .34 + .1, mix3(ST2, STD, .3));
    wedge(b, .12, -.1, -.02, .16, h + .1, h * .84 + .1, sc(.6));
    b.pop();
  }
  /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、券底、拱心石；tint 往熏黑色混 */
  function archRing(b, w, h, p, fr, z0, z1, tint) {
    const n = 5, ai = archPts(w, p, n), ao = archPts(w + fr * 2, p, n), T = c => tint ? mix3(c, SOOT, tint * (.7 + R() * .3)) : c;
    const rev = mix3(DRESS2, STD, .35);
    for (const s of [-1, 1]) {
      const xi = s * w / 2, nq = 4;
      for (let j = 0; j < nq; j++) {
        const ya = h * j / nq, yb = h * (j + 1) / nq, xq = s * (w / 2 + fr * (j % 2 ? .78 : 1.15));
        qf(b, [xi, ya, z1], [xq, ya, z1], [xq, yb, z1], [xi, yb, z1], T(j % 2 ? DRESS : DRESS2), [0, 0, 1]);
        qf(b, [xq, ya, z0], [xq, ya, z1], [xq, yb, z1], [xq, yb, z0], T(DRESS2), [s, 0, 0]);
        qf(b, [xi, ya, z1], [xq, ya, z1], [xq, ya, z0], [xi, ya, z0], T(DRESS2), [0, 1, 0]);
      }
      qf(b, [xi, 0, z0], [xi, 0, z1], [xi, h, z1], [xi, h, z0], T(rev), [-s, 0, 0]);
    }
    for (let i = 0; i < ai.length - 1; i++) {
      const c = i % 2 ? DRESS : DRESS2, A = ai[i], B = ai[i + 1], Ao = ao[i], Bo = ao[i + 1];
      qf(b, [A[0], h + A[1], z1], [Ao[0], h + Ao[1], z1], [Bo[0], h + Bo[1], z1], [B[0], h + B[1], z1], T(c), [0, 0, 1]);
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      qf(b, [A[0], h + A[1], z0], [B[0], h + B[1], z0], [B[0], h + B[1], z1], [A[0], h + A[1], z1], T(rev), [-mx, -my - .05, 0]);
      qf(b, [Ao[0], h + Ao[1], z0], [Bo[0], h + Bo[1], z0], [Bo[0], h + Bo[1], z1], [Ao[0], h + Ao[1], z1], T(DRESS2), [mx, my + .05, 0]);
    }
    const kt = archY(w + fr * 2, p, 0); b.box(0, h + kt - .1, (z0 + z1) / 2 + .012, .1, .14, z1 - z0 + .024, T(DRESS), { nb: true });
  }
  function hood(b, w, h, p, z, n) {                          /* 拱上滴水线 */
    const ai = archPts(w, p, n), ao = archPts(w + .06, p, n), zh = z + .04;
    for (let i = 0; i < ai.length - 1; i++) {
      b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
      b.quad([ao[i + 1][0], h + ao[i + 1][1], z], [ao[i][0], h + ao[i][1], z], [ao[i][0], h + ao[i][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS2);
    }
    for (const s of [-1, 1]) b.box(s * (w / 2 + .03), h - .05, z + .02, .06, .05, .04, DRESS2);
  }

  /* ---------- 窗、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、滴水线；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = .7, fr = .036, n = 3;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p, n), -.03, .02, DRESS);
    if (o.off) fan(b, outline(w, h, 0, p, n), .024, INNER);
    else fan(b, outline(w, h, 0, p, n), .024, WIN, { e: o.e != null ? o.e : .5 });
    b.panel(0, h * .55, .027, w, .014, o.cy ? BRASS : MULL, o.cy ? GL : undefined);
    b.box(0, -fr - .03, 0, w + fr * 2 + .04, .03, .08, DRESS, { nb: true });
    if (o.hood) hood(b, w + fr * 2, h, p, .0, 3);
    b.pop();
  }
  function lantern(b, x, y, z, cy, off) {                   /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, off ? mix3(C.lamp, DARK, .6) : C.lamp, off ? { r2: .045, nt: true, nb: true } : { r2: .045, e: .6, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .042, y + .02, z + Math.sin(a) * .042], [x + Math.cos(a) * .05, y + .13, z + Math.sin(a) * .05], .009, fr, fo); }
    b.cyl(x, y + .13, z, .06, .016, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .146, z, .056, .07, 6, fr, Object.assign({ nb: true }, fo));
  }
  function wallLantern(b, x, y, z, cy, off) {               /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .04, .1, .02, fr, fo);
    b.beam([x, y + .1, z], [x, y + .1, z + .17], .018, fr, fo);
    b.beam([x, y + .02, z], [x, y + .1, z + .1], .012, fr, fo);
    b.beam([x, y + .1, z + .16], [x, y + .04, z + .16], .009, fr, fo);
    lantern(b, x, y - .2, z + .16, cy, off);
  }
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, 0, z, .045, .07, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .02, BRASS, GL);
    b.beam([x, h, z], [x + .1, h + .05, z], .015, BRASS, GL);
    b.beam([x + .1, h + .05, z], [x + .15, h + .02, z], .013, BRASS, GL);
    b.sphere(x, h + .01, z, .024, 4, BRASS, GL);
    if (!off) b.emit(x + .15, h - .1, z, "cat", 1, .85);
  }
  function airship(b, x, y, z, ry) {                         /* 2077：黄铜细杆上一只小飞艇风标（静止）：奶白气囊、黄铜环箍、吊舱、尾鳍 */
    rod(b, [x, y - .03, z], [x, y + .12, z], .016, BRASS, GL);
    b.at(x, y + .17, z, ry);
    b.at(0, 0, 0, 0, [1, .4, .4]); b.sphere(0, 0, 0, .13, 6, mix3(C.cream, C.stone, .3), GL); b.pop();
    for (const dx of [-.05, .05]) { b.at(dx, 0, 0, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .052, .006, 8, 3, BRASS, GL); b.pop(); }
    b.box(0, -.08, 0, .08, .022, .026, BRASS, GL);
    b.box(-.13, -.008, 0, .045, .065, .006, BRASS, GL);
    b.box(-.13, -.008, 0, .045, .006, .065, BRASS, GL);
    b.pop();
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, rAt, a0, da, y0, h, n) {                 /* 圆塔上的常春藤 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .026;
      b.at(0, 0, 0, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], rAt(py) + .012 + R() * .01, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function patch(b, x, z, rx, rz, y, col, n) {               /* 地上一块不规则的斑（焦痕、湿沙） */
    const pts = []; n = n || 7;
    for (let i = 0; i < n; i++) { const a = i / n * TAU, f = .68 + R() * .4; pts.push([x + Math.cos(a) * rx * f, z + Math.sin(a) * rz * f]); }
    for (let i = 1; i < n - 1; i++) tf(b, [pts[0][0], y, pts[0][1]], [pts[i][0], y, pts[i][1]], [pts[i + 1][0], y, pts[i + 1][1]], col, [0, 1, 0]);
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，零星几片长青苔；o.hole 待修塌洞 */
    o = o || {};
    const dx = B[0] - A[0], dy = B[1] - A[1], nb = o.nb || Math.max(2, Math.round(Math.hypot(dx, dy) / .15)), cw = o.cw || .26;
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .02, cols = [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + (i < nb - 1 ? .035 / Math.hypot(dx, dy) : 0), xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .06; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
      for (let k = 0; k < edges.length - 1; k++) {
        const zm = (edges[k] + edges[k + 1]) / 2;
        if (o.hole && o.hole(t0, zm)) continue;
        const base = i % 2 ? cols[0] : cols[1], r = R();
        const c = r < .18 ? mix3(base, cols[2], .55) : r > .93 ? mix3(base, SLM, .7) : r > .84 ? mix3(base, [.5, .52, .56], .16) : mix3(base, cols[2], r * .25);
        qf(b, [xa2, ya2, edges[k]], [xa2, ya2, edges[k + 1]], [xb, yb, edges[k + 1]], [xb, yb, edges[k]], c, [N[0], N[1], 0]);
      }
      qf(b, [xa, ya, z0], [xa, ya, z1], [xa2, ya2, z1], [xa2, ya2, z0], cols[2], dn);
    }
    qf(b, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], mix3(OAK, [0, 0, 0], .2), [-N[0], -N[1], 0]);
    b.beam([A[0] + N[0] * .005, A[1] - .03, z0], [A[0] + N[0] * .005, A[1] - .03, z1], .035, OAK);
  }

  /* ================= 龙 ================= */
  /* 配色：g 绿龙（1994 沙场）、b 铜褐龙（1994 栖塔）、s 雾青贝壳龙、r 浅玫瑰灰贝壳龙（2077） */
  const DP = {
    g: { body: [.33, .49, .32], dark: [.22, .34, .24], belly: [.72, .67, .46], wing: [.27, .37, .28], wing2: [.38, .47, .33], horn: [.84, .78, .64], spike: [.2, .28, .21], eye: [.86, .62, .2] },
    b: { body: [.48, .35, .25], dark: [.33, .24, .18], belly: [.78, .68, .5], wing: [.4, .28, .22], wing2: [.54, .4, .29], horn: [.88, .82, .7], spike: [.29, .21, .16], eye: [.92, .72, .26] },
    s: { body: [.5, .6, .57], dark: [.37, .46, .45], belly: [.86, .82, .72], wing: [.55, .61, .59], wing2: [.66, .7, .68], horn: [.9, .86, .78], spike: [.4, .5, .54], eye: [.24, .2, .2], shell: 1 },
    r: { body: [.66, .56, .53], dark: [.5, .42, .41], belly: [.88, .84, .76], wing: [.6, .52, .52], wing2: [.74, .65, .63], horn: [.9, .86, .78], spike: [.5, .42, .4], eye: [.24, .2, .2], shell: 1 }
  };
  function tube(b, pts, n, col) {                           /* 一串收分圆柱（脖子、尾巴）：pts [x,y,z,r]，每段两头封口、略微伸进下一段，转弯处不露缝 */
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1], d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]), u = [d[0] / L, d[1] / L, d[2] / L];
      const e0 = i ? p[3] * .35 : 0, e1 = i < pts.length - 2 ? q[3] * .35 : 0;
      const A = [p[0] - u[0] * e0, p[1] - u[1] * e0, p[2] - u[2] * e0], B = [q[0] + u[0] * e1, q[1] + u[1] * e1, q[2] + u[2] * e1];
      limb(b, A, B, p[3], q[3], n, col, { nt: i === pts.length - 2, nb: i === 0 });
    }
  }
  function claws(b, x, y, z, ry, col, n) {                   /* 三只爪：往前（局部 +z）的小锥 */
    for (let i = 0; i < (n || 3); i++) { const a = ry + (i - 1) * .4; b.at(x + Math.sin(a) * .03, y, z + Math.cos(a) * .03, a, 1, PI / 2 - .2); b.cone(0, 0, 0, .012, .04, 3, col, { nb: true }); b.pop(); }
  }
  function scallop(b, x, y, z, r, tilt, c) {                 /* 贝壳甲片：立在背脊上的扇贝，竖在 yz 面里（两面都画），边缘一凸一凹 */
    b.at(x, y, z, 0, 1, tilt);
    const n = 6, c2 = mix3(c, C.white, .18), c3 = mix3(c, STD, .18);
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const t = -1.2 + 2.4 * i / n, rr = r * (i % 2 ? .86 : 1), P = [0, Math.cos(t) * rr, Math.sin(t) * rr * .9];
      if (prev) tri2(b, [0, -r * .12, 0], prev, P, i % 2 ? c2 : c3);
      prev = P;
    }
    b.pop();
  }
  /* 龙头（原点在后脑，吻部朝 +z）：圆颅、略收的吻部、下颌、鼻孔、眉骨、闭着（或睁着）的眼、两只后掠的角、两片耳鳍 */
  function dHead(b, P, open, lo) {
    ell(b, 0, .005, .02, .078, .066, .088, lo ? 6 : 8, P.body, { grad: P.dark });
    ell(b, 0, -.01, .11, .056, .042, .09, lo ? 5 : 6, P.body);
    b.box(0, -.058, .1, .074, .028, .15, P.belly, { nb: true });
    for (const sx of [-1, 1]) {
      b.at(sx * .02, .012, .192, sx * .35); b.panel(0, 0, 0, .016, .011, [.1, .08, .08]); b.pop();          /* 鼻孔 */
      b.at(sx * .046, .046, .062, sx * .25, 1, -.15); b.box(0, 0, 0, .036, .018, .07, P.dark); b.pop();     /* 眉骨 */
      b.at(sx * .066, .022, .06, sx * (PI / 2 - .35));                                                       /* 眼 */
      if (open) { b.panel(0, -.009, .002, .028, .02, P.eye); b.panel(0, -.008, .004, .007, .018, [.08, .06, .05]); }
      else { b.panel(0, -.002, .002, .03, .006, [.1, .09, .08]); b.panel(0, -.009, .002, .026, .005, mix3(P.body, P.dark, .5)); }
      b.pop();
      b.at(sx * .042, .05, -.03, 0, 1, -1.22, sx * -.22); b.cyl(0, 0, 0, .021, .07, 4, P.horn, { r2: .014, nb: true, nt: true }); b.cone(0, .065, 0, .015, .08, 4, P.horn, { nb: true }); b.pop();   /* 角 */
      tri2(b, [sx * .07, .02, -.01], [sx * .13, .05, -.08], [sx * .075, -.02, -.05], mix3(P.wing, P.body, .4));                                                                         /* 耳鳍 */
    }
    if (!lo) for (let i = 0; i < 2; i++) { b.at(0, .06 - i * .02, -.05 - i * .04, 0, 1, -1); b.cone(0, 0, 0, .014, .045, 3, P.spike, { nb: true }); b.pop(); }
  }
  /* 一边翅膀：臂骨、腕骨、三根指骨，指间张膜（两面都画）；pts = [肩 S, 肘 E, 腕 W, 指尖 F1 F2 F3, 贴身点 B] */
  function dWing(b, P, sx, pts) {
    const v = p => [sx * p[0], p[1], p[2]], [S, E, W, F1, F2, F3, Bd] = pts.map(v);
    rod(b, S, E, .026, P.dark); rod(b, E, W, .02, P.dark);
    for (const F of [F1, F2, F3]) rod(b, W, F, .011, P.dark);
    b.at(W[0], W[1], W[2], 0, 1, -.5); b.cone(0, 0, 0, .012, .04, 3, P.horn, { nb: true }); b.pop();
    tri2(b, S, E, F3, P.wing); tri2(b, E, W, F3, mix3(P.wing, P.wing2, .3)); tri2(b, W, F2, F3, P.wing2); tri2(b, W, F1, F2, mix3(P.wing, P.wing2, .6)); tri2(b, S, F3, Bd, P.wing);
  }
  function spineRow(b, P, list, lo, ps) {                        /* 背脊：1994 小骨刺；2077 换贝壳甲片 */
    list.forEach(([x, y, z, s, tilt], i) => {
      if (P.shell && s > .7) scallop(b, x, y - .02, z, .095 * s * (ps || 1), tilt, SHELL[i % SHELL.length]);
      else if (!lo || i % 2 === 0) { b.at(x, y, z, 0, 1, tilt - .5); b.cone(0, -.01, 0, .022 * s, .065 * s, 3, P.spike, { nb: true }); b.pop(); }
    });
  }
  /* 蜷睡：身子趴着，前爪交叠，头枕在前爪上，尾巴从右边绕到身前，翅膀收拢；局部 +z 是头的方向，身长约 .68×k */
  function dragonCurl(b, o, x, z, ry, k, P) {
    b.at(x, .02, z, ry, k);
    ell(b, 0, .16, -.02, .21, .15, .34, 10, P.body, { grad: P.belly });
    for (const sx of [-1, 1]) {
      ell(b, sx * .14, .19, .19, .1, .1, .12, 6, P.body, { grad: P.belly });                       /* 肩 */
      ell(b, sx * .15, .16, -.17, .12, .13, .16, 7, P.body, { grad: P.belly });                     /* 胯 */
      limb(b, [sx * .22, .1, -.2], [sx * .245, .04, .02], .055, .04, 6, P.body, { nb: false, nt: false });   /* 后腿收在身侧 */
      ell(b, sx * .25, .025, .06, .045, .025, .07, 5, P.dark);
      claws(b, sx * .25, .02, .1, 0, P.horn);
      limb(b, [sx * .13, .16, .23], [sx * .15, .06, .31], .055, .045, 6, P.body, { nb: false });            /* 前腿往前伸，前爪交叠 */
      limb(b, [sx * .15, .06, .31], [sx * .06, .035, .47], .045, .036, 6, P.body, { nt: false });
      ell(b, sx * .05, .026, .5, .05, .026, .06, 5, P.dark, null, -sx * .4);
      claws(b, sx * .04, .02, .54, -sx * .4, P.horn);
    }
    tube(b, [[0, .25, .22, .105], [-.01, .27, .34, .09], [-.03, .23, .45, .078], [-.04, .17, .52, .068]], 7, P.body);   /* 脖子往前低下来 */
    b.at(-.045, .125, .56, .38, 1.38, .05); dHead(b, P, false, false); b.pop();
    if (!o.bad) { const a = .38, sx = Math.sin(a), cz = Math.cos(a); b.emit(-.045 + sx * .27, .14, .56 + cz * .27, "smoke", 3, .35); }
    const tail = [[0, .14, -.3, .1], [.06, .1, -.46, .085], [.22, .066, -.55, .072], [.4, .05, -.47, .06], [.5, .042, -.26, .05], [.52, .036, -.02, .043], [.46, .032, .22, .036], [.33, .028, .41, .03], [.17, .025, .54, .024], [.04, .022, .6, .018]];
    tube(b, tail, 6, P.body);
    tri2(b, [.04, .03, .6], [-.04, .034, .645], [-.08, .028, .59], P.dark); tri2(b, [.04, .03, .6], [-.08, .028, .59], [-.03, .03, .55], P.dark);   /* 尾尖的铲形鳍 */
    for (const sx of [-1, 1]) dWing(b, P, sx, [[.13, .28, .16], [.22, .37, -.01], [.22, .33, -.24], [.23, .18, -.5], [.27, .12, -.33], [.27, .11, -.12], [.19, .25, -.32]]);
    const sp = [[0, .31, .2, .7, .2], [0, .32, .09, .9, .1], [0, .315, -.03, 1, 0], [0, .305, -.15, 1, -.1], [0, .285, -.26, .9, -.2], [0, .24, -.36, .75, -.35]];
    for (let i = 2; i < tail.length - 2; i++) sp.push([tail[i][0], tail[i][1] + tail[i][3] * .9, tail[i][2], .55 - i * .03, -.2]);
    spineRow(b, P, sp, false);
    b.pop();
  }
  /* 栖立：四脚站在平台上，脖子 S 形抬起、低头看沙场，翅膀半张（动件：一组 bob，慢慢扇）；低面数 */
  function dragonPerch(b, o, x, y, z, ry, k, P) {
    b.at(x, y, z, ry, k);
    ell(b, 0, .36, 0, .18, .15, .3, 8, P.body, { grad: P.belly }, 0, -.18);
    for (const sx of [-1, 1]) {
      ell(b, sx * .12, .42, .19, .09, .1, .11, 5, P.body);
      ell(b, sx * .13, .35, -.17, .1, .13, .15, 6, P.body);
      limb(b, [sx * .13, .36, .22], [sx * .15, .18, .26], .05, .04, 5, P.body);
      limb(b, [sx * .15, .18, .26], [sx * .14, .02, .3], .04, .034, 5, P.body);
      ell(b, sx * .14, .022, .33, .04, .022, .055, 4, P.dark); claws(b, sx * .14, .018, .37, 0, P.horn);
      limb(b, [sx * .16, .32, -.18], [sx * .18, .15, -.27], .06, .04, 5, P.body);
      limb(b, [sx * .18, .15, -.27], [sx * .17, .02, -.18], .04, .034, 5, P.body);
      ell(b, sx * .17, .022, -.14, .045, .022, .06, 4, P.dark); claws(b, sx * .17, .018, -.1, 0, P.horn);
    }
    tube(b, [[0, .43, .23, .09], [0, .56, .32, .075], [0, .68, .35, .065], [0, .75, .34, .058]], 6, P.body);
    b.at(0, .79, .37, 0, 1.05, .25); dHead(b, P, true, true); b.pop();
    tube(b, [[0, .33, -.27, .085], [0, .25, -.44, .07], [.04, .13, -.56, .055], [.12, .05, -.64, .042], [.24, .03, -.66, .032], [.34, .025, -.6, .022]], 5, P.body);
    tri2(b, [.34, .03, -.6], [.42, .03, -.62], [.4, .03, -.54], P.dark);
    const sp = [[0, .5, .3, .6, .4], [0, .5, .14, .9, .25], [0, .52, .01, 1, .1], [0, .49, -.12, .9, -.1], [0, .44, -.24, .75, -.3]];
    spineRow(b, P, sp, true, 1.35);
    const wings = bb => { for (const sx of [-1, 1]) dWing(bb, P, sx, [[.12, .48, .13], [.32, .72, .05], [.52, .84, -.08], [.7, .58, -.3], [.58, .38, -.32], [.38, .32, -.24], [.14, .42, -.16]]); };
    bobOr(b, o, 0, 0, 0, .02, .9, wings);
    b.pop();
  }

  /* ================= 龙舍 ================= */
  const HX = 1.0, HZ0 = -1.6, HZ1 = -.3, HD = HZ1 - HZ0, HZC = (HZ0 + HZ1) / 2, P0 = .08, HW = 1.4, YR = 2.6, SLP = (YR - HW) / HX, OV = .1;
  const DW = .9, DS = .74, DPT = .68, DFR = .1, DY0 = .03, DZ = .17;           /* 大门洞：宽、起拱高、尖度、券宽、洞底、墙厚 */
  const DAPI = DY0 + DS + archY(DW, DPT, 0), DAPO = DY0 + DS + archY(DW + DFR * 2, DPT, 0);
  const sootF = (y, x) => {                                                    /* 门洞四周熏黑：越靠近门洞越黑，门洞上方有一道往上散的烟痕 */
    const ax = Math.abs(x), dx = Math.max(0, ax - DW / 2 - DFR), top = DAPO + .05;
    let f = y < top ? Math.max(0, 1 - dx / .32) * .8 : Math.max(0, 1 - (y - top) / .55) * Math.max(0, 1 - ax / .55) * .65;
    return clamp(f * (.75 + R() * .4), 0, .85);
  };
  function house(b, o) {
    reseed(11);
    const cy = o.cy, bad = o.bad;
    /* 勒脚：门两侧是料石墩，后面一大块 */
    b.box(0, -.15, HZC - .1, 2 * HX + .12, P0 + .15 + .06, HD - .2 + .1, ST2, { top: DRESS2, nb: true });
    for (const s of [-1, 1]) { const x0 = s * (DW / 2 + DFR * .9), x1 = s * (HX + .06); b.box((x0 + x1) / 2, -.15, HZ1 - .06, Math.abs(x1 - x0), P0 + .15 + .06, .24, ST2, { top: DRESS2, nb: true }); }
    /* 前山墙：门洞掏空，熏黑 */
    const hwG = y => { const h = y <= HW ? HX : Math.max(0, (YR + .02 - y) / SLP); return [-h, h]; };
    const hole = ya => { if (ya < DY0) return null; const dy = ya - DY0 - DS, hx = dy <= 0 ? DW / 2 : archX(DW, DPT, dy); return hx > .01 ? [-hx, hx] : null; };
    b.at(0, 0, HZ1);
    mason(b, hwG, P0, YR + .02, 0, { ql: true, qr: true, hole, col: (c, y, x) => { const f = sootF(y, x); return f > 0 ? mix3(c, SOOT, f) : c; } });
    { const pts = archPts(DW, DPT, 8);                      /* 拱腹后面的补石（台阶状的缝里看得见） */
      for (let i = 0; i < pts.length - 1; i++) b.quad([pts[i][0], DY0 + DS + pts[i][1], -.004], [pts[i + 1][0], DY0 + DS + pts[i + 1][1], -.004], [pts[i + 1][0], DAPO + .1, -.004], [pts[i][0], DAPO + .1, -.004], mix3(SOOT, ST2, .3)); }
    b.at(0, DY0, 0); archRing(b, DW, DS, DPT, DFR, -DZ, .035, .55); hood(b, DW + DFR * 2 + .02, DS, DPT, .035, 5); b.pop();
    fan(b, outline(DW, DS, DY0, DPT, 6), -DZ - .002, VOID);                     /* 门洞里是暗的 */
    rod(b, [0, DAPI - .02, -.1], [0, DAPI - .2, -.1], .012, IRON, M); lantern(b, 0, DAPI - .38, -.1, cy, bad);   /* 拱顶下吊一盏提灯 */
    b.quad([-DW / 2, DY0 + .006, -DZ], [DW / 2, DY0 + .006, -DZ], [DW / 2, DY0 + .006, .04], [-DW / 2, DY0 + .006, .04], mix3(STRAW, VOID, .45));
    ell(b, -.22, DY0, -DZ + .02, .26, .17, .1, 6, mix3(HAYD, VOID, .5));             /* 门里一堆干草（在暗处） */
    ell(b, .26, DY0, -DZ + .01, .16, .09, .07, 5, mix3(HAYD, VOID, .58));
    b.box(0, -.02, .1, DW + .1, .06, .2, mix3(DRESS2, SOOT, .25), { top: mix3(DRESS, SAND, .3) });   /* 磨平的石门槛 */
    /* 半扇铁箍木门：右扇挂在门轴上往外开，有点歪；待修时掉下来平躺在门前 */
    const leaf = bb => {
      const half = archPts(DW, DPT, 6).slice(6).map(([x, y]) => [x - DW / 2, DS + y]), pts = [[0, 0], [0, DS]].concat(half.reverse()).concat([[-DW / 2, 0]]);
      const P = pts.map(([x, y]) => [x, y]).reverse();
      prism(bb, P, -.025, .025, DOORW);
      for (let i = 1; i < 4; i++) { const x = -i * DW / 8; bb.panel(x, .02, .0255, .01, DS + archY(DW, DPT, x + DW / 2) - .06, DARK); }
      for (const y of [.12, .42, .72]) { bb.box(-DW / 4 + .01, y, .024, DW / 2 - .04, .035, .012, IRON, M); for (let i = 0; i < 3; i++) bb.panel(-.06 - i * .14, y + .01, .0365, .016, .016, C.metal, M); }
      for (const y of [.18, .78]) bb.box(.012, y, 0, .03, .08, .06, IRON, M);
    };
    if (bad) { b.at(DW / 2 + .02, DY0 + .22, .045, 1.75, 1, 0, .34); b.at(0, -.2, 0); leaf(b); b.pop(); b.pop(); }   /* 上门轴断了，只挂在下门轴上歪着 */
    else { b.at(DW / 2 + .02, DY0 + .02, .045, 1.55, 1, 0, -.035); leaf(b); b.pop(); }
    /* 圆窗（山墙上）：一圈料石、铁十字棂、烛光 */
    { const yo = 1.98, r = .17;
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, a2 = (i + 1) / 10 * TAU; qf(b, [Math.cos(a) * r, yo + Math.sin(a) * r, .03], [Math.cos(a) * (r + .07), yo + Math.sin(a) * (r + .07), .03], [Math.cos(a2) * (r + .07), yo + Math.sin(a2) * (r + .07), .03], [Math.cos(a2) * r, yo + Math.sin(a2) * r, .03], i % 2 ? DRESS : DRESS2, [0, 0, 1]); qf(b, [Math.cos(a) * r, yo + Math.sin(a) * r, .006], [Math.cos(a2) * r, yo + Math.sin(a2) * r, .006], [Math.cos(a2) * r, yo + Math.sin(a2) * r, .03], [Math.cos(a) * r, yo + Math.sin(a) * r, .03], mix3(DRESS2, STD, .35), [-Math.cos(a), -Math.sin(a), 0]); }
      b.at(0, yo, .008, 0, 1, PI / 2); b.disc(0, 0, 0, r, 10, bad ? INNER : WIN, bad ? {} : { e: .55 }); b.pop();      /* 玻璃贴在墙面前、缩在石圈里 */
      b.box(0, yo - r, .008, .022, r * 2, .016, IRON, M); b.box(0, yo - .011, .008, r * 2, .022, .016, IRON, M); }
    for (const s of [-1, 1]) wallLantern(b, s * .74, .86, 0, cy, bad);
    for (const s of [-1, 1]) b.box(s * (HX - .2), HW - .02, .025, .42, .05, .05, DRESS, { nb: true });      /* 山墙脚的腰线（门券两边） */
    ivy(b, -HX + .14, P0, 0, .26, 1.0, 26); ivy(b, HX - .1, P0, 0, .2, .6, 14);
    b.pop();
    /* 两侧墙：各一对尖拱烛光窗；后山墙一个小通风口 */
    for (const s of [-1, 1]) {
      b.at(s * HX, 0, HZC, s * PI / 2);
      mason(b, () => [-HD / 2, HD / 2], P0, HW, 0, { ql: true, qr: true });
      for (const dz of [-.12, .12]) lancet(b, dz * s, .56, 0, .12, .36, { hood: true, cy, off: bad });
      if (s < 0) ivy(b, .45, P0, 0, .3, .95, 22); else ivy(b, -.42, P0, 0, .3, .7, 16);
      for (let i = 0; i < 9; i++) { const z = -HD / 2 + .1 + i * (HD - .2) / 8; b.box(z, HW - .12, .03, .06, .07, .06, DRESS2, { nb: true }); }   /* 檐下托石 */
      b.box(0, HW - .05, .02, HD, .05, .05, DRESS, { nb: true });
      b.pop();
    }
    b.at(0, 0, HZ0, PI);
    mason(b, hwG, P0, YR + .02, 0, { ql: true, qr: true });
    b.box(0, 1.9, 0, .12, .3, .03, INNER); b.box(0, 1.86, 0, .2, .04, .06, DRESS);
    b.pop();
    /* 扶壁：两侧各两根；Lv2 起右前那根让给栖塔，Lv3 左前那根让给孵化房 */
    for (const s of [-1, 1]) for (const z of [-.6, -1.32]) {
      if (z > -1 && ((s > 0 && o.lv >= 2) || (s < 0 && o.lv >= 3))) continue;
      buttress(b, s * HX, z, s * PI / 2, 1.05);
    }
    /* 屋顶：两坡石板瓦（待修时右坡塌一块），女儿墙山墙的料石压顶、墙肩托石，屋脊瓦、铁花脊饰 */
    const zr0 = HZ0 + .02, zr1 = HZ1 - .02;
    for (const s of [-1, 1]) {
      const holeF = bad && s > 0 ? (t, zm) => t > .3 && t < .66 && zm > -1.0 && zm < -.58 : null;
      slope(b, [s * (HX + OV), HW - OV * SLP], [0, YR], zr0, zr1, { hole: holeF });
      if (holeF) { qf(b, [s * .4, 2.0, -1.0], [s * .4, 2.0, -.58], [s * .74, 1.6, -.58], [s * .74, 1.6, -1.0], VOID, [s, 1, 0]); for (const zz of [-.9, -.68]) b.beam([s * .3, 2.2, zz], [s * .85, 1.5, zz], .04, OAK); }
      if (cy) skylight(b, s);
    }
    for (const f of [-1, 1]) {
      const z = f > 0 ? HZ1 : HZ0;
      for (const s of [-1, 1]) {
        b.beam([s * (HX + .05), HW - .05 * SLP + .07, z], [0, YR + .08, z], .12, DRESS, { tz: .16 });
        b.box(s * (HX + .02), HW - .16, z, .18, .2, .2, DRESS2, { nb: true });
      }
    }
    b.at(0, YR + .03, HZC, 0, 1, 0, PI / 4); b.box(0, -.03, 0, .07, .07, HD - .1, SL2); b.pop();
    for (let i = 0; i < 8; i++) { const z = HZ0 + .35 + i * (HD - .7) / 7; b.cone(0, YR + .07, z, .018, .1, 3, cy ? BRASS : IRON, { nb: true, mat: cy ? "gloss" : "metal" }); b.sphere(0, YR + .1, z, .014, 4, cy ? BRASS : IRON, cy ? GL : M); }
    rod(b, [0, YR + .12, HZ0 + .32], [0, YR + .12, HZ1 - .32], .014, cy ? BRASS : IRON, cy ? GL : M);
    /* 前山尖的石雕龙头（2077 头上立黄铜小飞艇风标），后山尖小尖塔 */
    stoneHead(b, 0, YR + .1, HZ1 + .05);
    if (cy) airship(b, 0, YR + .38, HZ1 + .02, .5);
    b.box(0, YR + .08, HZ0, .14, .12, .14, DRESS2, { nb: true }); b.pyramid(0, YR + .2, HZ0, .12, .12, .26, DRESS2); b.sphere(0, YR + .47, HZ0, .02, 4, DRESS);
    /* 排烟楼：1994 石板瓦小楼、百叶；2077 黄铜风帽 */
    const vz = -1.22;
    if (cy) {
      b.cyl(0, YR - .1, vz, .09, .22, 8, BRASS, Object.assign({ r2: .08 }, GL));
      b.cyl(0, YR + .12, vz, .12, .03, 8, BRASS, Object.assign({ nb: true }, GL));
      b.cone(0, YR + .15, vz, .12, .12, 8, BRASS, Object.assign({ nb: true }, GL));
      b.sphere(0, YR + .29, vz, .022, 4, BRASS, GL);
    } else {
      b.box(0, YR - .12, vz, .24, .26, .24, mix3(ST2, STD, .3), { nb: true });
      for (const s of [-1, 1]) { b.at(s * .122, 0, vz, s * PI / 2); for (let i = 0; i < 2; i++) { b.at(0, YR + .02 + i * .05, 0, 0, 1, -.6); b.panel(0, -.016, 0, .16, .032, mix3(OAK, VOID, .3)); b.pop(); } b.pop(); }
      b.box(0, YR + .14, vz, .3, .03, .3, DRESS2, { nb: true });
      b.pyramid(0, YR + .17, vz, .28, .28, .2, SL);
    }
    if (!bad) b.emit(0, YR + .32, vz, "smoke", 4, .55);
  }
  function stoneHead(b, x, y, z) {                           /* 山尖上蹲着的石雕龙头：方座、伸出去的长吻、两只后掠的角 */
    const c = mix3(ST2, ST, .4), c2 = mix3(DRESS2, ST2, .5), cd = mix3(ST2, STD, .5);
    b.at(x, y, z, 0, 1.15);
    b.box(0, -.06, -.04, .16, .1, .18, c2, { nb: true, top: DRESS2 });
    ell(b, 0, .1, .0, .066, .07, .08, 6, c, { grad: cd });
    ell(b, 0, .085, .14, .042, .036, .12, 6, c, { grad: cd });                     /* 长吻 */
    b.at(0, .045, .06, 0, 1, .28); b.box(0, -.012, .07, .056, .022, .17, cd); b.pop();   /* 张开一点的下颌 */
    for (const sx of [-1, 1]) {
      b.at(sx * .04, .14, -.03, 0, 1, -1.3, sx * -.25); b.cone(0, 0, 0, .022, .19, 4, c2, { nb: true }); b.pop();   /* 后掠的角 */
      b.at(sx * .046, .125, .07, sx * .3, 1, -.15); b.box(0, 0, 0, .026, .018, .07, cd); b.pop();                  /* 眉骨 */
      b.at(sx * .058, .1, .06, sx * (PI / 2 - .3)); b.panel(0, 0, .002, .026, .006, VOID); b.pop();               /* 侧面的眼缝 */
      b.at(sx * .016, .095, .262, sx * .4); b.panel(0, 0, 0, .01, .008, VOID); b.pop();                           /* 鼻孔 */
    }
    for (let i = 0; i < 2; i++) { b.at(0, .165 - i * .03, -.06 - i * .05, 0, 1, -.9); b.cone(0, 0, 0, .016, .06, 3, c2, { nb: true }); b.pop(); }
    b.pop();
  }
  function skylight(b, s) {                                  /* 2077：屋顶一坡上一溜黄铜框玻璃天窗 */
    const t0 = .42, t1 = .78, A = [s * (HX + OV), HW - OV * SLP], B = [0, YR], P = t => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), N = [-dy / L * s * -1, dx / L * s * -1], lift = .045;
    const n = N[1] < 0 ? [-N[0], -N[1]] : N, Pa = P(t0), Pb = P(t1), za = -1.35, zb = -.55;
    const a = [Pa[0] + n[0] * lift, Pa[1] + n[1] * lift], c = [Pb[0] + n[0] * lift, Pb[1] + n[1] * lift];
    qf(b, [a[0], a[1], za], [a[0], a[1], zb], [c[0], c[1], zb], [c[0], c[1], za], mix3(GLASS, SL, .25), [n[0], n[1], 0], GLS);
    for (const zz of [za, -1.08, -.82, zb]) rod(b, [a[0], a[1], zz], [c[0], c[1], zz], .022, BRASS, GL);
    for (const p of [a, c]) rod(b, [p[0], p[1], za], [p[0], p[1], zb], .022, BRASS, GL);
  }

  /* ================= 沙场 ================= */
  const AX = 0, AZ = .5, AR = .95;
  const POSTS = [-30, -2, 50, 72, 108, 130, 182, 210].map(d => d * PI / 180);
  const SPANS = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7]];
  const PP = a => [AX + Math.cos(a) * AR, AZ + Math.sin(a) * AR];
  function arena(b, o) {
    reseed(31);
    const cy = o.cy, bad = o.bad;
    b.cyl(AX, -.05, AZ, AR, .08, 28, SAND, { nb: true });
    for (let i = 0; i < 28; i++) {                         /* 一圈料石沿（贴着龙舍那一段不画） */
      const a = i / 28 * TAU, a2 = (i + 1) / 28 * TAU, am = (a + a2) / 2;
      if (Math.sin(am) < -.78) continue;
      const r0 = AR - .02, r1 = AR + .07, y = .055, c = mix3(DRESS2, ST2, R() * .5);
      const P = (aa, r, yy) => [AX + Math.cos(aa) * r, yy, AZ + Math.sin(aa) * r];
      qf(b, P(a, r0, y), P(a2, r0, y), P(a2, r1, y), P(a, r1, y), c, [0, 1, 0]);
      qf(b, P(a, r1, -.02), P(a2, r1, -.02), P(a2, r1, y), P(a, r1, y), mix3(c, STD, .3), [Math.cos(am), 0, Math.sin(am)]);
      qf(b, P(a, r0, .03), P(a2, r0, .03), P(a2, r0, y), P(a, r0, y), mix3(c, STD, .2), [-Math.cos(am), 0, -Math.sin(am)]);
    }
    /* 沙上的焦痕、湿沙、爪痕、啃过的骨头 */
    patch(b, -.42, .32, .2, .14, .034, SCORCH, 8); patch(b, -.36, .3, .1, .07, .036, mix3(SCORCH, [0, 0, 0], .3), 6);
    patch(b, .55, 1.0, .16, .1, .034, SCORCH2, 7); patch(b, -.5, 1.05, .22, .12, .034, SAND2, 7); patch(b, .5, .02, .2, .12, .034, SAND2, 7);
    patch(b, .1, .02, .25, .14, .034, SANDL, 7);
    for (const [x, z, a] of [[-.62, .62, .5], [.62, .7, -.4], [.3, 1.12, .2]]) for (let i = 0; i < 3; i++) { b.at(x + i * .035 * Math.cos(a), .035, z - i * .035 * Math.sin(a), a); b.quad([-.004, 0, -.08], [.004, 0, -.08], [.004, 0, .08], [-.004, 0, .08], SCORCH); b.pop(); }
    bone(b, -.48, .98, .6, 1); bone(b, -.3, 1.12, -.3, .8); bone(b, .62, .3, 1.2, .9);
    /* 木桩（2077 料石墩加黄铜球帽）、铁链（2077 黄铜栏杆）；待修时一根桩歪、一段链子断了耷拉到地上 */
    POSTS.forEach((a, i) => {
      const [x, z] = PP(a), tilt = bad && i === 7;
      b.at(x, 0, z, -a, 1, tilt ? .25 : 0, tilt ? -.2 : 0);
      if (cy) {
        b.box(0, 0, 0, .12, .33, .12, mix3(ST, ST2, .3 + R() * .5), { nb: true, top: DRESS2 });
        b.box(0, .33, 0, .15, .035, .15, DRESS2, { nb: true });
        b.sphere(0, .405, 0, .04, 5, BRASS, GL);
      } else {
        const c = mix3(OLDWD, OLDW, R() * .7);
        b.cyl(0, 0, 0, .058, .4, 6, c, { r2: .052, top: mix3(c, C.woodL, .3) });
        b.cone(0, .4, 0, .052, .05, 6, mix3(c, C.woodL, .2), { nb: true });
        for (const y of [.08, .31]) b.cyl(0, y, 0, .063, .026, 6, IRON, { nt: true, nb: true, mat: "metal" });
        b.at(0, .28, .062, 0, 1, PI / 2); b.torus(0, 0, 0, .026, .006, 6, 3, IRON, M); b.pop();
      }
      b.pop();
    });
    SPANS.forEach(([i, j], k) => {
      const [x0, z0] = PP(POSTS[i]), [x1, z1] = PP(POSTS[j]), broken = bad && k === 4;
      const dx = x1 - x0, dz = z1 - z0, L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, e = cy ? .07 : .07;
      const A = [x0 + ux * e, z0 + uz * e], B = [x1 - ux * e, z1 - uz * e];
      if (cy) {                                            /* 黄铜栏杆：上下两道横杆、几根立杆（都在 .4 以下） */
        const n = Math.max(2, Math.round(L / .22));
        for (const yy of [.29, .12]) {
          if (broken && yy > .3) { rod(b, [A[0], yy, A[1]], [A[0] + (B[0] - A[0]) * .55, .03, A[1] + (B[1] - A[1]) * .55], .022, BRASS, GL); continue; }
          rod(b, [A[0], yy, A[1]], [B[0], yy, B[1]], .022, BRASS, GL);
        }
        for (let m = 1; m < n; m++) { const t = m / n, px = A[0] + (B[0] - A[0]) * t, pz = A[1] + (B[1] - A[1]) * t; if (broken && t > .4) continue; rod(b, [px, .04, pz], [px, .29, pz], .014, BRASS, GL); }
      } else {                                             /* 铁链：一节节相互垂直的扁环，中间往下垂 */
        const n = Math.max(4, Math.round(L / .075)), sag = .07;
        for (let m = 0; m < n; m++) {
          const t0 = m / n, t1 = (m + 1) / n;
          let y0 = .28 - sag * 4 * t0 * (1 - t0), y1 = .28 - sag * 4 * t1 * (1 - t1);
          let p0 = [A[0] + (B[0] - A[0]) * t0, y0, A[1] + (B[1] - A[1]) * t0], p1 = [A[0] + (B[0] - A[0]) * t1, y1, A[1] + (B[1] - A[1]) * t1];
          if (broken) { if (t0 > .5) continue; const d = t0 / .5, d1 = t1 / .5; p0 = [A[0] + (B[0] - A[0]) * t0 * .3, .28 - d * .25, A[1] + (B[1] - A[1]) * t0 * .3]; p1 = [A[0] + (B[0] - A[0]) * t1 * .3, .28 - d1 * .25, A[1] + (B[1] - A[1]) * t1 * .3]; }
          b.at((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2, Math.atan2(-(p1[2] - p0[2]), p1[0] - p0[0]), 1, m % 2 ? PI / 2 : 0, Math.atan2(p1[1] - p0[1], Math.hypot(p1[0] - p0[0], p1[2] - p0[2])));
          const lw = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]) * .62, lh = .022;
          b.quad([-lw, -lh, 0], [lw, -lh, 0], [lw, lh, 0], [-lw, lh, 0], IRON, M); b.quad([-lw, lh, 0], [lw, lh, 0], [lw, -lh, 0], [-lw, -lh, 0], IRON, M);
          b.pop();
        }
      }
    });
  }
  function bone(b, x, z, ry, s) {                            /* 啃过的大骨头：骨干两头各两个骨节 */
    b.at(x, .045 * s, z, ry, s);
    limb(b, [-.11, 0, 0], [.11, 0, 0], .022, .02, 5, BONE);
    for (const sx of [-1, 1]) for (const dz of [-.02, .02]) b.sphere(sx * .12, 0, dz, .026, 4, sx > 0 ? BONE : BONED);
    b.pop();
  }

  /* 挂肉架：木 A 字架、横梁、铁钩挂三块低饱和的暗红肉块；脚下一只木桶 */
  function meatRack(b, X, Z, ry) {
    reseed(41);
    b.at(X, 0, Z, ry);
    const W = .5, H = .62;
    for (const s of [-1, 1]) { rod(b, [s * W / 2, 0, -.14], [s * W / 2, H, 0], .04, OAK2); rod(b, [s * W / 2, 0, .14], [s * W / 2, H, 0], .04, OAK2); rod(b, [s * W / 2, .2, -.1], [s * W / 2, .2, .1], .025, OAK); }
    rod(b, [-W / 2 - .05, H, 0], [W / 2 + .05, H, 0], .045, OAK);
    [-.15, .01, .16].forEach((x, i) => {                    /* 铁钩吊着的大腿肉：上细下粗、顶上露一截骨头 */
      rod(b, [x, H - .02, 0], [x, H - .08, 0], .01, IRON, M);
      b.at(x, H - .08, 0, (R() - .5) * .8, 1, (R() - .5) * .12, (R() - .5) * .12);
      const s = i === 1 ? .82 : 1;
      b.cyl(0, -.05, 0, .011, .05, 5, BONE, { nb: true });
      ell(b, 0, -.16 * s, 0, .055 * s, .11 * s, .048 * s, 6, i === 1 ? MEAT2 : MEAT, { grad: MEAT2 });
      ell(b, .012, -.2 * s, .02, .04 * s, .06 * s, .03 * s, 5, mix3(MEAT, FAT, .35));
      b.pop();
    });
    b.cyl(.05, 0, .26, .07, .14, 7, OAK2, { r2: .078, top: mix3(OAK, MEAT, .5) });
    b.cyl(.05, .09, .26, .08, .02, 7, IRON, { nt: true, nb: true, mat: "metal" });
    b.pop();
  }
  /* 饮水槽：料石大槽、一汪水、长苔的槽沿 */
  function trough(b, X, Z, ry) {
    reseed(51);
    const L = .66, Wd = .26, H = .2, t = .04, c1 = mix3(DRESS2, ST2, .35), top = mix3(DRESS, DRESS2, .5);
    b.at(X, 0, Z, ry);
    b.box(0, -.04, 0, L, .08, Wd, c1, { nb: true });
    for (const s of [-1, 1]) { b.box(0, 0, s * (Wd / 2 - t / 2), L, H, t, c1, { nb: true, top }); b.box(s * (L / 2 - t / 2), 0, 0, t, H, Wd - 2 * t, c1, { nb: true, top }); }
    b.quad([-L / 2 + t, H - .035, Wd / 2 - t], [L / 2 - t, H - .035, Wd / 2 - t], [L / 2 - t, H - .035, -Wd / 2 + t], [-L / 2 + t, H - .035, -Wd / 2 + t], WATER, { mat: "water", k: 3 });
    for (let i = 0; i < 6; i++) { const x = -L / 2 + .05 + R() * (L - .1), s = R() < .5 ? 1 : -1; b.box(x, H, s * (Wd / 2 - t / 2), .05 + R() * .05, .006, t + .004, mix3(C.ivy, C.leaf, R() * .5)); }
    for (const s of [-1, 1]) b.box(s * (L / 2 - .1), -.04, 0, .07, .05, Wd + .05, STD, { nb: true });
    b.pop();
  }
  /* 2077 黄铜喂食吊臂：料石座、黄铜立柱、斜拉的吊臂、滑轮，钢索吊着肉钩和一块肉 */
  function crane(b, X, Z, o) {
    const ang = Math.atan2(.8 - Z, .3 - X), L = .8, top = 1.22;
    b.box(X, 0, Z, .2, .1, .2, DRESS2, { nb: true, top: DRESS });
    b.cyl(X, .1, Z, .045, top - .1, 6, BRASS, Object.assign({ r2: .035 }, GL));
    b.cyl(X, top - .04, Z, .06, .05, 6, BRASS, GL);
    const ex = X + Math.cos(ang) * L, ez = Z + Math.sin(ang) * L, ey = top + .1;
    rod(b, [X, top, Z], [ex, ey, ez], .035, BRASS, GL);
    rod(b, [X, top - .35, Z], [X + Math.cos(ang) * L * .5, top + .04, Z + Math.sin(ang) * L * .5], .022, BRASS, GL);
    rod(b, [X - Math.cos(ang) * .18, top - .02, Z - Math.sin(ang) * .18], [X, top + .05, Z], .03, BRASS, GL);
    b.box(X - Math.cos(ang) * .2, top - .1, Z - Math.sin(ang) * .2, .1, .1, .1, IRON, M);           /* 配重 */
    b.at(ex, ey, ez, -ang, 1, PI / 2); b.cyl(0, -.02, 0, .04, .04, 8, BRASS, GL); b.pop();
    const hy = o.bad ? .2 : .66;
    rod(b, [ex, ey - .03, ez], [ex, hy + .1, ez], .008, IRON, M);
    b.torus(ex, hy + .08, ez, .025, .006, 6, 3, IRON, M);
    b.at(ex, hy, ez, .4); b.cyl(0, -.05, 0, .012, .05, 5, BONE, { nb: true }); ell(b, 0, -.17, 0, .06, .12, .052, 6, MEAT, { grad: MEAT2 }); ell(b, .014, -.21, .022, .044, .065, .032, 5, mix3(MEAT, FAT, .35)); b.pop();
  }

  /* ================= 栖塔（Lv2） ================= */
  const TX = 1.34, TZ = -.4, PT = 2.45;
  function perchTower(b, o) {
    reseed(61);
    const cy = o.cy, bad = o.bad, SEG = 11, r0 = .36, r1 = .31, y0 = .05, y1 = PT - .3, rAt = y => r0 + (r1 - r0) * clamp((y - y0) / (y1 - y0), 0, 1);
    b.at(TX, 0, TZ);
    b.cyl(0, -.14, 0, .42, .22, SEG, ST2, { top: DRESS2, a0: PI / SEG, nb: true });
    const P = (a, r, y) => [Math.sin(a) * r, y, Math.cos(a) * r];
    { const n = Math.round((y1 - y0) / .17), hh = (y1 - y0) / n;                     /* 塔身：一圈圈错缝石砌 */
      for (let j = 0; j < n; j++) {
        const ya = y0 + j * hh, yb = ya + hh, ra = rAt(ya), rb = rAt(yb), off = (j % 2) * .5;
        for (let i = 0; i < SEG; i++) { const a = (i + off) / SEG * TAU, a2 = (i + 1 + off) / SEG * TAU; b.quad(P(a, ra, ya), P(a2, ra, ya), P(a2, rb, yb), P(a, rb, yb), sc(ya)); }
      }
    }
    for (const y of [.95, 1.7]) b.cyl(0, y, 0, rAt(y) + .025, .04, SEG, DRESS2, { a0: PI / SEG, top: DRESS });   /* 腰线 */
    for (let i = 0; i < 12; i++) { b.at(0, 0, 0, (i + .5) / 12 * TAU); wedge(b, .07, y1 - .16, rAt(y1) - .02, rAt(y1) + .2, .16, .05, DRESS2, DRESS); b.pop(); }   /* 托石 */
    b.cyl(0, y1, 0, .55, .12, 14, mix3(DRESS2, ST, .3), { top: mix3(ST2, SOOT, .35), bot: DRESS2 });
    b.cyl(0, y1 + .12, 0, .5, .004, 14, mix3(ST2, DRESS2, .3), { nb: true });
    for (let i = 0; i < 6; i++) { const a = R() * TAU, r = R() * .35; b.box(Math.sin(a) * r, PT - .005, Math.cos(a) * r, .1 + R() * .08, .006, .06, mix3(SOOT, ST2, R() * .5)); }
    /* 平台铁栏杆（2077 黄铜）：前面留口接梯子；待修时断一截 */
    const rc = cy ? BRASS : IRON, ro = cy ? GL : M, NP = 12, gap = i => i === 0 || i === 11;
    for (let i = 0; i < NP; i++) {
      const a = i / NP * TAU + PI / NP, a2 = (i + 1) / NP * TAU + PI / NP;
      if (gap(i)) continue;
      const p = P(a, .51, PT), q = P(a2, .51, PT);
      rod(b, p, [p[0], PT + .26, p[2]], .022, rc, ro);
      if (!(bad && i === 4)) rod(b, [p[0], PT + .26, p[2]], [q[0], PT + .26, q[2]], .02, rc, ro);
      if (i === 10) rod(b, q, [q[0], PT + .26, q[2]], .022, rc, ro);
    }
    /* 塔脚尖拱小门、提灯、箭缝 */
    b.at(0, 0, 0, -.75);
    prism(b, outline(.26, .24, 0, .72, 4), r0 - .07, r0 + .03, DRESS);
    b.at(0, y0, r0 + .032); fan(b, outline(.18, .2, 0, .72, 4), 0, DOORW); for (const y of [.06, .18]) b.box(0, y, .004, .17, .022, .01, IRON, M); b.pop();
    b.box(0, -.12, r0 + .12, .32, .14, .16, DRESS2, { nb: true });
    b.beam([.17, .52, r0 - .03], [.17, .52, r0 + .14], .02, cy ? BRASS : IRON, M); lantern(b, .17, .3, r0 + .13, cy, bad);
    b.pop();
    for (const [a, y, lit] of [[-1.3, .7], [.4, 1.25, 1], [-.6, 1.95, 1], [1.4, 1.5]]) { b.at(0, 0, 0, a); b.box(0, y, rAt(y) - .015, .08, .24, .035, DRESS2, { nb: true }); b.panel(0, y + .03, rAt(y) + .006, .024, .17, lit && !bad ? WIN : INNER, lit && !bad ? { e: .5 } : undefined); b.pop(); }   /* 箭缝，两道透出烛光 */
    rivy(b, rAt, -1.1, 1.3, y0, 1.3, 26);
    /* 长木梯靠上平台；待修时缺几级、歪到一边 */
    b.at(0, 0, 0, bad ? .3 : 0);
    const zf = .58 + .36, zt = .56;
    for (const s of [-1, 1]) rod(b, [s * .1, 0, zf], [s * .1, PT + .14, zt], .028, mix3(OLDW, OLDWD, .45));
    for (let i = 1; i < 15; i++) { if (bad && (i === 5 || i === 6 || i === 10)) continue; const t = i / 15, z = zf + (zt - zf) * t; rod(b, [-.1, t * (PT + .14), z], [.1, t * (PT + .14), z], .018, OLDWD); }
    b.pop();
    b.pop();
  }

  /* ================= 孵化房（Lv3） ================= */
  const KX = -1.43, KZ = -.3;
  function hatchery(b, o) {
    reseed(71);
    const cy = o.cy, bad = o.bad, N = 8, Rr = .4, yb = .3, yw = .66, Hd = .4, a0 = PI / N, fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    const P = (i, r, y) => [Math.sin(a0 + i / N * TAU) * r, y, Math.cos(a0 + i / N * TAU) * r];
    b.at(KX, 0, KZ);
    b.cyl(0, -.12, 0, Rr + .08, yb + .12, N, ST2, { top: DRESS, a0: a0 + PI / 2, nb: true });   /* 八角料石座 */
    for (let i = 0; i < N; i++) { const A = P(i, Rr + .085, .02), B = P(i + 1, Rr + .085, .02); b.at((A[0] + B[0]) / 2, 0, (A[2] + B[2]) / 2, a0 + (i + .5) / N * TAU); b.box(0, .02, 0, .05, yb - .06, .02, DRESS2, { nb: true }); b.pop(); }
    b.cyl(0, yb - .04, 0, Rr + .11, .05, N, DRESS, { a0: a0 + PI / 2, top: DRESS });
    b.box(0, -.1, Rr + .2, .36, .16, .2, DRESS2, { nb: true, top: DRESS });
    /* 玻璃墙、骨架；待修时掉两块玻璃 */
    const G = mix3(GLASS, C.white, .15);
    for (let i = 0; i < N; i++) {
      const A = P(i, Rr, yb), B = P(i + 1, Rr, yb), C2 = P(i + 1, Rr, yw), D2 = P(i, Rr, yw);
      if (!(bad && (i === 2 || i === 5))) b.quad(A, B, C2, D2, G, GLS);
      rod(b, A, D2, .026, fr, fo);
      if (i === 3) { const m = t => [A[0] + (B[0] - A[0]) * t, 0, A[2] + (B[2] - A[2]) * t]; for (const t of [.22, .78]) { const q = m(t); rod(b, [q[0], yb, q[2]], [q[0], yw - .04, q[2]], .02, fr, fo); } const q = m(.5); b.sphere(q[0] * 1.02, .47, q[2] * 1.02, .016, 4, fr, fo); }
    }
    for (const [y, h] of [[yb - .01, .03], [yw - .015, .03], [(yb + yw) / 2, .014]]) b.cyl(0, y, 0, Rr + .008, h, N, fr, Object.assign({ a0: a0 + PI / 2, nt: true, nb: true }, fo));
    /* 尖玻璃穹顶：三圈加顶尖，八根肋 */
    const prof = [[1, 0], [.86, .38], [.56, .72], [.22, .93], [0, 1]];
    for (let j = 0; j < prof.length - 1; j++) {
      const [ra, ha] = prof[j], [rb, hbb] = prof[j + 1];
      for (let i = 0; i < N; i++) {
        if (bad && j === 1 && i === 1) continue;
        if (rb > 0) b.quad(P(i, Rr * ra, yw + Hd * ha), P(i + 1, Rr * ra, yw + Hd * ha), P(i + 1, Rr * rb, yw + Hd * hbb), P(i, Rr * rb, yw + Hd * hbb), G, GLS);
        else b.tri(P(i, Rr * ra, yw + Hd * ha), P(i + 1, Rr * ra, yw + Hd * ha), [0, yw + Hd, 0], G, GLS);
        if (j % 2 === 0) rod(b, P(i, Rr * ra, yw + Hd * ha), prof[j + 2] ? P(i, Rr * prof[j + 2][0], yw + Hd * prof[j + 2][1]) : [0, yw + Hd, 0], .018, fr, fo);
      }
    }
    b.cyl(0, yw + Hd - .02, 0, .04, .04, 6, fr, fo); b.sphere(0, yw + Hd + .07, 0, .03, 5, cy ? BRASS : BRONZE, fo); b.cone(0, yw + Hd + .09, 0, .012, .12, 4, fr, fo);
    /* 里面：暖沙窝、四枚龙蛋（微亮）、吊着的小暖灯 */
    b.cyl(0, yb - .01, 0, Rr - .04, .03, N, SAND, { a0: a0 + PI / 2, nb: true });
    b.torus(0, yb + .03, 0, .2, .04, 9, 3, mix3(HAY, STRAW, .4));
    [[-.08, -.05, 0], [.07, -.07, 1], [.0, .08, 2], [.12, .06, 3]].forEach(([x, z, i]) => {
      const c = EGG[i]; ell(b, x, yb + .095, z, .062, .085, .062, 6, bad ? mix3(c, STD, .5) : c, bad ? null : { e: .3 }, 0, (R() - .5) * .4, (R() - .5) * .4);
    });
    rod(b, [0, yw + Hd - .03, 0], [0, yw + .02, 0], .01, fr, fo);
    b.cone(0, yw - .04, 0, .06, .06, 6, fr, Object.assign({ nb: true }, fo));
    b.sphere(0, yw - .045, 0, .024, 4, bad ? mix3(C.lamp, DARK, .6) : C.lamp, bad ? null : { e: .5 });
    /* 前面一扇玻璃小门（骨架门框、门把） */
    b.at(0, 0, 0, 0);
    const dz = Rr * Math.cos(PI / N) + .006;
    rod(b, [-.1, yb, dz], [-.1, yw - .03, dz], .022, fr, fo); rod(b, [.1, yb, dz], [.1, yw - .03, dz], .022, fr, fo); rod(b, [-.1, yw - .03, dz], [.1, yw - .03, dz], .022, fr, fo);
    b.sphere(.07, .46, dz + .01, .014, 4, cy ? BRASS : BRONZE, fo);
    b.pop();
    b.pop();
  }

  /* ================= 拼装 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { lv, cy, bad };
    house(b, oo);
    arena(b, oo);
    reseed(5); dragonCurl(b, oo, .14, .5, -1.25, 1.22, cy ? DP.s : DP.g);
    meatRack(b, -1.46, .64, PI / 2);
    trough(b, 1.56, .8, PI / 2);
    if (lv >= 2) { perchTower(b, oo); reseed(6); dragonPerch(b, oo, TX - .03, PT, TZ + .05, -1.0, .8, cy ? DP.r : DP.b); }
    if (lv >= 3) hatchery(b, oo);
    if (cy) { crane(b, 1.15, .1, oo); catLamp(b, -.66, -.18, .78, bad); }
  }
  /* label 高度 = 最高点 + .2（audit 实测） */
  build.h = o => (o.lv >= 2 ? 3.4 : o.cyber ? 3.41 : 3.29);
  Isle3D.FAC["龙场"] = build;
})();
