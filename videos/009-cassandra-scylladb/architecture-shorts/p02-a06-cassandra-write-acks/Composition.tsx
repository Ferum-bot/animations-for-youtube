import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {Sheet, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {replicas, newBody} from '../../shared/architecture/chat107';
import {NotebookCover} from '../../shared/architecture/NotebookCover';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {cue, exchangeAt, levels} from './score';

function ReceiptKey({time, count}: {readonly time: number; readonly count: number}) {
  if (time >= cue.repeatOne) {
    const outage = time >= cue.outage;
    const required = outage ? 2 : 1;
    const ok = count >= required;
    return <g>
      <text x={80} y={1180} fontSize={70} fontWeight={720}>{outage ? 'QUORUM' : 'ONE'}</text>
      <text x={82} y={1290} fontSize={52}>Ответы реплик · {count} из 3</text>
      <text x={82} y={1430} fontSize={61} fontWeight={700}>{ok ? 'Клиент получил OK' : 'Клиент ждёт'}</text>
    </g>;
  }
  if (time < cue.consistency) return <text x={80} y={1240} fontSize={55} fontWeight={640}>
    {time >= cue.wait ? 'Ждать ответа от каждого?' : 'Три реплики чата 42'}
  </text>;
  return <g>
    <text x={80} y={1140} fontSize={51} fontWeight={650}>
      {time >= cue.threshold ? 'Сколько ответов нужно для OK?' : 'Consistency level'}
    </text>
    {levels.map(({name, required, at}, index) => time >= at && <g key={name} transform={`translate(80 ${1250 + index * 113})`}>
      <text fontSize={64} fontWeight={720}>{name}</text>
      <text x={475} fontSize={59} fontWeight={640}>{required} из 3</text>
    </g>)}
  </g>;
}

function Write({time}: {readonly time: number}) {
  const {send, receipts} = exchangeAt(time);
  const count = Object.values(receipts).filter(at => time >= at).length;
  const title = time >= cue.outage ? ['А если реплика C', 'недоступна?'] :
    time >= cue.repeatOne ? ['Запись с ONE'] : ['Сколько ответов', 'ждёт Cassandra?'];
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img" aria-label="Подтверждения записи в Cassandra"
    style={{fill: ink.text, fontFamily: ink.fontSans}}>
    <g fontSize={77} fontWeight={760} letterSpacing={-3}>
      {title.map((line, index) => <text key={line} x={72} y={183 + index * 87}>{line}</text>)}
    </g>
    <text x={83} y={432} fontSize={51} fontWeight={650}>Координатор</text>
    <Sheet x={83} y={470} width={810} height={135}>
      <text x={35} y={88} fontSize={54} fontWeight={650}>№ 107 · «{newBody}»</text>
    </Sheet>
    {replicas.map((host, index) => {
      const x = 200 + 292 * index;
      const unreachable = host === 'C' && time >= cue.outage;
      const route: Route = {from: {x: 494, y: 605}, via: {x, y: 728}, to: {x, y: unreachable ? 803 : 853}};
      const receipt = receipts[host];
      const received = time >= receipt;
      const offline = unreachable && time >= cue.offline;
      return <g key={host}>
        {time >= send && <g>
          <RouteLine route={route}/>
          <Delivery route={route} timeMs={time} start={send} duration={850}/>
          {Number.isFinite(receipt) && <Delivery route={{from: route.to, via: route.via, to: route.from}}
            timeMs={time} start={receipt - 540} duration={540} kind="ack"/>}
        </g>}
        <g transform={`translate(${x - 114} 853)`} opacity={offline ? 0.52 : 1}>
          <g transform="scale(0.43)"><NotebookCover/></g>
          <text x={42} y={81} fontSize={65} fontWeight={720}>{host}</text>
          {received && <g transform="translate(165 55)">
            <circle r={29} fill={ink.primary}/>
            <path d="M-14 0 l10 10 19 -22" fill="none" stroke={ink.text} strokeWidth={6} strokeLinecap="round"/>
          </g>}
        </g>
        {offline && <text x={x} y={1028} textAnchor="middle" fontSize={42}>нет связи</text>}
      </g>;
    })}
    <ReceiptKey time={time} count={count}/>
  </svg>;
}

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/cassandra-write-acks.m4a')}/>}
    <Write time={timeMs}/>
  </AbsoluteFill>;
}
