// Relative to 12:55.760 of the original WAV.
export const cue = {
  send: 4010, wait: 6580, consistency: 8900, threshold: 14050,
  one: 18980, quorum: 20700, all: 23600,
  repeatOne: 25400, outage: 31350, offline: 33380, endCard: 37400,
} as const;

export const levels = [
  {name: 'ONE', required: 1, at: cue.one},
  {name: 'QUORUM', required: 2, at: cue.quorum},
  {name: 'ALL', required: 3, at: cue.all},
] as const;

export function exchangeAt(time: number) {
  if (time >= cue.outage) return {
    send: cue.outage, receipts: {A: cue.outage + 1220, B: cue.outage + 2330, C: Infinity},
  };
  if (time >= cue.repeatOne) return {
    send: cue.repeatOne, receipts: {A: cue.repeatOne + 1500, B: cue.repeatOne + 3100, C: cue.repeatOne + 4490},
  };
  return {send: cue.send, receipts: {A: cue.one + 370, B: cue.quorum + 370, C: cue.all + 370}};
}
