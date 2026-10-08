# PLAN — beta20 (P250 法术与登记 · P251 空岛新设施 · P252 战争)

Lead-designer and engineering review of `spec_spells.md`, `spec_isle.md` and `spec_war.md`, followed by an ordered implementation plan.

- **Baseline:** index.html at 38457 lines, md5 `1029d817…`, checked 2026-10-08 ~10:55. The specs quote line numbers from 38380 and 38418, so anchors have already drifted 40 to 80 lines. **Find every edit site by its anchor (function name or unique string). Do not use line numbers.** The `≈` lines below are only for orientation.
- **Canon refs:** 1994 lines are written `94:N` and 2077 lines `77:N`, the same way the specs write them. I re-opened every reference this plan relies on (§1.4). The repo must never contain novel text. Descriptions stay paraphrased.
- **P-numbers:** P250 is spells and the creation panel, P251 is isle, P252 is war. Code comments and the docs use these tags.

---

## 0. Executive summary

1. **All three specs can ship in one beta, with cuts.** The full specs add roughly 1.4k lines for spells, 0.6k for the isle engine, 7–9k lines (≈0.5 MB) for 3D models, and 2k for war. That is too much to merge and test safely in one release. beta20 ships:
   - **Spells:** P250 core.
   - **Isle:** the P251 engine for all ten types, gated so a type only becomes buildable once its 3D model ships. Models A1 and A2 (six types) are required; the B batch (four) is a stretch.
   - **War:** P252 P1 (馆战, which is the 内战), P2 掠夺 (2077 only) and 馆内斗.
   - **Deferred to beta21** (§1.5): 决斗/代打, 1994 魔女之乱, the other openers' war hooks, 1994 raid targets, drawbacks, spell aliases, and 资料库 立项/改模型/补录.
2. **The specs mostly fit together.** Thirteen real conflicts remain (§1.1). The biggest are these:
   - **OPENERS rows.** Spells wants to add `sig:` to every row; war wants to add `setup:` to the same rows.
   - **OP_SETUP.** Spells deletes lines in it; war appends entries.
   - **Prompt and adjudicator builders.** All three specs edit lines next to each other.
   - **Retaliation and scouting.** The isle and war specs disagree on who handles retaliation against isles and on how scouting works.
   - **Isle dice invariance.** spec_isle's own 袭岛 event breaks the dice invariance it promises (§1.2-I1).
3. **Five balance holes must close before shipping** (§1.3):
   - Mana is a free slider, so the ring cap means nothing.
   - The drawbacks are free points.
   - Free-text `fx`/`desc` can be used to inject instructions.
   - Talent and isle discounts stack without a combined cap.
   - Raids can be repeated weekly with no limit.
4. **Three canon errors and two mis-labels** (§1.4):
   - 私掠委托 is read backwards.
   - 笔绘速写 *is* named in canon (77:15567).
   - "One talent, two with a drawback" is the reader's design note, not canon.
   - 闪灵 "3 级" is a different scale from 军势档, and its line ref is wrong.
   - The 魔女之乱 year 1995 is in fact supported (94:43782 → 94:45188).
5. **Process.** A short **WP0** goes first. It creates golden baselines, behaviour-neutral seams, and one code block per feature. After WP0 the feature work packages touch disjoint regions of index.html and can run in parallel, either on separate branches or worktrees merged by git 3-way merge, or serialized by an integrator. §3 maps which work package owns each region.

---

## 1. Critique

### 1.1 Conflicts between the specs and how to resolve them

| # | Conflict | Specs | Resolution (binding for implementers) |
|---|---|---|---|
| C1 | **OPENERS rows.** Spells pastes `sig:{…}` into all 13 rows. War adds `setup:` keys to the linshigong77 and paiqian77 rows (and buxi77). These are the same physical lines, so git conflicts are guaranteed. | S §2.5, W §4.2 | Put the spell kits in a **separate table `OPENER_SIG = { saibo:{…}, … }`** keyed by opener id, defined in the P250 block. `regCtx` reads `OPENER_SIG[op.id]`. **WP0** adds the three `setup:` keys. Spells never edits OPENERS. |
| C2 | **OP_SETUP.** Spells deletes `opSpell` lines inside existing entries (shengnv … zhanmo77, the last entry). War appends two entries at the end, which is adjacent to the zhanmo77 deletions. Both specs claim the buxi77 setup. Spells says buxi77's PANEL_FIT belongs to war; war says it belongs to spells. | S §6.3, W §4.2 | **WP0** inserts three empty bodies at the **top** of OP_SETUP: `linshigong77`, `paiqian77`, `buxi77`. **W1** owns those three bodies, including the buxi77 text from S §6.3, and all PANEL_FIT rows. **S1** owns the deletions inside the existing entries. Static test: no `opSpell(` inside OP_SETUP. |
| C3 | **Prompt builder (`PromptM` CORE plus the status-key table).** Spells edits the spell list, 【法术详情】, the persona line, 「天赋：」 and 「法术：」. Isle edits 「营建：」. War edits 「战役：」, 「营生：」, `lastWar` and adds new rows. Several of these lines are 3–6 apart. | all | Each line has exactly **one owner** (§3). WP0 adds new dedicated array elements for the new injections: `spLockLine(run)` after 【法术详情】, and `gwLastLine(run)` after the `lastWar` block. Nobody edits the 13 kB 「【当前】…」 mega-line (≈27650). |
| C4 | **Adjudicator system prompt.** Spells inserts a "她的自创法术" line just before 「敌人等级对照」. War edits the JSON-spec line directly above it (`op`/`to`/`dip`) and `mw9`. | S §7.7, W §9.2 | WP0 inserts two stub lines between the JSON-spec line and 「敌人等级对照」: `spJudgeLine(run) +` and `gwJudgeLine(run) +`. War owns `mw9` and the JSON-spec line. Spells owns only its stub's body. |
| C5 | **`normalizeRun`.** Spells adds `spellLocks` and `fx250`. Isle extends the type migration at the `es.fac` loop. War adds `gwNormalize`. | all | WP0 appends `spNormalize(r); isleNormalize(r); gwNormalize(r);` at the tail. Each work package fills its own function. Isle does **not** edit the existing migration line; `isleNormalize` runs the extended migration after it. |
| C6 | **Troop price, upkeep and caps.** Isle multiplies in `isleTroopF` and `isleUpF` and replaces `t.cap` at 4 sites. War reads `armyStat` and `armyTier`. Spells' custom talents add `troop`/`up` effects through the existing talent factors. | I §4.9, S §4.3 | WP0 replaces those sites with `troopPriceF(run, kind, tid)`, `upkeepF(run, tid)` and `troopCapOf(run, tid)`. These are wrappers that apply a **combined clamp** (§1.3-B4). The isle stubs return 1 or the cap. **I1** fills them. War never edits these sites. |
| C7 | **Retaliation against isles.** Isle §3.1 says the war system's `raidTick` uses `isleDef` to halve losses or skip isles at 岛防 ≥ 3. War §7.6 says isles are left to the isle 袭岛 event (through `warHeat`). The two specs also use different names (`raidTick` vs `gwRetaliate`). | I §3.1, W §7.6 | **War's `gwRetaliate` never targets isles.** Its order is: claims, then 折叠空间, then bag relics. Isles are hit only through isle 袭岛, whose probability includes `warHeat`. Delete the `raidTick` sentence from the isle scope. `isleDef` is used only inside isle 袭岛. |
| C8 | **Scouting (观星台).** Isle: Lv2 "reveals enemy intel before 出阵/掠夺", Lv3 "+1 to the raid roll". War: always shows the forecast and the band odds, and Lv3 gives 敌情 −1, which is +2 on the d20 total. | I §3.9, W §7.4 | Use war's formula: **Lv3 gives 敌情 −1.** The raid form always shows the forecast, so a Lv2 "reveal" would be meaningless. Replace it with **Lv2 halving the 情报 fee**. `armySortie` gets no scouting in beta20. |
| C9 | **Interception of the MVP relic in transit.** War: 10%, and it is waived entirely for 后勤 or 停鸡坪. Isle: chance × (1 − .15 × 停鸡坪Lv). | W §7.6, I §3.3 | `p = .10 × (1 − .15 × isleBest("停鸡坪"))`. A 后勤 post sets p to 0. |
| C10 | **`cang:1` relic flag.** Isle: the migration marks any bag item whose desc contains 「缴获」 as a relic. War: `mwTreaty` writes 「从…缴获（和约让渡）」, and raids write `cang:1`. AI `ADD_ITEM` descs say 缴获 all the time, so the isle heuristic inflates relics, and each relic is worth up to +10% of 展馆 income. | I §3.6, W §7.5 | Only the engine sets `cang`. The one-time migration in `isleNormalize` matches the exact string 「和约让渡」 only. **W2** adds `cang:1` inside `mwTreaty` (isle must not touch mwTreaty). |
| C11 | **Claims (宣称地) stored in `run.estates`.** `openEstate` opens the isle map, with empty build slots, for every estate except 全资折叠空间. `isleSell` and 出让 work on any kind. The 「名下」 prompt line lists estates with an isle-slot count. | W §7.5, Q9 | Store her claims in **`run.gw.claims`** and the museum's in `org.claims`. They never go into `estates`. `incomeOf` gets a `clm` term through the WP0 seam. The ledger row goes through `gwLedgerRows`. |
| C12 | **Ledger (`openLedger`).** Isle rewrites the FACTAB price list into five groups. War adds a 宣称地 income row. Both are in the same function. | I §4.10, W §7.5 | WP0 adds `for (const r9 of gwLedgerRows(run, inc)) rows.push(r9);` after the 营生 row. **I1** owns the price-list line (`Object.entries(FACTAB)`). |
| C13 | **Click delegation (`[data-pwfund]` handler).** Spells adds `data-tlv` / `data-tdel` / redeem buttons. War adds `data-gw*` and `data-raidgo`. These are adjacent lines. | S §8, W §10.1 | WP0 adds `if (spClick(e) \|\| gwClick(e)) return;` at the top of the handler. Each work package handles its own data-attributes inside its own function. |

