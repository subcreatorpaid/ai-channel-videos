# Per-video pipeline (owner's order, 10 Nov 2026)

3-4 long videos a week (10-12 min), the owner's target. The research blueprint suggests 1 a week to stay clear of YouTube's
"inauthentic content" rules, so at 3-4 a week every video still needs its own sources, its own drawn scenes and a human check. Each video lives in `videos/<slug>/` (copy `videos/_template/`). Stage is tracked in `brain/plan.json`.
For the first videos every OK is asked on its own. Batching (e.g. 4 ideas or 4 thumbnails in one OK) starts only when the owner says so.

| # | Step | Role (skill) | /youtube command | Output | Gate |
|---|---|---|---|---|---|
| 1 | Ideas with evidence and a twist (5 per batch) | researcher -> strategist (topic-check, goal-lock) | `ideate`, `competitor` | `brain/ideas.json`, `videos/<slug>/brief.md`, then `sources.md` | **OK 1** owner picks |
| 2 | Thumbnail first: 3 concepts + 3-5 titles, vidIQ scores | packager | `thumbnail`, `seo` (title variants) | `title-thumb.md`, `thumbs/` (video.yml mode `thumbs`) | **OK 2** |
| 3 | Cold-open hook (3 options) matching the thumbnail; 4-5 acts, turns, held-back answer, callback ending; full script | storyteller (hook-lab) -> scriptwriter (script-qa) on **Opus** | `hook`, `script` | `script.md` | **OK 3** |
| 4 | Art: illustration prompts from the character sheet, Flow images checked by hand, SFX, music + licences | animator | - | `art-prompts.md`, `assets/`, `assets/LICENCES.md` | - |
| 5 | Shot list of illustrated scenes, pacing check, storyboard sheet (a still and a voice line per scene) | director (storyboard) | - | `spec.json`, `storyboard/sheet.jpg` (video.yml mode `storyboard`) | **OK 4** |
| 6 | 360p review render; fixes; then the 1080p final once | animator; guard | - | Releases `previews`, then `video-<slug>` (modes `review`, `final`) | **OK 5** |
| 7 | Upload package: title, description (keyword in the first 2 lines, sources, disclaimer), tags, chapters, pinned "which hidden job next?" comment, end screen, cards, AI voice line | packager -> publisher | `metadata`, `seo` | `upload.md` | **OK 6** -> upload |
| 8 | 48-hour and 7-day review: CTR, average view duration, retention, traffic sources | analytics-review | `analyze`, `audit` (monthly) | `review.md`, `brain/learnings.md` | - |
| + | From week 4: 2-3 Shorts cut from each long video | director + animator (vertical kit) | `shorts`, `repurpose` | `videos/<slug>/shorts/` | OK with the long video's upload |

Stage names in `brain/plan.json`: idea -> ok1 -> thumb -> ok2 -> script -> ok3 -> assets -> storyboard -> ok4 -> review360 -> ok5 -> final ->
upload_ready -> ok6 -> uploaded -> reviewed48h -> reviewed7d (or skipped).

## Upload
Manual at first: the owner uploads in YouTube Studio from `upload.md` and the files on the Releases page (`scripts/get_videos.ps1` copies them
to the PC). Later, after the owner says so: the vidIQ upload tool or a GitHub Action with the YouTube Data API (OAuth secret), still only after OK 6.

## Before the first video (once)
1. Owner picks one of 3 palettes + character styles. 2. Character sheet (Flow, owner OK). 3. Channel name, banner, avatar. 4. 3-5 videos banked before launch.

## Weekly rhythm (suggested, 4 videos)
- Sunday: researcher scan + strategist plan for the week (ideas for OK 1). Monday: stats workflow.
- Every day: one video moves one or two gates. Target upload days Mon / Wed / Fri (+ Sat when there are 4), 3-5 videos banked before launch.

## Secrets and variables (GitHub > Settings > Secrets and variables > Actions; never paste them in chat)
- `GEMINI_API_KEY` (secret): free AI Studio key for the daily trend scan.
- `YT_API_KEY` (secret) + `YT_CHANNEL_ID` (variable): public channel numbers for the Monday stats.
- Settings > Actions > General: allow GitHub Actions to create pull requests (the Gemini scan opens one).
