# Lore style ("If you were born as…"): animation and script rules

> Code: `animator/src/lore/` (composition "Long" with spec `"style": "lore"`), gates: `scripts/check_lore_spec.py`,
> skill: `.claude/skills/lore-animator/`. Example spec: `docs/lore-example-spec.json`.


Study of 5 reference videos from one channel (@borninlore), 27 Nov 2026. Purpose: the rule book for a reusable skill that makes
new videos in this style with **our own original characters and topics** (we copy techniques, never their characters, names or art).

| Video | Length | Shots | Avg shot | Render |
|---|---|---|---|---|
| Born as Kratos | 8:06 | 214 | 2.3 s | 2D vector |
| Born as Ghost | 13:18 | 341 | 2.3 s | 2D vector |
| Born as Master Chief | 12:54 | 480 | 1.6 s | 2D vector |
| Born as CJ | 11:13 | 302 | 2.2 s | 2D vector |
| Doom Slayer's life in 10 min | 10:58 | 195 | 3.4 s | toon-shaded 3D (the odd one out) |

How it was measured: every frame decoded at 30 fps on a 320x180 proxy; per frame we measured cut strength (colour histogram +
pixel difference), global camera motion (ORB features, similarity transform: zoom, pan, rotation), still frames and black frames.
Voiceover transcribed locally (Whisper small.en) and lined up with the shots. Then visual study of the first 24 s of each video at
2 fps, a frame every 5 s across all five, and five 2-second windows at full 30 fps (expressions, title reveals, transitions,
time-lapse, 3D walk).

---

## 1. The hook (first ~15 s): one fixed formula, used in all 5

Word for word, the five openings follow the same five beats:

| Beat | Time | Words (pattern) | Picture |
|---|---|---|---|
| 1. Identity | 0-2 s | "If you were born as **X**," | Adult hero portrait, chest-up, slow push-in, blurred lit background. Name fades in big (serif, bevel) at ~1.2 s, then "(that's you)" in small italics under it at ~1.6 s |
| 2. Three feats | 2-9 s | "you'd **A**. Then **B**. Then **C**." Each feat is short, concrete and extreme, and they escalate | Rapid flash-forward montage, one shot per feat, 0.5-1.5 s each, the most iconic moments of the whole life |
| 3. The twist loop | 9-13 s | A question, then a shocking short answer that is NOT explained: "And the man who finally kills you? You'll call him Sir." / "The first friend to hug you when you come home? He's the one who sold you out." / "And your last words to him? Just one." | Darkest or most dramatic shot of the montage; the answer lands on a hard cut or a stamp |
| 4. The rewind | 12-14 s | "**But right now…**" | Rewind effect (VHS "◀◀ REW" lines, or the book of their life opens on "Prologue") |
| 5. The baby | 14-20 s | "You're a baby in **[place]**. No **[iconic item]**, no **[iconic item]**." | Chibi baby version of the hero, happy, in a cosy room. The future gear appears as a **dotted blue hologram outline** over the baby (mask, gun), then shatters away; the baby goes "o" with surprise lines |

Then, inside the first minute: **"Remember that [thing]."** (a coin, a laugh, a city, a name). It is planted on screen (pinned to a
"Things to remember" corkboard, or a sticky note) and paid off minutes later. Around 45-90 s: **"Years pass, and the cute kid? Gone."**
and the design switches from chibi to adult.

Why it works: beat 1 says what the video is in 2 s, beat 2 promises spectacle, beat 3 opens a loop only the full video closes,
beat 4-5 turns it into a story with a beginning, and "Remember that" creates a second loop right away.

**Hook template for our videos:**
`If you were born as a [worker], you'd [feat 1]. Then [feat 2]. Then [feat 3]. And [the twist question]? [Short shocking answer.]
But right now… you're a baby in [place]. No [tool], no [uniform].`

## 2. Script and voice rules

- **Second person all the way through.** "You", never "he". The viewer *is* the character.
- **Life told in order, birth to end (or present)**, as chapters. Age and year markers drive it: "At 13…", "It's 2511.", "Years pass."
- **Short lines.** Most sentences are 4-12 words. One idea per line. Measured pace (Kratos and Ghost, full scripts): about **150-160 words a minute overall,
  177 wpm while speaking in both**, speech fills ~86 % of the time, median pause between lines 0.45 s.
  For our Kokoro voice at 1.1 speed this is about right; 10 min ≈ 1,500 words.
