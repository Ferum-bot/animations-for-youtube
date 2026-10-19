import React from 'react';
import {cues, reveal, type SceneProps} from './timing';
import {accent, Caption, Heading, Note, theme} from './ui';

const leafXs = [20, 370, 720, 1070] as const;
const Node: React.FC<{readonly x: number; readonly y: number; readonly width: number; readonly text: string; readonly active?: boolean}> = ({x, y, width, text, active}) => <g>
  <rect x={x} y={y} width={width} height={48} fill={theme.background} stroke={active ? accent : theme.line} strokeWidth={2} />
  <text x={x + width / 2} y={y + 31} textAnchor="middle" fill={active ? accent : theme.text} fontSize={23}>{text}</text>
</g>;
export const Btree: React.FC<SceneProps> = ({timeMs}) => {
  const descend = reveal(timeMs, cues.tree + 4000, 7000);
  const entries = reveal(timeMs, cues.tree + 9000);
  const scan = reveal(timeMs, cues.scan, 15000);
  const poisoned = reveal(timeMs, cues.blocked, 8500);
  const scanningBlocked = reveal(timeMs, cues.blocked + 8000, 10500);
  const activeIndex = Math.min(11, Math.floor(scan * 12));
  const currentIndex = timeMs >= cues.blocked ? Math.min(8, Math.floor(scanningBlocked * 9)) : activeIndex;
  const leafIndex = Math.floor(currentIndex / 3);
  const slot = currentIndex % 3;
  const healthy = timeMs >= cues.healthy && timeMs < cues.blocked;
  const blocked = timeMs >= cues.blocked;
  const eligible = Math.min(10, Math.max(0, activeIndex - 1));
  return <>
    <Heading title={blocked ? 'Спуск быстрый. Длинным становится обход.' : healthy ? 'Очистка успевает за очередью.' : 'Индекс ведёт к версии строки.'} kicker="JOBS_RUN_AT_IDX / B-TREE ПО RUN_AT" />
    <svg width={1400} height={505} viewBox="0 0 1400 505" style={{display: 'block', fontFamily: theme.fontMono}}>
      <path d="M700 58 V85 H355 V105 M700 85 H1045 V105" fill="none" stroke={theme.line} strokeWidth={3} />
      {leafXs.map((x, i) => <path key={x} d={`M${i < 2 ? 355 : 1045} 153 V180 H${x + 155} V216`}
        fill="none" stroke={theme.line} strokeWidth={3} />)}
      <path d="M700 58 V85 H355 V180 H175 V216" fill="none" stroke={accent} strokeWidth={3}
        pathLength={1} strokeDasharray="1" strokeDashoffset={1 - descend} />
      <Node x={600} y={10} width={200} text="корень" active={descend > 0} />
      <Node x={235} y={105} width={240} text="09:00…09:05" active={descend > .3} />
      <Node x={925} y={105} width={240} text="09:06…09:11" />
      {leafXs.map((x, li) => <g key={x}>
        <rect x={x} y={216} width={310} height={151} fill={theme.background} stroke={li === leafIndex && scan > 0 ? accent : theme.line} strokeWidth={2} />
        {[0, 1, 2].map(si => {
          const i = li * 3 + si;
          const stale = blocked && i < Math.floor(poisoned * 9);
          return <g key={si} opacity={entries}>
            {si > 0 ? <line x1={x} x2={x + 310} y1={216 + si * 50} y2={216 + si * 50} stroke={theme.line} /> : null}
            <text x={x + 16} y={249 + si * 50} fontSize={22} fill={stale ? theme.muted : theme.text}>
              09:{String(i).padStart(2, '0')} → ({i + 2},1)
            </text>
            {stale ? <line x1={x + 13} x2={x + 285} y1={242 + si * 50} y2={242 + si * 50} stroke={theme.signal} opacity={.65} /> : null}
          </g>;
        })}
        {li < 3 ? <><path d={`M${x + 310} 292 H${x + 342} m-8 -7 l8 7 -8 7`} fill="none" stroke={theme.line} strokeWidth={2} /></> : null}
      </g>)}
      <path d={`M${(leafXs[leafIndex] ?? leafXs[0]) + 300} ${242 + slot * 50} H${(leafXs[leafIndex] ?? leafXs[0]) + 320} V432 H700 V454`} fill="none" stroke={accent} strokeWidth={2}
        opacity={scan > 0 ? .75 : 0} />
      <rect x={365} y={455} width={670} height={48} fill={theme.background} stroke={blocked ? theme.signal : accent} strokeWidth={2} opacity={scan} />
      <text x={700} y={486} textAnchor="middle" fontSize={23} fill={blocked ? theme.signal : theme.text} opacity={scan}>
        {blocked ? `heap (${currentIndex + 2},1): старая версия → пропустить` : activeIndex === 0 ? 'heap (2,1): locked → SKIP LOCKED' : activeIndex === 1 ? "heap (3,1): state ≠ ready → пропустить" : `heap (${activeIndex + 2},1): видима · ready · свободна`}
      </text>
    </svg>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26}}>
      <div><Caption>{blocked ? 'ГОРИЗОНТ УДЕРЖИВАЕТ ДОЛГАЯ ТРАНЗАКЦИЯ' : 'ЛИСТ: RUN_AT → ССЫЛКА НА СТРОКУ (HEAP)'}</Caption>
        <div style={{marginTop: 12}}><Note>{blocked ? 'Старые ссылки остаются. Проверки heap продолжаются →' : healthy ? 'VACUUM удаляет ненужные версии и индексные ссылки.' : 'Каждую найденную запись проверяем в таблице.'}</Note></div>
      </div>
      <div style={{opacity: scan, fontFamily: theme.fontMono, fontSize: 42, color: blocked ? theme.signal : accent}}>
        {blocked ? 'scan → → →' : `${eligible} / 10`}
      </div>
    </div>
  </>;
};
