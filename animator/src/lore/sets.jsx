// Flat vector sets for the lore style (rules §4): one colour temperature per scene, simple perspective, thick outlines.
// set: {kind, mood, colors?, blur?, props?: [...], light?: [x, y], window?: 'day'|'night'|'storm', fx?: 'rain'|'snow'|'embers'|'dust'}
import React from 'react';
import {W, H, INK, LW, mood, hash, Particles, Rays, Vignette} from './kit';

const S = {stroke: INK, strokeWidth: LW, strokeLinejoin: 'round'};
const sky = (C, night) => (<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? '#0B1230' : C.sky} /><stop offset="1" stopColor={night ? '#2A3866' : C.light} /></linearGradient></defs>);

const Window = ({x, y, w = 260, h = 220, view = 'day', C, f}) => (<g>
  <rect x={x} y={y} width={w} height={h} fill={view === 'day' ? '#9FD0F0' : view === 'storm' ? '#1C2442' : '#18224A'} {...S} />
  {view === 'day' && <><path d={`M${x},${y + h * 0.7} L${x + w * 0.3},${y + h * 0.4} L${x + w * 0.55},${y + h * 0.62} L${x + w * 0.8},${y + h * 0.35} L${x + w},${y + h * 0.6} L${x + w},${y + h} L${x},${y + h}Z`} fill="#7C93B8" />
    <path d={`M${x + w * 0.22},${y + h * 0.48} l${w * 0.08},-${h * 0.08} l${w * 0.08},${h * 0.08}Z`} fill="#fff" /></>}
  {view !== 'day' && <circle cx={x + w * 0.7} cy={y + h * 0.3} r={h * 0.12} fill="#F4F1DE" opacity={view === 'storm' ? 0.4 : 1} />}
  {view === 'storm' && (f % 70) < 3 && <rect x={x} y={y} width={w} height={h} fill="#fff" opacity="0.7" />}
  <path d={`M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}`} stroke={INK} strokeWidth="6" />
  <rect x={x - 14} y={y + h - 4} width={w + 28} height="18" fill={C.trim} {...S} />
</g>);

const PROPS = {
  lamp: (x, y, C) => <g><rect x={x - 6} y={y - 120} width="12" height="120" fill="#5A4636" {...S} /><path d={`M${x - 44},${y - 120} L${x + 44},${y - 120} L${x + 28},${y - 175} L${x - 28},${y - 175}Z`} fill={C.light} {...S} /><circle cx={x} cy={y - 140} r="90" fill={C.glow} /></g>,
  crib: (x, y) => <g><rect x={x - 150} y={y - 150} width="300" height="150" fill="none" {...S} />{Array.from({length: 9}, (_, i) => <path key={i} d={`M${x - 150 + i * 37.5},${y - 150} L${x - 150 + i * 37.5},${y}`} stroke={INK} strokeWidth="6" />)}<rect x={x - 160} y={y - 160} width="320" height="18" rx="8" fill="#E9E1D2" {...S} /></g>,
  bed: (x, y, C) => <g><rect x={x - 220} y={y - 90} width="440" height="90" fill="#7A5A44" {...S} /><rect x={x - 210} y={y - 120} width="420" height="44" rx="10" fill="#F1ECE2" {...S} /><rect x={x - 230} y={y - 190} width="30" height="190" fill="#7A5A44" {...S} /></g>,
  table: (x, y) => <g><rect x={x - 160} y={y - 130} width="320" height="22" fill="#8C6440" {...S} /><rect x={x - 140} y={y - 108} width="18" height="108" fill="#8C6440" {...S} /><rect x={x + 122} y={y - 108} width="18" height="108" fill="#8C6440" {...S} /></g>,
  door: (x, y, C) => <g><rect x={x - 80} y={y - 330} width="160" height="330" fill="#6B4A35" {...S} /><circle cx={x + 50} cy={y - 160} r="9" fill="#E8C060" {...S} /><rect x={x - 96} y={y - 346} width="192" height="18" fill={C.trim} {...S} /></g>,
  frame: (x, y) => <g><rect x={x - 70} y={y - 90} width="140" height="110" fill="#C9A86A" {...S} /><rect x={x - 54} y={y - 74} width="108" height="78" fill="#E9DCC0" stroke={INK} strokeWidth="3" /></g>,
  shelf: (x, y) => <g><rect x={x - 130} y={y - 260} width="260" height="260" fill="#7A5A44" {...S} />{[0, 1, 2].map((i) => <g key={i}><rect x={x - 118} y={y - 245 + i * 82} width="236" height="66" fill="#5E4434" />{Array.from({length: 7}, (_, j) => <rect key={j} x={x - 112 + j * 33} y={y - 238 + i * 82 + (j % 2) * 8} width="24" height={58 - (j % 2) * 8} fill={['#B5473A', '#3E6B8A', '#D9A441', '#4E8C5E'][(i + j) % 4]} stroke={INK} strokeWidth="2" />)}</g>)}</g>,
  rug: (x, y) => <ellipse cx={x} cy={y + 20} rx="260" ry="46" fill="#9C3A30" stroke="#E9C9A0" strokeWidth="6" strokeDasharray="14 10" />,
  crate: (x, y) => <g><rect x={x - 70} y={y - 120} width="140" height="120" fill="#C8955A" {...S} /><path d={`M${x - 70},${y - 120} L${x + 70},${y} M${x + 70},${y - 120} L${x - 70},${y}`} stroke={INK} strokeWidth="4" /></g>,
  barrel: (x, y) => <g><rect x={x - 50} y={y - 130} width="100" height="130" rx="20" fill="#3D6E8E" {...S} /><path d={`M${x - 50},${y - 90} L${x + 50},${y - 90} M${x - 50},${y - 40} L${x + 50},${y - 40}`} stroke={INK} strokeWidth="4" /></g>,
  cone: (x, y) => <g><path d={`M${x - 34},${y} L${x - 10},${y - 90} L${x + 10},${y - 90} L${x + 34},${y}Z`} fill="#F07A28" {...S} /><rect x={x - 22} y={y - 50} width="44" height="12" fill="#fff" /></g>,
  lamppost: (x, y, C) => <g><rect x={x - 9} y={y - 420} width="18" height="420" fill="#2E2E33" {...S} /><path d={`M${x},${y - 420} q60,-30 90,0`} fill="none" stroke={INK} strokeWidth="10" /><rect x={x + 70} y={y - 424} width="40" height="22" rx="6" fill={C.light} {...S} /><circle cx={x + 90} cy={y - 390} r="120" fill={C.glow} /></g>,
  van: (x, y) => <g><rect x={x - 200} y={y - 190} width="300" height="150" rx="14" fill="#E8E4DA" {...S} /><path d={`M${x + 100},${y - 150} L${x + 170},${y - 150} L${x + 200},${y - 90} L${x + 200},${y - 40} L${x + 100},${y - 40}Z`} fill="#E8E4DA" {...S} /><path d={`M${x + 110},${y - 140} L${x + 165},${y - 140} L${x + 185},${y - 100} L${x + 110},${y - 100}Z`} fill="#9FC3D9" {...S} />{[-120, 120].map((d) => <circle key={d} cx={x + d} cy={y - 36} r="34" fill="#2A2A2E" {...S} />)}</g>,
};
export const PROP_NAMES = Object.keys(PROPS);

