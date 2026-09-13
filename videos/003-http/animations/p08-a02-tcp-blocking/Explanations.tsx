import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {DataBlock} from '../../shared/evolution/Elements';
import {cue, evolutionScenes} from '../../shared/evolution/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const transport = cue('blocking', 'p08-evolution-transport');
const tcp = cue('blocking', 'p08-evolution-tcp');
const missing = cue('blocking', 'p08-evolution-missing');
const later = cue('blocking', 'p08-evolution-later');
const blocked = cue('blocking', 'p08-evolution-blocked');
const recovered = cue('blocking', 'p08-evolution-recovered');

export const TransportLayers: React.FC<TimeProps> = ({timeMs}) => {
  const lift = reveal(timeMs, transport, 1800);
  return <g opacity={shotOpacity(timeMs, 0, tcp)}>
    <Label x={212} y={490}>СЛЕДУЮЩИЙ ШАГ — СМЕНА ТРАНСПОРТА</Label>
    <g opacity={reveal(timeMs, transport)}>
      <DepthPlate x={270} y={830} width={815} height={167} depth={.65}>
        <text x={34} y={62} fontFamily={theme.fontMono} fontSize={43} fill={theme.primary}>TCP</text>
        <text x={34} y={115} fontSize={29} fill={theme.text}>Единый упорядоченный поток байтов</text>
      </DepthPlate>
      {[300, 680, 1060].map(x => <path key={x} d={`M ${x} ${800 - lift * 140} V 830`} stroke={theme.line} strokeWidth={2} strokeDasharray="5 9" />)}
    </g>
    <g transform={`translate(0 ${-lift * 155})`}>
      <DepthPlate x={270} y={690} width={815} height={160} depth={.2 + lift * .45}>
        <text x={34} y={58} fontFamily={theme.fontMono} fontSize={38} fill={theme.text}>HTTP/2</text>
        <text x={34} y={112} fontSize={28} fill={theme.muted}>Потоки 1 · 3 · 5</text>
        {['D·1', 'D·3', 'D·5'].map((label, i) => <DataBlock key={label} x={388 + i * 130} y={60} width={110} height={58} label={label} active={i === 2} />)}
      </DepthPlate>
    </g>
    <Caption opacity={reveal(timeMs, transport + 600)} detail="HTTP/3 меняет транспорт; сначала посмотрим на ограничение TCP">Под потоками HTTP/2 остаётся один TCP</Caption>
  </g>;
};

export const ReceiveBuffer: React.FC<TimeProps> = ({timeMs}) => {
  const missingVisible = reveal(timeMs, missing, 450) * (1 - reveal(timeMs, recovered, 250));
  const recovery = reveal(timeMs, recovered, 350);
  const delivery = reveal(timeMs, recovered + 350, 450);
  return <g opacity={shotOpacity(timeMs, tcp, evolutionScenes.blocking.durationMs + 330)}>
    <Label x={212} y={490}>ПРИЁМНАЯ СТОРОНА / TCP</Label>
    <text x={245} y={601} fontSize={32} fill={theme.text}>Байты выдаются приложению по порядку</text>
    <text x={245} y={666} fontFamily={theme.fontMono} fontSize={25} fill={theme.muted}>Условные участки байтового потока</text>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((value, i) => {
      const present = value < 3 ? 1 : value === 3 ? recovery : reveal(timeMs, later + (value - 4) * 250);
      return <g key={value}>
        <path d={`M ${245 + i * 114} 735 h 99 v 100 h -99 Z`} fill="none" stroke={theme.line} strokeWidth={1.5} strokeDasharray={value === 3 ? '5 6' : undefined} />
        <DataBlock x={245 + i * 114} y={735 - (value === 3 ? 70 * (1 - recovery) : 0)} width={99} height={100} label={String(value)} fontSize={38} active={value < 3 || delivery === 1} opacity={present} />
        {value === 3 ? <text x={294 + i * 114} y={797} textAnchor="middle" fontSize={40} fill={theme.primary} opacity={missingVisible}>?</text> : null}
      </g>;
    })}
    <path d={`M ${473 + delivery * 688} 702 V 877 M ${462 + delivery * 688} 715 L ${473 + delivery * 688} 702 L ${484 + delivery * 688} 715`} stroke={theme.primary} strokeWidth={3} fill="none" />
    <text x={245} y={899} fontSize={25} fill={theme.primary}>{delivery === 1 ? 'Выдано: 1–8' : 'Выдано: 1–2'}</text>
    <text x={615} y={899} fontSize={25} fill={theme.muted} opacity={reveal(timeMs, later + 1200)}>{recovery === 1 ? 'Недостающий участок получен' : '4–8 уже в буфере'}</text>
    <g opacity={reveal(timeMs, blocked)}>
      {[1, 3, 5].map((stream, i) => <g key={stream}>
        <path d={`M ${385 + i * 305} 932 V 958`} stroke={theme.line} strokeWidth={2} />
        <DataBlock x={245 + i * 305} y={975} width={278} label={`Поток ${stream} · ${delivery === 1 ? 'читает' : 'ждёт'}`} active={delivery === 1} fontSize={24} />
      </g>)}
    </g>
    <Caption opacity={reveal(timeMs, missing)} detail="Пропуск задерживает выдачу следующих данных всем HTTP-потокам">
      {timeMs < blocked ? 'Нет участка 3 — дальше выдать нельзя' : recovery === 1 ? 'Пропуск заполнен — выдача продолжается' : 'Уже получено ≠ доступно приложению'}
    </Caption>
  </g>;
};
