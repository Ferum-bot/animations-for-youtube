import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';

import {papers} from './papers';

// One camera move per document: start with the title and its authors in view;
// mark the name on the printed line, then lift it out as live type.
function Paper({paper,elapsed}: {readonly paper:typeof papers[number];readonly elapsed:number}) {
  const focus=progress(elapsed,1030,1940,easing.transform);
  const lift=progress(elapsed,760,1040,easing.transform);
  const mark=arrive(elapsed,360,470);
  const scale=mix(1.57,1.82,focus);
  const x=mix(-50,-115,focus), y=mix(42,12,focus);
  const left=mix(x+paper.x*scale,76,focus);
  const base=mix(y+paper.baseline*scale,367,focus);
  const line=mix(paper.width*scale,paper.focusWidth,focus);
  return <g>
    <rect width={1080} height={1920} fill={ink.background}/>
    <g opacity={1-0.94*lift} style={{filter:`blur(${2.8*focus}px)`}}>
      <rect width={1080} height={1920} fill="white"/>
      <SourceImage src={'assets/009-cassandra-scylladb/p01-consistency/'+paper.file}
        x={x} y={y-55} width={750*scale} height={970.75*scale}/>
    </g>
    <text x={left} y={base-55} fontSize={mix(paper.name==='Bigtable'?18*scale:22*scale,110,focus)} fontWeight={730}
      textLength={line} lengthAdjust="spacingAndGlyphs" opacity={lift}>{paper.name}</text>
    <path d={`M${left} ${base-46} h${line*mark}`} stroke={ink.primary} strokeWidth={mix(4,8,focus)}/>
    <text x={76} y={410} fontSize={52} opacity={focus}>{paper.credit}</text>
  </g>;
}

export function Archive({time}: {readonly time:number}) {
  const second=progress(time,15980,16750,easing.transform);
  return <g>
    {papers.map((paper,i)=><svg key={paper.name} x={0} y={i===0?0:mix(1500,660,second)} width={1080} height={i===0?mix(1920,660,second):660}
      overflow="hidden" opacity={i===0?1:second}>
      <Paper paper={paper} elapsed={time-(i===0?14800:16100)}/>
    </svg>)}
    <g transform="translate(76 1460)">
      <text fontSize={59} fontWeight={680} opacity={arrive(time,17550,300)}>Работали внутри компаний.</text>
      <text y={102} fontSize={55} opacity={arrive(time,19340,360)}>Статьи можно прочитать.</text>
      <text y={180} fontSize={55} opacity={arrive(time,21000,330)}>Сами базы — не скачать.</text>
    </g>
  </g>;
}
