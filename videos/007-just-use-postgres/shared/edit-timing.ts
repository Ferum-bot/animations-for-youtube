/** Narration boundaries derived from CapCut 1017 insert placements on 2026-10-18. */
export const chapterInsertionsMs = [
  124433, 234967, 360367, 459167, 581600,
  687433, 727067, 1063100, 1230867, 1442433,
] as const;
export const chapterDurationMs = 4500;

/** Positions narration after every preceding divider; does not include crossfade overlap. */
export const sourceToEditedMs = (sourceMs: number): number =>
  sourceMs + chapterInsertionsMs.filter((boundary) => boundary <= sourceMs).length * chapterDurationMs;
