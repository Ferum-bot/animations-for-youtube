import React from 'react';
import {Composition} from 'remotion';
import {Subscribe, subscribeDefaultProps} from './Subscribe';

export {Subscribe, subscribeDefaultProps} from './Subscribe';
export type {SubscribeProps} from './Subscribe';

export const StandardCompositions: React.FC = () => (
  <Composition
    id="Standard-Subscribe"
    component={Subscribe}
    width={2560}
    height={1440}
    fps={30}
    durationInFrames={150}
    defaultProps={subscribeDefaultProps}
  />
);
