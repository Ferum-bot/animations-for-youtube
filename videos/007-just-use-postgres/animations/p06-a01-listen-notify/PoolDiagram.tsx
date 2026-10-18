import React from 'react';
import {poolTiming, reveal} from './timing';
import {accent, theme} from './ui';

/** Transaction pooling keeps the client connected but changes its server session. */
export const PoolDiagram: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const assignedA = reveal(timeMs, 300, 650) * (1 - reveal(timeMs, poolTiming.releaseMs, 600));
  const assignedB = reveal(timeMs, poolTiming.reassignMs, 650);
  const returning = reveal(timeMs, poolTiming.releaseMs, 600);
  const phase = timeMs < poolTiming.releaseMs ? 'Транзакция 1 → сессия A'
    : timeMs < poolTiming.reassignMs ? 'COMMIT → соединение снова свободно'
    : 'Транзакция 2 → уже другая сессия';
  return <>
    <div style={{fontSize: 32, color: timeMs < poolTiming.reassignMs ? accent : theme.signal, margin: '24px 0 8px'}}>{phase}</div>
    <svg viewBox="0 0 1160 410" style={{width: '100%', display: 'block'}} aria-label="PgBouncer возвращает серверное соединение в пул после транзакции и может назначить другую сессию">
      <text x={120} y={88} textAnchor="middle" fill={theme.muted} fontSize={23}>КЛИЕНТ</text>
      <rect x={0} y={150} width={240} height={120} fill="none" stroke={theme.line} strokeWidth={2} />
      <text x={120} y={220} textAnchor="middle" fill={theme.text} fontSize={32}>Подписчик</text>
      <path d="M 240 210 H 400" fill="none" stroke={accent} strokeWidth={3} />
      <text x={320} y={190} textAnchor="middle" fill={theme.muted} fontSize={20}>постоянно</text>
      <rect x={400} y={120} width={250} height={180} fill="none" stroke={theme.line} strokeWidth={2} />
      <text x={525} y={188} textAnchor="middle" fill={theme.text} fontSize={32}>PgBouncer</text>
      <text x={525} y={232} textAnchor="middle" fill={theme.muted} fontSize={25}>Пул соединений</text>
      <text x={1000} y={32} textAnchor="middle" fill={theme.muted} fontSize={23}>POSTGRESQL</text>
      {([
        {id: 'A', y: 60, opacity: assignedA, color: accent},
        {id: 'B', y: 250, opacity: assignedB, color: theme.signal},
      ] as const).map(session => <g key={session.id}>
        <path d={`M 650 210 L 860 ${session.y + 60}`} fill="none" stroke={theme.line} strokeWidth={2} strokeDasharray="6 9" />
        <path d={`M 650 210 L 860 ${session.y + 60}`} fill="none" stroke={session.color} strokeWidth={4} opacity={session.opacity} />
        <rect x={860} y={session.y} width={280} height={120} fill="none" stroke={theme.line} strokeWidth={2} />
        <rect x={860} y={session.y} width={280} height={120} fill="none" stroke={session.color} strokeWidth={3} opacity={session.opacity} />
        <circle cx={860} cy={session.y + 60} r={7} fill={session.color} opacity={session.opacity} />
        <text x={1000} y={session.y + 50} textAnchor="middle" fill={theme.text} fontSize={33}>Сессия {session.id}</text>
        <text x={1000} y={session.y + 88} textAnchor="middle" fill={theme.muted} fontSize={23}>
          {session.id === 'A' ? timeMs < poolTiming.releaseMs ? 'выдана клиенту' : 'снова в пуле' : timeMs < poolTiming.reassignMs ? 'свободна' : 'выдана клиенту'}
        </text>
      </g>)}
      {returning > 0 && returning < 1 ? <circle cx={860 - 210 * returning} cy={120 + 90 * returning} r={9} fill={accent} /> : null}
      <text x={0} y={395} fill={theme.muted} fontSize={27}>Клиент подключён. Серверная сессия за ним не закреплена.</text>
    </svg>
  </>;
};

export const FixedSessionDiagram: React.FC = () => <svg viewBox="0 0 1160 100" style={{display: 'block', width: '100%'}} aria-label="Постоянное соединение подписчика с одной сессией">
  <text x={0} y={60} fill={theme.text} fontSize={31}>Подписчик</text>
  <path d="M 200 50 H 820" fill="none" stroke={accent} strokeWidth={3} />
  <text x={510} y={35} textAnchor="middle" fill={accent} fontSize={25}>одно соединение на всё время подписки</text>
  <circle cx={820} cy={50} r={7} fill={accent} />
  <text x={850} y={60} fill={theme.text} fontSize={31}>Сессия A</text>
</svg>;
