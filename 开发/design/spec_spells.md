# spec_spells: opener signature spells, and spells / custom spells / talents in the 登记表

Status: design only, written in the read-only phase. No repo file was touched.
Tag: **P250 (tentative; renumber when the three beta20 specs are merged)**.

**Line numbers.** All line numbers point at `@@REPO@@/index.html` as it stood when I wrote this (38380 lines, md5 `ecd5a9bb6957dbf6c3a4b0da4d4895e5`). That is about 10 lines further on than the reader notes from 7228 onwards. Another agent is editing the file, so grep the anchor name given next to each number.

**Canon references.** `94:N` means line N of `全民魔女1994.txt` (traditional characters). `77:N` means line N of `是，伟大魔女2077.txt`. I re-checked every reference marked ✓ against the text. Descriptions in this spec are my own paraphrases; nothing is copied from the novels.

**Reader notes used:** r_spells.md, r_canon94.md, r_canon77.md (section D), and r_war.md (sections 13.1 and 4.4 for the 闪灵 opener setups).

---

## 0. Decisions in one screen

1. **One declarative kit per opener.** Each `OPENERS` row gets a `sig` object holding spells with Lv and a usage note, locked spells with their unlock route, one signature talent, an optional suggested origin, a point budget, and haixuan's 职业方向 choice.
   - `sig` is used in three places: the 登记表 prefill, `regPreview`, and `Game.start()`.
   - Every `opSpell(...)` call is removed from `OP_SETUP`.
   - The three openers that have no setup (linshigong77, paiqian77, buxi77) get real kits this way.
   - Section 3 has the full table and section 2.5 has the code.
2. **Thirteen existing `SPELL_CANON` rows get type or ring fixes, about 23 more get flags, and 35 rows are added.**
   - New optional row fields:
     - `ty`: the resolver type, overriding the regex classifier.
     - `q`: gate.
     - `x`: not a spell.
     - `no`: cannot be picked or bought.
   - This fixes the misclassifications listed in r_spells §6:
     - 缝合伤口 → heal
     - 修复死灵, 法师之手, 保密之语, 隐形仆役, 召唤印记, 喵嗷之爪 → ritual
     - 加速术 → foresee
     - 瞬视震荡术 → control
     - 殴打术 → blast
     - the 炎爆术 element
   - It also fixes the era leak in shixun (殴打术 in 1995).
3. **A new block on the 登记表, 「法术 · 天赋」, sits between `#reg-traits` and `#reg-preview`.** It contains:
   - The prefilled rows: the origin spell and talent, plus the seed kit.
   - 「＋已有法术」: pick from SPELL_CANON, filtered by era, ring cap and gates.
   - 「＋自创法术」: a form for school, type, ring, element, single or group target, cost coefficient and the 法术降级 trade. The engine derives cost and power caps from these.
   - 「＋天赋」: pick from TALENT, which gains a 专长 category with 15 rows.
   - 「＋自创专长」: one bounded effect.
   - Two optional drawbacks that each buy a point.
   - Everything is paid for in **起手点**:
     - 6 for a seed, 8 for haixuan, 10 for a free start.
     - Canon spells can also be paid for from the starting money.
4. **Mana sets a ring cap**, using the existing `manaTierIdx`:
   - below 900 公仑 → ring 1
   - below 1500 → ring 2
   - below 5000 → ring 3 (canon: a fresh graduate has "just mastered ring 3", 94:780 ✓)
   - below 15000 → ring 4
   - and so on up to ring 8
   - Legendary rows are never available at creation.
5. **Custom spells are first-class for the resolver.**
   - Each one stores `cu:1, s, ty, t, k, ar, el, fx`.
   - `dndSpellProfile` honours `ty` before its regex chain.
   - Power tier is capped by ring (`RING_TIER_CAP`).
   - Cost is written as a real "N魔力值" string, so `dndSpellCost` and the easy-mode halving need no change.
   - The AI may level a custom spell, but may not rewrite its cost, range or effect.
6. **Talents get an `eff` channel** (`init±n`, `ac±n`, `hp±n`), summed into `dndEffSum`. They also get `fam`, so 法术熟稔 halves the cost of one chosen spell, and `al`, so 简短施法 allows spell aliases (77:19282-19289 ✓).
7. **Save-safe.** Every new field is optional. normalizeRun adds two cost migrations and `spellLocks`. Old saves keep their spells exactly as they are.

---

## 1. Canon rules this design encodes (short)

| Rule | Engine use | Ref |
|---|---|---|
| Eight schools plus 通用. 仪式 and 符文 are crafts (carriers) rather than schools. Witches usually specialise in three schools | School list in the custom-spell form. 通用 maps to `ritual` | 77:3274-3281 ✓, 94:20614 ✓, 94:25853 ✓ |
| A ring's standard cost times a 魔力消耗系数 | `k` in the custom form (×1, ×2, ×4). The canon examples are ×3.5 and ×4.6 | 94:44435-44436 ✓; SPELL_CANON rows 水泉迸发 and 灰尘鲁莽挥击 |
| Some low-ring spells overperform their ring (闪光尘, 加速术) | A high `k` buys +1 or +2 to the power cap of a custom spell | 94:56475 ✓ |
| Inventing from scratch is far harder than reskinning an existing spell | Custom spell: variant costs +1 point, from scratch +2 | 94:89864 ✓, 94:13141-13146 ✓ |
| 法术降级: give up power or range to buy a special effect | Tick `fx` and write one line: power cap −1, the effect goes to the AI | 94:89889-89895 ✓ |
| Development is expensive; get investors or official backing | Money path is 3× the 图鉴 price. Investors are a phase-B hook | 94:90634-90643 ✓ |
| A modified spell must get a new name, and names may not be shortened; only witches with 简短施法 may alias | Name validation; the `al` alias needs the 简短施法 talent | 77:19282-19289 ✓ |
| The 法术三权 (use, copy, distribute) | Note text on 瞬视震荡术 (saibo: use right only) | 77:4735-4756 ✓ |
| 公分 can be exchanged for spells; some posts issue spells with the job (a guard gets 殴打术) | Locked-spell unlock with `gf` (公分 price) | 77:2336-2338 ✓ |
| Talents (专长) are body evolution that takes months or years to train | Limit picks at creation (one, two with a drawback). 资料库 additions are logged as 手录 | 94:92800-92814 ✓ |
| A 2077 enhancement shot gives 【奇物使用者】【法术辨识】【披甲施法者】 | New 专长 rows | 77:2207 ✓ |
| League card feats: 战斗施法, 移动施法, 精通先攻 | New 专长 rows | 77:24295 ✓ |
| 670 公仑 is about one fireball; graduates have just mastered ring 3 | Ring cap by mana tier | 94:251 ✓, 94:780 ✓ |

---

## 2. Data

### 2.1 Fixes to existing `SPELL_CANON` rows (12081-12233)

Add only the fields named. The resolver reads `ty` (section 6.2).

| row (n) | now | change | why / ref |
|---|---|---|---|
| 法师之手 | t0 · s 符文 · c 420 | `s:"变化", c:"10魔力值", ty:"ritual"` | A ring-0 变化 cantrip (94:8652 ✓, 94:12586 ✓). As 符文 it gets +1 weapon die, and 420 is not a cantrip's cost |
| 解除魔法 | t0 | `t:3` | "3級，解除魔法" (94:655 ✓). The row's own description says ring 3 |
| 闪光尘 | t4 | `t:2, ty:"mirage"` | Ring 2 (94:654 ✓). Blinding fits mirage, which gives enemy attacks disadvantage |
| 加速术 | regex → ritual | `ty:"foresee"` | A haste buff that overperforms its ring (94:56475 ✓) |
| 缝合伤口 | 死灵 → drain | `ty:"heal"` | Cleans and sutures a wound (94:12959 ✓) |
| 修复死灵 | 死灵 → drain | `ty:"ritual"` | Restores an object's durability (94:12958 ✓) |
| 保密之语 | 咒法 → summon | `ty:"ritual"` | A custody lock (94:11694 ✓) |
| 隐形仆役 | regex 隐 → mirage | `ty:"ritual"` | An unseen helper (94:1419 ✓) |
| 召唤印记 | summon | `ty:"ritual"` | Marks items for recall (94:3618 ✓) |
| 喵嗷之爪 | regex 召唤 → summon | `ty:"ritual"` | Carries cargo only (94:58671-58673 ✓) |
| 寒冷之触 | regex 冻结 → control | `ty:"drain"` | A ring-1 死灵 touch (94:12586 ✓). Control for two rounds is too strong for ring 1 |
| 瞬视震荡术 | 塑能 → blast | `ty:"control"` | Blinds and deafens; a target hit by both loses balance (77:3854 ✓) |
| 殴打术 | 咒法 → summon | `ty:"blast"` | One club strike (77:2310 ✓, 77:2336 ✓) |
| t0 rows with an unknown ring and cost 420: 热波吐息, 化身仪式术, 镜像术, 天神下凡, 狂热祝福, 天幕防护魔法 | t0 | `t:3` | "Unknown ring" is priced as ring 3, which matches their 420 cost. Otherwise they cost 1 point and 260 元 in the 图鉴 |
| 法术派系分类, 变化学派, 具体法术实例, 传奇魔法, 法术专长, 死灵术, 变龙, 炎爆 | — | `x:1` | Concept rows or duplicates (r_spells §4). Hidden from the picker and the 图鉴 |
| 永结眼, 预言仙术, 死魔法位面的魔力之种卷轴, 群体魅惑怪物, 呼唤神的异化之力, 猫越多，猫越强！, 巨型猫的终极抱摔术 | — | `no:1` | Innate traits, scrolls, delisted spells, creature abilities, and 预言仙术, which only 仙人魔女 may use (94:98208 ✓). They can still come up in the story |
| 巨猫过滤施法 | — | `q:"o:maodeng"` | Needs a 巨猫灯 |
| 灵能 | — | `q:"t:lingneng"` | Needs the awakening talent (94:14744 ✓) |

**Element fix in `dndSpellProfile`:** add 炎 to the element regex and map it to 火. This handles 炎爆术 without a data change.

### 2.2 New `SPELL_CANON` rows (append before `];` at 12233)

These keep the existing key set. Every description is my own paraphrase. `ty` is set on every new row, so classification never depends on keyword luck.

