import React from 'react';
import {arrive} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,red,Reveal,Sheet} from '../../shared/vertical/drawing';

const movements=[
  {at:16950,name:'Резерв',from:'Доступно',to:'Резерв',amount:'$1 000'},
  {at:19500,name:'Покупка',from:'Резерв',to:'Расчёты',amount:'$400'},
  {at:24800,name:'Отмена',from:'Резерв',to:'Доступно',amount:'$600'},
] as const;

function Journal({time}: {time:number}) {
  const held=time<16950 ? 0 : time<19500 ? 1000 : time<24800 ? 600 : 0;
  const available=time<16950 ? 1000 : time<24800 ? 0 : 600;
  return <>
    <path d="M60 150 Q57 371 60 556 L785 556 L785 148 Z" fill={paper} stroke={ink} strokeWidth={3}/>
    <path d="M82 150 v406" stroke="#d1d3ca" strokeWidth={2}/>
    <Note x={110} y={211} anchor="start" size={28} pen color={blue}>Операция</Note>
    <Note x={385} y={211} size={27} pen color={blue}>Откуда → куда</Note>
    <Note x={744} y={211} anchor="end" size={28} pen color={blue}>Сумма</Note>
    {movements.map(({at,name,from,to,amount},i)=>{
      const y=290+i*96;
      return <g key={name}>
        <path d={`M85 ${y+28} H763`} stroke="#bdc2bb" strokeWidth={2}/>
        <g opacity={arrive(time,at,420)}><Note x={106} y={y} anchor="start" size={28} bold>{name}</Note>
          <Note x={416} y={y} size={28}>{from} → {to}</Note>
          <Note x={747} y={y} size={32} anchor="end" bold>{amount}</Note></g>
      </g>;
    })}
    <Reveal time={time} at={14000}>
      <Note x={229} y={639} size={31} color={blue} pen>Доступно</Note><Note x={609} y={639} size={31} color={blue} pen>В резерве</Note>
      <Note x={229} y={723} size={54} color={available===600 ? green : ink} bold>${available.toLocaleString('ru-RU')}</Note>
      <Note x={609} y={723} size={54} bold>${held.toLocaleString('ru-RU')}</Note></Reveal>
  </>;
}

export function Board({time,...layout}: BoardProps) {
  const ledger=time>=8660;
  return <Sheet {...layout} title={ledger ? 'Откуда взялись $600?' : 'Баланс перезаписали'}>
    {ledger ? <Journal time={time}/> : <>
      <Note x={414} y={230} pen color={blue}>cash_cents</Note>
      <path d="M148 269 L690 267 L692 476 L147 478 Z" stroke={ink} strokeWidth={4} fill={paper}/>
      <Note x={420} y={406} size={87} bold>{time<3070 ? '$1 000' : time<3660 ? '$0' : '$600'}</Note>
      <Reveal time={time} at={4100}><path d="M417 492 v58" stroke={red} strokeWidth={4} strokeDasharray="6 9"/>
        <Note x={415} y={647} size={45} pen color={red}>А где история?</Note></Reveal>
    </>}
  </Sheet>;
}
