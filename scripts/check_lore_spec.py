#!/usr/bin/env python3
"""Gates for a born-as (lore style) video, run before any storyboard or render. Numbers come from the reference study
(docs/lore-style.md). Prints OK or NOT READY with the reasons; exit code 1 when an error is found.
Usage: python scripts/check_lore_spec.py videos/<slug>/spec.json [animator/props.json]
       props.json (from animator/lore_dry.py or animator/prep.py) adds the timing gates.
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LORE = ROOT / "animator" / "src" / "lore"
errors, warns = [], []


def keys(file, const):
    """read the top-level names of a JS object/array literal, so the checker never drifts from the code"""
    src = (LORE / file).read_text()
    i = src.find(f"const {const} = ")
    if i < 0: return set()
    i = src.index("=", i) + 1
    while src[i] in " \n": i += 1
    opn = src[i]; cls = "}" if opn == "{" else "]"
    depth, j, names, tok = 0, i, set(), ""
    while j < len(src):
        ch = src[j]
        if ch in "{[(": depth += 1
        elif ch in "}])":
            depth -= 1
            if depth == 0: break
        if depth == 1:
            if opn == "[":
                m = re.match(r"'(\w+)'", src[j:])
                if m: names.add(m.group(1)); j += len(m.group(0)); continue
            else:
                m = re.match(r"(?<![\w.])(\w+):", src[j:]) if src[j - 1] in "{ ,\n" else None
                if m: names.add(m.group(1)); j += len(m.group(0)); continue
        j += 1
    return names


POSES, FACES, EMOTES = keys("cast.jsx", "POSES"), keys("cast.jsx", "EXPR"), keys("cast.jsx", "EMOTES")
PROPS, SETS = keys("sets.jsx", "PROPS"), keys("sets.jsx", "KINDS") | {"black"}
TYPES = {"scene", "portrait", "chapter", "book", "corkboard", "todo", "document", "map", "polaroids", "before_after", "tv", "poll", "end"}
TRS = {"cut", "smear", "dip", "flash", "rewind", "fade", "push"}
# we copy techniques, never the reference channel's characters or brands (brain/rules.md never-list)
NEVER = ["kratos", "master chief", "cortana", "doom slayer", "simon riley", "ghost (call of duty)", "carl johnson", "grove street", "borninlore", "halo", "call of duty", "god of war", "gta"]

spec_p = pathlib.Path(sys.argv[1])
spec = json.loads(spec_p.read_text())
beats = spec.get("beats", [])
cast = spec.get("cast", {})
if spec.get("style") != "lore": errors.append('spec "style" must be "lore"')
if not cast: errors.append("spec.cast is empty: define the series characters once (docs/lore-style.md §3)")

# ---- shots and names
shots = []  # (beat index, show)
for i, b in enumerate(beats):
    for sh in (b.get("shots") or [b.get("show", {})]):
        shots.append((i, sh))
for i, sh in shots:
    t = sh.get("type", "scene")
    if t not in TYPES: errors.append(f"line {i + 1}: unknown shot type {t!r}")
    if sh.get("tr") and sh["tr"] not in TRS: errors.append(f"line {i + 1}: unknown transition {sh['tr']!r}")
    st = sh.get("set") or {}
    if st.get("kind") and st["kind"] not in SETS: errors.append(f"line {i + 1}: unknown set {st['kind']!r} (have {sorted(SETS)})")
    for p in st.get("props", []):
        k = p if isinstance(p, str) else p.get("kind")
        if k not in PROPS: errors.append(f"line {i + 1}: unknown prop {k!r}")
    people = list(sh.get("cast", [])) + ([{"id": sh["who"]}] if sh.get("who") else []) + [{"id": p.get("who")} for p in sh.get("photos", []) if p.get("who")]
    for a in people:
        if a.get("id") not in cast: errors.append(f"line {i + 1}: character {a.get('id')!r} is not in spec.cast")
        if a.get("pose") and a["pose"] not in POSES: errors.append(f"line {i + 1}: unknown pose {a['pose']!r}")
        for fc in [a.get("face")] + [x.get("face") for x in a.get("faces", [])]:
            if fc and fc not in FACES: errors.append(f"line {i + 1}: unknown face {fc!r}")
        for em in [a.get("emote")] + [x.get("emote") for x in a.get("emotes", [])]:
            if em and em not in EMOTES: errors.append(f"line {i + 1}: unknown emote {em!r}")

# ---- hook (docs/lore-style.md §1)
says = [b.get("say", "") for b in beats]
low = [s.lower() for s in says]
if not low or not low[0].startswith("if you were born as"): errors.append('hook beat 1: the first line must start "If you were born as …"')
if shots and shots[0][1].get("type") != "portrait": errors.append("hook beat 1: the first shot must be the hero portrait (type portrait)")
if shots and not shots[0][1].get("heroTitle"): warns.append("hook beat 1: add heroTitle {name, word} for the name + \"(that's you)\" reveal")
pivot = next((i for i, s in enumerate(low[:12]) if "but right now" in s), None)
if pivot is None: errors.append('hook beat 4: no "But right now…" line in the first 12 lines')
else:
    if not any("baby" in s for s in low[pivot:pivot + 3]): errors.append('hook beat 5: "You\'re a baby in …" must follow "But right now"')
    if pivot < 3: errors.append("hook beat 2: three escalating feats must come before the rewind")
    if not any("?" in s for s in says[1:pivot]): warns.append("hook beat 3: no twist question before the rewind")
    rew = [sh for i, sh in shots if i == pivot]
    if rew and rew[0].get("tr") != "rewind" and rew[0].get("type") != "book": warns.append('hook beat 4: use tr "rewind" or the book on "But right now"')

# ---- devices, plants and payoffs (§2, §5)
rem = [i for i, s in enumerate(low) if re.search(r"\bremember (that|this|the|his|her)\b", s)]
if not rem: warns.append('no "Remember that…" plant: add at least one open loop in the first minute')
for i in rem:
    if not any(sh.get("type") == "corkboard" for j, sh in shots if i <= j <= i + 1): warns.append(f"line {i + 1}: the plant needs a corkboard note on screen")
boards = [j for j, sh in shots if sh.get("type") == "corkboard"]
if rem and len(boards) < 2: warns.append("the corkboard should come back later for the payoff (crossed or new notes)")
types = [sh.get("type", "scene") for _, sh in shots]
for k in range(1, len(types)):
    if types[k] == types[k - 1] and types[k] not in ("scene",): errors.append(f"shot {k + 1}: two {types[k]} shots in a row")
for k in range(2, len(types)):
    if len({json.dumps(shots[k - j][1].get("set", {}).get("kind")) + types[k - j] for j in range(3)}) == 1 and types[k] == "scene":
        warns.append(f"shot {k + 1}: same set three shots running; vary framing or set")
if "poll" not in types: errors.append("no poll break (comment who is next) in the middle")
if types and types[-1] != "end": errors.append("the last shot must be the end book (type end) with a question to the viewer")
if types.count("chapter") < 2 and len(beats) > 40: errors.append("chapter cards missing: one every 35-50 s")

# ---- originality
blob = json.dumps(spec).lower()
for w in NEVER:
    if re.search(rf"\b{re.escape(w)}\b", blob): errors.append(f"never-list: {w!r} appears; use original characters and places only")

# ---- timing gates from props.json
if len(sys.argv) > 2:
    P = json.loads(pathlib.Path(sys.argv[2]).read_text()); FPS = P.get("fps", 30); pb = P["beats"]; total = P["total"] / FPS
    spans = []  # (type, start s, dur s, cam)
    for i, b in enumerate(pb):
        end = pb[i + 1]["from"] if i + 1 < len(pb) else P["total"]
        shl = b.get("shots") or [b["show"]]
        starts = [b["from"]]
        for k, sh in enumerate(shl[1:], 1):
            m = next((w["f"] for w in b["words"] if re.sub(r"\W", "", w["w"]).lower().startswith(str(sh.get("at", "")).lower())), None)
            starts.append(m if m is not None else b["from"] + (end - b["from"]) * k // len(shl))
        for sh, s0, s1 in zip(shl, starts, starts[1:] + [end]):
            spans.append((sh.get("type", "scene"), s0 / FPS, (s1 - s0) / FPS, (sh.get("cam") or {}).get("move")))
    body = [d for t, _, d, _ in spans if t not in ("chapter", "poll", "end")]
    avg = sum(body) / max(1, len(body))
    if not 1.5 <= avg <= 2.7: errors.append(f"average shot {avg:.2f} s; the style runs 1.6-2.3 s (split long lines into shots)")
    for t, s0, d, _ in spans:
        if t not in ("chapter", "poll", "end", "map", "corkboard", "todo", "document") and d > 6: errors.append(f"shot at {s0:.1f} s lasts {d:.1f} s (max 6 s)")
        if t == "chapter" and not 1.4 <= d <= 2.4: warns.append(f"chapter card at {s0:.1f} s lasts {d:.1f} s (style: 1.7-1.9 s)")
        if t in ("map", "corkboard", "todo", "document") and d < 1.8: warns.append(f"{t} at {s0:.1f} s lasts {d:.1f} s; give devices ≥ 1.8 s to read")
    hook_end = next((s0 for t, s0, d, _ in spans if t == "book" or False), None)
    piv_t = next((s0 for (t, s0, d, _), (i, sh) in zip(spans, shots) if i == pivot), None) if pivot is not None else None
    if piv_t is not None and not 9 <= piv_t <= 20: warns.append(f'"But right now" lands at {piv_t:.1f} s; the reference lands it at 12-14 s')
    ch = [s0 for t, s0, _, _ in spans if t == "chapter"]
    gaps = [b2 - a2 for a2, b2 in zip([0] + ch, ch + [total])]
    if total > 120 and max(gaps) > 60: errors.append(f"{max(gaps):.0f} s without a chapter card (style: every 35-50 s)")
    poll = [s0 for t, s0, _, _ in spans if t == "poll"]
    if poll and total > 120 and not 0.28 <= poll[0] / total <= 0.45: warns.append(f"poll break at {poll[0] / total:.0%} of the runtime; the style puts it at 33-40 %")
    moving = sum(1 for t, _, _, c in spans if c != "hold" and t not in ("chapter", "poll", "end")) / max(1, len(body))
    if moving < 0.55: errors.append(f"only {moving:.0%} of shots have camera motion (style: nearly all)")
    words = sum(len(b["say"].split()) for b in pb)
    print(f"timing: {total:.0f} s, {len(spans)} shots, avg {avg:.2f} s, {words / total * 60:.0f} wpm, {len(ch)} chapter cards")

for w in warns: print("warn:", w)
for e in errors: print("ERROR:", e)
print("OK" if not errors else f"NOT READY ({len(errors)} errors)")
sys.exit(1 if errors else 0)
