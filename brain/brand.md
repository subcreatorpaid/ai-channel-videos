# Brand book (10 Nov 2026: niche set, name and palette still open)

## Identity
Working name "Night Shift" until the owner picks the real one. A faceless, illustrated YouTube channel that follows the workers and processes
people rarely see: overnight maintenance, sanitation, logistics and building operations. Model: Capital Case's graphic style (flat 2D
caricatures, title cards, one narrator), with our own characters, palette and fonts. Research: `brain/competitors/2026-11-10-hidden-workers-channels.md`,
`brain/research/2026-11-10-capital-case-blueprint.md`.
- Promise: "The night shift you never meet." Every video shows a hidden system at real scale, with one twist the viewer did not know.
- Audience: curious adults (18-54) who like "how things work", business and infrastructure stories. No prior knowledge needed.
- Topic rule: a hidden job or overnight process people rely on every day + the scale or money behind it + one counterintuitive twist
  you can say in one line. One news-peg video a month (a strike, a port jam, a blackout "explained like you're 5").
- Formats: **The shift** (follow one job through a night), **How it works** (one system: trash routes, subway rebuilds, airport nights),
  **The mistake** (a failure that changed how the system runs), **Explained** (a news event through the workers behind it).

## Voice
Calm, serious narrator with dry humour. About 150 words a minute, 8-11 words a sentence, one-word beats ("Order."). Respect for the workers:
they are the heroes, never the joke. No politics, no blame on named people or companies without a source.
**Never:** "you won't believe", "insane", "shocking" in narration, "welcome back", "smash like", templated intros, fear-bait, mocking workers,
unsourced accusations, copying another channel's script, art, music or thumbnails.

## Look (the owner picks one of three palettes; option A is the animator's default until then)
- Flat 2D illustration, our own cast: simple round-headed worker caricatures with hard hats, hi-vis, uniforms; thick dark outlines;
  no gradients on characters. Different head shape, line weight, palette and fonts from Capital Case, OverSimplified and Crayon Capital.
- Option A "Night shift": night blue `#101A2E`, panel `#1B2742`, warm paper `#F2E8D5`, safety orange `#F28C28`, sodium yellow `#FFD166`.
- Black title cards for key terms (one or two words, spaced capitals). Datelines for cold opens ("4:12 AM / Chicago, Illinois").
- Type: Inter (Black titles, ExtraBold body), monospace for datelines and labels.
- 16:9, 1920x1080, 30 fps (`animator/src/wide/Wide.jsx`). Thumbnails 1280x720 (`ThumbWide.jsx`, layout `word`).
- Art pipeline: a character sheet first (approved once), then scene illustrations made in Google Flow from that sheet and checked by hand
  for consistency; every scene is drawn for its video (no reused templates). Short real clips only if transformed (framed, annotated, under narration, credited).
- Music: YouTube Audio Library or Pixabay only, licence noted in `videos/<slug>/assets/LICENCES.md`.

## Every video
- 10-12 minutes (1,500-1,700 words), 4-5 named acts = chapters. Target keyword in the title, the first description line and the first 30 s.
- Hook (0-30 s, about 75 words): time and place, a staggering fact, an ironic reversal, then "This is the story of..." with the paradox.
- A "but here's what nobody notices" turn every 60-90 s; every act ends on a reversal; the biggest answer held back to about 70-75%.
- Each act: one short voiced worker line (character voice); one named night-shift vignette and one modern comparison per video.
- Ending: callback to the hook + a 3-6 word moral, then "Which hidden job should we follow next? We'll credit you on screen." (pinned too).
- Thumbnail: ONE big ALL-CAPS word (3-12 letters, white with a dark outline, top), 1-2 expressive worker caricatures, one prop showing
  the twist (a clock at 3 AM, a mountain of trash, a red warning light), night blue against warm orange. Readable in one second at phone size.
- Description: sources list, a short disclaimer, chapters, "Voice: AI (Kokoro)". Proofread every on-screen word (typos and map errors get called out).
