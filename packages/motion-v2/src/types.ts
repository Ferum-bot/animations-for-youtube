import type {MotionProfile} from '@channel/motion-core';
import type {ThemeId} from '@channel/theme';

export type ChapterTitle = {
  readonly number: string;
  readonly lines: readonly [string, string];
  readonly fontSizes: readonly [number, number];
};

export type ChapterDividerProps = {
  readonly themeId?: ThemeId;
  readonly motionProfile?: MotionProfile;
};

/** Source coordinates, before scaling or scrolling. */
export type SourceRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
