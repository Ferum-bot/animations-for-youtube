import React from 'react';
import {arrive, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

const left = 285;
const right = 757;
const middle = (left + right) / 2;

function Core({x, name, shard}: {x: number; name: string; shard?: string}) {
  return <g transform={`translate(${x} 600)`}>
    <path d="M-133 3 L134 0 L136 148 L-135 151 Z" fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
    {[-84,-42,0,42,84].map(pin => <path key={pin} d={`M${pin} -16 v18 M${pin} 151 v18`} stroke={ink.muted} strokeWidth={5}/>)}
    <text textAnchor="middle" y={shard ? 69 : 93} fontSize={54} fontWeight={680}>{name}</text>
    {shard && <text textAnchor="middle" y={122} fontSize={36}>{shard}</text>}
  </g>;
}

function Record({x, chat, count}: {x: number; chat: number; count: number}) {
  return <g transform={`translate(${x} 1070)`}>
    <path d="M-164 4 L161 0 L164 216 L-163 220 Z" fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
    <text textAnchor="middle" y={62} fontSize={44}>Чат {chat}</text>
    <path d="M-132 85 h264" stroke={ink.muted} strokeWidth={2}/>
    <text textAnchor="middle" y={150} fontSize={58} fontWeight={720}>{count}</text>
    <text textAnchor="middle" y={195} fontSize={33}>сообщений</text>
  </g>;
}

function Write({x, time, at, done}: {x: number; time: number; at: number; done: number}) {
  const position = progress(time, done-900, done, easing.transform);
  return <g transform={`translate(${mix(x, middle, position)} ${mix(821, 1040, position)})`}
    opacity={arrive(time, at, 230) * (1-arrive(time, done, 200))}>
    <rect x={-56} y={-32} width={112} height={64} fill={ink.primary}/>
    <text textAnchor="middle" y={17} fontSize={44} fontWeight={680}>+1</text>
  </g>;
}

export function SharedCounter({time}: {time: number}) {
  const count = 10 + Number(time >= cue.firstCommit) + Number(time >= cue.secondCommit);
  return <g>
    <text x={74} y={210} fontSize={73} fontWeight={750}>Один счётчик на двоих</text>
    <path d={`M${left} 766 V821 L${middle} 1040 V1070 M${right} 766 V821 L${middle} 1040`} fill="none" stroke={ink.muted} strokeWidth={4}/>
    <Core x={left} name="Ядро 1"/><Core x={right} name="Ядро 2"/>
    <Record x={middle} chat={42} count={count}/>
    <Write x={left} time={time} at={cue.firstWriter} done={cue.firstCommit}/>
    <Write x={right} time={time} at={cue.waiting} done={cue.secondCommit}/>
    <g opacity={arrive(time, cue.waiting, 300) * (1-arrive(time, cue.handover, 250))}>
      <path d="M700 876 H809" stroke={ink.text} strokeWidth={8}/>
      <text x={right} y={950} textAnchor="middle" fontSize={42}>Ждёт</text>
    </g>
    <text x={74} y={1490} fontSize={51} opacity={arrive(time, cue.secondCommit, 390)}>Две записи по очереди</text>
  </g>;
}

export function OwnedShards({time}: {time: number}) {
  const delivery = progress(time, cue.send, cue.send+1150, easing.transform);
  const reply = progress(time, cue.answer, cue.answer+1000, easing.transform);
  const messageX = time < cue.answer ? mix(left, right, delivery) : mix(right, left, reply);
  const messageOpacity = arrive(time, cue.ask, 260) * (1-arrive(time, cue.answer+1900, 350));
  return <g>
    <text x={74} y={192} fontSize={76} fontWeight={750}>ScyllaDB</text>
    <text x={74} y={287} fontSize={61}>Один шард на ядро</text>
    <Core x={left} name="Ядро 1" shard="Шард А"/><Core x={right} name="Ядро 2" shard="Шард Б"/>
    <g opacity={arrive(time, cue.owned, 420)}>
      <path d={`M${left} 766 V1070 M${right} 766 V1070`} stroke={ink.muted} strokeWidth={4}/>
      <Record x={left} chat={42} count={12}/><Record x={right} chat={17} count={8}/>
    </g>
    <g opacity={messageOpacity}>
      <path d={`M${left} 906 H${right}`} stroke={ink.muted} strokeWidth={3} strokeDasharray="8 12"/>
      <g transform={`translate(${messageX} 906)`}>
        <path d="M-137 -46 H137 V44 H-137 Z" fill={ink.primary}/>
        <text textAnchor="middle" y={15} fontSize={42}>{time < cue.answer ? 'Чат 17?' : '8 сообщений'}</text>
      </g>
    </g>
    {time >= cue.physicalMemory && <g opacity={arrive(time, cue.physicalMemory, 320)}>
      <path d="M122 1335 v30 H920 v-30" fill="none" stroke={ink.muted} strokeWidth={4}/>
      <text x={middle} y={1452} textAnchor="middle" fontSize={47}>Память одного сервера</text>
    </g>}
    <text x={middle} y={1570} textAnchor="middle" fontSize={47} opacity={arrive(time, cue.conclusion, 350)}>Меньше затрат на синхронизацию</text>
  </g>;
}
