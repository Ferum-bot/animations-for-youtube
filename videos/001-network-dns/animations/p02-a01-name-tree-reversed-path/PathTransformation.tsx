import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {clamp01} from '@channel/motion-core';
import {dnsPresenterOverlayLayout} from '../../shared/presenterOverlayLayout';
import {pathTokens} from './content';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

const mix = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

export const PathTransformation: React.FC<{
  readonly dnsReveal: number;
  readonly filesystemReveal: number;
  readonly reverseProgress: number;
  readonly reveal: number;
}> = ({dnsReveal, filesystemReveal, reverseProgress, reveal}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        top: 218,
        width: contentWidth,
        height: 590,
        opacity: reveal,
        perspective: 900,
      }}
    >
      <div style={{color: theme.primary, font: `700 14px ${theme.fontMono}`, letterSpacing: 1.8}}>
        ИМЯ — ЭТО ПУТЬ
      </div>
      <div
        style={{
          marginTop: 34,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 66,
          fontWeight: 800,
          letterSpacing: -3.6,
          lineHeight: 0.96,
        }}
      >
        ОТ ЛИСТА
        <br />
        <span style={{color: theme.primary}}>К КОРНЮ</span>
      </div>

      <div style={{position: 'absolute', left: 0, top: 240, width: contentWidth, height: 190}}>
        <div
          style={{
            color: theme.muted,
            font: `12px ${theme.fontMono}`,
            letterSpacing: 1.35,
            opacity: filesystemReveal * (1 - dnsReveal),
          }}
        >
          FILESYSTEM / ROOT → LEAF
        </div>
        <div style={{position: 'absolute', left: 0, top: 55, width: contentWidth, height: 2, background: theme.line}} />
        {pathTokens.map((token, index) => {
          const tokenReveal = clamp01(filesystemReveal * 1.7 - index * 0.22);
          const x = mix(token.fromX, token.toX, reverseProgress);
          const lift = Math.sin(reverseProgress * Math.PI) * (48 + index * 12);
          const tokenColor = index === 2 ? theme.signal : theme.text;

          return (
            <React.Fragment key={token.id}>
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: 28 - lift,
                  width: token.id === 'cisco' ? 184 : 150,
                  height: 74,
                  boxSizing: 'border-box',
                  padding: '24px 20px 0',
                  borderTop: `4px solid ${reverseProgress > 0.72 ? theme.primary : theme.line}`,
                  color: tokenColor,
                  font: `700 22px ${theme.fontMono}`,
                  opacity: tokenReveal,
                  transform: `rotateX(${Math.sin(reverseProgress * Math.PI) * -14}deg)`,
                  background: `${theme.surface}E6`,
                }}
              >
                {token.label}
              </div>
              {index < 2 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: token.fromX + (token.id === 'cisco' ? 210 : 176),
                    top: 49,
                    color: theme.signal,
                    font: `700 24px ${theme.fontMono}`,
                    opacity: tokenReveal * (1 - reverseProgress),
                  }}
                >
                  /
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 475,
          width: contentWidth,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: dnsReveal,
          transform: `translateY(${(1 - dnsReveal) * 20}px)`,
        }}
      >
        <span style={{color: theme.muted, font: `12px ${theme.fontMono}`, letterSpacing: 1.3}}>
          DNS / LEAF → ROOT
        </span>
        <div style={{height: 2, flex: 1, background: theme.primary}} />
        <span style={{color: theme.text, font: `700 29px ${theme.fontMono}`, letterSpacing: -1.2}}>
          eng.cisco.com
        </span>
      </div>
    </div>
  );
};
