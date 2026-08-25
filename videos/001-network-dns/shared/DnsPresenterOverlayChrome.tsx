import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from './presenterOverlayLayout';

const {panelWidth, contentLeft, contentWidth} = dnsPresenterOverlayLayout;

type Props = {
  readonly label: string;
  readonly meta: string;
  readonly progress: number;
};

export const DnsPresenterOverlayChrome: React.FC<Props> = ({label, meta, progress}) => {
  const theme = useChannelTheme();

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: panelWidth,
          background: `${theme.background}F2`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 76,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div style={{color: theme.signal, font: `700 18px ${theme.fontMono}`, letterSpacing: 2.7}}>
          {label}
        </div>
        <div style={{width: 52, height: 2, background: theme.line}} />
        <div style={{color: theme.muted, font: `14px ${theme.fontMono}`, letterSpacing: 1.5}}>
          {meta}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: 134,
          width: contentWidth,
          height: 2,
          background: theme.line,
        }}
      >
        <div style={{width: `${progress * 100}%`, height: '100%', background: theme.signal}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          bottom: 74,
          width: contentWidth,
          height: 2,
          background: theme.line,
        }}
      />
    </>
  );
};
