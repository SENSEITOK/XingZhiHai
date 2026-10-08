// 模型审计：在 vm 里跑 isle3d.js + models/*.js（下划线开头的跳过），按 型号 × 纪元 × 级 出数，并按 spec_isle §5.2 判。
// 用法：node review/audit.cjs                 全部（主屋/码头/自留畦/营建位/垂瀑 + Object.keys(FAC)）
//       node review/audit.cjs 哨塔,兵营       只审这几种型号（不审 PROP）
//       node review/audit.cjs -q              只打有问题的行和汇总
// 退出码：有 FAIL 时为 1。原有 8 种型号和 PROP 是存量，新规（包围盒、动件、粒子、前角、h、暖色）对它们只记 legacy 告警，不算 FAIL。
const fs = require('fs'), vm = require('vm'), path = require('path');
const D = path.join(__dirname, '..');
const args = process.argv.slice(2), QUIET = args.includes('-q'), ONLY = (args.find(a => !a.startsWith('-')) || '').split(/[,，]/).filter(Boolean);
const ctx = { window: {}, document: {}, console, Math, Float32Array, Array, Object, JSON };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(D, 'isle3d.js'), 'utf8') + '\nthis.Isle3D = Isle3D;', ctx);

/* 模型文件：和 embed.py 同一个顺序（ORDER 在前，其余按字母） */
const ORDER = ['castle', 'tower', 'workshop', 'farm', 'herb', 'pasture', 'inn'];
let files = fs.readdirSync(path.join(D, 'models')).filter(f => f.endsWith('.js') && !f.startsWith('_')).map(f => f.slice(0, -3));
files = [...ORDER.filter(m => files.includes(m)), ...files.filter(m => !ORDER.includes(m)).sort()];
const loadErr = [];
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(D, 'models', f + '.js'), 'utf8'), ctx, { filename: 'models/' + f + '.js' }); }
  catch (e) { loadErr.push(`models/${f}.js: ${e.message}`); }
}
const I = ctx.Isle3D;

/* ---- 判据（spec_isle §5.2） ---- */
const LIM = { tris: 9000, e: .75, xz: 1.95, y0: -.6, y1: 5.5, dyn: 2, pts: 4, hTol: .1 };
const PT_OK = new Set(['smoke', 'steam', 'ember', 'firefly', 'cat', 'mist']);
const CORNERS = [[.9, .9], [-.95, .95]], CR = .3, CH = .4;               // badMark 的两个前角：半径 .3 内不放高于 .4 的东西
const LEGACY = new Set(['魔女塔', '工坊', '田圃', '牧栏', '药圃', '民宿', '货仓', '港桥']);
/* SAT-EMIT 只许这三种暖色（10:2x 实测：C.lamp 窗灯、工坊炉火、lamp/glow 半混）。
   另外放行落在 lamp→cream、glow→cream、lamp↔glow 三条线上的混色——美术口径「C.lamp / C.glow，或往 C.cream 混」。 */
const SAT_OK = [[1.00, .76, .38], [.93, .57, .27], [1.00, .78, .42]];
const col = c => typeof c === 'number' ? [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255] : Array.from(c);
const LINES = [[I.C.lamp, I.C.cream], [I.C.glow, I.C.cream], [I.C.lamp, I.C.glow]].map(([a, b]) => [col(a), col(b)]);
const near = (c, k, tol) => Math.abs(c[0] - k[0]) <= tol && Math.abs(c[1] - k[1]) <= tol && Math.abs(c[2] - k[2]) <= tol;
function onLine(c, [a, b], tol) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2;
  const t = Math.max(0, Math.min(1, ((c[0] - a[0]) * ab[0] + (c[1] - a[1]) * ab[1] + (c[2] - a[2]) * ab[2]) / (L || 1)));
  return Math.hypot(c[0] - a[0] - ab[0] * t, c[1] - a[1] - ab[1] * t, c[2] - a[2] - ab[2] * t) <= tol;
}
const warmOK = c => SAT_OK.some(k => near(c, k, .006)) || LINES.some(l => onLine(c, l, .012));
function hue(c) { const mx = Math.max(...c), mn = Math.min(...c), d = mx - mn; if (d < 1e-6) return -1; let h = mx === c[0] ? ((c[1] - c[2]) / d) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4; h *= 60; return h < 0 ? h + 360 : h; }
/* e＞.45 的只能是暖色（橙黄色相 15°–60°，或接近无彩、偏暖的奶白）；.3＜e≤.45 的符文色要先往石色混 ≥ .5（饱和差 ≤ .52） */
function emitColOK(c, e) {
  if (warmOK(c)) return true;
  const mx = Math.max(...c), mn = Math.min(...c), h = hue(c);
  const warm = (h >= 15 && h <= 60 && mx === c[0]) || (mx - mn < .1 && c[0] >= c[2] - .02);
  return e > .45 ? warm : (warm || mx - mn <= .52);
}

