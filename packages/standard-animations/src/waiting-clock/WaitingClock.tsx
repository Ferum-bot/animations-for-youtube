import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ChannelThemeProvider} from '@channel/design-system';
import {ClockFace} from './ClockFace';
import {validateClockProps} from './config';
import {getClockMotion} from './motion';
import type {WaitingClockProps} from './types';

export const WaitingClock: React.FC<WaitingClockProps> = (props) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();
  validateClockProps(props);
  const scale = Math.min(width / 2560, height / 1440);
  const {angleDegrees, opacity, translateY} = getClockMotion({
    frame,
    fps,
    durationInFrames,
    motionProfile: props.motionProfile,
    mode: props.playback.mode,
  });
  // Keep the entire entrance/exit inside the safe area at either placement.
  const offsetY = props.placement === 'top-left' ? -translateY : translateY;

  return (
    <ChannelThemeProvider themeId={props.themeId}>
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            left: 100 * scale,
            ...(props.placement === 'top-left' ? {top: 100 * scale} : {bottom: 100 * scale}),
            width: props.sizePx * scale,
            height: props.sizePx * scale,
            opacity,
            transform: `translateY(${offsetY * scale}px)`,
          }}
        >
          <ClockFace angleDegrees={angleDegrees} />
        </div>
      </AbsoluteFill>
    </ChannelThemeProvider>
  );
};
