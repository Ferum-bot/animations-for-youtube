import React from 'react';
import {CodeScene, type CodeSceneProps} from '../../shared/code/CodeScene';
import {cues, scene} from './cues';
import {sqlLines} from './sql';

const Composition: React.FC<CodeSceneProps> = (props) =>
  <CodeScene {...props} lines={sqlLines} cues={cues} durationMs={scene.durationMs}
    spacing={{firstBaseline: 140, lineHeight: 74}}
    audioFile="generated/006-leetcode/p01-a04-leaderboard-sql.wav"
    fileName="leaderboard.sql" title="Рейтинг участников · PostgreSQL" />;

export default Composition;
