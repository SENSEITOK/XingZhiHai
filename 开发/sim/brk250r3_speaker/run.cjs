const { boot } = require('../alt/alt_lib.cjs');
const CASES = require('./cases.cjs');
const pg = process.argv[2], phone = process.argv.includes('phone');
(async()=>{
 const o=await boot(phone?{width:390,height:844}:{width:1280,height:900}, pg);const p=o.p;
 const out=[];
 for(const c of CASES){
  const r=await p.evaluate((c)=>{const card=[...document.querySelectorAll('#opener-grid .op-card')].find(x=>x.textContent.includes(c.op));card.click();U.$('#inp-pname').value='测试';Game.start();const run=S.run;
   for(const nm of c.reg)opNpc(run,nm,'泛交',50,'','','');
   const d=document.createElement('div');d.innerHTML=[].concat(richProse(run,c.t,x=>U.esc(x),null)).join('');
   return [...d.children].filter(e=>e.matches('p.nar, div.ln')).filter(e=>e.tagName!=='P').map(e=>e.classList.contains('me')?'你':e.classList.contains('desc')?'~'+((e.querySelector('.ln-desc')||{}).textContent||''):e.classList.contains('anon')?'-':((e.querySelector('.ln-who .ent')||{}).textContent||'?'));},c).catch(e=>['ERR '+e.message.slice(0,80)]);
  out.push(r);
 }
 console.log(JSON.stringify({out,errs:o.errs}));await o.b.close();})();