Smaller alignment items, owned as listed:

- **`warHeat`** (W) feeds isle 袭岛. **`isleBest`, `isleHaul`, `isleScout`, `isleVault`** (I) feed raids. Each consumer guards with `typeof … === "function"`. WP0 stubs make them return 0 or false until the real body lands.
- **Spell locks and scroll learning.** W2 calls the spells-owned `spellLockGrant(run, name, why, addAnnal)` when `所属：` moves her to **安保办**, because canon gives guards 殴打术 with the post (77:2338). The 1994 scroll and 魔女之乱 卷轴 learning is deferred, so `spellFromScroll` is not needed in beta20.
- **展馆 bonus in 授勋 c.** War §5.9 gives +1 for `isleBest(run,"展馆") ≥ 2`. Isle §3.6 marks it optional. **Keep it** (W3).
- **闪灵 flavour text for 袭岛** ("隔壁展馆的人"): the isle code checks `typeof orgOf === "function" && (orgOf(run)||{}).id === "shanling"`.
- **"叠多座不叠效果" vs per-building events** (I §2). Rule: army and global effects take the best level across all isles; income events roll per building. Write that into the code comment.

### 1.2 What would break existing systems or saves

| ID | Problem | Fix |
|---|---|---|
| **I1** | **The isle spec contradicts itself.** §6 test 1 requires a 10-year 年结 on an old save to be byte-identical. But §3.1 rolls 袭岛 on **every** isle with stock "whether or not it has a 哨塔", at .02–.05 a year, on the new r2 stream. Every old save with stocked isles would start losing goods. | 袭岛 rolls only when `warHeat(run) > 0` **or** the isle has a 哨塔 or 兵营. Otherwise it is skipped. Isle Q1 is answered: no raids for players who never fought. |
| I2 | The migration types old type-less facilities ("温泉" → 浴场). That adds candidates to the 破损 pool and shifts the dice from that year on. If the target model hasn't shipped, the facility also turns upgradable while still drawn as bGeneric. | Migrate only to types where `facShipped(type)` is true. Release note: "老档无型号设施会认型号，此后年结骰序会变". |
| I3 | `isleRates` is refactored to iterate `ISLE_GOODS` instead of the hard-coded 粮/畜/药. If iteration or work-allocation order changes, output changes. | Keep the 药＞畜＞粮 order explicitly. Golden test G1. |
| I4 | FACTAB contains types whose model hasn't shipped (the B batch) but still appears in the AI 「型号限」 list, the news whitelist, the 梅网 pool and the ledger. | One predicate, `facShipped(t) = !!(Isle3D.FAC && Isle3D.FAC[t])`, used by `facAvail`, the prompt/news lists, `MEI_FAC_POOL` and the price list. Unshipped types show greyed with 「图纸还在画」. |
| S1 | Removing `opSpell` from OP_SETUP means anything that calls `newRun` and then `OP_SETUP[...]` without going through `Game.start` gets **no kit**. That includes test harnesses (`dnd_test.cjs`, `war_turn.cjs` variants). | `Game.start` always runs `regApply(run, S.reg \|\| regDefault(op, originId), y)`. The test harness helper `b20Start(id)` must call the same path. Update the existing harnesses in the S1 work package. |
| S2 | The canon `ty` overrides change combat in old saves: 缝合伤口 heals, 寒冷之触 drains, 瞬视震荡术 controls, 殴打术 blasts. This is intended, but it is visible. | Docs line, plus golden G4 diffed against an expected-change list. |
| S3 | The longer TALENT list changes `talentByName` substring hits. Story-talent names containing 法术辨识, 精通先攻 and similar now resolve to canon rows. This is intended. | Test: 「天赋：+战斗施法」 resolves to `zhandou`. A name with no canon match still grows a `tg_`. |
| W1 | Any AI 「战役：A馆｜B馆」 line in an existing 2077 run now becomes a `guanzhan`, with weekly 风声. Wars already in progress stay `plain` (W §12.3). | Docs line. Golden G2 (a plain war replay) must be identical. |
| **W2** | **The war only moves when the week number moves.** Weeks advance only through 「日期：」 lines, travel or `turnEnd` (turn mode is off by default). An AI that stays on one day freezes the war: captives are never released and 风声 never decays. | Add `gwTick` to the **end of every `applyStat`**, so travel days count too. After 6 scenes of a live war with no week change, add a `_nudge` asking the AI to advance the date. Add a 「过一周」 button on the war panel that calls `clockAdd(run, 7 − dow)`. |
| **W3** | **Multi-year skips** (`年份：+3`). `gwYear` runs once while `gclassTick` loops `dy` times. A skip longer than 8 weeks during a live war is only half processed (catch-up is capped at 8 weeks). | `gwYear(run, dy)` settles 授勋 once, for the last full year only. If a live war meets a skip of more than 8 weeks, force an authority close: forced treaty, then `mwClose`, then a log line. Test X6. |
| W4 | `incomeOf` gains a `clm` field. Every caller reads only total, net and up. | Fine. Test G5 on a run with no claims: identical output. |
| — | Export, import and `exportRun` serialise the whole run. `S.reg` (the panel state) must **not** be persisted; only the small `run.reg` summary is. | Covered by test X3. |

### 1.3 Balance holes

