import React from 'react';
import {useChannelTheme} from '@channel/design-system';

export const VideoBadge: React.FC<{children: React.ReactNode}> = ({children}) => {
  const theme = useChannelTheme();
  return (
    <div
      style={{
        position: 'absolute',
        left: 74,
        top: 62,
        color: theme.signal,
        font: `500 18px ${theme.fontMono}`,
        letterSpacing: 1.4,
      }}
    >
      {children}
    </div>
  );
};

