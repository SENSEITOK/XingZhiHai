/* 港桥：霍格沃茨式的石砌港务码头（岸上这一截；长栈桥由引擎另用内建码头从岛沿伸出去）。
   1994：一片错缝石板铺的码头场院，后沿一道压顶石路缘和几根系缆石桩（缠着麻绳）；
         港务楼是两层风化灰石楼——石台基、转角隅石、腰线、托石挑檐，尖拱铁钉木门、门前两级石阶、两盏铁提灯，
         上下两排尖拱烛光窗（带滴水线），陡峭的深蓝灰石板瓦顶，两头石砌山墙压顶、山墙尖小石尖，前坡两扇老虎窗，后坡一根石烟囱冒烟；
         墙角挑出一块木招牌（金色船锚），左端连一座方形钟楼：四面钟、开敞的钟室挂铜钟、托石城堞、四角小尖塔、八角石板瓦尖顶和小旗，楼身挂旗；
         右后一座圆石小灯塔：托石挑出的铁栏观景台、玻璃灯室里一盏暖灯、尖顶；
         楼后晾着渔网（木架、浮子），场院角上堆着木箱、木桶，两角铁灯柱，墙根爬常春藤。
         Lv2 右边加一座船棚：石墙、尖拱大门洞（料石券、拱心挂提灯）、石板瓦人字顶，里头木架上搁着一条带桅的小飞舟。
         Lv3 灯塔更高更粗（两层窗、两道腰线），楼前加一道候船长廊：三开间尖拱石廊、石板瓦单坡顶，廊下长椅、行李箱、吊灯、告示板。
   2077：同一套石头底子：灯塔换成黄铜飞艇系泊塔（石砌塔座、四腿黄铜桁架、系泊锥、桅顶小暖灯），系着一艘酒红色小飞艇（铜箍、尾翼、吊舱、慢转的螺旋桨）；
         候船长廊换成黄铜框玻璃顶；船棚里的小飞舟镶黄铜、尾上一副螺旋桨；灯柱、尖顶收口换黄铜，门前和船棚口浮着一两盏猫球灯。
         不加霓虹、不加全息、不加护罩。 */