```js
  /* P250 开局特色法术与登记表用：原著有名、正典表里缺的（说明为转述，不搬原文；环位标「引擎口径」的原著没写） */
  {"n":"魔法飞弹","t":1,"g":0,"s":"塑能","c":"120魔力值","r":"百步内","d":"人人会的基础飞弹，几发齐射，稳而不花","e":"","u":"级","ty":"blast"},            // 94:4033 94:4167 77:15659-15661
  {"n":"法师护甲","t":1,"g":0,"s":"防护","c":"120魔力值","r":"自身","d":"贴身一层护体光，魔女出门常备","e":"","u":"级","ty":"ward"},                        // 94:4174-4180 77:4733；1 环见 dndAC 注
  {"n":"光亮术","t":0,"g":0,"s":"","c":"20魔力值","r":"一盏灯","d":"一团暖光，熟手能捏形状、调明暗","e":"","u":"级","ty":"ritual"},                       // 94:92817-92827 94:47506 94:47630
  {"n":"清洁术","t":0,"g":0,"s":"","c":"10魔力值","r":"自身","d":"魔女最常用的那门：洗、理、收拾","e":"","u":"级","ty":"ritual"},                          // 94:8971 94:18018
  {"n":"抄写术","t":0,"g":0,"s":"变化","c":"10魔力值","r":"一页纸","d":"照着抄，一字不差","e":"","u":"级","ty":"ritual"},                                 // 94:8652 94:12586
  {"n":"传讯术","t":1,"g":0,"s":"变化","c":"120魔力值","r":"一封信的路程","d":"把一段话送到认得的人那里","e":"","u":"级","ty":"ritual"},                    // 94:2535 94:12586
  {"n":"造水术","t":1,"g":0,"s":"","c":"120魔力值","r":"十步内","d":"凭空出一捧能喝的清水；隔远了容易浇自己一身","e":"","u":"级","ty":"ritual"},          // 94:1086 94:2892 94:23598-23614（环位引擎口径）
  {"n":"面包术","t":1,"g":0,"s":"","c":"120魔力值","r":"自身","d":"饿了变一块面包，出远门的老三样之一","e":"","u":"级","ty":"ritual"},                     // 94:1086 94:2892 94:19590（环位引擎口径）
  {"n":"次元跳跃","t":2,"g":0,"s":"","c":"260魔力值","r":"十步内","d":"一闪挪开几步，挣脱缠缚的便宜办法","e":"","u":"级","ty":"mirage"},                  // 94:654-657
  {"n":"魔法警报","t":2,"g":0,"s":"防护","c":"260魔力值","r":"一间屋","d":"有东西闯进来就响，还能录一段声音","e":"","u":"级","ty":"ritual"},                // 94:2536
  {"n":"掠夺光环","t":1,"g":0,"s":"死灵","c":"120魔力值","r":"自身","d":"对已倒地的对手补一下；变种上百","e":"","u":"级","ty":"drain"},                     // 94:13141-13146
  {"n":"飞行术","t":3,"g":0,"s":"变化","c":"420魔力值","r":"自身","d":"配方到处有，魔药材料难凑","e":"","u":"级","ty":"ritual"},                           // 94:777-780（环位引擎口径）
  {"n":"料理术","t":1,"g":0,"s":"","c":"120魔力值","r":"一口锅","d":"和厨师之手一路的灶台法术","e":"","u":"级","ty":"ritual"},                            // 94:7785（环位引擎口径）
  {"n":"创造闪光猫灯","t":3,"g":0,"s":"","c":"420魔力值","r":"十步内","d":"几只发光猫灯飘起来，旁人心情跟着变好","e":"","u":"级","ty":"ritual","q":"o:maodeng"},   // 94:36776-36780
  {"n":"召唤猫灯","t":4,"g":0,"s":"咒法","c":"700魔力值","r":"十步内","d":"猫魔女要学很久，有灯芯能快些","e":"","u":"级","ty":"summon","q":"o:maodeng"},       // 94:54198
  {"n":"聚灵术","t":4,"g":0,"s":"死灵","c":"700魔力值","r":"十步内","d":"让遗骸起身成兵","e":"","u":"级","ty":"summon"},                                    // 94:36617
  {"n":"抵御幽灵","t":6,"g":0,"s":"防护","c":"1800魔力值","r":"十步内","d":"挡幽灵与怨灵的结界","e":"","u":"级","ty":"ward"},                               // 94:23024
  {"n":"偏移力场","t":5,"g":0,"s":"","c":"1100魔力值","r":"自身","d":"灵能护盾：极快、极费魔；挡酸挡箭，挡不住动量大的法术","e":"","u":"级","ty":"ward","q":"t:lingneng"},   // 94:14760-14761
  {"n":"活化绳","t":1,"g":0,"s":"变化","c":"120魔力值","r":"十步内","d":"让一段绳子活过来听话：捆、绊、递东西","e":"","u":"级","ty":"control"},               // 77:2303-2304 94:8971
  {"n":"油腻术","t":1,"g":0,"s":"咒法","c":"120魔力值","r":"十步内","d":"地上抹开一层魔法油脂，谁踩谁倒","e":"","u":"级","ty":"control"},                   // 77:2306-2308 77:3834 94:37045
  {"n":"治愈魔女术","t":1,"g":0,"s":"","c":"120魔力值","r":"自身或触及","d":"特殊 1 环：激发魔女自己的愈合力，不算治疗术","e":"y2077","u":"环","ty":"heal"},    // 77:29640-29641
  {"n":"偏转术","t":2,"g":0,"s":"防护","c":"260魔力值","r":"自身","d":"一面偏开法术射击的盾，专对快速射击","e":"y2077","u":"环","ty":"ward"},               // 77:31499-31500
  {"n":"艾琳的闪耀之鳞","t":2,"g":0,"s":"防护","c":"260魔力值","r":"自身","d":"一身金闪闪的幻鳞，防御见涨","e":"y2077","u":"环","ty":"ward"},                 // 77:31501-31502
  {"n":"通晓语言恒定领域","t":2,"g":0,"s":"预言","c":"260魔力值","r":"一片区域","d":"领域里语言互通；有的世界会失效","e":"y2077","u":"环","ty":"ritual"},          // 77:34756-34757 77:25570
  {"n":"防御邪恶","t":2,"g":0,"s":"仪式","c":"260魔力值","r":"自身","d":"仪式术，网上有通用模板；魔女内战必备","e":"y2077","u":"环","ty":"ward"},             // 77:3282-3287
  {"n":"防护负能量侵袭","t":2,"g":0,"s":"仪式","c":"260魔力值","r":"自身","d":"挡法术里夹带的那点负能量；和防御邪恶配对","e":"y2077","u":"环","ty":"ward"},       // 77:3282-3287
  {"n":"侦测魔女天赋","t":0,"g":0,"s":"","c":"120魔力值","r":"一人","d":"通用法术：测出最擅长的学派","e":"y2077","u":"环","ty":"ritual"},                   // 77:3838-3847
  {"n":"掌心雷","t":2,"g":0,"s":"塑能","c":"260魔力值","r":"十步内","d":"掌心放出一记雷","e":"y2077","u":"环","ty":"blast"},                                   // 77:20897
  {"n":"重力雨点","t":4,"g":0,"s":"咒法","c":"700魔力值","r":"十步内","d":"把重力凝成雨点砸遍护盾，破盾","e":"y2077","u":"环","ty":"blast"},                 // 77:39882-39883
  {"n":"气压屏障","t":4,"g":0,"s":"防护","c":"700魔力值","r":"自身","d":"高密度气压的护壁，神秘度要求高的世界也能用","e":"y2077","u":"环","ty":"ward"},      // 77:39878-39879
  {"n":"正面反魔立场","t":5,"g":0,"s":"","c":"1100魔力值","r":"自身","d":"单面的万能法术屏障，只挡一边","e":"y2077","u":"环","ty":"ward"},                   // 77:39893-39900（环位引擎口径）
  {"n":"瞬发·冰墙术","t":4,"g":0,"s":"塑能","c":"700魔力值","r":"十步内","d":"立起一面冰墙或一座冰穹","e":"y2077","u":"环","ty":"ward"},                     // 77:13385-13386
  {"n":"次级钢铁守护结界","t":6,"g":0,"s":"防护","c":"1800魔力值","r":"一片保护区","d":"摔碎玻璃小盾牌触发，专挡凡人的金属兵器","e":"y2077","u":"环","ty":"ward"},   // 77:33252-33256（6 环）
  {"n":"超次元防护邪恶","t":5,"g":0,"s":"防护","c":"1100魔力值","r":"一片结界","d":"驱魔加大结界，挡高威力的黑魔法","e":"y2077","u":"环","ty":"ward"},           // 77:33246-33247
  {"n":"水疗术","t":2,"g":0,"s":"","c":"260魔力值","r":"触及","d":"靠贝壳龙因子学会的疗伤法术","e":"y2077","u":"环","ty":"heal","no":1}                    // 77:26060（只走剧情）
```

**Name rules.** No row name is longer than 10 characters, the cap used by the status parser (28247). 「通晓语言恒定领域」 and 「次级钢铁守护结界」 are both 8.

**Aliases.** Make `spellCanonOf` (12234) look names up through a small alias map, so old saves and model output still resolve:

```js
const SPELL_ALIAS = { "照明术": "光亮术", "畏惧法术": "畏惧魔法", "清洗术": "清洁术", "冰墙术": "瞬发·冰墙术", "瞬发冰墙术": "瞬发·冰墙术" };
function spellCanonOf(nm) { let z = String(nm || "").replace(/[《》「」『』【】]/g, "").trim(); z = SPELL_ALIAS[z] || z; return SPELL_CANON.find(d => d.n === z) || null; }
function spellCanonList(run) { const cur = eraByYear(run && run.year).id; return SPELL_CANON.filter(d => !d.x && (!d.e || d.e === cur)); }   // P250 概念行不进图鉴
```

### 2.3 Fields on a spell (canon row and `run.spells[name]`)

```js
// SPELL_CANON row: existing {n,t,g,s,c,r,d,e,u} plus optional:
//   ty  : DND_STYPE key; the resolver uses it before any regex
//   q   : gate "o:<originId>" | "t:<talentId>"
//   x   : 1 = concept or duplicate row, hidden everywhere
//   no  : 1 = can't be picked at creation or bought in the 图鉴 (the story may still grant it)
// run.spells[name]: existing {lv, cost, range, desc, mod?, lvY?} plus optional:
//   nt  : this opener's usage note (≤30); shown in 资料库 and in spellsFull
//   cu  : 1 = the player authored it (custom); the AI may level it but not rewrite cost/range/desc
//   s   : school ("防护|咒法|预言|惑控|塑能|幻术|死灵|变化|通用"; canon rows may also carry 仪式/符文)
//   ty  : DND_STYPE key (custom spells always have it)
//   t   : ring 0-8 (custom spells; canon spells read the canon row)
//   k   : cost coefficient 1|2|4 (custom)
//   ar  : 1 = group (blast/drain only)
//   el  : element "火冰雷电水风酸毒光暗音血星奥术" (blast/drain)
//   fx  : the special-effect line bought with 法术降级 (≤20)
//   base: canon name this spell is a variant of (custom)
//   al  : alias (≤4), honoured only while she has the 简短施法 talent
```

### 2.4 TALENT: new 专长 category (append to `TALENT` at 14262-14291)

New optional fields:

| field | meaning |
|---|---|
| `e` | era gate |
| `q` | gate, "o:originId" |
| `eff` | `"init+2"`, `"ac+1"` or `"hp+4"`, summed into `dndEffSum` |
| `fam` | 1: needs a chosen spell, stored in `run.talents[id].sp` |
| `al` | 1: enables spell aliases |
| `unl` | names of spells this talent ungates |
| `rare` | 1: costs 4 points at creation |
| `src` | canon ref, shown in the tooltip |

```js
  /* 专长：原著的「专长」——练出来的、打针打出来的、高人灌进来的（P250） */
  { id: "fabian", nm: "法术辨识", cat: "专长", dom: { "学识": 1 }, src: "94:77694 · 77:2207、27074", d: "听咒语就摸得清对方法术模型的规模与精细：学识加一档，认法术、拆法术占先" },
  { id: "qiwu", nm: "奇物使用者", cat: "专长", e: "y2077", dom: { "控制": 1 }, src: "77:2207", d: "魔导器、卷轴、怪东西上手就会用：控制加一档" },
  { id: "pijia", nm: "披甲施法者", cat: "专长", e: "y2077", eff: "ac+1", src: "77:2207", d: "穿着护具施法也不走样：护甲 +1" },
  { id: "chaolu", nm: "抄录卷轴", cat: "专长", e: "y2077", sell: .08, src: "77:4735-4756、11500", d: "有抄录权的法术能做成卷轴出手：出让多收八分" },
  { id: "xiangong", nm: "精通先攻", cat: "专长", eff: "init+2", src: "77:24295", d: "开打先比手快：先攻 +2" },
  { id: "zhandou", nm: "战斗施法", cat: "专长", e: "y2077", dom: { "法术": 1 }, src: "77:24295", d: "刀光里也念得稳咒：施法判定加一档" },
  { id: "qiangxiao", nm: "法术强效", cat: "专长", e: "y1994", dom: { "法术": 1 }, src: "94:23543", d: "同一门法术放得比别人狠：施法判定加一档" },
  { id: "shoulian", nm: "法术熟稔", cat: "专长", fam: 1, src: "94:44502", d: "挑一门法术练到超瞬发：那一门耗魔减半" },
  { id: "qiangren", nm: "强韧身躯", cat: "专长", eff: "hp+4", src: "94:46624", d: "照手册练出来的身板：生命 +4" },
  { id: "yushou", nm: "寓守于攻", cat: "专长", e: "y1994", dom: { "出力": 1 }, src: "94:37972", d: "贴身缠斗以攻代守：出力加一档" },
  { id: "weishen", nm: "模拟伪神法术", cat: "专长", e: "y1994", dom: { "交际": 1 }, src: "94:35132", d: "解咒、疗伤、与自然说话这类「神术」都仿得出，在异界最受雇主欢迎：交际加一档" },
  { id: "lingneng", nm: "灵能觉醒", cat: "专长", rare: 1, dom: { "学识": 1 }, unl: ["偏移力场", "灵能"], src: "94:14744、14758-14761", d: "大脑开了另一扇门：学识加一档，可学灵能法术" },
  { id: "maoji", nm: "猫魔女的秘技", cat: "专长", e: "y1994", q: "o:maodeng", dom: { "体魄": 1 }, src: "94:70813", d: "翻滚里也稳得住身形：体魄加一档" },
  { id: "zhongzi", nm: "德鲁伊种子", cat: "专长", e: "y2077", rare: 1, eff: "ac+1", src: "77:29895-29897、32055-32066", d: "开打前扔一颗装了护持法术的种子：护甲 +1（无牌的黑德鲁伊手艺，查到要罚）" },
  { id: "jianduan", nm: "简短施法", cat: "专长", e: "y2077", al: 1, eff: "init+1", src: "77:19282-19289", d: "法术能念简称：先攻 +1，自创法术可设简称" }
```

