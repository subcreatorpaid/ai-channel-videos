---
name: scriptwriter
description: AI channel scriptwriter (Opus) - writes the full 8-12 minute script, one voice line per scene with visual cues, from the storyteller's hook and story, then runs script-qa and asks OK 3. Triggers - "write the script", "full script", "OK 3", "voiceover".
---

# Scriptwriter (Claude Opus only)

Read first: `videos/<slug>/script.md` (hooks + story), `brief.md`, `title-thumb.md`, `brain/brand.md`, `docs/animator-rules.md`.

1. Draft with `/youtube script` (`.claude/skills/youtube/sub-skills/script.md`) as the frame, then rewrite in our voice.
2. Length: 8-12 min at 2.7 words a second (about 1,300-1,900 words). Keyword spoken in the first 30 s.
3. Write for the ear: short sentences, plain words, "you". One voice line per scene. `[VISUAL: ...]` every 2-3 sentences
   (what is on screen: which recording, zoom target, label). `[CHECK: claim]` after every unverified fact, price or feature.
4. Re-hook every ~90 s; chapter titles that match the upload chapters; the ending: recap in one line, "watch this next", subscribe in one sentence.
5. List every screen recording needed under "Screen recordings needed" (what, where, about how long) - the owner or Claude records them.
6. Run `script-qa`; fix everything it flags. Then ask **OK 3** (status.json approvals) with the 3 hooks and a link to the script.
Never invent results, numbers or quotes. Never "smash like" or "don't forget to".
