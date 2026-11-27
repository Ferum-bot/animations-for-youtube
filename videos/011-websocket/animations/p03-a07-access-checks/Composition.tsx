import React from 'react';
import {arrive, useSceneTime, v2Theme, type PreviewProps} from '@channel/motion-v2';
import {AccessSourceStage} from '../../shared/AccessSourceStage';
import {chapterColors} from '../../shared/chapterColors';

const checks = [
  {at:3340, stage:'Соединение', question:'Кто подключился?', code:'authenticate(session)'},
  {at:7680, stage:'Подписка', question:'Открыт ли пользователю этот канал?', code:'canSubscribe(user, channel)'},
  {at:13540, stage:'Действие', question:'Разрешена ли эта команда сейчас?', code:'canAct(user, command, resource)'},
] as const;

const Composition: React.FC<PreviewProps> = props => {
  const {timeMs} = useSceneTime();
  return <AccessSourceStage {...props} audio="access-checks" label="Три уровня проверки прав">
    <g fill={chapterColors.text}>
      <rect y={28} width={1460} height={1384} fill={chapterColors.background}/>
      <text x={68} y={176} fontSize={74} fontWeight={690}>Три уровня проверки прав</text>
      {checks.map(({at,stage,question,code},i) => {
        const show = arrive(timeMs,at,230);
        return <g key={stage} transform={`translate(0 ${248+i*353})`}>
          <path d="M68 0 H1392" stroke={chapterColors.text} opacity={0.3} strokeWidth={2}/>
          <text x={68} y={91} fontWeight={680} fontSize={55} opacity={0.60+0.40*show}>{stage}</text>
          <g opacity={show} transform={`translate(0 ${8*(1-show)})`}>
            <text x={68} y={177} fontSize={48}>{question}</text>
            <text x={68} y={249} fontSize={40} fontFamily={v2Theme.fontMono}>{code}</text>
          </g>
        </g>;
      })}
    </g>
  </AccessSourceStage>;
};
export default Composition;
