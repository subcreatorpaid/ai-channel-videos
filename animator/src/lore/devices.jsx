// The recurring story devices of the lore style (rules §5). Each is a full-frame shot type: props (f, s = show, b = beat, cast).
import React from 'react';
import {W, H, INK, LW, TITLE, ITAL, HAND, MONO, SANS, mix, expo, inOut, pop, hash, wordAt, Stamp, Vignette, Particles} from './kit';
import {Person} from './cast';

const S = {stroke: INK, strokeWidth: LW, strokeLinejoin: 'round'};
const at = (b, x, i, step = 20, fb = 10) => wordAt(b, x && x.word, fb + i * step);

// a cast member drawn inside a box (polaroids, frames, TV, book pictures)
export const Mini = ({cast, who, age = 'adult', face = 'neutral', pose = 'stand', f, w, h, bg = '#D9C9A6', set, scale}) => {
  const c = (cast || {})[who] || {};
  const sc = scale || (age === 'chibi' ? h / 480 : h / 450);  // adult: head to mid-torso; chibi: full body
  return (<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block'}}>
    <rect width={w} height={h} fill={bg} />
    {set === 'sunset' && <><rect width={w} height={h * 0.6} fill="#E9937A" /><rect y={h * 0.6} width={w} height={h * 0.4} fill="#7A5A44" /></>}
    <g transform={`translate(${w / 2},${h * (age === 'chibi' ? 0.96 : 1.87)}) scale(${sc})`}><Person c={c} age={age} face={face} pose={pose} f={f} seed={(who || 'x').length} /></g>
  </svg>);
};

// chapter card: black, small icon, CHAPTER IV in small caps, serif title. Measured 1.7-1.9 s.
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
export const ChapterCard = ({f, s, b}) => {
  const t = f - b.from, p = expo(t - 4, 10), out = 1 - inOut(t - (b.frames - 8), 8);
  return (<div style={{position: 'absolute', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out}}>
    <div style={{width: 34, height: 34, borderRadius: 17, background: '#C0392B', opacity: p, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 18}}>{s.icon || '★'}</div>
    <div style={{fontFamily: MONO, fontSize: 18, letterSpacing: 8, color: '#9C8E7C', opacity: p}}>CHAPTER {ROMAN[s.n] || s.n}</div>
    <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: 64, color: '#F3E6CF', opacity: p, filter: `blur(${(1 - p) * 6}px)`, marginTop: 10}}>{s.title}</div>
  </div>);
};

// the book of their life: frame story (opens at the rewind, chapter pages, closes at the end)
export const Book = ({f, s, b, cast}) => {
  const t = f - b.from, open = inOut(t, 14);
  const L = s.left || {}, R = s.right || {};
  return (<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #3A2A1E 0%, #120C08 80%)'}}>
    <div style={{position: 'absolute', left: 180, top: 300, width: 40, height: 140, background: '#F3E9D2', border: `4px solid ${INK}`, borderRadius: 6}} />
    <div style={{position: 'absolute', left: 186, top: 250 + Math.sin(f / 4) * 3, width: 28, height: 50, borderRadius: '50% 50% 40% 40%', background: '#FFC24A', boxShadow: '0 0 60px 30px rgba(255,190,90,0.35)'}} />
    <div style={{position: 'absolute', left: W / 2 - 700, top: 150, width: 1400, height: 800, transform: `scale(${mix(0.92, 1, open)})`, opacity: Math.min(1, t / 3)}}>
      {[0, 1].map((k) => { const P = k ? R : L;
        return (<div key={k} style={{position: 'absolute', left: k ? 700 : 0, top: 0, width: 700, height: 800, background: '#F1E6CC', border: `5px solid ${INK}`, borderRadius: k ? '0 18px 18px 0' : '18px 0 0 18px',
          transform: k ? `perspective(2000px) rotateY(${(1 - open) * -80}deg)` : 'none', transformOrigin: 'left center', boxShadow: 'inset 0 0 60px rgba(120,80,30,0.25)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 70, textAlign: 'center'}}>
          {P.kicker && <div style={{fontFamily: ITAL, fontStyle: 'italic', fontSize: 30, color: '#7A6040'}}>{P.kicker}</div>}
          {P.title && <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: P.size || 76, color: '#3A2A1E', lineHeight: 1.05, margin: '18px 0'}}>{P.title}</div>}
          {P.text && <div style={{fontFamily: ITAL, fontStyle: 'italic', fontSize: 34, color: '#4A3826', lineHeight: 1.3}}>{P.text}</div>}
          {P.who && <div style={{border: `5px solid ${INK}`, marginTop: 20}}><Mini cast={cast} who={P.who} age={P.age} face={P.face} f={f} w={460} h={320} /></div>}
          {P.caption && <div style={{fontFamily: ITAL, fontStyle: 'italic', fontSize: 28, color: '#5A4630', marginTop: 16}}>{P.caption}</div>}
          {P.seal && <div style={{marginTop: 30, width: 110, height: 110, borderRadius: 55, background: '#B3262E', border: `5px solid #7A151B`, color: '#F7D9C4', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SANS, fontWeight: 900, fontSize: 15, letterSpacing: 1, transform: `scale(${pop(t - 20, 6)})`}}>{P.seal}</div>}
        </div>); })}
    </div>
  </div>);
};

