// 用法：node shot.cjs 输出.png '{"part":"午","size":"中岛","facs":[["魔女塔",3]],"cam":{"yaw":0.7,"pitch":0.5,"dist":30},"w":1200,"h":800}' [models.js,...]
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const out = process.argv[2], o = JSON.parse(process.argv[3] || '{}'), models = process.argv[4] || '';
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: o.w || 1200, height: o.h || 800 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/harness.html?models=' + encodeURIComponent(models)); await p.waitForTimeout(300);
  const r = await p.evaluate(o => window.run3d(o), o);
  await p.waitForTimeout(o.wait || 900);
  await p.screenshot({ path: out });
  console.log(JSON.stringify({ r, errs }));
  await b.close();
})();
