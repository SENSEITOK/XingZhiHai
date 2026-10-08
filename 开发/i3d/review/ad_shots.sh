#!/bin/bash
# 美术总复查：样品间 Lv1/Lv2/Lv3/Lv3待修 × y1994/y2077 × 午/夜 → review/ad/<file>_<era>_<part><tag>.png
# 用法：review/ad_shots.sh [file-names-csv] [tag] [eras] [parts]
cd "$(dirname "$(readlink -f "$0")")/.." || exit 1
declare -A T=([watchtower]=哨塔 [barracks]=兵营 [landing]=停鸡坪 [tavern]=酒馆 [bath]=浴场 [museum]=展馆 [dragonyard]=龙场 [cattery]=猫舍 [observatory]=观星台 [windwall]=防风屏障)
LIST=${1:-watchtower,barracks,landing,tavern,bath,museum,dragonyard,cattery,observatory,windwall}; TAG=${2:+_$2}
ERAS=${3:-y1994 y2077}; PARTS=${4:-午 夜}
one() { local f=$1 t=$2 era=$3 part=$4 tag=$5
  local sr="[{\"type\":\"$t\",\"lv\":1},{\"type\":\"$t\",\"lv\":2},{\"type\":\"$t\",\"lv\":3},{\"type\":\"$t\",\"lv\":3,\"bad\":1}]"
  local o="review/ad/${f}_${era}_${part}${tag:+_$tag}.png"
  local r k; rm -f "$o"
  for k in 1 2 3; do r=$(node shot.cjs "$o" "{\"showroom\":$sr,\"gap\":4.2,\"era\":\"$era\",\"part\":\"$part\",\"wait\":1200}" "models/$f.js" 2>&1 | tail -1); [ -s "$o" ] && break; done
  echo "$o $(echo "$r" | grep -o '"errs":\[[^]]*\]')"
}
export -f one
for f in ${LIST//,/ }; do for era in $ERAS; do for part in $PARTS; do echo "$f ${T[$f]} $era $part ${TAG:-_}"; done; done; done |
  xargs -P 3 -L 1 bash -c 'one "$0" "$1" "$2" "$3" "${4#_}"'
