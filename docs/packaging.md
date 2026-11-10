# Packaging: titles and thumbnails (OK 2)

The thumbnail and title are made BEFORE the script. They make one promise; the hook confirms it; the video pays it off.

## Titles (packager, with `/youtube seo` and `/youtube thumbnail`)
- 3-5 options, under 60 characters, the target keyword near the front, a clear outcome or curiosity gap. Mark the favourite.
- Patterns that suit this channel: "How I <built X> with <tool>", "I let <AI> do <task> for <N> days", "<Tool A> vs <Tool B> for <job>",
  "Automate <task> in <N> minutes (no code)", "The <N> <tool> features nobody uses".
- Never promise what the video can't show. No all-caps titles, no fake numbers.

## Thumbnails (3 concepts, `animator/src/wide/ThumbWide.jsx`, video.yml mode `thumbs`)
- 2-4 big words that do NOT repeat the title; one highlighted word (`hot`); one focal image (real screenshot, tool logo, or a Flow image).
- Readable at phone size: check `thumbs/conceptN_phone.png` (320x180).
- High contrast, one accent, faces optional later (faceless channel: hands, screens, objects, result screenshots work).
- Score each concept with vidIQ (`vidiq_score_thumbnail`, `vidiq_score_title`) when credits allow; note scores in `title-thumb.md`.
- After upload: YouTube's thumbnail test (up to 3) when available; review CTR at 48 hours.
