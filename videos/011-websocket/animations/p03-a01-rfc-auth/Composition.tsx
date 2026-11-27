import React from 'react';
import {arrive, SourceImage, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage, accessAssets} from '../../shared/AccessSourceStage';
import {chapterColors as colors} from '../../shared/chapterColors';

const url = 'https://www.rfc-editor.org/rfc/rfc6455.html#section-10.5';
// Browser range for the first sentence in §10.5, in CSS pixels.
const selection = [[31.47,62,524.41,15],[8,77,430.47,15]] as const;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  return <AccessSourceStage {...props} label="RFC 6455, раздел 10.5. Аутентификация клиента" audio="rfc-auth">
    <g fill={colors.text}>
      <rect y={28} width={1460} height={1384} fill={colors.background}/>
      <text x={84} y={116} fontSize={39}>RFC Editor · декабрь 2011</text>
      <text x={80} y={220} fontWeight={700} fontSize={72}>RFC 6455 · The WebSocket Protocol</text>
      <a href={url} target="_blank" rel="noreferrer">
        <rect y={280} width={1460} height={680} fill="white"/>
        <svg y={395} width={1460} height={347} viewBox="0 9 580 138" preserveAspectRatio="xMinYMin slice" overflow="hidden">
          <SourceImage src={`${accessAssets}/rfc.webp`} x={0} y={0} width={580} height={278}/>
          {selection.map(([x,y,width,height],i) => <rect key={y} x={x} y={y} height={height}
            width={width*arrive(timeMs,220+i*150,350)} fill={v2Theme.primary} opacity={0.20}/>)}
        </svg>
      </a>
      <text x={83} y={1054} fontSize={35} opacity={0.78}>§ 10.5 · Перевод</text>
      <text x={80} y={1152} fontSize={55} fontWeight={620}>
        <tspan x={80}>Протокол не предписывает, как серверу</tspan>
        <tspan x={80} dy={76}>аутентифицировать клиента во время</tspan>
        <tspan x={80} dy={76}>рукопожатия WebSocket.</tspan>
      </text>
    </g>
  </AccessSourceStage>;
};
export default Composition;
