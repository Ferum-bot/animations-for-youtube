export const scene = {
  durationMs: 26200,
  sourceStartMs: 353500,
  capcutStartMs: 358000,
} as const;

export const timing = {
  paper: 3400,
  results: 4400,
  scrollResults: 4800,
  selectScale: 5550,
  focusScale: 6000,
  coasts: 8200,
  latency: 11000,
  focusLatency: 11600,
  expand: 15000,
  announcement: 15733.333333,
  scrollAnnouncement: 17100,
  selectSla: 18000,
  focusSla: 18500,
  resolved: 22080,
  found: 23200,
  exit: 25650,
} as const;

export type SceneProps = {readonly timeMs: number};
export const asset = (name: string): string => `assets/009-cassandra-scylladb/p01-launch/${name}`;
