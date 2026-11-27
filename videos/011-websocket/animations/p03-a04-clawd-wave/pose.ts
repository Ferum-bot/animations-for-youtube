import {easing, mix, progress} from '@channel/motion-v2';

export const clawdPose = (timeMs: number) => {
  const phase = (from: number, to: number) => progress(timeMs, from, to, easing.transform);
  const travel = (v: number) => v*v*(3-2*v);
  const entered = progress(timeMs,0,1780,travel);
  const leaving = progress(timeMs,4430,6360,travel);
  // Travel and stride share a phase: planted feet settle when the body stops.
  const stride = 2 * Math.PI * (2.6 * entered + 2.6 * leaving);
  const walking = Math.sin(Math.PI * entered) + Math.sin(Math.PI * leaving);
  const lift = phase(1470, 2220) * (1 - phase(3870, 4400));
  const wag = Math.sin(4 * Math.PI * progress(timeMs,2050,3910,v=>v));
  return {
    x: mix(-5.89, 0.03, entered) - 6.17 * leaving,
    bounce: walking * (0.10 - 0.085 * Math.cos(2 * stride)),
    roll: 0.045 * Math.sin(stride) * walking + 0.026 * lift,
    yaw: 0.35 - 0.49 * phase(990, 2050) - 0.28 * phase(4070, 4760),
    lift, wag, stride, walking,
  };
};

export type ClawdPose = ReturnType<typeof clawdPose>;