- **Collisions:** none of these ids or names clash with `TALENT`, `ORIGIN_TALENT` or the `tg_` ids of story talents. Custom talents use the `tc_` prefix.
- **Size:** TALENT goes from 20 rows to 35. Update the 「共 N 门」 count at 31987 so it reads `TALENT.length` (it already does) plus talentX.

### 2.5 `OPENERS[].sig` shape and the full block

**Shape:**

```js
sig: {
  sp:   [[name, lv, note?, cost?, range?]],   // prefilled; seed rows cost 0 points and are exempt from the ring cap
  drop: ["火球术"],                            // removed from the origin prefill
  lock: [[name, how, {gf?, w?, t?}]],         // greyed rows; become run.spellLocks; gf = 公分 price, w = 1994-base 元 (×eraMult)
  tal:  [[id, lv, {sp?}]],                    // signature talent (free; doesn't count toward the pick limit)
  tlock:[[id, how]],                          // locked talents (shown greyed; story or 资料库 unlock)
  sk:   [[name, lv, desc]],                   // starting skills
  pick: {title, opts: [{nm, sp: [[name, lv]]}]},   // haixuan only: a free either/or
  origin: "wangling",                         // origin suggested on card click (the player can change it)
  pts: 6                                      // creation budget
}
```

**Full block.** Paste a `sig:` key into each `OPENERS` row (3426-3468). The notes are engine text and quote no novel.

```js
/* saibo */     sig: { pts: 6,
  sp: [["法师之手", 2, "挤航道时腾不出手，光幕全靠它托着"], ["瞬视震荡术", 1, "只有使用权，抄录权没开——卷轴是硬通货，可惜你做不了"],
       ["魔法飞弹", 1, "人人会的那一手，通勤路上防身"], ["治愈魔女术", 1, "摔了扫帚先给自己来一下：不是治疗术，是逼自己愈合"]],
  lock: [["通晓语言恒定领域", "接机关那张星海开拓志愿者告示，岗前培训配发"]],
  tal: [["kuaishou", 1]] },
/* weida77 */   sig: { pts: 6, drop: ["火球术"],
  sp: [["安洁莉特火球术", 5, "主炮。无咒文的二级结构，解说爱叫它「品牌升级款」"], ["披风保护", 4, "披风一烧就是被秒——练到四级才敢上场"],
       ["加速术", 3], ["偏转术", 3, "联赛里的稳当起手"], ["镜像术", 2, "决斗场上的心理战，解说管这叫「排面」"], ["重力雨点", 1, "破盾用，刚从队里法术池领的"]],
  lock: [["正面反魔立场", "升格试炼赢下第一场，队里的法术池才肯放（原著 2077:39950 法术池卡）"]],
  tal: [["xiangong", 1]] },
/* zhanmo77 */  sig: { pts: 6, drop: ["火球术"],
  sp: [["自锁法术飞弹", 5], ["炎爆术", 4], ["次级钢铁守护结界", 3, "摔一块玻璃小盾牌就起，专挡凡人的枪炮"],
       ["缝合伤口", 3, "战地里练出来的，比抚恤科的批复快"], ["召唤印记", 3, "战场上呼支援的手势，现在只用来叫旧部吃饭"]],
  lock: [["超次元防护邪恶", "预备役返聘、进了监管会军械库的名单才配发"]],
  tal: [["tili", 1]] },
/* linshigong77 */ sig: { pts: 6,
  sp: [["油腻术", 1, "地上一抹，迅猛龙也站不住"], ["活化绳", 1, "一段绳子听话就够用：捆、绊、递东西"],
       ["法师之手", 1, "文创办的活：端茶、递稿、扶展板"], ["防御邪恶", 1, "网上下的通用模板；展馆斗起来，先挨诅咒的是临时工"]],
  lock: [["殴打术", "岗位配发（调去安保办）或公分兑换", { gf: 12 }], ["瞬视震荡术", "馆长看得上你，馆里出法术"]],
  tal: [["fabian", 1]] },
/* paiqian77 */ sig: { pts: 6,
  sp: [["治愈魔女术", 1, "隧道里客人出事的第一反应"], ["偏转术", 1, "交班的同事教的，派遣工的自保"],
       ["幻音术", 1, "十点开闸，队太长，喊号靠它"], ["通晓语言恒定领域", 1, "美人鱼游客、海豹，偶尔一只绵绵龙"]],
  lock: [["水疗术", "得有贝壳龙因子"]],
  tal: [["jiangjia", 1]] },
/* buxi77 */    sig: { pts: 6,
  sp: [["法师之手", 1, "八颗种子并行栽培，两只手不够"], ["加速术", 1, "催芽之前，先学会催自己"],
       ["法师护甲", 1], ["偏转术", 1, "种子里最常装的两门之一"]],
  sk: [["魔植采集", 1, "A2 魔植课基础篇：采之前先让魔植看得上你"]],
  lock: [["笔绘速写", "把法术编码进笔记、绕过禁止施法协议的手法（名目是引擎口径）", { t: 0 }]],
  tlock: [["zhongzi", "考过 A2 魔植，再认识一位黑德鲁伊"]],
  tal: [["yanli", 1]] },
/* shengnv */   sig: { pts: 6,
  sp: [["光亮术", 3, "最便宜的光亮术，一晚上不到二十魔力值——信众管它叫圣火", "20魔力值", "一盏灯的范围"],
       ["造水术", 2, "盐白之地上最像神迹的一门"], ["隐形仆役", 2, "神迹的后台人手：香灰自己扫，供品自己摆"],
       ["全知之眼", 1], ["盐墙术", 1, "盐地里起墙，比石头便宜"]],
  lock: [["治疗伪神术", "得先有一颗伪神核心"]],
  tal: [["weishen", 1]] },
/* konghuang */ sig: { pts: 6,
  sp: [["狩猎印记", 2], ["畏惧魔法", 1, "对怨灵比对活人好使"], ["缝合伤口", 1],
       ["光亮术", 1, "怨气躲在影子里，照亮了就得现形"], ["魔法警报", 1, "三十七条现象记录，一处一道警报"]],
  lock: [["抵御幽灵", "6 级防护，魔力过一万五千公仑再说"]],
  tal: [["fabian", 1]] },
/* haixuan */   sig: { pts: 8,
  sp: [["法师之手", 1], ["清洁术", 1, "魔女最常用的那门"], ["传讯术", 1]],
  pick: { title: "职业方向（报名表那一栏）", opts: [
    { nm: "战斗方向", sp: [["闪光尘", 1], ["次元跳跃", 1]] },
    { nm: "学术方向", sp: [["解除魔法", 1], ["畏惧魔法", 1]] }] },
  lock: [["飞行术", "配方在手，缺蝎狮尾针和沙利叶毒蝶的甲胄"]] },
/* shixun */    sig: { pts: 6,
  sp: [["魔法飞弹", 1, "试训第一课：两发飞弹，一发闪光尘"], ["闪光尘", 1], ["加速术", 1, "晨训五点半，不会这门赶不上早饭"], ["法师护甲", 1]],
  lock: [["镜像术", "一心六用；教练说过了试训再教"]],
  tal: [["shoulian", 1, { sp: "法师护甲" }]] },
/* guanxing */  sig: { pts: 6,
  sp: [["全知之眼", 1, "塔顶看星的本事，先学会看远处"], ["保密之语", 1], ["法师之手", 1, "塔里星图都挂在够不着的高度"], ["抄写术", 1, "抄星图"]],
  lock: [["全知之雨", "塔顶那位的招牌，7 级稀有，不外传"],
         ["私课赠法", "听完塔顶那位的私课，从破除结界、海洋贫血、汲取生命、抵御幽灵、融和焰球里挑一门，魔力够了才用得动"]],
  tlock: [["lingneng", "塔顶那位帮得上忙"]],
  tal: [["yanli", 1]] },
/* piaoliu */   sig: { pts: 6, origin: "wangling",
  sp: [["修复死灵", 2, "养八具老尸兵的手艺，缝缝补补又三年"], ["缝合伤口", 1, "和修复死灵是一对，死灵入门必学"],
       ["死灵触手", 2], ["寒冷之触", 1], ["掠夺光环", 1, "对倒地的对手补一下——魔女对手照规矩是拿下，不是杀"]],
  lock: [["聚灵术", "补尸兵用的，得有停灵地和执照"]],
  tal: [["kantan", 1]] },
/* wanyan94 */  sig: { pts: 6, origin: "maodeng",
  sp: [["厨师之手", 2, "礼物送吃的——这门手艺在船上比法术管用"], ["喵嗷之爪", 1], ["幻音术", 1], ["料理术", 1],
       ["创造闪光猫灯", 1, "几只发光猫灯飘起来，旁边的人心情都好几分"]],
  lock: [["召唤猫灯", "猫魔女要学很久；有灯芯能快些"]],
  tal: [["maoji", 1]] },
/* custom */    // no sig: budget 10, origin spell and talent only
```

`run.spellLocks` shape: `{ [name]: { how, gf?, w?, t?, src: seedId, y } }`.

---

## 3. Per-opener signature kits (feature 1)

Column key:
- **Lv**: mastery at start.
- **ring·school·type**: type is the resolver type after section 2.1.
- **Status**:
  - keep: already in the setup.
  - new: added by this spec.
  - replace: swaps out a current spell.
  - locked: shown greyed, with its unlock route.
- **cap**: the ring cap that this opener's `mn` range gives (section 5.2). Seed rows are exempt from it, but every row below fits anyway.

The origin spell (火球术 for 魔女, 120 魔力值, Lv1) stays unless the opener drops it.

### saibo 穹顶之下2077: 2077 · 6800-8800 公仑 → cap 4 · commuter just out of school

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 法师之手 | 2 | 0 · 变化 · ritual | keep, Lv1→2 | Holds the light screen in the lane. A cantrip she uses daily | 77:4235 ✓, 77:7416 ✓, 94:8652 ✓ |
| 瞬视震荡术 | 1 | 2 环 · 塑能 · control | keep | A good 2-ring from 伊丽莎白之道; scrolls of it are hard currency. Use right only | 77:3853-3854 ✓, 77:9283 ✓, 77:4735 ✓ |
| 魔法飞弹 | 1 | 1 · 塑能 · blast | new | The witch's "AK47" that everyone knows | 77:15659-15661 ✓, 77:435 ✓ |
| 治愈魔女术 | 1 | special 1 环 · heal | new | Commuter self-rescue. Canon has it as a 海洋馆 clerk's spell | 77:29640-29641 ✓ |
| 火球术 | 1 | origin | keep | "通学常见3环" | 77:8510 ✓ |
| *通晓语言恒定领域* | — | 2 环 · 预言 | locked: 开拓志愿者 training | Links to the opener's opp | 77:34756 ✓ |

Talent: **快手** (existing). Lane flying rewards fast hands.

### weida77 伟大替补2077: 2078 · 110k-200k → cap 6 · league duelist

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 安洁莉特火球术 | 5 | 2 · 塑能 · blast | keep | Main gun: incantation-free and huge area | 94:35087 ✓ |
| 披风保护 | 4 | 4 · 防护 · ward | keep | If the cape burns, she gets one-shot on stage | SPELL_CANON row |
| 加速术 | 3 | 3 · foresee (fixed) | keep | Overperforms its ring | 94:56475 ✓ |
| 偏转术 | 3 | 2 环 · 防护 · ward | new | The "safe" league opener | 77:31499-31500 ✓ |
| 镜像术 | 2 | 3 · 幻术 · mirage | keep | Mind games, or 「排面」 | 94:6130 ✓ |
| 重力雨点 | 1 | 4 环 · 咒法 · blast (area) | new | Shield-breaker used by league players | 77:39882-39883 ✓ |
| *正面反魔立场* | — | 5 · ward | locked: the team's spell pool after winning the first trial | League spell-pool cards | 77:39893-39900 ✓, 77:39950 ✓ |

Drops 火球术 (as now). Talent: **精通先攻** (77:24295 ✓).

### zhanmo77 授勋之后2077: 2077 · 160k-250k → cap 6 · retired war witch

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 自锁法术飞弹 | 5 | 3 环 · 塑能 · blast | keep | Veteran's precision bolt | SPELL_CANON row; 77:15659 ✓ |
| 炎爆术 | 4 | 4 · 塑能 · blast (火, fixed) | keep | Classic 4-ring | 94:4647 ✓ |
| 次级钢铁守护结界 | 3 | 6 环 · 防护 · ward | new | Throw a glass mini-shield and the dome blocks mortal guns, the staple of the 闪灵 veterans | 77:33252-33256 ✓ |
| 缝合伤口 | 3 | 1 · 死灵 · heal (fixed) | keep | Field suturing | 94:12959 ✓ |
| 召唤印记 | 3 | 2 · ritual (fixed) | keep | Calls her old squad to dinner | 94:3618 ✓ |
| *超次元防护邪恶* | — | 5 环 · 防护 | locked: rehired as a reservist | The big exorcism ward used by 孙敏赫 | 77:33246-33247 ✓ |

