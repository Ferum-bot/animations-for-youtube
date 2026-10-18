import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  layout: 'full', sourceStartMs: 709000, editedStartMs: sourceToEditedMs(709000),
  durationMs: 18000, entranceMs: 900, exitStartMs: 17400,
} as const;
export const cues = {
  orderMs: 3420, jobMs: 5050, cacheMs: 6750, searchMs: 8180,
  outcomesMs: 10360, gapMs: 12640, databaseCommitMs: 13300, deliveryFailureMs: 15100,
} as const;
export const reveal = (timeMs: number, at: number, durationMs = 350): number =>
  smoothProgress(timeMs, at, at + durationMs);
