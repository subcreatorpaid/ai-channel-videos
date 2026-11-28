// "Lore" long-form composition (spec "style": "lore"): the born-as format, rules in docs/lore-style.md.
// Same props as Wide (beats from animator/prep.py), plus spec.cast = the series' characters, defined once.
//   beat.show = {type, ...}. Types: scene, portrait, chapter, book, corkboard, todo, document, map, polaroids, before_after, tv, poll, end.
//   Every type accepts: cam {move, amount, focus, dir}, tr ('cut'|'smear'|'dip'|'flash'|'rewind'|'fade'|'push'), and the overlays
//   place, placeTitle, caption, callouts, bubble, stamp, counter, corner, swap.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, staticFile, Audio} from 'remotion';
import {W, H, INK, LoreFonts, wordAt, speaking, camTransform, camOrigin, expo, inOut, mix, hash, pop,
  NameTag, Callout, PlaceTag, PlaceTitle, Caption, Stamp, Bubble, HeroTitle, Corner, SANS} from './kit';
import {Person} from './cast';
import {Land3D} from './three';
import {Set, SetFx} from './sets';
import {ChapterCard, Book, Corkboard, TodoList, Document, MapRoute, Polaroids, Counter, BeforeAfter, TVNews, PollBreak} from './devices';

// value that changes on spoken words: [{word, value}] -> latest reached (rules §3: expressions swap in one frame)
const onWords = (b, f, base, list, key) => {
  let v = base;
  (list || []).forEach((x, i) => { if (f >= wordAt(b, x.word, 15 + i * 25)) v = x[key]; });
  return v;
};

// ---------------------------------------------------------------- one character in a scene
const Actor = ({a, i, cast, f, b, n}) => {
  const c = cast[a.id] || {};
  const age = a.age || c.age || 'adult';
  const face = onWords(b, f, a.face || 'neutral', a.faces, 'face');
  const pose = onWords(b, f, a.pose || 'stand', a.poses, 'pose');
  const emote = onWords(b, f, a.emote, a.emotes, 'emote');
  const emoteFrom = a.emotes ? (a.emotes.filter((x, k) => f >= wordAt(b, x.word, 15 + k * 25)).map((x, k) => wordAt(b, x.word, 15 + k * 25)).pop() ?? b.from) : wordAt(b, a.emoteWord, 8);
  const enterAt = wordAt(b, a.word, 0);
  if (f < enterAt) return null;
  const t = f - enterAt;
  let x = a.x ?? (n === 1 ? 0.5 : 0.3 + (0.4 * i) / Math.max(1, n - 1));
  const y = a.y ?? 0.86;
  if (a.walkTo != null) x = mix(x, a.walkTo, inOut(f - enterAt, Math.max(10, (a.walkFrames || b.frames - 6))));
  // jump-cut action (rules §3): the character teleports between spots every `hop` frames
  if (a.hops) x = a.hops[Math.floor(t / (a.hop || 8)) % a.hops.length];
  const sc = (a.scale ?? 1) * (age === 'chibi' ? 1 : 1);
  const ent = a.enter === 'pop' ? pop(t, 5) : a.enter === 'slide' ? 1 : 1;
  const slide = a.enter === 'slide' ? (1 - expo(t, 12)) * (a.from === 'right' ? 700 : -700) : 0;
  const holo = a.holo ? {shape: a.holo.shape || a.holo} : null;
  const walking = a.walkTo != null && f - enterAt < (a.walkFrames || b.frames - 6);
  return (<g transform={`translate(${x * W + slide},${y * H}) scale(${sc * ent * (a.flip ? -1 : 1)},${sc * ent})`}>
    <Person c={c} age={age} pose={walking ? 'walk' : pose} face={face} look={a.look} f={f} seed={i + 1 + (a.id || '').length} talk={a.talk && speaking(b, f)}
      holo={holo} holoFrom={a.holo ? wordAt(b, a.holo.word, 10) : 0} holoUntil={a.holo && a.holo.untilWord ? wordAt(b, a.holo.untilWord, 40) : a.holo && a.holo.until ? b.from + a.holo.until : undefined}
      emote={emote} emoteFrom={emoteFrom} silhouette={a.silhouette} rim={a.rim} />
  </g>);
};

// ---------------------------------------------------------------- shot types
const Scene = ({f, s, b, cast}) => {
  const actors = s.cast || [];
  return (<>
    <Set set={s.set} f={f} />
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {actors.map((a, i) => <Actor key={i} a={a} i={i} cast={cast} f={f} b={b} n={actors.length} />)}
    </svg>
    <SetFx set={s.set || {}} f={f} />
  </>);
};