Drops 火球术. Talent: **皮实**. Optional custom-talent presets: 陆战出身 / 星舰出身 (77:24760-24762 ✓, see 4.6).

### linshigong77 上岸第一周2077: 2077 · 1800-3200 → cap 3 · 临时工 at 闪灵 文创办

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 油腻术 | 1 | 1 · 咒法 · control | new | The first spell 雾花 used on her first day at the museum | 77:2306-2308 ✓, 77:3834 ✓ |
| 活化绳 | 1 | 1 · 变化 · control | new | Same incident: tie up, trip | 77:2303-2304 ✓ |
| 法师之手 | 1 | 0 · ritual | new | Office errands | 77:7416 ✓ |
| 防御邪恶 | 1 | 2 · 仪式 · ward | new | "魔女内战必备". In hall feuds the cursed 宣传员 was "just a 临时工". This is the **内战 hook** | 77:3282-3287 ✓, 77:3269-3270 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| *殴打术* | — | 2 环 · 咒法 · blast | locked: post issue (transfer to 安保办) or **公分 12** | Guards get it with the job; 雾花 envied it | 77:2336-2338 ✓ |
| *瞬视震荡术* | — | 2 环 | locked: the director recommends you and the museum supplies it | 枯华 gave it to 雾花 | 77:3850-3856 ✓ |

Talent: **法术辨识** (77:2207 ✓, 77:27074 ✓).

### paiqian77 派遣日结2077: 2077 · 1200-2600 → cap 2-3 · 狼窝 dispatch at the 海洋展馆 tunnel

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 治愈魔女术 | 1 | special 1 环 · heal | new | The 海洋馆 clerks' spell, and the first response when a guest gets hurt | 77:29640-29641 ✓ |
| 偏转术 | 1 | 2 环 · 防护 · ward | new | The handover colleague's spell in canon (kept modest) | 77:31499-31500 ✓ |
| 幻音术 | 1 | 1 · 幻术 · mirage | new | Amplifies the voice to call the queue | 77:40612 ✓, 77:37883 ✓ |
| 通晓语言恒定领域 | 1 | 2 环 · 预言 · ritual | new | Greeting mermaid guests | 77:34756-34757 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| *水疗术* | — | 2 · heal | locked: needs 贝壳龙因子 | — | 77:26060 ✓ |

Talent: **讲价** (counting the day rate). Optional preset 猫球缘 (77:8534-8566) once `tie` is wired (see 4.6).

### buxi77 A2补习2077: 2077 · 3000-5200 → cap 3-4 · hidden cram school, A2 魔植

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 法师之手 | 1 | 0 · ritual | new | Eight seeds in parallel cultivation | 77:29783 ✓ |
| 加速术 | 1 | 3 · foresee | new | Ties into the time-river drip acceleration | 77:3151 ✓, 77:32072 ✓ |
| 法师护甲 | 1 | 1 · 防护 · ward | new | Common seed filling | 77:4733 ✓, 77:32055 ✓ |
| 偏转术 | 1 | 2 环 · ward | new | The other common seed filling | 77:32055 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| skill 魔植采集 | 1 | — | new (skill) | Plants are picky about who harvests them | 77:27107 ✓, 77:32079 ✓ |
| *笔绘速写* | — | 0 · ritual | locked | Encoding spells into notes to dodge the 禁止施法 contract. Canon gives the technique no name, so the name is engine wording | 77:15567-15571 ✓ |
| *talent 德鲁伊种子* | — | — | locked talent | Unlicensed 黑德鲁伊 tech | 77:29895-29897 ✓ |

Talent: **眼力**.

### shengnv 圣女在上: 1997 · 7600-9600 → cap 4 · playing god on 盐白之地

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 光亮术 | 3 | 0 · ritual | **replace 照明术** (alias kept) | The canon cantrip name; it is the "圣火". Cost becomes "20魔力值" (the old string parsed to 1) | 94:92817-92827 ✓, 94:47506 ✓ |
| 造水术 | 2 | 1 · ritual | new | A miracle in a salt land | 94:1086 ✓, 94:2892 ✓, 94:23598 ✓ |
| 隐形仆役 | 2 | 1 · ritual (fixed) | keep | Backstage hands for the miracles | 94:1419 ✓ |
| 全知之眼 | 1 | 3 · 预言 · foresee | keep | — | 94:3675 ✓ |
| 盐墙术 | 1 | 4 · ward | new | Salt-land defence | SPELL_CANON row; 94:14899 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| *治疗伪神术* | — | — | locked: needs a pseudo-god core | How witches build healing | 94:39520-39525 ✓ |

Talent: **模拟伪神法术** (94:35132 ✓).
- **Red line:** 预言仙术 is `no:1` (仙人魔女 only, 94:98208 ✓).
- **Wording:** also change 照明术 → 光亮术 in the shengnv `scene` text (3448) and in the 圣火灯 item description (13393).

### konghuang 雾町的转学生: 1996 · 6200-8200 → cap 4 · hunter in a grudge world

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 狩猎印记 | 2 | 2 · rune | keep | Signature tracking mark (rune adds a damage die, like Hunter's Mark) | 94:36654 ✓ |
| 畏惧魔法 | 1 | 3 · control | keep | Strips magic resistance | 94:655 ✓, 94:659 |
| 缝合伤口 | 1 | 1 · heal (fixed) | keep | — | 94:12959 ✓ |
| 光亮术 | 1 | 0 · ritual | new | Strong light drives an 恶灵魔女 out of the shadows. In canon the light comes from a cat lamp, so tying it to this spell is engine wording | 94:59782-59787 ✓ |
| 魔法警报 | 1 | 2 · 防护 · ritual | new | Watches the 37 phenomena | 94:2536 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| *抵御幽灵* | — | 6 · 防护 | locked: mana tier | — | 94:23024 ✓ |

Talent: **法术辨识** (94:77694 ✓). Content: the PC is an adult enrolled as 16. Keep school scenes modest and never draw her as childlike.

### haixuan 海选报名日: 1994 · 4200-5400 → cap 3-4 · blank 职业方向 box

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 火球术 | 1 | origin | keep | Without it a witch is "incomplete" | 94:325 ✓, 94:581 ✓ |
| 法师之手 | 1 | 0 | new | The best-known 0-ring | 94:8652 ✓ |
| 清洁术 | 1 | 0 | new | Witches' favourite | 94:8971 ✓ |
| 传讯术 | 1 | 1 · 变化 | new | Standard kit | 94:2535 ✓, 94:12586 ✓ |
| **pick 职业方向** | 1 | — | new, free either/or | 战斗: 闪光尘 + 次元跳跃 (both ring 2). 学术: 解除魔法 + 畏惧魔法 (both ring 3) | 94:654-660 ✓ |
| *飞行术* | — | 3 | locked: recipe owned, materials missing (a quest) | — | 94:779-780 ✓ |

No signature talent. Budget is **8**, because she picks her talent herself. The pick also writes `identity += "·职业方向：战斗/学术"`.

### shixun 雪楠湖试训: 1995 · 4600-6000 → cap 3-4 · club tryout

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 魔法飞弹 | 1 | 1 · blast | **replace 殴打术** (era leak) | A first hunt was two missiles and one 闪光尘 | 94:4033 ✓ |
| 闪光尘 | 1 | 2 · mirage | new | Same pairing | 94:654 ✓, 94:4033 ✓ |
| 加速术 | 1 | 3 · foresee | keep | — | 94:56475 ✓ |
| 法师护甲 | 1 | 1 · ward | new | — | 94:4174 ✓ |
| 火球术 | 1 | origin | keep | The tryout is fireballs against a clock | 94:23532 ✓ |
| *镜像术* | — | 3 | locked: taught after the tryout | Hard ("one mind, six threads") | 94:6130 ✓ |

Talent: **法术熟稔: 法师护甲** (94:44502 ✓).

### guanxing 观星塔来信: 1996 · 5200-6800 → cap 4 · summoned by the tower

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 全知之眼 | 1 | 3 · 预言 · foresee | new | Stargazer signature | 94:3675 ✓ |
| 保密之语 | 1 | 3 · ritual (fixed) | keep | — | 94:11694 ✓ |
| 法师之手 | 1 | 0 · ritual (fixed) | keep | — | 94:8652 ✓ |
| 抄写术 | 1 | 0 · ritual | new | Copying star charts | 94:8652 ✓ |
| 火球术 | 1 | origin | keep | — | — |
| *全知之雨* | — | 7 · legendary | locked teaser | Her signature; casting time is too long for duels | 94:18414 ✓ |
| *私课赠法* | — | 5-7 | locked: one of five after the private lecture | — | 94:23019-23026 ✓ |
| *talent 灵能觉醒* | — | — | locked talent | She is the canon 灵能 witch | 94:14744 ✓, 94:14758 |

Talent: **眼力**.

### piaoliu 星海漂流: 1997 · 5000-6800 → cap 4 · 亡灵魔女 with 8 corpse soldiers

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 修复死灵 | 2 | 1 · ritual (fixed) | keep, **signature** | Keeps the corpse soldiers running | 94:12958 ✓ |
| 缝合伤口 | 1 | 1 · heal | new | Canon pairs it with 修复死灵 as the 死灵 basics | 94:12854 ✓ |
| 死灵触手 | 2 | 3 · summon | keep | — | 94:13525 ✓ |
| 寒冷之触 | 1 | 1 · drain (fixed) | keep | — | 94:12586 ✓ |
| 掠夺光环 | 1 | 1 · 死灵 · drain | new | 死灵 1-ring with a hundred variants | 94:13141-13146 ✓ |
| *聚灵术* | — | 4 · summon | locked: restocking troops | — | 94:36617 ✓ |

Card click suggests origin **亡灵魔女** (`sig.origin`), which brings 安魂灯 and 血脉. Talent: **勘探癖**, for drifting the 星之海.

### wanyan94 猫的晚宴: 1997 · 5400-7200 → cap 4 · the cats' year-end banquet

| spell | Lv | ring·school·type | status | why | canon |
|---|---|---|---|---|---|
| 厨师之手 | 2 | 4 · ritual | keep, signature | — | 94:7785 ✓ |
| 喵嗷之爪 | 1 | 2 · ritual (fixed) | keep | Hauls about a ton | 94:58671 ✓ |
| 幻音术 | 1 | 1 · 幻术 · mirage | keep | — | 94:2534 ✓, 94:44905 ✓ |
| 料理术 | 1 | 1 · ritual | new | Named alongside 厨师之手 | 94:7785 ✓ |
| 创造闪光猫灯 | 1 | 3 · ritual · q 猫灯 | new | A morale-lifting party trick | 94:36776-36780 ✓ |
| *召唤猫灯* | — | 4 · summon | locked | — | 94:54198 ✓ |

Card click suggests origin **猫灯眷属**, because canon admits only cat-type witches (94:97917 ✓). Talent: **猫魔女的秘技** (94:70813 ✓).
- If the player switches to a non-cat origin, 创造闪光猫灯 and 秘技 turn invalid and are flagged, and the talent falls back to 口齿.
- In that case the AI should frame the PC as someone's plus-one (prompt hint; optional).

### custom 自定年份

No seed. Budget **10**. Prefill is the origin spell and the origin talent.

---

## 4. Creation panel `#reg-card` (feature 2)

### 4.1 Placement and markup

**HTML.** Insert after line 2276 (`<div id="reg-traits"></div>`), before `#reg-preview`:

```html
<details id="reg-st" open>
  <summary><span>法术 · 天赋</span><b id="reg-pts">起手点 6 / 6</b></summary>
  <div id="reg-pick"></div>                     <!-- haixuan's 职业方向 toggle (empty for other seeds) -->
  <div id="reg-sp" class="rg-list"></div>
  <div class="frow rg-add"><button class="btn sm" data-rgopen="sp">＋已有法术</button><button class="btn sm" data-rgopen="cu">＋自创法术</button></div>
  <div id="reg-tal" class="rg-list"></div>
  <div class="frow rg-add"><button class="btn sm" data-rgopen="tal">＋天赋</button><button class="btn sm" data-rgopen="ct">＋自创专长</button></div>
  <div id="reg-db" class="hint"></div>          <!-- two drawback checkboxes -->
</details>
```

**Measured height.** The card is 1668 px tall in a 1400×900 window with an 822 px scroller (Playwright, 2026-10-08). It already scrolls with the page, so `<details>` is enough and no change to sticky positioning is needed.

**Picker overlay.** Add it next to `#ov-char` (2363):

```html
<div id="ov-regpick" class="ov"><div class="sheet wide">
  <div class="sheet-head"><h3>挑 法 术 · 天 赋</h3><span class="hint" id="rgp-pts"></span><button class="x" data-x="ov-regpick">✕</button></div>
  <div class="tabs" id="rgp-tabs"><button data-rgt="sp">已有法术</button><button data-rgt="cu">自创法术</button><button data-rgt="tal">天赋</button><button data-rgt="ct">自创专长</button></div>
  <div class="sheet-body"><div id="rgp-bar"></div><div id="rgp-body"></div></div>
</div></div>
```

**CSS.** Add after line 182 (`#reg-traits input{…}`). Use the existing tokens only, so the 1994 and 2077 skins and light/dark both work.

```css
#reg-st{margin-top:12px;border-top:1px dashed var(--line);padding-top:6px}
#reg-st>summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;color:var(--mut);letter-spacing:.14em;list-style:none}
#reg-st>summary b{margin-left:auto;font-weight:500;color:var(--jin2);letter-spacing:0}
.rg-list{display:flex;flex-direction:column;gap:4px;margin:6px 0}
.rg-row{display:flex;align-items:center;gap:6px;font-size:12px;padding:3px 6px;border:1px solid var(--line);border-radius:9px}
.rg-row .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink)}
.rg-row .tg{flex:none;font-size:10.5px;color:var(--mut)}
.rg-row .lvb{flex:none;display:flex;align-items:center;gap:2px}.rg-row .lvb button{width:18px;height:18px;padding:0;font-size:11px}
.rg-row.seed{border-style:dashed}.rg-row.cu .nm::after{content:"自";margin-left:4px;font-size:10px;color:var(--zhu)}
.rg-row.lock{opacity:.55}.rg-row.bad{border-color:#c66}.rg-row.bad .tg{color:#e59d9d}
.rg-add{gap:6px}.rg-add .btn{flex:1}
#rgp-bar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}#rgp-bar input[type=search]{flex:1;min-width:140px}
.rgp-item{display:grid;grid-template-columns:minmax(90px,max-content) 1fr auto;gap:4px 10px;align-items:start;padding:7px 4px;border-bottom:1px solid var(--line)}
.rgp-item .d{grid-column:1/-1;font-size:12px;color:var(--ink2);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rgp-form label{display:block;font-size:12px;color:var(--mut);margin:10px 0 4px}.rgp-out{margin-top:10px;font-size:12.5px;color:var(--jin2)}
@media (max-width:600px){#ov-regpick .sheet{width:100vw;height:100dvh;border-radius:0}.rgp-item{grid-template-columns:1fr auto}}
```

### 4.2 How the panel reads

Each row is about 22 px tall at 272 px wide:

```
法术 · 天赋                          起手点 3 / 6
  火球术        3级·轰击          Lv1   出身
  油腻术        1环·控制          Lv1   开局          (dashed = seed row, can remove, no refund)
  偏转术        2环·护持     [-] 1 [+] 2点  ✕
  潮汐针  自    2环·轰击·群   [-] 1 [+] 6点  ✕
  殴打术        待解锁：公分兑换 12                    (dim)
[＋已有法术] [＋自创法术]
  法术辨识      开局 · 学识+1
  口齿          2点 · 交涉+1／人脉+4             ✕
[＋天赋] [＋自创专长]
代价：□ 背学贷（存款里记一笔 1万，+1 点）  □ 旧伤（+1 点）
```

- **Tooltip** (`title`): description, cost·range, canon ref (`src`), and the reason if the row is invalid.
- **Row tag:** the ring with its unit (级 in 1994, 环 in 2077), then `DND_STYPE[ty].nm`, then 群 if it is a group spell.

### 4.3 Picker tabs

**已有法术**
- **Source:** `spellCanonList({year})`, minus `x` rows.
- **Filter bar:** school chips (全部 / 防护 / 咒法 / 预言 / 惑控 / 塑能 / 幻术 / 死灵 / 变化 / 通用 / 仪式·符文), ring select (0..cap), type select (11 types), and search.
- **Each item shows:** name · ring+unit·school·type · cost·range · price (`N点`, and `或 X元` when the money path is open) · button.
- **Disabled reasons**, in this order:
  - 已在表上
  - 传奇法术登记时不能挑（g）
  - 须剧情机缘（no）
  - 此年代没有（e）
  - 魔力不够驾驭：要 ≥ N 公仑（ring > cap; N = the lower bound of that tier)
  - 须猫灯眷属 / 须灵能觉醒（q）
  - 起手点不够
