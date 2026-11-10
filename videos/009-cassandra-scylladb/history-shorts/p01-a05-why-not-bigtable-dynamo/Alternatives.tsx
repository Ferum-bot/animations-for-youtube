import React from 'react';
import {arrive, mix, Sheet, v2Theme as ink} from '@channel/motion-v2';

import {papers} from './papers';

export function Alternatives({time}: {readonly time:number}) {
  const placing=arrive(time,4200,750), proposed=arrive(time,10750,570);
  return <g>
    <g fontSize={75} fontWeight={750} letterSpacing={-3}>
      <text x={74} y={184}>Почему Facebook</text>
      <text x={74} y={274}>не взял базу Google</text>
      <text x={74} y={364}>или Amazon?</text>
    </g>
    <g opacity={1-arrive(time,2220,240)}>
      {papers.map((paper,i)=><g key={paper.name} transform={`translate(0 ${i*460})`}>
        <text x={80} y={740} fontSize={46}>{paper.credit}</text>
        <text x={74} y={880} fontSize={124} fontWeight={700}>{paper.name}</text>
      </g>)}
    </g>
    <g opacity={arrive(time,2460,300)}>
      <text x={78} y={630} fontSize={62} fontWeight={660}>Шардинг</text>
      <text x={80} y={720} fontSize={48}>Разнести чаты по серверам</text>
      {[0,1].map(i=><g key={i} transform={`translate(${80+i*445} 870)`}>
        <Sheet x={0} y={0} width={395} height={245}>
          <text x={32} y={90} fontSize={52} fontWeight={620}>Шард {i===0?'А':'Б'}</text>
          <path d="M30 126 H360" stroke={ink.muted} strokeWidth={3}/>
          <text x={mix(32+(i===0?110:-110),32,placing)} y={mix(147,204,placing)} opacity={placing}
            fontSize={50}>Чат {i===0?'42':'17'}</text>
        </Sheet>
      </g>)}
      <g opacity={arrive(time,6100,480)}>
        <text x={80} y={1300} fontSize={54} fontWeight={650}>Кто распределяет чаты?</text>
        <text x={80} y={1383} fontSize={51}>Команда приложения.</text>
      </g>
      <g opacity={proposed}>
        <text x={80} y={1548} fontSize={48}>Facebook уже делил данные в MySQL.</text>
        <text x={80} y={1623} fontSize={48}>Индекс решили хранить отдельно.</text>
      </g>
    </g>
  </g>;
}

export function Outcome({time}: {readonly time:number}) {
  const join=arrive(time,27850,900);
  return <g>
    {time<25900 ? <g>
      <text x={74} y={530} fontSize={60}>Открытая альтернатива</text>
      <text x={72} y={860} fontSize={162} fontWeight={740}>HBase</text>
      <path d="M79 912 H574" stroke={ink.primary} strokeWidth={8}/>
      <text x={77} y={1084} fontSize={65}>2007 · в составе Hadoop</text>
    </g> : <>
      <text x={74} y={220} fontSize={69} fontWeight={720}>Что взял Facebook?</text>
      {papers.map((item,i)=><g key={item.name} transform={`translate(${77+i*475} 0)`}>
        <text x={0} y={666} fontSize={78} fontWeight={680}>{item.name}</text>
        <text x={0} y={753} fontSize={46}>{item.idea}</text>
      </g>)}
      <path d="M255 818 V934 Q255 964 290 980 L494 1084 M746 818 V934 Q746 964 711 980 L508 1084"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1-join} stroke={ink.primary} strokeWidth={8} fill="none"/>
      <g opacity={arrive(time,28000,470)}>
        <text x={500} y={1250} textAnchor="middle" fontSize={114} fontWeight={750}>Cassandra</text>
        <text x={500} y={1355} textAnchor="middle" fontSize={50}>Своя база для поиска в Inbox</text>
      </g>
    </>}
  </g>;
}
