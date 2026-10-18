import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
import {reveal} from './timing';
import {cache} from './data';

export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export type ShotProps = {readonly timeMs: number; readonly compact: number};
export {CodeSnippet as Code} from '../../shared/CodeSnippet';

export const Label: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 23, letterSpacing: 1, color, marginBottom: 20}}>{children}</div>;
export const Reveal: React.FC<React.PropsWithChildren<{readonly timeMs: number; readonly at?: number; readonly style?: React.CSSProperties}>> = ({timeMs, at = 0, style, children}) => {
  const amount = reveal(timeMs, at);
  return <div style={{...style, opacity: amount, transform: `translateY(${12 * (1 - amount)}px)`}}>{children}</div>;
};
export const Note: React.FC<React.PropsWithChildren<{readonly warning?: boolean}>> = ({children, warning}) =>
  <div style={{fontSize: 29, lineHeight: 1.45, color: warning ? theme.signal : theme.muted, marginTop: 35}}>{children}</div>;

export const CacheEntry: React.FC<{readonly opacity?: number}> = ({opacity = 1}) =>
  <div style={{opacity, borderLeft: `3px solid ${accent}`, paddingLeft: 26}}>
    <Label color={accent}>CACHE / ОДНА ЗАПИСЬ</Label>
    <div style={{fontFamily: theme.fontMono, fontSize: 35, marginBottom: 24}}>{cache.key}</div>
    <div style={{fontFamily: theme.fontMono, fontSize: 29, color: theme.muted, marginBottom: 26}}>{cache.value}</div>
    <div style={{fontSize: 25, lineHeight: 1.45}}>expires_at <span style={{color: accent}}>12:05:00</span></div>
    <div style={{fontSize: 22, color: theme.muted, marginTop: 16}}>Пример: запись в 12:00, срок 5 минут</div>
  </div>;
