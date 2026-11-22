# Animator rules: long-form 16:9 illustrated (10 Nov 2026, Capital Case-style look with our own art)

## Format
- 1920x1080, 30 fps, composition `Long` (`animator/src/wide/Wide.jsx`), spec `"style": "wide"`. Thumbnails: `ThumbWide` 1280x720.
- Review render 640x360; final 1920x1080 once, after OK 5. Never 4K.
- Voice: Kokoro narrator `am_michael+am_puck` at speed 1.0 (about 150 words a minute; cap 1.15), via `animator/prep.py`; a beat's `"voice"`
  gives a worker line its own Kokoro voice (e.g. `am_fenrir`, `bm_george`, `af_nicole`); music bed ducked under the voice; SFX from `renderer/sfx.py`.
- Burnt-in captions off by default (YouTube captions from the script instead); `"captions": true` turns them on.

## Spec (videos/<slug>/spec.json)
`{slug, title, keyword, style: "wide", audio: {kokoro_voice, speed}, theme: {...brand palette}, beats: [{say, show, sfx?, rehook?}], thumb, thumbs}`
Story scenes: `dateline` (time + place typed over a darkened illustration, the cold open), `illus` (full-bleed illustration with a slow
camera move `in|out|left|right|up`, optional `caption`, optional parallax `layers`), `titlecard` (one key term on black), `dialogue`
(a worker's line in a speech bubble at `x,y`). Info scenes: `title`, `chapter`, `points`, `stat`, `compare`, `text`, `endscreen`
(`screen` also exists for the odd document or website shot).
Any scene can carry `lower: {name, sub}` (lower third) and `tr` (fade, push, zoom, wipe; default rotates). `*word*` = accent colour.
Example with every scene type: `videos/_example/spec.json` (its storyboard and thumbnail are in the same folder).

## Pacing (checked by scripts/longform_check.py)
- First sentence confirms the title and thumbnail promise. Target keyword spoken in the first 30 s.
- A visual change at least every 20 s on average: a new illustration, camera move, title card or caption.
- A turn every 60-90 s (`titlecard`, `text` or `stat` scene, or `"rehook": true` on a beat): "but here's what nobody notices".
- Chapter cards (one per act) match the chapter list in `upload.md`. The last 20 s is the `endscreen` scene (space for YouTube end-screen elements).

## Illustrations
- 1920x1080 PNG per scene in `videos/<slug>/assets/`, flat 2D, thick dark outlines, palette from brand.md, characters from `assets/characters/`.
- No text inside images (labels, numbers and maps are drawn by the kit so they can be proofread). Leave the lower third clear for captions.
- Made in Google Flow from `art-prompts.md`, checked by hand for consistency; drawn for each video, never a reused template.
- Real footage: only short clips, framed and annotated, under our narration, credited in the description.

## Storyboard (OK 4)
`python animator/storyboard.py videos/<slug>/spec.json` or video.yml mode `storyboard`: one still per scene with its voice line in
`storyboard/sheet.jpg`. The owner marks all changes in one message.

## Shorts (from week 4)
Use the vertical kits copied from the first project (`animator/src/flow/`, composition `Short`, 1080x1920). Their rules are in
git history of github.com/subcreatorpaid/subcreator-videos (`docs/animator-rules.md`); adapt the palette to this channel.
