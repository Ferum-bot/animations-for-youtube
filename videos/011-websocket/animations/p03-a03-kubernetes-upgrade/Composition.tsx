import React from 'react';
import {arrive, presence, SourceImage, useSceneTime, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage, accessAssets} from '../../shared/AccessSourceStage';
import {chapterColors} from '../../shared/chapterColors';

const issueUrl = 'https://github.com/kubernetes/kubernetes/issues/71411';

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  const severity = presence(timeMs, 4040, 6960, 200);
  const credentials = arrive(timeMs, 8480, 240);

  return <AccessSourceStage {...props} audio="kubernetes-upgrade" label="Отчёт Kubernetes о CVE-2018-1002105">
    <g fill={chapterColors.text}>
      <rect y={28} width={1460} height={1384} fill={chapterColors.background}/>
      <text x={72} y={124} fontSize={49} fontWeight={640}>Kubernetes · GitHub · 26 ноября 2018</text>
      <a href={issueUrl} target="_blank" rel="noreferrer">
        <svg y={182} width={1460} height={922} viewBox="0 0 700 442">
          <SourceImage src={`${accessAssets}/kubernetes-71411.webp`} x={0} y={0} width={700} height={442}/>
          {/* Positions are measured from text ranges in the captured GitHub page. */}
          <g fill={chapterColors.text}>
            <rect x={343} y={277} width={74} height={19} opacity={severity * 0.24}/>
            <g opacity={credentials * 0.24}>
              <rect x={268} y={356} width={335} height={19}/>
              <rect x={32} y={377} width={74} height={19}/>
            </g>
          </g>
        </svg>
      </a>
      <text x={72} y={1193} fontSize={52} fontWeight={620}>
        <tspan x={72}>После неудачного Upgrade соединение</tspan>
        <tspan x={72} dy={69}>оставалось открытым. Запросы шли</tspan>
        <tspan x={72} dy={69}>с правами API-сервера.</tspan>
      </text>
    </g>
  </AccessSourceStage>;
};

export default Composition;
