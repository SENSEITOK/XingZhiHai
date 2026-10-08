const { boot } = require('../alt/alt_lib.cjs');
const T=['你妈妈在厨房里喊：「吃饭了！」','你爸爸说：「早点睡。」','你哥哥笑了：「又迟到。」','你的同桌小声说：「老师来了。」','你看见沈梨嘴唇动了动，「走。」','你看着她，她摇头：「不行。」','你听见身后有人说：「站住。」','你们的班主任说：「安静。」','你妹妹拉拉你：「姐姐。」'];
(async()=>{const o=await boot({width:1280,height:900},process.argv[2]);const p=o.p;
await p.evaluate(()=>{V.start('海选报名日');opNpc(S.run,'沈梨','泛交',50,'','','')});
for(const t of T){await o.turn('夜深了。\n\n'+t,'');const c=await p.evaluate(()=>V.cards());console.log(t,'=>',c.filter(x=>x!='N').join(','));}
await o.b.close();})();
