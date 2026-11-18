import React from 'react';
import {mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,green,ink,Note,red,Reveal,Route,Sheet,Slip,yellow} from '../../shared/vertical/drawing';

export function Board({time,...layout}: BoardProps) {
  const guarded=time>=16500;
  const first=progress(time,guarded ? 16950 : 6800,guarded ? 17800 : 8100);
  const duplicate=progress(time,guarded ? 20600 : 10800,guarded ? 22100 : 12100);
  const shares=first<.95 ? 0 : !guarded && duplicate>.95 ? 200 : 100;
  return <Sheet {...layout} title={guarded ? 'Ключ — номер исполнения' : 'Одна покупка, два отчёта'}>
    <Note x={178} y={166} bold>Биржа</Note><Note x={626} y={166} bold>Брокер</Note>
    <path d="M98 202 h155 M546 202 h155" stroke={ink} strokeWidth={3}/>
    <Route x1={171} y1={311} x2={630} y2={311} time={time} at={2700}/>
    <Slip x={mix(176,633,first)} y={270} label="E-42 · +100"/>
    <Reveal time={time} at={guarded ? 19700 : 9250}>
      <Route x1={171} y1={422} x2={guarded ? 485 : 628} y2={422} time={time} at={guarded ? 20100 : 9800}/>
      <Slip x={mix(176,guarded ? 380 : 633,duplicate)} y={380} label="E-42 · +100"/>
    </Reveal>
    {guarded && <Reveal time={time} at={18900}><path d="M499 340 v98" stroke={red} strokeWidth={6}/>
      <Note x={630} y={396} color={red} size={31}>Дубль</Note></Reveal>}
    <Note x={127} y={549} anchor="start" pen color={blue}>Позиция</Note>
    <Note x={435} y={642} size={77} bold color={shares===200 ? red : ink}>{shares} акций</Note>
    {shares===200 && <path d="M253 617 L630 592" stroke={red} strokeWidth={5}/>}
    {guarded && <Reveal time={time} at={24000}><path d="M128 739 q274 14 572 -2" stroke={yellow} strokeWidth={6} fill="none"/>
      <Note x={418} y={718} color={green} size={35} bold>ON CONFLICT DO NOTHING</Note></Reveal>}
  </Sheet>;
}
