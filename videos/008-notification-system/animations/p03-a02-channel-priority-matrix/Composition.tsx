import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getMatrixFocus, scene} from './cues';
import {PriorityMatrix} from './PriorityMatrix';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <PriorityMatrix focus={getMatrixFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
