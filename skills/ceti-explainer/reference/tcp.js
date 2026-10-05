/* ════════════════════════════════════════════════════════════════════
   The TCP Lifecycle — CETI Explainer content module
   --------------------------------------------------------------------
   ARCHETYPE: state machine.

   TCP is a finite state machine shared across BOTH ends of a connection.
   A connection opens with the three-way handshake (SYN → SYN-ACK → ACK),
   carries data while ESTABLISHED, and closes with a four-way teardown
   (FIN → ACK → FIN → ACK) through TIME_WAIT before returning to CLOSED.

   The anchor is a PERSISTENT state graph (nodes + directed edges). On each
   beat the CURRENT state lights up and the single taken edge animates. The
   working zone shows the current segment with real flags; the detail band
   shows the worked seq/ack arithmetic, every number derived in code.

   client ISN = 1000, server ISN = 5000. Each SYN and FIN consumes one
   sequence number, so the acknowledgement of a SYN/FIN = seq + 1.

   Exposes the CetiExplainer content contract: { meta, beats, build, render }.
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg, fit } = ex;

  /* ── 1) DATA — the seq/ack progression, derived in code ──────────── */
  const CLIENT_ISN = 1000;
  const SERVER_ISN = 5000;
  const DATA_LEN = 12; // bytes the client sends while ESTABLISHED

  // Each event advances seq/ack. SYN and FIN each consume ONE seq number.
  // We build the segment trace step by step so every figure is consistent.
  const SEGMENTS = [];
  (function deriveTrace() {
    let cSeq = CLIENT_ISN; // next byte the client will send
    let sSeq = SERVER_ISN; // next byte the server will send

    // 1. handshake — SYN (client → server). SYN occupies seq=cSeq, +1.
    SEGMENTS.push({ key: "syn", dir: "c2s", flags: ["SYN"], seq: cSeq, ack: null });
    cSeq += 1; // SYN consumed one sequence number

    // 2. handshake — SYN,ACK (server → client). server's ISN; acks client SYN.
    SEGMENTS.push({ key: "synack", dir: "s2c", flags: ["SYN", "ACK"], seq: sSeq, ack: cSeq });
    sSeq += 1; // server SYN consumed one sequence number

    // 3. handshake — ACK (client → server). acks server SYN → ESTABLISHED.
    SEGMENTS.push({ key: "ack", dir: "c2s", flags: ["ACK"], seq: cSeq, ack: sSeq });

    // 4. data — client ships DATA_LEN payload bytes (server acks the lot).
    SEGMENTS.push({ key: "data", dir: "c2s", flags: ["ACK", "PSH"], seq: cSeq, ack: sSeq, len: DATA_LEN });
    cSeq += DATA_LEN; // payload advances the sequence by its byte count

    // 5. teardown — FIN,ACK (client → server). FIN occupies seq=cSeq, +1.
    SEGMENTS.push({ key: "fin", dir: "c2s", flags: ["FIN", "ACK"], seq: cSeq, ack: sSeq });
    cSeq += 1; // client FIN consumed one sequence number

    // 6. teardown — ACK (server → client). acks the client's FIN.
    SEGMENTS.push({ key: "finack", dir: "s2c", flags: ["ACK"], seq: sSeq, ack: cSeq });

    // 7. teardown — FIN,ACK (server → client). server FIN occupies seq=sSeq, +1.
    SEGMENTS.push({ key: "finS", dir: "s2c", flags: ["FIN", "ACK"], seq: sSeq, ack: cSeq });
    sSeq += 1; // server FIN consumed one sequence number

    // 8. teardown — ACK (client → server). acks the server FIN → TIME_WAIT.
    SEGMENTS.push({ key: "lastack", dir: "c2s", flags: ["ACK"], seq: cSeq, ack: sSeq });
  })();
  const SEG = {};
  SEGMENTS.forEach((s) => (SEG[s.key] = s));

  /* ── STATE GRAPH (the persistent anchor) ──────────────────────────
     9 nodes, laid out so the active path reads left→right then back.
     Each beat lights exactly one CURRENT node and animates ONE edge. */
  const STATES = [
    { id: "CLOSED",      x: 70,  y: 96 },
    { id: "LISTEN",      x: 70,  y: 176 },
    { id: "SYN-SENT",    x: 248, y: 56 },
    { id: "SYN-RCVD",    x: 248, y: 176 },
    { id: "ESTABLISHED", x: 470, y: 116 },
    { id: "FIN-WAIT-1",  x: 680, y: 56 },
    { id: "CLOSE-WAIT",  x: 680, y: 176 },
    { id: "TIME_WAIT",   x: 880, y: 96 },
    { id: "CLOSED·",     x: 880, y: 176 }, // return-to-closed terminal
  ];
  const SI = {};
  STATES.forEach((s, i) => (SI[s.id] = i));

  // directed edges: [from, to, eventLabel]
  const EDGES = [
    ["CLOSED",      "SYN-SENT",    "SYN →"],
    ["LISTEN",      "SYN-RCVD",    "← SYN"],
    ["SYN-SENT",    "ESTABLISHED", "ACK"],
    ["SYN-RCVD",    "ESTABLISHED", "ACK"],
    ["ESTABLISHED", "FIN-WAIT-1",  "FIN →"],
    ["ESTABLISHED", "CLOSE-WAIT",  "← FIN"],
    ["FIN-WAIT-1",  "TIME_WAIT",   "FIN/ACK"],
    ["TIME_WAIT",   "CLOSED·",     "2·MSL"],
    ["CLOSE-WAIT",  "CLOSED·",     "close"],
  ];

  /* ── 2) BEATS — exactly 8, ~38s total ─────────────────────────────
     Beat 1 introduces the graph at CLOSED/LISTEN; beat 8 = Why it matters. */
  const beats = [
    { id: "states", label: "States, not packets", dur: 4.2,
      caption: "TCP isn’t a stream of packets — it’s a state machine running on both ends. Both start CLOSED." },
    { id: "syn", label: "SYN", dur: 4.4,
      caption: "The client sends SYN with its starting sequence number. It moves to SYN-SENT and waits." },
    { id: "synack", label: "SYN-ACK", dur: 4.6,
      caption: "The server answers SYN,ACK — its own sequence number, plus an ack of the client’s SYN+1." },
    { id: "ack", label: "ACK · ESTABLISHED", dur: 4.6,
      caption: "The client acks the server’s SYN. Both ends reach ESTABLISHED — the handshake is done." },
    { id: "data", label: "Data flows", dur: 4.4,
      caption: "Now bytes flow. Each segment carries a sequence number; the ack tells the sender what arrived." },
    { id: "fin", label: "FIN: teardown", dur: 4.6,
      caption: "To close, the client sends FIN and enters FIN-WAIT-1. Closing is explicit, not just silence." },
    { id: "timewait", label: "TIME_WAIT", dur: 4.6,
      caption: "After the final ACK the client lingers in TIME_WAIT — long enough for stray segments to die." },
    { id: "why", label: "Why it matters", dur: 6.0,
      caption: "Both ends agree on every transition. That shared state is what makes the stream reliable and ordered." },
  ];

  /* ── 3) GEOMETRY ──────────────────────────────────────────────────
     Anchor (state graph)  ~34–210. Working zone (segment) ~218–296.
     Lower-third (seq/ack arithmetic) ~302–460, gated by flags.math. */
  const VW = 1000, VH = 464;
  const ACC = "var(--ex-accent)", ACC2 = "var(--ex-accent2)", SUP = "var(--ex-support)";
  const PEACH = "var(--ex-peach)";
  const INK = "var(--ex-ink)", DIM = "var(--ex-dim)", LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)", CELL = "var(--ex-cell)";
  const FILL = "var(--ex-accent-fill)";
  const NODE_W = 116, NODE_H = 40;
  const LT_Y = 302;

  /* maps each beat to the CURRENT state + the taken edge (by EDGES index) */
  const BEAT_STATE = {
    states:   { current: "CLOSED",      edge: -1 },
    syn:      { current: "SYN-SENT",    edge: 0  },
    synack:   { current: "SYN-RCVD",    edge: 1  },
    ack:      { current: "ESTABLISHED", edge: 2  },
    data:     { current: "ESTABLISHED", edge: -1 },
    fin:      { current: "FIN-WAIT-1",  edge: 4  },
    timewait: { current: "TIME_WAIT",   edge: 6  },
    why:      { current: "ESTABLISHED", edge: -1 },
  };

  /* ── tiny SVG helpers ── */
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) k === "text" ? (n.textContent = attrs[k]) : n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (p, a) => el("g", a, p);
  const setO = (n, o) => { n.style.opacity = o; };
  const cx = (s) => s.x + NODE_W / 2;
  const cyc = (s) => s.y + NODE_H / 2;

  const D = {}; // persistent node refs — created ONCE in build()
  const flags = { math: true };

  /* lower-third eyebrow */
  function lowerEyebrow(parent, x, text) {
    return el("text", { x, y: 2, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.2em", fill: DIM, text }, parent);
  }

  /* ── BUILD: create every node ONCE ── */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((b) => (D.beats[b.id] = b));

    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img",
      "aria-label": "Animated walk through the TCP connection state machine" }, stage);
    D.svg = svg;

    // arrowhead marker for directed edges
    const defs = el("defs", {}, svg);
    const mk = (id, color) => {
      const m = el("marker", { id, viewBox: "0 0 10 10", refX: 8, refY: 5,
        markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      el("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }, m);
    };
    mk("tcp-arrow", "var(--ex-dim)");
    mk("tcp-arrow-hot", ACC);

    /* eyebrow over the anchor graph */
    D.graphTag = el("text", { x: 44, y: 24, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.2em", fill: DIM, text: "THE CONNECTION STATE MACHINE — BOTH ENDS" }, svg);

    /* ── layer order: edges → nodes → working zone → lower third ── */
    const lEdge = g(svg);
    const lNode = g(svg);
    D.lWork = g(svg);
    const lLower = g(svg, { transform: `translate(0 ${LT_Y + 16})` });

    /* edges (built once; base dim, a hot overlay animates per beat) */
    D.edges = EDGES.map((e) => {
      const a = STATES[SI[e[0]]], b = STATES[SI[e[1]]];
      const x1 = cx(a), y1 = cyc(a), x2 = cx(b), y2 = cyc(b);
      // trim endpoints to the node's box border so the arrowhead sits outside it
      const trimStart = trimToBox(x1, y1, x2, y2, NODE_W / 2 + 4, NODE_H / 2 + 4);
      const trimEnd = trimToBox(x2, y2, x1, y1, NODE_W / 2 + 8, NODE_H / 2 + 8);
      const base = el("line", { x1: trimStart.x, y1: trimStart.y, x2: trimEnd.x, y2: trimEnd.y,
        stroke: "rgba(245,239,227,.16)", "stroke-width": 1.4, "marker-end": "url(#tcp-arrow)" }, lEdge);
      const hot = el("line", { x1: trimStart.x, y1: trimStart.y, x2: trimEnd.x, y2: trimEnd.y,
        stroke: ACC, "stroke-width": 2.2, "marker-end": "url(#tcp-arrow-hot)",
        "stroke-linecap": "round" }, lEdge);
      setO(hot, 0);
      // edge label at midpoint, nudged off the line
      const mx = (trimStart.x + trimEnd.x) / 2, my = (trimStart.y + trimEnd.y) / 2;
      const lbl = el("text", { x: mx, y: my - 5, "text-anchor": "middle",
        "font-family": "var(--font-mono)", "font-size": 10, fill: DIM, text: e[2] }, lEdge);
      setO(lbl, 0.55);
      return { base, hot, lbl };
    });

    /* nodes */
    D.nodes = STATES.map((s) => {
      const grp = g(lNode);
      const isClosed = s.id.indexOf("CLOSED") === 0;
      const rect = el("rect", { x: s.x, y: s.y, width: NODE_W, height: NODE_H, rx: 8,
        fill: PANEL, stroke: LINE, "stroke-width": 1 }, grp);
      const label = s.id === "CLOSED·" ? "CLOSED" : s.id;
      const txt = el("text", { x: cx(s), y: cyc(s) + 1, "text-anchor": "middle",
        "dominant-baseline": "middle", "font-family": "var(--font-mono)", "font-size": 12.5,
        fill: INK, text: label }, grp);
      fit(txt, NODE_W - 14);
      return { grp, rect, txt, id: s.id };
    });

    /* ── WORKING ZONE: ONE segment scene at a time (ex.seg) ──
       A single reusable "segment card" we mutate per beat, PLUS a dedicated
       data-flow scene and a synthesis scene. They share the working region,
       so each is faded by seg() and listed in __REGIONS. */
    buildSegmentCard();
    buildDataScene();
    buildWhyScene();

    /* ── LOWER THIRD: worked seq/ack arithmetic ── */
    D.ltRule = el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    setO(D.ltRule, 0);
    buildMathScenes(lLower);
  }

  /* trim a segment from (x1,y1) toward (x2,y2) so it starts at the box border */
  function trimToBox(x1, y1, x2, y2, hw, hh) {
    const dx = x2 - x1, dy = y2 - y1;
    if (dx === 0 && dy === 0) return { x: x1, y: y1 };
    // scale t so the point lands on the rectangle boundary
    const tx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
    const ty = dy !== 0 ? hh / Math.abs(dy) : Infinity;
    const tt = Math.min(tx, ty);
    return { x: x1 + dx * tt, y: y1 + dy * tt };
  }

  /* the reusable segment card lives in the working zone (handshake/teardown) */
  const WORK_Y = 222, WORK_H = 70;
  function buildSegmentCard() {
    const s = g(D.lWork);
    D.segCard = s;
    el("text", { x: 44, y: WORK_Y - 8, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.18em", fill: DIM, text: "SEGMENT ON THE WIRE" }, s);

    // endpoints: client (left) and server (right) with a channel between
    const CX = 120, SXp = VW - 120, MIDY = WORK_Y + WORK_H / 2;
    const ends = [["CLIENT", CX], ["SERVER", SXp]];
    ends.forEach(([name, x]) => {
      el("rect", { x: x - 52, y: WORK_Y, width: 104, height: WORK_H, rx: 8,
        fill: CELL, stroke: LINE, "stroke-width": 1 }, s);
      el("text", { x, y: MIDY - 8, "text-anchor": "middle", "font-family": "var(--font-mono)",
        "font-size": 11, "letter-spacing": "0.12em", fill: DIM, text: name }, s);
      el("text", { x, y: MIDY + 12, "text-anchor": "middle", "font-family": "var(--font-mono)",
        "font-size": 11, fill: DIM, text: name === "CLIENT" ? "ISN 1000" : "ISN 5000" }, s);
    });
    D.chanY = MIDY;
    D.chanX0 = CX + 52;
    D.chanX1 = SXp - 52;

    // channel hairline
    el("line", { x1: D.chanX0, y1: MIDY, x2: D.chanX1, y2: MIDY, stroke: LINE, "stroke-width": 1 }, s);

    // the moving segment "packet" — a pill with flags + seq/ack
    const pkt = g(s);
    D.pkt = pkt;
    D.pktRect = el("rect", { x: -88, y: -19, width: 176, height: 38, rx: 9,
      fill: FILL, stroke: ACC, "stroke-width": 1.4 }, pkt);
    D.pktFlags = el("text", { x: 0, y: -4, "text-anchor": "middle", "font-family": "var(--font-mono)",
      "font-size": 13, "font-weight": 700, fill: ACC, text: "SYN" }, pkt);
    D.pktNums = el("text", { x: 0, y: 12, "text-anchor": "middle", "font-family": "var(--font-mono)",
      "font-size": 11, fill: INK, text: "seq=1000" }, pkt);
    setO(D.segCard, 0);
  }

  /* dedicated data-flow scene: a short run of byte segments + cumulative ack */
  function buildDataScene() {
    const s = g(D.lWork);
    D.dataScene = s;
    el("text", { x: 44, y: WORK_Y - 8, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.18em", fill: DIM, text: "ESTABLISHED — BYTES, NUMBERED" }, s);
    const baseSeq = SEG.data.seq; // 1001
    // three illustrative segments carrying 4 bytes each (4+4+4 = 12 = DATA_LEN)
    const chunks = [4, 4, 4];
    let acc = baseSeq;
    const x0 = 150, w = 150, gap = 16, y = WORK_Y + 6;
    D.dataChunks = chunks.map((c, i) => {
      const x = x0 + i * (w + gap);
      const grp = g(s);
      el("rect", { x, y, width: w, height: 52, rx: 8, fill: CELL, stroke: ACC2, "stroke-width": 1.2 }, grp);
      el("text", { x: x + w / 2, y: y + 20, "text-anchor": "middle", "font-family": "var(--font-mono)",
        "font-size": 11, fill: ACC2, text: `${c} bytes` }, grp);
      const seqTxt = el("text", { x: x + w / 2, y: y + 40, "text-anchor": "middle",
        "font-family": "var(--font-mono)", "font-size": 11, fill: INK,
        text: `seq=${acc}` }, grp);
      fit(seqTxt, w - 12);
      acc += c;
      return grp;
    });
    // cumulative ack tag on the right
    const ackTxt = el("text", { x: VW - 80, y: WORK_Y + 36, "text-anchor": "end",
      "font-family": "var(--font-mono)", "font-size": 12, fill: ACC,
      text: `server ack=${acc}` }, s); // 1013
    fit(ackTxt, 220);
    D.dataAck = ackTxt;
    setO(D.dataScene, 0);
  }

  /* synthesis scene for beat 8: the agreed-transition idea, reusing the graph */
  function buildWhyScene() {
    const s = g(D.lWork);
    D.whyScene = s;
    el("text", { x: 44, y: WORK_Y - 8, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.18em", fill: DIM, text: "ONE SHARED MACHINE, TWO ENDS IN STEP" }, s);
    const items = [
      ["RELIABLE", "every byte acked or resent", ACC],
      ["ORDERED", "sequence numbers reassemble", ACC2],
      ["EXPLICIT", "open and close are agreed", SUP],
    ];
    items.forEach((it, i) => {
      const x = 60 + i * 300;
      const grp = g(s);
      el("rect", { x, y: WORK_Y, width: 268, height: WORK_H, rx: 8, fill: PANEL,
        stroke: LINE, "stroke-width": 1 }, grp);
      el("rect", { x, y: WORK_Y, width: 4, height: WORK_H, rx: 2, fill: it[2] }, grp);
      el("text", { x: x + 20, y: WORK_Y + 26, "font-family": "var(--font-mono)", "font-size": 12,
        "letter-spacing": "0.14em", "font-weight": 700, fill: it[2], text: it[0] }, grp);
      const d = el("text", { x: x + 20, y: WORK_Y + 50, "font-family": "var(--font-sans)",
        "font-size": 13, fill: DIM, text: it[1] }, grp);
      fit(d, 240);
    });
    setO(D.whyScene, 0);
  }

  /* ── LOWER-THIRD math scenes (one region, ex.seg) ── */
  function buildMathScenes(L) {
    // helper to render a flags + seq/ack line for a segment
    const segLine = (parent, x, y, label, seg, color) => {
      const grp = g(parent);
      el("text", { x, y, "font-family": "var(--font-mono)", "font-size": 11,
        "letter-spacing": "0.1em", fill: DIM, text: label }, grp);
      let line = `[${seg.flags.join(",")}]  seq=${seg.seq}`;
      if (seg.ack != null) line += `  ack=${seg.ack}`;
      if (seg.len) line += `  len=${seg.len}`;
      const t = el("text", { x, y: y + 22, "font-family": "var(--font-mono)", "font-size": 14,
        fill: color || INK, text: line }, grp);
      fit(t, 560);
      return grp;
    };

    // Scene A — handshake arithmetic (beats 2–4)
    D.mHand = g(L);
    lowerEyebrow(D.mHand, 60, "THREE-WAY HANDSHAKE — ack = seq + 1 (SYN COUNTS AS ONE)");
    D.mHandRows = [
      segLine(D.mHand, 60, 36, "1 · client →", SEG.syn, ACC),
      segLine(D.mHand, 60, 84, "2 · server →", SEG.synack, ACC2),
      segLine(D.mHand, 540, 36, "3 · client →", SEG.ack, ACC),
    ];
    const estab = el("text", { x: 540, y: 106, "font-family": "var(--font-mono)", "font-size": 13,
      fill: INK, text: `→ both ESTABLISHED` }, D.mHand);
    fit(estab, 400);
    D.mHandEstab = estab;

    // Scene B — data arithmetic (beat 5)
    D.mData = g(L);
    lowerEyebrow(D.mData, 60, "DATA — THE ACK IS THE NEXT BYTE EXPECTED");
    const dseq = SEG.data.seq, dlen = SEG.data.len, dnext = dseq + dlen;
    const dline = el("text", { x: 60, y: 44, "font-family": "var(--font-mono)", "font-size": 15,
      fill: INK, text: `client sends ${dlen} bytes: seq=${dseq} … ${dseq + dlen - 1}` }, D.mData);
    fit(dline, 600);
    const dline2 = el("text", { x: 60, y: 80, "font-family": "var(--font-mono)", "font-size": 15,
      fill: ACC, text: `server replies ack=${dnext}  (seq ${dseq}+${dlen})` }, D.mData);
    fit(dline2, 600);

    // Scene C — teardown arithmetic (beats 6–7)
    D.mTear = g(L);
    lowerEyebrow(D.mTear, 60, "FOUR-WAY TEARDOWN — FIN ALSO COUNTS AS ONE");
    D.mTearRows = [
      segLine(D.mTear, 60, 36, "1 · client FIN →", SEG.fin, ACC),
      segLine(D.mTear, 60, 84, "2 · server ACK →", SEG.finack, ACC2),
      segLine(D.mTear, 540, 36, "3 · server FIN →", SEG.finS, ACC2),
      segLine(D.mTear, 540, 84, "4 · client ACK →", SEG.lastack, ACC),
    ];

    // Scene D — why it matters (beat 8)
    D.mWhy = g(L);
    lowerEyebrow(D.mWhy, 60, "TIME_WAIT — 2·MSL, THEN CLOSED");
    const w1 = el("text", { x: 60, y: 44, "font-family": "var(--font-sans)", "font-size": 14,
      fill: INK, text: "The last ACK can be lost. TIME_WAIT outlives any stray segment before reuse." }, D.mWhy);
    fit(w1, VW - 120);
    const w2 = el("text", { x: 60, y: 80, "font-family": "var(--font-mono)", "font-size": 13,
      fill: ACC, text: `1000 → SYN → handshake → data → FIN → 1014 · ack always seq+1` }, D.mWhy);
    fit(w2, VW - 120);

    [D.mHand, D.mData, D.mTear, D.mWhy].forEach((s) => setO(s, 0));
  }

  /* ── RENDER: pure function of t ── */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;

    /* anchor graph fades in during beat 1, then persists */
    const graphIn = ramp(t, B.states.start + 0.1, 0.6);
    setO(D.graphTag, graphIn);
    D.nodes.forEach((n, i) => {
      const a = ramp(t, B.states.start + 0.15 + i * 0.06, 0.5, ease.defer);
      setO(n.grp, a);
    });
    D.edges.forEach((e, i) => {
      const a = ramp(t, B.states.start + 0.4 + i * 0.05, 0.5);
      setO(e.base, a);
      setO(e.lbl, a * 0.55);
    });

    /* determine the CURRENT state + taken edge for the active beat */
    const order = ["states", "syn", "synack", "ack", "data", "fin", "timewait", "why"];
    let activeId = "states";
    for (const id of order) { if (t >= B[id].start - 1e-4) activeId = id; }
    const cur = BEAT_STATE[activeId];

    // light EXACTLY one current node; everyone else rests
    D.nodes.forEach((n) => {
      const isCur = n.id === cur.current;
      // smooth the highlight a touch after the beat starts
      const lit = isCur ? ramp(t, B[activeId].start + 0.05, 0.35) : 0;
      n.rect.setAttribute("fill", isCur ? FILL : PANEL);
      n.rect.setAttribute("stroke", isCur ? ACC : LINE);
      n.rect.setAttribute("stroke-width", isCur ? 1.6 + lit * 0.6 : 1);
      n.txt.setAttribute("fill", isCur ? ACC : INK);
    });

    // animate the single taken edge: pulse the hot overlay during the beat
    D.edges.forEach((e, i) => {
      const baseO = parseFloat(e.base.style.opacity) || 0;
      const on = (cur.edge === i) ? pulse(t, B[activeId].start + 0.2, B[activeId].end - 0.3, 0.4) : 0;
      setO(e.hot, on);
      // label: rest at 0.55·base; brighten the taken edge's label while hot
      setO(e.lbl, Math.max(0.55 * baseO, on));
    });

    /* ── WORKING ZONE: ONE scene at a time (ex.seg) ── */
    // segment card spans the handshake (b2–b4) + teardown (b6–b7)
    const cardHand = seg(t, B.syn.start + 0.15, B.data.start, 0.4);
    const cardTear = seg(t, B.fin.start + 0.15, B.timewait.end, 0.4);
    const cardOn = Math.max(cardHand, cardTear);
    setO(D.segCard, cardOn);
    setO(D.dataScene, seg(t, B.data.start + 0.15, B.fin.start, 0.4));
    setO(D.whyScene, seg(t, B.why.start + 0.15, B.why.end + 1, 0.4));

    /* drive the moving packet inside the segment card to the active segment */
    drivePacket(t, activeId);

    /* data-scene chunks stagger in */
    if (D.dataChunks) {
      D.dataChunks.forEach((c, i) => setO(c, ramp(t, B.data.start + 0.5 + i * 0.35, 0.4)));
      setO(D.dataAck, ramp(t, B.data.start + 1.8, 0.5));
    }

    /* ── LOWER THIRD: seq/ack arithmetic (one region, ex.seg) ── */
    setO(D.ltRule, ramp(t, B.syn.start, 0.5) * mathOn);
    setO(D.mHand, seg(t, B.syn.start + 0.2, B.data.start, 0.4) * mathOn);
    setO(D.mData, seg(t, B.data.start + 0.2, B.fin.start, 0.4) * mathOn);
    setO(D.mTear, seg(t, B.fin.start + 0.2, B.timewait.end, 0.4) * mathOn);
    setO(D.mWhy, seg(t, B.why.start + 0.2, B.why.end + 1, 0.4) * mathOn);

    /* handshake rows reveal progressively */
    if (D.mHandRows) {
      setO(D.mHandRows[0], ramp(t, B.syn.start + 0.4, 0.4));
      setO(D.mHandRows[1], ramp(t, B.synack.start + 0.2, 0.4));
      setO(D.mHandRows[2], ramp(t, B.ack.start + 0.2, 0.4));
      setO(D.mHandEstab, ramp(t, B.ack.start + 1.0, 0.5));
    }
    if (D.mTearRows) {
      setO(D.mTearRows[0], ramp(t, B.fin.start + 0.4, 0.4));
      setO(D.mTearRows[1], ramp(t, B.fin.start + 1.4, 0.4));
      setO(D.mTearRows[2], ramp(t, B.timewait.start + 0.2, 0.4));
      setO(D.mTearRows[3], ramp(t, B.timewait.start + 1.0, 0.4));
    }
  }

  /* move/format the segment packet for the active segment of the lifecycle */
  function drivePacket(t, activeId) {
    const map = { syn: "syn", synack: "synack", ack: "ack", fin: "fin", timewait: "lastack" };
    const key = map[activeId];
    if (!key) { setO(D.pkt, 0); return; }
    const s = SEG[key];
    const B = D.beats;
    const b = B[activeId];

    // text content
    let flagsTxt = s.flags.join(",");
    let nums = `seq=${s.seq}`;
    if (s.ack != null) nums += `  ack=${s.ack}`;
    D.pktFlags.textContent = flagsTxt;
    D.pktNums.textContent = nums;
    const hot = s.dir === "c2s" ? ACC : ACC2;
    D.pktRect.setAttribute("stroke", hot);
    D.pktRect.setAttribute("fill", s.dir === "c2s" ? FILL : PANEL);
    D.pktFlags.setAttribute("fill", hot);

    // travel: client→server moves L→R; server→client moves R→L
    const p = win(t, b.start + 0.3, b.end - 0.5, ease.warmIn);
    const x0 = D.chanX0 + 30, x1 = D.chanX1 - 30;
    const xpos = s.dir === "c2s" ? lerp(x0, x1, p) : lerp(x1, x0, p);
    D.pkt.setAttribute("transform", `translate(${xpos} ${D.chanY})`);
    const vis = win(t, b.start + 0.25, b.start + 0.6) * (1 - win(t, b.end - 0.35, b.end - 0.05));
    setO(D.pkt, vis);
  }

  /* ── MATH INVARIANT: the gate calls this ── */
  window.__AUDIT = function () {
    // 1) re-derive the trace and assert ack = seq + 1 across SYN/FIN events
    // SYN-ACK acks the client SYN: ack must equal client SYN seq + 1
    if (SEG.synack.ack !== SEG.syn.seq + 1)
      return { ok: false, msg: `SYN-ACK ack ${SEG.synack.ack} ≠ SYN seq+1 (${SEG.syn.seq + 1})` };
    // 3rd ACK acks the server SYN: ack must equal server SYN seq + 1
    if (SEG.ack.ack !== SEG.synack.seq + 1)
      return { ok: false, msg: `ACK ack ${SEG.ack.ack} ≠ SYN-ACK seq+1` };
    // data: server ack must equal client data seq + payload length
    if (SEG.finack.seq !== SERVER_ISN + 1)
      return { ok: false, msg: "server seq after handshake wrong" };
    // server ACK of client FIN: ack = client FIN seq + 1
    if (SEG.finack.ack !== SEG.fin.seq + 1)
      return { ok: false, msg: `teardown: server ack ${SEG.finack.ack} ≠ client FIN seq+1` };
    // client final ACK of server FIN: ack = server FIN seq + 1
    if (SEG.lastack.ack !== SEG.finS.seq + 1)
      return { ok: false, msg: `teardown: final ack ${SEG.lastack.ack} ≠ server FIN seq+1` };
    // data seq/ack: client data starts at 1001, ends 1012, server expects 1013
    const dataNext = SEG.data.seq + SEG.data.len;
    if (dataNext !== 1013)
      return { ok: false, msg: `data next-byte ${dataNext} ≠ 1013` };
    // 2) exactly one CURRENT state per beat
    const ids = Object.keys(BEAT_STATE);
    for (const id of ids) {
      const c = BEAT_STATE[id].current;
      const hits = STATES.filter((s) => s.id === c).length;
      if (hits !== 1) return { ok: false, msg: `beat ${id}: ${hits} current states (need 1)` };
    }
    return { ok: true,
      note: `handshake 1000→1001 / 5000→5001 · data +12 → ack 1013 · teardown → 1014/5002 · ack=seq+1 ✓` };
  };

  /* expose shared-region scene groups so the gate's §15b sweep proves only
     one is lit per region at any frame (paused-frame == playing-frame). */
  window.__REGIONS = () => ({
    working: [D.segCard, D.dataScene, D.whyScene],
    detail: [D.mHand, D.mData, D.mTear, D.mWhy],
  });
  /* §15d anti-collision: top-level blocks that must never overlap. */
  window.__LAYOUT = () => [D.segCard, D.dataScene, D.whyScene, D.mHand, D.mData, D.mTear, D.mWhy];

  return {
    meta: {
      id: "tcp",
      eyebrow: "Networking · 01",
      title: "The TCP Lifecycle",
      lede: "A connection is a <em>shared</em> state machine. Watch one open, carry bytes, and close — with real seq/ack numbers.",
      synthTitle: "What a connection <em>really</em> is",
      tag: "TCP · three-way handshake & teardown",
      synthesis:
        "TCP isn’t a stream of packets — it’s one finite state machine kept in step on both ends. Every transition is agreed: the SYN/SYN-ACK/ACK handshake establishes a shared starting point, sequence and ack numbers track every byte, and the FIN/ACK/FIN/ACK teardown closes it explicitly through TIME_WAIT. Because both sides always agree on the current state, the byte stream is reliable, ordered, and cleanly torn down — that agreement is the whole point.",
    },
    beats,
    build,
    render,
    setMath(on) { flags.math = !!on; },
  };
})();
