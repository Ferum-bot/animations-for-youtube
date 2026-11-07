// Local milliseconds. CapCut 08:32–10:14; the source WAV starts nine seconds earlier.
export const t = {
  cover: 21500, extraReplica: 30000, split: 33000, separate: 36200,
  parallel: 39600, named: 41400, horizontal: 44800, compare: 50000,
  copy: 52900, combine: 56500,
  routing: 61000, lookup: 69300, transfer: 73200, switchOwner: 75300,
  multiRead: 76700, cassandra: 83000,
  firstWrite: 88500, secondWrite: 96600,
} as const;

export type SceneProps = {readonly timeMs: number};
export type Chat = 42 | 17;
export type Entry = {readonly chat: Chat; readonly body: string};
type Write = Entry & {readonly arrives: number; readonly handled?: number};
export const initial: Readonly<Record<Chat, string>> = {42: 'Завтра у метро', 17: 'Я в кафе'};
// An illustrative burst, not a measured throughput benchmark. handled is the moment of commit.
export const writes: readonly Write[] = [
  {chat: 42, body: 'Я у входа', arrives: -700, handled: 3200},
  {chat: 17, body: 'Беру кофе', arrives: 650, handled: 7900},
  {chat: 42, body: 'Вижу тебя', arrives: 1900, handled: 13600},
  {chat: 17, body: 'Два латте', arrives: 2950, handled: 18700},
  {chat: 42, body: 'Я здесь', arrives: 4050},
  {chat: 17, body: 'У стойки', arrives: 5150},
  {chat: 42, body: 'Подхожу', arrives: 6650},
  {chat: 17, body: 'Уже несу', arrives: 9700},
  {chat: 42, body: 'Привет!', arrives: 15100},
];
export const queued = (timeMs: number) => writes.filter(w =>
  timeMs >= w.arrives && (w.handled === undefined || timeMs < w.handled));
export const latest = (chat: Chat, timeMs: number): string => {
  let value = initial[chat];
  for (const w of writes) if (w.chat === chat && w.handled !== undefined && timeMs >= w.handled) value = w.body;
  return value;
};
export const beforeSplit = (chat: Chat): Entry => ({chat, body: latest(chat, t.split)});
export const waiting = (chat: Chat) => writes.filter(w => w.chat === chat && w.handled === undefined);
export const splitCommit = (index: number) => t.parallel + 1100 + index * 1900;
export const shardRow = (chat: Chat, timeMs: number): Entry => {
  let entry = beforeSplit(chat);
  waiting(chat).forEach((w, index) => {if (timeMs >= splitCommit(index)) entry = w;});
  return entry;
};
