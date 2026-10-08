// eq_check2_* shared helpers (adversarial round after P249b). Builds on eq_check_lib boot().
const L = require('./eq_check_lib.cjs');
const results = [];
function rec(name, ok, info) { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  :: ' + JSON.stringify(info).slice(0, 900))); }
function note(name, info) { console.log('NOTE ' + name + '  :: ' + JSON.stringify(info).slice(0, 900)); }
const PAGE = process.env.PAGE || '@@REPO@@/index.html';   // PAGE=…/index_pre_p249b.html to compare with the pre-fix copy
async function boot0(vp) {
  const b = await L.chromium.launch();
  const phone = vp.width < 600;
  const p = await b.newPage(phone ? { viewport: vp, isMobile: true, hasTouch: true } : { viewport: vp });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file://' + PAGE); await p.waitForTimeout(700);
  return { b, p, errs, phone };
}
async function boot2(vp) {
  vp = vp || { width: 1280, height: 900 };
  const o = PAGE === '@@REPO@@/index.html' ? await L.boot(vp) : await (async () => { const o0 = await boot0(vp); const src = require('fs').readFileSync(__dirname + '/eq_check_lib.cjs', 'utf8'); const body = src.slice(src.indexOf('await p.evaluate(() => {'), src.indexOf('return { b, p, errs, phone };')); await (new Function('p', 'return (async () => {' + body + '})()'))(o0.p); return o0; })();
  await o.p.evaluate(() => {
    V.ap = (lines) => { PromptM.applyStat(S.run, PromptM.stripStat('正文。\n⟦状态⟧\n' + lines + '\n⟦/状态⟧').stat); UI.panels(); };
    V.st = () => ({ g: V.gear(), bag: V.bag(), cnt: V.count() });
    V.junk = (n, pre, q) => { const a = []; for (let i = 0; i < n; i++) a.push({ name: (pre || '杂物') + i, n: 1, q: q || '凡', desc: '' }); return a; };
  });
  // real AI turn: prose + status lines + optional command block, through Game.send (stub provider)
  o.turn = async (prose, lines, cmd, setup) => {
    await L.closeOv(o.p);
    if (setup) await o.p.evaluate(setup);
    await o.p.evaluate(([a, l, c]) => { V.reply = a + V.status(l || '') + (c ? '\n⟦命令⟧\n' + c + '\n⟦/命令⟧' : ''); U.$('#inp').value = '继续'; }, [prose, lines, cmd || '']);
    await o.p.evaluate(() => Game.send());
    await o.p.waitForFunction(() => !S.busy, null, { timeout: 20000 }); await o.p.waitForTimeout(80);
    return o.p.evaluate(() => ({ g: V.gear(), bag: V.bag(), cnt: V.count(), t: V.toast() }));
  };
  return o;
}
function summary(tag) {
  const f = results.filter(r => !r.ok);
  console.log('\n' + tag + ': ' + (results.length - f.length) + '/' + results.length + ' PASS' + (f.length ? '; FAIL: ' + f.map(x => x.name).join(' | ') : ''));
}
module.exports = Object.assign({}, L, { boot2, rec, note, results, summary });
