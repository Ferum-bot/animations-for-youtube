import React from 'react';
import {Img, staticFile} from 'remotion';
import {mix, progress, easing} from '@channel/motion-v2';
import {asset, ink} from '../palette';

export function YoutubeShot({timeMs}: {readonly timeMs: number}) {
  const focus = progress(timeMs, 2800, 3850, easing.transform);
  const sponsor = progress(timeMs, 7700, 8550, easing.transform);
  const scale = mix(900 / 540, 2.2, focus);
  const left = mix(24, -220, focus);
  // Keep the source header above the body crop even at maximum zoom.
  const top = 350 - 60 * scale;
  const source = staticFile(asset('vertical/youtube-results.jpg'));
  const mark = progress(timeMs, 6900, 7600);
  const passageLeft = left + 280 * scale;
  const passageTop = top + 188 * scale;
  return <div style={{position: 'absolute', inset: 0, backgroundColor: '#0F0F0F', color: ink.text, overflow: 'hidden'}}>
    {/* Native YouTube chrome stays identifiable while the camera approaches the real result. */}
    <div style={{position: 'absolute', left: 24, top: 250, width: 900, height: 94, overflow: 'hidden'}}>
      <Img src={source} alt="Шапка YouTube с логотипом, поиском и кнопкой входа" style={{width: 900}}/>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 350, bottom: 0, overflow: 'hidden'}}>
      <Img src={source} alt="Настоящая выдача YouTube: Fireship, The Coding Gopher и Better Stack"
        style={{position: 'absolute', left, top: top - 350, width: 540 * scale,
          opacity: 1 - sponsor * 0.78, filter: `blur(${sponsor * 2}px)`}}/>
      <div style={{position: 'absolute', left: passageLeft, top: passageTop - 350,
        width: 230 * scale * mark, height: 32 * scale,
        backgroundColor: ink.signal, opacity: 0.3 * mark * (1 - sponsor)}}/>
    </div>
    {/* The sharp quote travels from its actual description-snippet coordinates. */}
    <div style={{position: 'absolute', left: mix(passageLeft, 72, sponsor),
      top: mix(passageTop, 900, sponsor), width: 828, opacity: sponsor,
      transform: `scale(${mix(0.42, 1, sponsor)})`, transformOrigin: 'top left', backgroundColor: '#0F0F0F'}}>
      <div style={{fontSize: 60, lineHeight: 1.18, fontWeight: 740}}>Sign up for Neon<br/>and create up to 10<br/>Postgres databases<br/>for free</div>
      <div style={{height: 6, backgroundColor: ink.signal, marginTop: 28}}/>
      <div style={{fontSize: 34, marginTop: 32}}>Из описания ролика Fireship</div>
    </div>
  </div>;
}

export function BookShot({timeMs}: {readonly timeMs: number}) {
  const reveal = progress(timeMs, 0, 500, easing.transform);
  return <div style={{position: 'absolute', inset: 0, backgroundColor: ink.background, color: ink.text}}>
    <div style={{position: 'absolute', left: 72, top: 290, fontSize: 84, fontWeight: 760}}>2025</div>
    <Img src={staticFile(asset('history/book.png'))} alt="Just Use Postgres! — Denis Magda, Manning"
      style={{position: 'absolute', left: 135, top: 490 + 32 * (1 - reveal), width: 700, opacity: reveal}}/>
    <div style={{position: 'absolute', left: 135, top: 1450, fontSize: 35}}>Denis Magda · Manning</div>
  </div>;
}
