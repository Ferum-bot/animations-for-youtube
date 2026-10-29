import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {CodeEditor} from '../../shared/CodeEditor';
import {getProducerFocus, scene} from './cues';
import {producerSettings} from './settings';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="compact" language="properties"
      lines={producerSettings} fieldStrength={getProducerFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
