import React from 'react';
import {Sheet, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {Note} from '../../shared/architecture/ReplicaNote';
import {type Host} from '../../shared/architecture/chat107';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {RecordPage} from './Paper';
import {t,type ShotProps} from './scene';

const groups=[
  {chat:42,host:'A'}, {chat:17,host:'B'}, {chat:58,host:'C'},
] as const;
const arrivals=[0,1,2,1,0,2] as const;
const left=(i:number)=>225+554*i;
const fromQueue=(i:number):Route=>({from:{x:1180,y:531},via:{x:left(i)+196,y:620},to:{x:left(i)+196,y:800}});
const handoff:Route={from:{x:left(2)+390,y:918},via:{x:1810,y:900},to:{x:left(3),y:918}};

export const Distribution:React.FC<ShotProps>=({timeMs})=>{
  const adding=timeMs>=t.add, migrated=timeMs>=t.migrated;
  const hot=timeMs>=t.hot;
  const active=hot || timeMs>=t.flow;
  const moves=hot ? [0,0,0,0,0,0] : arrivals;
  const start=hot ? t.hot+950 : t.flow;
  const beat=hot?670:880;
  const step=Math.min(moves.length-1,Math.max(0,Math.floor((timeMs-start)/beat)));
  const currentGroup=groups[moves[step] ?? 0];
  if(!hot && timeMs>=t.ownership) return <Ownership/>;
  return <g>
    <Title>{hot ? 'Горячая партиция' : 'Куда пойдут записи?'}</Title>
    <text x={270} y={419} fontSize={65} fontWeight={600}>{hot?'Снова чат 42':'Сообщения чатов'}</text>
    <text x={270} y={508} fontSize={45} fill={ink.muted}>{hot?'Один ключ снова и снова':'42   ·   17   ·   58'}</text>
    {active && <Sheet x={955} y={410} width={450} height={120}>
      <text x={44} y={82} fontSize={57} fontWeight={600}>чат {currentGroup?.chat}</text>
    </Sheet>}
    {active && groups.map((g,i)=>{
      const target=i===2 && migrated ? 3 : i;
      const route=fromQueue(target);
      if(hot && i!==0) return null;
      return <g key={g.chat}><RouteLine route={route}/>
        {moves.map((index,j)=>index===i && <Delivery key={j} route={route} timeMs={timeMs} start={start+j*beat} duration={770}/>)}
      </g>;
    })}
    {adding && !hot && <g><RouteLine route={handoff}/><Delivery route={handoff} timeMs={timeMs} start={t.migrated-1180} duration={1180}/></g>}
    {(['A','B','C','D'] as const).slice(0,adding?4:3).map((host:Host,i)=>{
      let detail=groups.find(g=>g.host===host)?.chat;
      if(i===3 && migrated) detail=58;
      if(i===2 && migrated) detail=undefined;
      return <Note key={host} host={host} x={left(i)} y={800} scale={0.75}
        detail={detail===undefined?'диапазоны':`чат ${detail}`} marked={hot&&i===0}/>;
    })}
    <text x={237} y={1177} fontSize={47} fill={ink.muted}>{hot ? 'Нагрузка растёт у реплик чата 42' :
      'Показан первый владелец диапазона каждого ключа'}</text>
    {!hot && timeMs>=t.balanced && <text x={1460} y={415} fontSize={53}>
      {adding?'Добавляем узел D':'Разные partition key'}</text>}
  </g>;
};

const Ownership:React.FC=()=><g>
  <Title>Кто держит карту размещения?</Title>
  <RecordPage x={245} y={530} width={975} height={300} title="PostgreSQL с ручным шардингом"
    rows={['Чат 58 → шард D','Маршрут знает приложение']}/>
  <RecordPage x={1420} y={530} width={885} height={300} title="Cassandra"
    rows={['Токен → диапазон D','Карту ведёт кластер']}/>
</g>;

export const Maintenance:React.FC<ShotProps>=({timeMs})=>{
  const compact=timeMs>=t.compact, done=timeMs>=t.settled;
  const p=progress(timeMs,t.compact,t.settled);
  return <g>
    <Title>{compact?'Место для compaction':'Что планирует команда'}</Title>
    <text x={260} y={375} fontSize={53} fill={ink.muted}>Диск одной реплики</text>
    <g opacity={done ? 1-0.65*progress(timeMs,t.settled,t.settled+600) : 1}>
    <RecordPage x={260} y={590} width={620} title="SSTable 1" rows={['109 · Жду у метро','108 · Ты у метро?']}/>
    <RecordPage x={966} y={590} width={635} title="SSTable 2" rows={['109 · Встреча у метро']}/>
    </g>
    {compact && <g opacity={mix(0.34,1,p)}>
      <RecordPage x={1680} y={590} width={650} title="Новый файл" rows={p>0.8?['109 · Встреча у метро','108 · Ты у метро?']:p>0.3?['109 · Встреча у метро']:[]} marked={done}/>
    </g>}
    <text x={260} y={1055} fontSize={57}>{done?'Новый файл готов. Старые можно освободить.':
      compact?'Старые файлы остаются, пока пишется новый':timeMs>=t.repair?'Repair сверяет диапазоны между репликами':'Нужен запас свободного места'}</text>
  </g>;
};
