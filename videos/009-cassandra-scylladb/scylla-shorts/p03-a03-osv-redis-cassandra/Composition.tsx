import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {arrive, easing, mix, progress, SourceImage, useSceneTime, useV2Font, v2Theme as ink} from '@channel/motion-v2';
import {FullEpisodeCard} from '../../architecture-shorts/FullEpisodeCard';
import {Interview} from './Interview';
import {archive, cue} from './score';

function Founders({time}: {time: number}) {
  const names = arrive(time, cue.names, 350);
  return <g>
    <text x={72} y={230} fontSize={73} fontWeight={750}>Почему OSv ускорила</text>
    <text x={72} y={322} fontSize={73} fontWeight={750}>Redis, а Cassandra —</text>
    <text x={72} y={414} fontSize={73} fontWeight={750}>почти нет?</text>
    <SourceImage src={archive+'founders.webp'} x={0} y={584} width={1080} height={767}/>
    <g opacity={names} fontSize={47} textAnchor="middle">
      <text x={393} y={1440}>Дор Лаор</text>
      <text x={751} y={1440}>Ави Кивити</text>
    </g>
  </g>;
}

function Paper({time}: {time: number}) {
  const zoom = progress(time, cue.singleApp, cue.singleApp+1700, easing.transform);
  const scale = mix(1.67, 3.60, zoom);
  const x = mix(-103, -240, zoom);
  const y = mix(45, -868, zoom);
  return <g>
    <rect width={1080} height={1920} fill="white"/>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <SourceImage src={archive+'paper.webp'} x={0} y={0} width={770} height={770*3200/2473}/>
      <path d={`M90 474 h${250*arrive(time,cue.singleApp+900,650)}`} stroke={ink.primary} strokeWidth={2.3}/>
    </g>
    <g opacity={zoom}>
      <rect y={1205} width={1080} height={715} fill={ink.background}/>
      <text x={73} y={1341} fontSize={43}>Cloudius Systems · USENIX, 2014</text>
      <text x={73} y={1482} fontSize={66} fontWeight={710}>Одна виртуальная машина.</text>
      <text x={73} y={1573} fontSize={66} fontWeight={710}>Одно приложение.</text>
    </g>
  </g>;
}

function Findings() {
  return <g>
    <text x={73} y={220} fontSize={74} fontWeight={750}>Тест OSv против Linux</text>
    <text x={73} y={578} fontSize={64}>Redis</text>
    <text x={73} y={734} fontSize={137} fontWeight={750}>+70%</text>
    <path d="M74 795 H926" stroke={ink.muted} strokeWidth={3}/>
    <text x={73} y={980} fontSize={64}>Cassandra</text>
    <text x={73} y={1115} fontSize={77} fontWeight={750}>Без ускорения</text>
    <text x={73} y={1375} fontSize={51}>Ограничение оказалось</text>
    <text x={73} y={1447} fontSize={51}>в самой Cassandra.</text>
  </g>;
}

export default function Composition({withAudio=true}: {readonly withAudio?: boolean}) {
  useV2Font();
  const {timeMs} = useSceneTime();
  const {width} = useVideoConfig();
  return <AbsoluteFill data-scylla-osv="" style={{background:ink.background, fontFamily:ink.fontSans}}>
    <div style={{width:1080, height:1920, transformOrigin:'top left', transform:`scale(${width/1080})`}}>
      {timeMs >= cue.endCard ? <FullEpisodeCard elapsedMs={timeMs-cue.endCard}/> :
        <svg width={1080} height={1920} fill={ink.text} role="img" aria-label="Эксперимент OSv с Redis и Cassandra">
          {timeMs < cue.paper ? <Founders time={timeMs}/> : timeMs < cue.test ? <Paper time={timeMs}/> :
            timeMs < cue.finding ? <Interview time={timeMs}/> : <Findings/>}
        </svg>}
    </div>
    {withAudio && <Audio src={staticFile('generated/009-cassandra-scylladb/scylla-shorts/03/voice.m4a')}/>}
  </AbsoluteFill>;
}
