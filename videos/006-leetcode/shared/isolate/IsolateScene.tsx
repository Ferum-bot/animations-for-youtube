import React from 'react';
import {CodeScene, type CodeSceneProps} from '../code/CodeScene';
import type {CodeCue} from '../code/types';
import {commandLines} from './command';

export const IsolateScene: React.FC<CodeSceneProps & {
  readonly cues: readonly CodeCue[];
  readonly durationMs: number;
  readonly audioFile: string;
}> = (props) => <CodeScene {...props} lines={commandLines}
  spacing={{firstBaseline: 166, lineHeight: 74}}
  fileName="isolate-run.sh" title="Песочница №7 · Isolate" />;
