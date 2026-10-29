import React from 'react';
import {interpolateColors} from 'remotion';
import {codeTheme as theme} from '../../shared/code-theme';
import {budget, secondsLabel, upperTotalMs} from './budget';
import type {BudgetState} from './cues';
import {budgetLayout as layout, emphasizedFontSize as grow} from './layout';

const bar = {x: 48, y: 62, width: layout.width - 96, height: 66};
const typicalWidth = bar.width * budget.typicalMs / budget.limitMs;

export function BudgetScale({focus}: Pick<BudgetState, 'focus'>) {
  return <g transform={`translate(0 ${layout.bodyBottom})`}>
    <text x={48} y={38} fontSize={grow(30, focus('goal'))} fill={theme.keyword}>Цель: 5 с</text>
    <text x={700} y={38} fontSize={30} fill={theme.keyword} opacity={focus('retry')}>
      1 ретрай · backoff ≈ 2 с
    </text>
    <text x={1160} y={38} fontSize={30} fill={theme.keyword} opacity={focus('fallback')}>→ другой канал</text>
    <rect {...bar} fill={interpolateColors(focus('reserve'), [0, 1], [theme.gutter, theme.selection])} />
    <rect x={bar.x} y={bar.y} width={typicalWidth} height={bar.height}
      fill={interpolateColors(focus('normal'), [0, 1], [theme.surface, theme.selection])} />
    <rect {...bar} fill="none" stroke={theme.line} strokeWidth={2} />
    <path d={`M ${bar.x + typicalWidth} ${bar.y} V ${bar.y + bar.height}`} stroke={theme.line} strokeWidth={2} />
    <text x={bar.x + 24} y={105} fontSize={grow(30, focus('normal'))} fill={theme.keyword}>
      В норме ≤{secondsLabel(budget.typicalMs)} с
    </text>
    <text x={bar.x + typicalWidth + 32} y={105} fontSize={grow(30, focus('reserve'))} fill={theme.keyword}>
      Запас ≈ {secondsLabel(budget.limitMs - budget.typicalMs)} с
    </text>
    <text x={48} y={171} fontSize={25} fill={theme.comment}>
      Сумма верхних оценок этапов — {secondsLabel(upperTotalMs)} с; типовой итог из рассказа — до 1,5 с
    </text>
  </g>;
}
