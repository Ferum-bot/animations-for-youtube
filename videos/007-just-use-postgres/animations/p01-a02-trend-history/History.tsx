import React from 'react';
import {Img, staticFile} from 'remotion';
import {smoothProgress} from '@channel/motion-core';
import {getTheme} from '@channel/theme';
import {layers, sources, type HistoryLayer, type ScrollStop, type SourceHighlight} from './scene';

const markerColor = getTheme('signal').primary;

const Highlights: React.FC<{readonly marks: readonly SourceHighlight[]; readonly timeMs: number}> = ({marks, timeMs}) => <>
  {marks.map(mark => {
    const progress = smoothProgress(timeMs, mark.startMs, mark.startMs + 260);
    const opacity = 1 - smoothProgress(timeMs, mark.endMs - 160, mark.endMs);
    if (progress === 0 || opacity === 0) return null;
    return <React.Fragment key={mark.id}>
      {mark.rects.map((rect, index) => <div key={index} style={{
        position: 'absolute', left: rect.x, top: rect.y,
        width: rect.width * progress, height: rect.height,
        opacity, backgroundColor: `${markerColor}55`,
        borderBottom: `2px solid ${markerColor}`, boxSizing: 'border-box',
      }} />)}
    </React.Fragment>;
  })}
</>;

const scrollPosition = (timeMs: number, stops: readonly ScrollStop[]): number => {
  let previous: ScrollStop | undefined;
  for (const stop of stops) {
    if (timeMs < stop.timeMs) {
      if (!previous) return stop.y;
      return previous.y + (stop.y - previous.y)
        * smoothProgress(timeMs, previous.timeMs, stop.timeMs);
    }
    previous = stop;
  }
  return previous?.y ?? 0;
};

const SourceWindow: React.FC<{readonly layer: HistoryLayer; readonly timeMs: number}> = ({layer, timeMs}) => {
  const source = sources[layer.source];
  const scale = layer.width / source.width;
  const imageHeight = source.height * scale;
  const height = layer.viewportHeight ?? imageHeight;
  const requestedScroll = scrollPosition(timeMs, layer.scroll ?? []) * scale;
  const scrollY = Math.min(Math.max(0, requestedScroll), Math.max(0, imageHeight - height));
  const header = (layer.headerHeight ?? 0) * scale;
  const src = staticFile(`assets/007-just-use-postgres/history/${source.file}`);
  return <div style={{position: 'relative', width: layer.width, height, overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: header, width: layer.width,
      height: height - header, overflow: 'hidden'}}>
      <div style={{position: 'relative', width: source.width, height: source.height,
        transformOrigin: 'top left', transform: `translateY(${-scrollY - header}px) scale(${scale})`}}>
        <Img src={src} alt={source.description} style={{display: 'block', width: source.width, height: source.height}} />
        <Highlights marks={layer.highlights ?? []} timeMs={timeMs} />
      </div>
    </div>
    {header > 0 ? <div style={{position: 'absolute', top: 0, width: layer.width, height: header, overflow: 'hidden'}}>
      <Img src={src} alt="" style={{display: 'block', width: layer.width, height: imageHeight}} />
    </div> : null}
  </div>;
};

export const History: React.FC<{readonly timeMs: number}> = ({timeMs}) => <>
  {layers.map((layer: HistoryLayer) => {
    if (timeMs < layer.startMs || timeMs >= layer.endMs) return null;
    const enter = smoothProgress(timeMs, layer.startMs, layer.startMs + 320);
    const exit = 1 - smoothProgress(timeMs, layer.endMs - 360, layer.endMs);
    return <div key={layer.id} style={{position: 'absolute',
      left: layer.left ?? 100, top: layer.top,
      opacity: enter * exit, transform: `translateY(${(1 - enter) * 18}px)`}}>
      <SourceWindow layer={layer} timeMs={timeMs} />
    </div>;
  })}
</>;
