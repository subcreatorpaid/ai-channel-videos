import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {Thumb} from './Thumb';
import {Story} from './Story';
import {SoftUI} from './SoftUI';
import {Flow} from './flow/Flow';
import {Wide} from './wide/Wide';
import {ThumbWide} from './wide/ThumbWide';

// Long-form (main channel format): "Long" 1920x1080 + "ThumbWide" 1280x720 (spec "style": "wide", docs/animator-rules.md).
// Vertical Shorts (cut from long videos from week 4): "Short" 1080x1920 with the scene kits copied from the first project.
const Vertical = (p) => (['launch', 'keynote', 'showreel', 'motion', 'overview', 'fluid'].includes(p.style) ? <Flow {...p} /> : p.style === 'softui' ? <SoftUI {...p} /> : p.style === 'story' ? <Story {...p} /> : <Short {...p} />);

const wideSample = {fps: 30, total: 150, audio: false, beats: [
  {say: 'Sample', from: 0, frames: 150, speakFrom: 10, speakFrames: 120, words: [], show: {type: 'title', kicker: 'Sample', title: 'Automate your *week* with AI', sub: 'Long-form scene kit, 1920x1080'}},
]};
const meta = ({props}) => ({durationInFrames: Math.max(30, props.total || 90), fps: props.fps || 30});

export const Root = () => (
  <>
  <Composition id="Long" component={Wide} width={1920} height={1080} fps={30} durationInFrames={150} defaultProps={wideSample} calculateMetadata={meta} />
  <Composition id="ThumbWide" component={ThumbWide} width={1280} height={720} fps={30} durationInFrames={1} defaultProps={{thumb: {words: 'AUTOMATE EVERYTHING', hot: 'EVERYTHING'}}} />
  <Composition id="Thumb" component={Thumb} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{thumb: {}}} />
  <Composition id="Short" component={Vertical} width={1080} height={1920} fps={30} durationInFrames={90}
    defaultProps={{slug: 'sample', handle: '@channel', fps: 30, total: 90, beats: []}} calculateMetadata={meta} />
  </>
);
