import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const OpeningStatement: React.FC<{readonly opacity: number; readonly shift: number}> = ({
  opacity,
  shift,
}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 268,
        width: contentWidth,
        opacity,
        transform: `translateY(${shift}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.1}}>
        ВАЖНОЕ УТОЧНЕНИЕ
      </div>
      <div
        style={{
          marginTop: 38,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -5.5,
          lineHeight: 0.92,
        }}
      >
        DNS — НЕ ПРОСТО
        <br />
        <span style={{color: theme.primary}}>ИМЯ → IP</span>
      </div>
      <div
        style={{
          marginTop: 72,
          paddingTop: 28,
          borderTop: `3px solid ${theme.line}`,
          color: theme.muted,
          font: `16px ${theme.fontMono}`,
          letterSpacing: 1.4,
        }}
      >
        IP-АДРЕС — САМАЯ ИЗВЕСТНАЯ ЗАПИСЬ, НО НЕ ЕДИНСТВЕННАЯ
      </div>
    </div>
  );
};
