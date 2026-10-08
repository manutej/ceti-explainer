#!/usr/bin/env python3
"""new_topic.py: scaffold a new 75-second case for the explainer factory.

    python3 factory/tools/new_topic.py <id> "<Title>" [--force] [--root DIR]

Writes, from the templates below (the same ones skills/explainer-factory/SKILL.md shows inline):

    factory/topics/<id>/brief.md      the explorer's brief: belief, fixture, numbers, count, commit, Monday
    factory/topics/<id>/claims.json   every number the film may use, sourced or derived
    factory/topics/<id>/beats.md      the five beats on the format's clock, captions and structures
    factory/films/<id>/film.json      window.FILM (schema in factory/FORMAT.md and the skill)
    factory/films/<id>/film.js        window.FILM_RENDER = {setup(p, kit), render(t, state, kit)}: a titled
                                      sheet, the commit box and a placeholder per beat on window.KIT (the kit
                                      adds captions and the brand card), so the page builds and gates at once
    factory/films/<id>/claims.json    the on-screen claims, an array (example claims to replace)
    factory/films/<id>/NOTES.md       the builder's notes stub

Existing files are never overwritten without --force. Placeholders read TODO; nothing here is a fact.
"""
import argparse, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
try:
    from paths import ceti_root  # noqa: E402
except ImportError:  # pragma: no cover
    ceti_root = None

ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,47}$")

# The format's clock (factory/FORMAT.md, "the 75-second case"). Material 0 to 72 s, brand card 72 to 75 s.
# (id, beat as the gate reads it, plain name, window)
BEATS = [
    ("hook", "HOOK", "The hook", 0, 8),
    ("commit", "COMMIT", "The commit", 8, 16),
    ("case", "CASE", "The case", 16, 36),
    ("count", "COUNT", "The count", 36, 62),
    ("monday", "MONDAY", "Monday", 62, 72),
]
DUR = 75
BRAND_AT = 72.0      # kit draws the CETI card from here (FILM.brand.at); the material's last frame holds under it
COMMIT_AT = 9.0      # the live page pauses here for 8 s (gate G4c: 8 to 16 s); film mode types commit.default
COUNT_AT = 38.0      # the count structure is first drawn (gate G7: no ratio, % or "N in M" before this)


def brief_md(fid, title):
    return f"""# {title} · brief

id: `{fid}` · room: exec · format: the 75-second case (factory/FORMAT.md) · explorer: TODO (opus)

## The belief
TODO: one sentence a manager would say out loud in a meeting, the thing people believe.

## The everyday situation (HOOK, 0 to 8 s)
TODO: where a manager meets this, in one or two plain sentences. No jargon, no numbers yet.

## The mechanism
TODO: one paragraph. What actually produces the outcome. This is what THE COUNT draws.

## The fixture (THE CASE, 16 to 36 s)
TODO: one real worked example with real, sourced numbers. Name, place, year. Never base rates, the
planning fallacy or the AI agent loop (already done). Each concept brings its own fixture (Q10).

## The numbers
Every number below has an entry in `claims.json` (id in brackets). Derived numbers carry their formula.

| claim id | what | value | source or formula |
|----------|------|------:|-------------------|
| TODO | TODO | TODO | S1 |

## The count (36 to 62 s)
Each mark is one TODO (a project, a trial, a bet, a customer...). n = TODO marks.
What is counted: TODO. The count lands at TODO of n before any ratio appears (counts first, Q14).

## The commit (8 to 16 s)
Question, as the viewer reads it: TODO?
Unit: TODO · range min TODO to max TODO · film-mode default guess: TODO, because TODO (the typical
answer people give, sourced if possible). Nothing numeric from the answer is shown before the commit.

## Monday (62 to 72 s)
The one question to ask at work: TODO?
Honest limit (what the case is not): TODO.

## Takeaway (brand card)
TODO: one line, at most ~60 characters.

## Sources (at least 3)
- [S1] TODO: author, title, year, where in it
- [S2] TODO
- [S3] TODO

## Not this
TODO: the tempting versions we are not making, and why (one line each).
"""


