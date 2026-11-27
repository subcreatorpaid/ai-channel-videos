// Code-drawn cast for the lore style (rules §3). Two designs per character: chibi (childhood) and adult (caricature).
// Cut-out puppet rig, smooth at 30 fps: limbs are two-segment capsules with a dark outline, faces swap expressions in one
// frame, emote icons sell the emotion. A character is defined once in spec.cast and reused in every shot, so it stays consistent.
// The rig is drawn at the origin = between the feet on the ground, in 1080p pixels.  (Swap point for a hand-made SVG cast later:
// replace <Person> with an <Img> rig that reads the same props.)
import React from 'react';
import {INK, LW, hash, mix, pop, inOut} from './kit';

const SKIN_SHADE = 'rgba(80,30,10,0.16)';
const rad = (a) => (a * Math.PI) / 180;
// angle 0 = straight down, positive = towards screen right
const end = (x, y, a, L) => [x + Math.sin(rad(a)) * L, y + Math.cos(rad(a)) * L];

const Capsule = ({pts, w, color, silhouette}) => {
  const d = 'M' + pts.map((p) => p.join(',')).join(' L');
  return (<g>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + LW * 2} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={silhouette ? INK : color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>);
};

// ---------------------------------------------------------------- body proportions
const BODY = {
  adult: {head: [0, -628], hr: [62, 76], sh: [78, -522], hip: [56, -300], ua: 125, la: 115, th: 150, sn: 150, aw: 34, lw: 46, neck: 30, k: 1},
  chibi: {head: [0, -292], hr: [118, 110], sh: [46, -178], hip: [34, -78], ua: 56, la: 50, th: 40, sn: 38, aw: 28, lw: 32, neck: 0, k: 1.8},
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

// ---------------------------------------------------------------- head-local shapes (unit = adult head, origin = head centre)
export const HatShape = ({kind, color, holo}) => {
  const st = holo ? HOLO : {fill: color, stroke: INK, strokeWidth: LW};
  if (kind === 'hardhat') return (<g {...st}><path d="M-72,-30 Q-70,-108 0,-112 Q70,-108 72,-30 Z" /><rect x="-88" y="-38" width="176" height="16" rx="8" />
    <path d="M0,-112 L0,-36" fill="none" /></g>);
  if (kind === 'cap') return (<g {...st}><path d="M-66,-34 Q-62,-100 0,-104 Q62,-100 66,-34 Z" /><path d="M8,-42 Q74,-54 106,-30 L60,-30 Z" /></g>);
  if (kind === 'beanie') return (<g {...st}><path d="M-68,-22 Q-68,-114 0,-116 Q68,-114 68,-22 Z" /><rect x="-70" y="-42" width="140" height="24" rx="8" /><circle cx="0" cy="-118" r="14" /></g>);
  if (kind === 'mask') return (<g {...st}><path d="M-58,-30 Q-60,60 0,74 Q60,60 58,-30 Q30,-44 0,-44 Q-30,-44 -58,-30 Z" /><ellipse cx="-24" cy="-6" rx="13" ry="9" fill={holo ? 'none' : '#1a1a1a'} /><ellipse cx="24" cy="-6" rx="13" ry="9" fill={holo ? 'none' : '#1a1a1a'} /></g>);
  if (kind === 'headlamp') return (<g {...st}><path d="M-66,-36 Q0,-56 66,-36" fill="none" strokeWidth={holo ? 4 : 10} stroke={holo ? HOLO.stroke : '#333'} /><rect x="-18" y="-62" width="36" height="26" rx="6" /><circle cx="0" cy="-49" r="7" fill="#FFF3B0" /></g>);
  return null;
};
const HOLO = {fill: 'rgba(120,190,255,0.22)', stroke: '#A8DAFF', strokeWidth: 4, strokeDasharray: '10 7'};

const Hair = ({kind, color}) => {
  const st = {fill: color, stroke: INK, strokeWidth: LW, strokeLinejoin: 'round'};
  if (kind === 'bald' || !kind) return null;
  if (kind === 'buzz') return <path d="M-64,-14 Q-68,-92 0,-96 Q68,-92 64,-14 Q56,-58 0,-62 Q-56,-58 -64,-14 Z" {...st} opacity="0.9" />;
  if (kind === 'long') return <path d="M-70,90 Q-80,-96 0,-100 Q80,-96 70,90 L52,90 Q58,-30 40,-50 Q0,-70 -40,-50 Q-58,-30 -52,90 Z" {...st} />;
  if (kind === 'bun') return (<g><circle cx="0" cy="-104" r="30" {...st} /><path d="M-66,-6 Q-70,-96 0,-100 Q70,-96 66,-6 Q58,-56 0,-62 Q-58,-56 -66,-6 Z" {...st} /></g>);
  if (kind === 'curly') return <path d={'M-68,-8 ' + Array.from({length: 9}, (_, i) => { const a = Math.PI * (1 - i / 8); return `Q${Math.cos(a + 0.17) * 92},${-Math.sin(a + 0.17) * 104} ${Math.cos(a) * 70},${-Math.sin(a) * 92 - 4}`; }).join(' ') + ' Q30,-60 0,-60 Q-30,-60 -68,-8 Z'} {...st} />;
  if (kind === 'fringe') return <path d="M-68,-4 Q-72,-100 0,-102 Q72,-100 68,-4 Q64,-40 40,-40 Q20,-24 -6,-40 Q-30,-28 -50,-40 Q-64,-36 -68,-4 Z" {...st} />;
  return <path d="M-66,-10 Q-70,-98 0,-100 Q70,-98 66,-10 Q60,-62 0,-64 Q-60,-62 -66,-10 Z" {...st} />; // short
};

const Eyes = ({kind, look = [0, 0], chibi, eyeColor}) => {
  const lx = look[0] * 5, ly = look[1] * 4;
  const E = (x) => {
    if (kind === 'happy') return <path d={`M${x - 14},4 Q${x},-12 ${x + 14},4`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />;
    if (kind === 'closed') return <path d={`M${x - 13},0 Q${x},8 ${x + 13},0`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />;
    if (chibi) { const ry = kind === 'wide' ? 22 : kind === 'squint' ? 9 : kind === 'half' ? 10 : 18;
      return (<g><ellipse cx={x + lx} cy={ly} rx={kind === 'wide' ? 15 : 13} ry={ry} fill={INK} />
        {kind !== 'squint' && <circle cx={x + lx + 4} cy={ly - ry * 0.4} r="4.5" fill="#fff" />}
        {kind === 'sad' && <path d={`M${x - 14},${-14} L${x + 14},${-20}`} stroke={INK} strokeWidth="4" />}
      </g>); }
    const ry = kind === 'wide' ? 11 : kind === 'squint' ? 4.5 : kind === 'half' ? 5 : 8;
    return (<g><ellipse cx={x} cy={0} rx="12" ry={ry} fill="#fff" stroke={INK} strokeWidth="2.5" />
      <circle cx={x + lx} cy={ly} r={Math.min(5.5, ry)} fill={eyeColor || '#3A2A20'} />
      {kind === 'half' && <path d={`M${x - 13},-2 L${x + 13},-2`} stroke={INK} strokeWidth="4" />}</g>);
  };
  return <g>{E(-24)}{E(24)}</g>;
};

const Mouth = ({kind, chibi}) => {
  const w = chibi ? 15 : 17, s = {fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round'};
  if (kind === 'smile') return <path d={`M${-w},0 Q0,${w * 0.9} ${w},0`} {...s} />;
  if (kind === 'frown') return <path d={`M${-w},6 Q0,${-w * 0.7} ${w},6`} {...s} />;
  if (kind === 'o') return <ellipse cx="0" cy="2" rx={w * 0.45} ry={w * 0.6} fill="#5A2018" stroke={INK} strokeWidth="4" />;
  if (kind === 'open') return <path d={`M${-w},-2 Q0,${w * 1.4} ${w},-2 Z`} fill="#5A2018" stroke={INK} strokeWidth="4" strokeLinejoin="round" />;
  if (kind === 'talk') return <ellipse cx="0" cy="2" rx={w * 0.6} ry={w * 0.35} fill="#5A2018" stroke={INK} strokeWidth="4" />;
  if (kind === 'teeth') return (<g><rect x={-w} y="-6" width={w * 2} height="14" rx="5" fill="#fff" stroke={INK} strokeWidth="4" /><path d={`M${-w},1 L${w},1`} stroke={INK} strokeWidth="2" /></g>);
  if (kind === 'smirk') return <path d={`M${-w * 0.8},2 Q${w * 0.3},6 ${w},-6`} {...s} />;
  if (kind === 'wobble') return <path d={`M${-w},2 q${w / 2},-6 ${w},0 q${w / 2},6 ${w},0`} {...s} />;
  return <path d={`M${-w * 0.8},2 L${w * 0.8},2`} {...s} />;
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
// c = cast entry: {skin, hair, hairColor, eyeColor, top, topKind: 'tee'|'jacket'|'hivis'|'overalls'|'coat', bottom, shoes, hat, hatColor, beard: 'stubble'|'full'}
export const Person = ({c = {}, age = 'adult', pose = 'stand', face = 'neutral', look, f, seed = 1, talk, holo, holoFrom = 0, holoUntil,
  emote, emoteFrom = 0, silhouette, rim}) => {
  const B = BODY[age] || BODY.adult, P = POSES[pose] || POSES.stand, E = EXPR[face] || EXPR.neutral, chibi = age === 'chibi';
  const skin = c.skin || '#E9B48F', top = c.top || '#4A6FA5', bottom = c.bottom || '#3A3F4B', shoes = c.shoes || '#2A1E17', hc = c.hairColor || '#3B2A20';
  const fill = (x) => (silhouette ? '#120C09' : x);
  const bob = Math.sin((f + seed * 37) / 18) * 2.2;
  const drop = P.kneel ? (chibi ? 40 : 150) : (P.drop || 0);
  // walk cycle (rules: cut-out, smooth at 30 fps)
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
  const [hx, hy0] = B.head, hy = hy0 + drop, k = B.k;
  const shY = B.sh[1] + drop, hipY = B.hip[1] + drop;
  const legs = [[-B.hip[0] * 0.55, ll], [B.hip[0] * 0.55, rl]];
  const legLen = P.kneel ? [B.th, 0] : [B.th, B.sn];
  const tilt = (E.tilt || 0) + (P.tilt || 0);
  const holoOn = holo && f >= holoFrom && (holoUntil == null || f < holoUntil + 8);
  const holoBreak = holo && holoUntil != null && f >= holoUntil ? (f - holoUntil) / 8 : 0;
  return (<g transform={`translate(0,${bob})`}>
    <ellipse cx="0" cy="4" rx={chibi ? 70 : 80} ry="12" fill="rgba(0,0,0,0.25)" />
    {/* legs */}
    {legs.map(([x, [a1, a2]], i) => { const h = [x, hipY]; const kn = end(h[0], h[1], a1, legLen[0]); const ft = legLen[1] ? end(kn[0], kn[1], a1 + a2 * (i ? -1 : 1), legLen[1]) : kn;
      return (<g key={i}><Capsule pts={[h, kn, ft]} w={B.lw} color={fill(bottom)} silhouette={silhouette} />
        {!P.kneel && <ellipse cx={ft[0] + (i ? 8 : -8)} cy={ft[1] - 4} rx={B.lw * 0.75} ry={B.lw * 0.38} fill={fill(shoes)} stroke={INK} strokeWidth={LW} />}</g>); })}
    {/* torso */}
    <g>
      <path d={`M${-B.sh[0]},${shY - 6} Q${-B.sh[0] - 4},${shY + 10} ${-B.hip[0] - 4},${hipY + 14} L${B.hip[0] + 4},${hipY + 14} Q${B.sh[0] + 4},${shY + 10} ${B.sh[0]},${shY - 6} Q0,${shY - 22} ${-B.sh[0]},${shY - 6} Z`}
        fill={fill(c.topKind === 'hivis' ? '#F28C28' : top)} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
      {!silhouette && c.topKind === 'hivis' && [0.45, 0.72].map((r, i) => <rect key={i} x={-B.sh[0] + 6} y={shY + (hipY - shY) * r} width={B.sh[0] * 2 - 12} height={chibi ? 10 : 16} fill="#E8E8E0" stroke={INK} strokeWidth="2" />)}
      {!silhouette && c.topKind === 'jacket' && <path d={`M0,${shY - 10} L0,${hipY + 12}`} stroke={INK} strokeWidth="3" />}
      {!silhouette && c.topKind === 'overalls' && <path d={`M${-B.hip[0] + 4},${hipY + 12} L${-B.hip[0] + 8},${shY + (hipY - shY) * 0.35} L${B.hip[0] - 8},${shY + (hipY - shY) * 0.35} L${B.hip[0] - 4},${hipY + 12} Z`} fill={bottom} stroke={INK} strokeWidth="3" />}
      {!silhouette && c.badge && <rect x={B.sh[0] * 0.25} y={shY + (hipY - shY) * 0.25} width={chibi ? 20 : 28} height={chibi ? 26 : 36} rx="4" fill="#fff" stroke={INK} strokeWidth="3" />}
      {!silhouette && <path d={`M${B.sh[0] * 0.2},${shY} Q${B.sh[0] * 0.9},${(shY + hipY) / 2} ${B.hip[0]},${hipY + 10}`} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={B.sh[0] * 0.5} />}
    </g>
    {/* box for carry pose */}
    {P.box && <rect x={-B.sh[0] * 0.9} y={shY + (hipY - shY) * 0.35} width={B.sh[0] * 1.8} height={B.sh[0] * 1.3} rx="4" fill={fill('#C8955A')} stroke={INK} strokeWidth={LW} />}
    {/* arms */}
    {[[-B.sh[0], la, -1], [B.sh[0], ra, 1]].map(([x, [a1, a2], s], i) => { const sh = [x, shY + 8]; const el = end(sh[0], sh[1], a1, B.ua); const hd = end(el[0], el[1], a2, B.la);
      return (<g key={i}><Capsule pts={[sh, el, hd]} w={B.aw} color={fill(c.topKind === 'hivis' ? '#F28C28' : top)} silhouette={silhouette} />
        <circle cx={hd[0]} cy={hd[1]} r={B.aw * 0.55} fill={fill(skin)} stroke={INK} strokeWidth={LW} />
        {i === 1 && c.tool && !silhouette && <ToolShape kind={c.tool} x={hd[0]} y={hd[1]} />}</g>); })}
    {/* neck + head */}
    <g transform={`rotate(${tilt},${hx},${hy + B.hr[1] * 0.8})`}>
      {B.neck > 0 && <rect x="-18" y={hy + B.hr[1] - 14} width="36" height={B.neck + 14} fill={fill(skin)} stroke={INK} strokeWidth={LW} />}
      {!chibi && <><ellipse cx={-B.hr[0]} cy={hy + 4} rx="12" ry="17" fill={fill(skin)} stroke={INK} strokeWidth={LW} /><ellipse cx={B.hr[0]} cy={hy + 4} rx="12" ry="17" fill={fill(skin)} stroke={INK} strokeWidth={LW} /></>}
      {chibi && <><ellipse cx={-B.hr[0] + 4} cy={hy + 14} rx="18" ry="22" fill={fill(skin)} stroke={INK} strokeWidth={LW} /><ellipse cx={B.hr[0] - 4} cy={hy + 14} rx="18" ry="22" fill={fill(skin)} stroke={INK} strokeWidth={LW} /></>}
      {c.hair === 'long' && !silhouette && <g transform={`translate(${hx},${hy}) scale(${k})`}><path d="M-70,90 L-52,90 L-52,0 L52,0 L52,90 L70,90 L70,0 L-70,0Z" fill={hc} stroke={INK} strokeWidth={LW / k} /></g>}
      <ellipse cx={hx} cy={hy} rx={B.hr[0]} ry={B.hr[1]} fill={fill(skin)} stroke={INK} strokeWidth={LW} />
      {!silhouette && chibi && <path d={`M${hx + B.hr[0] * 0.55},${hy - B.hr[1] * 0.75} Q${hx + B.hr[0] * 1.02},${hy} ${hx + B.hr[0] * 0.5},${hy + B.hr[1] * 0.85} Q${hx + B.hr[0] * 0.85},${hy} ${hx + B.hr[0] * 0.55},${hy - B.hr[1] * 0.75}Z`} fill="rgba(80,30,10,0.10)" />}
      {!silhouette && !chibi && <path d={`M${hx + B.hr[0] * 0.25},${hy - B.hr[1] * 0.95} Q${hx + B.hr[0] * 1.05},${hy} ${hx + B.hr[0] * 0.2},${hy + B.hr[1] * 0.97} Q${hx + B.hr[0] * 0.8},${hy} ${hx + B.hr[0] * 0.25},${hy - B.hr[1] * 0.95}Z`} fill={SKIN_SHADE} />}
      {!silhouette && (<g transform={`translate(${hx},${hy + (chibi ? 18 : 0)}) scale(${chibi ? 1.25 : 1})`}>
        {c.beard && !chibi && <path d="M-56,0 Q-50,72 0,80 Q50,72 56,0 Q32,40 0,44 Q-32,40 -56,0Z" fill={hc} opacity={c.beard === 'full' ? 1 : 0.32} stroke={c.beard === 'full' ? INK : 'none'} strokeWidth={LW} />}
        <g transform="translate(0,-8)"><Eyes kind={eyes} look={look} chibi={chibi} eyeColor={c.eyeColor} /></g>
        {[-1, 1].map((d) => <path key={d} d={`M${d * 10},-26 L${d * 38},-26`} transform={`translate(0,${E.brow[1] - (chibi ? 10 : 0)}) rotate(${d * E.brow[0]},${d * 24},-26)`} stroke={chibi ? INK : hc} strokeWidth={chibi ? 5 : 7} strokeLinecap="round" />)}
        {!chibi && <path d="M2,-4 L-6,24 L6,26" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
        {chibi && <><ellipse cx="-44" cy="18" rx="12" ry="7" fill="rgba(240,110,110,0.35)" /><ellipse cx="44" cy="18" rx="12" ry="7" fill="rgba(240,110,110,0.35)" /></>}
        <g transform={`translate(0,${chibi ? 30 : 44})`}><Mouth kind={mouth} chibi={chibi} /></g>
      </g>)}
      <g transform={`translate(${hx},${hy}) scale(${k})`}>
        {!silhouette && <Hair kind={c.hair || 'short'} color={hc} />}
        {c.hat && <HatShape kind={c.hat} color={fill(c.hatColor || '#F2C230')} />}
        {holoOn && (holo.kind === 'hat' || ['hardhat', 'cap', 'beanie', 'mask', 'headlamp'].includes(holo.shape)) && (
          <g opacity={(1 - holoBreak) * mix(0, 1, Math.min(1, (f - holoFrom) / 3)) * (0.85 + 0.15 * Math.sin(f / 3))} transform={`translate(${holoBreak * 20},${-holoBreak * 30}) scale(${1 + holoBreak * 0.2})`}>
            <HatShape kind={holo.shape} holo />
          </g>)}
      </g>
    </g>
    {holoOn && ['vest', 'tool', 'wrench', 'lantern'].includes(holo.shape) && (
      <g opacity={(1 - holoBreak) * Math.min(1, (f - holoFrom) / 3)}>
        {holo.shape === 'vest' ? <path d={`M${-B.sh[0]},${shY - 4} L${-B.hip[0] - 4},${hipY + 12} L${B.hip[0] + 4},${hipY + 12} L${B.sh[0]},${shY - 4} Z`} {...HOLO} />
          : <g transform={`translate(${B.sh[0] * 1.6},${(shY + hipY) / 2}) scale(${chibi ? 1.6 : 1.3})`}><ToolShape kind={holo.shape === 'tool' ? 'wrench' : holo.shape} x={0} y={0} holo /></g>}
      </g>)}
    {rim && <ellipse cx={hx} cy={hy} rx={B.hr[0] + 3} ry={B.hr[1] + 3} fill="none" stroke={rim} strokeWidth="3" opacity="0.8" />}
    {emote && <g transform={`translate(${hx},${hy})`}><Emote kind={emote} t={f - emoteFrom} chibi={chibi} /></g>}
  </g>);
};

export const ToolShape = ({kind, x, y, holo}) => {
  const st = holo ? HOLO : {fill: '#9AA3AD', stroke: INK, strokeWidth: 4};
  if (kind === 'lantern') return (<g transform={`translate(${x},${y})`} {...st}><path d="M-14,0 L14,0" fill="none" /><rect x="-18" y="8" width="36" height="46" rx="6" fill={holo ? HOLO.fill : '#FFD36B'} /><rect x="-22" y="52" width="44" height="10" rx="3" /></g>);
  if (kind === 'broom') return (<g transform={`translate(${x},${y})`} {...st}><path d="M0,-120 L0,40" strokeWidth="9" stroke={holo ? HOLO.stroke : '#8B5A2B'} fill="none" /><path d="M-26,40 L26,40 L34,96 L-34,96 Z" fill={holo ? HOLO.fill : '#D9B56B'} /></g>);
  if (kind === 'clipboard') return (<g transform={`translate(${x},${y - 30})`} {...st}><rect x="-26" y="-10" width="52" height="68" rx="4" fill={holo ? HOLO.fill : '#C8955A'} /><rect x="-18" y="0" width="36" height="48" fill={holo ? 'none' : '#fff'} /></g>);
  return (<g transform={`translate(${x},${y}) rotate(-30)`} {...st}><path d="M-6,0 L-6,-80 Q-22,-86 -20,-104 L-10,-96 L0,-104 L10,-96 L20,-104 Q22,-86 6,-80 L6,0 Z" /></g>); // wrench
};
