import { timing } from "./model";

export type Point = readonly [number, number];
export type AttentionTarget =
  | "coordinator"
  | "router1"
  | "router2"
  | "oldOwners"
  | "newOwner"
  | "queue1"
  | "queue2";

type FocusFrame = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly enlargement: number;
  readonly offset: Point;
};

/** Includes the role/name above each component, not just its body. */
export const focusFrames = {
  coordinator: {
    x: 144,
    y: 478,
    width: 430,
    height: 333,
    enlargement: 0.3,
    offset: [40, 0],
  },
  router1: {
    x: 910,
    y: 389,
    width: 492,
    height: 262,
    enlargement: 0.3,
    offset: [0, 0],
  },
  router2: {
    x: 910,
    y: 744,
    width: 492,
    height: 262,
    enlargement: 0.3,
    offset: [0, 0],
  },
  oldOwners: {
    x: 1860,
    y: 349,
    width: 462,
    height: 322,
    enlargement: 0.25,
    offset: [-40, 0],
  },
  newOwner: {
    x: 1860,
    y: 789,
    width: 462,
    height: 322,
    enlargement: 0.25,
    offset: [-40, 15],
  },
  queue1: {
    x: 144,
    y: 1250,
    width: 1030,
    height: 88,
    enlargement: 0.015,
    offset: [0, 0],
  },
  queue2: {
    x: 1360,
    y: 1250,
    width: 1030,
    height: 88,
    enlargement: 0.015,
    offset: [0, 0],
  },
} as const satisfies Record<AttentionTarget, FocusFrame>;

type AttentionCue = { readonly at: number; readonly target: AttentionTarget };
const cues: readonly AttentionCue[] = [
  { at: timing.coordinator, target: "coordinator" },
  { at: timing.prepare, target: "router1" },
  { at: timing.prepared2 - 800, target: "router2" },
  { at: timing.barrier, target: "queue1" },
  { at: timing.barrier + 4300, target: "queue2" },
  { at: timing.migrate, target: "router1" },
  { at: timing.copyStart - 1400, target: "oldOwners" },
  { at: timing.copyStart + 700, target: "router1" },
  { at: timing.importStart + 600, target: "newOwner" },
  { at: timing.commit, target: "coordinator" },
  { at: timing.commit1 - 750, target: "router1" },
  { at: timing.wait, target: "router2" },
  { at: timing.cleanup, target: "router1" },
  { at: timing.evict - 650, target: "oldOwners" },
  { at: timing.resolved, target: "newOwner" },
];

const smooth = (value: number): number => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** One sustained focus, with a smooth handoff; there is no repeating pulse. */
export const focusAt = (timeMs: number, target: AttentionTarget): number => {
  let previous: AttentionTarget | undefined;
  let current: AttentionCue | undefined;
  for (const cue of cues) {
    if (cue.at > timeMs) break;
    previous = current?.target;
    current = cue;
  }
  if (!current) return 0;
  const entered = smooth((timeMs - current.at) / 600);
  return (
    (current.target === target ? entered : 0) +
    (previous === target ? 1 - entered : 0)
  );
};

/** A slight inward shift makes room for the larger participant. */
export const focusTransformAt = (timeMs: number, target: AttentionTarget) => {
  const { x, y, width, height, enlargement, offset } = focusFrames[target];
  const focus = focusAt(timeMs, target);
  return {
    cx: x + width / 2,
    cy: y + height / 2,
    scale: 1 + focus * enlargement,
    dx: offset[0] * focus,
    dy: offset[1] * focus,
  };
};

/** Connections use precisely the same transform as their participant. */
export const focusedPoint = (
  point: Point,
  target: AttentionTarget,
  timeMs: number,
): Point => {
  const { cx, cy, scale, dx, dy } = focusTransformAt(timeMs, target);
  return [cx + (point[0] - cx) * scale + dx, cy + (point[1] - cy) * scale + dy];
};

type ChangeEvent = AttentionCue & {
  readonly tone: "primary" | "signal" | "success";
};
const changes: readonly ChangeEvent[] = [
  { at: timing.prepare, target: "coordinator", tone: "primary" },
  { at: timing.prepared1, target: "router1", tone: "signal" },
  { at: timing.prepared2, target: "router2", tone: "signal" },
  { at: timing.barrier + 650, target: "queue1", tone: "signal" },
  { at: timing.barrier + 4950, target: "queue2", tone: "signal" },
  { at: timing.importArrive, target: "newOwner", tone: "success" },
  { at: timing.copyDone, target: "newOwner", tone: "success" },
  { at: timing.commit1, target: "router1", tone: "success" },
  { at: timing.commit1 + 700, target: "queue1", tone: "success" },
  { at: timing.commit2, target: "router2", tone: "success" },
  { at: timing.commit2 + 700, target: "queue2", tone: "success" },
  { at: timing.evict, target: "oldOwners", tone: "signal" },
];

export const changeAt = (
  timeMs: number,
  target: AttentionTarget,
): { readonly amount: number; readonly tone: ChangeEvent["tone"] } => {
  let event: ChangeEvent | undefined;
  for (const change of changes) {
    if (change.target === target && change.at <= timeMs) event = change;
  }
  if (!event) return { amount: 0, tone: "primary" };
  const elapsed = timeMs - event.at;
  return {
    amount: smooth(elapsed / 120) * (1 - smooth((elapsed - 300) / 800)),
    tone: event.tone,
  };
};
