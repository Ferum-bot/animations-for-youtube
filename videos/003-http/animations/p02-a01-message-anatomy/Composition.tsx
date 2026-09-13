import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {reveal, useTimeMs} from '../../shared/timing';
import {MessageAnatomy} from './MessageAnatomy';
import {VersionIntro} from './VersionIntro';
import {anatomyScene, cues} from './timing';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const previousTitle = 1 - reveal(timeMs, cues.compare, 240);
  const nextTitle = reveal(timeMs, cues.compare + 280, 350);
  return <NarratedHttpScene {...props} {...anatomyScene}>
    <g opacity={previousTitle}><HttpSceneHeading title="АНАТОМИЯ СООБЩЕНИЯ" eyebrow="HTTP/1.1 / УСТРОЙСТВО" fontSize={63} /></g>
    <g opacity={nextTitle}><HttpSceneHeading title="ЗАПРОС И ОТВЕТ" eyebrow="HTTP/1.1 / СТАРТОВАЯ СТРОКА" /></g>
    <VersionIntro timeMs={timeMs} />
    <MessageAnatomy timeMs={timeMs} />
  </NarratedHttpScene>;
};

export default Composition;
