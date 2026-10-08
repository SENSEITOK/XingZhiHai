/* 猫舍（1994 猫树 / 2077 猫球宿舍）：两个纪元换轮廓。正面朝 +z（岛心），高大的部分放在 −z。
   1994 猫树（大树在中后 (0, −.35)）：
     Lv1：一棵虬结的大树——几段收分树干叠起（树皮深浅两色、几道深色树皮棱、北面一片常春藤），五条板根外撇；四根粗枝挑着七团叶（低段数球，k 1.3 随风摆，上浅下深）。
          树干上下两层带木栏杆的圆木平台（下层 r .82、上层 r .6，斜撑托着），平台上铺软垫、趴着猫球；树干开三扇透暖光的小圆门（树根正面一扇、两层平台各一扇）。
          一架绳梯从地面上到下层平台，上下层之间一架短木梯；右枝下吊一只柳条吊篮（里面睡着一只猫），下层平台边吊一盏铁提灯。
          树根一圈料石坐台（正面留口，台上三盆猫薄荷、一只食碗），台里是青苔地，门前三块踏脚石，左前一根铁灯柱挂提灯和猫头木招牌；
          右前一座晒鱼架（两副 X 腿、一根横杆、五条小鱼），架下蹲一只猫仰头看；树干右后一个树洞探出一只猫，树根边几撮蘑菇。
          猫球（新写 catBall：扁圆身子、两只锥耳带粉内耳、两点黑眼睛、一根 beam 尾巴；1994 猫灯肚皮微亮 e .36）；一处 cat 粒子。
     Lv2：左前高枝上搭一间树屋：木板墙、前山墙开圆窗透暖光、小拱门和门廊、石板瓦陡人字顶、屋脊上一只铁猫风标，檐角挂一盏铁提灯；上层平台一架小梯子通上去；树冠长高一圈。
     Lv3：右后树根旁一间石砌猫灯厨房：错缝毛石墙、石板瓦顶、后坡石烟囱冒烟（smoke 1）、尖拱木门、烛光窗、墙上提灯、山墙圆窗、墙根柴堆；
          门口一口三脚大铁锅架在石圈火塘上，锅里冒热气（steam 1）；左前再长一棵小猫树（一层小平台、三团叶、一只猫）。
   2077 猫球宿舍（同一套石头）：
     Lv1：一座矮胖的四层环台圆塔（r .74→.62，身高 2.36）：错缝灰石，每层顶一圈托石挑出的环形阳台、黄铜栏杆，阳台之间挂黄铜小梯；
          塔身每层一圈小圆窗（石窗框、暗窗心，个别透暖光），每扇窗台伸出一只软垫；几只猫球趴在阳台和窗台上；
          塔顶石板瓦馒头顶（不是尖针），顶上一把黄铜发条钥匙绕 x 轴慢转（spin）；正面圆拱门、石板瓦单坡小雨棚、两盏黄铜壁灯、门楣一块黄铜猫头牌，
          门两侧一对尖拱烛光窗；阳台上两只黄铜花槽（猫薄荷），门口铜食碗和水碗；
          塔左前留一棵小猫树；门口和顶边各浮一盏猫球灯（cat 粒子 2）。
     Lv2：右后加第二座更矮的环台塔（四层、r .4），小馒头顶上立一只黄铜小飞艇风标；两塔之间一道绳桥（木踏板、麻绳扶手）；
          主塔第三层阳台伸出一根黄铜吊臂，滑轮吊着一只送餐吊篮，慢慢上下（bob）。
     Lv3：右前塔脚一间玻璃门面的猫灯厨房：料石墙、黄铜框玻璃橱窗和玻璃门、石板瓦顶、黄铜烟囱冒烟（smoke 1）、门边挂一块黄铜猫头招牌。
   动件：2077 发条钥匙 1（spin）、Lv2 起吊篮 1（bob）；1994 没有。粒子：1994 cat 1，Lv3 加 smoke 1、steam 1；2077 cat 2，Lv3 加 smoke 1。
   待修：渲染器统一压暗；模型里灯和小圆门都灭了、不冒烟、猫肚皮不亮、没有猫球灯；1994 一段栏杆断了耷拉下来、绳梯断了一边、吊篮掉在地上、几团叶发黄、
         树屋歪了、锅翻倒；2077 钥匙停转并歪着、绳桥断了垂下去、吊篮掉在地上、一段黄铜栏杆断了、厨房掉了两块玻璃。
   前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。不画人形。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const pt = (cx, cz, a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r];   /* 角度 a：0 朝 +z（正面），PI/2 朝 +x */
  const lerp = (a, b, t) => a + (b - a) * t;
  /* 石 */
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);
  const FLOOR = mix3(C.stone, C.castle2, .5), FLOOR2 = mix3(FLOOR, C.castle2, .35);
  const INNER = mix3(STD, [.1, .09, .1], .6);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55);
  const SLD = mix3(SL, [.08, .08, .1], .4), SLM = mix3(SL, C.ivy, .45);
  const WIN = mix3(C.glow, [.46, .33, .21], .34), WIND = mix3(WIN, INNER, .32);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), AGED = mix3(BRASS, [.34, .3, .25], .38), IRON = mix3(C.iron, [.1, .1, .12], .2);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35);
  const MULL = mix3(IRON, OAK, .3);
  const MOSS = mix3(mix3(C.grass, C.ivy, .55), C.castle2, .2), SOIL = mix3(C.soil, C.castle2, .3);
  /* 树 */
  const BARK = mix3(C.woodD, [.34, .31, .28], .42), BARK2 = mix3(C.wood, [.42, .4, .37], .55), BARKD = mix3(C.woodD, [.1, .08, .07], .45);
  const LEAVES = [mix3(mix3(C.leaf, C.leafD, .35), C.castle2, .2), mix3(mix3(C.pine, C.leaf, .4), C.castle2, .14), mix3(mix3(C.leaf, C.leaf2, .3), C.castle, .3), mix3(mix3(C.leafD, C.pine, .5), C.castle2, .12)];
  const LEAFD = mix3(C.leafD, [.1, .14, .1], .4), SERE = mix3(mix3(C.leaf, C.hay, .5), C.dirt, .3);
  const PLANK = mix3(C.plank, C.castle, .3), PLANK2 = mix3(C.wood, C.castle2, .35), PLANKD = mix3(C.woodD, C.castle2, .3);
  const ROPE = mix3(mix3(C.hay, C.wood, .5), C.stone, .3), WICK = mix3(mix3(C.hay, C.woodL, .5), C.stone, .22), WICKD = mix3(WICK, C.woodD, .4);
  const CUSH = [mix3(C.banner, C.castle, .3), mix3(C.banner2, C.castle, .3), mix3(mix3(C.gold, C.wood, .45), C.castle, .2), mix3(C.ivy, C.cream, .35), mix3(C.bloom, C.castle, .45)];
  /* 猫：奶白、橘、灰、黑、虎斑 */
  const CAT = { w: mix3(C.cream, C.stone, .14), o: mix3(mix3(C.hay, C.wood, .45), C.castle, .1), g: mix3(C.castle, C.slate2, .25), k: [.2, .19, .2], t: mix3(C.woodL, C.castle, .35) };
  const BELLY = mix3(C.glow, C.cream, .5), EYE = [.12, .1, .1], PINK = mix3(C.bloom, C.castle, .3);
  const FISH = mix3(C.metal, C.stone, .3), FISH2 = mix3(C.metal, [.42, .52, .6], .35);
  const SOUP = mix3(mix3(C.hay, C.dirt, .5), C.castle2, .2), EMBER = mix3(C.lamp, C.glow, .5);
  const GLASS = mix3(C.glass, [.78, .88, .84], .3);
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const angIn = (a, g0, g1) => ((a - g0) % TAU + TAU) % TAU <= ((g1 - g0) % TAU + TAU) % TAU;

  /* ---------- 基本面片 ---------- */
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }      /* 两面都看得见的薄片（鱼、风标） */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function archPts(w, p, n) {                               /* 拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function vdisc(b, x, y, z, r, n, col, o) {                /* 竖着的圆片（面朝 +z）：圆窗心、圆门洞 */
    for (let i = 0; i < n; i++) { const a = i / n * TAU, c = (i + 1) / n * TAU; b.tri([x, y, z], [x + Math.cos(a) * r, y + Math.sin(a) * r, z], [x + Math.cos(c) * r, y + Math.sin(c) * r, z], col, o); }
  }
  function vring(b, x, y, z, r1, r2, n, col, o) {           /* 竖着的圆环（面朝 +z）：圆窗框 */
    for (let i = 0; i < n; i++) { const a = i / n * TAU, c = (i + 1) / n * TAU; qf(b, [x + Math.cos(a) * r1, y + Math.sin(a) * r1, z], [x + Math.cos(a) * r2, y + Math.sin(a) * r2, z], [x + Math.cos(c) * r2, y + Math.sin(c) * r2, z], [x + Math.cos(c) * r1, y + Math.sin(c) * r1, z], col, [0, 0, 1], o); }
  }
  function along(b, p, q) {                                 /* 以 p 为原点、p→q 为 y 轴推一层变换，返回长度 */
    const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]);
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    return L;
  }
  function rod(b, a, c, t, col, o) {                        /* 细杆：只有四个侧面（栏杆、绳、梯子、黄铜架） */
    const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const y = [d[0] / L, d[1] / L, d[2] / L], r = Math.abs(y[1]) < .95 ? [-y[2], 0, y[0]] : [0, y[2], -y[1]], rl = Math.hypot(r[0], r[1], r[2]);
    const x = [r[0] / rl, r[1] / rl, r[2] / rl], z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    b.push(new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1]));
    const h = t / 2, Q = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (let i = 0; i < 4; i++) { const p = Q[i], q = Q[(i + 1) % 4]; b.quad([q[0], 0, q[1]], [p[0], 0, p[1]], [p[0], L, p[1]], [q[0], L, q[1]], col, o); }
    b.pop();
  }
  function limb(b, p, q, r0, r1, seg, col, o) {              /* 两点之间一段收分圆柱（树干、树枝、树根、圆木） */
    const L = along(b, p, q);
    if (L > 1e-6) b.cyl(0, 0, 0, r0, L, seg, col, Object.assign({ r2: r1, nt: true, nb: true }, o || {}));
    b.pop();
  }
  function ell(b, x, y, z, rx, ry, rz, seg, col, o, yaw, pitch, roll) { b.at(x, y, z, yaw || 0, [rx, ry, rz], pitch || 0, roll || 0); b.sphere(0, 0, 0, 1, seg, col, o); b.pop(); }

  /* ---------- 砌石 ---------- */
  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .58 + r * .42);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .3); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .3);
    if (r > .9) c = mix3(c, STD, .45); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.32, (.9 - y) * .32));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  /* 一面墙（面朝 +z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石 */
  function mason(b, hw, y0, y1, z, o) {
    o = o || {};
    const rh = o.rh || .15, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .1 : .18) : 0, q1 = o.qr ? ((j + ph) % 2 ? .18 : .1) : 0;
      const cuts = [];
      let x = L + (q0 || (.05 + R() * .18));
      while (x < Rr - (q1 ? q1 + .07 : .07)) { cuts.push(x); x += .16 + R() * .2; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        b.quad([E[k][0], ya, z], [E[k + 1][0], ya, z], [E[k + 1][1], yb, z], [E[k][1], yb, z], isQ ? mix3(DRESS2, ST, R() * .35) : sc(ya));
      }
    }
  }
  /* 圆塔身：一圈圈石砌，上下层错缝；r0→r1 收分 */
  function shaft(b, cx, cz, r0, r1, y0, y1, seg, ch) {
    const n = Math.max(1, Math.round((y1 - y0) / (ch || .2))), hh = (y1 - y0) / n;
    for (let i = 0; i < n; i++) {
      const ya = y0 + i * hh, yb = ya + hh, ra = lerp(r0, r1, i / n), rb = lerp(r0, r1, (i + 1) / n), off = (i % 2) * PI / seg;
      for (let k = 0; k < seg; k++) {
        const a = off + k / seg * TAU, c = off + (k + 1) / seg * TAU;
        b.quad(pt(cx, cz, a, ra, ya), pt(cx, cz, c, ra, ya), pt(cx, cz, c, rb, yb), pt(cx, cz, a, rb, yb), sc(ya));
      }
    }
  }

  /* ---------- 窗、门、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = .7, fr = .032, n = 3;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p, n), -.03, .02, DRESS);
    if (o.off) fan(b, outline(w, h, 0, p, n), .024, INNER);
    else fan(b, outline(w, h, 0, p, n), .024, WIN, { e: o.e != null ? o.e : .5 });
    b.panel(0, h * .55, .027, w, .012, MULL);
    b.panel(0, 0, .027, .012, h + w * .4, MULL);
    b.box(0, -fr - .025, 0, w + fr * 2 + .03, .025, .07, DRESS, { nb: true });
    b.pop();
  }
  function archDoor(b, x, y, z, w, h, p, o) {               /* 拱门（面朝 +z）：料石门框、木门板、铁箍、门环 */
    o = o || {};
    b.at(x, y, z);
    prism(b, outline(w + .06, h, 0, p, 4), -.02, .012, o.frame || DRESS);
    const leaf = o.leaf || mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), .016, leaf, o.lo);
    if (!o.glass) {
      b.panel(0, 0, .018, .01, h + w * .45, dim3(leaf, .7));
      for (const yy of [h * .22, h * .7]) b.panel(0, yy, .02, w * .9, .018, IRON, M);
      b.box(w * .22, h * .45, .02, .022, .022, .01, o.knob || C.gold, M);
    }
    b.pop();
  }
  function lantern(b, x, y, z, cy, off) {                   /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .045, .018, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .018, z, .032, .1, 6, off ? mix3(C.lamp, OAK, .6) : C.lamp, off ? { r2: .04, nt: true, nb: true } : { r2: .04, e: .6, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .038, y + .018, z + Math.sin(a) * .038], [x + Math.cos(a) * .045, y + .118, z + Math.sin(a) * .045], .008, fr, fo); }
    b.cyl(x, y + .118, z, .054, .014, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .132, z, .05, .062, 6, fr, Object.assign({ nb: true }, fo));
  }
  function wallLantern(b, x, y, z, cy, off) {               /* 墙上铁臂挑出一盏提灯（面朝 +z） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y + .02, z + .005, .036, .09, .02, fr, fo);
    b.beam([x, y + .09, z], [x, y + .09, z + .15], .016, fr, fo);
    b.beam([x, y + .02, z], [x, y + .09, z + .09], .011, fr, fo);
    b.beam([x, y + .09, z + .14], [x, y + .03, z + .14], .008, fr, fo);
    lantern(b, x, y - .17, z + .14, cy, off);
  }
  function hangLantern(b, x, yTop, z, len, cy, off) {       /* 一截铁链吊一盏提灯 */
    rod(b, [x, yTop, z], [x, yTop - len, z], .01, cy ? BRASS : IRON, cy ? GL : M);
    lantern(b, x, yTop - len - .19, z, cy, off);
  }
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, 0, z, .04, .06, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .018, BRASS, GL);
    b.beam([x, h, z], [x + .09, h + .045, z], .014, BRASS, GL);
    b.beam([x + .09, h + .045, z], [x + .13, h + .02, z], .012, BRASS, GL);
    b.sphere(x, h + .01, z, .022, 4, BRASS, GL);
    if (!off) b.emit(x + .13, h - .1, z, "cat", 1, .85);
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
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .024 + R() * .026, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, rAt, a0, da, y0, h, n) {         /* 圆柱面上的常春藤 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.6), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .028 + R() * .026;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], rAt(py) + .012 + R() * .01, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，零星几片长青苔；o.hole 塌洞 */
    o = o || {};
    const dx = B[0] - A[0], dy = B[1] - A[1], nb = o.nb || Math.max(2, Math.round(Math.hypot(dx, dy) / .13)), cw = o.cw || .2;
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .018, cols = [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + (i < nb - 1 ? .03 / Math.hypot(dx, dy) : 0), xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .05; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
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
    b.beam([A[0] + N[0] * .004, A[1] - .025, z0], [A[0] + N[0] * .004, A[1] - .025, z1], .03, OAK);
  }

  /* ================= 猫 ================= */
  /* 猫球（约 80 三角形）：扁圆身子（下半圈往肚皮色过渡；1994 猫灯肚皮微亮 o.e）、两只锥耳带粉内耳、两点黑眼睛（o.sleep 是眯缝）、粉鼻头、一根 beam 尾巴。
     (x, y, z) 是身子落地点，脸朝本地 +z；o.cap 头背色（虎斑、黑背） */
  function catBall(b, x, y, z, ry, s, col, o) {
    o = o || {};
    const sg = 7, rings = 4, sy = .74, bel = o.belly || mix3(col, C.cream, .55), ge = o.e || 0, cap = o.cap || col;
    b.at(x, y + sy * s * .92, z, ry, s);
    const P = (t, a) => [Math.sin(t) * Math.cos(a), Math.cos(t) * sy, Math.sin(t) * Math.sin(a)];
    for (let j = 0; j < rings; j++) {
      const t0 = j / rings * PI, t1 = (j + 1) / rings * PI;
      const c = j === 0 ? cap : j === 1 ? col : j === 2 ? mix3(col, bel, .5) : bel;
      const oo = ge && j === 3 ? { e: ge } : ge && j === 2 ? { e: Math.min(.26, ge * .6) } : undefined;
      for (let i = 0; i < sg; i++) { const a = i / sg * TAU, c2 = (i + 1) / sg * TAU; b.quad(P(t1, c2), P(t1, a), P(t0, a), P(t0, c2), c, oo); }
    }
    for (const sx of [-1, 1]) {
      b.at(sx * .44, .5, .14, 0, 1, -.12, sx * -.42);
      b.cone(0, 0, 0, .26, .5, 3, cap, { a0: PI / 6, nb: true });
      b.tri([-.12, .06, .126], [.12, .06, .126], [0, .33, .056], PINK);
      b.pop();
    }
    for (const sx of [-1, 1]) {
      b.at(sx * .3, .16, .955, sx * .32);
      if (o.sleep) b.panel(0, 0, 0, .2, .05, EYE); else b.panel(0, -.06, 0, .12, .15, EYE);
      b.pop();
    }
    b.tri([.07, .05, 1.005], [-.07, .05, 1.005], [0, -.03, 1.0], PINK);
    const ts = o.tail || 1;
    b.beam([ts * .3, -.42, -.8], [ts * .86, -.48, -.12], .17, cap);
    b.beam([ts * .86, -.48, -.12], [ts * .7, -.5, .42], .14, cap);
    b.pop();
  }
  function cushion(b, x, y, z, ry, w, d, col) {             /* 软垫：两层，上层略小略浅 */
    const c2 = mix3(col, C.cream, .14);
    b.at(x, y, z, ry); b.box(0, 0, 0, w, .03, d, col, { nb: true, top: c2 }); b.box(0, .03, 0, w * .8, .016, d * .8, c2, { nb: true }); b.pop();
  }

  /* ================= 1994：猫树 ================= */
  /* 树干：一串收分圆柱，深浅两色交替，转弯处略伸进下一段 */
  function trunk(b, pts, sides) {
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1], d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]), e1 = i < pts.length - 2 ? q[3] * .3 : 0;
      limb(b, [p[0], p[1], p[2]], [q[0] + d[0] / L * e1, q[1] + d[1] / L * e1, q[2] + d[2] / L * e1], p[3], q[3], sides, i % 2 ? BARK2 : BARK, { nt: i < pts.length - 2, top: BARKD, a0: i * .5 });
    }
  }
  function tAt(pts, y) {                                    /* 树干在高度 y 处的中心和半径 */
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      if (y <= q[1] || i === pts.length - 2) { const t = Math.max(0, Math.min(1, (y - p[1]) / (q[1] - p[1]))); return [lerp(p[0], q[0], t), lerp(p[2], q[2], t), lerp(p[3], q[3], t)]; }
    }
  }
  function roots(b, s, angs) {                              /* 外撇的板根 */
    for (const a of angs) {
      const p0 = [Math.sin(a) * .14 * s, .5 * s, Math.cos(a) * .14 * s], p1 = [Math.sin(a) * .4 * s, .1 * s, Math.cos(a) * .4 * s], p2 = [Math.sin(a + .12) * .66 * s, -.03, Math.cos(a + .12) * .66 * s];
      limb(b, p0, [p1[0] * 1.06, p1[1] - .02, p1[2] * 1.06], .13 * s, .075 * s, 5, BARK);
      limb(b, p1, p2, .075 * s, .028 * s, 5, BARK2);
    }
  }
  function ridges(b, pts, n, y0, y1) {                      /* 几道深色树皮棱 */
    for (let i = 0; i < n; i++) {
      const a = R() * TAU, ya = y0 + R() * (y1 - y0) * .4, yb = ya + .4 + R() * (y1 - y0) * .45, A = tAt(pts, ya), B = tAt(pts, yb), da = (R() - .5) * .4;
      rod(b, [A[0] + Math.sin(a) * A[2] * .98, ya, A[1] + Math.cos(a) * A[2] * .98], [B[0] + Math.sin(a + da) * B[2] * .98, yb, B[1] + Math.cos(a + da) * B[2] * .98], .03 + R() * .02, BARKD);
    }
  }
  function branch(b, p0, p1, p2, r0) {                      /* 一根粗枝：两段收分、中间拐一下 */
    const d = sub(p1, p0), L = Math.hypot(d[0], d[1], d[2]), e = r0 * .55;
    limb(b, p0, [p1[0] + d[0] / L * e, p1[1] + d[1] / L * e, p1[2] + d[2] / L * e], r0, r0 * .72, 6, BARK);
    limb(b, p1, p2, r0 * .72, r0 * .38, 5, BARK2);
  }
  function leafBall(b, x, y, z, r, col, sere) {             /* 一团叶：压扁的低段数球（k 1.3 随风摆），上浅下深；旁边再鼓一个小包；sere 发黄（待修） */
    const c = sere ? mix3(col, SERE, .65) : col, kk = { k: 1.3, grad: mix3(c, LEAFD, .6) };
    ell(b, x, y, z, r, r * .72, r * .92, 8, c, kk, R() * TAU);
    const a = R() * TAU;
    ell(b, x + Math.sin(a) * r * .62, y + r * .18, z + Math.cos(a) * r * .62, r * .56, r * .44, r * .56, 6, mix3(c, mix3(C.leaf2, C.castle, .3), .2), kk, R() * TAU);
    ell(b, x + Math.sin(a + 2.4) * r * .58, y - r * .12, z + Math.cos(a + 2.4) * r * .58, r * .5, r * .4, r * .5, 6, mix3(c, LEAFD, .2), kk, R() * TAU);
  }
  function roundDoor(b, cx, cz, a, r, y, rd, lit) {         /* 树干上的小圆门：木框、透暖光的门洞（灭了是黑的）、门槛 */
    b.at(cx, 0, cz, a);
    vring(b, 0, y + rd, r + .016, rd, rd + .032, 8, OAK2);
    vdisc(b, 0, y + rd, r + .01, rd + .004, 8, lit ? WIND : INNER, lit ? { e: .5 } : undefined);
    b.box(0, y - .012, r + .02, rd * 2 + .05, .024, .08, OAK, { nb: true });
    b.pop();
  }
  /* 圆木平台：一圈梯形木板（顶、外沿、底），四根斜撑；木栏杆（跳过 gap 角度；broken 那一格断了耷拉下来） */
  function platform(b, cx, cz, y, rIn, rOut, n, o) {
    o = o || {};
    const th = .05, a0 = o.a0 || 0, gaps = o.gap || [], inG = a => gaps.some(g => angIn(a, g[0], g[1]));
    for (let k = 0; k < n; k++) {
      const a = a0 + k / n * TAU, c = a0 + (k + 1) / n * TAU, m = (a + c) / 2, out = [Math.sin(m), 0, Math.cos(m)];
      const col = k % 3 === 0 ? PLANK2 : mix3(PLANK, PLANK2, R() * .5), cg = c - .008;
      qf(b, pt(cx, cz, a, rIn, y), pt(cx, cz, cg, rIn, y), pt(cx, cz, cg, rOut, y), pt(cx, cz, a, rOut, y), col, [0, 1, 0]);
      qf(b, pt(cx, cz, a, rOut, y), pt(cx, cz, c, rOut, y), pt(cx, cz, c, rOut, y - th), pt(cx, cz, a, rOut, y - th), PLANKD, out);
      qf(b, pt(cx, cz, a, rIn, y - th), pt(cx, cz, c, rIn, y - th), pt(cx, cz, c, rOut, y - th), pt(cx, cz, a, rOut, y - th), PLANKD, [0, -1, 0]);
    }
    for (let k = 0; k < 4; k++) { const a = a0 + (k + .5) / 4 * TAU + .3; rod(b, pt(cx, cz, a, rIn * .85, y - .4), pt(cx, cz, a, rOut * .78, y - th), .045, OAK); }
    if (o.rail === false) return;
    const rr = rOut - .035, yt = y + .2;
    for (let k = 0; k < n; k++) {
      const a = a0 + k / n * TAU, c = a0 + (k + 1) / n * TAU;
      if (!inG(a)) rod(b, pt(cx, cz, a, rr, y), pt(cx, cz, a, rr, yt + .025), .03, OAK2);
      if (inG(a) || inG(c) || inG((a + c) / 2)) continue;
      if (o.broken != null && angIn(o.broken, a, c)) { rod(b, pt(cx, cz, a, rr, yt), pt(cx, cz, (a + c) / 2, rr + .06, y - .2), .026, OAK2); continue; }
      rod(b, pt(cx, cz, a, rr, yt), pt(cx, cz, c, rr, yt), .028, OAK2);
      rod(b, pt(cx, cz, a, rr, y + .09), pt(cx, cz, c, rr, y + .09), .012, ROPE);
    }
  }
  /* 梯子：沿角度 a 从 (r0, y0) 到 (r1, y1)；两根边杆、n 根横档；o.snap 断了一边（只剩上半截）、o.miss 缺的档 */
  function ladder(b, cx, cz, a, r0, y0, r1, y1, w, n, side, rung, o) {
    o = o || {};
    const T = [Math.cos(a) * w / 2, 0, -Math.sin(a) * w / 2], P = (t, s) => { const p = pt(cx, cz, a, lerp(r0, r1, t), lerp(y0, y1, t)); return [p[0] + T[0] * s, p[1], p[2] + T[2] * s]; };
    const st = o.rt || .018, mo = o.mo;
    for (const s of [-1, 1]) rod(b, P(o.snap === s ? .55 : 0, s), P(1.04, s), st, side, mo);
    if (o.snap) rod(b, P(.55, o.snap), [P(.55, o.snap)[0], lerp(y0, y1, .55) - .22, P(.55, o.snap)[2]], st, side, mo);
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      if (o.miss && o.miss.includes(i)) continue;
      if (o.snap && t < .55) { if (i === 2) rod(b, P(t + .12, -o.snap * 1.05), P(t - .05, o.snap * .2), .016, rung, mo); continue; }
      rod(b, P(t, -1.08), P(t, 1.08), o.rr || .02, rung, mo);
    }
  }
  function basket(b, x, y, z, ry, hang, col, o) {           /* 柳条吊篮：收口的篮身、篮沿、里面一只软垫；hang 是吊点高（null 是放在地上） */
    o = o || {};
    b.at(x, y, z, ry, 1, o.rx || 0, o.rz || 0);
    b.cyl(0, 0, 0, .08, .1, 8, WICK, { r2: .115, nt: true, bot: WICKD });
    b.cyl(0, .09, 0, .12, .025, 8, WICKD, { nt: true, nb: true });
    b.disc(0, .088, 0, .113, 8, col);
    for (let i = 0; i < 4; i++) { const a = (i + .5) / 4 * TAU; b.panel(Math.sin(a) * .1, .02, Math.cos(a) * .1, .01, .01, WICKD); }
    if (hang != null) for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + .4; rod(b, [Math.sin(a) * .115, .1, Math.cos(a) * .115], [0, hang - y, 0], .008, ROPE); }
    b.pop();
  }
  /* 树根一圈料石坐台：外面两层错色毛石、顶上一圈压顶石板（略挑出）；gaps 留口 */
  function seatRing(b, cx, cz, r0, r1, h, gaps) {
    const n = 20, inG = a => gaps.some(g => angIn(a, g[0], g[1]));
    for (let k = 0; k < n; k++) {
      const a = k / n * TAU, c = (k + 1) / n * TAU, m = (a + c) / 2;
      if (inG(m)) continue;
      const out = [Math.sin(m), 0, Math.cos(m)], inn = [-out[0], 0, -out[2]];
      for (let j = 0; j < 2; j++) { const ya = j * h * .5, yb = ya + h * .5; qf(b, pt(cx, cz, a, r1, ya), pt(cx, cz, c, r1, ya), pt(cx, cz, c, r1, yb), pt(cx, cz, a, r1, yb), sc(ya + .15), out); }
      qf(b, pt(cx, cz, a, r0, 0), pt(cx, cz, c, r0, 0), pt(cx, cz, c, r0, h), pt(cx, cz, a, r0, h), mix3(ST2, STD, .35 + R() * .3), inn);
      const t0 = r0 - .025, t1 = r1 + .03, yt = h + .045;
      qf(b, pt(cx, cz, a, t0, yt), pt(cx, cz, c, t0, yt), pt(cx, cz, c, t1, yt), pt(cx, cz, a, t1, yt), k % 2 ? DRESS : mix3(DRESS2, DRESS, R()), [0, 1, 0]);
      qf(b, pt(cx, cz, a, t1, h), pt(cx, cz, c, t1, h), pt(cx, cz, c, t1, yt), pt(cx, cz, a, t1, yt), DRESS2, out);
      qf(b, pt(cx, cz, a, t0, h), pt(cx, cz, c, t0, h), pt(cx, cz, c, t0, yt), pt(cx, cz, a, t0, yt), DRESS2, inn);
      for (const [e, s] of [[a, -1], [c, 1]]) {
        if (!inG(e + s * .5 / n * TAU)) continue;                         /* 留口那头封一块端石 */
        const tg = [Math.cos(e) * s, 0, -Math.sin(e) * s];
        qf(b, pt(cx, cz, e, r0, 0), pt(cx, cz, e, r1, 0), pt(cx, cz, e, r1, h), pt(cx, cz, e, r0, h), DRESS2, tg);
        qf(b, pt(cx, cz, e, t0, h), pt(cx, cz, e, t1, h), pt(cx, cz, e, t1, yt), pt(cx, cz, e, t0, yt), DRESS2, tg);
      }
    }
  }
  function fish(b, x, y, z, ry) {                           /* 一条晒着的小鱼（尾巴朝上吊着，两面都画） */
    b.at(x, y, z, ry);
    tri2(b, [0, 0, 0], [-.032, -.075, 0], [0, -.16, 0], FISH); tri2(b, [0, 0, 0], [0, -.16, 0], [.032, -.075, 0], FISH2);
    tri2(b, [0, 0, 0], [-.03, .04, 0], [.03, .04, 0], FISH2);
    b.pop();
  }
  function fishRack(b, x, z, ry) {                          /* 晒鱼架：两副 X 腿、一根横杆、五条小鱼 */
    b.at(x, 0, z, ry);
    for (const sx of [-.3, .3]) { rod(b, [sx, 0, -.15], [sx, .74, .08], .028, OAK2); rod(b, [sx, 0, .15], [sx, .74, -.08], .028, OAK2); }
    rod(b, [-.37, .5, 0], [.37, .5, 0], .03, OAK);
    for (let i = 0; i < 5; i++) { const fx = -.22 + i * .11, fy = .47 - (i % 2) * .02; rod(b, [fx, .5, 0], [fx, fy, 0], .006, ROPE); fish(b, fx, fy, 0, (R() - .5) * .6); }
    b.pop();
  }

  /* 一棵猫树（S 缩放）：pts 树干、rootA 板根角度、plats 平台、brs 粗枝、cls 叶团；o.small 只画一层平台 */
  function catTree(b, o, X, Z, S, D) {
    const bad = o.bad;
    b.at(X, 0, Z, D.ry || 0, S);
    roots(b, 1, D.rootA);
    trunk(b, D.pts, D.sides || 9);
    ridges(b, D.pts, D.ridges || 7, .2, D.pts[D.pts.length - 1][1] - .3);
    for (const br of D.brs) branch(b, br[0], br[1], br[2], br[3]);
    for (const p of D.plats) { const c = tAt(D.pts, p.y); platform(b, c[0], c[1], p.y, c[2] - .02, p.r, p.n, p.o); }
    for (const d of D.doors) { const c = tAt(D.pts, d[1] + d[2]); roundDoor(b, c[0], c[1], d[0], c[2] * .97, d[1], d[2], !bad); }
    D.cls.forEach((c, i) => leafBall(b, c[0], c[1], c[2], c[3], LEAVES[i % LEAVES.length], bad && i % 3 === 1));
    if (D.extra) D.extra(b);
    b.pop();
  }

  /* 树屋（Lv2）：木板墙、前山墙圆窗、小拱门、门廊、陡石板瓦人字顶、屋脊铁猫风标、檐角吊提灯 */
  function treeHouse(b, o, X, Y, Z, ry) {
    const bad = o.bad, W = .46, D = .4, H = .36, RH = .32, ov = .07;
    b.at(X, Y, Z, ry);
    if (bad) b.at(0, 0, 0, 0, 1, .05, -.09);
    b.box(0, -.06, .07, W + .2, .06, D + .3, PLANKD, { top: PLANK2 });                    /* 地板＋门廊 */
    for (const sx of [-1, 1]) { rod(b, [sx * (W / 2 + .07), 0, D / 2 + .2], [sx * (W / 2 + .07), .18, D / 2 + .2], .024, OAK2); }
    rod(b, [-(W / 2 + .07), .17, D / 2 + .2], [-.08, .17, D / 2 + .2], .022, OAK2);
    b.box(0, 0, 0, W, H, D, OAK2, { nb: true });
    for (let i = 0; i < 5; i++) { const x = -W / 2 + (i + .5) * W / 5; b.panel(x, 0, D / 2 + .003, .008, H, OAK); b.at(0, 0, 0, PI); b.panel(x, 0, D / 2 + .003, .008, H, OAK); b.pop(); }
    for (const s of [-1, 1]) { b.at(0, 0, 0, s * PI / 2); for (let i = 0; i < 4; i++) b.panel(-D / 2 + (i + .5) * D / 4, 0, W / 2 + .003, .008, H, OAK); b.pop(); }
    for (const s of [-1, 1]) {
      const z = s * D / 2;
      tf(b, [-W / 2, H, z], [W / 2, H, z], [0, H + RH, z], OAK2, [0, 0, s]);
      tf(b, [-W / 2 + .02, H, z + s * .004], [W / 2 - .02, H, z + s * .004], [0, H + .02, z + s * .004], OAK, [0, 0, s]);
    }
    slope(b, [W / 2 + ov, H - .035], [0, H + RH + .015], -D / 2 - ov, D / 2 + ov, { cw: .14 });
    slope(b, [-W / 2 - ov, H - .035], [0, H + RH + .015], -D / 2 - ov, D / 2 + ov, { cw: .14 });
    rod(b, [0, H + RH + .02, -D / 2 - ov], [0, H + RH + .02, D / 2 + ov], .032, SLD);
    /* 前山墙圆窗、拱门 */
    vring(b, 0, H + RH * .4, D / 2 + .012, .065, .09, 8, OAK);
    vdisc(b, 0, H + RH * .4, D / 2 + .008, .066, 8, bad ? INNER : WIN, bad ? undefined : { e: .45 });
    b.panel(0, H + RH * .4 - .065, D / 2 + .014, .01, .13, MULL); b.panel(0, H + RH * .4 - .005, D / 2 + .014, .13, .01, MULL);
    archDoor(b, .1, 0, D / 2, .13, .17, .5, { frame: OAK, leaf: mix3(C.woodD, C.wood, .15) });
    /* 铁猫风标：细杆、猫剪影（扁平，两面画） */
    const yv = H + RH + .03;
    rod(b, [0, yv, D / 2 + ov - .05], [0, yv + .2, D / 2 + ov - .05], .012, IRON, M);
    b.at(0, yv + .17, D / 2 + ov - .05, PI / 2);
    tri2(b, [-.07, -.03, 0], [.06, -.03, 0], [.04, .03, 0], IRON, M); tri2(b, [-.07, -.03, 0], [.04, .03, 0], [-.06, .03, 0], IRON, M);
    tri2(b, [.03, .02, 0], [.09, .02, 0], [.06, .08, 0], IRON, M); tri2(b, [.05, .07, 0], [.06, .1, 0], [.07, .07, 0], IRON, M); tri2(b, [.075, .07, 0], [.085, .1, 0], [.09, .06, 0], IRON, M);
    tri2(b, [-.07, 0, 0], [-.12, .07, 0], [-.1, .075, 0], IRON, M);
    b.pop();
    /* 檐角吊提灯 */
    hangLantern(b, -W / 2 - ov + .02, H - .05, D / 2 + ov - .02, .05, false, bad);
    /* 托梁：两根斜撑 */
    for (const sx of [-1, 1]) rod(b, [sx * .16, -.06, -.1], [sx * .05, -.48, -.32], .04, OAK);
    b.pop(); if (bad) b.pop();
  }

  /* 猫灯厨房（1994 Lv3）：毛石墙、石板瓦人字顶（屋脊沿 x）、后坡石烟囱、尖拱木门、烛光窗、提灯、山墙圆窗、柴堆；门口三脚大铁锅架在火塘上 */
  function kitchen94(b, o, X, Z) {
    const bad = o.bad, W = .8, D = .6, H = .6, RH = .36, ov = .07, y0 = .07;
    b.at(X, 0, Z);
    b.box(0, 0, 0, W + .06, y0, D + .06, mix3(ST2, STD, .4), { top: DRESS2 });
    mason(b, () => [-W / 2, W / 2], y0, H, D / 2, { ql: 1, qr: 1 });
    b.at(0, 0, 0, PI); mason(b, () => [-W / 2, W / 2], y0, H, D / 2, { ql: 1, qr: 1, qph: 1 }); b.pop();
    for (const s of [-1, 1]) { b.at(0, 0, 0, s * PI / 2); mason(b, y => y <= H + 1e-6 ? [-D / 2, D / 2] : [-D / 2 * (1 - (y - H) / RH), D / 2 * (1 - (y - H) / RH)], y0, H + RH, W / 2, { rh: .14 }); b.pop(); }
    b.at(0, 0, 0, PI / 2);
    slope(b, [D / 2 + ov, H - .03], [0, H + RH + .012], -W / 2 - ov, W / 2 + ov, { hole: bad ? (t, z) => t > .3 && t < .75 && z > .02 && z < .26 : null });
    slope(b, [-D / 2 - ov, H - .03], [0, H + RH + .012], -W / 2 - ov, W / 2 + ov);
    rod(b, [0, H + RH + .02, -W / 2 - ov], [0, H + RH + .02, W / 2 + ov], .035, SLD);
    b.pop();
    /* 后坡烟囱：毛石方柱、料石压顶、两只烟囱帽 */
    const cx = W / 2 - .2, cz = -D / 2 + .16, ctop = H + RH + .26;
    for (let j = 0; j < 4; j++) { const ya = H - .05 + j * (ctop - H + .05) / 4; b.box(cx, ya, cz, .17, (ctop - H + .05) / 4, .17, sc(ya), { nb: true }); }
    b.box(cx, ctop, cz, .21, .04, .21, DRESS, { nb: true });
    for (const dx of [-.04, .045]) b.cyl(cx + dx, ctop + .04, cz, .03, .07, 6, mix3(C.dirt, C.castle2, .5), { r2: .026, top: [.08, .07, .07] });
    if (!bad) b.emit(cx, ctop + .14, cz, "smoke", 8, .8);
    /* 正面：尖拱木门、烛光窗、提灯、门上猫头石牌 */
    archDoor(b, -.14, y0, D / 2, .21, .24, .72, {});
    lancet(b, .2, .24, D / 2, .12, .15, { off: bad });
    wallLantern(b, .03, .38, D / 2, false, bad);
    b.at(-.14, y0 + .24 + .19, D / 2 + .012); vdisc(b, 0, 0, 0, .045, 6, DRESS); b.tri([-.042, .015, .002], [-.012, .04, .002], [-.04, .06, .002], DRESS); b.tri([.012, .04, .002], [.042, .015, .002], [.04, .06, .002], DRESS); b.pop();
    /* 左山墙（朝树）一扇圆窗 */
    b.at(0, 0, 0, -PI / 2); vring(b, 0, H + .13, W / 2 + .012, .055, .085, 8, DRESS); vdisc(b, 0, H + .13, W / 2 + .008, .058, 8, bad ? INNER : WIN, bad ? undefined : { e: .45 }); b.pop();
    ivy(b, -W / 2 + .05, y0, D / 2, .22, .5, 18);
    /* 右墙根柴堆 */
    for (let i = 0; i < 7; i++) {
      const row = i < 4 ? 0 : 1, k = row ? i - 4 : i, zz = -.18 + k * .1 + row * .05, yy = .045 + row * .08;
      b.at(W / 2 + .07, yy, zz, 0, 1, 0, PI / 2); b.cyl(0, -.17, 0, .04, .34, 6, mix3(C.wood, C.castle2, R() * .4), { top: C.woodL, bot: C.woodL }); b.pop();
    }
    /* 门口：石圈火塘、三脚大铁锅 */
    const px = .2, pz = D / 2 + .3;
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU; b.box(px + Math.sin(a) * .17, 0, pz + Math.cos(a) * .17, .07, .05, .06, mix3(ST2, STD, R() * .5), { top: DRESS2 }); }
    b.disc(px, .012, pz, .14, 7, [.12, .1, .09]);
    if (!bad) {
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + .3; b.cone(px + Math.sin(a) * .05, .012, pz + Math.cos(a) * .05, .035, .09, 4, EMBER, { e: .5 }); }
      for (const a of [0, 2.1, 4.2]) rod(b, [px + Math.sin(a) * .2, 0, pz + Math.cos(a) * .2], [px + Math.sin(a) * .11, .2, pz + Math.cos(a) * .11], .02, IRON, M);
      b.cyl(px, .12, pz, .1, .11, 8, IRON, { r2: .15, mat: "metal" });
      b.cyl(px, .23, pz, .155, .03, 8, IRON, { r2: .15, mat: "metal", top: SOUP });
      b.emit(px, .32, pz, "steam", 5, .6);
    } else {                                                                /* 锅翻在地上 */
      b.at(px + .05, .13, pz + .04, .6, 1, 0, 1.35); b.cyl(0, -.07, 0, .1, .11, 8, IRON, { r2: .15, mat: "metal", nt: true }); b.pop();
      for (const a of [0, 2.1]) rod(b, [px + Math.sin(a) * .2, 0, pz + Math.cos(a) * .2], [px + Math.sin(a + .8) * .22, .04, pz + Math.cos(a + .8) * .22], .02, IRON, M);
    }
    b.pop();
  }

  /* 门口铁灯柱：石墩、铁柱、一侧弯臂吊提灯、另一侧吊一块画着猫头的木招牌 */
  function lampPost(b, x, z, ry, off) {
    b.at(x, 0, z, ry);
    b.cyl(0, 0, 0, .07, .06, 6, DRESS2, { top: DRESS });
    rod(b, [0, .05, 0], [0, .86, 0], .032, IRON, M);
    b.cone(0, .86, 0, .03, .06, 4, IRON, M);
    rod(b, [0, .8, 0], [.16, .82, 0], .016, IRON, M); rod(b, [0, .7, 0], [.1, .81, 0], .01, IRON, M);
    hangLantern(b, .15, .82, 0, .02, false, off);
    rod(b, [0, .62, 0], [-.2, .62, 0], .016, IRON, M);
    for (const sx of [-.07, -.17]) rod(b, [sx, .62, 0], [sx, .56, 0], .006, IRON, M);
    b.box(-.12, .44, 0, .17, .12, .016, OAK2, { front: OAK2, back: OAK2 });
    for (const s of [1, -1]) {
      b.at(-.12, .5, 0, s > 0 ? 0 : PI);
      vdisc(b, 0, -.004, .009, .034, 6, mix3(C.cream, C.stone, .25));
      b.tri([-.033, .006, .009], [-.012, .026, .009], [-.03, .044, .009], mix3(C.cream, C.stone, .25)); b.tri([.012, .026, .009], [.033, .006, .009], [.03, .044, .009], mix3(C.cream, C.stone, .25));
      b.pop();
    }
    b.pop();
  }
  function leafTuft(b, x, y, z, s, sere) {                   /* 一小丛叶：几片斜伸的菱形叶 */
    const c = sere ? SERE : mix3(C.leaf2, C.castle, .2);
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + R(); b.at(x, y, z, a, 1, -.55); tri2(b, [0, 0, 0], [-s * .25, s * .5, 0], [0, s, 0], c); tri2(b, [0, 0, 0], [0, s, 0], [s * .25, s * .5, 0], mix3(c, LEAFD, .3)); b.pop(); }
  }
  function mushrooms(b, x, z, n) {                          /* 树根边一小撮蘑菇 */
    for (let i = 0; i < n; i++) {
      const px = x + (R() - .5) * .14, pz = z + (R() - .5) * .14, h = .03 + R() * .03, r = .022 + R() * .018;
      b.cyl(px, 0, pz, r * .4, h, 5, mix3(C.cream, C.stone, .3), { nt: true, nb: true });
      b.cyl(px, h, pz, r, r * .5, 6, mix3(mix3(C.banner, C.wood, .45), C.castle, .25), { r2: r * .35, bot: mix3(C.cream, C.dirt, .3) });
    }
  }
  function steppers(b, list) { for (const [x, z, r] of list) b.cyl(x, 0, z, r, .025, 6, mix3(FLOOR, ST2, R() * .5), { r2: r * .9, top: mix3(FLOOR, DRESS2, R()), a0: R() }); }

  /* 主树和小树的形状 */
  const BIG = {
    pts: [[0, -.04, 0, .34], [.05, .5, .03, .29], [-.03, 1.05, -.03, .26], [.04, 1.6, .02, .23], [-.02, 2.12, -.01, .19], [.02, 2.5, -.02, .14]],
    rootA: [.8, 1.95, 3.05, 4.15, 5.35]
  };
  const SMALL = {
    pts: [[0, -.04, 0, .3], [.04, .6, .02, .25], [-.03, 1.2, -.02, .2], [.02, 1.7, 0, .15]],
    rootA: [1.2, 3.0, 4.9], sides: 7, ridges: 4,
    brs: [[[.05, 1.35, 0], [.36, 1.6, .08], [.56, 1.76, .1], .085], [[-.04, 1.45, -.02], [-.34, 1.68, -.1], [-.52, 1.86, -.08], .08]],
    cls: [[.0, 2.1, 0, .58], [.58, 1.88, .1, .42], [-.54, 1.96, -.08, .44]]
  };
  /* 小猫树：ry .59 让两侧叶团顺着左前角的切线排开，不挡待修前角；平台上趴一只猫 */
  function smallTree(b, o, X, Z, catCol, compact) {
    const S = .55, la = compact ? .25 : -.35;
    catTree(b, o, X, Z, S, {
      pts: SMALL.pts, rootA: SMALL.rootA, sides: 7, ridges: 4, ry: compact ? 3.04 : .59,
      brs: compact ? [[[.05, 1.35, 0], [.24, 1.58, .06], [.34, 1.72, .08], .08], [[-.04, 1.45, -.02], [-.22, 1.66, -.06], [-.32, 1.8, -.06], .075]] : SMALL.brs,
      cls: compact ? [[0, 2.06, 0, .62], [.34, 1.8, .08, .36], [-.32, 1.86, -.06, .38]] : SMALL.cls,
      plats: [{ y: 1.0, r: .6, n: 10, o: { a0: .1 } }],
      doors: [[-.3, 0, .12]],
      extra: bb => { const p = pt(0, 0, la, .4, 1.0); cushion(bb, p[0], 1.0, p[2], la, .3, .26, CUSH[4]); catBall(bb, p[0], 1.05, p[2], la, .17, catCol, { e: o.cyber || o.bad ? 0 : .34, sleep: 1 }); }
    });
  }

  function build94(b, o) {
    const lv = o.lv, bad = o.bad, TX = 0, TZ = -.35, P1 = .9, P2 = 1.7;
    /* 树根一圈坐台、青苔地、门前踏脚石 */
    b.disc(TX, .01, TZ, .92, 18, MOSS);
    const ringGap = [[-.42, .42]].concat(lv >= 3 ? [[1.3, 2.6]] : []);
    seatRing(b, TX, TZ, .92, 1.1, .22, ringGap);
    steppers(b, [[.04, .86, .1], [-.1, 1.08, .09], [.06, 1.3, .085]]);
    /* 大树 */
    const brs = [
      [[.1, 1.9, 0], [.6, 2.2, .02], [.92, 2.42, .08], .11],
      [[-.1, 2.0, -.02], [-.55, 2.28, -.1], [-.88, 2.48, -.2], .1],
      [[0, 2.1, -.1], [.08, 2.38, -.52], [.1, 2.56, -.82], .095],
      [[-.05, 2.2, .06], [-.3, 2.46, .38], [-.42, 2.66, .55], .08]
    ];
    const cls = lv === 1 ? [
      [.02, 2.86, -.12, .64], [1.0, 2.6, .1, .5], [-.96, 2.62, -.2, .52], [.1, 2.72, -.95, .54], [-.48, 2.84, .6, .42], [.56, 2.84, -.6, .48], [.5, 3.0, .38, .4], [-.62, 2.98, -.72, .44]
    ] : [
      [.02, 3.12, -.2, .68], [1.02, 2.72, .08, .52], [-1.0, 2.84, -.36, .52], [.12, 2.92, -1.0, .56], [-.4, 3.26, -.66, .46], [.6, 3.04, -.64, .5], [.5, 3.2, .34, .42], [.95, 3.0, -.42, .4]
    ];
    if (lv >= 2) brs[3] = [[-.05, 2.0, .04], [-.32, 2.18, .26], [-.5, 2.26, .4], .1];
    const pts = lv >= 2 ? BIG.pts.slice(0, -1).concat([[.02, 2.55, -.03, .15], [.03, 2.98, -.1, .09]]) : BIG.pts;
    catTree(b, o, TX, TZ, 1, {
      pts, rootA: BIG.rootA, brs, cls,
      plats: [
        { y: P1, r: .82, n: 16, o: { gap: [[-.98, -.62]], broken: bad ? 1.0 : null } },
        { y: P2, r: .6, n: 12, o: { gap: [[2.12, 2.48]].concat(lv >= 2 ? [[-.8, -.44]] : []), a0: .2 } }
      ],
      doors: [[0, .0, .13], [1.15, P1 + .005, .09], [.45, P2 + .005, .08]]
    });
    const T = (y) => { const c = tAt(BIG.pts, y); return [TX + c[0], TZ + c[1], c[2]]; };
    /* 绳梯：地面→下层（左前）；短木梯：下层→上层（右后） */
    { const c = T(P1); ladder(b, c[0], c[1], -.8, .88, 0, .8, P1 + .02, .17, 5, ROPE, OAK2, bad ? { snap: 1, rt: .014 } : { rt: .014 }); }
    { const c = T(P2); ladder(b, c[0], c[1], 2.3, .74, P1, .57, P2 + .02, .14, 4, OAK2, OAK2, { rt: .024 }); }
    /* 吊篮：右枝梢下吊一只（里面睡着猫）；待修时掉在地上 */
    {
      const hx = TX + .98, hz = TZ + .1, hy = 2.42;
      if (!bad) { basket(b, hx, 1.46, hz, .3, hy, CUSH[1]); catBall(b, hx, 1.548, hz, .9, .085, CAT.g, { sleep: 1, e: .36 }); }
      else { basket(b, TX + 1.18, .06, TZ + .62, .8, null, CUSH[1], { rz: 1.2 }); rod(b, [hx, hy, hz], [hx, hy - .4, hz + .02], .008, ROPE); }
    }
    /* 提灯：下层平台前沿吊一盏；门口一根铁灯柱挂猫头招牌 */
    { const c = T(P1); const p = pt(c[0], c[1], .62, .76, 0); hangLantern(b, p[0], P1 - .05, p[2], .06, false, bad); }
    lampPost(b, -.5, .78, -.9, bad);
    /* 软垫和猫 */
    { const c = T(P1); let p = pt(c[0], c[1], .15, .56, 0); cushion(b, p[0], P1, p[2], .15, .2, .16, CUSH[0]); catBall(b, p[0], P1 + .04, p[2], .25, .105, CAT.o, { sleep: 1, e: bad ? 0 : .36, cap: mix3(CAT.o, C.woodD, .25) });
      p = pt(c[0], c[1], 1.75, .58, 0); cushion(b, p[0], P1, p[2], 1.75, .18, .15, CUSH[2]); }
    { const c = T(P2); const p = pt(c[0], c[1], -.3, .42, 0); cushion(b, p[0], P2, p[2], -.3, .17, .15, CUSH[3]); catBall(b, p[0], P2 + .04, p[2], -.2, .1, CAT.w, { e: bad ? 0 : .36 }); }
    /* 树干北面的常春藤、树根边的蘑菇 */
    rivy(b, TX, TZ, y => T(y)[2], PI + .3, 1.4, .15, 1.6, 30);
    mushrooms(b, TX - .55, TZ - .45, 4); mushrooms(b, TX + .62, TZ + .2, 3);
    /* 右前晒鱼架，架下一只猫仰头看 */
    fishRack(b, 1.3, .3, -.5);
    catBall(b, 1.12, 0, .58, 2.6, .095, CAT.k, { cap: CAT.k, belly: mix3(C.cream, C.stone, .3), e: bad ? 0 : .3 });
    /* 坐台上三盆猫薄荷（陶盆、一丛叶）；树干右后一个树洞，探出一只猫 */
    for (const a of [-1.6, 2.75, 3.6]) {
      const p = pt(TX, TZ, a, 1.01, .265);
      b.cyl(p[0], p[1], p[2], .045, .07, 6, mix3(C.roofR, C.castle2, .45), { r2: .058, top: SOIL });
      for (let i = 0; i < 3; i++) leafTuft(b, p[0] + (i - 1) * .025, p[1] + .07, p[2] + (i % 2) * .02, .06, bad);
    }
    { const yk = 1.28, c = T(yk), a = 1.95; b.at(c[0], 0, c[1], a);
      b.at(0, yk, c[2] * .96, 0, [1, 1.3, 1]); vring(b, 0, 0, .012, .07, .095, 7, BARKD); vdisc(b, 0, 0, .008, .072, 7, [.08, .06, .05]); b.pop();
      if (!bad) catBall(b, 0, yk - .07, c[2] * .96 + .02, 0, .065, CAT.w, { cap: mix3(CAT.w, CAT.t, .5) });
      b.pop(); }
    /* 坐台上的小食碗 */
    { const p = pt(TX, TZ, -1.15, 1.01, .265); b.cyl(p[0], p[1], p[2], .05, .03, 7, mix3(C.cream, C.stone, .3), { r2: .065, top: mix3(SOUP, C.dirt, .3) }); }
    if (!bad) b.emit(TX + 1.1, 2.0, TZ - .5, "cat", 1, 1);
    /* Lv2：左前高枝上的树屋，上层平台一架小梯子通上去 */
    if (lv >= 2) {
      treeHouse(b, o, TX - .46, 2.27, TZ + .36, -.5);
      const c = T(P2); ladder(b, c[0], c[1], -.62, .5, P2, .55, 2.25, .12, 3, OAK2, OAK2, { rt: .02 });
      catBall(b, TX - .4, 2.27, TZ + .78, -.2, .09, CAT.t, { cap: mix3(CAT.t, C.woodD, .4), e: bad ? 0 : .34 });
    }
    /* Lv3：右后猫灯厨房；左前小猫树 */
    if (lv >= 3) {
      kitchen94(b, o, 1.3, -.88);
      smallTree(b, o, -1.35, .3, CAT.o);
      catBall(b, 1.62, 0, -.32, -.4, .095, CAT.w, { sleep: 1, e: bad ? 0 : .3 });
    }
  }

  /* ================= 2077：猫球宿舍 ================= */
  /* 环形阳台：托石挑出的一圈石板（顶面、外沿、底面）＋一圈托石；黄铜栏杆（跳过 gap，broken 那格断了耷拉） */
  function ledge(b, cx, cz, y, rIn, rOut, seg, o) {
    o = o || {};
    const th = .055, gaps = o.gap || [], inG = a => gaps.some(g => angIn(a, g[0], g[1]));
    for (let k = 0; k < seg; k++) {
      const a = k / seg * TAU, c = (k + 1) / seg * TAU, m = (a + c) / 2, out = [Math.sin(m), 0, Math.cos(m)];
      qf(b, pt(cx, cz, a, rIn, y), pt(cx, cz, c, rIn, y), pt(cx, cz, c, rOut, y), pt(cx, cz, a, rOut, y), k % 2 ? FLOOR2 : mix3(FLOOR2, ST2, R() * .6), [0, 1, 0]);
      qf(b, pt(cx, cz, a, rOut, y), pt(cx, cz, c, rOut, y), pt(cx, cz, c, rOut, y - th), pt(cx, cz, a, rOut, y - th), DRESS2, out);
      qf(b, pt(cx, cz, a, rIn, y - th), pt(cx, cz, c, rIn, y - th), pt(cx, cz, c, rOut, y - th), pt(cx, cz, a, rOut, y - th), mix3(ST2, STD, .45), [0, -1, 0]);
      if (k % 2 === 0) { b.at(cx, 0, cz, m); b.box(0, y - th - .08, rIn + (rOut - rIn) * .38, .055, .08, (rOut - rIn) * .76, DRESS2, { nb: true, front: mix3(DRESS2, ST2, .4) }); b.pop(); }
    }
    if (o.rail === false) return;
    const rr = rOut - .025, h = o.h || .16;
    for (let k = 0; k < seg; k++) {
      const a = k / seg * TAU, c = (k + 1) / seg * TAU, ga = inG(a), gc = inG(c);
      if (!ga && (k % 2 === 0 || gc || inG(a - TAU / seg))) rod(b, pt(cx, cz, a, rr, y), pt(cx, cz, a, rr, y + h + .012), .016, AGED, GL);
      if (ga || gc || inG((a + c) / 2)) continue;
      if (o.broken != null && angIn(o.broken, a, c)) { rod(b, pt(cx, cz, a, rr, y + h), pt(cx, cz, (a + c) / 2, rr + .05, y - .14), .016, AGED, GL); continue; }
      rod(b, pt(cx, cz, a, rr, y + h), pt(cx, cz, c, rr, y + h), .018, AGED, GL);
    }
  }
  /* 小圆窗：短石筒窗框（伸出墙面）、暗窗心或暖光、窗台伸出一只软垫 */
  function porthole(b, cx, cz, a, r, y, rw, lit, cc) {
    b.at(cx, 0, cz, a);
    b.at(0, y, r - .04, 0, 1, PI / 2); b.cyl(0, 0, 0, rw + .022, .062, 6, DRESS2, { nb: true, top: DRESS, a0: PI / 6 }); b.pop();
    vdisc(b, 0, y, r + .024, rw, 6, lit ? WIN : INNER, lit ? { e: .45 } : undefined);
    if (cc) b.box(0, y - rw - .028, r + .03, rw * 1.6, .03, .075, cc, { nb: true, top: mix3(cc, C.cream, .14) });
    b.pop();
  }
  /* 馒头顶：底边略外鼓、顶上圆，石板瓦一圈圈错开、深浅不一，零星长青苔；返回顶高 */
  function bunDome(b, cx, cz, y, rb, H, seg, nr) {
    const prof = i => { const ph = i / nr * PI / 2; return [rb * Math.pow(Math.cos(ph), .55), y + H * Math.sin(ph)]; };
    for (let i = 0; i < nr; i++) {
      const [ra, ya] = prof(i), [rc, yb] = prof(i + 1), off = (i % 2) * PI / seg, lift = .014;
      for (let k = 0; k < seg; k++) {
        const a = off + k / seg * TAU, c = off + (k + 1) / seg * TAU, r = R(), base = i % 2 ? SL : SL2;
        const col = r < .16 ? mix3(base, SLD, .55) : r > .94 ? mix3(base, SLM, .65) : r > .86 ? mix3(base, [.5, .52, .56], .14) : mix3(base, SLD, r * .2);
        if (rc < 1e-3) b.tri(pt(cx, cz, a, ra + lift, ya - .008), pt(cx, cz, c, ra + lift, ya - .008), [cx, yb, cz], col);
        else b.quad(pt(cx, cz, a, ra + lift, ya - .008), pt(cx, cz, c, ra + lift, ya - .008), pt(cx, cz, c, rc, yb + .01), pt(cx, cz, a, rc, yb + .01), col);
      }
    }
    return y + H;
  }
  /* 黄铜发条钥匙：顶上铜座、立柱、横鼓；钥匙杆沿 +x 伸出，弓柄（两只环）在 xy 面里，绕 x 轴慢转；待修停转、歪着 */
  function clockKey(b, x, y, z, bad) {
    b.cyl(x, y - .02, z, .085, .06, 8, BRASS, GL);
    b.cyl(x, y + .04, z, .036, .15, 6, BRASS, GL);
    b.at(x - .07, y + .23, z, 0, 1, 0, -PI / 2); b.cyl(0, 0, 0, .052, .14, 8, BRASS, Object.assign({ a0: PI / 8 }, GL)); b.pop();
    const fn = sb => {
      rod(sb, [0, 0, 0], [.17, 0, 0], .03, BRASS, GL);
      sb.at(.04, 0, 0, 0, 1, 0, -PI / 2); sb.cyl(0, 0, 0, .04, .022, 8, BRASS, GL); sb.pop();
      for (const s of [-1, 1]) { sb.at(.25, s * .095, 0, 0, 1, PI / 2); sb.torus(0, 0, 0, .075, .02, 10, 3, BRASS, GL); sb.pop(); }
      sb.box(.25, -.035, 0, .06, .07, .024, BRASS, GL);
    };
    if (bad) { b.at(x + .07, y + .23, z, 0, 1, .7); fn(b); b.pop(); } else b.spin(x + .07, y + .23, z, "x", .35, fn);
  }
  /* 一座环台圆塔：T = { x, z, y0, th, rs[], seg, ledges:[{gap, broken}], ... }；返回各层阳台高度 */
  function ringTower(b, T) {
    const n = T.rs.length, ys = [];
    b.cyl(T.x, 0, T.z, T.rs[0] + .1, .06, T.seg, mix3(ST2, STD, .4), { top: DRESS2, a0: PI / T.seg });
    b.cyl(T.x, .06, T.z, T.rs[0] + .05, T.y0 - .06, T.seg, DRESS2, { r2: T.rs[0] + .02, top: FLOOR });
    for (let i = 0; i < n; i++) {
      const ya = T.y0 + i * T.th, yb = ya + T.th;
      shaft(b, T.x, T.z, T.rs[i], T.rs[i] - .006, ya, yb, T.seg, T.th / 3);
      ys.push(yb);
      if (i < n - 1) ledge(b, T.x, T.z, yb, T.rs[i + 1] - .02, T.rs[i] + T.lw, T.seg, T.ledges[i]);
    }
    /* 檐口：一圈托石、线脚 */
    const yt = T.y0 + n * T.th, rt = T.rs[n - 1];
    for (let k = 0; k < T.seg; k++) { b.at(T.x, 0, T.z, (k + .5) / T.seg * TAU); b.box(0, yt - .1, rt + .03, .055, .08, .08, DRESS2, { nb: true }); b.pop(); }
    b.cyl(T.x, yt - .02, T.z, rt + .08, .07, T.seg, DRESS2, { top: SLD, a0: PI / T.seg });
    return { ys, yt: yt + .05, rt };
  }
  /* 绳桥：木踏板一块块、两道麻绳扶手、吊绳；待修断在中间，两头各垂下去一截 */
  function ropeBridge(b, A, B, w, n, sag, bad) {
    const d = sub(B, A), L = Math.hypot(d[0], d[2]), u = [d[0] / L, 0, d[2] / L], T = [-u[2], 0, u[0]], ry = Math.atan2(u[0], u[2]);
    const at = t => [A[0] + d[0] * t, lerp(A[1], B[1], t) - sag * 4 * t * (1 - t), A[2] + d[2] * t];
    if (!bad) {
      for (let i = 0; i < n; i++) { const p = at((i + .5) / n); b.at(p[0], p[1] - .025, p[2], ry); b.box(0, 0, 0, w, .022, L / n * .78, i % 2 ? PLANK : PLANK2, { top: i % 3 ? PLANK : PLANK2 }); b.pop(); }
      for (const s of [-1, 1]) {
        const hp = t => { const p = at(t); return [p[0] + T[0] * s * w * .5, p[1] + .2 - sag * 1.2 * t * (1 - t), p[2] + T[2] * s * w * .5]; };
        for (let i = 0; i < 6; i++) rod(b, hp(i / 6), hp((i + 1) / 6), .012, ROPE);
        for (let i = 1; i < 6; i++) { const p = at(i / 6); rod(b, [p[0] + T[0] * s * w * .5, p[1] - .02, p[2] + T[2] * s * w * .5], hp(i / 6), .007, ROPE); }
      }
      for (const s of [-1, 1]) rod(b, [at(0)[0] + T[0] * s * w * .5, at(0)[1] - .03, at(0)[2] + T[2] * s * w * .5], [at(1)[0] + T[0] * s * w * .5, at(1)[1] - .03, at(1)[2] + T[2] * s * w * .5], .006, ROPE);
    } else {
      for (const [E, dir] of [[A, 1], [B, -1]]) {
        const m = Math.round(n * .35);
        for (let i = 0; i < m; i++) {
          const y = E[1] - .06 - i * L / n * .9;
          b.at(E[0] + u[0] * dir * .04, y, E[2] + u[2] * dir * .04, ry, 1, PI / 2 - .12 * dir); b.box(0, -.011, 0, w, .022, L / n * .78, i % 2 ? PLANK : PLANK2); b.pop();
        }
        for (const s of [-1, 1]) rod(b, [E[0] + T[0] * s * w * .5, E[1] + .18, E[2] + T[2] * s * w * .5], [E[0] + T[0] * s * w * .45 + u[0] * dir * .05, E[1] - m * L / n * .9 - .04, E[2] + T[2] * s * w * .45 + u[2] * dir * .05], .012, ROPE);
      }
    }
  }
  /* 黄铜吊臂＋滑轮＋送餐吊篮（吊篮慢慢上下；待修时吊篮掉在地上、绳子垂着） */
  function pulley(b, cx, cz, a, r0, y, r1, yb, bad) {
    const top = y + .34, P0 = pt(cx, cz, a, r0, y), P1 = pt(cx, cz, a, r0, top), P2 = pt(cx, cz, a, r1, top);
    rod(b, P0, P1, .03, BRASS, GL);
    rod(b, P1, P2, .03, BRASS, GL);
    rod(b, pt(cx, cz, a, r0, y + .12), pt(cx, cz, a, lerp(r0, r1, .55), top), .02, BRASS, GL);
    b.sphere(P1[0], P1[1], P1[2], .028, 5, BRASS, GL);
    const W0 = pt(cx, cz, a, r1, top - .07);
    b.at(W0[0], W0[1], W0[2], a, 1, 0, PI / 2); b.torus(0, 0, 0, .055, .014, 10, 3, BRASS, GL); b.cyl(0, -.02, 0, .018, .04, 6, BRASS, GL); b.pop();
    rod(b, [P2[0], top, P2[2]], [W0[0], W0[1] + .05, W0[2]], .012, BRASS, GL);
    const Wx = W0[0] + Math.sin(a) * .055, Wz = W0[2] + Math.cos(a) * .055;
    const hang = sb => {
      rod(sb, [0, W0[1] - yb, 0], [0, .17, 0], .008, ROPE);
      basket(sb, 0, 0, 0, a, .17, CUSH[2]);
      for (let i = 0; i < 3; i++) sb.sphere(Math.sin(i * 2.1) * .045, .11, Math.cos(i * 2.1) * .045, .035, 5, i === 1 ? FISH : mix3(C.hay, C.cream, .3));
    };
    if (bad) { rod(b, [Wx, W0[1], Wz], [Wx, .45, Wz], .008, ROPE); basket(b, Wx + .12, .06, Wz + .1, a + .6, null, CUSH[2], { rz: 1.3 }); }
    else b.bob(Wx, yb, Wz, .06, .35, hang);
  }
  /* 猫灯厨房（2077 Lv3）：料石墙、黄铜框玻璃橱窗和玻璃门、石板瓦人字顶、黄铜烟囱、门边黄铜猫头招牌；里面暖光的炉台 */
  function kitchen77(b, o, X, Z) {
    const bad = o.bad, W = .8, D = .56, H = .62, RH = .3, ov = .07, y0 = .07, zf = D / 2;
    b.at(X, 0, Z);
    b.box(0, 0, 0, W + .06, y0, D + .06, mix3(ST2, STD, .4), { top: DRESS2 });
    b.at(0, 0, 0, PI); mason(b, () => [-W / 2, W / 2], y0, H, D / 2, { ql: 1, qr: 1 }); b.pop();
    for (const s of [-1, 1]) { b.at(0, 0, 0, s * PI / 2); mason(b, y => y <= H + 1e-6 ? [-D / 2, D / 2] : [-D / 2 * (1 - (y - H) / RH), D / 2 * (1 - (y - H) / RH)], y0, H + RH, W / 2, { rh: .14, ql: 1, qr: 1 }); b.pop(); }
    /* 正面：两端料石墙垛、矮石槛墙、玻璃橱窗三格＋中间玻璃门、楣梁 */
    for (const s of [-1, 1]) { b.at(s * (W / 2 - .06), 0, 0); mason(b, () => [-.06, .06], y0, H, zf, { rh: .12 }); b.pop(); }
    const gx0 = -W / 2 + .12, gx1 = W / 2 - .12, ys = .2, yt = H - .1;
    b.at(0, 0, zf - .03); mason(b, () => [gx0, gx1], y0, ys, 0, { rh: .065 }); b.pop();
    b.box(0, ys, zf - .03, gx1 - gx0 + .02, .02, .1, DRESS, { nb: true });
    b.box(0, yt, zf - .02, W - .02, H - yt, .06, DRESS2, { nb: true, front: mix3(DRESS2, ST2, .2) });
    /* 里面：暗墙、地板、暖光炉台、一层搁板 */
    b.panel(0, y0, -D / 2 + .02, W - .04, H - y0, INNER);
    for (const s of [-1, 1]) { b.at(0, 0, 0, s * PI / 2); b.panel(0, y0, -W / 2 + .02, D - .04, H - y0, mix3(INNER, STD, .3)); b.pop(); }
    b.box(0, y0, 0, W - .04, .005, D - .04, mix3(FLOOR2, OAK, .4), { nb: true });
    b.box(-.12, y0, -D / 2 + .12, .3, .2, .16, mix3(STD, IRON, .4), { front: bad ? INNER : WIN, top: IRON });
    if (!bad) b.box(-.12, y0 + .04, -D / 2 + .201, .2, .08, .002, EMBER, { e: .5 });
    b.box(.18, .36, -D / 2 + .06, .32, .02, .08, OAK2);
    for (let i = 0; i < 4; i++) b.cyl(.06 + i * .08, .38, -D / 2 + .06, .022, .06, 6, [mix3(C.cream, C.stone, .3), mix3(C.glass, C.stone, .4), BRASS, mix3(C.banner, C.castle, .4)][i]);
    const bays = [[gx0, -.09], [-.09, .09], [.09, gx1]], doorBay = 1;
    bays.forEach(([x0, x1], i) => {
      const yb = i === doorBay ? y0 + .005 : ys + .02, broken = bad && i !== doorBay;
      if (!broken || i === 0) b.quad([x0, yb, zf], [x1, yb, zf], [x1, yt, zf], [x0, yt, zf], GLASS, GLS);
      if (i !== doorBay) for (const fx of [.34, .67]) rod(b, [lerp(x0, x1, fx), yb, zf + .005], [lerp(x0, x1, fx), yt, zf + .005], .01, BRASS, GL);
      rod(b, [x0, yb + (yt - yb) * .7, zf + .006], [x1, yb + (yt - yb) * .7, zf + .006], .01, BRASS, GL);
    });
    for (const x of [gx0, -.09, .09, gx1]) rod(b, [x, y0, zf + .006], [x, yt, zf + .006], .022, BRASS, GL);
    rod(b, [gx0, yt, zf + .008], [gx1, yt, zf + .008], .024, BRASS, GL);
    rod(b, [gx0, ys + .02, zf + .008], [-.09, ys + .02, zf + .008], .02, BRASS, GL); rod(b, [.09, ys + .02, zf + .008], [gx1, ys + .02, zf + .008], .02, BRASS, GL);
    b.box(.06, .3, zf + .01, .012, .07, .014, BRASS, GL);
    b.box(0, 0, zf + .1, .24, .02, .14, mix3(ST2, FLOOR, .5), { top: FLOOR });
    /* 屋顶 */
    b.at(0, 0, 0, PI / 2);
    slope(b, [D / 2 + ov, H - .02], [0, H + RH + .012], -W / 2 - ov, W / 2 + ov);
    slope(b, [-D / 2 - ov, H - .02], [0, H + RH + .012], -W / 2 - ov, W / 2 + ov);
    rod(b, [0, H + RH + .02, -W / 2 - ov], [0, H + RH + .02, W / 2 + ov], .034, BRASS, GL);
    b.pop();
    /* 黄铜烟囱：一节节管子、两道箍、风帽 */
    const sx = W / 2 - .17, sz = -D / 2 + .14, st = H + RH + .28;
    b.cyl(sx, H - .05, sz, .045, st - H + .05, 8, BRASS, GL);
    for (const yy of [H + RH * .5, st - .1]) b.cyl(sx, yy, sz, .055, .025, 8, mix3(BRASS, C.woodD, .2), GL);
    b.cyl(sx, st, sz, .085, .03, 8, BRASS, Object.assign({ nb: false }, GL));
    b.cone(sx, st + .05, sz, .085, .07, 8, BRASS, GL);
    for (let k = 0; k < 3; k++) { const a = k / 3 * TAU; rod(b, [sx + Math.sin(a) * .045, st + .03, sz + Math.cos(a) * .045], [sx + Math.sin(a) * .07, st + .06, sz + Math.cos(a) * .07], .008, BRASS, GL); }
    if (!bad) b.emit(sx, st + .14, sz, "smoke", 7, .75);
    /* 门边黄铜猫头招牌：墙上挑出的弯臂吊一块圆牌 */
    const hx = W / 2 - .06, hy = H - .02;
    rod(b, [hx, hy, zf + .01], [hx, hy, zf + .22], .016, BRASS, GL);
    rod(b, [hx, hy - .1, zf + .01], [hx, hy, zf + .12], .01, BRASS, GL);
    b.at(hx, hy - .17, zf + .17, PI / 2);
    for (const s of [1, -1]) {
      b.at(0, 0, 0, s > 0 ? 0 : PI);
      vdisc(b, 0, 0, .008, .065, 8, BRASS, GL);
      b.tri([-.06, .025, .008], [-.02, .055, .008], [-.055, .09, .008], BRASS, GL); b.tri([.02, .055, .008], [.06, .025, .008], [.055, .09, .008], BRASS, GL);
      for (const ex of [-.022, .022]) b.panel(ex, .005, .011, .014, .018, [.2, .17, .14]);
      b.pop();
    }
    rod(b, [0, .06, 0], [0, .1, 0], .006, BRASS, GL);
    b.pop();
    wallLantern(b, -W / 2 + .06, .42, zf, true, bad);
    ivy(b, W / 2 - .05, y0, zf, .14, .45, 10);
    b.pop();
  }

  function build77(b, o) {
    const lv = o.lv, bad = o.bad, MX = -.3, MZ = -.45;
    const RS = [.8, .76, .72, .67], TH = .5, Y0 = .12, LW = .17;
    const aB = Math.atan2(1.4 - MX, -1.2 - MZ);                           /* 绳桥方向（朝第二座塔） */
    const aP = .45, LAD = [[-.55, 0], [1.25, 1]];                          /* 吊臂、梯子的角度 */
    const ledges = [
      { gap: [[LAD[0][0] - .16, LAD[0][0] + .16]], broken: bad ? .9 : null },
      { gap: [[LAD[1][0] - .16, LAD[1][0] + .16]].concat(lv >= 2 ? [[aB - .2, aB + .2]] : []) },
      { gap: lv >= 2 ? [[aP - .14, aP + .14]] : [] }
    ];
    const tw = ringTower(b, { x: MX, z: MZ, y0: Y0, th: TH, rs: RS, seg: 16, lw: LW, ledges });
    const yD = tw.yt;
    /* 馒头顶、发条钥匙 */
    const top = bunDome(b, MX, MZ, yD, tw.rt + .1, .6, 16, 6);
    clockKey(b, MX, top - .01, MZ, bad);
    /* 正门：圆拱门、台阶、两盏黄铜壁灯、门楣黄铜猫头牌 */
    b.at(MX, 0, MZ);
    archDoor(b, 0, Y0, RS[0] - .02, .26, .26, .5, { knob: BRASS });
    { const yh = Y0 + .5, zh = RS[0] - .03, hw = .2, dd = .22;                /* 门上一顶石板瓦单坡小雨棚：两根黄铜托架 */
      for (const s of [-1, 1]) { rod(b, [s * hw * .8, yh - .17, zh], [s * hw * .8, yh - .02, zh + dd * .85], .014, AGED, GL); rod(b, [s * hw * .8, yh + .05, zh], [s * hw * .8, yh - .02, zh + dd * .85], .014, AGED, GL); }
      b.at(0, 0, 0, -PI / 2); slope(b, [zh + dd, yh - .02], [zh - .01, yh + .12], -hw - .04, hw + .04, { cw: .1, nb: 2 }); b.pop();
    }
    b.box(0, 0, RS[0] + .14, .44, Y0 * .5, .22, DRESS2, { top: FLOOR });
    for (const s of [-1, 1]) { b.at(0, 0, 0, s * .36); wallLantern(b, 0, .5, RS[0] - .02, true, bad); b.pop(); }
    b.at(0, Y0 + .26 + .19, RS[0] + .005);
    vdisc(b, 0, 0, 0, .06, 8, BRASS, GL);
    b.tri([-.055, .022, .002], [-.018, .05, .002], [-.05, .085, .002], BRASS, GL); b.tri([.018, .05, .002], [.055, .022, .002], [.05, .085, .002], BRASS, GL);
    for (const ex of [-.02, .02]) b.panel(ex, .004, .004, .013, .017, [.2, .17, .14]);
    b.pop();
    b.pop();
    /* 小圆窗：每层一圈（避开门、梯子、桥、吊臂），个别透暖光 */
    const skip = (i, a) => (i === 0 && Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 1.0) || LAD.some(([la, li]) => (li === i || li + 1 === i) && Math.abs(Math.atan2(Math.sin(a - la), Math.cos(a - la))) < .3)
      || (lv >= 2 && i === 2 && Math.abs(Math.atan2(Math.sin(a - aP), Math.cos(a - aP))) < .3);
    let wc = 0;
    for (let i = 0; i < 4; i++) {
      const y = Y0 + i * TH + TH * .5, r = RS[i];
      for (let k = 0; k < 7; k++) {
        const a = k / 7 * TAU + i * .45 + .2;
        if (skip(i, a)) continue;
        const lit = !bad && (wc % 5 === 2);
        porthole(b, MX, MZ, a, r, y, .06, lit, CUSH[(wc + i) % CUSH.length]);
        wc++;
      }
    }
    /* 门两侧一对尖拱烛光窗 */
    for (const s of [-1, 1]) { b.at(MX, 0, MZ, s * .78); lancet(b, 0, Y0 + .13, RS[0] - .03, .09, .16, { off: bad, e: .45 }); b.pop(); }
    /* 阳台之间的黄铜小梯 */
    for (const [a, i] of LAD) ladder(b, MX, MZ, a, RS[i + 1] + .12, Y0 + (i + 1) * TH, RS[i + 1] + .02, Y0 + (i + 2) * TH + .02, .12, 4, AGED, AGED, { rt: .014, rr: .012, mo: GL });
    /* 常春藤：塔脚北面 */
    rivy(b, MX, MZ, () => RS[0], PI - .5, 1.3, Y0, .9, 26);
    /* 猫和软垫：阳台上、窗台上 */
    { const y = Y0 + TH, p = pt(MX, MZ, .3, RS[1] + .1, y); cushion(b, p[0], y, p[2], .3, .17, .14, CUSH[0]); catBall(b, p[0], y + .035, p[2], .3, .1, CAT.o, { sleep: 1, cap: mix3(CAT.o, C.woodD, .25) }); }
    { const y = Y0 + 2 * TH, p = pt(MX, MZ, -.3, RS[2] + .1, y); cushion(b, p[0], y, p[2], -.3, .16, .14, CUSH[3]); catBall(b, p[0], y + .035, p[2], -.5, .095, CAT.w, {}); }
    { const y = Y0 + 3 * TH, p = pt(MX, MZ, .95, RS[3] + .1, y); catBall(b, p[0], y, p[2], .95, .09, CAT.k, { cap: CAT.k, belly: mix3(C.cream, C.stone, .3) }); }
    { const y = Y0 + 2 * TH + TH * .5, a = 2 * TAU / 7 + 2 * .45 + .2 - TAU / 7, p = pt(MX, MZ, a, RS[2] + .05, y - .09); catBall(b, p[0], p[1], p[2], a, .07, CAT.g, {}); }
    /* 阳台上两只黄铜花槽（猫薄荷） */
    for (const [a, i] of [[-.95, 1], [.3, 2]]) {
      const y = Y0 + (i + 1) * TH, p = pt(MX, MZ, a, RS[i] + .1, y);
      b.at(p[0], y, p[2], a); b.box(0, 0, 0, .2, .07, .08, AGED, { top: SOIL, mat: "gloss" }); b.pop();
      for (let k = 0; k < 3; k++) { const q = pt(p[0], p[2], a + PI / 2, (k - 1) * .06, 0); leafTuft(b, q[0], y + .07, q[2], .07, bad); }
    }
    /* 门口：铜食碗、水碗 */
    { const p = pt(MX, MZ, .55, RS[0] + .2, 0); b.cyl(p[0], 0, p[2], .045, .03, 8, BRASS, { r2: .06, top: mix3(SOUP, C.dirt, .3), mat: "gloss" }); b.cyl(p[0] + .13, 0, p[2] + .02, .045, .03, 8, BRASS, { r2: .06, top: [.32, .42, .48], mat: "gloss" }); }
    /* 左前小猫树 */
    smallTree(b, o, -1.4, .42, CAT.t, true);
    /* 猫球灯：门口一盏、顶边一盏 */
    if (!bad) { b.emit(MX - .82, .95, MZ + .98, "cat", 1, 1); b.emit(MX - .75, top + .05, MZ + .2, "cat", 1, .9); }
    /* Lv2：第二座矮环台塔、绳桥、吊臂滑轮 */
    if (lv >= 2) {
      const SX = 1.4, SZ = -1.2, RS2 = [.4, .38, .36, .34], TH2 = .36, Y2 = .1, LW2 = .12, aBb = aB + PI;
      const tw2 = ringTower(b, { x: SX, z: SZ, y0: Y2, th: TH2, rs: RS2, seg: 12, lw: LW2, ledges: [{ gap: [[-.5, -.2]] }, { rail: true }, { gap: [[aBb - .3, aBb + .3]] }] });
      const top2 = bunDome(b, SX, SZ, tw2.yt, tw2.rt + .08, .36, 12, 5);
      airship(b, SX, top2, SZ, .6);
      for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) {
        const a = k / 3 * TAU + i * .9 + .3;
        if (Math.abs(Math.atan2(Math.sin(a - aBb), Math.cos(a - aBb))) < .4) continue;
        porthole(b, SX, SZ, a, RS2[i], Y2 + i * TH2 + TH2 * .5, .045, false, (i + k) % 2 ? CUSH[(i + k) % 5] : null);
      }
      archDoor(b, SX + Math.sin(-.35) * (RS2[0] - .02), Y2, SZ + Math.cos(-.35) * (RS2[0] - .02), .16, .18, .5, { knob: BRASS });
      ladder(b, SX, SZ, -.35, RS2[1] + .09, Y2 + TH2, RS2[1] + .02, Y2 + 2 * TH2 + .02, .1, 3, AGED, AGED, { rt: .012, rr: .01, mo: GL });
      { const y = Y2 + TH2, p = pt(SX, SZ, .6, RS2[1] + .07, y); catBall(b, p[0], y, p[2], .6, .085, CAT.w, { sleep: 1 }); }
      const A = pt(MX, MZ, aB, RS[1] + LW - .03, Y0 + 2 * TH), B = pt(SX, SZ, aBb, RS2[3] + LW2 - .02, Y2 + 3 * TH2);
      ropeBridge(b, A, B, .16, 7, .06, bad);
      pulley(b, MX, MZ, aP, RS[2] + .05, Y0 + 3 * TH, 1.18, 1.08, bad);
    }
    /* Lv3：右前塔脚的玻璃门面猫灯厨房 */
    if (lv >= 3) kitchen77(b, o, .95, .17);
  }

  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = Object.assign({}, o, { lv, cyber: cy, bad });
    reseed(lv * 2 + (cy ? 1 : 0));
    if (cy) build77(b, oo); else build94(b, oo);
  }
  build.h = o => (o.cyber ? [0, 3.38, 3.38, 3.38] : [0, 3.52, 3.81, 3.81])[Math.max(1, Math.min(3, o.lv || 1))];   /* 最高点＋.2：1994 树冠顶，2077 发条钥匙弓柄顶 */
  Isle3D.FAC["猫舍"] = build;
})();
