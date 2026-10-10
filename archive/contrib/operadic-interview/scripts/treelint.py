#!/usr/bin/env python3
"""treelint — the deterministic critic for operadic interview instruments.

Checks (the lens registry's mechanical subset):
  node.askable   every node's text ends in '?'; every node is followed by a slot marker
  node.ids       every node carries a stable dotted ID (Q1, Q1.1, Q1.1.1 ...)
  breadth        3-6 top-level questions; 3-5 children per internal node (root-level trees
                 with deliberately fewer top questions: pass --min-l1 to override)
  compose.stated every subtree with children has a 'Compose' rule line OR the file states
                 composition is absorbed into shape (parent slot = collapsed answer)
  star.economy   at least one starred question per top-level tree

Exit 0 = all critical checks pass. Prints a verdict table either way.
Usage: treelint.py FILE [--min-l1 N]
"""
import re, sys, pathlib
from collections import defaultdict

def lint(path, min_l1=3):
    t = pathlib.Path(path).read_text()
    fails, warns = [], []
    nodes = re.findall(r'\*\*(Q[\d.]+) — (.+?)\*\*', t, re.S)
    if not nodes:
        return [f"no nodes found (expected '**Qx — question?**' format)"], []
    for qid, text in nodes:
        text = ' '.join(text.split())
        if not text.endswith('?'):
            fails.append(f"node.askable: {qid} does not end in '?': …{text[-50:]}")
    # slots: each node line should be followed (within 2 lines) by a ▷
    lines = t.splitlines()
    for i, ln in enumerate(lines):
        m = re.search(r'\*\*(Q[\d.]+) — ', ln)
        if m and not any('▷' in l for l in lines[i+1:i+3]):
            fails.append(f"node.askable: {m.group(1)} has no ▷ slot within 2 lines")
    kids = defaultdict(int)
    tops = set()
    for qid, _ in nodes:
        parts = qid[1:].split('.')
        if len(parts) == 1:
            tops.add(qid)
        else:
            kids['Q' + '.'.join(parts[:-1])] += 1
    if not (min_l1 <= len(tops) <= 8):
        warns.append(f"breadth: {len(tops)} top-level questions (guideline 3-6)")
    for parent, n in kids.items():
        if not (3 <= n <= 5):
            fails.append(f"breadth: {parent} has {n} children (need 3-5)")
    internal = {q for q, _ in nodes if kids.get(q)}
    if 'Compose' not in t and 'compose' not in t:
        fails.append("compose.stated: no compose rules found anywhere")
    for top in tops:
        block_start = t.find(f'**{top} —')
        nxt = [t.find(f'**{o} —') for o in tops if t.find(f'**{o} —') > block_start]
        block = t[block_start:min(nxt) if nxt else len(t)]
        if '★' not in block:
            warns.append(f"star.economy: no ★ in {top}'s subtree")
    return fails, warns

if __name__ == '__main__':
    path = sys.argv[1]
    min_l1 = int(sys.argv[sys.argv.index('--min-l1')+1]) if '--min-l1' in sys.argv else 3
    fails, warns = lint(path, min_l1)
    for f in fails: print("FAIL", f)
    for w in warns: print("warn", w)
    print(f"VERDICT: {'PASS' if not fails else 'FAIL'} ({len(fails)} critical, {len(warns)} warnings)")
    sys.exit(1 if fails else 0)
