import React from 'react';
import {arrive, presence} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme} from '../../shared/editorial-v2/illustration';
import {SourceImage} from '../../shared/editorial-v2/primitives';
import {timing as t, type SceneProps} from './scene';

export const InboxLaunch: React.FC<SceneProps> = ({timeMs}) => <g
  opacity={presence(timeMs, 0, t.paper, 250)} transform={`translate(100 ${390 + 18 * (1 - arrive(timeMs, 0, 300))})`}>
  <rect width={1080} height={530} fill={theme.background} />
  <SourceImage src="assets/009-cassandra-scylladb/p01/inbox-2008.png"
    x={0} y={0} width={1080} height={406.47} />
  <path d={`M295 157 H${295 + 81 * arrive(timeMs, 650, 300)}`}
    fill="none" stroke={theme.primary} strokeWidth={4} />
  <text x={40} y={487} fontSize={48} fontWeight={600}>Июнь 2008</text>
</g>;
