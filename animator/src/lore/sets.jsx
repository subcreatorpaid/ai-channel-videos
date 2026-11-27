// Flat vector sets for the lore style (rules §4): one colour temperature per scene, simple perspective, thick outlines.
// set: {kind, mood, colors?, blur?, props?: [...], light?: [x, y], window?: 'day'|'night'|'storm', fx?: 'rain'|'snow'|'embers'|'dust'}
import React from 'react';
import {W, H, INK, LW, mood, hash, Particles, Rays, Vignette, Grain} from './kit';
import {shade, tint} from './cast';

// Sets carry a thinner line than the cast (3.5 px vs 6 px) so characters always read first, as in the reference.
const S = {stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round'};
const sh = (h, k = 0.82) => shade(h, k);
const sky = (C, night) => (<defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? '#0B1230' : C.sky} /><stop offset="1" stopColor={night ? '#2A3866' : C.light} /></linearGradient></defs>);

// window with open shutters, a sill and a view (day: sky + distant roofs; night: moon; storm: flashes)
const Window = ({x, y, w = 250, h = 230, view = 'day', C, f}) => {
  const glass = view === 'day' ? ['#AFD6EE', '#E6F1F4'] : view === 'storm' ? ['#141B36', '#2A3358'] : ['#121A3C', '#2A3866'];
  return (<g>
    {view === 'day' && <path d={`M${x},${y + h} L${x + w},${y + h} L${x + w + 260},${y + h + 420} L${x + 120},${y + h + 420}Z`} fill="#FFF6DA" opacity="0.16" />}
    <defs><linearGradient id="wing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={glass[0]} /><stop offset="1" stopColor={glass[1]} /></linearGradient></defs>
    <rect x={x} y={y} width={w} height={h} fill="url(#wing)" />
    {view === 'day' && <g>
      <path d={`M${x},${y + h * 0.72} Q${x + w * 0.3},${y + h * 0.5} ${x + w * 0.6},${y + h * 0.66} T${x + w},${y + h * 0.6} L${x + w},${y + h} L${x},${y + h}Z`} fill="#8FA9C4" />
      {[0.12, 0.42, 0.7].map((q, k) => <g key={k}><rect x={x + w * q} y={y + h * 0.7} width={w * 0.2} height={h * 0.3} fill="#EDE6DA" stroke="#6E6A70" strokeWidth="2" />
        <path d={`M${x + w * q - 6},${y + h * 0.71} L${x + w * (q + 0.1)},${y + h * 0.6} L${x + w * (q + 0.2) + 6},${y + h * 0.71}Z`} fill="#B5574A" stroke="#6E6A70" strokeWidth="2" /></g>)}
      <ellipse cx={x + w * 0.7} cy={y + h * 0.22} rx={w * 0.16} ry={h * 0.05} fill="#fff" opacity="0.8" />
    </g>}
    {view !== 'day' && <circle cx={x + w * 0.7} cy={y + h * 0.3} r={h * 0.1} fill="#F4F1DE" opacity={view === 'storm' ? 0.4 : 1} />}
    {view !== 'day' && <circle cx={x + w * 0.7} cy={y + h * 0.3} r={h * 0.22} fill="#F4F1DE" opacity="0.12" />}
    {view === 'storm' && (f % 70) < 3 && <rect x={x} y={y} width={w} height={h} fill="#fff" opacity="0.7" />}
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.wood} strokeWidth="14" />
    <rect x={x - 7} y={y - 7} width={w + 14} height={h + 14} fill="none" {...S} />
    <path d={`M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}`} stroke={C.wood} strokeWidth="9" />
    {/* shutters */}
    {[-1, 1].map((d) => { const sx = d < 0 ? x - 7 - w * 0.34 : x + w + 7;
      return <g key={d}><rect x={sx} y={y - 7} width={w * 0.34} height={h + 14} fill={C.wood} {...S} />
        {Array.from({length: 7}, (_, k) => <path key={k} d={`M${sx + 8},${y + 10 + k * (h / 7)} L${sx + w * 0.34 - 8},${y + 10 + k * (h / 7)}`} stroke={sh(C.wood, 0.7)} strokeWidth="4" />)}</g>; })}
    <rect x={x - 22} y={y + h + 2} width={w + 44} height="18" rx="3" fill={sh(C.wood, 1.1)} {...S} />
  </g>);
};

