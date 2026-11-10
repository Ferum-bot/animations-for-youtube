import React from 'react';
import {arrive, easing, mix, progress, Sheet, v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

const diskX = 824;
const diskY = 925;
const foregroundY = 1145;
const backgroundY = 720;
const travelMs = 950;

function pathToDisk(y: number) {
  return `M435 ${y} H620 L${diskX} ${diskY}`;
}

function Operation({time, start, y, reply = false}: {
  readonly time: number; readonly start: number; readonly y: number; readonly reply?: boolean;
}) {
  const elapsed = time - start;
  if (elapsed < 0 || elapsed > travelMs+150) return null;
  const fraction = progress(elapsed, 0, travelMs, easing.transform);
  const route = reply ? 1-fraction : fraction;
  const bend = progress(route, 0.45, 1);
  const x = route < 0.45 ? mix(435,620,route/0.45) : mix(620,diskX,bend);
  return <circle cx={x} cy={mix(y,diskY,bend)} r={16} fill={ink.primary}
    opacity={arrive(elapsed,0,100)*(1-arrive(elapsed,travelMs,150))}/>;
}

export function DiskWork({time}: {readonly time: number}) {
  const replyAt = cue.response + travelMs;
  const received = time >= replyAt;
  const writes = [cue.firstWrite, cue.secondWrite, cue.nextWrite];
  return <g>
    <text x={72} y={219} fontSize={76} fontWeight={740}>Один диск, две задачи</text>

    <text x={76} y={531} fontSize={57} fontWeight={700}>Compaction</text>
    <text x={76} y={598} fontSize={43}>Слияние SSTable</text>
    <path d={pathToDisk(backgroundY)} fill="none" stroke={ink.muted} strokeWidth={4}/>
    <Sheet x={77} y={639} width={338} height={167}>
      {writes.map((at,i) => <path key={at} d={`M28 ${49+i*39} h${mix(0,247,arrive(time,at+travelMs,270))}`}
        stroke={ink.text} strokeWidth={7}/>)}
    </Sheet>

    <g opacity={arrive(time,cue.chat,320)}>
      <text x={76} y={1010} fontSize={55} fontWeight={700}>Чтение чата 42</text>
      <path d={pathToDisk(foregroundY)} fill="none" stroke={ink.muted} strokeWidth={4}/>
      <Sheet x={77} y={1077} width={338} height={136}>
        <text x={26} y={85} fontSize={45}>{received ? '«Привет!»' : 'Запрос'}</text>
      </Sheet>
    </g>

    <g transform="translate(730 841)">
      <path d="M0 30 C0 63 190 63 190 30 V150 C190 185 0 185 0 150 Z" fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
      <ellipse cx={95} cy={30} rx={95} ry={31} fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
      <text x={95} y={128} fontSize={47} textAnchor="middle">Диск</text>
    </g>
    {writes.map(at => <Operation key={at} time={time} start={at} y={backgroundY}/>)}
    <Operation time={time} start={cue.read} y={foregroundY}/>
    <Operation time={time} start={cue.response} y={foregroundY} reply/>

    <g opacity={arrive(time,cue.isolation,400)} fontSize={62} fontWeight={700}>
      <text x={74} y={1450}>Изоляция</text>
      <text x={74} y={1534}>производительности</text>
    </g>
  </g>;
}
