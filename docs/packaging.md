# Packaging: titles and thumbnails (OK 2)

The thumbnail and title are made BEFORE the script. They make one promise; the hook confirms it; the video pays it off.

## Titles (packager, with `/youtube seo` and `/youtube thumbnail`)
- 3-5 options, under 60 characters, the target keyword near the front, a clear outcome or curiosity gap. Mark the favourite.
- Patterns that suit this channel (from the research, rotate them): "Why <thing> <does Y> at night", "How <city/company> <keeps X running>",
  "The <N> AM Shift That Keeps <X> Alive", "Everything <workers> Get for Free", "The Mistake That <changed X>", "<news event> Explained Like You're 5".
  Hidden place, job or process + mistake / secret / why it works / nobody sees.
- Never promise what the video can't show. No all-caps titles, no fake numbers.

## Thumbnails (3 concepts, `animator/src/wide/ThumbWide.jsx`, video.yml mode `thumbs`)
- Main style (`layout: "word"`): ONE ALL-CAPS word of 3-12 letters, white with a dark outline, at the top; 1-2 expressive worker caricatures;
  one prop that shows the twist (a clock at 3 AM, a mountain of trash, a red warning light); night blue against warm orange.
- The word never repeats the title. The illustration is made for the thumbnail (its own Flow image), not a video frame.
- Readable in one second at phone size: check `thumbs/conceptN_phone.png` (320x180).
- Score each concept with vidIQ (`vidiq_score_thumbnail`, `vidiq_score_title`) when credits allow; note scores in `title-thumb.md`.
- After upload: YouTube's thumbnail test (up to 3) when available; review CTR at 48 hours.