- **Adding:** sets `src:"pick"`, Lv1, and copies cost, range and desc from the canon row. Lv is raised on the panel row with [+].
- A small 「现付」 toggle on each item adds it with `cash:price` and 0 points (section 5.4).

**自创法术**: the form below. A live readout shows the derived cost, dice now and at the cap, points, and validation messages. Fields:

| field | control | rule |
|---|---|---|
| 名字 | text ≤10 | ≥2 characters. Must not equal a canon name or an alias; must not contain, or be contained in, an owned or panel spell name (`dndSpellPick` uses substring matching); no `｜|：:（()`. Hint: 改良的法术要另起名，如「某某的火球术」（原著 2077:19282-19285） |
| 底本（可空） | select of pickable canon rows | Variant: pre-fills school, type and ring; ring ≤ base ring + 1; points +1 instead of +2 |
| 学派 | 防护/咒法/预言/惑控/塑能/幻术/死灵/变化/通用 | Picking a school pre-selects the type via `DND_SCHOOL` (通用 → ritual) |
| 类别 | 11 `DND_STYPE` keys, each with its one-line description | Required |
| 环/级 | 0..cap | 0 = 戏法: types limited to ritual/mirage/foresee/rune |
| 元素 | 火冰雷电水风酸毒光暗音血星奥术 | blast/drain only |
| 目标 | 单体 / 群体 | Group only for blast/drain, and only at ring ≥ 2 |
| 范围 | text ≤12, default 十步内 | Free text |
| 耗魔系数 | ×1 / ×2 / ×4 (hint: 原著有 ×3.5、×4.6) | ×2: power cap +1 and +1 point. ×4: power cap +2 and +2 points |
| 法术降级换特效 | checkbox + text ≤20 | Power cap −1 (min 1), 0 points. The text goes into `fx` for the AI |
| 效果 | textarea ≤40 | AI-facing description |
| 起手等级 | 1-3 | +1 point per level above 1 |

**Derived values:**

```js
const RING_COST = [10, 120, 260, 420, 700, 1100, 1800, 2800, 4200, 6500, 8000];   // 魔力值；0 环＝戏法（光亮术「一晚上不到二十」）
const RING_TIER_CAP = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4];                          // 自创法术威力档封顶（档＝dndSpellProfile 的 tier 1-4）
function cuCost(f) { return Math.round(RING_COST[f.t] * (f.k || 1) * (f.ar ? 1.5 : 1)) + "魔力值"; }
function cuCap(f)  { return U.clamp(RING_TIER_CAP[f.t] + ((f.k || 1) >= 4 ? 2 : (f.k || 1) >= 2 ? 1 : 0) - (f.fx ? 1 : 0), 1, 4); }
function cuPts(f)  { return spPtsRing(f.t) + (f.base ? 1 : 2) + (f.ar ? 1 : 0) + ((f.k || 1) >= 4 ? 2 : (f.k || 1) >= 2 ? 1 : 0) + Math.max(0, (f.lv || 1) - 1); }
```

Readout example: 「耗 780 魔力值 · 轰击 2d6水·群（练到 7 级封顶 6d8）· 6 点」.

**天赋**
- **Source:** `TALENT`, grouped as 天资 / 手艺 / 传承 / 专长 / 狠活.
- **Each item shows** the effect summary from a new `talentEffTxt(t)`, factored out of `talentHTML` 31804-31814 and extended with eff, fam and al.
- **Disabled reasons:**
  - 已有
  - 此年代没有 (`e`)
  - 须猫灯眷属 (`q`)
  - 登记时只挑一门（勾一项代价可再挑一门）
  - 狠活只能挑一门
  - 起手点不够
- **法术熟稔** opens a select of the spells on the panel and stores `sp`.

**自创专长**
- **Fields:** name ≤6 (must not equal a TALENT name), category (天资/手艺/传承/专长), effect, description ≤30.
- **Effect menu:** exactly one effect, each at the strength of the weakest canon equivalent:

| effect | stored as | canon analogue |
|---|---|---|
| 某一域 +1 档 (出力/控制/学识/体魄/交际/法术) | `dom:{X:1}` | 稳手, 眼力, 师承 |
| 魔力上限 +8% | `mana:.08` | talentMake mana floor |
| 置产 −6% | `price:-.06` | 门路 |
| 营建 −10% | `build:-.1` | 工头出身 −12% |
| 军饷 −8% | `up:-.08` | 讲价 |
| 勘探 +1 | `xw:1` | 眼力 |
| 某类兵源 −15% (兽/虫/造物/亡灵/人手) | `troop:{K:-.15}` | 兽语 |
| 先攻 +2 | `eff:"init+2"` | 精通先攻 |
| 护甲 +1 | `eff:"ac+1"` | 披甲施法者 |
| 生命 +4 | `eff:"hp+4"` | 强韧身躯 |

- `tie` is **not** offered until `talentTieF` is wired (r_spells §6: it is never called).
- **Presets** that fill the form, all engine wording: 陆战出身 (hp+4, 77:24760), 星舰出身 (init+2, 77:24760), 笔绘速写 (学识, 77:15567), 雾中人 (控制, 77:15590).

### 4.4 Drawbacks (`#reg-db`)

- **背学贷: +1 point**, or **+2** for the bigger loan.
  - The loan is 2000 / 4000 × eraMult(y) 元.
  - At start it adds `opThread(run, "还学贷" + amt + "元", "起手时借的，利息照滚", "")`, the same pattern as BIRTHS debt at 12414-12417.
- **旧伤: +1 point.**
  - At start it adds `run.conds.push({name:"旧伤", note:"登记时自报：阴雨天发作", y})`.
  - zhanmo77 already has one, so this option is hidden for her.
- **Talent limit.** Ticking either drawback raises the talent-pick limit from 1 to 2. Canon: one talent, or two with a drawback (r_canon94 §3).
- **Unticking** is refused, with a toast, if it would leave `spent > budget`.

### 4.5 State and events (Boot, 32384-32500)

