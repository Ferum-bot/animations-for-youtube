import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {RecordPage} from './Paper';
import {message,t,type ShotProps} from './scene';

const returnRow:Route={from:{x:1400,y:704},via:{x:1150,y:864},to:{x:917,y:707}};
export const Workload:React.FC<ShotProps>=({timeMs})=>{
  if(timeMs>=t.lookup) return <g>
    <Title>Последнее сообщение чата</Title>
    <RecordPage x={230} y={510} title="Приложение" rows={timeMs>=t.result?['Чат 42',message.edited]:['Чат 42']} marked={timeMs>=t.result}/>
    <RecordPage x={1400} y={510} width={890} title="История по chat_id" rows={['42 · №109 · '+message.edited,'42 · №108 · Ты у метро?']}/>
    <RouteLine route={returnRow}/><Delivery route={returnRow} timeMs={timeMs} start={t.result-890} duration={890}/>
    <text x={1400} y={969} fontSize={52}>Первая строка партиции 42</text>
  </g>;
  return <g>
    <Title>Как выбрать базу?</Title>
    <text x={260} y={424} fontSize={58} fill={ink.muted}>Два примера нагрузки</text>
    {[{x:260,total:'10 запросов/с',writes:'9 записей/с'},{x:1390,total:'100 000 запросов/с',writes:'90 000 записей/с'}].map(item=>
      <g key={item.x} transform={`translate(${item.x} 615)`}>
        <text fontSize={73} fontWeight={650}>90% записей</text>
        {timeMs>=t.volumes && <g><text y={130} fontSize={59}>{item.total}</text><text y={231} fontSize={69} fontWeight={650}>{item.writes}</text></g>}
      </g>)}
    {timeMs>=t.keys && <text x={262} y={1136} fontSize={56}>
      {timeMs>=t.guarantees?'Объём данных · нагрузка по ключам · гарантии операций':'Объём данных · нагрузка по ключам'}</text>}
  </g>;
};
