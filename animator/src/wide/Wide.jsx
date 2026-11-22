// Long-form 16:9 scene kit (1920x1080) for the channel's 8-12 minute tutorials.
// Every scene is built from the spec, so a new video is only JSON (videos/<slug>/spec.json, "style": "wide"):
//   beat.show = {type: '<kind>', ...params, lower?: {name, sub}, tr?: 'fade'|'push'|'zoom'|'wipe'}
// Kinds: illus, titlecard, dateline, dialogue (illustrated story scenes), title, chapter, screen, points, stat, compare, text, endscreen.
// Word anchors ("word" params) are display words from the beat's `say`; a missing word falls back to a time in the beat.
// The look comes from props.theme (brain/brand.md -> spec "theme"), so the palette can change without touching code.
import React from 'react';
import {AbsoluteFill, useCurrentFrame, staticFile, Img, OffthreadVideo, Sequence, Audio} from 'remotion';
import {Fonts, FONT} from '../Short';
import {expo, inOut, mix, clamp01} from '../flow/kit';

export const W = 1920, H = 1080;
// Default = brand option A (night blue + warm orange, brain/brand.md) until the owner picks a palette; specs override with "theme".
export const DEFAULT_THEME = {bg: '#101A2E', panel: '#1B2742', paper: '#F2E8D5', ink: '#101A2E', text: '#F7F1E3', muted: '#A7AFC0',
  accent: '#F28C28', accent2: '#FFD166', line: '#2A3756', warn: '#E5484D'};
const MONO = '"JetBrains Mono", "DejaVu Sans Mono", monospace';
const clean = (s) => String(s).replace(/[^\w$%.'-]/g, '').replace(/\.$/, '').toLowerCase();

// frame of a display word inside the beat (first match), else fallback frames after the beat starts
const wordAt = (b, word, fb = 12) => {
  if (word && b.words) { const x = b.words.find((w) => clean(w.w).startsWith(clean(word))); if (x) return x.f; }
  return b.from + fb;
};

const Rise = ({f, at, children, dy = 40, d = 14, style}) => {
  const p = expo(f - at, d);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, filter: `blur(${(1 - p) * 8}px)`, ...style}}>{children}</div>;
};

// ------------------------------------------------------------------ scenes (props: f, s = show, b = beat, T = theme)
// title: {kicker?, title, sub?}  opening / hook card. *word* in title = accent colour.
const Accent = ({text, T}) => String(text).split(/(\*[^*]+\*)/).map((p, i) => p.startsWith('*')
  ? <span key={i} style={{color: T.accent}}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>);

const Title = ({f, s, b, T}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: '0 180px'}}>
    {s.kicker && <Rise f={f} at={b.from + 2}><div style={{fontFamily: MONO, fontSize: 30, letterSpacing: 4, color: T.accent, textTransform: 'uppercase', marginBottom: 28}}>{s.kicker}</div></Rise>}
    <Rise f={f} at={b.from + 6} dy={60}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: s.size || 112, lineHeight: 1.02, letterSpacing: -3, color: T.text}}><Accent text={s.title} T={T} /></div></Rise>
    {s.sub && <Rise f={f} at={wordAt(b, s.word, 24)}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: T.muted, marginTop: 36, maxWidth: 1300}}>{s.sub}</div></Rise>}
  </AbsoluteFill>
);

