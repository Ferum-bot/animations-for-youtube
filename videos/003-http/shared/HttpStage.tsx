import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FeatheredBackground} from '@channel/design-system';
import {httpLayout, httpTheme as theme} from './theme';

export type PreviewBackground = 'transparent' | 'presenter' | 'light' | 'dark';

export const HttpPreviewBackground: React.FC<{background: PreviewBackground}> = ({background}) => {
  if (background === 'transparent') return null;
  if (background === 'presenter') {
    // Supplied screenshot: the actual 16:9 footage is x=10, y=35, w=1260, h=707.
    // Clip the UI in the preview only; the original reference file stays intact.
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile('generated/003-http/presenter-reference.png')}
          style={{position: 'absolute', width: '103.174603%', maxWidth: 'none',
            left: '-0.793651%', top: '-4.950495%'}} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{background: background === 'light' ? '#EEECE7' : '#101318'}} />;
};

export const HttpStage: React.FC<{
  children: React.ReactNode;
  opacity: number;
  surface: 'presenter-side' | 'fullscreen';
  previewBackground?: PreviewBackground;
  sceneLayer?: React.ReactNode;
}> = ({children, opacity, surface, previewBackground = 'transparent', sceneLayer}) => {
  return (
    <AbsoluteFill>
      <HttpPreviewBackground background={previewBackground} />
      <AbsoluteFill style={{opacity}}>
        <FeatheredBackground color={theme.background} feather={surface === 'presenter-side' ? {
          solidEnd: httpLayout.backgroundSolidEnd,
          transparentStart: httpLayout.backgroundTransparentStart,
        } : undefined} />
        {sceneLayer}
        <svg width="100%" height="100%" viewBox="0 0 2560 1440"
          style={{position: 'absolute', color: theme.text, fontFamily: theme.fontSans}}>
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
