import {clamp01, smoothProgress} from '@channel/motion-core';
import anchors from '../../anchors.json';
import metadata from './animation.json';

export const scene = {
  startMs: anchors['intro-experiment-start'],
  durationMs: metadata.durationMs,
} as const;

type Anchor = keyof typeof anchors;
const cue = (name: Anchor): number => anchors[name] - scene.startMs;

export const timing = {
  service: cue('intro-live-service'),
  cluster: cue('intro-cluster'),
  load: cue('intro-live-load'),
  add: cue('intro-add-node') - 260,
  // Leave a readable four-node state before disconnecting the second node.
  remove: cue('intro-remove-node') + 520,
  question: cue('intro-consequences'),
} as const;

export const progress = (timeMs: number, startMs: number, durationMs: number): number =>
  smoothProgress(timeMs, startMs, startMs + durationMs);
export const mix = (from: number, to: number, amount: number): number => from + (to - from) * amount;

export const geometry = {
  singleLeft: 324,
  singleWidth: 420,
  nodeWidth: 188,
  nodeStep: 224,
  left: 104,
  top: 610,
  singleBottom: 1000,
  clusterBottom: 884,
  inletX: 534,
  inletTop: 440,
  busY: 520,
} as const;

// Enlarge the diagram around its top-left node, independently of editorial copy.
export const diagramLayout = {left: 104, top: 650, scale: 1.4} as const;
export const diagramPoint = (x: number, y: number) => ({
  x: diagramLayout.left + (x - geometry.left) * diagramLayout.scale,
  y: diagramLayout.top + (y - geometry.top) * diagramLayout.scale,
});
export const diagramTransform = `translate(${diagramLayout.left} ${diagramLayout.top}) scale(${diagramLayout.scale}) translate(${-geometry.left} ${-geometry.top})`;

export const records = [
  {key: '042', owner: 0, row: 0},
  {key: '081', owner: 1, row: 0},
  {key: '105', owner: 2, row: 0},
  {key: '218', owner: 0, row: 1},
  {key: '307', owner: 1, row: 1},
  {key: '512', owner: 2, row: 1},
] as const;

export type ExperimentPhase = 'single' | 'partitioning' | 'cluster' | 'load' | 'adding' | 'removing' | 'question';

export const phaseAt = (timeMs: number): ExperimentPhase => {
  if (timeMs >= timing.question) return 'question';
  if (timeMs >= timing.remove) return 'removing';
  if (timeMs >= timing.add) return 'adding';
  if (timeMs >= timing.load) return 'load';
  if (timeMs >= timing.cluster + 1750) return 'cluster';
  if (timeMs >= timing.cluster) return 'partitioning';
  return 'single';
};

export const sampleExperiment = (timeMs: number) => {
  const partition = progress(timeMs, timing.cluster, 1050);
  return {
    timeMs,
    phase: phaseAt(timeMs),
    partition,
    reveal: progress(timeMs, 550, 650),
    live: progress(timeMs, timing.service, 500),
    add: progress(timeMs, timing.add, 550),
    remove: progress(timeMs, timing.remove, 650),
    question: progress(timeMs, timing.question, 500),
  } as const;
};

export type ExperimentState = ReturnType<typeof sampleExperiment>;

export const nodeBounds = (index: number, state: ExperimentState) => {
  const x = geometry.left + index * geometry.nodeStep;
  const clusterShell = progress(state.timeMs, timing.cluster + 1400, 350);
  const singleShell = 1 - progress(state.timeMs, timing.cluster, 240);
  return {
    x: index === 0 ? mix(geometry.singleLeft, x, state.partition) : x,
    width: index === 0 ? mix(geometry.singleWidth, geometry.nodeWidth, state.partition) : geometry.nodeWidth,
    bottom: index === 0 ? mix(geometry.singleBottom, geometry.clusterBottom, state.partition) : geometry.clusterBottom,
    opacity: index === 0 ? singleShell + clusterShell : index === 3 ? state.add : clusterShell,
  } as const;
};

/** One view per record: moving between owners never duplicates the dataset. */
export const recordPosition = (index: number, owner: number, row: number, timeMs: number) => {
  // Compact, spread, then pack: different rows never cross or obscure one another.
  const compact = progress(timeMs, timing.cluster, 400);
  const spread = progress(timeMs, timing.cluster + 420, 450);
  const pack = progress(timeMs, timing.cluster + 900, 520);
  return {
    x: mix(geometry.singleLeft + 28, geometry.left + owner * geometry.nodeStep + 18, spread),
    y: mix(702 + index * 48, 706 + row * 76, pack),
    width: mix(geometry.singleWidth - 56, geometry.nodeWidth - 36, compact),
    prefixOpacity: 1 - progress(timeMs, timing.cluster, 120),
    labelOffset: mix(104, 16, progress(timeMs, timing.cluster + 140, 260)),
  } as const;
};

export const packetProgress = (timeMs: number, startMs: number, durationMs: number): number =>
  clamp01((timeMs - startMs) / durationMs);