// hook portrait: hero chest-up over a blurred, lit background; name + "(that's you)" (rules §1 beat 1)
const Portrait = ({f, s, b, cast}) => {
  const a = {id: s.who, age: s.age || 'adult', face: s.face || 'determined', x: s.x ?? 0.64, y: s.y ?? (s.age === 'chibi' ? 1.3 : 1.56), scale: s.scale ?? (s.age === 'chibi' ? 1.8 : 1.9), rim: s.rim || '#FFB25A', ...s.actor};
  return (<>
    <Set set={{kind: 'street', night: true, mood: 'ember', fx: 'embers', ...s.set, blur: s.set?.blur ?? 14}} f={f} />
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><Actor a={a} i={0} cast={cast} f={f} b={b} n={1} /></svg>
    <SetFx set={{mood: 'ember', fx: 'embers', ...s.set}} f={f} />
  </>);
};

// cel-shaded 3D establishing shot over the 2D sky, with optional 2D characters in the foreground (the mixed look)
const Land3DShot = ({f, s, b, cast}) => {
  const actors = s.cast || [];
  return (<>
    <Set set={{kind: 'sky', mood: 'warm', noTown: true, ...s.set, ground: false}} f={f} />
    <Land3D s={s} f={f} t0={b.from} dur={b.frames} />
    {actors.length > 0 && <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{actors.map((a, i) => <Actor key={i} a={a} i={i} cast={cast} f={f} b={b} n={actors.length} />)}</svg>}
    <SetFx set={{vignette: 0.3, ...(s.set || {})}} f={f} />
  </>);
};

const End = ({f, s, b, cast}) => <Book f={f} b={b} cast={cast} s={{left: {title: s.question, text: s.text || 'Who should we be born as next? Tell me in the comments.'}, right: {who: s.who, age: s.age || 'chibi', face: 'happy', seal: 'SUBSCRIBE', caption: s.caption}}} />;

const TYPES = {scene: Scene, portrait: Portrait, chapter: ChapterCard, book: Book, corkboard: Corkboard, todo: TodoList, document: Document, map: MapRoute,
  polaroids: Polaroids, before_after: BeforeAfter, tv: TVNews, poll: PollBreak, end: End, land3d: Land3DShot};
export const LORE_TYPES = Object.keys(TYPES);

// ---------------------------------------------------------------- overlays shared by every shot type
const Overlays = ({f, s, b, cast}) => (<>
  {(s.cast || []).filter((a) => a.tag).map((a, i) => <NameTag key={'t' + i} f={f} at={wordAt(b, a.tag.word, 12)} x={a.tag.x ?? (a.x ?? 0.5)} y={a.tag.y ?? Math.max(0.06, (a.y ?? 0.86) - ((a.age === 'chibi' ? 450 : 760) * (a.scale ?? 1) + 60) / H)} text={a.tag.text} sub={a.tag.sub} />)}
  {(s.callouts || []).map((c, i) => <Callout key={'c' + i} f={f} at={wordAt(b, c.word, 10 + i * 20)} text={c.text} from={c.from} to={c.to} />)}
  {s.bubble && <Bubble f={f} at={wordAt(b, s.bubble.word, 6)} text={s.bubble.text} x={s.bubble.x ?? 0.3} y={s.bubble.y ?? 0.25} tx={s.bubble.tx ?? 0.36} ty={s.bubble.ty ?? 0.42} w={s.bubble.w} />}
  {s.counter && <Counter f={f} b={b} s={s.counter} />}
  {s.swap && <Swap f={f} b={b} s={s.swap} />}
  {s.heroTitle && <HeroTitle f={f} at={wordAt(b, s.heroTitle.word, 30)} name={s.heroTitle.name} sub={s.heroTitle.sub} x={s.heroTitle.x} y={s.heroTitle.y} />}
  {s.placeTitle && <PlaceTitle f={f} at={wordAt(b, s.placeTitle.word, 14)} text={s.placeTitle.text} sub={s.placeTitle.sub} x={s.placeTitle.x} y={s.placeTitle.y} />}
  {s.caption && <Caption f={f} at={b.from + 4} text={s.caption} />}
  {s.stamp && s.type === 'scene' && <Stamp f={f} at={wordAt(b, s.stamp.word, 20)} text={s.stamp.text} x={s.stamp.x} y={s.stamp.y} />}
  {s.place && <PlaceTag f={f} at={b.from + 6} text={s.place} />}
  {s.corner && <Corner kind={s.corner} />}
</>);

