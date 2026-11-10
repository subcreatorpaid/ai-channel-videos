---
name: hook-lab
description: Hook lab for the Night Shift channel (Opus) - generates and scores cold-open hooks (time and place, staggering fact, ironic reversal, "This is the story of...") that confirm the thumbnail and title promise (uses /youtube hook). Triggers - "hook lab", "better hook", "first 30 seconds", "intro", "cold open", "hook options".
---

# Hook lab (Claude Opus)

Input: the chosen title + thumbnail (`title-thumb.md`), the brief, `sources.md`.
1. Run `/youtube hook` for 5 variants, then rewrite each into the channel's cold-open formula (about 75 words, 0-30 s):
   **time and place** ("3:12 AM, beneath Manhattan") -> **staggering fact** (sourced number) -> **ironic reversal** -> **"This is the story of..."** + the paradox.
2. Score 1-5 each: **promise match** (the title/thumbnail promise is in the first 15 s), **specific** (a sourced number, a place, a time),
   **drawable** (the first 5 s as one illustrated scene), **loop** (a reason to stay to the end), **honest** (the video pays it off).
3. Keep the top 3 (18+ of 25) for OK 3, each with its score and the opening scene described for the illustrator.
Rules: no "welcome back", no channel name, no "in this video"; 8-11 word sentences; never a promise the video can't pay off.
