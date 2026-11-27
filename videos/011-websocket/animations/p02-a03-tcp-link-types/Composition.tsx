import React from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, mix, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {chapterColors as ink} from '../../shared/chapterColors';
import {linkTypes, type LinkType} from './types';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/tcp-link-types.m4a',
};

// Endpoints are sockets. A forwarding hop has no socket on the illustrated TCP connection.
const Span: React.FC<{from: number; to: number; amount: number}> = ({from, to, amount}) =>
  <g opacity={Math.min(1, amount * 5)}>
    <line x1={from} x2={mix(from, to, amount)} stroke={ink.text} strokeWidth={8}/>
    <circle cx={from} r={12}/>
    <circle cx={to} r={12} opacity={Math.max(0, (amount - 0.8) * 5)}/>
  </g>;

const Topology: React.FC<{item?: LinkType; ms: number}> = ({item, ms}) => {
  const split = item?.topology === 'split';
  return <g transform="translate(0 448)">
    <rect x={607} y={-48} width={246} height={96} fill="none" stroke={ink.text}
      strokeWidth={3} strokeOpacity={0.5}/>
    <g fontSize={39} textAnchor="middle" fontWeight={610}>
      <text x={195} y={-70}>Клиент</text>
      <text x={730} y={-70}>{item?.middle ?? 'Звено'}</text>
      <text x={1265} y={-70}>Сервер</text>
    </g>
    <path d="M195 0 H607 M853 0 H1265" stroke={ink.text} strokeOpacity={0.32} strokeWidth={3} strokeDasharray="9 12"/>
    {item && <>
      <Span from={195} to={split ? 607 : 1265} amount={arrive(ms, item.draw, 580)}/>
      {item.secondLeg !== undefined && <Span from={853} to={1265} amount={arrive(ms, item.secondLeg, 580)}/>}
    </>}
    {split && <text x={730} y={12} textAnchor="middle" fontSize={34} fontWeight={650}>TCP</text>}
    {!item && <text x={730} y={16} textAnchor="middle" fontSize={48}>?</text>}
  </g>;
};

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const current = linkTypes.filter(type => type.start <= timeMs).at(-1);
  const visible = current ? arrive(timeMs, current.start, 300) : 1;
  const fade = arrive(timeMs, 0, 330) * (1-progress(timeMs, endMs-400, endMs, easing.leave));
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Границы TCP-соединений у четырёх типов звеньев">
      <g opacity={fade} fill={ink.text}>
        <rect width={1460} height={1440} fill={ink.background}/>
        <text x={100} y={148} fontSize={82} fontWeight={720} letterSpacing={-2}>Где заканчивается TCP?</text>
        <g opacity={visible}>
          <text x={100} y={288} fontSize={65} fontWeight={650}>{current?.name ?? 'Четыре типа звеньев'}</text>
          <Topology item={current} ms={timeMs}/>
          {current && <>
            <text x={100} y={592} fontSize={49} fontWeight={610} opacity={arrive(timeMs,current.draw,320)}>{current.explanation}</text>
            {current.detail && <text x={100} y={654} fontSize={42} opacity={arrive(timeMs,current.detail.at,320)}>{current.detail.text}</text>}
            <text x={100} y={742} fontSize={36} opacity={0.83 * arrive(timeMs,current.examplesAt,320)}>{current.examples}</text>
          </>}
        </g>
        <g transform="translate(100 842)">
          <path d="M0 -46 H1260" stroke={ink.text} strokeOpacity={0.3} strokeWidth={2}/>
          <circle cx={10} cy={7} r={10}/>
          <text x={39} y={18} fontSize={33} opacity={0.83}>Конец TCP-соединения</text>
          {linkTypes.map((type, i) => {
            const split = type.topology === 'split';
            return <g key={type.name} transform={`translate(0 ${119+i*116})`} opacity={arrive(timeMs,type.countAt,400)}>
              <text fontSize={46} fontWeight={590}>{type.name}</text>
              <g transform="translate(676 -16) scale(0.59)">
                <Span from={0} to={split ? 127 : 358} amount={1}/>
                {split && <Span from={231} to={358} amount={1}/>}
              </g>
              <text x={1260} textAnchor="end" fontSize={41} fontWeight={660}>{split ? '2 соединения' : '1 соединение'}</text>
            </g>;
          })}
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
