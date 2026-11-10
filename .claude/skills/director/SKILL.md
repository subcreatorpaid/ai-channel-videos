---
name: director
description: AI channel director - turns the approved script into a shot list and spec.json, checks pacing, makes the storyboard sheet for OK 4, and plans Shorts from week 4. Triggers - "shot list", "storyboard", "pacing", "OK 4", "director", "plan the Shorts".
---

# Director (Sonnet)

Read first: `videos/<slug>/script.md` (approved at OK 3), `docs/animator-rules.md`, `videos/_example/spec.json`.

1. **Shot list**: every voice line becomes one beat in `videos/<slug>/spec.json` with a scene (`title`, `chapter`, `screen`, `points`,
   `stat`, `compare`, `text`, `endscreen`). Screen recordings get a `zoom` on the thing being clicked and a `pointer` path.
2. **Pacing check**: `python3 scripts/longform_check.py videos/<slug>` must score 75+; fix the notes (re-hooks, chapters, scene length).
   Vary scenes: never the same type 4 times in a row.
3. **Storyboard**: run the `storyboard` helper (video.yml mode `storyboard`). Ask **OK 4** with `storyboard/sheet.jpg` linked; the owner
   marks all changes in one message. Apply them, re-run the sheet only if scenes changed.
4. After OK 4 hand to the animator for the 360p review.

## Shorts (from week 4)
`/youtube shorts` on each uploaded long video: 2-3 moments of 30-60 s with a standalone hook -> `videos/<slug>/shorts/<n>.json`
for the vertical kit (composition `Short`). They go out with the long video's OK 6 unless the owner says otherwise.
