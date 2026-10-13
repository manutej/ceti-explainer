#!/usr/bin/env python3
"""reliability-data · recompute every number the RELIABILITY wave films draw from the two open-data clones.

Run:  python3 -I factory/topics/reliability-data/recompute.py [--write] [HYPER_DIR] [RETHINK_DIR]
      defaults: /home/user/data/hyper-tau-bench  /home/user/data/rethinking-agent-evaluation

Stdlib only, deterministic, reads the clones as untrusted data (json/regex only, nothing from them is imported or run).
Without --write it only prints. With --write it regenerates, next to this script, four compact files (each <= 60 KB):
  hyper-tau-summary.json   leaderboard: 6 configurations x 4 domains, expert ceiling, 53 = 6+6+6+35, reproduction checks
  hyper-tau-builds.json    the 53 sampled builds: builder, steps, calls, client messages, eval passed / total, final reward
  hyper-tau-matrix.json    the real grid: scenario x build pass bits (airline 67x6, retail 134x6, telecom 119x6, banking 9 groups)
  rethinking-design.json   paper 3's open part: axes, anchors, grid sizes, calibration/ICC formulas (NO trajectories in the clone)
  princeton-dashboard.json hand-copied search-snippet values (grade B), not recomputed; kept here so a film cites one file

What the clones contain (and do not):
  hyper-tau-bench  yes: leaderboard rows for six configurations (domain means), the expert row, 53 task contracts, and ONE
                   sampled build per task (mixed configurations) with the pass/fail of every evaluation simulation.
                   no : a per-task x configuration matrix (each task was built by one configuration in the sample).
  rethinking-...   yes: code, grids (specs), anchors (REFERENCE / BACKBONE / TRIVIAL / MARGIN), answer keys.
                   no : trajectories or score tables (they are on Hugging Face, blocked by egress). The 54 % is NOT recomputable.
"""
import json, os, re, sys, glob, math
from collections import Counter, defaultdict
from math import comb

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
WRITE = '--write' in sys.argv
HYPER = ARGS[0] if len(ARGS) > 0 else '/home/user/data/hyper-tau-bench'
RETHINK = ARGS[1] if len(ARGS) > 1 else '/home/user/data/rethinking-agent-evaluation'
DOMAINS = ['airline_plus', 'retail_plus', 'telecom', 'banking_knowledge']
SCORE_KEY = {'airline_plus': 'airline', 'retail_plus': 'retail', 'telecom': 'telecom', 'banking_knowledge': 'banking'}
OUT = {}


def r1(x):
    return round(x + 1e-12, 1)


