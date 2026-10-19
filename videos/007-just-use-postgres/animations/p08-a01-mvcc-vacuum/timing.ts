import {smoothProgress} from '@channel/motion-core';
import {sourceToEditedMs} from '../../shared/edit-timing';

export const timing = {
  sourceStartMs: 747500, editedStartMs: sourceToEditedMs(747500),
  durationMs: 315600, entranceMs: 600, expandStartMs: 39600, expandEndMs: 41000,
  exitStartMs: 315000,
} as const;
export const cues = {
  mvcc: 36900, update: 50360, delete: 58860, vacuum: 62200, horizon: 69720,
  cycle: 77920, rate: 93640, query: 101320, explain: 114120,
  tree: 118760, scan: 134440, check: 145220, healthy: 151060, blocked: 155860,
  blockers: 176660, dump: 183360, external: 195920, idle: 200200, replica: 202980,
  bench: 211400, healthyBench: 221600, blockedBench: 227500, growth: 235960,
  latency: 239400, reset: 244680, spiral: 253700,
  trigger: 268140, cpu: 276060, graphile: 283580, log: 291060,
  attempts: 299640, failover: 310440,
} as const;
export const reveal = (timeMs: number, at: number, durationMs = 500): number =>
  smoothProgress(timeMs, at, at + durationMs);
export type SceneProps = {readonly timeMs: number};
