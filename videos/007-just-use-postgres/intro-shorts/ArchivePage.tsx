import React from 'react';
import {Img, staticFile} from 'remotion';
import {easing, mix, progress} from '@channel/motion-v2';
import {asset, ink, vertical} from './palette';

export type Passage = {
  readonly atMs: number;
  readonly rect: {readonly x: number; readonly y: number; readonly width: number; readonly height: number};
  readonly lines: readonly string[];
  readonly fontSize?: number;
  readonly note?: string;
};
export type PageSpec = {
  readonly file: string;
  readonly assetDirectory?: string;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly paper: string;
  readonly color: string;
  readonly sourceLabel: string;
  readonly title?: string;
  readonly initialY: number;
  readonly passages: readonly Passage[];
};

/** Locate → scroll → mark the original passage → carry its sharp text into view. */
export function ArchivePage({page, timeMs}: {readonly page: PageSpec; readonly timeMs: number}) {
  const passage = page.passages.reduce((selected, candidate) => timeMs >= candidate.atMs ? candidate : selected, page.passages[0]);
  if (!passage) return null;
  const rect = passage.rect;
  const scale = 1080 / page.sourceWidth;
  const scroll = progress(timeMs, passage.atMs, passage.atMs + 650, easing.transform);
  const mark = progress(timeMs, passage.atMs + 650, passage.atMs + 1000);
  const lift = progress(timeMs, passage.atMs + 1000, passage.atMs + 1850, easing.transform);
  const index = page.passages.indexOf(passage);
  const previous = page.passages[index - 1];
  const previousTop = previous
    ? 720 - (previous.rect.y + previous.rect.height / 2) * scale : page.initialY;
  const imageTop = mix(previousTop, 720 - (rect.y + rect.height / 2) * scale, scroll);
  const originX = (rect.x + rect.width / 2) * scale;
  const originY = imageTop + (rect.y + rect.height / 2) * scale;
  const targetWidth = vertical.right - vertical.left;
  const fontSize = passage.fontSize ?? 60;
  const textHeight = passage.lines.length * fontSize * 1.2;
  const textTop = 790 - textHeight / 2;
  const textScale = mix(Math.min(rect.width * scale / targetWidth, rect.height * scale / textHeight), 1, lift);
  const centerX = mix(originX, (vertical.left + vertical.right) / 2, lift);
  const centerY = mix(originY, textTop + textHeight / 2, lift);
  return <div style={{position: 'absolute', inset: 0, backgroundColor: page.paper, color: page.color, overflow: 'hidden'}}>
    <Img src={staticFile(asset(`${page.assetDirectory ?? 'history'}/${page.file}`))} alt={page.sourceLabel}
      style={{position: 'absolute', left: 0, top: imageTop, width: 1080,
        height: page.sourceHeight * scale, filter: `blur(${lift * 3}px)`, opacity: 1 - lift * 0.87}}/>
    <div style={{position: 'absolute', left: rect.x * scale, top: imageTop + rect.y * scale,
      width: rect.width * scale * mark, height: rect.height * scale,
      backgroundColor: ink.signal, opacity: 0.32 * mark * (1 - lift)}}/>
    <div style={{position: 'absolute', left: centerX - targetWidth / 2, top: centerY - textHeight / 2,
      width: targetWidth, height: textHeight, transform: `scale(${textScale})`,
      opacity: progress(lift, 0, 0.16), fontSize, fontWeight: 760, lineHeight: 1.2, letterSpacing: -1.8,
      backgroundColor: page.paper}}>
      {passage.lines.map(line => <div key={line}>{line}</div>)}
      <div style={{height: 6, width: targetWidth * lift, marginTop: 28, backgroundColor: ink.signal}}/>
    </div>
    <div style={{position: 'absolute', left: vertical.left, top: page.title ? 470 : 310, width: targetWidth,
      opacity: lift, fontSize: 34, lineHeight: 1.3, fontWeight: 650, backgroundColor: page.paper}}>{page.sourceLabel}</div>
    {page.title && <div style={{position: 'absolute', top: 270, left: vertical.left, width: targetWidth,
      fontSize: 57, fontWeight: 750, lineHeight: 1.12, backgroundColor: page.paper}}>{page.title}</div>}
    {passage.note && <div style={{position: 'absolute', left: vertical.left, top: 1260,
      width: targetWidth, fontSize: 34, lineHeight: 1.4, opacity: lift}}>{passage.note}</div>}
  </div>;
}
