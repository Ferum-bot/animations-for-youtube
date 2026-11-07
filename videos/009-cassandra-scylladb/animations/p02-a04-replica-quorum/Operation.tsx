import React from 'react';
import {MessageIcon, progress, v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import type {Route} from '../../shared/architecture/Routes';
import {Note, reverse, Transit} from './Drawings';
import {cue, levelAt, newBody, oldBody, receiptMs, replicas, type ShotProps} from './scene';

const x = (i:number) => 336+i*735;
const y = 340;
const bottom = 1000;
const wire = (i:number):Route => ({
  from:{x:1280,y:bottom},via:{x:x(i)+240,y:832},to:{x:x(i)+240,y:y+245},
});
const caller:Route = {from:{x:682,y:1102},via:{x:870,y:1102},to:{x:1086,y:1102}};

const Reply: React.FC<{value:string; caption:string}> = ({value,caption}) =>
  <MessageIcon x={205} y={977} scale={1.45}>
    <text x={28} y={60} fontSize={26} fill={ink.muted}>{caption}</text>
    <text x={28} y={119} fontSize={33} fontWeight={650}>{value}</text>
  </MessageIcon>;

const Threshold: React.FC<ShotProps> = ({timeMs}) => {
  const {name,required} = levelAt(timeMs);
  return <g>
    <Title>Сколько подтверждений ждать?</Title>
    <text x={260} y={375} fontSize={59}>Получатели записи</text>
    {replicas.map((host,i) => <Note key={host} host={host} x={260+i*740} y={450} detail="чат 42" scale={0.92} />)}
    {timeMs < cue.one ? <text x={260} y={1000} fontSize={83} fontWeight={600}>{timeMs < cue.count ? 'Consistency level' : 'Порог для ответа клиенту'}</text> :
      <g transform="translate(260 990)">
        <text fontSize={108} fontWeight={650}>{name}</text>
        <text x={745} fontSize={81}>{required} из 3</text>
        {[0,1,2].map(i => <g key={i} transform={`translate(${1390+i*145} -31)`}>
          <circle r={42} fill={i<required ? ink.primary : 'none'} stroke={i<required ? ink.primary : ink.muted} strokeWidth={4}/>
          {i<required && <path d="M-20 0 l14 15 28 -33" stroke={ink.text} strokeWidth={7} fill="none" strokeLinecap="round"/>}
        </g>)}
      </g>}
  </g>;
};

export const Write: React.FC<ShotProps> = ({timeMs}) => {
  if (timeMs >= cue.levels && timeMs < cue.incident) return <Threshold timeMs={timeMs}/>;
  const incident = timeMs >= cue.incident;
  const start = incident ? cue.incident : cue.send;
  const complete = timeMs >= cue.success;
  return <g>
    <Title>{incident ? 'Запись с QUORUM' : 'Запись в чат 42'}</Title>
    {replicas.map((host,i) => {
      const down = incident && host === 'C';
      const arrival = host === 'C' ? Infinity : receiptMs[host]-650;
      const planned = wire(i);
      const r = down ? {...planned, to:{x:planned.to.x,y:planned.to.y+80}} : planned;
      return <g key={host}>
        {incident ? <Transit route={r} timeMs={timeMs} start={start} duration={down ? 850 : arrival-start} /> :
          timeMs>=cue.send && <path d={`M${r.from.x} ${r.from.y} Q${r.via.x} ${r.via.y} ${r.to.x} ${r.to.y}`}
            stroke={ink.muted} strokeWidth={4} fill="none" pathLength={1} strokeDasharray="1"
            strokeDashoffset={1-progress(timeMs,cue.send,cue.send+750)}/>}
        {down && timeMs>=start+850 && <path d={`M${r.to.x-15} ${r.to.y-15} l30 30 m0 -30 l-30 30`}
          stroke={ink.text} strokeWidth={6} fill="none"/>}
        {incident && host !== 'C' && <Transit route={reverse(r)} timeMs={timeMs} start={arrival+100}
          duration={550} kind="ack" showLine={false} />}
        <Note host={host} x={x(i)} y={y} detail="чат 42 · №107" scale={0.92}
          value={timeMs >= arrival ? newBody : oldBody} offline={down} />
      </g>;
    })}
    {!incident && <Transit route={caller} timeMs={timeMs} start={cue.write+800} />}
    <Note host="D" x={1086} y={bottom} scale={0.74} detail="координатор" />
    <Reply value={complete && timeMs>=cue.success+700 ? 'Сохранено' : newBody}
      caption={complete && timeMs>=cue.success+700 ? 'ответ приложению' : 'правка №107'} />
    {complete && <Transit route={reverse(caller)} timeMs={timeMs} start={cue.success} duration={700} kind="ack" />}
    {timeMs >= cue.wait && <text x={1590} y={1145} fontSize={62} fontWeight={600}>
      {incident ? `Ответы  ${Number(timeMs>=receiptMs.A)+Number(timeMs>=receiptMs.B)} / 2` : 'Ждать всех троих?'}</text>}
  </g>;
};

export const Read: React.FC<ShotProps> = ({timeMs}) => {
  const picked = timeMs >= cue.askC;
  const returned = timeMs >= cue.oldReply;
  const replyInApp = timeMs >= cue.oldReply+900;
  return <g>
    <Title>{timeMs>=cue.readOne ? 'Чтение с ONE' : 'Чтение сообщения №107'}</Title>
    {replicas.map((host,i) => {
      const r=wire(i);
      return <g key={host}>
        {picked && host==='C' && <g>
          <Transit route={r} timeMs={timeMs} start={cue.askC} duration={800} kind="read"/>
          <Transit route={reverse(r)} timeMs={timeMs} start={cue.oldReply-900} duration={900} showLine={false}/>
        </g>}
        {timeMs>=cue.lookup && timeMs<cue.readOne && <g>
          <path d={`M${x(i)+95} 653 h285`} stroke={ink.muted} strokeWidth={4} strokeDasharray="7 9"/>
          {timeMs>=cue.availability && <text x={x(i)+237} y={746} textAnchor="middle" fontSize={49}>
            {host==='C' ? 'Недоступна' : 'Доступна'}</text>}
        </g>}
        <Note host={host} x={x(i)} y={y} scale={0.92} detail="чат 42 · №107"
          offline={host==='C' && timeMs<cue.back} value={host==='C' ? oldBody : newBody}
          marked={picked && host==='C'} />
      </g>;
    })}
    {timeMs >= cue.readCoordinator && <g>
      <Note host="F" x={1086} y={bottom} scale={0.74} detail="координатор" value={returned ? oldBody : undefined}/>
      <Transit route={caller} timeMs={timeMs} start={cue.readCoordinator} kind="read" />
      {returned && <Transit route={reverse(caller)} timeMs={timeMs} start={cue.oldReply} duration={900} showLine={false}/>}
    </g>}
    <Reply caption={replyInApp ? 'ответ приложению' : 'запрос приложения'} value={replyInApp ? oldBody : 'Прочитать №107'} />
    {timeMs >= cue.lookup && <g transform="translate(1610 1080)" fontSize={52}>
      <text>{timeMs < cue.availability ? 'Реплики чата 42' : timeMs < cue.readOne ? 'Выбор реплики' : 'Достаточно 1 ответа'}</text>
      {timeMs>=cue.availability && timeMs<cue.readOne &&
        <text y={78} fontSize={44} fill={ink.muted}>Доступность и задержка</text>}
      {replyInApp && <text y={78} fill={ink.muted}>Версия до правки</text>}
    </g>}
  </g>;
};