def jload(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def say(*a):
    print(*a)


def natkey(s):
    m = re.search(r'(\d+)$', s)
    return (0, int(m.group(1)), s) if m else (1, 0, s)


# ----------------------------------------------------------------------------------------------------------------------
# 1. Leaderboard (paper 2): six configurations, the expert row, the 53-task weighting
# ----------------------------------------------------------------------------------------------------------------------
sub_root = os.path.join(HYPER, 'web/leaderboard/public/hyper-submissions')
manifest = jload(os.path.join(sub_root, 'manifest.json'))
ref = jload(os.path.join(sub_root, 'reference.json'))
configs = []
for name in manifest['submissions']:
    s = jload(os.path.join(sub_root, name, 'submission.json'))
    configs.append({
        'id': name, 'harness': s['harness']['name'], 'model': s['builder']['model_name'],
        'effort': s['builder']['reasoning_effort'], 'date': s['submission_date'],
        'overall': s['scores']['overall'], 'airline': s['scores']['airline'], 'retail': s['scores']['retail'],
        'telecom': s['scores']['telecom'], 'banking': s['scores']['banking'],
        'build_min': s['build_time_min'], 'build_usd': s['build_cost_usd'], 'serve_credit_ratio': s['serve_credit_ratio'],
    })

# task counts per domain from the release manifest table (rows that start with | `NNN_`)
mtxt = open(os.path.join(HYPER, 'data/tau2/hyper/tasks/MANIFEST.md'), encoding='utf-8').read()
rows = re.findall(r'^\| `(\d{3})_([a-z_]+?)_construction[^`]*` \| ([a-z_]+) \| `([^`]+)` \| (.) *\| (.) *\| (.) *\| (.) *\| (\w+) \|',
                  mtxt, re.M)
tasks_meta = {}
for slot, _dom, dom, variant, seeded, defects, live, phrasing, tier in rows:
    tasks_meta[slot] = {'domain': dom, 'variant': variant, 'seeded': seeded == '✓', 'defects': defects == '✓',
                        'live': live == '✓', 'phrasing': phrasing == '✓', 'tier': tier,
                        'client_variant': 'client' in variant}
n_by_dom = Counter(m['domain'] for m in tasks_meta.values())
say('== 1. tasks in the manifest:', len(tasks_meta), dict(n_by_dom))
assert len(tasks_meta) == 53 and n_by_dom == {'banking_knowledge': 35, 'airline_plus': 6, 'retail_plus': 6, 'telecom': 6}

W = {SCORE_KEY[d]: n_by_dom[d] for d in DOMAINS}


def weighted(row):
    return sum(row[k] * w for k, w in W.items()) / sum(W.values())


say('\nconfiguration                          overall(board)  recomputed(6:6:6:35)  air   ret   tel   bank   min    usd   credit')
for c in configs:
    c['overall_recomputed'] = round(weighted(c), 2)
    say(f"{c['harness']+' / '+c['model']:<38} {c['overall']:>9.1f} {c['overall_recomputed']:>14.2f} "
        f"{c['airline']:>10.1f}{c['retail']:>6.1f}{c['telecom']:>6.1f}{c['banking']:>6.1f} {c['build_min']:>6.1f} {c['build_usd']:>6.1f} {c['serve_credit_ratio']:>6.2f}")
    assert abs(c['overall_recomputed'] - c['overall']) < 0.06, c['id']
ref_row = {'overall': ref['scores']['overall'], 'airline': ref['scores']['airline'], 'retail': ref['scores']['retail'],
           'telecom': ref['scores']['telecom'], 'banking': ref['scores']['banking'],
           'serve_credit_ratio': ref['serve_credit_ratio'], 'subtitle': ref['subtitle']}
ref_row['overall_recomputed'] = round(weighted(ref_row), 2)
say(f"{'EXPERT human (reference.json)':<38} {ref_row['overall']:>9.1f} {ref_row['overall_recomputed']:>14.2f} "
    f"{ref_row['airline']:>10.1f}{ref_row['retail']:>6.1f}{ref_row['telecom']:>6.1f}{ref_row['banking']:>6.1f}")
best = max(configs, key=lambda c: c['overall'])
say(f"\nbest configuration: {best['harness']} / {best['model']} overall {best['overall']} ; expert {ref_row['overall']} ; "
    f"ratio {ref_row['overall']/best['overall']:.2f}x ; gap {ref_row['overall']-best['overall']:.1f} points ; best/expert {100*best['overall']/ref_row['overall']:.1f} %")
say('per domain best-of-six vs expert (points):')
dom_gap = {}
for k in ['airline', 'retail', 'telecom', 'banking']:
    b = max(configs, key=lambda c: c[k])
    dom_gap[k] = {'best': b[k], 'best_config': b['id'], 'expert': ref_row[k], 'gap': r1(ref_row[k] - b[k]),
                  'worst': min(c[k] for c in configs)}
    say(f"  {k:<8} best {b[k]:>5.1f} ({b['id']})  worst {dom_gap[k]['worst']:>5.1f}  expert {ref_row[k]:>5.1f}  gap {dom_gap[k]['gap']:>5.1f}")
# score per dollar / per hour
for c in configs:
    c['points_per_usd'] = round(c['overall'] / c['build_usd'], 2)
say('overall points per build dollar:', {c['id']: c['points_per_usd'] for c in configs})
order_score = [c['id'] for c in sorted(configs, key=lambda c: -c['overall'])]
say('rank by overall:', order_score)

# ----------------------------------------------------------------------------------------------------------------------
# 2. The 53 sampled builds (one per task) and the scenario x build grid
# ----------------------------------------------------------------------------------------------------------------------
bt = os.path.join(HYPER, 'web/leaderboard/public/build-trajectories')
bman = jload(os.path.join(bt, 'manifest.json'))
say('\n== 2. build-trajectories manifest note:', bman['note'])
builds = []
bits = {}            # slot -> {inner_id: 0/1}
for f in sorted(glob.glob(os.path.join(bt, 'rel???.json'))):
    d = jload(f)
    slot = d['slot']
    meta = tasks_meta[slot]
    items = d['items']
    kinds = Counter(i['k'] for i in items)
    tools = Counter(i.get('tool') for i in items if i['k'] == 'call')
    et = d['eval_tasks']
    bits[slot] = {tid: 1 if r >= 0.5 else 0 for tid, r in et}
    assert all(r in (0.0, 1.0) for _t, r in et)
    sim_rate = sum(r for _t, r in et) / len(et)
    builds.append({
        'slot': slot, 'domain': d['domain'], 'harness': d['builder']['harness'], 'model': d['builder']['model'].split('/')[-1],
        'label': d['builder_label'], 'steps': d['stats']['steps'], 'tool_calls': d['stats']['tool_calls'],
        'has_client': kinds['client'] > 0,      # tasks without a simulated Client carry no 'client' item at all
        'client_questions': kinds['dev_msg'], 'calls_logged': kinds['call'],
        'local_tests': tools['run_local_test'], 'live_experiment': tools['run_live_experiment'],
        'eval_passed': d['result']['eval_passed'], 'eval_total': d['result']['eval_total'],
        'sim_pass_rate': round(sim_rate, 4), 'final': d['result']['final'],
        'client_variant': meta['client_variant'], 'seeded': meta['seeded'], 'defects': meta['defects'], 'tier': meta['tier'],
        'variant': meta['variant'],
    })
    assert d['result']['eval_total'] == len(et)
assert len(builds) == 53
say('builds read:', len(builds))

# 'passed' counts in result vs the number of reward-1.0 simulations; and what the final reward does to the pass rate
mism = [b for b in builds if b['eval_passed'] != round(b['sim_pass_rate'] * b['eval_total'])]
say('eval_passed != count of reward-1 simulations in', len(mism), 'builds:', [(b['slot'], b['eval_passed'], round(b['sim_pass_rate'] * b['eval_total'])) for b in mism])
cut = [b for b in builds if b['final'] < b['sim_pass_rate'] - 1e-3]
zeroed = [b for b in cut if b['final'] == 0]
say(f"final < simulation pass rate in {len(cut)} of 53 builds (credit-overage penalty or latency gate: final = max(0, rate - overage) x gate);"
    f" {len(zeroed)} of them end at exactly 0 though their simulations passed ({sum(b['eval_passed'] for b in zeroed)} sims)")
say('  those:', [(b['slot'], b['domain'][:4], b['eval_passed'], b['eval_total']) for b in zeroed])
mean_final = sum(b['final'] for b in builds) / 53
mean_rate = sum(b['sim_pass_rate'] for b in builds) / 53
tot_p = sum(b['eval_passed'] for b in builds); tot_n = sum(b['eval_total'] for b in builds)
say(f"sample of 53 (mixed configurations): mean final {100*mean_final:.1f} % ; mean simulation pass rate {100*mean_rate:.1f} % ; "
    f"pooled simulations {tot_p}/{tot_n} = {100*tot_p/tot_n:.1f} %")
by_dom = defaultdict(list)
for b in builds:
    by_dom[b['domain']].append(b)
dom_stats = {}
for dname in DOMAINS:
    L = by_dom[dname]
    dom_stats[dname] = {'builds': len(L), 'sims': sum(b['eval_total'] for b in L), 'passed': sum(b['eval_passed'] for b in L),
                        'mean_final_pct': r1(100 * sum(b['final'] for b in L) / len(L)),
                        'pooled_pass_pct': r1(100 * sum(b['eval_passed'] for b in L) / sum(b['eval_total'] for b in L)),
                        'builds_with_zero_passes': sum(1 for b in L if b['eval_passed'] == 0)}
    say(f"  {dname:<18} builds {len(L):>2} sims {dom_stats[dname]['sims']:>5} passed {dom_stats[dname]['passed']:>5} "
        f"mean final {dom_stats[dname]['mean_final_pct']:>5.1f} %  pooled sims {dom_stats[dname]['pooled_pass_pct']:>5.1f} %  zero-pass builds {dom_stats[dname]['builds_with_zero_passes']}")
say(f"  all sims in the 53 builds: {tot_n} ; builds with 0 passing simulations: {sum(1 for b in builds if b['eval_passed']==0)}")

# the grid: scenario x build. Group builds of a domain that evaluated the SAME scenario set.
groups = defaultdict(list)
for b in builds:
    groups[(b['domain'], tuple(sorted(bits[b['slot']], key=natkey)))].append(b['slot'])
gl = []
for (dname, ids), slots in sorted(groups.items(), key=lambda kv: (DOMAINS.index(kv[0][0]), kv[1][0])):
    gl.append((dname, list(ids), slots))
say(f"\nscenario sets: {len(gl)} groups ->", [(g[0][:4], len(g[1]), len(g[2])) for g in gl])
say('banking distinct scenarios across all groups:', len({i for g in gl if g[0] == 'banking_knowledge' for i in g[1]}))


def poisson_binomial(ps):
    dist = [1.0]
    for p in ps:
        nd = [0.0] * (len(dist) + 1)
        for k, v in enumerate(dist):
            nd[k] += v * (1 - p); nd[k + 1] += v * p
        dist = nd
    return dist


def telecom_facets(sid):
    m = re.match(r'^\[(.+?)\](.*)\[PERSONA:([^\]]+)\](?:\[LEVER:([^\]]+)\])?$', sid)
    if not m:
        return None
    faults = [x for x in m.group(2).split('|') if x]
    return {'issue': m.group(1), 'faults': len(faults), 'persona': m.group(3), 'lever': bool(m.group(4))}


matrix = {'note': ('Each row is a scenario (a simulated customer case) the built agent was tested on; each column is one build. 1 = the '
                   'scenario passed. Builds in a group were tested on the same scenarios, but each build is a different task variant and '
                   'a different builder (the sample is one build per task): agreement across columns is agreement across builds, not '
                   'repeats of one build. There are no repeats of the same build anywhere in the data.'),
          'groups': []}
agree_all = []
for dname, ids, slots in gl:
    n = len(slots)
    M = [[bits[s][i] for s in slots] for i in ids]
    ks = [sum(r) for r in M]
    hist = [ks.count(k) for k in range(n + 1)]
    p_b = [sum(bits[s].values()) / len(ids) for s in slots]
    exp_hist = [x * len(ids) for x in poisson_binomial(p_b)]
    g = {'domain': dname, 'builds': slots, 'n_builds': n, 'n_scenarios': len(ids),
         'k_hist': hist, 'k_hist_if_independent': [round(x, 1) for x in exp_hist],
         'solved_by_none': hist[0], 'solved_by_all': hist[n], 'solved_by_any': len(ids) - hist[0],
         'build_pass_rate': [round(x, 4) for x in p_b], 'scenario_ids': ids,
         'rows': [''.join(str(x) for x in r) for r in M]}
    if dname == 'telecom':
        g['facets'] = [telecom_facets(i) for i in ids]
        g['scenario_ids'] = list(range(len(ids)))     # long strings replaced by index; facets carry the content
    matrix['groups'].append(g)
    agree_all.append((dname, n, len(ids), hist, exp_hist))
    say(f"  {dname[:7]:<8} builds {n} scenarios {len(ids):>3}  k-hist {hist}  if independent {[round(x,1) for x in exp_hist]}  none {hist[0]} all {hist[n]}")

# domain-level roll-up of the grid
roll = {}
for dname in DOMAINS:
    gs = [a for a in agree_all if a[0] == dname]
    sc = sum(a[2] for a in gs)
    cells = sum(a[1] * a[2] for a in gs)
    none = sum(a[3][0] for a in gs); allp = sum(a[3][a[1]] for a in gs)
    anyp = sc - none
    allp_exp = sum(a[4][a[1]] for a in gs); none_exp = sum(a[4][0] for a in gs)
    passed = sum(sum(k * v for k, v in enumerate(a[3])) for a in gs)
    roll[dname] = {'scenarios': sc, 'cells': cells, 'passed_cells': passed, 'solved_by_none': none, 'solved_by_all': allp,
                   'solved_by_any': anyp, 'none_if_independent': round(none_exp, 1), 'all_if_independent': round(allp_exp, 1)}
    say(f"  roll-up {dname:<18} scenarios {sc:>4} cells {cells:>5} passed {passed:>5} ({100*passed/cells:.1f} %)  none {none} (indep {none_exp:.1f})  "
        f"any {anyp}  all {allp} (indep {allp_exp:.1f})")
tot_cells = sum(r['cells'] for r in roll.values()); tot_pass = sum(r['passed_cells'] for r in roll.values())
say(f'  total cells {tot_cells} passed {tot_pass}')

# telecom facets vs pass rate (what makes a scenario hard)
tg = next(g for g in matrix['groups'] if g['domain'] == 'telecom')
by_persona = defaultdict(list); by_issue = defaultdict(list)
for fct, row in zip(tg['facets'], tg['rows']):
    by_persona[fct['persona']].append(row.count('1') / len(row)); by_issue[fct['issue']].append(row.count('1') / len(row))
tele_persona = {k: {'n': len(v), 'pass_pct': r1(100 * sum(v) / len(v))} for k, v in sorted(by_persona.items())}
tele_issue = {k: {'n': len(v), 'pass_pct': r1(100 * sum(v) / len(v))} for k, v in sorted(by_issue.items())}
say('  telecom pass % by persona:', tele_persona)
say('  telecom pass % by issue:  ', tele_issue)

# ----------------------------------------------------------------------------------------------------------------------
# 3. Behaviour: client questions, local tests, steps vs final reward (the paper's failure modes)
# ----------------------------------------------------------------------------------------------------------------------
say('\n== 3. behaviour of the 53 builds')
tc_total = sum(b['calls_logged'] for b in builds); q_total = sum(b['client_questions'] for b in builds)
hc = [b for b in builds if b['has_client']]
say(f"logged tool calls {tc_total}; client questions {q_total} = {100*q_total/tc_total:.2f} % of calls (all 53 builds) ; builds whose task has a simulated Client: {len(hc)}")
say(f"  of those {len(hc)}: asked at least once {sum(1 for b in hc if b['client_questions']>0)}, asked nothing {sum(1 for b in hc if b['client_questions']==0)}; "
    f"questions per asking build {q_total/max(1,sum(1 for b in hc if b['client_questions']>0)):.1f}")
for lab, L in (('asked >=1', [b for b in hc if b['client_questions'] > 0]), ('asked 0', [b for b in hc if b['client_questions'] == 0])):
    if L:
        say(f"  {lab:<10} builds {len(L):>2} mean final {100*sum(b['final'] for b in L)/len(L):5.1f} %  mean sim pass {100*sum(b['sim_pass_rate'] for b in L)/len(L):5.1f} %")
say(f"  builds without a Client: {len(builds)-len(hc)} (mean final {100*sum(b['final'] for b in builds if not b['has_client'])/max(1,len(builds)-len(hc)):.1f} %)")
cmp = {}
for dn in DOMAINS:
    L = [b for b in hc if b['domain'] == dn]
    cmp[dn] = {'with_client': len(L), 'asked_any': sum(1 for b in L if b['client_questions'] > 0),
               'mean_final_asked_pct': r1(100*sum(b['final'] for b in L if b['client_questions']>0)/max(1,sum(1 for b in L if b['client_questions']>0))),
               'mean_final_silent_pct': r1(100*sum(b['final'] for b in L if b['client_questions']==0)/max(1,sum(1 for b in L if b['client_questions']==0)))}
    say('   ', dn, cmp[dn])


def spearman(xs, ys):
    def rk(v):
        o = sorted(range(len(v)), key=lambda i: v[i]); r = [0.0] * len(v); i = 0
        while i < len(o):
            j = i
            while j + 1 < len(o) and v[o[j + 1]] == v[o[i]]:
                j += 1
            for t in range(i, j + 1):
                r[o[t]] = (i + j) / 2 + 1
            i = j + 1
        return r
    a, b = rk(xs), rk(ys); ma, mb = sum(a) / len(a), sum(b) / len(b)
    cov = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    return cov / math.sqrt(sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b))


