"""Usage: python3 videos/roman-legionary/make_spec.py videos/roman-legionary/spec.json [speed]
Builds videos/roman-legionary/spec.json (lore style, 2D + cel-shaded 3D) from the approved script."""
import json, re, sys, itertools

CAST = {
    "kid": {"skin": "#D9A27A", "hair": "short", "hairColor": "#3B2A20", "top": "#D8C9A6", "topKind": "tunic", "bottom": "#D9A27A", "shoes": "#6B4A30"},
    "recruit": {"skin": "#D9A27A", "hair": "short", "hairColor": "#3B2A20", "top": "#C9B48A", "topKind": "tunic", "bottom": "#D9A27A", "shoes": "#6B4A30"},
    "you": {"skin": "#D9A27A", "hair": "short", "hairColor": "#3B2A20", "top": "#B0302A", "topKind": "legion", "bottom": "#D9A27A", "shoes": "#6B4A30",
            "hat": "galea", "hatColor": "#B9BEC2", "shield": True, "tool": "pilum"},
    "youb": {"skin": "#D9A27A", "hair": "short", "hairColor": "#3B2A20", "top": "#B0302A", "topKind": "legion", "bottom": "#D9A27A", "shoes": "#6B4A30"},
    "youd": {"skin": "#D9A27A", "hair": "short", "hairColor": "#3B2A20", "top": "#B0302A", "topKind": "tunic", "bottom": "#D9A27A", "shoes": "#6B4A30", "tool": "shovel"},
    "vet": {"skin": "#D09A72", "hair": "short", "hairColor": "#7E7670", "beard": "stubble", "top": "#B0302A", "topKind": "legion", "bottom": "#D09A72", "shoes": "#6B4A30",
            "hat": "galea", "hatColor": "#A9AEB2", "shield": True, "tool": "shovel"},
    "old": {"skin": "#D09A72", "hair": "short", "hairColor": "#8E8680", "beard": "stubble", "top": "#C9B48A", "topKind": "tunic", "bottom": "#D09A72", "shoes": "#6B4A30"},
    "dad": {"skin": "#C98E68", "hair": "curly", "hairColor": "#4A3222", "beard": "full", "top": "#8A6A44", "topKind": "tunic", "bottom": "#C98E68", "shoes": "#5A3A22"},
    "mum": {"skin": "#E2B08A", "hair": "bun", "hairColor": "#5A3A22", "top": "#7A8F5A", "topKind": "dress", "bottom": "#7A8F5A", "shoes": "#5A3A22"},
    "gramps": {"skin": "#C98E68", "hair": "bald", "hairColor": "#CFC8C0", "beard": "full", "top": "#6E7E92", "topKind": "tunic", "bottom": "#C98E68", "shoes": "#5A3A22"},
    "aux": {"skin": "#C98E68", "hair": "short", "hairColor": "#4A3222", "top": "#9A7A50", "topKind": "legion", "mail": True, "bottom": "#C98E68", "shoes": "#5A3A22",
            "hat": "galea", "hatColor": "#9EA4A8", "shield": True, "shieldColor": "#4E6E4A"},
    "cent": {"skin": "#C98E68", "hair": "buzz", "hairColor": "#222222", "beard": "stubble", "top": "#B0302A", "topKind": "legion", "mail": True, "bottom": "#C98E68",
             "shoes": "#6B4A30", "hat": "crest", "hatColor": "#C9A04A", "tool": "vine"},
    "recruiter": {"skin": "#C98E68", "hair": "buzz", "hairColor": "#2A2018", "top": "#B0302A", "topKind": "legion", "mail": True, "bottom": "#C98E68", "shoes": "#6B4A30"},
    "ox": {"skin": "#E2A882", "hair": "curly", "hairColor": "#8A4A22", "beard": "full", "top": "#B0302A", "topKind": "legion", "bottom": "#E2A882", "shoes": "#6B4A30"},
    "hisp": {"skin": "#B97E58", "hair": "curly", "hairColor": "#1E1612", "top": "#B0302A", "topKind": "tunic", "bottom": "#B97E58", "shoes": "#6B4A30"},
    "emp": {"skin": "#D9A27A", "hair": "curly", "hairColor": "#4A3626", "beard": "full", "top": "#6A2E6E", "topKind": "dress", "bottom": "#6A2E6E", "shoes": "#5A3A22"},
    "emp2": {"skin": "#D9A27A", "hair": "short", "hairColor": "#6A5A4A", "beard": "full", "top": "#6A2E6E", "topKind": "dress", "bottom": "#6A2E6E", "shoes": "#5A3A22"},
    "brica": {"skin": "#EDC2A0", "hair": "long", "hairColor": "#9A4A22", "top": "#3E6E8A", "topKind": "dress", "bottom": "#3E6E8A", "shoes": "#5A3A22"},
    "son": {"skin": "#E2B08A", "hair": "fringe", "hairColor": "#6A3A22", "top": "#B0302A", "topKind": "tunic", "bottom": "#E2B08A", "shoes": "#5A3A22"},
    "girl": {"skin": "#E2B08A", "hair": "long", "hairColor": "#9A4A22", "top": "#D8C9A6", "topKind": "dress", "bottom": "#D8C9A6", "shoes": "#5A3A22"},
    "raider": {"skin": "#D9B08A", "hair": "long", "hairColor": "#7A4A22", "beard": "full", "topKind": "bare", "bottom": "#4E5E3A", "shoes": "#3A2A20"},
    "lady": {"skin": "#EDC2A0", "hair": "bun", "hairColor": "#3A2618", "top": "#A8523A", "topKind": "dress", "bottom": "#A8523A", "shoes": "#5A3A22"},
    "trader": {"skin": "#C98E68", "hair": "short", "hairColor": "#3A2A20", "beard": "full", "top": "#5E6E4A", "topKind": "tunic", "bottom": "#C98E68", "shoes": "#5A3A22"},
}

# ---------------------------------------------------------------- sets
FARM = {"kind": "farm", "mood": "warm", "props": [{"kind": "goat", "x": 0.14, "scale": 1.4}]}
FARMDUSK = {"kind": "farm", "mood": "dusk", "props": [{"kind": "goat", "x": 0.12, "scale": 1.4}]}
HOME = {"kind": "room", "mood": "warm", "stone": True, "band": False, "window": "day", "windowX": 0.7, "props": [{"kind": "amphora", "x": 0.1}, {"kind": "table", "x": 0.82}]}
HOMEN = {"kind": "room", "mood": "ember", "stone": True, "band": False, "window": "night", "windowX": 0.75, "props": [{"kind": "fire", "x": 0.5}, {"kind": "rug", "x": 0.5}]}
NURSERY = {"kind": "room", "mood": "warm", "stone": True, "band": False, "window": "day", "windowX": 0.75, "props": [{"kind": "basket", "x": 0.45}, {"kind": "rug", "x": 0.45}, {"kind": "amphora", "x": 0.1}]}
MARKET = {"kind": "farm", "mood": "sepia", "villaX": 0.82, "props": [{"kind": "cart", "x": 0.18}, {"kind": "amphora", "x": 0.4}, {"kind": "crate", "x": 0.46}]}
FIELD = {"kind": "sky", "mood": "warm", "noTown": True}
FIELDD = {"kind": "sky", "mood": "dusk", "noTown": True}
ROAD = {"kind": "road", "mood": "warm", "paved": True}
ROADD = {"kind": "road", "mood": "dusk", "paved": True}
ROADC = {"kind": "road", "mood": "steel", "paved": True}
TENT = {"kind": "tent", "mood": "ember", "props": [{"kind": "fire", "x": 0.5}]}
BARRACK = {"kind": "room", "mood": "sepia", "stone": True, "band": False, "window": "none", "props": [{"kind": "bunk", "x": 0.16}, {"kind": "bunk", "x": 0.86}]}
BARRACKN = {"kind": "room", "mood": "night", "stone": True, "band": False, "window": "night", "windowX": 0.5, "props": [{"kind": "bunk", "x": 0.16}, {"kind": "bunk", "x": 0.86}]}
BATH = {"kind": "room", "mood": "teal", "stone": True, "window": "none", "props": [{"kind": "pool", "x": 0.5}, {"kind": "amphora", "x": 0.08}]}
FORT = {"kind": "fort", "mood": "warm"}
FORTS = {"kind": "fort", "mood": "snow", "fx": "snow"}
FORTR = {"kind": "fort", "mood": "steel", "fx": "rain"}
RAMP = {"kind": "rampart", "mood": "steel"}
RAMPN = {"kind": "rampart", "mood": "night", "night": True}
RAMPR = {"kind": "rampart", "mood": "steel", "fx": "rain"}
SEA = {"kind": "sky", "mood": "steel", "noTown": True, "fx": "rain"}
GLOW = lambda mood="warm", **k: {"kind": "glow", "mood": mood, **k}
BLACK = {"kind": "black"}

