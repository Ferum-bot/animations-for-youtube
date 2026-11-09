import React from 'react';
import {progress, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, type Route} from '../../shared/architecture/Routes';
import {Bubble, RecordPage} from '../../animations/p02-a06-storage-and-workload/Paper';
import {message} from '../../animations/p02-a06-storage-and-workload/scene';
import {cue} from './score';

export function Rates({time}: {readonly time: number}) {
  return <g>
    <text x={80} y={530} fontSize={154} fontWeight={760}>90%</text>
    <text x={84} y={625} fontSize={65}>запросов — запись</text>
    {time >= cue.percent && [['10','9'],['100 000','90 000']].map(([total,writes],i) =>
      <g key={total} transform={`translate(82 ${835+i*220})`}>
        <text fontSize={51} fill={ink.muted}>{total} запросов/с</text>
        <text y={85} fontSize={70} fontWeight={720} opacity={progress(time,cue.rate,cue.rate+350)}>{writes} записей/с</text>
      </g>)}
    {time >= cue.keys && <text x={80} y={1410} fontSize={49}>
      {time >= cue.guarantees ? 'Размер данных · ключи · гарантии' : 'Размер данных · ключи'}
    </text>}
  </g>;
}

const historyRoute: Route = {from:{x:550,y:520},via:{x:865,y:605},to:{x:840,y:796}};
const searchRoute: Route = {from:{x:550,y:520},via:{x:970,y:670},to:{x:910,y:1170}};

export function QueryModel({time}: {readonly time: number}) {
  const history = ['chat_id = 42'];
  const search = ['слово = «метро»'];
  if (time >= cue.writeHistory+800) history.push(`№ ${message.id} · ${message.edited}`);
  if (time >= cue.writeSearch+800) search.push('чат 42 → № 109');
  return <g>
    <Bubble x={80} y={345} scale={1.5}/>
    <RecordPage x={80} y={796} title="История чата" rows={history} width={826} height={185}/>
    {time >= cue.search && <RecordPage x={80} y={1140} title="Поиск по слову" rows={search} width={826} height={185}/>}
    <Delivery route={historyRoute} timeMs={time} start={cue.writeHistory} duration={800}/>
    <Delivery route={searchRoute} timeMs={time} start={cue.writeSearch} duration={800}/>
    {time >= cue.copies && <text x={80} y={1500} fontSize={51} fontWeight={650}>Одно сообщение — две записи</text>}
  </g>;
}

const chats = [42,17,58] as const;
const spaced = [42,17,58,42,17,58] as const;
const busy = [42,42,42,17,42,42,42,42,58,42,42] as const;

export function PartitionLoad({time}: {readonly time: number}) {
  const hot = time >= cue.hot;
  const events = hot ? busy : spaced;
  const step = hot ? 335 : 625;
  const start = (hot ? cue.hot : cue.distribution) + 250;
  const seen = events.slice(0, Math.max(0,1+Math.floor((time-start)/step)));
  return <g>
    <text x={80} y={462} fontSize={53} fontWeight={670}>Ключ партиции — chat_id</text>
    {chats.map((chat,i) => <g key={chat} transform={`translate(80 ${700+i*185})`}>
      <text fontSize={58}>чат {chat}</text>
      {seen.filter(id=>id===chat).map((_,n) => <path key={n} d={`M${250+n*57} -49 h43 v57 h-43 Z`}
        fill={hot && chat===42 ? ink.primary : ink.text}/>)}
    </g>)}
    <text x={80} y={1285} fontSize={50}>{hot ? 'Растёт нагрузка на реплики чата 42' : 'Каждая отметка — одна запись'}</text>
  </g>;
}

export function Maintenance({time}: {readonly time: number}) {
  return <g>
    <text x={80} y={488} fontSize={62} fontWeight={680}>Место на диске узла</text>
    <RecordPage x={80} y={705} width={800} height={185} title="SSTable на диске" rows={['Файл 1', 'Файл 2']}/>
    {time >= cue.compaction && <RecordPage x={80} y={1060} width={800} height={142}
      title="Compaction" rows={['Записываем новый файл']} marked/>}
    {time >= cue.repair && <text x={80} y={1390} fontSize={49}>
      {time >= cue.team ? 'Команда планирует место и repair' : 'Repair сверяет данные реплик'}
    </text>}
  </g>;
}

export function Lookup({time}: {readonly time: number}) {
  const found = time >= cue.result;
  return <g>
    <text x={80} y={490} fontSize={57} fontWeight={650}>Последнее сообщение</text>
    <RecordPage x={80} y={755} width={820} height={215} title="История · chat_id = 42"
      rows={['109 · '+message.edited,'108 · Ты у метро?']} marked={found}/>
    {found && <g opacity={progress(time,cue.result,cue.result+350)}><Bubble x={80} y={1120} scale={1.6}/></g>}
  </g>;
}
