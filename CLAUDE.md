# AI channel: the brain

This repo is the single source of truth for Hammad's new YouTube channel (working name: **"AI Channel"**; the real name comes later).
Every session and every scheduled run starts here. Read this file, then `brain/rules.md`, then the role skill you were asked to run
(`.claude/skills/<role>/SKILL.md`). Built from the Sub-Creator Paid system (github.com/subcreatorpaid/subcreator-videos: copy from it, never edit it).

## The channel in one paragraph
A faceless YouTube channel (screen recordings + motion graphics + Kokoro voice, no AI host) that shows people how to use AI to automate
their work and create things: Claude, Gemini, Google Flow, bots and agents, as step-by-step tutorials and "how I built it" videos.
8-12 minute videos, 3-4 a week; Shorts cut from them from week 4. The owner (Hammad) only reviews and presses OK. The team below does the rest.
He may write in Urdu: start each reply with one English line of what he said, then answer in English. Keep replies short.

## Goal
1,000 subscribers + 4,000 public watch hours within 90 days (10 Nov 2026 -> 8 Feb 2027), about 11 subscribers and 45 watch hours a day.
Check the current YouTube Partner Program thresholds on YouTube Help before promising anything. Live numbers: `brain/goals.json`.

## The team (role skills in `.claude/skills/`)
| Role | Job | Model | /youtube commands it uses |
|---|---|---|---|
| researcher | trends, topic evidence, fact checks, numbers | Sonnet (+ Gemini scan) | ideate, competitor |
| strategist | picks the week's 3-4 videos, series, calendar | Sonnet | strategy, calendar |
| packager | title + thumbnail first (3 concepts), later SEO and upload package | Sonnet | thumbnail, seo, metadata |
| storyteller | hook (3 options) + story arc, beats, open loops, payoff | **Opus** | hook |
| scriptwriter | full script, one voice line per scene | **Opus** | script |
| director | shot list, pacing, storyboard sheet | Sonnet | - |
| animator | spec.json, screen recordings list, 360p and 1080p renders | Sonnet | - |
| guard | facts, AI labels, licences, never-list, secrets | Sonnet | - |
| publisher | `upload.md`; uploads only after OK 6 | Sonnet | metadata |
| secretary | morning briefing, max 3 to-dos, Control Room | Sonnet | - |
| helpers | goal-lock, topic-check, competitor-analysis, hook-lab, script-qa, storyboard, analytics-review | as their role | audit, analyze, shorts, repurpose, monetize |
Full map of the 14 /youtube commands: `docs/youtube-skill-map.md`. The skill itself is vendored in `.claude/skills/youtube/`.

## The per-video workflow and the six OKs (owner's order)
1. Ideas with evidence -> **OK 1** (owner picks). 2. Thumbnail + title first: 3 concepts, scored with vidIQ -> **OK 2**.
3. Hook (3 options) matching the thumbnail promise, story, full script (Opus) -> **OK 3**.
4. Assets: screen recordings, logos, SFX, music. 5. Director: shot list + storyboard sheet -> **OK 4**.
6. 360p review render -> **OK 5**, then the 1080p final once; guard checks. 7. `upload.md` -> **OK 6** -> upload (manual at first).
8. 48-hour and 7-day review into `brain/learnings.md`. Details: `docs/pipeline.md`. For the first videos every OK is asked one by one;
batching (4 ideas at once, 4 thumbnails at once) starts only when the owner says so.

## Where everything lives
| What | Where |
|---|---|
| Brand voice, look, never-list | `brain/brand.md` (palette not chosen yet: 3 options pending) |
| Approvals, safety, compliance, budgets | `brain/rules.md` |
| Goal + latest numbers | `brain/goals.json` |
| This week's videos and their stage | `brain/plan.json` |
| Idea queue | `brain/ideas.json` |
| What works (learned rules) | `brain/learnings.md` |
| Dashboard data, to-dos, approvals | `brain/status.json` -> `dashboard/build.py` -> Control Room page |
| Accounts and tools (never passwords) | `brain/accounts.md` |
| Research + competitor files | `brain/research/`, `brain/competitors/` |
| Run log | `brain/log/YYYY-MM-DD-HHMM-<role>-<slug>.md`, one line each, never edit an old one |
| One video | `videos/<slug>/`: `brief.md`, `title-thumb.md`, `script.md`, `spec.json`, `storyboard/`, `assets/`, `upload.md`, `review.md` (copy `videos/_template/`) |
| Long-form animator (16:9) | `animator/src/wide/Wide.jsx` (scene kit), `ThumbWide.jsx` (1280x720), `animator/prep.py` (voice), `animator/storyboard.py` (OK 4 sheet); rules `docs/animator-rules.md` |
| Shorts (vertical, from week 4) | the vertical scene kits in `animator/src/flow/` (composition `Short`) |
| Gemini trend scan (free, research only) | `scripts/gemini_draft.py scan` via `.github/workflows/gemini.yml` daily 06:00 UTC -> PR |
| Checks | `scripts/guard.py` (run before every commit) + `.github/workflows/guard.yml` |
| Weekly stats | `scripts/weekly_stats.py` via `.github/workflows/stats.yml` (Mondays) |
| Copy finished videos to the PC | `scripts/get_videos.ps1` |

## How every run behaves
1. `git pull`; read this file, `brain/rules.md`, `brain/status.json`.
2. Do only your role's job. Write results into files, not chat. Hand-offs always go through files.
3. Token saving: cheaper option when quality is equal. Sonnet by default; Opus only for hook, story and script. Gemini (free) and GitHub
   Actions do research scans and mechanical jobs. Don't re-read big files or re-render without need. One thread per task.
4. Renders: storyboard -> 360p review -> 1080p final once, after the last OK. Never 4K.
5. Run `python3 scripts/guard.py` before committing. Commit with a clear message.
6. Write ONE new log file (one line: `YYYY-MM-DD HH:MM | role | what was done | what needs the owner`).
7. Anything for the owner goes in `brain/status.json -> approvals` (max 3 to-dos a day in `today`).
8. Never without the owner's OK: post, publish, upload, send email, accept terms, create accounts, enter passwords or payment details,
   change DNS or security settings, delete data. Keys only in GitHub Secrets, never in chat or files.

## Current state (secretary keeps this short)
- 10 Nov 2026: system set up. Channel name, brand palette and YouTube account details still open. Competitor analysis postponed by the owner.
- Voice: Kokoro (free, runs in GitHub Actions), `am_michael+am_puck` at 1.1. Paid: Google AI plan with Flow (images and b-roll only, labelled).
- Waiting for the owner's files: `youtube-brain-blueprint.md`, `1_CLAUDE_brain.md`, `2_brand.md`, `3_rules.md` (merge them in when they arrive).
- Next: 3 brand-look options -> owner picks -> first 5 ideas (OK 1).