def blur(st, b=6): return {**st, "blur": b}

# ---------------------------------------------------------------- shot helpers
_cams = itertools.cycle([{"move": "push", "amount": 0.06}, {"move": "pan", "dir": [-90, 0]}, {"move": "pull", "amount": 0.05},
                         {"move": "push", "amount": 0.08, "focus": [0.5, 0.42]}, {"move": "pan", "dir": [80, 0]}])

def A(id, x=0.5, **k): return {"id": id, "x": x, **k}

def sc(st, *cast, at=None, cam=None, **k):
    s = {"type": "scene", "set": st, "cast": list(cast), "cam": cam or next(_cams), **k}
    if at: s["at"] = at
    return s

def close(st, id, face, at=None, age=None, **k):
    """close-up: big character on a blurred set (the reference's punch-in)"""
    shotk = {x: k.pop(x) for x in list(k) if x in ("callouts", "stamp", "counter", "caption", "place", "cam")}
    shotk.pop("cam", None)
    a = A(id, 0.5, y=1.5, scale=1.75, face=face, **k)
    if age: a["age"] = age
    return sc(blur(st, 7), a, at=at, cam={"move": "push", "amount": 0.07, "focus": [0.5, 0.35]}, **shotk)

def d3(scene, palette, frm, to, at=None, look=None, fog=None, mood=None, **k):
    s = {"type": "land3d", "scene": scene, "palette": palette, "set": {"mood": mood or {"day": "warm", "cold": "snow", "dusk": "dusk"}[palette]},
         "camera": {"from": frm, "to": to}, **k}
    if look: s["camera"]["look"] = look
    if fog: s["fog"] = fog
    if at: s["at"] = at
    return s

def dev(type, at=None, **k):
    s = {"type": type, **k}
    if at: s["at"] = at
    return s

def chap(n, title, icon="★", at=None, kicker=None):
    s = {"type": "chapter", "n": n, "title": title, "icon": icon}
    if kicker: s["kicker"] = kicker
    if at: s["at"] = at
    return s

B = []
def L(say, *shots, hold=0):
    b = {"say": say}
    if len(shots) == 1:
        s = dict(shots[0]); s.pop("at", None); b["show"] = s
    else:
        b["shots"] = [dict(s) for s in shots]
        b["shots"][0].pop("at", None)
    if hold: b["hold"] = hold
    B.append(b)

# ================================================================= HOOK
L("If you were born as a Roman legionary,",
  {"type": "portrait", "who": "you", "face": "determined", "set": GLOW("dusk", light=[0.7, 0.42]), "rim": "#FFB36A",
   "heroTitle": {"name": "LEGIONARY", "sub": "(that's you)", "word": "legionary", "x": 0.3, "y": 0.45},
   "cam": {"move": "push", "amount": 0.07, "focus": [0.62, 0.4]}})
L("you'd march twenty miles before lunch,",
  sc(ROAD, A("you", 0.15, walkTo=0.6, pose="walk", face="determined"), A("ox", 0.0, walkTo=0.42, pose="walk", face="tired", scale=0.92),
     counter={"label": "ROMAN MILES", "steps": [{"value": "0", "word": "march"}, {"value": "20", "word": "miles"}]}, cam={"move": "pan", "dir": [-120, 0]}))
L("carrying a third of your own body weight on your back,",
  sc(FIELD, A("you", 0.4, pose="carry", face="tired", emote="sweat")),
  sc(blur(FIELD), A("you", 0.5, y=1.45, scale=1.7, pose="carry", face="worried", emote="sweat"), at="weight",
     callouts=[{"text": "≈ 1/3 OF YOU", "from": [0.72, 0.3], "to": [0.58, 0.55], "word": "weight"}]))
L("and help build a wall that crosses an entire country, coast to coast.",
  sc(FIELDD, A("you", 0.3, pose="work", face="determined"), A("youd", 0.6, pose="work", face="tired"), A("ox", 0.8, pose="carry", face="tired")),
  d3("wall", "day", [80, 34, 80], [40, 26, 62], at="crosses"))
L("So why, after twenty-five years of loyal service, would you be ordered to build another one?",
  {"type": "portrait", "who": "vet", "face": "tired", "set": GLOW("steel", light=[0.7, 0.45]), "rim": "#9FC3D9", "cam": {"move": "push", "amount": 0.1, "focus": [0.5, 0.35]}},
  close(RAMP, "vet", "surprised", at="ordered", emote="question"),
  sc(FIELDD, A("vet", 0.45, pose="shrug", face="angry", emote="vein"), at="another"))
L("That part comes later.", sc(GLOW("steel"), A("vet", 0.5, pose="cross", face="neutral"), cam={"move": "pull", "amount": 0.06}))
L("But right now,", {"type": "book", "tr": "rewind", "left": {"kicker": "Year 99", "title": "Prologue", "text": "A farm in southern Gaul"},
                     "right": {"who": "kid", "age": "chibi", "face": "happy", "caption": "you, age 0"}})
L("you're a baby in a farmhouse in southern Gaul, in the year 99. No helmet. No sword. Just a very small blanket.",
  sc(NURSERY, A("kid", 0.45, age="chibi", y=0.8, face="surprised"), place="SOUTHERN GAUL · AD 99"),
  sc(NURSERY, A("kid", 0.45, age="chibi", y=0.8, face="neutral", holo={"shape": "galea", "word": "helmet", "untilWord": "sword"}), at="no"),
  close(NURSERY, "kid", "happy", at="just", age="chibi", emote="heart"))
L("Remember that blanket.", dev("corkboard", title="THINGS TO REMEMBER", notes=[{"text": "THE BLANKET", "icon": "🧺", "word": "blanket"}]), hold=0.9)

# ================================================================= CHILDHOOD
L("Your father is not a soldier. He's a farmer who argues with goats.",
  sc(FARM, A("dad", 0.42, pose="point", face="angry", talk=True, emote="vein", emoteWord="argues", tag={"text": "DAD", "sub": "farmer", "word": "father"})),
  sc(FARM, A("dad", 0.5, pose="shrug", face="tired"), at="argues", cam={"move": "shake"}))
