# Friction log · atelier-variant, wiring-and-the-whole, light-teal-barlow

1. Base pack is ambiguous (SKILL.md step 1 and Typed slots; tweak-recipes.md "Where a film-local pack lives"). film.json
   look.brand says "midnight-ink" (the library id, Cormorant italic disp) but the page was built from the film-local
   brand.midnight-ink.json (Newsreader disp). The skill never says to base a variant on the pack the page was really built
   with, nor how to tell. Deriving from the id would have given an italic-only disp that build.py refuses. The existing page
   name (...midnight-ink.none.html) also hides which pack it came from; recipes warn that a film-local pack should not share a
   library id, and this film does.
2. Contact-sheet times (SKILL.md step 3). "0.4, 0.69, 0.75 on a 75 s case" is an example only: nothing says where to find a
   film's reveal. I read NOTES.md "Film" and film.src.js:316 (stamp at 43.2 s) to pick 0.39. And the recipe's "card at
   0.98" is wrong here: 0.98 of 115 s is 112.7 s, mid cross-fade (contact showed the MONDAY frame, not the card). I reshot at
   0.995 (114.4 s). The card start should be given as 1 - 3/dur.
3. "Light brand" and "grotesk" are unspecified in the references. brand-packs.md lists faces but has no classification, so I
   chose Barlow 600 by judgement after `tweak.py --fonts` (candidates Barlow, DM Sans, Jost, Sofia Sans). A light twin of a navy
   pack gives a cool lavender ground (#E4EDFF) under warm ink; the recipes have no step to neutralise the ground (`--mono`
   then `--accent` would, but costs accent2); I did not try it.
4. Gate invocation differs: SKILL.md step 2 uses `--kit factory/kit2`; tweak-recipes.md uses `--kit kit2.js --kit player.js`.
   I used the SKILL form and it worked.
5. Record layout: the page lives in factory/films/<id>/build/, not in the record dir, and report.json keeps absolute paths
   to the stills the skill says to delete. The skill does not say whether to copy the page into the record.
6. The derived pack's `name` inherits the base's long note about Newsreader and Cormorant plus the bracket, and the id is
   a derived id, not a client id (recipes say to edit by hand; the skill step does not). Left as derived.
7. Promotion criteria for step 5 are not given; I judged "no" (client-specific).
8. Process slip: I ran `git status` once (one line, read-only) before noticing the no-git rule; the environment said not a repo.
