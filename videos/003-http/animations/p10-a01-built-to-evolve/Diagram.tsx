import React from 'react';
import {httpTheme as theme} from '../../shared/theme';
import {reveal} from '../../shared/timing';
import {cue, type FinaleAnchor} from './timing';

type EndpointKind = 'browser' | 'application' | 'service';
type DiagramColumn = {
  readonly label: string;
  readonly detail: string;
  readonly anchor: FinaleAnchor;
  readonly endpoint: {readonly label: string; readonly kind: EndpointKind};
};

const columns = [
  {label: 'Расширять', detail: 'методы', anchor: 'p10-finale-extend', endpoint: {label: 'Браузер', kind: 'browser'}},
  {label: 'Дополнять', detail: 'заголовки', anchor: 'p10-finale-add', endpoint: {label: 'Приложение', kind: 'application'}},
  {label: 'Настраивать', detail: 'представления', anchor: 'p10-finale-configure', endpoint: {label: 'Сервис', kind: 'service'}},
] as const satisfies readonly DiagramColumn[];

const centerX = 696;
const columnX = (index: number): number => 310 + index * 386;

const EndpointIcon: React.FC<{kind: EndpointKind}> = ({kind}) => {
  switch (kind) {
    case 'browser':
      return <><rect x={-36} y={-25} width={72} height={50} rx={3} /><path d="M-36 -11H36 M-25 -18h2 m8 0h2" /></>;
    case 'application':
      return <><rect x={-21} y={-31} width={42} height={62} rx={6} /><path d="M-8 -21H8 M-6 22H6" /></>;
    case 'service':
      return <><rect x={-34} y={-27} width={68} height={22} rx={3} /><rect x={-34} y={5} width={68} height={22} rx={3} /><path d="M-22 -16h3 M-22 16h3 M-6 -16H22 M-6 16H22" /></>;
  }
};

/** The fixed HTTP core survives the change from extension points to applications. */
export const ProtocolDiagram: React.FC<{timeMs: number}> = ({timeMs}) => {
  const enter = reveal(timeMs, 180, 500);
  const networkAt = cue('p10-finale-internet');
  const network = reveal(timeMs, networkAt + 320, 400);
  const extensionsOpacity = 1 - reveal(timeMs, networkAt, 280);
  return <g opacity={enter} transform={`translate(0 ${(1 - enter) * 16})`}>
    <rect x={466} y={460} width={460} height={238} fill={theme.surface} />
    <path d="M466 508V460H514 M878 460H926V508 M466 650V698H514 M878 698H926V650"
      fill="none" stroke={theme.primary} strokeWidth={3} />
    <text x={centerX} y={610} textAnchor="middle" fontSize={132} fontWeight={650} letterSpacing={-5} fill={theme.text}>HTTP</text>
    <text x={centerX} y={666} textAnchor="middle" fontFamily={theme.fontMono} fontSize={23} fill={theme.muted}>
      запрос / ответ
    </text>

    {columns.map((extension, index) => {
      const x = columnX(index);
      const dock = reveal(timeMs, cue(extension.anchor), 480);
      const shape = extensionsOpacity;
      const {endpoint} = extension;
      return <g key={extension.anchor} opacity={dock}>
        <path d={`M${centerX} 698 V758 H${x} V835`} fill="none" stroke={theme.line} strokeWidth={2}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dock} />
        <g transform={`translate(${x} ${850 + (1 - dock) * 24})`}>
          <path d="M-142 0H-30L-18 -12H18L30 0H142V162H-142Z"
            fill={theme.surface} stroke={theme.line} strokeWidth={1.5} opacity={shape} />
          <g opacity={shape}>
            <text y={69} textAnchor="middle" fontSize={31} fontWeight={600} fill={theme.text}>{extension.label}</text>
            <text y={114} textAnchor="middle" fontFamily={theme.fontMono} fontSize={22} fill={theme.primary}>{extension.detail}</text>
          </g>
          <g opacity={network} transform={`translate(0 ${(1 - network) * 10})`}>
            <g transform="translate(0 45)" stroke={theme.primary} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <EndpointIcon kind={endpoint.kind} />
            </g>
            <text y={118} textAnchor="middle" fontSize={32} fontWeight={500} fill={theme.text}>{endpoint.label}</text>
          </g>
        </g>
      </g>;
    })}
  </g>;
};

/** One browser-to-service request and its response; the middle application is not a proxy. */
export const FinalExchange: React.FC<{timeMs: number}> = ({timeMs}) => {
  const requestAt = cue('p10-finale-understanding');
  const responseAt = requestAt + 1800;
  const request = reveal(timeMs, requestAt, 1500);
  const response = reveal(timeMs, responseAt, 1500);
  const show = reveal(timeMs, requestAt - 500, 400);
  const travelling = (start: number, end: number): number =>
    reveal(timeMs, start, 100) * (1 - reveal(timeMs, end - 120, 120));
  const requestAlpha = travelling(requestAt, responseAt);
  const responseAlpha = travelling(responseAt, responseAt + 1700);
  return <g opacity={show}>
    <path d="M310 1030V1110H1082V1030" fill="none" stroke={theme.line} strokeWidth={2} />
    <circle cx={310} cy={1030} r={4} fill={theme.primary} />
    <circle cx={1082} cy={1030} r={4} fill={theme.primary} />
    <g opacity={requestAlpha} transform={`translate(${310 + 772 * request} 1110)`}>
      <rect x={-12} y={-5} width={24} height={10} rx={2} fill={theme.primary} />
      <text y={-25} textAnchor="middle" fontSize={24} fill={theme.text}>запрос</text>
    </g>
    <g opacity={responseAlpha} transform={`translate(${1082 - 772 * response} 1110)`}>
      <rect x={-12} y={-5} width={24} height={10} rx={2} fill={theme.text} />
      <text y={-25} textAnchor="middle" fontSize={24} fill={theme.text}>ответ</text>
    </g>
    <text x={centerX} y={1220} textAnchor="middle" fontSize={30} fill={theme.text}
      opacity={reveal(timeMs, responseAt + 1800, 400)}>Общая основа сетевого взаимодействия</text>
  </g>;
};