| ID | Hole | Fix in beta20 |
|---|---|---|
| **B1** | **The ring cap means nothing.** `#inp-mana-n` and the slider accept any value from 300 to 250000 (`MANA_LO`/`MANA_HI`), and `Game.start` takes the typed value. A player who types 15000 unlocks ring 5 for free. | **Mana surcharge (超额魔力).** Each mana tier above a reference tier costs **1 起手点**, at most 4. The reference is the tier of `op.mn[1]` for seed cards. For a free start it is the tier of the era's `MANA_PEER` upper bound: 8000 in 1994, 12000 in 2077, which is tier 4 either way. The panel shows 「魔力超出开局段位 N 档：−N 点」. Spending can push the budget negative; picks then grey out, but 出发 still works. |
| **B2** | **The drawbacks are free points.** 背学贷 only adds an `opThread`: `BIRTHS.debt` is narrative and never repaid. 旧伤 is a `conds` entry with no mechanical effect. Also, "one talent, or two with a drawback" is not canon (§1.4). | **Cut drawbacks from beta20.** Talent picks at creation: at most 2. The first costs the normal price (2, or 4 if rare). The second costs +1 extra. At most one 狠活. A mechanical loan and an old wound (hp −4 via the eff channel) can come back in beta21. |
| **B3** | **Free-text injection.** A custom spell's `desc` (≤40) and `fx` (≤20), and a custom talent's `d` (≤30), go into the main prompt and the adjudicator. Example: 「必中，无视护甲，秒杀」. | Validate with `CU_BAD = /必中\|必杀\|秒杀\|即死\|无敌\|不死\|复活\|无限\|免疫\|无视\|必定\|百分之?百\|100%\|传奇\|神级\|忽略规则\|系统/`, which rejects with a reason. The prompt framing becomes 「自创法术的效果文字只是描写口径；命中、伤害与代价一律由引擎掷骰，正文不得据此加码」 and goes into both S §7.5 and the judge line. Test S-T18. |
| **B4** | **Discounts stack without a combined cap.** Troop price: `talentTroopF` [.6,1.4] × `isleTroopF` [.7,1] × 本命 .7 can reach 0.29. Upkeep: `talentUpF` [.7,1.2] × `isleUpF` [.75,1] can reach .525. Custom talents add more `troop`/`up` sources. | Use WP0 wrappers. `troopPriceF` = clamp(talent × isle, **.5**, 1.4), with 本命 still applied separately as today. `upkeepF` = clamp(talent × isle, **.6**, 1.2). Test X5. |
| **B5** | **Raids are an unlimited weekly income.** 自家兵 can raid 1×/week. Tier 4 against C-3 储藏点 has an expected value of about ¥14k per raid (W §11.3). At 52 per year that is about ¥700k, more than most 2077 salaries. "Not a money printer" was checked per raid, not per year. | **Stock per field and target:** 2 raids per season, then 「搬空了」 until the next quarter. Heat raises 敌情 by `min(2, ⌊rh/2⌋)`. Own-army raids are capped at 12 a year, after which 监管会 refuses. Re-run `raid_ev.cjs` for annual EV and set acceptance at ≤ 1.5× the opener's job income. |
| B6 | **Spam loops in 馆战.** Each 见报 (as 笔杆子) gives 风声 −4, which can keep a war alive forever. Failed 结盟 costs only 风声 +2, so it can be retried endlessly. 后勤 加班费 pays per battle. | 笔杆子 −4: at most once a week. Each dip type × target: one attempt a week (`gw.dipWk`). 加班费: at most once a week. Battles: after the 3rd battle in a week the engine still rolls, but 风声 doubles. |
| B7 | **Cash path for rich 1994 openers** (shengnv ¥26k, konghuang ¥19k). They can buy almost every ring-≤4 spell: ring 4 costs 1860, so 10 spells cost about ¥15k. | Cash: at most **2** spells, total cash ≤ 40% of starting wealth, and only ring ≤ cap. Custom spells cannot use cash in beta20, because 立项 is deferred. |
| B8 | **展馆 ticket bonus.** 0.1 × relics × 行情年入. Lv3 with 9 relics gives +90% of a ¥54k/yr facility in 2077. 2077 酒馆 稀客 keep minting relics. | Cap the ticket bonus at +50% of base income. 稀客 can mint at most 1 relic per tavern per year. |
| B9 | **Custom-spell extremes.** The tier cap allows ring-3 ×4 (cap 5 → 4) and ring-1 control ×4 (tier 4 stun at Lv10). | Allowed, but S-T16 must run **worst-case builds** (§4, S1 acceptance). Failure means the win rate against a peer is more than 10 pp above the best canon kit for the same opener. If it fails, reduce `k` bonuses to +1 at ×4. |
| B10 | 化身巨龙 is ring 3 and pickable for 2 points. | Set `no:1` (answers S Q7). |
| B11 | 简短施法 alias `al` matches any 2-character substring in player text (for example "护甲"). | **Defer `al` to beta21.** 简短施法 keeps only `init+1`. |

### 1.4 Canon check

I re-opened these refs and they hold.

- **Spells:**
  - 94:251 (670 公仑 → one fireball), 94:780 (graduates have just mastered ring 3), 94:654-660, 94:44435-44436 (cost coefficient), 94:89864, 94:89889-89895, 94:92800-92814
  - 77:2207, 77:2303-2308, 77:2336-2338, 77:3269-3270, 77:3282-3287, 77:3853-3856, 77:19282-19289, 77:24295, 77:26060, 77:29640-29641, 77:31499-31502, 77:33252-33256, 77:34756-34757, 77:39882-39894
- **War:**
  - 77:903, 77:10086-10090, 77:16313-16319, 77:32797-32798, 77:32932-32935, 77:33033-33037, 77:33152-33156, 77:33471-33476, 77:33514, 77:33524-33533, 77:33798-33811, 77:33838-33841, 77:37966-37971, 77:38298-38304, 77:44072-44076, 77:44888-44896, 77:45031-45033
  - 94:45248, 94:45362-45372, 94:45427, 94:45439, 94:84300-84305, 94:84345-84346, 94:85601-85604, 94:86204
- **Isle:** 94:28804-28806, 94:45383, 94:46973, 94:83457-83458, 94:37396; 77:2595-2596, 77:8237, 77:9392, 77:27026-27033, 77:32853

**Errors to fix in the specs or the code text:**

