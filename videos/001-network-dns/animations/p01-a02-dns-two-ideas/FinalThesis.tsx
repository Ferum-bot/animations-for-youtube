import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const FinalThesis: React.FC<{reveal: number}> = ({reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 270,
        width: contentWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 26}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.1}}>
        ОДИН АРХИТЕКТУРНЫЙ ОТВЕТ
      </div>
      <div
        style={{
          marginTop: 34,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: -4.8,
          lineHeight: 0.92,
        }}
      >
        ГЛОБАЛЬНО
        <br />
        <span style={{color: theme.primary}}>БЕЗ ЕДИНОГО</span>
        <br />
        <span style={{color: theme.primary}}>ЦЕНТРА</span>
      </div>
      <div
        style={{
          marginTop: 58,
          paddingTop: 30,
          borderTop: `3px solid ${theme.line}`,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div>
          <div style={{color: theme.primary, font: `700 16px ${theme.fontMono}`, letterSpacing: 1.5}}>
            ИЕРАРХИЯ
          </div>
          <div style={{marginTop: 8, color: theme.muted, font: `13px ${theme.fontMono}`}}>
            КТО ОТВЕЧАЕТ
          </div>
        </div>
        <div style={{color: theme.signal, font: `700 28px ${theme.fontMono}`}}>+</div>
        <div>
          <div style={{color: theme.success, font: `700 16px ${theme.fontMono}`, letterSpacing: 1.5}}>
            РАСПРЕДЕЛЕНИЕ
          </div>
          <div style={{marginTop: 8, color: theme.muted, font: `13px ${theme.fontMono}`}}>
            ГДЕ ЛЕЖАТ ДАННЫЕ
          </div>
        </div>
      </div>
    </div>
  );
};
