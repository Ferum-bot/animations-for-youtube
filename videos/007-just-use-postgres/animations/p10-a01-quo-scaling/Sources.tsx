import React from 'react';
import {Img, staticFile} from 'remotion';
import {asset, paper} from './ui';
import {cues, reveal, type SceneProps} from './timing';

type Camera = {readonly x: number; readonly y: number; readonly width: number};
const frame = {left: 64, top: 98, width: 1472, height: 742} as const;

/** 4× source captures. Coordinates stay in original browser CSS pixels. */
const Page: React.FC<{
  readonly file: string; readonly originY?: number; readonly from: Camera;
  readonly to?: Camera; readonly progress?: number; readonly label?: string;
}> = ({file, originY = 0, from, to = from, progress = 0, label = 'Quo'}) => {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress - originY;
  // 620 CSS pixels at 4× provides 2480 source pixels for this 2355 px viewport.
  const width = Math.max(620, from.width + (to.width - from.width) * progress);
  const scale = frame.width / width;
  return <>
    <div style={{position: 'absolute', left: frame.left, top: 42, fontSize: 30, fontWeight: 600}}>{label}</div>
    <div style={{position: 'absolute', ...frame, background: paper, overflow: 'hidden'}}>
      <Img src={staticFile(asset(file))} style={{position: 'absolute', width: 1200, maxWidth: 'none',
        transformOrigin: 'top left', transform: `translate(${-x * scale}px, ${-y * scale}px) scale(${scale})`}} />
    </div>
  </>;
};

export const Company: React.FC<SceneProps> = ({timeMs}) => <Page file="rebrand-heading.png"
  from={{x: 0, y: 160, width: 1200}} to={{x: 20, y: 205, width: 1160}}
  progress={reveal(timeMs, 1300, 2100)} />;
export const Product: React.FC<SceneProps> = ({timeMs}) => <Page file="home-hero.png"
  from={{x: 0, y: 190, width: 1200}} to={{x: 0, y: 545, width: 1200}}
  progress={reveal(timeMs, cues.product + 600, 3000)} />;
export const Sona: React.FC<SceneProps> = ({timeMs}) => <Page file="home-hero.png"
  from={{x: 0, y: 1215, width: 1200}} to={{x: 0, y: 1240, width: 1200}}
  progress={reveal(timeMs, cues.sona + 500, 1800)} />;
export const Article: React.FC<SceneProps> = ({timeMs}) => <Page file="article-heading.png"
  from={{x: 0, y: 185, width: 1200}} to={{x: 24, y: 250, width: 1152}}
  progress={reveal(timeMs, cues.article + 900, 1800)} />;
export const VoiceArticle: React.FC<SceneProps> = ({timeMs}) => <Page file="voice-heading.png"
  label="Quo / Sona + Temporal" from={{x: 0, y: 185, width: 1200}} to={{x: 24, y: 215, width: 1152}}
  progress={reveal(timeMs, cues.voice + 500, 1600)} />;
export const Limits: React.FC<SceneProps> = ({timeMs}) => <Page file="article-limits.png" originY={4384}
  from={{x: 24, y: 4398, width: 780}} to={{x: 24, y: 4585, width: 720}}
  progress={reveal(timeMs, cues.ceiling + 800, 1800)} />;
export const FinalQuote: React.FC<SceneProps> = ({timeMs}) => <Page file="article-ending.png" originY={7722}
  from={{x: 24, y: 7750, width: 760}} to={{x: 65, y: 7875, width: 660}}
  progress={reveal(timeMs, cues.quote + 650, 1700)} />;

