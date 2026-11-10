import React from 'react';
import {SourceImage, easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';

// Positions measured on the episode's 1272×7300 capture of the transcript.
const lines = [
  {text:'It was both not cost effective and', x:826, baseline:6710, width:268, final:905},
  {text:'operationally a nightmare', x:472, baseline:6737, width:208, final:688},
] as const;

export function SourceQuote({time}: {readonly time:number}) {
  // Navigate to the transcript first, then zoom onto the two printed lines.
  const scroll=progress(time,33900,36050,easing.transform);
  const mark=progress(time,36100,36650,easing.transform);
  const zoom=progress(time,36680,38200,easing.transform);
  const translation=progress(time,39500,40200,easing.transform);
  const scale=mix(1080/1272,1.65,zoom);
  const x=mix(0,-754,zoom);
  const y=mix(-4550*scroll,-10060,zoom);
  return <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{fill:ink.text}}>
    <rect width="1080" height="1920" fill="#596c70"/>
    <g transform={`translate(${x} ${y}) scale(${scale})`} style={{filter:`blur(${2.3*zoom}px)`}} opacity={1-0.83*zoom}>
      <SourceImage src="assets/009-cassandra-scylladb/p01-index/heavybit-scroll.jpg" x={0} y={0} width={1272} height={7300}/>
    </g>
    <rect width="1080" height="1920" fill={ink.background} opacity={0.85*zoom}/>
    {lines.map((line,i)=>{
      const left=mix(x+line.x*scale,76,zoom);
      const baseline=mix(y+line.baseline*scale,842+i*100,zoom);
      const length=mix(line.width*scale,line.final,zoom);
      return <g key={line.text}>
        <text x={left} y={baseline} fontSize={mix(18*scale,61,zoom)} fontWeight={670} opacity={zoom}
          textLength={length} lengthAdjust="spacingAndGlyphs">{line.text}</text>
        <path d={`M${left} ${baseline+7} h${length*mark}`} stroke={ink.primary} strokeWidth={mix(3,7,zoom)} opacity={mark}/>
      </g>;
    })}
    <g opacity={zoom}>
      <text x={76} y={654} fontSize={39}>EnterpriseReady #35 · Картик Ранганатан</text>
      <g opacity={translation} fontSize={54} fontWeight={620}>
        <text x={76} y={1170}>«Экономически невыгодно</text>
        <text x={76} y={1242}>и кошмар в эксплуатации»</text>
        <text x={76} y={1320} fontSize={37} fill={ink.muted}>Перевод</text>
      </g>
    </g>
  </svg>;
}
