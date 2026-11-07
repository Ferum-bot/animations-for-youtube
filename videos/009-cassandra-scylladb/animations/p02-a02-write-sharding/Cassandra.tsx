import React from 'react';
import {MessageIcon, v2Theme as ink} from '@channel/motion-v2';
import {Delivery, RouteLine, type Route} from '../../shared/architecture/Routes';
import {Book} from './Paper';
import {Title} from '../../shared/architecture/Title';
import {shardRow, t, type SceneProps} from './scene';

const nodes = [{name:'A',x:265},{name:'B',x:1015},{name:'C',x:1765}] as const;
const top = 775;
export const Cassandra: React.FC<SceneProps> = ({timeMs}) => {
  const second = timeMs >= t.secondWrite;
  const start = second ? t.secondWrite : t.firstWrite;
  const via = second ? nodes[0] : nodes[1];
  const active = timeMs>=start && timeMs<start+3650;
  const last = shardRow(42,t.cassandra).body;
  const change = second ? 'Ты где?' : 'На платформе';
  const inbound: Route = {from:{x:via.x+268,y:559},via:{x:via.x+495,y:620},to:{x:via.x+500,y:top}};
  return <g>
    <Title>Cassandra</Title>
    <text x={175} y={252} fontSize={49}>{timeMs < t.firstWrite ? 'Реплики чата 42' : 'Leaderless replication'}</text>
    {active && <g>
      <RouteLine route={inbound} />
      <MessageIcon x={via.x+72} y={335} scale={1.15}>
        <text x={32} y={68} fontSize={29} fill={ink.muted}>чат 42</text>
        <text x={32} y={120} fontSize={33} fontWeight={600}>{change}</text>
      </MessageIcon>
      <Delivery route={inbound} timeMs={timeMs} start={start+300} duration={720} />
    </g>}
    {nodes.map((n,i) => {
      const local = n.name === via.name;
      const delay = local ? 1020 : 2250 + i*220;
      const value = timeMs>=start+delay ? change : second ? 'На платформе' : last;
      const bow = Math.abs(via.x - n.x) > 800 ? 545 : 200;
      const outgoing: Route = {from:{x:via.x+265,y:top+268},
        via:{x:(via.x+n.x)/2+265,y:top+268+bow},to:{x:n.x+265,y:top+268}};
      return <g key={n.name}>
        {!local && active && timeMs>=start+1020 && <g>
          <RouteLine route={outgoing} /><Delivery route={outgoing} timeMs={timeMs} start={start+1020} duration={delay-1020} />
        </g>}
        <Book x={n.x} y={top} label={`Узел ${n.name}`} entries={[{chat:42,body:value}]} />
        {local && active && timeMs>=start+1020 && <text x={n.x+226} y={top-39} fontSize={36} fill={ink.muted}>координатор</text>}
      </g>;
    })}
  </g>;
};
