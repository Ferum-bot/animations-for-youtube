import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme} from '@channel/motion-v2';
import {TranslatedQuote} from './TranslatedQuote';
import {captures} from './captures';
import type {PageShot} from './shots';

export const assetRoot = 'assets/011-websocket/reconnect';
const width = 1000;
// The left page runs from x=0 to the presenter’s sleeve on the QHD footage.
const pageScale = 1.46;
const topMargin = 32;
const height = 886;
const baseScale = width / 820;

export const PaperEntrance: React.FC<{
  readonly ms: number; readonly duration: number; readonly children: React.ReactNode;
}> = ({ms, duration, children}) => {
  const enter = arrive(ms, 0, 520);
  const exit = progress(ms, duration - 420, duration - 1000 / 30, easing.leave);
  return <g opacity={arrive(ms, 0, 210) * (1 - exit)}
    transform={`translate(${-106 * (1 - enter) - 26 * exit} ${topMargin + 94 * (1 - enter) - 66 * exit}) scale(${pageScale})
      rotate(${-2.6 * (1 - enter) - exit} 40 590)`}>
    {children}
  </g>;
};

export const PaperTab: React.FC<{readonly text: string; readonly opacity?: number}> = ({text, opacity = 1}) =>
  <g>
    <rect width={width} height={56} fill={v2Theme.surface} />
    <text x={26} y={38} opacity={opacity} fontSize={28} fontWeight={650}>{text}</text>
  </g>;

export const SourceClipping: React.FC<{readonly shot: PageShot; readonly ms: number}> = ({shot, ms}) => {
  const capture = captures[shot.page];
  const pan = progress(ms, shot.focus, shot.focus + 890, easing.transform);
  const focus = progress(ms, shot.focus + 530, shot.focus + 1260, easing.transform);
  const mark = arrive(ms, shot.focus + 1140, 440);
  const pull = arrive(ms, shot.focus + 1500, 470) * (1 - progress(ms, shot.end - shot.start - 570, shot.end - shot.start - 340));
  const openingScale = Math.max(baseScale, height / capture.height);
  const scale = mix(openingScale, baseScale * 1.68, focus);
  const centerX = (Math.min(...capture.lines.map(([x]) => x)) +
    Math.max(...capture.lines.map(([x, , w]) => x + w))) / 2;
  const x = Math.min(0, Math.max(width - 820 * scale, width / 2 - centerX * scale));
  const detailY = Math.max(height - capture.height * scale, -capture.focusY * scale);
  const y = mix(capture.separateCover ? height : 0, detailY, pan);

  return <PaperEntrance ms={ms} duration={shot.end - shot.start}>
    <PaperTab text={shot.label} />
    <svg y={56} width={width} height={height - 130 * pull} overflow="hidden">
      {capture.separateCover && pan < 1 ? <SourceImage src={`${assetRoot}/${shot.page}-head.webp`}
        x={0} y={-height * pan} width={width} height={740 * baseScale} /> : null}
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <SourceImage src={`${assetRoot}/${shot.page}-page.webp`} x={0} y={0}
          width={820} height={capture.height} />
        {capture.lines.map(([left, top, w, h], index) =>
          <rect key={index} x={left} y={top} width={w * mark} height={h}
            fill={v2Theme.primary} opacity={0.29} />)}
      </g>
    </svg>
    {pull > 0 ? <TranslatedQuote y={height - 62} opacity={pull}
      original={shot.quote} translation={shot.translation} /> : null}
  </PaperEntrance>;
};
