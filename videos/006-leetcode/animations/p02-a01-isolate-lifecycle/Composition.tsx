import React from 'react';
import type {CodeSceneProps} from '../../shared/code/CodeScene';
import {IsolateScene} from '../../shared/isolate/IsolateScene';
import {cues, scene} from './cues';

const Composition: React.FC<CodeSceneProps> = (props) =>
  <IsolateScene {...props} cues={cues} durationMs={scene.durationMs}
    audioFile="generated/006-leetcode/p02-a01-isolate-lifecycle.wav" />;

export default Composition;
