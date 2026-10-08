/* ================= P246 空岛立体（Three.js） =================
   岛形从岛名种子长出来；主屋、码头、垂瀑口、自留畦和营建位按岛图同一套坐标落位，八种设施各有模型，1–3 级逐级加东西，待修的发暗歪斜。
   画风照霍格沃茨：风化灰石、深色石板瓦、尖拱窗、暖黄窗灯，主屋是一座中世纪城堡；岛沿一圈石栏杆和提灯柱，卵石小路、铁灯柱挂猫球灯。
   1994 线是老派魔女岛；2077 线是同一套石头建筑加上玻璃花房、黄铜骨架、飞艇和系泊桅，不加霓虹、全息和护罩。
   时辰换天光；夜里只有窗灯、提灯和猫球灯微微泛光。拖拽转岛、滚轮或双指缩放，点建筑等于点岛图上的地标。没有 WebGL2 或引擎没载上时照旧用平面岛图。
   引擎：three.js（MIT 许可，随包内嵌，离线可用）。 */
const Isle3D = (() => {
  /* ---- 向量与矩阵（列主序，拼模型用） ---- */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  function m4() { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; }
  function mul(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }
  function rot(axis, a) {
    const c = Math.cos(a), s = Math.sin(a), o = m4();
    if (axis === "x") { o[5] = c; o[6] = s; o[9] = -s; o[10] = c; }
    else if (axis === "z") { o[0] = c; o[1] = s; o[4] = -s; o[5] = c; }
    else { o[0] = c; o[2] = -s; o[8] = s; o[10] = c; }
    return o;
  }
  function trs(x, y, z, ry, s, rx, rz) {
    let m = m4(); m[12] = x || 0; m[13] = y || 0; m[14] = z || 0;
    if (ry) m = mul(m, rot("y", ry)); if (rx) m = mul(m, rot("x", rx)); if (rz) m = mul(m, rot("z", rz));
    if (s != null && s !== 1) { const S = m4(); if (Array.isArray(s)) { S[0] = s[0]; S[5] = s[1]; S[10] = s[2]; } else { S[0] = S[5] = S[10] = s; } m = mul(m, S); }
    return m;
  }
  const xf = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
  function col3(c) { return typeof c === "number" ? [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255] : c; }
  const mix3 = (a, b, t) => { a = col3(a); b = col3(b); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
  const dim3 = (a, k) => { a = col3(a); return [a[0] * k, a[1] * k, a[2] * k]; };

  /* ---- 拼模型 ----
     每个顶点：位置、法线（面法线，低多边形的硬朗面）、颜色、自发光 e（0–1，夜里更亮；霓虹给 1）、摆动 k（1–1.99 随风摆，小数是幅度）、点选号。
     材质 o.mat：matte 哑光（默认）、gloss 亮面漆、metal 金属、glass 玻璃（半透、反光）、water 水（k=2 往下淌、k=3 粼粼）。 */
  const MATS = ["matte", "gloss", "metal", "glass", "water"];
  class MB {
    constructor() { this.b = {}; this.m = m4(); this.st = []; this.pick = 0; this.e = 0; this.k = 0; this.mat = "matte"; this.dyn = []; this.pts = []; this.holos = []; }
    push(m) { this.st.push(this.m); this.m = mul(this.m, m); return this; }
    at(x, y, z, ry, s, rx, rz) { return this.push(trs(x, y, z, ry || 0, s == null ? 1 : s, rx || 0, rz || 0)); }
    pop() { this.m = this.st.length ? this.st.pop() : m4(); return this; }
    tri(a, b, c, col, o) {
      const A = xf(this.m, a), B = xf(this.m, b), C = xf(this.m, c), cr = cross(sub(B, A), sub(C, A)), l = Math.hypot(cr[0], cr[1], cr[2]);
      if (l < 1e-10) return this;
      const n0 = cr[0] / l, n1 = cr[1] / l, n2 = cr[2] / l, cc = col3(col), e = o && o.e != null ? o.e : this.e, k = o && o.k != null ? o.k : this.k, pk = o && o.pick != null ? o.pick : this.pick;
      const mat = (o && o.mat) || this.mat, key = mat + (pk ? "|p" : ""), v = this.b[key] || (this.b[key] = []);
      v.push(A[0], A[1], A[2], n0, n1, n2, cc[0], cc[1], cc[2], e, k, pk, B[0], B[1], B[2], n0, n1, n2, cc[0], cc[1], cc[2], e, k, pk, C[0], C[1], C[2], n0, n1, n2, cc[0], cc[1], cc[2], e, k, pk);
      return this;
    }
    quad(a, b, c, d, col, o) { this.tri(a, b, c, col, o); return this.tri(a, c, d, col, o); }
    box(x, y, z, w, h, d, col, o) {                       /* y 是底面；o.top/front/back/left/right 各面单独上色 */
      o = o || {};
      const x0 = x - w / 2, x1 = x + w / 2, y0 = y, y1 = y + h, z0 = z - d / 2, z1 = z + d / 2;
      this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], o.top || col, o);
      if (!o.nb) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], col, o);
      this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], o.front || col, o);
      this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], o.back || col, o);
      this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], o.right || col, o);
      return this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], o.left || col, o);
    }
    cyl(x, y, z, r, h, seg, col, o) {                     /* 竖柱：底半径 r，顶半径 o.r2；o.a0 起始角；o.nt/o.nb 不封顶／底 */
      o = o || {};
      const r2 = o.r2 != null ? o.r2 : r, tp = o.top || col, a0 = o.a0 || 0, sg = Math.max(3, seg | 0);
      for (let i = 0; i < sg; i++) {
        const a = a0 + i / sg * Math.PI * 2, b = a0 + (i + 1) / sg * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
        const p0 = [x + ca * r, y, z + sa * r], p1 = [x + cb * r, y, z + sb * r], p2 = [x + cb * r2, y + h, z + sb * r2], p3 = [x + ca * r2, y + h, z + sa * r2];
        if (r2 > 1e-6) this.quad(p1, p0, p3, p2, col, o); else this.tri(p1, p0, p3, col, o);
        if (r2 > 1e-6 && !o.nt) this.tri([x, y + h, z], p2, p3, tp, o);
        if (!o.nb && r > 1e-6) this.tri([x, y, z], p0, p1, o.bot || col, o);
      }
      return this;
    }
    cone(x, y, z, r, h, seg, col, o) { return this.cyl(x, y, z, r, h, seg, col, Object.assign({}, o || {}, { r2: 0 })); }
    sphere(x, y, z, r, seg, col, o) {                     /* y 是球心；o.sy 压扁；o.grad 自上而下渐变到这个颜色 */
      o = o || {};
      const sg = Math.max(4, seg | 0), rings = Math.max(3, Math.round(sg / 2)), sy = o.sy || 1;
      const P = (t, a) => [x + Math.sin(t) * Math.cos(a) * r, y + Math.cos(t) * r * sy, z + Math.sin(t) * Math.sin(a) * r];
      for (let j = 0; j < rings; j++) {
        const t0 = j / rings * Math.PI, t1 = (j + 1) / rings * Math.PI, c = o.grad ? mix3(col, o.grad, j / Math.max(1, rings - 1)) : col;
        for (let i = 0; i < sg; i++) { const a = i / sg * Math.PI * 2, b = (i + 1) / sg * Math.PI * 2; this.quad(P(t1, b), P(t1, a), P(t0, a), P(t0, b), c, o); }
      }
      return this;
    }
    torus(x, y, z, R, r, seg, sides, col, o) {           /* 平放的环（反重力环、塔上的光环） */
      const sg = Math.max(6, seg | 0), sd = Math.max(3, sides | 0);
      const P = (u, v) => [x + (R + r * Math.cos(v)) * Math.cos(u), y + r * Math.sin(v), z + (R + r * Math.cos(v)) * Math.sin(u)];
      for (let i = 0; i < sg; i++) for (let j = 0; j < sd; j++) {
        const u0 = i / sg * Math.PI * 2, u1 = (i + 1) / sg * Math.PI * 2, v0 = j / sd * Math.PI * 2, v1 = (j + 1) / sd * Math.PI * 2;
        this.quad(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1), col, o);
      }
      return this;
    }
    gable(x, y, z, w, d, h, col, o) {                     /* 人字顶：屋脊沿 x，o.end 山墙色 */
      o = o || {};
      const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, yt = y + h, ed = o.end || col;
      this.quad([x0, y, z1], [x1, y, z1], [x1, yt, z], [x0, yt, z], col, o);
      this.quad([x1, y, z0], [x0, y, z0], [x0, yt, z], [x1, yt, z], col, o);
      this.tri([x1, y, z1], [x1, y, z0], [x1, yt, z], ed, o);
      return this.tri([x0, y, z0], [x0, y, z1], [x0, yt, z], ed, o);
    }
    pyramid(x, y, z, w, d, h, col, o) {
      const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, T = [x, y + h, z];
      this.tri([x0, y, z1], [x1, y, z1], T, col, o); this.tri([x1, y, z1], [x1, y, z0], T, col, o);
      this.tri([x1, y, z0], [x0, y, z0], T, col, o); return this.tri([x0, y, z0], [x0, y, z1], T, col, o);
    }
    disc(x, y, z, r, seg, col, o) { const sg = Math.max(3, seg | 0); for (let i = 0; i < sg; i++) { const a = i / sg * Math.PI * 2, b = (i + 1) / sg * Math.PI * 2; this.tri([x, y, z], [x + Math.cos(b) * r, y, z + Math.sin(b) * r], [x + Math.cos(a) * r, y, z + Math.sin(a) * r], col, o); } return this; }
    ring(x, y, z, r1, r2, seg, col, o) { const sg = Math.max(3, seg | 0); for (let i = 0; i < sg; i++) { const a = i / sg * Math.PI * 2, b = (i + 1) / sg * Math.PI * 2; this.quad([x + Math.cos(a) * r1, y, z + Math.sin(a) * r1], [x + Math.cos(a) * r2, y, z + Math.sin(a) * r2], [x + Math.cos(b) * r2, y, z + Math.sin(b) * r2], [x + Math.cos(b) * r1, y, z + Math.sin(b) * r1], col, o); } return this; }
    beam(a, b, t, col, o) {                               /* 两点之间一根方条（栏杆、绳、管线、灯条） */
      const d = sub(b, a), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return this;
      const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
      this.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, a[0], a[1], a[2], 1]));
      this.box(0, 0, 0, t, L, (o && o.tz) || t, col, o); return this.pop();
    }
    panel(x, y, z, w, h, col, o) {                        /* 竖立的薄板（招牌、全息屏、窗格），面朝 +z */
      return this.quad([x - w / 2, y, z], [x + w / 2, y, z], [x + w / 2, y + h, z], [x - w / 2, y + h, z], col, o);
    }
    windows(x, y, z, w, h, cols, rows, col, o) {          /* 一面墙上的一排排窗（面朝 +z）；夜里亮 */
      const gw = w / cols, gh = h / rows, e = o && o.e != null ? o.e : .85;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        if (o && o.skip && o.skip(i, j)) continue;
        this.panel(x - w / 2 + gw * (i + .5), y + gh * j + gh * .18, z + .005, gw * .62, gh * .62, col, Object.assign({}, o, { e }));
      }
      return this;
    }
    /* 动的零件：绕轴转（风车叶、光环）、上下浮（法球、悬浮招牌）；fn 在支点为原点的局部坐标里拼 */
    spin(px, py, pz, axis, speed, fn) { const sb = new MB(); sb.pick = this.pick; sb.e = this.e; sb.mat = this.mat; fn(sb); this.dyn.push({ m: mul(this.m, trs(px, py, pz)), type: "spin", axis: axis || "y", speed: speed || 1, mb: sb }); return this; }
    bob(px, py, pz, amp, speed, fn) { const sb = new MB(); sb.pick = this.pick; sb.e = this.e; sb.mat = this.mat; fn(sb); this.dyn.push({ m: mul(this.m, trs(px, py, pz)), type: "bob", amp: amp || .1, speed: speed || 1, mb: sb }); return this; }
    /* 粒子：smoke 炊烟、steam 蒸汽、mist 水雾、spark 魔光、ember 火星、firefly 萤火（夜里）、drone 无人机灯 */
    emit(px, py, pz, type, n, size) { this.pts.push({ p: xf(this.m, [px, py, pz]), type: type || "smoke", n: n || 10, size: size || 1 }); return this; }
    /* 全息屏：一块会闪、会滚动扫描线的发光板（面朝 +z）；col 是主色 */
    holo(x, y, z, w, h, col, o) { const A = xf(this.m, [x - w / 2, y, z]), B = xf(this.m, [x + w / 2, y, z]), C = xf(this.m, [x + w / 2, y + h, z]), D = xf(this.m, [x - w / 2, y + h, z]); this.holos.push({ q: [A, B, C, D], c: col3(col), pick: this.pick, kind: (o && o.kind) || 0 }); return this; }
  }

  /* ---- 噪声 ---- */
  function prng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function mkNoise(seed) {
    const r = prng(seed * 7 + 3), T = new Float32Array(1024); for (let i = 0; i < 1024; i++) T[i] = r();
    const h = (i, j) => T[((i * 73856093) ^ (j * 19349663)) & 1023];
    const sm = t => t * t * (3 - 2 * t);
    const n2 = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi); const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
    return (x, y, oct) => { let s = 0, amp = .5, f = 1, tot = 0; for (let o = 0; o < (oct || 3); o++) { s += n2(x * f + o * 17.3, y * f - o * 9.1) * amp; tot += amp; amp *= .5; f *= 2.03; } return s / tot; };
  }
  function hashS(s) { let h = 2166136261; for (const ch of String(s || "")) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---- 调色板（模型共用） ---- */
  const C = {
    grass: [.42, .62, .3], grass2: [.52, .69, .33], dirt: [.6, .48, .34], soil: [.42, .3, .2], rock: [.47, .42, .38], rock2: [.56, .5, .44], rockD: [.33, .3, .29],
    wood: [.56, .38, .23], woodD: [.38, .25, .16], woodL: [.72, .55, .36], plank: [.66, .5, .32], stone: [.66, .64, .6], stoneD: [.5, .48, .46],
    plaster: [.93, .88, .79], cream: [.97, .93, .84], roofR: [.74, .31, .25], roofB: [.3, .4, .64], roofP: [.47, .33, .64], roofG: [.32, .5, .4], roofT: [.27, .26, .34],
    glass: [.62, .82, .92], glow: [1.0, .8, .45], lamp: [1.0, .76, .38], metal: [.58, .6, .64], iron: [.32, .32, .36], gold: [.95, .78, .35],
    leaf: [.3, .55, .26], leaf2: [.42, .66, .3], leafD: [.22, .42, .22], pine: [.2, .42, .3], bloom: [.97, .7, .8], water: [.32, .6, .86], cloth: [.86, .3, .34], cloth2: [.32, .5, .78],
    crystal: [.45, .9, 1.0], crystal2: [.8, .55, 1.0], hay: [.9, .78, .4], crop: [.55, .74, .28], white: [.96, .96, .98],
    /* 2077：白色复合板、深灰合金、深色玻璃、霓虹 */
    panel: [.9, .91, .93], panel2: [.78, .8, .84], alloy: [.36, .38, .43], alloyD: [.18, .19, .23], tint: [.16, .22, .3], tintB: [.2, .32, .45],
    amber: [1.0, .68, .28], slate: [.26, .29, .36], slate2: [.33, .36, .44], castle: [.62, .6, .56], castle2: [.52, .5, .47], castleD: [.4, .39, .38], ivy: [.24, .4, .22], banner: [.55, .16, .2], banner2: [.18, .26, .52], seaB: [.3, .72, 1.0], neonC: [.2, .95, 1.0], neonM: [1.0, .25, .8], neonP: [.62, .38, 1.0], neonY: [1.0, .85, .3], neonG: [.35, 1.0, .55], neonO: [1.0, .5, .2], pave: [.55, .56, .6], paveD: [.32, .33, .37]
  };
  const SKY = {                                             /* 太阳方向、光色、天光、地光、天幕上中下、夜色程度、曝光 */
    "晨": { sun: [.62, .42, .52], sunC: [1.6, 1.3, 1.0], sky: [.62, .68, .84], gnd: [.36, .3, .28], top: [.42, .56, .82], hor: [.98, .8, .66], bot: [.66, .62, .7], night: 0, exp: 1.0 },
    "午": { sun: [.36, .82, .44], sunC: [1.8, 1.74, 1.6], sky: [.66, .74, .9], gnd: [.4, .38, .32], top: [.28, .5, .88], hor: [.76, .87, .98], bot: [.72, .8, .9], night: 0, exp: 1.0 },
    "暮": { sun: [-.66, .34, .48], sunC: [1.7, 1.0, .62], sky: [.5, .42, .6], gnd: [.3, .21, .24], top: [.2, .18, .42], hor: [1.0, .56, .38], bot: [.46, .33, .42], night: .35, exp: .95 },
    "夜": { sun: [-.25, .78, -.4], sunC: [.36, .44, .7], sky: [.14, .16, .3], gnd: [.06, .05, .09], top: [.015, .015, .05], hor: [.08, .07, .18], bot: [.03, .03, .08], night: 1, exp: .95 }
  };
  const SKY77 = {                                           /* 2077 的夜更亮：城市光污染、航道光流 */
    "夜": { sun: [-.25, .78, -.4], sunC: [.38, .42, .7], sky: [.15, .16, .3], gnd: [.07, .06, .1], top: [.02, .02, .06], hor: [.14, .09, .22], bot: [.05, .04, .1], night: 1, exp: .98 },
    "暮": { sun: [-.66, .34, .48], sunC: [1.6, .85, .7], sky: [.48, .4, .62], gnd: [.28, .18, .3], top: [.16, .12, .4], hor: [.98, .45, .5], bot: [.4, .24, .45], night: .45, exp: .95 }
  };
