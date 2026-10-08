// P249 regression: taken-off gear can always be put back on, through every path.
// Real Chromium, real clicks where a player would click. No network (all non-file requests aborted).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const OUT = __dirname + '/eq_regress';
const results = [];
const rec = (name, ok, info) => { results.push({ name, ok: !!ok }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  :: ' + JSON.stringify(info).slice(0, 600))); };

async function boot(vp) {
  const b = await chromium.launch();
  const p = await b.newPage(vp.width < 600 ? { viewport: vp, isMobile: true, hasTouch: true } : { viewport: vp });
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
    V.bagSig = () => (S.run.bag || []).map(x => x.name + '×' + (x.n || 1)).sort().join('、');
    V.bag = () => (S.run.bag || []).map(x => x.name + '×' + (x.n || 1) + (x.slot ? '@' + x.slot : ''));
    V.toast = () => (U.$('#toast') || {}).textContent || '';
    V.junk = (n, pre) => { const a = []; for (let i = 0; i < n; i++) a.push({ name: (pre || '杂物') + i, n: 1, q: '凡', desc: '' }); return a; };
    V.status = (lines) => '\n\n⟦状态⟧\n年份：' + U.yearText(S.run.year) + '\n日期：5月12日·午\n存款：+0\n在场：无\n笔记：试一下\n' + lines + '\n⟦/状态⟧';
  });
  return { b, p, errs };
}

async function rootOf(p, phone) {
  if (!phone) return '#col-char';
  const on = await p.evaluate(() => U.$('#ov-char').classList.contains('on'));
  if (!on) { await p.locator('#tbb-char').click(); await p.waitForTimeout(150); }
  return '#ov-char-body';
}
async function closeOv(p) { await p.evaluate(() => { if (U.$('#ov-char').classList.contains('on')) UI.close('ov-char'); if (U.$('#ov-db').classList.contains('on')) UI.close('ov-db'); }); }
// sidebar / overlay: tap gear cell → 卸下
async function sideOff(p, root, k) {
  const cell = p.locator(root + ' .dslot[data-slot="' + k + '"]');
  if (!(await cell.count())) return 'no cell';
  await cell.scrollIntoViewIfNeeded(); await cell.click(); await p.waitForTimeout(60);
  const b = p.locator(root + ' .pdesc button[data-unequip="' + k + '"]');
  if (!(await b.count())) return 'no 卸下';
  await b.click(); await p.waitForTimeout(100);
  return p.evaluate(() => V.toast());
}
// sidebar / overlay: tap bag row by name → 装上 (or a picker slot)
async function sideOn(p, root, name, pick) {
  const row = p.locator(root + ' .bag-item[data-bagn="' + name + '"]').first();
  if (!(await row.count())) return { err: 'row not rendered' };
  const open = await row.evaluate(e => !!(e.nextElementSibling && e.nextElementSibling.classList.contains('pdesc')));   // a second tap would fold it
  if (!open) { await row.scrollIntoViewIfNeeded(); await row.click(); await p.waitForTimeout(60); }
  const sel = root + ' .pdesc button[data-equipbag][data-bagn="' + name + '"]' + (pick ? '[data-eqslot="' + pick + '"]' : ':not([data-eqslot])');
  const btn = p.locator(sel).first();
  if (!(await btn.count())) {
    const pickers = await p.locator(root + ' .pdesc button[data-eqslot]').count();
    return { err: 'no button', pickers };
  }
  await btn.click(); await p.waitForTimeout(100);
  return { toast: await p.evaluate(() => V.toast()) };
}
async function startOpener(p, opId) {
  await closeOv(p);
  await p.evaluate(() => { UI.screen('scr-select'); });
  await p.waitForTimeout(120);
  const idx = await p.evaluate(id => OPENERS.filter(o => !o.custom).findIndex(o => o.id === id), opId);
  const card = p.locator('#opener-grid .op-card').nth(idx);
  await card.scrollIntoViewIfNeeded(); await card.click();
  const go = p.locator('#reg-go'); await go.scrollIntoViewIfNeeded(); await go.click();
  await p.waitForTimeout(250);
  await p.evaluate(() => { UI.screen('scr-game'); UI.panels(); });
}
async function roundTrip(p, phone, k) {
  const root = await rootOf(p, phone);
  const before = await p.evaluate(k => ({ nm: S.run.gear[k] && S.run.gear[k].name, gear: JSON.stringify(V.gear()), bag: V.bagSig() }), k);
  if (!before.nm) return { skip: 1 };
  const t1 = await sideOff(p, root, k);
  // no reopen on phone: the overlay must already be fresh
  const on = await sideOn(p, root, before.nm);
  const after = await p.evaluate(() => ({ gear: JSON.stringify(V.gear()), bag: V.bagSig() }));
  return { ok: !on.err && after.gear === before.gear && after.bag === before.bag && !/看不出|认不出/.test(on.toast || ''), before, after, t1, on };
}

