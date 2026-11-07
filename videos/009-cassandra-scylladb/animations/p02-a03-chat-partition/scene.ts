// Local milliseconds from source WAV 10:05.000. The edit has two 4.5-second dividers.
export const cue = {
  fields: 5000, id: 7100, body: 8400, query: 10500, partition: 14400,
  group: 19100, replicas: 22300, history: 25200, latest: 30000, previous: 32300,
  clustering: 36900, time: 42000, tie: 45100, range: 49300,
  postgres: 55300, secondary: 60200, primary: 64400,
  hash: 72000, token: 75000, ring: 76500, boundaries: 80000, locate: 82500,
  consistent: 86700, add: 96100, vnodes: 100100,
  nameVnodes: 103000, go: 106300, cover: 110000,
} as const;
export type ShotProps = {readonly timeMs: number};

export const messages = [
  {id: 108, chat: 42, clock: '18:07:12', body: 'Ты где?'},
  {id: 107, chat: 42, clock: '18:07:12', body: 'На платформе'},
  {id: 106, chat: 42, clock: '18:06:38', body: 'Привет!'},
  {id: 105, chat: 17, clock: '18:06:21', body: 'Уже несу'},
  {id: 104, chat: 42, clock: '18:06:10', body: 'Подхожу'},
  {id: 103, chat: 17, clock: '18:05:47', body: 'У стойки'},
] as const;
export const history = messages.filter(row => row.chat === 42);