// props: one cel-shadow side each, thin outlines
const PROPS = {
  lamp: (x, y, C) => <g><circle cx={x} cy={y - 210} r="170" fill={C.glow} /><circle cx={x} cy={y - 210} r="80" fill={C.glow} />
    <rect x={x - 6} y={y - 200} width="12" height="200" fill="#4A3A2E" {...S} /><ellipse cx={x} cy={y - 2} rx="40" ry="10" fill="#4A3A2E" {...S} />
    <path d={`M${x - 50},${y - 200} L${x + 50},${y - 200} L${x + 32},${y - 268} L${x - 32},${y - 268}Z`} fill="#FFE9A8" {...S} /><path d={`M${x + 18},${y - 200} L${x + 50},${y - 200} L${x + 32},${y - 268} L${x + 12},${y - 268}Z`} fill="#F2CF7E" /></g>,
  crib: (x, y, C) => <g><rect x={x - 150} y={y - 160} width="300" height="160" fill="none" />{Array.from({length: 9}, (_, i) => <rect key={i} x={x - 146 + i * 36} y={y - 150} width="10" height="150" fill={C.wood} stroke={INK} strokeWidth="2.5" />)}
    <rect x={x - 160} y={y - 166} width="320" height="20" rx="8" fill={C.wood} {...S} /><rect x={x - 160} y={y - 30} width="320" height="16" rx="6" fill={sh(C.wood)} {...S} /></g>,
  basket: (x, y) => <g><path d={`M${x - 130},${y - 90} L${x + 130},${y - 90} Q${x + 120},${y} ${x},${y} Q${x - 120},${y} ${x - 130},${y - 90}Z`} fill="#D2A25C" {...S} />
    <path d={`M${x - 120},${y - 60} Q${x},${y - 46} ${x + 120},${y - 60} M${x - 60},${y - 90} L${x - 50},${y - 4} M${x + 60},${y - 90} L${x + 50},${y - 4} M${x},${y - 90} L${x},${y}`} fill="none" stroke="#9A6E34" strokeWidth="3" />
    <ellipse cx={x} cy={y - 90} rx="134" ry="16" fill="#E2B670" {...S} /></g>,
  bed: (x, y, C) => <g><rect x={x - 230} y={y - 200} width="34" height="200" fill={C.wood} {...S} /><rect x={x - 220} y={y - 92} width="440" height="92" fill={C.wood} {...S} /><rect x={x - 210} y={y - 126} width="420" height="46" rx="12" fill="#F1ECE2" {...S} />
    <rect x={x - 196} y={y - 150} width="110" height="40" rx="16" fill="#FFFFFF" {...S} /><path d={`M${x - 60},${y - 126} L${x + 210},${y - 126} L${x + 210},${y - 70} L${x - 60},${y - 70}Z`} fill={C.accent} {...S} /></g>,
  table: (x, y, C) => <g><rect x={x - 170} y={y - 134} width="340" height="22" rx="4" fill={C.wood} {...S} /><rect x={x - 150} y={y - 112} width="20" height="112" fill={sh(C.wood)} {...S} /><rect x={x + 130} y={y - 112} width="20" height="112" fill={sh(C.wood)} {...S} />
    <ellipse cx={x - 60} cy={y - 146} rx="40" ry="12" fill="#E9E1D2" {...S} /><circle cx={x - 70} cy={y - 154} r="12" fill="#C7463A" {...S} /><circle cx={x - 46} cy={y - 154} r="12" fill="#D9A441" {...S} /></g>,
  door: (x, y, C) => <g><rect x={x - 84} y={y - 340} width="168" height="340" fill={C.wood} {...S} /><rect x={x - 62} y={y - 316} width="124" height="130" rx="4" fill={sh(C.wood, 0.9)} {...S} /><rect x={x - 62} y={y - 166} width="124" height="140" rx="4" fill={sh(C.wood, 0.9)} {...S} />
    <circle cx={x + 58} cy={y - 170} r="9" fill="#E8C060" {...S} /><rect x={x - 100} y={y - 356} width="200" height="18" fill={C.trim} {...S} /></g>,
  frame: (x, y, C) => <g><rect x={x - 70} y={y - 90} width="140" height="110" fill="#B08A4E" {...S} /><rect x={x - 56} y={y - 76} width="112" height="82" fill="#E9DCC0" stroke={INK} strokeWidth="2.5" />
    <circle cx={x} cy={y - 46} r="16" fill="#8A6A50" /><path d={`M${x - 30},${y + 6} Q${x},${y - 34} ${x + 30},${y + 6}Z`} fill="#8A6A50" /></g>,
  photos: (x, y, C) => <g>{[[-120, -40, 110, 130], [10, -70, 130, 100], [150, -20, 90, 110], [-10, 50, 100, 80]].map(([dx, dy, w, h], i) =>
    <g key={i}><rect x={x + dx - w / 2} y={y + dy - h / 2} width={w} height={h} fill={i % 2 ? '#6B4A35' : '#B08A4E'} {...S} /><rect x={x + dx - w / 2 + 10} y={y + dy - h / 2 + 10} width={w - 20} height={h - 20} fill="#D9CBB0" stroke={INK} strokeWidth="2" />
      {Array.from({length: 1 + (i % 3)}, (_, k) => { const n = 1 + (i % 3), px = x + dx - (w - 30) / 2 + (k + 0.5) * (w - 30) / n; return <g key={k}><circle cx={px} cy={y + dy - 4} r={Math.min(12, (w - 30) / n / 3)} fill="#7A5E48" /><path d={`M${px - 14},${y + dy + h / 2 - 10} Q${px},${y + dy + 2} ${px + 14},${y + dy + h / 2 - 10}Z`} fill="#7A5E48" /></g>; })}</g>)}</g>,
  shelf: (x, y, C) => <g><rect x={x - 130} y={y - 270} width="260" height="270" fill={C.wood} {...S} />{[0, 1, 2].map((i) => <g key={i}><rect x={x - 116} y={y - 254 + i * 84} width="232" height="68" fill={sh(C.wood, 0.7)} />{Array.from({length: 7}, (_, j) => <rect key={j} x={x - 110 + j * 32} y={y - 246 + i * 84 + (j % 3) * 6} width="24" height={60 - (j % 3) * 6} fill={['#9C4A3A', '#3E5F7A', '#C8963E', '#557A5A', '#E9DCC0'][(i + j) % 5]} stroke={INK} strokeWidth="2" />)}</g>)}</g>,
  rug: (x, y) => <g><ellipse cx={x} cy={y + 22} rx="270" ry="48" fill="#8E2E26" {...S} /><ellipse cx={x} cy={y + 22} rx="236" ry="36" fill="none" stroke="#E9C9A0" strokeWidth="5" strokeDasharray="16 10" /><ellipse cx={x} cy={y + 22} rx="190" ry="26" fill="#A33A30" /></g>,
  sofa: (x, y, C) => <g><rect x={x - 250} y={y - 190} width="500" height="110" rx="26" fill={C.fabric} {...S} /><rect x={x - 240} y={y - 100} width="480" height="80" rx="10" fill={sh(C.fabric, 0.9)} {...S} />
    {[-1, 0, 1].map((k) => <rect key={k} x={x - 75 + k * 155} y={y - 132} width="150" height="54" rx="14" fill={C.fabric} {...S} />)}
    {[-1, 1].map((d) => <rect key={d} x={x + d * 250 - 40} y={y - 150} width="80" height="130" rx="30" fill={C.fabric} {...S} />)}
    <rect x={x - 190} y={y - 196} width="110" height="80" rx="18" transform={`rotate(-10,${x - 135},${y - 156})`} fill={C.accent} {...S} />
    {[-1, 1].map((d) => <rect key={d} x={x + d * 220 - 6} y={y - 20} width="12" height="20" fill="#3A2A20" />)}</g>,
  armchair: (x, y, C) => <g><rect x={x - 100} y={y - 230} width="200" height="160" rx="40" fill={C.fabric} {...S} /><rect x={x - 110} y={y - 110} width="220" height="90" rx="14" fill={sh(C.fabric, 0.9)} {...S} />
    {[-1, 1].map((d) => <rect key={d} x={x + d * 100 - 34} y={y - 150} width="68" height="130" rx="26" fill={C.fabric} {...S} />)}</g>,
  tv: (x, y, C) => <g><rect x={x - 130} y={y - 120} width="260" height="120" fill={C.wood} {...S} /><circle cx={x - 90} cy={y - 60} r="6" fill="#E8C060" /><circle cx={x + 90} cy={y - 60} r="6" fill="#E8C060" />
    <rect x={x - 110} y={y - 300} width="220" height="180" rx="22" fill="#2E2A2C" {...S} /><rect x={x - 92} y={y - 284} width="184" height="146" rx="16" fill="#151A22" /><path d={`M${x - 70},${y - 270} L${x - 20},${y - 270} L${x - 70},${y - 200}Z`} fill="#fff" opacity="0.08" />
    <path d={`M${x - 20},${y - 300} L${x - 60},${y - 370} M${x + 20},${y - 300} L${x + 60},${y - 370}`} stroke="#8A8A8A" strokeWidth="4" /></g>,
  plant: (x, y) => <g>{[-50, -20, 10, 40, -35, 25].map((a, k) => <path key={k} d={`M${x},${y - 80} Q${x + a * 1.6},${y - 180 - (k % 3) * 30} ${x + a * 2.4},${y - 150 - (k % 2) * 60}`} fill="none" stroke="#3E6B44" strokeWidth="16" strokeLinecap="round" />)}
    {[-50, -20, 10, 40, -35, 25].map((a, k) => <path key={'l' + k} d={`M${x},${y - 80} Q${x + a * 1.6},${y - 180 - (k % 3) * 30} ${x + a * 2.4},${y - 150 - (k % 2) * 60}`} fill="none" stroke="#5E9A5E" strokeWidth="9" strokeLinecap="round" />)}
    <path d={`M${x - 50},${y - 90} L${x + 50},${y - 90} L${x + 38},${y} L${x - 38},${y}Z`} fill="#B5603E" {...S} /><rect x={x - 56} y={y - 100} width="112" height="18" rx="4" fill="#C8704A" {...S} /></g>,
  clock: (x, y) => <g><circle cx={x} cy={y} r="44" fill="#F4EEE2" stroke={INK} strokeWidth="8" /><path d={`M${x},${y} L${x},${y - 28} M${x},${y} L${x + 20},${y + 6}`} stroke={INK} strokeWidth="5" strokeLinecap="round" /></g>,
  crate: (x, y) => <g><rect x={x - 70} y={y - 120} width="140" height="120" fill="#C8955A" {...S} /><path d={`M${x - 70},${y - 120} L${x + 70},${y} M${x + 70},${y - 120} L${x - 70},${y}`} stroke="#8A6236" strokeWidth="6" /><rect x={x + 20} y={y - 120} width="50" height="120" fill="#000" opacity="0.1" /></g>,
  barrel: (x, y) => <g><rect x={x - 50} y={y - 130} width="100" height="130" rx="20" fill="#3D6E8E" {...S} /><path d={`M${x - 50},${y - 90} L${x + 50},${y - 90} M${x - 50},${y - 40} L${x + 50},${y - 40}`} stroke={INK} strokeWidth="3" /><rect x={x + 14} y={y - 128} width="34" height="126" rx="14" fill="#000" opacity="0.12" /></g>,
  cone: (x, y) => <g><path d={`M${x - 34},${y} L${x - 10},${y - 90} L${x + 10},${y - 90} L${x + 34},${y}Z`} fill="#F07A28" {...S} /><rect x={x - 22} y={y - 50} width="44" height="12" fill="#fff" /></g>,
  lamppost: (x, y, C) => <g><circle cx={x + 90} cy={y - 390} r="190" fill={C.glow} /><circle cx={x + 90} cy={y - 390} r="90" fill={C.glow} /><rect x={x - 9} y={y - 420} width="18" height="420" fill="#2E2E33" {...S} /><path d={`M${x},${y - 420} q60,-30 90,0`} fill="none" stroke={INK} strokeWidth="10" /><rect x={x + 70} y={y - 424} width="40" height="22" rx="6" fill={C.light} {...S} /></g>,
  van: (x, y) => <g><rect x={x - 200} y={y - 190} width="300" height="150" rx="14" fill="#E8E4DA" {...S} /><path d={`M${x + 100},${y - 150} L${x + 170},${y - 150} L${x + 200},${y - 90} L${x + 200},${y - 40} L${x + 100},${y - 40}Z`} fill="#E8E4DA" {...S} /><path d={`M${x + 110},${y - 140} L${x + 165},${y - 140} L${x + 185},${y - 100} L${x + 110},${y - 100}Z`} fill="#9FC3D9" {...S} />{[-120, 120].map((d) => <circle key={d} cx={x + d} cy={y - 36} r="34" fill="#2A2A2E" {...S} />)}</g>,
};
export const PROP_NAMES = Object.keys(PROPS);

