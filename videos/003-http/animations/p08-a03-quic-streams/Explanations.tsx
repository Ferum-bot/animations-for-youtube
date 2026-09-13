import React from 'react';
import {Label} from '../../shared/HttpDiagram';
import {Caption, DepthPlate, httpDetailTheme as theme, type TimeProps} from '../../shared/HttpElements';
import {DataBlock} from '../../shared/evolution/Elements';
import {cue, evolutionScenes} from '../../shared/evolution/timing';
import {reveal, shotOpacity} from '../../shared/timing';

const replace = cue('quic', 'p08-evolution-replace');
const quic = cue('quic', 'p08-evolution-quic');
const video = cue('quic', 'p08-evolution-video');

const StreamMechanism: React.FC<{timeMs: number}> = ({timeMs}) => {
  const split = reveal(timeMs, replace, 1800);
  const delivered = reveal(timeMs, quic + 150, 1500);
  return <g>
    <path d="M 1128 593 H 1148 V 1110 H 1128" stroke={theme.line} strokeWidth={2} fill="none" />
    {['index.html', 'hero.jpg', 'icon.svg'].map((name, i) => {
      const y = 828 + (i - 1) * 175 * split;
      const gateX = i === 1 ? 690 : 690 + 407 * delivered;
      return <g key={name} opacity={i === 1 ? 1 : split}>
        <DepthPlate x={240} y={y - 55} width={855} height={104} depth={.2 + split * .18}>
          <text x={24} y={57} fontFamily={theme.fontMono} fontSize={27} fill={theme.text}>{name}</text>
        </DepthPlate>
        {[0, 1, 2, 3, 4].map(j => <g key={j}>
          {i === 1 && j === 2 ? <>
            <path d={`M ${485 + j * 116} ${y - 31} h 97 v 64 h -97 Z`} fill="none" stroke={theme.muted} strokeWidth={2} strokeDasharray="5 6" />
            <text x={532 + j * 116} y={y + 13} textAnchor="middle" fontSize={35} fill={theme.primary}>?</text>
          </> : <DataBlock x={485 + j * 116} y={y - 31} width={97} height={64} label={String(j + 1)}
            active={j < 2 || (i !== 1 && delivered > j / 5)} opacity={.45 + .55 * reveal(timeMs, replace + 600 + j * 130)} />}
        </g>)}
        <path d={`M ${gateX} ${y - 65} V ${y + 61}`} stroke={theme.primary} strokeWidth={3} />
        <text x={240} y={y + 82} fontSize={25} fill={i === 1 ? theme.muted : theme.primary} opacity={reveal(timeMs, quic + 600)}>
          {i === 1 ? 'Ждёт недостающие данные' : delivered === 1 ? 'Данные доступны приложению' : 'Выдача продолжается'}
        </text>
      </g>;
    })}
  </g>;
};

export const IndependentDelivery: React.FC<TimeProps> = ({timeMs}) => <g opacity={shotOpacity(timeMs, 0, video)}>
  <Label x={212} y={490}>ПОРЯДОК СОХРАНЯЕТСЯ ВНУТРИ КАЖДОГО ПОТОКА</Label>
  <text x={245} y={559} fontFamily={theme.fontMono} fontSize={35} fill={theme.primary} opacity={reveal(timeMs, quic)}>QUIC / одно соединение</text>
  <StreamMechanism timeMs={timeMs} />
  <Caption opacity={reveal(timeMs, replace)} detail="Пропуск в одном потоке не создаёт общую очередь доставки">У каждого потока своя граница выдачи</Caption>
</g>;

export const TransportVideo: React.FC<TimeProps> = ({timeMs}) => {
  const hint = reveal(timeMs, cue('quic', 'p08-evolution-hint'), 500);
  return <g opacity={shotOpacity(timeMs, video, evolutionScenes.quic.durationMs + 330)}>
    <Label x={212} y={490}>ПОДРОБНЕЕ — В ВИДЕО ПРО ТРАНСПОРТ</Label>
    <DepthPlate x={250} y={610} width={845} height={440} depth={.42}>
      <text x={42} y={82} fontSize={47} fontWeight={700} fill={theme.text}>ТРАНСПОРТНЫЙ УРОВЕНЬ</text>
      <text x={42} y={142} fontFamily={theme.fontMono} fontSize={34} fill={theme.primary}>TCP / QUIC</text>
      <text x={42} y={220} fontSize={28} fill={theme.muted}>Почему потеря данных заставляет ждать</text>
      <path d="M 45 290 H 355 M 45 337 H 355 M 45 384 H 355" stroke={theme.line} strokeWidth={3} />
      <path d="M 222 273 V 400" stroke={theme.text} strokeWidth={4} />
      {[0, 1, 2].map(i => <g key={i}>
        <path d={`M 452 ${290 + i * 47} H 765`} stroke={theme.line} strokeWidth={3} />
        <path d={`M ${i === 1 ? 610 : 760} ${274 + i * 47} v 32`} stroke={theme.primary} strokeWidth={4} />
      </g>)}
    </DepthPlate>
    <g opacity={reveal(timeMs, cue('quic', 'p08-evolution-link'))}>
      <text x={250} y={1169} fontSize={35} fill={theme.text}>Ссылка на видео — в описании</text>
      <path d={`M 1023 1188 V ${1188 - hint * 63} M 1009 ${1142 - hint * 17} L 1023 ${1125} L 1037 ${1142 - hint * 17}`}
        opacity={hint} fill="none" stroke={theme.primary} strokeWidth={3} />
      <text x={250} y={1232} fontSize={28} fill={theme.muted} opacity={hint}>И в подсказке к этому видео</text>
    </g>
  </g>;
};
