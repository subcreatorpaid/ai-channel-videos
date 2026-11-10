# ai-channel-videos

The brain and video pipeline for Hammad's faceless, illustrated YouTube channel about the workers and processes people rarely see
(working name "Night Shift"). Start with [CLAUDE.md](CLAUDE.md).

- `brain/` - brand, rules, goals, plan, ideas, learnings, status, research, logs
- `.claude/skills/` - the team (17 role skills) + the vendored `/youtube` skill (`docs/youtube-skill-map.md`)
- `videos/<slug>/` - one folder per video (`videos/_template/`, worked example in `videos/_example/`)
- `animator/` - Remotion: 16:9 illustrated scene kit (`src/wide/`), thumbnails, storyboard sheets; vertical kit for Shorts
- `.github/workflows/` - `video.yml` (thumbs, storyboard, 360p review, 1080p final), `gemini.yml` (daily trend scan),
  `guard.yml` (checks), `stats.yml` (Monday numbers)
- `docs/` - pipeline and the six OKs, packaging, animator rules

Nothing is posted, uploaded or sent without the owner's OK (`brain/rules.md`).