// meander (Greek key) band, as on the reference's interior walls
const Meander = ({y, h = 34, color, bg}) => {
  const u = h / 5, path = Array.from({length: Math.ceil(W / (u * 6)) + 1}, (_, i) => { const x = i * u * 6;
    return `M${x},${y + u * 4} L${x},${y + u} L${x + u * 3},${y + u} L${x + u * 3},${y + u * 3} L${x + u * 2},${y + u * 3} L${x + u * 2},${y + u * 2} L${x + u},${y + u * 2} L${x + u},${y + u * 4} L${x + u * 6},${y + u * 4}`; }).join(' ');
  return <g><rect y={y} width={W} height={h} fill={bg} /><path d={path} fill="none" stroke={color} strokeWidth={u * 0.7} /></g>;
};

const Room = ({C, f, set}) => {
  const fy = H * 0.76;
  return (<g>
    <defs>
      <linearGradient id="wallg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={tint(C.wall, 0.1)} /><stop offset="1" stopColor={sh(C.wall, 0.9)} /></linearGradient>
      <linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.floor} /><stop offset="1" stopColor={sh(C.floor, 0.78)} /></linearGradient>
    </defs>
    <rect width={W} height={fy} fill="url(#wallg)" />
    {/* soft shadow blobs on the wall (the reference's painted depth) */}
    {[[0.45, 0.42, 380, 120], [0.8, 0.55, 300, 90], [0.15, 0.62, 260, 80]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x * W} cy={y * H} rx={rx} ry={ry} fill="#000" opacity="0.045" />)}
    {set.wainscot && <><rect y={fy - 220} width={W} height="220" fill={C.wall2} /><path d={`M0,${fy - 220} L${W},${fy - 220}`} stroke={INK} strokeWidth="3.5" />
      {Array.from({length: 8}, (_, i) => <rect key={i} x={40 + i * 240} y={fy - 190} width="200" height="150" fill="none" stroke={sh(C.wall2, 0.85)} strokeWidth="4" />)}</>}
    {set.band !== false && <Meander y={0} color={C.bandInk || '#F3E3C3'} bg={C.trim} />}
    {set.band !== false && <path d={`M0,34 L${W},34`} stroke={INK} strokeWidth="3" />}
    {set.window !== 'none' && <Window x={(set.windowX ?? 0.66) * W} y={H * 0.17} view={set.window || 'day'} C={C} f={f} />}
    {/* skirting board + plank floor (side view, staggered seams) */}
    <rect y={fy} width={W} height={H - fy} fill="url(#floorg)" />
    {Array.from({length: 6}, (_, r) => { const y = fy + 14 + r * ((H - fy) / 5.2) * (0.7 + r * 0.12);
      return <g key={r}><path d={`M0,${y} L${W},${y}`} stroke={sh(C.floor, 0.8)} strokeWidth="3" />
        {Array.from({length: 7}, (_, k) => { const x = ((k * 330 + r * 170) % (W + 200)) - 100; return <path key={k} d={`M${x},${y} L${x},${y + 30 + r * 8}`} stroke={sh(C.floor, 0.8)} strokeWidth="3" />; })}</g>; })}
    <rect y={fy - 18} width={W} height="22" fill={sh(C.wall, 0.75)} {...S} />
  </g>);
};

