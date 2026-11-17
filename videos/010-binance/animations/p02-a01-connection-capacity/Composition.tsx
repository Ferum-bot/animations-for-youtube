import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, codeTheme, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {articlesMs, startMs, systems} from './systems';

const media = {
  photoSrc: 'generated/010-binance/connection-capacity.jpg',
  audioSrc: 'generated/010-binance/connection-capacity.mp3',
};
const width = 2180;
const heading = 112;
const rowHeight = 136;
const height = heading + systems.length * rowHeight;
const numberX = 572;
const contextX = 1132;

function Lines({lines, x, size}: {readonly lines: readonly string[]; readonly x: number; readonly size: number}) {
  return <text x={x} y={rowHeight / 2 + size * 0.32 - (lines.length - 1) * 25}
    fontSize={size} fill={codeTheme.text}>
    {lines.map((line, i) => <tspan key={line} x={x} dy={i === 0 ? 0 : 50}>{line}</tspan>)}
  </text>;
}

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const articles = timeMs >= articlesMs;
  // Keep the company names in place while their figures give way to the publications.
  const contentOpacity = articles ? arrive(timeMs, articlesMs, 180)
    : 1 - arrive(timeMs, articlesMs - 130, 130);

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Одновременные соединения и статьи" opacity={presence(timeMs, 0, endMs, 270)}>
      <g transform="translate(190 420)">
        <rect width={width} height={height} fill={codeTheme.surface}/>
        <rect width={width} height={heading} fill={codeTheme.gutter}/>
        <g fontSize={43} fontWeight={700} fill={codeTheme.text}>
          <text x={42} y={73}>Система</text>
          <g opacity={contentOpacity}>
            <text x={numberX} y={73}>{articles ? 'Статьи' : 'Одновременно'}</text>
            {!articles && <text x={contextX} y={73}>Что измеряли</text>}
          </g>
        </g>
        {systems.map((system, i) => {
          const start = system.spokenAtMs - startMs;
          const next = systems[i + 1];
          const end = next ? next.spokenAtMs - startMs : articlesMs;
          const focus = arrive(timeMs, start, 220) * (1 - arrive(timeMs, end - 120, 120));
          return <g key={system.name} transform={`translate(0 ${heading + i * rowHeight})`}>
            <rect x={2} width={width - 4} height={rowHeight} fill={codeTheme.selection} opacity={focus}/>
            <path d={`M0 0 H${width}`} stroke={codeTheme.divider} strokeWidth={2}/>
            <text x={42} y={84} fontSize={49} fontWeight={650} fill={codeTheme.text}>{system.name}</text>
            <g opacity={contentOpacity}>
              {articles ? <a href={system.url} target="_blank" rel="noreferrer">
                <title>{system.publisher ? system.publisher + ' · ' : ''}{system.article.join(' ')}</title>
                <Lines x={numberX} lines={system.article} size={41}/>
                {system.publisher && <text x={42} y={119} fontSize={29} fill={codeTheme.line}>{system.publisher}</text>}
              </a> : <>
                <text x={numberX} y={88} fontFamily={codeTheme.fontMono} fontSize={55 + 6 * focus}
                  fontWeight={700} fill={codeTheme.keyword}>{system.concurrent}</text>
                <Lines x={contextX} lines={system.context} size={45}/>
              </>}
            </g>
          </g>;
        })}
        <path d={`M530 0 V${height}`} stroke={codeTheme.divider} strokeWidth={2}/>
        {!articles && <path d={`M1090 0 V${height}`} stroke={codeTheme.divider} strokeWidth={2} opacity={contentOpacity}/>}
        <rect width={width} height={height} fill="none" stroke={codeTheme.line} strokeWidth={4}/>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
