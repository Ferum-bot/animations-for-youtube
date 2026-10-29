import React from 'react';
import {CodeEditor} from '../../shared/CodeEditor';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {getSweeperFocus, scene} from './cues';
import {sweeperQuery} from './query';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="standard" lines={sweeperQuery} fieldStrength={getSweeperFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