// "Things to remember" corkboard: notes pin in on their words; crossed notes get a red line; new notes pop.
export const Corkboard = ({f, s, b}) => {
  const notes = s.notes || [];
  return (<div style={{position: 'absolute', inset: 0, background: s.wall || '#E9D9B8'}}>
    <div style={{position: 'absolute', left: 260, top: 120, width: 1400, height: 840, background: '#C99A62', border: `16px solid #7A5236`, borderRadius: 14, boxShadow: '0 20px 0 rgba(0,0,0,0.2), inset 0 0 80px rgba(90,50,10,0.35)'}}>
      <div style={{textAlign: 'center', fontFamily: TITLE, fontWeight: 800, fontSize: 40, color: '#3A2A1E', marginTop: 24, letterSpacing: 3}}>{s.title || 'THINGS TO REMEMBER'}</div>
      {notes.map((n, i) => { const nn = typeof n === 'string' ? {text: n} : n; const t0 = nn.old ? b.from - 100 : at(b, nn, i, 18, 8); const p = pop(f - t0, 5);
        const x = nn.x ?? (0.12 + (i % 4) * 0.22), y = nn.y ?? (0.25 + Math.floor(i / 4) * 0.36), rot = (hash(i + 2) - 0.5) * 12;
        const cross = nn.cross ? inOut(f - wordAt(b, nn.crossWord, 30 + i * 10), 8) : 0;
        return (<div key={i} style={{position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, width: 250, minHeight: 200, background: nn.color || '#FFF6C8', border: `4px solid ${INK}`,
          transform: `rotate(${rot}deg) scale(${p})`, opacity: p > 0 ? 1 : 0, boxShadow: '0 10px 0 rgba(0,0,0,0.2)', padding: '34px 18px 18px', fontFamily: HAND, fontSize: 40, color: INK, textAlign: 'center', lineHeight: 1.05}}>
          <div style={{position: 'absolute', left: 105, top: -14, width: 30, height: 30, borderRadius: 15, background: '#D23A2E', border: `3px solid ${INK}`}} />
          {nn.text}{nn.icon && <div style={{fontSize: 54}}>{nn.icon}</div>}
          {cross > 0 && <svg width="250" height="200" style={{position: 'absolute', left: 0, top: 0}}><path d="M20,30 L230,170" stroke="#D23A2E" strokeWidth="10" strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260 * (1 - cross)} /></svg>}
        </div>); })}
    </div>
  </div>);
};

