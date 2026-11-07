import React from 'react';
import {Img, staticFile} from 'remotion';

/** Native source image; Img waits for decoding before any later authorized render. */
export const SourceImage: React.FC<{
  readonly src: string; readonly x: number; readonly y: number;
  readonly width: number; readonly height: number; readonly fit?: 'cover' | 'contain';
}> = ({src, x, y, width, height, fit = 'contain'}) =>
  <foreignObject x={x} y={y} width={width} height={height}>
    <Img src={staticFile(src)} style={{display: 'block', width: '100%', height: '100%', objectFit: fit}} />
  </foreignObject>;

