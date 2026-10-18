import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
import {reveal} from './timing';

export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export const secondWorker = getTheme('signal').success;
export type ShotProps = {readonly timeMs: number; readonly compact: number};
export {CodeSnippet as Code} from '../../shared/CodeSnippet';

export const Caption: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 23, letterSpacing: 1, color: theme.muted, marginBottom: 18}}>{children}</div>;

export const Appear: React.FC<React.PropsWithChildren<{readonly timeMs: number; readonly at: number; readonly style?: React.CSSProperties}>> = ({children, timeMs, at, style}) =>
  <div style={{...style, opacity: reveal(timeMs, at), transform: `translateY(${10 * (1 - reveal(timeMs, at))}px)`}}>{children}</div>;

export const Explanation: React.FC<React.PropsWithChildren<{readonly warning?: boolean}>> = ({children, warning}) =>
  <div style={{fontSize: 30, lineHeight: 1.45, marginTop: 28, color: warning ? theme.signal : theme.muted}}>{children}</div>;

export const JobRow: React.FC<{readonly id: number; readonly status: string; readonly color?: string}> = ({id, status, color = theme.muted}) =>
  <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${theme.line}`, padding: '24px 16px', fontFamily: theme.fontMono, fontSize: 30}}>
    <span>#{id}</span><span style={{color}}>{status}</span>
  </div>;

export const Columns: React.FC<React.PropsWithChildren<{readonly wide?: boolean}>> = ({children, wide}) =>
  <div style={{display: 'grid', gridTemplateColumns: wide ? '900px 1fr' : '780px 1fr', gap: 44, alignItems: 'start'}}>{children}</div>;
