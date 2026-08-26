import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from './presenterOverlayLayout';

type Accent = 'primary' | 'signal' | 'success';

type Props = {
  readonly accent?: Accent;
  readonly eyebrow: string;
  readonly reveal?: number;
  readonly title: string;
};

export const DnsSceneHeading: React.FC<Props> = ({
  accent = 'signal',
  eyebrow,
  reveal = 1,
  title,
}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: dnsPresenterOverlayLayout.contentLeft,
        top: 184,
        width: dnsPresenterOverlayLayout.titleWidth,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 14}px)`,
      }}
    >
      <div
        style={{
          color: theme[accent],
          font: `700 13px ${theme.fontMono}`,
          letterSpacing: 1.8,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 18,
          color: theme.text,
          fontFamily: theme.fontSans,
          fontSize: 43,
          fontWeight: 800,
          letterSpacing: -2.1,
          lineHeight: 0.98,
        }}
      >
        {title}
      </div>
    </div>
  );
};
