---
name: script-qa
description: Script QA for the AI channel - checks a long-form script before OK 3 for promise match, retention (re-hooks, open loops), length, keyword, facts, voice and never-list. Triggers - "script qa", "check the script", "review my script", "is the script ready".
---

# Script QA (Sonnet)

Check `videos/<slug>/script.md` and return a pass/fix list (fix it in place when you wrote the script):
1. **Promise**: hook sentence 1 = the chosen title/thumbnail promise; the payoff is shown on screen before the ending.
2. **Length**: words / 2.7 = 8-12 min. **Keyword** spoken in the first 30 s.
3. **Retention** (`.claude/skills/youtube/references/retention-scripting-guide.md`): a re-hook or open loop every ~90 s; every loop opened is closed;
   no section longer than ~2 min without a visual change; chapters 3-5 with clear names.
4. **Facts**: every price, limit, feature or number has a source + date or a `[CHECK]`; no invented results or quotes.
5. **Voice**: for the ear, short sentences, "you"; nothing from the never-list in `brain/brand.md`; no "smash like".
6. **Visuals**: a `[VISUAL: ...]` every 2-3 sentences; every needed screen recording listed.
7. **Ending**: one-line recap, "watch this next", subscribe in one sentence, about 20 s.
Output: `PASS` or a numbered fix list. Never pass a script with unresolved promise or fact problems.
