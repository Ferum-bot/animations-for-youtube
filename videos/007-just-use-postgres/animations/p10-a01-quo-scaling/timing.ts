import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  layout: 'full', sourceStartMs: 1311500, editedStartMs: sourceToEditedMs(1311500),
  durationMs: 82000, entranceMs: 800, exitStartMs: 81500,
} as const;

/** Recorded speech relative to 22:32 in the edit: nine preceding 4.5 s cards. */
export const cues = {
  product: 4780, sona: 9600, article: 13780, temporal: 19440, voice: 24980,
  history: 29100, writes: 36340, aurora: 39800, scaling: 45040,
  instance: 48300, vacuum: 51740, separate: 53640, ceiling: 57060,
  symptoms: 59560, limit: 64100, cassandra: 70300, nodes: 74040, quote: 76300,
} as const;
export const reveal = (timeMs: number, startMs: number, durationMs = 500): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
export type SceneProps = {readonly timeMs: number};
