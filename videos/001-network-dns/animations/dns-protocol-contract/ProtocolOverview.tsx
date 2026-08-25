import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {contractClauses} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

export const ProtocolOverview: React.FC<{
  readonly opacity: number;
  readonly shift: number;
}> = ({opacity, shift}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 238,
        width: contentWidth,
        opacity,
        transform: `translateY(${shift}px)`,
      }}
    >
      <div style={{color: theme.signal, font: `700 16px ${theme.fontMono}`, letterSpacing: 2.1}}>
        ПРОТОКОЛ / МИНИМАЛЬНЫЙ КОНТРАКТ
      </div>
      <div style={{marginTop: 48, display: 'grid', gridTemplateColumns: '250px 1fr', gap: 60}}>
        <div>
          <div
            style={{
              color: theme.signal,
              fontFamily: theme.fontSans,
              fontSize: 176,
              fontWeight: 800,
              letterSpacing: -12,
              lineHeight: 0.78,
            }}
          >
            04
          </div>
          <div
            style={{
              marginTop: 36,
              color: theme.text,
              fontFamily: theme.fontSans,
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: -1.8,
              lineHeight: 0.98,
            }}
          >
            ЧЕТЫРЕ
            <br />
            ПУНКТА
          </div>
        </div>
        <div style={{borderTop: `3px solid ${theme.line}`}}>
          {contractClauses.map((clause, index) => (
            <div
              key={clause.number}
              style={{
                height: 104,
                boxSizing: 'border-box',
                display: 'grid',
                gridTemplateColumns: '54px 1fr',
                alignItems: 'center',
                borderBottom: `2px solid ${theme.line}`,
              }}
            >
              <span style={{color: index === 0 ? theme.primary : theme.muted, font: `700 15px ${theme.fontMono}`}}>
                {clause.number}
              </span>
              <div>
                <div style={{color: theme.text, font: `700 16px ${theme.fontMono}`, letterSpacing: 1.2}}>
                  {clause.label}
                </div>
                <div style={{marginTop: 8, color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 0.8}}>
                  {clause.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