// chapter: {n, title}  numbered chapter card (matches the YouTube chapter list in upload.md)
const Chapter = ({f, s, b, T}) => {
  const wipe = inOut(f - b.from, 18);
  return (<AbsoluteFill style={{background: T.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${wipe * 100}%`, background: T.accent, opacity: 1 - clamp01((f - b.from - 18) / 10)}} />
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 200px'}}>
      <Rise f={f} at={b.from + 14}><div style={{fontFamily: MONO, fontSize: 40, color: T.accent}}>{String(s.n || 1).padStart(2, '0')}</div></Rise>
      <Rise f={f} at={b.from + 18} dy={50}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, letterSpacing: -3, color: T.text, lineHeight: 1}}>{s.title}</div></Rise>
      <div style={{height: 10, width: 260 * expo(f - b.from - 26, 16), background: T.accent, borderRadius: 5, marginTop: 40}} />
    </AbsoluteFill>
  </AbsoluteFill>);
};

// screen: {image | video, app?: 'browser'|'window'|'none', url?, zoom?: {x, y, s, word?}, pointer?: [{x, y, word?, click?}], label?: {text, x, y, word?}, start?: seconds}
//   x/y are 0-1 positions inside the screenshot or recording. Zoom eases in on its word and holds.
const Screen = ({f, s, b, T}) => {
  const fw = 1600, fh = 900, chrome = s.app === 'none' ? 0 : 54;
  const z = s.zoom ? inOut(f - wordAt(b, s.zoom.word, 20), 22) : 0;
  const sc = mix(1, s.zoom ? s.zoom.s || 1.8 : 1, z);
  const zx = s.zoom ? s.zoom.x : 0.5, zy = s.zoom ? s.zoom.y : 0.5;
  const tx = (0.5 - zx) * fw * (sc - 1), ty = (0.5 - zy) * (fh - chrome) * (sc - 1);
  const pts = s.pointer || [];
  let px = null, py = null, click = 0;
  pts.forEach((p, i) => {
    const at = wordAt(b, p.word, 10 + i * 30), prev = pts[i - 1];
    if (f >= at - 18) {
      const k = inOut(f - (at - 18), 18);
      px = prev ? mix(prev.x, p.x, k) : p.x; py = prev ? mix(prev.y, p.y, k) : p.y;
      if (p.click && f >= at) click = f - at;
    }
  });
  const enter = expo(f - b.from, 18);
  return (<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: fw, height: fh, borderRadius: 22, overflow: 'hidden', background: T.panel, border: `2px solid ${T.line}`,
      boxShadow: '0 40px 120px rgba(0,0,0,0.45)', transform: `translateY(${(1 - enter) * 80}px) scale(${mix(0.94, 1, enter)})`, opacity: enter}}>
      {chrome > 0 && <div style={{height: chrome, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderBottom: `2px solid ${T.line}`}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
        {s.app !== 'window' && <div style={{marginLeft: 20, flex: 1, height: 32, borderRadius: 16, background: T.bg, color: T.muted, fontFamily: FONT, fontWeight: 500, fontSize: 20, display: 'flex', alignItems: 'center', padding: '0 18px'}}>{s.url || ''}</div>}
      </div>}
      <div style={{position: 'relative', width: fw, height: fh - chrome, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${sc})`}}>
          {s.video ? <Sequence from={b.from} layout="none"><OffthreadVideo src={staticFile(s.video)} startFrom={Math.round((s.start || 0) * 30)} muted style={{width: fw, height: fh - chrome, objectFit: 'cover'}} /></Sequence>
            : s.image ? <Img src={staticFile(s.image)} style={{width: fw, height: fh - chrome, objectFit: 'cover', objectPosition: 'top'}} />
              : <div style={{width: fw, height: fh - chrome, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted, fontFamily: MONO, fontSize: 34}}>[ screen recording: {s.note || 'add image or video'} ]</div>}
          {px !== null && <div style={{position: 'absolute', left: px * fw - 6, top: py * (fh - chrome) - 4}}>
            {click > 0 && click < 20 && <div style={{position: 'absolute', left: -30, top: -30, width: 72, height: 72, borderRadius: 36, border: `4px solid ${T.accent}`, opacity: 1 - click / 20, transform: `scale(${0.4 + click / 14})`}} />}
            <svg width="44" height="52" viewBox="0 0 22 26" style={{filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'}}><path d="M2 2 L2 20 L7 15.5 L10.5 23.5 L14 22 L10.6 14.2 L17 14 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" /></svg>
          </div>}
        </div>
      </div>
    </div>
    {s.label && <div style={{position: 'absolute', left: (s.label.x ?? 0.5) * W, top: (s.label.y ?? 0.1) * H, transform: `translate(-50%, 0) scale(${expo(f - wordAt(b, s.label.word, 16), 12)})`,
      background: T.accent2, color: T.ink, fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: '14px 28px', borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.4)'}}>{s.label.text}</div>}
  </AbsoluteFill>);
};

// points: {title, items: [text | {text, word}]}  up to 5 rows revealed on their words
const Points = ({f, s, b, T}) => (
  <AbsoluteFill style={{padding: '130px 200px'}}>
    <Rise f={f} at={b.from + 2}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 80, letterSpacing: -2, color: T.text, marginBottom: 60}}><Accent text={s.title} T={T} /></div></Rise>
    {(s.items || []).slice(0, 5).map((it, i) => { const x = typeof it === 'string' ? {text: it} : it; const at = wordAt(b, x.word, 14 + i * 22);
      const on = expo(f - at, 12);
      return (<div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, marginBottom: 30, opacity: mix(0.0, 1, on), transform: `translateX(${(1 - on) * -60}px)`}}>
        <div style={{width: 74, height: 74, borderRadius: 20, background: T.accent, color: T.ink, fontFamily: MONO, fontWeight: 700, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: T.text}}>{x.text}</div>
      </div>); })}
  </AbsoluteFill>
);

