/* 内建的四样小件（两个时代同一套，跟岛沿石栏杆一个石色：风化灰石、浅色压顶石、深色木、铁提灯）
   码头 port：岛沿一块石铺的码头平台，两根石墩托一道尖拱石门（拱顶吊一盏铁提灯）、两侧接一小段城堞矮墙；
              木栈道伸出岛外约 2.6（o.ext 再加长），底下一座座砌石桥墩、墩底收成倒尖；两侧木柱绳栏；尽头一个丁字平台，
              角上两根铁灯柱、系缆铁桩、绳圈、木桶；两把扫帚浮在平台边上（b.bob）。2077 平台上多一座黄铜箍的小飞艇系泊桩、挂一盏猫球灯。
   自留畦 garden：干砌石矮墙围的小菜园，正门两根石门柱顶石球、半开的木栅门、门上一道爬满蔷薇的木花架；
              园里一条踏石小路通到戴尖帽的稻草人，左畦卷心菜和豆架，右畦南瓜、胡萝卜和向日葵；门外几盆花。2077 多一盏猫球灯、两只玻璃钟罩。
   可营建空地 slot：平整的石基（料石路缘、方石板、正中一圈刻线和奠基石），四角石桩拉勘测线、四边插勘测小旗，
              角上码着料石和木料、一架测量三脚架，门口一块告示牌。不发光。2077 石桩顶换黄铜。
   垂瀑口 fall：八角石砌泉池——八角石台、两层砌石池壁、转角小石柱尖顶、中间一座两层的哥特式喷泉（上层水盘往下淌水），
              池壁每面两扇盲尖拱浮雕，池里睡莲；朝崖边那一面开口，水漫过石槛进一道石砌水渠，顺着地势一直通到崖边，
              渠口两根小石墩；在岛上会自动转正对准引擎画的溪，并补一张朝外的垂瀑水幕（引擎那张只朝岛里，从岛外看不见）。
              2077 多一盏猫球灯、柱尖和压顶黄铜。 */
