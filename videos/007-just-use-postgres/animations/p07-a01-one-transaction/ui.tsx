import React from 'react';
import {getTheme} from '@channel/theme';
import {getPostgresTheme} from '../../shared/theme';
export {CodeSnippet} from '../../shared/CodeSnippet';
export const theme = getPostgresTheme('graphite');
export const accent = getTheme('signal').primary;
export const Caption: React.FC<React.PropsWithChildren> = ({children}) =>
  <div style={{fontFamily: theme.fontMono, fontSize: 22, color: theme.muted, letterSpacing: 1, marginBottom: 16}}>{children}</div>;
