import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {exchangeCues, partOneScenes} from '../../shared/partOneTiming';
import {httpTheme as theme} from '../../shared/theme';
import {reveal, useTimeMs} from '../../shared/timing';
import {ExchangeWorld} from './ExchangeWorld';

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const web = reveal(timeMs, exchangeCues.web, 650);
  return <NarratedHttpScene {...props} {...partOneScenes.exchange} sceneLayer={<ExchangeWorld timeMs={timeMs} />}>
    <HttpSceneHeading title="ЗАПРОС → ОТВЕТ" eyebrow="HTTP / ОБЩИЙ ЯЗЫК" />
    <g opacity={reveal(timeMs, 250, 450)}>
      <text x={323} y={972} textAnchor="middle" fontSize={44} fill={theme.text}>Клиент</text>
      <text x={1037} y={972} textAnchor="middle" fontSize={44} fill={theme.text}>Сервер</text>
      <text x={680} y={530} textAnchor="middle" fontFamily={theme.fontMono} fontSize={27} fill={theme.primary}>ЗАПРОС →</text>
      <text x={680} y={911} textAnchor="middle" fontFamily={theme.fontMono} fontSize={27} fill={theme.text} opacity={reveal(timeMs, exchangeCues.response - 300, 250)}>← ОТВЕТ</text>
    </g>
    <g opacity={web} transform={`translate(0 ${(1 - web) * 18})`}>
      <text x={136} y={1120} fontSize={36} fontWeight={600} fill={theme.text}>Фундамент современного веба</text>
      {['Страницы', 'Приложения', 'API'].map((label, index) => <g key={label} transform={`translate(${136 + index * 385} 1170)`} opacity={reveal(timeMs, exchangeCues.web + index * 180, 400)}>
        <path d="M 0 0 V 26 H 55 M 230 0 V 26 H 175 M 65 12 H 166 M 156 5 L 166 12 L 156 19" fill="none" stroke={theme.line} strokeWidth={3} />
        <text x={115} y={78} textAnchor="middle" fontSize={27} fill={theme.muted}>{label}</text>
      </g>)}
    </g>
  </NarratedHttpScene>;
};

export default Composition;
