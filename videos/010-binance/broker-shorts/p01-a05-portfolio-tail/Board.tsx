import React from 'react';
import {arrive,mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,Reveal,Sheet} from '../../shared/vertical/drawing';

const history = [[85,438],[163,399],[240,422],[316,358],[390,374],[467,318],[544,335],[617,286]] as const;
export function Board({time,...layout}: BoardProps) {
  const change=progress(time,22700,23850);
  const y=mix(292,230,change);
  const cached=time>=11200;
  return <Sheet {...layout} title="Из чего складывается портфель">
    <text x={100} y={161} fontSize={41} fontWeight={760}>
      $100 <tspan opacity={arrive(time,4020)}>+ 2 × ${change>.5 ? '51' : '50'} </tspan>
      <tspan opacity={arrive(time,7650)}>= ${change>.5 ? '202' : '200'}</tspan>
    </text>
    <g opacity={1-arrive(time,10900)}>
      <g transform="translate(125 594)" stroke={green} strokeWidth={3} fill="#edf4ec">
        <rect width={145} height={76} rx={3}/><ellipse cx={72} cy={38} rx={29} ry={25}/>
        <Note x={72} y={48} size={28} color={green}>$</Note>
      </g>
      <Reveal time={time} at={4020}>
        <Note x={343} y={650} size={42}>+</Note>
        {[0,1].map(i=><g key={i} transform={`translate(${430+i*85} ${580+i*30})`}>
          <path d="M0 0 H134 L156 23 V92 H0 Z M134 0 V23 H156" stroke={blue} strokeWidth={3} fill={paper}/>
          <Note x={77} y={60} size={29} bold>$50</Note>
        </g>)}
      </Reveal>
    </g>
    <path d="M69 218 v281 h688" fill="none" stroke={ink} strokeWidth={3}/>
    <polyline points={history.map(p=>p.join(',')).join(' ')} fill="none" stroke={ink} strokeWidth={5}/>
    {history.map(([x,py])=><circle key={x} cx={x} cy={py} r={cached ? 8 : 6} stroke={ink} strokeWidth={3} fill={paper}/>)}
    <path d={`M617 286 L733 ${y}`} fill="none" stroke={blue} strokeWidth={5}/>
    <circle cx={733} cy={y} r={13+6*Math.sin(change*Math.PI)} fill={blue}/>
    <Note x={711} y={y-31} size={31} bold color={blue}>${change>.5 ? '202' : '200'}</Note>
    <Reveal time={time} at={11200}><path d="M85 521 q0 18 15 18 h503 q15 0 15 -18" fill="none" stroke={ink} strokeWidth={4}/>
      <Note x={350} y={593} pen>История из кэша</Note></Reveal>
    <Reveal time={time} at={22650}><path d="M736 519 v30" fill="none" stroke={blue} strokeWidth={4}/>
      <Note x={719} y={592} size={28} color={blue} pen>Сейчас</Note>
      <Note x={414} y={705} color={green} size={37} bold>Новая цена → новая точка</Note></Reveal>
  </Sheet>;
}