| # | Where | Error | Correction |
|---|---|---|---|
| E1 | W §7.1 and §7.3, 私掠委托 | The spec reads it as a *licence the player buys*, after which she fights with her own army (tier 1 if she has none). In canon (94:85601, with 85327 in r_canon94 §4.3), the client pays 门票钱 to **hire witches as escorts and haulers**, and is then protected by the hosts' force. | Rename it **「跟队（私掠委托）」**: pay the ticket and ride with a hired 劫掠队 at **军势档 3**. Her own troops take no losses. Her take is what she hauls: 8% of V, plus any relic at 大捷. It lets small companies and soldier-less characters raid. Deferred with 1994 raids, but still offered in 2077 to a run with no org and no army. |
| E2 | S §3 buxi77, S §4.3 presets | Says "Canon gives the technique no name, so the name is engine wording." 77:15567 names it explicitly (「笔绘速写的手段」). It is also a **technique, not a spell**, but the spec lists it both as a locked spell and as a custom-talent preset. | Drop it from buxi77's spell locks. Keep it as the custom-专长 preset and as buxi77's **locked talent** (`tlock`), with the note 「原著 2077:15567」. |
| E3 | S §4.4 | "Canon: one talent, or two with a drawback (r_canon94 §3)". That bullet is the reader's design suggestion, with no line ref. | Moot, because drawbacks are cut (B2). Any rule about talent limits is labelled 引擎口径. |
| E4 | W §7.3 | 「原著闪灵是 3 级武装（77:32993-32996）」. Those lines define the armament scale, where **1 is best**. 闪灵's own figure («21 个世界、5000 万兵力、3 级科技») is at **77:33015-33016**. 军势档 is 1–6 with high = strong, so it is not the same scale. | Change the ref to 77:33015-33016 and label 「馆里的小队＝军势档 3」 as **引擎口径**. |
| E5 | W Q7 | The 魔女之乱 year was marked unverified. | **Verified:** 94:43782 says 「今年1995年」, and the 魔女之乱 chapter starts at 94:45188 and ends on 7月19日 (94:45439). 1995 plus every three years matches 94:45371-45372. Deferred anyway. |
| E6 | I §3.4 | 冒险者酒馆 needs 5–10 rule-dungeons on the isle (77:2595-2596). The spec drops this silently. | Keep the simplification, but label it 引擎口径 in the docs. |
| E7 | I §0.4 | The "536,933 字节" sync check is a **character** count (the block is 536,558 chars and 570,954 bytes now). | Before running `embed.py`, re-verify with a byte compare against a freshly built `isle3d.js` (I3 step 1). |
| E8 | S/W NPC 小蛋糕 (paiqian77) | The spec says to write her as "成年小个子", but that is only a code comment, so the AI never sees it. | Put it in the NPC note string: 「成年同事，个子小，……」. Content rule: never depict adults as children. |

### 1.5 Scope assessment and cuts

| Area | Spec size | beta20 ships | Deferred (beta21+) |
|---|---|---|---|
| Spells (P250) | ~1.4k lines | 13 kits (`OPENER_SIG`); SPELL_CANON fixes and new rows (35); 15 new 专长 plus the eff channel; resolver `ty`/cap/熟稔; registration block with 已有法术 / 自创法术 / 天赋 / 自创专长; budget + mana surcharge; regApply; locks with 公分 redeem; prompts and judge; migration; 资料库 desc input; talent tab lists `talentX`; 图鉴 price × eraMult (S Q4: yes) | Drawbacks; `al` aliases; 资料库 「改」 custom spell; 立项开发; talent 补录; cash for custom spells; LEARN_TALENT MVU (optional; include only if time) |
| Isle engine (P251a) | ~0.6k | All of spec §4 for 10 types, gated by `facShipped`; 袭岛 gated per I1 | Optional terrain spots (§4.7 last bullet); XWFAC model reuse |
| Isle 3D (P251b) | 10 models, ≈0.5 MB | **A1 (哨塔, 兵营, 停鸡坪) + A2 (酒馆, 浴场, 展馆) required.** B (龙场, 猫舍, 观星台, 防风屏障) is a stretch that ships if it passes audit by the integration cutoff | — |
| War (P252) | ~2k | P1 (B1–B5 fixes, warRoll, registry, org, 3 opener setups, weeks, 馆战 core, dip, treaty v2, authority, 授勋, autumn mobilization, UI); P2 raid **2077 only** (储藏点 / 运输线 / 前哨站; forces 自家 / 馆里小队 / 跟队; claims; retaliation; `warHeat`); 馆内斗 | 决斗/代打 (keep `gw.duel` field reserved); 工厂 target (`jia` permits); 1994 raid targets and scrolls; 魔女之乱; 欧陆外援; other openers' hooks (§8.4); raids through the adjudicator (`op:"劫掠"`; buttons only in beta20) |

**Size.** index.html grows from 3.63 MB to about 4.2 MB. Each new model file is 25–59 kB of source, and spells and war together add about 0.15 MB. Acceptance: ≤ 4.4 MB, and a cold load in Playwright ≤ 1.3× the beta19 baseline (test X9).

**Decisions on the specs' open questions.**

- **Spells:**
  - Q1: canon spells stay uncapped.
  - Q2: budgets stay 6 / 8 / 10, plus the B1 surcharge.
  - Q3: talent 补录 is deferred.
  - Q4: yes.
  - Q5: auto-switch the origin only if the player hasn't touched the origin select (`S._originTouched`).
  - Q7: `no:1`.
- **Isle:** Q1 is answered by I1.
- **War:**
  - Q1: auto-war only for `org.mob=1`. Setup sets 1. Orgs created through `所属：` default to 0.
  - Q2: gclass 1.
  - Q4: buttons only.
  - Q5: 黑森 and 胧月 can sign from `org.y0 + 1`.
  - Q9: claims go in `run.gw.claims`.

### 1.6 Missing tests (added to the work packages below)

- **X1 — all 13 openers end to end.** Start each one with a stubbed `Prov`, play one scene, then advance one year-end. Check:
  - no `pageerror`;
  - the kit equals `OPENER_SIG`;
  - `org` exists only for the 闪灵 two;
  - the prompt builds;
  - the 1994 prompts contain no 2077 spells, 馆战 or 所属 text.
- **X2 — combined old-save fixtures.** Load F1–F4 (WP0). Check:
  - the normalizers run;
  - golden G1 and G2 match (only an allowed diff list may differ);
  - spells are migrated;
  - a beta16 `w.foe:"yushu"` foe gets 势 2.
- **X3 — export/import round trip.** Do it after a run has custom spells, a custom talent, spellLocks, org, gw (with claims) and new facilities. Deep-equal minus volatile fields. `S.reg` must not be in the file.
- **X4 — prompt budget.** `PromptM.buildSystem` length for 5 fixtures, before and after.
  - Idle 2077 闪灵 run: ≤ +900 chars.
  - Same run at war: ≤ +1400.
  - 1994 run with no new features: ≤ +250 (dynamic talent list only).
- **X5 — economy clamps.** 兽语 Lv3 + custom 兵源 −15% + 猫舍 L2 + 本命. Check that `troopPriceF ≥ .5` and `upkeepF ≥ .6`.
- **X6 — time edge cases.**
  - Multi-year skip with a live war, isles and a 宣称地.
  - A skip of more than 8 weeks, which must force an authority close.
  - Turn mode on and off.
  - The era boundary from 2059 to 2060 (facility display names; no guanzhan before 2077).
- **X7 — injection.** `CU_BAD` words in custom spell `desc` / `fx` and custom talent `d` are rejected. The judge system string contains the disclaimer.
- **X8 — layout.** At 1400×900 and 390×844, in both eras, light and dark:
  - the registration block and the picker overlay;
  - five rows of build buttons;
  - 军势页 所属 / 馆战 / 掠夺 / 内斗.

  No horizontal scroll. Screenshots go to scratch.
- **X9 — performance.** File size, cold load time, and FPS on a 大岛 with 8 new Lv3 facilities. Triangles ≤ 9k each, so ≤ 72k for the facilities.
- **X10 — static checks:**
  - SPELL_CANON names are unique and ≤ 10 chars.
  - Every `OPENER_SIG` spell resolves.
  - There is no `opSpell(` inside OP_SETUP.
  - Every `facShipped` type has a FAC registration.
  - **No two MW_KNOWN regexes match the same name.** Run every `nm` and every alias through all the `re`s; for example `/黑山/`, `/国家公园|巨企国家/` and `/死寂|寂静/`.
  - `GW_HALLS` names don't collide with MW_KNOWN.
  - Engine-written war strings contain no 阵亡 / 战死 / 杀死.
- **X11 — content (manual).** The 3D review checks that models show no human figures. A text review checks that minors and small-statured adults are written as adults where they are adults, and that war text never presents people as loot.

---

## 2. Shared contracts (frozen in WP0; owners fill the bodies)