const Room = ({C, f, set}) => {
  const fy = H * 0.74;
  return (<g>
    <rect width={W} height={fy} fill={C.wall} />
    <rect y={fy - 140} width={W} height="140" fill={C.wall2} />
    <rect y="0" width={W} height="34" fill={C.trim} />
    {Array.from({length: 40}, (_, i) => <rect key={i} x={i * 50 + 12} y="8" width="26" height="18" fill="none" stroke="#F3E3C3" strokeWidth="4" />)}
    <path d={`M0,${fy - 140} L${W},${fy - 140}`} stroke={INK} strokeWidth="4" />
    <rect y={fy} width={W} height={H - fy} fill={C.floor} {...S} />
    {Array.from({length: 12}, (_, i) => <path key={i} d={`M${i * 170},${fy} L${i * 170 - 120},${H}`} stroke={C.floor2} strokeWidth="5" />)}
    {set.window !== 'none' && <Window x={set.windowX ?? W * 0.62} y={H * 0.16} view={set.window || 'day'} C={C} f={f} />}
  </g>);
};

const Street = ({C, f, set}) => {
  const base = H * 0.72, brick = set.brick || '#A5523F';
  return (<g>
    <rect width={W} height={H} fill={set.night ? '#121A33' : C.sky} />
    <rect y={H * 0.08} width={W} height={base - H * 0.08} fill={brick} />
    {Array.from({length: 26}, (_, r) => <path key={r} d={`M0,${H * 0.08 + r * 26} L${W},${H * 0.08 + r * 26}`} stroke="rgba(0,0,0,0.12)" strokeWidth="2" />)}
    {Array.from({length: 4}, (_, i) => { const x = 120 + i * 470; const lit = hash(i + 3) > 0.4;
      return (<g key={i}>
        <rect x={x} y={base - 300} width="150" height="300" fill={['#2F4E7A', '#3D6B4F', '#7A2F3A', '#4B3B6B'][i]} {...S} />
        <rect x={x + 30} y={base - 270} width="90" height="60" fill={lit ? '#FFD98A' : '#7FA3C2'} stroke={INK} strokeWidth="3" />
        <rect x={x - 12} y={base - 318} width="174" height="20" fill="#E8E2D6" {...S} />
        <text x={x + 75} y={base - 222} textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="30" fill={INK}>{set.numbers ? set.numbers[i] : 21 + i * 2}</text>
        <rect x={x + 200} y={base - 330} width="200" height="170" fill={lit ? '#FFD98A' : '#8DB2CF'} {...S} />
        <path d={`M${x + 300},${base - 330} L${x + 300},${base - 160}`} stroke={INK} strokeWidth="6" />
        <rect x={x + 188} y={base - 166} width="224" height="18" fill="#E8E2D6" {...S} />
        <rect x={x + 200} y={H * 0.12} width="200" height="160" fill={hash(i) > 0.5 ? '#FFD98A' : '#8DB2CF'} {...S} />
      </g>); })}
    <rect y={base} width={W} height={H - base} fill={set.night ? '#2C3346' : '#9AA3AE'} {...S} />
    <path d={`M0,${base + 70} L${W},${base + 70}`} stroke={INK} strokeWidth="4" />
    {Array.from({length: 14}, (_, i) => <path key={i} d={`M${i * 150},${base} L${i * 150 - 30},${base + 70}`} stroke="rgba(0,0,0,0.18)" strokeWidth="3" />)}
  </g>);
};

