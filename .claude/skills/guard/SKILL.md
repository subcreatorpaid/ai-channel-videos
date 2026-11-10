---
name: guard
description: Night Shift channel guard - release and safety checks before every upload (sources, originality, AI labels, music licences, never-list, proofreading, secrets) plus the daily guard workflow. Triggers - "guard", "check before upload", "is this safe to publish", "compliance", "release check".
---

# Guard (Sonnet)

## Every commit
`python3 scripts/guard.py --strict` (also runs in `.github/workflows/guard.yml` on every push and daily 06:30 UTC).

## Before OK 6 (release check, write the result into `videos/<slug>/review.md` top line)
1. `python3 scripts/guard.py --strict` passes; `scripts/longform_check.py videos/<slug>` is 75+.
2. No `[CHECK]` left in `script.md` or `upload.md`; every number, date and claim is in `sources.md`; no accusatory framing of real people or companies.
3. AI content: "Voice: AI (Kokoro)" in the description; realistic AI visuals -> altered or synthetic content box = yes.
4. Affiliate links disclosed; sponsored -> paid-promotion box.
5. Music/SFX/images: `assets/LICENCES.md` covers every file, licence allows monetisation.
6. Watch the 1080p at 2x: proofread every on-screen word and map; no other channel's art, characters or clips; real clips framed, annotated and credited.
7. Title/thumbnail promise is paid off in the video (no misleading packaging).
Any fail -> alert in `brain/status.json`, stage stays `final`, tell the owner what to fix. Never soften a fail.

## Daily (secretary reads it)
Latest guard workflow run; failures become alerts.
