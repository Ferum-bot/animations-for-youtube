import React from 'react';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import {clippings, documents, scene} from './scene';
import {crops} from './sources';
import {SourceClipping} from './SourceClipping';
import {highlightProgress} from './SourceHighlight';

type Document = typeof documents[number];

export const SourceDocument: React.FC<{
  readonly document: Document;
  readonly timeMs: number;
}> = ({document, timeMs}) => {
  const pages = clippings.filter((clipping) => crops[clipping.crop].source === document.source);
  const startMs = Math.min(...pages.map((page) => page.startMs));
  const endMs = Math.max(...pages.map((page) => page.endMs));
  if (timeMs < startMs || timeMs >= endMs) return null;
  const enter = smoothProgress(timeMs, startMs, startMs + scene.entranceMs);
  const exit = 1 - smoothProgress(timeMs, endMs - scene.exitMs, endMs);
  const focus = Math.max(0, ...pages.flatMap((page) =>
    (page.marks ?? []).map((mark) => highlightProgress(mark, timeMs))));
  const visiblePages = pages.filter((page) => timeMs >= page.startMs && timeMs < page.endMs);
  const height = Math.max(...visiblePages.map((page) =>
    page.top + crops[page.crop].height * scene.width / crops[page.crop].width));
  const ink = getTheme('paper').text;
  return <div style={{position: 'absolute', left: scene.left, top: document.top,
    width: scene.width, height, opacity: enter * exit,
    transform: `translateY(${(1 - enter) * 22}px)`,
    // A single cast shadow separates the document from the presenter footage.
    boxShadow: `0 18px 48px ${ink}55`, isolation: 'isolate'}}>
    {visiblePages.map((clipping) => <SourceClipping key={clipping.crop}
      clipping={clipping} timeMs={timeMs} focus={focus} />)}
  </div>;
};
