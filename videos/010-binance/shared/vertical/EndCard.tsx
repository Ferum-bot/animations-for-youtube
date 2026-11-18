import React from 'react';
import {Img, staticFile} from 'remotion';
import {arrive, mix} from '@channel/motion-v2';
import type {Platform} from './BrokerShort';

export function EndCard({platform,elapsed}: {platform: Platform; elapsed: number}) {
  const youtube = platform === 'shorts';
  const phase = Math.max(0, elapsed - 350) / 1800;
  const breath = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  return <div style={{position:'absolute', top:415, left:youtube ? 69 : 54, width:youtube ? 866 : 810,
    transform:`translateY(${mix(15,0,arrive(elapsed,0,320))}px)`}}>
    <div style={{fontSize:43, color:'#155f9f', fontFamily:'"Comic Sans MS", cursive', marginBottom:28}}>
      Полный разбор на YouTube
    </div>
    <div style={{transform:youtube ? undefined : `scale(${mix(1,1.045,breath)})`,transformOrigin:'center'}}>
      <div style={{position:'relative', width:'100%', aspectRatio:'840 / 472', overflow:'hidden', borderRadius:17}}>
        <Img src={staticFile('assets/010-binance/vertical/binance-youtube.png')}
          style={{position:'absolute',width:'106.19%',left:'-4.05%',top:'-3.39%'}}/>
      </div>
      <div style={{fontSize:55,fontWeight:800,lineHeight:1.16,marginTop:35}}>System Design —<br/>Проектируем свой Binance</div>
    </div>
    {youtube ? <div style={{display:'flex',alignItems:'center',gap:24,width:'max-content',
      marginTop:48,color:'#155f9f',fontSize:54,fontWeight:700,lineHeight:1.12,
      transformOrigin:'left center',transform:`scale(${mix(1,1.10,breath)})`}}>
      <svg width={78} height={112} viewBox="0 0 50 72" aria-hidden="true"
        style={{transform:`translateY(${8*breath}px)`}}>
        <path d="M28 8 Q29 32 21 57 M9 42 L21 58 L39 47"
          stroke="currentColor" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>Связанное видео<br/>под шортсом</span>
    </div> : <div style={{display:'flex',alignItems:'center',gap:22,width:'max-content',marginTop:60,
      fontSize:47,fontWeight:750,transformOrigin:'left center',transform:`scale(${mix(1,1.09,breath)})`}}>
      <svg width={98} height={70} viewBox="0 0 56 40" aria-hidden="true">
        <path fill="#FF0033" d="M28 0C8 0 5 1 2.5 4.5C0 8 0 14 0 20s0 12 2.5 15.5C5 39 8 40 28 40s23-1 25.5-4.5C56 32 56 26 56 20S56 8 53.5 4.5C51 1 48 0 28 0Z"/>
        <path fill="white" d="M23 11.5 38 20 23 28.5Z"/>
      </svg>
      <span>YouTube · @ma_popov</span>
    </div>}
  </div>;
}
