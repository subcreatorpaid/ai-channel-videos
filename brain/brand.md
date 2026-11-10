# Brand book (draft, 10 Nov 2026: name and palette still open)

## Identity
Working name "AI Channel" until the owner picks the real one. A faceless channel that shows, step by step, how to use AI to automate
work and create things: Claude, Gemini, Google Flow, bots, agents and the tools around them.
- Promise: "Watch me build it, then build it yourself." Every video ends with something the viewer can use the same day.
- Position: a builder showing real screens. Never claim results, income or experience the owner does not have. Real numbers only.
- Audience: adults who work on a computer (freelancers, small-business owners, creators, office workers) and want AI to save them time.
  Beginner to intermediate; no coding needed unless the title says so.
- Formats: **Tutorial** ("How to automate X with Claude"), **How I built it** (a real build, start to finish), **Tested** (a tool or
  workflow tried for N days, with the result), **Compared** (two tools on one job). Series and playlists per format.

## Voice
Clear, calm, practical, a bit of personality. Short sentences, plain words, written for the ear. Show, don't hype.
**Never:** "this changes everything", "insane", "game-changer", fake urgency, promised income, "AI will replace you" fear-bait,
bashing other creators, clickbait the video does not pay off, jailbreaks or ways to break a tool's terms.

| Instead of | Write |
|---|---|
| "This AI tool is INSANE" | "This saved me two hours on Monday. Here's the setup." |
| "Make $10k a month with AI" | "Here's the workflow. What it earns depends on you; I'll show what it saves." |
| "You NEED this" | "Here's the free way, and when the paid plan is worth it." |

## Look (to be chosen: the owner picks one of three options with mockups)
- Format: 16:9, 1920x1080, 30 fps (`animator/src/wide/Wide.jsx`). Thumbnails 1280x720 (`ThumbWide.jsx`).
- Until a palette is picked the animator uses its default theme: dark `#0E1014`, panel `#171A21`, text `#F4F4F0`, accent blue `#4F8CFF`,
  highlight yellow `#FFD24F`. The chosen palette goes in every spec as `"theme"` and here.
- Type: Inter (Black for titles, ExtraBold for body). Real logos for every tool shown, in their own colours.
- Screen recordings: 1080p or higher, OBS Studio, browser zoom 125%, hide personal data (email, tabs, bookmarks) before recording.
- Music: YouTube Audio Library or Pixabay Music only, licence noted in `videos/<slug>/assets/LICENCES.md`.

## Every video
- Target keyword in the title, the first line of the description and spoken in the first 30 seconds.
- The thumbnail and title make one promise; the hook confirms it in the first 5 seconds; the video pays it off.
- Chapters (cards in the video match the chapter list), one mid-video card, end screen for the last 20 seconds, pinned comment.
- Ending (about 20 s): one-line recap, "watch this next" to the best related video, subscribe ask in one sentence. Never "smash like".
- Realistic AI-generated people, places or events: tick YouTube's altered or synthetic content box and say it in the description.
- Affiliate links: "Affiliate link" in the description next to the link, plus "I may earn a commission at no cost to you."
