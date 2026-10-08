/* 兵营（1994 兵营 / 2077 仆从营）：霍格沃茨式的石砌营房和沙地操场。
   1994 Lv1：后边一座两层石砌长营房（风化灰石错缝砌、转角隅石、石台基、两层之间一道腰线），深蓝灰石板瓦陡顶（一道道瓦层、换过的新瓦和长苔的旧瓦），
             两头是带压顶石和尖顶饰的石山墙，屋脊一排铁花、两根熏黑的石烟囱（一根冒烟）；
             正面两排小尖拱烛光窗，正中一面带压顶石的小山墙，下面是尖拱铁钉木门加石板瓦披檐和两盏铁壁灯；右边一道外挂木楼梯通二楼门，
             墙角爬常春藤。前面一片沙地操场：木边框、三根木人桩（立柱、横木、草把）、一架立着长枪的兵器架、一只低饱和的同心环箭靶、
             右边一根铁顶木旗杆挂深蓝旗、一只石砌饮水槽。
   1994 Lv2：右后加一座覆草的墓穴土丘——石砌尖拱门里是暗的，门两边各一只石瓮、一盏铁灯柱，丘顶一块小石碑（亡灵兵装罐存放）；
             左端加一座两层方形军械塔：隅石、箭孔、尖拱窗、铁钉门、门上交叉长剑的盾徽、托石挑檐、四坡石板瓦顶和铁尖饰。
   1994 Lv3：左前加一座军官小楼：石砌底层、挑出来的半木上层、凸窗和暖窗灯、条纹遮阳篷、门边长椅、小烟囱，屋脊上一座小钟亭挂小旗；
             营房正面小山墙上加一面钟。
   2077（仆从营）：同一套石头房子。木人桩换成黄铜训练桩（青铜鼓身、黄铜箍、三根错开的皮包短臂，静止；不做人形，用户嫌小人惊悚），操场加两个法术训练靶圈（立柱上一只黄铜环，
             环里一圈淡淡的符文，e .3、往石色混过）；窗框改黄铜；门上的石板瓦披檐换成黄铜骨架的玻璃雨棚；屋脊立一只黄铜小飞艇风标（不转）；
             门口一盏猫球灯；Lv2 墓穴门口加两只黄铜箍的密封储罐（不开窗）；Lv3 军官小楼的遮阳篷换成一间黄铜框玻璃小花房。不加霓虹、不加全息、不加罩子。
   待修：渲染器统一压暗；模型里旗杆歪倒、一根木人桩（训练桩）倒在沙地上、箭靶歪斜、烟囱不冒烟。前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLM = mix3(SL, SL2, .5), SLD = mix3(SL, [.08, .08, .1], .4);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), BRASSF = mix3(mix3(C.gold, [.46, .34, .2], .3), C.castleD, .35), IRON = mix3(C.iron, [.1, .1, .12], .3), BRONZE = mix3(C.gold, C.wood, .38);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), BOARD = mix3(C.plank, C.woodD, .4);
  const OLDW = mix3(C.wood, [.55, .52, .48], .35), OLDWD = mix3(C.woodD, [.4, .38, .36], .25);
  const DAUB = mix3(C.plaster, [.76, .71, .62], .4), MULL = mix3(IRON, OAK, .3);
  const DOORW = mix3(C.woodD, C.wood, .25), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const SAND = mix3(mix3(C.dirt, C.hay, .3), C.stone, .32), SANDD = mix3(SAND, C.dirt, .5), SANDL = mix3(SAND, C.cream, .25);
  const TURF = mix3(C.grass, [.46, .52, .3], .3), TURFD = mix3(TURF, C.ivy, .5), STRAW = mix3(mix3(C.hay, C.dirt, .45), C.stone, .2), STRAWD = mix3(STRAW, C.woodD, .35);
  const POT = mix3(C.roofR, STD, .45), ROPE = [.66, .57, .42];
  const RUNE = mix3(mix3(C.crystal2, C.glow, .35), C.stone, .58);           /* 法术靶圈的符文：低饱和，往石色混过 */
  const GLASS = mix3(C.glass, [.78, .88, .84], .3);
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  /* ---------- 石头颜色 ---------- */
  function sc(y) {                                          /* 一块石头：深浅、冷暖不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .45 + r * .5);
    if (r2 < .3) c = mix3(c, [.58, .53, .45], .28); else if (r2 > .76) c = mix3(c, [.45, .47, .5], .28);
    if (r > .92) c = mix3(c, STD, .4); else if (r < .05) c = mix3(c, DRESS, .35);
    return mix3(c, mix3(STD, C.ivy, .35), Math.max(0, Math.min(.3, (.55 - y) * .5)));
  }

  /* ---------- 小工具 ---------- */
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
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function along(b, p, q) {                                 /* 以 p 为原点、p→q 为 y 轴推一层变换，返回长度 */
    const d = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], L = Math.hypot(d[0], d[1], d[2]);
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    return L;
  }
  function bar(b, p, q, t, col, o) {                        /* 细方条，不封两头（栏杆、横杆、枪杆） */
    const L = along(b, p, q), h = t / 2;
    if (L > 1e-6) {
      b.quad([-h, 0, h], [h, 0, h], [h, L, h], [-h, L, h], col, o); b.quad([h, 0, -h], [-h, 0, -h], [-h, L, -h], [h, L, -h], col, o);
      b.quad([h, 0, h], [h, 0, -h], [h, L, -h], [h, L, h], col, o); b.quad([-h, 0, -h], [-h, 0, h], [-h, L, h], [-h, L, -h], col, o);
    }
    b.pop();
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）错缝砌；hw(y) 给左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .16, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .11 : .2) : 0, q1 = o.qr ? ((j + ph) % 2 ? .2 : .11) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
      while (x < Rr - (q1 ? q1 + .07 : .07)) { cuts.push(x); x += .19 + R() * .22; }
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
  function corbel(b, x, y, z) { cbox(b, x, y - .11, z - .02, .05, .06, z + .035, DRESS2); cbox(b, x, y - .05, z - .02, .065, .05, z + .065, DRESS2); }
  function wedge(b, w, y, zIn, zOut, hIn, hOut, col, top) {  /* 扶壁的斜顶块（沿 z 往外收） */
    const x0 = -w / 2, x1 = w / 2;
    qf(b, [x0, y, zOut], [x1, y, zOut], [x1, y + hOut, zOut], [x0, y + hOut, zOut], col, [0, 0, 1]);
    qf(b, [x0, y + hOut, zOut], [x1, y + hOut, zOut], [x1, y + hIn, zIn], [x0, y + hIn, zIn], top || DRESS2, [0, 1, 1]);
    for (const s of [-1, 1]) qf(b, [s * w / 2, y, zIn], [s * w / 2, y, zOut], [s * w / 2, y + hOut, zOut], [s * w / 2, y + hIn, zIn], col, [s, 0, 0]);
  }
  function buttress(b, x, z, ry, h) {                       /* 两级扶壁 */
    b.at(x, 0, z, ry);
    wedge(b, .15, 0, -.02, .2, h * .5, h * .36, mix3(ST2, STD, .3));
    wedge(b, .11, 0, -.02, .12, h, h * .86, sc(.6));
    b.pop();
  }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、楔石、券底、拱心石 */
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
    }
    const kt = archY(w + fr * 2, p, 0);
    b.box(0, h + kt - .065, (z0 + z1) / 2 + .008, .065, .09, z1 - z0 + .016, DRESS, { nb: true });
  }

  /* ---------- 屋顶 ---------- */
  function slateRoof(b, W, Hw, D, Hr, ov, o) {               /* 石板瓦人字顶（屋脊沿 x）：一道道瓦层（下沿翘起、露暗瓦口），换过的新瓦、长苔的旧瓦，封檐板 */
    o = o || {};
    const sl = Hr / (D / 2), ze = D / 2 + ov, ye = Hw - ov * sl, yR = Hw + Hr, nb = o.bands || 6, xa = -W / 2, xb = W / 2, lip = .016;
    for (const s of [-1, 1]) {
      if (o.only && o.only !== s) continue;
      const nn = Math.hypot(ze, yR - ye), nY = ze / nn, nZ = s * (yR - ye) / nn, dn = [0, -(yR - ye), s * ze];
      for (let i = 0; i < nb; i++) {
        const t0 = i / nb, t1 = (i + 1) / nb, zr = s * ze * (1 - t0), yr = ye + (yR - ye) * t0, za = zr + nZ * lip, ya = yr + nY * lip, zb = s * ze * (1 - t1), yb = ye + (yR - ye) * t1;
        qf(b, [xa, ya, za], [xb, ya, za], [xb, yb, zb], [xa, yb, zb], i % 2 ? SL : SLM, [0, 1, s]);
        qf(b, [xa, yr, zr], [xb, yr, zr], [xb, ya, za], [xa, ya, za], SLD, dn);
      }
      for (let k = 0; k < (o.patches != null ? o.patches : 6); k++) {
        const i = Math.floor(R() * nb), t0 = i / nb, t1 = (i + 1) / nb, w = .08 + R() * .16, x0 = xa + .06 + R() * (xb - xa - .12 - w);
        const lo = [s * ze * (1 - t0) + nZ * lip, ye + (yR - ye) * t0 + nY * lip], hi = [s * ze * (1 - t1), ye + (yR - ye) * t1], u0 = .12, u1 = .5 + R() * .4;
        const P = u => [lo[1] + (hi[1] - lo[1]) * u + nY * .004, lo[0] + (hi[0] - lo[0]) * u + nZ * .004];
        const A = P(u0), Bq = P(u1), c = R() < .35 ? mix3(SLM, C.ivy, .3) : R() < .5 ? mix3(SL, SL2, .75) : mix3(SL, SLD, .6);
        qf(b, [x0, A[0], A[1]], [x0 + w, A[0], A[1]], [x0 + w, Bq[0], Bq[1]], [x0, Bq[0], Bq[1]], c, [0, 1, s]);
      }
      qf(b, [xa, ye, s * ze], [xb, ye, s * ze], [xb, Hw, s * D / 2], [xa, Hw, s * D / 2], OLDWD, [0, -1, 0]);
      b.beam([xa, ye - .016, s * ze], [xb, ye - .016, s * ze], .032, OLDWD);
    }
    if (!o.noridge) { b.at(0, yR + .012, 0, 0, 1, PI / 4); b.box(0, -.03, 0, W + .02, .06, .06, SL2); b.pop(); }
    return yR;
  }
  function coping(b, x, Hw, D, Hr, ov, fin) {                /* 山墙压顶石、墙肩托石、山尖尖顶饰 */
    const sl = Hr / (D / 2), yR = Hw + Hr, o2 = ov + .02;
    for (const f of [-1, 1]) {
      b.beam([x, Hw - o2 * sl + .05, f * (D / 2 + o2)], [x, yR + .07, 0], .1, DRESS);
      b.box(x, Hw - .14, f * (D / 2 + .03), .14, .16, .17, DRESS2, { nb: true });
    }
    if (fin !== false) { b.box(x, yR + .09, 0, .1, .07, .1, DRESS); b.pyramid(x, yR + .16, 0, .1, .1, .17, DRESS2); }
  }
  function cresting(b, x0, x1, y, z, cy) {                  /* 屋脊上一排铁花（2077 黄铜） */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M, n = Math.max(2, Math.round((x1 - x0) / .24));
    for (let i = 0; i <= n; i++) { const x = x0 + i * (x1 - x0) / n; b.beam([x, y, z], [x, y + .08, z], .012, fr, fo); b.pyramid(x, y + .08, z, .03, .012, .045, fr, fo); }
    b.beam([x0, y + .055, z], [x1, y + .055, z], .009, fr, fo);
  }
  function hipRoof(b, x, y, z, w, h, cy) {                  /* 四坡石板瓦顶：翘一点的檐口、一道道深浅瓦带、铁尖饰 */
    const r = w / Math.SQRT2, a0 = PI / 4, nb = 5;
    b.cyl(x, y, z, r * 1.06, .05, 4, SL2, { r2: r * .99, nt: true, a0, bot: OLDWD });
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .99 * (1 - t0), rb = r * .99 * (1 - t1), col = i % 2 ? SL : SLM;
      if (i === nb - 1) b.cone(x, y + .05 + (h - .05) * t0, z, ra, (h - .05) * (t1 - t0), 4, col, { nb: true, a0 });
      else b.cyl(x, y + .05 + (h - .05) * t0, z, ra, (h - .05) * (t1 - t0), 4, col, { r2: rb, nt: true, nb: true, a0 });
      if (i < nb - 1) b.cyl(x, y + .05 + (h - .05) * t1 - .012, z, rb + .012, .012, 4, SLD, { r2: rb, nt: true, nb: true, a0 });
    }
    for (let f = 0; f < 4; f++) { const a = a0 + f * PI / 2; b.beam([x + Math.cos(a) * r * 1.0, y + .05, z + Math.sin(a) * r * 1.0], [x, y + h + .01, z], .035, SL2); }
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.beam([x, y + h - .05, z], [x, y + h + .28, z], .022, fr, fo);
    b.sphere(x, y + h + .1, z, .035, 5, cy ? BRASS : BRONZE, M);
    b.cone(x, y + h + .27, z, .025, .08, 4, fr, fo);
    return y + h + .35;
  }

  /* ---------- 窗、门、灯、旗、藤 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石框（2077 黄铜框）、烛光玻璃、窗棂、窗台；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .032, e = o.e != null ? o.e : .5, cy = o.cy, fc = cy ? BRASSF : DRESS, fo = cy ? GL : undefined, n = w > .13 ? 3 : 2;
    b.at(x, y, z);
    if (o.flat) fan(b, outline(w + fr * 2, h, -fr, p, n), .012, fc, fo);       /* 背面的窗：平贴的窗框，省面 */
    else prism(b, outline(w + fr * 2, h, -fr, p, n), -.025, .02, fc, fo);
    fan(b, outline(w, h, 0, p, n), .024, o.dark ? INNER : WIN, o.dark ? undefined : { e });
    if (!o.plain) {
      b.panel(0, -.002, .027, .012, h + archY(w, p, 0) * .78, cy ? BRASSF : MULL, fo);
      b.panel(0, h * .5, .028, w, .011, cy ? BRASSF : MULL, fo);
    }
    if (!o.nosill) b.box(0, -fr - .028, 0, w + fr * 2 + .04, .028, .07, DRESS2, { nb: true });
    b.pop();
  }
  function door(b, w, h, p, o) {                            /* 尖拱铁钉木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    o = o || {};
    fan(b, outline(w, h, 0, p, 4), 0, DOORW);
    const n = o.planks || 4;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .009, h + archY(w, p, x) - .02, DARK); }
    for (const y of o.straps || [h * .2, h * .66]) {
      b.box(0, y, .006, w - .03, .024, .012, IRON, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .04 + i * (w - .08) / 3, y + .006, .0125, .013, .013, C.metal, M);
    }
    if (!o.noring) { b.at(w * .22, h * .52, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .022, .006, 6, 3, IRON, M); b.pop(); }
  }
  function slit(b, x, y, z) {                               /* 箭孔：十字窄缝 */
    b.panel(x, y - .03, z + .002, .075, .3, DRESS2);
    b.panel(x, y, z + .004, .028, .24, INNER);
    b.panel(x, y + .11, z + .005, .09, .026, INNER);
  }
  function lantern(b, x, y, z, cy) {                        /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, C.lamp, { r2: .045, e: .62, nt: true, nb: true });
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; b.beam([x + Math.cos(a) * .042, y + .02, z + Math.sin(a) * .042], [x + Math.cos(a) * .05, y + .13, z + Math.sin(a) * .05], .009, fr, fo); }
    b.cyl(x, y + .13, z, .06, .016, 6, fr, Object.assign({ nt: true }, fo));
    b.cone(x, y + .146, z, .056, .072, 6, fr, Object.assign({ nb: true }, fo));
    b.pyramid(x, y + .214, z, .022, .022, .045, fr, fo);
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z）；y 是铁臂高 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, y - .08, z + .005, .04, .1, .018, fr, fo);
    b.beam([x, y, z], [x, y, z + .15], .018, fr, fo);
    b.beam([x, y - .07, z], [x, y, z + .09], .012, fr, fo);
    b.beam([x, y, z + .14], [x, y - .05, z + .14], .009, fr, fo);
    lantern(b, x, y - .27, z + .14, cy);
  }
  function lampPost(b, x, y, z, cy, h) {                    /* 铁灯柱：石座、细铁柱、顶上一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    h = h || .7;
    b.box(x, y, z, .11, .07, .11, DRESS2, { nb: true });
    b.beam([x, y + .07, z], [x, y + h, z], .032, fr, fo);
    b.cyl(x, y + h - .035, z, .036, .035, 6, fr, Object.assign({ nb: true }, fo));
    lantern(b, x, y + h, z, cy);
  }
  function flag(b, x, y, z, col, h, o) {                    /* 小旗：铁杆、金球、随风摆的尖角旗；o.L 旗长 */
    o = o || {};
    h = h || .6;
    b.beam([x, y - .1, z], [x, y + h, z], o.t || .02, IRON, M);
    b.sphere(x, y + h + .02, z, (o.t || .02) * 1.4, 4, C.gold, M);
    const L = o.L || .36, Hh = o.H || .16, top = y + h - .04, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .012 + L * t0, x1 = x + .012 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .55), h1 = Hh * (1 - t1 * .55);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .45) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
    return y + h + .05;
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、尖底布条、金边、菱形徽 */
    b.beam([x - w / 2 - .025, yt + .01, z + .025], [x + w / 2 + .025, yt + .01, z + .025], .016, IRON, M);
    b.at(x, yt, z + .012);
    fan(b, [[-w / 2, -h + .07], [0, -h], [w / 2, -h + .07], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .016, -h + .08, .003, .01, h - .1, C.gold, M);
    b.panel(w / 2 - .016, -h + .08, .003, .01, h - .1, C.gold, M);
    const yc = -h * .46;
    fan(b, [[0, yc - .045], [.034, yc], [0, yc + .045], [-.034, yc]], .004, C.gold, M);
    b.pop();
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .62), py = y0 + v * h, s = .024 + R() * .026, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function soot(y0, y1) { return y => mix3(mix3(sc(y0 + y), STD, .45), [.2, .19, .2], Math.max(0, Math.min(.45, y / (y1 - y0) * .5))); }
  function chimney(b, x, z, y0, y1, smoke) {                /* 石烟囱：错缝砌石、越往上越熏黑、压顶石、两只陶烟囱帽 */
    b.at(x, y0, z);
    const h = y1 - y0;
    stoneBox(b, -.1, .1, 0, h, -.085, .085, { rh: .12, col: soot(y0, y1) });
    b.box(0, h - .12, 0, .24, .03, .21, DRESS2);
    b.box(0, h, 0, .25, .04, .22, DRESS2, { top: mix3(DRESS2, [.2, .2, .2], .35) });
    for (const dx of [-.048, .048]) b.cyl(dx, h + .04, 0, .034, .1, 6, POT, { r2: .028, top: [.12, .1, .1] });
    if (smoke) b.emit(.048, h + .34, 0, "smoke", 8, 1);
    b.pop();
    return y1 + .14;
  }
  function catLampPost(b, x, z, h) {                        /* 2077：黄铜细杆，弯钩托一盏浮着的猫球灯 */
    b.cyl(x, 0, z, .045, .07, 6, DRESS2);
    b.beam([x, .05, z], [x, h, z], .02, BRASS, GL);
    b.beam([x, h, z], [x + .1, h + .05, z], .015, BRASS, GL);
    b.beam([x + .1, h + .05, z], [x + .15, h + .02, z], .013, BRASS, GL);
    b.sphere(x, h + .01, z, .024, 4, BRASS, M);
    b.emit(x + .15, h - .1, z, "cat", 1, .85);
  }

  /* ---------- 半木 ---------- */
  function strip(b, x1, y1, x2, y2, w, z, d, col) {         /* 贴在墙面（z，面朝 +z）上的一根木条：正面＋两侧 */
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2, zf = z + d;
    const A = [x1 + nx, y1 + ny], B = [x2 + nx, y2 + ny], Cc = [x2 - nx, y2 - ny], D = [x1 - nx, y1 - ny];
    qf(b, [A[0], A[1], zf], [B[0], B[1], zf], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [0, 0, 1]);
    if (d < .019) return;
    qf(b, [A[0], A[1], z], [B[0], B[1], z], [B[0], B[1], zf], [A[0], A[1], zf], col, [nx, ny, 0]);
    qf(b, [D[0], D[1], z], [Cc[0], Cc[1], z], [Cc[0], Cc[1], zf], [D[0], D[1], zf], col, [-nx, -ny, 0]);
  }
  function tWin(b, xc, yb, w, h, z, o) {                    /* 木框窗：烛光玻璃、竖棂、横棂、窗台板 */
    o = o || {};
    b.panel(xc, yb, z + .003, w, h, WIN, { e: o.e || .5 });
    const t = .034, d = .026;
    strip(b, xc - w / 2 - t / 2, yb, xc - w / 2 - t / 2, yb + h, t, z, d, OAK);
    strip(b, xc + w / 2 + t / 2, yb, xc + w / 2 + t / 2, yb + h, t, z, d, OAK);
    strip(b, xc - w / 2 - t, yb + h + t / 2, xc + w / 2 + t, yb + h + t / 2, t, z, d + .006, OAK);
    b.box(xc, yb - .028, z + .018, w + .08, .028, .06, OAK2, { nb: true });
    b.panel(xc, yb, z + .006, .014, h, MULL);
    b.panel(xc, yb + h * .58, z + .007, w, .012, MULL);
  }
  /* 半木墙（面朝 +z，墙面在 z）：抹灰底、立柱、地梁、顶梁、腰枋、斜撑；bays：w 窗、x 交叉撑、l/r 单斜撑、- 只画抹灰 */
  function htWall(b, x0, x1, y0, y1, z, bays, o) {
    o = o || {};
    const n = bays.length, bw = (x1 - x0) / n, h = y1 - y0, ym = y0 + h * .46, T = .045, d = .02;
    for (let i = 0; i < n; i++) {
      const xa = x0 + i * bw, xb = xa + bw, c = mix3(DAUB, R() < .5 ? [.82, .78, .7] : [.88, .86, .8], .2 + R() * .3);
      b.quad([xa, y0, z], [xb, y0, z], [xb, y1, z], [xa, y1, z], c);
    }
    strip(b, x0, y0 + T * .6, x1, y0 + T * .6, T * 1.3, z, d + .006, OAK);
    strip(b, x0, y1 - T * .6, x1, y1 - T * .6, T * 1.3, z, d + .006, OAK);
    for (let i = 0; i <= n; i++) { const x = x0 + i * bw; strip(b, x, y0 + T * 1.2, x, y1 - T * 1.2, i === 0 || i === n ? T * 1.25 : T, z, d, OAK); }
    for (let i = 0; i < n; i++) {
      const k = bays[i], xa = x0 + i * bw + T / 2, xb = x0 + (i + 1) * bw - T / 2, xm = (xa + xb) / 2, yl = y0 + T * 1.2, yh = y1 - T * 1.2;
      if (k === "-") continue;
      if (k === "w") { const ww = Math.min(bw - .1, o.ww || .2), wh = Math.min(h - .2, o.wh || .2); tWin(b, xm, y0 + (h - wh) * .55, ww, wh, z, {}); continue; }
      strip(b, xa, ym, xb, ym, T * .85, z, d * .9, OAK);
      if (k === "x") { strip(b, xa, yl, xb, ym, T * .8, z, d * .8, OAK); strip(b, xb, yl, xa, ym, T * .8, z, d * .8, OAK); strip(b, xa, ym, xb, yh, T * .8, z, d * .8, OAK); strip(b, xb, ym, xa, yh, T * .8, z, d * .8, OAK); }
      else if (k === "l") { strip(b, xa, yl, xb, ym, T * .85, z, d * .8, OAK); strip(b, xa, yh, xb, ym, T * .85, z, d * .8, OAK); }
      else if (k === "r") { strip(b, xb, yl, xa, ym, T * .85, z, d * .8, OAK); strip(b, xb, yh, xa, ym, T * .85, z, d * .8, OAK); }
    }
  }

  /* ---------- 杂物 ---------- */
  function bench(b, x, z, L, ry) {                          /* 长椅：座板、靠背、腿 */
    b.at(x, 0, z, ry || 0);
    b.box(0, .17, 0, L, .03, .13, OAK2, { top: mix3(OAK2, C.woodL, .2) });
    for (const s of [-1, 1]) { b.box(s * (L / 2 - .06), 0, .02, .035, .17, .09, OAK, { nb: true }); b.beam([s * (L / 2 - .06), .17, -.055], [s * (L / 2 - .06), .38, -.072], .03, OAK); }
    b.box(0, .25, -.064, L - .03, .04, .02, OAK2);
    b.box(0, .32, -.068, L - .03, .04, .02, OAK2);
    b.pop();
  }
  function barrel(b, x, z, r, h, ry) {                      /* 木桶：桶板、两道铁箍 */
    b.at(x, 0, z, ry || 0);
    b.cyl(0, 0, 0, r * .88, h * .5, 8, OAK2, { r2: r, nt: true, nb: true });
    b.cyl(0, h * .5, 0, r, h * .5, 8, mix3(OAK2, C.wood, .2), { r2: r * .88, nt: true, nb: true });
    for (const t of [.16, .82]) b.cyl(0, h * t - .01, 0, r * .96 + .007, .022, 8, IRON, { nt: true, nb: true, mat: "metal" });
    b.disc(0, h * .98, 0, r * .86, 8, mix3(OAK2, C.plank, .4));
    b.pop();
  }

  /* ================= 营房 ================= */
  const BX0 = -1.36, BX1 = 1.12, BXC = (BX0 + BX1) / 2, BW = BX1 - BX0, BZ = -.86, BD = .95, ZF = BZ + BD / 2, ZB = BZ - BD / 2;
  const P0 = .1, HW = 1.5, HR = .72, YR = HW + HR, OV = .09, Y2 = .82;
  const DX = -.3, GW = .4, GH = .55, PJ = .1, ZP = ZF + PJ;   /* 正门 x；正中突出开间的半宽、山墙高、突出量、正面 z */
  const SX0 = .2, SX1 = .7, LX1 = 1.06, SZ0 = ZF + .03, SZ1 = ZF + .27;   /* 外挂楼梯：起步 x、顶 x、平台右端；楼梯的 z 范围 */
  const W1 = [-1.13, -.88, .33, .6, .9], W2 = [-1.13, -.88, .33, .6];      /* 一层、二层的窗（正中小山墙下另开一对） */

  function pent(b, x, y, z, w, d, drop, cy) {              /* 门上披檐：1994 石板瓦小斜顶＋两根木斜撑；2077 黄铜骨架的玻璃雨棚＋黄铜拉杆 */
    const zo = z + d, yo = y - drop;
    if (cy) {
      qf(b, [x - w / 2, y, z], [x + w / 2, y, z], [x + w / 2, yo, zo], [x - w / 2, yo, zo], GLASS, [0, 1, .3], GLS);
      for (let i = 0; i <= 4; i++) { const xx = x - w / 2 + i * w / 4; bar(b, [xx, y + .012, z], [xx, yo + .012, zo], .018, BRASS, GL); }
      bar(b, [x - w / 2, yo + .01, zo], [x + w / 2, yo + .01, zo], .026, BRASS, GL);
      bar(b, [x - w / 2, y + .01, z + .01], [x + w / 2, y + .01, z + .01], .022, BRASS, GL);
      for (const s of [-1, 1]) { bar(b, [x + s * (w / 2 - .04), y + .22, z], [x + s * (w / 2 - .04), yo + .02, zo - .02], .012, BRASS, GL); b.sphere(x + s * (w / 2 - .04), y + .22, z + .01, .018, 4, BRASS, M); }
      for (let i = 0; i < 5; i++) { const xx = x - w / 2 + (i + .5) * w / 5; b.sphere(xx, yo - .006, zo + .004, .012, 4, BRASS, M); }
      return;
    }
    const nb = 3;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + .04, ya = yo + (y - yo) * t0, za = zo + (z - zo) * t0, yb = yo + (y - yo) * Math.min(1, t1), zb = zo + (z - zo) * Math.min(1, t1);
      qf(b, [x - w / 2, ya + .014, za], [x + w / 2, ya + .014, za], [x + w / 2, yb, zb], [x - w / 2, yb, zb], i % 2 ? SL : SLM, [0, 1, .3]);
      qf(b, [x - w / 2, ya, za], [x + w / 2, ya, za], [x + w / 2, ya + .014, za], [x - w / 2, ya + .014, za], SLD, [0, 0, 1]);
    }
    qf(b, [x - w / 2, yo, zo], [x + w / 2, yo, zo], [x + w / 2, y - .03, z], [x - w / 2, y - .03, z], OAK, [0, -1, 0]);
    for (const s of [-1, 1]) { tf(b, [x + s * w / 2, yo, zo], [x + s * w / 2, y, z], [x + s * w / 2, y - .03, z], SLD, [s, 0, 0]); bar(b, [x + s * (w / 2 - .05), y - .26, z], [x + s * (w / 2 - .05), yo - .01, zo - .03], .03, OAK); }
    b.beam([x - w / 2, yo - .02, zo], [x + w / 2, yo - .02, zo], .03, OAK2);
  }

  function stairs(b, o) {                                  /* 外挂木楼梯：两根斜梁、踏板、外侧扶手和栏杆柱、二楼平台（两根撑柱）和平台栏杆 */
    const cy = o.cyber, n = 8, yT = Y2 + .02, rail = cy ? BRASS : OAK2, ro = cy ? GL : undefined, step = (SX1 - SX0) / n, rise = yT / n;
    for (const zz of [SZ0 + .015, SZ1 - .015]) bar(b, [SX0 - .03, 0, zz], [SX1 + .01, yT - .03, zz], .035, OAK);
    for (let i = 0; i < n; i++) b.box(SX0 + (i + .5) * step, rise * (i + 1) - .022, (SZ0 + SZ1) / 2, step + .015, .022, SZ1 - SZ0 - .01, i % 2 ? BOARD : mix3(BOARD, OAK2, .3), { nb: true });
    b.box((SX1 + LX1) / 2, yT - .04, (SZ0 + SZ1) / 2 + .015, LX1 - SX1 + .01, .045, SZ1 - SZ0 + .03, BOARD, { top: mix3(BOARD, C.woodL, .2) });
    for (const [x, z] of [[LX1 - .025, SZ1], [SX1 + .015, SZ1]]) b.box(x, 0, z, .04, yT - .04, .04, OAK, { nb: true });
    bar(b, [SX1 + .015, .25, SZ1], [LX1 - .025, .25, SZ1], .022, OAK);
    const H = .3;
    for (let i = 0; i <= 4; i++) { const t = i / 4, x = SX0 + .02 + (SX1 - SX0) * t, y = yT * t; bar(b, [x, y, SZ1 - .005], [x, y + H, SZ1 - .005], .02, rail, ro); }
    bar(b, [SX0 + .02, H, SZ1 - .005], [SX1 + .02, yT + H, SZ1 - .005], .026, rail, ro);
    for (const x of [SX1 + .1, (SX1 + LX1) / 2 + .05, LX1 - .02]) bar(b, [x, yT, SZ1 + .015], [x, yT + H, SZ1 + .015], .02, rail, ro);
    bar(b, [SX1 + .02, yT + H, SZ1 + .015], [LX1 - .01, yT + H, SZ1 + .015], .026, rail, ro);
    bar(b, [LX1 - .015, yT + H, SZ1 + .015], [LX1 - .015, yT + H, SZ0 + .005], .026, rail, ro);
    bar(b, [LX1 - .015, yT, (SZ0 + SZ1) / 2], [LX1 - .015, yT + H, (SZ0 + SZ1) / 2], .02, rail, ro);
  }

  function barracks(b, o) {
    reseed(11);
    const cy = o.cyber, lv = o.lv, hx = BW / 2, hd = BD / 2;
    b.at(BXC, 0, BZ);
    b.box(0, -.12, 0, BW + .1, P0 + .12, BD + .1, STD, { top: DRESS2, nb: true });   /* 石台基 */
    /* 长墙：正面、背面 */
    mason(b, () => [-hx, hx], P0, HW, hd, { ql: true, qr: true });
    mason(b, () => [-hx, hx], P0, HW, -hd, { back: true, ql: true, qr: true });
    /* 两头石山墙 */
    const sl = HR / hd, gab = y => { const h = Math.max(.001, Math.min(hd, (YR + .02 - y) / sl)); return [-h, h]; };
    for (const s of [-1, 1]) {
      b.at(s * hx, 0, 0, s * PI / 2);
      mason(b, () => [-hd, hd], P0, HW, 0, { ql: true, qr: true, qph: 1 });
      mason(b, gab, HW, YR + .02, 0, {});
      b.box(0, Y2 - .02, .012, BD + .02, .045, .03, DRESS2, { nb: true });
      if (s > 0) { lancet(b, -.16, .3, 0, .11, .24, { cy }); lancet(b, .16, .3, 0, .11, .24, { cy }); lancet(b, 0, Y2 + .17, 0, .12, .26, { cy }); lancet(b, 0, HW + .12, 0, .08, .16, { cy, plain: true, e: .45 }); }
      else { lancet(b, 0, Y2 + .17, 0, .12, .26, { cy }); slit(b, 0, HW + .18, 0); }
      b.pop();
      coping(b, s * hx, HW, BD, HR, OV);
    }
    /* 腰线 */
    for (const s of [-1, 1]) b.box(0, Y2 - .02, s * (hd + .012), BW + .02, .045, .03, DRESS2, { nb: true });
    /* 正面窗：两排小尖拱窗 */
    for (const x of W1) lancet(b, x - BXC, .3, hd, .12, .24, { cy });
    for (const x of W2) lancet(b, x - BXC, Y2 + .17, hd, .12, .24, { cy });
    /* 背面窗：疏一点 */
    b.at(0, 0, -hd, PI);
    for (const x of [-.9, -.3, .3, .9]) { lancet(b, x, .3, 0, .12, .24, { cy, plain: true, flat: true }); lancet(b, x, Y2 + .17, 0, .12, .24, { cy, plain: true, flat: true }); }
    b.pop();
    /* 正面两角扶壁 */
    for (const s of [-1, 1]) buttress(b, s * (hx - .07), hd, 0, .75);
    b.pop();

    /* 正中小山墙（面朝 +z）：压顶石、尖顶饰；下面一对尖拱窗，山尖一扇小圆窗（Lv3 换成钟） */
    reseed(12);
    const gx = DX, ggab = y => { const h = GW * Math.max(.001, 1 - (y - HW) / GH); return [gx - h, gx + h]; };
    b.box(gx, -.12, ZF + PJ / 2, GW * 2 + .1, P0 + .12, PJ + .1, STD, { top: DRESS2, nb: true });
    mason(b, () => [gx - GW, gx + GW], P0, HW, ZP, { ql: true, qr: true });
    for (const s of [-1, 1]) { b.at(gx + s * GW, 0, ZF + PJ / 2, s * PI / 2); mason(b, () => [-PJ / 2, PJ / 2], P0, HW, 0, {}); b.pop(); }
    b.box(gx, Y2 - .02, ZP + .012, GW * 2 + .02, .045, .03, DRESS2, { nb: true });
    mason(b, ggab, HW - .001, HW + GH, ZP, {});
    const zIn = BZ + (YR - (HW + GH)) / sl, glen = ZP - zIn;
    b.at(gx, 0, (ZP + zIn) / 2, PI / 2);
    slateRoof(b, glen, HW, GW * 2, GH, .06, { bands: 4, patches: 2, noridge: true });
    b.at(0, HW + GH + .012, 0, 0, 1, PI / 4); b.box(0, -.03, 0, glen + .02, .06, .06, SL2); b.pop();
    coping(b, glen / 2, HW, GW * 2, GH, .06);
    b.pop();
    lancet(b, gx - .09, Y2 + .17, ZP, .11, .28, { cy });
    lancet(b, gx + .09, Y2 + .17, ZP, .11, .28, { cy });
    if (lv >= 3) clock(b, gx, HW + .17, ZP, cy);
    else {
      b.at(gx, HW + .19, ZP);
      fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * .085, Math.sin(i / 8 * TAU) * .085]), .012, DRESS);
      fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * .055, Math.sin(i / 8 * TAU) * .055]), .016, WIN, { e: .45 });
      b.pop();
    }

    /* 正门：料石尖拱券、铁钉木门、门前石阶、披檐、两盏壁灯 */
    b.at(DX, P0, ZP);
    archRing(b, .28, .26, .66, .055, -.03, .03);
    b.at(0, 0, -.01); door(b, .28, .26, .66, { planks: 4 }); b.pop();
    b.pop();
    b.box(DX, 0, ZP + .1, .46, P0, .2, DRESS2, { nb: true, top: mix3(DRESS2, C.stone, .4) });
    b.box(DX, 0, ZP + .23, .42, .05, .1, mix3(DRESS2, STD, .2), { nb: true, top: DRESS2 });
    pent(b, DX, .8, ZP, .56, .26, .13, cy);
    for (const s of [-1, 1]) wallLantern(b, DX + s * .27, .64, ZP, cy);
    stairs(b, o);
    /* 二楼门：平台上方 */
    b.at(.9, Y2 + .02, ZF);
    archRing(b, .2, .25, .66, .04, -.02, .025);
    b.at(0, 0, -.01); door(b, .2, .25, .66, { planks: 3, straps: [.06, .2], noring: true }); b.pop();
    b.pop();
    wallLantern(b, .74, Y2 + .5, ZF, cy);

    /* 屋顶 */
    reseed(13);
    b.at(BXC, 0, BZ);
    slateRoof(b, BW, HW, BD, HR, OV, { bands: 7, patches: 7 });
    b.pop();
    cresting(b, BX0 + .2, BX1 - .2, YR + .02, BZ, cy);
    /* 两根烟囱：后坡上，一根冒烟 */
    let top = YR + .4;
    const smoke = !o.bad;
    top = Math.max(top, chimney(b, -.92, BZ - .2, YR - .35, YR + .28, false));
    top = Math.max(top, chimney(b, .6, BZ - .2, YR - .35, YR + .28, smoke));
    /* 常春藤 */
    reseed(14);
    ivy(b, BX0 + .3, P0, ZF, .5, 1.1, 34);
    b.at(BX1, 0, BZ, PI / 2); ivy(b, -.25, P0, 0, .4, 1.2, 22); b.pop();
    if (cy) airshipVane(b, BXC + .12, YR + .03, BZ);
    return top;
  }
  function clock(b, x, y, z, cy) {                          /* 山墙上的钟：料石圈、奶白钟面、铁刻度和指针 */
    b.at(x, y, z);
    const N = 14, cs = a => [Math.cos(a), Math.sin(a)], r0 = .105, r1 = .135;
    for (let i = 0; i < N; i++) {
      const [c1, s1] = cs(i / N * TAU), [c2, s2] = cs((i + 1) / N * TAU);
      b.tri([0, 0, .02], [c1 * r0, s1 * r0, .02], [c2 * r0, s2 * r0, .02], mix3(C.cream, C.stone, .35));
      b.quad([c1 * r1, s1 * r1, .03], [c1 * r0, s1 * r0, .03], [c2 * r0, s2 * r0, .03], [c2 * r1, s2 * r1, .03], cy ? BRASS : DRESS, cy ? GL : undefined);
      b.quad([c1 * r1, s1 * r1, -.01], [c2 * r1, s2 * r1, -.01], [c2 * r1, s2 * r1, .03], [c1 * r1, s1 * r1, .03], DRESS2);
    }
    for (let i = 0; i < 12; i += 3) { const [c, s] = cs(i / 12 * TAU); b.beam([c * .08, s * .08, .023], [c * .1, s * .1, .023], .012, IRON, M); }
    b.beam([0, 0, .03], [.04, .045, .03], .012, IRON, M); b.beam([0, 0, .034], [-.012, -.08, .034], .009, IRON, M);
    b.sphere(0, 0, .036, .014, 4, C.gold, M);
    b.pop();
  }
  function airshipVane(b, x, y, z) {                        /* 2077：屋脊上一只黄铜小飞艇风标（不转）：艇身、尾翼、吊舱、立杆 */
    b.beam([x, y, z], [x, y + .34, z], .02, BRASS, GL);
    b.at(x, y + .42, z); b.at(0, 0, 0, 0, [.17, .06, .06]); b.sphere(0, 0, 0, 1, 8, mix3(BRASS, OAK, .15), GL); b.pop();
    for (const s of [-1, 1]) { b.panel(-.17, -.002, s * .001, .07, s * .06, BRASS, M); }
    b.box(-.17, -.003, 0, .07, .006, .12, BRASS, M);
    b.box(.0, -.09, 0, .07, .03, .03, BRONZE, M);
    b.beam([-.03, -.06, 0], [-.02, -.04, 0], .006, BRASS, M); b.beam([.03, -.06, 0], [.02, -.04, 0], .006, BRASS, M);
    b.pop();
  }

  /* ================= 沙地操场 ================= */
  const YX0 = -1.0, YX1 = 1.0, YZ0 = -.12, YZ1 = .8;
  function yard(b, o) {
    reseed(21);
    const cy = o.cyber, rr = .16, N = 3;
    /* 圆角矩形沙地，略高出草面；几处脚印踩出来的深色、浅色斑 */
    const pts = [];
    const cs = [[YX1 - rr, YZ1 - rr, 0], [YX0 + rr, YZ1 - rr, PI / 2], [YX0 + rr, YZ0 + rr, PI], [YX1 - rr, YZ0 + rr, PI * 1.5]];
    for (const [cx, cz, a0] of cs) for (let i = 0; i <= N; i++) { const a = a0 + i / N * PI / 2; pts.push([cx + Math.cos(a) * rr, cz + Math.sin(a) * rr]); }
    const y = .022, cxm = (YX0 + YX1) / 2, czm = (YZ0 + YZ1) / 2;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      b.tri([cxm, y, czm], [q[0], y, q[1]], [p[0], y, p[1]], SAND);
      b.quad([p[0], -.03, p[1]], [q[0], -.03, q[1]], [q[0], y, q[1]], [p[0], y, p[1]], SANDD);
    }
    for (let i = 0; i < 9; i++) {
      const x = YX0 + .2 + R() * (YX1 - YX0 - .4), z = YZ0 + .15 + R() * (YZ1 - YZ0 - .3), s = .06 + R() * .1, a = R() * PI;
      b.at(x, y + .002, z, a); fan(b, [[-s, 0], [-s * .4, -s * .55], [s * .5, -s * .5], [s, 0], [s * .4, s * .6], [-s * .5, s * .5]].map(([u, v]) => [u, v]), 0, R() < .55 ? mix3(SAND, SANDD, .35) : SANDL); b.pop();
    }
    /* 木边框：前沿和左右，留两处口子 */
    const eg = [[[YX0 + .05, YZ1 + .02], [-.35, YZ1 + .02]], [[.0, YZ1 + .02], [YX1 - .05, YZ1 + .02]], [[YX0 - .02, YZ0 + .05], [YX0 - .02, YZ1 - .05]], [[YX1 + .02, .18], [YX1 + .02, YZ1 - .05]]];
    for (const [p, q] of eg) b.beam([p[0], .0, p[1]], [q[0], .0, q[1]], .045, mix3(OLDW, OLDWD, R() * .5), { tz: .05 });
    for (const [x, z] of [[YX0 - .02, YZ1 + .02], [YX1 + .02, YZ1 + .02], [YX0 - .02, YZ0 + .05]]) b.box(x, 0, z, .06, .08, .06, OLDWD, { nb: true });
  }
  function dummy(b, x, z, ry, fallen) {                     /* 木人桩：粗木桩（铁箍桩头）、下段捆草把、三根横出的木臂；脚下一圈踩实的土 */
    b.at(x, 0, z, ry);
    if (fallen) b.at(0, .06, 0, 0, 1, PI / 2 - .1);
    b.cyl(0, 0, 0, .05, .6, 6, OLDW, { r2: .046, top: OLDWD, nb: true });
    b.cyl(0, .57, 0, .052, .03, 6, IRON, { mat: "metal", nt: true, nb: true });
    b.cyl(0, .1, 0, .08, .24, 6, STRAW, { r2: .074, top: STRAWD });
    for (const yy of [.14, .27]) b.cyl(0, yy, 0, .083, .016, 6, OLDWD, { nt: true, nb: true });
    for (let i = 0; i < 4; i++) { const a = i / 4 * TAU + R(); b.at(0, .12 + R() * .2, 0, a); tri2(b, [.075, 0, 0], [.11, -.05, .01], [.08, .03, .012], mix3(STRAW, C.hay, R() * .5)); b.pop(); }
    for (const s of [-1, 1]) bar(b, [s * .03, .47, .02], [s * .13, .5, .16], .026, OLDWD);
    bar(b, [0, .38, .03], [0, .37, .19], .028, OLDWD);
    if (fallen) b.pop();
    else b.cyl(0, 0, 0, .13, .025, 6, SANDD, { r2: .1, nb: true });
    b.pop();
  }
  function golem(b, x, z, ry, fallen) {                     /* 2077 黄铜训练桩（原「训练魔像」）：石座、铁转轴、青铜鼓身加两道黄铜箍、三根错开角度和高度的皮包短桩臂、顶上黄铜六角盘加尖顶饰。
                                                               美术复查：原来的方身球头双臂读作小人，用户嫌人形惊悚，改成纯器械的桩子，不给头、不做对称平伸的双臂 */
    const BODY = mix3(BRONZE, C.castleD, .25), PAD = mix3(mix3(C.cloth, OAK, .65), C.castle, .3);
    b.at(x, 0, z, ry);
    if (fallen) b.at(0, .1, 0, 0, 1, PI / 2 - .15);
    b.cyl(0, 0, 0, .09, .06, 6, DRESS2, { r2: .075, nb: true });
    b.cyl(0, .06, 0, .03, .08, 5, IRON, { mat: "metal", nt: true, nb: true });
    b.cyl(0, .13, 0, .066, .38, 6, BODY, Object.assign({ r2: .056, top: BRASS, nb: true }, GL));
    for (const yy of [.2, .43]) b.cyl(0, yy, 0, .07 - (yy - .13) * .03, .02, 6, BRASS, Object.assign({ nt: true, nb: true }, GL));
    [[.5, .22, .17], [2.6, .33, .15], [4.4, .41, .13]].forEach(([a, yy, L]) => {
      const dx = Math.sin(a), dz = Math.cos(a);
      bar(b, [dx * .05, yy, dz * .05], [dx * L, yy - .02, dz * L], .026, BRASS, GL);
      b.at(dx * L, yy - .02, dz * L, a); b.box(0, -.03, 0, .045, .06, .045, PAD, { nb: true }); b.pop();
    });
    b.cyl(0, .51, 0, .085, .02, 6, BRASS, Object.assign({ nb: true }, GL));
    b.cone(0, .53, 0, .026, .09, 4, BRASS, Object.assign({ nb: true }, GL));
    if (fallen) b.pop();
    b.pop();
  }
  function spearRack(b, x, z, ry, o) {                      /* 兵器架：两根立柱、上下横杆，立着一排长枪（铁枪头），架脚一面圆盾 */
    reseed(23);
    b.at(x, 0, z, ry);
    for (const s of [-1, 1]) { b.box(s * .24, 0, 0, .04, .5, .05, OAK, { nb: true }); b.box(s * .24, 0, 0, .1, .03, .14, OAK2); }
    b.box(0, .42, 0, .52, .035, .045, OAK2);
    b.box(0, .14, 0, .52, .03, .1, OAK2);
    for (let i = 0; i < 6; i++) {
      const xx = -.19 + i * .076, h = .74 + R() * .08, lean = (R() - .5) * .04;
      bar(b, [xx, .15, -.02], [xx + lean, h, .015], .018, mix3(C.woodL, OAK2, R() * .6));
      b.at(xx + lean, h, .015); b.cone(0, 0, 0, .022, .1, 4, mix3(C.metal, IRON, .3), M); b.pop();
    }
    b.at(.26, .17, .1, -.3, 1, .25);
    b.cyl(0, 0, 0, .12, .02, 9, mix3(C.banner2, OAK, .3), { rx: 0 });
    b.pop();
    b.pop();
  }
  function target(b, x, z, ry, tilt) {                     /* 箭靶：三脚木架上的草靶，同心环颜色压到低饱和；插着几支箭 */
    reseed(25);
    b.at(x, 0, z, ry);
    b.at(0, 0, 0, 0, 1, 0, tilt || 0);
    for (const [dx, dz] of [[-.15, .07], [.15, .07]]) bar(b, [dx, 0, dz], [dx * .3, .62, -.01], .03, OLDW);
    bar(b, [0, 0, -.2], [0, .58, -.03], .03, OLDW);
    b.at(0, .4, .01, 0, 1, -.18);
    const rings = [[.2, mix3(C.hay, C.dirt, .2)], [.16, mix3(C.cream, C.stone, .3)], [.12, mix3(C.banner, C.castle, .45)], [.08, mix3(C.cream, C.stone, .3)], [.045, mix3(C.gold, C.castle, .45)]];
    b.at(0, 0, 0, 0, 1, PI / 2);
    b.cyl(0, -.03, 0, .2, .03, 12, mix3(C.hay, C.woodD, .25), { top: rings[0][1] });
    rings.slice(1).forEach(([r, c], i) => b.disc(0, .0015 + i * .0012, 0, r, 12, c));
    for (const [ax, az] of [[.03, .05], [-.07, -.02], [.1, -.08]]) { bar(b, [ax, 0, az], [ax + .02, .18, az - .03], .008, C.woodL); b.at(ax + .02, .18, az - .03); b.box(-.012, 0, 0, .024, .04, .003, C.cream); b.pop(); }
    b.pop(); b.pop(); b.pop();
    b.pop();
  }
  function runeRing(b, x, z, ry) {                           /* 2077 法术训练靶圈：石座、黄铜立柱、竖立的黄铜环，环里一圈低饱和符文（e .3，两面） */
    b.at(x, 0, z, ry);
    b.cyl(0, 0, 0, .075, .05, 6, DRESS2, { r2: .06, nb: true });
    b.beam([0, .05, 0], [0, .51, 0], .026, BRASS, GL);
    b.at(0, .64, 0, 0, 1, PI / 2);
    b.torus(0, 0, 0, .13, .015, 12, 3, BRASS, M);
    for (const sy of [1, -1]) { b.at(0, sy * .003, 0, 0, 1, sy > 0 ? 0 : PI); b.ring(0, 0, 0, .1, .085, 12, RUNE, { e: .3 }); b.pop(); }
    b.pop();
    b.pop();
  }
  function trough(b, x, z, ry) {                             /* 石砌饮水槽 */
    b.at(x, 0, z, ry);
    const L = .5, Wd = .2, H = .17, t = .035;
    for (const s of [-1, 1]) { b.box(0, 0, s * (Wd / 2 - t / 2), L, H, t, sc(.2), { nb: true, top: DRESS2 }); b.box(s * (L / 2 - t / 2), 0, 0, t, H, Wd - 2 * t, sc(.2), { nb: true, top: DRESS2 }); }
    b.quad([-L / 2 + t, H - .03, Wd / 2 - t], [L / 2 - t, H - .03, Wd / 2 - t], [L / 2 - t, H - .03, -Wd / 2 + t], [-L / 2 + t, H - .03, -Wd / 2 + t], [.3, .46, .54], { mat: "water", k: 3 });
    b.box(-L / 2 - .05, 0, 0, .06, .3, .06, OAK2, { nb: true });
    b.beam([-L / 2 - .05, .3, 0], [-L / 2 + .06, .27, 0], .025, IRON, M);
    b.pop();
  }
  function flagpole(b, x, z, bad, cy) {                      /* 旗杆：石座、木杆、铁顶，挂深蓝军旗；待修时歪着 */
    b.at(x, 0, z, 0, 1, 0, bad ? .32 : 0);
    b.box(0, 0, 0, .2, .08, .2, DRESS2, { nb: true });
    b.box(0, .08, 0, .14, .05, .14, DRESS, { nb: true });
    b.cyl(0, .13, 0, .03, 1.65, 6, OLDW, { r2: .022 });
    b.sphere(0, 1.8, 0, .036, 5, cy ? BRASS : C.gold, M);
    for (const yy of [.5, 1.1]) b.cyl(0, yy, 0, .033, .02, 6, IRON, { mat: "metal", nt: true, nb: true });
    const L = .4, Hh = .24, top = 1.74, segs = 4;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = .02 + L * t0, x1 = .02 + L * t1, w0 = Math.sin(t0 * 5.2) * .04, w1 = Math.sin(t1 * 5.2) * .04, h0 = Hh * (1 - t0 * .25), h1 = Hh * (1 - t1 * .25);
      const A = [x0, top - h0, w0], B = [x1, top - h1, w1], Cc = [x1, top, w1], D = [x0, top, w0], cc = C.banner2;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
      if (i === 1 || i === 2) { const ym = top - Hh * .5; b.quad([x0, ym - .03, w0 + .002], [x1, ym - .03, w1 + .002], [x1, ym + .03, w1 + .002], [x0, ym + .03, w0 + .002], mix3(C.gold, C.banner2, .25), { k: 1.4 }); b.quad([x1, ym - .03, w1 - .002], [x0, ym - .03, w0 - .002], [x0, ym + .03, w0 - .002], [x1, ym + .03, w1 - .002], mix3(C.gold, C.banner2, .25), { k: 1.4 }); }
    }
    for (const dy of [.0, .3]) bar(b, [.02, top - dy, 0], [.0, top - dy, 0], .01, IRON, M);
    b.pop();
  }

  /* ================= Lv2：墓穴、军械塔 ================= */
  const CX = 1.49, CZ = -.95;
  function crypt(b, o) {                                     /* 覆草的土丘；正面料石墙里一道尖拱门，门里是暗的；两只石瓮、一盏铁灯柱；丘顶一块小石碑 */
    reseed(31);
    const cy = o.cyber, rx = .41, rz = .52, ry = .56, NS = 10, NR = 4;
    const P = (a, t) => [CX + Math.cos(a) * rx * Math.cos(t), -.04 + ry * Math.sin(t), CZ + Math.sin(a) * rz * Math.cos(t)];
    for (let j = 0; j < NR; j++) {
      const t0 = j / NR * PI / 2, t1 = (j + 1) / NR * PI / 2;
      for (let i = 0; i < NS; i++) {
        const a0 = i / NS * TAU, a1 = (i + 1) / NS * TAU, c = mix3(TURF, R() < .4 ? TURFD : C.grass2, R() * .5);
        if (j === NR - 1) b.tri(P(a0, t0), P(a1, t0), P(a0, t1), c); else b.quad(P(a1, t0), P(a0, t0), P(a0, t1), P(a1, t1), c);
      }
    }
    for (let i = 0; i < 14; i++) {                          /* 草丛 */
      const a = R() * TAU, t = .15 + R() * 1.1, p = P(a, t), s = .03 + R() * .03;
      b.cone(p[0], p[1] - .01, p[2], s, s * 1.6, 4, mix3(C.grass, C.leafD, R() * .6), { nb: true });
    }
    /* 正面料石墙（梯形）＋尖拱门 */
    const zf = CZ + rz * .8, w0 = .48, w1 = .32, hgt = .4;
    b.at(CX, 0, zf);
    mason(b, y => { const h = w0 / 2 + (w1 / 2 - w0 / 2) * (y / hgt); return [-h, h]; }, 0, hgt, 0, { rh: .1, col: y => mix3(sc(y), mix3(STD, C.ivy, .3), .3) });
    for (const s of [-1, 1]) b.quad([s * w0 / 2, 0, 0], [s * w0 / 2, 0, -.25], [s * w1 / 2, hgt, -.25], [s * w1 / 2, hgt, 0], sc(.2));
    b.box(0, hgt, -.1, w1 + .06, .045, .24, mix3(DRESS2, STD, .3), { top: mix3(DRESS2, C.ivy, .25) });
    b.pop();
    b.at(CX, 0, zf + .005);
    archRing(b, .17, .16, .7, .04, -.01, .03);
    fan(b, outline(.17, .16, 0, .7, 4), .008, INNER);
    b.pop();
    b.at(CX, 0, zf); ivy(b, .14, 0, 0, .12, .36, 10); ivy(b, -.15, 0, 0, .1, .3, 8); b.pop();
    b.box(CX, 0, zf + .1, .3, .03, .2, mix3(DRESS2, STD, .3), { nb: true });
    /* 丘顶小石碑 */
    b.at(CX + .05, .46, CZ - .1, -.1, 1, -.05);
    b.box(0, 0, 0, .13, .2, .04, mix3(DRESS2, STD, .3), { top: DRESS2 });
    b.cyl(0, .2, 0, .065, .04, 6, mix3(DRESS2, STD, .3), { a0: 0, r2: .03 });
    b.panel(0, .07, .021, .06, .012, INNER); b.panel(0, .1, .021, .012, .07, INNER);
    b.pop();
    /* 两只石瓮 */
    for (const s of [-1, 1]) {
      const ux = CX + s * .26, uz = zf + .1;
      b.box(ux, 0, uz, .12, .1, .12, DRESS2, { nb: true, top: DRESS });
      b.cyl(ux, .1, uz, .04, .04, 7, mix3(DRESS2, STD, .2));
      b.cyl(ux, .14, uz, .055, .07, 7, DRESS2, { r2: .07, nt: true });
      b.cyl(ux, .21, uz, .07, .05, 7, DRESS2, { r2: .05 });
      b.cyl(ux, .26, uz, .045, .015, 7, mix3(DRESS2, STD, .3));
      if (cy) canister(b, ux + s * .02, uz + .2);
    }
    lampPost(b, CX + .34, 0, zf + .18, cy, .44);
  }
  function canister(b, x, z) {                               /* 2077：黄铜箍的密封储罐（不开窗）：铁底座、深色罐身、两道黄铜箍、黄铜封盖、铭牌 */
    b.cyl(x, 0, z, .07, .03, 6, IRON, { mat: "metal", nb: true });
    b.cyl(x, .03, z, .064, .2, 6, mix3(C.alloy, STD, .3), { mat: "gloss", nt: true, nb: true });
    for (const yy of [.07, .17]) b.cyl(x, yy, z, .069, .018, 6, BRASS, { mat: "metal", nt: true, nb: true });
    b.cyl(x, .23, z, .066, .03, 6, BRASS, { r2: .04, mat: "metal" });
    b.panel(x, .11, z + .066, .04, .03, mix3(C.cream, C.stone, .3));
  }
  const TX = -1.55, TZ = -.84, TH = 2.0, TS = .3;
  function armory(b, o) {                                    /* 两层方形军械塔：隅石、腰线、箭孔、尖拱窗、铁钉门、盾徽、托石挑檐、四坡顶 */
    reseed(41);
    const cy = o.cyber;
    b.box(TX, -.12, TZ, TS * 2 + .1, P0 + .12, TS * 2 + .1, STD, { top: DRESS2, nb: true });
    for (let f = 0; f < 4; f++) { b.at(TX, 0, TZ, f * PI / 2); mason(b, () => [-TS, TS], P0, TH, TS, { ql: true, qr: true, qph: f }); b.pop(); }
    b.box(TX, Y2 + .05, TZ, TS * 2 + .04, .045, TS * 2 + .04, DRESS2, { nb: true });
    /* 正面：门、盾徽、二层尖拱窗 */
    b.at(TX, 0, TZ + TS);
    b.at(0, P0, 0); archRing(b, .2, .24, .66, .045, -.02, .025); b.at(0, 0, -.01); door(b, .2, .24, .66, { planks: 3, straps: [.06, .22], noring: true }); b.pop(); b.pop();
    b.at(0, .66, 0);
    prism(b, [[0, -.12], [.09, -.03], [.09, .1], [-.09, .1], [-.09, -.03]], -.01, .012, DRESS);
    fan(b, [[0, -.09], [.07, -.02], [.07, .075], [-.07, .075], [-.07, -.02]], .014, C.banner2);
    for (const s of [-1, 1]) { b.at(0, -.005, .018, 0, 1, 0, s * .7); b.box(-.006, -.07, 0, .012, .15, .004, mix3(C.metal, C.white, .3), M); b.box(-.022, -.055, 0, .044, .01, .005, C.gold, M); b.pop(); }
    b.pop();
    lancet(b, 0, 1.2, 0, .13, .3, { cy });
    b.pop();
    /* 两侧箭孔、背面小窗 */
    for (const f of [-1, 1]) { b.at(TX, 0, TZ, f * PI / 2); slit(b, 0, .55, TS); slit(b, 0, 1.35, TS); b.pop(); }
    b.at(TX, 0, TZ, PI); lancet(b, 0, 1.35, TS, .1, .22, { cy, plain: true }); b.pop();
    /* 托石挑檐＋四坡顶 */
    for (let f = 0; f < 4; f++) { b.at(TX, 0, TZ, f * PI / 2); for (let x = -TS + .06; x <= TS - .05; x += .12) corbel(b, x, TH + .04, TS); b.pop(); }
    b.box(TX, TH, TZ, TS * 2 + .08, .07, TS * 2 + .08, DRESS2, { top: DRESS });
    const top = hipRoof(b, TX, TH + .07, TZ, TS * 2 + .12, .7, cy);
    reseed(42);
    b.at(TX - TS, 0, TZ, -PI / 2); ivy(b, .05, P0, 0, .4, 1.3, 26); b.pop();
    return top;
  }

  /* ================= Lv3：军官小楼 ================= */
  const OX = -1.5, OZ = .28, OW = .3, OD = .27, OY1 = .55, OY2 = 1.02, ORR = .48;
  function officers(b, o) {                                  /* 石砌底层、挑出的半木上层、凸窗、条纹遮阳篷（2077 换玻璃小花房）、门边长椅、小烟囱、屋脊小钟亭挂小旗 */
    reseed(51);
    const cy = o.cyber, jet = .035;
    b.box(OX, -.08, OZ, OW * 2 + .08, .14, OD * 2 + .08, STD, { top: DRESS2, nb: true });
    stoneBox(b, OX - OW, OX + OW, .06, OY1, OZ - OD, OZ + OD, { rh: .12 });
    /* 挑檐梁头 */
    for (let i = 0; i < 5; i++) b.box(OX - OW + .06 + i * (OW * 2 - .12) / 4, OY1 - .03, OZ + OD + .02, .04, .04, .05, OAK);
    /* 上层半木：四面 */
    b.box(OX, OY1, OZ, OW * 2 + jet * 2, .02, OD * 2 + jet * 2, OAK);
    htWall(b, OX - OW - jet, OX + OW + jet, OY1 + .02, OY2, OZ + OD + jet, ["x", "w", "x"], { ww: .14, wh: .17 });
    b.at(OX + OW + jet, 0, OZ, PI / 2); htWall(b, -OD - jet, OD + jet, OY1 + .02, OY2, 0, ["w", "l"], { ww: .13, wh: .17 }); b.pop();
    b.at(OX - OW - jet, 0, OZ, -PI / 2); htWall(b, -OD - jet, OD + jet, OY1 + .02, OY2, 0, ["r", "w"], { ww: .12, wh: .16 }); b.pop();
    b.at(OX, 0, OZ - OD - jet, PI); htWall(b, -OW - jet, OW + jet, OY1 + .02, OY2, 0, ["x", "-", "x"], {}); b.pop();
    /* 屋顶：前后山墙朝 ±z，屋脊沿 z */
    const rw = OD * 2 + jet * 2, rd = OW * 2 + jet * 2;
    b.at(OX, 0, OZ, PI / 2);
    slateRoof(b, rw, OY2, rd, ORR, .07, { bands: 4, patches: 3 });
    b.pop();
    for (const s of [-1, 1]) {                               /* 两头半木山墙（三角）＋封檐板 */
      const zz = OZ + s * (OD + jet);
      b.at(OX, 0, zz, s > 0 ? 0 : PI);
      tf(b, [-rd / 2, OY2, 0], [rd / 2, OY2, 0], [0, OY2 + ORR, 0], mix3(DAUB, [.84, .8, .72], .25), [0, 0, 1]);
      strip(b, -rd / 2, OY2 + .02, rd / 2, OY2 + .02, .05, 0, .024, OAK);
      strip(b, 0, OY2 + .03, 0, OY2 + ORR - .05, .04, 0, .02, OAK);
      if (s > 0) tWin(b, 0, OY2 + .08, .1, .13, 0, { e: .45 });
      else for (const k of [-1, 1]) strip(b, k * rd * .4, OY2 + .03, k * .02, OY2 + ORR * .85, .035, 0, .018, OAK);
      for (const k of [-1, 1]) b.beam([k * (rd / 2 + .065), OY2 - .065 * ORR / (rd / 2) - .02, .03], [0, OY2 + ORR + .05, .03], .045, OAK2, { tz: .035 });
      b.pop();
    }
    /* 底层正面：凸窗＋门 */
    const zf = OZ + OD, bx = OX - .1, bw = .24, by = .2, bh = .2, bd = .09;
    b.box(bx, .06, zf + bd / 2, bw + .02, by - .09, bd, sc(.3), { nb: true, top: DRESS2 });
    b.box(bx, by - .03, zf + bd / 2 + .01, bw + .05, .03, bd + .03, DRESS, { nb: true });
    b.panel(bx, by, zf + bd, bw - .02, bh, WIN, { e: .52 });
    for (const s of [-1, 1]) qf(b, [bx + s * (bw / 2 - .01), by, zf], [bx + s * (bw / 2 - .01), by, zf + bd], [bx + s * (bw / 2 - .01), by + bh, zf + bd], [bx + s * (bw / 2 - .01), by + bh, zf], WIN, [s, 0, 0], { e: .52 });
    for (const s of [-1, 1]) b.box(bx + s * (bw / 2 - .01), by, zf + bd, .03, bh, .03, OAK2);
    for (let i = 1; i < 3; i++) b.panel(bx - bw / 2 + i * bw / 3, by, zf + bd + .004, .012, bh, MULL);
    b.panel(bx, by + bh * .55, zf + bd + .005, bw - .03, .012, MULL);
    b.box(bx, by + bh, zf + bd / 2, bw + .03, .04, bd + .015, OAK2);
    const dxp = OX + .17;
    b.at(dxp, .06, zf); archRing(b, .14, .2, .66, .035, -.02, .02); b.at(0, 0, -.01); door(b, .14, .2, .66, { planks: 3, straps: [.05, .17], noring: true }); b.pop(); b.pop();
    b.box(dxp, 0, zf + .07, .22, .06, .12, DRESS2, { nb: true });
    if (cy) {                                                /* 2077：凸窗外一间黄铜框玻璃小花房 */
      const gx0 = bx - bw / 2 - .05, gx1 = bx + bw / 2 + .05, gz = zf + .26, gy = .5;
      b.box((gx0 + gx1) / 2, 0, (zf + gz) / 2 + .02, gx1 - gx0, .06, gz - zf, DRESS2, { nb: true });
      for (const [A, B2, Cc, D, h] of [[[gx0, .06, gz], [gx1, .06, gz], [gx1, gy - .06, gz], [gx0, gy - .06, gz], [0, 0, 1]], [[gx0, .06, zf], [gx0, .06, gz], [gx0, gy - .06, gz], [gx0, gy, zf], [-1, 0, 0]], [[gx1, .06, gz], [gx1, .06, zf], [gx1, gy, zf], [gx1, gy - .06, gz], [1, 0, 0]], [[gx0, gy - .06, gz], [gx1, gy - .06, gz], [gx1, gy, zf], [gx0, gy, zf], [0, 1, .4]]]) qf(b, A, B2, Cc, D, GLASS, h, GLS);
      for (const x of [gx0, (gx0 + gx1) / 2, gx1]) { bar(b, [x, .06, gz], [x, gy - .06, gz], .016, BRASS, GL); bar(b, [x, gy - .06, gz], [x, gy, zf], .016, BRASS, GL); }
      bar(b, [gx0, gy - .06, gz], [gx1, gy - .06, gz], .02, BRASS, GL); bar(b, [gx0, .2, gz], [gx1, .2, gz], .012, BRASS, GL);
      for (const x of [gx0, gx1]) bar(b, [x, gy - .06, gz], [x, gy - .06, zf], .014, BRASS, GL);
      for (let i = 0; i < 3; i++) b.sphere(gx0 + .07 + i * .1, .1, gz - .08, .045, 5, mix3(C.leaf, C.leafD, R()), {});
    } else {                                                 /* 1994：凸窗上的条纹遮阳篷（低饱和的暗红和奶白相间），下沿一排扇形垂边 */
      const ax0 = bx - bw / 2 - .04, ax1 = bx + bw / 2 + .04, ay0 = by + bh + .17, ay1 = by + bh + .03, az0 = zf + .01, az1 = zf + bd + .14, n = 6, c1 = mix3(C.banner, C.castle, .35), c2 = mix3(C.cream, C.stone, .2);
      for (let i = 0; i < n; i++) {
        const xa = ax0 + i * (ax1 - ax0) / n, xb = xa + (ax1 - ax0) / n, c = i % 2 ? c2 : c1;
        qf(b, [xa, ay0, az0], [xb, ay0, az0], [xb, ay1, az1], [xa, ay1, az1], c, [0, 1, .5]);
        qf(b, [xa, ay0, az0], [xb, ay0, az0], [xb, ay1, az1], [xa, ay1, az1], mix3(c, [0, 0, 0], .25), [0, -1, -.5]);
        tri2(b, [xa, ay1, az1], [xb, ay1, az1], [(xa + xb) / 2, ay1 - .05, az1], c);
      }
      for (const s of [ax0, ax1]) tri2(b, [s, ay0, az0], [s, ay1, az1], [s, ay1, az0], c1);
      for (const s of [ax0 + .01, ax1 - .01]) bar(b, [s, ay0 - .02, az0], [s, ay1 + .01, az1 - .01], .01, IRON, M);
    }
    wallLantern(b, dxp + .12, .42, zf, cy);
    /* 侧面（朝操场）长椅 */
    bench(b, OX + OW + .12, OZ + .02, .36, PI / 2);
    /* 后坡小烟囱 */
    const cTop = chimney(b, OX - .14, OZ - .17, OY2 + .12, OY2 + ORR + .1, !o.bad);
    /* 屋脊小钟亭：四根柱、挂一口小铜钟、四坡小顶、小旗 */
    const kx = OX, kz = OZ + .1, ky = OY2 + ORR - .06;
    b.box(kx, ky, kz, .17, .08, .17, DRESS2, { nb: true });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(kx + sx * .065, ky + .08, kz + sz * .065, .03, .17, .03, OAK);
    b.cone(kx, ky + .12, kz, .04, .07, 6, BRONZE, { mat: "metal", nb: true, r2: 0 });
    b.cyl(kx, ky + .09, kz, .045, .045, 6, BRONZE, { r2: .025, mat: "metal" });
    b.box(kx, ky + .25, kz, .2, .025, .2, OAK2);
    b.pyramid(kx, ky + .275, kz, .2, .2, .16, SL);
    const fTop = flag(b, kx, ky + .43, kz, C.banner2, .35, { L: .22, H: .1, t: .016 });
    return Math.max(cTop, fTop);
  }
  function tri2(b, A, B, Cc, col, o) { b.tri(A, B, Cc, col, o); b.tri(A, Cc, B, col, o); }

  /* ================= 拼装 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = Object.assign({}, o, { lv, cyber: cy, bad });
    barracks(b, oo);
    yard(b, oo);
    /* 操场里的东西 */
    const DUM = [[-.66, .5, .45], [-.36, .66, -.25], [-.04, .5, .35]];
    DUM.forEach(([x, z, ry], i) => { reseed(60 + i); const f = bad && i === 1; if (cy) golem(b, x, z, ry, f); else dummy(b, x, z, ry, f); });
    spearRack(b, -.9, .18, PI / 2, oo);
    target(b, .78, .26, -.62, bad ? .35 : 0);
    if (cy) { runeRing(b, .3, .62, .25); runeRing(b, .55, .6, -.2); }
    trough(b, 1.32, .58, PI / 2);
    flagpole(b, 1.3, .1, bad, cy);
    reseed(70); barrel(b, BX1 - .14, ZF + .14, .07, .17, .3);
    if (lv >= 2) { crypt(b, oo); armory(b, oo); }
    if (lv >= 3) officers(b, oo);
    if (cy && !bad) b.emit(DX + .22, .78, ZP + .38, "cat", 1, 1);
  }
  /* label 高度 = 最高点 + .2（audit 实测） */
  build.h = o => {
    const lv = Math.max(1, Math.min(3, o.lv || 1));
    return lv >= 2 ? 3.32 : (o.cyber ? 2.93 : 2.84);
  };
  Isle3D.FAC["兵营"] = build;
})();
