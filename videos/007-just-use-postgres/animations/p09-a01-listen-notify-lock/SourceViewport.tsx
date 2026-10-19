import React from 'react';
import {Img, staticFile} from 'remotion';
import {reveal} from './timing';

export type Camera = {readonly x: number; readonly y: number; readonly width: number};
/** Native 3× browser capture; camera coordinates are original CSS pixels. */
export const SourceViewport: React.FC<{
  readonly file: string; readonly sourceWidth?: number; readonly originY?: number;
  readonly width: number; readonly height: number; readonly from: Camera; readonly to?: Camera;
  readonly progress?: number; readonly description: string;
}> = ({file, sourceWidth = 1440, originY = 0, width, height, from, to = from, progress = 0, description}) => {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress - originY;
  const cameraWidth = from.width + (to.width - from.width) * progress;
  const scale = width / cameraWidth;
  return <div style={{position: 'relative', width, height, overflow: 'hidden'}}>
    <Img src={staticFile(`assets/007-just-use-postgres/notify-lock/${file}`)} alt={description}
      style={{position: 'absolute', width: sourceWidth, maxWidth: 'none', transformOrigin: 'top left',
        transform: `translate(${-x * scale}px, ${-y * scale}px) scale(${scale})`}} />
  </div>;
};

export const SourceDissolve: React.FC<React.PropsWithChildren<{
  readonly timeMs: number; readonly startMs: number; readonly endMs: number;
}>> = ({timeMs, startMs, endMs, children}) => {
  if (timeMs < startMs || timeMs >= endMs + 350) return null;
  return <div style={{position: 'absolute', inset: 0, opacity: reveal(timeMs, startMs, 350)}}>{children}</div>;
};
