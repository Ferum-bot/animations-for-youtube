import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {clamp01, fadeEnvelope, msToFrames} from '@channel/motion-core';
import {getTheme, type ThemeId} from '@channel/theme';
import video from '../../video.json';
import {getOzonTheme} from '../../shared/theme';
import {scene} from './cues';
import {SqlListing} from './SqlListing';
import {Explanation} from './Explanation';

type Props = {
  readonly themeId?: ThemeId;
  readonly backgroundOpacity?: number;
  readonly withAudio?: boolean;
  readonly previewBackground?: 'transparent' | 'light' | 'dark';
};

const Composition: React.FC<Props> = ({themeId = 'graphite', backgroundOpacity = 0.94,
  withAudio = false, previewBackground = 'transparent'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timeMs = frame * 1000 / fps;
  const theme = getOzonTheme(themeId);
  const opacity = fadeEnvelope({frame, durationInFrames, enterFrames: 10, exitFrames: 12});
  return <AbsoluteFill>
    {previewBackground !== 'transparent' ? <AbsoluteFill style={{background:
      getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} /> : null}
    {withAudio && video.audio ? <Audio src={staticFile(video.audio)} trimBefore={msToFrames(scene.startMs, fps)} /> : null}
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: theme.background, opacity: clamp01(backgroundOpacity)}} />
      <svg width="100%" height="100%" viewBox="0 0 2560 1440" style={{position: 'absolute', inset: 0, fontFamily: theme.fontSans}}>
        <text x={120} y={112} fontSize={25} letterSpacing={3} fontFamily={theme.fontMono} fill={theme.accent}>OZON / FLASH SALE</text>
        <text x={120} y={190} fontSize={62} fontWeight={700} letterSpacing={-1.5} fill={theme.text}>Атомарная резервация</text>
        <text x={2440} y={185} fontSize={27} textAnchor="end" fontFamily={theme.fontMono} fill={theme.comment}>PostgreSQL</text>
        <path d="M 120 226 H 2440 M 1786 270 V 1200" stroke={theme.line} strokeWidth={2} />
        <SqlListing timeMs={timeMs} theme={theme} />
        <Explanation timeMs={timeMs} theme={theme} />
        <path d="M 120 1254 H 2440" stroke={theme.line} strokeWidth={2} />
        <text x={120} y={1320} fontSize={27} fill={theme.comment}>Остаток + резервация</text>
        <text x={2440} y={1320} textAnchor="end" fontSize={27} fontFamily={theme.fontMono} fill={theme.accent}>UPDATE → RETURNING → INSERT</text>
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};

export default Composition;
