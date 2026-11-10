---
name: topic-check
description: Quick evidence check on a single video topic for the AI channel - demand, competition, freshness, and whether we can demo it - before it goes on the OK 1 list. Triggers - "topic check", "is this topic good", "check this idea", "any demand for".
---

# Topic check (Sonnet, cheap)

For one topic, write 6 lines into the idea's `evidence` in `brain/ideas.json` (or reply with them when asked directly):
1. **Keyword**: the one phrase people search; vidIQ `vidiq_keyword_research` volume + competition (or "no data").
2. **Outliers**: 1-3 videos on it from the last 90 days with views well above their channel's average (`vidiq_outliers` / `vidiq_youtube_search`).
3. **Gap**: what those videos miss (outdated, no real demo, too long, beginner steps skipped).
4. **Fresh**: is the tool or feature current? (official page date; flag if it changed in the last 30 days).
5. **Demo**: can we show it working with what we have (free tiers, owner's Google AI plan)? What must be recorded?
6. **Verdict**: pass / weak / fail + one reason.
Fail = no demand and no outliers, cannot be demoed, or breaks a tool's terms. Spend at most 3 vidIQ credits per topic.
