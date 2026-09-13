import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {framingScenes} from '../../shared/framing/timing';
import {useTimeMs} from '../../shared/timing';
import {UnknownSize, ChunkAnatomy, StreamingBuffer} from './Explanations';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...framingScenes.chunked}>
    <HttpSceneHeading title="ПЕРЕДАЧА ЧАСТЯМИ" eyebrow="HTTP/1.1 / CHUNKED" />
    <DiagramFrame timeMs={timeMs} />
    <UnknownSize timeMs={timeMs} />
    <ChunkAnatomy timeMs={timeMs} />
    <StreamingBuffer timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
