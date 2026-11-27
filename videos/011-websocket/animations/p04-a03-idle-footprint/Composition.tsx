import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  easing, getV2Theme, PresenterPreview, progress, SceneStage, SourceImage,
  useSceneTime, type PreviewProps,
} from '@channel/motion-v2';

const publication = 'https://evilmartians.com/chronicles/choose-your-fighter-benchmarking-5-websocket-servers-for-nodejs#the-scoreboard';
const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/idle-footprint.m4a',
};
const paper = getV2Theme('paper');
const marker = getV2Theme('signal').primary;

// Top edges of the Socket.IO and uWS rows in the original Footprint column.
const highlightedRows = [167, 260] as const;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs, endMs} = useSceneTime();
  // «в десять раз» starts 3.48 s into the clip (15:57.82 on the edit).
  const highlight = progress(timeMs, 3480, 3620, easing.transform);
  const alpha = progress(timeMs, 0, 130, easing.transform)
    * (1-progress(timeMs, endMs-120, endMs, easing.transform));

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Evil Martians · память на простаивающее соединение">
      <g opacity={alpha} fill={paper.text}>
        <rect width={2560} height={1440} fill="white"/>
        <a href={publication} target="_blank" rel="noreferrer">
          <text x={110} y={102} fontSize={42} fontWeight={640}>Evil Martians · Martian Chronicles</text>
          <text x={2450} y={102} fontSize={38} textAnchor="end">24 июня 2026</text>
        </a>
        <text x={106} y={248} fontSize={100} fontWeight={720} letterSpacing={-3}>
          Память на простаивающее соединение
        </text>
        <svg x={90} y={302} width={2380} height={1030} viewBox="20 -1 1400 606" overflow="hidden">
          <SourceImage x={0} y={0} width={1440} height={585}
            src="assets/011-websocket/memory/evil-martians-scoreboard.png"/>
          <g fill={marker} opacity={highlight * 0.56} style={{mixBlendMode: 'multiply'}}>
            {highlightedRows.map(y =>
              <rect key={y} x={1057} y={y} width={301} height={40}/>
            )}
          </g>
        </svg>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
