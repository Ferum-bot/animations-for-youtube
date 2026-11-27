import React from 'react';
import {arrive, getV2Theme, SourceImage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from './AccessSourceStage';
import {chapterColors as colors} from './chapterColors';

type Capture = {
  width: number;
  height: number;
  marks: readonly (readonly (readonly [number, number, number, number])[])[];
};
type Source = {publisher: string; date: string; title: string; url: string};
export type DocumentationCue<Page extends string> = {
  at: number; page: Page; marks: readonly number[]; original: string; translation: string;
};
type DocumentationProps<Page extends string> = PreviewProps & {
  label: string; audio: string; assets: string;
  pages: Readonly<Record<Page, Source>>;
  captures: Readonly<Record<Page, Capture>>;
  cues: readonly [DocumentationCue<Page>, ...DocumentationCue<Page>[]];
};

const panelWidth = 1460;
const accent = getV2Theme('signal').primary;

export function DocumentationScene<Page extends string>({
  label, audio, assets, pages, captures, cues, ...preview
}: DocumentationProps<Page>) {
  const {timeMs} = useSceneTime();
  const cue = cues.filter(item => item.at <= timeMs).at(-1) ?? cues[0];
  const source = pages[cue.page];
  const capture = captures[cue.page];
  const highlight = arrive(timeMs, cue.at, 220);

  return <AccessSourceStage {...preview} label={label} audio={audio}>
    <a href={source.url} target="_blank" rel="noreferrer">
      <g fill={colors.text}>
        <rect width={panelWidth} height={1440} fill={colors.background}/>
        <text x={64} y={96} fontSize={38} fontWeight={610}>{source.publisher}</text>
        <text x={1396} y={96} textAnchor="end" fontSize={34}>{source.date}</text>
        <text x={64} y={211} fontSize={65} fontWeight={670}>{source.title}</text>
        <svg y={254} width={panelWidth} height={833} viewBox={`0 0 ${capture.width} ${capture.height}`}>
          <SourceImage src={`${assets}/${cue.page}.webp`}
            x={0} y={0} width={capture.width} height={capture.height}/>
          <g fill={accent} opacity={highlight}>
            {cue.marks.flatMap(index => (capture.marks[index] ?? []).map(([x,y,w,h]) =>
              <g key={`${x},${y}`}>
                <rect x={x-1} y={y} width={w+2} height={h} opacity={0.34}/>
                <rect x={x-1} y={y+h} width={w+2} height={1.5}/>
              </g>
            ))}
          </g>
        </svg>
        <text x={64} y={1164} fontSize={42}>{cue.original}</text>
        <foreignObject x={64} y={1206} width={1332} height={208}>
          <div style={{fontSize:53,lineHeight:1.16,fontWeight:650,color:colors.text}}>{cue.translation}</div>
        </foreignObject>
      </g>
    </a>
  </AccessSourceStage>;
}
