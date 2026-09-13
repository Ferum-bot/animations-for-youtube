import React from 'react';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {MessageBrackets} from '../../shared/MessageBrackets';
import {partOneScenes, passportCues as cues} from '../../shared/partOneTiming';
import {httpTheme as theme} from '../../shared/theme';
import {activeStateIndex, reveal, useTimeMs} from '../../shared/timing';

const rows = [
  {label: 'ФОРМАТЫ', y: 462, startMs: cues.formats},
  {label: 'СИНТАКСИС', y: 665, startMs: cues.syntax},
  {label: 'СЕМАНТИКА', y: 868, startMs: cues.semantics},
  {label: 'ПРАВИЛА', y: 1071, startMs: cues.rules},
] as const;
const structure = [
  {x: 230, width: 265, label: 'Стартовая строка'},
  {x: 520, width: 215, label: 'Заголовки'},
  {x: 760, width: 150, label: 'Разделитель'},
  {x: 935, width: 235, label: 'Тело (если есть)'},
] as const;

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const active = activeStateIndex(rows, timeMs);
  const row = rows[active];
  const previousRow = rows[Math.max(0, active - 1)];
  const focus = reveal(timeMs, row?.startMs ?? 0, 320);
  const marker = (previousRow?.y ?? 462) + ((row?.y ?? 462) - (previousRow?.y ?? 462)) * focus;
  const send = reveal(timeMs, cues.client, 650);
  const response = reveal(timeMs, cues.finalResponse, 430);
  return <NarratedHttpScene {...props} {...partOneScenes.passport}>
    <HttpSceneHeading title="ПАСПОРТ ПРОТОКОЛА" eyebrow="HTTP / ЧЕТЫРЕ ОПОРЫ" fontSize={65} />
    <MessageBrackets x={136} y={388} width={1120} height={902} markerY={marker - 415} arm={80} opacity={reveal(timeMs, 250, 400)} />
    {rows.map((item, index) => <g key={item.label} opacity={reveal(timeMs, 500 + index * 140, 450)}>
      <text x={212} y={item.y} fontFamily={theme.fontMono} fontSize={28} letterSpacing={2}
        fill={active === index ? theme.primary : theme.muted} opacity={active < index ? 0.48 : 1}>{item.label}</text>
      {index < 3 ? <path d={`M 212 ${item.y + 160} H 1180`} stroke={theme.line} strokeWidth={1.5} opacity={0.45} /> : null}
    </g>)}
    <g opacity={reveal(timeMs, cues.request, 280)}>
      <path d="M 230 500 H 259 M 230 500 V 568 H 259" fill="none" stroke={theme.primary} strokeWidth={3} />
      <text x={284} y={551} fontSize={47} fill={theme.text}>Запрос</text>
    </g>
    <g opacity={reveal(timeMs, cues.response, 280)}>
      <path d="M 788 500 H 817 M 817 500 V 568 H 788" fill="none" stroke={theme.text} strokeWidth={3} />
      <text x={861} y={551} fontSize={47} fill={theme.text}>Ответ</text>
    </g>
    {structure.map((item, index) => <g key={item.label} opacity={reveal(timeMs, cues.structure[index] ?? 0, 240)}>
      {index === 2 ? <path d={`M ${item.x + item.width / 2} 705 V 750`} stroke={theme.primary} strokeWidth={4} /> :
        <rect x={item.x} y={705} width={item.width} height={45} fill={index === 3 ? theme.primary : theme.surface} stroke={theme.line} strokeWidth={2} />}
      <text x={item.x + item.width / 2} y={791} textAnchor="middle" fontSize={24} fill={theme.text}>{item.label}</text>
    </g>)}
    <g opacity={reveal(timeMs, cues.method, 250)}>
      <text x={230} y={952} fontFamily={theme.fontMono} fontSize={58} fill={theme.primary}>GET</text>
      <text x={405} y={946} fontSize={35} fill={theme.text}>действие</text>
      <text x={230} y={999} fontSize={25} fill={theme.muted}>Метод</text>
    </g>
    <g opacity={reveal(timeMs, cues.status, 250)}>
      <text x={795} y={952} fontFamily={theme.fontMono} fontSize={58} fill={theme.primary}>200</text>
      <text x={965} y={946} fontSize={35} fill={theme.text}>результат</text>
      <text x={795} y={999} fontSize={25} fill={theme.muted}>Код состояния</text>
    </g>
    <g opacity={reveal(timeMs, cues.client - 300, 300)}>
      <text x={230} y={1165} fontSize={40} fill={theme.text}>Клиент</text>
      <text x={995} y={1165} fontSize={40} fill={theme.text}>Сервер</text>
      <path d="M 450 1134 H 929 M 917 1125 L 929 1134 L 917 1143 M 929 1186 H 450 M 462 1177 L 450 1186 L 462 1195" fill="none" stroke={theme.line} strokeWidth={2} />
      <rect x={450 + send * 459} y={1126} width={20} height={16} fill={theme.primary} opacity={1 - response} />
      <rect x={909 - response * 459} y={1178} width={20} height={16} fill={theme.text} opacity={reveal(timeMs, cues.finalResponse, 120)} />
      <text x={690} y={1248} textAnchor="middle" fontSize={27} fill={theme.muted}>Клиент начинает · сервер отвечает</text>
    </g>
  </NarratedHttpScene>;
};

export default Composition;
