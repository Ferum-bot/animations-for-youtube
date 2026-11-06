import React from 'react';
import {arrive, mix, presence} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme, Sheet} from '../../shared/editorial-v2/illustration';
import {SourceImage} from '../../shared/editorial-v2/primitives';
import {asset, timing as t, type SceneProps} from './scene';

const ResearchLeaf: React.FC<{
  readonly x: number; readonly y: number; readonly name: string; readonly author: string;
}> = ({x, y, name, author}) => <Sheet x={x} y={y} width={640} height={360}>
  <text x={58} y={95} fontSize={36} fill={theme.muted}>{author}</text>
  <text x={58} y={215} fontSize={74} fontWeight={650}>{name}</text>
  <path d="M58 270 L560 270 M58 302 L415 302" stroke={theme.text} strokeWidth={3} opacity={0.35} />
</Sheet>;

export const PapersScene: React.FC<SceneProps> = ({timeMs}) => {
  const dynamo = timeMs >= t.dynamo;
  // Both first pages are US Letter. Their native typography stays crisp at QHD.
  const scroll = arrive(timeMs, t.published, 750);
  return <g opacity={presence(timeMs, t.papers, t.hbase, 200)}>
    <SourceImage src={asset(dynamo ? 'dynamo-2007.jpg' : 'bigtable-2006.jpg')}
      x={0} y={dynamo ? mix(-30, -260, scroll) : -230} width={2560} height={2560 * 11 / 8.5} />
    <g opacity={arrive(timeMs, t.internal, 300)}>
      <rect x={0} y={1170} width={2560} height={270} fill={theme.background} />
      <text x={1280} y={1320} textAnchor="middle" fontSize={68} fontWeight={600}>Внутренние системы Google и Amazon</text>
    </g>
  </g>;
};

export const HBaseScene: React.FC<SceneProps> = ({timeMs}) =>
  <g opacity={presence(timeMs, t.hbase, t.synthesis, 250)}>
    <Sheet x={850} y={440} width={860} height={540}>
      <text x={430} y={230} textAnchor="middle" fontSize={130} fontWeight={650}>HBase</text>
      <path d="M170 305 Q420 310 690 302" stroke={theme.primary} strokeWidth={7} fill="none" />
      <text x={430} y={415} textAnchor="middle" fontSize={47}>2007 · в составе Hadoop</text>
    </Sheet>
  </g>;

export const SynthesisScene: React.FC<SceneProps> = ({timeMs}) => {
  const connection = arrive(timeMs, t.ideas, 700);
  return <g opacity={arrive(timeMs, t.synthesis, 350)}>
    <ResearchLeaf x={360} y={270} name="Bigtable" author="Google · 2006" />
    <ResearchLeaf x={1560} y={270} name="Dynamo" author="Amazon · 2007" />
    <g fill="none" stroke={theme.primary} strokeWidth={6} strokeLinecap="round">
      <path d="M680 650 Q680 760 1110 890" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - connection} />
      <path d="M1880 650 Q1880 760 1450 890" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - connection} />
    </g>
    <g opacity={arrive(timeMs, t.cassandra, 350)}>
      <Sheet x={890} y={905} width={780} height={300}>
        <text x={390} y={185} textAnchor="middle" fontSize={92} fontWeight={650}>Cassandra</text>
      </Sheet>
    </g>
  </g>;
};

