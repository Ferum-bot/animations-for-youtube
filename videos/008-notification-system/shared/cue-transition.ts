import {smoothProgress} from '@channel/motion-core';

/** Deterministic speech-cue transition, including backward seeks. Times are ms. */
export function getCueTransition<Cue extends {readonly startMs: number}>(
  cues: readonly Cue[], timeMs: number,
) {
  const first = cues[0];
  if (!first) throw new Error('A speech-driven scene needs an initial cue');
  let active = first;
  let previous = first;
  for (const cue of cues) {
    if (cue.startMs > timeMs) break;
    previous = active;
    active = cue;
  }
  return {active, previous, mix: smoothProgress(timeMs, active.startMs, active.startMs + 420)};
}

/** Blend field emphasis between adjacent spoken cues without persistent state. */
export function getFieldFocus<Field extends string>(
  cues: readonly {readonly startMs: number; readonly fields: readonly Field[]}[], timeMs: number,
) {
  const {active, previous, mix} = getCueTransition(cues, timeMs);
  return (field: Field) =>
    (previous.fields.includes(field) ? 1 - mix : 0) + (active.fields.includes(field) ? mix : 0);
}

/** Finish removing one SQL panel before revealing the next, keeping text distinct. */
export const getTableTransition = (timeMs: number, startMs: number) => ({
  outgoingOpacity: 1 - smoothProgress(timeMs, startMs, startMs + 280),
  incomingOpacity: smoothProgress(timeMs, startMs + 280, startMs + 600),
});
