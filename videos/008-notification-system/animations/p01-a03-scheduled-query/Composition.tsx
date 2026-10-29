import React from 'react';
import {OverlayStage, type OverlayProps} from '../../shared/OverlayStage';
import {CodeEditor} from '../../shared/CodeEditor';
import {getScheduledQueryFocus, scene} from './cues';
import {scheduledQuery} from './query';

const Composition: React.FC<OverlayProps> = (props) =>
  <OverlayStage {...props} themeId="paper" audioFile={scene.audioFile}>
    {({timeMs}) => <CodeEditor layout="snippet" lines={scheduledQuery} fieldStrength={getScheduledQueryFocus(timeMs)} />}
  </OverlayStage>;

export default Composition;
