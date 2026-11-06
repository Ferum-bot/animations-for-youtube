import React from 'react';
import {arrive, presence} from '../../shared/editorial-v2/motion';
import {SourceImage} from '../../shared/editorial-v2/primitives';
import {MessageIcon, Magnifier, illustrationTheme} from './Illustration';
import {asset, timing as t, type SceneProps} from './scene';

export const WitnessScene: React.FC<SceneProps> = ({timeMs}) => <g opacity={presence(timeMs, 0, t.storage)}>
  <g opacity={arrive(timeMs, t.name)}>
    <SourceImage src={asset('karthik.jpg')} x={220} y={360} width={560} height={560} fit="cover" />
    <text x={220} y={1020} fontSize={58} fontWeight={650}>Karthik Ranganathan</text>
    <text x={220} y={1090} fontSize={36} fill={illustrationTheme.muted}>Команда Cassandra · фото Percona</text>
  </g>
  <MessageIcon x={1300} y={520} scale={2.25} />
  <g opacity={arrive(timeMs, t.email)}>
    <text x={1670} y={1110} textAnchor="middle" fontSize={52}>Личные сообщения</text>
  </g>
  <g opacity={arrive(timeMs, t.searchRequest)}>
    <Magnifier x={1860} y={730} scale={1.65} />
  </g>
</g>;