/* ---- 矩阵（I 不导出 xf/mul，这里自带一份，给动件的包围盒用） ---- */
const xf = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
function mul(a, b) { const o = new Float64Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; }

function corner(acc, A, B, Cc) {                            // 三角形高于 CH 的部分有没有落进前角半径 CR 内（重心采样）
  if (Math.max(A[1], B[1], Cc[1]) <= CH) return;
  for (let ci = 0; ci < 2; ci++) {
    const [cx, cz] = CORNERS[ci];
    if (Math.min(A[0], B[0], Cc[0]) > cx + CR || Math.max(A[0], B[0], Cc[0]) < cx - CR || Math.min(A[2], B[2], Cc[2]) > cz + CR || Math.max(A[2], B[2], Cc[2]) < cz - CR) continue;
    const N = 8;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N - i; j++) {
      const u = i / N, v = j / N, w = 1 - u - v, p = [A[0] * u + B[0] * v + Cc[0] * w, A[1] * u + B[1] * v + Cc[1] * w, A[2] * u + B[2] * v + Cc[2] * w];
      if (p[1] > CH && Math.hypot(p[0] - cx, p[2] - cz) < CR) { acc.corner[ci] = Math.max(acc.corner[ci], p[1]); }
    }
  }
}
function walk(mb, M, acc, amp) {
  for (const k of Object.keys(mb.b)) {
    const v = mb.b[k]; acc.t += v.length / 36;
    for (let q = 0; q < v.length; q += 36) {
      const P = [0, 12, 24].map(o => { const p = [v[q + o], v[q + o + 1], v[q + o + 2]]; return M ? xf(M, p) : p; });
      for (const p of P) for (let a = 0; a < 3; a++) { acc.mn[a] = Math.min(acc.mn[a], p[a] - (a === 1 ? amp : 0)); acc.mx[a] = Math.max(acc.mx[a], p[a] + (a === 1 ? amp : 0)); }
      if (acc.chkCorner) corner(acc, P[0], P[1], P[2]);
      const e = v[q + 9], c = [v[q + 6], v[q + 7], v[q + 8]], cs = c.map(x => x.toFixed(2)).join(',');
      if (e > acc.maxE) acc.maxE = e;
      if (e > LIM.e) { acc.hi++; acc.hiC[cs + ' e' + e.toFixed(2) + ' ' + k] = 1; }
      if (e > .3) {
        acc.emA++;
        const mxc = Math.max(...c), mnc = Math.min(...c);
        if (mxc > .85 && (mxc - mnc) > .55) { if (warmOK(c)) acc.satOK[cs] = 1; else acc.neon[cs + ' e' + e.toFixed(2)] = 1; }
        else if (!emitColOK(c, e)) acc.badCol[cs + ' e' + e.toFixed(2)] = 1;
      }
    }
  }
  for (const d of mb.dyn) { acc.dyn[d.type] = (acc.dyn[d.type] || 0) + 1; walk(d.mb, M ? mul(M, d.m) : d.m, acc, amp + (d.type === 'bob' ? (d.amp || .1) : 0)); }
  acc.pts.push(...mb.pts.map(p => p.type)); acc.holos += mb.holos.length;
}
function measure(fn, o, chkCorner) {
  const b = new I.MB();
  fn(b, o);
  const acc = { t: 0, mn: [1e9, 1e9, 1e9], mx: [-1e9, -1e9, -1e9], maxE: 0, hi: 0, hiC: {}, emA: 0, neon: {}, satOK: {}, badCol: {}, pts: [], holos: 0, dyn: {}, corner: [0, 0], chkCorner };
  walk(b, null, acc, 0);
  return acc;
}

