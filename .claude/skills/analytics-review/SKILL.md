---
name: analytics-review
description: AI channel analytics review - 48-hour and 7-day review of each upload (CTR, average view duration, retention drops, traffic sources), monthly audit, and writing what works into brain/learnings.md (uses /youtube analyze and /youtube audit). Triggers - "how did the video do", "48 hour review", "analytics", "why are views low", "audit the channel".
---

# Analytics review (Sonnet)

## 48 hours and 7 days after each upload
1. Numbers: vidIQ (`vidiq_video_stats`, `vidiq_channel_analytics` once the channel is connected) or the owner's YouTube Studio screenshots
   (impressions CTR, average view duration and %, retention graph, traffic sources, subscribers gained). Never estimate; blanks stay blank.
2. `/youtube analyze` with those numbers -> diagnosis: packaging problem (low CTR), hook problem (big drop in the first 30 s),
   middle sag (drop at a chapter), or reach problem (good CTR + AVD, low impressions).
3. Fill `videos/<slug>/review.md`; one or two rules into `brain/learnings.md` (date | rule | evidence). Update `brain/goals.json -> latest`.
4. Suggest one fix the owner can OK (new thumbnail from the other concepts, new title) - changes to a live video need the owner's OK.

## Monthly (after 10+ videos)
`/youtube audit` -> `brain/research/<date>-audit.md`, top 3 actions for the strategist.
