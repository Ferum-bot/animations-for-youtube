import React from 'react';
import {easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {Book, Posting, Ticket} from './Paper';
import {Title} from '../../shared/architecture/Title';
import {beforeSplit, shardRow, splitCommit, t, waiting, type Chat, type SceneProps} from './scene';

const groupX = 1040;
const lanes = [{chat:42,y:390},{chat:17,y:900}] as const;
const newBook = t.separate + 760;
const transferred = newBook + 1380;
const Lane: React.FC<SceneProps & {readonly chat: Chat; readonly y: number}> = ({timeMs,chat,y}) => {
  const first = chat === 42;
  const bookY = first ? mix(596, y, progress(timeMs, t.separate, newBook, easing.transform)) : y;
  const row = shardRow(chat,timeMs);
  const entries = timeMs >= transferred ? [row] : first ? [beforeSplit(42), beforeSplit(17)] : [];
  const copies = timeMs >= t.copy;
  const backlog = waiting(chat);
  const completed = backlog.filter((_, index) => timeMs >= splitCommit(index)).length;
  const route: Route = {from:{x:groupX+528,y:y+134},via:{x:1685,y:y+134},to:{x:1840,y:y+134}};
  return <g>
    {copies && <g>
      <RouteLine route={route} />
      <Book x={1840} y={y+22} scale={0.84} label="standby" entries={timeMs >= t.copy+1050 ? [row] : []} />
      <Delivery timeMs={timeMs} route={route} start={t.copy} duration={1050} />
    </g>}
    {(first || timeMs >= newBook) && <Book x={groupX} y={bookY}
      label={timeMs < newBook ? 'primary' : first ? 'primary A' : 'primary B'}
      entries={entries} />}
    {!first && <Posting entry={beforeSplit(17)} timeMs={timeMs} start={newBook} end={transferred}
      x={groupX + 275} y={662} toX={groupX + 285} toY={y + 38} />}
    {backlog.map((w,i) => {
      const end = splitCommit(i), start = end-1100;
      if (timeMs >= end) return null;
      const remainBefore = i - completed;
      const ticketY = y - 20 + remainBefore * 107;
      return timeMs < start ? <Ticket key={w.arrives} x={170} y={ticketY} entry={w} /> :
        <Posting key={w.arrives} entry={w} timeMs={timeMs} start={start} end={end}
          x={170} y={y-20} toX={groupX+100} toY={y+85} />;
    })}
  </g>;
};

export const Groups: React.FC<SceneProps> = ({timeMs}) => {
  const heading = headings.find(cue => timeMs >= cue.start)?.text ?? 'Два потока записи';
  const settle = progress(timeMs, splitCommit(2), splitCommit(2) + 430);
  return <g>
    <Title>{heading}</Title>
    {lanes.map(lane=><Lane key={lane.chat} {...lane} timeMs={timeMs} />)}
    {timeMs >= t.named && <g fontSize={51} fill={ink.text}>
      <text x={180} y={mix(324,535,settle)}>чат 42 → A</text>
      <text x={180} y={mix(832,1045,settle)}>чат 17 → B</text>
    </g>}
  </g>;
};

const headings = [
  {start: t.combine, text: 'Шарды с репликами'},
  {start: t.compare, text: 'Шардинг и репликация'},
  {start: t.horizontal, text: 'Горизонтальное партиционирование'},
  {start: t.named, text: 'Шардинг'},
] as const;
