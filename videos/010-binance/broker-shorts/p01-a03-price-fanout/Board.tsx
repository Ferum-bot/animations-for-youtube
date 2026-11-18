import React from 'react';
import {arrive,mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,Phone,Reveal,Route,Sheet,yellow} from '../../shared/vertical/drawing';

function Estimate({time}: {time:number}) {
  return <>
    <g transform="translate(94 195)">{[0,1,2,3,4].map(i => <g key={i} transform={`translate(${i*49} 0)`}>
      <circle cy={-20} r={13} fill={paper} stroke={ink} strokeWidth={3}/>
      <path d="M-19 22 Q-22 -2 0 -2 Q22 -2 19 22" fill="#e4eff7" stroke={ink} strokeWidth={3}/>
    </g>)}</g>
    <Note x={193} y={285} bold>5 млн зрителей</Note>
    <Reveal time={time} at={6730}><Note x={410} y={222} size={58}>×</Note>
      {Array.from({length:20},(_,i)=><rect key={i} x={521+i%5*38} y={136+Math.floor(i/5)*24}
        width={29} height={16} rx={3} fill="#d6e8f4" stroke={blue} strokeWidth={2}/>)}
      <Note x={622} y={285} bold>20 бумаг</Note></Reveal>
    <Reveal time={time} at={9300}><path d="M92 337 q0 16 17 16 h600 q17 0 17 -16" fill="none" stroke={ink} strokeWidth={3}/>
      <Note x={413} y={428} size={52} bold>100 млн подписок</Note></Reveal>
    <Reveal time={time} at={10800}><Note x={417} y={511} color={blue} pen>× 10 обновлений/с</Note></Reveal>
    <Reveal time={time} at={12500}><Note x={417} y={642} size={65} bold>1 млрд доставок/с</Note>
      <path d="M104 663 Q415 677 715 662" stroke={yellow} strokeWidth={7} fill="none"/></Reveal>
  </>;
}

function Packet({time}: {time:number}) {
  const packed = progress(time,26700,28000);
  const sent = arrive(time,28300,740);
  const rows = [{symbol:'AAPL',prices:[50,51,52]}, {symbol:'MSFT',prices:[70,70,71]}, {symbol:'TSLA',prices:[34,34,35]}];
  return <>
    <Note x={95} y={170} anchor="start" pen color={blue}>За 100 мс</Note>
    {rows.map(({symbol,prices},index) => {
      const tick = time>18900 ? 2 : time>17200 ? 1 : 0;
      return <g key={symbol} transform={`translate(0 ${index*83})`}>
        <Note x={93} y={246} anchor="start" bold>{symbol}</Note>
        <path d="M238 235 h70" stroke={ink} strokeWidth={3} fill="none"/>
        <Note x={383} y={247} bold color={blue} size={41}>${prices[tick]}</Note>
        {time>20600 && <circle cx={469} cy={234} r={7} fill={green}/>}
      </g>;
    })}
    <g opacity={packed}><path d="M69 199 v244 h447 V199" fill="none" stroke={blue} strokeWidth={4}/>
      <Note x={287} y={502} size={31} pen>Один WebSocket-кадр</Note></g>
    <Phone x={667} y={342} scale={.91}>
      {rows.map(({symbol,prices},i)=><g key={symbol} opacity={sent}>
        <Note x={-66} y={-52+i*53} size={20} anchor="start">{symbol}</Note>
        <Note x={68} y={-52+i*53} size={24} anchor="end" color={blue} bold>${prices[2]}</Note>
      </g>)}</Phone>
    <Route x1={520} y1={333} x2={574} y2={333} at={28100} time={time}/>
    <Reveal time={time} at={23600}><Note x={405} y={615} pen color={blue}>Отправляем последнее изменение</Note></Reveal>
    {packed>0 && <rect x={mix(518,577,packed)} y={321} width={15} height={20} fill={blue} opacity={1-sent}/>}
  </>;
}

export function Board({time,...layout}: BoardProps) {
  const batch=time>=14850;
  return <Sheet {...layout} title={batch ? 'Что получит телефон?' : 'Оценка для нашего брокера'}>
    {batch ? <Packet time={time}/> : <Estimate time={time}/>}
  </Sheet>;
}
