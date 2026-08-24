import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MotionStage, useChannelTheme} from '@channel/design-system';
import {clamp, springProgress} from '@channel/motion-core';
import type {ThemeId} from '@channel/design-system';

export type SubscribeProps = {
  channelName: string;
  themeId: ThemeId;
  transparent: boolean;
};

export const subscribeDefaultProps: SubscribeProps = {
  channelName: 'CS без магии',
  themeId: 'graphite',
  transparent: true,
};

export const Subscribe: React.FC<SubscribeProps> = ({channelName, themeId, transparent}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <SubscribeCard channelName={channelName} />
  </MotionStage>
);

const SubscribeCard: React.FC<{channelName: string}> = ({channelName}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = useChannelTheme();
  const enter = springProgress(frame, 6, fps);
  const press = interpolate(frame, [54, 60, 66], [1, 0.94, 1], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        right: 90,
        bottom: 86,
        width: 490,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px 24px',
        boxSizing: 'border-box',
        background: theme.surface,
        borderLeft: `6px solid ${theme.signal}`,
        transform: `translateY(${(1 - enter) * 32}px) scale(${press})`,
      }}
    >
      <div>
        <div style={{fontSize: 16, color: theme.muted, fontFamily: theme.fontMono}}>КАНАЛ</div>
        <div style={{marginTop: 7, fontSize: 27, fontWeight: 700}}>{channelName}</div>
      </div>
      <div
        style={{
          padding: '15px 20px',
          background: frame >= 60 ? theme.success : theme.signal,
          color: '#fff',
          font: `700 17px ${theme.fontSans}`,
        }}
      >
        {frame >= 60 ? 'ВЫ ПОДПИСАНЫ' : 'ПОДПИСАТЬСЯ'}
      </div>
    </div>
  );
};

