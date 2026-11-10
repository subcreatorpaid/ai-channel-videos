// YouTube thumbnail, 1280x720 (packager makes 3 concepts per video; vidIQ scores them before OK 2).
// spec "thumb": {words: "2-4 WORDS", hot?: "word in accent box", image?: "assets/x.png", side?: "right"|"left", badge?: "NEW", theme?}
//   layout "word": ONE big ALL-CAPS word on top (white, dark outline) over a full illustration (caricatures + one prop) - the channel's main style
// Rules (docs/packaging.md): the words never repeat the title, one focal image, readable at phone size (test at 320x180).
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Fonts, FONT} from '../Short';
import {DEFAULT_THEME} from './Wide';

export const ThumbWide = ({thumb = {}, theme = {}}) => {
  const T = {...DEFAULT_THEME, ...theme, ...(thumb.theme || {})};
  const words = String(thumb.words || 'YOUR WORDS HERE').split(' ');
  if (thumb.layout === 'word') {
    const w = String(thumb.words || 'WORD').toUpperCase(), size = Math.min(230, Math.floor(1180 / (w.length * 0.78)));
    return (<AbsoluteFill style={{background: T.bg}}>
      <Fonts />
      {thumb.image && <Img src={staticFile(thumb.image)} style={{position: 'absolute', inset: 0, width: 1280, height: 720, objectFit: 'cover'}} />}
      <div style={{position: 'absolute', top: 18, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2,
        color: '#FFFFFF', WebkitTextStroke: `${Math.round(size / 18)}px #0B0F1A`, paintOrder: 'stroke fill', textShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>{w}</div>
    </AbsoluteFill>);
  }
  const left = thumb.side === 'left';
  const longest = Math.max(...words.map((w) => w.length));
  const size = Math.min(words.length > 3 ? 120 : 150, Math.floor(560 / (longest * 0.8)));  // longest word fits the 560 px text column
  return (<AbsoluteFill style={{background: `radial-gradient(circle at ${left ? 25 : 75}% 50%, ${T.panel}, ${T.bg} 70%)`}}>
    <Fonts />
    {thumb.image && <Img src={staticFile(thumb.image)} style={{position: 'absolute', top: 60, [left ? 'left' : 'right']: 40, width: 640, height: 600, objectFit: 'contain',
      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))'}} />}
    <div style={{position: 'absolute', top: 0, bottom: 0, [left ? 'right' : 'left']: 60, width: 560, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6}}>
      {words.map((w, i) => { const hot = thumb.hot && w.toLowerCase().replace(/\W/g, '') === thumb.hot.toLowerCase().replace(/\W/g, '');
        return <div key={i} style={{alignSelf: 'flex-start', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: -4,
          color: hot ? T.ink : T.text, background: hot ? T.accent2 : 'transparent', padding: hot ? '4px 18px' : 0, borderRadius: 14,
          textShadow: hot ? 'none' : '0 6px 24px rgba(0,0,0,0.6)', transform: hot ? 'rotate(-2deg)' : 'none'}}>{w}</div>; })}
    </div>
    {thumb.badge && <div style={{position: 'absolute', top: 40, [left ? 'right' : 'left']: 60, background: T.accent, color: T.ink, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: '6px 20px', borderRadius: 10}}>{thumb.badge}</div>}
  </AbsoluteFill>);
};
