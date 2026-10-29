import anchors from '../../anchors.json';
import {smoothProgress} from '@channel/motion-core';
import {getFieldFocus} from '../../shared/cue-transition';
import type {BudgetFocus} from './budget';

export const scene = {
  startMs: anchors['latency-budget-start'],
  audioFile: 'generated/008-notification-system/p03-a05-latency-budget.wav',
};
const cueData = [
  {anchor: 'latency-budget-start', fields: []},
  {anchor: 'latency-budget-goal', fields: ['goal']},
  {anchor: 'latency-budget-ingest', fields: ['ingest']},
  {anchor: 'latency-budget-ingest-note', fields: ['ingest', 'ingestNote']},
  {anchor: 'latency-budget-relay', fields: ['relay']},
  {anchor: 'latency-budget-main-lag', fields: ['mainLag']},
  {anchor: 'latency-budget-orchestrator', fields: ['orchestrator']},
  {anchor: 'latency-budget-channel-lag', fields: ['channelLag']},
  {anchor: 'latency-budget-provider', fields: ['provider']},
  {anchor: 'latency-budget-normal', fields: ['normal']},
  {anchor: 'latency-budget-reserve', fields: ['reserve']},
  {anchor: 'latency-budget-retry', fields: ['reserve', 'retry']},
  {anchor: 'latency-budget-fallback', fields: ['reserve', 'retry', 'fallback']},
] as const satisfies readonly {
  readonly anchor: keyof typeof anchors;
  readonly fields: readonly BudgetFocus[];
}[];
const cues = cueData.map((cue) => ({...cue, startMs: anchors[cue.anchor] - scene.startMs}));

export function getBudgetState(timeMs: number) {
  const noteStart = anchors['latency-budget-provider-observation'] - scene.startMs;
  return {
    focus: getFieldFocus(cues, timeMs),
    // Remove the average example before revealing the author's separate p95 observation.
    earlierNoteOpacity: 1 - smoothProgress(timeMs, noteStart, noteStart + 180),
    laterNoteOpacity: smoothProgress(timeMs, noteStart + 180, noteStart + 420),
  };
}
export type BudgetState = ReturnType<typeof getBudgetState>;
