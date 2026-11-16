import React, {type ReactNode} from 'react';
import {progress, easing} from '@channel/motion-v2';
import {ink} from '../intro-shorts/palette';

export {ink};
export const motion = (time: number, at: number, duration = 0.65) =>
  progress(time, at, at + duration, easing.transform);
export type SceneProps = {readonly number: number; readonly t: number};

export function Heading({children}: {readonly children: ReactNode}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 250,
        width: 828,
        fontSize: 64,
        fontWeight: 760,
        lineHeight: 1.12,
        letterSpacing: -1.8,
      }}
    >
      {children}
    </div>
  );
}
export function Area({
  children,
  top = 520,
}: {
  readonly children: ReactNode;
  readonly top?: number;
}) {
  return (
    <div style={{position: 'absolute', left: 72, top, width: 828}}>
      {children}
    </div>
  );
}
export function Note({
  children,
  top = 1480,
}: {
  readonly children: ReactNode;
  readonly top?: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        top,
        width: 828,
        fontSize: 33,
        lineHeight: 1.35,
        color: ink.muted,
      }}
    >
      {children}
    </div>
  );
}
export function Code({
  text,
  active,
  label = 'SQL',
  size = 34,
}: {
  readonly text: string;
  readonly active?: string;
  readonly label?: string;
  readonly size?: number;
}) {
  return (
    <div
      style={{
        background: ink.background,
        border: `2px solid ${ink.line}`,
        padding: '46px 26px 28px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 22,
          fontSize: 23,
          color: ink.muted,
          fontFamily: ink.fontMono,
        }}
      >
        {label}
      </div>
      <pre
        style={{
          margin: 0,
          fontFamily: ink.fontMono,
          fontSize: size,
          lineHeight: 1.46,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          letterSpacing: -0.6,
        }}
      >
        {text.split('\n').map((line, i) => (
          <div
            key={i}
            style={{
              color: active && line.includes(active) ? ink.signal : ink.text,
            }}
          >
            {line || ' '}
          </div>
        ))}
      </pre>
    </div>
  );
}
export function Table({
  headers,
  rows,
  highlight = -1,
  muted = [],
}: {
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly highlight?: number;
  readonly muted?: readonly number[];
}) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        fontSize: 35,
        lineHeight: 1.32,
      }}
    >
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              style={{
                textAlign: 'left',
                fontWeight: 500,
                color: ink.muted,
                padding: '16px 12px',
                fontSize: 29,
                borderBottom: `2px solid ${ink.line}`,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{
              background: i === highlight ? ink.line : 'transparent',
              opacity: muted.includes(i) ? 0.3 : 1,
            }}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: '24px 12px',
                  borderBottom: `2px solid ${ink.line}`,
                  overflowWrap: 'anywhere',
                  whiteSpace: 'pre-line',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function Record({
  children,
  accent = false,
  opacity = 1,
}: {
  readonly children: ReactNode;
  readonly accent?: boolean;
  readonly opacity?: number;
}) {
  return (
    <div
      style={{
        border: `2px solid ${accent ? ink.signal : ink.line}`,
        borderLeftWidth: accent ? 8 : 2,
        padding: '24px 26px',
        fontSize: 40,
        lineHeight: 1.25,
        opacity,
        background: ink.background,
      }}
    >
      {children}
    </div>
  );
}
export function Caption({children}: {readonly children: ReactNode}) {
  return (
    <div style={{fontSize: 32, color: ink.muted, margin: '0 0 18px'}}>
      {children}
    </div>
  );
}
export function Down({
  amount = 1,
  label,
}: {
  readonly amount?: number;
  readonly label?: string;
}) {
  return (
    <div style={{height: 125, position: 'relative', opacity: amount}}>
      <svg width="828" height="125" viewBox="0 0 828 125">
        <path
          d="M414 10 V105 M401 91 L414 107 L427 91"
          fill="none"
          stroke={ink.signal}
          strokeWidth="4"
          strokeDasharray="140"
          strokeDashoffset={140 * (1 - amount)}
        />
      </svg>
      {label && (
        <div
          style={{
            position: 'absolute',
            top: 41,
            left: 450,
            fontSize: 29,
            color: ink.muted,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
