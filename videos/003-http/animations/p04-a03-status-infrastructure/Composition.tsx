import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {cue, shotOpacity, statusScenes} from '../../shared/status/timing';
import {reveal, useTimeMs} from '../../shared/timing';
import {Topology} from './Topology';
import {Monitoring, Resolution} from './Monitoring';

const monitor = cue('infrastructure', 'p04-standard-code');
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...statusScenes.infrastructure}>
    <g opacity={shotOpacity(timeMs, 0, monitor)}><HttpSceneHeading title="ПО ПУТИ ОТВЕТА" eyebrow="HTTP / ИНФРАСТРУКТУРА" /></g>
    <g opacity={reveal(timeMs, monitor, 280)}><HttpSceneHeading title="ОТ ОТВЕТА К АЛЕРТУ" eyebrow="HTTP / ИНТЕГРАЦИЯ СИСТЕМ" fontSize={66} /></g>
    <DiagramFrame timeMs={timeMs} />
    <Topology timeMs={timeMs} />
    <Monitoring timeMs={timeMs} />
    <Resolution timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
