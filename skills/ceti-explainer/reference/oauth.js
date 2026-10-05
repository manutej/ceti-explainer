/* ════════════════════════════════════════════════════════════════════
   OAuth 2.0 — Authorization Code flow — CETI Explainer content module
   --------------------------------------------------------------------
   Process / pipeline archetype. The anchor is four labelled actors across
   the top — User · Client app · Authorization server · Resource server —
   joined by a channel. A packet travels the channel each beat. The detail
   band shows the REAL artifacts at each step (authorize URL, token JSON,
   bearer call), derived in code and JSON.stringify'd so they can't drift.

   The point: the app never sees your password. It gets a scoped, expiring
   token you can revoke — access without a master key.

   Exposes the CetiExplainer content contract: { meta, beats, build, render }.
   ──────────────────────────────────────────────────────────────────── */
window.EXPLAINER = (function () {
  const ex = window.CetiExplainer;
  const { win, ramp, lerp, clamp, ease, pulse, seg, fit } = ex;

  /* ---------- DATA (real artifacts, derived in code) ---------- */
  const ACTORS = [
    { id: "user",   short: "User",     sub: "the resource owner" },
    { id: "client", short: "Client app", sub: "wants your data" },
    { id: "authz",  short: "Auth server", sub: "logs you in" },
    { id: "rsrc",   short: "Resource server", sub: "holds your data" },
  ];

  const CLIENT_ID = "app_42";
  const CLIENT_SECRET = "s3cr3t";
  const REDIRECT = "https://app.example/cb";
  const SCOPE = "read";
  const STATE = "xyz";
  const AUTH_CODE = "AUTH_123";
  const ACCESS_TOKEN = "AT_a1b2c3";
  const REFRESH_TOKEN = "RT_z9y8x7";
  const TOKEN_TYPE = "Bearer";
  const EXPIRES_IN = 3600; // seconds

  // 1. the redirect to /authorize (query string built from real params)
  const AUTHZ_QS =
    "response_type=code" +
    "&client_id=" + CLIENT_ID +
    "&redirect_uri=" + REDIRECT +
    "&scope=" + SCOPE +
    "&state=" + STATE;
  const AUTHZ_URL = "GET /authorize?" + AUTHZ_QS;

  // 2. the code → token exchange (real request + response objects)
  const TOKEN_REQ = {
    grant_type: "authorization_code",
    code: AUTH_CODE,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  const TOKEN_RES = {
    access_token: ACCESS_TOKEN,
    token_type: TOKEN_TYPE,
    expires_in: EXPIRES_IN,
    refresh_token: REFRESH_TOKEN,
  };

  // 3. the API call carrying the bearer token
  const API_CALL = "GET /me";
  const API_AUTH = "Authorization: " + TOKEN_TYPE + " " + ACCESS_TOKEN;

  // 4. refresh exchange (when the access token expires)
  const REFRESH_REQ = { grant_type: "refresh_token", refresh_token: REFRESH_TOKEN };
  const EXPIRES_MIN = Math.round(EXPIRES_IN / 60); // 60 min

  /* ---------- BEATS ---------- */
  const beats = [
    { id: "actors", label: "Four actors", dur: 4.2,
      caption: "Four parties. You want an app to read your data — without handing it your password." },
    { id: "redirect", label: "Redirect", dur: 5.0,
      caption: "The app sends you to the authorization server with a request — never to a password box it controls." },
    { id: "consent", label: "Log in & consent", dur: 4.8,
      caption: "You log in at the authorization server and approve one scope — here, read-only. The app never sees this." },
    { id: "code", label: "Code returned", dur: 4.8,
      caption: "The server bounces you back to the app's redirect URI carrying a short-lived authorization code." },
    { id: "exchange", label: "Code → token", dur: 5.4,
      caption: "The app trades the code plus its secret at the token endpoint for an access token and a refresh token." },
    { id: "call", label: "Call the API", dur: 4.8,
      caption: "The app calls the resource server with Authorization: Bearer — the token, not your credentials." },
    { id: "refresh", label: "Expire & refresh", dur: 4.6,
      caption: "The access token expires in an hour. The refresh token quietly mints a new one — no re-login." },
    { id: "why", label: "Why it matters", dur: 5.6,
      caption: "The app gets a scoped, expiring token you can revoke — delegated access without a master key." },
  ];

  /* ---------- GEOMETRY ---------- */
  const VW = 1000, VH = 464;
  // anchor: four actor boxes across the top
  const BOX_Y = 40, BOX_H = 56, BOX_W = 196;
  const GAP = (VW - 88 - 4 * BOX_W) / 3;       // even gaps inside a 44px margin
  const boxX = (i) => 44 + i * (BOX_W + GAP);   // left x of actor i
  const boxCX = (i) => boxX(i) + BOX_W / 2;     // center x of actor i
  const CHAN_Y = BOX_Y + BOX_H + 26;            // the channel line
  const LT_Y = 302;                             // lower-third hairline

  const ACC = "var(--ex-accent)";       // copper — the lead / token
  const ACC2 = "var(--ex-accent2)";     // sage — auth server / consent
  const SUP = "var(--ex-support)";      // slate — resource server
  const PEACH = "var(--ex-peach)";      // the code (short-lived)
  const INK = "var(--ex-ink)";
  const DIM = "var(--ex-dim)";
  const LINE = "var(--ex-line)";
  const PANEL = "var(--ex-panel)";
  const CELL = "var(--ex-cell)";

  // accent per actor
  const ACTOR_ACC = [INK, ACC, ACC2, SUP];

  /* ---------- tiny SVG helpers ---------- */
  const SVGNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  const g = (parent, attrs) => el("g", attrs, parent);
  const setO = (node, o) => { node.style.opacity = o; };
  const setX = (node, x, y) => node.setAttribute("transform", `translate(${x} ${y})`);

  /* a panel rect with a left accent rule + a mono eyebrow */
  function panel(parent, x, y, w, h, accent, eyebrow) {
    const grp = g(parent);
    el("rect", { x, y, width: w, height: h, rx: 10, fill: PANEL, stroke: LINE, "stroke-width": 1 }, grp);
    el("rect", { x, y, width: 4, height: h, rx: 2, fill: accent }, grp);
    if (eyebrow) {
      el("text", { x: x + 20, y: y + 24, "font-family": "var(--font-mono)", "font-size": 11,
        "letter-spacing": "0.16em", fill: accent, text: eyebrow }, grp);
    }
    return grp;
  }
  /* a mono code line, auto-fit to a max width */
  function codeLine(parent, x, y, str, color, size, maxW) {
    const n = el("text", { x, y, "font-family": "var(--font-mono)", "font-size": size || 13,
      fill: color || INK, text: str }, parent);
    if (maxW) fit(n, maxW, 9);
    return n;
  }
  function lowerEyebrow(parent, x, text) {
    return el("text", { x, y: 4, "font-family": "var(--font-mono)", "font-size": 10,
      "letter-spacing": "0.2em", fill: DIM, text }, parent);
  }

  /* ---------- state refs ---------- */
  const D = {};
  const flags = { math: true };

  /* ---------- BUILD (persistent nodes, once) ---------- */
  function build(stage, opts) {
    D.beats = {};
    opts.beats.forEach((b) => (D.beats[b.id] = b));

    const svg = el("svg", { viewBox: `0 0 ${VW} ${VH}`, width: "100%", height: "100%",
      "font-family": "var(--font-sans)", role: "img",
      "aria-label": "Animated walkthrough of the OAuth 2.0 authorization code flow" }, stage);
    D.svg = svg;

    /* layer order: channel → boxes → packet → working scenes → lower third */
    const lChan = g(svg);
    const lBox = g(svg);
    const lPkt = g(svg);
    const lWork = g(svg);
    const lLower = g(svg, { transform: `translate(0 ${LT_Y + 14})` });

    /* ── the channel line (the wire the packet travels) ── */
    D.channel = el("line", { x1: boxCX(0), y1: CHAN_Y, x2: boxCX(3), y2: CHAN_Y,
      stroke: LINE, "stroke-width": 1.5 }, lChan);
    setO(D.channel, 0);
    // tick marks under each actor onto the channel
    D.stems = ACTORS.map((_, i) => {
      const s = el("line", { x1: boxCX(i), y1: BOX_Y + BOX_H, x2: boxCX(i), y2: CHAN_Y,
        stroke: LINE, "stroke-width": 1 }, lChan);
      setO(s, 0);
      return s;
    });

    /* ── the four actor boxes (the anchor) ── */
    D.boxG = []; D.boxRect = [];
    ACTORS.forEach((a, i) => {
      const grp = g(lBox);
      const x = boxX(i), acc = ACTOR_ACC[i];
      const rect = el("rect", { x, y: BOX_Y, width: BOX_W, height: BOX_H, rx: 10,
        fill: PANEL, stroke: LINE, "stroke-width": 1 }, grp);
      el("rect", { x, y: BOX_Y, width: 4, height: BOX_H, rx: 2, fill: acc }, grp);
      const title = el("text", { x: x + 18, y: BOX_Y + 25, "font-family": "var(--font-sans)",
        "font-weight": 600, "font-size": 15, fill: INK, text: a.short }, grp);
      fit(title, BOX_W - 30, 11);
      const sub = el("text", { x: x + 18, y: BOX_Y + 44, "font-family": "var(--font-sans)",
        "font-size": 12, fill: DIM, text: a.sub }, grp);
      fit(sub, BOX_W - 30, 9);
      // index pill
      el("text", { x: x + BOX_W - 16, y: BOX_Y + 22, "text-anchor": "end",
        "font-family": "var(--font-mono)", "font-size": 11, fill: acc, text: i + 1 }, grp);
      setO(grp, 0);
      D.boxG.push(grp);
      D.boxRect.push(rect);
    });

    /* ── the traveling packet (kept OFF the boxes by insetting its range) ── */
    const pg = g(lPkt);
    D.pktRect = el("rect", { x: -34, y: -13, width: 68, height: 26, rx: 13,
      fill: "var(--ex-accent-fill)", stroke: ACC, "stroke-width": 1.4 }, pg);
    D.pktLabel = el("text", { x: 0, y: 1, "text-anchor": "middle", "dominant-baseline": "middle",
      "font-family": "var(--font-mono)", "font-size": 12, fill: ACC, text: "" }, pg);
    fit(D.pktLabel, 60, 9);
    D.pkt = pg;
    setO(D.pkt, 0);
    setX(D.pkt, boxCX(0), CHAN_Y);

    /* ── WORKING-ZONE scenes (one region, cross-faded with ex.seg) ── */
    const WZ_Y = CHAN_Y + 30;   // top of the working zone (~152)
    D.scenes = {};
    D.scenes.intro    = buildIntro(lWork, WZ_Y);
    D.scenes.redirect = buildRedirect(lWork, WZ_Y);
    D.scenes.consent  = buildConsent(lWork, WZ_Y);
    D.scenes.code     = buildCode(lWork, WZ_Y);
    D.scenes.exchange = buildExchange(lWork, WZ_Y);
    D.scenes.call     = buildCall(lWork, WZ_Y);
    D.scenes.refresh  = buildRefresh(lWork, WZ_Y);
    D.scenes.why      = buildWhy(lWork, WZ_Y);
    Object.values(D.scenes).forEach((s) => setO(s, 0));

    /* ── DETAIL BAND scenes (one region, cross-faded with ex.seg) ── */
    el("line", { x1: 44, y1: LT_Y, x2: VW - 44, y2: LT_Y, stroke: LINE, "stroke-width": 1 }, svg);
    D.ltRule = svg.lastChild;
    setO(D.ltRule, 0);
    D.det = {};
    D.det.params   = buildDetParams(lLower);
    D.det.token    = buildDetToken(lLower);
    D.det.bearer   = buildDetBearer(lLower);
    D.det.refresh  = buildDetRefresh(lLower);
    D.det.why      = buildDetWhy(lLower);
    Object.values(D.det).forEach((s) => setO(s, 0));
  }

  /* ─────────── WORKING-ZONE scene builders ─────────── */

  // beat 1: the problem — the naive "share your password" alternative, struck out
  function buildIntro(parent, y) {
    const s = g(parent);
    el("text", { x: VW / 2, y: y + 30, "text-anchor": "middle", "font-family": "var(--font-sans)",
      "font-size": 17, fill: INK, text: "You want the app to read your data." }, s);
    // the bad way
    const bx = VW / 2 - 250, bw = 230;
    panel(s, bx, y + 56, bw, 64, PEACH, "THE NAIVE WAY");
    el("text", { x: bx + 20, y: y + 96, "font-family": "var(--font-mono)", "font-size": 13,
      fill: DIM, text: "give it your password" }, s);
    D.introStrike = el("line", { x1: bx + 18, y1: y + 92, x2: bx + 200, y2: y + 92,
      stroke: PEACH, "stroke-width": 2 }, s);
    setO(D.introStrike, 0);
    // the good way
    const gx = VW / 2 + 20, gw = 230;
    panel(s, gx, y + 56, gw, 64, ACC2, "OAUTH 2.0");
    el("text", { x: gx + 20, y: y + 96, "font-family": "var(--font-mono)", "font-size": 13,
      fill: ACC2, text: "delegate with a token" }, s);
    return s;
  }

  // beat 2: redirect — arrow from Client → Auth server, the /authorize request
  function buildRedirect(parent, y) {
    const s = g(parent);
    arrowBetween(s, 1, 2, y, ACC, "redirect to authorize");
    const px = boxCX(1), pw = 360, x = px - 30;
    panel(s, x, y + 44, pw, 64, ACC, "REQUEST  ·  client → auth server");
    codeLine(s, x + 20, y + 86, "response_type=code", ACC, 13, pw - 40);
    codeLine(s, x + 20, y + 102, "client_id · redirect_uri · scope · state", DIM, 12, pw - 40);
    return s;
  }

  // beat 3: consent — login + a single scope checkbox at the auth server
  function buildConsent(parent, y) {
    const s = g(parent);
    const x = boxCX(2) - 180, w = 360;
    panel(s, x, y + 16, w, 96, ACC2, "AT THE AUTH SERVER  ·  the app can't see this");
    el("text", { x: x + 20, y: y + 58, "font-family": "var(--font-sans)", "font-size": 14,
      fill: INK, text: "1.  You log in with your password" }, s);
    // scope row with a check
    el("rect", { x: x + 20, y: y + 74, width: 18, height: 18, rx: 4, fill: CELL,
      stroke: ACC2, "stroke-width": 1.4 }, s);
    el("path", { d: `M ${x + 24} ${y + 83} l 4 4 l 7 -8`, fill: "none", stroke: ACC2,
      "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" }, s);
    el("text", { x: x + 48, y: y + 88, "font-family": "var(--font-sans)", "font-size": 14,
      fill: INK, text: "2.  Approve one scope:" }, s);
    el("text", { x: x + 215, y: y + 88, "font-family": "var(--font-mono)", "font-size": 14,
      fill: ACC2, "font-weight": 700, text: "read" }, s);
    return s;
  }

  // beat 4: code returned — arrow Auth → Client carrying the short-lived code
  function buildCode(parent, y) {
    const s = g(parent);
    arrowBetween(s, 2, 1, y, PEACH, "back to redirect_uri");
    const x = boxCX(1) - 30, w = 320;
    panel(s, x, y + 44, w, 64, PEACH, "AUTHORIZATION CODE  ·  short-lived");
    el("text", { x: x + 20, y: y + 88, "font-family": "var(--font-mono)", "font-size": 16,
      fill: PEACH, "font-weight": 700, text: "code = " + AUTH_CODE }, s);
    el("text", { x: x + 20, y: y + 104, "font-family": "var(--font-sans)", "font-size": 11,
      fill: DIM, text: "one use, expires in seconds — not the token yet" }, s);
    return s;
  }

  // beat 5: exchange — Client → Auth, code+secret in, token out
  function buildExchange(parent, y) {
    const s = g(parent);
    arrowBetween(s, 1, 2, y, ACC, "POST /token  (back channel)");
    const x = boxCX(1) - 50, w = 420;
    panel(s, x, y + 44, w, 64, ACC, "EXCHANGE  ·  code + secret  →  token");
    el("text", { x: x + 20, y: y + 86, "font-family": "var(--font-mono)", "font-size": 13,
      fill: PEACH, text: AUTH_CODE + " + " + CLIENT_SECRET }, s);
    el("text", { x: x + 175, y: y + 86, "font-family": "var(--font-mono)", "font-size": 13,
      fill: DIM, text: "→" }, s);
    el("text", { x: x + 200, y: y + 86, "font-family": "var(--font-mono)", "font-size": 13,
      fill: ACC, "font-weight": 700, text: ACCESS_TOKEN }, s);
    el("text", { x: x + 20, y: y + 102, "font-family": "var(--font-sans)", "font-size": 11,
      fill: DIM, text: "the secret proves it's really the client" }, s);
    return s;
  }

  // beat 6: API call — Client → Resource, bearer token
  function buildCall(parent, y) {
    const s = g(parent);
    arrowBetween(s, 1, 3, y, ACC, "GET /me  with the token");
    const x = boxCX(2) - 60, w = 380;
    panel(s, x, y + 44, w, 64, SUP, "API CALL  ·  client → resource server");
    codeLine(s, x + 20, y + 86, API_CALL + "   " + API_AUTH, INK, 13, w - 40);
    el("text", { x: x + 20, y: y + 102, "font-family": "var(--font-sans)", "font-size": 11,
      fill: DIM, text: "the token is scoped to read — nothing more" }, s);
    return s;
  }

  // beat 7: expire & refresh — the access token expires, refresh mints a new one
  function buildRefresh(parent, y) {
    const s = g(parent);
    arrowBetween(s, 1, 2, y, ACC, "refresh_token → new access token");
    const x = boxCX(1) - 40, w = 400;
    panel(s, x, y + 44, w, 64, ACC, "TOKEN LIFECYCLE");
    el("text", { x: x + 20, y: y + 86, "font-family": "var(--font-mono)", "font-size": 13,
      fill: DIM, text: ACCESS_TOKEN + "  expired (" + EXPIRES_MIN + " min)" }, s);
    el("text", { x: x + 20, y: y + 102, "font-family": "var(--font-mono)", "font-size": 13,
      fill: ACC, text: REFRESH_TOKEN + "  →  AT_new  (no re-login)" }, s);
    return s;
  }

  // beat 8: why it matters — reuse the anchor; before / after, side by side
  function buildWhy(parent, y) {
    const s = g(parent);
    const cols = [
      ["PASSWORD SHARING", "full account, forever, to every app", PEACH, false],
      ["OAUTH TOKEN", "scoped · expiring · revocable", ACC, true],
    ];
    cols.forEach((c, i) => {
      const x = boxCX(0) + i * (boxCX(2) - boxCX(0));
      const w = 380;
      const grp = panel(s, x - 30, y + 24, w, 70, c[3] ? ACC : PEACH, c[0]);
      const t = el("text", { x: x - 10, y: y + 70, "font-family": "var(--font-sans)",
        "font-size": 14, fill: c[3] ? INK : DIM, text: c[1] }, grp);
      fit(t, w - 40, 11);
    });
    return s;
  }

  /* arrow from actor a → actor b along the channel band (inset off the boxes) */
  function arrowBetween(parent, a, bb, y, color, label) {
    const x0 = boxCX(a), x1 = boxCX(bb);
    const dir = x1 > x0 ? 1 : -1;
    const inset = 18;
    const sx = x0 + dir * inset, ex2 = x1 - dir * inset;
    el("line", { x1: sx, y1: y, x2: ex2, y2: y, stroke: color, "stroke-width": 1.8,
      "stroke-linecap": "round" }, parent);
    // arrowhead
    el("path", { d: `M ${ex2} ${y} l ${-dir * 9} -5 l 0 10 z`, fill: color }, parent);
    el("text", { x: (sx + ex2) / 2, y: y - 10, "text-anchor": "middle",
      "font-family": "var(--font-mono)", "font-size": 11, fill: color, text: label }, parent);
  }

  /* ─────────── DETAIL-BAND scene builders ─────────── */

  function buildDetParams(parent) {
    const s = g(parent);
    lowerEyebrow(s, 60, "STEP 1 · THE AUTHORIZE REQUEST (front channel, in the URL)");
    const n = codeLine(s, 60, 38, AUTHZ_URL, INK, 14, VW - 140);
    el("text", { x: 60, y: 64, "font-family": "var(--font-sans)", "font-size": 13, fill: DIM,
      text: "response_type=code asks for a code, not a token. state=" + STATE + " guards against forgery." }, s);
    D.detParamsLine = n;
    return s;
  }

  function buildDetToken(parent) {
    const s = g(parent);
    lowerEyebrow(s, 60, "STEP 2 · POST /token  (back channel — the secret never touches the browser)");
    const reqStr = "req  " + JSON.stringify(TOKEN_REQ);
    const resStr = "res  " + JSON.stringify(TOKEN_RES);
    codeLine(s, 60, 40, reqStr, PEACH, 13, VW - 140);
    codeLine(s, 60, 68, resStr, ACC, 13, VW - 140);
    return s;
  }

  function buildDetBearer(parent) {
    const s = g(parent);
    lowerEyebrow(s, 60, "STEP 3 · CALL THE API WITH THE BEARER TOKEN");
    codeLine(s, 60, 40, API_CALL, INK, 14, VW - 140);
    codeLine(s, 60, 66, API_AUTH, ACC, 14, VW - 140);
    el("text", { x: 60, y: 92, "font-family": "var(--font-sans)", "font-size": 12, fill: DIM,
      text: "No password, no secret on the wire — just a scoped, expiring token." }, s);
    return s;
  }

  function buildDetRefresh(parent) {
    const s = g(parent);
    lowerEyebrow(s, 60, "TOKEN LIFETIME · access expires, refresh renews");
    el("text", { x: 60, y: 42, "font-family": "var(--font-mono)", "font-size": 14, fill: DIM,
      text: "access_token  expires_in = " + EXPIRES_IN + "s  (" + EXPIRES_MIN + " min)" }, s);
    const refStr = "POST /token  " + JSON.stringify(REFRESH_REQ);
    codeLine(s, 60, 70, refStr, ACC, 13, VW - 140);
    el("text", { x: 60, y: 94, "font-family": "var(--font-sans)", "font-size": 12, fill: DIM,
      text: "Revoke the refresh token and access ends — without changing your password." }, s);
    return s;
  }

  function buildDetWhy(parent) {
    const s = g(parent);
    lowerEyebrow(s, 60, "THE AHA · ACCESS WITHOUT A MASTER KEY");
    const items = [
      ["delegated", "the app acts for you, never as you", ACC],
      ["scoped", "only " + SCOPE + " — not your whole account", ACC2],
      ["revocable", "kill the token; your password is untouched", SUP],
    ];
    items.forEach((it, i) => {
      const x = 60 + i * 300;
      el("rect", { x, y: 24, width: 4, height: 64, rx: 2, fill: it[2] }, s);
      el("text", { x: x + 16, y: 44, "font-family": "var(--font-mono)", "font-size": 14,
        "font-weight": 700, fill: it[2], text: it[0] }, s);
      const d = el("text", { x: x + 16, y: 70, "font-family": "var(--font-sans)", "font-size": 13,
        fill: DIM, text: it[1] }, s);
      fit(d, 270, 10);
    });
    return s;
  }

  /* ---------- RENDER (pure function of t) ---------- */
  function render(t) {
    const B = D.beats;
    const mathOn = flags.math ? 1 : 0;

    /* ── anchor: actor boxes stagger in during beat 1, persist after ── */
    ACTORS.forEach((_, i) => {
      const a = ramp(t, B.actors.start + 0.15 + i * 0.22, 0.5, ease.defer);
      setO(D.boxG[i], a);
      setO(D.stems[i], a * 0.7);
    });
    setO(D.channel, ramp(t, B.actors.start + 0.3, 0.6) * 0.8);

    /* highlight the active actor(s) per beat via stroke weight */
    const activePair = {
      redirect: [1, 2], consent: [2], code: [2, 1],
      exchange: [1, 2], call: [1, 3], refresh: [1, 2], why: [0, 1, 2, 3],
    };
    ACTORS.forEach((_, i) => {
      let hot = 0;
      for (const id in activePair) {
        if (activePair[id].includes(i)) {
          const b = B[id];
          hot = Math.max(hot, win(t, b.start, b.start + 0.4) * (1 - win(t, b.end - 0.3, b.end)));
        }
      }
      D.boxRect[i].setAttribute("stroke", hot > 0.3 ? ACTOR_ACC[i] : LINE);
      D.boxRect[i].setAttribute("stroke-width", 1 + hot * 1.0);
    });

    /* ── the traveling packet ──
       moves between actor centers per beat, inset so it stays OFF the boxes. */
    const hops = [
      // [beat id, from actor, to actor, label]
      ["redirect", 1, 2, "/authorize"],
      ["code",     2, 1, AUTH_CODE],
      ["exchange", 1, 2, "code+secret"],
      ["call",     1, 3, TOKEN_TYPE],
      ["refresh",  2, 1, "AT_new"],
    ];
    let pktO = 0, pktX = boxCX(0), pktLbl = "";
    for (const [id, from, to, lbl] of hops) {
      const b = B[id];
      const p = win(t, b.start + 0.5, b.end - 0.6, ease.warmIn);
      const on = win(t, b.start + 0.4, b.start + 0.7) * (1 - win(t, b.end - 0.5, b.end - 0.2));
      if (on > pktO) {
        pktO = on;
        // inset travel range so the packet never sits on a box
        const x0 = boxCX(from), x1 = boxCX(to);
        const dir = x1 > x0 ? 1 : -1;
        const inset = BOX_W / 2 + 12;
        pktX = lerp(x0 + dir * inset, x1 - dir * inset, p);
        pktLbl = lbl;
      }
    }
    setO(D.pkt, pktO);
    D.pktLabel.textContent = pktLbl;
    setX(D.pkt, pktX, CHAN_Y);

    /* ── working-zone scenes — ONE region, ex.seg cross-fades ── */
    setO(D.scenes.intro,    seg(t, B.actors.start + 0.6, B.actors.end, 0.4));
    setO(D.scenes.redirect, seg(t, B.redirect.start + 0.2, B.redirect.end, 0.4));
    setO(D.scenes.consent,  seg(t, B.consent.start + 0.2, B.consent.end, 0.4));
    setO(D.scenes.code,     seg(t, B.code.start + 0.2, B.code.end, 0.4));
    setO(D.scenes.exchange, seg(t, B.exchange.start + 0.2, B.exchange.end, 0.4));
    setO(D.scenes.call,     seg(t, B.call.start + 0.2, B.call.end, 0.4));
    setO(D.scenes.refresh,  seg(t, B.refresh.start + 0.2, B.refresh.end, 0.4));
    setO(D.scenes.why,      seg(t, B.why.start + 0.2, B.why.end + 1, 0.4));

    /* intro strike-through draws on as the naive way is dismissed */
    if (D.introStrike) setO(D.introStrike, ramp(t, B.actors.start + 1.6, 0.6));

    /* ── detail band — ONE region, ex.seg cross-fades, gated by flags.math ── */
    setO(D.ltRule, ramp(t, B.redirect.start, 0.5) * mathOn);
    setO(D.det.params,  seg(t, B.redirect.start + 0.2, B.consent.end, 0.4) * mathOn);
    setO(D.det.token,   seg(t, B.exchange.start + 0.2, B.exchange.end, 0.4) * mathOn);
    setO(D.det.bearer,  seg(t, B.call.start + 0.2, B.call.end, 0.4) * mathOn);
    setO(D.det.refresh, seg(t, B.refresh.start + 0.2, B.refresh.end, 0.4) * mathOn);
    setO(D.det.why,     seg(t, B.why.start + 0.2, B.why.end + 1, 0.4) * mathOn);
  }

  /* ---------- AUDIT INVARIANT (the gate calls this) ----------
     Recompute the token round-trip from raw inputs and assert the fields,
     scope and expiry so a sharp viewer can't catch an inconsistency. */
  window.__AUDIT = function () {
    // 1. the authorize request must ask for a code (not an implicit token)
    if (!AUTHZ_URL.includes("response_type=code"))
      return { ok: false, msg: "authorize request is not response_type=code" };
    if (!AUTHZ_URL.includes("scope=" + SCOPE))
      return { ok: false, msg: "authorize request missing scope=" + SCOPE };
    // 2. token exchange round-trip: request carries code+secret, grant type matches
    if (TOKEN_REQ.grant_type !== "authorization_code")
      return { ok: false, msg: "token grant_type is not authorization_code" };
    if (TOKEN_REQ.code !== AUTH_CODE)
      return { ok: false, msg: "token request code != issued code" };
    if (TOKEN_REQ.client_secret !== CLIENT_SECRET)
      return { ok: false, msg: "token request missing client_secret" };
    // 3. token response must carry the four canonical fields, Bearer type, 1h expiry
    for (const f of ["access_token", "token_type", "expires_in", "refresh_token"])
      if (!(f in TOKEN_RES)) return { ok: false, msg: "token response missing " + f };
    if (TOKEN_RES.token_type !== "Bearer")
      return { ok: false, msg: "token_type is not Bearer" };
    if (TOKEN_RES.expires_in !== 3600)
      return { ok: false, msg: "expires_in is not 3600 (1h)" };
    // 4. the API call must carry the SAME access token, as a bearer
    if (API_AUTH !== "Authorization: Bearer " + TOKEN_RES.access_token)
      return { ok: false, msg: "bearer header token != issued access_token" };
    // 5. refresh exchange uses the issued refresh token
    if (REFRESH_REQ.refresh_token !== TOKEN_RES.refresh_token)
      return { ok: false, msg: "refresh request token != issued refresh_token" };
    return { ok: true,
      note: `code→token OK · ${TOKEN_TYPE} · scope=${SCOPE} · expires ${EXPIRES_MIN}min · refresh wired` };
  };

  /* expose every shared region so the gate's §15b sweep can prove only one
     scene is lit per region at any instant (paused-frame == playing-frame). */
  window.__REGIONS = () => ({
    working: [D.scenes.intro, D.scenes.redirect, D.scenes.consent, D.scenes.code,
              D.scenes.exchange, D.scenes.call, D.scenes.refresh, D.scenes.why],
    detail: [D.det.params, D.det.token, D.det.bearer, D.det.refresh, D.det.why],
  });
  /* §15d anti-collision: top-level blocks that must never overlap. */
  window.__LAYOUT = () => [
    D.scenes.intro, D.scenes.redirect, D.scenes.consent, D.scenes.code,
    D.scenes.exchange, D.scenes.call, D.scenes.refresh, D.scenes.why,
    D.det.params, D.det.token, D.det.bearer, D.det.refresh, D.det.why,
  ];

  return {
    meta: {
      id: "oauth",
      eyebrow: "Web Protocols · 01",
      title: "OAuth 2.0",
      lede: "An app wants your data — not your password. Watch the authorization code flow hand it a scoped, expiring token instead.",
      tag: "OAuth 2.0 · authorization code grant",
      synthesis:
        "The app never sees your password. You log in at the authorization server, approve one scope, and it hands the app a short-lived code. The app exchanges that code plus its own secret for a scoped access token — and a refresh token to renew it. Every API call carries the token, not your credentials. The token expires on its own and you can revoke it any time: delegated access without ever handing over a master key.",
    },
    beats,
    build,
    render,
    setMath(on) { flags.math = !!on; },
  };
})();
