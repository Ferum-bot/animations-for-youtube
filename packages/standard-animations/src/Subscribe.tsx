import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MotionStage, useChannelTheme} from '@channel/design-system';
import {clamp, smoothProgress, springProgress} from '@channel/motion-core';
import type {ThemeId} from '@channel/design-system';

export type SubscribePlacement = 'bottom-left' | 'bottom-right';

export type SubscribeProps = {
  channelName: string;
  placement: SubscribePlacement;
  themeId: ThemeId;
  transparent: boolean;
};

export const subscribeDefaultProps: SubscribeProps = {
  channelName: 'Матвей Попов',
  placement: 'bottom-right',
  themeId: 'graphite',
  transparent: true,
};

export const Subscribe: React.FC<SubscribeProps> = ({
  channelName,
  placement,
  themeId,
  transparent,
}) => (
  <MotionStage themeId={themeId} transparent={transparent}>
    <SubscribeCard channelName={channelName} placement={placement} />
  </MotionStage>
);

const PlayMark: React.FC = () => {
  const theme = useChannelTheme();

  return (
    <div
      style={{
        width: 66,
        height: 66,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        background: theme.signal,
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          marginLeft: 5,
          borderTop: '12px solid transparent',
          borderBottom: '12px solid transparent',
          borderLeft: `19px solid ${theme.text}`,
        }}
      />
    </div>
  );
};

const SubscribeCard: React.FC<{
  channelName: string;
  placement: SubscribePlacement;
}> = ({channelName, placement}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const theme = useChannelTheme();
  const enter = springProgress(frame, 5, fps);
  const clickFrame = Math.round(durationInFrames * 0.42);
  const subscribedFrame = clickFrame + 4;
  const subscribed = frame >= subscribedFrame;
  const press = interpolate(
    frame,
    [clickFrame - 4, clickFrame, clickFrame + 6],
    [1, 0.94, 1],
    clamp,
  );
  const confirmation = smoothProgress(frame, subscribedFrame, subscribedFrame + 12);
  const clickPulse = interpolate(
    frame,
    [clickFrame - 2, clickFrame + 4, clickFrame + 16],
    [0, 1, 0],
    clamp,
  );
  const horizontalOffset = (1 - enter) * (placement === 'bottom-right' ? 54 : -54);

  return (
    <div
      style={{
        position: 'absolute',
        ...(placement === 'bottom-right' ? {right: 90} : {left: 90}),
        bottom: 78,
        width: 680,
        height: 154,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '22px 24px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: `${theme.background}F2`,
        borderTop: `2px solid ${theme.line}`,
        borderBottom: `2px solid ${theme.line}`,
        borderLeft: `7px solid ${subscribed ? theme.success : theme.signal}`,
        opacity: enter,
        transform: `translateX(${horizontalOffset}px) scale(${press})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: `${Math.max(enter, confirmation) * 100}%`,
          height: 3,
          background: subscribed ? theme.success : theme.signal,
        }}
      />

      <PlayMark />

      <div style={{width: 215, minWidth: 0}}>
        <div style={{color: theme.muted, font: `700 13px ${theme.fontMono}`, letterSpacing: 1.8}}>
          YOUTUBE / КАНАЛ
        </div>
        <div
          style={{
            marginTop: 10,
            color: theme.text,
            overflow: 'hidden',
            fontFamily: theme.fontSans,
            fontSize: 27,
            fontWeight: 800,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {channelName}
        </div>
        <div style={{marginTop: 8, color: theme.muted, font: `12px ${theme.fontMono}`}}>
          SYSTEM DESIGN
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: 270,
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          background: subscribed ? theme.success : theme.signal,
          color: theme.text,
          font: `800 16px ${theme.fontSans}`,
          letterSpacing: 0.4,
        }}
      >
        <span style={{opacity: subscribed ? confirmation : 1}}>
          {subscribed ? '✓  ВЫ ПОДПИСАНЫ' : 'ПОДПИСАТЬСЯ'}
        </span>
        <div
          style={{
            position: 'absolute',
            width: 86 + clickPulse * 54,
            height: 86 + clickPulse * 54,
            border: `2px solid ${theme.text}`,
            opacity: clickPulse * 0.7,
          }}
        />
      </div>
    </div>
  );
};