/* ---- 跑 ---- */
const facTypes = Object.keys(I.FAC);
const items = ONLY.length ? ONLY.map(t => [t, 'fac']) : [['主屋', 'home'], ...facTypes.map(t => [t, 'fac']), ['码头', 'port'], ['自留畦', 'garden'], ['营建位', 'slot'], ['垂瀑', 'fall']];
const fails = [], warns = [];
const f2 = x => x.toFixed(2);
for (const [name, kind] of items) for (const cyber of [false, true]) for (const lv of (kind === 'fac' ? [1, 2, 3] : [1])) {
  const tag = `${name} ${cyber ? '77' : '94'} lv${lv}`, legacy = kind !== 'fac' || LEGACY.has(name);
  const fn = kind === 'home' ? I.PROP.home : kind === 'fac' ? I.FAC[name] : I.PROP[kind];
  if (!fn) { console.log(`${tag}: NO MODEL`); fails.push(`${tag}: 没有注册模型`); continue; }
  const mk = bad => ({ lv, bad, type: name, cyber, era: cyber ? 'y2077' : 'y1994', rnd: I.prng(31), C: I.C, mix3: I.mix3, dim3: I.dim3, night: 0, ext: 0 });
  const o = mk(false);
  let acc, accBad, h;
  try { acc = measure(fn, o, false); } catch (e) { console.log(`${tag}: THROW ${e.message}`); fails.push(`${tag}: 抛异常 ${e.message}`); continue; }
  if (kind === 'fac') {
    try { accBad = measure(fn, mk(true), true); } catch (e) { fails.push(`${tag} 待修: 抛异常 ${e.message}`); }
  }
  try { h = fn.h ? fn.h(o) : undefined; } catch (e) { h = NaN; }
  const pc = {}; acc.pts.forEach(t => pc[t] = (pc[t] || 0) + 1);
  const nDyn = Object.values(acc.dyn).reduce((s, n) => s + n, 0);
  /* 硬伤：对谁都算 FAIL */
  const hard = [], soft = [];
  if (kind === 'fac' && acc.t > LIM.tris) hard.push(`三角形 ${Math.round(acc.t)} > ${LIM.tris}`);
  if (acc.hi) hard.push(`e>${LIM.e} ×${acc.hi}: ${Object.keys(acc.hiC).slice(0, 6).join(' | ')}`);
  if (acc.holos) hard.push(`holo ×${acc.holos}`);
  if (Object.keys(acc.neon).length) hard.push(`SAT-EMIT 非许可色: ${Object.keys(acc.neon).slice(0, 6).join(' | ')}`);
  /* 新规：新型号算 FAIL，存量只记 legacy 告警 */
  if (Object.keys(acc.badCol).length) soft.push(`自发光非暖色: ${Object.keys(acc.badCol).slice(0, 6).join(' | ')}`);
  if (kind === 'fac') {
    const out = [];
    if (acc.mn[0] < -LIM.xz || acc.mx[0] > LIM.xz) out.push(`x[${f2(acc.mn[0])},${f2(acc.mx[0])}]`);
    if (acc.mn[2] < -LIM.xz || acc.mx[2] > LIM.xz) out.push(`z[${f2(acc.mn[2])},${f2(acc.mx[2])}]`);
    if (acc.mn[1] < LIM.y0 || acc.mx[1] > LIM.y1) out.push(`y[${f2(acc.mn[1])},${f2(acc.mx[1])}]`);
    if (out.length) soft.push(`包围盒越界 ${out.join(' ')}（限 x,z ±${LIM.xz}，y ${LIM.y0}..${LIM.y1}）`);
    if (nDyn > LIM.dyn) soft.push(`spin+bob ${nDyn} > ${LIM.dyn}`);
    if (acc.pts.length > LIM.pts) soft.push(`粒子 ${acc.pts.length} 处 > ${LIM.pts}`);
    const badPt = [...new Set(acc.pts.filter(t => !PT_OK.has(t)))];
    if (badPt.length) soft.push(`粒子类型不许: ${badPt.join(',')}`);
    if (accBad) { const cc = accBad.corner.map((y, i) => y ? `(${CORNERS[i].join(',')}) 高 ${f2(y)}` : '').filter(Boolean); if (cc.length) soft.push(`待修前角被占: ${cc.join(' ')}`); }
    if (typeof h !== 'number' || !isFinite(h)) soft.push('没有 build.h');
    else if (Math.abs(h - (acc.mx[1] + .2)) > LIM.hTol) soft.push(`h=${+h.toFixed(3)}，应≈顶 ${f2(acc.mx[1])}+.2=${f2(acc.mx[1] + .2)}`);
  }
  const row = `${tag}: tris ${Math.round(acc.t)} h=${h == null ? '-' : +(+h).toFixed(3)} x[${f2(acc.mn[0])},${f2(acc.mx[0])}] y[${f2(acc.mn[1])},${f2(acc.mx[1])}] z[${f2(acc.mn[2])},${f2(acc.mx[2])}] maxE ${f2(acc.maxE)} hiE ${acc.hi} emTris ${acc.emA} holos ${acc.holos} pts ${JSON.stringify(pc)} dyn ${JSON.stringify(acc.dyn)}`;
  if (!QUIET || hard.length || soft.length) console.log(row);
  for (const m of hard) { fails.push(`${tag}: ${m}`); console.log('   FAIL', m); }
  for (const m of soft) { (legacy ? warns : fails).push(`${tag}: ${m}`); console.log(legacy ? '   warn(legacy)' : '   FAIL', m); }
}

