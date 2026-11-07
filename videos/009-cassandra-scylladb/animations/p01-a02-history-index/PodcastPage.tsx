import {arrive, presence, SourceImage, easing, progress, v2Theme} from '@channel/motion-v2';
import React, {useId} from 'react';
import {asset} from './scene';

type QuoteKind = 'ownership' | 'cost';

// Native 1272 px-wide capture; DOM Range measurements after source fonts loaded.
const sourcePage = {
  width: 1272,
  height: 7300,
  targetScrollY: 6330,
  costLines: [
    {x: 822.64, y: 6691.08, width: 268.82, height: 23.5},
    {x: 468, y: 6718.08, width: 206.4, height: 23.5},
  ],
} as const;

const ScrollToCost: React.FC<{readonly timeMs: number; readonly startMs: number; readonly focus: number}> =
  ({timeMs, startMs, focus}) => {
    const scale = 2560 / sourcePage.width;
    const scroll = progress(timeMs, startMs + 1000, startMs + 2600, easing.transform);
    const selection = arrive(timeMs, startMs + 2700, 300);
    return <g transform={`translate(0 ${-sourcePage.targetScrollY * scale * scroll})`}>
      <SourceImage src={asset('heavybit-scroll.jpg')} x={0} y={0}
        width={2560} height={sourcePage.height * scale} />
      <g opacity={selection * (1 - focus)}>
        {sourcePage.costLines.map(line => <rect key={line.y} x={(line.x - 3) * scale}
          y={(line.y - 2) * scale} width={(line.width + 6) * scale * selection}
          height={(line.height + 4) * scale} fill={v2Theme.primary} opacity={0.5} />)}
      </g>
    </g>;
  };

// Exact excerpts, not an invented summary attributed to the guest.
const quotes = {
  ownership: ['“you need the index for you,', 'you need the index for me”'],
  cost: ['“It was both not cost effective', 'and operationally a nightmare”'],
} as const satisfies Record<QuoteKind, readonly string[]>;

export const PodcastPage: React.FC<{
  readonly timeMs: number; readonly startMs: number; readonly endMs?: number;
  readonly quote: QuoteKind; readonly translateAtMs?: number;
  readonly entry?: 'cover' | 'excerpt';
}> = ({timeMs, startMs, endMs, quote, translateAtMs, entry = 'excerpt'}) => {
  const blurId = useId();
  const clipId = useId();
  const focus = arrive(timeMs, startMs + (entry === 'cover' ? 3150 : 650), 450);
  const translated = translateAtMs === undefined ? 0 : arrive(timeMs, translateAtMs, 400);
  return <g clipPath={`url(#${clipId})`}
    opacity={endMs === undefined ? arrive(timeMs, startMs) : presence(timeMs, startMs, endMs)}>
    <defs>
      <clipPath id={clipId}><rect width={2560} height={1440} /></clipPath>
      <filter id={blurId}><feGaussianBlur stdDeviation={3 * focus} /></filter>
    </defs>
    <g filter={`url(#${blurId})`}>
      {entry === 'cover' ? <ScrollToCost timeMs={timeMs} startMs={startMs} focus={focus} /> :
        <SourceImage src={asset('heavybit-transcript.jpg')} x={0} y={0} width={2560} height={1440} fit="cover" />}
    </g>
    <g opacity={focus}>
      <rect width={2560} height={1440} fill={v2Theme.background} opacity={0.92} />
      <text x={340} y={375} fontSize={42}>EnterpriseReady #35 · Karthik Ranganathan</text>
      <g opacity={1 - translated} fontSize={82} fontWeight={600}>
        {quotes[quote].map((line, i) => <text key={line} x={340} y={665 + i * 120}>{line}</text>)}
      </g>
      {translateAtMs === undefined ? null : <g opacity={translated}>
        <text x={340} y={665} fontSize={88} fontWeight={650}>«Экономически невыгодно</text>
        <text x={340} y={785} fontSize={88} fontWeight={650}>и кошмар в эксплуатации»</text>
        <text x={340} y={900} fontSize={36} fill={v2Theme.muted}>Перевод</text>
      </g>}
      <text x={340} y={1150} fontSize={34} fill={v2Theme.muted}>heavybit.com · 13 апреля 2021</text>
    </g>
  </g>;
};
