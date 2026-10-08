#!/bin/bash
# 单件近景：review/ad_cam.sh out.png 型号 file era part lv bad yaw pitch dist tx ty tz
cd "$(dirname "$(readlink -f "$0")")/.." || exit 1
n() { local v=$1; case "$v" in .*) v="0$v";; -.*) v="-0${v#-}";; esac; echo "$v"; }
o=$1 t=$2 f=$3 era=$4 part=$5 lv=$6 bad=$7 Y=$(n $8) P=$(n $9) D=$(n ${10}) TX=$(n ${11:-0}) TY=$(n ${12:-0.8}) TZ=$(n ${13:-0})
for k in 1 2 3; do
  r=$(node shot.cjs "$o" "{\"showroom\":[{\"type\":\"$t\",\"lv\":$lv,\"bad\":$bad}],\"era\":\"$era\",\"part\":\"$part\",\"cam\":{\"yaw\":$Y,\"pitch\":$P,\"dist\":$D,\"tx\":$TX,\"ty\":$TY,\"tz\":$TZ},\"wait\":1000}" "models/$f.js" 2>&1 | tail -1)
  [ -s "$o" ] && break
done
echo "$o $(echo "$r" | grep -o '"errs":\[[^]]*\]')"
