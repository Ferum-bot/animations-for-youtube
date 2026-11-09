// Local time after joining two passages from the source WAV.
export const cue = {
  group: 4580, hash: 10540, token: 12400, ring: 14240, ranges: 17500,
  locate: 20040, name: 24080, add: 33600, secondRange: 37440, vnodes: 40500,
  endCard: 43200,
} as const;

export const titles = [
  {at: 0, lines: ['В Cassandra добавили', 'сервер. Что переедет?']},
  {at: cue.hash, lines: ['Где хранится чат 42?']},
  {at: cue.name, lines: ['Consistent hashing']},
  {at: cue.add, lines: ['Добавляем узел D']},
  {at: cue.secondRange, lines: ['Два диапазона', 'на одном сервере']},
  {at: cue.vnodes, lines: ['Виртуальные узлы', '(vnodes)']},
] as const;