L("But your grandfather was one. Twenty-five years in the auxiliaries, and he came home with a limp, a bag of silver and something better: Roman citizenship.",
  sc(HOMEN, A("gramps", 0.4, pose="think", face="smug", tag={"text": "GRANDPA", "sub": "veteran", "word": "grandfather"})),
  sc(FORT, A("aux", 0.45, face="determined"), at="twenty-five", caption="25 YEARS EARLIER"),
  sc(FIELDD, A("gramps", 0.4, pose="slump", face="tired", walkTo=0.55), at="limp"),
  dev("document", at="something", title="DIPLOMA OF CITIZENSHIP", rows=[{"label": "Name", "value": "Your grandfather", "word": "something"},
      {"label": "Service", "value": "25 years, auxiliary", "word": "better"}, {"label": "Reward", "value": "Roman citizen", "word": "citizenship"}],
      who="gramps", stamp="CIVIS ROMANUS"))
L("And that makes you something rare: a citizen of Rome.",
  sc(NURSERY, A("kid", 0.5, age="chibi", face="happy", pose="cheer", emote="exclaim", emoteWord="rare"), stamp={"text": "CITIZEN", "word": "citizen", "x": 0.72, "y": 0.3}))
L("Your mother calls it the most valuable thing the family owns.",
  sc(HOME, A("mum", 0.35, pose="point", face="happy", talk=True, tag={"text": "MUM", "word": "mother"}), A("kid", 0.6, age="chibi", face="happy")),
  close(HOME, "mum", "smug", at="valuable"))
L("More valuable than the goats.", sc(FARM, A("mum", 0.4, pose="hips", face="smug"), A("dad", 0.62, face="surprised", emote="shock")))
L("The goats disagree.", sc({**FARM, "props": [{"kind": "goat", "x": 0.4, "scale": 2.2}, {"kind": "goat", "x": 0.68, "scale": 2.0, "flip": True}]}, cam={"move": "push", "amount": 0.1, "focus": [0.5, 0.6]}))
L("Every night, your grandfather tells the same stories.",
  sc(HOMEN, A("gramps", 0.32, pose="point", face="happy", talk=True), A("kid", 0.62, age="chibi", face="neutral", look=[-1, 0])),
  close(HOMEN, "kid", "tired", at="same", age="chibi", emote="zzz"))
L("Forts in the snow. Bridges built in a day. A centurion who could shout louder than thunder.",
  sc(FORTS, A("aux", 0.3, face="worried", emote="sweat")),
  sc(FIELD, A("aux", 0.35, pose="work", face="determined"), A("aux", 0.6, pose="carry", face="tired"), at="bridges"),
  sc(GLOW("steel"), A("cent", 0.45, pose="point", face="angry", talk=True, emote="steam"), A("aux", 0.75, face="scared", emote="shock"), at="centurion", cam={"move": "shake"}))
L("You don't believe half of them.", close(HOMEN, "kid", "smug", age="chibi", emote="question"))
L("You'll find out later that he left out the worst parts.",
  sc(HOMEN, A("gramps", 0.45, pose="think", face="sad")),
  sc(GLOW("night"), A("aux", 0.5, silhouette=True, pose="slump"), at="worst"))

# ================================================================= CH1
L("Chapter one: The Recruit.", chap(1, "The Recruit", "I"))
L("Years pass, and the cute kid? Gone.",
  dev("before_after", left={"who": "kid", "age": "chibi", "face": "happy", "label": "AGE 4"}, right={"who": "recruit", "face": "determined", "label": "AGE 18"}))
L("You're eighteen. The harvest has failed twice. There are four younger brothers and not enough bread.",
  sc(FARMDUSK, A("recruit", 0.45, face="worried", tag={"text": "YOU", "sub": "age 18", "word": "eighteen"})),
  sc(FIELDD, A("recruit", 0.35, pose="slump", face="sad"), A("dad", 0.62, pose="shrug", face="tired"), at="harvest"),
  sc(HOME, A("kid", 0.25, age="chibi", face="sad"), A("son", 0.42, age="chibi", face="sad"), A("kid", 0.6, age="chibi", face="worried"), A("son", 0.78, age="chibi", face="sad"), at="four",
     counter={"label": "LOAVES", "steps": [{"value": "4", "word": "four"}, {"value": "1", "word": "bread"}]}))
L("And in the market town, a man in red is looking for recruits.",
  sc(MARKET, A("recruit", 0.3, face="surprised", look=[1, 0]), A("recruiter", 0.7, pose="hips", face="smug"), place="THE MARKET TOWN"),
  close(MARKET, "recruiter", "smug", at="looking"))
L("He checks that you're freeborn. He checks that you're fit. He asks if you can read.",
  dev("todo", kicker="RECRUITMENT", title="CHECKLIST", items=[{"text": "Freeborn", "icon": "✓", "word": "freeborn", "strikeWord": "freeborn"},
      {"text": "Fit", "icon": "✓", "word": "fit", "strikeWord": "fit"}, {"text": "Can read?", "icon": "?", "word": "read"}]),
  sc(MARKET, A("recruiter", 0.35, pose="point", face="neutral", talk=True), A("recruit", 0.62, face="worried", emote="sweat"), at="asks"))
L("You can, a little. Your grandfather taught you, with a stick in the dirt.",
  sc(MARKET, A("recruit", 0.5, pose="shrug", face="worried")),
  sc(FARM, A("gramps", 0.35, pose="point", face="happy", tool="vine"), A("kid", 0.6, age="chibi", pose="think", face="neutral"), at="grandfather", caption="10 YEARS EARLIER"))
L("That stick just got you hired.", sc(MARKET, A("recruiter", 0.32, pose="wave", face="happy"), A("recruit", 0.6, face="happy", pose="cheer"), stamp={"text": "HIRED", "word": "hired", "x": 0.75, "y": 0.3}))
L("You raise your hand and swear an oath to the emperor.",
  sc(GLOW("ember", light=[0.5, 0.3]), A("recruit", 0.5, pose="wave", face="determined", rim="#FFB36A")),
  close(GLOW("ember"), "recruit", "determined", at="oath"))
L("It's called the sacramentum. Break it, and the punishment is death.",
  dev("document", title="SACRAMENTUM", rows=[{"label": "Oath to", "value": "The emperor", "word": "sacramentum"}, {"label": "Term", "value": "25 years", "word": "called"},
      {"label": "If broken", "value": "Death", "word": "death"}], who="recruit", stamp="SWORN"),
  close(GLOW("night"), "recruit", "scared", at="death", emote="shock"))
L("You sign up for twenty-five years.", sc(MARKET, A("recruit", 0.5, pose="work", face="determined"), counter={"label": "YEARS SIGNED", "steps": [{"value": "25", "word": "twenty-five"}]}))
L("You're eighteen. You'll be forty-three when you get out. If you get out.",
  dev("before_after", left={"who": "recruit", "face": "happy", "label": "AGE 18"}, right={"who": "old", "face": "tired", "label": "AGE 43"}),
  close(GLOW("night"), "recruit", "worried", at="if", emote="sweat"))
L("The recruiter hands you a small lead tag to wear around your neck.",
  sc(MARKET, A("recruiter", 0.38, pose="point", face="neutral"), A("recruit", 0.62, face="surprised", look=[-1, 0])),
  close(MARKET, "recruit", "neutral", at="tag", callouts=[{"text": "LEAD TAG", "from": [0.72, 0.28], "to": [0.52, 0.5], "word": "tag"}]))
L("It has your name on it.", close(GLOW("warm"), "recruit", "happy"))
L("It's how they'll know who you were.", sc(GLOW("night"), A("recruit", 0.5, face="sad", pose="slump"), cam={"move": "pull", "amount": 0.08}))

# ================================================================= CH2
L("Chapter two: The Mule.", chap(2, "The Mule", "II"))
L("Training starts the next morning, before the sun does.",
  sc(FORT, A("youb", 0.4, face="tired", emote="zzz"), A("cent", 0.7, pose="point", face="angry", talk=True), place="TRAINING CAMP"),
  sc({"kind": "sky", "mood": "night", "night": True, "noTown": True}, A("youb", 0.4, pose="walk", face="tired"), at="before"))
