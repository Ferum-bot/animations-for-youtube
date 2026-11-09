import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile} from 'remotion';
import {useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, Ledger, Reader, RouteLine, type Route} from '../../animations/p02-a01-postgres-replication/Drawing';
import type {Row} from '../../animations/p02-a01-postgres-replication/scene';
import {FullEpisodeCard} from '../FullEpisodeCard';
import {cue, headings} from './score';

const ship: Route = {from: {x: 540, y: 962}, via: {x: 540, y: 1090}, to: {x: 540, y: 1220}};
const ack: Route = {from: {x: 690, y: 1220}, via: {x: 690, y: 1090}, to: {x: 690, y: 962}};
const client: Route = {from: {x: 460, y: 650}, via: {x: 460, y: 555}, to: {x: 460, y: 485}};

function Replication({time}: {readonly time: number}) {
  const sync = time >= cue.sync;
  const failed = !sync && time >= cue.diskLost;
  const edited = time >= (sync ? cue.retry : cue.asyncEdit);
  const logged = sync && time >= cue.flush;
  const ok = time >= (sync ? cue.syncOk : cue.asyncOk);
  const primaryValue: Row = edited ? 'metro' : time >= cue.firstWrite ? 'office' : 'question';
  const replicaValue: Row = time >= cue.replay ? 'metro' : time >= cue.firstReplay ? 'office' : 'question';
  const title = headings.reduce((current, next) => time >= next.at ? next : current, headings[0]);
  const label = ok ? 'Клиент получил OK' : edited ? 'Клиент ждёт ответа' : 'Клиент';
  const readout = time >= cue.replay ? 'Читаем: «У метро»' : logged ? 'WAL на диске реплики' :
    failed ? 'Правка потеряна' : time >= cue.read && !sync ? 'Читаем: «У офиса»' : '';
  return <svg viewBox="0 0 1080 1920" width="100%" height="100%" role="img"
    aria-label="Подтверждение записи в Postgres" style={{fill: ink.text, fontFamily: ink.fontSans}}>
    <g fontSize={78} fontWeight={760} letterSpacing={-3}>
      {title.lines.map((line, i) => <text key={i} x={72} y={183 + 88*i}>{line}</text>)}
    </g>
    <Reader x={140} y={426} scale={0.81}/>
    <text x={242} y={447} fontSize={54} fontWeight={650}>{label}</text>
    {edited && <RouteLine route={client}/>}
    <RouteLine route={ship}/>
    {sync && <RouteLine route={ack}/>}
    <Ledger x={145} y={650} scale={1.16} role="primary" value={primaryValue} failed={failed}/>
    <Ledger x={145} y={1220} scale={1.16} role="реплика" value={replicaValue} wal={logged}/>
    <Delivery route={ship} timeMs={time} start={cue.firstShip} duration={cue.firstReplay - cue.firstShip}/>
    {time >= cue.staleRead && !failed && !sync &&
      <Delivery route={ship} timeMs={Math.min(time, cue.staleRead + 1750)} start={cue.staleRead} duration={4200}/>}
    <Delivery route={ship} timeMs={time} start={cue.ship} duration={cue.flush - cue.ship}/>
    <Delivery route={ack} kind="ack" timeMs={time} start={cue.ack} duration={cue.primaryAck - cue.ack}/>
    <Delivery route={client} kind="ack" timeMs={time} start={sync ? cue.primaryAck : cue.asyncOk - 950}
      duration={sync ? cue.syncOk - cue.primaryAck : 950}/>
    <text x={160} y={1622} fontSize={54} fontWeight={630}>{readout}</text>
  </svg>;
}

export default function Composition({withAudio = true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  if (timeMs >= cue.endCard) return <FullEpisodeCard elapsedMs={timeMs - cue.endCard}/>;
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/architecture-shorts/postgres-replica-ack.m4a')}/>}
    <Replication time={timeMs}/>
  </AbsoluteFill>;
}
