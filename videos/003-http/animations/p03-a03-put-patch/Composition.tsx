import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {DiagramFrame, Label, TimedCopy} from '../../shared/HttpDiagram';
import {cue, methodScenes} from '../../shared/methods/timing';
import {httpTheme as theme} from '../../shared/theme';
import {reveal, useTimeMs} from '../../shared/timing';
import {ProfileRepresentation} from './ProfileRepresentation';
const representation = cue('putPatch', 'p03-representation'), repeat = cue('putPatch', 'p03-put-repeat');
const patch = cue('putPatch', 'p03-patch-instructions');
const applications = [representation + 600, repeat, repeat + 1000] as const;
const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const patchMode = reveal(timeMs, patch, 400);
  const count = applications.filter(at => timeMs >= at + 500).length;
  return <NarratedHttpScene {...props} {...methodScenes.putPatch}>
    <HttpSceneHeading title="PUT И PATCH" eyebrow="HTTP / СОСТОЯНИЕ И ИЗМЕНЕНИЕ" />
    <DiagramFrame timeMs={timeMs} />
    <text x={212} y={525} fontFamily={theme.fontMono} fontSize={76} fill={theme.primary}>PUT</text>
    <text x={835} y={525} fontFamily={theme.fontMono} fontSize={76} fill={patchMode > 0.5 ? theme.primary : theme.muted}>PATCH</text>
    <TimedCopy
      timeMs={timeMs}
      states={[{startMs: cue('putPatch', 'p03-put-focus'), text: 'Идемпотентный метод'}, {startMs: patch, text: 'Инструкции изменения ресурса'}]}
      x={212}
      y={602}
      fontSize={34} />
    <g opacity={reveal(timeMs, representation - 500, 400)}>
      <Label x={212} y={716}>PROFILE / 42</Label>
      <ProfileRepresentation
        name={count === 0 ? 'Ivan' : 'Anna'}
        city={<TimedCopy
          timeMs={timeMs}
          states={[{startMs: 0, text: 'Tver'}, {startMs: representation + 1100, text: 'Moscow'}, {startMs: patch + 750, text: 'Kazan'}]}
          x={435}
          y={941}
          fontSize={46} />} />
      {applications.map((at) => <g
        key={at}
        opacity={reveal(timeMs, at, 150) * (1 - reveal(timeMs, at + 520, 220))}
        transform={`translate(${(1 - reveal(timeMs, at, 600)) * -22} ${(1 - reveal(timeMs, at, 600)) * -78})`}>
        <ProfileRepresentation name="Anna" city="Moscow" incoming />
      </g>)}
      <g opacity={1 - patchMode}>
        <text x={212} y={1120} fontSize={32} fill={theme.muted}>Применений: <tspan fill={theme.primary}>{count}</tspan>
        </text>
        <TimedCopy
          timeMs={timeMs}
          states={[{startMs: representation + 1100, text: 'Новое состояние'}, {startMs: repeat + 500, text: 'Состояние одинаковое'}]}
          x={680}
          y={1120}
          fontSize={32} />
      </g>
      <g opacity={reveal(timeMs, patch + 450, 300)}>
        <path d="M 229 883 V 970" stroke={theme.primary} strokeWidth={5} />
        <text x={252} y={1110} fontFamily={theme.fontMono} fontSize={29} fill={theme.primary}>replace /city → Kazan</text>
      </g>
    </g>
    <TimedCopy
      timeMs={timeMs}
      states={[
        {startMs: representation, text: 'PUT передаёт целевое представление'},
        {startMs: patch + 500, text: 'PATCH может быть идемпотентным: зависит от операции'}
      ]}
      x={212}
      y={1220}
      fontSize={27} />
  </NarratedHttpScene>;
};
export default Composition;
