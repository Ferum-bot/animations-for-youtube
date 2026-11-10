import React from 'react';
import {arrive, easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import {asset} from '../../animations/p01-a04-history-launch/scene';

// The quote wraps after “SLA” on the original Facebook Engineering capture.
const quote = [
  {text:'Performance of the system', x:279, width:230, finalWidth:827},
  {text:'has been well within our SLA', x:514, width:246, finalWidth:874},
  {text:'requirements', x:48, width:114, finalWidth:406},
] as const;

export function Announcement({time}: {readonly time:number}) {
  const pan=progress(time,17800,19020,easing.transform);
  const mark=arrive(time,19050,450);
  const lift=progress(time,19550,20750,easing.transform);
  const scale=mix(1.12,1.38,pan);
  const top=mix(0,-2740,pan);
  return <g>
    <g opacity={1-0.94*lift} style={{filter:`blur(${2.7*lift}px)`}}>
      <SourceImage src={asset('facebook-scroll.jpg')} x={0} y={top} width={1280*scale} height={3400*scale}/>
    </g>
    {quote.map((line,i)=>{
      const x=mix(line.x*scale,74,lift);
      const y=mix(top+(i===2?2721:2694)*scale,770+i*86,lift);
      const w=mix(line.width*scale,line.finalWidth,lift);
      return <g key={line.text}>
        <text x={x} y={y} textLength={w} lengthAdjust="spacingAndGlyphs" fontWeight={650}
          fontSize={mix(22*scale,63,lift)} opacity={lift}>{line.text}</text>
        <path d={`M${x} ${y+8} h${w*mark}`} stroke={ink.primary} strokeWidth={mix(3,7,lift)}/>
      </g>;
    })}
    <g opacity={lift}>
      <text x={75} y={529} fontSize={47}>Авинаш Лакшман · август 2008</text>
      <text x={75} y={1185} fontSize={52}>«Система укладывалась в наши</text>
      <text x={75} y={1258} fontSize={52}>требования по SLA»</text>
      <text x={76} y={1347} fontSize={39} fill={ink.muted}>Перевод · Facebook Engineering</text>
    </g>
  </g>;
}
