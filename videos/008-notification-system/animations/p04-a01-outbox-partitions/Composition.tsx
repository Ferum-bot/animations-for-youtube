import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getPartitionState, scene} from './cues';
import {parentTable, partitionLifecycle} from './schema';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => {
      const state = getPartitionState(timeMs);
      return <>
        <g opacity={state.parentOpacity}>
          <CodeEditor layout="wide" lines={parentTable} fieldStrength={state.fieldStrength} />
        </g>
        <g opacity={state.dailyOpacity}>
          <CodeEditor layout="wide" lines={partitionLifecycle} fieldStrength={state.fieldStrength} />
        </g>
      </>;
    }}
  </OverlayStage>;

export default Composition;
