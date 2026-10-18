import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
import {progress} from './scene';

export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;

export const Reveal: React.FC<React.PropsWithChildren<{
  readonly timeMs: number; readonly at?: number; readonly style?: React.CSSProperties;
}>> = ({timeMs, at = 0, style, children}) => {
  const amount = progress(timeMs, at, 450);
  return <div style={{...style, opacity: amount, transform: `translateY(${(1 - amount) * 16}px)`}}>{children}</div>;
};

export const Code: React.FC<{
  readonly text: string; readonly size?: number; readonly highlight?: string;
}> = ({text, size = 36, highlight}) => <pre style={{
  fontFamily: theme.fontMono, fontSize: size, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap',
  color: theme.text, letterSpacing: -0.8,
}}>{text.split('\n').map((line, index) => <div key={index} style={{
  color: highlight && line.includes(highlight) ? accent : undefined,
}}>{line || ' '}</div>)}</pre>;

export const Label: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 25, letterSpacing: 1.2, color, marginBottom: 24}}>{children}</div>;

export const Rule = () => <div style={{height: 2, background: theme.line, margin: '30px 0'}} />;

export const Note: React.FC<React.PropsWithChildren<{readonly warning?: boolean}>> = ({children, warning}) =>
  <div style={{marginTop: 60, fontSize: 32,
    color: warning ? theme.signal : theme.muted}}>{children}</div>;