for key in ('steps', 'tool_calls', 'local_tests', 'client_questions'):
    # within banking only (35 builds, one domain, so domain difficulty is held fixed)
    L = by_dom['banking_knowledge']
    say(f"  Spearman(banking builds, {key}, sim pass rate) = {spearman([b[key] for b in L], [b['sim_pass_rate'] for b in L]):+.2f}  (n=35)")
mean_steps_by_cfg = defaultdict(list)
for b in builds:
    mean_steps_by_cfg[b['label']].append(b['steps'])
say('mean steps by configuration:', {k: round(sum(v) / len(v)) for k, v in mean_steps_by_cfg.items()})

# ----------------------------------------------------------------------------------------------------------------------
# 4. Paper 3: what the clone gives (design, anchors, grid sizes) and the formulas a film may show
# ----------------------------------------------------------------------------------------------------------------------
say('\n== 4. rethinking-agent-evaluation: design only (no trajectories in the clone)')


def spec_cells(path):
    txt = open(path, encoding='utf-8').read()
    axes = {}
    for ax in ('information', 'harness', 'verification', 'budget', 'model'):
        m = re.search(r'^\s+' + ax + r':\s*\[(.*?)\]', txt, re.M)
        axes[ax] = [x.strip() for x in m.group(1).split(',')]
    rep = int(re.search(r'^replicates:\s*(\d+)', txt, re.M).group(1))
    oracle = bool(re.search(r'^oracle:\s*true', txt, re.M))
    cells = 1
    for v in axes.values():
        cells *= len(v)
    return axes, rep, oracle, cells


