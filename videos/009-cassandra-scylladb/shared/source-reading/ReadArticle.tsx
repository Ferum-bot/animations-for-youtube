import React from 'react';
import {arrive, easing, mix, productionCanvas, progress, SourcePage} from '@channel/motion-v2';
import {SourceCaption} from './SourceCaption';
import type {ReadingBeat, SourceDocument} from './article';

type Props = {
  readonly src: string;
  readonly source: SourceDocument;
  readonly beats: readonly ReadingBeat[];
  readonly ms: number;
  readonly focusHeight?: number;
};

export const ReadArticle: React.FC<Props> = ({src, source, beats, ms, focusHeight = 0.40}) => {
  const viewport = source.width * productionCanvas.height / productionCanvas.width;
  let scroll = 0;
  let active: ReadingBeat | undefined;
  let captionAt = 0;
  for (const beat of beats) {
    if (ms < beat.at) break;
    const firstLine = beat.highlights[0];
    if (!firstLine) continue;
    const target = Math.max(0, Math.min(source.height - viewport, firstLine.y - viewport * focusHeight));
    // Get the reader to the passage first; allow subsequent selections on the same
    // line (e.g. columns of one table) to change without moving the page.
    scroll = mix(scroll, target, progress(ms - beat.at, 0, 660, easing.transform));
    if (active?.caption !== beat.caption) captionAt = beat.at;
    active = beat;
  }
  const age = active ? ms - active.at : 0;
  return <>
    <SourcePage src={src} sourceWidth={source.width} sourceHeight={source.height}
      scrollY={scroll} highlights={active?.highlights} selection={arrive(age, 410, 320)}
      highlightOpacity={0.43} blur={active?.caption ? arrive(age, 650, 280) * 0.45 : 0}/>
    {active?.caption && <SourceCaption caption={active.caption} amount={arrive(ms - captionAt, 540, 310)}/>}
  </>;
};
