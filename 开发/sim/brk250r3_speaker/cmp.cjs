const C=require('./cases.cjs');const L=f=>JSON.parse(require('fs').readFileSync(f)).out;
const o=L('old_d.json'),n=L('new_d.json'),np=L('new_p.json'),op=L('old_p.json');
const okTok=(t,A)=>A.includes('ANY')||A.includes(t)||(A.includes('*')&&(t==='-'||t[0]==='~'));
const grade=(r,A)=>{ // exact alignment
 if(r.length!==A.length) return 'LEN';
 let worst='OK';for(let i=0;i<A.length;i++){if(!okTok(r[i],A[i])){const t=r[i];worst=(t==='-'||t[0]==='~')?(worst==='WRONG'?'WRONG':'ANON'):'WRONG';}}return worst;};
let cnt={};
C.forEach((c,i)=>{const go=grade(o[i],c.exp),gn=grade(n[i],c.exp);const k=go+'->'+gn;cnt[k]=(cnt[k]||0)+1;
 const same=JSON.stringify(n[i])===JSON.stringify(np[i]);
 if(gn!=='OK'||go!==gn||!same) console.log(`#${c.id} [${go}->${gn}]${same?'':' PHONE-DIFF '+JSON.stringify(np[i])}\n  ${c.t.replace(/\n\n/g,' / ')}\n  exp ${c.exp.map(a=>a.join('|')).join(' , ')}\n  old ${o[i].join(',')}\n  new ${n[i].join(',')}`);});
console.log(cnt);