// to-do list on a stone/paper card; items struck through with a red line and a spark on their words
export const TodoList = ({f, s, b}) => {
  const items = s.items || [];
  return (<div style={{position: 'absolute', inset: 0, background: s.bg || 'radial-gradient(ellipse at 50% 40%, #4A2A1A, #120806 85%)'}}>
    <div style={{position: 'absolute', left: W / 2 - 430, top: 110, width: 860, height: 860, background: '#CBB89A', border: `6px solid ${INK}`, borderRadius: 40, boxShadow: 'inset 0 0 80px rgba(60,40,20,0.4)', padding: '50px 70px'}}>
      {s.kicker && <div style={{textAlign: 'center', fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: '#5A4630'}}>{s.kicker}</div>}
      <div style={{textAlign: 'center', fontFamily: TITLE, fontWeight: 800, fontSize: 62, color: '#3A2A1E', marginBottom: 40}}>{s.title || 'TO-DO LIST'}</div>
      {items.map((it, i) => { const x = typeof it === 'string' ? {text: it} : it; const t0 = at(b, x, i, 26, 6); const p = expo(f - t0, 8);
        const st = x.strike === false ? 0 : inOut(f - (x.strikeWord ? wordAt(b, x.strikeWord, 40) : t0 + 22), 9);
        return (<div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26, marginBottom: 34, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
          <div style={{width: 74, height: 74, borderRadius: 37, background: '#3A2A1E', border: `4px solid ${INK}`, color: '#F1E6CC', fontFamily: SANS, fontWeight: 900, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{x.icon || '?'}</div>
          <div><div style={{fontFamily: TITLE, fontWeight: 800, fontSize: 46, color: '#3A2A1E'}}>{x.text}</div>{x.sub && <div style={{fontFamily: ITAL, fontStyle: 'italic', fontSize: 24, color: '#6A5438'}}>{x.sub}</div>}</div>
          {st > 0 && <div style={{position: 'absolute', left: 96, top: 30, height: 8, width: `${st * 72}%`, background: '#C8321F', borderRadius: 4, boxShadow: '0 0 12px rgba(255,120,40,0.8)'}} />}
          {st > 0 && st < 1 && <div style={{position: 'absolute', left: `calc(96px + ${st * 72}%)`, top: 14, width: 40, height: 40, borderRadius: 20, background: 'radial-gradient(#FFF6B0, rgba(255,160,40,0))'}} />}
        </div>); })}
    </div>
  </div>);
};

// a document / contract / file: title, rows that type in, a stamp and signatures
export const Document = ({f, s, b, cast}) => {
  const rows = s.rows || [];
  return (<div style={{position: 'absolute', inset: 0, background: s.bg || '#3A2A20'}}>
    <div style={{position: 'absolute', left: W / 2 - 520, top: 90, width: 1040, height: 900, background: '#F4ECD8', border: `6px solid ${INK}`, transform: `rotate(${s.tilt ?? -2}deg)`, padding: '60px 80px', boxShadow: '0 24px 0 rgba(0,0,0,0.3)'}}>
      <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: 64, color: '#8A1E1E', borderBottom: `4px solid ${INK}`, paddingBottom: 14, marginBottom: 30}}>{s.title}</div>
      {s.who && <div style={{float: 'right', border: `4px solid ${INK}`, marginLeft: 30}}><Mini cast={cast} who={s.who} face={s.face} f={f} w={220} h={260} /></div>}
      {rows.map((r, i) => { const t0 = at(b, r, i, 24, 8); const n = Math.max(0, Math.floor((f - t0) * 1.6));
        return (<div key={i} style={{display: 'flex', gap: 24, marginBottom: 24, fontSize: 38, opacity: f >= t0 ? 1 : 0}}>
          <div style={{fontFamily: SANS, fontWeight: 900, color: '#8A1E1E', minWidth: 200}}>{r.label}</div>
          <div style={{fontFamily: ITAL, fontStyle: 'italic', color: '#2A1E17'}}>{String(r.value).slice(0, n)}</div>
        </div>); })}
    </div>
    {s.stamp && <Stamp f={f} at={wordAt(b, s.stamp.word, Math.max(20, b.frames - 40))} text={s.stamp.text} x={s.stamp.x ?? 0.62} y={s.stamp.y ?? 0.78} />}
  </div>);
};