grid = {}; total_full = 0; total_all = 0
for task in sorted(os.listdir(os.path.join(RETHINK, 'specs'))):
    for p in sorted(glob.glob(os.path.join(RETHINK, 'specs', task, '*.yaml'))):
        nm = os.path.basename(p)[:-5]
        axes, rep, oracle, cells = spec_cells(p)
        grid[f'{task}/{nm}'] = {'cells': cells, 'replicates': rep, 'runs': cells * rep, 'oracle': oracle, 'model': axes['model']}
        total_all += cells * rep
        if nm.startswith('full') or nm.startswith('oracle-full'):
            total_full += cells * rep
per_family = defaultdict(int)
for k, v in grid.items():
    if not k.split('/')[1].startswith('smoke'):
        per_family[k.split('/')[1]] += v['runs']
say('runs per spec family over the 4 tasks (full + oracle-full):', dict(per_family))
say(f'total runs designed: full+oracle-full {total_full} ; with smoke grids {total_all}  (paper snippet: "18,000+ trajectories")')
n_cell_axes = {'information': 4, 'harness': 3, 'verification': 4, 'budget': 3}
say('one model tier: 4 x 3 x 4 x 3 = 144 cells x 5 replicates = 720 runs per task')

anch = {}
for task in sorted(os.listdir(os.path.join(RETHINK, 'solutions'))):
    t = open(os.path.join(RETHINK, 'solutions', task, 'eval_config.py'), encoding='utf-8').read()

    def val(name):
        m = re.search(r'^' + name + r'\s*=\s*([^\n#]+)', t, re.M)
        return eval(m.group(1).strip(), {'__builtins__': {}}, {}) if m else None   # arithmetic literals only, e.g. 102 / 152
    anch[task] = {'metric': re.search(r'^METRIC\s*=\s*"([^"]+)"', t, re.M).group(1), 'reference': round(val('REFERENCE'), 4),
                  'backbone': round(val('BACKBONE'), 4), 'trivial': val('TRIVIAL'), 'margin': val('MARGIN'),
                  'expected_rows': val('EXPECTED_ROWS')}
    rows_csv = sum(1 for _ in open(os.path.join(RETHINK, 'solutions', task, 'solution.csv'), encoding='utf-8')) - 1
    anch[task]['answer_key_rows'] = rows_csv
    rf, bk = anch[task]['reference'], anch[task]['backbone']
    anch[task]['regime'] = 'gap_positive' if rf - bk > anch[task]['margin'] else ('gap_negative' if rf - bk < -anch[task]['margin'] else 'gap_negligible')
    anch[task]['gap'] = round(rf - bk, 4)
    say(f"  {task:<20} {anch[task]['metric']:<14} REFERENCE {rf:>7.4f} BACKBONE {bk:>8.4f} TRIVIAL {anch[task]['trivial']} MARGIN {anch[task]['margin']} "
        f"-> {anch[task]['regime']} ; key rows {rows_csv} (expected {anch[task]['expected_rows']})")


