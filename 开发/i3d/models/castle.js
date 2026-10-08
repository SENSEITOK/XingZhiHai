/* 主屋：霍格沃茨式中世纪城堡。
   1994：风化灰石砌的城堡——石台基、门前台阶和两盏铁提灯；城堞围墙；门楼带尖拱门洞、半落的铁吊闸、铁钉木门、角楼、挂旗；
         正中大厅是哥特式：尖拱长窗、山墙上一扇玫瑰窗、扶壁和小尖塔、深色石板瓦陡顶、老虎窗、烟囱冒烟；
         左后一座方形钟楼（转角隅石、钟面、开敞的钟室挂铜钟、城堞、四角小尖塔、八角石板瓦尖顶和风向标）；
         另外三座圆塔，高圆锥石板瓦尖顶、塔顶小旗；墙角爬着常春藤，院里两棵树探出墙头。
   2077：同一座城堡，右院换成黄铜骨架的玻璃花房翼楼（带玻璃穹顶小圆厅），左院立一座黄铜飞艇系泊桅杆（顶上一盏小暖灯、系着一艘小飞艇），
         尖顶收口换黄铜，门前浮着两盏猫球灯；不加霓虹、不加全息。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, P = .36;                              /* P：石台基顶面 */
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石：窗框、压顶、隅石 */
  const INNER = mix3(STD, [.14, .13, .15], .45);           /* 门洞里、钟室里的阴影 */
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), IRON = C.iron;   /* 深蓝灰石板瓦 */
  const WIN = mix3(C.glow, [.46, .33, .21], .34);          /* 烛光窗 */
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BG = { mat: "gloss" };   /* 2077 的黄铜骨架用亮面漆，不反出一圈圈亮光 */
  const BRONZE = mix3(C.gold, C.wood, .38);
  const M = { mat: "metal" };
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  function sc(y) {                                          /* 一块石头的颜色：深浅不一，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .42 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);   /* 暖一点、冷一点的石头 */
    if (r > .94) c = mix3(c, STD, .35);
    const g = Math.max(0, Math.min(.3, (1.5 - y) * .17));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }

  /* ---------- 平面多边形、尖拱 ---------- */
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
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff) {  /* 尖拱门洞上方的拱肩（前后两面＋拱腹） */
    const pts = archPts(w, p, 5);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .18, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .13 : .25) : 0, q1 = o.qr ? ((j + ph) % 2 ? .13 : .25) : 0, cuts = [];
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
  function rwall(b, cx, cz, r, y0, y1, seg, rh) {           /* 圆塔身：一圈圈石砌，层层错半块 */
    const n = Math.max(1, Math.round((y1 - y0) / (rh || .18))), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * 2 * PI, a2 = (i + 1 + off) / seg * 2 * PI, px = cx + Math.sin(a) * r, pz = cz + Math.cos(a) * r, qx = cx + Math.sin(a2) * r, qz = cz + Math.cos(a2) * r;
        b.quad([px, ya, pz], [qx, ya, qz], [qx, yb, qz], [px, yb, pz], sc(ya));
      }
    }
    b.cyl(cx, y0, cz, r * Math.cos(PI / seg) - .006, y1 - y0, seg, STD, { nb: true, a0: PI / seg });
  }
  function slab(b, x0, x1, y0, y1, t, o) {                  /* 一段有厚度的墙（沿 x，墙心 z=0）：两面砌石、墙顶、两端 */
    o = o || {};
    mason(b, () => [x0, x1], y0, y1, t / 2, o);
    mason(b, () => [x0, x1], y0, y1, -t / 2, Object.assign({}, o, { back: true }));
    b.quad([x0, y1, t / 2], [x1, y1, t / 2], [x1, y1, -t / 2], [x0, y1, -t / 2], o.top || mix3(C.stone, ST2, .5));
    if (o.ends) {
      b.quad([x0, y0, -t / 2], [x0, y0, t / 2], [x0, y1, t / 2], [x0, y1, -t / 2], ST2);
      b.quad([x1, y0, t / 2], [x1, y0, -t / 2], [x1, y1, -t / 2], [x1, y1, t / 2], ST2);
    }
  }
  function merlons(b, x0, x1, y, z, d, o) {                 /* 墙头一排垛口 */
    o = o || {};
    const mw = o.mw || .13, gap = o.gap || .1, mh = o.mh || .16, n = Math.max(1, Math.floor((x1 - x0 + gap) / (mw + gap))), tot = n * mw + (n - 1) * gap, s = (x0 + x1) / 2 - tot / 2;
    for (let i = 0; i < n; i++) b.box(s + mw / 2 + i * (mw + gap), y, z, mw, mh, d, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS });
  }
  function rmerlons(b, cx, cz, r, y, n, o) {
    o = o || {};
    for (let i = 0; i < n; i++) { b.at(cx, 0, cz, (i + .5) / n * 2 * PI); b.box(0, y, r - .05, o.mw || .11, o.mh || .15, .1, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS }); b.pop(); }
  }
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块（不画背面和顶面）：前、左、右、底 */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function corbel(b, x, y, z) { cbox(b, x, y - .13, z - .02, .06, .07, z + .04, DRESS2); cbox(b, x, y - .06, z - .02, .075, .06, z + .075, DRESS2); }
  function corbels(b, x0, x1, y, z, step) {                 /* 挑檐下一排两级托石 */
    for (let x = x0; x <= x1 + 1e-6; x += step) corbel(b, x, y, z);
  }
  function rcorbels(b, cx, cz, r, y, n) {
    for (let i = 0; i < n; i++) { b.at(cx, 0, cz, i / n * 2 * PI); corbel(b, 0, y, r); b.pop(); }
  }
  function wedge(b, x, y, z, w, h, d, col) {                /* 扶壁的斜顶：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col);
    b.quad([x1, y, z0], [x0, y, z0], [x0, y1, z0], [x1, y1, z0], col);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col);
  }

  /* ---------- 窗、门、玫瑰窗 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .045, e = o.e != null ? o.e : .55, fc = o.frame || DRESS;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), -.03, .02, fc);
    fan(b, outline(w, h, 0, p), .024, o.glass || WIN, { e });
    if (o.two) b.box(0, 0, .02, .02, h + archY(w, p, 0) * .72, .02, fc);
    if (o.tr) b.box(0, h * o.tr, .02, w, .018, .02, fc);
    b.box(0, -fr - .035, 0, w + fr * 2 + .05, .035, .09, DRESS);
    if (o.hood) {                                            /* 拱上滴水线：一道窄料石券 */
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .06, p, 3), zh = .04;
      for (let i = 0; i < ai.length - 1; i++) {
        b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
        b.quad([ao[i + 1][0], h + ao[i + 1][1], -.01], [ao[i][0], h + ao[i][1], -.01], [ao[i][0], h + ao[i][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS2);
      }
      for (const s of [-1, 1]) b.box(s * (w / 2 + fr + .015), h - .06, .015, .045, .07, .05, DRESS, { nb: true });
    }
    b.pop();
  }
  function slit(b, x, y, z) {                               /* 箭孔：十字窄缝 */
    b.panel(x, y - .03, z + .002, .08, .32, DRESS2);
    b.panel(x, y, z + .004, .03, .26, INNER);
    b.panel(x, y + .12, z + .005, .1, .028, INNER);
  }
  function rose(b, x, y, z, r) {                            /* 玫瑰窗：料石圈、八根窗棂、彩色玻璃花瓣 */
    const N = 16, ro = r + .08, cs = a => [Math.cos(a), Math.sin(a)];
    const g1 = mix3(WIN, [.46, .28, .28], .5), g2 = mix3(WIN, [.28, .32, .46], .55);
    b.at(x, y, z);
    for (let i = 0; i < N; i++) {
      const [c1, s1] = cs(i / N * 2 * PI), [c2, s2] = cs((i + 1) / N * 2 * PI);
      b.quad([c1 * ro, s1 * ro, .035], [c1 * r, s1 * r, .035], [c2 * r, s2 * r, .035], [c2 * ro, s2 * ro, .035], i % 2 ? DRESS : DRESS2);
      b.quad([c1 * ro, s1 * ro, -.02], [c2 * ro, s2 * ro, -.02], [c2 * ro, s2 * ro, .035], [c1 * ro, s1 * ro, .035], DRESS2);
      b.tri([0, 0, .022], [c1 * r, s1 * r, .022], [c2 * r, s2 * r, .022], i % 2 ? g1 : g2, { e: .45 });
      const ri = r * .2, rj = r * .32;
      b.quad([c1 * rj, s1 * rj, .032], [c1 * ri, s1 * ri, .032], [c2 * ri, s2 * ri, .032], [c2 * rj, s2 * rj, .032], DRESS);
    }
    fan(b, Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * 2 * PI) * r * .2, Math.sin(i / 8 * 2 * PI) * r * .2]), .031, WIN, { e: .5 });
    for (let i = 0; i < 8; i++) { const [c, s] = cs(i / 8 * 2 * PI); b.beam([c * r * .3, s * r * .3, .028], [c * r, s * r, .028], .024, DRESS); }
    for (let i = 0; i < 8; i++) { const [c, s] = cs((i + .5) / 8 * 2 * PI); b.beam([c * r * .58, s * r * .58, .029], [c * r * .8, s * r * .8, .029], .018, DRESS); }
    b.pop();
  }
  function door(b, w, h, p, o) {                            /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    o = o || {};
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    const n = o.planks || 6;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, i === n / 2 ? .018 : .01, h + archY(w, p, x) - .02, dark); }
    for (const y of o.straps || [h * .18, h * .55, h * .88]) {
      b.box(0, y, .006, w - .03, .03, .012, IRON, M);
      for (let i = 0; i < 6; i++) b.panel(-w / 2 + .05 + i * (w - .1) / 5, y + .007, .0125, .016, .016, C.metal, M);
    }
    for (const x of [-.05, .05]) { b.at(x * w / .5, h * .45, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .028, .007, 8, 3, IRON, M); b.pop(); }
  }
  function lantern(b, x, y, z, cy) {                        /* 铁提灯（六角，暖光） */
    const fr = cy ? C.gold : IRON, fm = M;
    b.cyl(x, y, z, .07, .03, 6, fr, fm);
    b.cyl(x, y + .03, z, .052, .15, 6, C.lamp, { r2: .064, e: .7 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * PI; b.beam([x + Math.cos(a) * .058, y + .03, z + Math.sin(a) * .058], [x + Math.cos(a) * .069, y + .18, z + Math.sin(a) * .069], .012, fr, fm); }
    b.cyl(x, y + .18, z, .085, .025, 6, fr, fm);
    b.cone(x, y + .205, z, .08, .11, 6, fr, fm);
    b.sphere(x, y + .33, z, .022, 4, fr, fm);
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、尖底布条、金边、菱形徽 */
    b.beam([x - w / 2 - .035, yt + .012, z + .035], [x + w / 2 + .035, yt + .012, z + .035], .02, IRON, M);
    b.at(x, yt, z + .015);
    fan(b, [[-w / 2, -h + .09], [0, -h], [w / 2, -h + .09], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .022, -h + .1, .003, .013, h - .13, C.gold, M);
    b.panel(w / 2 - .022, -h + .1, .003, .013, h - .13, C.gold, M);
    b.panel(0, -.07, .003, w - .02, .013, C.gold, M);
    const yc = -h * .48;
    fan(b, [[0, yc - .065], [.05, yc], [0, yc + .065], [-.05, yc]], .004, C.gold, M);
    fan(b, [[0, yc - .03], [.022, yc], [0, yc + .03], [-.022, yc]], .006, col);
    b.pop();
  }
  function flag(b, x, y, z, col) {                          /* 塔顶小旗：铁杆、金球、随风摆的尖角旗 */
    b.beam([x, y - .12, z], [x, y + .6, z], .022, IRON, M);
    b.sphere(x, y + .62, z, .03, 4, C.gold, M);
    const L = .44, Hh = .2, top = y + .56, segs = 4;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .012 + L * t0, x1 = x + .012 + L * t1, w0 = Math.sin(t0 * 5.5) * .035, w1 = Math.sin(t1 * 5.5) * .035, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .55) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .028 + R() * .03, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, r, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .028 + R() * .03;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], r + .012 + R() * .014, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }

  /* ---------- 尖顶 ---------- */
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带，略往里收 */
    b.cyl(cx, y, cz, r * 1.12, h * .05, seg, SL2, { r2: r * .96, nt: true, bot: STD });
    if (cy) b.cyl(cx, y + h * .05, cz, r * .975, .035, seg, C.gold, { mat: "metal", nt: true, nb: true });
    const y0 = y + h * .05, H = h * .95, nb = 7;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true });
    }
    return y + h;
  }
  function spireR(r, h, t) { return r * .96 * Math.pow(1 - t, 1.1); }
  function lucarne(b, cx, cz, a, y, rr, cy) {               /* 尖顶上的小老虎窗 */
    b.at(cx, 0, cz, a);
    b.box(0, y, rr - .06, .15, .17, .2, mix3(SL, STD, .4));
    b.panel(0, y + .03, rr + .041, .08, .1, WIN, { e: .55 });
    b.at(0, y + .17, rr - .06, PI / 2); b.gable(0, 0, 0, .24, .21, .12, SL2, { end: mix3(SL, STD, .4) }); b.pop();
    if (cy) b.sphere(0, y + .3, rr + .04, .018, 4, C.gold, M);
    b.pop();
  }
  function finial(b, x, y, z, cy) { b.beam([x, y - .06, z], [x, y + .26, z], .024, cy ? C.gold : IRON, M); b.sphere(x, y + .06, z, .04, 5, cy ? C.gold : BRONZE, M); }

  /* ---------- 大件 ---------- */
  function podium(b) {                                       /* 石台基：粗凿大石块，压顶石 */
    const x0 = -2.25, x1 = 2.25, z0 = -2.25, z1 = 1.85, zc = (z0 + z1) / 2, hz = (z1 - z0) / 2;
    const pc = y => mix3(mix3(ST2, STD, .3 + R() * .45), C.ivy, y < .05 ? .12 : 0);
    const o = { rh: .21, col: pc };
    mason(b, () => [x0, x1], -.6, P - .06, z1, o);
    mason(b, () => [x0, x1], -.6, P - .06, z0, Object.assign({ back: true }, o));
    b.at(x1, 0, zc, PI / 2); mason(b, () => [-hz, hz], -.6, P - .06, 0, o); b.pop();
    b.at(x0, 0, zc, -PI / 2); mason(b, () => [-hz, hz], -.6, P - .06, 0, o); b.pop();
    b.box(0, P - .06, zc, x1 - x0 + .06, .06, z1 - z0 + .06, DRESS2, { top: mix3(C.stone, ST, .5), nb: true });
    for (let i = 0; i < 7; i++) b.box(-1.5 + i * .5, P, 1.74, .48, .006, .2, mix3(C.stone, ST2, R() * .5), { nb: true });   /* 门前铺石 */
  }
  function steps(b, cy) {                                    /* 门前台阶、两侧矮墙、灯座和铁提灯 */
    for (let i = 0; i < 4; i++) {
      const yt = P - (i + 1) * .072, zf = 1.85 + (i + 1) * .11;
      b.box(0, -.4, (1.85 + zf) / 2, 1.0, yt + .4, zf - 1.85, mix3(ST2, STD, .25), { top: i % 2 ? DRESS2 : DRESS, nb: true });
    }
    for (const s of [-1, 1]) {
      b.box(s * .58, -.4, 2.0, .16, P + .4 + .1, .3, ST2, { top: DRESS, nb: true });
      b.box(s * .58, -.4, 2.2, .2, .4 + .64, .18, mix3(ST2, STD, .2), { top: DRESS, nb: true });
      b.box(s * .58, .64, 2.2, .24, .05, .22, DRESS, { nb: true });
      b.beam([s * .58, .69, 2.2], [s * .58, .86, 2.2], .03, cy ? C.gold : IRON, M);
      lantern(b, s * .58, .86, 2.2, cy);
    }
  }
  function curtain(b, x0, x1, o) {                           /* 一段城堞围墙（局部：沿 x，外侧 +z） */
    o = o || {};
    const t = .28, top = 1.62;
    slab(b, x0, x1, P, top, t, {});
    b.box((x0 + x1) / 2, top - .07, t / 2, x1 - x0, .05, .05, DRESS2, { nb: true });
    merlons(b, x0 + .04, x1 - .04, top, t / 2 - .05, .1);
    for (const x of o.slits || []) slit(b, x, .95, t / 2);
    for (const x of o.butt || []) { b.box(x, P, t / 2 + .09, .16, .8, .18, sc(.6), { nb: true }); wedge(b, x, P + .8, t / 2 + .09, .16, .18, .18, sc(1)); }
  }
  function roundTower(b, cx, cz, r, h, sh, o) {               /* 圆塔：石砌塔身、腰线、窗、托石挑檐、石板瓦尖顶、旗 */
    o = o || {};
    const seg = o.seg || 14;
    b.cyl(cx, P, cz, r + .06, .22, seg, mix3(ST2, STD, .35), { r2: r + .005, nb: true, nt: true });
    rwall(b, cx, cz, r, P, h, seg);
    for (const y of o.bands || []) b.cyl(cx, y, cz, r + .022, .05, seg, DRESS2, { a0: PI / seg });
    for (const w of o.wins || []) { b.at(cx, 0, cz, w[0]); lancet(b, 0, w[1], r - .006, w[2], w[3], { two: w[4], p: .72, fr: .04 }); b.pop(); }
    for (const s of o.slits || []) { b.at(cx, 0, cz, s[0]); slit(b, 0, s[1], r - .004); b.pop(); }
    rcorbels(b, cx, cz, r, h, Math.round(seg * .9));
    b.cyl(cx, h - .02, cz, r + .09, .1, seg, DRESS2, { a0: PI / seg });
    const top = spire(b, cx, h + .08, cz, r + .02, sh, seg, o.cy);
    for (const l of o.luc || []) lucarne(b, cx, cz, l, h + .08 + sh * .2, spireR(r + .02, sh, .22), o.cy);
    if (o.flag) flag(b, cx, top, cz, o.flag); else finial(b, cx, top, cz, o.cy);
    if (o.ivy) rivy(b, cx, cz, r, o.ivy[0], o.ivy[1], P, o.ivy[2], o.ivy[3]);
    return top;
  }

  function gatehouse(b, o) {                                 /* 门楼：尖拱门洞、半落的吊闸、门洞里的铁钉木门、挑出的雉堞、两角小角楼、挂旗、壁灯 */
    const gx = .56, zf = 1.62, zb = 1.02, zc = (zf + zb) / 2, top = 2.3, gw = .58, gp = .64, gs = 1.08, rise = archY(gw, gp, 0), apex = gs + rise;
    mason(b, () => [-gx, -gw / 2], P, top, zf, { ql: 1 });
    mason(b, () => [gw / 2, gx], P, top, zf, { qr: 1 });
    mason(b, () => [-gw / 2, gw / 2], apex, top, zf, {});
    mason(b, () => [-gx, -gw / 2], P, top, zb, { back: true, qr: 1 });
    mason(b, () => [gw / 2, gx], P, top, zb, { back: true, ql: 1 });
    mason(b, () => [-gw / 2, gw / 2], apex, top, zb, { back: true });
    for (const s of [1, -1]) { b.at(s * gx, 0, zc, s * PI / 2); mason(b, () => [-(zf - zb) / 2, (zf - zb) / 2], P, top, 0, { ql: 1, qr: 1, qph: 1 }); b.pop(); }
    archFill(b, gw, gp, gs, apex, zf, zb, ST2, INNER);
    b.quad([-gw / 2, P, zf], [-gw / 2, P, zb], [-gw / 2, gs, zb], [-gw / 2, gs, zf], INNER);
    b.quad([gw / 2, P, zb], [gw / 2, P, zf], [gw / 2, gs, zf], [gw / 2, gs, zb], INNER);
    b.quad([-gw / 2, apex, zf], [gw / 2, apex, zf], [gw / 2, apex, zb], [-gw / 2, apex, zb], INNER);
    /* 门洞料石券、门边隅石、拱心石 */
    const inn = archPts(gw, gp, 5), out = archPts(gw + .16, gp, 5), zq = zf + .012;
    for (let i = 0; i < inn.length - 1; i++) b.quad([out[i][0], gs + out[i][1], zq], [inn[i][0], gs + inn[i][1], zq], [inn[i + 1][0], gs + inn[i + 1][1], zq], [out[i + 1][0], gs + out[i + 1][1], zq], i % 2 ? DRESS : DRESS2);
    for (const s of [-1, 1]) for (let j = 0; j < 4; j++) { const y0 = P + j * (gs - P) / 4, y1 = y0 + (gs - P) / 4, wv = j % 2 ? .08 : .12, xa = s * gw / 2, xb = s * (gw / 2 + wv); b.quad(s > 0 ? [xa, y0, zq] : [xb, y0, zq], s > 0 ? [xb, y0, zq] : [xa, y0, zq], s > 0 ? [xb, y1, zq] : [xa, y1, zq], s > 0 ? [xa, y1, zq] : [xb, y1, zq], j % 2 ? DRESS2 : DRESS); }
    b.box(0, apex - .05, zf + .02, .09, .14, .05, DRESS);
    /* 门洞里：木门；门洞口：半落的铁吊闸 */
    b.at(0, P, zc + .05); door(b, gw, gs - P, gp, { planks: 6 }); b.pop();
    const pz = zf - .07;
    for (let i = 0; i < 7; i++) { const x = -.25 + i * .25 / 3; b.beam([x, .78, pz], [x, 1.62, pz], .022, IRON, M); b.at(x, .78, pz, 0, 1, PI); b.cone(0, 0, 0, .016, .06, 4, IRON, M); b.pop(); }
    for (const y of [.86, 1.02, 1.18, 1.34]) b.beam([-.29, y, pz], [.29, y, pz], .02, IRON, M);
    /* 门上：盾徽 */
    b.at(0, 1.78, zf + .012);
    prism(b, [[0, -.17], [.13, -.04], [.13, .13], [-.13, .13], [-.13, -.04]], -.01, .012, DRESS);
    fan(b, [[0, -.13], [.1, -.03], [.1, .1], [-.1, .1], [-.1, -.03]], .014, o.c1);
    fan(b, [[0, -.13], [.1, -.03], [.1, .1], [0, .1]], .016, o.c2);
    fan(b, [[0, -.03], [.045, .02], [0, .07], [-.045, .02]], .019, C.gold, M);
    b.pop();
    /* 挑出的雉堞：托石、压檐、垛口 */
    corbels(b, -gx + .06, gx - .06, top, zf, .16);
    b.box(0, top, zc, gx * 2 + .1, .12, zf - zb + .1, DRESS2, { top: mix3(C.stone, ST2, .5) });
    merlons(b, -gx - .02, gx + .02, top + .12, zf, .1);
    merlons(b, -gx - .02, gx + .02, top + .12, zb, .1);
    for (const s of [1, -1]) { b.at(s * (gx + .05 - .05), 0, zc, s * PI / 2); merlons(b, -.2, .2, top + .12, 0, .1); b.pop(); }
    /* 两角小角楼 */
    for (const s of [-1, 1]) {
      const bx = s * (gx + .02), bz = zf + .02;
      b.at(bx, 1.98, bz, 0, 1, PI); b.cone(0, 0, 0, .15, .26, 8, DRESS2, { nb: true }); b.pop();
      b.cyl(bx, 1.98, bz, .15, .66, 8, sc(2), { nb: true, nt: true, a0: PI / 8 });
      b.cyl(bx, 2.33, bz, .16, .04, 8, DRESS2, { a0: PI / 8 });
      b.at(bx, 0, bz, s * .7); slit(b, 0, 2.1, .14); b.pop();
      b.cyl(bx, 2.64, bz, .19, .05, 8, DRESS2, { a0: PI / 8 });
      spire(b, bx, 2.69, bz, .17, .5, 8, o.cy);
      finial(b, bx, 3.19, bz, o.cy);
    }
    /* 挂旗、壁灯 */
    banner(b, -.425, 2.2, zf, .2, .7, o.c1);
    banner(b, .425, 2.2, zf, .2, .7, o.c2);
    for (const s of [-1, 1]) { b.beam([s * .425, 1.36, zf], [s * .425, 1.36, zf + .14], .025, o.cy ? C.gold : IRON, M); b.beam([s * .425, 1.36, zf + .13], [s * .425, 1.3, zf + .13], .012, IRON, M); lantern(b, s * .425, 1.0, zf + .13, o.cy); }
  }

  function hall(b, o) {                                       /* 大厅：哥特式长屋，尖拱长窗、扶壁、玫瑰窗山墙、陡石板瓦顶 */
    const hx = .98, zf = .55, zb = -1.5, zc = (zf + zb) / 2, hd = (zf - zb) / 2, top = 2.75, gh = 1.5;
    const gable = y => { const w = hx * (1 - (y - top) / gh); return [-w, w]; };
    for (const s of [1, -1]) {                               /* 两侧墙：三开间，扶壁＋小尖塔 */
      b.at(s * hx, 0, zc, s * PI / 2);
      mason(b, () => [-hd, hd], P, top, 0, {});
      b.box(0, top - .06, .01, hd * 2, .06, .06, DRESS2, { nb: true });
      for (const wz of [.21, -.48, -1.16]) lancet(b, s * (zc - wz), 1.32, 0, .3, .9, { two: 1, tr: .5, hood: 1, p: .7 });
      for (const bz of [-.13, -.82]) {
        const u = s * (zc - bz);
        b.box(u, P, .15, .17, 1.28, .3, sc(1), { nb: true }); wedge(b, u, P + 1.28, .15, .17, .14, .3, sc(1.6));
        b.box(u, P + 1.28, .09, .14, top - P - 1.28, .18, sc(2.2), { nb: true });
        b.box(u, top, .09, .1, .3, .1, DRESS2, { nb: true }); b.pyramid(u, top + .3, .09, .13, .13, .3, DRESS2);
      }
      b.pop();
    }
    /* 正面山墙 */
    mason(b, () => [-hx, hx], P, top, zf, { ql: 1, qr: 1 });
    mason(b, gable, top, top + gh, zf, {});
    rose(b, 0, top + .52, zf, .34);
    for (const x of [-.45, .45]) lancet(b, x, 1.72, zf, .24, .52, { hood: 1, p: .72 });
    b.at(0, P, zf);
    { const w = .44, h = .5, pp = .62, inn = archPts(w, pp, 4), out = archPts(w + .14, pp, 4); for (let i = 0; i < inn.length - 1; i++) b.quad([out[i][0], h + out[i][1], .012], [inn[i][0], h + inn[i][1], .012], [inn[i + 1][0], h + inn[i + 1][1], .012], [out[i + 1][0], h + out[i + 1][1], .012], DRESS); b.panel(-w / 2 - .035, 0, .012, .07, h, DRESS); b.panel(w / 2 + .035, 0, .012, .07, h, DRESS); b.at(0, 0, .006); door(b, w, h, pp, { planks: 4, straps: [.12, .36] }); b.pop(); }
    b.pop();
    for (const s of [-1, 1]) b.beam([s * (hx + .04), top - .03, zf + .01], [0, top + gh + .05, zf + .01], .085, DRESS, { tz: .2 });
    b.box(0, top + gh - .02, zf - .02, .1, .2, .1, DRESS); b.pyramid(0, top + gh + .18, zf - .02, .13, .13, .26, DRESS); b.sphere(0, top + gh + .46, zf - .02, .035, 4, DRESS);
    ivy(b, -.62, P, zf, .5, 1.1, 60);
    /* 正面两角的八角小塔 */
    for (const s of [-1, 1]) {
      const tx = s * hx, tz = zf;
      rwall(b, tx, tz, .15, P, top + .3, 8, .2);
      b.cyl(tx, top + .3, tz, .19, .07, 8, DRESS2, { a0: PI / 8 });
      rmerlons(b, tx, tz, .18, top + .37, 6, { mw: .07, mh: .1 });
      b.cone(tx, top + .37, tz, .14, .62, 8, SL, { nb: true });
      finial(b, tx, top + .99, tz, o.cy);
    }
    /* 背面山墙 */
    mason(b, () => [-hx, hx], P, top, zb, { back: true, ql: 1, qr: 1 });
    mason(b, gable, top, top + gh, zb, { back: true });
    b.at(0, 0, zb, PI); lancet(b, 0, 2.9, 0, .26, .55, { hood: 1 }); b.pop();
    for (const s of [-1, 1]) b.beam([s * (hx + .04), top - .03, zb - .01], [0, top + gh + .05, zb - .01], .085, DRESS, { tz: .2 });
    /* 屋顶：石板瓦一道道深浅，屋脊压条、铁花脊饰，两侧老虎窗 */
    const ex = hx + .06, ey = top - .03, ry = top + gh - .08, z0 = zf - .03, z1 = zb + .03, nS = 7;
    for (let i = 0; i < nS; i++) {
      const t0 = i / nS, t1 = (i + 1) / nS, xa = ex * (1 - t0), xb = ex * (1 - t1), ya = ey + (ry - ey) * t0, yb = ey + (ry - ey) * t1, col = i % 2 ? SL : mix3(SL, SL2, .5);
      b.quad([xa, ya, z0], [xa, ya, z1], [xb, yb, z1], [xb, yb, z0], col);
      b.quad([-xa, ya, z1], [-xa, ya, z0], [-xb, yb, z0], [-xb, yb, z1], col);
    }
    for (const s of [-1, 1]) b.beam([s * ex, ey - .04, z0], [s * ex, ey - .04, z1], .05, mix3(SL, STD, .5));
    b.beam([0, ry, z0 + .02], [0, ry, z1 - .02], .07, mix3(SL, [0, 0, 0], .25));
    for (let z = z0 - .08; z > z1 + .05; z -= .21) b.cone(0, ry + .03, z, .02, .12, 4, o.cy ? C.gold : IRON, { mat: "metal", nb: true });
    for (const s of [-1, 1]) for (const dz of [.12, -.62]) {
      const t = .36, xd = s * (ex * (1 - t) - .02), yd = ey + (ry - ey) * t - .3;
      b.at(xd, yd, dz, s * PI / 2);
      b.box(0, 0, 0, .3, .4, .44, mix3(SL, STD, .4));
      b.box(0, .07, .222, .3, .3, .01, DRESS2);
      lancet(b, 0, .1, .225, .14, .14, { fr: .025, p: .6 });
      b.at(0, .4, 0, PI / 2); b.gable(0, 0, 0, .5, .38, .2, SL2, { end: mix3(SL, STD, .4) }); b.pop();
      b.pop();
    }
    /* 屋脊正中一座细尖塔（八角小灯亭＋尖顶） */
    { const fx = 0, fz = -.38, fy = ry - .12;
      b.cyl(fx, fy, fz, .16, .2, 8, mix3(SL, STD, .4), { a0: PI / 8, nt: true });
      b.cyl(fx, fy + .2, fz, .13, .3, 8, DRESS2, { a0: PI / 8, nt: true });
      for (let i = 0; i < 8; i += 2) { b.at(fx, 0, fz, i / 8 * 2 * PI); b.panel(0, fy + .25, .121, .05, .17, INNER); b.panel(0, fy + .25, .124, .012, .17, DRESS2); b.pop(); }
      b.cyl(fx, fy + .5, fz, .16, .04, 8, DRESS2, { a0: PI / 8 });
      for (let i = 0; i < 8; i++) { b.at(fx, 0, fz, (i + .5) / 8 * 2 * PI); b.box(0, fy + .54, .12, .04, .07, .04, DRESS2, { nb: true }); b.pop(); }
      b.cone(fx, fy + .54, fz, .12, .95, 8, SL, { nb: true });
      finial(b, fx, fy + 1.49, fz, o.cy); }
    /* 烟囱 */
    const cx = .46, cz = -1.18;
    for (let i = 0; i < 6; i++) b.box(cx, 3.25 + i * .22, cz, .28, .22, .3, sc(3 + i), { nb: i > 0 });
    b.box(cx, 4.57, cz, .36, .06, .38, DRESS);
    for (const dx of [-.06, .07]) b.cyl(cx + dx, 4.63, cz, .045, .14, 6, mix3(C.roofR, STD, .45), { r2: .04 });
    b.emit(cx, 4.82, cz, "smoke", 10, 1.1);
  }

  function keep(b, o) {                                       /* 方形钟楼：隅石、腰线、尖拱窗、钟面、开敞钟室挂铜钟、托石城堞、四角小尖塔、八角尖顶、风向标 */
    const kx = -1.62, kz = -1.62, hs = .56, top = 4.55, by1 = 5.3;
    b.box(kx, P, kz, hs * 2 + .1, .24, hs * 2 + .1, mix3(ST2, STD, .35), { nb: true, top: DRESS2 });
    for (let f = 0; f < 4; f++) { b.at(kx, 0, kz, f * PI / 2); mason(b, () => [-hs, hs], P + .24, top, hs, { ql: 1, qr: 1, qph: f }); b.pop(); }
    for (const y of [1.95, 3.45]) b.box(kx, y, kz, hs * 2 + .05, .06, hs * 2 + .05, DRESS2);
    const W = [[0, [[2.2, .3, .72, 1], [1.05, .14, .26]]], [1, [[3.62, .2, .32], [2.3, .24, .5]]], [2, [[2.3, .26, .56], [3.62, .2, .32]]], [3, [[2.3, .26, .56], [3.62, .2, .32], [1.1, .14, .24]]]];
    for (const [f, ws] of W) { b.at(kx, 0, kz, f * PI / 2); for (const w of ws) lancet(b, 0, w[0], hs, w[1], w[2], { two: w[3], hood: 1, tr: w[3] ? .5 : 0 }); b.pop(); }
    b.at(kx, 0, kz, PI * 1.5); slit(b, -.25, 1.15, hs); b.pop();
    /* 钟面 */
    b.at(kx, 3.98, kz + hs);
    { const N = 16, cs = a => [Math.cos(a), Math.sin(a)];
      for (let i = 0; i < N; i++) {
        const [c1, s1] = cs(i / N * 2 * PI), [c2, s2] = cs((i + 1) / N * 2 * PI);
        b.tri([0, 0, .02], [c1 * .24, s1 * .24, .02], [c2 * .24, s2 * .24, .02], mix3(C.cream, C.stone, .3));
        b.quad([c1 * .3, s1 * .3, .03], [c1 * .24, s1 * .24, .03], [c2 * .24, s2 * .24, .03], [c2 * .3, s2 * .3, .03], o.cy ? C.gold : DRESS, o.cy ? M : undefined);
      }
      for (let i = 0; i < 12; i++) { const [c, s] = cs(i / 12 * 2 * PI); b.beam([c * .19, s * .19, .024], [c * .225, s * .225, .024], i % 3 ? .012 : .022, IRON, M); }
      b.beam([0, 0, .03], [.1, .09, .03], .02, o.cy ? C.gold : IRON, M); b.beam([0, 0, .034], [-.03, -.17, .034], .014, o.cy ? C.gold : IRON, M);
      b.sphere(0, 0, .036, .022, 4, C.gold, M);
    }
    b.pop();
    /* 钟室 */
    b.box(kx, top - .02, kz, hs * 2 + .04, .06, hs * 2 + .04, DRESS2);
    for (let f = 0; f < 4; f++) {
      b.at(kx, 0, kz, f * PI / 2);
      b.box(-hs + .1, top, hs - .1, .2, by1 - top, .2, sc(4.8));
      b.box(0, top, hs - .09, .1, by1 - top, .18, sc(4.9));
      for (const ox of [-.205, .205]) { b.at(ox, 0, 0); archFill(b, .31, .62, 4.95, by1, hs, hs - .18, sc(5.1), INNER); b.pop(); }
      b.box(0, top + .04, hs - .02, hs * 2 - .3, .04, .06, DRESS);
      b.pop();
    }
    b.box(kx, by1 - .04, kz, hs * 2 - .2, .04, hs * 2 - .2, INNER);
    b.beam([kx - .3, 5.12, kz], [kx + .3, 5.12, kz], .05, C.woodD);
    b.cyl(kx, 4.8, kz, .17, .26, 10, BRONZE, { r2: .1, mat: "metal" }); b.sphere(kx, 5.06, kz, .1, 8, BRONZE, M); b.cyl(kx, 4.78, kz, .19, .04, 10, BRONZE, { mat: "metal", r2: .17 });
    /* 钟楼和大厅之间的小楼梯塔：细圆身、一路往上的箭孔、尖帽 */
    { const tx = -1.03, tz = -1.06, tr = .19, th = 4.95;
      rwall(b, tx, tz, tr, P, th, 8, .2);
      for (let i = 0; i < 6; i++) { b.at(tx, 0, tz, .2 + i * 1.05); slit(b, 0, 1.0 + i * .62, tr - .01); b.pop(); }
      b.cyl(tx, th, tz, .23, .05, 8, DRESS2, { a0: PI / 8 });
      b.cyl(tx, th + .05, tz, .2, .18, 8, sc(5), { a0: PI / 8, nt: true });
      b.at(tx, 0, tz, PI * .25); b.panel(0, th + .08, .2, .06, .1, WIN, { e: .5 }); b.pop();
      spire(b, tx, th + .23, tz, .2, .72, 8, o.cy);
      finial(b, tx, th + .95, tz, o.cy); }
    /* 托石城堞、四角小尖塔 */
    for (let f = 0; f < 4; f++) { b.at(kx, 0, kz, f * PI / 2); corbels(b, -hs + .08, hs - .08, by1 + .02, hs, .16); b.pop(); }
    b.box(kx, by1, kz, hs * 2 + .1, .12, hs * 2 + .1, DRESS2, { top: mix3(C.stone, ST2, .4) });
    for (let f = 0; f < 4; f++) { b.at(kx, 0, kz, f * PI / 2); merlons(b, -hs + .1, hs - .1, by1 + .12, hs, .1); b.pop(); }
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const px = kx + dx * hs, pz = kz + dz * hs;
      b.cyl(px, by1 + .12, pz, .09, .32, 8, sc(5.5), { a0: PI / 8 });
      b.cyl(px, by1 + .44, pz, .11, .04, 8, DRESS2, { a0: PI / 8 });
      b.cone(px, by1 + .48, pz, .1, .36, 8, SL, { nb: true });
      b.sphere(px, by1 + .86, pz, .025, 4, o.cy ? C.gold : DRESS, o.cy ? M : undefined);
    }
    /* 八角尖顶、老虎窗、风向标 */
    const sy = by1 + .1, sh = 1.72, apex = spire(b, kx, sy, kz, .44, sh, 8, o.cy);
    for (let f = 0; f < 4; f++) lucarne(b, kx, kz, f * PI / 2, sy + .2, spireR(.44, sh, .2) + .02, o.cy);
    b.beam([kx, apex - .1, kz], [kx, apex + .42, kz], .024, IRON, M);
    b.sphere(kx, apex + .04, kz, .045, 5, C.gold, M);
    b.beam([kx - .1, apex + .16, kz], [kx + .1, apex + .16, kz], .014, IRON, M); b.beam([kx, apex + .16, kz - .1], [kx, apex + .16, kz + .1], .014, IRON, M);
    b.spin(kx, apex + .3, kz, "y", .25, sb => {
      sb.beam([-.2, 0, 0], [.2, 0, 0], .018, IRON, M);
      sb.at(.2, 0, 0, 0, 1, 0, -PI / 2); sb.cone(0, 0, 0, .04, .1, 4, C.gold, M); sb.pop();
      sb.box(-.16, -.05, 0, .1, .1, .012, C.gold, M);
    });
    b.at(kx, 0, kz, PI / 2); ivy(b, .2, P + .24, hs, .55, 1.6, 80); b.pop();
  }

  /* ---------- 院子：1994 两棵树；2077 玻璃花房翼楼、飞艇系泊桅杆 ---------- */
  function tree(b, x, z, s) {                                 /* 院里的紫杉：细高的深绿尖塔形 */
    b.at(x, P, z, 0, s);
    b.cyl(0, 0, 0, .07, .5, 6, C.woodD, { r2: .05 });
    const cs = [mix3(C.pine, C.leafD, .4), mix3(C.pine, C.leaf, .2), mix3(C.pine, C.leaf2, .3)];
    for (let i = 0; i < 4; i++) b.cone(0, .3 + i * .42, 0, .34 - i * .06, .78 - i * .08, 7, cs[i % 3], { k: 1.2 + i * .08 });
    b.pop();
  }
  function conservatory(b) {                                  /* 玻璃花房：石矮墙、黄铜骨架、玻璃坡顶；前头一座玻璃穹顶小圆厅 */
    const G = { mat: "glass" }, gc = mix3(C.glass, C.white, .2), x0 = 1.33, x1 = 1.78, z0 = -1.08, z1 = .3, ye = 2.12, yr = 2.5, xm = (x0 + x1) / 2;
    b.box(xm, P, (z0 + z1) / 2, x1 - x0, .26, z1 - z0, DRESS2, { nb: true });
    b.box(xm, P + .26, (z0 + z1) / 2, x1 - x0 - .06, .01, z1 - z0 - .06, C.soil, { nb: true });
    for (let i = 0; i < 6; i++) b.sphere(xm + (i % 2 - .5) * .18, P + .45 + (i % 3) * .1, z0 + .15 + i * .22, .14 + (i % 3) * .03, 6, i % 3 === 1 ? C.bloom : mix3(C.leaf, C.leaf2, i / 6), { k: 1.2 });
    b.beam([xm, P + .26, -.4], [xm, 1.9, -.4], .05, C.woodD); b.cone(xm, 1.6, -.4, .32, .5, 7, C.leaf2, { k: 1.4 }); b.cone(xm, 1.9, -.4, .2, .4, 7, C.leaf, { k: 1.5 });
    const yb = P + .26;
    b.quad([x1, yb, z1], [x1, yb, z0], [x1, ye, z0], [x1, ye, z1], gc, G);
    b.quad([x0, yb, z0], [x0, yb, z1], [x0, ye, z1], [x0, ye, z0], gc, G);
    b.quad([x0, yb, z1], [x1, yb, z1], [x1, ye, z1], [x0, ye, z1], gc, G);
    b.quad([x1, yb, z0], [x0, yb, z0], [x0, ye, z0], [x1, ye, z0], gc, G);
    b.quad([x1, ye, z1], [x1, ye, z0], [xm, yr, z0], [xm, yr, z1], gc, G);
    b.quad([x0, ye, z0], [x0, ye, z1], [xm, yr, z1], [xm, yr, z0], gc, G);
    b.tri([x0, ye, z1], [x1, ye, z1], [xm, yr, z1], gc, G); b.tri([x1, ye, z0], [x0, ye, z0], [xm, yr, z0], gc, G);
    for (let i = 0; i <= 5; i++) {
      const z = z0 + (z1 - z0) * i / 5;
      for (const x of [x0, x1]) b.beam([x, yb, z], [x, ye, z], .03, BRASS, BG);
      b.beam([x0, ye, z], [xm, yr, z], .026, BRASS, BG); b.beam([x1, ye, z], [xm, yr, z], .026, BRASS, BG);
    }
    for (const x of [x0, x1]) { b.beam([x, ye, z0], [x, ye, z1], .03, BRASS, BG); b.beam([x, 1.3, z0], [x, 1.3, z1], .018, BRASS, BG); }
    b.beam([xm, yr + .02, z0], [xm, yr + .02, z1], .035, BRASS, BG);
    for (let z = z0 + .1; z < z1; z += .2) b.sphere(xm, yr + .07, z, .022, 4, BRASS, BG);
    /* 穹顶小圆厅 */
    const rx = 1.43, rz = .73, rr = .29, yw = 2.12;
    b.cyl(rx, P, rz, rr + .02, .26, 10, DRESS2);
    b.sphere(rx, P + .6, rz, .2, 6, mix3(C.leaf, C.leaf2, .4), { k: 1.2 }); b.beam([rx, P + .26, rz], [rx, 1.6, rz], .045, C.woodD); b.sphere(rx, 1.72, rz, .22, 6, C.bloom, { k: 1.3 });
    b.cyl(rx, P + .26, rz, rr, yw - P - .26, 10, gc, { mat: "glass", nt: true, nb: true });
    for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI; b.beam([rx + Math.cos(a) * rr, P + .26, rz + Math.sin(a) * rr], [rx + Math.cos(a) * rr, yw, rz + Math.sin(a) * rr], .026, BRASS, BG); }
    b.cyl(rx, yw, rz, rr + .03, .05, 10, BRASS, BG);
    b.cyl(rx, 1.3, rz, rr + .012, .025, 10, BRASS, { mat: "gloss", nt: true, nb: true });
    const dn = 4; let pr = rr;
    for (let i = 0; i < dn; i++) { const a1 = (i + 1) / dn * PI / 2, r1 = rr * Math.cos(a1), h0 = rr * Math.sin(i / dn * PI / 2), h1 = rr * Math.sin(a1); b.cyl(rx, yw + .05 + h0, rz, pr, h1 - h0, 10, gc, { r2: Math.max(.001, r1), mat: "glass", nt: true, nb: true }); pr = r1; }
    for (let i = 0; i < 8; i++) { const a = i / 8 * 2 * PI; let prev = null; for (let k = 0; k <= dn; k++) { const t = k / dn * PI / 2, p = [rx + Math.cos(a) * rr * Math.cos(t), yw + .05 + rr * Math.sin(t), rz + Math.sin(a) * rr * Math.cos(t)]; if (prev) b.beam(prev, p, .02, BRASS, BG); prev = p; } }
    b.beam([rx, yw + .3, rz], [rx, yw + .62, rz], .024, BRASS, BG); b.sphere(rx, yw + .44, rz, .04, 5, BRASS, BG);
  }
  function mast(b) {                                          /* 黄铜系泊桅杆：四腿桁架、平台、系泊锥、桅顶小暖灯，系着一艘小飞艇 */
    const MBR = mix3(BRASS, [.3, .24, .17], .42);              /* 风吹日晒的旧黄铜：比尖顶收口暗一档，桁架不抢眼 */
    const mx = -1.44, mz = .22, yt = 5.75, b0 = .19, b1 = .06, lv = 8;
    b.box(mx, P, mz, .5, .14, .5, DRESS2, { nb: true });
    const cor = (y, s) => [[-s, -s], [s, -s], [s, s], [-s, s]].map(([dx, dz]) => [mx + dx, y, mz + dz]);
    const sAt = y => b0 + (b1 - b0) * (y - P - .14) / (yt - P - .14);
    const ys = []; for (let i = 0; i <= lv; i++) ys.push(P + .14 + (yt - P - .14) * i / lv);
    for (let k = 0; k < 4; k++) b.beam(cor(ys[0], b0)[k], cor(yt, b1)[k], .036, MBR, BG);
    for (let i = 1; i <= lv; i++) {
      const A = cor(ys[i], sAt(ys[i])), Bq = cor(ys[i - 1], sAt(ys[i - 1]));
      for (let k = 0; k < 4; k++) { b.beam(A[k], A[(k + 1) % 4], .017, MBR, BG); b.beam(Bq[k], A[(k + 1) % 4], .011, mix3(MBR, C.metal, .4), BG); }
    }
    b.cyl(mx, yt, mz, .22, .04, 10, MBR, BG);
    for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * PI; b.beam([mx + Math.cos(a) * .21, yt + .04, mz + Math.sin(a) * .21], [mx + Math.cos(a) * .21, yt + .17, mz + Math.sin(a) * .21], .012, MBR, BG); }
    b.torus(mx, yt + .17, mz, .21, .01, 10, 3, MBR, BG);
    b.cyl(mx, yt + .04, mz, .05, .2, 8, MBR, { mat: "gloss", r2: .035 });
    b.at(mx, yt + .28, mz + .02, 0, 1, PI / 2); b.cone(0, 0, 0, .08, .12, 8, MBR, BG); b.pop();
    b.beam([mx, yt + .24, mz], [mx, yt + .5, mz], .016, MBR, BG);
    b.box(mx, yt + .5, mz, .05, .07, .05, C.lamp, { e: .6 }); b.pyramid(mx, yt + .57, mz, .07, .07, .05, MBR, BG);   /* 桅顶一盏小暖灯，不闪红光 */
    /* 小飞艇：头系在桅杆上，往正面方向泊 */
    b.bob(mx, yt + .28, mz + .7, .05, .8, sb => {
      const env = mix3(C.cream, C.stone, .15);
      sb.at(0, 0, 0, 0, [1, 1, 2.5]); sb.sphere(0, 0, 0, .24, 10, env, { mat: "gloss" }); sb.pop();
      for (const dz of [-.3, 0, .3]) { const rz = .24 * Math.sqrt(Math.max(0, 1 - Math.pow(dz / .6, 2))); sb.at(0, 0, dz, 0, 1, PI / 2); sb.torus(0, 0, 0, rz + .004, .012, 12, 3, MBR, BG); sb.pop(); }
      sb.box(0, -.34, .02, .12, .1, .32, C.woodD, { top: C.gold });
      sb.panel(0, -.31, .181, .08, .045, WIN, { e: .5 });
      for (const s of [-1, 1]) { sb.beam([s * .05, -.24, -.08], [s * .05, -.17, -.08], .012, MBR, BG); sb.beam([s * .05, -.24, .14], [s * .05, -.17, .14], .012, MBR, BG); }
      for (let k = 0; k < 4; k++) { sb.at(0, 0, .5, k * PI / 2 + PI / 4, 1, 0, 0); sb.box(0, .1, 0, .015, .14, .16, C.banner, {}); sb.pop(); }
      sb.spin(0, 0, .64, "z", 3, pb => { pb.box(-.13, -.015, 0, .26, .03, .01, C.woodD); pb.box(-.015, -.13, 0, .03, .26, .01, C.woodD); });
      sb.sphere(0, 0, .62, .03, 4, MBR, BG);
    });
  }

  function build(b, o) {
    seed = 92821;
    const cy = !!o.cyber, rnd = o.rnd || Math.random;
    const HOUSE = [C.banner, C.banner2, mix3(C.ivy, [.1, .42, .3], .5), mix3(C.gold, C.hay, .4)];
    const f0 = Math.floor(rnd() * 4) % 4, F = k => HOUSE[(f0 + k) % 4];
    podium(b);
    steps(b, cy);
    /* 围墙 */
    b.at(0, 0, 1.38); curtain(b, -1.5, -.56, { slits: [-1.05] }); curtain(b, .56, 1.5, { slits: [1.05] }); b.pop();
    b.at(-1.95, 0, -.05, -PI / 2); curtain(b, -1.1, 1.05, { slits: [-.5, .55], butt: [0] }); b.pop();
    b.at(1.95, 0, -.08, PI / 2); curtain(b, -1.08, 1.12, { slits: [-.55, .5], butt: [0] }); b.pop();
    b.at(.15, 0, -2.0, PI); curtain(b, -1.17, 1.2, { slits: [0] }); b.pop();
    b.at(0, 0, 1.38); ivy(b, -1.05, P, .14, .6, 1.0, 55); b.pop();
    b.at(1.95, 0, -.08, PI / 2); ivy(b, .55, P, .14, .7, 1.0, 55); b.pop();
    gatehouse(b, { cy, c1: F(0), c2: F(1) });
    hall(b, { cy });
    keep(b, { cy });
    /* 圆塔：前两座、右后一座高的 */
    roundTower(b, -1.82, 1.38, .44, 2.95, 1.75, { cy, flag: F(2), bands: [1.75], wins: [[0, 2.05, .16, .3], [-PI / 2, 2.25, .16, .3]], slits: [[.35, .95], [-PI / 2, 1.15]], luc: [-PI * .3], ivy: [-.4, 1.2, 1.3, 80] });
    roundTower(b, 1.82, 1.38, .44, 2.95, 1.75, { cy, flag: F(3), bands: [1.75], wins: [[0, 2.05, .16, .3], [PI / 2, 2.25, .16, .3]], slits: [[-.35, .95], [PI / 2, 1.15]], luc: [PI * .3], ivy: [.75, 1.0, 1.1, 60] });
    roundTower(b, 1.72, -1.68, .52, 4.25, 2.15, { cy, seg: 16, flag: F(0), bands: [2.2, 3.35], wins: [[0, 2.55, .2, .42, 1], [PI / 2, 1.7, .18, .34], [PI / 2, 3.55, .18, .34], [PI * .25, 3.6, .17, .3], [PI, 2.6, .18, .34]], slits: [[PI * .25, 1.2]], luc: [PI * .25, PI * 1.25], ivy: [PI * .4, 1.3, 1.5, 80] });
    if (!cy) { tree(b, -1.42, -.42, 1.0); tree(b, 1.45, -.4, 1.1); tree(b, 1.42, .8, .8); }
    else {
      conservatory(b);
      mast(b);
      b.emit(-.82, 1.35, 2.12, "cat", 1, 1); b.emit(.82, 1.35, 2.12, "cat", 1, 1);   /* 只门前两盏，院里不再飘一片 */
    }
  }
  build.h = o => 7.65;
  Isle3D.PROP.home = build;
})();
