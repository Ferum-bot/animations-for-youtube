import React from 'react';
import {ExplainerStage, type PreviewProps} from '../../shared/ExplainerStage';
import {ShotContent} from './Scenes';
import {reveal, shots, timing} from './timing';
import {theme} from './ui';

const Composition: React.FC<PreviewProps> = props => <ExplainerStage {...props} timing={timing}
  audioPath="generated/007-just-use-postgres/p04-a01-postgres-cache.wav">
  {({timeMs, compact}) => shots.map(shot => {
    if (timeMs < shot.startMs || timeMs >= shot.endMs) return null;
    const localMs = timeMs - shot.startMs;
    const opacity = reveal(localMs, 0, 220) * (1 - reveal(timeMs, shot.endMs - 140, 140));
    return <div key={shot.id} style={{position: 'absolute', inset: 0, opacity}}>
      <div style={{position: 'absolute', left: 100, top: 64 + 36 * compact,
        fontFamily: theme.fontMono, fontSize: 22, letterSpacing: 1.5, color: theme.muted}}>{shot.section}</div>
      <div style={{position: 'absolute', left: 100, right: 100, top: 130 + 40 * compact}}>
        <h1 style={{fontSize: 59 - 7 * compact, lineHeight: 1.16, letterSpacing: -1.8, fontWeight: 600, margin: '0 0 48px'}}>{shot.title}</h1>
        <ShotContent id={shot.id} timeMs={localMs} compact={compact} />
      </div>
    </div>;
  })}
</ExplainerStage>;
export default Composition;
