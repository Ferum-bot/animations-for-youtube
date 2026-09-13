import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {cue, shotOpacity} from '../../shared/status/timing';
import {statusTheme as theme} from '../../shared/status/theme';
import {reveal} from '../../shared/timing';

const start = cue('infrastructure', 'p04-standard-code');
const alerting = cue('infrastructure', 'p04-alerting');
const errors = cue('infrastructure', 'p04-errors');
const notification = cue('infrastructure', 'p04-notification');
const conclusion = cue('infrastructure', 'p04-conclusion');

export const Monitoring: React.FC<{readonly timeMs: number}> = ({timeMs}) => {
  const compact = reveal(timeMs, alerting - 600, 550);
  // Move clear of the version text before rising into the same baseline.
  const codeX = 212 + reveal(timeMs, alerting - 600, 250) * 255;
  const codeY = 850 - reveal(timeMs, alerting - 350, 300) * 245;
  return <g opacity={shotOpacity(timeMs, start, conclusion)}>
    <Label x={212} y={500}>СТАНДАРТНЫЙ ОТВЕТ ПРИЛОЖЕНИЯ</Label>
    <text x={212} y={605} fontFamily={theme.fontMono} fontSize={47} fill={theme.text}>HTTP/1.1</text>
    <text x={codeX} y={codeY} fontFamily={theme.fontMono} fontSize={160 - compact * 113} fill={theme.danger}>500</text>
    <text x={212} y={980} fontSize={34} fill={theme.muted} opacity={1 - compact}>Ошибка в прикладной обработке</text>
    <g opacity={reveal(timeMs, alerting, 350)}>
      <path d="M 250 643 V 707 H 300" stroke={theme.line} strokeWidth={2} fill="none" />
      <Label x={340} y={717}>ЖУРНАЛ ОТВЕТОВ</Label>
      {['GET /profile   500', 'GET /profile   500', 'GET /profile   500'].map((line, index) => <g key={index} opacity={reveal(timeMs, alerting + 400 + index * 550, 250)}>
        <text x={340} y={784 + index * 57} fontFamily={theme.fontMono} fontSize={32} fill={theme.text}>{line}</text>
        <path d={`M 323 ${757 + index * 57} V ${790 + index * 57}`} stroke={theme.danger} strokeWidth={3} />
      </g>)}
    </g>
    <g opacity={reveal(timeMs, errors, 300)}>
      <path d="M 250 707 V 982 H 300" fill="none" stroke={theme.line} strokeWidth={2} />
      <text x={340} y={994} fontSize={33} fill={theme.text}>Правило мониторинга: <tspan fontFamily={theme.fontMono} fill={theme.danger}>5xx</tspan></text>
    </g>
    <g opacity={reveal(timeMs, notification, 350)} transform={`translate(0 ${12 * (1 - reveal(timeMs, notification, 350))})`}>
      <path d="M 250 982 V 1134 H 300" fill="none" stroke={theme.line} strokeWidth={2} />
      <path d="M 340 1074 H 1175 V 1210 H 340 Z" fill={theme.surface} stroke={theme.line} strokeWidth={2} />
      <path d="M 340 1074 V 1210" stroke={theme.danger} strokeWidth={5} />
      <text x={377} y={1128} fontSize={38} fill={theme.text}>Ошибки сервера</text>
      <text x={377} y={1180} fontSize={27} fill={theme.muted}>Сработало настроенное правило</text>
    </g>
  </g>;
};

export const Resolution: React.FC<{readonly timeMs: number}> = ({timeMs}) => <g opacity={reveal(timeMs, conclusion, 350)}>
  <text x={212} y={630} fontSize={62} fontWeight={600} fill={theme.text}>Общий протокол.</text>
  <text x={212} y={710} fontSize={55} fontWeight={600} fill={theme.primary}>Независимые системы.</text>
  <path d="M 230 850 H 1150 M 230 836 V 864 M 550 836 V 864 M 850 836 V 864 M 1150 836 V 864" stroke={theme.line} strokeWidth={3} />
  {['Клиент', 'Прокси', 'Сервер'].map((label, index) => <text key={label} x={212 + index * 320} y={925} fontSize={32} fill={theme.text}>{label}</text>)}
  <text x={948} y={1020} fontSize={32} fill={theme.text}>Мониторинг</text>
  <path d="M 1150 864 V 966" stroke={theme.line} strokeWidth={2} />
  <text x={212} y={1160} fontFamily={theme.fontMono} fontSize={70} fill={theme.primary}>HTTP STATUS</text>
</g>;
