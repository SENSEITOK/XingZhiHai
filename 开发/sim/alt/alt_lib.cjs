// P250r regression helpers: real Chromium page, AI stubbed (every call captured in V.calls), no network.
// node <script> [phone]  → 390x844 touch viewport; default desktop 1280x900.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const results = [];
function rec(name, ok, info) { results.push({ name, ok: !!ok }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  :: ' + JSON.stringify(info).slice(0, 1200))); }
function vpOf() { return process.argv.includes('phone') ? { width: 390, height: 844 } : { width: 1280, height: 900 }; }
async function boot(vp, page) {
  vp = vp || vpOf();
  const b = await chromium.launch();
  const phone = vp.width < 600;
  const p = await b.newPage(phone ? { viewport: vp, isMobile: true, hasTouch: true } : { viewport: vp });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('dialog', d => d.accept().catch(() => {}));   // 资料库「照此覆盖入档」要确认
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file://' + (page || '@@REPO@@/index.html')); await p.waitForTimeout(700);
  await p.evaluate(() => {
    window.V = { calls: [], reply: '', hook: null };
    S.api = Object.assign({}, S.api, { kind: 'openai', key: 'sk-test', base: 'http://127.0.0.1:9/v1', model: 'stub' });
    V.adj0 = Sim.adjudicate;
    Prov.chat = async (o) => {
      const sys = String((o && o.system) || ''), user = ((o && o.messages) || []).map(m => m.content).join('\n');
      V.calls.push({ role: (o && o.role) || '', system: sys, user });
      if (V.hook) { const r = V.hook(o, sys, user); if (r != null) return r; }
      return (sys.indexOf('⟦状态⟧') >= 0 && sys.indexOf('命令块') >= 0) ? V.reply : '';
    };
    Sim.adjudicate = async () => null;
    V.start = (title) => { const card = [...document.querySelectorAll('#opener-grid .op-card')].find(c => c.textContent.includes(title)); card.click(); U.$('#inp-pname').value = '测试'; Game.start(); return S.run; };
    V.status = (lines) => '\n\n⟦状态⟧\n年份：' + U.yearText(S.run.year) + '\n日期：5月12日·午\n存款：+0\n笔记：试一下\n' + lines + '\n⟦/状态⟧';
    V.ap = (lines) => { PromptM.applyStat(S.run, PromptM.stripStat('正文。\n⟦状态⟧\n' + lines + '\n⟦/状态⟧').stat); };
    V.R = (k) => { const q = S.run.npcs[k]; return q ? [q.race, q.world, q.rb, q.wb].join('/') : null; };
    V.sys = () => PromptM.buildSystem(S.run, '');
    V.cards = () => { const msg = [...document.querySelectorAll('#story .msg.ai')].pop(); return msg ? [...msg.querySelectorAll('.bubble.rich > p.nar, .bubble.rich > div.ln')].map(e => e.tagName === 'P' ? 'N' : e.classList.contains('me') ? '你' : e.classList.contains('desc') ? '~' + ((e.querySelector('.ln-desc') || {}).textContent || '') : e.classList.contains('anon') ? '-' : ((e.querySelector('.ln-who .ent') || {}).textContent || '?')) : []; };
  });
  const closeOv = () => p.evaluate(() => { for (const id of ['ov-char', 'ov-db', 'ov-graph', 'ov-mei', 'ov-mail']) { const e = U.$('#' + id); if (e && e.classList.contains('on')) UI.close(id); } if (typeof entClose === 'function') entClose(); });
  const turn = async (prose, lines) => {
    await closeOv();
    await p.evaluate(([a, l]) => { V.reply = a + V.status(l); U.$('#inp').value = '继续'; }, [prose, lines]);
    await p.evaluate(() => Game.send());
    await p.waitForFunction(() => !S.busy, null, { timeout: 20000 }); await p.waitForTimeout(100);
  };
  return { b, p, errs, phone, turn, closeOv };
}
function summary(tag) {
  const f = results.filter(r => !r.ok);
  console.log('\n' + tag + ' (' + (process.argv.includes('phone') ? '390x844' : 'desktop') + '): ' + (results.length - f.length) + '/' + results.length + ' PASS' + (f.length ? '; FAIL: ' + f.map(x => x.name).join(' | ') : ''));
  return f.length;
}
const SHOT = [
  '阿灰把这四个字也嚼了一遍，这回嚼得慢。',
  '「私有财产要登记，要缴贡赋，你名下这一整片，一年从三万口人手里收两百四十五块，还不够买一辆像样的扫帚。」它把下巴搁在书包边上，「整活之前先算算账：你整的是自家的东西，坏了没人赔，沟里那团东西淌到学校，也是你自家的学校。你确定要拿自家的房子放烟花？」',
  '便利店里，店员终于把那包盐撕开了。他没往外撒，只在自动门的门槛上倒了一条细细的白线，倒得笔直，倒完蹲着没起来。',
  '豆腐店老头听见了，笑了一声，笑得肩膀一抖。',
  '「学生仔口气不小。」他把那块炸豆腐往前又递了递，油纸边上渗出一圈黄，「这条街是你家的？那正好，你家的水缸摆在三条街外的公共水龙头底下，提手断了，我一个人抬不动。」',
  '他用下巴往街东头一指。「井水也白了，我这三天挑了十八趟水。你要真当这是自己家，就帮老头把缸抬回来。抬回来送你一板老卤点的，再管三天早饭。」',
  '照相馆的卷帘门这时整个升了上去。老板娘穿着拖鞋出来，电话线从店里一路拖到门口，听筒还夹在肩膀上。',
  '「……你们社交网上那个警察编外号都发了，叫猫狗拴好，那人呢？人就不用拴？」她朝听筒嚷，「我橱窗里三十年的毕业照，一张一张在冒水！」',
  '她一边说一边看你，从领结看到皮鞋，眉头松了，摆摆手：「小姑娘别站沟边，上学去。」'
];
module.exports = { chromium, boot, rec, results, summary, SHOT, vpOf };
