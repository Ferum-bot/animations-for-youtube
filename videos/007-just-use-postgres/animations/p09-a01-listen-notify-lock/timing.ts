import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  sourceStartMs: 1078000,
  editedStartMs: sourceToEditedMs(1078000),
  durationMs: 152867,
  entranceMs: 800,
  compactStartMs: 138800,
  compactEndMs: 140000,
  exitStartMs: 152200,
} as const;

// Recorded narration, relative to 18:34 in the edit (+36 s of chapter cards).
export const cues = {
  pending: 7020, queue: 11700, ordering: 17680, lock: 24800,
  source: 32480, contention: 38880, benchmarkSetup: 50480,
  oneClient: 65600, manyClients: 70580, groupCommit: 76320,
  notifyFlat: 77900, latency: 80040, sessions: 84020,
  recall: 90140, incidents: 104280, symptoms: 109180,
  log: 119120, ownLog: 122720, identity: 124720,
  fix: 129940, application: 133640, docs: 138400,
  pg19: 144820, retainedLock: 148020,
} as const;

export const reveal = (timeMs: number, startMs: number, durationMs = 450): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
export type SceneProps = {readonly timeMs: number; readonly compact: number};
