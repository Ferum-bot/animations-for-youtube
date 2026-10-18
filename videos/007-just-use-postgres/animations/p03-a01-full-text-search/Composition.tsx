import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FeatheredBackground} from '@channel/design-system';
import {PreviewBackground, type IntroBackground} from '../../shared/intro/PreviewBackground';
import {ShotContent} from './Scenes';
import {reveal, shots, timing} from './timing';
import {theme} from './ui';

type Props = {readonly previewBackground?: IntroBackground; readonly withAudio?: boolean};

const Composition: React.FC<Props> = ({previewBackground = 'transparent', withAudio = false}) => {
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const enter = reveal(timeMs, 0, timing.entranceMs);
  const compact = reveal(timeMs, timing.compactStartMs, timing.compactEndMs - timing.compactStartMs);
  const exit = reveal(timeMs, timing.exitStartMs, timing.durationMs - timing.exitStartMs - 1000 / fps);
  const scale = 1.6 - 0.6 * compact;
  return <AbsoluteFill>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile('generated/007-just-use-postgres/p03-a01-full-text-search.wav')} /> : null}
    <AbsoluteFill style={{transform: `translateX(${-2560 * (1 - enter) - 1640 * exit}px)`}}>
      <FeatheredBackground color={theme.background} feather={{solidEnd: 2560 - 1240 * compact, transparentStart: 2840 - 1240 * compact}} />
      <div style={{position: 'absolute', width: 1600 - 240 * compact, height: 1440 / scale,
        transform: `scale(${scale})`, transformOrigin: 'top left', color: theme.text, fontFamily: theme.fontSans}}>
        {shots.map(shot => {
          if (timeMs < shot.startMs || timeMs >= shot.endMs) return null;
          const localMs = timeMs - shot.startMs;
          const opacity = reveal(localMs, 0, 280) * (1 - reveal(timeMs, shot.endMs - 160, 160));
          return <div key={shot.id} style={{position: 'absolute', inset: 0, opacity}}>
            <div style={{position: 'absolute', left: 100, top: 64 + 36 * compact,
              fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 1.8, color: theme.muted}}>{shot.section}</div>
            <div style={{position: 'absolute', top: 130 + 40 * compact, left: 100, right: 100}}>
              <h1 style={{fontSize: 59 - 7 * compact, lineHeight: 1.16, letterSpacing: -1.8, fontWeight: 600, margin: '0 0 54px'}}>{shot.title}</h1>
              <ShotContent id={shot.id} timeMs={localMs} compact={compact} />
            </div>
          </div>;
        })}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export default Composition;
