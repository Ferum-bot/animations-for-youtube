import React from 'react';
import {easing, mix, progress, SourceImage, v2Theme as ink} from '@channel/motion-v2';
import {asset} from '../../animations/p01-a03-history-consistency/scene';

// Original transcript capture: the complete phrase occupies x596–899, y7645–7672.
export function Transcript({elapsed}: {readonly elapsed:number}) {
  const scroll=progress(elapsed,320,1500,easing.transform);
  const mark=progress(elapsed,1500,1900);
  const zoom=progress(elapsed,1940,2850,easing.transform);
  const scale=mix(1080/1280,1.32,scroll);
  const x=mix(0,-527,scroll), y=mix(0,1920-8000*scale,scroll);
  const lines=[
    {text:'the message itself',left:596,width:147,end:642},
    {text:'is absolutely core',left:748,width:151,end:622},
  ] as const;
  return <g>
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={1-0.91*zoom} style={{filter:`blur(${3*zoom}px)`}}>
      <SourceImage src={asset('heavybit-scroll.jpg')} x={0} y={0} width={1280} height={8000}/>
    </g>
    {lines.map((line,i)=>{
      const left=mix(x+line.left*scale,78,zoom), baseline=mix(y+7665*scale,833+i*95,zoom);
      const length=mix(line.width*scale,line.end,zoom);
      return <g key={line.text}>
        <text x={left} y={baseline} opacity={zoom} fontSize={mix(19*scale,70,zoom)} fontWeight={680}
          textLength={length} lengthAdjust="spacingAndGlyphs">{line.text}</text>
        <path d={`M${left} ${baseline+10} h${length*mark}`} stroke={ink.primary} strokeWidth={mix(3,7,zoom)}/>
      </g>;
    })}
    <g opacity={zoom}>
      <text x={78} y={634} fontSize={39}>Картик Ранганатан · EnterpriseReady #35</text>
      <text x={78} y={1147} fontSize={54}>«Главное — само сообщение»</text>
      <text x={80} y={1226} fontSize={37} fill={ink.muted}>Перевод</text>
    </g>
  </g>;
}
