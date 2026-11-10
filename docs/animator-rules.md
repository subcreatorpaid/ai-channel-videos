# Animator rules: long-form 16:9 (10 Nov 2026)

## Format
- 1920x1080, 30 fps, composition `Long` (`animator/src/wide/Wide.jsx`), spec `"style": "wide"`. Thumbnails: `ThumbWide` 1280x720.
- Review render 640x360; final 1920x1080 once, after OK 5. Never 4K.
- Voice: Kokoro `am_michael+am_puck`, speed 1.1 (cap 1.15), via `animator/prep.py`; music bed ducked under the voice; SFX from `renderer/sfx.py`.
- Burnt-in captions off by default (YouTube captions from the script instead); `"captions": true` turns them on.

## Spec (videos/<slug>/spec.json)
`{slug, title, keyword, style: "wide", audio: {kokoro_voice, speed}, theme: {...brand palette}, beats: [{say, show, sfx?, rehook?}], thumb, thumbs}`
Scene types (`show.type`): `title`, `chapter`, `screen` (image or video + zoom, pointer, label), `points`, `stat`, `compare`, `text`, `endscreen`.
Any scene can carry `lower: {name, sub}` (lower third) and `tr` (fade, push, zoom, wipe; default rotates). `*word*` = accent colour.
Example with every scene type: `videos/_example/spec.json` (its storyboard and thumbnail are in the same folder).

## Pacing (checked by scripts/longform_check.py)
- First sentence confirms the title and thumbnail promise. Target keyword spoken in the first 30 s.
- A visual change at least every 20 s on average: zoom, pointer move, label, new scene. Screen recordings get a zoom on the thing being clicked.
- A re-hook every ~90 s (`text` or `stat` scene, or `"rehook": true` on a beat): an open loop, a result teaser or a mistake coming up.
- Chapter cards match the chapter list in `upload.md`. The last 20 s is the `endscreen` scene (space for YouTube end-screen elements).

## Screen recordings
- OBS Studio, 1920x1080 or higher, 30 fps, browser zoom 125%, dark mode where possible, notifications off, personal data hidden.
- Save as `videos/<slug>/assets/rec_<n>.mp4`; a `screen` scene uses `video` + `start` (seconds). Still screenshots work too (`image`).
- Google Flow images or b-roll: allowed for illustration; realistic ones need the altered or synthetic content box (brain/rules.md).

## Storyboard (OK 4)
`python animator/storyboard.py videos/<slug>/spec.json` or video.yml mode `storyboard`: one still per scene with its voice line in
`storyboard/sheet.jpg`. The owner marks all changes in one message.

## Shorts (from week 4)
Use the vertical kits copied from the first project (`animator/src/flow/`, composition `Short`, 1080x1920). Their rules are in
git history of github.com/subcreatorpaid/subcreator-videos (`docs/animator-rules.md`); adapt the palette to this channel.
