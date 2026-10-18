import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
import {reveal} from './timing';

export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export type ShotProps = {readonly timeMs: number; readonly compact: number};

export const Appear: React.FC<React.PropsWithChildren<{
  readonly timeMs: number; readonly at?: number; readonly style?: React.CSSProperties;
}>> = ({timeMs, at = 0, style, children}) => {
  const amount = reveal(timeMs, at);
  return <div style={{...style, opacity: amount, transform: `translateY(${12 * (1 - amount)}px)`}}>{children}</div>;
};

export const Caption: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 23, letterSpacing: 1.1, color, marginBottom: 24}}>{children}</div>;

export {CodeSnippet as Sql, CodeLines as SqlLines} from '../../shared/CodeSnippet';

export const Underline: React.FC<React.PropsWithChildren<{readonly warning?: boolean}>> = ({children, warning}) =>
  <span style={{color: warning ? theme.signal : accent, borderBottom: `2px solid ${warning ? theme.signal : accent}`, paddingBottom: 4}}>{children}</span>;
