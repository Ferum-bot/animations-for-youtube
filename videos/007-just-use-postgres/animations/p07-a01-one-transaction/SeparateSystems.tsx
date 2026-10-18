import React from 'react';
import {cues, reveal} from './timing';
import {accent, Caption, theme} from './ui';

export const SeparateSystems: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const committed = reveal(timeMs, cues.databaseCommitMs);
  const failure = reveal(timeMs, cues.deliveryFailureMs);
  const send = reveal(timeMs, cues.gapMs + 1300, 1100);
  return <>
    <Caption>ДВА НЕЗАВИСИМЫХ ДЕЙСТВИЯ ПРИЛОЖЕНИЯ</Caption>
    <svg viewBox="0 0 1400 480" style={{width: '100%', display: 'block', marginTop: 10}} aria-label="Приложение сохраняет заказ в PostgreSQL, но сообщение не доходит до брокера">
      <path d="M 420 220 H 620 V 90 H 870" fill="none" stroke={theme.line} strokeWidth={3} />
      <path d="M 420 220 H 620 V 90 H 870" fill="none" stroke={accent} strokeWidth={4} opacity={committed} />
      <path d="M 420 220 H 620 V 400 H 870" fill="none" stroke={theme.line} strokeWidth={3} strokeDasharray="8 10" />
      <path d="M 420 220 H 620 V 400 H 745" fill="none" stroke={theme.signal} strokeWidth={4} opacity={failure} />
      <rect x={80} y={140} width={340} height={160} stroke={theme.line} strokeWidth={2} fill={theme.background} />
      <text x={250} y={232} textAnchor="middle" fontSize={37} fill={theme.text}>Приложение</text>
      <rect x={870} y={20} width={450} height={140} stroke={accent} strokeWidth={2} fill="none" />
      <text x={1095} y={78} textAnchor="middle" fontSize={36} fill={theme.text}>PostgreSQL</text>
      <text x={1095} y={122} textAnchor="middle" fontSize={27} fill={accent} opacity={committed}>Заказ сохранён</text>
      <text x={650} y={64} fontFamily={theme.fontMono} fontSize={25} fill={accent} opacity={committed}>COMMIT</text>
      <rect x={870} y={330} width={450} height={140} stroke={theme.line} strokeWidth={2} fill="none" />
      <text x={1095} y={388} textAnchor="middle" fontSize={36} fill={theme.text}>Брокер</text>
      <text x={1095} y={432} textAnchor="middle" fontSize={27} fill={theme.signal} opacity={failure}>Сообщение не получено</text>
      {send > 0 && send < 1 ? <rect x={620 + 140 * send - 9} y={391} width={18} height={18} fill={accent} /> : null}
      <g opacity={failure} stroke={theme.signal} strokeWidth={5}>
        <path d="M 747 387 L 773 413 M 747 413 L 773 387" />
      </g>
    </svg>
    <div style={{fontSize: 35, color: theme.signal, opacity: failure, marginTop: 15}}>COMMIT в базе не гарантирует доставку в брокер.</div>
  </>;
};
