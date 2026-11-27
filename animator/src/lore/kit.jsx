// Lore style kit: shared look, motion helpers and overlays for the "born-as" format (docs/lore-style.md).
// Everything is a pure function of the frame, so any frame renders on its own (storyboard stills, 360p, 1080p).
import React from 'react';
import {staticFile} from 'remotion';
import {clamp01, mix, expo, inOut, hash} from '../flow/kit';

export {clamp01, mix, expo, inOut, hash};
export const W = 1920, H = 1080, FPS = 30;
export const INK = '#2A1E17';          // outline colour (dark brown, never pure black)
export const LW = 5;                    // outline width at 1080p
export const TITLE = '"BitterX", Georgia, serif';
export const ITAL = '"BitterI", Georgia, serif';
export const HAND = '"HandX", "Comic Sans MS", cursive';
export const MONO = '"MonoX", "DejaVu Sans Mono", monospace';
export const SANS = '"InterX", Inter, Arial, sans-serif';

export const LoreFonts = () => (
  <style>{`
    @font-face{font-family:InterX;font-weight:700;src:url(${staticFile('Inter-Bold.otf')})}
    @font-face{font-family:InterX;font-weight:800;src:url(${staticFile('Inter-ExtraBold.otf')})}
    @font-face{font-family:InterX;font-weight:900;src:url(${staticFile('Inter-Black.otf')})}
    @font-face{font-family:BitterX;font-weight:800;src:url(${staticFile('Bitter-ExtraBold.ttf')})}
    @font-face{font-family:BitterI;font-style:italic;font-weight:600;src:url(${staticFile('Bitter-SemiBoldItalic.ttf')})}
    @font-face{font-family:HandX;src:url(${staticFile('PatrickHand-Regular.ttf')})}
    @font-face{font-family:MonoX;font-weight:700;src:url(${staticFile('JetBrainsMono-Bold.ttf')})}
  `}</style>
);

// One colour temperature per scene (rules §4). A spec can override any key with show.set.colors.
export const MOODS = {
  warm:  {sky: '#F3E3C3', wall: '#EAD9B8', wall2: '#DCC59C', floor: '#B98A5A', floor2: '#9E7148', trim: '#A8322B', light: '#FFE7A8', glow: 'rgba(255,214,140,0.35)'},
  night: {sky: '#16203F', wall: '#2E3C66', wall2: '#25325A', floor: '#1F2645', floor2: '#181E39', trim: '#8C6A3E', light: '#FFD27A', glow: 'rgba(255,210,122,0.25)'},
  dusk:  {sky: '#E9937A', wall: '#B5614F', wall2: '#9A4F42', floor: '#5B3B3A', floor2: '#4A3030', trim: '#F2C26B', light: '#FFD9A0', glow: 'rgba(255,190,140,0.30)'},
  ember: {sky: '#3A1209', wall: '#6E2A14', wall2: '#5A2210', floor: '#3B1A10', floor2: '#2C130B', trim: '#F08A2A', light: '#FFB24A', glow: 'rgba(255,140,40,0.35)'},
  teal:  {sky: '#0E2A31', wall: '#16424B', wall2: '#123840', floor: '#0F2B31', floor2: '#0B2227', trim: '#4FD1C5', light: '#9FF3EA', glow: 'rgba(80,220,210,0.25)'},
  snow:  {sky: '#C9D6E2', wall: '#DDE6EE', wall2: '#C8D4DF', floor: '#EEF3F7', floor2: '#D9E2EA', trim: '#5B6B7C', light: '#FFFFFF', glow: 'rgba(255,255,255,0.35)'},
  sepia: {sky: '#E8D7AE', wall: '#E3CFA2', wall2: '#D3BC8A', floor: '#B89A68', floor2: '#A2855A', trim: '#8A6A3E', light: '#FFF1C8', glow: 'rgba(255,240,200,0.4)'},
  steel: {sky: '#2A2F36', wall: '#4A525C', wall2: '#3E454E', floor: '#2C3036', floor2: '#23272C', trim: '#E8B341', light: '#FFE9A8', glow: 'rgba(255,230,160,0.22)'},
};
export const mood = (m, over = {}) => ({...MOODS[m] || MOODS.warm, ...over});

