export type AnycastFocus = 'replication' | 'address' | 'anycast' | 'route' | 'resolved';

export type AnycastPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: AnycastFocus;
};

export const anycastPhases = [
  {
    id: 'replication',
    startMs: 120,
    eyebrow: 'ROOT SERVICE / SCALE',
    title: 'ЭФФЕКТИВНОСТЬ ДАЁТ РЕПЛИКАЦИЯ',
    status: 'SAME ROOT DATA / MANY LOCATIONS',
    accent: 'primary',
    focus: 'replication',
  },
  {
    id: 'address',
    startMs: 5_100,
    eyebrow: 'ONE IDENTITY / MANY LOCATIONS',
    title: 'ОДИН АДРЕС РАБОТАЕТ ВО МНОГИХ ТОЧКАХ',
    status: 'SAME IPv4 + IPv6 / MULTIPLE INSTANCES',
    accent: 'primary',
    focus: 'address',
  },
  {
    id: 'anycast',
    startMs: 6_680,
    eyebrow: 'ANYCAST / SAME ROUTE PREFIX',
    title: 'КАЖДЫЙ ROOT-АДРЕС — ANYCAST',
    status: 'ONE SERVICE ADDRESS / MANY ANNOUNCEMENTS',
    accent: 'signal',
    focus: 'anycast',
  },
  {
    id: 'route',
    startMs: 8_020,
    eyebrow: 'BGP / ROUTING TOPOLOGY',
    title: 'СЕТЬ ВЫБИРАЕТ БЛИЖАЙШУЮ ИНСТАНЦИЮ',
    status: 'NEAREST BY ROUTING / NOT GEOGRAPHY',
    accent: 'signal',
    focus: 'route',
  },
  {
    id: 'resolved',
    startMs: 9_360,
    eyebrow: 'QUERY DELIVERED / LOCAL PATH',
    title: 'ЗАПРОС ОСТАЁТСЯ НА КОРОТКОМ МАРШРУТЕ',
    status: 'RESOLVER → NEAREST ROUTABLE INSTANCE',
    accent: 'success',
    focus: 'resolved',
  },
] as const satisfies readonly AnycastPhase[];

export const anycastSites = [
  {id: 'west', x: 88, y: 206, label: 'SITE / 01'},
  {id: 'north', x: 228, y: 82, label: 'SITE / 02'},
  {id: 'central', x: 286, y: 212, label: 'SITE / 03'},
  {id: 'east', x: 440, y: 128, label: 'SITE / 04'},
  {id: 'south', x: 350, y: 326, label: 'SITE / 05'},
] as const;
