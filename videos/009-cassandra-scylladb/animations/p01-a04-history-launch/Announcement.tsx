import {easing, progress, arrive, v2Theme as theme, SourcePage} from '@channel/motion-v2';
import React from 'react';
import {asset, timing as t, type SceneProps} from './scene';

// Whole words across two lines in the native 1280px browser capture.
const quoteLines = [
  {x: 278, y: 2674, width: 485, height: 27},
  {x: 48, y: 2701, width: 114, height: 27},
] as const;

export const Announcement: React.FC<SceneProps> = ({timeMs}) => {
  const focus = arrive(timeMs, t.focusSla, 300);
  const scroll = progress(timeMs, t.scrollAnnouncement, t.selectSla, easing.transform);
  const selection = arrive(timeMs, t.selectSla, 220) * (1 - focus);
  return <g>
    <SourcePage src={asset('facebook-scroll.jpg')} sourceWidth={1280} sourceHeight={3400}
      scrollY={2390 * scroll} highlights={quoteLines} selection={selection}
      highlightOpacity={0.4} blur={focus * 3} />
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
