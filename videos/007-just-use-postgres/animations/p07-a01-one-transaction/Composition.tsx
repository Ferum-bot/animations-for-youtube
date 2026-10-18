import React from 'react';
import {ExplainerStage, type PreviewProps} from '../../shared/ExplainerStage';
import {Transaction} from './Transaction';
import {Outcomes} from './Outcomes';
import {SeparateSystems} from './SeparateSystems';
import {cues, reveal, timing} from './timing';
import {theme} from './ui';

const shots = [
  {startMs: 0, endMs: cues.outcomesMs, title: 'Заказ. Задача. Кэш.', Component: Transaction},
  {startMs: cues.outcomesMs, endMs: cues.gapMs, title: 'Либо всё, либо ничего.', Component: Outcomes},
  {startMs: cues.gapMs, endMs: timing.durationMs, title: 'Между системами остаётся разрыв.', Component: SeparateSystems},
] as const;

const Composition: React.FC<PreviewProps> = props => <ExplainerStage {...props} timing={timing}
  audioPath="generated/007-just-use-postgres/p07-a01-one-transaction.wav">
  {({timeMs}) => shots.map(({startMs, endMs, title, Component}) => {
    if (timeMs < startMs || timeMs >= endMs) return null;
    const opacity = reveal(timeMs, startMs, 160) * (1 - reveal(timeMs, endMs - 100, 100));
    return <div key={title} style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', left: 100, top: 64, fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 1.5, color: theme.muted}}>POSTGRES / ОДНА ТРАНЗАКЦИЯ НА ВСЁ</div>
      <div style={{position: 'absolute', left: 100, right: 100, top: 130}}>
        <h1 style={{fontSize: 59, lineHeight: 1.16, letterSpacing: -1.8, fontWeight: 600, margin: '0 0 42px'}}>{title}</h1>
        <Component timeMs={timeMs} />
      </div>
    </div>;
  })}
</ExplainerStage>;
export default Composition;
