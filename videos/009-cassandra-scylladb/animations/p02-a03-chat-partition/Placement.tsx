import React from 'react';
import {SourceImage, v2Theme as ink} from '@channel/motion-v2';
import {Title} from '../../shared/architecture/Title';
import {cue, type ShotProps} from './scene';
import {Ring} from './Ring';

export const Placement: React.FC<ShotProps> = ({timeMs}) => {
  const adding = timeMs >= cue.add, multiple = timeMs >= cue.vnodes;
  const named = timeMs >= cue.consistent;
  return <g>
    <Title>{timeMs >= cue.nameVnodes ? 'Virtual nodes' : named ? 'Consistent hashing' : 'Где хранится чат 42?'}</Title>
    <g transform="translate(205 555)">
      {adding ? <g>
        <text fontSize={76} fontWeight={650}>Новый узел D</text>
        <text y={142} fontSize={55}>{multiple ? 'Два диапазона' : 'Часть диапазона B'}</text>
        {multiple && <text y={218} fontSize={55}>на одном сервере</text>}
      </g> : <g>
        <text fontSize={79} fontWeight={650}>chat_id = 42</text>
        <text y={143} fontSize={54} fill={ink.muted}>↓ Murmur3</text>
        {timeMs >= cue.token && <text y={258} fontSize={64}>−7160136740246525330</text>}
        {timeMs >= cue.token && <text y={328} fontSize={45} fill={ink.muted}>токен партиции</text>}
        {timeMs >= cue.locate && <text y={478} fontSize={58}>Диапазон узла A</text>}
      </g>}
    </g>
    {timeMs >= cue.ring && <Ring timeMs={timeMs} />}
  </g>;
};

export const RelatedEpisode: React.FC<ShotProps> = ({timeMs}) => timeMs >= cue.cover ? <g>
  <svg x={545} y={136} width={1470} height={828} viewBox="10 28 444 250" overflow="hidden">
    <SourceImage x={0} y={0} width={468} height={494} src="assets/009-cassandra-scylladb/related-videos/consistent-hashing-go.png" />
  </svg>
  <text x={545} y={1104} fontSize={83} fontWeight={650}>Consistent Hashing на GO:</text>
  <text x={545} y={1214} fontSize={83} fontWeight={650}>с нуля до продакшена</text>
</g> : <g>
  <Title>Consistent hashing на Go</Title>
  <text x={206} y={475} fontSize={48} fill={ink.muted}>services/libs/sharding/ring.go</text>
  <g transform="translate(200 674)" fontFamily="Menlo, monospace" fontSize={72}>
    <text>func (r *Ring) Locate(key string) Node {'{'}</text>
    <text x={112} y={115}>return r.Point(key).Node</text>
    <text y={230}>{'}'}</text>
  </g>
</g>;