L("You march. Twenty Roman miles in five hours, in full kit.",
  sc(ROAD, A("you", 0.2, walkTo=0.62, pose="walk", face="determined"), cam={"move": "pan", "dir": [-120, 0]}),
  d3("road", "day", [30, 14, 40], [10, 12, 30], at="twenty",
     counter={"label": "MILES · HOURS", "steps": [{"value": "20 mi", "word": "miles"}, {"value": "5 h", "word": "hours"}]}))
L("Your shield. Your armour. Two javelins. A shovel. A saw. A cooking pot. Three days of grain.",
  sc(FIELD, A("you", 0.5, face="neutral"), callouts=[{"text": "SHIELD", "from": [0.2, 0.3], "to": [0.42, 0.55], "word": "shield"},
     {"text": "ARMOUR", "from": [0.8, 0.25], "to": [0.55, 0.45], "word": "armour"}, {"text": "JAVELINS ×2", "from": [0.82, 0.6], "to": [0.6, 0.4], "word": "javelins"}]),
  sc(FIELD, A("youd", 0.5, face="worried"), at="shovel", callouts=[{"text": "SHOVEL", "from": [0.82, 0.3], "to": [0.58, 0.55], "word": "shovel"},
     {"text": "SAW", "from": [0.18, 0.25], "to": [0.42, 0.45], "word": "saw"}, {"text": "COOKING POT", "from": [0.18, 0.7], "to": [0.42, 0.6], "word": "pot"}]),
  sc(blur(FIELD), A("you", 0.5, y=1.45, scale=1.7, pose="carry", face="tired", emote="sweat"), at="three",
     callouts=[{"text": "3 DAYS OF GRAIN", "from": [0.78, 0.3], "to": [0.56, 0.5], "word": "grain"}]))
L("Somewhere between twenty and forty kilos, every single day.",
  sc(ROAD, A("you", 0.45, pose="carry", face="tired", emote="sweat"), counter={"label": "KIT WEIGHT", "steps": [{"value": "20 kg", "word": "twenty"}, {"value": "40 kg", "word": "forty"}]}),
  close(ROAD, "you", "tired", at="every", emote="sweat"))
L("For two hundred years, soldiers like you have been called Marius's mules. Now you know why.",
  sc(ROADD, A("you", 0.3, pose="carry", face="tired"), A("ox", 0.55, pose="carry", face="tired"), A("youb", 0.78, pose="carry", face="tired"), stamp={"text": "MULES", "word": "mules", "x": 0.5, "y": 0.25}),
  close(ROADD, "you", "angry", at="now", emote="vein"))
L("You learn to fight in a line, shield against shield, stabbing with a short sword over the rim.",
  sc(FIELD, A("you", 0.3, face="determined"), A("you", 0.48, face="determined"), A("you", 0.66, face="determined"), A("cent", 0.88, pose="point", face="angry", talk=True)),
  sc(blur(FIELD), A("you", 0.5, y=1.45, scale=1.7, pose="point", face="angry", tool="gladius"), at="stabbing", cam={"move": "shake"}))
L("You learn to dig a ditch, build a wall and pitch a camp, every single night, even if you're leaving at dawn.",
  sc(FIELDD, A("youd", 0.4, pose="work", face="tired"), A("ox", 0.65, pose="work", face="tired")),
  d3("camp", "dusk", [50, 30, 50], [30, 26, 40], at="pitch"),
  close(FIELDD, "youd", "angry", at="leaving", emote="vein"))
L("You sleep in a leather tent with seven other men.",
  sc(TENT, A("youb", 0.25, pose="slump", face="tired"), A("ox", 0.5, face="happy"), A("hisp", 0.75, face="neutral"), place="CONTUBERNIUM · 8 MEN"))
L("Eight men. One tent. One cooking pot.",
  dev("polaroids", photos=[{"who": "youb", "face": "neutral", "caption": "you", "x": 0.2, "y": 0.35}, {"who": "ox", "face": "happy", "caption": "the snorer", "x": 0.4, "y": 0.6},
      {"who": "hisp", "face": "smug", "caption": "Spain", "x": 0.6, "y": 0.35}, {"who": "recruit", "face": "happy", "caption": "the new one", "x": 0.8, "y": 0.6}], string=True),
  sc(TENT, A("youb", 0.3, face="happy"), A("ox", 0.55, face="laugh"), A("hisp", 0.78, face="happy"), at="cooking"))
L("These seven will become closer to you than your own brothers.",
  sc(TENT, A("ox", 0.35, pose="cheer", face="laugh"), A("youb", 0.6, face="happy", emote="heart", emoteWord="brothers")))
L("One of them snores like a dying ox.",
  sc({**TENT, "mood": "night"}, A("ox", 0.45, pose="slump", face="asleep", emote="zzz", tag={"text": "THE SNORER", "word": "snores"})),
  close({**TENT, "mood": "night"}, "youb", "angry", at="ox", emote="vein"))
L("You'll miss it one day.", close({**TENT, "mood": "night"}, "youb", "sad"))
L("And then there's the drill.", sc(FIELD, A("cent", 0.5, pose="hips", face="smug", tag={"text": "THE CENTURION", "word": "drill"})))
L("Shields up. Shields together. Shields over your heads.",
  sc(FIELD, A("you", 0.3, face="determined"), A("you", 0.5, face="determined"), A("you", 0.7, face="determined"), cam={"move": "shake"}),
  sc(FIELD, A("you", 0.4, face="worried"), A("you", 0.56, face="worried"), at="together"),
  sc(FIELD, A("you", 0.5, pose="cheer", face="tired", emote="sweat"), at="over"))
L("Eighty men become one giant tortoise of wood and leather.",
  d3("camp", "day", [20, 40, 30], [10, 30, 22], fog="#C9D6E2"),
  sc(FIELD, *[A("you", 0.15 + i * 0.12, face="determined", scale=0.8) for i in range(7)], at="tortoise",
     stamp={"text": "TESTUDO", "word": "tortoise", "x": 0.5, "y": 0.2}))
L("The first time, someone trips, and the whole tortoise falls over.",
  sc(FIELD, A("you", 0.35, face="surprised"), A("hisp", 0.6, pose="slump", face="scared", emote="shock")),
  sc(FIELD, A("you", 0.3, pose="kneel", face="scared"), A("ox", 0.55, pose="kneel", face="surprised"), A("hisp", 0.78, pose="kneel", face="sad"), at="falls", cam={"move": "shake"}))
L("The centurion carries a stick made of vine wood.", close(FIELD, "cent", "smug", callouts=[{"text": "VINE STICK", "from": [0.78, 0.28], "to": [0.6, 0.5], "word": "vine"}]))
L("He uses it on the man who tripped.", sc(FIELD, A("cent", 0.4, pose="work", face="angry", emote="steam"), A("hisp", 0.65, pose="kneel", face="scared", emote="tears"), cam={"move": "shake"}))
L("Then on the man next to him, for laughing.", sc(FIELD, A("cent", 0.3, pose="point", face="angry"), A("hisp", 0.5, pose="kneel", face="sad"), A("youb", 0.72, face="laugh", emote="notes")))
L("That was you.", close(FIELD, "youb", "scared", emote="shock", tag={"text": "YOU", "word": "you"}))

L("Your pay is three hundred silver denarii a year. Sounds good.",
  sc(FORT, A("youb", 0.45, pose="cheer", face="happy"), counter={"label": "PAY / YEAR", "steps": [{"value": "300 denarii", "word": "denarii"}]}),
  close(FORT, "youb", "smug", at="sounds"))
