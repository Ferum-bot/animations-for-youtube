import React from 'react';
import {agendaDurationMs, agendaItems, agendaStartMs, agendaStates} from '../../shared/agendaContent';
import {HttpStage, type PreviewBackground} from '../../shared/HttpStage';
import {MessageBrackets} from '../../shared/MessageBrackets';
import {ProtocolDetail} from '../../shared/ProtocolDetail';
import {httpLayout, httpTheme as theme} from '../../shared/theme';
import {activeStateIndex, reveal, useTimeMs, visibility} from '../../shared/timing';

export const Agenda: React.FC<{previewBackground?: PreviewBackground}> = ({previewBackground}) => {
  const timeMs = useTimeMs();
  const activeIndex = activeStateIndex(agendaStates, timeMs);
  const state = agendaStates[activeIndex];
  const previous = agendaStates[activeIndex - 1];
  const row = agendaItems[state?.row ?? 0];
  const previousRow = agendaItems[previous?.row ?? 0];
  const blend = reveal(timeMs, state?.startMs ?? 0, 350);
  const markerY = (previousRow?.y ?? 476) + ((row?.y ?? 476) - (previousRow?.y ?? 476)) * blend;
  const {agendaLeft: left, agendaRight: right, agendaTop: top, agendaBottom: bottom} = httpLayout;

  return (
    <HttpStage surface="presenter-side" opacity={visibility(timeMs, agendaDurationMs)} previewBackground={previewBackground}>
      <g transform={`translate(${(1 - reveal(timeMs, 0, 380)) * -24} 0)`}>
        <text x={left} y={282} fontSize={84} fontWeight={700} letterSpacing={-1.7} fill={theme.text}>
          В ЭТОМ ВИДЕО
        </text>
        <MessageBrackets x={left} y={top} width={right - left} height={bottom - top}
          markerY={markerY - top - 35} arm={80} opacity={reveal(timeMs, 180, 440)} />
        {agendaItems.map((item, index) => {
          const enter = reveal(timeMs, item.spokenAtMs - agendaStartMs - 180, 330);
          const active = state?.row === index;
          const focus = active ? 0.72 + 0.28 * blend : 0.72;
          return (
            <g key={item.spokenAtMs} opacity={enter} transform={`translate(0 ${(1 - enter) * 14})`}>
              <text x={210} y={item.y} fontFamily={theme.fontMono} fontSize={42} fill={theme.primary}>
                {String(index + 1).padStart(2, '0')}
              </text>
              <text x={326} y={item.y} fontSize={62} fontWeight={600} letterSpacing={-1.05}
                fill={theme.text} opacity={focus}>
                {item.lines.map((line, lineIndex) => <tspan key={line} x={326} dy={lineIndex === 0 ? 0 : 76}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
        {agendaStates.map((detail, index) => {
          const next = agendaStates[index + 1];
          const enter = reveal(timeMs, detail.startMs + 180, 350);
          const leave = next ? 1 - reveal(timeMs, next.startMs, 180) : 1;
          return <g key={detail.startMs} transform="translate(260 1090) scale(1.22)"
            opacity={enter * leave}>
            <ProtocolDetail kind={detail.detail} elapsedMs={timeMs - detail.startMs - 180} />
          </g>;
        })}
      </g>
    </HttpStage>
  );
};
