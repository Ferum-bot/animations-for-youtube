import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getConsumerFocus, scene} from './cues';
import {consumerSettings} from './settings';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="compact" language="properties"
      lines={consumerSettings} fieldStrength={getConsumerFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
