import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {OzonTheme} from '../../shared/theme';
import {relativeTime} from './cues';

const rows = [
  {id: 'unit A', x: 208, caption: 'Другая транзакция'},
  {id: 'unit B', x: 735, caption: 'Свободна'},
  {id: 'unit C', x: 1262, caption: 'Свободна'},
] as const;

/** Illustrative rows of item 42, not a promise of selection order without ORDER BY. */
export const UnitRows: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => {
  const enter = smoothProgress(timeMs, relativeTime('skip-lock'), relativeTime('skip-lock') + 350);
  const skip = smoothProgress(timeMs, relativeTime('skip-skip'), relativeTime('skip-skip') + 650);
  const take = smoothProgress(timeMs, relativeTime('skip-limit') + 200, relativeTime('skip-limit') + 850);
  return <g opacity={enter} transform={`translate(0 ${12 * (1 - enter)})`}>
    <text x={208} y={790} fontSize={29} fill={theme.comment}>Строки товара 42 · пример выбора</text>
    {rows.map((row, index) => {
      const chosen = index === 1;
      const accent = chosen ? theme.syntax.string : theme.secondary;
      return <g key={row.id} transform={`translate(${row.x} 908)`}>
        <rect width={440} height={114} fill={theme.background} stroke={theme.line} strokeWidth={2} />
        <rect width={440} height={114} fill="none" stroke={accent} strokeWidth={3} opacity={chosen ? take : index === 0 ? 1 : 0} />
        <text x={28} y={47} fontFamily={theme.fontMono} fontSize={33} fill={theme.text}>{row.id}</text>
        <text x={28} y={87} fontSize={25} fill={chosen && take >= 0.5 ? accent : theme.comment}
          opacity={chosen ? Math.abs(2 * take - 1) : 1}>
          {chosen && take >= 0.5 ? 'Блокируем этой транзакцией' : row.caption}
        </text>
        {index === 0 ? <text x={0} y={165} fontSize={28} fill={theme.secondary} opacity={skip}>Пропускаем</text> : null}
        {chosen ? <text x={0} y={165} fontSize={28} fill={accent} opacity={take}>Выбрана 1 строка</text> : null}
      </g>;
    })}
    <path d="M 430 896 C 475 802 895 802 950 896 M 934 883 L 950 896 L 955 875"
      fill="none" stroke={theme.secondary} strokeWidth={2.5} strokeLinecap="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - skip} />
    <text x={208} y={1175} fontSize={25} fill={theme.comment}>Блокировка сохраняется до COMMIT или ROLLBACK.</text>
  </g>;
};
