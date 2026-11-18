import React from 'react';
import {mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,Phone,red,Reveal,Sheet} from '../../shared/vertical/drawing';

const spread = [0,.47,.16,.68,.35,.85,.58,1];
export function Board({time,...layout}: BoardProps) {
  const jitter=progress(time,9700,11050);
  const backoff=progress(time,13100,14450);
  return <Sheet {...layout} title="Все вернулись одновременно">
    {spread.map((delay,i)=>{
      const x=88+i*87;
      const start=time<9000 ? 2850 : 10050+delay*3000;
      const attempt=progress(time,start,start+750);
      return <g key={x}><Phone x={x} y={161} scale={.29}/>
        <path d={`M${x} 211 L420 318`} stroke="#acb5b9" strokeWidth={2} fill="none"/>
        <circle cx={mix(x,420,attempt)} cy={mix(211,318,attempt)} r={8}
          fill={time<9000 ? red : blue} opacity={attempt>0 && attempt<1 ? 1 : 0}/></g>;
    })}
    <rect x={309} y={317} width={222} height={81} fill={paper} stroke={ink} strokeWidth={4}/>
    <Note x={420} y={370} bold>Сервер</Note>
    <Reveal time={time} at={2700}>
      <Note x={74} y={471} anchor="start" size={31} pen color={blue}>{time<13100 ? 'Попытки подключения' : 'Повторы одного клиента'}</Note>
      <path d="M77 511 v153 h677" fill="none" stroke={ink} strokeWidth={3}/>
      <g opacity={1-backoff}>{spread.map((delay,i)=>{
        const x=mix(323,138+delay*505,jitter);
        const y=mix(640-i*17,640,jitter);
        return <rect key={i} x={x} y={y} width={27} height={16} rx={2} fill={jitter>.6 ? blue : red}/>;
      })}</g>
      <g opacity={backoff}>
        {[140,210,350,630].map((x,i)=><g key={x}>
          <path d={`M${x} 622 v37`} stroke={green} strokeWidth={6}/>
          <circle cx={x} cy={621} r={8} fill={green}/>
          {i>0 && <Note x={x-35*2**(i-1)} y={592} size={27} pen color={green}>{2**(i-1)} с</Note>}
        </g>)}
      </g>
      <Note x={726} y={708} size={26} color={blue}>время</Note>
    </Reveal>
    <Reveal time={time} at={5350}><Note x={422} y={760} color={backoff>.5 ? green : ink} size={34} bold>
      {backoff>.5 ? 'Повторяем всё реже' : jitter>.5 ? 'У каждого своя задержка' : 'Пик в один момент'}</Note></Reveal>
  </Sheet>;
}
