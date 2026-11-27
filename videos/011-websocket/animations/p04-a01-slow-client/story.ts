// Milliseconds from the 13:56.080 CapCut in-point (13:40.080 in the WAV).
export const cue = {
  send: 5640,
  slow: 11120,
  buffer: 17020,
  queue: 20600,
  unbounded: 24120,
  crash: 27920,
  question: 32060,
  retry: 32940,
  neighborCrash: 36680,
  cascade: 37960,
} as const;

export const headlines = [
  {at: 0, title: 'Тысячи открытых соединений'},
  {at: cue.send, title: 'Одна рассылка для всех'},
  {at: cue.slow, title: 'Один клиент отстаёт'},
  {at: cue.buffer, title: 'Данные остаются на сервере'},
  {at: cue.crash, title: 'Процесс упал по памяти'},
  {at: cue.question, title: 'Что делают клиенты?'},
  {at: cue.retry, title: 'Переподключаются к соседу'},
  {at: cue.cascade, title: 'Снова лавина переподключений'},
] as const;
