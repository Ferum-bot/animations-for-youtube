import React from 'react';
import {Sheet, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {oldBody, newBody} from '../../shared/architecture/chat107';
import {RangeComparison} from './RangeComparison';
import {cue} from './score';

const toReplica: Route = {from: {x: 808, y: 1095}, via: {x: 938, y: 852}, to: {x: 645, y: 677}};

function Exchange({time, reading}: {readonly time: number; readonly reading: boolean}) {
  const start = reading ? cue.sendFix : cue.replay;
  const end = reading ? cue.fixed : cue.delivered;
  const visible = time >= (reading ? cue.mismatch : cue.store);
  let status = 'C пропустила правку';
  if (reading) {
    status = 'Если C всё ещё отстаёт';
    if (visible) status = 'При чтении версии разошлись';
    if (time >= end) status = 'Строка № 107 исправлена';
    if (time >= cue.scope) status = 'Исправлены данные этого чтения';
  } else {
    if (visible) status = 'Координатор сохранил hint';
    if (time >= cue.reconnect) status = 'C снова на связи';
    if (time >= end) status = 'Правка доставлена';
    if (time >= cue.bestEffort) status = 'Доставка возможна, пока есть hint';
  }
  return <g>
    {visible && time < end && <g>
      {time >= start && <g>
        <RouteLine route={toReplica}/>
        <Delivery route={toReplica} timeMs={time} start={start} duration={end-start}/>
      </g>}
      <text x={80} y={1032} fontSize={47}>У координатора</text>
      <Sheet x={80} y={1090} width={795} height={141}>
        <text x={38} y={88} fontSize={53} fontWeight={670}>{reading ? 'Для C' : 'Hint для C'} · «{newBody}»</text>
      </Sheet>
    </g>}
    <text x={80} y={1395} fontSize={49} fontWeight={640}>{status}</text>
  </g>;
}

export function Recovery({time}: {readonly time: number}) {
  const range = time >= cue.repair;
  const reading = time >= cue.read && !range;
  const corrected = time >= (range ? cue.synced : reading ? cue.fixed : cue.delivered);
  const offline = time < cue.reconnect;
  return <g>
    <text x={80} y={419} fontSize={51} fontWeight={640}>{reading ? 'Читаем № 107 · BLOCKING' : 'Чат 42 · сообщение № 107'}</text>
    {['B','C'].map((host,i) => <g key={host} transform={`translate(80 ${565 + 136*i})`}>
      <text fontSize={67} fontWeight={730}>{host}</text>
      <text x={115} fontSize={58} fontWeight={630}>{i === 0 || corrected ? newBody : oldBody}</text>
      {i === 1 && offline && <text x={632} fontSize={39} fill={ink.muted}>нет связи</text>}
    </g>)}
    {range && time >= cue.stream && time < cue.synced && <Delivery
      route={{from: {x: 690, y: 548}, via: {x: 850, y: 630}, to: {x: 645, y: 678}}}
      timeMs={time} start={cue.stream} duration={cue.synced - cue.stream}/>}
    {range && time >= cue.ranges ? <RangeComparison time={time}/> :
      range ? <text x={80} y={1032} fontSize={49}>Если эту строку никто не читал</text> :
      <Exchange reading={reading} time={time}/>}
  </g>;
}
