import React from 'react';
import {MessageIcon, Sheet, v2Theme as ink} from '@channel/motion-v2';
import {message} from './scene';

export const Bubble:React.FC<{x:number;y:number;scale?:number;body?:string}> =
  ({x,y,scale=1.6,body=message.edited})=><MessageIcon x={x} y={y} scale={scale}>
    <text x={27} y={58} fontSize={25} fill={ink.muted}>чат {message.chat} · №{message.id}</text>
    <text x={27} y={123} fontSize={34} fontWeight={650}>{body}</text>
  </MessageIcon>;

export const RecordPage:React.FC<{
  x:number;y:number;title:string;rows:readonly string[];width?:number;height?:number;marked?:boolean;
}> = ({x,y,title,rows,width=680,height=260,marked=false})=><g transform={`translate(${x} ${y})`}>
  <text y={-34} fontSize={53} fontWeight={620}>{title}</text>
  <Sheet x={0} y={0} width={width} height={height}>
    {rows.map((row,i)=><text key={i} x={36} y={77+i*77} fontSize={46}>{row}</text>)}
    {marked && <path d={`M${width-94} 4 h46 v71 l-23 -13 -23 14 Z`} fill={ink.primary}/>}
  </Sheet>
</g>;
