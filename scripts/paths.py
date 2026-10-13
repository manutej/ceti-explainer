"""paths.py: find the plugin root (the directory that holds .claude-plugin/plugin.json).

    from paths import ceti_root, root_path
    ROOT = ceti_root(__file__)          # None when not inside the plugin (callers keep their old fallback)

Order: $CETI_ROOT, then $CLAUDE_PLUGIN_ROOT, then walk up from `start` (a file or directory) to the first
directory containing .claude-plugin/plugin.json. Environment roots are used only if they hold that file too.
"""
import os

MARKER = os.path.join(".claude-plugin", "plugin.json")


def _is_root(d):
    return bool(d) and os.path.isfile(os.path.join(d, MARKER))


def ceti_root(start=None):
    for env in ("CETI_ROOT", "CLAUDE_PLUGIN_ROOT"):
        d = os.environ.get(env)
        if d and _is_root(os.path.abspath(d)):
            return os.path.abspath(d)
    d = os.path.abspath(start or os.getcwd())
    if os.path.isfile(d):
        d = os.path.dirname(d)
    while True:
        if _is_root(d):
            return d
        up = os.path.dirname(d)
        if up == d:
            return None
        d = up


def root_path(*parts, start=None):
    """Join `parts` onto the plugin root; raises if the root cannot be found."""
    r = ceti_root(start)
    if r is None:
        raise FileNotFoundError("plugin root not found (no .claude-plugin/plugin.json above %s; set CETI_ROOT)" % (start or os.getcwd()))
    return os.path.join(r, *parts)


if __name__ == "__main__":
    import sys
    r = ceti_root(sys.argv[1] if len(sys.argv) > 1 else None)
    print(r or "")
    sys.exit(0 if r else 1)
