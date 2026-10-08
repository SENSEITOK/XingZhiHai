/* ================= P246 空岛立体：WebGL2 自绘，不靠外部库、离线可用 =================
   岛形从岛名种子长出来（岛面起伏、崖底岩层、垂悬的根须与晶簇、垂瀑、绕岛的云）；主屋、码头、垂瀑口、自留畦和营建位按岛图同一套坐标落位，
   八种设施各有模型，按 1–3 级加东西，待修的发暗、歪斜；时辰换天光（晨、午、暮、夜），夜里窗灯与灯笼亮、萤火飞。
   拖拽转岛、滚轮或双指缩放，点建筑等于点岛图上的地标（同一张名帖、同一套营建、升级按钮）。没有 WebGL2 的设备照旧用平面岛图。 */
const Isle3D = (() => {
  /* ---- 向量与矩阵（列主序） ---- */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  function m4() { const m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; }
  function mul(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }
  function persp(fy, asp, n, f) { const t = 1 / Math.tan(fy / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; }
  function ortho(l, r, b, t, n, f) { const o = m4(); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); return o; }
  function lookAt(e, c, u) {
    const z = nrm(sub(e, c)), x = nrm(cross(u, z)), y = cross(z, x), o = m4();
    o[0] = x[0]; o[4] = x[1]; o[8] = x[2]; o[1] = y[0]; o[5] = y[1]; o[9] = y[2]; o[2] = z[0]; o[6] = z[1]; o[10] = z[2];
    o[12] = -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]); o[13] = -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]); o[14] = -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]);
    return o;
  }
  function rot(axis, a) {
    const c = Math.cos(a), s = Math.sin(a), o = m4();
    if (axis === "x") { o[5] = c; o[6] = s; o[9] = -s; o[10] = c; }
    else if (axis === "z") { o[0] = c; o[1] = s; o[4] = -s; o[5] = c; }
    else { o[0] = c; o[2] = -s; o[8] = s; o[10] = c; }
    return o;
  }
  function trs(x, y, z, ry, s, rx, rz) {
    let m = m4(); m[12] = x; m[13] = y; m[14] = z;
    if (ry) m = mul(m, rot("y", ry)); if (rx) m = mul(m, rot("x", rx)); if (rz) m = mul(m, rot("z", rz));
    if (s != null && s !== 1) { const S = m4(); if (Array.isArray(s)) { S[0] = s[0]; S[5] = s[1]; S[10] = s[2]; } else { S[0] = S[5] = S[10] = s; } m = mul(m, S); }
    return m;
  }
  const xf = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
  function col3(c) { return typeof c === "number" ? [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255] : c; }
  const mix3 = (a, b, t) => { a = col3(a); b = col3(b); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
  const dim3 = (a, k) => { a = col3(a); return [a[0] * k, a[1] * k, a[2] * k]; };

  /* ---- 拼模型：每个顶点 12 个数（位置、法线、颜色、自发光、动画类、点选号）；全用面法线，低多边形的硬朗面 ----
     k：0 不动；1～1.99 随风摆（小数是幅度）；2 流水（往下淌）；3 静水（粼粼）。e：自发光 0～1，夜里更亮（窗灯、灯笼、晶簇） */
  class MB {
    constructor() { this.v = []; this.m = m4(); this.st = []; this.pick = 0; this.e = 0; this.k = 0; this.dyn = []; this.pts = []; }
    push(m) { this.st.push(this.m); this.m = mul(this.m, m); return this; }
    at(x, y, z, ry, s, rx, rz) { return this.push(trs(x, y, z, ry || 0, s == null ? 1 : s, rx || 0, rz || 0)); }
    pop() { this.m = this.st.length ? this.st.pop() : m4(); return this; }
    tri(a, b, c, col, o) {
      const A = xf(this.m, a), B = xf(this.m, b), C = xf(this.m, c), cr = cross(sub(B, A), sub(C, A)), l = Math.hypot(cr[0], cr[1], cr[2]);
      if (l < 1e-10) return this;
      const n = [cr[0] / l, cr[1] / l, cr[2] / l], cc = col3(col), e = o && o.e != null ? o.e : this.e, k = o && o.k != null ? o.k : this.k, pk = o && o.pick != null ? o.pick : this.pick;
      this.v.push(A[0], A[1], A[2], n[0], n[1], n[2], cc[0], cc[1], cc[2], e, k, pk, B[0], B[1], B[2], n[0], n[1], n[2], cc[0], cc[1], cc[2], e, k, pk, C[0], C[1], C[2], n[0], n[1], n[2], cc[0], cc[1], cc[2], e, k, pk);
      return this;
    }
    quad(a, b, c, d, col, o) { this.tri(a, b, c, col, o); return this.tri(a, c, d, col, o); }
    box(x, y, z, w, h, d, col, o) {                       /* y 是底面 */
      o = o || {};
      const x0 = x - w / 2, x1 = x + w / 2, y0 = y, y1 = y + h, z0 = z - d / 2, z1 = z + d / 2, sd = col, tp = o.top || col;
      this.quad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], tp, o);
      if (!o.nb) this.quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], sd, o);
      this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], o.front || sd, o);
      this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], o.back || sd, o);
      this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], o.right || sd, o);
      return this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], o.left || sd, o);
    }
    cyl(x, y, z, r, h, seg, col, o) {                     /* 竖柱：底半径 r、顶半径 o.r2；o.a0 起始角；o.nt/o.nb 不封顶／底 */
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
    sphere(x, y, z, r, seg, col, o) {                     /* y 是球心；o.sy 压扁 */
      o = o || {};
      const sg = Math.max(4, seg | 0), rings = Math.max(3, Math.round(sg / 2)), sy = o.sy || 1;
      const P = (t, a) => [x + Math.sin(t) * Math.cos(a) * r, y + Math.cos(t) * r * sy, z + Math.sin(t) * Math.sin(a) * r];
      for (let j = 0; j < rings; j++) {
        const t0 = j / rings * Math.PI, t1 = (j + 1) / rings * Math.PI;
        for (let i = 0; i < sg; i++) {
          const a = i / sg * Math.PI * 2, b = (i + 1) / sg * Math.PI * 2;
          const c = o.grad ? mix3(col, o.grad, j / (rings - 1)) : col;
          this.quad(P(t1, b), P(t1, a), P(t0, a), P(t0, b), c, o);
        }
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
    pyramid(x, y, z, w, d, h, col, o) {                   /* 四坡顶 */
      const x0 = x - w / 2, x1 = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, T = [x, y + h, z];
      this.tri([x0, y, z1], [x1, y, z1], T, col, o); this.tri([x1, y, z1], [x1, y, z0], T, col, o);
      this.tri([x1, y, z0], [x0, y, z0], T, col, o); return this.tri([x0, y, z0], [x0, y, z1], T, col, o);
    }
    disc(x, y, z, r, seg, col, o) { const sg = Math.max(3, seg | 0); for (let i = 0; i < sg; i++) { const a = i / sg * Math.PI * 2, b = (i + 1) / sg * Math.PI * 2; this.tri([x, y, z], [x + Math.cos(b) * r, y, z + Math.sin(b) * r], [x + Math.cos(a) * r, y, z + Math.sin(a) * r], col, o); } return this; }
    beam(a, b, t, col, o) {                               /* 两点之间一根方条（栏杆、绳、根须） */
      const d = sub(b, a), L = Math.hypot(d[0], d[1], d[2]); if (L < 1e-6) return this;
      const yv = [d[0] / L, d[1] / L, d[2] / L], xv = nrm(Math.abs(yv[1]) < .95 ? cross(yv, [0, 1, 0]) : cross(yv, [1, 0, 0])), zv = cross(xv, yv);
      this.push(new Float32Array([xv[0], xv[1], xv[2], 0, yv[0], yv[1], yv[2], 0, zv[0], zv[1], zv[2], 0, a[0], a[1], a[2], 1]));
      this.box(0, 0, 0, t, L, o && o.tz || t, col, o); return this.pop();
    }
    /* 动的零件：绕轴转（风车叶、风向标）、上下浮（法球）；fn 在支点为原点的局部坐标里拼 */
    spin(px, py, pz, axis, speed, fn) { const sb = new MB(); sb.pick = this.pick; sb.e = this.e; fn(sb); this.dyn.push({ m: mul(this.m, trs(px, py, pz)), type: "spin", axis: axis || "y", speed: speed || 1, mb: sb }); return this; }
    bob(px, py, pz, amp, speed, fn) { const sb = new MB(); sb.pick = this.pick; sb.e = this.e; fn(sb); this.dyn.push({ m: mul(this.m, trs(px, py, pz)), type: "bob", amp: amp || .1, speed: speed || 1, mb: sb }); return this; }
    /* 粒子：smoke 炊烟、mist 水雾、spark 魔光、firefly 萤火（夜里才亮） */
    emit(px, py, pz, type, n, size) { this.pts.push({ p: xf(this.m, [px, py, pz]), type: type || "smoke", n: n || 10, size: size || 1 }); return this; }
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

  /* ---- 着色器 ---- */
  const SW = "if(k>=1.0&&k<2.0){float a=k-1.0;w.x+=sin(uT*1.6+w.x*.9+w.z*.7)*.05*a;w.z+=cos(uT*1.3+w.x*.6)*.04*a;}";
  const VS = `#version 300 es
layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;layout(location=2) in vec4 aC;layout(location=3) in vec2 aM;
uniform mat4 uVP,uM,uLVP;uniform float uT;
out vec3 vN;out vec4 vC;out vec3 vW;out vec4 vL;out float vK;out float vPk;
void main(){vec4 w=uM*vec4(aP,1.0);float k=aM.x;${SW}vW=w.xyz;vN=mat3(uM)*aN;vC=aC;vK=k;vPk=aM.y;vL=uLVP*w;gl_Position=uVP*w;}`;
  const FS = `#version 300 es
precision highp float;precision highp sampler2DShadow;
in vec3 vN;in vec4 vC;in vec3 vW;in vec4 vL;in float vK;in float vPk;
uniform vec3 uSun,uSunC,uSky,uGnd,uFog,uEye;uniform vec2 uFogR;uniform float uT,uNight,uHi,uSel,uShOn;uniform sampler2DShadow uSh;
out vec4 o;
float shd(){if(uShOn<.5)return 1.0;vec3 s=vL.xyz/vL.w*.5+.5;if(s.x<0.0||s.x>1.0||s.y<0.0||s.y>1.0||s.z>1.0)return 1.0;vec2 ts=1.0/vec2(textureSize(uSh,0));float r=0.0;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)r+=texture(uSh,vec3(s.xy+vec2(x,y)*ts*1.25,s.z-.0016));return r/9.0;}
void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;vec3 c=vC.rgb;float e=vC.a;
if(vK>1.5&&vK<2.5){float f=fract(vW.y*1.3+uT*1.7+sin(vW.x*2.3+vW.z*1.7)*.3);c=mix(c,vec3(.93,.97,1.0),smoothstep(.6,.95,f)*.7);e=max(e,.22);}
else if(vK>2.5&&vK<3.5){float f=sin(vW.x*4.0+uT*1.7)*sin(vW.z*3.3-uT*1.3);c=mix(c,vec3(.86,.95,1.0),smoothstep(.5,1.0,f)*.5);e=max(e,.12);}
float ndl=max(dot(n,uSun),0.0);float sh=ndl>.001?shd():1.0;
vec3 amb=mix(uGnd,uSky,n.y*.5+.5);vec3 col=c*(amb+uSunC*ndl*sh);
vec3 V=normalize(uEye-vW);float rim=pow(1.0-max(dot(n,V),0.0),3.0);col+=uSky*rim*.16;
col+=c*e*(.32+uNight*1.35);
if(vPk>.5){if(abs(vPk-uSel)<.5)col=col*1.22+vec3(.08,.06,.02);else if(abs(vPk-uHi)<.5)col=col*1.14+vec3(.05,.04,.02);}
float fg=smoothstep(uFogR.x,uFogR.y,length(uEye-vW));col=mix(col,uFog,fg);o=vec4(col,1.0);}`;
  const VS_SH = `#version 300 es
layout(location=0) in vec3 aP;layout(location=3) in vec2 aM;uniform mat4 uLVP,uM;uniform float uT;
void main(){vec4 w=uM*vec4(aP,1.0);float k=aM.x;${SW}gl_Position=uLVP*w;}`;
  const FS_SH = `#version 300 es
precision mediump float;void main(){}`;
  const VS_ID = `#version 300 es
layout(location=0) in vec3 aP;layout(location=3) in vec2 aM;uniform mat4 uVP,uM;uniform float uT;out float vPk;
void main(){vec4 w=uM*vec4(aP,1.0);float k=aM.x;${SW}vPk=aM.y;gl_Position=uVP*w;}`;
  const FS_ID = `#version 300 es
precision highp float;in float vPk;out vec4 o;void main(){float p=floor(vPk+.5);o=vec4(mod(p,256.0)/255.0,floor(p/256.0)/255.0,0.0,1.0);}`;
  const VS_PT = `#version 300 es
layout(location=0) in vec3 aP;layout(location=1) in vec4 aS;uniform mat4 uVP;uniform float uT,uPx,uNight;out float vA;out vec3 vCol;
void main(){float ty=aS.w;float L=fract(uT*aS.y+aS.x);vec3 p=aP;float sz=aS.z;vec3 col=vec3(1.0);float a=1.0;float h=fract(sin(aS.x*91.7)*4375.5);
if(ty<.5){p+=vec3(sin(aS.x*6.28+uT*.7)*.3*L,L*2.4,cos(aS.x*5.1+uT*.5)*.3*L);sz*=.6+L*1.8;col=mix(vec3(.82,.82,.85),vec3(.5,.5,.6),uNight);a=(1.0-L)*smoothstep(0.0,.15,L)*.5;}
else if(ty<1.5){float an=aS.x*6.28;p+=vec3(cos(an)*L*1.8,L*1.4-.4,sin(an)*L*1.8);sz*=.8+L*2.2;col=vec3(.92,.96,1.0);a=(1.0-L)*.32;}
else if(ty<2.5){float an=aS.x*6.28+uT*1.4;p+=vec3(cos(an)*.5,L*1.9,sin(an)*.5);col=mix(vec3(.55,.85,1.0),vec3(1.0,.7,1.0),h);a=sin(L*3.14159)*.95;sz*=.45+.55*sin(L*3.14);}
else if(ty<3.5){p+=vec3(sin(uT*.6+aS.x*20.0)*1.1,sin(uT*.9+aS.x*13.0)*.4+.5,cos(uT*.5+aS.x*17.0)*1.1);col=vec3(1.0,.9,.45);a=(.5+.5*sin(uT*3.0+aS.x*40.0))*.95*uNight;}
else{col=mix(vec3(.85,.88,1.0),vec3(1.0,.92,.8),h);a=(.45+.55*sin(uT*1.7+aS.x*60.0))*uNight;}
vec4 c=uVP*vec4(p,1.0);gl_Position=c;gl_PointSize=ty>3.5?sz*uPx:sz*uPx/max(c.w,.1);vA=a;vCol=col;}`;
  const FS_PT = `#version 300 es
precision mediump float;in float vA;in vec3 vCol;out vec4 o;
void main(){vec2 d=gl_PointCoord-.5;float r=length(d);if(r>.5)discard;o=vec4(vCol,vA*smoothstep(.5,0.0,r));}`;
  const VS_SKY = `#version 300 es
out vec2 vU;void main(){vec2 p=vec2(gl_VertexID==1?3.0:-1.0,gl_VertexID==2?3.0:-1.0);vU=p*.5+.5;gl_Position=vec4(p,.99999,1.0);}`;
  const FS_SKY = `#version 300 es
precision mediump float;in vec2 vU;uniform vec3 uTop,uHor,uBot;uniform float uHy;out vec4 o;
void main(){float y=vU.y;vec3 c=y>uHy?mix(uHor,uTop,smoothstep(uHy,1.0+uHy*.3,y)):mix(uBot,uHor,smoothstep(uHy-.5,uHy,y));o=vec4(c,1.0);}`;

  /* ---- 天光：晨、午、暮、夜 ---- */
  const SKY = {
    "晨": { sun: [.62, .42, .52], sunC: [1.05, .86, .66], sky: [.58, .64, .78], gnd: [.36, .3, .28], top: [.42, .56, .82], hor: [.98, .8, .66], bot: [.66, .62, .7], night: 0 },
    "午": { sun: [.36, .82, .44], sunC: [1.0, .96, .88], sky: [.6, .68, .82], gnd: [.38, .36, .3], top: [.3, .52, .88], hor: [.78, .88, .98], bot: [.72, .8, .9], night: 0 },
    "暮": { sun: [-.66, .34, .48], sunC: [1.05, .6, .38], sky: [.5, .42, .58], gnd: [.32, .22, .24], top: [.22, .2, .45], hor: [1.0, .58, .4], bot: [.5, .36, .42], night: .25 },
    "夜": { sun: [-.25, .78, -.4], sunC: [.34, .4, .62], sky: [.15, .17, .3], gnd: [.07, .06, .1], top: [.02, .02, .07], hor: [.1, .09, .22], bot: [.05, .05, .12], night: 1 }
  };
  /* ---- 调色板（模型共用） ---- */
  const C = {
    grass: [.44, .64, .3], grass2: [.56, .72, .34], dirt: [.6, .48, .34], soil: [.42, .3, .2], rock: [.47, .42, .38], rock2: [.56, .5, .44], rockD: [.33, .3, .29],
    wood: [.56, .38, .23], woodD: [.38, .25, .16], woodL: [.72, .55, .36], plank: [.66, .5, .32], stone: [.66, .64, .6], stoneD: [.5, .48, .46],
    plaster: [.93, .88, .79], cream: [.97, .93, .84], roofR: [.74, .31, .25], roofB: [.3, .4, .64], roofP: [.47, .33, .64], roofG: [.32, .5, .4], roofT: [.27, .26, .34],
    glass: [.62, .82, .92], glow: [1.0, .8, .45], lamp: [1.0, .76, .38], metal: [.58, .6, .64], iron: [.32, .32, .36], gold: [.95, .78, .35],
    leaf: [.3, .55, .26], leaf2: [.42, .66, .3], leafD: [.22, .42, .22], pine: [.2, .42, .3], bloom: [.97, .7, .8], water: [.32, .6, .86], cloth: [.86, .3, .34], cloth2: [.32, .5, .78],
    crystal: [.45, .9, 1.0], crystal2: [.8, .55, 1.0], hay: [.9, .78, .4], crop: [.55, .74, .28], white: [.96, .96, .98]
  };

  /* ---- 状态 ---- */
  let cv = null, gl = null, P = null, host = null, ok = null, scene = null, raf = 0, opts = {}, labWrap = null;
  let shFb = null, shTex = null, idFb = null, idTex = null, idRb = null, idW = 0, idH = 0, skyVao = null;
  const SHN = 2048;
  const cam = { yaw: .7, pitch: .52, dist: 30, dT: null, tx: 0, ty: .6, tz: 0, vy: 0, vp: 0, idle: 0 };
  let hoverId = 0, selId = 0, lastMove = 0, pend = null, t0 = 0, dprNow = 1;
  function supported() {
    if (ok != null) return ok;
    try { const c = document.createElement("canvas"); ok = !!(c.getContext("webgl2")); } catch (e) { ok = false; }
    return ok;
  }
  function prog(vs, fs) {
    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  }
  function init() {
    if (gl) return true;
    cv = document.createElement("canvas"); cv.id = "isle-3d"; cv.className = "isle-3d";
    gl = cv.getContext("webgl2", { antialias: true, preserveDrawingBuffer: true, alpha: false });
    if (!gl) { ok = false; return false; }
    P = { main: prog(VS, FS), sh: prog(VS_SH, FS_SH), id: prog(VS_ID, FS_ID), pt: prog(VS_PT, FS_PT), sky: prog(VS_SKY, FS_SKY) };
    shTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, shTex);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, SHN, SHN);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    shFb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, shFb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shTex, 0);
    gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    skyVao = gl.createVertexArray();
    cv.addEventListener("webglcontextlost", e => { e.preventDefault(); stopLoop(); if (opts.onFail) opts.onFail(); });
    bindInput();
    return true;
  }
  function upload(arr) {
    const vao = gl.createVertexArray(), buf = gl.createBuffer(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
    const S = 48;
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, S, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, S, 12);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, S, 24);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 2, gl.FLOAT, false, S, 40);
    gl.bindVertexArray(null);
    return { vao, buf, n: arr.length / 12 };
  }
  function uploadPts(list) {
    const a = [];
    for (const q of list) { const ty = { smoke: 0, mist: 1, spark: 2, firefly: 3, star: 4 }[q.type] || 0; for (let i = 0; i < q.n; i++) a.push(q.p[0] + (q.jit ? (Math.random() - .5) * q.jit : 0), q.p[1] + (q.jy ? (Math.random() - .5) * q.jy : 0), q.p[2] + (q.jit ? (Math.random() - .5) * q.jit : 0), Math.random(), ty === 4 ? 0 : (q.spd || (ty === 0 ? .16 : ty === 1 ? .32 : ty === 2 ? .22 : .05)) * (.75 + Math.random() * .5), (q.size || 1) * (ty === 4 ? 1 + Math.random() * 1.6 : ty === 0 ? .34 : ty === 1 ? .6 : ty === 2 ? .13 : .11), ty); }
    const vao = gl.createVertexArray(), buf = gl.createBuffer(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 28, 12);
    gl.bindVertexArray(null);
    return { vao, buf, n: a.length / 7 };
  }
  function freeScene() {
    if (!scene || !gl) return;
    for (const g of [scene.st].concat(scene.dyn.map(d => d.g), scene.pts ? [scene.pts] : [], scene.stars ? [scene.stars] : [])) if (g) { gl.deleteBuffer(g.buf); gl.deleteVertexArray(g.vao); }
    scene = null;
  }

  /* ---- 岛：坐标换算、地形、崖底、垂瀑、云、树 ---- */
  const FAC = {}, PROP = {};                              /* FAC[型号](b, o) 拼设施；PROP 小摆件 */
  function islandOf(desc) {
    const seed = hashS(desc.name || "空岛") % 1000003, rnd = prng(seed + 11), nz = mkNoise(seed), nz2 = mkNoise(seed + 5);
    const s = { "小岛": .25, "中岛": .3, "大岛": .35 }[desc.size] || .3, R40 = 40 * s;
    const W = (x, y) => [(x - 50) * s, (y - 52) * s];        /* 岛图坐标（0–100）→ 世界 */
    const edge = a => (41 + (nz(Math.cos(a) * 1.4 + 3, Math.sin(a) * 1.4 + 7, 3) - .5) * 12) * s;   /* 岛缘半径（世界） */
    const pads = [];
    const D = R40 * (.95 + rnd() * .35);
    const base = (x, z) => { const r = Math.hypot(x, z), a = Math.atan2(z, x), e = edge(a), u = Math.min(1, r / e); return (nz(x * .16 + 9, z * .16 - 4, 4) - .5) * 1.5 + .55 * (1 - u * u) - .25 * Math.pow(u, 6); };
    const H = (x, z) => {
      let h = base(x, z);
      for (const p of pads) { const d = Math.hypot(x - p.x, z - p.z); if (d < p.r + .9) { const w = d <= p.r ? 1 : 1 - (d - p.r) / .9; const ws = w * w * (3 - 2 * w); h = h + (p.h - h) * ws; } }
      return h;
    };
    return { seed, rnd, nz, nz2, s, R40, W, edge, pads, D, base, H };
  }
  function buildTerrain(I, b, desc) {
    const NR = 22, NS = 120, nz = I.nz, top = [];
    for (let j = 0; j <= NR; j++) {
      top.push([]);
      for (let i = 0; i < NS; i++) {
        const a = i / NS * Math.PI * 2, e = I.edge(a), r = e * Math.pow(j / NR, .85), x = Math.cos(a) * r, z = Math.sin(a) * r;
        top[j].push([x, I.H(x, z), z]);
      }
    }
    const gcol = (x, z, j) => {
      const n = nz(x * .5 + 40, z * .5 - 20, 2), n2 = I.nz2(x * .12, z * .12, 2);
      let c = mix3(C.grass, C.grass2, n);
      if (n2 > .62) c = mix3(c, [.66, .7, .36], (n2 - .62) * 2.4);
      if (j >= NR - 1) c = mix3(c, [.36, .5, .26], .35);
      for (const p of I.pads) { const d = Math.hypot(x - p.x, z - p.z); if (p.wear && d < p.r) c = mix3(c, p.wear, (1 - d / p.r) * .55); }
      return c;
    };
    for (let j = 0; j < NR; j++) for (let i = 0; i < NS; i++) {
      const i2 = (i + 1) % NS, a = top[j][i], b2 = top[j][i2], c = top[j + 1][i2], d = top[j + 1][i];
      const cx = (a[0] + c[0]) / 2, cz = (a[2] + c[2]) / 2, cl = gcol(cx, cz, j);
      if (j === 0) b.tri(a, c, d, cl); else b.quad(a, b2, c, d, cl);
    }
    /* 岛沿土层 + 崖底：一圈圈往下收，岩层按高度分色 */
    const K = 12, rings = [top[NR]];
    const depthA = a => I.D * (.82 + nz(Math.cos(a) * 2 + 20, Math.sin(a) * 2 + 4, 3) * .45);
    for (let k = 1; k <= K; k++) {
      const u = k / K, ring = [];
      for (let i = 0; i < NS; i++) {
        const a = i / NS * Math.PI * 2, e = I.edge(a), dA = depthA(a);
        const y = k === 1 ? -.45 : -.45 - Math.pow((k - 1) / (K - 1), 1.15) * dA;
        const f = k === 1 ? 1.0 : Math.pow(1 - (k - 1) / K, .75) * (1 + (nz(a * 3 + k * .7, k * .9, 2) - .5) * .32);
        const r = e * f;
        ring.push([Math.cos(a) * r, y, Math.sin(a) * r]);
      }
      rings.push(ring);
    }
    const tip = [0, -I.D * 1.12, 0];
    const rcol = (y, a) => {
      if (y > -.5) return mix3(C.soil, C.dirt, .2);
      const band = Math.sin(y * 2.6 + nz(a * 2, y * .4, 2) * 5);
      let c = band > .35 ? C.rock2 : band < -.45 ? C.rockD : C.rock;
      if (y > -1.6) c = mix3(c, C.soil, .45);
      return mix3(c, [.25, .23, .26], U9.clamp(-y / (I.D * 1.15), 0, 1) * .55);
    };
    for (let k = 0; k < K; k++) for (let i = 0; i < NS; i++) {
      const i2 = (i + 1) % NS, a = rings[k][i], b2 = rings[k][i2], c = rings[k + 1][i2], d = rings[k + 1][i];
      b.quad(b2, a, d, c, rcol((a[1] + d[1]) / 2, i / NS * 6.28));
    }
    for (let i = 0; i < NS; i++) { const i2 = (i + 1) % NS; b.tri(rings[K][i2], rings[K][i], tip, rcol(tip[1], i)); }
    I.rings = rings; I.NS = NS;
    /* 崖底垂刺、根须、晶簇 */
    const rnd = I.rnd;
    for (let k = 0; k < 9; k++) {
      const a = rnd() * 6.28, rr = I.edge(a) * (.25 + rnd() * .5), y = -1.2 - rnd() * I.D * .5, L = 1.2 + rnd() * 3.2, w = .35 + rnd() * .6;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      b.push(trs(x, y, z, rnd() * 6.28, 1, Math.PI)); b.cone(0, 0, 0, w, L, 5, rcol(y - L / 2, a)); b.pop();
    }
    for (let k = 0; k < 14; k++) {
      const a = rnd() * 6.28, e = I.edge(a) * (.85 + rnd() * .12), x = Math.cos(a) * e, z = Math.sin(a) * e, L = .8 + rnd() * 2.4;
      const p = [x, -.4 - rnd() * .5, z], q = [x * (1 + rnd() * .03), p[1] - L, z * (1 + rnd() * .03)];
      b.beam(p, q, .05 + rnd() * .04, rnd() < .6 ? [.32, .5, .24] : [.36, .26, .18], { k: 1.6 });
    }
    for (let k = 0; k < 5; k++) {
      const a = rnd() * 6.28, rr = I.edge(a) * (.45 + rnd() * .35), y = -1.6 - rnd() * I.D * .45, x = Math.cos(a) * rr, z = Math.sin(a) * rr, cc = rnd() < .55 ? C.crystal : C.crystal2;
      for (let q = 0; q < 3; q++) { b.push(trs(x + (rnd() - .5) * .5, y, z + (rnd() - .5) * .5, rnd() * 6.28, 1, Math.PI + (rnd() - .5) * .9, (rnd() - .5) * .9)); b.cone(0, 0, 0, .14 + rnd() * .14, .7 + rnd() * .9, 5, cc, { e: .85 }); b.pop(); }
      b.emit(x, y - .6, z, "spark", 6, 1);
    }
  }
  function groundTex(I, b, desc) {                        /* 岛面上的草丛、花、石头、树 */
    const rnd = I.rnd, occ = (x, z, m) => I.pads.some(p => Math.hypot(x - p.x, z - p.z) < p.r + (m || 0)) || (I.paths || []).some(sg => distSeg(x, z, sg) < .45);
    const inIsle = (x, z, m) => Math.hypot(x, z) < I.edge(Math.atan2(z, x)) - (m || .6);
    const trees = [], nT = Math.round(I.R40 * I.R40 * .42);
    for (let k = 0, tries = 0; k < nT && tries < nT * 12; tries++) {
      const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * 1.02, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!inIsle(x, z, .9) || occ(x, z, .5) || trees.some(t => Math.hypot(t[0] - x, t[1] - z) < .9)) continue;
      if (I.nz2(x * .2 + 3, z * .2, 2) < .42 && rnd() < .65) continue;   /* 成片的林子，空处是草地 */
      trees.push([x, z]); k++;
      const y = I.H(x, z) - .05, s = .75 + rnd() * .55, kind = rnd();
      b.at(x, y, z, rnd() * 6.28, s);
      if (kind < .5) { b.cyl(0, 0, 0, .1, .7, 5, C.woodD); b.sphere(0, 1.05, 0, .55, 7, mix3(C.leaf, C.leaf2, rnd()), { k: 1.35, sy: .9 }); b.sphere(.22, 1.4, .1, .36, 6, C.leaf2, { k: 1.5 }); }
      else if (kind < .85) { b.cyl(0, 0, 0, .09, .5, 5, C.woodD); b.cone(0, .35, 0, .55, .9, 6, C.pine, { k: 1.25 }); b.cone(0, .85, 0, .42, .8, 6, mix3(C.pine, C.leaf, .25), { k: 1.4 }); b.cone(0, 1.3, 0, .28, .7, 6, mix3(C.pine, C.leaf2, .3), { k: 1.55 }); }
      else { b.cyl(0, 0, 0, .09, .65, 5, C.woodD); b.sphere(0, 1.0, 0, .5, 7, C.bloom, { k: 1.35, sy: .85 }); b.sphere(-.2, 1.3, -.1, .3, 6, mix3(C.bloom, C.white, .3), { k: 1.5 }); }
      b.pop();
    }
    const nG = Math.round(I.R40 * I.R40 * 2.2);
    for (let k = 0; k < nG; k++) {
      const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * 1.05, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!inIsle(x, z, .25) || occ(x, z, .1)) continue;
      const y = I.H(x, z), f = rnd();
      if (f < .7) { const c = mix3(C.grass2, [.62, .78, .38], rnd()), h = .12 + rnd() * .14; b.at(x, y, z, rnd() * 6.28); b.tri([-.07, 0, 0], [.07, 0, 0], [0, h, .02], c, { k: 1.2 }); b.tri([0, 0, -.07], [0, 0, .07], [.02, h * .8, 0], c, { k: 1.2 }); b.pop(); }
      else if (f < .9) { const c = [[.96, .9, .5], [.95, .55, .62], [.7, .62, .95], [.98, .98, .95]][Math.floor(rnd() * 4)]; b.box(x, y, z, .07, .1, .07, c, { e: .08 }); }
      else { const s = .12 + rnd() * .22; b.sphere(x, y + s * .3, z, s, 5, mix3(C.stone, C.rock, rnd()), { sy: .65 }); }
    }
  }
  function distSeg(x, z, sg) { const [a, b] = sg, dx = b[0] - a[0], dz = b[1] - a[1], L2 = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / L2)); return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t); }
  function buildPaths(I, b, nodes) {                       /* 小径：最小生成树，铺成贴地的土路带 */
    I.paths = [];
    if (nodes.length < 2) return;
    const inT = [0], rest = nodes.map((_, i) => i).slice(1), edges = [];
    while (rest.length) { let best = null; for (const a of inT) for (const c of rest) { const d = Math.hypot(nodes[a][0] - nodes[c][0], nodes[a][1] - nodes[c][1]); if (!best || d < best.d) best = { a, c, d }; } edges.push([best.a, best.c]); inT.push(best.c); rest.splice(rest.indexOf(best.c), 1); }
    for (const [ia, ic] of edges) {
      const A = nodes[ia], B = nodes[ic], L = Math.hypot(B[0] - A[0], B[1] - A[1]), n = Math.max(2, Math.ceil(L / .35));
      const nx = -(B[1] - A[1]) / (L || 1), nz = (B[0] - A[0]) / (L || 1), bend = (I.rnd() - .5) * L * .18, pts = [];
      for (let i = 0; i <= n; i++) { const t = i / n, w = Math.sin(t * Math.PI) * bend; pts.push([A[0] + (B[0] - A[0]) * t + nx * w, A[1] + (B[1] - A[1]) * t + nz * w]); }
      for (let i = 0; i < pts.length - 1; i++) I.paths.push([pts[i], pts[i + 1]]);
      const wd = .2;
      for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], q = pts[i + 1], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1, ox = -dz / l * wd, oz = dx / l * wd;
        const y1 = I.H(p[0], p[1]) + .025, y2 = I.H(q[0], q[1]) + .025, c = mix3(C.dirt, [.7, .6, .45], I.nz(p[0], p[1], 1) * .5);
        b.quad([p[0] - ox, y1, p[1] - oz], [q[0] - ox, y2, q[1] - oz], [q[0] + ox, y2, q[1] + oz], [p[0] + ox, y1, p[1] + oz], c);
      }
    }
  }
  /* ---- 内建的几样：主屋、码头、垂瀑口、自留畦、空营建位（设施模型另在 FAC 里） ---- */
  function bHome(b, o) {
    const rnd = o.rnd, wall = C.plaster, roof = [C.roofP, C.roofB, C.roofR, C.roofG][Math.floor(rnd() * 4)];
    b.box(0, 0, 0, 2.4, .35, 2.0, C.stoneD, { top: C.stone });
    b.box(0, .35, 0, 2.2, 1.35, 1.8, wall, { front: wall });
    for (let i = -1; i <= 1; i += 2) { b.beam([i * 1.1, .35, .92], [i * 1.1, 1.7, .92], .1, C.woodD); b.beam([i * 1.1, .35, -.92], [i * 1.1, 1.7, -.92], .1, C.woodD); }
    b.beam([-1.1, 1.05, .92], [1.1, 1.05, .92], .07, C.woodD);
    b.gable(0, 1.7, 0, 2.6, 2.3, 1.15, roof, { end: wall });
    b.box(-.65, 1.7, 0, .5, .35, .4, wall); b.gable(-.65, 2.05, 0, .55, .5, .3, roof, { end: wall });
    b.box(.65, 1.5, -.55, .32, 1.6, .32, C.stoneD, { top: C.rockD }); b.emit(.65, 3.2, -.55, "smoke", 9);
    b.box(0, .35, .91, .48, .85, .06, C.woodD); b.box(.13, .7, .95, .06, .06, .03, C.gold, { e: .4 });
    for (const x of [-.65, .65]) { b.box(x, .9, .91, .38, .42, .04, C.glow, { e: .55 }); b.box(x, .88, .94, .46, .06, .06, C.woodL); }
    b.box(-1.12, .95, .2, .04, .4, .36, C.glow, { e: .55 }); b.box(1.12, .95, .2, .04, .4, .36, C.glow, { e: .55 });
    b.at(1.25, .1, .7, -.4); b.beam([0, 0, 0], [0, 1.2, 0], .05, C.woodL); b.cone(0, -.05, 0, .14, .38, 6, C.hay, { r2: 0 }); b.pop();   /* 门边靠着的扫帚 */
    b.cone(0, 2.85, 0, .06, .4, 4, C.gold, { e: .5 });
    b.at(0, 2.9, -.95, 0); b.box(0, 0, 0, .04, .8, .04, C.iron); b.pop();
    b.box(-1.25, .35, .8, .08, .45, .08, C.woodD); b.box(1.25, .35, .8, .08, .45, .08, C.woodD);
    b.box(0, .35, 1.32, 2.0, .06, .5, C.plank);                          /* 门廊 */
    b.at(-1.0, .41, 1.35); b.cyl(0, 0, 0, .14, .24, 6, C.woodD); b.sphere(0, .36, 0, .2, 6, [.95, .55, .6], { k: 1.3 }); b.pop();
  }
  function bPort(b, o, I, A) {                             /* 码头：从岛沿伸出去的木栈道，泊着两把扫帚 */
    const L = 2.6 + (o.ext || 0);
    b.box(0, -.12, 0, 1.0, .14, .9, C.plank);
    for (let i = 0; i < Math.ceil(L / .32); i++) b.box(0, -.12, .6 + i * .32, .95 - (i % 2) * .06, .1, .28, mix3(C.plank, C.woodL, (i % 3) * .2));
    for (const s of [-1, 1]) { for (let i = 0; i <= Math.ceil(L / .9); i++) { const z = .5 + i * .9; b.beam([s * .5, -.42, z], [s * .5, .45, z], .1, C.woodD); }
      b.beam([s * .5, -.42, .5 + L * .55], [s * .5, -.6, -.1], .07, C.woodD); b.beam([s * .5, .45, .5], [s * .5, .45, .5 + L], .06, C.woodL); }
    b.at(.5, .45, .5 + L * .55); b.beam([0, 0, 0], [0, .9, 0], .07, C.iron); b.box(0, .9, 0, .2, .26, .2, C.lamp, { e: .9 }); b.pyramid(0, 1.16, 0, .28, .28, .16, C.iron); b.pop();
    for (const [x, z, ry] of [[-.25, .5 + L - .35, .2], [.2, .5 + L - .9, -.15]]) b.bob(x, .55, z, .05, 1.3 + ry, sb => { sb.at(0, 0, 0, ry); sb.beam([0, 0, -.55], [0, 0, .55], .05, C.woodL); sb.cone(0, 0, -.55, .13, .32, 6, C.hay, { r2: .04 }); sb.pop(); });
  }
  function bFallSpring(b, o) {                              /* 垂瀑口：一汪泉、一圈石头 */
    b.disc(0, .04, 0, .75, 14, C.water, { k: 3 });
    for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28 + o.rnd() * .3; b.sphere(Math.cos(a) * .85, .06, Math.sin(a) * .85, .15 + o.rnd() * .08, 5, C.stone, { sy: .7 }); }
  }
  function bGarden(b, o) {                                  /* 自留畦：三垄菜、一个稻草人 */
    b.box(0, 0, 0, 1.8, .06, 1.4, C.soil);
    for (let r = 0; r < 3; r++) { const z = -.45 + r * .45; b.box(0, .06, z, 1.6, .08, .2, mix3(C.soil, C.dirt, .3)); for (let i = 0; i < 6; i++) b.sphere(-.65 + i * .26, .2, z, .09, 5, r === 1 ? [.85, .4, .3] : C.crop, { k: 1.25 }); }
    b.at(.95, 0, .55); b.beam([0, 0, 0], [0, .9, 0], .05, C.woodD); b.beam([-.3, .65, 0], [.3, .65, 0], .04, C.woodD); b.box(0, .5, 0, .26, .3, .14, C.cloth); b.sphere(0, .92, 0, .1, 6, C.hay); b.cone(0, .98, 0, .18, .24, 6, C.hay); b.pop();
  }
  function bSlot(b, o) {                                    /* 空营建位：翻好的地、四角木桩拉绳、一块空木牌 */
    b.box(0, 0, 0, 1.9, .05, 1.9, mix3(C.soil, C.dirt, .5));
    const P9 = [[-.9, -.9], [.9, -.9], [.9, .9], [-.9, .9]];
    for (const [x, z] of P9) b.box(x, 0, z, .07, .42, .07, C.woodL);
    for (let i = 0; i < 4; i++) { const [x1, z1] = P9[i], [x2, z2] = P9[(i + 1) % 4]; b.beam([x1, .36, z1], [x2, .36, z2], .025, [.9, .85, .7]); }
    b.at(0, 0, .95); b.beam([0, 0, 0], [0, .6, 0], .05, C.woodD); b.box(0, .5, 0, .5, .3, .04, C.woodL); b.pop();
    b.bob(0, 1.1, 0, .08, 1.6, sb => { sb.box(-.04, -.16, -.04, .08, .32, .08, C.gold, { e: .8 }); sb.box(-.16, -.04, -.04, .32, .08, .08, C.gold, { e: .8 }); });
  }
  function bGeneric(b, o) {                                  /* 不在型录里的老设施：一间小屋 */
    b.box(0, 0, 0, 1.6, 1.0, 1.3, o.bad ? dim3(C.plaster, .7) : C.plaster); b.gable(0, 1.0, 0, 1.9, 1.6, .7, C.roofT, { end: C.plaster });
    b.box(0, 0, .66, .4, .7, .04, C.woodD);
  }
  /* 待修：整体压暗，加两块交叉木板与一个歪倒的桶 */
  function badMark(b, o) {
    b.at(.9, 0, .9, .3); b.beam([-.3, .1, 0], [.3, .7, 0], .08, C.woodL); b.beam([.3, .1, 0], [-.3, .7, 0], .08, C.woodL); b.pop();
    b.at(-.95, .18, .95, 0, 1, 0, 1.4); b.cyl(0, -.2, 0, .18, .4, 7, C.woodD); b.pop();
  }

  /* ---- 拼一座岛 ---- */
  function showroom(desc) {                                /* 样品间：平台上一字排开（建模与检查用） */
    const items = desc.showroom, n = items.length, st = new MB(), rnd = prng(7), gap = desc.gap || 3.4, W9 = (n - 1) * gap / 2 + 2.2;
    const ctx = { rnd, era: desc.era || "y1994", night: SKY[desc.part] ? SKY[desc.part].night : 0, C, mix3, dim3 };
    st.box(0, -.3, 0, W9 * 2 + .6, .3, 5.2, C.stoneD, { top: C.grass });
    for (let i = 0; i < 40; i++) st.box((rnd() - .5) * W9 * 2, 0, (rnd() - .5) * 4.8, .05, .12, .05, C.grass2);
    const labs = [];
    items.forEach((it, i) => {
      const x = -((n - 1) * gap) / 2 + i * gap; st.pick = i + 1;
      const o9 = Object.assign({}, ctx, { lv: it.lv || 1, bad: !!it.bad, type: it.type, rnd: prng(31 + i) });
      st.at(x, 0, 0, it.ry || 0);
      const fn = it.kind === "home" ? (PROP.home || bHome) : it.kind === "slot" ? (PROP.slot || bSlot) : it.kind === "garden" ? (PROP.garden || bGarden) : it.kind === "port" ? (PROP.port || bPort) : it.kind === "fall" ? (PROP.fall || bFallSpring) : (FAC[it.type] || bGeneric);
      const n0 = st.v.length;
      fn(st, it.kind === "port" ? Object.assign(o9, { ext: it.ext || 0 }) : o9);
      if (it.bad) { for (let q = n0; q < st.v.length; q += 12) { st.v[q + 6] *= .62; st.v[q + 7] *= .6; st.v[q + 8] *= .62; st.v[q + 9] *= .2; } badMark(st, o9); }
      st.pop(); st.pick = 0;
      labs.push({ i, n: (it.label || it.type || it.kind) + (it.lv ? " Lv" + it.lv : "") + (it.bad ? " 待修" : ""), p: [x, (fn.h ? fn.h(o9) : 2.6) + .4, 0], k: "fac" });
    });
    const I = { seed: 7, R40: Math.max(4, W9), D: 3, rnd };
    return { I, st, dyn: st.dyn.slice(), labs, pts: st.pts };
  }
  function compose(desc) {
    if (desc.showroom) return showroom(desc);
    const I = islandOf(desc), st = new MB();
    const kindR = { home: 1.6, fac: 1.45, slot: 1.15, port: .9, fall: .9, garden: 1.05, misc: .8 };
    const wear = { home: C.dirt, fac: mix3(C.dirt, C.grass, .4), slot: null, port: C.dirt, garden: null, fall: null };
    const pois = (desc.pois || []).map(p => {
      let [x, z] = I.W(p.x, p.y);
      if (p.kind === "port") { const a = Math.atan2(z, x), e = I.edge(a) - .35; x = Math.cos(a) * e; z = Math.sin(a) * e; }   /* 码头推到岛沿 */
      return Object.assign({}, p, { X: x, Z: z });
    });
    for (const p of pois) { const h = I.base(p.X, p.Z); I.pads.push({ x: p.X, z: p.Z, r: kindR[p.kind] || 1, h, wear: wear[p.kind] || null }); }
    const nodes = pois.filter(p => p.kind !== "slot").map(p => [p.X, p.Z]);
    buildPaths(I, st, nodes);
    buildTerrain(I, st, desc);
    groundTex(I, st, desc);
    const rnd = I.rnd, ctx = { rnd, era: desc.era || "y1994", night: SKY[desc.part] ? SKY[desc.part].night : 0, C, I, mix3, dim3 };
    const labs = [];
    for (const p of pois) {
      const y = I.H(p.X, p.Z), face = Math.atan2(-p.X, -p.Z) + (rnd() - .5) * .5;   /* 门脸大致朝岛心 */
      st.pick = p.i + 1;
      let topH = 1.2;
      if (p.kind === "port") {                                 /* 码头在岛沿，栈道朝外 */
        const a = Math.atan2(p.Z, p.X);
        st.at(p.X, y, p.Z, Math.atan2(Math.cos(a), Math.sin(a))); (PROP.port || bPort)(st, Object.assign({}, ctx, { ext: 0 }), I); st.pop();
        labs.push({ i: p.i, n: p.n, p: [p.X, y + 1.4, p.Z], k: p.kind }); st.pick = 0; continue;
      }
      st.at(p.X, y, p.Z, face);
      if (p.kind === "home") { (PROP.home || bHome)(st, ctx); topH = PROP.home && PROP.home.h ? PROP.home.h(ctx) : 3.3; }
      else if (p.kind === "fall") { (PROP.fall || bFallSpring)(st, ctx); topH = .9; }
      else if (p.kind === "garden") { (PROP.garden || bGarden)(st, ctx); topH = 1.2; }
      else if (p.kind === "slot") { (PROP.slot || bSlot)(st, ctx); topH = 1.5; }
      else if (p.kind === "fac") {
        const fn = FAC[p.type], o9 = Object.assign({}, ctx, { lv: U9.clamp(p.lv || 1, 1, 3), bad: !!p.bad, type: p.type });
        const n0 = st.v.length;
        try { (fn || bGeneric)(st, o9); } catch (e) { st.v.length = n0; bGeneric(st, o9); }
        if (p.bad) { for (let q = n0; q < st.v.length; q += 12) { st.v[q + 6] *= .62; st.v[q + 7] *= .6; st.v[q + 8] *= .62; st.v[q + 9] *= .2; } badMark(st, o9); }
        topH = (fn && fn.h ? fn.h(o9) : 2.4);
      } else bGeneric(st, ctx);
      st.pop();
      labs.push({ i: p.i, n: p.n, p: [p.X, y + topH + .35, p.Z], k: p.kind });
      if (p.kind === "fac" && p.type === "港桥") {             /* 港桥：另从最近的岛沿伸一段长栈桥 */
        const a = Math.atan2(p.Z, p.X), e = I.edge(a) - .3, ex = Math.cos(a) * e, ez = Math.sin(a) * e;
        st.at(ex, I.H(ex, ez), ez, Math.atan2(Math.cos(a), Math.sin(a))); (PROP.port || bPort)(st, Object.assign({}, ctx, { ext: 1.5 + (p.lv || 1) * 1.2, lv: p.lv || 1 }), I); st.pop();
      }
      st.pick = 0;
    }
    /* 垂瀑：从垂瀑口顺着岛心方向流到崖边，再挂下去 */
    const fp = pois.find(p => p.kind === "fall");
    if (fp) {
      const a = Math.atan2(fp.Z, fp.X), e = I.edge(a), ex = Math.cos(a) * (e - .05), ez = Math.sin(a) * (e - .05), y0 = I.H(ex * .97, ez * .97);
      const sx = fp.X, sz = fp.Z, n = 8, ox = -Math.sin(a) * .22, oz = Math.cos(a) * .22;
      for (let i = 0; i < n; i++) {                            /* 溪 */
        const t = i / n, t2 = (i + 1) / n, x1 = sx + (ex - sx) * t, z1 = sz + (ez - sz) * t, x2 = sx + (ex - sx) * t2, z2 = sz + (ez - sz) * t2;
        st.quad([x1 - ox, I.H(x1, z1) + .05, z1 - oz], [x2 - ox, I.H(x2, z2) + .05, z2 - oz], [x2 + ox, I.H(x2, z2) + .05, z2 + oz], [x1 + ox, I.H(x1, z1) + .05, z1 + oz], C.water, { k: 3 });
      }
      const L = I.D * 1.35, segs = 14, ux = Math.cos(a), uz = Math.sin(a);
      for (let i = 0; i < segs; i++) {                         /* 瀑：往外抛一点再垂下，越往下越宽 */
        const t = i / segs, t2 = (i + 1) / segs, out1 = .3 * Math.sqrt(t) + .05, out2 = .3 * Math.sqrt(t2) + .05;
        const w1 = .3 + t * .5, w2 = .3 + t2 * .5, ya = y0 + .02 - t * L, yb = y0 + .02 - t2 * L;
        const A = [ex + ux * out1, ya, ez + uz * out1], B = [ex + ux * out2, yb, ez + uz * out2];
        st.quad([A[0] - ox / .22 * w1, ya, A[2] - oz / .22 * w1], [B[0] - ox / .22 * w2, yb, B[2] - oz / .22 * w2], [B[0] + ox / .22 * w2, yb, B[2] + oz / .22 * w2], [A[0] + ox / .22 * w1, ya, A[2] + oz / .22 * w1], [.62, .8, .96], { k: 2 });
      }
      st.emit(ex + ux * .5, y0 - L * .98, ez + uz * .5, "mist", 26, 1.4);
      st.emit(ex + ux * .3, y0 - .3, ez + uz * .3, "mist", 6, .7);
    }
    /* 夜里的萤火 */
    for (let k = 0; k < 10; k++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * I.R40 * .9, x = Math.cos(a) * r, z = Math.sin(a) * r; st.emit(x, I.H(x, z) + .2, z, "firefly", 3, 1); }
    /* 云：一团团绕着岛慢慢转 */
    const dyn = st.dyn.slice(), clouds = [];
    for (let k = 0; k < 13; k++) {
      const cb = new MB(), a = rnd() * 6.28, rr = I.R40 * (1.15 + rnd() * 1.5), y = -I.D * (.15 + rnd() * .9) + (k < 3 ? I.D * .55 : 0), n = 4 + Math.floor(rnd() * 4), sz = .9 + rnd() * 1.3;
      for (let q = 0; q < n; q++) cb.sphere((q - n / 2) * sz * .7 + (rnd() - .5) * .4, (rnd() - .3) * sz * .35, (rnd() - .5) * sz * .7, sz * (.7 + rnd() * .55), 7, mix3(C.white, [.86, .88, .96], rnd() * .6), { sy: .62, grad: [.8, .82, .92] });
      clouds.push({ m: trs(Math.cos(a) * rr, y, Math.sin(a) * rr, -a), type: "orbit", speed: (.008 + rnd() * .012) * (rnd() < .5 ? 1 : -1), mb: cb });
    }
    return { I, st, dyn: dyn.concat(clouds), labs, pts: st.pts };
  }
  const U9 = { clamp: (v, a, b) => Math.max(a, Math.min(b, v)) };
  function build(desc) {
    freeScene();
    const S9 = compose(desc);
    const sky = SKY[desc.part] || SKY["午"];
    const st = upload(S9.st.v);
    const dyn = S9.dyn.map(d => Object.assign({}, d, { g: upload(d.mb.v), mb: null }));
    const stars = [];
    const sr = prng(S9.I.seed + 99);
    for (let i = 0; i < 700; i++) { const th = sr() * 6.28, ph = Math.acos(sr() * 1.6 - .6), R = 160; stars.push({ p: [R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)], type: "star", n: 1, size: 1 }); }
    scene = { desc, I: S9.I, st, dyn, pts: S9.pts.length ? uploadPts(S9.pts) : null, stars: uploadPts(stars), labs: S9.labs, sky, R: S9.I.R40, D: S9.I.D, tris: (S9.st.v.length + S9.dyn.reduce((s, d) => s + (d.g ? d.g.n * 12 : 0), 0)) / 36 };
    cam.dist = cam.dT = U9.clamp(cam.dist && cam.keep === desc.name ? cam.dist : S9.I.R40 * 2.7, S9.I.R40 * 1.1, S9.I.R40 * 5);
    if (cam.keep !== desc.name) { cam.yaw = .7 + (S9.I.seed % 100) / 100 * .6; cam.pitch = .5; }
    cam.keep = desc.name; cam.ty = .4;
    mkLabels();
  }
  /* ---- 画一帧 ---- */
  function size() {
    const r = host.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    dprNow = dpr;
    return [w, h];
  }
  function camMats(w, h) {
    const cp = Math.cos(cam.pitch), eye = [cam.tx + Math.sin(cam.yaw) * cp * cam.dist, cam.ty + Math.sin(cam.pitch) * cam.dist, cam.tz + Math.cos(cam.yaw) * cp * cam.dist];
    const V = lookAt(eye, [cam.tx, cam.ty, cam.tz], [0, 1, 0]), Pm = persp(.72, w / h, .3, 600);
    return { eye, V, Pm, VP: mul(Pm, V) };
  }
  function dynM(d, t) {
    if (d.type === "spin") return mul(d.m, rot(d.axis, t * d.speed));
    if (d.type === "bob") return mul(d.m, trs(0, Math.sin(t * d.speed) * d.amp, 0, Math.sin(t * d.speed * .5) * .1));
    if (d.type === "orbit") return mul(rot("y", t * d.speed), d.m);
    return d.m;
  }
  function drawGeo(pr, t, VP, LVP) {
    const u = pr.u;
    if (u.uVP) gl.uniformMatrix4fv(u.uVP, false, VP); if (u.uLVP) gl.uniformMatrix4fv(u.uLVP, false, LVP); if (u.uT) gl.uniform1f(u.uT, t);
    gl.uniformMatrix4fv(u.uM, false, m4()); gl.bindVertexArray(scene.st.vao); gl.drawArrays(gl.TRIANGLES, 0, scene.st.n);
    for (const d of scene.dyn) { gl.uniformMatrix4fv(u.uM, false, dynM(d, t)); gl.bindVertexArray(d.g.vao); gl.drawArrays(gl.TRIANGLES, 0, d.g.n); }
    gl.bindVertexArray(null);
  }
  function render(t) {
    if (!scene) return;
    const [w, h] = size(), sky = scene.sky, R = scene.R;
    const M = camMats(w, h);
    /* 影子：正交光照，罩住岛面 */
    const sd = nrm(sky.sun), ext = R * 1.45, le = [sd[0] * R * 4, sd[1] * R * 4 + .5, sd[2] * R * 4];
    const LV = lookAt(le, [0, .5, 0], Math.abs(sd[1]) > .95 ? [0, 0, 1] : [0, 1, 0]), LVP = mul(ortho(-ext, ext, -ext, ext, .5, R * 8.5), LV);
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, shFb); gl.viewport(0, 0, SHN, SHN); gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.useProgram(P.sh.p); gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1.6, 3); drawGeo(P.sh, t, null, LVP); gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, w, h);
    gl.clearColor(sky.hor[0], sky.hor[1], sky.hor[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    /* 天幕：按地平线在屏上的高度铺渐变 */
    const hz = [M.eye[0] - Math.sin(cam.yaw) * 500, M.eye[1], M.eye[2] - Math.cos(cam.yaw) * 500], hc = xf4(M.VP, hz), hy = U9.clamp(hc[1] / hc[3] * .5 + .5, -.3, 1.3);
    gl.depthMask(false); gl.useProgram(P.sky.p);
    gl.uniform3fv(P.sky.u.uTop, sky.top); gl.uniform3fv(P.sky.u.uHor, sky.hor); gl.uniform3fv(P.sky.u.uBot, sky.bot); gl.uniform1f(P.sky.u.uHy, hy);
    gl.bindVertexArray(skyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (sky.night > .2 && scene.stars) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.useProgram(P.pt.p);
      const Vs = new Float32Array(M.V); Vs[12] = Vs[13] = Vs[14] = 0;
      gl.uniformMatrix4fv(P.pt.u.uVP, false, mul(M.Pm, Vs)); gl.uniform1f(P.pt.u.uT, t); gl.uniform1f(P.pt.u.uPx, dprNow); gl.uniform1f(P.pt.u.uNight, sky.night);
      gl.bindVertexArray(scene.stars.vao); gl.drawArrays(gl.POINTS, 0, scene.stars.n); gl.disable(gl.BLEND);
    }
    gl.depthMask(true);
    /* 实体 */
    gl.useProgram(P.main.p);
    const u = P.main.u;
    gl.uniform3fv(u.uSun, sd); gl.uniform3fv(u.uSunC, sky.sunC); gl.uniform3fv(u.uSky, sky.sky); gl.uniform3fv(u.uGnd, sky.gnd); gl.uniform3fv(u.uFog, sky.hor); gl.uniform3fv(u.uEye, M.eye);
    gl.uniform2f(u.uFogR, cam.dist * 1.15, cam.dist * 3.4); gl.uniform1f(u.uNight, sky.night); gl.uniform1f(u.uHi, hoverId); gl.uniform1f(u.uSel, selId); gl.uniform1f(u.uShOn, 1);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, shTex); gl.uniform1i(u.uSh, 0);
    drawGeo(P.main, t, M.VP, LVP);
    gl.bindTexture(gl.TEXTURE_2D, null);
    /* 粒子 */
    if (scene.pts) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.useProgram(P.pt.p);
      gl.uniformMatrix4fv(P.pt.u.uVP, false, M.VP); gl.uniform1f(P.pt.u.uT, t); gl.uniform1f(P.pt.u.uPx, h / (2 * Math.tan(.36))); gl.uniform1f(P.pt.u.uNight, sky.night);
      gl.bindVertexArray(scene.pts.vao); gl.drawArrays(gl.POINTS, 0, scene.pts.n);
      gl.depthMask(true); gl.disable(gl.BLEND);
    }
    gl.bindVertexArray(null);
    placeLabels(M.VP, w, h);
    scene.lastVP = M.VP; scene.lastT = t;
  }
  function xf4(m, p) { return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14], m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]]; }
  /* ---- 点选：画一遍编号图，读光标下那一点 ---- */
  function pickAt(px, py) {
    if (!scene || !scene.lastVP) return 0;
    const w = cv.width, h = cv.height;
    if (!idFb || idW !== w || idH !== h) {
      if (idFb) { gl.deleteFramebuffer(idFb); gl.deleteTexture(idTex); gl.deleteRenderbuffer(idRb); }
      idFb = gl.createFramebuffer(); idTex = gl.createTexture(); idRb = gl.createRenderbuffer(); idW = w; idH = h;
      gl.bindTexture(gl.TEXTURE_2D, idTex); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, w, h);
      gl.bindRenderbuffer(gl.RENDERBUFFER, idRb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
      gl.bindFramebuffer(gl.FRAMEBUFFER, idFb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, idTex, 0); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, idRb);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, idFb); gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.useProgram(P.id.p); drawGeo(P.id, scene.lastT || 0, scene.lastVP, null);
    const px9 = new Uint8Array(4); gl.readPixels(Math.round(px * dprNow), Math.round(h - py * dprNow), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px9);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return px9[0] + px9[1] * 256;
  }
  /* ---- 名牌 ---- */
  function mkLabels() {
    if (!labWrap) { labWrap = document.createElement("div"); labWrap.className = "i3-labs"; }
    labWrap.innerHTML = "";
    for (const L of scene.labs) {
      const el = document.createElement("div"); el.className = "i3-lab k-" + L.k; el.textContent = L.n; el.dataset.i = L.i;
      el.addEventListener("click", ev => { ev.stopPropagation(); selId = L.i + 1; if (opts.onPick) opts.onPick(L.i); });
      labWrap.appendChild(el); L.el = el;
    }
  }
  function placeLabels(VP, w, h) {
    if (!scene || !labWrap) return;
    const cw = w / dprNow, ch = h / dprNow;
    for (const L of scene.labs) {
      const c = xf4(VP, L.p); if (c[3] <= 0) { L.el.style.display = "none"; continue; }
      const x = (c[0] / c[3] * .5 + .5) * cw, y = (1 - (c[1] / c[3] * .5 + .5)) * ch;
      if (x < -60 || x > cw + 60 || y < -20 || y > ch + 20) { L.el.style.display = "none"; continue; }
      L.el.style.display = ""; L.el.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px) translate(-50%,-100%)";
      L.el.classList.toggle("on", selId === L.i + 1 || hoverId === L.i + 1);
      L.el.style.opacity = c[3] > cam.dist * 1.25 ? ".55" : "1";
    }
  }
  /* ---- 操作：拖拽转、滚轮／双指缩放、点选 ---- */
  const ptrs = {};
  let drag = null, pinch = null, lastClickT = 0;
  function bindInput() {
    cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); ptrs[e.pointerId] = { x: e.clientX, y: e.clientY }; const ids = Object.keys(ptrs); if (ids.length === 2) { const [a, b] = ids.map(k => ptrs[k]); pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y), z0: cam.dT != null ? cam.dT : cam.dist }; drag = null; } else drag = { x: e.clientX, y: e.clientY, moved: 0 }; cam.idle = performance.now(); });
    cv.addEventListener("pointermove", e => {
      const r = cv.getBoundingClientRect();
      if (ptrs[e.pointerId]) ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (pinch) { const ids = Object.keys(ptrs); if (ids.length === 2) { const [a, b] = ids.map(k => ptrs[k]); const d = Math.hypot(a.x - b.x, a.y - b.y); cam.dT = U9.clamp(pinch.z0 * pinch.d0 / (d || 1), scene.R * 1.1, scene.R * 5); } cam.idle = performance.now(); return; }
      if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.moved += Math.abs(dx) + Math.abs(dy); cam.yaw -= dx * .006; cam.pitch = U9.clamp(cam.pitch + dy * .005, .06, 1.4); cam.vy = -dx * .006 * .5; cam.vp = dy * .005 * .5; drag.x = e.clientX; drag.y = e.clientY; cam.idle = performance.now(); return; }
      lastMove = performance.now(); pend = [e.clientX - r.left, e.clientY - r.top];
    });
    const up = e => {
      delete ptrs[e.pointerId];
      if (pinch) { if (Object.keys(ptrs).length < 2) pinch = null; drag = null; return; }
      if (drag && drag.moved < 7 && e.type === "pointerup") {
        const r = cv.getBoundingClientRect(), id = pickAt(e.clientX - r.left, e.clientY - r.top), now = performance.now();
        if (id > 0) { selId = id; if (opts.onPick) opts.onPick(id - 1); }
        else { selId = 0; if (opts.onVoid) opts.onVoid(now - lastClickT < 430); lastClickT = now; }
      }
      drag = null;
    };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", () => { pend = null; if (hoverId) { hoverId = 0; cv.style.cursor = ""; } });
    cv.addEventListener("wheel", e => { e.preventDefault(); if (!scene) return; cam.dT = U9.clamp((cam.dT != null ? cam.dT : cam.dist) * (e.deltaY > 0 ? 1.1 : .9), scene.R * 1.1, scene.R * 5); cam.idle = performance.now(); }, { passive: false });
  }
  /* ---- 循环 ---- */
  function loopF(ts) {
    raf = 0;
    if (!scene || !host || !cv.isConnected || !cv.offsetParent) return;
    const t = (ts - t0) / 1000, now = performance.now();
    if (!drag && (cam.vy || cam.vp)) { cam.yaw += cam.vy; cam.pitch = U9.clamp(cam.pitch + cam.vp, .06, 1.4); cam.vy *= .9; cam.vp *= .88; if (Math.abs(cam.vy) < 1e-4) cam.vy = 0; if (Math.abs(cam.vp) < 1e-4) cam.vp = 0; }
    if (!drag && !pinch && now - cam.idle > 6000) cam.yaw += .0009;          /* 放着不动时慢慢转 */
    if (cam.dT != null) { cam.dist += (cam.dT - cam.dist) * .16; if (Math.abs(cam.dT - cam.dist) < .002) { cam.dist = cam.dT; cam.dT = null; } }
    render(t);
    if (pend && now - lastMove > 60) { const id = pickAt(pend[0], pend[1]); pend = null; if (id !== hoverId) { hoverId = id; cv.style.cursor = id ? "pointer" : ""; } }
    raf = requestAnimationFrame(loopF);
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function open(h, desc, o) {
    if (!supported()) return false;
    try { if (!init()) return false; } catch (e) { ok = false; if (o && o.onFail) o.onFail(e); return false; }
    host = h; opts = o || {};
    if (cv.parentNode !== host) { const ref = host.querySelector("#star-cv"); if (ref && ref.nextSibling) host.insertBefore(cv, ref.nextSibling); else host.appendChild(cv); }
    try { build(desc); } catch (e) { console.error(e); close(); if (opts.onFail) opts.onFail(e); return false; }
    if (labWrap.parentNode !== host) host.insertBefore(labWrap, cv.nextSibling);
    cv.style.display = ""; labWrap.style.display = "";
    selId = desc.sel != null ? desc.sel + 1 : 0;
    if (!t0) t0 = performance.now();
    if (!raf) raf = requestAnimationFrame(loopF);
    return true;
  }
  function resume() { if (scene && cv && cv.style.display !== "none" && !raf) raf = requestAnimationFrame(loopF); }
  function close() { stopLoop(); if (cv) cv.style.display = "none"; if (labWrap) labWrap.style.display = "none"; freeScene(); hoverId = selId = 0; }
  function isOpen() { return !!(scene && cv && cv.style.display !== "none"); }
  function select(i) { selId = i == null ? 0 : i + 1; }
  function stats() { return scene ? { tris: Math.round(scene.tris), labs: scene.labs.length, R: scene.R, dyn: scene.dyn.length, pts: scene.pts ? scene.pts.n : 0, cam: Object.assign({}, cam) } : null; }
  function shot(desc, w9, h9, camO) {                       /* 调试与出图：画一帧（测试用） */
    if (camO) Object.assign(cam, camO);
    render((performance.now() - t0) / 1000);
    return cv.toDataURL("image/png");
  }
  return { supported, open, close, resume, isOpen, select, stats, shot, MB, FAC, PROP, C, SKY, mix3, dim3, trs, prng, cam };
})();
