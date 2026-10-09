import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {CodePanel} from '../../shared/code/CodePanel';
import {commandLines} from './commands';
import {cues, scene} from './cues';
import {ScoreSummary} from './ScoreSummary';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} durationMs={scene.durationMs}
    audioFile="generated/006-leetcode/p02-a05-redis-leaderboard.wav">
    {({timeMs, theme}) => <>
      <CodePanel theme={theme} lines={commandLines} cues={cues} timeMs={timeMs}
        fileName="leaderboard.redis" title="Redis · Sorted Set"
        spacing={{firstBaseline: 166, lineHeight: 110}} />
      <ScoreSummary theme={theme} />
    </>}
  </OverlayStage>;

export default Composition;
