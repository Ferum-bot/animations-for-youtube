// Source WAV 14:53.000 to 16:40.666667. CapCut adds nine seconds.
export const cue = {
  digest: 5050, dataBack: 5920, digestBack: 7350, compare: 10200, requestFull: 11100, fullBack: 12600,
  reconcile: 16100, lww: 18500, stamps: 22100, winner: 24000, clocks: 26500,
  later: 29600, skewWinner: 32000, behind: 37400, hint: 43000, keep: 45300,
  reconnect: 49400, replay: 50200, delivered: 51700, bestEffort: 55200,
  readRepair: 59100, mismatch: 61600, sendRepair: 63600, fixed: 65200, scope: 67400,
  repair: 70300, ranges: 75200, tree: 79200, compareRoot: 83900, branch: 84700,
  leaf: 85500, stream: 86900, synced: 88400, schedule: 89200, caughtUp: 92400,
  availability: 97100, oneDown: 99300, twoDown: 102800,
} as const;
export type ShotProps = {readonly timeMs: number};
