import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import type {OzonTheme} from '../../shared/theme';
import {DiagramArrow, DiagramNode} from '../../shared/expiry/Diagram';
import {relativeTime} from './cues';

export const SweepFlow: React.FC<{readonly timeMs: number; readonly theme: OzonTheme}> = ({timeMs, theme}) => {
  const enter = smoothProgress(timeMs, relativeTime('sweeper-held'), relativeTime('sweeper-held') + 400);
  const expired = smoothProgress(timeMs, relativeTime('sweeper-deadline') + 500, relativeTime('sweeper-deadline') + 1000);
  const returned = smoothProgress(timeMs, relativeTime('sweeper-redis'), relativeTime('sweeper-redis') + 750);
  return <g opacity={enter}>
    <text x={208} y={800} fontSize={29} fill={theme.comment}>Одна из броней, подходящих под WHERE</text>
    <DiagramNode x={208} y={900} width={400} title="HELD" subtitle="Срок брони уже истёк" theme={theme} accent={theme.secondary} />
    <DiagramArrow x1={626} x2={740} y={956} progress={expired} theme={theme} />
    <DiagramNode x={760} y={900} width={400} title="EXPIRED" subtitle="Переход выполнен в БД" theme={theme} opacity={expired} accent={theme.secondary} />
    <DiagramArrow x1={1178} x2={1300} y={956} progress={returned} theme={theme} />
    <DiagramNode x={1320} y={900} width={400} title="Redis" subtitle="+1 на эту резервацию" theme={theme} opacity={returned} accent={theme.syntax.string} />
    <text x={208} y={1100} fontSize={29} fill={theme.text} opacity={expired}>Не трогаем CONFIRMED и уже обработанные брони.</text>
    <text x={208} y={1160} fontSize={25} fill={theme.comment} opacity={returned}>Возврат остатка выполняется отдельно и допускает безопасный повтор.</text>
  </g>;
};
