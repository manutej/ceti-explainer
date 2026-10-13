#!/usr/bin/env python3
"""lib/mkfilm.py · writes ../film.json (who-gains draft A). The camera knobs come from the rig itself (node lib/camknobs.mjs =
gl-camera-rig toKnobs over lib/cam.base.json); every other knob is listed in KNOBS below with its range and what it does.
Captions are the beat sheet's 23 (factory/topics/who-gains/beats.md), digits only as claim renders. Deterministic."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))

# (name, value, lo, hi, step, what)
KNOBS = [
 # clocks and beats (s)
 ("caseT0", 12.0, 11.5, 12.5, 0.1, "s: film time at which the agents' stack-city clock starts (CASE t0)"),
 ("caseDur", 100.0, 60, 140, 1, "s: length of the agents' clock; beats below are converted to fractions of it"),
 ("arrive0", 12.4, 12, 14, 0.1, "s: the first agent's box drops onto the floor"),
 ("arrive1", 21.8, 20, 22, 0.1, "s: the last box is down; must be <= 22.0 so 5,179 is landed before any ratio"),
 ("lit0", 22.6, 22, 26, 0.1, "s: the gaining boxes start to light, bottom-up (after the count has landed)"),
 ("lit1", 25.8, 24, 26, 0.1, "s: every gaining box is lit; the pooled +14 % pin follows at poolPin"),
 ("poolPin", 26.0, 25.5, 28, 0.1, "s: the pooled pin (the average) appears, a ratio after the count"),
 ("poolOut", 33.6, 32, 34, 0.1, "s: the pooled pin leaves before the re-sort (labels cut off at move start)"),
 ("zone0", 31.4, 28, 33, 0.1, "s: the three skill zones start to be outlined on the floor"),
 ("zone1", 33.4, 30, 34, 0.1, "s: the zone outlines are drawn"),
 ("move0", 34.0, 33, 35, 0.1, "s: the boxes leave the pooled column for their skill zone (keep equal to the camera's m1 t0)"),
 ("move1", 44.0, 40, 47, 0.1, "s: the last box is in its zone (keep equal to the camera's m1 t1)"),
 ("tag0", 33.2, 30, 35, 0.1, "s: the followed agent takes the accent (outline, trail, ghost of its old home)"),
 ("tag1", 68.6, 62, 75, 0.1, "s: the followed agent returns to the crowd"),
 ("tagPin1", 44.0, 40, 46, 0.1, "s: the riding pin 'ONE AGENT' leaves after the move"),
 ("tagPin2", 63.6, 62, 66, 0.1, "s: the pin returns at the close-up (after the look-at settles)"),
 ("tagPin3", 67.0, 64, 68, 0.1, "s: the pin leaves before the pull-back lands"),
 ("namePins", 44.8, 44, 46, 0.1, "s: the three zones are named (and the zone count), after the settle"),
 ("noviceAt", 46.6, 45, 48, 0.1, "s: the lowest-skill zone's result lands (hold 3.0 s)"),
 ("expertAt", 49.6, 48, 51, 0.1, "s: the highest-skill zone's result lands (hold >= 3.0 s)"),
 ("avg0", 53.6, 52, 56, 0.1, "s: the average returns as a dashed line across the three zones"),
 ("avgOut", 59.4, 57, 60, 0.1, "s: the average line and the zone pins leave before the close-up"),
 ("zoneOut", 59.4, 57, 60, 0.1, "s: the zone pins leave (cut off before the look-at at 60 s)"),
 ("backT0", 64.5, 63.6, 66, 0.1, "s: the pull-back to the stored wide split pose starts (T8: lands on the m1 pose)"),
 ("backT1", 68.0, 66, 70, 0.1, "s: the pull-back lands"),
 ("legendAt", 68.4, 67, 70, 0.1, "s: the legend 'ONE BOX = ONE AGENT' lands on the wide split"),
 ("names2", 69.0, 68, 71, 0.1, "s: the zone names return on the wide split (no digits)"),
 ("ledgerOut", 33.6, 32, 34, 0.1, "s: the agents ledger leaves before the move"),
 ("dvT0", 76.0, 75, 77, 0.1, "s: hard cut to the developers' field (keep equal to the camera's m4 t0)"),
 ("dvArrive0", 76.4, 76, 78, 0.1, "s: the first developer's box drops"),
 ("dvArrive1", 83.6, 81, 83.9, 0.1, "s: the last box is down; 4,867 lands at 84.0"),
 ("dvLit0", 84.6, 84, 87, 0.1, "s: the gaining boxes start to light"),
 ("dvLit1", 87.8, 86, 88, 0.1, "s: every gaining box is lit"),
 ("dvPin", 88.0, 87.5, 90, 0.1, "s: the pooled +26 % pin appears (4.0 s after the count)"),
 ("dvPinOut", 95.4, 94, 96, 0.1, "s: the pin leaves before the descent"),
 ("mrT0", 101.5, 101, 102, 0.1, "s: hard cut to the METR desk (keep equal to the camera's m5b t0)"),
 ("dotsAt", 101.55, 101.5, 102, 0.05, "s: the 16 developer dots start to count in"),
 ("dotsEnd", 101.95, 101.9, 102.5, 0.05, "s: the 16th dot is down"),
 ("pin16", 102.0, 101.9, 103, 0.1, "s: the pin '16' lands (hold 3.0 s)"),
 ("boxes0", 102.4, 102, 104, 0.1, "s: the first issue column drops onto the desk"),
 ("boxes1", 104.7, 103.5, 105, 0.1, "s: the 246th column is down"),
 ("pin246", 105.0, 104.9, 106, 0.1, "s: the pin '246' lands (hold 6.0 s)"),
 ("ghostAt", 111.0, 109, 112, 0.1, "s: the forecast ghost block, the baseline loops and the legend appear (the belief view)"),
 ("pin24Out", 115.8, 114, 116, 0.1, "s: the '24 %' pin leaves before the tilt"),
 ("pinSlower", 126.0, 124, 128, 0.1, "s: the pin '19 %' lands on the measured block (hold 3.0 s)"),
 ("pinBelieved", 129.0, 127, 131, 0.1, "s: the pin '20 %' lands on the ghost, with the believed-after ring"),
 ("bookAt", 135.0, 134, 136, 0.1, "s: the bookend cut back to the pooled floor (keep equal to the camera's m7 t0)"),
 ("bookPhase", 30.0, 27, 33, 0.1, "s: which moment of the agents' clock the bookend shows (pooled, every gaining box lit)"),
 ("honest0", 138.0, 136, 140, 0.1, "s: the honest-limits line appears on stage"),
 ("honestOut", 149.6, 148, 150, 0.1, "s: the honest-limits line leaves before the card"),
 ("hookRise0", 3.0, 1, 5, 0.1, "s: the pooled outline starts to rise (the belief)"),
 ("hookRise1", 9.0, 6, 11, 0.1, "s: the outline has risen"),
 ("hookOut", 11.9, 10, 12, 0.1, "s: the outline and its label leave as the first agents drop"),
 ("loneAt", 1.0, 0, 3, 0.1, "s: the lone box drops onto the empty floor"),
 # geometry and look
 ("boxSize", 6.4, 4, 9, 0.1, "world units: edge of one agent's or developer's box"),
 ("boxGap", 0.8, 0.3, 2, 0.1, "world units: seam between boxes"),
 ("poolLayers", 18, 12, 26, 1, "boxes high the agents' pooled column is (rate form: footprint = how many, lit height = gain)"),
 ("poolDepth", 16, 4, 24, 1, "boxes deep the agents' pooled column is"),
 ("slabLayers", 18, 12, 26, 1, "boxes high a skill zone is (rate form: every zone about as tall, lit height = gain)"),
 ("slabDepth", 8, 4, 14, 1, "boxes deep a skill zone is"),
 ("slabGap", 26, 8, 60, 1, "world units: aisle between the skill zones"),
 ("dvLayers", 14, 8, 24, 1, "boxes high the developers' pooled column is"),
 ("dvDepth", 14, 4, 24, 1, "boxes deep the developers' pooled column is"),
 ("mrSize", 5.0, 3, 8, 0.1, "world units: edge of one issue column on the METR desk"),
 ("mrGap", 0.6, 0.2, 2, 0.1, "world units: seam between issue columns"),
 ("mrGapX", 22, 8, 60, 1, "world units: gap between the ghost block and the measured block"),
 ("baseH", 60, 30, 100, 1, "world units: the baseline height (time without AI); forecast, believed and measured heights scale from it"),
 ("deskW", 300, 200, 500, 5, "world units: desk width"),
 ("deskD", 150, 100, 300, 5, "world units: desk depth"),
 ("dotR", 3.0, 2, 6, 0.1, "world units: radius of one developer dot"),
 ("dotPitch", 10, 7, 20, 0.5, "world units: spacing of the 16 developer dots"),
 ("dotGap", 14, 6, 40, 1, "world units: how far in front of the blocks the dot row stands"),
 ("hookH", 52, 30, 90, 1, "world units: height the belief outline rises to (about the lit pooled height)"),
 ("loneGap", 3, 1, 12, 0.5, "boxes: how far left of the pooled footprint the lone box stands"),
 ("gainFull", 40, 36, 60, 1, "percent gain that fills a whole column (drawing scale only; lit height = gain / this)"),
 ("tagLayer", 4, 1, 8, 1, "layer of the followed agent's box in its zone (a box on an outside face is chosen near it)"),
 ("drop", 60, 0, 100, 5, "world units a box falls from as it arrives"),
 ("arrW", 0.04, 0.01, 0.1, 0.01, "fraction of the arrival window one box takes to fall and grow"),
 ("stagger", 0.2, 0, 0.25, 0.05, "0-0.25: how spread out in time the boxes leave (each keeps its own path)"),
 ("lift", 22, 0, 40, 1, "world units: height of the arc each box makes between its two homes"),
 ("orderMix", 0.5, 0, 1, 0.05, "0 = seeded order, 1 = zone order (the zones fill one after another)"),
 ("ambient", 0.45, 0.2, 0.8, 0.01, "fill light on every face"),
 ("keyLight", 0.7, 0.1, 1, 0.02, "key light from above-left on top and side faces"),
 ("dim", 0.72, 0.4, 0.9, 0.02, "0-1: how far a box with no gain is mixed toward the floor (larger = darker)"),
 ("floorMix", 0.6, 0, 1, 0.05, "0-1: floor colour from ground (0) to panel (1)"),
 ("gridMix", 0.06, 0, 0.5, 0.01, "0-1: floor grid line colour from ground toward muted"),
 ("zoneMix", 0.55, 0, 1, 0.05, "0-1: zone outline colour from ground toward amber"),
 ("deskMix", 0.06, 0, 0.5, 0.01, "0-1: desk colour from the floor panel toward muted"),
 ("floorW", 3600, 1200, 5000, 100, "world units: floor width"),
 ("floorD", 3600, 800, 5000, 100, "world units: floor depth"),
 ("gridStep", 36, 18, 72, 2, "world units: floor grid spacing"),
 ("swayAmp", 2.5, 0, 3, 0.1, "degrees: amplitude of the calm sway about the aim point, the whole film (0 = still)"),
 ("swayPeriod", 60, 30, 240, 5, "s: period of the sway (longer = slower; <= 1 degree/s under a number)"),
 # labels and type
 ("hold", 8, 0, 15, 1, "frames a label must be pushed before it hides (gl-labels hysteresis)"),
 ("leader", 20, 12, 40, 2, "sheet units: leader length of a pin"),
 ("maxShown", 6, 1, 12, 1, "label budget per frame (R7: <= 6 near a move)"),
 ("pinLift", 4, 0, 20, 1, "world units: a pin's anchor above its mark"),
 ("resultSize", 30, 28, 44, 1, "sheet units: result pins (floor 28)"),
 ("hookSize", 36, 28, 56, 1, "sheet units: the 'AI' label on the belief outline"),
 ("ledgerSize", 34, 28, 44, 1, "sheet units: the counted-in number in the ledger (must-read)"),
 ("honestSize", 16, 14, 24, 1, "sheet units: the honest-limits line on stage (secondary)"),
 ("honestY", 398, 380, 414, 1, "sheet y of the honest-limits line (keep above the caption band, y < 420)"),
 ("plate", 0.72, 0, 1, 0.02, "0-1: opacity of the dark plate behind a pin"),
 ("dispAdv", 0.5, 0.4, 0.62, 0.01, "em: average advance of the display face, for label boxes"),
]

CAPS = [
 (0.6, 5.4, "Everyone says AI makes everyone faster."), (5.8, 11.6, "Faster at what, and for whom?"),
 (12.4, 21.6, "A support desk gave an AI assistant to its agents."), (22.0, 25.8, "5,179 agents. One box is one agent."),
 (26.0, 33.6, "On average: +14 % issues resolved per hour."), (34.0, 43.8, "Same 5,179 boxes, sorted by skill."),
 (46.6, 49.4, "Lowest-skill fifth: +34 %."), (49.6, 53.4, "Highest-skill fifth: about 0."),
 (53.6, 59.6, "The 14 % was a big gain and a flat line, averaged."), (60.4, 67.6, "Follow one new agent through the split."),
 (68.2, 75.6, "Inside the average, her gain was large."), (76.2, 83.8, "Another test: developers with a coding assistant."),
 (84.0, 87.8, "4,867 developers in three field trials."), (88.0, 95.4, "Pooled: they finished 26 % more tasks."),
 (95.6, 101.4, "Newer hires gained more than veterans."), (102.0, 104.8, "16 experienced developers, on code they know."),
 (105.0, 110.8, "246 real issues; AI allowed or banned at random."), (111.0, 115.8, "They forecast AI would cut their time by 24 %."),
 (116.0, 124.0, "Same issues, now timed with a stopwatch."), (126.0, 128.8, "Measured: 19 % slower."),
 (129.0, 134.8, "Afterwards they still believed 20 % faster."), (135.4, 141.6, "Before you roll AI out, split the gain by experience."),
 (142.2, 149.6, "Ask: average gain, or gain for whom?"),
]
HONEST = "Three studies, earlier tools, different tasks: a pattern, not a law."

def main():
    cam = json.loads(subprocess.check_output(["node", os.path.join(HERE, "camknobs.mjs")], text=True))
    knobs, docs = {}, []
    for n, v, lo, hi, st, what in KNOBS:
        assert lo <= v <= hi, n
        knobs[n] = v; docs.append({"name": n, "range": [lo, hi], "step": st, "what": what})
    for d in cam["knob_docs"] if "knob_docs" in cam else cam["knobs_doc"]:
        docs.append(d)
    knobs.update(cam["knobs"])
    claims = json.load(open(os.path.join(HERE, "..", "claims.json")))
    params = {c["id"]: c["value"] for c in claims["claims"] if (c.get("onscreen") or c["id"] in ("nMid", "midGain")) and not isinstance(c["value"], list)}
    params["quintiles"] = 5
    film = {
     "id": "who-gains", "title": "Who gains?",
     "eyebrow": "CETI · a data film · AI at work, three field studies",
     "lede": "AI makes everyone faster, says the average. A support floor of 5,179 agents, sorted by skill, shows the same tool lifting the least skilled fifth by 34 % and the most skilled by about nothing; a close-up on 16 experienced developers shows a forecast of 24 % less time against 19 % more.",
     "format": "feature-long", "level": "manager", "renderer": "webgl", "dur": 153, "seed": 23,
     "look": {"brand": "ceti-neosage-dark", "chrome": "none", "material": "ink"},
     "params": params, "knobs": knobs, "knobs_doc": docs, "commit": {"enabled": False}, "count": {"at": 22.0},
     "chapters": [
      {"id": "hook", "beat": "HOOK", "t0": 0, "t1": 12, "eyebrow": "HOOK", "title": "Faster for everyone"},
      {"id": "case", "beat": "CASE", "t0": 12, "t1": 60, "eyebrow": "CASE", "title": "A support floor, pooled and sorted"},
      {"id": "count", "beat": "COUNT", "t0": 60, "t1": 135, "eyebrow": "COUNT", "title": "Developers, and one desk"},
      {"id": "monday", "beat": "MONDAY", "t0": 135, "t1": 150, "eyebrow": "MONDAY", "title": "Gain for whom?"}],
     "captions": [[a, b, c] for a, b, c in CAPS],
     "brand": {"takeaway": "Averages hide who gains. Split by experience first."},
     "sources": [[k, v] for k, v in claims["sources"].items()],
     "honest": [HONEST],
    }
    path = os.path.join(HERE, "..", "film.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(film, f, ensure_ascii=False, separators=(",", ":"))
    print("film.json %d bytes, %d knobs (%d camera)" % (os.path.getsize(path), len(knobs), len(cam["knobs"])))

if __name__ == "__main__":
    main()
