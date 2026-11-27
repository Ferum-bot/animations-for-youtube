import React from 'react';
import {Img, staticFile} from 'remotion';
import {arrive, easing, mix, progress, v2Theme} from '@channel/motion-v2';
import {assetRoot, PaperEntrance, PaperTab} from './SourceClipping';
import {TranslatedQuote} from './TranslatedQuote';
import {publications, type Publication} from './publications';
import type {SourceListShot} from './listShots';

const height = 886;

type Passage = NonNullable<SourceListShot['detail']>;

// The two boundaries start at the selected row and meet the edges of the list.
// At a cut or on a backwards scrub, all positions derive from the same cue.
const ArticleReveal: React.FC<{
  readonly source: Publication & {readonly image: string};
  readonly row: number;
  readonly count: number;
  readonly amount: number;
  readonly passage: Passage;
  readonly focus: number;
}> = ({source, row, count, amount, passage, focus}) => {
  const top = (1 - amount) * row * height / count;
  const bottom = (1 - amount) * (count - row - 1) * height / count;
  const line = passage.capture.lines[0];
  const scale = mix(1000 / 820, 2, focus);
  const left = Math.max(-640, Math.min(0, 500 - (line[0] + line[2] / 2) * 2)) * focus;
  const y = -passage.capture.focusY * 2 * focus;
  return <svg y={56 + top} width={1000} height={height - top - bottom} overflow="hidden" opacity={Math.min(1, amount * 2.4)}>
    <g transform={`translate(0 ${-top * amount})`}>
      <foreignObject width={1000} height={height}>
        <a href={source.url} target="_blank" rel="noreferrer" aria-label={source.title}
          style={{display: 'block', overflow: 'hidden', width: '100%', height: '100%', background: v2Theme.text}}>
          <Img src={staticFile(`${assetRoot}/${source.image}`)} style={{
            display: 'block', width: '100%', height: 'auto', transformOrigin: '0 0',
            transform: `translate(${left}px, ${y}px) scale(${scale * 820 / 1000})`,
          }} />
        </a>
      </foreignObject>
      {focus > 0 ? <>
        <rect x={left + line[0] * scale} y={y + line[1] * scale}
          width={line[2] * scale * focus} height={line[3] * scale} fill={v2Theme.primary} opacity={0.27 * focus} />
        <TranslatedQuote y={768} opacity={focus} original={passage.original} translation={passage.translation} />
      </> : null}
    </g>
  </svg>;
};

export const SourceList: React.FC<{readonly shot: SourceListShot; readonly ms: number}> = ({shot, ms}) => {
  const time = shot.start + ms;
  const detail = shot.detail;
  const source = detail && publications[detail.article];
  const index = detail ? shot.entries.findIndex(([article]) => article === detail.article) : -1;
  const amount = detail && index >= 0 ? progress(time, detail.open, detail.open + 500, easing.transform) *
    (1 - progress(time, detail.close - 500, detail.close, easing.transform)) : 0;
  const mentions = shot.entries.flatMap(([, at]) => at === undefined ? [] : [at]);
  return <PaperEntrance ms={ms} duration={shot.end - shot.start}>
    <PaperTab text={detail && source && amount > 0.5 ? `${source.publisher}  /  ${source.date}` : shot.heading}
      opacity={Math.abs(1 - 2 * amount)} />
    <foreignObject y={56} width={1000} height={height}>
      <div style={{height: '100%', display: 'flex', flexDirection: 'column', background: v2Theme.text,
        color: v2Theme.background, fontFamily: v2Theme.fontSans}}>
        {shot.entries.map(([article, mentionedAt], row) => {
          const item = publications[article];
          const enter = arrive(ms, row * 36, 200);
          const next = mentionedAt === undefined ? undefined : mentions.find(at => at > mentionedAt);
          const tint = mentionedAt === undefined ? 0 : arrive(time, mentionedAt, 180) *
            (next === undefined ? 1 : 1 - arrive(time, next, 180));
          return <a key={article} href={item.url} target="_blank" rel="noreferrer" style={{
            position: 'relative', flex: '1 1 0', minHeight: 0, color: 'inherit', textDecoration: 'none',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 30px',
            borderBottom: `1px solid ${v2Theme.line}55`, boxSizing: 'border-box', opacity: enter,
            transform: `translateX(${(1 - enter) * 16}px)`,
          }}>
            {tint > 0 ? <div style={{position: 'absolute', inset: 0,
              background: v2Theme.primary, opacity: 0.15 * tint}} /> : null}
            <div style={{position: 'relative', fontSize: 24, fontWeight: 650, lineHeight: 1.2, marginBottom: 6}}>
              {item.publisher} · {item.date}
            </div>
            <div style={{position: 'relative', fontSize: shot.entries.length > 5 ? 32 : 38,
              fontWeight: 720, lineHeight: 1.1}}>{item.title}</div>
          </a>;
        })}
      </div>
    </foreignObject>
    {detail && source && amount > 0 ? <ArticleReveal source={source} row={index} count={shot.entries.length} amount={amount}
      passage={detail} focus={arrive(time, detail.open + 500, 600) * amount} /> : null}
  </PaperEntrance>;
};
