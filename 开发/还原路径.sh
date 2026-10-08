#!/bin/sh
# 把占位符换回真实路径。在复制出来的「开发」文件夹里跑（别在仓库里跑）：
#   sh 还原路径.sh <仓库路径> [原著目录]
# @@SP@@ → 这个文件夹；@@REPO@@ → 仓库；@@NOVEL@@ → 原著所在目录（不给就留空，读原著的测试会跳过或报错）
cd "$(dirname "$0")" || exit 1
SPD=$(pwd)
REPO=${1:?用法：sh 还原路径.sh <仓库路径> [原著目录]}
NOVEL=${2:-}
find . -type f \( -name '*.cjs' -o -name '*.js' -o -name '*.sh' -o -name '*.py' -o -name '*.html' \) ! -name '还原路径.sh' \
  -exec sed -i "s#@@SP@@#$SPD#g; s#@@REPO@@#$REPO#g; s#@@NOVEL@@#$NOVEL#g" {} +
# three.js：游戏里内嵌的那一份就是 harness 要的 bundle
python3 - "$REPO/index.html" i3d/build/three.bundle.js <<'PY'
import sys
s = open(sys.argv[1], encoding='utf-8').read()
tag = '<script type="text/plain" id="three-src">'
a = s.index(tag) + len(tag); b = s.index('</script>', a)
open(sys.argv[2], 'w', encoding='utf-8').write(s[a:b])
PY
# 对比测试要加种族之前的旧版页面（beta19.2）
git -C "$REPO" show 3c3e159:index.html > sim/alt/index_pre_p250r.html
echo "done: SP=$SPD REPO=$REPO NOVEL=$NOVEL"
