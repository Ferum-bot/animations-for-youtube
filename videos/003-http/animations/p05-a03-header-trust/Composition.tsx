import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {cue, headerScenes} from '../../shared/headers/timing';
import {reveal, shotOpacity, useTimeMs} from '../../shared/timing';
import {RefererOrigin, ClientClaims, TrustBoundary} from './Explanations';

const rules = cue('trust', 'p05-rules');
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...headerScenes.trust}>
    <g opacity={shotOpacity(timeMs, 0, rules)}><HttpSceneHeading title="ОТКУДА ПРИШЁЛ ПЕРЕХОД" eyebrow="HTTP / REFERER" fontSize={65} /></g>
    <g opacity={reveal(timeMs, rules)}><HttpSceneHeading title="ГРАНИЦА ДОВЕРИЯ" eyebrow="HTTP / ДАННЫЕ КЛИЕНТА" /></g>
    <DiagramFrame timeMs={timeMs} />
    <RefererOrigin timeMs={timeMs} />
    <ClientClaims timeMs={timeMs} />
    <TrustBoundary timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
