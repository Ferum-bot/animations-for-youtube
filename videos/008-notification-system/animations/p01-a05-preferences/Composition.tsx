import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {SqlEditor} from '../../shared/SqlEditor';
import {getPreferenceFocus, scene} from './cues';
import {preferences} from './schema';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <SqlEditor layout="standard" lines={preferences} fieldStrength={getPreferenceFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
