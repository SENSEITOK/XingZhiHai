#!/bin/bash
# 大岛混排高清图：review/ad_big.sh A|B era part [tag] [cam-json]  → review/ad/big{A,B}_{era}_{part}{_tag}.png（2400×1600，便于裁切细看）
cd "$(dirname "$(readlink -f "$0")")/.." || exit 1
A='[["哨塔",3],["兵营",2],["停鸡坪",3],["酒馆",2],["浴场",3],["展馆",3],["魔女塔",3],["港桥",2]]'
B='[["龙场",3],["猫舍",3],["观星台",3],["防风屏障",3],["田圃",2],["牧栏",2],["民宿",3],["货仓",1]]'
ORDER="castle tower workshop farm herb pasture inn"; M=""
for m in $ORDER; do [ -f "models/$m.js" ] && M="$M,models/$m.js"; done
for f in $(ls models/*.js | LC_ALL=C sort); do b=$(basename "$f" .js); case "$b" in _*) continue;; esac; case " $ORDER " in *" $b "*) continue;; esac; M="$M,models/$b.js"; done
M=${M#,}
[ "$1" = A ] && F=$A || F=$B
CAM=${5:-null}
o="review/ad/big$1_$2_$3${4:+_$4}.png"
for k in 1 2 3; do
  r=$(node shot.cjs "$o" "{\"size\":\"大岛\",\"era\":\"$2\",\"part\":\"$3\",\"facs\":$F,\"wait\":2500,\"w\":2400,\"h\":1600,\"cam\":$CAM}" "$M" 2>&1 | tail -1)
  [ -s "$o" ] && break
done
echo "$o $(echo "$r" | cut -c1-200)"
