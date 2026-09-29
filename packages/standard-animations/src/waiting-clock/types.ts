import type {ThemeId} from '@channel/design-system';
import type {MotionProfile} from '@channel/motion-core';

export type WaitingClockPlayback =
  | {readonly mode: 'overlay'; readonly durationMs: number}
  | {readonly mode: 'loop'};

export type WaitingClockProps = {
  readonly themeId: ThemeId;
  readonly motionProfile: MotionProfile;
  readonly playback: WaitingClockPlayback;
  readonly placement: 'top-left' | 'bottom-left';
  /** Diameter in pixels on the production 2560×1440 canvas. */
  readonly sizePx: number;
};
