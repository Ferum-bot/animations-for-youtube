import React from 'react';
import {arrive, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';

type QuoteLine = {
  text: string;
  x: number;
  baseline: number;
  width: number;
  finalWidth: number;
};

export type Passage = {
  label: string;
  lines: readonly QuoteLine[];
  result: string;
};

export function Quote({credit, passage, time, start, pageX, pageY, scale, visibility}: {
  credit: string; passage: Passage; time: number; start: number; pageX: number; pageY: number; scale: number; visibility: number;
}) {
  const highlight = arrive(time, start, 350);
  const lift = progress(time, start+320, start+1230, easing.transform) * visibility;
  return <g opacity={visibility}>
    <rect width={1080} height={1920} fill={ink.background} opacity={0.95*lift}/>
    <g opacity={lift}>
      <text x={73} y={338} fontSize={43}>{credit}</text>
      <text x={73} y={571} fontWeight={750} fontSize={93}>{passage.label}</text>
    </g>
    {passage.lines.map((line, index) => {
      const left = mix(pageX + line.x*scale, 74, lift);
      const y = mix(pageY + line.baseline*scale, 808+index*95, lift);
      const width = mix(line.width*scale, line.finalWidth, lift);
      return <g key={line.text}>
        <text x={left} y={y} opacity={lift} fontSize={mix(9*scale, 65, lift)}
          textLength={width} lengthAdjust="spacingAndGlyphs">{line.text}</text>
        <path d={`M${left} ${y+7} h${width*highlight}`} stroke={ink.primary} strokeWidth={mix(3,7,lift)}/>
      </g>;
    })}
    <text x={74} y={1190} fontSize={66} fontWeight={710} opacity={lift}>{passage.result}</text>
  </g>;
}
