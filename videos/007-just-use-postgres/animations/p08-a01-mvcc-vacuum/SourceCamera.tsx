import React from 'react';
import {Img, staticFile} from 'remotion';
import {reveal} from './timing';

export type CameraStop = {readonly at: number; readonly x: number; readonly y: number; readonly width: number};
export type SourceFocus = {
  readonly from: number; readonly to: number;
  readonly x: number; readonly y: number; readonly width: number; readonly height: number;
  readonly zoom: number; readonly pageColor: string;
};
const cameraAt = (timeMs: number, stops: readonly CameraStop[]): CameraStop => {
  const first = stops[0];
  if (!first) throw new Error('A source camera requires at least one position');
  let previous = first;
  for (const next of stops.slice(1)) {
    if (timeMs < next.at) {
      const progress = reveal(timeMs, previous.at, next.at - previous.at);
      return {at: timeMs, x: previous.x + (next.x - previous.x) * progress,
        y: previous.y + (next.y - previous.y) * progress,
        width: previous.width + (next.width - previous.width) * progress};
    }
    previous = next;
  }
  return previous;
};

/** Magnify native pixels while retaining the surrounding page for context. */
const MagnifiedExcerpt: React.FC<{
  readonly focus: SourceFocus; readonly camera: CameraStop; readonly timeMs: number;
  readonly src: string; readonly sourceWidth: number; readonly width: number; readonly height: number;
}> = ({focus, camera, timeMs, src, sourceWidth, width, height}) => {
  const progress = reveal(timeMs, focus.from, 450) * (1 - reveal(timeMs, focus.to - 350, 350));
  const pageScale = width / camera.width;
  const zoom = pageScale + (focus.zoom - pageScale) * progress;
  const excerptWidth = focus.width * zoom;
  const excerptHeight = focus.height * zoom;
  const startX = (focus.x - camera.x) * pageScale;
  const startY = (focus.y - camera.y) * pageScale;
  const left = startX + ((width - excerptWidth) / 2 - startX) * progress;
  const top = startY + ((height - excerptHeight) / 2 - startY) * progress;
  return <div style={{position: 'absolute', left, top, opacity: progress,
    padding: 26 * progress, margin: -26 * progress, background: focus.pageColor}}>
    <div style={{width: excerptWidth, height: excerptHeight, overflow: 'hidden', position: 'relative'}}>
      <Img src={src} alt="" style={{position: 'absolute', width: sourceWidth, maxWidth: 'none', transformOrigin: 'top left',
        transform: `translate(${-focus.x * zoom}px, ${-focus.y * zoom}px) scale(${zoom})`}} />
    </div>
  </div>;
};

/** Only native page pixels, including enlarged quotations; no outer background panel. */
export const SourceCamera: React.FC<{
  readonly file: string; readonly sourceWidth: number; readonly description: string;
  readonly width: number; readonly height: number; readonly timeMs: number;
  readonly stops: readonly CameraStop[]; readonly focuses?: readonly SourceFocus[];
}> = ({file, sourceWidth, description, width, height, timeMs, stops, focuses = []}) => {
  const camera = cameraAt(timeMs, stops);
  const scale = width / camera.width;
  const src = staticFile(`assets/007-just-use-postgres/mvcc/${file}`);
  const focus = focuses.find(({from, to}) => timeMs >= from && timeMs < to);
  return <div style={{width, height, overflow: 'hidden', position: 'relative'}}>
    <Img src={src} alt={description}
      style={{position: 'absolute', width: sourceWidth, maxWidth: 'none', transformOrigin: 'top left',
        transform: `translate(${-camera.x * scale}px, ${-camera.y * scale}px) scale(${scale})`}} />
    {focus ? <MagnifiedExcerpt focus={focus} camera={camera} timeMs={timeMs} src={src}
      sourceWidth={sourceWidth} width={width} height={height} /> : null}
  </div>;
};
