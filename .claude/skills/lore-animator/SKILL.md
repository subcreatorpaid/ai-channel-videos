---
name: lore-animator
description: Makes a born-as ("If you were born as a…") video in the lore style - turns the approved script into a shot-by-shot spec.json with the series cast, story devices and camera moves, runs the style gates, then the storyboard, 360p and 1080p renders. Triggers - "born as", "lore style", "lore animator", "animate the born-as script", "spec for the born-as video".
---

# Lore animator (Sonnet; the hook and script themselves come from storyteller/scriptwriter on Opus)

Read first: `docs/lore-style.md` (the rules, measured from the reference videos), `scene-types.md` (next to this file),
`docs/lore-example-spec.json` (a working example), the video's `script.md` and the series cast in `brain/cast.json` (if it exists).

**Never** copy the reference channel's characters, names, art or brands. Original workers, places and stories only
(`scripts/check_lore_spec.py` blocks the names it knows).

## 1. Script shape (check before animating; send back to the scriptwriter if it fails)
- Hook in this order, all inside ~15 s: "If you were born as a **[worker]**," → 3 escalating feats → a twist question with a short
  shocking answer that is not explained → "But right now…" → "You're a baby in **[place]**. No **[tool]**, no **[uniform]**."
- Second person all the way. Short lines (4-12 words). A life in order, with ages and years as markers.
- At least one "Remember that…" in the first minute, paid off later. "Years pass, and the cute kid? Gone." switches chibi → adult.
- Deadpan 2-4 word jokes after dark beats. A poll break ("Which job should we be born into next?") at 33-40 % of the runtime.
- Ending: callback to the opening, a one-line summary of the life, then a question to the viewer.
- Pace: ~1,500 words for 10 minutes (Kokoro `am_michael+am_puck` at 1.1 ≈ the measured 177 wpm while speaking).

## 2. Cast (once per series, reused in every video)
Put each character in `spec.cast` (copy from `brain/cast.json` when it exists): `skin, hair, hairColor, eyeColor, top, topKind
(tee|jacket|hivis|overalls), bottom, shoes, hat (hardhat|cap|beanie|headlamp), hatColor, beard (stubble|full), tool (lantern|wrench|broom|clipboard), badge`.
The hero needs two entries: the adult (`you`) and the child (`you_kid`, used with `"age": "chibi"`). Code-drawn for now; a hand-made
SVG cast can replace `Person` in `animator/src/lore/cast.jsx` later without changing specs.

## 3. Write spec.json (`"style": "lore"`)
- One beat per voice line (`say`), so Kokoro reads whole sentences. Split the picture with `"shots": [...]`: **about 2 shots per
  sentence**, a new shot on each new idea; later shots start on a word with `"at": "<word>"`.
- Pick the shot type from `scene-types.md`. Rotate types; never the same device twice in a row.
- Acting: pose + face on every character; change the face on the word that turns the mood (`faces: [{word, face}]`) and add the
  matching emote (angry → vein, love → heart, confused → question, shock → shock, tired → zzz). Big actions = pose swaps / `hops`, not long animation.
- Camera: leave `cam` empty for the default (push or pan); `push` on emotional lines and portraits, `pan` across maps, boards and wide sets,
  `shake` on impacts, `hold` only for chapter cards and the poll.
- Transitions: hard cut by default. `rewind` on "But right now", `dip` into chapter cards, `flash` on the biggest moment (max 2 per video),
  `smear` out of the opening portrait, `push` through a page or frame.
- Devices: every "Remember that" → a corkboard note; chapter card every 35-50 s; the book frames the rewind and the end; place tag
  (`place`) on every new location; name tags (`tag`) the first time a character appears.

## 4. Gates, then renders (the six OKs stay as in docs/pipeline.md)
1. `python animator/lore_dry.py videos/<slug>/spec.json` (estimated timing, no voice), then
   `python scripts/check_lore_spec.py videos/<slug>/spec.json animator/props.json` → must print **OK**. Fix every ERROR; fix warnings unless there's a reason.
2. Storyboard sheet (OK 4): stills from `animator/stills.txt` (one per shot) with `npx remotion still src/index.jsx Long … --props=props.json`.
3. After OK 4: `python animator/prep.py videos/<slug>/spec.json` (Kokoro voice + real word timings), re-run the checker with the new
   props.json, then the 360p review (OK 5), then the 1080p final once (video.yml, `mode=review` / `mode=final`). Never 4K.

## 5. Write back
Log one line in `brain/log/`. New techniques that worked or failed go to `brain/learnings.md` and, if they change the style, to `docs/lore-style.md`.