// paper map with routes drawing on, places, pins and an optional stamp
export const MapRoute = ({f, s, b}) => {
  const t = f - b.from, places = s.places || [], routes = s.routes || (s.route ? [s.route] : []);
  return (<div style={{position: 'absolute', inset: 0, background: '#3A2A20'}}>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <rect x="80" y="60" width={W - 160} height={H - 120} fill="#EFE2C2" {...S} />
      <path d={`M80,${H * 0.62} Q${W * 0.3},${H * 0.52} ${W * 0.5},${H * 0.66} T${W - 80},${H * 0.58} L${W - 80},${H - 60} L80,${H - 60} Z`} fill="#9CC7D8" opacity="0.7" />
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${80 + i * 270},60 L${80 + i * 270},${H - 60}`} stroke="rgba(120,90,50,0.15)" strokeWidth="2" />)}
      {Array.from({length: 9}, (_, i) => { const y0 = 140 + hash(i + 1) * (H - 300), x0 = 120 + hash(i + 11) * 400;
        return <path key={'r' + i} d={`M${x0},${y0} Q${W * 0.5},${y0 + (hash(i + 5) - 0.5) * 300} ${W - 120 - hash(i + 3) * 300},${y0 + (hash(i + 7) - 0.5) * 200}`} fill="none" stroke={i % 3 ? '#C9B58E' : '#D9A441'} strokeWidth={i % 3 ? 5 : 8} />; })}
      {Array.from({length: 5}, (_, i) => <ellipse key={'g' + i} cx={200 + hash(i + 21) * (W - 400)} cy={150 + hash(i + 31) * (H * 0.4)} rx={60 + hash(i) * 80} ry={40 + hash(i + 2) * 50} fill="#B9CF92" opacity="0.7" />)}
      {(s.areas || []).map((a, i) => <ellipse key={i} cx={a.x * W} cy={a.y * H} rx={a.r || 160} ry={(a.r || 160) * 0.7} fill={a.color || 'rgba(200,120,110,0.35)'} stroke="rgba(120,60,50,0.5)" strokeWidth="3" strokeDasharray="8 6" />)}
      {routes.map((r, k) => { const pts = r.points || r; const d = 'M' + pts.map(([x, y]) => `${x * W},${y * H}`).join(' L');
        const len = pts.reduce((a, p, i) => (i ? a + Math.hypot((p[0] - pts[i - 1][0]) * W, (p[1] - pts[i - 1][1]) * H) : 0), 0);
        const p = inOut(f - wordAt(b, r.word, 3 + k * 20), r.frames || 18);
        return <path key={k} d={d} fill="none" stroke={r.color || '#D23A2E'} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={r.dashed ? `24 14` : `${len}`} strokeDashoffset={r.dashed ? 0 : len * (1 - p)}
          style={r.dashed ? {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`} : undefined} />; })}
    </svg>
    {places.map((pl, i) => { const t0 = at(b, pl, i, 12, 4); const p = pop(f - t0, 5);
      return (<div key={i} style={{position: 'absolute', left: pl.x * W, top: pl.y * H, transform: `translate(-50%,-50%) scale(${p})`, textAlign: 'center'}}>
        {pl.pin ? <div style={{width: 34, height: 34, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: '#D23A2E', border: `4px solid ${INK}`, margin: '0 auto'}} />
          : <div style={{width: 18, height: 18, borderRadius: 9, border: `4px solid ${INK}`, background: '#fff', margin: '0 auto'}} />}
        <div style={{fontFamily: pl.big ? TITLE : SANS, fontWeight: 800, fontSize: pl.big ? 54 : 26, color: INK, marginTop: 6, whiteSpace: 'nowrap', letterSpacing: pl.big ? 2 : 0}}>{pl.name}</div>
      </div>); })}
    {s.title && <div style={{position: 'absolute', right: 140, top: 100, fontFamily: TITLE, fontWeight: 800, fontSize: 56, color: '#8A1E1E', textAlign: 'right'}}>{s.title}</div>}
    {s.stamp && <Stamp f={f} at={wordAt(b, s.stamp.word, Math.max(20, b.frames - 40))} text={s.stamp.text} x={s.stamp.x ?? 0.6} y={s.stamp.y ?? 0.7} />}
  </div>);
};

