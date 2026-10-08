// P250r R3 种族＋所属世界 (r_race.md §11 T1–T18). node race_r3.cjs [phone]
const { boot, rec, summary, SHOT } = require('./alt_lib.cjs');
(async () => {
  const o = await boot();
  const { p } = o;
  // T1 canon table
  const t1 = await p.evaluate(() => PromptM.allWB().filter(e => e.grp === '人物' && e.builtin).map(e => [e.id, e.name, raceOfCanon(e)]));
  const EXP = { b77c_xinke: '女妖', b77c_wenxuemaodeng: '毛球', b77c_napolun: '其他', b77c_weilingdun: '亡灵' };
  const bad1 = t1.filter(([id, , r]) => r.r !== (EXP[id] || '魔女'));
  rec('T1 canon 39 人物 → race table (心壳 女妖, 文学猫灯 毛球, 拿破仑 其他, 威灵顿 亡灵, rest 魔女)', t1.length === 39 && !bad1.length, { n: t1.length, bad1 });
  const rx = Object.fromEntries(t1.map(([id, , r]) => [id, r.rx]));
  rec('T1 canon rx: 枯华 血族魔女, 心壳 贝壳龙女妖, 江涵 猫灯魔女', rx.b77c_kuhua === '血族魔女' && rx.b77c_xinke === '贝壳龙女妖' && rx.b_jianghan === '猫灯魔女', rx);
  rec('T1 雾花/海蚀/大卫 魔女 despite 毛球 nicknames; 徐嘉欣 魔女 despite 龙女妖 in text', ['b77c_wuhua', 'b77c_haishi', 'b77c_dawei', 'b77c_xujiaxin'].every(id => (t1.find(x => x[0] === id) || [])[2].r === '魔女'), t1.filter(x => ['b77c_wuhua', 'b77c_haishi', 'b77c_dawei', 'b77c_xujiaxin'].includes(x[0])));
  // T2 generic canon keys (2077)
  const t2 = await p.evaluate(() => { V.start('上岸第一周2077'); const run = S.run; opNpc(run, '妹妹', '家人', 60, '', ''); opNpc(run, '小狗', '泛交', 50, '', ''); opNpc(run, '金毛毛球', '泛交', 50, '', ''); opNpc(run, '心壳', '生意', 60, '', ''); raceSweep(run, null); return { mm: V.R('妹妹'), dog: V.R('小狗'), jin: V.R('金毛毛球'), xk: V.R('心壳') }; });
  rec('T2 generic keys 妹妹/小狗/金毛毛球 are not canon (rb≠c); 心壳 is canon 女妖', !/\/c$|\/c\//.test(t2.mm) && t2.mm.startsWith('魔女/') && t2.dog.startsWith('动物/') && t2.jin.startsWith('毛球/') && t2.xk === '女妖/魔女世界/c/c', t2);
  // T3 detector table
  const t3 = await p.evaluate(() => {
    V.start('雾町的转学生'); const run = S.run;
    const W = { w: '魔女世界', folk: '' }, WM = { w: '雾町', folk: '人类' };
    const cs = [['窗口的魔女', '考官', '不抬头，指节敲空栏', W, '魔女@魔女世界 k/d'], ['邮差魔女', '泛交', '', W, '魔女@魔女世界 k/d'], ['排队的大姐', '泛交', '挤个满怀连声道歉', W, '魔女@魔女世界 d/d'],
      ['猫灯', '使魔·宠物', '会眨。到站叫人', W, '毛球@魔女世界 k/d'], ['阿灰二号', '使魔·宠物', '跟了三年的灰猫，怕生，不怕鬼', W, '动物@魔女世界 k/d'], ['发条猫客户经理', '生意', '', W, '毛球@魔女世界 k/d'],
      ['猫偶族小贩', '泛交', '', W, '其他@魔女世界 k/d'], ['卖凉茶的大爷', '泛交', '', W, '人类@魔女世界 k/d'], ['马老板', '生意', '', W, '魔女@魔女世界 d/d'], ['鱼摊老板', '生意', '', W, '魔女@魔女世界 d/d'],
      ['流浪猫', '泛交', '', WM, '动物@雾町 k/m'], ['豆腐店老头', '泛交', '', WM, '人类@雾町 k/m'], ['照相馆老板娘', '泛交', '', WM, '人类@雾町 m/m'], ['便利店店员2', '泛交', '找钱时手抖', WM, '人类@雾町 m/m'],
      ['机关调查员魔女', '泛交', '', WM, '魔女@魔女世界 k/k'], ['神社的巫女', '泛交', '', WM, '人类@雾町 m/m'], ['夜行者头目', '仇敌', '', WM, '人类@雾町 m/m'], ['魔法少女小町', '泛交', '', WM, '魔法少女@雾町 k/m'],
      ['怨灵', '仇敌', '', WM, '亡灵@雾町 k/m'], ['吸血鬼伯爵', '仇敌', '', WM, '吸血鬼@雾町 k/m'], ['海妖种女巫', '泛交', '', W, '魔法少女@魔女世界 k/d'], ['转化学院学员', '同僚', '', W, '魔法少女@魔女世界 k/d'],
      ['人偶街店主', '生意', '', W, '魔女@魔女世界 d/d'], ['邻居·沈静漪', '邻居', '邻岛的魔女，来「听雨」歇过脚', W, '魔女@魔女世界 k/d'], ['沈研究员', '生意', '陆地人研究所的，租过「听雨」的工坊', W, '魔女@魔女世界 d/d'],
      ['魔女之家的酒保', '泛交', '', W, '魔女@魔女世界 d/d'], ['安瑟精灵队长', '同僚', '', W, '精灵@魔女世界 k/d'], ['契约恶魔', '使魔·宠物', '', W, '恶魔@魔女世界 k/d'], ['血族魔女', '泛交', '', W, '魔女@魔女世界 k/d'],
      ['使者·旧公寓', '界民', '町役所派来的，问神明何时巡境', W, '人类@雾町 m/k']];
    const got = cs.map(([nm, rel, note, here, exp]) => { const g = raceGuess(run, nm, { rel, note }, here); return [nm, g.r + '@' + g.w + ' ' + g.rb + '/' + g.wb, exp, g.rx]; });
    const norms = [['红木流域陆地人出身的魔女', 1, '魔女'], ['贝壳龙女妖', 1, '女妖'], ['海妖种女巫', 1, '魔法少女'], ['海妖种女巫', 0, '人类'], ['血族魔女', 1, '魔女'], ['猫灯魔女', 1, '魔女'], ['小吸血鬼魔女', 1, '魔女'], ['怨鹿龙幽灵', 1, '亡灵'], ['发条猫', 1, '毛球'], ['异界人', 0, '@'], ['鲨鱼娘', 1, null], ['凡人', 1, '人类'], ['人类', 0, '人类']]
      .map(([t, h, e]) => { const n = raceNorm(t, !!h, false); return [t, h, n ? n[0] : null, e]; });
    return { got, norms, rxWitch: (cs => raceGuess(run, '海妖种女巫', {}, W).rx)() };
  });
  const bad3 = t3.got.filter(x => x[1] !== x[2]);
  rec('T3 detector table (30 names, witch world and 雾町)', !bad3.length, bad3);
  const badN = t3.norms.filter(x => x[2] !== x[3]);
  rec('T3 raceNorm explicit strings incl. 女巫 home/alt split', !badN.length && t3.rxWitch === '女巫', { badN, rx: t3.rxWitch });
  // T4 konghuang opener
  const t4 = await p.evaluate(() => { V.start('雾町的转学生'); const run = S.run; const ms = Object.keys(run.npcs).filter(k => /母亲·/.test(k)).map(V.R); return { fd: V.R('房东'), dy: V.R('便利店店员'), ah: V.R('阿灰'), ms, folk: run.alt.folk, altIn: run.altIn, raceV: run.raceV }; });
  rec('T4 konghuang opener: 房东/便利店店员 人类@雾町 (o), 阿灰 动物@魔女世界 (o), mothers 魔女@魔女世界, folk 人类, in 雾町', t4.fd === '人类/雾町/o/o' && t4.dy === '人类/雾町/o/o' && t4.ah === '动物/魔女世界/o/o' && t4.ms.length === 2 && t4.ms.every(x => x.startsWith('魔女/魔女世界/')) && t4.folk === '人类' && t4.altIn === '雾町' && t4.raceV === 1, t4);
  // T5 the screenshot turn through Game.send
  await p.evaluate(() => meiInit(S.run));
  await o.turn(SHOT.join('\n\n'), '所在：南城\n地点：雾町·商店街\n在场：豆腐店老头（55·看戏）｜照相馆老板娘（50·着急）｜阿灰（90·嫌弃）\n社交网：豆腐店老头｜井水也白了，挑了十八趟水');
  const t5 = await p.evaluate(() => ({ dt: V.R('豆腐店老头'), lb: V.R('照相馆老板娘'), ah: V.R('阿灰'), hereW: S.run.hereW, altIn: S.run.altIn, feed: S.run.mei.feed.filter(x => x.from === '豆腐店老头').length, deny: S.run.lastDeny || '', cards: V.cards() }));
  rec('T5 screenshot turn: 豆腐店老头 / 照相馆老板娘 → 人类@雾町, 阿灰 unchanged, hereW 雾町', t5.dt.startsWith('人类/雾町/') && t5.lb.startsWith('人类/雾町/') && t5.ah === '动物/魔女世界/o/o' && t5.hereW === '雾町' && t5.altIn === '雾町', t5);
  rec('T5 same-turn 在场＋社交网 for a local: no feed post, lastDeny names 人类', t5.feed === 0 && /豆腐店老头/.test(t5.deny) && /人类/.test(t5.deny), { feed: t5.feed, deny: t5.deny });
  rec('T5 dialogue cards: P8 is 照相馆老板娘, never 豆腐店老头 (P2 阿灰, P5/P6 豆腐店老头)', t5.cards[7] === '照相馆老板娘' && t5.cards[8] === '照相馆老板娘' && t5.cards[1] === '阿灰' && t5.cards[4] === '豆腐店老头' && t5.cards[5] === '豆腐店老头', t5.cards);
  // T16 prompt tags (right after the screenshot turn)
  const t16 = await p.evaluate(() => { const s = V.sys(); return { roster: (s.match(/便利店店员（[^）]*）/) || [''])[0], dossier: (s.match(/◆ 豆腐店老头（[^\n]*/) || [''])[0].slice(0, 260) }; });
  rec('T16 roster carries race tag 便利店店员（人类·雾町人·…; dossier has 种族：人类 and 上不了', t16.roster.startsWith('便利店店员（人类·雾町人·') && /种族：人类/.test(t16.dossier) && /上不了/.test(t16.dossier), t16);
  // T17 template feed: no local / pet authors, {npc} never a 雾町 name
  const t17 = await p.evaluate(() => { const run = S.run; for (let i = 0; i < 60; i++) meiFeedLocal(run, 3, { salt: 'r3' + i }); const L = ['房东', '便利店店员', '阿灰', '豆腐店老头', '照相馆老板娘']; return { authors: [...new Set(run.mei.feed.map(x => x.from))].filter(n => L.includes(n)), named: run.mei.feed.filter(x => L.some(n => String(x.txt).includes(n))).map(x => x.from + '｜' + x.txt).slice(0, 3), n: run.mei.feed.length }; });
  rec('T17 meiFeedLocal ×60: no author among 房东/便利店店员/阿灰/豆腐店老头/照相馆老板娘; {npc} never fills a 雾町 name', t17.n > 0 && !t17.authors.length && !t17.named.length, t17);
  // T6 sticky world
  await o.turn('上课铃响了。', '地点：教室\n在场：班主任（50·严）');
  rec('T6 sticky: 地点：教室 → 班主任 人类@雾町', (await p.evaluate(() => V.R('班主任'))) === '人类/雾町/m/m', await p.evaluate(() => V.R('班主任')));
  // T7 visitor
  await o.turn('隧道口来了个穿制服的。', '地点：雾町·隧道口\n在场：机关调查员魔女（40·冷淡）');
  rec('T7 visitor: 机关调查员魔女 met in 雾町 → 魔女@魔女世界 (k/k)', (await p.evaluate(() => V.R('机关调查员魔女'))) === '魔女/魔女世界/k/k', await p.evaluate(() => V.R('机关调查员魔女')));
  // T8 witch world
  await o.turn('南署门口排着队。', '所在：南城\n地点：南城·机关南署门前\n在场：窗口的魔女（40·冷）｜卖凉茶的大爷（50·乐）｜排队的大姐（55·急）｜排队的二姐（50·急）');
  const t8 = await p.evaluate(() => ({ a: V.R('窗口的魔女'), b: V.R('卖凉茶的大爷'), c: V.R('排队的大姐'), here: altHere(S.run), hereW: S.run.hereW }));
  rec('T8 witch world: 窗口的魔女 魔女 (k), 卖凉茶的大爷 人类 (k), both 魔女世界; presence left 雾町', t8.a === '魔女/魔女世界/k/d' && t8.b === '人类/魔女世界/k/d' && t8.c === '魔女/魔女世界/d/d' && !t8.here && t8.hereW === '魔女世界', t8);
  // T9 人物 line precedence
  const t9 = await p.evaluate(() => {
    const run = S.run, a0 = (run.annals || []).length;
    V.ap('人物：照相馆老板娘｜种族：吸血鬼'); const x1 = V.R('照相馆老板娘');
    V.ap('人物：班主任｜种族：魔法少女'); const x2 = V.R('班主任'), an = run.annals.slice(a0).map(a => a.t);
    run.npcs['照相馆老板娘'].race = '人类'; run.npcs['照相馆老板娘'].rb = 'u';
    V.ap('人物：照相馆老板娘｜种族：魔女'); const x3 = V.R('照相馆老板娘');
    V.ap('种族：便利店店员｜精灵'); const x4 = V.R('便利店店员');
    return { x1, x2, an, x3, x4 };
  });
  rec('T9 人物 line: 吸血鬼 (a); a 雾町 local revealed as 魔法少女 gets an annal; u not overwritten; alias 种族：名｜X', t9.x1 === '吸血鬼/雾町/a/m' && t9.x2.startsWith('魔法少女/雾町/a') && t9.an.some(t => /班主任」原来是魔法少女/.test(t)) && t9.x3.startsWith('人类/雾町/u') && t9.x4.startsWith('精灵/雾町/a'), t9);
  const t9b = await p.evaluate(() => { V.start('上岸第一周2077'); V.ap('人物：心壳｜种族：魔女'); return V.R('心壳'); });
  rec('T9 canon beats narrator: 人物：心壳｜种族：魔女 → 心壳 stays 女妖 (c)', t9b === '女妖/魔女世界/c/c', t9b);
  // back to konghuang for the rest
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); });
  await o.turn('商店街。', '地点：雾町·商店街\n在场：豆腐店老头（55·看戏）｜班主任（50·严）｜照相馆老板娘（50·着急）');
  await o.turn('南署门口。', '所在：南城\n地点：南城·机关南署门前\n在场：排队的大姐（55·急）｜排队的二姐（50·急）');
  // T10 人物 creates a record
  const t10 = await p.evaluate(() => { V.ap('人物：夜巡的女人｜种族：吸血鬼｜所属：雾町'); return V.R('夜巡的女人'); });
  rec('T10 人物 line creates the record: 夜巡的女人 吸血鬼@雾町 (a/a)', t10 === '吸血鬼/雾町/a/a', t10);
  // T11 stir 档案 guard
  const t11 = await p.evaluate(() => { factSet(S.run, '班主任', 'race', '魔女', false); factSet(S.run, '排队的大姐', 'race', '女妖', false); return { bzr: V.R('班主任'), dj: V.R('排队的大姐') }; });
  rec('T11 stir 档案: 班主任 (人类@雾町) stays 人类; 排队的大姐 (d) becomes 女妖 (s)', t11.bzr.startsWith('人类/雾町/') && t11.dj === '女妖/魔女世界/s/d', t11);
  // T12 得知 guard + 她说
  const t12 = await p.evaluate(() => { V.ap('得知：班主任｜种族｜血族魔女'); V.ap('得知：排队的二姐｜种族｜女妖'); const f = S.run.npcs['班主任'].facts.race; entOpen('npc', '班主任'); const row = [...document.querySelectorAll('#ent-pop .fx-row')].map(e => e.textContent).find(t => t.startsWith('种族')) || ''; entClose(); return { bzr: V.R('班主任'), ej: V.R('排队的二姐'), fact: f && [f.v, f.k].join('/'), row }; });
  rec('T12 得知 can not lift a 雾町 local into a 梅网 race; facts keep 血族魔女; card shows 她说：血族魔女; control 二姐 → 女妖 (k)', t12.bzr.startsWith('人类/雾町/') && t12.fact === '血族魔女/1' && /人类 · 雾町/.test(t12.row) && /她说：血族魔女/.test(t12.row) && t12.ej === '女妖/魔女世界/k/d', t12);
  // T13 资料库 UI: select + world input, text editor 8 and 6 columns
  await o.closeOv();
  await p.evaluate(() => { Game.setDbTab('chars'); Game.renderDB(); UI.open('ov-db'); });
  await p.waitForTimeout(150);
  const sel = '#db-body .db-row[data-dn="班主任"] select[data-df="race"]', inp = '#db-body .db-row[data-dn="班主任"] input[data-df="world"]';
  await p.locator(sel).scrollIntoViewIfNeeded(); await p.selectOption(sel, '吸血鬼'); await p.waitForTimeout(60);
  await p.locator(inp).fill('魔女世界'); await p.locator(inp).press('Enter'); await p.locator(inp).blur(); await p.waitForTimeout(80);
  const t13a = await p.evaluate(() => V.R('班主任'));
  rec('T13 资料库 row: race select + world input → 吸血鬼@魔女世界 (u/u)', t13a === '吸血鬼/魔女世界/u/u', t13a);
  const t13phone = await p.evaluate(() => { const sh = U.$('#ov-db .sheet') || U.$('#ov-db'); return { doc: document.documentElement.scrollWidth <= window.innerWidth + 1, sheet: sh ? sh.scrollWidth <= sh.clientWidth + 1 : true, rowsW: Math.max(...[...document.querySelectorAll('#db-body .db-row')].map(r => r.scrollWidth - r.clientWidth)) }; });
  rec('T18 资料库 people tab: no horizontal scroll (rows wrap)', t13phone.doc && t13phone.sheet && t13phone.rowsW <= 1, t13phone);
  await p.locator('[data-dbtxt="chars"]').click(); await p.waitForTimeout(80);
  const txt0 = await p.locator('#db-txt').inputValue();
  const lines8 = txt0.split('\n').map(l => l.startsWith('班主任｜') ? l.split('｜').slice(0, 6).concat(['精灵', '雾町']).join('｜') : l).concat(['新来的人｜泛交｜50｜｜｜']);
  await p.locator('#db-txt').fill(lines8.join('\n')); await p.locator('[data-dbtxtapply="chars"]').click(); await p.waitForTimeout(100);
  const t13b = await p.evaluate(() => ({ bzr: V.R('班主任'), nw: V.R('新来的人'), dt: V.R('豆腐店老头') }));
  rec('T13 text editor 8 columns: 种族｜所属世界 set (u); a new row is swept; other rows keep their race', t13b.bzr === '精灵/雾町/u/u' && !!t13b.nw && t13b.nw.split('/').length === 4 && t13b.dt.startsWith('人类/雾町/'), { txt0: txt0.split('\n')[0], ...t13b });
  await p.evaluate(() => { S._dbTxt = 'chars'; Game.renderDB(); });
  const txt1 = await p.locator('#db-txt').inputValue();
  await p.locator('#db-txt').fill(txt1.split('\n').map(l => l.split('｜').slice(0, 6).join('｜')).join('\n')); await p.locator('[data-dbtxtapply="chars"]').click(); await p.waitForTimeout(100);
  const t13c = await p.evaluate(() => ({ bzr: V.R('班主任'), dt: V.R('豆腐店老头'), ah: V.R('阿灰') }));
  rec('T13 text editor 6 columns (old format) keeps stored race/world', t13c.bzr === '精灵/雾町/u/u' && t13c.dt.startsWith('人类/雾町/') && t13c.ah === '动物/魔女世界/o/o', t13c);
  await o.closeOv();
  // T14 card chips (npc, weak, canon-only) + graph opens
  const t14 = await p.evaluate(() => {
    const chip = () => { const c = document.querySelector('#ent-pop .ep-chip.race'); return c ? c.textContent + (c.classList.contains('dim') ? '(dim)' : '') : ''; };
    entOpen('npc', '便利店店员'); const a = chip(); entClose();
    entOpen('npc', '照相馆老板娘'); const b = chip(); entClose();
    entOpen('npc', '阿灰'); const c = chip(); const mei = [...document.querySelectorAll('#ent-pop .fx-row')].map(e => e.textContent).find(t => /账号/.test(t)) || ''; entClose();
    V.start('上岸第一周2077'); entOpen('canon', 'b77c_xinke'); const d = chip(); entClose();
    Graph.open(); return { a, b, c, d, mei };
  });
  await p.waitForTimeout(200);
  rec('T14 card chip: 便利店店员「人类 · 雾町」 (opener, solid), 照相馆老板娘 dim (推定, met in 雾町), 阿灰「动物」, canon-only 心壳「女妖 · 贝壳龙女妖」; 网络账号 row says 没有 for 阿灰', t14.a === '人类 · 雾町' && t14.b === '人类 · 雾町(dim)' && t14.c === '动物' && t14.d === '女妖 · 贝壳龙女妖' && /没有/.test(t14.mei), t14);
  await o.closeOv();
  // T15 migration: old konghuang save without race fields
  const t15 = await p.evaluate(() => {
    V.start('雾町的转学生'); const run = S.run;
    opNpc(run, '豆腐店老头', '泛交', 55, '商店街卖豆腐的', '看戏'); opNpc(run, '排队的大姐', '泛交', 55, '', ''); opNpc(run, '照相馆老板娘', '泛交', 50, '', '');
    run.log.push({ role: 'ai', text: '正文。\n⟦状态⟧\n所在：南城\n地点：雾町·商店街\n在场：豆腐店老头（55·看戏）\n⟦/状态⟧' });
    run.log.push({ role: 'ai', text: '正文。\n⟦状态⟧\n地点：教室\n在场：照相馆老板娘（50·急）\n⟦/状态⟧' });
    run.log.push({ role: 'ai', text: '正文。\n⟦状态⟧\n所在：南城\n地点：南城·机关南署门前\n在场：排队的大姐（50·急）\n⟦/状态⟧' });
    const old = JSON.parse(JSON.stringify(run));
    for (const k of Object.keys(old.npcs)) { const q = old.npcs[k]; delete q.race; delete q.rb; delete q.world; delete q.wb; delete q.rx; }
    old.npcs['阿灰'].race = '毛球'; old.npcs['阿灰'].rb = 'u';   // a player edit must survive
    delete old.raceV; delete old.altIn; delete old.hereW; delete old.alts[0].folk; old.spot = '雾町·商店街';
    const r1 = normalizeRun(JSON.parse(JSON.stringify(old))), s1 = JSON.stringify(r1.npcs);
    const r2 = normalizeRun(r1), s2 = JSON.stringify(r2.npcs);
    const R = k => { const q = r2.npcs[k]; return [q.race, q.world, q.rb, q.wb].join('/'); };
    return { dt: R('豆腐店老头'), dj: R('排队的大姐'), lb: R('照相馆老板娘'), fd: R('房东'), ah: R('阿灰'), raceV: r2.raceV, same: s1 === s2, altIn: r2.altIn, folk: r2.alts[0].folk };
  });
  rec('T15 migration: 豆腐店老头 人类@雾町 (log replay), 大姐 魔女@魔女世界, 教室 sticky → 照相馆老板娘 人类@雾町, opener table, u kept, idempotent', t15.dt.startsWith('人类/雾町/') && t15.dj === '魔女/魔女世界/d/d' && t15.lb === '人类/雾町/m/m' && t15.fd === '人类/雾町/o/o' && t15.ah.startsWith('毛球/') && t15.raceV === 1 && t15.same && t15.altIn === '雾町' && t15.folk === '人类', t15);
  rec('T18 no page errors', !o.errs.length, o.errs.slice(0, 5));
  await o.b.close();
  process.exit(summary('R3 race') ? 1 : 0);
})();
