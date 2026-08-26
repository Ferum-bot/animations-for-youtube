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
        top: 244,
        width: contentWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 26}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.1}}>
        МЕНТАЛЬНАЯ МОДЕЛЬ
      </div>
      <div
        style={{
          marginTop: 34,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -4.9,
          lineHeight: 0.94,
        }}
      >
        ИМЯ — <span style={{color: theme.primary}}>КЛЮЧ</span>
        <br />
        ОТВЕТ — <span style={{color: theme.success}}>НАБОР</span>
        <br />
        <span style={{color: theme.success}}>ЗАПИСЕЙ</span>
      </div>
      <div
        style={{
          marginTop: 60,
          paddingTop: 30,
          borderTop: `3px solid ${theme.line}`,
          color: theme.muted,
          font: `700 18px ${theme.fontMono}`,
          letterSpacing: 1.2,
          lineHeight: 1.55,
        }}
      >
        DISTRIBUTED KEY–VALUE STORE
        <br />
        <span style={{color: theme.text}}>С ТИПИЗИРОВАННЫМИ RESOURCE RECORDS</span>
      </div>
    </div>
  );
};
