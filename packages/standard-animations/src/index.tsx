import React from 'react';
import {Composition} from 'remotion';
import {Subscribe, subscribeDefaultProps} from './Subscribe';
import {
  ChapterDivider,
  delegationDividerDefaultProps,
  routeDividerDefaultProps,
} from './chapter-divider/ChapterDivider';

export {Subscribe, subscribeDefaultProps} from './Subscribe';
export type {SubscribePlacement, SubscribeProps} from './Subscribe';
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
