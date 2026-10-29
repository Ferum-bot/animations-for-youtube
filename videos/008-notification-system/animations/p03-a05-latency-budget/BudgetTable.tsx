import React from 'react';
import {codeTheme as theme} from '../../shared/code-theme';
import {providerObservation, stages} from './budget';
import type {BudgetState} from './cues';
import {BudgetScale} from './BudgetScale';
import {budgetLayout as layout, emphasizedFontSize as grow} from './layout';

function Notes({lines, opacity = 1, strength = 0}: {
  readonly lines: readonly string[]; readonly opacity?: number; readonly strength?: number;
}) {
  return <g opacity={opacity} fill={theme.comment}>
    {lines.map((line, index) => <text key={line} x={layout.notesX} y={35 + index * 37}
      fontSize={grow(24, strength)}>{line}</text>)}
  </g>;
}

export function BudgetTable({state}: {readonly state: BudgetState}) {
  const l = layout;
  return <g transform={`translate(${l.x} ${l.y})`} fontFamily={theme.fontMono}>
    <rect width={l.width} height={l.height} fill={theme.surface} />
    <g fontSize={30} fill={theme.text}>
      <text x={l.labelX} y={52}>Этап</text>
      <text x={l.valueX} y={52}>Бюджет</text>
      <text x={l.notesX} y={52}>Пояснение</text>
    </g>
    {stages.map((stage, index) => {
      const strength = state.focus(stage.id);
      return <g key={stage.id} transform={`translate(0 ${l.header + index * l.row})`}>
        <rect x={2} y={1} width={l.width - 4} height={l.row - 2} fill={theme.selection} opacity={strength} />
        <text x={l.labelX} y={58} fontSize={grow(32, strength)} fill={theme.text}>{stage.label}</text>
        <text x={l.valueX} y={58} fontSize={grow(34, strength)} fill={theme.keyword}>{stage.value}</text>
        {stage.id === 'provider' ? <>
          <Notes lines={stage.notes} opacity={state.earlierNoteOpacity} />
          <Notes lines={providerObservation} opacity={state.laterNoteOpacity} />
        </> : <Notes lines={stage.notes} strength={stage.id === 'ingest' ? state.focus('ingestNote') : 0} />}
      </g>;
    })}
    <g stroke={theme.divider} strokeWidth={2}>
      <path d={`M 800 0 V ${l.bodyBottom} M 1140 0 V ${l.bodyBottom}`} />
      {Array.from({length: stages.length + 1}, (_, index) => <path key={index}
        d={`M 0 ${l.header + index * l.row} H ${l.width}`} />)}
    </g>
    <BudgetScale focus={state.focus} />
    <rect width={l.width} height={l.height} fill="none" stroke={theme.line} strokeWidth={4} />
  </g>;
}