async function suite(tag, vp) {
  const phone = vp.width < 600;
  const { b, p, errs } = await boot(vp);
  const T = (n) => tag + ' ' + n;

  // 1. every stock opener, every worn slot, real start flow, real taps
  const ops = await p.evaluate(() => OPENERS.filter(o => !o.custom).map(o => o.id));
  for (const id of ops) {
    await startOpener(p, id);
    const slots = await p.evaluate(() => Object.keys(S.run.gear).filter(k => S.run.gear[k]));
    for (const k of slots) {
      const r = await roundTrip(p, phone, k);
      if (r.skip) continue;
      rec(T('opener ' + id + ' ' + k + ' ' + r.before.nm + ' 卸下→装上 回原槽'), r.ok, r);
    }
  }

  // 2. AI-equipped gear (status line slot words), round trip each
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.wand = { name: '二手扫帚', q: '凡', desc: '' }; const st = PromptM.stripStat('正文。\n⟦状态⟧\n装备：+星屑之息（饰·良·会发光的小东西）｜+晨露（袍·良·轻薄）｜+猫耳发箍（饰·良）｜+夜航护目镜（帽·良·挡风）\n⟦/状态⟧').stat; PromptM.applyStat(S.run, st); UI.panels(); });
  const aiG = await p.evaluate(() => V.gear());
  rec(T('AI 装备 placed by slot word'), aiG.acc1 === '星屑之息' && aiG.robe === '晨露' && aiG.acc2 === '猫耳发箍' && aiG.hat === '夜航护目镜', aiG);
  for (const k of ['acc1', 'robe', 'acc2', 'hat']) { const r = await roundTrip(p, phone, k); rec(T('AI gear ' + k + ' round trip'), r.ok, r); }

  // 3. no-keyword name placed by hand (DB select / drag) → sidebar 卸下 → 装上
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.acc1 = { name: '银铃', q: '良', desc: '' }; S.run.bag = [{ name: '星辰之眼', n: 1, q: '稀', desc: '闪着微光' }]; Game.bagWear(0, 'acc2'); });
  { const r = await roundTrip(p, phone, 'acc2'); rec(T('no-keyword 星辰之眼 hand-placed acc2 round trip'), r.ok && JSON.parse(r.after.gear).acc2 === '星辰之眼', r); }

  // 4. old-save bag item, slot unknown → picker in pdesc, choose 饰
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '月石', n: 1, q: '凡', desc: '凉凉的' }]; UI.panels(); });
  { const root = await rootOf(p, phone); const no = await sideOn(p, root, '月石'); const r = await sideOn(p, root, '月石', 'acc'); const g = await p.evaluate(() => V.gear());
    rec(T('unknown slot shows picker, 饰 equips acc1'), no.err === 'no button' && no.pickers === 5 && !r.err && g.acc1 === '月石', { no, r, g }); }

  // 5. bag of 25: taken-off item is visible (front) and re-equippable
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.robe = { name: '学员袍', q: '凡', desc: '' }; S.run.bag = V.junk(25); UI.panels(); });
  { const r = await roundTrip(p, phone, 'robe'); const len = await p.evaluate(() => S.run.bag.length); rec(T('bag 25: unequip visible + re-equip'), r.ok && len === 25, { r, len }); }

  // 6. bag of 40 with an heirloom at [0]: unequip loses nothing, item visible, re-equip restores
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.robe = { name: '学员袍', q: '凡', desc: '' }; S.run.bag = [{ name: '传家怀表', n: 1, q: '稀', desc: '' }].concat(V.junk(39, '杂物')); UI.panels(); });
  { const root = await rootOf(p, phone); await sideOff(p, root, 'robe');
    const mid = await p.evaluate(() => ({ len: S.run.bag.length, heir: S.run.bag.some(x => x.name === '传家怀表'), idx: S.run.bag.findIndex(x => x.name === '学员袍') }));
    const vis = await p.locator(root + ' .bag-item[data-bagn="学员袍"]').count();
    const on = await sideOn(p, root, '学员袍');
    const end = await p.evaluate(() => ({ len: S.run.bag.length, heir: S.run.bag.some(x => x.name === '传家怀表'), robe: (S.run.gear.robe || {}).name, junk: S.run.bag.filter(x => /^杂物/.test(x.name)).length }));
    rec(T('bag 40: unequip drops nothing, visible, re-equip'), mid.len === 41 && mid.heir && mid.idx === 0 && vis === 1 && !on.err && end.len === 40 && end.heir && end.robe === '学员袍' && end.junk === 39, { mid, vis, on, end }); }

  // 7. full bag swap: chosen item leaves, old gear enters, nothing else touched
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; const j = V.junk(40, 'F'); j[3] = { name: '银边尖帽', n: 1, q: '良', desc: '' }; j[4] = { name: '星图卷轴', n: 1, q: '稀', desc: '' }; S.run.bag = j; UI.panels(); });
  { const root = await rootOf(p, phone); const on = await sideOn(p, root, '银边尖帽');
    const e = await p.evaluate(() => ({ hat: (S.run.gear.hat || {}).name, len: S.run.bag.length, silver: S.run.bag.some(x => x.name === '银边尖帽'), old: S.run.bag.find(x => x.name === '旧尖帽'), map: S.run.bag.some(x => x.name === '星图卷轴'), f0: S.run.bag.some(x => x.name === 'F0') }));
    rec(T('bag 40 swap: no stale splice, no eviction'), !on.err && e.hat === '银边尖帽' && e.len === 40 && !e.silver && e.old && e.old.slot === 'hat' && e.map && e.f0, { on, e }); }

  // 8. n>1 stack: equip then unequip merges back into one ×3 row
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '学员袍', n: 3, q: '凡', desc: '' }]; UI.panels(); });
  { const root = await rootOf(p, phone); const on = await sideOn(p, root, '学员袍'); const mid = await p.evaluate(() => V.bag()); await sideOff(p, root, 'robe'); const end = await p.evaluate(() => V.bag());
    rec(T('stack ×3: equip → ×2, unequip → one ×3 row'), !on.err && mid.join() === '学员袍×2' && end.length === 1 && /^学员袍×3/.test(end[0]), { mid, end }); }

  // 9. stack ×3 at [0] of a full bag swapping an occupied slot
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.robe = { name: '旧学员袍', q: '凡', desc: '' }; S.run.bag = [{ name: '学员袍', n: 3, q: '凡', desc: '' }].concat(V.junk(39)); UI.panels(); });
  { const root = await rootOf(p, phone); const on = await sideOn(p, root, '学员袍');
    const e = await p.evaluate(() => ({ robe: (S.run.gear.robe || {}).name, left: (S.run.bag.find(x => x.name === '学员袍') || {}).n, old: S.run.bag.some(x => x.name === '旧学员袍'), junk: S.run.bag.filter(x => /^杂物/.test(x.name)).length }));
    rec(T('full bag, stack at [0]: copies kept'), !on.err && e.robe === '学员袍' && e.left === 2 && e.old && e.junk === 39, { on, e }); }

  // 10. acc1 / acc2 go back to their own accessory slot
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.gear.acc1 = { name: '银铃', q: '良', desc: '叮当' }; S.run.gear.acc2 = { name: '月石', q: '凡', desc: '凉凉的' }; UI.panels(); });
  { const r = await roundTrip(p, phone, 'acc2'); rec(T('acc2 月石 round trip, acc1 untouched'), r.ok, r); }
  { const root = await rootOf(p, phone); await sideOff(p, root, 'acc1'); await sideOff(p, root, 'acc2');
    await sideOn(p, root, '月石'); const g1 = await p.evaluate(() => V.gear()); await sideOn(p, root, '银铃'); const g2 = await p.evaluate(() => V.gear());
    rec(T('acc1+acc2 both off, re-equip in reverse order'), g1.acc2 === '月石' && !g1.acc1 && g2.acc1 === '银铃' && g2.acc2 === '月石', { g1, g2 }); }

  // 11. 14-character name keeps its last characters through equip/unequip
  await closeOv(p);
  await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '缀满星辉碎钻的深蓝色魔女长袍', n: 1, q: '良', desc: '夜市淘来的' }]; UI.panels(); });
  { const root = await rootOf(p, phone); const on1 = await sideOn(p, root, '缀满星辉碎钻的深蓝色魔女长袍'); const g = await p.evaluate(() => (S.run.gear.robe || {}).name);
    const r = await roundTrip(p, phone, 'robe');
    rec(T('14-char name equips whole and round-trips'), !on1.err && g === '缀满星辉碎钻的深蓝色魔女长袍' && r.ok, { on1, g, r }); }

  // 12. the 13 bag-slot picker variants never put an item in a wrong slot (old saves without slot field)
  await closeOv(p);
  const guess = await p.evaluate(() => {
    const want = { 通勤护目镜: 'hat', 训练护目镜: 'hat', 队标训练服: 'robe', 退役常服: 'robe', 守灵旧披: 'robe', 护腕: 'acc', 香灰岛印信: 'acc', 羊毛围巾: 'acc', 冠军戒指: 'acc', 剑穗挂坠: 'acc', 红连帽衫: 'robe', 学院制服: 'robe', 皮手套: 'acc', 星纹火漆残片: null };
    const out = {};
    for (const nm of Object.keys(want)) { const k = slotKOf({ gear: {} }, { name: nm, desc: nm === '训练护目镜' ? '扫帚队列课的标配' : nm === '学院制服' ? '校徽绣在左胸' : '' }); out[nm] = [k, want[nm]]; }
    return out;
  });
  rec(T('old-save guesses: right slot or none, never wrong'), Object.values(guess).every(([k, w]) => (w === null ? k === null : (w === 'acc' ? /^acc/.test(k || '') : k === w))), guess);

  // 13. run.gear missing (very old save) does not crash the panel or the wear path
  await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '旧尖帽', n: 1, q: '凡', desc: '' }]; delete S.run.gear; });
  { const e = await p.evaluate(() => { try { UI.panels(); const ok = Game.bagWear(0, 'auto', '旧尖帽'); return { ok, hat: (S.run.gear.hat || {}).name }; } catch (err) { return { err: err.message }; } });
    rec(T('run.gear undefined guarded'), e.ok && e.hat === '旧尖帽', e); }

  // ---------- 资料库 panel ----------
  if (!phone || true) {
    const openDB = async () => { await closeOv(p); await p.evaluate(() => { Game.setDbTab('bag'); Game.renderDB(); UI.open('ov-db'); }); await p.waitForTimeout(120); };
    // 14. DB 卸下 → 装上(auto) for an opener item with no keyword
    await startOpener(p, 'shengnv');
    await openDB();
    await p.locator('#db-body [data-gsoff="acc2"]').click(); await p.waitForTimeout(80);
    { const row = p.locator('#db-body .db-row[data-bk="香灰岛印信"]'); const opt = await row.locator('[data-bslot] option').first().textContent();
      await row.locator('[data-bwear]').click(); await p.waitForTimeout(80);
      const g = await p.evaluate(() => V.gear()); rec(T('DB auto: 香灰岛印信 back to acc2'), g.acc2 === '香灰岛印信' && /饰二/.test(opt), { g, opt }); }
    // 15. DB explicit slot + distinct 饰一/饰二 labels
    await p.evaluate(() => { S.run.gear.acc1 = { name: '银铃', q: '良', desc: '' }; delete S.run.gear.acc2; S.run.bag = [{ name: '月石', n: 1, q: '凡', desc: '' }]; Game.renderDB(); });
    { const labels = await p.locator('#db-body .db-row[data-bk="月石"] [data-bslot] option').allTextContents();
      await p.locator('#db-body .db-row[data-bk="月石"] [data-bslot]').selectOption('acc2');
      await p.locator('#db-body .db-row[data-bk="月石"] [data-bwear]').click(); await p.waitForTimeout(80);
      const g = await p.evaluate(() => V.gear());
      rec(T('DB explicit 饰二, labels distinct'), g.acc2 === '月石' && g.acc1 === '银铃' && labels.includes('饰一') && labels.includes('饰二'), { g, labels }); }
    // 15b. DB explicit 饰一 while 饰一 is taken and 饰二 is free → fills 饰二, both stay worn (no ping-pong)
    await p.evaluate(() => { S.run.gear = { acc1: { name: '月石', q: '凡', desc: '' } }; S.run.bag = [{ name: '香灰岛印信', n: 1, q: '良', desc: '' }]; Game.renderDB(); });
    { await p.locator('#db-body .db-row[data-bk="香灰岛印信"] [data-bslot]').selectOption('acc1');
      await p.locator('#db-body .db-row[data-bk="香灰岛印信"] [data-bwear]').click(); await p.waitForTimeout(80);
      const e = await p.evaluate(() => ({ g: V.gear(), bag: V.bag() }));
      rec(T('DB explicit occupied 饰一 with 饰二 free: both worn'), e.g.acc1 === '月石' && e.g.acc2 === '香灰岛印信' && !e.bag.length, e); }
    // 16. DB: edit note then click 装上 once; pick slot then change quality then 装上
    await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '月石', n: 1, q: '凡', desc: '' }, { name: '银戒', n: 1, q: '良', desc: '' }]; Game.renderDB(); });
    { const row = p.locator('#db-body .db-row[data-bk="月石"]');
      await row.locator('[data-bslot]').selectOption('acc2');
      await row.locator('[data-df="bdesc"]').fill('外婆给的');
      await row.locator('[data-bwear]').click(); await p.waitForTimeout(100);
      const e = await p.evaluate(() => ({ g: V.gear(), d: (S.run.gear.acc2 || {}).desc }));
      rec(T('DB edit note then 装上: click not eaten, slot kept'), e.g.acc2 === '月石' && e.d === '外婆给的', e); }
    { const row = p.locator('#db-body .db-row[data-bk="银戒"]');
      await row.locator('[data-bslot]').selectOption('acc1');
      await row.locator('[data-df="bq"]').selectOption('稀'); await p.waitForTimeout(50);
      await row.locator('[data-bwear]').click(); await p.waitForTimeout(100);
      const e = await p.evaluate(() => ({ g: V.gear(), q: (S.run.gear.acc1 || {}).q }));
      rec(T('DB pick slot, change quality, 装上'), e.g.acc1 === '银戒' && e.q === '稀', e); }
    // 17. DB stale after an AI turn removed an earlier item (no re-render): name check equips the clicked item
    await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '面包', n: 1, q: '凡', desc: '' }, { name: '星光尖帽', n: 1, q: '良', desc: '' }, { name: '短剑', n: 1, q: '凡', desc: '' }]; Game.renderDB();
      PromptM.applyStat(S.run, PromptM.stripStat('x⟦状态⟧行囊：-面包⟦/状态⟧').stat); });
    { await p.locator('#db-body .db-row[data-bk="星光尖帽"] [data-bwear]').click(); await p.waitForTimeout(80);
      const g = await p.evaluate(() => V.gear()); rec(T('DB stale rows: clicked item is the one equipped'), g.hat === '星光尖帽' && !g.wand, g); }
    // 17b. DB stale delete removes the named row
    await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '面包', n: 1, q: '凡', desc: '' }, { name: '冷茶', n: 1, q: '凡', desc: '' }, { name: '星光尖帽', n: 1, q: '良', desc: '' }]; Game.renderDB();
      PromptM.applyStat(S.run, PromptM.stripStat('x⟦状态⟧行囊：-面包⟦/状态⟧').stat); });
    { await p.locator('#db-body .db-row[data-bk="冷茶"] [data-ddel]').click(); await p.waitForTimeout(80);
      const bag = await p.evaluate(() => V.bag()); rec(T('DB stale delete hits the named row'), bag.join() === '星光尖帽×1', bag); }
    // 17c. an open DB refreshes when an AI turn lands
    await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '面包', n: 1, q: '凡', desc: '' }, { name: '星光尖帽', n: 1, q: '良', desc: '' }]; Game.renderDB(); V.reply = '她把面包吃了。' + V.status('背包：-面包×1'); });
    { await p.evaluate(() => { U.$('#inp').value = '吃面包'; }); await p.evaluate(() => Game.send());
      await p.waitForFunction(() => !S.busy, null, { timeout: 15000 }); await p.waitForTimeout(100);
      const rows = await p.locator('#db-body .db-row[data-bk]').evaluateAll(es => es.map(e => e.dataset.bi + ':' + e.dataset.bk));
      rec(T('open DB re-rendered after AI turn'), rows.join() === '0:星光尖帽', rows); }
    await closeOv(p);
  }

  // ---------- drag & drop (desktop has HTML5 DnD; dispatch real DragEvents on the real listeners) ----------
  if (!phone) {
    await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '通勤护目镜', q: '凡', desc: '第三层航道风大' }; S.run.gear.acc1 = { name: '护腕', q: '凡', desc: '' }; S.run.bag = V.junk(22); UI.panels();
      V.drag = (src, dst) => { const dt = new DataTransfer(); src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); };
      V.q = s => document.querySelector('#col-char ' + s); });
    const d1 = await p.evaluate(() => { V.drag(V.q('.dslot[data-slot="hat"]'), V.q('.bagbox')); return { hat: S.run.gear.hat, top: S.run.bag[0], vis: !!V.q('.bag-item[data-bagn="通勤护目镜"]') }; });
    rec(T('drag slot→bag: item at bag front with slot, visible'), !d1.hat && d1.top.name === '通勤护目镜' && d1.top.slot === 'hat' && d1.vis, d1);
    const d2 = await p.evaluate(() => { V.drag(V.q('.bag-item[data-bagn="通勤护目镜"]'), V.q('.doll-wrap')); return { g: V.gear(), t: V.toast() }; });
    rec(T('drag bag→doll (auto) back to hat'), d2.g.hat === '通勤护目镜', d2);
    const d3 = await p.evaluate(() => { V.drag(V.q('.dslot[data-slot="acc1"]'), V.q('.bagbox')); V.drag(V.q('.bag-item[data-bagn="护腕"]'), V.q('.dslot[data-slotk="acc2"]')); return V.gear(); });
    rec(T('drag bag→explicit acc2 slot'), d3.acc2 === '护腕' && !d3.acc1, d3);
    const d4 = await p.evaluate(() => { V.drag(V.q('.dslot[data-slot="acc2"]'), V.q('.bagbox')); const src = V.q('.bag-item[data-bagn="护腕"]'); S.run.bag.unshift({ name: '新来的', n: 1, q: '凡', desc: '' }); V.drag(src, V.q('.doll-wrap')); return { g: V.gear(), t: V.toast() }; });
    rec(T('drag with stale index still wears the named item'), d4.g.acc2 === '护腕' && !d4.g.robe, d4);
  }

  // ---------- AI turn (stubbed provider, real send→aiTurn→MVU→applyStat) ----------
  const turn = async (reply, setup) => {
    await closeOv(p);
    await p.evaluate(([setup]) => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐有些塌' }; S.run.gear.wand = { name: '二手扫帚', q: '凡', desc: '' }; if (setup) (new Function(setup))(); UI.panels(); }, [setup || '']);
    // reply = 'prose%S%status lines%C%command block json'  → prose + ⟦状态⟧…⟦/状态⟧ + ⟦命令⟧…⟦/命令⟧ (protocol order)
    await p.evaluate(r => { const [pr, rest] = r.split('%S%'); const [st, cm] = String(rest || '').split('%C%'); V.reply = pr + V.status(st || '') + (cm ? '\n⟦命令⟧\n' + cm + '\n⟦/命令⟧' : ''); }, reply);
    await p.evaluate(() => { U.$('#inp').value = '继续'; }); await p.evaluate(() => Game.send());
    await p.waitForFunction(() => !S.busy, null, { timeout: 15000 }); await p.waitForTimeout(100);
    return p.evaluate(() => ({ g: V.gear(), bag: V.bag() }));
  };
  { const r = await turn('她摘下「旧尖帽」夹在腋下。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽"}]');
    rec(T('AI UNEQUIP_ITEM → bag with slot'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r);
    const root = await rootOf(p, phone); const on = await sideOn(p, root, '旧尖帽'); const g = await p.evaluate(() => V.gear());
    rec(T('AI-unequipped item re-equips from ' + (phone ? 'overlay' : 'sidebar')), !on.err && g.hat === '旧尖帽', { on, g }); }
  { const r = await turn('她摘下旧尖帽塞进挎包。%S%装备：-旧尖帽'); rec(T('status line 装备：-X → bag'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await turn('一阵风把旧尖帽卷走了。%S%装备：-旧尖帽（丢）'); rec(T('status line 装备：-X（丢） → gone'), !r.g.hat && !r.bag.length, r); }
  { const r = await turn('她摘下「旧尖帽」塞进挎包。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽"},{"cmd":"ADD_ITEM","name":"旧尖帽","n":1}]');
    rec(T('UNEQUIP + ADD_ITEM same name → one copy'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await turn('她又骑上了二手扫帚。%S%装备：+二手扫帚（杖帚·凡·尾穗微秃）', 'Game.gearOff("wand");');
    rec(T('AI re-equip consumes the bag copy'), r.g.wand === '二手扫帚' && !r.bag.some(x => /二手扫帚/.test(x)), r); }
  { await turn('她把星辉别在胸前。%S%装备：+星辉（饰·稀·夜里微亮）');
    const r = await p.evaluate(async () => { V.reply = '星辉还在。' + V.status('装备：+星辉（饰·稀·夜里微亮）'); U.$('#inp').value = '继续'; await Game.send(); return { g: V.gear() }; });
    rec(T('AI restate accessory: no duplicate in acc2'), r.g.acc1 === '星辉' && !r.g.acc2, r); }
  { const r = await turn('她拿到星纹尖帽。%S%%C%[{"cmd":"ADD_ITEM","name":"星纹尖帽","quality":"珍"}]');
    const q = await p.evaluate(() => (S.run.bag.find(x => x.name === '星纹尖帽') || {}).q); rec(T('quality 珍 → 稀, not 凡'), q === '稀', { r, q }); }
  { const r = await turn('她换上新式扫帚。%S%装备：+新式扫帚（杖帚·良·新的）', 'S.run.gear.wand = { name: "灰狼的锋锐短剑", q: "稀", desc: "" }; S.run.bag = [{ name: "灰狼的锋锐短剑", n: 1, q: "凡", desc: "【瑕疵】沉手" }];');
    const rows = r.bag.filter(x => /灰狼/.test(x)).length;
    const root = await rootOf(p, phone); await sideOff(p, root, 'wand');
    const e = await p.evaluate(() => { const i = S.run.bag.findIndex(x => x.name === '灰狼的锋锐短剑' && x.q === '稀'); Game.bagWear(i, 'auto', '灰狼的锋锐短剑'); return S.run.gear.wand; });
    rec(T('displaced 稀 gear not merged into 凡 row'), rows === 2 && e && e.q === '稀', { r, e }); }

  // ================= P249b: second round (adversarial checker findings 1-9 + caps) =================
  await closeOv(p);
  await p.evaluate(() => {
    V.ap = (lines) => { PromptM.applyStat(S.run, PromptM.stripStat('正文。\n⟦状态⟧\n' + lines + '\n⟦/状态⟧').stat); UI.panels(); };
    V.drag = (src, dst) => { const dt = new DataTransfer(); src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt })); dst.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); };
    V.q = s => document.querySelector('#col-char ' + s);
  });
  const openDB2 = async () => { await closeOv(p); await p.evaluate(() => { Game.setDbTab('bag'); Game.renderDB(); UI.open('ov-db'); }); await p.waitForTimeout(120); };
  const sendRaw = async (prose, lines) => { await closeOv(p); await p.evaluate(([a, l]) => { V.reply = a + V.status(l); U.$('#inp').value = '继续'; }, [prose, lines]); await p.evaluate(() => Game.send()); await p.waitForFunction(() => !S.busy, null, { timeout: 15000 }); await p.waitForTimeout(80); return p.evaluate(() => ({ g: V.gear(), bag: V.bag(), t: V.toast() })); };

  // 1. equip from a stack + the AI also writes the bag removal → only one copy leaves the bag
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '学员袍', n: 2, q: '凡', desc: '' }]; V.ap('装备：+学员袍（袍·凡）\n背包：-学员袍'); return { g: V.gear(), bag: V.bag() }; });
    rec(T('P249b-1 装备：+X & 背包：-X same turn, stack×2 → one left'), r.g.robe === '学员袍' && r.bag.join() === '学员袍×1', r); }
  { const r = await turn('她换上学员袍。%S%%C%[{"cmd":"REMOVE_ITEM","name":"学员袍","n":1},{"cmd":"EQUIP_ITEM","name":"学员袍","slot":"袍"}]', 'S.run.bag = [{ name: "学员袍", n: 2, q: "凡", desc: "" }];');
    rec(T('P249b-1 cmd REMOVE_ITEM + EQUIP_ITEM (real turn) → one left'), r.g.robe === '学员袍' && r.bag.join() === '学员袍×1', r); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '面包', n: 2, q: '凡', desc: '' }, { name: '学员袍', n: 1, q: '凡', desc: '' }]; V.ap('装备：+学员袍（袍·凡）\n背包：-面包'); const a = V.bag(); V.ap('背包：-面包'); return { g: V.gear(), a, bag: V.bag() }; });
    rec(T('P249b-1 unrelated / plain 背包：-Y still removes Y'), r.g.robe === '学员袍' && r.a.join() === '面包×1' && !r.bag.length, r); }
  { const r = await p.evaluate(async () => { V.mk(6); UI.panels(); const o0 = Prov.chat; let sys = ''; Prov.chat = async (o) => { const s = String((o && o.system) || ''); if (s.indexOf('命令块') >= 0) sys = s; return o0(o); };
      V.reply = '她发了会儿呆。' + V.status(''); U.$('#inp').value = '发呆'; try { await Game.send(); } finally { Prov.chat = o0; }
      // P249e expectation change: the status-line spec and the UNEQUIP/LOSE descriptions now state the fixed protocol (first word of the reason must be a loss marker)
      return { a: /从背包里拿出来穿的引擎自动从背包扣/.test(sys), b: /别再另写 REMOVE_ITEM/.test(sys), c: sys.indexOf('-名 = 脱下收进背包。东西真没了才写 -名（丢了/卖了/送人/被偷/被抢/毁了/用完/没收…：原因）——括号里第一个词必须是这几个之一；坏了但还留着写 -名（坏了：哪里坏了）') >= 0, d: !/（原因）＝这件没了|带了括号写原因＝没了|丢了\/卖了\/…，照实写/.test(sys),
        e: /LOSE_EQUIPMENT（name\/why）——东西真没了才用这条，why 写「丢了\/卖了\/送人\/被偷\/被抢\/毁了\/用完\/没收…：原因」——第一个词必须是这几个之一/.test(sys), f: /UNEQUIP_ITEM（name\/why）——脱下收进背包.*why 写「坏了：哪里坏了」/.test(sys) }; });
    // P249d expectation change (rule C): the status-line spec now reads '-名 = 脱下收进背包；东西没了（…）才写 -名（…）'; no text may say a reason means lost
    rec(T('P249b-1/2 prompt (P249d rule C): equip-from-bag needs no bag removal; -名 = bag; only 东西没了 → -名（丢了/卖了/…）; UNEQUIP/LOSE text matches'), r.a && r.b && r.c && r.d && r.e && r.f, r); }

  // 2. -X（reason）: gone unless the reason says it was only taken off / stored
  { const r = await p.evaluate(() => {
      // P249d expectation change (rule A): '撕破了' → partial damage (bag + flaw), '融化' → no listed loss phrase (bag); both moved from gone to kept
      // P249e expectation change (fixed protocol: lost only when the reason starts with a loss marker, no recovery/keep word): 11 moved gone → bag:
      //   扔了 | 掉进海里 | 给了艾琳 | 借给艾琳 | 还给学院 | 被风吹走 | 没了 | 遗落 | 脱下后被偷了 | 扔进河里 | 拿去换了钱
      const gone = ['丢', '被偷', '被抢', '献祭', '打碎', '卖了', '送人', '被没收'];
      const kept = ['摘下收进挎包', '脱下', '换下', '收起来', '先不戴了', '挂起', '放回包里', '塞进背包', '帽·凡', '怕弄坏先摘下收好', '扔进背包', '不穿了', '换成新尖帽', '撕破了', '融化',
        '扔了', '掉进海里', '给了艾琳', '借给艾琳', '还给学院', '被风吹走', '没了', '遗落', '脱下后被偷了', '扔进河里', '拿去换了钱'];
      const one = why => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; V.ap('装备：-旧尖帽（' + why + '）'); return S.run.gear.hat ? 'worn' : S.run.bag.some(x => x.name === '旧尖帽' && x.slot === 'hat') ? 'bag' : 'gone'; };
      return { gone: gone.map(w => [w, one(w)]).filter(x => x[1] !== 'gone'), kept: kept.map(w => [w, one(w)]).filter(x => x[1] !== 'bag') }; });
    rec(T('P249b-2 -X（原因）(P249e protocol): 8 loss-marker reasons gone, 26 other reasons → bag'), !r.gone.length && !r.kept.length, r); }
  { const r = await turn('她摘下旧尖帽。%S%装备：-旧尖帽'); rec(T('P249b-2 bare -X → bag'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await turn('旧尖帽被人顺走了。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"旧尖帽"}]'); rec(T('P249b-2 LOSE_EQUIPMENT → gone'), !r.g.hat && !r.bag.length, r); }
  { const r = await turn('她摘下旧尖帽。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽"}]'); rec(T('P249b-2 UNEQUIP_ITEM → bag'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  // P249d expectation change (rule A): '被风吹进云海' has no closed-list loss phrase → bag; '被风吹走了' (吹走) → gone
  { const r = await turn('风把旧尖帽卷进了云海。%S%装备：-旧尖帽（被风吹进云海）'); rec(T('P249b-2 real turn -X（被风吹进云海） → bag (P249d rule A: no listed loss phrase)'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  // P249e expectation change: '被风吹走了' does not start with a loss marker → bag (was gone); '被偷：在码头' starts with one → gone
  { const r = await turn('风把旧尖帽吹走了。%S%装备：-旧尖帽（被风吹走了）'); rec(T('P249e real turn -X（被风吹走了） → bag (no leading loss marker)'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await turn('旧尖帽在码头被偷了。%S%装备：-旧尖帽（被偷：在码头）'); rec(T('P249e real turn -X（被偷：在码头） → gone'), !r.g.hat && !r.bag.length, r); }
  await closeOv(p);
  { await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; UI.panels(); });
    const root = await rootOf(p, phone); await sideOff(p, root, 'hat');
    // P249e expectation change: '被风吹走' is not a loss under the fixed protocol → the bag copy stays (rule 2); a real loss marker still removes it
    const r = await p.evaluate(() => { V.ap('装备：-旧尖帽（被风吹走）'); const a = { g: V.gear(), bag: V.bag() }; V.ap('装备：-旧尖帽（被偷了）'); return { a, g: V.gear(), bag: V.bag() }; });
    rec(T('P249b-2 (P249e) UI 卸下 then AI -X（被风吹走）: bag copy stays; then -X（被偷了）: bag copy gone'), !r.a.g.hat && r.a.bag.join() === '旧尖帽×1@hat' && !r.g.hat && !r.bag.length, r); }

  // 3. one bag cap (40) for every insert path; new arrivals never dropped; evictions announced
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = []; for (let i = 0; i < 40; i++) S.run.bag.push({ name: '旧帽' + i, n: 1, q: '凡', desc: '', slot: 'hat' });
      V.ap('背包：+魔力电池×3（良·新买的）');
      return { len: S.run.bag.length, bat: (S.run.bag.find(x => x.name === '魔力电池') || {}).n, kept: S.run.bag.filter(x => /^旧帽/.test(x.name)).length, t: V.toast() }; });
    rec(T('P249b-3 40 remembered-slot rows + AI item: item kept, one old row out, announced'), r.len === 40 && r.bat === 3 && r.kept === 39 && /挤掉了「旧帽\d+」/.test(r.t), r); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = []; for (let i = 0; i < 40; i++) S.run.bag.push({ name: '旧帽' + i, n: 1, q: '凡', desc: '', slot: 'hat' });
      bagPut(S.run, { name: '战利品短剑', q: '稀', desc: '缴获' }); const dt = bagDropTxt(S.run);
      return { len: S.run.bag.length, loot: S.run.bag.some(x => x.name === '战利品短剑'), dt }; });
    rec(T('P249b-3 loot via bagPut into 40 remembered-slot rows: kept, eviction reported'), r.len === 40 && r.loot && /挤掉了「旧帽\d+」/.test(r.dt), r); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = V.junk(40); S.run.gear.hat = { name: '帽0', q: '凡', desc: '' };
      for (let i = 1; i <= 12; i++) V.ap('装备：+帽' + i + '（帽·凡）');
      return { len: S.run.bag.length, hats: S.run.bag.filter(x => /^帽\d+$/.test(x.name)).length, junk: S.run.bag.filter(x => /^杂物/.test(x.name)).length, j0: S.run.bag.some(x => x.name === '杂物0'), j39: S.run.bag.some(x => x.name === '杂物39') }; });
    rec(T('P249b-3 12 AI hat swaps on a full bag: stays 40, oldest junk out first, no hat lost'), r.len === 40 && r.hats === 12 && r.junk === 28 && !r.j0 && r.j39, r); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.wealth = 1e7; S.run.bag = V.junk(40); V.ap('购置：装备｜会唱歌的月光石小摆件好看极了｜良');
      const a = { len: S.run.bag.length, got: S.run.bag.some(x => x.name === '会唱歌的月光石小摆件好看极了') };
      S.run.bag = V.junk(40); psGoodsAdd(S.run, 'p77_feilun', 5); a.len2 = S.run.bag.length; a.ps = (S.run.bag.find(x => x.ps === 'p77_feilun') || {}).n; return a; });
    rec(T('P249b-3 shop purchase (14-char name) and trade-goods delivery into a full bag: kept, bag 40'), r.len === 40 && r.got && r.len2 === 40 && r.ps === 5, r); }
  await closeOv(p);
  { await p.evaluate(() => { V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' }, robe: { name: '学员袍', q: '凡', desc: '' } }; S.run.bag = V.junk(40); UI.panels(); });
    const root = await rootOf(p, phone); const t1 = await sideOff(p, root, 'hat'); const t2 = await sideOff(p, root, 'robe');
    const mid = await p.evaluate(() => ({ len: S.run.bag.length, junk: S.run.bag.filter(x => /^杂物/.test(x.name)).length }));
    const r = await p.evaluate(() => { V.ap('背包：+面包（凡·刚买的）'); return { len: S.run.bag.length, bread: S.run.bag.some(x => x.name === '面包'), hat: S.run.bag.some(x => x.name === '旧尖帽'), robe: S.run.bag.some(x => x.name === '学员袍'), j0: S.run.bag.some(x => x.name === '杂物0'), t: V.toast() }; });
    rec(T('P249b-3 UI take-offs overfill without dropping; next insert resolves to 40 and says what went'), mid.len === 42 && mid.junk === 40 && !/挤掉/.test(String(t1) + String(t2)) && r.len === 40 && r.bread && r.hat && r.robe && !r.j0 && /挤掉了「杂物0」/.test(r.t), { t1, t2, mid, r }); }
  { await p.evaluate(() => { V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' } }; S.run.bag = V.junk(40); UI.panels(); });
    const root = await rootOf(p, phone); await sideOff(p, root, 'hat');
    const r = await sendRaw('她看了看天。', '');
    const e = await p.evaluate(() => ({ len: S.run.bag.length, hat: (S.run.bag.find(x => x.name === '旧尖帽') || {}).slot }));
    rec(T('P249b-3 the next AI turn brings an overfull bag back to 40, taken-off item kept'), e.len === 40 && e.hat === 'hat', { e, r }); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = []; for (let i = 0; i < 40; i++) S.run.bag.push({ name: '货' + i, n: 1, q: '良', desc: '', ps: 'alt:' + i }); V.ap('背包：+面包'); return { len: S.run.bag.length, bread: S.run.bag.some(x => x.name === '面包'), ps: S.run.bag.filter(x => x.ps).length }; });
    rec(T('P249b-3 nothing evictable (all trade goods): new arrival still kept'), r.bread && r.ps === 40, r); }

  // 4. 资料库 slot pick is remembered per row, not per name; cleared once that row is equipped
  await openDB2();
  { await p.evaluate(() => { V.mk(6); S.run.gear = { acc2: { name: '银戒', q: '稀', desc: '母亲的' } }; S.run.bag = [{ name: '银戒', n: 1, q: '凡', desc: '' }]; UI.panels(); Game.gearOff('acc2'); });
    await openDB2();
    const fan = p.locator('#db-body .db-row[data-bk="银戒"]').nth(1);
    await fan.locator('[data-bslot]').selectOption('robe'); await fan.locator('[data-bwear]').click(); await p.waitForTimeout(80);
    const after = await p.locator('#db-body .db-row[data-bk="银戒"]').evaluateAll(es => es.map(e => e.querySelector('[data-df="bq"]').value + ':' + e.querySelector('[data-bslot]').value));
    await p.locator('#db-body .db-row[data-bk="银戒"]').first().locator('[data-bwear]').click(); await p.waitForTimeout(80);
    const g = await p.evaluate(() => Object.fromEntries(Object.entries(S.run.gear).map(([k, v]) => [k, v.name + '(' + v.q + ')'])));
    rec(T('P249b-4 DB pick on one 银戒 row does not leak onto the other'), after.join() === '稀:auto' && g.robe === '银戒(凡)' && g.acc2 === '银戒(稀)', { after, g }); }
  { await p.evaluate(() => { V.mk(6); S.run.gear = {}; S.run.bag = [{ name: '星辰之眼', n: 2, q: '良', desc: '' }]; Game.renderDB(); });
    const row = p.locator('#db-body .db-row[data-bk="星辰之眼"]'); await row.locator('[data-bslot]').selectOption('boots'); await row.locator('[data-bwear]').click(); await p.waitForTimeout(80);
    const sel = await p.locator('#db-body .db-row[data-bk="星辰之眼"] [data-bslot]').inputValue();
    await p.evaluate(() => Game.renderDB()); const sel2 = await p.locator('#db-body .db-row[data-bk="星辰之眼"] [data-bslot]').inputValue();
    const boots = await p.evaluate(() => (S.run.gear.boots || {}).name);
    rec(T('P249b-4 DB pick is cleared once that row is equipped'), sel === 'auto' && sel2 === 'auto' && boots === '星辰之眼', { sel, sel2, boots }); }
  { await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '星辰之眼', n: 1, q: '凡', desc: '' }, { name: '星辰之眼', n: 1, q: '稀', desc: '亮' }]; Game.renderDB(); });
    const rows = p.locator('#db-body .db-row[data-bk="星辰之眼"]'); await rows.nth(1).locator('[data-bslot]').selectOption('acc2');
    await p.evaluate(() => { S.run.bag.unshift({ name: '面包', n: 1, q: '凡', desc: '' }); Game.renderDB(); });   // an AI turn added a row in front: indexes shift
    const sels = await rows.evaluateAll(es => es.map(e => e.querySelector('[data-df="bq"]').value + ':' + e.querySelector('[data-bslot]').value));
    rec(T('P249b-4 DB pick follows its own row through a re-render with shifted indexes'), sels.join() === '凡:auto,稀:acc2', sels); }
  await closeOv(p);

  // 5. the AI re-reporting what the engine / the player already put in the bag does not duplicate it
  { const r = await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; V.ap('装备：+新尖帽（帽·良）\n背包：+旧尖帽'); return { g: V.gear(), bag: V.bag() }; });
    rec(T('P249b-5 AI swap + 背包：+old → one old hat'), r.g.hat === '新尖帽' && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.gear.wand = { name: '二手扫帚', q: '凡', desc: '' }; Game.gearOff('wand'); V.ap('装备：+二手扫帚（杖帚·凡）\n背包：+二手扫帚'); return { g: V.gear(), bag: V.bag() }; });
    rec(T('P249b-5 UI 卸下, AI re-equips + 背包：+X → one copy'), r.g.wand === '二手扫帚' && !r.bag.length, r); }
  { await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; UI.panels(); });
    const root = await rootOf(p, phone); await sideOff(p, root, 'hat');
    const r1 = await sendRaw('她把旧尖帽收进了背包。', '背包：+旧尖帽');
    const r2 = await sendRaw('集市上她又买了一顶旧尖帽。', '背包：+旧尖帽');
    rec(T('P249b-5 UI 卸下 then next AI turn 背包：+X → one copy; a later genuine +X still adds'), r1.bag.join() === '旧尖帽×1@hat' && r2.bag.join() === '旧尖帽×2@hat', { r1, r2 }); }

  // 6. double click / double tap on 装上 or 卸下 acts once
  await openDB2();
  { await p.evaluate(() => { V.mk(6); S.run.gear = {}; S.run.bag = [{ name: '旧尖帽', n: 1, q: '凡', desc: '' }, { name: '学员袍', n: 1, q: '凡', desc: '' }, { name: '面包', n: 1, q: '凡', desc: '' }]; Game.renderDB(); });
    await p.locator('#db-body .db-row[data-bk="旧尖帽"] [data-bwear]').dblclick(); await p.waitForTimeout(150);
    const a = await p.evaluate(() => ({ g: V.gear(), bag: V.bag() }));
    rec(T('P249b-6 DB double-click 装上 equips only that row'), JSON.stringify(a.g) === '{"hat":"旧尖帽"}' && a.bag.join() === '学员袍×1,面包×1', a); }
  { await p.evaluate(() => { S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' }, wand: { name: '二手扫帚', q: '凡', desc: '' } }; S.run.bag = []; Game.renderDB(); });
    await p.locator('#db-body [data-gsoff="hat"]').dblclick(); await p.waitForTimeout(150);
    const a = await p.evaluate(() => ({ g: V.gear(), bag: V.bag() }));
    rec(T('P249b-6 DB double-click 卸下 takes off only that slot'), a.g.wand === '二手扫帚' && !a.g.hat && a.bag.join() === '旧尖帽×1@hat', a); }
  if (phone) {
    await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '旧尖帽', n: 1, q: '凡', desc: '' }, { name: '学员袍', n: 1, q: '凡', desc: '' }, { name: '面包', n: 1, q: '凡', desc: '' }]; Game.renderDB(); });
    const btn = p.locator('#db-body .db-row[data-bk="旧尖帽"] [data-bwear]'); await btn.scrollIntoViewIfNeeded(); const bx = await btn.boundingBox();
    await p.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(70); await p.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(150);
    const a = await p.evaluate(() => V.gear());
    rec(T('P249b-6 phone touch double tap on DB 装上 equips only that row'), JSON.stringify(a) === '{"hat":"旧尖帽"}', a);
  }
  { await p.evaluate(() => { S.run.gear = {}; S.run.bag = [{ name: '旧尖帽', n: 1, q: '凡', desc: '' }, { name: '学员袍', n: 1, q: '凡', desc: '' }]; Game.renderDB(); });
    await p.locator('#db-body .db-row[data-bk="旧尖帽"] [data-bwear]').click(); await p.waitForTimeout(60);
    await p.locator('#db-body .db-row[data-bk="学员袍"] [data-bwear]').click(); await p.waitForTimeout(60);
    const a = await p.evaluate(() => V.gear()); rec(T('P249b-6 two separate 装上 clicks both act (no over-blocking)'), a.hat === '旧尖帽' && a.robe === '学员袍', a); }
  await closeOv(p);
  { await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '旧尖帽', n: 1, q: '凡', desc: '' }, { name: '学员袍', n: 1, q: '凡', desc: '' }]; UI.panels(); });
    const root = await rootOf(p, phone); const row = p.locator(root + ' .bag-item[data-bagi="0"]'); await row.click(); await p.waitForTimeout(50);
    await p.locator(root + ' .pdesc button[data-equipbag="0"]').first().dblclick(); await p.waitForTimeout(150);
    const a = await p.evaluate(() => ({ g: V.gear(), bag: V.bag() }));
    rec(T('P249b-6 ' + (phone ? 'overlay' : 'sidebar') + ' double-click 装上 equips only one'), JSON.stringify(a.g) === '{"hat":"旧尖帽"}' && a.bag.join() === '学员袍×1', a); }
  await closeOv(p);

  // 7. trade goods (ps) are never offered 装上 and never worn, whatever their name looks like
  { await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '珠贝界土产', n: 30, q: '良', desc: '位面进货渠道的货', ps: 'alt:x' }, { name: '星光尖帽', n: 1, q: '良', desc: '' }]; UI.panels(); });
    const root = await rootOf(p, phone);
    await p.locator(root + ' .bag-item[data-bagi="0"]').click(); await p.waitForTimeout(50);
    const btns = await p.locator(root + ' .pdesc button[data-equipbag]').count(); const hint = await p.locator(root + ' .pdesc').first().textContent();
    const api = await p.evaluate(() => { const ok = Game.bagWear(0, 'acc1', '珠贝界土产'); return { ok, t: V.toast(), g: V.gear(), n: (S.run.bag[0] || {}).n }; });
    let drag = null;
    if (!phone) { await closeOv(p); drag = await p.evaluate(() => { V.drag(V.q('.bag-item[data-bagn="珠贝界土产"]'), V.q('.doll-wrap')); const a = { g: V.gear(), t: V.toast() }; V.drag(V.q('.bag-item[data-bagn="珠贝界土产"]'), V.q('.dslot[data-slotk="acc2"]')); a.g2 = V.gear(); return a; }); }
    await openDB2(); const dbw = await p.locator('#db-body .db-row[data-bk="珠贝界土产"] [data-bwear]').count(); const dbs = await p.locator('#db-body .db-row[data-bk="珠贝界土产"] [data-bslot]').count();
    const other = await p.locator('#db-body .db-row[data-bk="星光尖帽"] [data-bwear]').count();
    rec(T('P249b-7 trade goods: no 装上 in ' + (phone ? 'overlay' : 'sidebar') + '/DB' + (phone ? '' : '/drag') + ', API refuses with a toast'), btns === 0 && /位面货/.test(hint) && !api.ok && /位面/.test(api.t) && !Object.keys(api.g).length && api.n === 30 && dbw === 0 && dbs === 0 && other === 1 && (!drag || (!Object.keys(drag.g).length && !Object.keys(drag.g2).length && /位面/.test(drag.t))), { btns, hint, api, drag, dbw, dbs, other });
    await closeOv(p); }

  // 8. losing an item worn in both 饰 slots removes only one
  { const r = await p.evaluate(() => { const two = () => { V.mk(6); S.run.gear.acc1 = { name: '银戒', q: '良', desc: '' }; S.run.gear.acc2 = { name: '银戒', q: '良', desc: '' }; };
      two(); V.ap('装备：-银戒（丢）'); const a = Object.values(V.gear()).filter(v => v === '银戒').length;
      two(); PromptM.applyStat(S.run, { gear: [{ op: '-', name: '银戒' }] }); const b = Object.values(V.gear()).filter(v => v === '银戒').length;
      return { a, b, bag: V.bag() }; });
    rec(T('P249b-8 -银戒（丢） / LOSE with 银戒 in both 饰 slots loses one'), r.a === 1 && r.b === 1 && !r.bag.length, r); }

  // 9. junk entries in run.bag / run.gear (old or hand-edited saves) do not crash, get cleaned
  { const r = await p.evaluate(() => { V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' }, robe: null, boots: '旧皮靴' }; S.run.bag = [null, undefined, '面包', 0, { name: '学员袍', n: 1, q: '凡', desc: '' }, {}, { name: '' }, false];
      const out = {}; try { UI.panels(); Game.setDbTab('bag'); Game.renderDB(); } catch (e) { out.err = e.message; }
      out.bag = V.bag(); out.g = V.gear(); out.robeKey = 'robe' in S.run.gear;
      const n = normalizeRun(Object.assign(JSON.parse(JSON.stringify(S.run)), { bag: [null, '冷茶', { name: '月石', n: 1, q: '凡', desc: '' }] })); out.norm = n.bag.map(x => x.name).join();
      return out; });
    rec(T('P249b-9 null / string / empty bag & gear entries: no crash, cleaned (render + load)'), !r.err && r.bag.join() === '面包×1,学员袍×1' && r.g.hat === '旧尖帽' && r.g.boots === '旧皮靴' && !r.robeKey && r.norm === '冷茶,月石', r); }

  // caps: 14-char names / 60-char descs never lose the 【部位】 tag or the slot
  { const r = await p.evaluate(() => { V.mk(6); const long = '一段很长很长的说明'.repeat(7) + '【部位】饰';
      V.ap('背包：+星砂（凡·' + long + '）'); const a = S.run.bag.find(x => x.name === '星砂'); const o = { len: a.desc.length, tag: /【部位】饰/.test(a.desc), k: slotKOf(S.run, a) };
      V.ap('背包：+星砂（凡·又捡到一把）'); const b = S.run.bag.find(x => x.name === '星砂'); o.n = b.n; o.tag2 = /【部位】饰/.test(b.desc);
      V.ap('背包：+一件来自遥远北方雪原的厚实羊毛长靴'); const c = S.run.bag.find(x => /^一件来自/.test(x.name)); o.cut = c.name.length; o.k3 = slotKOf(S.run, c);
      S.run.gear.robe = { name: '学员袍', q: '凡', desc: '【部位】袍·旧' }; V.ap('装备：+学员袍（袍·凡·' + '洗得发白'.repeat(20) + '）'); o.gtag = /【部位】袍/.test(S.run.gear.robe.desc) && S.run.gear.robe.desc.length <= 60;
      return o; });
    rec(T('P249b caps: 60-char desc keeps 【部位】 (new, merged, restated), 14-char cut keeps the slot'), r.len <= 60 && r.tag && r.k === 'acc1' && r.n === 2 && r.tag2 && r.cut === 14 && r.k3 === 'boots' && r.gtag, r); }
  { const r = await p.evaluate(() => { V.mk(6); const nm = '一件名字长到十六个字的旧时代学员长袍'; S.run.bag = [{ name: nm, n: 2, q: '凡', desc: '很长的说明'.repeat(15) }]; Game.bagWear(0, 'auto', nm);
      const worn = S.run.gear.robe.name, dl = S.run.gear.robe.desc.length; Game.gearOff('robe'); const a = V.bag();
      Game.bagWear(0, 'auto', nm); V.ap('装备：-' + nm); return { worn, dl, a, b: V.bag(), g: V.gear() }; });
    rec(T('P249b caps: over-long legacy name/desc wear whole, merge back, AI can take it off by its 14-char name'), r.worn.length === 18 && r.dl === 75 && r.a.join() === '一件名字长到十六个字的旧时代学员长袍×2@robe' && r.b.join() === r.a.join() && !r.g.robe, r); }

  // ================= P249c: third round (status-line gear/bag edge cases 1-11) =================
  await closeOv(p);
  const ap3 = (setup, lines) => p.evaluate(([setup, lines]) => { V.mk(6); (new Function(setup))(); UI.panels(); V.ap(lines); return { g: V.gear(), bag: V.bag(), cnt: (() => { const c = {}; for (const k of Object.keys(S.run.gear)) { const g = S.run.gear[k]; if (g) c[g.name] = (c[g.name] || 0) + 1; } for (const x of S.run.bag) c[x.name] = (c[x.name] || 0) + (x.n || 1); return c; })(), w: S.run.wealth, t: V.toast() }; }, [setup, lines]);
  // 1. stow phrasings (and feared / negated loss words, container words after 丢/扔) → bag, never deleted
  { const r = await p.evaluate(() => {
      const stow = ['解下', '解下来', '褪下', '除下', '取了下来', '收了起来', '存了起来', '叠好放着', '放到一边', '放在一边', '拿在手里', '丢进行李箱', '扔进储物柜', '随手丢在背包里', '随手丢在包里',
        '怕被偷，收进包里', '以免弄丢，摘下收好', '免得被抢，先收起来', '不是丢了，是收起来了', '差点被偷，赶紧收进包里', '没丢，收进包里', '舍不得卖，收进包里', '掉进海里又捞上来了'];
      const one = why => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; V.ap('装备：-旧尖帽（' + why + '）'); return S.run.gear.hat ? 'worn' : S.run.bag.some(x => x.name === '旧尖帽' && x.slot === 'hat') ? 'bag' : 'gone'; };
      return stow.map(w => [w, one(w)]).filter(x => x[1] !== 'bag'); });
    rec(T('P249c-1 -X（stow / feared-loss / container phrasing）: 23 phrasings → bag, not deleted'), !r.length, r); }
  { const r = await turn('她把旧尖帽解下来，收进行李箱。%S%装备：-旧尖帽（解下来，丢进行李箱）'); rec(T('P249c-1 real turn -X（解下来，丢进行李箱） → bag'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat', r); }
  // 2. loss described with a stow verb → gone; damaged → bag + 【瑕疵】破损
  { const r = await p.evaluate(() => {
      // P249d expectation change (rule A): 11 phrasings with no closed-list loss phrase moved lost → bag; '脱下后被烧穿' → partial damage (bag + flaw)
      // P249e expectation change (fixed protocol): 9 moved lost → bag (no leading loss marker; '摘下时摔碎' also gets the flaw;
      //   '卖给了收藏家' starts with 卖给 but 收藏家 contains the keep word 藏):
      //   摘下来卖给二手店 | 脱下来抵给房东 | 摘下来押在当铺 | 摘下时摔碎 | 不小心弄丢了 | 没想到被偷了 | 捐了 | 被教官没收了 | 卖给了收藏家
      const lost = ['烧毁', '送给了艾琳', '卖给了旧货商'];
      const bagged = ['脱下交给艾琳保管', '摘下递给店员', '摘下来扔给艾琳', '摘下来换了一碗面', '换成了五百块', '摘下来戴到艾琳头上', '脱下来披在艾琳身上', '被老师收起来了', '被宿管收进柜子', '被学院收回', '给艾琳戴上',
        '摘下来卖给二手店', '脱下来抵给房东', '摘下来押在当铺', '摘下时摔碎', '不小心弄丢了', '没想到被偷了', '捐了', '被教官没收了', '卖给了收藏家'];
      const one = why => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; V.ap('装备：-旧尖帽（' + why + '）'); return S.run.gear.hat ? 'worn' : S.run.bag.some(x => x.name === '旧尖帽') ? 'bag' : 'gone'; };
      // P249d expectation change (rule B): 【瑕疵】破损 is appended at the end of the desc, not prepended
      const dmg = w => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; V.ap('装备：-旧尖帽（' + w + '）'); const b = S.run.bag.find(x => x.name === '旧尖帽'); return b && b.slot === 'hat' && /^帽檐塌【瑕疵】破损$/.test(b.desc) ? 'ok' : JSON.stringify(b || null); };
      return { lost: lost.map(w => [w, one(w)]).filter(x => x[1] !== 'gone'), bagged: bagged.map(w => [w, one(w)]).filter(x => x[1] !== 'bag'), dmg: ['脱下来发现坏了', '弄坏了', '摔坏了', '脱下后被烧穿'].map(w => [w, dmg(w)]).filter(x => x[1] !== 'ok') }; });
    rec(T('P249c-2 (P249d rules A/B) listed loss phrase with a stow verb → gone; stow-verb hand-overs without a listed phrase → bag; 坏了 → bag + …【瑕疵】破损 at the end'), !r.lost.length && !r.bagged.length && !r.dmg.length, r); }
  { const r = await turn('旧尖帽摔坏了，她摘下来收好。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽","why":"摔坏了"}]');
    const d = await p.evaluate(() => (S.run.bag.find(x => x.name === '旧尖帽') || {}).desc);
    rec(T('P249c-2 real turn UNEQUIP_ITEM why 坏了 → bag with 【瑕疵】破损 appended (P249d rule B), slot kept'), !r.g.hat && r.bag.join() === '旧尖帽×1@hat' && /^帽檐有些塌【瑕疵】破损$/.test(d || ''), { r, d }); }
  // 3. repeated LOSE / UNEQUIP for an item worn in both 饰 slots; the same event in block + status line counts once
  const ACC3 = 'S.run.gear.acc1 = { name: "银戒", q: "凡", desc: "" }; S.run.gear.acc2 = { name: "银戒", q: "凡", desc: "" };';
  { const r = await turn('两枚银戒都被偷了。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"银戒"},{"cmd":"LOSE_EQUIPMENT","name":"银戒"}]', ACC3);
    rec(T('P249c-3 two LOSE_EQUIPMENT 银戒 (both 饰 worn) → both gone'), !r.g.acc1 && !r.g.acc2 && !r.bag.some(x => /银戒/.test(x)), r); }
  { const r = await turn('她摘下两枚银戒。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"银戒"},{"cmd":"UNEQUIP_ITEM","name":"银戒"}]', ACC3);
    rec(T('P249c-3 two UNEQUIP_ITEM 银戒 → both into the bag'), !r.g.acc1 && !r.g.acc2 && r.bag.join() === '银戒×2@acc1', r); }
  { const r = await turn('一枚银戒被偷了。%S%装备：-银戒（被偷）%C%[{"cmd":"LOSE_EQUIPMENT","name":"银戒"}]', ACC3);
    rec(T('P249c-3 one loss reported in both status line and block → only one 银戒 gone'), Object.values(r.g).filter(v => v === '银戒').length === 1 && !r.bag.length, r); }
  { const r = await turn('她摘下旧尖帽。%S%装备：-旧尖帽%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽"},{"cmd":"UNEQUIP_ITEM","name":"旧尖帽"}]');
    rec(T('P249c-3 repeated UNEQUIP for an item worn once → one take-off, nothing else touched'), !r.g.hat && r.g.wand === '二手扫帚' && r.bag.join() === '旧尖帽×1@hat', r); }
  // 4. same-turn double accounting
  { const r = await ap3('S.run.gear.hat = { name: "旧尖帽", q: "凡", desc: "" }; S.run.bag = [{ name: "旧尖帽", n: 1, q: "凡", desc: "备用的" }];', '装备：-旧尖帽（卖了）\n背包：-旧尖帽');
    rec(T('P249c-4a 装备：-X（卖了） + 背包：-X → only the worn one goes, spare kept'), !r.g.hat && r.bag.join() === '旧尖帽×1', r); }
  { const r = await turn('旧尖帽被偷了。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"旧尖帽"},{"cmd":"REMOVE_ITEM","name":"旧尖帽","n":1}]', 'S.run.bag = [{ name: "旧尖帽", n: 1, q: "凡", desc: "备用的" }];');
    rec(T('P249c-4a real turn LOSE_EQUIPMENT + REMOVE_ITEM → spare kept'), !r.g.hat && r.bag.join() === '旧尖帽×1', r); }
  { const r = await ap3('S.run.bag = [];', '背包：+星纹尖帽（良·店主送的）\n装备：+星纹尖帽（帽·良）');
    rec(T('P249c-4b 背包：+X & 装备：+X (new, worn at once) → one copy'), r.g.hat === '星纹尖帽' && r.cnt['星纹尖帽'] === 1, r); }
  { const r = await turn('店主送了她一顶星纹尖帽，她当场戴上。%S%%C%[{"cmd":"ADD_ITEM","name":"星纹尖帽","quality":"良"},{"cmd":"EQUIP_ITEM","name":"星纹尖帽","slot":"帽","quality":"良"}]');
    const c = await p.evaluate(() => S.run.bag.filter(x => x.name === '星纹尖帽').length);
    rec(T('P249c-4b real turn ADD_ITEM + EQUIP_ITEM → one copy (worn), old hat in bag'), r.g.hat === '星纹尖帽' && c === 0 && r.bag.join() === '旧尖帽×1@hat', r); }
  { const r = await ap3('S.run.bag = [];', '背包：+星纹尖帽×2（良·一对）\n装备：+星纹尖帽（帽·良）');
    rec(T('P249c-4b got two, wore one → one worn + one in the bag'), r.g.hat === '星纹尖帽' && r.cnt['星纹尖帽'] === 2, r); }
  { const r = await ap3('S.run.wealth = 1e7; S.run.gear.hat = { name: "旧尖帽", q: "凡", desc: "" };', '购置：装备｜星纹尖帽｜帽｜稀\n装备：+星纹尖帽（帽·稀）');
    rec(T('P249c-4c 购置 装备 + 装备：+same → one 星纹尖帽 (稀, worn), one 旧尖帽, charged once'), r.g.hat === '星纹尖帽' && r.cnt['星纹尖帽'] === 1 && r.cnt['旧尖帽'] === 1 && r.w === 1e7 - 8000, r); }
  { const r = await ap3('S.run.wealth = 1e7; S.run.gear.hat = { name: "旧尖帽", q: "凡", desc: "" };', '购置：装备｜星纹尖帽｜帽｜稀\n背包：+星纹尖帽（稀）｜+旧尖帽');
    rec(T('P249c-4c 购置 装备 + 背包：+bought｜+displaced → one each'), r.cnt['星纹尖帽'] === 1 && r.cnt['旧尖帽'] === 1 && r.g.hat === '星纹尖帽', r); }
  { const r = await ap3('S.run.wealth = 10; S.run.gear.hat = { name: "旧尖帽", q: "凡", desc: "" };', '购置：装备｜星纹尖帽｜帽｜稀\n装备：+星纹尖帽（帽·稀）\n背包：+星纹尖帽');
    rec(T('P249c-4c 购置 refused (no money) + 装备/背包 +same → no free copy, old hat still worn'), r.g.hat === '旧尖帽' && !r.cnt['星纹尖帽'] && r.w === 10, r); }
  // 5. trade goods (ps) on name lookups
  const PS3 = 'S.run.bag = [{ name: "猫耳帽", n: 5, q: "良", desc: "位面进货渠道的货：猫国", ps: "alt:cat" }, { name: "银戒", n: 1, q: "凡", desc: "" }];';
  { const r = await ap3(PS3, '装备：+猫耳帽（帽·良）');
    const ps = await p.evaluate(() => S.run.bag.filter(x => x.name === '猫耳帽').map(x => x.n + ':' + (x.ps || '')));
    rec(T('P249c-5 AI 装备：+X with only a ps X → worn as new, trade goods untouched'), r.g.hat === '猫耳帽' && ps.join() === '5:alt:cat', { r, ps }); }
  { const r = await ap3(PS3, '背包：+猫耳帽（良·艾琳送的）');
    const rows = await p.evaluate(() => S.run.bag.filter(x => x.name === '猫耳帽').map(x => x.n + ':' + (x.ps || '-') + ':' + x.desc));
    rec(T('P249c-5 AI 背包：+X next to a ps X → separate wearable row, ps row untouched'), rows.join('|') === '5:alt:cat:位面进货渠道的货：猫国|1:-:艾琳送的', rows); }
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '面包', n: 1, q: '凡', desc: '' }, { name: '猫耳帽', n: 1, q: '良', desc: '', slot: 'hat' }]; UI.panels(); S.run.bag.splice(1, 1); const ok = Game.bagWear(2, 'auto', '猫耳帽'); const g1 = V.gear(); const ok2 = (() => { S.run.gear = {}; S.run.bag = [{ name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '猫耳帽', n: 1, q: '良', desc: '', slot: 'hat' }]; return Game.bagWear(0, 'auto', '猫耳帽'); })(); return { ok, g1, ok2, t2: V.toast(), g: V.gear(), ps: S.run.bag.find(x => x.ps).n, own: S.run.bag.filter(x => !x.ps).length }; });
    // P249d expectation change (rule G): bagWear on the ps row itself is refused with the trade-goods toast — no silent redirect to the same-name own row
    rec(T('P249c-5 bagWear stale index → own row worn; index on the same-name ps row → refused (P249d rule G), goods & own row untouched'), r.ok && r.g1.hat === '猫耳帽' && !r.ok2 && /位面/.test(r.t2) && !Object.keys(r.g).length && r.ps === 5 && r.own === 1, r); }
  { await openDB2();
    await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '面包', n: 1, q: '凡', desc: '' }, { name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '猫耳帽', n: 1, q: '良', desc: '自己的', slot: 'hat' }]; Game.renderDB(); S.run.bag.splice(0, 1); });
    const own = p.locator('#db-body .db-row[data-bk="猫耳帽"]').nth(1);
    await own.locator('[data-df="bdesc"]').fill('改过的'); await own.locator('[data-df="bdesc"]').dispatchEvent('change'); await p.waitForTimeout(60);
    const mid = await p.evaluate(() => S.run.bag.map(x => x.name + ':' + (x.ps || '-') + ':' + x.desc));
    await p.evaluate(() => { S.run.bag.unshift({ name: '冷茶', n: 1, q: '凡', desc: '' }, { name: '热茶', n: 1, q: '凡', desc: '' }); });   // stale again: the row's old index now points at the ps row
    await p.locator('#db-body .db-row[data-bk="猫耳帽"]').nth(1).locator('[data-ddel]').click(); await p.waitForTimeout(80);
    const end = await p.evaluate(() => S.run.bag.map(x => x.name + ':' + (x.ps || '-') + ':' + x.n));
    rec(T('P249c-5 DB stale edit / delete with a same-name ps row: hits the own row, goods untouched'), mid.join('|') === '猫耳帽:alt:cat:位面|猫耳帽:-:改过的' && end.join('|') === '冷茶:-:1|热茶:-:1|猫耳帽:alt:cat:5', { mid, end });
    await closeOv(p); }
  // 6. eviction order: precious / opener letters / stacks last, lowest quality & oldest first
  { const r = await p.evaluate(() => { const slotRows = n => { const a = []; for (let i = 0; i < n; i++) a.push({ name: '旧帽' + i, n: 1, q: '凡', desc: '', slot: 'hat' }); return a; };
      const o = {};
      V.mk(6); S.run.bag = [{ name: '传家怀表', n: 1, q: '传奇', desc: '外婆留下的' }].concat(slotRows(39)); V.ap('背包：+面包'); o.heir = S.run.bag.some(x => x.name === '传家怀表'); o.l1 = S.run.bag.length;
      V.mk(6); S.run.bag = [{ name: '试训邀请函', n: 1, q: '良', desc: '看了七遍' }].concat(slotRows(39)); V.ap('背包：+面包'); o.letter = S.run.bag.some(x => x.name === '试训邀请函');
      V.mk(6); S.run.bag = [{ name: '魔力电池', n: 12, q: '凡', desc: '' }].concat(slotRows(39)); V.ap('背包：+面包'); o.stack = S.run.bag.some(x => x.name === '魔力电池');
      V.mk(6); S.run.bag = [{ name: '良品杂物', n: 1, q: '良', desc: '' }, { name: '凡品杂物', n: 1, q: '凡', desc: '' }].concat(slotRows(38)); V.ap('背包：+面包'); o.low = !S.run.bag.some(x => x.name === '凡品杂物') && S.run.bag.some(x => x.name === '良品杂物');
      V.mk(6); const a = []; for (let i = 0; i < 40; i++) a.push({ name: '宝' + i, n: 1, q: '稀', desc: '' }); S.run.bag = a; V.ap('背包：+面包'); o.allDear = S.run.bag.length === 40 && S.run.bag.some(x => x.name === '面包') && !S.run.bag.some(x => x.name === '宝0');
      return o; });
    // P249d expectation change (rule D): taken-off rows with a remembered slot are evicted last of all, so the 传奇 heirloom / 邀请函 / ×12 stack go before the 39 old hats
    rec(T('P249c-6 (P249d rule D) eviction: 传奇 heirloom / 邀请函 / ×12 stack go before taken-off rows with a slot; 凡 junk before 良; all-稀 bag still trims oldest'), !r.heir && r.l1 === 40 && !r.letter && !r.stack && r.low && r.allDear, r); }
  // 7. one fight's loot shares a keep set
  { const r = await p.evaluate(() => { V.mk(6); const a = []; for (let i = 0; i < 40; i++) a.push({ name: '旧帽' + i, n: 1, q: '凡', desc: '', slot: 'hat' }); S.run.bag = a; const mr = Math.random; Math.random = () => 0.01; let got; try { got = dndLoot(S.run, [{ name: '狼甲', lv: 5 }, { name: '狼乙', lv: 5 }], { band: 3 }); } finally { Math.random = mr; } const dt = bagDropTxt(S.run); return { len: S.run.bag.length, got: got.map(x => x.name), kept: got.filter(x => S.run.bag.some(y => y.name === x.name)).length, dt }; });
    rec(T('P249c-7 dndLoot: two items from one fight into a full bag → both kept, bag 40, eviction said'), r.got.length === 2 && r.kept === 2 && r.len === 40 && /挤掉了「旧帽39」「旧帽38」/.test(r.dt), r); }
  // 8. one AI turn adding > 40 rows (gather takes at most 40 commands per turn, so status-line adds + 购置 or a direct applyStat get past 40)
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = V.junk(30); V.ap('背包：' + Array.from({ length: 45 }, (_, i) => '+新物' + i).join('｜'));
      return { len: S.run.bag.length, junk: S.run.bag.filter(x => /^杂物/.test(x.name)).length, has0: S.run.bag.some(x => x.name === '新物0'), has5: S.run.bag.some(x => x.name === '新物5'), has44: S.run.bag.some(x => x.name === '新物44'), t: V.toast() }; });
    rec(T('P249c-8 45 rows in one applyStat on 30 junk → 40: junk out, newest 40 kept, drops announced'), r.len === 40 && !r.junk && !r.has0 && r.has5 && r.has44 && /等 35 件/.test(r.t), r); }
  { await p.evaluate(() => { V.mk(6); S.run.wealth = 1e7; S.run.bag = []; UI.panels(); });
    const r = await sendRaw('她把集市搬空了，还买了晨星石和暮星石。', '背包：' + Array.from({ length: 40 }, (_, i) => '+新物' + i).join('｜') + '\n购置：装备｜晨星石｜｜良\n购置：装备｜暮星石｜｜良');
    const e = await p.evaluate(() => ({ len: S.run.bag.length, has0: S.run.bag.some(x => x.name === '新物0'), has2: S.run.bag.some(x => x.name === '新物2'), bought: S.run.bag.filter(x => /^[晨暮]星石$/.test(x.name)).length }));
    rec(T('P249c-8 real turn: 40 status-line adds + 2 purchases → 40, both purchases kept, 2 oldest adds out and announced'), e.len === 40 && e.bought === 2 && !e.has0 && e.has2 && /挤掉了「新物0」「新物1」/.test(r.t), { e, t: r.t }); }
  // 9. 购置 path: the 14-char cut keeps the slot
  { const r = await p.evaluate(() => { const o = {}; V.mk(6); S.run.wealth = 1e7; V.ap('购置：装备｜踏过七座浮空岛的旅人的白色短靴｜｜良'); o.a = { g: V.gear(), d: (S.run.gear.boots || {}).desc };
      Game.gearOff('boots'); o.k = slotKOf(S.run, S.run.bag[0]);
      V.mk(6); S.run.wealth = 1e7; S.run.gear.robe = { name: '学员袍', q: '凡', desc: '' }; V.ap('购置：装备｜缀满星辉碎钻的深蓝色魔女长外袍｜良｜' + '很'.repeat(70)); o.b = { g: V.gear(), d: S.run.gear.robe.desc, bag: V.bag() };
      return o; });
    rec(T('P249c-9 购置 15-char names: worn by the full name, 【部位】 kept in a ≤60 desc, take-off remembers the slot'), r.a.g.boots === '踏过七座浮空岛的旅人的白色短' && /^【部位】靴/.test(r.a.d) && r.k === 'boots' && r.b.g.robe === '缀满星辉碎钻的深蓝色魔女长外' && /^【部位】袍/.test(r.b.d) && r.b.d.length <= 60 && r.b.bag.join() === '学员袍×1@robe', r); }
  // 10. parsing: ASCII parentheses, ×n, unclosed parens
  { const r = await p.evaluate(() => { const o = {}; const t = (lines, setup) => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; if (setup) setup(); V.ap(lines); return { g: V.gear(), bag: V.bag() }; };
      o.asciiLost = t('装备：-旧尖帽(被偷了)'); o.asciiAdd = t('装备：+星纹尖帽(帽·稀·夜里发光)'); o.cnt = t('装备：-旧尖帽×1'); o.unclosed = t('装备：+星纹尖帽（帽·稀');
      o.bagAscii = t('背包：+面包(凡·刚买的)×2｜+火柴 x3'); o.dq = (S.run.bag.find(x => x.name === '面包') || {}).desc;
      o.bagMinus = t('背包：-面包×1', () => { S.run.bag = [{ name: '面包', n: 3, q: '凡', desc: '' }]; });
      return o; });
    rec(T('P249c-10 ASCII (…) / ×n / unclosed （ parse; no paren text in names'), !r.asciiLost.g.hat && !r.asciiLost.bag.length && r.asciiAdd.g.hat === '星纹尖帽' && r.cnt.bag.join() === '旧尖帽×1@hat' && r.unclosed.g.hat === '星纹尖帽' && r.bagAscii.bag.join() === '面包×2,火柴×3' && r.dq === '刚买的' && r.bagMinus.bag.join() === '面包×2', r); }
  // 11. bagSane normalisation + null rows mid-run
  { const r = await p.evaluate(async () => { V.mk(6); S.run.bag = [{ name: '计数串', n: '2', q: '凡', desc: '' }, { name: '负数', n: -1, q: '凡', desc: '' }, { name: '零个', n: 0 }, { name: { x: 1 }, n: 1 }, { name: 5, n: 1 }, { name: true }, { name: '怪说明', desc: 7, q: 99 }];
      S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' }, bogus: { name: '幽灵' }, acc: { name: '假饰' } }; bagSane(S.run);
      const o = { rows: S.run.bag.map(x => x.name + ':' + x.n + ':' + typeof x.n + ':' + x.q + ':' + (x.desc == null ? '' : x.desc)), keys: Object.keys(S.run.gear) };
      V.ap('背包：+计数串'); o.cs = S.run.bag.find(x => x.name === '计数串').n;
      S.run.bag.push(null); S.run.bag.push('火柴'); S.run.bag.push({ name: null });
      V.reply = '她翻了翻背包。' + V.status('背包：+面包'); U.$('#inp').value = '继续'; await Game.send();
      o.ok = S.run.bag.every(x => x && typeof x === 'object' && typeof x.name === 'string'); o.last = String((S.run.log[S.run.log.length - 1] || {}).text || '').slice(0, 8); o.bread = S.run.bag.some(x => x.name === '面包');
      return o; });
    rec(T('P249c-11 bagSane: n → positive int, junk names dropped, unknown gear keys dropped; null rows mid-run do not break the AI turn'), r.rows.join('|') === '计数串:2:number:凡:|负数:1:number:凡:|零个:1:number:凡:|5:1:number:凡:|怪说明:1:number:凡:7' && r.keys.join() === 'hat' && r.cs === 3 && r.ok && r.bread && /翻了翻/.test(r.last), r); }

  // ================= P249d: rules A–G =================
  await closeOv(p);
  // A. closed-list classifier through the status line: canonical words / tags lost; negation, fear, recovery, swaps → bag; partial damage → bag + flaw
  { const r = await p.evaluate(() => {
      const one = why => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; V.ap('装备：-旧尖帽' + (why ? '（' + why + '）' : '')); const b = S.run.bag.find(x => x.name === '旧尖帽'); return S.run.gear.hat ? 'worn' : !b ? 'gone' : b.slot !== 'hat' ? 'noslot' : /【瑕疵】破损/.test(b.desc) ? 'dmg' : 'bag'; };
      // P249e expectation change (fixed protocol): gone → bag (6): 不小心弄丢了 | 丢了，没能找回来 (找回) | 被偷了，没找回来 (找回) | 怕被偷，结果还是丢了 | 掉进海里 | 被史莱姆吞了;
      //   dmg → gone (1): 碎了一角 (starts with the marker 碎了)
      const T = { gone: ['丢了', '卖了', '送人', '被偷被抢', '毁了', '用完了', '丢了/卖了', '丢', '毁', '卖', '送', '没收', '赌输了', '碎了一角'],
        bag: ['', '怕被偷', '以免弄丢', '差点被抢', '没有丢', '没被偷', '不是卖了', '不会送人', '未能卖出', '小心别弄丢', '防止被没收', '险些掉进河里', '担心路上弄丢，收进包里', '以为丢了，原来在包里', '要是丢了就麻烦了',
          '被偷了，后来追回来了', '掉进湖里又捞回来了', '当掉后又赎回来了', '丢了又找回来了', '借给艾琳，她又还回来了', '换了一顶新帽子', '换成新尖帽', '换下来', '魔力耗尽了，收起来', '吃了一惊，摘下来', '店员给了个纸袋装好', '交给艾琳保管', '被老师收起来了',
          '不小心弄丢了', '丢了，没能找回来', '被偷了，没找回来', '怕被偷，结果还是丢了', '掉进海里', '被史莱姆吞了'],
        dmg: ['坏了', '摔坏了', '破了个洞', '烧焦了', '缺了一块', '掉了一颗扣子', '杖头折了', '裂开一道缝'] };
      const bad = []; for (const k of Object.keys(T)) for (const w of T[k]) { const g = one(w); if (g !== k) bad.push([w, k, g]); }
      return { bad, n: Object.values(T).reduce((a, x) => a + x.length, 0) }; });
    rec(T('P249d-A status line: ' + r.n + ' phrasings (canonical/tags lost; negation/fear/recovery/swap → bag; partial damage → bag+flaw)'), !r.bad.length, r); }
  { const r1 = await turn('旧尖帽被偷了。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽","why":"被偷了"}]');
    const r2 = await turn('她摘下旧尖帽收好。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"旧尖帽","why":"收进包里"}]');
    const r3 = await turn('旧尖帽摔坏了。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"旧尖帽","why":"摔坏了"}]'); const d3 = await p.evaluate(() => (S.run.bag.find(x => x.name === '旧尖帽') || {}).desc);
    const r4 = await turn('旧尖帽丢了。%S%%C%[{"cmd":"LOSE_EQUIPMENT","name":"旧尖帽"}]');
    const r5 = await turn('她怕被偷，摘下来收好。%S%%C%[{"cmd":"UNEQUIP_ITEM","name":"旧尖帽","why":"怕被偷，收进包里"}]');
    rec(T('P249d-A real turns: UNEQUIP why 被偷了 → gone; LOSE why 收进包里 → bag; LOSE why 摔坏了 → bag+flaw; LOSE no why → gone; UNEQUIP why 怕被偷 → bag'),
      !r1.g.hat && !r1.bag.length && r2.bag.join() === '旧尖帽×1@hat' && r3.bag.join() === '旧尖帽×1@hat' && /^帽檐有些塌【瑕疵】破损$/.test(d3 || '') && !r4.g.hat && !r4.bag.length && r5.bag.join() === '旧尖帽×1@hat', { r1, r2, r3, d3, r4, r5 }); }
  // B. flaw appended at the end; an existing 【瑕疵】 (loot flaw) is kept and read by dndItem; long desc keeps 【部位】 and stays ≤ 60
  { const r = await p.evaluate(() => {
      const o = {};
      V.mk(6); S.run.gear.wand = { name: '灰狼的锋锐短剑', q: '稀', desc: '【部位】杖帚【词条】锋锐【瑕疵】沉手·缴自灰狼·评分0.55' }; const f0 = dndItem('wand', S.run.gear.wand).flaws.map(x => x.nm).join();
      V.ap('装备：-灰狼的锋锐短剑（坏了）'); const b = S.run.bag.find(x => x.name === '灰狼的锋锐短剑'); o.loot = { d: b && b.desc, slot: b && b.slot, f0, f1: b ? dndItem('wand', b).flaws.map(x => x.nm).join() : null };
      V.mk(6); S.run.gear.robe = { name: '学员袍', q: '凡', desc: '【部位】袍' + '很'.repeat(56) }; V.ap('装备：-学员袍（裙摆撕破了）'); const c = S.run.bag.find(x => x.name === '学员袍'); o.long = { d: c && c.desc, len: c && c.desc.length };
      V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; V.ap('装备：-旧尖帽（坏了）'); o.empty = (S.run.bag.find(x => x.name === '旧尖帽') || {}).desc;
      V.mk(6); S.run.bag = [{ name: '旧尖帽', n: 2, q: '凡', desc: '帽檐塌', slot: 'hat' }]; V.ap('装备：-旧尖帽（坏了）'); o.split = S.run.bag.map(x => x.name + '×' + x.n + ':' + x.desc);
      return o; });
    rec(T('P249d-B flaw: appended at the end; loot 【瑕疵】沉手 kept (no second flaw, dndItem still reads 沉手); long desc ≤60 keeps 【部位】; stack split marks one'),
      r.loot.d === '【部位】杖帚【词条】锋锐【瑕疵】沉手·缴自灰狼·评分0.55' && r.loot.slot === 'wand' && r.loot.f0 === '沉手' && r.loot.f1 === '沉手' && /^【部位】袍很+【瑕疵】破损$/.test(r.long.d || '') && r.long.len === 60 && r.empty === '【瑕疵】破损' && r.split.join('|') === '旧尖帽×1:帽檐塌【瑕疵】破损|旧尖帽×1:帽檐塌', r); }
  // D. full eviction order, one add per action: 凡 single < 良 single < stack < 【部位】 < key 凡 < 稀 < (this turn's 传奇 adds) < taken-off rows with a slot
  { const r = await p.evaluate(() => {
      V.mk(6); const fill = []; for (let i = 0; i < 33; i++) fill.push({ name: '旧帽' + i, n: 1, q: '凡', desc: '', slot: 'hat' });
      S.run.bag = [{ name: '凡杂物', n: 1, q: '凡', desc: '' }, { name: '良杂物', n: 1, q: '良', desc: '' }, { name: '火柴', n: 3, q: '凡', desc: '' }, { name: '布条', n: 1, q: '凡', desc: '【部位】饰' }, { name: '稀石', n: 1, q: '稀', desc: '' }, { name: '试训邀请函', n: 1, q: '凡', desc: '' }, { name: '位面货', n: 9, q: '良', desc: '位面', ps: 'p1' }].concat(fill);
      const order = []; for (let i = 0; i < 8; i++) { V.ap('背包：+宝' + i + '（传奇·新得的）'); order.push(V.toast().replace(/^.*挤掉了/, '')); }
      return { order, len: S.run.bag.length, slots: S.run.bag.filter(x => x.slot).length, ps: S.run.bag.some(x => x.ps) }; });
    rec(T('P249d-D eviction order: 凡 < 良 < stack < 【部位】 < key < 稀 < newer 传奇 < slot rows (last); ps never'),
      r.order.join('|') === '「凡杂物」|「良杂物」|「火柴×3」|「布条」|「试训邀请函」|「稀石」|「宝0」|「宝1」' && r.len === 40 && r.slots === 33 && r.ps, r); }
  // D. hard trim: never a protected row, never negative, never more than the excess
  { const r = await p.evaluate(async () => {
      const o = {};
      V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' }, robe: { name: '学员袍', q: '良', desc: '' }, boots: { name: '皮靴', q: '凡', desc: '' } }; S.run.bag = [{ name: '旧尖帽', n: 3, q: '凡', desc: '' }]; S.run.wealth = 1e7; UI.panels();
      const adds = []; for (let i = 0; i < 39; i++) adds.push('+战利品' + i);
      V.reply = '她摘下旧尖帽，买了星纹法袍和踏雪短靴，又捡到一堆战利品。' + V.status('装备：-旧尖帽\n购置：装备｜星纹法袍｜袍｜良\n购置：装备｜踏雪短靴｜靴｜良\n背包：' + adds.join('｜')); U.$('#inp').value = '继续'; await Game.send();
      o.a = { n: S.run.bag.length, mine: S.run.bag.filter(x => !/^战利品/.test(x.name)).map(x => x.name + '×' + x.n).sort().join(), loot: S.run.bag.filter(x => /^战利品/.test(x.name)).length, t: V.toast() };
      V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' } }; S.run.bag = []; for (let i = 0; i < 3; i++) S.run.bag.push({ name: '位面货' + i, n: 5, q: '良', desc: '位面', ps: 'p' + i }); S.run.bag.push({ name: '旧尖帽', n: 2, q: '凡', desc: '' }); UI.panels();
      const adds2 = []; for (let i = 0; i < 38; i++) adds2.push('+战利品' + i);
      V.reply = '她摘下旧尖帽，又捡到一堆战利品。' + V.status('装备：-旧尖帽\n背包：' + adds2.join('｜')); U.$('#inp').value = '继续'; await Game.send();
      o.b = { n: S.run.bag.length, ps: S.run.bag.filter(x => x.ps).length, hat: S.run.bag.filter(x => x.name === '旧尖帽').map(x => x.n + '@' + x.slot).join(), loot: S.run.bag.filter(x => /^战利品/.test(x.name)).length };
      V.mk(6); S.run.gear = { hat: { name: '旧尖帽', q: '凡', desc: '' } }; S.run.bag = []; for (let i = 0; i < 38; i++) S.run.bag.push({ name: '位面货' + i, n: 5, q: '良', desc: '位面', ps: 'p' + i }); S.run.bag.push({ name: '旧尖帽', n: 2, q: '凡', desc: '' }); UI.panels();
      V.reply = '她摘下旧尖帽，又捡到三件。' + V.status('装备：-旧尖帽\n背包：+甲｜+乙｜+丙'); U.$('#inp').value = '继续'; await Game.send();
      o.c = { n: S.run.bag.length, ps: S.run.bag.filter(x => x.ps).length, hat: S.run.bag.filter(x => x.name === '旧尖帽').map(x => x.n + '@' + x.slot).join(), abc: ['甲', '乙', '丙'].every(n => S.run.bag.some(x => x.name === n)) };
      return o; });
    rec(T('P249d-D hard trim: taken-off/displaced/merged rows and purchases never dropped; only the arrivals beyond 40 go (announced); no negative-slice wipe; protected-only bag may exceed 40'),
      r.a.n === 40 && r.a.mine === '学员袍×1,旧尖帽×4,皮靴×1' && r.a.loot === 37 && /挤掉了「战利品0」「战利品1」$/.test(r.a.t) &&
      r.b.n === 42 && r.b.ps === 3 && r.b.hat === '3@hat' && r.b.loot === 38 && r.c.n === 42 && r.c.ps === 38 && r.c.hat === '3@hat' && r.c.abc, r); }
  // E. parsing: no Latin x multiplier on 装备 lines; half-width (…) kept in names unless it brackets a known item / slot-quality words
  { const r = await p.evaluate(() => { const o = {}; const t = (lines, setup) => { V.mk(6); if (setup) setup(); V.ap(lines); return { g: V.gear(), bag: V.bag() }; };
      o.x2 = t('装备：+护目镜x2（帽·良）'); o.X3 = t('装备：+星纹尖帽 X3（帽·良）'); o.star = t('装备：+星纹尖帽*2（帽·良）');
      o.two = t('装备：-银戒×2', () => { S.run.gear.acc1 = { name: '银戒', q: '凡', desc: '' }; S.run.gear.acc2 = { name: '银戒', q: '凡', desc: '' }; });
      o.mk2 = t('装备：+护目镜(Mk II)'); o.lit = t('装备：-护目镜(旧)', () => { S.run.gear.hat = { name: '护目镜(旧)', q: '凡', desc: '' }; });
      o.slotw = t('装备：-旧尖帽(帽)', () => { S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; });
      o.stolen = t('装备：-旧尖帽(被偷了)', () => { S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; });
      o.unknown = t('装备：-无名帽(被偷了)', () => { S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '' }; });
      o.box = t('背包：+火柴(一盒)'); o.bread = t('背包：+面包(凡·刚买的)×2｜+火柴 x3');
      return o; });
    rec(T('P249d-E parse: 装备 lines ignore Latin x/X/* multipliers; trailing ×N works; half-width (…) kept in names unless it brackets a worn/bag item or slot/quality words'),
      r.x2.g.hat === '护目镜x2' && r.X3.g.hat === '星纹尖帽 X3' && r.star.g.hat === '星纹尖帽*2' && !r.two.g.acc1 && !r.two.g.acc2 && r.two.bag.join() === '银戒×2@acc1' &&
      r.mk2.g.hat === '护目镜(Mk II)' && !r.lit.g.hat && r.lit.bag.join() === '护目镜(旧)×1@hat' && r.slotw.bag.join() === '旧尖帽×1@hat' && !r.stolen.g.hat && !r.stolen.bag.length &&
      r.unknown.g.hat === '旧尖帽' && r.box.bag.join() === '火柴(一盒)×1' && r.bread.bag.join() === '面包×2,火柴×3', r); }
  // F. bagSane keeps big counts
  { const r = await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '位面货', n: 1500, q: '良', desc: '位面', ps: 'p1' }, { name: '星砂', n: '2000', q: '凡', desc: '' }, { name: '碎片', n: 0 }]; bagSane(S.run); UI.panels(); return S.run.bag.map(x => x.name + ':' + x.n + ':' + typeof x.n); });
    rec(T('P249d-F bagSane: n ≥ 1 integer, no 999 cap (1500 stays, "2000" → 2000, 0 → 1)'), r.join('|') === '位面货:1500:number|星砂:2000:number|碎片:1:number', r); }
  // G. trade goods: dragging / wearing the ps row is refused (no redirect to the same-name own row); DB edit/delete never cross kinds
  { await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '猫耳帽', n: 1, q: '良', desc: '自己的' }]; UI.panels(); });
    let drag = null;
    if (!phone) drag = await p.evaluate(() => { V.drag(V.q('.bag-item[data-bagps="1"]'), V.q('.doll-wrap')); const a = { g: V.gear(), t: V.toast() }; V.drag(V.q('.bag-item[data-bagps="1"]'), V.q('.dslot[data-slotk="hat"]')); a.g2 = V.gear(); a.t2 = V.toast(); a.own = S.run.bag.filter(x => !x.ps).length; return a; });
    const api = await p.evaluate(() => { const a = Game.bagWear(0, 'auto', '猫耳帽', true); const t = V.toast(); S.run.bag.unshift({ name: '冷茶', n: 1, q: '凡', desc: '' }); const b = Game.bagWear(0, 'auto', '猫耳帽', true); const t2 = V.toast(); return { a, t, b, t2, g: V.gear(), own: S.run.bag.filter(x => !x.ps).map(x => x.name).join() }; });
    const own = await p.evaluate(() => { S.run.bag.shift(); const ok = Game.bagWear(5, 'auto', '猫耳帽', false); return { ok, g: V.gear(), ps: S.run.bag.find(x => x.ps).n }; });
    rec(T('P249d-G ' + (phone ? '' : 'drag ps row onto doll/slot and ') + 'bagWear(ps) → refusal toast, never the same-name own row; stale own-row index still wears the own row'),
      (!drag || (!Object.keys(drag.g).length && !Object.keys(drag.g2).length && /位面/.test(drag.t) && /位面/.test(drag.t2) && drag.own === 1)) && !api.a && /位面/.test(api.t) && !api.b && /位面/.test(api.t2) && !Object.keys(api.g).length &&
      own.ok && own.g.hat === '猫耳帽' && own.ps === 5, { drag, api, own }); }
  { await openDB2();
    await p.evaluate(() => { V.mk(6); S.run.bag = [{ name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '猫耳帽', n: 1, q: '良', desc: '自己的' }]; Game.renderDB(); S.run.bag.splice(1, 1); });   // the own row is gone, the list is stale
    const ownRow = p.locator('#db-body .db-row[data-bk="猫耳帽"]:not([data-bps])');
    await ownRow.locator('[data-df="bdesc"]').fill('改过的'); await ownRow.locator('[data-df="bdesc"]').dispatchEvent('change'); await p.waitForTimeout(60);
    const t1 = await p.evaluate(() => V.toast()); const mid = await p.evaluate(() => S.run.bag.map(x => x.name + ':' + (x.ps || '-') + ':' + x.desc + ':' + x.n));
    await p.evaluate(() => { S.run.bag = [{ name: '猫耳帽', n: 5, q: '良', desc: '位面', ps: 'alt:cat' }, { name: '猫耳帽', n: 1, q: '良', desc: '自己的' }]; Game.renderDB(); S.run.bag.splice(1, 1); });
    await p.locator('#db-body .db-row[data-bk="猫耳帽"]:not([data-bps])').locator('[data-ddel]').click(); await p.waitForTimeout(80);
    const end = await p.evaluate(() => S.run.bag.map(x => x.name + ':' + (x.ps || '-') + ':' + x.n));
    rec(T('P249d-G DB stale edit / delete of an own row whose only same-name survivor is a ps row: nothing crosses over, list refreshes'), mid.join() === '猫耳帽:alt:cat:位面:5' && /刚变过/.test(t1) && end.join() === '猫耳帽:alt:cat:5', { t1, mid, end });
    await closeOv(p); }

  // longname: a real AI turn cuts names to 14 chars before the engine sees them — the slot is read from the full name (same result as a direct apply)
  { const r = await p.evaluate(async () => {
      const one = async (lines) => { V.mk(6); S.run.gear = {}; S.run.bag = []; UI.panels(); V.reply = '她得到了星纹夜光限定款式华丽魔女尖顶帽子，还有银河纹路镶钻限量版华丽璀璨项链。' + V.status(lines); U.$('#inp').value = '继续'; await Game.send(); return { g: V.gear(), bag: S.run.bag.map(x => x.name + ':' + x.desc) }; };
      const o = { hat: await one('装备：+星纹夜光限定款式华丽魔女尖顶帽子（稀·夜里发光）'), neck: await one('装备：+银河纹路镶钻限量版华丽璀璨项链（良）'), bag: await one('背包：+星纹夜光限定款式华丽魔女尖顶帽子（稀·夜里发光）') };
      o.k = slotKOf(S.run, S.run.bag[0]); const i = 0; o.worn = Game.bagWear(i, 'auto', S.run.bag[0].name, false); o.g2 = V.gear(); return o; });
    rec(T('P249d long names on a real turn: 16-char …尖顶帽子 worn at 帽, …项链 at 饰; bag row keeps 【部位】帽 and wears to 帽'),
      r.hat.g.hat === '星纹夜光限定款式华丽魔女尖顶' && !r.hat.bag.length && r.neck.g.acc1 === '银河纹路镶钻限量版华丽璀璨项' && r.bag.bag.join() === '星纹夜光限定款式华丽魔女尖顶:【部位】帽夜里发光' && r.k === 'hat' && r.worn && r.g2.hat === '星纹夜光限定款式华丽魔女尖顶', r); }

  // ================= P249e: fixed loss protocol =================
  await closeOv(p);
  const send9 = async (reply) => { await closeOv(p); await p.evaluate(r => { V.reply = r; U.$('#inp').value = '继续'; }, reply); await p.evaluate(() => Game.send()); await p.waitForFunction(() => !S.busy, null, { timeout: 15000 }); await p.waitForTimeout(80); };
  const cmd9 = (c, nm, why) => '\n⟦命令⟧\n' + JSON.stringify([why == null ? { cmd: c, name: nm } : { cmd: c, name: nm, why }]) + '\n⟦/命令⟧';
  // 0. every loss marker the prompt lists, in the protocol form 「词：原因」 → gone; 「坏了：哪里坏了」 → bag + flaw; a marker followed by a recovery word → bag
  { const r = await p.evaluate(() => {
      const one = why => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; V.ap('装备：-旧尖帽（' + why + '）'); const b = S.run.bag.find(x => x.name === '旧尖帽'); return S.run.gear.hat ? 'worn' : !b ? 'gone' : b.slot !== 'hat' ? 'noslot' : /【瑕疵】破损$/.test(b.desc) ? 'dmg' : 'bag'; };
      const T = { gone: ['丢了：在路上', '卖了：卖给旧货商', '送人：送给艾琳', '被偷：在码头', '被抢：被劫匪', '毁了：被龙火烧了', '用完：护符的最后一次', '没收：被宿管', ' 「被偷」：集市上', '扔', '弃', '偷', '抢', '毁。'],
        bag: ['被偷了：后来追回来了', '丢了，又找到了', '卖了又赎回来', '没收进包里', '怕被偷，收进包里', '偷偷收进包里', '送去修理', '扔了', '被风吹走了', '被扒手偷走了'],
        dmg: ['坏了：帽檐裂了', '坏了', '扣子掉了', '被扒手偷了一颗扣子，扯破了'] };
      const bad = []; for (const k of Object.keys(T)) for (const w of T[k]) { const g = one(w); if (g !== k) bad.push([w, k, g]); }
      return { bad, n: Object.values(T).reduce((a, x) => a + x.length, 0) }; });
    rec(T('P249e protocol through the status line: ' + r.n + ' reasons (prompt markers + 「：原因」 gone; recovery/keep word or no leading marker → bag; damage → bag+flaw)'), !r.bad.length, r); }
  // 1. rule 2: the player takes the hat off in the sidebar / overlay first, then the AI reports it with a keep-side reason → the bag row stays (damage → flaw only)
  { const W = ['扣子掉了', '不肯卖掉，收回包里', '被小偷盯上了，赶紧收进内袋', '掉进水坑里，捞出来晾着', '收进包里'];
    const bad = [], seen = [];
    for (const mode of ['status', 'UNEQUIP_ITEM', 'LOSE_EQUIPMENT']) for (const w of W) {
      await closeOv(p);
      await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; S.run.bag = [{ name: '杂物', n: 1, q: '凡', desc: '' }]; UI.panels(); });
      const root = await rootOf(p, phone); const t0 = await sideOff(p, root, 'hat');
      const mid = await p.evaluate(() => V.bag().join());
      await send9('她想了想。' + await p.evaluate(([mode, w, c]) => mode === 'status' ? V.status('装备：-旧尖帽（' + w + '）') : V.status('') + c, [mode, w, cmd9(mode, '旧尖帽', w)]));
      const r = await p.evaluate(() => { const b = S.run.bag.find(x => x.name === '旧尖帽'); return { hat: !!S.run.gear.hat, row: b ? b.slot + ':' + b.desc + ':' + (b.n || 1) : null, junk: S.run.bag.some(x => x.name === '杂物'), n: S.run.bag.length }; });
      const want = 'hat:帽檐塌' + (w === '扣子掉了' ? '【瑕疵】破损' : '') + ':1';
      seen.push(mode + '/' + w + '→' + r.row);
      if (mid !== '旧尖帽×1@hat,杂物×1' || r.hat || r.row !== want || !r.junk || r.n !== 2) bad.push({ mode, w, t0, mid, r, want });
    }
    // a real loss marker after the UI take-off still removes the bag copy
    await closeOv(p);
    await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; S.run.bag = [{ name: '杂物', n: 1, q: '凡', desc: '' }]; UI.panels(); });
    { const root = await rootOf(p, phone); await sideOff(p, root, 'hat'); }
    await send9('旧尖帽被偷了。' + await p.evaluate(() => V.status('装备：-旧尖帽（被偷了）')));
    const lost = await p.evaluate(() => V.bag().join());
    rec(T('P249e rule 2: UI 卸下 then AI reason (status / UNEQUIP why / LOSE why) × 5 keep-side reasons → bag row kept (扣子掉了 → flaw only); 被偷了 → removed'), !bad.length && lost === '杂物×1', { bad, lost, seen: seen.slice(0, 3) }); }
  // 2. rule 3: classification reads the whole why; the stored why is cut to 80 afterwards
  { const fill = '在码头熙熙攘攘的人群里被一个穿着灰色斗篷的瘦高小贼盯上，挤过三条街又穿过两座桥，一直跑到旧仓库区门口';
    const wKeep = '被偷了：' + fill + fill + '，最后总算找回来了', wLost = '被偷了：' + fill + fill;
    const kAt = wKeep.indexOf('找回');
    const r = {};
    for (const [k, c, w] of [['un', 'UNEQUIP_ITEM', wKeep], ['lose', 'LOSE_EQUIPMENT', wKeep], ['lost', 'LOSE_EQUIPMENT', wLost], ['st', 'status', wKeep]]) {
      await closeOv(p);
      await p.evaluate(() => { V.mk(6); S.run.gear.hat = { name: '旧尖帽', q: '凡', desc: '帽檐塌' }; S.run.bag = []; UI.panels(); });
      await send9('旧尖帽的事。' + await p.evaluate(([c, w, cm]) => c === 'status' ? V.status('装备：-旧尖帽（' + w + '）') : V.status('') + cm, [c, w, cmd9(c, '旧尖帽', w)]));
      r[k] = await p.evaluate(() => { const e = (S.run.stateEvents || []).filter(x => x.cmd === 'UNEQUIP_ITEM' || x.cmd === 'LOSE_EQUIPMENT').slice(-1)[0]; return { hat: !!S.run.gear.hat, bag: V.bag().join(), wl: e ? String(e.why || '').length : -1 }; });
    }
    rec(T('P249e rule 3: recovery word at char ' + kAt + ' of a ' + wKeep.length + '-char why → bag (UNEQUIP / LOSE / status line); ' + wLost.length + '-char loss why → gone; stored why cut to 80'),
      kAt > 80 && r.un.bag === '旧尖帽×1@hat' && r.lose.bag === '旧尖帽×1@hat' && r.st.bag === '旧尖帽×1@hat' && !r.lost.hat && r.lost.bag === '' && r.un.wl === 80 && r.lose.wl === 80 && r.lost.wl === 80, { kAt, r }); }
  // 3. rule 4: one event reported in the status line and in the command block (any UNEQUIP / LOSE mix) applies once
  { const RINGS = () => { V.mk(6); S.run.gear.acc1 = { name: '银戒', q: '凡', desc: '' }; S.run.gear.acc2 = { name: '银戒', q: '凡', desc: '' }; S.run.bag = []; UI.panels(); };
    const r = {};
    for (const [k, line, c, w] of [['a', '-银戒（被偷了）', 'UNEQUIP_ITEM', '被偷了'], ['b', '-银戒（被偷了）', 'LOSE_EQUIPMENT', '被偷了'], ['c', '-银戒（被偷了）', 'LOSE_EQUIPMENT', null],
                                  ['d', '-银戒', 'UNEQUIP_ITEM', null], ['e', '-银戒（坏了）', 'UNEQUIP_ITEM', null], ['f', '-银戒', 'LOSE_EQUIPMENT', '收进包里']]) {
      await closeOv(p); await p.evaluate(RINGS);
      await send9('一枚银戒的事。' + await p.evaluate(([l, cm]) => V.status('装备：' + l) + cm, [line, cmd9(c, '银戒', w)]));
      r[k] = await p.evaluate(() => ({ worn: Object.values(S.run.gear).filter(g => g && g.name === '银戒').length, bag: S.run.bag.map(x => x.name + '×' + (x.n || 1) + ':' + x.desc).join() }));
    }
    rec(T('P249e rule 4: two 银戒 worn; status -银戒（被偷了） + UNEQUIP why 被偷了 / LOSE why 被偷了 / LOSE → exactly one lost; -银戒 + UNEQUIP → one in the bag; -银戒（坏了） + UNEQUIP → one in the bag with the flaw; -银戒 + LOSE why 收进包里 → one in the bag'),
      ['a', 'b', 'c'].every(k => r[k].worn === 1 && r[k].bag === '') && r.d.worn === 1 && r.d.bag === '银戒×1:' && r.e.worn === 1 && r.e.bag === '银戒×1:【瑕疵】破损' && r.f.worn === 1 && r.f.bag === '银戒×1:', r); }

  // ---------- breadth audit: every ORIGINS × OPENERS start item, API path (gearOff + bagWear auto) ----------
  const audit = await p.evaluate(() => {
    const bad = []; let n = 0;
    for (const op of OPENERS) for (const od of ORIGINS) {
      const run = newRun(op, '测试'); run.gear = {}; run.bag = [];
      for (const g of od.gear || []) { if (g[0] === 'bag') run.bag.push({ name: g[1], q: g[2], desc: g[3], n: g[4] || 1 }); else run.gear[g[0]] = { name: g[1], q: g[2], desc: g[3] }; }
      try { if (op.setup && OP_SETUP[op.setup]) OP_SETUP[op.setup](run); } catch (e) {}
      S.run = run;
      for (const k of Object.keys(run.gear)) {
        if (!run.gear[k]) continue; const nm = run.gear[k].name, sig = () => JSON.stringify(Object.keys(run.gear).sort().map(x => [x, run.gear[x]])), g0 = sig(), b0 = JSON.stringify(run.bag); n++;
        Game.gearOff(k); const i = run.bag.findIndex(x => x.name === nm); Game.bagWear(i, 'auto', nm);
        if (sig() !== g0 || JSON.stringify(run.bag) !== b0) bad.push(op.id + '/' + od.id + '/' + k + '/' + nm);
      }
    }
    return { n, bad };
  });
  rec(T('audit all ORIGINS×OPENERS start gear (' + audit.n + ' items)'), audit.n > 50 && !audit.bad.length, audit);

  if (phone) await p.screenshot({ path: OUT + '_phone.png' }); else await p.screenshot({ path: OUT + '_desk.png' });
  rec(T('no page errors'), !errs.length, errs);
  await b.close();
}

(async () => {
  await suite('desk', { width: 1280, height: 900 });
  await suite('phone', { width: 390, height: 844 });
  const f = results.filter(r => !r.ok);
  console.log('\n' + (results.length - f.length) + '/' + results.length + ' PASS' + (f.length ? '  FAILED: ' + f.map(r => r.name).join(' | ') : ''));
  process.exit(f.length ? 1 : 0);
})();
