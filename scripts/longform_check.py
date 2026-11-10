#!/usr/bin/env python3
"""Long-form pre-check for a video spec (free, no AI). Scores videos/<slug>/spec.json against the channel's packaging and
retention rules (brain/brand.md, docs/packaging.md, .claude/skills/youtube/references/retention-scripting-guide.md).

  python3 scripts/longform_check.py                 # all videos/*/spec.json (except _template and _example)
  python3 scripts/longform_check.py videos/<slug>   # one video
Used by scripts/guard.py: under 60 is an error, 60-74 a warning.

100 points: hook 25 (first beat short, promise in the first sentence, keyword spoken in the first 30 s) · length 20 (8-12 min)
· pacing 20 (a scene change at least every 20 s on average, a re-hook "text" scene or open loop every ~90 s) · structure 20
(2+ chapters, endscreen last, no scene type 4 times in a row) · packaging 15 (title, keyword, thumb words that do not repeat the title).
Speaking rate for Kokoro at speed 1.1 is taken as 2.7 words a second.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
WPS = 2.7
words = lambda s: len(re.findall(r"[A-Za-z0-9$%']+", s or ""))  # noqa: E731


def score(spec):
    beats, notes, pts = spec.get("beats", []), [], 0
    if not beats: return 0, ["no beats"]
    secs = [words(b.get("say")) / WPS + 0.35 for b in beats]; total = sum(secs)
    kw = (spec.get("keyword") or "").lower()
    first = beats[0].get("say", "")
    h = 0
    h += 8 if words(first.split(".")[0]) <= 20 else 0
    h += 7 if beats[0].get("show", {}).get("type") in ("title", "text", "stat", "screen") else 0
    t, early = 0, ""
    for b, s in zip(beats, secs):
        if t > 30: break
        early += " " + b.get("say", "").lower(); t += s
    h += 10 if kw and kw in early else 0
    if kw and kw not in early: notes.append(f"keyword '{kw}' not spoken in the first 30 s")
    if not kw: notes.append("spec has no 'keyword'")
    pts += h
    m = total / 60
    pts += 20 if 8 <= m <= 12 else 12 if 6 <= m <= 14 else 4
    if not 8 <= m <= 12: notes.append(f"estimated length {m:.1f} min (target 8-12)")
    avg = total / len(beats)
    pts += 10 if avg <= 20 else 5 if avg <= 30 else 0
    if avg > 20: notes.append(f"a scene lasts {avg:.0f} s on average (aim for 20 s or less)")
    rehooks = sum(1 for b in beats if b.get("show", {}).get("type") in ("text", "stat") or b.get("rehook"))
    need = max(1, int(total // 90))
    pts += 10 if rehooks >= need else round(10 * rehooks / need)
    if rehooks < need: notes.append(f"{rehooks} re-hooks for {m:.1f} min (want about {need}, one every 90 s)")
    types = [b.get("show", {}).get("type", "text") for b in beats]
    chapters = types.count("chapter")
    pts += 8 if chapters >= 2 else 0
    if chapters < 2: notes.append("fewer than 2 chapter cards")
    pts += 6 if types[-1] == "endscreen" else 0
    if types[-1] != "endscreen": notes.append("last scene is not the endscreen")
    run = max((len(m.group(0)) for m in re.finditer(r"(.)\1*", "".join(t[:1] for t in types))), default=0)
    pts += 6 if run < 4 else 0
    if run >= 4: notes.append("the same scene type 4+ times in a row")
    title, thumb = spec.get("title", ""), (spec.get("thumb") or {}).get("words", "")
    p = 5 if title else 0
    p += 5 if kw and kw in title.lower() else 0
    tw, ti = set(thumb.lower().split()), set(title.lower().split())
    p += 5 if thumb and len(tw & ti) <= 1 else 0
    if thumb and len(tw & ti) > 1: notes.append("thumbnail words repeat the title")
    pts += p
    return pts, notes


def main():
    paths = [pathlib.Path(a) for a in sys.argv[1:]] or [p.parent for p in sorted((ROOT / "videos").glob("*/spec.json")) if not p.parent.name.startswith("_")]
    worst = 100
    for d in paths:
        spec = json.loads((d / "spec.json").read_text())
        if spec.get("style") != "wide": continue
        s, notes = score(spec); worst = min(worst, s)
        print(f"{d.name}: {s}/100" + "".join(f"\n  - {n}" for n in notes))
    return worst


if __name__ == "__main__":
    main()
