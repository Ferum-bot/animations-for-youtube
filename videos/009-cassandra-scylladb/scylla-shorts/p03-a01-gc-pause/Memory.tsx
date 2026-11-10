import React from 'react';
import {arrive, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

export function Memory({time}: {time:number}) {
  const native=time>=cue.scylla;
  const cacheVisible=arrive(time,cue.cache,520);
  const cacheShare=mix(0.65,0.38,progress(time,cue.reclaim,cue.reclaim+1050,easing.transform));
  const left=78, width=823;
  return <g>
    <text x={left} y={190} fontSize={82} fontWeight={750}>{native?'ScyllaDB':'Cassandra'}</text>
    <text x={left} y={322} fontSize={55}>{native?'Управление памятью в C++':'Настройка памяти узла'}</text>
    {native ? <>
      <g opacity={arrive(time,cue.scylla+350,460)}>
        <text x={left} y={700} fontSize={57} fontWeight={680}>Память процесса</text>
        <rect x={left} y={810} width={width} height={212} fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
        <text x={left+38} y={934} fontSize={60} opacity={1-cacheVisible}>Под управлением ScyllaDB</text>
        <g opacity={cacheVisible}>
          <rect x={left+2} y={812} width={(width-4)*cacheShare} height={208} fill={ink.primary}/>
          <text x={left+35} y={934} fontSize={52} fontWeight={670}>Кеш</text>
          <text x={left+width*cacheShare+25} y={934} fontSize={45}>Операции</text>
        </g>
      </g>
      <g opacity={arrive(time,37100,450)*(1-cacheVisible)}>
        <text x={left} y={1230} fontSize={65} fontWeight={690}>Без пауз Java GC</text>
        <path d="M79 1276 H635" stroke={ink.primary} strokeWidth={7}/>
      </g>
      <text x={left} y={1230} fontSize={52} opacity={arrive(time,cue.reclaim+250)}>Кеш уступает память запросам</text>
    </> : <>
      <text x={left} y={700} fontSize={57} fontWeight={680}>Память процесса</text>
      <rect x={left} y={810} width={width} height={212} fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
      <path d="M521 810 V1022" stroke={ink.text} strokeWidth={4}/>
      <text x={left+40} y={932} fontSize={55}>Куча JVM</text>
      <text x={554} y={932} fontSize={55}>Off-heap</text>
      <g opacity={arrive(time,25250,430)}>
        <path d="M560 969 H788" stroke={ink.primary} strokeWidth={7}/>
        <text x={left} y={1225} fontSize={54}>Часть данных можно хранить</text>
        <text x={left} y={1305} fontSize={54}>вне кучи JVM</text>
      </g>
    </>}
  </g>;
}
