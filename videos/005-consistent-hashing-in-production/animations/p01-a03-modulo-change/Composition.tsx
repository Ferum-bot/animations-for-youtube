import React from 'react';
import {Scene, type SceneProps} from '../../shared/theory/Scene';
import anchors from '../../anchors.json';
import metadata from './animation.json';
import {Diagram} from './Diagram';

const Composition: React.FC<SceneProps> = (props) => (
  <Scene {...props} startMs={anchors['p01-a03-modulo-change-start']} durationMs={metadata.durationMs}>
    {(timeMs) => <Diagram timeMs={timeMs} />}
  </Scene>
);
export default Composition;
