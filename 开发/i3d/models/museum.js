/* 展馆（1994、2077 同名）：霍格沃茨式的新哥特博物馆。正立面朝 +z（岛心），横向对称：中央凸出的门厅、左右两翼、两端两座矮方塔，门前五级宽石阶。
   1994 Lv1：整座馆坐在一道风化灰石台基上，台基前沿是一溜石砌平台，平台前一道矮护墙（料石压顶、一排尖拱盲券），两端墩子上各立一根铁灯柱。
             中央门厅：两道尖拱券层层退进的高大门洞（料石券、拱心石），里头一对铁钉双扇木门；门洞上方一道尖山花（两根斜压顶石、顶上石花苞），
             再往上一扇小玫瑰窗（r .16，十二瓣彩玻璃、六根窗棂）；石山墙顶一座小尖塔，山墙上三扇盲尖拱；门厅前两角各一根带小尖塔的扶壁；
             门洞两侧挂两幅深红长旗（金边、菱形徽）。门厅屋脊沿 z，石板瓦陡顶，脊上一排铁花。
             两翼：错缝灰石墙、窗下腰线、檐口线脚和一排托石，每翼一行 4 扇高瘦的尖拱烛光窗（滴水线），深蓝灰石板瓦陡顶，屋脊铁花，两头石山墙下各一扇高窗。
             两端矮方塔：石台座、转角隅石、两道腰线，正面和外侧面一高一低两扇尖拱窗，背面一道箭孔；顶上一圈托石挑檐，四坡石板瓦尖顶、
             正面一扇小老虎窗、铁顶饰（塔高约 2.8）；塔脚和墙角爬常春藤；塔后台基上各两株修剪成圆锥的紫杉（石盆）。
             大台阶：五级宽石阶，两边斜压顶石的挡墙，脚下两只石墩；台阶顶两座石座上各蹲一只石雕猫球。
             前院左边一副龙骨标本（放在 (−1.45, 1.05)，斜着摆、龙头朝左前；规格书写的 (−1.35, .5) 会压进左塔和平台）：低石座、铜铭牌、两根铁支架，脊椎链从卷着的尾巴一路拱到昂起的脖子，四对弯肋、四条腿、收拢的翼骨，
             头骨（颅、吻、下颌、黑眼窝、两只往后弯的角）。骨头是骨白色。
   1994 Lv2：门厅背后向 −z 伸出一条铁骨玻璃拱顶长廊（矿石与化石廊）：石砌矮墙、玻璃侧墙、尖拱铁肋、通长的檩条和屋脊、玻璃端墙；
             里头两排暗色木展柜（玻璃罩里摆着低饱和的矿石），尽头一座晶簇；两翼前坡各起一座小石老虎窗；前院右边一块大菊石化石斜靠在石座的铁托架上。
   1994 Lv3：门厅后面升起一座方钟楼（藏在正立面后面）：石砌楼身、腰线、三面钟面、托石檐口、开敞的尖拱灯亭（挂一口铜钟、一盏小提灯）、
             四角小尖塔、八角石板瓦矮尖顶和铁风向标；+x 侧加一座粗凿大石块的矮方藏品库：厚檐口、平顶压顶石、铁通风帽、正面两道铁栅小窗，
             +x 面一扇圆形厚铁门（料石圈、六颗放射状铆钉、转轮把手、铰链）——战争系统里的「储藏点」。
   2077：同一座石头馆。大门加一道黄铜框玻璃雨棚（两根斜拉杆），台阶右边一座八角黄铜框玻璃售票亭（暗绿漆木裙板、铜穹顶、暖光售票窗），
         门口平台上一根黄铜细杆托一盏浮着的「文物维护猫灯」（cat 粒子 1）；长旗换成三色馆旗；窗棂、铁花、灯柱、尖饰换黄铜；门厅山墙顶立一只黄铜小飞艇风标（不转）。
         Lv2：玻璃长廊换成海洋展馆翼：石台座上一只黄铜框的大玻璃水箱（水面粼粼，沙底、礁石、海藻、珊瑚、几条锥体小鱼），
              一条黄铜肋的半圆玻璃隧道从馆里穿过水箱（「告白隧道」）；平台右边石座上一只张开的大砗磲托着一颗大珍珠（人鱼领主的潮汐珠）。
         Lv3：钟楼照旧（钟圈、尖饰换黄铜），藏品库的圆门换黄铜。
   不加霓虹、不加全息、不加罩子、不画人；动件 0，粒子只有 2077 的 cat 1 处。
   待修：渲染器统一压暗；模型里左边长旗只挂着一角歪下来、右边石猫从座上滚落、龙骨的头骨掉在地上、两对肋骨散在石座上、翼骨耷拉；
         玻璃长廊碎了几块玻璃（一块斜靠在墙根），菊石歪倒；海洋翼水位降低、只剩两条鱼、雨棚掉了玻璃、售票亭熄灯、猫灯熄灭、砗磲里的珍珠不见了、壳半合；
         钟停了、藏品库的圆门半开。前角 (.9,.9)、(−.95,.95) 半径 .3 内不放高过 .4 的东西。 */
