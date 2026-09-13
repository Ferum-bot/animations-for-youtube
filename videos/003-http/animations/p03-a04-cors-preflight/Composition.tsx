import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {methodScenes} from '../../shared/methods/timing';
import {reveal, useTimeMs} from '../../shared/timing';
import {corsCues} from './model';
import {Problem} from './Problem';
import {Exchange} from './Exchange';
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...methodScenes.cors}>
    <g opacity={1 - reveal(timeMs, corsCues.policy - 500, 250)}>
      <HttpSceneHeading title="ЛИШНИЙ ЗАПРОС?" eyebrow="OPTIONS / БРАУЗЕР И API" />
    </g>
    <g opacity={reveal(timeMs, corsCues.policy - 150, 350)}>
      <HttpSceneHeading title="КАК РАБОТАЕТ CORS" eyebrow="OPTIONS / PREFLIGHT" fontSize={65} />
    </g>
    <DiagramFrame timeMs={timeMs} />
    <Problem timeMs={timeMs} />
    <Exchange timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
