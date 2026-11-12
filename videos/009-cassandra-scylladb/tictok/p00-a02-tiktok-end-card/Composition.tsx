import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {useV2Font, v2Theme as ink} from '@channel/motion-v2';
import layout from '../layout.json';

/** A steady reading hold: TikTok has no YouTube related-video link to point at. */
export default function Composition() {
  useV2Font();
  const {width} = useVideoConfig();
  const left = 80;
  const contentWidth = layout.safe.right - left;
  return <AbsoluteFill style={{backgroundColor: ink.background}}>
    <div style={{position: 'absolute', width: 1080, height: 1920,
      transform: `scale(${width / 1080})`, transformOrigin: 'top left',
      color: ink.text, fontFamily: ink.fontSans}}>
      <Img src={staticFile('assets/009-cassandra-scylladb/architecture-shorts/full-episode.png')}
        alt="Cassandra и ScyllaDB за 30 минут"
        style={{position: 'absolute', left, top: 352, width: contentWidth}}/>
      <div style={{position: 'absolute', left, top: 890, width: contentWidth,
        fontSize: 58, fontWeight: 750, lineHeight: 1.16, letterSpacing: -1.8}}>
        Смотри полный выпуск<br/>на YouTube
      </div>
      <div style={{position: 'absolute', left, top: 1064, width: contentWidth,
        fontSize: 42, fontWeight: 550, lineHeight: 1.28}}>
        Cassandra и ScyllaDB<br/>за 30 минут
      </div>
      <Img src={staticFile('assets/009-cassandra-scylladb/tictok/youtube-channel.jpg')}
        alt="YouTube-канал Матвей Попов: аватарка и кнопка Подписаться"
        style={{position: 'absolute', left, top: 1224, width: contentWidth}}/>
      <div style={{position: 'absolute', left, top: 1490,
        fontSize: 72, fontWeight: 800, letterSpacing: -2}}>@ma_popov</div>
    </div>
  </AbsoluteFill>;
}
