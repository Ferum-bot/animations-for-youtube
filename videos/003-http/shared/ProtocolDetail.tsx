import React from 'react';
import {httpTheme as theme} from './theme';
import {reveal} from './timing';

export type ProtocolDetailKind =
  | 'request' | 'anatomy' | 'semantics' | 'codes' | 'headers'
  | 'body' | 'versions' | 'bytes';

const Label: React.FC<{x?: number; y: number; children: React.ReactNode;
  accent?: boolean; size?: number}> = ({x = 0, y, children, accent = false, size = 28}) => (
  <text x={x} y={y} fill={accent ? theme.primary : theme.text}
    fontFamily={theme.fontMono} fontSize={size}>{children}</text>
);

const Anatomy: React.FC<{body: boolean; progress: number}> = ({body, progress}) => (
  <g>
    <rect x={0} y={16} width={150} height={24} fill="none" stroke={theme.muted} strokeWidth={3} />
    <path d="M 210 18 H 382 M 210 39 H 382" stroke={theme.muted} strokeWidth={3} />
    <rect x={433} y={12} width={5} height={40} fill={theme.primary} opacity={progress} />
    <rect x={483} y={12} width={180} height={40} fill={body ? theme.primary : 'none'}
      fillOpacity={body ? progress * 0.12 : 0} stroke={body ? theme.primary : theme.muted} strokeWidth={3} />
    <Label x={10} y={92} size={24}>строка</Label>
    <Label x={210} y={92} size={24}>заголовки</Label>
    <Label x={505} y={92} size={24} accent={body}>тело</Label>
    {body ? <Label x={180} y={154} size={25} accent>Content-Length: 9</Label> : null}
  </g>
);

const Versions: React.FC<{progress: number}> = ({progress}) => (
  <g>
    {['1.0', '1.1', '2', '3'].map((version, index) => {
      const x = index * 178;
      return (
        <g key={version}>
          <Label x={x} y={32}>{version}</Label>
          {Array.from({length: index < 2 ? index + 1 : 3}, (_, lane) => (
            <g key={lane} transform={`translate(${x} ${64 + lane * 19})`}>
              <path d="M 0 0 H 96" stroke={theme.line} strokeWidth={3} />
              <path d={`M ${index === 2 ? lane * 12 : 0} 0 h ${96 * progress - (index === 2 ? lane * 12 : 0)}`}
                stroke={index === 3 ? theme.primary : theme.text} strokeWidth={3}
                opacity={progress > 0.4 ? 1 : 0} />
            </g>
          ))}
        </g>
      );
    })}
  </g>
);

/** Small semantic illustration slot, shared by chapter cards and the agenda. */
export const ProtocolDetail: React.FC<{
  kind: ProtocolDetailKind;
  elapsedMs: number;
}> = ({kind, elapsedMs}) => {
  const progress = reveal(elapsedMs, 0, 650);
  switch (kind) {
    case 'request':
      return <g>
        <Label y={32} accent>GET / HTTP/1.1</Label>
        {[0, 1, 2].map((line) => <path key={line}
          d={`M 0 ${70 + line * 26 + (line === 2 ? 12 : 0)} H ${(line === 2 ? 420 : 325) * progress}`}
          stroke={theme.muted} strokeWidth={3} />)}
      </g>;
    case 'anatomy': return <Anatomy body={false} progress={progress} />;
    case 'body': return <g>
      <Anatomy body progress={progress} />
      <text x={505} y={40} fontFamily={theme.fontMono} fontSize={23} fill={theme.primary}>
        {'{"id":42}'}
      </text>
    </g>;
    case 'semantics':
      return <g>{[
        {label: 'GET', caption: 'метод'},
        {label: '200', caption: 'код'},
        {label: 'Host', caption: 'заголовок'},
      ].map((item, index) => <g key={item.label} opacity={reveal(elapsedMs, index * 130)}>
        <Label x={index * 230} y={42} size={40} accent>{item.label}</Label>
        <Label x={index * 230} y={93} size={23}>{item.caption}</Label>
      </g>)}</g>;
    case 'codes':
      return <g>{['1xx', '2xx', '3xx', '4xx', '5xx'].map((label, index) => (
        <g key={label} opacity={reveal(elapsedMs, index * 90)}>
          <Label x={index * 137} y={45} size={33} accent={index === 1}>{label}</Label>
          <path d={`M ${index * 137} 70 h 72`} stroke={index === 1 ? theme.primary : theme.line} strokeWidth={3} />
        </g>
      ))}</g>;
    case 'headers':
      return <g>
        <Label y={35} size={26} accent>Host: example.test</Label>
        <Label y={88} size={26}>Content-Type: application/json</Label>
        <path d={`M 0 117 H ${630 * progress}`} stroke={theme.line} strokeWidth={2} />
      </g>;
    case 'versions': return <Versions progress={progress} />;
    case 'bytes':
      return <g>
        <Label y={54} size={54}>{'{}'}</Label>
        <g opacity={progress} transform={`translate(${(1 - progress) * -18} 0)`}>
          <path d="M 150 39 H 258 M 245 29 L 258 39 L 245 49" fill="none" stroke={theme.muted} strokeWidth={3} />
          <Label x={310} y={54} size={40} accent>7B 7D</Label>
        </g>
        <Label x={115} y={119} size={24}>JSON → байты</Label>
      </g>;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
};
