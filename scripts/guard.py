#!/usr/bin/env python3
"""Guard checks for the AI channel.

  python3 scripts/guard.py            # repo checks, prints errors + warnings
  python3 scripts/guard.py --strict   # exit 1 on any error (run before every commit and every upload)

Errors block a release (OK 6). Warnings are nudges. What it checks:
- brain/*.json is valid; max 3 to-dos; plan stages are known
- no secrets anywhere in the repo (API keys, tokens, private keys)
- video folders: never-list words in titles/scripts/specs, long-form score (scripts/longform_check.py),
  upload.md has the AI voice line and disclosures, sources.md exists before upload, music licences noted
- log files are one line each
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
NEVER = ["you won't believe", "insane", "welcome back", "smash that like", "smash like", "don't forget to subscribe",
         "oversimplified", "crayon capital", "capital case"]  # last three: never name or imitate the reference channels on screen
SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}"
                    r"|AIza[0-9A-Za-z_-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[bap]-[A-Za-z0-9-]{10,}|ya29\.[0-9A-Za-z_-]{20,})")
STAGES = {"idea", "ok1", "thumb", "ok2", "script", "ok3", "assets", "storyboard", "ok4", "review360", "ok5", "final",
          "upload_ready", "ok6", "uploaded", "reviewed48h", "reviewed7d", "skipped"}
TEXT = {".md", ".json", ".py", ".js", ".jsx", ".yml", ".yaml", ".txt", ".ps1", ".html", ".sh"}
errors, warnings = [], []
err, warn = errors.append, warnings.append


def load(p):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(f"{p.relative_to(ROOT)}: invalid JSON ({e})")
        return None


def check_brain():
    for p in sorted((ROOT / "brain").glob("*.json")):
        load(p)
    st = load(ROOT / "brain/status.json") or {}
    if len(st.get("today", [])) > 3:
        err("brain/status.json: more than 3 to-dos in 'today'")
    plan = load(ROOT / "brain/plan.json") or {}
    for v in plan.get("videos", []):
        if v.get("stage") not in STAGES:
            err(f"brain/plan.json: {v.get('slug')}: unknown stage {v.get('stage')!r}")
    for p in (ROOT / "brain/log").glob("20*.md"):
        if len(p.read_text(encoding="utf-8").strip().splitlines()) != 1:
            warn(f"{p.relative_to(ROOT)}: a log file should be one line")


def check_secrets():
    skip = {"node_modules", ".git", "models", "out", "public"}
    for p in ROOT.rglob("*"):
        if p.is_file() and p.suffix in TEXT and not (skip & set(p.relative_to(ROOT).parts)) and p.stat().st_size < 2_000_000:
            if SECRET.search(p.read_text(encoding="utf-8", errors="ignore")):
                err(f"{p.relative_to(ROOT)}: looks like a secret key. Remove it and rotate the key; keys go in GitHub Secrets.")


def check_videos():
    import longform_check
    for d in sorted((ROOT / "videos").iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        rel = d.relative_to(ROOT)
        for f in ("title-thumb.md", "script.md", "upload.md", "spec.json"):
            p = d / f
            if p.exists():
                low = p.read_text(encoding="utf-8").lower()
                for w in NEVER:
                    if w in low:
                        err(f"{rel}/{f}: never-list phrase '{w}' (brain/brand.md)")
        spec_p = d / "spec.json"
        if spec_p.exists():
            spec = load(spec_p) or {}
            if spec.get("style") == "wide":
                s, notes = longform_check.score(spec)
                (err if s < 60 else warn if s < 75 else (lambda m: None))(f"{rel}: long-form score {s}/100 ({'; '.join(notes) or 'ok'})")
            if spec.get("music") and not (d / "assets/LICENCES.md").exists():
                err(f"{rel}: music used but assets/LICENCES.md is missing")
        up = d / "upload.md"
        if up.exists():
            t = up.read_text(encoding="utf-8").lower()
            if "voice: ai" not in t:
                err(f"{rel}/upload.md: missing the AI voice line ('Voice: AI (Kokoro)')")
            if ("http" in t and ("affiliate" in t or "/ref" in t or "?via=" in t)) and "commission" not in t:
                err(f"{rel}/upload.md: affiliate link without the disclosure ('I may earn a commission at no cost to you')")
            if "altered or synthetic" not in t:
                warn(f"{rel}/upload.md: say whether the altered or synthetic content box is ticked (realistic AI visuals need it)")
            if "[check" in t:
                err(f"{rel}/upload.md: unresolved [CHECK] left in the upload package")
        if up.exists() and not (d / "sources.md").exists():
            err(f"{rel}: sources.md (proof folder) is missing before upload")
        sc = d / "script.md"
        if sc.exists() and "[check" in sc.read_text(encoding="utf-8").lower() and (d / "upload.md").exists():
            err(f"{rel}/script.md: unresolved [CHECK] claims before upload")


def main():
    check_brain()
    check_secrets()
    check_videos()
    for e in errors:
        print("ERROR  ", e)
    for w in warnings:
        print("warning", w)
    print(f"guard: {len(errors)} error(s), {len(warnings)} warning(s)")
    if "--strict" in sys.argv and errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
