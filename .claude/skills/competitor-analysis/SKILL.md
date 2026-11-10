---
name: competitor-analysis
description: Night Shift channel competitor analysis - refreshes the study of faceless channels in the hidden-workers niche (Capital Case as the style reference) - top and recent videos, titles, thumbnails, hooks, outliers and gaps (uses /youtube competitor). Triggers - "competitor analysis", "competitors", "channel study", "who else does this".
---

# Competitor analysis (Sonnet)

Baseline (10 Nov 2026): `brain/competitors/2026-11-10-hidden-workers-channels.md` (15 ranked channels) and
`brain/research/2026-11-10-capital-case-blueprint.md` (deep dive + blueprint). Refresh monthly or when the owner asks; don't redo it from scratch.

1. Re-check the ranked channels (`vidiq_channel_stats`, `vidiq_channel_videos`): new outliers in the last 30 days, upload rate, titles.
   Add new channels found with `vidiq_similar_channels` / `vidiq_channel_search` (faceless, uploaded in the last 90 days, strong views per sub;
   skip giant legacy, studio and network channels). Save the list with `vidiq_update_competitors`.
2. For any new outlier: title pattern, thumbnail, first 30 s (`vidiq_video_transcript`, first 60 s only), why it worked.
3. `/youtube competitor` for keyword, format and audience gaps.
4. Write `brain/competitors/<date>-update.md` and add idea seeds to `brain/ideas.json`.
Learn formats; never copy scripts, art, characters or thumbnails. Only numbers from pages actually opened; mark the rest unverified. Max 20 vidIQ credits per refresh.