L("Until they take out money for your food. And your boots. And your tent. And a little set aside for your funeral.",
  dev("document", title="PAY SLIP", rows=[{"label": "Pay", "value": "300", "word": "until"}, {"label": "Food", "value": "− 80", "word": "food"},
      {"label": "Boots", "value": "− 12", "word": "boots"}, {"label": "Tent", "value": "− 10", "word": "tent"}, {"label": "Funeral fund", "value": "− 4", "word": "funeral"}],
      who="youb", stamp="DEDUCTED"),
  close(FORT, "youb", "worried", at="funeral", emote="sweat"))
L("The funeral one is the one that worries you.", sc(GLOW("night"), A("youb", 0.5, pose="think", face="worried", emote="question")))
L("But there are good days too.", sc(FORT, A("youb", 0.35, face="happy"), A("hisp", 0.6, face="happy", pose="wave")))
L("The fort has a bathhouse. Hot rooms, cold pools, gossip and dice.",
  sc(BATH, A("youb", 0.3, face="happy", topKind="bare"), A("ox", 0.7, face="laugh", topKind="bare"), place="THE BATHHOUSE"),
  sc(BATH, A("hisp", 0.4, face="smug", pose="point", talk=True), A("youb", 0.66, face="surprised"), at="gossip"))
L("For one hour, you're not a soldier. You're just a young man from Gaul, losing at dice to a man from Spain.",
  sc(BATH, A("youb", 0.45, face="happy", pose="hips")),
  sc(BATH, A("youb", 0.35, face="sad", emote="tears", emoteWord="losing"), A("hisp", 0.65, pose="cheer", face="laugh"), at="losing",
     counter={"label": "DICE", "steps": [{"value": "0 : 1", "word": "losing"}, {"value": "0 : 7", "word": "spain"}]}))

# ================================================================= CH3
L("Chapter three: The Edge of the World.", chap(3, "The Edge of the World", "III"))
L("In your first year, the emperor dies. A new one takes the throne.",
  sc(GLOW("night"), A("emp2", 0.5, silhouette=True, pose="slump")),
  sc(GLOW("ember", light=[0.5, 0.3]), A("emp", 0.5, pose="hips", face="smug", rim="#FFD27A"), at="new"))
L("His name is Hadrian. And he doesn't want new land.", sc(GLOW("ember"), A("emp", 0.45, pose="cross", face="smug", tag={"text": "HADRIAN", "sub": "emperor", "word": "hadrian"})))
L("He wants borders.", close(GLOW("ember"), "emp", "determined", stamp={"text": "BORDERS", "word": "borders", "x": 0.75, "y": 0.25}))
L("So your legion gets new orders. You're going to Britannia.",
  sc(FORT, A("cent", 0.4, pose="point", face="neutral", talk=True), A("youb", 0.66, face="surprised", emote="exclaim")),
  dev("map", at="going", title="NEW ORDERS", places=[{"name": "GAUL", "x": 0.64, "y": 0.56, "pin": True, "word": "orders"}, {"name": "BRITANNIA", "x": 0.42, "y": 0.22, "pin": True, "big": True, "word": "britannia"}],
      routes=[{"points": [[0.64, 0.56], [0.55, 0.42], [0.42, 0.24]], "word": "britannia", "frames": 22}]))
L("For a boy from sunny Gaul, it's the edge of the known world.",
  sc(FARM, A("youb", 0.4, face="happy"), cam={"move": "pull", "amount": 0.05}),
  sc(RAMPR, A("youb", 0.45, face="worried", emote="sweat"), at="edge"))
L("You cross the sea, throw up over the side, and land in a country where it rains sideways.",
  d3("sea", "cold", [0, 8, 30], [4, 7, 26], fog="#8A96A0", mood="steel"),
  sc(SEA, A("youb", 0.45, pose="slump", face="tired", emote="sweat"), at="throw", cam={"move": "shake"}),
  sc(FORTR, A("you", 0.45, face="tired", flip=True), at="rains"))
L("Your new home is a fort in the cold north.",
  d3("fort", "cold", [40, 30, 50], [30, 26, 44], fog="#C9D6E2", place="NORTHERN BRITANNIA"))
L("You write home asking for socks.",
  sc(BARRACK, A("youb", 0.45, pose="work", face="worried")),
  dev("document", at="socks", title="LETTER HOME", rows=[{"label": "To", "value": "Mother", "word": "home"}, {"label": "Please send", "value": "Socks", "word": "socks"}], who="youb", stamp="BRITANNIA"))
L("You're not the first. A letter found at a fort in this very region mentions a parcel of socks, sandals and two pairs of underpants.",
  sc(FORTS, A("youb", 0.4, face="surprised")),
  dev("document", at="letter", title="A REAL LETTER, FOUND", rows=[{"label": "Found at", "value": "A fort in the north", "word": "found"},
      {"label": "Sent", "value": "Socks, sandals", "word": "socks"}, {"label": "Also", "value": "2 pairs of underpants", "word": "underpants"}], stamp="ORIGINAL"),
  close(FORTS, "youb", "laugh", at="underpants"))
L("The frontier is cold.", sc(FORTS, A("you", 0.45, pose="cross", face="tired", emote="sweat"), cam={"move": "pan", "dir": [-60, 0]}))
L("But life goes on, even at the edge of the world.", sc(FORT, A("lady", 0.35, face="happy", pose="wave"), A("youb", 0.65, face="happy")))
L("Officers' wives throw parties. A few years before you arrived, one of them sent a letter inviting a friend to her birthday.",
  sc(HOME, A("lady", 0.3, face="laugh", pose="cheer"), A("brica", 0.55, face="happy", scale=0.95), A("lady", 0.78, face="happy", flip=True)),
  sc(HOME, A("lady", 0.45, pose="work", face="happy"), at="letter", caption="A FEW YEARS EARLIER"),
  dev("document", at="birthday", title="BIRTHDAY INVITATION", rows=[{"label": "From", "value": "An officer's wife", "word": "inviting"}, {"label": "Party", "value": "Her birthday", "word": "birthday"}], stamp="COME!"))
L("Two thousand years later, that letter is one of the oldest pieces of writing by a woman in Latin ever found.",
  sc(GLOW("warm"), A("lady", 0.5, face="smug", pose="hips"), counter={"label": "YEARS LATER", "steps": [{"value": "2,000", "word": "thousand"}]}),
  sc(GLOW("teal"), A("lady", 0.5, face="happy", rim="#FFE9A8"), at="oldest", stamp={"text": "FOUND", "word": "found", "x": 0.72, "y": 0.3}))
L("You never get an invitation.", close(FORTS, "youb", "sad", emote="tears"))

L("So here's a question before we keep going.", sc(GLOW("dusk"), A("youb", 0.5, pose="think", face="neutral", emote="question")))
L("Which life should we live next? A gladiator, a Viking, or a pharaoh's tomb builder? Tell me in the comments.",
  dev("poll", question="Which life should we live next?", names=["Gladiator", "Viking", "Pharaoh's tomb builder"]))

# ================================================================= CH4
L("Chapter four: The Wall.", chap(4, "The Wall", "IV"))
L("You're twenty-three when the emperor himself arrives in Britannia.",
  sc(FORT, A("youb", 0.3, face="surprised", tag={"text": "YOU", "sub": "age 23", "word": "twenty-three"}), A("emp", 0.62, pose="wave", face="smug", walkTo=0.55), place="BRITANNIA · AD 122"))
L("He looks at the hills. He looks at the tribes beyond them.",
  d3("wall", "cold", [60, 40, 90], [40, 34, 80], fog="#C9D6E2", mood="steel"),
  sc(RAMP, A("raider", 0.3, silhouette=True), A("raider", 0.5, silhouette=True, scale=0.9), A("raider", 0.7, silhouette=True, scale=0.85), at="tribes"))
