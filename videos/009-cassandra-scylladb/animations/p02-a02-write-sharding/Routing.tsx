import React from 'react';
import {Sheet, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {Book} from './Paper';
import {Title} from '../../shared/architecture/Title';
import {shardRow, t, type SceneProps} from './scene';

const source = {x:920,y:700};
const address = (y: number): Route => ({from:source, via:{x:1180,y:700}, to:{x:1610,y}});
const routes = {A: address(395), B:address(775), C:address(1155)};
const reverse = (r: Route): Route => ({from:r.to,via:r.via,to:r.from});
const move: Route = {from:{x:2025,y:775},via:{x:2410,y:950},to:{x:2025,y:1155}};

export const Routing: React.FC<SceneProps> = ({timeMs}) => {
  const added = timeMs >= t.transfer, switched = timeMs >= t.switchOwner;
  const reading = timeMs >= t.multiRead;
  const rowA = shardRow(42,timeMs), rowB = shardRow(17,timeMs);
  const selected = switched ? routes.C : routes.B;
  return <g>
    <Title>{reading ? 'Один запрос к двум шардам' : 'PostgreSQL'}</Title>
    <RouteLine route={routes.A} /><RouteLine route={selected} />
    <Book x={1610} y={294} label="primary A" entries={[rowA]} scale={0.79} />
    <Book x={1610} y={674} label="primary B" entries={timeMs >= t.switchOwner+550 ? [] : [rowB]} scale={0.79} />
    {added && <Book x={1610} y={1054} label="primary C" entries={timeMs>=t.transfer+1350?[rowB]:[]} scale={0.79} />}
    {added && !switched && <g><RouteLine route={move} />
      <Delivery route={move} timeMs={timeMs} start={t.transfer} duration={1350} />
      <text x={2260} y={958} fontSize={39}>чат 17</text>
    </g>}
    {!reading && <Delivery route={routes.B} timeMs={timeMs} start={t.lookup} duration={1300} kind="read" />}
    {reading && [routes.A,routes.C].map((r,i) => <g key={i}>
      <Delivery route={r} timeMs={timeMs} start={t.multiRead+i*130} duration={920} kind="read" />
      <Delivery route={reverse(r)} timeMs={timeMs} start={t.multiRead+1020+i*430} duration={1000} />
    </g>)}
    <text x={200} y={487} fontSize={55} fontWeight={600}>{reading ? 'Последние сообщения' : 'Маршруты приложения'}</text>
    <Sheet x={190} y={540} width={730} height={345}>
      <g fontSize={52} fontWeight={600}>
        <text x={65} y={126}>чат 42</text>
        <text x={65} y={259}>чат 17</text>
        {!reading ? <>
          <text x={390} y={126}>→ A</text>
          <text x={390} y={259}>→ {switched?'C':'B'}</text>
          {timeMs >= t.lookup && <path d="M390 279 H497" stroke={ink.primary} strokeWidth={7} />}
        </> : <g fontSize={49}>
          {timeMs>=t.multiRead+2020 && <text x={340} y={126}>{rowA.body}</text>}
          {timeMs>=t.multiRead+2450 && <text x={340} y={259}>{rowB.body}</text>}
        </g>}
      </g>
    </Sheet>
  </g>;
};
