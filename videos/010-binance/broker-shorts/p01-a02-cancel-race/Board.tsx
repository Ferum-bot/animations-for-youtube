import React from 'react';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,paper,red,Reveal,Route,Sheet,yellow} from '../../shared/vertical/drawing';

export function Board({time,...layout}: BoardProps) {
  return <Sheet {...layout} title="Кто успел первым?">
    <Note x={158} y={165} bold>Клиент</Note><Note x={672} y={165} bold>Биржа</Note>
    {[158,672].map(x => <path key={x} d={`M${x} 184 v446`} stroke="#858780" strokeWidth={3} strokeDasharray="8 9"/>)}
    <Route x1={158} y1={221} x2={672} y2={281} time={time} at={2450}/>
    <Note x={416} y={226} pen color={blue}>Купить</Note>
    <Reveal time={time} at={4850}>
      <circle cx={672} cy={319} r={12} fill={green}/>
      <Note x={650} y={333} color={green} anchor="end" bold>Исполнено</Note>
    </Reveal>
    <Reveal time={time} at={5250}><circle cx={158} cy={362} r={10} fill={ink}/>
      <Note x={181} y={362} anchor="start" pen>Отменить</Note></Reveal>
    <Route x1={158} y1={377} x2={672} y2={436} time={time} at={5700} duration={1300}/>
    <Reveal time={time} at={7500}><path d="M648 429 l-20 -60" stroke={yellow} strokeWidth={4}/>
      <circle cx={672} cy={319} r={23} stroke={yellow} strokeWidth={4} fill="none"/></Reveal>
    <Route x1={672} y1={461} x2={158} y2={538} time={time} at={9210} duration={1000} color={red}/>
    <Reveal time={time} at={9300}><Note x={421} y={480} color={red} size={30}>Too late to cancel</Note></Reveal>
    <Route x1={672} y1={555} x2={158} y2={618} time={time} at={13800} color={green}/>
    <Reveal time={time} at={13950}><Note x={422} y={566} size={30} color={green}>Отчёт об исполнении</Note></Reveal>
    <Reveal time={time} at={19100}><rect x={74} y={663} width={700} height={89} fill={paper}/>
      <path d="M103 700 v-13 a11 11 0 0 1 22 0 v13 M97 700 h34 v28 H97 Z" fill="none" stroke={ink} strokeWidth={4}/>
      <Note x={159} y={704} size={31} anchor="start" bold>Разморозить остаток</Note>
      <Note x={159} y={748} size={29} anchor="start">после подтверждения отмены</Note></Reveal>
  </Sheet>;
}