const Depot = ({C, set}) => {
  const base = H * 0.75;
  return (<g>
    <rect width={W} height={H} fill={C.wall} />
    {Array.from({length: 10}, (_, i) => <rect key={i} x={i * 200} y="0" width="16" height={base} fill={C.wall2} />)}
    {[0, 1].map((i) => <g key={i}><rect x={220 + i * 900} y={base - 470} width="600" height="470" fill={C.wall2} {...S} />
      {Array.from({length: 14}, (_, j) => <path key={j} d={`M${220 + i * 900},${base - 470 + j * 34} L${820 + i * 900},${base - 470 + j * 34}`} stroke="rgba(0,0,0,0.25)" strokeWidth="3" />)}
      <rect x={220 + i * 900} y={base - 500} width="600" height="30" fill={C.trim} {...S} /></g>)}
    <rect y={base} width={W} height={H - base} fill={C.floor} {...S} />
    {Array.from({length: 16}, (_, i) => <rect key={i} x={i * 130} y={base + 30} width="70" height="14" fill={i % 2 ? '#1a1a1a' : '#E8B341'} />)}
  </g>);
};

const Tunnel = ({C, f}) => {
  const cx = W / 2, cy = H * 0.46;
  return (<g>
    <rect width={W} height={H} fill={C.wall2} />
    {Array.from({length: 9}, (_, i) => { const k = Math.pow(0.72, i), rw = 1100 * k, rh = 760 * k;
      return <path key={i} d={`M${cx - rw},${cy + rh * 0.8} L${cx - rw},${cy - rh * 0.1} Q${cx},${cy - rh * 1.2} ${cx + rw},${cy - rh * 0.1} L${cx + rw},${cy + rh * 0.8}`} fill={i % 2 ? C.wall : C.wall2} stroke={INK} strokeWidth={Math.max(2, LW * k)} />; })}
    {Array.from({length: 6}, (_, i) => { const k = Math.pow(0.72, i + 0.5); return <circle key={i} cx={cx} cy={cy - 640 * k} r={22 * k} fill={C.light} opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />; })}
    <path d={`M${cx - 200},${H} L${cx - 14},${cy + 60} M${cx + 200},${H} L${cx + 14},${cy + 60}`} stroke="#B9A88A" strokeWidth="10" />
    {Array.from({length: 10}, (_, i) => { const t = Math.pow(i / 10, 1.8); const y = cy + 60 + (H - cy - 60) * t; const hw = 14 + 230 * t; return <path key={i} d={`M${cx - hw},${y} L${cx + hw},${y}`} stroke="#6B5640" strokeWidth={3 + 10 * t} />; })}
  </g>);
};

const Road = ({C, set}) => {
  const hz = H * 0.58;
  return (<g>
    {sky(C, set.night)}<rect width={W} height={hz} fill="url(#skyg)" />
    {!set.night && <circle cx={W * 0.78} cy={H * 0.24} r="70" fill={C.light} opacity="0.9" />}
    {set.night && <circle cx={W * 0.78} cy={H * 0.2} r="56" fill="#F4F1DE" />}
    <path d={`M0,${hz} L300,${hz - 160} L560,${hz - 40} L900,${hz - 260} L1260,${hz - 30} L1560,${hz - 170} L${W},${hz - 20} L${W},${hz} Z`} fill={set.night ? '#1C2547' : '#8C7AA8'} />
    <rect y={hz} width={W} height={H - hz} fill={set.night ? '#2B2F3A' : '#C9A877'} />
    <path d={`M${W / 2 - 60},${hz} L${W / 2 + 60},${hz} L${W * 0.9},${H} L${W * 0.1},${H} Z`} fill="#4A4A52" />
    {Array.from({length: 6}, (_, i) => { const t = Math.pow((i + 1) / 7, 1.6); const y = hz + (H - hz) * t; return <rect key={i} x={W / 2 - 4 - 10 * t} y={y} width={8 + 20 * t} height={10 + 30 * t} fill="#F2D06B" />; })}
  </g>);
};

