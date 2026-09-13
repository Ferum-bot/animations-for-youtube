import React from 'react';
import {DiagramFrame, Label, TimedCopy} from '../../shared/HttpDiagram';
import {HttpSceneHeading, NarratedHttpScene, type HttpSceneProps} from '../../shared/NarratedHttpScene';
import {Caption, DepthPlate, HeaderField, headerTheme as theme} from '../../shared/headers/Elements';
import {cue, headerScenes} from '../../shared/headers/timing';
import {flightOpacity, reveal, useTimeMs} from '../../shared/timing';

const switching = cue('upgrade', 'p05-switch');
const websocket = cue('upgrade', 'p05-websocket');
const nextVideo = cue('upgrade', 'p05-next-video');

const Packet: React.FC<{
  readonly timeMs: number; readonly startMs: number; readonly reverse?: boolean;
  readonly y: number; readonly label: string;
}> = ({timeMs, startMs, reverse = false, y, label}) => {
  const progress = reveal(timeMs, startMs, 1150);
  const x = reverse ? 1040 - progress * 730 : 310 + progress * 730;
  return <g transform={`translate(${x} ${y})`} opacity={flightOpacity(timeMs, startMs, 1200)}>
    <path d="M -50 -23 H 50 V 23 H -50 Z" fill={theme.background} stroke={theme.primary} strokeWidth={2} />
    <text y={8} textAnchor="middle" fontFamily={theme.fontMono} fontSize={23} fill={theme.text}>{label}</text>
  </g>;
};

const Composition: React.FC<HttpSceneProps> = (props) => {
  const timeMs = useTimeMs();
  const duplex = reveal(timeMs, websocket, 900);
  const separation = duplex * 44;
  return <NarratedHttpScene {...props} {...headerScenes.upgrade}>
    <HttpSceneHeading title="СМЕНА ПРОТОКОЛА" eyebrow="HTTP / UPGRADE" />
    <DiagramFrame timeMs={timeMs} />
    <Label x={212} y={495}>HTTP/1.1 / ФРАГМЕНТЫ РУКОПОЖАТИЯ</Label>
    <HeaderField name="Connection" value="Upgrade" y={578} opacity={reveal(timeMs, 600)} accent />
    <HeaderField name="Upgrade" value="websocket" y={646} opacity={reveal(timeMs, 1100)} accent />
    <g opacity={reveal(timeMs, switching + 1700)}>
      <text x={212} y={729} fontFamily={theme.fontMono} fontSize={35} fill={theme.primary}>101 Switching Protocols</text>
      <path d="M 212 758 H 1170" stroke={theme.line} />
    </g>
    <g opacity={reveal(timeMs, 1400)}>
      <text x={212} y={839} fontSize={31} fill={theme.text}>Клиент</text>
      <text x={1040} y={839} fontSize={31} fill={theme.text}>Сервер</text>
      <path d={`M 264 ${948 - separation} H 1135`} stroke={theme.line} strokeWidth={3} fill="none" />
      <path d={`M 1120 ${938 - separation} L 1135 ${948 - separation} L 1120 ${958 - separation}`} opacity={duplex} stroke={theme.line} strokeWidth={3} fill="none" />
      <path d={`M 1135 ${948 + separation} H 264 M 279 ${938 + separation} L 264 ${948 + separation} L 279 ${958 + separation}`} opacity={duplex} stroke={theme.primary} strokeWidth={3} fill="none" />
      <Packet timeMs={timeMs} startMs={switching + 100} y={948} label="GET" />
      <Packet timeMs={timeMs} startMs={switching + 1800} y={948} label="101" reverse />
      <Packet timeMs={timeMs} startMs={websocket + 1000} y={904} label="DATA" />
      <Packet timeMs={timeMs} startMs={websocket + 1000} y={992} label="DATA" reverse />
      <DepthPlate x={557} y={831} width={276} height={224} depth={0.4 + duplex * 0.8} selected={duplex > 0.99}>
        <path d="M 30 34 H 245 M 30 189 H 245" stroke={theme.line} strokeWidth={2} />
        <g transform={`translate(138 117) rotate(${90 * duplex})`}>
          <circle r={67} stroke={theme.muted} strokeWidth={2} fill={theme.background} />
          <path d="M -55 -31 H 30 L 45 -16 V 16 L 30 31 H -55" stroke={theme.primary} strokeWidth={3} fill="none" transform={`rotate(${-90 * duplex})`} />
          <path d="M -34 -31 H 27 M 17 -40 L 27 -31 L 17 -22" stroke={theme.primary} fill="none" strokeWidth={3} opacity={duplex} transform={`rotate(${-90 * duplex})`} />
          <path d="M 34 31 H -27 M -17 22 L -27 31 L -17 40" stroke={theme.primary} fill="none" strokeWidth={3} opacity={duplex} transform={`rotate(${-90 * duplex})`} />
          <path d="M 0 -77 V -67 M 77 0 H 67 M 0 77 V 67 M -77 0 H -67" stroke={theme.text} strokeWidth={3} />
        </g>
      </DepthPlate>
      <TimedCopy timeMs={timeMs} states={[{startMs: 1500, text: 'HTTP/1.1'}, {startMs: websocket + 850, text: 'WebSocket'}]} x={586} y={1112} fontSize={34} />
    </g>
    <Caption detail={timeMs >= nextVideo ? 'Подробнее — в видео про WebSocket' : 'Переключение после успешного рукопожатия'} opacity={reveal(timeMs, websocket + 1200)}>Соединение то же. Протокол другой.</Caption>
  </NarratedHttpScene>;
};
export default Composition;
