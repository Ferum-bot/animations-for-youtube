import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FeatheredBackground} from '@channel/design-system';
import {smoothProgress} from '@channel/motion-core';
import {PreviewBackground, type IntroBackground} from './intro/PreviewBackground';
import {getPostgresTheme} from './theme';

type Framing = {
  readonly durationMs: number;
  readonly entranceMs: number;
  readonly exitStartMs: number;
} & ({readonly layout: 'full'} | {
  readonly layout?: 'adaptive';
  readonly compactStartMs: number;
  readonly compactEndMs: number;
});
export type PreviewProps = {readonly previewBackground?: IntroBackground; readonly withAudio?: boolean};
export type ExplainerFrame = {readonly timeMs: number; readonly compact: number};

/** Episode framing shared by subsequent full-screen-to-presenter inserts. */
export const ExplainerStage: React.FC<PreviewProps & {
  readonly timing: Framing;
  readonly audioPath: string;
  readonly children: (frame: ExplainerFrame) => React.ReactNode;
}> = ({timing, audioPath, previewBackground = 'transparent', withAudio = false, children}) => {
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const enter = smoothProgress(timeMs, 0, timing.entranceMs);
  const compact = timing.layout === 'full' ? 0 : smoothProgress(timeMs, timing.compactStartMs, timing.compactEndMs);
  const exitDistance = timing.layout === 'full' ? 2560 : 1640;
  const exit = smoothProgress(timeMs, timing.exitStartMs, timing.durationMs - 1000 / fps);
  const scale = 1.6 - 0.6 * compact;
  const theme = getPostgresTheme('graphite');
  return <AbsoluteFill>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile(audioPath)} /> : null}
    <AbsoluteFill style={{transform: `translateX(${-2560 * (1 - enter) - exitDistance * exit}px)`}}>
      <FeatheredBackground color={theme.background} feather={{solidEnd: 2560 - 1240 * compact, transparentStart: 2840 - 1240 * compact}} />
      <div style={{position: 'absolute', width: 1600 - 240 * compact, height: 1440 / scale,
        transform: `scale(${scale})`, transformOrigin: 'top left', color: theme.text, fontFamily: theme.fontSans}}>
        {children({timeMs, compact})}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
