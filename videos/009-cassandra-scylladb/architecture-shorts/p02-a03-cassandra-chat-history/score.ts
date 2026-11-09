// Local milliseconds from 10:09.980 in the original WAV.
export const cue = {
  request: 5800, key: 10000, partition: 14540, replicas: 17140,
  history: 20940, latest: 25460, previous: 27400, clustering: 33020,
  clock: 37940, tie: 41280, result: 45060, endCard: 50800,
} as const;

export const headings = [
  {at: 0, lines: ['Как Cassandra находит', 'последние сообщения?']},
  {at: cue.key, lines: ['Ключ партиции', 'chat_id']},
  {at: cue.history, lines: ['Открываем историю', 'чата 42']},
  {at: cue.clustering, lines: ['Порядок внутри чата', 'задаёт clustering key']},
  {at: cue.result, lines: ['Последние два', 'сообщения чата 42']},
] as const;
