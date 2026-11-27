import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {arrive, easing, mix, PresenterPreview, progress, SceneStage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {chapterColors as colors} from '../../shared/chapterColors';
import {networkAt, notes, stations, type Station} from './route';
import {StationIcon} from './StationIcon';

const media = {
  photoSrc: 'assets/011-websocket/reconnect/presenter.jpg',
  audioSrc: 'generated/011-websocket/network-route.m4a',
};

const Stop: React.FC<{station: Station; ms: number}> = ({station, ms}) => {
  const {id, x, y, title, at, examples} = station;
  const visible = arrive(ms, at, 370);
  return <g transform={`translate(${x} ${y})`} textAnchor="middle">
    <g opacity={mix(0.24, 1, visible)}><StationIcon id={id}/></g>
    <g transform={`translate(0 ${(1-visible)*5})`} opacity={visible}>
      <text y={65} fontSize={34} fontWeight={690}>{title}</text>
      {examples && <g opacity={0.84 * arrive(ms, examples.at, 320)}>
        {examples.lines.map((line,i) => <text key={line} y={98 + 26*i} fontSize={23} fontWeight={550}>{line}</text>)}
      </g>}
    </g>
  </g>;
};

const Zone: React.FC<{y: number; label: string; opacity: number}> = ({y,label,opacity}) =>
  <text x={72} y={y} fontSize={29} fontWeight={620} opacity={opacity}>{label}</text>;

const Composition: React.FC<PreviewProps> = (props) => {
  const {timeMs, endMs} = useSceneTime();
  const arrow = useId();
  const enter = arrive(timeMs, 0, 400);
  const exit = progress(timeMs, endMs-420, endMs, easing.leave);
  const pod = arrive(timeMs, 35950, 430);
  const node = arrive(timeMs, networkAt, 420);
  const note = notes.reduce<(typeof notes)[number]>((last, item) => timeMs >= item.at ? item : last, notes[0]);
  return <AbsoluteFill>
    <PresenterPreview {...props} media={media}/>
    <SceneStage label="Пример маршрута WebSocket от браузера до приложения">
      <g transform={`translate(${mix(-28, 0, enter)} 0) scale(1.46)`} opacity={enter*(1-exit)} fill={colors.text}>
        <defs>
          <marker id={arrow} viewBox="0 0 12 16" refX={10} refY={8} markerWidth={11}
            markerHeight={15} markerUnits="userSpaceOnUse" orient="auto">
            <path d="M2 2 L10 8 2 14" fill="none" stroke={colors.text} strokeWidth={2.8}/>
          </marker>
        </defs>
        <rect width={1000} height={1440/1.46} fill={colors.background}/>
        <text x={54} y={82} fontSize={59} fontWeight={720} letterSpacing={-1.6}>Путь WebSocket</text>
        <Zone y={149} label="Сеть пользователя и оператора" opacity={0.84}/>
        <Zone y={362} label="Облако" opacity={mix(0.46, 0.84, arrive(timeMs, 9680, 350))}/>
        <Zone y={592} label="Кластер Kubernetes" opacity={mix(0.46, 0.84, arrive(timeMs, 27160, 350))}/>
        <g fill="none" stroke={colors.text} strokeWidth={3.5} strokeLinecap="round">
          {stations.map(({id, incoming, at}) => incoming && <g key={id}>
            <path d={incoming} strokeOpacity={0.19}/>
            <path d={incoming} pathLength={1} strokeDasharray="1 1"
              markerEnd={timeMs >= at+230 ? `url(#${arrow})` : undefined}
              strokeDashoffset={1-progress(timeMs, at-240, at+230, easing.transform)}/>
          </g>)}
        </g>
        <g opacity={pod}>
          <path d="M427 688 V624 H957 V819 H427 V702" fill="none" stroke={colors.text} strokeWidth={2} strokeOpacity={0.53}/>
          <text x={453} y={653} fontSize={24} fontWeight={620}>Внутри пода</text>
        </g>
        {stations.map(station => <Stop key={station.id} station={station} ms={timeMs}/>)}
        <g opacity={1-node}>
          <path d="M56 849 H944" stroke={colors.text} strokeOpacity={0.25} strokeWidth={2}/>
          <text x={56} y={927} fontSize={35} fontWeight={620}
            opacity={arrive(timeMs, note.at, 300)}>{note.text}</text>
        </g>
        <g opacity={node}>
          <path d="M411 704 V831 Q411 848 394 848 H57" fill="none" stroke={colors.text}
            strokeOpacity={0.60} strokeWidth={2} strokeDasharray="6 7"/>
          <text x={56} y={895} fontSize={29} fontWeight={650}>На узле Kubernetes</text>
          <text x={56} y={941} fontSize={29}>kube-proxy задаёт правила · conntrack хранит записи потоков</text>
        </g>
      </g>
    </SceneStage>
  </AbsoluteFill>;
};
export default Composition;
