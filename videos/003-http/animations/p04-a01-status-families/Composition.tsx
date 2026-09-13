import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {DiagramFrame} from '../../shared/HttpDiagram';
import {shotOpacity, statusScenes} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {useTimeMs} from '../../shared/timing';
import {FamilyRail} from './FamilyRail';
import {BasicResponses, RedirectAndCache} from './Examples';
import {Errors} from './Errors';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  return <NarratedHttpScene {...props} {...statusScenes.families}>
    <HttpSceneHeading title="КОДЫ СОСТОЯНИЯ" eyebrow="HTTP / ПЯТЬ СЕМЕЙСТВ" />
    <DiagramFrame timeMs={timeMs} />
    <g opacity={shotOpacity(timeMs, 0, 3000)}>
      <text x={212} y={695} fontFamily={theme.fontMono} fontSize={44} fill={theme.muted}>HTTP/1.1</text>
      <text x={212} y={920} fontFamily={theme.fontMono} fontSize={180} fill={theme.primary}>200</text>
      <text x={630} y={920} fontFamily={theme.fontMono} fontSize={60} fill={theme.text}>OK</text>
    </g>
    <FamilyRail timeMs={timeMs} />
    <g opacity={shotOpacity(timeMs, 3100, 5500)}>
      <text x={570} y={720} fontSize={54} fontWeight={600} fill={theme.text}>Первая цифра</text>
      <text x={570} y={795} fontSize={39} fill={theme.muted}>определяет группу</text>
    </g>
    <BasicResponses timeMs={timeMs} />
    <RedirectAndCache timeMs={timeMs} />
    <Errors timeMs={timeMs} />
  </NarratedHttpScene>;
};
export default Composition;
