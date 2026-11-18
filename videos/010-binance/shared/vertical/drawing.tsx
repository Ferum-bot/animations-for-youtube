import React from 'react';
import {arrive,easing,mix,progress,v2FontFamily} from '@channel/motion-v2';
import type {BoardProps} from './BrokerShort';

export const paper = '#fffefa';
export const ink = '#202321';
export const blue = '#1464ad';
export const green = '#247349';
export const red = '#b23a30';
export const yellow = '#edbb28';
export const hand = '"Comic Sans MS", cursive';

export function Sheet({left,width,title,children}: Omit<BoardProps,'time'> & {
  title: string; children: React.ReactNode;
}) {
  return <svg style={{position:'absolute',top:568,left}} width={width} height={width*805/845}
    viewBox="0 0 845 805" fill={ink} fontFamily={v2FontFamily} strokeLinecap="round" strokeLinejoin="round">
    <text x={22} y={70} fontSize={49} fontWeight={800}>{title}</text>
    {children}
  </svg>;
}

export function Note({x,y,children,size=34,color=ink,anchor='middle',bold=false,pen=false}: {
  x:number; y:number; children:React.ReactNode; size?:number; color?:string;
  anchor?:'start'|'middle'|'end'; bold?:boolean; pen?:boolean;
}) {
  return <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor}
    fontWeight={bold ? 760 : 510} fontFamily={pen ? hand : v2FontFamily}>{children}</text>;
}

export function Reveal({time,at,children}: {time:number; at:number; children:React.ReactNode}) {
  return <g opacity={arrive(time,at,320)}>{children}</g>;
}

export function Route({x1,y1,x2,y2,time,at,color=blue,duration=650}: {
  x1:number; y1:number; x2:number; y2:number; time:number; at:number; color?:string; duration?:number;
}) {
  const p=progress(time,at,at+duration,easing.transform);
  const x=mix(x1,x2,p), y=mix(y1,y2,p);
  const angle=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
  return <g fill="none" stroke={color} strokeWidth={4} opacity={p>0 ? 1 : 0}>
    <path d={`M${x1} ${y1} L${x} ${y}`}/>
    <path d="M-14 -8 L0 0 L-14 8" transform={`translate(${x} ${y}) rotate(${angle})`}/>
  </g>;
}

export function Phone({x,y,scale=1,children}: {x:number; y:number; scale?:number; children?:React.ReactNode}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-90} y={-138} width={180} height={276} rx={20} fill={paper} stroke={ink} strokeWidth={4}/>
    <path d="M-20 -119 h40 M-19 117 h38" stroke={ink} strokeWidth={4}/>{children}
  </g>;
}

export function Database({x,y,scale=1}: {x:number; y:number; scale?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={blue} strokeWidth={3} fill="#e7f0f7">
    <path d="M-43 -20 v42 c0 18 86 18 86 0 v-42"/><ellipse cy={-20} rx={43} ry={13}/>
    <path d="M-43 0 C-43 18 43 18 43 0" fill="none"/>
  </g>;
}

export function Slip({x,y,label,muted=false}: {x:number; y:number; label:string; muted?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-99 -37 L76 -37 L99 -15 V37 H-99 Z M76 -37 V-15 H99"
      stroke={muted ? '#888c86' : blue} strokeWidth={3.5} fill={paper}/>
    <Note x={-4} y={11} size={29} bold color={muted ? '#747772' : ink}>{label}</Note>
  </g>;
}
