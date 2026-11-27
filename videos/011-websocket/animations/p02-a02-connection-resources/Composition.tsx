import React from 'react';
import {AbsoluteFill} from 'remotion';
import {
  arrive, easing, mix, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps,
} from '@channel/motion-v2';
import {chapterColors} from '../../shared/chapterColors';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/connection-resources.m4a',
};

// Times from 05:58.000 in the source WAV, which is 06:06.000 in CapCut.
const resources = [
  {at: 920, owner: 'Прокси', resource: 'Память под соединение'},
  {at: 3340, owner: 'Ядро Linux', resource: 'Запись в conntrack'},
  {at: 6220, owner: 'Процесс прокси', resource: 'Дескрипторы сокетов'},
  {at: 7840, owner: 'NAT на выходе', resource: 'Внешний порт'},
] as const;

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const enter = arrive(timeMs, 0, 320);
  const leave = progress(timeMs, endMs - 380, endMs, easing.leave);
  const cloud = arrive(timeMs, 9630, 360);
  const price = arrive(timeMs, 11900, 450);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Какие ресурсы занимает открытый WebSocket">
      <g opacity={enter * (1 - leave)} fill={chapterColors.text}>
        <rect width={1460} height={1440} fill={chapterColors.background}/>
        <text x={100} y={149} fontSize={79} fontWeight={720} letterSpacing={-2}>Один открытый WebSocket</text>
        <text x={102} y={264} fontSize={32} fontWeight={600} opacity={0.72}>Где</text>
        <text x={665} y={264} fontSize={32} fontWeight={600} opacity={0.72}>Что занято</text>
        {resources.map(({at, owner, resource}, i) => {
          const y = 301 + 130 * i;
          const reveal = arrive(timeMs, at, 350);
          return <g key={owner}>
            <path d={`M100 ${y} H1360`} stroke={chapterColors.text} strokeOpacity={0.23} strokeWidth={2}/>
            <text x={101} y={y + 84} fontSize={48} fontWeight={570}
              opacity={mix(0.48, 0.94, reveal)}>{owner}</text>
            <g opacity={reveal}>
              <path d={`M539 ${y+66} h63 m-14 -11 l14 11 -14 11`} fill="none"
                stroke={chapterColors.text} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal}/>
              <text x={mix(681, 665, reveal)} y={y+84} fontSize={50} fontWeight={680}>{resource}</text>
            </g>
          </g>;
        })}
        <g opacity={cloud}>
          <path d="M100 850 H1360" stroke={chapterColors.text} strokeWidth={4}/>
          <text x={100} y={943} fontSize={41} fontWeight={580}>AWS ALB · 1 млн активных соединений</text>
          <g opacity={price} transform={`translate(0 ${mix(14, 0, price)})`}>
            <text x={94} y={1112} fontSize={147} fontWeight={720} letterSpacing={-5}>≈ 1 950 $</text>
            <text x={818} y={1108} fontSize={55} fontWeight={570}>в месяц</text>
            <text x={101} y={1221} fontSize={38} fontWeight={600}>Только за активные соединения</text>
            <text x={101} y={1301} fontSize={31} opacity={0.8}>AWS ELB Pricing · us-east-1 · 730 часов · без mTLS</text>
          </g>
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
