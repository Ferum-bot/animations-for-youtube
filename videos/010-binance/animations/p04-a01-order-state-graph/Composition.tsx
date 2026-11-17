import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, codeTheme as ink, PresenterPreview, presence, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {edges, states} from './graph';
import {beatAt, startMs} from './narration';

const media = {
  photoSrc: 'generated/010-binance/order-state-graph.jpg',
  audioSrc: 'generated/010-binance/order-state-graph.mp3',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const id = useId().replace(/:/g, '');
  const beat = beatAt(timeMs);
  const draw = arrive(timeMs, beat.at - startMs, 480);
  const accent = ink.primary;
  const transition = (from: string, to: string) =>
    from === beat.outgoing || (from === beat.from && to === beat.to);

  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Граф состояний заявки" opacity={presence(timeMs, 0, endMs, 320)}>
      <defs>
        {[['base', ink.line], ['active', accent]].map(([name, color]) =>
          <marker key={name} id={id + name} viewBox="0 0 18 18" refX={15} refY={9}
            markerUnits="userSpaceOnUse" markerWidth={20} markerHeight={20} orient="auto">
            <path d="M1 1 L17 9 L1 17 L5 9 Z" fill={color}/>
          </marker>)}
      </defs>
      <g transform="translate(190 412)">
        <rect width={2180} height={846} fill={ink.surface} stroke={ink.line} strokeWidth={4}/>
        <text x={54} y={68} fontSize={49} fontWeight={700} fill={ink.text}>Состояния заявки</text>
        <g fill="none" strokeLinejoin="round">
          {edges.map(({from, to, d}) => <g key={from + to}>
            <path d={d} stroke={ink.line} strokeWidth={3} markerEnd={`url(#${id}base)`}/>
            {transition(from, to) && <path d={d} stroke={accent} strokeWidth={6} pathLength={1}
              strokeDasharray="1 1" strokeDashoffset={1 - draw}
              markerEnd={draw > 0.96 ? `url(#${id}active)` : undefined}/>}
          </g>)}
        </g>
        {Object.entries(states).map(([name, node]) => {
          const selected = name === beat.active || name === beat.outgoing;
          const endpoint = name === beat.from || name === beat.to;
          return <g key={name} transform={`translate(${node.x} ${node.y})`}>
            <rect x={-node.w / 2} y={-56} width={node.w} height={112}
              fill={selected ? ink.selection : ink.surface}
              stroke={selected || endpoint ? accent : ink.line} strokeWidth={selected ? 5 : 3}/>
            <text textAnchor="middle" y={-2} fontFamily={ink.fontMono} fontWeight={700}
              fontSize={38} fill={selected || endpoint ? ink.keyword : ink.text}>{name}</text>
            <text textAnchor="middle" y={36} fontSize={31} fill={ink.line}>{node.meaning}</text>
          </g>;
        })}
        <path d="M0 707 H2180" stroke={ink.divider} strokeWidth={3}/>
        <g opacity={0.35 + 0.65 * draw}>
          <text x={54} y={757} fontWeight={700} fontSize={32} fill={ink.keyword}>{beat.label}</text>
          <text x={54} y={813} fontSize={41} fill={ink.text}>{beat.message}</text>
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