// stat: {value, label, word?, source?}  big number that counts up if numeric
const Stat = ({f, s, b, T}) => {
  const at = wordAt(b, s.word, 10), p = inOut(f - at, 26);
  const m = String(s.value).match(/^([^\d]*)([\d,.]+)(.*)$/);
  const num = m ? parseFloat(m[2].replace(/,/g, '')) : null;
  const shown = m && !isNaN(num) ? `${m[1]}${(num * p).toLocaleString('en-US', {maximumFractionDigits: m[2].includes('.') ? 1 : 0})}${m[3]}` : s.value;
  return (<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 260, letterSpacing: -10, color: T.accent, lineHeight: 1, transform: `scale(${mix(0.85, 1, expo(f - at, 14))})`}}>{shown}</div>
    <Rise f={f} at={at + 10}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 56, color: T.text, marginTop: 30, textAlign: 'center', maxWidth: 1400}}>{s.label}</div></Rise>
    {s.source && <div style={{position: 'absolute', bottom: 70, fontFamily: MONO, fontSize: 22, color: T.muted}}>Source: {s.source}</div>}
  </AbsoluteFill>);
};

// compare: {left: {title, items[]}, right: {title, items[]}, word?}  before/after or tool vs tool
const Compare = ({f, s, b, T}) => (
  <AbsoluteFill style={{flexDirection: 'row', gap: 60, padding: '140px 160px', alignItems: 'stretch'}}>
    {[s.left, s.right].map((c, k) => c && (<Rise key={k} f={f} at={k ? wordAt(b, s.word, 30) : b.from + 4} style={{flex: 1}}>
      <div style={{height: '100%', borderRadius: 32, background: T.panel, border: `3px solid ${k ? T.accent : T.line}`, padding: 56}}>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 60, color: k ? T.accent : T.muted, marginBottom: 40}}>{c.title}</div>
        {(c.items || []).map((t, i) => <div key={i} style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: T.text, marginBottom: 22}}>{k ? '✓' : '×'}  {t}</div>)}
      </div></Rise>))}
  </AbsoluteFill>
);

// text: {text, word?}  one big statement (re-hook lines, open loops)
const Text = ({f, s, b, T}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 220px'}}>
    <Rise f={f} at={wordAt(b, s.word, 4)} dy={50}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: s.size || 96, letterSpacing: -2, color: T.text, textAlign: 'center', lineHeight: 1.08}}><Accent text={s.text} T={T} /></div></Rise>
  </AbsoluteFill>
);

// endscreen: {title?}  last 20 s: leaves space for YouTube's end-screen elements (2 videos left/right + subscribe in the middle)
const EndScreen = ({f, s, b, T}) => (
  <AbsoluteFill style={{alignItems: 'center'}}>
    <Rise f={f} at={b.from + 4}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 72, color: T.text, marginTop: 110, textAlign: 'center'}}>{s.title || 'Watch this next'}</div></Rise>
    {[0, 1].map((k) => <div key={k} style={{position: 'absolute', top: 380, left: k ? 1060 : 180, width: 680, height: 382, borderRadius: 20, border: `3px dashed ${T.line}`, opacity: 0.6 * expo(f - b.from - 8 - k * 4, 12)}} />)}
    <div style={{position: 'absolute', top: 820, left: W / 2 - 80, width: 160, height: 160, borderRadius: 80, border: `3px dashed ${T.line}`, opacity: 0.6 * expo(f - b.from - 16, 12)}} />
  </AbsoluteFill>
);


