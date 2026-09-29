import React from 'react';
import {Composition} from 'remotion';
import {Subscribe, subscribeDefaultProps} from './Subscribe';
import {WaitingClock} from './waiting-clock/WaitingClock';
import {calculateClockMetadata, waitingClockPresets} from './waiting-clock/config';
import {
  ChapterDivider,
  delegationDividerDefaultProps,
  routeDividerDefaultProps,
} from './chapter-divider/ChapterDivider';

export {Subscribe, subscribeDefaultProps} from './Subscribe';
export type {SubscribePlacement, SubscribeProps} from './Subscribe';
export {WaitingClock} from './waiting-clock/WaitingClock';
export {waitingClockDefaultProps} from './waiting-clock/config';
export type {WaitingClockPlayback, WaitingClockProps} from './waiting-clock/types';
export {
  ChapterDivider,
  delegationDividerDefaultProps,
  routeDividerDefaultProps,
} from './chapter-divider/ChapterDivider';
export type {ChapterDividerProps, ChapterDividerVariant} from './chapter-divider/types';

const standardCanvas = {
  width: 2560,
  height: 1440,
  fps: 30,
} as const;

export const StandardCompositions: React.FC = () => (
  <>
    {waitingClockPresets.map(({id, props}) => (
      <Composition
        key={id}
        id={id}
        component={WaitingClock}
        {...standardCanvas}
        durationInFrames={300}
        defaultProps={props}
        calculateMetadata={calculateClockMetadata}
      />
    ))}
    <Composition
      id="Standard-Subscribe"
      component={Subscribe}
      {...standardCanvas}
      durationInFrames={150}
      defaultProps={subscribeDefaultProps}
    />
    <Composition
      id="Standard-Chapter-Delegation"
      component={ChapterDivider}
      {...standardCanvas}
      durationInFrames={120}
      defaultProps={delegationDividerDefaultProps}
    />
    <Composition
      id="Standard-Chapter-Route"
      component={ChapterDivider}
      {...standardCanvas}
      durationInFrames={120}
      defaultProps={routeDividerDefaultProps}
    />
  </>
);