const Terrace = ({C, f, set}) => {
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

// suburban street (default): clapboard houses with porches, picket fence, lawn, kerb and road, as in the reference
const Street = ({C, f, set}) => {
  if (set.terrace) return <Terrace C={C} f={f} set={set} />;
  const base = H * 0.69, night = set.night || ['night', 'teal', 'steel'].includes(set.mood);
  const houses = set.houses || ['#E9E2D2', '#C9D8DE', '#E7CDBF', '#D9DCC2'];
  return (<g>
    {sky(C, night)}<rect width={W} height={H} fill="url(#skyg)" />
    {houses.map((col, i) => { const x = -120 + i * 560, w = 500, top = base - 420;
      return (<g key={i}>
        <path d={`M${x - 30},${top + 10} L${x + w / 2},${top - 140} L${x + w + 30},${top + 10}Z`} fill={i % 2 ? '#6B4A3E' : '#5A5E6E'} {...S} />
        <rect x={x} y={top} width={w} height={base - top} fill={col} {...S} />
        {Array.from({length: 18}, (_, k) => <path key={k} d={`M${x},${top + 12 + k * 23} L${x + w},${top + 12 + k * 23}`} stroke={sh(col, 0.85)} strokeWidth="2.5" />)}
        <rect x={x + w - 60} y={top} width="60" height={base - top} fill="#000" opacity="0.08" />
        {[0.14, 0.62].map((q, k) => { const lit = night && hash(i * 3 + k) > 0.35; return <g key={k}>
          <rect x={x + w * q} y={top + 50} width="130" height="120" fill={lit ? '#FFD98A' : '#9FB8C8'} stroke={C.wood} strokeWidth="8" /><rect x={x + w * q - 5} y={top + 45} width="140" height="130" fill="none" {...S} />
          <path d={`M${x + w * q + 65},${top + 50} L${x + w * q + 65},${top + 170}`} stroke={C.wood} strokeWidth="6" />
          <rect x={x + w * q - 12} y={top + 172} width="154" height="14" fill="#F4F0E8" {...S} /></g>; })}
        {/* porch */}
        <rect x={x + w * 0.3} y={base - 190} width="190" height="190" fill={i % 2 ? '#7A3E30' : '#3E5A4A'} {...S} />
        <rect x={x + w * 0.3 + 70} y={base - 150} width="50" height="150" fill={sh(i % 2 ? '#7A3E30' : '#3E5A4A', 0.8)} stroke={INK} strokeWidth="2.5" />
        <rect x={x + w * 0.22} y={base - 214} width="270" height="24" fill="#F4F0E8" {...S} />
        {[0, 1].map((k) => <rect key={k} x={x + w * 0.22 + k * 250} y={base - 190} width="20" height="190" fill="#F4F0E8" {...S} />)}
        {[0, 1, 2].map((k) => <rect key={k} x={x + w * 0.3 - 10} y={base - 12 + k * 14 - 28} width="210" height="14" fill="#CFC8BC" stroke={INK} strokeWidth="2" />)}
      </g>); })}
    {/* lawn, bushes, fence */}
    <rect y={base} width={W} height="70" fill={night ? '#2E4A36' : '#6E9A52'} {...S} />
    {Array.from({length: 9}, (_, k) => <ellipse key={k} cx={60 + k * 230} cy={base + 4} rx="64" ry="40" fill={night ? '#2A4030' : '#4E7E44'} {...S} />)}
    {Array.from({length: 9}, (_, k) => <circle key={'f' + k} cx={40 + k * 230 + (k % 2) * 30} cy={base - 12} r="6" fill="#E8A0A8" />)}
    {Array.from({length: 64}, (_, k) => <path key={'p' + k} d={`M${k * 32},${base + 60} L${k * 32},${base - 30} L${k * 32 + 10},${base - 42} L${k * 32 + 20},${base - 30} L${k * 32 + 20},${base + 60}Z`} fill="#F4F0E8" stroke={INK} strokeWidth="2.5" />)}
    <rect y={base - 6} width={W} height="10" fill="#F4F0E8" stroke={INK} strokeWidth="2.5" />
    {/* pavement + kerb + road */}
    <rect y={base + 70} width={W} height="130" fill={night ? '#5A5E68' : '#C9C4BA'} {...S} />
    {Array.from({length: 13}, (_, k) => <path key={k} d={`M${k * 160},${base + 70} L${k * 160 - 40},${base + 200}`} stroke="rgba(0,0,0,0.12)" strokeWidth="3" />)}
    <rect y={base + 200} width={W} height="16" fill="#E2DDD2" {...S} />
    <rect y={base + 216} width={W} height={H - base - 216} fill={night ? '#2C2F38' : '#55585F'} />
    {Array.from({length: 7}, (_, k) => <rect key={k} x={k * 320 + 40} y={H - 60} width="160" height="12" fill="#E8D27A" opacity="0.8" />)}
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

const Sky = ({C, set, f}) => {
  const night = set.night;
  return (<g>{sky(C, night)}<rect width={W} height={H} fill="url(#skyg)" />
    {night && Array.from({length: 80}, (_, i) => <circle key={i} cx={hash(i) * W} cy={hash(i + 40) * H * 0.6} r={1 + hash(i + 7) * 2} fill="#fff" opacity="0.8" />)}
    {night ? <circle cx={W * 0.72} cy={H * 0.24} r="80" fill="#F4F1DE" /> : <><circle cx={W * 0.72} cy={H * 0.36} r="200" fill={C.light} opacity="0.25" /><circle cx={W * 0.72} cy={H * 0.36} r="90" fill={C.light} /></>}
    {/* soft cloud bank */}
    {Array.from({length: 7}, (_, i) => <ellipse key={i} cx={((i * 330 + f * 0.3) % (W + 400)) - 200} cy={H * (0.14 + (i % 3) * 0.05)} rx={160 + (i % 3) * 50} ry={34 + (i % 2) * 12} fill="#fff" opacity={night ? 0.05 : 0.18} />)}
    {/* distant hills and a town silhouette, then the near ground */}
    <path d={`M0,${H * 0.66} Q${W * 0.15},${H * 0.56} ${W * 0.3},${H * 0.64} T${W * 0.62},${H * 0.6} T${W},${H * 0.62} L${W},${H} L0,${H}Z`} fill={sh(C.sky, 0.72)} opacity="0.7" />
    {!set.noTown && Array.from({length: 9}, (_, i) => <rect key={i} x={W * 0.05 + i * 46} y={H * 0.62 - (20 + hash(i) * 40)} width="40" height={30 + hash(i) * 40} fill={sh(C.sky, 0.6)} opacity="0.7" />)}
    <path d={`M0,${H * 0.72} Q${W * 0.3},${H * 0.64} ${W * 0.55},${H * 0.71} T${W},${H * 0.69} L${W},${H} L0,${H}Z`} fill={sh(C.floor, 0.85)} />
    <path d={`M0,${H * 0.8} Q${W * 0.25},${H * 0.74} ${W * 0.5},${H * 0.79} T${W},${H * 0.77} L${W},${H} L0,${H}Z`} fill={night ? '#121935' : C.floor} {...S} />
  </g>);
};

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
  const fy = set.kind === 'street' ? (set.terrace ? H * 0.72 : H * 0.69 + 140) : set.kind === 'depot' ? H * 0.75 : set.kind === 'room' ? H * 0.76 : H * 0.74;
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
  <Vignette k={set.vignette ?? (['night', 'ember', 'steel', 'teal'].includes(set.mood) ? 0.6 : 0.38)} />
  {/* the reference's finish: warm soft-light grade + fine animated grain */}
  <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 35% 30%, rgba(255,226,170,0.16), rgba(120,60,20,0.10) 80%)', mixBlendMode: 'soft-light', pointerEvents: 'none'}} />
  <Grain f={f} />
</>);
