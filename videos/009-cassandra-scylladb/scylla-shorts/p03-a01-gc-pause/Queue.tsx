import React from 'react';
import {arrive, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {cue} from './score';

function Node({name, y, paused}: {name:string; y:number; paused:boolean}) {
  return <g transform={`translate(680 ${y})`}>
    <path d="M0 8 L233 0 L237 202 L3 206 Z" fill={ink.surface} stroke={ink.text} strokeWidth={4}/>
    <text x={25} y={73} fontSize={48} fontWeight={670}>Узел {name}</text>
    {paused ? <g fill={ink.primary}><rect x={31} y={111} width={16} height={49}/><rect x={61} y={111} width={16} height={49}/></g> :
      <path d="M30 128 H187 M30 151 H134" stroke={ink.muted} strokeWidth={5}/>}
  </g>;
}

function Ticket({x,y,id,opacity}: {x:number; y:number; id:number; opacity:number}) {
  return <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d="M0 4 L124 0 L128 74 L2 78 Z" fill={ink.surface} stroke={ink.text} strokeWidth={3}/>
    <text x={62} y={51} textAnchor="middle" fontSize={39} fontWeight={640}>№ {id}</text>
  </g>;
}

function Crossing({time,at,id,y}: {time:number; at:number; id:number; y:number}) {
  const movement=progress(time,at,at+1250,easing.transform);
  return <Ticket x={mix(90,680,movement)} y={y} id={id}
    opacity={arrive(time,at,180)*(1-arrive(time,at+1020,230))}/>;
}

export function Queue({time}: {time:number}) {
  const paused=time>=cue.pause && time<cue.resume;
  const second=arrive(time,cue.otherNode,460);
  return <g>
    <text x={76} y={179} fontSize={73} fontWeight={750}>Почему GC-пауза</text>
    <text x={76} y={270} fontSize={73} fontWeight={750}>задерживает запросы?</text>
    <text x={77} y={578} fontSize={49}>Запросы к узлу А</text>
    <path d="M78 751 H691" stroke={ink.muted} strokeWidth={3}/>
    {[6000,7470,8910].map((at,i)=><Crossing key={at} time={time} at={at} id={i+1} y={708}/>)}
    {[11500,12900,14550].map((at,i)=>{
      const queuedX=505-i*166;
      const arriveX=mix(65,queuedX,progress(time,at,at+890,easing.transform));
      const leave=cue.resume+i*450;
      return <Ticket key={at} x={mix(arriveX,680,progress(time,leave,leave+620,easing.transform))}
        y={708} id={i+4} opacity={arrive(time,at,180)*(1-arrive(time,leave+410,210))}/>;
    })}
    <Node name="А" y={644} paused={paused}/>
    <g opacity={paused?1:0}>
      <text x={77} y={978} fontSize={64} fontWeight={690}>Пауза JVM</text>
      <text x={78} y={1062} fontSize={47}>Запросы ждут ответа А</text>
    </g>
    <text x={77} y={978} fontSize={57} opacity={arrive(time,cue.resume,400)}>Узел А продолжил работу</text>
    <g opacity={second}>
      <text x={77} y={1240} fontSize={49}>Независимый запрос к Б</text>
      <path d="M78 1403 H692" stroke={ink.muted} strokeWidth={3}/>
      <Crossing time={time} at={18100} id={7} y={1362}/>
      <Node name="Б" y={1298} paused={false}/>
      <text x={78} y={1593} fontSize={48} opacity={arrive(time,19300)}>Б ответил</text>
    </g>
  </g>;
}
