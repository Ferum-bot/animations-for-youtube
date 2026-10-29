import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {CodeEditor} from '../../shared/CodeEditor';
import {getPreferenceFocus, scene} from './cues';
import {preferences} from './schema';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="standard" lines={preferences} fieldStrength={getPreferenceFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
