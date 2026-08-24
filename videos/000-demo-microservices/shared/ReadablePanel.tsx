import React from 'react';
import {useChannelTheme} from '@channel/design-system';

type ReadablePanelProps = {
  children: React.ReactNode;
  left: number;
  top: number;
  width?: number | string;
  padding?: string;
};

export const ReadablePanel: React.FC<ReadablePanelProps> = ({
  children,
  left,
  top,
  width = 'max-content',
  padding = '28px 32px',
}) => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        boxSizing: 'border-box',
        padding,
        background: theme.surface,
        borderLeft: `6px solid ${theme.signal}`,
      }}
    >
      {children}
    </div>
  );
};

