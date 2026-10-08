// P250r round 2 · alt-world presence and location (round2_issues.md A2 A3 A4 A5 A9, B5 B7 B11 B12). node r2_loc.cjs [phone]
// Old saves are made in the pre-P250r page (index_pre_p250r.html) and loaded into the new page through normalizeRun.
const { boot, rec, summary } = require('./alt_lib.cjs');
const OLD = __dirname + '/index_pre_p250r.html';
(async () => {
  // ── old-page saves (A5 / B5 migration)
  const A = await boot(null, OLD), ap = A.p;
  const fresh = (pg) => pg.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.wealth = 99999; });
  const save = (pg) => pg.evaluate(() => JSON.stringify(S.run));
  const sendAs = async (o, input, prose, lines) => {   // a real turn with the player's own input text
    await o.p.evaluate(([i, a, l]) => { V.reply = a + V.status(l); U.$('#inp').value = i; }, [input, prose, lines]);
    await o.p.evaluate(() => Game.send()); await o.p.waitForFunction(() => !S.busy, null, { timeout: 20000 }); await o.p.waitForTimeout(100);
  };
  const old = {};
  await fresh(ap);   // m1: brk_e — 雾町 turn, map to 雪楠湖, two turns there with 梅网 posts
  await A.turn('照相馆的老板娘朝听筒嚷。豆腐店老头笑了一声。', '地点：雾町·商店街\n在场：豆腐店老头、照相馆老板娘');
  await ap.evaluate(() => travelGo(S.run, 'xuenanhu'));
  await A.turn('你在湖边的小屋前停下。钓鱼的大姐冲你招手，卖烤鱼的姐姐递过来一串鱼。', '所在：雪楠湖\n地点：湖边小屋\n在场：钓鱼的大姐、卖烤鱼的姐姐\n梅网：钓鱼的大姐｜今天钓到一条大的');
  await A.turn('钓鱼的大姐又说了几句。', '地点：湖边小屋\n在场：钓鱼的大姐\n梅网：卖烤鱼的姐姐｜烤鱼五块一串');
  old.m1 = await save(ap);
  await fresh(ap); await ap.evaluate(() => travelGo(S.run, 'xuenanhu')); old.m2 = await save(ap);                       // m2: B5 — map to 雪楠湖, no turn
  await fresh(ap); await ap.evaluate(() => { travelGo(S.run, 'xuenanhu'); travelGo(S.run, 'nancheng'); }); old.m3 = await save(ap);   // m3: round trip, back at the portal city
  await fresh(ap); await A.turn('你在商店街买了块豆腐。', '地点：雾町·商店街\n在场：无'); old.m4 = await save(ap);   // m4: never left
  await fresh(ap); old.m5 = await save(ap);                                                                             // m5: opener only
  await fresh(ap); await A.turn('你回到机关南署门前。', '所在：南城\n地点：南城·机关南署门前\n在场：无'); old.m6 = await save(ap);   // m6: 地点 with a 南城 prefix
  await fresh(ap); await ap.evaluate(() => travelGo(S.run, 'xuenanhu'));                                                // m7: left, then came back through the portal
  await A.turn('湖边起了雾。', '所在：雪楠湖\n地点：湖边\n在场：无');
  await A.turn('你推开门，雾町的商店街还是老样子。', '所在：雪楠湖\n地点：雾町·商店街\n在场：无'); old.m7 = await save(ap);
  await fresh(ap); await A.turn('你去了南城的雾町办事处。', '地点：南城·雾町办事处\n在场：无'); old.m8 = await save(ap);   // m8: alt name inside a 南城 spot
  await fresh(ap); await A.turn('豆腐店老头笑了一声。', '地点：雾町·商店街\n在场：豆腐店老头');                     // m9: map travel whose turn has no 所在 line
  await ap.evaluate(() => travelGo(S.run, 'xuenanhu'));
  await sendAs(A, '乘星海班船动身前往雪楠湖。', '湖边的钓鱼大姐冲你招手。', '地点：湖边\n在场：湖边的钓鱼大姐'); old.m9 = await save(ap);
  await ap.evaluate(() => { V.start('海选报名日'); S.run.wealth = 99999; });                                            // m10: entered an alt via 异界：+ at a 南城 counter
  await A.turn('你在柜台签了字，推开那扇门。', '所在：南城\n地点：南城·折叠空间管理局\n异界：+灰烬镇\n在场：无');
  await A.turn('镇口的风很大，守门人拦住了你。', '所在：南城\n地点：镇口\n在场：守门人'); old.m10 = await save(ap);
  const oldErrs = A.errs.slice(); await A.b.close();

  const o = await boot(), p = o.p;
  // ── L7 migration (A5 / B5 / B12)
  const mig = await p.evaluate((J) => {
    const out = {};
    for (const [k, j] of Object.entries(J)) {
      const r = normalizeRun(JSON.parse(j)); S.run = r; UI.screen('scr-game'); UI.topbar();
      out[k] = { altIn: r.altIn, top: U.$('#tb-place').textContent, here: (PromptM.buildSystem(r, '').match(/身在[^。（]{0,24}/) || [''])[0],
        npc: Object.fromEntries(Object.entries(r.npcs).map(([n, q]) => [n, (q.race || '') + '@' + (q.world || '')])), feed: ((r.mei || {}).feed || []).filter(q => q.src === 'npc').map(q => q.from) };
    }
    return out;
  }, old);
  const m = mig;
  rec('A5 old save: 雾町 turn → map to 雪楠湖 → turns there: not in 雾町, topbar/prompt 雪楠湖', m.m1.altIn === '' && /^雪楠湖/.test(m.m1.top) && /身在雪楠湖/.test(m.m1.here), m.m1);
  rec('A5 old save: the 雪楠湖 women stay 魔女@魔女世界 and keep their 梅网 posts; 雾町 locals are 人类@雾町', m.m1.npc['钓鱼的大姐'] === '魔女@魔女世界' && m.m1.npc['卖烤鱼的姐姐'] === '魔女@魔女世界' && m.m1.feed.includes('钓鱼的大姐') && m.m1.feed.includes('卖烤鱼的姐姐') && m.m1.npc['豆腐店老头'] === '人类@雾町', m.m1);
  rec('B5 old save: map travel to 雪楠湖 with no turn after → not in 雾町 (no fallback to alts[0])', m.m2.altIn === '' && /^雪楠湖/.test(m.m2.top), m.m2);
  rec('B5 old save: map round trip 雪楠湖 → 南城 (trail not explained by any status) → not in 雾町', m.m3.altIn === '' && /^南城/.test(m.m3.top), m.m3);
  rec('migration keeps saves that never left: 雾町 turn → 雾町; opener only → 雾町', m.m4.altIn === '雾町' && m.m5.altIn === '雾町' && /身在异界「雾町」/.test(m.m4.here), { m4: m.m4.altIn, m5: m.m5.altIn });
  rec('migration: 地点 南城·机关南署门前 → out; left then 地点 雾町·商店街 → back in', m.m6.altIn === '' && m.m7.altIn === '雾町', { m6: m.m6.altIn, m7: m.m7.altIn });
  rec('B12 migration: 地点 南城·雾町办事处 is 南城, not 雾町', m.m8.altIn === '', m.m8);
  rec('migration: 异界：+灰烬镇 written at a 南城 counter → in 灰烬镇 (the counter spot does not undo it)', m.m10.altIn === '灰烬镇', m.m10);
  rec('A5 replay: a map-travel turn without 所在 (player 动身前往雪楠湖) leaves 雾町; the person met there is 魔女@魔女世界', m.m9.altIn === '' && m.m9.npc['湖边的钓鱼大姐'] === '魔女@魔女世界' && m.m9.npc['豆腐店老头'] === '人类@雾町', m.m9);

  // ── L1 (A2) map travel to the portal city exits the alt; free, no days
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.wealth = 99999; V.w0 = S.run.wealth; V.c0 = JSON.stringify(S.run.clock); MapM.open(); });
  await p.waitForTimeout(600);
  const l1 = await p.evaluate(() => {
    const run = S.run, out = { in0: run.altIn };
    MapM.showTip('nancheng'); out.go = (U.$('#map-go') || {}).textContent || '';
    U.$('#map-go').click(); const b = U.$('#tv-row [data-tv]'); out.btn = b ? b.textContent : ''; b && b.click();
    out.altIn = run.altIn; out.inp = U.$('#inp').value; out.free = run.wealth === V.w0 && JSON.stringify(run.clock) === V.c0;
    out.mv = /穿过传送门，转眼到了「南城」/.test(V.sys()); out.sys = /身在南城（枢纽/.test(V.sys());
    out.again = travelGo(run, 'nancheng').why || 'ok';
    return out;
  });
  rec('A2 map: 南城 tip offers 穿过传送门回 · 南城; one free button; she is out; input prefilled; 行脚 says 穿过传送门', l1.in0 === '雾町' && /穿过传送门回/.test(l1.go) && /穿过传送门/.test(l1.btn) && l1.altIn === '' && l1.inp === '穿过传送门，回到南城。' && l1.free && l1.mv && l1.sys, l1);
  rec('A2 map: once out, 南城 is 人就在此地 again', l1.again === '人就在此地', l1.again);

  // ── L2 (A2) alt panel exit / enter
  await p.evaluate(() => { V.start('雾町的转学生'); });
  const l2 = await p.evaluate(() => {
    const run = S.run, out = {};
    Game.openPlanet(); const bo = U.$('#pl-side [data-plgate]'); out.b1 = bo ? bo.dataset.plgate + ':' + bo.textContent : '';
    bo && bo.click(); out.out = run.altIn; out.ov = U.$('#ov-planet').classList.contains('on'); out.inp1 = U.$('#inp').value; out.top1 = U.$('#tb-place').textContent;
    Game.openPlanet(); const bi = U.$('#pl-side [data-plgate]'); out.b2 = bi ? bi.dataset.plgate + ':' + bi.textContent : '';
    bi && bi.click(); out.in = run.altIn; out.inp2 = U.$('#inp').value; out.top2 = U.$('#tb-place').textContent; out.mv = (V.sys().match(/【行脚·引擎已定】[^。]*/) || [''])[0];
    out.side = [...document.querySelectorAll('.wp-line')].map(e => e.textContent).filter(t => /^所在/.test(t));
    return out;
  });
  rec('A2 alt panel: 穿过传送门回南城 exits (panel closes, topbar 南城); then 穿过传送门进「雾町」 enters (topbar, 行脚, side panel 所在)', /^out:穿过传送门回南城/.test(l2.b1) && l2.out === '' && !l2.ov && l2.inp1 === '穿过传送门，回到南城。' && /^南城/.test(l2.top1) && /^in:穿过传送门进「雾町」/.test(l2.b2) && l2.in === '雾町' && /^雾町/.test(l2.top2) && /穿过传送门，转眼到了「雾町/.test(l2.mv) && l2.side.some(t => /所在 · 雾町/.test(t)), l2);

  // ── L3 (A2) status-line 所在 rules
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; });
  const tpl = await p.evaluate(() => (V.sys().match(/\n所在：[^\n]*/) || [''])[0]);
  rec('A2 alt template: 所在 tells the AI to write 雾町; a witch-world city (even 南城) means she left', /所在：（她人在异界就写界名「雾町」；写了下列魔女世界的城就算她已经出界回去了——传送门那头的南城也一样/.test(tpl), tpl);
  await o.turn('你穿过传送门回到南城，推开公寓的门。楼下的大姐正在晾衣服。', '所在：南城\n地点：公寓楼下\n在场：楼下的大姐');
  const l3 = await p.evaluate(() => ({ altIn: S.run.altIn, top: U.$('#tb-place').textContent, sys: /身在南城（枢纽/.test(V.sys()), r: V.R('楼下的大姐'), mei: meiOk(S.run, '楼下的大姐') }));
  rec('A2 所在：南城 + 地点：公寓楼下 (= run.place) → out; prompt 身在南城; the neighbour is 魔女@魔女世界 and can post', l3.altIn === '' && /^南城 · 公寓楼下/.test(l3.top) && l3.sys && /^魔女\/魔女世界/.test(l3.r) && l3.mei, l3);
  const l3b = await p.evaluate(() => { const h = () => S.run.altIn; const out = {}; V.ap('所在：雾町\n地点：南城·机关南署门前'); out.a = h(); V.ap('所在：南城\n地点：南城·公寓'); out.b = h(); V.ap('所在：南城\n地点：雾町·商店街'); out.c = h(); V.ap('地点：商店街'); out.d = h(); return out; });
  rec('A3 所在：雾町 beats 地点 南城·…; 所在：南城 exits; 地点 naming 雾町 keeps her in; 地点 商店街 alone keeps her in', l3b.a === '雾町' && l3b.b === '' && l3b.c === '雾町' && l3b.d === '雾町', l3b);
  const l3c = await p.evaluate(() => { V.start('海选报名日'); return (V.sys().match(/\n所在：[^\n]*/) || [''])[0]; });
  rec('witch-world template unchanged: 所在：（从此列表选一：…）', /^\n所在：（从此列表选一：[^；]*）$/.test(l3c), l3c.slice(0, 40));
  await o.turn('你在柜台签了字，推开那扇门，踏进了灰烬镇。', '所在：南城\n地点：南城·折叠空间管理局\n异界：+灰烬镇\n在场：无');
  const l3d = await p.evaluate(() => ({ in1: S.run.altIn, t1: (V.sys().match(/\n所在：[^\n]*/) || [''])[0] }));
  await o.turn('镇口的风很大。', '所在：南城\n地点：灰烬镇·镇口\n在场：无');
  const l3e = await p.evaluate(() => S.run.altIn);
  await o.turn('你回到南城的公寓。', '所在：南城\n地点：公寓\n在场：无');
  const l3f = await p.evaluate(() => ({ in3: S.run.altIn, t3: (V.sys().match(/\n所在：[^\n]*/) || [''])[0] }));
  rec('异界：+灰烬镇 with 所在：南城 in the same turn enters (not undone); 地点 灰烬镇·… stays; 所在：南城 + 公寓 leaves; out of the alt the template names 灰烬镇 as the way back in', l3d.in1 === '灰烬镇' && /写界名「灰烬镇」/.test(l3d.t1) && l3e === '灰烬镇' && l3f.in3 === '' && /从此列表选一：[^；]*；她穿过传送门进了异界就写界名：「灰烬镇」/.test(l3f.t3), { l3d, l3e, l3f });

  // ── L4 (A3) 所在：雾町 + a 地点 holding a region word as a substring
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; });
  const l4 = {};
  for (const [i, sp] of ['港湾仓库', '北中门口', '月面咖啡馆', '欧陆风情面包房'].entries()) {
    await o.turn('你走到' + sp + '。看门的人' + i + '抬头看了你一眼。', '所在：雾町\n地点：' + sp + '\n在场：看门的人' + i);
    l4[sp] = await p.evaluate((k) => ({ altIn: S.run.altIn, r: V.R(k), here: /身在异界「雾町」/.test(V.sys()), top: U.$('#tb-place').textContent }), '看门的人' + i);
  }
  rec('A3 所在：雾町 + 地点 港湾仓库/北中门口/月面咖啡馆/欧陆风情面包房 → stays 雾町; new people 人类@雾町', Object.values(l4).every(x => x.altIn === '雾町' && /^人类\/雾町/.test(x.r) && x.here && /^雾町/.test(x.top)), l4);
  const l4b = await p.evaluate(() => { V.ap('地点：港湾·仓库'); return S.run.altIn; });
  rec('A3 地点 港湾·仓库 (region word before 「·」) → out', l4b === '', l4b);

  // ── L5 (A4) alt area names only count while she is in the alt
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.wealth = 99999; travelGo(S.run, 'xuenanhu'); travelGo(S.run, 'nancheng'); });
  await o.turn('你在南城的商店街买菜。卖菜的大婶塞给你一把葱。', '所在：南城\n地点：商店街\n在场：卖菜的大婶\n梅网：卖菜的大婶｜今天葱便宜');
  const l5 = await p.evaluate(() => { const out = { altIn: S.run.altIn, r: V.R('卖菜的大婶'), feed: S.run.mei.feed.filter(q => q.src === 'npc').map(q => q.from), deny: S.run.lastDeny || '' }; V.ap('地点：商店街'); out.alt2 = S.run.altIn; return out; });
  rec('A4 in 南城, 地点 商店街 (a 雾町 area name): she stays out; 卖菜的大婶 is 魔女@魔女世界 and her post goes in', l5.altIn === '' && l5.alt2 === '' && /^魔女\/魔女世界/.test(l5.r) && l5.feed.includes('卖菜的大婶') && !l5.deny, l5);
  await p.evaluate(() => { V.start('雾町的转学生'); });
  await o.turn('卖鱼的大叔在商店街口吆喝。', '地点：商店街\n在场：卖鱼的大叔');
  const l5b = await p.evaluate(() => ({ altIn: S.run.altIn, r: V.R('卖鱼的大叔') }));
  rec('A4 in 雾町, 地点 商店街 (no 所在): stays; 卖鱼的大叔 is 人类@雾町', l5b.altIn === '雾町' && /^人类\/雾町/.test(l5b.r), l5b);

  // ── L6 (B12) an alt name inside a witch-world spot
  await o.turn('你去了南城的雾町办事处，办事员递过来一张表。', '地点：南城·雾町办事处\n在场：办事员');
  const l6 = await p.evaluate(() => {
    const run = S.run, out = { altIn: run.altIn, r: V.R('办事员') };
    const a2 = altNew(run, '灰烬镇'); altAdd(run, a2); altInSet(run, null);   // 两个界，账上选中的是灰烬镇，人在魔女世界
    V.ap('地点：南城·雾町办事处'); out.alt = run.alt.nm; out.altIn2 = run.altIn;
    return out;
  });
  rec('B12 地点 南城·雾町办事处 → she is in 南城 (not 雾町), 办事员 魔女@魔女世界, the selected alt is not switched', l6.altIn === '' && /^魔女\/魔女世界/.test(l6.r) && l6.alt === '灰烬镇' && l6.altIn2 === '', l6);

  // ── L8 (A9) seekers by world
  await p.evaluate(() => { V.start('雾町的转学生'); const run = S.run; run.wealth = 99999; opNpc(run, '豆腐店老头', '泛交', 60, '豆腐店的老头', '', '人类@雾町'); });
  const l8 = await p.evaluate(async () => {
    const run = S.run, mom = Object.keys(run.npcs).find(k => /母系母亲/.test(k)), out = {};
    const blk = () => { const s = V.sys(); return { near: (s.match(/【找上门】下列[^\n]*\n((?:◆[^\n]*\n?)*)/) || ['', ''])[1], far: (s.match(/【找上门·隔着传送门】([^\n]*)\n((?:◆[^\n]*\n?)*)/) || ['', '', ''])[2], farHead: (s.match(/【找上门·隔着传送门】[^\n]*/) || [''])[0] }; };
    run.npcs[mom].seek = { t: '要她回家吃饭', a: stirActs(run) }; run.npcs['豆腐店老头'].seek = { t: '要她帮忙抬缸', a: stirActs(run) };
    out.inAlt = blk();
    travelGo(run, 'xuenanhu'); out.away = blk(); out.kept = !!run.npcs['豆腐店老头'].seek;
    delete run.npcs['豆腐店老头'].seek; delete run.npcs[mom].seek;
    V.hook = (o9) => o9.role === 'news' ? '身边：豆腐店老头｜在店里磨豆子\n找上门：豆腐店老头｜要她回来抬缸' : null; V.calls = [];
    await Sim.runL2(run, false, {}); out.l2away = !!run.npcs['豆腐店老头'].seek; out.l2sys = /异界本地人找不着她（她人在魔女世界）/.test((V.calls.find(c => c.role === 'news') || {}).system || '');
    altInSet(run, run.alts[0]);
    V.hook = (o9) => o9.role === 'news' ? '身边：豆腐店老头｜在店里磨豆子\n找上门：豆腐店老头｜要她回来抬缸' : null;
    await Sim.runL2(run, false, {}); out.l2in = !!run.npcs['豆腐店老头'].seek; V.hook = null;
    return out;
  });
  rec('A9 in 雾町: her mother is under 【找上门·隔着传送门】 (no 登门/截住), the 雾町 local under 【找上门】', /母系母亲/.test(l8.inAlt.far) && !/母系母亲/.test(l8.inAlt.near) && /不登门、不半路截住/.test(l8.inAlt.farHead) && /豆腐店老头/.test(l8.inAlt.near), l8.inAlt);
  rec('A9 in 雪楠湖: the 雾町 local never seeks her (seek kept on file), her mother seeks normally', !/豆腐店老头/.test(l8.away.near + l8.away.far) && /母系母亲/.test(l8.away.near) && !l8.away.farHead && l8.kept, l8.away);
  rec('A9 L2: 找上门 from a 雾町 local is dropped while she is away, accepted while she is in 雾町', !l8.l2away && l8.l2sys && l8.l2in, { away: l8.l2away, sys: l8.l2sys, in: l8.l2in });

  // ── L9 (B11) mailPool follows her
  await p.evaluate(() => { V.start('雾町的转学生'); S.run.wealth = 99999; });
  const l9 = await p.evaluate(() => { const run = S.run, out = {}; out.inPool = mailPool(run, []); out.brief = mailLetterBrief(run, '房东'); travelGo(run, 'xuenanhu'); out.awayPool = mailPool(run, ['房东', '便利店店员']); return out; });
  rec('B11 mailPool: in 雾町 the 房东 and 便利店店员 can write (local letters); away they cannot, even from the L2 names', l9.inPool.includes('房东') && l9.inPool.includes('便利店店员') && /「雾町」本地人，寄的是本地的信/.test(l9.brief) && !l9.awayPool.includes('房东') && !l9.awayPool.includes('便利店店员') && l9.awayPool.some(n => /母亲/.test(n)), l9);

  // ── L10 (B7) factions written while she is in the alt
  await p.evaluate(() => { V.start('雾町的转学生'); });
  await o.turn('巡警队在商店街口贴了告示。', '地点：雾町·商店街\n在场：无\n势力：巡警队｜政：全町巡逻｜财：加班费\n势力：魔女机关南署｜政：整风｜财：宽裕\n势力：雾町当局｜政：换届｜财：缺钱');
  const l10 = await p.evaluate(() => {
    const run = S.run, f = run.factions, s = V.sys();
    const loc = (s.match(/【势力】（本界「雾町」[^\n]*\n((?:[^\n【]*\n)*)/) || ['', ''])[1], far = (s.match(/【魔女世界·势力】[^\n]*\n((?:[^\n【]*\n)*)/) || ['', ''])[1];
    PromptM.applyStat(run, { reports: [{ name: '港务局', pol: '换届' }] });   // 新闻层（不是主笔）写的
    return { w: { 巡警队: (f['巡警队'] || {}).w, 南署: (f['魔女机关南署'] || {}).w, 当局: (f['雾町当局'] || {}).w, 港务局: (run.factions['港务局'] || {}).w }, loc, far };
  });
  rec('B7 in 雾町: 巡警队 and 雾町当局 are filed as local, 魔女机关南署 stays 魔女世界; news-layer factions untouched', l10.w.巡警队 === '雾町' && l10.w.当局 === '雾町' && !l10.w.南署 && !l10.w.港务局 && /巡警队/.test(l10.loc) && /雾町当局/.test(l10.loc) && /魔女机关南署/.test(l10.far) && !/巡警队/.test(l10.far), l10);

  // ---- round 3 (P250r 二轮 #2): 所在是魔女世界的城，地点只提到界名（去…、通往…、…的路上、括注、风景画）不算进界
  const r3a = await p.evaluate(() => {
    const out = {}, one = (k, pl, sp) => { V.start('雾町的转学生'); V.ap('所在：' + pl + '\n地点：' + sp); out[k] = [S.run.altIn, hereShort(S.run), (PromptM.buildSystem(S.run, '').match(/身在[^。（]{0,24}/) || [''])[0]]; };
    one('a', '南城', '去雾町的路上'); one('b', '南城', '南城站（通往雾町）'); one('c', '雪楠湖', '雾町风景画前');
    one('d', '南城', '雾町·商店街'); one('e', '南城', '雾町商店街'); one('f', '南城', '雾町');
    return out;
  });
  rec('R3-loc 所在：南城/雪楠湖 + 地点 去雾町的路上 / 南城站（通往雾町） / 雾町风景画前 → she is in the witch world (altIn empty, topbar not 雾町)', ['a', 'b', 'c'].every(k => r3a[k][0] === '' && !/^雾町/.test(r3a[k][1]) && !/异界/.test(r3a[k][2])), r3a);
  rec('R3-loc controls: 所在：南城 + 地点 雾町·商店街 / 雾町商店街 / 雾町 → in 雾町', ['d', 'e', 'f'].every(k => r3a[k][0] === '雾町'), r3a);
  const r3b = await p.evaluate(() => { V.start('雾町的转学生'); V.ap('所在：南城\n地点：南城站（通往雾町）'); const a = S.run.altIn; const r = altWhere(S.run, '去雾町的路上', ''), r2 = altWhere(S.run, '雾町·旧公寓', ''); return { a, r: r && r.k, r2: r2 && r2.k }; });
  rec('R3-loc no 所在 line: 「去雾町的路上」 is not a presence cue; 「雾町·旧公寓」 still is', r3b.a === '' && !r3b.r && r3b.r2 === 'sa', r3b);
  // ---- round 3 (P250r 三轮 #1 #2): 正文明说的魔女访客——旧档不被清掉，新档不写人物行也认
  {
    const A3 = await boot(null, OLD), a3 = A3.p;
    await a3.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.wealth = 99999; });
    await A3.turn('南城来的魔女前辈林师姐提着扫帚走来，豆腐店老头在旁边笑。', '地点：雾町·商店街\n在场：林师姐、豆腐店老头\n梅网：林师姐｜出差雾町\n梅网：豆腐店老头｜豆腐新到');
    await a3.evaluate(() => { S.run.mei.follows.push('林师姐', '豆腐店老头'); });
    await A3.turn('她们聊了几句。', '地点：雾町·商店街\n在场：林师姐\n圈粉：林师姐｜关注了你');
    const j = await a3.evaluate(() => JSON.stringify(S.run)); await A3.b.close();
    const g = await p.evaluate((j) => { const r = normalizeRun(JSON.parse(j)), q = r.npcs['林师姐'] || {}; return { feed: r.mei.feed.filter(x => x.src === 'npc').map(x => x.from), follows: r.mei.follows, w: q.race + '@' + q.world, old: (r.npcs['豆腐店老头'] || {}).race }; }, j);
    rec('R3-purge old 雾町 save: the narrated 魔女前辈 林师姐 keeps her feed post and follow (registered 魔女@魔女世界); the local 豆腐店老头 is purged', g.feed.includes('林师姐') && g.follows.includes('林师姐') && !g.feed.includes('豆腐店老头') && !g.follows.includes('豆腐店老头') && g.w === '魔女@魔女世界', g);
    const n3 = await p.evaluate(async () => {
      V.start('雾町的转学生'); meiInit(S.run); S.run.mei.on = 1; S.run.wealth = 99999; return 1; });
    await o.turn('南城来的魔女前辈林师姐提着扫帚走来。魔法少女小葵挥着魔杖。豆腐店老头在旁边笑，路人甲也是魔女的粉丝。', '地点：雾町·商店街\n在场：林师姐、小葵、路人甲\n梅网：林师姐｜出差\n梅网：小葵｜变身\n梅网：路人甲｜哈');
    const h = await p.evaluate(() => ({ feed: S.run.mei.feed.filter(q => q.src === 'npc').map(q => q.from), r: Object.fromEntries(['林师姐', '小葵', '路人甲'].map(k => [k, ((S.run.npcs[k] || {}).race || '') + '@' + ((S.run.npcs[k] || {}).world || '')])) }));
    rec('R3-cue alt world, no 人物 line: 「魔女前辈林师姐」 and 「魔法少女小葵」 post; 「魔女的粉丝」 路人甲 is a local and is refused', h.feed.includes('林师姐') && h.feed.includes('小葵') && !h.feed.includes('路人甲') && h.r['林师姐'] === '魔女@魔女世界' && /^魔法少女/.test(h.r['小葵']), h);
    const c3 = await p.evaluate(() => ({ a: raceNarrCue('林师姐不是魔女。', '林师姐'), b: raceNarrCue('老头是魔女世界来的。', '老头'), c: raceNarrCue('林师姐，一位魔女，笑了。', '林师姐'), d: raceNarrCue('魔女的老师林师姐。', '林师姐') }));
    rec('R3-cue negation / 魔女世界 / 魔女的 are not cues; the appositive is', c3.a === '' && c3.b === '' && c3.c === '魔女' && c3.d === '', c3);
  }
  rec('no page errors (old page saves / new page)', !oldErrs.length && !o.errs.length, oldErrs.concat(o.errs).slice(0, 5));
  await o.b.close();
  process.exit(summary('R2 location') ? 1 : 0);
})();
