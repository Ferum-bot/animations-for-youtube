import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {httpLayout, httpTheme as theme} from './theme';

export type PreviewBackground = 'transparent' | 'presenter' | 'light' | 'dark';

const Preview: React.FC<{background: PreviewBackground}> = ({background}) => {
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
}> = ({children, opacity, surface, previewBackground = 'transparent'}) => {
  const {backgroundSolidEnd: solid, backgroundTransparentStart: end} = httpLayout;
  const featherPosition = (progress: number) => `${(solid + (end - solid) * progress) / httpLayout.width * 100}%`;
  const feather = `linear-gradient(90deg, black 0%, black ${featherPosition(0)},
    rgba(0,0,0,.94) ${featherPosition(0.18)}, rgba(0,0,0,.65) ${featherPosition(0.4)},
    rgba(0,0,0,.25) ${featherPosition(0.68)}, rgba(0,0,0,.06) ${featherPosition(0.9)},
    transparent ${featherPosition(1)}, transparent 100%)`;
  return (
    <AbsoluteFill>
      <Preview background={previewBackground} />
      <AbsoluteFill style={{opacity}}>
        <AbsoluteFill style={{background: theme.background,
          maskImage: surface === 'presenter-side' ? feather : undefined,
          WebkitMaskImage: surface === 'presenter-side' ? feather : undefined}} />
        <svg width="100%" height="100%" viewBox="0 0 2560 1440"
          style={{position: 'absolute', color: theme.text, fontFamily: theme.fontSans}}>
          {children}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
