import React from 'react';
import {ExplainerStage, type PreviewProps} from '../../shared/ExplainerStage';
import {Cassandra, TemporalEvidence} from './Evidence';
import {History} from './History';
import {Aurora, WriterLimit} from './Scaling';
import {Article, Company, FinalQuote, Limits, Product, Sona, VoiceArticle} from './Sources';
import {cues, reveal, timing, type SceneProps} from './timing';
import {theme} from './ui';

type Shot = {readonly start: number; readonly Component: React.FC<SceneProps>};
const shots = [
  {start: 0, Component: Company}, {start: cues.product, Component: Product},
  {start: cues.sona, Component: Sona}, {start: cues.article, Component: Article},
  {start: cues.temporal, Component: TemporalEvidence}, {start: cues.voice, Component: VoiceArticle},
  {start: cues.history, Component: History}, {start: cues.aurora, Component: Aurora},
  {start: cues.ceiling, Component: Limits}, {start: cues.symptoms + 1800, Component: WriterLimit},
  {start: cues.limit, Component: Limits}, {start: cues.cassandra, Component: Cassandra},
  {start: cues.quote, Component: FinalQuote},
] satisfies readonly Shot[];

const Composition: React.FC<PreviewProps> = props => <ExplainerStage {...props} timing={timing}
  audioPath="generated/007-just-use-postgres/p10-a01-quo-scaling.wav">
  {({timeMs}) => shots.map(({start, Component}, index) => {
    const next = shots[index + 1]?.start ?? timing.durationMs;
    if (timeMs < start || timeMs >= next + 350) return null;
    // New shot dissolves over the held previous frame; no dip to an empty stage.
    return <div key={start} style={{position: 'absolute', inset: 0, background: theme.background,
      opacity: start === 0 ? 1 : reveal(timeMs, start, 350)}}>
      <Component timeMs={Math.min(timeMs, next)} />
    </div>;
  })}
</ExplainerStage>;
export default Composition;
