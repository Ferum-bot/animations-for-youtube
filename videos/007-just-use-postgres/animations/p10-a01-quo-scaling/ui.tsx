import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';

export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export const success = getTheme('signal').success;
export const paper = getTheme('paper').surface;
export const asset = (file: string): string => `assets/007-just-use-postgres/quo/${file}`;

export const Heading: React.FC<{readonly title: string; readonly label?: string}> = ({title, label = 'QUO / TEMPORAL'}) => <>
  <div style={{fontFamily: theme.fontMono, fontSize: 21, color: theme.muted, letterSpacing: 1}}>{label}</div>
  <h1 style={{fontSize: 56, lineHeight: 1.1, letterSpacing: -1.6, margin: '22px 0 0', fontWeight: 600}}>{title}</h1>
</>;
export const Content: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{position: 'absolute', left: 96, top: 64, width: 1408, height: 760}}>{children}</div>;
export const Caption: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{fontSize: 25, color: theme.muted, lineHeight: 1.4}}>{children}</div>;
