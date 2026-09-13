import React from 'react';
import {HttpCode} from '../../shared/HttpCode';
import {MessageBrackets} from '../../shared/MessageBrackets';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {StartLines} from './StartLines';
import {cues} from './timing';

const headers = ['Host: api.example.com', 'Content-Type: application/json', 'Content-Length: 2'] as const;

/** A shallow editorial extrusion; depth is resolved before detailed reading begins. */
const MessageLayer: React.FC<{y: number; height: number; depth: number; opacity: number}> = ({y, height, depth, opacity}) => <g opacity={opacity}>
  <path d={`M 190 ${y + height} H 1204 V ${y} L ${1204 + depth} ${y - depth} V ${y + height + depth} H ${190 + depth} Z`}
    fill={theme.line} opacity={0.55} />
  <rect x={190} y={y} width={1014} height={height} fill={theme.surface} stroke={theme.line} strokeWidth={1.5} />
</g>;

export const MessageAnatomy: React.FC<{timeMs: number}> = ({timeMs}) => {
  const entrance = reveal(timeMs, cues.anatomy - 250, 600);
  const depth = reveal(timeMs, cues.anatomy, 650) * (1 - reveal(timeMs, cues.anatomy + 1750, 1000));
  const split = reveal(timeMs, cues.anatomy + 600, 900);
  const separator = reveal(timeMs, cues.separator, 600) * (1 - reveal(timeMs, cues.compare - 450, 450));
  const compare = reveal(timeMs, cues.compare, 500);
  const isolate = reveal(timeMs, cues.isolate, 750);
  const structureRemaining = 1 - reveal(timeMs, cues.isolate - 280, 280);
  const structureOpacity = structureRemaining * (1 - compare * 0.65);
  const blankLabel = (1 - reveal(timeMs, cues.separator, 220)) * (1 - compare);
  const boundaryLabel = reveal(timeMs, cues.separator + 250, 300) * (1 - reveal(timeMs, cues.compare - 450, 450));
  const label = (start: number): number => reveal(timeMs, start, 260);
  const marker = 88 + reveal(timeMs, cues.headers, 300) * 200 + reveal(timeMs, cues.blank, 300) * 170
    + reveal(timeMs, cues.body, 300) * 125 - separator * 125;
  return <g opacity={entrance}>
    <MessageBrackets x={136} y={400} width={1120} height={850} arm={80} markerY={marker * (1 - isolate) + isolate * 110} />
    <g transform={`matrix(1 ${depth * 0.025} ${-depth * 0.055} 1 ${depth * 30} ${-depth * 18})`}>
      <g opacity={(1 - isolate) * (1 - separator * 0.8)}>
        <MessageLayer y={444 - depth * 18} height={112} depth={depth * 18} opacity={0.7 * (1 - compare * 0.5)} />
      </g>
      <g opacity={structureOpacity}>
        <g opacity={1 - separator * 0.7} transform={`translate(0 ${(1 - split) * -55})`}>
          <MessageLayer y={585} height={230} depth={depth * 22} opacity={0.55} />
          <text x={212} y={622} fontSize={25} letterSpacing={1.5} fill={theme.primary} opacity={label(cues.headers)}>ЗАГОЛОВКИ</text>
          <HttpCode lines={headers} x={212} y={680} fontSize={39} lineHeight={56} />
        </g>
        <g transform={`translate(0 ${(1 - split) * -100 + separator * 28})`}>
          <MessageLayer y={970} height={160} depth={depth * 26} opacity={0.55 * (1 - separator * 0.5)} />
          <text x={212} y={1010} fontSize={25} letterSpacing={1.5} fill={theme.primary} opacity={label(cues.body)}>ТЕЛО · ЕСЛИ ЕСТЬ</text>
          <text x={212} y={1090} fontFamily={theme.fontMono} fontSize={63} fill={theme.text}>{'{}'}</text>
        </g>
        <g opacity={label(cues.blank)}>
          <path d="M 198 855 H 178 V 917 H 198" stroke={theme.primary} strokeWidth={3} fill="none" />
          <text x={735} y={891} fontSize={28} fill={theme.primary} opacity={blankLabel}>ПУСТАЯ СТРОКА</text>
        </g>
        <g opacity={boundaryLabel}>
          <text x={735} y={893} fontSize={30} fill={theme.primary}>Конец заголовков</text>
          <path d="M 212 940 H 650" stroke={theme.line} strokeWidth={2} />
        </g>
      </g>
      <g opacity={1 - separator * 0.78}><StartLines timeMs={timeMs} /></g>
    </g>
    <g opacity={compare * structureRemaining}>
      <path d="M 212 550 H 1165" stroke={theme.primary} strokeWidth={3} />
      <text x={212} y={1185} fontSize={32} fill={theme.text}>Запрос и ответ: различается стартовая строка</text>
    </g>
  </g>;
};