// polaroids pinned to a wall/board: each has a cast picture and a hand-written caption; optional stamp / red X
export const Polaroids = ({f, s, b, cast}) => {
  const ph = s.photos || [];
  return (<div style={{position: 'absolute', inset: 0, background: s.bg || '#C99A62'}}>
    {s.string && <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><path d={'M' + ph.map((_, i) => `${(ph[i].x ?? (0.2 + i * 0.3)) * W},${(ph[i].y ?? 0.42) * H - 180}`).join(' L')} fill="none" stroke="#C0221E" strokeWidth="5" /></svg>}
    {ph.map((p, i) => { const t0 = at(b, p, i, 16, 4); const k = pop(f - t0, 6), x = p.x ?? (0.2 + i * 0.3), y = p.y ?? 0.45, rot = p.rot ?? (hash(i + 4) - 0.5) * 14;
      const X = p.cross ? inOut(f - wordAt(b, p.crossWord, 40), 8) : 0;
      return (<div key={i} style={{position: 'absolute', left: x * W, top: y * H, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${k})`, background: '#FBF8F0', border: `4px solid ${INK}`, padding: '22px 22px 80px', boxShadow: '0 16px 0 rgba(0,0,0,0.25)'}}>
        <div style={{position: 'absolute', left: '50%', top: -16, width: 30, height: 30, marginLeft: -15, borderRadius: 15, background: '#D23A2E', border: `3px solid ${INK}`}} />
        <div style={{border: `3px solid ${INK}`}}><Mini cast={cast} who={p.who} age={p.age} face={p.face} pose={p.pose} f={f} w={p.w || 380} h={p.h || 300} set={p.set} /></div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: HAND, fontSize: 40, color: INK}}>{p.caption}</div>
        {X > 0 && <svg width="430" height="420" style={{position: 'absolute', left: 0, top: 0}}><path d="M60,60 L370,330 M370,60 L60,330" stroke="#D23A2E" strokeWidth="16" strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - X)} /></svg>}
      </div>); })}
    {s.stamp && <Stamp f={f} at={wordAt(b, s.stamp.word, Math.max(20, b.frames - 40))} text={s.stamp.text} x={s.stamp.x ?? 0.5} y={s.stamp.y ?? 0.2} />}
  </div>);
};

// counter: label + number that rolls ("HOURS WORKED ×1 -> ×8 -> ×63,284 -> ∞"); steps land on their words
export const Counter = ({f, s, b}) => {
  const steps = s.steps || [{value: s.value}];
  let shown = steps[0].value, k = 0;
  steps.forEach((st, i) => { const t0 = at(b, st, i, 16, 6); if (f >= t0) { shown = st.value; k = f - t0; } });
  const scramble = s.glitch && k < 6 ? String(shown).replace(/\d/g, () => '#@!%$'[Math.floor(hash(f) * 5)]) : shown;
  return (<div style={{position: 'absolute', right: s.x ?? 180, top: s.y ?? 140, transform: `rotate(-4deg) scale(${pop(f - b.from - 4, 5)})`, background: 'linear-gradient(#26446A, #182C47)', border: '5px solid #9CC3E8',
    borderRadius: 18, padding: '18px 54px', textAlign: 'center', boxShadow: '0 14px 0 rgba(0,0,0,0.35)'}}>
    <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: '#CFE3F7'}}>{s.label}</div>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 92, color: '#fff', transform: `scale(${mix(1.18, 1, Math.min(1, k / 5))})`, lineHeight: 1.05}}>{s.prefix ?? '×'}{scramble}</div>
  </div>);
};

// before / after: two framed portraits on a wall
export const BeforeAfter = ({f, s, b, cast}) => (<div style={{position: 'absolute', inset: 0, background: s.wall || '#6B4A35'}}>
  {[s.left, s.right].map((p, i) => p && (<div key={i} style={{position: 'absolute', left: i ? 1040 : 280, top: 170, transform: `scale(${pop(f - b.from - 3 - i * 14, 5)}) rotate(${i ? 2 : -2}deg)`, background: '#C9A86A', border: `6px solid ${INK}`, padding: 26}}>
    <div style={{border: `4px solid ${INK}`}}><Mini cast={cast} who={p.who} age={p.age} face={p.face} f={f} w={520} h={560} bg={p.bg || '#E8DCC2'} /></div>
    <div style={{position: 'absolute', left: '50%', bottom: -26, transform: 'translateX(-50%)', background: '#FFFDF6', border: `4px solid ${INK}`, borderRadius: 10, padding: '4px 22px', fontFamily: SANS, fontWeight: 900, fontSize: 30}}>{p.label || (i ? 'AFTER' : 'BEFORE')}</div>
  </div>))}
</div>);

// old TV with a BREAKING lower third
export const TVNews = ({f, s, b, cast}) => (<div style={{position: 'absolute', inset: 0, background: '#2A2420'}}>
  <div style={{position: 'absolute', left: 300, top: 110, width: 1320, height: 860, background: '#5A4636', border: `8px solid ${INK}`, borderRadius: 50, padding: 60}}>
    <div style={{position: 'relative', width: 1060, height: 700, borderRadius: 40, overflow: 'hidden', border: `6px solid ${INK}`}}>
      <Mini cast={cast} who={s.who} face={s.face} f={f} w={1060} h={700} bg="#9FB7C9" />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, background: '#F4F1EA', padding: '10px 26px', display: 'flex', gap: 20, alignItems: 'center', transform: `translateX(${(1 - expo(f - b.from - 8, 10)) * -1100}px)`}}>
        <div style={{background: '#C0221E', color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 30, padding: '4px 14px'}}>BREAKING</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 36, color: INK}}>{s.headline}</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 2px, transparent 2px 5px)'}} />
    </div>
  </div>
</div>);

// mid-video engagement break (33-40 % of runtime): comment box with names, then the "keep it going" checklist ticking itself
export const PollBreak = ({f, s, b}) => {
  const t = f - b.from, half = b.frames * 0.55;
  const names = s.names || ['Lighthouse keeper', 'Bomb disposal tech', 'Air traffic controller'];
  return (<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #2A2026, #0D0A0C 80%)'}}>
    {t < half ? (<div style={{position: 'absolute', left: W / 2 - 520, top: 260, width: 1040, background: '#1C1B21', border: '3px solid #3A3942', borderRadius: 22, padding: 40, opacity: expo(t, 8)}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: '#fff', marginBottom: 20}}>{s.question || 'Who should we be born as next?'}</div>
      <div style={{background: '#2A2930', borderRadius: 12, padding: '16px 22px', fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#8E8C96', marginBottom: 20}}>Add a comment…</div>
      {names.map((n, i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0', opacity: expo(t - 12 - i * 8, 6)}}>
        <div style={{width: 46, height: 46, borderRadius: 23, background: ['#C0392B', '#2E86C1', '#D4AC0D'][i % 3]}} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#E8E6EE', flex: 1}}>{n}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, color: '#8E8C96'}}>👍 {Math.round(hash(i + 1) * 900 + 100)}</div>
      </div>)}
    </div>) : (<div style={{position: 'absolute', left: W / 2 - 440, top: 300, width: 880, background: '#1C1B21', border: '3px solid #3A3942', borderRadius: 22, padding: 40}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 38, color: '#fff', marginBottom: 24}}>{s.title || 'Keep the stories going'}</div>
      {(s.items || ['Like the video', 'Subscribe', 'Comment who is next']).map((x, i) => { const on = f - b.from - half - 10 - i * 14 > 0;
        return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '10px 0'}}>
          <div style={{width: 40, height: 40, borderRadius: 8, border: '3px solid #8E8C96', background: on ? '#E8E6EE' : 'transparent', color: '#1C1B21', fontFamily: SANS, fontWeight: 900, fontSize: 30, textAlign: 'center', lineHeight: '38px'}}>{on ? '✓' : ''}</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, color: '#E8E6EE'}}>{x}</div></div>; })}
    </div>)}
  </div>);
};