```js
/* P250 spells — owner S1 (S2/S3 extend) */
spNormalize(r)                       // migrations: spellLocks, fx250
spLockLine(run) -> string            // 【未成法术】 prompt line, "" if none
spJudgeLine(run) -> string           // custom-spell line for the adjudicator, "" if none
spClick(e) -> bool                   // 资料库 handlers (redeem, desc, talent rows)
spellLockGrant(run, name, why, addAnnal) -> bool   // learn a locked spell (also used by W2 for 安保办)
talentEffSum(run, key) -> number     // eff channel: init/ac/hp
OPENER_SIG                           // const table, keyed by opener id
/* run.spells[n] new optional fields: nt, cu, s, ty, t, k, ar, el, fx, base ; run.spellLocks ; run.reg */

/* P251 isle — owner I1 */
isleNormalize(r)
facShipped(type) -> bool             // Isle3D.FAC has the type
facAvail(run, es, type) -> {ok, why}
isleBest(run, type) -> lv            // best non-broken level across all isles
isleDef(es) -> 0..4                  // used only inside 袭岛
isleTroopF(run, tid) -> [.7,1]
isleUpF(run, tid) -> [.75,1]
troopCapOf(run, tid) -> int
isleScout(run) -> lv                 // Lv2: 情报 fee ×.5 ; Lv3: 敌情 −1
isleHaul(run) -> 0..1.5              // transport-loss percentage points
isleRelicSlots(run) -> int
isleVault(run) -> bool
isleIntercept(run) -> 0..0.10        // MVP-relic interception chance in transit (C9); W4 sets 0 for 后勤
/* wrappers added in WP0 (clamps): troopPriceF(run, kind, tid), upkeepF(run, tid) */
/* bag item flag: cang:1 (engine-set only) */

/* P252 war — owner W1..W5 */
gwNormalize(r)
orgOf(run) -> org|null
warHeat(run) -> 0..0.12              // feeds isle 袭岛
gwTick(run, addAnnal)                // idempotent per week number; called from applyStat tail and turnEnd
gwYear(run, dy, addAnnal)            // before the gclassTick loop
gwApply(run, stat, addAnnal)         // status keys; after psApply
gwParseKey(k, v, stat) -> bool       // status-line parser hook
gwBlock(run) -> string               // per-turn block (next to psBlock)
gwLastLine(run) -> string            // one-scene 【馆战/掠夺裁定·引擎已定】
gwJudgeLine(run) -> string           // adjudicator text when no 馆战 is live (empty in beta20 except 内斗)
gwPanelHTML(run) -> string           // 军势页 section; calls raidPanelHTML / feudPanelHTML
gwChip(run) -> string                // side-panel chip
gwLedgerRows(run, inc) -> [string]   // 宣称地 row
gwClaimInc(run) -> number            // incomeOf term (1994 base × eraMult already applied)
gwClick(e) -> bool
gwSceneClear(run)                    // clears gw.last when pi is stale (B1 companion)
/* run.org, run.gw (incl. gw.claims), run.mw.kind ∈ {guanzhan, feud, plain}; MW_KNOWN rows gain id/quota/cedes/flip/bloc/allies/enemy/pact/worlds */
```

Every stub in WP0 is behaviour-neutral: it returns `""`, 0, 1, false, `[]` or `TROOP[tid].cap`. Golden tests G1–G5 must stay identical after WP0.

---

## 3. Region ownership map (index.html)

Only the owner edits a region. Other work packages call into it through §2. "New block" means the feature block WP0 creates, with a banner comment. Inside a block, each work package appends below its own sub-banner.

| Region (anchor) | ≈ line | Owner |
|---|---|---|
| CSS `#reg-traits input{…}` and the new `#reg-st` / `.rg-*` / `#rgp-*` rules after it | 179 | S2 |
| HTML `#reg-card` (insert `<details id="reg-st">` after `#reg-traits`) and `#ov-regpick` after `#ov-char` | 2276 / 2363 | S2 |
| `normalizeRun` tail seam | 2993–3110 | WP0 (owners fill their own `*Normalize`) |
| `QWHIS` `PK` map | 3158 | I1 |
| `OPENERS` rows (`setup:` keys only) | 3425–3468 | WP0 (no one else) |
| `incomeOf` | 3976 | WP0 (seam: `gwClaimInc`) |
| `armySortie` (B5 garrison basis, `warRoll` extraction), `meritGain` | 3999–4078 | W1 |
| `pwYear` (dragon egg), `pwApply` | 5415–5460 | I1 (egg only) |
| `polGate` (前途无量) | 5671 | W3 |
| `warAlerts`, `warBoardHTML`, `warLayerCity` | 6065–6140 | W3 |
| `warDrill` | 6083 | I1 |
| `dndEffSum`, `dndHpMax` | 7124–7140 | S1 |
| `dndSpellProfile`, `dndSpellPick`, `dndSpellCost` | 7242–7290 | S1 |
| `dndResolve` (`op`/`to`/`dip` passthrough, parley DC through `gwDipDC`, `mwResolve(…, adj)`) | 7712–8100 | W2 |
| `MW_KNOWN` … `mwPanelHTML` (incl. `mwTreaty` `cang`) | 8257–8380 | W1 (registry, B2) → W2 (rest) |
| **P252 war block** (after `mwPanelHTML`): sub-banners 核心 / 馆战 / UI / 掠夺 / 内斗 | new | W1–W5 |
| `meiMarketRoll` | 10607 | I1 |
| `FACTAB`, `facModelOf`, `TRADE_ALIAS` | 11511–11560 | I1 |
| `POI_KIND` | 11835 | I1 |
| `SPELL_CANON`, `spellCanonOf`, `spellCanonPrice`, `spellModOf` | 12082–12245 | S1 |
| `OP_SETUP`: the three new bodies at the top | 13370+ | W1 |
| `OP_SETUP`: existing entries (`opSpell` deletions, 照明术 → 光亮术 in the 圣火灯 text) | 13372–13600 | S1 |
| `turnEnd` tail seam | 13870 | WP0 |
| `JOBTAB` (`paiqian` row) | 13898–13925 | W1 |
| `TALENT` rows, talent factor functions | 14263–14370 | S1 |
| **P250 spells block** (after `talentSeed`) | new | S1 / S2 / S3 |
| `troopMarket` (tavern rows) | 14538 | I1 |
| `troopPrice`, `armyStat` → wrappers | 14710–14725 | WP0 |
| `ISLE_GOODS` … `isleBlock` (all isle functions) | 15180–15433 | I1 |
| **P251 isle block** (after `isleBlock`, before the P246 comment) | new | I1 |
| **P246 `Isle3D` block** (to `const MapM`) | 15434–23326 | **I3 only, via `embed.py`** |
| `openIsland` `FAC_KIND`; terrain; `dbgS.isle` regex; `islePanel` and build buttons | 23338 / ~25177 / 25654 / 25732–25820 | I1 |
| `PLANE_MARKS` / `marksOf` (`gwMarks`) | 26248–26270 | W4 |
| Prompt: `spellsTxt`, `spellsFull`, persona talent line, 【法术详情】 line | 27633–27693 | S1 |
| Prompt: `mwPromptLine` call (exists), `lastWar` block, new `gwLastLine` element | 27647 / 27657–27663 | W2 (WP0 adds the element) |
| Prompt: new `spLockLine` element after 【法术详情】 | 27693+ | S1 (WP0 adds the element) |
| Status-key table rows: 「战役：」 + new rows (所属 / 馆战) right after it; 「营生：」 | 27745 / 27769 | W2 / W1 |
| Status-key table rows: 「天赋：」, 「法术：」 | 27752 / 27772 | S1 |
| Status-key table row: 「营建：」 | 27778 | I1 |
| Per-turn block (`meiStoryPrompt + polBlock + pwBlock + psBlock`) | 27938 | W2 (adds `+ gwBlock(run)`) |
| Status parser `k === "战役"` (+ `gwParseKey` hook), `k === "日期"` (星期 regex) | 28105 / 28192 | W2 (WP0 adds the hook line) |
| Year-end: seam `gwYear(run, dy, addAnnal);` before the `gclassTick` loop | ≈28472 | WP0 |
| `applyStat` clock apply (`if (stat.clock) {…}`) | 28722 | W2 (星期 alignment) |
| `applyStat` spell branch | ≈29070–29100 | S1 |
| `applyStat` build and upgrade branches (`facAvail` deny) | ≈29020–29060 | I1 |
| `applyStat` tail seam (`gwApply`, then `gwTick`) after `psApply` | 29068 | WP0 |
| MVU `SCHEMA` / `LEARN_SPELL` (ring, school) | 29308 | S1 |
| News parse (`tradeModelOf(seg[0]) \|\| facModelOf`) and the 「型号限：」 whitelist | 29658 / ≈29779 | I1 |
| Adjudicator `mw9` and JSON-spec line | 29918 / 29921 | W2 |
| Adjudicator seam lines `spJudgeLine` and `gwJudgeLine` | between 29921 and 29922 | WP0 (bodies: S1 / W2) |
| `PANEL_FIT`; `panels()` (`gwChip` seam) | 30191 / 30206 | W1 / WP0 |
| `renderArmy` (`gwPanelHTML` seam, cap sites → `troopCapOf`) | 30351+ | WP0 |
| `openLedger` (`gwLedgerRows` seam; FACTAB price-list line) | 30419–30500 | WP0 / I1 |
| `Game.start` | 30551–30640 | S1 |
| Scene cleanup `run.lastMove = null; run.stirNow = "";` (add `run.lastWar = null; gwSceneClear(run);`) | 30799 | WP0 |
| `talentHTML`, `renderDB`, `dbEdit`, `dbDel` | 31864–32330 | S3 |
| Boot: opener cards, origin/birth/year handlers, `regPreview`, `manaReset` | 32495–32600 | S2 |
| Global click delegation (`[data-pwfund]` handler) seam | 33465 | WP0 |
| 使用说明.md, version.json | — | D only (each work package drops a snippet in `scratchpad/b20/docs/`) |