// strike-through word swap ("~~FASHION~~ A PROMISE")
const Swap = ({f, b, s}) => {
  const t1 = wordAt(b, s.word, 18), st = inOut(f - t1, 8), p2 = pop(f - t1 - 8, 5);
  return (<div style={{position: 'absolute', left: (s.x ?? 0.32) * W, top: (s.y ?? 0.22) * H, transform: 'translate(-50%,-50%) rotate(-3deg)', textAlign: 'center', fontFamily: SANS, fontWeight: 900, color: '#fff', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>
    <div style={{position: 'relative', fontSize: 70, display: 'inline-block'}}>{s.from}<div style={{position: 'absolute', left: -10, top: '52%', height: 10, width: `${st * 105}%`, background: '#D23A2E', borderRadius: 5}} /></div>
    <div style={{fontSize: 84, color: '#FFD86B', transform: `scale(${p2})`}}>{s.to}</div>
  </div>);
};

// ---------------------------------------------------------------- transitions (rules §7: hard cuts dominate)
const TransitionIn = ({tr, t}) => {
  if (tr === 'flash' && t < 10) return <AbsoluteFill style={{background: '#fff', opacity: 1 - t / 10}} />;
  if (tr === 'dip' && t < 8) return <AbsoluteFill style={{background: '#000', opacity: 1 - t / 8}} />;
  if (tr === 'fade' && t < 10) return <AbsoluteFill style={{background: '#000', opacity: 1 - t / 10}} />;
  if (tr === 'rewind' && t < 16) return (<AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 3px, transparent 3px ${8 + (t % 3) * 3}px)`, opacity: 1 - t / 16}}>
    <div style={{position: 'absolute', right: 70, top: 50, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: '#fff', textShadow: '0 2px 4px #000'}}>◀◀ REW</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: `${(hash(t) * 80 + 10)}%`, height: 26, background: 'rgba(255,255,255,0.25)'}} /></AbsoluteFill>);
  return null;
};
const enterStyle = (tr, t) => (tr === 'smear' && t < 6 ? {transform: `translateY(${(1 - t / 6) * -H * 0.6}px)`, filter: `blur(${(1 - t / 6) * 18}px)`}
  : tr === 'push' && t < 10 ? {transform: `scale(${mix(1.25, 1, inOut(t, 10))})`, opacity: Math.min(1, t / 4)} : {});

// a beat (one voice line) can hold several shots: beat.shots = [{...show, at: '<word>'}]; the first starts with the beat.
// Each shot becomes its own sub-beat (from, frames), so devices and cameras time against the shot, not the whole line.
const currentShot = (b, f, next) => {
  if (!b.shots || !b.shots.length) return b;
  const end = next ? next.from : b.from + b.frames;
  const starts = b.shots.map((sh, k) => (k === 0 ? b.from : wordAt(b, sh.at, Math.round((b.frames * k) / b.shots.length))));
  let k = 0; starts.forEach((st, j) => { if (f >= st) k = j; });
  const from = starts[k], to = k + 1 < starts.length ? starts[k + 1] : end;
  return {...b, from, frames: Math.max(1, to - from), show: b.shots[k], shotIndex: k};
};

export const Lore = ({beats = [], cast = {}, theme = {}, watermark, audio = true}) => {
  const f = useCurrentFrame();
  const i = Math.max(0, beats.findIndex((b) => f >= b.from && f < b.from + b.frames));
  const b0 = beats[i] || beats[0];
  if (!b0) return <AbsoluteFill style={{background: '#000'}} />;
  const b = currentShot(b0, f, beats[i + 1]);
  const s = b.show || {};
  const T = TYPES[s.type] || Scene;
  const t = f - b.from, p = Math.min(1, t / Math.max(1, b.frames));
  const tr = i === 0 && b.from === b0.from ? 'cut' : s.tr || 'cut';
  const cam = s.cam || (['chapter', 'poll', 'end'].includes(s.type) ? {move: 'hold'} : {move: i % 3 === 2 ? 'pan' : 'push', amount: 0.06});
  return (<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <LoreFonts />
    {audio && <Audio src={staticFile('voice.wav')} />}
    <AbsoluteFill style={enterStyle(tr, t)}>
      <AbsoluteFill style={{transform: camTransform(cam, inOut(p, 1), f), transformOrigin: camOrigin(cam)}}>
        <T f={f} s={s} b={b} cast={cast} />
        <Overlays f={f} s={s} b={b} cast={cast} />
      </AbsoluteFill>
    </AbsoluteFill>
    <TransitionIn tr={tr} t={t} />
    {watermark && <div style={{position: 'absolute', left: 40, top: 30, fontFamily: SANS, fontWeight: 800, fontSize: 20, color: '#fff', opacity: 0.45}}>{watermark}</div>}
  </AbsoluteFill>);
};