/* ---- 覆盖：index.html 的 FACTAB（只读）每个键都要有 FAC ---- */
function factabKeys(src) {
  const a = src.indexOf('const FACTAB = {'); if (a < 0) return null;
  let i = src.indexOf('{', a), depth = 0, keys = [], str = null, buf = '', expectKey = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (str) { if (ch === '\\') { buf += src[++i]; continue; } if (ch === str) { str = null; if (depth === 1 && expectKey) { let j = i + 1; while (/\s/.test(src[j])) j++; if (src[j] === ':') keys.push(buf); } } else buf += ch; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { str = ch; buf = ''; continue; }
    if (ch === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); continue; }
    if (ch === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; continue; }
    if (ch === '{' || ch === '[' || ch === '(') { depth++; expectKey = depth === 1; continue; }
    if (ch === '}' || ch === ']' || ch === ')') { depth--; if (depth === 0) break; continue; }
    if (depth === 1 && ch === ',') { expectKey = true; continue; }
    if (depth === 1 && expectKey && /[A-Za-z_$一-鿿]/.test(ch)) {   // 不带引号的键
      let j = i; while (/[\w$一-鿿]/.test(src[j])) j++; let k = j; while (/\s/.test(src[k])) k++;
      if (src[k] === ':') { keys.push(src.slice(i, j)); i = j - 1; }
    }
  }
  return keys;
}
console.log('\n== 覆盖 ==');
console.log('模型文件:', files.join(', '));
if (loadErr.length) for (const e of loadErr) { console.log('   FAIL 载入', e); fails.push('载入 ' + e); }
const HTML = '@@REPO@@/index.html';
let keys = null; try { keys = factabKeys(fs.readFileSync(HTML, 'utf8')); } catch (e) { console.log('读不到 index.html:', e.message); }
if (keys) {
  const miss = keys.filter(k => !I.FAC[k]), extra = facTypes.filter(k => !keys.includes(k));
  console.log(`FACTAB ${keys.length} 键: ${keys.join(' ')}`);
  console.log(`FAC ${facTypes.length} 种: ${facTypes.join(' ')}`);
  console.log(miss.length ? `FACTAB 缺 FAC（会画成灰盒子）: ${miss.join(' ')}` : 'FACTAB 每个键都有 FAC');
  if (extra.length) console.log(`有 FAC、FACTAB 里还没有（型录未上，正常）: ${extra.join(' ')}`);
  for (const k of miss) warns.push(`FACTAB「${k}」没有 FAC`);
} else if (keys === null) console.log('index.html 里找不到 const FACTAB');

console.log(`\n== 汇总 == FAIL ${fails.length}，legacy/覆盖告警 ${warns.length}`);
if (QUIET || fails.length) for (const m of fails) console.log('FAIL', m);
if (QUIET) for (const m of warns) console.log('warn', m);
process.exitCode = fails.length ? 1 : 0;
