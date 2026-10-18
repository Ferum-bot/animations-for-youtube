import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {getTheme} from '@channel/theme';

export type IntroBackground = 'transparent' | 'light' | 'dark' | 'footage';

/** Preview-only layer. The CapCut export explicitly selects transparent. */
export const PreviewBackground: React.FC<{readonly mode: IntroBackground}> = ({mode}) => {
  if (mode === 'transparent') return null;
  if (mode === 'footage') return <Img
    src={staticFile('assets/007-just-use-postgres/intro/presenter-reference.jpg')}
    style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  return <AbsoluteFill style={{backgroundColor: getTheme(mode === 'dark' ? 'graphite' : 'paper').background}} />;
};