def gap_closed(score, task):
    a = anch[task]
    return (score - a['backbone']) / (a['reference'] - a['backbone'])


# formulas from docs/analysis-metrics.md, implemented so a film can run them on any table it has the right to show
def icc_oneway(cells):
    """cells: list of lists of scores, one list per cell. Returns (icc, ms_within, ms_between, between) per section 9."""
    k = len(cells); ns = [len(c) for c in cells]; N = sum(ns)
    means = [sum(c) / len(c) for c in cells]; gm = sum(sum(c) for c in cells) / N
    ms_w = sum(sum((x - m) ** 2 for x in c) for c, m in zip(cells, means)) / (N - k)
    ms_b = sum(n * (m - gm) ** 2 for n, m in zip(ns, means)) / (k - 1)
    n0 = (N - sum(n * n for n in ns) / N) / (k - 1)
    between = max(0.0, (ms_b - ms_w) / n0)
    return between / (between + ms_w), ms_w, ms_b, between


def c_out(p_list):
    """Outcome consistency of arXiv:2602.16666 as used in docs section 10: mean of (2p-1)^2 over cells."""
    return sum((2 * p - 1) ** 2 for p in p_list) / len(p_list)


# self-check on a toy table with a known answer: three cells of five, within variance 1 each, means 0/1/2 -> hand-checked
toy = [[-1, 0, 0, 0, 1], [0, 1, 1, 1, 2], [1, 2, 2, 2, 3]]
icc, msw, msb, bet = icc_oneway(toy)
say(f'  self-check icc_oneway(toy): MS_within {msw:.3f} (expect 0.500)  MS_between {msb:.3f} (expect 5.000)  between {bet:.3f} (expect 0.900)  ICC {icc:.3f} (expect 0.643)')
assert abs(msw - 0.5) < 1e-9 and abs(msb - 5.0) < 1e-9 and abs(bet - 0.9) < 1e-9
say('  self-check c_out: p=0.5 -> %.2f (expect 0), p=1 -> %.2f, p=0.9 -> %.2f' % (c_out([0.5]), c_out([1.0]), c_out([0.9])))
say('  paper 3 share of outcome variance from repeating one configuration: 54 % (search snippet, grade B) - NOT recomputable from the clone;')
say('     with ICC = between / (between + within), a 54 % within share is ICC = 0.46 on the repeat-noise reading.')

