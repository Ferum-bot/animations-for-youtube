import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {framingScenes} from '../../shared/framing/timing';
import {useTimeMs} from '../../shared/timing';
import {OpenMessage, ByteStream, ExactLength} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...framingScenes.boundary}>
    <HttpSceneHeading title="ГДЕ КОНЕЦ СООБЩЕНИЯ?" eyebrow="HTTP/1.1 / ГРАНИЦЫ СООБЩЕНИЯ" fontSize={67} />
    <DiagramFrame timeMs={timeMs} />
    <OpenMessage timeMs={timeMs} />
    <ByteStream timeMs={timeMs} />
    <ExactLength timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
