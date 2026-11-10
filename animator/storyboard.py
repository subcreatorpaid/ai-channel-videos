#!/usr/bin/env python3
"""Storyboard sheet for OK 4: one still per scene with its voice line, no voice or render needed.

  python animator/storyboard.py videos/<slug>/spec.json            # writes videos/<slug>/storyboard/ (stills + sheet.jpg + storyboard.md)
  python animator/storyboard.py videos/<slug>/spec.json --props    # only write props (estimated timings), no stills
  python animator/storyboard.py videos/<slug>/spec.json --thumbs   # thumbnail concepts from spec "thumbs" (or "thumb") -> videos/<slug>/thumbs/

Word times are estimated (about 2.7 words a second at speed 1.1), which is close enough for stills. Each still is taken
near the end of its beat, when every element of the scene has animated in. Needs `npm ci` in animator/ and Pillow.
"""
import json, os, pathlib, re, shutil, subprocess, sys

HERE = pathlib.Path(__file__).resolve().parent
FPS, WPS, GAP = 30, 2.7, 0.35
BROWSER = [f"--browser-executable={os.environ['REMOTION_BROWSER']}"] if os.environ.get("REMOTION_BROWSER") else []  # optional local Chrome
TOK = re.compile(r"\[([^|\]]+)\|([^\]]+)\]|(\S+)")


def build_props(spec, spec_dir, pub):
    beats, t = [], 0.25
    for b in spec["beats"]:
        show = dict(b.get("show", {}))
        for k in ("image", "video"):
            if show.get(k):
                src = spec_dir / show[k]
                if src.exists():
                    dst = pub / ("a_" + src.name); shutil.copy(src, dst); show[k] = dst.name
                else:
                    show.pop(k); show.setdefault("note", f"missing {src.name}")
        toks = [(m.group(1) or m.group(3), (m.group(2) or m.group(3)).split()) for m in TOK.finditer(b["say"])]
        words, tt = [], t
        for disp, spoken in toks:
            words.append({"w": disp, "f": round(tt * FPS), "p": False, "k": False}); tt += len(spoken) / WPS
        dur = max(1.2, tt - t)
        beats.append({"say": b["say"], "show": show, "from": round((t - 0.2) * FPS) if beats else 0, "speakFrom": round(t * FPS),
                      "speakFrames": round(dur * FPS), "words": words})
        t += dur + GAP
    total = round(t * FPS)
    for i, b in enumerate(beats):
        b["frames"] = (beats[i + 1]["from"] if i + 1 < len(beats) else total) - b["from"]
    return {"slug": spec["slug"], "fps": FPS, "total": total, "beats": beats, "theme": spec.get("theme", {}),
            "captions": False, "audio": False, "watermark": spec.get("watermark", "")}


def sheet(stills, beats, out):
    from PIL import Image, ImageDraw, ImageFont
    font_p = HERE.parent / "fonts" / "Inter-SemiBold.otf"
    font = ImageFont.truetype(str(font_p), 22) if font_p.exists() else ImageFont.load_default()
    bold = ImageFont.truetype(str(HERE.parent / "fonts" / "Inter-Bold.otf"), 24) if font_p.exists() else font
    cols, tw, th, cap = 3, 640, 360, 130
    rows = -(-len(stills) // cols)
    img = Image.new("RGB", (cols * (tw + 30) + 30, rows * (th + cap + 30) + 30), "#F4F4F0"); d = ImageDraw.Draw(img)
    for i, (p, b) in enumerate(zip(stills, beats)):
        x, y = 30 + (i % cols) * (tw + 30), 30 + (i // cols) * (th + cap + 30)
        img.paste(Image.open(p).convert("RGB").resize((tw, th)), (x, y))
        d.text((x, y + th + 8), f"{i + 1}. {b['show'].get('type', 'text')}  ({b['from'] / FPS:.0f}s)", font=bold, fill="#0E1014")
        words, line, ly = b["say"].split(), "", y + th + 40
        for w in words:  # wrap the voice line under the still
            if d.textlength(line + " " + w, font=font) > tw and line:
                d.text((x, ly), line, font=font, fill="#333"); ly += 26; line = w
                if ly > y + th + cap - 10: line = "..."; break
            else:
                line = (line + " " + w).strip()
        d.text((x, ly), line, font=font, fill="#333")
    img.save(out, quality=88)


def thumbs(spec, spec_dir, pub):
    """OK 2: render each thumbnail concept at 1280x720 plus a 320x180 phone-size check."""
    from PIL import Image
    out = spec_dir / "thumbs"; out.mkdir(exist_ok=True)
    for i, t in enumerate(spec.get("thumbs") or [spec.get("thumb", {})]):
        t = dict(t)
        if t.get("image") and (spec_dir / t["image"]).exists():
            src = spec_dir / t["image"]; shutil.copy(src, pub / ("a_" + src.name)); t["image"] = "a_" + src.name
        else:
            t.pop("image", None)
        (HERE / "thumb_props.json").write_text(json.dumps({"thumb": t, "theme": spec.get("theme", {})}))
        p = out / f"concept{i + 1}.png"
        subprocess.run(["npx", "remotion", "still", "src/index.jsx", "ThumbWide", str(p), "--props=thumb_props.json"] + BROWSER, cwd=HERE, check=True)
        Image.open(p).resize((320, 180)).save(out / f"concept{i + 1}_phone.png")
    print(f"wrote thumbnail concepts to {out}")


def main():
    spec_p = pathlib.Path(sys.argv[1]).resolve(); spec = json.loads(spec_p.read_text())
    pub = HERE / "public"; pub.mkdir(exist_ok=True)
    for f in (HERE.parent / "fonts").glob("*.otf"): shutil.copy(f, pub / f.name)
    if "--thumbs" in sys.argv: return thumbs(spec, spec_p.parent, pub)
    props = build_props(spec, spec_p.parent, pub)
    (HERE / "props.json").write_text(json.dumps(props, indent=1))
    print(f"storyboard: {len(props['beats'])} scenes, about {props['total'] / FPS / 60:.1f} min (estimated)")
    if "--props" in sys.argv: return
    out = spec_p.parent / "storyboard"; out.mkdir(exist_ok=True)
    stills = []
    for i, b in enumerate(props["beats"]):
        fr = max(b["from"], b["from"] + b["frames"] - 4); p = out / f"{i + 1:02d}.jpg"
        subprocess.run(["npx", "remotion", "still", "src/index.jsx", "Long", str(p), f"--frame={fr}", "--props=props.json",
                        "--image-format=jpeg", "--scale=0.5"] + BROWSER, cwd=HERE, check=True)
        stills.append(p)
    sheet(stills, props["beats"], out / "sheet.jpg")
    md = [f"# Storyboard: {spec.get('title', spec['slug'])}", "", "Reply with all changes in one message (OK 4).", "", "| # | Scene | Voice line |", "|---|---|---|"]
    md += [f"| {i + 1} | {b['show'].get('type', 'text')} | {b['say'].replace('|', '/')} |" for i, b in enumerate(props["beats"])]
    (out / "storyboard.md").write_text("\n".join(md) + "\n")
    print(f"wrote {out}/sheet.jpg and {len(stills)} stills")


if __name__ == "__main__":
    main()
