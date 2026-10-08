  /* ---- 远景：别的浮岛、天河、航道、来往的飞行器 ---- */
  function farIsles(I, b, rnd) {                           /* 远处一圈浮岛：1994 是林子和小屋，2077 是玻璃塔、尖顶和白石廊柱 */
    const N = I.cyber ? 10 : 8;
    for (let k = 0; k < N; k++) {
      const a = k / N * Math.PI * 2 + rnd() * .45, r = I.R40 * (4.6 + rnd() * 5.5), y = -10 + rnd() * 24, s = .55 + rnd() * 1.3;
      b.at(Math.cos(a) * r, y, Math.sin(a) * r, rnd() * 6.28, s);
      const R0 = 3.6 + rnd() * 2.6, sg = 13, top = [], mid = [], dep = R0 * (1.1 + rnd() * .6);
      for (let i = 0; i < sg; i++) { const t = i / sg * Math.PI * 2, rr = R0 * (.82 + rnd() * .3); top.push([Math.cos(t) * rr, (rnd() - .5) * .25, Math.sin(t) * rr]); mid.push([Math.cos(t) * rr * .62, -dep * .45, Math.sin(t) * rr * .62]); }
      for (let i = 0; i < sg; i++) {
        const j = (i + 1) % sg;
        b.tri([0, .15, 0], top[j], top[i], mix3(C.grass, C.grass2, rnd()));
        b.quad(top[j], top[i], mid[i], mid[j], i % 2 ? C.rock : C.rock2);
        b.tri(mid[j], mid[i], [0, -dep, 0], C.rockD);
      }
      {                                                    /* 霍格沃茨式小城堡：主楼、几座圆塔尖顶、城墙、暖窗；2077 多一座玻璃花房穹顶 */
        const SL = [.26, .29, .36], ST = mix3(C.stone, C.rock2, rnd() * .4), cx = (rnd() - .5) * R0 * .5, cz = (rnd() - .5) * R0 * .5, kh = 2.2 + rnd() * 1.6;
        b.box(cx, 0, cz, 2.4, kh, 1.6, ST); b.gable(cx, kh, cz, 2.6, 1.8, 1.1, SL, { end: ST });
        b.windows(cx, .5, cz + .81, 2.0, kh - .8, 4, 2, C.glow, { e: .6 });
        const nT = 2 + Math.floor(rnd() * 3);
        for (let q = 0; q < nT; q++) {
          const ta = q / nT * 6.28 + rnd(), tx = cx + Math.cos(ta) * (1.5 + rnd() * .6), tz = cz + Math.sin(ta) * (1.1 + rnd() * .5), th = kh + .6 + rnd() * 2.4, tr = .38 + rnd() * .22;
          b.cyl(tx, 0, tz, tr, th, 10, ST); b.cone(tx, th, tz, tr * 1.25, tr * 3.2, 10, SL);
          b.box(tx, th * .62, tz + tr * .97, .14, .26, .02, C.glow, { e: .6 });
        }
        b.box(cx, 0, cz - 1.4, 4.2, .7, .25, mix3(ST, C.stoneD, .3));
        if (I.cyber) { b.sphere(cx + 2.2, 0, cz + 1.4, .9, 10, [.75, .88, .95], { mat: "glass", sy: .9 }); b.box(cx + 2.2, 0, cz + 1.4, 1.5, .12, 1.5, C.stoneD); }
        for (let q = 0; q < 5; q++) { const tx = (rnd() - .5) * R0 * 1.4, tz = (rnd() - .5) * R0 * 1.4; if (Math.hypot(tx - cx, tz - cz) > 2.4) b.cone(tx, 0, tz, .5, 1.5, 6, rnd() < .5 ? C.pine : C.leafD); }
      }
      b.pop();
    }
  }
  function skyRiver(I, b, rnd, P) {                       /* 天河：水带悬在半空，两边木石步道和花木，两头是蓝光的接口环 */
    const yaw = rnd() * 6.28, d = I.R40 * 3.4, cx = Math.cos(yaw) * d, cz = Math.sin(yaw) * d, ux = -Math.sin(yaw), uz = Math.cos(yaw), pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6 - .5) * 2, side = Math.sin(t * 2.2 + 1) * I.R40 * .7; pts.push(new T.Vector3(cx + ux * t * I.R40 * 4.2 + Math.cos(yaw) * side, I.R40 * .55 + Math.sin(t * 1.7) * 3, cz + uz * t * I.R40 * 4.2 + Math.sin(yaw) * side)); }
    const cv = new T.CatmullRomCurve3(pts), n = 90, w = 1.25, wk = .7;
    const S = [];
    for (let i = 0; i <= n; i++) { const p = cv.getPointAt(i / n), tg = cv.getTangentAt(i / n), sx = -tg.z, sz = tg.x, l = Math.hypot(sx, sz) || 1; S.push({ p: [p.x, p.y, p.z], s: [sx / l, 0, sz / l] }); }
    const off = (q, k, dy) => [q.p[0] + q.s[0] * k, q.p[1] + (dy || 0), q.p[2] + q.s[2] * k];
    for (let i = 0; i < n; i++) {
      const a = S[i], c = S[i + 1];
      b.quad(off(a, -w, .02), off(c, -w, .02), off(c, w, .02), off(a, w, .02), C.water, { mat: "water", k: 3, e: .12 });
      for (const sg of [-1, 1]) {
        const k0 = sg * w, k1 = sg * (w + wk), col = i % 2 ? C.stone : C.plank;
        b.quad(off(a, k0, .12), off(c, k0, .12), off(c, k1, .12), off(a, k1, .12), col, { mat: sg > 0 ? "matte" : "gloss" });
        b.quad(off(a, k1, .12), off(c, k1, .12), off(c, k1, -.5), off(a, k1, -.5), C.stoneD);
        b.beam(off(a, k1, .14), off(c, k1, .14), .05, C.stone);
        if (i % 7 === 3) { const q = off(a, sg * (w + wk * .5), .12); b.sphere(q[0], q[1] + .3, q[2], .32, 6, i % 2 ? C.leaf2 : C.bloom, { k: 1.25 }); }
        if (i % 9 === 0) { const q = off(a, sg * (w + wk - .12), .12); b.beam(q, [q[0], q[1] + 1.1, q[2]], .05, C.alloyD, { mat: "metal" }); P.push({ p: [q[0], q[1] + 1.35, q[2]], type: "cat", n: 1, size: 1.3 }); }
      }
      b.quad(off(a, w + wk, -.5), off(c, w + wk, -.5), off(c, -w - wk, -.5), off(a, -w - wk, -.5), C.alloyD, { mat: "metal" });
    }
    for (const q of [S[0], S[n]]) {                        /* 接口环：海蓝色光环竖着立，环下一团水雾 */
      const tg = [q.s[2], 0, -q.s[0]];
      b.push(new Float32Array([q.s[0], 0, q.s[2], 0, 0, 1, 0, 0, tg[0], 0, tg[2], 0, q.p[0], q.p[1] + .9, q.p[2], 1]));
      b.push(trs(0, 0, 0, 0, 1, Math.PI / 2)); b.torus(0, 0, 0, 2.3, .22, 32, 6, C.alloy, { mat: "metal" }); b.torus(0, 0, 0, 2.05, .07, 32, 4, C.seaB, { e: .45 }); b.pop();
      b.pop();
      P.push({ p: [q.p[0], q.p[1] - .3, q.p[2]], type: "mist", n: 14, size: 1.6 });
    }
  }
  const VEH = {                                           /* 飞行器：模型都朝 +z，一个单位上下 */
    catboat(b) {                                           /* 猫球汽艇：圆滚滚的猫头艇身、玻璃罩、金色尾灯 */
      b.sphere(0, 0, 0, .45, 10, C.cream, { mat: "gloss", sy: .82 });
      for (const s of [-1, 1]) { b.push(trs(s * .22, .27, -.06, 0, 1, 0, -s * .3)); b.cone(0, 0, 0, .13, .26, 4, C.cream, { mat: "gloss" }); b.pop(); }
      b.sphere(0, .1, .25, .25, 8, C.tintB, { mat: "glass" });
      b.box(0, -.4, 0, .6, .07, .7, C.alloyD, { mat: "metal" });
      b.box(0, -.08, -.44, .34, .1, .04, C.amber, { e: 1 });
      for (const s of [-1, 1]) b.box(s * .16, -.02, .43, .07, .05, .03, C.white, { e: 1 });
    },
    carpet(b) {                                            /* 魔毯 */
      b.box(0, 0, 0, .9, .035, 1.3, C.cloth);
      b.box(0, .036, 0, .7, .005, 1.1, C.gold, { e: .2 });
      b.box(0, .042, 0, .5, .005, .9, C.cloth2);
      for (let i = 0; i < 5; i++) for (const z of [-.68, .68]) b.box(-.36 + i * .18, -.05, z, .03, .1, .06, C.gold);
    },
    broom(b) {                                             /* 扫帚和骑帚的魔女（尖帽、斗篷、帚头吊着一盏小灯） */
      b.beam([0, 0, -.7], [0, 0, .75], .05, C.woodL);
      b.push(trs(0, 0, -.62, 0, 1, -Math.PI / 2)); b.cone(0, 0, 0, .17, .42, 7, C.hay, { r2: .05 }); b.pop();
      b.cone(0, .02, -.08, .2, .5, 6, [.28, .2, .4]);
      b.sphere(0, .58, -.04, .1, 6, [.96, .82, .7]);
      b.disc(0, .66, -.04, .18, 8, [.22, .16, .32]); b.cone(0, .66, -.04, .1, .3, 6, [.22, .16, .32]);
      b.box(0, -.12, .74, .08, .1, .08, C.lamp, { e: 1 });
    },
    airship(b, cyber) {                                    /* 飞艇：气囊、吊舱、尾鳍、推进器；底下吊着一座带别墅的小浮岛 */
      b.push(trs(0, 0, 0, 0, [1, 1, 2.5])); b.sphere(0, 0, 0, 1.6, 12, cyber ? C.cream : [.86, .7, .5], { mat: "gloss", grad: cyber ? C.panel2 : [.72, .55, .38] }); b.pop();
      for (let i = -2; i <= 2; i++) b.beam([-1.62, 0, i * 1.4], [1.62, 0, i * 1.4], .05, cyber ? C.amber : C.woodD, cyber ? { e: .8 } : null);
      b.box(0, -1.85, .2, .9, .5, 2.4, cyber ? C.alloy : C.wood, { mat: cyber ? "metal" : "matte" });
      b.windows(0, -1.78, 1.41, .8, .3, 4, 1, C.glow, { e: .8 });
      for (const s of [-1, 1]) { b.box(s * 1.05, -.2, -3.4, .08, 1.0, 1.0, cyber ? C.gold : C.roofR, { mat: "metal" }); b.cyl(s * 1.7, -.6, -.6, .25, .7, 8, C.alloyD, { mat: "metal" }); }
      b.box(0, .6, -3.5, .08, 1.0, 1.0, cyber ? C.gold : C.roofR, { mat: "metal" });
      for (const [x, z] of [[-.9, -1], [.9, -1], [-.9, 1.4], [.9, 1.4]]) b.beam([x, -1.4, z], [x * 1.6, -4.4, z * 1.2], .03, C.iron, { mat: "metal" });
      b.at(0, -4.5, .2);
      b.cyl(0, 0, 0, 2.2, .3, 10, C.grass, { nb: 1 }); b.cone(0, -1.8, 0, 2.2, 1.8, 10, C.rock, { r2: 0 }); b.pop();
      b.at(0, -4.2, .2); b.cone(0, 0, 0, 2.2, -1.9, 10, C.rock); b.pop();
      b.at(0, -4.2, .4); b.box(0, 0, 0, 1.4, .9, 1.1, cyber ? C.white : C.plaster); b.gable(0, .9, 0, 1.6, 1.3, .6, cyber ? C.roofT : C.roofB, { end: cyber ? C.white : C.plaster }); b.box(0, .25, .56, .9, .35, .02, C.glow, { e: .8 }); b.pop();
      for (const [x, z] of [[-1.4, -.8], [1.3, .9], [1.2, -1.1]]) { b.cyl(x, -4.2, z, .06, .4, 5, C.woodD); b.sphere(x, -3.6, z, .35, 6, C.leaf, { k: 1.3 }); }
    }
  };
  const VEH_SET = { y1994: [["broom", 9, 1.6], ["carpet", 2, 1.7]], y2077: [["catboat", 18, 1.5], ["carpet", 5, 1.7], ["broom", 6, 1.6]] };

  /* ---- 渲染（three.js） ---- */
  let T = null, R = null, GL2 = null;
  function engine() {
    if (!T) {
      if (!(window.THREE && window.THREE.WebGLRenderer)) {
        const src = document.getElementById("three-src");
        if (src) try { const s = document.createElement("script"); s.textContent = src.textContent; document.head.appendChild(s); } catch (e) { }
      }
      if (window.THREE && window.THREE.WebGLRenderer) T = window.THREE;
    }
    return T;
  }
  function can() {                                          /* 能不能开立体：有 WebGL2、引擎在 */
    if (GL2 == null) {
      try { const c = document.createElement("canvas"), g = window.WebGL2RenderingContext && c.getContext("webgl2"); GL2 = !!g; if (g) { const x = g.getExtension("WEBGL_lose_context"); if (x) x.loseContext(); } } catch (e) { GL2 = false; }
    }
    return GL2 && !!(window.THREE || document.getElementById("three-src"));
  }
  const lin1 = c => c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  const lin = a => { a = col3(a); return [lin1(a[0]), lin1(a[1]), lin1(a[2])]; };
  const tcol = a => { const l = lin(a); return new T.Color(l[0], l[1], l[2]); };

  /* 着色器补丁：自发光（夜里更亮）、随风摆、水面粼粼／垂瀑往下淌、指到和选中的建筑提亮 */
  const VS_HEAD = "attribute vec3 aEK;\nuniform float uTime, uWind;\nvarying vec3 vEK;\nvarying vec3 vWP;\n";
  const VS_BODY = `
vEK = aEK;
#ifndef USE_INSTANCING
if (aEK.y >= 1. && aEK.y < 2.) { vec4 w0 = modelMatrix * vec4(transformed, 1.); float a = (aEK.y - 1.) * .14 * uWind; transformed.x += sin(uTime * 1.9 + w0.x * .7 + w0.z * .4) * a; transformed.z += cos(uTime * 1.5 + w0.z * .8 + w0.x * .3) * a * .6; }
#ifdef IS_WATER
if (aEK.y > 2.5) transformed.y += sin(transformed.x * 2.3 + uTime * 1.7) * sin(transformed.z * 2.1 - uTime * 1.3) * .025;
#endif
vWP = (modelMatrix * vec4(transformed, 1.)).xyz;
#else
vWP = (modelMatrix * instanceMatrix * vec4(transformed, 1.)).xyz;
#endif
`;
  const FS_HEAD = "uniform float uTime, uEmi, uHover, uSel, uNight;\nvarying vec3 vEK;\nvarying vec3 vWP;\n";
  const FS_COLOR = `
#ifdef IS_WATER
diffuseColor.rgb *= mix(vec3(1.), vec3(.3, .34, .4), uNight);   /* 夜里水色压暗，不要亮蓝 */
if (vEK.y > 2.5) { float w = sin(vWP.x * 3.1 + uTime * 1.3) * sin(vWP.z * 2.7 - uTime * 1.1); diffuseColor.rgb *= 1. + w * .16; diffuseColor.rgb += smoothstep(.8, 1., w) * .22; }
else { float s = fract(vWP.y * .9 + uTime * 1.8 + sin(vWP.x * 4. + vWP.z * 3.) * .35); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.95, .98, 1.), smoothstep(.7, 1., s) * .6); }
#endif
`;
  const FS_EMI = `
totalEmissiveRadiance += diffuseColor.rgb * vEK.x * vEK.x * uEmi;
if (vEK.z > .5) {
  if (abs(vEK.z - uHover) < .5) totalEmissiveRadiance += vec3(.09, .07, .03) + diffuseColor.rgb * .18;
  if (abs(vEK.z - uSel) < .5) totalEmissiveRadiance += (vec3(.14, .11, .04) + diffuseColor.rgb * .22) * (.65 + .35 * sin(uTime * 4.));
}
`;
  function stdMat(kind, U) {
    const P = { matte: [.86, 0], gloss: [.32, .08], metal: [.3, .85], glass: [.05, .25], water: [.1, .05] }[kind] || [.86, 0];
    const m = new T.MeshStandardMaterial({ vertexColors: true, roughness: P[0], metalness: P[1] });
    if (kind === "glass") Object.assign(m, { transparent: true, opacity: .42, depthWrite: false, side: T.DoubleSide, envMapIntensity: 1.8 });
    if (kind === "water") { Object.assign(m, { transparent: true, opacity: .86 }); m.defines = { IS_WATER: "" }; }
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\n" + VS_HEAD).replace("#include <begin_vertex>", "#include <begin_vertex>\n" + VS_BODY);
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\n" + FS_HEAD).replace("#include <color_fragment>", "#include <color_fragment>\n" + FS_COLOR).replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n" + FS_EMI);
    };
    return m;
  }
  function geoOf(arr) {
    const n = arr.length / 12, P = new Float32Array(n * 3), N = new Float32Array(n * 3), K = new Float32Array(n * 3), E = new Float32Array(n * 3);
    for (let i = 0, q = 0, j = 0; i < n; i++, q += 12, j += 3) {
      P[j] = arr[q]; P[j + 1] = arr[q + 1]; P[j + 2] = arr[q + 2];
      N[j] = arr[q + 3]; N[j + 1] = arr[q + 4]; N[j + 2] = arr[q + 5];
      K[j] = lin1(Math.max(0, arr[q + 6])); K[j + 1] = lin1(Math.max(0, arr[q + 7])); K[j + 2] = lin1(Math.max(0, arr[q + 8]));
      E[j] = arr[q + 9]; E[j + 1] = arr[q + 10]; E[j + 2] = arr[q + 11];
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(P, 3)); g.setAttribute("normal", new T.BufferAttribute(N, 3));
    g.setAttribute("color", new T.BufferAttribute(K, 3)); g.setAttribute("aEK", new T.BufferAttribute(E, 3));
    g.computeBoundingSphere();
    return g;
  }
  function addMB(mb, parent, M, o) {                       /* 把拼好的模型挂进场景：每种材质一块网格；动的零件各自一组 */
    o = o || {};
    for (const key of Object.keys(mb.b)) {
      const arr = mb.b[key]; if (!arr.length) continue;
      const mat = key.split("|")[0], pk = key.indexOf("|p") > 0, m = new T.Mesh(geoOf(arr), R.mats[mat] || R.mats.matte);
      const sh = R.q.shadow && !o.noShadow;
      m.castShadow = sh && mat !== "glass" && mat !== "water"; m.receiveShadow = sh && mat !== "glass";
      m.matrixAutoUpdate = false; parent.add(m); R.tris += arr.length / 36;
      if (pk) R.picks.push(m); else if (!o.noHit && mat !== "glass" && mat !== "water") R.occ.push(m);
    }
    for (const p of mb.pts) R.pts.push(Object.assign({}, p, { p: M ? xf(M, p.p) : p.p }));
    for (const h of mb.holos) R.holos.push(Object.assign({}, h, { q: M ? h.q.map(v => xf(M, v)) : h.q }));
    for (const d of mb.dyn) {
      const g0 = new T.Group(); g0.matrixAutoUpdate = false; g0.matrix.fromArray(d.m); parent.add(g0);
      const g1 = new T.Group(); g0.add(g1);
      addMB(d.mb, g1, M ? mul(M, d.m) : d.m, o);
      R.dyn.push({ o: g1, type: d.type, axis: d.axis, speed: d.speed, amp: d.amp, ph: R.dyn.length * 1.7 });
    }
  }

  /* 粒子：一个点一颗，按类型在着色器里自己动（炊烟、水雾、萤火、魔光、喷流、航标、猫球灯……） */
  const PT = { smoke: 0, steam: 1, mist: 2, spark: 3, ember: 4, firefly: 5, drone: 6, jet: 7, beacon: 8, cat: 9 };
  const P_VS = `
uniform float uTime, uNight, uPx, uWind, uIsleR;
attribute vec4 aP;
varying vec4 vC; varying float vT;
float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
void main() {
  float ty = aP.x, sd = aP.y, sz = aP.z; vec3 p = position; float a = 1., s = sz; vec3 col = vec3(1.);
  float r1 = h1(sd), r2 = h1(sd + 1.7), r3 = h1(sd + 3.1), dk = 1. - uNight * .62;
  if (ty < .5) { float t = fract(uTime / 4.5 + r1); p += vec3((r2 - .5) * .3 + t * .9 * uWind, t * 2.6, (r3 - .5) * .3 + t * .3); s = sz * (.35 + t * 1.1); a = (1. - t) * smoothstep(0., .12, t) * .5; col = vec3(.8, .78, .78) * dk; }
  else if (ty < 1.5) { float t = fract(uTime / 2.5 + r1); p += vec3((r2 - .5) * .4, t * 1.6, (r3 - .5) * .4); s = sz * (.3 + t * .8); a = (1. - t) * smoothstep(0., .15, t) * .45; col = vec3(.95) * dk; }
  else if (ty < 2.5) { float t = fract(uTime / 3.5 + r1), ang = r2 * 6.283; p += vec3(cos(ang) * (.2 + t * 1.4) * sz, (r3 - .3) * .8 * sz + t * .5, sin(ang) * (.2 + t * 1.4) * sz); s = sz * (.6 + t * 1.2); a = (1. - t) * smoothstep(0., .2, t) * .4; col = vec3(.9, .95, 1.) * dk; }
  else if (ty < 3.5) { float ang = uTime * (.6 + r1) + r2 * 6.283; p += vec3(cos(ang) * .45, sin(uTime * 1.3 + r3 * 6.) * .35, sin(ang) * .45) * sz; s = sz * .2; a = .5 + .5 * sin(uTime * 5. + r1 * 30.); col = mix(vec3(.5, .9, 1.), vec3(.85, .6, 1.), r3) * 1.6; }
  else if (ty < 4.5) { float t = fract(uTime / 1.6 + r1); p += vec3((r2 - .5) * .5, t * 1.2, (r3 - .5) * .5); s = sz * .12; a = (1. - t) * (.6 + .4 * sin(uTime * 20. + r1 * 9.)); col = vec3(1., .5, .18) * 2.; }
  else if (ty < 5.5) { p += vec3(sin(uTime * .4 * (1. + r1) + r2 * 9.) * 1.6, sin(uTime * .7 + r3 * 7.) * .5 + .4, cos(uTime * .33 * (1. + r2) + r1 * 9.) * 1.6) * sz; s = sz * .16; a = uNight * (.3 + .7 * pow(.5 + .5 * sin(uTime * 2. + r1 * 40.), 3.)); col = vec3(.85, 1., .45) * 2.; }
  else if (ty < 6.5) { float R0 = uIsleR * (1.5 + r1 * 1.1), ang = uTime * (.07 + r2 * .08) * (r3 < .5 ? -1. : 1.) + r1 * 6.283; p = vec3(cos(ang) * R0, position.y + 2. + sin(uTime * .5 + r2 * 5.) * .6, sin(ang) * R0); float bl = step(.86, fract(uTime * .9 + r1)); s = sz * (.16 + bl * .14); a = .55 + bl * .45; col = (r3 < .5 ? vec3(1., .3, .25) : vec3(.3, 1., .6)) * 1.8; }
  else if (ty < 7.5) { float t = fract(uTime * 1.6 + r1); p += vec3((r2 - .5) * .3 * t, -t * 2.2, (r3 - .5) * .3 * t) * sz; s = sz * (.42 - .28 * t); a = (1. - t) * .85; col = mix(vec3(.6, .95, 1.), vec3(.2, .5, 1.), t) * 1.8; }
  else if (ty < 8.5) { float bl = pow(max(0., sin(uTime * 2.2 + r1 * 6.)), 8.); s = sz * (.22 + bl * .22); a = .25 + bl * .75; col = vec3(1., .25, .2) * 2.; }
  else { p.y += sin(uTime * 1.3 + r1 * 6.) * .06; s = sz * .4; a = .75 + uNight * .25; col = vec3(1., .62, .26) * (.55 + uNight * .75); }
  vC = vec4(col, a); vT = ty;
  vec4 mv = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(s * uPx / -mv.z, 1., 220.);
}`;
  const P_FS = `
varying vec4 vC; varying float vT;
float tri(vec2 p, vec2 a, vec2 b, vec2 c) { float s0 = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x), s1 = (c.x - b.x) * (p.y - b.y) - (c.y - b.y) * (p.x - b.x), s2 = (a.x - c.x) * (p.y - c.y) - (a.y - c.y) * (p.x - c.x); return ((s0 >= 0. && s1 >= 0. && s2 >= 0.) || (s0 <= 0. && s1 <= 0. && s2 <= 0.)) ? 1. : 0.; }
void main() {
  vec2 q = vec2(gl_PointCoord.x - .5, .5 - gl_PointCoord.y); float r = length(q), a; vec3 c = vC.rgb;
  if (vT > 8.5) {
    float body = smoothstep(.29, .26, length(q - vec2(0., -.06)));
    float ear = max(tri(q, vec2(-.27, .02), vec2(-.05, .15), vec2(-.23, .36)), tri(q, vec2(.27, .02), vec2(.05, .15), vec2(.23, .36)));
    float eye = smoothstep(.045, .03, length(q - vec2(-.1, -.03))) + smoothstep(.045, .03, length(q - vec2(.1, -.03)));
    float shape = max(body, ear);
    a = max(shape, exp(-r * r * 22.) * .22);
    c = mix(c * .5, c * 1.25, shape) * (1. - eye * .8);
  } else if (vT < 2.5) { a = smoothstep(.5, 0., r); a *= a; }
  else { a = exp(-r * r * 22.) + smoothstep(.12, 0., r); }
  a *= vC.a; if (a < .01) discard;
  gl_FragColor = vec4(c, a);
}`;
  function pointsOf(list, soft) {
    const P = [], A = [];
    list.forEach((e, k) => { const ty = PT[e.type] != null ? PT[e.type] : 0; if ((ty <= 2) !== soft) return; for (let i = 0; i < e.n; i++) { P.push(e.p[0], e.p[1], e.p[2]); A.push(ty, k * 7.31 + i * 1.618, e.size || 1, i / e.n); } });
    if (!P.length) return null;
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(P, 3)); g.setAttribute("aP", new T.Float32BufferAttribute(A, 4));
    const U = R.U, m = new T.ShaderMaterial({ uniforms: { uTime: U.uTime, uNight: U.uNight, uPx: U.uPx, uWind: U.uWind, uIsleR: U.uIsleR }, vertexShader: P_VS, fragmentShader: P_FS, transparent: true, depthWrite: false, blending: soft ? T.NormalBlending : T.AdditiveBlending });
    const o = new T.Points(g, m); o.frustumCulled = false; o.renderOrder = soft ? 2 : 3; return o;
  }
  /* 全息屏：扫描线、闪烁、边框；kind 0 招牌，1 门牌，2 营建位的线框围挡 */
  const H_VS = "attribute vec2 aK; varying vec2 vUv; varying vec3 vCol; varying vec2 vK; void main() { vUv = uv; vCol = color; vK = aK; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }";
  const H_FS = `
uniform float uTime, uNight; varying vec2 vUv; varying vec3 vCol; varying vec2 vK;
float hh(float n) { return fract(sin(n * 91.7) * 437.58); }
void main() {
  float ex = min(vUv.x, 1. - vUv.x), ey = min(vUv.y, 1. - vUv.y), edge = max(smoothstep(.035, 0., ex), smoothstep(.06, 0., ey));
  float scan = .6 + .4 * sin(vUv.y * 90. - uTime * 6.), fl = .86 + .14 * sin(uTime * 23. + vK.y * 3.) * sin(uTime * 7. + vK.y), a;
  if (vK.x < .5) { float row = floor(vUv.y * 4.), bx = step(.12, vUv.x) * step(vUv.x, .25 + .65 * hh(row + vK.y + floor(uTime * .5))), rm = step(.25, fract(vUv.y * 4.)) * step(fract(vUv.y * 4.), .7); a = .16 + edge * .75 + bx * rm * .55; }
  else if (vK.x < 1.5) { float g = step(.3, fract(vUv.x * 7.)) * step(.3, fract(vUv.y * 2.)) * step(.35, hh(floor(vUv.x * 7.) + floor(vUv.y * 2.) * 7. + vK.y)); a = .14 + edge * .8 + g * .5; }
  else { float g = max(step(.95, fract(vUv.x * 8.)), step(.9, fract(vUv.y * 6. - uTime * .5))); a = (1. - vUv.y) * (.1 + g * .45) + edge * (1. - vUv.y) * .55; }
  gl_FragColor = vec4(vCol * (1.2 + uNight * 1.3), a * scan * fl * .8);
}`;
  function holoOf(list) {
    if (!list.length) return null;
    const P = [], UV = [], Cc = [], K = [], idx = [];
    list.forEach((h, n) => { const o = n * 4, c = lin(h.c); h.q.forEach(v => P.push(v[0], v[1], v[2])); UV.push(0, 0, 1, 0, 1, 1, 0, 1); for (let i = 0; i < 4; i++) { Cc.push(c[0], c[1], c[2]); K.push(h.kind || 0, n); } idx.push(o, o + 1, o + 2, o, o + 2, o + 3); });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(P, 3)); g.setAttribute("uv", new T.Float32BufferAttribute(UV, 2)); g.setAttribute("color", new T.Float32BufferAttribute(Cc, 3)); g.setAttribute("aK", new T.Float32BufferAttribute(K, 2)); g.setIndex(idx);
    const m = new T.ShaderMaterial({ uniforms: { uTime: R.U.uTime, uNight: R.U.uNight }, vertexShader: H_VS, fragmentShader: H_FS, vertexColors: true, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending });
    const o = new T.Mesh(g, m); o.renderOrder = 4; return o;
  }
  /* 天幕：上中下三段渐变、日月、星星；2077 夜里多一条蓝紫星河 */
  const SKY_VS = "varying vec3 vD; void main() { vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p.xyww; }";
  const SKY_FS = `
uniform vec3 uTop, uHor, uBot, uSun, uSunC; uniform float uNight, uTime, uCy; varying vec3 vD;
float h3(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
void main() {
  vec3 d = normalize(vD); float y = d.y;
  vec3 c = y > 0. ? mix(uHor, uTop, pow(clamp(y, 0., 1.), .5)) : mix(uHor, uBot, pow(clamp(-y, 0., 1.), .4));
  float sd = max(dot(d, normalize(uSun)), 0.);
  c += uSunC * (smoothstep(.9994, .9997, sd) * 4. + pow(sd, 14.) * .22 + pow(sd, 3.) * .05);
  if (uNight > .01) {
    vec3 q = d * 170., cell = floor(q); float r = h3(cell);
    if (r > .982) { float s = smoothstep(.16, 0., length(fract(q) - .5)); c += vec3(.9, .92, 1.) * s * uNight * (.55 + .45 * sin(uTime * 1.7 + r * 90.)) * smoothstep(-.05, .25, y) * 1.4; }
    float band = pow(max(0., 1. - abs(dot(d, normalize(vec3(.35, 1., .25)))) * 2.4), 2.);
    c += mix(vec3(.08, .1, .2), vec3(.22, .1, .38), uCy) * band * uNight * (.6 + .4 * h3(floor(d * 60.)));
  }
  gl_FragColor = vec4(c, 1.);
}`;
  /* 云海：岛下面两层慢慢飘的云 */
  const CL_VS = "varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }";
  const CL_FS = `
uniform float uTime, uSeed; uniform vec3 uCol, uCol2; varying vec3 vW;
float hs(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
float ns(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(hs(i), hs(i + vec2(1, 0)), f.x), mix(hs(i + vec2(0, 1)), hs(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += ns(p) * a; p = p * 2.03 + 7.1; a *= .5; } return s; }
void main() {
  vec2 p = vW.xz * .018 + vec2(uTime * .004, uTime * .0025);
  float n = fbm(p), l = length(vW.xz);
  float a = smoothstep(.42, .72, n) * (1. - smoothstep(160., 520., l));
  gl_FragColor = vec4(mix(uCol2, uCol, smoothstep(.45, .85, n)), a * .9);
}`;
  /* 海：深蓝，近处有粼光，远处融进地平线 */
  const SEA_FS = `
uniform float uTime, uNight; uniform vec3 uCol, uHor; varying vec3 vW;
void main() {
  float l = length(vW.xz), f = smoothstep(120., 1100., l);
  float gl = pow(max(0., sin(vW.x * .08 + uTime * .6) * sin(vW.z * .07 - uTime * .5)), 12.) * (1. - f) * (1. - uNight * .7);
  gl_FragColor = vec4(mix(uCol, uHor, f) + gl * .35, 1.);
}`;
  /* 护罩：透明气泡，边上一圈金蓝的菲涅耳光、淡淡的蜂巢纹，一道光慢慢扫过 */
  const SH_VS = "varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec3 vW; void main() { vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.); vV = -mv.xyz; vP = normalize(position); vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * mv; }";
  const SH_FS = `
uniform float uTime, uNight, uCut; varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec3 vW;
void main() {
  float fr = pow(1. - abs(dot(normalize(vN), normalize(vV))), 4.);
  float lat = asin(clamp(vP.y, -1., 1.)), lon = atan(vP.z, vP.x);
  vec2 g = vec2(lon * 16., lat * 16. + mod(floor(lon * 16.), 2.) * .5); vec2 f = abs(fract(g) - .5);
  float line = smoothstep(.44, .5, max(f.x, f.y));
  float sweep = smoothstep(.08, 0., abs(fract(vW.y * .05 - uTime * .06) - .5) - .38);
  float cut = smoothstep(uCut, uCut + 1.2, vW.y);
  vec3 col = mix(vec3(1., .74, .36), vec3(.42, .82, 1.), .5 + .5 * vP.y);
  float a = (fr * .3 + line * fr * .05 + sweep * .012) * (.3 + .25 * uNight) * cut;
  gl_FragColor = vec4(col, a);
}`;
  /* 航道光流：一圈圈光带，上面一串串车灯往前淌 */
  const LN_VS = "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }";
  const LN_FS = `
uniform float uTime, uNight, uN, uSpd; uniform vec3 uCol; varying vec2 vUv;
void main() {
  float d = fract(vUv.x * uN - uTime * uSpd), car = smoothstep(0., .03, d) * smoothstep(.16, .03, d);
  float k = .3 + .7 * uNight;
  gl_FragColor = vec4(uCol * (.25 + car * 2.6) * (.5 + uNight), (.1 + car * .9) * k);
}`;

  function mkLanes(I, rnd) {                               /* 航道：绕岛的几圈闭合曲线，高低起伏 */
    const out = [], n = I.cyber ? 5 : 3, cols = [C.amber, C.neonC, C.gold, C.neonM, C.amber];
    for (let k = 0; k < n; k++) {
      const Rr = I.R40 * (2.5 + k * 1.05 + rnd() * .5), y = -3 + rnd() * 12 + (k % 2) * 3, ecc = .72 + rnd() * .28, rt = rnd() * 6.28, amp = 1 + rnd() * 2.5, ph = rnd() * 6.28, pts = [];
      for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, x = Math.cos(a) * Rr, z = Math.sin(a) * Rr * ecc; pts.push(new T.Vector3(x * Math.cos(rt) - z * Math.sin(rt), y + Math.sin(a * 2 + ph) * amp, x * Math.sin(rt) + z * Math.cos(rt))); }
      const curve = new T.CatmullRomCurve3(pts, true, "centripetal");
      out.push({ curve, len: curve.getLength(), dir: k % 2 ? -1 : 1, col: cols[k % cols.length], v: 2.5 + rnd() * 2.5 });
    }
    return out;
  }
  function build(desc) {
    const U = R.U, W = R.world, rnd = prng(hashS(desc.name || "空岛") + 99);
    clearWorld();
    R.picks = []; R.occ = []; R.dyn = []; R.pts = []; R.holos = []; R.veh = []; R.ships = []; R.tris = 0;
    const t0 = performance.now(), out = compose(desc), I = out.I;
    R.I = I; R.show = !!desc.showroom; U.uIsleR.value = I.R40;
    addMB(out.st, W, null);
    if (!R.show) {
      const far = new MB(); farIsles(I, far, rnd);
      if (I.cyber) skyRiver(I, far, rnd, R.pts);
      addMB(far, W, null, { noShadow: 1, noHit: 1 });
      /* 来往的飞行器：同型号共用一份模型，实例矩阵每帧更新 */
      R.lanes = mkLanes(I, rnd);
      for (const [type, n, sc] of VEH_SET[I.cyber ? "y2077" : "y1994"]) {
        const vb = new MB(); VEH[type](vb, I.cyber); const ms = [], list = [];
        for (const key of Object.keys(vb.b)) { const mat = key.split("|")[0], im = new T.InstancedMesh(geoOf(vb.b[key]), R.mats[mat] || R.mats.matte, n); im.instanceMatrix.setUsage(T.DynamicDrawUsage); im.frustumCulled = false; W.add(im); ms.push(im); }
        for (let i = 0; i < n; i++) { const L = R.lanes[Math.floor(rnd() * R.lanes.length)]; list.push({ L, t: rnd(), sp: (.7 + rnd() * .6) * L.v / L.len * L.dir, dy: (rnd() - .5) * 1.2, dx: (rnd() - .5) * 1.4, sc: sc * (.85 + rnd() * .3) }); }
        R.veh.push({ ms, list });
      }
      for (let k = 0; k < 2; k++) {                          /* 飞艇：慢慢绕一大圈 */
        const sb = new MB(); VEH.airship(sb, I.cyber); const g = new T.Group(); W.add(g);
        const keep = R.occ.length; addMB(sb, g, null, { noShadow: 1, noHit: 1 }); R.occ.length = keep;
        R.ships.push({ o: g, r: I.R40 * (5.2 + k * 1.6), y: I.R40 * .6 + 5 + k * 6, a: rnd() * 6.28, sp: (.012 + rnd() * .006) * (k ? -1 : 1), sc: 1.5 + k * .4 });
      }
      for (const [dy, sd] of [[0, 1.3], [-7, 5.1]]) {          /* 云海 */
        const cm = new T.ShaderMaterial({ uniforms: { uTime: U.uTime, uSeed: { value: sd }, uCol: R.cloudC, uCol2: R.cloudC2 }, vertexShader: CL_VS, fragmentShader: CL_FS, transparent: true, depthWrite: false });
        const cp = new T.Mesh(new T.PlaneGeometry(1100, 1100), cm); cp.rotation.x = -Math.PI / 2; cp.position.y = -I.D * 1.15 - 9 + dy; cp.renderOrder = 1; W.add(cp);
      }
    } else {
      R.lanes = [];
      const fl = new T.Mesh(new T.PlaneGeometry(400, 400), R.mats.matte); fl.geometry.setAttribute("color", new T.Float32BufferAttribute(new Array(12).fill(.18), 3)); fl.geometry.setAttribute("aEK", new T.Float32BufferAttribute(new Array(12).fill(0), 3));
      fl.rotation.x = -Math.PI / 2; fl.position.y = -.31; fl.receiveShadow = R.q.shadow; W.add(fl);
    }
    for (const soft of [true, false]) { const p = pointsOf(R.pts, soft); if (p) W.add(p); }
    const ho = holoOf(R.holos); if (ho) W.add(ho);
    R.labsData = out.labs; R.homeP = (out.labs.find(l => l.k === "home") || {}).p || null;
    R.hitList = R.picks.concat(R.occ);
    R.buildMs = Math.round(performance.now() - t0);
    mkLabels(out.labs);
    const sc = R.show ? Math.max(6, I.R40) : I.R40;          /* 相机：看全岛 */
    const hf = Math.atan(Math.tan(R.camera.fov * Math.PI / 360) * Math.max(.3, R.camera.aspect)), fit = sc * (R.show ? 1.05 : 1.25) / Math.tan(hf);   /* 竖屏也要装得下整座岛 */
    R.home = { yaw: .72, pitch: R.show ? .32 : .5, dist: Math.max(sc * (R.show ? 1.6 : 2.55), fit), tx: 0, ty: R.show ? 1.2 : .4, tz: 0 };
    R.lim = { dMin: sc * (R.show ? .35 : .9), dMax: Math.max(sc * (R.show ? 3 : 5.5), fit * 1.6) };
    view(R.home, true);
  }
  function clearWorld() {
    const W = R.world;
    W.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && !Object.values(R.mats).includes(o.material)) o.material.dispose(); });
    while (W.children.length) W.remove(W.children[0]);
    if (R.labBox) R.labBox.textContent = "";
  }
  function applySky(part, cyber) {
    const k = Object.assign({}, SKY[part] || SKY["午"], cyber ? SKY77[part] || {} : {}), U = R.U, sky = R.skyU;
    R.part = part;
    U.uNight.value = k.night; U.uEmi.value = .6 + k.night * 1.3;
    sky.uTop.value.copy(tcol(k.top)); sky.uHor.value.copy(tcol(k.hor)); sky.uBot.value.copy(tcol(k.bot)); sky.uNight.value = k.night; sky.uCy.value = cyber ? 1 : 0;
    const sd = nrm(k.sun), mx = Math.max(...k.sunC);
    sky.uSun.value.set(sd[0], sd[1], sd[2]); sky.uSunC.value.copy(tcol(k.sunC.map(v => Math.min(1, v / mx)))).multiplyScalar(k.night > .5 ? .5 : 1.2);
    const r0 = (R.I ? R.I.R40 : 12) * 3;
    R.sun.position.set(sd[0] * r0, sd[1] * r0, sd[2] * r0); R.sun.color.copy(tcol(k.sunC.map(v => Math.min(1, v / mx)))); R.sun.intensity = mx * (k.night > .5 ? .9 : 1.75);
    R.hemi.color.copy(tcol(k.sky)); R.hemi.groundColor.copy(tcol(k.gnd)); R.hemi.intensity = k.night > .5 ? 1.1 : 1.15;
    R.scene.fog.color.copy(tcol(mix3(k.hor, k.sky, .35)));
    R.cloudC.value.copy(tcol(mix3(k.hor, [1, 1, 1], k.night > .5 ? 0 : .45))).multiplyScalar(k.night > .5 ? .55 : 1);
    R.cloudC2.value.copy(tcol(mix3(k.bot, k.sky, .4))).multiplyScalar(k.night > .5 ? .5 : .9);
    R.seaC.value.copy(tcol(k.night > .5 ? [.03, .05, .12] : mix3([.14, .4, .62], k.sky, .25))); R.seaH.value.copy(tcol(mix3(k.hor, k.sky, .35)));
    R.renderer.toneMappingExposure = k.exp * (k.night > .5 ? 1.15 : 1.0);
    R.bloom.strength = .12 + k.night * .28; R.bloom.threshold = k.night > .5 ? .82 : .95; R.bloom.radius = .4;
    R.lamp.intensity = k.night * 9; R.lamp.visible = k.night > .05 && !!R.homeP;
    if (R.homeP) R.lamp.position.set(R.homeP[0], R.homeP[1] - 1.2, R.homeP[2] + 1.6);
    R.scene.environmentIntensity = k.night > .5 ? .55 : .9;
    if (R.envRT) R.envRT.dispose();
    R.envRT = R.pmrem.fromScene(R.envScene, 0, .1, 1000); R.scene.environment = R.envRT.texture;
  }

  /* 名牌：DOM 叠在画布上，点名牌等于点建筑 */
  function mkLabels(labs) {
    const box = R.labBox; box.textContent = "";
    for (const l of labs) { const d = document.createElement("div"); d.className = "i3-lab k-" + l.k; d.textContent = l.n; d.dataset.i = l.i; box.appendChild(d); l.el = d; l.x = l.y = -1e4; }
  }
  const _v = () => new T.Vector3();
  function placeLabels() {
    const v = R._v || (R._v = _v()), W = R.w, H = R.h;
    for (const l of R.labsData || []) {
      v.set(l.p[0], l.p[1], l.p[2]).project(R.camera);
      const vis = v.z < 1 && v.x > -1.15 && v.x < 1.15 && v.y > -1.15 && v.y < 1.15;
      if (!vis) { if (l.el.style.display !== "none") l.el.style.display = "none"; continue; }
      if (l.el.style.display === "none") l.el.style.display = "";
      const x = Math.round((v.x * .5 + .5) * W), y = Math.round((-v.y * .5 + .5) * H);
      if (x !== l.x || y !== l.y) { l.x = x; l.y = y; l.el.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-100%)"; l.el.style.zIndex = String(1000 - Math.round(v.z * 500)); }
      const hv = R.hover === l.i || R.sel === l.i; if (l.hv !== hv) { l.hv = hv; l.el.classList.toggle("on", hv); }
    }
  }

  /* 相机：绕岛转、俯仰、缩放；松手后带一点惯性；闲着会慢慢自己转 */
  const cam = { yaw: .72, pitch: .5, dist: 30, tx: 0, ty: .4, tz: 0 }, cur = Object.assign({}, cam);
  function view(o, snap) { Object.assign(cam, o || {}); clampCam(); if (snap) Object.assign(cur, cam); if (R) R.idle = 0; }
  function clampCam() { cam.pitch = clamp(cam.pitch, .08, 1.38); if (R && R.lim) cam.dist = clamp(cam.dist, R.lim.dMin, R.lim.dMax); }
  function camStep(dt) {
    const k = 1 - Math.exp(-dt * 9);
    for (const key of ["yaw", "pitch", "dist", "tx", "ty", "tz"]) cur[key] += (cam[key] - cur[key]) * k;
    const c = R.camera, cp = Math.cos(cur.pitch);
    c.position.set(cur.tx + Math.sin(cur.yaw) * cp * cur.dist, cur.ty + Math.sin(cur.pitch) * cur.dist, cur.tz + Math.cos(cur.yaw) * cp * cur.dist);
    c.lookAt(cur.tx, cur.ty, cur.tz);
    R.sky.position.copy(c.position);
  }
  function hitAt(cx, cy) {
    const rc = R.canvas.getBoundingClientRect(), ray = R.ray || (R.ray = new T.Raycaster()), nd = R._nd || (R._nd = new T.Vector2());
    nd.set((cx - rc.left) / rc.width * 2 - 1, -((cy - rc.top) / rc.height) * 2 + 1);
    ray.setFromCamera(nd, R.camera);
    const h = ray.intersectObjects(R.hitList, false)[0];
    if (!h || R.picks.indexOf(h.object) < 0) return -1;
    return Math.round(h.object.geometry.attributes.aEK.getZ(h.face.a)) - 1;
  }
  function setHover(i) { if (R.hover === i) return; R.hover = i; R.U.uHover.value = i >= 0 ? i + 1 : -9; R.canvas.style.cursor = i >= 0 ? "pointer" : ""; }
  function select(i) { if (!R) return; R.sel = i == null ? -1 : i; R.U.uSel.value = R.sel >= 0 ? R.sel + 1 : -9; }
  function bindInput(cv) {
    const ptr = new Map(); let down = null, pinch = 0, lastHover = 0;
    cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 }; R.idle = 0; if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
    cv.addEventListener("pointermove", e => {
      if (!ptr.has(e.pointerId)) {
        const now = performance.now(); if (e.pointerType === "mouse" && now - lastHover > 90) { lastHover = now; setHover(hitAt(e.clientX, e.clientY)); }
        return;
      }
      const pr = ptr.get(e.pointerId), dx = e.clientX - pr[0], dy = e.clientY - pr[1]; ptr.set(e.pointerId, [e.clientX, e.clientY]); R.idle = 0;
      if (down) down.moved += Math.abs(dx) + Math.abs(dy);
      if (ptr.size >= 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch > 0) { cam.dist *= pinch / d; clampCam(); } pinch = d; return; }
      cam.yaw -= dx * .0065; cam.pitch += dy * .005; clampCam();
    });
    const up = e => {
      if (!ptr.has(e.pointerId)) return; ptr.delete(e.pointerId); pinch = 0;
      if (down && ptr.size === 0) {
        if (down.moved < 7 && performance.now() - down.t < 600 && e.type === "pointerup") { const i = hitAt(e.clientX, e.clientY); if (i >= 0) { select(i); if (R.opt.onPick) R.opt.onPick(i); } else if (R.opt.onVoid) R.opt.onVoid(); }
        down = null;
      }
    };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => setHover(-1));
    cv.addEventListener("wheel", e => { e.preventDefault(); cam.dist *= Math.exp(e.deltaY * .0011); clampCam(); R.idle = 0; }, { passive: false });
    cv.addEventListener("dblclick", () => view(R.home));
    cv.addEventListener("webglcontextlost", e => { e.preventDefault(); const lost = R && R.opt.onLost; close(); R = null; if (lost) lost(); });
  }

  function init(host) {
    const narrow = Math.min(innerWidth, innerHeight) < 640 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || "");
    const q = { pr: Math.min(devicePixelRatio || 1, narrow ? 1.5 : 2), msaa: narrow ? 0 : 4, shadow: true, sm: narrow ? 1024 : 2048 };
    const renderer = new T.WebGLRenderer({ antialias: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    renderer.setPixelRatio(q.pr); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const cv = renderer.domElement; cv.className = "isle-3d";
    const scene = new T.Scene(); scene.fog = new T.Fog(0x8899bb, 60, 330);
    const camera = new T.PerspectiveCamera(40, 1, .1, 1500);
    const U = { uTime: { value: 0 }, uWind: { value: 1 }, uNight: { value: 0 }, uEmi: { value: 1 }, uHover: { value: -9 }, uSel: { value: -9 }, uPx: { value: 600 }, uIsleR: { value: 12 } };
    const skyU = { uTop: { value: new T.Color() }, uHor: { value: new T.Color() }, uBot: { value: new T.Color() }, uSun: { value: new T.Vector3(0, 1, 0) }, uSunC: { value: new T.Color() }, uNight: { value: 0 }, uTime: U.uTime, uCy: { value: 0 } };
    const skyM = new T.ShaderMaterial({ uniforms: skyU, vertexShader: SKY_VS, fragmentShader: SKY_FS, side: T.BackSide, depthWrite: false, fog: false });
    const sky = new T.Mesh(new T.SphereGeometry(600, 48, 24), skyM); sky.renderOrder = -1; sky.frustumCulled = false; scene.add(sky);
    const envScene = new T.Scene(); envScene.add(new T.Mesh(sky.geometry, skyM));
    const sun = new T.DirectionalLight(0xffffff, 2); sun.castShadow = true; sun.shadow.mapSize.set(q.sm, q.sm); sun.shadow.bias = -.0004; sun.shadow.normalBias = .03; scene.add(sun); scene.add(sun.target);
    const hemi = new T.HemisphereLight(0xbbccff, 0x445533, 1); scene.add(hemi);
    const lamp = new T.PointLight(0xffb060, 0, 14, 2); scene.add(lamp);
    const world = new T.Group(); scene.add(world);
    const rt = new T.WebGLRenderTarget(4, 4, { type: T.HalfFloatType, samples: q.msaa });
    const composer = new T.EffectComposer(renderer, rt);
    composer.addPass(new T.RenderPass(scene, camera));
    const bloom = new T.UnrealBloomPass(new T.Vector2(256, 256), .4, .5, .85); composer.addPass(bloom);
    composer.addPass(new T.OutputPass());
    const labBox = document.createElement("div"); labBox.className = "i3-labs";
    labBox.addEventListener("click", e => { const el = e.target.closest(".i3-lab"); if (!el || !R) return; const i = +el.dataset.i; select(i); if (R.opt.onPick) R.opt.onPick(i); });
    R = { renderer, canvas: cv, scene, camera, sky, skyU, envScene, sun, hemi, lamp, world, composer, bloom, labBox, U, q, narrow, pmrem: new T.PMREMGenerator(renderer), cloudC: { value: new T.Color() }, cloudC2: { value: new T.Color() }, seaC: { value: new T.Color() }, seaH: { value: new T.Color() }, mats: {}, idle: 0, hover: -1, sel: -1, raf: 0, ms: 16, slow: 0, opt: {} };
    for (const k of MATS) R.mats[k] = stdMat(k, U);
    bindInput(cv);
    R.ro = new ResizeObserver(() => resize());
  }
  function resize() {
    if (!R || !R.host) return;
    const w = Math.max(1, R.host.clientWidth), h = Math.max(1, R.host.clientHeight);
    if (w === R.w && h === R.h && R.pr === R.q.pr) return;
    R.w = w; R.h = h; R.pr = R.q.pr;
    R.renderer.setPixelRatio(R.q.pr); R.renderer.setSize(w, h, false);
    R.composer.setPixelRatio(R.q.pr); R.composer.setSize(w, h);
    R.camera.aspect = w / h; R.camera.updateProjectionMatrix();
    R.U.uPx.value = h * R.q.pr / (2 * Math.tan(R.camera.fov * Math.PI / 360));
  }
  function frame(now) {
    if (!R || !R.host) return;
    R.raf = requestAnimationFrame(frame);
    const dt = Math.min(.1, R.last ? (now - R.last) / 1000 : .016); R.last = now;
    R.time = (R.time || 0) + dt; R.idle += dt;
    const U = R.U; U.uTime.value = R.time;
    if (R.idle > 9 && !R.show) cam.yaw += dt * .03;
    camStep(dt);
    for (const d of R.dyn) {
      if (d.type === "spin") d.o.rotation[d.axis] = R.time * d.speed + d.ph;
      else d.o.position.y = Math.sin(R.time * d.speed * 2 + d.ph) * d.amp;
    }
    const m = R._m || (R._m = new T.Matrix4()), p = R._p || (R._p = _v()), tg = R._t || (R._t = _v()), up = R._u || (R._u = new T.Vector3(0, 1, 0)), e = R._e || (R._e = _v()), s3 = R._s || (R._s = _v());
    for (const V of R.veh) {
      V.list.forEach((it, i) => {
        it.t = (it.t + it.sp * dt + 1) % 1;
        it.L.curve.getPointAt(it.t, p); it.L.curve.getTangentAt(it.t, tg); if (it.sp < 0) tg.negate();
        p.x += -tg.z * it.dx; p.z += tg.x * it.dx; p.y += it.dy + Math.sin(R.time * 1.3 + i) * .08;
        m.lookAt(e.copy(p).add(tg), p, up); m.scale(s3.set(it.sc, it.sc, it.sc)); m.setPosition(p);
        for (const im of V.ms) im.setMatrixAt(i, m);
      });
      for (const im of V.ms) im.instanceMatrix.needsUpdate = true;
    }
    for (const S of R.ships) { S.a += S.sp * dt; S.o.position.set(Math.cos(S.a) * S.r, S.y + Math.sin(R.time * .3 + S.r) * .8, Math.sin(S.a) * S.r); S.o.rotation.y = -S.a + (S.sp > 0 ? 0 : Math.PI); S.o.scale.setScalar(S.sc); }
    R.composer.render(dt);
    placeLabels();
    R.ms = R.ms * .95 + dt * 1000 * .05;                    /* 慢就降分辨率 */
    if (R.ms > 42 && R.q.pr > .75 && R.time > 2) { R.slow += dt; if (R.slow > 1.5) { R.q.pr = Math.max(.75, R.q.pr - .25); R.slow = 0; resize(); } } else R.slow = 0;
  }

  /* ---- 对外 ---- */
  function open(host, desc, opt) {
    if (!can() || !engine()) return false;
    try {
      if (!R) init(host);
      R.opt = opt || {};
      const bf = R.opt.before && R.opt.before.parentNode === host ? R.opt.before : null;   /* 插在宿主的哪个子节点前：后面的浮层（提示卡、图例）照旧盖在上面 */
      if (R.host !== host) { if (R.host) R.ro.unobserve(R.host); R.host = host; R.ro.observe(host); R.w = 0; }
      if (R.canvas.parentNode !== host) { host.insertBefore(R.canvas, bf); host.insertBefore(R.labBox, bf); }
      resize();
      const key = JSON.stringify([desc.name, desc.size, desc.era, desc.pois, desc.showroom, desc.gap]);
      if (key !== R.key) { R.key = key; build(desc); R.part = null; select(-1); }
      if (R.part !== desc.part || R.cy !== R.I.cyber) { R.cy = R.I.cyber; applySky(desc.part || "午", R.I.cyber); }
      R.canvas.style.display = ""; R.labBox.style.display = "";
      cancelAnimationFrame(R.raf); R.last = 0; R.raf = requestAnimationFrame(frame);
      return true;
    } catch (e) {
      console.error("Isle3D", e); try { close(); } catch (e2) { } return false;
    }
  }
  function close() {
    if (!R) return;
    cancelAnimationFrame(R.raf); R.raf = 0;
    if (R.host) { R.ro.unobserve(R.host); R.host = null; }
    if (R.canvas.parentNode) R.canvas.parentNode.removeChild(R.canvas);
    if (R.labBox.parentNode) R.labBox.parentNode.removeChild(R.labBox);
    setHover(-1);
  }
  const isOpen = () => !!(R && R.host);
  function stats() { if (!R) return null; const i = R.renderer.info; return { tris: Math.round(R.tris), calls: i.render.calls, drawTris: i.render.triangles, geos: i.memory.geometries, buildMs: R.buildMs, ms: Math.round(R.ms * 10) / 10, pr: R.q.pr, picks: R.picks.length, pts: R.pts.length, holos: R.holos.length, three: T.REVISION }; }
  function shot() { if (!R) return null; R.composer.render(0); return R.canvas.toDataURL("image/png"); }
  function setPart(part) { if (R && R.I && R.part !== part) applySky(part, R.I.cyber); }
  return { MB, FAC, PROP, C, mix3, dim3, prng, trs, can, open, close, isOpen, select, stats, shot, setPart, view, cam };
})();
