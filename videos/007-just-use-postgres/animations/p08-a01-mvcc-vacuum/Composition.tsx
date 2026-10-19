import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {FeatheredBackground} from '@channel/design-system';
import {PreviewBackground} from '../../shared/intro/PreviewBackground';
import type {PreviewProps} from '../../shared/ExplainerStage';
import {IntroSources} from './Sources';
import {TriggerSource} from './TriggerSource';
import {Versions, Lifecycle} from './Versions';
import {Query} from './Query';
import {Btree} from './Btree';
import {Blockers} from './Blockers';
import {Benchmark, ExperimentSetup} from './Benchmark';
import {Spiral} from './Spiral';
import {cues, reveal, timing} from './timing';
import {accent, theme} from './ui';

const scenes = [
  {start: timing.expandEndMs, end: cues.cycle, Component: Versions},
  {start: cues.cycle, end: cues.query, Component: Lifecycle},
  {start: cues.query, end: cues.tree, Component: Query},
  {start: cues.tree, end: cues.blockers, Component: Btree},
  {start: cues.blockers, end: cues.bench, Component: Blockers},
  {start: cues.bench, end: cues.healthyBench, Component: ExperimentSetup},
  {start: cues.healthyBench, end: cues.spiral, Component: Benchmark},
  {start: cues.spiral, end: cues.trigger, Component: Spiral},
] as const;

const Composition: React.FC<PreviewProps> = ({previewBackground = 'transparent', withAudio = false}) => {
  const {fps} = useVideoConfig();
  const timeMs = useCurrentFrame() * 1000 / fps;
  const enter = reveal(timeMs, 0, timing.entranceMs);
  const expand = reveal(timeMs, timing.expandStartMs, timing.expandEndMs - timing.expandStartMs);
  const exit = reveal(timeMs, timing.exitStartMs, timing.durationMs - timing.exitStartMs - 1000 / fps);
  const showStageBackground = timeMs >= cues.mvcc;
  return <AbsoluteFill style={{fontFamily: theme.fontSans, color: theme.text}}>
    <PreviewBackground mode={previewBackground} />
    {withAudio ? <Audio src={staticFile('generated/007-just-use-postgres/p08-a01-mvcc-vacuum.wav')} /> : null}
    <AbsoluteFill style={{transform: `translateX(${-1440 * (1 - enter) - 2560 * exit}px)`}}>
      {showStageBackground ? <AbsoluteFill style={{
        transform: `translateX(${-1450 * (1 - reveal(timeMs, cues.mvcc, 600))}px)`,
      }}><FeatheredBackground color={theme.background} feather={{solidEnd: 1220 + 1340 * expand, transparentStart: 1450 + 1390 * expand}} /></AbsoluteFill> : null}
      {timeMs < cues.mvcc ? <div style={{transform: 'scale(1.1)', transformOrigin: '60px 80px', opacity: 1 - reveal(timeMs, cues.mvcc - 200, 200)}}><IntroSources timeMs={timeMs} /></div> : null}
      {timeMs >= cues.mvcc && timeMs < timing.expandEndMs ? <div style={{position: 'absolute', left: 100,
        top: 400 - expand * 190, transform: `scale(${1 + expand * .4})`, transformOrigin: 'top left', opacity: reveal(timeMs, cues.mvcc + 450, 300)}}>
        <div style={{fontFamily: theme.fontMono, fontSize: 29, color: theme.signal}}>ПРОБЛЕМА</div>
        <div style={{fontSize: 112, fontWeight: 600, marginTop: 22}}>MVCC</div>
        <div style={{fontSize: 42, color: accent, marginTop: 20}}>Несколько версий одной строки</div>
      </div> : null}
      <div style={{position: 'absolute', width: 1600, height: 900, transform: 'scale(1.6)', transformOrigin: 'top left'}}>
        {scenes.map(({start, end, Component}) => {
          const opensArticle = end === cues.trigger;
          const fadeStart = opensArticle ? end : end - 100;
          const fadeDuration = opensArticle ? 450 : 100;
          if (timeMs < start || timeMs >= fadeStart + fadeDuration) return null;
          return <div key={start} style={{position: 'absolute', left: 100, top: 62, width: 1400,
            opacity: reveal(timeMs, start, 160) * (1 - reveal(timeMs, fadeStart, fadeDuration))}}>
            <Component timeMs={timeMs} />
          </div>;
        })}
        {timeMs >= cues.trigger ? <div style={{opacity: reveal(timeMs, cues.trigger, 450)}}><TriggerSource timeMs={timeMs} /></div> : null}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
export default Composition;
