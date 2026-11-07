import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {Bubble,RecordPage} from './Paper';
import {message,t,type ShotProps} from './scene';

const history:Route={from:{x:727,y:697},via:{x:1040,y:697},to:{x:1380,y:472}};
const search:Route={from:{x:727,y:760},via:{x:1020,y:760},to:{x:1380,y:972}};
export const QueryTables:React.FC<ShotProps>=({timeMs})=>{
  const design=timeMs>=t.developer;
  const second=timeMs>=(design?t.secondTable:t.word);
  const writing=!design && timeMs>=t.model;
  return <g>
    <Title>{design ? 'Какие запросы нужны приложению?' : 'Одно сообщение, два запроса'}</Title>
    <Bubble x={215} y={620}/>
    {[{name:'История чата',key:'chat_id = 42',value:'109 · Встреча у метро',route:history,y:342},
      {name:'Поиск по слову',key:'слово = «метро»',value:'чат 42 → №109',route:search,y:842}].slice(0,second?2:1).map((item,i)=>{
      const start=t.model+i*700;
      const filled=design || timeMs>=start+850;
      return <g key={item.name}>
        <RouteLine route={item.route}/>
        {writing && <Delivery route={item.route} timeMs={timeMs} start={start} duration={850}/>}
        <RecordPage x={1380} y={item.y} width={900} height={240} title={item.name} rows={filled?[item.key,item.value]:[item.key]}
          marked={timeMs>=t.query&&!design}/>
      </g>;
    })}
    {!design && timeMs>=t.copies && <text x={224} y={1130} fontSize={54}>Две записи для №109</text>}
    {design && timeMs>=t.cl && <text x={224} y={1130} fontSize={54}>Запись с QUORUM</text>}
  </g>;
};

export const Transaction:React.FC<ShotProps>=({timeMs})=><g>
  <Title>Сообщение и уведомление</Title>
  <text x={260} y={400} fontSize={62} fontWeight={650}>{timeMs<t.independent?'PostgreSQL':'Две партиции Cassandra'}</text>
  <RecordPage x={265} y={606} width={890} title="Чат 42" rows={['№109 · '+message.edited]}/>
  <RecordPage x={1395} y={606} width={875} title="Получатель 17" rows={timeMs<t.independent?['Уведомление о №109']:['Доставка ожидается']}/>
  {timeMs<t.independent ? <g>
    <path d="M275 918 v69 h1980 v-69" fill="none" stroke={ink.primary} strokeWidth={8}/>
    <text x={1265} y={1120} textAnchor="middle" fontSize={68}>Один COMMIT</text>
  </g> : <g fontSize={54}>
    <text x={270} y={1035}>Сообщение записано</text>
    <text x={1398} y={1035}>Как повторить доставку?</text>
  </g>}
</g>;
