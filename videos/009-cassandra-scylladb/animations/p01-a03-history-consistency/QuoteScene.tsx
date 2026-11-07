import {arrive, mix, presence, v2Theme as theme, SourcePage} from '@channel/motion-v2';
import React from 'react';
import {asset, timing as t, type SceneProps} from './scene';

// Native 1280px capture. Whole-word boxes on the original two wrapped excerpts.
const highlights = {
  reindex: [
    {x: 1086, y: 7453, width: 48, height: 27},
    {x: 474, y: 7480, width: 316, height: 27},
  ],
  message: [{x: 596, y: 7645, width: 303, height: 27}],
} as const;

export const QuoteScene: React.FC<SceneProps> = ({timeMs}) => {
  const scroll = arrive(timeMs, t.scroll, 800);
  const message = timeMs >= t.selectMessage;
  const focus = message ? arrive(timeMs, t.focusMessage, 350) :
    presence(timeMs, t.focusReindex, t.selectMessage, 250);
  const selection = arrive(timeMs, message ? t.selectMessage : t.selectReindex, 220) * (1 - focus);
  return <g opacity={presence(timeMs, t.podcast, t.alternatives, 200)}>
    <SourcePage src={asset('heavybit-scroll.jpg')} sourceWidth={1280} sourceHeight={8000}
      scrollY={mix(0, 7200, scroll)} highlights={message ? highlights.message : highlights.reindex}
      selection={selection} blur={focus * 3} />
    <g opacity={focus}>
      <rect width={2560} height={1440} fill={theme.background} opacity={0.9} />
      <text x={320} y={430} fontSize={42}>Karthik Ranganathan · EnterpriseReady #35</text>
      <g fontSize={88} fontWeight={600}>
        <text x={320} y={700}>{message ? '“the message itself' : '“We’d go back to their messages'}</text>
        <text x={320} y={830}>{message ? 'is absolutely core”' : 'and reindex”'}</text>
      </g>
      <path d={`M320 885 H${message ? 1110 : 855}`} stroke={theme.primary} strokeWidth={8} />
      <text x={320} y={1100} fontSize={34} fill={theme.muted}>heavybit.com · 13 апреля 2021</text>
    </g>
  </g>;
};