const City = ({C, f, set}) => (<g>
  {sky(C, true)}<rect width={W} height={H} fill="url(#skyg)" />
  {Array.from({length: 14}, (_, i) => { const w = 110 + hash(i) * 90, h = 260 + hash(i + 5) * 420, x = i * 140 - 20;
    return (<g key={i}><rect x={x} y={H * 0.78 - h} width={w} height={h} fill={i % 2 ? '#1E2547' : '#252D55'} stroke={INK} strokeWidth="3" />
      {Array.from({length: Math.floor(h / 46)}, (_, r) => Array.from({length: Math.floor(w / 34)}, (_, c2) => hash(i * 99 + r * 7 + c2) > 0.55 &&
        <rect key={r + '-' + c2} x={x + 10 + c2 * 34} y={H * 0.78 - h + 16 + r * 46} width="16" height="22" fill={C.light} opacity={hash(i + r + c2 + Math.floor(f / 45)) > 0.1 ? 0.9 : 0.3} />))}</g>); })}
  <rect y={H * 0.78} width={W} height={H * 0.22} fill="#1A1E2C" />
</g>);

const Sky = ({C, set}) => (<g>{sky(C, set.night)}<rect width={W} height={H} fill="url(#skyg)" />
  {set.night && Array.from({length: 80}, (_, i) => <circle key={i} cx={hash(i) * W} cy={hash(i + 40) * H * 0.6} r={1 + hash(i + 7) * 2} fill="#fff" opacity="0.8" />)}
  {set.night ? <circle cx={W * 0.72} cy={H * 0.24} r="80" fill="#F4F1DE" /> : <circle cx={W * 0.72} cy={H * 0.3} r="90" fill={C.light} />}
  <path d={`M0,${H * 0.8} Q${W * 0.25},${H * 0.66} ${W * 0.5},${H * 0.78} T${W},${H * 0.74} L${W},${H} L0,${H}Z`} fill={set.night ? '#121935' : C.floor} {...S} />
</g>);

// plain glow backdrop (silhouette scenes, portraits): one light source on a gradient
const Glow = ({C, set}) => (<g>
  <defs><radialGradient id="glowg" cx={(set.light || [0.7, 0.5])[0]} cy={(set.light || [0.7, 0.5])[1]} r="0.9"><stop offset="0" stopColor={C.light} /><stop offset="0.35" stopColor={C.wall} /><stop offset="1" stopColor={C.sky} /></radialGradient></defs>
  <rect width={W} height={H} fill="url(#glowg)" />
  <rect y={H * 0.82} width={W} height={H * 0.18} fill="rgba(0,0,0,0.35)" />
</g>);

const KINDS = {room: Room, street: Street, depot: Depot, tunnel: Tunnel, road: Road, city: City, sky: Sky, glow: Glow};
export const SET_NAMES = [...Object.keys(KINDS), 'black'];

export const Set = ({set = {}, f}) => {
  const C = mood(set.mood || (set.night ? 'night' : 'warm'), set.colors);
  if (set.kind === 'black') return <div style={{position: 'absolute', inset: 0, background: '#000'}} />;
  const K = KINDS[set.kind] || Room;
  const fy = set.kind === 'street' ? H * 0.72 : set.kind === 'depot' ? H * 0.75 : H * 0.74;
  return (<div style={{position: 'absolute', inset: 0, filter: set.blur ? `blur(${set.blur}px)` : undefined, transform: set.blur ? 'scale(1.04)' : undefined}}>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <K C={C} f={f} set={set} />
      {(set.props || []).map((p, i) => { const pr = typeof p === 'string' ? {kind: p, x: 0.15 + i * 0.25} : p; const fn = PROPS[pr.kind];
        return fn ? <g key={i}>{fn(pr.x * W, pr.y ? pr.y * H : fy + 10, C)}</g> : null; })}
    </svg>
    {set.rays && <Rays x={set.rays[0]} y={set.rays[1]} f={f} />}
  </div>);
};

export const SetFx = ({set = {}, f}) => (<>
  {set.fx && <Particles kind={set.fx} f={f} />}
  {set.mood === 'sepia' && <div style={{position: 'absolute', inset: 0, background: 'rgba(160,120,60,0.22)', mixBlendMode: 'multiply'}} />}
  <Vignette k={set.vignette ?? (['night', 'ember', 'steel', 'teal'].includes(set.mood) ? 0.6 : 0.35)} />
</>);
