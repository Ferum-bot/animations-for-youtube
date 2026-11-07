import React from 'react';
import {v2Theme as ink} from '@channel/motion-v2';
import {NotebookCover} from './NotebookCover';
import type {Host} from './chat107';

export const Note: React.FC<{
  x:number; y:number; host:Host; scale?:number; detail?:string; value?:string;
  offline?:boolean; marked?:boolean;
}> = ({x,y,host,scale=1,detail,value,offline=false,marked=false}) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <g opacity={offline ? 0.42 : 1}>
    <NotebookCover />
    {marked && <path d="M442 4 L488 3 L489 92 L466 76 L443 93 Z" fill={ink.primary} />}
    <text x={82} y={83} fontSize={61} fontWeight={650}>{host}</text>
    {detail && <text x={83} y={149} fontSize={40} fill={ink.muted}>{detail}</text>}
    {value && <text x={82} y={212} fontSize={47} fontWeight={600}>{value}</text>}
  </g>
  {offline && <text x={268} y={81} fontSize={40}>нет связи</text>}
</g>;
