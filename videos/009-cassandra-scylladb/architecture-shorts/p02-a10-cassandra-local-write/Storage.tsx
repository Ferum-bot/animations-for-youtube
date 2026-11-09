import React from 'react';
import {mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Bubble, RecordPage} from '../../animations/p02-a06-storage-and-workload/Paper';
import {message} from '../../animations/p02-a06-storage-and-workload/scene';
import {cue} from './score';

const initial = `${message.id} · ${message.initial}`;
const updated = `${message.id} · ${message.edited}`;
const older = '108 · Ты у метро?';
const sortedRows = [initial, older] as const;

export function Storage({time}: {readonly time: number}) {
  // This chat is read newest first. A flush preserves the table's clustering order.
  const log = [older];
  if (time >= cue.log + 650) log.push(initial);
  if (time >= cue.appendEdit) log.push(updated);
  let memory: readonly string[] = [older];
  if (time >= cue.mem + 650) memory = sortedRows;
  if (time >= cue.flush) memory = [];
  if (time >= cue.applyEdit) memory = [updated];
  const slide = progress(time, cue.flush, cue.sealed);
  const edited = time >= cue.edit;
  return <g>
    <Bubble x={80} y={294} scale={1.42} body={edited ? message.edited : message.initial}/>
    {time >= cue.lsm && time < cue.log && <g>
      <text x={84} y={856} fontSize={93} fontWeight={710}>LSM</text>
      <text x={84} y={955} fontSize={55}>Log-Structured Merge Tree</text>
    </g>}
    {time >= cue.log && <RecordPage x={85} y={698} width={794} height={258} title="Commit log" rows={log}/>}
    {time >= cue.flush && <g>
      <RecordPage x={85} y={mix(1060, 1370, slide)} width={794} height={179} title="" rows={sortedRows} marked={time >= cue.sealed}/>
      <text x={85} y={1335} fontSize={53} fontWeight={620} opacity={progress(time, cue.sealed - 220, cue.sealed)}>SSTable · на диске</text>
    </g>}
    {time >= cue.mem && <RecordPage x={85} y={1060} width={794} height={179} title="Memtable · в памяти" rows={memory}/>}
  </g>;
}

const modes = [
  {name: 'batch', events: ['fsync', 'OK']},
  {name: 'periodic', events: ['OK', 'fsync']},
] as const;

export function SyncModes({time}: {readonly time: number}) {
  return <g>
    <text x={80} y={463} fontSize={54} fontWeight={650}>Синхронизация commit log</text>
    {modes.map(({name,events},i) => {
      const y = 800 + i*330;
      return <g key={name}>
        <text x={80} y={y-126} fontSize={60} fontWeight={700}>{name}</text>
        <path d={`M86 ${y} h790 l-23 -15 m23 15 l-23 15`} stroke={ink.muted} strokeWidth={5} fill="none"/>
        {events.map((event,j) => <g key={event} transform={`translate(${330 + j*422} ${y})`}
          opacity={progress(time, j === 0 ? cue.firstEvent : cue.secondEvent, (j === 0 ? cue.firstEvent : cue.secondEvent) + 350)}>
          <circle r={15} fill={event === 'OK' ? ink.primary : ink.text}/>
          <text y={-39} fontSize={65} textAnchor="middle" fontWeight={680}>{event}</text>
        </g>)}
      </g>;
    })}
    {time >= cue.conclusion && <text x={80} y={1385} fontSize={51}>В periodic OK возможен до fsync</text>}
  </g>;
}