```js
/* P250 登记表 · 法术与天赋 */
S.reg = { sp: [], tal: [], lock: [], tlock: [], sk: [], pick: "", db: { loan: 0, wound: 0 }, base: null };
// row: {n, lv, src:"origin"|"seed"|"pickopt"|"pick"|"cu", cost, range, desc, nt?, cash?, ...custom fields}
// tal: {id, lv, src, def? (custom), sp? (法术熟稔)}
function regCtx() {
  const y = U.parseYear((U.$("#inp-year") || {}).value) || 1994, cap = parseInt((U.$("#inp-mana-n") || {}).value, 10) || 0;
  const op = S.seed ? OPENERS.find(o => o.id === S.seed.id) : null;
  return { y, era: eraByYear(y).id, cap, ring: U.clamp(manaTierIdx(cap, y), 1, 8), origin: oSel.value, op, sig: (op && op.sig) || null,
           tals: S.reg.tal.map(t => t.id), budget: ((op && op.sig && op.sig.pts) || (op ? 6 : 10)) + S.reg.db.loan + S.reg.db.wound };
}
function regFill() {        // rebuild origin and seed rows; keep the player's own rows (pick/cu) and re-validate them
  const c = regCtx(), od = ORIGINS.find(o => o.id === c.origin) || ORIGINS[0];
  const mine = S.reg.sp.filter(r => r.src === "pick" || r.src === "cu"), mineT = S.reg.tal.filter(t => t.src === "pick" || t.src === "cu");
  const drop = (c.sig && c.sig.drop) || [];
  S.reg.sp = [];
  if (od.sp && !drop.includes(od.sp[0])) S.reg.sp.push({ n: od.sp[0], lv: 1, src: "origin", cost: od.sp[1], range: od.sp[2], desc: od.sp[3] });
  for (const s of (c.sig && c.sig.sp) || []) S.reg.sp.push(regSeedRow(s, "seed"));
  const po = c.sig && c.sig.pick && c.sig.pick.opts.find(o => o.nm === S.reg.pick);
  for (const s of (po && po.sp) || []) S.reg.sp.push(regSeedRow(s, "pickopt"));
  S.reg.sp = S.reg.sp.concat(mine.filter(r => !S.reg.sp.some(x => x.n === r.n)));
  S.reg.lock = ((c.sig && c.sig.lock) || []).map(l => Object.assign({ n: l[0], how: l[1] }, l[2] || {}));
  S.reg.tlock = ((c.sig && c.sig.tlock) || []).map(l => ({ id: l[0], how: l[1] }));
  S.reg.sk = ((c.sig && c.sig.sk) || []).map(k => ({ n: k[0], lv: k[1], d: k[2] }));
  const oT = ORIGIN_TALENT[c.origin];
  S.reg.tal = [];
  if (oT) S.reg.tal.push({ id: oT, lv: 1, src: "origin" });
  for (const t of (c.sig && c.sig.tal) || []) S.reg.tal.push(Object.assign({ id: t[0], lv: t[1], src: "seed" }, t[2] || {}));
  if (!S.reg.tal.length) S.reg.tal.push({ id: "wenshou", lv: 1, src: "origin" });   // same fallback as talentSeed
  S.reg.tal = S.reg.tal.concat(mineT.filter(t => !S.reg.tal.some(x => x.id === t.id)));
  regPaint();
}
function regSeedRow(s, src) { const c9 = spellCanonOf(s[0]); return { n: s[0], lv: s[1] || 1, src, nt: s[2] || "", cost: s[3] || (c9 ? c9.c : ""), range: s[4] || (c9 ? c9.r : ""), desc: c9 ? c9.d : "" }; }
/* gates shared by the panel and regApply (ctx may come from the form via regCtx() or from a run via regCtxFor(run, reg)) */
function spellGateOk(d, ctx) {                             // d = canon row
  if (!d) return { ok: true };                             // non-canon names (custom rows, lock-only names) are checked elsewhere
  if (d.x) return { ok: false, why: "不是法术条目" };
  if (d.no) return { ok: false, why: "须剧情机缘" };
  if (d.g) return { ok: false, why: "传奇法术登记时不能挑" };
  if (d.e && d.e !== ctx.era) return { ok: false, why: "此年代没有" };
  if (d.q) { const [k, v] = d.q.split(":"), unl = ctx.tals.some(id => ((talentOf(id) || {}).unl || []).includes(d.n));
    if (k === "o" && ctx.origin !== v) return { ok: false, why: "须" + ((ORIGINS.find(o => o.id === v) || {}).label || v) };
    if (k === "t" && !ctx.tals.includes(v) && !unl) return { ok: false, why: "须" + ((talentOf(v) || {}).nm || v) }; }
  return { ok: true };
}
function regRowOk(r, ctx) {
  const d = spellCanonOf(r.n);
  if (r.src === "seed" || r.src === "origin" || r.src === "pickopt") {   // seed rows: exempt from the ring cap and points, still era/origin gated
    const g = d ? spellGateOk(Object.assign({}, d, { g: 0, no: 0 }), ctx) : { ok: true }; return g;
  }
  const g = spellGateOk(d, ctx); if (!g.ok) return g;
  const ring = r.src === "cu" ? r.t : (d ? d.t : 0);
  if (ring > ctx.ring) return { ok: false, why: "魔力不够驾驭：要 ≥ " + manaN(regRingFloor(ring, ctx.y)) + " 公仑" };
  if (r.src === "cu") { const v = cuNameOk(r.n, ctx); if (!v.ok) return v; }
  return { ok: true };
}
function regTalOk(t, ctx) {
  if (t.src === "cu") return { ok: true };
  const d = talentOf(t.id); if (!d) return { ok: false, why: "名录里没有" };
  if (d.e && d.e !== ctx.era) return { ok: false, why: "此年代没有" };
  if (d.q && d.q.startsWith("o:") && ctx.origin !== d.q.slice(2)) return { ok: false, why: "须" + ((ORIGINS.find(o => o.id === d.q.slice(2)) || {}).label || "") };
  return { ok: true };
}
function regRingFloor(ring, y) { const T = manaTab(y); return ring <= 1 ? MANA_LO : T[Math.min(ring, T.length - 1) - 1][0]; }   // lower 公仑 bound of the tier whose idx == ring
function regCtxFor(run, reg) { return { y: run.year, era: eraByYear(run.year).id, cap: run.manaCap, ring: U.clamp(manaTierIdx(run.manaCap, run.year), 1, 8), origin: (run.origin || {}).id, tals: reg.tal.map(t => t.id), budget: regBudget(reg) }; }
function regDefault(seedOp, origin) { /* the rows regFill would build for this seed and origin, with no player picks; used when S.reg is absent */ }
// regBudget(reg) and regSpent(reg) implement section 5.1 and 5.3; cuNameOk(name, ctx) implements the 名字 rule in 4.3
```

For a 魔女 (monv) origin there is no `ORIGIN_TALENT` entry. So when the seed has a `sig.tal`, that talent **replaces** the 稳手 fallback; otherwise she keeps 稳手, exactly as `talentSeed` does today. Origins that do have an entry (shoujo, yao, wangling, maodeng) keep it **and** get the seed talent.

**Hooks:**

| event | existing line | add |
|---|---|---|
| opener card click | 32393-32400 | After `S.seed = …`: if `op.sig && op.sig.origin`, set `oSel.value = op.sig.origin` (and show `#inp-origin-custom` as the origin handler does), then call `regFill(); regPreview();`. Keep the manaSet call. Also store `S._manaBase` = the rolled value, before talent factors |
| year change | 32482 | `manaReset(); regFill();` (era gates, and the 级/环 unit) |
| origin change | 32483 | append `regFill();` |
| mana input / slider | 32480-32481 | set `S._manaTouched = 1` (input events only), then `regPaint()` (ring cap re-validation) |
| talent add/remove | new | If `!S._manaTouched`: `manaSet(Math.min(MANA_HI, S._manaBase * regManaF()))`; otherwise show 「手填的魔力量不随天赋变」 in `#mana-hint` |
| boot | after `regPreview(); manaReset();` at 32484 | `regFill();` and the delegated click/change handlers on `#reg-st` and `#ov-regpick` |

`manaReset` (32475-32479): replace `seedTalF(oSel.value)` with `regManaF()`, where `regManaF` is the `talentManaF` formula applied over the panel's talent rows. Record `S._manaBase` before multiplying.

`regPreview` (32441-32457): show the seed's Lv chips (`pv-chip q-xi`) instead of only `od.sp`. Keep the wealth and kin line. Add 「现付 X 元」 when cash is used.

---

## 5. Balance rules

### 5.1 Budget (起手点)

| start | budget | reason |
|---|---|---|
| seed card | `sig.pts` (6) | The seed kit is free on top |
| haixuan | 8 | Blank 职业方向 and no signature talent |
| free form (no seed, or 自定年份) | 10 | Only the origin spell and talent |
| each drawback | +1 (the big loan +2), at most +2 in total | 4.4 |

The budget is shown live. 「出发」 is not blocked by unspent points.

### 5.2 Ring cap (mana)

`ringCap(cap, y) = U.clamp(manaTierIdx(cap, y), 1, 8)`

| 公仑 (1994 table) | tier | cap | 2077 table difference |
|---|---|---|---|
| 300-899 | 魔女 | 1 | same |
| 900-1499 | 强魔女 | 2 | same |
| 1500-4999 | 精英魔女 | 3 | same |
| 5000-14999 | 精锐魔女 | 4 | same |
| 15000-19999 | 准大魔女 | 5 | same |
| 20000-39999 | 大魔女 | 6 | 2077: 20000-299999 |
| 40000-99999 | 顶级 | 7 | 2077: 300000-749999 |
| ≥ 100000 | 天才 | 8 | 2077: ≥ 750000 |

- Seed rows are exempt; every seed row fits its card's range anyway (section 3).
- Legendary (`g:1`) and ring 9-10 rows are never available at creation.

### 5.3 Point prices

| item | points |
|---|---|
| canon spell, ring t | `spPtsRing(t) = 1 + Math.floor(t / 2)` → t0-1: 1 · t2-3: 2 · t4-5: 3 · t6-7: 4 · t8: 5 |
| each Lv above 1 (picks max Lv3) | +1 |
| custom spell | `spPtsRing(t)` + 2 from scratch, or +1 as a variant; +1 for a group spell; +1 at ×2, +2 at ×4; Lv as above |
| canon talent (天资/手艺/传承/专长/狠活) | 2, or 4 if `rare`; Lv2 costs +2 more (picks max Lv2) |
| custom talent | 3 |
| removing a seed or origin row | free, no refund. Seed rows show 「去掉会和开场描写对不上」 |

**Limits at creation:**
- At most 1 talent pick; 2 with a drawback.
- At most one 狠活.
- At most 2 custom spells.
- At most 1 custom talent.
- At most 10 spells in total.

### 5.4 Money path (现付)

- **Canon spell (non-legendary, gates passed):** add it for `spellPrice(run,d)` 元 and 0 points.
  - `spellPrice = spellCanonPrice(run,d) * eraMult(y)`.
  - This is also the recommended fix for the 图鉴 at 31867. r_spells §4 found that 2077 pays 1994 prices, which is a ×5 gap.
- **Custom spell:** 3× the price of its ring. Development is expensive (94:90634).
- **Not for talents.** Canon says talents are trained, not bought; the 2077 强化针 costs 150k per shot (77:2207) and is a phase-B in-game purchase.
- **Floor:** the total cash cannot take starting wealth below 500 (start() already clamps at 500, 30512). The panel shows 「现付合计 / 存款」.
- **Reference prices:** in 1994 a ring-1 costs 660 元 and a ring-3 costs 1460. In 2077 a ring-2 costs 5300 (more than paiqian77's 900 or linshigong77's 3200), so the 2077 闪灵 openers mostly spend points. This is the intent.

### 5.5 Power guard for custom spells

- **Tier cap.** Tier is `min(mastery tier, cuCap)`, using `RING_TIER_CAP` and `k`/`fx`. So a ring-1 custom blast is 2d6, rising to 4d6 at Lv4+, and never 10d8.
- **Cost floor.** The existing floor for blast/drain/control (`DND_SPCOST[lv]/4`) still applies, so levelling a cheap custom spell raises what it costs to cast.
- **Group spells** add ×1.5 cost and are limited to ring ≥ 2.
- **Canon spells stay uncapped** (open question Q1).

**Worked examples:**

| example | budget | spend | result |
|---|---|---|---|
| linshigong77 at 2800 公仑 (cap 3) | 6 | 偏转术 2 + 口齿 2 + 光亮术 1 = 5 | 1 point left |
| weida77 (cap 6) | 6 | 次级钢铁守护 (t5) 3 + 法术辨识 2 = 5 (精通先攻 is already the seed talent) | 1 point left |
| free 1994 start at 5700 公仑 (cap 4) | 10 | custom 「潮汐针」 t2 塑能 blast 水 group ×2 = 2+2+1+1 = 6, plus 魔法飞弹 1 and 闪光尘 2 = 9. One talent (2) would make 11 | Over by 1: take 学贷 (budget 11), or drop 闪光尘 |

### 5.6 Gates summary

- **Spells:** `x`, `no`, `g`, `e`, ring cap, and `q` (`o:` origin, `t:` talent on the panel). A talent's `unl` list unlocks matching `q` rows.
- **Talents:** `e`, `q`, rarity, and the counts above.
- **Re-validation** runs on every event in 4.5. Invalid rows turn red with a reason.
- **At 出发**, `regFinal()` lists the invalid rows in a `confirm()` (「以下几项不合条件，出发时会去掉：…」); confirming drops them and returns their points.

---

## 6. Engine hooks (line by line)

### 6.1 `Game.start()` (30474-30533)

```js
// 30502: the origin spell. Only when the panel is not in use (tests, old flows)
if (od.sp && !S.reg) S.run.spells[od.sp[0]] = { lv: 1, cost: od.sp[1], range: od.sp[2], desc: od.sp[3] };
// 30504
if (!S.reg) talentSeed(S.run);
// mana (30505-30511) unchanged: #inp-mana-n already includes the talent factor (4.5)
// 30522: OP_SETUP stays where it is (it no longer adds spells, see 6.3), then:
if (S.reg) { const r9 = regApply(S.run, S.reg, y); if (r9.dropped.length) U.toast("登记时去掉：" + r9.dropped.join("、"), 3600); }
```

