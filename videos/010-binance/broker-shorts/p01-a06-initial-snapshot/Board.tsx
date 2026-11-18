import React from 'react';
import {mix,progress} from '@channel/motion-v2';
import type {BoardProps} from '../../shared/vertical/BrokerShort';
import {blue,Database,green,ink,Note,paper,Phone,Reveal,Route,Sheet} from '../../shared/vertical/drawing';

export function Board({time,...layout}: BoardProps) {
  const snapshot=progress(time,10600,11750);
  const update=progress(time,20300,22050);
  const phoneValue=update===1 ? '$51' : '$50';
  return <Sheet {...layout} title="Цена до первой сделки">
    <rect x={54} y={158} width={223} height={107} rx={14} strokeDasharray="7 8" stroke={ink} strokeWidth={3} fill={paper}/>
    <Note x={166} y={222} bold>Биржа</Note>
    <Database x={567} y={200} scale={1.2}/><Note x={567} y={293} bold>Сервис цен</Note>
    <Route x1={284} y1={201} x2={501} y2={201} time={time} at={3000}/>
    <Reveal time={time} at={3580}><Note x={397} y={172} size={28} color={blue}>AAPL · {update>.25 ? '$51' : '$50'}</Note></Reveal>
    <Phone x={199} y={498}>
      <Note x={0} y={-51} size={29} bold>AAPL</Note>
      <Note x={0} y={19} size={41} color={blue} bold>{snapshot===1 ? phoneValue : '—'}</Note>
      <Note x={0} y={72} size={21} color={blue}>{snapshot===1 ? 'Подключён' : 'Открываем'}</Note>
    </Phone>
    <Reveal time={time} at={4950}>
      <path d="M569 315 v44" stroke={ink} strokeWidth={3}/>
      <rect x={413} y={358} width={304} height={92} fill={paper} stroke={ink} strokeWidth={3}/>
      <Note x={563} y={416} size={33} bold>AAPL · {update>.25 ? '$51' : '$50'}</Note>
      <Note x={564} y={495} color={blue} pen>В памяти</Note>
    </Reveal>
    <Route x1={421} y1={450} x2={299} y2={510} time={time} at={10500}/>
    {snapshot>0 && snapshot<1 && <circle cx={mix(421,299,snapshot)} cy={mix(450,510,snapshot)} r={11} fill={blue}/>}
    <Reveal time={time} at={11000}><Note x={412} y={689} size={39} bold color={update===1 ? green : blue}>
      {update===1 ? 'Дальше — только изменения' : 'Сначала — снимок цен'}</Note></Reveal>
    {update>0 && update<1 && <circle cx={mix(421,299,update)} cy={mix(450,510,update)} r={11} fill={green}/>}
  </Sheet>;
}