(function () {
  const { C, mix3, dim3, trs } = Isle3D;
  const PI = Math.PI, M = { mat: "metal" };
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = s => { seed = s; R(); R(); };
  const S1 = mix3(C.stone, C.castle2, .5), S2 = mix3(C.stoneD, C.castleD, .45);         /* 跟岛沿石栏杆、城堡一个石色 */
  const CAP = mix3(mix3(C.stone, C.castle, .5), [.84, .81, .74], .14), MORT = mix3(C.castleD, [.2, .19, .2], .45), MOSS = mix3(C.ivy, C.stoneD, .35);
  const IRON = C.iron, HEMP = [.7, .6, .42], BRASS = mix3(C.gold, [.46, .34, .2], .32), WD = C.woodD;
  const LAMP = C.lamp;
  function sc(low) {                                        /* 一块石头：深浅、冷暖不一，近地的发暗泛青苔 */
    const r = R(), r2 = R(); let c = mix3(S1, S2, r * .85);
    if (r2 < .22) c = mix3(c, [.66, .6, .5], .22); else if (r2 > .8) c = mix3(c, [.48, .52, .56], .22);
    if (R() < .1) c = mix3(c, C.castleD, .4);
    if (low) c = mix3(c, MOSS, .12 + R() * .16);
    return c;
  }
  const cap = () => mix3(CAP, S1, R() * .55);
  const wood = () => mix3(C.plank, R() < .5 ? C.woodL : C.wood, R() * .5);

  /* ---------- 共用小件 ---------- */
  function strand(b, a, c, t, col, o) {                     /* 三棱细条（绳、铁丝、灯框）：比 beam 省一半面 */
    const d = [c[0] - a[0], c[1] - a[1], c[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const y = [d[0] / L, d[1] / L, d[2] / L], ref = Math.abs(y[1]) < .95 ? [0, 1, 0] : [1, 0, 0];
    let x = [y[1] * ref[2] - y[2] * ref[1], y[2] * ref[0] - y[0] * ref[2], y[0] * ref[1] - y[1] * ref[0]]; const lx = Math.hypot(x[0], x[1], x[2]); x = [x[0] / lx, x[1] / lx, x[2] / lx];
    const z = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]], r = t * .62;
    const off = k => { const an = k * 2 * PI / 3; return [(x[0] * Math.cos(an) + z[0] * Math.sin(an)) * r, (x[1] * Math.cos(an) + z[1] * Math.sin(an)) * r, (x[2] * Math.cos(an) + z[2] * Math.sin(an)) * r]; };
    for (let k = 0; k < 3; k++) {
      const u = off(k), v = off(k + 1), p0 = [a[0] + u[0], a[1] + u[1], a[2] + u[2]], p1 = [a[0] + v[0], a[1] + v[1], a[2] + v[2]], q0 = [c[0] + u[0], c[1] + u[1], c[2] + u[2]], q1 = [c[0] + v[0], c[1] + v[1], c[2] + v[2]];
      b.quad(p0, q0, q1, p1, col, o);
    }
  }
  function lantern(b, x, y, z, cy) {                        /* 铁提灯（六角，暖光）；y 是底，高约 .35 */
    const fr = cy ? BRASS : IRON;
    b.cyl(x, y, z, .07, .03, 6, fr, { mat: "metal", nb: 1 });
    b.cyl(x, y + .03, z, .052, .15, 6, LAMP, { r2: .064, e: .65, nt: 1, nb: 1 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * PI; strand(b, [x + Math.cos(a) * .058, y + .03, z + Math.sin(a) * .058], [x + Math.cos(a) * .069, y + .18, z + Math.sin(a) * .069], .014, fr, M); }
    b.cyl(x, y + .18, z, .085, .025, 6, fr, M);
    b.cone(x, y + .205, z, .08, .11, 6, IRON, { mat: "metal", nb: 1 });
    b.cone(x, y + .3, z, .022, .06, 4, fr, { mat: "metal", nb: 1 });
  }
  function lampPost(b, x, y, z, h, cy) {                    /* 铁灯柱：石脚、铁杆、两道箍、顶上一盏提灯 */
    b.box(x, y, z, .14, .07, .14, cap());
    b.box(x, y + .07, z, .05, h - .07, .05, IRON, M);
    b.box(x, y + .2, z, .07, .03, .07, cy ? BRASS : IRON, M);
    b.box(x, y + h - .03, z, .09, .03, .09, cy ? BRASS : IRON, M);
    lantern(b, x, y + h, z, cy);
  }
  function rope(b, p, q, sag, t, n) {                       /* 下垂的麻绳（默认三段） */
    const P = []; n = n || 3;
    for (let i = 0; i <= n; i++) { const u = i / n; P.push([p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u - sag * 4 * u * (1 - u), p[2] + (q[2] - p[2]) * u]); }
    for (let i = 0; i < n; i++) strand(b, P[i], P[i + 1], t || .02, HEMP);
  }
  function archPts(w, p, n) {                               /* 尖拱：左起拱点→拱顶→右起拱点 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function blindArch(b, x, y, z, w, h, col, frame) {         /* 墙面上一扇浅浮雕的盲尖拱（面朝 +z）：料石框＋暗色拱心 */
    const out = (ww, hh, y0) => [[-ww / 2, y0], [ww / 2, y0]].concat(archPts(ww, .72, 3).reverse().map(([px, py]) => [px, hh + py]));
    const fan = (pts, zz, c) => { for (let i = 1; i < pts.length - 1; i++) b.tri([x + pts[0][0], y + pts[0][1], zz], [x + pts[i][0], y + pts[i][1], zz], [x + pts[i + 1][0], y + pts[i + 1][1], zz], c); };
    if (frame) fan(out(w + .035, h, -.018), z, frame);
    fan(out(w, h, 0), z + .002, col);
  }
  function wallRun(b, len, courses, ch, th, o) {             /* 一段干砌石矮墙（沿 x，墙心 z=0，底 y=0）：错缝砌块＋压顶石 */
    o = o || {};
    b.box(0, 0, 0, len - .01, courses * ch - .004, th - .035, MORT);
    for (let j = 0; j < courses; j++) {
      let x = -len / 2, first = true;
      while (x < len / 2 - .02) {
        let l = first && j % 2 ? .08 + R() * .07 : .16 + R() * .15; first = false;
        if (x + l > len / 2 - .09) l = len / 2 - x;
        b.box(x + l / 2, j * ch, (R() - .5) * .012, l - .012, ch - .01 + R() * .006, th - R() * .018, sc(j === 0), { nb: 1 });
        x += l;
      }
    }
    if (o.nocap) return;
    let x = -len / 2;
    while (x < len / 2 - .02) {
      let l = .2 + R() * .16; if (x + l > len / 2 - .12) l = len / 2 - x;
      b.box(x + l / 2, courses * ch, 0, l - .01, .042, th + .035, cap(), { nb: 1 });
      x += l;
    }
  }
  function pillar(b, x, z, w, y0, y1, low) {                /* 一根方石柱：一层层料石（宽窄交替） */
    const n = Math.max(1, Math.round((y1 - y0) / .15)), hh = (y1 - y0) / n;
    for (let j = 0; j < n; j++) { const ww = w + (j % 2 ? .012 : 0); b.box(x, y0 + j * hh, z, ww, hh - .006, ww, sc(low && j === 0), { nb: 1 }); }
    b.box(x, y0, z, w - .02, y1 - y0, w - .02, MORT);
  }
  function pennant(b, x, y, z, ry, col) {                   /* 勘测小旗／三角旗：两面都画 */
    b.at(x, y, z, ry);
    b.tri([0, 0, 0], [.17, -.045, 0], [0, -.11, 0], col, { k: 1.45 });
    b.tri([0, 0, 0], [0, -.11, 0], [.17, -.045, 0], col, { k: 1.45 });
    b.pop();
  }

  /* ================= 岛沿码头 ================= */
  function broom(sb, cy) {                                  /* 一把扫帚（沿 z，帚头朝 -z） */
    sb.beam([0, -.01, -.4], [0, .04, .66], .042, C.woodL);
    sb.sphere(0, .045, .67, .03, 4, C.wood);
    sb.push(trs(0, 0, -.38, 0, 1, -PI / 2));
    sb.cyl(0, 0, 0, .048, .42, 7, C.hay, { r2: .15 });
    sb.cyl(0, -.015, 0, .055, .05, 6, cy ? BRASS : WD, cy ? M : null);
    sb.cyl(0, .13, 0, .085, .03, 6, cy ? BRASS : HEMP, cy ? M : null);
    sb.pop();
    for (const [dx, dy] of [[.09, .04], [-.1, .02], [.02, -.11], [-.04, .12]]) strand(sb, [dx * .4, dy * .4, -.6], [dx, dy, -.86], .014, mix3(C.hay, C.wood, .25));
    sb.box(0, .02, .15, .07, .025, .16, cy ? BRASS : WD, cy ? M : null);          /* 小坐垫／脚踏 */
  }
  function pierStone(b, x, z, w, d, yTop, yBot) {           /* 一座砌石桥墩：托石帽、错缝料石、墩底收成倒尖 */
    b.box(x, yBot, z, w - .03, yTop - yBot, d - .03, MORT);
    const n = Math.max(2, Math.round((yTop - yBot) / .19)), hh = (yTop - yBot) / n;
    for (let j = 0; j < n; j++) {
      const ya = yTop - (j + 1) * hh, cuts = j % 2 ? [0, .42 + R() * .14, 1] : w > 1 ? [0, .26 + R() * .08, .64 + R() * .08, 1] : [0, .22 + R() * .08, 1];
      for (let k = 0; k < cuts.length - 1; k++) {
        const xa = x - w / 2 + cuts[k] * w, xb = x - w / 2 + cuts[k + 1] * w;
        b.box((xa + xb) / 2, ya, z + (R() - .5) * .012, xb - xa - .012, hh - .012, d + (R() - .5) * .02, sc(j > n - 2), { nb: 1 });
      }
    }
    b.box(x, yTop, z, w + .08, .05, d + .08, cap());
    b.push(trs(x, yBot, z, 0, 1, PI)); b.pyramid(0, 0, 0, w, d, .4, mix3(sc(1), C.rockD, .3)); b.pop();
  }
  function bPort(b, o) {
    reseed(97);
    const cy = !!o.cyber, L = 2.6 + (o.ext || 0), z0 = .3, zE = z0 + L, DT = -.04;
    const N = Math.max(6, Math.round(L / .28)), pit = L / N, tS = zE - 3 * pit;   /* 木板宽度；tS：丁字平台起点 */

    /* --- 岸上：石铺码头平台 --- */
    const lz0 = -.8;
    b.box(0, -.24, (lz0 + z0) / 2, 1.52, .25, z0 - lz0, MORT);
    for (let r = 0, zz = lz0; zz < z0 - .02; r++) {
      const dz = Math.min(.27 + R() * .06, z0 - zz), cols = r % 2 ? [-.76, -.38, .02, .4, .76] : [-.76, -.2, .2, .56, .76];
      for (let c = 0; c < cols.length - 1; c++) b.box((cols[c] + cols[c + 1]) / 2, -.02, zz + dz / 2, cols[c + 1] - cols[c] - .028, .045 + R() * .008, dz - .028, mix3(C.stone, [.55, .52, .47], R() * .7), { nb: 1 });
      zz += dz;
    }
    for (const s of [-1, 1]) b.box(s * .79, -.06, (lz0 + z0) / 2, .1, .12, z0 - lz0, cap(), { nb: 1 });   /* 两边路缘石 */
    b.box(0, -.05, z0 - .05, 1.5, .08, .12, cap(), { nb: 1 });                                     /* 台口压边石 */

    /* --- 尖拱石门：两根石墩、拱券、拱顶石、吊提灯；两侧接一小段城堞矮墙 --- */
    const gz = .1, gx = .6, spring = .62;
    for (const s of [-1, 1]) {
      const x = s * gx;
      b.box(x, 0, gz, .3, .08, .3, cap());
      pillar(b, x, gz, .22, .08, .56, 1);
      b.box(x, .56, gz, .28, .06, .28, cap());
      /* 城堞矮墙：接上岛沿栏杆 */
      b.at(s * 1.0, 0, gz, 0); wallRun(b, .58, 2, .13, .15); b.pop();
      for (const mx of [.82, 1.12]) b.box(s * mx, .3, gz, .1, .09, .15, cap(), { nb: 1 });
      b.at(x + s * .14, .3, gz + .1); b.box(0, 0, 0, .05, .2, .05, MOSS); b.pop();      /* 一丛常春藤 */
      b.box(x + s * .08, .1, gz + .115, .1, .22, .015, MOSS);
      b.box(x + s * .1, .3, gz + .115, .06, .14, .015, mix3(MOSS, C.leaf, .3));
    }
    const ap = archPts(gx * 2, .6, 4);
    for (let i = 0; i < ap.length - 1; i++) {
      const a = [ap[i][0], spring + ap[i][1], gz], c = [ap[i + 1][0], spring + ap[i + 1][1], gz];
      b.beam(a, c, .2, i % 2 ? cap() : sc(), { tz: .13 });
    }
    const apex = spring + ap[4][1];
    b.box(0, apex - .085, gz, .11, .19, .23, cap());                                    /* 拱顶石 */
    b.cone(0, apex + .1, gz, .05, .14, 4, cap());
    b.beam([0, apex - .08, gz], [0, apex - .2, gz], .014, IRON, M);
    lantern(b, 0, apex - .55, gz, cy);
    b.beam([0, apex - .2, gz], [0, apex - .21, gz], .03, IRON, M);

    /* --- 木栈道：木板、两根纵梁、丁字平台横梁 --- */
    for (let i = 0; i < N; i++) {
      const zz = z0 + i * pit, head = zz >= tS - .01, w = head ? 1.52 : .92;
      b.box((R() - .5) * .03, DT - .05, zz + pit / 2, w - R() * .05, .05, pit - .028, wood(), { nb: 1 });
    }
    for (const s of [-1, 1]) b.box(s * .3, DT - .14, (z0 + zE) / 2, .08, .09, L, WD);
    for (const zz of [tS + .06, zE - .06]) b.box(0, DT - .14, zz, 1.5, .09, .08, WD);
    for (const s of [-1, 1]) b.box(s * .47, DT - .1, (z0 + tS) / 2, .04, .06, tS - z0, WD, { nb: 1 });   /* 边梁 */

    /* --- 砌石桥墩 --- */
    const zp0 = z0 + .5, zp1 = zE - 1.5 * pit, np = Math.max(1, Math.round((zp1 - zp0) / (L > 4 ? 1.75 : 1.25)));
    for (let i = 0; i <= np; i++) { const zz = zp0 + (zp1 - zp0) * i / np, last = i === np; pierStone(b, 0, zz, last ? 1.25 : .8, .3, DT - .19 - .05, -1.0 - (last ? .1 : 0)); }

    /* --- 木柱绳栏 --- */
    const posts = [], nPo = Math.max(2, Math.round((tS - z0 - .06) / (L > 4 ? .72 : .58)));
    for (const s of [-1, 1]) {
      const pp = [];
      for (let i = 0; i <= nPo; i++) pp.push([s * .47, z0 + .06 + (tS - z0 - .06) * i / nPo]);
      pp.push([s * .74, tS]);
      for (const [x, z] of pp) {
        b.box(x, DT - .19, z, .06, .64, .06, mix3(WD, C.wood, R() * .4), { nb: 1 });
        b.pyramid(x, DT + .45, z, .075, .075, .05, WD);
      }
      for (let i = 0; i < pp.length - 1; i++) {
        const [xa, za] = pp[i], [xb, zb] = pp[i + 1];
        rope(b, [xa, DT + .37, za], [xb, DT + .37, zb], .05, .02, L > 4 ? 2 : 3);
        if (L < 4.2 || i % 2) rope(b, [xa, DT + .19, za], [xb, DT + .19, zb], .035, .018, L > 4 ? 2 : 3);
      }
      posts.push(pp);
    }
    if (L > 3.4) for (let i = 2, k = 0; i < nPo - 1; i += 4, k++) { const [x, z] = posts[k % 2][i]; b.box(x, DT + .45, z, .035, .5, .035, IRON, M); lantern(b, x, DT + .95, z, cy); }   /* 长栈道中途加几盏 */

    /* --- 丁字平台：铁灯柱、系缆桩、绳圈、木桶 --- */
    for (const s of [-1, 1]) {
      lampPost(b, s * .66, DT, zE - .12, .92, cy);
      const bx = s * .66, bz = tS + .12;
      b.cyl(bx, DT, bz, .065, .025, 6, IRON, M); b.cyl(bx, DT + .025, bz, .045, .1, 6, IRON, { mat: "metal", r2: .038 }); b.cyl(bx, DT + .125, bz, .062, .04, 6, IRON, { mat: "metal", r2: .05 });   /* 系缆铁桩 */
    }
    b.torus(-.42, DT + .02, zE - .32, .085, .022, 9, 3, HEMP);
    b.torus(-.42, DT + .05, zE - .32, .062, .02, 9, 3, mix3(HEMP, C.wood, .2));
    if (!cy) {
      const bx = .44, bz = zE - .34;                                                                  /* 木桶 */
      b.cyl(bx, DT, bz, .1, .12, 8, mix3(C.wood, C.woodL, .3), { r2: .118 }); b.cyl(bx, DT + .12, bz, .118, .12, 8, mix3(C.wood, C.woodL, .3), { r2: .1 });
      for (const y of [.035, .2]) b.cyl(bx, DT + y, bz, y < .1 ? .108 : .113, .022, 8, IRON, M);
      b.disc(bx, DT + .241, bz, .1, 8, C.woodD);
    } else {
      /* 2077：小飞艇系泊桩——八角石座、铁柱、黄铜箍、转头上一圈环和挑臂，挂一盏猫球灯 */
      const mx = .36, mz = tS + .42;
      b.cyl(mx, DT, mz, .17, .1, 8, cap()); b.cyl(mx, DT + .1, mz, .12, .06, 8, C.stoneD, { r2: .09 });
      b.cyl(mx, DT + .16, mz, .045, 1.12, 6, IRON, { mat: "metal", nb: 1 });
      for (const y of [.18, .55, .95]) b.cyl(mx, DT + y, mz, .065, .04, 6, BRASS, M);
      b.torus(mx, DT + 1.18, mz, .1, .018, 10, 3, BRASS, M);
      b.cyl(mx, DT + 1.25, mz, .055, .05, 6, BRASS, M); b.cone(mx, DT + 1.3, mz, .055, .14, 6, BRASS, { mat: "metal", nb: 1 }); b.sphere(mx, DT + 1.46, mz, .025, 4, BRASS, M);
      b.beam([mx, DT + 1.12, mz], [mx + .34, DT + 1.16, mz + .06], .028, IRON, M);
      b.beam([mx + .14, DT + 1.13, mz + .02], [mx, DT + .98, mz], .02, IRON, M);
      b.torus(mx + .36, DT + 1.12, mz + .06, .04, .01, 8, 3, BRASS, M);
      b.torus(mx, DT + .72, mz, .085, .024, 9, 3, HEMP);                                         /* 挂在柱上的缆绳卷 */
      b.emit(mx + .36, DT + .96, mz + .06, "cat", 1, 1);
    }

    /* --- 泊着的两把扫帚 --- */
    b.bob(-1.0, DT + .36, tS + .42, .05, 1.25, sb => {
      sb.at(0, 0, 0, .12); broom(sb, cy); sb.pop();
      rope(sb, [.07, .03, .5], [.34, -.22, -.3], .07, .014);                                          /* 拴在系缆桩上 */
    });
    b.bob(-.12, DT + .44, zE + .4, .06, 1.55, sb => { sb.at(0, 0, 0, PI / 2 + .18); broom(sb, cy); sb.pop(); });
  }
  bPort.h = o => 1.6;

  /* ================= 自留畦 ================= */
  function cabbage(b, x, z, s) {
    const y = .085;
    b.sphere(x, y + .045 * s, z, .07 * s, 6, mix3(C.leaf2, [.72, .84, .52], .45 + R() * .2), { sy: .8, k: 1.08 });
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * 2 * PI + R(), ca = Math.cos(a), sa = Math.sin(a), r1 = .03, r2 = .12 * s, w = .05 * s;
      b.tri([x + ca * r1, y + .005, z + sa * r1], [x + ca * r2 - sa * w, y + .045, z + sa * r2 + ca * w], [x + ca * r2 + sa * w, y + .045, z + sa * r2 - ca * w], mix3(C.leaf, C.leaf2, R() * .5), { k: 1.1 });
    }
  }
  function pumpkin(b, x, z, s, ry) {
    const col = mix3([.93, .52, .15], [.86, .42, .12], R());
    b.sphere(x, .085 + .065 * s, z, .1 * s, 8, col, { sy: .68 });
    b.cyl(x, .085 + .13 * s, z, .014, .05, 4, WD);
    b.at(x, .085, z, ry);
    b.beam([0, .01, 0], [.24, .01, .05], .016, C.leafD);
    for (const [px, pz] of [[.12, .06], [.25, .02]]) b.tri([px - .07, .015, pz - .02], [px + .02, .03, pz + .07], [px + .07, .02, pz - .05], mix3(C.leaf, C.leafD, .4), { k: 1.12 });
    b.pop();
  }
  function bed(b, cx, cz, w, d) {                           /* 木板围边的高畦 */
    b.box(cx, 0, cz, w - .04, .075, d - .04, mix3(C.soil, C.dirt, .15));
    for (const s of [-1, 1]) {
      b.box(cx + s * (w / 2 - .018), 0, cz, .036, .095, d, mix3(WD, C.wood, R() * .4), { nb: 1 });
      b.box(cx, 0, cz + s * (d / 2 - .018), w - .072, .095, .036, mix3(WD, C.wood, R() * .4), { nb: 1 });
    }
  }
  function bGarden(b, o) {
    reseed(53);
    const cy = !!o.cyber, X = .98, Z = .78, T = .14, GP = .33;
    b.box(0, -.05, 0, 2 * X - .12, .07, 2 * Z - .12, mix3(C.soil, C.grass, .45));
    /* 干砌石矮墙：前墙两段（中间开门）、后墙、两侧墙 */
    for (const s of [-1, 1]) { b.at(s * (X + GP + .08) / 2, 0, Z - T / 2, 0); wallRun(b, X - GP - .08, 2, .1, T); b.pop(); }
    b.at(0, 0, -Z + T / 2, PI); wallRun(b, 2 * X, 2, .1, T); b.pop();
    for (const s of [-1, 1]) { b.at(s * (X - T / 2), 0, 0, PI / 2); wallRun(b, 2 * Z - 2 * T, 2, .1, T); b.pop(); }
    for (const [x, z] of [[-X + .06, -Z + .16], [X - .07, .3], [-X + .07, .42]]) b.box(x, .04, z, .015, .1 + R() * .08, .1, MOSS);   /* 墙上青苔 */
    /* 石门柱、石球 */
    for (const s of [-1, 1]) {
      const x = s * GP, z = Z - T / 2;
      b.box(x, 0, z, .2, .06, .2, cap());
      pillar(b, x, z, .15, .06, .42, 1);
      b.box(x, .42, z, .19, .04, .19, cap());
      b.cyl(x, .46, z, .035, .03, 6, cap());
      b.sphere(x, .53, z, .055, 6, cap());
    }
    /* 半开的木栅门（铰在左门柱上，往里开） */
    b.at(-GP + .085, 0, Z - T / 2, .95);
    for (const y of [.1, .3]) b.beam([.0, y, 0], [.47, y, 0], .03, WD, { tz: .025 });
    b.beam([.03, .1, 0], [.44, .3, 0], .022, WD, { tz: .02 });
    for (let i = 0; i < 5; i++) { const x = .05 + i * .095; b.box(x, .03, .018, .055, .34, .018, mix3(C.woodL, C.wood, R() * .4)); b.pyramid(x, .37, .018, .055, .018, .05, mix3(C.woodL, C.wood, .3)); }
    b.box(.01, .08, -.01, .02, .03, .03, IRON, M); b.box(.01, .3, -.01, .02, .03, .03, IRON, M);
    b.pop();
    /* 蔷薇木花架：门前门后四根柱、圆拱顶、横条、侧面格子、爬藤蔷薇 */
    const AX = .46, AZ0 = Z - T - .06, AZ1 = Z + .06, AH = .74, AR = .17;
    const arch = []; for (let i = 0; i <= 6; i++) { const t = i / 6 * PI; arch.push([-Math.cos(t) * AX, AH + Math.sin(t) * AR]); }
    for (const z of [AZ0, AZ1]) {
      for (const s of [-1, 1]) b.box(s * AX, 0, z, .045, AH, .045, C.woodL, { nb: 1 });
      for (let i = 0; i < 6; i++) b.beam([arch[i][0], arch[i][1], z], [arch[i + 1][0], arch[i + 1][1], z], .04, C.woodL);
    }
    for (let i = 0; i <= 6; i++) b.beam([arch[i][0], arch[i][1] + .02, AZ0 - .05], [arch[i][0], arch[i][1] + .02, AZ1 + .05], .022, mix3(C.woodL, C.wood, .25));
    for (const s of [-1, 1]) for (const y of [.22, .42, .62]) strand(b, [s * AX, y, AZ0], [s * AX, y, AZ1], .024, mix3(C.woodL, C.wood, .25));
    const ROSE = [[.93, .5, .6], [.8, .24, .3], [.97, .9, .8], [.95, .62, .7]];
    const leafAt = (x, y, z, r) => b.sphere(x, y, z, r, 4, mix3(C.leafD, C.leaf, R() * .7), { k: 1.25, sy: .8 });
    const bloomAt = (x, y, z) => { const c = ROSE[Math.floor(R() * 4)]; b.pyramid(x, y, z, .036, .036, .022, c, { k: 1.25 }); b.push(trs(x, y, z, .6, 1, PI)); b.pyramid(0, 0, 0, .036, .036, .016, dim3(c, .8), { k: 1.25 }); b.pop(); };
    for (const s of [-1, 1]) {
      for (const [y, r] of [[.1, .055], [.26, .06], [.42, .065], [.58, .06]]) {
        leafAt(s * (AX + .015), y, (AZ0 + AZ1) / 2 + (R() - .5) * .12, r);
        if (R() < .75) bloomAt(s * (AX + .05), y + .03, AZ1 - R() * .12);
        if (R() < .5) bloomAt(s * (AX + .01), y - .03, AZ0 + .01);
      }
    }
    for (let i = 1; i < 6; i++) {
      leafAt(arch[i][0], arch[i][1] + .025, (AZ0 + AZ1) / 2 + (R() - .5) * .08, .06 + R() * .02);
      leafAt(arch[i][0] + (R() - .5) * .06, arch[i][1] + .01, AZ1 - .01, .045);
      bloomAt(arch[i][0] + (R() - .5) * .06, arch[i][1] + .06, AZ1 - .02);
      if (i % 2) bloomAt(arch[i][0], arch[i][1] + .07, AZ0 + .03);
    }
    /* 踏石小路 */
    b.box(0, 0, -.02, .3, .018, 1.22, mix3(C.dirt, C.stone, .5));
    for (let i = 0; i < 6; i++) { const z = .52 - i * .17; b.cyl((R() - .5) * .05, 0, z, .085 + R() * .02, .032, 6, mix3(S1, [.55, .52, .47], R()), { a0: R(), nb: 1 }); }
    /* 左畦：卷心菜、豆架 */
    bed(b, -.5, .06, .62, 1.1);
    for (const x of [-.65, -.36]) for (const z of [.47, .27, .07]) cabbage(b, x + (R() - .5) * .03, z, .9 + R() * .25);
    b.at(-.5, .085, -.36);                                                               /* 豆架：四根竹竿扎成尖，豆藤绕着爬 */
    for (const [px, pz] of [[-.11, -.1], [.11, -.1], [.11, .1], [-.11, .1]]) {
      strand(b, [px, 0, pz], [px * .08, .64, pz * .08], .02, C.woodL);
      for (let k = 0; k < 4; k++) {
        const t = .12 + k * .2, x = px * (1 - t * .92), z = pz * (1 - t * .92), y = .64 * t;
        b.push(trs(x, y, z, R() * 6.28, 1, (R() - .5) * 1.2, (R() - .5) * 1.2)); b.pyramid(0, -.025, 0, .07, .05, .05, mix3(C.leaf, C.leaf2, R()), { k: 1.2 }); b.pop();
        if (k % 2) strand(b, [x + .015, y - .02, z], [x + .02, y - .11, z + .01], .014, C.crop, { k: 1.2 });
      }
    }
    b.box(0, .58, 0, .045, .04, .045, HEMP);
    b.pop();
    /* 右畦：南瓜、胡萝卜、向日葵 */
    bed(b, .5, .06, .62, 1.1);
    pumpkin(b, .62, .4, 1.1, 2.6); pumpkin(b, .36, .22, .85, .3); pumpkin(b, .64, .06, .95, 3.4);
    for (let i = 0; i < 4; i++) {
      const x = .36, z = -.1 - i * .12;
      b.box(x, .075, z, .03, .02, .03, [.92, .48, .16]);
      for (let k = 0; k < 3; k++) { const a = k / 3 * 2 * PI + R(); b.tri([x, .09, z], [x + Math.cos(a) * .05 - Math.sin(a) * .015, .2, z + Math.sin(a) * .05], [x + Math.cos(a) * .05 + Math.sin(a) * .015, .2, z + Math.sin(a) * .05], C.leaf2, { k: 1.3 }); b.tri([x, .09, z], [x + Math.cos(a) * .05 + Math.sin(a) * .015, .2, z + Math.sin(a) * .05], [x + Math.cos(a) * .05 - Math.sin(a) * .015, .2, z + Math.sin(a) * .05], C.leaf2, { k: 1.3 }); }
    }
    for (const [x, z, h] of [[.66, -.22, .62], [.62, -.42, .74]]) {
      b.beam([x, .08, z], [x, .08 + h, z], .018, C.leafD, { k: 1.15 });
      for (const [y, s] of [[.25, 1], [.42, -1]]) b.tri([x, .08 + y, z], [x + s * .1, .08 + y + .03, z + .04], [x + s * .08, .08 + y - .02, z - .04], C.leaf, { k: 1.2 });
      b.at(x, .08 + h, z, -.25, 1, 1.15);
      b.cyl(0, -.012, 0, .085, .024, 10, [.98, .8, .2], { k: 1.15 });
      b.cyl(0, .012, 0, .045, .01, 8, [.42, .27, .12], { k: 1.15 });
      b.pop();
    }
    /* 稻草人：尖帽、补丁大衣、麻袋脸 */
    b.at(0, .02, -.5, -.15, .84);
    b.beam([0, 0, 0], [0, .8, 0], .035, WD);
    b.beam([-.23, .58, 0], [.23, .58, 0], .03, WD);
    b.box(0, .32, 0, .2, .3, .09, C.banner2, { k: 1.1 });
    b.box(0, .27, .047, .2, .03, .004, [.5, .38, .2]);
    b.box(-.04, .4, .047, .06, .06, .004, C.banner, { k: 1.1 });
    b.beam([-.22, .58, 0], [.22, .58, 0], .07, mix3(C.banner2, C.white, .08), { tz: .07 });
    for (const s of [-1, 1]) { b.push(trs(s * .25, .58, 0, 0, 1, 0, -s * PI / 2)); b.cone(0, 0, 0, .04, .09, 5, C.hay); b.pop(); }
    b.sphere(0, .72, 0, .075, 6, [.8, .7, .5]);
    for (const s of [-1, 1]) b.box(s * .028, .73, .07, .018, .018, .01, [.2, .16, .14]);
    b.box(0, .695, .07, .05, .008, .01, [.2, .16, .14]);
    b.cyl(0, .775, 0, .15, .014, 10, [.17, .14, .22]);
    b.push(trs(0, .787, 0, 0, 1, -.08, .18)); b.cyl(0, 0, 0, .075, .14, 8, [.17, .14, .22], { r2: .04 }); b.cone(0, .14, 0, .04, .1, 6, [.17, .14, .22]); b.pop();
    b.cyl(0, .79, 0, .076, .02, 8, C.banner);
    b.pop();
    /* 喷壶、门外的花盆 */
    b.at(-.15, .018, .5, .6);
    b.cyl(0, 0, 0, .045, .08, 7, cy ? BRASS : [.42, .52, .46], M);
    b.beam([.03, .02, 0], [.11, .1, 0], .012, cy ? BRASS : [.42, .52, .46], M);
    b.beam([-.04, .1, 0], [.04, .1, 0], .01, IRON, M);
    b.pop();
    for (const [x, z, s, fl] of [[.62, Z + .14, 1, [.95, .55, .62]], [.8, Z + .1, .8, [.7, .62, .95]], [-.72, Z + .12, .9, [.96, .9, .5]]]) {
      b.cyl(x, 0, z, .055 * s, .1 * s, 7, [.72, .4, .26], { r2: .07 * s, nb: 1, nt: 1 }); b.cyl(x, .09 * s, z, .078 * s, .025, 7, [.66, .36, .23], { nb: 1 });
      b.sphere(x, .15 * s, z, .065 * s, 4, C.leaf, { k: 1.25, sy: .8 });
      for (let i = 0; i < 3; i++) b.pyramid(x + (R() - .5) * .07 * s, .17 * s, z + (R() - .5) * .07 * s, .035, .035, .03, fl, { k: 1.25 });
    }
    if (cy) {
      /* 2077：牧羊钩铁灯杆挂一盏猫球灯；两只玻璃钟罩罩着幼苗 */
      const lx = -.82, lz = Z + .3;
      b.box(lx, 0, lz, .1, .05, .1, cap());
      b.beam([lx, .05, lz], [lx, .95, lz], .028, IRON, M);
      b.beam([lx, .95, lz], [lx - .1, 1.02, lz + .04], .022, IRON, M); b.beam([lx - .1, 1.02, lz + .04], [lx - .2, .98, lz + .08], .022, IRON, M); b.beam([lx - .2, .98, lz + .08], [lx - .21, .9, lz + .08], .016, IRON, M);
      b.cyl(lx, .3, lz, .03, .03, 6, BRASS, M);
      b.emit(lx - .21, .8, lz + .08, "cat", 1, 1);
      for (const [x, z] of [[-.66, -.12], [-.36, -.12]]) { b.pyramid(x, .085, z, .04, .04, .05, C.leaf2); b.cyl(x, .085, z, .06, .1, 7, C.glass, { r2: .045, mat: "glass", nb: 1 }); b.cone(x, .185, z, .045, .03, 7, C.glass, { mat: "glass", nb: 1 }); b.sphere(x, .225, z, .014, 4, BRASS, M); }
    }
  }
  bGarden.h = o => 1.35;

  /* ================= 可营建空地 ================= */
  function bSlot(b, o) {
    reseed(29);
    const cy = !!o.cyber, S = .92, A = S - .14, n = 5, p = 2 * A / n;
    b.box(0, -.12, 0, 2 * S - .02, .17, 2 * S - .02, MORT);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {                       /* 方石板 */
      const x = -A + p * (i + .5), z = -A + p * (j + .5), miss = (i === 4 && j === 0) || (i === 0 && j === 3);
      if (miss) { b.box(x, .03, z, p - .03, .012, p - .03, mix3(C.soil, C.dirt, .4)); continue; }
      b.box(x + (R() - .5) * .012, .03, z + (R() - .5) * .012, p - .03, .05 + R() * .006, p - .03, mix3(C.stone, [.56, .53, .48], R() * .75), { nb: 1 });
    }
    b.box(-A + p * 4.5 + .2, .03, -A + p * .5 - .05, .26, .04, .2, mix3(C.stone, [.56, .53, .48], .4));   /* 撬起来还没铺的一块 */
    for (const [x, z] of [[-A + p * 2, -A + p * 1.5], [-A + p * 3, -A + p * 3.6], [-A + p * 1, -A + p * 4.3], [-A + p * 3.6, -A + p * 2], [-A + p * .5, -A + p * 3.5]]) for (let i = 0; i < 2; i++) { const a = R() * 6.28, h = .07 + R() * .05; b.tri([x - Math.cos(a) * .035, .07, z - Math.sin(a) * .035], [x + Math.cos(a) * .035, .07, z + Math.sin(a) * .035], [x + Math.cos(a + 1.3) * .015, .07 + h, z + Math.sin(a + 1.3) * .015], mix3(C.grass2, C.leaf, R()), { k: 1.25 }); b.tri([x + Math.cos(a) * .035, .07, z + Math.sin(a) * .035], [x - Math.cos(a) * .035, .07, z - Math.sin(a) * .035], [x + Math.cos(a + 1.3) * .015, .07 + h, z + Math.sin(a + 1.3) * .015], mix3(C.grass2, C.leaf, R()), { k: 1.25 }); }   /* 石缝里冒出来的草 */
    for (const s of [-1, 1]) {                                                       /* 料石路缘 */
      for (const [ry, len] of [[0, 2 * S], [PI / 2, 2 * A]]) {
        b.at(ry ? s * (S - .07) : 0, 0, ry ? 0 : s * (S - .07), ry);
        let x = -len / 2;
        while (x < len / 2 - .02) { let l = .3 + R() * .18; if (x + l > len / 2 - .2) l = len / 2 - x; b.box(x + l / 2, -.02, 0, l - .014, .12 + R() * .008, .14, cap(), { nb: 1 }); x += l; }
        b.pop();
      }
    }
    /* 正中：一圈刻线、四向刻痕、奠基石 */
    b.push(trs(0, .089, 0, 0, 1, PI)); b.ring(0, 0, 0, .3, .335, 20, mix3(C.stoneD, MORT, .4)); b.pop();
    for (let i = 0; i < 4; i++) { b.at(0, 0, 0, i * PI / 2); b.box(0, .085, .38, .025, .006, .1, mix3(C.stoneD, MORT, .4)); b.pop(); }
    b.box(0, .03, 0, .24, .07, .24, mix3(CAP, C.stoneD, .25));
    b.box(0, .1, 0, .12, .004, .025, MORT); b.box(0, .1, 0, .025, .004, .12, MORT);
    /* 四角石桩，拉勘测线 */
    const P4 = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, c]) => [a * (S - .07), c * (S - .07)]);
    for (const [x, z] of P4) {
      b.box(x, .1, z, .2, .05, .2, cap());
      pillar(b, x, z, .13, .15, .5);
      b.box(x, .5, z, .17, .035, .17, cap());
      b.pyramid(x, .535, z, .13, .13, .1, cy ? BRASS : cap(), cy ? M : null);
      b.box(x, .38, z, .135, .02, .135, IRON, M);
    }
    for (let i = 0; i < 4; i++) { const [x1, z1] = P4[i], [x2, z2] = P4[(i + 1) % 4]; rope(b, [x1, .39, z1], [x2, .39, z2], .025, .011); }
    /* 四边插勘测小旗 */
    const FL = [C.banner, C.banner2];
    [[0, S + .1, .2], [S + .1, 0, -1.3], [0, -S - .1, 3.3], [-S - .1, 0, 1.9]].forEach(([x, z, ry], i) => {
      b.beam([x, -.02, z], [x + .02, .58, z + .01], .016, C.woodL);
      pennant(b, x + .02, .58, z + .01, ry, FL[i % 2]);
      b.box(x + .02, .58, z + .01, .02, .02, .02, C.white);
    });
    /* 角上码着的料石和木料 */
    b.at(-.48, .08, -.5, .15);
    for (const [x, y, z, w] of [[-.12, 0, 0, .22], [.12, 0, 0, .22], [0, 0, .17, .3], [-.02, .1, .05, .22], [.16, .1, .1, .14], [.04, .2, .08, .2]]) b.box(x, y, z, w, .1, .14, cap(), { nb: 1 });
    b.pop();
    b.at(.45, .08, -.48, -.2);
    for (const x of [-.18, .18]) b.box(x, 0, 0, .05, .05, .5, WD, { nb: 1 });
    for (let i = 0; i < 4; i++) b.box(-.15 + i * .1, .05, 0, .09, .03, .58 - (i % 2) * .04, wood(), { nb: 1 });
    for (let i = 0; i < 3; i++) b.box(0, .08, -.15 + i * .15, .5, .03, .09, wood(), { nb: 1 });
    b.pop();
    /* 测量三脚架 */
    b.at(.5, .08, .42, .5);
    for (let i = 0; i < 3; i++) { const a = i / 3 * 2 * PI; b.beam([Math.cos(a) * .2, 0, Math.sin(a) * .2], [0, .52, 0], .016, C.woodL); }
    b.cyl(0, .52, 0, .04, .03, 6, BRASS, M);
    b.cyl(0, .55, 0, .018, .04, 6, BRASS, M);
    b.beam([-.08, .6, 0], [.09, .62, 0], .032, BRASS, M);
    b.cyl(0, .58, 0, .03, .02, 6, C.iron, M);
    if (cy) b.box(.095, .605, 0, .006, .028, .028, C.glass, { mat: "glass" });
    b.beam([0, .52, 0], [.03, .15, .04], .006, IRON, M);
    b.pop();
    /* 门口告示牌：木牌钉一张羊皮纸告示 */
    b.at(-.5, 0, S + .16, -.1);
    for (const s of [-1, 1]) b.box(s * .2, 0, 0, .035, .5, .035, WD);
    b.box(0, .27, .01, .48, .2, .03, C.woodL);
    b.box(0, .29, .028, .2, .15, .004, C.cream);
    for (let i = 0; i < 3; i++) b.box(-.01, .39 - i * .035, .031, .14 - (i === 2 ? .05 : 0), .008, .002, [.35, .28, .22]);
    b.box(0, .47, .01, .52, .03, .045, WD);
    b.pop();
  }
  bSlot.h = o => 1.0;

  /* ================= 垂瀑口：八角石砌泉池 ================= */
  function bFall(b, o) {
    reseed(71);
    const cy = !!o.cyber, K8 = PI / 8, ov = (ap, k) => { const a = K8 + k * PI / 4, r = ap / Math.cos(K8); return [Math.cos(a) * r, Math.sin(a) * r]; };
    const SA = .98, ST = .085, WA = .735, WT = .13, WY = .36, WL = .32;               /* 石台外缘、台顶、池壁中线、壁厚、壁顶、水面 */
    const BACK = 5;                                                                     /* 第 5 面朝 -z：开口出水 */
    const ryOf = th => Math.atan2(Math.cos(th), Math.sin(th));
    /* 在岛上：把出水口正对引擎画的溪（从池心径直流到崖边），再量出到崖边的距离和沿途地面高 */
    let fix = 0, dist = SA + 1.2, Hl = () => 0, fall = null;
    const I = o.I;
    if (I && I.edge && I.H) {
      const m = b.m, O = [m[12], m[13], m[14]], a = Math.atan2(O[2], O[0]), D = [Math.cos(a), Math.sin(a)], P = [-D[1], D[0]], e = I.edge(a) - .05;
      fix = Math.atan2(-(D[0] * m[0] + D[1] * m[2]), -(D[0] * m[8] + D[1] * m[10]));
      dist = Math.max(SA + .3, e - Math.hypot(O[0], O[2]));
      fall = { y0: I.H(D[0] * e * .97, D[1] * e * .97) - O[1], L: (I.D || 3) * 1.35 };
      Hl = r => { let h = -9; for (const w of [-.3, 0, .3]) h = Math.max(h, I.H(O[0] + D[0] * r + P[0] * w, O[2] + D[1] * r + P[1] * w)); return h - O[1]; };
    }
    b.at(0, 0, 0, fix);
    /* 八角石台：顶面按扇区铺石板，侧面砌石 */
    for (let k = 0; k < 8; k++) {
      const a0 = ov(SA, k), a1 = ov(SA, k + 1), m0 = ov(WA + WT / 2 - .01, k), m1 = ov(WA + WT / 2 - .01, k + 1);
      const mid = t => [a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t], mi = t => [m0[0] + (m1[0] - m0[0]) * t, m0[1] + (m1[1] - m0[1]) * t];
      for (const [t0, t1] of [[0, .5], [.5, 1]]) {
        const A = mi(t0), B = mid(t0), Cc = mid(t1), D = mi(t1), col = mix3(CAP, C.stone, R() * .6);
        b.quad([A[0], ST, A[1]], [D[0], ST, D[1]], [Cc[0], ST, Cc[1]], [B[0], ST, B[1]], col);
        b.quad([B[0], ST, B[1]], [Cc[0], ST, Cc[1]], [Cc[0], -.1, Cc[1]], [B[0], -.1, B[1]], sc(1));
      }
    }
    for (let k = 0; k < 8; k++) { const a = ov(SA, k); b.beam([a[0] * .86, ST + .001, a[1] * .86], [a[0] * .985, ST + .001, a[1] * .985], .012, MORT, { tz: .004 }); }
    /* 池底 */
    for (let k = 0; k < 8; k++) { const p = ov(WA - WT / 2 + .01, k), q = ov(WA - WT / 2 + .01, k + 1); b.tri([0, .12, 0], [q[0], .12, q[1]], [p[0], .12, p[1]], mix3(C.stoneD, [.25, .35, .36], .45)); }
    /* 池壁：每面两层料石、压顶石；转角小石柱 */
    for (let k = 0; k < 8; k++) {
      const th = (k + 1) * PI / 4, cx = Math.cos(th) * WA, cz = Math.sin(th) * WA, half = WA * Math.tan(K8) + .02;
      b.at(cx, ST, cz, ryOf(th));
      if (k === BACK) {
        for (const s of [-1, 1]) {
          b.at(s * (half + .15) / 2, 0, 0); wallRun(b, half - .15, 2, (WY - ST) / 2, WT); b.pop();
        }
        b.box(0, 0, 0, .3, WL - ST - .03, WT + .01, cap());                              /* 溢水石槛 */
        b.quad([-.15, WL - .02, -.07], [-.15, WL - .02, .075], [.15, WL - .02, .075], [.15, WL - .02, -.07], C.water, { k: 3, mat: "water" });
      } else {
        b.box(0, 0, 0, half * 2 - .02, WY - ST - .005, WT - .03, MORT);
        for (let j = 0; j < 2; j++) {
          const ch = (WY - ST) / 2, cuts = j ? [0, .3 + R() * .1, .66 + R() * .1, 1] : [0, .48 + R() * .1, 1];
          for (let c = 0; c < cuts.length - 1; c++) { const xa = -half + cuts[c] * half * 2, xb = -half + cuts[c + 1] * half * 2; b.box((xa + xb) / 2, j * ch, (R() - .5) * .01, xb - xa - .012, ch - .01, WT, sc(j === 0), { nb: 1 }); }
        }
        b.box(0, WY - ST, 0, half * 2 + .02, .045, WT + .05, cap(), { nb: 1 });
        if (cy) b.box(0, WY - ST + .045, .045, half * 2 - .06, .006, .012, BRASS, M);
        for (const ax of [-.13, .13]) blindArch(b, ax, .05, WT / 2 + .002, .14, .1, mix3(S2, MORT, .55), cap());
        if (k === 0 || k === 3) { b.box(-.12, .02, WT / 2 + .004, .09, .16, .01, MOSS); b.box(-.08, .12, WT / 2 + .004, .05, .12, .01, mix3(MOSS, C.leaf, .3)); }
      }
      b.pop();
    }
    for (let k = 0; k < 8; k++) {
      const v = ov(WA, k), phi = K8 + k * PI / 4;
      b.at(v[0], ST, v[1], ryOf(phi));
      b.box(0, 0, .01, .13, WY - ST + .1, .13, sc(), { nb: 1 });
      b.box(0, WY - ST + .1, .01, .15, .03, .15, cap());
      b.pyramid(0, WY - ST + .13, .01, .1, .1, .12, cy ? BRASS : cap(), cy ? M : null);
      b.pop();
    }
    /* 水面、睡莲 */
    for (let k = 0; k < 8; k++) { const p = ov(WA - WT / 2 + .005, k), q = ov(WA - WT / 2 + .005, k + 1); b.tri([0, WL, 0], [q[0], WL, q[1]], [p[0], WL, p[1]], C.water, { k: 3, mat: "water" }); }
    for (const [x, z, r] of [[.42, .22, .08], [.32, .38, .065], [-.45, .12, .075], [-.2, -.42, .07]]) b.disc(x, WL + .006, z, r, 7, mix3(C.leaf, C.leafD, R() * .5), { k: 1.05 });
    b.cone(.42, WL + .008, .22, .035, .04, 5, [.97, .78, .85]); b.cone(-.45, WL + .008, .12, .03, .035, 5, [.98, .95, .9]);
    /* 中间的两层哥特喷泉 */
    b.cyl(0, .12, 0, .2, .1, 8, cap(), { a0: K8 });
    b.cyl(0, .22, 0, .1, .4, 8, mix3(C.stone, CAP, .3), { a0: K8, r2: .075 });
    for (let k = 0; k < 4; k++) { b.at(0, 0, 0, k * PI / 2 + K8); b.box(0, .22, .09, .04, .3, .04, sc()); b.pop(); }
    b.cyl(0, .58, 0, .09, .13, 8, cap(), { a0: K8, r2: .3 });
    b.cyl(0, .71, 0, .3, .05, 8, mix3(CAP, C.stone, .3), { a0: K8 });
    for (let k = 0; k < 8; k++) { const a = K8 + k * PI / 4, a2 = a + PI / 4, r = .27 / Math.cos(K8); b.tri([0, .755, 0], [Math.cos(a2) * r, .755, Math.sin(a2) * r], [Math.cos(a) * r, .755, Math.sin(a) * r], C.water, { k: 3, mat: "water" }); }
    for (let k = 0; k < 4; k++) {                                                       /* 上层水盘四个缺口往下淌细细的水 */
      const th = k * PI / 2 + PI / 4, ca = Math.cos(th), sa = Math.sin(th), w = .018, tx = -sa * w, tz = ca * w;
      b.box(ca * .29, .745, sa * .29, .06, .02, .06, cap());
      const P = [[.31, .76], [.36, .7], [.4, .52], [.41, WL + .005]];
      for (let i = 0; i < 3; i++) {
        const [r0, y0] = P[i], [r1, y1] = P[i + 1], f = 1 + i * .25;
        b.quad([ca * r0 - tx * f, y0, sa * r0 - tz * f], [ca * r0 + tx * f, y0, sa * r0 + tz * f], [ca * r1 + tx * f, y1, sa * r1 + tz * f], [ca * r1 - tx * f, y1, sa * r1 - tz * f], [.6, .78, .94], { k: 2, mat: "water" });
        b.quad([ca * r0 + tx * f, y0, sa * r0 + tz * f], [ca * r0 - tx * f, y0, sa * r0 - tz * f], [ca * r1 - tx * f, y1, sa * r1 - tz * f], [ca * r1 + tx * f, y1, sa * r1 + tz * f], [.6, .78, .94], { k: 2, mat: "water" });
      }
    }
    b.cyl(0, .74, 0, .06, .2, 8, cap(), { a0: K8, r2: .045 });
    b.cyl(0, .94, 0, .1, .04, 8, cap(), { a0: K8, r2: .06 });
    for (let k = 0; k < 4; k++) { b.at(0, 0, 0, k * PI / 2); b.cone(0, .9, .075, .02, .1, 4, cap()); b.pop(); }
    b.cone(0, .98, 0, .055, .22, 8, cy ? BRASS : cap(), cy ? M : null);
    b.sphere(0, 1.21, 0, .022, 4, cy ? BRASS : cap(), cy ? M : null);
    /* 出水口：石槽、漫出去的水 */
    b.at(0, 0, 0, PI);
    const z1 = WA + WT / 2, z2 = SA + .04;
    b.quad([-.15, WL - .02, z1], [-.17, .1, z1 + .14], [.17, .1, z1 + .14], [.15, WL - .02, z1], C.water, { k: 2, mat: "water" });
    b.quad([-.17, .1, z1 + .14], [-.21, .094, z2], [.21, .094, z2], [.17, .1, z1 + .14], C.water, { k: 3, mat: "water" });
    for (const s of [-1, 1]) b.box(s * .27, ST - .02, (z1 + z2) / 2 + .02, .08, .1, z2 - z1 + .04, cap(), { nb: 1 });
    /* 石砌水渠：顺着地势一直通到崖边，渠口两根小石墩，水从这里挂下去成垂瀑 */
    const n = Math.max(1, Math.ceil((dist - z2) / .3)), seg = [];
    for (let i = 0; i <= n; i++) { const r = z2 + (dist - z2) * i / n; seg.push([r, i === 0 ? Math.min(Hl(r), 0) : Hl(r)]); }
    const FL = .065, WW = .094 - FL;                                                    /* 渠底比地面高一点，水再高一点 */
    for (let i = 0; i < n; i++) {
      const [ra, ha] = seg[i], [rb, hb] = seg[i + 1], ya = ha + FL, yb = hb + FL, fc = mix3(S2, MORT, .3 + R() * .2);
      b.quad([-.33, ya, ra], [-.33, yb, rb], [.33, yb, rb], [.33, ya, ra], fc);
      b.quad([.33, ya - .17, ra], [.33, ya, ra], [.33, yb, rb], [.33, yb - .17, rb], sc(1));
      b.quad([-.33, yb - .17, rb], [-.33, yb, rb], [-.33, ya, ra], [-.33, ya - .17, ra], sc(1));
      b.quad([-.24, ya + WW, ra], [-.24, yb + WW, rb], [.24, yb + WW, rb], [.24, ya + WW, ra], C.water, { k: 3, mat: "water" });
      for (const s of [-1, 1]) b.beam([s * .285, ya + .05, ra], [s * .285, yb + .05, rb], .09, (i + (s > 0 ? 1 : 0)) % 2 ? cap() : sc(), { tz: .1 });
    }
    const [rE, hE] = seg[n];
    if (fall) {                                                                         /* 垂瀑朝外的一面（引擎那张只朝岛里） */
      const NS = 14, pt = t => [.3 + t * .5, t ? fall.y0 + .02 - t * fall.L : hE + FL + WW, rE + (t ? .3 * Math.sqrt(t) + .05 : .02)];
      for (let i = 0; i < NS; i++) { const [w1, y1, r1] = pt(i / NS), [w2, y2, r2] = pt((i + 1) / NS); b.quad([-w1, y1, r1], [-w2, y2, r2], [w2, y2, r2], [w1, y1, r1], [.62, .8, .96], { k: 2, mat: "water" }); }
    }
    for (const s of [-1, 1]) { b.box(s * .36, hE - .05, rE - .02, .15, .3, .15, sc(1)); b.pyramid(s * .36, hE + .25, rE - .02, .15, .15, .1, cap()); }
    for (const [x, rr, sz] of [[-.48, .25, .09], [.5, .5, .07], [.47, .8, .05]]) { const r = Math.min(z2 + rr, dist - .2); b.sphere(x, Hl(r) + .02, r, sz, 5, mix3(C.stone, C.rock, R()), { sy: .7 }); }
    for (const [x, rr] of [[-.46, .05], [.48, .35]]) { const r = Math.min(z2 + rr, dist - .2), h = Hl(r); for (let i = 0; i < 3; i++) { const a = R() * 6.28; strand(b, [x, h, r], [x + Math.cos(a) * .05, h + .26 + R() * .12, r + Math.sin(a) * .05], .02, mix3(C.leafD, C.crop, R() * .5), { k: 1.35 }); } }
    b.pop();
    /* 石台边的蕨和小石头 */
    for (const k of [0, 1, 2, 3, 4, 6, 7]) {
      if (R() < .35) continue;
      const th = (k + 1) * PI / 4 + (R() - .5) * .4, r = SA + .06, x = Math.cos(th) * r, z = Math.sin(th) * r;
      for (let i = 0; i < 3; i++) { const a = th + (i - 1) * .7; b.tri([x, 0, z], [x + Math.cos(a) * .17 - Math.sin(a) * .03, .13, z + Math.sin(a) * .17 + Math.cos(a) * .03], [x + Math.cos(a) * .17 + Math.sin(a) * .03, .13, z + Math.sin(a) * .17 - Math.cos(a) * .03], mix3(C.leaf, C.leafD, R()), { k: 1.3 }); b.tri([x, 0, z], [x + Math.cos(a) * .17 + Math.sin(a) * .03, .13, z + Math.sin(a) * .17 - Math.cos(a) * .03], [x + Math.cos(a) * .17 - Math.sin(a) * .03, .13, z + Math.sin(a) * .17 + Math.cos(a) * .03], mix3(C.leaf, C.leafD, R()), { k: 1.3 }); }
    }
    if (cy) {
      /* 2077：池边一根铁灯杆，弯钩挂一盏猫球灯 */
      const th = 3 * PI / 4, x = Math.cos(th) * .9, z = Math.sin(th) * .9;
      b.box(x, ST, z, .1, .05, .1, cap());
      b.beam([x, ST + .05, z], [x, ST + 1.05, z], .028, IRON, M);
      b.cyl(x, ST + .4, z, .03, .03, 6, BRASS, M);
      b.beam([x, ST + 1.05, z], [x + .12, ST + 1.12, z - .1], .022, IRON, M); b.beam([x + .12, ST + 1.12, z - .1], [x + .2, ST + 1.06, z - .17], .02, IRON, M);
      b.emit(x + .2, ST + .9, z - .17, "cat", 1, 1);
    }
    b.pop();
  }
  bFall.h = o => 1.45;

  Isle3D.PROP.port = bPort;
  Isle3D.PROP.garden = bGarden;
  Isle3D.PROP.slot = bSlot;
  Isle3D.PROP.fall = bFall;
})();
