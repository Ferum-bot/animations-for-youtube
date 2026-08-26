export type TrafficSteeringFocus = 'balance' | 'failover' | 'ttl';

export type TrafficSteeringPhase = {
  readonly id: string;
  readonly startMs: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly status: string;
  readonly accent: 'primary' | 'signal' | 'success';
  readonly focus: TrafficSteeringFocus;
};

export const trafficSteeringPhases = [
  {
    id: 'balance',
    startMs: 80,
    eyebrow: 'GLOBAL TRAFFIC / NEAREST ANSWER',
    title: 'DNS НАПРАВЛЯЕТ ПОЛЬЗОВАТЕЛЯ К БЛИЖАЙШЕМУ АДРЕСУ',
    status: 'ROUTING / USER → NEAREST REGION',
    accent: 'success',
    focus: 'balance',
  },
  {
    id: 'failover',
    startMs: 4_220,
    eyebrow: 'FAILOVER / PRIMARY UNREACHABLE',
    title: 'МИЛЛИОНЫ ПОЛЬЗОВАТЕЛЕЙ ПЕРЕКЛЮЧАЮТСЯ НА РЕЗЕРВ',
    status: 'FAILOVER / PRIMARY → BACKUP',
    accent: 'signal',
    focus: 'failover',
  },
  {
    id: 'ttl',
    startMs: 8_460,
    eyebrow: 'SHORT TTL / FAST CHANGE',
    title: 'КОРОТКИЙ TTL УСКОРЯЕТ СМЕНУ МАРШРУТА',
    status: 'DNS / TTL 30 → 0 / NEW ANSWER',
    accent: 'primary',
    focus: 'ttl',
  },
] as const satisfies readonly [TrafficSteeringPhase, ...TrafficSteeringPhase[]];

export const trafficSteeringStage = {
  balance: 0,
  failover: 1,
  ttl: 2,
} as const satisfies Record<TrafficSteeringFocus, number>;

export const trafficRegions = [
  {source: 'EU USERS', primary: 'FRA', backup: 'AMS', detail: '198.51.100.10'},
  {source: 'US USERS', primary: 'IAD', backup: 'ORD', detail: '203.0.113.10'},
  {source: 'APAC USERS', primary: 'SIN', backup: 'NRT', detail: '192.0.2.10'},
] as const;
