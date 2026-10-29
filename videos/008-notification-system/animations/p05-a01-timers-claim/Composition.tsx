import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {timersSchema, timerClaim} from './code';
import {getTimerState, scene} from './cues';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => {
      const state = getTimerState(timeMs);
      return <>
        <g opacity={state.outgoingOpacity}>
          <CodeEditor layout="wide" lines={timersSchema} fieldStrength={state.fieldStrength} />
        </g>
        <g opacity={state.incomingOpacity}>
          <CodeEditor layout="wide" lines={timerClaim} fieldStrength={state.fieldStrength} />
        </g>
      </>;
    }}
  </OverlayStage>;

export default Composition;
