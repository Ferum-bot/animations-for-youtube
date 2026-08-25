import {Easing, interpolate, spring} from 'remotion';

export type MotionProfile = 'calm' | 'technical' | 'energetic';

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

export const msToFrames = (milliseconds: number, fps: number): number =>
  Math.round((milliseconds / 1000) * fps);

export const framesToMs = (frames: number, fps: number): number =>
  Math.round((frames / fps) * 1000);

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const linearProgress = (
  frame: number,
  startFrame: number,
  endFrame: number,
): number => interpolate(frame, [startFrame, endFrame], [0, 1], clamp);

export const smoothProgress = (
  frame: number,
  startFrame: number,
  endFrame: number,
): number =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

export const springProgress = (
  frame: number,
  startFrame: number,
  fps: number,
): number =>
  spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: {damping: 15, stiffness: 160, mass: 0.7},
  });

export const fadeEnvelope = ({
  frame,
  durationInFrames,
  enterFrames = 10,
  exitFrames = 12,
}: {
  frame: number;
  durationInFrames: number;
  enterFrames?: number;
  exitFrames?: number;
}): number => {
  const lastFrame = Math.max(0, durationInFrames - 1);
  const enterEnd = Math.min(enterFrames, lastFrame);
  const exitStart = Math.max(enterEnd, lastFrame - exitFrames);

  return interpolate(
    frame,
    [0, enterEnd, exitStart, lastFrame],
    [0, 1, 1, 0],
    clamp,
  );
};
