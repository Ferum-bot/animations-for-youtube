import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import type {OverlayProps} from '../OverlayStage';
import {cardMotion} from './motion';
import type {RelatedVideoSpec} from './types';

const layout = {left: 128, top: 320, width: 1000, padding: 24} as const;
const imageWidth = layout.width - 2 * layout.padding - 4;

/** Original screenshots stay intact; the viewport excludes titles, view counts and watch progress. */
const Thumbnail: React.FC<{readonly image: RelatedVideoSpec['image']}> = ({image}) => {
  const scale = imageWidth / image.width;
  return <div style={{position: 'relative', width: imageWidth, height: image.height * scale, overflow: 'hidden'}}>
    <Img src={staticFile(image.file)} style={{position: 'absolute', maxWidth: 'none',
      width: image.sourceWidth * scale, left: -image.x * scale, top: -image.y * scale}} />
  </div>;
};

export const RelatedVideo: React.FC<OverlayProps & {readonly card: RelatedVideoSpec}> = ({
  card, themeId = 'graphite', motionProfile = 'calm', previewBackground = 'transparent', withAudio = false,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  const theme = getTheme(themeId);
  const accent = card.accent === 'warm' ? getTheme('signal').primary : theme[card.accent];
  // The label reaches full opacity at the spoken promise, rather than after it.
  const link = smoothProgress(timeMs, card.linkAtMs - 300, card.linkAtMs);
  const motion = cardMotion(timeMs, (durationInFrames - 1) * 1000 / fps, motionProfile, card.entrance);
  return <AbsoluteFill style={{fontFamily: theme.fontSans, color: theme.text}}>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{backgroundColor:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio ? <Audio src={staticFile(card.audioFile)} /> : null}
    <div style={{position: 'absolute', left: layout.left, top: layout.top, width: layout.width,
      padding: layout.padding, boxSizing: 'border-box', background: theme.surface,
      border: `2px solid ${theme.muted}`, borderBottom: `5px solid ${accent}`, ...motion}}>
      <Thumbnail image={card.image} />
      <div style={{fontSize: 40, lineHeight: 1.23, fontWeight: 700, marginTop: 26, marginBottom: 26}}>
        {card.title.map((line) => <div key={line}>{line}</div>)}
      </div>
      <div style={{height: 48, borderTop: `1px solid ${theme.line}`, paddingTop: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontFamily: theme.fontMono, fontSize: 22, color: theme.muted}}>МАТВЕЙ ПОПОВ</span>
        <span style={{fontSize: 28, fontWeight: 600, opacity: link, transform: `translateY(${8 * (1 - link)}px)`}}>
          {card.linkLabel} <span style={{color: accent}}>↗</span>
        </span>
      </div>
    </div>
  </AbsoluteFill>;
};