// ------------------------------------------------------------------ illustrated story scenes (Capital Case-style look, our own art)
// Illustrations are 16:9 PNGs in videos/<slug>/assets/ (our character sheet + Flow-made scenes, docs/animator-rules.md).
const Missing = ({T, note}) => <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: T.panel, color: T.muted, fontFamily: MONO, fontSize: 34}}>[ illustration: {note || 'add image'} ]</AbsoluteFill>;
const MOVES = {in: [1, 1.12, 0, 0], out: [1.12, 1, 0, 0], left: [1.08, 1.08, 40, -40], right: [1.08, 1.08, -40, 40], up: [1.08, 1.08, 0, 0]};
const Pan = ({f, b, s, T, children, dim = 0}) => {
  const [z0, z1, x0, x1] = MOVES[s.move || 'in'] || MOVES.in;
  const t = clamp01((f - b.from) / Math.max(1, b.frames));
  const y = s.move === 'up' ? mix(30, -30, t) : 0;
  return (<AbsoluteFill style={{overflow: 'hidden', background: T.bg}}>
    <AbsoluteFill style={{transform: `translate(${mix(x0, x1, t)}px, ${y}px) scale(${mix(z0, z1, t)})`}}>
      {s.image ? <Img src={staticFile(s.image)} style={{width: W, height: H, objectFit: 'cover'}} /> : <Missing T={T} note={s.note} />}
      {(s.layers || []).map((l, i) => <Img key={i} src={staticFile(l.image)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover',
        transform: `translateX(${mix(0, (l.depth || 1) * -30, t)}px)`}} />)}
    </AbsoluteFill>
    {dim > 0 && <AbsoluteFill style={{background: `linear-gradient(0deg, rgba(0,0,0,${dim}), rgba(0,0,0,${dim * 0.3}) 60%)`}} />}
    {children}
  </AbsoluteFill>);
};

// illus: {image, move?: in|out|left|right|up, layers?: [{image, depth}], caption?, word?}  full-bleed illustration with a slow camera move
const Illus = ({f, s, b, T}) => (<Pan f={f} b={b} s={s} T={T} dim={s.caption ? 0.45 : 0}>
  {s.caption && <Rise f={f} at={wordAt(b, s.word, 10)} style={{position: 'absolute', left: 120, right: 120, bottom: 90}}>
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: T.text, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}><Accent text={s.caption} T={T} /></div></Rise>}
</Pan>);

// titlecard: {word, sub?}  black card with one key term (e.g. "THE NIGHT SHIFT"), letters spaced, a soft flicker in
const TitleCard = ({f, s, b, T}) => {
  const p = expo(f - b.from - 2, 10), fl = f - b.from < 8 ? ((f - b.from) % 2 ? 0.55 : 1) : 1;
  return (<AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: s.size || 150, letterSpacing: 18, color: '#F7F1E3', opacity: p * fl, transform: `scale(${mix(1.06, 1, p)})`}}>{s.word}</div>
    {s.sub && <Rise f={f} at={b.from + 14}><div style={{fontFamily: MONO, fontSize: 32, letterSpacing: 6, color: T.accent, marginTop: 24, textTransform: 'uppercase'}}>{s.sub}</div></Rise>}
  </AbsoluteFill>);
};

// dateline: {time, place, image?, move?}  cold-open stamp ("3:12 AM" / "beneath Manhattan") typed over the scene
const Dateline = ({f, s, b, T}) => {
  const typed = (txt, at) => String(txt || '').slice(0, Math.max(0, Math.floor((f - at) / 1.6)));
  return (<Pan f={f} b={b} s={s} T={T} dim={0.55}>
    <div style={{position: 'absolute', left: 120, bottom: 130}}>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 96, color: T.accent2}}>{typed(s.time, b.from + 6)}</div>
      <div style={{fontFamily: MONO, fontSize: 46, color: T.text, marginTop: 8}}>{typed(s.place, b.from + 6 + String(s.time || '').length * 1.6 + 6)}</div>
    </div>
  </Pan>);
};