def beats_md(fid, title):
    rows = "\n".join(f"| {i + 1} | {beat} | {a} to {b} s | TODO | TODO | TODO |" for i, (_, beat, _n, a, b) in enumerate(BEATS))
    return f"""# {title} · beats

id: `{fid}` · dur {DUR} s = material 0 to {BRAND_AT:g} s + CETI brand card {BRAND_AT:g} to {DUR} s
commit.at {COMMIT_AT:g} s · count.at {COUNT_AT:g} s · at most four visual structures in the whole film

## Structures (at most 4; the brand card is not one)
1. S-A TODO: the sheet (the belief, the commit box)
2. S-B TODO: the case (the fixture's numbers at true scale)
3. S-C TODO: the count (each mark is one TODO)
4. (spare; leave it empty if you can)

## Beat table

| # | beat | window | on screen (structure) | focal motion | claims used |
|---|------|--------|-----------------------|--------------|-------------|
{rows}

## Captions (28 units, at most two lines of ~50 characters at the kit caption width; no digit without a claim)

| t0 | t1 | text |
|---:|---:|------|
| 0.6 | 7.6 | TODO hook |
| 8.4 | 15.6 | TODO the commit question |
| 16.4 | 35.6 | TODO the case (split into 3 to 4 captions) |
| 36.4 | 61.6 | TODO the count (split; counts before any ratio) |
| 62.4 | 71.6 | TODO the Monday question, then the honest line |

## Checks before building
- [ ] Every digit in a caption or on the stage has a claim (value or `renders`).
- [ ] No ratio, percentage or "N in M" before count.at ({COUNT_AT:g} s), and none before its count has landed.
- [ ] Nothing derived from the viewer's answer before the seal (commit.at {COMMIT_AT:g} s + 4.5 s).
- [ ] At most four structures; at most two full-screen cards.
"""


# claims.json is an ARRAY (factory/tools/README.md): id, text, value, formula?, tolerance?, source, renders?, appears_at?
# formula is a JS expression over film.json.params (Math names, Phi, ln, sum, round(x, d) are in scope);
# source is a key of film.json.sources, or "derived" when a formula carries it.
def topic_claims(fid):
    return [
        {"id": "todo-fact", "text": "TODO: the claim in words", "value": 0, "source": "S1",
         "quote": "TODO: the sentence or table row the number comes from", "renders": ["TODO"]},
        {"id": "todo-derived", "text": "TODO: what the derived number means", "value": 0,
         "formula": "todo_input * 1", "source": "derived", "renders": ["TODO"]},
    ]


def film_claims(fid):
    return [
        {"id": "example-planned", "text": "EXAMPLE, replace: the plan said 4 years", "value": 4,
         "formula": "planned", "source": "S1", "renders": ["4 years"], "appears_at": 20},
        {"id": "example-actual", "text": "EXAMPLE, replace: it took 14 years", "value": 14,
         "formula": "actual", "source": "S1", "renders": ["14 years"], "appears_at": 24},
        {"id": "example-ratio", "text": "EXAMPLE, replace: 3.5 times the plan", "value": 3.5,
         "formula": "actual / planned", "source": "derived", "renders": ["3.5×"], "appears_at": 40},
        {"id": "commit-default", "text": "the film-mode guess (commit.default): the viewer's number, not a fact",
         "value": 50, "source": "input", "appears_at": COMMIT_AT},
    ]


