---
name: hook-lab
description: Hook lab for the AI channel (Opus) - generates and scores hook options for the first 30 seconds so they confirm the thumbnail and title promise (uses /youtube hook). Triggers - "hook lab", "better hook", "first 30 seconds", "intro", "hook options".
---

# Hook lab (Claude Opus)

Input: the chosen title + thumbnail (`title-thumb.md`), the brief, the story arc if written.
1. Run `/youtube hook` for 5 variants (curiosity gap, result first, problem-agitation, story, contrarian).
2. Rewrite each in our voice and score 1-5 on: **promise match** (first sentence = the title/thumbnail promise), **specific**
   (a number, a tool, a result), **visual** (what is on screen in the first 5 s), **loop** (a reason to keep watching), **honest**.
3. Keep the top 3 (score 18+ of 25) for OK 3 with the score and the first-5-seconds visual for each.
Rules: no greeting, no channel name, no "in this video I will"; under 30 s; never a promise the video can't pay off.
