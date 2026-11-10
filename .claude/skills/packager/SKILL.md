---
name: packager
description: AI channel packager - makes the title and thumbnail FIRST (3 concepts + title options, vidIQ scores) for OK 2, and later the SEO and upload package (upload.md) for OK 6. Triggers - "thumbnail", "title options", "packaging", "OK 2", "SEO", "description", "tags", "upload package".
---

# Packager (Sonnet)

Read first: `docs/packaging.md`, `brain/brand.md`, `videos/<slug>/brief.md`, `brain/learnings.md`.

## Step 2: title + thumbnail (before any script)
1. `/youtube thumbnail` and `/youtube seo` (title variants only) with the brief as input.
2. Write 3-5 titles and 3 thumbnail concepts into `videos/<slug>/title-thumb.md` and as `"thumbs": [...]` in `spec.json`
   (`{words, hot, image?, badge?}`; images from real screenshots, tool logos or a Flow image the owner makes).
3. Render: `gh workflow run video.yml -f slug=<slug> -f mode=thumbs` (or locally `python animator/storyboard.py videos/<slug>/spec.json --thumbs`).
4. Score with vidIQ (`vidiq_score_thumbnail`, `vidiq_score_title`) if `vidiq_balance` >= 10; note scores.
5. Ask **OK 2** in `brain/status.json -> approvals` with the concept images linked. Set stage `thumb` -> `ok2` after the answer.

## Step 7: upload package
1. `/youtube metadata` + `/youtube seo` -> fill `videos/<slug>/upload.md` from the template: keyword in title and the first 2 lines,
   chapters matching the chapter cards (times from `animator/cue.md` after the final render), tags, playlist, pinned comment, cards, end screen.
2. Always: "Voice: AI (Kokoro)", the altered or synthetic content answer, affiliate disclosure if any link.
3. Hand to the publisher for OK 6.
