import React from 'react';
import {CodeScene, type CodeSceneProps} from '../../shared/code/CodeScene';
import {commandLines} from './command';
import {cues, scene} from './cues';

const Composition: React.FC<CodeSceneProps> = (props) =>
  <CodeScene {...props} lines={commandLines} cues={cues} durationMs={scene.durationMs}
    variant="single-line" fileName="docker-runsc.sh" title="Альтернативный runtime · gVisor"
    audioFile="generated/006-leetcode/p02-a03-gvisor-runsc.wav" />;

export default Composition;
