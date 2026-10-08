// P250r round 2: race detection + 梅网 gate (round2_issues A1/A6/A7/A8, B2/B3/B4/B6 = task A1, A6, A7, A8, B3, B4, B5, B7) + purge strength. node r2_race.cjs [phone]
const { boot, rec, summary } = require('./alt_lib.cjs');
(async () => {
  const o = await boot();
  const { p } = o;
  // ---- 1. 雾町: name variants of registered locals (A1 / B4)
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.mei.fans = 300000; });
  await o.turn('照相馆的老板娘朝听筒嚷。便利店店员蹲在门口。巷口走过来一个穿制服的巡警。', '地点：雾町·商店街\n在场：照相馆老板娘、便利店店员、豆腐店老头、魔法少女小町（60·好奇）');
  const v1 = await p.evaluate(() => {
    const run = S.run, no = ['照相馆老板娘', '老板娘', '照相馆的老板娘', '慌张的照相馆老板娘', '照相馆老板娘（雾町）', '店员', '便利店的店员', '便利店店员（人类）', '房东', '房东太太', '豆腐店老头', '豆腐店的老头',
      '町役所', '教团', '黑道', '夜行者', '雾町町内会', '雾町警察署', '雾町警察编外号', '巡警', '卖鱼的老汉', '商店街吃瓜群众'];
    const yes = ['夜班吃瓜号', '湖边晒扫帚', '机关夜班·2', '魔法少女小町', '小町', '杜灵璇'];
    return { no: no.filter(n => meiOk(run, n)), yes: yes.filter(n => !meiOk(run, n)), altIn: run.altIn, why: meiDenyWhy(run, '老板娘'), why2: meiDenyWhy(run, '巡警') };
  });
  rec('1 雾町: every variant of a registered local, local groups/areas and unknown names are refused (strict); pool handles, 小町 (魔法少女) and canon accounts pass', v1.altIn === '雾町' && !v1.no.length && !v1.yes.length && /就是照相馆老板娘/.test(v1.why) && /人类/.test(v1.why) && /雾町/.test(v1.why2), v1);
  await p.evaluate(() => { window.LOGP = []; const f = meiNpcPost; meiNpcPost = function (run, seg) { const r = f(run, seg); if (!r.ok) LOGP.push(r.why); return r; }; });   // 身边层隔幕重跑状态栏会清 lastDeny：直接记驳回
  for (const ls of ['梅网：老板娘｜橱窗里三十年的毕业照一张一张在冒水\n梅网：店员｜盐卖光了，明天再来', '梅网：町役所｜井水发白，暂停供水\n梅网：巡警｜猫狗拴好', '梅网：夜班吃瓜号｜雾町那边又冒白水了？'])   // 一幕至多两条梅网行：分三幕报
    await o.turn('照相馆的老板娘还在嚷，巡警在巷口站着没走。', '地点：雾町·商店街\n在场：照相馆老板娘\n' + ls);
  const v2 = await p.evaluate(() => ({ feed: S.run.mei.feed.filter(q => q.src === 'npc').map(q => q.from), deny: LOGP.join('；') }));
  rec('2 real turn: 梅网 lines by 老板娘/店员/町役所/巡警 refused with reasons; a pool handle still posts', v2.feed.join() === '夜班吃瓜号' && ['老板娘', '店员', '町役所', '巡警'].every(n => v2.deny.includes('「' + n + '」')), v2);
  // 3. 连麦 / 弹幕 / 梅评 / 梅信 / 短讯 / 信 with variant names: no new record for a local
  const v3 = await p.evaluate(() => {
    const run = S.run, n0 = Object.keys(run.npcs).length;
    const lv = meiLive(run, '放学后聊聊'), lp = meiFind(run, lv.id);
    run.mei.live = { id: lp.id, topic: '放学后聊聊', turn0: 'tX', turns: 0, dm: 0, on: 1, origin: 'story' };
    const fake = run.mei.feed.find(q => q.src === 'npc') || run.mei.feed[0];
    const clean = '正文。老板娘：「缸我一个人抬不动啊」。店员：「盐卖光了」。老板娘：「主播今天穿得真土」。新来的观众：「主播今天好看」。店员：「回头私信你」。巡警：「散了散了」。';
    const frame = meiBeginStory(run) || {}; frame.m = run.mei; frame.turn = 'tY'; frame.ids = []; frame.feed = new Set(run.mei.feed.map(q => q.id)); frame.posts = new Set(run.mei.posts.map(q => q.id)); frame.mail = new Set((run.mail || []).map(l => l.id));
    const mail0 = (run.mail || []).length; run._nudge = '';
    meiCommitStory(run, { meiC: [fake.id + '｜老板娘｜缸我一个人抬不动啊'], meiM: ['店员｜私信｜回头私信你'], meiDm: ['店员｜盐卖光了', '巡警｜散了散了'], meiMic: ['老板娘｜主播今天穿得真土', '新来的观众｜主播今天好看'], meiSms: ['店员｜明早帮你抬缸'] }, clean, 'tY', frame);
    return { cm: (fake.cm || []).filter(c => c.sourceTurn === 'tY').map(c => c.from), mail: (run.mail || []).length - mail0, dm: (lp.cm || []).filter(c => c.sourceTurn === 'tY').map(c => c.from + (c.mic ? '(mic)' : '')), rec: run.npcs['老板娘'] ? 'made' : 'none', viewer: run.npcs['新来的观众'] ? V.R('新来的观众') : 'none', sms: (run.mei.smsQ || []).map(q => q.to), n: Object.keys(run.npcs).length - n0, nudge: run._nudge };
  });
  rec('3 梅评/梅信/弹幕/连麦/短讯 from 老板娘/店员: all refused, 连麦 creates no 老板娘 record; 弹幕 from 巡警 (named in earlier 雾町 prose) refused; a live viewer 新来的观众 still gets in as 魔女', !v3.cm.length && !v3.mail && v3.rec === 'none' && !v3.sms.length && v3.dm.join() === '新来的观众(mic)' && /「巡警」是「雾町」这几幕正文里的本地人/.test(v3.nudge) && /^魔女\/魔女世界\/o/.test(v3.viewer) && /连麦未成/.test(v3.nudge), v3);
  // 4. AI comment generator while in 雾町 (net handles): locals and narration-only names refused, new witch handles kept
  const v4 = await p.evaluate(async () => {
    const run = S.run, own = meiFind(run, meiPost(run, '今天去上学了').id);
    V.hook = (o9) => o9.role === 'mei' ? ['老板娘｜说得对', '照相馆老板娘（雾町）｜我也看到了', '巡警｜散了', '湖边晒扫帚｜懂行。', '懒猫｜在雾町也要好好吃饭', '雾町吃瓜群众｜顶'].join('\n') : null;
    try { await meiComments(run, own); } catch (e) {}
    V.hook = null;
    return (own.cm || []).filter(c => !c.own && !c.local && !c.sample).map(c => c.from);
  });
  rec('4 雾町 AI comments: 老板娘/照相馆老板娘（雾町）/巡警 (named in this scene)/雾町吃瓜群众 dropped; 湖边晒扫帚 and a new handle 懒猫 kept', v4.includes('湖边晒扫帚') && v4.includes('懒猫') && !v4.some(n => /老板娘|巡警|雾町/.test(n)), v4);
  await o.turn('店员把一张纸条塞给你。', '地点：雾町·商店街\n在场：便利店店员\n信：店员｜盐｜盐卖光了，明天再来｜电邮');
  const v5 = await p.evaluate(() => (S.run.mail || []).filter(l => l.from === '店员').map(l => (l.via || '') + '/' + mailKindOf(S.run, l)));
  rec('5 信：店员｜…｜电邮 is filed as a paper letter, not net mail', v5.length && v5.every(x => x === 'post/post'), v5);
  // ---- 6. 2077 variants (witch world)
  await p.evaluate(() => { V.start('上岸第一周2077'); meiInit(S.run); S.run.mei.on = 1; opNpc(S.run, '杂货铺伙计', '泛交', 60, '凡人，红木流域的陆地人，看柜台的', ''); opNpc(S.run, '精灵·林叶', '生意', 70, '精灵，替她跑货', ''); raceSweep(S.run, null); });
  const v6 = await p.evaluate(() => ['杂货铺伙计', '伙计', '杂货铺的伙计', '杂货铺伙计（凡人）', '林叶', '精灵·林叶', '林叶（精灵）', '精灵林叶'].filter(n => meiOk(S.run, n)));
  rec('6 2077: 伙计/杂货铺的伙计/林叶/林叶（精灵）… all refused', !v6.length, v6);
  await o.turn('林叶把货单递过来。', '所在：南城\n地点：南城·杂货铺\n在场：杂货铺伙计、精灵·林叶\n梅网：林叶｜今天这批货不错\n梅网：杂货铺的伙计｜进货啦\n圈粉：林叶｜点了关注');
  await o.turn('杂货铺门口排起了队。', '所在：南城\n地点：南城·杂货铺\n在场：杂货铺伙计\n梅网：懒猫｜南城的杂货铺今天排长队');
  const v7 = await p.evaluate(() => ({ feed: S.run.mei.feed.filter(q => q.src === 'npc').map(q => q.from), fans: (S.run.mei.fofrom || []).map(x => x.nm) }));
  rec('7 2077 real turn: 林叶 and 杂货铺的伙计 refused, unregistered handle 懒猫 posts, 林叶 can not 圈粉', v7.feed.join() === '懒猫' && !v7.fans.includes('林叶'), v7);
  // ---- 8. B5: unregistered net handles in the witch world are not keyword-parsed
  const HANDLES = ['懒猫', '猫猫', '九尾狐', '路过的狗', '一只鸟', '小恶魔本魔', '恶魔猫', '摸鱼幽灵', '亡灵法师', '精灵球收藏家', '人偶师', '傀儡师', '机器人三号', '血族爱好者', '深渊打工人', '一个普通人', '凡人修仙', '村民A', '隔壁大叔', '老头乐', '人类观察员', '史莱姆', '副科级的猫', '藏品评级志愿者', '卖鱼的老汉'];
  const v8 = await p.evaluate(async (H) => {
    const run = S.run, bad = H.filter(n => !meiOk(run, n) || !meiOk(run, n, 'net'));
    const own = meiFind(run, meiPost(run, '今天加班').id);
    V.hook = (o9) => o9.role === 'mei' ? H.slice(0, 12).map(n => n + '｜顶。' + n).join('\n') : null;
    try { await meiComments(run, own); } catch (e) {}
    V.hook = null;
    return { bad, got: (own.cm || []).filter(c => !c.own && !c.local && !c.sample).map(c => c.from) };
  }, HANDLES);
  rec('8 witch world: 25 ordinary handles (懒猫, 九尾狐, 小恶魔本魔, 副科级的猫, 藏品评级志愿者…) all pass meiOk; AI comments keep all 12', !v8.bad.length && v8.got.length === 12, v8);
  const v8b = await p.evaluate(async (H) => { V.start('海选报名日'); meiInit(S.run); S.run.mei.on = 1; return H.filter(n => !meiOk(S.run, n)); }, HANDLES);
  rec('8 1994 witch world (海选报名日): same handles pass', !v8b.length, v8b);
  // ---- 9. A6: race words only from the head noun; jobs are not races; nicknames are not animals
  const A6 = [['人偶师', '生意', ''], ['机器人工程师', '同僚', '修机器猫的'], ['恶魔猎人', '泛交', '赏金猎人'], ['深渊观察员', '同僚', '机关的观察员'], ['平民区的大姐', '泛交', '住在平民区'], ['疯狗', '仇敌', '黑帮打手'], ['夜鸦', '泛交', '网上认识的'],
    ['幽灵船船长', '生意', '跑船的'], ['难民营的护士', '泛交', '照顾难民'], ['骷髅会会长', '泛交', '学生社团'], ['血族研究员', '同僚', '研究血族的学者'], ['吸血鬼猎手', '泛交', ''], ['人类学教授', '师徒', '教人类学的'], ['精灵语翻译', '同僚', '机关翻译'],
    ['女巫帽店老板', '生意', '卖帽子的'], ['大魔女的仆从', '泛交', '跟班'], ['养猫的阿姨', '泛交', '养了一只猫']];
  const CTL = [['卖凉茶的大爷', '泛交', '', '人类'], ['安瑟精灵队长', '同僚', '', '精灵'], ['吸血鬼伯爵', '仇敌', '', '吸血鬼'], ['流浪猫', '泛交', '', '动物'], ['小狗', '泛交', '', '动物'], ['阿灰二号', '使魔·宠物', '跟了三年的灰猫', '动物'],
    ['小狐狸', '挚友', '同班的魔女，外号小狐狸', '魔女'], ['白鸽', '泛交', '送信的魔女', '魔女'], ['邮差魔女', '泛交', '', '魔女'], ['机关调查员魔女', '泛交', '', '魔女'], ['转化学院学员', '同僚', '', '魔法少女'], ['猫偶族小贩', '泛交', '', '其他'], ['发条猫客户经理', '生意', '', '毛球'], ['会说话的猫', '泛交', '', '动物'], ['老管家', '泛交', '管家魔女，跟了她家三代', '魔女'], ['卖鱼的', '泛交', '凡人，码头卖鱼', '人类']];
  const v9 = await p.evaluate(([A, C]) => {
    const out = {};
    for (const op of ['海选报名日', '上岸第一周2077']) {
      V.start(op); const run = S.run;
      for (const [n, rel, note] of A.concat(C)) opNpc(run, n, rel, 55, note, '');
      raceSweep(run, null);
      out[op] = { jobs: A.map(([n]) => n).filter(n => !meiOk(run, n) || run.npcs[n].race !== '魔女'), ctl: C.filter(([n, , , r]) => run.npcs[n].race !== r).map(([n]) => n + '=' + V.R(n)) };
    }
    return out;
  }, [A6, CTL]);
  rec('9 A6 witch world: 17 job titles / nicknames / 的-phrases stay 魔女 and on 梅网 (1994 and 2077)', Object.values(v9).every(x => !x.jobs.length), v9);
  rec('9 A6 controls: 大爷 人类, 安瑟精灵队长 精灵, 吸血鬼伯爵 吸血鬼, 流浪猫/小狗/会说话的猫 动物, notes saying 魔女 win over 小狐狸/白鸽, 转化学院学员 魔法少女, 猫偶族小贩 其他, 发条猫客户经理 毛球, notes 管家魔女/凡人 read', Object.values(v9).every(x => !x.ctl.length), v9);
  const v9b = await p.evaluate(() => { const run = V.start('雾町的转学生'); opNpc(run, '疯狗', '仇敌', 20, '黑道的打手', ''); opNpc(run, '夜鸦', '泛交', 50, '', ''); raceSweep(run, null); return { a: V.R('疯狗'), b: V.R('夜鸦') }; });
  rec('9 A6 雾町: thug 疯狗 and 夜鸦 are 人类@雾町, not 动物', v9b.a.startsWith('人类/雾町/') && v9b.b.startsWith('人类/雾町/'), v9b);
  // ---- 10. A7: 雾町人 / 本地人 / 当地人
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); });
  await o.turn('街上的人来来往往。', '地点：雾町·商店街\n在场：甲、乙、丙\n人物：甲｜种族：雾町人\n人物：乙｜种族：本地人\n人物：丙｜种族：当地人');
  const v10 = await p.evaluate(() => ({ a: V.R('甲'), b: V.R('乙'), c: V.R('丙') }));
  await o.turn('南署门口排着队。', '所在：南城\n地点：南城·机关南署门前\n在场：丁、戊\n人物：丁｜种族：本地人\n人物：戊｜种族：南城人\n人物：己｜种族：雾町本地人');
  const v10b = await p.evaluate(() => ({ d: V.R('丁'), e: V.R('戊'), f: V.R('己') }));
  rec('10 A7 种族：雾町人/本地人/当地人 in 雾町 → 人类@雾町; in 南城 本地人/南城人 → 魔女世界 (race not 其他); 雾町本地人 named from 南城 → 人类@雾町', [v10.a, v10.b, v10.c].every(x => x.startsWith('人类/雾町/')) && /^魔女\/魔女世界\//.test(v10b.d) && /^魔女\/魔女世界\//.test(v10b.e) && v10b.f.startsWith('人类/雾町/'), { v10, v10b });
  // ---- 11. A8: 2077 world-kind regions
  const v11 = {};
  for (const [rg, exp, mei] of [['精灵故星', '精灵', false], ['猫海大圣堂', '毛球', true], ['太阳猫灯', '毛球', true], ['晚宴航船', '魔女', true], ['亡灵漂流海', '魔女', true], ['盖亚', '魔女', true]]) {
    await p.evaluate(() => { V.start('上岸第一周2077'); meiInit(S.run); });
    await o.turn('你在' + rg + '落脚。守门的拦住了你。', '所在：' + rg + '\n地点：' + rg + '·入口\n在场：守门的、摆摊的老妇、同行的魔女（55）、林前辈（同僚·60）');
    v11[rg] = await p.evaluate(([exp, mei]) => ({ g: V.R('守门的'), f: V.R('摆摊的老妇'), w: V.R('同行的魔女'), c: V.R('林前辈'), ok: S.run.npcs['守门的'].race === exp && S.run.npcs['摆摊的老妇'].race === exp && meiOk(S.run, '守门的') === mei && V.R('同行的魔女').startsWith('魔女/魔女世界') && V.R('林前辈').startsWith('魔女/魔女世界') }), [exp, mei]);
  }
  rec('11 A8 regions: 精灵故星 精灵 (off 梅网), 猫海/太阳猫灯 毛球, 亡灵漂流海 魔女 (亡灵魔女, m), 晚宴航船/盖亚 魔女 (d); witches and 同僚 met there stay 魔女', Object.values(v11).every(x => x.ok) && (v11['亡灵漂流海'] || {}).g === '魔女/魔女世界/m/d' && (v11['晚宴航船'] || {}).g === '魔女/魔女世界/d/d', v11);
  // ---- 12. B3: 2077 planes are witch work sites
  await p.evaluate(() => { V.start('伟大替补2077'); meiInit(S.run); S.run.mei.on = 1; });
  await o.turn('你走进黄金街交易所。\n\n林小满冲你挥手。\n\n「来了？」林小满说。', '地点：暗影费伦·黄金街交易所\n在场：林小满（同僚·60）、交易所的掮客（40）、王上司（上司·50）、阿芙（挚友·70）\n梅网：林小满｜今天在黄金街看见一只会算账的史莱姆，馆里能不能收？\n梅网：交易所的掮客｜收魔女的货');
  const v12 = await p.evaluate(() => ({ lx: V.R('林小满'), boss: V.R('王上司'), af: V.R('阿芙'), jk: V.R('交易所的掮客'), feed: S.run.mei.feed.filter(x => x.src === 'npc').map(x => x.from), fo: meiFollow(S.run, '林小满').ok, pool: mailPool(S.run, []).includes('林小满'), kind: (opMail(S.run, '林小满', '明天的班', '明天我替你。'), mailKindOf(S.run, S.run.mail[0])), deny: S.run.lastDeny || '' }));
  rec('12 B3 暗影费伦: 同僚/上司/挚友 met on the plane are 魔女@魔女世界 (post, follow, mail as net); the plane stranger 掮客 is 人类@暗影费伦 and refused', v12.lx.startsWith('魔女/魔女世界/') && v12.boss.startsWith('魔女/魔女世界/') && v12.af.startsWith('魔女/魔女世界/') && v12.jk.startsWith('人类/暗影费伦/') && v12.feed.join() === '林小满' && v12.fo && v12.pool && v12.kind === 'net' && /交易所的掮客/.test(v12.deny), v12);
  await o.turn('亡灵界的通灵塔下。', '地点：亡灵界·通灵塔\n在场：塔下的守卫（40）、秦主任（上司·55）、机关派驻的魔女（50）');
  const v12b = await p.evaluate(() => ({ g: V.R('塔下的守卫'), q: V.R('秦主任'), m: V.R('机关派驻的魔女') }));
  rec('12 B3 亡灵界: 守卫 亡灵@亡灵界, 上司 秦主任 and 机关派驻的魔女 are 魔女', v12b.g.startsWith('亡灵/亡灵界/') && v12b.q.startsWith('魔女/魔女世界/') && v12b.m.startsWith('魔女/魔女世界/'), v12b);
  // ---- 13. B7: existing p.facts.race in old saves + raceGuess
  const v13 = await p.evaluate(() => {
    V.start('伟大替补2077'); meiInit(S.run);
    const js = JSON.parse(JSON.stringify(S.run)); delete js.raceV; delete js.mei.r1;
    for (const k of Object.keys(js.npcs)) { delete js.npcs[k].race; delete js.npcs[k].world; delete js.npcs[k].rb; delete js.npcs[k].wb; delete js.npcs[k].rx; }
    js.npcs['林小满'] = { fav: 60, rel: '同僚', note: '机关同事', n: 2, y0: 2078, y1: 2078, facts: { race: { v: '精灵', k: 1, how: '她自己说的' } } };
    js.npcs['陈阿姨'] = { fav: 60, rel: '泛交', note: '楼下的邻居', n: 2, y0: 2078, y1: 2078, facts: { race: { v: '人类（陆地人）', k: 0 } } };
    js.npcs['冒牌货'] = { fav: 60, rel: '泛交', note: '', n: 2, y0: 2078, y1: 2078, facts: { race: { v: '凡人', k: 0 } } };
    js.npcs['冒牌货'].race = undefined;
    js.mei.feed.unshift({ id: 'x1', from: '林小满', txt: '今天加班', cm: [{ from: '陈阿姨', txt: '辛苦' }], y: 2078 });
    js.mei.follows = (js.mei.follows || []).concat(['林小满']);
    js.npcs['林小满'].mei = [{ y: 2078, m: 5, k: 'cm', t: '留言', p: '', id: '' }];
    S.run = normalizeRun(js); const r = S.run;
    const g = raceGuess(r, '新人', { rel: '泛交', facts: { race: { v: '吸血鬼', k: 1 } } }, { w: '雾町', folk: '人类' });
    const g2 = raceGuess(r, '新人2', { rel: '泛交', facts: { race: { v: '魔女', k: 1 } } }, { w: '雾町', folk: '人类' });
    return { a: V.R('林小满'), b: V.R('陈阿姨'), okA: meiOk(r, '林小满'), feedA: r.mei.feed.some(x => x.from === '林小满'), cmB: r.mei.feed.some(x => (x.cm || []).some(c => c.from === '陈阿姨')), fo: r.mei.follows.includes('林小满'), tie: !!(r.npcs['林小满'].mei || []).length, g: g.r + '/' + g.rb, g2: g2.r + '/' + g2.rb + '/' + g2.w };
  });
  rec('13 B7 migration reads p.facts.race: learned 精灵 → 精灵 (k), stir 人类（陆地人） → 人类 (s); a learned 魔女 can not lift a 雾町 local onto 梅网', v13.a === '精灵/魔女世界/k/d' && v13.b === '人类/魔女世界/s/d' && v13.g === '吸血鬼/k' && v13.g2 === '人类/m/雾町' && !v13.okA, v13);
  rec('13 purge strength: posts, comments, follows and ties of weakly-typed people (k/s) are kept; new posts are still gated', v13.feedA && v13.cmB && v13.fo && v13.tie, v13);
  // ---- 14. purge removes only strong/replayed people
  const v14 = await p.evaluate(() => {
    V.start('上岸第一周2077'); meiInit(S.run); const run = S.run, m = run.mei;
    run.npcs['人偶匠'] = { fav: 60, rel: '泛交', n: 1, race: '魔像', rb: 'k', world: '魔女世界', wb: 'd' };
    run.npcs['灰烬镇的老板'] = { fav: 60, rel: '泛交', n: 1, race: '人类', rb: 'm', world: '灰烬镇', wb: 'm' };
    run.npcs['定死的凡人'] = { fav: 60, rel: '泛交', n: 1, race: '人类', rb: 'o', world: '魔女世界', wb: 'o' };
    for (const n of ['人偶匠', '灰烬镇的老板', '定死的凡人']) { m.feed.unshift({ id: 'p' + n, from: n, txt: '一条' + n, cm: [], y: run.year, src: 'npc' }); m.follows.push(n); run.npcs[n].mei = [{ y: run.year, m: 5, k: 'cm', t: '留言', p: '', id: '' }]; }
    const old = JSON.parse(JSON.stringify(run)); delete old.mei.r1;
    const r = normalizeRun(old), keep = n => r.mei.feed.some(x => x.from === n) && r.mei.follows.includes(n) && !!(r.npcs[n].mei || []).length;
    return { k: keep('人偶匠'), m: keep('灰烬镇的老板'), o: keep('定死的凡人') };
  });
  rec('14 purge: keyword-typed 人偶匠 (魔像 k) keeps posts/follows/ties; an alt local from the replay (m) and an engine-typed 凡人 (o) are purged', v14.k && !v14.m && !v14.o, v14);
  // ---- round 3 (P250r 二轮 #1): 魔女世界里带着档上人类名字的玩笑网名不被误拦；异界里照旧从严
  const w1 = await p.evaluate(() => { V.start('雾町的转学生'); const run = S.run; meiInit(run); run.mei.on = 1; V.ap('所在：南城\n地点：南城·公寓'); opNpc(run, '房东', '泛交', 50, '', '', '人类@魔女世界');
    const nm = ['房东的猫', '房东猫猫', '房东太太', '路人乙', '房东'], o = { altIn: run.altIn, home: nm.map(n => [n, meiOk(run, n)]) };
    altInSet(run, run.alts[0]); o.alt = nm.map(n => [n, meiOk(run, n)]); altInSet(run, null); return o; });
  rec('R3-race witch world: 房东的猫 / 房东猫猫 / 房东太太 / 路人乙 post; the registered human 房东 itself does not', w1.altIn === '' && w1.home.filter(x => x[0] !== '房东').every(x => x[1]) && !w1.home.find(x => x[0] === '房东')[1], w1);
  rec('R3-race 雾町: 房东太太 / 房东的猫 stay refused (strict)', !w1.alt.find(x => x[0] === '房东太太')[1] && !w1.alt.find(x => x[0] === '房东的猫')[1], w1);
  await o.turn('你走过楼下，房东在晒被子。', '所在：南城\n地点：南城·公寓楼下\n在场：房东\n梅网：房东的猫｜喵\n梅网：房东太太｜今天天气不错');
  const w2 = await p.evaluate(() => ({ feed: S.run.mei.feed.filter(q => q.src === 'npc').map(q => q.from), deny: S.run.lastDeny || '' }));
  rec('R3-race real turn in the witch world: 状态栏 梅网 lines 房东的猫 and 房东太太 land in the feed', w2.feed.includes('房东的猫') && w2.feed.includes('房东太太'), w2);
  rec('no page errors', !o.errs.length, o.errs.slice(0, 5));
  await o.b.close();
  process.exit(summary('R2 race+gate') ? 1 : 0);
})();
