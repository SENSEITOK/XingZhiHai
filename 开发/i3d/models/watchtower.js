/* 哨塔（1994「烽火哨塔」/ 2077「结界哨塔」）：霍格沃茨式的方形石砌哨塔。主塔在左后 (−.35, −.45)，门朝 +z（岛心）。
   1994 Lv1：外撇的勒脚石座；.95 见方的方塔，错缝风化灰石、浅一档的转角隅石、一道腰线；每面两层十字箭缝；
             正面尖拱铁钉木门（料石门券、三级石阶），门边铁臂提灯，铁钩上挂一只铜号角，门上一扇烛光尖拱窗；
             塔顶一圈两级托石挑出悬空垛口廊（托石之间是投石孔），四面城堞；平台正中三足铁火盆（火苗 C.glow e .55，火星、一缕烟）；
             后角一面小旗；塔脚西侧一垛柴（石板瓦小披檐）；背面、西面爬常春藤。
        Lv2：东面接一段带走道、双面城堞的城墙，墙上开一个洞穿的尖拱小门；墙那头一座矮圆烽火塔（r .38，平顶城堞、第二只火盆、一面小旗，不戴尖顶）；
             主塔平台后半架一台木弩车，朝岛外（−z）。
        Lv3：主塔戴一顶陡的四坡石板瓦顶（短屋脊、檐口微翘、四面各一扇瞭望老虎窗、两端铁顶饰），檐口压在垛口上，垛口廊成了有顶的瞭望廊；
             门前一道弧立六块略歪的符文立石，地上一圈平石把它们连起来；立石上一列符文（往石色混过的淡紫，e .4）——防空仪式阵。
   2077：同一座石塔。火盆换成三脚架上的黄铜测距镜，旁边一盏琥珀小灯；门上那扇窗换成黄铜框玻璃凸窗；门边黄铜铭牌，塔角一根雨水管；
         门口一根黄铜细杆托一盏猫球灯；提灯换黄铜；塔角一只小飞艇风向标。
         Lv2 弩车换成叉架上的黄铜日光信号镜（慢转），圆塔顶一盏黄铜信号灯，塔周三棵感知结界树（白绿各半的叶团，e .15）。
         Lv3 信号镜挪到圆塔顶，立石戴黄铜帽，阵外一圈低饱和的淡紫「反预言花」花坛（e 0）。不画罩子、不加霓虹、不加全息。
   待修：火盆熄灭，不冒烟不冒火星；小旗歪倒；几块垛口石掉在塔脚；Lv3 一块立石倒伏；信号镜不转。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45), FLOOR = mix3(C.stone, ST2, .55);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);          /* 烛光窗 */
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BRONZE = mix3(C.gold, C.wood, .38);
  const AGED = mix3(BRASS, [.32, .27, .21], .42);           /* 风吹日晒的旧黄铜：立石帽、雨水管，不抢眼 */
  const COPPER = mix3(mix3(BRASS, [.36, .3, .26], .55), [.3, .4, .36], .25);   /* 发暗、微微泛绿的旧铜管 */
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35);
  const MULL = mix3(IRON, OAK, .3), COAL = [.17, .13, .11], ROPE = [.78, .72, .6];
  const RUNE = mix3(C.crystal2, C.stone, .55);             /* 符文：往石色混过的淡紫 */
  const GLASS = mix3(C.glass, C.white, .2);
  const LEAFS = mix3(C.white, C.leaf, .5);                 /* 感知结界树的叶团：白、绿各半 */
  const FLW = [mix3([.72, .62, .84], C.stone, .35), mix3([.8, .72, .88], C.stone, .3), mix3([.62, .56, .74], C.stone, .3)];   /* 反预言花：低饱和淡紫 */

  /* 主塔、垛口廊、圆塔、城墙、符文阵的尺寸 */
  const TX = -.35, TZ = -.45, HS = .475, OUT = .12, PT = .09, W = HS + OUT, WI = W - PT;
  const Y0 = .31, YB = 2.84, YF = 2.92, YT = 3.03, MH = .22;
  const RX = 1.38, RZ = -.62, RR = .38, RH = 2.3;
  const WZ = -.62, WT = .28, WH = 1.3, WX0 = TX + HS - .03, WX1 = RX - RR + .04, GX = .57;
  const AX = TX, AZ = -.25, AR = .95, ANG = [-78, -50, -22, 22, 50, 78].map(d => d * PI / 180);

  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 7001 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  function sc(y) {                                          /* 一块石头的颜色：深浅不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .5 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .9) c = mix3(c, STD, .4);
    const g = Math.max(0, Math.min(.3, (1.3 - y) * .2));
    return mix3(c, mix3(STD, C.ivy, .35), g);
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
  function wedge(b, x, y, z, w, h, d, col) {                /* 斜顶小块：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col);
    b.quad([x0, y, z1], [x0, y, z0], [x1, y, z0], [x1, y, z1], col);
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
    const pts = archPts(w, p, 5);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、门洞壁、拱心石 */
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
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）一层层错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .18, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .13 : .25) : 0, q1 = o.qr ? ((j + ph) % 2 ? .25 : .13) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .26));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .21 + R() * .24; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        const col = isQ ? mix3(DRESS2, ST, R() * .35) : (o.col ? o.col(ya) : sc(ya));
        const a = [E[k][0], ya, z], c2 = [E[k + 1][0], ya, z], c3 = [E[k + 1][1], yb, z], d = [E[k][1], yb, z];
        if (o.back) b.quad(c2, a, d, c3, col); else b.quad(a, c2, c3, d, col);
      }
    }
  }
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆塔身：一圈圈石砌，层层错半块；里头一根深色芯（顶面当平台） */
    const n = Math.max(1, Math.round((y1 - y0) / (rh || .18))), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU, px = cx + Math.sin(a) * r, pz = cz + Math.cos(a) * r, qx = cx + Math.sin(a2) * r, qz = cz + Math.cos(a2) * r;
        b.quad([px, ya, pz], [qx, ya, qz], [qx, yb, qz], [px, yb, pz], sc(ya));
      }
    }
    b.cyl(cx, y0, cz, r * Math.cos(PI / seg) - .006, y1 - y0, seg, STD, { nb: true, a0: PI / seg, top: FLOOR });
  }
  function ringWall(b, cx, cz, r0, r1, yIn, y0, y1, seg) {   /* 圆胸墙：外面两层石砌、内壁、压顶、底面 */
    const P = (a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r], hh = (y1 - y0) / 2;
    for (let i = 0; i < seg; i++) {
      for (let j = 0; j < 2; j++) {
        const off = j * .5, a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU, ya = y0 + j * hh, yb = ya + hh;
        b.quad(P(a, r1, ya), P(a2, r1, ya), P(a2, r1, yb), P(a, r1, yb), sc(2));
      }
      const a = i / seg * TAU, a2 = (i + 1) / seg * TAU;
      b.quad(P(a2, r0, yIn), P(a, r0, yIn), P(a, r0, y1), P(a2, r0, y1), ST2);
      b.quad(P(a, r1, y1), P(a2, r1, y1), P(a2, r0, y1), P(a, r0, y1), DRESS);
      b.quad(P(a, r0, y0), P(a2, r0, y0), P(a2, r1, y0), P(a, r1, y0), INNER);
    }
  }
  function corbel2(b, x, y, z) {                            /* 两级托石：下级短，上级挑出 OUT */
    cbox(b, x, y - .17, z - .02, .075, .08, z + OUT * .5, DRESS2);
    cbox(b, x, y - .09, z - .02, .09, .09, z + OUT, mix3(DRESS2, DRESS, .4));
  }
  function rcorbels(b, cx, cz, r, y, n) {
    for (let i = 0; i < n; i++) { b.at(cx, 0, cz, (i + .5) / n * TAU); cbox(b, 0, y - .14, r - .02, .065, .07, r + .045, DRESS2); cbox(b, 0, y - .07, r - .02, .08, .07, r + .085, DRESS2); b.pop(); }
  }
  function merlons(b, x0, x1, y, z, d, o) {                 /* 墙头一排垛口 */
    o = o || {};
    const mw = o.mw || .13, gap = o.gap || .1, mh = o.mh || .16, n = Math.max(1, Math.floor((x1 - x0 + gap) / (mw + gap))), tot = n * mw + (n - 1) * gap, s = (x0 + x1) / 2 - tot / 2;
    for (let i = 0; i < n; i++) b.box(s + mw / 2 + i * (mw + gap), y, z, mw, mh, d, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS });
  }
  function rmerlons(b, cx, cz, r, y, n, o) {
    o = o || {};
    for (let i = 0; i < n; i++) { b.at(cx, 0, cz, (i + .5) / n * TAU); b.box(0, y, r - .05, o.mw || .12, o.mh || .15, .1, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS }); b.pop(); }
  }

  /* ---------- 窗、门、灯 ---------- */
  function slit(b, x, y, z) {                               /* 箭孔：十字窄缝 */
    b.panel(x, y - .03, z + .002, .08, .32, DRESS2);
    b.panel(x, y, z + .004, .03, .26, INNER);
    b.panel(x, y + .12, z + .005, .1, .028, INNER);
  }
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .045, e = o.e != null ? o.e : .55;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, WIN, { e });
    b.panel(0, 0, .028, .016, h + archY(w, p, 0) * .8, MULL);
    b.panel(0, h * .55, .029, w, .014, MULL);
    b.box(0, -fr - .035, 0, w + fr * 2 + .05, .035, .09, DRESS);
    if (o.hood) {
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .06, p, 3), zh = .04;
      for (let i = 0; i < ai.length - 1; i++) b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
      for (const s of [-1, 1]) b.box(s * (w / 2 + fr + .015), h - .06, .015, .045, .07, .05, DRESS, { nb: true });
    }
    b.pop();
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    for (let i = 1; i < 5; i++) { const x = -w / 2 + i * w / 5; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, dark); }
    for (const y of [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 5; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 4, y + .006, .0125, .016, .016, C.metal, M);
    }
    b.at(w * .22, h * .55, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .026, .007, 8, 3, IRON, M); b.pop();
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
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .028 + R() * .03, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function finial(b, x, y, z, cy) { b.beam([x, y - .06, z], [x, y + .26, z], .024, cy ? BRASS : IRON, cy ? GL : M); b.sphere(x, y + .06, z, .04, 5, cy ? BRASS : BRONZE, cy ? GL : M); }

  /* ---------- 小件 ---------- */
  function woodpile(b, x0, z0, z1, h) {                     /* 靠墙的柴垛：一层层原木，上面一道石板瓦小披檐（贴在 x0 的墙，朝 +x） */
    const L = z1 - z0, rows = 3;
    for (let j = 0; j < rows; j++) for (let i = 0; i < 4 - (j > 1 ? 1 : 0); i++) {
      const zz = z0 + .06 + (i + (j % 2) * .5) * (L - .12) / 3.5, yy = .055 + j * .1, xx = x0 + .12;
      b.at(xx, yy, zz, 0, 1, 0, PI / 2); b.cyl(0, -.12, 0, .05, .24, 5, mix3(C.woodL, C.wood, R()), { top: mix3(C.woodL, C.hay, .4), bot: mix3(C.woodL, C.hay, .4) }); b.pop();
    }
    for (const z of [z0, z1]) b.box(x0 + .23, 0, z, .04, h, .04, OAK);
    b.at(x0, 0, (z0 + z1) / 2, PI / 2); wedge(b, 0, h, .15, L + .1, .14, .32, SL2); b.pop();
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、尖底布条、金边、菱形徽 */
    b.beam([x - w / 2 - .035, yt + .012, z + .035], [x + w / 2 + .035, yt + .012, z + .035], .02, IRON, M);
    b.at(x, yt, z + .015);
    fan(b, [[-w / 2, -h + .09], [0, -h], [w / 2, -h + .09], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .022, -h + .1, .003, .013, h - .13, C.gold, M);
    b.panel(w / 2 - .022, -h + .1, .003, .013, h - .13, C.gold, M);
    b.panel(0, -.07, .003, w - .02, .013, C.gold, M);
    const yc = -h * .45;
    fan(b, [[0, yc - .065], [.05, yc], [0, yc + .065], [-.05, yc]], .004, C.gold, M);
    fan(b, [[0, yc - .03], [.022, yc], [0, yc + .03], [-.022, yc]], .006, col);
    b.pop();
  }
  function hoist(b, x, zIn, zOut, y, yb, cy) {             /* 吊柴的木吊臂（当前坐标 z 朝外）：横木伸出垛口、铁箍、滑轮，绳子吊着一捆柴 */
    b.box(x, y, (zIn + zOut) / 2, .065, .065, zOut - zIn, OAK, { top: OAK2 });
    b.beam([x, y - .22, zIn + .2], [x, y, zIn + .5], .04, OAK);
    for (const z of [zIn + .2, zOut - .08]) b.box(x, y - .005, z, .08, .075, .03, IRON, M);
    b.at(x, y - .04, zOut - .04, 0, 1, 0, PI / 2); b.cyl(0, -.025, 0, .045, .05, 8, cy ? AGED : IRON, M); b.pop();
    b.beam([x, y - .08, zOut - .04], [x, yb + .2, zOut - .04], .01, ROPE);
    for (const dx of [-.06, .06]) b.beam([x, yb + .2, zOut - .04], [x + dx, yb + .12, zOut - .04], .008, ROPE);
    for (let i = 0; i < 5; i++) { const dx = (i % 3 - 1) * .045, dy = i > 2 ? .05 : 0; b.at(x + dx + (i > 2 ? .022 : 0), yb + .06 + dy, zOut - .04, 0, 1, PI / 2); b.cyl(0, -.11, 0, .026, .22, 5, mix3(C.woodL, C.wood, R()), { top: mix3(C.woodL, C.hay, .4), bot: mix3(C.woodL, C.hay, .4) }); b.pop(); }
    b.box(x, yb + .065, zOut - .04, .16, .018, .015, OAK2);
  }
  function barrel(b, x, z, r, h) {                          /* 雨水桶：桶板、铁箍、一汪水 */
    b.cyl(x, 0, z, r * .92, h, 8, mix3(C.wood, C.woodD, .35 + R() * .2), { r2: r * .92, nt: true, nb: true });
    b.cyl(x, h * .3, z, r, h * .4, 8, mix3(C.wood, C.woodD, .2), { nt: true, nb: true });
    for (const y of [.12, .5, .88]) b.cyl(x, h * y - .012, z, r * (y === .5 ? 1.02 : .95), .025, 8, IRON, { nt: true, nb: true, mat: "metal" });
    b.cyl(x, h - .02, z, r * .86, .01, 8, mix3(C.water, C.stoneD, .5), { nb: true });
  }
  function horn(b, x, y, z) {                               /* 铁钩上挂的铜号角（e 0）：弯成半圈，喇叭口朝左下；一根皮背带 */
    b.beam([x, y + .1, z], [x, y + .1, z + .07], .014, IRON, M);
    const N = 6, P = t => { const a = PI * (.05 + .95 * t); return [x + Math.cos(a) * .11, y + Math.sin(a) * .07, z + .07]; };
    for (let i = 0; i < N; i++) tube(b, P(i / N), P((i + 1) / N), .009 + .012 * i / N, .009 + .012 * (i + 1) / N, BRONZE, M, 6);
    const e0 = P(1), e1 = P(.94), d = nrm(sub(e0, e1));
    tube(b, e0, [e0[0] + d[0] * .05, e0[1] + d[1] * .05 - .01, e0[2]], .021, .045, BRONZE, M, 8);
    b.beam(P(.15), [x, y + .1, z + .07], .008, OAK2); b.beam(P(.8), [x, y + .1, z + .07], .008, OAK2);
  }
  function brazier(b, x, y, z, s, lit) {                    /* 三足铁火盆：弯腿、铁盆、盆沿、炭、火苗（C.glow，e .55） */
    b.at(x, y, z, .3, s);
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; b.beam([Math.sin(a) * .2, 0, Math.cos(a) * .2], [Math.sin(a) * .13, .2, Math.cos(a) * .13], .026, IRON, M); b.beam([Math.sin(a) * .13, .2, Math.cos(a) * .13], [Math.sin(a) * .1, .27, Math.cos(a) * .1], .022, IRON, M); }
    b.cyl(0, .2, 0, .08, .12, 8, IRON, { r2: .19, nt: true, mat: "metal" });
    b.torus(0, .32, 0, .19, .014, 8, 3, IRON, M);
    b.cyl(0, .28, 0, .175, .025, 8, COAL, { nb: true, top: lit ? mix3(COAL, [.5, .2, .08], .45) : COAL });
    if (lit) {                                               /* 火苗压小、偏橙，不做大白锥 */
      b.cone(0, .3, 0, .065, .19, 5, C.glow, { e: .55, nb: true });
      b.cone(.06, .3, -.03, .045, .13, 4, C.lamp, { e: .45, nb: true });
      b.cone(-.055, .3, .035, .04, .11, 4, C.lamp, { e: .45, nb: true });
      b.cone(-.01, .3, -.07, .035, .09, 4, C.lamp, { e: .4, nb: true });
    }
    b.pop();
  }
  function ballista(b, x, y, z, ry, tilt) {                 /* 木弩车：三脚木架、弩床、两条弓臂、弓弦、铁头弩箭、尾部绞盘（朝本地 −z） */
    b.at(x, y, z, ry);
    for (const a of [0, 2.1, 4.2]) b.beam([0, .22, 0], [Math.sin(a) * .17, 0, Math.cos(a) * .17], .026, OAK);
    b.cyl(0, .19, 0, .04, .06, 6, IRON, M);
    b.at(0, .27, 0, 0, 1, .12 + (tilt || 0), (tilt || 0) * .6);
    b.box(0, -.025, -.02, .075, .05, .48, OAK2, { top: mix3(OAK2, C.woodL, .25) });
    b.box(0, -.045, -.21, .13, .09, .07, IRON, M);
    for (const s of [-1, 1]) {
      b.beam([s * .06, 0, -.21], [s * .25, .0, -.12], .03, OAK, { tz: .03 });
      b.beam([s * .25, 0, -.12], [0, .012, .07], .006, ROPE);
    }
    b.beam([0, .03, .09], [0, .03, -.3], .014, C.woodL);
    b.at(0, .03, -.3, 0, 1, -PI / 2); b.cone(0, 0, 0, .022, .07, 4, IRON, M); b.pop();
    b.at(0, -.0, .21, 0, 1, 0, PI / 2); b.cyl(0, -.08, 0, .03, .16, 6, OAK2); b.pop();
    for (const s of [-1, 1]) b.beam([s * .085, 0, .21], [s * .085, .09, .26], .012, IRON, M);
    b.pop();
    b.pop();
  }

  /* ---------- 2077 小件 ---------- */
  function rangefinder(b, x, y, z, ry) {                    /* 黄铜测距镜：三脚架、横筒（两头镜片）、目镜、俯仰座 */
    b.at(x, y, z, ry);
    for (const a of [.3, 2.4, 4.5]) b.beam([0, .34, 0], [Math.sin(a) * .18, 0, Math.cos(a) * .18], .018, BRASS, GL);
    b.cyl(0, .31, 0, .035, .06, 6, BRASS, GL);
    b.box(0, .37, 0, .1, .07, .075, mix3(BRASS, IRON, .45), M);
    tube(b, [-.3, .42, 0], [.3, .42, 0], .028, .028, BRASS, GL, 8);
    for (const s of [-1, 1]) tube(b, [s * .27, .42, 0], [s * .33, .42, 0], .042, .042, BRASS, { mat: "gloss", nt: false, top: C.tintB }, 8);
    tube(b, [0, .42, .02], [0, .43, .12], .016, .02, mix3(BRASS, IRON, .45), M, 6);
    b.pop();
  }
  function amberLamp(b, x, y, z) {                          /* 琥珀小灯：黄铜座、玻璃罩里一点暖光、黄铜顶 */
    b.cyl(x, y, z, .05, .03, 6, BRASS, GL);
    b.beam([x, y + .03, z], [x, y + .16, z], .022, BRASS, GL);
    b.cyl(x, y + .16, z, .045, .1, 6, C.glow, { r2: .052, e: .55, nt: true, nb: true });
    b.cyl(x, y + .26, z, .065, .02, 6, BRASS, GL);
    b.cone(x, y + .28, z, .06, .06, 6, BRASS, GL);
  }
  function heliograph(b, o, x, y, z) {                      /* 黄铜日光信号镜：铜座、立柱、叉架托一面圆镜，绕 y 慢转（待修时不转） */
    b.cyl(x, y, z, .08, .05, 8, BRASS, GL);
    b.beam([x, y + .05, z], [x, y + .3, z], .032, BRASS, GL);
    const fn = sb => {
      sb.beam([-.21, 0, 0], [.21, 0, 0], .022, BRASS, GL);
      for (const s of [-1, 1]) sb.beam([s * .2, 0, 0], [s * .2, .22, 0], .02, BRASS, GL);
      sb.at(0, .22, 0, 0, 1, PI / 2 - .55);
      sb.cyl(0, -.014, 0, .16, .028, 12, BRASS, { mat: "gloss", top: mix3(mix3(C.glass, C.stone, .55), C.slate, .25), bot: mix3(BRASS, IRON, .4) });
      sb.pop();
      for (const s of [-1, 1]) sb.sphere(s * .2, .22, 0, .025, 4, BRASS, GL);
    };
    if (o.bad) { b.at(x, y + .32, z, .6); fn(b); b.pop(); } else b.spin(x, y + .32, z, "y", .4, fn);
  }
  function signalLamp(b, x, y, z) {                         /* 黄铜信号灯：短铜柱上一只方灯箱，前面一块暖色灯片和铁百叶，四坡小顶 */
    b.beam([x, y, z], [x, y + .2, z], .04, BRASS, GL);
    b.box(x, y + .2, z, .17, .15, .15, BRASS, GL);
    b.panel(x, y + .225, z + .077, .11, .1, C.glow, { e: .55 });
    for (let i = 0; i < 3; i++) b.box(x, y + .235 + i * .03, z + .08, .12, .008, .012, IRON, M);
    b.pyramid(x, y + .35, z, .2, .18, .07, mix3(BRASS, IRON, .35), M);
    b.cyl(x, y + .41, z, .02, .05, 6, BRASS, GL);
  }
  function airshipVane(b, x, y, z, h, ry) {                 /* 小飞艇风向标：铁杆、方位十字、一只黄铜小飞艇 */
    b.beam([x, y - .04, z], [x, y + h, z], .016, IRON, M);
    b.beam([x - .07, y + h * .45, z], [x + .07, y + h * .45, z], .01, IRON, M);
    b.beam([x, y + h * .45, z - .07], [x, y + h * .45, z + .07], .01, IRON, M);
    b.at(x, y + h + .045, z, ry);                            /* 艇身沿本地 z：气囊、两道箍、吊舱、尾部十字尾翼 */
    b.at(0, 0, 0, 0, [.4, .4, 1]); b.sphere(0, 0, 0, .12, 8, mix3(C.cream, C.stone, .3), GL); b.pop();
    for (const dz of [-.05, .05]) { b.at(0, 0, dz, 0, 1, PI / 2); b.torus(0, 0, 0, .046, .006, 8, 3, BRASS, GL); b.pop(); }
    b.beam([0, -.045, .02], [0, -.06, .02], .008, BRASS, GL);
    b.box(0, -.075, .02, .024, .022, .055, BRASS, GL);
    b.box(0, .035, -.1, .006, .05, .045, BRASS, GL); b.box(0, -.055, -.1, .006, .03, .04, BRASS, GL);
    b.box(0, 0, -.1, .08, .006, .04, BRASS, GL);
    b.pop();
  }
  function catLamp(b, x, z, h, off) {                       /* 黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, -.05, z, .045, .08, 6, DRESS2);
    b.beam([x, 0, z], [x, h, z], .022, BRASS, M);
    b.beam([x, h, z], [x + .1, h + .06, z], .016, BRASS, M);
    b.beam([x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, M);
    b.sphere(x, h + .01, z, .025, 4, BRASS, M);
    if (!off) b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }
  function oriel(b, x, y, z, w, h, d) {                     /* 黄铜框玻璃凸窗（面朝 +z）：叠涩石托、窗台、三面玻璃、黄铜框、铅皮斜顶，里头一点暖光 */
    for (let i = 0; i < 3; i++) { const t = (i + 1) / 3; cbox(b, x, y - .2 + i * .066, z - .01, w * (.4 + .6 * t), .066, z + d * t, i % 2 ? DRESS2 : DRESS); }
    b.box(x, y - .005, z + d / 2, w + .05, .03, d + .025, DRESS, { nb: true });
    const G = { mat: "glass" }, yt = y + h, x0 = x - w / 2, x1 = x + w / 2, zf = z + d;
    b.panel(x, y + .02, z + .012, w - .04, h - .05, WIN, { e: .45 });
    b.quad([x0, y, zf], [x1, y, zf], [x1, yt, zf], [x0, yt, zf], GLASS, G);
    b.quad([x1, y, zf], [x1, y, z], [x1, yt, z], [x1, yt, zf], GLASS, G);
    b.quad([x0, y, z], [x0, y, zf], [x0, yt, zf], [x0, yt, z], GLASS, G);
    for (const xx of [x0, x, x1]) b.beam([xx, y, zf], [xx, yt, zf], .022, BRASS, GL);
    for (const xx of [x0, x1]) b.beam([xx, y, z + .01], [xx, yt, z + .01], .018, BRASS, GL);
    for (const yy of [y + .012, y + h * .64, yt]) { b.beam([x0, yy, zf], [x1, yy, zf], .018, BRASS, GL); for (const xx of [x0, x1]) b.beam([xx, yy, z], [xx, yy, zf], .016, BRASS, GL); }
    wedge(b, x, yt, z + d / 2 + .01, w + .07, .11, d + .05, SL2);
    b.sphere(x, yt + .02, zf + .02, .018, 4, BRASS, GL);
  }
  function senseTree(b, x, z, s, ry) {                      /* 感知结界树：细高的浅色树干、两根斜枝、几团白绿各半的叶团（e .15） */
    b.at(x, 0, z, ry, s);
    const bark = mix3(C.white, C.stone, .45);
    b.cyl(0, -.05, 0, .05, .85, 6, bark, { r2: .03, nb: true });
    b.beam([0, .45, 0], [.16, .7, .05], .03, bark); b.beam([0, .55, 0], [-.14, .78, -.04], .028, bark);
    const cl = [[0, 1.0, 0, .24], [.17, .76, .06, .17], [-.15, .84, -.05, .18], [.02, 1.22, .02, .15], [-.04, .66, .12, .13]];
    for (const [cx, cyy, cz, r] of cl) b.sphere(cx, cyy, cz, r, 6, mix3(LEAFS, R() < .5 ? C.white : C.leaf, R() * .18), { e: .15, k: 1.15 });
    b.pop();
  }

  /* ================= 主塔 ================= */
  function plinth(b) {                                      /* 外撇的勒脚石座：四面斜坡、两层粗石、压顶料石 */
    const h0 = .6, h1 = .5, y0 = -.12, y1 = Y0 - .04, n = 2;
    for (let f = 0; f < 4; f++) {
      b.at(TX, 0, TZ, f * PI / 2);
      for (let j = 0; j < n; j++) {
        const ya = y0 + (y1 - y0) * j / n, yb = y0 + (y1 - y0) * (j + 1) / n, ha = h0 + (h1 - h0) * j / n, hb = h0 + (h1 - h0) * (j + 1) / n;
        const cuts = []; let x = -ha + .12 + R() * .2;
        while (x < ha - .14) { cuts.push(x); x += .24 + R() * .22; }
        const E = [[-ha, -hb]].concat(cuts.map(c => [c, c]), [[ha, hb]]);
        for (let k = 0; k < E.length - 1; k++) b.quad([E[k][0], ya, ha], [E[k + 1][0], ya, ha], [E[k + 1][1], yb, hb], [E[k][1], yb, hb], mix3(mix3(ST2, STD, .3 + R() * .45), C.ivy, j ? 0 : .14));
      }
      b.pop();
    }
    b.box(TX, y1, TZ, h1 * 2 + .05, .04, h1 * 2 + .05, DRESS2, { nb: true, top: FLOOR });
  }
  function gallery(b) {                                     /* 塔顶：两级托石挑出的悬空垛口廊（托石间是投石孔）、胸墙、压顶、四面城堞、平台 */
    for (let f = 0; f < 4; f++) {
      b.at(TX, 0, TZ, f * PI / 2);
      for (let i = 0; i < 5; i++) corbel2(b, -HS + .1 + i * (HS * 2 - .2) / 4, YB, HS);
      const X = f % 2 ? HS : W, X2 = f % 2 ? WI : W;
      b.quad([-X, YB, HS], [X, YB, HS], [X, YB, W], [-X, YB, W], INNER);
      mason(b, () => [-W, W], YB, YT, W, { rh: .095, ql: 1, qr: 1, qph: f });
      b.quad([WI, YF, WI], [-WI, YF, WI], [-WI, YT, WI], [WI, YT, WI], mix3(ST2, STD, .55));
      b.quad([-X2, YT, W], [X2, YT, W], [X2, YT, WI], [-X2, YT, WI], DRESS);
      const n = 5, mw = .15, gap = (2 * W - n * mw) / (n - 1);
      for (let i = 0; i < n; i++) {
        const corner = i === 0 || i === n - 1;
        if (f % 2 && corner) continue;
        const x = -W + mw / 2 + i * (mw + gap), d = corner ? mw : PT;
        b.box(x, YT, W - d / 2, mw, MH, d, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS });
        if (!corner && i % 2) b.panel(x, YT + .05, W + .002, .022, .12, INNER);
      }
      b.pop();
    }
    b.quad([TX - WI, YF, TZ + WI], [TX + WI, YF, TZ + WI], [TX + WI, YF, TZ - WI], [TX - WI, YF, TZ - WI], FLOOR);
  }
  function keep(b, o) {
    const cy = o.cy;
    plinth(b);
    for (let f = 0; f < 4; f++) { b.at(TX, 0, TZ, f * PI / 2); mason(b, () => [-HS, HS], Y0, YB, HS, { ql: 1, qr: 1, qph: f }); b.pop(); }
    b.box(TX, 1.6, TZ, HS * 2 + .045, .055, HS * 2 + .045, DRESS2, { nb: true });   /* 腰线 */
    /* 正面：尖拱铁钉木门、料石门券、三级石阶、提灯、铜号角；门上一扇烛光尖拱窗（2077 换玻璃凸窗）、顶上一道箭缝 */
    b.at(TX, 0, TZ);
    b.at(0, Y0, HS); archRing(b, .3, .4, .62, .07, 0, .05); b.at(0, 0, .006); door(b, .3, .4, .62); b.pop(); b.pop();
    for (let i = 0; i < 3; i++) { const yt = Y0 - (i + 1) * .077, zf = HS + .2 + i * .12; b.box(0, -.12, (HS + .04 + zf) / 2, .56 + i * .04, yt + .12, zf - HS - .04, mix3(ST2, STD, .25 + R() * .2), { top: i % 2 ? DRESS2 : DRESS, nb: true }); }
    if (cy) oriel(b, 0, 1.42, HS, .36, .56, .2);
    else lancet(b, 0, 1.36, HS, .15, .32, { hood: 1 });
    banner(b, 0, 2.6, HS, .24, cy ? .42 : .56, C.banner);
    for (const s of [-1, 1]) slit(b, s * .3, 2.18, HS);
    barrel(b, -.73, .18, .1, .26);
    wallLantern(b, .3, .98, HS, cy);
    horn(b, -.3, 1.0, HS);
    if (cy) {                                                /* 黄铜铭牌、雨水管 */
      b.box(-.3, .56, HS + .006, .19, .085, .014, BRASS, GL);
      for (const y of [.585, .61]) b.panel(-.3, y, HS + .0135, .13, .008, mix3(BRASS, OAK, .6));
    }
    b.pop();
    if (cy) {                                                /* 雨水管：东面靠后，旧铜色，细 */
      const px = TX + HS + .025, pz = TZ - HS + .1;
      b.box(px, YB - .16, pz, .075, .09, .075, COPPER, GL); b.box(px, YB - .185, pz, .045, .025, .045, COPPER, GL);
      b.beam([px, Y0 + .1, pz], [px, YB - .18, pz], .026, COPPER, GL);
      for (let y = Y0 + .45; y < YB - .3; y += .55) b.box(px - .01, y, pz, .04, .02, .04, IRON, M);
      b.beam([px, Y0 + .12, pz], [px + .09, Y0 + .03, pz], .026, COPPER, GL);
    }
    /* 东面：下层箭缝、上层烛光尖拱窗 */
    b.at(TX, 0, TZ, PI / 2); slit(b, -.2, 1.0, HS); lancet(b, .05, 2.02, HS, .13, .28, { hood: 1 }); b.pop();
    /* 背面、西面：两层箭缝、常春藤 */
    b.at(TX, 0, TZ, PI); slit(b, .12, 1.05, HS); slit(b, -.1, 2.18, HS); ivy(b, .1, Y0, HS, .8, 2.1, 70); b.pop();
    b.at(TX, 0, TZ, -PI / 2); slit(b, .12, 1.12, HS); slit(b, .2, 2.2, HS); ivy(b, .15, Y0, HS, .55, 1.5, 55); hoist(b, -.13, WI - .12, W + .36, YT + .035, 1.55, cy); b.pop();
    /* 西面塔脚的柴垛 */
    b.at(TX - .6, 0, TZ, PI); woodpile(b, 0, .02, .5, .42); b.pop();
    gallery(b);
  }

  /* ================= Lv2：城墙、圆烽火塔 ================= */
  function curtain(b) {                                     /* 城墙：两面错缝砌、洞穿的尖拱小门（料石券）、走道、双面城堞、常春藤 */
    const zf = WZ + WT / 2, zb = WZ - WT / 2, gw = .3, gs = .5, gp = .62, apex = gs + archY(gw, gp, 0), xl = GX - gw / 2, xr = GX + gw / 2;
    for (const [z, back] of [[zf, false], [zb, true]]) {
      mason(b, () => [WX0, xl], 0, WH, z, { back, qr: 1 });
      mason(b, () => [xr, WX1], 0, WH, z, { back, ql: 1 });
      mason(b, () => [xl, xr], apex, WH, z, { back });
    }
    b.at(GX, 0, 0); archFill(b, gw, gp, gs, apex, zf, zb, ST2, INNER); b.pop();
    b.quad([xl, 0, zf], [xl, 0, zb], [xl, gs, zb], [xl, gs, zf], mix3(ST2, STD, .4));
    b.quad([xr, 0, zb], [xr, 0, zf], [xr, gs, zf], [xr, gs, zb], mix3(ST2, STD, .4));
    { const ai = archPts(gw, gp, 5), ao = archPts(gw + .13, gp, 5), zq = zf + .012;
      for (let i = 0; i < ai.length - 1; i++) b.quad([GX + ao[i][0], gs + ao[i][1], zq], [GX + ai[i][0], gs + ai[i][1], zq], [GX + ai[i + 1][0], gs + ai[i + 1][1], zq], [GX + ao[i + 1][0], gs + ao[i + 1][1], zq], i % 2 ? DRESS : DRESS2);
      b.box(GX, apex - .02, zq - .005, .07, .1, .03, DRESS, { nb: true }); }
    b.quad([WX0, WH, zf], [WX1, WH, zf], [WX1, WH, zb], [WX0, WH, zb], FLOOR);
    b.box((WX0 + WX1) / 2, WH - .06, zf + .012, WX1 - WX0, .05, .03, DRESS2, { nb: true });
    merlons(b, WX0 + .08, WX1 - .04, WH, zf - .045, .09, { mw: .12, gap: .1, mh: .17 });
    merlons(b, WX0 + .08, WX1 - .04, WH, zb + .045, .09, { mw: .12, gap: .1, mh: .17 });
    ivy(b, .3, 0, zf, .35, .9, 30);
  }
  function roundTower(b, o) {                               /* 矮圆烽火塔：勒脚、石砌塔身、腰线、箭缝、烛光小窗、矮门、托石胸墙、城堞、平台 */
    const cy = o.cy;
    b.cyl(RX, -.12, RZ, RR + .1, .3, 12, mix3(ST2, STD, .45), { r2: RR + .03, nb: true, top: DRESS2, a0: PI / 12 });
    rwall(b, RX, RZ, RR, .18, RH, 12, .18);
    b.cyl(RX, 1.45, RZ, RR + .022, .05, 12, DRESS2, { a0: PI / 12 });
    b.at(RX, 0, RZ, -.25); lancet(b, 0, 1.62, RR - .012, .11, .22, { fr: .04 }); b.pop();
    b.at(RX, 0, RZ, .3); b.at(0, .18, RR - .02); archRing(b, .2, .28, .6, .05, 0, .04); b.at(0, 0, .006); door(b, .2, .28, .6); b.pop(); b.pop(); b.pop();
    for (const [a, y] of [[PI / 2, .85], [PI / 2 + .3, 1.75], [PI, 1.2], [-.35, .75]]) { b.at(RX, 0, RZ, a); slit(b, 0, y, RR - .006); b.pop(); }
    b.at(RX, 0, RZ, .1); wallLantern(b, 0, .78 + .0, RR - .01, cy); b.pop();
    rcorbels(b, RX, RZ, RR, RH, 12);
    ringWall(b, RX, RZ, RR - .07, RR + .09, RH + .005, RH, RH + .18, 12);
    rmerlons(b, RX, RZ, RR + .09, RH + .18, 8, { mw: .13, mh: .16 });
    b.at(RX, 0, RZ, PI * .8); ivy(b, 0, .18, RR, .5, 1.3, 30); b.pop();
  }

  /* ================= Lv3：四坡顶、符文阵 ================= */
  function hipRoof(b, cx, cz, Wr, r, ye, yr, cy) {          /* 陡四坡石板瓦顶：屋脊沿 x（半长 r），檐口一道微翘；一道道深浅瓦层，每片深浅不一 */
    const S = [0, .1], Y = [ye, ye + .06], nR = 7;
    for (let i = 1; i <= nR; i++) { S.push(.1 + .9 * i / nR); Y.push(ye + .06 + (yr - ye - .06) * i / nR); }
    const yOf = s => { for (let i = 0; i < S.length - 1; i++) if (s <= S[i + 1] + 1e-9) return Y[i] + (Y[i + 1] - Y[i]) * (s - S[i]) / (S[i + 1] - S[i]); return yr; };
    for (let f = 0; f < 4; f++) {
      const ridge = f % 2 === 0, rx = ridge ? r : 0, rz = ridge ? 0 : r;
      const P = (s, u) => { const hx = Wr + (rx - Wr) * s, z = Wr + (rz - Wr) * s; return [-hx + 2 * hx * u, yOf(s), z]; };
      b.at(cx, 0, cz, f * PI / 2);
      for (let i = 0; i < S.length - 1; i++) {
        const s0 = S[i], s1 = Math.min(1, S[i + 1] + (i < S.length - 2 ? .022 : 0));
        const dzh = (Wr - rz) * (s1 - s0), dy = yOf(s1) - yOf(s0), L = Math.hypot(dzh, dy), lift = i ? .014 : 0, nY = dzh / L * lift, nZ = dy / L * lift;
        const hx0 = Wr + (rx - Wr) * s0, n = Math.max(1, Math.round(2 * hx0 / .17));
        let u0 = 0;
        for (let k = 0; k < n; k++) {
          const u1 = k === n - 1 ? 1 : (k + 1 + (R() - .5) * .5 * (i % 2 ? 1 : -1)) / n;
          const A = P(s0, u0), B = P(s0, u1), Cc = P(s1, u1), D = P(s1, u0);
          A[1] += nY; A[2] += nZ; B[1] += nY; B[2] += nZ;
          const base = i % 2 ? SL : SL2, rr = R(), col = rr < .2 ? mix3(base, SLD, .55) : rr > .85 ? mix3(base, [.5, .52, .56], .15) : mix3(base, SLD, rr * .25);
          b.quad(A, B, Cc, D, col);
          u0 = u1;
        }
      }
      b.beam(P(0, 1), P(1, 1), .05, SLD);
      b.beam([-Wr, ye - .025, Wr + .004], [Wr, ye - .025, Wr + .004], .04, OAK);
      b.pop();
    }
    b.beam([cx - r - .02, yr, cz], [cx + r + .02, yr, cz], .07, SLD);
    for (let i = 1; i < 4; i++) { if (cy && i === 2) continue; const x = cx - r + i * r / 2; b.beam([x, yr + .02, cz], [x, yr + .09, cz], .012, cy ? AGED : IRON, cy ? GL : M); b.pyramid(x, yr + .09, cz, .03, .012, .04, cy ? AGED : IRON, cy ? GL : M); }   /* 屋脊一排小铁花 */
    b.quad([cx - Wr, ye, cz - Wr], [cx + Wr, ye, cz - Wr], [cx + Wr, ye, cz + Wr], [cx - Wr, ye, cz + Wr], INNER);
    const sOf = y => .1 + .9 * (y - ye - .06) / (yr - ye - .06);
    for (let f = 0; f < 4; f++) {                            /* 四扇瞭望老虎窗 */
      const yl = ye + .2, s = sOf(yl), rr = f % 2 ? Wr + (r - Wr) * s : Wr * (1 - s);
      b.at(cx, 0, cz, f * PI / 2);
      b.box(0, yl, rr - .07, .17, .19, .22, mix3(SL, STD, .4));
      b.panel(0, yl + .035, rr + .042, .09, .11, WIN, { e: .55 });
      b.tri([-.045, yl + .145, rr + .042], [.045, yl + .145, rr + .042], [0, yl + .175, rr + .042], WIN, { e: .55 });
      b.panel(0, yl + .035, rr + .045, .012, .13, MULL);
      b.at(0, yl + .19, rr - .07, PI / 2); b.gable(0, 0, 0, .27, .24, .13, SL2, { end: mix3(SL, STD, .4) }); b.pop();
      b.sphere(0, yl + .33, rr + .03, .018, 4, cy ? BRASS : IRON, cy ? GL : M);
      b.pop();
    }
    for (const s of [-1, 1]) {                               /* 屋脊两端：短铁尖顶饰，中间一颗球 */
      const x = cx + s * (r + .01), fc = cy ? AGED : IRON, fo = cy ? GL : M;
      b.cyl(x, yr - .02, cz, .035, .05, 6, fc, fo);
      b.sphere(x, yr + .08, cz, .035, 5, cy ? BRASS : BRONZE, fo);
      b.cone(x, yr + .1, cz, .016, .16, 4, fc, fo);
    }
  }
  function runeStone(b, x, z, a, tx, tz, cy, down) {        /* 符文立石：略歪的粗石板、斜削的顶、一列淡紫符文（e .4）；2077 戴黄铜帽；down 倒伏 */
    const c = mix3(ST2, C.stone, .2 + R() * .4), top = mix3(c, DRESS, .3);
    if (down) b.at(x, .06, z, a + .3, 1, PI / 2 - .08, .1); else b.at(x, 0, z, a, 1, tx, tz);
    b.box(0, -.08, 0, .14, .6, .1, c, { nb: true, top });
    b.pyramid(0, .52, 0, .14, .1, .07, top);
    b.panel(.035, .02, .051, .05, .12, mix3(C.ivy, c, .45));
    b.panel(0, .1, .052, .016, .34, RUNE, { e: .4 });
    for (let k = 0; k < 4; k++) { const y = .14 + k * .08, s = k % 2 ? 1 : -1; b.panel(s * .02, y, .053, .03, .013, RUNE, { e: .4 }); }
    if (cy) { b.box(0, .48, 0, .158, .035, .118, AGED, GL); b.pyramid(0, .515, 0, .158, .118, .06, AGED, GL); }
    b.pop();
  }
  function runeArc(b, o) {                                  /* 防空仪式阵：门前一道弧，六块符文立石，地上一圈平石连起来 */
    for (let a = -1.42; a <= 1.42 + 1e-6; a += .11) {
      if (ANG.some(s => Math.abs(s - a) < .08)) continue;
      b.at(AX, 0, AZ, a); b.box((R() - .5) * .015, -.05, AR + (R() - .5) * .02, .085, .07, .17 + R() * .04, mix3(C.stone, ST2, R() * .6), { nb: true, top: mix3(FLOOR, C.stone, R() * .5) }); b.pop();
    }
    ANG.forEach((a, i) => {
      const x = AX + Math.sin(a) * AR, z = AZ + Math.cos(a) * AR;
      b.at(x, 0, z, a); b.box(0, -.05, 0, .26, .07, .2, mix3(C.stone, ST2, .4), { nb: true, top: FLOOR }); b.pop();
      runeStone(b, x, z, a, (R() - .5) * .14, (R() - .5) * .16, o.cy, o.bad && i === 4);
    });
  }
  function flowerBed(b) {                                   /* 2077：阵外一圈反预言花：石沿、土、低饱和淡紫的小花 */
    const r0 = 1.14, r1 = 1.3, a0 = -1.22, a1 = 1.22, n = 16;
    const P = (a, r, y) => [AX + Math.sin(a) * r, y, AZ + Math.cos(a) * r];
    for (let i = 0; i < n; i++) {
      const a = a0 + (a1 - a0) * i / n, c = a0 + (a1 - a0) * (i + 1) / n;
      b.quad(P(a, r0, .03), P(a, r1, .03), P(c, r1, .03), P(c, r0, .03), mix3(C.soil, C.leafD, .25));
      b.at(AX, 0, AZ, (a + c) / 2); b.box(0, -.03, r1 + .025, (r1 + .05) * (c - a) - .01, .085, .05, mix3(C.stone, ST2, R() * .5), { nb: true }); b.pop();
    }
    for (let i = 0; i < 26; i++) {
      const a = a0 + .05 + (a1 - a0 - .1) * (i + R() * .6) / 26, r = r0 + .03 + R() * (r1 - r0 - .06), [x, , z] = P(a, r, 0), h = .1 + R() * .1;
      b.cone(x, .02, z, .045, h * .7, 4, mix3(C.leaf, C.leafD, R()), { nb: true, a0: R() });
      const fc = FLW[i % 3];
      b.pyramid(x, .02 + h, z, .05, .05, .045, fc); b.at(x, .02 + h, z, 0, 1, PI); b.pyramid(0, 0, 0, .05, .05, .03, mix3(fc, C.leaf, .3)); b.pop();
    }
  }

  /* ================= 拼起来 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad;
    reseed(1); keep(b, { cy, lv });
    if (lv >= 2) { reseed(2); curtain(b); roundTower(b, { cy, lv }); }
    reseed(3);
    const fx = TX - W + .075, fz = TZ - W + .075;          /* 后角小旗 */
    if (lv < 3) {
      const bz = lv === 1 ? 0 : .13;
      if (!cy) {
        brazier(b, TX, YF, TZ + bz, 1, !bad);
        if (!bad) { b.emit(TX, YF + .55, TZ + bz, "ember", 5, 1); b.emit(TX, YF + .85, TZ + bz, "smoke", 6, .8); }
        if (lv === 2) ballista(b, TX, YF, TZ - .26, PI, bad ? .25 : 0);
      } else {
        rangefinder(b, TX - .04, YF, TZ + bz, .35);
        amberLamp(b, TX + .3, YF, TZ + bz + .18);
        if (lv === 2) heliograph(b, o, TX, YF, TZ - .27);
      }
      if (bad) { b.at(fx, YT + MH, fz, 0, 1, .35, .45); flag(b, 0, 0, 0, C.banner, .26); b.pop(); }
      else flag(b, fx, YT + MH, fz, C.banner, .26);
      if (cy) airshipVane(b, TX + W - .075, YT + MH, TZ + W - .075, .18, 2.0);
    } else {
      b.at(TX, 0, TZ);
      for (let f = 0; f < 4; f++) { b.at(0, 0, 0, f * PI / 2); b.box(0, YT + MH, W - PT / 2, 2 * W, .05, PT + .03, OAK); b.pop(); }
      b.box(0, YF, 0, 2 * WI - .16, YT + MH - YF + .05, 2 * WI - .16, mix3(INNER, OAK, .3), { nb: true });   /* 有顶瞭望廊里的暗处：从垛口看进去是黑的 */
      b.pop();
      hipRoof(b, TX, TZ, W + .055, .2, YT + MH + .05, 4.44, cy);
      if (cy) airshipVane(b, TX, 4.46, TZ, .13, 2.0);
    }
    /* 圆塔顶 */
    if (lv >= 2) {
      const ty = RH + .005;
      if (!cy) {
        brazier(b, RX, ty, RZ, .82, !bad);
        if (!bad) { b.emit(RX, ty + .45, RZ, "ember", 3, .9); if (lv >= 3) b.emit(RX, ty + .7, RZ, "smoke", 6, .8); }
        if (bad) { b.at(RX - .22, ty + .18, RZ - .22, 0, 1, -.4, .3); flag(b, 0, 0, 0, C.banner2, .4); b.pop(); }
        else flag(b, RX - .22, ty + .18, RZ - .22, C.banner2, .4);
      } else if (lv === 2) {
        signalLamp(b, RX, ty, RZ);
        airshipVane(b, RX - .22, ty + .18, RZ - .22, .3, 2.0);
      } else {
        heliograph(b, o, RX, ty, RZ);
        amberLamp(b, RX + .2, ty, RZ + .18);
      }
    }
    if (lv >= 3) runeArc(b, { cy, bad });
    if (cy) {
      catLamp(b, TX + .52, TZ + HS + .52, .82, bad);
      if (lv >= 2) { senseTree(b, -1.5, -1.38, .95, .3); senseTree(b, .5, -1.42, 1.0, 1.7); senseTree(b, 1.56, .42, .9, 2.6); }
      if (lv >= 3) flowerBed(b);
    }
    if (bad) {                                               /* 待修：几块垛口石掉在塔脚 */
      b.at(TX + .62, .05, TZ + .62, .5, 1, .3, .2); b.box(0, -.05, 0, .15, .18, .09, mix3(DRESS2, ST2, .5), { top: DRESS }); b.pop();
      b.at(TX - .7, .04, TZ + .45, 1.2, 1, .1, -.5); b.box(0, -.05, 0, .15, .16, .09, mix3(DRESS2, ST2, .3), { top: DRESS }); b.pop();
    }
  }
  build.h = o => [0, 3.76, 3.76, 4.9][Math.max(1, Math.min(3, o.lv || 1))];
  Isle3D.FAC["哨塔"] = build;
})();
