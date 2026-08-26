type TimedPhase = {
  readonly startMs: number;
};

export const getActiveTimedPhaseIndex = <Phase extends TimedPhase>(
  phases: readonly Phase[],
  elapsedMs: number,
): number => {
  for (let index = phases.length - 1; index >= 0; index -= 1) {
    const phase = phases[index];
    if (phase && elapsedMs >= phase.startMs) return index;
  }

  return 0;
};