// overshoot pop (labels, stamps, emotes): 0 -> 1.12 -> 1 over d frames
export const pop = (t, d = 6) => (t <= 0 ? 0 : t >= d * 2 ? 1 : t < d ? 1.12 * expo(t, d) : mix(1.12, 1, inOut(t - d, d)));

// frame of a spoken word in the beat (first word that starts with `word`), else a fallback offset
const clean = (s) => String(s).replace(/[^\w$%.'-]/g, '').toLowerCase();
export const wordAt = (b, word, fb = 10) => {
  if (word && b.words) { const x = b.words.find((w) => clean(w.w).startsWith(clean(word))); if (x) return x.f; }
  return b.from + fb;
};
// is the narrator speaking at frame f (for light mouth flaps on the talking character)
export const speaking = (b, f) => (b.words || []).some((w) => f >= w.f && f < w.f + 7);

// ---------------------------------------------------------------- camera (rules §6: nearly every shot moves)
// cam: {move: 'push'|'pull'|'pan'|'hold'|'shake', amount (zoom fraction, default 0.08), focus: [x, y] 0-1, dir: [dx, dy] pixels for pan}
export const camTransform = (cam = {}, p, f) => {
  const mv = cam.move || 'push', a = cam.amount ?? 0.08;
  const [fx, fy] = cam.focus || [0.5, 0.45];
  let s = 1, tx = 0, ty = 0;
  if (mv === 'push') s = 1 + a * p;
  if (mv === 'pull') s = 1 + a * (1 - p);
  if (mv === 'pan') { s = 1 + (cam.amount ?? 0.06); const [dx, dy] = cam.dir || [-120, 0]; tx = dx * (p - 0.5); ty = dy * (p - 0.5); }
  if (mv === 'shake' || cam.shake) { const k = Math.max(0, 1 - p * 3); tx += (hash(f) - 0.5) * 18 * k; ty += (hash(f + 9) - 0.5) * 18 * k; s = Math.max(s, 1.03); }
  return `translate(${tx}px, ${ty}px) scale(${s})`;
};
export const camOrigin = (cam = {}) => { const [fx, fy] = cam.focus || [0.5, 0.45]; return `${fx * 100}% ${fy * 100}%`; };

// ---------------------------------------------------------------- particles (embers, rain, snow, dust)
export const Particles = ({kind, f, n = 70}) => {
  const items = [];
  for (let i = 0; i < n; i++) {
    const x0 = hash(i * 3.1) * W, sp = 0.5 + hash(i * 7.7), ph = hash(i * 1.3) * 1000;
    if (kind === 'rain') { const y = ((ph + f * 38 * sp) % (H + 200)) - 100; items.push(<line key={i} x1={x0 - y * 0.12} y1={y} x2={x0 - y * 0.12 - 6} y2={y + 34} stroke="rgba(200,220,255,0.45)" strokeWidth="2" />); }
    else if (kind === 'snow') { const y = ((ph + f * 3 * sp) % (H + 40)) - 20; const x = x0 + Math.sin((f + ph) / 40) * 30; items.push(<circle key={i} cx={x} cy={y} r={2 + sp * 3} fill="rgba(255,255,255,0.85)" />); }
    else if (kind === 'embers') { const y = H + 20 - ((ph + f * 4 * sp) % (H + 60)); const x = x0 + Math.sin((f + ph) / 25) * 24; items.push(<circle key={i} cx={x} cy={y} r={1.5 + sp * 2.5} fill={i % 3 ? '#FFB347' : '#FF6A1A'} opacity={0.5 + 0.5 * hash(i + Math.floor(f / 4))} />); }
    else { const y = (ph * 0.7 + Math.sin((f + ph) / 60) * 40) % H; const x = (x0 + f * 0.4 * sp) % W; items.push(<circle key={i} cx={x} cy={y} r={1 + sp * 1.6} fill="rgba(255,240,210,0.35)" />); }
  }
  return <svg width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>{items}</svg>;
};

export const Vignette = ({k = 0.55}) => <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${k}) 100%)`, pointerEvents: 'none'}} />;

// god rays from a light source (x, y in 0-1)
export const Rays = ({x = 0.5, y = -0.05, f, color = 'rgba(255,235,190,0.10)', n = 7}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none'}}>
    {Array.from({length: n}, (_, i) => { const a = -0.9 + (1.8 * i) / (n - 1) + Math.sin(f / 90 + i) * 0.03, L = 2200, w = 0.05;
      const cx = x * W, cy = y * H;
      return <path key={i} d={`M${cx},${cy} L${cx + Math.sin(a - w) * L},${cy + Math.cos(a - w) * L} L${cx + Math.sin(a + w) * L},${cy + Math.cos(a + w) * L} Z`} fill={color} />; })}
  </svg>
);

// ---------------------------------------------------------------- text overlays
// name tag: white rounded label + tiny caption under it ("CALLISTO / your mom")
export const NameTag = ({f, at, x, y, text, sub, tilt = -3}) => {
  const p = pop(f - at, 5);
  return (<div style={{position: 'absolute', left: x * W, top: y * H, transform: `translate(-50%,-50%) rotate(${tilt}deg) scale(${p})`, opacity: p > 0 ? 1 : 0, textAlign: 'center'}}>
    <div style={{background: '#FFFDF6', border: `4px solid ${INK}`, borderRadius: 16, padding: '6px 22px', fontFamily: SANS, fontWeight: 900, fontSize: 34, color: INK, letterSpacing: 1, boxShadow: '0 8px 0 rgba(0,0,0,0.25)'}}>{text}</div>
    {sub && <div style={{fontFamily: ITAL, fontStyle: 'italic', fontSize: 22, color: '#FFFDF6', textShadow: '0 2px 4px rgba(0,0,0,0.8)', marginTop: 4}}>{sub}</div>}
  </div>);
};

// callout: bold white outlined words + a curved arrow that draws on to the subject
export const Callout = ({f, at, text, from = [0.2, 0.15], to = [0.45, 0.45], size = 48}) => {
  const p = inOut(f - at - 3, 10), tp = expo(f - at, 8);
  const [x1, y1] = [from[0] * W, from[1] * H + 34], [x2, y2] = [to[0] * W, to[1] * H];
  const cx = (x1 + x2) / 2 + (y2 - y1) * 0.35, cy = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.25;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.3;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  return (<>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} style={{filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.6))'}} />
      {p > 0.95 && <path d="M-26,-16 L0,0 L-26,16" transform={`translate(${x2},${y2}) rotate(${ang * 180 / Math.PI})`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
    <div style={{position: 'absolute', left: from[0] * W, top: from[1] * H, transform: `translate(-50%,-50%) rotate(-4deg)`, opacity: tp, fontFamily: SANS, fontWeight: 900, fontSize: size, color: '#fff',
      WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 4px 0 rgba(0,0,0,0.35)', whiteSpace: 'nowrap', letterSpacing: 1}}>{text}</div>
  </>);
};

// place / source tag, top-right corner ("NIGHT SHIFT · LONDON · 1998")
export const PlaceTag = ({f, at, text}) => (
  <div style={{position: 'absolute', right: 56, top: 44, opacity: expo(f - at, 10), background: 'rgba(20,16,14,0.85)', border: '2px solid rgba(255,240,220,0.75)', borderRadius: 10,
    padding: '8px 18px', fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#F5EBDD'}}>{text}</div>
);

// big place title ("MANCHESTER" + small line)
export const PlaceTitle = ({f, at, text, sub, x = 0.82, y = 0.2}) => {
  const p = expo(f - at, 9);
  return (<div style={{position: 'absolute', left: x * W, top: y * H, transform: 'translate(-50%,-50%)', opacity: p, filter: `blur(${(1 - p) * 6}px)`, textAlign: 'center'}}>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, color: '#fff', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill', letterSpacing: 2}}>{text}</div>
    {sub && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, color: '#fff', letterSpacing: 6, textShadow: '0 2px 3px #000'}}>{sub}</div>}
  </div>);
};

// time-jump caption bar ("A YEAR AND A HALF LATER"), tilted
export const Caption = ({f, at, text}) => {
  const p = pop(f - at, 6);
  return <div style={{position: 'absolute', left: 90, top: 70, transform: `rotate(-3deg) scale(${p})`, transformOrigin: 'left center', background: '#FFFDF6', border: `5px solid ${INK}`, borderRadius: 18,
    padding: '10px 34px', fontFamily: SANS, fontWeight: 900, fontSize: 40, color: INK, letterSpacing: 1}}>{text}</div>;
};

// rubber stamp that slams in ("DECEASED", "SOLD", "ROBBED")
export const Stamp = ({f, at, text, x = 0.7, y = 0.7, rot = -12, color = '#D23A2E', size = 64}) => {
  const t = f - at; if (t < 0) return null;
  const s = t < 4 ? mix(2.2, 0.92, t / 4) : mix(0.92, 1, inOut(t - 4, 6));
  return <div style={{position: 'absolute', left: x * W, top: y * H, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, t / 2),
    border: `7px solid ${color}`, borderRadius: 14, padding: '6px 26px', fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: 4, color, background: 'rgba(255,255,255,0.08)', whiteSpace: 'nowrap'}}>{text}</div>;
};

// speech bubble with a tail pointing at (tx, ty)
export const Bubble = ({f, at, text, x, y, tx, ty, w = 420}) => {
  const p = pop(f - at, 5); if (p <= 0) return null;
  return (<>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <path d={`M${x * W - 22},${y * H + 20} L${tx * W},${ty * H} L${x * W + 22},${y * H + 20} Z`} fill="#fff" stroke={INK} strokeWidth="4" opacity={p > 0.5 ? 1 : 0} />
    </svg>
    <div style={{position: 'absolute', left: x * W, top: y * H, width: w, transform: `translate(-50%,-100%) scale(${p})`, transformOrigin: '50% 100%', background: '#fff', border: `4px solid ${INK}`, borderRadius: 30,
      padding: '18px 28px', fontFamily: SANS, fontWeight: 800, fontSize: 32, lineHeight: 1.2, color: INK, textAlign: 'center'}}>{text}</div>
  </>);
};

// title reveal for the hook portrait: name fades in from blur, "(that's you)" 9 frames later (measured: ~3 frames blur-in)
export const HeroTitle = ({f, at, name, sub = "(that's you)", x = 0.28, y = 0.48, size}) => {
  size = size || Math.min(150, Math.round(980 / (String(name).length * 0.66)));
  const p = expo(f - at, 5), q = expo(f - at - 9, 6);
  return (<div style={{position: 'absolute', left: x * W, top: y * H, transform: 'translate(-50%,-50%)', textAlign: 'center'}}>
    <div style={{fontFamily: TITLE, fontWeight: 800, fontSize: size, color: '#F7E7C4', opacity: p, filter: `blur(${(1 - p) * 10}px)`, letterSpacing: 4,
      textShadow: `0 6px 0 ${INK}, 0 0 30px rgba(0,0,0,0.6)`, WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>{name}</div>
    <div style={{fontFamily: ITAL, fontStyle: 'italic', fontWeight: 600, fontSize: size * 0.24, color: '#F7E7C4', opacity: q, marginTop: 6, textShadow: '0 2px 4px #000'}}>{sub}</div>
  </div>);
};

// fast-forward / rewind corner icon
export const Corner = ({kind = 'ff'}) => (
  <div style={{position: 'absolute', left: 60, top: 50, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: '#fff', textShadow: '0 2px 4px #000', letterSpacing: 2}}>{kind === 'ff' ? '▶▶' : '◀◀ REW'}</div>
);
