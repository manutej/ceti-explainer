#!/usr/bin/env python3
"""repo_topic.py: read a local git repository and write a factory topic package whose every number is a claim.

    python3 factory/tools/repo_topic.py <path-to-local-git-repo> --id <id> [--days 7] [--rev HEAD]
                                        [--until now|head|<ISO 8601>] [--force] [--no-verify] [--root DIR]
    python3 factory/tools/repo_topic.py --check factory/topics/<id>/claims.json [--only <claim-id>]

Writes factory/topics/<id>/:

    facts.json    the raw extracted facts (git history, tree, README and docs, manifests, tests)
    claims.json   every number the film may use: {topic, repo, head, window, params, claims: [...]}. A claim has
                  `source` git | tree | readme | manifest | derived | input, a `recompute` shell command (read-only
                  git and text tools) with the `expect`ed output, or a `formula` over `params` (JS and Python alike)
    brief.md      the explorer's brief: "why is this repo valuable", the belief to break, the case (the repo itself),
                  the count structures proposed (commit timeline as marks, file tree as a structure, lines as a wall)
    beats.md      a 90-second cut: HOOK, COMMIT, CASE, COUNT, MONDAY, with captions built from the claims

How it reads, and what it never does:
- Everything is read from one pinned commit (--rev, default HEAD): `git log`, `git ls-tree`, `git cat-file`,
  `git grep`. Uncommitted work is not counted. The window is the last --days UTC calendar days ending at the
  anchor (--until: now, the pinned commit's time, or an ISO time); both ends are written into every command, so
  a recompute gives the same answer after new commits land.
- It never executes repository code: no tests, no build, no setup.py, no package scripts, no hooks. Test counts
  are found by reading test files (a static count of test functions), never by running a runner. Diffs run with
  --no-ext-diff --no-textconv so no configured driver runs either.
- It runs no git write command: only rev-parse, rev-list, log, ls-tree, cat-file and grep (enforced in git()).
- After writing, it re-runs every claim's recompute command and formula (as --check does) and prints the table.
  --check runs the shell commands stored in a claims file: use it on files this tool wrote.
"""
import argparse, collections, datetime as dt, json, math, os, re, shlex, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "scripts"))
try:
    from paths import ceti_root  # noqa: E402
except ImportError:  # pragma: no cover
    ceti_root = None

ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,47}$")
READ_VERBS = {"rev-parse", "rev-list", "log", "ls-tree", "cat-file", "grep"}
ENV = dict(os.environ, LC_ALL="C", TZ="UTC", GIT_PAGER="cat", PAGER="cat", GIT_OPTIONAL_LOCKS="0",
           GIT_TERMINAL_PROMPT="0")
GITC = ["-c", "core.quotePath=false", "-c", "core.fsmonitor=false"]

# Paths that are vendored or generated: counted in the tree, left out of the "own" lines and files (the wall).
# ERE that Python's re reads the same way (no \s, \w, \d, no lookarounds).
EXCL_RE = (r"(^|/)(vendor|node_modules|dist|build|third_party)/|(^|/)[^/]*\.egg-info/|\.min\.(js|css)$"
           r"|(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Cargo\.lock|poetry\.lock|Gemfile\.lock|composer\.lock)$")
# Test files, by path. Code files only (fixtures and baselines under tests/ are data, not tests).
CODE_EXT = r"(py|js|mjs|cjs|ts|tsx|jsx|go|rs|rb|java|kt|sh|php|cs|swift|c|cc|cpp)"
TEST_RE = (r"(^|/)(tests?|__tests__|specs?)/.*\." + CODE_EXT + r"$|(^|/)test_[^/]*\.py$|_test\.(py|go)$"
           r"|\.(test|spec)\.(js|mjs|cjs|ts|tsx|jsx)$|(^|/)test\.(js|mjs|py)$|_spec\.rb$|(^|/)[^/]*Tests?\.(java|kt|cs|swift)$")
# Static test-function patterns per language family: (name, path ERE, git grep ERE, the same in Python re).
TEST_FN = [
    ("python", r"\.py$", r"^[[:space:]]*(async[[:space:]]+)?def test", r"^[ \t\r\f\v]*(async[ \t\r\f\v]+)?def test"),
    ("javascript", r"\.(js|mjs|cjs|ts|tsx|jsx)$", r"^[[:space:]]*(test|it)(\.(only|skip|todo))?[[:space:]]*\(",
     r"^[ \t\r\f\v]*(test|it)(\.(only|skip|todo))?[ \t\r\f\v]*\("),
    ("go", r"\.go$", r"^func Test", r"^func Test"),
    ("rust", r"\.rs$", r"#\[test\]", r"#\[test\]"),
]
LANG = {
    "py": "Python", "js": "JavaScript", "mjs": "JavaScript", "cjs": "JavaScript", "jsx": "JavaScript",
    "ts": "TypeScript", "tsx": "TypeScript", "go": "Go", "rs": "Rust", "rb": "Ruby", "java": "Java", "kt": "Kotlin",
    "c": "C", "h": "C", "cc": "C++", "cpp": "C++", "hpp": "C++", "cs": "C#", "swift": "Swift", "php": "PHP",
    "sh": "Shell", "bash": "Shell", "zsh": "Shell", "html": "HTML", "htm": "HTML", "css": "CSS", "scss": "CSS",
    "md": "Markdown", "rst": "reStructuredText", "txt": "Text", "json": "JSON", "jsonl": "JSON", "yaml": "YAML",
    "yml": "YAML", "toml": "TOML", "xml": "XML", "svg": "SVG", "sql": "SQL", "ipynb": "Notebook", "tex": "TeX",
    "lua": "Lua", "r": "R", "jl": "Julia", "hs": "Haskell", "ml": "OCaml", "ex": "Elixir", "exs": "Elixir",
    "clj": "Clojure", "scala": "Scala", "dart": "Dart", "vue": "Vue", "svelte": "Svelte", "csv": "CSV", "tsv": "CSV",
}
CODE_LANGS = {"Python", "JavaScript", "TypeScript", "Go", "Rust", "Ruby", "Java", "Kotlin", "C", "C++", "C#", "Swift",
              "PHP", "Shell", "HTML", "CSS", "SQL", "Lua", "R", "Julia", "Haskell", "OCaml", "Elixir", "Clojure",
              "Scala", "Dart", "Vue", "Svelte"}
DOC_RE = r"\.(md|markdown|rst|adoc|txt)$"
DAY = 86400


# ------------------------------------------------------------------------------------------------ git, read only
def git(repo, *args, binary=False, stdin=None):
    verb = next(a for a in args if not a.startswith("-"))
    if verb not in READ_VERBS:
        raise SystemExit("refusing git %s: repo_topic.py runs read-only git commands only" % verb)
    r = subprocess.run(["git", "-C", repo] + GITC + list(args), input=stdin, capture_output=True, env=ENV)
    if r.returncode != 0:
        raise SystemExit("git %s failed: %s" % (" ".join(args), r.stderr.decode("utf-8", "replace").strip()))
    return r.stdout if binary else r.stdout.decode("utf-8", "replace")


