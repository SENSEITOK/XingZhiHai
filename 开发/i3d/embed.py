# 把 geo.js + geo2.js + render.js + models/*.js 拼成 isle3d.js，并替换 index.html 里 P246 那一段（到 const MapM 之前）
# 用法：python3 embed.py               拼 isle3d.js，并写进 index.html（只在最后跑，先确认没人在改 index.html）
#       python3 embed.py --build-only  只拼 isle3d.js，绝不读写 index.html（中途让 harness/audit 吃到 geo、render 的改动）
import os, re, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
BUILD_ONLY = '--build-only' in sys.argv[1:]
R = '@@REPO@@/index.html'
ORDER = ['castle', 'tower', 'workshop', 'farm', 'herb', 'pasture', 'inn']
ms = [f[:-3] for f in os.listdir('models') if f.endswith('.js') and not f.startswith('_')]
ms = [m for m in ORDER if m in ms] + sorted(m for m in ms if m not in ORDER)
parts = [open(f, encoding='utf-8').read().rstrip() + '\n' for f in ['geo.js', 'geo2.js', 'render.js']] + [open('models/%s.js' % m, encoding='utf-8').read().rstrip() + '\n' for m in ms]
js = ''.join(parts)
open('isle3d.js', 'w', encoding='utf-8').write(js)
if BUILD_ONLY:
    print('build-only: models', ms, 'isle3d', round(len(js) / 1024), 'KB (index.html untouched)')
    sys.exit(0)
s = open(R, encoding='utf-8').read()
a = s.index('/* ================= P246 空岛立体（Three.js）'); b = s.index('const MapM = (() => {')
assert a < b
s = s[:a] + js + s[b:]
open(R, 'w', encoding='utf-8').write(s)
print('models', ms, 'isle3d', round(len(js) / 1024), 'KB')
