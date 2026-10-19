import React from 'react';
import {ExplainerStage, type PreviewProps} from '../../shared/ExplainerStage';
import {Benchmark, ExperimentSetup, SessionWaits} from './Benchmark';
import {Documentation, Postgres19} from './Documentation';
import {GlobalLock, QueueOrder, SourceCode, Transaction} from './Mechanism';
import {LockEvidence, RecallArticle, Remediation} from './Recall';
import {cues, reveal, timing, type SceneProps} from './timing';

type Shot = {readonly start: number; readonly end: number; readonly layout: 'content' | 'source'; readonly Component: React.FC<SceneProps>};
const shots = [
  {start: 0, end: cues.pending, layout: 'content', Component: Transaction},
  {start: cues.pending, end: cues.lock, layout: 'content', Component: QueueOrder},
  {start: cues.lock, end: cues.source, layout: 'content', Component: GlobalLock},
  {start: cues.source, end: cues.contention, layout: 'content', Component: SourceCode},
  {start: cues.contention, end: cues.benchmarkSetup, layout: 'content', Component: GlobalLock},
  {start: cues.benchmarkSetup, end: cues.oneClient, layout: 'content', Component: ExperimentSetup},
  {start: cues.oneClient, end: cues.sessions, layout: 'content', Component: Benchmark},
  {start: cues.sessions, end: cues.recall, layout: 'content', Component: SessionWaits},
  {start: cues.recall, end: cues.log, layout: 'source', Component: RecallArticle},
  {start: cues.log, end: cues.fix, layout: 'content', Component: LockEvidence},
  {start: cues.fix, end: cues.docs, layout: 'source', Component: Remediation},
  {start: cues.docs, end: cues.pg19, layout: 'source', Component: Documentation},
  {start: cues.pg19, end: timing.durationMs, layout: 'content', Component: Postgres19},
] satisfies readonly Shot[];

const Composition: React.FC<PreviewProps> = props => <ExplainerStage {...props} timing={timing}
  audioPath="generated/007-just-use-postgres/p09-a01-listen-notify-lock.wav">
  {({timeMs, compact}) => shots.map(({start, end, layout, Component}) => {
    if (timeMs < start || timeMs >= end) return null;
    const opacity = reveal(timeMs, start, 240) * (end === timing.durationMs ? 1 : 1 - reveal(timeMs, end - 120, 120));
    return <div key={start} style={{position: 'absolute', inset: 0, opacity}}>
      {layout === 'content' ? <div style={{position: 'absolute', left: 100 - 20 * compact, top: 62 + 48 * compact,
        width: 1400 - 290 * compact}}><Component timeMs={timeMs} compact={compact} /></div>
        : <Component timeMs={timeMs} compact={compact} />}
    </div>;
  })}
</ExplainerStage>;
export default Composition;
