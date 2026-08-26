import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {tldTokens} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const TldField: React.FC<{
  readonly categoryReveal: number;
  readonly count: number;
  readonly reveal: number;
}> = ({categoryReveal, count, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 206,
        width: contentWidth,
        height: 690,
        opacity: reveal,
      }}
    >
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
        <div>
          <div style={{color: theme.signal, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.8}}>
            TOP-LEVEL DOMAINS
          </div>
          <div
            style={{
              marginTop: 24,
              color: theme.text,
              fontFamily: theme.fontSans,
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: -3.2,
              lineHeight: 0.95,
            }}
          >
            ВЕРХНИЙ УРОВЕНЬ
            <br />
            <span style={{color: theme.primary}}>НЕ ОДИН</span>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{color: theme.signal, font: `800 118px ${theme.fontSans}`, letterSpacing: -8, lineHeight: 0.78}}>
            {count}+
          </div>
          <div style={{marginTop: 22, color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.3}}>
            TLD / И БОЛЬШЕ
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 278, width: contentWidth, height: 260}}>
        {tldTokens.map((token, index) => {
          const tokenReveal = clamp01(reveal * 1.65 - index * 0.08);
          const isGeneric = token.group === 'generic';

          return (
            <div
              key={token.label}
              style={{
                position: 'absolute',
                left: token.x,
                top: token.y,
                width: 194,
                height: 78,
                boxSizing: 'border-box',
                padding: '25px 20px 0',
                borderTop: `4px solid ${isGeneric ? theme.primary : theme.signal}`,
                background: `${theme.surface}F0`,
                color: theme.text,
                font: `700 24px ${theme.fontMono}`,
                opacity: tokenReveal,
                transform: `translateY(${(1 - tokenReveal) * 18 + (isGeneric ? -categoryReveal * 8 : categoryReveal * 8)}px)`,
              }}
            >
              {token.label}
              <span
                style={{
                  float: 'right',
                  color: isGeneric ? theme.primary : theme.signal,
                  font: `700 10px ${theme.fontMono}`,
                  letterSpacing: 0.8,
                  opacity: categoryReveal,
                }}
              >
                {isGeneric ? 'gTLD' : 'ccTLD'}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 588,
          width: contentWidth,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          opacity: categoryReveal,
        }}
      >
        <div style={{borderTop: `3px solid ${theme.primary}`, paddingTop: 18}}>
          <div style={{color: theme.primary, font: `700 15px ${theme.fontMono}`}}>РОДОВЫЕ</div>
          <div style={{marginTop: 10, color: theme.muted, font: `12px ${theme.fontMono}`}}>
            .COM / .EDU / .ORG
          </div>
        </div>
        <div style={{borderTop: `3px solid ${theme.signal}`, paddingTop: 18}}>
          <div style={{color: theme.signal, font: `700 15px ${theme.fontMono}`}}>НАЦИОНАЛЬНЫЕ</div>
          <div style={{marginTop: 10, color: theme.muted, font: `12px ${theme.fontMono}`}}>
            ПО КОДУ СТРАНЫ
          </div>
        </div>
      </div>
    </div>
  );
};
