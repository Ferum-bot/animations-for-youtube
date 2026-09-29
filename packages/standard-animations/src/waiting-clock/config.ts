import type {CalculateMetadataFunction} from 'remotion';
import {msToFrames} from '@channel/motion-core';
import {clockCycleFrames} from './motion';
import type {WaitingClockProps} from './types';

export const waitingClockDefaultProps = {
  themeId: 'paper',
  motionProfile: 'calm',
  playback: {mode: 'overlay', durationMs: 10000},
  placement: 'bottom-left',
  sizePx: 192,
} as const satisfies WaitingClockProps;

export const waitingClockPresets = [
  {id: 'Standard-Waiting-Clock-Light', props: waitingClockDefaultProps},
  {
    id: 'Standard-Waiting-Clock-Dark',
    props: {...waitingClockDefaultProps, themeId: 'graphite'},
  },
  {
    id: 'Standard-Waiting-Clock-Light-Loop',
    props: {...waitingClockDefaultProps, playback: {mode: 'loop'}},
  },
  {
    id: 'Standard-Waiting-Clock-Dark-Loop',
    props: {...waitingClockDefaultProps, themeId: 'graphite', playback: {mode: 'loop'}},
  },
] as const satisfies readonly {readonly id: string; readonly props: WaitingClockProps}[];

export const validateClockProps = ({sizePx, playback}: WaitingClockProps): void => {
  if (!Number.isFinite(sizePx) || sizePx < 96 || sizePx > 320) {
    throw new Error('WaitingClock sizePx must be between 96 and 320 production pixels.');
  }
  if (playback.mode === 'overlay' && (!Number.isFinite(playback.durationMs) || playback.durationMs < 1000)) {
    throw new Error('WaitingClock overlay durationMs must be at least 1000 milliseconds.');
  }
};

export const calculateClockMetadata: CalculateMetadataFunction<WaitingClockProps> = ({props}) => {
  validateClockProps(props);
  const fps = 30;

  return {
    width: 2560,
    height: 1440,
    fps,
    durationInFrames: props.playback.mode === 'loop'
      ? clockCycleFrames(props.motionProfile, fps)
      : msToFrames(props.playback.durationMs, fps),
  };
};
