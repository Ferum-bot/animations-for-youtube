import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, mix, PresenterPreview, progress, SceneStage, useSceneTime,
  type PreviewProps} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import {beats, levels} from './beats';
import {Diagram} from './Diagrams';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/reconnect-treatment.m4a',
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const index = beats.reduce((last, beat, i) => timeMs >= beat.at ? i : last, 0);
  const beat = beats[index] ?? beats[0];
  const ms = timeMs - beat.at;
  const next = beats[index + 1];
  const enter = arrive(timeMs, 0, 420);
  const leave = progress(timeMs, endMs - 420, endMs, easing.leave);
  const reveal = arrive(ms, 0, 280);
  const content = reveal * (next ? 1 - progress(timeMs, next.at - 170, next.at, easing.leave) : 1);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media} />
    <SceneStage label="Три уровня защиты от лавины переподключений">
      <g transform={`translate(${mix(-32, 0, enter)} 0) scale(1.46)`} opacity={enter * (1 - leave)}>
        <rect width={1000} height={1440 / 1.46} fill={colors.background} />
        <g transform="translate(56 0)" fill={colors.text}>
          {levels.map(({label, at, x, width}, i) => {
            const active = timeMs >= at && timeMs < (levels[i + 1]?.at ?? Infinity);
            return <g key={label} transform={`translate(${x} 0)`}>
              <text y={81} fontSize={36} fontWeight={active ? 720 : 550}
                fillOpacity={timeMs < levels[0].at || active ? 1 : 0.62}>{label}</text>
              {active && <rect y={100} width={width * arrive(timeMs, at, 360)} height={5} />}
            </g>;
          })}
          <g opacity={content} transform={`translate(0 ${mix(8, 0, reveal)})`}>
            <text fontSize={62} fontWeight={720} letterSpacing={-1.4}>
              {beat.title.map((line, i) => <tspan key={line} x={0} y={226 + i*74}>{line}</tspan>)}
            </text>
            <g transform="translate(0 385)"><Diagram kind={beat.kind} ms={ms} /></g>
          </g>
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};

export default Composition;