**Merge sanity.** Owned regions sit at least 2 unchanged lines apart, except where WP0 added the seam lines in advance. Git's 3-way merge therefore treats the work packages as non-conflicting hunks in the same file.

---

## 4. Work packages (in order)

Effort is in agent-days. Tests go in `scratchpad/b20/tests/` (Playwright with the global install, `file://@@REPO@@/index.html`, the same skeleton as `scratchpad/war_turn.cjs`). Fixtures go in `scratchpad/b20/fixtures/` and goldens in `scratchpad/b20/golden/`. **Do not** base anything on `scratchpad/mw_test.cjs`; it calls deleted functions.

### WP0 — Baseline, goldens, seams (sequential; blocks everything; 0.5 day)

0. Wait until the agent currently editing index.html has finished. Its md5 must be stable and the orchestrator must confirm. Record the baseline md5 and line count.
1. **Fixtures** (from the untouched baseline):
   - **F1:** a 2077 run with 2 isles holding all 8 old types, plus one type-less facility named 「温泉」.
   - **F2:** a 2077 saibo run with an army, talents (讲价, 兽语), and a P243 `plain` war in progress (from `war_turn.cjs`).
   - **F3:** a 1994 shengnv run with 照明术 `"一晚上不到二十魔力值"` and 法师之手 `420魔力值`.
   - **F4:** a beta16-style save with `w.foe:"yushu"`.

   Export each with `exportRunStr`.
2. **Goldens** (`golden.cjs`, deterministic: fixed `run.id`, `Math.random` stubbed by a seeded PRNG):
   - **G1:** F1 `isleYear` over 10 years. Records `annals`, `es.log`, `wealth`, `store`, `npcs`.
   - **G2:** F2 replay of 4 adjudicated scenes, recording `run.mw`, wealth and the prompt.
   - **G3:** `PromptM.buildSystem` for F1–F3 plus fresh haixuan and saibo.
   - **G4:** `dndSpellProfile(n, {lv:1})` and `(…, {lv:7})` for every SPELL_CANON name.
   - **G5:** `incomeOf`, `armyStat`, and `troopPrice` for every TROOP on F2.
3. **Seams** (see §3, rows marked WP0):
   - three feature blocks with stubs from §2;
   - the `setup:` keys on 3 OPENERS rows;
   - three empty OP_SETUP bodies at the top;
   - the `troopPriceF` / `upkeepF` / `troopCapOf` replacements (4 cap sites plus the `renderArmy` display);
   - the `incomeOf` `clm` term;
   - the prompt elements, judge lines and parser hook;
   - the `applyStat` tail calls, the year-end `gwYear` call and the `turnEnd` `gwTick` call;
   - the scene cleanup;
   - the ledger rows;
   - the `renderArmy` and `panels` hooks;
   - the click delegation hook.
4. **B1 fix** lands here, because it is one line in the WP0 seam: `run.lastWar = null`.

**Acceptance:**

- G1–G5 are byte-identical to the baseline. G2 has no 出阵, so the B1 change cannot show up in it.
- A separate B1 test: after `sortie()`, `lastWar` is injected only in the next scene's prompt and is gone in the scene after.
- There is no `pageerror` at boot or on any of the 13 opener starts.
- `grep -c "P250\|P251\|P252"` shows the three banners.
- The commit is tagged `b20-wp0`.

### Wave 1 (parallel after WP0): S1 · I1 · W1 · I2a · I2b · I2c

#### S1 — Spell data, kits, resolver, application (P250a; 1.5 days)

- **Regions:** S1 rows in §3, plus the P250 block.
- **Contents:**
  - spec_spells §2.1 and §2.2: fixes and 35 new rows; drop `al`.
  - The `SPELL_ALIAS` map, a filtered `spellCanonList`, `spellPrice` (× eraMult; also fix the 图鉴 call site).
  - §2.4 talents: 15 rows, with `jianduan` reduced to `eff:"init+1"`.
  - `OPENER_SIG`, the §2.5 contents moved out of OPENERS, with E2 applied (buxi77: 笔绘速写 becomes a `tlock`).
  - `regDefault`, `regApply`, `spellGateOk`, `regRowOk`, `regTalOk`, `cuNameOk`, `cuCost`, `cuCap`, `cuPts`, `spPtsRing`, `regBudget` (with the B1 surcharge), `regSpent`.
  - `Game.start` changes from §6.1.
  - Resolver changes from §6.2.
  - `applyStat` spell branch from §6.4.
  - MVU `LEARN_SPELL` ring and school.
  - Prompt changes from §7.1–7.6 plus the B3 framing.
  - `spJudgeLine` and `spLockLine`.
  - `spNormalize` from §6.5.
  - `spellLockGrant`.
  - The 照明术 → 光亮术 rename in the shengnv scene and the 圣火灯 text.
  - `化身巨龙 no:1`.
  - `CU_BAD`.
  - Update the old harnesses (`dnd_test.cjs`) to `b20Start`.
- **Acceptance (`t_spells.cjs`):**
  - spec_spells T2, T3, T6 (form-free, via `regApply` with a hand-built reg), T7, T8, T9 (talents 精通先攻 / custom hp+4 / 熟稔), T11, T12 (applyStat path only), T13, T14 (= X2 F3), T16 (balance sim including the B9 worst cases), T17 = X10 spell part.
  - **T18:** a `CU_BAD` desc is rejected.
  - **T19:** the B1 surcharge. The paiqian77 card with mana typed at 16000 gives budget 6 − 3 = 3.
  - **T20:** 「天赋：+战斗施法」 resolves to `zhandou`. An unknown talent still grows a `tg_`.
  - G4 diff equals exactly the expected-change list (the 13 reclassified rows plus the 炎 element).
