// eq_check_* shared helpers: boot a real chromium page, stub the AI, real clicks on sidebar / overlay / DB.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');

async function boot(vp) {
  const b = await chromium.launch();
  const phone = vp.width < 600;
  const p = await b.newPage(phone ? { viewport: vp, isMobile: true, hasTouch: true } : { viewport: vp });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file://@@REPO@@/index.html'); await p.waitForTimeout(700);
  await p.evaluate(() => {
    window.V = {};
    S.api = Object.assign({}, S.api, { kind: 'openai', key: 'sk-test', base: 'http://127.0.0.1:9/v1', model: 'stub' });
    V.reply = '';
    Prov.chat = async (o) => { const sys = String((o && o.system) || ''); return (sys.indexOf('⟦状态⟧') >= 0 && sys.indexOf('命令块') >= 0) ? V.reply : ''; };
    Sim.adjudicate = async () => null;
    V.mk = (opIdx) => { S.run = newRun(OPENERS[opIdx == null ? 6 : opIdx], '测试'); S.run.gear = {}; S.run.bag = []; UI.screen('scr-game'); UI.panels(); };
    V.gear = () => Object.fromEntries(Object.entries(S.run.gear || {}).filter(([, v]) => v).map(([k, v]) => [k, v.name]).sort((a, c) => a[0] < c[0] ? -1 : 1));
    V.bag = () => (S.run.bag || []).map(x => x.name + '×' + (x.n || 1) + (x.slot ? '@' + x.slot : '') + '(' + x.q + ')');
    V.count = () => { const c = {}; for (const k of Object.keys(S.run.gear || {})) { const g = S.run.gear[k]; if (g) c[g.name] = (c[g.name] || 0) + 1; } for (const x of S.run.bag || []) c[x.name] = (c[x.name] || 0) + (x.n || 1); return c; };
    V.toast = () => (U.$('#toast') || {}).textContent || '';
    V.status = (lines) => '\n\n⟦状态⟧\n年份：' + U.yearText(S.run.year) + '\n日期：5月12日·午\n存款：+0\n在场：无\n笔记：试一下\n' + lines + '\n⟦/状态⟧';
    V.apply = (lines) => { const st = PromptM.stripStat('正文。\n⟦状态⟧\n' + lines + '\n⟦/状态⟧').stat; PromptM.applyStat(S.run, st); UI.panels(); };
    V.drag = (src, dst) => { const dt = new DataTransfer(); src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); };
    V.q = s => document.querySelector('#col-char ' + s);
  });
  return { b, p, errs, phone };
}
async function rootOf(p, phone) {
  if (!phone) return '#col-char';
  const on = await p.evaluate(() => U.$('#ov-char').classList.contains('on'));
  if (!on) { await p.locator('#tbb-char').click(); await p.waitForTimeout(120); }
  return '#ov-char-body';
}
async function closeOv(p) { await p.evaluate(() => { if (U.$('#ov-char').classList.contains('on')) UI.close('ov-char'); if (U.$('#ov-db').classList.contains('on')) UI.close('ov-db'); }); }

// tap a gear cell then 卸下
async function sideOff(p, root, k) {
  const cell = p.locator(root + ' .dslot[data-slot="' + k + '"]');
  if (!(await cell.count())) return { err: 'no cell' };
  await cell.scrollIntoViewIfNeeded(); await cell.click(); await p.waitForTimeout(40);
  const b = p.locator(root + ' .pdesc button[data-unequip="' + k + '"]');
  if (!(await b.count())) return { err: 'no 卸下' };
  await b.click(); await p.waitForTimeout(60);
  return { toast: await p.evaluate(() => V.toast()) };
}
// tap bag row with index idx (fresh render) and click 装上 (pick = slot for picker button, or null for the plain button)
async function sideOnIdx(p, root, idx, pick) {
  const row = p.locator(root + ' .bag-item[data-bagi="' + idx + '"]');
  if (!(await row.count())) return { err: 'row not rendered' };
  const open = await row.evaluate(e => !!(e.nextElementSibling && e.nextElementSibling.classList.contains('pdesc')));
  if (!open) { await row.scrollIntoViewIfNeeded(); await row.click(); await p.waitForTimeout(40); }
  const btns = await p.locator(root + ' .pdesc button[data-equipbag="' + idx + '"]').evaluateAll(es => es.map(e => ({ slot: e.dataset.eqslot || null, txt: e.textContent })));
  const want = pick === undefined ? null : pick;
  const i = btns.findIndex(b => b.slot === want);
  if (i < 0) return { err: 'no button', btns };
  await p.locator(root + ' .pdesc button[data-equipbag="' + idx + '"]').nth(i).click(); await p.waitForTimeout(60);
  return { toast: await p.evaluate(() => V.toast()), btns };
}
async function buttonsFor(p, root, idx) {
  const row = p.locator(root + ' .bag-item[data-bagi="' + idx + '"]');
  if (!(await row.count())) return null;
  const open = await row.evaluate(e => !!(e.nextElementSibling && e.nextElementSibling.classList.contains('pdesc')));
  if (!open) { await row.scrollIntoViewIfNeeded(); await row.click(); await p.waitForTimeout(40); }
  const r = await p.locator(root + ' .pdesc button[data-equipbag="' + idx + '"]').evaluateAll(es => es.map(e => ({ slot: e.dataset.eqslot || null, txt: e.textContent })));
  // fold it again
  await row.click(); await p.waitForTimeout(30);
  return r;
}
async function openDB(p) { await closeOv(p); await p.evaluate(() => { Game.setDbTab('bag'); Game.renderDB(); UI.open('ov-db'); }); await p.waitForTimeout(80); }

module.exports = { chromium, boot, rootOf, closeOv, sideOff, sideOnIdx, buttonsFor, openDB };
