import React from 'react';
import {MessageBrackets} from '../../shared/MessageBrackets';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {cues} from './timing';

export const VersionIntro: React.FC<{timeMs: number}> = ({timeMs}) => {
  const focus = reveal(timeMs, cues.version - 180, 380);
  return <g opacity={1 - reveal(timeMs, cues.anatomy - 650, 500)}>
    <MessageBrackets x={136} y={465} width={1120} height={440} markerY={175} opacity={reveal(timeMs, 350, 500)} />
    <text x={690} y={731} textAnchor="middle" fontFamily={theme.fontMono} fontSize={148} fontWeight={700} fill={theme.text}>
      HTTP/<tspan fill={focus > 0.5 ? theme.primary : theme.text}>1.1</tspan>
    </text>
    <path d="M 815 770 H 1027" stroke={theme.primary} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - focus} />
    <g opacity={reveal(timeMs, cues.later + 150, 450)}>
      <text x={212} y={1045} fontSize={29} fill={theme.muted}>ДАЛЬШЕ В ВИДЕО</text>
      <text x={700} y={1045} fontSize={38} fontFamily={theme.fontMono} fill={theme.muted}>HTTP/2</text>
      <text x={1010} y={1045} fontSize={38} fontFamily={theme.fontMono} fill={theme.muted}>HTTP/3</text>
    </g>
  </g>;
};