- **Parallel-safe with:** I1, W1, I2*. No shared regions.

#### I1 — Isle engine for 10 types (P251a; 1.5 days)

- **Regions:** I1 rows in §3, plus the P251 block.
- **Contents:**
  - spec_isle §4.1–4.10, with these amendments:
    - `facShipped` gating everywhere (I2, I4);
    - 袭岛 gated per I1;
    - C7: no `raidTick` handling;
    - C8: `isleScout` semantics;
    - C9: the interception formula is exported as `isleIntercept(run)` for W4;
    - C10: no 「缴获」 heuristic;
    - B8 caps.
  - 观星台 吉星 writes `run.market` only if no better entry exists.
  - Fill the WP0 stubs `isleTroopF`, `isleUpF`, `troopCapOf`, `isleDef`, `isleBest`, `isleHaul`, `isleScout`, `isleRelicSlots`, `isleVault`.
  - Build buttons: five category rows.
  - Fill `QWHIS.PK` and `POI_KIND`.
  - 账房 price list in five rows.
  - Docs snippet.
- **Acceptance (`t_isle.cjs`):**
  - spec_isle §6 tests 1–6 and 8.
  - **Test 1 = G1 identical**: no new facilities and no `warHeat`, so the run never touches r2.
  - With `warHeat` stubbed to .06 and no 哨塔/兵营, 袭岛 still rolls; with `warHeat` 0 it does not.
  - Alias table: 10 cases plus 「守望塔」 into XWFAC.
  - `facAvail` refuses an unshipped type with 「图纸还在画」, in the UI, the status line and the 梅网 pool.
  - B8 cap.
  - X5 clamps.
  - G5 identical when no new facilities are present.
- **Parallel-safe with:** S1, W1, I2*.

#### W1 — War foundation (P252a; 1 day)

- **Regions:** W1 rows in §3, plus the P252 block's 核心 sub-banner.
- **Contents:**
  - B2 (`/死寂|寂静/`), B5 (garrison basis), and the `warRoll` extraction (with `armySortie` behaviour unchanged).
  - MW_KNOWN in-place field extension plus 9 new rows (spec_war §5.1), `GW_HALLS`, `gwFoeFill`.
  - `run.org` and `orgOf`.
  - The three OP_SETUP bodies: linshigong77 and paiqian77 from spec_war §4.2, with the E8 note text; buxi77 from spec_spells §6.3.
  - `JOBTAB.paiqian`.
  - The 「营生：」 row (now 4 门).
  - PANEL_FIT for linshigong77, paiqian77 and buxi77.
  - `gwNormalize` (sets `wk` to the current week number on first fill).
  - `gwDayNo`, `gwDow`, `gwWeekNo`, `gwSetDow`.
  - `gwTick` skeleton: release captives, decay, quarter mail, autumn mail. It must be idempotent per week and cap catch-up at 8 weeks (W3 rule).
- **Acceptance (`t_war.cjs` part 1):**
  - spec_war §13 test 1. The opener org, job, gclass and dow are correct. The 军势页 shows nothing extra yet, because the stubs are empty.
  - Test 22 (= G2 after WP0) still identical with `warRoll`.
  - Test 23 (F4 yushu).
  - B5 unit test: a garrison of 6 out of 10 佣兵 means sortie losses are computed on 4.
  - Static X10: MW_KNOWN regexes are unique.
- **Parallel-safe with:** S1, I1, I2*.

#### I2a / I2b / I2c — 3D models in scratch (P251b; ~1.5 days each)

- **Batches:** I2a covers 哨塔, 兵营, 停鸡坪 (`watchtower.js`, `barracks.js`, `landing.js`). I2b covers 酒馆, 浴场, 展馆. I2c covers 龙场, 猫舍, 观星台, 防风屏障 (stretch).
- **Regions:** `scratchpad/i3d/models/*.js` and `review/` only. **No index.html edits.**
- **Contents:** spec_isle §3 3D sections and §5.1–5.3. The audit script changes (§5.3) happen once, in I2a, first. I2b and I2c start from the updated `audit.cjs`. Shared helpers (`catBall`, `griffin`, dragon poses) are copied per file, as the spec requires.
- **Acceptance:**
  - spec_isle §5.2 items 1–7 for every type × 2 eras × 3 levels. `audit.cjs` passes, and SAT-EMIT shows only the three allowed colours.
  - Showroom shots: 4 per type (94 and 77, 午 and 夜).
  - `rv2.sh` mixed-isle shots.
  - Manual review: silhouette distinct from the 8 existing types (§2.1 table); no human figures; damage markers unobstructed.

### Wave 2: S2 · S3 (after S1) · W2 (after W1) · I2* continuing

#### S2 — Registration panel 「法术 · 天赋」 (P250b; 1.5 days)

- **Regions:** CSS, HTML, `#ov-regpick`, Boot reg handlers, plus the P250 block's panel sub-banner.
- **Contents:**
  - spec_spells §4.1–4.3 and §4.5, with these amendments:
    - no drawbacks block (B2), so `#reg-db` holds only the surcharge hint;
    - talent picks ≤ 2, the second at +1;
    - the B1 surcharge shown in the 起手点 header;
    - the B7 cash limits;
    - the Q5 origin auto-switch guard;
    - the custom-spell form without the alias field;
    - `CU_BAD` validation in the form.
  - `regPreview` shows the seed Lv chips.
  - `regFinal` confirm.
- **Acceptance (`t_panel.cjs`):**
  - spec_spells T1, T4, T5 (without the 学贷 parts; replaced by "the 3rd talent pick is disabled"), T6 through the UI, T10, T15 (= X8 panel part).
  - **T21:** clicking each of the 13 cards and then 出发 gives a kit equal to S1's `regDefault`.
  - **T22:** after a year change from 2077 to 1994 with the saibo card, the 2077 rows turn red and are dropped at 出发, with a toast.
- **Parallel-safe with:** S3 and W2. Its regions are disjoint from S3's: S3 is the 资料库, S2 is the creation screen.

#### S3 — 资料库 additions (P250c; 0.5 day)

- **Regions:** `talentHTML`, `renderDB`, `dbEdit`, `dbDel`, `spClick` body.
- **Contents:**
  - spec_spells §8.1 minus 「改」 and 立项, keeping the desc input, the tags, the locked rows and the 公分 / 元 redeem.
  - §8.2 grouping, including the 「剧情与自创」 group listing `talentX`, the Lv select, 删 (logged as 手录) and the 熟稔 spell select. No 补录.
- **Acceptance:**
  - spec_spells T12 (the 资料库 redeem path).
  - Talents grown from story appear in the talent tab.
  - Deleting a talent logs a 手录 chron line.

#### W2 — 馆战 core (P252b; 2 days)

- **Regions:** W2 rows in §3, plus the 馆战 sub-banner.
- **Contents:**
  - spec_war §5.2–5.8 (no duel; `champ` kept for flavour).
  - `gwKindOf` and `gwCbOf`.
  - `mwStart` opts and kind dispatch.
  - `gwEff`.
  - The `mwBattle` v2 bands and side effects.
  - `gwDipDC` and `gwDip` (with B6 limits).
  - `mwTreaty` v2 (B3 and B4 fixes, `cang`).
  - The `mwAfterFight` captive handling.
  - Authority wind `gw.ju` with its thresholds, the forced treaty and the truce.
  - `gwPetition`.
  - `gwApply` for 「所属：」 and 「馆战：角色｜」: an `org.unit` move to 安保办 calls `spellLockGrant(run,"殴打术",…)`.
  - Date-line 星期 parsing and clock alignment.
  - The W2-risk stall nudge.
  - `mwPromptLine` v2, `gwBlock`, `gwLastLine`, `gwSceneClear`.
  - Status-table rows 所属 and 馆战 (no 决斗 or 参战 rows).
  - The adjudicator `mw9` text and the JSON `op` / `to` / `dip` fields.
  - The `dndResolve` dispatch (no raid branch; buttons only).
  - An empty `gwKindHandlers = { feud: null }` table that `mwBattle`, `mwTreaty` and `gwTick` consult for non-guanzhan kinds. W5 fills it, so W5 never edits W2's functions.