L("And he says: build a wall.", close(GLOW("ember"), "emp", "determined", talk=True, stamp={"text": "BUILD A WALL", "word": "wall", "x": 0.5, "y": 0.22}))
L("Not a fence. A wall. Eighty Roman miles long, from one sea to the other.",
  sc(FIELD, A("emp", 0.3, pose="point", face="neutral", talk=True), A("cent", 0.62, face="surprised", emote="shock")),
  dev("map", at="eighty", title="THE WALL", places=[{"name": "WEST SEA", "x": 0.18, "y": 0.42, "word": "one"}, {"name": "EAST SEA", "x": 0.82, "y": 0.38, "word": "other"}],
      routes=[{"points": [[0.2, 0.42], [0.4, 0.36], [0.6, 0.4], [0.8, 0.38]], "word": "miles", "frames": 30}], stamp="80 MILES"))
L("And guess who's building it?", sc(FIELD, A("emp", 0.4, pose="point", face="smug"), A("youb", 0.7, face="worried", emote="question")))
L("Not slaves. Not workers. Soldiers. You.",
  sc(FIELD, A("trader", 0.5, silhouette=True), stamp={"text": "✗", "word": "slaves", "x": 0.5, "y": 0.4}),
  sc(FIELD, A("youd", 0.5, pose="slump", face="tired"), at="soldiers"),
  close(FIELD, "youd", "surprised", at="you", emote="shock"))
L("You quarry stone. You cut turf. You haul it up hills in the wind and rain.",
  sc(FIELDD, A("youd", 0.4, pose="work", face="tired"), A("ox", 0.66, pose="work", face="determined")),
  sc(FIELD, A("youd", 0.45, pose="work", face="tired", emote="sweat"), at="turf"),
  sc({**FIELD, "mood": "steel", "fx": "rain"}, A("youd", 0.3, pose="carry", face="tired", walkTo=0.6), at="haul", cam={"move": "pan", "dir": [-100, 0]}))
L("Every mile, a small fort. Between them, towers.",
  d3("wall", "day", [100, 46, 60], [60, 36, 50]),
  sc(FORT, A("you", 0.3, face="determined", scale=0.8), at="towers", cam={"move": "pan", "dir": [-120, 0]}))
L("Your century carves its name into a stone, so Rome will know who built this stretch.",
  sc(FORT, A("youd", 0.4, pose="work", face="determined", tool="gladius"), A("ox", 0.65, face="happy", pose="point")),
  sc(blur(FORT), A("youd", 0.3, face="smug"), at="stone", cam={"move": "push", "amount": 0.08, "focus": [0.6, 0.6]},
     callouts=[{"text": "CENTURY OF YOUR CENTURION · BUILT THIS", "from": [0.6, 0.25], "to": [0.62, 0.7], "word": "stone"}],
     set={**blur(FORT), "props": [{"kind": "stone", "x": 0.62, "scale": 2.2}]}))
L("It takes about six years.", sc(RAMP, A("youd", 0.45, face="tired"), counter={"label": "YEARS", "steps": [{"value": "1", "word": "takes"}, {"value": "6", "word": "six"}]}))
L("By the end, your hands look like your grandfather's.",
  close(RAMP, "youd", "sad"),
  dev("before_after", at="grandfather's", left={"who": "gramps", "face": "smug", "label": "GRANDPA"}, right={"who": "youd", "face": "tired", "label": "YOU, 29"}))

L("Then the wall is finished, and you guard it.", d3("wall", "dusk", [40, 30, 70], [10, 24, 56], fog="#E8C4A0"),
  sc(RAMP, A("you", 0.45, face="determined"), at="guard"))
L("You check traders. You count cattle. You watch the mist.",
  sc(FORT, A("you", 0.3, pose="point", face="neutral"), A("trader", 0.62, face="worried")),
  sc(FIELD, A("you", 0.45, pose="think", face="tired"), at="cattle", counter={"label": "CATTLE", "steps": [{"value": "1", "word": "count"}, {"value": "47", "word": "cattle"}]}),
  sc(RAMP, A("you", 0.45, face="neutral"), at="mist"))
L("Most days, nothing happens.", sc(RAMP, A("you", 0.45, face="tired", emote="zzz"), cam={"move": "pull", "amount": 0.05}))
L("Some nights, something does.", sc(RAMPN, A("you", 0.45, face="worried", look=[1, 0], emote="exclaim")))
L("A raid in the dark. Arrows over the parapet. Shouting in a language you never learned.",
  sc(RAMPN, A("raider", 0.3, silhouette=True, pose="point"), A("raider", 0.55, silhouette=True, pose="cheer")),
  sc(RAMPN, A("you", 0.45, pose="cross", face="scared", emote="shock"), at="arrows", cam={"move": "shake"}),
  sc(GLOW("night"), A("raider", 0.5, silhouette=True, pose="point", talk=True), at="shouting", cam={"move": "shake"}))
L("Your shield takes a hit. Then another.", close(RAMPN, "you", "angry", emote="vein", cam=None), sc(RAMPN, A("you", 0.45, pose="kneel", face="scared"), at="another", cam={"move": "shake"}))
L("And when the sun comes up, one bunk in your barrack room is empty.",
  sc(RAMP, A("you", 0.45, face="tired", pose="slump")),
  sc({**BARRACK, "props": [{"kind": "bunk", "x": 0.5, "scale": 1.3}]}, at="bunk", cam={"move": "push", "amount": 0.1, "focus": [0.5, 0.6]}))
L("The snoring one.",
  dev("polaroids", photos=[{"who": "youb", "face": "neutral", "caption": "you", "x": 0.2, "y": 0.35}, {"who": "ox", "face": "happy", "caption": "the snorer", "x": 0.42, "y": 0.6, "cross": True, "crossWord": "snoring"},
      {"who": "hisp", "face": "smug", "caption": "Spain", "x": 0.62, "y": 0.35}, {"who": "recruit", "face": "happy", "caption": "the new one", "x": 0.82, "y": 0.6}], string=True), hold=1.0)
L("The legion pays for his stone. You carve his name yourself.",
  sc({**BARRACK, "props": [{"kind": "stone", "x": 0.6, "scale": 1.8}]}, A("youb", 0.35, pose="kneel", face="sad")),
  close(BARRACK, "youb", "sad", at="carve", tool="gladius", emote="tears"))
L("That night, nobody snores.", sc(BARRACKN, A("youb", 0.35, pose="slump", face="sad"), A("hisp", 0.7, pose="slump", face="sad")))
L("It's the quietest the room has ever been.", sc(BARRACKN, cam={"move": "push", "amount": 0.06, "focus": [0.5, 0.5]}))
L("You hate it.", close(BARRACKN, "youb", "sad", emote="tears"))

# ================================================================= CH5
L("Chapter five: The Family You're Not Allowed to Have.", chap(5, "The Family You're Not Allowed to Have", "V"))
L("Here's the strange part.", sc(FORT, A("youb", 0.45, face="neutral", pose="think", emote="question")))
L("As a legionary, you're not allowed to marry.",
  dev("document", title="ARMY RULES", rows=[{"label": "Legionaries", "value": "May not marry", "word": "marry"}], stamp="FORBIDDEN"))
L("But you do meet someone. Her name is Brica. She sells bread outside the fort.",
  sc(FORT, A("youb", 0.3, face="surprised", emote="heart", emoteWord="someone"), A("brica", 0.62, face="happy", flip=True)),
  sc(MARKET, A("brica", 0.5, face="happy", pose="wave", tag={"text": "BRICA", "sub": "sells bread", "word": "brica"}), at="brica"))
