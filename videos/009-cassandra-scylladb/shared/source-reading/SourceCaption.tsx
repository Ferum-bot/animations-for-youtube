import React from 'react';
import {mix, productionCanvas, v2Theme as ink} from '@channel/motion-v2';

export type SourceCaptionText = {
  readonly credit: string;
  readonly lines: readonly string[];
  readonly original?: string;
};

const {width: W, height: H} = productionCanvas;
export const SourceCaption:React.FC<{caption:SourceCaptionText; amount:number}> = ({caption,amount})=>{
  const tall=Boolean(caption.original)||caption.lines.length>1;
  const top=tall ? 1012 : 1126;
  return <g opacity={amount} transform={`translate(0 ${mix(18,0,amount)})`}>
    <rect y={top} width={W} height={H-top+2} fill={ink.background} opacity={0.99}/>
    <text x={158} y={top+80} fontSize={42} fill={ink.text} opacity={0.77}>{caption.credit}</text>
    {caption.original && <text x={156} y={top+190} fontSize={60} fontWeight={600}>“{caption.original}”</text>}
    {caption.lines.map((line,i)=><text key={line} x={158} y={top+(caption.original?310:192)+i*89}
      fontSize={caption.original?57:64} fontWeight={caption.original?520:610}>{line}</text>)}
  </g>;
};
