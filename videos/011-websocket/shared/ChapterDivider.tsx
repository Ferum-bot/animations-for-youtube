import React, {useEffect, useState} from 'react';
import {AbsoluteFill, staticFile, useDelayRender} from 'remotion';
import {easing, productionCanvas, progress, useSceneTime} from '@channel/motion-v2';
import {chapterColors as colors} from './chapterColors';

const fontFamily = 'WebSocket Book';
let fontReady: Promise<void> | undefined;

const useChapterFont = () => {
  const {delayRender, continueRender, cancelRender} = useDelayRender();
  const [handle] = useState(() => delayRender('WebSocket chapter type'));
  useEffect(() => {
    fontReady ??= new FontFace(fontFamily, `url("${staticFile('assets/011-websocket/fonts/LiberationSerif-Regular.ttf')}")`)
      .load().then((face) => { document.fonts.add(face); });
    fontReady.then(() => continueRender(handle)).catch(cancelRender);
  }, [handle, continueRender, cancelRender]);
};

type Lines = readonly [string] | readonly [string, string];

export const chapterDivider = (number: string, lines: Lines) => {
  // Give the second line the next beat in the same reading order.
  let nextLetterMs = 120;
  const rows = lines.map((line) => Array.from(line, (letter) => {
    const startMs = nextLetterMs;
    nextLetterMs += letter === ' ' ? 16 : 23;
    return {letter, startMs};
  }));

  const ChapterDivider: React.FC = () => {
    useChapterFont();
    const {timeMs, endMs} = useSceneTime();
    const firstBaseline = lines.length === 1 ? 825 : 728;
    const center = productionCanvas.width / 2;
    const exit = 1 - progress(timeMs, endMs - 240, endMs, easing.transform);

    return (
      <AbsoluteFill style={{backgroundColor: colors.background}}>
        <svg viewBox={`0 0 ${productionCanvas.width} ${productionCanvas.height}`}
          width="100%" height="100%" role="img" aria-label={`Глава ${number}. ${lines.join(' ')}`}>
          <g fontFamily={fontFamily} fontWeight={400} textAnchor="middle" fill={colors.text}>
            <text x={center} y={firstBaseline - 223} fontSize={66}
              fillOpacity={exit * 0.62 * progress(timeMs, 0, 280, easing.transform)}>{number}</text>
            {rows.map((row, index) => (
              <text key={index} x={center} y={firstBaseline + index * 182}
                fontSize={168} xmlSpace="preserve">
                {row.map(({letter, startMs}) => (
                  <tspan key={startMs} fillOpacity={exit * progress(timeMs, startMs, startMs + 360, easing.transform)}>{letter}</tspan>
                ))}
              </text>
            ))}
          </g>
        </svg>
      </AbsoluteFill>
    );
  };
  return ChapterDivider;
};
