import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FeatheredBackground} from '@channel/design-system';
import {getTheme} from '@channel/theme';
import {hashingLayout as layout, hashingTheme as theme} from './theme';

export type PreviewBackground = 'transparent' | 'light' | 'dark';

export const HashingStage: React.FC<{
  readonly opacity: number;
  readonly previewBackground: PreviewBackground;
  readonly children: React.ReactNode;
  readonly label?: string;
}> = ({opacity, previewBackground, children, label = 'Один сервис превращается в кластер под нагрузкой'}) => (
  <AbsoluteFill>
    {previewBackground !== 'transparent' ? (
      <AbsoluteFill style={{background: getTheme(previewBackground === 'light' ? 'paper' : 'graphite').background}} />
    ) : null}
    <AbsoluteFill style={{opacity}}>
      <FeatheredBackground color={theme.background}
        feather={{solidEnd: layout.solidEnd, transparentStart: layout.transparentStart}} />
      <svg width="100%" height="100%" viewBox={`0 0 ${layout.width} ${layout.height}`}
        style={{position: 'absolute', fontFamily: theme.fontSans}}
        aria-label={label}>
        {children}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);
