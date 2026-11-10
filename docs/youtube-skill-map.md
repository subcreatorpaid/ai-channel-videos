# How the /youtube skill fits the system

The claude-youtube skill (14 commands) is installed on the owner's PC (`~/.claude/skills/youtube`) and vendored in this repo
(`.claude/skills/youtube/`, MIT), so it works in local and cloud sessions alike. The role skills call it as a tool: its context questions are
answered by `brain/brand.md` + `brain/goals.json`, and every output is written into the role's file, never left in chat.
The brain wins where they disagree (approvals, AI labels, voice, look, budgets).

| Command | Role / helper that runs it | Step (docs/pipeline.md) | Writes to |
|---|---|---|---|
| `/youtube ideate` | researcher | 1 ideas | `brain/ideas.json` (+ evidence) |
| `/youtube competitor` | competitor-analysis (baseline done 10 Nov; monthly refresh) | 1 ideas | `brain/competitors/<date>-update.md` |
| `/youtube strategy` | strategist (once, then monthly) | planning | `brain/research/strategy.md` |
| `/youtube calendar` | strategist (weekly) | planning | `brain/plan.json` |
| `/youtube thumbnail` | packager | 2 thumbnail | `videos/<slug>/title-thumb.md` |
| `/youtube seo` | packager | 2 titles, 7 SEO | `title-thumb.md`, `upload.md` |
| `/youtube hook` | storyteller via hook-lab | 3 hook | `script.md` (hook options) |
| `/youtube script` | scriptwriter | 3 script | `script.md` |
| `/youtube metadata` | packager -> publisher | 7 upload | `upload.md` |
| `/youtube analyze` | analytics-review | 8 reviews | `videos/<slug>/review.md`, `brain/learnings.md` |
| `/youtube audit` | analytics-review (monthly, after 10+ videos) | 8 | `brain/research/<date>-audit.md` |
| `/youtube shorts` | director (from week 4) | Shorts | `videos/<slug>/shorts/` |
| `/youtube repurpose` | strategist (from week 4) | Shorts, other platforms | `videos/<slug>/repurpose.md` |
| `/youtube monetize` | strategist (when near YPP, or for affiliate plans) | money | `brain/research/monetize.md` |

Not covered by the skill, done by our own roles: director (shot list, pacing, storyboard), animator (renders), guard (checks),
secretary (briefing, dashboard). Live data order: vidIQ connector -> `/youtube` execution scripts with `YOUTUBE_API_KEY` -> web search.
The skill's DataForSEO option is not set up (optional; it costs money).
