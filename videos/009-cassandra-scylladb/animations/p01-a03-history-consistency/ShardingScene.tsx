import React from 'react';
import {arrive, mix, presence} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme, MessageIcon, Pocket, Slip} from '../../shared/editorial-v2/illustration';
import {timing as t, type SceneProps} from './scene';

const UserRecord: React.FC<{readonly x: number; readonly y: number; readonly name: string}> = ({x, y, name}) =>
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 5 L320 0 L324 108 L3 114 Z" fill={theme.surface} stroke={theme.text} strokeWidth={4} />
    <text x={26} y={74} fontSize={44}>{name}</text>
  </g>;

const existingShards = [
  {name: 'Анна', initialX: 400, expandedX: 250},
  {name: 'Иван', initialX: 1050, expandedX: 790},
  {name: 'Олег', initialX: 1700, expandedX: 1330},
] as const;

export const ShardingScene: React.FC<SceneProps> = ({timeMs}) => {
  const expansion = arrive(timeMs, t.expand, 600);
  const transfer = arrive(timeMs, t.redistribute, 1100);
  const mysql = arrive(timeMs, t.mysql, 600);
  const scale = mix(1, 0.8, expansion);
  return <g opacity={presence(timeMs, t.alternatives, t.papers, 250)}>
    <g opacity={1 - mysql}>
      <text x={1280} y={370} textAnchor="middle" fontSize={78} fontWeight={600}>PostgreSQL / MySQL</text>
    </g>
    <g opacity={1 - mysql}>
      {existingShards.map((shard, i) => {
        const x = mix(shard.initialX, shard.expandedX, expansion);
        const entry = arrive(timeMs, t.shard + i * 450, 500);
        return <g key={shard.name}>
          <Pocket x={x} y={620} scale={scale} label={`Шард ${i + 1}`}>
            {i === 1 && timeMs >= t.redistribute ? null : <g opacity={entry}>
              <UserRecord x={75} y={mix(-155, 100, entry)} name={shard.name} />
            </g>}
          </Pocket>
        </g>;
      })}
      <g opacity={expansion}>
        <Pocket x={1870} y={620} scale={0.8} label="Шард 4">
          {transfer === 1 ? <UserRecord x={75} y={100} name="Иван" /> : null}
        </Pocket>
      </g>
      {timeMs >= t.redistribute && transfer < 1 ? <g transform={`translate(${mix(850, 1930, transfer)} ${700 - Math.sin(Math.PI * transfer) * 240}) scale(0.8)`}>
        <UserRecord x={0} y={0} name="Иван" />
      </g> : null}
    </g>
    <g opacity={mysql}>
      <text x={740} y={420} textAnchor="middle" fontSize={74} fontWeight={600}>MySQL</text>
      <Pocket x={435} y={520} scale={1.3} label="Сообщения">
        <MessageIcon x={80} y={-15} scale={0.9} />
        <MessageIcon x={65} y={35} scale={0.9} />
      </Pocket>
      <text x={740} y={1190} textAnchor="middle" fontSize={42}>Facebook</text>
      <g opacity={arrive(timeMs, t.largeIndex, 500)}>
        <text x={1820} y={470} textAnchor="middle" fontSize={56}>Поисковый индекс</text>
        {Array.from({length: 7}, (_, i) => <g key={i} opacity={arrive(timeMs, t.largeIndex + i * 90, 250)}>
          <Slip x={1480 + i * 10} y={560 + i * 42} width={610}
            word={i === 6 ? 'офиса' : ''} messageId={i === 6 ? '#42' : ''} />
        </g>)}
      </g>
    </g>
  </g>;
};
