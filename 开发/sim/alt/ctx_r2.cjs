// P250r R2 台词知情 / 人在异界 (r_context.md §5). node ctx_r2.cjs [phone]
const { boot, rec, summary, SHOT } = require('./alt_lib.cjs');
const OLD = __dirname + '/index_pre_p250r.html';
(async () => {
  const o = await boot();
  const { p } = o;
  await p.evaluate(() => { V.start('雾町的转学生'); meiInit(S.run); S.run.news = [{ y: S.run.year, title: '测试新闻标题', txt: '某地出了点事' }]; S.run.market = { 魔药: { f: 1.2, why: '测试行情', until: S.run.year + 2 } }; S.run.factions = { 町役所: { pol: '换届', eco: '缺钱' }, 魔女机关: { pol: '整风', eco: '宽裕' } }; });
  await o.turn(SHOT.join('\n\n'), '所在：南城\n地点：雾町·商店街\n在场：豆腐店老头（55·看戏）｜照相馆老板娘（50·着急）｜阿灰（90·嫌弃）');
  // 1 narrator prompt in 雾町
  const s1 = await p.evaluate(() => V.sys());
  const must = ['身在异界「雾町」', '十一、旁白可以全知，台词不行', '她是魔女这件事对他们是秘密', '不叫梅网也不叫社交网', '本界（雾町）人眼里她是：雾町高一转学生', '所在：（她人在异界就写界名「雾町」', '【节令】魔女世界那头是', '【魔女世界·近闻】', '【魔女世界·市况】', '本界的街谈巷议与此无关', '她眼下人就在本界', '【势力】（本界「雾町」', '【魔女世界·势力】', '社交网只有魔女、女妖、毛球（猫球、猫灯）和魔法少女上得去'];
  const mustNot = ['身在南城（枢纽', 'NPC 可自然议论', '旁人聊天可自然带到', '街景生意与众人话题须应季', '可自然融入叙事', '街谈巷议须与此相符', '以十六岁的名义注册入学'];
  rec('1 雾町 prompt has location, rule 十一 + 雾町 clause, face, alt templates, retitled 节令/近闻/市况/势力', must.every(x => s1.includes(x)), must.filter(x => !s1.includes(x)));
  rec('1 雾町 prompt drops witch-world street-talk invitations, 身在南城 and the private opener annal', mustNot.every(x => !s1.includes(x)), mustNot.filter(x => s1.includes(x)));
  const fac = (s1.match(/【势力】（本界「雾町」[^\n]*\n([^\n]*)/) || [])[1] || '';
  rec('1 本界 factions list 町役所, 魔女机关 goes to 魔女世界·势力', /町役所/.test(fac) && !/魔女机关/.test(fac) && /【魔女世界·势力】[^【]*魔女机关/.test(s1), fac);
  // 2 story prompt
  const s2 = await p.evaluate(() => { const run = S.run; meiPost(run, '今天去上学了'); const sp = meiStoryPrompt(run, null); const pj = (sp.match(/【这次相关的人与关系·仅供作者定位】(\[.*?\])\n/) || [])[1]; return { sp, people: pj ? JSON.parse(pj).map(x => x.名字) : [] }; });
  rec('2 meiStoryPrompt in 雾町: no 熟人提起 lead, alt lead, lists 在场但不上网, no 雾町 local as a net person', !/熟人提起/.test(s2.sp) && /她人在异界「雾町」/.test(s2.sp) && /【在场但不上网】[^\n]*豆腐店老头/.test(s2.sp) && !s2.people.some(n => ['豆腐店老头', '照相馆老板娘', '便利店店员', '房东', '阿灰'].includes(n)), { people: s2.people, lead: (s2.sp.match(/下列是[^\n]{0,120}/) || [''])[0] });
  // 3 feeds and authors
  const s3 = await p.evaluate(() => {
    const run = S.run, L = ['豆腐店老头', '照相馆老板娘', '便利店店员', '房东', '阿灰'];
    for (let i = 0; i < 40; i++) meiFeedLocal(run, 3, { salt: 'c' + i });
    const bad = run.mei.feed.filter(x => !meiOk(run, x.from)).map(x => x.from);
    const own = meiFind(run, run.mei.posts[0].id); for (let i = 0; i < 8; i++) meiThreadLocal(run, own, { n: 6, salt: 'o' + i });
    const cm = (own.cm || []).map(c => c.from).filter(n => L.includes(n));
    const np = meiNpcPost(run, '照相馆老板娘｜橱窗的毕业照在冒水');
    return { bad, cm, np };
  });
  rec('3 meiFeedLocal ×40: every author passes meiOk; local comments none; 照相馆老板娘 post refused', !s3.bad.length && !s3.cm.length && !s3.np.ok && /人类/.test(s3.np.why), s3);
  // 4 stir pool while in 雾町
  const s4 = await p.evaluate(() => { const run = S.run; S.disp.stir = 2; const got = []; for (let i = 0; i < 400 && got.length < 30; i++) { run.stirAt = -99; run.stirUsed = []; const t = stirRoll(run); if (t) got.push(t); } return { n: got.length, out: got.filter(t => !STIR_EV.alt.includes(t)) }; });
  rec('4 stirRoll in 雾町 ×30: every line from STIR_EV.alt (no brooms, no 小魔女)', s4.n === 30 && !s4.out.length, s4);
  // 5 presence transitions
  const s5 = await p.evaluate(() => {
    const run = S.run, h = () => (altHere(run) || {}).nm || '';
    const out = {};
    V.ap('地点：商店街'); out.ambig = h();
    V.ap('所在：南城\n地点：商店街'); out.left = h(); V.ap('地点：雾町·商店街');   // r2_loc: 所在写魔女世界的城（传送门那头的南城也算）＝出界
    V.ap('地点：南城·机关南署门前'); out.exit = h(); out.sysExit = /身在南城（枢纽/.test(V.sys()); out.tbExit = U.$('#tb-place').textContent;
    V.ap('地点：雾町·商店街'); out.back = h();
    const t = travelGo(run, 'xuenanhu', null, ''); out.travel = t.ok ? h() : 'travel failed: ' + t.why;
    V.ap('所在：雾町\n地点：旧公寓'); out.place = h(); UI.topbar(); out.tb = U.$('#tb-place').textContent;
    return out;
  });
  rec('5 presence: 地点：商店街 stays; 所在：南城 leaves; 南城·… exits (prompt 身在南城); 雾町·… enters; map travel exits; 所在：雾町 enters', s5.ambig === '雾町' && s5.left === '' && s5.exit === '' && s5.sysExit && s5.back === '雾町' && s5.travel === '' && s5.place === '雾町' && /^雾町/.test(s5.tb), s5);
  await p.evaluate(() => { const run = S.run; run.place = 'nancheng'; V.ap('地点：雾町·商店街'); });
  // 6 digests: adjudicator + L2 + mailPool
  const s6 = await p.evaluate(async () => {
    const run = S.run; V.calls = [];
    await V.adj0(run, '【说】这条街是我家的，帮你抬缸可以');
    const j = V.calls.find(c => c.role === 'judge') || {};
    V.calls = []; await Sim.runL2(run, false, {});
    const l2 = V.calls.find(c => c.role === 'news') || {};
    return { jSys: /她人在异界「雾町」/.test(j.system || ''), jUser: /身在异界「雾町」/.test(j.user || ''), l2Local: (l2.user || '').split('\n').filter(l => /^(豆腐店老头|照相馆老板娘|便利店店员|房东)（/.test(l)).map(l => l.slice(0, 60)), l2Pub: /魔女世界见报的事/.test(l2.user || ''), pool: mailPool(run, []).filter(n => ['房东', '便利店店员', '豆腐店老头', '照相馆老板娘'].includes(n)) };
  });
  rec('6 adjudicator: system has the 雾町 locals line, digest says 身在异界「雾町」', s6.jSys && s6.jUser, s6);
  rec('6 L2 roster marks 雾町 locals (人类·雾町人·本地人…·不上网), 见报 retitled; mailPool has 雾町 locals while she lives there (r2_loc B12)', s6.l2Local.length > 0 && s6.l2Local.every(l => /人类·雾町人·本地人：只知道本界的事/.test(l) && /不上网/.test(l)) && s6.l2Pub && s6.pool.includes('房东') && s6.pool.includes('便利店店员'), s6);
  // F6 private annals never become hot topics / 见报
  const s6b = await p.evaluate(() => ({ hot: meiHotList(S.run).filter(h => h.kind === 'annal').map(h => h.t), pub: mailPublic(S.run, 6) }));
  rec('F6 private opener annal (以十六岁的名义注册入学) is neither a hot topic nor 见报', !s6b.hot.some(t => /十六岁/.test(t)) && !s6b.pub.some(t => /十六岁|开垦权|六叠/.test(t)), s6b);
  // 8 old save: spot 雾町·商店街, no altIn
  const s8 = await p.evaluate(() => { const old = JSON.parse(JSON.stringify(S.run)); delete old.altIn; old.spot = '雾町·商店街'; const r = normalizeRun(old); const old2 = JSON.parse(JSON.stringify(S.run)); delete old2.altIn; old2.spot = '南城·机关南署门前'; const r2 = normalizeRun(old2); return { a: r.altIn, b: r2.altIn }; });
  rec('8 old save: spot 雾町·商店街 → altIn 雾町; spot 南城·… → not in 雾町', s8.a === '雾町' && s8.b === '', s8);
  rec('no page errors (new page)', !o.errs.length, o.errs.slice(0, 5));
  await o.b.close();
  // 7 witch-world regression: same save through the pre-patch page and the new page; new minus the known additions == old
  const A = await boot(null, OLD), B = await boot();
  const seedRun = async (pg, json) => pg.evaluate((j) => { if (j) { S.run = normalizeRun(JSON.parse(j)); UI.screen('scr-game'); } else { V.start('海选报名日'); } let s = 7; Math.random = () => ((s = (s * 16807) % 2147483647) / 2147483647); return { json: JSON.stringify(S.run), sys: PromptM.buildSystem(S.run, '') }; }, json);
  const a0 = await seedRun(A.p, null), a1 = await seedRun(A.p, a0.json), b1 = await seedRun(B.p, a0.json);
  const strip = t => t
    .replace(/（(?:魔女|魔法少女|女妖|毛球|人类|精灵|恶魔|魔像|吸血鬼|亡灵|动物|其他)·/g, '（')   // 魔女世界的人不带「·某界人」
    .replace(/／种族：[^／\n]*／所属：[^／\n]*(?:／[^／\n]*上不了[^／\n]*)?(?:／只知道[^／\n]*)?/g, '')
    .split('\n').filter(l => !/^十一、旁白可以全知/.test(l) && !/^人物：（可选，新面孔/.test(l)).join('\n')
    .replace('，原著人物照【说话样例】的口气说、不照抄', '')   // P250v 【文风】补句
    .replace(/\n*原著人物照【说话样例】里她自己的口气说：[^\n]*人说话不讲全：[^\n]*一句台词别太长，[^\n]*/, '')   // P250v voiceBlock 的通用三条
    .replace(/\n*【说话样例】[\s\S]*?(?=\n\n|$)/, '');   // P250v 在场原著人物的样例块
  if (process.env.DUMP) { require('fs').writeFileSync('/tmp/new_sys.txt', strip(b1.sys)); require('fs').writeFileSync('/tmp/old_sys.txt', a1.sys); }
  const same = strip(b1.sys) === a1.sys;
  let firstDiff = '';
  if (!same) { const x = strip(b1.sys), y = a1.sys; let i = 0; while (i < x.length && x[i] === y[i]) i++; firstDiff = 'new: …' + x.slice(Math.max(0, i - 60), i + 80) + ' | old: …' + y.slice(Math.max(0, i - 60), i + 80); }
  rec('7 witch-world (海选报名日) prompt: new == old except race tags, rule 十一, 人物 template line, P250v voice additions (文风 clause, voiceBlock, 说话样例)', same, firstDiff);
  rec('7 witch-world prompt really gained rule 十一 and race tags', /十一、旁白可以全知/.test(b1.sys) && /窗口的魔女（魔女·/.test(b1.sys), (b1.sys.match(/窗口的魔女（[^）]*）/) || [''])[0]);
  rec('no page errors (old/new pages)', !A.errs.length && !B.errs.length, A.errs.concat(B.errs).slice(0, 5));
  await A.b.close(); await B.b.close();
  process.exit(summary('R2 context') ? 1 : 0);
})();