L("You build a life in the little town outside the gate, unofficially.",
  sc(HOME, A("youb", 0.35, face="happy", pose="carry"), A("brica", 0.62, face="happy")),
  sc(HOME, A("youb", 0.4, face="smug"), A("brica", 0.6, face="smug"), at="unofficially", stamp={"text": "UNOFFICIAL", "word": "unofficially", "x": 0.75, "y": 0.25}))
L("Two kids. A small house. A dog that hates the centurion.",
  sc(HOME, A("girl", 0.35, age="chibi", face="happy"), A("son", 0.6, age="chibi", face="laugh")),
  sc(FORT, A("cent", 0.6, face="scared", emote="sweat", pose="cross"), at="dog", cam={"move": "shake"}))
L("Rome pretends not to see.", sc(FORT, A("cent", 0.5, pose="cross", face="smug", look=[-1, 0])))
L("Your daughter learns to walk on the road outside the fort.", sc(ROAD, A("girl", 0.3, age="chibi", walkTo=0.5, pose="walk", face="happy"), A("youb", 0.7, pose="kneel", face="happy")))
L("Your son learns to march by copying you, with a wooden sword and a cooking pot for a helmet.",
  sc(ROAD, A("youb", 0.35, pose="walk", face="determined"), A("son", 0.65, age="chibi", pose="walk", face="determined")),
  close(ROAD, "son", "smug", at="wooden", age="chibi", tool="gladius", callouts=[{"text": "COOKING POT HELMET", "from": [0.78, 0.2], "to": [0.55, 0.35], "word": "pot"}]))
L("Brica says he has your walk.", sc(HOME, A("brica", 0.4, pose="point", face="happy", talk=True), A("youb", 0.66, face="smug")))
L("You tell her that's the limp.", close(HOME, "youb", "tired", emote="sweat"))
L("Remember that blanket? Your mother sent it with you when you left.",
  dev("corkboard", title="THINGS TO REMEMBER", notes=[{"text": "THE BLANKET", "icon": "🧺", "word": "blanket"}, {"text": "FROM MUM", "icon": "✉", "word": "mother"}]),
  sc(FARM, A("mum", 0.35, pose="wave", face="sad", emote="tears"), A("recruit", 0.65, face="sad", pose="carry"), at="sent", caption="YEARS AGO"))
L("Now your daughter sleeps under it.", sc({**HOMEN, "props": [{"kind": "basket", "x": 0.45}, {"kind": "fire", "x": 0.85}]}, A("girl", 0.45, age="chibi", y=0.8, face="asleep", emote="zzz"),
  A("youb", 0.75, face="happy", emote="heart")))

L("Years pass.", chap(0, "Years pass", "⌛", kicker="AD 122 → 138"))
L("You're promoted. Better pay, fewer latrine duties.",
  sc(FORT, A("you", 0.45, pose="cheer", face="happy"), stamp={"text": "PROMOTED", "word": "promoted", "x": 0.72, "y": 0.28}),
  dev("todo", at="better", kicker="NEW RANK", title="PERKS", items=[{"text": "Better pay", "icon": "＋", "word": "pay"}, {"text": "Latrine duty", "icon": "−", "word": "latrine", "strikeWord": "duties"}]))
L("Your knees start to sound like your grandfather's knees.", sc(FORT, A("vet", 0.45, pose="kneel", face="tired", emote="sweat"), cam={"move": "shake"}))
L("And one morning, you count the years on your fingers, and you run out of fingers.",
  sc(BARRACK, A("vet", 0.45, pose="think", face="neutral")),
  close(BARRACK, "vet", "surprised", at="run", emote="shock"))
L("Twenty-one years.", sc(GLOW("dusk"), A("vet", 0.5, face="tired"), counter={"label": "YEARS SERVED", "steps": [{"value": "21", "word": "years"}]}))
L("Four more.", close(GLOW("dusk"), "vet", "tired", counter={"label": "YEARS LEFT", "steps": [{"value": "4", "word": "four"}]}))

# ================================================================= CH6
L("Chapter six: The Last Order.", chap(6, "The Last Order", "VI"))
L("That same year, the emperor dies. Hadrian is gone.",
  sc(GLOW("night"), A("emp", 0.5, pose="slump", face="asleep", silhouette=True)),
  dev("polaroids", at="hadrian", photos=[{"who": "emp", "face": "smug", "caption": "Hadrian, AD 117-138", "x": 0.5, "y": 0.45, "cross": True, "crossWord": "gone"}]))
L("The new emperor wants to show Rome he's strong.", sc(GLOW("ember"), A("emp2", 0.5, pose="cheer", face="determined", rim="#FFD27A", tag={"text": "NEW EMPEROR", "word": "new"})))
L("So he looks at your wall, the wall you spent your youth building,",
  d3("wall", "day", [70, 40, 90], [30, 30, 64]),
  sc(RAMP, A("vet", 0.45, face="sad"), at="youth"))
L("and he decides it's in the wrong place.", close(GLOW("ember"), "emp2", "smug", stamp={"text": "WRONG PLACE", "word": "wrong", "x": 0.72, "y": 0.28}))
L("Three years later, the new orders arrive. March a hundred miles north.",
  dev("document", title="NEW ORDERS · AD 141", rows=[{"label": "From", "value": "The new emperor", "word": "orders"}, {"label": "March", "value": "100 miles north", "word": "north"}], stamp="URGENT"),
  dev("map", at="march", title="MARCH NORTH", places=[{"name": "OLD WALL", "x": 0.5, "y": 0.7, "pin": True, "word": "march"}, {"name": "NEW WALL", "x": 0.5, "y": 0.22, "pin": True, "big": True, "word": "north"}],
      routes=[{"points": [[0.5, 0.7], [0.46, 0.45], [0.5, 0.24]], "word": "hundred", "frames": 22, "dashed": True}]))
L("And build another wall.", close(BARRACK, "vet", "surprised", emote="shock"))
L("You laugh so hard that the centurion almost lets it go.", sc(BARRACK, A("vet", 0.35, pose="cheer", face="laugh", emote="tears"), A("cent", 0.68, face="smug", pose="cross")))
L("Almost.", close(BARRACK, "cent", "angry", emote="vein"))
L("So you pack the shovel again.", sc(BARRACK, A("vet", 0.45, pose="carry", face="tired")))
L("You march north through hills you've never seen, with men who were babies when you enlisted.",
  d3("road", "cold", [40, 20, 50], [14, 14, 36], fog="#C9D6E2", mood="steel"),
  sc(ROADC, A("vet", 0.25, pose="walk", face="tired"), A("you", 0.5, pose="walk", face="happy"), A("you", 0.72, pose="walk", face="happy"), at="babies", cam={"move": "pan", "dir": [-100, 0]}))
L("They call you grandfather.", sc(ROADC, A("you", 0.3, face="laugh", pose="point"), A("vet", 0.65, face="angry", emote="vein")))
L("You're forty-two, and it's your last year.", close(ROADC, "vet", "tired", tag={"text": "YOU", "sub": "age 42", "word": "forty-two"}))
L("You dig the ditch. You stack the turf. Your back sends you a formal complaint.",
  sc({**FIELD, "mood": "steel"}, A("vet", 0.4, pose="work", face="tired")),
  sc({**FIELD, "mood": "steel"}, A("vet", 0.45, pose="carry", face="tired", emote="sweat"), at="stack"),
  dev("document", at="back", title="FORMAL COMPLAINT", rows=[{"label": "From", "value": "Your back", "word": "back"}, {"label": "Subject", "value": "Turf", "word": "complaint"}], stamp="IGNORED"))
