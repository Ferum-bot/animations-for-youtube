import React from 'react';
import {Sheet, progress, v2Theme as ink} from '@channel/motion-v2';
import {newBody, oldBody, replicas, type Replica} from '../../shared/architecture/chat107';
import {cue} from './score';

// B saw the second edit. A and C still have copies of the first one.
function body(host: Replica) {
  return host === 'B' ? newBody : oldBody;
}

function Stamp({host, time}: {readonly host: Replica; readonly time: number}) {
  const skew = time >= cue.skew;
  const latest = skew ? host !== 'B' : host === 'B';
  const value = host === 'B' ? '10:02' : skew ? '10:03' : '10:01';
  const underline = progress(time, skew ? cue.skew : cue.winner, skew ? cue.skew + 600 : cue.winner + 600);
  return <g>
    <text x={742} fontSize={60} fontWeight={680}>{value}</text>
    {latest && <path d="M742 22 H894" stroke={ink.primary} strokeWidth={10}
      pathLength={1} strokeDasharray="1" strokeDashoffset={1 - underline}/>}
  </g>;
}

function Readout({time}: {readonly time: number}) {
  if (time >= cue.winner) {
    const skew = time >= cue.skew;
    return <g>
      <text x={80} y={1190} fontSize={49} fontWeight={650}>
        {skew ? 'Если часы первой правки спешили' : 'Результат чтения'}
      </text>
      {(!skew || time >= cue.skewResult) && <Sheet x={80} y={1244} width={820} height={144}>
        <text x={38} y={95} fontSize={66} fontWeight={700}>{skew ? oldBody : newBody}</text>
      </Sheet>}
    </g>;
  }
  if (time >= cue.compare) return <text x={80} y={1235} fontSize={54} fontWeight={680}>
    {time >= cue.timestamps ? 'Сравниваем метки записи' : 'Какую версию вернуть?'}
  </text>;
  if (time < cue.data) return null;
  let note = 'A присылает текст';
  if (time >= cue.fetch) note = 'Запрашиваем данные у B';
  else if (time >= cue.mismatch) note = 'У B другой хеш';
  else if (time >= cue.digest) note = 'B и C присылают хеши';
  return <text x={80} y={1235} fontSize={54} fontWeight={680}>{note}</text>;
}

export function VersionRead({time}: {readonly time: number}) {
  const stamps = time >= cue.timestamps;
  const digests = time >= cue.digest && time < cue.compare;
  return <g>
    <text x={80} y={470} fontSize={53} fontWeight={670}>Сообщение № 107</text>
    <text x={194} y={596} fontSize={43} fill={ink.muted}>Поле text</text>
    {digests && <text x={745} y={596} fontSize={43} fill={ink.muted}>Digest</text>}
    {stamps && <text x={742} y={596} fontSize={43} fill={ink.muted}>Метка</text>}
    {replicas.map((host, i) => <g key={host} transform={`translate(0 ${722 + i * 144})`}>
      <text x={80} fontSize={65} fontWeight={720}>{host}</text>
      <text x={194} fontSize={59} fontWeight={630}>{body(host)}</text>
      {digests && <g>
        <text x={745} fontSize={57}>{host === 'B' ? 'h₂' : 'h₁'}</text>
        {time >= cue.mismatch && host === 'B' && <path d="M745 18 h61" stroke={ink.primary} strokeWidth={9}
          pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress(time, cue.mismatch, cue.mismatch + 480)}/>}
      </g>}
      {stamps && <Stamp host={host} time={time}/>}
    </g>)}
    <Readout time={time}/>
  </g>;
}
