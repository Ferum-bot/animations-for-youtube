import React from 'react';
import {Img, staticFile} from 'remotion';
import {easing, progress} from '@channel/motion-v2';
import {asset, ink, type Platform} from './palette';

export function EndCard({platform, elapsedMs}: {readonly platform: Platform; readonly elapsedMs: number}) {
  const reach = progress(elapsedMs, 500, 1180, easing.transform)
    - progress(elapsedMs, 1600, 2250, easing.transform)
    + progress(elapsedMs, 2800, 3480, easing.transform);
  return <div style={{position: 'absolute', inset: 0, backgroundColor: ink.background, color: ink.text}}>
    <Img src={staticFile(asset('vertical/full-episode.jpg'))} alt="Полный выпуск про Just Use Postgres"
      style={{position: 'absolute', left: 72, top: 360, width: 828, height: 466}}/>
    <div style={{position: 'absolute', left: 72, top: 880, width: 828, fontSize: 54,
      fontWeight: 750, lineHeight: 1.16, letterSpacing: -1.6}}>
      {platform === 'shorts' ? <>Смотреть<br/>полный выпуск</> : <>Смотри полный выпуск<br/>на YouTube</>}
    </div>
    <div style={{position: 'absolute', left: 72, top: 1050, width: 828, fontSize: 36, lineHeight: 1.3}}>
      Не используй Postgres для всего,<br/>пока не посмотришь это
    </div>
    {platform === 'shorts' ? <svg width={190} height={230} viewBox="0 0 190 230"
      style={{position: 'absolute', left: 126 - 44 * reach, top: 1210 + 72 * reach}} aria-label="Связанное видео в Shorts">
      <path d="M155 25 L36 198 M40 110 L36 198 L119 169" stroke={ink.text} strokeWidth={16}
        fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg> : <>
      <Img src={staticFile(asset('vertical/youtube-channel.jpg'))} alt="Канал Матвей Попов и кнопка Подписаться"
        style={{position: 'absolute', left: 72, top: 1230, width: 828}}/>
      <div style={{position: 'absolute', left: 72, top: 1500, fontSize: 67, fontWeight: 800}}>@ma_popov</div>
    </>}
  </div>;
}