est_price = {'35b-a3b': (0.25, 2.00), 'sonnet-5': (2.00, 10.00)}
say('  list prices in axes.py (USD per 1M tokens, in / out):', {'35b-a3b': (0.25, 2.0), '122b-a10b': (0.4, 3.2), '397b-a17b': (0.6, 3.6), '198b-a11b': (0.2, 1.15), 'sonnet-5': (2.0, 10.0)})
say('  budgets (s): short 300, medium 600, long 1200 (x4 between short and long);  information ladder: none < identity < interface < protocol (cumulative snippets)')

design = {
    'source': 'rethinking-agent-evaluation clone: axes.py, specs/*, solutions/*/eval_config.py, docs/analysis-metrics.md',
    'trajectories_in_clone': False, 'trajectories_at': 'huggingface.co/datasets/lusxvr/agentic-science-trajectories (blocked by egress)',
    'axes': {'information': ['none', 'identity', 'interface', 'protocol'], 'harness': ['act-only', 'think-act', 'react'],
             'verification': ['none', 'asked', 'reported', 'binding'], 'budget_s': {'short': 300, 'medium': 600, 'long': 1200},
             'model': ['qwen35-35b-a3b-fp8', 'qwen35-122b-a10b-fp8', 'qwen35-397b-a17b-fp8', 'step37-198b-a11b-fp8', 'claude-sonnet-5']},
    'cells_per_model_tier': 144, 'replicates': 5, 'runs_per_task_per_tier': 720,
    'tasks': anch, 'grids': grid, 'runs_designed_full_and_oracle_full': total_full, 'runs_designed_with_smoke': total_all,
    'information_snippets_redshift': {'identity': 'names the domain model', 'interface': 'how to load and call it',
                                       'protocol': 'the working recipe (pre-embedded catalog, preprocessing, k-NN with 64 neighbours)'},
    'formulas': {'gap_closed': '(score - BACKBONE) / (REFERENCE - BACKBONE)', 'calibration_error': 'expected_score - score (positive = overconfident)',
                 'C_out': 'mean over cells of (2p-1)^2', 'ICC': 'between / (between + MS_within), one-way random effects, unbalanced n0',
                 'effect_size': '(max level mean - min level mean) / within-cell std'},
    'paper_snippet_claims_not_recomputable': {'repeat_variance_share_pct': 54, 'trajectories': '18,000+'},
}

