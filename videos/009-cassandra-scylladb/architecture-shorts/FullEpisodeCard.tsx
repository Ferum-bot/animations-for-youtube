import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {easing, progress, v2Theme as ink} from '@channel/motion-v2';

const thumbnail = staticFile('assets/009-cassandra-scylladb/architecture-shorts/full-episode.png');

function FullEpisodeArrow({elapsedMs}: {readonly elapsedMs: number}) {
  const first = progress(elapsedMs, 500, 1180, easing.transform);
  const back = progress(elapsedMs, 1600, 2250, easing.transform);
  const second = progress(elapsedMs, 2800, 3480, easing.transform);
  const reach = first - back + second;
  return <svg width={180} height={216} viewBox="0 0 180 216" aria-hidden="true"
    style={{position: 'absolute', left: 110, top: 1156, transform: `translate(${-54 * reach}px, ${84 * reach}px)`}}>
    <path d="M147 27 L29 188 M34 103 L29 188 L111 161" fill="none" stroke={ink.text}
      strokeWidth={16} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}

export function FullEpisodeCard({elapsedMs}: {readonly elapsedMs: number}) {
  return <AbsoluteFill style={{backgroundColor: ink.background, color: ink.text, fontFamily: ink.fontSans}}>
    <Img src={thumbnail} alt="Cassandra и ScyllaDB за 30 минут"
      style={{position: 'absolute', left: 72, top: 464, width: 888, height: 'auto'}}/>
    <div style={{position: 'absolute', left: 72, top: 1040, fontSize: 67, fontWeight: 760,
      letterSpacing: -2.5}}>Смотреть полный выпуск</div>
    <FullEpisodeArrow elapsedMs={elapsedMs}/>
  </AbsoluteFill>;
}
