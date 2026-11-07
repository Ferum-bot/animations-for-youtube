import React, {useId} from 'react';
import {SourceImage} from './SourceImage';
import {v2Theme} from './theme';
import type {SourceRect} from './types';

/** Real page + exact source selection. Narration, scroll timing and typeset quotes stay local. */
export const SourcePage: React.FC<{
  readonly src: string;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly scrollY: number;
  readonly highlights?: readonly SourceRect[];
  readonly selection?: number;
  readonly highlightOpacity?: number;
  readonly blur?: number;
}> = ({src, sourceWidth, sourceHeight, scrollY, highlights = [], selection = 0, highlightOpacity = 0.5, blur = 0}) => {
  const blurId = useId();
  const scale = 2560 / sourceWidth;
  const y = -scrollY * scale;
  return <>
    <defs><filter id={blurId}><feGaussianBlur stdDeviation={blur} /></filter></defs>
    <g filter={`url(#${blurId})`}>
      <SourceImage src={src} x={0} y={y} width={2560} height={sourceHeight * scale} />
      {highlights.map((line, index) => <rect key={index}
        x={line.x * scale} y={line.y * scale + y} width={line.width * scale * selection}
        height={line.height * scale} fill={v2Theme.primary} opacity={highlightOpacity} />)}
    </g>
  </>;
};
