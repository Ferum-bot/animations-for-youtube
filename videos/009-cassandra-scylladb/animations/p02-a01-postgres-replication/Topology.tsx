import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {Delivery, Ledger, Note, Reader, RouteLine, type Route} from './Drawing';
import {timing as t, type SceneProps} from './scene';

const primary = {x: 207, y: 580};
const standby = (y: number, shipDelay: number, replayDelay: number, reads: readonly number[]) => {
  const x = 1470;
  const wal: Route = {from: {x: primary.x + 530, y: 717}, via: {x: 1110, y: 717}, to: {x: x + 4, y: y + 137}};
  const read: Route = {from: {x: x + 531, y: y + 126}, via: {x: 2100, y: y + 126}, to: {x: 2190, y: y + 126}};
  return {x, y, wal, read, shipDelay, replayDelay, reads};
};
const copies = [
  standby(310, 0, 0, [t.moreReaders + 300, t.scaleReads, t.standbyReads]),
  standby(890, 470, 700, [t.moreReaders + 1600, t.scaleReads + 1450, t.standbyReads + 1450]),
] as const;
const writeRoute: Route = {from: {x: 478, y: 331}, via: {x: 478, y: 406}, to: {x: 478, y: 500}};

export const Topology: React.FC<SceneProps> = ({timeMs}) => {
  const intro = timeMs < t.messenger;
  const reader = !intro && timeMs >= t.moreReaders;
  const dc = timeMs >= t.otherSite && timeMs < t.leader;
  const leader = timeMs >= t.leader;
  const ship = intro ? t.wal : t.ship;
  const replay = intro ? t.wal + 2020 : t.replay;
  const beforeReplay = intro ? undefined : 'question';
  const afterReplay = intro ? 'question' : 'office';
  const incomingWrite = leader || (intro && timeMs >= t.compare && timeMs < t.wal);
  const writeAt = intro ? t.namePrimary : t.leaderWrite;
  const title = timeMs >= t.singleLeader ? 'Single-leader replication' : 'PostgreSQL';
  return <g>
    <text x={180} y={162} fontSize={78} fontWeight={650}>{title}</text>
    {copies.map(copy => <RouteLine key={copy.y} route={copy.wal} />)}
    <text x={1030} y={730} textAnchor="middle" fontSize={48} fill={ink.text}
      stroke={ink.background} strokeWidth={20} paintOrder="stroke">WAL</text>
    {dc ? <g>
      <path d="M1375 767 H2390" stroke={ink.muted} strokeWidth={4} strokeDasharray="14 18" />
      <text x={2095} y={879} fontSize={35}>Другой ЦОД</text>
    </g> : null}
    <Ledger {...primary} role="primary" value={intro && timeMs < writeAt + 1050 ? undefined : afterReplay} />
    {incomingWrite ? <g>
      <Note x={478} y={306}>запись</Note><RouteLine route={writeRoute} />
      <Delivery route={writeRoute} timeMs={timeMs} start={writeAt} />
    </g> : null}
    {copies.map(pos => {
      const logged = timeMs >= ship + 1150 + pos.shipDelay && timeMs < replay + pos.replayDelay;
      return <g key={pos.y}>
        <Ledger x={pos.x} y={pos.y} role="standby" value={timeMs < replay + pos.replayDelay ? beforeReplay : afterReplay} wal={logged} />
        <Delivery route={pos.wal} timeMs={timeMs} start={ship + pos.shipDelay} duration={1150} />
        {reader ? <>
          <Reader x={2270} y={pos.y + 118} scale={0.9} />
          <RouteLine route={pos.read} />
          {pos.reads.map(start =>
            <Delivery key={start} route={pos.read} timeMs={timeMs} start={start} kind="read" />)}
        </> : null}
      </g>;
    })}
    {leader && copies.map(copy => <Delivery key={copy.y} route={copy.wal}
      timeMs={timeMs} start={t.leaderWrite + 1200 + copy.shipDelay} />)}
  </g>;
};
