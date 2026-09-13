import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {headerScenes} from '../../shared/headers/timing';
import {useTimeMs} from '../../shared/timing';
import {Catalog, Negotiation, ClientIdentity} from './Groups';
import {CookieExchange, CacheLifecycle} from './State';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...headerScenes.groups}>
    <HttpSceneHeading title="ЗАГОЛОВКИ HTTP" eyebrow="HTTP / ПАРАМЕТРЫ ОБМЕНА" />
    <DiagramFrame timeMs={timeMs} />
    <Catalog timeMs={timeMs} />
    <Negotiation timeMs={timeMs} />
    <ClientIdentity timeMs={timeMs} />
    <CookieExchange timeMs={timeMs} />
    <CacheLifecycle timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
