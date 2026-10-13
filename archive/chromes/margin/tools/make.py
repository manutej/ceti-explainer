#!/usr/bin/env python3
"""Build THE MARGIN films with the runtime's build.py (--kit inlines glyph data + kit before the film).
   python3 tools/make.py shared|native|all"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RT = os.path.abspath(os.path.join(os.environ.get('CETI_ROOT') or os.path.join(HERE, '..', '..'), 'runtime', 'tools'))
def make(name):
    subprocess.run([sys.executable, os.path.join(RT, 'build.py'), os.path.join(HERE, f'{name}.film.js'), '--kit',
                    os.path.join(HERE, 'margin.glyphs.js'), os.path.join(HERE, 'margin.kit.js'), '--out', os.path.join(HERE, 'build')],
                   check=True, stdout=subprocess.DEVNULL)
for n in (['shared', 'native'] if sys.argv[1:] == ['all'] else sys.argv[1:]):
    make(n)
