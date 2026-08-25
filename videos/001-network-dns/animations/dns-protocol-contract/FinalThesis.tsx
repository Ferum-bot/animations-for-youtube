import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const FinalThesis: React.FC<{readonly reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 248,
        width: contentWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 26}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.1}}>
        ПРАВИЛО DNS
      </div>
      <div
        style={{
          marginTop: 36,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 76,
          fontWeight: 800,
          letterSpacing: -4.6,
          lineHeight: 0.94,
        }}
      >
        КЛИЕНТ
        <br />
        <span style={{color: theme.primary}}>СПРАШИВАЕТ</span>
        <br />
        СЕРВЕР
        <br />
        <span style={{color: theme.success}}>ОТВЕЧАЕТ</span>
      </div>
      <div
        style={{
          marginTop: 54,
          paddingTop: 30,
          borderTop: `3px solid ${theme.line}`,
          color: theme.muted,
          font: `700 17px ${theme.fontMono}`,
          letterSpacing: 1.1,
          lineHeight: 1.6,
        }}
      >
        RESPONSE = RESOURCE RECORDS
        <br />
        <span style={{color: theme.signal}}>КАЖДАЯ ЗАПИСЬ ДЕЙСТВУЕТ ДО TTL=0</span>
      </div>
    </div>
  );
};
