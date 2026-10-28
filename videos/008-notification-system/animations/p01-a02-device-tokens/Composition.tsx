import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {SqlEditor} from '../../shared/SqlEditor';
import {getDeviceTokenFocus, scene} from './cues';
import {deviceTokens} from './schema';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <SqlEditor layout="standard" lines={deviceTokens} fieldStrength={getDeviceTokenFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