// dialogue: {image, speaker?, line?, x, y, move?}  a character's voiced line in a speech bubble pointing at (x, y) (0-1 of the frame)
//   the beat's "say" is the spoken line; set beat "voice" to give the character a different Kokoro voice
const Dialogue = ({f, s, b, T}) => {
  const p = expo(f - b.speakFrom + 4, 10), x = (s.x ?? 0.5) * W, y = (s.y ?? 0.4) * H;
  const right = x > W * 0.6;
  return (<Pan f={f} b={b} s={{move: 'in', ...s}} T={T}>
    <div style={{position: 'absolute', top: Math.max(40, y - 260), [right ? 'right' : 'left']: right ? W - x - 60 : x - 60, maxWidth: 760,
      background: '#FFFDF7', color: '#14161C', borderRadius: 28, padding: '24px 34px', border: '5px solid #14161C', transform: `scale(${p})`,
      transformOrigin: right ? 'bottom right' : 'bottom left', boxShadow: '0 12px 30px rgba(0,0,0,0.35)'}}>
      {s.speaker && <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: '#7A6A55', textTransform: 'uppercase'}}>{s.speaker}</div>}
      <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.15}}>{s.line || b.say}</div>
    </div>
  </Pan>);
};

const SCENES = {illus: Illus, titlecard: TitleCard, dateline: Dateline, dialogue: Dialogue, title: Title, chapter: Chapter, screen: Screen, points: Points, stat: Stat, compare: Compare, text: Text, endscreen: EndScreen};

// lower third: {name, sub?}  slides in on the beat start, out 1 s before the beat ends
const Lower = ({f, l, b, T}) => {
  const p = expo(f - b.from - 10, 14) * (1 - expo(f - (b.from + b.frames - 30), 12));
  return (<div style={{position: 'absolute', left: 90, bottom: 90, transform: `translateX(${(1 - p) * -500}px)`, opacity: p, display: 'flex', alignItems: 'stretch'}}>
    <div style={{width: 12, background: T.accent, borderRadius: 6}} />
    <div style={{background: 'rgba(14,16,20,0.92)', padding: '18px 30px', borderRadius: '0 14px 14px 0'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff'}}>{l.name}</div>
      {l.sub && <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 26, color: '#C9CDD4'}}>{l.sub}</div>}
    </div>
  </div>);
};

// scene change: every beat enters with a transition; the spec can pick one with "tr", else they rotate
const TRS = ['fade', 'push', 'zoom', 'wipe'];
const enterStyle = (tr, p) => tr === 'push' ? {transform: `translateX(${(1 - p) * 200}px)`, opacity: p}
  : tr === 'zoom' ? {transform: `scale(${mix(1.08, 1, p)})`, opacity: p}
    : tr === 'wipe' ? {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : {opacity: p};

// burnt-in captions are off by default for long-form (YouTube CC from upload.md); "captions": true turns them on
const Captions = ({f, b, T}) => {
  const ws = (b.words || []).filter((w) => w.f <= f); if (!ws.length) return null;
  const last = ws.slice(-7).map((w) => w.w).join(' ');
  return <div style={{position: 'absolute', bottom: 60, left: 0, right: 0, textAlign: 'center'}}><span style={{background: 'rgba(0,0,0,0.75)', color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: '8px 22px', borderRadius: 12}}>{last}</span></div>;
};

export const Wide = ({beats = [], theme = {}, captions = false, watermark, audio = true}) => {
  const f = useCurrentFrame();
  const T = {...DEFAULT_THEME, ...theme};
  const i = Math.max(0, beats.findIndex((b) => f >= b.from && f < b.from + b.frames));
  const b = beats[i] || beats[0];
  if (!b) return <AbsoluteFill style={{background: T.bg}} />;
  const s = b.show || {};
  const Scene = SCENES[s.type] || Text;
  const tr = s.tr || TRS[i % TRS.length];
  const p = i === 0 ? 1 : expo(f - b.from, 12);
  return (<AbsoluteFill style={{background: T.bg}}>
    <Fonts />
    {audio && <Audio src={staticFile('voice.wav')} />}
    <AbsoluteFill style={enterStyle(tr, p)}><Scene f={f} s={s} b={b} T={T} /></AbsoluteFill>
    {s.lower && <Lower f={f} l={s.lower} b={b} T={T} />}
    {captions && <Captions f={f} b={b} T={T} />}
    {watermark && <div style={{position: 'absolute', right: 50, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: T.muted, opacity: 0.6}}>{watermark}</div>}
  </AbsoluteFill>);
};

// Storyboard frame: the same scene frozen at a frame, used by `npx remotion still` for the storyboard sheet (no voice needed).
export const WideStill = (p) => <Wide {...p} />;