def iso(ts):
    return dt.datetime.fromtimestamp(ts, dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")


def day_of(ts):
    return dt.datetime.fromtimestamp(ts, dt.timezone.utc).strftime("%Y-%m-%d")


def count_lines(data):
    return data.count(b"\n") + (1 if data and not data.endswith(b"\n") else 0)


def is_binary(data):
    return b"\0" in data[:8000]


def read_blobs(repo, shas):
    """{sha: bytes} for every blob, via one `git cat-file --batch`."""
    shas = list(dict.fromkeys(shas))
    if not shas:
        return {}
    out = git(repo, "cat-file", "--batch", binary=True, stdin=("\n".join(shas) + "\n").encode())
    blobs, i = {}, 0
    for _ in shas:
        nl = out.index(b"\n", i)
        head = out[i:nl].split()
        size = int(head[2])
        blobs[head[0].decode()] = out[nl + 1:nl + 1 + size]
        i = nl + 1 + size + 1
    return blobs


# ------------------------------------------------------------------------------------------------ extraction
def read_history(repo, sha):
    raw = git(repo, "log", "--no-renames", "--no-ext-diff", "--no-textconv", "--numstat",
              "--format=%x1e%H%x1f%ct%x1f%aN%x1f%aE%x1f%P%x1f%s", sha)
    commits = []
    for rec in raw.split("\x1e")[1:]:
        lines = rec.split("\n")
        h, ct, an, ae, parents, subj = lines[0].split("\x1f", 5)
        files, ins, dele = [], 0, 0
        for ln in lines[1:]:
            parts = ln.split("\t", 2)
            if len(parts) != 3:
                continue
            a, d, path = parts
            files.append(path)
            if a.isdigit() and d.isdigit():
                ins += int(a); dele += int(d)
        commits.append({"sha": h, "ts": int(ct), "date": day_of(int(ct)), "author": "%s <%s>" % (an, ae), "name": an,
                        "merge": len(parents.split()) > 1, "subject": subj, "ins": ins, "del": dele, "files": files})
    return commits


def md_plain(s):
    s = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", s)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    s = re.sub(r"[*_`]{1,3}", "", s)
    return " ".join(s.split())


def readme_facts(text):
    lines = text.split("\n")
    heads = []
    for i, ln in enumerate(lines):
        m = re.match(r"^(#{1,6})\s+(.*)$", ln)
        if m:
            heads.append({"level": len(m.group(1)), "text": md_plain(m.group(2)), "line": i + 1})
    # first prose paragraph in the opening 40 lines: skip headings, badges, html, fences, quotes, lists, metadata
    # blocks (**Status**: ...) and labels ending in ":"; none found → the H1 title is what it says it is
    paras, cur, fence = [], [], False
    for i, ln in enumerate(lines[:400]):
        st = ln.strip()
        if st.startswith("```"):
            fence = not fence
        if fence or st.startswith("```") or not st or re.match(r"^(#|\[!\[|!\[|<|>|[-*+] |\d+\. |\||=+$|-+$)", st):
            if cur:
                paras.append(cur); cur = []
            continue
        cur.append((i + 1, st))
    if cur:
        paras.append(cur)
    meta = re.compile(r"^(\*\*|__)[^*_]+(\*\*|__) ?:|^[A-Z][A-Za-z ]{0,24}: ")
    good = [p for p in paras if p[0][0] <= 40 and not all(meta.match(x) for _, x in p)
            and not p[-1][1].rstrip().endswith(":") and len(md_plain(" ".join(x for _, x in p)).split()) >= 5]
    h1 = next((h for h in heads if h["level"] == 1 and h["line"] <= 10), None)
    if good:
        para, start, end = [x for _, x in good[0]], good[0][0][0], good[0][-1][0]
    elif h1:
        para, start, end = [h1["text"]], h1["line"], h1["line"]
    else:
        para, start, end = [], None, None
    paragraph = md_plain(" ".join(para))
    words = paragraph.split()
    nw = lambda s: len([w for w in s.split() if re.search(r"[A-Za-z0-9]", w)])
    if nw(paragraph) <= 15:
        quote = paragraph
    else:
        first = re.split(r"(?<=[.!?])\s", paragraph, maxsplit=1)[0]
        if nw(first) <= 15:
            quote = first
        else:
            out, k = [], 0
            for w in words:
                out.append(w)
                k += 1 if re.search(r"[A-Za-z0-9]", w) else 0
                if k == 15:
                    break
            quote = " ".join(out).rstrip(",;:") + " …"
    return {"headings": heads, "first_paragraph": paragraph, "para_lines": [start, end], "quote": quote,
            "quote_words": nw(quote.replace("…", "")), "lines": count_lines(text.encode())}


def parse_manifest(path, text):
    base = os.path.basename(path)
    m = {"path": path, "kind": base, "name": None, "version": None, "deps": [], "dev_deps": [], "notes": []}
    try:
        if base in ("package.json", "composer.json") or path.endswith(".claude-plugin/plugin.json"):
            d = json.loads(text)
            m["name"], m["version"] = d.get("name"), d.get("version")
            m["deps"] = sorted((d.get("dependencies") or d.get("require") or {}).keys())
            m["dev_deps"] = sorted((d.get("devDependencies") or d.get("require-dev") or {}).keys())
            if isinstance(d.get("scripts"), dict):
                m["scripts"] = {k: v for k, v in d["scripts"].items() if isinstance(v, str)}
            if path.endswith("plugin.json"):
                m["kind"] = "claude-plugin"
                m["description"] = d.get("description")
        elif base == "pyproject.toml" or base == "Cargo.toml":
            import tomllib
            d = tomllib.loads(text)
            if base == "pyproject.toml":
                p = d.get("project") or {}
                poetry = (d.get("tool") or {}).get("poetry") or {}
                m["name"], m["version"] = p.get("name") or poetry.get("name"), p.get("version") or poetry.get("version")
                m["deps"] = list(p.get("dependencies") or [])
                m["dev_deps"] = sorted(sum((list(v) for v in (p.get("optional-dependencies") or {}).values()), []))
                m["pytest"] = "pytest" in (d.get("tool") or {})
            else:
                p = d.get("package") or {}
                m["name"], m["version"] = p.get("name"), p.get("version")
                m["deps"] = sorted((d.get("dependencies") or {}).keys())
                m["dev_deps"] = sorted((d.get("dev-dependencies") or {}).keys())
        elif re.match(r"^requirements.*\.txt$", base):
            m["kind"] = "requirements"
            m["deps"] = [ln.strip() for ln in text.split("\n") if not re.match(r"^[ \t\r\f\v]*(#|-|$)", ln)]
        elif base == "go.mod":
            mod = re.search(r"^module\s+(\S+)", text, re.M)
            m["name"] = mod and mod.group(1)
            block = False
            for ln in text.split("\n"):
                if re.match(r"^require \(", ln):
                    block = True; continue
                if block and re.match(r"^\)", ln):
                    block = False; continue
                f = ln.split()
                if block and f and not f[0].startswith("//"):
                    m["deps"].append(f[0])
                elif re.match(r"^require [^(]", ln):
                    m["deps"].append(f[1])
        elif base == "Gemfile":
            m["deps"] = re.findall(r"^\s*gem\s+['\"]([^'\"]+)", text, re.M)
        elif base in ("setup.py", "setup.cfg", "Pipfile"):
            m["notes"].append("present; not parsed (setup.py is code and is never run)")
    except Exception as e:  # a malformed manifest is a fact, not a crash
        m["notes"].append("could not parse: %s" % e)
    return m


MANIFEST_RE = (r"(^|/)(package\.json|pyproject\.toml|requirements[^/]*\.txt|Cargo\.toml|go\.mod|Gemfile|composer\.json"
               r"|setup\.py|setup\.cfg|Pipfile)$|(^|/)\.claude-plugin/plugin\.json$")


def extract(repo, rev, days, until_arg):
    sha = git(repo, "rev-parse", "--verify", rev + "^{commit}").strip()
    try:
        branch = git(repo, "rev-parse", "--abbrev-ref", "HEAD").strip()
    except SystemExit:
        branch = None
    shallow = git(repo, "rev-parse", "--is-shallow-repository").strip() == "true"
    commits = read_history(repo, sha)
    head_ts = int(git(repo, "log", "-1", "--format=%ct", sha).strip())
    if until_arg == "now":
        until = int(dt.datetime.now(dt.timezone.utc).timestamp())
    elif until_arg == "head":
        until = head_ts
    else:
        u = dt.datetime.fromisoformat(until_arg.replace("Z", "+00:00"))
        until = int((u if u.tzinfo else u.replace(tzinfo=dt.timezone.utc)).timestamp())
    day0 = dt.datetime.fromtimestamp(until, dt.timezone.utc).date() - dt.timedelta(days=days - 1)
    since = int(dt.datetime(day0.year, day0.month, day0.day, tzinfo=dt.timezone.utc).timestamp())
    win = [c for c in commits if since <= c["ts"] <= until]
    win_nm = [c for c in win if not c["merge"]]
    alln = [c for c in commits if not c["merge"]]

    per_day = collections.OrderedDict(((day0 + dt.timedelta(days=k)).isoformat(), 0) for k in range(days))
    for c in win:
        per_day[c["date"]] = per_day.get(c["date"], 0) + 1
    touched = collections.Counter(f for c in win_nm for f in c["files"])
    top_files = sorted(touched.items(), key=lambda kv: (-kv[1], kv[0].encode()))[:3]
    largest = max(win_nm, key=lambda c: (c["ins"] + c["del"], c["ts"]), default=None)
    largest_all = max(alln, key=lambda c: (c["ins"] + c["del"], c["ts"]), default=None)
    first_ts = min((c["ts"] for c in commits), default=head_ts)
    last_ts = max((c["ts"] for c in commits), default=head_ts)
    authors_all = collections.Counter(c["author"] for c in commits)
    authors_win = collections.Counter(c["author"] for c in win)

    # tree at the pinned commit
    entries = []
    for e in git(repo, "ls-tree", "-r", "-z", sha).split("\0"):
        if not e:
            continue
        meta, path = e.split("\t", 1)
        mode, typ, bsha = meta.split()
        if typ == "blob":
            entries.append((path, bsha, mode))
    blobs = read_blobs(repo, [b for _, b, _ in entries])
    files = []
    for path, bsha, mode in entries:
        data = blobs[bsha]
        binary = is_binary(data)
        ext = os.path.splitext(path)[1][1:].lower() if "." in os.path.basename(path) else ""
        files.append({"path": path, "sha": bsha, "bytes": len(data), "binary": binary,
                      "lines": 0 if binary else count_lines(data), "ext": ext,
                      "lang": LANG.get(ext, "other" if ext else "no extension"),
                      "own": not re.search(EXCL_RE, path), "test": bool(re.search(TEST_RE, path))})
    text_of = lambda f: blobs[f["sha"]].decode("utf-8", "replace")
    own = [f for f in files if f["own"]]
    langs = collections.defaultdict(lambda: {"files": 0, "lines": 0, "files_own": 0, "lines_own": 0})
    for f in files:
        L = langs[f["lang"]]
        L["files"] += 1; L["lines"] += f["lines"]
        if f["own"]:
            L["files_own"] += 1; L["lines_own"] += f["lines"]
    langs = dict(sorted(langs.items(), key=lambda kv: (-kv[1]["lines_own"], kv[0])))
    top_dirs = collections.Counter(f["path"].split("/")[0] + ("/" if "/" in f["path"] else "") for f in own)

    # tests: files by path, functions by static reading, runners by evidence (never run)
    tests = [f for f in files if f["test"]]
    fn_counts = {}
    for name, pre, _gre, pyre in TEST_FN:
        rx = re.compile(pyre)
        n = sum(1 for f in tests if re.search(pre, f["path"]) and not f["binary"]
                for ln in text_of(f).split("\n") if rx.search(ln))
        if n or any(re.search(pre, f["path"]) for f in tests):
            fn_counts[name] = n
    no_fn = [f["path"] for f in tests if not f["binary"] and not any(
        re.search(pre, f["path"]) and re.search(pyre, text_of(f), re.M) for _n, pre, _g, pyre in TEST_FN)]
    runners = []
    def ev(kind, why):
        runners.append({"runner": kind, "evidence": why})
    js_tests = [f for f in tests if re.search(r"\.(js|mjs|cjs|ts|tsx|jsx)$", f["path"])]
    nt = [f["path"] for f in js_tests if re.search(r"""['"]node:test['"]""", text_of(f))]
    if nt:
        ev("node --test", "%d test files import node:test (e.g. %s)" % (len(nt), nt[0]))
    for f in files:
        b = os.path.basename(f["path"])
        if b in ("pytest.ini", "conftest.py") and f["own"]:
            ev("pytest", f["path"]); break
    if any(f["path"].endswith(".py") for f in tests) and not any(r["runner"] == "pytest" for r in runners):
        ut = [f["path"] for f in tests if f["path"].endswith(".py") and re.search(r"^\s*import unittest|^\s*from unittest", text_of(f), re.M)]
        if ut:
            ev("unittest", "%d test files import unittest (e.g. %s)" % (len(ut), ut[0]))

    # README, docs, manifests
    readme_f = next((f for f in sorted(files, key=lambda f: (len(f["path"]), f["path"]))
                     if "/" not in f["path"] and re.match(r"(?i)^readme(\.(md|markdown|rst|txt))?$", f["path"])), None)
    readme = dict(readme_facts(text_of(readme_f)), path=readme_f["path"]) if readme_f else None
    docs = [f for f in files if re.search(DOC_RE, f["path"]) and f["own"]]
    top_docs = [f["path"] for f in files if "/" not in f["path"] and re.search(r"\.(md|markdown|rst|adoc)$", f["path"])]
    manifests = [parse_manifest(f["path"], text_of(f)) for f in files
                 if re.search(MANIFEST_RE, f["path"]) and f["own"]]
    for m in manifests:
        if m["kind"] == "package.json":
            alld = set(m["deps"]) | set(m["dev_deps"])
            for r in ("jest", "vitest", "mocha", "ava", "tap", "playwright", "@playwright/test"):
                if r in alld:
                    ev(r, "%s lists %s" % (m["path"], r))
            if m.get("scripts", {}).get("test"):
                ev("npm test (script text only)", "%s scripts.test = %r" % (m["path"], m["scripts"]["test"][:80]))
        if m["kind"] == "pyproject.toml" and m.get("pytest"):
            ev("pytest", "%s has [tool.pytest]" % m["path"])
        if m["kind"] == "go.mod" and any(f["path"].endswith("_test.go") for f in tests):
            ev("go test", m["path"] + " and _test.go files")
        if m["kind"] == "Cargo.toml" and fn_counts.get("rust"):
            ev("cargo test", m["path"] + " and #[test] functions")
        if m["kind"] == "requirements" and any(re.match(r"(?i)^pytest\b", d) for d in m["deps"]):
            ev("pytest", "%s lists pytest" % m["path"])

    window = {"days": days, "since": iso(since), "until": iso(until), "since_ts": since, "until_ts": until,
              "anchor": until_arg, "first_day": day0.isoformat(), "last_day": list(per_day)[-1]}
    return {
        "tool": "factory/tools/repo_topic.py", "repo": os.path.abspath(repo), "name": os.path.basename(os.path.abspath(repo)),
        "rev": rev, "head": sha, "head_short": sha[:7], "branch": branch, "shallow": shallow, "head_ts": head_ts,
        "head_time": iso(head_ts), "window": window,
        "git": {
            "commits": len(commits), "merges": sum(c["merge"] for c in commits), "authors": len(authors_all),
            "authors_by_commits": [[a.split(" <")[0], n] for a, n in authors_all.most_common()], "first_commit": iso(first_ts), "first_ts": first_ts,
            "last_commit": iso(last_ts), "last_ts": last_ts, "first_day": day_of(first_ts),
            "age_days": (head_ts - first_ts) // DAY, "days_with_commits": len({c["date"] for c in commits}),
            "insertions": sum(c["ins"] for c in alln), "deletions": sum(c["del"] for c in alln),
            "largest_commit": largest_all and {k: largest_all[k] for k in ("sha", "date", "subject", "ins", "del")},
            "window": {
                "commits": len(win), "merges": sum(c["merge"] for c in win), "authors": len(authors_win),
                "authors_by_commits": [[a.split(" <")[0], n] for a, n in authors_win.most_common()], "days_active": sum(1 for v in per_day.values() if v),
                "per_day": per_day, "busiest_day": max(per_day.items(), key=lambda kv: (kv[1], kv[0])) if win else None,
                "insertions": sum(c["ins"] for c in win_nm), "deletions": sum(c["del"] for c in win_nm),
                "files_touched": len(touched), "top_files": top_files,
                "largest_commit": largest and {k: largest[k] for k in ("sha", "date", "subject", "ins", "del")}
                                  | {"files": len(largest["files"])},
                "commits_list": [{k: c[k] for k in ("sha", "date", "name", "subject", "ins", "del", "merge")}
                                 | {"files": len(c["files"])} for c in win],
            },
        },
        "tree": {
            "files": len(files), "files_own": len(own), "binary_files": sum(f["binary"] for f in files),
            "lines": sum(f["lines"] for f in files), "lines_own": sum(f["lines"] for f in own),
            "bytes": sum(f["bytes"] for f in files), "excluded_pattern": EXCL_RE,
            "excluded_files": len(files) - len(own), "languages": langs,
            "code_languages": [k for k in langs if k in CODE_LANGS and langs[k]["files_own"]],
            "top_dirs": top_dirs.most_common(), "largest_files_own": [
                {"path": f["path"], "lines": f["lines"]} for f in sorted(own, key=lambda f: (-f["lines"], f["path"]))[:5]],
        },
        "tests": {"pattern": TEST_RE, "files": len(tests), "files_list": [f["path"] for f in tests][:200],
                  "functions_static": fn_counts, "functions_total": sum(fn_counts.values()), "runners": runners,
                  "files_without_recognised_function": no_fn,
                  "executed": False},
        "readme": readme,
        "docs": {"pattern": DOC_RE, "files_own": len(docs), "top_level": top_docs,
                 "docs_dir": any(f["path"].startswith("docs/") for f in files)},
        "manifests": manifests,
        "dependents": "not knowable from a local clone (who imports or vendors this repo lives outside it)",
    }


# ------------------------------------------------------------------------------------------------ claims
def wall_scale(n):
    for k in range(0, 12):
        for m in (1, 2, 5):
            s = m * 10 ** k
            if n / s <= 1000:
                return s
    return 10 ** 12


def norm(out):
    return "\n".join(" ".join(ln.split()) for ln in out.strip().split("\n") if ln.strip())


def fmt(n):
    return "{:,}".format(n) if isinstance(n, int) else str(n)


def build_claims(F, topic_id):
    R = shlex.quote(F["repo"]); S = F["head"]; W = F["window"]; G = "git -c core.quotePath=false -C %s" % R; GD = "TZ=UTC " + G
    win = "--since=%s --until=%s" % (W["since"], W["until"])
    log_ns = "%s log --no-renames --no-ext-diff --no-textconv --numstat --format=" % G
    sum_ins = "awk '$1 ~ /^[0-9]+$/ {s+=$1} END {print s+0}'"
    sum_del = "awk '$2 ~ /^[0-9]+$/ {s+=$2} END {print s+0}'"
    blobs = "%s ls-tree -r %s | awk -F'\\t' '{split($1, m, \" \"); if (m[2] == \"blob\") print $2}'" % (G, S)
    own = "grep -vE %s" % shlex.quote(EXCL_RE)
    lines_of = ("tr '\\n' '\\0' | xargs -0 -r git -c core.quotePath=false --literal-pathspecs -C %s grep -I -c -e '' %s -- "
                "| awk -F: '{s+=$NF} END {print s+0}'" % (R, S))
    gw, gt, tr = F["git"]["window"], F["tree"], F["tests"]
    P, C = {}, []
    me = "python3 factory/tools/repo_topic.py --check factory/topics/%s/claims.json --only " % topic_id

    def add(cid, text, value, source, where, recompute=None, expect=None, param=None, formula=None,
            renders=None, check="equals", note=None):
        c = {"id": cid, "text": text, "value": value, "source": source}
        if param is not None:
            P[param] = value
            c["formula"] = formula or param
        elif formula:
            c["formula"] = formula
        c["recompute"] = recompute or (me + cid)
        if recompute:
            c["expect"] = norm(str(value) if expect is None else expect)
            if check != "equals":
                c["check"] = check
        if renders:
            c["renders"] = renders
        if note:
            c["note"] = note
        c["where"] = where
        C.append(c)

    # git: the window
    add("window-days", "the window: %d UTC calendar days, %s to %s (until %s)" % (W["days"], W["first_day"], W["last_day"], W["until"]),
        W["days"], "git", "COMMIT question; COUNT timeline (one column per day)", param="window_days",
        recompute="echo %d  # --days; since %s, until %s" % (W["days"], W["since"], W["until"]))
    add("commits-window", "commits in the window (merges included)", gw["commits"], "git",
        "COUNT: one mark per commit; COMMIT answer", param="commits_window", renders=[fmt(gw["commits"])],
        recompute="%s rev-list --count %s %s" % (G, win, S))
    add("days-active", "days in the window with at least one commit", gw["days_active"], "git",
        "COUNT: columns with marks", param="days_active",
        recompute="%s log %s --format=%%cd --date=format-local:%%Y-%%m-%%d %s | LC_ALL=C sort -u | wc -l" % (GD, win, S))
    timeline_cmd = "%s log %s --format=%%cd --date=format-local:%%Y-%%m-%%d %s | LC_ALL=C sort | uniq -c" % (GD, win, S)
    add("timeline", "commits per UTC day in the window (zeros are days with none)", list(gw["per_day"].items()), "git",
        "COUNT: the timeline of marks", recompute=timeline_cmd,
        expect="\n".join("%d %s" % (v, d) for d, v in gw["per_day"].items() if v),
        note="recompute prints only the days with commits; the other days in the window are 0")
    if gw["busiest_day"]:
        add("busiest-day", "the busiest day in the window: %s" % gw["busiest_day"][0], gw["busiest_day"][1], "git",
            "COUNT: the tallest column", param="busiest_day_commits",
            recompute=timeline_cmd + " | LC_ALL=C sort -k1,1nr | head -1 | awk '{print $1}'")
    add("authors-window", "distinct authors (name and email) in the window", gw["authors"], "git", "CASE or facts only",
        param="authors_window", recompute="%s log %s --format='%%aN <%%aE>' %s | LC_ALL=C sort -u | wc -l" % (G, win, S))
    add("ins-window", "lines inserted in the window (merges excluded)", gw["insertions"], "git", "CASE: the change",
        param="ins_window", recompute="%s %s --no-merges %s | %s" % (log_ns, win, S, sum_ins))
    add("del-window", "lines deleted in the window (merges excluded)", gw["deletions"], "git", "CASE: the change",
        param="del_window", recompute="%s %s --no-merges %s | %s" % (log_ns, win, S, sum_del))
    add("net-window", "net lines added in the window", gw["insertions"] - gw["deletions"], "derived", "CASE",
        formula="ins_window - del_window")
    if gw["largest_commit"]:
        L = gw["largest_commit"]
        add("largest-window", "the largest commit in the window, %s \"%s\": lines changed (inserted + deleted)"
            % (L["sha"][:7], L["subject"][:60]), L["ins"] + L["del"], "git", "CASE: the biggest single change",
            param="largest_window_lines",
            recompute=("%s log %s --no-merges --no-renames --no-ext-diff --no-textconv --numstat --format=@%%H %s | "
                       "awk '/^@/ {c=$0; next} $1 ~ /^[0-9]+$/ {t[c]+=$1+$2} END {for (k in t) if (t[k]>m) m=t[k]; print m+0}'")
            % (G, win, S))
    if gw["top_files"]:
        add("top-files", "the most-touched files in the window (commits touching each, merges excluded)",
            [[p, n] for p, n in gw["top_files"]], "git", "CASE: what the week was about",
            recompute="%s log %s --no-merges --no-renames --name-only --format= %s | grep -v '^$' | LC_ALL=C sort | uniq -c "
                      "| LC_ALL=C sort -k1,1nr -k2 | head -3" % (G, win, S),
            expect="\n".join("%d %s" % (n, p) for p, n in gw["top_files"]))
        add("top-file-commits", "commits that touched the most-touched file, %s" % gw["top_files"][0][0],
            gw["top_files"][0][1], "git", "CASE caption", param="top_file_commits",
            recompute="%s rev-list --count --full-history --no-merges %s %s -- %s" % (G, win, S, shlex.quote(gw["top_files"][0][0])))
    # git: overall
    add("commits-all", "commits reachable from %s (all time)" % F["head_short"], F["git"]["commits"], "git",
        "COUNT or MONDAY context", param="commits_all", recompute="%s rev-list --count %s" % (G, S))
    add("authors-all", "distinct authors, all time", F["git"]["authors"], "git", "facts", param="authors_all",
        recompute="%s log --format='%%aN <%%aE>' %s | LC_ALL=C sort -u | wc -l" % (G, S))
    add("first-day", "the first commit's UTC date", F["git"]["first_day"], "git", "HOOK or CASE context",
        recompute="%s log --format=%%cd --date=format-local:%%Y-%%m-%%d %s | LC_ALL=C sort | head -1" % (GD, S))
    add("first-ts", "the first commit's time (unix seconds)", F["git"]["first_ts"], "git", "input to age-days",
        param="first_ts", recompute="%s log --format=%%ct %s | LC_ALL=C sort -n | head -1" % (G, S))
    add("head-ts", "the pinned commit's time (unix seconds), %s" % F["head_time"], F["head_ts"], "git",
        "input to age-days", param="head_ts", recompute="%s log -1 --format=%%ct %s" % (G, S))
    add("age-days", "days from the first commit to the pinned commit", F["git"]["age_days"], "derived", "CASE context",
        formula="Math.floor((head_ts - first_ts) / 86400)")
    add("days-with-commits", "distinct UTC days with a commit, all time", F["git"]["days_with_commits"], "git", "facts",
        param="days_with_commits_all",
        recompute="%s log --format=%%cd --date=format-local:%%Y-%%m-%%d %s | LC_ALL=C sort -u | wc -l" % (GD, S))
    add("ins-all", "lines inserted, all time (merges excluded)", F["git"]["insertions"], "git", "facts",
        param="ins_all", recompute="%s --no-merges %s | %s" % (log_ns, S, sum_ins))
    add("del-all", "lines deleted, all time (merges excluded)", F["git"]["deletions"], "git", "facts",
        param="del_all", recompute="%s --no-merges %s | %s" % (log_ns, S, sum_del))
    # tree
    add("files", "files tracked at %s (all, incl. vendored and generated)" % F["head_short"], gt["files"], "tree",
        "facts", param="files_all", recompute="%s | wc -l" % blobs)
    add("files-own", "files tracked, without vendored or generated paths", gt["files_own"], "tree",
        "COUNT: the tree, one cell per file", param="files_own", renders=[fmt(gt["files_own"])],
        recompute="%s | %s | wc -l" % (blobs, own))
    add("lines", "text lines in tracked files (all)", gt["lines"], "tree", "facts", param="lines_all",
        recompute="%s | %s" % (blobs, lines_of))
    add("lines-own", "text lines without vendored or generated paths", gt["lines_own"], "tree",
        "COUNT: the wall", param="lines_own", renders=[fmt(gt["lines_own"])],
        recompute="%s | %s | %s" % (blobs, own, lines_of))
    sc = wall_scale(gt["lines_own"])
    add("wall-scale", "lines per mark on the wall (smallest 1-2-5 step that keeps the wall at or under 1,000 marks)",
        sc, "derived", "COUNT: the wall's legend", param="wall_scale", renders=[fmt(sc)],
        recompute="echo %d  # chosen by wall_scale(lines_own)" % sc)
    add("wall-marks", "marks on the wall", round(gt["lines_own"] / sc), "derived", "COUNT: the wall",
        formula="Math.round(lines_own / wall_scale)", renders=[fmt(round(gt["lines_own"] / sc))])
    add("top-dirs", "top-level folders (and root) holding own files", len(gt["top_dirs"]), "tree",
        "COUNT: the tree's branches", param="top_dirs",
        recompute="%s | %s | awk -F/ '{print (NF>1 ? $1\"/\" : $1)}' | LC_ALL=C sort -u | wc -l" % (blobs, own))
    langs = [(k, v) for k, v in gt["languages"].items() if k in CODE_LANGS and v["files_own"]]
    add("code-languages", "programming languages with own files (by extension)", len(langs), "tree", "facts",
        param="code_languages", note=", ".join(k for k, _ in langs),
        recompute="echo %d  # extension map in repo_topic.py LANG; see facts.json tree.languages" % len(langs))
    if langs:
        k, v = langs[0]
        exts = sorted(e for e, l in LANG.items() if l == k)
        rx = r"\.(%s)$" % "|".join(exts)
        add("lang-top-lines", "own lines in %s, the largest programming language" % k, v["lines_own"], "tree",
            "CASE or COUNT", param="lang_top_lines",
            recompute="%s | %s | grep -E %s | %s" % (blobs, own, shlex.quote(rx), lines_of))
    # tests
    add("test-files", "test files by path (code files under tests/, test_*.py, *.test.js and the like)", tr["files"],
        "tree", "CASE: what it tests", param="test_files", renders=[fmt(tr["files"])],
        recompute="%s | grep -cE %s" % (blobs, shlex.quote(TEST_RE)))
    tsum = []
    for name, pre, gre, _ in TEST_FN:
        if name not in tr["functions_static"]:
            continue
        n = tr["functions_static"][name]
        cid = "test-fns-" + name
        tsum.append(cid)
        add(cid, "%s test functions found by reading the test files (not run)" % name, n, "tree", "CASE: what it tests",
            param="test_fns_" + name,
            recompute=("%s | grep -E %s | grep -E %s | tr '\\n' '\\0' | xargs -0 -r git -c core.quotePath=false --literal-pathspecs -C %s "
                       "grep -c -E %s %s -- | awk -F: '{s+=$NF} END {print s+0}'")
                      % (blobs, shlex.quote(TEST_RE), shlex.quote(pre), R, shlex.quote(gre), S))
    if tsum:
        add("test-fns", "test functions found by reading, all languages (none executed)", tr["functions_total"],
            "derived", "CASE: what it tests", formula=" + ".join("test_fns_" + c[9:] for c in tsum),
            renders=[fmt(tr["functions_total"])])
    # docs and README
    add("doc-files", "documentation files (md, rst, adoc, txt) without vendored paths", F["docs"]["files_own"], "tree",
        "facts", param="doc_files", recompute="%s | %s | grep -cE %s" % (blobs, own, shlex.quote(DOC_RE)))
    rd = F["readme"]
    if rd:
        a, b = rd["para_lines"]
        add("readme-quote", "what it is, in the README's own words (%d words; %s lines %s to %s)" % (rd["quote_words"], rd["path"], a, b),
            rd["quote"], "readme", "HOOK; CASE", check="contains_md",
            recompute="%s cat-file -p %s:%s | sed -n '%d,%dp'" % (G, S, shlex.quote(rd["path"]), a, b),
            expect=rd["quote"].replace(" …", ""),
            note="check: the README text at those lines, markdown stripped, contains the quote (… marks a cut)")
        add("readme-headings", "headings in %s" % rd["path"], len(rd["headings"]), "readme", "facts",
            param="readme_headings",
            recompute="%s cat-file -p %s:%s | grep -cE '^#{1,6}[[:space:]]'" % (G, S, shlex.quote(rd["path"])),
            note="counts fenced-code lines that start with # too, as the Python reader does")
    # manifests
    mids = []
    for i, m in enumerate(F["manifests"]):
        if not (m["deps"] or m["kind"] in ("package.json", "pyproject.toml", "Cargo.toml", "go.mod", "requirements")):
            continue
        cid = "deps-%d" % (i + 1)
        q = "%s cat-file -p %s:%s" % (G, S, shlex.quote(m["path"]))
        if m["kind"] in ("package.json", "composer.json", "claude-plugin"):
            key = "require" if m["kind"] == "composer.json" else "dependencies"
            rc = q + " | python3 -I -c 'import json,sys; print(len(json.load(sys.stdin).get(\"%s\") or {}))'" % key
        elif m["kind"] == "pyproject.toml":
            rc = q + " | python3 -I -c 'import tomllib,sys; print(len((tomllib.load(sys.stdin.buffer).get(\"project\") or {}).get(\"dependencies\") or []))'"
        elif m["kind"] == "Cargo.toml":
            rc = q + " | python3 -I -c 'import tomllib,sys; print(len(tomllib.load(sys.stdin.buffer).get(\"dependencies\") or {}))'"
        elif m["kind"] == "requirements":
            rc = q + " | grep -cvE '^[[:space:]]*(#|-|$)'"
        elif m["kind"] == "go.mod":
            rc = q + " | awk '/^require \\(/ {b=1; next} b && /^\\)/ {b=0; next} b && NF && $1 !~ /^\\/\\// {n++} /^require [^(]/ {n++} END {print n+0}'"
        elif m["kind"] == "Gemfile":
            rc = q + " | grep -cE \"^[[:space:]]*gem[[:space:]]+['\\\"]\""
        else:
            continue
        mids.append(cid)
        add(cid, "direct runtime dependencies declared in %s" % m["path"], len(m["deps"]), "manifest",
            "CASE: what it depends on", param="deps_%d" % (i + 1), recompute=rc, note=", ".join(m["deps"][:20]))
    if mids:
        add("deps-total", "direct runtime dependencies across manifests", sum(P["deps_" + c[5:]] for c in mids),
            "derived", "CASE: what it depends on", formula=" + ".join("deps_" + c[5:] for c in mids))
    add("commit-default", "the film-mode guess (commit.default): one commit a day; the viewer's number, not a fact",
        W["days"], "input", "COMMIT (film mode types it)", formula="window_days")
    return P, C


# ------------------------------------------------------------------------------------------------ check
SAFE_HEADS = {"git", "sort", "uniq", "wc", "awk", "grep", "sed", "head", "tr", "xargs", "echo", "python3"}


def safe_command(cmd):
    """Only pipelines of read-only tools, as this script writes them. Not a sandbox: check files you wrote."""
    for seg in re.split(r"\|", re.sub(r"(^|\|)\s*([A-Z_]+=[^\s|]+\s+)+", r"\1", re.sub(r"'[^']*'|\"(?:\\.|[^\"\\])*\"", "''", cmd.split("  #")[0]))):
        w = seg.split()
        if not w or w[0] not in SAFE_HEADS or re.search(r"[;&`$<>]", seg):
            return False
        if w[0] == "git" and not any(v in READ_VERBS for v in w):
            return False
        if w[0] == "xargs" and "grep" not in w:
            return False
    return True


class _Math:
    floor, ceil, abs, max, min = staticmethod(math.floor), staticmethod(math.ceil), staticmethod(abs), staticmethod(max), staticmethod(min)
    round = staticmethod(lambda x: math.floor(x + 0.5))


def check(claims_doc, only=None, cwd=None, quiet=False):
    P, rows, ok = claims_doc.get("params", {}), [], True
    env = dict(ENV)
    for c in claims_doc["claims"]:
        if only and c["id"] != only:
            continue
        status, got = "ok", ""
        if "expect" in c:
            cmd = c["recompute"]
            if not safe_command(cmd):
                status, got = "REFUSED", "not a read-only pipeline"
            else:
                r = subprocess.run(["bash", "-c", cmd], capture_output=True, text=True, env=env, cwd=cwd)
                out = norm(r.stdout)
                if c.get("check") == "contains_md":
                    good = c["expect"] in md_plain(r.stdout)
                else:
                    good = out == c["expect"]
                got = out.split("\n")[0][:60] + (" …" if "\n" in out else "")
                status = "ok" if good else "MISMATCH"
        if c.get("formula") and c.get("source") in ("derived", "input"):
            try:
                v = eval(c["formula"], {"__builtins__": {}}, dict(P, Math=_Math))
                got = str(v)
                if not isinstance(c["value"], (int, float)) or abs(v - c["value"]) > 1e-9:
                    status = "MISMATCH"
            except Exception as e:
                status, got = "ERROR", str(e)
        elif c.get("formula") and c["formula"] in P and P[c["formula"]] != c["value"]:
            status = "MISMATCH"
        ok &= status == "ok"
        rows.append((c["id"], status, got))
    if not quiet:
        w = max([len(r[0]) for r in rows] + [5])
        for cid, st, got in rows:
            print("  %-*s  %-8s %s" % (w, cid, st, got))
        print("CHECK %s · %d claims" % ("PASS" if ok else "FAIL", len(rows)))
    return ok


# ------------------------------------------------------------------------------------------------ writing
def short(p, n=28):
    b = os.path.basename(p)
    return b if len(b) <= n else b[:n - 1] + "…"


def brief_md(F, P, C, tid):
    g, gw, t, ts, rd, W = F["git"], F["git"]["window"], F["tree"], F["tests"], F["readme"], F["window"]
    name = F["name"]
    quote = rd["quote"] if rd else None
    alive = gw["commits"] > 0
    tf = gw["top_files"]
    L = gw["largest_commit"]
    rows = "\n".join("| %s | %s | %s | %s |" % (c["id"], c["text"].replace("|", "/"),
                     (fmt(c["value"]) if not isinstance(c["value"], (list, dict)) else "see claims.json"),
                     c.get("formula") if c["source"] in ("derived", "input") else "`%s` (%s)" % (c["source"], "recompute in claims.json"))
                     for c in C)
    deps = [m for m in F["manifests"] if m["deps"]]
    depline = "; ".join("%s declares %d (%s)" % (m["path"], len(m["deps"]), ", ".join(m["deps"][:6]) + (" …" if len(m["deps"]) > 6 else ""))
                        for m in deps) or "no dependency manifest with entries was found"
    runners = "; ".join("%s (%s)" % (r["runner"], r["evidence"]) for r in ts["runners"]) or "none detected"
    sc = P["wall_scale"]
    dormant = "" if alive else (
        "\n**Dormant window.** No commit landed in the %d days ending %s; the last one is %s. Re-run with `--until head` "
        "to film the last active week, or make the film about the silence.\n" % (W["days"], W["last_day"], g["last_commit"]))
    return f"""# {name} · brief (repo reader)

id: `{tid}` · room: exec · format: the case, 90-second cut (beats.md; the factory gate's 75 s mapping is in it)
explorer: factory/tools/repo_topic.py (machine-read; an explorer reviews before building) · pinned commit
`{F['head']}` ({F['head_time']}) · window {W['first_day']} to {W['last_day']} UTC ({W['days']} days, until {W['until']})
{dormant}
## The exec question
"Why is this repo valuable?"

## The belief
"You cannot tell what a codebase is worth without reading the code." The repo answers in counts instead: what it
says it is, how big it is, how alive it is, what it tests and what it leans on, all read from its history and tree
without running a line of it.

## The everyday situation (HOOK)
Someone hands you a repo link before a budget meeting: fund it, freeze it or fold it? You have ninety seconds and no
time to read code. The README's first line is all most people ever see{(': "' + quote + '"') if quote else ' (this repo has no README)'}

## The mechanism
A repo's history is a ledger that nobody edits: every commit has a time, an author and the lines it moved. Counted,
the ledger shows whether the thing is alive ({gw['commits']} commits on {gw['days_active']} of {W['days']} days),
what the work was about this week (the most-touched files), and how large and how tested it is (files, lines,
test files). THE COUNT draws those counts as marks before any ratio.

## The fixture: the repo itself
- **What it is**: {('"' + quote + '" (' + rd['path'] + ', ' + ('line %d' % rd['para_lines'][0] if rd['para_lines'][0] == rd['para_lines'][1] else 'lines %d to %d' % tuple(rd['para_lines'])) + ')') if rd else 'no README at the root'}.
- **How big**: {fmt(t['files'])} tracked files, {fmt(t['lines'])} text lines; without vendored or generated paths
  {fmt(t['files_own'])} files and {fmt(t['lines_own'])} lines. Languages (own lines): {', '.join('%s %s' % (k, fmt(v['lines_own'])) for k, v in list(t['languages'].items())[:5])}.
- **How alive**: {fmt(g['commits'])} commits since {g['first_day']} ({fmt(g['age_days'])} days); in the window
  {gw['commits']} commits on {gw['days_active']} of {W['days']} days by {gw['authors']} author(s), +{fmt(gw['insertions'])} / -{fmt(gw['deletions'])} lines.
  {('Largest change: `' + L['sha'][:7] + '` "' + L['subject'][:80] + '", ' + fmt(L['ins'] + L['del']) + ' lines in ' + str(L['files']) + ' files.') if L else 'No change in the window.'}
- **What the week was about** (most-touched files): {'; '.join('`%s` (%d commits)' % (p, n) for p, n in tf) if tf else 'nothing'}.
- **What it tests**: {ts['files']} test files; {ts['functions_total']} test functions found by reading them
  ({', '.join('%s %d' % kv for kv in ts['functions_static'].items()) or 'none'}); {len(ts['files_without_recognised_function'])} test files hold no
  `def test` / `test(` / `it(` / `func Test` / `#[test]` the static reader recognises (helpers, harness calls, shell
  proofs), so the function count is a floor. Runners: {runners}. Nothing was run.
- **What it depends on**: {depline}. **What depends on it**: {F['dependents']}.
- **Docs**: README {'present (' + str(rd['lines']) + ' lines, ' + str(len(rd['headings'])) + ' headings)' if rd else 'absent'}; {F['docs']['files_own']} doc files; top level: {', '.join(F['docs']['top_level'][:8]) or 'none'}.

## The numbers
Every number has an entry in `claims.json`: a `recompute` command (read-only git and text tools, pinned to
`{F['head_short']}` and the window's two timestamps) or a `formula` over `params`. Check them all with
`python3 factory/tools/repo_topic.py --check factory/topics/{tid}/claims.json`.

| claim id | what | value | source or formula |
|----------|------|------:|-------------------|
{rows}

## The count (proposals; pick at most three structures)
1. **The commit timeline as marks.** One mark per commit, stacked in {W['days']} day columns, {W['first_day']} to
   {W['last_day']}: n = {gw['commits']} marks; tallest column {gw['busiest_day'][1] if gw['busiest_day'] else 0}
   ({gw['busiest_day'][0] if gw['busiest_day'] else '-'}). The count lands at {gw['commits']} before "{gw['days_active']} of {W['days']} days" appears.
2. **The file tree as a structure.** One cell per own file ({fmt(t['files_own'])}), grouped under its {P['top_dirs']}
   top-level folders (largest: {', '.join('%s %d' % kv for kv in t['top_dirs'][:4])}); test files and the
   most-touched files picked out in the accent.
3. **The lines as a wall.** {fmt(t['lines_own'])} own lines at {fmt(sc)} lines per mark = {fmt(round(t['lines_own'] / sc))} marks;
   the window's +{fmt(gw['insertions'])} inserted lines as the marks laid this week ({fmt(round(gw['insertions'] / sc))} at the same scale).

## The commit
Question: "How many commits landed in this repo in the last {W['days']} days?" Unit: commits · range 0 to
{1000 if gw['commits'] <= 500 else 10000} · film-mode default {W['days']} (one a day, the guess people make for a
side project; the viewer's number, not a fact, claim `commit-default`). Nothing from the timeline shows before the seal.

## Monday
The one question to ask at work: "Show me the last {W['days']} days as a count: commits, the files they touched,
and the tests beside them."
Honest limit: commits count activity, not value; test functions were counted by reading, not by running them; who
depends on this repo is not in the repo.

## Takeaway (brand card)
Read the ledger before you judge the code.

## Sources
- [S1] git history of {F['repo']} at `{F['head']}` (`git log`, `git rev-list`), window {W['since']} to {W['until']}.
- [S2] the tree at `{F['head_short']}` (`git ls-tree`, `git grep -c`), vendored and generated paths excluded by `{EXCL_RE}`.
- [S3] {(rd['path'] + ' at `' + F['head_short'] + '`') if rd else 'no README'}; manifests: {', '.join(m['path'] for m in F['manifests']) or 'none'}.
{'- Caveat: this clone is shallow; history counts stop at the graft.' if F['shallow'] else ''}
## Not this
- Not a code review or a quality score: counts of activity and size, not judgements of design.
- Not a test result: no runner was started; "tests" are files and functions read from the tree.
- Not a popularity claim: stars, downloads and dependents live outside the clone.
- Not uncommitted work: only what is committed at `{F['head_short']}` is counted.
"""


def beats_md(F, P, C, tid):
    g, gw, t, ts, rd, W = F["git"], F["git"]["window"], F["tree"], F["tests"], F["readme"], F["window"]
    sc = P["wall_scale"]
    q = rd["quote"] if rd else "no README"
    tf = gw["top_files"]
    marks = round(t["lines_own"] / sc)
    caps = [
        (0.5, 4.8, "HOOK", "%s, in its own README:" % F["name"]),
        (5.0, 9.6, "HOOK", "\u201c%s\u201d" % q),
        (10.4, 15.0, "COMMIT", "Is it alive? Your guess first."),
        (15.2, 19.6, "COMMIT", "How many commits in the last %d days?" % W["days"]),
        (20.4, 26.0, "CASE", "What it claims, shown by what it did this week:"),
        (26.2, 32.0, "CASE", ("Most touched: %s, %d commits." % (short(tf[0][0]), tf[0][1])) if tf else "No file was touched this week."),
        (32.2, 38.0, "CASE", "%s test files, %s tests read, none run." % (fmt(ts["files"]), fmt(ts["functions_total"]))),
        (38.2, 43.8, "CASE", ("Largest change: %s lines in one commit." % fmt(gw["largest_commit"]["ins"] + gw["largest_commit"]["del"]))
                             if gw["largest_commit"] else "No change landed in the window."),
        (44.4, 50.0, "COUNT", "One mark per commit, one column per day."),
        (50.2, 56.0, "COUNT", "%s commits. You guessed {g}." % fmt(gw["commits"])),
        (56.2, 62.0, "COUNT", "%s own files in the tree." % fmt(t["files_own"])),
        (62.2, 70.0, "COUNT", "%s lines; one mark is %s lines." % (fmt(t["lines_own"]), fmt(sc))),
        (70.2, 77.6, "COUNT", "%d of %d days had a commit." % (gw["days_active"], W["days"])),
        (78.4, 83.0, "MONDAY", "Monday: ask for the last %d days as a count." % W["days"]),
        (83.2, 86.8, "MONDAY", "Limits: activity, not value. Tests read, not run."),
    ]
    if len(caps[1][3]) > 96:
        w = caps[1][3].split(); half = len(caps[1][3]) / 2; acc, k = 0, 0
        while k < len(w) - 1 and acc + len(w[k]) + 1 <= half:
            acc += len(w[k]) + 1; k += 1
        caps[1:2] = [(5.0, 7.3, "HOOK", " ".join(w[:k])), (7.4, 9.6, "HOOK", " ".join(w[k:]))]
    caprows = "\n".join("| %d | %.1f | %.1f | %s | %s | %d |" % (i + 1, a, b, beat, txt, len(txt)) for i, (a, b, beat, txt) in enumerate(caps))
    k = 72.0 / 87.0
    per_day = " ".join("%s:%d" % (d[5:], v) for d, v in gw["per_day"].items())
    return f"""# {F['name']} · beats (repo reader, 90-second cut)

id: `{tid}` · dur 90 s = material 0 to 87 s + CETI brand card 87 to 90 s · commit.at 11 s · count.at 46 s
Pinned `{F['head_short']}` · window {W['first_day']} to {W['last_day']} UTC. Every digit below is a claim in claims.json.

**Gate note.** factory/FORMAT.md binds factory films to 60 to 75 s of material (gate G4a fails 87 s). To ship
through the factory gate, use the 75 s mapping column (each time × 72/87, brand card 72 to 75 s) and drop caption 8
and caption 12 first; the 90 s cut is for the repo-reader channel.

## Structures (at most 4; the brand card is not one)
1. S-A the sheet: the README quote (HOOK) and the commit box (COMMIT)
2. S-B the timeline: {W['days']} day columns, one mark per commit ({gw['commits']} marks), CASE and COUNT
3. S-C the tree: one cell per own file ({fmt(t['files_own'])}) under {P['top_dirs']} top-level folders; test files and the
   most-touched files in the accent
4. S-D the wall: {fmt(t['lines_own'])} lines at {fmt(sc)} per mark = {fmt(marks)} marks

## Beat table

| # | beat | window (90 s) | 75 s mapping | on screen (structure) | focal motion | claims used |
|---|------|---------------|--------------|-----------------------|--------------|-------------|
| 1 | HOOK | 0 to 10 s | 0 to {10*k:.1f} s | S-A: the repo name, then the README quote set in the display face | the quote types on, word by word | readme-quote |
| 2 | COMMIT | 10 to 20 s | {10*k:.1f} to {20*k:.1f} s | S-A: the commit box; the timeline's empty columns ghosted, no marks | the box seals at commit.at + 4.5 s | window-days, commit-default |
| 3 | CASE | 20 to 44 s | {20*k:.1f} to {44*k:.1f} s | S-C: the tree; the most-touched files and the test files light up; the largest commit's lines as a bar at true scale | each file lights as its caption lands | top-files, top-file-commits, test-files, test-fns, largest-window |
| 4 | COUNT | 44 to 78 s | {44*k:.1f} to {78*k:.1f} s | S-B: marks drop into day columns ({per_day}); the guess as a graphite line at height g; then S-D: the wall builds | marks counted in commit order; the wall row by row | commits-window, timeline, busiest-day, files-own, lines-own, wall-scale, wall-marks, days-active |
| 5 | MONDAY | 78 to 87 s | {78*k:.1f} to 72 s | the Monday question over the faded wall; the honest line as the caption | none (hold) | window-days |

## Captions (28 units, at most two lines of ~50 characters; no digit without a claim)

| # | t0 | t1 | beat | text | chars |
|---|---:|---:|------|------|------:|
{caprows}

`{{g}}` is the viewer's sealed number (film mode: commit-default = {W['days']}); no answer reads "No guess. {fmt(gw['commits'])} commits."
Caption 13 is the only ratio and comes after the timeline has landed (counts first, Q14).

## Brand card (87 to 90 s)
"CETI" wordmark line, then the takeaway: "Read the ledger before you judge the code."

## Checks before building
- [ ] Re-run `python3 factory/tools/repo_topic.py --check factory/topics/{tid}/claims.json` (PASS) before copying params.
- [ ] Every digit in a caption or on the stage has a claim (value or `renders`); file names in captions are basenames.
- [ ] No ratio, percentage or "N of M" before count.at (46 s), and none before the timeline has landed.
- [ ] Nothing from the timeline or the answer before the seal (commit.at 11 s + 4.5 s).
- [ ] At most four structures; at most two full-screen cards.
"""


def main():
    ap = argparse.ArgumentParser(description="Turn a local git repo into a factory topic whose every number is a claim.")
    ap.add_argument("repo", nargs="?", help="path to a local git repository")
    ap.add_argument("--id", help="topic id, kebab-case")
    ap.add_argument("--days", type=int, default=7, help="window length in UTC calendar days (default 7)")
    ap.add_argument("--rev", default="HEAD", help="commit to pin (default HEAD)")
    ap.add_argument("--until", default="now", help="window end: now (default), head (the pinned commit's time) or ISO 8601")
    ap.add_argument("--force", action="store_true", help="overwrite an existing topic folder's files")
    ap.add_argument("--no-verify", action="store_true", help="skip re-running the recompute commands after writing")
    ap.add_argument("--root", help="plugin root (default: found from this file)")
    ap.add_argument("--check", metavar="CLAIMS", help="re-run every recompute command and formula in a claims.json")
    ap.add_argument("--only", help="with --check: one claim id")
    a = ap.parse_args()
    root = os.path.abspath(a.root) if a.root else ((ceti_root and ceti_root(HERE)) or os.path.abspath(os.path.join(HERE, "..", "..")))
    if a.check:
        doc = json.load(open(a.check))
        sys.exit(0 if check(doc, a.only, cwd=root) else 1)
    if not a.repo or not a.id:
        ap.error("give a repo path and --id (or --check CLAIMS)")
    if not ID_RE.match(a.id):
        sys.exit("id must be kebab-case: lowercase letters, digits and hyphens, 2 to 48 characters")
    if a.days < 1 or a.days > 366:
        sys.exit("--days must be 1 to 366")
    repo = os.path.abspath(a.repo)
    F = extract(repo, a.rev, a.days, a.until)
    P, C = build_claims(F, a.id)
    doc = {"topic": a.id, "repo": F["repo"], "head": F["head"], "window": {k: F["window"][k] for k in ("days", "since", "until")},
           "note": "source git|tree|readme|manifest: run `recompute` (read-only), compare to `expect`; derived|input: "
                   "evaluate `formula` over `params` (Math.round/floor in scope). All pinned to `head` and the window.",
           "params": P, "claims": C}
    out = os.path.join(root, "factory", "topics", a.id)
    os.makedirs(out, exist_ok=True)
    texts = {"facts.json": json.dumps(F, indent=1, ensure_ascii=False) + "\n",
             "claims.json": json.dumps(doc, indent=1, ensure_ascii=False) + "\n",
             "brief.md": brief_md(F, P, C, a.id), "beats.md": beats_md(F, P, C, a.id)}
    for fn, txt in texts.items():
        p = os.path.join(out, fn)
        if os.path.exists(p) and not a.force:
            print("keep   %s (exists; --force to overwrite)" % p)
            continue
        with open(p, "w") as f:
            f.write(txt)
        print("write  %s" % p)
    gw = F["git"]["window"]
    print("read   %s @ %s · window %s..%s · %d commits in window, %d all time · %d files, %d own lines · %d test files"
          % (F["name"], F["head_short"], F["window"]["first_day"], F["window"]["last_day"], gw["commits"],
             F["git"]["commits"], F["tree"]["files"], F["tree"]["lines_own"], F["tests"]["files"]))
    if not a.no_verify:
        sys.exit(0 if check(doc, cwd=root) else 1)


if __name__ == "__main__":
    main()
