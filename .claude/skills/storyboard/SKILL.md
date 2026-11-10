---
name: storyboard
description: Makes the storyboard sheet for OK 4 - one still per scene with its voice line - from videos/<slug>/spec.json, locally or on GitHub Actions. Triggers - "storyboard", "storyboard sheet", "stills", "OK 4 sheet".
---

# Storyboard (Sonnet, mechanical)

1. `python3 scripts/longform_check.py videos/<slug>` (fix if under 75).
2. Render the sheet:
   - GitHub (default, no local setup): `gh workflow run video.yml -f slug=<slug> -f mode=storyboard`; it commits `videos/<slug>/storyboard/`
     (`sheet.jpg`, one still per scene, `storyboard.md`).
   - Local: `cd animator && npm ci` once, then `python storyboard.py ../videos/<slug>/spec.json`
     (set `REMOTION_BROWSER` to a local Chrome if Remotion can't download one).
3. Look at `sheet.jpg` yourself first: text cut off, empty placeholders (missing illustrations), repeated scenes. Fix and re-run once.
4. Ask **OK 4** with the sheet; the owner marks all changes in one message. Stage `storyboard` -> `ok4`.
Timings are estimated (2.7 words/s), so the stills are for layout and order, not exact timing.