```js
function regApply(run, reg, y) {                          /* P250 登记表落档：法术、未成法术、技能、天赋、代价、现付 */
  const ctx = regCtxFor(run, reg), dropped = [];          // same gates as the panel, using run.manaCap and run.origin
  run.spellLocks = run.spellLocks || {};
  for (const r of reg.sp) {
    const v = regRowOk(r, ctx); if (!v.ok) { dropped.push(r.n); continue; }
    opSpell(run, r.n, r.lv, r.cost, r.range, r.desc);
    const sp = run.spells[r.n];
    for (const k of ["nt", "cu", "s", "ty", "t", "k", "ar", "el", "fx", "base", "al"]) if (r[k] != null && r[k] !== "") sp[k] = r[k];
  }
  for (const L of reg.lock) if (!run.spells[L.n]) run.spellLocks[L.n] = { how: L.how, gf: L.gf, w: L.w, t: L.t, src: run.seed, y };
  for (const k of reg.sk) if (!run.skills[k.n]) run.skills[k.n] = { lv: k.lv, desc: k.d };
  for (const t of reg.tal) {
    if (!regTalOk(t, ctx).ok) { dropped.push(t.id); continue; }
    let id = t.id;
    if (t.src === "cu") { const def = Object.assign({}, t.def, { id: "tc_" + U.hash32(t.def.nm + "|" + run.id).toString(36), cu: 1, cat: t.def.cat || "专长" }); run.talentX[def.id] = def; id = def.id; }
    const got = talentAdd(run, id, t.lv); if (got && t.sp) run.talents[id].sp = t.sp;
  }
  if (reg.db.loan) { const amt = (reg.db.loan > 1 ? 4000 : 2000) * eraMult(y); opThread(run, "还学贷" + amt + "元", "起手时借的，利息照滚", ""); }
  if (reg.db.wound) run.conds.push({ name: "旧伤", note: "登记时自报：阴雨天发作", y });
  const cash = reg.sp.filter(r => r.cash && !dropped.includes(r.n)).reduce((a, r) => a + r.cash, 0);
  if (cash) run.wealth = Math.max(500, (run.wealth || 0) - cash);
  if (reg.pick) { run.identity = (run.identity ? run.identity + "，" : "") + "职业方向：" + reg.pick.replace("方向", ""); run.profile.status = run.identity; }
  const cus = reg.sp.filter(r => r.src === "cu" && !dropped.includes(r.n)).map(r => r.n);
  run.reg = { v: 1, budget: regBudget(reg), spent: regSpent(reg), cash, cu: cus, picks: reg.sp.filter(r => r.src === "pick").map(r => r.n) };
  run.chron.push({ y, t: "登记：起手点 " + run.reg.spent + "/" + run.reg.budget + (cus.length ? "；自创「" + cus.join("」「") + "」" : "") + (cash ? "；现付 " + U.fmtYuan(cash) : "") });
  return { dropped };
}
```

**Order matters.** `regApply` runs **after** `OP_SETUP`:
- Seed wealth overrides (30521) and setup wealth changes, such as konghuang's floor of 8000, happen first, so the cash is deducted from the final figure.
- opSpell merges keep the higher Lv.

### 6.2 Resolver (`dndSpellProfile` 7242-7263, `dndSpellPick` 7264-7271, `dndSpellCost` 7273-7280)

```js
const RING_TIER_CAP = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4];
function dndSpellProfile(nm, sp) {
  const c = typeof spellCanonOf === "function" ? spellCanonOf(nm) : null;
  const t = nm + " " + ((sp && sp.desc) || "") + " " + ((c && c.d) || "");
  let ty;
  if (sp && DND_STYPE[sp.ty]) ty = sp.ty;                  /* P250 自创／登记钦点的类别优先 */
  else if (c && DND_STYPE[c.ty]) ty = c.ty;                /* P250 正典行改判（缝合伤口→治愈 等） */
  else if (/畏惧(?:法术|魔法|术)?/.test(nm)) ty = "control";
  /* … the existing chain, unchanged … */
  const lv = (sp && sp.lv) || 1;
  let tier = lv >= 10 ? 4 : lv >= 7 ? 3 : lv >= 4 ? 2 : 1;
  if (sp && sp.cu && sp.t != null) tier = Math.min(tier, U.clamp(RING_TIER_CAP[U.clamp(sp.t, 0, 10)] + ((sp.k || 1) >= 4 ? 2 : (sp.k || 1) >= 2 ? 1 : 0) - (sp.fx ? 1 : 0), 1, 4));   /* P250 自创法术环位封顶 */
  const el = (sp && sp.el) || (t.match(/火|炎|冰|雷|电|水|风|酸|毒|光|暗|音|血|星/) || ["奥术"])[0].replace("炎", "火");
  const area = (ty === "blast" || ty === "drain") && (sp && sp.ar != null ? !!sp.ar : /雨|浪|潮|爆|群|风暴|龙卷|阵|海|漫天|域/.test(t));
  /* … D table and return unchanged, using tier/el/area … */
}
// dndSpellPick: match an alias too, but only with 简短施法
const hit = String(text || "").includes(n) || (sp && sp.al && sp.al.length >= 2 && (run.talents || {}).jianduan && String(text || "").includes(sp.al));
// spellModOf (12237): the same alias rule
// dndSpellCost, after the offensive floor and before easy mode:
const fm9 = run && run.talents && run.talents.shoulian; if (fm9 && fm9.sp === spl.name) cost = Math.round(cost / 2);   /* P250 法术熟稔 */
```

**Talent `eff` channel** (7124 `dndEffSum`, 7135 `dndHpMax`):

```js
function talentEffSum(run, key) {                          /* P250 专长的先攻／护甲／生命：与装备词条同一口径 */
  let m = 0;
  for (const t of (typeof talentList === "function" ? talentList(run) : [])) {
    const mm = String(t.eff || "").match(/^([a-z]+)([+-]\d+)$/); if (mm && mm[1] === key) m += +mm[2] * (1 + Math.floor(((t.lv || 1) - 1) / 2));
  }
  return U.clamp(m, -3, key === "hp" ? 8 : key === "init" ? 3 : 2);
}
function dndEffSum(run, key) { return dndPerksRaw(run).reduce(/* unchanged */, 0) + talentEffSum(run, key); }
function dndHpMax(run) { /* unchanged */ return 8 + tv * 4 + dndLevel(run) * 4 + Math.max(0, dndEffSum(run, "hp")); }
```

Check: `dndEffSum(run,"cha")` (7128) is unaffected because no talent uses `cha`.

### 6.3 OP_SETUP cleanup (13369-13589)

- **Delete these opSpell lines:** 13390-13392 (shengnv), 13409 (konghuang), 13458 (shixun), 13473 (guanxing), 13490 (piaoliu), 13504 (wanyan94), 13519 (saibo), 13539 and the 火球术 delete at 13541 (weida77), 13571-13573 and the delete at 13575 (zhanmo77).
- **Keep:** all the non-spell kit.
- **Change 照明术 → 光亮术** in the 圣火灯 bag text (13393) and in the shengnv scene (3448).
- **No-panel fallback.** When `S.reg` is absent (tests, or a direct `newRun`), call `regApply(run, regDefault(seed), y)`. `regDefault` builds the same rows `regFill` would, so a seed never comes out empty.
- **Coordination with the war spec.** r_war §13.1 adds `OP_SETUP.linshigong77` and `OP_SETUP.paiqian77` (org, job, gclass, NPCs). **They must not call `opSpell`**: spells live only in `sig`.
- **buxi77.** Neither spec owns its setup. Optionally add:
  - `opIdent("隐秘补习班 A2 魔植学员")`
  - `opNpc("马头魔女","同学",40,"往大腿扎清醒剂，全程不看你")`
  - `opThread("笔记本自己联网了","沙漏翻过来，第二节开始","今日")`

### 6.4 `applyStat` (28342…; spell branch 29023-29044)

```js
if (sp.op === "+") {
  if (run.spellLocks && run.spellLocks[sp.name]) { delete run.spellLocks[sp.name]; addAnnal && addAnnal("凑齐了条件，学会「" + sp.name + "」"); }   /* P250 未成法术到手 */
  if (!run.spells[sp.name]) { /* unchanged; when sp.ring / sp.school arrive (MVU), also set .t / .s */ }
  else { const ex = run.spells[sp.name]; if (!ex.cu) { if (sp.cost) ex.cost = sp.cost; if (sp.range) ex.range = sp.range; if (sp.desc) ex.desc = sp.desc; } }   /* P250 自创法术不许改口 */
}
```

- **MVU `SCHEMA.LEARN_SPELL`** (29237): add the optional fields `ring: ["int"]` and `school: ["str", 4]`, and map them at 29434.
- **Optional** `LEARN_TALENT: { req: ["name"], f: { name: ["str", 6] } }`, mapped to `stat.talent = "+" + name`. This closes the "no MVU command for talents" gap in r_spells §7.

### 6.5 normalizeRun (2993…)

```js
r.spellLocks = r.spellLocks || {};
if (!r.fx250) {                                            /* P250 一次性数据修：只改旧档里明显错的耗费串 */
  const s9 = r.spells || {};
  if (s9["法师之手"] && s9["法师之手"].cost === "420魔力值") s9["法师之手"].cost = "10魔力值";
  if (s9["照明术"] && /一晚上不到二十/.test(s9["照明术"].cost || "")) s9["照明术"].cost = "20魔力值";   // manaCost read this as 1
  r.fx250 = 1;
}
```

Nothing else changes. Spells are not renamed; aliases handle 照明术. The canon `ty` fixes apply at runtime to old saves, which is the intended combat fix, and the docs mention it.

---

## 7. AI prompt and adjudicator text (exact strings)

**1. Spell list** (27583):

```js
n + "·" + (sp.lv || 1) + "级" + (sp.mod ? "改" : "") + (sp.cu ? "·自创" + ((DND_STYPE[sp.ty] || {}).nm || "") : "")
```

**2. Spell details** (27584-27585). Append to each line:

```js
(sp.t != null ? "·" + sp.t + (eraByYear(run.year).id === "y2077" ? "环" : "级") : "") + (sp.s ? "·" + sp.s : "") + (sp.fx ? "／降级换来的特效：" + sp.fx : "") + (sp.nt ? "／她的用法：" + sp.nt : "")
```

**3. New line after 【法术详情】** (27643):

```js
const lockTxt = Object.entries(run.spellLocks || {}).slice(0, 4).map(([n, l]) => n + "（" + l.how + "）").join("｜");
(lockTxt ? "【未成法术】（她知道、还没到手；剧情里真凑齐了条件才写 法术：+名）" + lockTxt + "\n" : "")
```

**4. Talent spec** (27702). Build the list instead of hard-coding it, and correct the "表外驳回" claim, because the code actually grows a 专长 (28699-28704):

```js
"天赋：（可选，剧情里实打实练出、打针打出或得高人传授时写：天赋：+名。表内名目：" + TALENT.filter(t => !t.e || t.e === eraByYear(run.year).id).map(t => t.nm).join("/") + "；同名再给即精进一级，最高三级。表外的名目会长成一门剧情专长（一局至多十二门），不要随手给——原著里练一门专长要几个月）"
```

**5. Spell spec** (27722). Append:

```
标「自创」的是玩家登记的法术：消耗、范围、效果以登记为准，正文与状态栏都不得改写，可以精进。【未成法术】凑齐条件才写 法术：+名。
```

**6. Persona line** (27599). Show the 法术熟稔 parameter:

```js
t.nm + (t.id === "shoulian" && (run.talents.shoulian || {}).sp ? "：" + run.talents.shoulian.sp : "") + …
```

Custom talents already carry `d`.

**7. Adjudicator** (29843-29846). Before `"\n敌人等级对照"`, append:

```js
const cu9 = Object.entries(run.spells || {}).filter(([, s]) => s && s.cu).slice(0, 6).map(([n, s]) => n + "＝" + dndSpellProfile(n, s).nm).join("、");
(cu9 ? "她的自创法术（类别由引擎定，名字照抄）：" + cu9 + "。点名施放轰击、汲取、控制类冲着敌人时 kind 写 attack 并给 foe；护持、预读、幻惑、变身、召唤、治愈、仪式类写 check。" : "")
```

Canon spells need no adjudicator change, because `dndResolve` already upgrades an offensive `check` to `attack` when a foe exists (7735).

---

## 8. 资料库 editing

### 8.1 法术 tab (32066-32093, dbEdit 32180-32186, handlers 33459-33464)

- **List rows.** Add a `desc` input; it was missing (`data-df="desc"`, slice 40).
- **Tag after the name:**
  - `ring+unit·school·type` from `dndSpellProfile`.
  - 「自」 when `cu`.
  - `nt` in the row tooltip.
