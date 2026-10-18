import {smoothProgress, type MotionProfile} from '@channel/motion-core';

type Pacing = {
  readonly leadStartMs: number;
  readonly titleStartMs: number;
  readonly descriptionStartMs: number;
  readonly revealMs: number;
};

const pacing = {
  calm: {leadStartMs: 100, titleStartMs: 240, descriptionStartMs: 540, revealMs: 480},
  technical: {leadStartMs: 70, titleStartMs: 170, descriptionStartMs: 360, revealMs: 360},
  energetic: {leadStartMs: 50, titleStartMs: 120, descriptionStartMs: 260, revealMs: 280},
} as const satisfies Record<MotionProfile, Pacing>;

/** Pure timeline evaluation: any frame can be visited in any order. */
export const getChapterMotion = (
  timeMs: number,
  profile: MotionProfile,
) => {
  const timing = pacing[profile];
  const reveal = (startMs: number) => smoothProgress(timeMs, startMs, startMs + timing.revealMs);

  return {
    number: reveal(timing.leadStartMs),
    lead: reveal(timing.leadStartMs),
    title: reveal(timing.titleStartMs),
    description: reveal(timing.descriptionStartMs),
  };
};
