import React from 'react';
import {Img, staticFile} from 'remotion';
import {asset, paper, theme} from './ui';
import {cues, reveal, type SceneProps} from './timing';

export const TemporalEvidence: React.FC = () => <>
  <div style={{position: 'absolute', left: 64, top: 42, fontSize: 30, fontWeight: 600}}>Quo / Temporal — история одного звонка</div>
  <div style={{position: 'absolute', left: 64, top: 98, width: 1472, height: 742, background: paper}}>
    <Img src={staticFile(asset('temporal-ui.png'))} style={{position: 'absolute', top: 28, left: 278, width: 915}} />
    <Img src={staticFile(asset('temporal-history.svg'))} style={{position: 'absolute', top: 255, left: 236, width: 1000}} />
  </div>
</>;

export const Cassandra: React.FC<SceneProps> = ({timeMs}) => {
  const focus = reveal(timeMs, cues.nodes - 550, 800);
  return <>
    <div style={{position: 'absolute', left: 64, top: 42, fontSize: 30, fontWeight: 600}}>Quo / Aurora → Cassandra</div>
    <div style={{position: 'absolute', left: 64, top: 98, width: 1472, height: 742, overflow: 'hidden', background: paper}}>
      <Img src={staticFile(asset('aurora-cassandra.svg'))} style={{position: 'absolute', width: 1472,
        top: 0, left: 0, transformOrigin: '75% 50%', transform: `scale(${1 + focus * .035}) translateX(${-focus * 8}px)`}} />
    </div>
    <div style={{position: 'absolute', left: 64, bottom: 22, fontSize: 20, color: theme.muted}}>
      Оригинальная схема Quo · Миграция продолжалась на момент публикации
    </div>
  </>;
};
