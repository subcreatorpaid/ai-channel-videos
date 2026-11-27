# Lore shot types (beat.show or beat.shots[n])

Every shot accepts: `cam {move: push|pull|pan|hold|shake, amount, focus [x,y], dir [dx,dy]}`, `tr` (cut|smear|dip|flash|rewind|fade|push),
and the overlays `place` (corner tag), `placeTitle {text, sub, word}`, `caption` (time jump bar), `callouts [{text, from [x,y], to [x,y], word}]`,
`bubble {text, x, y, tx, ty, word}`, `stamp {text, word, x, y}`, `counter {label, steps [{value, word}], glitch}`, `swap {from, to, word}`,
`heroTitle {name, sub, word}`, `corner` (ff|rew). Positions are 0-1 of the frame. `word` = the spoken word it lands on.

| Type | Use it for | Fields |
|---|---|---|
| `portrait` | Hook beat 1, big character moments | `who, age, face, set {kind, mood, blur, fx}, rim, heroTitle` |
| `scene` | Most shots: a set + characters acting | `set`, `cast: [actor]` |
| `chapter` | Chapter card, 1.7-1.9 s, every 35-50 s | `n, title, icon` |
| `book` | The rewind ("But right now") and chapter pages | `left/right {kicker, title, text, who, age, face, caption, seal}` |
| `corkboard` | Every "Remember that"; comes back for the payoff | `title, notes [{text, icon, word, cross, crossWord, old}]` |
| `todo` | The life's goals struck off one by one | `kicker, title, items [{text, sub, icon, word, strikeWord, strike}]` |
| `document` | Contracts, files, ID cards, job offers | `title, rows [{label, value, word}], who, stamp` |
| `map` | Routes, where they live and work | `title, places [{name, x, y, pin, big, word}], routes [{points, word, frames, dashed, color}], areas, stamp` |
| `polaroids` | Family, crew, friends; red X when lost | `photos [{who, age, face, caption, x, y, cross, crossWord}], string, stamp` |
| `before_after` | Ageing, changes | `left/right {who, age, face, label}` |
| `tv` | News moments | `who, face, headline` |
| `poll` | The mid-video break (33-40 %) | `question, names, title, items` |
| `end` | Last shot: the book closes on a question | `question, text, who, age` |

**Sets** (`set.kind`): room, street, depot, tunnel, road, city, sky, glow (silhouette backdrop), black.
`set.mood`: warm, night, dusk, ember, teal, snow, sepia, steel. Extras: `props [{kind, x, y}]` (lamp, crib, bed, table, door, frame,
shelf, rug, crate, barrel, cone, lamppost, van), `window` (day|night|storm|none), `fx` (rain|snow|embers|dust), `blur`, `rays [x,y]`, `night`.

**Actor** (`scene.cast[]`): `id` (from spec.cast), `age` (adult|chibi), `x`, `y` (feet, default 0.86), `scale`, `flip`,
`pose` (stand, point, wave, hips, cross, shrug, think, carry, slump, kneel, cheer, walk, work), `face` (neutral, happy, laugh, angry, sad,
surprised, scared, smug, tired, determined, worried, asleep), `faces/poses/emotes [{word, …}]` for changes on words,
`emote` + `emoteWord` (vein, steam, heart, question, sweat, shock, tears, zzz, notes, exclaim, idea), `look [dx,dy]`, `talk`,
`tag {text, sub, word}`, `holo {shape: hardhat|cap|beanie|headlamp|mask|vest|wrench|lantern, word, untilWord}` (dotted future outline),
`silhouette`, `rim` (colour), `enter` (pop|slide), `from` (left|right), `word` (appears on), `walkTo` (x), `hops [x…]` + `hop` frames (jump-cut action).

The checker reads these names straight from the code, so a typo is caught before any render.
