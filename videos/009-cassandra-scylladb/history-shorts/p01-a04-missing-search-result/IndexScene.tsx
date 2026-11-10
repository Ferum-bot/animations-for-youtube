import React from 'react';
import {arrive, easing, Magnifier, mix, progress, v2Theme as ink} from '@channel/motion-v2';

type At = {readonly time:number};
const query = 'офиса';

function Original() {
  return <g>
    <text x={78} y={407} fontSize={43}>Facebook Inbox · сообщение № 42</text>
    <path d="M115 455 Q78 455 78 495 V590 Q78 626 118 626 H149 L135 664 L201 626 H817 Q857 626 857 588 V494 Q857 455 818 455 Z"
      fill={ink.surface} stroke={ink.text} strokeWidth={4} strokeLinejoin="round"/>
    <text x={121} y={563} fontSize={62} fontWeight={650}>Встречаемся у <tspan>{query}</tspan></text>
  </g>;
}

function Search({y,hit,opacity=1}: {readonly y:number;readonly hit:number;readonly opacity?:number}) {
  return <g transform={`translate(78 ${y})`} opacity={opacity}>
    <Magnifier x={0} y={0} scale={0.54}/>
    <text x={108} y={57} fontSize={58} fontWeight={650}>{query}</text>
    <path d="M0 94 H776" stroke={ink.muted} strokeWidth={3}/>
    <text x={8} y={177} fontSize={51} opacity={1-hit}>Ничего не найдено</text>
    <text x={8} y={177} fontSize={51} opacity={hit}>№ 42 · Встречаемся у офиса</text>
  </g>;
}

function Servers({time}:At) {
  const down=arrive(time,10500,480);
  return <g>
    <text x={79} y={433} fontSize={54} fontWeight={650}>Серверы индекса</text>
    {[0,1,2].map(i=><g key={i} transform={`translate(${80+i*277} 526)`} opacity={i===1?1-down*0.55:1}>
      <path d="M2 4 L227 0 L230 164 H0 Z" fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
      {[0,1,2].map(j=><path key={j} d={`M24 ${42+j*38} H199`} stroke={ink.muted} strokeWidth={5}/>)}
      {i===1 && <path d="M63 31 L166 136 M165 30 L63 137" stroke={ink.text} strokeWidth={12} opacity={down}/>}
    </g>)}
    <g opacity={down}>
      <text x={80} y={825} fontSize={54} fontWeight={660}>Один узел недоступен</text>
      <text x={80} y={905} fontSize={48} opacity={arrive(time,15500,500)}>Остальные продолжают работать</text>
    </g>
  </g>;
}

function Copies({time}: At) {
  return <g>
    <text x={80} y={862} fontSize={54} fontWeight={670}>Поисковый индекс</text>
    {['А','Б'].map((label,i)=>{
      const p=arrive(time,i===0?27450:31800,650);
      return <g key={label} transform={`translate(80 ${989+i*256})`}>
        <text fontSize={44}>Копия {label}</text>
        <path d="M0 128 H774" stroke={ink.muted} strokeWidth={3}/>
        <text y={93} fontSize={55} fill={ink.muted} opacity={1-p}>—</text>
        <text x={mix(35,0,p)} y={93} fontSize={55} opacity={p}>{query} → № 42</text>
      </g>;
    })}
  </g>;
}

function Rebuild({time}: At) {
  const p=progress(time,40200,41300,easing.transform);
  return <g>
    <text x={80} y={874} fontSize={53} fontWeight={670}>Запись индекса</text>
    <path d="M79 1034 H852" stroke={ink.muted} strokeWidth={3}/>
    <text x={80} y={990} fontSize={51} opacity={1-arrive(time,39800,300)}>Отсутствует</text>
    <g opacity={arrive(time,40200,300)}>
      <text x={mix(568,80,progress(time,40850,41480,easing.transform))} y={mix(563,990,p)} fontSize={mix(62,56,p)} fontWeight={650}>{query}</text>
      <text x={290} y={990} fontSize={56} opacity={arrive(time,41480,250)}>→ № 42</text>
    </g>
    <Search y={1235} hit={arrive(time,41550,200)} opacity={arrive(time,36800)}/>
  </g>;
}

export function IndexScene({time}:At) {
  const servers=time>=7000 && time<25433;
  const rebuild=time>=33500;
  const title=time<25433 ? ['Сообщение есть.', 'Почему поиск пустой?'] :
    rebuild ? ['Как восстановить','запись индекса?'] : ['Копия индекса','может отстать'];
  return <g>
    {title.map((line,i)=><text x={74} y={174+i*87} key={line} fontSize={74} fontWeight={750} letterSpacing={-2.8}>{line}</text>)}
    {servers ? <Servers time={time}/> : <Original/>}
    {time<7000 && <Search y={779} hit={0} opacity={arrive(time,550,520)}/>}
    {time>=25433 && (rebuild?<Rebuild time={time}/>:<Copies time={time}/>)}
  </g>;
}
