#!/bin/sh
# P250r: syntax check + all R1/R2/R3/speaker regressions + round-2 alt presence/location (r2_loc) + round-2 race/梅网 gate (r2_race) on desktop and 390x844 phone. Usage: sh run_all.sh
cd "$(dirname "$0")"
node -e "const s=require('fs').readFileSync('@@REPO@@/index.html','utf8');const re=/<script>([\s\S]*?)<\/script>/g;let m,n=0;while((m=re.exec(s))){new Function(m[1]);n++}console.log('scripts ok',n)" || exit 1
fail=0
for vp in desktop phone; do
  for t in spk_cases.cjs spk_openers.cjs race_r3.cjs ctx_r2.cjs mei_r1.cjs r2_loc.cjs r2_race.cjs; do
    node "$t" "$vp" > "out_${t%.cjs}_$vp.txt" 2>&1 || fail=1
    tail -2 "out_${t%.cjs}_$vp.txt" | grep -v '^page errors' | grep -v '^$'
  done
done
exit $fail
