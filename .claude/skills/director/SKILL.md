---
name: director
description: Night Shift channel director - turns the approved script into a shot list of illustrated scenes and spec.json, checks pacing, makes the storyboard sheet for OK 4, and plans Shorts from week 4. Triggers - "shot list", "storyboard", "pacing", "OK 4", "director", "plan the Shorts".
---

# Director (Sonnet)

Read first: `videos/<slug>/script.md` (approved at OK 3), `docs/animator-rules.md`, `videos/_example/spec.json`.

1. **Shot list**: every voice line becomes one beat in `videos/<slug>/spec.json`. Story scenes: `dateline` (cold open), `illus` (illustration
   with a slow camera move: in, out, left, right, up), `titlecard` (one key term on black), `dialogue` (a worker's voiced line in a bubble;
   set the beat's `voice`). Info scenes when a number or list carries the line: `stat`, `points`, `compare`, `text`. `chapter` card per act,
   `endscreen` last.
2. **Pacing**: a new image or camera move at least every 20 s on average; one `titlecard` or `text` turn every 60-90 s; never the same scene
   type 4 times in a row. `python3 scripts/longform_check.py videos/<slug>` must score 75+.
3. **Illustration list** for the animator: one line per image (scene, characters from the sheet, props, time of night, camera move).
4. **Storyboard**: run the `storyboard` helper (video.yml mode `storyboard`). Ask **OK 4** with `storyboard/sheet.jpg`; the owner marks all
   changes in one message. Apply them; re-run the sheet only if scenes changed. After OK 4 hand to the animator for the 360p review.

## Shorts (from week 4)
`/youtube shorts` on each uploaded long video: the best twist as a 30-60 s vertical with its own cold open -> `videos/<slug>/shorts/<n>.json`
(composition `Short`, 1080x1920, reuse the video's illustrations re-framed). They go out with the long video's OK 6 unless the owner says otherwise.