(function () {
  const { C, mix3, dim3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, G = .06;                  /* G：码头石板地面高 */
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.12, .11, .13], .5);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.1, .1, .12], .35);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .32), BG = { mat: "gloss" }, M = { mat: "metal" }, GLS = { mat: "glass" };
  const BRONZE = mix3(C.gold, C.wood, .38), IRON = C.iron;
  const OAK = mix3(C.woodD, [.13, .1, .08], .3), WOOD = mix3(C.wood, C.woodD, .35), PLANK = mix3(C.plank, C.woodD, .25);
  const ROPE = mix3(C.hay, C.woodL, .5), NET = mix3(C.woodD, [.25, .3, .26], .55), FACE = mix3(C.cream, C.stone, .2);
  const PAVE = mix3(C.stone, ST2, .35), JOINT = mix3(ST2, STD, .55);
  let R = Math.random;
  const lerp = (a, b, t) => a + (b - a) * t;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const pt = (cx, cz, a, r, y) => [cx + Math.sin(a) * r, y, cz + Math.cos(a) * r];

  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .42 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .94) c = mix3(c, STD, .35);
    const g = Math.max(0, Math.min(.3, (.8 - y) * .3));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
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
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff, n) {   /* 尖拱洞上方的拱肩（前后两面＋拱腹），x 以拱心为 0 */
    const pts = archPts(w, p, n || 4);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }
  function archRing(b, w, p, ys, z, t, n) {                 /* 拱洞外一圈料石券（深浅相间） */
    const inn = archPts(w, p, n || 4), out = archPts(w + t * 2, p, n || 4);
    for (let i = 0; i < inn.length - 1; i++) b.quad([out[i][0], ys + out[i][1], z], [inn[i][0], ys + inn[i][1], z], [inn[i + 1][0], ys + inn[i + 1][1], z], [out[i + 1][0], ys + out[i + 1][1], z], i % 2 ? DRESS : DRESS2);
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z，o.back 朝 -z）一层层错缝砌；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .2, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? ((j + ph) % 2 ? .12 : .22) : 0, q1 = o.qr ? ((j + ph) % 2 ? .12 : .22) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .24));
      while (x < Rr - (q1 ? q1 + .08 : .08)) { cuts.push(x); x += .2 + R() * .22; }
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
  function boxWalls(b, cx, cz, w, d, y0, y1, o) {           /* 方楼四面墙（转角隅石咬合）；o.skip 跳过 f/r/b/l 面 */
    o = o || {};
    const sk = o.skip || {};
    if (!sk.f) mason(b, () => [cx - w / 2, cx + w / 2], y0, y1, cz + d / 2, { ql: 1, qr: 1, rh: o.rh });
    if (!sk.b) mason(b, () => [cx - w / 2, cx + w / 2], y0, y1, cz - d / 2, { ql: 1, qr: 1, back: true, rh: o.rh });
    if (!sk.r) { b.at(cx + w / 2, 0, cz, PI / 2); mason(b, () => [-d / 2, d / 2], y0, y1, 0, { ql: 1, qr: 1, qph: 1, rh: o.rh }); b.pop(); }
    if (!sk.l) { b.at(cx - w / 2, 0, cz, -PI / 2); mason(b, () => [-d / 2, d / 2], y0, y1, 0, { ql: 1, qr: 1, qph: 1, rh: o.rh }); b.pop(); }
  }
  function rshaft(b, cx, cz, r0, r1, y0, y1, seg, rh) {     /* 圆塔身：一圈圈石砌、层层错半块，往上收分 */
    const n = Math.max(1, Math.round((y1 - y0) / (rh || .18))), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, ra = lerp(r0, r1, j / n), rb = lerp(r0, r1, (j + 1) / n), off = (j % 2) * .5;
      for (let i = 0; i < seg; i++) {
        const a = (i + off) / seg * TAU, a2 = (i + 1 + off) / seg * TAU;
        b.quad(pt(cx, cz, a, ra, ya), pt(cx, cz, a2, ra, ya), pt(cx, cz, a2, rb, yb), pt(cx, cz, a, rb, yb), sc(ya));
      }
    }
  }
  function cbox(b, x, y, z0, w, h, z1, col) {               /* 贴墙的小块（不画背面和顶面） */
    const x0 = x - w / 2, x1 = x + w / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z1], [x0, y1, z1], col);
    b.quad([x1, y, z1], [x1, y, z0], [x1, y1, z0], [x1, y1, z1], col);
    b.quad([x0, y, z0], [x0, y, z1], [x0, y1, z1], [x0, y1, z0], col);
    b.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], col);
  }
  function corbel(b, x, y, z) { cbox(b, x, y - .11, z - .02, .065, .11, z + .06, DRESS2); }
  function corbels(b, x0, x1, y, z, step) { for (let x = x0; x <= x1 + 1e-6; x += step) corbel(b, x, y, z); }
  function merlons(b, x0, x1, y, z, d, o) {                 /* 墙头一排垛口 */
    o = o || {};
    const mw = o.mw || .12, gap = o.gap || .09, mh = o.mh || .14, n = Math.max(1, Math.floor((x1 - x0 + gap) / (mw + gap))), tot = n * mw + (n - 1) * gap, s = (x0 + x1) / 2 - tot / 2;
    for (let i = 0; i < n; i++) b.box(s + mw / 2 + i * (mw + gap), y, z, mw, mh, d, mix3(DRESS2, ST2, R() * .6), { nb: true, top: DRESS });
  }

  /* ---------- 窗、门、钟、旗、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .55, fc = o.frame || DRESS, n = w > .17 ? 3 : 2;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p, n), -.03, .02, fc);
    if (o.dark) fan(b, outline(w, h, 0, p, n), .024, INNER);
    else fan(b, outline(w, h, 0, p, n), .024, o.glass || WIN, { e });
    if (o.two) b.panel(0, 0, .027, .02, h + archY(w, p, 0) * .72, fc);
    if (!o.dark) b.panel(0, h * .55, .027, w, .016, mix3(IRON, OAK, .4));
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
    b.panel(x, y - .03, z + .002, .07, .28, DRESS2);
    b.panel(x, y, z + .004, .026, .22, INNER);
    b.panel(x, y + .1, z + .005, .09, .024, INNER);
  }
  function door(b, w, h, p, o) {                            /* 尖拱木门（面朝 +z，原点在门底中点）：竖板、铁箍、铁钉、门环 */
    o = o || {};
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .25);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    const n = o.planks || 5;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, .01, h + archY(w, p, x) - .02, dark); }
    for (const y of o.straps || [h * .2, h * .62]) {
      b.box(0, y, .006, w - .03, .028, .012, IRON, M);
      for (let i = 0; i < 3; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 2, y + .006, .0125, .015, .015, C.metal, M);
    }
    b.box(w * .22, h * .46, .008, .035, .035, .012, IRON, M);
  }
  function doorway(b, x, y, z, w, h, o) {                   /* 门洞：料石门框＋券、木门、门前石阶 */
    o = o || {};
    const p = .68;
    b.at(x, y, z);
    prism(b, outline(w + .12, h, 0, p, 4), -.03, .03, DRESS2);
    archRing(b, w + .12, p, h, .032, .045, 4);
    b.box(0, h + archY(w + .12, p, 0) + .01, .02, .06, .09, .04, DRESS, { nb: true });   /* 拱心石 */
    b.at(0, 0, .034); door(b, w, h, p, o); b.pop();
    b.pop();
    if (o.steps) {
      const d0 = o.steps;
      b.box(x, G, z + d0 * .5 + .02, w + .3, (y - G) * .5, d0, mix3(ST2, STD, .25), { top: DRESS2, nb: true });
      b.box(x, G + (y - G) * .5, z + d0 * .25 + .02, w + .24, (y - G) * .5, d0 * .5, mix3(ST2, STD, .2), { top: DRESS, nb: true });
    }
  }
  function lantern(b, x, y, z, cy) {                        /* 铁提灯（六角，暖光）；2077 黄铜 */
    const fr = cy ? BRASS : IRON, fm = cy ? BG : M;
    b.box(x, y, z, .1, .025, .1, fr, fm);
    b.cyl(x, y + .025, z, .045, .13, 6, C.lamp, { r2: .055, e: .68, nt: true, nb: true });
    b.cyl(x, y + .155, z, .075, .1, 6, fr, { r2: 0, mat: fm.mat });
    b.box(x, y + .25, z, .018, .05, .018, fr, fm);
  }
  function wallLantern(b, x, y, z, cy) {                    /* 墙上铁臂挑出一盏提灯（面朝 +z 的墙，z 是墙面） */
    b.beam([x, y + .36, z], [x, y + .36, z + .16], .02, cy ? BRASS : IRON, cy ? BG : M);
    b.beam([x, y + .36, z + .15], [x, y + .3, z + .15], .01, IRON, M);
    b.beam([x, y + .22, z], [x, y + .35, z + .12], .014, cy ? BRASS : IRON, cy ? BG : M);
    lantern(b, x, y, z + .15, cy);
  }
  function banner(b, x, yt, z, w, h, col) {                 /* 墙上挂旗：铁杆、燕尾布条、金边、菱形徽 */
    b.beam([x - w / 2 - .03, yt + .01, z + .03], [x + w / 2 + .03, yt + .01, z + .03], .018, IRON, M);
    b.at(x, yt, z + .012);
    fan(b, [[-w / 2, -h], [0, -h + .08], [w / 2, -h], [w / 2, 0], [-w / 2, 0]], 0, col);
    b.panel(-w / 2 + .018, -h + .05, .003, .012, h - .09, C.gold, M);
    b.panel(w / 2 - .018, -h + .05, .003, .012, h - .09, C.gold, M);
    b.panel(0, -.06, .003, w - .02, .012, C.gold, M);
    const yc = -h * .45;                                    /* 徽：一只小金锚 */
    b.panel(0, yc - .06, .004, .014, .12, C.gold, M);
    b.panel(0, yc + .03, .004, .07, .013, C.gold, M);
    b.beam([0, yc - .06, .005], [-.035, yc - .025, .005], .012, C.gold, { mat: "metal", tz: .003 });
    b.beam([0, yc - .06, .005], [.035, yc - .025, .005], .012, C.gold, { mat: "metal", tz: .003 });
    b.pop();
  }
  function flag(b, x, y, z, col, cy) {                      /* 尖顶小旗：铁杆、金球、随风摆的尖角旗 */
    b.beam([x, y - .1, z], [x, y + .55, z], .02, cy ? BRASS : IRON, cy ? BG : M);
    b.sphere(x, y + .57, z, .028, 4, C.gold, M);
    const L = .38, Hh = .17, top = y + .51, segs = 4;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .01 + L * t0, x1 = x + .01 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .55) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
  }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .026 + R() * .028, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function rivy(b, cx, cz, r, a0, da, y0, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), a = a0 + (R() - .5) * da * (1 - v * .6), py = y0 + v * h, s = .026 + R() * .028;
      b.at(cx, 0, cz, a); fan(b, [[-s, py], [0, py - s], [s, py], [0, py + s]], r + .012 + R() * .014, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4)); b.pop();
    }
  }
  function spire(b, cx, y, cz, r, h, seg, cy) {             /* 石板瓦尖顶：翘一点的檐口、一圈圈深浅瓦带 */
    b.cyl(cx, y, cz, r * 1.12, h * .05, seg, SL2, { r2: r * .96, nt: true, bot: STD });
    if (cy) b.cyl(cx, y + h * .05, cz, r * .975, .03, seg, BRASS, { mat: "gloss", nt: true, nb: true });
    const y0 = y + h * .05, H = h * .95, nb = 6;
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb, ra = r * .96 * Math.pow(1 - t0, 1.1), rb = r * .96 * Math.pow(1 - t1, 1.1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === nb - 1) b.cone(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { nb: true });
      else b.cyl(cx, y0 + H * t0, cz, ra, H * (t1 - t0), seg, col, { r2: rb, nt: true, nb: true });
    }
    return y + h;
  }
  const spireR = (r, t) => r * .96 * Math.pow(1 - t, 1.1);
  function lucarne(b, cx, cz, a, y, rr, cy) {               /* 尖顶上的小老虎窗 */
    b.at(cx, 0, cz, a);
    b.box(0, y, rr - .06, .13, .15, .2, mix3(SL, STD, .4));
    b.panel(0, y + .025, rr + .041, .07, .09, WIN, { e: .55 });
    b.at(0, y + .15, rr - .06, PI / 2); b.gable(0, 0, 0, .23, .19, .11, SL2, { end: mix3(SL, STD, .4) }); b.pop();
    if (cy) b.sphere(0, y + .27, rr + .04, .016, 4, BRASS, BG);
    b.pop();
  }
  function finial(b, x, y, z, cy) { b.beam([x, y - .06, z], [x, y + .24, z], .022, cy ? BRASS : IRON, cy ? BG : M); b.sphere(x, y + .06, z, .035, 4, cy ? BRASS : BRONZE, cy ? BG : M); }
  function clock(b, y, z, r, cy) {                          /* 钟面（面朝 +z，z 是墙面）：料石圈、铜边、象牙白表盘、刻度、铁指针 */
    const N = 10, ring = k => Array.from({ length: N }, (_, i) => [Math.cos(i / N * TAU) * k, Math.sin(i / N * TAU) * k]);
    b.at(0, y, z);
    prism(b, ring(r + .05), -.02, .035, DRESS);
    fan(b, ring(r + .012), .037, cy ? BRASS : BRONZE, M);
    fan(b, ring(r), .04, FACE, { e: .18 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU, s = k % 3 ? .012 : .024; b.panel(Math.sin(a) * (r - .035), Math.cos(a) * (r - .035) - s / 2, .042, s, s, IRON); }
    const ha = R() * TAU, ma = R() * TAU;
    const hand = (a, L, w, z) => { const ux = Math.sin(a), uy = Math.cos(a), nx = -uy * w, ny = ux * w; b.quad([-ux * .02 - nx, -uy * .02 - ny, z], [ux * L - nx, uy * L - ny, z], [ux * L + nx, uy * L + ny, z], [-ux * .02 + nx, -uy * .02 + ny, z], IRON); };
    hand(ha, r * .52, .009, .046); hand(ma, r * .8, .006, .048);
    b.panel(0, -.012, .05, .024, .024, cy ? BRASS : BRONZE, M);
    b.pop();
  }

  /* ---------- 屋顶：石板瓦人字顶（当前坐标系里屋脊沿 x，墙线在 z=±d/2、y 处）；o.gl/o.gr 两头砌石山墙＋压顶 ---------- */
  function roof(b, x0, x1, d, y, h, ov, o) {
    o = o || {};
    const s = h / (d / 2), nb = 5, yt = y + h;
    for (const sz of [-1, 1]) {
      const ze = sz * (d / 2 + ov), ye = y - ov * s;
      if (o.glass) {                                         /* 2077：黄铜框玻璃坡 */
        qf(b, [x0, ye, ze], [x1, ye, ze], [x1, yt, 0], [x0, yt, 0], mix3(C.glass, C.white, .25), [0, 1, sz], GLS);
        const n = Math.max(2, Math.round((x1 - x0) / .25));
        for (let i = 0; i <= n; i++) { const x = lerp(x0 + .015, x1 - .015, i / n); b.beam([x, ye + .01, ze], [x, yt + .01, 0], .022, BRASS, BG); }
        b.beam([x0, ye, ze], [x1, ye, ze], .03, BRASS, BG);
        continue;
      }
      for (let i = 0; i < nb; i++) {
        const t0 = i / nb, t1 = (i + 1) / nb;
        qf(b, [x0, lerp(ye, yt, t0), ze * (1 - t0)], [x1, lerp(ye, yt, t0), ze * (1 - t0)], [x1, lerp(ye, yt, t1), ze * (1 - t1)], [x0, lerp(ye, yt, t1), ze * (1 - t1)], i % 2 ? SL : mix3(SL, SL2, .55), [0, 1, sz]);
      }
      b.box((x0 + x1) / 2, ye - .035, ze - sz * .015, x1 - x0, .035, .03, SLD, { nb: true });   /* 封檐 */
    }
    if (o.glass) b.beam([x0, yt + .01, 0], [x1, yt + .01, 0], .035, BRASS, BG);
    else b.box((x0 + x1) / 2, yt - .03, 0, x1 - x0 + .02, .05, .07, SLD, { nb: true });   /* 屋脊 */
    if (o.crest) {                                           /* 屋脊铁花：一排小尖刺、一道细铁条 */
      const n = Math.round((x1 - x0 - .3) / .13);
      for (let i = 0; i <= n; i++) b.pyramid(lerp(x0 + .15, x1 - .15, i / n), yt + .01, 0, .028, .028, i % 2 ? .07 : .11, o.cy ? BRASS : IRON, o.cy ? BG : M);
      b.beam([x0 + .15, yt + .05, 0], [x1 - .15, yt + .05, 0], .01, o.cy ? BRASS : IRON, o.cy ? BG : M);
    }
    for (const [on, x, sx] of [[o.gl, x0, -1], [o.gr, x1, 1]]) {
      if (!on) continue;
      const lv = [0, .33, .66, 1], hint = [sx, 0, 0];
      for (let i = 0; i < 3; i++) {
        const ya = y + h * lv[i], yb = y + h * lv[i + 1], wa = d / 2 * (1 - lv[i]), wb2 = d / 2 * (1 - lv[i + 1]), cc = sc(ya);
        if (i < 2) qf(b, [x, ya, -wa], [x, ya, wa], [x, yb, wb2], [x, yb, -wb2], cc, hint);
        else tf(b, [x, ya, -wa], [x, ya, wa], [x, yt, 0], cc, hint);
      }
      for (const sz of [-1, 1]) {                            /* 山墙压顶、墙脚托石 */
        b.beam([x - sx * .01, y + .02, sz * (d / 2 + .05)], [x - sx * .01, yt + .05, 0], .085, DRESS2, { tz: .1 });
        b.box(x - sx * .01, y - .04, sz * (d / 2 + .02), .12, .1, .14, DRESS, { nb: true });
      }
      b.box(x - sx * .01, yt + .02, 0, .1, .1, .1, DRESS2, { nb: true });
      b.pyramid(x - sx * .01, yt + .12, 0, .11, .11, .16, DRESS);
      if (o.finial) finial(b, x - sx * .01, yt + .3, 0, o.cy);
    }
  }
  function dormer(b, x, zf, yb, w, hb, cy) {                 /* 前坡上的老虎窗：石砌窗台墙、尖拱小窗、小人字顶 */
    const dd = .5, zc = zf - dd / 2;
    b.box(x, yb, zc, w, hb, dd, mix3(ST, ST2, .5), { nb: true });
    lancet(b, x, yb + .055, zf, w * .42, hb * .38, { fr: .028, nosill: true });
    b.at(x, yb + hb, zc + .03, PI / 2); b.gable(0, 0, 0, dd + .1, w + .08, w * .6, SL2, { end: DRESS2 }); b.pop();
    finial(b, x, yb + hb + w * .6 + .02, zf + .08, cy);
  }

  /* ---------- 码头场院 ---------- */
  const QX0 = -1.62, QX1 = 1.62, QZ0 = -1.24, QZ1 = 1.0;
  const inside = (x, z) => (Math.abs(x - HX) < HW / 2 - .1 && Math.abs(z - HZ) < HD / 2 - .1) || (Math.abs(x - TX) < TS / 2 - .1 && Math.abs(z - TZ) < TS / 2 - .1);
  function quay(b) {
    const pc = () => mix3(mix3(ST2, STD, .3 + R() * .45), C.ivy, R() < .2 ? .1 : 0);
    b.box((QX0 + QX1) / 2, -.26, (QZ0 + QZ1) / 2, QX1 - QX0, .32, QZ1 - QZ0, pc(), { top: JOINT, nb: true });
    mason(b, () => [QX0, QX1], -.26, G - .005, QZ1, { rh: .16, col: pc });
    mason(b, () => [QX0, QX1], -.26, G - .005, QZ0, { rh: .16, col: pc, back: true });
    const nx = 9, nz = 6, dz = (QZ1 - QZ0) / nz;
    for (let j = 0; j < nz; j++) {                          /* 错缝石板 */
      const za = QZ0 + j * dz + .012, zb = za + dz - .024, off = (j % 2) * .5, dx = (QX1 - QX0) / nx;
      for (let i = -1; i < nx; i++) {
        const xa = Math.max(QX0 + .01, QX0 + (i + off) * dx + .012), xb = Math.min(QX1 - .01, QX0 + (i + 1 + off) * dx - .012);
        if (xb - xa < .05 || inside((xa + xb) / 2, (za + zb) / 2)) continue;
        b.quad([xa, G + .003, zb], [xb, G + .003, zb], [xb, G + .003, za], [xa, G + .003, za], mix3(PAVE, R() < .5 ? [.55, .52, .47] : [.5, .52, .55], R() * .5));
      }
    }
    b.box(0, G, QZ0 + .07, QX1 - QX0, .06, .14, DRESS2, { top: DRESS, nb: true });   /* 后沿压顶路缘 */
    b.box(0, G, QZ1 - .04, QX1 - QX0, .025, .08, DRESS2, { top: DRESS2, nb: true });
  }
  function bollard(b, x, z, rope) {                          /* 系缆石桩：粗短石柱、铁箍、缠一圈麻绳，绳头垂下 */
    b.cyl(x, G + .06, z, .07, .25, 8, mix3(ST2, STD, R() * .4), { r2: .062, nt: true, nb: true });
    b.cyl(x, G + .31, z, .088, .05, 8, DRESS, { r2: .076, nb: true });
    if (rope) {
      b.torus(x, G + .15, z, .076, .016, 6, 3, ROPE);
      b.beam([x + .02, G + .14, z - .07], [x + .05, G + .07, z - .2], .022, ROPE);
      b.beam([x + .05, G + .07, z - .2], [x + .03, G - .2, z - .2], .022, ROPE, { k: 1.15 });
    }
  }
  function lampPost(b, x, z, cy) {                           /* 铁灯柱：石座、铁杆、提灯 */
    b.box(x, G, z, .16, .12, .16, mix3(ST2, STD, .3), { top: DRESS, nb: true });
    b.box(x, G + .12, z, .11, .05, .11, DRESS2, { nb: true });
    b.cyl(x, G + .17, z, .028, .82, 6, cy ? BRASS : IRON, { r2: .02, mat: cy ? "gloss" : "metal" });
    b.cyl(x, G + .3, z, .036, .05, 6, cy ? BRASS : IRON, cy ? BG : M);
    lantern(b, x, G + .99, z, cy);
  }
  function crate(b, x, y, z, s, ry) {                        /* 木箱：木板、深色包边、斜撑 */
    const c = mix3(C.wood, C.woodL, R() * .55), d = dim3(c, .68);
    b.at(x, y, z, ry);
    b.box(0, 0, 0, s, s, s, c, { nb: true });
    for (const a of [0, PI]) {
      b.at(0, 0, 0, a);
      b.panel(0, 0, s / 2 + .003, s, .03, d); b.panel(0, s - .03, s / 2 + .003, s, .03, d);
      b.beam([-s / 2 + .02, .03, s / 2 + .004], [s / 2 - .02, s - .03, s / 2 + .004], .022, d, { tz: .004 });
      b.pop();
    }
    for (const sx of [-1, 1]) { b.at(sx * (s / 2 + .003), 0, 0, sx * PI / 2); b.panel(0, 0, 0, .03, s, d); b.pop(); }
    b.pop();
  }
  function barrel(b, x, y, z, r, h) {                        /* 木桶：鼓腹、两道铁箍 */
    const c = mix3(C.wood, C.woodD, R() * .5);
    b.cyl(x, y, z, r * .9, h / 2, 8, c, { r2: r, nb: true, nt: true });
    b.cyl(x, y + h / 2, z, r, h / 2, 8, c, { r2: r * .9, top: mix3(c, C.woodL, .3) });
    for (const t of [.16, .84]) b.cyl(x, y + h * t - .012, z, lerp(r * .9, r, 1 - Math.abs(t - .5) * 2) + .006, .024, 8, IRON, { nt: true, nb: true, mat: "metal" });
  }
  function netRack(b, x, z, ry, w) {                         /* 晾网架：两根木柱一根横杆，网垂下来、底边一串浮子 */
    b.at(x, G, z, ry);
    for (const s of [-1, 1]) { b.beam([s * w / 2, 0, 0], [s * w / 2, .82, 0], .045, OAK); b.beam([s * w / 2, 0, -.12], [s * w / 2, .5, 0], .03, OAK); }
    b.beam([-w / 2 - .06, .78, 0], [w / 2 + .06, .78, 0], .035, WOOD);
    const ni = 5, nj = 4, P = [];
    for (let i = 0; i <= ni; i++) {
      P.push([]);
      for (let j = 0; j <= nj; j++) {
        const u = i / ni, v = j / nj, x2 = (-w / 2 + .06) + u * (w - .12), sag = Math.sin(u * PI);
        P[i].push([x2 + Math.sin(v * 3 + u * 5) * .01, .76 - v * (.42 + .14 * sag), .02 + v * .03 * sag]);
      }
    }
    const ln = (A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * .006, ny = dx / l * .006; b.quad([A[0] - nx, A[1] - ny, A[2]], [B[0] - nx, B[1] - ny, B[2]], [B[0] + nx, B[1] + ny, B[2]], [A[0] + nx, A[1] + ny, A[2]], NET); b.quad([A[0] + nx, A[1] + ny, A[2]], [B[0] + nx, B[1] + ny, B[2]], [B[0] - nx, B[1] - ny, B[2]], [A[0] - nx, A[1] - ny, A[2]], NET); };
    for (let i = 0; i <= ni; i++) for (let j = 0; j < nj; j++) ln(P[i][j], P[i][j + 1]);
    for (let j = 1; j <= nj; j++) for (let i = 0; i < ni; i++) ln(P[i][j], P[i + 1][j]);
    for (let i = 0; i <= ni; i += 2) { const q = P[i][nj]; b.box(q[0], q[1] - .03, q[2], .035, .035, .035, i % 4 ? C.cloth : mix3(C.cream, C.hay, .4)); }
    b.pop();
  }
  function netPile(b, x, z) {                                /* 地上一堆渔网、几个浮子 */
    b.sphere(x, G + .02, z, .2, 6, NET, { sy: .3 });
    b.sphere(x + .08, G + .06, z - .04, .11, 5, mix3(NET, C.woodD, .3), { sy: .5 });
    for (let i = 0; i < 4; i++) { const a = i * 1.7 + .3; b.sphere(x + Math.cos(a) * .16, G + .05, z + Math.sin(a) * .12, .03, 4, i % 2 ? C.cloth : mix3(C.cream, C.hay, .4)); }
  }
  function sign(b, x, y, z, cy) {                            /* 墙角挑出的木招牌（招牌面朝 ±x）：金色船锚 */
    b.beam([x, y + .3, z], [x, y + .3, z + .44], .026, cy ? BRASS : IRON, cy ? BG : M);
    b.beam([x, y + .12, z], [x, y + .29, z + .2], .016, cy ? BRASS : IRON, cy ? BG : M);
    for (const dz of [.12, .38]) b.beam([x, y + .3, z + dz], [x, y + .22, z + dz], .01, IRON, M);
    b.box(x, y - .02, z + .25, .028, .24, .32, OAK, { top: OAK });
    for (const s of [-1, 1]) {
      b.at(x + s * .016, y - .02, z + .25, s * PI / 2);
      b.panel(0, .02, .001, .27, .2, mix3(C.banner2, OAK, .25));
      b.panel(0, .15, .003, .014, .055, C.gold, M);   /* 锚：环、杆、横档、两只锚爪 */
      b.panel(0, .045, .003, .014, .11, C.gold, M);
      b.panel(0, .125, .003, .07, .012, C.gold, M);
      b.tri([-.055, .09, .004], [-.01, .04, .004], [.01, .04, .004], C.gold, M); b.tri([.01, .04, .004], [.055, .09, .004], [-.01, .04, .004], C.gold, M);
      b.pop();
    }
  }

  /* ---------- 港务楼 ---------- */
  const HX = -.15, HZ = -.12, HW = 1.5, HD = 1.0, HY0 = .16, HY1 = 1.6, HF = HZ + HD / 2, HB = HZ - HD / 2, HXL = HX - HW / 2, HXR = HX + HW / 2;
  const WX = [HX - .5, HX, HX + .5];                          /* 正面三开间 */
  function house(b, cy, lv) {
    b.box(HX, G, HZ, HW + .08, HY0 - G, HD + .08, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    boxWalls(b, HX, HZ, HW, HD, HY0, HY1, { skip: { l: 1 } });
    b.at(HXL, 0, HZ, -PI / 2); mason(b, () => [-HD / 2, TZ - TS / 2 - HZ + .02], HY0, HY1, 0, { ql: 1, qph: 1 }); b.pop();   /* 左墙只露钟楼后面一截 */
    b.box(HX, .9, HZ, HW + .04, .05, HD + .04, DRESS2, { nb: true });   /* 腰线 */
    corbels(b, HXL + .1, HXR - .1, HY1, HF, .1625);
    b.at(0, 0, HZ, PI); corbels(b, -HXR + .1, -HXL - .1, HY1, HD / 2, .26); b.pop();
    b.box(HX, HY1, HZ, HW + .08, .08, HD + .12, DRESS2, { top: DRESS, nb: true });   /* 挑檐 */
    b.at(HX, 0, HZ); roof(b, -HW / 2 - .02, HW / 2 + .02, HD + .1, HY1 + .08, .98, .14, { gl: 1, gr: 1, finial: 1, crest: 1, cy }); b.pop();
    /* 正面：门、窗、灯、招牌 */
    doorway(b, WX[1], HY0, HF, .32, .42, { steps: .26 });
    for (const x of [WX[0], WX[2]]) lancet(b, x, .36, HF, .16, .24, { hood: 1 });
    lancet(b, WX[0], 1.05, HF, .15, .2, { hood: 1 });
    lancet(b, WX[2], 1.05, HF, .15, .2, { hood: 1 });
    lancet(b, WX[1], 1.05, HF, .22, .2, { hood: 1, two: 1 });
    wallLantern(b, WX[1] - .29, .5, HF, cy); wallLantern(b, WX[1] + .29, .5, HF, cy);
    sign(b, HXR - .1, 1.12, HF, cy);
    /* 右山墙：上下各一扇窗、山尖一个小箭孔 */
    b.at(HXR, 0, HZ, PI / 2);
    lancet(b, .02, .38, 0, .15, .24, { hood: 1 }); lancet(b, .02, 1.05, 0, .15, .2, {});
    slit(b, 0, 1.95, .02);
    b.pop();
    /* 背面（朝码头）：小后门、窗 */
    b.at(HX, 0, HZ, PI);
    doorway(b, -.35, HY0, HD / 2, .22, .32, { planks: 4 });
    lancet(b, .3, .38, HD / 2, .15, .24, {});
    for (const x of [-.45, .1, .5]) lancet(b, x, 1.05, HD / 2, .14, .2, {});
    b.pop();
    /* 老虎窗、烟囱 */
    const s = .98 / ((HD + .1) / 2), roofY = z => HY1 + .08 + (HD / 2 + .05 - (z - HZ)) * s;
    for (const x of [WX[0], WX[2]]) dormer(b, x, HF - .1, roofY(HF - .1) - .05, .26, .3, cy);
    const chx = HXR - .28, chz = HZ - .3;
    b.box(chx, roofY(HZ + .3) - .3, chz, .22, 3.0 - roofY(HZ + .3) + .3, .2, sc(2.2), { nb: true });
    b.box(chx, 3.0, chz, .27, .05, .25, DRESS2);
    for (const dx of [-.05, .05]) b.cyl(chx + dx, 3.05, chz, .035, .1, 6, mix3(C.roofR, STD, .5), { r2: .03 });
    b.emit(chx, 3.25, chz, "smoke", 8, 1);
    /* 常春藤 */
    ivy(b, HXL + .2, HY0, HF, .35, 1.15, 26);
    b.at(HXR, 0, HZ, PI / 2); ivy(b, .38, HY0, 0, .3, 1.0, 16); b.pop();
  }

  /* ---------- 钟楼 ---------- */
  const TX = -1.19, TZ = .1, TS = .62, TB0 = 3.1;
  function clockTower(b, cy) {
    const hs = TS / 2;
    b.box(TX, G, TZ, TS + .1, HY0 - G, TS + .1, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    boxWalls(b, TX, TZ, TS, TS, HY0, TB0, { skip: { r: 1 } });
    b.at(TX + TS / 2, 0, TZ, PI / 2); mason(b, () => [-TS / 2, TS / 2], 1.6, TB0, 0, { ql: 1, qr: 1, qph: 1 }); b.pop();   /* 右面下半截埋在港务楼里 */
    b.at(TX, 0, TZ);
    b.box(0, 1.62, 0, TS + .05, .06, TS + .05, DRESS2, { nb: true });
    b.box(0, 2.42, 0, TS + .06, .07, TS + .06, DRESS2, { nb: true });
    for (const a of [0, -PI / 2, PI]) { b.at(0, 0, 0, a); clock(b, 2.77, hs, .19, cy); b.pop(); }
    /* 正面：尖拱窗、挂旗、箭孔；左面：窗、箭孔 */
    lancet(b, 0, .42, hs, .15, .28, { hood: 1 });
    banner(b, 0, 2.3, hs, .22, .62, C.banner);
    slit(b, 0, 1.12, hs);
    b.at(0, 0, 0, -PI / 2); lancet(b, 0, .9, hs, .13, .26, { hood: 1 }); slit(b, 0, 1.85, hs); banner(b, 0, 2.3, hs, .2, .5, C.banner2); b.pop();
    b.at(0, 0, 0, PI); slit(b, 0, 1.3, hs); b.pop();
    /* 钟室：四角石墩、尖拱开口、铜钟 */
    const pw = .13, ow = TS - pw * 2, yS = TB0 + .2, yA = yS + archY(ow, .7, 0), yB1 = yA + .14;
    b.box(0, TB0 - .05, 0, TS + .06, .07, TS + .06, DRESS2, { top: mix3(DRESS2, INNER, .4) });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      b.box(sx * (hs - pw / 2), TB0 + .02, sz * (hs - pw / 2), pw, (yA - TB0 - .02) / 2, pw, sc(3), { nb: true });
      b.box(sx * (hs - pw / 2), TB0 + .02 + (yA - TB0 - .02) / 2, sz * (hs - pw / 2), pw, (yA - TB0 - .02) / 2, pw, mix3(DRESS2, ST, R() * .4), { nb: true });
    }
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); archFill(b, ow, .7, yS, yA, hs, hs - pw, ST2, INNER, 3); b.pop(); }
    b.box(0, yA, 0, TS, yB1 - yA, TS, mix3(ST2, DRESS2, .3), { nb: true });
    b.quad([-hs, yA, -hs], [hs, yA, -hs], [hs, yA, hs], [-hs, yA, hs], INNER);
    b.beam([-hs + pw, yA - .04, 0], [hs - pw, yA - .04, 0], .04, OAK);
    b.cyl(0, yA - .07, 0, .028, .05, 6, IRON, M);
    b.cyl(0, yA - .27, 0, .12, .2, 8, BRONZE, { r2: .065, mat: "metal" });
    b.cyl(0, yA - .29, 0, .125, .025, 8, BRONZE, { r2: .12, mat: "metal" });
    /* 托石城堞、四角小尖塔、八角尖顶 */
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); corbels(b, -hs + .08, hs - .08, yB1 + .12, hs, .15); b.pop(); }
    const PS = TS + .16, yP = yB1 + .12;
    b.box(0, yB1, 0, PS, .12, PS, DRESS2, { top: mix3(C.stone, ST2, .5), nb: true });
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); b.box(0, yP, PS / 2 - .04, PS - .08, .08, .07, ST2, { top: DRESS, nb: true }); merlons(b, -PS / 2 + .12, PS / 2 - .12, yP + .08, PS / 2 - .04, .075, { mw: .1, gap: .08, mh: .11 }); b.pop(); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = sx * (PS / 2 - .05), pz = sz * (PS / 2 - .05);
      b.box(px, yP, pz, .1, .2, .1, mix3(ST2, DRESS2, .4), { top: DRESS, nb: true });
      b.pyramid(px, yP + .2, pz, .12, .12, .26, SL);
      if (cy) b.pyramid(px, yP + .44, pz, .03, .03, .06, BRASS, BG);
    }
    const top = spire(b, 0, yP + .02, 0, hs - .02, 1.3, 8, cy);
    for (const a of [PI / 8, PI / 8 + PI, PI / 8 - PI / 2]) lucarne(b, 0, 0, a, yP + .02 + 1.3 * .2, spireR(hs - .02, .24), cy);
    flag(b, 0, top, 0, C.banner, cy);
    b.pop();
    b.at(TX, 0, TZ, -PI / 2); ivy(b, .05, HY0, hs, .45, 1.6, 30); b.pop();
  }
  const TOWER_TOP = () => { const ow = TS - .26, yA = TB0 + .2 + archY(ow, .7, 0); return yA + .14 + .12 + .02 + 1.3 + .57; };

  /* ---------- 灯塔（1994） ---------- */
  const LX = 1.13, LZ = -.76;
  function lighthouse(b, lv) {
    const big = lv >= 3, r0 = big ? .37 : .3, r1 = big ? .3 : .25, H = big ? 2.75 : 1.8, seg = 12, y0 = G + .2;
    const rAt = y => lerp(r0, r1, (y - y0) / (H - y0));
    b.cyl(LX, G, LZ, r0 + .13, .08, seg, mix3(ST2, STD, .3), { top: DRESS2, a0: PI / seg, nb: true });
    b.cyl(LX, G + .08, LZ, r0 + .08, .12, seg, ST2, { r2: r0 + .01, top: DRESS2, nb: true });
    rshaft(b, LX, LZ, r0, r1, y0, H, seg, .21);
    const bands = big ? [1.15, 2.0] : [1.05];
    for (const y of bands) b.cyl(LX, y, LZ, rAt(y) + .025, .05, seg, DRESS2, { a0: PI / seg });
    b.at(LX, 0, LZ, .5); doorway(b, 0, y0, r0 - .02, .19, .3, { planks: 4 }); b.pop();
    const wins = big ? [[-.7, .9], [1.6, 1.45], [-.2, 1.75], [2.6, 2.3], [.4, 2.35]] : [[-.7, .78], [1.6, 1.35]];
    for (const [a, y] of wins) { b.at(LX, 0, LZ, a); lancet(b, 0, y, rAt(y) - .015, .09, .17, { fr: .03 }); b.pop(); }
    for (let i = 0; i < seg; i++) { b.at(LX, 0, LZ, (i + .5) / seg * TAU); corbel(b, 0, H, r1); b.pop(); }
    const rg = r1 + .17;
    b.cyl(LX, H, LZ, rg, .07, seg, DRESS2, { top: mix3(C.stone, ST2, .5), a0: PI / seg });
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, a2 = (i + 1) / 10 * TAU; b.beam(pt(LX, LZ, a, rg - .03, H + .07), pt(LX, LZ, a, rg - .03, H + .26), .016, IRON, M); b.beam(pt(LX, LZ, a, rg - .03, H + .25), pt(LX, LZ, a2, rg - .03, H + .25), .016, IRON, M); }
    /* 灯室：石座、铁框玻璃、暖灯、尖顶 */
    const rl = r1 * .74, yl = H + .07;
    b.cyl(LX, yl, LZ, rl + .03, .1, 8, ST2, { top: DRESS2, a0: PI / 8 });
    b.cyl(LX, yl + .1, LZ, rl, .32, 8, mix3(C.glass, WIN, .25), { mat: "glass", nt: true, nb: true, a0: PI / 8 });
    b.cyl(LX, yl + .12, LZ, .06, .18, 6, C.lamp, { r2: .075, e: .7 });
    b.cyl(LX, yl + .3, LZ, .08, .04, 6, C.lamp, { r2: .05, e: .7 });
    for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * TAU; b.beam(pt(LX, LZ, a, rl * Math.cos(PI / 8), yl + .1), pt(LX, LZ, a, rl * Math.cos(PI / 8), yl + .43), .02, IRON, M); }
    b.cyl(LX, yl + .42, LZ, rl + .05, .04, 8, IRON, { a0: PI / 8, mat: "metal" });
    b.cyl(LX, yl + .46, LZ, rl + .04, .26, 8, SL, { r2: 0, a0: PI / 8, nb: true });
    finial(b, LX, yl + .74, LZ, false);                    /* 1994 的老灯塔只点灯室里那盏暖灯，不挂一闪一闪的航标 */
    rivy(b, LX, LZ, r0, -1.2, 1.3, y0, .9, 20);
    return yl + 1.0;
  }

  /* ---------- 黄铜飞艇系泊塔（2077） ---------- */
  function mooring(b, lv) {
    const big = lv >= 3, r0 = .34, r1 = .31, y0 = G + .2, yD = big ? 1.05 : .82, seg = 12;
    b.cyl(LX, G, LZ, r0 + .13, .08, seg, mix3(ST2, STD, .3), { top: DRESS2, a0: PI / seg, nb: true });
    b.cyl(LX, G + .08, LZ, r0 + .08, .12, seg, ST2, { r2: r0 + .01, top: DRESS2, nb: true });
    rshaft(b, LX, LZ, r0, r1, y0, yD, seg, .19);
    b.at(LX, 0, LZ, .5); doorway(b, 0, y0, r0 - .02, .19, .3, { planks: 4 }); b.pop();
    for (let i = 0; i < seg; i++) { b.at(LX, 0, LZ, (i + .5) / seg * TAU); corbel(b, 0, yD, r1); b.pop(); }
    b.cyl(LX, yD, LZ, r1 + .12, .08, seg, DRESS2, { top: mix3(C.stone, ST2, .5), a0: PI / seg });
    for (let i = 0; i < seg; i += 2) { b.at(LX, 0, LZ, (i + .5) / seg * TAU); b.box(0, yD + .08, r1 + .07, .11, .1, .06, mix3(DRESS2, ST2, R() * .5), { top: DRESS, nb: true }); b.pop(); }
    /* 四腿黄铜桁架 */
    const yb = yD + .08, yt = big ? 3.35 : 2.55, b0 = .2, b1 = .06, nl = big ? 6 : 4;
    const cor = (y, s) => [[-s, -s], [s, -s], [s, s], [-s, s]].map(([dx, dz]) => [LX + dx, y, LZ + dz]);
    const sAt = y => lerp(b0, b1, (y - yb) / (yt - yb));
    for (let k = 0; k < 4; k++) b.beam(cor(yb, b0)[k], cor(yt, b1)[k], .034, BRASS, BG);
    for (let i = 1; i <= nl; i++) {
      const ya = yb + (yt - yb) * (i - 1) / nl, y2 = yb + (yt - yb) * i / nl, A = cor(y2, sAt(y2)), Bq = cor(ya, sAt(ya));
      for (let k = 0; k < 4; k++) { b.beam(A[k], A[(k + 1) % 4], .016, BRASS, BG); b.beam(Bq[k], A[(k + 1) % 4], .011, mix3(BRASS, C.metal, .4), BG); }
    }
    if (big) {                                              /* 半腰一圈小平台 */
      const ym = yb + (yt - yb) * 3 / nl, sm = sAt(ym) + .12;
      b.box(LX, ym - .03, LZ, sm * 2, .03, sm * 2, mix3(BRASS, C.woodD, .45), BG);
      for (let k = 0; k < 4; k++) { const P = cor(ym + .16, sm); b.beam(P[k], P[(k + 1) % 4], .012, BRASS, BG); }
    }
    b.cyl(LX, yt, LZ, .2, .04, 10, BRASS, BG);
    for (let i = 0; i < 4; i++) { const a = (i + .5) / 4 * TAU; b.beam(pt(LX, LZ, a, .19, yt + .04), pt(LX, LZ, a, .19, yt + .16), .012, BRASS, BG); }
    b.cyl(LX, yt + .15, LZ, .2, .02, 10, BRASS, { nt: true, nb: true, mat: "gloss" });
    b.cyl(LX, yt + .04, LZ, .05, .2, 8, BRASS, { mat: "gloss", r2: .035 });
    b.beam([LX, yt + .24, LZ], [LX, yt + .5, LZ], .016, BRASS, BG);
    b.box(LX, yt + .5, LZ, .05, .07, .05, C.lamp, { e: .6 }); b.pyramid(LX, yt + .57, LZ, .07, .07, .05, BRASS, BG);   /* 桅顶一盏小暖灯，不闪红光 */
    /* 小飞艇：头系在桅顶，身子往后（岛外）泊 */
    const L = big ? 1.7 : 1.35, Rr = big ? .3 : .25, dir = -.55, ux = Math.sin(PI + dir), uz = Math.cos(PI + dir);
    const cx = LX + ux * (L / 2 + .16), cz = LZ + uz * (L / 2 + .16), cyy = yt + .22;
    b.at(LX, yt + .28, LZ, PI + dir); b.cone(0, 0, .05, .07, .1, 8, BRASS, BG); b.pop();
    b.bob(cx, cyy, cz, .05, .7, sb => {
      sb.at(0, 0, 0, dir);                                  /* 局部 +z 指向桅杆（艇头） */
      const env = mix3(C.banner, [.25, .22, .26], .45), fin = mix3(C.banner2, SL, .3);
      sb.at(0, 0, 0, 0, [Rr, L / 2, Rr], PI / 2); sb.sphere(0, 0, 0, 1, 10, env, { mat: "gloss" }); sb.pop();
      for (const t of [-.309, .309]) { const rz = Rr * .951 + .006; sb.at(0, 0, t * L / 2, 0, 1, PI / 2); sb.cyl(0, -.014, 0, rz, .028, 10, BRASS, { nt: true, nb: true, mat: "gloss" }); sb.pop(); }
      sb.at(0, 0, L / 2 - .02, 0, 1, PI / 2); sb.cone(0, 0, 0, .06, .08, 8, BRASS, BG); sb.pop();
      for (let k = 0; k < 4; k++) {                          /* 十字尾翼 */
        sb.at(0, 0, 0, 0, 1, 0, k * PI / 2 + PI / 4);
        const A = [0, Rr * .55, -L * .3], B = [0, Rr * 1.35, -L * .5], Cc = [0, Rr * .3, -L * .52];
        sb.tri(A, B, Cc, fin); sb.tri(A, Cc, B, fin);
        sb.pop();
      }
      const gy = -Rr - .15, gl = L * .36;                   /* 吊舱：木壳、铜边、一排烛光小窗、四根吊杆 */
      sb.box(0, gy, .04, .15, .11, gl, C.woodD, { top: BRASS });
      sb.box(0, gy - .02, .04, .12, .02, gl - .04, mix3(C.woodD, IRON, .4));
      for (const s of [-1, 1]) {
        sb.at(s * .076, 0, .04, s * PI / 2);
        for (let i = 0; i < 3; i++) sb.panel((i - 1) * gl * .26, gy + .04, .001, .05, .04, WIN, { e: .5 });
        sb.pop();
        sb.beam([s * .05, gy + .11, .04], [s * .07, -Rr * .85, .04], .012, BRASS, BG);
      }
      for (const s of [-1, 1]) {                             /* 两侧螺旋桨 */
        sb.beam([s * .075, gy + .06, .04 - gl * .4], [s * .16, gy + .06, .04 - gl * .45], .014, BRASS, BG);
        sb.box(s * .16, gy + .06 - .03, .04 - gl * .45 + .01, .05, .06, .09, BRASS, BG);
        sb.spin(s * .16, gy + .06, .04 - gl * .45 - .05, "z", 3.2 * s, pb => { pb.box(-.1, -.012, 0, .2, .024, .008, C.woodD); pb.box(-.012, -.1, 0, .024, .2, .008, C.woodD); });
      }
      sb.beam([0, 0, L / 2], [0, .06, L / 2 + .14], .014, ROPE);
      sb.pop();
    });
    return yt + .6;
  }

  /* ---------- 船棚（Lv2+） ---------- */
  const SX = 1.16, SZ = .3, SW = .86, SD = 1.0, SE = .92;
  function boatShed(b, cy) {
    const x0 = SX - SW / 2, x1 = SX + SW / 2, z0 = SZ - SD / 2, z1 = SZ + SD / 2, pw = .15, ow = SW - pw * 2, p = .66, yS = .48, yA = yS + archY(ow, p, 0);
    b.box(SX, G, SZ - .02, SW + .06, .06, SD + .02, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    mason(b, () => [x0, x1], G + .06, SE, z0, { ql: 1, qr: 1, back: true });
    b.at(x1, 0, SZ, PI / 2); mason(b, () => [-SD / 2, SD / 2], G + .06, SE, 0, { qr: 1, qph: 1 }); b.pop();
    b.at(x0, 0, SZ, -PI / 2); mason(b, () => [-SD / 2, SD / 2], G + .06, SE, 0, { ql: 1, qph: 1 }); b.pop();
    const IN = mix3(ST2, STD, .55), t = .1;                 /* 里墙、顶棚 */
    qf(b, [x0 + t, G, z0 + t], [x0 + t, G, z1 - .12], [x0 + t, SE, z1 - .12], [x0 + t, SE, z0 + t], IN, [1, 0, 0]);
    qf(b, [x1 - t, G, z0 + t], [x1 - t, G, z1 - .12], [x1 - t, SE, z1 - .12], [x1 - t, SE, z0 + t], IN, [-1, 0, 0]);
    qf(b, [x0 + t, G, z0 + t], [x1 - t, G, z0 + t], [x1 - t, SE, z0 + t], [x0 + t, SE, z0 + t], mix3(IN, INNER, .4), [0, 0, 1]);
    if (!cy) qf(b, [x0 + t, SE - .01, z0 + t], [x1 - t, SE - .01, z0 + t], [x1 - t, SE - .01, z1 - .12], [x0 + t, SE - .01, z1 - .12], INNER, [0, -1, 0]);
    else for (const [ax, az, bx, bz] of [[x0, z0, x0 + t, z1], [x1 - t, z0, x1, z1], [x0, z0, x1, z0 + t]]) b.quad([ax, SE, bz], [bx, SE, bz], [bx, SE, az], [ax, SE, az], DRESS2);   /* 玻璃顶下露出墙头 */
    for (const dz of [.25, .55, .85]) b.box(SX, SE - .06, z0 + t + dz * (SD - .22), SW - .2, .05, .05, OAK);
    /* 正面：两边石墩、尖拱大门洞、料石券、山墙 */
    for (const s of [-1, 1]) b.box(SX + s * (SW / 2 - pw / 2), G + .06, z1 - .06, pw, SE - G - .06, .12, mix3(ST, ST2, .5), { nb: true, top: DRESS2 });
    b.at(SX, 0, 0);
    archFill(b, ow, p, yS, SE, z1, z1 - .12, mix3(ST, ST2, .4), INNER, 4);
    archRing(b, ow, p, yS, z1 + .006, .045, 4);
    b.box(0, yA - .02, z1 - .01, .07, .1, .05, DRESS, { nb: true });
    b.pop();
    b.beam([SX + .18, SE - .04, SZ - .1], [SX + .18, SE - .2, SZ - .1], .008, IRON, M);   /* 棚里吊一盏灯 */
    lantern(b, SX + .18, SE - .42, SZ - .1, cy);
    b.box(SX, SE - .03, z1 - .06, SW + .02, .05, .14, DRESS2, { nb: true });
    b.at(SX, 0, SZ, PI / 2); roof(b, -SD / 2 - .02, SD / 2 + .02, SW + .04, SE + .02, .6, .1, { gl: 1, gr: 1, finial: 1, cy, glass: cy }); b.pop();
    b.at(x1, 0, SZ, PI / 2); lancet(b, -.1, .4, 0, .08, .2, { fr: .03, dark: 1 }); b.pop();
    /* 里头：木架上搁一条小飞舟、墙上挂桨 */
    for (const dz of [-.22, .22]) { b.at(SX, G, SZ - .02 + dz); b.box(0, .12, 0, .38, .04, .06, OAK); for (const s of [-1, 1]) b.beam([s * .15, 0, 0], [s * .12, .13, 0], .03, OAK); b.pop(); }
    skiff(b, SX, G + .16, SZ - .02, cy);
    b.at(x0 + t + .01, 0, SZ - .1, PI / 2); b.beam([-.15, .25, 0], [.15, .7, 0], .022, C.woodL, { tz: .01 }); b.box(-.18, .2, 0, .06, .1, .015, C.woodL); b.pop();
    b.torus(x1 - .2, G + .03, z0 + .22, .07, .022, 7, 3, ROPE);
    ivy(b, x1 - .05, G + .06, z1 + .002, .15, .7, 14);
  }
  function skiff(b, x, y, z, cy) {                           /* 小飞舟：木船身、船舷、坐板、短桅、收起的帆、舵；2077 镶黄铜、尾上螺旋桨 */
    const L = .78, S = [[-L / 2, .1, .05, .2, .07], [-L / 4, .15, .08, .19, .02], [L / 8, .15, .07, .19, 0], [L * .34, .1, .035, .21, .03], [L / 2, 0, 0, .27, .13]];
    const hull = mix3(C.wood, C.woodD, .2), hull2 = mix3(C.woodD, C.wood, .2);
    b.at(x, y, z);
    for (let i = 0; i < S.length - 1; i++) {
      const [za, wa, ba, ya, ka] = S[i], [zb, wb, bb, yb, kb] = S[i + 1];
      for (const s of [-1, 1]) {
        qf(b, [s * wa, ya, za], [s * wb, yb, zb], [s * bb, kb + .03, zb], [s * ba, ka + .03, za], i % 2 ? hull : hull2, [s, 0, 0]);
        qf(b, [s * ba, ka + .03, za], [s * bb, kb + .03, zb], [0, kb, zb], [0, ka, za], hull2, [s, -1, 0]);
        b.beam([s * wa, ya + .01, za], [s * wb, yb + .01, zb], .022, cy ? BRASS : OAK, cy ? BG : {});
      }
      if (i < S.length - 2) qf(b, [-wa * .85, ya - .05, za], [wa * .85, ya - .05, za], [wb * .85, yb - .05, zb], [-wb * .85, yb - .05, zb], PLANK, [0, 1, 0]);
    }
    const [zs, ws, bs, ys, ks] = S[0];
    qf(b, [-ws, ys, zs], [ws, ys, zs], [bs, ks + .03, zs], [-bs, ks + .03, zs], hull2, [0, 0, -1]);
    qf(b, [-bs, ks + .03, zs], [bs, ks + .03, zs], [0, ks, zs], [0, ks, zs], hull2, [0, 0, -1]);
    for (const zz of [-.12, .12]) b.box(0, .15, zz, .26, .02, .07, PLANK);
    b.beam([0, .14, .05], [0, .78, .05], .028, OAK);
    b.at(0, .3, .05, 0, 1, PI / 2); b.cyl(0, -.32, 0, .035, .3, 6, mix3(C.cream, C.hay, .3), { r2: .02 }); b.pop();
    b.beam([0, .3, .05], [0, .3, -.27], .02, OAK);
    b.box(0, .02, -L / 2 - .03, .015, .17, .06, OAK);
    if (cy) {
      b.cyl(0, .08, -L / 2 - .02, .02, .05, 6, BRASS, BG);
      b.spin(0, .1, -L / 2 - .06, "z", 3, pb => { pb.box(-.09, -.01, 0, .18, .02, .008, BRASS, BG); pb.box(-.01, -.09, 0, .02, .18, .008, BRASS, BG); });
      b.box(0, .2, .2, .2, .08, .01, mix3(C.glass, C.white, .2), GLS);
    } else {
      b.at(.02, .8, .05); for (let i = 0; i < 2; i++) b.tri([0, -i * .02, 0], [.14, -.03, .005], [0, -.07, 0], i ? C.banner : mix3(C.banner, C.gold, .4), { k: 1.3 }); b.pop();
      b.at(.02, .8, .05); b.tri([0, 0, 0], [0, -.07, 0], [.14, -.03, -.005], C.banner, { k: 1.3 }); b.pop();
    }
    b.pop();
  }

  /* ---------- 候船长廊（Lv3） ---------- */
  function gallery(b, cy) {
    const xa = HXL + .02, xb = HXR + .03, zw = HF, zf = HF + .58, nbay = 3, bw = (xb - xa) / nbay, pw = .1, ow = bw - pw, p = .68, yS = .44, yA = yS + archY(ow, p, 0), yT = yA + .1, yR = .98;
    b.box((xa + xb) / 2, G, (zw + zf) / 2 + .02, xb - xa + .06, .05, zf - zw + .04, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    for (let i = 0; i <= nbay; i++) {
      const x = xa + i * bw;
      b.box(x, G + .05, zf - .06, pw, yS - G - .05, .12, mix3(ST, ST2, .4), { nb: true });
      b.box(x, yS - .035, zf - .06, pw + .04, .035, .15, DRESS);
      b.box(x, G + .05, zf - .06, pw + .04, .05, .15, DRESS2, { nb: true });
    }
    b.at(0, 0, 0);
    for (let i = 0; i < nbay; i++) { b.at(xa + (i + .5) * bw, 0, 0); archFill(b, ow, p, yS, yT, zf, zf - .12, mix3(ST, ST2, .45), INNER, 3); archRing(b, ow, p, yS, zf + .005, .03, 3); b.pop(); }
    b.pop();
    b.box((xa + xb) / 2, yT, zf - .06, xb - xa + pw, .05, .16, DRESS2, { nb: true });
    /* 右端：侧面一个尖拱口 */
    const sd = zf - .12 - zw, sw = sd - .06;
    b.at(xb, 0, zw + sd / 2, PI / 2);
    archFill(b, sw, p, yS, yT, pw / 2, -pw / 2, mix3(ST, ST2, .45), INNER, 3);
    b.box(-sd / 2 + .02, G + .05, 0, .06, yT - G - .05, pw, mix3(ST, ST2, .4), { nb: true });
    tf(b, [-sd / 2 - .06, yT + .05, pw / 2], [sd / 2 + .12, yT + .05, pw / 2], [-sd / 2 - .06, yR, pw / 2], sc(.9), [0, 0, 1]);
    b.pop();
    /* 单坡顶：1994 石板瓦；2077 黄铜框玻璃 */
    const r0 = [xa - .06, yR, zw], r1 = [xb + .06, yR, zw], r2 = [xb + .06, yT + .02, zf + .1], r3 = [xa - .06, yT + .02, zf + .1];
    if (!cy) {
      for (let i = 0; i < 3; i++) { const t0 = i / 3, t1 = (i + 1) / 3, L = (a, c, t) => [lerp(a[0], c[0], t), lerp(a[1], c[1], t), lerp(a[2], c[2], t)]; qf(b, L(r3, r0, t0), L(r2, r1, t0), L(r2, r1, t1), L(r3, r0, t1), i % 2 ? SL : mix3(SL, SL2, .55), [0, 1, 1]); }
      b.box((xa + xb) / 2, yT - .02, zf + .095, xb - xa + .12, .035, .03, SLD, { nb: true });
      b.box((xa + xb) / 2, yR - .02, zw + .03, xb - xa + .12, .05, .06, DRESS2, { nb: true });
      qf(b, [xa, yT + .0, zf - .12], [xb, yT, zf - .12], [xb, yR - .03, zw + .01], [xa, yR - .03, zw + .01], INNER, [0, -1, 0]);
    } else {
      qf(b, r3, r2, r1, r0, mix3(C.glass, C.white, .25), [0, 1, 1], GLS);
      const n = 6;
      for (let i = 0; i <= n; i++) { const x = lerp(xa - .06, xb + .06, i / n); b.beam([x, yR + .01, zw + .02], [x, yT + .03, zf + .1], .022, BRASS, BG); }
      b.beam([xa - .06, yT + .03, zf + .1], [xb + .06, yT + .03, zf + .1], .03, BRASS, BG);
      b.beam([xa - .06, yR + .01, zw + .02], [xb + .06, yR + .01, zw + .02], .03, BRASS, BG);
      b.beam([xa - .06, (yR + yT) / 2 + .02, (zw + zf) / 2 + .05], [xb + .06, (yR + yT) / 2 + .02, (zw + zf) / 2 + .05], .014, BRASS, BG);
    }
    /* 廊下：长椅、行李箱、吊灯、告示板 */
    for (const x of [WX[0], WX[2]]) {
      b.box(x, G + .17, zw + .1, .4, .025, .12, PLANK, { top: mix3(PLANK, C.woodL, .3) });
      for (const s of [-1, 1]) b.box(x + s * .17, G + .05, zw + .1, .03, .12, .1, OAK, { nb: true });
      b.box(x, G + .22, zw + .035, .4, .12, .02, PLANK);
    }
    b.box(WX[0] + .1, G + .195, zw + .1, .14, .08, .09, mix3(C.banner, C.woodD, .4), { top: mix3(C.banner, C.woodD, .2) });
    b.box(WX[0] + .1, G + .275, zw + .1, .03, .012, .01, BRASS);
    b.box(WX[2] - .08, G + .05, zw + .2, .16, .14, .1, mix3(C.woodD, C.banner2, .3), { top: mix3(C.woodD, C.banner2, .2) });
    for (const x of [WX[0], WX[2]]) { b.beam([x, yR - .06, zw + .28], [x, yT - .03, zw + .28], .01, IRON, M); lantern(b, x, yT - .26, zw + .28, cy); }
    b.box(WX[1] + .27, .52, zw + .025, .16, .2, .02, OAK);
    for (const [dx, dy] of [[-.04, .06], [.035, .1], [.01, .02]]) b.panel(WX[1] + .27 + dx, .52 + dy, zw + .037, .05, .06, mix3(C.cream, C.hay, R() * .3));
  }

  function build(b, o) {
    R = o.rnd || Math.random;
    const lv = o.lv || 1, cy = !!o.cyber;
    quay(b);
    house(b, cy, lv);
    clockTower(b, cy);
    if (cy) mooring(b, lv); else lighthouse(b, lv);
    if (lv >= 2) boatShed(b, cy);
    if (lv >= 3) gallery(b, cy);
    /* 后沿系缆石桩、晾网架 */
    for (const [x, rope] of [[-1.42, 1], [-.12, 1], [.55, 0]]) bollard(b, x, QZ0 + .12, rope);
    netRack(b, -.75, HB - .32, 0, .7);
    netPile(b, -1.32, HB - .3);
    /* 场院一角的木箱、木桶 */
    if (lv < 2) {
      crate(b, 1.0, G, .55, .22, .2); crate(b, 1.24, G, .5, .2, -.1); crate(b, 1.1, G + .22, .52, .18, .5);
      barrel(b, 1.42, G, .78, .085, .22); barrel(b, 1.25, G, .78, .08, .2);
      netPile(b, .95, .05);
    } else {
      crate(b, -1.38, G, .66, .2, .25); crate(b, -1.38, G + .2, .64, .16, -.2);
      barrel(b, -1.12, G, .78, .08, .2);
      crate(b, 1.42, G, -.4, .2, .1); barrel(b, 1.42, G, -.12, .08, .2);
    }
    lampPost(b, QX0 + .12, QZ1 - .12, cy);
    lampPost(b, QX1 - .12, QZ1 - .12, cy);
    if (cy) {
      b.emit(WX[1], 1.12, HF + .55, "cat", 1, 1);
      if (lv >= 2) b.emit(SX, 1.1, SZ + SD / 2 + .3, "cat", 1, 1);
    }
  }
  build.h = o => TOWER_TOP() + .2;
  Isle3D.FAC["港桥"] = build;
})();
