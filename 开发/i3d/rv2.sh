#!/bin/bash
# 大岛 8 位混排复查截图（spec_isle §5.3）：A 批、B 批 × y1994/y2077 × 午/夜，共 8 张，出到 review/mix{A,B}_{era}_{part}.png
# 用法：./rv2.sh [A|B|AB] [cam-json|-] [wait-ms] [tag]
#   ./rv2.sh                                        全部 8 张，默认机位（岛的 home 视角）
#   ./rv2.sh A                                      只拍 A 批的 4 张
#   ./rv2.sh B '{"yaw":2.3,"pitch":.45,"dist":26}'  B 批换个机位；"-" 表示默认机位
#   ./rv2.sh AB - 3000 v2                           文件名加后缀：review/mixA_y1994_午_v2.png
# 模型：models/*.js 里现有的都载（下划线开头的跳过，顺序同 embed.py）。还没写出来的新型号不载，
# 那一位会画成灰盒子 bGeneric，下面会列出来；别的位照常出图，所以模型没齐也能跑。
cd "$(dirname "$(readlink -f "$0")")" || exit 1
BATCH=${1:-AB}; CAM=${2:--}; WAIT=${3:-2500}; TAG=${4:+_$4}
[ "$CAM" = "-" ] && CAM=null

A='[["哨塔",3],["兵营",2],["停鸡坪",3],["酒馆",2],["浴场",3],["展馆",3],["魔女塔",3],["港桥",2]]'
B='[["龙场",3],["猫舍",3],["观星台",3],["防风屏障",3],["田圃",2],["牧栏",2],["民宿",3],["货仓",1]]'
declare -A FILE=([魔女塔]=tower [工坊]=workshop [田圃]=farm [牧栏]=pasture [药圃]=herb [民宿]=inn [货仓]=depot [港桥]=harbor
  [哨塔]=watchtower [兵营]=barracks [停鸡坪]=landing [酒馆]=tavern [浴场]=bath [展馆]=museum
  [龙场]=dragonyard [猫舍]=cattery [观星台]=observatory [防风屏障]=windwall)

# 模型文件列表：ORDER 在前，其余按字母；只列确实存在的
ORDER="castle tower workshop farm herb pasture inn"
M=""
for m in $ORDER; do [ -f "models/$m.js" ] && M="$M,models/$m.js"; done
for f in $(ls models/*.js 2>/dev/null | LC_ALL=C sort); do
  b=$(basename "$f" .js); case "$b" in _*) continue;; esac
  case " $ORDER " in *" $b "*) continue;; esac
  M="$M,models/$b.js"
done
M=${M#,}

shoot() {  # $1=批名 $2=facs
  local miss=""
  for t in $(echo "$2" | grep -o '"[^"]*"' | tr -d '"'); do [ -f "models/${FILE[$t]}.js" ] || miss="$miss $t"; done
  [ -n "$miss" ] && echo "[$1] 还没有模型文件（画成灰盒子）:$miss"
  for era in y1994 y2077; do for part in 午 夜; do
    out="review/mix${1}_${era}_${part}${TAG}.png"
    r=$(node shot.cjs "$out" "{\"size\":\"大岛\",\"era\":\"$era\",\"part\":\"$part\",\"facs\":$2,\"wait\":$WAIT,\"cam\":$CAM}" "$M" 2>&1)
    echo "$out  $(echo "$r" | tail -1 | cut -c1-400)"
  done; done
}
case "$BATCH" in *A*) shoot A "$A";; esac
case "$BATCH" in *B*) shoot B "$B";; esac
