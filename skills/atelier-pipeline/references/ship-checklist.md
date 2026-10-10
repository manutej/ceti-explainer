# Ship checklist (orchestrator)

1. Final gate PASS on the working film (the last apply_findings run wrote gate.json and frames/).
2. Director seat: read the thumbs at the beat boundaries and the reveal; write seat.json
   {id, verdict SHIP|REVISE, seat, truth[], craft, originality, stop, legibility_phone, format{}, defects[], note}.
   Defects that need film.js are listed with severity and left; they are not fixed in this run.
3. NOTES.md: what the working film is (promoted from which draft), rounds applied, what stayed beyond scope.
4. PROTOTYPE.md (or MEASURES.md for non-prototype films): the table

   | stage | agent | wall | tokens | result |

   one row per lane from the task notifications, a total row, page bytes, gate verdict and WARN rows, s/frame, and
   the success criteria of the brief answered yes/no.
5. `python3 factory/tools/catalogue.py` (records the page hash); `sh scripts/doctor.sh`; `sh tests/proofs.sh all`.
6. Publish build/<page> as a private artifact (icon film, title = film title); add the link to factory/ARTIFACTS.md;
   `python3 factory/tools/gallery.py` and republish factory/gallery.html to the gallery URL in ARTIFACTS.md ("Gallery:").
7. Commit per lane as it lands, then the ship commit. Message pattern (first line ≤ 110 chars, body optional):

   ```
   <film id>: <what landed in one clause>; gate <verdict>, <n> knobs | <n> findings applied
   ```
   End with the attribution trailers the session requires. Never a model identifier in the repository.
8. `git push -u origin <branch>` (retry 2 s, 4 s, 8 s, 16 s on network errors). Update the open PR body if the
   change adds a capability; never open a second PR for the same branch.
9. Hand back to the user: link, winner and why, findings per round, cost, beyond-scope list.
