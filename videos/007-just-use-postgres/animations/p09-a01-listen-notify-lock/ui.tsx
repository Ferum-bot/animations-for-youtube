import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
export {CodeSnippet} from '../../shared/CodeSnippet';
export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
// Grafana panel/series colors are local to this episode's measured experiments.
export const graph = {
  panel: '#181B1F', line: '#34383F', grid: '#34383F', text: '#CCCCDC',
  muted: '#9DA0AA', plain: '#73BF69', notify: '#FF9830', blue: '#5794F2',
} as const;
export const Label: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontSize: 21, fontFamily: theme.fontMono, letterSpacing: .7, color}}>{children}</div>;
export const Title: React.FC<{readonly children: React.ReactNode; readonly kicker?: string}> = ({children, kicker = 'ПРОБЛЕМА / LISTEN + NOTIFY'}) => <>
  <Label>{kicker}</Label>
  <h1 style={{fontSize: 55, fontWeight: 600, lineHeight: 1.12, letterSpacing: -1.4, margin: '24px 0 34px'}}>{children}</h1>
</>;
export const Note: React.FC<React.PropsWithChildren<{readonly color?: string}>> = ({children, color = theme.muted}) =>
  <div style={{fontSize: 26, lineHeight: 1.4, color}}>{children}</div>;
export const Rule: React.FC = () => <div style={{borderTop: `2px solid ${theme.line}`, margin: '28px 0'}} />;
