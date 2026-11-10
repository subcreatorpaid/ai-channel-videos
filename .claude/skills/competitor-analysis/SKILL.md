---
name: competitor-analysis
description: AI channel competitor analysis - finds about 10 channels in the AI automation niche with vidIQ and studies their top videos, formats, titles, thumbnails and gaps (uses /youtube competitor). Postponed by the owner on 10 Nov 2026; run only when asked. Triggers - "competitor analysis", "competitors", "channel study", "who else does this".
---

# Competitor analysis (Sonnet) - postponed (owner, 10 Nov 2026): run only when the owner asks

1. Competitors: owner's list if given, else 10 from vidIQ (`vidiq_similar_channels`, `vidiq_channel_search` for "Claude automation",
   "AI agents tutorial", "Gemini tutorial", "AI workflow"); mix sizes (2 big, 4 mid, 4 small but fast-growing). Save with `vidiq_update_competitors`.
2. Per channel (`vidiq_channel_stats`, `vidiq_channel_videos`): upload rate, typical length, top 5 videos of the last 90 days, title patterns,
   thumbnail style, hook style (transcript of 2 top videos via `vidiq_video_transcript`, first 60 s only).
3. Run `/youtube competitor` for keyword, format and audience gaps.
4. Write `brain/competitors/<date>-study.md`: table of channels, what works, 5 gaps we can own, 10 idea seeds -> `brain/ideas.json`.
Learn formats, never copy scripts, thumbnails or branding. Budget: max 20 vidIQ credits per study.
