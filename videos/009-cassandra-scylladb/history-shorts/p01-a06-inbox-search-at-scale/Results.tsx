import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import {asset} from '../../animations/p01-a04-history-launch/scene';

type Figure = {
  readonly x: number;
  readonly baseline: number;
  readonly width: number;
  readonly label: string;
  readonly finalWidth: number;
};

// Source coordinates in PDF points on page 5 of LADIS 2009. Both times are from the Median row.
const scaleFigures: readonly Figure[] = [
  {x:370.8, baseline:431, width:28.8, label:'50+ ТБ', finalWidth:347},
  {x:458.9, baseline:431, width:70.5, label:'150 узлов', finalWidth:481},
];
const medianFigures: readonly Figure[] = [
  {x:420.8, baseline:504.2, width:32.3, label:'15,69 мс', finalWidth:422},
  {x:504.5, baseline:504.2, width:32.5, label:'18,27 мс', finalWidth:422},
];

export function Results({time}: {readonly time:number}) {
  const readingMedian = time >= 10800;
  const pan = progress(time, 3880, 5100, easing.transform);
  const magnification = mix(1.83, 4.16, pan);
  const left = mix(0, -308*magnification, pan);
  const top = mix(0, -300*magnification, pan) - 365*progress(time,10300,11200,easing.transform);
  const markAt = readingMedian ? 11200 : 5190;
  const unfold = progress(time,14800,15733,easing.transform);
  const focus = progress(time,markAt+430,markAt+1340,easing.transform)
    * (readingMedian ? 1 : 1-progress(time,9710,10450,easing.transform));
  const underline = arrive(time,markAt,390) * (readingMedian ? 1 : 1-progress(time,10070,10470,easing.transform));
  const figures = readingMedian ? medianFigures : scaleFigures;
  return <g>
    <g opacity={1-0.94*focus} style={{filter:`blur(${2.5*focus}px)`}}>
      <SourceImage src={asset('cassandra-results.jpg')} x={left} y={top}
        width={595.276*magnification} height={841.89*magnification}/>
    </g>
    <g opacity={focus}>
      <text x={74} y={156+146*unfold} fontSize={44}>Inbox Search · LADIS 2009</text>
      <text x={70} y={260+165*unfold} fontSize={78} fontWeight={740}>{readingMedian?'Время поиска':'Кластер Cassandra'}</text>
      {readingMedian && <text x={75} y={338+180*unfold} fontSize={48}>Медиана</text>}
    </g>
    {figures.map((figure,i)=>{
      const targetY=readingMedian ? 555+i*288+unfold*(182+i*82) : 510+i*190;
      const x=mix(left+figure.x*magnification,76,focus);
      const y=mix(top+figure.baseline*magnification,targetY,focus);
      const length=mix(figure.width*magnification,figure.finalWidth,focus);
      return <g key={figure.label}>
        {readingMedian && <text x={76} y={targetY-113} fontSize={48} opacity={focus}>
          {i===0?'По собеседнику':'По слову'}
        </text>}
        <text x={x} y={y} textLength={length} lengthAdjust="spacingAndGlyphs" fontSize={mix(41,105,focus)}
          fontWeight={690} opacity={focus}>{figure.label}</text>
        <path d={`M${x} ${y+13} h${length*underline}`} stroke={ink.primary} strokeWidth={mix(4,8,focus)}/>
      </g>;
    })}
    {!readingMedian && <text x={76} y={908} fontSize={49} opacity={focus*arrive(time,8350)}>
      Восток и запад США
    </text>}
  </g>;
}
