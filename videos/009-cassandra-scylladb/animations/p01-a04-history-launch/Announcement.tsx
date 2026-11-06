import React, {useId} from 'react';
import {chapterEasing, chapterProgress} from '../../shared/chapter-motion';
import {arrive} from '../../shared/editorial-v2/motion';
import {illustrationTheme as theme} from '../../shared/editorial-v2/illustration';
import {SourceImage} from '../../shared/editorial-v2/primitives';
import {asset, timing as t, type SceneProps} from './scene';

// Whole words across two lines in the native 1280px browser capture.
const quoteLines = [
  {x: 278, y: 2674, width: 485, height: 27},
  {x: 48, y: 2701, width: 114, height: 27},
] as const;

export const Announcement: React.FC<SceneProps> = ({timeMs}) => {
  const blurId = useId();
  const focus = arrive(timeMs, t.focusSla, 300);
  const scroll = chapterProgress(timeMs, t.scrollAnnouncement, t.selectSla, chapterEasing.transform);
  const y = -2390 * 2 * scroll;
  const selection = arrive(timeMs, t.selectSla, 220) * (1 - focus);
  return <g>
    <defs><filter id={blurId}><feGaussianBlur stdDeviation={focus * 3} /></filter></defs>
    <g filter={`url(#${blurId})`}>
      <SourceImage src={asset('facebook-scroll.jpg')} x={0} y={y} width={2560} height={6800} />
      {quoteLines.map(line => <rect key={line.y} x={line.x * 2} y={line.y * 2 + y}
        width={line.width * 2 * selection} height={line.height * 2} fill={theme.primary} opacity={0.4} />)}
    </g>
    <g opacity={focus}>
      <rect width={2560} height={1440} fill={theme.background} opacity={0.93} />
      <text x={280} y={365} fontSize={42}>Avinash Lakshman · 25 августа 2008</text>
      <g fontSize={88} fontWeight={600}>
        <text x={280} y={620}>“Performance of the system</text>
        <text x={280} y={750}>has been well within</text>
        <text x={280} y={880}>our SLA requirements”</text>
      </g>
      <path d="M280 935 H1290" stroke={theme.primary} strokeWidth={8} />
      <text x={280} y={1140} fontSize={34} fill={theme.muted}>Facebook Engineering · анонс Cassandra</text>
    </g>
  </g>;
};