(function () {
  const { C, mix3 } = Isle3D;
  const PI = Math.PI, TAU = PI * 2, M = { mat: "metal" }, GL = { mat: "gloss" }, GLS = { mat: "glass" };
  const ST = C.castle, ST2 = C.castle2, STD = C.castleD;
  const DRESS = mix3(C.castle, [.86, .83, .76], .38), DRESS2 = mix3(C.castle, [.86, .83, .76], .16);   /* 修整过的浅色料石 */
  const INNER = mix3(STD, [.1, .09, .1], .6), VOID = [.05, .045, .055], INNER2 = mix3(STD, C.plaster, .25);
  const SL = mix3(C.slate, [.2, .21, .23], .55), SL2 = mix3(C.slate2, [.24, .25, .27], .55), SLD = mix3(SL, [.08, .08, .1], .4), SLM = mix3(SL, C.ivy, .45);
  const WIN = mix3(C.glow, [.46, .33, .21], .34);                                                      /* 烛光窗 */
  const BRASS = mix3(C.gold, [.46, .34, .2], .3), AGED = mix3(BRASS, [.32, .27, .21], .42), IRON = mix3(C.iron, [.1, .1, .12], .2), BRONZE = mix3(C.gold, C.wood, .38);
  const OAK = mix3(C.woodD, [.13, .1, .08], .42), OAK2 = mix3(C.woodD, C.wood, .35), DOORW = mix3(C.woodD, C.wood, .25), DARK = mix3(C.woodD, [0, 0, 0], .45);
  const MULL = mix3(IRON, OAK, .3);
  const PAVE = mix3(C.stone, ST2, .45), FLOOR = mix3(mix3(C.woodD, C.wood, .3), STD, .3);
  const BONE = mix3(C.cream, C.stone, .22), BONED = mix3(BONE, C.woodD, .3);
  const CATS = mix3(DRESS, C.stone, .35), CATSD = mix3(CATS, STD, .4);                                /* 石雕猫球 */
  const GLASS = mix3(C.glass, [.78, .88, .84], .3), GLASSW = mix3(GLASS, C.white, .25), GLASSB = mix3(C.glass, C.seaB, .3);
  const WATER = mix3(C.water, C.seaB, .3), SEAD = mix3(mix3(C.water, C.seaB, .3), [.06, .12, .2], .55), SAND = mix3(mix3(C.hay, C.stone, .55), C.cream, .15), KELP = mix3(C.leafD, C.ivy, .4);
  const CATC = mix3(C.cream, [.66, .58, .47], .42);
  const FACE = mix3(C.cream, C.stone, .2);
  const BAN = mix3(C.banner, [.18, .08, .1], .28), BANW = mix3(C.cream, C.stone, .18), BANB = mix3(C.banner2, [.1, .1, .14], .25);   /* 1994 深红长旗；2077 三色馆旗 */
  const SHELL = mix3(mix3(C.hay, C.stone, .55), C.woodL, .2), SHELL2 = mix3(SHELL, C.woodD, .3);
  const MIN = [mix3(C.crystal2, C.stone, .55), mix3(C.white, C.stone, .3), mix3(C.crystal, C.stone, .58), mix3(C.gold, C.stone, .5), mix3(C.roofG, C.stone, .35)];
  const BOOTHW = mix3(mix3(C.roofG, C.woodD, .45), [.12, .14, .13], .35);
  const FISH = [mix3(C.gold, C.stone, .35), mix3(C.seaB, C.stone, .45), mix3(C.cream, C.stone, .2), mix3(C.cloth, C.stone, .5), mix3(C.roofB, C.stone, .35)];
  const CORAL = [mix3(C.bloom, C.stone, .45), mix3(C.cream, C.hay, .3), mix3(C.roofR, C.stone, .5)];
  let seed = 1;
  const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const reseed = n => { seed = 3000 + n * 7919; R(); R(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  /* ---------- 基本面片 ---------- */
  function qf(b, A, B, Cc, D, col, hint, o) {               /* 四边形：按 hint 方向自动翻成朝外 */
    const n = cross(sub(B, A), sub(Cc, A));
    return n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0 ? b.quad(D, Cc, B, A, col, o) : b.quad(A, B, Cc, D, col, o);
  }
  function fan(b, pts, z, col, o) { for (let i = 1; i < pts.length - 1; i++) b.tri([pts[0][0], pts[0][1], z], [pts[i][0], pts[i][1], z], [pts[i + 1][0], pts[i + 1][1], z], col, o); }
  function prism(b, pts, z0, z1, col, o) {
    fan(b, pts, z1, col, o);
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; b.quad([p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1], col, o); }
  }
  function limb(b, p, q, r0, r1, seg, col, o) {             /* 两点之间一根（收分的）多棱杆，不封头 */
    const d = sub(q, p), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return;
    const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
    b.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, p[0], p[1], p[2], 1]));
    b.cyl(0, 0, 0, r0, L, seg, col, Object.assign({ r2: r1, nt: true, nb: true }, o || {}));
    b.pop();
  }
  const rod = (b, p, q, t, col, o) => limb(b, p, q, t * .62, t * .62, 4, col, Object.assign({ a0: PI / 4 }, o || {}));   /* 细杆：四面、8 个三角形 */
  function archPts(w, p, n) {                               /* 尖拱曲线：左起拱点→拱顶→右起拱点；p .5 是半圆，越大越尖 */
    const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, th = Math.acos(Math.max(-1, Math.min(1, -cx / R0))), rt = [];
    for (let i = 0; i <= n; i++) { const t = th * i / n; rt.push([cx + R0 * Math.cos(t), R0 * Math.sin(t)]); }
    return rt.map(([x, y]) => [-x, y]).concat(rt.slice(0, -1).reverse());
  }
  function archY(w, p, x) { const R0 = Math.max(.5, p) * w, cx = w / 2 - R0, d = Math.abs(x) - cx; return Math.sqrt(Math.max(0, R0 * R0 - d * d)); }
  function outline(w, h, y0, p, n) { return [[-w / 2, y0], [w / 2, y0]].concat(archPts(w, p, n || 3).reverse().map(([x, y]) => [x, h + y])); }

  /* ---------- 砌石 ---------- */
  function sc(y) {                                          /* 一块石头的颜色：深浅不一的风化灰石，近地面的几层发暗泛绿 */
    const r = R(), r2 = R(); let c = mix3(ST, ST2, .55 + r * .45);
    if (r2 < .3) c = mix3(c, [.58, .52, .44], .28); else if (r2 > .78) c = mix3(c, [.44, .46, .49], .28);
    if (r > .9) c = mix3(c, STD, .42); else if (r < .06) c = mix3(c, DRESS, .4);
    const g = Math.max(0, Math.min(.3, (.95 - y) * .3));
    return mix3(c, mix3(STD, C.ivy, .35), g);
  }
  function mason(b, hw, y0, y1, z, o) {                     /* 一面墙（面朝 +z）一层层错缝砌；hw(y) 给这一高度的左右边；o.ql/o.qr 转角隅石 */
    o = o || {};
    const rh = o.rh || .15, n = Math.max(1, Math.round((y1 - y0) / rh)), hh = (y1 - y0) / n, ph = o.qph || 0;
    for (let j = 0; j < n; j++) {
      const ya = y0 + j * hh, yb = ya + hh, A = hw(ya), B = hw(yb), L = Math.max(A[0], B[0]), Rr = Math.min(A[1], B[1]);
      if (Rr - L < .01 && A[1] - A[0] < .01) continue;
      const q0 = o.ql ? ((j + ph) % 2 ? .1 : .19) : 0, q1 = o.qr ? ((j + ph) % 2 ? .19 : .1) : 0, cuts = [];
      let x = L + (q0 || (.05 + R() * .2));
      while (x < Rr - (q1 ? q1 + .07 : .07)) { cuts.push(x); x += .19 + R() * .22; }
      if (q1 && Rr - q1 > L + .05) cuts.push(Rr - q1);
      const E = [[A[0], B[0]]].concat(cuts.map(c => [c, c]), [[A[1], B[1]]]);
      for (let k = 0; k < E.length - 1; k++) {
        const isQ = (o.ql && k === 0) || (o.qr && k === E.length - 2);
        const col = isQ ? mix3(DRESS2, ST, R() * .35) : (o.col ? o.col(ya) : sc(ya));
        b.quad([E[k][0], ya, z], [E[k + 1][0], ya, z], [E[k + 1][1], yb, z], [E[k][1], yb, z], col);
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
  function wedge(b, x, y, z, w, h, d, col) {                /* 扶壁的斜顶：后高前低 */
    const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
    b.quad([x0, y, z1], [x1, y, z1], [x1, y1, z0], [x0, y1, z0], col);
    b.tri([x1, y, z1], [x1, y, z0], [x1, y1, z0], col);
    b.tri([x0, y, z0], [x0, y, z1], [x0, y1, z0], col);
  }
  function archRing(b, w, h, p, fr, z0, z1) {               /* 尖拱门洞的料石券（面朝 +z，原点在门洞底中点）：门框石、券底、拱心石 */
    const n = 4, ai = archPts(w, p, n), ao = archPts(w + fr * 2, p, n), rev = mix3(DRESS2, STD, .35);
    for (const s of [-1, 1]) {
      const xi = s * w / 2, nq = 3;
      for (let j = 0; j < nq; j++) {
        const ya = h * j / nq, yb = h * (j + 1) / nq, xq = s * (w / 2 + fr * (j % 2 ? .8 : 1.1));
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
    const kt = archY(w + fr * 2, p, 0); b.box(0, h + kt - .07, (z0 + z1) / 2 + .008, .07, .1, z1 - z0 + .016, DRESS, { nb: true });
  }
  function archFill(b, w, p, ys, ytop, zf, zb, col, soff, n) {   /* 尖拱洞上方的拱肩（前后两面＋拱腹），x 以拱心为 0 */
    const pts = archPts(w, p, n || 4);
    for (let i = 0; i < pts.length - 1; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], A = ys + ya, B = ys + yb;
      if (A >= ytop - 1e-4 && B >= ytop - 1e-4) continue;
      b.quad([xa, A, zf], [xb, B, zf], [xb, ytop, zf], [xa, ytop, zf], col);
      b.quad([xb, B, zb], [xa, A, zb], [xa, ytop, zb], [xb, ytop, zb], col);
      b.quad([xa, A, zf], [xa, A, zb], [xb, B, zb], [xb, B, zf], soff);
    }
  }

  /* ---------- 窗、门、灯 ---------- */
  function lancet(b, x, y, z, w, h, o) {                    /* 尖拱窗（面朝 +z）：料石窗框、烛光玻璃、窗棂、窗台、拱上滴水线；y 是玻璃底，h 到起拱 */
    o = o || {};
    const p = o.p || .7, fr = o.fr != null ? o.fr : .04, e = o.e != null ? o.e : .5, fc = o.frame || DRESS, n = w > .17 ? 3 : 2;
    b.at(x, y, z);
    prism(b, outline(w + fr * 2, h, -fr, p, n), -.03, .02, fc);
    if (o.dark) fan(b, outline(w, h, 0, p, n), .024, INNER);
    else fan(b, outline(w, h, 0, p, n), .024, WIN, { e });
    if (o.two) b.panel(0, 0, .027, .016, h + archY(w, p, 0) * .72, fc);
    if (!o.dark) b.panel(0, h * .55, .027, w, .014, o.cy ? BRASS : MULL, o.cy ? GL : undefined);
    if (!o.nosill) { const sw = w / 2 + fr + .018; b.quad([-sw, -fr - .028, .045], [sw, -fr - .028, .045], [sw, -fr, .045], [-sw, -fr, .045], DRESS); b.quad([-sw, -fr, .045], [sw, -fr, .045], [sw, -fr, -.01], [-sw, -fr, -.01], DRESS2); }
    if (o.hood) {                                            /* 滴水线 */
      const ai = archPts(w + fr * 2, p, 3), ao = archPts(w + fr * 2 + .04, p, 3), zh = .032;
      for (let i = 0; i < ai.length - 1; i++) {
        b.quad([ao[i][0], h + ao[i][1], zh], [ai[i][0], h + ai[i][1], zh], [ai[i + 1][0], h + ai[i + 1][1], zh], [ao[i + 1][0], h + ao[i + 1][1], zh], DRESS);
      }
    }
    b.pop();
  }
  function slit(b, x, y, z) {                               /* 箭孔：十字窄缝 */
    b.panel(x, y - .03, z + .002, .07, .26, DRESS2);
    b.panel(x, y, z + .004, .026, .2, INNER);
    b.panel(x, y + .085, z + .005, .09, .024, INNER);
  }
  function rose(b, x, y, z, r) {                            /* 小玫瑰窗：料石圈、十二瓣彩玻璃、八根窗棂 */
    const N = 12, ro = r + .07, cs = a => [Math.cos(a), Math.sin(a)];
    const g1 = mix3(WIN, [.46, .28, .28], .5), g2 = mix3(WIN, [.28, .32, .46], .55);
    b.at(x, y, z);
    for (let i = 0; i < N; i++) {
      const [c1, s1] = cs(i / N * TAU), [c2, s2] = cs((i + 1) / N * TAU);
      b.quad([c1 * ro, s1 * ro, .035], [c2 * ro, s2 * ro, .035], [c2 * r, s2 * r, .035], [c1 * r, s1 * r, .035], i % 2 ? DRESS : DRESS2);
      b.quad([c1 * ro, s1 * ro, -.02], [c2 * ro, s2 * ro, -.02], [c2 * ro, s2 * ro, .035], [c1 * ro, s1 * ro, .035], DRESS2);
      b.tri([0, 0, .022], [c1 * r, s1 * r, .022], [c2 * r, s2 * r, .022], i % 2 ? g1 : g2, { e: .42 });
    }
    fan(b, Array.from({ length: 6 }, (_, i) => [Math.cos(i / 6 * TAU) * r * .22, Math.sin(i / 6 * TAU) * r * .22]), .031, DRESS);
    for (let i = 0; i < 6; i++) { const [c, s] = cs(i / 6 * TAU); rod(b, [c * r * .2, s * r * .2, .028], [c * r, s * r, .028], .022, DRESS); }
    for (let i = 0; i < 6; i++) { const [c, s] = cs((i + .5) / 6 * TAU); b.panel(c * r * .68, s * r * .68 - .03, .03, .014, .06, DRESS); }
    b.pop();
  }
  function door2(b, w, h, p, cy) {                          /* 尖拱双扇木门（面朝 +z，原点在门底中点）：竖板、中缝、三道铁箍、铁钉、两只门环 */
    fan(b, outline(w, h, 0, p, 4), 0, DOORW);
    const n = 6;
    for (let i = 1; i < n; i++) { const x = -w / 2 + i * w / n; b.panel(x, 0, .004, i === 3 ? .02 : .009, h + archY(w, p, x) - .02, DARK); }
    for (const y of [h * .14, h * .52, h * .88]) {
      b.box(0, y, .006, w - .03, .026, .012, IRON, M);
      for (let i = 0; i < 6; i++) b.panel(-w / 2 + .045 + i * (w - .09) / 5, y + .006, .0125, .014, .014, C.metal, M);
    }
    for (const s of [-1, 1]) { b.at(s * .045, h * .4, .02, 0, 1, PI / 2); b.torus(0, 0, 0, .024, .006, 8, 3, cy ? BRASS : IRON, cy ? GL : M); b.pop(); }
  }
  function lantern(b, x, y, z, cy, off) {                   /* 提灯（六角，暖光）：1994 铁，2077 黄铜 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.cyl(x, y, z, .05, .02, 6, fr, Object.assign({ nt: true }, fo));
    b.cyl(x, y + .02, z, .036, .11, 6, off ? mix3(C.lamp, STD, .6) : C.lamp, Object.assign({ r2: .045, nt: true, nb: true }, off ? {} : { e: .62 }));
    for (let i = 0; i < 6; i += 2) { const a = i / 6 * TAU; rod(b, [x + Math.cos(a) * .044, y + .02, z + Math.sin(a) * .044], [x + Math.cos(a) * .05, y + .13, z + Math.sin(a) * .05], .012, fr, fo); }
    b.cyl(x, y + .13, z, .06, .016, 6, fr, Object.assign({ nt: true, nb: true }, fo));
    b.cone(x, y + .146, z, .06, .07, 6, fr, fo);
  }
  function lampPost(b, x, z, cy, hp) {                      /* 铁灯柱：小石座、细柱、横担、一盏提灯 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.box(x, 0, z, .1, .05, .1, DRESS2, { nb: true });
    b.cyl(x, .05, z, .024, hp, 6, fr, Object.assign({ r2: .018, nb: true, nt: true }, fo));
    rod(b, [x - .05, hp, z], [x + .05, hp, z], .016, fr, fo);
    lantern(b, x, hp + .01, z, cy);
  }
  function catLamp(b, x, z, h, off) {                       /* 2077：黄铜细杆，顶上弯钩托一盏浮着的猫球灯（待修时灯灭） */
    b.cyl(x, 0, z, .045, .06, 6, DRESS2, { nb: true });
    rod(b, [x, .05, z], [x, h, z], .024, BRASS, GL);
    rod(b, [x, h, z], [x + .1, h + .05, z], .018, BRASS, GL);
    rod(b, [x + .1, h + .05, z], [x + .15, h + .02, z], .016, BRASS, GL);
    b.cone(x, h - .01, z, .024, .05, 4, BRASS, GL);
    if (!off) b.emit(x + .15, h - .1, z, "cat", 1, .85);
  }
  function finial(b, x, y, z, cy) { b.beam([x, y - .06, z], [x, y + .2, z], .02, cy ? BRASS : IRON, cy ? GL : M); b.sphere(x, y + .06, z, .03, 4, cy ? BRASS : BRONZE, cy ? GL : M); }
  function ivy(b, x, y0, z, w, h, n) {                      /* 常春藤：贴墙的一簇簇小叶片，下密上疏 */
    for (let i = 0; i < n; i++) {
      const v = Math.pow(R(), 1.7), px = x + (R() - .5) * w * (1 - v * .65), py = y0 + v * h, s = .02 + R() * .02, zz = z + .012 + R() * .014;
      fan(b, [[px - s, py], [px, py - s], [px + s, py], [px, py + s]], zz, mix3(C.ivy, R() < .6 ? C.leafD : C.leaf, R() * .4));
    }
  }
  function banner(b, x, yt, z, w, h, cy, bad) {             /* 长旗：铁杆、燕尾底、金边、菱形徽（2077 三色竖条）；待修时只挂着一角歪下来 */
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    b.beam([x - w / 2 - .03, yt + .012, z + .03], [x + w / 2 + .03, yt + .012, z + .03], .016, fr, fo);
    b.at(x, yt, z + .014);
    if (bad) { b.at(w / 2, -.03, 0, 0, 1, 0, .3); b.at(-w / 2, 0, 0); }
    const yb = xx => -h + .07 * Math.abs(xx) / (w / 2);
    if (!cy) fan(b, [[-w / 2, yb(-w / 2)], [0, -h], [w / 2, yb(w / 2)], [w / 2, 0], [-w / 2, 0]], 0, BAN);
    else {
      const xs = [-w / 2, -w / 6, w / 6, w / 2], cols = [BANB, BANW, BAN];
      for (let k = 0; k < 3; k++) { const a = xs[k], c = xs[k + 1], pts = [[a, yb(a)]]; if (a < 0 && c > 0) pts.push([0, -h]); pts.push([c, yb(c)], [c, 0], [a, 0]); fan(b, pts, 0, cols[k]); }
    }
    const gold = cy ? BRASS : C.gold;
    b.panel(-w / 2 + .012, -h + .08, .003, .01, h - .1, gold, M);
    b.panel(w / 2 - .012, -h + .08, .003, .01, h - .1, gold, M);
    b.panel(0, -.06, .003, w - .016, .011, gold, M);
    const yc = -h * .45;
    fan(b, [[0, yc - .05], [.034, yc], [0, yc + .05], [-.034, yc]], .004, gold, M);
    fan(b, [[0, yc - .022], [.015, yc], [0, yc + .022], [-.015, yc]], .006, cy ? BANW : BAN);
    if (bad) { b.pop(); b.pop(); }
    b.pop();
  }
  function cresting(b, x0, x1, y, z, cy) {                  /* 屋脊：脊瓦、一排铁花（2077 黄铜） */
    b.beam([x0, y - .03, z], [x1, y - .03, z], .07, SLD, { tz: .07 });
    const fr = cy ? BRASS : IRON, fo = cy ? GL : M, n = Math.max(2, Math.round((x1 - x0) / .17));
    for (let i = 0; i <= n; i++) { const x = x0 + .04 + i * (x1 - x0 - .08) / n; b.panel(x, y + .02, z, .014, .07, fr, fo); b.at(x, 0, z, PI); b.panel(0, y + .02, 0, .014, .07, fr, fo); b.pop(); b.pyramid(x, y + .09, z, .03, .01, .045, fr, fo); }
    rod(b, [x0 + .04, y + .065, z], [x1 - .04, y + .065, z], .012, fr, fo);
  }
  function clock(b, y, z, r, cy, stopped) {                 /* 钟面（面朝 +z，z 是墙面）：料石圈、铜边、象牙白表盘、刻度、铁指针 */
    const N = 10, ring = k => Array.from({ length: N }, (_, i) => [Math.cos(i / N * TAU) * k, Math.sin(i / N * TAU) * k]);
    b.at(0, y, z);
    prism(b, ring(r + .04), -.02, .03, DRESS);
    fan(b, ring(r + .012), .032, cy ? BRASS : BRONZE, M);
    fan(b, ring(r), .035, FACE, { e: .15 });
    for (let k = 0; k < 12; k += 3) { const a = k / 12 * TAU; b.panel(Math.sin(a) * (r - .025) , Math.cos(a) * (r - .025) - .01, .037, .018, .018, IRON); }
    const hand = (a, L, w, zz) => { const ux = Math.sin(a), uy = Math.cos(a), nx = -uy * w, ny = ux * w; b.quad([-ux * .02 - nx, -uy * .02 - ny, zz], [ux * L - nx, uy * L - ny, zz], [ux * L + nx, uy * L + ny, zz], [-ux * .02 + nx, -uy * .02 + ny, zz], IRON); };
    if (stopped) { hand(3.5, r * .52, .008, .041); hand(3.1, r * .8, .006, .043); } else { hand(1.9, r * .52, .008, .041); hand(5.4, r * .8, .006, .043); }
    b.panel(0, -.01, .045, .02, .02, BRONZE, M);
    b.pop();
  }
  function catBall(b, x, y, z, ry, s, col, eye) {           /* 猫球：扁圆身子、两只尖耳、两只眼缝（约 70 三角形） */
    b.at(x, y, z, ry, s);
    b.sphere(0, 0, 0, 1, 7, col, { sy: .7 });
    for (const sx of [-1, 1]) { b.at(sx * .48, .52, .1, 0, 1, -.15, sx * -.4); b.cone(0, 0, 0, .26, .5, 3, col, { a0: PI / 6, nb: true }); b.pop(); }
    for (const sx of [-1, 1]) { b.at(sx * .32, .1, .92, sx * .35); b.panel(0, 0, 0, .2, .07, eye || [.2, .17, .16]); b.pop(); }
    b.pop();
  }
  function airshipVane(b, x, y, z, h, ry) {                 /* 黄铜小飞艇风标（静止）：杆、方位十字、一只奶油色小飞艇 */
    rod(b, [x, y - .04, z], [x, y + h, z], .016, AGED, GL);
    rod(b, [x - .06, y + h * .45, z], [x + .06, y + h * .45, z], .01, AGED, GL);
    rod(b, [x, y + h * .45, z - .06], [x, y + h * .45, z + .06], .01, AGED, GL);
    b.at(x, y + h + .045, z, ry);
    b.at(0, 0, 0, 0, [.38, .38, 1]); b.sphere(0, 0, 0, .1, 6, CATC, GL); b.pop();
    b.box(0, -.065, .015, .022, .02, .05, BRASS, GL);
    b.box(0, .028, -.085, .006, .04, .04, BRASS, GL); b.box(0, 0, -.085, .07, .006, .034, BRASS, GL);
    b.pop();
  }

  /* ---------- 屋顶 ---------- */
  function slope(b, A, B, z0, z1, o) {                      /* 一面坡（沿 z 铺开）：A 檐口、B 屋脊（xy）；一道道瓦层，每片深浅不一，零星几片长青苔 */
    o = o || {};
    const dx = B[0] - A[0], dy = B[1] - A[1], nb = o.nb || Math.max(2, Math.round(Math.hypot(dx, dy) / .15)), cw = o.cw || .26;
    let N = [-dy, dx]; if (N[1] < 0) N = [dy, -dx]; const nl = Math.hypot(N[0], N[1]); N = [N[0] / nl, N[1] / nl];
    const lift = o.lift || .02, cols = o.cols || [SL, SL2, SLD], dn = [-dx, -dy, 0];
    for (let i = 0; i < nb; i++) {
      const t0 = i / nb, t1 = (i + 1) / nb + (i < nb - 1 ? .035 / Math.hypot(dx, dy) : 0), xa = A[0] + dx * t0, ya = A[1] + dy * t0, xa2 = xa + N[0] * lift, ya2 = ya + N[1] * lift, xb = A[0] + dx * t1, yb = A[1] + dy * t1;
      const edges = [z0]; for (let z = z0 + cw * ((i % 2) * .5 + .5 + R() * .3); z < z1 - .06; z += cw * (.75 + R() * .5)) edges.push(z); edges.push(z1);
      for (let k = 0; k < edges.length - 1; k++) {
        const base = i % 2 ? cols[0] : cols[1], r = R();
        const c = r < .18 ? mix3(base, cols[2], .55) : r > .93 ? mix3(base, SLM, .7) : r > .84 ? mix3(base, [.5, .52, .56], .16) : mix3(base, cols[2], r * .25);
        qf(b, [xa2, ya2, edges[k]], [xa2, ya2, edges[k + 1]], [xb, yb, edges[k + 1]], [xb, yb, edges[k]], c, [N[0], N[1], 0]);
      }
      if (!o.nolip) qf(b, [xa, ya, z0], [xa, ya, z1], [xa2, ya2, z1], [xa2, ya2, z0], cols[2], dn);
    }
    if (!o.nounder) qf(b, [A[0], A[1], z0], [B[0], B[1], z0], [B[0], B[1], z1], [A[0], A[1], z1], o.under || mix3(OAK, [0, 0, 0], .2), [-N[0], -N[1], 0]);
    if (!o.nofascia) b.beam([A[0] + N[0] * .005, A[1] - .03, z0], [A[0] + N[0] * .005, A[1] - .03, z1], .035, OAK);
  }
  function hipRoof(b, cx, cz, HX, HZ, r, ye, yr, nR) {      /* 陡四坡石板瓦顶（r 为 0 就是四角攒尖）：屋脊沿 x，一道道深浅瓦层 */
    nR = nR || 4;
    const S = [0, .1], Y = [ye, ye + .05];
    for (let i = 1; i <= nR; i++) { S.push(.1 + .9 * i / nR); Y.push(ye + .05 + (yr - ye - .05) * i / nR); }
    const yOf = s => { for (let i = 0; i < S.length - 1; i++) if (s <= S[i + 1] + 1e-9) return Y[i] + (Y[i + 1] - Y[i]) * (s - S[i]) / (S[i + 1] - S[i]); return yr; };
    for (let f = 0; f < 4; f++) {
      const w0 = f % 2 ? HZ : HX, d0 = f % 2 ? HX : HZ, rw = f % 2 ? 0 : r, rd = f % 2 ? r : 0;
      const Pt = (s, u) => { const hw = w0 + (rw - w0) * s, z = d0 + (rd - d0) * s; return [-hw + 2 * hw * u, yOf(s), z]; };
      b.at(cx, 0, cz, f * PI / 2);
      for (let i = 0; i < S.length - 1; i++) {
        const s0 = S[i], s1 = Math.min(1, S[i + 1] + (i < S.length - 2 ? .02 : 0));
        const dzh = (d0 - rd) * (s1 - s0), dy = yOf(s1) - yOf(s0), L = Math.hypot(dzh, dy), lift = i ? .012 : 0, nY = dzh / L * lift, nZ = dy / L * lift;
        const hw0 = w0 + (rw - w0) * s0, n = Math.max(1, Math.round(2 * hw0 / .19));
        let u0 = 0;
        for (let k = 0; k < n; k++) {
          const u1 = k === n - 1 ? 1 : (k + 1 + (R() - .5) * .5 * (i % 2 ? 1 : -1)) / n;
          const A = Pt(s0, u0), B = Pt(s0, u1), Cc = Pt(s1, u1), D = Pt(s1, u0);
          A[1] += nY; A[2] += nZ; B[1] += nY; B[2] += nZ;
          const base = i % 2 ? SL : SL2, rr = R(), col = rr < .2 ? mix3(base, SLD, .55) : rr > .86 ? mix3(base, [.5, .52, .56], .15) : rr > .78 ? mix3(base, C.ivy, .25) : mix3(base, SLD, rr * .25);
          if (Cc[0] - D[0] > 1e-4 || B[0] - A[0] > 1e-4) b.quad(A, B, Cc, D, col);
          u0 = u1;
        }
      }
      rod(b, Pt(0, 1), Pt(1, 1), .035, SLD);
      rod(b, [-w0, ye - .02, d0 + .004], [w0, ye - .02, d0 + .004], .03, OAK);
      b.pop();
    }
    if (r > .01) rod(b, [cx - r - .02, yr, cz], [cx + r + .02, yr, cz], .055, SLD);
    b.quad([cx - HX, ye, cz - HZ], [cx + HX, ye, cz - HZ], [cx + HX, ye, cz + HZ], [cx - HX, ye, cz + HZ], INNER);
    return yr;
  }

  /* ================= 尺寸 ================= */
  const P = .3;                                                                      /* 台基顶面（馆内地坪） */
  const WX = 1.12, ZF = .28, ZB = -.8, ZC = (ZF + ZB) / 2, HD = (ZF - ZB) / 2;       /* 两翼：x ±WX，前墙 ZF，后墙 ZB */
  const YW = 1.62, YR = 2.34, OV = .08, K = (YR - YW) / HD, YE = YW - OV * K;        /* 两翼檐口、屋脊 */
  const CW = .48, ZP = .56, CY = 1.96, CR = 2.56, K2 = (CR - CY) / CW, CE = CY - OV * K2;   /* 中央门厅：半宽、前墙、檐口、屋脊 */
  const T0 = 1.12, T1 = 1.54, TZ0 = -.11, TZ1 = .31, TY = 2.06, TR = 2.62, TZC = (TZ0 + TZ1) / 2;   /* 两端方塔 */
  const SW = .46, SN = 5, SD = .08, SZ1 = ZP + SN * SD;                              /* 大台阶：半宽、级数、级深 */
  const PW1 = .54, PFR1 = .05, PW2 = .4, PFR2 = .07, PH = .52, PP = .66;            /* 门洞两道券 */
  const RY = 1.68, RR = .16;                                                         /* 玫瑰窗 */

  /* ================= 台基、平台护墙、大台阶、石猫 ================= */
  function podium(b) {
    reseed(1);
    const pc = () => mix3(ST2, STD, .22 + R() * .45);
    stoneBox(b, -T1 - .02, T1 + .02, -.22, P - .04, ZB - .07, ZP, { q: false, rh: .17, col: pc });
    b.box(0, P - .04, (ZB - .07 + ZP) / 2, 2 * T1 + .1, .04, ZP - ZB + .11, DRESS2, { nb: true, top: PAVE });
  }
  function parapet(b, o) {                                   /* 平台前沿的矮护墙：一排尖拱盲券、料石压顶；两端墩子上立灯柱 */
    reseed(2);
    const zc = ZP - .045, d = .07;
    for (const s of [-1, 1]) {
      const xa = SW + .1, xb = T1 - .08, x0 = s < 0 ? -xb : xa, x1 = s < 0 ? -xa : xb, xm = (x0 + x1) / 2, L = x1 - x0, n = 6;
      b.box(xm, P, zc, L, .15, d, mix3(ST2, DRESS2, .35), { nb: true });
      b.box(xm, P + .15, zc, L + .02, .026, d + .03, DRESS, { nb: true });
      for (let i = 0; i < n; i++) { b.at(x0 + (i + .5) * L / n, P + .03, zc + d / 2 + .002); fan(b, outline(L / n - .055, .05, 0, .7, 2), 0, mix3(INNER, ST2, .35)); b.pop(); }
      const px = s * (T1 - .02);
      b.box(px, P, zc, .14, .24, .14, sc(.4), { nb: true });
      b.box(px, P + .24, zc, .17, .03, .17, DRESS, { nb: true });
      b.box(px, P, (zc + TZ1) / 2, .07, .15, zc - TZ1, mix3(ST2, DRESS2, .35), { nb: true, top: DRESS });
      b.at(0, P + .27, 0); lampPost(b, px, zc, o.cy, .42); b.pop();
    }
  }
  function stairs(b) {                                       /* 五级宽石阶、两边斜压顶挡墙、脚下两只石墩 */
    reseed(3);
    const rise = P / (SN + .5);
    for (let k = 1; k <= SN; k++) {
      const yt = P - k * rise, z0 = ZP + (k - 1) * SD, z1 = ZP + k * SD;
      b.box(0, -.12, (z0 + z1) / 2, SW * 2, yt + .12, SD + .002, mix3(ST2, STD, .2 + R() * .25), { top: k % 2 ? DRESS : mix3(DRESS, DRESS2, .5), nb: true });
    }
    for (const s of [-1, 1]) {
      const x = s * (SW + .05), w = .1, za = ZP - .02, zb = SZ1 - .1, ya = P + .1, yb = .16, yg = -.12;
      for (const t of [-1, 1]) qf(b, [x + t * w / 2, yg, za], [x + t * w / 2, yg, zb], [x + t * w / 2, yb, zb], [x + t * w / 2, ya, za], mix3(ST2, ST, .5), [t, 0, 0]);
      qf(b, [x - w / 2 - .012, ya + .03, za], [x + w / 2 + .012, ya + .03, za], [x + w / 2 + .012, yb + .03, zb], [x - w / 2 - .012, yb + .03, zb], DRESS, [0, 1, .3]);
      for (const t of [-1, 1]) qf(b, [x + t * (w / 2 + .012), ya, za], [x + t * (w / 2 + .012), yb, zb], [x + t * (w / 2 + .012), yb + .03, zb], [x + t * (w / 2 + .012), ya + .03, za], DRESS2, [t, 0, 0]);
      b.box(x, -.1, zb + .05, .14, .38, .14, sc(.2), { nb: true });
      b.box(x, .28, zb + .05, .16, .03, .16, DRESS, { nb: true });
      b.pyramid(x, .31, zb + .05, .1, .1, .06, DRESS2);
    }
  }
  function catStatue(b, s, bad) {                            /* 台阶顶的石座和石雕猫球；待修时右边的猫滚落在台阶旁 */
    const x = s * (SW + .07), z = ZP + .12;
    b.box(x, P, z, .19, .04, .19, DRESS2, { nb: true });
    b.box(x, P + .04, z, .15, .17, .15, mix3(ST, DRESS2, .4), { nb: true });
    b.at(x, P + .07, z + .076); fan(b, outline(.07, .06, 0, .7, 2), 0, mix3(INNER, ST2, .3)); b.pop();
    b.box(x, P + .21, z, .19, .03, .19, DRESS, { nb: true });
    const yt = P + .24, sz = .115;
    b.box(x, yt, z, .12, .016, .12, CATSD, { nb: true });
    if (bad && s > 0) { b.at(x + .17, .075, z + .12, .9, 1, 0, PI / 2); catBall(b, 0, 0, 0, 0, sz, CATSD, mix3(INNER, CATSD, .3)); b.pop(); }
    else catBall(b, x, yt + .016 + sz * .7, z, s * .28, sz, CATS, mix3(INNER, CATS, .25));
  }

  /* ================= 两翼 ================= */
  function gableEnd(b, s) {                                  /* 两翼山墙：错缝砌的三角、沿坡压顶石、托脚石、山尖石墩 */
    b.at(s * WX, 0, ZC, s * PI / 2);
    mason(b, y => { const w = HD * Math.max(0, 1 - (y - YW) / (YR - YW)); return [-w, w]; }, YW, YR, 0, {});
    const L = HD + OV - .02, yl = YE + .02;
    for (const t of [-1, 1]) { b.beam([t * L, yl + .04, 0], [0, YR + .07, 0], .1, DRESS2, { tz: .1 }); b.box(t * (L - .04), yl - .1, 0, .15, .15, .14, DRESS, { nb: true }); }
    b.box(0, YR - .02, 0, .12, .13, .12, DRESS2, { nb: true }); b.pyramid(0, YR + .11, 0, .13, .13, .11, DRESS);
    b.pop();
  }
  function wings(b, o) {
    const cy = o.cy;
    reseed(4);
    stoneBox(b, -WX, WX, P, YW, ZB, ZF, { nf: true, rh: .18 });
    for (const s of [-1, 1]) {
      const x0 = s < 0 ? -WX : CW, x1 = s < 0 ? -CW : WX, L = x1 - x0, xm = (x0 + x1) / 2;
      mason(b, () => [x0, x1], P, YW, ZF, { rh: .165 });
      b.box(xm, .6, ZF + .02, L, .045, .05, DRESS2, { nb: true });                        /* 窗下腰线 */
      b.box(xm, YW - .07, ZF + .03, L, .07, .07, DRESS2, { nb: true, top: DRESS });       /* 檐口线脚 */
      for (let i = 0; i <= 4; i++) cbox(b, x0 + .035 + i * (L - .07) / 4, YW - .15, ZF, .04, .08, ZF + .05, DRESS2);
      for (let i = 0; i < 4; i++) lancet(b, x0 + (i + .5) * L / 4, .72, ZF, .095, .5, { hood: 1, fr: .03, cy, e: .48, dark: i === (s < 0 ? 1 : 2) });
    }
    /* 背面窗 */
    b.at(0, 0, ZB, PI);
    for (const x of [-.95, -.7, .7, .95]) lancet(b, x, .74, 0, .09, .44, { fr: .03, cy, e: .45, dark: Math.abs(x) < .8 });
    if (o.lv < 2) lancet(b, 0, .8, 0, .14, .5, { fr: .035, cy, two: 1, e: .45 });
    b.pop();
    for (const s of [-1, 1]) { b.at(s * WX, 0, -.47, s * PI / 2); lancet(b, 0, 1.17, 0, .1, .28, { fr: .03, cy, hood: 1, e: .45, dark: s < 0 }); b.pop(); }
    /* 屋顶：两翼各一段前后坡（中段让给门厅），屋脊铁花，两头石山墙 */
    reseed(5);
    b.at(0, 0, 0, PI / 2);
    for (const s of [-1, 1]) {
      const za = s < 0 ? -WX - .02 : CW - .05, zb = s < 0 ? -CW + .05 : WX + .02;
      slope(b, [-(ZF + OV), YE], [-ZC, YR], za, zb);
      slope(b, [-(ZB - OV), YE], [-ZC, YR], za, zb);
    }
    b.pop();
    for (const s of [-1, 1]) { cresting(b, s < 0 ? -WX : CW, s < 0 ? -CW : WX, YR, ZC, cy); gableEnd(b, s); }
    reseed(9);
    for (const s of [-1, 1]) { ivy(b, s * (WX - .12), P, ZF, .2, .9, 12); b.at(0, 0, ZB, PI); ivy(b, s * .9, P, 0, .3, 1.0, 8); b.pop(); }
  }
  function lucarne(b, x, cy) {                               /* Lv2：两翼前坡的小石老虎窗 */
    const w = .26, yb = YE + .3, hb = .25, zf = ZF + OV - (yb - YE) / K, dd = .42, zc = zf - dd / 2, gh = w * .6;
    b.box(x, yb - .16, zc, w, hb + .16, dd, mix3(ST, ST2, .5), { nb: true, front: mix3(ST, DRESS2, .3) });
    for (const t of [-1, 1]) b.box(x + t * (w / 2 - .025), yb - .02, zf + .006, .05, hb + .02, .02, DRESS2, { nb: true });
    lancet(b, x, yb + .05, zf, .1, .12, { fr: .025, nosill: true, p: .7, cy, e: .42 });
    b.at(x, yb + hb, zc + .03, PI / 2); b.gable(0, 0, 0, dd + .1, w + .08, gh, SL2, { end: DRESS2 }); b.pop();
    for (const s of [-1, 1]) b.beam([x + s * (w / 2 + .05), yb + hb - .02, zf + .06], [x, yb + hb + gh + .02, zf + .06], .045, DRESS2, { tz: .05 });
    b.cone(x, yb + hb + gh, zf + .06, .025, .1, 4, DRESS);
  }

  /* ================= 中央门厅 ================= */
  function centre(b, o) {
    const cy = o.cy, bad = o.bad;
    reseed(6);
    const L = ZP - ZB, zm = (ZP + ZB) / 2;
    for (const s of [-1, 1]) {                               /* 两侧墙：前段整高，后段只露出翼顶以上 */
      b.at(s * CW, 0, zm, s * PI / 2);
      const lz = z => s > 0 ? zm - z : z - zm, a = lz(ZP), c = lz(ZF), e = lz(ZB);
      mason(b, () => [Math.min(a, c), Math.max(a, c)], P, CY, 0, { ql: s > 0, qr: s < 0, qph: 1 });
      mason(b, () => [Math.min(c, e), Math.max(c, e)], YE + .05, CY, 0, {});
      b.pop();
    }
    /* 正面：门洞两边和上方的砌石、拱肩 */
    const wo = PW1 / 2, apO = PH + archY(PW1 + PFR1 * 2, PP, 0);
    mason(b, () => [-CW, -wo], P, CY, ZP, { ql: 1 });
    mason(b, () => [wo, CW], P, CY, ZP, { qr: 1 });
    mason(b, () => [-wo, wo], P + apO, CY, ZP, {});
    archFill(b, PW1, PP, P + PH, P + apO, ZP, ZP - .06, ST2, INNER, 5);
    /* 两道退进的尖拱券、双扇门 */
    b.at(0, P, ZP); archRing(b, PW1, PH, PP, PFR1, -.06, .03); b.pop();
    b.at(0, P, ZP - .06); archRing(b, PW2, PH, PP, PFR2, -.08, 0); b.pop();
    b.at(0, P, ZP - .135); door2(b, PW2, PH, PP, cy); b.pop();
    b.quad([-PW1 / 2, P + .003, ZP], [PW1 / 2, P + .003, ZP], [PW1 / 2, P + .003, ZP - .14], [-PW1 / 2, P + .003, ZP - .14], DRESS);
    /* 门洞上方的尖山花 */
    const gy = P + apO + .13;
    for (const t of [-1, 1]) b.beam([t * (wo + .1), P + PH + .02, ZP + .05], [0, gy, ZP + .05], .045, DRESS2, { tz: .05 });
    b.box(0, gy - .03, ZP + .05, .05, .06, .05, DRESS); b.cone(0, gy + .03, ZP + .05, .03, .08, 5, DRESS, { nb: true });
    /* 小玫瑰窗、腰线 */
    rose(b, 0, RY, ZP, RR);
    /* 山墙：砌石、斜压顶、托脚石、三扇盲尖拱、山尖小尖塔（2077 黄铜小飞艇风标） */
    mason(b, y => { const w = CW * Math.max(0, 1 - (y - CY) / (CR - CY)); return [-w, w]; }, CY, CR, ZP, {});
    for (const t of [-1, 1]) { b.beam([t * (CW + OV), CE + .04, ZP + .02], [0, CR + .07, ZP + .02], .1, DRESS2, { tz: .1 }); b.box(t * (CW + .03), CE - .1, ZP + .02, .14, .15, .13, DRESS, { nb: true }); }
    b.box(0, CY - .02, ZP + .02, 2 * CW - .1, .04, .05, DRESS2, { nb: true });
    for (const [x, h] of [[-.12, .07], [0, .15], [.12, .07]]) lancet(b, x, CY + .07, ZP, .06, h, { dark: 1, fr: .022, nosill: true });
    b.box(0, CR - .02, ZP + .02, .11, .12, .11, DRESS2, { nb: true });
    if (cy) { b.box(0, CR + .1, ZP + .02, .13, .03, .13, DRESS); airshipVane(b, 0, CR + .13, ZP + .02, .16, .5); }
    else { b.pyramid(0, CR + .1, ZP + .02, .12, .12, .16, DRESS); finial(b, 0, CR + .24, ZP + .02, false); }
    /* 背山墙 */
    b.at(0, 0, ZB, PI);
    mason(b, y => { const w = CW * Math.max(0, 1 - (y - CY) / (CR - CY)); return [-w, w]; }, CY, CR, 0, {});
    mason(b, () => [-CW, CW], YW, CY, 0, { ql: 1, qr: 1 });
    for (const t of [-1, 1]) b.beam([t * (CW + OV), CE + .04, .02], [0, CR + .07, .02], .1, DRESS2, { tz: .1 });
    lancet(b, 0, CY + .02, 0, .1, .14, { dark: 1, fr: .03, nosill: true });
    b.pop();
    /* 门厅屋顶（屋脊沿 z）、铁花 */
    reseed(7);
    slope(b, [-(CW + OV), CE], [0, CR], ZB - .06, ZP + .07);
    slope(b, [CW + OV, CE], [0, CR], ZB - .06, ZP + .07);
    b.at(0, 0, 0, PI / 2); cresting(b, -(ZP + .02), -(ZB - .02), CR, 0, cy); b.pop();
    /* 前两角带小尖塔的扶壁 */
    for (const s of [-1, 1]) {
      const x = s * CW, z = ZP - .005;
      b.box(x, P, z, .11, .95, .12, sc(.6), { nb: true });
      wedge(b, x, P + .95, z, .11, .1, .12, DRESS2);
      b.box(x, P + .95, z - .015, .09, CY - P - .83, .09, sc(1.5), { nb: true });
      b.box(x, CY + .12, z - .015, .11, .035, .11, DRESS2);
      b.pyramid(x, CY + .155, z - .015, .095, .095, .3, DRESS);
      b.sphere(x, CY + .465, z - .015, .018, 4, DRESS);
    }
    /* 两幅长旗 */
    banner(b, -.37, 1.86, ZP, .1, .76, cy, bad);
    banner(b, .37, 1.86, ZP, .1, .76, cy, false);
    reseed(8);
    ivy(b, -CW + .1, P, ZP, .16, .7, 12);
  }

  /* ================= 两端矮方塔 ================= */
  function tower(b, s, o) {
    const cy = o.cy, x0 = s < 0 ? -T1 : T0, x1 = s < 0 ? -T0 : T1, xc = (x0 + x1) / 2, hw = (T1 - T0) / 2;
    reseed(10 + s);
    b.box(xc, P - .04, TZC, 2 * hw + .06, .14, 2 * hw + .06, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    stoneBox(b, x0, x1, P + .1, TY, TZ0, TZ1, { rh: .18, [s > 0 ? "nl" : "nr"]: true });
    b.at(s > 0 ? x0 : x1, 0, TZC, -s * PI / 2); mason(b, () => [-hw, hw], YW - .05, TY, 0, { ql: 1, qr: 1, qph: 1, rh: .18 }); b.pop();
    for (const y of [.6, YW]) b.box(xc, y, TZC, 2 * hw + .05, .045, 2 * hw + .05, DRESS2, { nb: true, top: DRESS });
    b.at(xc, 0, TZC);
    lancet(b, 0, .74, hw, .13, .44, { hood: 1, two: 1, cy, e: .48 });
    lancet(b, 0, 1.73, hw, .09, .1, { cy, e: .42 });
    b.at(0, 0, 0, s * PI / 2); lancet(b, 0, .74, hw, .13, .44, { hood: 1, two: 1, cy, e: .48, dark: s < 0 }); slit(b, 0, 1.75, hw); b.pop();
    b.at(0, 0, 0, PI); slit(b, 0, 1.0, hw); b.pop();
    for (const a of [0, s * PI / 2]) { b.at(0, 0, 0, a); for (let i = 0; i < 3; i++) cbox(b, -hw + .07 + i * (2 * hw - .14) / 2, TY - .1, hw - .02, .05, .1, hw + .045, DRESS2); b.pop(); }
    b.box(0, TY, 0, 2 * hw + .12, .07, 2 * hw + .12, DRESS2, { top: DRESS, nb: true });
    b.pop();
    reseed(12 + s);
    const d0 = hw + .1;
    hipRoof(b, xc, TZC, d0, d0, 0, TY + .07, TR, 3);
    /* 塔顶正面小老虎窗 */
    const ye = TY + .07, yb = ye + .1, zf = TZC + d0 * (1 - (yb - ye) / (TR - ye)) + .01, lw = .12, lh = .12, dd = .16;
    b.box(xc, yb - .02, zf - dd / 2, lw, lh + .02, dd, mix3(SL, STD, .4));
    b.panel(xc, yb + .015, zf + .001, lw * .5, lh * .62, WIN, { e: .42 });
    b.at(xc, yb + lh, zf - dd / 2 + .01, PI / 2); b.gable(0, 0, 0, dd + .04, lw + .05, .08, SL2, { end: mix3(SL, STD, .4) }); b.pop();
    finial(b, xc, TR, TZC, cy);
    reseed(14 + s);
    ivy(b, xc - s * .1, P + .1, TZ1, .2, 1.1, 14);
    b.at(s > 0 ? x1 : x0, 0, TZC, s * PI / 2); ivy(b, -.08, P + .1, 0, .24, .8, 6); b.pop();
  }

  /* ================= 前院：龙骨标本 ================= */
  function skeleton(b, o) {
    const bad = o.bad;
    reseed(50);
    b.at(-1.45, 0, 1.05, -2.36, .9);                         /* 局部 +x 是龙头方向（朝左前），局部 −z 朝右前 */
    b.box(0, 0, 0, 1.0, .06, .32, mix3(ST2, STD, .3), { top: DRESS2 });
    b.box(0, .06, 0, .92, .03, .26, DRESS, { nb: true });
    b.at(0, 0, 0, PI); b.panel(.1, .016, .161, .16, .034, BRONZE, M); b.pop();
    const Y0 = .09;
    const SP = [[-.5, .02, .1], [-.43, .045, .06], [-.35, .09, .02], [-.27, .16, 0], [-.19, .24, 0], [-.11, .31, 0], [-.03, .345, 0], [.05, .355, 0], [.13, .35, 0], [.21, .335, 0], [.28, .375, 0], [.34, .44, 0], [.38, .51, 0], [.41, .57, 0]];
    let prev = null;
    SP.forEach(([x, y, z], i) => {
      const p = [x, Y0 + y, z], k = i < 5 ? .55 + i * .09 : 1;
      if (i % 2 || i > 9) b.box(x, Y0 + y - .016 * k, z, .03 * k, .032 * k, .036 * k, i % 2 ? BONE : BONED, { nb: true });
      if (prev) rod(b, prev, p, .022 * k, BONE);
      if (i >= 5 && i <= 10) { b.panel(x, Y0 + y + .012, z, .012, .045, BONE); b.at(x, 0, z, PI); b.panel(0, Y0 + y + .012, 0, .012, .045, BONE); b.pop(); }
      prev = p;
    });
    /* 肋骨：四对，中间大、两头小；待修时掉了两对，散在石座上 */
    const RB = [[-.07, .8], [.01, 1], [.09, 1], [.17, .82]];
    RB.forEach(([rx, k], j) => {
      if (bad && (j === 1 || j === 2)) return;
      for (const s of [-1, 1]) {
        const yT = Y0 + .345, pts = [[rx, yT, s * .02], [rx + .02, yT - .09 * k, s * .14 * k], [rx + .045, yT - .23 * k, s * .085 * k]];
        rod(b, pts[0], pts[1], .015, BONE); rod(b, pts[1], pts[2], .013, BONED);
      }
    });
    if (bad) for (const [px, pz, a] of [[.05, .1, .3], [.2, -.06, 1.2], [-.25, .04, 2.1]]) { b.at(px, Y0 + .01, pz, a); rod(b, [-.11, 0, 0], [.11, 0, .03], .014, BONE); b.pop(); }
    /* 骨盆、肩胛、四条腿 */
    b.box(-.13, Y0 + .27, 0, .1, .05, .14, BONED);
    for (const s of [-1, 1]) {
      b.box(.18, Y0 + .27, s * .065, .1, .07, .014, BONE);
      const hind = [[-.13, Y0 + .29, s * .06], [-.06, Y0 + .17, s * .1], [-.14, Y0 + .06, s * .1], [-.07, Y0 + .006, s * .11]];
      const fore = [[.2, Y0 + .29, s * .07], [.14, Y0 + .16, s * .11], [.2, Y0 + .05, s * .1], [.27, Y0 + .006, s * .11]];
      for (const leg of [hind, fore]) for (let q = 0; q < 3; q++) rod(b, leg[q], leg[q + 1], [.026, .02, .015][q], q === 2 ? BONED : BONE);
    }
    /* 收拢的翼骨 */
    for (const s of [-1, 1]) {
      const dr = bad ? .12 : 0, a = [.18, Y0 + .34, s * .07], c = [.08, Y0 + .5 - dr, s * .16], d = [-.14, Y0 + .56 - dr * 1.4, s * .14];
      rod(b, a, c, .022, BONE); rod(b, c, d, .018, BONE);
      for (const [fx, fy] of [[-.36, .36], [-.3, .27], [-.2, .23]]) rod(b, d, [fx, Y0 + fy - dr * 1.6, s * .17], .01, BONED);
    }
    /* 铁支架 */
    rod(b, [-.04, Y0, 0], [-.03, Y0 + .33, 0], .014, IRON, M);
    rod(b, [.27, Y0, 0], [.28, Y0 + .36, 0], .014, IRON, M);
    /* 头骨：昂着；待修时掉在石座旁的地上 */
    const skull = () => {
      b.box(0, -.035, 0, .1, .075, .085, BONE);
      b.box(.085, -.04, 0, .09, .045, .06, BONE);
      b.box(.08, -.068, 0, .085, .016, .05, BONED);
      for (const s of [-1, 1]) {
        b.at(.02, -.016, s * .0435, s < 0 ? PI : 0); b.panel(0, 0, 0, .03, .024, VOID); b.pop();
        b.at(-.035, .03, s * .03, 0, 1, s * .42, .95); b.cone(0, 0, 0, .016, .11, 5, BONE, { nb: true }); b.pop();
      }
    };
    if (!bad) { b.at(.45, Y0 + .6, 0, 0, 1, 0, -.22); skull(); b.pop(); }
    else { b.at(.38, .045, -.26, .9, 1, 0, .4); skull(); b.pop(); }
    b.pop();
  }

  /* ================= Lv2（1994）：铁骨玻璃拱顶长廊、菊石 ================= */
  const GX = .42, GZ1 = -1.76, GY0 = .68, GY1 = 1.4, GP = .6;
  function gallery(b, o) {
    reseed(20);
    const z0 = ZB, z1 = GZ1, t = .05, NB = 5, dz = (z0 - z1) / NB;
    stoneBox(b, -GX - t, GX + t, -.22, GY0, z1 - t, z0, { nf: true, rh: .19 });
    qf(b, [-GX, P, z0], [-GX, P, z1], [-GX, GY0, z1], [-GX, GY0, z0], INNER2, [1, 0, 0]);
    qf(b, [GX, P, z0], [GX, P, z1], [GX, GY0, z1], [GX, GY0, z0], INNER2, [-1, 0, 0]);
    qf(b, [-GX, P, z1], [GX, P, z1], [GX, GY0, z1], [-GX, GY0, z1], INNER2, [0, 0, 1]);
    qf(b, [-GX, P + .002, z0], [GX, P + .002, z0], [GX, P + .002, z1], [-GX, P + .002, z1], FLOOR, [0, 1, 0]);
    for (const s of [-1, 1]) b.box(s * (GX + t / 2), GY0, (z0 + z1) / 2 - t / 2, t + .03, .03, z0 - z1 + t, DRESS, { nb: true });
    b.box(0, GY0, z1 - t / 2, 2 * GX + 2 * t + .03, .03, t + .03, DRESS, { nb: true });
    /* 玻璃：侧墙、拱面（按开间分块，待修时碎几块）、端墙 */
    const prof = archPts(2 * GX, GP, 3).map(([x, y]) => [x, GY1 + y]), apex = prof[3][1];
    const broken = (k, i) => o.bad && ((k === 1 && i === 2) || (k === 3 && (i === 4 || i === 3)) || (k === 2 && i === -1));
    for (let k = 0; k < NB; k++) {
      const za = z0 - k * dz, zb = za - dz;
      for (const s of [-1, 1]) if (!broken(k, s)) qf(b, [s * GX, GY0 + .03, za], [s * GX, GY0 + .03, zb], [s * GX, GY1, zb], [s * GX, GY1, za], GLASS, [s, 0, 0], GLS);
      for (let i = 0; i < prof.length - 1; i++) {
        if (broken(k, i)) continue;
        const [xa, ya] = prof[i], [xc, yc] = prof[i + 1];
        qf(b, [xa, ya, za], [xc, yc, za], [xc, yc, zb], [xa, ya, zb], GLASS, [(xa + xc) / 2, (ya + yc) / 2 - GY1 + .2, 0], GLS);
      }
    }
    qf(b, [-GX, GY0 + .03, z1], [GX, GY0 + .03, z1], [GX, GY1, z1], [-GX, GY1, z1], GLASS, [0, 0, -1], GLS);
    b.at(0, GY1, z1); fan(b, archPts(2 * GX, GP, 3), 0, GLASS, GLS); b.pop();
    /* 铁肋、檩条、屋脊、端墙窗棂 */
    for (let k = 0; k <= NB; k++) {
      const z = z0 - k * dz;
      for (const s of [-1, 1]) rod(b, [s * GX, GY0, z], [s * GX, GY1, z], .03, IRON, M);
      for (let i = 0; i < prof.length - 1; i++) rod(b, [prof[i][0] * 1.012, prof[i][1] + .004, z], [prof[i + 1][0] * 1.012, prof[i + 1][1] + .004, z], .026, IRON, M);
    }
    for (const i of [0, 2, 4, 6]) rod(b, [prof[i][0] * 1.012, prof[i][1] + .004, z0], [prof[i][0] * 1.012, prof[i][1] + .004, z1], .022, IRON, M);
    b.box(0, apex - .01, (z0 + z1) / 2, .07, .05, z0 - z1 + .04, IRON, Object.assign({ nb: true }, M));
    for (let k = 1; k < NB; k++) b.cone(0, apex + .03, z0 - k * dz, .018, .07, 4, IRON, M);
    for (const x of [-.21, 0, .21]) rod(b, [x, GY0, z1 - .005], [x, GY1 + archY(2 * GX, GP, x) - .02, z1 - .005], .02, IRON, M);
    rod(b, [-GX, GY1, z1 - .005], [GX, GY1, z1 - .005], .02, IRON, M);
    finial(b, 0, apex + .04, z1, false);
    /* 两排暗色木展柜（玻璃罩里摆矿石）、尽头一座晶簇、门厅后墙的暗门洞 */
    for (const s of [-1, 1]) for (let k = 0; k < 2; k++) {
      const x = s * .22, z = z0 - .28 - k * .4;
      b.box(x, P, z, .2, .2, .26, OAK, { top: OAK2, nb: true });
      b.box(x, P + .2, z, .17, .07, .23, GLASSW, { nb: true, mat: "glass" });
      for (let j = 0; j < 2; j++) b.cone(x - .04 + j * .08, P + .2, z + (R() - .5) * .1, .022, .04 + R() * .03, 4, MIN[(k * 2 + j + (s > 0 ? 2 : 0)) % MIN.length]);
    }
    b.cyl(0, P, z1 + .2, .09, .14, 6, DRESS2, { nb: true });
    for (let j = 0; j < 4; j++) { const a = j / 4 * TAU + .4; b.at(Math.cos(a) * .03, P + .14, z1 + .2 + Math.sin(a) * .03, 0, 1, Math.sin(a) * .35, -Math.cos(a) * .35); b.cone(0, 0, 0, .03, .15 + (j % 2) * .07, 5, MIN[j % 2 ? 0 : 2], { nb: true }); b.pop(); }
    b.at(0, P, ZB - .002, PI); fan(b, outline(.3, .42, 0, .66, 3), 0, INNER); b.pop();
    if (o.bad) { b.at(GX + .2, 0, -1.2, .3, 1, 0, .35); b.panel(0, 0, 0, .18, .3, GLASS, GLS); b.pop(); }
  }
  function ammonite(b, o) {                                  /* 前院右边：一块大菊石斜靠在石座的铁托架上（螺旋渐细的壳，一节节深浅相间，正面朝外） */
    reseed(22);
    b.at(1.44, 0, .86, .5);
    b.box(0, 0, 0, .42, .07, .22, mix3(ST2, STD, .3), { top: DRESS2, nb: true });
    b.box(0, .07, 0, .36, .03, .17, DRESS, { nb: true });
    b.panel(0, .02, .111, .12, .03, BRONZE, M);
    for (const s of [-1, 1]) rod(b, [s * .08, .1, -.04], [s * .06, .3, -.1], .018, IRON, M);
    b.at(0, .1, .0, 0, 1, o.bad ? .6 : -.32, o.bad ? -.5 : 0);
    const d0 = .19, yc = d0 * 1.44 + .01, ph = -PI / 2, N = 26, pts = [];
    for (let i = 0; i <= N; i++) { const th = i * .42, d = d0 * Math.exp(-.11 * th), r = .44 * d, c = Math.cos(ph - th), sn = Math.sin(ph - th); pts.push({ O: [c * (d + r), yc + sn * (d + r)], I: [c * (d - r), yc + sn * (d - r)], z: r * .7, c, sn }); }
    for (let i = 0; i < N; i++) {
      const A = pts[i], B = pts[i + 1], col = mix3(i % 2 ? SHELL : SHELL2, STD, i / N * .3);
      for (const t of [-1, 1]) qf(b, [A.O[0], A.O[1], t * A.z], [B.O[0], B.O[1], t * B.z], [B.I[0], B.I[1], t * B.z * .8], [A.I[0], A.I[1], t * A.z * .8], col, [0, 0, t]);
      qf(b, [A.O[0], A.O[1], A.z], [B.O[0], B.O[1], B.z], [B.O[0], B.O[1], -B.z], [A.O[0], A.O[1], -A.z], mix3(col, C.woodD, .12), [A.c + B.c, A.sn + B.sn, 0]);
    }
    const E = pts[N], ru = Math.hypot(E.O[0], E.O[1] - yc) * 1.05, ring = Array.from({ length: 8 }, (_, i) => [Math.cos(i / 8 * TAU) * ru, yc + Math.sin(i / 8 * TAU) * ru]);
    fan(b, ring, E.z * .6, mix3(SHELL2, STD, .35)); b.at(0, 0, 0, PI); fan(b, ring.map(([x, y]) => [-x, y]), E.z * .6, mix3(SHELL2, STD, .35)); b.pop();
    const A = pts[0], B = pts[1];
    qf(b, [A.O[0], A.O[1], A.z], [A.I[0], A.I[1], A.z * .8], [A.I[0], A.I[1], -A.z * .8], [A.O[0], A.O[1], -A.z], mix3(SHELL2, VOID, .55), [A.O[0] - B.O[0], A.O[1] - B.O[1], 0]);
    b.pop();
    b.pop();
  }

  /* ================= Lv2（2077）：海洋展馆翼、砗磲珍珠 ================= */
  const AX = .62, AZ1 = -1.78, AB = .42, AT = 1.42, TRAD = .3;
  function oceanWing(b, o) {
    reseed(25);
    const z0 = ZB, z1 = AZ1, WL = o.bad ? 1.0 : 1.32;
    stoneBox(b, -AX - .05, AX + .05, -.22, AB, z1 - .05, z0, { nf: true, rh: .2, top: DRESS2 });
    /* 水箱：海色玻璃三面、深色水底衬、水面、沙底 */
    for (const s of [-1, 1]) qf(b, [s * AX, AB, z0], [s * AX, AB, z1], [s * AX, AT, z1], [s * AX, AT, z0], GLASSB, [s, 0, 0], GLS);
    qf(b, [-AX, AB, z1], [AX, AB, z1], [AX, AT, z1], [-AX, AT, z1], GLASSB, [0, 0, -1], GLS);
    qf(b, [-AX + .01, WL, z0 - .01], [AX - .01, WL, z0 - .01], [AX - .01, WL, z1 + .01], [-AX + .01, WL, z1 + .01], WATER, [0, 1, 0], { mat: "water", k: 3 });
    qf(b, [-AX, AB + .01, z0], [AX, AB + .01, z0], [AX, AB + .01, z1], [-AX, AB + .01, z1], SAND, [0, 1, 0]);
    qf(b, [-AX + .01, AB, z0 - .005], [AX - .01, AB, z0 - .005], [AX - .01, WL, z0 - .005], [-AX + .01, WL, z0 - .005], SEAD, [0, 0, -1]);
    /* 黄铜框 */
    const zs = [z0 - .01, (z0 + z1) / 2, z1];
    for (const s of [-1, 1]) for (const z of zs) rod(b, [s * AX, AB, z], [s * AX, AT + .03, z], .045, BRASS, GL);
    for (const y of [AB + .01, AT]) { for (const s of [-1, 1]) rod(b, [s * AX, y, z0], [s * AX, y, z1], .04, BRASS, GL); rod(b, [-AX, y, z1], [AX, y, z1], .04, BRASS, GL); }
    /* 穿过水箱的半圆玻璃隧道（「告白隧道」）、黄铜肋 */
    const NS = 6, ring = Array.from({ length: NS + 1 }, (_, i) => { const a = i / NS * PI; return [Math.cos(a) * TRAD, AB + Math.sin(a) * TRAD]; });
    for (let i = 0; i < NS; i++) qf(b, [ring[i][0], ring[i][1], z0], [ring[i + 1][0], ring[i + 1][1], z0], [ring[i + 1][0], ring[i + 1][1], z1], [ring[i][0], ring[i][1], z1], GLASSW, [ring[i][0] + ring[i + 1][0], ring[i][1] + ring[i + 1][1] - 2 * AB, 0], GLS);
    qf(b, [-TRAD, AB + .02, z0], [TRAD, AB + .02, z0], [TRAD, AB + .02, z1], [-TRAD, AB + .02, z1], mix3(C.woodD, STD, .4), [0, 1, 0]);
    for (let k = 0; k < 3; k++) { const z = z0 - .1 - k * (z0 - z1 - .2) / 2; for (let i = 0; i < NS; i++) rod(b, [ring[i][0] * 1.03, ring[i][1], z], [ring[i + 1][0] * 1.03, ring[i + 1][1], z], .026, BRASS, GL); }
    b.at(0, P, ZB - .002, PI); fan(b, outline(.5, .1, 0, .5, 4), 0, INNER); b.pop();
    /* 沙底的礁石、海藻、珊瑚 */
    for (const [x, z, r] of [[-.48, -1.0, .1], [.46, -1.15, .12], [-.44, -1.55, .1], [.5, -1.62, .09]]) b.sphere(x, AB + .02, z, r, 5, mix3(C.rock, STD, R() * .5), { sy: .6 });
    for (let i = 0; i < 5; i++) {
      const s = i % 2 ? 1 : -1, x = s * (.36 + R() * .2), z = -.95 - R() * .8, h = .35 + R() * .4;
      if (o.bad && i > 2) continue;
      const p1 = [x + .04 * s, AB + h * .38, z + .02], p2 = [x - .03 * s, AB + h * .7, z - .02], p3 = [x + .02 * s, AB + h, z];
      limb(b, [x, AB, z], p1, .026, .02, 4, KELP, { k: 1.2 }); limb(b, p1, p2, .02, .014, 4, mix3(KELP, C.leaf, .2), { k: 1.3 }); limb(b, p2, p3, .014, .003, 4, mix3(KELP, C.leaf, .35), { k: 1.4 });
    }
    for (let i = 0; i < 2; i++) { const x = i ? .42 : -.4, z = -1.7 + i * .05; for (let j = 0; j < 3; j++) { b.at(x + (j - 1) * .03, AB, z, 0, 1, (j - 1) * .4, (j - 1) * .3); b.cone(0, 0, 0, .025, .1 + j * .03, 4, CORAL[i + j % 2], { nb: true }); b.pop(); } }
    /* 小鱼：菱形身子、三角尾鳍 */
    const fishes = [[-.42, .8, -.98, .2], [.4, .98, -1.1, PI + .3], [-.36, 1.14, -1.38, -.2], [.46, .74, -1.5, PI], [-.5, .95, -1.62, .1], [.34, 1.18, -1.3, PI - .2], [-.12, .9, -1.68, -.4]];
    fishes.forEach(([x, y, z, ry], i) => {
      if (o.bad && i > 1) return;
      const col = FISH[i % FISH.length];
      b.at(x, y, z, ry);
      b.at(.02, 0, 0, 0, [1, 1, .5], 0, -PI / 2); b.cone(0, 0, 0, .04, .05, 4, col, { nb: true }); b.pop();
      b.at(.02, 0, 0, 0, [1, 1, .5], 0, PI / 2); b.cone(0, 0, 0, .04, .09, 4, mix3(col, STD, .2), { nb: true }); b.pop();
      b.tri([-.065, 0, 0], [-.11, .035, 0], [-.11, -.035, 0], col); b.tri([-.065, 0, 0], [-.11, -.035, 0], [-.11, .035, 0], col);
      b.pop();
    });
  }
  function valve(b, sy, N, r, inner, outer) {               /* 砗磲的一片壳：铰点在原点，壳口朝 +z，七道放射肋、波浪边（sy=-1 是上壳） */
    const H = [0, 0, 0], pts = [];
    for (let i = 0; i <= N; i++) { const t = -1.25 + 2.5 * i / N; pts.push([[Math.sin(t) * r * .55, -.028 * sy, Math.cos(t) * r * .55], [Math.sin(t) * r, (.022 + (i % 2) * .016) * sy, Math.cos(t) * r]]); }
    for (let i = 0; i < N; i++) {
      const [m0, r0] = pts[i], [m1, r1] = pts[i + 1], ci = i % 2 ? inner : mix3(inner, C.stone, .25), co = i % 2 ? outer : mix3(outer, C.woodL, .2);
      for (const [hint, c] of [[[0, sy, 0], ci], [[0, -sy, 0], co]]) {
        b.tri(...(cross(sub(m0, H), sub(m1, H))[1] * hint[1] > 0 ? [H, m0, m1] : [H, m1, m0]), c);
        qf(b, m0, r0, r1, m1, c, hint);
      }
    }
  }
  function clamPearl(b, o) {                                 /* 平台右边：石座上一只张开的大砗磲，壳里托着一颗大珍珠（待修时珍珠被偷、壳半合） */
    b.at(.84, P, .41, -.4);
    b.box(0, 0, 0, .2, .03, .2, DRESS, { nb: true });
    b.box(0, .03, 0, .16, .1, .16, mix3(ST, DRESS2, .4), { nb: true });
    b.box(0, .13, 0, .2, .025, .2, DRESS, { nb: true });
    const MANT = mix3(mix3(C.seaB, C.crystal2, .35), C.stone, .45), SHL = mix3(C.cream, C.stone, .3);
    b.at(0, .19, -.08);
    valve(b, 1, 7, .17, MANT, SHL);
    b.at(0, .0, 0, 0, 1, o.bad ? -.35 : -1.05); valve(b, -1, 7, .17, MANT, SHL); b.pop();
    if (!o.bad) b.sphere(0, .045, .09, .048, 8, mix3(C.cream, C.white, .55), GL);
    b.pop();
    b.pop();
  }

  /* ================= 2077：玻璃雨棚、售票亭 ================= */
  function canopy(b, o) {
    const y = P + PH - .04, z0 = ZP + .035, z1 = ZP + .34, w = .33, dy = .05;
    if (!o.bad) qf(b, [-w, y + dy, z0], [w, y + dy, z0], [w, y, z1], [-w, y, z1], GLASSW, [0, 1, .2], GLS);
    else qf(b, [-w, y + dy, z0], [0, y + dy, z0], [0, y, z1], [-w, y, z1], GLASSW, [0, 1, .2], GLS);
    rod(b, [-w, y, z1], [w, y, z1], .03, BRASS, GL);
    rod(b, [-w, y + dy, z0], [w, y + dy, z0], .03, BRASS, GL);
    for (const x of [-w, -w / 3, w / 3, w]) rod(b, [x, y + dy, z0], [x, y, z1], .022, BRASS, GL);
    for (const s of [-1, 1]) rod(b, [s * w * .85, y + .36, ZP + .03], [s * w * .85, y + .01, z1 - .01], .016, BRASS, GL);
  }
  function booth(b, o) {                                     /* 台阶右边的八角售票亭：暗绿漆木裙板、黄铜框玻璃、铜穹顶、暖光售票窗 */
    const r = .16;
    b.at(1.45, 0, .78, -.55);
    b.cyl(0, 0, 0, r + .04, .06, 8, DRESS2, { a0: PI / 8, nb: true });
    b.cyl(0, .06, 0, r, .17, 8, BOOTHW, { a0: PI / 8, nb: true, nt: true });
    b.cyl(0, .23, 0, r - .004, .3, 8, GLASS, { a0: PI / 8, nb: true, nt: true, mat: "glass" });
    b.cyl(0, .23, 0, r * .8, .29, 8, mix3(BOOTHW, [.08, .08, .08], .5), { a0: PI / 8, nb: true, nt: true });
    for (let i = 0; i < 8; i++) { const a = (i + .5) / 8 * TAU; rod(b, [Math.cos(a) * r, .06, Math.sin(a) * r], [Math.cos(a) * r, .53, Math.sin(a) * r], .02, BRASS, GL); }
    b.cyl(0, .225, 0, r + .01, .02, 8, BRASS, { a0: PI / 8, nb: true, nt: true, mat: "gloss" });
    b.cyl(0, .53, 0, r + .03, .035, 8, BRASS, { a0: PI / 8, nt: true, mat: "gloss" });
    const rd = r + .03;
    b.cyl(0, .565, 0, rd, rd * .45, 8, mix3(AGED, C.roofG, .25), { r2: rd * .72, a0: PI / 8, nt: true, nb: true, mat: "gloss" });
    b.cyl(0, .565 + rd * .45, 0, rd * .72, rd * .4, 8, AGED, { r2: 0, a0: PI / 8, nb: true, mat: "gloss" });
    b.cone(0, .565 + rd * .85, 0, .018, .07, 4, BRASS, GL);
    /* 售票窗（朝局部 +z）：暖光窗、小台面、铜牌 */
    b.panel(0, .27, r * .8 + .004, .14, .16, o.bad ? mix3(C.lamp, STD, .6) : mix3(C.lamp, C.cream, .3), o.bad ? undefined : { e: .48 });
    b.box(0, .25, r - .01, .16, .02, .06, OAK2, { nb: true });
    b.at(0, .6 - (o.bad ? .03 : 0), r + .02, 0, 1, 0, o.bad ? .25 : 0); b.box(0, -.06, 0, .15, .05, .012, BRASS, Object.assign({ nb: true }, GL)); b.panel(0, -.055, .007, .12, .035, BOOTHW); b.pop();
    b.pop();
  }

  /* ================= Lv3：钟楼、藏品库 ================= */
  const KZ = -.36, KS = .48, KY0 = 1.9, KY1 = 3.26, KB = 3.82;
  function clockTower(b, o) {
    const cy = o.cy, hs = KS / 2;
    reseed(30);
    stoneBox(b, -hs, hs, KY0, KY1, KZ - hs, KZ + hs, { rh: .2 });
    b.box(0, 2.7, KZ, KS + .05, .045, KS + .05, DRESS2, { nb: true, top: DRESS });
    b.at(0, 0, KZ);
    for (const a of [0, PI / 2, -PI / 2]) { b.at(0, 0, 0, a); clock(b, 2.99, hs, .15, cy, o.bad); b.pop(); }
    b.at(0, 0, 0, PI); lancet(b, 0, 2.86, hs, .1, .14, { dark: 1, nosill: 1 }); b.pop();
    for (const a of [0, PI / 2, -PI / 2]) { b.at(0, 0, 0, a); for (let i = 0; i < 3; i++) cbox(b, -hs + .07 + i * (KS - .14) / 2, KY1 - .09, hs - .02, .05, .09, hs + .045, DRESS2); b.pop(); }
    b.box(0, KY1, 0, KS + .1, .07, KS + .1, DRESS2, { top: mix3(DRESS2, INNER, .4) });
    /* 开敞灯亭：四角石墩、尖拱开口、铜钟、一盏小提灯 */
    const pw = .1, ow = KS - pw * 2, yS = KY1 + .14, yA = yS + archY(ow, .7, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box(sx * (hs - pw / 2), KY1 + .07, sz * (hs - pw / 2), pw, yA - KY1 - .07, pw, mix3(DRESS2, ST, R() * .4), { nb: true });
    for (const a of [0, PI / 2, PI, -PI / 2]) { b.at(0, 0, 0, a); archFill(b, ow, .7, yS, KB, hs, hs - pw, ST2, INNER, 2); b.pop(); }
    b.box(0, yA, 0, KS, KB - yA, KS, mix3(ST2, DRESS2, .3), { nb: true });
    b.quad([-hs, yA, -hs], [hs, yA, -hs], [hs, yA, hs], [-hs, yA, hs], INNER);
    rod(b, [-hs + pw, yA - .04, 0], [hs - pw, yA - .04, 0], .04, OAK);
    b.cyl(0, yA - .24, 0, .1, .17, 8, BRONZE, { r2: .055, mat: "metal" });
    b.cyl(0, yA - .26, 0, .105, .022, 8, BRONZE, { r2: .1, mat: "metal", nt: true });
    lantern(b, 0, KY1 + .07, 0, cy, o.bad);
    /* 檐口、四角小尖塔、八角矮尖顶、风向标 */
    b.box(0, KB, 0, KS + .1, .07, KS + .1, DRESS2, { top: DRESS });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const x = sx * (hs + .01), z = sz * (hs + .01); b.box(x, KB + .07, z, .07, .1, .07, DRESS2, { nb: true }); b.pyramid(x, KB + .17, z, .075, .075, .2, DRESS); }
    const y0 = KB + .07, sh = .5, rr = hs * .98;
    b.cyl(0, y0, 0, rr * 1.06, .04, 8, SL2, { r2: rr * .96, nt: true, nb: true, a0: PI / 8 });
    for (let i = 0; i < 3; i++) {
      const t0 = i / 3, t1 = (i + 1) / 3, ra = rr * .96 * (1 - t0), rb = rr * .96 * (1 - t1), col = i % 2 ? SL : mix3(SL, SL2, .5);
      if (i === 2) b.cone(0, y0 + .04 + (sh - .04) * t0, 0, ra, (sh - .04) * (t1 - t0), 8, col, { nb: true, a0: PI / 8 });
      else b.cyl(0, y0 + .04 + (sh - .04) * t0, 0, ra, (sh - .04) * (t1 - t0), 8, col, { r2: rb, nt: true, nb: true, a0: PI / 8 });
    }
    const top = y0 + sh, fr = cy ? BRASS : IRON, fo = cy ? GL : M;
    rod(b, [0, top - .05, 0], [0, top + .18, 0], .024, fr, fo);
    b.sphere(0, top + .03, 0, .028, 4, cy ? BRASS : C.gold, M);
    b.at(0, top + .14, 0, o.bad ? 1.2 : -.5, 1, 0, o.bad ? .3 : 0); b.panel(.06, -.025, 0, .1, .05, fr, fo); b.at(0, 0, 0, PI); b.panel(-.06, -.025, 0, .1, .05, fr, fo); b.pop(); b.pop();
    b.pop();
  }
  const VX0 = 1.14, VX1 = 1.72, VZ0 = -1.0, VZ1 = -.22, VY = .98;
  function vault(b, o) {                                    /* 藏品库：粗凿大石块的矮方库、厚檐口、平顶压顶石和铁通风帽、铁栅小窗、+x 面圆形厚铁门（2077 黄铜） */
    const cy = o.cy, xc = (VX0 + VX1) / 2, zc = (VZ0 + VZ1) / 2, hx = (VX1 - VX0) / 2, hz = (VZ1 - VZ0) / 2;
    reseed(40);
    const rc = y => mix3(mix3(ST2, STD, .25 + R() * .45), C.ivy, y < .25 ? .12 : 0);
    stoneBox(b, VX0, VX1, -.22, VY, VZ0, VZ1, { rh: .2, col: rc, nl: true });
    b.at(VX0, 0, (VZ0 + ZB) / 2, -PI / 2); mason(b, () => [-(ZB - VZ0) / 2, (ZB - VZ0) / 2], -.22, VY, 0, { rh: .2, col: rc }); b.pop();
    b.box(xc, VY - .08, zc, 2 * hx + .04, .05, 2 * hz + .04, DRESS2, { nb: true });
    b.box(xc, VY, zc, 2 * hx + .12, .09, 2 * hz + .12, DRESS, { top: mix3(STD, SL, .5) });
    for (const s of [-1, 1]) { b.box(xc, VY + .09, zc + s * (hz + .03), 2 * hx + .12, .07, .06, DRESS2, { nb: true }); b.box(xc + s * (hx + .03), VY + .09, zc, .06, .07, 2 * hz, DRESS2, { nb: true }); }
    b.cyl(xc, VY + .09, zc, .06, .1, 6, IRON, Object.assign({ nb: true, nt: true }, M)); b.cone(xc, VY + .19, zc, .1, .07, 6, IRON, M);
    /* 正面（+z）两道铁栅小窗 */
    for (const x of [VX0 + .15, VX1 - .15]) {
      b.panel(x, .6, VZ1 + .004, .12, .2, DRESS2); b.panel(x, .63, VZ1 + .006, .08, .14, VOID);
      for (const dx of [-.025, 0, .025]) b.panel(x + dx, .63, VZ1 + .012, .01, .14, IRON, M);
    }
    /* +x 面：料石圈、圆门（待修时半开）、六颗铆钉、转轮、铰链 */
    const dy = .52, dr = .19, fr = cy ? BRASS : IRON, fo = cy ? GL : M, frD = cy ? AGED : mix3(IRON, [.05, .05, .06], .3);
    b.at(VX1, dy, zc, PI / 2);
    const NV = 10;
    for (let i = 0; i < NV; i++) {
      const a0 = i / NV * TAU, a1 = (i + 1) / NV * TAU, r0 = dr + .012, r1 = dr + .09 + (i % 2) * .02;
      const A = [Math.cos(a0) * r0, Math.sin(a0) * r0], B = [Math.cos(a1) * r0, Math.sin(a1) * r0], Cc = [Math.cos(a1) * r1, Math.sin(a1) * r1], D = [Math.cos(a0) * r1, Math.sin(a0) * r1], c = i % 2 ? DRESS : DRESS2;
      qf(b, [A[0], A[1], .03], [B[0], B[1], .03], [Cc[0], Cc[1], .03], [D[0], D[1], .03], c, [0, 0, 1]);
      qf(b, [D[0], D[1], 0], [Cc[0], Cc[1], 0], [Cc[0], Cc[1], .03], [D[0], D[1], .03], DRESS2, [D[0] + Cc[0], D[1] + Cc[1], 0]);
    }
    b.at(0, 0, .004); fan(b, Array.from({ length: 10 }, (_, i) => [Math.cos(i / 10 * TAU) * (dr + .012), Math.sin(i / 10 * TAU) * (dr + .012)]), 0, VOID); b.pop();
    if (o.bad) b.at(-dr, 0, .02, -.6); else b.at(-dr, 0, .02);
    b.at(dr, 0, 0, 0, 1, PI / 2); b.cyl(0, 0, 0, dr, .05, 12, fr, Object.assign({ top: frD, nb: true }, fo)); b.pop();
    b.at(dr, 0, .051); fan(b, Array.from({ length: 12 }, (_, i) => [Math.cos(i / 12 * TAU) * dr * .72, Math.sin(i / 12 * TAU) * dr * .72]), 0, mix3(frD, fr, .4), fo); b.pop();
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + PI / 6; b.at(dr + Math.cos(a) * dr * .86, Math.sin(a) * dr * .86, .05, 0, 1, PI / 2); b.cone(0, 0, 0, .016, .016, 4, frD, Object.assign({ nb: true }, fo)); b.pop(); }
    b.at(dr, 0, .08, 0, 1, PI / 2); b.torus(0, 0, 0, .07, .009, 6, 3, fr, fo); b.pop();
    for (let i = 0; i < 2; i++) { const a = i / 2 * PI + PI / 4; rod(b, [dr - Math.cos(a) * .07, -Math.sin(a) * .07, .08], [dr + Math.cos(a) * .07, Math.sin(a) * .07, .08], .014, fr, fo); }
    b.pop();
    for (const y of [-.1, .1]) b.box(-dr - .02, y - .02, .03, .05, .04, .03, frD, Object.assign({ nb: true }, fo));
    b.pop();
    reseed(41);
    b.at(VX1, 0, zc, PI / 2); ivy(b, .3, 0, 0, .16, .6, 10); b.pop();
  }

  function yews(b, s) {                                      /* 塔后台基上两株修剪成圆锥的紫杉，种在石盆里 */
    reseed(60 + s);
    for (const z of [-.36, -.68]) {
      const x = s * 1.34;
      b.box(x, P, z, .18, .1, .18, DRESS2, { nb: true, top: C.soil });
      b.cone(x, P + .1, z, .1, .42, 6, mix3(C.pine, C.leafD, R() * .5), { k: 1.12, nb: true });
      b.cone(x, P + .3, z, .07, .3, 6, mix3(C.pine, C.leaf, .2), { k: 1.2, nb: true, a0: .5 });
    }
  }

  /* ================= 拼装 ================= */
  function build(b, o) {
    const lv = Math.max(1, Math.min(3, o.lv || 1)), cy = !!o.cyber, bad = !!o.bad, oo = { lv, cy, bad };
    podium(b);
    parapet(b, oo);
    stairs(b);
    for (const s of [-1, 1]) catStatue(b, s, bad);
    wings(b, oo);
    centre(b, oo);
    tower(b, -1, oo); tower(b, 1, oo);
    yews(b, -1); if (lv < 3) yews(b, 1);
    skeleton(b, oo);
    if (cy) {
      canopy(b, oo);
      booth(b, oo);
      b.at(0, P, 0); catLamp(b, -1.02, .42, .72, bad); b.pop();
    }
    if (lv >= 2) {
      for (const x of [-.8, .8]) lucarne(b, x, cy);
      if (cy) { oceanWing(b, oo); clamPearl(b, oo); }
      else { gallery(b, oo); ammonite(b, oo); }
    }
    if (lv >= 3) { clockTower(b, oo); vault(b, oo); }
  }
  /* label 高度 = 最高点 + .2（audit 实测） */
  build.h = o => (o.lv >= 3 ? 4.77 : o.cyber ? 3.16 : 3.2);
  Isle3D.FAC["展馆"] = build;
})();
