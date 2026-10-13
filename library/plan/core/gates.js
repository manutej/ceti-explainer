/* ════════════════════════════════════════════════════════════════════
   core/gates.js — page gates (BUILD-SPEC §3.7): the live page asks before it reveals
   --------------------------------------------------------------------
   FEATURE.gates = [{ t, key, timeout, min, max, step, unit, question, fallback }]
   On the PAGE (not ?film=1): when playback crosses a gate's t and state[key] is unset,
   the clock pauses and a commit card opens over the stage (a slider + "Commit").
   Commit → setState({key: v}) and play. Timeout (default 8 s) or "skip" → play on;
   the film then shows its cited default. render() never waits: the clock is paused
   from outside, so every frame is still a pure function of (t, state).
   In film mode the gates are ignored (the card shows the default with a countdown).
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  function install(F) {
    if (!root.document || !F.gates || !F.gates.length) return;
    const q = new URLSearchParams(location.search);
    if (q.get('film') === '1' || q.get('gates') === '0') return;
    const go = () => {
      const c = root.__ctrl, stage = document.getElementById('stage');
      if (!c || !stage) return setTimeout(go, 60);
      const css = document.createElement('style');
      css.textContent = '.gate{position:absolute;right:3%;top:16%;width:min(360px,46%);background:var(--ex-panel);color:var(--ex-ink);border:1px dashed var(--ex-accent);'
        + 'border-radius:10px;padding:14px 16px;font-family:var(--font-mono);font-size:13px;z-index:20;box-shadow:0 12px 30px -18px rgba(0,0,0,.5)}'
        + '.gate b{display:block;font-family:var(--font-display);font-weight:400;font-size:18px;margin:2px 0 10px}'
        + '.gate .k{letter-spacing:.14em;text-transform:uppercase;color:var(--ex-accent);font-size:11px}'
        + '.gate input{width:100%;accent-color:var(--ex-accent)} .gate .row{display:flex;gap:8px;align-items:center;margin-top:10px}'
        + '.gate output{font-size:20px;font-weight:700;min-width:70px} .gate button{font:inherit;border:1px solid var(--ex-accent);background:var(--ex-accent);color:var(--ex-ground);border-radius:999px;padding:6px 14px;cursor:pointer}'
        + '.gate button.skip{background:none;color:var(--ex-dim);border-color:var(--ex-line)} .gate .tm{margin-left:auto;color:var(--ex-dim)}';
      document.head.appendChild(css);
      if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
      let open = null, last = c.time;
      function close(v) {
        if (!open) return;
        const g = open; open.el.remove(); clearInterval(open.iv); open = null;
        if (v != null) c.setState({ [g.key]: v });
        c.play();
      }
      function show(g) {
        c.pause(); c.seek(g.t);
        const el = document.createElement('div'); el.className = 'gate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Commit a prediction');
        const v0 = g.start != null ? g.start : Math.round((g.min + g.max) / 2);
        el.innerHTML = '<span class="k">Commit before the reveal</span><b></b><input type="range"><div class="row"><output></output>'
          + '<button type="button" class="ok">Commit</button><button type="button" class="skip">skip</button><span class="tm"></span></div>';
        el.querySelector('b').textContent = g.question || 'Your guess?';
        const inp = el.querySelector('input'), out = el.querySelector('output'), tm = el.querySelector('.tm');
        inp.min = g.min; inp.max = g.max; inp.step = g.step || 1; inp.value = v0;
        const fmt = (v) => (+v).toLocaleString('en-US') + (g.unit || '');
        out.textContent = fmt(v0);
        inp.addEventListener('input', () => { out.textContent = fmt(inp.value); left = g.timeout; });
        el.querySelector('.ok').addEventListener('click', () => close(+inp.value));
        el.querySelector('.skip').addEventListener('click', () => close(null));
        stage.appendChild(el); inp.focus();
        let left = g.timeout || 8;
        const iv = setInterval(() => { left -= 1; tm.textContent = left > 0 ? left + ' s' : ''; if (left <= 0) close(null); }, 1000);
        tm.textContent = left + ' s';
        open = { el, iv, key: g.key };
      }
      (function watch() {
        const t = c.time;
        if (!open && c.playing) F.gates.forEach(g => {
          const v = c.state[g.key];
          if (last < g.t && t >= g.t && (v === '' || v == null)) show(g);
        });
        last = t;
        requestAnimationFrame(watch);
      })();
    };
    go();
  }
  root.Gates = { install };
})(typeof window !== 'undefined' ? window : globalThis);
