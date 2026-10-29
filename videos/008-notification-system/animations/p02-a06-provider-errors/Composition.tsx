import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getErrorFocus, scene} from './cues';
import {ErrorTable} from './ErrorTable';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <ErrorTable focus={getErrorFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
