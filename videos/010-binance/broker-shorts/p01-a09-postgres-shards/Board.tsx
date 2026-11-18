import React from 'react';
import {staticFile} from 'remotion';
import {arrive,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,Database,green,ink,Note,Reveal,Sheet,yellow} from '../../shared/vertical/drawing';

function Decision({time}: {time:number}) {
  return <>
    <svg x={62} y={124} width={722} height={234} viewBox="210 106 782 254" overflow="hidden">
      <image href={staticFile('assets/010-binance/robinhood-sharding/article.webp')} width={1080} height={2841}/>
    </svg>
    <Note x={420} y={400} size={30} pen color={blue}>Robinhood Engineering · 2021</Note>
    <Reveal time={time} at={4900}><Note x={420} y={492} size={31}>DynamoDB · CockroachDB · Spanner</Note></Reveal>
    <Database x={421} y={598}/>
    <Reveal time={time} at={10800}>
      {[199,421,643].map(x=><g key={x}><path d={`M421 646 L${x} 684`} stroke={ink} strokeWidth={3}/>
        <Database x={x} y={710} scale={.7}/></g>)}
      <Note x={421} y={782} size={32} bold color={blue}>Шарды PostgreSQL</Note>
    </Reveal>
  </>;
}

function Capacity({time}: {time:number}) {
  const count=Math.round(12*progress(time,29300,30800));
  return <>
    <Note x={415} y={171} bold size={43}>40 000 заявок / с</Note>
    <Reveal time={time} at={18100}>
      {['Создать','Принять','Исполнить'].map((label,i)=><g key={label}>
        <circle cx={145+i*275} cy={286} r={18} stroke={ink} strokeWidth={3} fill={i*1050+19200<time ? blue : '#fffefa'}/>
        {i<2 && <path d={`M${170+i*275} 286 h221`} stroke={ink} strokeWidth={3}/>}
        <Note x={145+i*275} y={356} size={29}>{label}</Note>
      </g>)}
    </Reveal>
    <Reveal time={time} at={26600}><Note x={419} y={468} bold size={45}>120 000 транзакций / с</Note>
      <path d="M131 484 Q420 494 708 481" stroke={yellow} strokeWidth={5} fill="none"/></Reveal>
    <Reveal time={time} at={28700}><Note x={422} y={550} size={30} pen color={blue}>Допущение: 10 000 / с на кластер</Note></Reveal>
    {Array.from({length:12},(_,i)=><g key={i} opacity={i<count ? 1 : 0}><Database
      x={95+i%6*132} y={612+Math.floor(i/6)*57} scale={.53}/></g>)}
    <g opacity={arrive(time,31800)}><Note x={423} y={760} size={38} bold color={green}>В проекте закладываем 12–16 шардов</Note></g>
  </>;
}

export function Board({time,...layout}: BoardProps) {
  const estimate=time>=14500;
  return <Sheet {...layout} title={estimate ? 'Расчёт для нашего брокера' : 'Как масштабировался Robinhood'}>
    {estimate ? <Capacity time={time}/> : <Decision time={time}/>}
  </Sheet>;
}
