import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getClaimFocus, scene} from './cues';
import {claimQuery} from './query';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="standard" lines={claimQuery}
      fieldStrength={getClaimFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
