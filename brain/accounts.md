# Accounts and tools (names and where keys live; never passwords or key values)

| Tool | What for | Plan | Key / connection |
|---|---|---|---|
| YouTube channel | the channel | free | not created yet (owner creates it) |
| GitHub `subcreatorpaid/ai-channel-videos` | this repo, Actions renders | free (public repo) | - |
| Gemini API (AI Studio) | daily trend scan only | free tier | secret `GEMINI_API_KEY` |
| YouTube Data API v3 | stats, competitor search (`/youtube` execution scripts) | free, 10k units/day | secret `YT_API_KEY`; on the PC env `YOUTUBE_API_KEY` |
| vidIQ | keyword research, outliers, title/thumbnail scores, upload later | free tier | connector |
| Google AI plan with Flow | character sheet and scene illustrations (flat 2D) | paid (owner) | owner signs in; no API key here |
| Kokoro TTS | voice, runs in GitHub Actions | free, open source | none needed |
| Canva / HyperFrames | optional design and motion help | connectors | connector |
| Google Drive / Sheets / Docs | sharing reviews and trackers | free | connector |
| claude-youtube skill | the 14 /youtube commands | MIT | PC: ~/.claude/skills/youtube; repo copy: `.claude/skills/youtube/` |
