import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FeatheredBackground} from '@channel/design-system';
import {PreviewBackground, type IntroBackground} from '../../shared/intro/PreviewBackground';
import {chapters, progress, scene} from './scene';
import {SceneContent} from './Scenes';
import {theme} from './ui';

type Props = {readonly previewBackground?: IntroBackground; readonly withAudio?: boolean};

const Composition: React.FC<Props> = ({previewBackground = 'transparent', withAudio = false}) => {
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const enter = progress(timeMs, 0, scene.entranceMs);
  const compact = progress(timeMs, scene.compactStartMs, scene.compactEndMs - scene.compactStartMs);
  const exit = progress(timeMs, scene.exitStartMs, scene.durationMs - scene.exitStartMs - 1000 / fps);
  const scale = 1.6 - 0.6 * compact;
  const left = -2560 * (1 - enter);
  const contentWidth = 1600 - 240 * compact;
  return <AbsoluteFill>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile('generated/007-just-use-postgres/p02-a01-jsonb.wav')} /> : null}
    <AbsoluteFill style={{transform: `translateX(${left}px)`, opacity: 1 - exit}}>
      <FeatheredBackground color={theme.background} feather={{
        solidEnd: 2560 - 1240 * compact, transparentStart: 2840 - 1240 * compact,
      }} />
      <div style={{position: 'absolute', width: contentWidth, height: 1440 / scale,
        transform: `scale(${scale})`, transformOrigin: 'top left',
        color: theme.text, fontFamily: theme.fontSans}}>
      <div style={{position: 'absolute', left: 100, top: 64 + 36 * compact, color: theme.muted,
        fontFamily: theme.fontMono, fontSize: 23, letterSpacing: 2}}>POSTGRES / JSONB</div>
      {chapters.map(chapter => {
        if (timeMs < chapter.startMs || timeMs >= chapter.endMs) return null;
        const localMs = timeMs - chapter.startMs;
        const opacity = progress(localMs, 0, 300) * (1 - progress(timeMs, chapter.endMs - 200, 200));
        return <div key={chapter.id} style={{position: 'absolute', inset: 0, opacity}}>
          <div style={{position: 'absolute', top: 130 + 40 * compact, left: 100, right: 100}}>
            <h1 style={{fontSize: 62 - 8 * compact, lineHeight: 1.15, letterSpacing: -2, fontWeight: 600, margin: '0 0 55px'}}>{chapter.title}</h1>
            <SceneContent id={chapter.id} timeMs={localMs} compactProgress={compact} />
          </div>
        </div>;
      })}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export default Composition;
