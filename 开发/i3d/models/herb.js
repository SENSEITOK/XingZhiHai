/* 药圃：霍格沃茨草药课那种药草园。
   1994：碎石铺地上一格格料石边花坛（转角石墩戴小尖帽、木签名牌），每格一种魔药草：紫色薰衣草穗、蓝紫乌头长穗、曼德拉草宽叶莲座、银叶鼠尾草、红花、金盏、白花、蕨；
         阴凉处几簇淡淡萤光的蘑菇；正中一座石日晷；铸铁框维多利亚小玻璃温室（矮石墙、人字玻璃顶、屋脊铁花和尖顶饰、尖拱玻璃门、里面花架盆栽）；
         木晒药架挂一串串倒吊的药草束；几只大陶罐（月桂球、芦荟、垂藤、扎布盖的药坛）；铁灯柱挂提灯、浇水壶。
         Lv2 后面起一座石砌炼药小屋：毛石墙、石板瓦陡顶、山墙压顶石、尖拱铁钉木门、尖拱烛光小窗和窗下药瓶架、屋檐下吊着药草束、山墙外烟囱冒蒸汽；门边一口小坩埚。
         Lv3 温室换成带尖顶的大玻璃暖房：石基座、尖拱铁窗格、玻璃坡顶带屋脊铁花、两头山墙玫瑰窗、正中八角玻璃塔和高高的玻璃尖顶、小旗、前出尖拱门廊；里面棕榈和大叶植物；再加一架晒药簸箕。
   2077：同一套石头底子；Lv3 暖房换成哥特铁骨的玻璃尖穹顶（十二边石基、尖拱窗格、黄铜腰线、穹顶上小灯亭和尖顶饰，里面浮着一盏猫球灯）；
         日晷换成慢慢转的黄铜浑天仪，几根黄铜细杆托着猫球灯，陶罐箍黄铜带，花坛里有几只玻璃钟罩。不加霓虹、不加全息。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);
  const INNER = mix3(STD, [.14, .13, .15], .45);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLM = mix3(SL, SL2, .5);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);
  const BRASS = mix3(C.gold, [.46, .34, .2], .28);
  const OLDW = mix3(C.wood, [.55, .52, .48], .35), OLDWD = mix3(C.woodD, [.4, .38, .36], .25), ROPE = [.72, .63, .46];
  const IRN = [.2, .23, .23], GLS = mix3(C.glass, C.white, .3);
  const SOIL = mix3(C.soil, [.24, .17, .12], .35), SOILT = mix3(C.soil, [.33, .24, .16], .15);
  const GRAV = mix3(C.stone, C.dirt, .42), FLOOR = mix3(C.stone, C.dirt, .2);
  const TERRA = [.73, .42, .28], TERRA2 = [.6, .33, .22], TERRAL = [.8, .53, .38];
  const WICK = [.74, .62, .42], WICKD = [.56, .45, .3];
  const MUSH = [[.42, .82, .78], [.66, .55, .92]];
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 1000 + n * 7919; R(); R(); };
  const pick = a => a[Math.floor(R() * a.length) % a.length];

  /* ---------- 石头颜色 ---------- */
  function sc(y) {
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .42 + r * .5);
    if (r2 < .3) c = mix3(c, [.6, .55, .47], .25); else if (r2 > .75) c = mix3(c, [.47, .5, .53], .25);
    if (r > .94) c = mix3(c, STD, .35);
    return mix3(c, mix3(STD, C.ivy, .35), Math.max(0, Math.min(.3, (.5 - y) * .4)));
  }
  const curbC = () => { const r = R(); let c = mix3(DRESS2, C.stone, R() * .7); if (r < .2) c = mix3(c, [.6, .55, .47], .3); else if (r > .88) c = mix3(c, mix3(STD, C.ivy, .5), .4); return c; };

  /* ---------- 小工具 ---------- */
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function archPts(w, p, n) {
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }
  function qf(b, A, B, Cc, D, col, hint, o) {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function tf(b, A, B, Cc, col, hint, o) {
    const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v = [Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]];
    const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.tri(A, Cc, B, col, o) : b.tri(A, B, Cc, col, o);
  }
  function leaf(b, x, y, z, a, len, wid, lift, col, o) {    /* 一片叶子：菱形 */
    const ca = Math.cos(a), sa = Math.sin(a), px = -sa, pz = ca;
    const B0 = [x, y, z], T = [x + ca * len, y + lift, z + sa * len], L = [x + ca * len * .45 + px * wid, y + Math.max(lift * .7, len * .25), z + sa * len * .45 + pz * wid], Rr = [x + ca * len * .45 - px * wid, y + Math.max(lift * .7, len * .25), z + sa * len * .45 - pz * wid];
    tf(b, B0, L, T, col, [0, 1, 0], o); tf(b, B0, T, Rr, col, [0, 1, 0], o);
  }

  function rod(b, a, c, t, col, o) {                        /* 细杆：只有四个侧面（铁框、绳、木杆，省掉两头端面） */
    const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const y = [d[0] / L, d[1] / L, d[2] / L], r = Math.abs(y[1]) < .95 ? [y[1] * 0 - y[2] * 1, y[2] * 0 - y[0] * 0, y[0] * 1 - y[1] * 0] : [0, y[2], -y[1]], rl = Math.hypot(r[0], r[1], r[2]);
    const x = [r[0] / rl, r[1] / rl, r[2] / rl], z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
    b.push(new Float32Array([x[0], x[1], x[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1]));
    const h = t / 2, Q = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (let i = 0; i < 4; i++) { const p = Q[i], q = Q[(i + 1) % 4]; b.quad([q[0], 0, q[1]], [p[0], 0, p[1]], [p[0], L, p[1]], [q[0], L, q[1]], col, o); }
    b.pop();
  }

  /* ---------- 砌石 ---------- */
  function mason(b, hw, y0, y1, z, o) {                     /* 一面错缝砌的墙（面朝 +z，o.back 朝 -z） */
    o = o || {};
    const rh = o.rh || .17, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      const q0 = o.ql ? (j % 2 ? .1 : .19) : 0, q1 = o.qr ? (j % 2 ? .19 : .1) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .22));
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
  function rwall(b, cx, cz, r0, r1, y0, y1, seg, rh, a0) {  /* 圆／多边形石砌一圈圈 */
    const n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, P = (a, r, y) => [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r];
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, ra = r0 + (r1 - r0) * j / n, rb = r0 + (r1 - r0) * (j + 1) / n;
      for (let i = 0; i < seg; i++) {
        const a = (a0 || 0) + i / seg * TAU, a2 = (a0 || 0) + (i + 1) / seg * TAU;
        b.quad(P(a2, ra, ya), P(a, ra, ya), P(a, rb, yb), P(a2, rb, yb), sc(ya));
      }
    }
  }
  function stoneWall(b, x0, x1, y0, y1, th, o) {            /* 一段矮墙（当前坐标：墙面在 z=0 朝 +z，墙身往 -z）：深色墙芯、外贴错缝石、压顶料石 */
    o = o || {};
    b.box((x0 + x1) / 2, y0, -th / 2, x1 - x0, y1 - y0, th, STD, { nb: true });
    mason(b, () => [x0, x1], y0, y1, .002, { rh: o.rh || .1, ql: o.ql, qr: o.qr });
    if (!o.noCap) b.box((x0 + x1) / 2, y1, -th / 2, x1 - x0 + .02, .03, th + .035, DRESS, { nb: true });
  }

  /* ---------- 窗、门、灯、旗、藤 ---------- */
  function lancet(b, x, y, z, w, h, o) {
    o = o || {};
    const p = .72, fr = .03;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p), o.z0 != null ? o.z0 : -.03, .02, DRESS);
    fan(b, outline(w, h, 0, p), .024, WIN, { e: o.e != null ? o.e : .55 });
    b.box(0, h * .55, .022, w, .012, .012, C.iron);
    b.box(0, 0, .022, .012, h + archY(w, p, 0) * .9, .012, C.iron);
    b.box(0, -fr - .03, .0, w + fr * 2 + .04, .03, .08, DRESS2);
    b.pop();
  }
  function door(b, w, h, p, o) {
    o = o || {};
    const dark = mix3(C.woodD, [0, 0, 0], .45), wd = mix3(C.woodD, C.wood, .3);
    fan(b, outline(w, h, 0, p, 4), 0, wd);
    const n = o.planks || 6;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, i === n / 2 ? .018 : .008, h + archY(w, p, x) - .02, dark); }
    for (const y of o.straps || [h * .2, h * .7]) {
      b.box(0, y, .006, w - .03, .026, .012, C.iron, M);
      for (let i = 0; i < 4; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 3, y + .006, .0125, .014, .014, C.metal, M);
    }
    if (o.ring) b.box(w * .22, h * .45, .012, .028, .028, .016, C.iron, M);
  }
  function lantern(b, x0, y0, z0, cy) {
    const fr = cy ? BRASS : C.iron;
    b.at(x0, y0, z0, 0, .85);
    b.cyl(0, 0, 0, .06, .025, 4, fr, { mat: "metal", a0: PI / 4 });
    b.cyl(0, .025, 0, .042, .12, 4, C.lamp, { r2: .05, e: .7, a0: PI / 4 });
    for (let i = 0; i < 4; i++) { const a = PI / 4 + i * PI / 2; b.beam([Math.cos(a) * .046, .025, Math.sin(a) * .046], [Math.cos(a) * .055, .145, Math.sin(a) * .055], .012, fr, M); }
    b.cone(0, .145, 0, .072, .09, 4, fr, { mat: "metal", a0: PI / 4 });
    b.box(0, .235, 0, .02, .03, .02, fr, M);
    b.pop();
  }
  function flag(b, x, y, z, col, cy) {
    b.beam([x, y - .1, z], [x, y + .46, z], .02, cy ? BRASS : C.iron, M);
    b.sphere(x, y + .48, z, .026, 4, C.gold, M);
    const L = .3, Hh = .13, top = y + .43, segs = 3;
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs, t1 = (i + 1) / segs, x0 = x + .01 + L * t0, x1 = x + .01 + L * t1, w0 = Math.sin(t0 * 5.5) * .03, w1 = Math.sin(t1 * 5.5) * .03, h0 = Hh * (1 - t0 * .6), h1 = Hh * (1 - t1 * .6);
      const A = [x0, top - h0, z + w0], B = [x1, top - h1, z + w1], Cc = [x1, top, z + w1], D = [x0, top, z + w0], cc = i === 1 ? mix3(col, C.gold, .55) : col;
      b.quad(A, B, Cc, D, cc, { k: 1.4 }); b.quad(B, A, D, Cc, cc, { k: 1.4 });
    }
    return y + .5;
  }
  function ivy(b, x, y0, z, w, h, n) {
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .024 + R() * .026, zz = z + .012 + R() * .012;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }

  /* ---------- 魔药草 ---------- */
  const HC = {
    lav: [[.56, .42, .78], [.47, .36, .7], [.64, .5, .84]],
    aco: [[.34, .38, .82], [.43, .36, .8], [.28, .33, .7]],
    red: [[.86, .24, .2], [.92, .36, .22], [.74, .18, .24]],
    gold: [[.96, .74, .2], [.98, .6, .16], [.95, .84, .34]],
    moly: [[.97, .96, .92], [.93, .92, .98], [.98, .9, .9]],
    pink: [[.94, .55, .68], [.86, .45, .62], [.98, .68, .76]]
  };
  function mound(b, x, y, z, r, h, col, seg) { b.cyl(x, y - .01, z, r, h, seg || 5, col, { r2: r * .5, nb: true, a0: R() * TAU, k: 1.08 }); }
  function spike(b, x, y, z, a, tilt, r, h, col, seg) { b.at(x, y, z, 0, 1, Math.sin(a) * tilt, -Math.cos(a) * tilt); b.cone(0, 0, 0, r, h, seg || 3, col, { nb: true, k: 1.18 }); b.pop(); }
  function herb(b, kind, x, y, z, g) {
    const r = g * .36;
    if (kind === "lav" || kind === "sage") {                 /* 薰衣草：灰绿叶丛插一把紫穗；鼠尾草：银灰叶丘、几根淡紫短穗 */
      const sage = kind === "sage";
      mound(b, x, y, z, r * (sage ? 1.1 : .95), r * (sage ? .9 : .8), sage ? mix3([.46, .6, .44], [.58, .68, .54], R()) : mix3([.44, .56, .48], [.54, .63, .54], R()), sage ? 6 : 5);
      const n = sage ? 2 : 5;
      for (let i = 0; i < n; i++) { const a = i / n * TAU + R(), d = r * .45; spike(b, x + Math.cos(a) * d, y + r * .45, z + Math.sin(a) * d, a, .32, .013, (sage ? r * 1.1 : r * 2.1) + R() * .03, sage ? [.66, .56, .84] : pick(HC.lav)); }
    } else if (kind === "aco") {                             /* 乌头：一圈叶、一根蓝紫高穗 */
      for (let i = 0; i < 3; i++) leaf(b, x, y + .005, z, i * TAU / 3 + R(), r * 1.25, r * .5, .02, mix3(C.leafD, C.leaf, R() * .5));
      b.cyl(x, y, z, .009, r * 1.2, 3, mix3(C.leafD, C.leaf, .3), { nt: true, nb: true });
      spike(b, x, y + r * 1.1, z, R() * TAU, .08, .019, r * 2.4 + R() * .05, pick(HC.aco), 4);
    } else if (kind === "man") {                             /* 曼德拉草：一圈翘起的宽叶，叶心一点紫 */
      for (let i = 0; i < 6; i++) leaf(b, x, y + .005, z, i * TAU / 6 + R() * .4, r * 1.45, r * .55, r * .9, mix3(C.leafD, [.3, .5, .26], R() * .6), { k: 1.1 });
      b.box(x, y + r * .25, z, .026, .03, .026, [.62, .44, .7], { nb: true });
    } else if (kind === "fern") {
      for (let i = 0; i < 6; i++) leaf(b, x, y, z, i * TAU / 6 + R() * .3, r * 1.7, r * .38, r * .9, mix3(C.leaf2, [.45, .7, .35], R()), { k: 1.15 });
    } else {                                                 /* 开花的：绿叶丘顶几朵花 */
      mound(b, x, y, z, r, r * .75, mix3(C.leaf, C.leafD, R() * .6));
      for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + R(), d = r * .45; b.pyramid(x + Math.cos(a) * d, y + r * .6 + R() * .02, z + Math.sin(a) * d, .036, .036, .025, pick(HC[kind]), { k: 1.1 }); }
    }
  }
  function shrooms(b, x, z, n, col, y) {                      /* 萤光蘑菇：淡淡的（e .3） */
    y = y || 0;
    for (let i = 0; i < n; i++) {
      const a = R() * TAU, d = i ? .03 + R() * .05 : 0, px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d, h = .03 + R() * .045 + (i ? 0 : .02), r = .018 + R() * .014 + (i ? 0 : .01);
      b.cyl(px, y, pz, r * .32, h, 4, [.86, .84, .78], { nt: true, nb: true });
      b.cyl(px, y + h - r * .15, pz, r, r * .75, 5, col, { r2: r * .22, e: .3, bot: mix3(col, C.white, .45) });
    }
  }

  /* ---------- 料石边花坛 ---------- */
  function bed(b, X, Z, w, d, kind, cy, n) {
    reseed(200 + n * 13);
    const t = .075, y0 = -.08, yt = .13, iw = w - t * 2, id = d - t * 2, hx = w / 2 - t / 2, hz = d / 2 - t / 2;
    b.at(X, 0, Z);
    b.box(0, y0, 0, iw + .01, .19, id + .01, SOIL, { nb: true, top: SOILT });
    const side = (x0, z0, x1, z1) => {
      const L = Math.hypot(x1 - x0, z1 - z0), ux = (x1 - x0) / L, uz = (z1 - z0) / L;
      let s = 0;
      while (s < L - 1e-4) {
        let len = .15 + R() * .12; if (L - s - len < .08) len = L - s;
        const m = s + len / 2, c = curbC(), lx = Math.abs(ux) * (len - .008) + Math.abs(uz) * t, lz = Math.abs(uz) * (len - .008) + Math.abs(ux) * t;
        b.box(x0 + ux * m, y0, z0 + uz * m, lx, yt - y0 + (R() - .5) * .014, lz, mix3(c, STD, .25), { nb: true, top: c });
        s += len;
      }
    };
    side(-hx + t / 2, hz, hx - t / 2, hz); side(-hx + t / 2, -hz, hx - t / 2, -hz);
    side(hx, -hz + t / 2, hx, hz - t / 2); side(-hx, -hz + t / 2, -hx, hz - t / 2);
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      b.box(sx * hx, y0, sz * hz, t + .03, yt - y0 + .035, t + .03, mix3(DRESS2, STD, .2), { nb: true, top: DRESS });
      b.pyramid(sx * hx, yt + .035, sz * hz, t + .01, t + .01, .045, DRESS2);
    }
    const y = .11, g = kind === "man" || kind === "fern" ? 2 : 3, gx = iw / g, gz = id / g;
    const jar = cy && (n % 3 === 1) ? [Math.floor(R() * g), Math.floor(R() * g)] : null;
    for (let i = 0; i < g; i++) for (let j = 0; j < g; j++) {
      const x = -iw / 2 + gx * (i + .5) + (R() - .5) * gx * .22, z = -id / 2 + gz * (j + .5) + (R() - .5) * gz * .22;
      if (kind === "shroom") { if ((i + j) % 2 === 0) shrooms(b, x, z, 3, MUSH[(i + j) % 4 ? 1 : 0], y); else mound(b, x, y, z, gx * .34, gx * .2, mix3([.36, .5, .3], C.ivy, R())); continue; }
      herb(b, kind, x, y, z, Math.min(gx, gz));
      if (jar && jar[0] === i && jar[1] === j) {               /* 2077：玻璃钟罩罩着一棵 */
        b.sphere(x, y, z, Math.min(gx, gz) * .48, 8, GLS, { mat: "glass", sy: 1.25 });
        b.sphere(x, y + Math.min(gx, gz) * .6, z, .016, 4, BRASS, M);
      }
    }
    /* 木签名牌 */
    const lx = -iw / 2 + .03, lz = id / 2 - .01;
    rod(b, [lx, .06, lz], [lx, .21, lz], .014, OLDWD);
    b.at(lx, .17, lz + .01, -.2); b.box(0, 0, 0, .07, .04, .008, [.88, .83, .7]); b.box(0, .012, .0045, .045, .006, .002, [.3, .24, .2]); b.pop();
    b.pop();
  }

  /* ---------- 日晷／浑天仪 ---------- */
  function sundial(b, x, z, cy) {
    reseed(17);
    b.at(x, 0, z);
    b.cyl(0, -.04, 0, .125, .07, 8, mix3(DRESS2, STD, .2), { a0: PI / 8, nb: true, top: DRESS });
    b.cyl(0, .03, 0, .085, .04, 8, DRESS2, { a0: PI / 8, nb: true, top: DRESS });
    b.cyl(0, .07, 0, .05, .26, 8, mix3(DRESS, ST2, .3), { r2: .042, nt: true, nb: true, a0: PI / 8 });
    b.cyl(0, .12, 0, .056, .025, 8, DRESS2, { nt: true, nb: true, a0: PI / 8 });
    b.cyl(0, .31, 0, .043, .04, 8, DRESS2, { r2: .08, nt: true, nb: true, a0: PI / 8 });
    b.cyl(0, .35, 0, .085, .03, 8, DRESS, { nb: true, a0: PI / 8 });
    if (!cy) {
      b.cyl(0, .38, 0, .066, .008, 10, BRASS, { mat: "metal", nb: true });
      for (let i = 0; i < 4; i++) { const a = i / 4 * TAU; b.box(Math.cos(a) * .052, .388, Math.sin(a) * .052, .012, .003, .012, [.25, .2, .14], { nb: true }); }
      tf(b, [0, .388, -.05], [0, .388, .045], [0, .45, -.045], BRASS, [1, 0, 0], M); tf(b, [0, .388, -.05], [0, .388, .045], [0, .45, -.045], BRASS, [-1, 0, 0], M);
    } else {
      b.beam([0, .38, 0], [0, .44, 0], .022, BRASS, M);
      b.at(0, .56, 0, 0, 1, .41);                               /* 斜轴 */
      b.beam([0, -.15, 0], [0, .15, 0], .01, BRASS, M);
      b.spin(0, 0, 0, "y", .35, sb => {
        sb.torus(0, 0, 0, .12, .007, 16, 3, BRASS, M);
        sb.at(0, 0, 0, 0, 1, PI / 2); sb.torus(0, 0, 0, .12, .007, 16, 3, BRASS, M); sb.pop();
        sb.at(0, 0, 0, PI / 2, 1, PI / 2); sb.torus(0, 0, 0, .115, .006, 16, 3, mix3(BRASS, C.gold, .4), M); sb.pop();
        sb.at(0, 0, 0, 0, 1, .41); sb.torus(0, 0, 0, .1, .012, 16, 3, mix3(BRASS, [.3, .22, .14], .3), M); sb.pop();
        sb.sphere(0, 0, 0, .03, 6, [.35, .55, .8], { mat: "gloss" });
      });
      b.pop();
    }
    b.pop();
  }

  /* ---------- 维多利亚小玻璃温室（铸铁框） ---------- */
  function glasshouse(b, X, Z, ry, cy) {
    reseed(61);
    const W = .76, D = 1.0, yb = .22, ye = .62, yr = .95, t = .022, dw = .26, wt = .07, CR = cy ? BRASS : IRN;
    const fm = (p, q, w, c) => rod(b, p, q, w || t, c || IRN, M);
    b.at(X, 0, Z, ry);
    b.box(0, -.1, 0, W - .02, .115, D - .02, FLOOR, { nb: true });
    b.at(0, 0, -D / 2, PI); stoneWall(b, -W / 2, W / 2, -.08, yb, wt, { ql: true, qr: true }); b.pop();
    for (const s of [-1, 1]) { b.at(s * W / 2, 0, 0, s * PI / 2); stoneWall(b, -D / 2, D / 2, -.08, yb, wt, { ql: true, qr: true }); b.pop(); }
    b.at(0, 0, D / 2); stoneWall(b, -W / 2, -dw / 2, -.08, yb, wt, { ql: true }); stoneWall(b, dw / 2, W / 2, -.08, yb, wt, { qr: true }); b.pop();
    /* 玻璃 */
    for (const s of [-1, 1]) {
      b.quad([s * W / 2, yb, -D / 2], [s * W / 2, yb, D / 2], [s * W / 2, ye, D / 2], [s * W / 2, ye, -D / 2], GLS, GL);
      b.tri([-W / 2, ye, s * D / 2], [W / 2, ye, s * D / 2], [0, yr, s * D / 2], GLS, GL);
      b.quad([s * (W / 2 + .04), ye - .035, -D / 2 - .04], [s * (W / 2 + .04), ye - .035, D / 2 + .04], [0, yr, D / 2 + .04], [0, yr, -D / 2 - .04], GLS, GL);
    }
    b.quad([-W / 2, yb, -D / 2], [W / 2, yb, -D / 2], [W / 2, ye, -D / 2], [-W / 2, ye, -D / 2], GLS, GL);
    for (const s of [-1, 1]) b.quad([s * dw / 2, yb, D / 2], [s * W / 2, yb, D / 2], [s * W / 2, ye, D / 2], [s * dw / 2, ye, D / 2], GLS, GL);
    b.quad([-dw / 2, .52, D / 2], [dw / 2, .52, D / 2], [dw / 2, ye, D / 2], [-dw / 2, ye, D / 2], GLS, GL);
    /* 铁框 */
    const nz = 4;
    for (const s of [-1, 1]) {
      for (let i = 0; i <= nz; i++) { const z = -D / 2 + i * D / nz; fm([s * W / 2, yb, z], [s * W / 2, ye, z]); fm([s * (W / 2 + .04), ye - .035, z], [0, yr, z], .018); }
      fm([s * W / 2, ye, -D / 2 - .04], [s * W / 2, ye, D / 2 + .04], .03);
      fm([s * W / 2, (yb + ye) / 2 + .04, -D / 2], [s * W / 2, (yb + ye) / 2 + .04, D / 2], .012);
      fm([-W / 2, ye, s * D / 2], [W / 2, ye, s * D / 2], .026);
      fm([s * W / 4, yb, -D / 2], [s * W / 4, ye, -D / 2], .016);
      fm([0, ye, -D / 2], [0, yr, -D / 2], .016);
      fm([s * dw / 2, 0, D / 2 + .005], [s * dw / 2, .52, D / 2 + .005], .026);
      fm([s * dw / 2, .52, D / 2 + .005], [0, .6, D / 2 + .005], .018);
    }
    fm([-dw / 2, .52, D / 2 + .005], [dw / 2, .52, D / 2 + .005], .022);
    fm([0, .6, D / 2 + .005], [0, yr, D / 2 + .005], .016);
    fm([0, yr, -D / 2 - .04], [0, yr, D / 2 + .04], .032);
    /* 玻璃门（半开）、黄铜把手 */
    b.at(-dw / 2 + .01, 0, D / 2 + .01, -.55);
    b.quad([0, .02, 0], [dw - .03, .02, 0], [dw - .03, .5, 0], [0, .5, 0], GLS, GL);
    fm([0, .02, 0], [0, .5, 0], .018); fm([dw - .03, .02, 0], [dw - .03, .5, 0], .018); fm([0, .5, 0], [dw - .03, .5, 0], .018); fm([0, .02, 0], [dw - .03, .02, 0], .03); fm([0, .24, 0], [dw - .03, .24, 0], .014);
    b.box(dw - .07, .26, .012, .018, .018, .018, BRASS, M);
    b.pop();
    /* 屋脊铁花、两头尖顶饰 */
    for (let z = -D / 2 + .06; z < D / 2 - .03; z += .09) b.pyramid(0, yr + .012, z, .008, .035, .055, CR, M);
    for (const s of [-1, 1]) { b.sphere(0, yr + .045, s * (D / 2 + .04), .022, 4, CR, M); b.cone(0, yr + .05, s * (D / 2 + .04), .012, .14, 4, CR, M); }
    /* 里面：两侧花架、盆栽、后头一棵树蕨 */
    for (const s of [-1, 1]) {
      b.box(s * .2, .27, -.03, .2, .025, D - .24, OLDW, { top: mix3(OLDW, C.woodL, .2) });
      for (const z of [-.36, .3]) b.beam([s * .2, 0, z], [s * .2, .27, z], .025, OLDWD);
      for (let i = 0; i < 3; i++) {
        const z = -.34 + i * .27, pc = mix3(TERRA, TERRA2, R());
        b.cyl(s * .2, .295, z, .035, .055, 5, pc, { r2: .045, nb: true, top: SOIL });
        const tt = R(), lc = tt < .45 ? mix3(C.leaf, C.leaf2, R()) : tt < .7 ? mix3([.6, .7, .62], C.leaf, .3) : tt < .85 ? pick(HC.pink) : pick(HC.lav);
        if (tt < .7) b.sphere(s * .2, .39, z, .055 + R() * .02, 5, lc, { sy: .85 }); else { b.sphere(s * .2, .38, z, .045, 5, C.leaf, { sy: .8 }); b.box(s * .2, .41, z, .04, .025, .04, lc, { nb: true }); }
      }
    }
    b.cyl(0, 0, -.32, .016, .5, 4, C.woodD, { nt: true });
    for (let i = 0; i < 7; i++) leaf(b, 0, .5, -.32, i / 7 * TAU + .3, .24, .055, -.05, mix3(C.leaf2, C.leafD, R() * .5));
    if (cy) b.emit(0, .72, .08, "cat", 1, .8);
    b.pop();
  }

  /* ---------- 炼药小屋（Lv2+） ---------- */
  function cauldron(b, x, z, cy) {
    b.at(x, 0, z);
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + .4; b.beam([Math.cos(a) * .11, 0, Math.sin(a) * .11], [Math.cos(a) * .08, .1, Math.sin(a) * .08], .02, IRN, M); }
    for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + 1.1; b.beam([Math.cos(a) * .17, .015, Math.sin(a) * .17], [Math.cos(a + 2.4) * .17, .015, Math.sin(a + 2.4) * .17], .035, mix3(C.woodD, OLDWD, .5)); }
    b.cyl(0, .02, 0, .1, .02, 6, [.24, .2, .2], { nb: true });
    b.cyl(0, .06, 0, .07, .06, 8, IRN, { r2: .125, mat: "metal" });
    b.cyl(0, .12, 0, .125, .07, 8, IRN, { r2: .108, nt: true, nb: true, mat: "metal" });
    b.cyl(0, .19, 0, .112, .018, 8, IRN, { r2: .118, nt: true, nb: true, mat: "metal" });
    b.disc(0, .185, 0, .11, 8, [.36, .7, .42], { e: .25 });
    b.sphere(.03, .19, .02, .02, 4, [.5, .82, .55], { e: .25 }); b.sphere(-.04, .19, -.03, .014, 4, [.5, .82, .55], { e: .25 });
    for (const s of [-1, 1]) b.box(s * .12, .17, 0, .02, .03, .02, cy ? BRASS : IRN, M);
    b.beam([.02, .14, 0], [.12, .44, .06], .018, OLDW);
    b.emit(0, .26, 0, "steam", 4, .6);
    b.pop();
  }
  function bundle(b, x, y, z, col, L) {                      /* 倒吊的药草束 */
    L = L || .16;
    rod(b, [x, y, z], [x, y - .05, z], .007, ROPE);
    b.cone(x, y - .05, z, .022, .035, 4, mix3(C.woodD, C.leafD, .3), { nb: true });
    b.at(x, y - .06, z, R() * TAU, 1, PI); b.cone(0, 0, 0, .04, L, 5, col, { k: 1.1 }); b.pop();
  }
  const BUND = () => pick([mix3(C.leafD, C.leaf, .4), [.55, .62, .5], HC.lav[1], mix3(C.hay, C.leaf, .35), [.62, .4, .55], mix3(C.leaf, C.hay, .5)]);
  function hut(b, X, Z, cy) {
    reseed(21);
    const W = 1.0, D = .66, P0 = .08, Hw = .7, Hr = .5, yR = Hw + Hr, sl = Hr / (D / 2), ov = .09, zf = D / 2;
    b.at(X, 0, Z);
    b.box(0, -.14, 0, W + .1, P0 + .14, D + .1, STD, { top: DRESS2, nb: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, zf, { ql: true, qr: true });
    mason(b, () => [-W / 2, W / 2], P0, Hw, -zf, { back: true, ql: true, qr: true });
    const gab = y => { const h = Math.min(D / 2, (yR + .06 - y) / sl); return [-h, h]; };
    for (const s of [-1, 1]) {
      b.at(s * W / 2, 0, 0, s * PI / 2);
      mason(b, () => [-D / 2, D / 2], P0, Hw, 0, { ql: true, qr: true });
      mason(b, gab, Hw, yR + .06, 0, {});
      if (s < 0) lancet(b, 0, .3, 0, .11, .2);
      b.pop();
      for (const f of [-1, 1]) {
        b.beam([s * W / 2, Hw - .03, f * (D / 2 + .08)], [s * W / 2, yR + .09, 0], .085, DRESS);
        b.box(s * W / 2, Hw - .12, f * (D / 2 + .03), .12, .15, .16, DRESS2, { nb: true });
      }
    }
    b.box(-W / 2, yR + .07, 0, .09, .06, .09, DRESS); b.pyramid(-W / 2, yR + .13, 0, .09, .09, .15, DRESS2);
    /* 石板瓦顶 */
    const ze = D / 2 + ov, ye = Hw - ov * sl, nb = 5, xr = W / 2;
    for (const s of [-1, 1]) {
      for (let i = 0; i < nb; i++) {
        const t0 = i / nb, t1 = (i + 1) / nb, za = s * ze * (1 - t0), zb = s * ze * (1 - t1), ya = ye + (yR - ye) * t0, yb = ye + (yR - ye) * t1;
        qf(b, [-xr, ya, za], [xr, ya, za], [xr, yb, zb], [-xr, yb, zb], i % 2 ? SL : SLM, [0, 1, s]);
      }
      qf(b, [-xr, ye, s * ze], [xr, ye, s * ze], [xr, Hw, s * zf], [-xr, Hw, s * zf], OLDWD, [0, -1, 0]);
      b.beam([-xr, ye - .012, s * ze], [xr, ye - .012, s * ze], .03, OLDWD);
    }
    b.beam([-xr, yR + .01, 0], [xr, yR + .01, 0], .05, SL2);
    /* 小老虎窗（后坡不做） */
    const dx = -.2, dz = zf * .45, dy = ye + (yR - ye) * (1 - dz / ze);
    b.box(dx, dy - .1, dz + .02, .2, .2, .16, sc(1), { nb: true });
    b.at(dx, dy - .08, dz + .1); fan(b, outline(.1, .08, 0, .72), .002, WIN, { e: .5 }); b.pop();
    b.gable(dx, dy + .1, dz + .02, .26, .2, .1, SL, { end: SL2 });
    b.at(dx, 0, 0, PI / 2); b.gable(-(dz + .02), dy + .1, 0, .2, .26, .1, SL, { end: sc(1) }); b.pop();
    /* 外烟囱（右山墙），冒蒸汽 */
    const cx = W / 2 + .06, ch = yR + .3;
    for (let y = -.12, j = 0; y < ch - .01; j++) {
      const wide = y < Hw - .2, h = Math.min(wide ? .15 : .13, ch - y);
      b.box(cx + (wide ? .015 : 0), y, 0, wide ? .24 : .19, h, wide ? .3 : .22, sc(y), { nb: true, top: DRESS2 });
      y += h;
    }
    b.box(cx, ch, 0, .24, .04, .27, DRESS, { nb: true });
    for (const z of [-.05, .05]) b.cyl(cx, ch + .04, z, .034, .1, 6, z < 0 ? TERRA : TERRA2, { r2: .03, top: [.12, .1, .1] });
    b.emit(cx, ch + .18, 0, "steam", 9, 1);
    /* 正门：尖拱料石框、铁钉木门、踏石 */
    b.at(.2, P0, zf);
    prism(b, outline(.36, .3, 0, .6, 4), -.03, .035, DRESS);
    b.at(0, 0, .038); door(b, .27, .3, .6, { planks: 4, straps: [.06, .23], ring: true }); b.pop();
    b.pop();
    b.box(.2, -.1, zf + .1, .44, .17, .16, DRESS2, { nb: true, top: mix3(DRESS2, C.stone, .4) });
    /* 尖拱窗、窗下药瓶架 */
    lancet(b, -.22, .3, zf, .13, .2);
    b.box(-.22, .21, zf + .05, .26, .025, .08, OLDW);
    for (const s of [-1, 1]) b.beam([-.22 + s * .1, .21, zf + .01], [-.22 + s * .1, .16, zf + .01], .018, OLDWD);
    for (const [ox, col, h] of [[-.08, [.32, .62, .36], .07], [-.01, [.5, .34, .7], .055], [.06, [.8, .5, .2], .065]]) {
      b.cyl(-.22 + ox, .235, zf + .05, .02, h, 5, col, { r2: .016, mat: "gloss" });
      b.cyl(-.22 + ox, .235 + h, zf + .05, .008, .025, 4, col, { mat: "gloss" });
      b.box(-.22 + ox, .235 + h + .022, zf + .05, .016, .01, .016, OLDWD);
    }
    /* 屋檐下吊的药草束 */
    for (const x of [-.44, -.36, .44]) bundle(b, x, ye - .02, zf + .045, BUND(), .13);
    /* 门边提灯、常春藤 */
    b.beam([.44, .6, zf], [.44, .6, zf + .14], .02, cy ? BRASS : C.iron, M);
    b.beam([.44, .6, zf + .13], [.44, .55, zf + .13], .01, C.iron, M);
    lantern(b, .44, .35, zf + .13, cy);
    ivy(b, -.42, P0, zf, .2, .5, 18);
    b.at(-W / 2, 0, 0, -PI / 2); ivy(b, .2, P0, 0, .25, .55, 14); b.pop();
    /* 后墙：尖拱小窗、靠墙一垛柴 */
    b.at(0, 0, -zf, PI); lancet(b, .18, .32, 0, .1, .18);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) { b.at(-.36 + (i + r * .5) * .095, .045 + r * .08, .07, 0, 1, PI / 2); b.cyl(0, -.12, 0, .042, .24, 5, mix3(C.woodD, C.wood, R() * .5), { top: mix3(C.woodL, C.hay, .3), bot: mix3(C.woodL, C.hay, .3), a0: R() }); b.pop(); }
    b.pop();
    b.pop();
  }

  /* ---------- 晒药架、晒药簸箕 ---------- */
  function rack(b, X, Z, ry, L, cy) {
    reseed(81);
    const H = .74;
    b.at(X, 0, Z, ry);
    for (const s of [-1, 1]) {
      b.beam([s * L / 2, 0, -.21], [s * L / 2, H + .02, 0], .035, OLDWD);
      b.beam([s * L / 2, 0, .21], [s * L / 2, H + .02, 0], .035, OLDWD);
      rod(b, [s * L / 2, .22, -.15], [s * L / 2, .22, .15], .025, OLDW);
    }
    b.beam([-L / 2 - .07, H - .02, 0], [L / 2 + .07, H - .02, 0], .036, OLDW);
    for (const f of [-1, 1]) rod(b, [-L / 2, .46, f * .078], [L / 2, .46, f * .078], .026, OLDW);
    const nT = Math.max(3, Math.round(L / .14)), nL = Math.max(2, Math.round(L / .2));
    for (let i = 0; i < nT; i++) bundle(b, -L / 2 + .07 + i * (L - .14) / (nT - 1), H - .04, 0, BUND(), .15 + R() * .05);
    for (const f of [-1, 1]) for (let i = 0; i < nL; i++) bundle(b, -L / 2 + .1 + (i + (f > 0 ? .5 : 0)) * (L - .2) / nL, .44, f * .078, BUND(), .12 + R() * .04);
    /* 架下一只藤篮 */
    b.cyl(L * .2, 0, .02, .09, .09, 7, WICKD, { r2: .11, top: mix3(C.leaf, C.hay, .4) });
    b.beam([L * .2 - .1, .09, .02], [L * .2, .19, .02], .012, WICK); b.beam([L * .2, .19, .02], [L * .2 + .1, .09, .02], .012, WICK);
    b.pop();
  }
  function trays(b, X, Z, ry) {                              /* 簸箕架：木架上叠两只摊着药材的圆簸箕，地上靠一只 */
    reseed(83);
    b.at(X, 0, Z, ry);
    for (const [x, z] of [[-.17, -.12], [.17, -.12], [.17, .12], [-.17, .12]]) b.beam([x, 0, z], [x * .9, .44, z * .9], .025, OLDWD);
    for (const y of [.24, .44]) { b.beam([-.2, y, 0], [.2, y, 0], .02, OLDW); b.beam([0, y, -.14], [0, y, .14], .02, OLDW); }
    const tray = (x, y, z, col) => {
      b.cyl(x, y, z, .2, .035, 9, WICK, { nt: true, bot: WICKD });
      b.ring(x, y + .035, z, .2, .175, 9, WICKD);
      b.disc(x, y + .02, z, .178, 9, col);
      for (let i = 0; i < 4; i++) { const a = R() * TAU, d = R() * .13; b.pyramid(x + Math.cos(a) * d, y + .02, z + Math.sin(a) * d, .04, .03, .012, mix3(col, R() < .5 ? C.white : C.woodD, .3)); }
    };
    tray(0, .25, 0, mix3([.62, .48, .3], C.leaf, .25)); tray(0, .45, 0, mix3([.55, .58, .36], [.62, .4, .55], .3));
    b.at(.12, 0, .3, 0, 1, -1.25); tray(0, -.03, 0, mix3([.7, .5, .22], C.hay, .3)); b.pop();
    b.pop();
  }

  /* ---------- 大陶罐 ---------- */
  function urn(b, x, z, s, kind, cy) {
    reseed(300 + Math.round((x * 7 + z * 13) * 10));
    b.at(x, 0, z, R() * TAU, s);
    const glaze = kind === "jar", body = glaze ? [.3, .22, .17] : mix3(TERRA, TERRA2, R() * .4), band = glaze ? [.36, .27, .2] : TERRA2, rimC = glaze ? [.3, .21, .15] : TERRAL;
    const o = glaze ? { mat: "gloss" } : {};
    const P = glaze ? [[.11, 0], [.19, .14], [.2, .24], [.17, .33], [.11, .38], [.1, .4]] : [[.095, 0], [.16, .13], [.17, .23], [.145, .31], [.105, .35], [.1, .37]];
    for (let k = 0; k < P.length - 1; k++) b.cyl(0, P[k][1], 0, P[k][0], P[k + 1][1] - P[k][1], 8, k === 2 ? band : body, Object.assign({ r2: P[k + 1][0], nt: true, nb: k > 0 }, o));
    const yT = P[P.length - 1][1];
    if (cy && !glaze) b.cyl(0, .2, 0, .172, .03, 8, BRASS, { r2: .17, nt: true, nb: true, mat: "metal" });
    if (glaze) {                                             /* 药坛：布盖扎麻绳、木塞把 */
      b.cyl(0, yT, 0, .125, .04, 8, [.8, .74, .62], { r2: .11 });
      b.cyl(0, yT + .01, 0, .105, .015, 8, ROPE, { nt: true, nb: true });
      b.sphere(0, yT + .055, 0, .03, 5, [.8, .74, .62], { sy: .7 });
    } else {
      b.cyl(0, yT, 0, .125, .03, 8, rimC, { nt: true, nb: true });
      b.ring(0, yT + .03, 0, .125, .095, 8, rimC);
      b.disc(0, yT + .015, 0, .1, 8, SOIL);
      const y = yT + .015;
      if (kind === "bay") {                                  /* 月桂球 */
        b.cyl(0, y, 0, .014, .2, 4, C.woodD, { nt: true });
        b.sphere(0, y + .28, 0, .13, 6, mix3(C.leafD, C.leaf, .35), { sy: .95, k: 1.1 });
        b.sphere(.04, y + .33, .03, .07, 5, mix3(C.leaf, C.leaf2, .4), { k: 1.12 });
      } else if (kind === "spiky") {                         /* 芦荟 */
        for (let i = 0; i < 8; i++) leaf(b, 0, y, 0, i / 8 * TAU + R() * .3, .13 + R() * .06, .025, .16 + R() * .1, mix3([.42, .6, .48], [.5, .66, .55], R()));
        for (let i = 0; i < 3; i++) leaf(b, 0, y, 0, i / 3 * TAU + .5, .06, .02, .26, [.45, .62, .5]);
      } else if (kind === "trail") {                         /* 垂藤 */
        b.sphere(0, y + .05, 0, .11, 5, mix3(C.leaf, C.leafD, .4), { sy: .6, k: 1.08 });
        for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + R(), r = .12; b.beam([Math.cos(a) * r, y + .02, Math.sin(a) * r], [Math.cos(a) * (r + .06), y - .2 - R() * .1, Math.sin(a) * (r + .06)], .03, mix3(C.leaf, C.ivy, R()), { k: 1.15 }); }
        for (let i = 0; i < 3; i++) b.box((R() - .5) * .14, y + .1, (R() - .5) * .14, .03, .02, .03, pick(HC.pink), { nb: true });
      } else {                                               /* 花丛 */
        b.sphere(0, y + .06, 0, .12, 5, mix3(C.leaf, C.leafD, .3), { sy: .7, k: 1.08 });
        for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + R(), d = .06 + R() * .03; b.box(Math.cos(a) * d, y + .12 + R() * .02, Math.sin(a) * d, .035, .022, .035, pick(HC.gold), { nb: true }); }
      }
    }
    b.pop();
  }
  function flowerpots(b, x, z) {                             /* 一摞空花盆 */
    for (let i = 0; i < 4; i++) b.cyl(x, i * .03, z, .045, .06, 6, i % 2 ? TERRA : TERRA2, { r2: .055, nt: i < 3 });
    b.at(x + .12, .03, z + .02, .4, 1, 0, 1.4); b.cyl(0, -.03, 0, .045, .06, 6, TERRA, { r2: .055 }); b.pop();
  }
  function wateringCan(b, x, z, ry, cy) {
    const col = cy ? BRASS : [.55, .6, .58];
    b.at(x, 0, z, ry);
    b.cyl(0, 0, 0, .05, .1, 8, col, { r2: .045, mat: "metal" });
    b.beam([.035, .02, 0], [.13, .12, 0], .014, col, M);
    b.cyl(.13, .115, 0, .014, .02, 5, col, { r2: .022, mat: "metal" });
    b.beam([-.035, .1, 0], [-.01, .15, 0], .012, col, M); b.beam([-.01, .15, 0], [.035, .1, 0], .012, col, M);
    b.pop();
  }

  /* ---------- 大玻璃暖房（Lv3，1994）：尖拱铁窗格、玻璃坡顶、八角玻璃塔＋尖顶、前出门廊 ---------- */
  function palm(b, x, z, H, cy) {
    for (let i = 0; i < 4; i++) { const y0 = i * H / 4, y1 = (i + 1) * H / 4, bx = Math.sin(i * .8) * .02; b.cyl(x + bx, y0, z, .03 - i * .003, y1 - y0 + .01, 5, i % 2 ? C.woodD : mix3(C.woodD, C.wood, .4), { r2: .026 - i * .003, nt: true, nb: true }); }
    for (let i = 0; i < 8; i++) leaf(b, x, H, z, i / 8 * TAU + R() * .3, .34 + R() * .08, .07, -.09 - R() * .06, mix3(C.leaf2, C.leafD, R() * .6), { k: 1.12 });
    for (let i = 0; i < 3; i++) leaf(b, x, H, z, i / 3 * TAU + .6, .14, .04, .2, C.leaf2, { k: 1.12 });
  }
  function interior(b, W, D, yb, n) {                         /* 暖房里：沿墙的花槽、大叶丛、几株开花的 */
    for (const s of [-1, 1]) {
      b.box(0, yb, s * (D / 2 - .12), W - .2, .1, .14, STD, { nb: true, top: SOIL });
      for (let i = 0; i < n; i++) {
        const x = -W / 2 + .17 + i * (W - .34) / (n - 1), z = s * (D / 2 - .12), tt = R();
        if (tt < .4) b.sphere(x, yb + .17, z, .1 + R() * .04, 5, mix3(C.leaf, C.leafD, R()), { sy: .9, k: 1.08 });
        else if (tt < .7) for (let k = 0; k < 5; k++) leaf(b, x, yb + .1, z, k / 5 * TAU + R(), .14, .05, .18, mix3(C.leaf2, C.leafD, R() * .5));
        else { b.sphere(x, yb + .15, z, .09, 5, mix3(C.leaf, C.leafD, .4), { sy: .8 }); for (let k = 0; k < 3; k++) b.box(x + (R() - .5) * .1, yb + .22, z + (R() - .5) * .08, .035, .025, .035, pick(R() < .5 ? HC.pink : HC.red), { nb: true }); }
      }
    }
  }
  function conservatory(b, X, Z) {
    reseed(71);
    const W = 1.5, D = .96, yb = .22, ye = .84, yr = 1.22, t = .026, nb = 6, bw = W / nb;
    const fm = (p, q, w) => rod(b, p, q, w || t, IRN, M);
    b.at(X, 0, Z);
    /* 石基座 */
    b.box(0, -.12, 0, W, yb + .12, D, STD, { nb: true, top: FLOOR });
    b.at(0, 0, D / 2); mason(b, () => [-W / 2, W / 2], -.1, yb, .002, { rh: .11, ql: true, qr: true }); b.pop();
    b.at(0, 0, -D / 2, PI); mason(b, () => [-W / 2, W / 2], -.1, yb, .002, { rh: .11, ql: true, qr: true }); b.pop();
    for (const s of [-1, 1]) { b.at(s * W / 2, 0, 0, s * PI / 2); mason(b, () => [-D / 2, D / 2], -.1, yb, .002, { rh: .11, ql: true, qr: true }); b.pop(); }
    for (const s of [-1, 1]) { b.box(0, yb - .01, s * D / 2, W + .08, .035, .07, DRESS, { nb: true }); b.box(s * W / 2, yb - .01, 0, .07, .035, D + .08, DRESS, { nb: true }); }
    /* 玻璃 */
    for (const s of [-1, 1]) {
      b.quad([-W / 2, yb, s * D / 2], [W / 2, yb, s * D / 2], [W / 2, ye, s * D / 2], [-W / 2, ye, s * D / 2], GLS, GL);
      b.quad([s * W / 2, yb, -D / 2], [s * W / 2, yb, D / 2], [s * W / 2, ye, D / 2], [s * W / 2, ye, -D / 2], GLS, GL);
      b.tri([s * W / 2, ye, -D / 2], [s * W / 2, ye, D / 2], [s * W / 2, yr, 0], GLS, GL);
      b.quad([-W / 2 - .04, ye - .03, s * (D / 2 + .04)], [W / 2 + .04, ye - .03, s * (D / 2 + .04)], [W / 2 + .04, yr, 0], [-W / 2 - .04, yr, 0], GLS, GL);
    }
    /* 长墙：每开间尖拱窗格 */
    for (const s of [-1, 1]) {
      const z = s * (D / 2 + .004);
      for (let i = 0; i <= nb; i++) { const x = -W / 2 + i * bw; fm([x, yb, z], [x, ye, z]); fm([x, ye - .03, s * (D / 2 + .04)], [x, yr, 0], .02); }
      for (let i = 0; i < nb; i++) {
        const x0 = -W / 2 + i * bw, x1 = x0 + bw, xm = (x0 + x1) / 2;
        fm([x0 + .01, ye - .17, z], [xm, ye - .045, z], .014); fm([x1 - .01, ye - .17, z], [xm, ye - .045, z], .014);
        fm([xm, yb, z], [xm, ye - .045, z], .011);
      }
      fm([-W / 2 - .02, ye, z], [W / 2 + .02, ye, z], .034);
      fm([-W / 2, yb + .015, z], [W / 2, yb + .015, z], .028);
      fm([-W / 2, yb + .2, z], [W / 2, yb + .2, z], .012);
      b.beam([-W / 2 - .04, ye - .05, s * (D / 2 + .06)], [W / 2 + .04, ye - .05, s * (D / 2 + .06)], .04, IRN, M);   /* 檐沟 */
    }
    /* 两头山墙：竖棂、王柱、玫瑰窗 */
    for (const s of [-1, 1]) {
      const x = s * (W / 2 + .004);
      for (const z of [-D / 4, 0, D / 4]) fm([x, yb, z], [x, ye, z], .014);
      fm([x, ye, -D / 2], [x, ye, D / 2], .03);
      fm([x, yb + .2, -D / 2], [x, yb + .2, D / 2], .012);
      b.at(x, ye + .13, 0, 0, 1, 0, PI / 2); b.torus(0, 0, 0, .09, .012, 12, 3, IRN, M); b.pop();
      for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; fm([x, ye + .13, 0], [x, ye + .13 + Math.sin(a) * .085, Math.cos(a) * .085], .008); }
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const p = [sx * (W / 2 + .01), ye + .01, sz * (D / 2 + .01)]; b.cyl(p[0], p[1], p[2], .03, .05, 4, IRN, { mat: "metal", a0: PI / 4 }); b.cone(p[0], p[1] + .05, p[2], .022, .2, 4, IRN, { mat: "metal", a0: PI / 4 }); b.sphere(p[0], p[1] + .08, p[2], .02, 4, IRN, M); }
    /* 屋脊铁花 */
    fm([-W / 2 - .04, yr, 0], [W / 2 + .04, yr, 0], .034);
    for (let x = -W / 2 + .05; x < W / 2 - .02; x += .085) if (Math.abs(x) > .4) b.pyramid(x, yr + .012, 0, .035, .008, .055, IRN, M);
    for (const s of [-1, 1]) { b.sphere(s * (W / 2 + .04), yr + .045, 0, .024, 4, IRN, M); b.cone(s * (W / 2 + .04), yr + .05, 0, .013, .15, 4, IRN, M); }
    /* 正中八角玻璃塔、高玻璃尖顶 */
    const rT = .32, y0t = yr - .16, y1t = yr + .36, a8 = PI / 8, P8 = (i, r, y) => [Math.cos(a8 + i / 8 * TAU) * r, y, Math.sin(a8 + i / 8 * TAU) * r];
    b.cyl(0, y0t, 0, rT, y1t - y0t, 8, GLS, { nt: true, nb: true, a0: a8, mat: "glass" });
    for (let i = 0; i < 8; i++) {
      fm(P8(i, rT, y0t), P8(i, rT, y1t));
      const A = P8(i, rT, y1t - .14), B2 = P8(i + 1, rT, y1t - .14), Mm = [(A[0] + B2[0]) / 2, y1t - .04, (A[2] + B2[2]) / 2];
      fm(A, Mm, .012); fm(B2, Mm, .012);
      b.cone(...P8(i, rT + .01, y1t + .03), .014, .11, 3, IRN, M);
    }
    b.cyl(0, y1t - .02, 0, rT + .02, .05, 8, IRN, { nt: true, nb: true, a0: a8, mat: "metal" });
    b.cyl(0, y0t + .14, 0, rT + .012, .03, 8, IRN, { nt: true, nb: true, a0: a8, mat: "metal" });
    const sH = .85, yS = y1t + .03, apex = yS + sH;
    b.cone(0, yS, 0, rT + .03, sH, 8, GLS, { a0: a8, nb: true, mat: "glass" });
    for (let i = 0; i < 8; i++) fm(P8(i, rT + .03, yS), [0, apex, 0], .02);
    for (const f of [.3, .62]) b.cyl(0, yS + sH * f, 0, (rT + .045) * (1 - f), .03, 8, IRN, { r2: (rT + .045) * (1 - f - .035), nt: true, nb: true, a0: a8, mat: "metal" });
    b.sphere(0, apex - .02, 0, .035, 5, IRN, M);
    const top = flag(b, 0, apex + .06, 0, C.banner2, false);
    /* 前出门廊：尖拱玻璃门、小玻璃人字顶、石阶 */
    const pw = .5, pd = .24, pe = .66, pr = .94, z0 = D / 2, z1 = D / 2 + pd;
    b.box(0, -.12, (z0 + z1) / 2, pw, yb + .12, pd, STD, { nb: true, top: FLOOR });
    b.at(0, 0, z1); mason(b, () => [-pw / 2, pw / 2], -.1, yb, .002, { rh: .11, ql: true, qr: true }); b.pop();
    for (const s of [-1, 1]) {
      b.quad([s * pw / 2, yb, z0], [s * pw / 2, yb, z1], [s * pw / 2, pe, z1], [s * pw / 2, pe, z0], GLS, GL);
      b.quad([s * (pw / 2 + .03), pe - .02, z0 - .2], [s * (pw / 2 + .03), pe - .02, z1 + .03], [0, pr, z1 + .03], [0, pr, z0 - .2], GLS, GL);
      fm([s * pw / 2, yb, z1], [s * pw / 2, pe, z1]); fm([s * pw / 2, pe, z1 + .005], [0, pr, z1 + .005], .02);
      fm([s * pw / 2, pe, z0], [s * pw / 2, pe, z1], .024);
      fm([s * .14, yb, z1 + .005], [s * .14, .56, z1 + .005], .022); fm([s * .14, .56, z1 + .005], [0, .66, z1 + .005], .018);
    }
    b.tri([-pw / 2, pe, z1], [pw / 2, pe, z1], [0, pr, z1], GLS, GL);
    for (const s of [-1, 1]) b.quad([s * .14, yb, z1], [s * pw / 2, yb, z1], [s * pw / 2, pe, z1], [s * .14, pe, z1], GLS, GL);
    b.at(0, yb, z1 + .006); fan(b, outline(.28, .34, 0, .62, 4), 0, mix3(GLS, IRN, .25), GL); b.pop();
    fm([0, yb, z1 + .008], [0, .54, z1 + .008], .012);
    fm([-pw / 2, pe, z1 + .005], [pw / 2, pe, z1 + .005], .022);
    fm([0, pr, z0 - .2], [0, pr, z1 + .03], .026);
    b.sphere(0, pr + .04, z1 + .03, .02, 4, IRN, M); b.cone(0, pr + .04, z1 + .03, .012, .12, 4, IRN, M);
    for (let i = 0; i < 2; i++) b.box(0, -.1, z1 + .07 + i * .1, .46 - i * .06, .2 + yb - .08 - i * .12, .1, mix3(DRESS2, C.stone, .3 + i * .2), { nb: true, top: DRESS });
    /* 里面：一盏吊着的提灯、棕榈 */
    rod(b, [-.5, yr - .2 * .5, 0], [-.5, .74, 0], .008, IRN, M); lantern(b, -.5, .54, 0, false);
    palm(b, 0, 0, 1.2, false);
    b.cyl(0, yb, 0, .14, .08, 8, STD, { top: SOIL });
    interior(b, W, D, yb, 6);
    for (const s of [-1, 1]) { b.cyl(s * .5, yb, 0, .06, .1, 6, TERRA, { r2: .075, top: SOIL }); for (let k = 0; k < 6; k++) leaf(b, s * .5, yb + .1, 0, k / 6 * TAU, .18, .05, .14, mix3(C.leafD, [.4, .3, .45], k % 2 ? .4 : 0)); for (let k = 0; k < 3; k++) spike(b, s * .5, yb + .1, 0, k * 2.1, .5, .015, .22, [.55, .3, .6]); }   /* 毒触手似的紫尖叶 */
    b.pop();
    return top;
  }

  /* ---------- 哥特铁骨玻璃尖穹顶（Lv3，2077） ---------- */
  function domeHouse(b, X, Z) {
    reseed(73);
    const N = 12, r0 = .64, yb = .22, yd = .76, t = .024, rho = 2.1, Rr = rho * r0, cxp = r0 - Rr, K = 5;
    const fm = (p, q, w, c) => rod(b, p, q, w || t, c || IRN, M);
    const P = (i, r, y) => [Math.cos(i / N * TAU) * r, y, Math.sin(i / N * TAU) * r];
    b.at(X, 0, Z);
    rwall(b, 0, 0, r0 + .08, r0 + .07, -.12, yb, N, .115);
    b.cyl(0, yb - .02, 0, r0 + .1, .04, N, DRESS, { nb: true });
    /* 鼓座：玻璃、铁竖棂、尖拱窗格、黄铜腰线、小尖塔 */
    b.cyl(0, yb, 0, r0, yd - yb, N, GLS, { nt: true, nb: true, mat: "glass" });
    for (let i = 0; i < N; i++) {
      fm(P(i, r0 + .004, yb), P(i, r0 + .004, yd));
      const A = P(i, r0 + .004, yd - .17), B2 = P(i + 1, r0 + .004, yd - .17), Mm = [(A[0] + B2[0]) / 2, yd - .05, (A[2] + B2[2]) / 2];
      fm(A, Mm, .012); fm(B2, Mm, .012);
      fm([(A[0] + B2[0]) / 2, yb, (A[2] + B2[2]) / 2], Mm, .01);
      b.cone(...P(i, r0 + .03, yd + .03), .016, .12, 3, BRASS, M);
    }
    b.cyl(0, yd - .025, 0, r0 + .022, .05, N, BRASS, { nt: true, nb: true, mat: "metal" });
    b.cyl(0, yb, 0, r0 + .014, .035, N, IRN, { nt: true, nb: true, mat: "metal" });
    b.cyl(0, yb + .2, 0, r0 + .008, .016, N, IRN, { nt: true, nb: true, mat: "metal" });
    /* 尖穹顶 */
    const th1 = Math.acos((.12 - cxp) / Rr), prof = [];
    for (let k = 0; k <= K; k++) { const th = th1 * k / K; prof.push([cxp + Rr * Math.cos(th), yd + .03 + Rr * Math.sin(th)]); }
    for (let i = 0; i < N; i++) for (let k = 0; k < K; k++) {
      const [ra, ya] = prof[k], [rb, yb2] = prof[k + 1];
      b.quad(P(i, ra, ya), P(i + 1, ra, ya), P(i + 1, rb, yb2), P(i, rb, yb2), GLS, GL);
    }
    for (let i = 0; i < N; i++) {
      for (let k = 0; k < K; k++) fm(P(i, prof[k][0] + .01, prof[k][1]), P(i, prof[k + 1][0] + .01, prof[k + 1][1]), i % 3 ? .02 : .03);
      for (const k of [2]) fm(P(i, prof[k][0] + .008, prof[k][1]), P(i + 1, prof[k][0] + .008, prof[k][1]), .016);
    }
    /* 顶上小灯亭、黄铜尖顶饰 */
    const yl = prof[K][1];
    b.cyl(0, yl - .01, 0, .15, .03, N, BRASS, { mat: "metal", r2: .14 });
    b.cyl(0, yl + .02, 0, .1, .14, 6, GLS, { nt: true, nb: true, mat: "glass" });
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; fm([Math.cos(a) * .1, yl + .02, Math.sin(a) * .1], [Math.cos(a) * .1, yl + .16, Math.sin(a) * .1], .016, BRASS); }
    b.cone(0, yl + .16, 0, .14, .2, 6, mix3(BRASS, [.26, .2, .14], .5), { mat: "gloss" });
    b.sphere(0, yl + .37, 0, .03, 5, BRASS, M);
    b.cone(0, yl + .36, 0, .012, .2, 4, BRASS, M);
    b.emit(0, yd + .3, 0, "cat", 1, 1);
    /* 正面尖拱石门廊 */
    b.at(0, 0, r0 + .02);
    for (const s of [-1, 1]) { b.box(s * .22, -.12, 0, .09, .74, .2, mix3(DRESS2, STD, .2), { nb: true, top: DRESS }); b.pyramid(s * .22, .62, 0, .09, .2, .14, SL); }
    prism(b, outline(.36, .34, yb, .7, 4), -.1, .1, DRESS);
    b.at(0, yb, .104); door(b, .27, .3, .7, { planks: 4, straps: [.07, .24], ring: true }); b.pop();
    for (const s of [-1, 1]) b.beam([s * .24, yb + .4, .11], [0, yb + .62, .11], .05, DRESS);
    b.box(0, yb + .6, .11, .06, .05, .06, DRESS); b.pyramid(0, yb + .65, .11, .06, .06, .1, DRESS2);
    for (let i = 0; i < 2; i++) b.box(0, -.1, .17 + i * .1, .46 - i * .06, .2 + yb - .08 - i * .12, .1, mix3(DRESS2, C.stone, .3 + i * .2), { nb: true, top: DRESS });
    b.beam([.27, .55, .1], [.27, .55, .22], .02, BRASS, M); b.beam([.27, .55, .21], [.27, .5, .21], .01, BRASS, M); lantern(b, .27, .3, .21, true);
    b.pop();
    /* 里面 */
    palm(b, 0, 0, 1.15, true);
    b.cyl(0, yb, 0, .14, .08, 8, STD, { top: SOIL });
    for (let i = 0; i < 8; i++) {
      const a = (i + .5) / 8 * TAU, x = Math.cos(a) * (r0 - .17), z = Math.sin(a) * (r0 - .17);
      if (Math.sin(a) > .75) continue;
      b.cyl(x, yb, z, .07, .1, 6, TERRA, { r2: .085, top: SOIL });
      if (i % 2) b.sphere(x, yb + .2, z, .1, 5, mix3(C.leaf, C.leafD, R()), { sy: .9 });
      else for (let k = 0; k < 5; k++) leaf(b, x, yb + .1, z, k / 5 * TAU + R(), .15, .05, .16, mix3(C.leaf2, C.leafD, R() * .5));
    }
    b.pop();
    return yl + .56;
  }

  /* ---------- 铁灯柱／黄铜猫球灯 ---------- */
  function lampPost(b, x, z, cy) {
    b.at(x, 0, z);
    b.cyl(0, -.04, 0, .07, .08, 6, DRESS2, { nb: true });
    if (!cy) {
      b.beam([0, .04, 0], [0, .86, 0], .03, IRN, M);
      b.box(0, .1, 0, .05, .05, .05, IRN, M); b.sphere(0, .87, 0, .022, 4, IRN, M);
      b.beam([0, .8, 0], [.15, .8, 0], .02, IRN, M); b.beam([0, .7, 0], [.1, .8, 0], .012, IRN, M);
      b.beam([.14, .8, 0], [.14, .75, 0], .01, IRN, M);
      lantern(b, .14, .55, 0, false);
    } else {
      b.beam([0, .04, 0], [0, .8, 0], .022, BRASS, M);
      b.beam([0, .8, 0], [.1, .86, 0], .016, BRASS, M); b.beam([.1, .86, 0], [.16, .83, 0], .014, BRASS, M);
      b.sphere(0, .81, 0, .025, 4, BRASS, M);
      b.emit(.16, .7, 0, "cat", 1, .8);
    }
    b.pop();
  }
  function gravel(b, x0, z0, x1, z1) {                        /* 碎石铺地、四边窄石沿 */
    b.box((x0 + x1) / 2, -.08, (z0 + z1) / 2, x1 - x0, .095, z1 - z0, GRAV, { nb: true });
    for (const s of [-1, 1]) {
      b.box((x0 + x1) / 2, -.08, s > 0 ? z1 : z0, x1 - x0 + .05, .115, .05, mix3(C.stone, C.stoneD, .3), { nb: true, top: C.stone });
      b.box(s > 0 ? x1 : x0, -.08, (z0 + z1) / 2, .05, .115, z1 - z0 + .05, mix3(C.stone, C.stoneD, .3), { nb: true, top: C.stone });
    }
  }
  function flags(b, pts) { for (const [x, z] of pts) b.box(x + (R() - .5) * .03, -.06, z, .17 + R() * .05, .095, .12 + R() * .03, mix3(C.stone, C.stoneD, R() * .5), { nb: true, top: mix3(C.stone, [.62, .58, .52], R() * .5) }); }

  /* ---------- 各级布局 ---------- */
  const GRID = {
    1: { cx: -.4, cz: .36, cols: 2, rows: 2, s: .58, gap: .28, kinds: ["lav", "red", "man", "sage"] },
    2: { cx: -.24, cz: .5, cols: 3, rows: 2, s: .54, gap: .22, skip: [1, 1], kinds: ["lav", "aco", "red", "man", "sage", "gold"] },
    3: { cx: -.28, cz: .66, cols: 3, rows: 2, s: .52, gap: .2, skip: [1, 1], kinds: ["lav", "aco", "moly", "man", "red"] }
  };
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, G = GRID[lv];
    /* 花坛方格 */
    const step = G.s + G.gap, W0 = G.cols * G.s + (G.cols - 1) * G.gap, D0 = G.rows * G.s + (G.rows - 1) * G.gap;
    reseed(5 + lv);
    gravel(b, G.cx - W0 / 2 - .13, G.cz - D0 / 2 - .13, G.cx + W0 / 2 + .13, G.cz + D0 / 2 + .13);
    let n = 0, dial = null;
    for (let i = 0; i < G.cols; i++) for (let j = 0; j < G.rows; j++) {
      const x = G.cx - W0 / 2 + G.s / 2 + i * step, z = G.cz - D0 / 2 + G.s / 2 + j * step;
      if (G.skip && G.skip[0] === i && G.skip[1] === j) { dial = [x, z]; continue; }
      bed(b, x, z, G.s, G.s, G.kinds[n % G.kinds.length], cy, n); n++;
    }
    if (!dial) dial = [G.cx, G.cz];
    sundial(b, dial[0], dial[1], cy);
    reseed(9);
    if (G.skip) flags(b, [[dial[0], dial[1] + .3], [dial[0], dial[1] + .44]]);
    /* 各级的屋子和杂件 */
    if (lv === 1) {
      glasshouse(b, .95, -.42, 0, cy);
      reseed(10); flags(b, [[.95, .2], [.93, .36]]);
      rack(b, -.5, -.88, 0, .9, cy);
      urn(b, .62, .78, 0.76, "bay", cy); urn(b, 1.08, 1.0, 0.64, "spiky", cy); urn(b, 1.3, .62, 0.58, "flower", cy); urn(b, .72, 1.18, 0.5, "trail", cy); urn(b, 1.33, .22, 0.68, "jar", cy);
      flowerpots(b, 1.4, -.05);
      wateringCan(b, .42, .12, .6, cy);
      lampPost(b, .5, 1.3, cy);
      reseed(11); shrooms(b, -.82, -.8, 5, MUSH[0]); shrooms(b, 1.42, .45, 4, MUSH[1]);
      b.emit(-.4, .35, .36, "firefly", 4, 1);
    } else if (lv === 2) {
      hut(b, -.8, -.86, cy);
      cauldron(b, -1.42, -.56, cy);
      glasshouse(b, 1.02, -.62, 0, cy);
      rack(b, .25, -.92, 0, .52, cy);
      urn(b, 1.16, .32, 0.76, "bay", cy); urn(b, 1.38, .7, 0.62, "spiky", cy); urn(b, 1.05, .78, 0.53, "flower", cy); urn(b, 1.3, 1.1, 0.68, "jar", cy); urn(b, .98, 1.18, 0.48, "trail", cy);
      flowerpots(b, 1.45, -.12);
      wateringCan(b, .48, -.18, -.4, cy);
      lampPost(b, .72, -.2, cy);
      reseed(12); shrooms(b, -.18, -.5, 5, MUSH[0]); shrooms(b, 1.48, .95, 3, MUSH[1]); shrooms(b, -1.45, -1.15, 3, MUSH[1]);
      b.emit(-.24, .35, .5, "firefly", 5, 1);
    } else {
      hut(b, -.88, -.9, cy);
      cauldron(b, -1.45, -.32, cy);
      if (cy) domeHouse(b, .72, -.78); else conservatory(b, .7, -.86);
      rack(b, 1.28, .62, PI / 2, .72, cy);
      trays(b, -1.4, .02, .3);
      urn(b, .98, 1.2, 0.72, "bay", cy); urn(b, 1.36, 1.2, 0.62, "spiky", cy); urn(b, .96, .2, 0.56, "flower", cy); urn(b, -.06, -.28, 0.64, "jar", cy); urn(b, 1.48, .08, 0.5, "trail", cy);
      flowerpots(b, -.22, -.12);
      wateringCan(b, .62, .02, -.4, cy);
      lampPost(b, .45, -.15, cy);
      reseed(13); shrooms(b, -.3, -.55, 5, MUSH[0]); shrooms(b, 1.12, .9, 3, MUSH[1]); shrooms(b, -1.5, -1.2, 3, MUSH[1]);
      b.emit(-.28, .35, .66, "firefly", 6, 1);
    }
  }
  build.h = o => { const lv = Math.max(1, Math.min(3, o.lv || 1)); return lv === 1 ? 1.35 : lv === 2 ? 1.85 : o.cyber ? 2.45 : 3.2; };
  Isle3D.FAC["药圃"] = build;
})();
