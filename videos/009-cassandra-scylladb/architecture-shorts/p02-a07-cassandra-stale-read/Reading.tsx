import React from 'react';
import {Sheet, progress, v2Theme as ink} from '@channel/motion-v2';
import {newBody, oldBody, replicas, type Replica} from '../../shared/architecture/chat107';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {cue} from './score';

const throughC: Route = {from: {x: 845, y: 609}, via: {x: 938, y: 977}, to: {x: 628, y: 997}};
const writtenAt = {A: cue.writeA, B: cue.writeB, C: Infinity} satisfies Record<Replica, number>;

function Edit({time}: {readonly time: number}) {
  const reading = time >= cue.read;
  const answered = time >= cue.oldReply;
  let body = newBody;
  if (reading) body = answered ? oldBody : 'Прочитать № 107';
  return <g>
    <text x={80} y={423} fontSize={48}>{reading ? 'Приложение · чтение с ONE' : 'Правка сообщения № 107'}</text>
    <Sheet x={80} y={467} width={800} height={145}>
      <text x={35} y={96} fontSize={67} fontWeight={710}>{body}</text>
    </Sheet>
    {time >= cue.askC && <g>
      <RouteLine route={throughC}/>
      <Delivery route={throughC} timeMs={time} start={cue.askC} duration={850} kind="read"/>
      <Delivery route={{from: throughC.to, via: throughC.via, to: throughC.from}} timeMs={time} start={cue.oldReply - 900} duration={900}/>
    </g>}
    {replicas.map((host, i) => {
      const y = 757 + i * 128;
      const offline = host === 'C' && time < cue.reconnect;
      const picked = host === 'C' && time >= cue.askC;
      return <g key={host} opacity={offline ? 0.58 : 1}>
        <text x={90} y={y} fontSize={68} fontWeight={740}>{host}</text>
        <text x={204} y={y} fontSize={55}>{time >= writtenAt[host] ? newBody : oldBody}</text>
        {offline && <text x={659} y={y} fontSize={37} fill={ink.muted}>нет связи</text>}
        {picked && <path d={`M207 ${y + 26} H606`} strokeWidth={9} stroke={ink.primary}
          pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress(time, cue.askC, cue.askC + 440)}/>}
      </g>;
    })}
    <text x={80} y={1310} fontSize={54} fontWeight={640}>
      {answered ? 'Клиент увидел старый текст' : reading ? 'Достаточно одного ответа' :
        time >= cue.writeOK ? 'QUORUM · запись подтверждена' : 'Три реплики чата 42'}
    </text>
  </g>;
}

const pairs = [
  {at: cue.pairs, read: ['A', 'B']},
  {at: cue.ac, read: ['A', 'C']},
  {at: cue.bc, read: ['B', 'C']},
] as const satisfies readonly {at: number; read: readonly Replica[]}[];

function Intersection({time}: {readonly time: number}) {
  const read: readonly Replica[] = pairs.reduce((last, pair) => time >= pair.at ? pair : last, pairs[0]).read;
  const selected = time >= cue.pairs;
  const common = read.filter(host => host !== 'C');
  return <g>
    <text x={80} y={480} fontSize={55} fontWeight={650}>Сообщение № 107</text>
    <text x={80} y={766} fontSize={48}>Записали</text>
    <text x={80} y={1006} fontSize={48}>Читаем</text>
    {replicas.map((host, i) => {
      const x = 436 + i * 203;
      const wrote = host !== 'C';
      const reading = selected && read.includes(host);
      return <g key={host} textAnchor="middle">
        <text x={x} y={621} fontSize={69} fontWeight={720}>{host}</text>
        {reading && wrote && <path d={`M${x} 752 V992`} stroke={ink.primary} strokeWidth={15}/>}
        {[{y: 752, on: wrote}, {y: 992, on: reading}].map(({y, on}) => <g key={y}>
          <circle cx={x} cy={y} r={30} fill={on ? ink.primary : ink.background} stroke={on ? ink.primary : ink.muted} strokeWidth={4}/>
          {on && <path d={`M${x-15} ${y} l11 12 20 -25`} stroke={ink.text} strokeWidth={6} fill="none" strokeLinecap="round"/>}
        </g>)}
      </g>;
    })}
    <text x={80} y={1230} fontSize={53} fontWeight={660}>
      {selected ? `${common.length === 1 ? 'Общая реплика' : 'Общие реплики'} — ${common.join(' и ')}` :
        time >= cue.two ? 'Ждём две реплики из трёх' : 'Чтение с QUORUM'}
    </text>
    {time >= cue.overlap && <text x={80} y={1340} fontSize={50}>У B уже есть «{newBody}»</text>}
  </g>;
}

function Formula({time}: {readonly time: number}) {
  return <g>
    <text x={80} y={540} fontSize={98} fontWeight={710}>W + R &gt; RF</text>
    <text x={80} y={715} fontSize={108} fontWeight={720}>2 + 2 &gt; 3</text>
    {time >= cue.terms && ['W — подтвердили запись', 'R — ответили на чтение', 'RF — всего копий'].map((line, i) =>
      <text key={line} x={80} y={895 + i * 89} fontSize={54}>{line}</text>)}
    {time >= cue.assumptions && <g fontSize={47}>
      <text x={80} y={1290}>Состав реплик тот же.</text>
      <text x={80} y={1358}>Других правок сообщения нет.</text>
    </g>}
  </g>;
}

export function Reading({time}: {readonly time: number}) {
  if (time < cue.quorum) return <Edit time={time}/>;
  if (time < cue.formula) return <Intersection time={time}/>;
  return <Formula time={time}/>;
}
