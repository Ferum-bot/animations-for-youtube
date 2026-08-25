import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const OpeningStatement: React.FC<{opacity: number; shift: number}> = ({opacity, shift}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 280,
        width: contentWidth,
        opacity,
        transform: `translateY(${shift}px)`,
      }}
    >
      <div
        style={{
          color: theme.signal,
          fontFamily: theme.fontSans,
          fontSize: 138,
          fontWeight: 800,
          letterSpacing: -9,
          lineHeight: 0.8,
        }}
      >
        02
      </div>
      <div
        style={{
          marginTop: 54,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: -4.8,
          lineHeight: 0.92,
        }}
      >
        ДВЕ ИДЕИ
        <br />
        <span style={{color: theme.primary}}>ОДИН ОТВЕТ</span>
      </div>
      <div style={{marginTop: 64, color: theme.muted, font: `16px ${theme.fontMono}`, letterSpacing: 1.4}}>
        КАК УПРАВЛЯТЬ ИМЕНАМИ В МАСШТАБЕ МИРА
      </div>
    </div>
  );
};