def film_json(fid, title):
    return {
        "id": fid,
        "title": title,
        "eyebrow": "CETI · CASE FILE",
        "lede": "TODO: one sentence, the belief this case tests.",
        "dur": DUR,
        "seed": 1,
        "palette": {"paper": "#E8DCC2", "ink": "#1E3A5C", "accent": "#C8452E", "muted": "#8E887C",
                    "chalk": "#F2ECDD", "dark": "#0A0D12", "soft": "#B9A277"},
        "type": {"disp": "Big Shoulders Display", "mono": "IBM Plex Mono"},
        "fonts": [
            {"family": "Big Shoulders Display", "weight": 600, "style": "normal"},
            {"family": "IBM Plex Mono", "weight": 400, "style": "normal"},
            {"family": "IBM Plex Mono", "weight": 500, "style": "normal"},
        ],
        "commit": {"at": COMMIT_AT, "title": "YOUR NUMBER", "prompt": "TODO: the one-number question?",
                   "default": 50, "min": 0, "max": 100, "unit": "TODO unit"},
        "chapters": [{"id": i, "beat": beat, "name": name, "t0": a, "t1": b,
                      "eyebrow": "CASE FILE · " + name.upper(), "title": "TODO " + name.lower()}
                     for i, beat, name, a, b in BEATS],
        "cards": [],
        "captions": [
            [0.6, 7.6, "TODO hook: the situation and the belief."],
            [8.4, 15.6, "TODO the commit question, asked plainly."],
            [16.4, 35.6, "TODO the case, one real example."],
            [36.4, 61.6, "TODO the count: marks before any ratio."],
            [62.4, 71.6, "TODO the Monday question."],
        ],
        "count": {"at": COUNT_AT},
        "brand": {"takeaway": "TODO: the one-line takeaway.", "at": BRAND_AT},
        "sources": [["S1", "TODO author, title, year, where"], ["S2", "TODO"], ["S3", "TODO"]],
        "honest": ["TODO: what this case is not (one line)."],
        "params": {"planned": 4, "actual": 14},
    }


FILM_JS = r"""/* __ID__ · film.js. The 75-second case. One clock: every frame is render(t, state, K), a pure function of
   (t, state). Scaffold from factory/tools/new_topic.py: the sheet, a placeholder per beat and the commit box.
   Contract (factory/FORMAT.md; helpers in factory/kit/kit.js, documented in factory/kit/README.md):
     window.FILM_RENDER = { setup(p, K), render(t, state, K), tryit?(values, state, K) }   K === window.KIT
   The kit draws the ground, the captions (FILM.captions) and the CETI brand card (FILM.brand.at); render() draws
   the material through K.tx / K.rc / K.ln / K.path / K.dim / K.stamp (layers field, marks, labels, chrome, cap,
   card, top) and mass on K.ctx (Canvas2D, design units). Precompute seeded orders in setup (K.shuffle, K.mulberry32).
   Never: Math.random, Date, performance, frameCount, millis, p.random in this file; no fetch; no Google Fonts. */
(function () {
'use strict';
const F = window.FILM;

window.FILM_RENDER = {
  setup(p, K) {
    // e.g. ORDER = K.shuffle([...Array(n).keys()], F.seed);   computed once, read by render
  },
  render(t, s, K) {
    const { tx, rc, seg, ease, C, LAYOUT } = K;
    const B = LAYOUT.content, A = F.commit.at, sealed = t >= A + 4.5;
    const ch = K.chapterAt(t);
    K.chrome(t, ch, { ledger: false,
      block: { title: F.title.toUpperCase(), lines: ['CASE FILE', 'ISSUED FOR REVIEW'], open: 0.4,
               slotLabel: 'ANSWER', slot: sealed ? 'SEALED' : null } });

    // HOOK: the belief (replace with the everyday situation)
    if (t < 16) {
      const u = ease(seg(t, 0.6, 1.6));
      K.wrap(F.lede, B.x1 - B.x0 - 40, 34, 'disp').slice(0, 3).forEach((line, i) =>
        tx('hook.b' + i, 'labels', B.x0, B.y0 + 70 + i * 42, line, { fam: 'disp', size: 34, op: u }));
    }
    // COMMIT: the kit's sealed commit box (the player pauses at commit.at on the live page)
    if (t >= A - 1 && t < 16) K.commitBox(t, s, { title: F.commit.title, prompt: F.commit.unit.toUpperCase() });

    // CASE, COUNT, MONDAY: placeholders until the beats are built
    const todo = { CASE: 'TODO the case: the fixture at true scale', COUNT: 'TODO the count: marks first',
                   MONDAY: 'TODO the Monday question' }[ch && ch.beat];
    if (todo) {
      const u = ease(seg(t, ch.t0, ch.t0 + 0.6));
      K.wrap(todo, B.x1 - B.x0, 28).slice(0, 2).forEach((line, i) =>
        tx('todo' + i, 'labels', B.x0, B.y0 + 80 + i * 36, line, { size: 28, weight: 500, op: u }));
      rc('todo.r', 'marks', B.x0, B.y0 + 120, B.x1 - B.x0, 2, { fill: C.accent, op: u });
    }
  },
};
})();
"""


