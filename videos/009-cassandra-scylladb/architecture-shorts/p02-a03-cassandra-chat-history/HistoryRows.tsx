import React from 'react';
import {easing, mix, progress, Sheet, v2Theme as ink} from '@channel/motion-v2';
import {messages} from '../../animations/p02-a03-chat-partition/scene';
import {cue} from './score';

const chat = 42;
const ordered = messages.filter(row => row.chat === chat);
const rowTop = 490;
const step = 192;
const height = 158;

function PageMarker({time}: {readonly time: number}) {
  const older = progress(time, cue.previous, cue.previous + 780, easing.transform);
  const y = rowTop + (time >= cue.result ? 0 : 2 * step * older);
  return <path d={`M99 ${y+5} h-23 v${step+height-10} h23`}
    fill="none" stroke={ink.primary} strokeWidth={10} strokeLinejoin="round"/>;
}

export function HistoryRows({time}: {readonly time: number}) {
  const dismissed = progress(time, cue.partition, cue.partition + 420, easing.transform);
  const grouped = progress(time, cue.partition + 420, cue.partition + 1100, easing.transform);
  const showPage = (time >= cue.latest && time < cue.clustering) || time >= cue.result;
  return <g>
    <text x={116} y={435} fontSize={48} fontWeight={650}>
      {time >= cue.result ? 'chat_id = 42  ·  LIMIT 2' : time >= cue.key ? 'chat_id = 42' :
        time >= cue.request ? 'Открыть чат 42' : 'Чат 42'}
    </text>
    {messages.map((row, index) => {
      const own = row.chat === chat;
      const slot = ordered.findIndex(item => item.id === row.id);
      const appear = index < 3 ? 1 : progress(time, cue.request+index*135, cue.request+index*135+350);
      const opacity = own ? appear : appear*(1-dismissed);
      if (opacity === 0) return null;
      const x = 117 + (own ? 0 : 70*dismissed);
      const y = rowTop + step * (own ? mix(index, slot, grouped) : index);
      const showClock = time >= cue.clock;
      const showId = time >= cue.tie;
      const inPage = time >= cue.result ? slot < 2 : time >= cue.previous ? slot >= 2 : slot < 2;
      const focus = showPage && !inPage ? 0.46 : 1;
      return <g key={row.id} opacity={opacity*focus}>
        <Sheet x={x} y={y} width={812} height={height}>
          <text x={35} y={time >= cue.partition+1100 && !showClock ? 99 : 76} fontSize={59} fontWeight={700}>{row.body}</text>
          {time < cue.partition+1100 && <text x={38} y={132} fontSize={39}
            fill={time >= cue.key && own ? ink.text : ink.muted}>чат {row.chat}   ·   id {row.id}</text>}
          {time >= cue.key && time < cue.partition && own &&
            <path d="M36 143 h120" stroke={ink.primary} strokeWidth={6}/>}
          {showClock && <text x={38} y={132} fontSize={43}>{row.clock}</text>}
          {showId && <text x={545} y={132} fontSize={43} fontWeight={650}>id {row.id}</text>}
          {showId && time < cue.result && slot < 2 &&
            <path d="M544 144 h135" stroke={ink.primary} strokeWidth={7}/>}
        </Sheet>
      </g>;
    })}
    {showPage && <PageMarker time={time}/>}
    {time >= cue.replicas && time < cue.history &&
      <text x={117} y={1380} fontSize={43}>Одна партиция → один набор реплик</text>}
    {showPage && time < cue.clustering && <text x={117} y={1380} fontSize={49}>
      {time < cue.previous ? 'Последние сообщения' : 'Предыдущая страница'}</text>}
    {time >= cue.clock && time < cue.result && <text x={117} y={1380} fontSize={47}>
      {time < cue.tie ? 'Сначала новые: sent_at ↓' : 'При равном времени: message_id ↓'}</text>}
  </g>;
}
