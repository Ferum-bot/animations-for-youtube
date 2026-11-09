// Milliseconds from 07:33.300 in the source WAV.
export const cue = {
  firstWrite: 2000, firstShip: 3330, firstReplay: 5350, read: 7450,
  async: 14200, asyncEdit: 16000, asyncOk: 17800, staleRead: 19500, diskLost: 27200,
  sync: 32700, retry: 33700, ship: 34600, flush: 37300, ack: 38000,
  primaryAck: 39500, syncOk: 40700, compare: 43600, replay: 46900, endCard: 49200,
} as const;

export const headings = [
  {at: 0, lines: ['Postgres ответил OK.', 'Что на реплике?']},
  {at: cue.async, lines: ['Асинхронная запись']},
  {at: cue.diskLost, lines: ['Диск primary потерян']},
  {at: cue.sync, lines: ['Синхронная запись']},
  {at: cue.compare, lines: ['Когда читатель', 'увидит правку?']},
] as const;