- **Custom rows** also get a 「改」 button. It opens `#ov-regpick` on the 自创 tab in edit mode, prefilled. Saving rewrites `s, ty, t, k, ar, el, fx, cost` but keeps `lv` and `lvY`, and logs 「改了自创法术「X」的模型（手录）」 in chron.
- **Locked spells** sit at the bottom of the list, dimmed, with `how`:
  - `gf` lock: 「公分兑换 N」 is enabled when `run.gongfen >= gf`. On click: subtract gf, `opSpell`, delete the lock, chron 「用公分换了「X」（原著 2077:2337）」.
  - `w` lock: 「购入 X元」 at `w × eraMult`.
  - Story-only locks have no button.
- **图鉴 view:**
  - Hide `x` rows.
  - Show `no` rows as 「须剧情」.
  - Show the `q` reason.
  - Use `spellPrice` (×eraMult; Q4).
- **Two buttons in the list header:**
  - 「＋自创（立项）」: the same form. Costs the money path (3× the ring price × eraMult), starts at Lv1 with `lvY = year`, chron 「立项开发「X」」.
  - 「＋补录」: free. For spells the AI forgot to record; logged as 「手录」. This matches the existing free Lv editing.

### 8.2 天赋 tab (31984-31989, talentHTML 31787-31822)

- **Grouping.** `talentHTML` iterates `["天资","手艺","传承","专长","狠活"]` and adds a sixth group, 「剧情与自创」, which lists `run.talentX`. Today the story-grown talents are invisible here.
- **Owned rows** get a Lv select (1-3) and 删, both manual corrections:
  - New handlers `data-tlv` / `data-tdel` in the delegation at 33441-33475.
  - dbEdit/dbDel branch `dbTab === "talent"`.
- 法术熟稔 shows a select of owned spells (`data-tsp`).
- **Unowned rows** get 「补录」 (free, chron 「手录天赋」). Locked talents (`tlock`, stored in `run.talentLocks`) show their `how`.
- 「＋自创专长」 uses the same form; the 12-talent cap on `talentX` applies.
- **Count** (31987): 「已得 N 门 · 名录 35 门 · 剧情/自创 M 门」.

---

## 9. Save compatibility

- **New run fields** are all optional: `spellLocks`, `talentLocks`, `reg`, `fx250`. Spell entries gain `nt, cu, s, ty, t, k, ar, el, fx, base, al`; talent entries gain `sp`. Old code paths ignore them.
- **Export/import** (`exportRun`) already serialises the whole run, so nothing is needed there.
- **Old saves keep their spells exactly as they are.** The only migration is the two cost strings in 6.5.
- **Runtime classification changes** from 2.1 affect old saves:
  - 缝合伤口 heals instead of draining.
  - 寒冷之触 drains instead of controlling.
  - 瞬视震荡术 controls instead of blasting.
  - 殴打术 blasts.
  - 加速术 gives foresee.

  Docs section 11 states this.
- **Old 1994 shixun saves** keep their 殴打术. That is harmless and needs no migration.
- **TALENT ids** only grow. `talentOf` still resolves old `tg_` ids; the new ids don't collide.
- **The audit** (29513-29520) needs no change.

---

## 10. Test plan (Playwright, same harness as `scratchpad/dnd_test.cjs`: global playwright, `file://@@REPO@@/index.html`)

| # | test | pass criteria |
|---|---|---|
| T1 | Boot | No `pageerror`. `#reg-st` exists. 「起手点 10 / 10」 with no seed |
| T2 | Each of the 13 cards: click, read `S.reg.sp`, then `Game.start()` | Spell names and Lv equal section 3 (origin 魔女, or the suggested origin for piaoliu/wanyan94). `run.spellLocks` keys equal the locks. Talents = `ORIGIN_TALENT[origin]` (if any) plus `sig.tal`; for 魔女, `sig.tal` only, or 稳手 for haixuan. **No 1994 run has a spell whose canon `e === "y2077"`.** weida77 and zhanmo77 have no 火球术 |
| T3 | Classification table | `dndSpellProfile(n, run.spells[n]).ty`: 缝合伤口 heal, 修复死灵 ritual, 法师之手 ritual, 保密之语 ritual, 隐形仆役 ritual, 召唤印记 ritual, 喵嗷之爪 ritual, 加速术 foresee, 寒冷之触 drain, 瞬视震荡术 control, 殴打术 blast, 油腻术 control, 活化绳 control, 偏转术 ward, 治愈魔女术 heal. 炎爆术 `el === "火"`. `dndSpellCost` of 光亮术 = 10 (20, halved by easy mode) |
| T4 | Picker gates | paiqian77 with `#inp-mana-n` = 1200: 火球术-tier rows (t3) disabled, reason 「要 ≥ 1500 公仑」. Set 1600 → enabled. Year 1994 → 偏转术 not listed. 创造闪光猫灯 disabled for 魔女 and enabled for 猫灯眷属 |
| T5 | Points | linshigong77: add 偏转术 → 「4 / 6」. Lv+1 → 「3 / 6」. A third talent pick is disabled until 学贷 is ticked. Unticking 学贷 while that leaves spent > budget is refused |
| T6 | Custom spell | 「潮汐针」, 塑能, blast, 水, group, ring 2, ×2: readout 「耗 780 魔力值」, 6 points. Start → `run.spells.潮汐针` has `{cu:1, ty:"blast", t:2, k:2, ar:1, el:"水", cost:"780魔力值"}`. Set lv 10 → `dndSpellProfile(...).tier === 3` and dice `"6d8"` |
| T7 | Name validation | 「火球术」 refused (canon). 「火球」 refused while 火球术 is on the panel (substring). An 11-character name is refused. 「照明术」 refused (alias of 光亮术) |
| T8 | Resolver | `dndResolve(run, {kind:"attack", foe:{name:"保安", lv:1}}, "我放潮汐针")` → `out.spell.ty === "blast"`, mana is paid, and the foe takes damage or the attack misses. With a custom control spell: `foe.stun > 0` on success |
| T9 | Talents | Add 精通先攻 → `dndInit` +2. Custom talent 陆战出身 hp+4 → `dndHpMax` +4. 法术熟稔 on 法师护甲 → `dndSpellCost` halves |
| T10 | Mana talent | Free start, add 魔力渊薮 → `#inp-mana-n` = round(base × 1.25). Remove → back to base. After typing a mana value by hand, talents no longer change it |
| T11 | AI protection | `PromptM.applyStat(run, {spells:[{op:"+", name:"潮汐针", cost:"1魔力值", desc:"x"}]})` → unchanged. `{op:"^", name:"潮汐针", d:1}` → Lv+1 (lvY rule intact) |
| T12 | Locks | linshigong77: `run.gongfen = 12`; 资料库 法术 tab → 「公分兑换 12」 → 殴打术 learned, gongfen 0, lock gone. `applyStat` with `{op:"+", name:"水疗术"}` on paiqian77 → lock deleted |
| T13 | Prompt | `PromptM.buildSystem(...)` for a run with a custom spell contains 「自创」, 「【未成法术】」 and the dynamic talent list including 「法术辨识」. The adjudicator system string contains 「她的自创法术」 (intercept with a `Prov.chat` stub) |
| T14 | Old save | Import a beta19 run fixture with `照明术 {cost:"一晚上不到二十魔力值"}` and 法师之手 420 → no throw, costs migrated, `fx250 === 1`, 照明术 is ritual via the alias |
| T15 | Layout | Viewports 1400×900 and 390×844, eras 1994 and 2077, light and dark: `#reg-card.scrollWidth <= clientWidth`. `#ov-regpick` is full-screen on the phone with tabs reachable. Take screenshots for visual review |
| T16 | Balance sim | For each opener, 400 fights against a `dndPeerLv` foe using the quick-cast pick (7696): win rate ≥ 85% (the docs claim about 95% with spells). linshigong77 and paiqian77 against lv1-2 foes ≥ 80%. Report the delta against beta19 |
| T17 | Static | Grep: `opSpell(` appears only in its definition, `medalRedeem` and `regApply` (not in `OP_SETUP`). Every `sig.sp` name resolves via `spellCanonOf`. All `SPELL_CANON` names are unique and ≤ 10 characters |

---

## 11. 使用说明 snippet (Chinese, for the release notes)

```
- **开局特色法术（P250）**：十三个开局各配了三到六门照原著挑的法术，带等级和她自己的用法，另有一两门「未成法术」写明怎么到手（如上岸第一周的殴打术：调去安保办，或攒 12 公分兑换；海选报名日的飞行术：配方在手、材料还缺）。三张 2077 闪灵开局（上岸第一周、派遣日结、A2 补习）以前只有一门火球术，现在各有一套：油腻术、活化绳、魔女内战必备的防御邪恶；治愈魔女术、偏转术、通晓语言恒定领域……雪楠湖试训不再带 2077 的殴打术，换成魔法飞弹和闪光尘；圣女在上的照明术按原著改叫光亮术。每个开局还带一门对口的天赋（法术辨识、精通先攻、模拟伪神法术……）。
- **登记表：法术与天赋**：登记表多了一栏「法术 · 天赋」。开局的法术和天赋先摆在上面，可以去掉；另有起手点（开局卡 6 点，海选 8 点，自由开局 10 点）用来添：
  - 已有法术：从原著法术里挑，按学派、环位、类别筛；魔力档决定最高能挑几环（不到 900 公仑 1 环，精英魔女 3 环，精锐 4 环……原著：毕业生刚掌握 3 级法术），传奇法术登记时不能挑。也可以拿起始存款现付。
  - 自创法术：起名、选学派和类别、定环位、元素、单体或群体、耗魔系数，可以「法术降级」换一句特效（原著 1994:89889）。消耗由环位算出来，威力按环位封顶：低环的自创法术练到十级也不会变成传奇炮。改良已有法术比从零开发便宜（原著 1994:89864）。名字不能和原著法术重，改良的要另起名（原著 2077:19282）。
  - 天赋：多了一类「专长」（法术辨识、奇物使用者、披甲施法者、抄录卷轴、精通先攻、战斗施法、法术熟稔、强韧身躯、简短施法……），登记时只挑一门；勾一项代价（背学贷或旧伤）多一点、可再挑一门。也能自创一门专长，效果从一张小表里选一项。
- **法术归类修正**：缝合伤口算治愈、修复死灵和法师之手算仪式、加速术算预读、寒冷之触算汲取、瞬视震荡术算控制、殴打术算轰击；炎爆术认作火系。旧存档里的这些法术上战场会按新类别走。
- **资料库**：法术能改说明，自创法术能改模型；未成法术列在最后，公分够了直接兑换。天赋页列出剧情里长出来的和自创的专长，可以补录、改等级、删除（记作手录）。
```

---

## 12. Coordination and open questions

**Coordination**

- **War spec (r_war §13.1):**
  - The `OP_SETUP` for linshigong77 and paiqian77 must not call `opSpell`.
  - 防御邪恶 and 防护负能量侵袭 (linshigong77) are the 内战 defence hook. A 馆内斗 curse event (77:3269) should grant advantage, or block it, when she owns either.
  - If the war spec sets `run.job` with `gov:1`, she earns 公分 every year (4082), which makes the 12-公分 殴打术 unlock reachable in about a year.
  - zhanmo77's 次级钢铁守护结界 is the canon anti-mortal-army ward for 掠夺战争 (77:33252-33256).
- **Isle spec:** no overlap.
- **Docs P-numbers:** renumber at merge.

**Open questions for the designer**

- **Q1.** Apply `RING_TIER_CAP` to canon spells too? Today a ring-1 canon spell at Lv10 gets tier 4, softened only by the cost floor. Default is no, to avoid changing combat in old saves.
- **Q2.** Are the budgets 6 / 8 / 10 and a cap of 2 drawback points right? A tighter variant is 5 / 7 / 8.
- **Q3.** Is it acceptable that the 资料库 「补录」 for talents is free? It matches the free spell Lv editing, but players can use it to bypass the creation budget.
- **Q4.** Fix the 图鉴 price (`spellCanonPrice × eraMult`)? It makes 2077 spell purchases cost 5× more. Recommended, because every other price already scales with eraMult.
- **Q5.** Should a suggested origin (piaoliu → 亡灵魔女, wanyan94 → 猫灯眷属) switch the select automatically on card click (proposed), or only show a hint?
- **Q6.** paiqian77's 偏转术 note credits 「交班的同事」. If the colleague 小蛋糕 is canon 爱知, she looks childlike, so keep that scene modest; the note avoids naming her on purpose.
- **Q7.** Should 化身巨龙 (SPELL_CANON t3, "化身为…巨龙") be `no:1`? At ring 3 it is pickable for 2 points, which reads oddly in the story, although its mechanics are only a shift buff.
- **Q8.** Phase B (not in this spec):
  - In-game talent training as a thread that completes after months.
  - 强化针 purchase (150k, 77:2207).
  - Investors for 立项开发 (94:90641).
  - Wiring `talentTieF` and 皮实 `hurt`.
