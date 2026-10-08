// P250r speaker: (1) every opener scene through the REAL richProse, asserting the r_speaker §6.1 rows;
// (2) port fidelity: real renderer vs the design prototype (design/alt/_spk/spk2.js) on all openers and on three novel ranges
//     (novel read locally, only counts printed — no novel text is printed or stored). node spk_openers.cjs [phone]
const { boot, rec, summary } = require('./alt_lib.cjs');
const fs = require('fs');
const PROTO = __dirname + '/../../design/alt/_spk/spk2.js', NOVEL = '@@NOVEL@@/是，伟大魔女2077.txt';
const lab = r => r.t === 'nar' ? 'N' : !r.who ? '-' : r.k === 'me' ? '你' : (r.k === 'desc' ? '~' : '') + r.who;
(async () => {
  const o = await boot();
  const { p } = o;
  await p.addScriptTag({ path: PROTO });
  await p.evaluate(() => {
    V.dom = (run, text, cast) => { const d = document.createElement('div'); d.innerHTML = richProse(run, text, t => U.esc(t), cast || null); return [...d.children].filter(e => e.matches('p.nar, div.ln')).map(e => e.tagName === 'P' ? 'N' : e.classList.contains('me') ? '你' : e.classList.contains('desc') ? '~' + ((e.querySelector('.ln-desc') || {}).textContent || '') : e.classList.contains('anon') ? '-' : ((e.querySelector('.ln-who .ent') || {}).textContent || '?')); };
  });
  const titles = await p.evaluate(() => OPENERS.map(x => x.title).filter(t => [...document.querySelectorAll('#opener-grid .op-card')].some(c => c.textContent.includes(t))));
  const rows = {}; let diffs = [];
  for (const t of titles) {
    const r = await p.evaluate((t) => { V.start(t); const sc = OPENERS.find(x => x.title === t).scene || ''; const paras = sc.split(/\n+/).map(x => x.trim()).filter(Boolean); return { paras: paras.map(x => x.slice(0, 18)), real: V.dom(S.run, sc), proto: spk2(S.run, sc) }; }, t);
    rows[t] = r.real.map((x, i) => [x, r.paras[i]]).filter(([x]) => x !== 'N');
    r.real.forEach((x, i) => { const y = lab(r.proto[i] || { t: 'nar' }); if (x !== y && x !== '-') diffs.push(t + ' #' + i + ' real ' + x + ' / proto ' + y); });
  }
  const L = t => (rows[t] || []).map(x => x[0]);
  rec('§6.1 term quotes (诊断书写着「…」, 「职业方向」那栏, 「禁止施法协议」, 「客户经理」) stay narration in every opener', ['雾町的转学生', '海选报名日', '圣女在上', 'A2补习2077', '派遣日结2077'].every(t => !(rows[t] || []).some(([x, h]) => /诊断书|职业方向|禁止施法|派遣单/.test(h))), Object.fromEntries(['雾町的转学生', '海选报名日', '圣女在上', 'A2补习2077', '派遣日结2077'].map(t => [t, rows[t]])));
  rec('§6.1 海选报名日: 窗口的魔女 ×2', L('海选报名日').join('|') === '窗口的魔女|窗口的魔女', rows['海选报名日']);
  rec('§6.1 雪楠湖试训: 堤上的教官 ×3 (not 母亲)', L('雪楠湖试训').join('|') === '堤上的教官|堤上的教官|堤上的教官', rows['雪楠湖试训']);
  rec('§6.1 观星塔来信: 塔顶那位 ×2 (not 邮差魔女)', L('观星塔来信').join('|') === '塔顶那位|塔顶那位', rows['观星塔来信']);
  rec('§6.1 星海漂流: 棺材铺老板娘 ×3 then 你 (not 猫灯)', L('星海漂流').join('|') === '棺材铺老板娘|棺材铺老板娘|棺材铺老板娘|你', rows['星海漂流']);
  rec('§6.1 A2补习 ~老师; 猫的晚宴 ~旁边那位; 授勋之后 last line anonymous (me-last)', L('A2补习2077').includes('~老师') && L('猫的晚宴').includes('~旁边那位') && L('授勋之后2077').slice(-1)[0] === '-', { a2: rows['A2补习2077'], cat: rows['猫的晚宴'], xun: rows['授勋之后2077'] });
  rec('port fidelity: real renderer == prototype on all ' + titles.length + ' opener scenes', !diffs.length, diffs);
  // novel ranges: counts only
  if (fs.existsSync(NOVEL)) {
    const all = fs.readFileSync(NOVEL, 'utf8').split('\n');
    await p.evaluate(() => V.start('伟大替补2077'));
    const st = { cards: 0, diff: 0, anonReal: 0, anonProto: 0 }; const why = {}; const labs = [];
    for (const [a, b] of [[8000, 8300], [25000, 25260], [13900, 15400]]) {
      const ls = all.slice(a, b).map(s => s.trim().replace(/“/g, '「').replace(/”/g, '」')).filter(s => s && !/^第\d+章/.test(s));
      for (let i = 0; i < ls.length; i += 25) {
        const r = await p.evaluate((t) => ({ real: V.dom(S.run, t), proto: spk2(S.run, t) }), ls.slice(i, i + 25).join('\n'));
        r.real.forEach((x, j) => { labs.push(x); const y = lab(r.proto[j] || { t: 'nar' }); if (x === 'N' && y === 'N') return; st.cards++; if (x === '-') st.anonReal++; if (y === '-') st.anonProto++; if (x !== y) { st.diff++; const k = (/^~/.test(x) ? 'desc' : x === '-' ? 'anon' : 'name') + '←' + (/^~/.test(y) ? 'desc' : y === '-' ? 'anon' : 'name'); why[k] = (why[k] || 0) + 1; } });
      }
    }
    console.log('NOTE novel ranges vs the round-1 prototype (counts only; round 2 deliberately diverges: 甲乙甲、问答、台词里叫名字、没登记的名字匿名…):', JSON.stringify(st), JSON.stringify(why));
    // round 2: the prototype is no longer the reference; guard against unintended drift with a labels-only snapshot (no novel text stored). SNAP=1 rewrites it.
    const SNAP = __dirname + '/spk_novel_snap.json';
    if (process.env.SNAP || !fs.existsSync(SNAP)) fs.writeFileSync(SNAP, JSON.stringify(labs));
    const snap = JSON.parse(fs.readFileSync(SNAP, 'utf8')); let drift = 0, n9 = 0;
    labs.forEach((x, i) => { if (x === 'N' && snap[i] === 'N') return; n9++; if (x !== snap[i] && x !== '-') drift++; });   // P250r 二轮：换成匿名不算漂（chain/multi 宁可匿名），换成另一个名字才算
    console.log('NOTE novel ranges vs round-2 snapshot: cards ' + n9 + ', changed ' + drift);
    rec('novel ranges 8000-8300, 25000-25260, 13900-15400: labels match the round-2 snapshot (≤1% drift)', labs.length === snap.length && n9 > 300 && drift <= n9 * .01, { n9, drift, len: [labs.length, snap.length] });
  }
  rec('no page errors', !o.errs.length, o.errs.slice(0, 5));
  await o.b.close();
  process.exit(summary('speaker openers') ? 1 : 0);
})();
