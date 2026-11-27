#!/usr/bin/env python3
"""Dry props for the lore style: timings estimated at the measured narration pace (177 wpm while speaking, 0.4 s between
lines), no voice. For storyboard stills and layout checks before Kokoro runs; prep.py replaces it with real timings.
Usage: python animator/lore_dry.py videos/<slug>/spec.json  -> animator/props.json (audio off) + stills.txt (one frame per shot)
"""
import json, pathlib, re, shutil, sys

HERE = pathlib.Path(__file__).resolve().parent
FPS, WPS, GAP, LEAD = 30, 177 / 60, 0.4, 0.25

spec_p = pathlib.Path(sys.argv[1])
spec = json.loads(spec_p.read_text())
beats, t, stills = [], LEAD, []
for b in spec["beats"]:
    words = re.findall(r"\S+", re.sub(r"\[([^|\]]+)\|[^\]]+\]", r"\1", b["say"]))
    dur = max(0.9, len(words) / WPS + (0.25 if b["say"].rstrip().endswith(("?", ".", "!")) else 0))
    if b.get("show", {}).get("type") == "chapter" or (b.get("shots") or [{}])[0].get("type") == "chapter": dur = max(dur, 1.8)
    wf = [{"w": w, "f": round((t + i * dur / max(1, len(words))) * FPS)} for i, w in enumerate(words)]
    beat = {"say": b["say"], "show": b.get("show") or b["shots"][0], "from": round((t - (LEAD if not beats else 0.12)) * FPS),
            "speakFrom": round(t * FPS), "speakFrames": round(dur * FPS), "words": wf}
    if b.get("shots"): beat["shots"] = b["shots"]
    beats.append(beat)
    t += dur + GAP
for i, b in enumerate(beats):
    end = beats[i + 1]["from"] if i + 1 < len(beats) else round(t * FPS)
    b["frames"] = end - b["from"]
    starts = [b["from"]]
    for k, sh in enumerate((b.get("shots") or [])[1:], 1):
        m = next((w["f"] for w in b["words"] if re.sub(r"\W", "", w["w"]).lower().startswith(str(sh.get("at", "")).lower())), None)
        starts.append(m if m is not None else b["from"] + round(b["frames"] * k / len(b["shots"])))
    ends = starts[1:] + [end]
    stills += [max(s0, e - 12) for s0, e in zip(starts, ends)]
pub = HERE / "public"; pub.mkdir(exist_ok=True)
for f in ("Inter-Black.otf", "Inter-ExtraBold.otf", "Inter-Bold.otf", "Bitter-ExtraBold.ttf", "Bitter-SemiBoldItalic.ttf", "PatrickHand-Regular.ttf", "JetBrainsMono-Bold.ttf"):
    p = HERE.parent / "fonts" / f
    if p.exists(): shutil.copy(p, pub / f)
props = {"slug": spec["slug"], "fps": FPS, "total": round(t * FPS), "beats": beats, "style": "lore", "cast": spec.get("cast", {}),
         "watermark": spec.get("watermark", ""), "audio": False, "captions": False}
(HERE / "props.json").write_text(json.dumps(props, indent=1))
(HERE / "stills.txt").write_text("\n".join(map(str, stills)) + "\n")
print(f"lore_dry: {len(beats)} lines, {len(stills)} shots, {t:.1f} s (estimated)")
