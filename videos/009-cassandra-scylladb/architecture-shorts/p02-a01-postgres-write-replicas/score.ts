export type Chat = 42 | 17;
export type Message = {readonly chat: Chat; readonly body: string};
type Arrival = Message & {readonly arrives: number; readonly commits: number};

export const cue = {
  secondCopy: 10900, split: 14000, separate: 16000, paired: 20600,
  name: 21900, compare: 31000, copy: 35200, combined: 37700, cassandra: 42300, endCard: 46600,
} as const;

export const initial: Record<Chat, string> = {42: 'Завтра у метро', 17: 'Я в кафе'};
export const traffic: readonly Arrival[] = [
  {chat: 42, body: 'Я у входа', arrives: 0, commits: 5300},
  {chat: 17, body: 'Два латте', arrives: 2650, commits: 9450},
  {chat: 17, body: 'У стойки', arrives: 6100, commits: 21200},
  {chat: 42, body: 'Вижу тебя', arrives: 8000, commits: 21200},
  {chat: 17, body: 'Уже несу', arrives: 10400, commits: 25500},
  {chat: 42, body: 'Подхожу', arrives: 12700, commits: 25500},
  {chat: 42, body: 'На месте', arrives: 28100, commits: 30600},
  {chat: 17, body: 'Готово', arrives: 28300, commits: 30600},
];

export function contents(chat: Chat, time: number): Message {
  let body = initial[chat];
  for (const item of traffic) if (item.chat === chat && time >= item.commits) body = item.body;
  return {chat, body};
}
