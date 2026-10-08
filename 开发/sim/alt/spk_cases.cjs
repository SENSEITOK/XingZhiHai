// P250r speaker table (r_speaker.md §5) through the REAL richProse → DOM labels. Usage: node spk_cases.cjs [phone]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const CASES = require('./spk_cases_data.cjs');
const phone = process.argv.includes("phone");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage(phone ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('**/*', r => r.request().url().startsWith('file:') ? r.continue() : r.abort());
  await p.goto('file://@@REPO@@/index.html'); await p.waitForTimeout(800);
  let pass = 0, lp = 0, ln = 0; const fails = [];
  for (const c of CASES) {
    const r = await p.evaluate((c) => {
      const card = [...document.querySelectorAll('#opener-grid .op-card')].find(x => x.textContent.includes(c.op));
      card.click(); U.$('#inp-pname').value = '测试'; Game.start();
      const run = S.run;
      for (const x of c.reg) { const [nm, sp] = Array.isArray(x) ? x : [x]; opNpc(run, nm, '泛交', 50, '', '', sp); }
      const d = document.createElement('div'); d.className = 'bubble rich';
      d.innerHTML = richProse(run, c.paras.join('\n\n'), t => U.esc(t), c.cast || null);
      return [...d.children].filter(e => e.matches('p.nar, div.ln')).map(e => {
        if (e.tagName === 'P') return 'N';
        if (e.classList.contains('me')) return '你';
        if (e.classList.contains('desc')) return '~' + (e.querySelector('.ln-desc') || {}).textContent;
        if (e.classList.contains('anon')) return '-';
        return (e.querySelector('.ln-who .ent') || {}).textContent || '?';
      });
    }, c);
    const acc = e => Array.isArray(e) ? e : [e];   // round 2: [ideal, ...acceptable]
    const ok = c.exp.length === r.length && c.exp.every((e, i) => acc(e).includes(r[i]));
    c.exp.forEach((e, i) => { if (acc(e)[0] === 'N' && r[i] === 'N') return; ln++; if (acc(e).includes(r[i])) lp++; });
    if (ok) pass++; else fails.push({ id: c.id, exp: c.exp.map(e => [].concat(e).join('/')).join(' | '), got: r.join(' | ') });
    console.log((ok ? 'PASS ' : 'FAIL ') + c.id + ' ' + c.title + (ok ? '' : '\n   exp ' + c.exp.map(e => [].concat(e).join('/')).join(' | ') + '\n   got ' + r.join(' | ')));
  }
  console.log('\nspeaker cases (' + (phone ? '390x844' : 'desktop') + '): ' + pass + '/' + CASES.length + ' · labels ' + lp + '/' + ln);
  console.log('page errors', errs.length ? errs.slice(0, 5) : 'none');
  await b.close();
  process.exit(pass === CASES.length && !errs.length ? 0 : 1);
})();
