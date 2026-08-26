import React from 'react';
import {useChannelTheme} from '@channel/design-system';
import {dnsPresenterOverlayLayout} from './presenterOverlayLayout';

const {contentLeft, contentWidth} = dnsPresenterOverlayLayout;

type Accent = 'primary' | 'signal' | 'success';

type Props = {
  readonly accent?: Accent;
  readonly left: string;
  readonly right: string;
  readonly reveal?: number;
};

export const DnsSceneStatus: React.FC<Props> = ({
  accent = 'primary',
  left,
  right,
  reveal = 1,
}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left: contentLeft,
        bottom: 42,
        width: contentWidth,
        display: 'flex',
        justifyContent: 'space-between',
        color: theme.muted,
        font: `700 12px ${theme.fontMono}`,
        letterSpacing: 1.25,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
      }}
    >
      <span style={{color: theme[accent]}}>{left}</span>
      <span>{right}</span>
    </div>
  );
};