- **Acceptance (`t_war.cjs` part 2):**
  - spec_war §13 tests 2–11 and 13.
  - Test 22 (plain replay identical).
  - Test 24 (prompt text, no killing words).
  - **B6 tests:** a second 结盟 attempt in the same week is refused, and a second 笔杆子 −4 in the same week does not apply.
  - **Stall test:** 6 scenes with no date produce the nudge.
  - **Week-tick idempotence:** two `applyStat` calls in the same week tick once.
  - The `gw_sim.cjs` port on the real functions lands in the §11.2 acceptance bands: default P(≥1 quota) in [.5, .75], intervention in [.25, .5], mean weeks in [3, 5].
- **Parallel-safe with:** S2, S3 and I2*. Not with W3 or W4, which depend on it.

### Wave 3: W3 · W4 · W5 (after W2) · I3 prep

#### W3 — War UI, year-end 授勋, autumn mobilization (P252c; 1.5 days)

- **Regions:**
  - the P252 UI sub-banner (`gwPanelHTML` skeleton with `raidPanelHTML` and `feudPanelHTML` stubs, `gwChip`, `gwClick` dispatch, the 「过一周」 button);
  - `mwPanelHTML` v2;
  - `warAlerts` and `warLayerCity` lines;
  - `polGate` (前途无量);
  - `gwYear` (§5.9, with the W3 multi-year rule);
  - `gwAutoWar`.
- **Acceptance:**
  - spec_war tests 12, 14 and 25.
  - X6: a multi-year skip with a live war leads to a forced close.
  - 授勋 with `isleBest("展馆") ≥ 2` adds +1 to c.
  - Mobile: the 所属 and 馆战 sections at 390 px have no horizontal scroll.

#### W4 — 掠夺 (2077) (P252d; 1.5 days)

- **Regions:** the P252 掠夺 sub-banner (`raidFields`, `raidTargets`, `raidGo`, `raidPanelHTML`, `gwRetaliate`, `warHeat`, `gwClaimInc`, `gwLedgerRows`, `gwMarks`), plus `PLANE_MARKS` / `marksOf`.
- **Contents:**
  - spec_war §7 for 2077, with these amendments:
    - targets 储藏点, 运输线 and 前哨站 only;
    - forces: 自家, 馆里小队, and 跟队 (E1);
    - B5 stock, heat and annual cap;
    - C7 retaliation order (no isles);
    - C9 `isleIntercept`;
    - claims in `gw.claims` (C11).
  - `isleScout` semantics per C8.
- **Acceptance:**
  - spec_war tests 16–19, adapted: no 1994, and claims are checked in `gw.claims` and `incomeOf().clm`.
  - **B5:** a 3rd raid on the same field and target in one quarter is refused with 「搬空了」, and the 13th own-army raid in a year is refused.
  - **`raid_ev.cjs` annual EV:** with weekly raiding at tier 4, net annual raid income ≤ 1.5× jobPay for zhanmo77's best job.
  - Retaliation never touches `run.estates` of kind 空岛.
  - With I1 merged, `warHeat` > 0 makes isle 袭岛 possible.
- **Parallel-safe with:** W3 (different sub-banners; W3 only *calls* `raidPanelHTML`) and W5.

#### W5 — 馆内斗 (P252e; 0.5 day)

- **Regions:** the P252 内斗 sub-banner (`feudPanelHTML`, the `kind:"feud"` branches in the shared helpers, written as new functions called from W2's dispatch through a `gwKindHandlers.feud` table that W2 leaves empty).
- **Contents:**
  - spec_war §6.
  - Owning 防御邪恶 or 防护负能量侵袭 cancels the 「被诅咒」 effect of a 溃败, which is the spells cross-hook (77:3282-3287).
- **Acceptance:**
  - spec_war test 15.
  - A 馆战 starting mutes the 内斗.
  - The quarter limit holds.
  - Heat 60 leads to a fine plus 罚酒三杯.
  - The ward spell blocks the curse.

### Wave 4: integration and release (sequential)

#### I3 — Embed 3D and visual review (0.5 day)

1. Wait until all index.html merges for this wave are done. No other agent may be editing.
2. Rebuild `isle3d.js` with `embed.py --build-only`; the flag is added in I2a. Byte-compare it against index.html's P246 block (E7).
3. Run `embed.py` and commit.
4. In the real page, open 我的空岛 and play through every new type. `facShipped` must be true for A1 and A2, and for B only if it passed.
5. Fix the `i3d/geo.js` header comment (「八种」 → 「十八种」), then re-embed.

**Acceptance:** spec_isle §6 test 7; X9; isle probe items (§6.8).

#### X1 — Cross-feature regression (0.5 day)

Run all suites: S, panel, isle, war, plus X1–X11 and the goldens with the allowed-diff lists. Fix anything found **in the owning work package's region**.

**Acceptance:** everything green; screenshots reviewed.

#### D — Docs and release (0.5 day)

- **使用说明.md:**
  - New section 「这一版改了什么（P250 – P252）」, assembled from the per-work-package snippets: spec_spells §11 minus the drawbacks and aliases; spec_isle §4.11; spec_war §14.15 minus 魔女之乱.
  - Update the old line-11 and line-577 statements (spec_isle §4.11).
  - Add the saves notes: S2 classification changes; I2 type migration; W1 new 馆战 behaviour; 赔款 now goes to the museum's account.
  - Update the test-count line.
- **version.json:** set to beta20 with a one-line note. It still says beta18 even though the commits say beta19; fix it during the release.
- Build the zip the way previous releases did.

---

## 5. Schedule and merge protocol

```
WP0 ──► ┌ S1 ──► ┬ S2 ─┐
        │        └ S3 ─┤
        ├ I1 ──────────┤
        ├ W1 ──► W2 ──►┼ W3 ┐
        │              ├ W4 ┤
        │              └ W5 ┤
        └ I2a/I2b/I2c (scratch only, from WP0 on) ──────────────► I3 ──► X1 ──► D
```

- **Branches.** In the implementation phase, if the orchestrator permits git, each work package works on its own branch or worktree cut from `b20-wp0`. The integrator merges in this order: S1, I1, W1, S2, S3, W2, W3, W4, W5, then I3 (embed), X1, D. After **every** merge the integrator runs `golden.cjs` and the suites already merged. Merge conflicts should not happen under §3. If one does, the region map was violated, and the later work package re-does its edit on top of the merged result.
- **Without worktrees.** Run only the 3D batches (I2*) and the simulation tools in parallel. Run the index.html work packages one at a time in the order above. In each Edit, use the anchor strings from §3, never line numbers.
- **Critical path:** WP0 (0.5) → W1 (1) → W2 (2) → W3/W4 (1.5) → I3 (0.5) → X1 (0.5) → D (0.5), about **6.5 agent-days**. Spells and isle fit inside that window.
- **Cutoff rule.** Any 3D batch that fails audit at I3 time stays unbuildable via `facShipped` and moves to beta20.1. Nothing else changes, because the engine gating already handles it.
