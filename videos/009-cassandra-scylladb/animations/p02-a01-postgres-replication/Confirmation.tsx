import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Delivery, Ledger, Note, Reader, RouteLine, type Route} from './Drawing';
import {timing as t, type SceneProps} from './scene';

const ship: Route = {from: {x: 880, y: 725}, via: {x: 1260, y: 670}, to: {x: 1640, y: 725}};
const ack: Route = {from: {x: 1640, y: 765}, via: {x: 1260, y: 879}, to: {x: 880, y: 765}};
const toClient: Route = {from: {x: 600, y: 864}, via: {x: 600, y: 968}, to: {x: 600, y: 1045}};

export const Confirmation: React.FC<SceneProps> = ({timeMs}) => {
  const sync = timeMs >= t.sync;
  const edited = timeMs >= (sync ? t.retryEdit : t.edit);
  const failed = !sync && timeMs >= t.loseDisk;
  const confirmed = timeMs >= (sync ? t.clientAck : t.localAck);
  const logged = sync && timeMs >= t.flush;
  if (timeMs >= t.closeup) return <ReplicaCloseup timeMs={timeMs} />;
  return <g>
    <text x={180} y={210} fontSize={85} fontWeight={650}>{sync ? 'Синхронная' : 'Асинхронная'} репликация</text>
    <RouteLine route={ship} />
    {sync && logged ? <RouteLine route={ack} /> : null}
    <Ledger x={350} y={590} role="primary" value={edited ? 'metro' : 'office'} failed={failed} />
    <Ledger x={1640} y={590} role="standby" value="office" wal={logged} />
    {sync ? <>
      <text x={1260} y={657} textAnchor="middle" fontSize={48}>WAL</text>
      <Delivery route={ship} timeMs={timeMs} start={t.sendWal} duration={t.flush - t.sendWal} />
      {logged ? <Note x={1900} y={972}>WAL сохранён</Note> : null}
      <Delivery route={ack} timeMs={timeMs} start={t.reply} duration={1550} kind="ack" />
    </> : timeMs >= t.staleRead ? <Note x={1900} y={972}>Читатель видит старый текст</Note> : null}
    {failed ? <Note x={600} y={972}>Диск потерян</Note> : null}
    {edited && !failed ? <RouteLine route={toClient} /> : null}
    <Delivery route={toClient} timeMs={timeMs} start={(sync ? t.clientAck : t.localAck) - 550} duration={550} kind="ack" />
    <Reader x={600} y={1137} scale={0.85} />
    <text x={705} y={1155} fontSize={46}>{confirmed ? 'Запись подтверждена' : 'Ждёт ответа'}</text>
  </g>;
};

const ReplicaCloseup: React.FC<SceneProps> = ({timeMs}) => {
  const applied = timeMs >= t.apply;
  return <g>
    <Ledger x={260} y={500} scale={1.68} role="standby" value={applied ? 'metro' : 'office'} wal />
    <g transform="translate(1410 520)">
      <path d="M4 8 L19 24 L51 -12" stroke={ink.primary} fill="none" strokeWidth={9} strokeLinecap="round" />
      <text x={88} y={33} fontSize={67} fontWeight={600}>WAL сохранён</text>
      <path d="M26 95 V235" stroke={ink.muted} fill="none" strokeWidth={4} />
      <text x={88} y={181} fontSize={43} fill={ink.muted}>применение WAL</text>
      {applied ? <path d="M4 311 L19 327 L51 291" stroke={ink.primary} fill="none" strokeWidth={9} strokeLinecap="round" /> : null}
      <text x={88} y={338} fontSize={67} fontWeight={600} fill={applied ? ink.text : ink.muted}>Видно читателю</text>
    </g>
  </g>;
};
