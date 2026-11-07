import React from 'react';
import {mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {Note} from '../../shared/architecture/ReplicaNote';
import {Title} from '../../shared/architecture/Title';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {replicas} from '../../shared/architecture/chat107';
import {Bubble,RecordPage} from './Paper';
import {message,t,type ShotProps} from './scene';

const towardLog:Route={from:{x:612,y:686},via:{x:765,y:686},to:{x:894,y:570}};
const towardMemory:Route={from:{x:612,y:736},via:{x:675,y:997},to:{x:894,y:1008}};
const toDisk:Route={from:{x:1510,y:1020},via:{x:1670,y:1020},to:{x:1760,y:1020}};

export const Inside:React.FC<ShotProps>=({timeMs})=>{
  const zoom=progress(timeMs,t.local,t.local+760);
  return <g>
    <Title>{timeMs<t.local ? 'Кластер Cassandra' : 'Внутри реплики A'}</Title>
    {replicas.map((host,i)=> <g key={host} opacity={i===0 ? 1 : 1-zoom}>
      <Note x={mix(272+i*745,i===0 ? 360 : 272+i*745,zoom)} y={mix(552,543,zoom)}
        scale={i===0 ? mix(0.96,1.42,zoom) : 0.96} host={host} detail="чат 42" offline={i>0}/>
    </g>)}
    {timeMs>=t.local+760 && <g transform="translate(1320 680)">
      <text fontSize={90} fontWeight={650}>{timeMs<t.lsm ? 'Новая запись' : 'LSM'}</text>
      <text y={105} fontSize={50} fill={ink.muted}>{timeMs<t.lsm ? 'Сообщение №109' : 'Log-Structured Merge Tree'}</text>
    </g>}
  </g>;
};

const previous='108 · Ты у метро?';
const row=(body:string)=>`${message.id} · ${body}`;
export const Storage:React.FC<ShotProps>=({timeMs})=>{
  const edited=timeMs>=t.update;
  const inLog=timeMs>=t.journal+750;
  const inRam=timeMs>=t.memory+750;
  const flushed=timeMs>=t.sealed;
  const hasEdit=timeMs>=t.update+1500;
  const logRows=[previous];
  if(inLog) logRows.push(row(message.initial));
  if(timeMs>=t.update+750) logRows.push(row(message.edited));
  const memoryRows=flushed ? (hasEdit ? [row(message.edited)] : []) :
    (inRam ? [row(message.initial),previous] : [previous]);
  return <g>
    <Title>{timeMs<t.update ? 'Путь записи' : 'Правка того же сообщения'}</Title>
    <Bubble x={143} y={605} scale={1.47} body={edited ? message.edited : message.initial}/>
    {timeMs>=t.journal && <g><RouteLine route={towardLog}/>
      <Delivery route={towardLog} timeMs={timeMs} start={edited?t.update:t.journal} duration={750}/>
      <RecordPage x={895} y={438} width={660} height={290} title="Commit log" rows={logRows}/>
    </g>}
    {timeMs>=t.memory && <g><RouteLine route={towardMemory}/>
      <Delivery route={towardMemory} timeMs={timeMs} start={edited?t.update+750:t.memory} duration={750}/>
      <RecordPage x={895} y={890} width={615} title="Memtable · память" rows={memoryRows}/>
    </g>}
    {timeMs>=t.flush && <g><RouteLine route={toDisk}/>
      <Delivery route={toDisk} timeMs={timeMs} start={t.flush} duration={t.sealed-t.flush}/>
      <RecordPage x={1760} y={890} width={620} title="SSTable · диск" marked={flushed}
        rows={flushed ? [row(message.initial),previous] : []}/>
    </g>}
  </g>;
};

export const SyncModes:React.FC<ShotProps>=({timeMs})=><g>
  <Title>Когда реплика подтверждает запись?</Title>
  <text x={250} y={392} fontSize={58}>Синхронизация commit log</text>
  {['batch','periodic'].map((mode,i)=>{
    const y=665+i*340;
    const events=i===0?['fsync','ACK']:['ACK','fsync'];
    return <g key={mode}>
      <text x={252} y={y+20} fontSize={69} fontWeight={650}>{mode}</text>
      <path d={`M770 ${y} h1370 l-22 -15 m22 15 l-22 15`} stroke={ink.muted} strokeWidth={5} fill="none"/>
      {events.map((event,j)=>timeMs>=t.ack+j*950 && <g key={event} transform={`translate(${995+j*784} ${y})`}>
        <circle r={17} fill={event==='ACK'?ink.primary:ink.text}/>
        <text y={-54} textAnchor="middle" fontSize={65} fontWeight={620}>{event}</text>
      </g>)}
    </g>;
  })}
</g>;

export const Wal:React.FC<ShotProps>=({timeMs})=>{
  const failed=timeMs>=t.crash, restored=timeMs>=t.redo+800;
  const route:Route={from:{x:937,y:888},via:{x:1290,y:1110},to:{x:1610,y:888}};
  return <g>
    <Title>PostgreSQL</Title>
    <text x={282} y={388} fontSize={65} fontWeight={600}>{failed ? 'Восстановление после сбоя' : 'Та же правка №109'}</text>
    <RecordPage x={282} y={635} width={765} title={timeMs>=t.wal?'WAL':'Журнал'}
      rows={timeMs>=t.wal?['109 · Встреча у метро']:[]} marked={timeMs>=t.commit}/>
    {timeMs>=t.buffer && <RecordPage x={1460} y={635} width={790} title={failed?'Страница после сбоя':'Страница в памяти'}
      rows={[failed&&!restored ? row(message.initial) : row(message.edited)]}/>}
    {timeMs>=t.commit && !failed && <text x={283} y={1070} fontSize={54}>COMMIT · WAL на диске</text>}
    {failed && <g><RouteLine route={route}/><Delivery route={route} timeMs={timeMs} start={t.redo} duration={800}/>
      <text x={1280} y={1185} textAnchor="middle" fontSize={55}>{restored?'Правка восстановлена':'Повтор из WAL'}</text></g>}
  </g>;
};
