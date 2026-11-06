import type {Highlight} from '../../shared/source-documents/QuoteHighlight';

export const scene = {
  sourceStartMs: 105333.333333,
  capcutStartMs: 109833.333333,
  durationMs: 49866.666667,
  left: 100,
  width: 1166.4,
  entranceMs: 300,
  exitMs: 300,
} as const;

export type Cue = {readonly startMs: number; readonly endMs: number};
export const cues = {
  apache: {startMs: 105500, endMs: 116000},
  authors: {startMs: 116000, endMs: 120500},
  facebook: {startMs: 120500, endMs: 129000},
  dynamo: {startMs: 129000, endMs: 136500},
  inbox: {startMs: 139500, endMs: 155166},
} as const satisfies Record<string, Cue>;

// Original narration milliseconds, checked against local Whisper on Metal.
// Source rectangles refer to the unscaled image (before document placement).
export const highlights = {
  apache: [
    {startMs: 108600, endMs: 111000, fontSize: 98,
      lines: [{text: 'June 2007', x: 346, y: 212, width: 69, height: 18}]},
    {startMs: 111100, endMs: 115700, fontSize: 56, lines: [
      {text: 'Development of Cassandra', x: 20, y: 212, width: 173, height: 18},
      {text: 'started in Facebook in June 2007.', x: 195, y: 212, width: 220, height: 18},
    ]},
  ],
  facebook: [
    {startMs: 122600, endMs: 125000, fontSize: 88,
      lines: [{text: 'Inbox Search', x: 165, y: 143, width: 115, height: 24}]},
    {startMs: 125600, endMs: 128700, fontSize: 66,
      lines: [{text: 'in one of our Hackthons.', x: 273, y: 413, width: 206, height: 24}]},
  ],
  dynamo: [
    {startMs: 131600, endMs: 133700, fontSize: 74,
      lines: [{text: 'Avinash Lakshman', x: 184, y: 229, width: 205, height: 30}]},
    {startMs: 133800, endMs: 136200, fontSize: 54, lines: [
      {text: 'Dynamo: Amazon’s', x: 160, y: 146, width: 332, height: 42},
      {text: 'Highly Available Key-value Store', x: 493, y: 146, width: 578, height: 42},
    ]},
  ],
} as const satisfies Record<string, readonly Highlight[]>;

export const searchTiming = {
  demonstrationMs: 144600,
  typeStartMs: 146600,
  typeEndMs: 147700,
  resultsMs: 148700,
} as const;
