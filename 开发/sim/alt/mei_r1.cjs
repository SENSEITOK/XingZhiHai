// P250r R1 梅网只有魔女/女妖/毛球/魔法少女 (r_mei.md §7). node mei_r1.cjs [phone]
const { boot, rec, summary } = require('./alt_lib.cjs');
// in-page probe: ctx = { L: non-mei names, M: mei names that must still get through }
const BODY = async (ctx) => {
  const run = S.run, L = ctx.L, M = ctx.M, inL = n => L.includes(n), out = {};
  const e94 = meiEra94(run);
  V.hook = (o, sys) => {
    if (o.role === 'mei' && /作者名｜正文/.test(sys)) return [L[0] + '｜井水也白了，谁家的缸也抬不动。', '- ' + L[1] + '｜我家橱窗在冒水', '- ' + M[0] + '｜我也看见了', '- 夜班吃瓜号｜蹲后续', M[0] + '｜今天值班。', '- ' + L[2] + '｜顶'].join('\n');
    if (o.role === 'mei') return [L[0] + '｜说得对', L[1] + '｜转给邻居了', '湖边晒扫帚｜懂行。', M[0] + '｜顶。'].join('\n');
    return null;
  };
  // 1-2 template feed + threads
  for (let i = 0; i < 60; i++) meiFeedLocal(run, 3, { salt: 's' + i });
  out.tplAuthors = [...new Set(run.mei.feed.map(q => q.from))];
  out.tplCm = [...new Set(run.mei.feed.flatMap(q => (q.cm || []).map(c => c.from)))];
  const own = meiFind(run, meiPost(run, '今天去上学了').id); for (let i = 0; i < 8; i++) meiThreadLocal(run, own, { n: 6, salt: 'o' + i });
  out.ownCm = [...new Set((own.cm || []).map(c => c.from))];
  // 3 AI feed
  V.calls = []; try { await meiFeedGen(run); } catch (e) { out.feedErr = e.message; }
  const fg = V.calls.find(c => c.role === 'mei') || { system: '' };
  out.feedOld = (fg.system.match(/旧识：[^。]*。/) || [''])[0];
  out.feedRule = /只有魔女、女妖、毛球（猫球、猫灯）和魔法少女上得去/.test(fg.system);
  out.feedAi = run.mei.feed.filter(q => q.src === 'ai').map(q => q.from);
  out.feedAiCm = run.mei.feed.filter(q => q.src === 'ai').flatMap(q => (q.cm || []).map(c => c.from));
  // 4 AI comments
  V.calls = []; try { await meiComments(run, own); } catch (e) { out.cmErr = e.message; }
  const cg = V.calls.find(c => c.role === 'mei') || { system: '' };
  out.cmAllowed = (cg.system.match(/只限这些名字：[^）]*/) || [''])[0];
  out.cmAcc = (own.cm || []).filter(c => !c.local && !c.own).map(c => c.from);
  // 5 live + danmu
  const lv = meiLive(run, '放学后聊聊'); const lp = meiFind(run, lv.id);
  V.calls = []; try { await meiDanmu(run, lp); } catch (e) { out.dmErr = e.message; }
  out.dmAcc = (lp.cm || []).filter(c => c.dm && !c.nao && !c.own).map(c => c.from);
  // 6 status lines through meiCommitStory
  run.mei.live = { id: lp.id, topic: '放学后聊聊', turn0: 'tX', turns: 0, dm: 0, on: 1, origin: 'story' };
  const fake = run.mei.feed.find(q => q.src === 'ai' || q.src === 'local');
  const clean = '正文。' + L[0] + '说：「缸我一个人抬不动啊」。' + M[0] + '说：「我来帮忙抬」。' + L[1] + '嚷：「毛照片在冒水」。' + M[0] + '：「回头私信你」。新来的观众：「主播今天穿得真土」。' + L[2] + '：「盐卖光了」。';
  const frame = meiBeginStory(run) || {}; frame.m = run.mei; frame.turn = 'tY'; frame.ids = []; frame.feed = new Set(run.mei.feed.map(q => q.id)); frame.posts = new Set(run.mei.posts.map(q => q.id)); frame.mail = new Set((run.mail || []).map(l => l.id));
  const mail0 = (run.mail || []).length;
  const stat = { meiC: [fake.id + '｜' + L[0] + '｜缸我一个人抬不动啊', fake.id + '｜' + M[0] + '｜我来帮忙抬'], meiM: [L[1] + '｜毕业照｜毛照片在冒水', M[0] + '｜私信｜回头私信你'], meiDm: [L[2] + '｜盐卖光了'], meiMic: ['新来的观众｜主播今天穿得真土'] };
  if (e94) stat.meiSms = [L[0] + '｜明早帮你抬缸', M[0] + '｜明早见'];
  run._nudge = '';
  meiCommitStory(run, stat, clean, 'tY', frame);
  out.statC = (fake.cm || []).filter(c => c.sourceTurn === 'tY').map(c => c.from);
  out.statM = (run.mail || []).slice(0, (run.mail || []).length - mail0).map(l => l.from + '·' + mailKindOf(run, l));
  out.statDm = (lp.cm || []).filter(c => c.sourceTurn === 'tY' && !c.mic).map(c => c.from);
  const mic = run.npcs['新来的观众']; out.mic = mic ? [mic.race, mic.world, mic.rb].join('/') + '·ok=' + meiOk(run, '新来的观众') : 'none';
  out.sms = (run.mei.smsQ || []).map(q => q.to); out.nudge = run._nudge || '';
  // 7-9 accept paths
  out.npcPost = Object.fromEntries([...L, ...M, '夜班吃瓜号', '卖鱼的老汉'].map(n => [n, meiNpcPost(run, n + '｜有一条新消息' + n)]).map(([n, r]) => [n, r.ok ? 'ok' : r.why]));
  for (const n of [...L, ...M]) if (run.npcs[n]) run.npcs[n].fav = Math.max(run.npcs[n].fav || 0, 60);
  out.fan = Object.fromEntries([...L, ...M].filter(n => run.npcs[n] && run.npcs[n].rel !== '仇敌').map(n => [n, (r => r.ok ? 'ok' : r.why)(meiFanFrom(run, n + '｜点了关注'))]));
  out.follow = Object.fromEntries([...L, ...M].map(n => [n, (r => r.ok ? 'ok' : r.why)(meiFollow(run, n))]));
  // 10-15
  run.mei.tab = 'fo'; run.mei.view.detail = null; renderMei();
  out.foPage = [...document.querySelectorAll('#ov-mei .mei-list b, #ov-mei .mei-list .mei-name')].map(e => e.textContent.trim());
  out.foHtml = (document.querySelector('#ov-mei .mei-list') || {}).textContent || '';
  out.search = [...new Set(['店', '精灵', '伙计', '老', '小町', '心', '猫'].flatMap(q => meiSearch(run, q).users.filter(u => u.kind === 'npc').map(u => u.nm)))];
  for (const n of [...L, ...M]) if (run.npcs[n]) { run.npcs[n].deeds = ['做了件事' + n]; run.npcs[n].fav = 70; }
  out.hotNpc = meiHotList(run).filter(h => h.kind === 'npc').map(h => h.t);
  run.lastCast = L.concat(M).slice(0, 4).map(n => ({ name: n, att: '' }));
  const sp = meiStoryPrompt(run, null); const pj = (sp.match(/【这次相关的人与关系·仅供作者定位】(\[.*?\])\n/) || [])[1];
  out.spPeople = pj ? JSON.parse(pj).map(x => x.名字) : []; out.spRule = /且是魔女、女妖、毛球或魔法少女/.test(sp);
  out.author = Object.fromEntries([...L, ...M].map(n => [n, meiStoryAuthor(run, n, null)]));
  out.tie = Object.fromEntries([...L, ...M].map(n => [n, !!meiTieAdd(run, n, 'mention', '提到了她', null)]));
  // 16-17 letters
  for (const n of [...L, ...M]) opMail(run, n, '一封信' + n, '信的正文');
  out.kind = Object.fromEntries([...L, ...M].map(n => [n, mailKindOf(run, (run.mail || []).find(l => l.from === n.slice(0, 12) && /^一封信/.test(l.title)))]));
  Game.recvMail(run, [{ from: L[0], title: '电邮来了', txt: '网上发的', via: 'net' }], { force: true });
  out.recv = ((run.mail || []).find(l => l.title === '电邮来了') || {}).via;
  run.mei.tab = 'inbox'; renderMei(); const ib = (document.querySelector('#ov-mei') || {}).innerHTML || meiInbox(run);
  out.inbox = L.filter(n => ib.includes('<b>' + n + '</b>'));
  out.inboxM = M.filter(n => ib.includes('<b>' + n + '</b>'));
  // 20 L2 roster
  V.calls = []; await Sim.runL2(run, false, {});
  const l2 = (V.calls.find(c => c.role === 'news') || {}).user || '';
  out.l2 = l2.split('\n').filter(l => [...L, ...M].some(n => l.startsWith(n + '（'))).map(l => l.slice(0, 90));
  V.hook = null;
  return out;
};
(async () => {
  const o = await boot();
  const { p } = o;
  // ---- konghuang (1994 社交网): 雾町 locals + a 雾町 魔法少女
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.fans = 300000; });
  await o.turn('商店街上人来人往。', '地点：雾町·商店街\n在场：豆腐店老头（55·看戏）｜照相馆老板娘（50·着急）｜魔法少女小町（60·好奇）');
  const fx1 = await p.evaluate(() => ({ dt: V.R('豆腐店老头'), lb: V.R('照相馆老板娘'), xd: V.R('魔法少女小町') }));
  rec('fixtures konghuang: locals 人类@雾町, 魔法少女小町 魔法少女@雾町', fx1.dt.startsWith('人类/雾町') && fx1.lb.startsWith('人类/雾町') && fx1.xd.startsWith('魔法少女/雾町'), fx1);
  const K = await p.evaluate(BODY, { L: ['豆腐店老头', '照相馆老板娘', '便利店店员', '房东', '阿灰'], M: ['魔法少女小町'] });
  const Lk = ['豆腐店老头', '照相馆老板娘', '便利店店员', '房东', '阿灰'], noL = a => !(a || []).some(n => Lk.includes(n));
  rec('kh 1-2 template authors/commenters: no local or pet; 小町 still appears', noL(K.tplAuthors) && noL(K.tplCm) && noL(K.ownCm) && [...K.tplAuthors, ...K.tplCm, ...K.ownCm].includes('魔法少女小町'), { a: K.tplAuthors, cm: K.tplCm.slice(0, 12), own: K.ownCm });
  rec('kh 3 AI feed: 旧识 has no locals, rule sentence in system, accepted posts/comments have no locals, 小町 accepted', !Lk.some(n => K.feedOld.includes(n)) && K.feedRule && noL(K.feedAi) && noL(K.feedAiCm) && K.feedAi.includes('魔法少女小町'), { old: K.feedOld, ai: K.feedAi, cm: K.feedAiCm, err: K.feedErr });
  rec('kh 4-5 AI comments + 频道 danmu: allow-list and accepted lines exclude locals', !Lk.some(n => K.cmAllowed.includes(n)) && noL(K.cmAcc) && noL(K.dmAcc) && K.cmAcc.includes('魔法少女小町'), { allowed: K.cmAllowed, acc: K.cmAcc, dm: K.dmAcc });
  rec('kh 6 status 梅评/梅信/弹幕/短讯 from locals refused, 小町 accepted; 热线 viewer created 魔女@魔女世界 and passes', noL(K.statC) && K.statC.includes('魔法少女小町') && K.statM.length === 1 && K.statM[0].startsWith('魔法少女小町') && noL(K.statDm) && /^魔女\/魔女世界\/o·ok=true$/.test(K.mic) && !K.sms.includes('豆腐店老头') && K.sms.includes('魔法少女小町'), { C: K.statC, M: K.statM, Dm: K.statDm, mic: K.mic, sms: K.sms, nudge: K.nudge });
  rec('kh 7 社交网：line: locals/pet refused with race text, 小町 and 夜班吃瓜号 ok, unregistered 卖鱼的老汉 refused by keyword', Lk.every(n => /上不了社交网/.test(K.npcPost[n])) && K.npcPost['魔法少女小町'] === 'ok' && K.npcPost['夜班吃瓜号'] === 'ok' && /人类/.test(K.npcPost['卖鱼的老汉']), K.npcPost);
  rec('kh 8-9 圈粉 and 关注 refuse locals, accept 小町', Object.entries(K.fan).every(([n, v]) => Lk.includes(n) ? v !== 'ok' : v === 'ok') && Object.entries(K.follow).every(([n, v]) => Lk.includes(n) ? v !== 'ok' : v === 'ok'), { fan: K.fan, follow: K.follow });
  rec('kh 10-12 关注 page, search users and hot-list NPC deeds have no locals', !Lk.some(n => K.foHtml.includes(n)) && noL(K.search) && !K.hotNpc.some(t => Lk.some(n => t.includes(n))), { search: K.search, hot: K.hotNpc });
  rec('kh 13-15 story prompt people, 梅评/梅信 author check and 往来 ties exclude locals; author rule text present', noL(K.spPeople) && K.spRule && Lk.every(n => K.author[n] === false && K.tie[n] === false) && K.author['魔法少女小町'] === true && K.tie['魔法少女小町'] === true, { people: K.spPeople, author: K.author, tie: K.tie });
  rec('kh 16-17 letters from locals are paper (post); a net letter from a local is re-filed as post; 电邮 page has no locals', Lk.every(n => K.kind[n] === 'post') && K.recv === 'post' && !K.inbox.length, { kind: K.kind, recv: K.recv, inbox: K.inbox });
  rec('kh 20 L2 roster tags locals 不上网, not 小町', K.l2.filter(l => Lk.some(n => l.startsWith(n + '（'))).every(l => /不上网/.test(l)) && K.l2.filter(l => l.startsWith('魔法少女小町（')).every(l => !/不上网/.test(l)), K.l2);
  // same-turn 在场＋社交网 for a brand-new local, unknown handle allowed while in 雾町
  await o.turn('隧道口。', '地点：雾町·隧道口\n在场：卖鱼的阿婆（50·警惕）\n社交网：卖鱼的阿婆｜鱼摊今天不开\n社交网：夜班吃瓜号｜蹲雾町后续');
  const st = await p.evaluate(() => ({ feed: S.run.mei.feed.slice(0, 6).map(x => x.from), deny: S.run.lastDeny || '', ab: V.R('卖鱼的阿婆') }));
  rec('kh same turn: 在场＋社交网 for a new 雾町 local refused (race 人类), unknown handle accepted in 雾町', !st.feed.includes('卖鱼的阿婆') && st.feed.includes('夜班吃瓜号') && /卖鱼的阿婆」是人类/.test(st.deny) && st.ab.startsWith('人类/雾町'), st);
  // 拨号 empty
  const dial = await p.evaluate(() => { const s = PromptM.stripStat('正文。\n⟦状态⟧\n拨号：\n⟦/状态⟧').stat; return JSON.stringify(s.meiDial); });
  rec('side fix: empty 拨号： no longer becomes "1"', dial === '" "', dial);
  // old save purge
  const pg = await p.evaluate(() => {
    const run = S.run, m = run.mei, fans0 = m.fans, own0 = m.posts.length;
    m.feed.unshift({ id: 'oldx', at: 1, y: run.year, from: '豆腐店老头', txt: '井水也白了', likes: 3, rp: 0, src: 'npc', cm: [] });
    m.posts[0].cm = (m.posts[0].cm || []).concat([{ from: '阿灰', txt: '喵', y: run.year }, { from: '魔法少女小町', txt: '顶', y: run.year }]);
    m.follows.push('照相馆老板娘'); run.npcs['豆腐店老头'].mei = [{ y: run.year, m: 5, k: 'cm', t: '留言', p: '', id: '' }];
    run.mail.unshift({ id: 'm1', y: run.year, from: '照相馆老板娘', title: '电邮', txt: 'x', via: 'net' });
    const old = JSON.parse(JSON.stringify(run)); delete old.mei.r1;
    const r = normalizeRun(old), m2 = r.mei;
    return { feed: m2.feed.some(x => x.from === '豆腐店老头'), cm: (m2.posts[0].cm || []).map(c => c.from), fo: m2.follows.includes('照相馆老板娘'), tie: !!r.npcs['豆腐店老头'].mei, mail: (r.mail.find(l => l.id === 'm1') || {}).via, fans: m2.fans === fans0, own: m2.posts.length === own0, r1: m2.r1 };
  });
  rec('old-save purge: local posts, pet/local comments, follows, ties gone; net mail re-filed as post; fans and her own posts untouched', !pg.feed && !pg.cm.includes('阿灰') && pg.cm.includes('魔法少女小町') && !pg.fo && !pg.tie && pg.mail === 'post' && pg.fans && pg.own && pg.r1 === 1, pg);
  // ---- 2077 梅网: 凡人 and 精灵 vs 心壳 / 文学猫灯
  await p.evaluate(() => {
    V.start('上岸第一周2077'); const run = S.run; meiInit(run); run.mei.fans = 300000;
    for (const [nm, rel, fav, note] of [['杂货铺伙计', '泛交', 60, '凡人，红木流域的陆地人，看柜台的'], ['安瑟精灵·艾薇', '仇敌', 20, '安瑟精灵，从异界来的商人'], ['精灵·林叶', '生意', 70, '精灵，替她跑货'], ['心壳', '生意', 65, '贝壳龙女妖，海洋展馆的展品'], ['文学猫灯', '挚友', 75, '住在塔楼档案馆的猫球']]) opNpc(run, nm, rel, fav, note, '');
    raceSweep(run, null);
  });
  const fx2 = await p.evaluate(() => ['杂货铺伙计', '安瑟精灵·艾薇', '精灵·林叶', '心壳', '文学猫灯'].map(V.R));
  rec('fixtures 2077: 杂货铺伙计 人类, 艾薇/林叶 精灵, 心壳 女妖 (c), 文学猫灯 毛球 (c)', fx2[0].startsWith('人类/') && fx2[1].startsWith('精灵/') && fx2[2].startsWith('精灵/') && fx2[3] === '女妖/魔女世界/c/c' && fx2[4] === '毛球/魔女世界/c/c', fx2);
  const T = await p.evaluate(BODY, { L: ['杂货铺伙计', '安瑟精灵·艾薇', '精灵·林叶'], M: ['心壳', '文学猫灯'] });
  const L7 = ['杂货铺伙计', '安瑟精灵·艾薇', '精灵·林叶'], no7 = a => !(a || []).some(n => L7.includes(n));
  rec('2077 1-5 feed/threads/AI feed/comments: no 凡人 or 精灵; 心壳/文学猫灯 still appear', no7(T.tplAuthors) && no7(T.tplCm) && no7(T.ownCm) && no7(T.feedAi) && no7(T.feedAiCm) && no7(T.cmAcc) && no7(T.dmAcc) && [...T.tplAuthors, ...T.tplCm, ...T.ownCm, ...T.feedAi, ...T.cmAcc].includes('心壳'), { a: T.tplAuthors, cm: T.tplCm.slice(0, 10), ai: T.feedAi, acc: T.cmAcc });
  rec('2077 6-9 status lines and accept paths refuse 凡人/精灵, accept 心壳', no7(T.statC) && T.statC.includes('心壳') && T.statM.length === 1 && T.statM[0] === '心壳·net' && L7.every(n => T.npcPost[n] !== 'ok') && T.npcPost['心壳'] === 'ok' && L7.filter(n => T.follow[n]).every(n => T.follow[n] !== 'ok'), { C: T.statC, M: T.statM, post: T.npcPost, follow: T.follow });
  rec('2077 letters: 凡人/精灵 letters are post, 心壳 net (梅网私信); 消息 page has no 凡人/精灵', L7.every(n => T.kind[n] === 'post') && T.kind['心壳'] === 'net' && T.recv === 'post' && !T.inbox.length, { kind: T.kind, inbox: T.inbox });
  rec('2077 search, hot list, story prompt, ties exclude 凡人/精灵', no7(T.search) && !T.hotNpc.some(t => L7.some(n => t.includes(n))) && no7(T.spPeople) && L7.every(n => !T.author[n] && !T.tie[n]), { s: T.search, h: T.hotNpc, p: T.spPeople });
  const mk = await p.evaluate(() => {
    const run = S.run, by = {};
    for (let i = 0; i < 40; i++) { const r = meiSpatRumor(run); if (r) by[r.by] = (by[r.by] || 0) + 1; }
    opNpc(run, '黑心经纪', '仇敌', 20, '「戴帽子的猫」的人，跟她抢过客户', ''); raceSweep(run, null);
    const by2 = {}; for (let i = 0; i < 40; i++) { const r = meiSpatRumor(run); if (r) by2[r.by] = (by2[r.by] || 0) + 1; }
    const k = meiMarketRoll(run); k.sells = [{ name: '测试岛', basis: 100000, scene: 0 }];
    const buyers = {}; for (let i = 0; i < 300; i++) { k.sells[0].offer = 0; delete k.sells[0].from; meiMarketTick(run, 'mk' + i); const f = k.sells[0].from; if (f && run.npcs[f]) buyers[f] = (buyers[f] || 0) + 1; }
    return { by, by2, buyers };
  });
  rec('2077 spat rumour: a 精灵 仇敌 can not run a 猫证 sock account; a 魔女 仇敌 can (and the author is named now)', !Object.keys(mk.by).length && Object.keys(mk.by2).length === 1 && mk.by2['黑心经纪'] > 0, mk);
  rec('2077 market buyers are never 凡人/精灵', !Object.keys(mk.buyers).some(n => L7.includes(n)), mk.buyers);
  // narrator text in a witch-world 2077 scene with 梅网 on
  const nar = await p.evaluate(() => { const run = S.run; run.mei.memes = [{ t: '测试梗', y: run.year }]; const s = V.sys(); window.__s = s; return { rule: /梅网只有魔女、女妖、毛球（猫球、猫灯）和魔法少女上得去/.test(s), four: /都只指魔女、女妖、毛球、魔法少女这四种/.test(s), hot: /上网的人（魔女、女妖、毛球、魔法少女）聊天可自然带到/.test(s), bare: /，旁人聊天可自然带到/.test(s), meme: /网上的人会拿来玩/.test(s), letter: (s.match(/梅网只有魔女、女妖、毛球（猫球、猫灯）和魔法少女上得去/g) || []).length === 1 && !/。。/.test(s) && !/电邮与梅网私信/.test(s) }; });
  { const ss = await p.evaluate(() => window.__s); if (ss) require("fs").writeFileSync("/tmp/nar_sys.txt", ss); }
  rec('narrator 梅网 block: rule sentence + 「都只指这四种」, hot topics only among the four, no bare 旁人聊天, rule text exactly once, no 。。, no 信 copy', nar.rule && nar.four && nar.hot && !nar.bare && nar.meme && nar.letter, nar);
  // accounts with canon cards stay on the net
  const ac = await p.evaluate(() => { const bad = []; for (const a of MEI_ACCTS.concat(MEI_ACCTS94)) { const ce = raceCanonEntry(S.run, a.nm); if (ce && !RACE_MEI.has(raceOfCanon(ce).r)) bad.push(a.nm); } return bad; });
  rec('every MEI_ACCTS/MEI_ACCTS94 account with a canon card resolves to a 梅网 race', !ac.length, ac);
  // all-witch 2077 regression (伟大替补2077 canon cast)
  const aw = await p.evaluate(() => { V.start('伟大替补2077'); const run = S.run; meiInit(run); const ks = Object.keys(run.npcs).filter(k => !run.npcs[k].dead); return { n: ks.length, races: [...new Set(ks.map(k => run.npcs[k].race))], pool: meiNpcsOf(run).length }; });
  rec('2077 all-witch opener: every NPC is a 梅网 race and the 梅网 pool keeps all of them', aw.races.every(r => ['魔女', '魔法少女', '女妖', '毛球'].includes(r)) && aw.pool === aw.n, aw);
  rec('no page errors', !o.errs.length, o.errs.slice(0, 5));
  await o.b.close();
  process.exit(summary('R1 梅网') ? 1 : 0);
})();
