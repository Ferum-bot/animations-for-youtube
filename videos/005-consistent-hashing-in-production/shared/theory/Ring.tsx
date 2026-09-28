import React from 'react';
import {hashingTheme as theme} from '../theme';
import {arcPath, ring, ringPoint, type Token} from './model';
import {Mono} from './Typography';

export const Ring: React.FC<{
  readonly tokens: readonly Token[];
  readonly virtual?: boolean;
  readonly tokenOpacity?: (token: Token, index: number) => number;
  readonly highlight?: (token: Token) => boolean;
  readonly highlightColor?: string;
  readonly labelRadius?: (token: Token) => number;
  readonly children?: React.ReactNode;
}> = ({
  tokens,
  virtual = false,
  tokenOpacity = () => 1,
  highlight = () => false,
  highlightColor = theme.signal,
  labelRadius,
  children,
}) => (
  <>
    <circle cx={ring.x} cy={ring.y} r={ring.radius} stroke={theme.line} fill="none" strokeWidth={3} />
    {Array.from({length: 20}, (_, i) => {
      const a = ringPoint(i * 5, ring.radius - 7);
      const b = ringPoint(i * 5, ring.radius + 7);
      return <path key={i} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={theme.line} strokeWidth={2} />;
    })}
    {children}
    {tokens.map((token, index) => {
      const point = ringPoint(token.position);
      const label = ringPoint(token.position, labelRadius?.(token) ?? (virtual ? 357 : 372));
      const active = highlight(token);
      return (
        <g key={`${token.owner}-${token.position}`} opacity={tokenOpacity(token, index)}>
          <circle
            cx={point.x}
            cy={point.y}
            r={virtual ? 8 : 12}
            fill={active ? highlightColor : theme.text}
            stroke={theme.background}
            strokeWidth={4}
          />
          {!virtual && (token.position === 25 || token.position === 75) ? (
            <>
              <Mono x={label.x} y={label.y - 8} size={34} color={active ? highlightColor : theme.text}>
                {token.owner}
              </Mono>
              <Mono x={label.x} y={label.y + 30} size={26} color={active ? highlightColor : theme.muted}>
                {token.position}
              </Mono>
            </>
          ) : (
            <Mono
              x={label.x}
              y={label.y + 11}
              size={virtual ? 25 : 34}
              color={active ? highlightColor : theme.text}
            >
              {virtual ? `${token.owner}${token.position}` : `${token.owner} · ${token.position}`}
            </Mono>
          )}
        </g>
      );
    })}
  </>
);
export const RangeArc: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly amount?: number;
  readonly color?: string;
}> = ({from, to, amount = 1, color = theme.primary}) =>
  amount > 0 ? (
    <path
      d={arcPath(from, from + (to - from) * amount, ring.radius - 18)}
      stroke={color}
      strokeWidth={13}
      fill="none"
      strokeLinecap="butt"
    />
  ) : null;
export const RingCursor: React.FC<{readonly position: number; readonly opacity?: number}> = ({
  position,
  opacity = 1,
}) => {
  const p = ringPoint(position);
  return (
    <g opacity={opacity} transform={`translate(${p.x} ${p.y}) rotate(${position * 3.6})`}>
      <path d="M-13 -9 L12 0 L-13 9 Z" fill={theme.primary} stroke={theme.background} strokeWidth={2} />
    </g>
  );
};
export const Hosts: React.FC<{
  readonly active: readonly string[];
  readonly selected?: string;
  readonly extra?: boolean;
  readonly selectedColor?: string;
}> = ({active, selected, extra = false, selectedColor = theme.signal}) => (
  <g>
    {(extra ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D']).map((owner, index) => {
      const x = 522 + index * 170;
      return (
        <g key={owner} opacity={active.includes(owner) ? 1 : 0.25}>
          <path
            d={`M${x - 56} 1280 h112`}
            stroke={selected === owner ? selectedColor : theme.line}
            strokeWidth={3}
          />
          <Mono x={x} y={1318} size={24} color={selected === owner ? selectedColor : theme.muted}>
            сервер {owner}
          </Mono>
        </g>
      );
    })}
  </g>
);