def notes_md(fid, title):
    return f"""# {title} · NOTES

id `{fid}` · builder: TODO (opus) · page sha256 `TODO` (the shipper writes it from factory/catalogue.json)

## What it is
TODO: two sentences. The belief, the fixture, what the count shows.

## Timings
| beat | window | structure |
|------|--------|-----------|
| HOOK | 0 to 8 s | TODO |
| COMMIT | 8 to 16 s (commit.at {COMMIT_AT:g}, sealed at {COMMIT_AT + 4.5:g}) | TODO |
| THE CASE | 16 to 36 s | TODO |
| THE COUNT | 36 to 62 s (count.at {COUNT_AT:g}) | TODO |
| MONDAY | 62 to 72 s | TODO |
| BRAND | {BRAND_AT:g} to {DUR} s | the kit's CETI card |

## Kit
Helpers used: see factory/kit/README.md. Added locally in film.js (not in the kit): TODO or "nothing".

## Gate
`node factory/tools/gate.mjs factory/films/{fid}/build/{fid}.html --film factory/films/{fid} --json factory/films/{fid}/gate.json --shots <scratch>/shots`
Last run: TODO (verdict, rounds, what each round fixed; WARN rows and why they stand).

## Seat
Verdict: TODO (SHIP / REVISE / VETO), seat, fixes taken.

## Honest limits of the build
TODO
"""


def write(path, text, force):
    if os.path.exists(path) and not force:
        print("keep   %s (exists; --force to overwrite)" % path)
        return False
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(text)
    print("write  %s" % path)
    return True


def dump(obj):
    return json.dumps(obj, indent=1, ensure_ascii=False) + "\n"


def main():
    ap = argparse.ArgumentParser(description="Scaffold a 75-second case: factory/topics/<id>/ and factory/films/<id>/.")
    ap.add_argument("id", help="kebab-case id, e.g. sunk-cost")
    ap.add_argument("title", help='the film title, e.g. "The Concorde"')
    ap.add_argument("--force", action="store_true", help="overwrite existing files")
    ap.add_argument("--root", help="plugin root (default: found from this file)")
    a = ap.parse_args()
    if not ID_RE.match(a.id):
        sys.exit("id must be kebab-case: lowercase letters, digits and hyphens, 2 to 48 characters")
    root = os.path.abspath(a.root) if a.root else ((ceti_root and ceti_root(HERE)) or os.path.abspath(os.path.join(HERE, "..", "..")))
    topic = os.path.join(root, "factory", "topics", a.id)
    film = os.path.join(root, "factory", "films", a.id)
    write(os.path.join(topic, "brief.md"), brief_md(a.id, a.title), a.force)
    write(os.path.join(topic, "claims.json"), dump(topic_claims(a.id)), a.force)
    write(os.path.join(topic, "beats.md"), beats_md(a.id, a.title), a.force)
    write(os.path.join(film, "film.json"), dump(film_json(a.id, a.title)), a.force)
    write(os.path.join(film, "film.js"), FILM_JS.replace("__ID__", a.id), a.force)
    write(os.path.join(film, "claims.json"), dump(film_claims(a.id)), a.force)
    write(os.path.join(film, "NOTES.md"), notes_md(a.id, a.title), a.force)
    print("next   explore: fill factory/topics/%s/; build: python3 factory/kit/build.py factory/films/%s" % (a.id, a.id))


if __name__ == "__main__":
    main()
