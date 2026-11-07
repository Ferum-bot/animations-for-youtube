import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Bubble, Delivery, Ledger, Note, Reader, RouteLine, type Route} from './Drawing';
import {timing as t, type SceneProps} from './scene';

const write: Route = {from: {x: 714, y: 790}, via: {x: 850, y: 790}, to: {x: 1010, y: 790}};
const read: Route = {from: {x: 1543, y: 790}, via: {x: 1690, y: 790}, to: {x: 1826, y: 790}};

export const Messenger: React.FC<SceneProps> = ({timeMs}) => {
  const opened = timeMs >= t.open + 1050;
  const tally = [t.open, ...t.workloadReads].filter(start => timeMs >= start + 1050).length;
  return <g>
    <Reader x={463} y={385} name="Маша" scale={1.2} />
    <Reader x={2085} y={385} name="Илья" scale={1.2} />
    <Bubble x={192} y={641} value="office" scale={1.58} />
    <Ledger x={1010} y={650} role="История чата" value={timeMs >= t.send + 1050 ? 'office' : 'question'} />
    <RouteLine route={write} /><Delivery route={write} timeMs={timeMs} start={t.send} />
    {timeMs >= t.open ? <RouteLine route={read} /> : null}
    {[t.open, ...t.workloadReads].map(start =>
      <Delivery key={start} route={read} timeMs={timeMs} start={start} kind="read" />)}
    {opened ? <Bubble x={1835} y={641} value="office" scale={1.58} /> : null}
    {timeMs >= t.traffic ? <g>
      <Note x={470} y={1130}>запись · write</Note><Note x={2090} y={1130}>чтение · read</Note>
      <g stroke={ink.primary} strokeWidth={11} strokeLinecap="round">
        <path d="M465 1180 l-3 40" />
        {Array.from({length: tally}, (_, i) => <path key={i} d={`M${2033 + i * 38} 1180 l-3 40`} />)}
      </g>
    </g> : null}
  </g>;
};
