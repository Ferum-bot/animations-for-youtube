// Local milliseconds in the assembled voice track.
export const cue = {
  cluster: 7820, copies: 10150, rf: 12550, request: 18550, receives: 20850,
  fan: 24900, arrives: 26250, ack: 26500, done: 28100, question: 28800,
  driver: 33700, role: 37360, next: 42000, local: 45400, endCard: 48800,
} as const;

export const headings = [
  {at: 0, lines: ['Кто принимает запись', 'в Cassandra?']},
  {at: cue.cluster, lines: ['Где хранится чат 42?']},
  {at: cue.request, lines: ['Запрос пришёл на D']},
  {at: cue.question, lines: ['Кто выбирает узел?']},
  {at: cue.role, lines: ['Координатор', 'на один запрос']},
  {at: cue.local, lines: ['B — координатор', 'и реплика']},
] as const;