# ----------------------------------------------------------------------------------------------------------------------
# 5. Paper 1: dashboard values that search snippets carried (hand-copied, grade B)
# ----------------------------------------------------------------------------------------------------------------------
dash = {
    'grade': 'B', 'how': 'values copied from WebSearch result text on 2026-10-11 (page itself blocked by egress); snapshots drift (Opus 4.5 reads 0.85 in one result, 0.87 in another)',
    'url': 'https://hal.cs.princeton.edu/reliability',
    'models_on_dashboard_pages': 15, 'models_in_arxiv_abstract': 14, 'metrics': 12,
    'metric_names': {'consistency': ['outcome (C_out)', 'trajectory-distribution (JSD)', 'trajectory-sequence (Levenshtein)', 'resource (C_res)'],
                     'robustness': ['fault', 'environment', 'prompt'], 'predictability': ['calibration (ECE)', 'discrimination (AUROC)', 'Brier'],
                     'safety': ['compliance', 'harm severity']},
    'overall_rule': 'arithmetic mean of consistency, robustness and predictability; safety reported separately',
    'gaia': [
        {'model': 'Claude Opus 4.5', 'acc': 68.5, 'rel': 0.85, 'rank': 1, 'cons': 0.811, 'out': 0.838, 'trajD': 0.886, 'trajS': 0.752, 'res': 0.774},
        {'model': 'Claude Opus 4.7', 'acc': 73.3, 'rel': 0.84, 'rank': 2, 'cons': 0.806, 'out': 0.844, 'trajD': 0.865, 'trajS': 0.742, 'res': 0.772},
        {'model': 'Gemini 3.5 Flash', 'acc': 79.2, 'rel': 0.84, 'rank': 3},
        {'model': 'Gemini 3.1 Pro', 'acc': 76.2, 'rel': 0.82, 'rank': 4, 'cons': 0.756, 'pred': 0.78, 'rob': 1.00, 'out': 0.828, 'trajD': 0.811, 'trajS': 0.608, 'res': 0.731},
        {'model': 'Claude Sonnet 4', 'acc': 54.7, 'rel': 0.82, 'rank': 6, 'cons': 0.777, 'pred': 0.73, 'rob': 0.94, 'out': 0.763, 'trajD': 0.872, 'trajS': 0.749, 'res': 0.759},
        {'model': 'GPT-5.5', 'acc': 62.8, 'rel': 0.79, 'rank': 8, 'cons': 0.607, 'out': 0.599, 'trajD': 0.705, 'trajS': 0.527, 'res': 0.607},
        {'model': 'GPT-4o Mini', 'acc': 26.3, 'rel': 0.76, 'rank': 10, 'cons': 0.73, 'pred': 0.58, 'rob': 0.97},
        {'model': 'GPT-5.2 (medium)', 'acc': 31.8, 'rel': 0.72, 'rank': 14, 'cons': 0.622, 'out': 0.655, 'trajD': 0.742, 'trajS': 0.555, 'res': 0.562},
        {'model': 'Claude 3 Haiku', 'acc': 12.9, 'rel': 0.69, 'rank': 15},
        {'model': 'Gemini 2.5 Pro', 'acc': 52.5, 'cons': 0.724, 'out': 0.731, 'trajD': 0.865, 'trajS': 0.711, 'res': 0.654},
        {'model': 'Gemini 2.5 Flash', 'acc': 46.7, 'cons': 0.702, 'out': 0.731, 'trajD': 0.823, 'trajS': 0.642, 'res': 0.644},
        {'model': 'GPT-5.2', 'acc': 33.2, 'cons': 0.593, 'out': 0.583, 'trajD': 0.766, 'trajS': 0.539, 'res': 0.542},
    ],
    'not_found': ['accuracy slope 0.23/year', 'reliability slope 0.03/year', 'a time series of any metric', 'tau-bench per-model rows'],
}
g = dash['gaia']
pairs = [(m['acc'], m['rel']) for m in g if 'rel' in m]
say('\n== 5. dashboard snippets: %d models with accuracy and overall reliability; Spearman(acc, rel) = %+.2f (n=%d, grade B inputs)' % (len(pairs), spearman([p[0] for p in pairs], [p[1] for p in pairs]), len(pairs)))
oc = [(m['acc'], m['out']) for m in g if 'out' in m]
say('   Spearman(acc, outcome consistency) = %+.2f (n=%d); outcome consistency range %.3f-%.3f (paper snippet: about 30 to 75 percent, a different scale)' % (spearman([p[0] for p in oc], [p[1] for p in oc]), len(oc), min(p[1] for p in oc), max(p[1] for p in oc)))
accs = [p[0] for p in pairs]; rels = [p[1] for p in pairs]
say('   spans on the ranked pages: accuracy %.1f-%.1f (x%.1f, +%.1f points) ; overall reliability %.2f-%.2f (x%.2f, +%.2f)' % (min(accs), max(accs), max(accs)/min(accs), max(accs)-min(accs), min(rels), max(rels), max(rels)/min(rels), max(rels)-min(rels)))
say('   NOTE: the 0.23 vs 0.03 per year slopes are not in any snippet; slope needs release dates the snippets do not carry')
best_acc = max((m for m in g if 'rel' in m), key=lambda m: m['acc'])
say('   highest accuracy on a ranked page: %s %.1f %% -> reliability rank %d of 15' % (best_acc['model'], best_acc['acc'], best_acc['rank']))

