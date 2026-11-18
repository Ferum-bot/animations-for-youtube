import React from 'react';
import {arrive,mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,red,Reveal,Route,Sheet,Slip,yellow} from '../../shared/vertical/drawing';

export function Board({time,...layout}: BoardProps) {
  const sent=progress(time,2170,3560), reconciled=time>=23600;
  return <Sheet {...layout} title="Что стало с заявкой №42?">
    {[{x:54,name:'Брокер'},{x:519,name:'Биржа'}].map(({x,name})=><g key={name}>
      <path d={`M${x} 145 h270 v93 h-270 Z`} stroke={ink} strokeWidth={3} fill={paper}
        strokeDasharray={name==='Биржа' ? '7 7' : undefined}/>
      <Note x={x+135} y={206} bold>{name}</Note>
    </g>)}
    <Slip x={mix(189,652,sent)} y={306} label="Купить · #42"/>
    <Reveal time={time} at={3580}><Note x={650} y={402} color={green} bold>Принята ✓</Note></Reveal>
    <Route x1={599} y1={440} x2={435} y2={440} at={3950} time={time} color={red}/>
    <g opacity={arrive(time,4500)}><path d="M409 426 l22 27 M431 426 l-22 27" stroke={red} strokeWidth={5}/>
      <Note x={425} y={502} pen size={29} color={red}>Ответ потерялся</Note></g>
    <Reveal time={time} at={4750}><Note x={190} y={405} bold color={reconciled ? green : ink}>
      {reconciled ? 'Принята ✓' : 'Неизвестно'}</Note>
      {!reconciled && <path d="M78 420 Q188 432 302 418" stroke={yellow} strokeWidth={5} fill="none"/>}</Reveal>
    <Reveal time={time} at={15900}>
      <path d="M92 587 a34 34 0 1 1 25 32 M108 611 l7 10 13 -11" fill="none" stroke={blue} strokeWidth={4}/>
      <Note x={161} y={600} anchor="start" size={32}>Проверить статус #42</Note></Reveal>
    <Route x1={197} y1={635} x2={641} y2={635} at={19900} time={time}/>
    <Route x1={641} y1={683} x2={197} y2={683} at={22650} time={time} color={green}/>
    <Reveal time={time} at={23550}><Note x={419} y={755} color={green} bold>Ответ по той же заявке</Note></Reveal>
  </Sheet>;
}