L("And for the second time in your life, you help build a wall across Britannia.",
  sc({**FIELD, "mood": "steel"}, A("vet", 0.3, pose="work", face="determined"), A("you", 0.55, pose="work", face="tired"), A("you", 0.78, pose="carry", face="tired")),
  d3("wall", "cold", [80, 36, 80], [40, 28, 60], fog="#C9D6E2", mood="steel", at="across"))
L("This one is made of earth instead of stone.", sc({**FIELD, "mood": "steel"}, A("vet", 0.45, pose="shrug", face="tired"), stamp={"text": "TURF", "word": "earth", "x": 0.72, "y": 0.3}))
L("Rome will abandon it within twenty years.", sc({**FIELD, "mood": "steel", "fx": "rain"}, cam={"move": "pull", "amount": 0.08}, counter={"label": "YEARS IT LASTS", "steps": [{"value": "20", "word": "twenty"}]}))
L("Of course it will.", close({**FIELD, "mood": "steel"}, "vet", "tired", emote="sweat"))

# ================================================================= CH7
L("Chapter seven: Honesta Missio.", chap(7, "Honesta Missio", "VII"))
L("And then, finally, it's over.", sc(FORT, A("vet", 0.45, face="tired", pose="slump"), cam={"move": "pull", "amount": 0.06}))
L("You stand in front of the standards one last time.", sc({**FORT, "props": [{"kind": "standard", "x": 0.3}, {"kind": "standard", "x": 0.7}]}, A("vet", 0.5, face="determined")))
L("They give you your honourable discharge, the honesta missio,",
  dev("document", title="HONESTA MISSIO", rows=[{"label": "Service", "value": "25 years", "word": "honourable"}, {"label": "Discharge", "value": "Honourable", "word": "discharge"}], who="vet", stamp="DISCHARGED"))
L("and a retirement payment worth ten years of wages.", sc(FORT, A("old", 0.45, pose="cheer", face="happy"), counter={"label": "RETIREMENT", "steps": [{"value": "10 years' pay", "word": "ten"}]}))
L("And now, finally, you can marry Brica properly.",
  sc(HOME, A("old", 0.38, face="happy", emote="heart"), A("brica", 0.62, face="laugh")),
  sc(HOME, A("old", 0.32, face="happy"), A("brica", 0.5, face="happy"), A("girl", 0.68, face="happy", scale=0.9), A("son", 0.84, face="laugh", scale=0.95, topKind="legion"), at="properly"))
L("You were eighteen when you swore the oath.", dev("before_after", left={"who": "recruit", "face": "determined", "label": "AGE 18"}, right={"who": "old", "face": "tired", "label": "AGE 43"}))
L("You're forty-three now. Grey at the temples. A limp. A bag of silver. A Roman name.",
  sc(FIELDD, A("old", 0.45, face="tired")),
  close(FIELDD, "old", "neutral", at="grey", callouts=[{"text": "GREY", "from": [0.75, 0.2], "to": [0.58, 0.3], "word": "grey"}]),
  sc(FIELDD, A("old", 0.45, pose="slump", face="smug", walkTo=0.55), at="limp"))
L("Just like your grandfather.", dev("before_after", left={"who": "gramps", "face": "smug", "label": "GRANDPA"}, right={"who": "old", "face": "smug", "label": "YOU"}))

L("You buy a small farm near the wall you built.", sc({**FARMDUSK, "mood": "dusk"}, A("old", 0.35, face="happy"), A("brica", 0.55, face="happy")))
L("Some evenings, you walk up to it and touch the stone with your century's name on it.",
  d3("wall", "dusk", [30, 20, 50], [16, 16, 40], fog="#E8C4A0"),
  sc({**RAMP, "mood": "dusk", "props": [{"kind": "stone", "x": 0.6, "scale": 1.8}]}, A("old", 0.4, face="sad", pose="point"), at="touch"))
L("Nobody passing by knows who carved it.", sc({**RAMP, "mood": "dusk"}, A("trader", 0.3, walkTo=0.8, pose="walk", face="neutral"), A("old", 0.15, face="neutral", scale=0.9)))
L("But you do.", close({**RAMP, "mood": "dusk"}, "old", "smug"))

L("You marched thousands of miles, built a wall across a country, buried your best friend and outlived an emperor.",
  dev("todo", kicker="A LIFE", title="DONE", items=[{"text": "Marched thousands of miles", "word": "marched", "strikeWord": "miles"},
      {"text": "Built a wall across a country", "word": "built", "strikeWord": "country"}, {"text": "Buried your best friend", "word": "buried", "strikeWord": "friend"},
      {"text": "Outlived an emperor", "word": "outlived", "strikeWord": "emperor"}]))
L("And somewhere in a box in your house is a small, worn-out blanket.",
  sc(HOMEN, A("old", 0.45, pose="kneel", face="happy", emote="heart")),
  dev("corkboard", at="blanket", title="THINGS TO REMEMBER", notes=[{"text": "THE BLANKET", "icon": "🧺", "word": "blanket", "old": True}]))
L("So, knowing all of it, the cold, the marching, the friends you'd lose and the wall you'd build twice,",
  sc(FORTS, A("you", 0.45, face="tired")),
  sc(ROAD, A("you", 0.2, walkTo=0.6, pose="walk", face="tired"), at="marching", cam={"move": "pan", "dir": [-100, 0]}),
  dev("polaroids", at="friends", photos=[{"who": "ox", "face": "happy", "caption": "the snorer", "x": 0.5, "y": 0.45, "cross": True}]),
  d3("wall", "dusk", [80, 40, 90], [50, 30, 70], fog="#E8C4A0", at="twice"))
L("would you still choose to be born as a Roman legionary?",
  dev("end", question="Would you still choose it?", text="Which life should we live next? Tell me in the comments.", who="kid", age="chibi"), hold=1.2)

spec = {"slug": "roman-legionary", "style": "lore", "title": "What If You Were Born As a Roman Legionary?",
        "audio": {"kokoro_voice": "am_michael+am_puck", "speed": float(sys.argv[2]) if len(sys.argv) > 2 else 0.85}, "cast": CAST, "beats": B}

# word check: every `at` / overlay word must be in its line
def words(s): return [re.sub(r"[^a-z0-9'-]", "", w.lower()).strip("'") for w in s.split()]
bad = []
for i, b in enumerate(B):
    ws = set(words(b["say"])) | {w.replace("'s", "") for w in words(b["say"])}
    for sh in b.get("shots") or [b["show"]]:
        cand = []
        if sh.get("at"): cand.append(sh["at"])
        for k in ("counter",):
            if sh.get(k): cand += [s.get("word") for s in sh[k].get("steps", [])]
        for k in ("stamp", "heroTitle", "bubble", "placeTitle"):
            if isinstance(sh.get(k), dict) and sh[k].get("word"): cand.append(sh[k]["word"])
        for c in sh.get("callouts", []): cand.append(c.get("word"))
        for r in sh.get("rows", []) + sh.get("items", []) + sh.get("notes", []) + sh.get("places", []) + sh.get("routes", []):
            cand += [r.get("word"), r.get("strikeWord")]
        for a in sh.get("cast", []):
            cand += [a.get("emoteWord"), (a.get("tag") or {}).get("word"), (a.get("holo") or {}).get("word"), (a.get("holo") or {}).get("untilWord")]
        for p in sh.get("photos", []): cand.append(p.get("crossWord"))
        for c in cand:
            if c and c.lower() not in ws: bad.append((i + 1, c, b["say"][:50]))
for x in bad: print("WORD MISSING:", x)
json.dump(spec, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
print(len(B), "lines,", sum(len(b.get("shots") or [1]) for b in B), "shots")