# ----------------------------------------------------------------------------------------------------------------------
# write
# ----------------------------------------------------------------------------------------------------------------------
summary = {
    'source': 'hyper-tau-bench/web/leaderboard/public/hyper-submissions/*, reference.json, data/tau2/hyper/tasks/MANIFEST.md',
    'tasks': 53, 'domains': dict(n_by_dom), 'weights': W, 'configs': configs, 'expert': ref_row, 'domain_gap': dom_gap,
    'best': best['id'], 'ceiling_ratio': round(ref_row['overall'] / best['overall'], 2),
    'reward_definition': 'final = max(0, pass rate - credit overage) x latency gate (src/tau2/hyper/sandbox/orchestrator.py); leaderboard overall = mean over the 53 tasks',
    'sample_of_53': {'mean_final_pct': r1(100 * mean_final), 'pooled_sim_pass_pct': r1(100 * tot_p / tot_n), 'sims': tot_n, 'passed': tot_p,
                     'builds_final_below_rate': len(cut), 'builds_zeroed_with_passes': len(zeroed), 'by_domain': dom_stats},
    'grid_rollup': roll, 'banking_distinct_scenarios': 140, 'telecom_by_persona': tele_persona, 'telecom_by_issue': tele_issue,
    'client': {'questions': q_total, 'logged_calls': tc_total, 'questions_per_100_calls': round(100 * q_total / tc_total, 2),
               'builds_with_client': len(hc), 'asked_any': sum(1 for b in hc if b['client_questions'] > 0),
               'asked_none': sum(1 for b in hc if b['client_questions'] == 0), 'by_domain': cmp},
    'sources_note': 'search snippets: 23.9 % and 82.2 % match the open data exactly (grade A)',
}
files = {'hyper-tau-summary.json': summary, 'hyper-tau-builds.json': {'note': bman['note'], 'builds': builds},
         'hyper-tau-matrix.json': matrix, 'rethinking-design.json': design, 'princeton-dashboard.json': dash}
say('\n== files' + (' (written)' if WRITE else ' (dry run; pass --write)'))
for name, obj in files.items():
    s = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    say(f'  {name:<26} {len(s.encode("utf-8")):>7} bytes' + ('  OVER 60 KB' if len(s.encode('utf-8')) > 60000 else ''))
    if WRITE:
        with open(os.path.join(HERE, name), 'w', encoding='utf-8') as f:
            f.write(s + '\n')
