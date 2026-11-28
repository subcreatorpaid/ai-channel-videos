// Code-drawn cast for the lore style, built to match the reference look (docs/lore-style.md §3):
//  - chibi (childhood): a perfect round head with a big cel-shadow crescent (lower right), black oval eyes with two white
//    highlights, short thick brows, a tiny nose, pink blush; a small body with thick boneless arms and ball hands.
//  - adult: a tall "wooden mannequin" puppet - every limb segment is its own outlined capsule, so elbows, knees and shoulders
//    show as overlapping joints; mitten hands; a semi-realistic face (jaw, cheekbones, almond eyes, shaded nose, stubble);
//    one hard cel shadow on the side away from the light, plus faint muscle lines.
// Thick dark-brown outlines on characters (6 px), thinner ones on sets, so the cast always reads first.
// Faces swap in one frame, emotes sell the emotion. Defined once in spec.cast and reused, so a character stays consistent.
// Origin = between the feet on the ground, 1080p pixels. (Swap point for a hand-made SVG cast later: replace <Person>.)
import React, {useId} from 'react';
import {INK, mix, pop} from './kit';

const CLW = 6;                                   // character outline
const rad = (a) => (a * Math.PI) / 180;
// angle 0 = straight down, positive = towards screen right
const end = (x, y, a, L) => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];
// colour helpers: shade = the cel-shadow tone (darker, a little warmer), tint = highlight
const hex = (h) => { const n = parseInt(String(h).replace('#', '').slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const shade = (h, k = 0.78) => { try { const [r, g, b] = hex(h); return toHex([r * k * 1.02, g * k * 0.97, b * k * 0.95]); } catch (e) { return h; } };
export const tint = (h, k = 0.25) => { try { return toHex(hex(h).map((v) => v + (255 - v) * k)); } catch (e) { return h; } };

// one limb segment: outline, fill, and a cel-shadow strip on the side away from the light (screen right / below)
const Seg = ({a, b, w0, w1 = w0, color, sil, line = true}) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const side = nx >= 0 ? 1 : -1;                // shadow on the screen-right side of the segment
  const pts = (o) => `M${a[0] + nx * o * w0},${a[1] + ny * o * w0} L${b[0] + nx * o * w1},${b[1] + ny * o * w1}`;
  const taper = `M${a[0] + nx * w0 / 2},${a[1] + ny * w0 / 2} L${b[0] + nx * w1 / 2},${b[1] + ny * w1 / 2} L${b[0] - nx * w1 / 2},${b[1] - ny * w1 / 2} L${a[0] - nx * w0 / 2},${a[1] - ny * w0 / 2}Z`;
  const fillC = sil ? '#120C09' : color;
  return (<g>
    {line && <><path d={taper} fill={INK} stroke={INK} strokeWidth={CLW * 2} strokeLinejoin="round" />
      <circle cx={a[0]} cy={a[1]} r={w0 / 2 + CLW} fill={INK} /><circle cx={b[0]} cy={b[1]} r={w1 / 2 + CLW} fill={INK} /></>}
    <path d={taper} fill={fillC} /><circle cx={a[0]} cy={a[1]} r={w0 / 2} fill={fillC} /><circle cx={b[0]} cy={b[1]} r={w1 / 2} fill={fillC} />
    {!sil && <path d={pts(side * 0.3)} stroke={shade(color)} strokeWidth={Math.min(w0, w1) * 0.38} strokeLinecap="round" />}
  </g>);
};

// ---------------------------------------------------------------- body proportions (measured from the reference frames)
// adult: ~7.5 heads tall, broad shoulders, long limbs.  chibi: head ~ 55 % of the height.
const BODY = {
  adult: {head: [0, -652], hr: [50, 64], neckY: -588, sh: [96, -556], waist: [64, -400], hip: [62, -300], ua: 132, la: 122, th: 152, sn: 150,
    aw: [42, 34], fw: [34, 27], tw: [56, 48], sw: [46, 38], k: 0.74},
  chibi: {head: [0, -300], hr: [122, 122], sh: [56, -176], waist: [60, -110], hip: [62, -76], ua: 50, la: 46, th: 34, sn: 36,
    aw: [38, 36], fw: [36, 34], tw: [40, 38], sw: [38, 36], k: 1.72},
};

// ---------------------------------------------------------------- poses: [L upper, L lower], [R upper, R lower], [L thigh, L shin], [R thigh, R shin], drop
const POSES = {
  stand:  {la: [-10, -4], ra: [10, 4], ll: [-3, 0], rl: [3, 0]},
  point:  {la: [-10, -4], ra: [92, 96], ll: [-3, 0], rl: [4, 0]},
  wave:   {la: [-10, -4], ra: [150, 172], ll: [-3, 0], rl: [3, 0], wave: true},
  hips:   {la: [-42, 38], ra: [42, -38], ll: [-6, 0], rl: [6, 0]},
  cross:  {la: [-14, 98], ra: [14, -98], ll: [-4, 0], rl: [4, 0]},
  shrug:  {la: [-48, -128], ra: [48, 128], ll: [-3, 0], rl: [3, 0]},
  think:  {la: [-12, 70], ra: [18, 165], ll: [-3, 0], rl: [3, 0]},
  carry:  {la: [-12, 62], ra: [12, -62], ll: [-4, 0], rl: [4, 0], box: true},
  slump:  {la: [-4, -2], ra: [4, 2], ll: [-2, 0], rl: [2, 0], drop: 8, tilt: 7},
  kneel:  {la: [-14, -6], ra: [14, 6], ll: [-8, 0], rl: [8, 0], drop: 1, kneel: true},
  cheer:  {la: [-150, -170], ra: [150, 170], ll: [-6, 0], rl: [6, 0]},
  walk:   {la: [-10, -4], ra: [10, 4], ll: [-3, 0], rl: [3, 0], walk: true},
  work:   {la: [-30, 40], ra: [40, 110], ll: [-5, 0], rl: [5, 0], work: true},
};
export const POSE_NAMES = Object.keys(POSES);

// ---------------------------------------------------------------- expressions (swapped in one frame, rules §3)
const EXPR = {
  neutral:    {brow: [0, 0], eyes: 'open', mouth: 'flat'},
  happy:      {brow: [-8, -4], eyes: 'happy', mouth: 'smile'},
  laugh:      {brow: [-10, -6], eyes: 'happy', mouth: 'open'},
  angry:      {brow: [24, 5], eyes: 'squint', mouth: 'frown'},
  sad:        {brow: [-22, 0], eyes: 'sad', mouth: 'frown', tilt: 6},
  surprised:  {brow: [-6, -12], eyes: 'wide', mouth: 'o'},
  scared:     {brow: [-24, -8], eyes: 'wide', mouth: 'teeth'},
  smug:       {brow: [10, 0], eyes: 'squint', mouth: 'smirk'},
  tired:      {brow: [-10, 3], eyes: 'half', mouth: 'flat'},
  determined: {brow: [16, 3], eyes: 'open', mouth: 'flat'},
  worried:    {brow: [-18, -4], eyes: 'open', mouth: 'wobble'},
  asleep:     {brow: [0, 2], eyes: 'closed', mouth: 'flat'},
};
export const FACE_NAMES = Object.keys(EXPR);

// ---------------------------------------------------------------- hats (old adult head units; scaled by BODY.k)
export const HatShape = ({kind, color, holo}) => {
  const st = holo ? HOLO : {fill: color, stroke: INK, strokeWidth: 5};
  if (kind === 'hardhat') return (<g {...st}><path d="M-72,-30 Q-70,-108 0,-112 Q70,-108 72,-30 Z" /><rect x="-88" y="-38" width="176" height="16" rx="8" />
    <path d="M0,-112 L0,-36" fill="none" /></g>);
  if (kind === 'cap') return (<g {...st}><path d="M-66,-34 Q-62,-100 0,-104 Q62,-100 66,-34 Z" /><path d="M8,-42 Q74,-54 106,-30 L60,-30 Z" /></g>);
  if (kind === 'beanie') return (<g {...st}><path d="M-68,-22 Q-68,-114 0,-116 Q68,-114 68,-22 Z" /><rect x="-70" y="-42" width="140" height="24" rx="8" /><circle cx="0" cy="-118" r="14" /></g>);
  if (kind === 'mask') return (<g {...st}><path d="M-58,-30 Q-60,60 0,74 Q60,60 58,-30 Q30,-44 0,-44 Q-30,-44 -58,-30 Z" /><ellipse cx="-24" cy="-6" rx="13" ry="9" fill={holo ? 'none' : '#1a1a1a'} /><ellipse cx="24" cy="-6" rx="13" ry="9" fill={holo ? 'none' : '#1a1a1a'} /></g>);
  if (kind === 'galea') return (<g {...st}>
    <path d="M-80,-6 Q-96,-26 -96,-40 L-74,-44 Q-70,-118 0,-122 Q70,-118 74,-44 L96,-40 Q96,-26 80,-6 L70,-24 L-70,-24Z" />
    {!holo && <path d="M30,-118 Q74,-100 74,-44 L96,-40 Q96,-26 80,-6 L70,-24 L40,-24Z" fill="rgba(0,0,0,0.18)" stroke="none" />}
    <path d="M-78,-44 Q0,-60 78,-44" fill="none" strokeWidth="6" />
    <path d="M-72,-24 L-80,40 Q-64,60 -46,36 L-46,-18Z M72,-24 L80,40 Q64,60 46,36 L46,-18Z" />
    {!holo && <><circle cx="-62" cy="8" r="5" fill="#E8C060" /><circle cx="62" cy="8" r="5" fill="#E8C060" /><path d="M-6,-122 L-6,-70 M6,-122 L6,-70" fill="none" strokeWidth="3" /></>}
    {holo ? null : null}
  </g>);
  if (kind === 'crest') return (<g>
    <path d="M-60,-118 Q0,-200 60,-118 L44,-114 Q0,-170 -44,-114Z" fill={holo ? 'none' : '#B8322A'} stroke={holo ? HOLO.stroke : INK} strokeWidth={holo ? 4 : 5} />
    <HatShape kind="galea" color={color} holo={holo} /></g>);
  if (kind === 'helmet') return (<g {...st}>
    <path d="M-82,40 Q-92,-118 0,-122 Q92,-118 82,40 Q78,92 40,100 L-40,100 Q-78,92 -82,40Z" />
    {!holo && <path d="M30,-118 Q86,-100 82,40 Q78,92 40,100 L20,100 Q70,40 30,-118Z" fill="rgba(0,0,0,0.22)" stroke="none" />}
    <path d="M-62,-20 Q0,-36 62,-20 L56,22 Q0,40 -56,22Z" fill={holo ? 'none' : '#E8A62A'} />
    {!holo && <path d="M-50,-14 Q-20,-24 4,-22 L-2,-4 Q-26,-4 -48,4Z" fill="#FFE08A" stroke="none" opacity="0.8" />}
    <path d="M-8,-120 L-8,-40 M8,-120 L8,-40" fill="none" strokeWidth="3" />
    <path d="M-40,60 L40,60 M-30,78 L30,78" fill="none" strokeWidth="3" /></g>);
  if (kind === 'headlamp') return (<g {...st}><path d="M-66,-36 Q0,-56 66,-36" fill="none" strokeWidth={holo ? 4 : 10} stroke={holo ? HOLO.stroke : '#333'} /><rect x="-18" y="-62" width="36" height="26" rx="6" /><circle cx="0" cy="-49" r="7" fill="#FFF3B0" /></g>);
  return null;
};
const HOLO = {fill: 'rgba(120,190,255,0.22)', stroke: '#A8DAFF', strokeWidth: 4, strokeDasharray: '10 7'};


// ---------------------------------------------------------------- hair (drawn in head-local units, r = head radius)
// chibi hair: a cap over the round head with a soft fringe and one glossy highlight (as in the reference kids)
const ChibiHair = ({kind, color, r}) => {
  if (!kind || kind === 'bald') return null;
  const st = {fill: color, stroke: INK, strokeWidth: CLW, strokeLinejoin: 'round'};
  const R = r * 1.05, gloss = <ellipse cx={-r * 0.42} cy={-r * 0.72} rx={r * 0.2} ry={r * 0.07} transform={`rotate(-24,${-r * 0.42},${-r * 0.72})`} fill="#fff" opacity="0.28" />;
  if (kind === 'buzz') return <path d={`M${-R},${r * 0.05} A${R},${R} 0 0 1 ${R},${r * 0.05} Q${r * 0.5},${-r * 0.42} 0,${-r * 0.45} Q${-r * 0.5},${-r * 0.42} ${-R},${r * 0.05}Z`} {...st} opacity="0.85" />;
  const cap = kind === 'fringe'
    ? `M${-R},${r * 0.2} A${R},${R} 0 0 1 ${R},${r * 0.2} L${r * 0.86},${-r * 0.18} L${-r * 0.86},${-r * 0.18}Z`
    : kind === 'curly'
      ? `M${-R},${r * 0.12} ` + Array.from({length: 11}, (_, i) => { const a = Math.PI * (1 - (i + 1) / 11), a0 = Math.PI * (1 - (i + 0.5) / 11); return `Q${Math.cos(a0) * R * 1.16},${-Math.sin(a0) * R * 1.12} ${Math.cos(a) * R},${-Math.sin(a) * R + (i === 10 ? r * 0.12 : 0)}`; }).join(' ') + ` Q${r * 0.5},${-r * 0.38} 0,${-r * 0.32} Q${-r * 0.5},${-r * 0.38} ${-R},${r * 0.12}Z`
      : `M${-R},${r * 0.12} A${R},${R} 0 0 1 ${R},${r * 0.12} Q${r * 0.92},${-r * 0.28} ${r * 0.55},${-r * 0.36} Q${r * 0.2},${-r * 0.26} 0,${-r * 0.4} Q${-r * 0.3},${-r * 0.28} ${-r * 0.6},${-r * 0.36} Q${-r * 0.95},${-r * 0.26} ${-R},${r * 0.12}Z`;
  return (<g>
    {kind === 'bun' && <circle cx="0" cy={-R * 1.02} r={r * 0.32} {...st} />}
    <path d={cap} {...st} />{gloss}
  </g>);
};
// adult hair, sized to the adult face (half width 50, top -64)
const AdultHair = ({kind, color}) => {
  if (!kind || kind === 'bald') return null;
  const st = {fill: color, stroke: INK, strokeWidth: CLW * 0.8, strokeLinejoin: 'round'};
  const gloss = <path d="M-30,-58 Q-10,-70 14,-64" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />;
  if (kind === 'buzz') return <path d="M-52,-6 Q-58,-76 0,-78 Q58,-76 52,-6 Q48,-40 30,-50 Q0,-44 -30,-50 Q-48,-40 -52,-6Z" fill={color} opacity="0.8" />;
  if (kind === 'long') return (<g><path d="M-56,-20 Q-66,40 -60,120 L-34,120 Q-44,30 -40,-30 Z M56,-20 Q66,40 60,120 L34,120 Q44,30 40,-30 Z" {...st} />
    <path d="M-54,-4 Q-62,-82 0,-84 Q62,-82 54,-4 Q46,-50 22,-54 Q-4,-40 -30,-54 Q-50,-44 -54,-4Z" {...st} />{gloss}</g>);
  if (kind === 'bun') return (<g><circle cx="0" cy="-86" r="22" {...st} /><path d="M-53,-10 Q-60,-80 0,-82 Q60,-80 53,-10 Q46,-50 0,-56 Q-46,-50 -53,-10Z" {...st} />{gloss}</g>);
  if (kind === 'curly') return <path d={'M-54,-6 ' + Array.from({length: 9}, (_, i) => { const a = Math.PI * (1 - (i + 1) / 9), a0 = Math.PI * (1 - (i + 0.5) / 9); return `Q${Math.cos(a0) * 70},${-Math.sin(a0) * 92 - 4} ${Math.cos(a) * 56},${-Math.sin(a) * 80 - 4}`; }).join(' ') + ' Q30,-48 0,-48 Q-30,-48 -54,-6Z'} {...st} />;
  if (kind === 'fringe') return (<g><path d="M-54,-6 Q-60,-84 0,-86 Q60,-84 54,-6 Q50,-34 30,-34 Q14,-24 -4,-34 Q-24,-24 -40,-34 Q-52,-30 -54,-6Z" {...st} />{gloss}</g>);
  // short: a flat-top fade with a hairline and temples
  return (<g><path d="M-52,-14 Q-56,-80 0,-82 Q56,-80 52,-14 L46,-30 Q40,-48 20,-50 Q0,-44 -20,-50 Q-40,-48 -46,-30Z" {...st} />{gloss}</g>);
};

// ---------------------------------------------------------------- eyes and mouths
const ChibiEyes = ({kind, look = [0, 0], r}) => {
  const lx = look[0] * 5, ly = look[1] * 4, ex = r * 0.34, rx = r * 0.1;
  const E = (x) => {
    if (kind === 'happy') return <path d={`M${x - rx * 1.3},${4} Q${x},${-rx * 1.4} ${x + rx * 1.3},${4}`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />;
    if (kind === 'closed') return <path d={`M${x - rx * 1.2},0 Q${x},${rx} ${x + rx * 1.2},0`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />;
    const ry = (kind === 'wide' ? 1.55 : kind === 'squint' ? 0.6 : kind === 'half' ? 0.75 : 1.3) * rx;
    return (<g>
      <ellipse cx={x + lx} cy={ly} rx={kind === 'wide' ? rx * 1.15 : rx} ry={ry} fill="#1B1210" />
      {kind !== 'squint' && <><circle cx={x + lx + rx * 0.32} cy={ly - ry * 0.42} r={rx * 0.38} fill="#fff" /><circle cx={x + lx - rx * 0.35} cy={ly + ry * 0.4} r={rx * 0.17} fill="#fff" /></>}
      {kind === 'half' && <path d={`M${x - rx * 1.3},${ly - ry * 0.2} L${x + rx * 1.3},${ly - ry * 0.2}`} stroke={INK} strokeWidth="5" />}
    </g>);
  };
  return <g>{E(-ex)}{E(ex)}</g>;
};
const AdultEyes = ({kind, look = [0, 0], eyeColor, skin}) => {
  const lx = look[0] * 3, ly = look[1] * 2;
  const E = (x, d) => {
    if (kind === 'happy') return <path d={`M${x - 11},2 Q${x},-8 ${x + 11},2`} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />;
    if (kind === 'closed') return <path d={`M${x - 11},0 Q${x},5 ${x + 11},0`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />;
    const h = kind === 'wide' ? 9 : kind === 'squint' ? 3.2 : kind === 'half' ? 3.8 : 6;
    const alm = `M${x - 12},0 Q${x - 3 * d},${-h - 2} ${x + 12},${-1} Q${x + 2 * d},${h * 0.7} ${x - 12},0Z`;
    return (<g>
      <path d={alm} fill="#F4EEE6" />
      <circle cx={x + lx + d * 1} cy={ly - 0.5} r={Math.min(5.4, h + 0.5)} fill={eyeColor || '#3A2418'} />
      <circle cx={x + lx + d * 1} cy={ly - 0.5} r={Math.min(2.4, h * 0.4)} fill="#120A06" />
      <circle cx={x + lx + d * 1 + 1.6} cy={ly - 2.2} r="1.3" fill="#fff" />
      {/* heavy upper lid line + crease (the reference's "tired hero" look) */}
      <path d={`M${x - 13},1 Q${x - 3 * d},${-h - 3} ${x + 13},-1`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${x - 9},${-h - 6} Q${x},${-h - 9} ${x + 10},${-h - 5}`} fill="none" stroke={shade(skin, 0.7)} strokeWidth="2" strokeLinecap="round" />
      {kind === 'half' && <path d={`M${x - 12},-1 L${x + 12},-1`} stroke={INK} strokeWidth="3.5" />}
    </g>);
  };
  return <g>{E(-20, -1)}{E(20, 1)}</g>;
};
const Mouth = ({kind, chibi, skin}) => {
  const w = chibi ? 12 : 15, s = {fill: 'none', stroke: INK, strokeWidth: chibi ? 5 : 4, strokeLinecap: 'round', strokeLinejoin: 'round'};
  const lip = !chibi && <path d={`M${-w * 0.55},${8} Q0,${13} ${w * 0.55},${8}`} fill="none" stroke={shade(skin, 0.72)} strokeWidth="4" strokeLinecap="round" />;
  if (kind === 'smile') return <g>{!chibi ? <path d={`M${-w},-2 Q0,${w * 0.75} ${w},-2 Q0,${w * 0.35} ${-w},-2Z`} fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" /> : <path d={`M${-w},0 Q0,${w * 0.9} ${w},0`} {...s} />}</g>;
  if (kind === 'frown') return <g><path d={`M${-w},6 Q0,${-w * 0.55} ${w},6`} {...s} />{lip}</g>;
  if (kind === 'o') return <ellipse cx="0" cy="2" rx={w * 0.42} ry={w * 0.6} fill="#5A2018" stroke={INK} strokeWidth="4" />;
  if (kind === 'open') return <g><path d={`M${-w},-2 Q0,${w * 1.4} ${w},-2 Z`} fill="#5A2018" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d={`M${-w * 0.8},0 L${w * 0.8},0 L${w * 0.7},4 L${-w * 0.7},4Z`} fill="#fff" /></g>;
  if (kind === 'talk') return <ellipse cx="0" cy="2" rx={w * 0.55} ry={w * 0.32} fill="#5A2018" stroke={INK} strokeWidth="3.5" />;
  if (kind === 'teeth') return (<g><rect x={-w} y="-6" width={w * 2} height="13" rx="5" fill="#fff" stroke={INK} strokeWidth="3.5" /><path d={`M${-w},0.5 L${w},0.5`} stroke={INK} strokeWidth="2" /></g>);
  if (kind === 'smirk') return <g><path d={`M${-w * 0.8},3 Q${w * 0.3},6 ${w},-5`} {...s} />{lip}</g>;
  if (kind === 'wobble') return <path d={`M${-w},2 q${w / 2},-5 ${w},0 q${w / 2},5 ${w},0`} {...s} />;
  return <g><path d={`M${-w * 0.8},2 Q0,0 ${w * 0.8},2`} {...s} />{lip}</g>;
};

// ---------------------------------------------------------------- emotes (pop with overshoot, then loop gently)
export const EMOTES = ['vein', 'steam', 'heart', 'question', 'sweat', 'shock', 'tears', 'zzz', 'notes', 'exclaim', 'idea'];
const Emote = ({kind, t, chibi}) => {
  if (t < 0) return null;
  const p = pop(t, 5), w = Math.sin(t / 6) * 0.06, s = p * (1 + w);
  const g = (el, x = 0, y = 0) => <g transform={`translate(${x},${y}) scale(${s})`}>{el}</g>;
  const R = chibi ? [120, -120] : [80, -80];
  if (kind === 'vein') return g(<path d="M-18,-6 Q-6,-6 -6,-18 M6,-18 Q6,-6 18,-6 M18,6 Q6,6 6,18 M-6,18 Q-6,6 -18,6" fill="none" stroke="#D8322A" strokeWidth="8" strokeLinecap="round" />, R[0], R[1]);
  if (kind === 'steam') return <g>{[0, 1].map((i) => { const k = ((t + i * 12) % 24) / 24; return <circle key={i} cx={(i ? 70 : -70) + (i ? 1 : -1) * k * 30} cy={-120 - k * 50} r={12 + k * 10} fill="#fff" stroke={INK} strokeWidth="3" opacity={(1 - k) * p} />; })}</g>;
  if (kind === 'heart') return g(<path d="M0,14 C-30,-6 -18,-30 0,-14 C18,-30 30,-6 0,14 Z" fill="#E8506A" stroke={INK} strokeWidth="4" />, R[0] - 10, R[1] - 10 + Math.sin(t / 8) * 6);
  if (kind === 'question') return g(<g><circle cx="0" cy="0" r="30" fill="#fff" stroke={INK} strokeWidth="4" /><circle cx="-24" cy="34" r="8" fill="#fff" stroke={INK} strokeWidth="3" /><text x="0" y="13" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="38" fill={INK}>?</text></g>, R[0] + 20, R[1] - 30);
  if (kind === 'exclaim') return g(<text x="0" y="0" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="70" fill="#FFD23F" stroke={INK} strokeWidth="4" paintOrder="stroke">!</text>, R[0], R[1]);
  if (kind === 'sweat') return g(<path d="M0,-20 Q14,4 0,12 Q-14,4 0,-20 Z" fill="#8FD3FF" stroke={INK} strokeWidth="3" />, R[0] - 4, R[1] + 40 + (t % 30));
  if (kind === 'shock') return <g opacity={p}>{Array.from({length: 8}, (_, i) => { const a = (i / 8) * Math.PI * 2, r0 = (chibi ? 150 : 100) + Math.sin(t / 3) * 4; return <path key={i} d={`M${Math.cos(a) * r0},${Math.sin(a) * r0 - (chibi ? 0 : 20)} L${Math.cos(a) * (r0 + 26)},${Math.sin(a) * (r0 + 26) - (chibi ? 0 : 20)}`} stroke={INK} strokeWidth="5" strokeLinecap="round" />; })}</g>;
  if (kind === 'tears') return <g>{[-1, 1].map((d) => <path key={d} d={`M${d * 24},${12 + (t % 20)} q4,10 0,14 q-4,-4 0,-14`} fill="#8FD3FF" stroke={INK} strokeWidth="2" opacity={p} />)}</g>;
  if (kind === 'zzz') return g(<text x="0" y="0" fontFamily="Arial" fontWeight="900" fontSize="44" fill="#fff" stroke={INK} strokeWidth="3" paintOrder="stroke">z<tspan dy="-18" fontSize="34">z</tspan></text>, R[0], R[1] - (t % 40) * 0.6);
  if (kind === 'notes') return g(<text x="0" y="0" fontFamily="Arial" fontWeight="900" fontSize="50" fill="#fff" stroke={INK} strokeWidth="3" paintOrder="stroke">♪</text>, R[0], R[1] + Math.sin(t / 7) * 8);
  if (kind === 'idea') return g(<g><circle r="22" fill="#FFE66B" stroke={INK} strokeWidth="4" /><rect x="-9" y="20" width="18" height="12" fill="#999" stroke={INK} strokeWidth="3" /></g>, R[0] - 60, R[1] - 50);
  return null;
};

// ---------------------------------------------------------------- the person
// c = cast entry: {skin, hair, hairColor, eyeColor, top, topKind: 'tee'|'tank'|'bare'|'jacket'|'hivis'|'overalls'|'coat', bottom, shoes,
//                  hat, hatColor, beard: 'stubble'|'full', tool, badge}
const SLEEVE = {legion: 'short', tunic: 'short', armor: 'long', dress: 'none', tee: 'short', tank: 'none', bare: 'none', overalls: 'short', jacket: 'long', hivis: 'long', coat: 'long'};
const Mitten = ({at, a, w, skin, sil, chibi, fist}) => (
  <g transform={`translate(${at[0]},${at[1]}) rotate(${-a})`}>
    {chibi ? <circle cx="0" cy={w * 0.15} r={w * 0.6} fill={sil ? '#120C09' : skin} stroke={INK} strokeWidth={CLW} />
      : <g fill={sil ? '#120C09' : skin} stroke={INK} strokeWidth={CLW * 0.8} strokeLinejoin="round">
        <rect x={-w * 0.55} y={-w * 0.25} width={w * 1.1} height={w * (fist ? 1.05 : 1.3)} rx={w * 0.45} />
        <path d={`M${w * 0.4},${w * 0.05} Q${w * 0.85},${w * 0.25} ${w * 0.6},${w * 0.7}`} fill="none" />
        {!sil && <path d={`M${-w * 0.3},${w * 0.55} L${w * 0.15},${w * 0.55}`} stroke={shade(skin, 0.7)} strokeWidth="3" />}
      </g>}
  </g>);

export const Person = ({c = {}, age = 'adult', pose = 'stand', face = 'neutral', look, f, seed = 1, talk, holo, holoFrom = 0, holoUntil,
  emote, emoteFrom = 0, silhouette, rim}) => {
  const uid = useId().replace(/:/g, '');
  const B = BODY[age] || BODY.adult, P = POSES[pose] || POSES.stand, E = EXPR[face] || EXPR.neutral, chibi = age === 'chibi';
  const sil = !!silhouette;
  const skin = c.skin || '#E2A97E', hc = c.hairColor || '#2E2019', bottom = c.bottom || '#3A3F4B', shoes = c.shoes || '#2A1E17';
  const kind = c.topKind || 'tee';
  const top = kind === 'hivis' ? '#F08A24' : (c.top || '#4A6FA5');
  const F = (x) => (sil ? '#120C09' : x);
  const bob = Math.sin((f + seed * 37) / 18) * 2.2;
  const drop = P.kneel ? (chibi ? 40 : 150) : (P.drop || 0);
  // walk cycle
  const ph = P.walk ? Math.sin((f + seed * 11) / 5) : 0;
  const ll = P.walk ? [-3 + ph * 22, Math.max(0, -ph) * 20] : P.ll, rl = P.walk ? [3 - ph * 22, Math.max(0, ph) * 20] : P.rl;
  const la = P.walk ? [-10 - ph * 16, -4] : P.la;
  let ra = P.walk ? [10 + ph * 16, 4] : P.ra;
  if (P.wave) ra = [ra[0], ra[1] + Math.sin(f / 4) * 22];
  if (P.work) ra = [ra[0] + Math.sin(f / 5) * 18, ra[1] + Math.sin(f / 5) * 24];
  // blink every ~3.5 s for 3 frames
  const blink = ((f + seed * 53) % 105) < 3 && !['happy', 'closed'].includes(E.eyes);
  const eyes = blink ? 'closed' : E.eyes;
  const mouth = talk && E.mouth !== 'o' && ((f + seed) % 8) < 4 ? 'talk' : E.mouth;
  const [hx, hy0] = B.head, hy = hy0 + drop, r = B.hr[0];
  const shY = B.sh[1] + drop, waY = B.waist[1] + drop, hipY = B.hip[1] + drop;
  const tilt = (E.tilt || 0) + (P.tilt || 0);
  const holoOn = holo && f >= holoFrom && (holoUntil == null || f < holoUntil + 8);
  const holoBreak = holo && holoUntil != null && f >= holoUntil ? (f - holoUntil) / 8 : 0;
  const sleeve = SLEEVE[kind] || 'short';
  const armUpper = sleeve === 'none' ? skin : top, armLower = sleeve === 'long' ? top : skin;

  // torso outline
  const torso = chibi
    ? `M${-B.sh[0]},${shY - 4} Q${-B.sh[0] - 12},${(shY + hipY) / 2} ${-B.hip[0]},${hipY + 6} L${B.hip[0]},${hipY + 6} Q${B.sh[0] + 12},${(shY + hipY) / 2} ${B.sh[0]},${shY - 4} Q0,${shY - 22} ${-B.sh[0]},${shY - 4}Z`
    : `M-24,${shY - 36} Q-60,${shY - 18} ${-B.sh[0]},${shY} Q${-B.sh[0] - 8},${shY + 36} ${-B.sh[0] + 2},${shY + 76} Q${-B.waist[0] - 16},${waY - 30} ${-B.waist[0]},${waY} L${-B.hip[0]},${hipY + 8} L${B.hip[0]},${hipY + 8} L${B.waist[0]},${waY} Q${B.waist[0] + 16},${waY - 30} ${B.sh[0] - 2},${shY + 76} Q${B.sh[0] + 8},${shY + 36} ${B.sh[0]},${shY} Q60,${shY - 18} 24,${shY - 36}Z`;
  const torsoShade = `M${B.sh[0] * 0.22},${shY - 60} Q${B.sh[0] * 0.5},${(shY + hipY) / 2} ${B.hip[0] * 0.35},${hipY + 20} L${B.sh[0] + 40},${hipY + 20} L${B.sh[0] + 40},${shY - 60}Z`;
  const coatLen = !chibi && kind === 'coat' ? 120 : kind === 'dress' ? (chibi ? 50 : 270) : 0;

  // ---- legs (thigh + shin as separate mannequin segments, shin on top so the knee reads)
  const legs = [[-B.hip[0] * 0.48, ll, -1], [B.hip[0] * 0.48, rl, 1]].map(([x, [a1, a2], s], i) => {
    const h = [x, hipY], kn = end(h[0], h[1], a1, B.th), ft = P.kneel ? kn : end(kn[0], kn[1], a1 + a2 * (i ? -1 : 1), B.sn);
    return (<g key={'l' + i}>
      <Seg a={h} b={kn} w0={B.tw[0]} w1={B.tw[1]} color={bottom} sil={sil} />
      {!P.kneel && <Seg a={kn} b={ft} w0={B.sw[0]} w1={B.sw[1]} color={bottom} sil={sil} />}
      {!P.kneel && <path d={chibi
        ? `M${ft[0] - 22 + s * 6},${ft[1] + 6} Q${ft[0] - 24 + s * 6},${ft[1] - 18} ${ft[0] + s * 6},${ft[1] - 18} Q${ft[0] + 24 + s * 6},${ft[1] - 18} ${ft[0] + 22 + s * 6},${ft[1] + 6}Z`
        : `M${ft[0] - s * 22},${ft[1] - 22} Q${ft[0] - s * 26},${ft[1] + 6} ${ft[0] - s * 12},${ft[1] + 8} L${ft[0] + s * 34},${ft[1] + 8} Q${ft[0] + s * 40},${ft[1] - 10} ${ft[0] + s * 14},${ft[1] - 24}Z`}
        fill={F(shoes)} stroke={INK} strokeWidth={CLW * 0.85} strokeLinejoin="round" />}
    </g>);
  });

  // ---- arms (upper arm, forearm, mitten: each outlined on its own)
  const arms = [[-B.sh[0] + (chibi ? 6 : 10), la, -1], [B.sh[0] - (chibi ? 6 : 10), ra, 1]].map(([x, [a1, a2], s], i) => {
    const sh = [x, shY + (chibi ? 12 : 20)], el = end(sh[0], sh[1], a1, B.ua), hd = end(el[0], el[1], a2, B.la);
    const cuff = end(el[0], el[1], a2, B.la * 0.92);
    return (<g key={'a' + i}>
      {chibi ? <Seg a={sh} b={el} w0={B.aw[0]} w1={B.aw[1]} color={armUpper} sil={sil} />
        : <><Seg a={sh} b={el} w0={B.aw[0]} w1={B.aw[1]} color={armUpper} sil={sil} />
          {sleeve === 'short' && !sil && <Seg a={sh} b={end(sh[0], sh[1], a1, B.ua * 0.42)} w0={B.aw[0] + 5} w1={B.aw[0] + 3} color={top} sil={sil} />}</>}
      <Seg a={el} b={cuff} w0={B.fw[0]} w1={B.fw[1]} color={armLower} sil={sil} />
      {kind === 'armor' && !chibi && <><ellipse cx={sh[0] + s * 6} cy={sh[1] - 4} rx="40" ry="30" fill={F(tint(top, 0.08))} stroke={INK} strokeWidth={CLW * 0.8} />
        <Seg a={end(el[0], el[1], a2, B.la * 0.45)} b={cuff} w0={B.fw[0] + 8} w1={B.fw[1] + 10} color={shade(top, 0.85)} sil={sil} /></>}
      {!chibi && !sil && sleeve === 'none' && <path d={`M${el[0] - 6 * s},${el[1] + 20} q${4 * s},20 ${-2 * s},40`} fill="none" stroke={shade(skin, 0.72)} strokeWidth="2.5" strokeLinecap="round" />}
      <Mitten at={hd} a={a2} w={chibi ? B.fw[1] * 1.0 : 30} skin={skin} sil={sil} chibi={chibi} fist={P.box || P.work} />
      {i === 1 && c.tool && !sil && <ToolShape kind={c.tool} x={hd[0]} y={hd[1] + 10} />}
    </g>);
  });

  // ---- torso with cel shadow, clothing details, muscle lines
  const body = (<g>
    <defs><clipPath id={`t${uid}`}><path d={torso} /></clipPath></defs>
    <path d={torso} fill={F(kind === 'tank' || kind === 'bare' ? skin : top)} stroke={INK} strokeWidth={CLW} strokeLinejoin="round" />
    {!sil && <g clipPath={`url(#t${uid})`}>
      {kind === 'tank' && !chibi && <path d={`M-46,${shY - 40} L-42,${shY + 34} Q-72,${shY + 64} -68,${shY + 116} L${-B.hip[0] - 10},${hipY + 10} L${B.hip[0] + 10},${hipY + 10} L68,${shY + 116} Q72,${shY + 64} 42,${shY + 34} L46,${shY - 40} L26,${shY - 40} Q0,${shY - 2} -26,${shY - 40}Z`} fill={top} stroke={INK} strokeWidth="4" />}
      {kind === 'tank' && !chibi && [-30, -14, 2, 18, 34].map((x) => <path key={x} d={`M${x},${shY + 50} L${x * 1.2},${hipY}`} stroke={shade(top, 0.88)} strokeWidth="2" />)}
      {(kind === 'bare' || kind === 'tank') && !chibi && <g fill="none" stroke={shade(skin, 0.68)} strokeWidth="2.5" strokeLinecap="round">
        {kind === 'bare' && <><path d={`M-64,${shY + 58} Q-30,${shY + 86} -4,${shY + 64}`} /><path d={`M64,${shY + 58} Q30,${shY + 86} 4,${shY + 64}`} />
          <path d={`M0,${shY + 70} L0,${hipY - 20}`} />{[0, 1, 2].map((k2) => <path key={k2} d={`M-26,${shY + 112 + k2 * 40} Q-12,${shY + 118 + k2 * 40} -3,${shY + 112 + k2 * 40} M26,${shY + 112 + k2 * 40} Q12,${shY + 118 + k2 * 40} 3,${shY + 112 + k2 * 40}`} />)}</>}
      </g>}
      {kind === 'legion' && (c.mail ? <g>
          <rect x={-200} y={shY - 40} width="400" height={hipY - shY + 30} fill="#8E9294" />
          {Array.from({length: 14}, (_, k) => <path key={k} d={`M-200,${shY - 30 + k * ((hipY - shY + 20) / 14)} L200,${shY - 30 + k * ((hipY - shY + 20) / 14)}`} stroke="#6E7274" strokeWidth="2" strokeDasharray="5 4" />)}
        </g> : <g stroke={INK} strokeWidth={chibi ? 2.5 : 3.5}>
          {Array.from({length: chibi ? 4 : 6}, (_, k) => { const y = waY - (chibi ? 4 : 6) * 0 + (k - (chibi ? 4 : 6)) * (chibi ? 18 : 26) + (chibi ? 18 : 26); return <rect key={k} x={-200} y={y} width="400" height={chibi ? 18 : 26} fill={k % 2 ? '#A9AEB2' : '#B9BEC2'} />; })}
          {[-1, 1].map((d) => <path key={d} d={`M${d * 26},${shY - 34} Q${d * 70},${shY - 30} ${d * (B.sh[0] + 6)},${shY + 8} L${d * (B.sh[0] - 8)},${shY + 40} Q${d * 60},${shY + 10} ${d * 26},${shY + 6}Z`} fill="#B9BEC2" />)}
          <rect x={-200} y={shY - 6} width="400" height={chibi ? 14 : 30} fill="#A9AEB2" />
          {[-1, 1].map((d) => <circle key={'r' + d} cx={d * 30} cy={shY + 30} r="5" fill="#D9B45A" stroke="none" />)}
        </g>)}
      {kind === 'armor' && <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
        <path d={`M${-B.sh[0] * 0.72},${shY - 14} Q0,${shY - 30} ${B.sh[0] * 0.72},${shY - 14} L${B.waist[0] * 0.8},${shY + (waY - shY) * 0.7} Q0,${shY + (waY - shY) * 0.86} ${-B.waist[0] * 0.8},${shY + (waY - shY) * 0.7}Z`} fill={tint(top, 0.12)} />
        <path d={`M0,${shY - 24} L0,${shY + (waY - shY) * 0.84}`} fill="none" />
        {[0, 1, 2].map((k2) => <rect key={k2} x={-B.waist[0] * 0.7} y={waY - 16 + k2 * 30} width={B.waist[0] * 1.4} height="24" rx="6" fill={shade(top, 0.9)} />)}
        {[-1, 1].map((d) => <rect key={d} x={d * B.hip[0] * 0.6 - 16} y={hipY - 40} width="32" height="30" rx="5" fill="#5A4A36" />)}
      </g>}
      {kind === 'hivis' && [0.42, 0.68].map((q, i2) => <rect key={i2} x={-200} y={shY + (hipY - shY) * q} width="400" height={chibi ? 12 : 18} fill="#E6E6DE" stroke={INK} strokeWidth="2.5" />)}
      {kind === 'hivis' && !chibi && [-1, 1].map((d) => <path key={d} d={`M${d * 30},${shY - 34} L${d * 44},${shY + (hipY - shY) * 0.42}`} stroke="#E6E6DE" strokeWidth="16" />)}
      {kind === 'jacket' && <><path d={`M0,${shY - 30} L0,${hipY + 10}`} stroke={INK} strokeWidth="3.5" /><path d={`M-26,${shY - 36} L-6,${shY + 30} L-30,${shY + 10}Z M26,${shY - 36} L6,${shY + 30} L30,${shY + 10}Z`} fill={shade(top, 0.85)} stroke={INK} strokeWidth="3" /></>}
      {kind === 'overalls' && <path d={`M${-B.hip[0] + 4},${hipY + 12} L${-B.waist[0] + 12},${shY + (hipY - shY) * 0.32} L${B.waist[0] - 12},${shY + (hipY - shY) * 0.32} L${B.hip[0] - 4},${hipY + 12}Z`} fill={bottom} stroke={INK} strokeWidth="3.5" />}
      {(kind === 'tee' || kind === 'overalls') && !chibi && <path d={`M-26,${shY - 36} Q0,${shY - 6} 26,${shY - 36}`} fill={skin} stroke={INK} strokeWidth="3.5" />}
      <path d={torsoShade} fill="rgba(60,25,10,0.22)" style={{mixBlendMode: 'multiply'}} />
      {!chibi && <rect x={-B.hip[0] - 10} y={hipY - 14} width={B.hip[0] * 2 + 20} height="18" fill={shade(bottom, 0.6)} stroke={INK} strokeWidth="3" />}
      {c.badge && <rect x={B.sh[0] * 0.2} y={shY + (hipY - shY) * 0.2} width={chibi ? 20 : 26} height={chibi ? 26 : 34} rx="4" fill="#fff" stroke={INK} strokeWidth="3" />}
    </g>}
    {(kind === 'legion' || kind === 'tunic') && (() => { const hem = hipY + (chibi ? 34 : 86); return (<g>
      <path d={`M${-B.waist[0] - 2},${waY} L${-B.hip[0] - (chibi ? 10 : 22)},${hem} Q0,${hem + 10} ${B.hip[0] + (chibi ? 10 : 22)},${hem} L${B.waist[0] + 2},${waY}Z`} fill={F(top)} stroke={INK} strokeWidth={CLW} strokeLinejoin="round" />
      {!sil && <path d={`M${B.waist[0] * 0.3},${waY} L${B.hip[0] * 0.4},${hem + 4} L${B.hip[0] + (chibi ? 9 : 20)},${hem} L${B.waist[0]},${waY}Z`} fill="rgba(60,25,10,0.18)" />}
      {!sil && <rect x={-B.waist[0] - 4} y={hipY - (chibi ? 30 : 40)} width={B.waist[0] * 2 + 8} height={chibi ? 10 : 16} rx="3" fill={kind === 'legion' ? '#6B4A30' : shade(top, 0.7)} stroke={INK} strokeWidth="3" />}
      {!sil && kind === 'legion' && !chibi && [-14, -4, 6, 16].map((x) => <g key={x}><rect x={x - 3} y={hipY - 24} width="7" height="74" fill="#6B4A30" stroke={INK} strokeWidth="2" /><circle cx={x + 0.5} cy={hipY + 52} r="4" fill="#D9B45A" /></g>)}
    </g>); })()}
    {coatLen > 0 && <g><path d={`M${-B.waist[0]},${waY} L${-B.hip[0] - (kind === 'dress' ? 40 : 18)},${hipY + coatLen} Q0,${hipY + coatLen + 12} ${B.hip[0] + (kind === 'dress' ? 40 : 18)},${hipY + coatLen} L${B.waist[0]},${waY}Z`} fill={F(top)} stroke={INK} strokeWidth={CLW} strokeLinejoin="round" />
      {!sil && <path d={`M${B.waist[0] * 0.3},${waY} L${B.hip[0] * 0.5},${hipY + coatLen + 4} L${B.hip[0] + (kind === 'dress' ? 38 : 16)},${hipY + coatLen} L${B.waist[0]},${waY}Z`} fill="rgba(60,25,10,0.18)" />}
      {!sil && kind === 'dress' && <path d={`M${-B.waist[0] - 2},${waY + 6} Q0,${waY + 18} ${B.waist[0] + 2},${waY + 6}`} fill="none" stroke="#D9B45A" strokeWidth="6" />}</g>}
  </g>);

  // ---- head
  const round = chibi || c.head === 'round';
  const rr = chibi ? r : 90, ry = chibi ? hy : hy - 18;   // round head on an adult body: smaller, sits on the neck
  const neck = !chibi && (<g>
    <rect x={hx - 21} y={hy + 30} width="42" height={shY - hy - 22} fill={F(skin)} stroke={INK} strokeWidth={CLW} />
    {!sil && <path d={`M${hx - 18},${hy + 40} L${hx + 18},${hy + 40} L${hx + 18},${hy + 66} Q${hx},${hy + 56} ${hx - 18},${hy + 66}Z`} fill={shade(skin, 0.74)} />}
  </g>);
  // hair that falls behind the body (drawn before the torso)
  const back = c.hair === 'long' && !sil && (round
    ? <path d={`M${hx - rr * 1.05},${ry - rr * 0.1} L${hx - rr * 1.1},${ry + rr * 1.5} Q${hx},${ry + rr * 1.7} ${hx + rr * 1.1},${ry + rr * 1.5} L${hx + rr * 1.05},${ry - rr * 0.1}Z`} fill={hc} stroke={INK} strokeWidth={CLW} />
    : <path d={`M${hx - 58},${hy - 20} L${hx - 66},${hy + 150} Q${hx},${hy + 170} ${hx + 66},${hy + 150} L${hx + 58},${hy - 20}Z`} fill={hc} stroke={INK} strokeWidth={CLW * 0.8} />);
  const head = round ? ((r, hy) => (<g>
    <defs><clipPath id={`h${uid}`}><circle cx={hx} cy={hy} r={r} /></clipPath></defs>
    {[-1, 1].map((d) => <g key={d}><circle cx={hx + d * r * 0.97} cy={hy + r * 0.1} r={r * 0.19} fill={F(skin)} stroke={INK} strokeWidth={CLW} />
      {!sil && <circle cx={hx + d * r * 0.99} cy={hy + r * 0.1} r={r * 0.08} fill={shade(skin, 0.8)} />}</g>)}
    <circle cx={hx} cy={hy} r={r} fill={F(sil ? skin : shade(skin, 0.86))} stroke={INK} strokeWidth={CLW} />
    {!sil && <g clipPath={`url(#h${uid})`}><circle cx={hx - r * 0.14} cy={hy - r * 0.16} r={r * 0.94} fill={skin} /></g>}
    {!sil && (<g transform={`translate(${hx},${hy})`}>
      {[-1, 1].map((d) => <ellipse key={d} cx={d * r * 0.56} cy={r * 0.33} rx={r * 0.15} ry={r * 0.095} fill="#F07F78" opacity="0.42" />)}
      <g transform={`translate(0,${r * 0.08})`}><ChibiEyes kind={eyes} look={look} r={r} /></g>
      {[-1, 1].map((d) => <path key={d} d={`M${d * r * 0.22},${-r * 0.15} L${d * r * 0.46},${-r * 0.15}`} transform={`translate(0,${E.brow[1] * 0.8}) rotate(${-d * E.brow[0] * 0.9},${d * r * 0.34},${-r * 0.15})`} stroke={INK} strokeWidth="8" strokeLinecap="round" />)}
      <path d={`M${-r * 0.04},${r * 0.24} Q0,${r * 0.29} ${r * 0.04},${r * 0.24}`} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <g transform={`translate(0,${r * 0.43})`}><Mouth kind={mouth} chibi skin={skin} /></g>
      <ChibiHair kind={c.hair || 'short'} color={hc} r={r} />
    </g>)}
    <g transform={`translate(${hx},${hy}) scale(${B.k * r / B.hr[0] * (chibi ? 1 : 0.62)})`}>{c.hat && <HatShape kind={c.hat} color={F(c.hatColor || '#F2C230')} />}</g>
  </g>))(rr, ry) : (<g>
    <defs><clipPath id={`h${uid}`}><path d={FACE} transform={`translate(${hx},${hy})`} /></clipPath></defs>
    {[-1, 1].map((d) => <ellipse key={d} cx={hx + d * 49} cy={hy + 2} rx="10" ry="16" fill={F(skin)} stroke={INK} strokeWidth={CLW * 0.8} />)}
    <path d={FACE} transform={`translate(${hx},${hy})`} fill={F(skin)} stroke={INK} strokeWidth={CLW} strokeLinejoin="round" />
    {!sil && (<g>
      <g clipPath={`url(#h${uid})`} transform={`translate(${hx},${hy})`}>
        {/* cel shadow on the far side, eye sockets, cheekbone */}
        <path d="M18,-80 Q36,-24 24,8 Q14,40 4,80 L90,80 L90,-80Z" fill={shade(skin, 0.8)} />
        {[-20, 20].map((x) => <ellipse key={x} cx={x} cy={-10} rx="17" ry="8" fill={shade(skin, 0.86)} />)}
        {c.beard && <path d="M-60,6 Q-50,64 0,70 Q50,64 60,6 Q46,26 30,30 Q16,24 0,28 Q-16,24 -30,30 Q-46,26 -60,6Z M-20,26 Q0,20 20,26 L18,31 Q0,27 -18,31Z"
          fill={hc} opacity={c.beard === 'full' ? 0.95 : 0.4} />}
        <path d="M-40,60 Q0,76 40,60 L40,90 L-40,90Z" fill={shade(skin, 0.75)} opacity="0.5" />
      </g>
      <g transform={`translate(${hx},${hy})`}>
        <AdultEyes kind={eyes} look={look} eyeColor={c.eyeColor} skin={skin} />
        {/* thick tapered brows */}
        {[-1, 1].map((d) => <path key={d} d={c.soft ? `M${d * 8},-22 Q${d * 20},-29 ${d * 35},-23 L${d * 34},-20 Q${d * 20},-25 ${d * 8},-19Z` : `M${d * 6},-20 Q${d * 20},-27 ${d * 36},-22 L${d * 34},-17 Q${d * 20},-21 ${d * 7},-14Z`}
          transform={`translate(0,${E.brow[1] * 0.6}) rotate(${-d * E.brow[0] * 0.7},${d * 20},-20)`} fill={c.hair === 'bald' || !c.hair ? INK : shade(hc, 0.8)} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />)}
        {c.soft && [-1, 1].map((d) => <path key={'lash' + d} d={`M${d * 31},-4 l${d * 6},-5`} stroke={INK} strokeWidth="3" strokeLinecap="round" />)}
        {/* nose: shaded side + line + nostril */}
        <path d="M4,-6 Q10,10 13,19 Q6,24 1,22Z" fill={shade(skin, 0.74)} />
        <path d="M-1,-6 Q-5,10 -9,18 Q-4,24 3,22" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {!c.soft && <path d="M-14,28 Q-20,34 -19,44 M14,28 Q20,34 19,44" fill="none" stroke={shade(skin, 0.72)} strokeWidth="2.2" strokeLinecap="round" />}
        <g transform="translate(0,38)"><Mouth kind={mouth} skin={skin} /></g>
        {c.beard === 'full' && <path d="M-58,4 Q-50,70 0,76 Q50,70 58,4 Q44,30 0,30 Q-44,30 -58,4Z" fill={hc} stroke={INK} strokeWidth="4" opacity="0.9" />}
        <AdultHair kind={c.hair || 'short'} color={hc} />
      </g>
    </g>)}
    <g transform={`translate(${hx},${hy + 8}) scale(${B.k})`}>{c.hat && <HatShape kind={c.hat} color={F(c.hatColor || '#F2C230')} />}</g>
  </g>);

  return (<g transform={`translate(0,${bob})`}>
    <ellipse cx="0" cy="6" rx={chibi ? 76 : 96} ry="13" fill="rgba(20,10,5,0.28)" />
    {back}
    {legs}
    {neck}
    {body}
    {P.box && <rect x={-B.sh[0] * 0.9} y={shY + (hipY - shY) * 0.35} width={B.sh[0] * 1.8} height={B.sh[0] * 1.3} rx="4" fill={F('#C8955A')} stroke={INK} strokeWidth={CLW} />}
    <g transform={`rotate(${tilt},${hx},${hy + B.hr[1] * 0.8})`}>
      {head}
      {holoOn && (holo.kind === 'hat' || ['hardhat', 'cap', 'beanie', 'mask', 'headlamp', 'helmet', 'galea', 'crest'].includes(holo.shape)) && (
        <g transform={`translate(${hx},${hy + (chibi ? 0 : 8)}) scale(${B.k})`}>
          <g opacity={(1 - holoBreak) * mix(0, 1, Math.min(1, (f - holoFrom) / 3)) * (0.85 + 0.15 * Math.sin(f / 3))} transform={`translate(${holoBreak * 20},${-holoBreak * 30}) scale(${1 + holoBreak * 0.2})`}>
            <HatShape kind={holo.shape} holo />
          </g></g>)}
    </g>
    {arms}
    {c.shield && !P.box && (() => { const w = chibi ? 120 : 150, h = chibi ? 170 : 270, x = -B.sh[0] - (chibi ? 30 : 40), y = (shY + hipY) / 2 + (chibi ? 30 : 40);
      return (<g transform={`translate(${x},${y})`}>
        <path d={`M${-w / 2},${-h / 2} Q0,${-h / 2 - 14} ${w / 2},${-h / 2} L${w / 2},${h / 2} Q0,${h / 2 + 14} ${-w / 2},${h / 2}Z`} fill={F(c.shieldColor || '#A8322A')} stroke={INK} strokeWidth={CLW} strokeLinejoin="round" />
        {!sil && <><path d={`M${w * 0.12},${-h / 2 - 4} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${w * 0.12},${h / 2 + 4}Z`} fill="rgba(0,0,0,0.18)" />
          <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w - 20} height={h - 24} rx="6" fill="none" stroke="#E2B65A" strokeWidth="5" />
          <path d={`M0,${-h * 0.36} L0,${h * 0.36} M${-w * 0.34},0 L${w * 0.34},0`} stroke="#E2B65A" strokeWidth="5" />
          {[-1, 1].map((d) => <path key={d} d={`M${d * 14},-8 Q${d * w * 0.3},${-h * 0.22} ${d * w * 0.36},${-h * 0.08} M${d * 14},8 Q${d * w * 0.3},${h * 0.22} ${d * w * 0.36},${h * 0.08}`} stroke="#E2B65A" strokeWidth="4" fill="none" />)}
          <circle r={chibi ? 18 : 24} fill="#C9CED2" stroke={INK} strokeWidth="4" /><circle r={chibi ? 7 : 9} fill="#E8EDF0" /></>}
      </g>); })()}
    {holoOn && ['vest', 'tool', 'wrench', 'lantern'].includes(holo.shape) && (
      <g opacity={(1 - holoBreak) * Math.min(1, (f - holoFrom) / 3)}>
        {holo.shape === 'vest' ? <path d={torso} {...HOLO} />
          : <g transform={`translate(${B.sh[0] * 1.6},${(shY + hipY) / 2}) scale(${chibi ? 1.6 : 1.3})`}><ToolShape kind={holo.shape === 'tool' ? 'wrench' : holo.shape} x={0} y={0} holo /></g>}
      </g>)}
    {rim && !sil && c.hat !== 'helmet' && <g transform={`rotate(${tilt},${hx},${hy + B.hr[1] * 0.8})`}><defs><clipPath id={`r${uid}`}><rect x={hx + (round ? rr : 50) * 0.35} y={hy - 200} width="300" height={-shY + hy + 900} /></clipPath></defs>
      <g clipPath={`url(#r${uid})`} opacity="0.9">
        {round ? <circle cx={hx} cy={round && !chibi ? ry : hy} r={rr - 2} fill="none" stroke={rim} strokeWidth="5" />
          : <path d={FACE} transform={`translate(${hx - 2},${hy})`} fill="none" stroke={rim} strokeWidth="5" />}
      </g></g>}
    {emote && <g transform={`translate(${hx},${hy})`}><Emote kind={emote} t={f - emoteFrom} chibi={chibi} /></g>}
  </g>);
};
// adult face: cheekbones, narrowing jaw, squared chin
const FACE = 'M0,-66 C36,-66 52,-46 51,-10 C50,18 45,38 30,54 Q15,66 0,66 Q-15,66 -30,54 C-45,38 -50,18 -51,-10 C-52,-46 -36,-66 0,-66Z';

export const ToolShape = ({kind, x, y, holo}) => {
  const st = holo ? HOLO : {fill: '#9AA3AD', stroke: INK, strokeWidth: 4};
  if (kind === 'gladius') return (<g transform={`translate(${x},${y}) rotate(-20)`} {...st}><path d="M-7,-10 L-7,-120 L0,-138 L7,-120 L7,-10Z" fill={holo ? HOLO.fill : '#D8DDE0'} /><rect x="-20" y="-12" width="40" height="10" rx="4" fill={holo ? HOLO.fill : '#8A6A40'} /><rect x="-6" y="-2" width="12" height="26" fill={holo ? HOLO.fill : '#6B4A30'} /><circle cy="28" r="8" fill={holo ? HOLO.fill : '#C9A04A'} /></g>);
  if (kind === 'pilum') return (<g transform={`translate(${x},${y}) rotate(-8)`} {...st}><path d="M0,-300 L0,110" strokeWidth="9" stroke={holo ? HOLO.stroke : '#8B5A2B'} fill="none" /><path d="M0,-300 L0,-420" strokeWidth="5" stroke={holo ? HOLO.stroke : '#7A8288'} fill="none" /><path d="M-8,-420 L0,-446 L8,-420Z" fill={holo ? HOLO.fill : '#C9CED2'} /></g>);
  if (kind === 'shovel') return (<g transform={`translate(${x},${y}) rotate(-12)`} {...st}><path d="M0,-150 L0,70" strokeWidth="9" stroke={holo ? HOLO.stroke : '#8B5A2B'} fill="none" /><path d="M-24,70 L24,70 L20,130 Q0,146 -20,130Z" fill={holo ? HOLO.fill : '#8E9294'} /></g>);
  if (kind === 'vine') return (<g transform={`translate(${x},${y}) rotate(-25)`}><path d="M0,-150 Q6,-80 -2,0 Q-6,40 2,70" stroke={INK} strokeWidth="14" fill="none" strokeLinecap="round" /><path d="M0,-150 Q6,-80 -2,0 Q-6,40 2,70" stroke="#7A5232" strokeWidth="8" fill="none" strokeLinecap="round" /></g>);
  if (kind === 'lantern') return (<g transform={`translate(${x},${y})`} {...st}><path d="M-14,0 L14,0" fill="none" /><rect x="-18" y="8" width="36" height="46" rx="6" fill={holo ? HOLO.fill : '#FFD36B'} /><rect x="-22" y="52" width="44" height="10" rx="3" /></g>);
  if (kind === 'broom') return (<g transform={`translate(${x},${y})`} {...st}><path d="M0,-120 L0,40" strokeWidth="9" stroke={holo ? HOLO.stroke : '#8B5A2B'} fill="none" /><path d="M-26,40 L26,40 L34,96 L-34,96 Z" fill={holo ? HOLO.fill : '#D9B56B'} /></g>);
  if (kind === 'clipboard') return (<g transform={`translate(${x},${y - 30})`} {...st}><rect x="-26" y="-10" width="52" height="68" rx="4" fill={holo ? HOLO.fill : '#C8955A'} /><rect x="-18" y="0" width="36" height="48" fill={holo ? 'none' : '#fff'} /></g>);
  return (<g transform={`translate(${x},${y}) rotate(-30)`} {...st}><path d="M-6,0 L-6,-80 Q-22,-86 -20,-104 L-10,-96 L0,-104 L10,-96 L20,-104 Q22,-86 6,-80 L6,0 Z" /></g>); // wrench
};