- **Deadpan jokes after dark beats**, 2-4 words: "Not a fashion choice.", "Always read the fine print.", "Totally worth it.",
  "Long story.", "Honestly." They release tension, then the story moves on.
- **Open loops on purpose**: "Remember that name.", "Hold that thought.", "It matters later." Each one gets an on-screen plant and
  a later payoff.
- **Pattern of expectation and reversal**: "You try very hard not to start Ragnarok. / You start Ragnarok."
- **Mid-video engagement break at 33-40 % of the runtime**: "Quick pause. Which character should be born next? Drop a name in the
  comments. The most liked one is next." Shown as a comment-box UI with fake-looking suggestions, then a "Keep the lore going"
  checklist (become a member / like / subscribe) ticking itself.
- **Ending**: a callback to the opening device (the Deal, the coin), a one-line summary of the whole life ("You killed a pantheon,
  lost everything twice, and still learned how to be a dad."), then a direct question to the viewer ("Would you still make that deal?").
  The book of their life closes on a page with the question, the next-character prompt and a red wax-seal subscribe button.

## 3. Characters

- **Two designs per hero.** Childhood = **chibi** (huge round head, dot or oval eyes, tiny body, thick brown outline).
  Adult = **semi-realistic caricature** (realistic proportions, strong jaw, stubble, 2-3 tone cel shading, thick dark outline).
  The switch happens on "Years pass…".
- **Line**: dark brown/black outline ~4-6 px at 1080p, inner lines thinner. Flat fills, one shadow tone, occasional rim light in
  dark scenes.
- **Animation is cut-out (puppet) animation, smooth at 30 fps.** Only 13-20 % of frames are fully still, and the "hold, then move"
  pattern of drawing on twos is ~1 % in the 2D videos. Parts move on tweens: head tilt, blink, brow, mouth, arm swing.
  (The 3D Doom video is different: ~10 % hold-then-move, so its 3D characters are animated on twos.)
- **Expressions are swaps, not morphs.** A face changes from neutral to angry or surprised between two frames (seen at frame
  level: the baby's brows flip down in one frame). The swap is sold by an **emote icon** that pops in with a small overshoot and
  then loops gently: anger vein ✚, steam puffs, hearts, "?" in a thought bubble, sweat drop, surprise burst lines, happy closed eyes,
  tears.
- **Acting is mostly standing poses.** Characters stand, turn, point, cross arms, kneel. Big actions are told by **pose swaps and
  jump cuts**, not full animation. Example at 30 fps: loading a truck = the character "teleports" between the stack and the truck
  every ~5-10 frames while boxes pile up, with a ▶▶ fast-forward icon in the corner.
- **Speech**: speech bubbles with a tail (white, rounded, bold sans), or a CRT video-call screen. Mouths flap only lightly.
- **Name tags**: a white rounded label pops in next to a new character with a tiny caption under it ("CALLISTO / your mom",
  "SWEET / brother"). Villains get bold callouts with a curved arrow ("MOTHER DEMON", "THE DARK LORD").

**How the kit draws them (rebuilt 27 Nov 2026 to copy the reference look closely, `animator/src/lore/cast.jsx`):**
- Chibi: a perfect circle head with a big cel-shadow crescent on the lower right, black oval eyes with two white highlights, short
  thick brows, a tiny nose curve, pink blush, half-circle ears; a small tunic body, thick boneless arms with ball hands, round shoes.
- Adult: a ~7.5-heads-tall "wooden mannequin" - every limb segment (upper arm, forearm, thigh, shin) is its own outlined capsule, so
  the joints read; mitten hands with a thumb line; one hard cel shadow on the side away from the light; faint muscle lines on bare
  arms and chests. Face: cheekbones and a narrowing jaw, almond eyes with a heavy upper lid, tapered brows, a shaded nose, smile lines,
  stubble as a transparent hair-colour layer.
- Side characters (mums, kids' friends) can use `"head": "round"` - the chibi head on an adult body, as the reference does - and
  `"soft": true` for thinner brows and lashes. `topKind` adds `tank`, `bare` and `dress` (with a gold belt).
- Characters use a 6 px outline, sets 3.5 px, so the cast always reads first.

## 4. Backgrounds and world

- **How the kit draws them**: interiors have a meander band, a gradient wall with soft painted shadow blobs, a shuttered window
  with a view and a light patch, a skirting board and side-view plank floors; props have one shadow side (sofa, armchair, TV,
  photo wall, plant, clock, basket, shelf...). The default street is a row of clapboard houses with porches, a picket fence, a lawn,
  a kerb and a road (`"terrace": true` for the old brick row). Outdoor skies have a cloud bank, distant hills and a town silhouette.
  Every set gets a warm soft-light grade, a light vignette and fine animated grain.

- Flat vector sets with a simple perspective: rooms, streets, bars, prison blocks, deserts, snowy forests, space.
- **One colour temperature per scene**: warm cream for childhood, ember orange for war and hell, navy and violet for night, teal for
  tech, sepia for flashbacks.
- **Depth**: background often blurred, light glows and god rays, particles (embers, rain, snow, dust), soft vignette.
- **Source and place tags**: a small dark rounded tag in the top-right corner names the place and year ("GTA: SAN ANDREAS · LOS SANTOS",
  "GOD OF WAR II · 2007"). Big place titles appear on screen ("MANCHESTER, ENGLAND").

## 5. The recurring devices (the channel's "props kit")

These carry most of the storytelling and are re-used in every video:

| Device | What it does |
|---|---|
| Book "The Life of X" | Frame story: opens at the rewind, chapter pages, closes at the end |
| Chapter card | Black screen, small icon, "CHAPTER IV" in small caps, title in a serif. **1.7-1.9 s, every 35-50 s** (11-13 per video) |
| "Things to remember" corkboard | Every "Remember that" becomes a pinned note; the board comes back and gets updated (crossed out, new notes) |
| To-do list / contract | Struck through item by item with a red line and a spark ("Kratos's TO-DO LIST", "THE DEAL… NO REFUNDS") |
| Map with routes | Paper map, red route lines drawing on, pins, a stamp ("ROBBED", "$60,000,000") |
| Polaroids and posters | Pinned photos, "WANTED"-style posters, ID cards with a red "DECEASED" stamp |
| Counters and bars | "HUMANITY SAVED ×1 → ×8 → ×63,284 → ∞", "BEATINGS 995+", "DEATHS: 2", "YEAR 10" tally marks, health bars |
| Before / after frames | Two framed portraits side by side |
| Strike-through word swap | "~~FASHION~~ A PROMISE" |
| Dotted hologram outline | Shows the future (gear, weapon) over the present |
| TV news | "BREAKING" lower third on an old TV |

## 6. Camera

- **Almost every shot moves.** Across the 4 2D videos: slow push-in on 22-33 % of shots (median rate **3-5 % zoom per second**),
  pull-out on 14-23 %, pans or parallax on 23-43 %. The rest hold with only character motion.
- Push-in on emotional lines and portraits; pans across maps, boards and wide sets; small shake on impacts.
- The 3D video pushes in more (44 %) and holds shots longer (3.4 s average).

## 7. Timing and transitions

- **Average shot 1.6-2.3 s** (median 1.2-1.8 s; 10 % of shots are under 0.3 s, 10 % over 4.5 s). That is about **2 shots per
  sentence**: a new picture on each phrase that carries a new idea. Cuts don't wait for the sentence to end (only 35 % land within
  0.4 s of a new line).
- **Hook montage is faster**: Ghost averages 0.8 s per shot in its first 15 s.
- **Hard cuts dominate.** Special transitions, each used sparingly:
  - Dip to black for chapter cards.
  - Smear/whip (vertical motion-blur swipe) out of the title shot.
  - VHS rewind for "But right now…".
  - White flash on god-level moments.
  - Push through an object (a page, a frame, a map) into the next scene.
- **Text animation**: titles fade in from a slight blur over ~3 frames, then the subtitle ~0.3 s later. Labels and stamps pop in over
  4-6 frames with a little scale overshoot and a tilt. Arrows draw on.

## 8. What our code stack can and can't match

| Part | Code-only result |
|---|---|
| Hook structure, chapters, devices, labels, maps, counters, stamps, books | ~95 % (pure SVG/React) |
| Flat sets, glow, blur, particles, camera push/pan | ~90 % |
| Chibi characters with swap expressions and emotes | ~85 % |
| Adult semi-realistic caricatures | ~60 % unless we have a hand-made SVG cast; then ~85 % |
| Puppet acting (stand, turn, point, kneel, walk) | ~75 % |
| Toon-3D sets (Doom video) | ~75 % with Blender, slow to render; optional |

---

## 9. Which channel

Hammad's decision (27 Nov 2026): the born-as format gets its **own new channel**, separate from the hidden-workers channel.
Its subject and cast are still to be chosen. The kit's worker props (hard hats, hi-vis, depot sets) stay as general options.
