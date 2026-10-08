const L = require('./eq_check2_lib.cjs');
(async () => {
  for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const o = await L.boot2(vp);
    const r = await o.p.evaluate(() => {
      const i94 = OPENERS.findIndex(o => (o.year || 1994) < 2000); V.mk(i94);
      const run = S.run, out = {};
      out.era = run.era || run.year;
      out.base = PromptM.buildSystem(run, "").includes("【说话样例】（原著原话");
      run.log.push({ role: "ai", text: "艾琳眯着眼笑：「这是我的。」江涵没接话。" });
      const sys = PromptM.buildSystem(run, "");
      const i = sys.indexOf("【说话样例】（原著原话");
      out.has = i >= 0; out.blk = i >= 0 ? sys.slice(i, i + 700) : "";
      out.ailin = /◆ 艾琳｜口吻：/.test(sys); out.jh = /◆ 江涵｜口吻：/.test(sys);
      out.wuhua = /◆ 雾花｜/.test(sys);   // 2077 人物不该在 1994 线出现
      out.rule = /原著人物照【说话样例】里她自己的口气说/.test(sys);
      const e = PromptM.allWB().find(x => x.id === "b_ailin");
      out.card = entWbText(e).includes("ep-say") && entWbText(e).includes("五吨金币，纯金。");
      out.cardPlain = !entWbText(PromptM.allWB().find(x => x.id === "b_wf_taici")).includes("ep-say");
      run.log.pop();
      for (let k = 0; k < 6; k++) run.log.push({ role: "ai", text: k < 5 ? "无关的一幕。" : "艾琳、江涵、安洁莉特、克拉肯、奥维利亚都在。" });
      const sys2 = PromptM.buildSystem(run, "");
      out.cap4 = (sys2.match(/｜口吻：/g) || []).length;
      out.aged = !/【说话样例】/.test(sys2.split("【说话样例】").length > 1 ? "" : "") ;
      run.log.splice(-6);
      const i77 = OPENERS.findIndex(o => (o.year || 0) >= 2077); V.mk(i77);
      S.run.log.push({ role: "ai", text: "雾花把文件推过来：「签吧。」" });
      const s77 = PromptM.buildSystem(S.run, "");
      out.y77 = S.run.year; out.wh77 = /◆ 雾花｜口吻：/.test(s77); out.al77 = /◆ 艾琳｜口吻：/.test(s77);
      return out;
    });
    L.note('voice ' + vp.width, Object.assign({}, r, { blk: r.blk.slice(0, 400) }));
    L.rec('voice ' + vp.width + ' none when nobody mentioned', !r.base, r.base);
    L.rec('voice ' + vp.width + ' block when mentioned', r.has && r.ailin && r.jh, r);
    L.rec('voice ' + vp.width + ' era-gated', !r.wuhua, r.wuhua);
    L.rec('voice ' + vp.width + ' style rule present', r.rule, r.rule);
    L.rec('voice ' + vp.width + ' canon card shows samples', r.card && r.cardPlain, r);
    L.rec('voice ' + vp.width + ' 2077 line', r.wh77 && !r.al77, r);
    L.rec('voice ' + vp.width + ' capped at 4', r.cap4 > 0 && r.cap4 <= 4, r.cap4);
    L.rec('voice ' + vp.width + ' no page errors', o.errs.length === 0, o.errs);
    await o.b.close();
  }
  L.summary('voice');
})();
