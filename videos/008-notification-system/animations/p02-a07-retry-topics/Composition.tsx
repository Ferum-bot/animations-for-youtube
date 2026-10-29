import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getRetryFocus, scene} from './cues';
import {RetryDiagram} from './RetryDiagram';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <RetryDiagram focus={getRetryFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
