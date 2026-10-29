import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getCapacityFocus, scene} from './cues';
import {CapacityTable} from './CapacityTable';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CapacityTable focus={getCapacityFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
