/* factory/kit2/commit-off.js · D11: the commit beat is optional and off by default. build.py inlines this file
   only for a film whose film.json has no `commit`, `commit: null` or `commit.enabled: false`, so the pages of
   films that keep the beat (every film shipped before 2026-10-10) rebuild byte-identical: kit2.js and player.js
   are not edited. Three steps, at three places in the page:
     1. here, after FILM and before kit2.js: FILM.commit and FILM.tryit read as absent, so kit2.js sets no
        film-mode default (state.answer stays null) and player.js sets no hold, no rail, no overlay, no try-it pane;
     2. KIT2_COMMIT_OFF.kit(KIT), after kit2.js: K.commitBox draws nothing (no box, no countdown ring, no stamp)
        and K.commitGeom stays null, so a film.js that still calls it is harmless;
     3. KIT2_COMMIT_OFF.page(), after player.js: FILM.commit and FILM.tryit are put back as authored,
        window.__film.info.commit = {enabled: false}, and the commit overlay, the rail and the try-it section leave
        the DOM. The film plays straight through. */
(function () {
'use strict';
const F = window.FILM, had = { commit: F.commit, tryit: F.tryit };
F.commit = null; F.tryit = null;
window.KIT2_COMMIT_OFF = {
  enabled: false,
  kit(K) { K.commitBox = () => ({ op: 0, sealed: false, off: true }); K.commitGeom = null; },
  page() {
    F.commit = had.commit; F.tryit = had.tryit;
    if (window.__film && window.__film.info) window.__film.info.commit = { enabled: false };
    ['ask', 'rail', 'try'].forEach((id) => { const e = document.getElementById(id); if (e) e.remove(); });
  },
};
})();
