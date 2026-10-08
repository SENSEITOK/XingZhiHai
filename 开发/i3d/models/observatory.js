/* 观星台（1994 / 2077 都叫「观星台」）：霍格沃茨式的石砌天文台，主角是一顶会慢转的铜绿穹顶。鼓楼在 (0, −.2)，门朝 +z（岛心）。
   1994 Lv1：外撇勒脚上一座矮圆石鼓楼（r .75，墙高 1.4）：错缝风化灰石、一道腰线、四道扶壁、尖拱烛光窗（滴水线）；
             正面料石门券、尖拱铁钉木门、三级石阶，门两侧铁臂提灯，门上挂一幅深蓝星纹长旗；
             外墙左侧一道石阶绕半圈上到顶，铁扶手；墙顶一圈托石挑出走道和胸墙，四座小尖饰，后边一面小旗；
             顶上石砌矮鼓座（几扇小烛光窗），座上一顶铜绿穹顶：一瓣瓣深浅不一的铜板、暗铜肋、一道竖缝，缝里伸出一截望远镜筒；走道上还支着一架三脚小望远镜；
             穹顶尖上一座小铜亭、铁尖饰挂一颗小星；整个穹顶绕 y 极慢地转（.08）。门前右侧一块刻星图的石晷台。墙根爬常春藤。
        Lv2：右前起一座露天观测台：石砌圆高台、线脚、石栏杆（立柱、瓶柱、扶手），正面一道窄石阶、两道铁扶手、一盏铁灯柱；
             台上一架赤道仪：八角石墩、铁极轴座、配重杆，托着一架大黄铜折射望远镜（遮光罩、寻星镜、目镜）。
             左后一间小读书屋（正面朝右前）：石砌小屋、陡石板瓦人字顶、尖拱门、烛光窗、右山墙圆窗、左山墙外的石烟囱冒烟；门边长凳上一摞书。
        Lv3：鼓楼长成高塔（塔身 r .48 到 3.8）：塔身尖拱窗、腰线、正面一块星盘（蓝底、铜圈、金星、月牙），左前贴一座细石阶小塔戴铜绿小圆顶；
             顶上大托石挑出一圈带垛口的观星廊，廊里鼓座托穹顶，连廊带穹顶整体慢转（94:37396）；
             鼓楼顶成了平台，右前一架黄铜浑天仪慢转（tower.js 的 armillary）。
   2077：同一套石头。穹顶脚下的鼓座换成黄铜框玻璃廊（里头几处暖光），穹顶的肋改黄铜，尖上一只黄铜小飞艇风向标；
         门前的石晷台脚下、观测台台面用两色石板拼星图（黄铜嵌星）；石阶脚一根黄铜细杆托一盏猫球灯（94:112930 观星猫灯）；
         提灯换黄铜；读书屋门前加一道黄铜框玻璃门廊；Lv3 鼓楼平台右侧一段黄铜框玻璃窗廊靠着塔身。
         不加霓虹、全息、罩子、信标。
   待修：穹顶和浑天仪不转，穹顶缺一块铜板露出黑洞；望远镜耷拉下来；烟囱不冒烟；猫球灯灭；小旗歪倒；几块胸墙石掉在墙根。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2;
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.14, .13, .15], .45), FLOOR = mix3(C.stone, ST2, .55);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);          /* 烛光窗 */
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BRONZE = mix3(C.gold, C.wood, .38);
  const AGED = mix3(BRASS, [.32, .27, .21], .42);
  const IRON = C.iron, M = { mat: "metal" }, GL = { mat: "gloss" };
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35);
  const MULL = mix3(IRON, OAK, .3);
  const GLASS = mix3(C.glass, C.white, .2), LENS = mix3(C.tint, [.06, .07, .09], .35);
  /* 铜绿穹顶：C.roofG 往 C.metal 混，再分深浅几档，像风吹雨打的旧铜板 */
  const DOME = mix3(mix3(C.roofG, C.metal, .4), [.5, .56, .44], .35), DOME2 = mix3(DOME, [.25, .32, .27], .4), DOMEL = mix3(DOME, [.66, .7, .62], .3);
  const DOMEB = mix3(DOME, [.48, .4, .3], .45);            /* 还没长满铜绿的旧铜板 */
  const RIB = mix3(DOME2, [.2, .22, .2], .45);             /* 1994 的暗铜肋 */
  const SKYB = mix3(C.banner2, [.1, .12, .2], .35), SKYL = mix3(C.banner2, C.slate2, .35);   /* 长旗的深蓝底、星盘的蓝底 */
  const STAR2 = mix3(C.slate2, C.stone, .45);              /* 星图的第二色石板 */

  /* 鼓楼、鼓座、穹顶、观测台、读书屋、高塔的尺寸 */
  const DX = 0, DZ = -.2, DR = .75, Y0 = .1, YS = .22, YD = 1.4;   /* 鼓楼：中心、半径、墙脚、门槛、墙顶 */
  const PR0 = .79, PR1 = .89, PH = .15;                    /* 墙顶胸墙 */
  const TB = .64, TBH = .34, YDM = YD + TBH + .01, RD = .6;    /* 鼓座、穹顶底、穹顶半径 */
  const PX = 1.38, PZ = .06, PRR = .44, PHH = .72;         /* 观测台 */
  const HX = -1.34, HZ = -1.22, HRY = .45;                 /* 读书屋（左后，正面朝右前） */
  const TR = .48, YT = 3.8, RD3 = .48, CR0 = .67, CR1 = .77;   /* Lv3 高塔、塔顶观星廊 */
  /* build.h：最高点（穹顶尖饰，2077 是小飞艇风向标）＋.2 */
  const SX = .55, SZ = .88;                                 /* 石晷台 */
  const STA0 = -.45, STDA = -.31;                          /* 外挂石阶：起始角、每级转角（往左绕） */
  const SPIN = .08;

  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 9001 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pt = (cx, cz, a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r];   /* a = 0 朝 +z，PI/2 朝 +x */
  const angIn = (a, lo, hi) => { const d = ((a - lo) % TAU + TAU) % TAU; return d <= ((hi - lo) % TAU + TAU) % TAU; };

  function sc(y) {                                          /* 一块石头的颜色：深浅不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .5 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .9) c = mix3(c, STD, .4);
    const g = Math.max(0, Math.min(.3, (1.1 - y) * .22));
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
  function wedgeB(b, w, y, zIn, zOut, hIn, hOut, col, top) { /* 扶壁的一级：顶面斜收（当前坐标 z 朝外） */
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, cx, cz, R0, a, h) {
    b.at(cx, 0, cz, a);
    wedgeB(b, .21, -.04, R0 - .06, R0 + .3, h * .42, h * .3, mix3(ST2, STD, .35));
    wedgeB(b, .15, -.04, R0 - .06, R0 + .17, h, h * .86, mix3(ST, ST2, .5 + R() * .3));
    b.pop();
  }

  /* ---------- 尖拱 ---------- */
  function archPts(w, p, n) {                               /* 尖拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
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

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）一层层错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .18, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .1 : .19) : 0, q1 = o.qr ? ((j + ph) % 2 ? .19 : .1) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .2));
      while (x < Rr - (q1 ? q1 + .06 : .06)) { cuts.push(x); x += .17 + R() * .2; }
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
  function rwall(b, cx, cz, r, y0, y1, seg, rh, core) {     /* 圆墙身：一圈圈石砌，层层错半块；里头一根深色芯（顶面当平台） */
    const n = Math.max(1, Math.round((y1 - y0) / (rh || .18))), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU;
        b.quad(pt(cx, cz, a, r, ya), pt(cx, cz, a2, r, ya), pt(cx, cz, a2, r, yb), pt(cx, cz, a, r, yb), sc(ya));
      }
    }
    if (core !== false) b.cyl(cx, y0, cz, r * Math.cos(PI / seg) - .006, y1 - y0, seg, STD, { nb: true, a0: PI / seg, top: FLOOR });
  }
  function band(b, cx, cz, r, y, h, seg, col) { b.cyl(cx, y, cz, r, h, seg, col, { nt: true, nb: true, a0: PI / seg }); }
  function rcorbels(b, cx, cz, r, y, n, skip) {             /* 一圈小托石（两级） */
    for (let i = 0; i < n; i++) {
      const a = (i + .5) / n * TAU; if (skip && skip(a)) continue;
      b.at(cx, 0, cz, a); cbox(b, 0, y - .14, r - .02, .065, .07, r + .045, DRESS2); cbox(b, 0, y - .07, r - .02, .08, .07, r + .085, mix3(DRESS2, DRESS, .4)); b.pop();
    }
  }
  function bigCorbels(b, cx, cz, r, y, n, out) {            /* 塔顶的大托石：两级挑出 out */
    for (let i = 0; i < n; i++) {
      b.at(cx, 0, cz, (i + .5) / n * TAU);
      cbox(b, 0, y - .3, r - .02, .09, .12, r + out * .5, DRESS2);
      cbox(b, 0, y - .18, r - .02, .1, .16, r + out, mix3(DRESS2, DRESS, .4));
      b.pop();
    }
  }
  function parapetRing(b, cx, cz, r0, r1, y0, y1, seg, skip) {   /* 圆胸墙：外面两层石砌、内壁、压顶（略挑出）、底面；skip(a) 留口子 */
    const P = (a, r, y) => pt(cx, cz, a, r, y), hh = (y1 - y0) / 2;
    for (let i = 0; i < seg; i++) {
      const a = i / seg * TAU, a2 = (i + 1) / seg * TAU, m = (a + a2) / 2;
      if (skip && skip(m)) continue;
      for (let j = 0; j < 2; j++) { const ya = y0 + j * hh, yb = ya + hh; b.quad(P(a, r1, ya), P(a2, r1, ya), P(a2, r1, yb), P(a, r1, yb), sc(2)); }
      b.quad(P(a2, r0, y0), P(a, r0, y0), P(a, r0, y1), P(a2, r0, y1), ST2);
      b.quad(P(a, r1 + .015, y1), P(a2, r1 + .015, y1), P(a2, r0 - .01, y1), P(a, r0 - .01, y1), DRESS);
      b.quad(P(a, r0, y0), P(a2, r0, y0), P(a2, r1, y0), P(a, r1, y0), INNER);
      const sk = a3 => skip && skip(a3);
      if (sk(m - TAU / seg)) qf(b, P(a, r0, y0), P(a, r1, y0), P(a, r1, y1), P(a, r0, y1), DRESS2, [-Math.cos(a), 0, Math.sin(a)]);
      if (sk(m + TAU / seg)) qf(b, P(a2, r0, y0), P(a2, r1, y0), P(a2, r1, y1), P(a2, r0, y1), DRESS2, [Math.cos(a2), 0, -Math.sin(a2)]);
    }
  }
  function rmerlons(b, cx, cz, r, y, n, o) {                /* 一圈垛口 */
    o = o || {};
    for (let i = 0; i < n; i++) { const a = (i + .5) / n * TAU + (o.a0 || 0); b.at(cx, 0, cz, a); b.box(0, y, r - .05, o.mw || .12, o.mh || .15, .1, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS }); b.pop(); }
  }

  /* ---------- 窗、门、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .045, e = o.e != null ? o.e : .55, lit = o.lit !== false;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, lit ? WIN : INNER, lit ? { e } : undefined);
    if (lit) { b.panel(0, 0, .028, .016, h + archY(w, p, 0) * .8, MULL); b.panel(0, h * .55, .029, w, .014, MULL); }
    if (!o.nosill) b.box(0, -fr - .035, 0, w + fr * 2 + .05, .035, .09, DRESS);
    if (o.hood) {
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .06, p, 3), zh = .04;
      for (let i = 0; i < ai.length - 1; i++) b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
      for (const s of [-1, 1]) b.panel(s * (w / 2 + fr + .015), h - .06, .042, .045, .07, DRESS);
    }
    b.pop();
  }
  function slit(b, x, y, z) {                               /* 窄缝窗 */
    b.panel(x, y - .03, z + .002, .07, .26, DRESS2);
    b.panel(x, y, z + .004, .025, .2, INNER);
  }
  function door(b, w, h, p) {                               /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    for (let i = 1; i < 5; i++) { const x = -w / 2 + i * w / 5; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, dark); }
    for (const y of [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 3, y + .006, .0125, .016, .016, C.metal, M);
    }
    b.box(w * .22, h * .5, .012, .03, .045, .014, IRON, M);
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
  function lampPost(b, x, z, h, cy) {                       /* 铁灯柱：石座、细柱、弯臂、一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, -.04, z, .06, .1, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .03, fr, fo);
    b.beam([x, h, z], [x + .12, h + .02, z], .018, fr, fo);
    b.beam([x + .12, h + .02, z], [x + .12, h - .04, z], .01, fr, fo);
    lantern(b, x + .12, h - .3, z, cy);
  }
  function flag(b, x, y, z, col, h) {                       /* 小旗：铁杆、金球、随风摆的尖角旗 */
    h = h || .6;
    b.beam([x, y - .1, z], [x, y + h, z], .02, IRON, M);
    b.sphere(x, y + h + .02, z, .028, 4, C.gold, M);
    const L = .34, Hh = .15, top = y + h - .04, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .012 + L * t0, x1 = x + .012 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .45) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
  }
  function star4(b, x, y, z, r, col, o) {                   /* 四角星（面朝 +z） */
    const p = []; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, rr = i % 2 ? r * .32 : r; p.push([x + Math.sin(a) * rr, y + Math.cos(a) * rr]); }
    for (let i = 0; i < 8; i++) b.tri([x, y, z], [p[i][0], p[i][1], z], [p[(i + 1) % 8][0], p[(i + 1) % 8][1], z], col, o);
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、尖底布条、金边、四角金星 */
    b.beam([x - w / 2 - .035, yt + .012, z + .035], [x + w / 2 + .035, yt + .012, z + .035], .02, IRON, M);
    b.at(x, yt, z + .015);
    fan(b, [[-w / 2, -h + .09], [0, -h], [w / 2, -h + .09], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .02, -h + .1, .003, .012, h - .13, C.gold, M);
    b.panel(w / 2 - .02, -h + .1, .003, .012, h - .13, C.gold, M);
    b.panel(0, -.065, .003, w - .02, .012, C.gold, M);
    star4(b, 0, -h * .45, .004, w * .3, C.gold, M);
    star4(b, -w * .22, -h * .72, .004, w * .09, mix3(C.gold, C.cream, .4), M);
    star4(b, w * .2, -h * .2, .004, w * .08, mix3(C.gold, C.cream, .4), M);
    b.pop();
  }
  function ivyR(b, cx, cz, r, a, y0, y1, spread, n) {       /* 圆墙上的常春藤：一簇簇小叶片贴墙，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), aa = a + (R() - .5) * spread * (1 - v * .6), y = y0 + v * (y1 - y0), s = .03 + R() * .03;
      b.at(cx, 0, cz, aa);
      fan(b, [[0 - s, y], [0, y - s], [0 + s, y], [0, y + s]], r + .012 + R() * .012, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
      b.pop();
    }
  }
  function ivyF(b, x, y0, z, w, h, n) {                     /* 平墙上的常春藤 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function pinnacle(b, x, y, z) {                           /* 胸墙上的小尖饰：方座、四坡尖、小球 */
    b.box(x, y, z, .08, .13, .08, mix3(ST2, DRESS2, .3 + R() * .3), { nb: true, top: DRESS2 });
    b.pyramid(x, y + .13, z, .095, .095, .17, mix3(ST2, STD, .25));
  }

  /* ---------- 2077 小件 ---------- */
  function catLamp(b, x, z, h, off) {                       /* 黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, -.05, z, .045, .08, 6, DRESS2);
    b.beam([x, 0, z], [x, h, z], .022, BRASS, M);
    b.beam([x, h, z], [x + .1, h + .06, z], .016, BRASS, M);
    b.beam([x + .1, h + .06, z], [x + .16, h + .03, z], .014, BRASS, M);
    b.sphere(x, h + .01, z, .025, 4, BRASS, M);
    if (!off) b.emit(x + .16, h - .1, z, "cat", 1, .8);
  }
  function airshipVane(b, x, y, z, h, ry) {                 /* 小飞艇风向标：铁杆、方位十字、一只黄铜小飞艇 */
    b.beam([x, y - .04, z], [x, y + h, z], .016, IRON, M);
    b.beam([x - .07, y + h * .45, z], [x + .07, y + h * .45, z], .01, IRON, M);
    b.beam([x, y + h * .45, z - .07], [x, y + h * .45, z + .07], .01, IRON, M);
    b.at(x, y + h + .045, z, ry);
    b.at(0, 0, 0, 0, [.4, .4, 1]); b.sphere(0, 0, 0, .12, 6, mix3(C.cream, C.stone, .3), GL); b.pop();
    for (const dz of [-.05, .05]) { b.at(0, 0, dz, 0, 1, PI / 2); b.cyl(0, -.004, 0, .05, .008, 6, BRASS, { nt: true, nb: true, mat: "gloss" }); b.pop(); }
    b.box(0, -.075, .02, .024, .022, .055, BRASS, GL);
    b.box(0, .035, -.1, .006, .05, .045, BRASS, GL); b.box(0, -.055, -.1, .006, .03, .04, BRASS, GL);
    b.box(0, 0, -.1, .08, .006, .04, BRASS, GL);
    b.pop();
  }
  function starChart(b, x, y, z, r, cy) {                   /* 两色石板拼的星图：十六瓣两色石、外圈料石带、八角星（2077 黄铜嵌）、几颗小星 */
    const P = (a, rr, yy) => [x + Math.sin(a) * rr, yy, z + Math.cos(a) * rr], n = 16, up = [0, 1, 0];
    for (let i = 0; i < n; i++) { const a = i / n * TAU, a2 = (i + 1) / n * TAU; qf(b, [x, y, z], P(a, r * .84, y), P(a2, r * .84, y), P(a2, r * .84, y), i % 2 ? FLOOR : STAR2, up); }
    for (let i = 0; i < n; i++) { const a = i / n * TAU, a2 = (i + 1) / n * TAU; qf(b, P(a, r * .84, y), P(a, r, y), P(a2, r, y), P(a2, r * .84, y), i % 2 ? DRESS : DRESS2, up); }
    const sc2 = cy ? AGED : DRESS, so = cy ? GL : undefined, pts = [];
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + TAU / 32, rr = i % 2 ? r * .26 : (i % 4 ? r * .5 : r * .72); pts.push(P(a, rr, y + .004)); }
    for (let i = 0; i < 16; i++) qf(b, [x, y + .004, z], pts[i], pts[(i + 1) % 16], pts[(i + 1) % 16], sc2, up, so);
    for (let i = 0; i < 5; i++) {
      const a = R() * TAU, rr = r * (.55 + R() * .25), [sx, , sz] = P(a, rr, 0), s = .018 + R() * .015;
      qf(b, [sx - s, y + .005, sz], [sx, y + .005, sz - s], [sx + s, y + .005, sz], [sx, y + .005, sz + s], sc2, up, so);
    }
  }

  /* ---------- 天文器具 ---------- */
  function scopeTube(b, p, d, t0, t1, r, cy) {              /* 镜筒：从 p 沿 d 的 t0 到 t1；遮光罩、镜片、两道箍 */
    const at = t => [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t], tc = cy ? BRASS : mix3(BRASS, IRON, .35), to = cy ? GL : M;
    tube(b, at(t0), at(t1 - .14), r * .86, r, tc, to, 8);
    tube(b, at(t1 - .16), at(t1), r * 1.22, r * 1.22, mix3(tc, IRON, .45), { mat: "metal", nt: false, top: LENS }, 8);
    for (const t of [t0 + (t1 - t0) * .35, t0 + (t1 - t0) * .62]) tube(b, at(t - .015), at(t + .015), r * 1.1, r * 1.1, IRON, M, 8);
  }
  function domeShell(b, rd, ns, nr, o) {                    /* 穹顶（本地坐标，底面中心为原点）：一瓣瓣铜板、竖缝（k=0，朝本地 +z）、肋；o.hole 缺一块 */
    const P = (e, a, r) => [Math.sin(a) * Math.cos(e) * r, Math.sin(e) * r, Math.cos(a) * Math.cos(e) * r];
    const da = TAU / ns, ri = rd * .84, ribC = o.cy ? BRASS : RIB, ribO = o.cy ? GL : M;
    const slitTop = nr - 1;
    for (let k = 0; k < ns; k++) {
      const a0 = (k - .5) * da, a1 = a0 + da, am = k * da, streak = R();
      for (let j = 0; j < nr; j++) {
        const e0 = j / nr * PI / 2, e1 = (j + 1) / nr * PI / 2, em = (e0 + e1) / 2, out = P(em, am, 1);
        const isSlit = k === 0 && j < slitTop, isHole = o.hole && o.hole[0] === k && o.hole[1] === j;
        if (isSlit || isHole) {
          const ic = isSlit && j < 2 && !o.bad ? mix3(WIN, INNER, .78) : INNER, io = isSlit && j < 2 && !o.bad ? { e: .3 } : undefined;
          qf(b, P(e0, a0, ri), P(e0, a1, ri), P(e1, a1, ri), P(e1, a0, ri), ic, out, io);
          qf(b, P(e0, a0, rd), P(e1, a0, rd), P(e1, a0, ri), P(e0, a0, ri), mix3(DOME2, INNER, .5), [Math.cos(a0), 0, -Math.sin(a0)]);
          qf(b, P(e0, a1, rd), P(e1, a1, rd), P(e1, a1, ri), P(e0, a1, ri), mix3(DOME2, INNER, .5), [-Math.cos(a1), 0, Math.sin(a1)]);
          if (isSlit && j === slitTop - 1) qf(b, P(e1, a0, rd), P(e1, a1, rd), P(e1, a1, ri), P(e1, a0, ri), mix3(DOME2, INNER, .5), [0, -1, 0]);
          continue;
        }
        const r0 = R(), base = streak < .22 ? DOME2 : streak > .82 ? DOMEL : DOME;
        const col = r0 < .14 ? mix3(base, DOME2, .6) : r0 > .9 ? mix3(base, DOMEB, .55) : r0 > .78 ? mix3(base, DOMEL, .5) : mix3(base, j % 2 ? DOME : DOME2, .15 + r0 * .2);
        qf(b, P(e0, a0, rd), P(e0, a1, rd), P(e1, a1, rd), P(e1, a0, rd), col, out);
      }
    }
    /* 肋：每隔一瓣一道，竖缝两边各一道 */
    const w = .03, hgt = .018;
    for (let k = 0; k < ns; k++) {
      if (k % 2 && k !== 1) continue;
      const a = (k - .5) * da, t = [Math.cos(a), 0, -Math.sin(a)], jn = (k === 0 || k === 1) ? slitTop : nr;
      for (let j = 0; j < jn; j++) {
        const e0 = j / nr * PI / 2, e1 = (j + 1) / nr * PI / 2, n0 = P(e0, a, 1), n1 = P(e1, a, 1);
        const B0 = P(e0, a, rd), B1 = P(e1, a, rd);
        const off = (B, n, s, h) => [B[0] + n[0] * h + t[0] * s * w / 2, B[1] + n[1] * h + t[1] * s * w / 2, B[2] + n[2] * h + t[2] * s * w / 2];
        const T0 = off(B0, n0, 0, hgt), T1 = off(B1, n1, 0, hgt);   /* 肋做成一道两坡的脊 */
        const L0 = off(B0, n0, -1, 0), R0 = off(B0, n0, 1, 0), L1 = off(B1, n1, -1, 0), R1 = off(B1, n1, 1, 0);
        const nm = P((e0 + e1) / 2, a, 1);
        qf(b, L0, T0, T1, L1, ribC, [nm[0] - t[0], nm[1] - t[1], nm[2] - t[2]], ribO);
        qf(b, R0, T0, T1, R1, ribC, [nm[0] + t[0], nm[1] + t[1], nm[2] + t[2]], ribO);
      }
    }
    /* 底边一道铜箍 */
    b.cyl(0, -.005, 0, rd + .022, .055, ns, o.cy ? BRASS : RIB, { nt: true, nb: true, a0: PI / ns, mat: o.cy ? "gloss" : "metal" });
  }
  function domeTop(b, y, cy, s) {                           /* 穹顶尖上的小铜亭：铜座、四面小窗、铜帽、铜球；1994 铁尖饰挂小星，2077 小飞艇风向标 */
    s = s || 1;
    b.at(0, y, 0, 0, s);
    b.cyl(0, -.03, 0, .105, .06, 8, cy ? BRASS : RIB, cy ? GL : M);
    b.cyl(0, .03, 0, .074, .11, 8, DOME2, { nb: true, nt: true });
    for (let i = 0; i < 4; i++) { b.at(0, 0, 0, i * PI / 2 + PI / 4); b.panel(0, .05, .07, .03, .065, INNER); b.pop(); }
    b.cone(0, .14, 0, .1, .1, 8, DOMEL, { nb: true });
    b.sphere(0, .25, 0, .024, 5, cy ? BRASS : BRONZE, cy ? GL : M);
    if (cy) airshipVane(b, 0, .27, 0, .13, 1.1);
    else {
      b.beam([0, .26, 0], [0, .46, 0], .014, IRON, M);
      b.at(0, .4, 0, .4); star4(b, 0, 0, .004, .045, BRONZE, M); b.at(0, 0, 0, PI); star4(b, 0, 0, .004, .045, BRONZE, M); b.pop(); b.pop();
    }
    b.pop();
  }
  /* 转动的穹顶（本地坐标）：铜箍、穹顶、竖缝里伸出的望远镜、顶上的铜亭 */
  function dome(b, rd, o) {
    domeShell(b, rd, 18, o.nr || 6, o);
    const el = o.bad ? .2 : .64, d = [0, Math.sin(el), Math.cos(el)];
    scopeTube(b, [0, rd * .16, 0], d, rd * .62, rd * 1.5, rd * .1, o.cy);
    domeTop(b, rd - .02, o.cy, rd / RD);
  }
  function tambour(b, cx, y, cz, r, h, cy, seg) {           /* 穹顶下的鼓座：1994 石砌、几扇小烛光窗；2077 黄铜框玻璃廊，里头几处暖光 */
    b.cyl(cx, y, cz, r + .035, .05, seg, DRESS2, { nb: true, top: FLOOR, a0: PI / seg });
    const y0 = y + .05, y1 = y + h - .03;
    if (!cy) {
      rwall(b, cx, cz, r, y0, y1, seg, .11, false);
      b.cyl(cx, y0, cz, r * Math.cos(PI / seg) - .006, y1 - y0, seg, STD, { nb: true, nt: true, a0: PI / seg });
      for (let i = 0; i < 6; i++) { b.at(cx, 0, cz, (i + .5) / 6 * TAU); b.panel(0, y0 + .04, r + .004, .07, y1 - y0 - .08, DRESS2); b.panel(0, y0 + .055, r + .008, .04, y1 - y0 - .11, WIN, { e: .45 }); b.pop(); }
    } else {
      b.cyl(cx, y0, cz, r - .07, y1 - y0, seg, INNER, { nb: true, nt: true });
      for (let i = 0; i < 4; i++) { b.at(cx, 0, cz, (i + .3) / 4 * TAU); b.panel(0, y0 + .02, r - .066, .12, y1 - y0 - .05, mix3(WIN, INNER, .25), { e: .35 }); b.pop(); }
      b.cyl(cx, y0, cz, r, y1 - y0, seg, GLASS, { nb: true, nt: true, mat: "glass" });
      for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * TAU; b.beam(pt(cx, cz, a, r + .01, y0), pt(cx, cz, a, r + .01, y1), .018, BRASS, GL); }
    }
    b.cyl(cx, y1, cz, r + .03, .03, seg, cy ? BRASS : DRESS2, { nb: true, top: cy ? BRASS : DRESS, mat: cy ? "gloss" : "matte" });
  }
  function armillary(b, x, y, z, Rr, o) {                   /* 黄铜浑天仪：石座上，几道铜环绕轴慢转（待修时不转） */
    b.cyl(x, y, z, Rr * .6, .06, 8, DRESS2, { top: DRESS });
    b.cyl(x, y + .06, z, Rr * .24, Rr * .9, 6, DRESS, { r2: Rr * .17 });
    b.cyl(x, y + .06 + Rr * .9, z, Rr * .34, .03, 8, BRASS, GL);
    const yc = y + .09 + Rr * 2.1;
    b.beam([x - Rr * 1.1, y + .09 + Rr * .9, z], [x - Rr * 1.1, yc, z], .018, BRASS, GL);
    b.beam([x - Rr * 1.1, y + .09 + Rr * .9, z], [x, y + .09 + Rr * .9, z], .018, BRASS, GL);
    const fn = sb => {
      sb.at(0, 0, 0, 0, 1, .4);
      sb.beam([0, -Rr * 1.3, 0], [0, Rr * 1.3, 0], .016, BRASS, GL);
      sb.torus(0, 0, 0, Rr, .013, 10, 3, BRASS, GL);
      sb.at(0, 0, 0, 0, 1, PI / 2); sb.torus(0, 0, 0, Rr, .013, 10, 3, BRASS, GL); sb.pop();
      sb.at(0, 0, 0, PI / 2, 1, PI / 2); sb.torus(0, 0, 0, Rr * .97, .011, 10, 3, BRASS, GL); sb.pop();
      sb.at(0, 0, 0, 0, 1, .41); sb.torus(0, 0, 0, Rr * .92, .02, 12, 3, mix3(BRASS, C.banner, .25), GL); sb.pop();
      sb.sphere(0, 0, 0, Rr * .2, 6, mix3(BRASS, C.banner2, .35), GL);
      sb.pop();
    };
    if (o.bad) { b.at(x, yc, z, .8, 1, 0, .35); fn(b); b.pop(); } else b.spin(x, yc, z, "y", .18, fn);
  }
  function refractor(b, x, y, z, ry, o) {                   /* 赤道仪上的大黄铜折射望远镜：八角石墩、铁极轴座、赤纬轴、配重杆、镜筒、寻星镜、目镜 */
    const cy = o.cy, tc = cy ? BRASS : mix3(BRASS, IRON, .2), to = GL;
    b.at(x, y, z, ry);
    b.cyl(0, 0, 0, .13, .05, 8, DRESS2, { top: DRESS });
    b.cyl(0, .05, 0, .085, .26, 8, DRESS, { r2: .07 });
    b.cyl(0, .31, 0, .1, .035, 8, IRON, M);
    tube(b, [0, .34, .05], [0, .46, -.06], .045, .045, IRON, M, 6);      /* 极轴座，朝本地 −z 斜上 */
    b.at(0, .48, -.07, 0, 1, o.bad ? .15 : -.62);                         /* 赤纬轴的坐标：本地 z 是镜筒方向 */
    tube(b, [-.2, 0, 0], [.1, 0, 0], .022, .022, IRON, M, 6);           /* 配重杆 + 赤纬轴 */
    tube(b, [-.24, 0, 0], [-.17, 0, 0], .06, .06, IRON, { mat: "metal", nt: false, nb: false }, 8);
    tube(b, [.13, 0, -.48], [.13, 0, .58], .042, .05, tc, to, 8);
    tube(b, [.13, 0, .5], [.13, 0, .7], .062, .062, mix3(tc, IRON, .4), { mat: "metal", nt: false, top: LENS }, 8);
    for (const zz of [-.12, .16]) { tube(b, [.13, 0, zz - .02], [.13, 0, zz + .02], .058, .058, IRON, M, 8); b.box(.065, -.02, zz - .015, .07, .04, .03, IRON, M); }
    tube(b, [.13, 0, -.62], [.13, 0, -.48], .024, .028, IRON, M, 6);      /* 调焦座 */
    tube(b, [.13, 0, -.62], [.13, -.06, -.66], .012, .016, mix3(tc, IRON, .5), to, 6);   /* 目镜 */
    tube(b, [.13, .085, -.22], [.13, .085, .12], .016, .02, tc, to, 6);   /* 寻星镜 */
    for (const zz of [-.15, .05]) b.beam([.13, .04, zz], [.13, .07, zz], .01, IRON, M);
    b.pop();
    b.pop();
  }

  /* ================= 鼓楼 ================= */
  const stairTop = a => angIn(a, STA0 + STDA * 9 - .04, STA0 + STDA * 8 + .02);   /* 石阶最上一级接走道的口子 */
  function drum(b, o) {
    const cy = o.cy, lv = o.lv;
    /* 勒脚 */
    b.cyl(DX, -.12, DZ, DR + .15, .24, 20, mix3(ST2, STD, .45), { r2: DR + .06, nb: true, top: DRESS2, a0: PI / 20 });
    rwall(b, DX, DZ, DR, Y0, YD, 20, .17);
    band(b, DX, DZ, DR + .022, 1.06, .05, 20, DRESS2);
    /* 扶壁（避开门、石阶、观测台） */
    for (const a of [.6, 1.27, 2.02, 2.76]) buttress(b, DX, DZ, DR, a, 1.0);
    /* 墙顶：托石、走道、胸墙（石阶上来处开口）、四座小尖饰 */
    rcorbels(b, DX, DZ, DR, YD, 16, stairTop);
    b.ring(DX, YD + .002, DZ, PR0 + .005, DR * .95, 20, FLOOR);
    parapetRing(b, DX, DZ, PR0, PR1, YD - .06, YD + PH, 22, stairTop);
    for (const a of [.62, 2.05, -.95, -2.2]) { const [x, , z] = pt(DX, DZ, a, (PR0 + PR1) / 2, 0); pinnacle(b, x, YD + PH, z); }
    /* 正面：料石门券、铁钉木门、三级石阶、两盏提灯、星纹长旗 */
    b.at(DX, 0, DZ);
    b.at(0, YS, DR - .03); archRing(b, .28, .36, .62, .065, 0, .07); b.at(0, 0, .02); door(b, .28, .36, .62); b.pop(); b.pop();
    for (let i = 0; i < 3; i++) { const yt = YS - i * .07, zf = DR + .14 + i * .11; b.box(0, -.1, (DR + zf) / 2 - .02, .54 + i * .06, yt + .1, zf - DR + .04, mix3(ST2, STD, .25 + R() * .2), { top: i % 2 ? DRESS2 : DRESS, nb: true }); }
    banner(b, 0, 1.24, DR - .005, .2, .32, SKYB);
    b.pop();
    for (const s of [-1, 1]) { b.at(DX, 0, DZ, s * .4); wallLantern(b, 0, .92, DR - .01, cy); b.pop(); }
    /* 窗 */
    for (const [a, y, w, h] of [[.93, .5, .14, .32], [1.64, .55, .14, .32], [2.4, .5, .14, .3], [-PI + .1, .45, .13, .3]]) { b.at(DX, 0, DZ, a); lancet(b, 0, y, DR - .005, w, h, { hood: 1 }); b.pop(); }
    for (const [a, y] of [[-1.25, .95], [-2.0, .3]]) { b.at(DX, 0, DZ, a); slit(b, 0, y, DR - .005); b.pop(); }
    /* 外挂石阶：左前起步，往左绕到后边上墙顶 */
    spiralStair(b, DX, DZ, DR, Y0 - .1, YD, STA0, STDA, 9);
    /* 常春藤 */
    ivyR(b, DX, DZ, DR, -1.75, Y0, 1.05, .9, 44);
    ivyR(b, DX, DZ, DR, 1.95, Y0, .8, .5, 22);
    /* 后边胸墙上的小旗 */
    const fa = -2.6, [fx, , fz] = pt(DX, DZ, fa, (PR0 + PR1) / 2, 0);
    if (o.bad) { b.at(fx, YD + PH, fz, 0, 1, .4, .5); flag(b, 0, 0, 0, C.banner2, .42); b.pop(); } else flag(b, fx, YD + PH, fz, C.banner2, .42);
  }
  function spiralStair(b, cx, cz, R0, y0, y1, a0, da, n) {  /* 外挂石阶：一级级石踏步从墙身挑出，绕墙而上；铁扶手 */
    const rise = (y1 - y0) / n, dep = .29;
    let prev = null;
    for (let i = 0; i < n; i++) {
      const a = a0 + (i + .5) * da, yT = y0 + rise * (i + 1), r = R0 - .02, rm = r + dep / 2, tw = 2 * (r + dep) * Math.sin(Math.abs(da) / 2) + .02;
      const sh = yT < .5 ? yT + .1 : .16, c = mix3(STD, ST2, .25 + R() * .4);
      b.at(cx, 0, cz, a);
      b.box(0, yT - sh, rm, tw, sh, dep, c, { top: mix3(DRESS2, FLOOR, R() * .6), nb: yT < .5 });
      if (i % 2 === 1 && yT > .6) cbox(b, 0, yT - .38, r - .02, .09, .2, r + .16, ST2);
      b.pop();
      if (i % 2 === 0 || i === n - 1) {
        const p = pt(cx, cz, a, r + dep - .035, yT), q = [p[0], yT + .3, p[2]];
        b.beam(p, q, .02, IRON, M);
        if (prev) b.beam(prev, q, .02, IRON, M);
        prev = q;
      }
    }
  }
  function sundial(b, cy) {                                 /* 门前的石晷台：石座、柱身、刻星图的晷盘、铜晷针 */
    if (cy) starChart(b, SX, .012, SZ, .44, cy);
    b.at(SX, 0, SZ, .35);
    b.cyl(0, -.04, 0, .25, .08, 8, ST2, { top: FLOOR, a0: .3 });
    b.cyl(0, .04, 0, .095, .2, 8, DRESS2, { r2: .07, nb: true });
    b.cyl(0, .22, 0, .07, .03, 8, DRESS, { r2: .2, nb: true });
    b.cyl(0, .25, 0, .2, .04, 12, DRESS2, { top: DRESS, nb: true });
    const y = .292, up = [0, 1, 0], LINE = mix3(STD, INNER, .4);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, a2 = (i + 1) / 12 * TAU; qf(b, [Math.sin(a) * .172, y, Math.cos(a) * .172], [Math.sin(a) * .156, y, Math.cos(a) * .156], [Math.sin(a2) * .156, y, Math.cos(a2) * .156], [Math.sin(a2) * .172, y, Math.cos(a2) * .172], LINE, up); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TAU / 16, c = Math.cos(a), s = Math.sin(a), w = .006; qf(b, [s * .1 - c * w, y, c * .1 + s * w], [s * .1 + c * w, y, c * .1 - s * w], [s * .152 + c * w, y, c * .152 - s * w], [s * .152 - c * w, y, c * .152 + s * w], LINE, up); }
    const pts = []; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? .022 : (i % 4 ? .045 : .075); pts.push([Math.sin(a) * rr, y + .001, Math.cos(a) * rr]); }
    for (let i = 0; i < 16; i++) qf(b, [0, y + .001, 0], pts[i], pts[(i + 1) % 16], pts[(i + 1) % 16], BRONZE, up, M);
    b.tri([0, y, -.09], [0, y, .07], [0, y + .095, -.09], BRONZE, M); b.tri([0, y, .07], [0, y, -.09], [0, y + .095, -.09], BRONZE, M);
    b.pop();
  }

  /* ================= Lv2：露天观测台、读书屋 ================= */
  function platform(b, o) {
    const cy = o.cy, a0 = PI / 14;
    b.cyl(PX, -.12, PZ, PRR + .09, .22, 14, mix3(ST2, STD, .45), { r2: PRR + .03, nb: true, top: DRESS2, a0 });
    rwall(b, PX, PZ, PRR, .08, PHH - .1, 14, .16);
    b.cyl(PX, PHH - .1, PZ, PRR + .035, .04, 14, mix3(DRESS2, ST2, .4), { nb: true, top: DRESS2, a0 });     /* 线脚 */
    b.cyl(PX, PHH - .06, PZ, PRR + .07, .06, 14, mix3(DRESS2, ST2, .3), { top: cy ? FLOOR : mix3(FLOOR, DRESS2, .3), a0 });
    if (cy) starChart(b, PX, PHH + .003, PZ, PRR - .02, cy);
    else { b.ring(PX, PHH + .003, PZ, PRR - .05, PRR - .1, 14, mix3(FLOOR, STD, .3)); b.ring(PX, PHH + .003, PZ, .16, .12, 10, mix3(FLOOR, STD, .3)); }
    /* 石栏杆：立柱、瓶柱、扶手；正面留口 */
    const rB = PRR + .03, n = 12, yB = PHH, hB = .22, gap = a => angIn(a, -.3, .3);
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, a2 = (i + 1) / n * TAU, m = (a + a2) / 2;
      if (!gap(a)) { const [x, , z] = pt(PX, PZ, a, rB, 0); b.box(x, yB, z, .055, hB + .02, .055, mix3(DRESS2, ST2, .35), { nb: true, top: DRESS2 }); b.pyramid(x, yB + hB + .02, z, .065, .065, .05, DRESS2); }
      if (gap(m)) continue;
      b.at(PX, 0, PZ, m);
      const ch = 2 * rB * Math.sin(PI / n);
      b.box(0, yB + hB - .03, rB * Math.cos(PI / n), ch, .03, .06, DRESS2, { nb: true, top: DRESS });
      for (const s of [-.25, .25]) b.cyl(s * ch, yB, rB * Math.cos(PI / n), .017, hB - .03, 4, mix3(DRESS2, ST2, .3), { nb: true, nt: true, r2: .023 });
      b.pop();
    }
    /* 正面一道窄石阶（一级级实砌），两边铁扶手；台阶脚一根铁灯柱 */
    const zs = PZ + PRR + .02, ns = 5, L = .38, w = .24;
    for (let i = 0; i < ns; i++) { const z0 = zs + i * L / ns, yt = PHH * (ns - i) / ns; b.box(PX, -.06, z0 + L / ns / 2 - .02, w, yt + .06, L / ns + .05, mix3(ST2, STD, .25 + R() * .3), { top: i % 2 ? FLOOR : DRESS2, nb: true }); }
    for (const s of [-1, 1]) {
      const x = PX + s * (w / 2 - .02), P0 = [x, PHH + .24, zs - .02], P1 = [x, .3, zs + L - .04];
      b.beam([x, PHH, zs - .02], P0, .018, IRON, M); b.beam([x, .05, zs + L - .04], P1, .018, IRON, M); b.beam(P0, P1, .016, IRON, M);
    }
    lampPost(b, PX + w / 2 + .14, zs + .26, .74, cy);
    /* 赤道仪 + 大折射望远镜 */
    refractor(b, PX - .02, PHH, PZ - .02, 2.35, o);
    b.at(PX, 0, PZ, PI * .75); ivyR(b, 0, 0, PRR, 0, .08, .55, .7, 16); b.pop();
  }
  function slateRoof(b, hw, d, ye, yr, ov, eo) {            /* 人字石板瓦顶：屋脊沿 x，两坡一道道瓦，每片深浅不一；檐板、脊瓦 */
    for (const s of [-1, 1]) {
      const nC = 5, P = (u, v) => [-hw - ov + (2 * hw + 2 * ov) * u, ye + (yr - ye) * v, s * (d + eo) * (1 - v)];
      for (let i = 0; i < nC; i++) {
        const v0 = i / nC, v1 = Math.min(1, (i + 1) / nC + .03), m = 5;
        let u0 = 0;
        for (let k = 0; k < m; k++) {
          const u1 = k === m - 1 ? 1 : (k + 1 + (R() - .5) * .5) / m, rr = R(), base = i % 2 ? SL : SL2;
          const col = rr < .2 ? mix3(base, SLD, .55) : rr > .85 ? mix3(base, [.5, .52, .56], .15) : mix3(base, SLD, rr * .25);
          qf(b, P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1), col, [0, 1, s * 1.2]);
          u0 = u1;
        }
      }
      qf(b, P(0, 0), P(1, 0), [hw + ov, ye - .05, s * (d + eo)], [-hw - ov, ye - .05, s * (d + eo)], OAK, [0, 0, s]);
    }
    b.beam([-hw - ov - .01, yr, 0], [hw + ov + .01, yr, 0], .055, SLD);
    for (const s of [-1, 1]) {                                /* 山墙边的封檐板 */
      const x = s * (hw + ov);
      qf(b, [x, ye - .05, d + eo], [x, yr, 0], [x, yr - .06, 0], [x, ye - .1, d + eo], OAK2, [s, 0, 0]);
      qf(b, [x, ye - .05, -d - eo], [x, yr, 0], [x, yr - .06, 0], [x, ye - .1, -d - eo], OAK2, [s, 0, 0]);
    }
  }
  function readingHouse(b, o) {                             /* 读书屋：石砌小屋、陡石板瓦人字顶、尖拱门、烛光窗、山墙圆窗、石烟囱；门边长凳上一摞书 */
    const cy = o.cy, W = .36, D = .25, EH = .68, RH = 1.18, Y = .04;
    b.at(HX, 0, HZ, HRY);
    b.box(0, -.1, 0, 2 * W + .08, .14, 2 * D + .08, mix3(ST2, STD, .4), { nb: true, top: DRESS2 });
    for (const [z, back] of [[D, false], [-D, true]]) mason(b, () => [-W, W], Y, EH, z, { back, ql: 1, qr: 1 });
    for (const s of [-1, 1]) {
      b.at(0, 0, 0, s * PI / 2);
      mason(b, y => y < EH ? [-D, D] : [-D * (RH - y) / (RH - EH), D * (RH - y) / (RH - EH)], Y, RH - .02, W, { ql: 1, qr: 1, rh: .17 });
      b.pop();
    }
    b.box(0, Y, 0, 2 * W - .02, EH - Y, 2 * D - .02, INNER, { nb: true });
    slateRoof(b, W, D, EH - .02, RH + .02, .07, .1);
    /* 正面：尖拱门、烛光窗；背面一扇小窗 */
    b.at(-.13, Y, D - .005); archRing(b, .19, .3, .62, .045, 0, .045); b.at(0, 0, .01); door(b, .19, .3, .62); b.pop(); b.pop();
    lancet(b, .17, .27, D - .005, .13, .22, { hood: 1 });
    b.at(0, 0, 0, PI); lancet(b, 0, .3, D - .005, .12, .2); b.pop();
    /* 右山墙：圆窗、墙脚常春藤；左山墙：石烟囱 */
    b.at(0, 0, 0, PI / 2); ivyF(b, -.12, Y, W, .3, .45, 18);
    b.at(0, .86, W + .01, 0, 1, PI / 2);
    b.cyl(0, 0, 0, .1, .03, 12, DRESS2, { top: DRESS });
    b.cyl(0, .03, 0, .072, .004, 12, WIN, { e: .5, nb: true });
    b.box(-.074, .034, -.006, .148, .006, .012, MULL); b.box(-.006, .034, -.074, .012, .006, .148, MULL);
    b.pop();
    b.pop();
    const chx = -W - .07, CH = mix3(ST2, STD, .25);
    b.box(chx, -.04, -.04, .16, 1.38, .2, CH, { nb: true, top: STD });
    b.box(chx, .66, -.04, .19, .05, .23, mix3(DRESS2, ST2, .4), { nb: true });
    b.box(chx, 1.32, -.04, .2, .05, .24, mix3(DRESS2, ST2, .4), { top: STD });
    for (const dz of [-.05, .04]) b.cyl(chx, 1.37, -.04 + dz, .028, .06, 6, mix3(C.roofR, ST2, .65), { top: [.12, .1, .1] });
    b.at(0, 0, 0, -PI / 2); ivyF(b, .2, Y, W, .2, .5, 12); b.pop();
    if (!o.bad) b.emit(chx, 1.5, -.04, "smoke", 6, .8);
    /* 门边长凳、一摞书 */
    b.box(-.06 + .3, .0, D + .17, .02, .14, .08, OAK); b.box(.18 + .3, .0, D + .17, .02, .14, .08, OAK);
    b.box(.06 + .3, .14, D + .17, .32, .03, .1, OAK2, { top: mix3(OAK2, C.woodL, .3) });
    const BK = [C.banner, C.banner2, mix3(C.leafD, C.woodD, .3), mix3(C.cream, C.hay, .3)];
    for (let i = 0; i < 4; i++) b.at(.32 + (R() - .5) * .02, .17 + i * .028, D + .17, (R() - .5) * .5).box(0, 0, 0, .1 - i * .01, .026, .07, BK[i], { top: i === 3 ? C.cream : BK[i] }).pop();
    if (cy) {                                                /* 2077：门前一道黄铜框玻璃门廊，屋脊一只小飞艇风向标 */
      const x0 = -.36, x1 = .04, z0 = D, z1 = D + .26, yF = .5, yB = .6, Gm = { mat: "glass" };
      qf(b, [x0, Y, z1], [x1, Y, z1], [x1, yF, z1], [x0, yF, z1], GLASS, [0, 0, 1], Gm);
      for (const x of [x0, x1]) qf(b, [x, Y, z0], [x, Y, z1], [x, yF, z1], [x, yB, z0], GLASS, [x === x0 ? -1 : 1, 0, 0], Gm);
      qf(b, [x0, yB, z0], [x1, yB, z0], [x1, yF, z1], [x0, yF, z1], GLASS, [0, 1, .3], Gm);
      for (const x of [x0, x1, (x0 + x1) / 2]) { b.beam([x, Y, z1], [x, yF, z1], .02, BRASS, GL); b.beam([x, yB, z0], [x, yF + .01, z1], .018, BRASS, GL); }
      b.beam([x0, yF, z1], [x1, yF, z1], .022, BRASS, GL); b.beam([x0, .26, z1], [x1, .26, z1], .014, BRASS, GL);
      b.beam([x0, yB, z0 + .01], [x1, yB, z0 + .01], .02, BRASS, GL);
    }
    b.pop();
  }

  /* ================= Lv3：高塔、转动的观星廊 ================= */
  function tower(b, o) {
    const cy = o.cy;
    rwall(b, DX, DZ, TR, YD, YT - .02, 14, .21);
    band(b, DX, DZ, TR + .02, 2.62, .05, 14, DRESS2);
    turret(b, o);
    bigCorbels(b, DX, DZ, TR, YT, 16, .27);
    b.at(DX, 0, DZ, STA0 + STDA * 9 + .25); b.at(0, YD, TR - .02); archRing(b, .2, .3, .62, .045, 0, .05); b.at(0, 0, .015); door(b, .2, .3, .62); b.pop(); b.pop(); b.pop();
    for (const [a, y, w, h] of [[.12, 1.95, .13, .34], [1.15, 2.35, .12, .3], [-.48, 2.55, .11, .28], [2.2, 2.85, .12, .3]]) { b.at(DX, 0, DZ, a); lancet(b, 0, y, TR - .005, w, h, { hood: 1 }); b.pop(); }
    for (const [a, y] of [[-.2, 1.75], [.95, 3.25], [-1.7, 3.3], [-2.1, 2.9], [PI - .2, 1.85]]) { b.at(DX, 0, DZ, a); slit(b, 0, y, TR - .005); b.pop(); }
    /* 正面星盘：料石圈、深蓝底、金星、月牙、十二刻 */
    b.at(DX, 0, DZ, .5); b.at(0, 3.17, TR - .01, 0, 1, PI / 2);
    b.cyl(0, 0, 0, .17, .04, 16, DRESS2, { top: DRESS });
    b.cyl(0, .04, 0, .135, .006, 16, SKYL, { nb: true });
    b.ring(0, .047, 0, .136, .118, 16, BRONZE, M);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; b.box(Math.cos(a) * .15 - .01, .04, Math.sin(a) * .15 - .01, .02, .008, .02, BRONZE, M); }
    b.at(0, .047, 0, 0, 1, -PI / 2); star4(b, .02, .03, 0, .06, C.gold, M); b.pop();
    b.at(0, .047, 0, 0, 1, -PI / 2);
    const mo = []; for (let i = 0; i <= 6; i++) { const t = -1.2 + 2.4 * i / 6; mo.push([-.06 + Math.sin(t) * .045, -.035 + Math.cos(t) * .045]); }
    for (let i = 6; i >= 0; i--) { const t = -1.2 + 2.4 * i / 6; mo.push([-.06 + Math.sin(t) * .03 - .012, -.035 + Math.cos(t) * .03]); }
    for (let i = 0; i < 6; i++) b.quad([mo[i][0], mo[i][1], 0], [mo[i + 1][0], mo[i + 1][1], 0], [mo[12 - i - 1][0], mo[12 - i - 1][1], 0], [mo[12 - i][0], mo[12 - i][1], 0], mix3(C.gold, C.cream, .3), M);
    b.pop();
    b.pop(); b.pop();
    ivyR(b, DX, DZ, TR, -2.3, YD, 2.4, .7, 30);
  }
  function turret(b, o) {                                   /* 高塔左前贴一座细石阶小塔：石砌、窄缝窗、托石线脚、铜绿小圆顶、尖饰 */
    const aT = -1.05, [tx, , tz] = pt(DX, DZ, aT, TR + .1, 0), r = .17, yt = 3.02;
    rwall(b, tx, tz, r, YD, yt, 8, .2);
    for (const [a, y] of [[aT + .2, 1.75], [aT - .45, 2.3], [aT + .1, 2.7]]) { b.at(tx, 0, tz, a); slit(b, 0, y, r - .005); b.pop(); }
    b.at(tx, 0, tz, aT - .9); ivyR(b, 0, 0, r, 0, YD, 2.3, .8, 16); b.pop();
    b.cyl(tx, yt - .02, tz, r + .04, .06, 8, DRESS2, { top: mix3(DRESS2, ST2, .3), a0: PI / 8 });
    const rings = [[0, r + .02], [.09, r - .01], [.16, r * .62], [.2, 0]], DC = [DOME, DOME2, DOMEL];
    for (let i = 0; i < 3; i++) b.cyl(tx, yt + .04 + rings[i][0], tz, rings[i][1], rings[i + 1][0] - rings[i][0], 8, DC[i], { r2: rings[i + 1][1], nb: true, nt: true, a0: PI / 8 });
    b.beam([tx, yt + .2, tz], [tx, yt + .36, tz], .014, o.cy ? BRASS : IRON, o.cy ? GL : M);
    b.sphere(tx, yt + .27, tz, .022, 4, o.cy ? BRASS : BRONZE, o.cy ? GL : M);
  }
  function telescope(b, x, y, z, ry, cy, bad) {             /* 走道上的小黄铜望远镜：木三脚架 */
    b.at(x, y, z, ry);
    for (const a of [0, 2.1, 4.2]) b.beam([0, .3, 0], [Math.sin(a) * .13, 0, Math.cos(a) * .13], .02, OAK2);
    b.at(0, .32, 0, 0, 1, bad ? .5 : -.75);
    tube(b, [0, 0, -.18], [0, 0, .24], .026, .036, cy ? BRASS : mix3(BRASS, IRON, .2), GL, 6);
    tube(b, [0, 0, .2], [0, 0, .28], .042, .042, IRON, { mat: "metal", nt: false, top: LENS }, 6);
    b.pop();
    b.pop();
  }
  function crown(b, o) {                                    /* 塔顶观星廊（本地坐标，原点在塔顶中心）：石板廊、胸墙、垛口、鼓座、穹顶 */
    const cy = o.cy, seg = 18;
    b.cyl(0, -.07, 0, CR1 + .02, .1, seg, DRESS2, { top: FLOOR, bot: INNER, a0: PI / seg });
    parapetRing(b, 0, 0, CR0, CR1, .03, .16, seg);
    rmerlons(b, 0, 0, CR1 + .01, .16, 9, { mw: .14, mh: .13 });
    tambour(b, 0, .03, 0, RD3 + .02, .33, cy, 16);
    b.at(0, .37, 0); dome(b, RD3, { cy, bad: o.bad, hole: o.bad ? [14, 2] : null, nr: 5 }); b.pop();
  }

  /* ================= 拼起来 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { lv, cy, bad };
    reseed(1); drum(b, oo);
    reseed(2); sundial(b, cy);
    if (lv < 3) {
      reseed(3); tambour(b, DX, YD, DZ, TB, TBH, cy, 18);
      telescope(b, ...pt(DX, DZ, .28, (TB + PR0) / 2 + .02, YD), .28 + PI, cy, bad);
      reseed(4);
      const fn = sb => dome(sb, RD, { cy, bad, hole: bad ? [14, 2] : null });
      if (bad) { b.at(DX, YDM, DZ, 2.1); fn(b); b.pop(); } else b.spin(DX, YDM, DZ, "y", SPIN, fn);
    } else {
      reseed(5); tower(b, oo);
      reseed(6);
      const fn = sb => crown(sb, oo);
      if (bad) { b.at(DX, YT, DZ, 2.1); fn(b); b.pop(); } else b.spin(DX, YT, DZ, "y", SPIN, fn);
      reseed(7); armillary(b, ...pt(DX, DZ, .4, (TR + PR0) / 2 + .01, YD), .135, oo);
      if (cy) { const { glassGallery } = galleryFns; glassGallery(b, DX, DZ, TR - .02, PR0 - .02, YD, 1.0, 2.5); }
    }
    if (lv >= 2) { reseed(8); platform(b, oo); reseed(9); readingHouse(b, oo); }
    if (cy) catLamp(b, -.74, .7, .8, bad);
    if (bad) {                                               /* 待修：几块胸墙石掉在墙根 */
      b.at(.72, .05, .3, .5, 1, .3, .2); b.box(0, -.05, 0, .15, .16, .09, mix3(DRESS2, ST2, .5), { top: DRESS }); b.pop();
      b.at(-.15, .04, -1.15, 1.2, 1, .1, -.5); b.box(0, -.05, 0, .14, .15, .09, mix3(DRESS2, ST2, .3), { top: DRESS }); b.pop();
    }
  }
  /* 玻璃窗廊（2077，Lv3 鼓楼平台）：一段黄铜框玻璃，坡顶靠在塔身上（tower.js 的 glassGallery） */
  const galleryFns = {
    glassGallery(b, cx, cz, rIn, rOut, y, aFrom, aTo) {
      const n = Math.max(2, Math.round((aTo - aFrom) / .36)), da = (aTo - aFrom) / n, yP = y + .14, yW = y + .56, yR = y + .76, rG = rOut - .05, GLm = { mat: "glass" };
      for (let i = 0; i < n; i++) {
        const a = aFrom + i * da, c = a + da, m = a + da / 2, out = [Math.sin(m), 0, Math.cos(m)];
        qf(b, pt(cx, cz, a, rG, yP), pt(cx, cz, c, rG, yP), pt(cx, cz, c, rG, yW), pt(cx, cz, a, rG, yW), GLASS, out, GLm);
        qf(b, pt(cx, cz, a, rG, yW), pt(cx, cz, c, rG, yW), pt(cx, cz, c, rIn, yR), pt(cx, cz, a, rIn, yR), GLASS, [out[0], 2, out[2]], GLm);
        b.beam(pt(cx, cz, a, rG, yW), pt(cx, cz, c, rG, yW), .026, BRASS, GL);
        b.beam(pt(cx, cz, a, rG, yP), pt(cx, cz, c, rG, yP), .02, BRASS, GL);
      }
      for (let i = 0; i <= n; i++) {
        const a = aFrom + i * da;
        b.beam(pt(cx, cz, a, rG, yP - .02), pt(cx, cz, a, rG, yW + .01), .026, BRASS, GL);
        b.beam(pt(cx, cz, a, rG, yW), pt(cx, cz, a, rIn, yR), .02, BRASS, GL);
      }
      for (const a of [aFrom, aTo]) {
        const s = a === aFrom ? -1 : 1, side = [Math.cos(a) * s, 0, -Math.sin(a) * s];
        qf(b, pt(cx, cz, a, rIn, y), pt(cx, cz, a, rG, y), pt(cx, cz, a, rG, yW), pt(cx, cz, a, rIn, yR), GLASS, side, GLm);
      }
      b.cyl(...pt(cx, cz, (aFrom + aTo) / 2, (rIn + rG) / 2, yR - .04), .03, .09, 6, BRASS, { r2: 0, mat: "gloss" });
    }
  };
  build.h = o => {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber;
    return lv < 3 ? (cy ? 3.06 : 2.99) : (cy ? 5.25 : 5.2);
  };
  Isle3D.FAC["观星台"] = build;
})();
