import React from 'react';
import {Img, staticFile} from 'remotion';
import {easing, mix, progress, v2Theme as ink} from '@channel/motion-v2';
import {asset} from '../../shared/history-sources';

export type Passage = {
  readonly text:string; readonly x:number; readonly y:number; readonly width:number; readonly height:number;
  readonly at:number; readonly release?:number; readonly finalWidth:number;
};

// All geometry is in screenshot pixels. The printed line, underline and camera
// share an origin, so the reader can follow the exact passage through the zoom.
export function FocusPage({file, alt, width, height, paper, color, passages, time, enter}: {
  readonly file:string; readonly alt:string; readonly width:number; readonly height:number;
  readonly paper:string; readonly color:string; readonly passages:readonly Passage[];
  readonly time:number; readonly enter:number;
}) {
  const item = passages.reduce((last,p)=>time>=p.at?p:last,passages[0]);
  if (!item) return null;
  const release=item.release === undefined ? 1 : 1-progress(time,item.release,item.release+680,easing.transform);
  const mark=progress(time,item.at,item.at+460,easing.transform)*release;
  const lift=progress(time,item.at+410,item.at+1550,easing.transform)*release;
  const arrival=progress(time,enter,enter+520,easing.transform);
  const cx=item.x+item.width/2, cy=item.y+item.height/2;
  const zoom=mix(1,1.85,lift);
  const left=mix(0,width/2-cx*1.85,lift), top=mix(0,height/2-cy*1.85,lift);
  const targetWidth=item.finalWidth * width/936;
  const size=mix(item.width,targetWidth,lift);
  const h=mix(item.height,item.height*targetWidth/item.width,lift);
  const centerX=left+cx*zoom, centerY=top+cy*zoom;
  return <div style={{position:'relative',width:'100%',aspectRatio:`${width}/${height}`,overflow:'hidden',
    opacity:arrival, transform:`translateY(${14*(1-arrival)}px)`,backgroundColor:paper}}>
    <Img src={staticFile(asset(file))} alt={alt} style={{display:'block',width:'100%',height:'100%',
      transformOrigin:'0 0',transform:`translate(${100*left/width}%,${100*top/height}%) scale(${zoom})`,
      filter:`blur(${2.8*lift}px)`,opacity:1-0.60*lift}}/>
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{position:'absolute',inset:0}}>
      <g transform={`translate(${centerX} ${centerY})`}>
        <g opacity={progress(lift,0,0.22,t=>t)}>
          <rect x={-size/2-h*0.16} y={-h*0.58} width={size+h*0.32} height={h*1.2} fill={paper}/>
          <text x={-size/2} y={h*0.30} textLength={size} lengthAdjust="spacingAndGlyphs"
            fontFamily={ink.fontSans} fontSize={h*0.86} fontWeight={700} fill={color}>{item.text}</text>
        </g>
        <path d={`M${-size/2} ${h*0.53} h${size*mark}`} fill="none" stroke={ink.primary} strokeWidth={mix(2,5,lift)} opacity={mark}/>
      </g>
    </svg>
  </div>;
}
