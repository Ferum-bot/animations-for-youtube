import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
export {CodeSnippet} from '../../shared/CodeSnippet';
export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
// Episode-local chart tokens follow Grafana's dark panel and classic series palette.
export const chart = {
  surface: '#181B1F', border: '#34383F', grid: '#34383F', text: '#CCCCDC',
  muted: '#9DA0AA', healthy: '#73BF69', blocked: '#FF9830', blue: '#5794F2',
} as const;
export const Caption: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 20, color: theme.muted, letterSpacing: 1.3}}>{children}</div>;
export const Heading: React.FC<{readonly title: string; readonly kicker?: string}> = ({title, kicker = 'ПРОБЛЕМА / MVCC И VACUUM'}) => <>
  <Caption>{kicker}</Caption>
  <h1 style={{fontSize: 54, lineHeight: 1.12, fontWeight: 600, letterSpacing: -1.6, margin: '24px 0 36px'}}>{title}</h1>
</>;
export const Rule: React.FC<{readonly width?: number}> = ({width}) => <div style={{width, borderTop: `2px solid ${theme.line}`, margin: '24px 0'}} />;
export const Note: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontSize: 25, lineHeight: 1.4, color}}>{children}</div>;
