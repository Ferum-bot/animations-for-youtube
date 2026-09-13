import React from 'react';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {cue, framingScenes} from '../../shared/framing/timing';
import {reveal, shotOpacity, useTimeMs} from '../../shared/timing';
import {ConflictingLengths, ChooseFraming} from './Explanations';

const choice = cue('choice', 'p06-choice');
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...framingScenes.choice}>
    <g opacity={shotOpacity(timeMs, 0, choice)}><HttpSceneHeading title="ДВЕ ИНСТРУКЦИИ СРАЗУ?" eyebrow="HTTP/1.1 / КОНФЛИКТ РАЗМЕТКИ" fontSize={66} /></g>
    <g opacity={reveal(timeMs, choice)}><HttpSceneHeading title="ВЫБРАТЬ СПОСОБ ПЕРЕДАЧИ" eyebrow="HTTP/1.1 / ГРАНИЦЫ ТЕЛА" fontSize={61} /></g>
    <DiagramFrame timeMs={timeMs} />
    <ConflictingLengths timeMs={timeMs} />
    <ChooseFraming timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
